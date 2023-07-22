const mongoose = require("mongoose");

const PlacesSchema = new mongoose.Schema({

    image: {
        type: String,
    },
    greenImage:{
        type:String
    },
    fragment: {
        type: String,
    },
    marqueeimage:{
        type:String
    },
    title: {
        type: String,
    },

    description: {
        type: String,
    },

    latitude: {
        type: Number,
    },
                            
    longitude: {
        type: Number,
    },
   autoPlay:{
    type:Boolean,
    // default:false
   },
   isPlayed:{
    type:Boolean,
    // default:false
   }
}, { timestamps: true })

const places = mongoose.model("places", PlacesSchema);
module.exports = places;