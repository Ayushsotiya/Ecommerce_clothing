const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import agent modules
const { processChat, rateLimiter, getRemainingRequests } = require('../agent');
const { auth } = require('../middlewares/auth');
const { validateToken, getUserDeals, startNegotiation } = require('../agent/chat/negotiation');
const Product = require('../models/Product');

const router = express.Router();

/**
 * POST /api/v1/ai/chat
 * Chat with the AI agent
 * 
 * Optional Authentication: If authenticated, the agent can access order history
 * Rate Limited: 10 requests/minute, 100 requests/day
 * 
 * Body:
 * - message: string (required) - The user's message
 * - conversationId: string (optional) - For multi-turn conversations
 * 
 * Response:
 * - success: boolean
 * - response: string - The AI's response
 * - conversationId: string - Use this for follow-up messages
 * - usage: { tokensUsed, remainingRequests }
 */
router.post('/chat', 
    // Optional auth - allows both guests and authenticated users
    (req, res, next) => {
        try {
            // Try to authenticate, but don't require it
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.replace('Bearer ', '');
                if (token && token !== 'null' && token !== 'undefined') {
                    try {
                        const decode = jwt.verify(token, process.env.JWT_SECRET);
                        req.user = decode;
                    } catch (err) {
                        // Token invalid/expired - proceed as guest silently
                        // This prevents "Token Is Invalid" error from blocking chat
                        console.log('[AI Chat] Token verification failed, proceeding as guest:', err.message);
                    }
                }
            }
        } catch (error) {
            console.error('[AI Chat] Auth middleware error:', error);
        }
        next();
    },
    rateLimiter,
    async (req, res) => {
        try {
            const { message, conversationId } = req.body;

            // Validate message
            if (!message || typeof message !== 'string' || message.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Message is required',
                    message: 'Please provide a message to chat with the AI'
                });
            }

            // Get user ID if authenticated
            const userId = req.user?.id || null;

            // Process the chat
            const result = await processChat(message, userId, conversationId);

            if (!result.success) {
                return res.status(400).json(result);
            }

            // Get remaining requests
            const remaining = getRemainingRequests(req);

            return res.status(200).json({
                success: true,
                response: result.response,
                conversationId: result.conversationId,
                usage: {
                    tokensUsed: result.tokenCount,
                    remainingRequests: remaining.perMinute
                },
                negotiation: result.negotiation || null
            });

        } catch (error) {
            console.error('Chat endpoint error:', error);
            return res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Failed to process chat request'
            });
        }
    }
);

/**
 * POST /api/v1/ai/negotiate
 * Direct negotiation from cart - bypasses LLM supervisor
 * Immediately applies a discount to the product
 * 
 * Body:
 * - productId: string (required) - The product's MongoDB _id
 * - userOffer: number (optional) - Specific price the user wants
 * 
 * Response:
 * - success: boolean
 * - negotiation: { status, negotiatedPrice, originalPrice, discount, token, productId, productName, expiresAt, message }
 */
router.post('/negotiate', auth, async (req, res) => {
    try {
        const { productId, userOffer } = req.body;
        const userId = req.user.id;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'productId is required'
            });
        }

        // Fetch product directly by ID (guaranteed match, no text search)
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        console.log(`[Negotiate] Direct negotiation for "${product.name}" (₹${product.price}) by user ${userId}`);

        // Start negotiation - immediately returns a deal
        const result = startNegotiation(
            userId,
            product._id.toString(),
            product.name,
            product.price,
            userOffer || null
        );

        console.log(`[Negotiate] Result: ${result.status} - ₹${result.negotiatedPrice} (${result.discount}% off)`);

        return res.status(200).json({
            success: true,
            negotiation: {
                status: result.status,
                negotiatedPrice: result.negotiatedPrice,
                originalPrice: result.originalPrice,
                discount: result.discount,
                token: result.token,
                productId: result.productId,
                productName: result.productName,
                expiresAt: result.expiresAt,
                message: result.message,
            }
        });

    } catch (error) {
        console.error('[Negotiate] Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to process negotiation'
        });
    }
});

/**
 * POST /api/v1/ai/negotiation/validate
 * Validate a negotiation token
 */
router.post('/negotiation/validate', auth, async (req, res) => {
    try {
        const { token, productId } = req.body;
        const userId = req.user.id;

        if (!token || !productId) {
            return res.status(400).json({
                success: false,
                message: 'Token and productId are required'
            });
        }

        const deal = validateToken(token, userId, productId);
        if (!deal) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired negotiation token'
            });
        }

        return res.status(200).json({
            success: true,
            deal: {
                productId: deal.productId,
                productName: deal.productName,
                originalPrice: deal.originalPrice,
                negotiatedPrice: deal.negotiatedPrice,
                discount: deal.discount,
                expiresAt: deal.expiresAt
            }
        });
    } catch (error) {
        console.error('Negotiation validation error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to validate negotiation token'
        });
    }
});

/**
 * GET /api/v1/ai/negotiation/deals
 * Get all active deals for the current user
 */
router.get('/negotiation/deals', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const deals = getUserDeals(userId);

        return res.status(200).json({
            success: true,
            deals: deals.map(d => ({
                productId: d.productId,
                productName: d.productName,
                originalPrice: d.originalPrice,
                negotiatedPrice: d.negotiatedPrice,
                discount: d.discount,
                token: d.token,
                expiresAt: d.expiresAt
            }))
        });
    } catch (error) {
        console.error('Get deals error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get deals'
        });
    }
});

const { analyzeProductImages } = require('../agent');

router.post('/generate', async (req, res) => {
  if (!req.files || !req.files.images) {
    return res.status(400).json({ error: 'No images uploaded' });
  }

  const images = Array.isArray(req.files.images)
    ? req.files.images
    : [req.files.images];

  const uploadsDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  const uploadedPaths = [];

  try {
    // Save uploaded files
    for (const img of images) {
      const uploadPath = path.join(uploadsDir, img.name);
      await img.mv(uploadPath);
      uploadedPaths.push(uploadPath);
    }

    // Use Gemini agent for analysis
    const result = await analyzeProductImages(uploadedPaths);

    // Clean up files
    for (const filePath of uploadedPaths) {
      fs.unlink(filePath, () => {});
    }

    if (!result.success) {
        return res.status(500).json({ error: result.error });
    }

    // Frontend expects { description, category, tags }
    res.json({
        description: result.description,
        category: result.category,
        tags: result.tags
    });

  } catch (err) {
    // Clean up on error
    for (const filePath of uploadedPaths) {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, () => {});
        }
    }
    return res.status(500).json({ error: 'Server error during analysis', details: err.message });
  }
});

module.exports = router;
