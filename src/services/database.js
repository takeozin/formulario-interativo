import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'soulstar.db';

// Aumente este número e adicione um bloco em migrate() sempre que a
// estrutura das tabelas mudar.
const DATABASE_VERSION = 1;

let databasePromise = null;

// Abre o banco uma única vez e reaproveita a conexão.
export function getDatabase() {
  if (!databasePromise) {
    databasePromise = openAndMigrate().catch((error) => {
      databasePromise = null; // permite tentar de novo depois de uma falha
      throw error;
    });
  }
  return databasePromise;
}

async function openAndMigrate() {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await migrate(db);
  return db;
}

async function migrate(db) {
  const row = await db.getFirstAsync('PRAGMA user_version');
  const currentVersion = row?.user_version ?? 0;

  if (currentVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentVersion < 1) {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS responses (
        id TEXT PRIMARY KEY NOT NULL,
        status TEXT NOT NULL DEFAULT 'in_progress',
        consent_type TEXT,
        consent_version TEXT,
        consent_at TEXT,
        avatar TEXT,
        name TEXT,
        age_range TEXT,
        intent TEXT,
        rating INTEGER,
        comment TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        completed_at TEXT,
        synced INTEGER NOT NULL DEFAULT 0
      );
    `);
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
