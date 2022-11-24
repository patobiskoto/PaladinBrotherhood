const { SlashCommandBuilder } = require('@discordjs/builders');
const HonorsCampaign = require('../classes/HonorsCampaign');

/*
    Command /close_honors_campaign [campaign]
    Used to close selected honors campaign
*/
module.exports = {

	data: new SlashCommandBuilder()

		.setName('close_honors_campaign')
		.setDescription('Close provided honors campaign')
        .addStringOption(option =>
            option.setName('campaign')
                .setDescription('Selected honors campaign')
                .setRequired(true)
                .setAutocomplete(true)
        ),
    
    async execute(interaction) {
        let campaign = interaction.options.getString('campaign');
        
        let pCampaign = await HonorsCampaign.getCampaignByName(campaign);
        pCampaign.is_running = false;

        await pCampaign.persist();

        await interaction.reply(
            { 
                content: `${campaign} campaign stopped !`,
                ephemeral: true 
            }
        );
    },
    async autoComplete(interaction) {
        let response = [];
        for (let campaign of await HonorsCampaign.getAllCampaigns()) {
            if (campaign.is_running == true) {
                response.push({
                    name: campaign.name,
                    value: campaign.name
                });
            }
        }
        if (response == undefined) {
            interaction.reply({ content: 'No campaign found !', ephemeral: true });
        } else {
            interaction.respond(response);
        }
    }
};