let db;

module.exports = (_db) => {
    db = _db;
    return LSCUsersTweets;
}

class LSCUsersTweets {

    constructor(_tweet_id, _discord_id, _action) {
        this.tweet_id = _tweet_id;
        this.discord_id = _discord_id;
        this.action = _action;
    }

    async persist() {
        if (await this.isAlreadyPersisted()) {
            return;
        } else {
            await this.insert();
        }
    }

    async isAlreadyPersisted() {
        console.log('check if users_tweets already persisted ' + this.discord_id);
        let pUsersTweets = await this.getUserTweet(this.discord_id, this.tweet_id, this.action);
        if (await pUsersTweets.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    async getUserTweet(_discord_id = this.discord_id, _tweet_id = this.tweet_id, _action = this.action) {
        return await db.any('select * from public.users_tweets where discord_id = $1 and tweet_id = $2 and action = $3', [_discord_id, _tweet_id, _action]);
    }

    async insert() {
        console.log('insert users_tweets ' + this.discord_id);
        db.any(
            'insert into public.users_tweets(discord_id, tweet_id, action) values($1, $2, $3)',
                [this.discord_id, this.tweet_id, this.action])
            .then((result) => {
                console.log(this.discord_id + " inserted !");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static async getUserTweet(_discord_id, _tweet_id, _action) {
        return await db.any('select * from public.users_tweets where discord_id = $1 and tweet_id = $2 and action = $3', [_discord_id, _tweet_id, _action]);
    }

    static async getProvidedUserTweets(_discord_id) {
        let usersTweets = [];
        let pUsersTweets = await db.any('select * from public.users_tweets where discord_id = $1', _discord_id);
        for (let pUserTweet of pUsersTweets) {
            let userTweet = new LSCUsersTweets(
                pUserTweet.tweet_id,
                pUserTweet.discord_id,
                pUserTweet.action
            );
            usersTweets.push(userTweet);
        }
        return usersTweets;
    }

}