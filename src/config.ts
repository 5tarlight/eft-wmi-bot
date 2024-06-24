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

  let err = null;
  const getMsg = (name: string) => `${name} is required in .env file`;

  if (!BOT_TOKEN) err = new Error(getMsg("BOT_TOKEN"));
  else if (!BOT_CLIENT_ID) err = new Error(getMsg("BOT_CLIENT_ID"));

  if (err) {
    logger.error("Configuration validation failed!", err);
    throw err;
  }

  logger.info("Configuration validaion ended successfully!");
};
