//Main dependencies.
const actions = require("../actions");

module.exports = {

    //Bans someone for the desired time.
    BanPerson: async function (args, message) {
        //Checks for valid argumentation.
        if (!args.length || args.length < 3) {
            return actions.OfficialEmbeds.SendEmbedToChannel("⛔ **Argumentos inválidos**\nComando certo: `/ban {Pessoa} {Tempo em Dias} {Motivo}`.", message.channel);
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

        //Getting the timer argument.
        var timer = parseInt(args[1].replace(/\D/g, ""));

        if (timer < 1) {
            return actions.OfficialEmbeds.SendEmbedToChannel("⛔ **Tempo inválido**\nO tempo deve ser um número válido maior ou igual à 1. (Quantidade em dias)", message.channel);
        }

        //Getting the reason text.
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

        //Tries to ban the person marked.
        member.ban({
                days: timer,
                reason: reasonText
            })
            .then(() => {
                actions.OfficialEmbeds.SendDefaultLog("🛑 **Membro banido**\n<@" + member.id + "> foi banido por `" + timer + " dias` pelo seguinte motivo:\n\n> " + reasonText + "\n[Mensagem original](" + message.url + ")", "Geral", false, "", "Origem:  " + message.author.username + "", message.author.displayAvatarURL());
            })
            .catch(err => {
                actions.OfficialEmbeds.SendDefaultLog("⛔ **Erro**\nOcorreu algo errado ao banir <@" + member.id + ">:\n\n`" + err + "`", "Geral", true);
            });
    }
};