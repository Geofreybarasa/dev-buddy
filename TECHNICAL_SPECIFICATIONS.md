# Dev Buddy - Technical Specifications

## Table of Contents
1. [API Specifications](#api-specifications)
2. [Database Schema](#database-schema)
3. [AI Prompt Templates](#ai-prompt-templates)
4. [Frontend Components](#frontend-components)
5. [Error Handling](#error-handling)
6. [Performance Optimization](#performance-optimization)

---

## API Specifications

### Base URL
```
Development: http://localhost:3001/api
Production: https://dev-buddy-api.herokuapp.com/api
```

### Authentication
All requests to IBM watsonx require Bearer token authentication obtained via IBM IAM.

### Endpoints

#### 1. POST /api/explain
Explains code in plain English with detailed breakdown.

**Request:**
```json
{
  "code": "function add(a, b) { return a + b; }",
  "language": "javascript",
  "userId": "optional-user-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "explanation": {
      "overview": "This is a simple addition function...",
      "lineByLine": [
        {
          "line": 1,
          "code": "function add(a, b) {",
          "explanation": "Declares a function named 'add' that takes two parameters"
        }
      ],
      "keyConcepts": ["Functions", "Parameters", "Return values"],
      "complexity": "O(1) - Constant time",
      "suggestions": ["Add input validation", "Consider TypeScript"]
    },
    "timeSaved": 35,
    "timestamp": "2026-05-01T18:45:00Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CODE",
    "message": "Code snippet is empty or invalid",
    "details": "Please provide valid code to analyze"
  }
}
```

---

#### 2. POST /api/generate-tests
Generates unit tests for the provided code.

**Request:**
```json
{
  "code": "function add(a, b) { return a + b; }",
  "language": "javascript",
  "framework": "jest",
  "userId": "optional-user-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tests": "describe('add function', () => {\n  test('adds two numbers', () => {\n    expect(add(2, 3)).toBe(5);\n  });\n});",
    "testCases": [
      {
        "name": "adds two positive numbers",
        "type": "happy_path"
      },
      {
        "name": "handles negative numbers",
        "type": "edge_case"
      }
    ],
    "coverage": "85%",
    "framework": "jest",
    "timeSaved": 50,
    "timestamp": "2026-05-01T18:45:00Z"
  }
}
```

---

#### 3. POST /api/generate-docs
Generates documentation for the provided code.

**Request:**
```json
{
  "code": "function add(a, b) { return a + b; }",
  "language": "javascript",
  "format": "jsdoc",
  "userId": "optional-user-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "documentation": "/**\n * Adds two numbers together\n * @param {number} a - First number\n * @param {number} b - Second number\n * @returns {number} Sum of a and b\n */",
    "format": "jsdoc",
    "examples": [
      "add(2, 3) // returns 5",
      "add(-1, 1) // returns 0"
    ],
    "timeSaved": 25,
    "timestamp": "2026-05-01T18:45:00Z"
  }
}
```

---

#### 4. GET /api/analytics
Retrieves time-saved analytics.

**Query Parameters:**
- `userId` (optional): Filter by user
- `period` (optional): "today" | "week" | "month" | "all"

**Response:**
```json
{
  "success": true,
  "data": {
    "totalTimeSaved": 450,
    "operationsCount": 12,
    "breakdown": {
      "explain": { "count": 5, "timeSaved": 175 },
      "tests": { "count": 4, "timeSaved": 200 },
      "docs": { "count": 3, "timeSaved": 75 }
    },
    "averagePerOperation": 37.5,
    "teamImpact": {
      "teamSize": 10,
      "dailySavings": 900,
      "monthlySavings": 18000,
      "annualValue": "$450,000"
    }
  }
}
```

---

#### 5. POST /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-05-01T18:45:00Z",
  "services": {
    "watsonx": "connected",
    "database": "connected"
  }
}
```

---

## Database Schema

### Analytics Collection (In-Memory for MVP)

```javascript
{
  id: "uuid",
  userId: "user-123",
  operation: "explain" | "tests" | "docs",
  codeLength: 150,
  language: "javascript",
  timeSaved: 35,
  timestamp: "2026-05-01T18:45:00Z",
  success: true
}
```

**For Production:** Use MongoDB or PostgreSQL for persistence.

---

## AI Prompt Templates

### 1. Code Explanation Prompt

```javascript
const EXPLAIN_PROMPT = `You are an expert code reviewer and teacher. Analyze the following code and provide a comprehensive explanation.

CODE:
\`\`\`${language}
${code}
\`\`\`

Provide your response in the following JSON format:
{
  "overview": "A 2-3 sentence high-level explanation of what this code does",
  "lineByLine": [
    {
      "line": 1,
      "code": "actual code line",
      "explanation": "what this line does"
    }
  ],
  "keyConcepts": ["concept1", "concept2"],
  "complexity": "Time and space complexity analysis",
  "potentialIssues": ["issue1", "issue2"],
  "improvements": ["suggestion1", "suggestion2"]
}

Be clear, concise, and educational. Assume the reader is a junior developer.`;
```

### 2. Test Generation Prompt

```javascript
const TEST_PROMPT = `You are an expert test engineer. Generate comprehensive unit tests for the following code.

CODE:
\`\`\`${language}
${code}
\`\`\`

REQUIREMENTS:
- Use ${framework} testing framework
- Include happy path tests
- Include edge cases
- Include error handling tests
- Add descriptive test names
- Aim for 80%+ code coverage

Provide your response in the following JSON format:
{
  "tests": "complete test code as a string",
  "testCases": [
    {
      "name": "test name",
      "type": "happy_path" | "edge_case" | "error_handling",
      "description": "what this test validates"
    }
  ],
  "coverage": "estimated coverage percentage",
  "setupRequired": "any setup/teardown code needed"
}`;
```

### 3. Documentation Generation Prompt

```javascript
const DOCS_PROMPT = `You are a technical documentation expert. Generate professional documentation for the following code.

CODE:
\`\`\`${language}
${code}
\`\`\`

REQUIREMENTS:
- Use ${format} format (JSDoc, Docstring, etc.)
- Document all parameters with types
- Document return values
- Include usage examples
- Add notes about complexity or dependencies
- Be clear and professional

Provide your response in the following JSON format:
{
  "documentation": "formatted documentation string",
  "examples": ["example1", "example2"],
  "notes": ["important note1", "important note2"],
  "relatedFunctions": ["function1", "function2"]
}`;
```

---

## Frontend Components

### Component Hierarchy

```
App
├── Header
│   ├── Logo
│   └── Navigation
├── MainContent
│   ├── CodeEditor (Monaco)
│   │   ├── LanguageSelector
│   │   └── EditorToolbar
│   ├── ActionButtons
│   │   ├── ExplainButton
│   │   ├── GenerateTestsButton
│   │   └── GenerateDocsButton
│   └── ResultsPanel
│       ├── TabNavigation
│       ├── ExplanationView
│       ├── TestsView
│       ├── DocsView
│       └── CopyButton
├── Analytics
│   ├── TimeSavedCounter
│   ├── OperationsChart
│   └── TeamImpactCalculator
└── Footer
```

### State Management

```javascript
// App State Structure
{
  code: {
    content: "",
    language: "javascript",
    isValid: true
  },
  results: {
    explanation: null,
    tests: null,
    docs: null,
    loading: false,
    error: null
  },
  analytics: {
    totalTimeSaved: 0,
    operations: [],
    currentSession: {
      timeSaved: 0,
      operationsCount: 0
    }
  },
  ui: {
    activeTab: "explanation",
    theme: "dark",
    sidebarOpen: true
  }
}
```

---

## Error Handling

### Error Types

```javascript
const ERROR_TYPES = {
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    status: 400,
    message: 'Invalid input provided'
  },
  WATSONX_ERROR: {
    code: 'WATSONX_ERROR',
    status: 502,
    message: 'AI service temporarily unavailable'
  },
  RATE_LIMIT_ERROR: {
    code: 'RATE_LIMIT_ERROR',
    status: 429,
    message: 'Rate limit exceeded. Please try again later.'
  },
  AUTHENTICATION_ERROR: {
    code: 'AUTH_ERROR',
    status: 401,
    message: 'Authentication failed'
  },
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    status: 500,
    message: 'Internal server error'
  }
};
```

### Error Response Format

```javascript
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "User-friendly message",
    details: "Technical details for debugging",
    timestamp: "2026-05-01T18:45:00Z",
    requestId: "uuid"
  }
}
```

### Frontend Error Handling

```javascript
// Error Display Component
function ErrorMessage({ error }) {
  const errorMessages = {
    VALIDATION_ERROR: "Please check your code and try again",
    WATSONX_ERROR: "AI service is temporarily unavailable",
    RATE_LIMIT_ERROR: "You've reached the rate limit. Please wait.",
    NETWORK_ERROR: "Network connection failed. Check your internet."
  };

  return (
    <div className="error-banner">
      <Icon name="alert" />
      <span>{errorMessages[error.code] || error.message}</span>
      <button onClick={retry}>Retry</button>
    </div>
  );
}
```

---

## Performance Optimization

### Backend Optimizations

1. **Response Caching**
```javascript
// Cache identical requests for 1 hour
const cache = new Map();

function getCacheKey(code, operation) {
  return `${operation}:${hashCode(code)}`;
}

async function getCachedOrFetch(key, fetchFn) {
  if (cache.has(key)) {
    return cache.get(key);
  }
  const result = await fetchFn();
  cache.set(key, result);
  setTimeout(() => cache.delete(key), 3600000); // 1 hour
  return result;
}
```

2. **Request Throttling**
```javascript
// Limit to 10 requests per minute per user
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 10,
  message: 'Too many requests, please try again later'
});

app.use('/api/', limiter);
```

3. **Async Processing**
```javascript
// Process long-running requests asynchronously
app.post('/api/explain', async (req, res) => {
  const jobId = generateJobId();
  
  // Return immediately with job ID
  res.json({ jobId, status: 'processing' });
  
  // Process in background
  processExplanation(jobId, req.body);
});

app.get('/api/status/:jobId', (req, res) => {
  const result = getJobResult(req.params.jobId);
  res.json(result);
});
```

### Frontend Optimizations

1. **Code Splitting**
```javascript
// Lazy load Monaco Editor
const MonacoEditor = lazy(() => import('./components/MonacoEditor'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MonacoEditor />
    </Suspense>
  );
}
```

2. **Debounced Input**
```javascript
// Debounce code validation
const debouncedValidate = useMemo(
  () => debounce((code) => validateCode(code), 500),
  []
);

useEffect(() => {
  debouncedValidate(code);
}, [code]);
```

3. **Optimistic Updates**
```javascript
// Show loading state immediately
function handleExplain() {
  setLoading(true);
  setResults({ ...results, explanation: 'Loading...' });
  
  explainCode(code)
    .then(result => setResults({ ...results, explanation: result }))
    .finally(() => setLoading(false));
}
```

---

## Security Considerations

### API Security

1. **Environment Variables**
   - Never commit `.env` files
   - Use different keys for dev/prod
   - Rotate keys regularly

2. **Input Validation**
```javascript
function validateCodeInput(code) {
  if (!code || typeof code !== 'string') {
    throw new ValidationError('Code must be a non-empty string');
  }
  if (code.length > 10000) {
    throw new ValidationError('Code exceeds maximum length');
  }
  // Sanitize potentially dangerous patterns
  const sanitized = code.replace(/<script>/gi, '');
  return sanitized;
}
```

3. **Rate Limiting**
   - Implement per-user rate limits
   - Add CAPTCHA for suspicious activity
   - Monitor for abuse patterns

4. **CORS Configuration**
```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST'],
  credentials: true,
  maxAge: 3600
};

app.use(cors(corsOptions));
```

---

## Testing Strategy

### Backend Tests

```javascript
// Example test suite
describe('Code Explanation API', () => {
  test('should explain valid JavaScript code', async () => {
    const response = await request(app)
      .post('/api/explain')
      .send({
        code: 'function add(a, b) { return a + b; }',
        language: 'javascript'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.explanation).toBeDefined();
  });

  test('should reject empty code', async () => {
    const response = await request(app)
      .post('/api/explain')
      .send({ code: '', language: 'javascript' });
    
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});
```

### Frontend Tests

```javascript
// Component test example
describe('CodeEditor', () => {
  test('renders with default code', () => {
    render(<CodeEditor />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('calls onExplain when button clicked', () => {
    const onExplain = jest.fn();
    render(<CodeEditor onExplain={onExplain} />);
    
    fireEvent.click(screen.getByText('Explain Code'));
    expect(onExplain).toHaveBeenCalled();
  });
});
```

---

## Deployment Configuration

### Backend (Heroku)

```yaml
# Procfile
web: node backend/server.js
```

```json
// package.json scripts
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  }
}
```

### Frontend (Vercel)

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://dev-buddy-api.herokuapp.com/api/$1"
    }
  ]
}
```

---

## Monitoring & Analytics

### Key Metrics to Track

1. **Performance Metrics**
   - API response time (target: <3s)
   - Error rate (target: <1%)
   - Uptime (target: 99.9%)

2. **Usage Metrics**
   - Total operations performed
   - Most popular feature
   - Average code length
   - Time saved per user

3. **Business Metrics**
   - User engagement
   - Feature adoption rate
   - Demo conversion rate

### Logging Strategy

```javascript
// Structured logging
const logger = {
  info: (message, data) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      data,
      timestamp: new Date().toISOString()
    }));
  },
  error: (message, error) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }));
  }
};
```

---

## Next Steps

With these technical specifications, you're ready to:

1. ✓ Set up IBM watsonx API (follow IBM_WATSONX_SETUP_GUIDE.md)
2. → Implement backend services
3. → Build frontend components
4. → Integrate and test
5. → Deploy and demo

**Ready to start coding? Switch to Code mode!**