const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true},
  phoneNumber: { type: String, required: true, unique : true },
  medicines : [{medicineName : String, dosage: String, days: String}],
  opted : Boolean,
});

module.exports = mongoose.model('User', UserSchema);