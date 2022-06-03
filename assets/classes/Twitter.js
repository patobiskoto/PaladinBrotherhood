const LSCUserTweet = require('./LSCUserTweet');
const LSCUser = require('./LSCUser');
const { TwitterApi } = require('twitter-api-v2');
const Tweet = require('./Tweet');

const twitterClient = new TwitterApi(process.env.TWITTER_BREARER_TOKEN);

/**
 * Class used to handle Twitter operations
 */
 class Twitter {

    static async refreshTwitter() {
        // Get all tracked Tweets
        let allTweets = await Tweet.getAllTweets();
        // Get all LSC users
        let LSCUsers = await LSCUser.getAllUsers();

        let parsedTweets = [];

        // Refresh interactions on all tracket tweets
        for (let i = 0; i < allTweets.length; i++) {
            let twitterLikers = await twitterClient.v2.tweetLikedBy(allTweets[i].tweet_id, { asPaginator: true });
            let twitterRT = await twitterClient.v2.tweetRetweetedBy(allTweets[i].tweet_id, { asPaginator: true });
            parsedTweets.push({
                id: allTweets[i].tweet_id,
                likers: await LSCUser.getValidLSCUser(twitterLikers, LSCUsers),
                rt: await LSCUser.getValidLSCUser(twitterRT, LSCUsers)
            });        
        }

        for await (let parsedTweet of parsedTweets) {
            // Create LSCUserTweet / coca for all likers
            for (let liker of parsedTweet.likers) {
                let userTweet = await LSCUserTweet.getUserTweet(liker.discord_id, parsedTweet.id, process.env.ACTION_LIKE);
                if (userTweet == undefined || userTweet.length == 0) {
                    let pUsersTweets = new LSCUserTweet(parsedTweet.id, liker.discord_id, process.env.ACTION_LIKE);
                    pUsersTweets.insert();
                }
            }
            // Create LSCUserTweet / coca for all RT
            for (let rt of parsedTweet.rt) {
                let userTweet = await LSCUserTweet.getUserTweet(rt.discord_id, parsedTweet.id, process.env.ACTION_RT);
                if (userTweet == undefined || userTweet.length == 0) {
                    let pUsersTweets = new LSCUserTweet(parsedTweet.id, rt.discord_id, process.env.ACTION_RT);
                    pUsersTweets.insert();
                }
            }
        }
    }
 }

 module.exports = Twitter;