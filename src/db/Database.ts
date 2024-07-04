import { join } from "path";
import { verbose } from "sqlite3";
import { getLogger } from "../log/log";
import { MATCH_NOTIFY_TABLE, VERIFY_TABLE } from "./dbConst";
import { promiseDb } from "./util";

const sqlite = verbose();
const path = join(__dirname, "database.sqlite");
const logger = getLogger("db");

logger.debug("Database path:", path);
export const db = new sqlite.Database(
  path,
  sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE,
  (err) => {
    if (err) {
      logger.error("Failed to open database", err);
    } else {
      logger.info("Database opened successfully");
    }
  }
);

const verifyTableScheme = `
CREATE TABLE IF NOT EXISTS ${VERIFY_TABLE} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  identify_code TEXT NOT NULL,
  verify_code TEXT NOT NULL,
  created_at DATE DEFAULT CURRENT_TIMESTAMP,
  updated_at DATE DEFAULT CURRENT_TIMESTAMP
);
`;

const matchNotifyTableScheme = `
CREATE TABLE IF NOT EXISTS ${MATCH_NOTIFY_TABLE} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  discord_id TEXT NOT NULL,
  identity_code TEXT NOT NULL,
  created_at DATE DEFAULT CURRENT_TIMESTAMP,
  updated_at DATE DEFAULT CURRENT_TIMESTAMP
);
`;

export interface VerifyRequestTable {
  id: number;
  identify_code: string;
  verify_code: string;
  created_at: Date;
  updated_at: Date;
}

export interface MatchNotifyTable {
  id: number;
  discord_id: string;
  identity_code: string;
  created_at: Date;
  updated_at: Date;
}

export const createTable = () => {
  logger.debug("Creating tables...");

  const tables = [
    { scheme: verifyTableScheme, name: VERIFY_TABLE },
    { scheme: matchNotifyTableScheme, name: MATCH_NOTIFY_TABLE },
  ];

  tables.forEach(async (table) => {
    try {
      await promiseDb.run(table.scheme);
      logger.debug(`Table ${table.name} created successfully`);
    } catch (err) {
      logger.error("Failed to create table " + table.name, err);
    }
  });
};

export const closeDatabase = async () => {
  try {
    await promiseDb.close();
    logger.info("Database closed successfully");
  } catch (err) {
    logger.error("Failed to close database", err);
  }
};
