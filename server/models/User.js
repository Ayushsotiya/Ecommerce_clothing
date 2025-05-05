    const mongoose = require('mongoose')


    const userSchema = new mongoose.Schema({
        Name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        phoneNo: {
            type: Number,
            required: true
        },
        password: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ['User', 'Admin'],
            required: true,
        },
        address: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Address",
        },
        cart: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            }
        ],
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order",
            }
        ],
        image: {
            type: String,
            required: true
        },
        approved: {
            type: Boolean,
            required: true,
        },
        token:{
            type:String,
        },
        resetPasswordExpires: {
            type: Date,
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
    })

    module.exports = mongoose.model("User", userSchema);