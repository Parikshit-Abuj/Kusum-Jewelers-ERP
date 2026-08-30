const fs = require('fs');
const path = require('path');
const net = require('net');
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

function sendTsplToWindowsPrinter(printerName, tspl) {
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
    let settled = false;
    const finish = (error, result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      if (error) reject(error);
      else resolve(result);
    };
    const timeout = setTimeout(() => {
      child.kill();
      finish(new Error(`Timed out while sending native TSPL to ${printerName}. Check that the TSC printer is powered on, online and not paused in Windows.`));
    }, 15000);
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', (error) => finish(error));
    child.on('close', (code) => {
      if (code === 0) return finish(null, stdout.trim());
      const rawMsg = stderr.trim() || stdout.trim() || `Windows printer process stopped with code ${code}.`;
      let cleanMsg = rawMsg;
      if (/OpenPrinter for '([^']+)' failed/i.test(rawMsg)) {
        cleanMsg = `Printer "${RegExp.$1 || printerName}" is not installed or connected to this computer. Please plug in your USB TSC barcode printer or install its driver in Windows.`;
      }
      finish(new Error(cleanMsg));
    });
    child.stdin.end(Buffer.from(tspl, 'latin1').toString('base64'));
  });
}

function tcpPort(value) {
  const parsed = Number(value || 9100);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error('Enter a valid direct TCP printer port (1 to 65535).');
  }
  return parsed;
}

function tcpHost(value) {
  const host = String(value || '').trim();
  if (!host || host.length > 253 || !/^[A-Za-z0-9][A-Za-z0-9.-]*$/.test(host)) {
    throw new Error('Enter a valid direct TCP printer IP address or host name.');
  }
  return host;
}

function checkTcpPrinter(host, portNumber) {
  const hostName = tcpHost(host);
  const port = tcpPort(portNumber);
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: hostName, port });
    let settled = false;
    const finish = (status) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(status);
    };
    socket.setTimeout(6000);
    socket.once('connect', () => finish({
      available: true,
      name: `TCP ${hostName}:${port}`,
      message: `Connected to ${hostName}:${port}. Native TSPL will be sent directly over TCP.`,
      checked: true
    }));
    socket.once('timeout', () => finish({
      available: false,
      name: `TCP ${hostName}:${port}`,
      message: `Timed out connecting to ${hostName}:${port}. Check the printer IP, TCP port, cable/router and network power.`,
      checked: true
    }));
    socket.once('error', (error) => finish({
      available: false,
      name: `TCP ${hostName}:${port}`,
      message: `Could not connect to ${hostName}:${port}: ${error.message || error}`,
      checked: true
    }));
  });
}

function sendTsplOverTcp(host, portNumber, tspl) {
  const hostName = tcpHost(host);
  const port = tcpPort(portNumber);
  const bytes = Buffer.from(tspl, 'latin1');
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host: hostName, port });
    let settled = false;
    const finish = (error, result) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      if (error) reject(error);
      else resolve(result);
    };
    socket.setTimeout(15000);
    socket.once('connect', () => {
      socket.once('finish', () => finish(null, `Sent ${bytes.length} native TSPL bytes to ${hostName}:${port} over direct TCP.`));
      socket.end(bytes);
    });
    socket.once('timeout', () => finish(new Error(`Timed out sending native TSPL to ${hostName}:${port}. Check the printer IP, TCP port, cable/router and network power.`)));
    socket.once('error', (error) => finish(new Error(`Could not send native TSPL to ${hostName}:${port}: ${error.message || error}`)));
  });
}

function sendTsplToPrinter(printer, tspl) {
  const config = typeof printer === 'string' ? { mode: 'WINDOWS', name: printer } : (printer || {});
  if (String(config.mode || 'WINDOWS').toUpperCase() === 'TCP') {
    return sendTsplOverTcp(config.host, config.port, tspl);
  }
  const printerName = String(config.name || '').trim();
  if (!printerName) throw new Error('Select an installed Windows printer before sending labels.');
  return sendTsplToWindowsPrinter(printerName, tspl);
}

module.exports = {
  buildTsplLabel,
  buildTsplJob,
  checkTcpPrinter,
  sendTsplToPrinter,
  sendTsplOverTcp
};
