const { SlashCommandBuilder } = require('@discordjs/builders');
const HonorsCampaign = require('../classes/HonorsCampaign');

/*
    Command /reopen_honors_campaign [campaign]
    Used to reopen selected honors campaign
*/
module.exports = {

	data: new SlashCommandBuilder()

		.setName('reopen_honors_campaign')
		.setDescription('Reopen provided honors campaign')
        .addStringOption(option =>
            option.setName('campaign')
                .setDescription('Selected honors campaign')
                .setRequired(true)
                .setAutocomplete(true)
        ),
    
    async execute(interaction) {
        let campaign = interaction.options.getString('campaign');
        
        let pCampaign = await HonorsCampaign.getCampaignByName(campaign);
        pCampaign.is_running = true;

        await pCampaign.persist();

        await interaction.reply(
            { 
                content: `${campaign} campaign restarted !`,
                ephemeral: true 
            }
        );
    },
    async autoComplete(interaction) {
        let response = [];
        for (let campaign of await HonorsCampaign.getAllCampaigns()) {
            if (campaign.is_running == false) {
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