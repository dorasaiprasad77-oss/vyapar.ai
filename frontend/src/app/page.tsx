import Link from "next/link";
import { ArrowRight, Mic, ShoppingBag, TrendingUp, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <header className="px-6 py-6 bg-white/80 backdrop-blur-md shadow-sm flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-black text-blue-700 uppercase tracking-tighter">Vyapar AI</h1>
        <Link href="/login" className="text-blue-600 font-semibold text-sm hover:underline">Login</Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in mt-12 mb-12">
        <div className="space-y-4 max-w-sm">
          <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
            Aapka Smart <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Business Assistant</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Bol kar bill banayein, stock check karein, aur profit badhayein!
          </p>
        </div>

        <Link
          href="/login"
          className="w-full max-w-xs bg-blue-600 active:bg-blue-700 text-white font-bold text-xl py-4 rounded-full shadow-xl shadow-blue-200 flex items-center justify-center gap-2 transform active:scale-95 transition-all hover:bg-blue-700"
        >
          Start For Free <ArrowRight />
        </Link>
        <p className="text-xs text-blue-800 bg-blue-100 px-3 py-1 rounded-full font-medium">Free trial available. ₹99/month later.</p>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-8">
          <FeatureCard icon={<Mic size={28} className="text-green-500" />} text="Voice AI" />
          <FeatureCard icon={<ShoppingBag size={28} className="text-blue-500" />} text="Easy Billing" />
          <FeatureCard icon={<TrendingUp size={28} className="text-purple-500" />} text="Sales Insights" />
          <FeatureCard icon={<ShieldCheck size={28} className="text-emerald-500" />} text="Secure Data" />
        </div>
      </main>

      <footer className="p-4 text-center text-xs text-gray-400 bg-white border-t border-gray-100">
        © 2026 Vyapar AI. Built for India.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-md shadow-gray-100 border border-gray-100/50 flex flex-col items-center justify-center gap-3 transition-transform hover:scale-105 cursor-pointer">
      <div className="p-3 bg-gray-50 rounded-full">{icon}</div>
      <span className="font-semibold text-gray-700 text-sm">{text}</span>
    </div>
  );
}
