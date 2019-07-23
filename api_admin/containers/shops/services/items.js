const db = require('../../../helpers/db');
const ShopItem = db.ShopItem;
const Item = db.Item;
const isNull = require('lodash.isnull');

module.exports = {
    get,
    add,
    addDatabaseCharacterAndItem
};

async function get() {
    return await ShopItem.find();
}

async function add(param) {
    for(let eachItem of param){
        const checkedItem = await Item.findOne({typeCode : eachItem.typeCode});
        if (!isNull(checkedItem)) {
            const isAlreadyExist = await ShopItem.findOne({ typeCode: eachItem.typeCode});
            if(isNull(isAlreadyExist))
            {
                const newShopItem = new ShopItem();
                newShopItem.name = checkedItem.name;
                newShopItem.typeCode = checkedItem.typeCode;
                newShopItem.image = checkedItem.image;
                newShopItem.description = checkedItem.description;
                newShopItem.transformPeriod = checkedItem.transformPeriod;
                newShopItem.transformToTypeCode = checkedItem.transformToTypeCode;
                newShopItem.profit = checkedItem.profit;
                newShopItem.price = checkedItem.price;
                newShopItem.type = checkedItem.type;
                await newShopItem.save();
            }
            else
            {
                await ShopItem.findOneAndUpdate({ typeCode: eachItem.typeCode },
                    {
                        $set: {
                            "name": typeof checkedItem.name !== 'undefined' && !isNull(checkedItem.name) ? checkedItem.name : '',
                            "image": typeof checkedItem.image !== 'undefined' && !isNull(checkedItem.image) ? checkedItem.image : '',
                            "description": typeof checkedItem.description !== 'undefined' && !isNull(checkedItem.description) ? checkedItem.description : '',
                            "transformPeriod": typeof checkedItem.transformPeriod !== 'undefined' && !isNull(checkedItem.transformPeriod) ? checkedItem.transformPeriod : 0,
                            "transformToTypeCode": typeof checkedItem.transformToTypeCode !== 'undefined' && !isNull(checkedItem.transformToTypeCode) ? checkedItem.transformToTypeCode : '',
                            "profit": typeof checkedItem.profit !== 'undefined' && !isNull(checkedItem.profit) ? checkedItem.profit : 0,
                            "price": typeof checkedItem.price !== 'undefined' && !isNull(checkedItem.price) ? checkedItem.price : 0,
                            "type": typeof checkedItem.type !== 'undefined' && !isNull(checkedItem.type) ? checkedItem.type : '',
                        }
                    });
            }
        }
    }
    return param;
}

async function addDatabaseCharacterAndItem(param) {
    const ShopCharacter = db.ShopCharacter;
    const Character = db.Character;

    for (let eachCharacter of param.charDb) {
        const checkedCharacter = await Character.findOne({ typeCode: eachCharacter.typeCode });
        if (isNull(checkedCharacter)) {
            const character = new Character();
            character.name = typeof eachCharacter.name !== 'undefined' && !isNull(eachCharacter.name) ? eachCharacter.name : '';
            character.typeCode = eachCharacter.typeCode;
            character.image = eachCharacter.image;
            character.description = eachCharacter.description;
            character.transformPeriod = typeof eachCharacter.transformPeriod !== 'undefined' && !isNull(eachCharacter.transformPeriod) ? eachCharacter.transformPeriod : 0;
            character.transformToTypeCode = typeof eachCharacter.transformToTypeCode !== 'undefined' && !isNull(eachCharacter.transformToTypeCode) ? eachCharacter.transformToTypeCode : '';
            character.profit = typeof eachCharacter.profit !== 'undefined' && !isNull(eachCharacter.profit) ? eachCharacter.profit : 0;
            character.profitDay = typeof eachCharacter.profitDay !== 'undefined' && !isNull(eachCharacter.profitDay) ? eachCharacter.profitDay : 0;
            character.profitMonth = typeof eachCharacter.profitMonth !== 'undefined' && !isNull(eachCharacter.profitMonth) ? eachCharacter.profitMonth : 0;
            character.profitYear = typeof eachCharacter.profitYear !== 'undefined' && !isNull(eachCharacter.profitYear) ? eachCharacter.profitYear : 0;
            character.price = typeof eachCharacter.price !== 'undefined' && !isNull(eachCharacter.price) ? eachCharacter.price : 0;
            character.type = typeof eachCharacter.type !== 'undefined' && !isNull(eachCharacter.type) ? eachCharacter.type : '';
            await character.save();
        }
        else
        {
            await Character.findOneAndUpdate({ typeCode: eachCharacter.typeCode },
                {
                    $set: {
                        "name": typeof eachCharacter.name !== 'undefined' && !isNull(eachCharacter.name) ? eachCharacter.name : '',
                        "image": typeof eachCharacter.image !== 'undefined' && !isNull(eachCharacter.image) ? eachCharacter.image : '',
                        "description": typeof eachCharacter.description !== 'undefined' && !isNull(eachCharacter.description) ? eachCharacter.description : '',
                        "transformPeriod": typeof eachCharacter.transformPeriod !== 'undefined' && !isNull(eachCharacter.transformPeriod) ? eachCharacter.transformPeriod : 0,
                        "transformToTypeCode": typeof eachCharacter.transformToTypeCode !== 'undefined' && !isNull(eachCharacter.transformToTypeCode) ? eachCharacter.transformToTypeCode : '',
                        "profit": typeof eachCharacter.profit !== 'undefined' && !isNull(eachCharacter.profit) ? eachCharacter.profit : 0,
                        "profitDay": typeof eachCharacter.profitDay !== 'undefined' && !isNull(eachCharacter.profitDay) ? eachCharacter.profitDay : 0,
                        "profitMonth": typeof eachCharacter.profitMonth !== 'undefined' && !isNull(eachCharacter.profitMonth) ? eachCharacter.profitMonth : 0,
                        "profitYear": typeof eachCharacter.profitYear !== 'undefined' && !isNull(eachCharacter.profitYear) ? eachCharacter.profitYear : 0,
                        "price": typeof eachCharacter.price !== 'undefined' && !isNull(eachCharacter.price) ? eachCharacter.price : 0,
                        "type": typeof eachCharacter.type !== 'undefined' && !isNull(eachCharacter.type) ? eachCharacter.type : '',
                    }
                });
        }
    }
    for (let eachItem of param.itemDb) {
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
    for(let eachCharacter of param.shopCharDb){
        const checkedCharacter = await Character.findOne({typeCode : eachCharacter.typeCode});
        if (!isNull(checkedCharacter)) {
            const isAlreadyExist = await ShopCharacter.findOne({ typeCode: eachCharacter.typeCode});
            if(isNull(isAlreadyExist))
            {
                const newShopCharacter = new ShopCharacter();
                newShopCharacter.name = checkedCharacter.name;
                newShopCharacter.typeCode = checkedCharacter.typeCode;
                newShopCharacter.image = checkedCharacter.image;
                newShopCharacter.description = checkedCharacter.description;
                newShopCharacter.transformPeriod = checkedCharacter.transformPeriod;
                newShopCharacter.transformToTypeCode = checkedCharacter.transformToTypeCode;
                newShopCharacter.profit = checkedCharacter.profit;
                newShopCharacter.profitDay = checkedCharacter.profitDay;
                newShopCharacter.profitMonth = checkedCharacter.profitMonth;
                newShopCharacter.profitYear = checkedCharacter.profitYear;
                newShopCharacter.price = checkedCharacter.price;
                newShopCharacter.type = checkedCharacter.type;
                await newShopCharacter.save();
            }
            else
            {
                await ShopCharacter.findOneAndUpdate({ typeCode: eachCharacter.typeCode },
                    {
                        $set: {
                            "name": typeof checkedCharacter.name !== 'undefined' && !isNull(checkedCharacter.name) ? checkedCharacter.name : '',
                            "image": typeof checkedCharacter.image !== 'undefined' && !isNull(checkedCharacter.image) ? checkedCharacter.image : '',
                            "description": typeof checkedCharacter.description !== 'undefined' && !isNull(checkedCharacter.description) ? checkedCharacter.description : '',
                            "transformPeriod": typeof checkedCharacter.transformPeriod !== 'undefined' && !isNull(checkedCharacter.transformPeriod) ? checkedCharacter.transformPeriod : 0,
                            "transformToTypeCode": typeof checkedCharacter.transformToTypeCode !== 'undefined' && !isNull(checkedCharacter.transformToTypeCode) ? checkedCharacter.transformToTypeCode : '',
                            "profit": typeof checkedCharacter.profit !== 'undefined' && !isNull(checkedCharacter.profit) ? checkedCharacter.profit : 0,
                            "profitDay": typeof checkedCharacter.profitDay !== 'undefined' && !isNull(checkedCharacter.profitDay) ? checkedCharacter.profitDay : 0,
                            "profitMonth": typeof checkedCharacter.profitMonth !== 'undefined' && !isNull(checkedCharacter.profitMonth) ? checkedCharacter.profitMonth : 0,
                            "profitYear": typeof checkedCharacter.profitYear !== 'undefined' && !isNull(checkedCharacter.profitYear) ? checkedCharacter.profitYear : 0,
                            "price": typeof checkedCharacter.price !== 'undefined' && !isNull(checkedCharacter.price) ? checkedCharacter.price : 0,
                            "type": typeof checkedCharacter.type !== 'undefined' && !isNull(checkedCharacter.type) ? checkedCharacter.type : '',
                        }
                    });
            }
        }
    }
    for(let eachItem of param.shopItemDb){
        const checkedItem = await Item.findOne({typeCode : eachItem.typeCode});
        if (!isNull(checkedItem)) {
            const isAlreadyExist = await ShopItem.findOne({ typeCode: eachItem.typeCode});
            if(isNull(isAlreadyExist))
            {
                const newShopItem = new ShopItem();
                newShopItem.name = checkedItem.name;
                newShopItem.typeCode = checkedItem.typeCode;
                newShopItem.image = checkedItem.image;
                newShopItem.description = checkedItem.description;
                newShopItem.transformPeriod = checkedItem.transformPeriod;
                newShopItem.transformToTypeCode = checkedItem.transformToTypeCode;
                newShopItem.profit = checkedItem.profit;
                newShopItem.price = checkedItem.price;
                newShopItem.type = checkedItem.type;
                await newShopItem.save();
            }
            else
            {
                await ShopItem.findOneAndUpdate({ typeCode: eachItem.typeCode },
                    {
                        $set: {
                            "name": typeof checkedItem.name !== 'undefined' && !isNull(checkedItem.name) ? checkedItem.name : '',
                            "image": typeof checkedItem.image !== 'undefined' && !isNull(checkedItem.image) ? checkedItem.image : '',
                            "description": typeof checkedItem.description !== 'undefined' && !isNull(checkedItem.description) ? checkedItem.description : '',
                            "transformPeriod": typeof checkedItem.transformPeriod !== 'undefined' && !isNull(checkedItem.transformPeriod) ? checkedItem.transformPeriod : 0,
                            "transformToTypeCode": typeof checkedItem.transformToTypeCode !== 'undefined' && !isNull(checkedItem.transformToTypeCode) ? checkedItem.transformToTypeCode : '',
                            "profit": typeof checkedItem.profit !== 'undefined' && !isNull(checkedItem.profit) ? checkedItem.profit : 0,
                            "price": typeof checkedItem.price !== 'undefined' && !isNull(checkedItem.price) ? checkedItem.price : 0,
                            "type": typeof checkedItem.type !== 'undefined' && !isNull(checkedItem.type) ? checkedItem.type : '',
                        }
                    });
            }
        }
    }

    return await ShopItem.find();
}