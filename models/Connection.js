const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ConnectionSchema = new Schema({
    senderId: {
        type: String,
        required: true
    },
    senderRole: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    receiverRole: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'pending',
    }
});

ConnectionSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

ConnectionSchema.set('toJSON', {
    virtuals: true
});

module.exports = Connection = mongoose.model("connections", ConnectionSchema);
