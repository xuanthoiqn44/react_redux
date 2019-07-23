const db = require('../../../helpers/db');
const LandEnv = db.LandEnv;
const isNull = require('lodash.isnull');

module.exports = {
    add,
    get
};

async function add(param) {
    for (let i = 0; i < param.length; i++) {
        const checkedLandEnv = await LandEnv.findOne({ quadKey: param[i].quadKey });

        if (isNull(checkedLandEnv)) {
            const landEnv = new LandEnv();
            landEnv.quadKey = param[i].quadKey;
            landEnv.typeCode = param[i].typeCode;
            landEnv.moveStatus = (typeof param[i].moveStatus !== 'undefined' && param[i].moveStatus);
            await landEnv.save();
        }
        else
        {
            await LandEnv.findOneAndUpdate(
                { quadKey: param[i].quadKey },
                { "$set": {
                    "quadKey": param[i].quadKey,
                    "typeCode": param[i].typeCode,
                    "moveStatus": (typeof param[i].moveStatus !== 'undefined' && param[i].moveStatus)
                }}
            );
        }
    }
    return await LandEnv.find();
}

async function get() {
    return await LandEnv.find();
}