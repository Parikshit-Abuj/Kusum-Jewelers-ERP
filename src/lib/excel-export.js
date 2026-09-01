const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const builderPath = path.join(__dirname, '..', 'excel-runtime', 'build-export.mjs');
const MAX_RENDERED_ROWS = 100000;
const MAX_PAYLOAD_BYTES = 24 * 1024 * 1024;

function run(command, args) {
  return new Promise((resolve, reject) => {
    const environment = { ...process.env };
    // Electron's executable can run ordinary Node scripts when this is set.
    // This keeps Excel exports working from the packaged desktop application.
    if (process.versions.electron) environment.ELECTRON_RUN_AS_NODE = '1';
    const child = spawn(command, args, { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'], env: environment });
    let stderr = '';
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code) => code === 0 ? resolve() : reject(new Error(stderr.trim() || `Excel export process stopped with code ${code}.`)));
  });
}

async function buildExcelExport(payload) {
  const renderedRows = (payload.sheets || [{ rows: payload.rows || [] }])
    .reduce((total, sheet) => total + (sheet.rows || []).length, 0);
  if (renderedRows > MAX_RENDERED_ROWS) {
    throw new Error('This Excel export contains too many rendered rows. Choose a shorter date range so the shop PC can create it reliably.');
  }
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'kusum-erp-export-'));
  const inputPath = path.join(tempDir, 'data.json');
  const outputPath = path.join(tempDir, 'export.xlsx');
  try {
    const json = JSON.stringify(payload);
    if (Buffer.byteLength(json, 'utf8') > MAX_PAYLOAD_BYTES) {
      throw new Error('This Excel export is too large to prepare safely. Choose a shorter date range.');
    }
    await fs.writeFile(inputPath, json, 'utf8');
    await run(process.execPath, [builderPath, inputPath, outputPath]);
    return await fs.readFile(outputPath);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

module.exports = { buildExcelExport };
