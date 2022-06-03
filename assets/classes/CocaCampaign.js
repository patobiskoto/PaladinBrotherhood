const { db } = require('../db/db');

/*
    CocaCampaign class.
    Used to register new Coca campaigns (Zapper, meme, fan art, ...)
 */
class CocaCampaign {

    // Constructor
    constructor(_discord_username, _discord_id, _creation_date, _name, _description, _coca) {
        this.discord_username = _discord_username;
        this.discord_id = _discord_id;
        this.creation_date = _creation_date;
        this.name = _name;
        this.description = _description;
        this.coca = _coca;
    }

    // Persist if needed, else update
    async persist() {
        if (await this.isAlreadyPersisted()) {
            await this.update();
        } else {
            await this.insert();
        }
    }

    // Create the new campaign
    async insert() {
        console.log('insert campaign ' + this.name);
        db.any(
            'insert into public.coca_campaign(discord_username, discord_id, creation_date, name, description, coca) values($1, $2, $3, $4, $5, $6)',
                [this.discord_username, this.discord_id, this.creation_date, this.name, this.description, this.coca])
            .then((result) => {
                console.log(this.name + " inserted !");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Update the campaign. Only description and coca can be updated
    async update() {
        console.log('update campaign ' + this.name);
        db.any(
            'update public.coca_campaign set description = $1, coca = $2 where name = $3',
                [this.description, this.coca, this.name])
            .then((result) => {
                console.log(this.name + " updated !");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Check if current campaign is already persisted
    async isAlreadyPersisted() {
        console.log('check if campaign already persisted ' + this.name);
        let pTweet = await db.any('select * from public.coca_campaign where name = $1', this.name);
        if (await pTweet.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    // Get all tracked campaigns
    static async getAllCampaigns() {
        let dbCampaigns = await db.any('select * from public.coca_campaign');
        let campaigns = [];
        for (let dbCampaign of dbCampaigns) {
            let campaign = new CocaCampaign(
                dbCampaign.discord_username,
                dbCampaign.discord_id,
                dbCampaign.creation_date,
                dbCampaign.name,
                dbCampaign.description,
                dbCampaign.coca
            );
            campaigns.push(campaign);
        }
        return campaigns;
    }

    // Find campaign by name
    static async getCampaignByName(_name) {
        console.log('search campaign ' + _name);
        let pCampaign = await db.any('select * from public.coca_campaign where name = $1', _name);
        let campaign;
        if (pCampaign.length > 0) {
            let campaign =  new CocaCampaign(
                await pCampaign[0].discord_username,
                await pCampaign[0].discord_id,
                await pCampaign[0].creation_date,
                await pCampaign[0].name,
                await pCampaign[0].description,
                await pCampaign[0].coca,
            );
            return campaign;
        } else {
            return campaign;
        }
        
    }

    static async getCmdOptions() {
        let choices = [];
        let pCampaigns = await CocaCampaign.getAllCampaigns();
        for (let campaign of pCampaigns) {
            choices.push([campaign.name, campaign.name]);
        }
        return choices;
    }

}

module.exports = CocaCampaign;