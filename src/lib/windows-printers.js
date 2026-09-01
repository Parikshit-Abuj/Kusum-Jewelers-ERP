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
      // Checking a Windows queue is only a manual diagnostic. Keep a broken
      // driver or an unplugged network queue from making the ERP feel frozen.
      timeout: 3500,
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

  const printer = listed.printers.find((entry) => normalise(entry.name) === normalise(configuredName));
  if (!printer) {
    const detectedTsc = listed.printers.filter((entry) => /ttp[- ]?244/i.test(entry.name)).map((entry) => entry.name);
    const suggestion = detectedTsc.length ? ` Detected TSC queue(s): ${detectedTsc.join(', ')}. Select the exact name in Printer setup.` : '';
    return {
      available: false,
      name: configuredName,
      message: `${configuredName} is not installed under that exact Windows printer name.${suggestion || ' Turn it on, connect USB, and install its Windows driver; then click Recheck printer.'}`,
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
  if (printer.canConfirmPhysicalStatus && (printer.workOffline || Number(printer.printerStatus) === 7)) {
    return {
      available: false,
      name: printer.name,
      message: `${printer.name} is installed but Windows reports it offline. Check power, USB/network cable, queue pause state and labels.`,
      printers: listed.printers,
      checked
    };
  }
  return {
    available: true,
    name: printer.name,
    message: `${printer.name} is installed in Windows. Use Test TSC to verify its physical connection; native TSPL labels are sent as RAW data.`,
    printers: listed.printers,
    checked
  };
}

function cachedTscPrinterStatus(preferredName) {
  const configuredName = String(preferredName || 'TSC TTP-244 Pro').trim();
  return {
    available: null,
    name: configuredName,
    message: 'Printer is configured. No automatic queue check is run; printing sends native TSPL directly to the Windows queue.',
    printers: cachedPrinters?.printers || [],
    checked: false
  };
}

async function resolveTscPrinter(preferredName, force = false) {
  return statusFromPrinterList(preferredName, await listWindowsPrinters(force), true);
}

module.exports = { listWindowsPrinters, resolveTscPrinter, cachedTscPrinterStatus };
