require('dotenv').config();
const GUILD_REQUEST_CHANNEL_ID = process.env.GUILD_REQUEST_CHANNEL_ID;
const GUILD_AUDIT_CHANNEL_ID = process.env.GUILD_AUDIT_CHANNEL_ID;
const VISITOR = process.env.VISITOR;

module.exports = {
    async approve(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const member = interaction.message.content.split('\n')[0].replace('**User:** ', '').replace(/<@!?/g, '').replace(/>/g, '');
        const nickname = interaction.fields.getTextInputValue('approve-guild-nickname');
        const role = interaction.fields.getTextInputValue('approve-guild-role');

        await interaction.guild.members.fetch();
        await interaction.guild.roles.fetch();
        await interaction.guild.channels.fetch();
        const member_data = interaction.guild.members.cache.get(member);

        if (interaction.guild.roles.cache.find(r => r.name == role) == undefined) {
            await interaction.followUp({ content: `The role **${role}** does not exist.`, ephemeral: true });
            return;
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
        await interaction.message.delete();
    },
    async deny(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const reason = interaction.fields.getTextInputValue('deny-guild-reason-input');
        const member = interaction.message.content.split('\n')[0].replace('**User:** ', '').replace(/<@!?/g, '').replace(/>/g, '');
        await interaction.guild.members.fetch()
        const member_data = interaction.guild.members.cache.get(member);
        member_data.send({ content: `Your request to join the **White Blight** guild in <#${GUILD_REQUEST_CHANNEL_ID}> has been denied for the following reason:\n\n**${reason}**` });

        const guild_channel = interaction.guild.channels.cache.find(c => c.id == GUILD_REQUEST_CHANNEL_ID);
        const message_list = await guild_channel.messages.fetch({ limit: 100 });
        const message = message_list.filter(m => m.author.id == member).map(m => m.id);

        if (message.length > 0) {
            for (var i = 0; i < message.length; i++) {
                guild_channel.messages.delete(message[i]);
            }
        }

        const log_channel = interaction.guild.channels.cache.find(c => c.id == GUILD_AUDIT_CHANNEL_ID);

        await interaction.followUp({ content: `Denied request for ${member_data}`, ephemeral: true });
        log_channel.send({ content: `${member_data} has been denied by <@${interaction.user.id}> in <#${GUILD_REQUEST_CHANNEL_ID}>\nReason: **${reason}**` });
        await interaction.message.delete();
    }
}