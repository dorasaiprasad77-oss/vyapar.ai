# Vyapar AI - Smart Business Assistant for Indian Retailers

Vyapar AI is a complete, production-ready full-stack application designed specifically for small business owners in India (Kirana shops, retailers, street vendors). It focuses heavily on voice-first AI interactions, robust inventory management, and intuitive smart billing.

## 📁 Full Project Structure
```text
vyapar.ai/
├── frontend/                  # Next.js 16 (React) Frontend
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   │   ├── page.tsx       # Landing Page
│   │   │   ├── login/         # Mobile OTP Login (Mocked)
│   │   │   ├── dashboard/     # Main Dashboard (Sales, Quick Actions)
│   │   │   ├── billing/       # Smart Billing (Add to Cart, Checkout)
│   │   │   ├── inventory/     # Inventory (CRUD, Low Stock Alert)
│   │   │   ├── assistant/     # Voice AI Assistant (Speech-to-Text)
│   │   │   ├── insights/      # AI Sales Trends & Recommendations
│   │   │   ├── pricing/       # Subscription plans
│   │   │   ├── layout.tsx     # Root Next Layout
│   │   │   └── globals.css    # Tailwind Configuration
│   │   ├── components/        # Reusable UI components
│   │   │   └── BottomNav.tsx  # Mobile Bottom Navigation Bar
│   │   └── lib/               # Configurations
│   │       └── config.ts      # API Connectors
│   ├── package.json           # Frontend dependencies
│   └── tailwind.config.js     # Tailwind configuration
│
└── backend/                   # Node.js + Express Backend
    ├── src/
    │   ├── index.js           # Express App Entry Point
    │   ├── models/            # MongoDB Schemas
    │   │   ├── User.js        # User & Subscription Data
    │   │   ├── Inventory.js   # Stock Management
    │   │   └── Sale.js        # Billing & Sales History
    │   └── routes/            # API Controllers
    │       ├── auth.js        # OTP Auth & Registration
    │       ├── inventory.js   # Stock CRUD Operations
    │       ├── sales.js       # Checkout & Dashboard Stats
    │       └── ai.js          # Mock NLP & Assistant Route
    └── package.json           # Backend dependencies
```

## 🛠️ Step-by-Step Setup Instructions

### Prerequisites
- Node.js installed (v18+)
- MongoDB installed locally OR a MongoDB Atlas cluster URL

### 1. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the backend server (Ensure MongoDB is running locally on port 27017, or set `MONGO_URI` in `.env`):
   ```bash
   npm start
   ```
   *The server will start on `http://localhost:5000`*

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The frontend will start on `http://localhost:3000`*

## 🗄️ Database Schema Representation (MongoDB)
**User Schema:**
- `phone`: String (Unique index for OTP auth)
- `name`: String (Display Name)
- `shopType`: String (E.g., Kirana, Bakery)
- `subscriptionStatus`: Enum (Free, Premium, Pro)

**Inventory Schema:**
- `userId`: Reference to User
- `itemName`: String (E.g., "Aashirvaad Atta 5kg")
- `quantity`: Number (Current stock level)
- `price`: Number (Selling price per unit)
- `lowStockThreshold`: Number (Alert threshold, default 5)
- `unit`: String (Pcs, Kg, Ltr)

**Sale Schema:**
- `userId`: Reference to User
- `customerName`: String (Optional)
- `items`: Array of objects (`itemId`, `itemName`, `quantity`, `price`, `total`)
- `totalAmount`: Number (Total bill value)
- `date`: DateTime

## 🔄 API Flow Explanation
1. **Authentication:** 
   - `POST /api/auth/request-otp` mocks sending an OTP to a mobile number.
   - `POST /api/auth/verify-otp` verifies it, creates a User object if missing, and issues a JSON Web Token (JWT).
2. **Dashboard & Insights:** 
   - `GET /api/sales/stats/:userId` aggregates all bills and active inventory. It generates today's sale sum and counts items dipping below the `lowStockThreshold`.
3. **Smart Billing Checkout:**
   - `POST /api/sales` accepts cart items. The server iteratively deducts the `quantity` of each item from the `Inventory` model in MongoDB, calculates totals, and logs a permanent `Sale` record.
4. **Voice AI Magic:** 
   - Uses Web Speech API on the frontend. The recorded query goes to `POST /api/ai/query`. The backend parses basic keywords like "profit" or "stock" and queries MongoDB on the fly, replying with localized Hindi text strings to be spoken back on the device via Text-To-Speech.

## 🧪 Sample Test Data (To speed up testing)
- **Login Credentials:**
  - Phone: `9876543210`
  - Name: `Ramesh Kumar`
  - Shop Type: `Kirana`
  - Mock OTP: `1234`
- **Inventory Mocks (Add these via the Inventory Tab):**
  - Item 1: `Aashirvaad Atta 5kg` | Price: `230` | Qty: `20`
  - Item 2: `Tata Salt 1kg` | Price: `25` | Qty: `4` (Triggers low stock alert)
  - Item 3: `Amul Butter 100g` | Price: `56` | Qty: `50`
- **AI Commands (Test in Assistant Tab):**
  - *"Aaj ka kitna profit bacha hai?"* (Fetches today's sales sum)
- *"Stock kitna bacha hai bhai?"* (Provides alerts for Tata Salt)
