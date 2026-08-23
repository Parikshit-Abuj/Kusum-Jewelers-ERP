import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const input = await FileBlob.load(process.argv[2]);
const workbook = await SpreadsheetFile.importXlsx(input);
const sheetInfo = await workbook.inspect({ kind: 'sheet', include: 'id,name' });
const table = await workbook.inspect({
  kind: 'table', range: 'Data Export!A1:S8', include: 'values,formulas',
  tableMaxRows: 8, tableMaxCols: 19, tableMaxCellChars: 80
});
const errors = await workbook.inspect({
  kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',
  options: { useRegex: true, maxResults: 50 }, summary: 'formula error scan'
});
const preview = await workbook.render({ sheetName: 'Data Export', range: 'A1:S8', scale: 1.25, format: 'png' });
await fs.writeFile(process.argv[3], new Uint8Array(await preview.arrayBuffer()));
console.log(JSON.stringify({ sheets: sheetInfo.ndjson, table: table.ndjson, errors: errors.ndjson }));
