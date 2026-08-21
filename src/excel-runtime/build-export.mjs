import fs from 'node:fs/promises';
import ExcelJS from 'exceljs';

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) throw new Error('Usage: build-export.mjs <input.json> <output.xlsx>');

const payload = JSON.parse(await fs.readFile(inputPath, 'utf8'));
const columns = payload.columns || [];
const rows = payload.rows || [];
if (!columns.length) throw new Error('Excel export needs at least one column.');

const workbook = new ExcelJS.Workbook();
workbook.creator = 'Kusum Jewelers ERP';
workbook.created = new Date();
const sheet = workbook.addWorksheet('Data Export', {
  views: [{ state: 'frozen', ySplit: 4, showGridLines: false }]
});
sheet.columns = columns.map((column) => ({ key: column.key, width: column.width || 16 }));

const lastColumn = columns.length;
const headerRow = 4;
const dataStart = headerRow + 1;
const thinGoldBorder = {
  top: { style: 'thin', color: { argb: 'FFD2B77F' } },
  left: { style: 'thin', color: { argb: 'FFD2B77F' } },
  bottom: { style: 'thin', color: { argb: 'FFD2B77F' } },
  right: { style: 'thin', color: { argb: 'FFD2B77F' } }
};
const dataBorder = {
  bottom: { style: 'thin', color: { argb: 'FFE8E1D8' } }
};

function cellValue(value, type) {
  if (value === null || value === undefined) return '';
  if (type === 'date') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date;
  }
  if (['currency', 'number', 'weight'].includes(type)) return Number(value || 0);
  return String(value);
}

function numberFormat(type) {
  if (type === 'date') return 'yyyy-mm-dd';
  if (type === 'currency') return '₹#,##0.00';
  if (type === 'weight') return '0.000';
  if (type === 'number') return '#,##0.00';
  return undefined;
}

sheet.mergeCells(1, 1, 1, lastColumn);
const titleCell = sheet.getCell(1, 1);
titleCell.value = payload.title || 'Kusum Jewelers ERP Data Export';
titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF30251D' } };
titleCell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 16 };
titleCell.alignment = { horizontal: 'left', vertical: 'middle' };
sheet.getRow(1).height = 28;

sheet.mergeCells(2, 1, 2, lastColumn);
const subtitleCell = sheet.getCell(2, 1);
subtitleCell.value = payload.subtitle || 'Exported from Kusum Jewelers ERP';
subtitleCell.font = { color: { argb: 'FF756F69' }, italic: true, size: 10 };

const header = sheet.getRow(headerRow);
columns.forEach((column, index) => {
  const cell = header.getCell(index + 1);
  cell.value = column.label;
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD5A044' } };
  cell.font = { bold: true, color: { argb: 'FF271A05' } };
  cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  cell.border = thinGoldBorder;
});
header.height = 24;

if (rows.length) {
  rows.forEach((row, rowIndex) => {
    const excelRow = sheet.getRow(dataStart + rowIndex);
    columns.forEach((column, index) => {
      const cell = excelRow.getCell(index + 1);
      cell.value = cellValue(row[column.key], column.type);
      cell.border = dataBorder;
      cell.alignment = {
        vertical: 'middle',
        horizontal: ['currency', 'number', 'weight'].includes(column.type) ? 'right' : 'left'
      };
      const format = numberFormat(column.type);
      if (format) cell.numFmt = format;
    });
  });
  sheet.addTable({
    name: 'ExportDataTable',
    ref: `A${headerRow}`,
    headerRow: true,
    totalsRow: false,
    style: { theme: 'TableStyleLight9', showRowStripes: true },
    columns: columns.map((column) => ({ name: column.label })),
    rows: rows.map((row) => columns.map((column) => cellValue(row[column.key], column.type)))
  });
} else {
  sheet.mergeCells(dataStart, 1, dataStart, lastColumn);
  const emptyCell = sheet.getCell(dataStart, 1);
  emptyCell.value = 'No records matched the selected date range.';
  emptyCell.font = { color: { argb: 'FF756F69' }, italic: true };
}

await workbook.xlsx.writeFile(outputPath);
