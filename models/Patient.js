const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PatientSchema = new Schema({    
    firstname: {
        type: String,
        required: true
    },
    lastname: {
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
    occupation: {
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
    date: {
        type: Date,
        default: Date.now
    },
});

PatientSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

PatientSchema.set('toJSON', {
    virtuals: true
});

module.exports = Patient = mongoose.model("patients", PatientSchema);
