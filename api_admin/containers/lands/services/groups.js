const isNil = require('lodash.isnil');
const isNull = require('lodash.isnull');
const assign = require('lodash.assign');
const findIndex = require('lodash.findindex');
const has = require('lodash.has');
const isUndefined = require('lodash.isundefined');
const bCrypt = require('bcryptjs');
const flatMap = require('lodash.flatmap');

const db = require('../../../helpers/db');
const User = db.User;
const LandGroup = db.LandGroup;
const ObjectId = require('mongoose').Types.ObjectId;
const uuid4 = require('uuid4');

module.exports = {
	groupPuschaseLand,
    getAllHistoryTradingLandById,
    removeHistory,
    getAllLand,
    purchaseLand,
    getAllLandByUserId,
    updateLandsState,
    getAllCategory,
    addCategory,
    editCategory,
    transferLandCategory,
    deleteLandCategory,
    editLand,
    createPrivateKey
};

async function getAllHistoryTradingLandById(param) {
    let historyArr = [];
    let userId = param.userId;
    let result = await LandGroup.distinct('lands').lean();
    if (isNil(result)) {
        return historyArr;
    }
    for (let i = 0; i < result.length; i++) {
        let eachLand = result[i];
        let tradedHistories = eachLandGroup.history.filter(h => {
            if (isNil(h.seller)) {
                //nếu seller là null, => chỉ tìm với trường buyer
                return (h.buyer.toString() === userId && !h.buyerDeleted);
            } else {
                //nếu seller khác null, => tìm cả trong trưởng seller và buyer
                return (
                    h.buyer.toString() === userId && !h.buyerDeleted
                    || h.seller.toString() === userId && !h.sellerDeleted
                );
            }
        });

        tradedHistories = tradedHistories.map(h => {
            return assign(h, { "landId": result[i]._id, "quadKey": result[i].quadKey });
        });

        historyArr = historyArr.concat(tradedHistories);
    }
    return historyArr;
}

async function removeHistory(histories) {
    let arrRes = await Promise.all(histories.map(async history => {
        let findHistory = await LandGroup.findOne(
            { 'lands.history._id': ObjectId(history.historyId) },
            { 'lands.$.history._id': ObjectId(history.historyId) },
            (err, res) => {
                console.log(err);
            }
        ).exec();

        if (!findHistory || !findHistory.lands || !findHistory.lands[0]) return false;
        let indexHistory = findIndex(findHistory.lands[0].history, { '_id': ObjectId(history.historyId) });

        if (indexHistory === -1) return false;
        let location = '';
        if (has(history, 'buyerDeleted')) {
            location = 'lands.$.history.' + indexHistory + '.buyerDeleted';
        } else if (has(history, 'sellerDeleted')) {
            location = 'lands.$.history.' + indexHistory + '.sellerDeleted';
        }

        let resUpdate = await LandGroup.updateOne(
            { 'lands.history._id': ObjectId(history.historyId) },
            { $set: { [location]: true } },
            (err, res) => {
                console.log(err);
            }
        ).exec();

        return resUpdate.ok > 0 ? { historyId: history.historyId, success: true } : false;
    }));
    return { success: !arrRes.some(res => !res.success), updateHistories: arrRes.filter(res => res.success) }
}

//param = { userId, quadKeys, cateName }
async function groupPuschaseLand(param){
	let { userId, quadKeys, cateName } = param;
	let rs = await purchaseLand(param);
	//console.log('rs333333333 ', rs);
	if(cateName.trim() === "") return rs;
	let emptyLands = await LandGroup.findOne({ name: 'empty' }).lean();
	//console.log('emptyLands ', emptyLands._id)
	let fLand = emptyLands.lands.filter(land => quadKeys.some(objQK => objQK.quadKey === land.quadKey));
	//let fLandId = fLand.map(land => (new Object(land._id)));
	//console.log('fLand ', fLand);

	let objAddCate = { name: cateName, userId };
	let newCate = await addCategoryGroup(objAddCate);
	//console.log( 'newCateId ', newCate._id );
	let k = await Promise.all(
		fLand.map(land => transferLandCategoryGroup({ userId: userId, landId: land._id, oldCateId: emptyLands._id, newCateId: newCate._id }))
	);
	//console.log('k ', k);

	//console.log('land333333333 ', land);

	return rs;
    //param = { userId, landId, oldCateId, newCateId }
    //let emptyLands = await LandGroup.findOne({ name: 'empty' }).lean();
    //transferLandCategory();
}
	

//})({ userId: '5c53b60c75fb7c2d100c95f9', userRole: 'manager', quadKeys: [{ landPrice: 0, quadKey: '132110320120103311333131' }, { landPrice: 0, quadKey: '132110320120103311333130' }] });

//param = { userId: '5c53b60c75fb7c2d100c95f9', userRole: 'manager', quadKeys: [ { landPrice: 0, quadKey: '132110320120112200222101' } ] }
async function purchaseLand(param) {
    let buyer = new ObjectId(param.userId);
    let quadKeys = param.quadKeys;

    let buyNewlandResult = [];
    let updateLandResult = [];

    let isSuccess = true;

    let anotherOwners = [];
    let landsWillTrade = [];
    let landsWillUpdate = [];
    let landsWillBuy = [];

    for (const q of quadKeys) {
        let isOwnedByAnotherUsers = await LandGroup.findOne({ "lands.quadKey": q.quadKey }).select("userId lands -_id");
        if (!isNull(isOwnedByAnotherUsers)) {
            landsWillTrade.push(q);
            let isExists = anotherOwners.find(u => u.userId.toString() === isOwnedByAnotherUsers.userId.toString());
            if (isUndefined(isExists)) {
                anotherOwners.push({
                    userId: isOwnedByAnotherUsers.userId,
                    lands: isOwnedByAnotherUsers.lands
                });
            }
        }
        else {
            landsWillBuy.push(q);
        }
    }


    
    

    //landsWillTrade -  những land mua lại từ người khác ( quadKeys tượng trưng )
    //landsWillBuy - những land mua từ hệ thống ( đất chưa ai sỡ hữu)
    //anotherOwners - dữ liệu danh sách người bán
    for (let i = 0; i < anotherOwners.length; i++) {
        landsWillUpdate = anotherOwners[i].lands.filter(elm => {
            let foundLand = landsWillTrade.find(lwt => lwt.quadKey === elm.quadKey);
            return (!isUndefined(foundLand));
        });

        anotherOwners[i].lands = anotherOwners[i].lands
            .filter(elm => {
                let foundLand = landsWillTrade.find(lwt => lwt.quadKey === elm.quadKey);
                return (isUndefined(foundLand));
            });
    }


    console.log("-------==================anotherOwners",anotherOwners);
    console.log("-------==================-------==================");



    //landsWillUpdate - những land mua lại từ khác người và update vào chính mình ( dữ liệu đủ )
    //anotherOwers - những user khác bán đất ( đã xóa đi số land sẽ bán )
    for (let i = 0; i < landsWillUpdate.length; i++) {
        let lastHistory = landsWillUpdate[i].history[landsWillUpdate[i].history.length - 1];
        landsWillUpdate[i].forSaleStatus = false;

        let newHistory = {
            buyerDeleted: lastHistory.buyerDeleted,
            sellerDeleted: lastHistory.sellerDeleted,
            soldPrice: landsWillUpdate[i].sellPrice,
            buyer: buyer,
            seller: lastHistory.buyer,
        };

        landsWillUpdate[i].history.push(newHistory);
    }
   
    let landsObj = landsWillBuy.map(l => {
        return {
            quadKey: l.quadKey,
            sellPrice: l.landPrice,
            initialPrice: l.initialPrice > 0?l.initialPrice:l.landPrice,
            //privateKey : bCrypt.hashSync(uuid4().replace(/-/g,''),10),
            //publicKey : bCrypt.hashSync(uuid4().replace(/-/g,''),10),
            privateKey : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            publicKey:'yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy',
            forbidStatus: param.userRole==='manager',
            history: [{
                buyer: buyer,
                soldPrice: l.landPrice,
            }]
        }
    }).concat(landsWillUpdate);


    console.log("landsWillUpdate",landsWillUpdate);

    const isUserBoughtLands = await LandGroup.findOne({ userId: buyer }).lean().select("lands -_id");
    if (isNull(isUserBoughtLands)) {
        const newLandGroup = new LandGroup({
        	userId: buyer,
        	lands: landsObj
        });
        let inserted = await newLandGroup.save();

        if (!isNull(inserted)) {
            buyNewlandResult = inserted.lands;
        } else {
            isSuccess = false;
            const failLand = new LandGroup();
            failLandGroup.userId = buyer;
            failLandGroup.lands = landsWillBuy.map(l => {
                return {
                    quadKey: l.quadKey,
                    sellPrice: l.landPrice,
                    history: [{
                        buyer: buyer,
                        status: false
                    }]
                }
            });
            await failLandGroup.save();
        }
    } else {
        let currentLands = isUserBoughtLands.lands;
        currentLands = currentLands.concat(landsObj);

        let landRs = await LandGroup.findOneAndUpdate(
            { userId: buyer },
            { $set: { lands: currentLands } },
            { new: true }
        );

        if (!isNull(landRs)) {
            for (let i = 0; i < landsObj.length; i++) {
                let foundLand = landRs.lands.find(l => l.quadKey === landsObj[i].quadKey);
                if (!isNull(foundLand)) {
                    updateLandResult.push(foundLand);
                }
            }
        }
        else {
            isSuccess = false;
            let failLands = landsWillBuy.map(l => {
                return {
                    quadKey: l.quadKey,
                    sellPrice: l.landPrice,
                    history: [{
                        buyer: buyer,
                        status: false
                    }]
                }
            });
            for (let ld of failLands) {
                await LandGroup.findOneAndUpdate(
                    { userId: buyer },
                    { $push: { lands: ld } },
                    { new: true }
                );
            }
        }
    }



    // console.log("another",anotherOwners);

    for (const o of anotherOwners) {

        console.log("each owner",o);

        console.log("length of lands",o.lands);

        await LandGroup.findOneAndUpdate(
            { "userId": new ObjectId(o.userId) },
            { $set: { "lands": o.lands } },
            { new: true },
            (err, landRs) => {
                if (err) {
                    isSuccess = false;
                    throw new Error(err.toString());
                }
            });
    }

    let result = buyNewlandResult.concat(updateLandResult);
    let user = await User.findOne({ "_id": buyer }).select("_id wId wToken role").lean();
    //console.log('user ', user);
    //console.log('has(user, "role") ', has(user, "role"))
    result = result.map(elm => {
        let landObj = elm.toObject();
        let userToMap = {
            "_id": user._id,
            "wId": has(user, "wId") ? user.wId : null,
            "wToken": has(user, "wToken") ? user.wToken : null,
            "role": has(user, "role") ? user.role : null
        };
        landObj = assign(landObj, { "user": userToMap });
        //console.log('landObj ', landObj)
        return landObj;
    });

    //await wait(10000);
    return { updates: result, success: isSuccess };
}

async function wait(milisecons){
    return new Promise((resolve, reject) => {
        setTimeout(resolve, milisecons);
    });
}

async function getAllLand() {
    let query = LandGroup.aggregate([
        { "$unwind": "$lands" },
        {
            "$group": {
                _id: "$userId",
                "lands": { "$push": "$lands" }
            }
        },
        { "$lookup": { from: 'users', localField: '_id', foreignField: '_id', as: 'users' } }
    ]);
    let result = await query.exec();
    return flatMap(result, u => {
        //console.log('u ', u);
        let user = {
            "_id": u.users[0]._id,
            "wToken": has(u.users[0], "wToken") ? u.users[0].wToken : null,
            "wId": has(u.users[0], "wId") ? u.users[0].wId : null,
            "role": has(u.users[0], "role") ? u.users[0].role : null
        };
        return u.lands.map(l => {
            return assign(l, { user });
        });
    });
}

async function getAllLandByUserId(id) {
    return await LandGroup.find({ userId: new ObjectId(id) });
}

async function updateLandsState(param) {

    let forSaleStatus = param.forSaleStatus;
    let quadKeys = param.quadKeys;
    let userId = ObjectId(param.userId);

    let result = true;
    let updateLandsResult = [];
    let user = await User.findOne({ "_id": userId }).select("wToken wId");

    for (let q of quadKeys) {
        const updatedLand = await LandGroup.findOneAndUpdate(
            {
                $and: [
                    { "lands.quadKey": q.quadKey },
                    { "userId": userId }
                ]
            },
            {
                $set: {
                    "lands.$.forSaleStatus": forSaleStatus,
                    "lands.$.sellPrice": q.landPrice,
                }
            }, { new: true }).lean();
        if (!updatedLand) {
            result = false;
        } else {
            //get effected land object
            let lands = updatedLandGroup.lands;
            let landObj = lands.find(l => l.quadKey === q.quadKey);

            landObj = assign(landObj, { "user": user.toObject() });
            // // add user key to land object 
            // //push to effected lands
            updateLandsResult.push(landObj);
        }
    }
    return {
        updates: updateLandsResult,
        success: result
    }
}

async function getAllCategory(param) {
    let userId = param.userId;
    let query = LandGroup.aggregate(
        [
            { $match: { "userId": ObjectId(userId) } },
            {
                $addFields: {
                    "checked": false,
                }
            },
            {
                $project: {
                    "checked": "$checked",
                    "_id": 0,
                    "category": {
                        "name": "$name",
                        "_id": "$_id",
                        "lands": {
                            $map: {
                                "input": "$lands",
                                as: "land",
                                in: {
                                    "land": {
                                        "sellPrice": "$$land.sellPrice",
                                        "forSaleStatus": "$$land.forSaleStatus",
                                        "name": "$$land.name",
                                        "_id": "$$land._id",
                                        "quadKey": "$$land.quadKey",
                                        "history": "$$land.history",
                                        "createdDate": "$$land.createdDate",
                                        "cateId": "$_id"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    "category.lands.checked": false,
                }
            },
            {
                $project: {
                    "checked": "$checked",
                    "category": "$category"
                }
            }
        ]
    )
    let result = await query.exec();
    return result;
    //  return {'q1' : cates,'q2':result};
    //  return cates;
}

async function addCategoryGroup(param) {
    const name = param.name;
    const userId = param.userId;

    const newLandGroup = new LandGroup({
    	name: param.name,
    	userId: new ObjectId(param.userId),
    	lands: param.lands,
    });
    return newLandGroup.save();
}

async function addCategory(param) {
    const name = param.name;
    const userId = param.userId;

    const newLandGroup = new LandGroup();
    newLandGroup.name = name;
    newLandGroup.userId = new ObjectId(userId);
    newLandGroup.lands = [];
    await newLandGroup.save();
    return getAllCategory({ userId: userId });
}

//param = { userId, landId, oldCateId, newCateId };
async function transferLandCategoryGroup(param) {
    const userId = param.userId;
    const landId = param.landId;
    const oldCateId = param.oldCateId;
    const newCateId = param.newCateId;

    const landObj = await LandGroup
        .findOne({ _id: new ObjectId(oldCateId) })
        .select({ lands: { $elemMatch: { _id: landId } } });

    let land = landObj.lands[0];

    let remove = LandGroup.findOneAndUpdate({ userId: new Object(userId), _id: oldCateId }, { $pull: { lands: { _id: new ObjectId(landId) } } }, { multi: true });
    let add = LandGroup.findOneAndUpdate({ userId: new Object(userId), _id: newCateId }, { $push: { lands: land } });
    await Promise.all([ remove, add ]);
}

async function transferLandCategory(param) {
    const userId = param.userId;
    const landId = param.landId;
    const oldCateId = param.oldCateId;
    const newCateId = param.newCateId;

    const landObj = await LandGroup
        .findOne({ _id: new ObjectId(oldCateId) })
        .select({ lands: { $elemMatch: { _id: landId } } });

    let land = landObj.lands[0];

    await LandGroup.findOneAndUpdate(
        {
            userId: new Object(userId),
            _id: oldCateId
        },
        { $pull: { lands: { _id: new ObjectId(landId) } } },
        { multi: true }
    );

    await LandGroup.findOneAndUpdate(
        {
            userId: new Object(userId),
            _id: newCateId
        },
        { $push: { lands: land } }
    );

    return getAllCategory({ userId: userId });
}

async function editLand(param) {
    let landId = param.landId;
    let userId = param.userId;
    let name = param.name;
    let cateId = param.cateId;
    await LandGroup.findOneAndUpdate(
        { "_id": cateId, "lands._id": landId },
        { $set: { "lands.$.name": name } });
    return getAllCategory({ userId: userId });
}

async function editCategory(param) {
    const name = param.name;
    const userId = param.userId;
    const cateId = new ObjectId(param.cateId);

    await LandGroup.findOneAndUpdate({ _id: cateId }, { $set: { name: name } });
    return getAllCategory({ userId: userId });
}

async function deleteLandCategory(param) {
    const userId = param.userId;
    const cateId = param.cateId;
    const deletedLandCate = await LandGroup.findOneAndRemove({ userId: userId, _id: cateId });

    const emptyLandCate = await LandGroup.findOne({ userId: userId, name: 'empty' });
    if (isNull(emptyLandCate)) return getAllCategory({ userId: userId });

    //merge 2 array and update to empty land cate
    let lands = deletedLandCate.lands.concat(emptyLandCate.lands);
    await LandGroup.findOneAndUpdate({ userId: userId, name: 'empty' }, { $set: { lands: lands } });
    return getAllCategory({ userId: userId });

}

async function createPrivateKey(){
    let id = uuid4().replace(/-/g,'');
    return bCrypt.hashSync(id);
}
