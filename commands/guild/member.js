const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require("node-fetch");
const ADMIN = process.env.ADMIN;
const GUILD_ROLE = process.env.GUILD_MEMBER.split(";");

function guildMemberStatus(guild_data, discord_data) {
    guild_data = guild_data.map(g => {
        if (discord_data.some(d => d.nickname.toLowerCase() == g.toLowerCase() || d.nickname.toLowerCase().includes(g.toLowerCase()))) {
            // return { nickname: g, roles: discord_data.find(d => d.nickname.toLowerCase() == g.toLowerCase() || d.nickname.toLowerCase().includes(g.toLowerCase())).roles.join(', ') };
            return { nickname: g, roles: 'Y' };
        } else {
            return { nickname: g, roles: '-' };
        }
    });
    return guild_data;
}

function inDiscordButNotInGuild(guild_data, discord_data) {
    var result = [];
    discord_data.forEach(d => {
        if (!guild_data.some(g => g.toLowerCase() == d.nickname.toLowerCase() || d.nickname.toLowerCase().includes(g.toLowerCase()))) {
            result.push({ nickname: d.nickname, roles: d.roles.join(', ') });
        }
    });
    return result;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('member')
        .setDescription('Get information about a member of the guild')
        .addStringOption(option =>
            option.setName('option')
                .setDescription('Add option to filter the result')
                .setRequired(true)
                .addChoices({ name: "Both", value: "0" },
                    { name: "Guild Member Status", value: "1" },
                    { name: "In Discord But Not In Guild", value: "2" },
                )
        ),
    async execute(interaction) {
        if (!interaction.member.roles.cache.some(r => r.name == ADMIN)) {
            return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        await interaction.deferReply();
        var result = await fetch(`https://gameinfo-sgp.albiononline.com/api/gameinfo/guilds/DKZ8R30GQ4eHUrfU_RUAqQ/members`);
        var guild_data = await result.json();
        guild_data = guild_data.map(row => row.Name).sort();

        await interaction.guild.members.fetch()
        const discord_data = interaction.guild.members.cache.map(m => {
            if (m.roles.cache.some(r => GUILD_ROLE.includes(r.name))) {
                return {
                    nickname: m.nickname ? m.nickname : m.user.username, roles: m.roles.cache.map(r => {
                        if (GUILD_ROLE.includes(r.name)) return r.name;
                    }).filter(r => r)
                };
            }
        }).filter(m => m);

        var exec_1 = guildMemberStatus(guild_data, discord_data);
        var exec_2 = inDiscordButNotInGuild(guild_data, discord_data);

        const embed_1 = new EmbedBuilder()
            .setTitle('Guild Member Status')
            .setDescription('List of guild members and their roles')
            .setColor(0x00AE86)
            .addFields(
                { name: 'Guild Member', value: exec_1.length ? exec_1.map(m => m.nickname).join('\n') : 'No data', inline: true },
                { name: 'Roles', value: exec_1.length ? exec_1.map(m => m.roles).join('\n') : 'No data', inline: true }
            );

        const embed_2 = new EmbedBuilder()
            .setTitle('In Discord Guild But Not In Albion Guild')
            .setDescription('List of members in Discord but not in the guild')
            .setColor(0x00AE86)
            .addFields(
                { name: 'Discord Member', value: exec_2.length ? exec_2.map(m => m.nickname).join('\n') : 'No data', inline: true },
                { name: 'Roles', value: exec_2.length ? exec_2.map(m => m.roles).join('\n') : 'No data', inline: true }
            );

        if (interaction.options.getString('option') == "1") {

            await interaction.followUp({ embeds: [embed_1] });
        } else if (interaction.options.getString('option') == "2") {
            await interaction.followUp({ embeds: [embed_2] });
        } else {
            await interaction.followUp({ embeds: [embed_1, embed_2] });
        }
    }
}