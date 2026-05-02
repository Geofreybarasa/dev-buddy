# Dev Buddy - Deployment Guide

Complete guide for deploying Dev Buddy to production.

## Overview

- **Backend**: Heroku (Node.js)
- **Frontend**: Vercel (React)
- **Database**: In-memory (upgrade to MongoDB/PostgreSQL for production)

---

## Prerequisites

- Git repository set up
- Heroku account (free tier available)
- Vercel account (free tier available)
- IBM watsonx API credentials

---

## Part 1: Backend Deployment (Heroku)

### Step 1: Install Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

### Step 2: Login to Heroku

```bash
heroku login
```

### Step 3: Create Heroku App

```bash
cd backend
heroku create dev-buddy-api
# Note: Replace 'dev-buddy-api' with your preferred name
```

### Step 4: Set Environment Variables

```bash
heroku config:set WATSONX_API_KEY=your_api_key_here
heroku config:set WATSONX_PROJECT_ID=your_project_id_here
heroku config:set WATSONX_URL=https://us-south.ml.cloud.ibm.com
heroku config:set WATSONX_MODEL_ID=ibm/granite-13b-chat-v2
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Step 5: Deploy Backend

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial backend deployment"

# Deploy to Heroku
git push heroku main

# Or if you're on a different branch:
git push heroku your-branch:main
```

### Step 6: Verify Backend Deployment

```bash
# Open the app
heroku open

# Check logs
heroku logs --tail

# Test health endpoint
curl https://your-app-name.herokuapp.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-05-01T19:00:00Z",
  "services": {
    "watsonx": "configured",
    "server": "running"
  }
}
```

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Configure Environment Variables

Create `frontend/.env.production`:

```env
REACT_APP_API_URL=https://your-heroku-app.herokuapp.com/api
```

### Step 4: Update API Service

The frontend is already configured to use `process.env.REACT_APP_API_URL`.

### Step 5: Deploy Frontend

```bash
cd frontend

# First deployment (interactive)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? dev-buddy-frontend
# - Directory? ./
# - Override settings? No

# Production deployment
vercel --prod
```

### Step 6: Set Environment Variables in Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - `REACT_APP_API_URL` = `https://your-heroku-app.herokuapp.com/api`

### Step 7: Redeploy with Environment Variables

```bash
vercel --prod
```

---

## Part 3: Update CORS Configuration

After deploying frontend, update backend CORS:

```bash
heroku config:set FRONTEND_URL=https://your-vercel-app.vercel.app
```

---

## Part 4: Testing Deployment

### Test Backend

```bash
# Health check
curl https://your-heroku-app.herokuapp.com/api/health

# Test explain endpoint
curl -X POST https://your-heroku-app.herokuapp.com/api/explain \
  -H "Content-Type: application/json" \
  -d '{"code":"function add(a,b){return a+b;}", "language":"javascript"}'
```

### Test Frontend

1. Open https://your-vercel-app.vercel.app
2. Paste sample code
3. Click "Explain Code"
4. Verify results appear

---

## Part 5: Custom Domain (Optional)

### Backend (Heroku)

```bash
# Add custom domain
heroku domains:add api.devbuddy.com

# Get DNS target
heroku domains

# Add CNAME record in your DNS provider:
# CNAME api.devbuddy.com -> your-app.herokuapp.com
```

### Frontend (Vercel)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., devbuddy.com)
3. Follow DNS configuration instructions
4. Vercel automatically provisions SSL certificate

---

## Part 6: Monitoring & Maintenance

### Heroku Monitoring

```bash
# View logs
heroku logs --tail

# Check dyno status
heroku ps

# Restart app
heroku restart

# View metrics
heroku open --app your-app-name
# Then go to Metrics tab in dashboard
```

### Vercel Monitoring

1. Go to Vercel Dashboard
2. Select your project
3. View Analytics tab for:
   - Page views
   - Performance metrics
   - Error tracking

### Set Up Alerts

**Heroku:**
- Enable Heroku Metrics (free tier)
- Set up email alerts for errors

**Vercel:**
- Enable Vercel Analytics
- Set up deployment notifications

---

## Part 7: Scaling

### Backend Scaling (Heroku)

```bash
# Scale to multiple dynos
heroku ps:scale web=2

# Upgrade dyno type
heroku ps:type hobby
# or
heroku ps:type standard-1x
```

### Frontend Scaling (Vercel)

Vercel automatically scales based on traffic. No configuration needed.

---

## Part 8: Database Migration (Production)

For production, migrate from in-memory to persistent storage:

### Option 1: MongoDB Atlas

```bash
# Install MongoDB driver
npm install mongodb

# Set environment variable
heroku config:set MONGODB_URI=your_mongodb_connection_string
```

### Option 2: PostgreSQL (Heroku)

```bash
# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Install pg driver
npm install pg

# Connection string automatically added as DATABASE_URL
```

---

## Part 9: CI/CD Setup (Optional)

### GitHub Actions for Backend

Create `.github/workflows/deploy-backend.yml`:

```yaml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-app-name"
          heroku_email: "your-email@example.com"
          appdir: "backend"
```

### Vercel Auto-Deploy

Vercel automatically deploys on git push. Configure in Vercel Dashboard:
1. Connect GitHub repository
2. Set production branch to `main`
3. Enable automatic deployments

---

## Part 10: Security Checklist

- [ ] Environment variables set correctly
- [ ] CORS configured for production URLs only
- [ ] Rate limiting enabled
- [ ] API keys not exposed in frontend
- [ ] HTTPS enabled (automatic with Heroku/Vercel)
- [ ] Input validation on all endpoints
- [ ] Error messages don't expose sensitive info
- [ ] Dependencies updated (npm audit)

---

## Part 11: Cost Estimation

### Free Tier (Hackathon/Demo)

**Heroku:**
- 550 dyno hours/month (free)
- Sleeps after 30 min inactivity
- Cost: $0

**Vercel:**
- 100 GB bandwidth/month
- Unlimited deployments
- Cost: $0

**IBM watsonx:**
- 20,000 tokens/month (free tier)
- ~400-500 API calls
- Cost: $0

**Total: $0/month**

### Production Tier

**Heroku:**
- Hobby dyno: $7/month
- Standard-1X: $25/month

**Vercel:**
- Pro plan: $20/month (optional)
- Free tier sufficient for most use cases

**IBM watsonx:**
- Pay-as-you-go after free tier
- ~$0.01-0.05 per request

**Estimated Total: $32-52/month**

---

## Part 12: Rollback Procedure

### Backend Rollback

```bash
# View releases
heroku releases

# Rollback to previous version
heroku rollback v123

# Or rollback one version
heroku rollback
```

### Frontend Rollback

1. Go to Vercel Dashboard
2. Select Deployments
3. Find previous successful deployment
4. Click "..." → "Promote to Production"

---

## Part 13: Troubleshooting

### Backend Issues

**App crashes on startup:**
```bash
heroku logs --tail
# Check for missing environment variables or syntax errors
```

**Timeout errors:**
```bash
# Increase timeout (if needed)
heroku config:set REQUEST_TIMEOUT=30000
```

**Memory issues:**
```bash
# Check memory usage
heroku ps
# Upgrade dyno if needed
```

### Frontend Issues

**Build fails:**
- Check build logs in Vercel dashboard
- Verify all dependencies are in package.json
- Test build locally: `npm run build`

**API connection fails:**
- Verify REACT_APP_API_URL is set correctly
- Check CORS configuration on backend
- Test API endpoint directly

---

## Part 14: Post-Deployment Checklist

- [ ] Backend health check passes
- [ ] Frontend loads correctly
- [ ] All three features work (explain, tests, docs)
- [ ] Analytics tracking works
- [ ] Error handling works
- [ ] Mobile responsive
- [ ] Performance acceptable (<3s response time)
- [ ] Monitoring set up
- [ ] Backup plan ready for demo

---

## Quick Commands Reference

```bash
# Backend
heroku logs --tail                    # View logs
heroku restart                        # Restart app
heroku config                         # View env vars
heroku ps                            # Check status

# Frontend
vercel --prod                        # Deploy to production
vercel logs                          # View logs
vercel env ls                        # List env vars

# Both
git push heroku main                 # Deploy backend
vercel --prod                        # Deploy frontend
```

---

## Support

For deployment issues:
- Heroku: https://help.heroku.com
- Vercel: https://vercel.com/support
- IBM watsonx: https://cloud.ibm.com/docs/watsonx

---

**Deployment complete! Your Dev Buddy is now live! 🚀**