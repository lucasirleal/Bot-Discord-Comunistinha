//Main dependencies.
const actions = require("../actions");
const fs = require('fs');
//JSON paths.
const path = require('path');
const pathToTracker = path.resolve(__dirname, '../JSONs/warnTracker.json');

module.exports = {

    //Warns someone and stores an infraction.
    WarnPerson: async function (args, message) {
        //Checks for valid argumentation.
        if (!args.length || args.length < 2) {
            return actions.OfficialEmbeds.SendEmbedToChannel("⛔ **Argumentos inválidos**\nComando certo: `/warn {Pessoa} {Motivo}`.", message.channel);
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

        //Getting the reason text.
        var reasonText = "";
        for (var i = 1; i < args.length; i++) {
            reasonText += args[i];
            if (i < args.length - 1) {
                reasonText += " ";
            }
        }

        if (reasonText == "") {
            return actions.OfficialEmbeds.SendEmbedToChannel("⛔ **Argumentos inválidos**\nVocê precisa digitar um motivo.", message.channel);
        }

        //Logs the warn in the JSON files for further knowledge.
        try {

            //JSON objects.
            var tracker = JSON.parse(fs.readFileSync(pathToTracker).toString());

            //The warn tracker stores only the timestamp of the infraction, when it is old enough, we'll just remove it.
            tracker["" + member.id].push(Math.floor(Date.now() / 1000).toString());

            //Counts for enough warns to mute someone.
            var presentWarns = 0;

            //Checks for every ID key in the JSON.
            for (var key in tracker) {
                if (tracker.hasOwnProperty(key)) {

                    //Checks for every value inside the ID key.
                    for (var key2 in tracker[key]) {
                        if (tracker[key].hasOwnProperty(key2)) {

                            if (key != member.id) {
                                continue;
                            }

                            //Checks if enough time has elapsed (infractions are removed if they are 7 days or older).
                            var timeElapsed = Math.floor(Date.now() / 1000) - parseInt(tracker[key][key2]);
                            if (timeElapsed >= (60 * 60 * 24 * 7)) {
                                delete tracker[key][key2];
                                await actions.OfficialEmbeds.SendDefaultLog("⚠️ **Warn removido**\n<@" + member.id + "> perdeu um warn por ser de 7 dias atrás ou mais.");
                            } else {
                                presentWarns++;
                            }
                        }
                    }
                }
            }

            /*
            Applying mutes.
            Warns are removed every 7 days, but you receive a mute when you have:
            3 not expired: 30min mute.
            4 not expired: 1hour mute.
            5 not expired: 5hour mute.
            */

            if (presentWarns == 3) {
                await actions.Mute.MutePerson([member.id, "30M", "3", "warns", "não", "expirados."], message);
                await actions.OfficialEmbeds.SendEmbedToChannel("🔇 **Mute por warns excessivos**\n<@" + member.id + "> foi mutado por `30 minutos` por ter 3 warns.", message.channel);
            } else if (presentWarns == 4) {
                actions.Mute.MutePerson([member.id, "1H", "4", "warns", "não", "expirados."], message);
                await actions.OfficialEmbeds.SendEmbedToChannel("🔇 **Mute por warns excessivos**\n<@" + member.id + "> foi mutado por `1 hora` por ter 4 warns.", message.channel);
            } else if (presentWarns >= 5) {
                actions.Mute.MutePerson([member.id, "5H", "" + presentWarns, "warns", "não", "expirados."], message);
                await actions.OfficialEmbeds.SendEmbedToChannel("🔇 **Mute por warns excessivos**\n<@" + member.id + "> foi mutado por `5 horas` por ter " + presentWarns + " warns.", message.channel);
            }

            //Writing to file.
            fs.writeFileSync(pathToTracker, JSON.stringify(tracker));
            //Embed feedback.
            await actions.OfficialEmbeds.SendEmbedToChannel("⚠️ **Aviso!**\n<@" + member.id + "> recebeu um warn de um moderador. É melhor parar com isso aí...", message.channel);

        } catch (e) {
            actions.OfficialEmbeds.SendDefaultLog("⛔ **Erro**\nOcorreu algo errado ao adicionar um warn para <@" + member.id + ">:\n\n`" + e + "`", "Geral", true);
        }
    }
};