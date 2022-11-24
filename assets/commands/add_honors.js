const { SlashCommandBuilder } = require('@discordjs/builders');
const HonorsCampaign = require('../classes/HonorsCampaign');
const HonorsUserCampaign = require('../classes/HonorsUserCampaign');
const HonorsUser = require('../classes/HonorsUser');

/*
    Command /add_honors [user] [campaign] [comment]
    Used to add new Honors to selected  Honors user for selected Honors campaign
*/
module.exports = {

	data: new SlashCommandBuilder()

		.setName('add_honors')
		.setDescription('Add Honors for provided Honors User')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The Honors user')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('campaign')
                .setDescription('Selected honors campaign')
                .setRequired(true)
                .setAutocomplete(true)
        )
        .addStringOption(option => 
            option.setName('comments')
                .setDescription('Add a comment if needed')
                .setRequired(false)    
        ),
    
    async execute(interaction) {
        let user = interaction.options.getUser('user');
        let campaign = interaction.options.getString('campaign');
        let comments = interaction.options.getString('comments');
        let creatorUserId = interaction.user.id;
        let creatorUserName = interaction.user.username + '#' + interaction.user.discriminator;
        let discordUserId = user.id;
        let discordUserName = user.username + '#' + user.discriminator;

        let honorsUser = await HonorsUser.getUserByID(user.id);
        if (honorsUser == undefined) {
            await interaction.reply({ content: 'Selected user is not a Honors Member', ephemeral: true });
            return;
        }

        let honorsUserCampaign = new HonorsUserCampaign(
            creatorUserId,
            creatorUserName,
            new Date().toISOString().split('T')[0],
            discordUserId,
            discordUserName,
            campaign,
            comments
        )

        await honorsUserCampaign.persist();

        await interaction.reply(
            { 
                content: `${campaign} award added for user ${user.username}`,
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