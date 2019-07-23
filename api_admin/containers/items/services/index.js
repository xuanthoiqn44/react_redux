const db = require('../../../helpers/db');
const Item = db.Item;
const isNull = require('lodash.isnull');

module.exports = {
    get,
    add,
    edit,
    removeDbItemAndCharacter,
    delete: _delete
};

async function get(param) {
    return await Item.findById(param.id);
}

async function add(param) {
    for (let eachItem of param) {
        const checkedItem = await Item.findOne({ typeCode: eachItem.typeCode });
        if (isNull(checkedItem)) {
            const item = new Item();
            item.name = typeof eachItem.name !== 'undefined' && !isNull(eachItem.name) ? eachItem.name : '';
            item.typeCode = eachItem.typeCode;
            item.image = eachItem.image;
            item.description = eachItem.description;
            item.transformPeriod = typeof eachItem.transformPeriod !== 'undefined' && !isNull(eachItem.transformPeriod) ? eachItem.transformPeriod : 0;
            item.transformToTypeCode = typeof eachItem.transformToTypeCode !== 'undefined' && !isNull(eachItem.transformToTypeCode) ? eachItem.transformToTypeCode : '';
            item.profit = typeof eachItem.profit !== 'undefined' && !isNull(eachItem.profit) ? eachItem.profit : 0;
            item.price = typeof eachItem.price !== 'undefined' && !isNull(eachItem.price) ? eachItem.price : 0;
            item.type = typeof eachItem.type !== 'undefined' && !isNull(eachItem.type) ? eachItem.type : '';
            await item.save();
        }
        else
        {
            await Item.findOneAndUpdate({ typeCode: eachItem.typeCode },
                {
                    $set: {
                        "name": typeof eachItem.name !== 'undefined' && !isNull(eachItem.name) ? eachItem.name : '',
                        "image": typeof eachItem.image !== 'undefined' && !isNull(eachItem.image) ? eachItem.image : '',
                        "description": typeof eachItem.description !== 'undefined' && !isNull(eachItem.description) ? eachItem.description : '',
                        "transformPeriod": typeof eachItem.transformPeriod !== 'undefined' && !isNull(eachItem.transformPeriod) ? eachItem.transformPeriod : 0,
                        "transformToTypeCode": typeof eachItem.transformToTypeCode !== 'undefined' && !isNull(eachItem.transformToTypeCode) ? eachItem.transformToTypeCode : '',
                        "profit": typeof eachItem.profit !== 'undefined' && !isNull(eachItem.profit) ? eachItem.profit : 0,
                        "price": typeof eachItem.price !== 'undefined' && !isNull(eachItem.price) ? eachItem.price : 0,
                        "type": typeof eachItem.type !== 'undefined' && !isNull(eachItem.type) ? eachItem.type : '',
                    }
                });
        }
    }

    return await Item.find().select('_id typeCode');
}

async function edit(param) {
    await Item.findOneAndUpdate({ typeCode: param.typeCode },
        {
            $set: {
                "name": typeof param.name !== 'undefined' && !isNull(param.name) ? param.name : '',
                "image": typeof param.image !== 'undefined' && !isNull(param.image) ? param.image : '',
                "description": typeof param.description !== 'undefined' && !isNull(param.description) ? param.description : '',
                "transformPeriod": typeof param.transformPeriod !== 'undefined' && !isNull(param.transformPeriod) ? param.transformPeriod : 0,
                "transformToTypeCode": typeof param.transformToTypeCode !== 'undefined' && !isNull(param.transformToTypeCode) ? param.transformToTypeCode : '',
                "profit": typeof param.profit !== 'undefined' && !isNull(param.profit) ? param.profit : 0,
                "price": typeof param.price !== 'undefined' && !isNull(param.price) ? param.price : 0,
                "type": typeof param.type !== 'undefined' && !isNull(param.type) ? param.type : '',
            }
        });
    return await Item.find();
}

async function removeDbItemAndCharacter() {
    const ItemShop = db.ShopItem;
    const Character = db.Character;
    const CharacterShop = db.ShopCharacter;
    const InventoryCharacter = db.InventoryCharacter;
    const InventoryItem = db.InventoryItem;
    const LandCharacter = db.LandCharacter;
    const LandItem = db.LandItem;
    await Item.remove();
    await ItemShop.remove();
    await Character.remove();
    await CharacterShop.remove();
    await InventoryCharacter.remove();
    await InventoryItem.remove();
    await LandCharacter.remove();
    await LandItem.remove();
    return [];
}

async function _delete(param) {
    await Item.findOneAndDelete({ typeCode: param.typeCode });
    return await Item.find();
}