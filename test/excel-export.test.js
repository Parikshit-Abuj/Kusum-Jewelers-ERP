const test = require('node:test');
const assert = require('node:assert/strict');
const ExcelJS = require('exceljs');

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
