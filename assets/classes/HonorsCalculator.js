const HonorsUserTweet = require('./HonorsUserTweet');
const HonorsCampaign = require('./HonorsCampaign');
const HonorsUserCampaign = require('./HonorsUserCampaign');

/**
 * Class used to handle Honors calculation
 */
 class HonorsCalculator {

    // Get current user honors
    static async calculateHonors(_discord_id) {
        let honors = 0;
        // Honors linked to twitter actions
        let userTweets = await HonorsUserTweet.getProvidedUserTweets(_discord_id);
        for (let userTweet of userTweets) {
            if (userTweet.action == process.env.ACTION_LIKE) {
                honors += +process.env.HONORS_LIKE_PTS;
            } else if (userTweet.action == process.env.ACTION_RT) {
                honors += +process.env.HONORS_RT_PTS;
            } 
        }
        // Honors linked to honors campaigns
        let honorsCampaigns = await HonorsCampaign.getAllCampaigns();
        for (let honorsCampaign of honorsCampaigns) {
            let userHonorsCampaigns = await HonorsUserCampaign.getProvidedUserCampaigns(_discord_id, honorsCampaign.name);
            for (let i = 0; i < userHonorsCampaigns.length; i++) {
                honors += +honorsCampaign.honors;
            }
        }
        return honors;
    }

 }

 module.exports = HonorsCalculator;