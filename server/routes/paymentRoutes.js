const express = require("express");
const router = express.Router();

const { createPayment, verifyPayment, addProductToCustomer } = require("../controllers/paymentController");
const { auth, isUser } = require("../middlewares/auth");

router.post("/createorder", auth, isUser, createPayment);
router.post("/verifypayment", auth, isUser, verifyPayment);

module.exports = router;