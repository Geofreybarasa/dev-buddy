const axios = require('axios');
const { watsonxConfig, validateConfig, defaultParameters } = require('../config/watsonx.config');

// Cache for access token
let accessToken = null;
let tokenExpiry = null;

/**
 * Get IBM Cloud IAM access token
 */
async function getAccessToken() {
  // Return cached token if still valid
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  try {
    validateConfig();

    const response = await axios.post(
      watsonxConfig.iamUrl,
      `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${watsonxConfig.apiKey}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      }
    );

    accessToken = response.data.access_token;
    // Token expires in 1 hour, refresh 5 minutes before
    tokenExpiry = Date.now() + (55 * 60 * 1000);

    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error.response?.data || error.message);
    throw new Error('Failed to authenticate with IBM watsonx');
  }
}

/**
 * Generate text using IBM watsonx
 */
async function generateText(prompt, parameters = {}) {
  try {
    const token = await getAccessToken();
    
    const requestBody = {
      input: prompt,
      model_id: watsonxConfig.modelId,
      project_id: watsonxConfig.projectId,
      parameters: {
        ...defaultParameters,
        ...parameters
      }
    };

    const response = await axios.post(
      `${watsonxConfig.url}/ml/v1/text/generation?version=${watsonxConfig.version}`,
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0].generated_text;
    }

    throw new Error('No response generated from watsonx');
  } catch (error) {
    console.error('Error generating text:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Token expired, clear cache and retry once
      accessToken = null;
      tokenExpiry = null;
      throw new Error('Authentication failed. Please check your API credentials.');
    }
    
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    throw new Error('Failed to generate response from IBM watsonx');
  }
}

/**
 * Parse JSON response from AI (handles markdown code blocks and extra text)
 */
function parseAIResponse(text) {
  try {
    let cleaned = text.trim();
    
    // Try to extract JSON from markdown code blocks
    const jsonBlockMatch = cleaned.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonBlockMatch) {
      cleaned = jsonBlockMatch[1].trim();
    } else {
      // Try to find JSON object in the text
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleaned = jsonMatch[0];
      }
    }
    
    // Remove any remaining markdown code blocks
    cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?$/g, '').replace(/```/g, '');
    
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Error parsing AI response:', error.message);
    
    // Try one more time to extract JSON
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // Final fallback
    }
    
    console.error('Raw response:', text);
    
    // Return a fallback structure
    return {
      error: 'Failed to parse AI response',
      rawResponse: text
    };
  }
}

module.exports = {
  generateText,
  parseAIResponse,
  getAccessToken
};

// Made with Bob
