const db = require('../../../helpers/db');
const ObjectId = require('mongoose').Types.ObjectId;
const isNull = require('lodash.isnull');

const User = db.User;
const UserFriend = db.UserFriend;

module.exports = {
    add,
    unFriend,
    block,
    unBlock,
    checkStatusByUserName,
    getFriendListBlockList
};

async function add(param) {
    let userId = param.userId;
    let friendList = param.friendList;
    const isUserExist = await UserFriend.findOne({ userId: userId });
    if (isNull(isUserExist)) {
        const newUserFriend = new UserFriend();
        let newUserFriendList = friendList.map(f => {
            return { userId: new ObjectId(f.userId), name: f.name }
        });

        newUserFriend.userId = new ObjectId(userId);
        newUserFriend.friendList.list = newUserFriendList;

        await newUserFriend.save();
    }
    else {
        for (let i = 0; i < friendList.length; i++) {
            let friend = {
                userId: new ObjectId(friendList[i].userId),
                name: friendList[i].name
            };
            let opts = {
                "$addToSet": { "friendList.list": friend },
                "$pull": { "blockList.list": friend }
            };
            await UserFriend.findOneAndUpdate(
                { "userId": userId },
                opts
            );
        }
    }
    return getFriendListBlockList(param);
}

async function block(param) {
    let userId = param.userId;
    let blockList = param.blockList;
    console.log(param);
    const isUserExist = await UserFriend.findOne({ userId: userId });
    if (isNull(isUserExist)) {
        const newUserFriend = new UserFriend();
        let newUserBlockList = blockList.map(f => {
            return { userId: new ObjectId(f.userId), name: f.name }
        });
        newUserFriend.userId = new ObjectId(userId);
        newUserFriend.blockList.list = newUserBlockList;

        await newUserFriend.save();
    }
    else {
        for (let i = 0; i < blockList.length; i++) {

            let block = {
                userId: new ObjectId(blockList[i].userId),
                name: blockList[i].name
            };

            let opts = {
                "$addToSet": { "blockList.list": block },
                "$pull": { "friendList.list": block }
            };
            await UserFriend.findOneAndUpdate(
                { "userId": userId },
                opts
            );
        }
    }
    return getFriendListBlockList(param);
}

async function unFriend(param) {
    let userId = param.userId;
    let friendList = param.friendList;
    let result = await UserFriend.findOne({ userId: userId }).select("friendList.list");
    let updateList = result.friendList.list.filter(u => {
        return !friendList.some(f => f.name === u.name);
    });

    await UserFriend.findOneAndUpdate(
        {
            userId: userId
        },
        { $set: { "friendList.list": updateList } }
    );

    return getFriendListBlockList(param);
}

async function unBlock(param) {
    let userId = param.userId;
    let unblockFriends = param.unblockFriends;
    //let blockFriends = param.blockFriends;
    console.log(param);
    let result = await UserFriend.findOne({ userId: userId }).select("blockList.list");
    
    let updateList = result.blockList.list.filter(u => {
        return !unblockFriends.some(f => f.name === u.name);
    });

    await UserFriend.findOneAndUpdate(
        {
            userId: userId
        },
        { $set: { "blockList.list": updateList } }
    );
    return getFriendListBlockList(param);
}

async function checkStatusByUserName(param) {
    let statusFriend = false;
    let statusBlock = false;
    let friendId = null;
    const friend = await User.findOne({ userName: param.friendName });
    if (friend)
    {
        friendId = friend._id;
        const userFriend = await UserFriend.findOne({ userId: param.userId });
        if (userFriend) {
            userFriend.friendList.list.map(friend => {
                if (param.friendName === friend.name)
                    statusFriend = true;
                return null;
            });
            userFriend.blockList.list.map(block => {
                if (param.friendName === block.name)
                    statusBlock = true;
                return null;
            });
        }
    }

    return {
        userId: param.userId,
        friendId: friendId,
        friendName: param.friendName,
        statusFriend: statusFriend,
        statusBlock: statusBlock
    };
}

async function getFriendListBlockList(param) {
    let friendList = [];
    let blockList = [];

    let lists = await UserFriend.findOne(param);
    if(!isNull(lists))
    {
        friendList = lists.friendList.list.map(friend => ({ checked: false, friend: friend }));
        blockList = lists.blockList.list.map(friend => ({ checked: false, friend: friend }));
    }

    return { friendList: friendList, blockList: blockList };
}