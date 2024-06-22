import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";
import { BOT_TOKEN, validateConfig } from "./config";
import { startWebServer } from "./web";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);

  client.user!!.setPresence({
    activities: [
      {
        name: `Escape from Tarkov`,
        type: ActivityType.Playing,
      },
    ],
    status: "online",
  });
});

validateConfig();
client.login(BOT_TOKEN);
startWebServer();
