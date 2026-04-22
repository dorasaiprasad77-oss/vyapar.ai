"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";
import axios from "axios";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [shopType, setShopType] = useState("Kirana");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleRequestOtp = async () => {
    if (phone.length < 10) return alert("Enter valid 10-digit number");
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/request-otp`, { phone });
      setOtpSent(true);
    } catch (err: any) {
      const serverMessage = err?.response?.data?.error;
      alert(serverMessage || "Error sending OTP. Check backend URL and CORS settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) return alert("Enter valid OTP (Use 1234)");
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/verify-otp`, { phone, otp, name, shopType });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.error || "Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 pt-16 flex flex-col gap-8 min-h-screen bg-white">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">Welcome to <br/><span className="text-blue-600">Vyapar AI</span></h1>
        <p className="text-gray-500 mt-2">Login to manage your business.</p>
      </div>

      {!otpSent ? (
        <div className="flex flex-col gap-6">
          {/* Google Login Button */}
          <a 
            href={`${API_URL}/auth/google`}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all active:scale-95"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </a>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase text-gray-400">
              <span>or</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
            <div className="flex items-center w-full border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 ring-blue-500">
              <span className="bg-gray-100 px-4 py-4 text-gray-600 font-bold border-r border-gray-300">+91</span>
              <input
                type="tel"
                placeholder="9876543210"
                maxLength={10}
                className="w-full px-4 py-4 text-lg outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>
          
          <button 
            onClick={handleRequestOtp} 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold text-xl py-4 rounded-xl shadow-lg shadow-blue-200 mt-4 active:scale-95 transition-transform disabled:opacity-70"
          >
            {loading ? "Sending..." : "Get OTP"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
           {/* If we need name & shop type for new registration, we just ask simultaneously for Demo */}
           <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name (Optional for existing)</label>
            <input
              type="text"
              placeholder="e.g. Ramesh Kirana Store"
              className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl outline-none focus:ring-2 ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Enter OTP</label>
            <input
              type="text"
              placeholder="1234 (Mock OTP)"
              maxLength={4}
              className="w-full px-4 py-4 text-center text-2xl tracking-[1em] font-bold border border-gray-300 rounded-xl outline-none focus:ring-2 ring-blue-500"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          
          <button 
            onClick={handleVerifyOtp} 
            disabled={loading}
            className="w-full bg-green-600 text-white font-bold text-xl py-4 rounded-xl shadow-lg shadow-green-200 mt-4 active:scale-95 transition-transform disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Login Securely"}
          </button>
        </div>
      )}
    </div>
  );
}
