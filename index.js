require('dotenv').config();
const TOKEN = process.env.TOKEN;

const deployCommands = require('./deploy-commands.js');

const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const chat = require('./execute/chat.js');
const button = require('./execute/button.js');
const modal = require('./execute/modal.js');
const stringselect = require('./execute/stringselect.js');

const client = new Client({
	intents: [GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildModeration,
	GatewayIntentBits.MessageContent]
});
client.commands = new Collection();
client.commands.set('price', require('./commands/market/price.js'));
client.commands.set('member', require('./commands/guild/member.js'));
client.commands.set('guild', require('./commands/guild/guild.js'));
client.commands.set('faction', require('./commands/faction/faction.js'));

client.once(Events.ClientReady, async c => {
	await deployCommands.execute();
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

async function getError(interaction, error) {
	if (interaction.replied || interaction.deferred) {
		await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
	}
	console.error(error);
}

client.on(Events.MessageCreate, async message => {
	try {
		await chat.execute(message);
	} catch (error) {
		getError(message, error);
	}

});

client.on(Events.InteractionCreate, async interaction => {

	if (interaction.isButton()) {
		try {
			await button.execute(interaction);
		} catch (error) {
			getError(interaction, error);
		}
	}

	if (interaction.isModalSubmit()) {
		try {
			await modal.execute(interaction);
		} catch (error) {
			getError(interaction, error);
		}
	}

	if (interaction.isStringSelectMenu()) {
		try {
			await stringselect.execute(interaction);
		} catch (error) {
			getError(interaction, error);
		}
	}

	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) return;

	if (interaction.isAutocomplete()) {
		try {
			await command.autocomplete(interaction);
		} catch (error) {
			getError(interaction, error);
		}
	}


	if (interaction.isCommand()) {
		try {
			await command.execute(interaction);
		} catch (error) {
			getError(interaction, error);

		}
	}
});

client.login(TOKEN);