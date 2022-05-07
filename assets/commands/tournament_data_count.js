const { SlashCommandBuilder } = require('@discordjs/builders');
const TournamentRegistration = require('../classes/TournamentRegistration');

/*
	Command /tournament_data_count
	Returns number of Luchadores registered to the tournament
*/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('tournament_data_count')
		.setDescription('Get number of Luchadores registered to the tournament')
		.setDefaultPermission(false),
	async execute(interaction) {
		await interaction.reply({ content: 'Registrations = ' + await TournamentRegistration.getNumberOfRegistered(), ephemeral: true });
	}
};