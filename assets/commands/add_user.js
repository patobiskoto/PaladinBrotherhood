const { SlashCommandBuilder } = require('@discordjs/builders');
const HonorsUser = require('../classes/HonorsUser');
const { TwitterApi } = require('twitter-api-v2');

const twitterClient = new TwitterApi(process.env.TWITTER_BREARER_TOKEN);

/*
    Command /add_user [wallet] [twitter]
    Used to register new users to the Honors System
*/
module.exports = {

	data: new SlashCommandBuilder()

		.setName('add_user')
		.setDescription('Add a new user in the Honors System')
        .addStringOption(option => 
            option.setName('twitter')
                .setDescription('The full URL to your Twitter profile')
                .setRequired(true)
        ).addStringOption(option => 
            option.setName('wallet')
                .setDescription('Your 0x. Not compatible with ENS')
                .setRequired(false) 
        ),
        //.setDefaultPermission(false),
    
    async execute(interaction) {
        // Check wallet parameter
        let wallet = interaction.options.getString('wallet');
        if (wallet != undefined && !wallet.startsWith('0x')) {
            await interaction.reply({ content: 'first paremeter must be your 0x', ephemeral: true });
            return;
        }

        // check twitter parameter
        let twitter = interaction.options.getString('twitter');
        if (!twitter.startsWith('https://twitter.com/')) {
            await interaction.reply({ content: 'second paremeter must be your twitter profile url', ephemeral: true });
            return;
        }

        let discordUserId = interaction.user.id;
        let discordUserName = interaction.user.username + '#' + interaction.user.discriminator;

        // find Twitter user through Twitter API
        let twitterUser = await twitterClient.v2.userByUsername(twitter.replace('https://twitter.com/', ''));

        // Check if the user is not already registered
        let persistedUser = await HonorsUser.getUserByID(discordUserId);
        if (persistedUser != undefined) {
            await interaction.reply({ content: 'user ' + discordUserName + ' already registered', ephemeral: true });
            return;
        }
        
        // create the associated HonorsUser
        let user = new HonorsUser(
            wallet,
            twitterUser.data.username,
            twitterUser.data.id,
            discordUserName,
            discordUserId,
            new Date().toISOString().split('T')[0]
        );
    
        // Persist the new HonorsUser
        await user.persist();

        // Check if the user is well persisted and add the Honors discord role
        // DISABLED : issue with Paladin discord permissions
        /*user = await HonorsUser.getUserByID(interaction.user.id);
        if (user != null) {
            let role = await interaction.guild.roles.fetch(process.env.HONORS_ROLE_ID);
            interaction.member.roles.add(role).catch(console.error);
        }*/
        await interaction.reply(
            { 
                content: "Congratulations " + interaction.user.username
                    + " ! You are now part of the Paladin's Brotherhood !",
                ephemeral: true 
            }
        );
    },
        
};