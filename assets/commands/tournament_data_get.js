const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const TournamentRegistration = require('../classes/TournamentRegistration');
const Luchadores = require('../classes/Luchadores');

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
        )
		.setDefaultPermission(false),
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

		await interaction.reply({ embeds: [await prepareResponse(pRegistration)], ephemeral: true })
	}
};

async function prepareResponse(registration) {
	return new MessageEmbed()
		.setTitle(registration.discord_username)
		.setColor(0x743cef)
		.setThumbnail(`https://luchadores-io.s3.us-east-2.amazonaws.com/img/${registration.nft_id}.png`)
		.addFields(
			{ name: 'Wallet', value: registration.wallet, inline: false },
			{ name: '#ID', value: registration.nft_id, inline: false },
			{ name: 'Registration date', value: new Date(registration.registration_date).toISOString().split('T')[0], inline: false },
			{ name: 'Strength', value: registration.strength, inline: false },
			{ name: 'Defense', value: registration.defense, inline: false },
			{ name: 'Skill', value: registration.skill, inline: false },
			{ name: 'Speed', value: registration.speed, inline: false },
			{ name: '1st Skill', value: registration.skill_1, inline: false },
			{ name: '2nd Skill', value: registration.skill_2, inline: false },
			{ name: '3rd Skill', value: registration.skill_3, inline: false },
			{ name: 'Passive Skill', value: registration.passive_skill, inline: false }
		);
}