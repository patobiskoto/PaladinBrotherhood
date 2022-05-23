const { MessageAttachment } = require('discord.js');
const fs = require('fs')
const ExcelJS = require('exceljs');
const TournamentRegistration = require('../classes/TournamentRegistration');
const LSCUser = require('../classes/LSCUser');
const Tweet = require('../classes/Tweet');

/**
 * Class used to handle Excel reporting
 */
class ExcelBuilder {

    // Constructor
    // Takes _report parameter. Possible values are 'tournament', 'coca' or tweet
    constructor(_report) {
        this.report = _report;
        this.filePath = './tmp/Export_' + _report + '_' + new Date().toISOString().split('T')[0] + '.xlsx'
        this.workbook = new ExcelJS.Workbook();
    }

    // Create MessageAttachment with asked excel file
    async export() {
        this.workbook.creator = 'Luchadores.io';
        this.workbook.lastModifiedBy = 'Luchadores.io';
        this.workbook.created = new Date();
        this.workbook.modified = new Date();
        this.workbook.lastPrinted = new Date();
        this.workbook.properties.date1904 = true;

        let sheet = this.workbook.addWorksheet('Export', { properties: { tabColor: { argb:'743cef' } } });

        let header = this.getHeader();
        sheet.columns = header;
        sheet.autoFilter = 'A1:' + header[header.length - 1].autoFmax;
        sheet.addRows(await this.getRows());
        return await this.getAttachment();
    }

    // Get excel's sheet header
    getHeader() {
        if (this.report == 'tournament') {
            return [
                { header: 'Discord ID', key: 'discord_id', width: 20 },
                { header: 'Discord username', key: 'discord_username', width: 30 },
                { header: 'Wallet', key: 'wallet', width: 50 },
                { header: 'NFT ID', key: 'nft_id', width: 10 },
                { header: 'Strength', key: 'strength', width: 10 },
                { header: 'Defense', key: 'defense', width: 10 },
                { header: 'Skill', key: 'skill', width: 10 },
                { header: 'Speed', key: 'speed', width: 10 },
                { header: 'Skill 1', key: 'skill_1', width: 15 },
                { header: 'Skill 2', key: 'skill_2', width: 15 },
                { header: 'Skill_3', key: 'skill_3', width: 15 },
                { header: 'Passive skill', key: 'passive_skill', width: 15 },
                { header: 'Registration date', key: 'registration_date', width: 15, autoFmax: 'M1' },
            ];
        } else if (this.report == 'coca') {
            return [
                { header: 'Discord ID', key: 'discord_id', width: 20 },
                { header: 'Discord username', key: 'discord_username', width: 30 },
                { header: 'Twitter username', key: 'twitter_username', width: 30 },
                { header: 'Wallet', key: 'wallet', width: 50 },
                { header: 'Registration date', key: 'registration_date', width: 15 },
                { header: 'Coca', key: 'coca', width: 10, autoFmax: 'F1'},
            ];
        } else if (this.report == 'tweet') {
            return [
                { header: 'Author name', key: 'author_name', width: 30 },
                { header: 'Author username', key: 'author_username', width: 30 },
                { header: 'Twitter created at', key: 'tweet_created_at', width: 30 },
                { header: 'URL', key: 'url', width: 30 },
                { header: 'Tweet text', key: 'tweet_text', width: 200 },
            ];
        }
    }

    // Get excel's sheet rows
    async getRows() {
        let rows = [];
        if (this.report == 'tournament') {
            let registrations = await TournamentRegistration.getAllRegistrations();
            for (let registration of registrations) {
                rows.push([
                    registration.discord_id,
                    registration.discord_username,
                    registration.wallet,
                    Number(registration.nft_id),
                    Number(registration.strength),
                    Number(registration.defense),
                    Number(registration.skill),
                    Number(registration.speed),
                    registration.skill_1,
                    registration.skill_2,
                    registration.skill_3,
                    registration.passive_skill,
                    registration.registration_date
                ]);
            }
        } else if (this.report == 'coca') {
            let users = await LSCUser.getAllUsers();
            for (let user of users) {
                rows.push([
                    user.discord_id,
                    user.discord_username,
                    user.twitter_username,
                    user.wallet,
                    user.registration_date,
                    await user.getCoca()
                ]);
            }
        } else if (this.report == 'tweet') {
            let tweets = await Tweet.getAllTweets();
            for (let tweet of tweets) {
                rows.push([
                    tweet.author_name,
                    tweet.author_username,
                    tweet.tweet_created_at,
                    {
                        text: `https://twitter.com/${tweet.author_username}/status/${tweet.tweet_id}`,
                        hyperlink: `https://twitter.com/${tweet.author_username}/status/${tweet.tweet_id}`,
                        tooltip: `https://twitter.com/${tweet.author_username}/status/${tweet.tweet_id}`
                    },
                    tweet.tweet_text
                ]);
            }
        }
        return rows;
    }

    // Create the new MessageAttachment
    async getAttachment() {
        try {
            if (!fs.existsSync('./tmp')) {
                fs.mkdirSync('./tmp');
            }
            await this.workbook.xlsx.writeFile(this.filePath);
            return new MessageAttachment(this.filePath);
        } catch (error) {
            throw new Error('Error during export creation !');
        }
    }

    // Delete Excel file after response
    async clean() {
        if (fs.existsSync(this.filePath)) {
            fs.unlinkSync(this.filePath);
        }
    }

}

module.exports = ExcelBuilder;