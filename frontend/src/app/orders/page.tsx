"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/lib/config";
import { motion } from "framer-motion";
import { Plus, Minus, Search, Trash2 } from "lucide-react";

export default function OrdersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);
      const [custRes, invRes] = await Promise.all([
        axios.get(`${API_URL}/customers/${user._id}`),
        axios.get(`${API_URL}/inventory/${user._id}`)
      ]);
      setCustomers(custRes.data);
      setInventory(invRes.data);
      if(custRes.data.length > 0) setSelectedCustomerId(custRes.data[0]._id);
    } catch (e) {
      console.error(e);
    }
  };

  const addToCart = (item: any) => {
    setCart(prev => {
      const exists = prev.find(i => i.itemId === item._id);
      if (exists) return prev.map(i => i.itemId === item._id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { itemId: item._id, itemName: item.itemName, price: item.price, qty: 1 }];
    });
  };

  const updateCartQty = (itemId: string, delta: number) => {
    setCart(prev => prev.map(i => {
       if (i.itemId === itemId && i.qty + delta > 0) return { ...i, qty: i.qty + delta };
       return i;
    }));
  };

  const total = cart.reduce((acc, curr) => acc + (curr.price * curr.qty), 0);
  const pending = total > paidAmount ? total - paidAmount : 0;

  const handleCheckout = async () => {
    if (cart.length === 0 || !selectedCustomerId) return alert("Select customer & add items.");
    setLoading(true);
    try {
      const userStr = localStorage.getItem("user");
      const user = JSON.parse(userStr!);
      await axios.post(`${API_URL}/orders`, {
        userId: user._id,
        customerId: selectedCustomerId,
        items: cart,
        paidAmount
      });
      alert("Order Generated! Udhaar recorded.");
      setCart([]);
      setPaidAmount(0);
    } catch (e) {
       alert("Error processing order");
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50 pb-[70px]">
      <header className="p-4 bg-white shadow-sm flex flex-col gap-2">
        <h1 className="text-xl font-black">New Order Bill</h1>
        <select 
          className="w-full bg-gray-100 p-3 rounded-lg text-sm outline-none font-bold" 
          value={selectedCustomerId} 
          onChange={e => setSelectedCustomerId(e.target.value)}
        >
           <option value="">-- Select Customer --</option>
           {customers.map(c => <option key={c._id} value={c._id}>{c.name} (Pending: ₹{c.pendingAmount})</option>)}
        </select>
      </header>

      <div className="flex-1 overflow-y-auto flex">
        {/* Inventory Selection */}
        <div className="w-1/2 border-r p-3 overflow-y-auto bg-white space-y-2">
          {inventory.map(item => (
             <div key={item._id} onClick={() => addToCart(item)} className="p-3 border border-gray-100 rounded-xl shadow-sm text-center cursor-pointer active:scale-95 bg-gray-50">
                <p className="font-bold text-sm line-clamp-1">{item.itemName}</p>
                <p className="text-green-600 font-bold text-xs mt-1">₹{item.price}</p>
             </div>
          ))}
        </div>

        {/* Cart */}
        <div className="w-1/2 p-3 bg-gray-50 flex flex-col relative h-full overflow-y-auto pb-[180px]">
          {cart.map(c => (
             <div key={c.itemId} className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 mb-2 relative">
                <p className="font-bold text-sm pr-6 leading-tight mb-1">{c.itemName}</p>
                <div className="flex items-center justify-between text-xs">
                   <span className="text-green-600 font-bold">₹{c.price}</span>
                   <div className="flex items-center gap-2 bg-gray-100 rounded px-1">
                      <button onClick={()=>updateCartQty(c.itemId, -1)} className="p-1"><Minus size={12}/></button>
                      <span className="font-bold">{c.qty}</span>
                      <button onClick={()=>updateCartQty(c.itemId, 1)} className="p-1"><Plus size={12}/></button>
                   </div>
                </div>
             </div>
          ))}
          
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-10 flex flex-col gap-1 text-sm font-semibold">
             <div className="flex justify-between"><span>Total Bill:</span> <span className="text-lg font-black">₹{total}</span></div>
             <div className="flex justify-between items-center text-blue-600">
                <span>Jamaa (Paid):</span> 
                <input type="number" className="w-20 bg-blue-50 border border-blue-200 text-right p-1 rounded font-bold" value={paidAmount} onChange={e=>setPaidAmount(Number(e.target.value))} />
             </div>
             <div className="flex justify-between text-red-500 mb-2"><span>Udhaar (Pending):</span> <span className="font-black">₹{pending}</span></div>
             <button onClick={handleCheckout} disabled={cart.length===0} className="w-full bg-blue-600 text-white font-black py-3 rounded-xl shadow-md active:scale-95 text-lg">Create Order</button>
          </div>
        </div>
      </div>
    </div>
  );
}
