const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

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
function sectionHeading(doc, label, y) {
  doc.fillColor('#8b5e16').font('Helvetica-Bold').fontSize(8).text(label.toUpperCase(), page.left, y);
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
  ].join('\n').slice(0, 1800);
}
async function qrImage(purchase) {
  try { return await QRCode.toBuffer(qrPayload(purchase), { type: 'png', errorCorrectionLevel: 'L', margin: 1, width: 180, color: { dark: '#16120d', light: '#ffffff' } }); } catch (_) { return null; }
}
function drawHeader(doc, purchase, settings) {
  const shopName = text(settings.shopName, 'Kusum Jewellers');
  doc.fillColor('#1d1916').font('Helvetica-Bold').fontSize(19).text(shopName, page.left, 42, { width: 330 });
  doc.fillColor('#6d655e').font('Helvetica').fontSize(8.5);
  const contact = [settings.shopAddress, settings.primaryPhone, settings.secondaryPhone].filter(Boolean).join('  ·  ');
  if (contact) doc.text(contact, page.left, 66, { width: 350, ellipsis: true });
  if (settings.gstin) doc.text(`GSTIN: ${settings.gstin}${settings.panNumber ? `  ·  PAN: ${settings.panNumber}` : ''}`, page.left, 79, { width: 350, ellipsis: true });
  doc.fillColor('#8b5e16').font('Helvetica-Bold').fontSize(14).text('URD PURCHASE RECEIPT', 389, 44, { width: 183, align: 'right' });
  doc.fillColor('#6d655e').font('Helvetica').fontSize(8.5).text(`No. ${text(purchase.purchaseNumber)}`, 389, 66, { width: 183, align: 'right' });
  doc.text(dateTime(purchase.purchaseDate), 389, 79, { width: 183, align: 'right' });
  line(doc, 101, '#b88732', 1.1);
}
function drawCustomer(doc, purchase, y) {
  y = sectionHeading(doc, 'Purchased from', y);
  doc.fillColor('#1d1916').font('Helvetica-Bold').fontSize(11).text(text(purchase.customer?.name, 'Walk-in customer'), page.left, y);
  doc.fillColor('#5e554d').font('Helvetica').fontSize(9);
  if (purchase.customer?.phone) doc.text(purchase.customer.phone, page.left, y + 17);
  if (purchase.customer?.address) doc.text(purchase.customer.address, page.left, y + 31, { width: 320, height: 28, ellipsis: true });
  return y + 62;
}
function drawItem(doc, purchase, y) {
  y = sectionHeading(doc, 'Old jewellery / bullion received', y);
  const columns = [
    ['DESCRIPTION', text(purchase.description, 'Old jewellery purchase'), 211],
    ['METAL / PURITY', `${text(purchase.metal)}${purchase.purity ? ` / ${text(purchase.purity)}` : ''}`, 114],
    ['GROSS WT.', weight(purchase.grossWeight), 76], ['NET WT.', weight(purchase.netWeight), 76], ['RATE / G', amount(purchase.ratePerGram), 76]
  ];
  const top = y; const height = 48; let x = page.left;
  doc.rect(page.left, top, page.width, height).fill('#f6f1e8');
  columns.forEach(([label, value, width], index) => {
    if (index) doc.save().moveTo(x, top).lineTo(x, top + height).lineWidth(0.45).strokeColor('#ded5c8').stroke().restore();
    doc.fillColor('#756b61').font('Helvetica-Bold').fontSize(7).text(label, x + 5, top + 8, { width: width - 10, ellipsis: true });
    doc.fillColor('#1d1916').font('Helvetica').fontSize(8.5).text(value, x + 5, top + 24, { width: width - 10, ellipsis: true, align: index >= 2 ? 'right' : 'left' });
    x += width;
  });
  line(doc, top + height, '#ded5c8', 0.45);
  return top + height + 24;
}
function drawTotals(doc, purchase, y) {
  y = sectionHeading(doc, 'Valuation and settlement', y);
  const total = Number(purchase.totalAmount || 0); const offset = Number(purchase.saleOffset || 0); const paid = Number(purchase.paid || 0);
  const due = Math.max(0, total - offset - paid);
  const rows = [['Valuation amount', `Rs. ${amount(total)}`], ...(offset > 0 ? [['Adjusted against sale', `Rs. ${amount(offset)}`]] : []), ['Paid to customer', `Rs. ${amount(paid)}`], ['Balance due', `Rs. ${amount(due)}`]];
  rows.forEach(([label, value], index) => {
    const yy = y + index * 22; const dueRow = index === rows.length - 1 && due > 0;
    doc.fillColor(dueRow ? '#b53d36' : '#5e554d').font(dueRow ? 'Helvetica-Bold' : 'Helvetica').fontSize(9).text(label, 360, yy);
    doc.fillColor(dueRow ? '#b53d36' : '#1b1714').font('Helvetica-Bold').fontSize(9).text(value, 465, yy, { width: 100, align: 'right' });
  });
  doc.fillColor('#5e554d').font('Helvetica').fontSize(8.5).text(`Payment method: ${text(purchase.paymentMethod, 'CASH').replaceAll('_', ' ')}`, page.left, y + 4);
  if (purchase.sale?.invoiceNumber) doc.text(`Settled in sales invoice: ${purchase.sale.invoiceNumber}`, page.left, y + 22, { width: 260, ellipsis: true });
  if (purchase.notes) {
    doc.fillColor('#5e554d').font('Helvetica-Bold').fontSize(8.5).text('Narration:', page.left, y + 40);
    doc.font('Helvetica').fontSize(8.5).text(text(purchase.notes), page.left + 58, y + 40, { width: 255, height: 24, ellipsis: true });
  }
  return y + Math.max(75, rows.length * 22 + 18);
}
function drawFooter(doc, purchase, settings, qr) {
  const y = page.footerY; line(doc, y, '#b88732', 0.8);
  if (qr) doc.image(qr, page.left, y + 10, { fit: [72, 72] });
  doc.fillColor('#6d655e').font('Helvetica').fontSize(8).text('Scan for a summary of this URD purchase', page.left, y + 85, { width: 90, align: 'center' });
  const signatureX = 389;
  doc.fillColor('#6d655e').font('Helvetica').fontSize(8).text(`For ${text(settings.shopName, 'Kusum Jewellers')}`, signatureX, y + 10, { width: 183, align: 'center' });
  const signature = settings.signatureImage ? Buffer.from(settings.signatureImage) : (fs.existsSync(bundledSignaturePath) ? bundledSignaturePath : null);
  if (signature) doc.image(signature, signatureX + 22, y + 22, { fit: [140, 42], align: 'center', valign: 'center' });
  doc.save().moveTo(signatureX + 20, y + 66).lineTo(page.right - 10, y + 66).lineWidth(0.6).strokeColor('#bcb4ab').stroke().restore();
  doc.fillColor('#6d655e').font('Helvetica-Bold').fontSize(8).text('Authorised Signatory', signatureX, y + 72, { width: 183, align: 'center' });
  doc.font('Helvetica').fontSize(7.5).text('This receipt records the old jewellery received and its settlement. Retain it with the customer record.', page.left + 112, y + 96, { width: 230, align: 'center' });
}
async function writeUrdPurchaseInvoice(res, purchase, businessSettings = {}) {
  const doc = new PDFDocument({ size: 'A4', margin: 0, info: { Title: `URD Purchase Receipt ${purchase.purchaseNumber}` } });
  const filename = `${String(purchase.purchaseNumber || 'urd-purchase').replace(/[^A-Za-z0-9-]/g, '_')}.pdf`;
  res.setHeader('Content-Type', 'application/pdf'); res.setHeader('Content-Disposition', `inline; filename="${filename}"`); doc.pipe(res);
  drawHeader(doc, purchase, businessSettings); let y = drawCustomer(doc, purchase, 123); y = drawItem(doc, purchase, y); drawTotals(doc, purchase, y); drawFooter(doc, purchase, businessSettings, await qrImage(purchase)); doc.end();
}
module.exports = { writeUrdPurchaseInvoice, qrPayload };
