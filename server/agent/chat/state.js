/**
 * LangGraph Agent State Schema
 * Defines the state structure for the multi-agent system
 */

/**
 * @typedef {Object} AgentState
 * @property {Array<{role: string, content: string}>} messages - Conversation history
 * @property {string|null} userId - Authenticated user ID from JWT
 * @property {string|null} currentIntent - "product_search" | "order_query" | "general_chat"
 * @property {Array<Object>} toolResults - Results from tool executions
 * @property {number} tokenCount - Track token usage for rate limiting
 * @property {number} requestCount - Track API calls for rate limiting
 * @property {string|null} error - Error message if any
 * @property {string|null} finalResponse - The final response to send to user
 */

/**
 * Creates initial state for a new conversation
 * @param {string|null} userId - User ID if authenticated
 * @param {string} userMessage - The initial user message
 * @returns {AgentState}
 */
const createInitialState = (userId, userMessage) => {
    return {
        messages: [
            {
                role: "user",
                content: userMessage
            }
        ],
        userId: userId || null,
        currentIntent: null,
        toolResults: [],
        tokenCount: 0,
        requestCount: 0,
        error: null,
        finalResponse: null
    };
};

/**
 * State annotation for LangGraph
 * Defines how state updates are merged
 */
const stateAnnotation = {
    messages: {
        reducer: (current, update) => [...current, ...update],
        default: () => []
    },
    userId: {
        reducer: (_, update) => update,
        default: () => null
    },
    currentIntent: {
        reducer: (_, update) => update,
        default: () => null
    },
    toolResults: {
        reducer: (current, update) => [...current, ...update],
        default: () => []
    },
    tokenCount: {
        reducer: (current, update) => current + update,
        default: () => 0
    },
    requestCount: {
        reducer: (current, update) => current + update,
        default: () => 0
    },
    error: {
        reducer: (_, update) => update,
        default: () => null
    },
    finalResponse: {
        reducer: (_, update) => update,
        default: () => null
    }
};

module.exports = {
    createInitialState,
    stateAnnotation
};
