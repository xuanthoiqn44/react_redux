const mongoose = require('mongoose');
const shopCharacterSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    typeCode: { type: String, default: '', unique: true, required: true },
    image : {type:String, default:'none'},
    description: { type: String, default: '' },
    waterPeriod: { type: Number, default: 864000 },
    transformPeriod: { type: Number, default: 0 },
    transformToTypeCode: { type: String, default: '' },
    profit: { type: Number, default: 0 },
    profitDay: { type: Number, default: 0 },
    profitMonth: { type: Number, default: 0 },
    profitYear: { type: Number, default: 0 },
    type: { type: String, default: '' },
    price: { type: Number, default: 0 },
    limitAmount : {type:Number,default: 100}
});

shopCharacterSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('ShopCharacter', shopCharacterSchema);