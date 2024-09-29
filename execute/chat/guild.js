const { ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { ButtonStyle, StringSelectMenuBuilder } = require('discord.js');

require('dotenv').config();
const GUILD_REQUEST_CHANNEL_ID = process.env.GUILD_REQUEST_CHANNEL_ID;
const GUILD_VERIFICATION_CHANNEL_ID = process.env.GUILD_VERIFICATION_CHANNEL_ID;
const GUILD_MEMBER = process.env.GUILD_MEMBER.split(';');

module.exports = {
    async listening(message) {
        try {
            var data = message.content.split('\n');
            data = data.map(d => d.split(':'));
            data = data.map(d => [d[0].trim(), d[1].trim()]);

            const row1 = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder().setCustomId("approve-guild-request").setPlaceholder('Select role to approve').addOptions(GUILD_MEMBER.map(
                    (member) => {
                        return { label: member, value: member }
                    }
                ))
            );
            const row2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId("deny-guild-request").setLabel("Deny").setStyle(ButtonStyle.Danger),
            );

            const verify_channel = message.guild.channels.cache.find(c => c.id == GUILD_VERIFICATION_CHANNEL_ID);

            var content_str = `**User:** <@${message.author.id}>\n`;
            for (var i = 0; i < data.length; i++) content_str += `**${data[i][0]}:** ${data[i][1]}\n`;
            content_str += `**Image:**`;

            if (message.attachments.size == 0) {
                verify_channel.send({
                    content: content_str,
                    components: [row1, row2]
                });
                return;
            }

            verify_channel.send({
                content: content_str,
                files: [message.attachments.first().url],
                components: [row1, row2]
            })

        } catch (error) {
            // await message.delete();
            // await message.author.send({
            //     content: `Your request to join the **White Blight** guild in <#${GUILD_REQUEST_CHANNEL_ID}> has been denied for the following reason:\n\n` +
            //         `Invalid format. Please use **exactly** the following format in <#${GUILD_REQUEST_CHANNEL_ID}>`
            // });
        }
    }
}