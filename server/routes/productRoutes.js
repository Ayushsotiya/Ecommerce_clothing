const express = require("express");
const router = express.Router();
const { createProduct ,getAllProducts , updateProduct, deleteProduct } = require("../controllers/productController");
const {auth,isAdmin} = require("../middlewares/auth");


router.post("/createproduct" ,auth , isAdmin ,createProduct);
router.get("/getallproduct",getAllProducts)
router.post("/updateproduct" ,auth , isAdmin ,updateProduct);
router.delete("/deleteproduct" ,auth , isAdmin ,deleteProduct);
module.exports = router;