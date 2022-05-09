require("dotenv").config();

const fs = require('node:fs');
const { Client, Intents, Collection, Constants } = require('discord.js');

const discordClient = new Client({ partials: ["CHANNEL"], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES] });

discordClient.commands = new Collection();
const commandFiles = fs.readdirSync('./assets/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./assets/commands/${file}`);
    discordClient.commands.set(command.data.name, command);
}

discordClient.once(Constants.ShardEvents.READY, async () => {
	console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on(Constants.Events.INTERACTION_CREATE, async interaction => {
	if (!interaction.isCommand()) return;
	if (interaction.channel.type == 'DM') return;

	const command = discordClient.commands.get(interaction.commandName);

	if (!command) return;

	try {
		
		console.log(interaction.createdAt.toISOString() + ' - user: ' + interaction.user.username + '#' + interaction.user.discriminator + ' cmd: ' + interaction.commandName);
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

discordClient.login(process.env.DISCORD_TOKEN);