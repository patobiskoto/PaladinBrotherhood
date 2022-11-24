const { db } = require('../db/db');

/*
    HonorsUserCampaign class
    Honors campaigns logs, used to track events awards and in honors calculation
*/
class HonorsUserCampaign {

    // Constructor
    constructor(_creator_discord_id, _creator_discord_username, _creation_date, _user_discord_id, _user_discord_username, _campaign, _comment) {
        this.creator_discord_id = _creator_discord_id;
        this.creator_discord_username = _creator_discord_username;
        this.creation_date = _creation_date;
        this.user_discord_id = _user_discord_id;
        this.user_discord_username = _user_discord_username;
        this.campaign = _campaign;
        this.comment = _comment;
    }

    // Persist
    async persist() {
        await this.insert();
    }

    // Create the new HonorsUserCampaign
    async insert() {
        console.log('insert users_honors_campaigns ' + this.campaign + ' for user ' + this.user_discord_username);
        db.any(
            'insert into paladin.users_honors_campaigns(creator_discord_id, creator_discord_username, creation_date, user_discord_id, user_discord_username, campaign, comment) values($1, $2, $3, $4, $5, $6, $7)',
                [this.creator_discord_id, this.creator_discord_username, this.creation_date, this.user_discord_id, this.user_discord_username, this.campaign, this.comment])
            .then((result) => {
                console.log(this.campaign + " inserted !");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Find HonorsUserCampaign for the provided user discord id
    static async getProvidedUserCampaigns(_discord_id, _campaign) {
        let usersCampaigns = [];
        let pUsersCampaigns = await db.any('select * from paladin.users_honors_campaigns where user_discord_id = $1 and campaign = $2', [_discord_id, _campaign]);
        for (let pUserCampaign of pUsersCampaigns) {
            let userCampaign = new HonorsUserCampaign(
                pUserCampaign.creator_discord_id,
                pUserCampaign.creator_discord_username,
                pUserCampaign.creation_date,
                pUserCampaign.user_discord_id,
                pUserCampaign.user_discord_username,
                pUserCampaign.campaign,
                pUserCampaign.comment
            );
            usersCampaigns.push(userCampaign);
        }
        return usersCampaigns;
    }

}

module.exports = HonorsUserCampaign;