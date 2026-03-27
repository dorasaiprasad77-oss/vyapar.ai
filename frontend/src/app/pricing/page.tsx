"use client";

import { Check, Star } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="p-4 pt-8 min-h-screen bg-white pb-24">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-black text-gray-900">Vyapar <span className="text-blue-600">Pro</span></h1>
        <p className="text-gray-500 mt-2 font-medium">Behtar service pane ke liye upgrade karein</p>
      </header>

      <div className="space-y-6">
        
        {/* Free Plan */}
        <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 shadow-sm">
           <p className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-2">Free Plan</p>
           <h2 className="text-4xl font-black text-gray-900 mb-6">₹0 <span className="text-lg text-gray-500 font-medium">/maha</span></h2>
           
           <div className="space-y-3 mb-8">
             <FeatureItem text="50 Bills/month" />
             <FeatureItem text="Basic Inventory" />
             <FeatureItem text="Text Assistant (No Voice)" />
           </div>

           <button className="w-full bg-gray-100 text-gray-600 font-bold py-4 rounded-xl active:bg-gray-200">Current Plan</button>
        </div>

        {/* Pro Plan */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 border-2 border-blue-400 rounded-3xl p-6 shadow-2xl shadow-blue-200 relative transform hover:-translate-y-1 transition-transform">
           <div className="absolute top-0 right-6 translate-y-[-50%] bg-amber-400 text-amber-900 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-wide">
             <Star size={12} className="fill-current" /> Most Popular
           </div>
           
           <p className="text-blue-200 font-bold uppercase tracking-wider text-sm mb-2">Vyapar Pro</p>
           <h2 className="text-4xl font-black text-white mb-6">₹199 <span className="text-base text-blue-200 font-medium">/maha</span></h2>
           
           <div className="space-y-3 mb-8 text-blue-50">
             <FeatureItem text="Unlimited Bills" color="text-white" />
             <FeatureItem text="Advanced Inventory + Alerts" color="text-white" />
             <FeatureItem text="Tap & Speak AI Actions" color="text-white" />
             <FeatureItem text="Khata Book Sync & Reminders" color="text-white" />
             <FeatureItem text="Export to GST Ready PDF" color="text-white" />
           </div>

           <button className="w-full bg-white text-blue-700 font-black text-lg py-4 rounded-xl shadow-[0_4px_14px_0_rgba(255,255,255,0.39)] hover:bg-gray-50 active:scale-95 transition-transform">Get Pro Version</button>
        </div>

      </div>
    </div>
  );
}

function FeatureItem({ text, color = "text-gray-600" }: { text: string, color?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-green-100 text-green-600 rounded-full p-1 shrink-0"><Check size={14} className="stroke-[3]" /></div>
      <span className={`font-semibold text-sm ${color}`}>{text}</span>
    </div>
  );
}
