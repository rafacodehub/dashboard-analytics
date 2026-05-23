const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function getDb() {
  const dbPath = process.env.DATABASE_URL || path.join(__dirname, 'data', 'dashboard.sqlite');
  const db = await open({ filename: dbPath, driver: sqlite3.Database });
  await db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      role TEXT DEFAULT 'executivo',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      area TEXT,
      indicador TEXT,
      trimestre TEXT,
      valor REAL,
      meta REAL,
      status TEXT,
      source TEXT DEFAULT 'manual',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS kpis (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT,
      value TEXT,
      note TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      area TEXT,
      despesa REAL,
      orcamento REAL,
      variacao REAL,
      status TEXT,
      acao TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS imports (
      id TEXT PRIMARY KEY,
      filename TEXT,
      total_rows INTEGER,
      payload TEXT,
      status TEXT DEFAULT 'preview',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS exports (
      id TEXT PRIMARY KEY,
      type TEXT,
      qr_value TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT,
      details TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  return db;
}

module.exports = { getDb };
