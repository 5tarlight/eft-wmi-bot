import {
  ActivityType,
  Client,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";
import { BOT_CLIENT_ID, BOT_TOKEN, validateConfig } from "./config";
import { startWebServer } from "./web";
import { cleanLogs, getLogger } from "./log/log";
import { Ping } from "./commands/ping";
import { Command } from "./commands/Command";

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

const slashCommands: Command[] = [Ping];

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = slashCommands.find(
      (cmd) => cmd.data.name === interaction.commandName
    );
    const user = interaction.user;
    logger.trace(
      `Received command ${interaction.commandName} from ${user.tag}`
    );

    if (command) {
      try {
        await command.execute(interaction);
      } catch (error) {
        logger.error("An error occurred while executing a command", error);
        await interaction.reply(
          "An error occurred while executing this command"
        );
      }
    }
  }
});

const rest = new REST().setToken(BOT_TOKEN);

(async () => {
  try {
    logger.debug(`Start refreshing ${slashCommands.length} slash commands`);

    await rest.put(
      Routes.applicationCommands(client.user?.id || BOT_CLIENT_ID),
      {
        body: slashCommands.map((it) => it.data),
      }
    );

    logger.info("Successfully reloaded application (/) commands");
  } catch (error) {
    logger.error(
      "An error occurred while refreshing application (/) commands",
      error
    );
  }
})();

logger.debug("Starting the bot...");
validateConfig();
cleanLogs();
client.login(BOT_TOKEN);
startWebServer();
