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
        message.reply(await powa(message));
    }

    if (command == "update_csv") {
        if (!isWhiteListed(message.author.id)) return;
        if (message.attachments.size == 1) {
           let entry = message.attachments.first();
           if (entry.contentType == 'text/csv; charset=utf-8') {
               console.log('update_csv');
               https.get(entry.url, (res) => {
                   let csvFile = fs.createWriteStream(entry.name);
                   res.pipe(csvFile);
                   csvFile.on('finish', () => {
                       csvFile.close();
                       console.log(entry.name + ' download completed');
                       LSCUser.handleCSV(entry.name);
                   });
               });
           }
        }
        message.reply('users updated');
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

async function addTweets(ids) {
    for (let id of ids) {
        let tweet = await twitterClient.v2.singleTweet(id, { 'tweet.fields': ['author_id', 'created_at'], 'user.fields': ['username'] });
        let author = await twitterClient.v2.user(tweet.data.author_id);
        let tweetm = new Tweet(author, tweet);
        tweetm.persist();
    }
}

async function addUser(args, message) {
    if (args.length > 3 || args.length < 2) {
        return 'wrong number of parameters. !add_user [wallet 0x] [twitter url] [discord id: optional]';
    }
    if (!args[0].startsWith('0x')) {
        return 'first paremeter must be your 0x';
    } 
    if (!args[1].startsWith('https://twitter.com/')) {
        return 'second paremeter must be your twitter profile url';
    }
    let userWallet = args[0];
    let discordUserId, discordUserName;
   
    if (args[2] != undefined) {
        discordUserId = args[2];
        let person = await discordClient.users.fetch(discordUserId);
        discordUserName = person.username + '#' + person.discriminator;
    } else {
        discordUserId = message.author.id;
        discordUserName = message.author.username + '#' + message.author.discriminator;
    }
    
    let twitterUser = await twitterClient.v2.userByUsername(args[1].replace('https://twitter.com/', ''));
    
    let persistedUser = await LSCUser.getUserByID(discordUserId);
    if (persistedUser != undefined) {
        return 'user ' + discordUserName + ' already registered';
    }

    let isOwner = await Luchadores.isOwnerOfALuchador(userWallet);
    if (!isOwner) {
        return 'you must have at least 1 luchador';
    }

    let user = new LSCUser(
        userWallet,
        twitterUser.data.username,
        twitterUser.data.id,
        discordUserName,
        discordUserId,
        new Date().toISOString().split('T')[0]
    );

    user.persist();

    return 'registration done! Welcome in the Luchadores Social Club <3';
}

async function powa(message) {
    let user = await LSCUser.getUserByID(message.author.id);
    if (user != null) {
        let role = await message.guild.roles.fetch(process.env.LSC_ROLE_ID);
        message.member.roles.add(role);
        return 'LSC role added !';
    }
}

async function refreshTwitter() {
    let allTweets = await Tweet.getAllTweets();
    let LSCUsers = await LSCUser.getAllUsers();
    
    let parsedTweets = [];

    for (let i = 0; i < allTweets.length; i++) {
        let twitterLikers = await twitterClient.v2.tweetLikedBy(allTweets[i].tweet_id, { asPaginator: true });
        let twitterRT = await twitterClient.v2.tweetRetweetedBy(allTweets[i].tweet_id, { asPaginator: true });
        parsedTweets.push({
            id: allTweets[i].tweet_id,
            likers: await getValidLSCUser(twitterLikers, LSCUsers),
            rt: await getValidLSCUser(twitterRT, LSCUsers)
        });        
    }
    
    for await (let parsedTweet of parsedTweets) {
        for (let liker of parsedTweet.likers) {
            let userTweet = await LSCUserTweet.getUserTweet(liker.discord_id, parsedTweet.id, process.env.ACTION_LIKE);
            if (userTweet == undefined || userTweet.length == 0) {
                let pUsersTweets = new LSCUserTweet(parsedTweet.id, liker.discord_id, process.env.ACTION_LIKE);
                pUsersTweets.insert();
            }
        }
        for (let rt of parsedTweet.rt) {
            let userTweet = await LSCUserTweet.getUserTweet(rt.discord_id, parsedTweet.id, process.env.ACTION_RT);
            if (userTweet == undefined || userTweet.length == 0) {
                let pUsersTweets = new LSCUserTweet(parsedTweet.id, rt.discord_id, process.env.ACTION_RT);
                pUsersTweets.insert();
            }
        }
    }
}

async function getValidLSCUser(users, LSCUsers) {
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

discordClient.login(process.env.DISCORD_TOKEN);