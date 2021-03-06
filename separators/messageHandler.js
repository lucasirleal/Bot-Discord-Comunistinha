//Main dependencies.
const actions = require('../actions')
const fs = require('fs');
//JSON paths.
const path = require('path');
const pathToConfigs = path.resolve(__dirname, '../JSONs/configs.json');

module.exports = {
    //Calls a function to every available command.
    HandleMessage: async function (message) {
        //JSON objects.
        configs = JSON.parse(fs.readFileSync(pathToConfigs).toString());
        //Loads in the selected prefix for the bot.
        var prefix = configs.prefix;

        //Accounting for gained XP.
        if (!message.author.bot) {
            await actions.Level.HandleXP(message);
        }

        //If the message given doesn't start with the prefix, we just ignore it.
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        //Splits all the message content and make it lower case.
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
        //Checking for permissions.
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            if (command != "regras" && command != "faq" && command != "dicas" && command != "rank" && command != "top") {
                actions.OfficialEmbeds.SendEmbedToChannel("⛔ **Ops...**\nAqui é comunismo mas isso você não pode fazer.", message.channel);
                return;
            }
        }

        switch (command) {
            case "purge":
                //Deletes messages in bulk (not older than 14 days).
                actions.Purge.PurgeMessages(args, message);
                break;
            case "mute":
                //Mutes a person.
                actions.Mute.MutePerson(args, message);
                break;
            case "unmute":
                //Forcefully unmuted someone.
                actions.Mute.ForceUnmute(args, message);
                break;
            case "embed":
                //Creates a realtime embed.
                actions.Embed.SendEmbed(args, message);
                break;
            case "kick":
                //Kicks someone from the server.
                actions.Kick.KickPerson(args, message);
                break;
            case "ban":
                //Bans someone from the server.
                actions.Ban.BanPerson(args, message);
                break;
            case "warn":
                //Warns someone and mutes them if enough warns are present.
                actions.Warn.WarnPerson(args, message);
                break;
            case "regras":
                //Shows a pre-set embed with the rules of the server.
                actions.OfficialEmbeds.SendRegras(message);
                break;
            case "faq":
                //Shows an interactive embed with frequent asked questions.
                actions.FAQ.FAQ_Construct(message);
                break;
            case "dicas":
                //Shows an interactive embed with dicas.
                actions.Dicas.Dicas_Construct(message);
                break;
            case "rank":
                //Shows the player rank.
                actions.Level.Rank(args, message);
                break;
            case "top":
                //Shows the highest ranked people.
                actions.Level.Top(message);
                break;
            default:
                //Unkown commands.
                actions.OfficialEmbeds.SendEmbedToChannel("❓ **Hmm...**\nAcho que esse comando não existe. Ou você ficou dislexo(a).", message.channel);
                break;
        }
    }
};