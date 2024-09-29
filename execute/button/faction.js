const { ModalBuilder, TextInputStyle, TextInputBuilder, ActionRowBuilder } = require("discord.js");
require('dotenv').config();

const FACTION_APPROVE_ROLE = process.env.GUILD_MEMBER.split(";");

module.exports = {
    async approval(interaction) {
        if (!interaction.member.roles.cache.some(r => FACTION_APPROVE_ROLE.includes(r.name))) {
            return await interaction.reply({ content: 'You do not have permission to approve', ephemeral: true });
        }
        const nickname = new TextInputBuilder()
            .setCustomId("approve-faction-nickname")
            .setLabel("Nickname")
            .setValue(interaction.message.content.replace(/\*/g, "").split('\n')[1].split(':')[1].trim())
            .setStyle(TextInputStyle.Short);

        const modal = new ModalBuilder()
            .setCustomId("approve-faction-modal")
            .setTitle(`Approve Faction Request`)
            .addComponents(new ActionRowBuilder().addComponents(nickname));
        await interaction.showModal(modal);
    },
    async deny(interaction) {
        if (!interaction.member.roles.cache.some(r => FACTION_APPROVE_ROLE.includes(r.name))) {
            return await interaction.reply({ content: 'You do not have permission to deny', ephemeral: true });
        }
        const reasonInput = new TextInputBuilder()
            .setCustomId("deny-faction-reason-input")
            .setLabel("Reason")
            .setStyle(TextInputStyle.Paragraph);

        const modal = new ModalBuilder()
            .setCustomId("deny-faction-modal")
            .setTitle(`Deny Faction Request`)
            .addComponents(new ActionRowBuilder().addComponents(reasonInput));
        await interaction.showModal(modal);
    }
}