"use client";

import { useState } from "react";
import { useHealth } from "@/lib/health-context";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Scale, Smile, Frown, Meh, CheckCircle2, X } from "lucide-react";

export default function DailyCheckinModal() {
  const { showCheckin, setShowCheckin, submitDailyCheckin, data } = useHealth();
  const [mood, setMood] = useState("good");
  const [weight, setWeight] = useState(data.profile.weight);
  const [summary, setSummary] = useState("");

  const moods = [
    { value: "bad", icon: <Frown size={28} />, label: "Tough Day", color: "text-rose-500 bg-rose-50" },
    { value: "okay", icon: <Meh size={28} />, label: "Okay", color: "text-blue-500 bg-blue-50" },
    { value: "good", icon: <Smile size={28} />, label: "Great!", color: "text-emerald-500 bg-emerald-50" },
  ];

  const handleSubmit = () => {
    submitDailyCheckin({ mood, weight, summary });
  };

  return (
    <AnimatePresence>
      {showCheckin && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-end justify-center p-4"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="w-full max-w-md bg-white rounded-[32px] p-8 space-y-6 shadow-2xl"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Moon size={20} />
                </div>
                <div>
                  <h3 className="font-black text-lg">Daily Check-in</h3>
                  <p className="text-[10px] font-bold uppercase opacity-40 tracking-widest">10 PM Review</p>
                </div>
              </div>
              <button onClick={() => setShowCheckin(false)} className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                <X size={14} />
              </button>
            </div>

            {/* Mood Selection */}
            <div className="space-y-3">
              <p className="text-xs font-black uppercase opacity-40">How was your day?</p>
              <div className="flex gap-3">
                {moods.map(m => (
                  <button
                    key={m.value}
                    onClick={() => setMood(m.value)}
                    className={`flex-1 p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 ${
                      mood === m.value ? `border-current ${m.color}` : 'border-transparent bg-black/5'
                    }`}
                  >
                    {m.icon}
                    <span className="text-[10px] font-black uppercase">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Weight Update */}
            <div className="space-y-2">
              <p className="text-xs font-black uppercase opacity-40 flex items-center gap-2"><Scale size={12} /> Tonight's Weight</p>
              <div className="flex items-center gap-3 bg-black/5 rounded-2xl p-4">
                <input
                  type="number"
                  value={weight}
                  onChange={e => setWeight(Number(e.target.value))}
                  className="bg-transparent outline-none font-black text-2xl w-20"
                  step="0.1"
                />
                <span className="text-sm font-bold opacity-40">kg</span>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <p className="text-xs font-black uppercase opacity-40">Quick Notes (optional)</p>
              <textarea
                placeholder="What went well? What to improve tomorrow?"
                value={summary}
                onChange={e => setSummary(e.target.value)}
                className="w-full bg-black/5 rounded-2xl p-4 text-sm font-medium outline-none resize-none h-20"
              />
            </div>

            {/* Progress Summary */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-blue-50 p-3 rounded-2xl">
                <p className="text-lg font-black text-blue-600">{data.dailyProgress.steps.toLocaleString()}</p>
                <p className="text-[9px] font-bold uppercase opacity-40">Steps</p>
              </div>
              <div className="bg-cyan-50 p-3 rounded-2xl">
                <p className="text-lg font-black text-cyan-600">{data.dailyProgress.waterGlass}</p>
                <p className="text-[9px] font-bold uppercase opacity-40">Water</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-2xl">
                <p className="text-lg font-black text-emerald-600">{data.dailyProgress.mealsCompleted.length}/4</p>
                <p className="text-[9px] font-bold uppercase opacity-40">Meals</p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-primary text-white py-5 rounded-[24px] font-black text-sm shadow-2xl shadow-primary/25 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <CheckCircle2 size={18} /> Submit Check-in
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
