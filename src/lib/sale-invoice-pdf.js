const PDFDocument = require('pdfkit');

function currency(value) {
  return `Rs. ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(Number(value || 0))}`;
}

function tableAmount(value) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(Number(value || 0));
}

function makingMethod(item) {
  const value = tableAmount(item.makingChargeValue);
  if (item.makingChargeType === 'PERCENTAGE') return `${value}%`;
  if (item.makingChargeType === 'PER_GRAM') return `Per g: ${value}`;
  return `Fixed: ${value}`;
}

function weight(value) {
  return `${Number(value || 0).toFixed(3)} g`;
}

function rule(doc, y) {
  doc.moveTo(42, y).lineTo(553, y).strokeColor('#d6d0c9').stroke();
}

function documentHeader(doc, sale, continuation = false) {
  const date = sale.saleDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  doc.fillColor('#1d1916').font('Helvetica-Bold').fontSize(19).text(continuation ? 'TAX INVOICE - CONTINUED' : 'TAX INVOICE', 42, 44);
  doc.fillColor('#6d655e').font('Helvetica').fontSize(9).text(continuation ? `Invoice ${sale.invoiceNumber}` : 'Original copy', 42, 70);
  doc.fillColor('#6d655e').font('Helvetica-Bold').fontSize(8).text('INVOICE NO.', 360, 48, { width: 185, align: 'right' });
  doc.fillColor('#1d1916').font('Helvetica-Bold').fontSize(11).text(sale.invoiceNumber, 360, 61, { width: 185, align: 'right' });
  doc.fillColor('#6d655e').font('Helvetica-Bold').fontSize(8).text('INVOICE DATE', 360, 82, { width: 185, align: 'right' });
  doc.fillColor('#1d1916').font('Helvetica').fontSize(10).text(date, 360, 95, { width: 185, align: 'right' });
  rule(doc, 112);
}

function tableHeader(doc, y) {
  doc.rect(42, y, 511, 22).fill('#f2eee8');
  doc.fillColor('#514a44').font('Helvetica-Bold').fontSize(7);
  doc.text('#', 48, y + 7, { width: 14, align: 'right' });
  doc.text('ITEM', 68, y + 7);
  doc.text('BARCODE', 188, y + 7);
  doc.text('PURITY', 253, y + 7);
  doc.text('WT.', 301, y + 7, { width: 46, align: 'right' });
  doc.text('QTY', 347, y + 7, { width: 29, align: 'right' });
  doc.text('RATE / G', 376, y + 7, { width: 56, align: 'right' });
  doc.text('MAKING', 432, y + 7, { width: 61, align: 'right' });
  doc.text('AMOUNT', 493, y + 7, { width: 52, align: 'right' });
}

function writeSaleInvoice(res, sale) {
  const doc = new PDFDocument({ size: 'A4', margin: 42, info: { Title: `Tax Invoice ${sale.invoiceNumber}` } });
  const filename = `${sale.invoiceNumber.replace(/[^A-Za-z0-9-]/g, '_')}.pdf`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  doc.pipe(res);

  documentHeader(doc, sale);
  doc.fillColor('#6d655e').font('Helvetica-Bold').fontSize(8).text('BILL TO', 42, 132);
  doc.fillColor('#1d1916').font('Helvetica-Bold').fontSize(12).text(sale.customer?.name || 'Walk-in customer', 42, 146);
  doc.font('Helvetica').fontSize(9);
  if (sale.customer?.phone) doc.text(sale.customer.phone, 42, 163);
  if (sale.customer?.address) doc.text(sale.customer.address, 42, sale.customer.phone ? 177 : 163, { width: 250 });
  const paymentLabel = String(sale.paymentMethod || '').replace('_', ' ');
  doc.fillColor('#6d655e').font('Helvetica-Bold').fontSize(8).text('PAYMENT METHOD', 360, 132, { width: 185, align: 'right' });
  doc.fillColor('#1d1916').font('Helvetica').fontSize(10).text(paymentLabel, 360, 146, { width: 185, align: 'right' });

  let y = 202;
  tableHeader(doc, y);
  y += 22;
  sale.items.forEach((item, index) => {
    const rowHeight = 38;
    if (y + rowHeight > 552) {
      doc.addPage();
      documentHeader(doc, sale, true);
      y = 132;
      tableHeader(doc, y);
      y += 22;
    }
    const product = item.product || {};
    doc.fillColor('#1d1916').font('Helvetica').fontSize(8);
    doc.text(String(index + 1), 48, y + 11, { width: 14, align: 'right' });
    doc.font('Helvetica-Bold').text(product.name || 'Jewellery item', 68, y + 6, { width: 114, height: 12, ellipsis: true });
    doc.font('Helvetica').fontSize(7).fillColor('#6d655e').text(product.category || '', 68, y + 20, { width: 114, height: 10, ellipsis: true });
    doc.fillColor('#1d1916').fontSize(8).text(product.barcode || product.sku || '', 188, y + 11, { width: 62, ellipsis: true });
    doc.text(product.purity || product.metal || '', 253, y + 11, { width: 45, ellipsis: true });
    doc.text(weight(item.weight || product.netWeight), 301, y + 11, { width: 46, align: 'right' });
    doc.text(String(item.quantity), 347, y + 11, { width: 29, align: 'right' });
    doc.text(tableAmount(item.metalRate || item.unitPrice), 376, y + 11, { width: 56, align: 'right', ellipsis: true });
    doc.text(tableAmount(item.makingCharge), 432, y + 6, { width: 61, align: 'right', ellipsis: true });
    doc.fillColor('#6d655e').fontSize(6.5).text(makingMethod(item), 432, y + 20, { width: 61, align: 'right', ellipsis: true });
    doc.fillColor('#1d1916').fontSize(8);
    doc.font('Helvetica-Bold').text(tableAmount(item.taxableAmount || item.lineTotal), 493, y + 11, { width: 52, align: 'right', ellipsis: true });
    rule(doc, y + rowHeight);
    y += rowHeight;
  });

  if (y + 190 > 710) {
    doc.addPage();
    documentHeader(doc, sale, true);
    y = 142;
  }
  const totalsX = 340;
  const totalsValueX = 455;
  const totalRow = (label, value, offset, emphasis = false) => {
    doc.fillColor('#514a44').font(emphasis ? 'Helvetica-Bold' : 'Helvetica').fontSize(emphasis ? 11 : 9).text(label, totalsX, y + offset);
    doc.fillColor('#1d1916').font(emphasis ? 'Helvetica-Bold' : 'Helvetica').fontSize(emphasis ? 12 : 9).text(value, totalsValueX, y + offset - (emphasis ? 2 : 0), { width: 90, align: 'right' });
  };
  totalRow('Subtotal', currency(sale.subtotal), 14);
  let offset = 34;
  if (Number(sale.discount) > 0) {
    totalRow('Discount', `- ${currency(sale.discount)}`, offset);
    offset += 20;
  }
  totalRow(`GST (${Number(sale.gstRate).toFixed(0)}%)`, currency(sale.gstAmount), offset);
  offset += 24;
  totalRow('Grand total', currency(sale.total), offset, true);
  offset += 29;
  if (Number(sale.urdOffset) > 0) {
    totalRow('URD adjustment', `- ${currency(sale.urdOffset)}`, offset);
    offset += 20;
    totalRow('Net payable', currency(Number(sale.total) - Number(sale.urdOffset)), offset, true);
    offset += 29;
  }
  totalRow('Amount paid', currency(sale.paid), offset);
  offset += 20;
  if (Number(sale.balance) > 0) totalRow('Balance due', currency(sale.balance), offset, true);

  doc.fillColor('#6d655e').font('Helvetica-Bold').fontSize(8).text('NOTES', 42, y + 14);
  doc.fillColor('#1d1916').font('Helvetica').fontSize(9).text(sale.notes || 'Please retain this invoice for future reference.', 42, y + 28, { width: 250, height: 58, ellipsis: true });
  const signatureY = 742;
  doc.fillColor('#6d655e').font('Helvetica').fontSize(8).text('Customer acknowledgement', 42, signatureY);
  doc.text('Authorised signatory', 412, signatureY, { width: 133, align: 'right' });
  doc.moveTo(42, signatureY - 12).lineTo(180, signatureY - 12).strokeColor('#bcb4ab').stroke();
  doc.moveTo(407, signatureY - 12).lineTo(545, signatureY - 12).strokeColor('#bcb4ab').stroke();
  doc.end();
}

module.exports = { writeSaleInvoice };
