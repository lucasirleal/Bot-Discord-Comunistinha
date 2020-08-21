//Main dependencies.
const actions = require('../actions')
const fs = require('fs');
//JSON paths.
const path = require('path');
const pathToConfigs = path.resolve(__dirname, '../JSONs/configs.json');

module.exports = {
    //Handles reaction adding.
    HandleReactionADD: async function (reaction, user) {
        //Gender options on REGISTER.
        if (reaction.message.id == 740238560980107366) {
            //Ela.
            if (reaction.emoji.name == "🧜‍♀️") {
                try {
                    await RemoveRole(reaction, user, 740257883387855002); //Ele.
                    await RemoveRole(reaction, user, 740257895504937050); //Elu.
                    await AddRole(reaction, user, 740257889565802557); //Ela.
                } catch (e) {
                    actions.OfficialEmbeds.SendDefaultLog("⛔ **Erro**\nOcorreu algo errado ao tratar roles do registro.\n\n`" + e + "`", "Roles", true);
                }
            }
            //Ele.
            else if (reaction.emoji.name == "🧜‍♂️") {
                try {
                    await AddRole(reaction, user, 740257883387855002); //Ele.
                    await RemoveRole(reaction, user, 740257895504937050); //Elu.
                    await RemoveRole(reaction, user, 740257889565802557); //Ela.
                } catch (e) {
                    actions.OfficialEmbeds.SendDefaultLog("⛔ **Erro**\nOcorreu algo errado ao tratar roles do registro.\n\n`" + e + "`", "Roles", true);
                }
            }
            //Elu.
            else if (reaction.emoji.name == "🐙") {
                try {
                    await RemoveRole(reaction, user, 740257883387855002); //Ele.
                    await AddRole(reaction, user, 740257895504937050); //Elu.
                    await RemoveRole(reaction, user, 740257889565802557); //Ela.
                } catch (e) {
                    actions.OfficialEmbeds.SendDefaultLog("⛔ **Erro**\nOcorreu algo errado ao tratar roles do registro.\n\n`" + e + "`", "Roles", true);
                }
            }
        }
        //Age options on REGISTER.
        else if (reaction.message.id == 740238826764501033) {
            //-18.
            if (reaction.emoji.name == "🔞") {
                try {
                    await RemoveRole(reaction, user, 740258000865984662); //+18.
                    await AddRole(reaction, user, 740258054192234647); //-18.
                } catch (e) {
                    actions.OfficialEmbeds.SendDefaultLog("⛔ **Erro**\nOcorreu algo errado ao tratar roles do registro.\n\n`" + e + "`", "Roles", true);
                }
            }
            //+18.
            else if (reaction.emoji.name == "🔥") {
                try {
                    await AddRole(reaction, user, 740258000865984662); //+18.
                    await RemoveRole(reaction, user, 740258054192234647); //-18.
                } catch (e) {
                    actions.OfficialEmbeds.SendDefaultLog("⛔ **Erro**\nOcorreu algo errado ao tratar roles do registro.\n\n`" + e + "`", "Roles", true);
                }
            }
        }
        //Notification options on REGISTER. This will only add the roles. Removing them is handled by the reaction REMOVE.
        else if (reaction.message.id == 740239204260380778) {
            //Vídeos.
            if (reaction.emoji.name == "🎥") {
                try {
                    await AddRole(reaction, user, 740258424738152588);
                } catch (e) {
                    actions.OfficialEmbeds.SendDefaultLog("⛔ **Erro**\nOcorreu algo errado ao tratar roles do registro.\n\n`" + e + "`", "Roles", true);
                }
            }
            //Lives.
            else if (reaction.emoji.name == "📳") {
                try {
                    await AddRole(reaction, user, 740258422699851878);
                } catch (e) {
                    actions.OfficialEmbeds.SendDefaultLog("⛔ **Erro**\nOcorreu algo errado ao tratar roles do registro.\n\n`" + e + "`", "Roles", true);
                }
            }
            //Novidades.
            else if (reaction.emoji.name == "📢") {
                try {
                    await AddRole(reaction, user, 740258426399227944);
                } catch (e) {
                    actions.OfficialEmbeds.SendDefaultLog("⛔ **Erro**\nOcorreu algo errado ao tratar roles do registro.\n\n`" + e + "`", "Roles", true);
                }
            }
        }
    },

    //Handles reaction removing.
    HandleReactionREMOVE: async function (reaction, user) {
        //Notification options on REGISTER. This will only remove the roles. Adding them is handled by the reaction ADD.
        if (reaction.message.id == 740239204260380778) {
            //Vídeos.
            if (reaction.emoji.name == "🎥") {
                try {
                    await RemoveRole(reaction, user, 740258424738152588);
                } catch (e) {
                    actions.OfficialEmbeds.SendDefaultLog("⛔ **Erro**\nOcorreu algo errado ao tratar roles do registro.\n\n`" + e + "`", "Roles", true);
                }
            }
            //Lives.
            else if (reaction.emoji.name == "📳") {
                try {
                    await RemoveRole(reaction, user, 740258422699851878);
                } catch (e) {
                    actions.OfficialEmbeds.SendDefaultLog("⛔ **Erro**\nOcorreu algo errado ao tratar roles do registro.\n\n`" + e + "`", "Roles", true);
                }
            }
            //Novidades.
            else if (reaction.emoji.name == "📢") {
                try {
                    await RemoveRole(reaction, user, 740258426399227944);
                } catch (e) {
                    actions.OfficialEmbeds.SendDefaultLog("⛔ **Erro**\nOcorreu algo errado ao tratar roles do registro.\n\n`" + e + "`", "Roles", true);
                }
            }
        }
    },
};

//Add a role if the user don't already have it.
async function AddRole(reaction, user, roleID) {
    //First we need to get the desired user.
    let member = await reaction.message.guild.members.fetch(user.id);
    //Then we get the role ID.
    let role = reaction.message.guild.roles.cache.find(role => role.id == roleID);

    //If the user don't have the role, we add it.
    if (!member.roles.cache.has(role.id))
    {
        await member.roles.add(role).catch(console.error);
        actions.OfficialEmbeds.SendRoleAddLog(member.id, role.id);
    }
}

//Removes a role from a user.
async function RemoveRole(reaction, user, roleID) {
    //First we need to get the desired user.
    let member = await reaction.message.guild.members.fetch(user.id);
    //Then we get the role ID.
    let role = reaction.message.guild.roles.cache.find(role => role.id == roleID);

    //If the user don't have the role, we add it.
    if (member.roles.cache.has(role.id))
    {
        await member.roles.remove(role).catch(console.error);
        actions.OfficialEmbeds.SendRoleDeleteLog(member.id, role.id);
    }
}