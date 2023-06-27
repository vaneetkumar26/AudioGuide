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
            const adminfiled = await adminModel.findOne({ _id: req.user._id });
            const updateProfile = await adminModel.findByIdAndUpdate({ _id: req.user._id }, {
                $set: {
                    name: name ? name : adminfiled.name,
                    email: email ? email : adminfiled.email,
                    profile_image: req.file.location ? req.file.location : adminfiled.location,
                }
            }, { new: true })
            return res.status(200).json({
                status: true,
                message: "Admin profile updated successfully",
                Response: updateProfile,
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
            const carousel = await carouselModel.find()
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
            const fetchCode = await promoCodeModel.find();
            return res.status(401).json({
                status: true,
                message: "Promocode fetch successfully",
                response: fetchCode,
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
                fragment: req.files.fragment[0].location,
                image: req.files.image[0].location,
                marqueeimage: req.files.marqueeimage[0].location,
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
    
            let criteria={
                _id:req.body._id
            }
           let data={
            $set:{
                price:req.body.price
            }
           }
           await tourBuyModel.findOneAndUpdate(criteria,data)
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
            const usersPerMonth = await userModel.aggregate([
                {
                  $group: {
                    _id: { $month: { $toDate: "$createdAt" } }, // Extract the month from the createdAt field
                    count: { $sum: 1 } // Count the number of users in each group
                  }
                },
                {
                  $sort: {
                    _id: 1 // Sort by month in ascending order
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
        
            return res.status(401).json({
                status: true,
                message: "List of total user feedback give",
                totalFeedbackGiveUserWithStatus1: totalFeedbackGiveUserWithStatus1,
                totalFeedbackGiveUserWithStatus0:totalFeedbackGiveUserWithStatus0
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
            }
          ]);
      
          return res.status(200).json({
            status: true,
            message: 'List of feedback',
            response: carousel
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
            }
          ]);
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
            }
          ]);
      
          return res.status(200).json({
            status: true,
            message: 'List of feedback',
            MostFavourite: Favourite,
            ListFavourite:ListFavourite
          });
        } catch (err) {
          return res.status(401).json({
            status: false,
            message: err.message,
            stack: err.stack
          });
        }
    };
}


const AdminController = new adminController();

module.exports = AdminController;
