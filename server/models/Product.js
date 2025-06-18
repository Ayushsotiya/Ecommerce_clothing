const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    images: [
        {
        type: String,//we are going to fetch it from the cloudnary
        required: true
        }
    ],
    stock: {
        type: Number,
        required: true,
        min: 0, // No negative stock
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required:true
    },
    tags:[
        {
          type:String
        }
    ],
    reviewsAndRating: [
        {
           type:mongoose.Schema.Types.ObjectId,
           ref:"ReviewsAndRating"
        },
    ],
    userbought:[
        {
           type:mongoose.Schema.Types.ObjectId,
           ref:"User"
        }
    ]
})

module.exports = mongoose.model("Product", productSchema)