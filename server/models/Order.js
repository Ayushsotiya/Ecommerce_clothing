const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  
        required: true,
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product", 
                required: true,
            },
            // quantity: {
            //     type: Number,
            //     required: true,
            //     min: 1, 
            // },
            price: {
                type: Number,
                required: true,
                min:0,
            },
        },
    ],

    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Order", orderSchema);
