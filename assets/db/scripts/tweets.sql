-- Table: paladin.tweets

-- DROP TABLE IF EXISTS paladin.tweets;

CREATE TABLE IF NOT EXISTS paladin.tweets
(
    author_name text COLLATE pg_catalog."default" NOT NULL,
    author_username text COLLATE pg_catalog."default" NOT NULL,
    tweet_created_at date NOT NULL,
    tweet_text text COLLATE pg_catalog."default" NOT NULL,
    author_id text COLLATE pg_catalog."default" NOT NULL,
    tweet_id text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT tweets_pkey PRIMARY KEY (tweet_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS paladin.tweets
    OWNER to paladin;