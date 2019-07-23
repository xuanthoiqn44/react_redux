const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
    language: { type: String, required: false },
    characters: { type: String, required: false },
});

translationSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Translation', translationSchema);