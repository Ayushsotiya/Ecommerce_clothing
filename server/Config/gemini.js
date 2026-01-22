const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });



const geminiConfig = {
    apiKey: process.env.GEMINI_API_KEY,
    modelName: "gemini-2.5-flash",
};

// Debug: Log if API key is loaded
console.log('[Config] GEMINI_API_KEY loaded:', geminiConfig.apiKey ? 'Yes (starts with ' + geminiConfig.apiKey.substring(0, 10) + '...)' : 'No');

// Validate API key on load
if (!geminiConfig.apiKey) {
    console.error('[Config] ERROR: GEMINI_API_KEY is not set in environment variables');
    console.error('[Config] Please add GEMINI_API_KEY=your_key to server/.env file');
}

module.exports = { geminiConfig };
