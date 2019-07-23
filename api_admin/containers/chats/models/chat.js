const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    image: { data: Buffer, contentType: String },
    roomType:{ type: String }, // type of room
    messages : [
        {
            user: {
                userName : {type:String, required: true },
                avatar : {type:String, required: true }
            },
            type: { type: String, required: true },
            body: { type: String, required: true }, //content of message
            date: { type: Date, default: Date.now },
            _id:false,
        }
    ]
});

chatSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Chat', chatSchema);