-- Table: paladin.users_tweets

-- DROP TABLE IF EXISTS paladin.users_tweets;

CREATE TABLE IF NOT EXISTS paladin.users_tweets
(
    tweet_id text COLLATE pg_catalog."default" NOT NULL,
    discord_id text COLLATE pg_catalog."default" NOT NULL,
    action text COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS paladin.users_tweets
    OWNER to paladin;