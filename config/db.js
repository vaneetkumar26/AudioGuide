const mongoose = require("mongoose");
const dbConnect =  async(req,res) =>{
    try{
        mongoose.set("strictQuery", false);
        mongoose.connect("mongodb+srv://adminuser:G8EDXyNmN4BwdBbn@audioguidecluster.5mvfdhx.mongodb.net/")
        console.log("Db connected")

    }catch(err){
        console.log("Database not connected")
    }
}
module.exports = dbConnect;
