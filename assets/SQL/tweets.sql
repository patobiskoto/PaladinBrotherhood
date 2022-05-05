-- Table: public.tweets

-- DROP TABLE IF EXISTS public.tweets;

CREATE TABLE IF NOT EXISTS public.tweets
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

ALTER TABLE IF EXISTS public.tweets
    OWNER to luchadores;