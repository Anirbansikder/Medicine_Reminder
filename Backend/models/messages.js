const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    MessageSid : String,
    SmsSid : String,
    AccountSid : String,
    MessagingServiceSid : String,
    From : String,
    To : String,
    Body : String,
    timeStamp : {type : Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);