const cron = require("node-cron");
const landItem = require('../containers/lands/services/items');
// const rps = require('../containers/events/services');
// const connectedUser = require('../helpers/socket').connectedUser;

module.exports = function (io) {
    cron.schedule("1 0 * * *", function ()
    {
        landItem.harvestItemsSchedule();
    });
    // cron.schedule("11 * * * *", function ()
    // {
    //     rps.initial().then(result => {
    //         let winner = result.winner;
    //         let rpsHistory = result.rpsHistory;
    //         // if winner exist and at least 1 user online
    //         if (winner && connectedUser.getUsers().length > 0)
    //         {
    //             let clientsId = connectedUser.getUserClientsId(winner.userName);
    //             //filter clients with account is Winner
    //             let uniqueClientsId = [...new Set(clientsId)];

    //             uniqueClientsId.forEach((clientID) => {
    //                 io.to(clientID).emit('EVENT_WINNER', winner.userName);
    //             })
    //         }
    //         io.emit("EVENT_HISTORY", rpsHistory);
    //         io.emit('EVENT_INITIAL');
    //     });
    // });
};