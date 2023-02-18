const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema (
    {
        conversationId: {
            type: String,
            required: true,
        },
        senderId: {
            type: String,
        },
        text: {
            type: String,
        },
    },
    { timestamps: {type: Number} }
)

module.exports = mongoose.model('Message', MessageSchema);