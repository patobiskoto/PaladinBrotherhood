const { SlashCommandBuilder } = require('@discordjs/builders');
const Tweet = require('../classes/Tweet');

/*
    Command /remove_all_tweets [yes]
    Used to delete all followed tweets.
*/
module.exports = {

	data: new SlashCommandBuilder()
		.setName('remove_all_tweets')
		.setDescription('Remove all followed tweets')
        .addStringOption(option => 
            option.setName('sure')
                .setDescription('Are you sure? Cant be reverted')
                .setRequired(true)
        ),
    async execute(interaction) {
        let sure = interaction.options.getString('sure');
        if (sure === "yes") {
            await Tweet.removeAllTweets();
            interaction.reply({ content: 'All followed tweets are deleted !', ephemeral: true });
        } else {
            interaction.reply({ content: 'Not sure ! All followed tweets are still in the database :)', ephemeral: true });
        }
    }
       
};