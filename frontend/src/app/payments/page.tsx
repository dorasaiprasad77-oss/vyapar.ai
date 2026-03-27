"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/config";
import { IndianRupee } from "lucide-react";
import { motion } from "framer-motion";

export default function PaymentsPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);
      const res = await axios.get(`${API_URL}/customers/${user._id}`);
      setCustomers(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePayment = async () => {
    if (!selectedCustomerId || amount <= 0) return alert("Select customer & enter valid amount");
    setLoading(true);
    try {
      await axios.post(`${API_URL}/customers/pay/${selectedCustomerId}`, { amount });
      alert("Payment saved successfully!");
      setAmount(0);
      setSelectedCustomerId("");
      fetchCustomers(); // refresh pending balances
    } catch (e) {
      alert("Error saving payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 pt-8 min-h-screen bg-gray-50 pb-24 font-sans">
      <header className="mb-8">
         <h1 className="text-3xl font-black text-gray-900 leading-tight">Udhaar ki <br/><span className="text-green-600">Vasooli</span></h1>
         <p className="text-gray-500 mt-1 font-medium text-sm">Customer incoming payments record karein</p>
      </header>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-5 rounded-3xl shadow-md border border-gray-100 flex flex-col gap-5">
         
         <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">Customer Select Karein</label>
            <select 
              className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none font-bold text-gray-800 focus:ring-2 ring-green-500"
              value={selectedCustomerId}
              onChange={e => setSelectedCustomerId(e.target.value)}
            >
               <option value="">-- Choose Customer --</option>
               {customers.filter(c => c.pendingAmount > 0).map(c => (
                  <option key={c._id} value={c._id}>{c.name} - Baaki: ₹{c.pendingAmount}</option>
               ))}
            </select>
         </div>

         <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">Kitna Paisa Aaya?</label>
            <div className="flex items-center w-full border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 ring-green-500 bg-gray-50">
              <span className="bg-gray-100 px-4 py-4 text-gray-600 font-bold border-r border-gray-200"><IndianRupee size={20} /></span>
              <input
                type="number"
                placeholder="₹0"
                className="w-full px-4 py-4 text-xl font-black outline-none bg-transparent"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>
         </div>

         <button 
           onClick={handlePayment} 
           disabled={loading || !selectedCustomerId || amount <= 0}
           className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-xl py-4 rounded-xl shadow-lg shadow-green-200 mt-2 active:scale-95 transition-transform disabled:opacity-50"
         >
           {loading ? "Processing..." : "Jama Karlo"}
         </button>
      </motion.div>
    </div>
  );
}
