-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    wallet text COLLATE pg_catalog."default" NOT NULL,
    twitter_username text COLLATE pg_catalog."default" NOT NULL,
    twitter_id text COLLATE pg_catalog."default" NOT NULL,
    discord_username text COLLATE pg_catalog."default" NOT NULL,
    discord_id text COLLATE pg_catalog."default" NOT NULL,
    registration_date date NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (discord_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to luchadores;