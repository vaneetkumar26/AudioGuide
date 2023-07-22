const adminModel = require("../model/adminModel")
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
const carouselModel = require("../model/carouselModel");
const promoCodeModel = require("../model/promoCodeModel");
const placesModel = require("../model/placesModel")
const tourBuyModel = require("../model/tourBuyModel");
const userModel = require("../model/userModel");
const userFeedbackModel=require("../model/userFeedbackModel")
const Joi = require("joi");
const Helper= require("../helper/validation")
const _ = require("underscore");
const SendOtp=require("../middleware/sendOtp")
class adminController {
    adminLogin = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    status: false,
                    message: "required email and password",
                })
            } else {
                const admin = await adminModel.findOne({ email: email });
                const adminDetail = await adminModel.findOne({ email: email },{password:0});

                if (!admin) {

                    throw new Error("Please check your email");
                }

                const isMatch = await bcrypt.compare(password, admin.password);
                if (!isMatch) {
                    return res.status(401).json({
                        status: false,
                        message: "Invalid email or password",
                    })
                } else {
                    const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET_KEY,
                        {
                            expiresIn: "5d"
                        })
                    return res.status(200).json({
                        status: true,
                        message: "Admin logged in successfully",
                        token: token,
                        adminDetail:adminDetail
                    })
                }

            }

        } catch (err) {
            return res.status(401).json({
                status: false,
                message: err.message,
                stack: err.stack,
            })
        }
    }


    //*****************************************************************************************************************************/
    //    update Admin Profile   Api   //
    //****************************************************************************************************************************/

    updateAdminProfile = async (req, res, next) => {
        try {
            const { name, email } = req.body;
            console.log("image",req.file)
            // console.log("image 1",req.file.location)
            // const adminfiled = await adminModel.findOne({ _id: req.user._id });
            // const updateProfile = await adminModel.findByIdAndUpdate({ _id: req.user._id }, {
            //     $set: {
            //         name: name ? name : adminfiled.name,
            //         email: email ? email : adminfiled.email,
            //         profile_image: req.file ? req.file.location : adminfiled.location,
            //     }
            // }, { new: true })
            return res.status(200).json({
                status: true,
                message: "Admin profile updated successfully",
                Response: true,
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
    //  Admin fetch fetch profile apis  //
    //****************************************************************************************************************************/

    fetchAdminProfile = async (req, res, next) => {
        try {
            const _id = req.user;
            const fetchadmin = await adminModel.findOne({ _id: _id });

            return res.status(200).json({
                status: true,
                message: "Profile fetch successfully",
                response: fetchadmin,
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
    //  Admin  Change  password api    //
    //****************************************************************************************************************************/

    changeAdminPassword = async (req, res, next) => {
        try {
            const { oldpassword, newpassword, confirmpassword } = req.body;
            if (oldpassword && newpassword && confirmpassword) {
                const { password } = await adminModel.findById({ _id: req.user._id })
                if (newpassword != confirmpassword) {
                    throw new Error("Newpassword & confirm do not match")
                } else {
                    const checkPassword = await bcrypt.compare(oldpassword, password)
                    if (checkPassword == false) {
                        throw new Error("Please Check your old password")
                    }
                    const salt = await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(newpassword, salt)
                    const updatepassword = await adminModel.findByIdAndUpdate({ _id: req.user._id }, {
                        $set: { password: hashPassword }
                    }, { new: true })
                    return res.status(200).json({
                        status: true,
                        message: "Password change successfully",
                    })
                }
            } else {
                throw new Error("All filed required")
            }
        } catch (err) {
            return res.status(401).json({
                status: false,
                message: err.message,
                stack: err.stack,
            })
        }
    }

    //*****************************************************************************************************************************/
    //  Admin  Add   carousel images api    //
    //****************************************************************************************************************************/

    AddcarouselImage = async (req, res, next) => {
        try {
            const { title } = req.body;
            console.log("tests",title) 
            console.log("object",req.file)
            const carousel = await carouselModel.create({
                title: title,
                image: req.file.location,
            })

            return res.status(200).json({
                status: true,
                message: "Carousel image add successfully",
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
    //  Admin  fetch   carousel images api    //
    //****************************************************************************************************************************/
    fetchCarouselImage = async (req, res, next) => {
        try {
          
          const { limit, skip } = req.query;
           let skips=req.query.skip?req.query.skip:0;
           let limits=req.query.limit?req.query.limit:10;
            const count = await carouselModel.countDocuments();
            const carousel = await carouselModel.find().limit(parseInt(limits)).skip(parseInt(skips)*(parseInt(limits)))
            return res.status(200).json({
                status: true,
                message: "Carousel image fetch successfully",
                response: carousel,
                count:count
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
    //  Admin  update   carousel images api    //
    //****************************************************************************************************************************/
    updateCarousalImage = async (req, res, next) => {
        try {
            const { title, _id } = req.body;
            const updateImage = await carouselModel.findOne({ _id: req.body._id });
            let image;
            if(req.file){
              image=req.file.location
            }else{
                image=updateImage.image
            }
            console.log("image",image)
            const carousel = await carouselModel.findByIdAndUpdate({ _id: _id }, {
                $set: {
                    title: title,
                    image: image,
                }
            }, { new: true })

            return res.status(200).json({
                status: true,
                message: "Carousel image update successfully",
                response: carousel,
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
    //  Admin  single fetch   carousel images api    //
    //****************************************************************************************************************************/
    fetchSingleCarouselImage = async (req, res, next) => {
        try {
            const carousel = await carouselModel.find({ _id: req.body._id })
            return res.status(200).json({
                status: true,
                message: "Carousel image fetch successfully",
                response: carousel,
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
    //  Admin  delete   carousel images api    //
    //****************************************************************************************************************************/
    deleteCarouselImage = async (req, res, next) => {
        try {
            const carousel = await carouselModel.findByIdAndDelete({ _id: req.body._id })
            return res.status(200).json({
                status: true,
                message: "Carousel image delete successfully",
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
    //  Admin  create Promo Code api    //
    //****************************************************************************************************************************/

    createPromoCode = async (req, res, next) => {
        try {
            var coupon = "";
            var possible = "abcdefghijklmnoptuvwxyz0123456789";
            for (var i = 0; i < 6; i++) {
                coupon += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            return res.status(200).json({
                status: true,
                code: coupon,
            })

        } catch (err) {
            return res.status(401).json({
                status: false,
                message: err.message,
            })
        }
    }




    //*****************************************************************************************************************************/
    //  Admin  add promo code api    //
    //****************************************************************************************************************************/

    addPromoCode = async (req, res, next) => {
        try {
            const { promoCode } = req.body;
            const addpromo = await promoCodeModel.create({
                promoCode: promoCode,
            })
            return res.status(200).json({
                status: true,
                message: "Promo code add successfully",
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
    //  Admin  update promo code api    //
    //****************************************************************************************************************************/
    updatePromoCode = async (req, res, next) => {
        try {
            const { _id, promoCode } = req.body;
            const updateCode = await promoCodeModel.findByIdAndUpdate({ _id: _id }, {
                $set: {
                    promoCode: promoCode,
                }
            }, { new: true })
            return res.status(200).json({
                status: true,
                message: "Promo code update successfully",
                response: updateCode,
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
    //  Admin  fetch promo code api    //
    //****************************************************************************************************************************/
    fetchPromoCode = async (req, res, next) => {
        try {
          const { limit, skip } = req.query;
            let skips=req.query.skip?req.query.skip:0;
            let limits=req.query.limit?req.query.limit:10;
            const count=await promoCodeModel.countDocuments();
            const fetchCode = await promoCodeModel.find().limit(parseInt(limits)).skip(parseInt(skips)*(parseInt(limits)));
            return res.status(401).json({
                status: true,
                message: "Promocode fetch successfully",
                response: fetchCode,
                count:count
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
    //  Admin  delete promo code api    //
    //****************************************************************************************************************************/
    deletePromoCode = async (req, res, next) => {
        try {
            const { _id } = req.body;
            const deletepromo = await promoCodeModel.findByIdAndDelete({ _id: _id })
            return res.status(200).json({
                status: true,
                message: "Promo code delete successfully",
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
    //  Admin fetch single   promo code api    //
    //****************************************************************************************************************************/
    fetchSinglePromoCode = async (req, res, next) => {
        try {
            const { _id } = req.body;
            const fetchpromo = await promoCodeModel.findById({ _id: _id });
            return res.status(200).json({
                status: true,
                message: "Promo code fetch successfully",
                response: fetchpromo,
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
    //  Admin add places  apis  //
    //****************************************************************************************************************************/

    AddPlaces = async (req, res, next) => {
        try {
            const { title, description, latitude, longitude } = req.body;
            console.log(req.files.marqueeimage);
            const addplaces = await placesModel.create({
                title: title,
                description: description,
                fragment: req.files.fragment[0].location?req.files.fragment[0].location:"",
                image: req.files.image[0].location?req.files.image[0].location:"",
                marqueeimage: req.files.marqueeimage[0].location?req.files.marqueeimage[0].location:"",
                latitude: latitude,
                longitude: longitude,
            })
            return res.status(200).json({
                status: true,
                message: "Places add successfully",

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
    //  Admin update places  apis  //
    //****************************************************************************************************************************/

    UpdatePlaces = async (req, res, next) => {
        try {
            const { _id, title, description, latitude, longitude } = req.body;
            const updatePlace = await placesModel.findOne({ _id: req.body._id });
            let fragment;
            let image;
            let marqueeimage;
            if(req.files.fragment){
                fragment= req.files.fragment[0].location 
            }else{
                fragment=updatePlace.fragment
            }
            if(req.files.image){
                image=req.files.image[0].location
            }else{
                image=updatePlace.image
            }
            if(req.files.marqueeimage){
                marqueeimage=req.files.marqueeimage[0].location
            }
            else{
                marqueeimage=updatePlace.marqueeimage
            }
            const addplaces = await placesModel.findByIdAndUpdate({ _id: _id }, {
                $set: {
                    title: title?title:updatePlace.title,
                    description: description?description:updatePlace.description,
                    fragment: fragment,
                    image: image,
                    marqueeimage:marqueeimage,
                    latitude: latitude?latitude:updatePlace.latitude,
                    longitude: longitude?longitude:updatePlace.longitude,
                }
            }, { new: true })
            return res.status(200).json({
                status: true,
                message: "Places update successfully",
                response: addplaces,
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
    //  Admin fetch places  apis  //
    //****************************************************************************************************************************/
    fetchPlaces = async (req, res, next) => {
        try {
            const fetchplaces = await placesModel.find();
            return res.status(401).json({
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
    //  Admin fetch single places  apis  //
    //****************************************************************************************************************************/
    fetchSinglePlaces = async (req, res, next) => {
        try {
            const fetchplaces = await placesModel.find({ _id: req.body._id });
            return res.status(401).json({
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
    //  Admin delete places  apis  //
    //****************************************************************************************************************************/
    DeletePlaces = async (req, res, next) => {
        try {
            const fetchplaces = await placesModel.findByIdAndDelete({ _id: req.body._id });
            return res.status(401).json({
                status: true,
                message: "Places delete successfully",
            })
        } catch (err) {
            return res.status(401).json({
                status: false,
                message: err.message,
                stack: err.stack,
            })
        }
    }

    //Add tour buy price
    addTourPrice=async(req,res,next)=>{
        try {
            let data={
                price:req.body.price
            }
            await tourBuyModel.create(data)
            return res.status(200).json({
                status: true,
                message: "Tour price add successfully",
            })
        } catch (error) {
            return res.status(401).json({
                status:false,
                message:error.message,
                stack:error.stack,
            })
        }
    }
    updateTourPrice=async(req,res,next)=>{
        try {
    
        //     let criteria={
        //         _id:req.body._id
        //     }
        //    let data={
        //     $set:{
        //         price:req.body.price
        //     }
        //    }
           await tourBuyModel.findOneAndUpdate({_id:req.body._id},{ $set:{
            price:req.body.price
        }})
            return res.status(200).json({
                status: true,
                message: "Tour price updated successfully",
            })
        } catch (error) {
            return res.status(401).json({
                status:false,
                message:err.message,
                stack:err.stack,
            })
        }
    }
    deleteTourPrice=async(req,res,next)=>{
        try {
            let criteria={
                _id:payload._id
            }
           await tourBuyModel.findOneAndDelete(criteria)
            return res.status(200).json({
                status: true,
                message: "Tour price deleted successfully",
            })
        } catch (error) {
            return res.status(401).json({
                status:false,
                message:err.message,
                stack:err.stack,
            })
        }
    }
    getTourPriceData = async (req, res, next) => {
        try {
            const fetchplaces = await tourBuyModel.find();
            return res.status(401).json({
                status: true,
                message: "Tour price fetch successfully",
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
    //Dashboard API's Not live yet
    getTotalCustomerAndUserPerMonth = async (req, res, next) => {
        try {
            const totalCustomer = await userModel.countDocuments();
            // const usersPerMonth = await userModel.aggregate([
            //     {
            //       $group: {
            //         _id: { $month: { $toDate: "$createdAt" } }, // Extract the month from the createdAt field
            //         count: { $sum: 1 } // Count the number of users in each group
            //       }
            //     },
            //     {
            //       $sort: {
            //         _id: 1 // Sort by month in ascending order
            //       }
            //     }
            //   ]);
            const usersPerMonth = await userModel.aggregate([
              {
                $group: {
                  _id: {
                    year: { $year: { $toDate: "$createdAt" } }, // Extract the year from the createdAt field
                    month: { $month: { $toDate: "$createdAt" } } // Extract the month from the createdAt field
                  },
                  count: { $sum: 1 } // Count the number of users in each group
                }
              },
              {
                $sort: {
                  "_id.year": 1, // Sort by year in ascending order
                  "_id.month": 1 // Sort by month in ascending order
                }
              },
              {
                $project: {
                  _id: 0, // Exclude the default _id field
                  year: "$_id.year",
                  month: "$_id.month",
                  count: 1
                }
              }
            ]);
            
              const usersPerDay = await userModel.aggregate([
                {
                  $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Extract the date from the createdAt field
                    count: { $sum: 1 } // Count the number of users in each group
                  }
                },
                {
                  $sort: {
                    _id: 1 // Sort by date in ascending order
                  }
                }
              ]);
            return res.status(401).json({
                status: true,
                message: "List of total Cusotmer",
                response: totalCustomer,
                userPerMonth:usersPerMonth,
                usersPerDay:usersPerDay
            })
        } catch (err) {
            return res.status(401).json({
                status: false,
                message: err.message,
                stack: err.stack,
            })
        }
    }
    getTotalAppDownloadUser = async (req, res, next) => {
        try {
            const totalCustomer = await userModel.countDocuments();
            return res.status(401).json({
                status: true,
                message: "Total app download user",
                response: totalCustomer,
            })
        } catch (err) {
            return res.status(401).json({
                status: false,
                message: err.message,
                stack: err.stack,
            })
        }
    }
    feedbackStar = async (req, res, next) => {
        try {
            // const totalFeedbackGiveUser = await this.userFeedbackModel.countDocuments();
            const totalFeedbackGiveUserWithStatus1 = await userFeedbackModel.countDocuments({ status: 1 });
            const totalFeedbackGiveUserWithStatus0 = await userFeedbackModel.countDocuments({ status: 0 });
            // const feedbackPerMonthStatus0 = await userFeedbackModel.aggregate([
            //     {
            //       $match: {
            //         status: 0 // Filter documents where status is 0
            //       }
            //     },
            //     {
            //       $group: {
            //         _id: { $month: { $toDate: "$createdAt" } }, // Extract the month from the createdAt field
            //         count: { $sum: 1 } // Sum the stars for each month
            //       }
            //     },
            //     {
            //       $sort: {
            //         _id: 1 // Sort by month in ascending order
            //       }
            //     },
            //     {
            //       $project: {
            //         month: { $dateToString: { format: "%m", date: "$_id" } }, // Convert _id to month format
            //         count: 1 // Keep the count field
            //       }
            //     }
            //   ]);
            const feedbackPerMonthStatus0 = await userFeedbackModel.aggregate([
              {
                $match: {
                  status: 0 // Filter documents where status is 0
                }
              },
              {
                $group: {
                  _id: { $toDate: { $subtract: [{ $toLong: "$createdAt" }, { $mod: [{ $toLong: "$createdAt" }, 86400000] }] } }, // Convert createdAt field to Date type
                  count: { $sum: 1 } // Sum the stars for each month
                }
              },
              {
                $sort: {
                  _id: 1 // Sort by month in ascending order
                }
              },
              {
                $addFields: {
                  month: { $dateToString: { format: "%m", date: "$_id" } } // Add the month field
                }
              },
              {
                $project: {
                  _id: 0, // Exclude the _id field
                  month: 1, // Keep the month field
                  count: 1 // Keep the count field
                }
              }
            ]);
            
            const feedbackPerMonthStatus1 = await userFeedbackModel.aggregate([
              {
                $match: {
                  status: 1 // Filter documents where status is 0
                }
              },
              {
                $group: {
                  _id: { $toDate: { $subtract: [{ $toLong: "$createdAt" }, { $mod: [{ $toLong: "$createdAt" }, 86400000] }] } }, // Convert createdAt field to Date type
                  count: { $sum: 1 } // Sum the stars for each month
                }
              },
              {
                $sort: {
                  _id: 1 // Sort by month in ascending order
                }
              },
              {
                $addFields: {
                  month: { $dateToString: { format: "%m", date: "$_id" } } // Add the month field
                }
              },
              {
                $project: {
                  _id: 0, // Exclude the _id field
                  month: 1, // Keep the month field
                  count: 1 // Keep the count field
                }
              }
            ]);
            const feedbackPerDayStatus0 = await userFeedbackModel.aggregate([
                {
                  $match: {
                    status: 0 // Filter documents where status is 0
                  }
                },
                {
                  $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Extract the date in the format YYYY-MM-DD from the createdAt field
                    count: { $sum: 1 } // Sum the stars for each day
                  }
                },
                {
                  $sort: {
                    _id: 1 // Sort by day in ascending order
                  }
                },
                {
                  $project: {
                    day: "$_id", // Rename the _id field to day
                    count: 1 // Include the count field
                  }
                }
              ]);

             const feedbackPerDayStatus1 = await userFeedbackModel.aggregate([
                {
                  $match: {
                    status: 1 // Filter documents where status is 1
                  }
                },
                {
                  $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Extract the date in the format YYYY-MM-DD from the createdAt field
                    count: { $sum: 1 } // Sum the stars for each day
                  }
                },
                {
                  $sort: {
                    _id: 1 // Sort by day in ascending order
                  }
                },
                {
                  $project: {
                    day: "$_id", // Rename the _id field to day
                    count: 1 // Include the count field
                  }
                }
              ]);
              

            return res.status(401).json({
                status: true,
                message: "List of total user feedback give",
                total:totalFeedbackGiveUserWithStatus1+totalFeedbackGiveUserWithStatus0,
                totalFeedbackGiveUserWithStatus1: totalFeedbackGiveUserWithStatus1,
                totalFeedbackGiveUserWithStatus0:totalFeedbackGiveUserWithStatus0,
                feedbackPerMonthStatus0:feedbackPerMonthStatus0,
                feedbackPerMonthStatus1:feedbackPerMonthStatus1,
                feedbackPerDayStatus0:feedbackPerDayStatus0,
                feedbackPerDayStatus1:feedbackPerDayStatus1
            })
        } catch (err) {
            return res.status(401).json({
                status: false,
                message: err.message,
                stack: err.stack,
            })
        }
    }
    totalSaleAndPerMonthDetail = async (req, res, next) => {
        try {
            const totalUser = await userModel.countDocuments().select("token");
            let totalPrice = 0;
            var specificNumber=await tourBuyModel.find().select("price");
            console.log("number",specificNumber[0].price)
            var count;
            if(typeof specificNumber[0].price=== 'string'){
                count=Number(specificNumber[0].price)
            }
            else{
                count=specificNumber[0].price
            }
            
            console.log("totle",totalUser)
            let totalSale= totalUser*count;
              const pipeline = [
                {
                  $match: {
                    createdAt: {
                      $gte: new Date(new Date().getFullYear(), 0, 1),
                      $lte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
                    }
                  }
                },
                {
                  $group: {
                    _id: {
                      year: { $year: '$createdAt' },
                      month: { $month: '$createdAt' }
                    },
                    recordCount: { $sum: 1 } // Count the number of records
                  }
                },
                {
                  $project: {
                    _id: 0,
                    year: '$_id.year',
                    month: '$_id.month',
                    totalRevenue: { $multiply: ['$recordCount', count] } // Multiply recordCount by specificNumber
                  }
                } 
              ];
            const result = await userModel.aggregate(pipeline); 
            const perDay = await userModel.aggregate([
                {
                  $group: {
                    _id: {
                      year: { $year: '$createdAt' },
                      month: { $month: '$createdAt' },
                      day: { $dayOfMonth: '$createdAt' }
                    },
                    recordCount: { $sum: 1 } // Count the number of records
                  }
                },
                {
                  $project: {
                    _id: 0,
                    year: '$_id.year',
                    month: '$_id.month',
                    day: '$_id.day',
                    totalRevenue: { $multiply: ['$recordCount', count] } // Multiply recordCount by count (assuming count is a number)
                  }
                }
              ]);
              
              console.log(perDay);
              
              
              console.log(perDay);
              
            return res.status(200).json({
                status: true,
                message: "Total sale",
                total: totalSale,
                perMonth:result,
                perDay:perDay
            })
        } catch (err) {
            return res.status(401).json({
                status: false,
                message: err.message,
                stack: err.stack,
            })
        }
    }
    fragementFeedback = async (req, res, next) => {
      try {
          const { limit, skip } = req.query;
        let skips=req.query.skip?req.query.skip:0
         let limits=req.query.limit?req.query.limit:10;
         skips=parseInt(skips)*parseInt(limits)
          const skipValue = parseInt(skips) || 0;
          const limitValue = parseInt(limits) || 10;
  
          const carousel = await userFeedbackModel.aggregate([
              {
                  $match: {
                      rating: { $exists: true }
                  }
              },
              {
                  $lookup: {
                      from: 'places', // Name of the place collection
                      localField: 'placeId',
                      foreignField: '_id',
                      as: 'placeData'
                  }
              },
              {
                  $addFields: {
                      placeData: { $arrayElemAt: ['$placeData', 0] }
                  }
              },
              {
                  $project: {
                      _id: 1,
                      placeId: 1,
                      rating: 1,
                      ratingNote: 1,
                      placeName: '$placeData.title',
                      fragment: '$placeData.fragment'
                  }
              },
              {
                  $skip: skipValue
              },
              {
                  $limit: limitValue
              }
          ]);
          const counts = await userFeedbackModel.aggregate([
            {
              $match: {
                rating: { $exists: true }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 }
              }
            }
          ]);
          
          const count = counts.length > 0 ? counts[0].count : 0;
          return res.status(200).json({
              status: true,
              message: 'List of feedback',
              response: carousel,
              count:count
          });
      } catch (err) {
          return res.status(401).json({
              status: false,
              message: err.message,
              stack: err.stack
          });
      }
  };
  
    fragementFavourite=async (req, res, next) => {
        try {
          const { limit, skip } = req.query;
         let skips=req.query.skip?req.query.skip:0;
         let limits=req.query.limit?req.query.limit:10;
          const skipValue = parseInt(skips)*parseInt(limits) || 0;
          const limitValue = parseInt(limits) || 10;
          const Favourite = await userFeedbackModel.aggregate([
            {
                $match: {
                    placeId: { $exists: true }
                }
              },
            {
              $lookup: {
                from: 'places', // Name of the place collection
                localField: 'placeId',
                foreignField: '_id',
                as: 'placeData'
              }
            },
            {
                $addFields: {
                  placeData: { $arrayElemAt: ['$placeData', 0] }
                }
              },
            {
              $project: {
                _id: 1,
                placeId: 1,
                feedbackForChange: 1,
                placeName: '$placeData.title',
                image: '$placeData.image'
              }
            },
            {
              $skip: skipValue
          },
          {
              $limit: limitValue
          },
          ]);
          const counts = await userFeedbackModel.aggregate([
            {
              $match: {
                placeId: { $exists: true }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 }
              }
            }
          ]);
          
          const count = counts.length > 0 ? counts[0].count : 0;
          
          const ListFavourite = await userFeedbackModel.aggregate([
            {
                $match: {
                    leastplaceId: { $exists: true }
                }
              },
            {
              $lookup: {
                from: 'places', // Name of the place collection
                localField: 'placeId',
                foreignField: '_id',
                as: 'placeData'
              }
            },
            {
                $addFields: {
                  placeData: { $arrayElemAt: ['$placeData', 0] }
                }
              },
            {
              $project: {
                _id: 1,
                placeId: 1,
                feedbackForChange: 1,
                placeName: '$placeData.title',
                image: '$placeData.image'
              }
            },
            {
              $skip: skipValue
          },
          {
              $limit: limitValue
          },
         
          
          ]);
         
          const listcounts = await userFeedbackModel.aggregate([
            {
              $match: {
                leastplaceId: { $exists: true }
              }
            },
            {
              $group: {
                _id: null,
                count: { $sum: 1 }
              }
            }
          ]);
          console.log("object",listcounts)
          const listcount = listcounts.length > 0 ? listcounts[0].count : 0;

          return res.status(200).json({
            status: true,
            message: 'List of feedback',
            MostFavourite: Favourite,
            MostFavouriteCount:count,
            ListFavourite:ListFavourite,
            ListFavouriteCount:listcount
          });
        } catch (err) {
          return res.status(401).json({
            status: false,
            message: err.message,
            stack: err.stack
          });
        }
    };

    forgotPassword = async (req, res) => {
        try {
          const { email } = req.body;
          const user = await adminModel.findOne({ email: email });
          if (!user) {
            return res.status(401).json({
              status: false,
              message: "Email does not exist",
            });
          }
          const otp = Math.floor(1000 + Math.random() * 9000);
          await adminModel.updateOne(
            { email: email },
            {
              $set: {
                otp: otp,
              },
            }
          );
          SendOtp(email, otp, user.name);
          let admin=await adminModel.findOne({ email: email });
          return res.status(201).json({
            status: true,
            message: "Otp has been sent to your email, Please check your email",
            response: admin,
          });
        } catch (error) {
          return res.status(401).json({
            status: false,
            message: error.message,
          });
        }
      };
    resendOtp = async (req, res, next) => {
        try {
          const { email } = req.body;
          const otp = Math.floor(1000 + Math.random() * 9000);
          const setemail = await adminModel.findOneAndUpdate(
            { email: email },
            {
              $set: {
                otp: otp,
              },
            }, { new: true }
          );
          SendOtp(email, otp, setemail.investorName);
          return res.status(201).json({
            status: true,
            message: "Otp has been resent to your email, Please check your email",
            response: setemail,
          });
      
        } catch (err) {
          return res.status(401).json({
            status: false,
            message: err.message,
            stack: err.stack,
          })
        }
      }
    verifyotp = async (req, res) => {
        try {
          const { email, otp } = req.body;
          const checkemail = await adminModel.findOne({ email: email });
          console.log("checkemail",checkemail)
          console.log("otp",otp)
          if (checkemail.otp != otp) {
            return res.status(401).json({
              status: false,
              message: "Otp doesn't match",
            });
          } else {
            await adminModel.updateOne(
              { email: email },
              {
                $set: { otp_verified: true },
              },
              { new: true }
            );
            const checkotp = await adminModel.findOne({ email: email });
            return res.status(200).json({
              status: true,
              message: "Otp verified successfully",
              response: checkotp,
            });
          }
        } catch (err) {
          return res.status(401).json({
            status: false,
            message: err.message,
          });
        }
      };  
    setPassword = async (req, res) => {
        const { password, password_confirmation, email } = req.body
        console.log(req.body);
        try {
              const checkotpVerify = await adminModel.findOne({ email: email });
              if(checkotpVerify.otp_verified===true){
                const salt = await bcrypt.genSalt(10)
                const newHashPassword = await bcrypt.hash(password, salt)
                if (password === password_confirmation) {
                  const saved_user = await adminModel.findOneAndUpdate({ email: email }, { $set: { password: newHashPassword } })
                  const otp_verified = await adminModel.findOneAndUpdate({ email: email }, { $set: {otp_verified : false } })
                  if (saved_user) {
                    res.status(200).send({ "success": true, "status": "200", "message": "Set Password succesfully" })
                  } else {
                    res.status(401).send({ "success": false, "status": "401", "message": "Something Went Wrongs" })
                  }
                } else {
                  res.status(401).send({ "success": false, "status": "401", "message": "Password And password_confirmation don't Match " })
                }
              }else{
                res.status(401).send({ "success": false, "status": "401", "message": "Please resend otp again" })
              }
        
        } catch (error) {
          res.status(401).send({ "success": false, "status": "401", "message": "Something Went Wrongs" })
          console.log("error", error);
        }
      }
      
    fetchAllPlaces = async (req, res, next) => {
        try {
          const { limit, skip } = req.query;
         let skips=req.query.skip?req.query.skip:0;
          let limits=req.query.limit?req.query.limit:10;
          console.log("limit",limits)
          console.log("skip",skips)
          console.log("cal",(parseInt(skips)*(parseInt(limits))))
          const count=await placesModel.countDocuments();
            const fetchplaces = await placesModel.find().limit(parseInt(limits)).skip(parseInt(skips)*(parseInt(limits)));
            return res.status(200).json({
                status: true,
                message: "Places fetch successfully",
                count:count,
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
    // deleteUser = async (req, res, next) => {
    //     try {
        
    //         const fetchplaces = await userModel.deleteMany({ token: { $ne: "dtuX_uB9QH68M8z71M4HRR:APA91bFcrFkH26wK3EwYS2m6NjkjQR2-U4UW-nRUf2OtmV4whgQUk7voLe5yVOzG57oq7YWAn9GNBrfWIb2Iud1mTDj9T8z7MSIFRmkAVe6n6mJSkqJMxAKjW_KTkEEJSwOE-XS1tBLc" } });
    //         return res.status(200).json({
    //             status: true,
    //             message: "Delete all successfully",
    //             count:count,
    //             response: fetchplaces,
    //         })

    //     } catch (err) {
    //         return res.status(401).json({
    //             status: false,
    //             message: err.message,
    //             stack: err.stack,
    //         })
    //     }
    // }


    AddPlacesImage = async (req, res, next) => {
      try {
        const updateResult = await placesModel.updateMany({}, { $set: { greenImage: req.file.location } });

          return res.status(200).json({
              status: true,
              message: "Places add successfully",
              updateResult:updateResult

          })
      } catch (err) {
          return res.status(401).json({
              status: false,
              message: err.message,
              stack: err.stack,
          })
      }
  }

}







const AdminController = new adminController();

module.exports = AdminController;
