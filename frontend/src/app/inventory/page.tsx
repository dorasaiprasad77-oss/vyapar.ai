"use client";

import { useState, useEffect } from "react";
import { PackageX, Plus, RefreshCw, Trash2, Edit2 } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/lib/config";

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ itemName: "", quantity: 0, price: 0, lowStockThreshold: 5 });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      const user = JSON.parse(userStr);
      const res = await axios.get(`${API_URL}/inventory/${user._id}`);
      setItems(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    try {
      const userStr = localStorage.getItem("user");
      const user = JSON.parse(userStr!);
      await axios.post(`${API_URL}/inventory`, { userId: user._id, ...formData });
      setModalOpen(false);
      setFormData({ itemName: "", quantity: 0, price: 0, lowStockThreshold: 5 });
      fetchInventory();
    } catch (e) {
      alert("Error adding item");
    }
  };

  const deleteItem = async (id: string) => {
    if(!confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_URL}/inventory/${id}`);
      fetchInventory();
    } catch (e) {
      alert("Error deleting item");
    }
  };

  return (
    <div className="p-4 pt-6 min-h-screen bg-gray-50 pb-24">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mera Stock</h1>
          <p className="text-sm text-gray-500">{items.length} items total</p>
        </div>
        <button onClick={() => fetchInventory()} className="p-2 bg-white rounded-full shadow-sm">
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </header>

      <button 
        onClick={() => setModalOpen(true)}
        className="w-full bg-blue-100 text-blue-700 font-bold border-2 border-dashed border-blue-300 py-4 rounded-xl flex items-center justify-center gap-2 mb-6 active:bg-blue-200 transition-colors"
      >
        <Plus /> Naya Invetory Jodein
      </button>

      <div className="space-y-3">
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : items.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100">
             <PackageX size={48} className="mx-auto text-gray-300 mb-2" />
             <p className="font-bold text-gray-500">Koi item nahi hai.</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                 <h3 className="font-bold text-gray-800">{item.itemName}</h3>
                 <div className="flex items-center gap-3 mt-1">
                   <span className="text-sm text-gray-600 font-medium bg-gray-100 px-2 py-0.5 rounded">₹{item.price}</span>
                   <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                     item.quantity <= item.lowStockThreshold ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                   }`}>
                     Stock: {item.quantity}
                   </span>
                 </div>
              </div>
              
              <div className="flex gap-2">
                 <button className="px-3 py-2 bg-gray-100 rounded-lg text-gray-600 active:scale-90"><Edit2 size={16}/></button>
                 <button onClick={() => deleteItem(item._id)} className="px-3 py-2 bg-rose-100 rounded-lg text-rose-600 active:scale-90"><Trash2 size={16}/></button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative animate-in zoom-in-95">
              <h2 className="text-xl font-bold mb-4">Add Item</h2>
              
              <div className="space-y-4">
                 <div>
                   <label className="text-sm font-semibold mb-1 block">Item Name</label>
                   <input type="text" className="w-full bg-gray-100 p-3 rounded-xl outline-none focus:ring-2 ring-blue-500" value={formData.itemName} onChange={e=>setFormData({...formData, itemName: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Price (₹)</label>
                      <input type="number" className="w-full bg-gray-100 p-3 rounded-xl outline-none" value={formData.price} onChange={e=>setFormData({...formData, price: Number(e.target.value)})} />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-1 block">Quantity</label>
                      <input type="number" className="w-full bg-gray-100 p-3 rounded-xl outline-none" value={formData.quantity} onChange={e=>setFormData({...formData, quantity: Number(e.target.value)})} />
                    </div>
                 </div>
              </div>

              <div className="flex gap-3 mt-6">
                 <button onClick={() => setModalOpen(false)} className="flex-1 py-3 bg-gray-200 font-bold rounded-xl text-gray-600">Cancel</button>
                 <button onClick={addItem} className="flex-1 py-3 bg-blue-600 font-bold rounded-xl text-white">Save Item</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
