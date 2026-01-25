/**
 * Get Recent Orders Tool
 * Fetches recent orders for the authenticated customer
 */

const Order = require('../../../models/Order');
const mongoose = require('mongoose');

/**
 * Tool definition for LangChain
 */
const getRecentOrdersTool = {
    name: "getRecentOrders",
    description: "Fetch recent orders for the authenticated customer. Use this when customers ask about their orders, recent purchases, or order history.",
    schema: {
        type: "object",
        properties: {
            limit: {
                type: "number",
                description: "Number of recent orders to fetch (default: 5, max: 10)"
            }
        },
        required: []
    }
};

/**
 * Execute the get recent orders function
 * @param {Object} params - Parameters
 * @param {string} userId - The authenticated user's ID
 * @returns {Promise<Object>}
 */
const executeGetRecentOrders = async (params, userId) => {
    try {
        // Check if user is authenticated
        if (!userId) {
            return {
                success: false,
                error: 'Authentication required',
                message: 'Please log in to view your orders'
            };
        }

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return {
                success: false,
                error: 'Invalid user ID',
                message: 'Unable to identify user'
            };
        }

        const { limit = 5 } = params;
        const orderLimit = Math.min(Math.max(1, limit), 10);

        // Fetch orders for user
        const orders = await Order.find({ user: userId })
            .populate({
                path: 'items.product',
                select: 'name price images'
            })
            .sort({ createdAt: -1 })
            .limit(orderLimit)
            .lean();

        if (orders.length === 0) {
            return {
                success: true,
                found: false,
                message: "You don't have any orders yet",
                orders: []
            };
        }

        // Format orders for response
        const formattedOrders = orders.map(order => ({
            orderId: order._id.toString(),
            status: order.status,
            totalAmount: order.totalAmount,
            orderDate: order.createdAt,
            itemCount: order.items.length,
            items: order.items.map(item => ({
                productName: item.product?.name || 'Product Unavailable',
                price: item.price,
                image: item.product?.images?.[0] || null
            }))
        }));

        return {
            success: true,
            found: true,
            count: formattedOrders.length,
            orders: formattedOrders
        };

    } catch (error) {
        console.error('Get Recent Orders Error:', error);
        return {
            success: false,
            error: 'Failed to fetch orders',
            message: error.message
        };
    }
};

module.exports = {
    getRecentOrdersTool,
    executeGetRecentOrders
};
