const { SlashCommandBuilder } = require('@discordjs/builders');
const LSCUser = require('../classes/LSCUser');

/*
	Command /coca
	Returns the COCA for the current user
*/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('coca')
		.setDescription('Get your COCA')
		.setDefaultPermission(false),
	async execute(interaction) {
        let user = await LSCUser.getUserByID(interaction.user.id);
		await interaction.reply({ content: 'Your have ' + await user.getCoca() + ' <:coca_leaf:972094774582587393>', ephemeral: true });
	}
};