require('dotenv').config()
const User = require("../models/user");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingSID = process.env.TWILIO_MESSAGING_SERVICE_SID;
const client = require('twilio')(accountSid, authToken);

const getString = (dayOfWeek) => {
    if(dayOfWeek == 0) return "S";
    if(dayOfWeek == 1) return "M";
    if(dayOfWeek == 2) return "T";
    if(dayOfWeek == 3) return "W";
    if(dayOfWeek == 4) return "Th";
    if(dayOfWeek == 5) return "F";
    return "Sa";
}

const notificationWorker = () => {
    const date = new Date();
    const dayOfWeek = date.getDay();
    const searchString = getString(dayOfWeek)
    User
    .find({"medicines.days" : {$regex : searchString}})
    .then(data => {
        return data;
    })
    .then(data => {
        const servingData = data.map(element => {
            if(element.opted == true){
                const medicines = element.medicines.map(medicine => {
                    if(medicine.days.includes(searchString))
                        return `Medicine Name : "${medicine.medicineName}" with Dosage : "${medicine.dosage}"`
                })
                const medicineString = medicines.join(', ')
                const message = `Hello ${element.name}. We hope you are doing well. Here is your reminder for medicine intake. You have to take ${medicineString}. Thank You, Have A great Day.`;
                return {number : element.phoneNumber , message : message};
            }
        })
        Promise.all(
            servingData.map(data => {
                return client.messages.create({
                    to: data.number,
                    from: messagingSID,
                    body: data.message
                });
            })
        )
        .then(messages => {
            console.log("Messages Sent");
        })
        .catch(err => console.error(err));
    })
    .catch(err => {
        console.log(err);
    })
}

module.exports = notificationWorker;