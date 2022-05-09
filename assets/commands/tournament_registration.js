const { SlashCommandBuilder } = require('@discordjs/builders');
const Luchadores = require('../classes/Luchadores');
const TournamentRegistration = require('../classes/TournamentRegistration');

/*
    Command /tournament_registration =
    Used to register to the community tournament
*/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('tournament_registration')
		.setDescription('Register to the next community tournament !')
		.addStringOption(option => 
            option.setName('wallet')
                .setDescription('Your 0x. Not compatible with ENS')
                .setRequired(true)
        )
		.addIntegerOption(option => 
            option.setName('id')
                .setDescription('The ID of the Luchador you choose for this tournament (between 1 to 10000)')
                .setRequired(true)
        )
        .addIntegerOption(option => 
            option.setName('strength')
                .setDescription('How much strength ? (between 1 to 80)')
                .setRequired(true)
        )
		.addIntegerOption(option => 
            option.setName('defense')
                .setDescription('How much defense ? (between 1 to 80)')
                .setRequired(true)
        )
		.addIntegerOption(option => 
            option.setName('skill')
                .setDescription('How much skill ? (between 1 to 80)')
                .setRequired(true)
        )
		.addIntegerOption(option => 
            option.setName('speed')
                .setDescription('How much speed ? (between 1 to 80)')
                .setRequired(true)
        )
		.addStringOption(option => 
            option.setName('skill_1')
                .setDescription('1st selected skill')
                .setRequired(true)
				.addChoice('2x', '2x')
				.addChoice('Double', 'Double')
				.addChoice('Slam', 'Slam')
				.addChoice('Ace', 'Ace')
				.addChoice('Leech', 'Leech')
				.addChoice('Heal', 'Heal')
				.addChoice('Focus', 'Focus')
				.addChoice('Neutralise', 'Neutralise')
				.addChoice('Flurry', 'Flurry')
				.addChoice('Comeback', 'Comeback')
        )
		.addStringOption(option => 
            option.setName('skill_2')
                .setDescription('2nd selected skill')
                .setRequired(true)
				.addChoice('2x', '2x')
				.addChoice('Double', 'Double')
				.addChoice('Slam', 'Slam')
				.addChoice('Ace', 'Ace')
				.addChoice('Leech', 'Leech')
				.addChoice('Heal', 'Heal')
				.addChoice('Focus', 'Focus')
				.addChoice('Neutralise', 'Neutralise')
				.addChoice('Flurry', 'Flurry')
				.addChoice('Comeback', 'Comeback')
        )
		.addStringOption(option => 
            option.setName('skill_3')
                .setDescription('3rd selected skill')
                .setRequired(true)
				.addChoice('2x', '2x')
				.addChoice('Double', 'Double')
				.addChoice('Slam', 'Slam')
				.addChoice('Ace', 'Ace')
				.addChoice('Leech', 'Leech')
				.addChoice('Heal', 'Heal')
				.addChoice('Focus', 'Focus')
				.addChoice('Neutralise', 'Neutralise')
				.addChoice('Flurry', 'Flurry')
				.addChoice('Comeback', 'Comeback')
        )
		.addStringOption(option => 
            option.setName('passive_skill')
                .setDescription('selected passive skill')
                .setRequired(true)
				.addChoice('All-rounder', 'All-rounder')
				.addChoice('Brute', 'Brute')
				.addChoice('Tough', 'Tough')
				.addChoice('Prowess', 'Prowess')
				.addChoice('Speedster', 'Speedster')
				.addChoice('Last Stand', 'Last Stand')
        ),
		//.setDefaultPermission(false),
	async execute(interaction) {

		// Find user's filled parameters
		let discordUserName = interaction.user.username + '#' + interaction.user.discriminator;
		let discordUserId = interaction.user.id;
		let wallet = interaction.options.getString('wallet');
		let nftId = interaction.options.getInteger('id');
		let strength = interaction.options.getInteger('strength');
		let defense = interaction.options.getInteger('defense');
		let skill = interaction.options.getInteger('skill');
		let speed = interaction.options.getInteger('speed');
		let selectedSkill1 = interaction.options.getString('skill_1');
		let selectedSkill2 = interaction.options.getString('skill_2');
		let selectedSkill3 = interaction.options.getString('skill_3');
		let selectedPassiveSkill = interaction.options.getString('passive_skill');

		// check if wallet is a 0x
		if (!wallet.startsWith('0x')) {
            await interaction.reply({ content: 'first paremeter must be your 0x', ephemeral: true });
            return;
        }

		// check if current user is not already registered
		// check if provided wallet is not already registered
		// check if provided nft id is not already registered
		let discordIdAlreadyPersisted = await TournamentRegistration.getProvidedUserTournamentRegistration('discord_id', discordUserId);
		let walletAlreadyPersisted = await TournamentRegistration.getProvidedUserTournamentRegistration('wallet', wallet);
		let nftAlreadyPersisted = await TournamentRegistration.getProvidedUserTournamentRegistration('nft_id', nftId.toString());
		if (discordIdAlreadyPersisted != undefined || walletAlreadyPersisted != undefined || nftAlreadyPersisted != undefined) {
			await interaction.reply({ content: 'You are already registered. Registration date : ' + discordIdAlreadyPersisted.registration_date, ephemeral: true });
			return;
		}

		// check if provided wallet is owner of provided nft id
		let isOwner = await Luchadores.isOwnerOf(wallet, nftId);
		if (!isOwner) {
			await interaction.reply({ content: wallet + ' is not owner of ' + nftId, ephemeral: true });
			return;
		} 

		// Validate all numeric stats
		if (strength < 1 || strength > 80) {
			await interaction.reply({ content: 'strength must be between 0 and 80', ephemeral: true });
			return;
		}
		if (defense < 1 || defense > 80) {
			await interaction.reply({ content: 'defense must be between 0 and 80', ephemeral: true });
			return;
		}
		if (skill < 1 || skill > 80) {
			await interaction.reply({ content: 'skill must be between 0 and 80', ephemeral: true });
			return;
		}
		if (speed < 1 || speed > 80) {
			await interaction.reply({ content: 'speed must be between 0 and 80', ephemeral: true });
			return;
		}

		// All stats can exceed 88
		if (!((strength + defense + skill + speed) == 88)) {
			await interaction.reply({ content: 'Maximum stats point is 84', ephemeral: true });
			return;
		}

		// validate if selected skills are equals
		if ((selectedSkill1 == selectedSkill2 || selectedSkill1 == selectedSkill3) || selectedSkill2 == selectedSkill3) {
			await interaction.reply({ content: 'selected skills must be differents', ephemeral: true });
			return;
		} 
		
		// create new tournament registration
		let registration = new TournamentRegistration(
			discordUserId,
			discordUserName,
			wallet,
			nftId,
			strength,
			defense,
			skill,
			speed,
			selectedSkill1,
			selectedSkill2,
			selectedSkill3,
			selectedPassiveSkill,
			new Date().toISOString().split('T')[0]
		);

		// persist the new tournament registration
		await registration.persist();

		await interaction.reply(
            { 
                content: "¡ Felicidades " + interaction.user.username + " your are now registered for the next community tournament !",
                ephemeral: true 
            }
        );
	},

};
