
const carouselModel = require("../model/carouselModel");
const promoCodeModel = require("../model/promoCodeModel")
const placesModel = require("../model/placesModel")
const userFeedbackModel = require("../model/userFeedbackModel")
const userModel=require("../model/userModel")
const tourBuyModel=require("../model/tourBuyModel")
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
          const {token}=req.body;
          // const token="dGgGL2UaTq6U_SPu-FSUfL:APA91bFnisrNxracTDPK80RJ5x2dW17D3lIu0aaVGf-gvOsIigRWj4dNXD-9h2MMPiKKIJAmslOYri455LIebdTKZuJMEdA9r3kqLf13rEhvc3E3JZ5vebHXTIvZ9VByKVFG1QnrQ4Sp"
          let userData = await userModel.findOne({ token }).select("status");
            const fetchCarousel = await carouselModel.find();
            return res.status(200).json({
                status: true,
                message: "Carousel fetch successfully",
                response: fetchCarousel,
                user:userData.status
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
    // metchPromoCode = async (req, res, next) => {
    //     try {
    //         const { promoCode ,token} = req.body;
    //         const fetchcode = await promoCodeModel.find();
    //         console.log("object",fetchcode)
    //         fetchcode.map(async(value) => {
    //             if (value.promoCode == promoCode) {
    //                 let data=await userModel.findOne({token})
    //                 if(!data){
    //                     await userModel.create({token:token,status:"PromoCode"})
    //                 }else{
    //                     await userModel.findOneAndUpdate({token:token},{status:"PromoCode"},{ new: true })
    //                 }
    //                 return res.status(201).json({
    //                     status: true,
    //                     message: "Promo code match successfully"
    //                 })
    //             } else {
    //                 return res.status(400).json({
    //                     status:false,
    //                     message:"PromoCode not match"
    //                 })
    //             }
    //         })
    //     } catch (err) {
    //         return res.status(401).json({
    //             status: false,
    //             message: err.message,
    //             stack: err.stack,
    //         })
    //     }
    // }
    metchPromoCode = async (req, res, next) => {
        try {
          const { promoCode, token } = req.body;
          const fetchcode = await promoCodeModel.find();
          console.log("object", fetchcode);
          
          for (const value of fetchcode) {
            if (value.promoCode == promoCode) {
              let data = await userModel.findOne({ token });
              console.log("Data",data)
              if (!data) {
                await userModel.create({ token: token, status: "PromoCode" });
                console.log("userfirstitme")
              } else {
                console.log("already have")
                await userModel.findOneAndUpdate(
                  { token: token },
                  // { status: "PromoCode" },
                  { $set: { status: "PromoCode" } },
                  { new: true }
                );
              }
              
              return res.status(201).json({
                status: true,
                message: "Promo code match successfully",
              });
            }
          }
          
          return res.status(400).json({
            status: false,
            message: "PromoCode not match",
          });
        } catch (err) {
          return res.status(401).json({
            status: false,
            message: err.message,
            stack: err.stack,
          });
        }
      };
      
    //*****************************************************************************************************************************/
    //   fetch All Places apis  //
    //****************************************************************************************************************************/

    // fetchAllPlaces = async (req, res, next) => {
    //     try {
    //        let {token}=req.body;
    //       const fetchplaces = await placesModel.find({
    //         $or: [
    //           { latitude: 30.711063, longitude: 76.690343 },
    //           { latitude: 30.711099, longitude: 76.690735 },
    //           { latitude: 30.71150, longitude: 76.692648 },
    //           { latitude: 30.711983, longitude: 76.692355 }
    //         ]
    //       });
    //      let autoPlay=await userModel.findOne({token}).select("autoPlay")
    //              let autoPlays=autoPlay.autoPlay
    //               console.log("autoplay",autoPlays)
    //         return res.status(200).json({
    //             status: true,
    //             message: "Places fetch successfully",
    //             response: fetchplaces,
    //             autoPlay:autoPlays 
    //         })

    //     } catch (err) {
    //         return res.status(401).json({
    //             status: false,
    //             message: err.message,
    //             stack: err.stack,
    //         })
    //     }
    // }


    // fetchAllPlaces = async (req, res, next) => {
    //   try {
    //     const { token } = req.body;
    
    //     // Check user status in the user table
    //     const user = await userModel.findOne({ token }).select("status");
    //     const userStatus = user.status;
    //     let allPlayed = true; 
    //     // Define latitude and longitude values for different places
    //     // {latitude: 51.054860, longitude: 3.721907}
    //     // const places = [
    //     //   { latitude: 30.711063, longitude: 76.690343 },
    //     //   { latitude: 30.711099, longitude: 76.690735 },
    //     //   { latitude: 30.71150, longitude: 76.692648 },
    //     //   { latitude: 30.711983, longitude: 76.692355 }
    //     // ];
    
    //     // Fetch all places
    //     // const fetchPlaces = await placesModel.find({ $or: places });
    //     const fetchPlaces = await placesModel.find();
    
    //     // Create an empty array to store the response
    //     const response = [];
    
    //     // Iterate over each fetched place
    //     for (const place of fetchPlaces) {
    //       // Create a placeholder object for the place
    //       const placeData = {
    //         _id:place._id,
    //         image: "",
    //         marqueeimage: place.marqueeimage,
    //         title: place.title,
    //         description: place.description,
    //         latitude: place.latitude,
    //         longitude: place.longitude,
    //         fragment:place.fragment,
    //         isPlayed:place.isPlayed
    //       };
    
    //       // Check if the user status is "PromoCode" or "Paid"
    //       if (userStatus === "PromoCode" || userStatus === "Paid") {
    //         placeData.image = place.image; // Set image for all places
    //       } else {
    //         // if (place.latitude === 30.711983 && place.longitude === 76.692355)
    //         if (place.latitude === 51.054860 && place.longitude === 3.721907)
    //          {
    //           placeData.image = place.image; // Set image for specific latitude and longitude
    //         } else {
    //           placeData.image = place.greenImage; // Set greenImage for other places
    //         }
    //       }
    
    //         // Check if any place is not played
    //         if (!place.isPlayed) {
    //           allPlayed = false;
    //       }
    //       // Add the place to the response
    //       response.push(placeData);
    //     }
    
    //     // Get autoPlay value from the user table
    //     const autoPlay = await userModel.findOne({ token }).select("autoPlay");
    //     const autoPlays = autoPlay.autoPlay;
    
    //     console.log("autoplay", autoPlays);
    
    //     return res.status(200).json({
    //       status: true,
    //       message: "Places fetched successfully",
    //       response,
    //       allPlayed:allPlayed,
    //       autoPlay: autoPlays
    //     });
    //   } catch (err) {
    //     return res.status(401).json({
    //       status: false,
    //       message: err.message,
    //       stack: err.stack
    //     });
    //   }
    // };

    fetchAllPlaces = async (req, res, next) => {
      try {
        const { token } = req.body;
    
        // Check user status in the user table
        const user = await userModel.findOne({ token }).select("status fragement count fragmentData");
        const userStatus = user.status;
        const userFragments = user.fragmentData.map((fragment) => fragment.toString()); // Convert ObjectIds to strings for comparison
        let allPlayed = true;
      const TotalFragements=await placesModel.count()
        // Fetch all places
        const fetchPlaces = await placesModel.find();
    
        // Create an empty array to store the response
        const response = [];
    
        // Iterate over each fetched place
        for (const place of fetchPlaces) {
          // Create a placeholder object for the place
          const placeData = {
            _id: place._id,
            image: "",
            marqueeimage: place.marqueeimage,
            title: place.title,
            description: place.description,
            latitude: place.latitude,
            longitude: place.longitude,
            fragment: place.fragment,
            isPlayed: false,
          };
    
          // Check if the user status is "PromoCode" or "Paid"
          if (userStatus === "PromoCode" || userStatus === "Paid") {
            placeData.image = place.image; // Set image for all places
          } else {
            // if (place.latitude === 30.711983 && place.longitude === 76.692355)
            if (place.latitude === 51.054860 && place.longitude === 3.721907) {
              placeData.image = place.image; // Set image for specific latitude and longitude
            } else {
              placeData.image = place.greenImage; // Set greenImage for other places
            }
          }
     console.log(":toektewrew",user.fragmentData.length)
          // Check if the place's _id exists in the user's fragments
          if (userFragments.includes(place._id.toString())) {
            placeData.isPlayed = true;
          } else if(TotalFragements !=user.fragmentData.length) {
            // If any place is not played, set allPlayed to false
            allPlayed = false;
          }
    
          // Add the place to the response
          response.push(placeData);
        }
    
        // Get autoPlay value from the user table
        const autoPlay = await userModel.findOne({ token }).select("autoPlay");
        const autoPlays = autoPlay.autoPlay;
    
        console.log("autoplay", autoPlays);
    
        return res.status(200).json({
          status: true,
          message: "Places fetched successfully",
          response,
          allPlayed,
          autoPlay: autoPlays,
        });
      } catch (err) {
        return res.status(401).json({
          status: false,
          message: err.message,
          stack: err.stack,
        });
      }
    };
    
  updatePlacesById = async (req, res) => {
    const { token, _id } = req.body;
  
    try {
      // Find the user identified by the provided token
      const user = await userModel.findOne({ token });
      const place = await placesModel.count();
      const placeData = await placesModel.findOne({ _id });
  
      console.log("test");
      let d = false;
      if (!user) {
        // If user does not exist, create a new user with the fragement array containing the new _id
        const newUser = new userModel({
          token: token,
          fragement: [_id],
          fragmentData:[_id],
          count: 1,
        });
        await newUser.save();
      } else {
        // If the user exists, check if the _id already exists in the fragement array
        const index = user.fragement.indexOf(_id);
        if (index !== -1) {
          // If the _id is already present, remove it from the fragement array
          user.fragement.splice(index, 1);
          user.count -= 1;
          d = true;
        } 
        else {
          // If the _id is not already present, add it to the fragement array
          user.fragement.push(_id);
          
        // Check if _id is already present in the fragmentData array before adding it
        if (!user.fragmentData.includes(_id)) {
          user.fragmentData.push(_id);
        }
          if (user.count != place) {
            const count = user.count + 1;
            await userModel.findByIdAndUpdate(user._id, { count: count });
          }
        }
        await user.save();
      }
  
      // Check if _id is present in the fragement array and set isPlayed accordingly
      const isPlayed = user ? user.fragement.includes(_id) : false;
  
      return res.status(200).json({
        status: true,
        message: "Update",
        response: {
          ...placeData.toObject(),
          isPlayed: isPlayed,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error updating data",
        error: error.message,
      });
    }
  };
  

    updateone=async(req,res)=>{
      // let {_id}=req.body; 
      let data=await placesModel.updateMany({},{isPlayed:false},{ new: true });
      return res.status(200).json({
        status: true,
        message: "Update isPlayed",
      });
    }
    
    
    


    // fetchAllPlaces = async (req, res, next) => {
    //     try {
    //       const { token } = req.body;
    //   console.log("fetctAllToken===>",token)
    //       // Check if the userToken exists in the payment table
    //     //   const paymentRecord = await userModel.findOne({ token });
    //       const paymentRecord = await userModel.findOne({ token, status: { $in: ["Paid", "PromoCode"] } });

    //   console.log("PaymentRecord=====>",paymentRecord)
    //       let fetchplaces;
    //   let autoPlay;
    //       if (paymentRecord&&token!==undefined) {
    //         // User token exists in payment table, return all records
    //         console.log("object")
    //         fetchplaces = await placesModel.find();
    //         autoPlay=await userModel.findOne({token}).select("autoPlay")
    //         autoPlay=autoPlay.autoPlay
    //         console.log("autoplay",autoPlay)
    //       } else {
    //         // User token does not exist in payment table, return specific record
    //         console.log("11111")
    //         fetchplaces = await placesModel.find({
    //           latitude: 51.054860, longitude: 3.721907
    //         });
    //         if(req.body.token){
    //           autoPlay=await userModel.findOne({token:req.body.token}).select("autoPlay")
    //         }
    //         autoPlay=false
            
    //       }
      
    //       return res.status(200).json({
    //         status: true,
    //         message: "Places fetched successfully",
    //         response: fetchplaces,
    //         autoPlay:autoPlay 
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

    // registerUser =  async(req,res,next)=>{
    //     try{
    //         const { token } = req.body;
    //         const add = await userModel.create({
    //             token: token,
    //         })
    //        return res.status(200).json({
    //         status: true,
    //         message:"User add",
    //         data:add
    //     })
    //     }catch(err){
    //         return res.status(401).json({
    //             status:false,
    //             message:err.message,
    //             stack:err.stack,
    //         })
    //     }
    // }
    registerUser = async (req, res, next) => {
      try {
        const { token } = req.body;
    
        // Check if user with the token already exists
        const existingUser = await userModel.findOne({ token });
    
        if (existingUser) {
          // User already exists, return the existing user data
          return res.status(200).json({
            status: true,
            message: "User already exists",
            data: existingUser,
          });
        } else {
          // User does not exist, create a new user
          const newUser = await userModel.create({
            token: token,
          });
    
          return res.status(200).json({
            status: true,
            message: "User created",
            data: newUser,
          });
        }
      } catch (err) {
        return res.status(401).json({
          status: false,
          message: err.message,
          stack: err.stack,
        });
      }
    };

    getUser = async (req, res, next) => {
      try {
          const user = await userModel.findOne({ token: req.body.token });
          return res.status(200).json({
              status: true,
              message: "User fetch successfully",
              response: user,
          })
      } catch (err) {
          return res.status(401).json({
              status: false,
              message: err.message,
              stack: err.stack,
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
                message:error.message,
                stack:error.stack,
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
          const query = {token:req.body.token};
        //   const update = { $set: { autoPlay: req.body.autoPlay } };
          let {token}=req.body;
          const findData=await userModel.findOne({token}).select("autoPlay")
          console.log("findData",findData.autoPlay)
          const update = { $set: { autoPlay: !findData.autoPlay } };
          const output= await userModel.updateMany(query, update)
            console.log("output",output)
            return res.status(200).json({
                status: true,
                message: "Audio status update",
                response:update.$set.autoPlay
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
            // const token="abcersdfasfdsfdsfadsfrewr123453";
            console.log("This is token",token)
            
            const pay=await tourBuyModel.find().select("price");
            console.log("object",pay[0].price)
            let amounts=parseFloat(pay[0].price).toFixed(2);
            const paymentData = {
            //   amount: `'${amounts}'`,
              amount:amounts,
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
        
  // Log the created payment object for debugging
  console.log('Mollie Payment:', molliePayment);  
  console.log("payment.getCheckoutUrl()",molliePayment.getCheckoutUrl())

            // Redirect the user to Mollie checkout page
            // console.log("URL",molliePayment.links)
            // console.log("URL--------",molliePayment)
            // res.redirect(molliePayment.links.checkout.href);
            // res.send(molliePayment.links.checkout.href)
            return res.status(200).json({
              status: true,
              message: "Payment redirect link",
              response:molliePayment.links.checkout.href
          })
          } catch (error) {
            console.error('Payment error:', error);
            res.status(500).send('An error occurred during payment preparation.');
          }
    }

}


const UserController = new userController();
module.exports = UserController;
