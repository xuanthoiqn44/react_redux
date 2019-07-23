const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const landItemSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId },
    quadKey: { type: String },
    name: { type: String, default: '' },
    typeCode: { type: String, default: '', required: true },
    description: { type: String, default: '' },
    waterPeriod: { type: Number, default: 864000 },
    transformPeriod: { type: Number, default: 0 },
    transformToTypeCode: { type: String, default: '' },
    limitUseNutritional: { type: Number, default: 2 },
    limitUseSmell: { type: Number, default: 3 },
    profit: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    type: { type: String, default: '' }, //tree-bud, tree, tree-harvest, forTree
    amount: { type: Number, default: 1 },
    createdDateWater: { type: Number, default: (new Date()).getTime() },
    createdDate: { type: Number, default: (new Date()).getTime() },
    id: false,
    // _id:false
});

landItemSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('LandItem', landItemSchema);