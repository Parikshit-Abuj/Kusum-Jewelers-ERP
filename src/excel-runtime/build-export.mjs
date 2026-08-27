import fs from 'node:fs/promises';
import ExcelJS from 'exceljs';

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) throw new Error('Usage: build-export.mjs <input.json> <output.xlsx>');

const payload = JSON.parse(await fs.readFile(inputPath, 'utf8'));

const thinGoldBorder = {
  top: { style: 'thin', color: { argb: 'FFD2B77F' } },
  left: { style: 'thin', color: { argb: 'FFD2B77F' } },
  bottom: { style: 'thin', color: { argb: 'FFD2B77F' } },
  right: { style: 'thin', color: { argb: 'FFD2B77F' } }
};
const dataBorder = { bottom: { style: 'thin', color: { argb: 'FFE8E1D8' } } };
const summaryLabelFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF4DE' } };
const summaryValueFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFBF1' } };

function cellValue(value, type) {
  if (value === null || value === undefined || (type === 'text' && value === '')) return null;
  if (type === 'date') {
    if (value instanceof Date) return value;
    const dateText = String(value);
    const date = /^\d{4}-\d{2}-\d{2}$/.test(dateText)
      ? new Date(`${dateText}T12:00:00`)
      : new Date(value);
    return Number.isNaN(date.getTime()) ? dateText : date;
  }
  if (['currency', 'number', 'integer', 'weight'].includes(type)) return Number(value || 0);
  return String(value);
}

function numberFormat(type) {
  if (type === 'date') return 'yyyy-mm-dd';
  if (type === 'currency') return '₹#,##0.00';
  if (type === 'weight') return '0.000';
  if (type === 'integer') return '#,##0';
  if (type === 'number') return '#,##0.00';
  return undefined;
}

function applyCellFormat(cell, type, alignment = 'left') {
  cell.alignment = { vertical: 'middle', horizontal: alignment };
  const format = numberFormat(type);
  cell.numFmt = format || (type === 'text' ? '@' : 'General');
}

function sheetName(name, index, names) {
  const base = String(name || `Sheet ${index + 1}`).replace(/[\\/:*?\[\]]/g, ' ').trim() || `Sheet ${index + 1}`;
  let candidate = base.slice(0, 31);
  let sequence = 2;
  while (names.has(candidate.toLowerCase())) {
    const suffix = ` ${sequence++}`;
    candidate = `${base.slice(0, 31 - suffix.length)}${suffix}`;
  }
  names.add(candidate.toLowerCase());
  return candidate;
}

function mergeAcross(sheet, row, lastColumn) {
  if (lastColumn > 1) sheet.mergeCells(row, 1, row, lastColumn);
}

function addWorksheet(workbook, spec, index, usedNames) {
  const columns = spec.columns || [];
  const rows = spec.rows || [];
  if (!columns.length) throw new Error(`Excel sheet "${spec.name || index + 1}" needs at least one column.`);

  const lastColumn = columns.length;
  const infoRows = spec.infoRows || [];
  const infoPairsPerRow = Math.max(1, Math.floor(lastColumn / 2));
  const infoRowCount = Math.ceil(infoRows.length / infoPairsPerRow);
  const headerRow = 4 + infoRowCount;
  const dataStart = headerRow + 1;
  const sheet = workbook.addWorksheet(sheetName(spec.name, index, usedNames), {
    views: [{ state: 'frozen', ySplit: headerRow, showGridLines: false }]
  });
  sheet.columns = columns.map((column) => ({ key: column.key, width: column.width || 16 }));

  mergeAcross(sheet, 1, lastColumn);
  const titleCell = sheet.getCell(1, 1);
  titleCell.value = spec.title || payload.title || 'Kusum ERP Data Export';
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF30251D' } };
  titleCell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 16 };
  titleCell.alignment = { horizontal: 'left', vertical: 'middle' };
  sheet.getRow(1).height = 28;

  mergeAcross(sheet, 2, lastColumn);
  const subtitleCell = sheet.getCell(2, 1);
  subtitleCell.value = spec.subtitle || payload.subtitle || 'Exported from Kusum ERP';
  subtitleCell.font = { color: { argb: 'FF756F69' }, italic: true, size: 10 };

  infoRows.forEach((item, itemIndex) => {
    const rowNumber = 3 + Math.floor(itemIndex / infoPairsPerRow);
    const labelColumn = 1 + (itemIndex % infoPairsPerRow) * 2;
    const valueColumn = labelColumn + 1;
    const labelCell = sheet.getCell(rowNumber, labelColumn);
    const valueCell = sheet.getCell(rowNumber, valueColumn);
    labelCell.value = item.label;
    labelCell.fill = summaryLabelFill;
    labelCell.font = { bold: true, color: { argb: 'FF6E4B12' }, size: 10 };
    labelCell.alignment = { horizontal: 'left', vertical: 'middle' };
    valueCell.value = cellValue(item.value, item.type);
    valueCell.fill = summaryValueFill;
    valueCell.font = { bold: true, color: { argb: 'FF30251D' }, size: 10 };
    applyCellFormat(valueCell, item.type, ['currency', 'number', 'integer', 'weight'].includes(item.type) ? 'right' : 'left');
  });

  const header = sheet.getRow(headerRow);
  columns.forEach((column, columnIndex) => {
    const cell = header.getCell(columnIndex + 1);
    cell.value = column.label;
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD5A044' } };
    cell.font = { bold: true, color: { argb: 'FF271A05' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = thinGoldBorder;
  });
  header.height = 26;

  if (rows.length) {
    sheet.addTable({
      name: `KusumExport${index + 1}`,
      ref: `A${headerRow}`,
      headerRow: true,
      totalsRow: false,
      style: { theme: 'TableStyleLight9', showRowStripes: true },
      columns: columns.map((column) => ({ name: column.label })),
      rows: rows.map((row) => columns.map((column) => cellValue(row[column.key], column.type)))
    });
    // Tables may infer barcode, invoice and mobile-number text as numbers.
    // Reapply typed values and formatting so identifiers are never altered.
    rows.forEach((row, rowIndex) => {
      const excelRow = sheet.getRow(dataStart + rowIndex);
      columns.forEach((column, columnIndex) => {
        const cell = excelRow.getCell(columnIndex + 1);
        cell.value = cellValue(row[column.key], column.type);
        cell.border = dataBorder;
        applyCellFormat(cell, column.type, ['currency', 'number', 'integer', 'weight'].includes(column.type) ? 'right' : 'left');
      });
    });
  } else {
    mergeAcross(sheet, dataStart, lastColumn);
    const emptyCell = sheet.getCell(dataStart, 1);
    emptyCell.value = 'No records matched the selected date range.';
    emptyCell.font = { color: { argb: 'FF756F69' }, italic: true };
  }

  sheet.autoFilter = rows.length ? { from: { row: headerRow, column: 1 }, to: { row: headerRow + rows.length, column: lastColumn } } : undefined;
  sheet.pageSetup = { orientation: lastColumn > 8 ? 'landscape' : 'portrait', fitToPage: true, fitToWidth: 1, fitToHeight: 0 };
}

const defaultColumns = payload.columns || [];
const defaultRows = payload.rows || [];
const sheets = Array.isArray(payload.sheets) && payload.sheets.length
  ? payload.sheets
  : [{ name: 'Data Export', title: payload.title, subtitle: payload.subtitle, columns: defaultColumns, rows: defaultRows }];
if (!sheets.length || !sheets[0].columns?.length) throw new Error('Excel export needs at least one column.');

const workbook = new ExcelJS.Workbook();
workbook.creator = 'Kusum ERP';
workbook.created = new Date();
const usedNames = new Set();
sheets.forEach((sheet, index) => addWorksheet(workbook, sheet, index, usedNames));

await workbook.xlsx.writeFile(outputPath);
