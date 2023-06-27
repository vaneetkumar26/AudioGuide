const mongoose = require("mongoose");

const UserFeedbackSchema = new mongoose.Schema({

    userId: {type:mongoose.Schema.Types.ObjectId, ref: 'user'},
    placeId: {type: mongoose.Schema.Types.ObjectId, ref: 'places'},
    leastplaceId: {type: mongoose.Schema.Types.ObjectId, ref: 'places'},
    status:{type:Number,default:''} , // 0 for most favourite and 1 for least favourite
    feedbackForChange:{type:String},
    rating:{type: Number },
    ratingNote:{type:String}

}, { timestamps: true })

const feedbackUser = mongoose.model("feedbackUser", UserFeedbackSchema);
module.exports = feedbackUser;