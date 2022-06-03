const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const CocaCampaign = require('../classes/CocaCampaign');

/*
	Command /get_coca_campaigns
	Returns active coca campaigns
*/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('get_coca_campaigns')
		.setDescription('Get active coca campaigns'),
	async execute(interaction) {
		let dbCampaigns = await CocaCampaign.getAllCampaigns();
		if (dbCampaigns != undefined) {
			let embeds = [];
			for (let dbCampaign of dbCampaigns) {
				let embed = new MessageEmbed()
					.setTitle(`Name : ${dbCampaign.name}`)
					.setColor(0x743cef)
					.addFields(
						{ name: '<:coca_leaf:972094774582587393>', value: dbCampaign.coca, inline: true},
						{ name: 'Created', value: new Date(dbCampaign.creation_date).toISOString().split('T')[0], inline: true},
						{ name: 'Description', value: dbCampaign.description, inline: true}						
					);
				embeds.push(embed);
			}

			await interaction.reply({ embeds: embeds, ephemeral: true });
		} else {
			await interaction.reply({ content: 'No active campaigns !', ephemeral: true });
			return;
		}
	}
};


