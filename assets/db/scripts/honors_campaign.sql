-- Table: paladin.honors_campaign

-- DROP TABLE IF EXISTS paladin.honors_campaign;

CREATE TABLE IF NOT EXISTS paladin.honors_campaign
(
    discord_username text COLLATE pg_catalog."default" NOT NULL,
    discord_id text COLLATE pg_catalog."default" NOT NULL,
    creation_date text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    honors bigint NOT NULL,
    is_running boolean NOT NULL,
    CONSTRAINT honors_campaign_pkey PRIMARY KEY (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS paladin.honors_campaign
    OWNER to paladin;