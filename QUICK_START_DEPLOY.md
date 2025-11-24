# ⚡ Quick Start - Deploy in 5 Minutes

## Prerequisites
- GitHub account
- OpenAI API key
- Code pushed to GitHub

## Steps

### 1. Backend (Render.com) - 2 minutes
1. Go to [render.com](https://render.com) → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Configure:
   - **Name**: `deal-sourcing-ai-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `OPENAI_API_KEY` = your OpenAI key
   - `ALLOWED_ORIGINS` = (leave blank for now, update after frontend deploys)
6. Click **"Create Web Service"**
7. **Copy the URL** (e.g., `https://deal-sourcing-ai-backend.onrender.com`)

### 2. Frontend (Vercel) - 2 minutes
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repo
4. Configure:
   - **Root Directory**: `frontend`
   - Framework should auto-detect as Vite
5. Add environment variable:
   - `VITE_API_URL` = your Render backend URL from step 1
6. Click **"Deploy"**
7. **Copy the URL** (e.g., `https://deal-sourcing-ai.vercel.app`)

### 3. Connect Them - 1 minute
1. Go back to Render.com
2. Update `ALLOWED_ORIGINS` environment variable with your Vercel URL
3. Render will auto-redeploy

## ✅ Done!

Your app is live! Every `git push` will auto-deploy.

**Full guide**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions and troubleshooting.

