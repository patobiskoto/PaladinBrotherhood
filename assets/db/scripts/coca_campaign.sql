-- Table: public.coca_campaign

-- DROP TABLE IF EXISTS public.coca_campaign;

CREATE TABLE IF NOT EXISTS public.coca_campaign
(
    discord_username text COLLATE pg_catalog."default" NOT NULL,
    discord_id text COLLATE pg_catalog."default" NOT NULL,
    creation_date text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    coca bigint NOT NULL,
    CONSTRAINT coca_campaign_pkey PRIMARY KEY (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.coca_campaign
    OWNER to luchadores;