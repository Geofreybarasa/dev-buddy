/**
 * AI Service - Handles WatsonX AI with automatic fallback to mock mode
 * Indicates to user which mode is being used
 */

const watsonxService = require('./watsonx.service');
const mockService = require('./mock.service');

// Track current mode
let currentMode = 'watsonx'; // 'watsonx' or 'mock'
let watsonxAvailable = true;
let lastWatsonxCheck = null;

/**
 * Check if WatsonX is available (with caching to avoid repeated checks)
 */
async function checkWatsonxAvailability() {
  // Cache check for 5 minutes
  if (lastWatsonxCheck && Date.now() - lastWatsonxCheck < 5 * 60 * 1000) {
    return watsonxAvailable;
  }

  try {
    // Try to get access token
    await watsonxService.getAccessToken();
    watsonxAvailable = true;
    currentMode = 'watsonx';
    lastWatsonxCheck = Date.now();
    console.log('✅ WatsonX AI is available');
    return true;
  } catch (error) {
    watsonxAvailable = false;
    currentMode = 'mock';
    lastWatsonxCheck = Date.now();
    console.log('⚠️  WatsonX AI unavailable, using mock mode:', error.message);
    return false;
  }
}

/**
 * Generate explanation with automatic fallback
 */
async function generateExplanation(code, language) {
  let mode = 'mock';
  let explanation;
  let error = null;

  // Try WatsonX first if not explicitly disabled
  if (process.env.USE_MOCK !== 'true') {
    try {
      const isAvailable = await checkWatsonxAvailability();
      
      if (isAvailable) {
        const { getExplainPrompt } = require('../utils/prompts');
        const prompt = getExplainPrompt(code, language);
        
        const aiResponse = await watsonxService.generateText(prompt, {
          max_new_tokens: 1500,
          temperature: 0.7
        });
        
        explanation = watsonxService.parseAIResponse(aiResponse);
        mode = 'watsonx';
        console.log('✅ Used WatsonX AI for explanation');
      } else {
        throw new Error('WatsonX not available');
      }
    } catch (err) {
      console.log('⚠️  WatsonX failed, falling back to mock:', err.message);
      error = err.message;
      // Fall through to mock mode
    }
  }

  // Use mock mode if WatsonX failed or is disabled
  if (!explanation) {
    explanation = mockService.generateMockExplanation(code, language);
    mode = 'mock';
    console.log('📝 Used mock mode for explanation');
  }

  return {
    explanation,
    mode,
    error
  };
}

/**
 * Generate tests with automatic fallback
 */
async function generateTests(code, language, framework) {
  let mode = 'mock';
  let testData;
  let error = null;

  // Try WatsonX first if not explicitly disabled
  if (process.env.USE_MOCK !== 'true') {
    try {
      const isAvailable = await checkWatsonxAvailability();
      
      if (isAvailable) {
        const { getTestPrompt } = require('../utils/prompts');
        const prompt = getTestPrompt(code, language, framework);
        
        const aiResponse = await watsonxService.generateText(prompt, {
          max_new_tokens: 2000,
          temperature: 0.7
        });
        
        testData = watsonxService.parseAIResponse(aiResponse);
        mode = 'watsonx';
        console.log('✅ Used WatsonX AI for test generation');
      } else {
        throw new Error('WatsonX not available');
      }
    } catch (err) {
      console.log('⚠️  WatsonX failed, falling back to mock:', err.message);
      error = err.message;
      // Fall through to mock mode
    }
  }

  // Use mock mode if WatsonX failed or is disabled
  if (!testData) {
    testData = mockService.generateMockTests(code, language);
    mode = 'mock';
    console.log('📝 Used mock mode for test generation');
  }

  return {
    testData,
    mode,
    error
  };
}

/**
 * Generate documentation with automatic fallback
 */
async function generateDocumentation(code, language, format) {
  let mode = 'mock';
  let docsData;
  let error = null;

  // Try WatsonX first if not explicitly disabled
  if (process.env.USE_MOCK !== 'true') {
    try {
      const isAvailable = await checkWatsonxAvailability();
      
      if (isAvailable) {
        const { getDocsPrompt } = require('../utils/prompts');
        const prompt = getDocsPrompt(code, language, format);
        
        const aiResponse = await watsonxService.generateText(prompt, {
          max_new_tokens: 1500,
          temperature: 0.7
        });
        
        docsData = watsonxService.parseAIResponse(aiResponse);
        mode = 'watsonx';
        console.log('✅ Used WatsonX AI for documentation generation');
      } else {
        throw new Error('WatsonX not available');
      }
    } catch (err) {
      console.log('⚠️  WatsonX failed, falling back to mock:', err.message);
      error = err.message;
      // Fall through to mock mode
    }
  }

  // Use mock mode if WatsonX failed or is disabled
  if (!docsData) {
    docsData = mockService.generateMockDocs(code, language);
    mode = 'mock';
    console.log('📝 Used mock mode for documentation generation');
  }

  return {
    docsData,
    mode,
    error
  };
}

/**
 * Get current AI mode status
 */
function getAIStatus() {
  return {
    currentMode,
    watsonxAvailable,
    useMockForced: process.env.USE_MOCK === 'true',
    lastCheck: lastWatsonxCheck ? new Date(lastWatsonxCheck).toISOString() : null
  };
}

module.exports = {
  generateExplanation,
  generateTests,
  generateDocumentation,
  getAIStatus,
  checkWatsonxAvailability
};

// Made with Bob