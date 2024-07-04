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

export const VERIFY_MODAL_ID = "eft-wmi-verify-modal";
export const VERIFY_TOKEN_INPUT_ID = "eft-wmi-verify-token-input";

export const Verify = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Verify and connect your EFT: WMI client."),
  async execute(interaction: CommandInteraction) {
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

    await interaction.showModal(modal);
  },

  async handleVerification(interaction: ModalSubmitInteraction) {
    const token = interaction.fields.getTextInputValue(VERIFY_TOKEN_INPUT_ID);
    await interaction.reply({
      content: `You entered: ${token}`,
      ephemeral: true,
    });
  },
};
