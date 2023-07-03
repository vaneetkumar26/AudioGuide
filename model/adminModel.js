const mongoose = require("mongoose");

const adminModel = new mongoose.Schema({
    name: {
        type: String,

    },

    email: {
        type: String,

    },

    profile_image: {
        type: String,

    },

    password: {

        type: String,

    },
    otp:{
        type: Number,
    },
    otp_verified:{
      type:Boolean,
      enum: [true, false],
      default: false,
    }


}, { timestamps: true })

const Admin = mongoose.model("Admin", adminModel);
module.exports = Admin;