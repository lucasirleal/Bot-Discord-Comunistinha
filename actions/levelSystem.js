//Main dependencies.
const Discord = require('discord.js');
const actions = require("../actions");
const fs = require('fs');
//JSON paths.
const path = require('path');
const { count } = require("console");
const pathToTracker = path.resolve(__dirname, '../JSONs/levelTracker.json');

module.exports = {

    //Accounts for newly aquired XP.
    HandleXP: async function (message) {

        //Declines if the user is typing on specified channels.
        if (message.channel.id == "729037736635400233" || message.channel.id == "729037845238513785") { return; }

        //JSON objects.
        var tracker = JSON.parse(fs.readFileSync(pathToTracker).toString());

        var id = message.author.id.toString();

        //Checking for already existing keys.
        if (!tracker.hasOwnProperty(message.author.id)) {
            tracker[id] = new Array();
            tracker[id].push({
                "xp": 0,
                "level": 0,
                "lastXp": 0
            });

            tracker[id][0].xp = 20;
            tracker[id][0].lastXp = Math.floor(Date.now() / 1000);
        }
        else {
            if (Math.floor(Date.now() / 1000) - tracker[id][0].lastXp >= 60) {
                tracker[id][0].xp += 20 + (50 - 20) * Math.random();
                tracker[id][0].lastXp = Math.floor(Date.now() / 1000);
            }
        }

        //Writing to file.
        await fs.writeFileSync(pathToTracker, JSON.stringify(tracker));
        this.HandleLevel(message);
    },

    //Handles level gains.
    HandleLevel: async function (message) {
        //JSON objects.
        var tracker = JSON.parse(fs.readFileSync(pathToTracker).toString());

        var id = message.author.id;
        var xp = tracker[id][0].xp;
        var level = tracker[id][0].level;

        var nextLevel = (150 * (level + 1)) + Math.pow(level + 1, 2);
        var realLevel = level;
        if (xp >= nextLevel) { realLevel++; }

        var randomMessages = [
            "Cuidado com a cirrose, seu alcóolatra.",
            "O fígado já saiu diluído no xixi.",
            "Vodka pra esse aí é suquinho.",
            "Qual o sentido da vida mesmo?",
            "Eu já nem sei mais o que é bebida e o que é gente aqui.",
            "Cria vergonha na cara, meninx!",
            "Garçom... aqui nesta mesa de bar...",
            "Eu bebo é pra acabar!",
            "Eu bebo é pra ficar ruim, pra ficar bom eu tomo remédio.",
            "Rússia que me aguarde"
        ];

        if (level < realLevel) {

            tracker[id][0].level = realLevel;
            actions.OfficialEmbeds.SendEmbedToChannel("**Parabéns carai! :beers: **\nO <@" + id + "> bebe tanto que já tá **nível " + realLevel + "** aqui no barzinho!\n||*(" + randomMessages[Math.floor(Math.random() * randomMessages.length)] + ")*||", message.channel);

            //Adding the level roles.
            if (realLevel == 1 && level != 1) {
                AddRole(message, "740243920763748353");
            }
            else if (realLevel == 5 && level != 5) {
                RemoveRole(message, "740243920763748353");
                AddRole(message, "740244089961709588");
            }
            else if (realLevel == 10 && level != 10) {
                RemoveRole(message, "740243920763748353");
                RemoveRole(message, "740244089961709588");
                AddRole(message, "740244189886939237");
            }
            else if (realLevel == 25 && level != 25) {
                RemoveRole(message, "740243920763748353");
                RemoveRole(message, "740244089961709588");
                RemoveRole(message, "740244189886939237");
                AddRole(message, "740244264897871961");
            }
            else if (realLevel == 50 && level != 50) {
                RemoveRole(message, "740243920763748353");
                RemoveRole(message, "740244089961709588");
                RemoveRole(message, "740244189886939237");
                RemoveRole(message, "740244264897871961");
                AddRole(message, "740244442245759117");
            }
            else if (realLevel == 75 && level != 75) {
                RemoveRole(message, "740243920763748353");
                RemoveRole(message, "740244089961709588");
                RemoveRole(message, "740244189886939237");
                RemoveRole(message, "740244264897871961");
                RemoveRole(message, "740244442245759117");
                AddRole(message, "740244577587298578");
            }
            else if (realLevel == 100 && level != 100) {
                RemoveRole(message, "740243920763748353");
                RemoveRole(message, "740244089961709588");
                RemoveRole(message, "740244189886939237");
                RemoveRole(message, "740244264897871961");
                RemoveRole(message, "740244442245759117");
                RemoveRole(message, "740244577587298578");
                AddRole(message, "740244669719642132");
            }
        }


        //Writing to file.
        await fs.writeFileSync(pathToTracker, JSON.stringify(tracker));
    },

    //Shows the current rank of the person who typed it.
    Rank: async function (args, message) {
        //JSON objects.
        var tracker = JSON.parse(fs.readFileSync(pathToTracker).toString());

        var member;

        if (!args.length) {
            member = await message.guild.members.fetch(message.author.id);
        } else if (args.length == 1) {
            //Checks for a valid member tag.
            if (args[0].startsWith('<@') && args[0].endsWith('>')) {
                var mention = args[0].slice(2, -1);

                if (mention.startsWith('!')) {
                    mention = mention.slice(1);
                }

                member = await message.guild.members.fetch(mention);
            }
            //If its not a tag, check if we have an ID.
            else if (/^\d+$/.test(args[0])) {
                member = await message.guild.members.fetch(args[0]);
            }
            //If its neither, we return an error to prevent mistakes.
            else {
                return actions.OfficialEmbeds.SendEmbedToChannel("⛔ **Argumentos inválidos**\nPara previnir ambiguidades, marque a pessoa desejada ou digite seu ID.", message.channel);
            }
        } else {
            return actions.OfficialEmbeds.SendEmbedToChannel("⛔ **Argumentos inválidos**\nVocê só pode ver o rank de uma pessoa por vez. Use seu ID ou marque-a.", message.channel);
        }

        var allLevels = {};

        //Checks for every ID key in the JSON.
        for (var key in tracker) {
            if (tracker.hasOwnProperty(key)) {
                allLevels[key] = tracker[key][0].level;
            }
        }

        // Create items array
        var items = Object.keys(allLevels).map(function (key) {
            return [key, allLevels[key]];
        });

        // Sort the array based on the second element
        items.sort(function (first, second) {
            return second[1] - first[1];
        });

        var counter = 1;
        for (var i = 0; i < items.length; i++) {
            if (items[i][0] != member.id) {
                counter++;
            } else {
                break;
            }
        }

        var id = member.id.toString();
        var xpAtual = Math.floor(tracker[id][0].xp);
        var levelAtual = tracker[id][0].level;

        var nextLevel = (150 * (levelAtual + 1)) + Math.pow(levelAtual + 1, 2);
        var lastLevel = (150 * levelAtual) + Math.pow(levelAtual, 2);

        const embed = new Discord.MessageEmbed()
            .setColor("#00f57a")
            .setThumbnail(member.user.displayAvatarURL())
            .setDescription("**Rank: " + counter + " :star2: **\n\n> :beers: **Nível atual:** " + levelAtual + "\n> :sparkles: **XP atual:** " + xpAtual + " xp\n> :high_brightness: **Próximo nível:** " + nextLevel + " xp\n\n:rocket: <@" + id + "> está **" + Math.abs(Math.round((100 / (nextLevel - lastLevel)) * (xpAtual - lastLevel))) + "%** lá!");
        message.channel.send(embed);
    },

    //Show the top ranked people.
    Top: async function (message) {
        //JSON objects.
        var tracker = JSON.parse(fs.readFileSync(pathToTracker).toString());

        var member;

        member = await message.guild.members.fetch(message.author.id);

        var allLevels = {};

        //Checks for every ID key in the JSON.
        for (var key in tracker) {
            if (tracker.hasOwnProperty(key)) {
                allLevels[key] = tracker[key][0].level;
            }
        }

        // Create items array
        var items = Object.keys(allLevels).map(function (key) {
            return [key, allLevels[key]];
        });

        // Sort the array based on the second element
        items.sort(function (first, second) {
            return second[1] - first[1];
        });

        var counter = 1;
        for (var i = 0; i < items.length; i++) {
            if (items[i][0] != member.id) {
                counter++;
            } else {
                break;
            }
        }

        var id = member.id.toString();

        var fullDescription = "**:beers: Os mais bebuns:**\n\n";

        if (items.length >= 1) { fullDescription += "> :first_place: <@" + items[0][0] + ">, com nível **" + items[0][1] +"**.\n"; }
        if (items.length >= 2) { fullDescription += "> :second_place: <@" + items[1][0] + ">, com nível **" + items[1][1] +"**.\n"; }
        if (items.length >= 3) { fullDescription += "> :third_place: <@" + items[2][0] + ">, com nível **" + items[2][1] +"**."; }

        var levelAtual = tracker[id][0].level;
        if (counter > 3) { fullDescription += "\n\n<@" + id + ">, seu rank é o número **" + counter + "**, e você tem nível **" + levelAtual + "**."; }

        const embed = new Discord.MessageEmbed()
            .setColor("#00f57a")
            .setDescription(fullDescription);

        message.channel.send(embed);
    }
};


//Add a role if the user don't already have it.
async function AddRole(message, roleID) {
    //First we need to get the desired user.
    let member = await message.guild.members.fetch(message.author.id);
    //Then we get the role ID.
    let role = message.guild.roles.cache.find(role => role.id == roleID);

    //If the user don't have the role, we add it.
    if (!member.roles.cache.has(role.id)) {
        await member.roles.add(role).catch(console.error);
        actions.OfficialEmbeds.SendRoleAddLog(member.id, role.id);
    }
}

//Removes a role from a user.
async function RemoveRole(message, roleID) {
    //First we need to get the desired user.
    let member = await message.guild.members.fetch(message.author.id);
    //Then we get the role ID.
    let role = message.guild.roles.cache.find(role => role.id == roleID);

    //If the user don't have the role, we add it.
    if (member.roles.cache.has(role.id)) {
        await member.roles.remove(role).catch(console.error);
        actions.OfficialEmbeds.SendRoleDeleteLog(member.id, role.id);
    }
}