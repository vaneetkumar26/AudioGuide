const mongoose = require("mongoose");
const tourBuySchema = new mongoose.Schema({
    price: {
        type: String,
        default:0
    }
}, { timestamps: true })

const tourBuy = mongoose.model("tourBuy", tourBuySchema);

module.exports =  tourBuy;

