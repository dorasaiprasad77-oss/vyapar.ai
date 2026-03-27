"use client";

import { useState, useEffect } from "react";
import { Plus, Minus, Search, Trash2, IndianRupee } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/lib/config";

export default function BillingPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [customerInfo, setCustomerInfo] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);
      const res = await axios.get(`${API_URL}/inventory/${user._id}`);
      setInventory(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const addToCart = (item: any) => {
    setCart(prev => {
      const exists = prev.find(i => i.itemId === item._id);
      if (exists) {
        return prev.map(i => i.itemId === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { itemId: item._id, itemName: item.itemName, price: item.price, quantity: 1, maxQty: item.quantity }];
    });
  };

  const updateCartQty = (itemId: string, delta: number) => {
    setCart(prev => prev.map(i => {
       if (i.itemId === itemId) {
          const nq = i.quantity + delta;
          if (nq > 0 && nq <= i.maxQty) return { ...i, quantity: nq };
       }
       return i;
    }));
  };

  const removeCartItem = (itemId: string) => {
    setCart(prev => prev.filter(i => i.itemId !== itemId));
  };

  const total = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const gst = total * 0.18; // 18% mock GST
  const grandTotal = total + gst;

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Cart khaali hai");
    setLoading(true);
    try {
      const userStr = localStorage.getItem("user");
      const user = JSON.parse(userStr!);
      
      await axios.post(`${API_URL}/sales`, {
        userId: user._id,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        items: cart,
        paymentMethod: "cash"
      });
      alert("Bill successfully ban gaya!");
      setCart([]);
      setCustomerInfo({ name: "", phone: "" });
      fetchInventory(); // refresh stock
    } catch (e: any) {
       alert(e.response?.data?.error || "Error generating bill");
    } finally {
       setLoading(false);
    }
  };

  const filteredItems = inventory.filter(i => i.itemName.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50 pb-[70px]">
      <header className="p-4 bg-white shadow-sm flex items-center gap-3">
        <h1 className="text-xl font-bold">New Bill (GST Ready)</h1>
      </header>

      <div className="p-4 bg-white border-b">
        <div className="flex gap-2">
            <input type="text" placeholder="Grahak Ka Naam (Optional)" className="w-1/2 bg-gray-100 p-3 rounded-lg text-sm outline-none" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} />
            <input type="tel" placeholder="Mobile Number" className="w-1/2 bg-gray-100 p-3 rounded-lg text-sm outline-none" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex">
        {/* Item Selection */}
        <div className="w-1/2 border-r p-3 overflow-y-auto">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search Items..." 
              className="w-full bg-gray-100 pl-9 pr-3 py-3 rounded-xl text-sm outline-none focus:ring-1 ring-blue-500"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            {filteredItems.map(item => (
              <div key={item._id} onClick={() => addToCart(item)} className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm active:scale-95 transition-transform flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500 hover:shadow-md">
                 <span className="font-bold text-gray-800 text-sm line-clamp-1">{item.itemName}</span>
                 <span className="text-green-600 font-bold mt-1">₹{item.price}</span>
                 <span className="text-[10px] text-gray-400 mt-1 uppercase">Stock: {item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Cart */}
        <div className="w-1/2 p-3 bg-gray-50 flex flex-col h-full relative overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm font-medium">Add items forward</div>
          ) : (
             <div className="space-y-3 pb-[140px]">
               {cart.map(c => (
                 <div key={c.itemId} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2 relative group">
                   <div className="flex justify-between items-start">
                      <span className="font-bold text-sm text-gray-800 leading-tight pr-6">{c.itemName}</span>
                      <button onClick={()=>removeCartItem(c.itemId)} className="text-red-500 bg-red-50 p-1 rounded hover:bg-red-100 absolute top-2 right-2"><Trash2 size={14}/></button>
                   </div>
                   <div className="flex items-center justify-between mt-1">
                      <span className="text-green-600 font-bold text-sm">₹{c.price}</span>
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                         <button onClick={()=>updateCartQty(c.itemId, -1)} className="bg-white p-1 rounded shadow-sm shrink-0 active:scale-90"><Minus size={14}/></button>
                         <span className="font-bold text-sm w-4 text-center">{c.quantity}</span>
                         <button onClick={()=>updateCartQty(c.itemId, 1)} className="bg-white p-1 rounded shadow-sm shrink-0 active:scale-90"><Plus size={14}/></button>
                      </div>
                   </div>
                 </div>
               ))}
             </div>
          )}
          
          {/* Checkout Banner */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-3 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-10 flex flex-col gap-2">
            <div className="flex justify-between text-xs font-bold text-gray-500">
               <span>Subtotal</span>
               <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
               <span>GST (18%)</span>
               <span>₹{gst.toFixed(2)}</span>
            </div>
            <button onClick={handleCheckout} disabled={cart.length===0||loading} className="w-full bg-blue-600 text-white font-black text-lg py-4 rounded-xl shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
              Pay ₹{grandTotal.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
