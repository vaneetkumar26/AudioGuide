const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    token: {
        type: String,
        default:"token13123e123e"
    },
    autoPlay:{
        type:Boolean,
        default:false
       },
       status:{
        type:String,
        enum: ["Paid", "PromoCode","none"],
        default: "none",
       },
       fragement: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "places",
        },
      ],
      fragmentData: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "places",
        },
      ],
     count:{
      type:Number,
      default:0
    }
}, { timestamps: true })

const user = mongoose.model("user", UserSchema);
module.exports = user;