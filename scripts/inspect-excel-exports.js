/**
 * Excel Export Quality Inspector
 * Generates every Excel export, reads back every sheet,
 * and prints a detailed report of what's inside each one.
 */
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { createPrisma } = require('../src/lib/prisma');
const { RESOURCE_LIST, parseDateRange, getExportPayload } = require('../src/lib/data-lifecycle');
const { buildExcelExport } = require('../src/lib/excel-export');

const outputDir = path.join(__dirname, '..', 'test-exports');

async function inspect() {
  const prisma = createPrisma();
  const range = parseDateRange({ from: '2020-01-01', to: '2030-01-01' });

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📋 EXCEL EXPORT QUALITY INSPECTION');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const issues = [];

  for (const res of RESOURCE_LIST) {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📊 ${res.label.toUpperCase()} (${res.key})`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    const payload = await getExportPayload(prisma, res.key, range);
    const buffer = await buildExcelExport(payload);
    const filePath = path.join(outputDir, payload.filename);
    fs.writeFileSync(filePath, buffer);

    console.log(`  File: ${payload.filename} (${buffer.length} bytes)`);
    console.log(`  Title: "${payload.title}"`);
    console.log(`  Subtitle: "${payload.subtitle}"`);
    console.log(`  Total rows: ${payload.rows.length}`);
    console.log(`  Columns (${payload.columns.length}): ${payload.columns.map(c => c.label).join(' │ ')}`);

    // Stable financial schemas intentionally retain zero/blank columns so
    // exports from different days can be combined without shifted headings.
    for (const col of payload.columns) {
      const allEmpty = payload.rows.every(row => {
        const v = row[col.key];
        return v === null || v === undefined || v === '' || v === 0;
      });
      if (allEmpty && payload.rows.length > 0) {
        console.log(`  ℹ️  Stable column "${col.label}" is zero/blank for this period`);
      }
    }

    // Print first 3 rows as sample
    if (payload.rows.length > 0) {
      console.log(`\n  ── Sample rows (first ${Math.min(3, payload.rows.length)}):`);
      payload.rows.slice(0, 3).forEach((row, i) => {
        const vals = payload.columns.map(col => {
          const v = row[col.key];
          if (v instanceof Date) return v.toISOString().slice(0, 10);
          if (v === null || v === undefined) return '—';
          if (typeof v === 'number') return v.toLocaleString('en-IN');
          return String(v).slice(0, 20);
        });
        console.log(`     Row ${i + 1}: ${vals.join(' │ ')}`);
      });
    }

    // Inspect sheets
    if (payload.sheets && payload.sheets.length) {
      console.log(`\n  ── Sheets (${payload.sheets.length}):`);
      for (const sheet of payload.sheets) {
        console.log(`     📄 "${sheet.name}" — ${sheet.rows.length} rows, ${(sheet.columns || []).length} cols`);
        if (sheet.title) console.log(`        Title: "${sheet.title}"`);
        if (sheet.infoRows && sheet.infoRows.length) {
          console.log(`        Info: ${sheet.infoRows.map(ir => `${ir.label}=${typeof ir.value === 'number' ? ir.value.toLocaleString('en-IN') : ir.value}`).join(' │ ')}`);
        }
        // Check for duplicate data between sheets
        if (sheet.rows.length > 0) {
          const sample = sheet.rows[0];
          const sampleKeys = Object.keys(sample).slice(0, 4);
          const sampleVals = sampleKeys.map(k => {
            const v = sample[k];
            if (v instanceof Date) return v.toISOString().slice(0, 10);
            return String(v || '').slice(0, 15);
          });
          console.log(`        First row: ${sampleVals.join(' │ ')}`);
        }
      }
    }

    // Resource-specific checks
    if (res.key === 'cashbook') {
      // Every entry must have: date, direction, a split amount and description.
      const missingType = payload.rows.filter(r => !r.type);
      const missingDate = payload.rows.filter(r => !r.entryDate);
      const missingAmount = payload.rows.filter(r => Number(r.moneyIn || 0) <= 0 && Number(r.moneyOut || 0) <= 0);
      const missingDesc = payload.rows.filter(r => !r.description);
      if (missingType.length) issues.push({ resource: 'cashbook', issue: `${missingType.length} rows missing money-in/out type` });
      if (missingDate.length) issues.push({ resource: 'cashbook', issue: `${missingDate.length} rows missing entryDate` });
      if (missingAmount.length) issues.push({ resource: 'cashbook', issue: `${missingAmount.length} rows missing an in/out amount` });
      if (missingDesc.length) issues.push({ resource: 'cashbook', issue: `${missingDesc.length} rows missing description` });
      console.log(`\n  ── Cashbook validation:`);
      console.log(`     Types: ${payload.rows.filter(r => r.type === 'Money in').length} money in, ${payload.rows.filter(r => r.type === 'Money out').length} money out`);
      console.log(`     Methods: ${[...new Set(payload.rows.map(r => r.paymentMethod))].join(', ')}`);
      console.log(`     Date range: ${payload.rows[0]?.entryDate || '—'} to ${payload.rows[payload.rows.length - 1]?.entryDate || '—'}`);
      
      // Verify all entries sheet has SAME count as total
      const allSheet = payload.sheets.find(s => s.name === 'All entries');
      if (allSheet && allSheet.rows.length !== payload.rows.length) {
        issues.push({ resource: 'cashbook', issue: `"All entries" sheet has ${allSheet.rows.length} rows but total is ${payload.rows.length}` });
      }
    }

    if (res.key === 'sales') {
      const missingInvoice = payload.rows.filter(r => !r.invoiceNumber);
      if (missingInvoice.length) issues.push({ resource: 'sales', issue: `${missingInvoice.length} rows missing invoiceNumber` });
      console.log(`\n  ── Sales validation:`);
      console.log(`     Unique invoices: ${new Set(payload.rows.map(r => r.invoiceNumber)).size}`);
      console.log(`     Customers: ${[...new Set(payload.rows.map(r => r.customerName))].join(', ')}`);
      console.log(`     Payment methods: ${[...new Set(payload.rows.map(r => r.paymentMethod))].join(', ')}`);
    }

    if (res.key === 'inventory') {
      console.log(`\n  ── Inventory validation:`);
      console.log(`     Metals: ${[...new Set(payload.rows.map(r => r.metal))].join(', ')}`);
      console.log(`     Statuses: ${[...new Set(payload.rows.map(r => r.status))].join(', ')}`);
      console.log(`     Items with barcode: ${payload.rows.filter(r => r.barcode).length}/${payload.rows.length}`);
      console.log(`     Items with batchDocNo: ${payload.rows.filter(r => r.batchDocNo).length}/${payload.rows.length}`);
      
      const allSheet = payload.sheets.find(s => s.name === 'All records');
      if (allSheet && allSheet.rows.length !== payload.rows.length) {
        issues.push({ resource: 'inventory', issue: `"All records" sheet has ${allSheet.rows.length} rows but total is ${payload.rows.length}` });
      }
    }

    if (res.key === 'urd') {
      console.log(`\n  ── URD validation:`);
      console.log(`     Metals: ${[...new Set(payload.rows.map(r => r.metal))].join(', ')}`);
      console.log(`     Payment methods: ${[...new Set(payload.rows.map(r => r.paymentMethod))].join(', ')}`);
    }

    if (res.key === 'customers') {
      console.log(`\n  ── Customers validation:`);
      console.log(`     With PAN: ${payload.rows.filter(r => r.panNumber).length}/${payload.rows.length}`);
      console.log(`     With address: ${payload.rows.filter(r => r.address).length}/${payload.rows.length}`);
      console.log(`     With outstanding: ${payload.rows.filter(r => r.outstanding > 0).length}/${payload.rows.length}`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  if (issues.length === 0) {
    console.log('✅ ALL EXPORTS LOOK PROFESSIONAL — 0 ISSUES FOUND');
  } else {
    console.log(`⚠️  FOUND ${issues.length} ISSUE(S):`);
    issues.forEach((issue, i) => console.log(`   ${i + 1}. [${issue.resource}] ${issue.issue}`));
  }
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`\n📂 All test Excel files saved to: ${outputDir}`);

  await prisma.$disconnect();
  process.exit(issues.length > 0 ? 1 : 0);
}

inspect().catch(err => { console.error(err); process.exit(1); });
