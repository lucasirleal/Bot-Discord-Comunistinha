//Main dependencies.
const Discord = require('discord.js');
const fs = require('fs');

//JSON paths.
const path = require('path');
const pathToConfigs = path.resolve(__dirname, '../JSONs/configs.json');
const pathToChanIDs = path.resolve(__dirname, '../JSONs/channelIDs.json')

//Variables used frequently in official embeds.
var avatarURL = "";
var channel_LogsGer = null;
var channel_LogsMus = null;
var channel_LogsMsg = null;
var channel_LogsCar = null;
var channel_LogsRea = null;

module.exports = {

    //Constructs data for all admin log channels.
    Construct: async function (client) {
        //JSON objects.
        var channelIDS = JSON.parse(fs.readFileSync(pathToChanIDs).toString());

        channel_LogsGer = await client.channels.fetch(channelIDS.logsGer);
        channel_LogsMus = await client.channels.fetch(channelIDS.logsMus);
        channel_LogsMsg = await client.channels.fetch(channelIDS.logsMsg);
        channel_LogsCar = await client.channels.fetch(channelIDS.logsCar);
        channel_LogsRea = await client.channels.fetch(channelIDS.logsRac);

        avatarURL = await client.user.displayAvatarURL();

        if (avatarURL == "" || channel_LogsGer == null || channel_LogsMus == null || channel_LogsMsg == null || channel_LogsCar == null || channel_LogsRea == null) {
            console.log("An error occourred while trying to fetch the discord log channels and/or the avatarURL.\n\n");
            console.log("Avatar URL: " + avatarURL + "\n");
            console.log("-----");
            console.log("LogsMus: " + channel_LogsMus + "\n");
            console.log("LogsGer: " + channel_LogsGer + "\n");
            console.log("LogsMsg: " + channel_LogsMsg + "\n");
            console.log("LogsCar: " + channel_LogsCar + "\n");
            console.log("LogsRea: " + channel_LogsRea + "\n");
            process.exit();
        }
    },

    //Sends a default log on the desired channel.
    SendDefaultLog: async function (message, channelIndex = "Geral", isError = false, attachmentURL = "", customFooter = "", customFooterIcon = "") {
        //JSON objects.
        var configs = JSON.parse(fs.readFileSync(pathToConfigs).toString());

        const embed = new Discord.MessageEmbed()
            .setColor(configs.officialEmbedColor)
            .setDescription(message);

        //Error logs have a different side bar color.
        if (isError) {
            embed.setColor("#ff0040");
        }

        //Attachments are used for file logs.
        if (attachmentURL != "") {
            embed.attachFiles(attachmentURL);
        }

        //Custom footers can be used to determine origin of actions.
        if (customFooter != "") {
            embed.setFooter(customFooter, customFooterIcon);
        }

        try {
            switch (channelIndex) {
                case "Music":
                    return channel_LogsMus.send(embed);
                case "Message":
                    return channel_LogsMsg.send(embed);
                case "Roles":
                    return channel_LogsCar.send(embed);
                case "Reacts":
                    return channel_LogsRea.send(embed);
                default:
                    return channel_LogsGer.send(embed);
            }
        } catch (e) {
            console.log(e);
        }

    },

    //Sends a default embed to a desired channel.
    SendEmbedToChannel: async function (message, channel) {
        const embed = new Discord.MessageEmbed()
            .setColor(configs.officialEmbedColor)
            .setDescription(message);

        channel.send(embed);
    },

    //Quick function to log role adding.
    SendRoleAddLog: async function (memberID, roleID) {
        const embed = new Discord.MessageEmbed()
            .setColor(configs.officialEmbedColor)
            .setDescription("✅ **Nova role adicionada**\nO membro <@" + memberID + "> recebeu a role <@&" + roleID + ">.");

        channel_LogsCar.send(embed);
    },

    //Quick function to log role deleting.
    SendRoleDeleteLog: async function (memberID, roleID) {
        const embed = new Discord.MessageEmbed()
            .setColor(configs.officialEmbedColor)
            .setDescription("❎ **Role removida**\nO membro <@" + memberID + "> perdeu a role <@&" + roleID + ">.");

        channel_LogsCar.send(embed);
    }
};