const session = require('express-session');

const DEFAULT_TTL_MS = 8 * 60 * 60 * 1000;

function expiryFor(sessionData) {
  const cookieExpiry = sessionData?.cookie?.expires ? new Date(sessionData.cookie.expires) : null;
  return cookieExpiry && Number.isFinite(cookieExpiry.getTime())
    ? cookieExpiry
    : new Date(Date.now() + DEFAULT_TTL_MS);
}

class PrismaSessionStore extends session.Store {
  constructor(getPrisma, databaseReady) {
    super();
    this.getPrisma = getPrisma;
    this.databaseReady = databaseReady;
    this.operations = 0;
  }

  backend() {
    return this.databaseReady() ? this.getPrisma() : null;
  }

  get(sid, callback) {
    const db = this.backend();
    // Setup and connection-repair pages do not require a stored login session.
    // Once the database is ready, every session is persisted in AppSession.
    if (!db) return callback(null, null);
    db.appSession.findUnique({ where: { id: sid } })
      .then(async (record) => {
        if (!record) return callback(null, null);
        if (record.expiresAt <= new Date()) {
          await db.appSession.deleteMany({ where: { id: sid } });
          return callback(null, null);
        }
        try {
          return callback(null, JSON.parse(record.data));
        } catch (_) {
          await db.appSession.deleteMany({ where: { id: sid } });
          return callback(null, null);
        }
      })
      .catch((error) => {
        // A stale session cookie must never prevent the local connection-repair
        // screen from opening when MySQL is temporarily unavailable.
        console.error('Could not read the ERP session:', error.message || error);
        callback(null, null);
      });
  }

  set(sid, sessionData, callback = () => {}) {
    const db = this.backend();
    if (!db) return callback(null);
    const data = JSON.stringify(sessionData);
    db.appSession.upsert({
      where: { id: sid },
      create: { id: sid, data, expiresAt: expiryFor(sessionData) },
      update: { data, expiresAt: expiryFor(sessionData) }
    }).then(async () => {
      this.operations += 1;
      if (this.operations % 100 === 0) {
        await db.appSession.deleteMany({ where: { expiresAt: { lt: new Date() } } });
      }
      callback(null);
    }).catch((error) => callback(error));
  }

  destroy(sid, callback = () => {}) {
    const db = this.backend();
    if (!db) return callback(null);
    db.appSession.deleteMany({ where: { id: sid } })
      .then(() => callback(null))
      .catch((error) => callback(error));
  }

  touch(sid, sessionData, callback = () => {}) {
    const db = this.backend();
    if (!db) return callback(null);
    db.appSession.updateMany({
      where: { id: sid },
      data: { expiresAt: expiryFor(sessionData) }
    }).then(() => callback(null)).catch((error) => callback(error));
  }
}

module.exports = { PrismaSessionStore };
