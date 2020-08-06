//Main dependencies.
const actions = require("../actions");
const fs = require('fs');
//JSON paths.
const path = require('path');
const pathToTracker = path.resolve(__dirname, '../JSONs/muteTracker.json');

module.exports = {

    //Mutes someone for the desired time.
    MutePerson: async function (args, message) {
        //Checks for valid argumentation.
        if (!args.length || args.length < 3) {
            return actions.OfficialEmbeds.SendEmbedToChannel("⛔ **Argumentos inválidos**\nComando certo: `/mute {Pessoa} {Tempo} {Motivo}`.", message.channel);
        }

        var member = null;
        var muteTimer = 0; //Stores the INT for the timer.
        var prettyPrintTimer = ""; //Stores a STRING for the timer.

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

        //Double checking for a valid member.
        if (member == null) {
            return actions.OfficialEmbeds.SendEmbedToChannel("⛔ **Argumentos inválidos**\nVocê pode usar o ID, marcar normalmente, ou digitar o nome da pessoa.", message.channel);
        }

        //The timer can be only and 'S' for forever (or untill a mod removes its role).
        if (args[1] == "S" || args[1] == "s") {
            muteTimer = -1;
            prettyPrintTimer = "tempo indeterminado";
        } else {
            //If it's not an 'S', let's get the correct timer.
            var lastDigit = args[1].slice(args[1].length - 1).toLowerCase();
            var timer = parseInt(args[1].substring(0, args[1].length - 1));

            //Forming the prettyprint version.
            prettyPrintTimer += timer + " ";

            if ((lastDigit != "m" && lastDigit != "d" && lastDigit != "h") || timer <= 0) {
                return actions.OfficialEmbeds.SendEmbedToChannel("⛔ **Tempo inválido**\nO tempo deve ser um número seguido de `M (minutos)`, `H (horas)` ou `D (dias)`. Para mutes eternos, utilize `S`.", message.channel);
            }

            //Converting to seconds for timestamps.
            if (lastDigit == "m") {
                timer *= 60;
                prettyPrintTimer += "minuto(s)";
            } else if (lastDigit == "h") {
                timer *= 60 * 60;
                prettyPrintTimer += "hora(s)";
            } else if (lastDigit == "d") {
                timer *= 24 * 60 * 60;
                prettyPrintTimer += "dia(s)";
            }

            muteTimer = timer;
        }

        //Getting the mute reason.
        var reasonText = "";
        for (var i = 2; i < args.length; i++) {
            reasonText += args[i];
            if (i < args.length - 1) {
                reasonText += " ";
            }
        }

        if (reasonText == "") {
            return actions.OfficialEmbeds.SendEmbedToChannel("⛔ **Argumentos inválidos**\nVocê precisa digitar um motivo.", message.channel);
        }

        //Tries to add a "Muted" role to the person and logs it to the time tracker in the JSON files.
        try {
            member.roles.add('739125458913853582').then(async function () {

                //JSON objects.
                var tracker = JSON.parse(fs.readFileSync(pathToTracker).toString());

                tracker["" + member.id] = [];
                tracker["" + member.id].push({
                    "timeOfMute": Math.floor(Date.now() / 1000).toString(),
                    "muteTimer": muteTimer.toString()
                });

                fs.writeFileSync(pathToTracker, JSON.stringify(tracker));

                actions.OfficialEmbeds.SendRoleAddLog(member.id, "739125458913853582");
                actions.OfficialEmbeds.SendDefaultLog("🔇 **Membro mutado**\n<@" + member.id + "> foi mutado por `" + prettyPrintTimer + "` pelo seguinte motivo:\n\n> " + reasonText + "\n[Mensagem original](" + message.url + ")", "Geral", false, "", "Origem:  " + message.author.username + "", message.author.displayAvatarURL());
            });
        } catch (e) {
            actions.OfficialEmbeds.SendDefaultLog("⛔ **Erro**\nOcorreu algo errado ao adicionar uma nova role para <@" + member.id + ">:\n\n`" + e + "`", "Roles", true);
        }
    },

    //Checks if timers have run out on the mute list and remove their roles.
    CheckForUnmutes: async function (client) {
        //JSON objects.
        var tracker = JSON.parse(fs.readFileSync(pathToTracker).toString());

        //Checks for every ID key in the JSON.
        for (var key in tracker) {
            if (tracker.hasOwnProperty(key)) {

                //Checks for every value inside the ID key.
                for (var key2 in tracker[key]) {
                    if (tracker[key].hasOwnProperty(key2)) {

                        //Checks if enough time has elapsed (-1 is indefinite).
                        var timeElapsed = Math.floor(Date.now() / 1000) - tracker[key][key2].timeOfMute;
                        if (timeElapsed >= tracker[key][key2].muteTimer && tracker[key][key2].muteTimer != "-1") {

                            try {
                                //If we reached the end of the timer, tries to remove the member's role for muted.
                                client.guilds.cache.find(guild => guild.id == "637777562675970059").members.cache.find(member => member.id == key).roles.remove('739125458913853582').then(async function () {

                                    //Deleting its key from the files.
                                    delete tracker[key];
                                    fs.writeFileSync(pathToTracker, JSON.stringify(tracker));
                                    //Embed feedback.
                                    actions.OfficialEmbeds.SendRoleDeleteLog(key, "739125458913853582");
                                });
                            } catch (e) {
                                actions.OfficialEmbeds.SendDefaultLog("⛔ **Erro**\nOcorreu algo errado ao remover o mute de <@" + key + ">:\n\n`" + e + "`", "Roles", true);
                            }

                        }

                    }
                }

            }
        }
    },

    //Directly unmutes someone from the server.
    ForceUnmute: async function (args, message) {
        //Checks for valid argumentation.
        if (!args.length) {
            return actions.OfficialEmbeds.SendEmbedToChannel("⛔ **Argumentos inválidos**\nComando certo: `/unmute {Pessoa}`.", message.channel);
        }

        var member = null;

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

        //Double checking for a valid member.
        if (member == null) {
            return actions.OfficialEmbeds.SendEmbedToChannel("⛔ **Argumentos inválidos**\nVocê pode usar o ID, marcar normalmente, ou digitar o nome da pessoa.", message.channel);
        }

        //Tries to remove a "Muted" role to the person and unlogs it from the JSON files if it exists.
        try {
            if (member.roles.cache.has('739125458913853582')) {
                member.roles.remove('739125458913853582')
                    .then(async function () {
                        //Role removal feedback.
                        actions.OfficialEmbeds.SendRoleDeleteLog(member.id, "739125458913853582");
                        actions.OfficialEmbeds.SendDefaultLog("🔊 **Membro desmutado**\n<@" + member.id + "> foi desmutado.\n\n[Mensagem original](" + message.url + ")", "Geral", false, "", "Origem:  " + message.author.username + "", message.author.displayAvatarURL());
                    });
            }

            //JSON objects.
            var tracker = JSON.parse(fs.readFileSync(pathToTracker).toString());

            //Removes any key present in the JSON files matching the members ID, if there is any.
            for (var key in tracker) {
                if (tracker.hasOwnProperty(key)) {
                    if (key == "" + member.id) {
                        delete tracker[key];
                        fs.writeFileSync(pathToTracker, JSON.stringify(tracker));
                    }
                }
            }

        } catch (e) {
            actions.OfficialEmbeds.SendDefaultLog("⛔ **Erro**\nOcorreu algo errado ao remover uma role para <@" + member.id + ">:\n\n`" + e + "`", "Roles", true);
        }
    },
};