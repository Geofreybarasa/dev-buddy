# Dev Buddy - Quick Start Guide

Get Dev Buddy running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- IBM watsonx API credentials (see [IBM_WATSONX_SETUP_GUIDE.md](./IBM_WATSONX_SETUP_GUIDE.md))

## Step 1: Install Dependencies (2 minutes)

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## Step 2: Configure Environment (1 minute)

Create `backend/.env` file:

```env
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL_ID=ibm/granite-13b-chat-v2
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## Step 3: Start the Application (1 minute)

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

You should see:
```
🚀 Dev Buddy Backend running on port 3001
📝 Environment: development
🔗 Frontend URL: http://localhost:3000
🤖 watsonx configured: Yes
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Browser will automatically open to http://localhost:3000

## Step 4: Test the Application (1 minute)

1. Paste this sample code:
```javascript
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}
```

2. Click "✨ Explain Code"
3. Wait 5 seconds
4. See the magic! ✨

## Troubleshooting

### Backend won't start
- Check if `.env` file exists in `backend/` directory
- Verify IBM watsonx credentials are correct
- Ensure port 3001 is not in use

### Frontend won't start
- Check if backend is running first
- Ensure port 3000 is not in use
- Try clearing npm cache: `npm cache clean --force`

### API errors
- Verify IBM watsonx API key is valid
- Check internet connection
- Review backend logs for detailed errors

### CORS errors
- Ensure backend is running on port 3001
- Check `FRONTEND_URL` in backend `.env`
- Verify frontend is accessing correct backend URL

## Next Steps

- ✅ Application is running
- → Try all three features (Explain, Tests, Docs)
- → Check analytics dashboard
- → Review [DEMO_SAMPLES.md](./DEMO_SAMPLES.md) for demo preparation
- → Read [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) for architecture details

## Development Commands

### Backend
```bash
npm start          # Start server
npm run dev        # Start with nodemon (auto-reload)
npm test           # Run tests
```

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

## Production Deployment

See [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) Phase 5 for deployment instructions.

## Support

- 📖 Full documentation: [README.md](./README.md)
- 🔧 Technical specs: [TECHNICAL_SPECIFICATIONS.md](./TECHNICAL_SPECIFICATIONS.md)
- 🎯 Implementation guide: [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)
- 🤖 IBM watsonx setup: [IBM_WATSONX_SETUP_GUIDE.md](./IBM_WATSONX_SETUP_GUIDE.md)

---

**Ready to demo? Check out [DEMO_SAMPLES.md](./DEMO_SAMPLES.md)!**