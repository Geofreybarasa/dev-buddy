const express = require('express');
const router = express.Router();
const { generateExplanation } = require('../services/ai.service');
const { detectLanguage } = require('../utils/prompts');
const { trackOperation } = require('../services/analytics.service');

/**
 * POST /api/explain
 * Explain code in plain English
 */
router.post('/', async (req, res, next) => {
  try {
    const { code, language, userId } = req.body;

    // Validation
    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Code is required and must be a non-empty string'
        }
      });
    }

    if (code.length > 10000) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Code exceeds maximum length of 10,000 characters'
        }
      });
    }

    // Detect language if not provided
    const detectedLanguage = language || detectLanguage(code);

    // Generate explanation with automatic fallback
    const { explanation, mode, error } = await generateExplanation(code, detectedLanguage);

    // Track analytics
    const analyticsRecord = trackOperation(
      'explain',
      code.length,
      detectedLanguage,
      !explanation.error
    );

    // Return response
    res.json({
      success: true,
      data: {
        explanation,
        language: detectedLanguage,
        timeSaved: analyticsRecord.timeSaved,
        timestamp: analyticsRecord.timestamp,
        aiMode: mode, // Indicate which AI mode was used
        aiModeMessage: mode === 'watsonx'
          ? '✅ Powered by IBM WatsonX AI'
          : '📝 Using demo mode (WatsonX unavailable)',
        fallbackReason: error || null
      }
    });

  } catch (error) {
    console.error('Error in explain route:', error);
    next(error);
  }
});

module.exports = router;

// Made with Bob
