const db = require('../../../helpers/db');
const Chat = db.Chat;
const omit = require('lodash.omit');
const isNil = require('lodash.isnil');

module.exports = {
    getAll,
    create,
    createMess,
    getAllMessInRoom,
    getMessInRoomByOffset
};

async function getAll() {
    return await Chat.find();
}

async function create(param, files) {
    if (await Chat.findOne({ name: param.name })) {
        throw 'ChatroomName "' + param.name + '" is already taken';
    }

    const newChat = new Chat();
    newChat.name = param.name;

    if (files && files.imageFile) {
        newChat.image.contentType = 'image/jpeg';
        newChat.image.data = files.imageFile.data;
    }

    await newChat.save();
}

async function createMess(param) {
    let name = param.room;
    let message = omit(param, 'room');
    let updatedChat = await Chat.findOneAndUpdate({ name: name }, { $push: { messages: message } }, { new: true });
    return await updatedChat.messages[updatedChat.messages.length - 1];
}

async function getAllMessInRoom(roomName) {
    let isExist = await Chat.findOne({ name: roomName });
    if (isExist) {
        let Last20Messages = await Chat.aggregate([
            { $match: { name: roomName } },
            { $project: { messages: '$messages', messSize: { $size: '$messages' } } },
            // {$project: {limit : {$subtract:["$messSize",1]}}}
            { $project: { messages: { $slice: ["$messages", { $subtract: ["$messSize", 20] }, 20] } } }
        ]);
        return Last20Messages.length > 0
            ? Last20Messages[0].messages
            : [];
    } else {
        let newRoom = new Chat();
        newRoom.messages = [];
        newRoom.name = roomName;
        await newRoom.save();
        return [];
    }
}

async function getMessInRoomByOffset(param) {
    let roomName = param.roomName;
    let n = param.n;
    let MessageList = await Chat.findOne({ name: roomName }).lean().select('messages');
    if (!isNil(MessageList)) {
        let messSize = MessageList.messages.length;
        let limit = Math.ceil(messSize / 20)-1;
        if (n > limit) {
            return {
                nextN: -1,
                messages: []
            }
        } else {
            let end = messSize - (n * 20) - 1;
            let start = end - 19;
            if(start < 0)start = 0;
            let MessageByOffset = MessageList.messages.slice(start,end+1);
            return {
                nextN: n + 1,
                messages: MessageByOffset.length > 0 ? MessageByOffset : []
            }
        }
    }
    return {
        nextN: -1,
        messages: []
    }
}