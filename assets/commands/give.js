const { SlashCommandBuilder } = require('@discordjs/builders');
const UsersHonorsAdmin = require('../classes/UsersHonorsAdmin');
const HonorsUser = require('../classes/HonorsUser');

/*
    Command /give [user] [honors]
    Used to add new Honors to selected  Honors user
*/
module.exports = {

	data: new SlashCommandBuilder()

		.setName('give')
		.setDescription('Add Honors for provided Honors User')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The Honors user')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('honors')
                .setDescription('Honors amount')
                .setRequired(true)
        ),
    
    async execute(interaction) {
        let user = interaction.options.getUser('user');
        let honors = interaction.options.getInteger('honors');
        let discordUserId = user.id;
        let discordUserName = user.username + '#' + user.discriminator;

        let honorsUser = await HonorsUser.getUserByID(user.id);
        if (honorsUser == undefined) {
            await interaction.reply({ content: 'Selected user is not a Honors Member', ephemeral: true });
            return;
        }

        let usersHonorsAdmin = new UsersHonorsAdmin(
            discordUserName,
            discordUserId,
            new Date().toISOString().split('T')[0],
            honors
        )

        await usersHonorsAdmin.persist();

        await interaction.reply(
            { 
                content: `${honors} :shield: added for user ${user.username}`,
                ephemeral: true 
            }
        );
    }
};