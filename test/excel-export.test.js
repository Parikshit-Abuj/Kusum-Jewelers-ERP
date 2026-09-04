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
  assert.equal(cash.getCell('A7').numFmt, 'dd-mmm-yyyy');
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
      subtitle: 'From    01/09/2026   To   01/09/2026',
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
  assert.equal(sheet.getCell('A4').fill.fgColor?.argb, undefined);
});
