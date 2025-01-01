const { SlashCommandBuilder } = require('discord.js');
const { client } = require("../../main.js");
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('добавить_бота_в_белый_список')
		.setDescription('^')
        .addStringOption(opt => opt.setName("id_бота").setDescription("айди бота которого которого ты хочешь добавить").setRequired(true)),
	async execute(interaction) {
        try {
            if(interaction.user.id == "813850977538539580") {
                let res;
                try {
                    res = await client.users.fetch(interaction.options.getString('id_бота'))   
                }
                catch(e) {
                    await interaction.reply({content:`${e}`})
                }
                if(res.bot) {
                    let is_found = false;
                    let opt_bot_id = interaction.options.getString('id_бота');
                    let json_data = JSON.parse(await fs.promises.readFile("whitelisted_bots.json", 'utf8'));
                    for(let i = 0; i < json_data.ids.length; i++) {
                        console.log("whitelist_bot.js  |  проверка на повтор айди #" + (i+1));
                        if (json_data.ids[i] == opt_bot_id) {
                            is_found = true;
                            break;
                        }
                    }
                    if (!is_found) {
                        console.log("ало")
                        json_data.ids[json_data.ids.length] = opt_bot_id;
                        console.log(json_data.ids[json_data.ids.length]);
                        await fs.promises.writeFile('whitelisted_bots.json', JSON.stringify(json_data, null, 2), 'utf8');
                        console.log(`whitelist_bot.js  |  id (${opt_bot_id}) был добавлен в вайтлист`)
                    }
                }
                else {
                    await interaction.reply({content:"Это не бот"})
                }
            }
            else {
                await interaction.reply({content:"ТЫ НЕ ДИМКА!!! ПОШЁЛ НАХУЙ!!!"})
            }
        }
        catch(e) {
            console.log(e);
        }
        
	},
};
