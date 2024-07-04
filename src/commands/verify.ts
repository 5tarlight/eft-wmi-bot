import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
} from "@discordjs/builders";
import {
  CommandInteraction,
  ModalSubmitInteraction,
  SlashCommandBuilder,
  TextInputStyle,
} from "discord.js";
import { getLogger } from "../log/log";
import { findVerifyRequestByVerifyCode } from "../db/verifyRequest";

export const VERIFY_MODAL_ID = "eft-wmi-verify-modal";
export const VERIFY_TOKEN_INPUT_ID = "eft-wmi-verify-token-input";
const logger = getLogger("commands.verify");

export const Verify = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Verify and connect your EFT: WMI client."),

  async execute(interaction: CommandInteraction) {
    logger.trace(`Creating a verification modal for ${interaction.user.tag}`);

    const modal = new ModalBuilder()
      .setCustomId(VERIFY_MODAL_ID)
      .setTitle("EFT: WMI Verification");

    const tokenInput = new TextInputBuilder()
      .setCustomId(VERIFY_TOKEN_INPUT_ID)
      .setLabel("Verify code")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const actionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        tokenInput
      );
    modal.addComponents(actionRow);

    logger.trace(`Showing verification modal to ${interaction.user.tag}`);
    await interaction.showModal(modal);
  },

  async handleVerification(interaction: ModalSubmitInteraction) {
    const token = interaction.fields.getTextInputValue(VERIFY_TOKEN_INPUT_ID);
    const userId = interaction.user.id;
    logger.trace(
      `Handling verification for ${interaction.user.tag}(${userId}), token: ${token}`
    );

    const verifyRequest = await findVerifyRequestByVerifyCode(token);
    if (!verifyRequest) {
      logger.debug(
        `Invalid verify token: ${token} for ${interaction.user.tag}(${userId})`
      );
      await interaction.reply({
        content: "Error: Invalid token. Please try again.",
        ephemeral: true,
      });
      return;
    }

    logger.debug(`Token verified for ${interaction.user.tag}(${userId}).`);

    await interaction.reply({
      content: `You entered: ${token}`,
      ephemeral: true,
    });
  },
};
