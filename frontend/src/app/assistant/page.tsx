"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Send, Box, Sparkles, Check, CheckCheck } from "lucide-react";
import { API_URL } from "@/lib/config";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function AssistantPage() {
  const [messages, setMessages] = useState<{ role: "user" | "ai", text: string, suggestion?: string, time: string }[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const formatTime = () => {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  useEffect(() => {
    // Welcome message
    setMessages([{ 
      role: "ai", 
      text: "Namaste! Main Vyapar AI assistant hoon ✨ \n\nAap mujhse sales check karwa sakte hain, stock pooch sakte hain, ya grahak ko msg bhej sakte hain.\n\nBol kar try karein:\n👉 'Aaj profit kitna hua?'\n👉 'Sabko Udhaar ka WhatsApp reminder bhejo'", 
      time: formatTime() 
    }]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
       scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = 'hi-IN'; // Hindi synthesis
      window.speechSynthesis.speak(msg);
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;
    
    const userTime = formatTime();
    const newMsgs: {role: "user"|"ai", text:string, time: string}[] = [...messages, { role: "user", text, time: userTime }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : { _id: "debug" };
      
      const res = await axios.post(`${API_URL}/ai/query`, {
         userId: user._id,
         command: text
      });
      
      const aiReply = res.data.answer;
      const aiSuggestion = res.data.suggestion;
      
      setMessages(prev => [...prev, { role: "ai", text: aiReply, suggestion: aiSuggestion, time: formatTime() }]);
      speak(aiReply + (aiSuggestion ? ". " + aiSuggestion : "")); 
      
    } catch (e) {
      setMessages([...newMsgs, { role: "ai", text: "Maaf kijiye, kuch error aagaya. Network check karein.", time: formatTime() }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Mocking speech delay
      setTimeout(() => {
        setIsRecording(false);
        const mockQuery = "Aaj ka total sales kitna hai?";
        handleSend(mockQuery);
      }, 2500);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[#EFEAE2] pb-[70px] font-sans relative">
      <div className="absolute inset-0 bg-[url('https://i.ibb.co/3s1f1b2/whatsapp-bg.png')] opacity-20 pointer-events-none mix-blend-multiply"></div>
      
      <header className="px-4 py-3 bg-[#075E54] text-white shadow-md sticky top-0 z-20 flex items-center gap-4">
        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
          <Sparkles size={20} className="text-yellow-300" />
        </div>
        <div>
           <h1 className="font-bold text-lg leading-tight">Vyapar AI</h1>
           <p className="text-xs text-green-200 font-medium">always online</p>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 relative z-10 w-full max-w-2xl mx-auto">
        <AnimatePresence>
          {messages.map((m, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              key={idx} 
              className={`flex flex-col w-full ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
               <div className={`p-3 rounded-2xl max-w-[85%] shadow-sm relative whitespace-pre-wrap ${
                 m.role === 'user' 
                 ? 'bg-[#DCF8C6] text-[#075E54] rounded-tr-sm' 
                 : 'bg-white text-gray-800 rounded-tl-sm'
               }`}>
                 <p className="text-[15px] font-medium leading-snug">{m.text}</p>
                 {m.suggestion && (
                   <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2 shadow-inner">
                      <Sparkles size={16} className="text-yellow-600 mt-0.5 shrink-0" />
                      <p className="text-sm font-semibold text-yellow-800 leading-snug">{m.suggestion}</p>
                   </div>
                 )}
                 <div className={`flex justify-end items-center gap-1 mt-1 ${m.role === 'user' ? 'text-green-700/60' : 'text-gray-400'}`}>
                    <span className="text-[10px] uppercase font-bold">{m.time}</span>
                    {m.role === 'user' && <CheckCheck size={14} className="text-[#34B7F1]" />}
                 </div>
               </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className="p-4 rounded-2xl bg-white shadow-sm rounded-tl-sm h-12 flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={scrollRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-[#F0F0F0] flex gap-2 items-end relative z-20">
        <div className="flex-1 bg-white rounded-3xl flex items-center px-4 py-2 min-h-[50px] shadow-sm">
           <input 
             type="text" 
             value={input}
             onChange={e => setInput(e.target.value)}
             placeholder="Message AI..." 
             className="w-full bg-transparent outline-none text-[15px] placeholder:text-gray-500 font-medium"
             onKeyDown={e => e.key === 'Enter' && handleSend()}
           />
        </div>

        {input.trim() ? (
          <motion.button 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            onClick={() => handleSend()}
            className="w-[50px] h-[50px] bg-[#00A884] text-white rounded-full flex items-center justify-center shrink-0 shadow-md active:scale-90 transition-transform"
          >
            <Send size={20} className="ml-1" />
          </motion.button>
        ) : (
          <button 
            onClick={toggleRecording}
            className={`w-[50px] h-[50px] text-white rounded-full flex items-center justify-center shrink-0 shadow-md transition-all active:scale-90 ${
               isRecording ? 'bg-red-500 animate-pulse scale-110' : 'bg-[#00A884]'
            }`}
          >
            <Mic size={24} />
          </button>
        )}
      </div>

      {isRecording && (
        <div className="absolute inset-x-0 bottom-[74px] p-4 bg-red-500 text-white text-center text-sm font-bold z-30 animate-in slide-in-from-bottom-2">
          🎙️ Sunte hue... Kripya bolein...
        </div>
      )}
    </div>
  );
}
