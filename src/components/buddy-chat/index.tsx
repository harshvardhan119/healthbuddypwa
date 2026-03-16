"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, BrainCircuit, Activity, Target, User, Bot } from "lucide-react";
import { useHealth } from "@/lib/health-context";
import { buddyChat } from "@/lib/ai-engine";

export default function BuddyChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { data, chatWithBuddy, setChatResponse, updateProfile, getPlanDayNumber } = useHealth();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data.logs.chatHistory, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = message;
    setMessage("");
    setLoading(true);

    try {
      // 1. Log the user message locally
      await chatWithBuddy(userMessage);

      // 2. Get AI Response
      const response = await buddyChat(
        { 
          profile: data.profile, 
          mood: data.mood, 
          history: data.logs, 
          dayNumber: getPlanDayNumber(),
          totalDays: data.masterPlan?.totalDays
        },
        data.logs.chatHistory,
        userMessage
      );

      if (response) {
        // 3. Process updates if AI modified them
        if (response.updates?.profile) {
          updateProfile(response.updates.profile);
        }
        
        // 4. Log AI response
        setChatResponse(response.reply || "I didn't quite catch that. Try again?");
      }
    } catch (error) {
      console.error(error);
      setChatResponse("Internal system error. My neural links are fuzzy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <Bot size={28} className="relative z-10" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-emerald-500 rounded-full"
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            className="bg-white w-[380px] h-[600px] rounded-[40px] shadow-2xl flex flex-col overflow-hidden border border-black/5"
          >
            {/* Header */}
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center shrink-0">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center">
                    <BrainCircuit size={20} />
                 </div>
                 <div>
                   <h3 className="font-black text-sm">AI Health Buddy</h3>
                   <div className="flex items-center gap-1.5">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                     <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Neural Link Active</span>
                   </div>
                 </div>
               </div>
               <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                  <X size={18} />
               </button>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-slate-50/50">
               {data.logs.chatHistory.length === 0 && (
                 <div className="text-center py-12 space-y-4">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                       <Sparkles size={32} />
                    </div>
                    <p className="text-sm font-bold text-slate-400 max-w-[200px] mx-auto leading-relaxed uppercase tracking-tighter">
                       Ask me to edit your goal, report progress, or any health doubt.
                    </p>
                 </div>
               )}

               {data.logs.chatHistory.map((msg: any, i: number) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                 >
                    <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium ${
                      msg.role === 'user' 
                      ? 'bg-slate-900 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 shadow-sm border border-black/5 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                 </motion.div>
               ))}

               {loading && (
                 <div className="flex justify-start">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl rounded-tl-none flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                       <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                       <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                 </div>
               )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 bg-white border-t border-black/5 flex gap-2">
               <input 
                 value={message}
                 onChange={(e) => setMessage(e.target.value)}
                 disabled={loading}
                 placeholder="Type your command..."
                 className="flex-1 bg-slate-100 border-none rounded-2xl px-5 py-4 text-sm font-black focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-400"
               />
               <button 
                 type="submit" 
                 disabled={loading || !message.trim()}
                 className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center active:scale-90 transition-all shadow-lg disabled:opacity-50"
               >
                 <Send size={20} />
               </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
