const { SlashCommandBuilder } = require('@discordjs/builders');
const { TwitterApi } = require('twitter-api-v2');
const Tweet = require('../classes/Tweet');

const twitterClient = new TwitterApi(process.env.TWITTER_BREARER_TOKEN);

/*
    Command /add_tweet [tweet_id]
    Used to track new Tweet
*/
module.exports = {

	data: new SlashCommandBuilder()

		.setName('add_tweet')
		.setDescription('Add a new tracked tweet')
        .addStringOption(option => 
            option.setName('url')
                .setDescription('Tweet URL')
                .setRequired(true)
        )
        .setDefaultPermission(false),
    
    async execute(interaction) {
        // Find tweet ID
        let tweet_url = interaction.options.getString('url');
        let split = tweet_url.split('/');
        let tweet_id = split[split.length - 1];

        // Find associated tweet and author through the Twitter API
        let tweet = await twitterClient.v2.singleTweet(tweet_id, { 'tweet.fields': ['author_id', 'created_at'], 'user.fields': ['username'] });
        let author = await twitterClient.v2.user(tweet.data.author_id);
        
        // Create and persist the new tracket Tweet
        let tweetm = new Tweet(author, tweet);
        tweetm.persist();

        await interaction.reply("Tweet " + tweet_url + " written by " + tweetm.author_username + " is now tracked !");
    },
        
};