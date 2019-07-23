const mongoose = require('mongoose');

const userSettingSchema = new mongoose.Schema({
    userId : { type : mongoose.Schema.Types.ObjectId },
    land:{ //show information land
        showInfo: { type: Boolean, default: false },
        _id : false,
    },
    bgMusic :{ // music on background
        turnOn: { type: Boolean, default: false },
        volume :{ type : Number, default : 100 },
        _id : false,
    },
    effMusic : { // music on click
        turnOn: { type: Boolean, default: false },
        volume :{ type : Number, default : 100 },
        _id : false,
    },
    id : false,
});

userSettingSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('UserSetting', userSettingSchema);