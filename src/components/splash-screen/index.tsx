"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onFinish, 1000); // Allow exit animation to finish
    }, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-8 overflow-hidden"
        >
          {/* Animated Background Orbs */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-[-20%] right-[-20%] w-[80%] h-[80%] bg-primary/5 rounded-full blur-[100px]" 
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute bottom-[-20%] left-[-20%] w-[80%] h-[80%] bg-secondary/5 rounded-full blur-[100px]" 
          />

          <div className="relative">
            {/* Pulsing Outer Ring */}
            <motion.div 
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-10 border-2 border-primary/20 rounded-full"
            />
            
            {/* Core Logo Illustration */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 10, delay: 0.2 }}
              className="w-40 h-40 bg-white rounded-[50px] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.1)] flex items-center justify-center border border-white relative z-10"
            >
              <svg viewBox="0 0 200 200" className="w-24 h-24 text-primary">
                <motion.path
                  d="M100 20 C60 20 20 60 20 100 C20 140 60 180 100 180 C140 180 180 140 180 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="100" cy="100" r="30"
                  fill="currentColor"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                />
              </svg>
            </motion.div>
          </div>

          <div className="mt-12 text-center space-y-3 z-10">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-3xl font-black tracking-tight"
            >
              AI Health <span className="text-primary italic">Buddy</span>
            </motion.h2>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.4 }}
               transition={{ delay: 1.2 }}
               className="flex items-center justify-center gap-2 text-[10px] uppercase font-black tracking-[0.3em]"
            >
               <Sparkles size={12} /> Syncing Wellness
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
