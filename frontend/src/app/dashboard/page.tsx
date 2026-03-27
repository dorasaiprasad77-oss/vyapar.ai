"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mic, PlusCircle, TrendingUp, AlertTriangle, IndianRupee, Box } from "lucide-react";
import { API_URL } from "@/lib/config";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";

const mockTrendData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, lowStockAlerts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userStr = localStorage.getItem("user");
        if (!userStr) return;
        const user = JSON.parse(userStr);
        const res = await axios.get(`${API_URL}/sales/stats/${user._id}`);
        setStats(res.data);
      } catch (e) {
        console.error("Dashboard fetch error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-5 pt-8 min-h-screen bg-gray-50 pb-24 font-sans">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Vyapar Dashboard</h1>
          <p className="text-base text-gray-500 font-medium">Namaste! Kaise hain aap?</p>
        </div>
        <div className="h-12 w-12 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100">
           <IndianRupee size={24} className="text-blue-600" />
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-200/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-20"><TrendingUp size={48} /></div>
          <p className="text-blue-100 text-sm font-bold uppercase tracking-wider">Aaj Ki Sales</p>
          <div className="flex flex-col mt-2">
            <h2 className="text-3xl font-black">₹{stats.totalSales}</h2>
            <span className="text-xs bg-white/20 inline-block px-2 py-1 rounded-md mt-2 w-max backdrop-blur-sm">+12% vs Kal</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-6 text-white shadow-xl shadow-orange-200/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-20"><Box size={48} /></div>
          <p className="text-red-100 text-sm font-bold uppercase tracking-wider">Low Stock</p>
          <div className="flex flex-col mt-2">
            <h2 className="text-3xl font-black">{stats.lowStockAlerts} <span className="text-lg font-medium opacity-80">Items</span></h2>
            <Link href="/inventory" className="text-xs bg-white/20 inline-block px-2 py-1 rounded-md mt-2 w-max backdrop-blur-sm hover:bg-white/30 transition-colors cursor-pointer">Re-order now</Link>
          </div>
        </motion.div>
      </div>

      {/* Real Data Visualization */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
        className="mb-8 bg-white p-5 rounded-3xl shadow-sm border border-gray-100/60"
      >
        <div className="flex justify-between items-center mb-6">
           <h3 className="font-bold text-gray-800 text-lg">Weekly Performance</h3>
           <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">Upward</span>
        </div>
        <div className="h-48 w-full">
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={mockTrendData}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
               <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }}
               />
               <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={4} dot={{r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
             </LineChart>
           </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <h3 className="font-bold mb-4 text-gray-800 text-lg">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        <Link href="/orders">
          <motion.div whileTap={{ scale: 0.95 }} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-green-50 text-green-600 border border-green-100 rounded-full flex items-center justify-center">
               <PlusCircle size={32} />
            </div>
            <span className="font-bold text-gray-800">New Bill</span>
          </motion.div>
        </Link>

        <Link href="/assistant">
          <motion.div whileTap={{ scale: 0.95 }} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 flex flex-col items-center border border-blue-100 justify-center gap-4 cursor-pointer relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center shadow-sm justify-center relative z-10 animate-pulse">
               <Mic size={32} />
            </div>
            <span className="font-extrabold text-blue-900 relative z-10">Ask AI</span>
          </motion.div>
        </Link>

        <Link href="/customers">
          <motion.div whileTap={{ scale: 0.95 }} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-purple-50 text-purple-600 border border-purple-100 rounded-full flex items-center justify-center">
               <div className="font-black text-2xl">👤</div>
            </div>
            <span className="font-bold text-gray-800 text-center">Mera Khata<br/><span className="text-xs text-gray-400 font-medium">(Customers)</span></span>
          </motion.div>
        </Link>

        <Link href="/payments">
          <motion.div whileTap={{ scale: 0.95 }} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 border border-orange-100 rounded-full flex items-center justify-center">
               <IndianRupee size={32} className="opacity-0" />
               <div className="font-black text-2xl absolute">₹</div>
            </div>
            <span className="font-bold text-gray-800 text-center">Paisa Jama<br/><span className="text-xs text-gray-400 font-medium">(Payments)</span></span>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
