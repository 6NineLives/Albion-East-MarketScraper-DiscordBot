const { ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { ButtonStyle } = require('discord.js');

require('dotenv').config();
const FACTION_REQUEST_CHANNEL_ID = process.env.FACTION_REQUEST_CHANNEL_ID;
const FACTION_VERIFICATION_CHANNEL_ID = process.env.FACTION_VERIFICATION_CHANNEL_ID;

module.exports = {
    async listening(message) {
        try {
            var data = message.content.split('\n');
            data = data.map(d => d.split(':'));
            data = data.map(d => [d[0].trim(), d[1].trim()]);

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId("approve-faction-request").setLabel("Approve").setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId("deny-faction-request").setLabel("Deny").setStyle(ButtonStyle.Danger),
            )

            const verify_channel = message.guild.channels.cache.find(c => c.id == FACTION_VERIFICATION_CHANNEL_ID);

            var content_str = `**User:** <@${message.author.id}>\n`;
            for (var i = 0; i < data.length; i++) content_str += `**${data[i][0]}:** ${data[i][1]}\n`;
            content_str += `**Image:**`;

            if (message.attachments.size == 0) {
                verify_channel.send({
                    content: content_str,
                    components: [row]
                })
                return;
            }

            verify_channel.send({
                content: content_str,
                files: [message.attachments.first().url],
                components: [row]
            })

        } catch (error) {
            // await message.delete();
            // await message.author.send({
            //     content: `Your request to join the faction in <#${FACTION_REQUEST_CHANNEL_ID}> has been denied for the following reason:\n\n` +
            //         `Invalid format. Please use **exactly** the following format in <#${FACTION_REQUEST_CHANNEL_ID}>`
            // });
        }
    }
}