const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js')
const HonorsCampaign = require('../classes/HonorsCampaign');

/*
	Command /get_honors_campaigns
	Returns all Honors campaigns
*/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('get_honors_campaigns')
		.setDescription('Get all honors campaigns'),
	async execute(interaction) {
		let dbCampaigns = await HonorsCampaign.getAllCampaigns();
		if (dbCampaigns != undefined && dbCampaigns.length > 0) {
			let embeds = [];
			for (let dbCampaign of dbCampaigns) {
				let embed = new MessageEmbed()
					.setTitle(`Name : ${dbCampaign.name}`)
					.setColor(0x743cef)
					.addFields(
						{ name: 'Honors', value: dbCampaign.honors, inline: true},
						{ name: 'Created', value: new Date(dbCampaign.creation_date).toISOString().split('T')[0], inline: true},
						{ name: 'Description', value: dbCampaign.description, inline: true},
                        { name: 'Running', value: dbCampaign.is_running.toString(), inline: true}				
					);
				embeds.push(embed);
			}

			await interaction.reply({ embeds: embeds, ephemeral: true });
		} else {
			await interaction.reply({ content: 'No campaign found !', ephemeral: true });
			return;
		}
	}
};


