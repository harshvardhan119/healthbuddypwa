"use client";

import { useState } from "react";
import { useHealth } from "@/lib/health-context";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, X } from "lucide-react";

export default function WeightLogger() {
  const { data, logWeight } = useHealth();
  const [isOpen, setIsOpen] = useState(false);
  const [weight, setWeight] = useState(data.profile.weight);

  const handleSave = () => {
    logWeight(weight);
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full bg-white/5 border border-white/10 rounded-3xl p-4 flex items-center justify-between group hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Scale size={20} />
          </div>
          <div className="text-left">
            <p className="text-xs font-bold opacity-40 uppercase">Current Weight</p>
            <p className="font-black text-lg">{data.profile.weight} kg</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
          <Scale size={16} />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-end justify-center p-4"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-[40px] p-8 space-y-8 pb-12"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black">Log Weight</h2>
                <button onClick={() => setIsOpen(false)} className="opacity-40"><X /></button>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="text-6xl font-black text-primary">{weight} <span className="text-2xl opacity-40">kg</span></div>
                <input 
                  type="range" 
                  min="40" 
                  max="200" 
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value))}
                  className="w-full h-4 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                />
              </div>

              <button 
                onClick={handleSave}
                className="w-full bg-primary text-white py-5 rounded-3xl font-black shadow-xl shadow-blue-900/40"
              >
                Save Progress
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
