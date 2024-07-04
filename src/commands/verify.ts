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
import {
  deleteVerifyRequestByVerifyCode,
  findVerifyRequestByVerifyCode,
} from "../db/verifyRequest";
import {
  findMatchNotifyByIdentityCode,
  insertMatchNotify,
} from "../db/mathNotify";

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
      logger.trace(
        `Invalid verify token: ${token} for ${interaction.user.tag}(${userId})`
      );
      await interaction.reply({
        content: ":warning: Error: Invalid token. Please try again.",
        ephemeral: true,
      });
      return;
    }

    logger.trace(`Token verified for ${interaction.user.tag}(${userId}).`);
    logger.trace(`Deleting verify request, token: ${token}`);
    await deleteVerifyRequestByVerifyCode(token);

    const identityCode = verifyRequest.identify_code;
    logger.trace(
      `Inserting match notify for ${interaction.user.tag}(${userId}), identify code: ${identityCode}`
    );
    const isDuplicate = await findMatchNotifyByIdentityCode(identityCode);
    if (isDuplicate) {
      logger.trace(
        `Match notify already exists for ${interaction.user.tag}(${userId}), identify code: ${identityCode}`
      );
      await interaction.reply({
        content: ":warning: Error: That client is already verified and linked.",
        ephemeral: true,
      });
      return;
    }
    insertMatchNotify({ discord_id: userId, identity_code: identityCode });

    await interaction.reply({
      content: `Successfully verified your EFT: WMI client.\nNow you will receive notifications for your matches.`,
      ephemeral: true,
    });
  },
};
