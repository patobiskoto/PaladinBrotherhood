const fs = require("fs");
const { db } = require('../db/db');
const LSCUserTweet = require('./LSCUserTweet');
const csvParser = require("csv-parser");

/*
    LSCUser class. 
    Reprensents a persisted Luchadores Social Club user
*/
class LSCUser {

    // Constructor
    constructor(_wallet, _twitter_username, _twitter_id, _discord_username, _discord_id, _registration_date) {
        this.wallet = _wallet;
        this.twitter_username = _twitter_username;
        this.twitter_id = _twitter_id;
        this.discord_username = _discord_username;
        this.discord_id = _discord_id;
        this.registration_date = _registration_date;
    }

    // Persist if needed, else update
    async persist() {
        if (await this.isAlreadyPersisted()) {
            await this.update();
        } else {
            await this.insert();
        }
    }

    // Check if current LSCUser is already persisted
    async isAlreadyPersisted() {
        console.log('check if user already persisted ' + this.discord_username);
        let pUser = await LSCUser.getUserByID(this.discord_id);
        if (pUser != undefined) {
            return true;
        } else {
            return false;
        }
    }

    // Instert new LSCUser
    async insert() {
        console.log('insert user ' + this.discord_username);
        db.any(
            'insert into public.users(wallet, twitter_username, twitter_id, discord_username, discord_id, registration_date) values($1, $2, $3, $4, $5, $6)',
                [this.wallet, this.twitter_username, this.twitter_id, this.discord_username, this.discord_id, this.registration_date])
            .then((result) => {
                console.log(this.discord_username + " inserted !");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Update current LSCUser
    async update() {
        console.log('update user ' + this.discord_username);
        db.any(
            'update public.users set wallet = $1, twitter_username = $2, discord_username = $3, registration_date = $4 where discord_id = $5',
                [this.wallet, this.twitter_username, this.discord_username, this.registration_date, this.discord_id])
            .then((result) => {
                console.log(this.discord_username + " updated !");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Get current LSCUser coca
    async getCoca() {
        let coca = 0;
        let userTweets = await LSCUserTweet.getProvidedUserTweets(this.discord_id);
        for (let userTweet of userTweets) {
            if (userTweet.action == process.env.ACTION_LIKE) {
                coca += +process.env.COCA_LIKE_PTS;
            } else if (userTweet.action == process.env.ACTION_RT) {
                coca += +process.env.COCA_RT_PTS;
            } else if (userTweet.action = process.env.ACTION_MEME) {
                coca += +process.env.COCA_MEME_PTS;
            } else if (userTweet.action = process.env.ACTION_FANART) {
                coca += +process.env.COCA_FANART_PTS;
            } else if (userTweet.action = process.env.ACTION_ZAPPER) {
                coca += +process.env.COCA_ZAPPER_PTS;
            }
        }
        return coca;
    }

    // Find user by ID
    static async getUserByID(_discord_id) {
        console.log('search user ' + _discord_id);
        let pUser = await db.any('select * from public.users where discord_id = $1', _discord_id);
        let lscUser;
        if (pUser.length > 0) {
            let lscUser =  new LSCUser(
                await pUser[0].wallet,
                await pUser[0].twitter_username,
                await pUser[0].twitter_id,
                await pUser[0].discord_username,
                await pUser[0].discord_id,
                await pUser[0].registration_date,
            );
            return lscUser;
        } else {
            return lscUser;
        }
        
    }

    // Handle premint CSV file. NOT USED
    static async handleCSV(_file) {
        if (_file == undefined) {
            console.log('CSV file undefined');
            return;
        }

        let csvData = [];

        fs.createReadStream(_file)
            .pipe(csvParser({}))
            .on("data", (data) => {
                csvData.push(data);
            })
            .on("error", (error) => {
                console.log(error);
            })
            .on("end", () => {
                for (let csvUser of csvData) {
                    let user = new LSCUser(
                        csvUser.wallet_address, 
                        csvUser['twitter username'], 
                        csvUser['twitter id'],
                        csvUser['discord username'],
                        csvUser['discord id'],
                        csvUser.date);
                    user.persist();
                }
                fs.unlinkSync(_file);
            });
    }

    // Find all LSCUsers
    static async getAllUsers() {
        let dbUsers = await db.any('select * from public.users');
        let lscUsers = [];
        for (let user of dbUsers) {
            let lscUser = new LSCUser(
                user.wallet, 
                user.twitter_username, 
                user.twitter_id,
                user.discord_username,
                user.discord_id,
                user.registration_date);
            lscUsers.push(lscUser);
        }
        return lscUsers;
    }

    static async getValidLSCUser(users, LSCUsers) {
        let validLSCUsers = [];
        for await (let user of users) {
            for (let LSCUser of LSCUsers) {
                if (LSCUser.twitter_id == user.id) {
                    validLSCUsers.push(LSCUser);
                }
            }
        }
        return validLSCUsers;
    }
}

module.exports = LSCUser;