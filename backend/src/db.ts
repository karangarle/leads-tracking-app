import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance;

  const dbPath = process.env.DB_PATH || path.join(__dirname, '../../leads.db');
  
  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await dbInstance.exec('PRAGMA foreign_keys = ON;');

  // Create tables
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      status TEXT CHECK(status IN ('new', 'contacted', 'qualified', 'lost')) DEFAULT 'new',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      leadId INTEGER NOT NULL,
      content TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (leadId) REFERENCES leads(id) ON DELETE CASCADE
    );
  `);

  return dbInstance;
}
