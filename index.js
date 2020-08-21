//Starts Discord with the desired dependencies for reactions and messages.
const Discord = require('discord.js');
const client = new Discord.Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

//Main dependencies.
var JSONs = require('./JSONs');
const actions = require('./actions');
const separators = require('./separators');

//Runs once when the bot starts.
client.once('ready', async function () {
    //Console feedback.
    console.log('Tem um comunista na área.');

    //Constructs and stores data for all dev logging channels.
    await actions.OfficialEmbeds.Construct(client);

    //Discord inside feedback.
    actions.OfficialEmbeds.SendDefaultLog("⚒️ **Tudo pronto**\nO bot foi iniciado com sucesso.");

    //Defines a timeout of 1 minute to check for people with expired mute timers.
    setInterval(function () {
        actions.Mute.CheckForUnmutes(client);
    }, 1 * 60000);
});

//Runs everytime someone sends a message on any channel.
client.on('message', message => {
    //Calls the message handler that bridges to other functions.
    separators.MessageHandler.HandleMessage(message);
});

//Runs everytime someone enters the server.
client.on('guildMemberAdd', async function (member) {

    //Adding automatic roles.
    try {
        //Ranking.
        await member.roles.add("740243835485159475").then(function () {
            actions.OfficialEmbeds.SendRoleAddLog(member.id, "740243835485159475");
        });

        //Lives.
        await member.roles.add("740258422699851878").then(function () {
            actions.OfficialEmbeds.SendRoleAddLog(member.id, "740258422699851878");
        });

        //Videos. 
        await member.roles.add("740258424738152588").then(function () {
            actions.OfficialEmbeds.SendRoleAddLog(member.id, "740258424738152588");
        });

        //Novidades. 
        await member.roles.add("740258426399227944").then(function () {
            actions.OfficialEmbeds.SendRoleAddLog(member.id, "740258426399227944");
        });

        //Documentação. 
        await member.roles.add("740257718916612242").then(function () {
            actions.OfficialEmbeds.SendRoleAddLog(member.id, "740257718916612242");
        });

    } catch (e) {
        actions.OfficialEmbeds.SendDefaultLog("⛔ **Erro**\nOcorreu algo errado ao adicionar uma nova role para <@" + member.id + ">:\n\n`" + e + "`", "Roles", true);
    }
});

//Logins with the bot token.
client.login(JSONs.Configs.token);
