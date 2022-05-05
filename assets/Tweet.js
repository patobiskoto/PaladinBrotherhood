let db;

module.exports = (_db) => {
    db = _db;
    return Tweet;
}

class Tweet {

    constructor(_author, _tweet) {
        this.author_id = _author.data.id,
        this.author_name = _author.data.name,
        this.author_username = _author.data.username,
        this.tweet_id = _tweet.data.id,
        this.tweet_created_at = _tweet.data.created_at,
        this.tweet_text = _tweet.data.text
    }

    async persist() {
        if (await this.isAlreadyPersisted()) {
            await this.update();
        } else {
            await this.insert();
        }
    }

    async insert() {
        console.log('insert tweet ' + this.tweet_id);
        db.any(
            'insert into public.tweets(author_id, author_name, author_username, tweet_created_at, tweet_text, tweet_id) values($1, $2, $3, $4, $5, $6)',
                [this.author_id, this.author_name, this.author_username, this.tweet_created_at, this.tweet_text, this.tweet_id])
            .then((result) => {
                console.log(this.tweet_id + " inserted !");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async update() {
        console.log('update tweet ' + this.tweet_id);
        db.any(
            'update public.tweets set author_id = $1, author_name = $2, author_username = $3, tweet_created_at = $4, tweet_text = $5 where tweet_id = $6',
                [this.author_id, this.author_name, this.author_username, this.tweet_created_at, this.tweet_text, this.tweet_id])
            .then((result) => {
                console.log(this.tweet_id + " updated !");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async isAlreadyPersisted() {
        console.log('check if tweet already persisted ' + this.tweet_id);
        let pTweet = await db.any('select * from public.tweets where tweet_id = $1', this.tweet_id);
        if (await pTweet.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    static async getAllTweets() {
        return await db.any('select * from public.tweets');
    }

}