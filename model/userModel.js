const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    token: {
        type: String
    },
    autoPlay:{
        type:Boolean,
        default:false
       },
       status:{
        type:String,
        enum: ["Paid", "PromoCode","none"],
        default: "none",
       }

}, { timestamps: true })

const user = mongoose.model("user", UserSchema);
module.exports = user;