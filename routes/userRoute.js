const {Router} =  require("express");
const userController =  require("../controller/userController");
const userModel=require("../model/userModel")
const userRoute = Router();
userRoute.post("/fetchCarousel" , userController.fetchCarousel)
userRoute.post("/metchPromoCode" , userController.metchPromoCode)
userRoute.post("/fetchAllPlaces" , userController.fetchAllPlaces)
userRoute.put("/updatePlacesById" , userController.updatePlacesById)
userRoute.put("/updateone" , userController.updateone)
userRoute.post("/getSinglePlaces" , userController.getSinglePlaces)
userRoute.post("/feedbackAdd" , userController.addFeedback)
userRoute.post("/ratingAdd" , userController.addRating)
userRoute.put("/autoPlay" , userController.autoPlayUpdateStatus)
userRoute.post("/addUser" , userController.registerUser)
userRoute.post("/getUser" , userController.getUser)
userRoute.post("/payPayment" , userController.payment)

userRoute.get("/paymentSuccess", async (req, res) => {
    try {
      const { token } = req.query;
      let data=await userModel.findOne({token})
      if(!data){
          await userModel.create({token:token,status:"Paid"})
      }else{
          await userModel.findOneAndUpdate({token:token},{status:"Paid"},{ new: true })
      }
      console.log("User token:", token);
      return res.status(200).json({
        status: true,
        message: "Payment done successfully",
    })
//       res.send(`
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Payment</title>
//     <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@1,500&display=swap" rel="stylesheet">

//     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
//     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
//     <Style>
//         h1{
//             font-family: 'Poppins', sans-serif;
//         }
//         .live{
//   height:80px;
//   width:80px;
//   display:block;
//   border-radius:50%;
//   background-color:#f1f1f1;
//   animation:pulse 1500ms infinite;
// }

// @keyframes pulse{
//   0%{
//     box-shadow:#f1f1f1 0 0 0 0;
//   }
//   75%{
//     box-shadow:#ff69b400 0 0 0 16px;
//   }
// }
//     </Style>


// </head>
// <body>
//        <section style="background-color:#FDB097 ; width:100%; height:  100%;"class="position-fixed d-flex align-items-center justify-content-center " >
//         <div class="container">
//             <div class="row align-items-center justify-content-center">
//                  <div class="col-lg-5">
//                     <div class=" animation " style="color: #ffffff;">
//                         <div class=" bg-color text-center position-relative d-flex align-items-center justify-content-center ">
//                             <span class="live">



  
//                             </span>
//                             <i class="fa-solid fa-check position-absolute " style=" font-size: 30px; color: #FDB097;" ></i>
//                         </div>
//                         <div class="text-center pt-3"> 
//                          <h2>   Payment is successfull</h2>
//                         </div>
//                      </div>
//                  </div>
//                  <div class="col-12">
                    
//                     <div class="position-absolute " style="left: 0; right: 0; bottom: 0; margin: 0 auto; text-align: center;">
//                         <h1 class="text-white">Enjoy the Experience</h1>
//                     </div>

//                  </div>
//             </div>

//         </div>

//        </section>
//        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
// </body>
// </html>
//       `);
    } catch (error) {
      console.error('Payment success error:', error);
      res.status(500).send('An error occurred during payment success handling.');
    }
  });
  
// userRoute.get("/payment-success",userController.paymentSuccess)


module.exports =  userRoute;