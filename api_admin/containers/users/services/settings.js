const db = require('../../../helpers/db');
const UserSetting = db.UserSetting;
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    get,
    set,
    getLandShowInfo,
    setLandShowInfo,
    getBgMusic,
    setBgMusic,
    getEffMusic,
    setEffMusic
};

async function get(param) {
    let userId = new ObjectId(param.userId);

    const userSetting = await UserSetting.findOne({ "userId": userId })
        .select("land bgMusic effMusic -_id");

    let land = userSetting&&(userSetting.land) ? userSetting.land : [];
    let bgMusic = userSetting&&(userSetting.bgMusic) ? userSetting.bgMusic : [];
    let effMusic = userSetting&&(userSetting.effMusic) ? userSetting.effMusic : [];
    return {
        land,
        bgMusic,
        effMusic
    }
}

async function set(param) {
    const userSetting = await UserSetting.findOneAndUpdate({userId: ObjectId(param.userId)},{ $set: { "effMusic": param.effMusic, "bgMusic": param.bgMusic, "land": param.land } }, { new: true });
    let land = userSetting&&(userSetting.land) ? userSetting.land : [];
    let bgMusic = userSetting&&(userSetting.bgMusic) ? userSetting.bgMusic : [];
    let effMusic = userSetting&&(userSetting.effMusic) ? userSetting.effMusic : [];
    return {
        land,
        bgMusic,
        effMusic
    }
}

async function getLandShowInfo(param) {
    let userId = new ObjectId(param.userId);
    const userSetting = await UserSetting.findOne({ "userId": userId })
        .select("land bgMusic effMusic -_id");
    let land = userSetting&&(userSetting.land) ? userSetting.land : [];
    return {
        land
    }
}

async function setLandShowInfo(param) {
    let userId = new ObjectId(param.userId);
    const userSetting = await UserSetting.findOneAndUpdate( {userId: userId},{ $set: { "land": param.land } }, { new: true });
    let land = userSetting&&(userSetting.land) ? userSetting.land : [];
    return {
        land
    }
}

async function getBgMusic(param) {
    let userId = new ObjectId(param.userId);

    const userSetting = await UserSetting.findOne({ "userId": userId })
        .select("land bgMusic effMusic -_id");

    let bgMusic = userSetting&&(userSetting.bgMusic) ? userSetting.bgMusic : [];
    return {
        bgMusic
    }
}

async function setBgMusic(param) {
    console.log('setBgMusic param ', param);
    let userId = new ObjectId(param.userId);
    const userSetting = await UserSetting.findOneAndUpdate( {userId: userId}, { $set: { "bgMusic": param.bgMusic } }, { new: true });

    let bgMusic = userSetting && userSetting.bgMusic ? userSetting.bgMusic : [];
    return {
        bgMusic
    }
}

async function getEffMusic(param) {
    let userId = new ObjectId(param.userId);
    const userSetting = await UserSetting.findOne({ "userId": userId })
        .select("land bgMusic effMusic -_id");
    let effMusic = userSetting&&(userSetting.effMusic) ? userSetting.effMusic : [];
    return {
        effMusic
    }
}

async function setEffMusic(param) {
    let userId = new ObjectId(param.userId);
    const userSetting = await UserSetting.findOneAndUpdate( {userId: userId},{ $set: { "effMusic": param.effMusic } }, { new: true });
    let effMusic = userSetting&&(userSetting.effMusic) ? userSetting.effMusic : [];
    return {
        effMusic
    }
}