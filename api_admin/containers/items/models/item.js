const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    typeCode: { type: String, default: '', unique: true, required: true },
    image : {type:String, default:'none'},
    description: { type: String, default: '' },
    waterPeriod: { type: Number, default: 864000 },
    transformPeriod: { type: Number, default: 0 },
    transformToTypeCode: { type: String, default: '' },
    profit: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    type: { type: String, default: '' }, //tree-bud, tree, tree-harvest, forTree
    id: false
});

itemSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Item', itemSchema);