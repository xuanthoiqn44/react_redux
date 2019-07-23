const mongoose = require('mongoose');

const npcSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    typeCode: { type: String, default: '', unique: true, required: true },
    description: { type: String, default: '' },
    dropItems: [ // drop item, example santa
        {
            name: { type: String, default: '' },
            typeCode: { type: String, default: '', unique: true, required: true },
            description: { type: String, default: '' },
            chance: { type: Number, default: 50 },
            quadKey: { type: String },
            id: false,
            _id:false
        }
    ],
    id: false
});

npcSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Npc', npcSchema);