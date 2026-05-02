# 🚀 Start Dev Buddy - Quick Guide

## Option 1: Use the Startup Script (Easiest)

Simply double-click this file:
```
start-dev-buddy.bat
```

This will:
1. ✅ Install all dependencies
2. ✅ Start the backend server
3. ✅ Start the frontend
4. ✅ Open your browser automatically

---

## Option 2: Manual Start (If script doesn't work)

### Step 1: Start Backend

Open a terminal and run:
```bash
cd backend
npm install
npm start
```

Wait until you see:
```
🚀 Dev Buddy Backend running on port 3001
```

### Step 2: Start Frontend

Open a NEW terminal and run:
```bash
cd frontend
npm install
npm start
```

Your browser will automatically open to: http://localhost:3000

---

## ✅ What You Should See

### Backend Terminal:
```
🚀 Dev Buddy Backend running on port 3001
📝 Environment: development
🔗 Frontend URL: http://localhost:3000
🤖 watsonx configured: Yes (or No if not set up yet)
```

### Frontend Browser:
- Beautiful gradient purple background
- "Dev Buddy 🤖" header
- Code editor on the left
- Three buttons: "Explain Code", "Generate Tests", "Generate Docs"
- Results panel on the right

---

## 🎯 Quick Test

1. **Paste this code** in the editor:
```javascript
function add(a, b) {
  return a + b;
}
```

2. **Click** "✨ Explain Code"

3. **Wait** 5-10 seconds

4. **See** the explanation appear!

---

## ⚠️ Troubleshooting

### Backend won't start?
- Check if you have a `backend/.env` file
- Make sure it has your IBM watsonx credentials
- See [`IBM_WATSONX_ALTERNATIVE_SETUP.md`](IBM_WATSONX_ALTERNATIVE_SETUP.md) for alternatives

### Frontend won't start?
- Make sure backend is running first
- Check if port 3000 is available
- Try: `npm cache clean --force` then `npm install` again

### "Cannot connect to backend"?
- Verify backend is running on port 3001
- Check browser console for errors
- Make sure no firewall is blocking

---

## 📖 Next Steps

Once it's running:

1. ✅ Test all three features
2. ✅ Check the analytics dashboard
3. ✅ Review [`DEMO_SAMPLES.md`](DEMO_SAMPLES.md) for demo code
4. ✅ Practice your presentation!

---

## 🎬 Ready for Demo?

See [`DEMO_SAMPLES.md`](DEMO_SAMPLES.md) for:
- Perfect demo code samples
- 3-minute demo script
- Tips for impressive presentation

---

**Need help? Check [`TESTING_GUIDE.md`](TESTING_GUIDE.md) for detailed testing instructions!**