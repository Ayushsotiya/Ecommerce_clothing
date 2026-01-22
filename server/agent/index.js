/**
 * LangGraph Agent Main Module
 * Entry point for the e-commerce communication AI agent
 */

const { getAgentGraph } = require('./graph');
const { createInitialState } = require('./state');
const { rateLimiter, getRemainingRequests, RATE_LIMIT_CONFIG } = require('./rateLimiter');

// In-memory conversation store (for multi-turn support)
// In production, use Redis or a database
const conversationStore = new Map();

// Conversation expiry time (30 minutes)
const CONVERSATION_TTL = 30 * 60 * 1000;

/**
 * Generate a conversation ID
 * @returns {string}
 */
const generateConversationId = () => {
    return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Get or create conversation history
 * @param {string} conversationId
 * @returns {Object}
 */
const getConversation = (conversationId) => {
    if (conversationId && conversationStore.has(conversationId)) {
        const conv = conversationStore.get(conversationId);
        if (Date.now() - conv.lastUpdated < CONVERSATION_TTL) {
            return conv;
        }
        // Expired, delete it
        conversationStore.delete(conversationId);
    }
    return null;
};

/**
 * Save conversation history
 * @param {string} conversationId
 * @param {Array} messages
 */
const saveConversation = (conversationId, messages) => {
    conversationStore.set(conversationId, {
        messages: messages.slice(-RATE_LIMIT_CONFIG.maxConversationLength * 2), // Keep last N exchanges
        lastUpdated: Date.now()
    });
};

/**
 * Process a chat message through the agent
 * @param {string} message - User message
 * @param {string|null} userId - Authenticated user ID
 * @param {string|null} conversationId - Existing conversation ID
 * @returns {Promise<Object>}
 */
const processChat = async (message, userId = null, conversationId = null) => {
    try {
        // Validate message
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return {
                success: false,
                error: 'Invalid message',
                message: 'Please provide a valid message'
            };
        }

        // Check message length
        if (message.length > RATE_LIMIT_CONFIG.maxTokensPerRequest) {
            return {
                success: false,
                error: 'Message too long',
                message: `Message exceeds maximum length of ${RATE_LIMIT_CONFIG.maxTokensPerRequest} characters`
            };
        }

        // Get or create conversation
        const existingConv = getConversation(conversationId);
        const currentConversationId = existingConv ? conversationId : generateConversationId();

        // Initialize state with conversation history
        const initialMessages = existingConv ? [...existingConv.messages] : [];
        initialMessages.push({
            role: 'user',
            content: message.trim()
        });

        const initialState = {
            messages: initialMessages,
            userId: userId,
            currentIntent: null,
            toolResults: [],
            tokenCount: 0,
            error: null,
            finalResponse: null
        };

        console.log(`[Agent] Processing message for conversation: ${currentConversationId}`);
        console.log(`[Agent] User ID: ${userId || 'guest'}`);
        console.log(`[Agent] Message: ${message.substring(0, 100)}...`);

        // Get and run the graph
        const graph = getAgentGraph();
        const result = await graph.invoke(initialState);

        console.log(`[Agent] Graph completed. Intent: ${result.currentIntent}`);

        // Save conversation history
        if (result.finalResponse) {
            initialMessages.push({
                role: 'assistant',
                content: result.finalResponse
            });
            saveConversation(currentConversationId, initialMessages);
        }

        return {
            success: true,
            response: result.finalResponse || "I'm not sure how to help with that. Could you please rephrase?",
            conversationId: currentConversationId,
            intent: result.currentIntent,
            tokenCount: result.tokenCount || 0
        };

    } catch (error) {
        console.error('[Agent] Error processing chat:', error);
        return {
            success: false,
            error: 'Agent error',
            message: error.message || 'An unexpected error occurred'
        };
    }
};

/**
 * Clean up expired conversations (call periodically)
 */
const cleanupConversations = () => {
    const now = Date.now();
    for (const [id, conv] of conversationStore) {
        if (now - conv.lastUpdated > CONVERSATION_TTL) {
            conversationStore.delete(id);
        }
    }
};

// Run cleanup every 10 minutes
setInterval(cleanupConversations, 10 * 60 * 1000);

module.exports = {
    processChat,
    rateLimiter,
    getRemainingRequests,
    RATE_LIMIT_CONFIG
};
