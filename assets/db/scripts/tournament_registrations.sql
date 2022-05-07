-- Table: public.tournament_registrations

-- DROP TABLE IF EXISTS public.tournament_registrations;

CREATE TABLE IF NOT EXISTS public.tournament_registrations
(
    discord_id text COLLATE pg_catalog."default" NOT NULL,
    discord_username text COLLATE pg_catalog."default" NOT NULL,
    wallet text COLLATE pg_catalog."default" NOT NULL,
    nft_id text COLLATE pg_catalog."default" NOT NULL,
    strength text COLLATE pg_catalog."default" NOT NULL,
    defense text COLLATE pg_catalog."default" NOT NULL,
    skill text COLLATE pg_catalog."default" NOT NULL,
    speed text COLLATE pg_catalog."default" NOT NULL,
    skill_1 text COLLATE pg_catalog."default" NOT NULL,
    skill_2 text COLLATE pg_catalog."default" NOT NULL,
    skill_3 text COLLATE pg_catalog."default" NOT NULL,
    passive_skill text COLLATE pg_catalog."default" NOT NULL,
    registration_date date NOT NULL,
    CONSTRAINT tournament_registrations_pkey PRIMARY KEY (discord_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.tournament_registrations
    OWNER to luchadores;