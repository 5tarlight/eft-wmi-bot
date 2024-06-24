import { config } from "dotenv";
import { getLogger } from "./log/log";

config();
const logger = getLogger("config");
logger.info(".env configuration loaded!");

export const BOT_TOKEN = process.env.BOT_TOKEN || "";
export const BOT_CLIENT_ID = process.env.BOT_CLIENT_ID || "";
export const WEB_PORT = process.env.PORT || 8080;
export const LOG_DIR = process.env.LOG_DIR || "./logs";

export const validateConfig = () => {
  logger.debug("Validating configuration...");

  if (!BOT_TOKEN) {
    const err = new Error("BOT_TOKEN is required in .env file");
    logger.error("BOT_TOKEN is required in .env file", err);
    throw err;
  } else if (!BOT_CLIENT_ID) {
    const err = new Error("BOT_CLIENT_ID is required in .env file");
    logger.error("BOT_CLIENT_ID is required in .env file", err);
    throw err;
  }

  logger.info("Configuration validaion ended successfully!");
};
