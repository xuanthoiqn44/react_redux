const db = require('../../../helpers/db');
const LandCharacter = db.LandCharacter;
const LandItem = db.LandItem;
const InventoryCharacter = db.InventoryCharacter
const ObjectId = require('mongoose').Types.ObjectId;
const isNull = require('lodash.isnull');
const Character = db.Character;
const isUndefined = require('lodash.isundefined');

module.exports = {
    get,
    addCharacter,
    getCharacterByUser,
    moveCharacter,
    moveCharacterToInventory
};

async function get() {
    let characters = await LandCharacter.find();
    let items = await LandItem.find();
    return {
        characters,
        items
    }
}

async function addCharacter(param) {
    for (let eachLandCharacter of param) {
        const checkedLandCharacter = await LandCharacter.findOne({ "userId": ObjectId(param.userId), "typeCode": param.typeCode, "quadKey": param.quadKey });
        if (isNull(checkedLandCharacter)) {
            const landCharacter = new LandCharacter();
            landCharacter.name = typeof eachLandCharacter.name !== 'undefined' && !isNull(eachLandCharacter.name) ? eachLandCharacter.name : '';
            landCharacter.userId = ObjectId(eachLandCharacter.userId);
            landCharacter.typeCode = eachLandCharacter.typeCode;
            landCharacter.quadKey = eachLandCharacter.quadKey;
            landCharacter.type = eachLandCharacter.type;
            landCharacter.description = eachLandCharacter.description;
            landCharacter.amount = typeof eachLandCharacter.amount !== 'undefined' && !isNull(eachLandCharacter.amount) ? eachLandCharacter.amount : 0;
            await landCharacter.save();
        }
        else {
            await LandCharacter.findOneAndUpdate({ "userId": ObjectId(param.userId), "typeCode": param.typeCode, "quadKey": param.quadKey },
                {
                    $set: {
                        "name": typeof eachLandCharacter.name !== 'undefined' && !isNull(eachLandCharacter.name) ? eachLandCharacter.name : '',
                        "quadKey": typeof eachLandCharacter.quadKey !== 'undefined' && !isNull(eachLandCharacter.quadKey) ? eachLandCharacter.quadKey : '',
                        "description": typeof eachLandCharacter.description !== 'undefined' && !isNull(eachLandCharacter.description) ? eachLandCharacter.description : '',
                        "type": typeof eachLandCharacter.type !== 'undefined' && !isNull(eachLandCharacter.type) ? eachLandCharacter.type : '',
                        "amount": typeof eachLandCharacter.amount !== 'undefined' && !isNull(eachLandCharacter.amount) ? eachLandCharacter.amount : 0
                    }
                });
        }
    }

    return await LandCharacter.find();
}

async function getCharacterByUser(param) {
    const allLand = await LandCharacter.find();
    for (let eachElement of allLand) {
        let createdDate = (eachElement.createdDate);
        let now = (new Date().getTime());
        let timeFromCreateDate = now - createdDate; //millisecond
        timeFromCreateDate = Math.floor(timeFromCreateDate / 1000);

        let createdDateWater = (eachElement.createdDateWater);
        let timeFromCreatedDateWater = now - createdDateWater; //millisecond
        timeFromCreatedDateWater = Math.floor(timeFromCreatedDateWater / 1000);

        let waterPeriod = parseInt(eachElement.waterPeriod);

        let timeWaterLeft = waterPeriod - timeFromCreatedDateWater;
        if (timeWaterLeft <= 4*24*60*60) {
            await LandCharacter.findOneAndUpdate({
                'quadKey': eachElement.quadKey,
                'typeCode': eachElement.typeCode
            },{
                "$set": {
                    "waterWarning": true
                }
            });
        }

        if (timeFromCreatedDateWater >= waterPeriod) {
            await LandCharacter.findOneAndRemove({
                'quadKey': eachElement.quadKey,
                'typeCode': eachElement.typeCode
            });

            const notifyService = require('../../../containers/notifies/services');
            await notifyService.send({
                userId: eachElement.userId,
                title: '나무는 죽었다.',
                content: `그 나무는 ${ eachElement.quadKey } 위치에서 죽었습니다.`,
                type: 'lands'
            });
        }

        let transformPeriod = parseInt(eachElement.transformPeriod);
        if (timeFromCreateDate >= transformPeriod) {
            let otherResult = await LandCharacter.findOne({
                'userId': ObjectId(param.userId),
                'quadKey': eachElement.quadKey,
                'typeCode': eachElement.typeCode
            });
            let timeLeft = timeFromCreateDate - transformPeriod;

            const updatedItem = await Character.findOne({ 'typeCode': eachElement.transformToTypeCode });
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

            eachElement = otherResult;
        }
    }
    const byUser = allLand.filter(ch => ch.userId.toString() === param.userId);
    return { characters: allLand, charactersByUser: byUser }
}

async function moveCharacter(param) {
    await LandCharacter.findOneAndUpdate(
        { "userId": ObjectId(param.userId), "quadKey": param.oldQuadKey, "typeCode": param.typeCode },
        {
            "$set": {
                "quadKey": param.newQuadKey,
                "amount": (isUndefined(param.amount) ? 1 : param.amount)
            }
        }
    );
    return await getCharacterByUser({ "userId": param.userId });
}

//param: userId, quadKey,, characterId --> update characters --> return characters
async function moveCharacterToInventory(param) {
    let userId = param.userId;
    let characters = param.characters;

    let resizeCharacterAmount = [];
    for (let eachCharacter of characters) {
        await LandCharacter.findByIdAndRemove(ObjectId(eachCharacter._id));
        let index = resizeCharacterAmount.findIndex(i => i.typeCode === eachCharacter.typeCode);
        if (index !== -1) {
            resizeCharacterAmount[index].amount += 1;
        } else {
            let tempCharacter = eachCharacter;
            eachCharacter.amount = 1;
            resizeCharacterAmount.push(tempCharacter);
        }
    }

    await InventoryCharacter.findOne({ "userId": ObjectId(userId) }, (err, result) => {
        if (err) {
            throw new Error(err);
        }
        else if (!result) {

            let insertCharacters = resizeCharacterAmount.map((val, index) => {
                val.position = index;
                return val;
            });

            const newInventoryCharacter = new InventoryCharacter();
            newInventoryCharacter.userId = new ObjectId(userId);
            newInventoryCharacter.characters = insertCharacters;
            newInventoryCharacter.save();
        } else {
            for (let character of resizeCharacterAmount) {
                let isItemExist = result.characters.findIndex(i => i.typeCode === character.typeCode);
                if (isItemExist !== -1) {
                    result.characters[isItemExist].amount += character.amount;
                } else {
                    let position = findEmptyPosition(result.characters);
                    character.position = position;
                    result.characters.push(character);
                }
            }
            result.save();
        }
    });

    const landCharacter = await getCharacterByUser({ "userId": param.userId });
    const inventoryCharacter = await InventoryCharacter.findOne({ "userId": param.userId }).lean().select('characters');
    return {
        LandCharacter: landCharacter.characters,
        InventoryCharacter: inventoryCharacter
    }
}

function findEmptyPosition(inventoryCharacters) {
    if (typeof inventoryCharacters === 'undefined' || !inventoryCharacters || inventoryCharacters.length === 0) return 0;
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
