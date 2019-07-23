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
const Land = db.Land;
const LandGroup = db.LandGroup;
const ObjectId = require('mongoose').Types.ObjectId;
const uuid4 = require('uuid4');

module.exports = {
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
    let result = await Land.distinct('lands').lean();
    if (isNil(result)) {
        return historyArr;
    }
    for (let i = 0; i < result.length; i++) {
        let eachLand = result[i];
        let tradedHistories = eachLand.history.filter(h => {
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
        let findHistory = await Land.findOne(
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

        let resUpdate = await Land.updateOne(
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
        let isOwnedByAnotherUsers = await Land.findOne({ "lands.quadKey": q.quadKey }).select("userId lands -_id");
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

    const isUserBoughtLands = await Land.findOne({ userId: buyer }).lean().select("lands -_id");
    if (isNull(isUserBoughtLands)) {
        const newLand = new Land();
        newLand.userId = buyer;
        newLand.lands = landsObj;

        let inserted = await newLand.save();

        if (!isNull(inserted)) {
            buyNewlandResult = inserted.lands;
        } else {
            isSuccess = false;
            const failLand = new Land();
            failLand.userId = buyer;
            failLand.lands = landsWillBuy.map(l => {
                return {
                    quadKey: l.quadKey,
                    sellPrice: l.landPrice,
                    history: [{
                        buyer: buyer,
                        status: false
                    }]
                }
            });
            await failLand.save();
        }
    } else {
        let currentLands = isUserBoughtLands.lands;
        currentLands = currentLands.concat(landsObj);

        let landRs = await Land.findOneAndUpdate(
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
                await Land.findOneAndUpdate(
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

        await Land.findOneAndUpdate(
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


(async () => {

    // let result1 = await Land.findOne({ userId: new ObjectId('5c4035199a2bc17cf85585f5') });
    // //console.log(result1.lands);

    // // for(let land of  result1.lands){
    // //     if(land.forbidStatus === true){
    // //         console.log(land.quadKey)
    // //         //result1.lands.pull({ _id: land._id });
    // //     }
    // // }



    // //doc.array.pull(ObjectId)


    // let FB = result1.lands.filter( land => land.forbidStatus === true).map(land => ({ quadKey: land.quadKey }))
    // console.log('FB ', JSON.stringify(FB) )

    // const arrLand1 = flatMap(result1, u => {
    //     //console.log('u ', u);
    //     let user = {
    //         "_id": u.users[0]._id,
    //         "wToken": has(u.users[0], "wToken") ? u.users[0].wToken : null,
    //         "wId": has(u.users[0], "wId") ? u.users[0].wId : null,
    //         "role": has(u.users[0], "role") ? u.users[0].role : null
    //     };
    //     return u.lands.map(l => {
    //         return assign(l, { user });
    //     });
    // });




    // //add group lands
    // const result2 = await LandGroup.aggregate([
    //     { "$unwind": "$lands" },
    //     {
    //         "$group": {
    //             _id: "$userId",
    //             "lands": { "$push": "$lands" }
    //         }
    //     },
    //     { "$lookup": { from: 'users', localField: '_id', foreignField: '_id', as: 'users' } }
    // ]).exec();

    // const arrLand2 = flatMap(result2, u => {
    //     let user = {
    //         "_id": u.users[0]._id,
    //         "wToken": has(u.users[0], "wToken") ? u.users[0].wToken : null,
    //         "wId": has(u.users[0], "wId") ? u.users[0].wId : null,
    //         "role": has(u.users[0], "role") ? u.users[0].role : null
    //     };
    //     return u.lands.map(l => {
    //         return assign(l, { user });
    //     });
    // });

    // return arrLand1.concat(arrLand2);
})();


async function getAllLand() {
    const result1 = await Land.aggregate([
        { "$unwind": "$lands" },
        {
            "$group": {
                _id: "$userId",
                "lands": { "$push": "$lands" }
            }
        },
        { "$lookup": { from: 'users', localField: '_id', foreignField: '_id', as: 'users' } }
    ]).exec();
    const arrLand1 = flatMap(result1, u => {
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
    //add group lands
    const result2 = await LandGroup.aggregate([
        { "$unwind": "$lands" },
        {
            "$group": {
                _id: "$userId",
                "lands": { "$push": "$lands" }
            }
        },
        { "$lookup": { from: 'users', localField: '_id', foreignField: '_id', as: 'users' } }
    ]).exec();

    const arrLand2 = flatMap(result2, u => {
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

    return arrLand1.concat(arrLand2);
}

async function getAllLandByUserId(id) {
    return await Land.find({ userId: new ObjectId(id) });
}

async function updateLandsState(param) {

    let forSaleStatus = param.forSaleStatus;
    let quadKeys = param.quadKeys;
    let userId = ObjectId(param.userId);

    let result = true;
    let updateLandsResult = [];
    let user = await User.findOne({ "_id": userId }).select("wToken wId");

    for (let q of quadKeys) {
        const updatedLand = await Land.findOneAndUpdate(
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
            let lands = updatedLand.lands;
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
    let query = Land.aggregate(
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

async function addCategory(param) {
    const name = param.name;
    const userId = param.userId;

    const newLand = new Land();
    newLand.name = name;
    newLand.userId = new ObjectId(userId);
    newLand.lands = [];
    await newLand.save();
    return getAllCategory({ userId: userId });
}

async function transferLandCategory(param) {
    const userId = param.userId;
    const landId = param.landId;
    const oldCateId = param.oldCateId;
    const newCateId = param.newCateId;

    const landObj = await Land
        .findOne({ _id: new ObjectId(oldCateId) })
        .select({ lands: { $elemMatch: { _id: landId } } });

    let land = landObj.lands[0];

    await Land.findOneAndUpdate(
        {
            userId: new Object(userId),
            _id: oldCateId
        },
        { $pull: { lands: { _id: new ObjectId(landId) } } },
        { multi: true }
    );

    await Land.findOneAndUpdate(
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
    await Land.findOneAndUpdate(
        { "_id": cateId, "lands._id": landId },
        { $set: { "lands.$.name": name } });
    return getAllCategory({ userId: userId });
}

async function editCategory(param) {
    const name = param.name;
    const userId = param.userId;
    const cateId = new ObjectId(param.cateId);

    await Land.findOneAndUpdate({ _id: cateId }, { $set: { name: name } });
    return getAllCategory({ userId: userId });
}

async function deleteLandCategory(param) {
    const userId = param.userId;
    const cateId = param.cateId;
    const deletedLandCate = await Land.findOneAndRemove({ userId: userId, _id: cateId });

    const emptyLandCate = await Land.findOne({ userId: userId, name: 'empty' });
    if (isNull(emptyLandCate)) return getAllCategory({ userId: userId });

    //merge 2 array and update to empty land cate
    let lands = deletedLandCate.lands.concat(emptyLandCate.lands);
    await Land.findOneAndUpdate({ userId: userId, name: 'empty' }, { $set: { lands: lands } });
    return getAllCategory({ userId: userId });

}

async function createPrivateKey(){
    let id = uuid4().replace(/-/g,'');
    return bCrypt.hashSync(id);
}
