const { TextInputBuilder } = require('@discordjs/builders');
const { TextInputStyle, ModalBuilder, ActionRowBuilder } = require('discord.js');

require('dotenv').config();

const GUILD_APPROVE_ROLE = process.env.ADMIN;


module.exports = {
    async approval(interaction) {
        if (!interaction.member.roles.cache.some(r => GUILD_APPROVE_ROLE.includes(r.name))) {
            return await interaction.reply({ content: 'You do not have permission to approve.', ephemeral: true });
        }
        const nickname = new TextInputBuilder()
            .setCustomId("approve-guild-nickname")
            .setLabel("Nickname")
            .setValue(interaction.message.content.replace(/\*/g, "").split('\n')[1].split(':')[1].trim())
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const role = new TextInputBuilder()
            .setCustomId("approve-guild-role")
            .setLabel("Role")
            .setValue(interaction.values[0])
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const modal = new ModalBuilder()
            .setCustomId("approve-guild-modal")
            .setTitle(`Approve Guild Request`)
            .addComponents(new ActionRowBuilder().addComponents(nickname))
            .addComponents(new ActionRowBuilder().addComponents(role));
        await interaction.showModal(modal);
    }
}