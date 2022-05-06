require("dotenv").config();

const { Client, Intents } = require("discord.js");
const { TwitterApi } = require('twitter-api-v2');
const { ethers } = require("ethers");
const https = require('https');
const fs = require('fs');

const pgpInitOptions = {
    error(err, e) {
        if (e.cn) {
            console.log('Error during DB connection');
        }

        if (e.query) {
            res.json(error(err.message))
        }

        if (e.ctx) {
            res.json(error(err.message))
        }
    }
};
const pgp = require('pg-promise')(pgpInitOptions);
const db = pgp({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
});

const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER);
const contractLucha = new ethers.Contract(process.env.LUCHA_CONTRACT,  require('./assets/abi/lucha')['luchaABI'], provider);

const Tweet = require('./assets/Tweet')(db);
const LSCUserTweet = require('./assets/LSCUserTweet')(db);
const LSCUser = require('./assets/LSCUser')(db);
const Luchadores = require('./assets/Luchadores')(contractLucha, db);

const prefix = "!";   

const discordClient = new Client({ partials: ["CHANNEL"], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });
const twitterClient = new TwitterApi(process.env.TWITTER_BREARER_TOKEN);

discordClient.on('ready', async () => {
    console.log(`Logged in as ${discordClient.user.tag}!`);
});


discordClient.on("messageCreate", async function(message) { 
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    if (command === "refresh_twitter") {
        if (!isWhiteListed(message.author.id)) return;
        await refreshTwitter();
        message.reply('Twitter refreshed. Coca updated')
    }

    if (command === "add_tweet") {
        if (!isWhiteListed(message.author.id)) return;
        if (args.length > 0) {
            await addTweets(args);
        }
        message.reply('Tweets ' + args + ' added/updated');
    }

    if (command === "add_user") {
        if (args.length > 0) {
            message.reply(await addUser(args, message));
        }
    }

    if (command === "powa") {
        if (message.guild === null) return;
        message.reply(await powa(message));
    }

    if (command == "coca_total") {
        if (!isWhiteListed(message.author.id)) return;
        let users = await LSCUser.getAllUsers();
        let response = '';
        let cocaUserArray = []
        for (let user of users) {
            cocaUserArray.push({discordUser: user.discord_id, coca: await user.getCoca()});
        }
        cocaUserArray.sort((a, b) => b.coca - a.coca);
        for (let cocaUser of cocaUserArray) {
            response += `<@${cocaUser.discordUser}>` + ' = ' + cocaUser.coca + ' :leaves:\n';
        }
        message.reply(response);
    }

    if (command == "coca") {
        let user = await LSCUser.getUserByID(message.author.id);
        message.reply(`<@${user.discord_id}>` + ' = ' + await user.getCoca() + ' :leaves:\n');
    }
}); 

function isWhiteListed(id) {
    for (let idOk of process.env.WHITELIST.split(',')) {
        if (id == idOk) {
            return true;
        }
    }
    return false;
}


discordClient.login(process.env.DISCORD_TOKEN);