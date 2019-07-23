const mongoose = require('mongoose');

// history of user trade
const userTradeSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    traderId: { type: String },
    amount: { type: Number, required: true },
    fee: { type: Number },
    txid: { type: String },
    item: { type: String, required: true }, //blood //quadKey //gold
    act: { type: String, required: true }, //transfer // receive // buy // sell
    status: { type: Boolean, default: false }, //success //fail => error
    error: { type: String },
    createdDate: { type: Date, default: Date.now }
});

userTradeSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('UserTrade', userTradeSchema);