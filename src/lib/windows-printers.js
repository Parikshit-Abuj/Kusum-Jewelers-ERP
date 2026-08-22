const path = require('path');
const { execFile } = require('child_process');

let cachedPrinters = null;
let cacheExpiresAt = 0;

function printerScript() {
  return path.join(__dirname, '..', '..', 'scripts', 'list-printers.ps1');
}

function powershellPath() {
  return process.env.SystemRoot
    ? path.join(process.env.SystemRoot, 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe')
    : 'powershell.exe';
}

function listWindowsPrinters(force = false) {
  if (!force && cachedPrinters && Date.now() < cacheExpiresAt) return Promise.resolve(cachedPrinters);
  return new Promise((resolve) => {
    execFile(powershellPath(), ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', printerScript()], {
      windowsHide: true,
      timeout: 8000,
      maxBuffer: 1024 * 1024
    }, (error, stdout, stderr) => {
      try {
        const payload = JSON.parse(String(stdout || '').trim());
        const printers = Array.isArray(payload.printers) ? payload.printers : (payload.printers ? [payload.printers] : []);
        const result = { printers, error: payload.error || (error ? String(stderr || error.message).trim() : null) };
        if (!result.error) {
          cachedPrinters = result;
          cacheExpiresAt = Date.now() + 15000;
        }
        resolve(result);
      } catch (parseError) {
        resolve({ printers: [], error: String(stderr || error?.message || parseError.message).trim() || 'Could not read installed Windows printers.' });
      }
    });
  });
}

function normalise(value) {
  return String(value || '').trim().toLocaleLowerCase();
}

function statusFromPrinterList(preferredName, listed, checked = true) {
  const configuredName = String(preferredName || 'TSC TTP-244 Pro').trim();
  if (listed.error) {
    return {
      available: false,
      name: configuredName,
      message: `Windows could not check printers: ${listed.error}`,
      printers: [],
      checked
    };
  }

  const configured = listed.printers.find((printer) => normalise(printer.name) === normalise(configuredName));
  const tsc = listed.printers.find((printer) => /ttp[- ]?244/i.test(printer.name));
  const printer = configured || tsc;
  if (!printer) {
    return {
      available: false,
      name: configuredName,
      message: `TSC TTP-244 Pro is not installed in Windows. Turn it on, connect USB, and install its Windows driver; then click Recheck printer.`,
      printers: listed.printers,
      checked
    };
  }
  if (!printer.isValid) {
    return {
      available: false,
      name: printer.name,
      message: `${printer.name} is installed but is not currently available to Windows. Check the cable, power and driver.`,
      printers: listed.printers,
      checked
    };
  }
  return {
    available: true,
    name: printer.name,
    message: `Detected ${printer.name}. Native TSPL labels will be sent as RAW data.`,
    printers: listed.printers,
    checked
  };
}

function cachedTscPrinterStatus(preferredName) {
  if (!cachedPrinters) {
    const configuredName = String(preferredName || 'TSC TTP-244 Pro').trim();
    return {
      available: false,
      name: configuredName,
      message: 'Printer status has not been checked yet. Inventory opens immediately; click Recheck printer before troubleshooting.',
      printers: [],
      checked: false
    };
  }
  return statusFromPrinterList(preferredName, cachedPrinters, false);
}

async function resolveTscPrinter(preferredName, force = false) {
  return statusFromPrinterList(preferredName, await listWindowsPrinters(force), true);
}

module.exports = { listWindowsPrinters, resolveTscPrinter, cachedTscPrinterStatus };
