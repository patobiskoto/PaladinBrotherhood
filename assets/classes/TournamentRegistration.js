const { db } = require('../db/db');
const { MessageEmbed } = require('discord.js')

/*
    TournamentRegistration class
    User to persist a tournament registration
*/
class TournamentRegistration {

    // Constructor
    constructor(_discord_id, _discord_username, _wallet, _nft_id, _strength, _defense, _skill, _speed, _skill_1, _skill_2, _skill_3, _passive_skill, _registration_date) {
        this.discord_id = _discord_id;
        this.discord_username = _discord_username;
        this.wallet = _wallet;
        this.nft_id = _nft_id;
        this.strength = _strength;
        this.defense = _defense;
        this.skill = _skill;
        this.speed = _speed;
        this.skill_1 = _skill_1;
        this.skill_2 = _skill_2;
        this.skill_3 = _skill_3;
        this.passive_skill = _passive_skill;
        this.registration_date = _registration_date
    }

    // Persist if needed, else update
    async persist() {
        if (await this.isAlreadyPersisted()) {
            return;
        } else {
            await this.insert();
        }
    }

    // Check if TournamentRegistration is already persisted
    //TODO
    async isAlreadyPersisted() {
        console.log('check if TournamentRegistration already persisted ' + this.discord_id);
        let tournamentRegistration = await TournamentRegistration.getProvidedUserTournamentRegistration('discord_id', this.discord_id);
        if (tournamentRegistration != undefined) {
            return true;
        } else {
            return false;
        }
    }

    // Create the new TournamentRegistration
    async insert() {
        console.log('insert tournament_registrations ' + this.wallet);
        db.any(
            'insert into public.tournament_registrations(discord_id, discord_username, wallet, nft_id, strength, defense, skill, speed, skill_1, skill_2, skill_3, passive_skill, registration_date) '
                + 'values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
                [this.discord_id, this.discord_username, this.wallet, this.nft_id, this.strength, this.defense, this.skill, this.speed, this.skill_1, this.skill_2, this.skill_3, this.passive_skill, this.registration_date])
            .then((result) => {
                console.log(this.discord_id + " inserted !");
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Find LSCUSerTweet for the provided user discord id
    static async getProvidedUserTournamentRegistration(_columnName, _value) {
        let pTournamentRegistration = await db.any('select * from public.tournament_registrations where ' + _columnName + ' = $1', _value);
        let userTournamentRegistration;
        if (pTournamentRegistration.length > 0) {
            userTournamentRegistration = new TournamentRegistration(
                pTournamentRegistration[0].discord_id,
                pTournamentRegistration[0].discord_username,
                pTournamentRegistration[0].wallet,
                pTournamentRegistration[0].nft_id,
                pTournamentRegistration[0].strength,
                pTournamentRegistration[0].defense,
                pTournamentRegistration[0].skill,
                pTournamentRegistration[0].speed,
                pTournamentRegistration[0].skill_1,
                pTournamentRegistration[0].skill_2,
                pTournamentRegistration[0].skill_3,
                pTournamentRegistration[0].passive_skill,
                pTournamentRegistration[0].registration_date
            )
        }
        return userTournamentRegistration;
    }

    // Returns the number of entries
    static async getNumberOfRegistered() {
        let data = await db.any('select count(*) from public.tournament_registrations');
        return data[0].count;
    }

    // Returns all registrations done
    static async getAllRegistrations() {
        let data = await db.any('select * from public.tournament_registrations')
        return data;
    }

    async prepareResponse() {
        return new MessageEmbed()
            .setTitle(this.discord_username)
            .setColor(0x743cef)
            .setThumbnail(`https://luchadores-io.s3.us-east-2.amazonaws.com/img/${this.nft_id}.png`)
            .addFields(
                { name: 'Wallet', value: this.wallet, inline: false },
                { name: '#ID', value: this.nft_id, inline: false },
                { name: 'Registration date', value: new Date(this.registration_date).toISOString().split('T')[0], inline: false },
                { name: 'Strength', value: this.strength, inline: false },
                { name: 'Defense', value: this.defense, inline: false },
                { name: 'Skill', value: this.skill, inline: false },
                { name: 'Speed', value: this.speed, inline: false },
                { name: '1st Skill', value: this.skill_1, inline: false },
                { name: '2nd Skill', value: this.skill_2, inline: false },
                { name: '3rd Skill', value: this.skill_3, inline: false },
                { name: 'Passive Skill', value: this.passive_skill, inline: false }
            );
    }

}

module.exports = TournamentRegistration;