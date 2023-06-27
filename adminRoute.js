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
adminRouter.post("/updateAdminProfile", checkAdminAuth, upload.single("file"), adminController.updateAdminProfile);
adminRouter.post("/changeAdminPassword", checkAdminAuth, adminController.changeAdminPassword)
adminRouter.get("/fetchAdminProfile", checkAdminAuth, adminController.fetchAdminProfile)

adminRouter.post("/AddcarouselImage", checkAdminAuth, upload.single("file"), adminController.AddcarouselImage)
adminRouter.get("/fetchCarouselImage", checkAdminAuth, adminController.fetchCarouselImage)
adminRouter.post("/updateCarousalImage", checkAdminAuth,upload.single("file"), adminController.updateCarousalImage)
adminRouter.post("/fetchSingleCarouselImage", checkAdminAuth, adminController.fetchSingleCarouselImage)
adminRouter.post("/deleteCarouselImage", checkAdminAuth, adminController.deleteCarouselImage)

adminRouter.post("/createPromoCode", checkAdminAuth, adminController.createPromoCode)

adminRouter.post("/addPromoCode", checkAdminAuth, adminController.addPromoCode)
adminRouter.post("/updatePromoCode", checkAdminAuth, adminController.updatePromoCode)
adminRouter.get("/fetchPromoCode", checkAdminAuth, adminController.fetchPromoCode)
adminRouter.post("/deletePromoCode", checkAdminAuth, adminController.deletePromoCode)
adminRouter.post("/fetchSinglePromoCode", checkAdminAuth, adminController.fetchSinglePromoCode)










module.exports = adminRouter;