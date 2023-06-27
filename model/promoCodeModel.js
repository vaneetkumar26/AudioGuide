const mongoose = require("mongoose");
const promoCodeSchema = new mongoose.Schema({
    promoCode: {
        type: String,
    }
}, { timestamps: true })

const promoCode = mongoose.model("promoCode", promoCodeSchema);

module.exports =  promoCode;

