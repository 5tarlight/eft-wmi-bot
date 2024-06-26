import { join } from "path";
import { verbose } from "sqlite3";
import { getLogger } from "../log/log";

const sqlite = verbose();
const path = join(__dirname, "database.sqlite");
const logger = getLogger("db");
const db = new sqlite.Database(
  path,
  sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE,
  (err) => {
    if (err) {
      logger.error("Failed to open database", err);
    }
  }
);
logger.info("Database opened successfully");

export const closeDatabase = () => {
  db.close((err) => {
    if (err) {
      logger.error("Failed to close database", err);
    }
  });
  logger.info("Database closed successfully");
};
