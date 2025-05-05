const express = require("express");
const router = express.Router();
const {addRatingAndReview} = require('../controllers/ratingAndReview');
const {auth,isUser} = require("../middlewares/auth");

router.post("/addratingandreview",auth,isUser,addRatingAndReview);

module.exports =  router
