const test = require('node:test');
const assert = require('node:assert/strict');
const ExcelJS = require('exceljs');
const JSZip = require('jszip');

const { buildExcelExport } = require('../src/lib/excel-export');

test('writes a professional multi-sheet cashbook workbook with typed dates and balances', async () => {
  const workbookBytes = await buildExcelExport({
    title: 'Kusum ERP - Export validation',
    filename: 'validation.xlsx',
    columns: [{ key: 'date', label: 'Date', type: 'date', width: 14 }],
    rows: [],
    sheets: [
      {
        name: 'Cash', title: 'Daily Cashbook - Cash entries', subtitle: 'Windows local dates',
        columns: [
          { key: 'entryDate', label: 'Date', type: 'date', width: 14 },
          { key: 'runningBalance', label: 'Running balance', type: 'currency', width: 18 }
        ],
        rows: [{ entryDate: '2026-09-01', runningBalance: 150 }],
        infoRows: [
          { label: 'Opening balance', value: 100, type: 'currency' },
          { label: 'Closing balance', value: 150, type: 'currency' }
        ]
      },
      {
        name: 'UPI', title: 'Daily Cashbook - UPI entries', subtitle: 'No entries',
        columns: [{ key: 'entryDate', label: 'Date', type: 'date', width: 14 }],
        rows: [],
        infoRows: [{ label: 'Opening balance', value: 25, type: 'currency' }]
      }
    ]
  });

  assert.ok(workbookBytes.length > 4000);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(workbookBytes);

  assert.deepEqual(workbook.worksheets.map((sheet) => sheet.name), ['Cash', 'UPI']);
  const cash = workbook.getWorksheet('Cash');
  assert.equal(cash.getCell('A1').value, 'Daily Cashbook - Cash entries');
  assert.equal(cash.getCell('B3').value, 100);
  assert.equal(cash.getCell('B7').value, 150);
  assert.equal(cash.getCell('A7').numFmt, 'd-mmm-yy');
  assert.equal(workbook.getWorksheet('UPI').getCell('B3').value, 25);
});

test('uses one standard AutoFilter per populated worksheet without broken Excel Tables', async () => {
  const workbookBytes = await buildExcelExport({
    title: 'Kusum ERP - Excel compatibility validation',
    columns: [{ key: 'identifier', label: 'Barcode', type: 'identifier', width: 16 }],
    rows: [],
    sheets: [
      {
        name: 'Populated register',
        title: 'Populated register',
        subtitle: 'Excel compatibility validation',
        columns: [
          { key: 'identifier', label: 'Barcode', type: 'identifier', width: 16 },
          { key: 'amount', label: 'Amount', type: 'currency', width: 18 }
        ],
        rows: [{ identifier: 'G 00001', amount: 100 }],
        infoRows: [{ label: 'Records', value: 1, type: 'integer' }]
      },
      {
        name: 'Empty register',
        title: 'Empty register',
        subtitle: 'Excel compatibility validation',
        columns: [{ key: 'identifier', label: 'Barcode', type: 'identifier', width: 16 }],
        rows: [],
        infoRows: []
      }
    ]
  });

  const archive = await JSZip.loadAsync(workbookBytes);
  const zipEntries = Object.keys(archive.files);
  assert.equal(zipEntries.some((name) => name.startsWith('xl/tables/')), false, 'exports must not contain overlapping Excel Table definitions');

  const populatedXml = await archive.file('xl/worksheets/sheet1.xml').async('string');
  const emptyXml = await archive.file('xl/worksheets/sheet2.xml').async('string');
  assert.equal((populatedXml.match(/<autoFilter\b/g) || []).length, 1, 'a populated register needs one standard AutoFilter');
  assert.equal((emptyXml.match(/<autoFilter\b/g) || []).length, 0, 'an empty register must not have a dangling AutoFilter');
});

test('writes a plain CA register without colours or filter arrows, with working grand-total formulas', async () => {
  const workbookBytes = await buildExcelExport({
    title: 'Kusum ERP - CA register validation',
    columns: [], rows: [],
    sheets: [{
      name: 'Sales Register',
      title: '01. Sales Register',
      subtitle: 'From    1-Sep-26   To   1-Sep-26',
      layout: 'ca-register',
      columns: [
        { key: 'date', label: 'Date', type: 'date', width: 14 },
        { key: 'document', label: 'Doc-no', type: 'identifier', width: 18 },
        { key: 'weight', label: 'Net-wt', type: 'weight', width: 13 },
        { key: 'amount', label: 'Net-amt', type: 'currency', width: 18 }
      ],
      rows: [{ date: '2026-09-01', document: 'INV-1', weight: 2.5, amount: 1500 }],
      totalKeys: ['weight', 'amount']
    }]
  });

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(workbookBytes);
  const sheet = workbook.getWorksheet('Sales Register');
  assert.equal(sheet.autoFilter, undefined);
  assert.equal(sheet.getCell('A1').value, 'KUSUM JEWELLERS');
  assert.equal(sheet.getCell('A4').value, 'DATE');
  assert.equal(sheet.getCell('D6').value.formula, 'SUM(D5:D5)');
  assert.equal(sheet.getCell('D5').numFmt, '#,##0.00;[Red]-#,##0.00');
  assert.equal(sheet.getCell('A5').numFmt, 'd-mmm-yy');
  assert.equal(sheet.getCell('A4').fill.fgColor?.argb, undefined);
});

test('renders the compact customer ledger register without filters or unnecessary columns', async () => {
  const workbookBytes = await buildExcelExport({
    title: 'Kusum ERP - Customer ledger validation',
    columns: [], rows: [],
    sheets: [{
      name: 'Customer ledger',
      title: 'Customer Ledger Register',
      subtitle: 'From    1-Sep-26   To   30-Sep-26',
      layout: 'ca-register',
      columns: [
        { key: 'srNo', label: 'Sr No.', type: 'integer', width: 9 },
        { key: 'date', label: 'Date', type: 'date', width: 14 },
        { key: 'customerName', label: 'Customer name', type: 'text', width: 26 },
        { key: 'customerPhone', label: 'Phone no.', type: 'identifier', width: 16 },
        { key: 'due', label: 'Due', type: 'currency', width: 16 }
      ],
      rows: [{ srNo: 1, date: '2026-09-01', customerName: 'Ram Sharma', customerPhone: '9876543210', due: 125 }]
    }]
  });

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(workbookBytes);
  const sheet = workbook.getWorksheet('Customer ledger');
  assert.equal(sheet.autoFilter, undefined);
  assert.equal(sheet.getCell('A1').value, 'KUSUM JEWELLERS');
  assert.equal(sheet.getCell('A3').value, 'From    1-Sep-26   To   30-Sep-26');
  assert.equal(sheet.getCell('B5').numFmt, 'd-mmm-yy');
  assert.deepEqual(['A4', 'B4', 'C4', 'D4', 'E4'].map((cell) => sheet.getCell(cell).value), ['SR NO.', 'DATE', 'CUSTOMER NAME', 'PHONE NO.', 'DUE']);
  assert.equal(sheet.getCell('D5').text, '9876543210');
  assert.equal(sheet.getCell('E5').numFmt, '#,##0.00;[Red]-#,##0.00');
});

test('preserves financial-year Sales and URD document numbers in plain CA registers', async () => {
  const documentColumn = { key: 'documentNumber', label: 'Doc-no', type: 'identifier', width: 22 };
  const workbookBytes = await buildExcelExport({
    title: 'Kusum ERP - Document number validation',
    columns: [], rows: [],
    sheets: [
      {
        name: 'Sales Register', title: '01. Sales Register', subtitle: 'From    1-Apr-26   To   31-Mar-27', layout: 'ca-register',
        columns: [{ key: 'date', label: 'Date', type: 'date', width: 14 }, documentColumn],
        rows: [{ date: '2026-04-01', documentNumber: 'SB/26-27/00001' }]
      },
      {
        name: 'URD Purchase Register', title: '03. URD Purchase', subtitle: 'From    1-Apr-26   To   31-Mar-27', layout: 'ca-register',
        columns: [{ key: 'date', label: 'Date', type: 'date', width: 14 }, documentColumn],
        rows: [{ date: '2026-04-01', documentNumber: 'UR/26-27/00001' }]
      }
    ]
  });

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(workbookBytes);
  assert.equal(workbook.getWorksheet('Sales Register').getCell('B5').text, 'SB/26-27/00001');
  assert.equal(workbook.getWorksheet('URD Purchase Register').getCell('B5').text, 'UR/26-27/00001');
  assert.equal(workbook.getWorksheet('Sales Register').autoFilter, undefined);
  assert.equal(workbook.getWorksheet('URD Purchase Register').autoFilter, undefined);
});
