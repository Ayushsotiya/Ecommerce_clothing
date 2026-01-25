/**
 * Utility functions for agent nodes
 */

/**
 * Extract text content from langchain response
 * Handles both string and array formats
 * @param {Object} response - Langchain model response
 * @returns {string} - Extracted text content
 */
const extractContent = (response) => {
    // console.log('[Utils] Response type:', typeof response);
    
    if (!response) {
        return '';
    }
    
    // Check for text property (some models return this)
    if (response.text) {
        return response.text;
    }
    
    if (!response.content) {
        return '';
    }
    
    if (typeof response.content === 'string') {
        return response.content;
    }
    
    if (Array.isArray(response.content)) {
        const text = response.content.map(c => {
            if (typeof c === 'string') return c;
            if (c && c.text) return c.text;
            if (c && c.type === 'text' && c.text) return c.text;
            return '';
        }).join('');
        return text;
    }
    
    return String(response.content);
};

module.exports = { extractContent };
