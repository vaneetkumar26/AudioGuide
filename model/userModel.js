const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    token: {
        type: String
    }

}, { timestamps: true })

const user = mongoose.model("user", UserSchema);
module.exports = user;