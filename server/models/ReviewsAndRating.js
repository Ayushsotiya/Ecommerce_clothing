const mongoose = require("mongoose");

const reviewAndRatingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    comment: {
        type: String,
        trim: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("ReviewAndRating",  reviewAndRatingSchema);
