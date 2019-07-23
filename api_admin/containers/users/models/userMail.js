const mongoose = require('mongoose');

const userMailSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId },
    sentList: [ //sendList Email
        {
            title: { type: String },
            content: { type: String },
            fromId: { type: mongoose.Schema.Types.ObjectId },
            fromName: { type:String },
            toId: { type: mongoose.Schema.Types.ObjectId },
            toName: { type:String },
            status: { type: Number, default : 0 }, // 0 : unread // 1 : read // 2 : deleted // 3: draft
            createdDate: { type: Date, default: Date.now }
        }
    ],
    receivedList: [ // receivedList Email
        {
            title: { type: String },
            content: { type: String },
            fromId: { type: mongoose.Schema.Types.ObjectId },
            fromName: {type:String},
            toId: { type: mongoose.Schema.Types.ObjectId },
            toName: { type:String },
            status: { type: Number, default : 0 }, // 0 : unread // 1 : read // 2 : deleted // 3: draft
            createdDate: { type: Date, default: Date.now },
        }
    ],
    id: false,
});

userMailSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('UserMail', userMailSchema);