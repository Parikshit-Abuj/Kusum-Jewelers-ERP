const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const templateDir = path.join(__dirname, '..', 'tspl-templates');
const templates = {
  GOLD: fs.readFileSync(path.join(templateDir, 'GOLD.PRN'), 'utf8'),
  SILVER: fs.readFileSync(path.join(templateDir, 'SILVER.PRN'), 'utf8')
};

function cleanTsplValue(value) {
  return String(value ?? '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/"/g, "'")
    .replace(/[^\x20-\xFF]/g, '?')
    .trim();
}

function labelKind(product) {
  if (product.metal === 'GOLD') return 'GOLD';
  if (product.metal === 'SILVER') return 'SILVER';
  throw new Error(`${product.barcode || product.sku} is ${product.metal}; native labels are configured only for gold and silver.`);
}

function weight(value) {
  return Number(value || 0).toFixed(3);
}

function replaceAll(template, replacements) {
  return Object.entries(replacements).reduce(
    (result, [placeholder, value]) => result.split(placeholder).join(value),
    template
  );
}

function buildTsplLabel(product) {
  if (!product.barcode) throw new Error(`${product.name} has no barcode.`);
  const kind = labelKind(product);
  const barcode = cleanTsplValue(product.barcode);
  const replacements = kind === 'GOLD'
    ? {
        '<Item_name>': cleanTsplValue(product.name),
        '<Barcode>': barcode,
        '<Gross_wt>': weight(product.grossWeight),
        '<TOT_STN_WT3>': weight(product.stoneWeight),
        '<net_wt>': weight(product.netWeight)
      }
    : {
        '<ITEM_NAME>': cleanTsplValue(product.name),
        '<Barcode>': barcode,
        '<Gross_wt>': weight(product.grossWeight),
        '<stn_wt3>': weight(product.stoneWeight),
        '<net_wt>': weight(product.netWeight)
      };
  return replaceAll(templates[kind], replacements).replace(/\r?\n/g, '\r\n').trimEnd() + '\r\n';
}

function buildTsplJob(labels) {
  return labels.map(({ product }) => buildTsplLabel(product)).join('\r\n');
}

function nativePrintScript() {
  return path.join(__dirname, '..', '..', 'scripts', 'print-tspl.ps1');
}

function sendTsplToPrinter(printerName, tspl) {
  return new Promise((resolve, reject) => {
    const shell = process.env.SystemRoot
      ? path.join(process.env.SystemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe')
      : 'powershell.exe';
    const child = spawn(shell, ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', nativePrintScript(), '-PrinterName', printerName], {
      windowsHide: true,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', (error) => reject(error));
    child.on('close', (code) => {
      if (code === 0) return resolve(stdout.trim());
      reject(new Error(stderr.trim() || stdout.trim() || `Windows printer process stopped with code ${code}.`));
    });
    child.stdin.end(Buffer.from(tspl, 'latin1').toString('base64'));
  });
}

module.exports = { buildTsplLabel, buildTsplJob, sendTsplToPrinter };
