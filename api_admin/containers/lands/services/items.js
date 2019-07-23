const db = require('../../../helpers/db');
const Character = db.Character;
const LandCharacter = db.LandCharacter;
const LandItem = db.LandItem;
const UserHarvest = db.UserHarvest;
const InventoryItem = db.InventoryItem;
const ObjectId = require('mongoose').Types.ObjectId;
const isNull = require('lodash.isnull');
const isUndefined = require('lodash.isundefined');
const itemInventoryService = require('../../inventories/services/items');
const characterInventoryService = require('../../inventories/services/characters');
const { receiveGiftFromBox } = require('../../../helpers/randomFunction');
const groupBy = require('lodash.groupby');
const notifyService = require('../../../containers/notifies/services');


function createUniqueArr(keyName, array) {
    var ages = array.map(function (obj) { return obj[keyName].toString(); });
    //     ages = ages.filter(function(v,i) { return ages.indexOf(v) == i; });
    //     var unique = {};
    //     var distinct = [];
    //     for (var i in array) {
    //         if (typeof (unique[array[i][keyName]]) == "undefined") {
    //             distinct.push(array[i][keyName]);
    //         }
    //         unique[array[i][keyName]] = array[i][keyValue];
    //     }
    //     return unique;
    ages = ages.filter(function (v, i) { return ages.indexOf(v) == i; });
    return ages;
}

module.exports = {
    get,
    addItem,
    getItemByUser,
    moveItem,
    moveItemToInventory,
    transformItem,
    useItem,
    useGift,
    harvestItems,
    harvestItemsSchedule
};

async function get() {
    let characters = await LandCharacter.find();
    let items = await LandItem.find();
    return {
        characters,
        items
    }
}

async function addItem(param) {
    for (let eachLandItem of param) {
        const checkedLandItem = await LandItem.findOne({
            "userId": ObjectId(param.userId),
            "typeCode": param.typeCode,
            "quadKey": param.quadKey
        });
        if (isNull(checkedLandItem)) {
            const landItem = new LandItem();
            landItem.name = typeof eachLandItem.name !== 'undefined' && !isNull(eachLandItem.name) ? eachLandItem.name : '';
            landItem.userId = ObjectId(eachLandItem.userId);
            landItem.typeCode = eachLandItem.typeCode;
            landItem.quadKey = eachLandItem.quadKey;
            landItem.image = eachLandItem.image;
            landItem.description = eachLandItem.description;
            landItem.transformPeriod = typeof eachLandItem.transformPeriod !== 'undefined' && !isNull(eachLandItem.transformPeriod) ? eachLandItem.transformPeriod : 0;
            landItem.transformToTypeCode = typeof eachLandItem.transformToTypeCode !== 'undefined' && !isNull(eachLandItem.transformToTypeCode) ? eachLandItem.transformToTypeCode : '';
            landItem.profit = typeof eachLandItem.profit !== 'undefined' && !isNull(eachLandItem.profit) ? eachLandItem.profit : 0;
            landItem.price = typeof eachLandItem.price !== 'undefined' && !isNull(eachLandItem.price) ? eachLandItem.price : 0;
            landItem.type = typeof eachLandItem.type !== 'undefined' && !isNull(eachLandItem.type) ? eachLandItem.type : '';
            await landItem.save();
        } else {
            await LandItem.findOneAndUpdate({
                "userId": ObjectId(param.userId),
                "typeCode": param.typeCode,
                "quadKey": param.quadKey
            },
                {
                    $set: {
                        "name": typeof eachLandItem.name !== 'undefined' && !isNull(eachLandItem.name) ? eachLandItem.name : '',
                        "quadKey": typeof eachLandItem.quadKey !== 'undefined' && !isNull(eachLandItem.quadKey) ? eachLandItem.quadKey : '',
                        "image": typeof eachLandItem.image !== 'undefined' && !isNull(eachLandItem.image) ? eachLandItem.image : '',
                        "description": typeof eachLandItem.description !== 'undefined' && !isNull(eachLandItem.description) ? eachLandItem.description : '',
                        "transformPeriod": typeof eachLandItem.transformPeriod !== 'undefined' && !isNull(eachLandItem.transformPeriod) ? eachLandItem.transformPeriod : 0,
                        "transformToTypeCode": typeof eachLandItem.transformToTypeCode !== 'undefined' && !isNull(eachLandItem.transformToTypeCode) ? eachLandItem.transformToTypeCode : '',
                        "profit": typeof eachLandItem.profit !== 'undefined' && !isNull(eachLandItem.profit) ? eachLandItem.profit : 0,
                        "price": typeof eachLandItem.price !== 'undefined' && !isNull(eachLandItem.price) ? eachLandItem.price : 0,
                        "type": typeof eachLandItem.type !== 'undefined' && !isNull(eachLandItem.type) ? eachLandItem.type : '',
                    }
                });
        }
    }

    return await LandItem.find();
}

async function getItemByUser(param) {
    const allLand = await LandItem.find().lean();
    await LandItem.find({}, async (err, result) => {
        if (err) {
            throw new Error(err);
        }
    });

    const byUser = allLand.filter(ch => ch.userId.toString() === param.userId);
    return { items: allLand, itemsByUser: byUser }
}

async function moveItem(param) {
    await LandItem.findOneAndUpdate(
        { "userId": ObjectId(param.userId), "quadKey": param.oldQuadKey, "typeCode": param.typeCode },
        {
            "$set": {
                "quadKey": param.newQuadKey,
                "amount": (isUndefined(param.amount) ? 1 : param.amount)
            }
        }
    );
    return await getItemByUser({ "userId": param.userId });
}

//param: userId, quadKey itemId --> update items --> return items
async function moveItemToInventory(param) {
    let userId = param.userId;
    let items = param.items;

    let resizeItemAmount = [];
    for (let eachItem of items) {
        // await LandItem.findByIdAndRemove(ObjectId(eachItem._id));
        let amount = typeof eachItem.amount === 'undefined' ? 1 : eachItem.amount;

        let index = resizeItemAmount.findIndex(i => i.typeCode === eachItem.typeCode);
        if (index !== -1) {
            resizeItemAmount[index].amount += amount;
        } else {
            resizeItemAmount.push({ typeCode: eachItem.typeCode, amount });
        }

    }

    await InventoryItem.findOne({ "userId": ObjectId(userId) }, (err, result) => {
        for (let item of resizeItemAmount) {
            let isItemExist = result.items.findIndex(i => i.typeCode === item.typeCode);
            if (isItemExist !== -1) {
                result.items[isItemExist].amount += item.amount;
            } else {
                result.items.push(item);
            }
        }
        result.save();
    });

    const landItem = await getItemByUser({ "userId": param.userId });
    const inventoryItem = await InventoryItem.findOne({ "userId": param.userId }).lean().select('items');

    return {
        LandItem: landItem.items,
        InventoryItem: inventoryItem
    }
}

//check by param id => return new items redux
async function transformItem(param) {
    await LandCharacter.findOne({
        'userId': ObjectId(param.userId),
        'quadKey': param.quadKey,
        'typeCode': param.typeCode
    }, async (err, result) => {
        if (err) {
            throw new Error(err);
        } else {
            let createdDate = (result.createdDate);
            let now = (new Date().getTime());
            let timeFromCreateDate = now - createdDate; //millisecond
            timeFromCreateDate = Math.floor(timeFromCreateDate / 1000);

            let transformPeriod = parseInt(result.transformPeriod);
            if (timeFromCreateDate >= transformPeriod) {
                let timeLeft = timeFromCreateDate - transformPeriod;
                await LandCharacter.findOne({
                    'userId': ObjectId(result.userId),
                    'quadKey': result.quadKey,
                    'typeCode': result.typeCode
                }, async (otherErr, otherResult) => {
                    if (otherErr) {
                        throw new Error(otherErr);
                    } else {
                        const updatedCharacter = await Character.findOne({ 'typeCode': result.transformToTypeCode });
                        if (!isNull(updatedCharacter)) {
                            otherResult.name = typeof updatedCharacter.name !== 'undefined' && !isNull(updatedCharacter.name) ? updatedCharacter.name : '';
                            otherResult.typeCode = typeof updatedCharacter.typeCode !== 'undefined' && !isNull(updatedCharacter.typeCode) ? updatedCharacter.typeCode : '';
                            otherResult.description = typeof updatedCharacter.description !== 'undefined' && !isNull(updatedCharacter.description) ? updatedCharacter.description : '';
                            otherResult.transformPeriod = typeof updatedCharacter.transformPeriod !== 'undefined' && !isNull(updatedCharacter.transformPeriod) ? (updatedCharacter.transformPeriod - timeLeft) : 0;
                            otherResult.transformToTypeCode = typeof updatedCharacter.transformToTypeCode !== 'undefined' && !isNull(updatedCharacter.transformToTypeCode) ? updatedCharacter.transformToTypeCode : '';
                            otherResult.type = typeof updatedCharacter.type !== 'undefined' && !isNull(updatedCharacter.type) ? updatedCharacter.type : '';
                            otherResult.createdDate = new Date().getTime();
                            otherResult.save();
                        }
                    }
                });
            }
        }
    });

    return await LandCharacter.find();
}

async function useItem(param) {
    let usingAmount = (typeof param.usingAmount !== 'undefined' && param.usingAmount > 1) ? param.usingAmount : 1;
    let totalLength = (typeof param.items.length !== 'undefined' && param.items.length > 0) ? param.items.length : 0;
    if (totalLength > 0) {
        let useTimes = Math.ceil(usingAmount / totalLength);
        for (var index = 0; index < useTimes; index++) {
            for (let eachItem of param.items) {
                if (usingAmount === 0) break;
                if (eachItem.type === 'forTree') {
                    if (eachItem.typeCode === 'nutritional-supplements') {
                        if (param.items.length === 1) {
                            let limitUsing = await LandCharacter.findOne({
                                "userId": ObjectId(eachItem.userId),
                                "typeCode": eachItem.treeTypeCode,
                                "quadKey": eachItem.quadKey,
                                limitUseNutritional: { $gt: 0 }
                            });
                            if (isNull(limitUsing)) {
                                return { limited: '약물을 사용하기에는 너무 제한됨' };
                            }
                        }
                        let inventoryItem = await InventoryItem.findOne({
                            userId: ObjectId(eachItem.userId),
                            'items.typeCode': 'nutritional-supplements',
                            'items.type': 'forTree',
                            'items.amount': { $gt: 0 }
                        });
                        if (!isNull(inventoryItem)) {
                            let resultitems = inventoryItem.toObject().items;
                            let foundIndex = resultitems.findIndex(c => c.typeCode === 'nutritional-supplements');
                            if (foundIndex !== -1) resultitems[foundIndex].amount -= 1;
                            let filteritems = resultitems.filter(u => u.amount > 0);
                            inventoryItem.items = filteritems;
                            inventoryItem.save();
                        }

                        if (inventoryItem.items.length === 0) {
                            await InventoryItem.findOneAndRemove({ userId: ObjectId(eachItem.userId) });
                        }


                        let landItem = await LandCharacter.findOne({
                            "userId": ObjectId(eachItem.userId),
                            "typeCode": eachItem.treeTypeCode,
                            "quadKey": eachItem.quadKey,
                            limitUseNutritional: { $gt: 0 }
                        });
                        if (!isNull(landItem)) {
                            landItem.profit += 1;
                            landItem.limitUseNutritional -= 1;
                            landItem.save();
                        }
                    } else if (eachItem.typeCode === 'smell') {
                        if (param.items.length === 1) {
                            let limitUsing = await LandCharacter.findOne({
                                "userId": ObjectId(eachItem.userId),
                                "typeCode": eachItem.treeTypeCode,
                                "quadKey": eachItem.quadKey,
                                limitUseSmell: { $gt: 0 }
                            });
                            if (isNull(limitUsing)) {
                                return { limited: '비료 사용 제한 초과' };
                            }
                        }

                        let inventoryItem = await InventoryItem.findOne({
                            userId: ObjectId(eachItem.userId),
                            'items.typeCode': 'smell',
                            'items.type': 'forTree',
                            'items.amount': { $gt: 0 }
                        });
                        if (!isNull(inventoryItem)) {
                            let resultitems = inventoryItem.toObject().items;
                            let foundIndex = resultitems.findIndex(c => c.typeCode === 'smell');
                            if (foundIndex !== -1) resultitems[foundIndex].amount -= 1;
                            let filteritems = resultitems.filter(u => u.amount > 0);
                            inventoryItem.items = filteritems;
                            inventoryItem.save();
                        }
                        if (inventoryItem.items.length === 0) {
                            await InventoryItem.findOneAndRemove({ userId: ObjectId(eachItem.userId) });
                        }

                        await LandCharacter.findOne({
                            "userId": ObjectId(eachItem.userId),
                            "typeCode": eachItem.treeTypeCode,
                            "quadKey": eachItem.quadKey,
                            limitUseSmell: { $gt: 0 }
                        }, async (err, result) => {
                            if (err) {
                                throw new Error(err);
                            } else {
                                if (!isNull(result)) {
                                    result.transformPeriod -= 5 * 24 * 60 * 60;
                                    result.limitUseSmell -= 1;
                                    result.save();
                                }
                            }
                        });

                        let result = await LandCharacter.findOne({
                            "userId": ObjectId(eachItem.userId),
                            "typeCode": eachItem.treeTypeCode,
                            "quadKey": eachItem.quadKey
                        });
                        if (!isNull(result)) {
                            let createdDate = (result.createdDate);
                            let now = (new Date().getTime());
                            let timeFromCreateDate = now - createdDate; //millisecond
                            timeFromCreateDate = Math.floor(timeFromCreateDate / 1000);

                            let transformPeriod = parseInt(result.transformPeriod);
                            if (timeFromCreateDate >= transformPeriod) {
                                let timeLeft = timeFromCreateDate - transformPeriod;
                                let otherResult = await LandCharacter.findOne({
                                    'userId': ObjectId(result.userId),
                                    'quadKey': result.quadKey,
                                    'typeCode': result.typeCode
                                });

                                const updatedItem = await Character.findOne({ 'typeCode': result.transformToTypeCode });
                                if (!isNull(updatedItem)) {
                                    otherResult.name = typeof updatedItem.name !== 'undefined' && !isNull(updatedItem.name) ? updatedItem.name : '';
                                    otherResult.typeCode = typeof updatedItem.typeCode !== 'undefined' && !isNull(updatedItem.typeCode) ? updatedItem.typeCode : '';
                                    otherResult.description = typeof updatedItem.description !== 'undefined' && !isNull(updatedItem.description) ? updatedItem.description : '';
                                    otherResult.transformPeriod = typeof updatedItem.transformPeriod !== 'undefined' && !isNull(updatedItem.transformPeriod) ? (updatedItem.transformPeriod - timeLeft) : 0;
                                    otherResult.transformToTypeCode = typeof updatedItem.transformToTypeCode !== 'undefined' && !isNull(updatedItem.transformToTypeCode) ? updatedItem.transformToTypeCode : '';
                                    otherResult.type = typeof updatedItem.type !== 'undefined' && !isNull(updatedItem.type) ? updatedItem.type : '';
                                    otherResult.createdDate = new Date().getTime();
                                    await otherResult.save();
                                }
                            }
                        }
                    } else if (eachItem.typeCode === 'droplet') {
                        let inventoryItem = await InventoryItem.findOne({
                            userId: ObjectId(eachItem.userId),
                            'items.typeCode': 'droplet',
                            'items.type': 'forTree',
                            'items.amount': { $gt: 0 }
                        });
                        if (!isNull(inventoryItem)) {
                            let resultitems = inventoryItem.toObject().items;
                            let foundIndex = resultitems.findIndex(c => c.typeCode === 'droplet');
                            if (foundIndex !== -1) resultitems[foundIndex].amount -= 1;
                            let filteritems = resultitems.filter(u => u.amount > 0);
                            inventoryItem.items = filteritems;
                            inventoryItem.save();
                        }

                        if (inventoryItem.items.length === 0) {
                            await InventoryItem.findOneAndRemove({ userId: ObjectId(eachItem.userId) });
                        }

                        let landItem = await LandCharacter.findOne({
                            "userId": ObjectId(eachItem.userId),
                            "typeCode": eachItem.treeTypeCode,
                            "quadKey": eachItem.quadKey
                        });
                        if (!isNull(landItem)) {
                            let time = 10 * 24 * 60 * 60; //864000
                            landItem.waterPeriod = landItem.waterPeriod > time ? landItem.waterPeriod : time;
                            landItem.waterWarning = false;
                            landItem.createdDateWater = new Date().getTime();
                            await landItem.save();
                        }
                    } else if (eachItem.typeCode === 'water-spray') {
                        let inventoryItem = await InventoryItem.findOne({
                            userId: ObjectId(eachItem.userId),
                            'items.typeCode': 'water-spray',
                            'items.type': 'forTree',
                            'items.amount': { $gt: 0 }
                        });
                        if (!isNull(inventoryItem)) {
                            let resultitems = inventoryItem.toObject().items;
                            let foundIndex = resultitems.findIndex(c => c.typeCode === 'water-spray');
                            if (foundIndex !== -1) resultitems[foundIndex].amount -= 1;
                            let filteritems = resultitems.filter(u => u.amount > 0);
                            inventoryItem.items = filteritems;
                            inventoryItem.save();
                        }
                        if (inventoryItem.items.length === 0) {
                            await InventoryItem.findOneAndRemove({ userId: ObjectId(eachItem.userId) });
                        }

                        let landItem = await LandCharacter.findOne({
                            "userId": ObjectId(eachItem.userId),
                            "typeCode": eachItem.treeTypeCode,
                            "quadKey": eachItem.quadKey
                        });
                        if (!isNull(landItem)) {
                            let time = 3 * 30 * 24 * 60 * 60; //7776000
                            landItem.waterPeriod = landItem.waterPeriod > time ? landItem.waterPeriod : time;
                            landItem.createdDateWater = new Date().getTime();
                            landItem.waterWarning = false;
                            await landItem.save();
                        }
                    } else if (eachItem.typeCode === 'water-bucket') {
                        let inventoryItem = await InventoryItem.findOne({
                            userId: ObjectId(eachItem.userId),
                            'items.typeCode': 'water-bucket',
                            'items.type': 'forTree',
                            'items.amount': { $gt: 0 }
                        });
                        if (!isNull(inventoryItem)) {
                            let resultitems = inventoryItem.toObject().items;
                            let foundIndex = resultitems.findIndex(c => c.typeCode === 'water-bucket');
                            if (foundIndex !== -1) resultitems[foundIndex].amount -= 1;
                            let filteritems = resultitems.filter(u => u.amount > 0);
                            inventoryItem.items = filteritems;
                            inventoryItem.save();
                        }
                        if (inventoryItem.items.length === 0) {
                            await InventoryItem.findOneAndRemove({ userId: ObjectId(eachItem.userId) });
                        }
                        let landItem = await LandCharacter.findOne({
                            "userId": ObjectId(eachItem.userId),
                            "typeCode": eachItem.treeTypeCode,
                            "quadKey": eachItem.quadKey
                        });
                        if (!isNull(landItem)) {
                            let time = 6 * 30 * 24 * 60 * 60; //15552000
                            landItem.waterPeriod = landItem.waterPeriod > time ? landItem.waterPeriod : time;
                            landItem.createdDateWater = new Date().getTime();
                            landItem.waterWarning = false;
                            await landItem.save();
                        }
                    }
                } else if (eachItem.type === 'remove' && eachItem.typeCode === 'shovel') {
                    let result = await InventoryItem.findOne({
                        userId: ObjectId(eachItem.userId),
                        'items.typeCode': 'shovel',
                        'items.type': 'remove',
                        'items.amount': { $gt: 0 }
                    });
                    if (!isNull(result)) {
                        let resultitems = result.toObject().items;
                        let foundIndex = resultitems.findIndex(c => c.typeCode === 'shovel');
                        if (foundIndex !== -1) resultitems[foundIndex].amount -= 1;
                        let filteritems = resultitems.filter(u => u.amount > 0);
                        result.items = filteritems;
                        result.save();
                    }

                    if (result.items.length === 0) {
                        await InventoryItem.findOneAndRemove({ userId: ObjectId(eachItem.userId) });
                    }
                    await LandCharacter.findOneAndRemove({
                        "userId": ObjectId(eachItem.userId),
                        "typeCode": eachItem.treeTypeCode,
                        "quadKey": eachItem.quadKey
                    });
                }
                usingAmount -= 1;
            }
        }
    }
    return await LandCharacter.find();
}

async function useGift(param) {
    let gifts = [];
    let usingAmount = (typeof param.usingAmount !== 'undefined' && param.usingAmount > 1) ? param.usingAmount : 1;
    let items = param.items;
    let userId = items[0].userId;
    let typeCode = items[0].typeCode;
    let giftType = '';
    if (typeCode === 'normal-box') {
        giftType = 'normal';
    } else if (typeCode === 'rare-box') {
        giftType = 'rare';
    } else {
        giftType = 'legend'
    }

    //split arrays with characters, items
    for (let i = 0; i < usingAmount; i++) {
        let eachGift = receiveGiftFromBox(giftType);
        gifts.push(eachGift);
    }




    let grpValBox = Object.values(groupBy(gifts, 'typeCode'));
    gifts = grpValBox.reduce((arr, items) => {
        let newItem = items[0];
        newItem.amount = items.length;
        arr.push(newItem);
        return arr;
    }, []);


    for (let eachGift of gifts) {
        if (eachGift.type === 'bud') {
            await characterInventoryService.add({ user: { _id: userId }, characters: [eachGift] })
        } else {
            await itemInventoryService.add({ user: { _id: userId }, items: [eachGift] });
        }
    }

    /*
    //update db
    */
    let result = await InventoryItem.findOne({ userId: ObjectId(userId), 'items.typeCode': typeCode, 'items.type': 'item' });
    if (!isNull(result)) {
        let resultitems = result.items;

        let foundIndex = resultitems.findIndex(c => c.typeCode === typeCode);
        resultitems[foundIndex].amount -= usingAmount;

        let filteritems = resultitems.filter(u => u.amount > 0);
        result.items = filteritems;
        result.save();
    }
    return { gifts: gifts }
}


//array[id] => check statusItem nếu loại thu hoạch được thì thu hoạch và update item => return new items redux
// add item to userHarvest
async function harvestItems(param) {
    for (let eachItem of param) {
        if (eachItem.type === 'blood-tree') {
            let bloodProfit = 0;
            let treeItem = await LandCharacter.findOne({
                "userId": ObjectId(eachItem.userId),
                "typeCode": eachItem.typeCode,
                "quadKey": eachItem.quadKey
            });

            bloodProfit = (treeItem.profit / 100) * treeItem.price + treeItem.price;
            // if (!isNull(treeItem) && bloodProfit > 0) {
            if (!isNull(treeItem)) {
                const userHarvest = new UserHarvest();
                userHarvest.total = bloodProfit;
                userHarvest.userId = ObjectId(eachItem.userId);
                userHarvest.walletId = typeof eachItem.walletId !== 'undefined' ? eachItem.walletId : 'www';
                userHarvest.items = {
                    name: eachItem.name,
                    typeCode: eachItem.typeCode,
                    description: eachItem.description,
                    quadKey: eachItem.quadKey
                };
                await userHarvest.save();

                let itemUpdated = await LandCharacter.findOne({
                    "userId": ObjectId(eachItem.userId),
                    "typeCode": eachItem.typeCode,
                    "quadKey": eachItem.quadKey
                });

                if (!isNull(itemUpdated)) {
                    const updatedItem = await Character.findOne({ 'typeCode': itemUpdated.transformToTypeCode });
                    if (!isNull(updatedItem)) {
                        itemUpdated.name = typeof updatedItem.name !== 'undefined' && !isNull(updatedItem.name) ? updatedItem.name : '';
                        itemUpdated.typeCode = typeof updatedItem.typeCode !== 'undefined' && !isNull(updatedItem.typeCode) ? updatedItem.typeCode : '';
                        itemUpdated.description = typeof updatedItem.description !== 'undefined' && !isNull(updatedItem.description) ? updatedItem.description : '';
                        itemUpdated.waterPeriod = 864000;
                        itemUpdated.createdDateWater = new Date().getTime();
                        itemUpdated.waterWarning = false;
                        itemUpdated.transformPeriod = typeof updatedItem.transformPeriod !== 'undefined' && !isNull(updatedItem.transformPeriod) ? updatedItem.transformPeriod : 0;
                        itemUpdated.transformToTypeCode = typeof updatedItem.transformToTypeCode !== 'undefined' && !isNull(updatedItem.transformToTypeCode) ? updatedItem.transformToTypeCode : '';
                        itemUpdated.type = typeof updatedItem.type !== 'undefined' && !isNull(updatedItem.type) ? updatedItem.type : '';
                        itemUpdated.createdDate = new Date().getTime();
                        await itemUpdated.save();
                    }
                }
            }
        }
    }

    return await LandCharacter.find();
}

async function harvestItemsSchedule() {
    // const allLand = await LandCharacter.find({ profitDay: {$lt: 0} }).lean();
    // let walletObject = {};

    const User = db.User;
    const Land = db.Land;

    let testV = [];

    // console.log("**************************************************************");

    let allLandCharacters = await LandCharacter.find({ $or: [{ type: 'tree' }, { type: 'blood-tree' }] }).lean();
    // console.log("|all",allLandCharacters.length);
    let allUsers = createUniqueArr('userId', allLandCharacters);

    // console.log("allUsers",allUsers.length);
    if (!isNull(allLandCharacters) && allUsers.length > 0) {
        for (let userId of allUsers) {
            let allLandsOfUser = await Land.findOne({ "userId": ObjectId(userId) }).lean().select('lands userId');

            for (eachElement of allLandsOfUser.lands) {
                // let obj = {
                //     userId : allLandsOfUser.userId,
                //     eachElement : eachElement
                // }
                // testV.push(obj);
                let eachTree = allLandCharacters.find(ch => ch.quadKey === eachElement.quadKey);
                if (typeof eachTree !== 'undefined') {
                    console.log("\n&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\n");

                    let now = (new Date().getTime());
                    const landQuadkey = allLandsOfUser.lands.find(l => l.quadKey === eachElement.quadKey);

                    let initialPrice = parseFloat(landQuadkey.initialPrice);
                    // console.log('initialPrice', initialPrice);
                    let profitDayOnTree = parseFloat(eachTree.profitDay) * initialPrice;
                    // console.log('profitDayOnTree', profitDayOnTree);

                    let profitMonthOnTree = 0;
                    if (new Date().getDate() === 1) {
                        let createdDateMonthHarvest = (eachTree.createdDateMonthHarvest);
                        let timeFromCreateDateMonthHarvest = now - createdDateMonthHarvest; //millisecond
                        let totalDayFromCreateDateMonthHarvest = Math.floor(timeFromCreateDateMonthHarvest / 1000 * 24 * 60 * 60);

                        let totalDayLastMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();
                        profitMonthOnTree = eachTree.profitMonth * (totalDayFromCreateDateMonthHarvest / totalDayLastMonth) * initialPrice;
                        eachTree.createdDateMonthHarvest = new Date().getTime();

                    }

                    // start of year
                    let profitYearOnTree = 0;
                    if (new Date().getDate() === 1 && (new Date().getMonth() + 1) === 1) {
                        let createdDateYearHarvest = (eachTree.createdDateYearHarvest);
                        let timeFromCreateDateYearHarvest = now - createdDateYearHarvest; //millisecond
                        let totalDayFromCreateDateYearHarvest = Math.floor(timeFromCreateDateYearHarvest / 1000 * 24 * 60 * 60);
                        let totalDayLastYear = 365;

                        profitYearOnTree = eachTree.profitYear * (totalDayFromCreateDateYearHarvest / totalDayLastYear) * initialPrice;
                        eachTree.createdDateYearHarvest = new Date().getTime();

                    }

                    totalHarvest = profitDayOnTree + profitMonthOnTree + profitYearOnTree;
                    // update to notify
                    if (typeof totalHarvest !== 'undefined' && parseFloat(totalHarvest) > 0) {
                        let userUpdate = await User.findById(eachTree.userId);
                        if (!isNull(userUpdate)) {

                            console.log('totalHarvest', totalHarvest);
                            userUpdate.goldBlood += parseFloat(totalHarvest);
                            await userUpdate.save();

                            let formartHarvest = parseFloat(totalHarvest).toFixed(2);
                            await notifyService.send({
                                userId: eachTree.userId,
                                title: 'Blood을 성공적으로 전송',
                                content: `${userUpdate.userName} 은 나무 심기 수입으로 ${formartHarvest} 을 받았다.`,
                                type: 'lands'
                            });
                        }

                        eachTree.profitGot += parseFloat(totalHarvest);
                    }

                    await LandCharacter.findOneAndUpdate({ quadKey: eachTree.quadKey },
                        {
                            $set: {
                                "createdDateMonthHarvest": new Date().getTime(),
                                "createdDateYearHarvest": new Date().getTime(),
                                "profitGot": eachTree.profitGot
                            }
                        });


                    // const user = await User.findById(ObjectId(eachElement.userId));
                    // if (typeof user !== 'undefined' && (user)) {
                    //     const { hash, wToken, avatar, role, ...walletInfo } = user.toObject();
                    //     walletObject = { ...walletInfo };
                    // }
                    // console.log("\n&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\n");
                }


                /*
                let now = (new Date().getTime());
                const landQuadkey = allLandsOfUser.lands.find(l => l.quadKey === eachElement.quadKey);

                console.log("lqk",landQuadkey);

                if (isNull(landQuadkey)) break;
        
                console.log("==============");
                let initialPrice = parseFloat(landQuadkey.initialPrice);
                console.log('initialPrice', initialPrice);
                let profitDayOnTree = parseFloat(eachTree.profitDay) * initialPrice;
                console.log('profitDayOnTree', profitDayOnTree);

                */


                /*
                let profitMonthOnTree = 0;
                if (new Date().getDate() === 1) {
                    let createdDateMonthHarvest = (eachTree.createdDateMonthHarvest);
                    let timeFromCreateDateMonthHarvest = now - createdDateMonthHarvest; //millisecond
                    let totalDayFromCreateDateMonthHarvest = Math.floor(timeFromCreateDateMonthHarvest / 1000 * 24 * 60 * 60);
        
                    let totalDayLastMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();
                    profitMonthOnTree = eachTree.profitMonth * (totalDayFromCreateDateMonthHarvest / totalDayLastMonth) * initialPrice;
                    eachTree.createdDateMonthHarvest = new Date().getTime();
        
                }
        
                // start of year
                let profitYearOnTree = 0;
                if (new Date().getDate() === 1 && (new Date().getMonth() + 1) === 1) {
                    let createdDateYearHarvest = (eachTree.createdDateYearHarvest);
                    let timeFromCreateDateYearHarvest = now - createdDateYearHarvest; //millisecond
                    let totalDayFromCreateDateYearHarvest = Math.floor(timeFromCreateDateYearHarvest / 1000 * 24 * 60 * 60);
                    let totalDayLastYear = 365;
        
                    profitYearOnTree = eachTree.profitYear * (totalDayFromCreateDateYearHarvest / totalDayLastYear) * initialPrice;
                    eachTree.createdDateYearHarvest = new Date().getTime();
        
                }
        
                totalHarvest = profitDayOnTree + profitMonthOnTree + profitYearOnTree;
                // update to notify
                if (typeof totalHarvest !== 'undefined' && parseFloat(totalHarvest) > 0) {
                    let userUpdate = await User.findById(eachTree.userId);
                    if (!isNull(userUpdate)) {
        
                        console.log('totalHarvest', totalHarvest);
                        userUpdate.goldBlood += parseFloat(totalHarvest);
                        await userUpdate.save();
        
                        let formartHarvest = parseFloat(totalHarvest).toFixed(2);
                        await notifyService.send({
                            userId: eachTree.userId,
                            title: 'Blood을 성공적으로 전송',
                            content: `${userUpdate.userName} 은 나무 심기 수입으로 ${formartHarvest} 을 받았다.`,
                            type: 'lands'
                        });
                    }
        
                    eachTree.profitGot += parseFloat(totalHarvest);
                }
        
        
        
                await LandCharacter.findOneAndUpdate({ quadKey: eachTree.quadKey },
                    {
                        $set: {
                            "createdDateMonthHarvest": new Date().getTime(),
                            "createdDateYearHarvest": new Date().getTime(),
                            "profitGot": eachTree.profitGot
                        }
                    });
        
                // const user = await User.findById(ObjectId(eachElement.userId));
                // if (typeof user !== 'undefined' && (user)) {
                //     const { hash, wToken, avatar, role, ...walletInfo } = user.toObject();
                //     walletObject = { ...walletInfo };
                // }
                */
            }






        }



        // console.log("**************************************************************");

        return testV;
        /*
        console.log("userId",userId);

        console.log("****************************************************************************************************");
       
        */




        // for (let eachElement of allLandCharacters) {
        //     console.log("eachElement",)


        /*
        let now = (new Date().getTime());
        const landQuadkey = allLandsOfUser.lands.find(l => l.quadKey === eachElement.quadKey);
        if (isNull(landQuadkey)) break;

        console.log("==============");
        let initialPrice = parseFloat(landQuadkey.initialPrice);
        console.log('initialPrice', initialPrice);
        let profitDayOnTree = parseFloat(eachElement.profitDay) * initialPrice;
        console.log('profitDayOnTree', profitDayOnTree);
        let profitMonthOnTree = 0;
        if (new Date().getDate() === 1) {
            let createdDateMonthHarvest = (eachElement.createdDateMonthHarvest);
            let timeFromCreateDateMonthHarvest = now - createdDateMonthHarvest; //millisecond
            let totalDayFromCreateDateMonthHarvest = Math.floor(timeFromCreateDateMonthHarvest / 1000 * 24 * 60 * 60);

            let totalDayLastMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();
            profitMonthOnTree = eachElement.profitMonth * (totalDayFromCreateDateMonthHarvest / totalDayLastMonth) * initialPrice;
            eachElement.createdDateMonthHarvest = new Date().getTime();

        }

        // start of year
        let profitYearOnTree = 0;
        if (new Date().getDate() === 1 && (new Date().getMonth() + 1) === 1) {
            let createdDateYearHarvest = (eachElement.createdDateYearHarvest);
            let timeFromCreateDateYearHarvest = now - createdDateYearHarvest; //millisecond
            let totalDayFromCreateDateYearHarvest = Math.floor(timeFromCreateDateYearHarvest / 1000 * 24 * 60 * 60);
            let totalDayLastYear = 365;

            profitYearOnTree = eachElement.profitYear * (totalDayFromCreateDateYearHarvest / totalDayLastYear) * initialPrice;
            eachElement.createdDateYearHarvest = new Date().getTime();

        }

        totalHarvest = profitDayOnTree + profitMonthOnTree + profitYearOnTree;
        // update to notify
        if (typeof totalHarvest !== 'undefined' && parseFloat(totalHarvest) > 0) {
            let userUpdate = await User.findById(eachElement.userId);
            if (!isNull(userUpdate)) {

                console.log('totalHarvest', totalHarvest);
                userUpdate.goldBlood += parseFloat(totalHarvest);
                await userUpdate.save();

                let formartHarvest = parseFloat(totalHarvest).toFixed(2);
                await notifyService.send({
                    userId: eachElement.userId,
                    title: 'Blood을 성공적으로 전송',
                    content: `${userUpdate.userName} 은 나무 심기 수입으로 ${formartHarvest} 을 받았다.`,
                    type: 'lands'
                });
            }

            eachElement.profitGot += parseFloat(totalHarvest);
        }



        await LandCharacter.findOneAndUpdate({ quadKey: eachElement.quadKey },
            {
                $set: {
                    "createdDateMonthHarvest": new Date().getTime(),
                    "createdDateYearHarvest": new Date().getTime(),
                    "profitGot": eachElement.profitGot
                }
            });

        // const user = await User.findById(ObjectId(eachElement.userId));
        // if (typeof user !== 'undefined' && (user)) {
        //     const { hash, wToken, avatar, role, ...walletInfo } = user.toObject();
        //     walletObject = { ...walletInfo };
        // }

        

    }
    

    console.log("****************************************************************************************************");
    
}
*/
    }



    // let totalHarvest = 0;

    // const Land = db.Land;
    // const User = db.User;

    // await LandCharacter.find({ $or: [{type:'tree'},{type:'blood-tree'}]}, async (err, result) => {
    //     if (err) {
    //         throw new Error(err);
    //     } else {
    //         for (let eachElement of result) {
    //             let now = (new Date().getTime());
    //             const landQuadkey = await Land.findOne(
    //                 {
    //                     $and: [
    //                         { "lands.quadKey": eachElement.quadKey },
    //                         { "userId": ObjectId(eachElement.userId) },
    //                         { "lands.initialPrice": {$gt: 0}}
    //                     ]
    //                 }
    //             ).lean();

    //             if (!isNull(landQuadkey)) {
    //                 let initialPrice = parseFloat(landQuadkey.lands[0].initialPrice);
    //                 let profitDayOnTree = parseFloat(eachElement.profitDay) * initialPrice;

    //                 // start of month
    //                 let profitMonthOnTree = 0;
    //                 if(new Date().getDate()===1)
    //                 {
    //                     let createdDateMonthHarvest = (eachElement.createdDateMonthHarvest);
    //                     let timeFromCreateDateMonthHarvest = now - createdDateMonthHarvest; //millisecond
    //                     let totalDayFromCreateDateMonthHarvest = Math.floor(timeFromCreateDateMonthHarvest / 1000*24*60*60);

    //                     let totalDayLastMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();
    //                     profitMonthOnTree = eachElement.profitMonth * (totalDayFromCreateDateMonthHarvest/totalDayLastMonth) * initialPrice;
    //                     eachElement.createdDateMonthHarvest = new Date().getTime();
    //                     await eachElement.save();
    //                 }

    //                 // start of year
    //                 let profitYearOnTree = 0;
    //                 if(new Date().getDate()===1&&(new Date().getMonth() + 1)===1)
    //                 {
    //                     let createdDateYearHarvest = (eachElement.createdDateYearHarvest);
    //                     let timeFromCreateDateYearHarvest = now - createdDateYearHarvest; //millisecond
    //                     let totalDayFromCreateDateYearHarvest = Math.floor(timeFromCreateDateYearHarvest / 1000*24*60*60);
    //                     let totalDayLastYear = 365;

    //                     profitYearOnTree = eachElement.profitYear * (totalDayFromCreateDateYearHarvest/totalDayLastYear) * initialPrice;
    //                     eachElement.createdDateYearHarvest = new Date().getTime();
    //                     await eachElement.save();
    //                 }

    //                 totalHarvest = profitDayOnTree + profitMonthOnTree + profitYearOnTree;
    //                 // update to notify
    //                 if (typeof totalHarvest !== 'undefined'&&parseFloat(totalHarvest) > 0)
    //                 {
    //                     let userUpdate = await User.findById(eachElement.userId);
    //                     if(!isNull(userUpdate)) {
    //                         userUpdate.goldBlood += parseFloat(totalHarvest);
    //                         await userUpdate.save();

    //                         await notifyService.send({
    //                             userId: eachElement.userId,
    //                             title: 'Blood을 성공적으로 전송',
    //                             content: `${ userUpdate.userName } 은 나무 심기 수입으로 ${ parseFloat(totalHarvest) }을 받았다.`,
    //                             type: 'lands'
    //                         });
    //                     }
    //                 }
    //                 // const user = await User.findById(ObjectId(eachElement.userId));
    //                 // if (typeof user !== 'undefined' && (user)) {
    //                 //     const { hash, wToken, avatar, role, ...walletInfo } = user.toObject();
    //                 //     walletObject = { ...walletInfo };
    //                 // }
    //             }
    //         }
    //     }
    // });

    // return false;
    // // return { items: allLand, walletObject: walletObject }




}
