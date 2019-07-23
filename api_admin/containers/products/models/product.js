const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref : 'User' },
    price: { type: String, required: false },
    sale: { type: String, required: false },
    title:{ type: Object, required: true },
    content: { type: Object, required: false },
    language: { type: String, required: false },
    categoryId: { type: Array, required: false },
    status: {type: String, required: false },
    createdDate: { type: String },
    dateSent: { type:Date },
    statusSent: { type :Boolean, default : false },
    path: [{ type: String }],
});

productSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Product', productSchema);