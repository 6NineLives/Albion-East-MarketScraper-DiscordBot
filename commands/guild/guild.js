const { SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const VISITOR = process.env.VISITOR;
const GUILD_APPROVE_ROLE = process.env.ADMIN;
const GUILD_REQUEST_CHANNEL_ID = process.env.GUILD_REQUEST_CHANNEL_ID;
const GUILD_AUDIT_CHANNEL_ID = process.env.GUILD_AUDIT_CHANNEL_ID;
const GUILD_ROLE = process.env.GUILD_MEMBER.split(";");

function addChoiceByArray(option, entity) {
    entity.forEach(element => {
        option.addChoices({ name: element, value: element });
    });
    return option;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guild')
        .setDescription('Approve join guild request')
        .addStringOption(option =>
            option.setName('member')
                .setDescription('Member to approve')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('nickname')
                .setDescription('Nickname')
                .setRequired(true)
        )
        .addStringOption(option => addChoiceByArray(option.setName('role').setDescription('Role').setRequired(true), GUILD_ROLE)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        if (!interaction.member.roles.cache.some(r => GUILD_APPROVE_ROLE.includes(r.name))) {
            return await interaction.followUp({ content: 'You do not have permission to use this command.', ephemeral: true });
        }
        if (interaction.channelId != GUILD_REQUEST_CHANNEL_ID) {
            return await interaction.followUp({ content: 'This command can only be used in <#' + GUILD_REQUEST_CHANNEL_ID + '>', ephemeral: true });
        }
        const member = interaction.options.getString('member').replace(/<@!?/g, '').replace(/>/g, '');
        await interaction.guild.members.fetch();
        await interaction.guild.roles.fetch();
        await interaction.guild.channels.fetch();
        const member_data = interaction.guild.members.cache.get(member);
        if (!member_data) {
            return await interaction.followUp({ content: 'Member not found.', ephemeral: true });
        }
        const nickname = interaction.options.getString('nickname');
        if (nickname.length > 32) {
            return await interaction.followUp({ content: 'Nickname is too long (nickname must be less than 32 characters).', ephemeral: true });
        }
        const role = interaction.options.getString('role');
        if (GUILD_ROLE.indexOf(role) == -1) {
            return await interaction.followUp({ content: 'Role not found.', ephemeral: true });
        }

        await member_data.roles.add(interaction.guild.roles.cache.find(r => r.name == role));
        await member_data.roles.remove(interaction.guild.roles.cache.find(r => r.name == VISITOR));
        await member_data.setNickname(nickname);

        const guild_channel = interaction.guild.channels.cache.find(c => c.id == GUILD_REQUEST_CHANNEL_ID);
        const message_list = await guild_channel.messages.fetch({ limit: 100 });
        const message = message_list.filter(m => m.author.id == member).map(m => m.id);

        if (message.length > 0) {
            for (var i = 0; i < message.length; i++) {
                guild_channel.messages.delete(message[i]);
            }
        }

        const log_channel = interaction.guild.channels.cache.find(c => c.id == GUILD_AUDIT_CHANNEL_ID);
        log_channel.send({ content: `${member_data} has been approved by <@${interaction.user.id}> in <#${GUILD_REQUEST_CHANNEL_ID}>` });
        await interaction.followUp({ content: `Approved request for ${member_data}`, ephemeral: true });
        return;
    }
}