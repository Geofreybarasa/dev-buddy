const express = require('express');
const router = express.Router();
const { generateDocumentation } = require('../services/ai.service');
const { detectLanguage } = require('../utils/prompts');
const { trackOperation } = require('../services/analytics.service');

/**
 * POST /api/generate-docs
 * Generate documentation for code
 */
router.post('/', async (req, res, next) => {
  try {
    const { code, language, format, userId } = req.body;

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

    // Generate documentation with automatic fallback
    const { docsData, mode, error } = await generateDocumentation(code, detectedLanguage, format);

    // Track analytics
    const analyticsRecord = trackOperation(
      'docs',
      code.length,
      detectedLanguage,
      !docsData.error
    );

    // Return response
    res.json({
      success: true,
      data: {
        documentation: docsData.documentation || docsData.rawResponse,
        examples: docsData.examples || [],
        notes: docsData.notes || [],
        relatedFunctions: docsData.relatedFunctions || [],
        format: format || 'auto',
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
    console.error('Error in documentation generation route:', error);
    next(error);
  }
});

module.exports = router;

// Made with Bob
