import fs from 'node:fs/promises';
import ExcelJS from 'exceljs';

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) throw new Error('Usage: build-export.mjs <input.json> <output.xlsx>');

const payload = JSON.parse(await fs.readFile(inputPath, 'utf8'));
const metadata = payload.metadata && typeof payload.metadata === 'object' ? payload.metadata : {};
const reportShopName = String(metadata.shopName || payload.shopName || 'Jewellery ERP').replace(/\s+/g, ' ').trim() || 'Jewellery ERP';
// Excel header/footer strings use ampersand as a formatting control character.
// Escape it so a shop name containing '&' is displayed literally.
const footerShopName = reportShopName.replaceAll('&', '&&');

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

function dateListValue(value) {
  const text = String(value || '').trim();
  const isoDate = dateOnlyValue(text);
  if (isoDate) return isoDate;
  const match = /^(\d{1,2})-([A-Za-z]{3})-(\d{2})$/.exec(text);
  if (!match) return null;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months.findIndex((name) => name.toLowerCase() === match[2].toLowerCase());
  if (month < 0) return null;
  const date = new Date(Date.UTC(2000 + Number(match[3]), month, Number(match[1]), 12));
  return date.getUTCDate() === Number(match[1]) ? date : null;
}

function exportNumberPrecision(type) {
  if (type === 'currency' || type === 'number') return 2;
  if (type === 'weight') return 3;
  if (type === 'integer') return 0;
  return null;
}

function roundedExportNumber(value, type) {
  const numeric = Number(value);
  const precision = exportNumberPrecision(type);
  if (precision === null) return numeric;
  const rounded = Number(numeric.toFixed(precision));
  return Object.is(rounded, -0) ? 0 : rounded;
}

function cellValue(value, type) {
  if (value === null || value === undefined || (['text', 'identifier'].includes(type) && value === '')) return null;
  if (type === 'identifier') return { richText: [{ text: String(value) }] };
  if (type === 'date-list') {
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
    const stableDate = dateListValue(value);
    return stableDate || String(value);
  }
  if (type === 'date') {
    const dateText = String(value);
    const stableDate = dateOnlyValue(dateText);
    if (stableDate) return stableDate;
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? dateText : date;
  }
  if (['currency', 'number', 'integer', 'weight'].includes(type)) {
    if (value === '' || value === null || value === undefined) return 0;
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) throw new Error(`Cannot export non-numeric value "${String(value)}" as ${type}.`);
    return roundedExportNumber(numeric, type);
  }
  return String(value);
}

function numberFormat(type) {
  if (type === 'date') return 'd-mmm-yy';
  if (type === 'date-list') return 'd-mmm-yy';
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
  // Excel supports row heights up to roughly 409 points. Keep a generous
  // practical ceiling so long notes and split-payment details remain fully
  // readable without allowing one accidental multi-page note to dominate an
  // entire worksheet.
  return Math.min(409, Math.max(20, lines * 16));
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

function applyCaRegisterCellFormat(cell, type, alignment = 'left', wrapText = false) {
  const shouldWrap = wrapText || type === 'text';
  cell.alignment = { vertical: 'middle', horizontal: alignment, wrapText: shouldWrap };
  if (type === 'date' || type === 'date-list') cell.numFmt = 'd-mmm-yy';
  else if (type === 'currency' || type === 'number') cell.numFmt = '#,##0.00;[Red]-#,##0.00';
  else if (type === 'weight') cell.numFmt = '#,##0.000;[Red]-#,##0.000';
  else if (type === 'integer') cell.numFmt = '#,##0;[Red]-#,##0';
  else cell.numFmt = ['text', 'identifier'].includes(type) ? '@' : 'General';
}

function caRegisterRowHeight(row, columns) {
  const lines = columns.reduce((maximum, column) => {
    if (!column.wrap && column.type !== 'text') return maximum;
    const value = String(row[column.key] || '');
    const estimatedLines = value.split(/\r?\n/).reduce(
      (total, line) => total + Math.max(1, Math.ceil(line.length / Math.max(8, (column.width || 16) - 2))),
      0
    );
    return Math.max(maximum, estimatedLines);
  }, 1);
  // CA registers also contain wrapped payment/remark text. The previous
  // 54-point cap clipped legitimate split-payment details in Excel.
  return Math.min(409, Math.max(18, lines * 16));
}

// A scheme installment may contain several payment components.  Keep the
// existing visible columns, but write each component on its own row so the
// Paid Date cell can remain a typed Excel date and the Amount column sums the
// actual parts rather than repeating the installment total.  The compact
// `paidDates`/`paymentType` strings remain available to non-Excel consumers.
function expandPaymentPartRows(rows, columns) {
  const dateColumn = columns.find((column) => column.type === 'date-list');
  if (!dateColumn) return rows;

  return rows.flatMap((row) => {
    const parts = Array.isArray(row.paymentParts)
      ? row.paymentParts.filter((part) => part && part.paymentDate && Number.isFinite(Number(part.amount)) && Number(part.amount) > 0)
      : [];
    if (parts.length) {
      return parts.map((part) => {
        const expanded = { ...row, [dateColumn.key]: part.paymentDate };
        if (Object.hasOwn(expanded, 'paymentType')) {
          const label = String(part.paymentType || '').trim();
          const amount = roundedExportNumber(part.amount, 'currency');
          expanded.paymentType = label ? `${label} ₹${amount.toFixed(2)}` : `₹${amount.toFixed(2)}`;
        }
        if (Object.hasOwn(expanded, 'amount')) expanded.amount = roundedExportNumber(part.amount, 'currency');
        return expanded;
      });
    }

    // Backward-compatible fallback for payloads produced before paymentParts
    // was added.  Preserve the total on the first row and make every parsed
    // date independently sortable/filterable instead of leaving the whole
    // comma-separated list as text.
    const text = String(row[dateColumn.key] || '').trim();
    const tokens = text ? text.split(/\s*,\s*/).filter(Boolean) : [];
    const dates = tokens.map((token) => dateListValue(token));
    if (dates.length <= 1 || dates.some((date) => !date)) return [row];
    return dates.map((date, index) => {
      const expanded = { ...row, [dateColumn.key]: date };
      if (index > 0 && Object.hasOwn(expanded, 'amount')) expanded.amount = 0;
      if (index > 0 && Object.hasOwn(expanded, 'paymentType')) expanded.paymentType = '';
      return expanded;
    });
  });
}

function addCaRegisterWorksheet(workbook, spec, index, usedNames) {
  const columns = spec.columns || [];
  const rows = expandPaymentPartRows(spec.rows || [], columns);
  if (!columns.length) throw new Error(`Excel sheet "${spec.name || index + 1}" needs at least one column.`);

  const lastColumn = columns.length;
  const headerRow = 4;
  const dataStart = headerRow + 1;
  const sheet = workbook.addWorksheet(sheetName(spec.name, index, usedNames), {
    views: [{ state: 'frozen', ySplit: headerRow, showGridLines: true }]
  });
  sheet.properties.defaultRowHeight = 18;
  sheet.columns = columns.map((column) => ({ key: column.key, width: column.width || 16 }));

  mergeAcross(sheet, 1, lastColumn);
  const shopCell = sheet.getCell(1, 1);
  shopCell.value = String(spec.shopName || payload.shopName || 'KUSUM JEWELLERS').trim();
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
        applyCaRegisterCellFormat(cell, column.type, ['currency', 'number', 'integer', 'weight'].includes(column.type) ? 'right' : 'left', Boolean(column.wrap));
      });
      excelRow.height = caRegisterRowHeight(row, columns);
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
            result: roundedExportNumber(calculatedTotal, column.type)
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
    orientation: spec.landscape || lastColumn > 8 ? 'landscape' : 'portrait',
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    margins: { left: 0.25, right: 0.25, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 },
    printTitlesRow: `${headerRow}:${headerRow}`
  };
  sheet.pageSetup.printArea = `A1:${sheet.getColumn(lastColumn).letter}${Math.max(dataStart, headerRow + rows.length + (rows.length && spec.totalKeys?.length ? 1 : 0))}`;
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
  titleCell.value = spec.title || payload.title || `${reportShopName} Data Export`;
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF30251D' } };
  titleCell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 16 };
  titleCell.alignment = { horizontal: 'left', vertical: 'middle' };
  sheet.getRow(1).height = 28;

  mergeAcross(sheet, 2, lastColumn);
  const subtitleCell = sheet.getCell(2, 1);
  subtitleCell.value = spec.subtitle || payload.subtitle || `Exported from ${reportShopName}`;
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
  sheet.headerFooter.oddFooter = `&L${footerShopName}&CConfidential business register&RPage &P of &N`;
  sheet.headerFooter.evenFooter = sheet.headerFooter.oddFooter;
  sheet.pageSetup.printArea = `A1:${sheet.getColumn(lastColumn).letter}${Math.max(dataStart, headerRow + rows.length)}`;
}

const defaultColumns = payload.columns || [];
const defaultRows = payload.rows || [];
const sheets = Array.isArray(payload.sheets) && payload.sheets.length
  ? payload.sheets
  : [{ name: 'Data Export', title: payload.title, subtitle: payload.subtitle, columns: defaultColumns, rows: defaultRows }];
if (!sheets.length || !sheets[0].columns?.length) throw new Error('Excel export needs at least one column.');

const workbook = new ExcelJS.Workbook();
// The workbook properties identify the product, while visible worksheet
// headings and footers identify the configured shop.
workbook.creator = String(metadata.creator || reportShopName).trim() || reportShopName;
workbook.lastModifiedBy = String(metadata.lastModifiedBy || reportShopName).trim() || reportShopName;
workbook.company = reportShopName;
workbook.title = String(metadata.title || payload.title || `${reportShopName} ERP export`).trim() || `${reportShopName} ERP export`;
workbook.subject = String(metadata.subject || payload.title || 'ERP register export').trim();
workbook.keywords = [reportShopName, metadata.gstin, metadata.panNumber].filter(Boolean).join(', ');
workbook.description = [
  metadata.address,
  metadata.gstin && `GSTIN: ${metadata.gstin}`,
  metadata.panNumber && `PAN: ${metadata.panNumber}`,
  [metadata.primaryPhone, metadata.secondaryPhone].filter(Boolean).join(' / ')
].filter(Boolean).join(' | ');
workbook.created = new Date();
workbook.modified = new Date();
// Excel will recalculate formulas if a user modifies a workbook, while the
// saved result above keeps totals available to non-calculating viewers.
workbook.calcProperties.fullCalcOnLoad = true;
workbook.calcProperties.forceFullCalc = true;
const usedNames = new Set();
sheets.forEach((sheet, index) => addWorksheet(workbook, sheet, index, usedNames));

await workbook.xlsx.writeFile(outputPath);
