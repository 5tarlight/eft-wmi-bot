import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";
import { BOT_TOKEN, validateConfig } from "./config";
import { startWebServer } from "./web";
import { cleanLogs, getLogger } from "./log";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const logger = getLogger();

client.once(Events.ClientReady, (readyClient) => {
  logger.info(`Logged in as ${readyClient.user.tag}`);

  readyClient.user.setPresence({
    activities: [
      {
        name: `Escape from Tarkov`,
        type: ActivityType.Playing,
      },
    ],
    status: "online",
  });
});

logger.debug("Starting the bot...");
validateConfig();
cleanLogs();
client.login(BOT_TOKEN);
startWebServer();
