
const carouselModel = require("../model/carouselModel");
const promoCodeModel = require("../model/promoCodeModel")
const placesModel = require("../model/placesModel")
const userFeedbackModel = require("../model/userFeedbackModel")
const userModel=require("../model/userModel")
const Joi=require("joi");
const Helper=require("../helper/validation");
const _ =require("underscore")
var jwt = require('jsonwebtoken');
const { createMollieClient } = require('@mollie/api-client');
const mollieClient = createMollieClient({ apiKey: 'test_NH4xwqE8aWp6CV4n3tfFWseHMeswsN' });
class userController {
    //*****************************************************************************************************************************/
    //  fetch Carousel  apis  //
    //****************************************************************************************************************************/

    fetchCarousel = async (req, res, next) => {
        try {
            const fetchCarousel = await carouselModel.find();
            return res.status(200).json({
                status: true,
                message: "Carousel fetch successfully",
                response: fetchCarousel,
            })
        } catch (err) {
            return res.status(401).json({
                status: false,
                message: err.message,
                stack: err.stack,
            })
        }
    }

    //*****************************************************************************************************************************/
    //   metch Promo Code apis  //
    //****************************************************************************************************************************/
    metchPromoCode = async (req, res, next) => {
        try {
            const { promoCode } = req.body;
            const fetchcode = await promoCodeModel.find();
            fetchcode.map((value) => {
                if (value.promoCode === promoCode) {
                    return res.status(201).json({
                        status: true,
                        message: "Promo code metch successfully"
                    })
                } else {
                    throw new Error("Please check your promo code");
                }
            })
        } catch (err) {
            return res.status(401).json({
                status: false,
                message: err.message,
                stack: err.stack,
            })
        }
    }
    //*****************************************************************************************************************************/
    //   fetch All Places apis  //
    //****************************************************************************************************************************/

    fetchAllPlaces = async (req, res, next) => {
        try {

            const fetchplaces = await placesModel.find();
            return res.status(200).json({
                status: true,
                message: "Places fetch successfully",
                response: fetchplaces,
            })

        } catch (err) {
            return res.status(401).json({
                status: false,
                message: err.message,
                stack: err.stack,
            })
        }
    }

    // fetchAllPlaces = async (req, res, next) => {
    //     try {
    //       const { token } = req.body;
      
    //       // Check if the userToken exists in the payment table
    //       const paymentRecord = await userModel.findOne({ token });
      
    //       let fetchplaces;
      
    //       if (paymentRecord) {
    //         // User token exists in payment table, return all records
    //         fetchplaces = await placesModel.find();
    //       } else {
    //         // User token does not exist in payment table, return specific record
    //         fetchplaces = await placesModel.find({
    //           latitude: 51.0535,
    //           longitude: 3.725442
    //         });
    //       }
      
    //       return res.status(200).json({
    //         status: true,
    //         message: "Places fetched successfully",
    //         response: fetchplaces,
    //       });
    //     } catch (err) {
    //       return res.status(401).json({
    //         status: false,
    //         message: err.message,
    //         stack: err.stack,
    //       });
    //     }
    //   };
      
    //*****************************************************************************************************************************/
    //   get Single Places apis  //
    //****************************************************************************************************************************/
    getSinglePlaces = async (req, res, next) => {
        try {
            const fetchplaces = await placesModel.findOne({ _id: req.body._id });
            return res.status(200).json({
                status: true,
                message: "Places fetch successfully",
                response: fetchplaces,
            })
        } catch (err) {
            return res.status(401).json({
                status: false,
                message: err.message,
                stack: err.stack,
            })
        }
    }

    //*****************************************************************************************************************************/
    //   register user  //
    //****************************************************************************************************************************/

    registerUser =  async(req,res,next)=>{
        try{
            const { token } = req.body;
            const add = await userModel.create({
                token: token,
            })
           return res.status(200).json({
            status: true,
            message:"User add",
            data:add
        })
        }catch(err){
            return res.status(401).json({
                status:false,
                message:err.message,
                stack:err.stack,
            })
        }
    }
    addFeedback=async(req,res,next)=>{
        try {
            let objToSave={
                 userId:req.body.userId,
                 placeId:req.body.placeId,
                 leastplaceId:req.body.leastplaceId,
                //  status:req.body.status, //0 for most favourite and 1 for least favourite
                 feedbackForChange:req.body.feedbackForChange
            }
            await userFeedbackModel.create(objToSave)
            return res.status(200).json({
                status: true,
                message: "Feedback add successfully",

            })
        } catch (error) {
            return res.status(401).json({
                status:false,
                message:err.message,
                stack:err.stack,
            })
        }
    }
    addRating=async(req,res,next)=>{
        try {
             let objToSave={
                userId:req.body.userId,
                placeId:req.body.placeId,
                rating:req.body.rating,
                ratingNote:req.body.ratingNote,
           }
            await userFeedbackModel.create(objToSave)
            return res.status(200).json({
                status: true,
                message: "Rating add successfully",
            })
        } catch (error) {
            return res.status(401).json({
                status:false,
                message:err.message,
                stack:err.stack,
            })
        }
    }
    autoPlayUpdateStatus=async(req,res,next)=>{
        try {
          const query = {};
          const update = { $set: { autoPlay: req.body.autoPlay } };
          const output= await placesModel.updateMany(query, update)
            console.log("output",output)
            return res.status(200).json({
                status: true,
                message: "Audio status update",

            })
        } catch (error) {
            return res.status(401).json({
                status:false,
                message:error.message,
                stack:error.stack,
            })
        }
    }
//**************************************************************************************/
//*************************Mollie payment gateways**************************************/
//**************************************************************************************/   
    payment = async(req,res,next)=>{
        try {
            let molliePayment;
            const token=req.body.token;
            console.log("This is token",token)
            const paymentData = {
              amount: '10.00',
              currency: 'EUR',
              description: 'Payment By AudioGuide',
              //for local
            //   redirectUrl: 'http://localhost:8000/paymentSuccess', // Replace with your redirect URL 
            // for live server 
             redirectUrl:'http://18.119.138.104:8000/paymentSuccess'
            };
            // Create a payment in Mollie API
            molliePayment = await mollieClient.payments.create({
              amount: {
                currency: paymentData.currency,
                value: paymentData.amount,
              },
              description: paymentData.description,
              redirectUrl: paymentData.redirectUrl+`?token=${encodeURIComponent(token)}` ,
            });
        
            // Redirect the user to Mollie checkout page
            // console.log("URL",molliePayment.links)
            // console.log("URL--------",molliePayment)
            res.redirect(molliePayment.links.checkout.href);
          } catch (error) {
            console.error('Payment error:', error);
            res.status(500).send('An error occurred during payment preparation.');
          }
    }
    
}


const UserController = new userController();
module.exports = UserController;

// const admin = require('firebase-admin');

// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
// });
// const decodedToken = await admin.auth().verifyIdToken(deviceToken);