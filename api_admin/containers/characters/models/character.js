const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    name: { type: String, default: '' }, // character name
    typeCode: { type: String, default: '', unique: true, required: true }, // typeCode for each character
    image : {type:String, default:'none'},
    description: { type: String, default: '' },
    waterPeriod: { type: Number, default: 864000 }, // water period for each character
    transformPeriod: { type: Number, default: 0 }, // transform period for each character
    transformToTypeCode: { type: String, default: '' }, // transform to type code after period
    profit: { type: Number, default: 0 }, // profit for each character after harvest
    profitDay: { type: Number, default: 0 }, // get profit on each Tree at 0 AM next day
    profitMonth: { type: Number, default: 0 }, // get profit on each Tree at 0 Am First Day next month
    profitYear: { type: Number, default: 0 }, // get profit on each Tree at 0 Am First Day First Year next month
    price: { type: Number, default: 0 }, // price at shop for each character
    type: { type: String, default: '' }, //forTree
    id: false
});

characterSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Character', characterSchema);