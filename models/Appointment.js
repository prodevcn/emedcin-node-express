const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AppointmentSchema = new Schema({
    author: {
        type: String,
        required: true
    },
    Date: {
        type: String,
        required: true
    },
    homeaddress: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    mdcn: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true 
    },
    phone: {
        type: String,
        required: true 
    },
    gender: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    specialist: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    rank: {
        type: Number,
        required: 1
    },    
    date: {
        type: Date,
        default: Date.now
    },
});

AppointmentSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

AppointmentSchema.set('toJSON', {
    virtuals: true
});

module.exports = Appointment = mongoose.model("appointments", AppointmentSchema);
