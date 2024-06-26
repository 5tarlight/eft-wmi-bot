import { join } from "path";
import { verbose } from "sqlite3";
import { getLogger } from "../log/log";
import { VERIFY_TABLE } from "./dbConst";
import { promiseDb } from "./util";

const sqlite = verbose();
const path = join(__dirname, "database.sqlite");
const logger = getLogger("db");

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
  discord_id TEXT NOT NULL,
  verify_code TEXT NOT NULL,
  created_at DATE DEFAULT CURRENT_TIMESTAMP,
  updated_at DATE DEFAULT CURRENT_TIMESTAMP
)
`;

export const createTable = () => {
  logger.debug("Creating tables...");

  const tables = [{ scheme: verifyTableScheme, name: VERIFY_TABLE }];

  tables.forEach(async (table) => {
    // db.run(table.scheme, (err) => {
    //   if (err) logger.error("Failed to create table " + table.name, err);
    //   else logger.debug(`Table ${table.name} created successfully`);
    // });

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
