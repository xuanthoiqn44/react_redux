const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {type: String, trim: true, unique: true, required: true},
    hash: {type: String, trim: true, required: true},
    email: {type: String, trim: true, index: true, unique: true, sparse: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    avatar: {type: String},
    role: {type: String, default: 'user'}, // role of user: user, manager
    createdDate: {type: Date, default: Date.now},
    updatedDate: {type: Date, default: Date.now}
});

userSchema.set('toJSON', {virtuals: true});
module.exports = mongoose.model('User', userSchema);
