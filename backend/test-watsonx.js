/**
 * IBM watsonx Connection Test
 * Run this to diagnose connection issues
 */

require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.WATSONX_API_KEY;
const PROJECT_ID = process.env.WATSONX_PROJECT_ID;
const WATSONX_URL = process.env.WATSONX_URL || 'https://us-south.ml.cloud.ibm.com';
const MODEL_ID = process.env.WATSONX_MODEL_ID || 'ibm/granite-13b-chat-v2';

console.log('🔍 Testing IBM watsonx Connection...\n');

// Step 1: Check environment variables
console.log('Step 1: Checking environment variables...');
console.log('✓ API_KEY:', API_KEY ? `${API_KEY.substring(0, 10)}...` : '❌ MISSING');
console.log('✓ PROJECT_ID:', PROJECT_ID ? `${PROJECT_ID.substring(0, 10)}...` : '❌ MISSING');
console.log('✓ WATSONX_URL:', WATSONX_URL);
console.log('✓ MODEL_ID:', MODEL_ID);
console.log('');

if (!API_KEY || !PROJECT_ID) {
  console.error('❌ ERROR: Missing required credentials in .env file');
  console.log('\nPlease create backend/.env with:');
  console.log('WATSONX_API_KEY=your_api_key');
  console.log('WATSONX_PROJECT_ID=your_project_id');
  process.exit(1);
}

// Step 2: Test authentication
async function testAuthentication() {
  console.log('Step 2: Testing IBM Cloud authentication...');
  try {
    const response = await axios.post(
      'https://iam.cloud.ibm.com/identity/token',
      `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${API_KEY}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      }
    );

    console.log('✅ Authentication successful!');
    console.log('✓ Access token obtained');
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Authentication failed!');
    console.error('Error:', error.response?.data?.errorMessage || error.message);
    
    if (error.response?.status === 400) {
      console.log('\n💡 Possible issues:');
      console.log('   - API key is invalid or expired');
      console.log('   - API key format is incorrect');
      console.log('   - Check your IBM Cloud account status');
    }
    
    process.exit(1);
  }
}

// Step 3: Test watsonx API
async function testWatsonx(token) {
  console.log('\nStep 3: Testing watsonx.ai API...');
  try {
    const response = await axios.post(
      `${WATSONX_URL}/ml/v1/text/generation?version=2023-05-29`,
      {
        input: 'Say hello in one word.',
        model_id: MODEL_ID,
        project_id: PROJECT_ID,
        parameters: {
          max_new_tokens: 10,
          temperature: 0.7
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log('✅ watsonx API call successful!');
    console.log('✓ Response:', response.data.results[0].generated_text);
    console.log('\n🎉 All tests passed! Your IBM watsonx is configured correctly!');
    console.log('\n✅ You can now use Dev Buddy with real IBM watsonx AI!');
    
  } catch (error) {
    console.error('❌ watsonx API call failed!');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('\n💡 Possible issues:');
      console.log('   - Project ID is incorrect');
      console.log('   - Project doesn\'t exist or was deleted');
      console.log('   - Wrong region/URL');
    } else if (error.response?.status === 403) {
      console.log('\n💡 Possible issues:');
      console.log('   - No access to watsonx.ai service');
      console.log('   - Project permissions issue');
      console.log('   - Service not enabled in your account');
    } else if (error.response?.status === 400) {
      console.log('\n💡 Possible issues:');
      console.log('   - Model ID is incorrect');
      console.log('   - Invalid request format');
      console.log('   - Project ID format is wrong');
    }
    
    console.log('\n📖 Solutions:');
    console.log('   1. Verify your Project ID at: https://dataplatform.cloud.ibm.com/projects');
    console.log('   2. Check if watsonx.ai is enabled in your IBM Cloud account');
    console.log('   3. Try using USE_MOCK=true in .env for demo purposes');
    
    process.exit(1);
  }
}

// Run tests
(async () => {
  try {
    const token = await testAuthentication();
    await testWatsonx(token);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
})();

// Made with Bob
