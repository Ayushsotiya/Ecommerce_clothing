import { apiConnector } from "../apiConnector";
import { ai } from "../api";

const { CHAT_API, NEGOTIATE_API } = ai;

/**
 * Send a message to the AI chatbot
 * @param {string} message - The user's message
 * @param {string|null} conversationId - Optional conversation ID for multi-turn chat
 * @param {string|null} token - Optional JWT token for authenticated users
 * @returns {Promise<Object>}
 */
export async function sendChatMessage(message, conversationId = null, token = null) {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // Add auth header if token is provided
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await apiConnector(
            "POST",
            CHAT_API,
            {
                message,
                conversationId
            },
            headers
        );

        if (!response.data.success) {
            throw new Error(response.data.message || 'Chat request failed');
        }

        return {
            success: true,
            response: response.data.response,
            conversationId: response.data.conversationId,
            usage: response.data.usage,
            negotiation: response.data.negotiation || null
        };

    } catch (error) {
        console.error('Chat API Error:', error);
        return {
            success: false,
            error: error.response?.data?.message || error.message || 'Failed to send message'
        };
    }
}

/**
 * Start a direct negotiation for a product (from cart button)
 * Bypasses the LLM chat pipeline entirely
 * @param {string} productId - The product's MongoDB _id
 * @param {number|null} userOffer - Optional specific price the user wants
 * @param {string} token - JWT token (required, must be authenticated)
 * @returns {Promise<Object>}
 */
export async function startNegotiation(productId, userOffer = null, token) {
    try {
        const body = { productId };
        if (userOffer !== null && userOffer !== undefined) {
            body.userOffer = userOffer;
        }

        const response = await apiConnector(
            "POST",
            NEGOTIATE_API,
            body,
            {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        );

        if (!response.data.success) {
            throw new Error(response.data.message || 'Negotiation failed');
        }

        return {
            success: true,
            negotiation: response.data.negotiation,
        };

    } catch (error) {
        console.error('Negotiation API Error:', error);
        return {
            success: false,
            error: error.response?.data?.message || error.message || 'Failed to negotiate'
        };
    }
}
