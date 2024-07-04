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
import { closeDatabase, createTable } from "./db/Database";
import { Verify } from "./commands/verify";

export const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});
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

const slashCommands: Command[] = [Ping, Verify];

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

let isShuttingDown = false;
const cleanUp = async (code: number) => {
  if (isShuttingDown) return;

  isShuttingDown = true;
  logger.info("Gracefully shutting down...");
  await client.destroy();
  await closeDatabase();
  logger.info("Cleaned up successfully, exiting...");
  process.exit(code);
};

const unhandledException = (error: Error) => {
  logger.error("An unhandled exception occurred", error);
};

process.on("exit", cleanUp.bind(null, 0));
process.on("SIGINT", cleanUp.bind(null, 0));
process.on("SIGTERM", cleanUp.bind(null, 0));
process.on("SIGUSR1", cleanUp.bind(null, 0));
process.on("SIGUSR2", cleanUp.bind(null, 0));
process.on("uncaughtException", (err) => unhandledException.bind(null, err)());

logger.debug("Starting the bot...");
validateConfig();
cleanLogs();
client.login(BOT_TOKEN);
createTable();
startWebServer();
