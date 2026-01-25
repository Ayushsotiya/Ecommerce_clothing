const { genAI } = require('../shared/geminiClient');
const { PRODUCT_ANALYSIS_PROMPT } = require('./prompts');
const fs = require('fs');
const mime = require('mime-types');
const { geminiConfig } = require('../../Config/gemini');

async function analyzeWithGemini(filePaths) {
    try {
        const modelName = geminiConfig.modelName || "gemini-1.5-flash";
        const model = genAI.getGenerativeModel({ model: modelName });

        // prepare media for the API
        const mediaParts = [];
        
        for (const path of filePaths) {
            const fileData = fs.readFileSync(path);
            const lookupType = mime.lookup(path);
            const mimeType = lookupType || 'image/jpeg';
            
            mediaParts.push({
                inlineData: {
                    data: fileData.toString('base64'),
                    mimeType: mimeType
                }
            });
        }

        const result = await model.generateContent([
            PRODUCT_ANALYSIS_PROMPT,
            ...mediaParts
        ]);

        const response = await result.response;
        const text = response.text();
        
        // Clean up response to ensure valid JSON
        // Sometimes LLMs wrap JSON in markdown code blocks
        let jsonStr = text.trim();
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.replace(/^```json/, '').replace(/```$/, '');
        } else if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/^```/, '').replace(/```$/, '');
        }
        
        const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Invalid JSON response structure from Gemini');
        }
        
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Gemini Analysis Error:', error);
        throw error;
    }
}

module.exports = { analyzeWithGemini };
