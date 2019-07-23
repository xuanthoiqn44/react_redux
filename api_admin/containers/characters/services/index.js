const db = require('../../../helpers/db');
const Character = db.Character;
const isNull = require('lodash.isnull');

module.exports = {
    get,
    add,
    edit,
    delete: _delete
};

async function get(param) {
    return await Character.findById(param.id);
}

async function add(param) {
    for (let eachCharacter of param) {
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

    return await Character.find().select('_id typeCode');

    // return [];
}

async function edit(param) {
    await Character.findOneAndUpdate({ typeCode: param.typeCode },
        {
            $set: {
                "name": typeof param.name !== 'undefined' && !isNull(param.name) ? param.name : '',
                "image": typeof param.image !== 'undefined' && !isNull(param.image) ? param.image : '',
                "description": typeof param.description !== 'undefined' && !isNull(param.description) ? param.description : '',
                "transformPeriod": typeof param.transformPeriod !== 'undefined' && !isNull(param.transformPeriod) ? param.transformPeriod : 0,
                "transformToTypeCode": typeof param.transformToTypeCode !== 'undefined' && !isNull(param.transformToTypeCode) ? param.transformToTypeCode : '',
                "profit": typeof param.profit !== 'undefined' && !isNull(param.profit) ? param.profit : 0,
                "profitDay": typeof param.profitDay !== 'undefined' && !isNull(param.profitDay) ? param.profitDay : 0,
                "profitMonth": typeof param.profitMonth !== 'undefined' && !isNull(param.profitMonth) ? param.profitMonth : 0,
                "profitYear": typeof param.profitYear !== 'undefined' && !isNull(param.profitYear) ? param.profitYear : 0,
                "price": typeof param.price !== 'undefined' && !isNull(param.price) ? param.price : 0,
            }
        });
    return await Character.find();
}

async function _delete(param) {
    await Character.findOneAndDelete({ typeCode: param.typeCode });
    return await Character.find();
}