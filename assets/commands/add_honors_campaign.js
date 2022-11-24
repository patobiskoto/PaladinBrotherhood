const { SlashCommandBuilder } = require('@discordjs/builders');
const HonorsCampaign = require('../classes/HonorsCampaign');

/*
    Command /add_honors_campaign [name] [description] [honors]
    Used to create new Honors campaigns for Honors users (Zapper, meme, fan arts, ...)
*/
module.exports = {

	data: new SlashCommandBuilder()

		.setName('add_honors_campaign')
		.setDescription('Add a new Honors campaign in the Honors Club')
        .addStringOption(option => 
            option.setName('name')
                .setDescription('Name of the campaign (meme, fan art, lore). Must be unique')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('description')
                .setDescription('Description of the honors campaign')
                .setRequired(true)
        )
        .addIntegerOption(option => 
            option.setName('honors')
                .setDescription('Honors amount for each new actions in the campaign')
                .setRequired(true)
        ),
    
    async execute(interaction) {
        
        let name = interaction.options.getString('name');
        let description = interaction.options.getString('description');
		let honors = interaction.options.getInteger('honors');
        let discordUserId = interaction.user.id;
        let discordUserName = interaction.user.username + '#' + interaction.user.discriminator;

        // Check if the campaign is not already registered
        let peristedCampaign = await HonorsCampaign.getCampaignByName(name)
        if (peristedCampaign != undefined) {
            await interaction.reply({ content: 'campaign ' + name + ' already registered', ephemeral: true });
            return;
        }
        
        // create the associated HonorsCampaign
        let campaign = new HonorsCampaign(
            discordUserName,
            discordUserId,
            new Date().toISOString().split('T')[0],
            name,
            description,
            honors,
            true
        );
    
        // Persist the new HonorsCampaign
        await campaign.persist();

        await interaction.reply(
            { 
                content: `The campaign ${name} is created !`,
                ephemeral: true 
            }
        );
    },
        
};