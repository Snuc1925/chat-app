const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema (
    {
        members: {
            type: Array,
        },
        // unseen: {
        //     userId: {
        //         type: String,
        //         default: ""
        //     },
        //     count: {
        //         type: Number,
        //         default: 0
        //     }
        // }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Conversation', ConversationSchema);