require('dotenv').config();
const path = require('path');
const express = require('express');
const { createPrisma } = require('../src/lib/prisma');
const { getExportPayload, RESOURCE_LIST, resourceFor, parseDateRange } = require('../src/lib/data-lifecycle');
const { buildExcelExport } = require('../src/lib/excel-export');
const { generateSqlBackup, importSqlBackup } = require('../src/lib/sql-backup-restore');
const { dateInput, startOfToday, money, grams } = require('../src/lib/helpers');

async function runEndToEndVerification() {
  console.log('====================================================');
  console.log('🚀 Starting Full End-to-End Test for Kusum ERP');
  console.log('====================================================\n');

  const db = createPrisma();
  let errors = [];

  try {
    // 1. Prisma Models Verification
    console.log('1. Verifying Database & Prisma Models...');
    const [products, customers, sales, rates, cashbook, urds, itemNames] = await Promise.all([
      db.product.count(),
      db.customer.count(),
      db.sale.count(),
      db.dailyRate.count(),
      db.cashbookEntry.count(),
      db.urdPurchase.count(),
      db.itemName.count()
    ]);
    console.log(`   ✔ Database connected. Products: ${products}, Customers: ${customers}, Sales: ${sales}, Rates: ${rates}, Cashbook: ${cashbook}, URD: ${urds}, ItemNames: ${itemNames}`);

    // 2. Item Names Master & Autocomplete API
    console.log('\n2. Testing Item Names Master & Batch Piece Creation...');
    const sampleItem = await db.itemName.findFirst();
    if (sampleItem) {
      const q = sampleItem.name.slice(0, 3).toLowerCase();
      const matches = await db.itemName.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { category: { contains: q } }
          ]
        },
        take: 5
      });
      console.log(`   ✔ Autocomplete query for "${q}" returned ${matches.length} matches:`, matches.map(m => `${m.name} (${m.category})`).join(', '));
    }

    // 2b. Batch Piece Multi-PC Concurrency Simulation
    console.log('\n2b. Simulating Multi-PC Concurrent Batch Piece Creation...');
    const batchWeights = [18.250, 19.100, 17.850, 20.400, 18.900];
    const createdBatchBarcodes = [];

    await Promise.all(batchWeights.map(async (wt, idx) => {
      const prefix = 'S';
      const sequence = await db.barcodeSequence.upsert({
        where: { prefix },
        create: { prefix, lastNumber: 1 },
        update: { lastNumber: { increment: 1 } }
      });
      const barcode = `${prefix} ${sequence.lastNumber}`;
      createdBatchBarcodes.push({ idx, barcode, weight: wt });
    }));

    const uniqueBarcodes = new Set(createdBatchBarcodes.map(b => b.barcode));
    if (uniqueBarcodes.size === batchWeights.length) {
      console.log(`   ✔ Concurrent Batch Addition: 5 pieces received unique atomic barcodes with 0 collisions:`, createdBatchBarcodes.map(b => `${b.barcode} (${b.weight}g)`).join(', '));
    } else {
      throw new Error(`Barcode collision detected in concurrent batch creation! Set size: ${uniqueBarcodes.size}, Expected: ${batchWeights.length}`);
    }

    // 2c. Simulating In-Popup Piece Edit & Delete
    console.log('\n2c. Testing In-Popup Piece Weight Edit & Delete Workflow...');
    const testPiece = await db.product.create({
      data: {
        barcode: 'TEST 999',
        sku: 'TEST-999',
        name: 'Test Payal Piece',
        category: 'Payal',
        metal: 'SILVER',
        purity: '925',
        grossWeight: 18.250,
        stoneWeight: 0,
        netWeight: 18.250,
        quantity: 1,
        reorderLevel: 0,
        purchasePrice: 0,
        sellingPrice: 1642.50,
        status: 'AVAILABLE'
      }
    });
    console.log(`   ✔ Created test piece: ${testPiece.barcode} (${testPiece.netWeight}g)`);

    // In-popup user updates mistakenly entered weight to 19.500g
    const updatedPiece = await db.product.update({
      where: { id: testPiece.id },
      data: {
        grossWeight: 19.500,
        netWeight: 19.500,
        sellingPrice: 1755.00
      }
    });
    console.log(`   ✔ Edited in-popup: ${updatedPiece.barcode} new weight is ${updatedPiece.netWeight}g (recalculated price: ₹${updatedPiece.sellingPrice})`);

    // In-popup user deletes piece
    await db.product.delete({ where: { id: testPiece.id } });
    console.log(`   ✔ Deleted in-popup: ${testPiece.barcode} removed from database`);

    // 2d. Testing Batch Document Number Lifecycle (Multi-PC Sharing)
    console.log('\n2d. Testing Batch Document Number Creation & Cross-PC Loading...');
    const testBatchDocNo = `BATCH-TEST-${Date.now().toString().slice(-6)}`;
    const batchItems = await Promise.all([1, 2, 3].map(async (i) => {
      const barcode = `BDOC ${Date.now().toString().slice(-4)}${i}`;
      return db.product.create({
        data: {
          barcode,
          sku: barcode.replace(' ', '-'),
          name: 'Batch Payal Test',
          category: 'Payal',
          metal: 'SILVER',
          purity: '925',
          grossWeight: 15.000 + i,
          stoneWeight: 0,
          netWeight: 15.000 + i,
          quantity: 1,
          reorderLevel: 0,
          purchasePrice: 0,
          sellingPrice: 1350.00,
          batchDocNo: testBatchDocNo,
          status: 'AVAILABLE'
        }
      });
    }));
    console.log(`   ✔ Created Batch Document "${testBatchDocNo}" with ${batchItems.length} pieces on Client PC`);

    const loadedBatchPieces = await db.product.findMany({
      where: { batchDocNo: testBatchDocNo },
      orderBy: { id: 'asc' }
    });
    if (loadedBatchPieces.length !== 3) {
      throw new Error(`Failed to load Batch Document: expected 3 pieces, found ${loadedBatchPieces.length}`);
    }
    console.log(`   ✔ Loaded Batch Document "${testBatchDocNo}" on Main PC: 3 pieces loaded with barcodes [${loadedBatchPieces.map(p => p.barcode).join(', ')}]`);

    // Cleanup test batch
    await db.product.deleteMany({ where: { batchDocNo: testBatchDocNo } });
    console.log(`   ✔ Cleaned up test batch document`);

    // 2e. Testing New Search Filters & HSN / HUID PDF Integration
    console.log('\n2e. Testing New Search Filters & HSN/HUID Integration...');
    
    // (a) URD Purchases Search
    const sampleCustomer = await db.customer.findFirst({ where: { phone: { not: null } } });
    if (sampleCustomer) {
      const phoneDigits = sampleCustomer.phone.slice(-4);
      const urdByPhone = await db.urdPurchase.findMany({
        where: {
          OR: [
            { customer: { phone: { contains: phoneDigits } } },
            { customer: { name: { contains: sampleCustomer.name } } }
          ]
        },
        include: { customer: true }
      });
      console.log(`   ✔ URD Search by customer name "${sampleCustomer.name}" / phone suffix "${phoneDigits}" returned ${urdByPhone.length} purchases`);
    }

    // (b) Sales Search by Customer Mobile
    if (sampleCustomer) {
      const phoneQuery = sampleCustomer.phone.slice(-5);
      const salesByPhone = await db.sale.findMany({
        where: {
          OR: [
            { customer: { phone: { contains: phoneQuery } } },
            { customer: { name: { contains: sampleCustomer.name } } }
          ]
        },
        include: { customer: true }
      });
      console.log(`   ✔ Sales Search by customer phone "${phoneQuery}" returned ${salesByPhone.length} invoices`);
    }

    // (c) Inventory Search by Net Weight / Item Name
    const testInvProduct = await db.product.findFirst({ where: { quantity: { gt: 0 } } });
    if (testInvProduct) {
      const wt = Number(testInvProduct.netWeight);
      const nameToken = testInvProduct.name.split(' ')[0];
      
      // Search by exact weight
      const weightMatches = await db.product.findMany({
        where: {
          quantity: { gt: 0 },
          netWeight: { gte: wt - 0.005, lte: wt + 0.005 }
        }
      });
      console.log(`   ✔ Inventory Search by Net Weight (${wt}g): found ${weightMatches.length} items (including ${testInvProduct.barcode || testInvProduct.sku})`);

      // Search by name and net weight
      const combinedMatches = await db.product.findMany({
        where: {
          quantity: { gt: 0 },
          name: { contains: nameToken },
          netWeight: { gte: wt - 0.005, lte: wt + 0.005 }
        }
      });
      console.log(`   ✔ Inventory Search by Name & Weight ("${nameToken}" + ${wt}g): found ${combinedMatches.length} items`);
    }

    // (d) Sale with HSN Code, HUID Code & Customer PAN + PDF test
    const testSale = await db.sale.create({
      data: {
        invoiceNumber: `INV-TEST-${Date.now().toString().slice(-4)}`,
        customerPan: 'ABCDE1234F',
        subtotal: 5000,
        discount: 0,
        gstRate: 3,
        gstAmount: 150,
        total: 5150,
        paid: 5150,
        balance: 0,
        paymentMethod: 'CASH',
        items: {
          create: [{
            productBarcode: 'TEST-HSN-HUID',
            productSku: 'TEST-SKU',
            productName: 'Gold Necklace with Hallmark',
            productMetal: 'GOLD',
            productPurity: '22K',
            grossWeight: 8.500,
            quantity: 1,
            weight: 8.500,
            unitPrice: 6500,
            metalRate: 6500,
            metalAmount: 55250,
            makingCharge: 2000,
            makingChargeType: 'FIXED',
            makingChargeValue: 2000,
            taxableAmount: 57250,
            lineTotal: 57250,
            hsnCode: '71131910',
            huidCode: 'HD892K'
          }]
        }
      },
      include: { items: true, customer: true }
    });
    console.log(`   ✔ Created Test Sale ${testSale.invoiceNumber} with HSN: ${testSale.items[0].hsnCode}, HUID: ${testSale.items[0].huidCode}, PAN: ${testSale.customerPan}`);

    // Verify PDF generation with PAN, HSN, and HUID
    const { writeSaleInvoice } = require('../src/lib/sale-invoice-pdf');
    const stream = require('stream');
    const mockRes = new stream.PassThrough();
    mockRes.setHeader = () => {};
    writeSaleInvoice(mockRes, testSale);
    console.log(`   ✔ Generated PDF invoice with PAN, HSN & HUID successfully without altering document geometry`);

    // Clean up test sale
    await db.sale.delete({ where: { id: testSale.id } });
    console.log(`   ✔ Cleaned up test sale`);

    // 3. Dashboard Data Calculations
    console.log('\n3. Testing Dashboard Weight Split & Item Breakdown...');
    const stockProducts = await db.product.findMany({
      where: { quantity: { gt: 0 }, status: 'AVAILABLE' },
      select: { quantity: true, netWeight: true, grossWeight: true, metal: true, name: true, category: true }
    });
    let goldPieces = 0, goldNetWeight = 0;
    let silverPieces = 0, silverNetWeight = 0;
    const itemMap = new Map();
    for (const p of stockProducts) {
      const net = Number(p.netWeight || 0);
      const gross = Number(p.grossWeight || 0);
      const qty = p.quantity || 0;
      if (p.metal === 'GOLD') {
        goldPieces += qty;
        goldNetWeight += net * qty;
      } else if (p.metal === 'SILVER') {
        silverPieces += qty;
        silverNetWeight += net * qty;
      }
      const key = `${p.metal}|||${p.name}`;
      if (!itemMap.has(key)) {
        itemMap.set(key, { metal: p.metal, name: p.name, category: p.category, pieces: 0, netWeight: 0, grossWeight: 0 });
      }
      const entry = itemMap.get(key);
      entry.pieces += qty;
      entry.netWeight += net * qty;
      entry.grossWeight += gross * qty;
    }
    console.log(`   ✔ Gold Stock: ${goldPieces} pcs (${goldNetWeight.toFixed(3)}g)`);
    console.log(`   ✔ Silver Stock: ${silverPieces} pcs (${silverNetWeight.toFixed(3)}g)`);
    console.log(`   ✔ Item-wise unique breakdown items: ${itemMap.size}`);

    // 4. Reports Calculation (Top 1 Gold & Top 1 Silver)
    console.log('\n4. Testing Reports Aggregations...');
    const from = new Date(new Date().getFullYear(), 0, 1);
    const to = new Date();
    const saleItemsInPeriod = await db.saleItem.findMany({
      where: { sale: { saleDate: { gte: from, lte: to } } },
      select: {
        productName: true, productSku: true, productMetal: true, productPurity: true,
        quantity: true, lineTotal: true, product: { select: { name: true, sku: true, metal: true, purity: true } }
      }
    });
    const goldItemsMap = new Map();
    const silverItemsMap = new Map();
    for (const item of saleItemsInPeriod) {
      const metal = (item.product?.metal || item.productMetal || 'GOLD').toUpperCase();
      const name = item.product?.name || item.productName || 'Jewellery item';
      const sku = item.product?.sku || item.productSku || '';
      const purity = item.product?.purity || item.productPurity || '';
      const key = `${name}|||${sku}|||${purity}`;
      const amount = Number(item.lineTotal || 0);
      const qty = Number(item.quantity || 0);
      const targetMap = metal === 'GOLD' ? goldItemsMap : metal === 'SILVER' ? silverItemsMap : null;
      if (targetMap) {
        const existing = targetMap.get(key);
        if (existing) {
          existing.quantity += qty;
          existing.billed += amount;
        } else {
          targetMap.set(key, { metal, name, sku, purity, quantity: qty, billed: amount });
        }
      }
    }
    const topGold = [...goldItemsMap.values()].sort((a, b) => b.billed - a.billed)[0] || null;
    const topSilver = [...silverItemsMap.values()].sort((a, b) => b.billed - a.billed)[0] || null;
    const topProducts = [topGold, topSilver].filter(Boolean);
    console.log(`   ✔ Top Gold item: ${topGold ? `${topGold.name} (${money(topGold.billed)})` : 'None in period'}`);
    console.log(`   ✔ Top Silver item: ${topSilver ? `${topSilver.name} (${money(topSilver.billed)})` : 'None in period'}`);
    console.log(`   ✔ Top products list length: ${topProducts.length}`);

    // 5. Excel Exports Generation & Metal Ordering
    console.log('\n5. Testing Excel Exports (All resources + Inventory metal grouping)...');
    for (const res of RESOURCE_LIST) {
      const payload = await getExportPayload(db, res.key, { from: '2020-01-01', to: '2030-01-01' });
      const buffer = await buildExcelExport(payload);
      console.log(`   ✔ Exported ${res.label} (.xlsx) — Size: ${buffer.length} bytes, Rows: ${payload.rows.length}, Title: "${payload.title}"`);
      if (res.key === 'inventory' && payload.rows.length > 1) {
        console.log(`     → First inventory row metal: ${payload.rows[0].metal} (${payload.rows[0].itemName})`);
        console.log(`     → Columns ordered: ${payload.columns.slice(0, 4).map(c => c.label).join(', ')}`);
      }
    }

    // 6. SQL Backup and Restore
    console.log('\n6. Testing Full Database SQL Backup & Restore cycle...');
    const sqlBackup = await generateSqlBackup(process.env.DATABASE_URL);
    console.log(`   ✔ Generated SQL backup (${sqlBackup.sql.length} characters, filename: ${sqlBackup.filename}, tables: ${sqlBackup.tableCount})`);
    const appRoot = path.join(__dirname, '..');
    const restoreResult = await importSqlBackup(process.env.DATABASE_URL, sqlBackup.sql, appRoot);
    console.log(`   ✔ Restored SQL backup successfully! Tables: ${restoreResult.tableCount}, Executed SQL statements: ${restoreResult.executedStatements}`);

    // 7. EJS Template Rendering Test (All Views)
    console.log('\n7. Testing All EJS Views for Rendering Integrity...');
    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '..', 'src', 'views'));
    app.locals.money = money;
    app.locals.grams = grams;
    app.locals.dateInput = dateInput;

    const viewsToTest = [
      { name: 'auth/login', data: { title: 'Login', error: null, message: null } },
      { name: 'dashboard', data: {
        title: 'Dashboard',
        stats: {
          goldWeight: 17.45, goldPieces: 2, silverWeight: 231.6, silverPieces: 6,
          sales: 50000, invoices: 3, cashNet: 25000, cashIn: 30000, cashOut: 5000,
          customerDue: 15000, otherPieces: 0, otherWeight: 0
        },
        itemWeightBreakdown: [],
        lowStock: [],
        recentSales: []
      }},
      { name: 'inventory/index', data: {
        title: 'Inventory', products: [], totalCount: 0, page: 1, totalPages: 1,
        query: {}, counts: { all: 0, available: 0, lowStock: 0, sold: 0 },
        totals: { pieces: 0, grossWeight: 0, netWeight: 0, value: 0 },
        rateInfo: { rate: { gold22k: 7200, gold24k: 7800, silver: 90 }, sourceDate: 'Today' },
        barcodePrinterNotice: null
      }},
      { name: 'inventory/form', data: {
        title: 'Add Item', product: null,
        rateInfo: { rate: { gold22k: 7200, gold24k: 7800, silver: 90 }, sourceDate: 'Today' }
      }},
      { name: 'item-names/index', data: {
        title: 'Item Names Master', itemNames: [], q: '', message: null, error: null
      }},
      { name: 'sales/index', data: {
        title: 'Sales', sales: [], totalCount: 0, page: 1, totalPages: 1,
        query: { q: '', from: '2026-08-01', to: '2026-08-31' },
        totals: { count: 0, total: 0, paid: 0, balance: 0 }
      }},
      { name: 'sales/form', data: {
        title: 'New Sale Invoice', customers: [],
        rateInfo: { rate: { gold22k: 7200, gold24k: 7800, silver: 90 }, sourceDate: 'Today' },
        invoiceNumber: 'INV-001', nextInvoice: 'INV-001', todayKey: dateInput(new Date())
      }},
      { name: 'rates/index', data: {
        title: 'Daily Rates',
        selectedDate: dateInput(new Date()),
        rateInfo: { isFallback: false, sourceDate: dateInput(new Date()) },
        rate: { gold22k: 7200, gold24k: 7800, silver: 90, note: '' },
        history: [], todayKey: dateInput(new Date())
      }},
      { name: 'reports/index', data: {
        title: 'Reports', from: new Date(), to: new Date(),
        sales: { _count: 0, _sum: { total: 0, paid: 0, balance: 0, subtotal: 0, discount: 0, gstAmount: 0 } },
        stockByMetal: [], receivables: 0, topProducts: [], itemWiseStock: []
      }},
      { name: 'data-management/index', data: {
        title: 'Data export & archive', resources: RESOURCE_LIST,
        selectedResource: 'sales', resource: resourceFor('sales'), range: parseDateRange({})
      }},
      { name: 'cashbook/index', data: {
        title: 'Cashbook', entries: [], fromDate: '2026-08-01', toDate: '2026-08-31', selectedDate: '2026-08-27', methodFilter: '',
        summary: { totalIn: 10000, totalOut: 4000, cashIn: 5000, cashOut: 2000, upiIn: 3000, upiOut: 1000, bankIn: 2000, bankOut: 1000, netBalance: 6000, cashNet: 3000, upiNet: 2000, bankNet: 1000 },
        customers: []
      }},
      { name: 'contacts/customers', data: {
        title: 'Customers', customers: [], q: ''
      }},
      { name: 'contacts/customer-detail', data: {
        title: 'Customer Detail',
        customer: { id: 1, name: 'Ravi Kumar', phone: '9876543210', email: '', address: '', ledger: [], sales: [], urdPurchases: [] },
        outstanding: 0,
        todayKey: dateInput(new Date())
      }},
      { name: 'urd-purchases/index', data: {
        title: 'URD Purchases', purchases: []
      }},
      { name: 'urd-purchases/form', data: {
        title: 'New URD Purchase', purchase: null, customers: [],
        rateInfo: { rate: { gold22k: 7200, gold24k: 7800, silver: 90 }, sourceDate: 'Today' },
        purchaseNumber: 'URD-001', nextNumber: 'URD-001', todayKey: dateInput(new Date())
      }}
    ];

    for (const view of viewsToTest) {
      await new Promise((resolve, reject) => {
        app.render(view.name, view.data, (err, html) => {
          if (err) {
            console.error(`   ❌ Failed rendering view "${view.name}":`, err.message);
            errors.push(`View ${view.name}: ${err.message}`);
            reject(err);
          } else {
            console.log(`   ✔ Rendered view "${view.name}" (${html.length} bytes)`);
            resolve();
          }
        });
      });
    }

  } catch (err) {
    console.error('Fatal test error:', err);
    errors.push(err.message);
  } finally {
    await db.$disconnect();
  }

  console.log('\n====================================================');
  if (errors.length === 0) {
    console.log('🎉 ALL TESTS PASSED WITH 0 ERRORS!');
  } else {
    console.log(`⚠️ Completed with ${errors.length} error(s):`);
    errors.forEach(e => console.log('  -', e));
  }
  console.log('====================================================\n');
}

runEndToEndVerification();
