const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { createQrImage } = require('./qr-code');

const bundledSignaturePath = path.join(__dirname, '..', 'assets', 'kusum-authorised-signature.jpg');
// Match the printable A4 content area used by the sales invoice: 19pt side
// margins, full-width body, and the same lower signature region.
const page = { left: 19, right: 572, width: 553, footerY: 652 };

function amount(value) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(Number(value || 0));
}
function weight(value) { return `${Number(value || 0).toFixed(3)} g`; }
function dateOnly(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? String(value || '—') : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function dateTime(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? String(value || '—') : `${dateOnly(date)} ${date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
}
function text(value, fallback = '—') {
  const clean = String(value ?? '').replace(/\s+/g, ' ').trim();
  return clean || fallback;
}
function line(doc, y, color = '#d6d0c9', width = 0.6) {
  doc.save().moveTo(page.left, y).lineTo(page.right, y).lineWidth(width).strokeColor(color).stroke().restore();
}
function box(doc, x, y, width, height, widthValue = 0.65) {
  doc.save().rect(x, y, width, height).lineWidth(widthValue).strokeColor('#111').stroke().restore();
}
function vertical(doc, x, y, height, color = '#111', width = 0.45) {
  doc.save().moveTo(x, y).lineTo(x, y + height).lineWidth(width).strokeColor(color).stroke().restore();
}
function sectionHeading(doc, label, y) {
  doc.fillColor('#111').font('Helvetica-Bold').fontSize(8).text(label.toUpperCase(), page.left, y);
  line(doc, y + 14, '#e5ddd1', 0.7);
  return y + 25;
}
function qrPayload(purchase) {
  const paid = Number(purchase.paid || 0);
  const total = Number(purchase.totalAmount || 0);
  const due = Math.max(0, total - Number(purchase.saleOffset || 0) - paid);
  return [
    `${text(purchase.customer?.name, 'Customer')}`,
    `URD: ${text(purchase.purchaseNumber)}`,
    `Date: ${dateOnly(purchase.purchaseDate)}`,
    `Metal/Purity: ${text(purchase.metal)}${purchase.purity ? ` / ${text(purchase.purity)}` : ''}`,
    `Net wt: ${weight(purchase.netWeight)}`,
    `Valuation: Rs. ${amount(total)}`,
    `Paid: Rs. ${amount(paid)}`,
    `Due: Rs. ${amount(due)}`,
    ...(purchase.sale?.invoiceNumber ? [`Settled in sale: ${purchase.sale.invoiceNumber}`] : [])
  ].join('\n');
}
function compactQrPayload(purchase) {
  const paid = Number(purchase.paid || 0);
  const total = Number(purchase.totalAmount || 0);
  const due = Math.max(0, total - Number(purchase.saleOffset || 0) - paid);
  return [
    `URD:${text(purchase.purchaseNumber)}`,
    `C:${text(purchase.customer?.name, 'Customer')}`,
    `DATE:${dateOnly(purchase.purchaseDate)}`,
    `M:${text(purchase.metal)}${purchase.purity ? `/${text(purchase.purity)}` : ''}`,
    `NW:${weight(purchase.netWeight)}`,
    `V:${amount(total)}`,
    `P:${amount(paid)}`,
    `DUE:${amount(due)}`,
    ...(purchase.sale?.invoiceNumber ? [`SALE:${text(purchase.sale.invoiceNumber)}`] : [])
  ].join('|');
}
async function qrImage(purchase) {
  return createQrImage({
    payload: qrPayload(purchase),
    compactPayload: compactQrPayload(purchase),
    label: `URD receipt ${text(purchase.purchaseNumber)}`
  });
}
function drawHeader(doc, purchase, settings) {
  const shopName = text(settings.shopName, 'Kusum Jewellers');
  doc.fillColor('#111').font('Helvetica-Bold').fontSize(19).text(shopName, page.left, 42, { width: 330 });
  doc.fillColor('#111').font('Helvetica').fontSize(8.5);
  const address = String(settings.shopAddress || '').trim();
  const phones = [settings.primaryPhone, settings.secondaryPhone].filter(Boolean).join('  ·  ');
  let contactY = 66;
  if (address) { doc.text(address, page.left, contactY, { width: 350 }); contactY += 12; }
  if (phones) { doc.text(phones, page.left, contactY, { width: 350, ellipsis: true }); contactY += 12; }
  if (settings.gstin) doc.text(`GSTIN: ${settings.gstin}${settings.panNumber ? `  ·  PAN: ${settings.panNumber}` : ''}`, page.left, contactY, { width: 350, ellipsis: true });
  doc.fillColor('#111').font('Helvetica-Bold').fontSize(14).text('URD PURCHASE RECEIPT', 389, 44, { width: 183, align: 'right' });
  doc.fillColor('#111').font('Helvetica').fontSize(8.5).text(`No. ${text(purchase.purchaseNumber)}`, 389, 66, { width: 183, align: 'right' });
  doc.text(dateTime(purchase.purchaseDate), 389, 79, { width: 183, align: 'right' });
  line(doc, 101, '#b88732', 1.1);
}
function drawCustomer(doc, purchase, y) {
  y = sectionHeading(doc, 'Purchased from', y);
  const top = y;
  const height = 62;
  const split = 310;
  box(doc, page.left, top, page.width, height);
  vertical(doc, split, top, height);
  const leftRows = [
    ['Name', text(purchase.customer?.name, 'Walk-in customer')],
    ['Mobile', purchase.customer?.phone || '-'],
    ['Address', purchase.customer?.address || '-']
  ];
  const rightRows = [
    ['URD No.', text(purchase.purchaseNumber)],
    ['Date & Time', dateTime(purchase.purchaseDate)],
    ['Status', purchase.cancelledAt ? 'CANCELLED' : 'ACTIVE']
  ];
  const drawRows = (rows, labelX, valueX, width) => rows.forEach(([label, value], index) => {
    const rowY = top + 7 + index * 19;
    doc.fillColor('#111').font('Helvetica-Bold').fontSize(7.6).text(`${label}:`, labelX, rowY, { width: 68 });
    doc.font('Helvetica').fontSize(8.4).text(value, valueX, rowY - 1, { width, ellipsis: true });
  });
  drawRows(leftRows, page.left + 9, page.left + 69, split - page.left - 82);
  drawRows(rightRows, split + 10, split + 72, page.right - split - 84);
  return top + height + 14;
}
function drawItem(doc, purchase, y) {
  y = sectionHeading(doc, 'Old jewellery / bullion received', y);
  const columns = [
    ['DESCRIPTION', text(purchase.description, 'Old jewellery purchase'), 150, 'left'],
    ['METAL', text(purchase.metal), 75, 'left'],
    ['PURITY', text(purchase.purity), 55, 'center'],
    ['GROSS WT.', weight(purchase.grossWeight), 72, 'right'],
    ['NET WT.', weight(purchase.netWeight), 72, 'right'],
    ['RATE / G', amount(purchase.ratePerGram), 65, 'right'],
    ['VALUE', amount(purchase.totalAmount), 64, 'right']
  ];
  const top = y;
  const headerHeight = 24;
  const rowHeight = 32;
  const height = headerHeight + rowHeight;
  doc.rect(page.left, top, page.width, headerHeight).fill('#f2eee8');
  box(doc, page.left, top, page.width, height);
  let x = page.left;
  columns.forEach(([label, value, width, align], index) => {
    if (index) vertical(doc, x, top, height);
    doc.fillColor('#111').font('Helvetica-Bold').fontSize(7).text(label, x + 4, top + 8, { width: width - 8, align, ellipsis: true });
    doc.font('Helvetica').fontSize(8.1).text(value, x + 4, top + headerHeight + 9, { width: width - 8, align, ellipsis: true });
    x += width;
  });
  line(doc, top + headerHeight, '#111', 0.45);
  return top + height + 18;
}
function drawTotals(doc, purchase, y) {
  y = sectionHeading(doc, 'Valuation and settlement', y);
  const total = Number(purchase.totalAmount || 0); const offset = Number(purchase.saleOffset || 0); const paid = Number(purchase.paid || 0);
  const due = Math.max(0, total - offset - paid);
  const rows = [['Valuation amount', `Rs. ${amount(total)}`], ...(offset > 0 ? [['Adjusted against sale', `Rs. ${amount(offset)}`]] : []), ['Paid to customer', `Rs. ${amount(paid)}`], ['Balance due', `Rs. ${amount(due)}`]];
  const top = y;
  const height = 112;
  const split = 414;
  box(doc, page.left, top, page.width, height);
  vertical(doc, split, top, height);
  const leftRows = [
    ['Payment method', text(purchase.paymentMethod, 'CASH').replaceAll('_', ' ')],
    ['Settlement', purchase.sale?.invoiceNumber ? `Sales invoice ${purchase.sale.invoiceNumber}` : 'Direct customer payout'],
    ['Narration', purchase.notes || '-']
  ];
  leftRows.forEach(([label, value], index) => {
    const rowY = top + 10 + index * 25;
    doc.fillColor('#111').font('Helvetica-Bold').fontSize(8.2).text(`${label}:`, page.left + 10, rowY, { width: 78 });
    doc.font('Helvetica').fontSize(8.2).text(text(value), page.left + 88, rowY, { width: split - page.left - 100, height: 18, ellipsis: true });
  });
  rows.forEach(([label, value], index) => {
    const rowY = top + 8 + index * 22;
    const emphasis = index === rows.length - 1;
    doc.fillColor('#111').font(emphasis ? 'Helvetica-Bold' : 'Helvetica').fontSize(emphasis ? 9.2 : 8.6).text(label, split + 10, rowY, { width: 110 });
    doc.font(emphasis ? 'Helvetica-Bold' : 'Helvetica').fontSize(emphasis ? 9.2 : 8.6).text(value, 500, rowY, { width: 62, align: 'right' });
    if (emphasis) doc.save().moveTo(split, rowY - 4).lineTo(page.right, rowY - 4).lineWidth(0.45).strokeColor('#111').stroke().restore();
  });
  return top + height + 12;
}
function drawFooter(doc, purchase, settings, qr) {
  const y = page.footerY;
  const height = 82;
  const split = page.left + 108;
  box(doc, page.left, y, page.width, height);
  vertical(doc, split, y, height);
  if (qr) doc.image(qr, page.left + 25, y + 5, { fit: [58, 58] });
  doc.fillColor('#111').font('Helvetica-Bold').fontSize(6.6).text('SCAN URD DETAILS', page.left + 4, y + 67, { width: split - page.left - 8, align: 'center' });
  const signatureX = split;
  const signatureWidth = page.right - split;
  doc.fillColor('#111').font('Helvetica-Bold').fontSize(9.2).text(`For ${text(settings.shopName, 'Kusum Jewellers')}`, signatureX + 10, y + 6, { width: signatureWidth - 20, align: 'center' });
  const signature = settings.signatureImage ? Buffer.from(settings.signatureImage) : (fs.existsSync(bundledSignaturePath) ? bundledSignaturePath : null);
  if (signature) doc.image(signature, signatureX + 22, y + 22, { fit: [140, 42], align: 'center', valign: 'center' });
  doc.save().moveTo(signatureX + 20, y + 66).lineTo(page.right - 10, y + 66).lineWidth(0.6).strokeColor('#111').stroke().restore();
  doc.fillColor('#111').font('Helvetica-Bold').fontSize(8).text('Authorised Signatory', signatureX, y + 70, { width: signatureWidth, align: 'center' });
}
async function writeUrdPurchaseInvoice(res, purchase, businessSettings = {}) {
  const qr = await qrImage(purchase);
  const doc = new PDFDocument({ size: 'A4', margin: 0, info: { Title: `URD Purchase Receipt ${purchase.purchaseNumber}` } });
  const filename = `${String(purchase.purchaseNumber || 'urd-purchase').replace(/[^A-Za-z0-9-]/g, '_')}.pdf`;
  res.setHeader('Content-Type', 'application/pdf'); res.setHeader('Content-Disposition', `inline; filename="${filename}"`); doc.pipe(res);
  drawHeader(doc, purchase, businessSettings); let y = drawCustomer(doc, purchase, 123); y = drawItem(doc, purchase, y); drawTotals(doc, purchase, y); drawFooter(doc, purchase, businessSettings, qr); doc.end();
}
module.exports = { writeUrdPurchaseInvoice, qrPayload };
