const mongoose = require("mongoose");
const dbConnect =  async(req,res) =>{
    try{
        mongoose.set("strictQuery", false);
        mongoose.connect(process.env.MONGO_URL);
        console.log("Db connected")

    }catch(err){
        console.log("Database not connected")
    }
}
module.exports = dbConnect;
