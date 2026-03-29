# ShopEase — Deployment Guide

Deploy the backend on **Render** (free tier) and the frontend on **Vercel** (free tier).
MongoDB Atlas is already set up and running.

---

## 🗓️ Overview

```
MongoDB Atlas (already live)
       ↑
  Render (Backend API)  ←→  Vercel (Frontend)
```

---

## Step 1 — Push to GitHub

If you haven't already, push your project to a GitHub repository.

```bash
cd /Users/dheeraj/e-commerce

# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit - ShopEase e-commerce app"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/shopease.git
git push -u origin main
```

> **Important**: Make sure `.env` is in `.gitignore` — never push credentials to GitHub!

Add this to `backend/.gitignore`:
```
node_modules/
.env
```

Add this to `frontend/.gitignore`:
```
node_modules/
dist/
```

---

## Step 2 — Deploy Backend on Render

### 2.1 Create account
Go to [render.com](https://render.com) and sign up with GitHub.

### 2.2 Create a new Web Service
1. Click **New +** → **Web Service**
2. Connect your GitHub repo
3. Set **Root Directory**: `backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node server.js`
6. Select **Free** plan
7. Click **Create Web Service**

### 2.3 Add Environment Variables
In your Render service → **Environment** tab, add:

| Key | Value |
|-----|-------|
| `PORT` | `5001` |
| `MONGODB_URI` | `mongodb+srv://dheerajmlk123:Mongodb@cluster0.phlkctp.mongodb.net/ecommerce` |
| `JWT_SECRET` | `shopease_jwt_secret_key_2024` |
| `CLOUDINARY_CLOUD_NAME` | `dnclehvkq` |
| `CLOUDINARY_API_KEY` | `178899632696332` |
| `CLOUDINARY_API_SECRET` | `p-aXN2Vp29EUVGvEjxkq8vMeYKs` |
| `RAZORPAY_KEY_ID` | `rzp_test_SGgUxNXJPhFnL7` |
| `RAZORPAY_KEY_SECRET` | `gOf4SoUh0IiNkCRlzgXWlx4c` |
| `FRONTEND_URL` | *(your Vercel URL — add after Step 3)* |
| `EMAIL_USER` | *(your Gmail — optional for password reset)* |
| `EMAIL_PASS` | *(your Gmail App Password — optional)* |

### 2.4 Note your Backend URL
After deploy, Render gives you a URL like:
```
https://shopease-backend.onrender.com
```
Save this — you'll need it for the frontend.

> **Free tier note**: Render spins down after 15 minutes of inactivity. First request after sleep takes ~30 seconds. Upgrade to Starter ($7/mo) to keep it always-on.

---

## Step 3 — Update Frontend API URL

In your frontend code, update the API base URL:

**`frontend/src/api.js`** — change:
```js
// Before (local dev):
baseURL: "http://localhost:5001/api"

// After (production):
baseURL: "https://shopease-backend.onrender.com/api"
```

Also update Razorpay key in checkout if hardcoded:
- Search for `rzp_test_SGgUxNXJPhFnL7` and ensure it points to your key.

Commit and push these changes:
```bash
git add frontend/src/api.js
git commit -m "Update API URL for production"
git push
```

---

## Step 4 — Deploy Frontend on Vercel

### 4.1 Create account
Go to [vercel.com](https://vercel.com) and sign up with GitHub.

### 4.2 Import project
1. Click **Add New** → **Project**
2. Select your GitHub repo
3. Set **Root Directory**: `frontend`
4. **Framework Preset**: Vite (auto-detected)
5. Click **Deploy**

### 4.3 Note your Frontend URL
After deploy, Vercel gives you a URL like:
```
https://shopease.vercel.app
```

### 4.4 Update FRONTEND_URL on Render
Go back to your Render service → Environment → add/update:
```
FRONTEND_URL = https://shopease.vercel.app
```
Then **Manual Deploy** → **Deploy latest commit** on Render.

---

## Step 5 — Configure CORS (if needed)

Your backend `server.js` currently allows all origins:
```js
app.use(cors());
```

For production security, update to allow only your Vercel domain:
```js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
```

---

## Step 6 — Test Your Live App

1. Visit your Vercel URL
2. Register a new account or use test accounts:
   - Admin: `admin@shopease.com` / `admin123`
   - User: `user@test.com` / `user123`
3. Browse products, add to cart, test checkout with Razorpay test card:
   - Card: `4111 1111 1111 1111` | CVV: `123` | Expiry: `12/26`
4. Test forgot password flow (dev mode shows link directly if email not configured)

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub (`.env` NOT included)
- [ ] Backend deployed on Render
- [ ] All environment variables added on Render
- [ ] Frontend `api.js` updated with Render URL
- [ ] Frontend deployed on Vercel
- [ ] `FRONTEND_URL` updated on Render with Vercel URL
- [ ] Test login, products, cart, checkout
- [ ] Test admin panel at `/admin`

---

## 🔒 Security Notes

- Never commit `.env` to GitHub
- Change `JWT_SECRET` to a random 64-character string for production
- Razorpay keys are test mode — switch to live keys when ready to go live
- Enable Gmail App Password (not your Google account password)

---

## 💰 Cost Estimate (Free Tier)

| Service | Free Tier | Limitations |
|---------|-----------|-------------|
| MongoDB Atlas | Free (M0) | 512MB storage |
| Render | Free | Sleeps after 15min |
| Vercel | Free | 100GB bandwidth/mo |
| Cloudinary | Free | 25 credits/mo |

**Total monthly cost: $0** for demo/portfolio projects.
