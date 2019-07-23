const mongoose = require('mongoose');
const landEnvSchema = new mongoose.Schema({
    quadKey: { type: String },
    typeCode: { type: String, default: '' }, // typeCode of environment
    moveStatus: {type: Boolean, default: false }, // move status: idle, fight, run, jump
    value: { type: Number, default: 0 },
    id: false
});

landEnvSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('LandEnv', landEnvSchema);