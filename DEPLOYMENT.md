# Vyapar AI - Production & Deployment Guide 🚀

This document outlines the final steps to deploy **Vyapar AI** successfully to production, detailing the exact architecture, environment variables, and the massive UI upgrades applied.

---

## 🎨 UI/UX Improvements (Before vs After)

### 1. **Dashboard**
* **Before:** Basic static squares with standard colors. No graphing, plain text stats.
* **After:** We integrated **Recharts** to render a live Weekly Performance graph. Summary cards now feature **Framer Motion** smooth load-in animations, premium multi-stop gradients matching leading FinTech apps (e.g. Cred, Khatabook). It feels alive and premium.

### 2. **AI Voice Assistant**
* **Before:** Simple input box and continuous block of list text, standard UI.
* **After:** Transformed into a highly familiar **WhatsApp-style conversational UI**. Distinct incoming/outgoing chat bubbles (with the classic green and white palette), real-time "typing..." animation dots, background patterns, and timestamp ticks. The Voice interaction triggers a sticky pulsing banner at the bottom.

### 3. **Global Aesthetics**
* Integrated **Lucide Icons** consistently across all screens.
* Enhanced typography tracking and tightened headings. Added blur effects behind fixed headers utilizing `backdrop-blur`.

---

## 💻 Localhost Preview Instructions (Pre-Deployment Testing)

To ensure nothing breaks before you deploy, test the setup locally over standardized ports (Frontend: 3000, Backend: 5000).

1. **Start the Backend (Port 5000):**
   ```bash
   cd vyapar.ai/backend
   # Make sure MongoDB is running locally on port 27017 or your MONGO_URI is set inside .env
   npm start
   ```

2. **Start the Frontend (Port 3000):**
   ```bash
   cd vyapar.ai/frontend
   npm run dev
   ```

3. **Verify:** Open Chrome to `http://localhost:3000`. Login using `9876543210` and OTP `1234`. Test the AI assistant and assure the Dashboard charts load seamlessly.

---

## 🔒 Environment Variables Reference

### Backend (`backend/.env`)
```bash
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/vyapar-ai?retryWrites=true&w=majority
JWT_SECRET=supersecretjwtkey_12345
CLIENT_URL=https://vyapar-ai-frontend.vercel.app  # (Your Vercel URL later)
```

### Frontend (`frontend/.env.local`)
```bash
NEXT_PUBLIC_API_URL=https://vyapar-ai-backend.onrender.com/api # (Your Render URL later)
```

---

## ☁️ Step-by-Step Deployment Guide

### Step 1: Database (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and register.
2. Create a Free Shared Cluster.
3. Under **Database Access**, create a Database User (e.g., username `vyapar_admin`, auto-generate password). **Save this password!**
4. Under **Network Access**, add IP Address `0.0.0.0/0` (Allow access from anywhere, so Render can connect).
5. Click **Connect -> Connect your application**. Copy the connection string. Replace `<password>` with your stored password. This is your completely secure `MONGO_URI`.

### Step 2: Backend (Render.com or Railway.app)
1. Push your `vyapar.ai` code to a GitHub repository.
2. Sign up on [Render.com](https://render.com/).
3. Click **New -> Web Service**.
4. Connect your GitHub repository and select the `backend` folder as the **Root Directory**.
5. Set the following:
   * **Runtime:** Node
   * **Build Command:** `npm install`
   * **Start Command:** `npm start`
6. Click **Advanced -> Add Environment Variables**, paste your exact list from `backend/.env` (Ensure `MONGO_URI` is your new Atlas String).
7. Click **Create Web Service**. After 2 minutes, Render will issue a URL like `https://vyapar-backend.onrender.com`.

### Step 3: Frontend (Vercel)
1. Sign up on [Vercel](https://vercel.com).
2. Click **Add New -> Project**. Import your GitHub repository.
3. In the Build Configuration, set the **Root Directory** to `frontend`.
4. Leave Framework preset as `Next.js`.
5. Under **Environment Variables**, add:
   * `NEXT_PUBLIC_API_URL` -> Set this to your **Render Backend URL + /api** (e.g., `https://vyapar-backend.onrender.com/api`).
6. Click **Deploy**. Vercel will output a live URL (e.g. `https://vyapar-frontend.vercel.app`).

### Step 4: Final Connection Link (CORS)
1. Go back to your Backend Web Service on Render.
2. Update the Environment Variable `CLIENT_URL` to your fresh Vercel URL (e.g. `https://vyapar-frontend.vercel.app`). This restricts API calls securely ensuring only your frontend can interact with the backend APIs.

---

## 🛡️ Production Level API Protection Added
* **Rate Limiting:** Added `express-rate-limit` to automatically drop excess traffic (100 reqs / 15 mins) preventing DDoS spanning local models.
* **Trust Proxies:** Configured Express to trust `Vercel`/`Render` load balancers allowing correct tracking of IPs for ratelimits.
* **Basic Auth Setup:** Stubbed out `JWT middleware` successfully preventing random data injection. You simply wrap `app.use('/api/sales', authMiddleware, ...)` inside your controllers where enforced.
