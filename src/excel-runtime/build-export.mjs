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
const dataBorder = {
  top: { style: 'thin', color: { argb: 'FFE8E1D8' } },
  left: { style: 'thin', color: { argb: 'FFE8E1D8' } },
  bottom: { style: 'thin', color: { argb: 'FFE8E1D8' } },
  right: { style: 'thin', color: { argb: 'FFE8E1D8' } }
};
const summaryLabelFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF4DE' } };
const summaryValueFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFBF1' } };
const alternateRowFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFCF7' } };
const normalRowFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };

function dateOnlyValue(value) {
  const dateText = String(value || '');
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateText);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
}

function cellValue(value, type) {
  if (value === null || value === undefined || (['text', 'identifier'].includes(type) && value === '')) return null;
  if (type === 'identifier') return { richText: [{ text: String(value) }] };
  if (type === 'date') {
    const dateText = String(value);
    const stableDate = dateOnlyValue(dateText);
    if (stableDate) return stableDate;
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? dateText : date;
  }
  if (['currency', 'number', 'integer', 'weight'].includes(type)) return Number(value || 0);
  return String(value);
}

function numberFormat(type) {
  if (type === 'date') return 'd-mmm-yy';
  if (type === 'currency') return '[$₹-en-IN]#,##0.00;[Red]-[$₹-en-IN]#,##0.00';
  if (type === 'weight') return '0.000;[Red]-0.000';
  if (type === 'integer') return '#,##0;[Red]-#,##0';
  if (type === 'number') return '#,##0.00;[Red]-#,##0.00';
  return undefined;
}

function applyCellFormat(cell, type, alignment = 'left') {
  cell.alignment = { vertical: 'middle', horizontal: alignment, wrapText: type === 'text' };
  const format = numberFormat(type);
  cell.numFmt = format || (['text', 'identifier'].includes(type) ? '@' : 'General');
}

function rowHeightFor(row, columns) {
  const lines = columns.reduce((maximum, column) => {
    if (column.type !== 'text') return maximum;
    const value = String(row[column.key] || '');
    const explicitLines = value.split(/\r?\n/);
    const estimated = explicitLines.reduce((total, line) => total + Math.max(1, Math.ceil(line.length / Math.max(8, (column.width || 16) - 2))), 0);
    return Math.max(maximum, estimated);
  }, 1);
  return Math.min(60, Math.max(20, lines * 16));
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

function applyCaRegisterCellFormat(cell, type, alignment = 'left') {
  cell.alignment = { vertical: 'middle', horizontal: alignment, wrapText: false };
  if (type === 'date') cell.numFmt = 'd-mmm-yy';
  else if (type === 'currency' || type === 'number') cell.numFmt = '#,##0.00;[Red]-#,##0.00';
  else if (type === 'weight') cell.numFmt = '#,##0.000;[Red]-#,##0.000';
  else if (type === 'integer') cell.numFmt = '#,##0;[Red]-#,##0';
  else cell.numFmt = ['text', 'identifier'].includes(type) ? '@' : 'General';
}

function addCaRegisterWorksheet(workbook, spec, index, usedNames) {
  const columns = spec.columns || [];
  const rows = spec.rows || [];
  if (!columns.length) throw new Error(`Excel sheet "${spec.name || index + 1}" needs at least one column.`);

  const lastColumn = columns.length;
  const headerRow = 4;
  const dataStart = headerRow + 1;
  const sheet = workbook.addWorksheet(sheetName(spec.name, index, usedNames), {
    views: [{ showGridLines: true }]
  });
  sheet.properties.defaultRowHeight = 18;
  sheet.columns = columns.map((column) => ({ key: column.key, width: column.width || 16 }));

  mergeAcross(sheet, 1, lastColumn);
  const shopCell = sheet.getCell(1, 1);
  shopCell.value = spec.shopName || 'KUSUM JEWELLERS';
  shopCell.font = { name: 'Arial', bold: true, size: 16, color: { argb: 'FF000000' } };
  shopCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 24;

  mergeAcross(sheet, 2, lastColumn);
  const titleCell = sheet.getCell(2, 1);
  titleCell.value = String(spec.title || payload.title || 'REGISTER').toUpperCase();
  titleCell.font = { name: 'Arial', bold: true, size: 14, color: { argb: 'FF000000' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(2).height = 22;

  mergeAcross(sheet, 3, lastColumn);
  const periodCell = sheet.getCell(3, 1);
  periodCell.value = spec.subtitle || '';
  periodCell.font = { name: 'Arial', bold: true, size: 11, color: { argb: 'FF000000' } };
  periodCell.alignment = { horizontal: 'center', vertical: 'middle' };

  const header = sheet.getRow(headerRow);
  columns.forEach((column, columnIndex) => {
    const cell = header.getCell(columnIndex + 1);
    cell.value = String(column.label || '').toUpperCase();
    cell.font = { name: 'Arial', bold: true, color: { argb: 'FF000000' } };
    cell.alignment = {
      horizontal: ['currency', 'number', 'integer', 'weight'].includes(column.type) ? 'right' : 'left',
      vertical: 'middle',
      wrapText: true
    };
  });
  header.height = 20;

  if (rows.length) {
    rows.forEach((row, rowIndex) => {
      const excelRow = sheet.getRow(dataStart + rowIndex);
      columns.forEach((column, columnIndex) => {
        const cell = excelRow.getCell(columnIndex + 1);
        cell.value = cellValue(row[column.key], column.type);
        cell.font = { name: 'Arial', color: { argb: 'FF000000' } };
        applyCaRegisterCellFormat(cell, column.type, ['currency', 'number', 'integer', 'weight'].includes(column.type) ? 'right' : 'left');
      });
      excelRow.height = 18;
    });

    const totals = new Set(spec.totalKeys || []);
    if (totals.size) {
      const footerRow = dataStart + rows.length;
      const labelCell = sheet.getCell(footerRow, 1);
      labelCell.value = 'Grand Total';
      labelCell.font = { name: 'Arial', bold: true, color: { argb: 'FF000000' } };
      columns.forEach((column, columnIndex) => {
        const cell = sheet.getCell(footerRow, columnIndex + 1);
        if (totals.has(column.key)) {
          const letter = sheet.getColumn(columnIndex + 1).letter;
          // Keep a normal Excel formula for users, but also store its result.
          // This lets viewers/importers that do not calculate formulas show
          // the correct grand total immediately.
          const calculatedTotal = rows.reduce((sum, row) => {
            const value = Number(row[column.key]);
            return sum + (Number.isFinite(value) ? value : 0);
          }, 0);
          cell.value = {
            formula: `SUM(${letter}${dataStart}:${letter}${footerRow - 1})`,
            result: calculatedTotal
          };
          applyCaRegisterCellFormat(cell, column.type, 'right');
          cell.font = { name: 'Arial', bold: true, color: { argb: 'FF000000' } };
        }
      });
    }
  } else {
    mergeAcross(sheet, dataStart, lastColumn);
    const emptyCell = sheet.getCell(dataStart, 1);
    emptyCell.value = 'No records matched the selected date range.';
    emptyCell.font = { name: 'Arial', italic: true, color: { argb: 'FF000000' } };
  }

  sheet.pageSetup = {
    paperSize: 9,
    orientation: lastColumn > 8 ? 'landscape' : 'portrait',
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    margins: { left: 0.25, right: 0.25, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 },
    printTitlesRow: `${headerRow}:${headerRow}`
  };
  sheet.printArea = `A1:${sheet.getColumn(lastColumn).letter}${Math.max(dataStart, headerRow + rows.length + (rows.length && spec.totalKeys?.length ? 1 : 0))}`;
}

function addWorksheet(workbook, spec, index, usedNames) {
  if (spec.layout === 'ca-register') return addCaRegisterWorksheet(workbook, spec, index, usedNames);
  const columns = spec.columns || [];
  const rows = spec.rows || [];
  if (!columns.length) throw new Error(`Excel sheet "${spec.name || index + 1}" needs at least one column.`);

  const lastColumn = columns.length;
  const infoRows = spec.infoRows || [];
  const infoBlockWidth = lastColumn >= 8 ? 4 : 2;
  const infoPairsPerRow = Math.max(1, Math.floor(lastColumn / infoBlockWidth));
  const infoRowCount = Math.ceil(infoRows.length / infoPairsPerRow);
  const headerRow = 4 + infoRowCount;
  const dataStart = headerRow + 1;
  const sheet = workbook.addWorksheet(sheetName(spec.name, index, usedNames), {
    views: [{ state: 'frozen', ySplit: headerRow, showGridLines: false }]
  });
  sheet.properties.defaultRowHeight = 18;
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
    const labelColumn = 1 + (itemIndex % infoPairsPerRow) * infoBlockWidth;
    const labelEndColumn = labelColumn + Math.floor(infoBlockWidth / 2) - 1;
    const valueColumn = labelEndColumn + 1;
    const valueEndColumn = Math.min(labelColumn + infoBlockWidth - 1, lastColumn);
    if (labelEndColumn > labelColumn) sheet.mergeCells(rowNumber, labelColumn, rowNumber, labelEndColumn);
    if (valueEndColumn > valueColumn) sheet.mergeCells(rowNumber, valueColumn, rowNumber, valueEndColumn);
    const labelCell = sheet.getCell(rowNumber, labelColumn);
    const valueCell = sheet.getCell(rowNumber, valueColumn);
    labelCell.value = item.label;
    labelCell.fill = summaryLabelFill;
    labelCell.border = thinGoldBorder;
    labelCell.font = { bold: true, color: { argb: 'FF6E4B12' }, size: 10 };
    labelCell.alignment = { horizontal: 'left', vertical: 'middle' };
    valueCell.value = cellValue(item.value, item.type);
    valueCell.fill = summaryValueFill;
    valueCell.border = thinGoldBorder;
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
    // Use one ordinary worksheet AutoFilter rather than an Excel Table.
    // Excel Tables already contain their own AutoFilter definition; adding a
    // second worksheet-level filter over the same range produces a workbook
    // that Google Sheets accepts but Microsoft Excel repairs by deleting the
    // table/filter.  A standard AutoFilter keeps the same filter drop-downs,
    // works in Excel/Google Sheets/LibreOffice, and leaves identifiers as text.
    rows.forEach((row, rowIndex) => {
      const excelRow = sheet.getRow(dataStart + rowIndex);
      columns.forEach((column, columnIndex) => {
        const cell = excelRow.getCell(columnIndex + 1);
        cell.value = cellValue(row[column.key], column.type);
        cell.border = dataBorder;
        cell.fill = rowIndex % 2 === 1 ? alternateRowFill : normalRowFill;
        applyCellFormat(cell, column.type, ['currency', 'number', 'integer', 'weight'].includes(column.type) ? 'right' : 'left');
      });
      excelRow.height = rowHeightFor(row, columns);
    });
  } else {
    mergeAcross(sheet, dataStart, lastColumn);
    const emptyCell = sheet.getCell(dataStart, 1);
    emptyCell.value = 'No records matched the selected date range.';
    emptyCell.font = { color: { argb: 'FF756F69' }, italic: true };
  }

  sheet.autoFilter = rows.length ? { from: { row: headerRow, column: 1 }, to: { row: headerRow + rows.length, column: lastColumn } } : undefined;
  sheet.pageSetup = {
    paperSize: 9,
    orientation: lastColumn > 8 ? 'landscape' : 'portrait',
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    margins: { left: 0.25, right: 0.25, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 },
    printTitlesRow: `${headerRow}:${headerRow}`
  };
  sheet.headerFooter.oddFooter = '&LKusum ERP&CConfidential business register&RPage &P of &N';
  sheet.headerFooter.evenFooter = sheet.headerFooter.oddFooter;
  sheet.printArea = `A1:${sheet.getColumn(lastColumn).letter}${Math.max(dataStart, headerRow + rows.length)}`;
}

const defaultColumns = payload.columns || [];
const defaultRows = payload.rows || [];
const sheets = Array.isArray(payload.sheets) && payload.sheets.length
  ? payload.sheets
  : [{ name: 'Data Export', title: payload.title, subtitle: payload.subtitle, columns: defaultColumns, rows: defaultRows }];
if (!sheets.length || !sheets[0].columns?.length) throw new Error('Excel export needs at least one column.');

const workbook = new ExcelJS.Workbook();
workbook.creator = 'Kusum ERP';
workbook.lastModifiedBy = 'Kusum ERP';
workbook.company = 'Kusum ERP';
workbook.created = new Date();
workbook.modified = new Date();
// Excel will recalculate formulas if a user modifies a workbook, while the
// saved result above keeps totals available to non-calculating viewers.
workbook.calcProperties.fullCalcOnLoad = true;
workbook.calcProperties.forceFullCalc = true;
const usedNames = new Set();
sheets.forEach((sheet, index) => addWorksheet(workbook, sheet, index, usedNames));

await workbook.xlsx.writeFile(outputPath);
