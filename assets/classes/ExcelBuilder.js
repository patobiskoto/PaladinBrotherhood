const { MessageAttachment } = require('discord.js');
const fs = require('fs')
const ExcelJS = require('exceljs');
const HonorsUser = require('../classes/HonorsUser');
const Tweet = require('../classes/Tweet');

/**
 * Class used to handle Excel reporting
 */
class ExcelBuilder {

    // Constructor
    // Takes _report parameter. Possible values are 'honors' or tweet
    constructor(_report) {
        this.report = _report;
        this.filePath = './tmp/Export_' + _report + '_' + new Date().toISOString().split('T')[0] + '.xlsx'
        this.workbook = new ExcelJS.Workbook();
    }

    // Create MessageAttachment with asked excel file
    async export() {
        this.workbook.creator = 'Paladin';
        this.workbook.lastModifiedBy = 'Paladin';
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
        if (this.report == 'honors') {
            return [
                { header: 'Discord ID', key: 'discord_id', width: 20 },
                { header: 'Discord username', key: 'discord_username', width: 30 },
                { header: 'Twitter username', key: 'twitter_username', width: 30 },
                { header: 'Wallet', key: 'wallet', width: 50 },
                { header: 'Registration date', key: 'registration_date', width: 15 },
                { header: 'Honors', key: 'honors', width: 10, autoFmax: 'F1'},
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
        if (this.report == 'honors') {
            let users = await HonorsUser.getAllUsers();
            for (let user of users) {
                rows.push([
                    user.discord_id,
                    user.discord_username,
                    user.twitter_username,
                    user.wallet,
                    user.registration_date,
                    await user.getHonors()
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
            console.log(error);
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