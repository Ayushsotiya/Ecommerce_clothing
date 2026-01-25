/**
 * In-Memory Rate Limiter for Agent API
 * Tracks request counts per user/IP with configurable limits
 */

// Configuration (can be overridden via environment variables)
const RATE_LIMIT_CONFIG = {
    requestsPerMinute: parseInt(process.env.AGENT_RATE_LIMIT_REQUESTS_PER_MIN) || 10,
    requestsPerDay: parseInt(process.env.AGENT_RATE_LIMIT_REQUESTS_PER_DAY) || 100,
    maxTokensPerRequest: parseInt(process.env.AGENT_MAX_TOKENS_PER_REQUEST) || 1000,
    maxConversationLength: parseInt(process.env.AGENT_MAX_CONVERSATION_LENGTH) || 20
};

// In-memory storage for rate limits
// Structure: { identifier: { minute: { count, resetAt }, day: { count, resetAt } } }
const rateLimitStore = new Map();

/**
 * Get the rate limit identifier (userId or IP)
 * @param {Object} req - Express request object
 * @returns {string}
 */
const getIdentifier = (req) => {
    if (req.user && req.user.id) {
        return `user:${req.user.id}`;
    }
    return `ip:${req.ip || req.connection.remoteAddress || 'unknown'}`;
};

/**
 * Get or create rate limit record for identifier
 * @param {string} identifier
 * @returns {Object}
 */
const getRecord = (identifier) => {
    const now = Date.now();
    
    if (!rateLimitStore.has(identifier)) {
        rateLimitStore.set(identifier, {
            minute: { count: 0, resetAt: now + 60000 },
            day: { count: 0, resetAt: now + 86400000 }
        });
    }
    
    const record = rateLimitStore.get(identifier);
    
    // Reset minute counter if expired
    if (now > record.minute.resetAt) {
        record.minute = { count: 0, resetAt: now + 60000 };
    }
    
    // Reset day counter if expired
    if (now > record.day.resetAt) {
        record.day = { count: 0, resetAt: now + 86400000 };
    }
    
    return record;
};

/**
 * Rate limiter middleware
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
const rateLimiter = (req, res, next) => {
    const identifier = getIdentifier(req);
    const record = getRecord(identifier);
    const now = Date.now();
    
    // Check minute limit
    if (record.minute.count >= RATE_LIMIT_CONFIG.requestsPerMinute) {
        const retryAfter = Math.ceil((record.minute.resetAt - now) / 1000);
        return res.status(429).json({
            success: false,
            error: 'Rate limit exceeded',
            message: `Too many requests. Please try again in ${retryAfter} seconds.`,
            retryAfter: retryAfter
        });
    }
    
    // Check daily limit
    if (record.day.count >= RATE_LIMIT_CONFIG.requestsPerDay) {
        const retryAfter = Math.ceil((record.day.resetAt - now) / 1000);
        return res.status(429).json({
            success: false,
            error: 'Daily limit exceeded',
            message: `Daily request limit reached. Please try again tomorrow.`,
            retryAfter: retryAfter
        });
    }
    
    // Increment counters
    record.minute.count++;
    record.day.count++;
    
    // Attach rate limit info to request
    req.rateLimit = {
        remainingMinute: RATE_LIMIT_CONFIG.requestsPerMinute - record.minute.count,
        remainingDay: RATE_LIMIT_CONFIG.requestsPerDay - record.day.count,
        resetMinute: record.minute.resetAt,
        resetDay: record.day.resetAt
    };
    
    next();
};

/**
 * Get remaining requests for a user
 * @param {Object} req - Express request
 * @returns {Object}
 */
const getRemainingRequests = (req) => {
    const identifier = getIdentifier(req);
    const record = getRecord(identifier);
    
    return {
        perMinute: Math.max(0, RATE_LIMIT_CONFIG.requestsPerMinute - record.minute.count),
        perDay: Math.max(0, RATE_LIMIT_CONFIG.requestsPerDay - record.day.count)
    };
};

/**
 * Clean up expired rate limit records (call periodically)
 */
const cleanup = () => {
    const now = Date.now();
    for (const [identifier, record] of rateLimitStore) {
        if (now > record.day.resetAt) {
            rateLimitStore.delete(identifier);
        }
    }
};

// Run cleanup every hour
setInterval(cleanup, 3600000);

module.exports = {
    rateLimiter,
    getRemainingRequests,
    RATE_LIMIT_CONFIG
};
