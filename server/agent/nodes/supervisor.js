/**
 * Supervisor Node
 * Classifies user intent and routes to appropriate specialist agent
 */

const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { SUPERVISOR_PROMPT } = require('../prompts');
const { geminiConfig } = require('../../Config/gemini');
const { extractContent } = require('../utils');

/**
 * Supervisor node - classifies user intent
 * @param {Object} state - Current agent state
 * @returns {Promise<Object>} - Updated state with intent
 */
const supervisorNode = async (state) => {
    try {
        if (!geminiConfig.apiKey) {
            console.error('[Supervisor] GEMINI_API_KEY is not set in environment variables');
            return {
                error: 'AI service not configured. Please set GEMINI_API_KEY.',
                currentIntent: 'general_chat'
            };
        }

        const model = new ChatGoogleGenerativeAI({
            model: geminiConfig.modelName,
            apiKey: geminiConfig.apiKey,
            temperature: 0.1,  // Low temperature for consistent classification
            maxOutputTokens: 50
        });

        // Get the latest user message
        const userMessages = state.messages.filter(m => m.role === 'user');
        const latestMessage = userMessages[userMessages.length - 1];

        if (!latestMessage) {
            return {
                error: 'No user message found',
                currentIntent: 'general_chat'
            };
        }

        // Create classification prompt
        const classificationPrompt = `${SUPERVISOR_PROMPT}

Customer message: "${latestMessage.content}"

Intent category:`;

        const response = await model.invoke(classificationPrompt);
        const contentText = extractContent(response);
        
        const intentRaw = contentText.toLowerCase().trim();

        // Parse intent from response
        let intent = 'general_chat';
        if (intentRaw.includes('product_search') || intentRaw.includes('product')) {
            intent = 'product_search';
        } else if (intentRaw.includes('order_query') || intentRaw.includes('order')) {
            intent = 'order_query';
        } else if (intentRaw.includes('general_chat') || intentRaw.includes('general')) {
            intent = 'general_chat';
        }

        console.log(`[Supervisor] Classified intent: ${intent} (raw: ${intentRaw})`);

        return {
            currentIntent: intent,
            tokenCount: contentText.length  // Approximate token count
        };

    } catch (error) {
        console.error('[Supervisor] Error:', error);
        return {
            error: `Supervisor error: ${error.message}`,
            currentIntent: 'general_chat'  // Default to general chat on error
        };
    }
};

/**
 * Router function - determines next node based on intent
 * @param {Object} state - Current agent state
 * @returns {string} - Next node name
 */
const routeByIntent = (state) => {
    if (state.error) {
        return 'responseGenerator';
    }

    switch (state.currentIntent) {
        case 'product_search':
            return 'productSearch';
        case 'order_query':
            // Check if user is authenticated for order queries
            if (!state.userId) {
                return 'responseGenerator';  // Will handle auth message
            }
            return 'orderManagement';
        case 'general_chat':
        default:
            return 'responseGenerator';
    }
};

module.exports = {
    supervisorNode,
    routeByIntent
};
