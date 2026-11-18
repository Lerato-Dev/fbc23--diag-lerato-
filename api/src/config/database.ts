import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

// Resolve the database location from this file, not from the terminal's
// current working directory. This keeps the database in api/database.
const databaseDirectory = path.resolve(__dirname, "../../database");
fs.mkdirSync(databaseDirectory, { recursive: true });

const databasePath = path.join(databaseDirectory, "tasks.db");
const db = new Database(databasePath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 120),
    description TEXT NOT NULL DEFAULT '',
    due_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending'
      CHECK (status IN ('Pending', 'Completed')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;
