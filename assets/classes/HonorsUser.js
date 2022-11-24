const fs = require("fs");
const { db } = require('../db/db');
const HonorsCalculator = require('./HonorsCalculator');
const csvParser = require("csv-parser");

/*
    HonorsUser class. 
    Reprensents a persisted Honors user
*/
class HonorsUser {

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

    // Check if current HonorsUser is already persisted
    async isAlreadyPersisted() {
        console.log('check if user already persisted ' + this.discord_username);
        let pUser = await HonorsUser.getUserByID(this.discord_id);
        if (pUser != undefined) {
            return true;
        } else {
            return false;
        }
    }

    // Instert new HonorsUser
    async insert() {
        console.log('insert user ' + this.discord_username);
        db.any(
            'insert into paladin.users(wallet, twitter_username, twitter_id, discord_username, discord_id, registration_date) values($1, $2, $3, $4, $5, $6)',
                [this.wallet, this.twitter_username, this.twitter_id, this.discord_username, this.discord_id, this.registration_date])
            .then((result) => {
                console.log(this.discord_username + " inserted !");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Update current HonorsUser
    async update() {
        console.log('update user ' + this.discord_username);
        db.any(
            'update paladin.users set wallet = $1, twitter_username = $2, discord_username = $3, registration_date = $4 where discord_id = $5',
                [this.wallet, this.twitter_username, this.discord_username, this.registration_date, this.discord_id])
            .then((result) => {
                console.log(this.discord_username + " updated !");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Get current HonorsUser honors
    async getHonors() {
        return await HonorsCalculator.calculateHonors(this.discord_id);
    }

    // Find user by ID
    static async getUserByID(_discord_id) {
        console.log('search user ' + _discord_id);
        let pUser = await db.any('select * from paladin.users where discord_id = $1', _discord_id);
        let honorsUser;
        if (pUser.length > 0) {
            let honorsUser =  new HonorsUser(
                await pUser[0].wallet,
                await pUser[0].twitter_username,
                await pUser[0].twitter_id,
                await pUser[0].discord_username,
                await pUser[0].discord_id,
                await pUser[0].registration_date,
            );
            return honorsUser;
        } else {
            return honorsUser;
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
                    let user = new HonorsUser(
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

    // Find all HonorsUser
    static async getAllUsers() {
        let dbUsers = await db.any('select * from paladin.users');
        let honorsUsers = [];
        for (let user of dbUsers) {
            let lscUser = new HonorsUser(
                user.wallet, 
                user.twitter_username, 
                user.twitter_id,
                user.discord_username,
                user.discord_id,
                user.registration_date);
            honorsUsers.push(lscUser);
        }
        return honorsUsers;
    }

    static async getValidHonorsUser(users, HonorsUsers) {
        let validHonorsUsers = [];
        for await (let user of users) {
            for (let honorsUser of HonorsUsers) {
                if (honorsUser.twitter_id == user.id) {
                    validHonorsUsers.push(honorsUser);
                }
            }
        }
        return validHonorsUsers;
    }
}

module.exports = HonorsUser;