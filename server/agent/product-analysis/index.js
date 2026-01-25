const { analyzeWithGemini } = require('./analyzer');

/**
 * Main entry point for product analysis
 * @param {string[]} filePaths - Array of absolute file paths to images or videos
 * @returns {Promise<Object>} - { success: boolean, description, category, tags, error }
 */
async function analyzeProductImages(filePaths) {
    try {
        if (!filePaths || filePaths.length === 0) {
            throw new Error('No file paths provided');
        }

        console.log(`[Product Analysis] Analyzing ${filePaths.length} media files with Gemini...`);
        const result = await analyzeWithGemini(filePaths);
        
        return {
            success: true,
            ...result
        };
    } catch (error) {
        console.error('[Product Analysis] Error:', error);
        return {
            success: false,
            error: error.message || 'Failed to analyze product images'
        };
    }
}

module.exports = { analyzeProductImages };
