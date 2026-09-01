import ExcelJS from 'exceljs';

const inputPath = process.argv[2];
if (!inputPath) {
  throw new Error('Usage: node src/excel-runtime/verify-export.mjs <workbook.xlsx>');
}

const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile(inputPath);

const formulaErrors = [];
for (const worksheet of workbook.worksheets) {
  worksheet.eachRow({ includeEmpty: false }, (row) => {
    row.eachCell({ includeEmpty: false }, (cell) => {
      const text = String(cell.text || '');
      if (/#(REF!|DIV\/0!|VALUE!|NAME\?|N\/A)/.test(text)) {
        formulaErrors.push(`${worksheet.name}!${cell.address}: ${text}`);
      }
    });
  });
}

console.log(`Workbook verified: ${workbook.worksheets.length} sheet(s): ${workbook.worksheets.map((sheet) => sheet.name).join(', ')}`);
if (formulaErrors.length) {
  throw new Error(`Formula errors found:\n${formulaErrors.slice(0, 50).join('\n')}`);
}
