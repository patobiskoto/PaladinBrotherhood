const { db } = require('../db/db');

/*
    Tweet class.
    Used to register tweets to track for honors calculation
 */
class Tweet {

    // Constructor
    constructor(_author, _tweet) {
        this.author_id = _author.data.id,
        this.author_name = _author.data.name,
        this.author_username = _author.data.username,
        this.tweet_id = _tweet.data.id,
        this.tweet_created_at = _tweet.data.created_at,
        this.tweet_text = _tweet.data.text
    }

    // Persist if needed, else update
    async persist() {
        if (await this.isAlreadyPersisted()) {
            await this.update();
        } else {
            await this.insert();
        }
    }

    // Create the new Tweet
    async insert() {
        console.log('insert tweet ' + this.tweet_id);
        db.any(
            'insert into paladin.tweets(author_id, author_name, author_username, tweet_created_at, tweet_text, tweet_id) values($1, $2, $3, $4, $5, $6)',
                [this.author_id, this.author_name, this.author_username, this.tweet_created_at, this.tweet_text, this.tweet_id])
            .then((result) => {
                console.log(this.tweet_id + " inserted !");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Update the tweet
    async update() {
        console.log('update tweet ' + this.tweet_id);
        db.any(
            'update paladin.tweets set author_id = $1, author_name = $2, author_username = $3, tweet_created_at = $4, tweet_text = $5 where tweet_id = $6',
                [this.author_id, this.author_name, this.author_username, this.tweet_created_at, this.tweet_text, this.tweet_id])
            .then((result) => {
                console.log(this.tweet_id + " updated !");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Check if current tweet is already persisted
    async isAlreadyPersisted() {
        console.log('check if tweet already persisted ' + this.tweet_id);
        let pTweet = await db.any('select * from paladin.tweets where tweet_id = $1', this.tweet_id);
        if (await pTweet.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    // Get all tracked tweets
    static async getAllTweets() {
        return await db.any('select * from paladin.tweets');
    }

    // Remove all followed tweets
    static async removeAllTweets() {
        return await db.any('delete from paladin.tweets');
    }

}

module.exports = Tweet;