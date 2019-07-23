const db = require('../../../helpers/db');
const ObjectId = require('mongoose').Types.ObjectId;
const isNull = require('lodash.isnull');
const isUndefined = require('lodash.isundefined');
const InventoryCharacter = db.InventoryCharacter;
const LandCharacter = db.LandCharacter;
const landService = require('../../lands/services/index');


module.exports = {
    get,
    add,
    addSanta,
    move,
    moveToMap,
    using
};

//param: id --> return characters
async function get(param) {
    const result = await InventoryCharacter.findOne({ userId: param.userId }).lean().select('characters');
    if (isNull(result))
        return [];
    return result.characters;
}

//param: userId, array characters --> if exist typeCode amount + 1 --> return characters
async function add(param) {
    let userId = param.user._id;
    let characters = param.characters;

    // check that user is already has 1 or many characters in inventory
    const inventoryCharacter = await InventoryCharacter.findOne({ userId: userId }).lean().select('characters');
    if (isNull(inventoryCharacter)) {
        const newInventoryCharacter = new InventoryCharacter();
        newInventoryCharacter.userId = new ObjectId(userId);
        newInventoryCharacter.characters = characters;
        await newInventoryCharacter.save();

        return await get({ userId: userId });
    }
    else {
        let ICharacters = inventoryCharacter.characters;
        for (let character of ICharacters) {
            let foundIndex = -1;
            let foundCharacter = null;

            // check each element is exist
            for (let i = 0; i < characters.length; i++) {
                if (characters[i].typeCode === character.typeCode) {
                    foundIndex = i;
                    foundCharacter = characters[i];
                    break;
                }
            }

            //cập nhật số lượng
            if (foundIndex !== -1) {
                let characterNumber = typeof foundCharacter.amount === 'undefined' ? 1 : foundCharacter.amount;
                character.amount += characterNumber;
            }
        }

        let newChars = characters.filter(c => ICharacters.findIndex(glc => glc.typeCode === c.typeCode) === -1);
        for (let i = 0; i < newChars.length; i++) {
            let pos = findEmptyPosition(ICharacters);
            characters[i].position = pos;
            ICharacters.push(characters[i]);
        }

        let updatedInventoryCharacter = await InventoryCharacter.findOneAndUpdate(
            { "userId": userId },
            { "$set": { "characters": ICharacters } },
            { new: true }
        );

        // if (isNull(updatedInventoryCharacter))
        //     return [];
        return updatedInventoryCharacter.characters;
    }
}

//param: userId, array characters --> if exist typeCode amount + 1 --> return characters
async function addSanta(param) {
    let userId = param.userId;
    let characters = param.characters;
    const User = db.User;
    const user = await User.findOne({ _id: ObjectId(param.userId), role: 'manager' });
    if(!isNull(user))
    {
        const inventoryCharacter = await InventoryCharacter.findOne({ userId: userId }).lean().select('characters');
        if (isNull(inventoryCharacter)) {
            const newInventoryCharacter = new InventoryCharacter();
            newInventoryCharacter.userId = new ObjectId(userId);
            newInventoryCharacter.characters = characters;
            await newInventoryCharacter.save();
            return await get({ userId: userId });
        }
        else {
            let ICharacters = inventoryCharacter.characters;
            for (let character of ICharacters) {
                let foundIndex = -1;
                let foundCharacter = null;

                // check each element is exist
                for (let i = 0; i < characters.length; i++) {
                    if (characters[i].typeCode === character.typeCode) {
                        foundIndex = i;
                        foundCharacter = characters[i];
                        break;
                    }
                }

                //cập nhật số lượng
                if (foundIndex !== -1) {
                    let characterNumber = typeof foundCharacter.amount === 'undefined' ? 1 : foundCharacter.amount;
                    character.amount += characterNumber;
                }
            }

            let newChars = characters.filter(c => ICharacters.findIndex(glc => glc.typeCode === c.typeCode) === -1);
            for (let i = 0; i < newChars.length; i++) {
                let pos = findEmptyPosition(ICharacters);
                characters[i].position = pos;
                ICharacters.push(characters[i]);
            }

            let updatedInventoryCharacter = await InventoryCharacter.findOneAndUpdate(
                { "userId": userId },
                { "$set": { "characters": ICharacters } },
                { new: true }
            );

            return updatedInventoryCharacter.characters;
        }
    }
}

//param: userId, oldPosition, newPosition, typeCode  --> cập nhật Position character --> return characters
async function move(param) {

    if (param.oldPosition === param.newPosition) return await get({ userId: param.userId });

    await InventoryCharacter.findOne({ userId: ObjectId(param.userId) }, (err, result) => {
        if (err) {
            throw new Error(err);
        } else {
            let index = -1;
            for (let i = 0; i < result.characters.length; i++) {
                if (result.characters[i].position === param.oldPosition && result.characters[i].typeCode === param.typeCode) {
                    index = i;
                    break;
                }
            }

            let indexOfNewPosition = result.characters.findIndex(c => c.position === param.newPosition);

            // console.log("indexOfTheSameTypeCode", indexOfTheSameTypeCode);

            if (index !== -1) {
                if (indexOfNewPosition !== -1 && result.characters[index].typeCode === result.characters[indexOfNewPosition].typeCode) {
                    result.characters[indexOfNewPosition].amount += result.characters[index].amount;
                    result.characters.splice(index, 1);
                }
                else if (indexOfNewPosition === -1) {
                    result.characters[index].position = param.newPosition;
                }
            }
            result.save();
        }
    });

    return await get({ userId: param.userId });
}

//param: userId, characters[ {characterId, quadKey, amount}], a --> return characters của inventory và characters của landGame
async function moveToMap(param) {
    console.log('param',param);
    let userId = param.userId;
    let characters = param.characters;
    let insertParam = [];
    //all land of user
    const allLand = await landService.getAllLandByUserId(userId);

    const isICharacterExist = await InventoryCharacter.findOne({ userId: userId }).lean().select('characters');
    if (isNull(isICharacterExist) || isNull(allLand)) throw new Error("doesn't exist InventoryCharacter");

    let updatedInventoryCharacters = isICharacterExist.characters;

    for (let character of characters) {
        // const isCharacterExist = await LandCharacter.findOne({ userId: ObjectId(userId), typeCode: character.typeCode, quadKey: character.quadKey });
        // if (isNull(isCharacterExist)) {
            let isOwnedByUser = allLand[0].lands.find(l => l.quadKey === character.quadKey);
            if(!isNull(isOwnedByUser)){
                //only aceept when land is owned by user
                let newCharacter = character;
                newCharacter.userId = new ObjectId(userId);
                //handle tree transform typeCode
                let modifyNewTransformTypeCoode = newCharacter.transformToTypeCode.replace('-','-blood-');
                newCharacter.transformToTypeCode = modifyNewTransformTypeCoode;
                insertParam.push(newCharacter);
            }
            
        // }
    }

    //update amount when drag character from inventory to map
    for (let character of insertParam) {
       
        let findTypeCode =  character.oldTypeCode === character.typeCode ? character.typeCode : character.oldTypeCode;
        let index = updatedInventoryCharacters.findIndex(c => c.typeCode === findTypeCode);
        if (index !== -1) {
            updatedInventoryCharacters[index].amount -= 1;
            if (updatedInventoryCharacters[index].amount <= 0) {
                updatedInventoryCharacters.splice(index, 1);
            }
        }
    }

    //update inventory characters after move to map
    //remove if no more character in inventory
    if(updatedInventoryCharacters.length === 0){
        await InventoryCharacter.findOneAndRemove({"userId" : userId});
    }
    else{
        await InventoryCharacter.findOneAndUpdate(
            { "userId": userId },
            { "$set": { "characters": updatedInventoryCharacters } },
            { new: true }
        );
    }
    

    if (insertParam.length > 0) {
        await LandCharacter.insertMany(insertParam);
    }

    let allLandGameCharacter = await LandCharacter.find();
    if (isNull(allLandGameCharacter)) allLandGameCharacter = [];
    return { InventoryCharacter: updatedInventoryCharacters, LandGameCharacter: allLandGameCharacter };
}

//param: userId, typeCode, amount --> -amount hoặc xóa return characters của inventory
async function using(param) {
    let amount = isUndefined(param.amount) ? 1 : param.amount;
    await InventoryCharacter.findOne(
        { 'userId': ObjectId(param.userId) },
        (err, result) => {
            if (err) {
                throw new Error(err);
            } else {
                let resultCharacters = result.toObject().characters;
                let foundIndex = resultCharacters.findIndex(c => c.typeCode === param.typeCode);
                if (foundIndex !== -1) resultCharacters[foundIndex].amount -= amount;
                let filterCharacters = resultCharacters.filter(u => u.amount > 0);
                result.characters = filterCharacters;
                result.save();
            }
        }
    );

    return await get({ userId: param.userId });
}

function findEmptyPosition(inventoryCharacters) {
    let allPositions = inventoryCharacters.map(elm => elm.position);
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