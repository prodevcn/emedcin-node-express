const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ActivitySchema = new Schema({
    object : {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
});

ActivitySchema.virtual('id').get(function(){
    return this._id.toHexString();
});

ActivitySchema.set('toJSON', {
    virtuals: true
});

module.exports = Activity = mongoose.model("activities", ActivitySchema);
