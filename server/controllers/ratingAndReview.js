const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");
const RatingAndReview = require("../models/ReviewsAndRating");

exports.addRatingAndReview = async (req, res) => {
    try {
        const { productId, comment, rating } = req.body;
        const userId = req.user.id;

        // Validate request
        if (!productId || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Please provide productId, rating, and comment',
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Check if the product exists and user has bought it
        const productDetails = await Product.findOne({
            _id: productId,
            userbought: { $in: [userId] }
        });

        if (!productDetails) {
            return res.status(403).json({
                success: false,
                message: 'User must buy the product before reviewing',
            });
        }

        // Check if user has already reviewed the product
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            product: productId,
        });

        if (alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: 'Product is already reviewed by the user',
            });
        }

        // Create a new review
        const ratingReview = await RatingAndReview.create({
            comment,
            rating,
            product: productId,
            user: userId,
        });

        // Update product with the new review
        await Product.findByIdAndUpdate(
            productId, 
            { $push: { reviewsAndRating: ratingReview._id } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Rating and review added successfully",
        });
    } catch (error) {
        console.error("Error adding review:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to add rating and review",
            error: error.message,
        });
    }
};
