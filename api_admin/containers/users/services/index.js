const jwt = require('jsonwebtoken');
const bCrypt = require('bcryptjs');
const db = require('../../../helpers/db');
const config = require('../../../helpers/config');
const path = require('path');
const mkdirp = require('mkdirp');
var base64ToImage = require('base64-to-image');
var moment = require('moment');
const User = db.User;
const Language = db.Language;
const UserSetting = db.UserSetting;

module.exports = {
    authenticate,
    getAll,
    getById,
    jwtToken,
    getByToken,
    register,
    update,
    delete: _delete,
    socialLogin
};

async function authenticate({userName, password}) {
    let user = await User.findOne({userName});
    if (user && bCrypt.compareSync(password, user.hash)) {
        const {hash, goldBlood, ...userWithoutHash} = user.toObject();
        user = await User.findOneAndUpdate({userName: user.userName}, {$set: {updatedDate: new Date()}}, {new: true});
        const token = jwt.sign({
            sub: user.id,
            date: user.updatedDate,
            name: user.userName
        }, config.secret, {expiresIn: 7 * 24 * 60 * 60});
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getAll() {
    return await User.find().select('-hash');
}

async function getById(param) {
    let users = await User.find({
        // _id: {$ne: new ObjectId(param.id)},
        role: {$ne: 'Super Admin'}
    }).select('userName firstName lastName email role updatedDate createdDate');
    return await users.map((value, index) => {
        console.log('moment', moment(value.createdDate).format('DD/MM/YYYY'));
        value.createdDate = moment(value.createdDate).format('DD/MM/YYYY');
        value.updatedDate = moment(value.updatedDate).format('DD/MM/YYYY');
        return value;
    });
    // const user = await User.findById(id).select('role');
    // if (user.role === 'Super Admin') {
    //     return await User.find({
    //         _id: {$ne: new ObjectId(param.id)},
    //         role: {$ne: 'Super Admin'}
    //     }).select('userName firstName lastName email role updatedDate createdDate');
    // }
    // return {};
}

async function jwtToken(param) {
    return await User.findOne(param);
}

async function getByToken(param) {
    if (typeof param.token === 'undefined' || !param.token) {
        return {token: ''};
    }

    let decoded = await verifyToken(param);
    if (typeof decoded.sub !== 'undefined' && decoded.sub !== '' && decoded.sub && typeof decoded.name !== 'undefined' && decoded.name !== '' && decoded.name) {
        let user = await User.findOneAndUpdate({
            _id: decoded.sub,
            userName: decoded.name
        }, {$set: {updatedDate: new Date()}}, {new: true});
        if (user) {
            const token = jwt.sign({
                sub: user.id,
                date: user.updatedDate,
                name: user.userName
            }, config.secret, {expiresIn: 7 * 24 * 60 * 60});
            const {hash, goldBlood, ...userWithoutHash} = user.toObject();
            return {
                ...userWithoutHash,
                token
            };
        } else {
            return {token: ''};
        }
    }
    return {token: ''};
}

function verifyToken(param) {
    return new Promise((resolve, reject) => {
        jwt.verify(param.token, config.secret, async function (err, decoded) {
            if (err) {
                resolve({});
            }
            resolve(decoded);
        });
    });
}

async function register(param) {
    if (param.userName !== '' && await User.findOne({userName: param.userName})) {
        throw new Error('Username "' + param.userName + '" is already taken');
    }
    if (param.email !== '' && await User.findOne({email: param.email})) {
        throw new Error('Email "' + param.email + '" is already taken');
    }

    const user = new User();
    user.userName = param.userName;
    user.firstName = param.firstName;
    user.lastName = param.lastName;
    user.email = param.email;

    // if (param.email.length > 0) {    //
    //     const message = {
    //         from: 'Blood Land',
    //         to: param.email,
    //         subject: 'Blood land notification',
    //         text: 'thanks for use our app',
    //     };
    //     config.sendEmail(message);
    // }
    if (param.password) {
        user.hash = bCrypt.hashSync(param.password, 10);
    }

    let savedUser = await user.save();
    if (savedUser) {
        let userSetting = new UserSetting();
        userSetting.userId = savedUser._id;
        await userSetting.save();

        let userLanguage = new Language();
        userLanguage.userId = savedUser._id;
        userLanguage.languages = 'us';
        await userLanguage.save();
    }
    return savedUser;
}

async function update(param) {
    const user = await User.findById(param._id);

    await new Promise((resolve) => {
        mkdirp(path.join(process.cwd(), '/images/users/', param._id), async function (err) {
            if (err) {
                return console.log(err);
            } else {
                let dir = './images/users/' + param._id + '/';
                let base64Str = param.avatar;
                await base64ToImage(base64Str, dir, {fileName: param.userName, type: 'png'});
                param.path = param._id + '/' + param.userName + '.png';
                resolve(true);
            }
        });
    });

    let updateObj = Object.assign(user, param);

    // if (param.email.length > 0) {
    //     const message = {
    //         to: param.email,
    //         subject: 'Blood land notification',
    //         html: '<h1>Test</h1><p>Your profile was updated!</p>',
    //     };
    //     config.sendEmail(message);
    // }

    return await User.findByIdAndUpdate(param._id, updateObj, {new: true});
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}

async function socialLogin(user) {
    let userName = user.userName;
    const userCheck = await User.findOne({userName: userName});
    return (userCheck) ? {result: true, user: userCheck} : {result: false, user: null};
}
