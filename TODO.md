# Vyapar.ai Google Auth + eKYC Integration TODO

## Completed Steps:
- ✅ Installed dependencies (passport, passport-google-oauth20, express-session, razorpay)
- ✅ Created backend/.env with placeholders
- ✅ Updated backend/src/models/User.js (added googleId, email, pan, kycStatus)
- ✅ Updated backend/src/index.js (added session, passport middleware)
- ✅ Updated backend/src/routes/auth.js (Google OAuth routes, /ekyc endpoint)
- ✅ Updated frontend/src/app/login/page.tsx (added Google button with "or" separator)

## Next Steps:
1. [ ] Get your own Google OAuth credentials:
   - Go to https://console.cloud.google.com/apis/credentials
   - Create OAuth 2.0 Client ID (Web app)
   - Authorized redirect URIs: http://localhost:5000/api/auth/google/callback
   - Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to backend/.env
2. [ ] (Optional) Razorpay for real eKYC:
   - https://dashboard.razorpay.com/app/keys
   - Add keys to backend/.env
3. [ ] Start services:
   ```
   mongod  # or your MongoDB service
   cd backend && npm run dev  # http://localhost:5000
   cd frontend && npm run dev  # http://localhost:3000
   ```
4. [ ] Test:
   - Open http://localhost:3000/login
   - Click "Continue with Google" (will redirect to dashboard with token)
   - OTP fallback still works
   - After login, can call /api/auth/ekyc {pan, phone} for eKYC (mock PAN regex check)

