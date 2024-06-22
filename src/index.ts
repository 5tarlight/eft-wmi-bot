import { Client, Events, GatewayIntentBits } from "discord.js";
import { BOT_TOKEN, validateConfig } from "./config";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

validateConfig();
client.login(BOT_TOKEN);
