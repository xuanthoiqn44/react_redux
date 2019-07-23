const db = require('../../../helpers/db');
const ObjectId = require('mongoose').Types.ObjectId;
const LandItem = db.LandItem;
const isNull = require('lodash.isnull');
const InventoryItem = db.InventoryItem;
const isUndefined = require('lodash.isundefined');
const landService = require('../../lands/services/index');

module.exports = {
    get,
    add,
    move,
    moveToMap,
    using
};

//param: id --> return items
async function get(param) {
    const result = await InventoryItem.findOne({ userId: param.userId }).lean().select('items');
    if (isNull(result))
        return [];
    return result.items;
}

//param: { user: { _id }, items: [ ] }, array items --> if exist itemId + 1 --> return items
async function add(param) {

    let userId = param.user._id;
    let items = param.items;

    const inventoryItem = await InventoryItem.findOne({ userId: userId }).lean().select('items');
    if (isNull(inventoryItem)) {
        for (let i = 0; i < items.length; i++) {
            if(items[i].typeCode.includes('box')){
                items[i].position = -1;
            }
        }


        const newInventoryItem = new InventoryItem();
        newInventoryItem.userId = new ObjectId(userId);
        newInventoryItem.items = items;
        await newInventoryItem.save();
        return await get({ userId: param.user._id });
    }
    else {
        let Iitems = inventoryItem.items;
        for (let item of Iitems) {
            let foundIndex = -1;
            let foundItem = null;
            // check each element is exist
            for (let i = 0; i < items.length; i++) {
                if (items[i].typeCode === item.typeCode) {
                    foundIndex = i;
                    foundItem = items[i];
                    break;
                }
            }

            //cập nhật số lượng
            if (foundIndex !== -1) {
                let itemNumber = typeof foundItem.amount === 'undefined' ? 1 : foundItem.amount;
                item.amount += itemNumber;
            }
        }

        let newItems = items.filter(c => Iitems.findIndex(glc => glc.typeCode === c.typeCode) === -1);


        for (let i = 0; i < newItems.length; i++) {
            if(items[i].typeCode.includes('box')){
                //if items is box
                items[i].position = -1;
            }else{
                items[i].position = findEmptyPosition(Iitems);
            }
            
            Iitems.push(items[i]);
        }

        let updatedInventoryItem = await InventoryItem.findOneAndUpdate(
            { "userId": userId },
            { "$set": { "items": Iitems } },
            { new: true }
        );
        // if(isNull(updatedInventoryItem))
        //     return [];

        return updatedInventoryItem;
    }
}

//param: userId, oldPosition, newPosition, itemId  --> cập nhật Position item --> return items
async function move(param) {
    //find all items of user by userId
    await InventoryItem.findOne({ userId: ObjectId(param.userId) }, (err, result) => {
        if (err) {
            throw new Error(err);
        } else {
            let index = -1;
            for (let i = 0; i < result.items.length; i++) {
                if (result.items[i].position === param.oldPosition && result.items[i].typeCode === param.typeCode) {
                    index = i;
                    break;
                }
            }

            let indexOfNewPositionChar = result.items.findIndex(c => c.position === param.newPosition && c.typeCode === param.typeCode);
            if (index !== -1) {
                if (indexOfNewPositionChar !== -1) {
                    // let amount = typeof param.amount !== 'undefined' ? param.amount : 1;
                    result.items[indexOfNewPositionChar].amount += result.items[index].amount;
                    result.items.splice(index, 1);
                } else {
                    result.items[index].position = param.newPosition;
                }
            }

            result.save();
        }
    });
    return await get({ userId: param.userId });
}

//param: userId, items[ {itemId, quadKey, amount}], a --> return items của inventory và items của landGame
async function moveToMap(param) {

    console.log("param",param);

    let userId = param.userId;
    let items = param.items;
    let insertParam = [];

    //all land of user
    const allLand = await landService.getAllLandByUserId(userId);

    const isIItemExist = await InventoryItem.findOne({ userId: userId }).lean().select('items');
    if (isNull(isIItemExist)) throw new Error("doesn't exist InventoryItem");
    let updatedInventoryItems = isIItemExist.items;

    console.log("updatedxxxx",updatedInventoryItems);

    for (let item of items) {
        // const isItemExist = await LandItem.findOne({ userId: ObjectId(userId), quadKey: item.quadKey });
        // if (isNull(isItemExist) && isIItemExist.items.findIndex(c => c.typeCode === item.typeCode) !== -1 && item.type.includes('tree')) {
        //     //nếu mảnh đất chưa ai trồng cây ?
        let isOwnedByUser = allLand[0].lands.find(l => l.quadKey === item.quadKey);
        if (!isNull(isOwnedByUser)) {
            //only aceept when land is owned by user
            let newItem = item;
            newItem.userId = new ObjectId(userId);
            insertParam.push(newItem);
        }

        // }
    }

    for (let item of insertParam) {
        let index = updatedInventoryItems.findIndex(c => c.typeCode === item.typeCode);
        if (index !== -1) {
            updatedInventoryItems[index].amount -= 1;
            if (updatedInventoryItems[index].amount <= 0) {
                updatedInventoryItems.splice(index, 1);
            }
        }
    }

    //update inventory characters after move to map

    if (updatedInventoryItems.length === 0) {
        await InventoryItem.findOneAndRemove({ "userId": userId });
    } else {
        await InventoryItem.findOneAndUpdate(
            { "userId": userId },
            { "$set": { "items": updatedInventoryItems } },
            { new: true }
        );
    }


    if (insertParam.length > 0) {
        await LandItem.insertMany(insertParam);
    }

    let allLandGameItem = await LandItem.find();
    if (isNull(allLandGameItem)) allLandGameItem = [];


    console.log("updated",updatedInventoryItems);

    return { InventoryItem: updatedInventoryItems, LandGameItem: allLandGameItem };
}

//param: userId, itemId, amount --> -amount hoặc xóa return items của inventory
async function using(param) {
    let amount = isUndefined(param.amount) ? 1 : param.amount;
    await InventoryItem.findOne(
        { 'userId': ObjectId(param.userId) },
        (err, result) => {
            if (err) {
                throw new Error(err);
            } else {
                let resultItems = result.toObject().items;
                let foundIndex = resultItems.findIndex(c => c.typeCode === param.typeCode);
                if (foundIndex !== -1) resultItems[foundIndex].amount -= amount;
                let filterItems = resultItems.filter(u => u.amount > 0);
                result.items = filterItems;
                result.save();
            }
        }
    );

    return await get({ userId: param.userId });
}

function findEmptyPosition(inventoryItems) {
    let allPositions = inventoryItems.map(elm => elm.position);
    let max = Math.max(...allPositions);
    let pos = -1;
    for (let i = 0; i < max; i++) {
        if (allPositions.findIndex(p => p === i) === -1) {
            pos = i;
            break;
        }
    }
    if (pos === -1) return max + 1;
    else return pos;

}