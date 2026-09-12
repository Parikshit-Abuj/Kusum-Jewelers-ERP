const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { createQrImage } = require('./qr-code');

const bundledSignaturePath = path.join(__dirname, '..', 'assets', 'kusum-authorised-signature.jpg');

// Standalone customer-order receipts use the original A4 printable layout:
// 42pt margins, a 511pt content width, and a lower signature footer. The
// sales invoice renderer remains on its established pre-printed coordinates.
const page = { left: 42, right: 553, width: 511, footerY: 700 };

function amount(value) {
  return new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(Number(value || 0));
}

function weight(value) {
  return `${Number(value || 0).toFixed(3)} g`;
}

function text(value, fallback = '-') {
  const clean = String(value ?? '').replace(/\s+/g, ' ').trim();
  return clean || fallback;
}

function dateOnly(value) {
  const raw = String(value ?? '').trim();
  const direct = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (direct) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${direct[3]}-${monthNames[Number(direct[2]) - 1] || direct[2]}-${direct[1]}`;
  }
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime())
    ? text(value)
    : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function dateTime(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime())
    ? text(value)
    : `${dateOnly(date)} ${date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
}

function methodLabel(value) {
  return ({
    CASH: 'Cash',
    UPI: 'UPI',
    CARD: 'Card',
    BANK_TRANSFER: 'Bank transfer',
    CREDIT: 'Credit',
    MIXED: 'Mixed'
  }[String(value || '').toUpperCase()] || text(value));
}

function paymentRows(order) {
  return (Array.isArray(order.cashbookEntries) ? order.cashbookEntries : [])
    .filter((entry) => Number(entry.amount || 0) > 0)
    .map((entry) => ({
      date: entry.entryDate || entry.createdAt,
      type: entry.type === 'OUT' ? 'Refund issued' : 'Advance received',
      method: methodLabel(entry.paymentMethod),
      amount: Number(entry.amount || 0)
    }));
}

function qrPayload(order, settings = {}) {
  const quoted = Number(order.quotedAmount || 0);
  const advance = Number(order.customerAdvance || 0);
  const refunded = Number(order.refundedAmount || 0);
  const due = order.status === 'CANCELLED' ? 0 : Math.max(0, quoted - advance);
  return [
    `${text(settings.shopName, 'Kusum Jewellers')} - CUSTOMER ORDER`,
    `Order: ${text(order.orderNumber)}`,
    `Customer: ${text(order.customer?.name, 'Walk-in customer')}`,
    `Item: ${text(order.itemName, 'Jewellery item')}`,
    `Metal/Purity: ${text(order.metal)}${order.purity ? ` / ${text(order.purity)}` : ''}`,
    `Pieces: ${Number(order.quantity || 1)}`,
    `Target net wt: ${weight(order.targetNetWeight)}`,
    `Quoted amount: Rs. ${amount(quoted)}`,
    `Advance received: Rs. ${amount(advance)}`,
    ...(refunded > 0 ? [`Refunded: Rs. ${amount(refunded)}`] : []),
    `Balance due: Rs. ${amount(due)}`,
    `Status: ${text(order.status, 'OPEN')}`
  ].join('\n');
}

function compactQrPayload(order, settings = {}) {
  const quoted = Number(order.quotedAmount || 0);
  const advance = Number(order.customerAdvance || 0);
  const refunded = Number(order.refundedAmount || 0);
  const due = order.status === 'CANCELLED' ? 0 : Math.max(0, quoted - advance);
  return [
    `ORDER:${text(order.orderNumber)}`,
    `C:${text(order.customer?.name, 'Customer')}`,
    `I:${text(order.itemName, 'Jewellery item')}`,
    `M:${text(order.metal)}${order.purity ? `/${text(order.purity)}` : ''}`,
    `Q:${Number(order.quantity || 1)}`,
    `NW:${weight(order.targetNetWeight)}`,
    `QUOTE:${amount(quoted)}`,
    `ADV:${amount(advance)}`,
    ...(refunded > 0 ? [`REF:${amount(refunded)}`] : []),
    `DUE:${amount(due)}`,
    `S:${text(order.status, 'OPEN')}`
  ].join('|');
}

async function qrImage(order, settings) {
  return createQrImage({
    payload: qrPayload(order, settings),
    compactPayload: compactQrPayload(order, settings),
    label: `Customer order ${text(order.orderNumber)}`
  });
}

function line(doc, x1, y1, x2, y2, color = '#d6d0c9', width = 0.6) {
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

function drawHeader(doc, order, settings, continued = false) {
  const shopName = text(settings.shopName, 'Kusum Jewellers');
  doc.fillColor('#111').font('Helvetica-Bold').fontSize(19).text(shopName, page.left, 42, { width: 330 });
  doc.fillColor('#111').font('Helvetica').fontSize(8.5);
  const address = String(settings.shopAddress || '').trim();
  const phones = [settings.primaryPhone, settings.secondaryPhone].filter(Boolean).join('  -  ');
  let contactY = 66;
  if (address) { doc.text(address, page.left, contactY, { width: 350 }); contactY += 12; }
  if (phones) { doc.text(phones, page.left, contactY, { width: 350, ellipsis: true }); contactY += 12; }
  if (settings.gstin) {
    doc.text(`GSTIN: ${settings.gstin}${settings.panNumber ? `  -  PAN: ${settings.panNumber}` : ''}`, page.left, contactY, { width: 350, ellipsis: true });
  }
  const status = text(order.status, 'OPEN').toUpperCase();
  const title = continued ? 'CUSTOMER ORDER - CONTINUED' : `CUSTOMER ORDER - ${status}`;
  const headerRight = page.right - 184;
  doc.fillColor('#111').font('Helvetica-Bold').fontSize(12).text(title, headerRight, 44, { width: 184, align: 'right', ellipsis: true });
  doc.fillColor('#111').font('Helvetica').fontSize(8.5).text(`Order ${text(order.orderNumber)}`, headerRight, 66, { width: 184, align: 'right' });
  doc.text(`Order date ${dateTime(order.orderDate)}`, headerRight, 79, { width: 184, align: 'right' });
  line(doc, page.left, 101, page.right, 101, '#b88732', 1.1);
}

function drawCustomerAndOrder(doc, order, y) {
  y = sectionHeading(doc, 'Customer and order', y);
  const top = y;
  const height = 78;
  const split = 310;
  box(doc, page.left, top, page.width, height);
  vertical(doc, split, top, height);
  const leftRows = [
    ['Name', text(order.customer?.name, 'Walk-in customer')],
    ['Mobile', text(order.customer?.phone)],
    ['Address', text(order.customer?.address)]
  ];
  const rightRows = [
    ['Order No.', text(order.orderNumber)],
    ['Status', text(order.status, 'OPEN')],
    ['Due date', order.dueDate ? dateOnly(order.dueDate) : '-'],
    ['Given to', text(order.supplier?.name, 'Not assigned')]
  ];
  const drawRows = (rows, labelX, valueX, width) => rows.forEach(([label, value], index) => {
    const rowY = top + 7 + index * 17;
    doc.fillColor('#111').font('Helvetica-Bold').fontSize(7.6).text(`${label}:`, labelX, rowY, { width: 60 });
    doc.font('Helvetica').fontSize(8.4).text(value, valueX, rowY - 1, { width, ellipsis: true });
  });
  drawRows(leftRows, page.left + 9, page.left + 69, split - page.left - 82);
  drawRows(rightRows, split + 10, split + 72, page.right - split - 84);
  return top + height + 14;
}

function drawOrderItem(doc, order, y) {
  y = sectionHeading(doc, 'Ordered jewellery', y);
  const top = y;
  const headerHeight = 24;
  const rowHeight = 40;
  const columns = [
    ['DESCRIPTION', 175, 'left'],
    ['METAL / PURITY', 90, 'left'],
    ['PCS', 40, 'right'],
    ['GROSS WT.', 68, 'right'],
    ['NET WT.', 68, 'right'],
    ['QUOTED AMOUNT', 70, 'right']
  ];
  const tableHeight = headerHeight + rowHeight;
  doc.rect(page.left, top, page.width, headerHeight).fill('#f2eee8');
  box(doc, page.left, top, page.width, tableHeight);
  const starts = [];
  let x = page.left;
  columns.forEach(([label, width, align], index) => {
    starts.push(x);
    if (index) vertical(doc, x, top, tableHeight);
    doc.fillColor('#111').font('Helvetica-Bold').fontSize(7).text(label, x + 4, top + 8, { width: width - 8, align, ellipsis: true });
    x += width;
  });
  line(doc, page.left, top + headerHeight, page.right, top + headerHeight, '#111', 0.45);
  const description = text(order.itemName, 'Jewellery item');
  doc.fillColor('#111').font('Helvetica-Bold').fontSize(8.4).text(description, starts[0] + 5, top + headerHeight + 8, { width: columns[0][1] - 10, ellipsis: true });
  doc.font('Helvetica').fontSize(7.6).text(text(order.category), starts[0] + 5, top + headerHeight + 22, { width: columns[0][1] - 10, ellipsis: true });
  const metalPurity = `${text(order.metal)}${order.purity ? ` / ${text(order.purity)}` : ''}`;
  doc.font('Helvetica').fontSize(8).text(metalPurity, starts[1] + 5, top + headerHeight + 13, { width: columns[1][1] - 10, ellipsis: true });
  doc.text(String(order.quantity || 1), starts[2] + 5, top + headerHeight + 13, { width: columns[2][1] - 10, align: 'right' });
  doc.text(weight(order.targetGrossWeight), starts[3] + 5, top + headerHeight + 13, { width: columns[3][1] - 10, align: 'right' });
  doc.text(weight(order.targetNetWeight), starts[4] + 5, top + headerHeight + 13, { width: columns[4][1] - 10, align: 'right' });
  doc.font('Helvetica-Bold').fontSize(8.3).text(`Rs. ${amount(order.quotedAmount)}`, starts[5] + 5, top + headerHeight + 13, { width: columns[5][1] - 10, align: 'right', ellipsis: true });
  return top + tableHeight + 18;
}

function drawSummary(doc, order, y) {
  y = sectionHeading(doc, 'Order summary', y);
  const top = y;
  const height = 112;
  const split = 340;
  const quoted = Number(order.quotedAmount || 0);
  const advance = Number(order.customerAdvance || 0);
  const refunded = Number(order.refundedAmount || 0);
  const due = order.status === 'CANCELLED' ? 0 : Math.max(0, quoted - advance);
  box(doc, page.left, top, page.width, height);
  vertical(doc, split, top, height);
  const leftRows = [
    ['Quoted amount', `Rs. ${amount(quoted)}`],
    ['Advance received', `Rs. ${amount(advance)}`],
    ['Refunds issued', `Rs. ${amount(refunded)}`],
    ['Balance due', `Rs. ${amount(due)}`]
  ];
  leftRows.forEach(([label, value], index) => {
    const rowY = top + 9 + index * 23;
    const emphasis = label === 'Balance due';
    doc.fillColor('#111').font(emphasis ? 'Helvetica-Bold' : 'Helvetica').fontSize(emphasis ? 9.2 : 8.6).text(label, page.left + 10, rowY, { width: 150 });
    doc.font(emphasis ? 'Helvetica-Bold' : 'Helvetica').fontSize(emphasis ? 9.2 : 8.6).text(value, 248, rowY, { width: split - 258, align: 'right' });
    if (emphasis) line(doc, page.left, rowY - 4, split, rowY - 4, '#111', 0.45);
  });
  const rightRows = [
    ['Advance method', methodLabel(order.advancePaymentMethod)],
    ['Seller / supplier', text(order.supplier?.name, 'Not assigned')],
    ['Narration', text(order.notes)]
  ];
  rightRows.forEach(([label, value], index) => {
    const rowY = top + 10 + index * 27;
    doc.fillColor('#111').font('Helvetica-Bold').fontSize(8).text(`${label}:`, split + 10, rowY, { width: 92 });
    doc.font('Helvetica').fontSize(8.2).text(value, split + 105, rowY - 1, { width: page.right - split - 116, height: 20, ellipsis: true });
  });
  return top + height + 14;
}

function drawPaymentHistory(doc, order, settings, y) {
  const rows = paymentRows(order);
  let currentY = sectionHeading(doc, 'Advance payment history', y);
  if (!rows.length) {
    doc.fillColor('#111').font('Helvetica').fontSize(9).text('No advance payment recorded.', page.left, currentY);
    return currentY + 30;
  }

  const headerHeight = 24;
  const rowHeight = 20;
  const typeBoundary = page.left + 95;
  const methodBoundary = page.left + 198;
  const amountBoundary = page.right - 155;
  const xPositions = [page.left, typeBoundary, methodBoundary, amountBoundary, page.right];
  const drawTableHeader = () => {
    doc.rect(page.left, currentY, page.width, headerHeight).fill('#f2eee8');
    box(doc, page.left, currentY, page.width, headerHeight);
    xPositions.slice(1, -1).forEach((x) => vertical(doc, x, currentY, headerHeight));
    const heads = [
      ['DATE', page.left + 8, 87, 'left'],
      ['TYPE', typeBoundary + 8, 87, 'left'],
      ['METHOD', methodBoundary + 8, amountBoundary - methodBoundary - 16, 'left'],
      ['AMOUNT', amountBoundary + 10, page.right - amountBoundary - 18, 'right']
    ];
    heads.forEach(([label, x, width, align]) => doc.fillColor('#111').font('Helvetica-Bold').fontSize(7.2).text(label, x, currentY + 8, { width, align }));
    currentY += headerHeight;
  };

  drawTableHeader();
  rows.forEach((payment, index) => {
    if (currentY + rowHeight > page.footerY - 8) {
      doc.addPage();
      drawHeader(doc, order, settings, true);
      currentY = sectionHeading(doc, 'Advance payment history - continued', 123);
      drawTableHeader();
    }
    if (index % 2 === 0) doc.rect(page.left, currentY, page.width, rowHeight).fill('#fcfaf6');
    box(doc, page.left, currentY, page.width, rowHeight, 0.45);
    xPositions.slice(1, -1).forEach((x) => vertical(doc, x, currentY, rowHeight, '#111', 0.4));
    doc.fillColor('#111').font('Helvetica').fontSize(8.1).text(dateOnly(payment.date), page.left + 8, currentY + 6, { width: 87, ellipsis: true });
    doc.text(payment.type, typeBoundary + 8, currentY + 6, { width: 87, ellipsis: true });
    doc.text(payment.method, methodBoundary + 8, currentY + 6, { width: amountBoundary - methodBoundary - 16, ellipsis: true });
    doc.font('Helvetica-Bold').text(`Rs. ${amount(payment.amount)}`, amountBoundary + 10, currentY + 6, { width: page.right - amountBoundary - 18, align: 'right', ellipsis: true });
    currentY += rowHeight;
  });
  doc.fillColor('#111').font('Helvetica-Bold').fontSize(9).text('Total advances received', page.left + 8, currentY + 7);
  doc.text(`Rs. ${amount(order.customerAdvance)}`, amountBoundary + 10, currentY + 7, { width: page.right - amountBoundary - 18, align: 'right' });
  return currentY + 28;
}

function drawFooter(doc, order, settings, qr) {
  const y = page.footerY;
  const height = 96;
  const qrSplit = page.left + 100;
  const authorisedSplit = page.right - 210;
  box(doc, page.left, y, page.width, height);
  vertical(doc, qrSplit, y, height);
  vertical(doc, authorisedSplit, y, height);
  if (qr) {
    doc.image(qr, page.left + 14, y + 6, { fit: [58, 58] });
    doc.fillColor('#111').font('Helvetica-Bold').fontSize(6.6).text('SCAN ORDER DETAILS', page.left + 4, y + 69, { width: qrSplit - page.left - 8, align: 'center' });
  }
  const customerX = qrSplit;
  const customerWidth = authorisedSplit - qrSplit;
  doc.fillColor('#111').font('Helvetica-Bold').fontSize(8.2).text('Customer signature', customerX + 10, y + 20, { width: customerWidth - 20, align: 'center' });
  line(doc, customerX + 16, y + 60, authorisedSplit - 16, y + 60, '#111', 0.6);
  doc.fillColor('#111').font('Helvetica').fontSize(7.4).text('Customer acknowledgement', customerX + 10, y + 67, { width: customerWidth - 20, align: 'center' });
  doc.fillColor('#111').font('Helvetica').fontSize(6.8).text(
    order.status === 'CANCELLED'
      ? 'Order cancelled; any advance refund is shown above.'
      : 'This document records a customer order and is not a tax invoice.',
    customerX + 10, y + 79, { width: customerWidth - 20, height: 12, align: 'center', ellipsis: true }
  );
  const signatureX = authorisedSplit;
  const signatureWidth = page.right - authorisedSplit;
  doc.fillColor('#111').font('Helvetica-Bold').fontSize(9.2).text(`For ${text(settings.shopName, 'Kusum Jewellers')}`, signatureX + 10, y + 6, { width: signatureWidth - 20, align: 'center' });
  const signature = settings.signatureImage ? Buffer.from(settings.signatureImage) : (fs.existsSync(bundledSignaturePath) ? bundledSignaturePath : null);
  if (signature) doc.image(signature, signatureX + 35, y + 20, { fit: [140, 36], align: 'center', valign: 'center' });
  line(doc, signatureX + 20, y + 61, page.right - 10, y + 61, '#111', 0.6);
  doc.fillColor('#111').font('Helvetica-Bold').fontSize(8).text('Authorised Signatory', signatureX, y + 68, { width: signatureWidth, align: 'center' });
}

async function writeCustomerOrderInvoice(res, order, businessSettings = {}) {
  const settings = businessSettings || {};
  const doc = new PDFDocument({
    size: 'A4',
    margin: 0,
    info: {
      Title: `Customer Order ${order.orderNumber}`,
      Author: text(settings.shopName, 'Kusum Jewellers'),
      Subject: 'Customer order receipt'
    }
  });
  const filename = `${String(order.orderNumber || 'customer-order').replace(/[^A-Za-z0-9._-]/g, '_')}.pdf`;
  const qr = await qrImage(order, settings);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  doc.pipe(res);

  drawHeader(doc, order, settings);
  let y = drawCustomerAndOrder(doc, order, 123);
  y = drawOrderItem(doc, order, y);
  y = drawSummary(doc, order, y);
  y = drawPaymentHistory(doc, order, settings, y);
  if (y > page.footerY - 8) {
    doc.addPage();
    drawHeader(doc, order, settings, true);
  }
  drawFooter(doc, order, settings, qr);
  doc.end();
}

module.exports = { writeCustomerOrderInvoice, qrPayload, paymentRows };
