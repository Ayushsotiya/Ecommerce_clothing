/**
 * Negotiation Node
 * LangGraph node for handling price negotiation
 */

const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { geminiConfig } = require('../../../Config/gemini');
const { extractContent } = require('../utils');
const Product = require('../../../models/Product');
const { processNegotiation } = require('../negotiation');

/**
 * Extract product and price info from user message using Gemini
 * Optimized to handle simple numeric inputs without API calls first
 * @param {string} message - User message
 * @returns {Promise<Object>} - { productQuery, offeredPrice }
 */
const extractNegotiationDetails = async (message) => {
    // 1. Try Simple Regex Extraction (Avoids API call for basic offers)
    const text = message.toLowerCase().trim();
    
    // Check for acceptance keywords
    const acceptKeywords = ['deal', 'ok', 'okay', 'accept', 'yes', 'agreed', 'take it'];
    if (acceptKeywords.some(kw => text.includes(kw)) && text.length < 50) { // Short acceptance message
        return { productQuery: '', offeredPrice: null, acceptCounterOffer: true };
    }

    // Check for simple price offers (e.g., "5000", "offer 5000", "5000 rupees")
    // Regex for numbers, possibly with currency symbols or "offer" keyword
    // Matches: "5000", "₹5000", "rs 5000", "offer 5000", "price 5000"
    const priceMatch = text.match(/(?:offer|price|for|at|rs\.?|₹|inr)?\s*[:\s]*(\d+(?:[.,]\d{1,2})?)/i);
    
    if (priceMatch && priceMatch[1]) {
        // If message is short or clearly just an offer, trust the regex
        // Avoids "I have 5000 problems" being interpreted as price, but we are in negotiation flow
        const price = parseFloat(priceMatch[1].replace(/,/g, ''));
        
        // If message is short (< 10 words) and contains a number, it's likely a price offer in this context
        const wordCount = text.split(/\s+/).length;
        if (wordCount < 15 && !isNaN(price)) {
            console.log(`[Negotiation] Regex extracted price: ${price}`);
            return { productQuery: '', offeredPrice: price };
        }
    }

    // 2. Fallback to Gemini for complex queries
    try {
        const model = new ChatGoogleGenerativeAI({
            model: geminiConfig.modelName,
            apiKey: geminiConfig.apiKey,
            temperature: 0.1,
            maxOutputTokens: 200,
        });

        const extractionPrompt = `Extract the product name/query and the offered price from this negotiation message.
Respond in EXACTLY this JSON format, nothing else:
{"productQuery": "product name (or empty string if none)", "offeredPrice": number_or_null, "acceptCounterOffer": boolean}

If the user mentions a specific price they want, extract it as offeredPrice (number only).
If no specific price is mentioned, set offeredPrice to null.
If user accepts an offer ("ok", "deal", "yes"), set acceptCounterOffer to true.

Customer message: "${message}"

JSON:`;

        const response = await model.invoke(extractionPrompt);
        const contentText = extractContent(response);

        // Try to parse JSON from the response
        const jsonMatch = contentText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
    } catch (e) {
        console.error('[Negotiation] Extraction error:', e);
        // Fallback to regex result if API failed but we found a number earlier
        if (priceMatch && priceMatch[1]) {
             return { productQuery: '', offeredPrice: parseFloat(priceMatch[1].replace(/,/g, '')) };
        }
    }

    return { productQuery: '', offeredPrice: null };
};

/**
 * Search for a product by query
 * @param {string} query
 * @returns {Promise<Object|null>}
 */
const findProduct = async (query) => {
    if (!query || query.trim() === '') return null;

    try {
        // Try exact name match first
        let product = await Product.findOne({
            name: { $regex: query, $options: 'i' }
        });

        if (product) return product;

        // Try tag-based search
        product = await Product.findOne({
            tags: { $elemMatch: { $regex: query, $options: 'i' } }
        });

        if (product) return product;

        // Try description search
        product = await Product.findOne({
            description: { $regex: query, $options: 'i' }
        });

        return product;
    } catch (error) {
        console.error('[Negotiation] Product search error:', error);
        return null;
    }
};

/**
 * Negotiation node - handles price negotiation
 * @param {Object} state - Current agent state
 * @returns {Promise<Object>} - Updated state
 */
const negotiationNode = async (state) => {
    try {
        const userId = state.userId;

        // Require authentication
        if (!userId) {
            return {
                toolResults: [{
                    tool: 'negotiation',
                    result: {
                        status: 'auth_required',
                        message: 'You need to be logged in to negotiate prices. Please sign in first!'
                    }
                }]
            };
        }

        // Get latest user message
        const userMessages = state.messages.filter(m => m.role === 'user');
        const latestMessage = userMessages[userMessages.length - 1];

        if (!latestMessage) {
            return {
                toolResults: [{
                    tool: 'negotiation',
                    result: { status: 'error', message: 'No message found to process.' }
                }]
            };
        }

        console.log(`[Negotiation] Processing: "${latestMessage.content}"`);

        // Extract negotiation details from message
        const details = await extractNegotiationDetails(latestMessage.content);
        console.log('[Negotiation] Extracted details:', details);

        // Check if user is accepting a counter-offer
        if (details.acceptCounterOffer) {
            // Look for an active session for this user with a counter offer
            const { getSession: getSessionFromStore } = require('../negotiation/store');
            
            // We need to find the active session - check negotiation data from previous state
            const previousNegotiationData = state.negotiationData;
            if (previousNegotiationData && previousNegotiationData.productId) {
                const session = getSessionFromStore(userId, previousNegotiationData.productId);
                if (session && session.counterOffer) {
                    const result = processNegotiation(
                        userId,
                        session.productId,
                        session.productName,
                        session.originalPrice,
                        session.counterOffer
                    );

                    return {
                        toolResults: [{
                            tool: 'negotiation',
                            result
                        }],
                        negotiationData: result,
                    };
                }
            }

            return {
                toolResults: [{
                    tool: 'negotiation',
                    result: {
                        status: 'no_active_session',
                        message: 'I don\'t see an active negotiation to accept. Please tell me which product you\'d like to negotiate on and your preferred price!'
                    }
                }]
            };
        }

        // Find the product
        let product = null;
        if (details.productQuery) {
            product = await findProduct(details.productQuery);
        }

        // If no product found from query, check if there's an active session
        if (!product) {
            // First check graph state negotiationData
            if (state.negotiationData && state.negotiationData.productId) {
                try {
                    product = await Product.findById(state.negotiationData.productId);
                } catch (e) {
                    // ignore invalid ID
                }
            }

            // If still not found, check the negotiation store for any active session for this user
            if (!product) {
                const { getUserActiveSession } = require('../negotiation/store');
                const session = getUserActiveSession(userId);
                if (session) {
                    try {
                        product = await Product.findById(session.productId);
                    } catch (e) {
                        // ignore invalid ID
                    }
                }
            }
        }

        if (!product) {
            return {
                toolResults: [{
                    tool: 'negotiation',
                    result: {
                        status: 'product_not_found',
                        message: details.productQuery
                            ? `I couldn't find a product matching "${details.productQuery}". Please check the product name and try again.`
                            : 'Could you tell me which product you\'d like to negotiate the price for?'
                    }
                }]
            };
        }

        // If no price offered, ask for one
        if (!details.offeredPrice) {
            const { getSession: getSessionFromStore } = require('../negotiation/store');
            const existingSession = getSessionFromStore(userId, product._id.toString());

            if (existingSession && existingSession.counterOffer) {
                return {
                    toolResults: [{
                        tool: 'negotiation',
                        result: {
                            status: 'awaiting_response',
                            productId: product._id.toString(),
                            productName: product.name,
                            originalPrice: product.price,
                            counterOffer: existingSession.counterOffer,
                            message: `We're currently negotiating on **${product.name}** (₹${product.price}). My last offer was **₹${existingSession.counterOffer}**. What do you say? You can accept it or make another offer!`
                        }
                    }],
                    negotiationData: {
                        productId: product._id.toString(),
                        productName: product.name,
                    },
                };
            }

            return {
                toolResults: [{
                    tool: 'negotiation',
                    result: {
                        status: 'awaiting_offer',
                        productId: product._id.toString(),
                        productName: product.name,
                        originalPrice: product.price,
                        message: `Sure! I see you want to negotiate on **${product.name}**, currently priced at **₹${product.price}**. What price would you like to offer?`
                    }
                }],
                negotiationData: {
                    productId: product._id.toString(),
                    productName: product.name,
                },
            };
        }

        // Process the negotiation
        const result = processNegotiation(
            userId,
            product._id.toString(),
            product.name,
            product.price,
            details.offeredPrice
        );

        return {
            toolResults: [{
                tool: 'negotiation',
                result
            }],
            negotiationData: {
                ...result,
                productId: product._id.toString(),
            },
        };

    } catch (error) {
        console.error('[Negotiation] Error:', error);
        return {
            toolResults: [{
                tool: 'negotiation',
                result: {
                    status: 'error',
                    message: 'Sorry, I had trouble processing your negotiation request. Please try again.'
                }
            }],
            error: `Negotiation error: ${error.message}`
        };
    }
};

module.exports = { negotiationNode };
