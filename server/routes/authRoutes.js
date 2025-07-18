// crucial imports
const express = require("express");
const router = express.Router();

// import required models

const{login , signUp ,otp,resetPassword ,resetPasswordToken ,changePassword,getAddress,addOrUpdateAddress,updateProfile} = require("../controllers/authController");
const {auth,isUser} = require('../middlewares/auth');

router.post("/login",login);
router.post("/signup",signUp)
router.post("/sendotp",otp)
router.post('/changepassword', auth, changePassword);
router.post('/resetpasswordtoken', resetPasswordToken);
router.post('/resetpassword', resetPassword);
router.post('/addaddress', auth,addOrUpdateAddress);
router.post('/getaddress',auth,isUser, getAddress);
router.post('/updateProfile',auth, updateProfile);
module.exports = router;