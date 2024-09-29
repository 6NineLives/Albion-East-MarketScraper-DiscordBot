require('dotenv').config();
const FACTION_REQUEST_CHANNEL_ID = process.env.FACTION_REQUEST_CHANNEL_ID;
const GUILD_REQUEST_CHANNEL_ID = process.env.GUILD_REQUEST_CHANNEL_ID;

const factionChat = require('./chat/faction.js');
const guildChat = require('./chat/guild.js');

module.exports = {
    async execute(message) {
        if (message.author.bot) return;
        switch (message.channel.id) {
            case FACTION_REQUEST_CHANNEL_ID:
                factionChat.listening(message);
                break;
            case GUILD_REQUEST_CHANNEL_ID:
                guildChat.listening(message);
                break;

        }
    }
}