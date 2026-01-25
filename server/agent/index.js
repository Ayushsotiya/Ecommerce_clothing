/**
 * LangGraph Agent Main Module
 * Entry point for the E-commerce AI Agent System
 * 
 * Exports:
 * 1. Conversational Agent (Chat)
 * 2. Product Analysis Agent (Vision)
 */

// Export Chat Agent
const { processChat } = require('./chat');
const { rateLimiter, getRemainingRequests, RATE_LIMIT_CONFIG } = require('./shared/rateLimiter');

// Export Product Analysis Agent
const { analyzeProductImages } = require('./product-analysis');

module.exports = {
    // Chat Agent
    processChat,
    rateLimiter,
    getRemainingRequests,
    RATE_LIMIT_CONFIG,
    
    // Product Analysis Agent
    analyzeProductImages
};

