require('dotenv').config();
const FACTION_REQUEST_CHANNEL_ID = process.env.FACTION_REQUEST_CHANNEL_ID;
const FACTION_AUDIT_CHANNEL_ID = process.env.FACTION_AUDIT_CHANNEL_ID;
const VISITOR = process.env.VISITOR;
const BW_ARMY = process.env.BW_ARMY;

module.exports = {
    async approve(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const member = interaction.message.content.split('\n')[0].replace('**User:** ', '').replace(/<@!?/g, '').replace(/>/g, '');
        const nickname = interaction.fields.getTextInputValue('approve-faction-nickname');

        await interaction.guild.members.fetch();
        await interaction.guild.roles.fetch();
        await interaction.guild.channels.fetch();
        const member_data = interaction.guild.members.cache.get(member);

        await member_data.roles.add(interaction.guild.roles.cache.find(r => r.name == BW_ARMY));
        await member_data.roles.remove(interaction.guild.roles.cache.find(r => r.name == VISITOR));
        await member_data.setNickname(nickname);

        const faction_channel = interaction.guild.channels.cache.find(c => c.id == FACTION_REQUEST_CHANNEL_ID);
        const message_list = await faction_channel.messages.fetch({ limit: 100 });
        const message = message_list.filter(m => m.author.id == member).map(m => m.id);

        if (message.length > 0) {
            for (var i = 0; i < message.length; i++) {
                faction_channel.messages.delete(message[i]);
            }
        }

        const log_channel = interaction.guild.channels.cache.find(c => c.id == FACTION_AUDIT_CHANNEL_ID);
        log_channel.send({ content: `${member_data} has been approved by <@${interaction.user.id}> in <#${FACTION_REQUEST_CHANNEL_ID}>` });

        await interaction.followUp({ content: `Approved request for ${member_data}`, ephemeral: true });
        await interaction.message.delete();
    },
    async deny(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const reason = interaction.fields.getTextInputValue('deny-faction-reason-input');
        const member = interaction.message.content.split('\n')[0].replace('**User:** ', '').replace(/<@!?/g, '').replace(/>/g, '');
        await interaction.guild.members.fetch()
        const member_data = interaction.guild.members.cache.get(member);
        member_data.send({ content: `Your request to join the faction in <#${FACTION_REQUEST_CHANNEL_ID}> has been denied for the following reason:\n\n**${reason}**` });

        const faction_channel = interaction.guild.channels.cache.find(c => c.id == FACTION_REQUEST_CHANNEL_ID);
        const message_list = await faction_channel.messages.fetch({ limit: 100 });
        const message = message_list.filter(m => m.author.id == member).map(m => m.id);

        if (message.length > 0) {
            for (var i = 0; i < message.length; i++) {
                faction_channel.messages.delete(message[i]);
            }
        }

        await interaction.followUp({ content: `Denied request for ${member_data}`, ephemeral: true });
        const log_channel = interaction.guild.channels.cache.find(c => c.id == FACTION_AUDIT_CHANNEL_ID);
        log_channel.send({ content: `${member_data} has been denied by <@${interaction.user.id}> in <#${FACTION_REQUEST_CHANNEL_ID}>\nReason: **${reason}**` });
        await interaction.message.delete();
    }
}