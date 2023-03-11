const User = require("../models/user");
const Message = require("../models/messages");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingSID = process.env.TWILIO_MESSAGING_SERVICE_SID;
const client = require('twilio')(accountSid, authToken);
const { MessagingResponse } = require('twilio').twiml;

exports.addUser = (req,res) => {
    User.findOne({phoneNumber : req.body.phoneNumber})
    .then(data => {
        if(data){
            res.status(200).json({
                message : "Phone Number Already Registered"
            })
        } else {
            const newMedicineList = [...req.body.medicines];
            const userData = new User({
                name: req.body.name,
                phoneNumber : req.body.phoneNumber,
                medicines : newMedicineList,
                opted : true
            })
            userData
            .save()
            .then(data => {
                res.status(201).json({
                    message : "Data Saved"
                });
            })
            .catch(err => {
                res.status(500).json({
                    message : err
                });
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message : "Server Error"
        });
    })
}

exports.deleteUser = (req,res) => {
    const phoneNumber = req.body.phoneNumber;
    User.deleteOne({phoneNumber : phoneNumber})
    .then(data => {
        res.status(200).json({
            message : "User Deleted"
        })
    })
    .catch(err => {
        res.status(500).json({
            message : err
        });
    })
}

exports.editPhoneNumber = (req,res) => {
    const oldPhoneNum = req.body.oldNum;
    const newPhoneNum = req.body.newPhoneNum;
    User.findOne({phoneNumber : oldPhoneNum})
    .then(data => {
        if(data){
            data.phoneNumber = newPhoneNum;
            data.save()
            .then(data => {
                res.status(200).json({
                    message : "Phone Number Updated"
                })
            })
            .catch(err => {
                res.status(500).json({
                    message : "Error Saving PhoneNumber"
                })
            })
        } else {
            res.status(200).json({
                message : "Old Phone Number Not Registered"
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message : "Server Error"
        })
    })
}

exports.editUser = (req,res) => {
    const phoneNumber = req.body.phoneNumber;
    User.findOne({phoneNumber : phoneNumber})
    .then(data => {
        if(data){
            const newMedicineList = [...req.body.medicines];
            data.name = req.body.name; 
            data.medicines = newMedicineList;
            data.save()
            .then(data => {
                res.status(200).json({
                    message : "Data Updated"
                })
            })
            .catch(err => {
                res.status(200).json({
                    message : "Data Not Updated"
                })
            })
        } else {
            res.status(200).json({
                message : "No User Found"
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            message : "Server Error"
        })
    })
}

exports.getAllUsers = (req,res) => {
    const limit = req.query.limit;
    const pages = req.query.pages;
    let totalLength = 0;
    User.find().then(data => totalLength = data.length)
    .then(() => {
        User.find().limit(limit).skip((pages-1)*limit)
        .then(data => {
            res.status(200).json({
                message : "Data Fetched",
                totalLength : totalLength,
                arrayList : data
            })
        })
        .catch(err => {
            res.status(500).json({
                message : "Server Error"
            })
        })  
    })
    .catch(err => {
        res.status(500).json({
            message : "Server Error"
        })
    })
}

exports.searchByUserName = (req,res) => {
    const limit = req.query.limit;
    const pages = req.query.pages;
    let totalLength = 0;
    User.find().then(data => totalLength = data.length)
    .then(() => {
        User.find({name : {$regex : req.query.name}}).limit(limit).skip((pages-1)*limit)
        .then(data => {
            res.status(200).json({
                message : "Data Fetched",
                totalLength,
                arrayList : data
            })
        })
        .catch(err => {
            res.status(500).json({
                message : "Server Error"
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            message : "Server Error"
        })
    })
}

exports.webhook = (req,res) => {
    const data = req.body;
    const twiml = new MessagingResponse();
    if(data.Body=="cancel"||data.Body=="end"||data.Body=="quit"||data.Body=="stop"||data.Body=="stopall"||data.Body=="unsubscribe"){
        User.findOne({phoneNumber : data.From})
        .then(data => {
            data.opted = false;
            data.save()
            .then(item => {
                twiml.message('You have successfully been unsubscribed. You will not receive any more messages from this number. Reply START to resubscribe.');
            })
            .catch(err => {
                twiml.message('Sorry cannot Unsubscribe, Please Try Again Later');
            })
        })
        .catch(err => {
            twiml.message('You are not Registered');
        })
    } else if(data.Body=="start"||data.Body=="unstop"||data.Body=="yes"){
        User.findOne({phoneNumber : data.From})
        .then(data => {
            data.opted = true;
            data.save()
            .then(item => {
                twiml.message('You have successfully been re-subscribed to messages from this number. Reply HELP for help. Reply STOP to unsubscribe. Msg&Data Rates May Apply.');
            })
            .catch(item => {
                twiml.message('Sorry cannot Subscribe, Please Try Again Later');
            })
        })
        .catch(err => {
            twiml.message('You are not Registered');
        })
    } else {
        const messageData = new Message({
            MessageSid : data.MessageSid,
            SmsSid : data.SmsSid,
            AccountSid : data.AccountSid,
            MessagingServiceSid : data.MessagingServiceSid,
            From : data.From,
            To : data.To,
            Body : data.Body,
        })
        messageData.save()
        .then(item => {
            twiml.message('Thank You for reaching out, We will get back to you soon');
        })
        .catch(item => {
            twiml.message('Some error occured, Please resend the text');
        })
    }
    res.type('text/xml').send(twiml.toString());
}

exports.fallbackWebhook = (req,res) => {
    const data = req.body;
    const twiml = new MessagingResponse();
    if(data.Body=="cancel"||data.Body=="end"||data.Body=="quit"||data.Body=="stop"||data.Body=="stopall"||data.Body=="unsubscribe"){
        User.findOne({phoneNumber : data.From})
        .then(data => {
            data.opted = false;
            data.save()
            .then(item => {
                twiml.message('You have successfully been unsubscribed. You will not receive any more messages from this number. Reply START to resubscribe.');
            })
            .catch(err => {
                twiml.message('Sorry cannot Unsubscribe, Please Try Again Later');
            })
        })
        .catch(err => {
            twiml.message('You are not Registered');
        })
    } else if(data.Body=="start"||data.Body=="unstop"||data.Body=="yes"){
        User.findOne({phoneNumber : data.From})
        .then(data => {
            data.opted = true;
            data.save()
            .then(item => {
                twiml.message('You have successfully been re-subscribed to messages from this number. Reply HELP for help. Reply STOP to unsubscribe. Msg&Data Rates May Apply.');
            })
            .catch(item => {
                twiml.message('Sorry cannot Subscribe, Please Try Again Later');
            })
        })
        .catch(err => {
            twiml.message('You are not Registered');
        })
    } else {
        const messageData = new Message({
            MessageSid : data.MessageSid,
            SmsSid : data.SmsSid,
            AccountSid : data.AccountSid,
            MessagingServiceSid : data.MessagingServiceSid,
            From : data.From,
            To : data.To,
            Body : data.Body,
        })
        messageData.save()
        .then(item => {
            twiml.message('Thank You for reaching out, We will get back to you soon');
        })
        .catch(item => {
            twiml.message('Some error occured, Please resend the text');
        })
    }
    res.type('text/xml').send(twiml.toString());
}

exports.getAllMessages = (req,res) => {
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    let totalLength = 0;
    Message.find().then(data => totalLength = data.length)
    .then(() => {   
        Message.find().sort({ timeStamp: -1 }).limit(limit).skip((page-1)*limit)
        .then(data => {
            res.status(200).json({
                totalLength : totalLength,
                arrayList : data,
                message : "Retrieved Data"
            })
        })
        .catch(err => {
            res.status(500).json({
                message : "Server Error"
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            message : "Server Error"
        })
    })
}

exports.getMessageByPhone = (req,res) => {
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    let totalLength = 0;
    Message.find().then(data => totalLength = data.length).then(() => {
        Message.find({From : req.query.phoneNumber}).sort({ timeStamp: -1 }).limit(limit).skip((page-1)*limit)
        .then(data => {
            res.status(200).json({
                arrayList : data,
                totalLength : totalLength,
                message : "Retrieved Data"
            })
        })
        .catch(err => {
            res.status(500).json({
                message : "Server Error"
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            message : "Server Error"
        })
    })
}

exports.deleteMessage = (req,res) => {
    Message.deleteOne({MessageSid : req.body.MessageSid})
    .then(data => {
        res.status(200).json({
            message : "Message Deleted"
        })
    })
    .catch(err => {
        res.status(500).json({
            message : err
        });
    })
}

exports.sendMessage = (req,res) => {
    client.messages.create({
        to: req.body.number,
        from: messagingSID,
        body: req.body.message
    })
    .then(data => {
        res.status(200).json({
            message : "Message Sent"
        })
    })
    .catch(err => {
        res.status(500).json({
            message : "Server Error"
        });
    })
}