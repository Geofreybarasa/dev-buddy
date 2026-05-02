const express = require('express');
const router = express.Router();
const { generateTests } = require('../services/ai.service');
const { detectLanguage } = require('../utils/prompts');
const { trackOperation } = require('../services/analytics.service');

/**
 * POST /api/generate-tests
 * Generate unit tests for code
 */
router.post('/', async (req, res, next) => {
  try {
    const { code, language, framework, userId } = req.body;

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

    // Generate tests with automatic fallback
    const { testData, mode, error } = await generateTests(code, detectedLanguage, framework);

    // Track analytics
    const analyticsRecord = trackOperation(
      'tests',
      code.length,
      detectedLanguage,
      !testData.error
    );

    // Return response
    res.json({
      success: true,
      data: {
        tests: testData.tests || testData.rawResponse,
        testCases: testData.testCases || [],
        coverage: testData.coverage || 'N/A',
        setupRequired: testData.setupRequired || 'None',
        framework: framework || 'auto',
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
    console.error('Error in test generation route:', error);
    next(error);
  }
});

module.exports = router;

// Made with Bob
