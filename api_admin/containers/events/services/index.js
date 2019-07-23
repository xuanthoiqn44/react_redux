const db = require('../../../helpers/db');
const RpsEvent = db.RpsEvent;
const RpsHistory = db.RpsHistory;
const io = require('../../../app').io;
const random = require('lodash.random');

module.exports = {
    create,
    findUser,
    getAll,
    initial,
    getWinner,
    getEventUsersCount,
    getLastHistory
};

async function findUser(param) {
    const data = await RpsEvent.findOne().sort({ _id: -1 }).limit(1).exec();
    // check user join is exist in lastest event ?
    const isExist = await RpsEvent.find(
        { eventNo: data.eventNo, users: { $elemMatch: { userName: param.userName } } }
    );
    const usersCount = await getEventUsersCount();
    return { 'eventJoined': (isExist.length > 0), 'usersCount': usersCount }
}

async function create(param) {

    // get lastest event
    const data = await RpsEvent.findOne().sort({ _id: -1 }).limit(1).exec();
    // check user join is exist in lastest event ?
    const isExist = await RpsEvent.find(
        { eventNo: data.eventNo, users: { $elemMatch: { userName: param.userName } } }
    );
    if (isExist.length > 0)
        throw new Error("Already in event");
    else {
        await RpsEvent.updateOne({ _id: data._id }, { $push: { users: param } });
        const usersCount = await getEventUsersCount();
        io.emit("EVENT_USERS_COUNT", usersCount);
        return { 'eventJoined': true, 'usersCount': usersCount };
    }
}

async function getEventUsersCount() {
    const data = await RpsEvent.findOne().sort({ _id: -1 }).limit(1).exec();
    return await data.users.length;
}

async function getAll() {
    return await RpsEvent.find();
}

function createEventHistoryObj(eventNo, users) {
    return {
        eventNo: eventNo,
        eventRecord: users.map((u) => {
            return { userName: u.userName, fightRecord: [], selectedRps: u.selectedRps }
        })
    };
}

//EH : rpsHistory
function findInEhAndPush(eh, userName, isWin, round, turn, rivalName, rivalSelectedRps) {
    let fightElm = {
        round: round,
        turn: turn,
        isWin: isWin,
        rivalName: rivalName,
        rivalSelectedRps: rivalSelectedRps
    };

    eh.eventRecord.forEach((u, index) => {
        if (u.userName === userName) {
            eh.eventRecord[index].fightRecord.push(fightElm);
        }
    })
}

// 0 paper  1 scissors  2 rock
function turnFight(rps1, rps2) {
    if (rps1 === rps2)
        return 0;

    // 0 - tied // 1 - rps 1 win // -1 - rps 2 win
    switch (rps1) {
        case 0:
            if (rps2 === 1) return -1;
            else if (rps2 === 2) return 1;
            break;
        case 1:
            if (rps2 === 0) return 1;
            else if (rps2 === 2) return -1;
            break;
        case 2:
            if (rps2 === 0) return -1;
            else if (rps2 === 1) return 1;
            break;
        default: return 0;
    }
}

function roundFight(rpsHistory, userA, userB, round) {
    let rd;
    let winner;
    let loser;
    let i = 0;
    for (i; i < 12; i++) {
        let isWinner = turnFight(userA.selectedRps[i], userB.selectedRps[i]);
        if (isWinner === 1) {
            winner = userA;
            loser = userB;
            break;
        }
        if (isWinner === -1) {
            winner = userB;
            loser = userA;
            break;
        }
    }

    if (i===12) {
        rd = random(1);
        if (rd === 1) {
            winner = userA;
            loser = userB;
        } else {
            winner = userB;
            loser = userA;
        }
    }

    findInEhAndPush(rpsHistory, winner.userName, true, round, i, loser.userName, loser.selectedRps);
    findInEhAndPush(rpsHistory, loser.userName, false, round, i, winner.userName, winner.selectedRps);
    return winner;
}

async function handleAsyncFight(rpsHistory, users, round = 0) {
    if (users.length === 2) return roundFightPromise(rpsHistory, users[0], users[1], round);

    const promiseItem = [];
    for (let i = 0; i < users.length; i++) {
        if (i % 2 === 0) promiseItem.push(roundFightPromise(rpsHistory, users[i], users[i + 1], round));
    }

    return Promise.all(promiseItem)
        .then(values => {
            return handleAsyncFight(rpsHistory, values, round + 1);
        })
}

function getLimitedNumber(joinedUserCount) {
    if (joinedUserCount <= 0) {
        return 0;
    }
    if (joinedUserCount > 0 && joinedUserCount <= 3) {
        return 2;
    }
    let arrN = [];
    for (let i = 3; i < joinedUserCount; i++) {
        let n = Math.pow(2, (i - 1));
        if (n > joinedUserCount) {
            break;
        } else {
            arrN.push(n);
        }
    }

    return Math.max(...arrN);
}

function roundFightPromise(rpsHistory, userA, userB, round) {
    return new Promise((resolve, reject) => {
        if (userA.selectedRps.length === 12 && userB.selectedRps.length === 12) {
            resolve(roundFight(rpsHistory, userA, userB, round));
        }
        else {
            reject("error");
        }
    });
}

async function createEventEach20Min(eventNo, users) {
    const newRpsEvent = RpsEvent();
    newRpsEvent.eventNo = eventNo;
    newRpsEvent.users = users;
    await newRpsEvent.save();
}

async function initial() {
    var winner;
    try {
        const lengthOfEvent = await RpsEvent.countDocuments();
        if (lengthOfEvent > 0) {
            // get latest Event
            const data = await RpsEvent.findOne().sort({ _id: -1 }).limit(1).exec();
            const lengthOfUser = getLimitedNumber(data.users.length);

            //io.to()
            // splice user
            var joinedUser = data.users.slice(0, lengthOfUser);
            var rpsHistory = createEventHistoryObj(data.eventNo, joinedUser);

            var nextRoundUser = data.users.slice(lengthOfUser);

            // xu ly event neu so luong nguoi tham gia lon hon 0
            if (joinedUser.length >= 2) {
                await RpsEvent.updateOne({ eventNo: data.eventNo }, { $set: { users: joinedUser } });
                // random users
                shuffle(joinedUser);
                // //create rpsHistory
                // //handle fight and push fight record to eventHisotry
                winner = await handleAsyncFight(rpsHistory, joinedUser);
                // //choose winner
                await RpsEvent.updateOne({ eventNo: data.eventNo }, { $set: { winner: winner.userName } });
            }

            // tao lich su event ( cho du event co nguoi tham gia hay ko ? )
            rpsHistory = new RpsHistory(rpsHistory);
            await rpsHistory.save();
            //  tao event moi
             await createEventEach20Min(data.eventNo + 1, nextRoundUser);
        } else await createEventEach20Min(1, []);
    }
    catch (err) {
        throw new Error(err);
    }

    return { winner: winner, rpsHistory: rpsHistory };
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

async function getWinner() {
    const data = await RpsEvent.findOne().sort({ _id: -1 }).limit(1).exec();
    return !data || typeof data.winner !== 'undefined' ? '' : data.winner;
}

async function getLastHistory(){
    const history = await RpsHistory.find().sort({ _id: -1 }).limit(1).exec();
    const records = history[0].eventRecord;
    const eventNo = history[0].eventNo;
    const rpsEvent = await RpsEvent.findOne({'eventNo':eventNo}).exec();
    const recordItem = records.find(x => x.userName === rpsEvent.winner);
    const recordLength  = recordItem.fightRecord.length - 1;
    const winner = { user:rpsEvent.winner,
                    round:recordItem.fightRecord[recordLength].round };
    const data = {
        records,
        winner
    }
    return data;
}