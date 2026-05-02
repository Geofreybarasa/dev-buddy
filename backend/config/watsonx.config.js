require('dotenv').config();

const watsonxConfig = {
  apiKey: process.env.WATSONX_API_KEY,
  projectId: process.env.WATSONX_PROJECT_ID,
  url: process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com',
  modelId: process.env.WATSONX_MODEL_ID || 'ibm/granite-13b-chat-v2',
  iamUrl: 'https://iam.cloud.ibm.com/identity/token',
  version: '2023-05-29'
};

// Validate configuration
function validateConfig() {
  const required = ['apiKey', 'projectId'];
  const missing = required.filter(key => !watsonxConfig[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required watsonx configuration: ${missing.join(', ')}. ` +
      'Please check your .env file.'
    );
  }
  
  return true;
}

// Default parameters for text generation
const defaultParameters = {
  max_new_tokens: 1000,
  temperature: 0.7,
  top_p: 1,
  top_k: 50,
  repetition_penalty: 1.0
};

module.exports = {
  watsonxConfig,
  validateConfig,
  defaultParameters
};

// Made with Bob
