const { SlashCommandBuilder } = require('@discordjs/builders');
const HonorsUser = require('../classes/HonorsUser');

/*
	Command /honors
	Returns the honors for the current user
*/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('honors')
		.setDescription('Get your honors'),
		//.setDefaultPermission(false),
	async execute(interaction) {
        let user = await HonorsUser.getUserByID(interaction.user.id);
        if (user != undefined) {
            await interaction.reply({ content: 'Your have ' + await user.getHonors() + ' :shield: honors', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Your are not declared as honors user. Please register', ephemeral: true });
        }
	}
};