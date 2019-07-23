const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const languageSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref : 'User' },
    languages: { type: Array, required: false },
});

languageSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Language', languageSchema);