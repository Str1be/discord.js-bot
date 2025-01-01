const { REST, Routes, Client, GatewayIntentBits, Collection, Events, GuildMember } = require('discord.js');     
const fs = require('node:fs');
const path = require('node:path');

(async () => {
	const token = await fs.promises.readFile("token.txt", 'utf8');
	const rest = new REST({ version: '10' }).setToken(token);


const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.MessageContent
] });
module.exports = { client }

client.commands = new Collection();

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
console.log(foldersPath);
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = ("D:/Проги/discordjs/commands/utility");
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = (`D:/Проги/discordjs/commands/utility/${file}`);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands("1066767715005644830"),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('Чикибряжимся');
});

client.on('messageCreate', async (message) => {
  if(!message.author.bot) {
    if(message.content == 'яебал' || message.content == 'Яебал') {
      try {
        let data = JSON.parse(await fs.promises.readFile("count.json", 'utf8'));
        message.react("🔥");
        message.reply(`${data['яебал-счёт']}-ый раз уже..`);
        data['яебал-счёт']++;
        await fs.promises.writeFile('count.json', JSON.stringify(data, null, 2), 'utf8');
    } catch(e) {
      console.log(e);
    }
    }
    if(message.content == 'япротив') {s
      message.react("1097255557649408171");
      message.channel.send({files: ["pics/жирич.jpg"]})
    }
	if(message.content.startsWith('ебать')) {
		try{
			const member = message.mentions.members.first();
			if (message.author.id == member.id && !message.content.endsWith('шиз')) {
				message.reply(`**${message.author.globalName}** ТРАХНУЛ САМ СЕБЯ!!!!!🔥🔥🔥🔥 УХХХХ ЧО ОН ТВОРИТ!!!`)
				//for (let i = 0; i < memroles.length; i++) {
					
				//}
			}
			else {
				
				const memroles = member.roles.cache.map(role => role);
				const mutedur = 1000 * 6.9;
				try {
				await member.roles.remove(memroles);
				await member.timeout(mutedur, "Выебан.");
				setTimeout(async() => {
					await member.roles.add(memroles);
				}, mutedur+10)
				message.reply(`СЕЕЕЕЕЕЕЕЕЕЕЕЕКС!!!!!🔥🔥🔥🔥🔥 **${member.user.globalName}** БЫЛ ВЫЕБАН **${message.author.globalName}**`)
				} catch(e) {
					message.reply("ошб ---> " + e);
				}
				

			}
		}
		catch(e) {
			console.log("команда ебать  |  "+e);
			message.reply("ошибка --->" + e);
		}
	  }
  }
});
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);


  if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

  try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});

client.on('guildMemberAdd', async (mem) => {
	try {
		console.log("0")
		let in_whitelist = false;
		if (mem.user.bot) {
			console.log("1")
			let whitelisted_bots = (JSON.parse(await fs.promises.readFile("whitelisted_bots.json", 'utf8'))).ids;
			for (let i = 0; i < whitelisted_bots.length; i++) {
				console.log("2")
				if (mem.id == whitelisted_bots[i]) {
					in_whitelist == true;
					break
				}
			}
			if(!in_whitelist) {
				mem.kick("Бот не находится в вайтлисте");
				console.log(`Решение бота  |  бот ${mem.user.username} был кикнут так как не находится в вайтлисте`)
				client.channels.cache.get("1061606413559922708").send(`Бот ${mem.user.username} был кикнут так как не находится в вайтлисте`);
			}
		}
	}
	catch(e) {
		console.log("При входе на сервер произошла ошибка - " + e);
	}
	
})

client.login(token);
})();