const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true 
    },
    messageText: {
        type: String,
        required: true
    },
    opened: Boolean
}, {timestamps: true});

module.exports = mongoose.model('Message', MessageSchema, 'messages');