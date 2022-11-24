const { db } = require('../db/db');

/*
    HonorsCampaign class.
    Used to register new Honors campaigns (Zapper, meme, fan art, ...)
 */
class HonorsCampaign {

    // Constructor
    constructor(_discord_username, _discord_id, _creation_date, _name, _description, _honors, _is_running) {
        this.discord_username = _discord_username;
        this.discord_id = _discord_id;
        this.creation_date = _creation_date;
        this.name = _name;
        this.description = _description;
        this.honors = _honors;
        this.is_running = _is_running;
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
            'insert into paladin.honors_campaign(discord_username, discord_id, creation_date, name, description, honors, is_running) values($1, $2, $3, $4, $5, $6, $7)',
                [this.discord_username, this.discord_id, this.creation_date, this.name, this.description, this.honors, this.is_running])
            .then((result) => {
                console.log(this.name + " inserted !");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Update the campaign. Only description, honors and is_running can be updated
    async update() {
        console.log('update campaign ' + this.name);
        db.any(
            'update paladin.honors_campaign set description = $1, honors = $2, is_running = $3 where name = $4',
                [this.description, this.honors, this.is_running, this.name])
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
        let pTweet = await db.any('select * from paladin.honors_campaign where name = $1', this.name);
        if (await pTweet.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    // Get all tracked campaigns
    static async getAllCampaigns() {
        let dbCampaigns = await db.any('select * from paladin.honors_campaign');
        let campaigns = [];
        for (let dbCampaign of dbCampaigns) {
            let campaign = new HonorsCampaign(
                dbCampaign.discord_username,
                dbCampaign.discord_id,
                dbCampaign.creation_date,
                dbCampaign.name,
                dbCampaign.description,
                dbCampaign.honors,
                dbCampaign.is_running
            );
            campaigns.push(campaign);
        }
        return campaigns;
    }

    // Find campaign by name
    static async getCampaignByName(_name) {
        console.log('search campaign ' + _name);
        let pCampaign = await db.any('select * from paladin.honors_campaign where name = $1', _name);
        let campaign;
        if (pCampaign.length > 0) {
            let campaign =  new HonorsCampaign(
                await pCampaign[0].discord_username,
                await pCampaign[0].discord_id,
                await pCampaign[0].creation_date,
                await pCampaign[0].name,
                await pCampaign[0].description,
                await pCampaign[0].honors,
                await pCampaign[0].is_running
            );
            return campaign;
        } else {
            return campaign;
        }
        
    }

    static async getCmdOptions() {
        let choices = [];
        let pCampaigns = await HonorsCampaign.getAllCampaigns();
        for (let campaign of pCampaigns) {
            choices.push([campaign.name, campaign.name]);
        }
        return choices;
    }

}

module.exports = HonorsCampaign;