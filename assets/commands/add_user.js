const { SlashCommandBuilder } = require('@discordjs/builders');
const LSCUser = require('../classes/LSCUser');
const Luchadores = require('../classes/Luchadores');
const { TwitterApi } = require('twitter-api-v2');

const twitterClient = new TwitterApi(process.env.TWITTER_BREARER_TOKEN);

/*
    Command /add_user [wallet] [twitter]
    Used to register new users to the Luchadores Social Club
*/
module.exports = {

	data: new SlashCommandBuilder()

		.setName('add_user')
		.setDescription('Add a new user in the Lucha Social Club')
        .addStringOption(option => 
            option.setName('wallet')
                .setDescription('Your 0x. Not compatible with ENS')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('twitter')
                .setDescription('The full URL to your Twitter profile')
                .setRequired(true)
        ),
        //.setDefaultPermission(false),
    
    async execute(interaction) {
        // Check wallet parameter
        let wallet = interaction.options.getString('wallet');
        if (!wallet.startsWith('0x')) {
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
        let persistedUser = await LSCUser.getUserByID(discordUserId);
        if (persistedUser != undefined) {
            await interaction.reply({ content: 'user ' + discordUserName + ' already registered', ephemeral: true });
            return;
        }
        
        // check if provided wallet is a Luchadores owner
        let isOwner = await Luchadores.isOwnerOfALuchador(wallet);
        if (!isOwner) {
            await interaction.reply({ content: 'you must have at least 1 luchador', ephemeral: true });
            return;
        }

        // create the associated LSCUser
        let user = new LSCUser(
            wallet,
            twitterUser.data.username,
            twitterUser.data.id,
            discordUserName,
            discordUserId,
            new Date().toISOString().split('T')[0]
        );
    
        // Persist the new LSCUser
        await user.persist();

        // Check if the user is well persisted and add the LSC discord role
        user = await LSCUser.getUserByID(interaction.user.id);
        if (user != null) {
            let role = await interaction.guild.roles.fetch(process.env.LSC_ROLE_ID);
            interaction.member.roles.add(role);
        }

        await interaction.reply("¡ Felicidades " + interaction.user.username 
            + " ! You can stretch out your legs, light a cigar, drink your glass of Tequila cooled by an ice cube, you're now in the Luchadores Social Club <:tequila_lsc:972095662072168510>");

    },
        
};