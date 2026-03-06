/**
 * Negotiation Module
 * Barrel exports
 */

const { NEGOTIATION_CONFIG } = require('./config');
const { processNegotiation, startNegotiation } = require('./negotiate');
const {
    createOrUpdateSession,
    getSession,
    acceptNegotiation,
    validateToken,
    markTokenUsed,
    getUserDeals,
} = require('./store');

module.exports = {
    NEGOTIATION_CONFIG,
    processNegotiation,
    startNegotiation,
    createOrUpdateSession,
    getSession,
    acceptNegotiation,
    validateToken,
    markTokenUsed,
    getUserDeals,
};
