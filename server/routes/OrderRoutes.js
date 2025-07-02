const express = require("express");
const router = express.Router();


const {fetchOrders,userSpecificOrder,updateOrderDetails} = require("../controllers/orderController") 
const{auth,isUser,isAdmin} =require('../middlewares/auth');
router.post('/order-info',auth,isAdmin,fetchOrders);
router.post('/order-userInfo',auth,isUser,userSpecificOrder);
router.post('/update',auth,isAdmin,updateOrderDetails);

module.exports = router;