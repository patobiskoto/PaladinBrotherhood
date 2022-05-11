const { SlashCommandBuilder } = require('@discordjs/builders');
const ExcelBuilder = require('../classes/ExcelBuilder')

/*
	Command /tournament_export_data
	Returns Excel file with all tournament data
*/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('tournament_export_data')
		.setDescription("Get all tournament's data as Excel file"),
	async execute(interaction) {
        await interaction.reply({ content: 'Working on the report...', ephemeral: true });
        let excel = new ExcelBuilder('tournament');
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
