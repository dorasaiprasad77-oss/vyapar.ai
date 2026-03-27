"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/config";
import { Plus, User, Phone, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", pendingAmount: 0 });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);
      const res = await axios.get(`${API_URL}/customers/${user._id}`);
      setCustomers(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async () => {
    try {
      const userStr = localStorage.getItem("user");
      const user = JSON.parse(userStr!);
      await axios.post(`${API_URL}/customers`, { userId: user._id, ...formData });
      
      alert("Customer added successfully! 🎉"); // Bonus objective completed
      
      setModalOpen(false);
      setFormData({ name: "", phone: "", pendingAmount: 0 });
      fetchCustomers();
    } catch (e) {
      alert("Error adding customer (Server Error)");
    }
  };

  return (
    <div className="p-4 pt-6 min-h-screen bg-gray-50 pb-24 font-sans">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mera Khata (Customers)</h1>
          <p className="text-sm text-gray-500">{customers.length} grahak module</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="p-2 bg-blue-600 text-white rounded-full shadow-md active:scale-95">
          <Plus size={24} />
        </button>
      </header>

      <div className="space-y-3">
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Loading customers...</p>
        ) : customers.length === 0 ? (
          <div className="text-center text-gray-400 py-10">Kisi customer ka record nahi hai.</div>
        ) : (
          customers.map((c) => (
            <motion.div key={c._id} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
               <div className="flex gap-4 items-center">
                 <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                   <User size={24} />
                 </div>
                 <div>
                   <h3 className="font-bold text-gray-800 text-lg leading-tight">{c.name}</h3>
                   <span className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Phone size={12}/> {c.phone}</span>
                 </div>
               </div>
               <div className="text-right">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Udhaar</p>
                 <span className={`font-black text-lg ${c.pendingAmount > 0 ? "text-red-500" : "text-green-500"}`}>
                   ₹{c.pendingAmount}
                 </span>
               </div>
            </motion.div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-sm rounded-[24px] p-6">
              <h2 className="text-xl font-bold mb-4">Naya Customer</h2>
              <div className="space-y-4">
                 <input type="text" placeholder="Grahak ka Naam" className="w-full bg-gray-100 p-3 rounded-xl outline-none focus:ring-2 ring-blue-500" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
                 <input type="tel" placeholder="Mobile Number" className="w-full bg-gray-100 p-3 rounded-xl outline-none focus:ring-2 ring-blue-500" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} />
                 <input type="number" placeholder="Pehla Udhaar (Optional API)" className="w-full bg-gray-100 p-3 rounded-xl outline-none focus:ring-2 ring-blue-500" value={formData.pendingAmount} onChange={e=>setFormData({...formData, pendingAmount: Number(e.target.value)})} />
              </div>
              <div className="flex gap-3 mt-6">
                 <button onClick={()=>setModalOpen(false)} className="flex-1 py-3 bg-gray-100 font-bold rounded-xl text-gray-600">Cancel</button>
                 <button onClick={addCustomer} className="flex-1 py-3 bg-blue-600 font-bold rounded-xl text-white">Save</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
