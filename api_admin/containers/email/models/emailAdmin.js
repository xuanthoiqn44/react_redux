const mongoose = require('mongoose');

const adminEmailSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    dateSent : { type:Date},
    statusSent : { type :Boolean, default : false },
    createdDate: { type: Date, default: Date.now },
});

adminEmailSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('AdminEmail', adminEmailSchema);