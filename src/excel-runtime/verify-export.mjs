import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

const input = await FileBlob.load(process.argv[2]);
const workbook = await SpreadsheetFile.importXlsx(input);
const check = await workbook.inspect({ kind: 'table', range: 'Data Export!A1:S9', include: 'values,formulas', tableMaxRows: 9, tableMaxCols: 19 });
console.log(check.ndjson);
const errors = await workbook.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A', options: { useRegex: true, maxResults: 50 }, summary: 'formula error scan' });
console.log(errors.ndjson);
const preview = await workbook.render({ sheetName: 'Data Export', range: 'A1:S9', scale: 1.2, format: 'png' });
await fs.writeFile(process.argv[3], new Uint8Array(await preview.arrayBuffer()));
