const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const inventoryItemSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [
        {
            name: { type: String, default: '' },
            typeCode: { type: String, default: '',required: true },
            image : {type:String, default:'none'},
            description: { type: String, default: '' },
            waterPeriod: { type: Number, default: 864000 },
            transformPeriod: { type: Number, default: 0 },
            transformToTypeCode: { type: String, default: '' },
            price: { type: Number, default: 0 },
            profit: { type: Number, default: 0 },
            amount: { type: Number, default: 1 },
            type: { type: String, default: '' }, //tree-bud, tree, tree-harvest, forTree
            position: { type: Number, default: 0 },
        }
    ],
    spaces: { type: Number, default: 75 },
});

inventoryItemSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('InventoryItem', inventoryItemSchema);