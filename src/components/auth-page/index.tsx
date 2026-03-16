"use client";

import { useState } from "react";
import { useHealth } from "@/lib/health-context";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, User, ArrowRight } from "lucide-react";

export default function AuthPage({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const { login } = useHealth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    setLoading(true);
    await login(email, name);
    onAuthSuccess();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 space-y-12">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center space-y-4"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-[30px] flex items-center justify-center text-primary mx-auto mb-6">
          <ShieldCheck size={40} />
        </div>
        <h1 className="text-4xl font-black tracking-tight">Setup Your <br /><span className="text-primary italic">Buddy Profile</span></h1>
        <p className="text-muted-foreground font-medium max-w-[260px] mx-auto opacity-60">To sync your health journey and provide precision AI coaching.</p>
      </motion.div>

      <motion.form 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6"
      >
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground opacity-40" size={18} />
            <input 
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-secondary/50 border border-black/5 rounded-[24px] py-4 pl-12 pr-4 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground opacity-40" size={18} />
            <input 
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-secondary/50 border border-black/5 rounded-[24px] py-4 pl-12 pr-4 font-bold text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={loading || !email || !name}
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-[24px] py-5 font-black text-lg shadow-2xl shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50 disabled:scale-100"
        >
          {loading ? "Syncing..." : "Start My Journey"}
          {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
        </button>
      </motion.form>

      <p className="text-[10px] uppercase font-black tracking-[0.3em] opacity-30">
        Secured with End-to-End Encryption
      </p>
    </div>
  );
}
