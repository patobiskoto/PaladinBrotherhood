const LSCUserTweet = require('./LSCUserTweet');
const CocaCampaign = require('./CocaCampaign');
const LSCUserCocaCampaign = require('./LSCUserCocaCampaign');

/**
 * Class used to handle Coca calculation
 */
 class CocaCalculator {

    // Get current user coca
    static async calculateCoca(_discord_id) {
        let coca = 0;
        // Coca linked to twitter actions
        let userTweets = await LSCUserTweet.getProvidedUserTweets(_discord_id);
        for (let userTweet of userTweets) {
            if (userTweet.action == process.env.ACTION_LIKE) {
                coca += +process.env.COCA_LIKE_PTS;
            } else if (userTweet.action == process.env.ACTION_RT) {
                coca += +process.env.COCA_RT_PTS;
            } 
        }
        // Coca linked to coca campaigns
        let cocaCampaigns = await CocaCampaign.getAllCampaigns();
        for (let cocaCampaign of cocaCampaigns) {
            let userCocaCampaigns = await LSCUserCocaCampaign.getProvidedUserCampaigns(_discord_id, cocaCampaign.name);
            for (let i = 0; i < userCocaCampaigns.length; i++) {
                coca += +cocaCampaign.coca;
            }
        }
        return coca;
    }

 }

 module.exports = CocaCalculator;