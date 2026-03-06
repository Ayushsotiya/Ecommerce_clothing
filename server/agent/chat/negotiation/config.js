/**
 * Negotiation Configuration
 * Business rules for AI-powered price negotiation
 */

const NEGOTIATION_CONFIG = {
    // Maximum discount percentage allowed (e.g., 15 = max 15% off)
    MAX_DISCOUNT_PERCENT: parseInt(process.env.NEGOTIATION_MAX_DISCOUNT) || 15,

    // Absolute minimum price floor in INR
    MIN_PRICE_FLOOR: parseInt(process.env.NEGOTIATION_MIN_PRICE) || 99,

    // How long a negotiated price is valid (in milliseconds) - 30 minutes
    NEGOTIATION_TTL: parseInt(process.env.NEGOTIATION_TTL) || 30 * 60 * 1000,

    // Maximum back-and-forth rounds before final offer
    MAX_ROUNDS: parseInt(process.env.NEGOTIATION_MAX_ROUNDS) || 5,

    // Counter-offer strategy: how aggressively the AI counters
    // The AI will offer (user_offer + (original - user_offer) * COUNTER_FACTOR)
    COUNTER_OFFER_FACTOR: parseFloat(process.env.NEGOTIATION_COUNTER_FACTOR) || 0.6,

    // Minimum discount to auto-accept without negotiation (percentage)
    AUTO_ACCEPT_THRESHOLD: parseInt(process.env.NEGOTIATION_AUTO_ACCEPT) || 5,
};

module.exports = { NEGOTIATION_CONFIG };
