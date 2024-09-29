const factionButton = require('./button/faction.js');
const guildButton = require('./button/guild.js');
const guildStringSelect = require('./stringselect/guild.js');

module.exports = {
    async execute(interaction) {
        const type = interaction.customId;
        switch (type) {
            case 'approve-faction-request':
                factionButton.approval(interaction);
                break;
            case 'deny-faction-request':
                factionButton.deny(interaction);
                break;
            case 'deny-guild-request':
                guildButton.deny(interaction);
                break;
        }
    }
}