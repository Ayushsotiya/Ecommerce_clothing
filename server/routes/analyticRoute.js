const express =require('express');
const router = express.Router();


const  {monthlyRevenue,monthlyPurchase,totalCustomers} = require('../controllers/analytic');
const {auth,isAdmin} = require('../middlewares/auth')


router.get('/monthlyRevenue',monthlyRevenue);
router.get('/monthlyPurchase',monthlyPurchase);
router.get('/totalCustomers',totalCustomers);


module.exports = router;