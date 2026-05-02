# IBM watsonx API Setup Guide

## Step-by-Step Instructions

### Step 1: Create IBM Cloud Account (5 minutes)

1. Visit: https://cloud.ibm.com/registration
2. Fill in your details:
   - Email address
   - Password
   - Country/Region
3. Verify your email address
4. Complete account setup

**Note:** IBM Cloud offers a free tier with generous limits for hackathon projects.

---

### Step 2: Access watsonx.ai (3 minutes)

1. Log into IBM Cloud: https://cloud.ibm.com/
2. Click on **Catalog** in the top navigation
3. Search for **"watsonx.ai"** or navigate to AI/Machine Learning section
4. Click on **watsonx.ai** service

---

### Step 3: Create watsonx.ai Instance (5 minutes)

1. On the watsonx.ai page, click **"Create"**
2. Select your plan:
   - **Lite Plan** (Free) - Perfect for hackathons
   - Includes: 20,000 tokens/month free
3. Choose region: **Dallas (us-south)** (recommended)
4. Give your instance a name: `dev-buddy-watsonx`
5. Click **"Create"**
6. Wait for provisioning (1-2 minutes)

---

### Step 4: Get API Credentials (5 minutes)

#### Option A: Using Service Credentials

1. Go to your watsonx.ai instance dashboard
2. Click **"Service credentials"** in the left menu
3. Click **"New credential"**
4. Name it: `dev-buddy-api-key`
5. Click **"Add"**
6. Click **"View credentials"** (eye icon)
7. Copy the following values:
   ```json
   {
     "apikey": "YOUR_API_KEY_HERE",
     "url": "https://us-south.ml.cloud.ibm.com"
   }
   ```

#### Option B: Using API Keys

1. Click on **"Manage"** → **"Access (IAM)"**
2. Click **"API keys"** in the left menu
3. Click **"Create an IBM Cloud API key"**
4. Name it: `dev-buddy-key`
5. Click **"Create"**
6. **IMPORTANT:** Copy and save the API key immediately (you can't view it again)

---

### Step 5: Get Project ID (3 minutes)

1. Go to watsonx.ai dashboard: https://dataplatform.cloud.ibm.com/wx/home
2. Click **"Projects"** in the left menu
3. Click **"New project"**
4. Select **"Create an empty project"**
5. Name it: `Dev Buddy`
6. Add description: `Hackathon project for code explanation`
7. Click **"Create"**
8. Once created, click on the project
9. Go to **"Manage"** tab
10. Copy the **Project ID** (looks like: `12345678-1234-1234-1234-123456789abc`)

---

### Step 6: Test Your Credentials (5 minutes)

Create a test file to verify your setup:

```javascript
// test-watsonx.js
const axios = require('axios');

const API_KEY = 'YOUR_API_KEY_HERE';
const PROJECT_ID = 'YOUR_PROJECT_ID_HERE';
const WATSONX_URL = 'https://us-south.ml.cloud.ibm.com';

async function testWatsonx() {
  try {
    // Get access token
    const tokenResponse = await axios.post(
      'https://iam.cloud.ibm.com/identity/token',
      `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${API_KEY}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;
    console.log('✓ Successfully obtained access token');

    // Test API call
    const response = await axios.post(
      `${WATSONX_URL}/ml/v1/text/generation?version=2023-05-29`,
      {
        input: 'Explain what JavaScript is in one sentence.',
        model_id: 'ibm/granite-13b-chat-v2',
        project_id: PROJECT_ID,
        parameters: {
          max_new_tokens: 100
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('✓ API call successful!');
    console.log('Response:', response.data.results[0].generated_text);
    console.log('\n✓ Your watsonx setup is complete and working!');
  } catch (error) {
    console.error('✗ Error:', error.response?.data || error.message);
  }
}

testWatsonx();
```

Run the test:
```bash
cd backend
npm install axios
node test-watsonx.js
```

---

### Step 7: Configure Environment Variables

Create `.env` file in your backend directory:

```env
# IBM watsonx Configuration
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL_ID=ibm/granite-13b-chat-v2

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

**IMPORTANT:** Add `.env` to your `.gitignore` file to keep credentials secure!

---

## Available Models

IBM watsonx offers several models. Recommended for Dev Buddy:

| Model | Best For | Max Tokens |
|-------|----------|------------|
| `ibm/granite-13b-chat-v2` | General code explanation | 8192 |
| `ibm/granite-20b-code-instruct` | Code generation & tests | 8192 |
| `meta-llama/llama-3-70b-instruct` | Complex analysis | 8192 |
| `mistralai/mixtral-8x7b-instruct-v01` | Fast responses | 32768 |

**Recommendation:** Start with `ibm/granite-13b-chat-v2` for balanced performance.

---

## Rate Limits & Quotas

**Free Tier (Lite Plan):**
- 20,000 tokens per month
- ~400-500 API calls (depending on prompt size)
- Perfect for hackathon demo

**Tips to Stay Within Limits:**
- Cache common responses
- Use efficient prompts
- Implement request throttling
- Monitor usage in IBM Cloud dashboard

---

## Troubleshooting

### Error: "Invalid API Key"
- Verify API key is correct (no extra spaces)
- Check if API key is active in IBM Cloud
- Ensure you're using the correct authentication method

### Error: "Project not found"
- Verify Project ID is correct
- Ensure project is in the same region as your service
- Check project permissions

### Error: "Rate limit exceeded"
- Wait for quota to reset (monthly)
- Upgrade to paid plan if needed
- Implement caching to reduce calls

### Error: "Model not available"
- Check model ID spelling
- Verify model is available in your region
- Try alternative model from the list above

---

## Quick Reference

**Authentication Endpoint:**
```
POST https://iam.cloud.ibm.com/identity/token
```

**Generation Endpoint:**
```
POST https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29
```

**Required Headers:**
```javascript
{
  'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

**Request Body Structure:**
```javascript
{
  input: "Your prompt here",
  model_id: "ibm/granite-13b-chat-v2",
  project_id: "YOUR_PROJECT_ID",
  parameters: {
    max_new_tokens: 500,
    temperature: 0.7,
    top_p: 1,
    top_k: 50
  }
}
```

---

## Next Steps

Once your API is set up and tested:

1. ✓ Credentials are working
2. → Proceed to backend implementation
3. → Integrate watsonx service
4. → Build API endpoints
5. → Connect frontend

**Ready to code? Switch to Code mode to start building!**

---

## Support Resources

- **IBM watsonx Documentation:** https://www.ibm.com/docs/en/watsonx-as-a-service
- **API Reference:** https://cloud.ibm.com/apidocs/watsonx-ai
- **Community Forum:** https://community.ibm.com/community/user/watsonx/home
- **Support:** https://cloud.ibm.com/unifiedsupport/supportcenter