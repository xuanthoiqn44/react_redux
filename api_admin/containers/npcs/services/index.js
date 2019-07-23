const db = require('../../../helpers/db');
const Npc = db.Npc;
const isNull = require('lodash.isnull');

module.exports = {
    add,
    edit,
    delete: _delete
};

async function add(param) {
    const checkedNpc = await Npc.findOne({ typeCode: param.typeCode });
    if (isNull(checkedNpc)) {
        const npc = new Npc();
        npc.name = typeof param.name !== 'undefined'&&!isNull(param.name)?param.name:'';
        npc.typeCode = param.typeCode;
        npc.dropItems = param.dropItems;
        await npc.save();
    }
    return await Npc.find().select('_id typeCode');
}

async function edit(param) {
    await Npc.findOneAndUpdate({ typeCode: param.typeCode },
        {
            $set: {
                "name": typeof param.name !== 'undefined'&&!isNull(param.name)?param.name:''
            }
        });
    return await Npc.find();
}

async function _delete(param) {
    await Npc.findOneAndDelete({ typeCode: param.typeCode });
    return await Npc.find();
}