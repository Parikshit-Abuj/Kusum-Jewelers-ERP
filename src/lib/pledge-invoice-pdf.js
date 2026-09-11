const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { createQrImage } = require('./qr-code');

const bundledSignaturePath = path.join(__dirname, '..', 'assets', 'kusum-authorised-signature.jpg');
// Keep pledge receipts on the same printable A4 area as sales, URD and scheme
// receipts so all customer documents share one consistent table width.
const page = { left: 19, right: 572, width: 553, footerY: 652 };

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

function box(doc, x, y, width, height, lineWidth = 0.65) {
  doc.save().rect(x, y, width, height).lineWidth(lineWidth).strokeColor('#111').stroke().restore();
}

function vertical(doc, x, y, height, color = '#111', width = 0.45) {
  line(doc, x, y, x, y + height, color, width);
}

function sectionHeading(doc, label, y) {
  doc.fillColor('#111').font('Helvetica-Bold').fontSize(8).text(label.toUpperCase(), page.left, y);
  line(doc, page.left, y + 14, page.right, y + 14, '#e5ddd1', 0.7);
  return y + 25;
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
  return items.join('\n');
}

function compactQrPayload(loan) {
  return [
    `PLEDGE:${text(loan.pledgeNumber)}`,
    `C:${text(loan.customer?.name, 'Customer')}`,
    `I:${text(loan.itemDescription)}`,
    `M:${text(loan.metal)}${loan.purity ? `/${text(loan.purity)}` : ''}`,
    `NW:${weight(loan.netWeight)}`,
    `PR:${amount(loan.principalAmount)}`,
    `RP:${amount(loan.principalRepaid)}`,
    `OUT:${amount(pledgeOutstanding(loan))}`,
    `S:${text(loan.status)}`
  ].join('|');
}

async function qrImage(loan) {
  return createQrImage({
    payload: qrPayload(loan),
    compactPayload: compactQrPayload(loan),
    label: `Pledge receipt ${text(loan.pledgeNumber)}`
  });
}

function drawHeader(doc, loan, settings) {
  const shopName = text(settings.shopName, 'Kusum Jewellers');
  doc.fillColor('#111').font('Helvetica-Bold').fontSize(19).text(shopName, page.left, 42, { width: 330 });
  doc.fillColor('#111').font('Helvetica').fontSize(8.5);
  const address = String(settings.shopAddress || '').trim();
  const phones = [settings.primaryPhone, settings.secondaryPhone].filter(Boolean).join('  ·  ');
  let contactY = 66;
  if (address) { doc.text(address, page.left, contactY, { width: 350 }); contactY += 12; }
  if (phones) { doc.text(phones, page.left, contactY, { width: 350, ellipsis: true }); contactY += 12; }
  if (settings.gstin) doc.text(`GSTIN: ${settings.gstin}${settings.panNumber ? `  ·  PAN: ${settings.panNumber}` : ''}`, page.left, contactY, { width: 350, ellipsis: true });
  doc.fillColor('#111').font('Helvetica-Bold').fontSize(14).text('PLEDGE LOAN RECEIPT', 389, 44, { width: 183, align: 'right' });
  doc.fillColor('#111').font('Helvetica').fontSize(8.5).text(`No. ${text(loan.pledgeNumber)}`, 389, 66, { width: 183, align: 'right' });
  doc.text(dateTime(loan.pledgeDate), 389, 79, { width: 183, align: 'right' });
  line(doc, page.left, 101, page.right, 101, '#b88732', 1.1);
}

function drawCustomer(doc, loan, y) {
  y = sectionHeading(doc, 'Customer', y);
  const top = y;
  const height = 62;
  const split = 310;
  box(doc, page.left, top, page.width, height);
  vertical(doc, split, top, height);
  const leftRows = [
    ['Name', text(loan.customer?.name, 'Walk-in customer')],
    ['Mobile', loan.customer?.phone || '-'],
    ['Address', loan.customer?.address || '-']
  ];
  const rightRows = [
    ['Pledge No.', text(loan.pledgeNumber)],
    ['Date & Time', dateTime(loan.pledgeDate)],
    ['Status', text(loan.status, 'ACTIVE')]
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
  const widths = [175, 75, 45, 75, 75, 108];
  let x = page.left;
  const headerHeight = 24;
  const rowHeight = 32;
  const tableHeight = headerHeight + rowHeight;
  doc.rect(page.left, top, page.width, headerHeight).fill('#f2eee8');
  box(doc, page.left, top, page.width, tableHeight);
  columns.forEach(([label, value], index) => {
    if (index) vertical(doc, x, top, tableHeight);
    const align = index >= 2 ? 'right' : 'left';
    doc.fillColor('#111').font('Helvetica-Bold').fontSize(7).text(label, x + 4, top + 8, { width: widths[index] - 8, align, ellipsis: true });
    doc.font('Helvetica').fontSize(8.1).text(value, x + 4, top + headerHeight + 8, { width: widths[index] - 8, align, ellipsis: true });
    x += widths[index];
  });
  line(doc, page.left, top + headerHeight, page.right, top + headerHeight, '#111', 0.45);
  return top + tableHeight + 18;
}

function drawFinancials(doc, loan, y) {
  y = sectionHeading(doc, 'Loan summary', y);
  const top = y;
  const rowHeight = 23;
  const rows = [
    [['Valuation', `Rs. ${amount(loan.valuationAmount)}`], ['Money lent', `Rs. ${amount(loan.principalAmount)}`]],
    [['Principal repaid', `Rs. ${amount(loan.principalRepaid)}`], ['Interest received', `Rs. ${amount(loan.interestReceived)}`]],
    [['Principal outstanding', `Rs. ${amount(pledgeOutstanding(loan))}`], ['Payout method', text(loan.cashbookEntries?.[0]?.paymentMethod, 'CASH').replaceAll('_', ' ')]],
    [['Return due', dateOnly(loan.dueDate)], ['Monthly interest', `${amount(loan.monthlyInterestRate)}%`]]
  ];
  const height = rows.length * rowHeight;
  const split = 300;
  doc.rect(page.left, top, page.width, height).fill('#fff');
  box(doc, page.left, top, page.width, height);
  vertical(doc, split, top, height);
  rows.forEach(([left, right], index) => {
    const rowY = top + index * rowHeight;
    if (index) line(doc, page.left, rowY, page.right, rowY, '#111', 0.4);
    [[left, page.left + 10, split - page.left - 20], [right, split + 10, page.right - split - 20]].forEach(([[label, value], x, width]) => {
      doc.fillColor('#111').font('Helvetica-Bold').fontSize(7.4).text(`${label}:`, x, rowY + 7, { width: 86, ellipsis: true });
      doc.font('Helvetica').fontSize(8.3).text(value, x + 88, rowY + 6, { width: width - 88, align: 'right', ellipsis: true });
    });
  });
  return top + height + 14;
}

function drawPayments(doc, loan, y, settings) {
  y = sectionHeading(doc, 'Repayment history', y);
  const rows = loan.payments || [];
  if (!rows.length) {
    doc.fillColor('#111').font('Helvetica').fontSize(9).text('No repayment recorded.', page.left, y);
    return y + 30;
  }
  const heads = [['DATE', 19, 80], ['METHOD', 99, 110], ['PRINCIPAL', 209, 100], ['INTEREST', 309, 100], ['RECEIVED', 409, 163]];
  const headerHeight = 24;
  const rowHeight = 30;
  const xPositions = [page.left, 99, 209, 309, 409, page.right];
  const drawTableHeader = () => {
    doc.rect(page.left, y, page.width, headerHeight).fill('#f2eee8');
    box(doc, page.left, y, page.width, headerHeight);
    xPositions.slice(1, -1).forEach((x) => vertical(doc, x, y, headerHeight));
    heads.forEach(([label, x, width]) => doc.fillColor('#111').font('Helvetica-Bold').fontSize(7.2).text(label, x + 5, y + 8, { width: width - 10, align: x >= 209 ? 'right' : 'left' }));
    y += headerHeight;
  };
  drawTableHeader();
  rows.forEach((payment, index) => {
    if (y + rowHeight > page.footerY - 10) {
      doc.addPage();
      drawHeader(doc, loan, settings || {});
      y = sectionHeading(doc, 'Repayment history (continued)', 123);
      drawTableHeader();
    }
    if ((index % 2) === 0) doc.rect(page.left, y, page.width, rowHeight).fill('#fcfaf6');
    box(doc, page.left, y, page.width, rowHeight, 0.45);
    xPositions.slice(1, -1).forEach((x) => vertical(doc, x, y, rowHeight, '#111', 0.4));
    const received = Number(payment.principalAmount || 0) + Number(payment.interestAmount || 0);
    doc.fillColor('#111').font('Helvetica').fontSize(8.5).text(dateOnly(payment.paymentDate), 24, y + 9, { width: 70 });
    doc.text(text(payment.paymentMethod).replaceAll('_', ' '), 104, y + 9, { width: 100, ellipsis: true });
    doc.text(amount(payment.principalAmount), 214, y + 9, { width: 90, align: 'right' });
    doc.text(amount(payment.interestAmount), 314, y + 9, { width: 90, align: 'right' });
    doc.font('Helvetica-Bold').text(amount(received), 414, y + 9, { width: 153, align: 'right' });
    y += rowHeight;
  });
  return y;
}

function drawFooter(doc, loan, settings, qr) {
  const y = page.footerY;
  const height = 82;
  const split = page.left + 108;
  box(doc, page.left, y, page.width, height);
  vertical(doc, split, y, height);
  if (qr) doc.image(qr, page.left + 25, y + 5, { fit: [58, 58] });
  doc.fillColor('#111').font('Helvetica-Bold').fontSize(6.6).text('SCAN PLEDGE DETAILS', page.left + 4, y + 67, { width: split - page.left - 8, align: 'center' });
  const signatureX = split;
  const signatureWidth = page.right - split;
  doc.fillColor('#111').font('Helvetica-Bold').fontSize(9.2).text(`For ${text(settings.shopName, 'Kusum Jewellers')}`, signatureX + 10, y + 6, { width: signatureWidth - 20, align: 'center' });
  const signature = settings.signatureImage ? Buffer.from(settings.signatureImage) : (fs.existsSync(bundledSignaturePath) ? bundledSignaturePath : null);
  if (signature) doc.image(signature, signatureX + 22, y + 22, { fit: [140, 42], align: 'center', valign: 'center' });
  line(doc, signatureX + 20, y + 66, page.right - 10, y + 66, '#111', 0.6);
  doc.fillColor('#111').font('Helvetica-Bold').fontSize(8).text('Authorised Signatory', signatureX, y + 70, { width: signatureWidth, align: 'center' });
}

async function writePledgeLoanInvoice(res, loan, businessSettings = {}) {
  const qr = await qrImage(loan);
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
  drawFooter(doc, loan, businessSettings, qr);
  doc.end();
}

module.exports = { writePledgeLoanInvoice, qrPayload };
