const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const landCharacterSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId },
    quadKey: { type: String },
    name: { type: String, default: '' },
    typeCode: { type: String, default: '', required: true },
    description: { type: String, default: '' },
    waterPeriod: { type: Number, default: 864000 },
    waterWarning: {type: Boolean, default: false },
    transformPeriod: { type: Number, default: 0 },
    transformToTypeCode: { type: String, default: '' },
    limitUseNutritional: { type: Number, default: 2 }, //limit use of nutritional
    limitUseSmell: { type: Number, default: 3 }, //limit use of smell
    profit: { type: Number, default: 0 }, // profit
    profitDay: { type: Number, default: 0 },
    profitMonth: { type: Number, default: 0 },
    profitYear: { type: Number, default: 0 },
    profitGot: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    type: { type: String, default: '' }, //tree-bud, tree, tree-harvest, forTree
    createdDateWater: { type: Number, default: (new Date()).getTime() },
    createdDateMonthHarvest: { type: Number, default: (new Date()).getTime() },
    createdDateYearHarvest: { type: Number, default: (new Date()).getTime() },
    createdDate: { type: Number, default: (new Date()).getTime() },
    id: false,
    // _id:false
});

landCharacterSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('LandCharacter', landCharacterSchema);
