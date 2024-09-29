const guildStringSelect = require('./stringselect/guild.js');

module.exports = {
    async execute(interaction) {
        const type = interaction.customId;
        switch (type) {
            case 'approve-guild-request':
                guildStringSelect.approval(interaction);
                break;
        }
    }
}