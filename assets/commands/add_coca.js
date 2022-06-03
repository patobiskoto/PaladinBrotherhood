const { SlashCommandBuilder } = require('@discordjs/builders');
const CocaCampaign = require('../classes/CocaCampaign');
const LSCUserCocaCampaign = require('../classes/LSCUserCocaCampaign');
const LSCUser = require('../classes/LSCUser');

/*
    Command /add_coca [user] [campaign] [comment]
    Used to add new Coca to selected  LSC user for selected Coca campaign
*/
module.exports = {

	data: new SlashCommandBuilder()

		.setName('add_coca')
		.setDescription('Add Coca for provided LSC User')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The LSC user')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('campaign')
                .setDescription('Selected coca campaign')
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

        let lscUser = await LSCUser.getUserByID(user.id);
        if (lscUser == undefined) {
            await interaction.reply({ content: 'Selected user is not a LSC Member', ephemeral: true });
            return;
        }

        let lscUserCampaign = new LSCUserCocaCampaign(
            creatorUserId,
            creatorUserName,
            new Date().toISOString().split('T')[0],
            discordUserId,
            discordUserName,
            campaign,
            comments
        )

        await lscUserCampaign.persist();

        await interaction.reply(
            { 
                content: `${campaign} award added for user ${user.username}`,
                ephemeral: true 
            }
        );
    },
    async autoComplete(interaction) {
        let response = [];
        for (let campaign of await CocaCampaign.getAllCampaigns()) {
            response.push({
                name: campaign.name,
                value: campaign.name
            });
        }
        interaction.respond(response);
    }
};