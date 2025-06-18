const express = require("express");
const router = express.Router();

const {createCategory,deleteCategory,showAllCategory ,categoryPageDetails,findCategory} = require("../controllers/categoryController");
const {auth,isAdmin} = require("../middlewares/auth");


router.post("/createcategory" ,auth , isAdmin ,createCategory);
router.post("/deletecategory" ,auth , isAdmin ,deleteCategory);
router.post("/findCategory" ,auth , isAdmin ,findCategory);
router.get("/showallcategory",showAllCategory)
router.post("/categorypagedetails" ,categoryPageDetails);

module.exports = router;