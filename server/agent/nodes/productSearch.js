/**
 * Product Search Node
 * Handles product-related queries using search and detail tools
 */

const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { PRODUCT_SEARCH_PROMPT } = require('../prompts');
const { executeTool } = require('../tools');
const { geminiConfig } = require('../../Config/gemini');
const { extractContent } = require('../utils');

/**
 * Product Search node - handles product queries
 * @param {Object} state - Current agent state
 * @returns {Promise<Object>} - Updated state with tool results
 */
const productSearchNode = async (state) => {
    try {
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
        const toolSelectionPrompt = `${PRODUCT_SEARCH_PROMPT}

Customer message: "${latestMessage.content}"

Based on the customer's request, determine which tool to use and what parameters to pass.
Respond in JSON format ONLY with no additional text:
{
    "tool": "searchProducts" or "getProductDetails",
    "params": {
        // for searchProducts: "query", "category", "minPrice", "maxPrice", "limit"
        // for getProductDetails: "productId"
    }
}

If the customer is searching for products, extract:
- Search query (product name, type, or description keywords)
- Category if mentioned (Shirts, Pants, Dresses, etc.)
- Price range if mentioned

JSON response:`;

        const response = await model.invoke(toolSelectionPrompt);
        const contentText = extractContent(response);
        let toolCall;

        try {
            // Extract JSON from response (handle potential markdown code blocks)
            let jsonStr = contentText;
            const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (jsonMatch) {
                jsonStr = jsonMatch[1];
            }
            // Extract JSON object by finding matching braces
            const jsonStartIndex = jsonStr.indexOf('{');
            const jsonEndIndex = jsonStr.lastIndexOf('}');
            if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
                jsonStr = jsonStr.substring(jsonStartIndex, jsonEndIndex + 1);
            }
            toolCall = JSON.parse(jsonStr);
        } catch (parseError) {
            console.error('[ProductSearch] Failed to parse tool call:', parseError);
            // Default to simple search with user query
            toolCall = {
                tool: 'searchProducts',
                params: { query: latestMessage.content, limit: 5 }
            };
        }

        console.log(`[ProductSearch] Tool call:`, toolCall);

        // Execute the tool
        const toolResult = await executeTool(toolCall.tool, toolCall.params);

        console.log(`[ProductSearch] Tool result:`, JSON.stringify(toolResult, null, 2));

        return {
            toolResults: [{
                tool: toolCall.tool,
                params: toolCall.params,
                result: toolResult
            }],
            tokenCount: contentText.length
        };

    } catch (error) {
        console.error('[ProductSearch] Error:', error);
        return {
            error: `Product search error: ${error.message}`,
            toolResults: [{
                tool: 'searchProducts',
                result: { success: false, error: error.message }
            }]
        };
    }
};

module.exports = {
    productSearchNode
};
