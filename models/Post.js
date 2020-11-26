const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PostSchema = new Schema({
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

PostSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

PostSchema.set('toJSON', {
    virtuals: true
});

module.exports = Post = mongoose.model("posts", PostSchema);
