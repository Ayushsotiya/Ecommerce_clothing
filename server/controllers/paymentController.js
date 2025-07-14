const { Cursor } = require("mongoose");
const {instance} = require("../Config/razorpay");
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const crypto = require("crypto");
require("dotenv").config();

// working
exports.createPayment = async (req, res) => {
    try {
        console.log("1")
        let { products } = req.body;
        if (!Array.isArray(products)) {
            if (typeof products === "object") {
                products = [products];
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid products format",
                });
            }
        }
         console.log("2")
        let total_amount = 0;
        for (const product_id of products) {
            let prod;
            try {
                prod = await Product.findById(product_id);
                if (!prod) {
                    return res.status(404).json({ success: false, message: `Could not find the product: ${product_id}` });
                }
                total_amount += prod.price;
            } catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: error.message });
            }
        }
         console.log("3")
        try {
            const option = {
                amount: total_amount * 100, // amount in paise
                currency: "INR",
                receipt: Date.now().toString(),
            };
            const paymentResponse = await instance.orders.create(option);
            console.log("created");
            return res.json({
                success: true,
                data: paymentResponse,
            });
        } catch (error) {
            return res.status(501).json({
                success: false,
                message: "Failed to make payment",
            });
          
        }
         
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create payment",
        });
    }
};

exports.verifyPayment = async (req, res) => {
    console.log("verification started in the backend");
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, products } = req.body;
    const userId = req.user.id;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !products || !userId) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the details",
        });
    }
    let hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');
    if (razorpay_signature === generated_signature) {
        return await addProductToCustomer(products, userId, res);
    } else {
        return res.json({ success: false, message: "Payment verification failed" });
    }
};

const addProductToCustomer = async (products, userId, res) => {
    if (!products || !userId) {
        return res.status(400).json({ success: false, message: "Please provide products and User ID" });
    }
    try {
        let orderItems = [];
        let totalAmount = 0;
        for (const product_id of products) {
            const product = await Product.findById(product_id);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product not found: ${product_id}` });
            }
            if (!product.userbought.includes(userId)) {
                product.userbought.push(userId);
                await product.save();
            }
            orderItems.push({ product: product._id, price: product.price });
            totalAmount += product.price;
        }
        const order = await Order.create({
            user: userId,
            items: orderItems,
            totalAmount,
            status: "Pending",
        });
        await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });
        return res.status(200).json({ success: true, message: "Order placed successfully", order });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};