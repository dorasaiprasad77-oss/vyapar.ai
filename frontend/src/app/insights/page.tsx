"use client";

import { LineChart, BarChart, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";

export default function InsightsPage() {
  return (
    <div className="p-4 pt-6 min-h-screen bg-gray-50 pb-24">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
        <p className="text-sm text-gray-500">Apne dhandhe ko aur tez badhayein</p>
      </header>

      <div className="space-y-4">
        {/* Mock Charts UI */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
           <div className="flex items-center justify-between pb-4 border-b border-gray-100">
             <div className="flex items-center gap-2 font-bold text-gray-800"><LineChart className="text-blue-500" /> Weekly Sales</div>
             <span className="text-sm font-bold text-green-500 bg-green-50 px-2 py-1 rounded-md">+15% vs last wk</span>
           </div>
           
           <div className="h-40 bg-gray-50 rounded-xl flex items-end justify-between p-3 gap-2">
              <div className="w-full bg-blue-200 rounded-t-sm" style={{height: '30%'}}></div>
              <div className="w-full bg-blue-300 rounded-t-sm" style={{height: '50%'}}></div>
              <div className="w-full bg-blue-400 rounded-t-sm" style={{height: '40%'}}></div>
              <div className="w-full bg-blue-500 rounded-t-sm" style={{height: '70%'}}></div>
              <div className="w-full bg-blue-500 rounded-t-sm shadow-lg shadow-blue-200" style={{height: '90%'}}></div>
              <div className="w-full bg-blue-400 rounded-t-sm" style={{height: '60%'}}></div>
              <div className="w-full bg-blue-300 rounded-t-sm" style={{height: '45%'}}></div>
           </div>
           <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase px-3">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
           </div>
        </div>

        {/* AI Recommendations */}
        <h3 className="font-bold text-gray-800 pt-2 text-lg">Smart Suggestions</h3>

        <div className="bg-gradient-to-r from-orange-50 to-rose-50 p-4 rounded-xl border border-orange-100 flex gap-4">
           <div className="bg-orange-100 text-orange-600 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
             <AlertTriangle size={20} />
           </div>
           <div>
              <p className="font-bold text-gray-900">Sugar ki demand badh rahi hai</p>
              <p className="text-sm text-gray-600 mt-1">Aapke paas sirf 5kg sugar bachi hai jo agle 2 din me khatam ho jayegi. Aaj hi order karein.</p>
           </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 flex gap-4">
           <div className="bg-green-100 text-green-600 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
             <Lightbulb size={20} />
           </div>
           <div>
              <p className="font-bold text-gray-900">Naya Offer Banayein</p>
              <p className="text-sm text-gray-600 mt-1">Oil par 5% discount dene se pichle maheene sales 2x badhi thi. Weekend par try karein!</p>
           </div>
        </div>
      </div>
    </div>
  );
}
