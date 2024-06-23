import { config } from "dotenv";
import { getLogger } from "./log";

config();
const logger = getLogger("config");
logger.info(".env configuration loaded!");

export const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || "";
export const WEB_PORT = process.env.PORT || 8080;
export const LOG_DIR = process.env.LOG_DIR || "./logs";

export const validateConfig = () => {
  logger.debug("Validating configuration...");

  if (!BOT_TOKEN) {
    const err = new Error("DISCORD_BOT_TOKEN is required in .env file");
    logger.error("DISCORD_BOT_TOKEN is required in .env file", err);
    throw err;
  }
};
