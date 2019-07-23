const landService = require('./../../containers/lands/services');
const groupLandService = require('./../../containers/lands/services/groups');
// const notifyService = require('./../../containers/notifies/services');
// const kue = require( 'kue' );
//const queue = kue.createQueue({ jobEvents: false });
const landCharacterService = require('./../../containers/lands/services/characters');
const itemInventorySevice = require('../../containers/inventories/services/items');
const { receiveRandomBoxGift } = require('../randomFunction');
const groupBy = require('lodash.groupby');

module.exports = function(io,socket){


    socket.on('GET_ALL_LAND_SOCKET', (data) => {
        const { socketId, userId } = data;
        landService.getAllLand()
            .then(lands => {
                io.to(socketId).emit('RES_GET_ALL_LAND_SOCKET', { lands, socketId, userId });
            })
    });

    //===================================================END SOCKET EDIT============================================================
    // function runJob(job, done){
    //     //console.log('runJob ', job)
    //     switch (job.data.jobType) {
    //         case 'BuyCharacterItemInShop':
    //             buyCharacterItemInShopJob(job, done);
    //             break;
    //         case 'TransferBloodSocket':
    //             transferBloodJob(job, done);
    //             break;
    //         // case 'BuyLandOnline':
    //         //     transferBloodTradingLandJob(job, done);
    //         //     break;
    //         default:
    //             done();
    //             break;
    //     }
    // }

    // async function transferBloodJob(job, done) {
    //     const { dataTransfer, socketId } = job.data;
    //     tradeService.transferBlood(dataTransfer)
    //         .then(async resTransfer => {
    //             console.log('transferBloodJob resTransfer', resTransfer);
    //             if(resTransfer && resTransfer.status){
    //                 await notifyService.send({
    //                     userId: dataTransfer.userId,
    //                     title: 'Blood을 성공적으로 전송',
    //                     content: `성공적으로 ${ dataTransfer.receiver } 용 Blood ${ dataTransfer.amount } 개를 전송했습니다.`,
    //                     type: 'lands'
    //                 });
    //             } else {
    //                 await notifyService.send({
    //                     userId: dataTransfer.userId,
    //                     title: 'Blood을 보내지 못했습니다 !!!',
    //                     content: `성공적으로 ${ dataTransfer.receiver } 용 Blood ${ dataTransfer.amount } 개를 전송했습니다.`,
    //                     type: 'lands'
    //                 });
    //             }
    //             done();
    //         })
    //         .catch(async err => {
    //             console.log('transferBloodJob err', err);
    //             //io.to(socketId).emit('RES_TRANSFER_BLOOD_SOCKET', { socketId, success: false });
    //             await notifyService.send({
    //                 userId: dataTransfer.userId,
    //                 title: 'Blood을 보내지 못했습니다 !!!',
    //                 content: `성공적으로 ${ dataTransfer.receiver } 용 Blood ${ dataTransfer.amount } 개를 전송했습니다.`,
    //                 type: 'lands'
    //             });
    //             done();
    //         });
    // }

    // async function purchaseLandJob(job, done) {
    //     const { socketId, land } = job.data;
    //     console.log('purchaseLandJob ', land);
    //     //console.log('land ', land);
    //     landService.purchaseLand(land)
    //         .then(async resPurchase => {
    //             //console.log('clearWaitingQuadKeys ', land.quadKeys);
    //             io.emit('RES_PURCHASE_LAND_SOCKET', { socketId, clearWaitingQuadKeys: land.quadKeys, ...resPurchase });
    //             if(land.userRole === 'user'){
    //                 await addFreeTree(land);
    //             }
    //             done();
    //         })
    //         .catch(err => {
    //             console.log(err);
    //             io.emit('RES_PURCHASE_LAND_SOCKET', { socketId, clearWaitingQuadKeys: land.quadKeys, success: false });
    //             done();
    //         });
    // }

    //add free tree
    // async function addFreeTree(land){
    //     let items = land.quadKeys.map(objQK => {
    //         let newBonusTree = {
    //             "name": "Tree",
    //             "typeCode": "tree",
    //             "description": "Garbage New Land",
    //             "image" : "tree.svg",
    //             "type":"garbage"
    //         };
    //         newBonusTree.userId = land.userId;
    //         newBonusTree.quadKey = objQK.quadKey;
    //         //console.log('newBonusTree ', newBonusTree);
    //         return newBonusTree;
    //     });
    //     const allCharacter = await landCharacterService.addCharacter(items);
    //     return allCharacter.filter(tree => land.quadKeys.find(objQk => objQk.quadKey === tree.quadKey));
    // }

    //add free box
    //land = { userId: '5c52ddb14e21d122807ff8b3', quadKeys: [ { quadKey: '132110320120112202000202' } ] }
    async function addFreeBox(land){
        // //console.log('land ', land)
        let items = land.quadKeys.map(objQK => receiveRandomBoxGift());
        let grpValBox = Object.values(groupBy(items, 'typeCode'));
        //console.log('grpValBox ', grpValBox);
        items = grpValBox.reduce((arr, items) => {
            //console.log("================================item======================================= ", items);
            let newItem = items[0];
            newItem.amount = items.length;
            arr.push(newItem);
            // console.log('item ', item)
            return arr;
        }, []);
        await itemInventorySevice.add({ user: { _id: land.userId }, items: items });
    }
};
