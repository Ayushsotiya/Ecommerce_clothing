/**
 * Get Product Details Tool
 * Fetches detailed information about a specific product
 */

const Product = require('../../models/Product');
const mongoose = require('mongoose');

/**
 * Tool definition for LangChain
 */
const getProductDetailsTool = {
    name: "getProductDetails",
    description: "Get detailed information about a specific product by its ID. Use this when a customer wants more details about a particular product they've found or mentioned.",
    schema: {
        type: "object",
        properties: {
            productId: {
                type: "string",
                description: "The MongoDB ObjectId of the product"
            }
        },
        required: ["productId"]
    }
};

/**
 * Execute the get product details function
 * @param {Object} params - Parameters containing productId
 * @returns {Promise<Object>}
 */
const executeGetProductDetails = async (params) => {
    try {
        const { productId } = params;

        // Validate ObjectId
        if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
            return {
                success: false,
                error: 'Invalid product ID',
                message: 'Please provide a valid product ID'
            };
        }

        // Fetch product with populated references
        const product = await Product.findById(productId)
            .populate('category', 'name')
            .populate({
                path: 'reviewsAndRating',
                select: 'rating comment user createdAt',
                populate: {
                    path: 'user',
                    select: 'Name'
                },
                options: { limit: 5, sort: { createdAt: -1 } }
            })
            .lean();

        if (!product) {
            return {
                success: false,
                found: false,
                message: 'Product not found'
            };
        }

        // Calculate average rating
        let averageRating = 0;
        if (product.reviewsAndRating && product.reviewsAndRating.length > 0) {
            const totalRating = product.reviewsAndRating.reduce((sum, r) => sum + r.rating, 0);
            averageRating = (totalRating / product.reviewsAndRating.length).toFixed(1);
        }

        // Format reviews
        const reviews = (product.reviewsAndRating || []).map(r => ({
            rating: r.rating,
            comment: r.comment,
            reviewer: r.user?.Name || 'Anonymous',
            date: r.createdAt
        }));

        // Format product details
        const productDetails = {
            id: product._id.toString(),
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category?.name || 'Uncategorized',
            tags: product.tags || [],
            inStock: product.stock > 0,
            stockCount: product.stock,
            images: product.images || [],
            averageRating: parseFloat(averageRating),
            totalReviews: product.reviewsAndRating?.length || 0,
            recentReviews: reviews
        };

        return {
            success: true,
            found: true,
            product: productDetails
        };

    } catch (error) {
        console.error('Get Product Details Error:', error);
        return {
            success: false,
            error: 'Failed to fetch product details',
            message: error.message
        };
    }
};

module.exports = {
    getProductDetailsTool,
    executeGetProductDetails
};
