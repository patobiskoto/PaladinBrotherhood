const { SlashCommandBuilder } = require('@discordjs/builders');
const LSCUser = require('../classes/LSCUser');

/*
	Command /coca_total
	Used to display the current COCA ranking
*/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('coca_total')
		.setDescription('Get the COCA ranking')
		.setDefaultPermission(false),
	async execute(interaction) {

		// Get all LSC users
        let users = await LSCUser.getAllUsers();

		let response = '';
		let cocaUserArray = [];

		for (let user of users) {
			cocaUserArray.push({discordUser: user.discord_id, coca: await user.getCoca()});
		}

		cocaUserArray.sort((a, b) => b.coca - a.coca);

		for (let cocaUser of cocaUserArray) {
			response += `<@${cocaUser.discordUser}>` + ' = ' + cocaUser.coca + ' <:coca_leaf:972094774582587393>\n';
		}
		
		await interaction.reply(response);
	}
};
