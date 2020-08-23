//Main dependencies.
const Discord = require('discord.js');
const fs = require('fs');

//JSON paths.
const path = require('path');
const pathToConfigs = path.resolve(__dirname, '../JSONs/configs.json');
const pathToTracker = path.resolve(__dirname, '../JSONs/messageTracker.json')

module.exports = {

	//Runs when someone types the /faq.
	FAQ_Construct: async function (message) {
		//JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToConfigs).toString());
		messageListener = JSON.parse(fs.readFileSync(pathToTracker).toString());

		//Presentation.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setTitle(":beers: Barmen Comunista")
			.setDescription("Tá com alguma pergunta? Desembucha!\n" +
				"É só reagir nos icones abaixo, e vamo dialogar, parceiro." +
				"\n\n```👨‍⚖️ - Regras\n💡 - Comandos úteis.\n🐾 - O nosso bot```");

		//Setting up reactions.
		var listen = await message.channel.send(embed);
		listen.react("👨‍⚖️");
		listen.react("💡");
		listen.react("🐾"); 

		//Telling the listener to watch for this message.
		messageListener.faq.push(listen.id);

		//Writing to file.
		fs.writeFileSync(pathToTracker, JSON.stringify(messageListener));
	},
	FAQ_Regras: async function (reaction) {
		//JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToConfigs).toString());

		//Rules section.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setDescription("👩‍⚖️ **Regras**\n\n" +
				"🍻 Para usar o bar, **tome esses cuidados** *e um copo de água a cada dose*, sob penalidade de ficar bêbado ⚠️\n" +
				"\n" +
				"```• Tenha bom senso: \n" +
				"- Qualquer discurso homofóbico, racista, misógino, xenofóbico, transfóbico é punido com permaban. Também não apoie o bolsonaro, machuque plantas, fale mal de gatos, ou comece a resolver problemas imaginários (esquizofrenia?).\n" +
				"\n" +
				"• Não faça spam!\n" +
				"- Spam é tudo que é chato: divulgação, enviar muitas mensagens, emojis ou símbolos em um curto período, pedir admin ou cargos, ser o Emerson, entre outros.\n" +
				"\n" +
				"• Não mencione atoa: \n" +
				"- Não mencione ninguém sem motivo, principalmente cargos da Staff. As pessoas param o que estão fazendo para visualizar menções!\n" +
				"\n" +
				"• Respeite os funcionários do bar: \n" +
				"- São eles que servem a porcaria da sua bebida, a menos que você queira ficar drogado ou beber algo com cuspe, tenha respeito filho da puta!```\n" +
				"**Lembre-se:** \n" +
				"*Cu de bêbado não tem dono.* 🍑");

		reaction.message.edit(embed);
	},
	FAQ_Comandos: async function (reaction) {
		//JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToConfigs).toString());

		//Rules section.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setDescription("💡 **Comandos úteis**\n\n" +
				"Cada um dos nossos compatriotas serviçais gostam de ser tratados de um jeito e cada um tem sua batida especial. Dá uma olhada ai:\n" +
				"\n" +
				"`Igor faça a lista seu inutil`");

		reaction.message.edit(embed);
	},
	FAQ_Bot: async function (reaction) {
		//JSON objects.
		configs = JSON.parse(fs.readFileSync(pathToConfigs).toString());

		//Rules section.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.officialEmbedColor)
			.setDescription("🐾 **O Bot Comunistinha**\n\n" +
				"O nosso querido amigo Comunistinha foi criado pelo [Estúdio Weasel](https://estudioweasel.com), que pertence ao <@205817378808791041> e ao <@495984804198875136>.\n" +
				"\n*Soyuz nerushimy respublik svobodnykh. Splotila naveki velikaya Rus'! Da zdravstvuyet sozdanny voley narodov. Yediny, moguchy Sovetsky Soyuz!*");

		reaction.message.edit(embed);
	}
};