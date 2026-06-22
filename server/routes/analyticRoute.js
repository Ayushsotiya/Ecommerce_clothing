const express =require('express');
const router = express.Router();


const  {monthlyRevenue,monthlyPurchase} = require('../controllers/analytic');
const {auth,isAdmin} = require('../middlewares/auth')


router.get('/monthlyRevenue',monthlyRevenue);
router.get('/monthlyPurchase',monthlyPurchase);


module.exports = router;