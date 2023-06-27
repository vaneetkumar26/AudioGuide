const mongoose = require("mongoose");

const carouselSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    image: {
        type: String,
    },
}, { timestamps: true })

const carousel = mongoose.model("carousel", carouselSchema);
module.exports = carousel;

