require("dotenv").config();
const express = require("express");
const app = express();
const dotenv = require("dotenv")
const adminRouter = require("./routes/adminRoute")
const userRoute = require("./routes/userRoute")
const cors = require("cors")
const dbConnect = require("./config/db")
let bodyParser = require('body-parser');
const promoCodeModel = require("./model/promoCodeModel");
const cron = require("node-cron");
const moment = require("moment")

const port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
bodyParser.json(['options'])


app.use(cors());
app.use(adminRouter);
app.use(userRoute);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
    next();
});


const expirePromoCode = async (req, res, next) => {
    const promoCodes = await promoCodeModel.find();
    const currentDate = new Date();
    promoCodes.forEach(async (promoCode) => {
        const createdAt = new Date(promoCode.createdAt);
        const expirationDate = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours to createdAt
        // console.log("object feedback",promoCode._id.toString())
        if (currentDate >= expirationDate&& promoCode._id.toString() !== "64a3b929a2ce583c61c3df3d") {
            const promoCodeexpire = await promoCodeModel.findByIdAndDelete({ _id: promoCode._id });
            console.log(`Coupon doesnt exists or expired`);
            // Promo code has expired
            // Perform necessary actions here, such as marking the promo code as expired in the database
        }
    });
}


// Schedule the job to run every minute
cron.schedule("* * * * * *", async () => {
    await expirePromoCode();
});

// cron.schedule('*/1 * * * *', async () => {
//     await expirePromoCode();
//   });


dbConnect();


app.listen(port, () => {
    console.log("server is running on port " + port);
});



