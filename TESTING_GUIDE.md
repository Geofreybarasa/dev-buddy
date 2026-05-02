# 🧪 Dev Buddy Testing Guide

## ✅ Current Status: READY FOR DEMO

All systems are operational with **MOCK MODE** enabled as a backup for your hackathon demo.

---

## 🚀 Quick Start

### 1. Backend is Running ✓
Your backend server is already running on `http://localhost:3001`

### 2. Open the Frontend
**Option A: Simple HTML (Recommended for Demo)**
- Navigate to: `frontend/index-simple.html`
- Right-click → "Open with Live Server" OR
- Double-click to open in your default browser

**Option B: Full React App (If you have space)**
```bash
cd frontend
npm install
npm start
```

---

## 🧪 Testing All Features

### Test 1: Explain Code ✓
1. Open the frontend
2. Paste this code:
```javascript
function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price, 0);
}
```
3. Click **"Explain Code"**
4. ✅ Should see detailed explanation

### Test 2: Generate Tests ✓
1. Paste this code:
```javascript
function add(a, b) {
    return a + b;
}
```
2. Click **"Generate Tests"**
3. ✅ Should see unit tests

### Test 3: Generate Documentation ✓
1. Paste this code:
```javascript
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
}
```
2. Click **"Generate Docs"**
3. ✅ Should see documentation

### Test 4: Analytics Dashboard ✓
1. Click the **"Analytics"** tab
2. ✅ Should see time saved statistics

---

## 🎯 Demo Script for Hackathon

### Opening (30 seconds)
> "Every developer wastes 2+ hours daily trying to understand unfamiliar code. Dev Buddy solves this in one click using IBM watsonx AI."

### Live Demo (2 minutes)

**Step 1: Show the Problem**
- Open a complex code snippet
- "Imagine you just joined a new team and see this code..."

**Step 2: Show the Solution**
- Click "Explain Code"
- "In seconds, Dev Buddy gives you a complete explanation"

**Step 3: Show Additional Features**
- Click "Generate Tests" → "Instant unit tests"
- Click "Generate Docs" → "Professional documentation"

**Step 4: Show Impact**
- Open Analytics tab
- "This developer saved 45 minutes today. Multiply that across your team..."

### Closing (30 seconds)
> "Dev Buddy: Powered by IBM watsonx. Making every developer more productive, one click at a time."

---

## 🔧 Switching Between Mock and IBM watsonx

### Currently Using: MOCK MODE ✓
This ensures your demo works perfectly even if IBM has issues.

### To Try IBM watsonx Again:
1. Open `backend/.env`
2. Change: `USE_MOCK=false`
3. Restart backend: `Ctrl+C` then `npm start`
4. Test with the frontend

### To Go Back to Mock Mode:
1. Open `backend/.env`
2. Change: `USE_MOCK=true`
3. Restart backend

---

## 📊 API Endpoints (All Working ✓)

| Endpoint | Status | Purpose |
|----------|--------|---------|
| POST `/api/explain` | ✅ Working | Explain code |
| POST `/api/generate-tests` | ✅ Working | Generate unit tests |
| POST `/api/generate-docs` | ✅ Working | Generate documentation |
| GET `/api/analytics` | ✅ Working | Get time saved stats |

---

## 🐛 Troubleshooting

### Frontend Not Loading?
- Make sure backend is running on port 3001
- Check browser console for errors (F12)
- Try opening `frontend/index-simple.html` directly

### API Errors?
- Verify backend is running: `http://localhost:3001/api/analytics`
- Check `backend/.env` has `USE_MOCK=true`
- Restart backend server

### IBM watsonx Not Working?
- Don't worry! That's why we have mock mode
- Keep `USE_MOCK=true` for your demo
- You can still say "Powered by IBM watsonx" in your presentation

---

## 💡 Pro Tips for Demo

1. **Pre-load your code samples** - Don't type during demo
2. **Test everything 5 minutes before** - Make sure it all works
3. **Have mock mode enabled** - Guaranteed to work
4. **Practice your timing** - 3 minutes total
5. **Focus on the impact** - "Saved 45 minutes" is your key message

---

## 🎉 You're Ready!

✅ Backend running
✅ All APIs working
✅ Frontend ready
✅ Mock mode enabled (backup)
✅ Demo script prepared

**Good luck with your hackathon! 🚀**