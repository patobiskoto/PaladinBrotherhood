const { SlashCommandBuilder } = require('@discordjs/builders');
const ExcelBuilder = require('../classes/ExcelBuilder')

/*
	Command /tweets_export_data
	Returns Excel file with all tweets data
*/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('tweets_export_data')
		.setDescription('Get all data from following tweets'),
		//.setDefaultPermission(false),
	async execute(interaction) {
		await interaction.reply({ content: 'Working on the report...', ephemeral: true });
		let excel = new ExcelBuilder('tweet');
        let attachment;
        try {
            attachment = await excel.export();
        } catch (error) {
            await interaction.editReply({ content: 'Error during export creation !', ephemeral: true });
			return;
        }
        await interaction.editReply({ files: [attachment], ephemeral: true });
        excel.clean();
	}
};
