const { db } = require('../db/db');

/*
    HonorsUsersTweets class
    Link between HonorsUser and Tweet, used to track social interactions and in coca calculation
*/
class HonorsUsersTweets {

    // Constructor
    constructor(_tweet_id, _discord_id, _action) {
        this.tweet_id = _tweet_id;
        this.discord_id = _discord_id;
        this.action = _action;
    }

    // Persist if needed, else update
    async persist() {
        if (await this.isAlreadyPersisted()) {
            return;
        } else {
            await this.insert();
        }
    }

    // Check if HonorsUserTweet is already persisted
    async isAlreadyPersisted() {
        console.log('check if users_tweets already persisted ' + this.discord_id);
        let pUsersTweets = await this.getUserTweet(this.discord_id, this.tweet_id, this.action);
        if (await pUsersTweets.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    // Find HonorsUserTweet corresponding to the user discord id, user tweet id and related action (Like, RT, ...)
    async getUserTweet(_discord_id = this.discord_id, _tweet_id = this.tweet_id, _action = this.action) {
        return await db.any('select * from paladin.users_tweets where discord_id = $1 and tweet_id = $2 and action = $3', [_discord_id, _tweet_id, _action]);
    }

    // Find HonorsUserTweet corresponding to the user discord id, user tweet id and related action (Like, RT, ...)
    static async getUserTweet(_discord_id, _tweet_id, _action) {
        return await db.any('select * from paladin.users_tweets where discord_id = $1 and tweet_id = $2 and action = $3', [_discord_id, _tweet_id, _action]);
    }

    // Create the new HonorsUserTweet
    async insert() {
        console.log('insert users_tweets ' + this.discord_id);
        db.any(
            'insert into paladin.users_tweets(discord_id, tweet_id, action) values($1, $2, $3)',
                [this.discord_id, this.tweet_id, this.action])
            .then((result) => {
                console.log(this.discord_id + " inserted !");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Find HonorsUSerTweet for the provided user discord id
    static async getProvidedUserTweets(_discord_id) {
        let usersTweets = [];
        let pUsersTweets = await db.any('select * from paladin.users_tweets where discord_id = $1', _discord_id);
        for (let pUserTweet of pUsersTweets) {
            let userTweet = new HonorsUsersTweets(
                pUserTweet.tweet_id,
                pUserTweet.discord_id,
                pUserTweet.action
            );
            usersTweets.push(userTweet);
        }
        return usersTweets;
    }

}

module.exports = HonorsUsersTweets;