const notifyService = require('./../../containers/notifies/services');
const inventoryItemService = require('./../../containers/inventories/services/items');
const inventoryCharacterService = require('./../../containers/inventories/services/characters')
const landItemService = require('./../../containers/lands/services/items')
const { createPercentArray, shuffle, random } = require('../randomFunction');
const TIME_OUT = 600; //seconds //600 seconds = 10 minutes
const TIME_OUT_SOCKET_NPC = TIME_OUT * 1000;

let GIFTS = [
    {
        "name": "냄새나는 변",
        "typeCode": "smell",
        "description": "씨앗이 잘자랄 수 있도록 도움을 준다.나무까지 되는 시간이 짧아질 수도...",
        "image": "smell.svg",
        "price": 20,
        "type": "forTree",
    },
    {
        "name": "쑥쑥 영양제",
        "typeCode": "nutritional-supplements",
        "description": "씨앗이 잘자랄 수 있도록 도움을 준다.나무까지 되는 시간이 짧아질 수도...",
        "image": "nutritional-supplements.svg",
        "price": 25,
        "type": "forTree",
    },
    {
        "name": "없애버려 삽",
        "typeCode": "shovel",
        "description": "기본으로 제공되는 블러드 나무를제거 할 수 있다.",
        "image": "shovel.svg",
        "price": 50,
        "type": "remove",
    }
]

async function randomGift(user, arrGift) {
    if (random(0, 1) === 0) {
        return {
            receiveGift: false,
            message: "다음 번에 행운을 빈다."
        }
    }
    let iGift = random(0, arrGift.length - 1);
    console.log(iGift);
    let gift = arrGift[iGift];
    gift.userId = user._id;
    if (!gift.image) { //gift is Blood
        //transferblood to user
    }
    //send gift to database
    let addItem = await inventoryItemService.add({ user, items: [gift] });

    if (addItem) {
        return {
            receiveGift: true,
            message: `Santa NPC로부터 ${gift.name}을 받았습니다.`,
            gift: gift,
        }
    }
}

module.exports = function (io, socket) {
    socket.on('TAKE_GIFT_FROM_SANTA_NPC', async (socketData) => {
        console.log('TAKE_GIFT_FROM_SANTA_NPC ', socketData);
        const { socketId, user } = socketData;
        const userId = user._id;
        let arrPm = await Promise.all([getAwait('santaNPC'), getAwait('userCollectSantaGift')]);
        if (arrPm[0] && arrPm[1]) {
            if (arrPm[1].some(coll => coll === userId)) {
                console.log("nothing");
            } else {
                let arrCollect = arrPm[1];
                arrCollect.push(userId);
                setRedis('userCollectSantaGift', arrCollect);
                console.log("receive gift ", await getAwait('userCollectSantaGift'));
                let objGift = await randomGift(user, GIFTS);
                //console.log('objGift ', objGift);
                notifyService.send({
                    userId: userId,
                    title: 'Santa NPC로부터 선물을 받았습니다.',
                    content: objGift.message,
                    type: 'santaGift',
                });
                io.to(socketId).emit('RES_TAKE_GIFT_FROM_SANTA_NPC', objGift);

                if (objGift.receiveGift) {
                    io.to(socketId).emit('RES_NPC_SANTA_IN_MAP', null);
                } else {
                    setTimeout(function () {
                        io.to(socketId).emit('RES_NPC_SANTA_IN_MAP', null);
                    }, 3000);
                }
            }
        }
    });

    socket.on('SET_NPC_SANTA_IN_MAP', async (socketData) => {
        //console.log('SET_NPC_SANTA_IN_MAP ', socketData);
        const { socketId, dataSetNPC } = socketData;
        const isExist = await checkExist('santaNPC');
        if (isExist) { //exist
            let npcLocation = await getAwait('santaNPC');
            console.log('isExist ', npcLocation);
            io.emit('RES_NPC_SANTA_IN_MAP', npcLocation);
        } else {
            console.log('setsantaNPC');
            //set
            setRedis('santaNPC', dataSetNPC);
            setRedis('userCollectSantaGift', []);

            //clear santa after 10 minutes
            setExpire('santaNPC', TIME_OUT);
            setExpire('userCollectSantaGift', TIME_OUT);
            setTimeout(function () {
                io.emit('RES_NPC_SANTA_IN_MAP', null);
            }, TIME_OUT_SOCKET_NPC);
            //send data santa
            io.emit('RES_NPC_SANTA_IN_MAP', dataSetNPC);
        }
    });

    socket.on('GET_NPC_SANTA_IN_MAP', async (socketData) => {
        //console.log('GET_NPC_SANTA_IN_MAP ', socketData);
        const { socketId, userId } = socketData;
        let arrPm = await Promise.all([getAwait('santaNPC'), getAwait('userCollectSantaGift')]);
        if (arrPm[0] && arrPm[1]) {
            // /let k = getAwait('userCollectSantaGift')];
            //console.log('arrPm[1] ', arrPm[1])
            if (arrPm[1].some(coll => coll === userId)) {
                console.log("hide santa");
            } else {
                console.log("show santa");
                //console.log(await getAwait('santaNPC'));
                const npcLocation = await getAwait('santaNPC');
                io.to(socketId).emit('RES_NPC_SANTA_IN_MAP', npcLocation);
            }
        }
    });

    socket.on('MOVE_CHARACTER_TO_MAP', async (socketData) => {
        const { param, socketId } = socketData;
        let data = await inventoryCharacterService.moveToMap(param);

        let { InventoryCharacter, LandGameCharacter } = data;

        let LandGameCharacterRs = LandGameCharacter.filter(elm => param.characters.find(c => c.quadKey === elm.quadKey));

        let result = {
            InventoryCharacter: InventoryCharacter,
            LandGameCharacter: LandGameCharacterRs,
            socketId: socketId
        }
        io.emit('RES_MOVE_CHARACTER_TO_MAP', result);
    })

    socket.on('USE_ITEM', async (socketData) => {
        const { param, socketId } = socketData;
        const userId = param.items[0].userId;
        let LandCharacters = await landItemService.useItem(param);
        let InventoryItems = await inventoryItemService.get({ userId });

        let result = {
            LandCharacters: LandCharacters,
            InventoryItems: InventoryItems,
            socketId: socketId,
            type: param.type
        }
        io.emit('RES_USE_ITEM', result);
    })

    socket.on('HARVEST_ITEM',async (socketData) => {
        let result = {
            socketId: socketData.socketId,
            LandCharacters: socketData.param
        }
        io.emit('RES_HARVEST_ITEM', result);
    })
};
