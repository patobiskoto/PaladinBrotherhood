const { SlashCommandBuilder } = require('@discordjs/builders');
const TournamentRegistration = require('../classes/TournamentRegistration');

/*
	Command /tournament_my_registration
	Returns data for the current user
*/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('tournament_my_registration')
		.setDescription('Get data for the current user'),
		//.setDefaultPermission(false),
	async execute(interaction) {
		let pRegistration = await TournamentRegistration.getProvidedUserTournamentRegistration('discord_id', interaction.user.id);
		if (pRegistration != undefined) {
			await interaction.reply({ embeds: [await pRegistration.prepareResponse()], ephemeral: true });
		} else {
			await interaction.reply({ content: 'Registration not found !', ephemeral: true });
			return;
		}
	}
};
