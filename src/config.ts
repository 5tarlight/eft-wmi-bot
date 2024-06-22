import { config } from "dotenv";

config();
console.log(".env configuration loaded!");

export const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || "";
export const WEB_PORT = process.env.PORT || 8080;

export const validateConfig = () => {
  if (!BOT_TOKEN) {
    throw new Error("DISCORD_BOT_TOKEN is required in .env file");
  }
};
