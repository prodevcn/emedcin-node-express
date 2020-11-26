const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DoctorSchema = new Schema({
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
        default: 1
    },
    date: {
        type: Date,
        default: Date.now
    },
});

DoctorSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

DoctorSchema.set('toJSON', {
    virtuals: true
});

module.exports = Doctor = mongoose.model("doctors", DoctorSchema);
