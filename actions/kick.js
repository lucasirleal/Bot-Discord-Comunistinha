//Main dependencies.
const actions = require("../actions");

module.exports = {

    //Kicks someone from the server.
    KickPerson: async function (args, message) {
        //Checks for valid argumentation.
        if (!args.length || args.length < 2) {
            return actions.OfficialEmbeds.SendEmbedToChannel("⛔ **Argumentos inválidos**\nComando certo: `/kick {Pessoa} {Motivo}`.", message.channel);
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
            return actions.OfficialEmbeds.SendEmbedToChannel("⛔ **Argumentos inválidos**\nVocê pode usar o ID ou marcar a pessoa desejada.", message.channel);
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
            return actions.OfficialEmbeds.SendEmbedToChannel("⛔ **Argumentos inválidos**\nVocê precisa digiar um motivo.", message.channel);
        }

        //Tries to kick the person.
        try {
            member.kick(reasonText).then(async function () {
                actions.OfficialEmbeds.SendDefaultLog("🚫 **Membro kickado**\n<@" + member.id + "> foi kickado pelo seguinte motivo:\n\n> " + reasonText + "\n[Mensagem original](" + message.url + ")", "Geral", false, "", "Origem:  " + message.author.username + "", message.author.displayAvatarURL());
            });
        } catch (e) {
            actions.OfficialEmbeds.SendDefaultLog("⛔ **Erro**\nOcorreu algo errado ao kickas <@" + member.id + ">:\n\n`" + e + "`", "Geral", true);
        }
    }
};