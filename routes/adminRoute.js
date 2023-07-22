const { Router } = require("express");
const adminRouter = Router();
const adminController = require("../controller/adminController")
const multer = require("multer")
const { checkAdminAuth } = require("../middleware/adminMiddleware")

/*****************************************************************************************************************************/
// Images uploaded in S3 Bucket  //
//****************************************************************************************************************************/

var aws = require("aws-sdk"),
    multerS3 = require("multer-s3");
aws.config.update({
    accessKeyId: "AKIA3EMPVBHSQZALZSF5",
    secretAccessKey: "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",
    Region: "us-east-2",
});
s3 = new aws.S3();
upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "patmire",
        key: function (req, file, cb) {
            cb(null, "public/" + Date.now() + file.originalname); //use Date.now() for unique file keys
        },
    }),
});

//*****************************************************************************************************************************/
//  Admin  login & update profile & change password Routes    //
//****************************************************************************************************************************/
adminRouter.post("/adminLogin", adminController.adminLogin);
adminRouter.post("/updateAdminProfile", upload.single("file"), adminController.updateAdminProfile);
adminRouter.post("/changeAdminPassword", checkAdminAuth, adminController.changeAdminPassword)
adminRouter.get("/fetchAdminProfile", checkAdminAuth, adminController.fetchAdminProfile)

adminRouter.post("/AddcarouselImage", checkAdminAuth, upload.single("file"), adminController.AddcarouselImage)
adminRouter.get("/fetchCarouselImage", adminController.fetchCarouselImage)
adminRouter.post("/updateCarousalImage", checkAdminAuth, upload.single("file"), adminController.updateCarousalImage)
adminRouter.post("/fetchSingleCarouselImage", checkAdminAuth, adminController.fetchSingleCarouselImage)
adminRouter.post("/deleteCarouselImage", checkAdminAuth, adminController.deleteCarouselImage)

adminRouter.post("/createPromoCode", checkAdminAuth, adminController.createPromoCode)
adminRouter.post("/addPromoCode", adminController.addPromoCode)
adminRouter.post("/updatePromoCode", checkAdminAuth, adminController.updatePromoCode)
adminRouter.get("/fetchPromoCode", checkAdminAuth, adminController.fetchPromoCode)
adminRouter.post("/deletePromoCode", checkAdminAuth, adminController.deletePromoCode)
adminRouter.post("/fetchSinglePromoCode", checkAdminAuth, adminController.fetchSinglePromoCode)
adminRouter.post("/forgotPassword",  adminController.forgotPassword)
adminRouter.post("/resendOtp", adminController.resendOtp)  
adminRouter.post("/verifyotp", adminController.verifyotp) 
adminRouter.post("/setPassword",  adminController.setPassword)
adminRouter.get("/adminfetchAllPlaces",  adminController.fetchAllPlaces)
// adminRouter.get("/deleteUser",  adminController.deleteUser)





adminRouter.post("/AddPlaces", checkAdminAuth, upload.fields([{
    name: 'image', maxCount: 1
}, {
    name: 'fragment', maxCount: 1
},
 {
    name: 'marqueeimage', maxCount: 1
},
]), adminController.AddPlaces)


adminRouter.post("/UpdatePlaces", checkAdminAuth, upload.fields([{
    name: 'image', maxCount: 1
}, {
    name: 'fragment', maxCount: 1
},
{
    name: 'marqueeimage', maxCount: 1
}]), adminController.UpdatePlaces)
adminRouter.get("/fetchPlaces", checkAdminAuth, adminController.fetchPlaces)
adminRouter.post("/fetchSinglePlaces", checkAdminAuth, adminController.fetchSinglePlaces)
adminRouter.post("/DeletePlaces", checkAdminAuth, adminController.DeletePlaces)


//Admin add tour buy price
adminRouter.get("/getTourPrice",checkAdminAuth, adminController.getTourPriceData)
adminRouter.post("/addTourPrice",checkAdminAuth, adminController.addTourPrice)
adminRouter.put("/updateTourPrice",checkAdminAuth, adminController.updateTourPrice)
adminRouter.delete("/deleteTourPrice", checkAdminAuth, adminController.deleteTourPrice)
// Admin Dashboard api's Not live yet
adminRouter.get('/dashboard/totalCustomer', checkAdminAuth,adminController.getTotalCustomerAndUserPerMonth);
adminRouter.get('/dashboard/totalAppDownload', checkAdminAuth, adminController.getTotalAppDownloadUser);
adminRouter.get('/dashboard/feebackStar',checkAdminAuth, adminController.feedbackStar);
adminRouter.get('/dashboard/totalSale', checkAdminAuth, adminController.totalSaleAndPerMonthDetail);


adminRouter.get('/feedback', adminController.fragementFeedback);
adminRouter.get('/feedbackFavorite', checkAdminAuth, adminController.fragementFavourite);





adminRouter.post("/AddPlacesImage", upload.single("file"), adminController.AddPlacesImage)

module.exports = adminRouter;