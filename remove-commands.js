const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

let params = process.argv.slice(2);

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

rest.get(Routes.applicationCommands(process.env.DISCORD_ID))
    .then(data => {
        for (let cmd of data) {
            if (params.indexOf(cmd.name) >= 0) {
                rest.delete(Routes.applicationCommand(process.env.DISCORD_ID, cmd.id))
                    .then(() => console.log(`${cmd.name} successfully unregistered !`))
                    .catch(console.error);
            }
        }
    })
    .catch(console.error);