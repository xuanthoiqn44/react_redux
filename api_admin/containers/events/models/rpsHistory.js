const mongoose = require('mongoose');

const rpsHistorySchema = new mongoose.Schema({
    eventRecord: [
        {
            userName: { type: String },
            selectedRps: [{ type:Number, _id:false }],
            fightRecord: [
                {
                    isWin: { type: Boolean },
                    turn: { type: Number },
                    round: { type: Number },
                    rivalName: { type: String },
                    rivalSelectedRps: [{ type:Number, _id:false }],
                    _id: false
                }
            ],

            _id: false
        }
    ],
    eventNo: { type: Number, required: true},
});

rpsHistorySchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('RpsHistory', rpsHistorySchema);