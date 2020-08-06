//Main dependencies.
const actions = require("../actions");
const fs = require('fs');

module.exports = {

    //Purge messages in bulk.
    PurgeMessages: async function (args, message) {
        //Checks for valid arguments.
        if (!args.length || args.length != 1) {
            actions.OfficialEmbeds.SendEmbedToChannel("❌ Argumento inválido.\nVocê precisa digitar um limite de mensagens para dar purge.", message.channel);
            return;
        }

        //The discord API only allows up to 100 messages to be deleted in bulk.
        var purgeAmount = parseInt(args[0]);
        if (purgeAmount < 1 || purgeAmount > 100 || !purgeAmount) {
            actions.OfficialEmbeds.SendEmbedToChannel("❌ Argumento inválido.\nVocê pode dar purge de 1 à 100 mensagens.", message.channel);
            return;
        }

        //Tries to fetch all desired messages.
        message.channel
            .messages.fetch({
                limit: purgeAmount
            })
            .then(async function (messages) {

                //Creating a physical log of the messages.
                var logText = "";
                var logTitle = ("log - " + new Date().toLocaleString()).replace(/:/g, "-") + ".txt";
                var messagesArray = Array.from(messages.values());

                for (i = 0; i < messagesArray.length; i++) {
                    logText += "Mensagem de [" + messagesArray[i].author.username + " (" + messagesArray[i].author.id + ")] (" + messagesArray[i].id + ")\n" + messagesArray[i].content + "\nEnviado em: " + new Date(messagesArray[i].createdTimestamp) + "\n\n";
                }

                //Writing the file and returning as an attachment.
                fs.writeFile(__dirname + "/../purgeLogs/" + logTitle, logText, 'utf8', function (err) {
                    if (err) {
                        return actions.OfficialEmbeds.SendDefaultLog("❌ Erro ao criar o log com mensagens deletadas.\n" + err, "Message", true);
                    }
                    message.channel.bulkDelete(messages)
                    .then(function () {
                        actions.OfficialEmbeds.SendDefaultLog("🗄️ Mensagens deletadas em: " + new Date().toLocaleString(), "Message", false, __dirname + "/../purgeLogs/" + logTitle);
                    }).catch(err => {
                        actions.OfficialEmbeds.SendDefaultLog("❌** Erro ao deletar mensagens com */purge* **\n`" + err + "`", "Message");
                    });
                });
            })
            .catch(err => {
                actions.OfficialEmbeds.SendDefaultLog("❌ **Erro ao deletar mensagens com */purge* **\n`" + err + "`", "Message");
            });
    }
};
