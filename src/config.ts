import { config } from "dotenv";
import { getLogger } from "./log/log";

config();
const logger = getLogger("config");
logger.info(".env configuration loaded!");

export const BOT_TOKEN = process.env.BOT_TOKEN || "";
export const BOT_CLIENT_ID = process.env.BOT_CLIENT_ID || "";
export const WEB_PORT = process.env.PORT || 8080;
export const LOG_DIR = process.env.LOG_DIR || "./logs";
export const SUPPORT_SERVER =
  process.env.SUPPORT_SERVER || "1236950435521105921";
export const MOD_ID = process.env.MOD_ID || "352755226224361482";

export const validateConfig = () => {
  logger.debug("Validating configuration...");

  let err = null;
  let warn = [];
  const getMsg = (name: string) => `${name} is required in .env file`;
  const getDefaultMsg = (name: string, d: number | string | unknown) =>
    `${name} is not provided in .env file, using default value: ${d}`;

  if (!BOT_TOKEN) err = new Error(getMsg("BOT_TOKEN"));
  else if (!BOT_CLIENT_ID) err = new Error(getMsg("BOT_CLIENT_ID"));

  if (!process.env.WEB_PORT) warn.push(getDefaultMsg("WEB_PORT", WEB_PORT));
  if (!process.env.LOG_DIR) warn.push(getDefaultMsg("LOG_DIR", LOG_DIR));
  if (!process.env.SUPPORT_SERVER)
    warn.push(getDefaultMsg("SUPPORT_SERVER", SUPPORT_SERVER));
  if (!process.env.MOD_ID) warn.push(getDefaultMsg("MOD_ID", MOD_ID));

  if (err) {
    logger.error("Configuration validation failed", err);
    throw err;
  }

  if (warn) {
    logger.warn("Some configuration values are missing or invalid:");
    warn.forEach((w) => logger.warn(w));
    logger.warn("To fix this, add the missing values to your .env file");
  }

  logger.info("Configuration validaion ended successfully");
};
