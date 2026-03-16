"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-12 overflow-hidden relative bg-white">
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px] -z-10 animate-pulse" />

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="relative group cursor-pointer"
      >
        <div className="w-64 h-64 rounded-[80px] bg-white flex items-center justify-center relative shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-white group-hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] transition-all overflow-hidden">
          {/* High-End Animated Health Illustration */}
          <svg viewBox="0 0 200 200" className="w-48 h-48">
            {/* Pulsing Energy Background */}
            <motion.circle 
              cx="100" cy="100" r="80" 
              fill="rgba(16, 185, 129, 0.05)"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            {/* Central Heartbeat/Life Line */}
            <motion.path
              d="M40 100 H70 L85 60 L115 140 L130 100 H160"
              fill="none"
              stroke="#10b981"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            
            {/* Floating Health Icons with micro-animations */}
            {[
              { d: "M150 60 L170 60 M160 50 L160 70", color: "#3b82f6", delay: 0 },
              { d: "M30 50 Q 50 30 70 50", color: "#fbbf24", delay: 0.5 },
              { d: "M40 150 L60 170 L80 150", color: "#ef4444", delay: 1 }
            ].map((icon, i) => (
              <motion.path
                key={i}
                d={icon.d}
                stroke={icon.color}
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                animate={{ y: [-5, 5, -5], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, delay: icon.delay }}
              />
            ))}

            {/* Orbiting particles */}
            {[0, 120, 240].map((angle, i) => (
              <motion.circle
                key={i}
                r="4"
                fill="#10b981"
                animate={{ 
                  cx: 100 + Math.cos((angle * Math.PI) / 180) * 85,
                  cy: 100 + Math.sin((angle * Math.PI) / 180) * 85,
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  ease: "linear",
                  delay: i * 1.5
                }}
              />
            ))}
          </svg>
        </div>
        
        {/* Shadow Bloom */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-x-0 -bottom-8 h-12 bg-primary rounded-full blur-3xl -z-10 mx-auto w-3/4"
        />
      </motion.div>

      <div className="text-center space-y-6 relative z-10">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-6xl font-black tracking-tight text-foreground leading-[1.05]"
        >
          Your AI <br />
          <span className="text-primary italic">Success Buddy</span>
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground text-xl font-medium max-w-sm mx-auto leading-relaxed opacity-60"
        >
          Experience the pinnacle of personalized health tracking with predictive AI insights.
        </motion.p>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-xs space-y-6"
      >
        <Link href="/dashboard" className="block group">
          <button className="w-full bg-primary hover:bg-primary/90 text-white rounded-[30px] py-6 font-black text-xl shadow-[0_25px_50px_-12px_rgba(16,185,129,0.25)] transition-all hover:scale-[1.03] active:scale-[0.97] flex items-center justify-center gap-3">
            Begin Journey
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </Link>
        
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] opacity-30">
            <ShieldCheck size={16} /> 256-bit Secure Profile
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-primary">
            <Sparkles size={12} className="animate-pulse" /> Precision Engine v2.0
          </div>
        </div>
      </motion.div>
    </div>
  );
}
