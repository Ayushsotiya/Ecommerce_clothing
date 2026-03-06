/**
 * Response Generator Node
 * Formats tool results into natural language responses
 */

const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { RESPONSE_GENERATOR_PROMPT, NEGOTIATION_RESPONSE_PROMPT } = require('../prompts');
const { geminiConfig } = require('../../../Config/gemini');
const { extractContent } = require('../utils');

/**
 * Response Generator node - creates final response
 * @param {Object} state - Current agent state
 * @returns {Promise<Object>} - Updated state with final response
 */
const responseGeneratorNode = async (state) => {
    try {
        const model = new ChatGoogleGenerativeAI({
            model: geminiConfig.modelName,
            apiKey: geminiConfig.apiKey,
            temperature: 0.7,  // Higher temperature for more natural responses
            maxOutputTokens: 1000
        });

        // Get the latest user message
        const userMessages = state.messages.filter(m => m.role === 'user');
        const latestMessage = userMessages[userMessages.length - 1];

        // Handle errors
        if (state.error) {
            return {
                finalResponse: "I apologize, but I encountered an issue processing your request. Please try again or rephrase your question. 🙏"
            };
        }

        // Handle authentication required for orders
        if (state.currentIntent === 'order_query' && !state.userId) {
            return {
                finalResponse: "I'd be happy to help you with your orders! However, you'll need to log in first so I can access your order history. Please sign in and try again. 🔐"
            };
        }

        // Handle authentication required for negotiation
        if (state.currentIntent === 'price_negotiation' && !state.userId) {
            return {
                finalResponse: "I'd love to negotiate a great deal for you! But first, you'll need to log in so I can apply the special price to your account. Please sign in and try again. 🔐"
            };
        }

        // Handle general chat (no tools needed)
        if (state.currentIntent === 'general_chat' && state.toolResults.length === 0) {
            const generalPrompt = `${RESPONSE_GENERATOR_PROMPT}

Customer message: "${latestMessage.content}"

This is a general greeting or question not about products or orders.
Respond warmly and offer to help with:
- Finding products
- Checking orders (if they log in)
- General questions about the store

Response:`;

            const response = await model.invoke(generalPrompt);
            const contentText = extractContent(response);
            return {
                finalResponse: contentText,
                tokenCount: contentText.length
            };
        }

        // Format tool results for the prompt
        const toolResultsText = state.toolResults.map(tr => {
            return `Tool: ${tr.tool}\nResult: ${JSON.stringify(tr.result, null, 2)}`;
        }).join('\n\n');

        // Use negotiation-specific prompt for price negotiation
        const isNegotiation = state.currentIntent === 'price_negotiation';
        const basePrompt = isNegotiation ? NEGOTIATION_RESPONSE_PROMPT : RESPONSE_GENERATOR_PROMPT;

        // Generate response based on tool results
        const responsePrompt = `${basePrompt}

Customer message: "${latestMessage.content}"

Tool results:
${toolResultsText}

${isNegotiation
    ? 'Based on the negotiation results, create a response. If a deal was accepted, clearly state the negotiated price and that it\'s valid for a limited time. If it\'s a counter-offer, present it persuasively.'
    : 'Based on the tool results, create a helpful and friendly response for the customer.\nIf products were found, list them clearly with names and prices.\nIf orders were found, list them with status and date.\nIf nothing was found, be helpful and suggest alternatives.'}

Response:`;

        const response = await model.invoke(responsePrompt);
        const contentText = extractContent(response);

        // Build the response object
        const responseObj = {
            finalResponse: contentText,
            messages: [{
                role: 'assistant',
                content: contentText
            }],
            tokenCount: contentText.length
        };

        // Attach negotiation metadata if a deal was accepted
        if (isNegotiation && state.negotiationData) {
            const negData = state.negotiationData;
            if (negData.status === 'accepted' || negData.status === 'final_offer_accepted') {
                responseObj.negotiationData = {
                    status: negData.status,
                    productId: negData.productId,
                    productName: negData.productName,
                    originalPrice: negData.originalPrice,
                    negotiatedPrice: negData.negotiatedPrice,
                    discount: negData.discount,
                    token: negData.token,
                    expiresAt: negData.expiresAt,
                };
            } else {
                responseObj.negotiationData = {
                    status: negData.status,
                    productId: negData.productId,
                    productName: negData.productName,
                    originalPrice: negData.originalPrice,
                    counterOffer: negData.counterOffer,
                };
            }
        }

        return responseObj;

    } catch (error) {
        console.error('[ResponseGenerator] Error:', error);
        return {
            finalResponse: "I'm sorry, I had trouble generating a response. Please try asking your question again. 🙏",
            error: `Response generator error: ${error.message}`
        };
    }
};

module.exports = {
    responseGeneratorNode
};
