const { ModalBuilder, TextInputStyle, TextInputBuilder, ActionRowBuilder } = require("discord.js");
require('dotenv').config();

const GUILD_APPROVE_ROLE = process.env.ADMIN;

module.exports = {
    async deny(interaction) {
        if (!interaction.member.roles.cache.some(r => GUILD_APPROVE_ROLE.includes(r.name))) {
            return await interaction.reply({ content: 'You do not have permission to deny', ephemeral: true });
        }
        const reasonInput = new TextInputBuilder()
            .setCustomId("deny-guild-reason-input")
            .setLabel("Reason")
            .setStyle(TextInputStyle.Paragraph);

        const modal = new ModalBuilder()
            .setCustomId("deny-guild-modal")
            .setTitle(`Deny Guild Request`)
            .addComponents(new ActionRowBuilder().addComponents(reasonInput));
        await interaction.showModal(modal);
    }
}