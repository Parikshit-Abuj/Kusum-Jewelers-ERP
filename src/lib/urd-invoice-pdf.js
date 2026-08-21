const PDFDocument = require('pdfkit');

function currency(value) {
  return `Rs. ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(Number(value || 0))}`;
}

function tableAmount(value) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(Number(value || 0));
}

function weight(value) {
  return `${Number(value || 0).toFixed(3)} g`;
}

function line(doc, y) {
  doc.moveTo(42, y).lineTo(553, y).strokeColor('#d6d0c9').stroke();
}

function writeUrdPurchaseInvoice(res, purchase) {
  const doc = new PDFDocument({ size: 'A4', margin: 42, info: { Title: `URD Tax Invoice ${purchase.purchaseNumber}` } });
  const filename = `${purchase.purchaseNumber.replace(/[^A-Za-z0-9-]/g, '_')}.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  doc.pipe(res);

  doc.fillColor('#1d1916').font('Helvetica-Bold').fontSize(19).text('TAX INVOICE - URD PURCHASE', 42, 44);
  doc.fillColor('#6d655e').font('Helvetica').fontSize(9).text('Purchase of old jewellery / bullion from customer', 42, 70);
  line(doc, 88);

  doc.fillColor('#6d655e').font('Helvetica-Bold').fontSize(8).text('URD PURCHASE NO.', 42, 106);
  doc.fillColor('#1d1916').font('Helvetica-Bold').fontSize(11).text(purchase.purchaseNumber, 42, 120);
  doc.fillColor('#6d655e').font('Helvetica-Bold').fontSize(8).text('PURCHASE DATE', 320, 106);
  doc.fillColor('#1d1916').font('Helvetica').fontSize(11).text(purchase.purchaseDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), 320, 120);

  doc.fillColor('#6d655e').font('Helvetica-Bold').fontSize(8).text('PURCHASED FROM', 42, 156);
  doc.fillColor('#1d1916').font('Helvetica-Bold').fontSize(12).text(purchase.customer.name, 42, 170);
  doc.font('Helvetica').fontSize(9);
  if (purchase.customer.phone) doc.text(purchase.customer.phone, 42, 187);
  if (purchase.customer.address) doc.text(purchase.customer.address, 42, purchase.customer.phone ? 201 : 187, { width: 240 });

  const tableY = 238;
  doc.rect(42, tableY, 511, 22).fill('#f2eee8');
  doc.fillColor('#514a44').font('Helvetica-Bold').fontSize(8);
  doc.text('DESCRIPTION', 50, tableY + 7);
  doc.text('METAL / PURITY', 250, tableY + 7);
  doc.text('NET WT.', 360, tableY + 7, { width: 55, align: 'right' });
  doc.text('RATE / G', 425, tableY + 7, { width: 60, align: 'right' });
  doc.text('VALUATION', 486, tableY + 7, { width: 59, align: 'right' });
  const rowY = tableY + 31;
  doc.fillColor('#1d1916').font('Helvetica').fontSize(9);
  doc.text(purchase.description || 'Old jewellery purchase', 50, rowY, { width: 190 });
  doc.text(`${purchase.metal}${purchase.purity ? ` / ${purchase.purity}` : ''}`, 250, rowY, { width: 100 });
  doc.text(weight(purchase.netWeight), 360, rowY, { width: 55, align: 'right' });
  doc.text(tableAmount(purchase.ratePerGram), 425, rowY, { width: 60, align: 'right' });
  doc.font('Helvetica-Bold').text(tableAmount(purchase.totalAmount), 486, rowY, { width: 59, align: 'right' });
  line(doc, rowY + 24);

  const totalY = rowY + 45;
  doc.fillColor('#514a44').font('Helvetica').fontSize(10).text('Gross weight', 340, totalY);
  doc.fillColor('#1d1916').text(weight(purchase.grossWeight), 475, totalY, { width: 70, align: 'right' });
  doc.fillColor('#514a44').text('Valuation amount', 340, totalY + 22);
  doc.fillColor('#1d1916').font('Helvetica-Bold').fontSize(13).text(currency(purchase.totalAmount), 455, totalY + 20, { width: 90, align: 'right' });

  const statusY = totalY + 74;
  line(doc, statusY);
  if (purchase.notes) {
    doc.fillColor('#6d655e').font('Helvetica-Bold').fontSize(8).text('NOTES', 42, statusY + 16);
    doc.fillColor('#1d1916').font('Helvetica').fontSize(9).text(purchase.notes, 42, statusY + 29, { width: 503 });
  }

  doc.fillColor('#6d655e').font('Helvetica').fontSize(8).text('Customer acknowledgement', 42, 742);
  doc.text('Authorised signatory', 412, 742, { width: 133, align: 'right' });
  doc.moveTo(42, 730).lineTo(180, 730).strokeColor('#bcb4ab').stroke();
  doc.moveTo(407, 730).lineTo(545, 730).strokeColor('#bcb4ab').stroke();
  doc.end();
}

module.exports = { writeUrdPurchaseInvoice };
