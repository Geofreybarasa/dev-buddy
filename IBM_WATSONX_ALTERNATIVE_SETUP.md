# IBM watsonx - Alternative Setup Guide

If you're having trouble accessing watsonx.ai, here are alternative approaches.

---

## Problem: Can't Find watsonx.ai in IBM Cloud Catalog

This is common! IBM's interface can be confusing. Here are **3 alternative approaches**:

---

## ✅ Option 1: Use IBM Cloud API Key (Recommended for Hackathon)

This is the **fastest** way to get started without needing watsonx.ai specifically.

### Step 1: Get IBM Cloud API Key

1. Go to: https://cloud.ibm.com/iam/apikeys
2. Click **"Create"** button
3. Name it: `dev-buddy-key`
4. Click **"Create"**
5. **IMPORTANT**: Copy the API key immediately (you can't see it again!)
6. Save it somewhere safe

### Step 2: Create a Project in IBM Cloud

1. Go to: https://dataplatform.cloud.ibm.com/projects
2. Click **"New project"**
3. Select **"Create an empty project"**
4. Name: `Dev Buddy`
5. Click **"Create"**
6. Once created, go to **"Manage"** tab
7. Copy the **Project ID** (looks like: `12345678-1234-1234-1234-123456789abc`)

### Step 3: Configure Your Backend

Create `backend/.env`:

```env
WATSONX_API_KEY=your_ibm_cloud_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL_ID=ibm/granite-13b-chat-v2
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Step 4: Test It

```bash
cd backend
npm install
npm start
```

If you see:
```
🚀 Dev Buddy Backend running on port 3001
🤖 watsonx configured: Yes
```

**You're done!** ✅

---

## ✅ Option 2: Use OpenAI as Fallback (Quick Demo)

If IBM watsonx is not working, you can use OpenAI temporarily for the demo.

### Step 1: Get OpenAI API Key

1. Go to: https://platform.openai.com/api-keys
2. Create account if needed
3. Click **"Create new secret key"**
4. Copy the key

### Step 2: Modify Backend Service

Update `backend/services/watsonx.service.js`:

```javascript
// Add at the top
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const USE_OPENAI = process.env.USE_OPENAI === 'true';

async function generateText(prompt, parameters = {}) {
  if (USE_OPENAI) {
    return await generateTextOpenAI(prompt);
  }
  // ... existing watsonx code
}

async function generateTextOpenAI(prompt) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error('OpenAI API error');
  }
}
```

### Step 3: Update .env

```env
USE_OPENAI=true
OPENAI_API_KEY=your_openai_key_here
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**Note**: For the hackathon, you should still mention "Powered by IBM watsonx" in your presentation, and explain this is a fallback for demo purposes.

---

## ✅ Option 3: Use Mock Responses (Demo Only)

If you can't get any AI API working, use mock responses for the demo.

### Create Mock Service

Create `backend/services/mock.service.js`:

```javascript
function generateMockExplanation(code, language) {
  return {
    overview: `This ${language} code defines a function that performs a specific operation. It uses modern syntax and follows best practices.`,
    lineByLine: [
      {
        line: 1,
        code: code.split('\n')[0],
        explanation: 'This line declares the function with its parameters'
      }
    ],
    keyConcepts: ['Functions', 'Parameters', 'Return values'],
    complexity: 'O(1) - Constant time complexity',
    potentialIssues: ['Consider adding input validation'],
    improvements: ['Add TypeScript types', 'Add error handling']
  };
}

function generateMockTests(code, language) {
  return {
    tests: `describe('function test', () => {
  test('should work correctly', () => {
    expect(result).toBeDefined();
  });
  
  test('should handle edge cases', () => {
    expect(result).not.toBeNull();
  });
});`,
    testCases: [
      { name: 'basic functionality', type: 'happy_path' },
      { name: 'edge cases', type: 'edge_case' }
    ],
    coverage: '85%'
  };
}

function generateMockDocs(code, language) {
  return {
    documentation: `/**
 * Function description
 * @param {type} param1 - Description
 * @returns {type} Description
 */`,
    examples: ['example1', 'example2'],
    notes: ['Note about usage']
  };
}

module.exports = {
  generateMockExplanation,
  generateMockTests,
  generateMockDocs
};
```

### Update Routes to Use Mock

In each route file, add:

```javascript
const USE_MOCK = process.env.USE_MOCK === 'true';
const mockService = require('../services/mock.service');

// In the route handler:
if (USE_MOCK) {
  const explanation = mockService.generateMockExplanation(code, language);
  // ... rest of response
}
```

### Update .env

```env
USE_MOCK=true
PORT=3001
FRONTEND_URL=http://localhost:3000
```

---

## 🔍 Troubleshooting IBM Cloud Access

### Issue 1: "watsonx.ai not found in catalog"

**Solution**: 
- Try searching for "Watson Machine Learning" instead
- Or go directly to: https://cloud.ibm.com/catalog/services/watson-machine-learning
- Or use Option 1 above (IBM Cloud API Key)

### Issue 2: "Access denied" or "Not authorized"

**Solution**:
- Verify your IBM Cloud account is activated
- Check if you need to verify your email
- Try logging out and back in
- Use Option 1 (API Key method)

### Issue 3: "Free tier not available"

**Solution**:
- Some regions may not have free tier
- Try changing region to "Dallas (us-south)"
- Use Option 2 (OpenAI) temporarily

### Issue 4: "Service not available in your region"

**Solution**:
- watsonx.ai may not be available in all regions yet
- Use IBM Cloud API Key (Option 1)
- Or use OpenAI fallback (Option 2)

---

## 📞 Getting Help

### IBM Support
- IBM Cloud Support: https://cloud.ibm.com/unifiedsupport/supportcenter
- IBM Community: https://community.ibm.com/community/user/watsonx/home
- Documentation: https://cloud.ibm.com/docs/watson-machine-learning

### Alternative Resources
- Stack Overflow: Tag `ibm-cloud` or `ibm-watson`
- IBM Developer: https://developer.ibm.com/

---

## 🎯 Recommended Approach for Hackathon

**For the hackathon demo, I recommend:**

1. **Try Option 1 first** (IBM Cloud API Key) - 15 minutes
2. **If that fails, use Option 2** (OpenAI) - 5 minutes
3. **If all else fails, use Option 3** (Mock) - 2 minutes

**Important**: Even if you use OpenAI or Mock for the demo, you can still say:
> "Dev Buddy is designed to work with IBM watsonx AI. For this demo, we're using [alternative] to showcase the functionality, but the production version will use IBM's Granite models."

---

## ✅ Quick Test

Once you have ANY of the options configured, test with:

```bash
cd backend
npm start
```

Then in another terminal:

```bash
curl http://localhost:3001/api/health
```

If you see `"status": "healthy"`, you're ready to go! 🎉

---

## 🚀 Next Steps

Once you have the backend working (with any option):

1. Start the frontend: `cd frontend && npm start`
2. Test the application: Open http://localhost:3000
3. Practice your demo with [`DEMO_SAMPLES.md`](DEMO_SAMPLES.md)
4. You're ready for the hackathon! 🎉

---

**Need more help? Let me know which specific error you're seeing!**