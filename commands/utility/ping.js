const { SlashCommandBuilder } = require('discord.js');
const { client } = require("../../main.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('пинг')
		.setDescription('понг!'),
	async execute(interaction) {
		await interaction.reply(`Понг! ${client.ws.ping}ms`);
	},
};
