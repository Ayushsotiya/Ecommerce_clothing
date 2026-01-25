/**
 * Tools Index
 * Exports all agent tools and their executors
 */

const { searchProductsTool, executeSearchProducts } = require('./searchProducts');
const { getProductDetailsTool, executeGetProductDetails } = require('./getProductDetails');
const { getRecentOrdersTool, executeGetRecentOrders } = require('./getRecentOrders');
const { getOrderStatusTool, executeGetOrderStatus } = require('./getOrderStatus');

// Tool definitions for LangChain
const toolDefinitions = [
    searchProductsTool,
    getProductDetailsTool,
    getRecentOrdersTool,
    getOrderStatusTool
];

// Map of tool names to executors
const toolExecutors = {
    searchProducts: executeSearchProducts,
    getProductDetails: executeGetProductDetails,
    getRecentOrders: executeGetRecentOrders,
    getOrderStatus: executeGetOrderStatus
};

/**
 * Execute a tool by name
 * @param {string} toolName - Name of the tool to execute
 * @param {Object} params - Tool parameters
 * @param {string|null} userId - User ID for authenticated tools
 * @returns {Promise<Object>}
 */
const executeTool = async (toolName, params, userId = null) => {
    const executor = toolExecutors[toolName];
    
    if (!executor) {
        return {
            success: false,
            error: 'Unknown tool',
            message: `Tool "${toolName}" not found`
        };
    }

    // Tools that require userId
    const authRequiredTools = ['getRecentOrders', 'getOrderStatus'];
    
    if (authRequiredTools.includes(toolName)) {
        return await executor(params, userId);
    }
    
    return await executor(params);
};

module.exports = {
    toolDefinitions,
    toolExecutors,
    executeTool,
    // Individual exports
    searchProductsTool,
    getProductDetailsTool,
    getRecentOrdersTool,
    getOrderStatusTool
};
