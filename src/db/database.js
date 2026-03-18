const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const CREATE_TASKS_TABLE = `
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    due_date TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    deleted_at TEXT DEFAULT NULL
  )
`;

// TODO: Add index on status column for performance

function createDatabase(dbPath) {
  if (dbPath && dbPath !== ':memory:') {
    const dir = path.dirname(dbPath);
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new Database(dbPath || ':memory:');
  db.pragma('journal_mode = WAL');
  db.exec(CREATE_TASKS_TABLE);
  return db;
}

module.exports = { createDatabase };
