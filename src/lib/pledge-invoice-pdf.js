const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const bundledSignaturePath = path.join(__dirname, '..', 'assets', 'kusum-authorised-signature.jpg');
const page = { left: 42, right: 553, width: 511 };

function amount(value) {
  return new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value || 0));
}

function weight(value) {
  return `${Number(value || 0).toFixed(3)} g`;
}

function dateOnly(value) {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function dateTime(value) {
  if (!value) return '—';
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : `${date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} ${date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
}

function text(value, fallback = '—') {
  const clean = String(value ?? '').replace(/\s+/g, ' ').trim();
  return clean || fallback;
}

function line(doc, x1, y1, x2, y2, color = '#d7d0c6', width = 0.6) {
  doc.save().moveTo(x1, y1).lineTo(x2, y2).lineWidth(width).strokeColor(color).stroke().restore();
}

function sectionHeading(doc, label, y) {
  doc.fillColor('#8b5e16').font('Helvetica-Bold').fontSize(8).text(label.toUpperCase(), page.left, y);
  line(doc, page.left, y + 14, page.right, y + 14, '#e5ddd1', 0.7);
  return y + 25;
}

function moneyRow(doc, label, value, y, emphasize = false) {
  doc.fillColor(emphasize ? '#8b5e16' : '#5e554d').font(emphasize ? 'Helvetica-Bold' : 'Helvetica').fontSize(emphasize ? 11 : 9).text(label, 350, y);
  doc.fillColor('#1b1714').font(emphasize ? 'Helvetica-Bold' : 'Helvetica').fontSize(emphasize ? 11 : 9).text(value, 455, y, { width: 90, align: 'right' });
}

function pledgeOutstanding(loan) {
  return Math.max(0, Number(loan.principalAmount || 0) - Number(loan.principalRepaid || 0));
}

function qrPayload(loan) {
  const items = [
    `${text(loan.customer?.name, 'Customer')}`,
    `Pledge: ${text(loan.pledgeNumber)}`,
    `Item: ${text(loan.itemDescription)}`,
    `Metal/Purity: ${text(loan.metal)}${loan.purity ? ` / ${text(loan.purity)}` : ''}`,
    `Net wt: ${weight(loan.netWeight)}`,
    `Principal: Rs. ${amount(loan.principalAmount)}`,
    `Repaid: Rs. ${amount(loan.principalRepaid)}`,
    `Outstanding: Rs. ${amount(pledgeOutstanding(loan))}`,
    `Status: ${text(loan.status)}`
  ];
  return items.join('\n').slice(0, 1800);
}

async function qrImage(loan) {
  try {
    return await QRCode.toBuffer(qrPayload(loan), {
      type: 'png', errorCorrectionLevel: 'L', margin: 1, width: 180,
      color: { dark: '#16120d', light: '#ffffff' }
    });
  } catch (_) {
    return null;
  }
}

function drawHeader(doc, loan, settings) {
  const shopName = text(settings.shopName, 'Kusum Jewellers');
  doc.fillColor('#1d1916').font('Helvetica-Bold').fontSize(19).text(shopName, page.left, 42, { width: 330 });
  doc.fillColor('#6d655e').font('Helvetica').fontSize(8.5);
  const contact = [settings.shopAddress, settings.primaryPhone, settings.secondaryPhone].filter(Boolean).join('  ·  ');
  if (contact) doc.text(contact, page.left, 66, { width: 350, ellipsis: true });
  if (settings.gstin) doc.text(`GSTIN: ${settings.gstin}${settings.panNumber ? `  ·  PAN: ${settings.panNumber}` : ''}`, page.left, 79, { width: 350, ellipsis: true });
  doc.fillColor('#8b5e16').font('Helvetica-Bold').fontSize(15).text('PLEDGE LOAN RECEIPT', 370, 44, { width: 183, align: 'right' });
  doc.fillColor('#6d655e').font('Helvetica').fontSize(8.5).text(`No. ${text(loan.pledgeNumber)}`, 370, 66, { width: 183, align: 'right' });
  doc.text(dateTime(loan.pledgeDate), 370, 79, { width: 183, align: 'right' });
  line(doc, page.left, 101, page.right, 101, '#b88732', 1.1);
}

function drawCustomer(doc, loan, y) {
  y = sectionHeading(doc, 'Customer', y);
  doc.fillColor('#1d1916').font('Helvetica-Bold').fontSize(11).text(text(loan.customer?.name, 'Walk-in customer'), page.left, y);
  doc.fillColor('#5e554d').font('Helvetica').fontSize(9);
  if (loan.customer?.phone) doc.text(loan.customer.phone, page.left, y + 17);
  if (loan.customer?.address) doc.text(loan.customer.address, page.left, y + 31, { width: 300, height: 28, ellipsis: true });
  return y + 62;
}

function drawCollateral(doc, loan, y) {
  y = sectionHeading(doc, 'Jewellery held as security', y);
  const top = y;
  const columns = [
    ['ITEM DESCRIPTION', text(loan.itemDescription)],
    ['METAL / PURITY', `${text(loan.metal)}${loan.purity ? ` / ${text(loan.purity)}` : ''}`],
    ['PIECES', String(loan.quantity || 1)],
    ['GROSS WT.', weight(loan.grossWeight)],
    ['STONE WT.', weight(loan.stoneWeight)],
    ['NET WT.', weight(loan.netWeight)]
  ];
  const widths = [185, 100, 45, 60, 60, 61];
  let x = page.left;
  const rowHeight = 44;
  doc.rect(page.left, top, page.width, rowHeight).fill('#f6f1e8');
  columns.forEach(([label, value], index) => {
    if (index) line(doc, x, top, x, top + rowHeight, '#ded5c8', 0.45);
    doc.fillColor('#756b61').font('Helvetica-Bold').fontSize(7).text(label, x + 5, top + 8, { width: widths[index] - 10, ellipsis: true });
    doc.fillColor('#1d1916').font('Helvetica').fontSize(8.5).text(value, x + 5, top + 23, { width: widths[index] - 10, ellipsis: true });
    x += widths[index];
  });
  line(doc, page.left, top + rowHeight, page.right, top + rowHeight, '#ded5c8', 0.45);
  return top + rowHeight + 24;
}

function drawFinancials(doc, loan, y) {
  const start = y;
  y = sectionHeading(doc, 'Loan summary', y);
  const left = [
    ['Money lent', `Rs. ${amount(loan.principalAmount)}`],
    ['Principal repaid', `Rs. ${amount(loan.principalRepaid)}`],
    ['Interest received', `Rs. ${amount(loan.interestReceived)}`]
  ];
  const right = [
    ['Valuation', `Rs. ${amount(loan.valuationAmount)}`],
    ['Monthly interest', `${amount(loan.monthlyInterestRate)}%`],
    ['Return due', dateOnly(loan.dueDate)]
  ];
  left.forEach(([label, value], index) => moneyRow(doc, label, value, y + index * 22));
  right.forEach(([label, value], index) => {
    doc.fillColor('#5e554d').font('Helvetica').fontSize(9).text(label, 42, y + index * 22);
    doc.fillColor('#1b1714').font('Helvetica-Bold').fontSize(9).text(value, 160, y + index * 22, { width: 130, align: 'right' });
  });
  const outstanding = pledgeOutstanding(loan);
  moneyRow(doc, 'Principal outstanding', `Rs. ${amount(outstanding)}`, y + 70, true);
  doc.fillColor('#5e554d').font('Helvetica').fontSize(8.5).text(`Payout method: ${text(loan.cashbookEntries?.[0]?.paymentMethod, 'CASH').replaceAll('_', ' ')}`, 42, y + 73);
  return Math.max(start + 112, y + 103);
}

function drawPayments(doc, loan, y, settings) {
  y = sectionHeading(doc, 'Repayment history', y);
  const rows = loan.payments || [];
  if (!rows.length) {
    doc.fillColor('#6d655e').font('Helvetica').fontSize(9).text('No repayment recorded.', page.left, y);
    return y + 30;
  }
  const heads = [['DATE', 42, 75], ['METHOD', 117, 115], ['PRINCIPAL', 232, 88], ['INTEREST', 320, 88], ['RECEIVED', 408, 145]];
  const drawTableHeader = () => {
    doc.rect(page.left, y, page.width, 22).fill('#f2eee8');
    heads.forEach(([label, x, width]) => doc.fillColor('#655d55').font('Helvetica-Bold').fontSize(7.5).text(label, x + 5, y + 7, { width: width - 10, align: x >= 232 ? 'right' : 'left' }));
    y += 22;
  };
  drawTableHeader();
  rows.forEach((payment) => {
    if (y > 648) {
      doc.addPage();
      drawHeader(doc, loan, settings || {});
      y = sectionHeading(doc, 'Repayment history (continued)', 123);
      drawTableHeader();
    }
    const received = Number(payment.principalAmount || 0) + Number(payment.interestAmount || 0);
    doc.fillColor('#1d1916').font('Helvetica').fontSize(8.5).text(dateOnly(payment.paymentDate), 47, y + 8, { width: 65 });
    doc.text(text(payment.paymentMethod).replaceAll('_', ' '), 122, y + 8, { width: 105, ellipsis: true });
    doc.text(amount(payment.principalAmount), 237, y + 8, { width: 78, align: 'right' });
    doc.text(amount(payment.interestAmount), 325, y + 8, { width: 78, align: 'right' });
    doc.font('Helvetica-Bold').text(amount(received), 413, y + 8, { width: 140, align: 'right' });
    line(doc, page.left, y + 29, page.right, y + 29, '#e5ddd1', 0.45);
    y += 30;
  });
  return y;
}

function drawFooter(doc, loan, settings, qr) {
  const y = 700;
  line(doc, page.left, y, page.right, y, '#b88732', 0.8);
  if (qr) doc.image(qr, page.left, y + 10, { fit: [72, 72] });
  doc.fillColor('#6d655e').font('Helvetica').fontSize(8).text('Scan for a summary of this pledge record', page.left, y + 85, { width: 90, align: 'center' });
  const signatureX = 370;
  doc.fillColor('#6d655e').font('Helvetica').fontSize(8).text(`For ${text(settings.shopName, 'Kusum Jewellers')}`, signatureX, y + 10, { width: 183, align: 'center' });
  const signature = settings.signatureImage ? Buffer.from(settings.signatureImage) : (fs.existsSync(bundledSignaturePath) ? bundledSignaturePath : null);
  if (signature) doc.image(signature, signatureX + 22, y + 22, { fit: [140, 42], align: 'center', valign: 'center' });
  line(doc, signatureX + 20, y + 66, page.right - 10, y + 66, '#bcb4ab', 0.6);
  doc.fillColor('#6d655e').font('Helvetica-Bold').fontSize(8).text('Authorised Signatory', signatureX, y + 72, { width: 183, align: 'center' });
  doc.font('Helvetica').fontSize(7.5).text('This receipt records the jewellery held and money advanced. Retain it for release and repayment reference.', page.left + 112, y + 96, { width: 230, align: 'center' });
}

async function writePledgeLoanInvoice(res, loan, businessSettings = {}) {
  const doc = new PDFDocument({ size: 'A4', margin: 0, info: { Title: `Pledge Loan Receipt ${loan.pledgeNumber}` } });
  const filename = `${String(loan.pledgeNumber || 'pledge-loan').replace(/[^A-Za-z0-9-]/g, '_')}.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  doc.pipe(res);
  drawHeader(doc, loan, businessSettings);
  let y = drawCustomer(doc, loan, 123);
  y = drawCollateral(doc, loan, y);
  y = drawFinancials(doc, loan, y);
  drawPayments(doc, loan, y + 2, businessSettings);
  drawFooter(doc, loan, businessSettings, await qrImage(loan));
  doc.end();
}

module.exports = { writePledgeLoanInvoice, qrPayload };
