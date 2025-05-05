const cloudinary = require('cloudinary').v2;
require("dotenv").config();


exports.cloudinaryConnect = ()=>{
    try{
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key:process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET
        });
    }catch(error){
        console.error(error);
    }
}

