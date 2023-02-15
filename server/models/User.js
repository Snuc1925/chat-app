const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema (
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            minLength: 6,
            required: true
        },
        name: {
            type: String, 
            required: true,
        },
        profileImage: {
            type: String,
            default: 'defaultAvatar'
        },
        friends: {
            type: Array,
            default: []
        },
        friendRequests: {
            type: Array,
            default: []
        },
        role: {
            type: String,
            default: 'user'
        }
    }
)

module.exports = mongoose.model('User', UserSchema);