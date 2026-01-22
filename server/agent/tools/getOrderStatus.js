/**
 * Get Order Status Tool
 * Fetches the status of a specific order
 */

const Order = require('../../models/Order');
const mongoose = require('mongoose');

/**
 * Tool definition for LangChain
 */
const getOrderStatusTool = {
    name: "getOrderStatus",
    description: "Get the current status of a specific order by its ID. Use this when customers ask about a particular order's status, delivery, or tracking.",
    schema: {
        type: "object",
        properties: {
            orderId: {
                type: "string",
                description: "The MongoDB ObjectId of the order"
            }
        },
        required: ["orderId"]
    }
};

/**
 * Execute the get order status function
 * @param {Object} params - Parameters containing orderId
 * @param {string} userId - The authenticated user's ID
 * @returns {Promise<Object>}
 */
const executeGetOrderStatus = async (params, userId) => {
    try {
        const { orderId } = params;

        // Check if user is authenticated
        if (!userId) {
            return {
                success: false,
                error: 'Authentication required',
                message: 'Please log in to view order status'
            };
        }

        // Validate orderId
        if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
            return {
                success: false,
                error: 'Invalid order ID',
                message: 'Please provide a valid order ID'
            };
        }

        // Fetch order with security check (only owner can view)
        const order = await Order.findOne({ 
            _id: orderId,
            user: userId  // Security: ensure order belongs to user
        })
            .populate({
                path: 'items.product',
                select: 'name price images'
            })
            .lean();

        if (!order) {
            return {
                success: false,
                found: false,
                message: 'Order not found or you do not have permission to view it'
            };
        }

        // Status descriptions
        const statusDescriptions = {
            'Pending': 'Your order has been received and is being processed',
            'Shipped': 'Your order is on its way to you',
            'Delivered': 'Your order has been delivered',
            'Cancelled': 'This order has been cancelled'
        };

        // Format order details
        const orderDetails = {
            orderId: order._id.toString(),
            status: order.status,
            statusDescription: statusDescriptions[order.status] || 'Status unknown',
            totalAmount: order.totalAmount,
            orderDate: order.createdAt,
            itemCount: order.items.length,
            items: order.items.map(item => ({
                productName: item.product?.name || 'Product Unavailable',
                price: item.price,
                image: item.product?.images?.[0] || null
            }))
        };

        return {
            success: true,
            found: true,
            order: orderDetails
        };

    } catch (error) {
        console.error('Get Order Status Error:', error);
        return {
            success: false,
            error: 'Failed to fetch order status',
            message: error.message
        };
    }
};

module.exports = {
    getOrderStatusTool,
    executeGetOrderStatus
};
