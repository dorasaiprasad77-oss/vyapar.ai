const DEFAULT_PROD_API_URL = "https://vyapar-ai-backend.onrender.com/api";
const DEFAULT_DEV_API_URL = "http://localhost:5000/api";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production" ? DEFAULT_PROD_API_URL : DEFAULT_DEV_API_URL);
