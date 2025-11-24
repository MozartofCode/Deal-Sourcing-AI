# 🚀 Free Deployment Guide - Deal Sourcing AI

This guide will help you deploy your app for **FREE** with automatic deployments whenever you push to GitHub. No credit card required!

## 📋 Prerequisites

1. A GitHub account (free)
2. Your OpenAI API key
3. Your code pushed to a GitHub repository

---

## 🎯 Quick Overview

- **Frontend**: Deploy to Vercel (free, auto-deploys on push)
- **Backend**: Deploy to Render.com (free tier, auto-deploys on push)
- **Secrets**: Stored securely in platform environment variables (never in code)

---

## 📦 Step 1: Push Your Code to GitHub

If you haven't already:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**Important**: Make sure your `.env` file is in `.gitignore` (it should be already) so your OpenAI key never gets pushed!

---

## 🔧 Step 2: Deploy Backend to Render.com

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account (free)

### 2.2 Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your repository

### 2.3 Configure Backend Service
- **Name**: `deal-sourcing-ai-backend` (or any name you like)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### 2.4 Add Environment Variables
Click **"Environment"** tab and add:

1. **OPENAI_API_KEY**
   - Value: Your actual OpenAI API key (starts with `sk-`)
   - **This is secret - Render will encrypt it!**

2. **ALLOWED_ORIGINS**
   - Value: `https://your-frontend.vercel.app` (we'll update this after frontend deploys)
   - For now, you can leave this or use a placeholder

### 2.5 Deploy!
1. Click **"Create Web Service"**
2. Wait 2-3 minutes for deployment
3. **Copy your backend URL** (e.g., `https://deal-sourcing-ai-backend.onrender.com`)
   - You'll need this for the frontend!

---

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account (free)

### 3.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Select your repository

### 3.3 Configure Frontend
- **Framework Preset**: Vite (should auto-detect)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (should auto-fill)
- **Output Directory**: `dist` (should auto-fill)

### 3.4 Add Environment Variables
Click **"Environment Variables"** and add:

1. **VITE_API_URL**
   - Value: Your Render backend URL from Step 2.5
   - Example: `https://deal-sourcing-ai-backend.onrender.com`

### 3.5 Deploy!
1. Click **"Deploy"**
2. Wait 1-2 minutes
3. **Copy your frontend URL** (e.g., `https://deal-sourcing-ai.vercel.app`)

---

## 🔄 Step 4: Connect Frontend and Backend

### 4.1 Update Backend CORS
1. Go back to Render.com
2. Open your backend service
3. Go to **"Environment"** tab
4. Update **ALLOWED_ORIGINS**:
   - Value: Your Vercel frontend URL (from Step 3.5)
   - Example: `https://deal-sourcing-ai.vercel.app`
5. Click **"Save Changes"** - Render will automatically redeploy!

### 4.2 Test Your App
1. Visit your Vercel frontend URL
2. Try sending a message - it should work! 🎉

---

## ✅ Automatic Deployments Setup

**Good news!** Both platforms are already configured for automatic deployments:

- **Vercel**: Automatically deploys on every push to `main` branch
- **Render**: Automatically deploys on every push to `main` branch

**Just push to GitHub and your changes will deploy automatically!**

```bash
git add .
git commit -m "Your changes"
git push
```

Both services will detect the push and redeploy automatically (usually takes 2-3 minutes).

---

## 🔒 Security Best Practices

✅ **DO:**
- Store secrets in platform environment variables (Render/Vercel)
- Keep `.env` in `.gitignore`
- Use HTTPS URLs in production

❌ **DON'T:**
- Commit `.env` files to GitHub
- Hardcode API keys in your code
- Share your API keys publicly

---

## 🐛 Troubleshooting

### Backend not connecting?
- Check that `ALLOWED_ORIGINS` in Render includes your Vercel URL
- Make sure `VITE_API_URL` in Vercel is your Render backend URL
- Check Render logs: Service → **"Logs"** tab

### Frontend shows errors?
- Check browser console (F12)
- Verify `VITE_API_URL` environment variable in Vercel
- Make sure backend is deployed and running (check Render dashboard)

### API key not working?
- Verify `OPENAI_API_KEY` is set in Render environment variables
- Check that the key starts with `sk-` and is complete
- Check Render logs for error messages

### Slow first request?
- Render free tier "spins down" after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds (cold start)
- This is normal for free tier - paid tiers don't have this

---

## 📊 Free Tier Limits

### Render.com (Backend)
- ✅ 750 hours/month free
- ✅ Auto-deploy from GitHub
- ⚠️ Spins down after 15 min inactivity (30s cold start)
- ✅ Unlimited deploys

### Vercel (Frontend)
- ✅ Unlimited deployments
- ✅ Auto-deploy from GitHub
- ✅ No spin-down (always fast)
- ✅ Free SSL/HTTPS

**Both are completely free and perfect for personal projects!**

---

## 🎉 You're Done!

Your app is now:
- ✅ Live on the internet
- ✅ Automatically deploying on every push
- ✅ Secure (secrets not in code)
- ✅ Free forever (within limits)

**Next time you make changes:**
1. Edit code locally
2. `git push`
3. Wait 2-3 minutes
4. Changes are live! 🚀

---

## 📝 Quick Reference

**Backend URL**: `https://your-backend.onrender.com`  
**Frontend URL**: `https://your-app.vercel.app`

**Environment Variables:**

**Render (Backend):**
- `OPENAI_API_KEY` = your OpenAI key
- `ALLOWED_ORIGINS` = your Vercel frontend URL

**Vercel (Frontend):**
- `VITE_API_URL` = your Render backend URL

---

Need help? Check the logs in Render/Vercel dashboards or open an issue!

