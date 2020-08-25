//Main dependencies.
const actions = require("../actions");
const fs = require('fs');
//JSON paths.
const path = require('path');
const pathToTracker = path.resolve(__dirname, '../JSONs/levelTracker.json');

module.exports = {

    //Accounts for newly aquired XP.
    HandleXP: async function (message) {
        //JSON objects.
        var tracker = JSON.parse(fs.readFileSync(pathToTracker).toString());

        //Checking for already existing keys.
        if (!tracker.hasOwnProperty(message.author.id)) {
            var newData = [{}]
            tracker["" + message.author.id].push({ "xp": 0 });
            tracker["" + message.author.id].push({ "level": 0 });
        }

        //Writing to file.
        fs.writeFileSync(pathToTracker, JSON.stringify(tracker));
    }
};