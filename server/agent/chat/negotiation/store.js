/**
 * Negotiation Store
 * In-memory store for active negotiation sessions and accepted deals
 */

const crypto = require('crypto');
const { NEGOTIATION_CONFIG } = require('./config');

// Active negotiation sessions: Map<sessionKey, NegotiationSession>
// sessionKey = `${userId}_${productId}`
const negotiationSessions = new Map();

// Accepted deal tokens: Map<token, AcceptedDeal>
const acceptedDeals = new Map();

/**
 * Generate a secure token for an accepted deal
 * @returns {string}
 */
const generateToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

/**
 * Get session key
 * @param {string} userId
 * @param {string} productId
 * @returns {string}
 */
const getSessionKey = (userId, productId) => `${userId}_${productId}`;

/**
 * Create or update a negotiation session
 * @param {string} userId
 * @param {string} productId
 * @param {Object} data
 * @returns {Object} session
 */
const createOrUpdateSession = (userId, productId, data) => {
    const key = getSessionKey(userId, productId);
    const existing = negotiationSessions.get(key);

    const session = {
        userId,
        productId,
        productName: data.productName || existing?.productName || '',
        originalPrice: data.originalPrice || existing?.originalPrice || 0,
        currentOffer: data.currentOffer || existing?.currentOffer || 0,
        counterOffer: data.counterOffer || null,
        round: (existing?.round || 0) + (data.incrementRound ? 1 : 0),
        status: data.status || 'negotiating', // 'negotiating' | 'accepted' | 'rejected' | 'expired'
        negotiatedPrice: data.negotiatedPrice || null,
        token: null,
        createdAt: existing?.createdAt || Date.now(),
        expiresAt: Date.now() + NEGOTIATION_CONFIG.NEGOTIATION_TTL,
    };

    negotiationSessions.set(key, session);
    return session;
};

/**
 * Get an active negotiation session
 * @param {string} userId
 * @param {string} productId
 * @returns {Object|null}
 */
const getSession = (userId, productId) => {
    const key = getSessionKey(userId, productId);
    const session = negotiationSessions.get(key);

    if (!session) return null;

    // Check expiry
    if (Date.now() > session.expiresAt) {
        negotiationSessions.delete(key);
        return null;
    }

    return session;
};

/**
 * Accept a negotiation and create a deal token
 * @param {string} userId
 * @param {string} productId
 * @param {number} negotiatedPrice
 * @returns {Object} accepted deal with token
 */
const acceptNegotiation = (userId, productId, negotiatedPrice) => {
    const key = getSessionKey(userId, productId);
    const session = negotiationSessions.get(key);
    const token = generateToken();

    const deal = {
        userId,
        productId,
        productName: session?.productName || '',
        originalPrice: session?.originalPrice || 0,
        negotiatedPrice,
        discount: session ? Math.round((1 - negotiatedPrice / session.originalPrice) * 100) : 0,
        token,
        createdAt: Date.now(),
        expiresAt: Date.now() + NEGOTIATION_CONFIG.NEGOTIATION_TTL,
        used: false,
    };

    // Store the deal token
    acceptedDeals.set(token, deal);

    // Update session status
    if (session) {
        session.status = 'accepted';
        session.negotiatedPrice = negotiatedPrice;
        session.token = token;
        negotiationSessions.set(key, session);
    }

    console.log(`[NegotiationStore] Deal accepted: ${deal.productName} ₹${deal.originalPrice} → ₹${deal.negotiatedPrice} (${deal.discount}% off)`);

    return deal;
};

/**
 * Validate a negotiation token for checkout
 * @param {string} token
 * @param {string} userId
 * @param {string} productId
 * @returns {Object|null} deal if valid, null otherwise
 */
const validateToken = (token, userId, productId) => {
    const deal = acceptedDeals.get(token);

    if (!deal) return null;
    if (deal.used) return null;
    if (deal.userId !== userId) return null;
    if (deal.productId !== productId) return null;
    if (Date.now() > deal.expiresAt) {
        acceptedDeals.delete(token);
        return null;
    }

    return deal;
};

/**
 * Mark a deal token as used (after successful payment)
 * @param {string} token
 */
const markTokenUsed = (token) => {
    const deal = acceptedDeals.get(token);
    if (deal) {
        deal.used = true;
        acceptedDeals.set(token, deal);
    }
};

/**
 * Get all active deals for a user
 * @param {string} userId
 * @returns {Array}
 */
const getUserDeals = (userId) => {
    const deals = [];
    for (const [, deal] of acceptedDeals) {
        if (deal.userId === userId && !deal.used && Date.now() < deal.expiresAt) {
            deals.push(deal);
        }
    }
    return deals;
};

/**
 * Get the most recent active negotiation session for a user
 * @param {string} userId
 * @returns {Object|null}
 */
const getUserActiveSession = (userId) => {
    let recentSession = null;

    for (const [, session] of negotiationSessions) {
        if (session.userId === userId && Date.now() < session.expiresAt) {
            // If we find multiple, pick the most recently updated one
            if (!recentSession || session.createdAt > recentSession.createdAt) {
                recentSession = session;
            }
        }
    }
    return recentSession;
};

/**
 * Clean up expired sessions and deals
 */
const cleanupExpired = () => {
    const now = Date.now();

    for (const [key, session] of negotiationSessions) {
        if (now > session.expiresAt) {
            negotiationSessions.delete(key);
        }
    }

    for (const [token, deal] of acceptedDeals) {
        if (now > deal.expiresAt) {
            acceptedDeals.delete(token);
        }
    }
};

// Clean up every 10 minutes
setInterval(cleanupExpired, 10 * 60 * 1000);

module.exports = {
    createOrUpdateSession,
    getSession,
    acceptNegotiation,
    validateToken,
    markTokenUsed,
    getUserDeals,
    getUserActiveSession,
    cleanupExpired,
};
