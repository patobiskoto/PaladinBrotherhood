const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const TournamentRegistration = require('../classes/TournamentRegistration');

/*
	Command /tournament_data_get [user]
	Returns data for the selected user
*/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('tournament_data_get')
		.setDescription('Get data for the selected user, wallet or nft id')
		.addUserOption(option => 
            option.setName('user')
                .setDescription('The user for whom you want the data')
                .setRequired(false)
        )
		.addStringOption(option => 
            option.setName('wallet')
                .setDescription('The wallet for whom you want the data')
                .setRequired(false)
        )
		.addStringOption(option => 
            option.setName('nft_id')
                .setDescription('The NFD ID for whom you want the data')
                .setRequired(false)
        ),
		//.setDefaultPermission(false),
	async execute(interaction) {
        let user = interaction.options.getUser('user');
		let wallet = interaction.options.getString('wallet');
		let nftId = interaction.options.getString('nft_id');

		let pRegistration;
		if (user != undefined) {
			pRegistration = await TournamentRegistration.getProvidedUserTournamentRegistration('discord_id', user.id);
		} else if (wallet != undefined) {
			if (!wallet.startsWith('0x')) {
				await interaction.reply({ content: 'Wallet must be a 0x. ENS are not supported yet', ephemeral: true });
				return;
			}
			pRegistration = await TournamentRegistration.getProvidedUserTournamentRegistration('wallet', wallet);
		} else if (nftId != undefined) {
			pRegistration = await TournamentRegistration.getProvidedUserTournamentRegistration('nft_id', nftId.toString());
		} else {
			await interaction.reply({ content: 'You have to provide at least one parameter', ephemeral: true });
			return;
		}

		if (pRegistration != undefined) {
			await interaction.reply({ embeds: [await pRegistration.prepareResponse()], ephemeral: true });
		} else {
			await interaction.reply({ content: 'Registration not found !', ephemeral: true });
			return;
		}
	}
};
