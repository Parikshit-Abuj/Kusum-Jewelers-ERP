const PDFDocument = require('pdfkit');

const page = { left: 35, right: 560, top: 42, bottom: 796 };

function currency(value) {
  return `Rs. ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(Number(value || 0))}`;
}

function tableAmount(value) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(Number(value || 0));
}

function weight(value) {
  return Number(value || 0).toFixed(3);
}

function makingDisplay(item) {
  const value = tableAmount(item.makingChargeValue);
  if (item.makingChargeType === 'PERCENTAGE') return `${value}%`;
  if (item.makingChargeType === 'PER_GRAM') return `${value} / g`;
  return `${value} fixed`;
}

function rule(doc, x1, y, x2 = page.right, color = '#1d1916', width = 0.55) {
  doc.save().moveTo(x1, y).lineTo(x2, y).lineWidth(width).strokeColor(color).stroke().restore();
}

function box(doc, x, y, width, height) {
  doc.save().rect(x, y, width, height).lineWidth(0.65).strokeColor('#1d1916').stroke().restore();
}

const columns = [
  { label: '#', x: 35, width: 18, align: 'center' },
  { label: 'CODE', x: 53, width: 63 },
  { label: 'PARTICULARS', x: 116, width: 108 },
  { label: 'PURITY', x: 224, width: 42, align: 'center' },
  { label: 'PCS', x: 266, width: 31, align: 'center' },
  { label: 'GROSS\nWT.', x: 297, width: 53, align: 'right' },
  { label: 'NET\nWT.', x: 350, width: 53, align: 'right' },
  { label: 'RATE\n[PER G]', x: 403, width: 57, align: 'right' },
  { label: 'MAKING', x: 460, width: 54, align: 'right' },
  { label: 'AMOUNT', x: 514, width: 46, align: 'right' }
];

function grid(doc, y, height) {
  box(doc, page.left, y, page.right - page.left, height);
  columns.slice(1).forEach((column) => {
    doc.save().moveTo(column.x, y).lineTo(column.x, y + height).lineWidth(0.45).strokeColor('#625b54').stroke().restore();
  });
}

function tableHeader(doc, y) {
  grid(doc, y, 31);
  doc.fillColor('#1d1916').font('Helvetica-Bold').fontSize(7.1);
  columns.forEach((column) => {
    doc.text(column.label, column.x + 2, y + 8, {
      width: column.width - 4,
      align: column.align || 'left',
      lineGap: -1
    });
  });
}

function invoiceHeader(doc, sale, continuation = false) {
  const date = sale.saleDate.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  doc.fillColor('#111').font('Helvetica-Bold').fontSize(16).text(continuation ? 'TAX INVOICE - CONTINUED' : 'TAX INVOICE', page.left, page.top, { width: page.right - page.left, align: 'center' });
  const top = continuation ? 78 : 74;
  const height = continuation ? 70 : 92;
  box(doc, page.left, top, page.right - page.left, height);
  const split = 318;
  doc.save().moveTo(split, top).lineTo(split, top + height).lineWidth(0.45).strokeColor('#625b54').stroke().restore();

  if (!continuation) {
    doc.fillColor('#111').font('Helvetica-Bold').fontSize(8).text('NAME', 43, top + 10);
    doc.font('Helvetica').fontSize(9).text(sale.customer?.name || 'Walk-in customer', 108, top + 9, { width: 195, height: 13, ellipsis: true });
    doc.font('Helvetica-Bold').fontSize(8).text('ADDRESS', 43, top + 27);
    doc.font('Helvetica').fontSize(8.4).text(sale.customer?.address || '—', 108, top + 26, { width: 195, height: 22, ellipsis: true });
    doc.font('Helvetica-Bold').fontSize(8).text('MOBILE', 43, top + 58);
    doc.font('Helvetica').fontSize(8.5).text(sale.customer?.phone || '—', 108, top + 57, { width: 195, ellipsis: true });
  } else {
    doc.fillColor('#56504a').font('Helvetica').fontSize(8).text('Customer', 43, top + 13);
    doc.fillColor('#111').font('Helvetica-Bold').fontSize(10).text(sale.customer?.name || 'Walk-in customer', 108, top + 11, { width: 195, ellipsis: true });
    doc.font('Helvetica').fontSize(8.5).text(sale.customer?.phone || '', 108, top + 31, { width: 195, ellipsis: true });
  }

  const paymentLabel = String(sale.paymentMethod || '').replace('_', ' ');
  const metaX = 333;
  const paymentOffset = continuation ? 50 : 56;
  doc.fillColor('#111').font('Helvetica-Bold').fontSize(8.5).text('INVOICE NO.', metaX, top + 12);
  doc.font('Helvetica').fontSize(8.8).text(sale.invoiceNumber, 420, top + 11, { width: 128, align: 'right', ellipsis: true });
  doc.font('Helvetica-Bold').fontSize(8.5).text('DATE', metaX, top + 34);
  doc.font('Helvetica').fontSize(8.8).text(date, 420, top + 33, { width: 128, align: 'right' });
  doc.font('Helvetica-Bold').fontSize(8.5).text('PAYMENT', metaX, top + paymentOffset);
  doc.font('Helvetica').fontSize(8.8).text(paymentLabel || '—', 420, top + paymentOffset - 1, { width: 128, align: 'right', ellipsis: true });
  return top + height + 5;
}

const smallNumbers = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function wordsUnderThousand(value) {
  const number = Math.floor(value);
  if (!number) return '';
  if (number < 20) return smallNumbers[number];
  if (number < 100) return `${tens[Math.floor(number / 10)]}${number % 10 ? ` ${smallNumbers[number % 10]}` : ''}`;
  return `${smallNumbers[Math.floor(number / 100)]} Hundred${number % 100 ? ` ${wordsUnderThousand(number % 100)}` : ''}`;
}

function amountInWords(value) {
  let remaining = Math.max(0, Math.round(Number(value || 0)));
  if (!remaining) return 'Zero Rupees Only';
  const parts = [];
  const crore = Math.floor(remaining / 10000000); remaining %= 10000000;
  const lakh = Math.floor(remaining / 100000); remaining %= 100000;
  const thousand = Math.floor(remaining / 1000); remaining %= 1000;
  if (crore) parts.push(`${wordsUnderThousand(crore)} Crore`);
  if (lakh) parts.push(`${wordsUnderThousand(lakh)} Lakh`);
  if (thousand) parts.push(`${wordsUnderThousand(thousand)} Thousand`);
  if (remaining) parts.push(wordsUnderThousand(remaining));
  return `${parts.join(' ')} Rupees Only`;
}

function totalsBox(doc, sale, y) {
  const leftWidth = 330;
  const rightX = page.left + leftWidth;
  const totalWidth = page.right - rightX;
  const gross = Number(sale.subtotal || 0);
  const discount = Number(sale.discount || 0);
  const gst = Number(sale.gstAmount || 0);
  const cgst = Math.round((gst / 2) * 100) / 100;
  const sgst = Math.round((gst - cgst) * 100) / 100;
  const taxRate = Number(sale.gstRate || 0) / 2;
  const netPayable = Math.max(0, Number(sale.total || 0) - Number(sale.urdOffset || 0));
  const rightRows = [
    ['Gross amount', currency(gross)],
    ...(discount > 0 ? [['Less discount', `- ${currency(discount)}`]] : []),
    [`ADD CGST ${tableAmount(taxRate)}%`, currency(cgst)],
    [`ADD SGST ${tableAmount(taxRate)}%`, currency(sgst)],
    ...(Number(sale.urdOffset) > 0 ? [['Less URD', `- ${currency(sale.urdOffset)}`]] : []),
    ['Net payable', currency(netPayable)],
    ['Amount paid', currency(sale.paid)],
    ...(Number(sale.balance) > 0 ? [['Balance due', currency(sale.balance)]] : [])
  ];
  const height = Math.max(118, rightRows.length * 18 + 12);
  box(doc, page.left, y, page.right - page.left, height);
  doc.save().moveTo(rightX, y).lineTo(rightX, y + height).lineWidth(0.45).strokeColor('#625b54').stroke().restore();
  doc.fillColor('#111').font('Helvetica-Bold').fontSize(8.5).text('INVOICE VALUE [IN WORDS]', 43, y + 9);
  doc.font('Helvetica').fontSize(8.4).text(amountInWords(netPayable), 43, y + 23, { width: leftWidth - 16, height: 27, ellipsis: true });
  rule(doc, page.left, y + 55, rightX, '#625b54', 0.45);
  doc.font('Helvetica-Bold').fontSize(8.5).text('NARRATION', 43, y + 63);
  doc.font('Helvetica').fontSize(8.2).text(sale.notes || `Payment: ${String(sale.paymentMethod || '').replace('_', ' ') || '—'}`, 43, y + 76, { width: leftWidth - 16, height: height - 82, ellipsis: true });

  rightRows.forEach(([label, value], index) => {
    const rowY = y + 7 + index * 18;
    const emphasis = label === 'Net payable' || label === 'Balance due';
    doc.fillColor('#111').font(emphasis ? 'Helvetica-Bold' : 'Helvetica').fontSize(emphasis ? 9.2 : 8.5).text(label, rightX + 9, rowY, { width: 86 });
    doc.font(emphasis ? 'Helvetica-Bold' : 'Helvetica').fontSize(emphasis ? 9.2 : 8.5).text(value, rightX + 98, rowY, { width: totalWidth - 107, align: 'right' });
  });
  return y + height;
}

function signatureBox(doc, y) {
  const height = 88;
  box(doc, page.left, y, page.right - page.left, height);
  const split = (page.left + page.right) / 2;
  doc.save().moveTo(split, y).lineTo(split, y + height).lineWidth(0.45).strokeColor('#625b54').stroke().restore();
  doc.fillColor('#111').font('Helvetica-Bold').fontSize(9).text('Customer Signature', page.left + 10, y + 67, { width: split - page.left - 20, align: 'center' });
  doc.text('Authorised Signature', split + 10, y + 67, { width: page.right - split - 20, align: 'center' });
}

function renderItems(doc, sale, initialY) {
  let y = initialY;
  tableHeader(doc, y);
  y += 31;
  for (const [index, item] of sale.items.entries()) {
    const rowHeight = 42;
    if (y + rowHeight > 544) {
      doc.addPage();
      y = invoiceHeader(doc, sale, true);
      tableHeader(doc, y);
      y += 31;
    }
    const product = item.product || {};
    grid(doc, y, rowHeight);
    doc.fillColor('#111').font('Helvetica').fontSize(7.6);
    doc.text(String(index + 1), 37, y + 16, { width: 14, align: 'center' });
    doc.fontSize(6.9).text(product.barcode || product.sku || '', 56, y + 16, { width: 57, height: 12, ellipsis: true });
    doc.font('Helvetica-Bold').fontSize(7.5).text(product.name || 'Jewellery item', 120, y + 8, { width: 100, height: 11, ellipsis: true });
    doc.font('Helvetica').fontSize(6.2).fillColor('#625b54').text(product.category || '', 120, y + 23, { width: 100, height: 9, ellipsis: true });
    doc.fillColor('#111').fontSize(7.2).text(product.purity || product.metal || '', 227, y + 16, { width: 36, align: 'center', ellipsis: true });
    doc.text(String(item.quantity || 1), 269, y + 16, { width: 25, align: 'center' });
    doc.text(weight(product.grossWeight), 300, y + 16, { width: 47, align: 'right' });
    doc.text(weight(item.weight || product.netWeight), 353, y + 16, { width: 47, align: 'right' });
    doc.text(tableAmount(item.metalRate || item.unitPrice), 406, y + 16, { width: 51, align: 'right', ellipsis: true });
    doc.fontSize(6.7).text(makingDisplay(item), 463, y + 16, { width: 48, align: 'right', ellipsis: true });
    doc.font('Helvetica-Bold').fontSize(7.2).text(tableAmount(item.taxableAmount || item.lineTotal), 517, y + 16, { width: 40, align: 'right', ellipsis: true });
    y += rowHeight;
  }
  return y;
}

function writeSaleInvoice(res, sale) {
  const doc = new PDFDocument({ size: 'A4', margin: 0, info: { Title: `Tax Invoice ${sale.invoiceNumber}` } });
  const filename = `${sale.invoiceNumber.replace(/[^A-Za-z0-9-]/g, '_')}.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  doc.pipe(res);

  const itemsEnd = renderItems(doc, sale, invoiceHeader(doc, sale));
  let lowerY = Math.max(itemsEnd, 550);
  if (lowerY + 220 > page.bottom) {
    doc.addPage();
    lowerY = invoiceHeader(doc, sale, true) + 6;
  }
  const totalsEnd = totalsBox(doc, sale, lowerY);
  signatureBox(doc, Math.max(totalsEnd, 706));
  doc.end();
}

module.exports = { writeSaleInvoice, makingDisplay, amountInWords };
