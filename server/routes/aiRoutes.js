const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Import agent modules
const { processChat, rateLimiter, getRemainingRequests } = require('../agent');
const { auth } = require('../middlewares/auth');

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
        // Try to authenticate, but don't require it
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return auth(req, res, next);
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
                }
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
