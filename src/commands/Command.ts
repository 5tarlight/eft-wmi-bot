import {
  CommandInteraction,
  ModalSubmitInteraction,
  SlashCommandBuilder,
} from "discord.js";

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<any>;
}

export interface ModalSubmitHandler {
  [key: string]: (interaction: ModalSubmitInteraction) => any;
}
