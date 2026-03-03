import path from "node:path";
import { fileURLToPath } from "node:url";

import sqlite3 from "sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// on Vercel the filesystem is read-only except /tmp, and state is ephemeral
// users might provide a DB_PATH (e.g. to use an external volume). if none is set
// fall back to `/tmp/data.sqlite` when running on the Vercel platform so writes
// after a cold start are allowed (though they won’t persist between invocations).
const DB_PATH =
  process.env.DB_PATH ||
  (process.env.VERCEL
    ? path.resolve("/tmp", "data.sqlite")
    : path.resolve(__dirname, "..", "..", "data.sqlite"));

let db;

export function getDb() {
  if (!db) {
    sqlite3.verbose();
    db = new sqlite3.Database(DB_PATH);
  }
  return db;
}

export function initDb() {
  const database = getDb();
  database.serialize(() => {
    // Improves concurrency and reliability a bit for SQLite
    database.run("PRAGMA journal_mode = WAL;");
    database.run(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        ip TEXT,
        user_agent TEXT,
        status TEXT NOT NULL
      );
    `);
  });
}

export function dbRun(sql, params = []) {
  const database = getDb();
  return new Promise((resolve, reject) => {
    database.run(sql, params, function onRun(err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}
