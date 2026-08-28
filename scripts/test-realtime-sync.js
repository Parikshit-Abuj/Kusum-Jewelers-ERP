/**
 * Multi-Client Real-Time Synchronization Test
 * Simulates multiple client counter PCs connected simultaneously to the main ERP server.
 */
require('dotenv').config();
const http = require('http');
const { createPrisma } = require('../src/lib/prisma');
const { dateInput } = require('../src/lib/helpers');

const PORT = Number(process.env.PORT || 3000);
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function ensureServerRunning() {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}/login`, (res) => {
      res.resume();
      resolve();
    });
    req.on('error', () => {
      try {
        require('../src/server');
        setTimeout(resolve, 1500);
      } catch (err) {
        reject(err);
      }
    });
    req.setTimeout(800, () => {
      req.destroy();
    });
  });
}

function createSseClient(clientName) {
  return new Promise((resolve, reject) => {
    const receivedEvents = [];
    const req = http.request(`${BASE_URL}/api/realtime-events`, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream'
      }
    }, (res) => {
      let lineBuffer = '';
      res.on('data', (chunk) => {
        lineBuffer += chunk.toString();
        const lines = lineBuffer.split(/\r?\n/);
        lineBuffer = lines.pop(); // keep partial trailing line
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const jsonStr = line.replace(/^data:\s*/, '').trim();
            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed && parsed.type) {
                receivedEvents.push(parsed);
              }
            } catch (_) {}
          }
        }
      });

      resolve({
        name: clientName,
        events: receivedEvents,
        close: () => {
          req.destroy();
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

let authCookie = '';

function loginSession() {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      username: process.env.AUTH_USERNAME || 'kusum',
      password: process.env.AUTH_PASSWORD || 'kusum123'
    }).toString();

    const req = http.request(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      if (res.headers['set-cookie']) {
        authCookie = res.headers['set-cookie'].map(c => c.split(';')[0]).join('; ');
      }
      res.resume();
      res.on('end', resolve);
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function postRequest(urlPath, body, isJson = false) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE_URL);
    const postData = isJson ? JSON.stringify(body) : new URLSearchParams(body).toString();
    const req = http.request(url, {
      method: 'POST',
      headers: {
        'Cookie': authCookie,
        'Content-Type': isJson ? 'application/json' : 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        // console.log(`POST ${urlPath} -> ${res.statusCode} ${res.headers.location || ''}`);
        resolve({ status: res.statusCode, data, location: res.headers.location });
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runRealtimeTest() {
  await ensureServerRunning();
  await loginSession();
  console.log('================================================================');
  console.log('⚡ SIMULATING MULTI-CLIENT REAL-TIME SYNCHRONIZATION');
  console.log('================================================================\n');

  const db = createPrisma();
  let errors = [];

  function check(desc, passed, detail = '') {
    if (passed) {
      console.log(`  ✔ [PASS] ${desc}`);
    } else {
      console.error(`  ✖ [FAIL] ${desc} — ${detail}`);
      errors.push(`${desc}: ${detail}`);
    }
  }

  let client1, client2, client3;

  try {
    // 1. Connect 3 Client PCs via SSE
    console.log('1. Connecting Counter PC 1, Counter PC 2, and Admin Laptop via SSE...');
    client1 = await createSseClient('Counter PC 1');
    client2 = await createSseClient('Counter PC 2');
    client3 = await createSseClient('Admin Laptop');
    await sleep(250);
    check('3 Concurrent Client PCs Connected to Live SSE Hub', true);

    // 2. Test Rate Update Broadcast
    console.log('\n2. Updating Daily Rates on Admin Laptop...');
    const todayStr = dateInput();
    await postRequest('/rates', {
      rateDate: todayStr,
      gold22k: 7420,
      gold24k: 8010,
      silver: 96,
      note: 'Live Sync Test'
    });
    await sleep(250);

    const c1RateEvt = client1.events.find(e => e.type === 'RATES_UPDATED' && e.payload.gold22k === 7420);
    const c2RateEvt = client2.events.find(e => e.type === 'RATES_UPDATED' && e.payload.gold22k === 7420);
    check('Counter PC 1 received live RATES_UPDATED event', Boolean(c1RateEvt), JSON.stringify(c1RateEvt));
    check('Counter PC 2 received live RATES_UPDATED event', Boolean(c2RateEvt), JSON.stringify(c2RateEvt));

    // 3. Test Fast-Track Batch Piece Addition Broadcast
    console.log('\n3. Counter PC 1 weighing and adding piece to Batch Doc...');
    const batchDocNo = `SYNC-BATCH-${Date.now().toString().slice(-4)}`;
    const pieceRes = await postRequest('/api/inventory/batch-piece', {
      batchDocNo,
      name: 'Sync Ring',
      category: 'Ring',
      metal: 'GOLD',
      purity: '22K',
      grossWeight: 5.120,
      stoneWeight: 0,
      netWeight: 5.120,
      makingChargeType: 'PER_GRAM',
      makingChargeValue: 500
    }, true);

    await sleep(250);
    const c2BatchEvt = client2.events.find(e => e.type === 'INVENTORY_CHANGED' && e.payload.action === 'BATCH_PIECE_ADDED' && e.payload.batchDocNo === batchDocNo);
    const c3BatchEvt = client3.events.find(e => e.type === 'INVENTORY_CHANGED' && e.payload.action === 'BATCH_PIECE_ADDED' && e.payload.batchDocNo === batchDocNo);
    check('Counter PC 2 received live INVENTORY_CHANGED (Batch Piece Added)', Boolean(c2BatchEvt), JSON.stringify(c2BatchEvt));
    check('Admin Laptop received live INVENTORY_CHANGED (Batch Piece Added)', Boolean(c3BatchEvt), JSON.stringify(c3BatchEvt));

    // 4. Test Customer Payment & Cashbook Broadcast
    console.log('\n4. Cashier recording manual cashbook entry...');
    await postRequest('/cashbook', {
      entryDate: todayStr,
      type: 'IN',
      paymentMethod: 'CASH',
      amount: 15000,
      description: 'Sync Cash In Test'
    });
    await sleep(250);

    const c1CashEvt = client1.events.find(e => e.type === 'CASHBOOK_UPDATED');
    const c2CashEvt = client2.events.find(e => e.type === 'CASHBOOK_UPDATED');
    check('Counter PC 1 received live CASHBOOK_UPDATED', Boolean(c1CashEvt));
    check('Counter PC 2 received live CASHBOOK_UPDATED', Boolean(c2CashEvt));

    // Clean up created batch piece
    await db.product.deleteMany({ where: { batchDocNo } });
    await db.cashbookEntry.deleteMany({ where: { description: 'Sync Cash In Test' } });

    console.log('\n================================================================');
    if (errors.length === 0) {
      console.log('🎉 ALL MULTI-CLIENT REAL-TIME SYNCHRONIZATION TESTS PASSED (0 ERRORS)!');
    } else {
      console.log(`⚠️ SYNC TESTS COMPLETED WITH ${errors.length} ERROR(S):`);
      errors.forEach(e => console.log(`   - ${e}`));
      process.exitCode = 1;
    }
    console.log('================================================================\n');

  } catch (err) {
    console.error('Fatal sync test failure:', err);
    process.exit(1);
  } finally {
    if (client1) client1.close();
    if (client2) client2.close();
    if (client3) client3.close();
    await db.$disconnect();
  }
}

runRealtimeTest();
