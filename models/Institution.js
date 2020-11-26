const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const InstitutionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    rcNumber: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    document: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

InstitutionSchema.virtual('id').get(function(){
    return this._id.toHexString();
});
InstitutionSchema.set('toJSON', {
    virtuals: true
});

module.exports = Institution = mongoose.model("institutions", InstitutionSchema);