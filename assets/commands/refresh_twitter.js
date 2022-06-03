const { SlashCommandBuilder } = require('@discordjs/builders');
const Twitter = require('../classes/Twitter');

/*
    Command /add_tweet [tweet_id]
    Used to track new Tweet
*/
module.exports = {

	data: new SlashCommandBuilder()

		.setName('refresh_twitter')
		.setDescription('Refresh Twitter interactions to handle LSC users actions (Like, RT) and update the COCA'),
    
    async execute(interaction) {
        const start = performance.now()
        await interaction.reply({ content: 'Refreshing ...', ephemeral: true });

        await Twitter.refreshTwitter();
       
        let duration = ((performance.now() - start)/1000).toFixed(2);
        await interaction.editReply({ content: 'Refresh duration : ' + duration + ' seconds', ephemeral: true });
    },
        
};
