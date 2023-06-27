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



}, { timestamps: true })

const Admin = mongoose.model("Admin", adminModel);
module.exports = Admin;