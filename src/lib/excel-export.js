const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const builderPath = path.join(__dirname, '..', 'excel-runtime', 'build-export.mjs');

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', (code) => code === 0 ? resolve() : reject(new Error(stderr.trim() || `Excel export process stopped with code ${code}.`)));
  });
}

async function buildExcelExport(payload) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'kusum-erp-export-'));
  const inputPath = path.join(tempDir, 'data.json');
  const outputPath = path.join(tempDir, 'export.xlsx');
  try {
    await fs.writeFile(inputPath, JSON.stringify(payload), 'utf8');
    await run(process.execPath, [builderPath, inputPath, outputPath]);
    return await fs.readFile(outputPath);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

module.exports = { buildExcelExport };
