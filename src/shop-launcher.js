const fs = require('fs');
const os = require('os');
const path = require('path');

const appRoot = path.resolve(__dirname, '..');
const appData = process.env.KUSUM_APP_DATA
  || path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local'), 'Kusum Jewelers ERP');

fs.mkdirSync(path.join(appData, 'logs'), { recursive: true });
process.env.KUSUM_APP_DATA = appData;
process.env.KUSUM_CONFIG_PATH = path.join(appData, '.env');
process.env.NODE_ENV = 'production';
process.chdir(appRoot);

require('./server');
