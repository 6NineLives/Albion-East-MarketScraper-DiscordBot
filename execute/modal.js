const factionModal = require('./modal/faction.js');
const guildModal = require('./modal/guild.js');

module.exports = {
    async execute(interaction) {
        const type = interaction.customId;
        switch (type) {
            case 'approve-faction-modal':
                factionModal.approve(interaction);
                break;
            case 'deny-faction-modal':
                factionModal.deny(interaction);
                break;
            case 'approve-guild-modal':
                guildModal.approve(interaction);
                break;
            case 'deny-guild-modal':
                guildModal.deny(interaction);
                break;
        }
    }
}