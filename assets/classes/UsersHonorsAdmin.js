const { db } = require('../db/db');

/*
    UsersHonorsAdmin class
    Used to grant honors to users
*/
class UsersHonorsAdmin {

    // Constructor
    constructor(_discord_username, _discord_id, _creation_date, _honors) {
        this.discord_username = _discord_username;
        this.discord_id = _discord_id;
        this.creation_date = _creation_date;
        this.honors = _honors;
    }

    // Persist
    async persist() {
        await this.insert();
    }

    // Find UsersHonorsAdmin corresponding to the user discord id
    async getUserHonorsAdmin(_discord_id = this.discord_id) {
        return await db.any('select * from paladin.users_honors_admin where discord_id = $1', [_discord_id]);
    }

    // Find UsersHonorsAdmin corresponding to the user discord id
    static async getUserHonorsAdmin(_discord_id) {
        return await db.any('select * from paladin.users_honors_admin where discord_id = $1', [_discord_id]);
    }

    // Create the new UsersHonorsAdmin
    async insert() {
        console.log('insert users_honors_admin ' + this.discord_username);
        db.any(
            'insert into paladin.users_honors_admin(discord_username, discord_id, creation_date, honors) values($1, $2, $3, $4)',
                [this.discord_username, this.discord_id, this.creation_date, this.honors])
            .then((result) => {
                console.log(this.discord_username + " inserted !");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Find UsersHonorsAdmin for the provided user discord id
    static async getProvidedUserHonorsAdmin(_discord_id) {
        let usersHonorsAdmin = [];
        let pUsersHonorsAdmins = await db.any('select * from paladin.users_honors_admin where discord_id = $1', _discord_id);
        for (let pUsersHonorsAdmin of pUsersHonorsAdmins) {
            let nUsersHonorsAdmin = new HonorsUsersTweets(
                pUsersHonorsAdmin.discord_username,
                pUsersHonorsAdmin.discord_id,
                pUsersHonorsAdmin.creation_date,
                pUsersHonorsAdmin.honors
            );
            usersHonorsAdmin.push(nUsersHonorsAdmin);
        }
        return usersHonorsAdmin;
    }

}

module.exports = UsersHonorsAdmin;