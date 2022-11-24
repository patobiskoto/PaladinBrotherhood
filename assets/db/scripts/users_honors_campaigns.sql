-- Table: paladin.users_honors_campaigns

-- DROP TABLE IF EXISTS paladin.users_honors_campaigns;

CREATE TABLE IF NOT EXISTS paladin.users_honors_campaigns
(
    creator_discord_id text COLLATE pg_catalog."default" NOT NULL,
    creator_discord_username text COLLATE pg_catalog."default" NOT NULL,
    creation_date text COLLATE pg_catalog."default" NOT NULL,
    user_discord_id text COLLATE pg_catalog."default" NOT NULL,
    user_discord_username text COLLATE pg_catalog."default" NOT NULL,
    campaign text COLLATE pg_catalog."default" NOT NULL,
    comment text COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS paladin.users_honors_campaigns
    OWNER to paladin;