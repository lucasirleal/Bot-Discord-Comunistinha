//Main dependencies.
const Discord = require('discord.js');
const fs = require('fs');

//JSON paths.
const path = require('path');
const pathToConfigs = path.resolve(__dirname, '../JSONs/configs.json');
const pathToTracker = path.resolve(__dirname, '../JSONs/messageTracker.json')

module.exports = {

	//Runs when someone types the /faq.
	Dicas_Construct: async function (message) {
		//JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToConfigs).toString());
		messageListener = JSON.parse(fs.readFileSync(pathToTracker).toString());

		//Presentation.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":beers: Barmen Comunista")
			.setDescription("Aqui vai uns truque do nosso especialista para você aproveitar todas as batidas do campeão:\n" +
				"Clica numa reação e bó ouvir os ensinamento!");

		//Setting up reactions.
		var listen = await message.channel.send(embed);
		listen.react("🟤");
		listen.react("🔵");
		listen.react("🟢");
		listen.react("🟡");
		listen.react("🟣");

		//Telling the listener to watch for this message.
		messageListener.dicas.push(listen.id);

		//Writing to file.
		fs.writeFileSync(pathToTracker, JSON.stringify(messageListener));
	},
	Dicas_1: async function (reaction) {
		//JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToConfigs).toString());

		//Rules section.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setDescription("As mesas (canais) tem plaquinhas falando pra que servem nas suas mensagens fixadas!\n" +
				"Campeão, mostra pro compatriota como que faz!")
			.setImage("https://i.imgur.com/X9WPeT8.gif");

		reaction.message.edit(embed);
	},
	Dicas_2: async function (reaction) {
		//JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToConfigs).toString());

		//Rules section.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setDescription("Os bêbado tão festejando a noite toda!\n" +
				"Dá uma bizoiada em como pôr os tampões de ouvido:")
			.setImage("https://i.imgur.com/SRJZqqU.gif");

		reaction.message.edit(embed);
	},
	Dicas_3: async function (reaction) {
		//JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToConfigs).toString());

		//Rules section.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setDescription("Tem uma mesa pra lá de barulhenta?\n" +
				"É só usar esse treco aqui:")
			.setImage("https://i.imgur.com/8V73Jim.gif");

		reaction.message.edit(embed);
	},
	Dicas_4: async function (reaction) {
		//JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToConfigs).toString());

		//Rules section.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setDescription("Opa, não esquece de ver se a <#729036577925365841> é sua! Se cadastra lá e tu vai ter acesso até as mesas VIP compadre!\n" +
				"É só reagir quando quiser um cargo, assim ó:")
			.setImage("https://i.imgur.com/oKLLyKN.gif");

		reaction.message.edit(embed);
	},
	Dicas_5: async function (reaction) {
		//JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToConfigs).toString());

		//Rules section.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setDescription("Tem uns cara trocando soco!\n" +
				"Se tu achar alguém desrespeitando as <#729036434341756939>, é só chamar um dos <@&706170852206575677>")
			.setImage("https://i.imgur.com/mWTroke.gif");

		reaction.message.edit(embed);
	}
};