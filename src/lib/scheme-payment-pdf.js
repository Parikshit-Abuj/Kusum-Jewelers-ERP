const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const bundledSignaturePath = path.join(__dirname, '..', 'assets', 'kusum-authorised-signature.jpg');
// Match the sales invoice's A4 printable area without changing the sales PDF:
// 19pt side margins and the same lower signature region.
const page = { left: 19, right: 572, width: 553, footerY: 652 };

function money(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 2, minimumFractionDigits: 2
  }).format(Number(value || 0));
}

function text(value, fallback = '—') {
  const clean = String(value ?? '').replace(/\s+/g, ' ').trim();
  return clean || fallback;
}

function dateOnly(value) {
  const raw = String(value ?? '').trim();
  const direct = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (direct) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${direct[3]}-${monthNames[Number(direct[2]) - 1] || direct[2]}-${direct[1]}`;
  }
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime())
    ? text(value)
    : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function methodLabel(method) {
  return ({ CASH: 'Cash', UPI: 'UPI', CARD: 'Card', BANK_TRANSFER: 'Bank transfer' }[method] || text(method));
}

function paymentParts(installment = {}) {
  const saved = Array.isArray(installment.payments) && installment.payments.length
    ? installment.payments
    : Number(installment.paidAmount || 0) > 0 && installment.paymentDate
      ? [{ amount: installment.paidAmount, paymentDate: installment.paymentDate, paymentMethod: installment.paymentMethod }]
      : [];
  return saved
    .filter((part) => Number(part.amount || 0) > 0)
    .map((part) => ({
      amount: Number(part.amount || 0),
      paymentDate: part.paymentDate || installment.paymentDate || null,
      paymentMethod: part.paymentMethod || installment.paymentMethod || null
    }));
}

function totalParts(parts) {
  return parts.reduce((sum, part) => sum + Number(part.amount || 0), 0);
}

function paymentSummary(parts) {
  return parts.map((part) => `${methodLabel(part.paymentMethod)} ${money(part.amount)}`).join(' + ');
}

function drawLine(doc, y, color = '#d6d0c9', width = 0.6) {
  doc.save().moveTo(page.left, y).lineTo(page.right, y).lineWidth(width).strokeColor(color).stroke().restore();
}

function drawHeader(doc, settings, title, documentNo, date) {
  const shopName = text(settings.shopName, 'Kusum Jewellers');
  doc.fillColor('#1d1916').font('Helvetica-Bold').fontSize(19).text(shopName, page.left, 42, { width: 330 });
  doc.fillColor('#6d655e').font('Helvetica').fontSize(8.5);
  const contact = [settings.shopAddress, settings.primaryPhone, settings.secondaryPhone].filter(Boolean).join('  ·  ');
  if (contact) doc.text(contact, page.left, 66, { width: 350, ellipsis: true });
  if (settings.gstin) doc.text(`GSTIN: ${settings.gstin}${settings.panNumber ? `  ·  PAN: ${settings.panNumber}` : ''}`, page.left, 79, { width: 350, ellipsis: true });
  // The consolidated title is longer than the monthly title. Reduce only its
  // header size so it stays on one line and never collides with the receipt
  // number/date lines below it.
  const titleSize = title.length > 22 ? 10.5 : 13;
  doc.fillColor('#8b5e16').font('Helvetica-Bold').fontSize(titleSize).text(title, 369, 44, { width: 203, align: 'right', ellipsis: true });
  doc.fillColor('#6d655e').font('Helvetica').fontSize(8.5).text(`Receipt ${text(documentNo)}`, 369, 66, { width: 203, align: 'right' });
  doc.text(`Payment date ${dateOnly(date)}`, 369, 79, { width: 203, align: 'right' });
  drawLine(doc, 101, '#b88732', 1.1);
}

function drawCustomerAndPlan(doc, enrollment, y) {
  doc.fillColor('#8b5e16').font('Helvetica-Bold').fontSize(8).text('CUSTOMER AND SCHEME', page.left, y);
  drawLine(doc, y + 14, '#e5ddd1', 0.7);
  const top = y + 25;
  const half = page.width / 2;
  doc.roundedRect(page.left, top, page.width, 66, 8).fill('#f6f1e8');
  doc.fillColor('#756b61').font('Helvetica-Bold').fontSize(7).text('CUSTOMER', page.left + 12, top + 11);
  doc.fillColor('#1d1916').font('Helvetica-Bold').fontSize(11).text(text(enrollment.customer?.name, 'Customer'), page.left + 12, top + 26, { width: half - 28, ellipsis: true });
  doc.fillColor('#5e554d').font('Helvetica').fontSize(8.5).text(enrollment.customer?.phone || 'No mobile saved', page.left + 12, top + 43, { width: half - 28, ellipsis: true });
  doc.fillColor('#756b61').font('Helvetica-Bold').fontSize(7).text('SCHEME', page.left + half + 12, top + 11);
  doc.fillColor('#1d1916').font('Helvetica-Bold').fontSize(10).text(text(enrollment.schemePlan?.name, 'Savings scheme'), page.left + half + 12, top + 26, { width: half - 28, ellipsis: true });
  doc.fillColor('#5e554d').font('Helvetica').fontSize(8.5).text(`${text(enrollment.enrollmentNumber)} · ${enrollment.schemePlan?.durationMonths || 0} months`, page.left + half + 12, top + 43, { width: half - 28, ellipsis: true });
  return top + 88;
}

function drawSectionHeading(doc, label, y) {
  doc.fillColor('#8b5e16').font('Helvetica-Bold').fontSize(8).text(label.toUpperCase(), page.left, y);
  drawLine(doc, y + 14, '#e5ddd1', 0.7);
  return y + 25;
}

function drawSignatureFooter(doc, settings, note) {
  const y = page.footerY;
  drawLine(doc, y, '#b88732', 0.8);
  const signatureX = 389;
  doc.fillColor('#6d655e').font('Helvetica').fontSize(8).text(`For ${text(settings.shopName, 'Kusum Jewellers')}`, signatureX, y + 10, { width: 183, align: 'center' });
  const signature = settings.signatureImage ? Buffer.from(settings.signatureImage) : (fs.existsSync(bundledSignaturePath) ? bundledSignaturePath : null);
  if (signature) doc.image(signature, signatureX + 22, y + 22, { fit: [140, 42], align: 'center', valign: 'center' });
  doc.save().moveTo(signatureX + 20, y + 66).lineTo(page.right - 10, y + 66).lineWidth(0.6).strokeColor('#bcb4ab').stroke().restore();
  doc.fillColor('#6d655e').font('Helvetica-Bold').fontSize(8).text('Authorised Signatory', signatureX, y + 72, { width: 183, align: 'center' });
  doc.font('Helvetica').fontSize(7.5).text(note, page.left, y + 92, { width: 285, align: 'left', height: 24, ellipsis: true });
}

function drawPaymentParts(doc, parts, y) {
  y = drawSectionHeading(doc, 'Payment received', y);
  const top = y;
  const rowHeight = 24;
  doc.rect(page.left, top, page.width, 24).fill('#f6f1e8');
  doc.fillColor('#756b61').font('Helvetica-Bold').fontSize(7).text('PAYMENT DATE', page.left + 10, top + 8);
  doc.text('PAYMENT METHOD', page.left + 150, top + 8);
  doc.text('AMOUNT', 474, top + 8, { width: 90, align: 'right' });
  let rowY = top + 24;
  parts.forEach((part, index) => {
    if (index % 2 === 0) doc.rect(page.left, rowY, page.width, rowHeight).fill('#fcfaf6');
    doc.fillColor('#1d1916').font('Helvetica').fontSize(8.5).text(dateOnly(part.paymentDate), page.left + 10, rowY + 8, { width: 120, ellipsis: true });
    doc.text(methodLabel(part.paymentMethod), page.left + 150, rowY + 8, { width: 270, ellipsis: true });
    doc.font('Helvetica-Bold').text(money(part.amount), 474, rowY + 8, { width: 90, align: 'right' });
    rowY += rowHeight;
  });
  drawLine(doc, rowY, '#ded5c8', 0.45);
  doc.fillColor('#1d1916').font('Helvetica-Bold').fontSize(10).text('Total received', page.left + 10, rowY + 12);
  doc.text(money(totalParts(parts)), 454, rowY + 12, { width: 110, align: 'right' });
  return rowY + 42;
}

function writeResponse(res, doc, filename) {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  doc.pipe(res);
}

async function writeSchemeInstallmentReceipt(res, enrollment, installment, settings = {}) {
  const parts = paymentParts(installment);
  const paymentDate = parts.map((part) => part.paymentDate).filter(Boolean).sort().at(-1) || installment.paymentDate;
  const filename = `${String(enrollment.enrollmentNumber || 'scheme')}-month-${installment.installmentNumber}-receipt.pdf`.replace(/[^A-Za-z0-9._-]/g, '_');
  const doc = new PDFDocument({ size: 'A4', margin: 0, info: { Title: `Scheme Payment Receipt ${enrollment.enrollmentNumber} Month ${installment.installmentNumber}`, Author: text(settings.shopName, 'Kusum Jewellers') } });
  writeResponse(res, doc, filename);
  drawHeader(doc, settings, 'SCHEME PAYMENT RECEIPT', enrollment.enrollmentNumber, paymentDate);
  let y = drawCustomerAndPlan(doc, enrollment, 123);
  y = drawSectionHeading(doc, `Installment ${installment.installmentNumber} of ${enrollment.schemePlan?.durationMonths || '—'}`, y);
  doc.roundedRect(page.left, y, page.width, 62, 8).fill('#f6f1e8');
  doc.fillColor('#756b61').font('Helvetica-Bold').fontSize(7).text('DUE DATE', page.left + 12, y + 11);
  doc.fillColor('#1d1916').font('Helvetica-Bold').fontSize(11).text(dateOnly(installment.dueDate), page.left + 12, y + 27);
  doc.fillColor('#756b61').font('Helvetica-Bold').fontSize(7).text('PAID ON', page.left + 180, y + 11);
  doc.fillColor('#1d1916').font('Helvetica-Bold').fontSize(11).text(dateOnly(paymentDate), page.left + 180, y + 27);
  const amountX = page.right - 164;
  doc.fillColor('#756b61').font('Helvetica-Bold').fontSize(7).text('AMOUNT RECEIVED', amountX, y + 11);
  doc.fillColor('#8b5e16').font('Helvetica-Bold').fontSize(13).text(money(totalParts(parts)), amountX, y + 26, { width: 144, align: 'right' });
  y += 86;
  y = drawPaymentParts(doc, parts, y);
  if (installment.notes || enrollment.notes) {
    const narration = installment.notes || enrollment.notes;
    doc.fillColor('#5e554d').font('Helvetica-Bold').fontSize(8.5).text('Narration:', page.left, y);
    doc.font('Helvetica').text(text(narration), page.left + 52, y, { width: 459, height: 30, ellipsis: true });
  }
  drawSignatureFooter(doc, settings, 'Thank you. Please retain this receipt with your scheme passbook.');
  doc.end();
}

function drawTableHeader(doc, y) {
  doc.rect(page.left, y, page.width, 24).fill('#f6f1e8');
  doc.fillColor('#756b61').font('Helvetica-Bold').fontSize(7);
  doc.text('MONTH', page.left + 9, y + 8);
  doc.text('DUE DATE', page.left + 69, y + 8);
  doc.text('PAID ON', page.left + 150, y + 8);
  doc.text('PAYMENT METHOD', page.left + 235, y + 8);
  doc.text('AMOUNT', 474, y + 8, { width: 90, align: 'right' });
  return y + 24;
}

function drawContinuationHeader(doc, enrollment) {
  doc.fillColor('#1d1916').font('Helvetica-Bold').fontSize(12).text(text(enrollment.schemePlan?.name, 'Savings scheme'), page.left, 40, { width: 330, ellipsis: true });
  doc.fillColor('#6d655e').font('Helvetica').fontSize(8.5).text(`Consolidated payment receipt · ${text(enrollment.enrollmentNumber)}`, page.left, 58, { width: 400, ellipsis: true });
  drawLine(doc, 76, '#b88732', 0.8);
}

async function writeSchemeConsolidatedReceipt(res, enrollment, settings = {}) {
  const paidRows = (enrollment.installments || []).map((installment) => ({ installment, parts: paymentParts(installment) })).filter((row) => row.parts.length);
  const totalPaid = paidRows.reduce((sum, row) => sum + totalParts(row.parts), 0);
  const lastPaymentDate = paidRows.flatMap((row) => row.parts.map((part) => part.paymentDate)).filter(Boolean).sort().at(-1) || enrollment.startDate;
  const filename = `${String(enrollment.enrollmentNumber || 'scheme')}-consolidated-receipt.pdf`.replace(/[^A-Za-z0-9._-]/g, '_');
  const doc = new PDFDocument({ size: 'A4', margin: 0, info: { Title: `Consolidated Scheme Payment Receipt ${enrollment.enrollmentNumber}`, Author: text(settings.shopName, 'Kusum Jewellers') } });
  writeResponse(res, doc, filename);
  drawHeader(doc, settings, 'CONSOLIDATED SCHEME RECEIPT', enrollment.enrollmentNumber, lastPaymentDate);
  let y = drawCustomerAndPlan(doc, enrollment, 123);
  y = drawSectionHeading(doc, 'Payment summary', y);
  doc.roundedRect(page.left, y, page.width, 58, 8).fill('#f6f1e8');
  doc.fillColor('#756b61').font('Helvetica-Bold').fontSize(7).text('TOTAL RECEIVED', page.left + 12, y + 11);
  doc.fillColor('#8b5e16').font('Helvetica-Bold').fontSize(14).text(money(totalPaid), page.left + 12, y + 27);
  doc.fillColor('#756b61').font('Helvetica-Bold').fontSize(7).text('INSTALLMENTS PAID', page.left + 205, y + 11);
  doc.fillColor('#1d1916').font('Helvetica-Bold').fontSize(13).text(`${paidRows.length} / ${enrollment.schemePlan?.durationMonths || 0}`, page.left + 205, y + 27);
  doc.fillColor('#756b61').font('Helvetica-Bold').fontSize(7).text('BALANCE INSTALLMENTS', page.left + 370, y + 11);
  doc.fillColor('#1d1916').font('Helvetica-Bold').fontSize(13).text(String(Math.max(0, Number(enrollment.schemePlan?.durationMonths || 0) - paidRows.length)), page.left + 370, y + 27);
  y += 82;
  y = drawSectionHeading(doc, 'Installment payment history', y);
  y = drawTableHeader(doc, y);
  const contentBottom = page.footerY - 32;
  paidRows.forEach(({ installment, parts }, index) => {
    const rowHeight = 27;
    // Keep the fixed signature footer clear of the payment rows.
    if (y + rowHeight > contentBottom) {
      drawSignatureFooter(doc, settings, 'Continued on the next page.');
      doc.addPage();
      drawContinuationHeader(doc, enrollment);
      y = drawTableHeader(doc, 92);
    }
    if (index % 2 === 0) doc.rect(page.left, y, page.width, rowHeight).fill('#fcfaf6');
    const paymentDate = parts.map((part) => part.paymentDate).filter(Boolean).sort().at(-1) || installment.paymentDate;
    doc.fillColor('#1d1916').font('Helvetica').fontSize(8.5).text(`Month ${installment.installmentNumber}`, page.left + 9, y + 9, { width: 55, ellipsis: true });
    doc.text(dateOnly(installment.dueDate), page.left + 69, y + 9, { width: 72, ellipsis: true });
    doc.text(dateOnly(paymentDate), page.left + 150, y + 9, { width: 72, ellipsis: true });
    doc.text(paymentSummary(parts), page.left + 235, y + 9, { width: 205, ellipsis: true });
    doc.font('Helvetica-Bold').text(money(totalParts(parts)), 474, y + 9, { width: 90, align: 'right' });
    y += rowHeight;
  });
  // Leave room for the summary and narration before the fixed signature
  // footer. If the table reaches the bottom of the page, continue on a clean
  // page rather than letting those lines overlap the footer.
  const narratedRows = paidRows.filter(({ installment }) => installment.notes);
  let summaryY = y;
  if (summaryY + (narratedRows.length ? 100 : 44) > contentBottom) {
    drawSignatureFooter(doc, settings, 'Continued on the next page.');
    doc.addPage();
    drawContinuationHeader(doc, enrollment);
    summaryY = 92;
  }
  drawLine(doc, summaryY, '#ded5c8', 0.45);
  doc.fillColor('#5e554d').font('Helvetica').fontSize(8).text(
    paidRows.length ? 'This receipt consolidates the scheme payments recorded in the ERP for this customer.' : 'No installment payments have been recorded for this scheme yet.',
    page.left, summaryY + 14, { width: 330, height: 28, ellipsis: true }
  );
  if (narratedRows.length) {
    const startNarrationPage = (continuation = false) => {
      if (continuation) {
        drawSignatureFooter(doc, settings, 'Continued on the next page.');
        doc.addPage();
        drawContinuationHeader(doc, enrollment);
      }
      const headingY = continuation ? 92 : summaryY + 49;
      doc.fillColor('#8b5e16').font('Helvetica-Bold').fontSize(8).text('NARRATION', page.left, headingY);
      return headingY + 16;
    };
    let narrationY = startNarrationPage();
    narratedRows.forEach(({ installment }) => {
      if (narrationY + 28 > contentBottom) narrationY = startNarrationPage(true);
      const line = `Month ${installment.installmentNumber}: ${text(installment.notes)}`;
      doc.fillColor('#5e554d').font('Helvetica').fontSize(8.5).text(line, page.left, narrationY, { width: page.width, height: 28, ellipsis: true });
      narrationY += 28;
    });
  }
  drawSignatureFooter(doc, settings, 'Please retain this consolidated receipt with the customer scheme records.');
  doc.end();
}

module.exports = { writeSchemeInstallmentReceipt, writeSchemeConsolidatedReceipt, paymentParts };
