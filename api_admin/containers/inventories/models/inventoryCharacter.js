const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const inventoryCharacterSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    characters: [
        {
            name: { type: String, default: '' },
            typeCode: { type: String, default: '', required: true },
            image : {type:String, default:'none'},
            description: { type: String, default: '' },
            waterPeriod: { type: Number, default: 864000 },
            transformPeriod: { type: Number, default: 0 },
            transformToTypeCode: { type: String, default: '' },
            price: { type: Number, default: 0 },
            type: { type: String, default: '' },
            profit: { type: Number, default: 0 },
            profitDay: { type: Number, default: 0 },
            profitMonth: { type: Number, default: 0 },
            profitYear: { type: Number, default: 0 },
            amount: { type: Number, default: 1 },
            position: { type: Number, default: 0 },
        }
    ],
    spaces: { type: Number, default: 60 },
});

inventoryCharacterSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('InventoryCharacter', inventoryCharacterSchema);