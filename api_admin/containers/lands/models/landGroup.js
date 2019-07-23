const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const landGroupSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId },
    name: { type: String, default: 'empty' },
    lands: [
        {
            quadKey: { type: String },
            privateKey:{type: String},
            publicKey:{type: String},
            initialPrice: { type: Number, default: 0 }, // initial price for Harvest Tree
            sellPrice: { type: Number, default: 0 }, // sell land for the price
            forSaleStatus: {type: Boolean, default: false }, // user set forSale
            forbidStatus: {type: Boolean, default: false }, // forbid of land
            name: { type: String, default: '' },
            userId : { type: Schema.Types.ObjectId, ref: 'User' },
            history: [{ // history of each land
                status : {type: Boolean,default: false},
                seller: { type: Schema.Types.ObjectId, default: null },
                sellerDeleted: { type: Boolean, default: false },
                buyer: { type: Schema.Types.ObjectId, default: null },
                buyerDeleted: { type: Boolean, default: false },
                landNumber: { type: Number },
                soldPrice: { type: Number, default: 0 }, // sold price for each land
                dateTrading: { type: Date, default: Date.now }
            }],
            createdDate: { type: Date, default: Date.now },
            id: false
        }
    ],
    createdDate: { type: Date, default: Date.now },
    id: false
});

landGroupSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('LandGroup', landGroupSchema);