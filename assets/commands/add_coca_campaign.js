const { SlashCommandBuilder } = require('@discordjs/builders');
const CocaCampaign = require('../classes/CocaCampaign');

/*
    Command /add_coca_campaign [name] [description] [coca]
    Used to create new Coca campaigns for LSC (Zapper, meme, fan arts, ...)
*/
module.exports = {

	data: new SlashCommandBuilder()

		.setName('add_coca_campaign')
		.setDescription('Add a new coca campaign in the Lucha Social Club')
        .addStringOption(option => 
            option.setName('name')
                .setDescription('Name of the campaign (meme, fan art, lore). Must be unique')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('description')
                .setDescription('Description of the coca campaign')
                .setRequired(true)
        )
        .addIntegerOption(option => 
            option.setName('coca')
                .setDescription('Coca amount for each new actions in the campaign')
                .setRequired(true)
        ),
    
    async execute(interaction) {
        
        let name = interaction.options.getString('name');
        let description = interaction.options.getString('description');
		let coca = interaction.options.getInteger('coca');
        let discordUserId = interaction.user.id;
        let discordUserName = interaction.user.username + '#' + interaction.user.discriminator;

        // Check if the campaign is not already registered
        let peristedCampaign = await CocaCampaign.getCampaignByName(name)
        if (peristedCampaign != undefined) {
            await interaction.reply({ content: 'campaign ' + name + ' already registered', ephemeral: true });
            return;
        }
        
        // create the associated CocaCampaign
        let campaign = new CocaCampaign(
            discordUserName,
            discordUserId,
            new Date().toISOString().split('T')[0],
            name,
            description,
            coca
        );
    
        // Persist the new CocaCampaign
        await campaign.persist();

        await interaction.reply(
            { 
                content: `The campaign ${name} is created !`,
                ephemeral: true 
            }
        );
    },
        
};