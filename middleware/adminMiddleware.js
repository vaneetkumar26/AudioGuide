
const jwt = require("jsonwebtoken");
const adminModel = require("../model/adminModel");

module.exports.checkAdminAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers

  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // Get Token from header
      token = authorization.split(' ')[1]

      console.log("tokentokentoken",token)
      console.log("process.env.JWT_SECRET_KEYprocess.env.JWT_SECRET_KEY",process.env.JWT_SECRET_KEY)

      // Verify Token
      const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY)
      console.log("userID", userId)

      // Get User from Token
      req.user = await adminModel.findById(userId).select('-password')
      next()
    } catch (error) {
      res.status(401).json({
        message: error.message,
      })
    }
  }
  if (!token) {
    res.status(401).send({ "status": "failed", "message": "Unauthorized , No Token" })
  }
}