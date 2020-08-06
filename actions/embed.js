//Main dependencies.
const Discord = require('discord.js');
const fs = require('fs');
//JSON paths.
const path = require('path');
const pathToConfigs = path.resolve(__dirname, '../JSONs/configs.json');

module.exports = {

	//Single command for sending an embed.
	SendEmbed: function (args, message) {
		//JSON objects.
		var configs = JSON.parse(fs.readFileSync(pathToConfigs).toString());

		//If no number argument is given, delete the message.
		if (!args.length) {
			return message.delete();
		}

		/* The embed command is built using different arguments.
		 * The fist argument of the string is always checked to see if it's a valid URL.
		 * If that is true, we'll set the image of the URL as the embed thumbnail.
		 * The, all text is added to the embed, and if we want a nice image on the bottom of it, we can define with using ## before the URL.
		 */

		//REGEX for a valid URL.
		var pattern = new RegExp('^(https?:\\/\\/)?' +
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
			'((\\d{1,3}\\.){3}\\d{1,3}))' +
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
			'(\\?[;&a-z\\d%_.~+=-]*)?' +
			'(\\#[-a-z\\d_]*)?$', 'i');

		//Building up the embed.
		const embed = new Discord.MessageEmbed()
			.setColor(configs.customEmbedColor)
			.setFooter(new Date().toLocaleString(), message.author.displayAvatarURL());

		//Checking for a valid URL to set as a thumbnail.
		var thumbnailCheck = false;

		if (!!pattern.test(args[0])) {
			//If yes, we set it here.
			embed.setThumbnail(args[0]);
			thumbnailCheck = true;
		}

		var text = ""; //This will be all text present on the embed.
		var image = ""; //This is the URL for the bottom image.
		var counter = thumbnailCheck ? 1 : 0; //If we have a valid URL for the thumbnail, we actually start counting the args on position 1.

		for (var i = counter; i < args.length; i++) {
			//Checking for a valid URL if the user typed ##.
			if (args[i].startsWith("##")) {
				if (!!pattern.test(args[i].substr(2))) {
					embed.setImage(args[i].substr(2));
				}
			}
			//Building up all text remaining.
			else {
				text += args[i];
				text += " ";
			}
		}
		//Finishing and sending the embed.
		embed.setDescription(text);
		message.channel.send(embed);
		message.delete();
	}
};