/**
 * Order Management Node
 * Handles order-related queries for authenticated users
 */

const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { ORDER_MANAGEMENT_PROMPT } = require('../prompts');
const { executeTool } = require('../tools');
const { geminiConfig } = require('../../Config/gemini');
const { extractContent } = require('../utils');

/**
 * Order Management node - handles order queries
 * @param {Object} state - Current agent state
 * @returns {Promise<Object>} - Updated state with tool results
 */
const orderManagementNode = async (state) => {
    try {
        // Check authentication first
        if (!state.userId) {
            return {
                toolResults: [{
                    tool: 'authentication',
                    result: {
                        success: false,
                        error: 'Authentication required',
                        message: 'Please log in to view your orders'
                    }
                }]
            };
        }

        const model = new ChatGoogleGenerativeAI({
            model: geminiConfig.modelName,
            apiKey: geminiConfig.apiKey,
            temperature: 0.3,
            maxOutputTokens: 500
        });

        // Get the latest user message
        const userMessages = state.messages.filter(m => m.role === 'user');
        const latestMessage = userMessages[userMessages.length - 1];

        // Create tool selection prompt
        const toolSelectionPrompt = `${ORDER_MANAGEMENT_PROMPT}

Customer message: "${latestMessage.content}"

Based on the customer's request, determine which tool to use:
- Use "getRecentOrders" if the customer wants to see their order history or recent purchases
- Use "getOrderStatus" if the customer mentions a specific order ID or asks about a particular order

Respond in JSON format ONLY with no additional text:
{
    "tool": "getRecentOrders" or "getOrderStatus",
    "params": {
        // for getRecentOrders: "limit" (optional, default 5)
        // for getOrderStatus: "orderId" (required)
    }
}

If you detect an order ID in the message (a 24-character alphanumeric string), use getOrderStatus.
Otherwise, use getRecentOrders.

JSON response:`;

        const response = await model.invoke(toolSelectionPrompt);
        const contentText = extractContent(response);
        let toolCall;

        try {
            // Extract JSON from response
            let jsonStr = contentText;
            const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (jsonMatch) {
                jsonStr = jsonMatch[1];
            }
            const jsonStartIndex = jsonStr.indexOf('{');
            if (jsonStartIndex > 0) {
                jsonStr = jsonStr.substring(jsonStartIndex);
            }
            toolCall = JSON.parse(jsonStr);
        } catch (parseError) {
            console.error('[OrderManagement] Failed to parse tool call:', parseError);
            // Default to recent orders
            toolCall = {
                tool: 'getRecentOrders',
                params: { limit: 5 }
            };
        }

        console.log(`[OrderManagement] Tool call:`, toolCall);

        // Execute the tool with userId
        const toolResult = await executeTool(toolCall.tool, toolCall.params, state.userId);

        console.log(`[OrderManagement] Tool result:`, JSON.stringify(toolResult, null, 2));

        return {
            toolResults: [{
                tool: toolCall.tool,
                params: toolCall.params,
                result: toolResult
            }],
            tokenCount: contentText.length
        };

    } catch (error) {
        console.error('[OrderManagement] Error:', error);
        return {
            error: `Order management error: ${error.message}`,
            toolResults: [{
                tool: 'getRecentOrders',
                result: { success: false, error: error.message }
            }]
        };
    }
};

module.exports = {
    orderManagementNode
};
