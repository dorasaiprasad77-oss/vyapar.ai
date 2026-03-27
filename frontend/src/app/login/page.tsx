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
