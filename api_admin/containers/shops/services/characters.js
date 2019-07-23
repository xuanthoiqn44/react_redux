const db = require('../../../helpers/db');
const ShopCharacter = db.ShopCharacter;
const Character = db.Character;
const isNull = require('lodash.isnull');

module.exports = {
    get,
    add
};

async function get() {
    return await ShopCharacter.find();
}

async function add(param) {
    for(let eachCharacter of param){
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
    return param;
}