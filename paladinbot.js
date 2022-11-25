require("dotenv").config();

const fs = require('node:fs');
const nodeCron = require('node-cron');
const Twitter = require('./assets/classes/Twitter')
const { Client, GatewayIntentBits, Collection, Constants } = require('discord.js');

const discordClient = new Client({ partials: ["CHANNEL"], intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

discordClient.commands = new Collection();
const commandFiles = fs.readdirSync('./assets/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./assets/commands/${file}`);
    discordClient.commands.set(command.data.name, command);
}

discordClient.once('ready', async () => {
	console.log(`Logged in as ${discordClient.user.tag}!`);
});

// Scheduled 12h
//nodeCron.schedule('* * */12 * * *', () => {
//	Twitter.refreshTwitter();
//});

discordClient.on('interactionCreate', async interaction => {
	if (interaction.channel.type == 'DM') return;
	if (interaction.isCommand() || interaction.isAutocomplete()) {
		const command = discordClient.commands.get(interaction.commandName);

		if (!command) return;

		try {
			if (interaction.isAutocomplete()) {
				await command.autoComplete(interaction);
			} else {
				console.log(interaction.createdAt.toISOString() + ' - user: ' + interaction.user.username + '#' + interaction.user.discriminator + ' cmd: ' + interaction.commandName);
				await command.execute(interaction);
			}	
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

discordClient.login(process.env.DISCORD_TOKEN);