const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const http = require('http');
const net = require('net');
const os = require('os');
const path = require('path');

const shopDataDirectory = process.env.KUSUM_APP_DATA || path.join(
  process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local'),
  'Kusum Jewelers ERP'
);

process.env.KUSUM_APP_DATA = shopDataDirectory;
process.env.KUSUM_CONFIG_PATH = process.env.KUSUM_CONFIG_PATH || path.join(shopDataDirectory, '.env');
process.env.NODE_ENV = 'production';

function writeStartupLog(error) {
  try {
    const logsDirectory = path.join(shopDataDirectory, 'logs');
    fs.mkdirSync(logsDirectory, { recursive: true });
    const detail = error instanceof Error ? (error.stack || error.message) : String(error);
    fs.appendFileSync(
      path.join(logsDirectory, 'desktop-shell.log'),
      `[${new Date().toISOString()}] ${detail}\n`,
      'utf8'
    );
  } catch (_) {
    // Never let diagnostic logging prevent the ERP from opening.
  }
}

process.on('uncaughtException', (error) => {
  writeStartupLog(error);
  try {
    dialog.showErrorBox('Kusum Jewelers ERP could not start', error.message || String(error));
  } catch (_) {}
  app?.quit?.();
});

app.setPath('userData', path.join(shopDataDirectory, 'desktop-shell'));
app.setAppUserModelId('KusumJewelersERP');

let erpWindow;
let localPort;

function portIsFree(port) {
  return new Promise((resolve) => {
    const listener = net.createServer();
    listener.once('error', () => resolve(false));
    listener.once('listening', () => listener.close(() => resolve(true)));
    listener.listen({ host: '127.0.0.1', port, exclusive: true });
  });
}

function firstFreeEphemeralPort() {
  return new Promise((resolve, reject) => {
    const listener = net.createServer();
    listener.once('error', reject);
    listener.once('listening', () => {
      const address = listener.address();
      const port = typeof address === 'object' && address ? address.port : null;
      listener.close(() => port ? resolve(port) : reject(new Error('Could not choose a local ERP port.')));
    });
    listener.listen({ host: '127.0.0.1', port: 0, exclusive: true });
  });
}

async function startErpServer() {
  const configuredPort = Number(process.env.KUSUM_LOCAL_PORT || 3000);
  localPort = Number.isInteger(configuredPort) && configuredPort > 0 && configuredPort <= 65535 && await portIsFree(configuredPort)
    ? configuredPort
    : await firstFreeEphemeralPort();
  // dotenv in the ERP intentionally does not override this process value. It
  // lets a copied desktop app safely coexist with another local web service.
  process.env.PORT = String(localPort);
  require('./src/server');
}

function waitForServer(attempts = 40) {
  return new Promise((resolve, reject) => {
    const tryRequest = (remaining) => {
      const request = http.get(`http://127.0.0.1:${localPort}/setup`, (response) => {
        response.resume();
        resolve();
      });
      request.on('error', () => {
        if (remaining <= 0) return reject(new Error('The local ERP server did not start.'));
        setTimeout(() => tryRequest(remaining - 1), 250);
      });
      request.setTimeout(1000, () => request.destroy());
    };
    tryRequest(attempts);
  });
}

async function openErpWindow() {
  try {
    await startErpServer();
    await waitForServer();
    erpWindow = new BrowserWindow({
      width: 1440,
      height: 920,
      minWidth: 1040,
      minHeight: 720,
      title: 'Kusum ERP',
      webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: false }
    });
    await erpWindow.loadURL(`http://127.0.0.1:${localPort}`);
  } catch (error) {
    writeStartupLog(error);
    dialog.showErrorBox(
      'Kusum ERP could not start',
      `${error.message}\n\nCheck that no other program is using port 3000, then run the ERP again.`
    );
    app.quit();
  }
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!erpWindow) return;
    if (erpWindow.isMinimized()) erpWindow.restore();
    erpWindow.focus();
  });
  app.whenReady().then(openErpWindow);
}
app.on('window-all-closed', () => app.quit());
