-- Table: paladin.users_honors_admin

-- DROP TABLE IF EXISTS paladin.users_honors_admin;

CREATE TABLE IF NOT EXISTS paladin.users_honors_admin
(
    discord_username text COLLATE pg_catalog."default" NOT NULL,
    discord_id text COLLATE pg_catalog."default" NOT NULL,
    creation_date text COLLATE pg_catalog."default" NOT NULL,
    honors bigint NOT NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS paladin.users_honors_admin
    OWNER to paladin;