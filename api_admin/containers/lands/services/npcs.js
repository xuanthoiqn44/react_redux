const db = require('../../../helpers/db');
const LandNpc = db.LandNpc;
const isNull = require('lodash.isnull');

module.exports = {
    get,
    add
};

// --> return land npcs
async function get() {
    return await LandNpc.find().lean();
}

//param: name, typeCode, description, array positions quadKeys, array of drop Item if typeCode exist update other value // --> return npcs
async function add(param) {
    const isExist = await LandNpc.findOne({ typeCode: param.typeCode }).lean().select('positions');
    if (isNull(isExist)) {
        const landNpc = new LandNpc();
        landNpc.name = param.name;
        landNpc.typeCode = param.typeCode;
        landNpc.description = param.description;
        landNpc.positions = param.positions;
        landNpc.dropItems = param.dropItems;
        let result = await landNpc.save();
        return result.positions;
    } else {
        let updatePositions = isExist.positions;
        let newPositions = param.positions.filter(q => !updatePositions.find(elm => elm.quadKey === q.quadKey));
        updatePositions = [...updatePositions, ...newPositions];
        await LandNpc.findOneAndUpdate({ typeCode: param.typeCode }, { $set: { positions: updatePositions, dropItems: param.dropItems } });
        return updatePositions;
    }
}
