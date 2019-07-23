const mongoose = require('mongoose');
const landNpcSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    typeCode: { type: String, default: '', unique: true, required: true },
    description: { type: String, default: '' },
    positions: [
        {
            quadKey: { type: String }, // npc at quadKey
            id: false,
            _id:false
        },
    ],
    id: false
});

landNpcSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('LandNpc', landNpcSchema);