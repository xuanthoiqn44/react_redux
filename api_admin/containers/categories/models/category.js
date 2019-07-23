const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref : 'User' },
    title: { type: String, required: true },
    flags: {type: Boolean, default: false},
    createdDate: { type: Date, default: Date.now() },
    statusSent: { type :Boolean, default : false },
});

categorySchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Category', categorySchema);