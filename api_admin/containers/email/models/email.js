const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref : 'User' },
    title: { type: String, required: true },
    content: { type: String, required: true }, //content of notify
    type: { type: String, required: true }, //admin, lands
    status: {type: Boolean, default: false},
    createdDate: { type: Date, default: Date.now },
});

emailSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('email', emailSchema);