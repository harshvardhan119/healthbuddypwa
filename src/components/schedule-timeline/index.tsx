"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, X, Utensils, Dumbbell, Coffee, ChevronRight, Zap, Smile } from "lucide-react";

const TYPE_CONFIG: Record<string, {
  icon: React.ReactNode;
  bg: string;
  light: string;
  text: string;
  label: string;
  desc: string;
}> = {
  diet: {
    icon: <Utensils size={20} />,
    bg: "bg-teal-500",
    light: "bg-teal-50",
    text: "text-teal-600",
    label: "Nutrition",
    desc: "This is a meal or nutrition intake for your day.",
  },
  workout: {
    icon: <Dumbbell size={20} />,
    bg: "bg-emerald-500",
    light: "bg-emerald-50",
    text: "text-emerald-600",
    label: "Workout",
    desc: "Time to move your body and build strength!",
  },
  meal: {
    icon: <Coffee size={20} />,
    bg: "bg-teal-500",
    light: "bg-teal-50",
    text: "text-teal-600",
    label: "Meal",
    desc: "A planned meal to fuel your performance.",
  },
  activity: {
    icon: <Zap size={20} />,
    bg: "bg-indigo-500",
    light: "bg-indigo-50",
    text: "text-indigo-600",
    label: "Activity",
    desc: "A daily activity or movement session.",
  },
  routine: {
    icon: <Smile size={20} />,
    bg: "bg-blue-500",
    light: "bg-blue-50",
    text: "text-blue-600",
    label: "Wellness",
    desc: "A wellness habit or daily routine checkpoint.",
  },
};
const DEFAULT_CONFIG = {
  icon: <Clock size={20} />,
  bg: "bg-blue-500",
  light: "bg-blue-50",
  text: "text-blue-600",
  label: "Event",
  desc: "A scheduled task for your day.",
};

// Mini animated decorative SVG per type
function TimelineIllustration({ type }: { type: string }) {
  const t = type?.toLowerCase() || "routine";

  if (t === "workout") return (
    <svg viewBox="0 0 160 100" className="w-full h-full" fill="currentColor">
      <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <rect x="15" y="48" width="130" height="8" rx="4" opacity="0.6" />
        <rect x="10" y="38" width="18" height="28" rx="4" opacity="0.9" />
        <rect x="132" y="38" width="18" height="28" rx="4" opacity="0.9" />
      </motion.g>
      <circle cx="80" cy="30" r="12" opacity="0.7" />
      <line x1="80" y1="42" x2="80" y2="78" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      <line x1="80" y1="56" x2="60" y2="70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <line x1="80" y1="56" x2="100" y2="70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
    </svg>
  );

  if (t === "diet" || t === "meal") return (
    <svg viewBox="0 0 160 100" className="w-full h-full" fill="none" stroke="currentColor">
      <motion.path d="M50 70 Q80 20 110 70" strokeWidth="5" strokeLinecap="round"
        animate={{ d: ["M50 70 Q80 20 110 70", "M50 70 Q80 10 110 70", "M50 70 Q80 20 110 70"] }}
        transition={{ duration: 2.5, repeat: Infinity }} />
      <circle cx="80" cy="70" r="20" strokeWidth="4" />
      <motion.line x1="80" y1="50" x2="80" y2="30" strokeWidth="4" strokeLinecap="round"
        animate={{ rotate: [0, 30, 0, -30, 0] }} style={{ transformOrigin: "80px 50px" }}
        transition={{ duration: 2.5, repeat: Infinity }} />
    </svg>
  );

  if (t === "activity") return (
    <svg viewBox="0 0 160 100" className="w-full h-full" fill="currentColor">
      <motion.circle cx="80" cy="50" r="8" animate={{ y: [0, -20, 0] }} transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }} />
      <motion.path d="M60 80 L80 30 L100 80" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
        animate={{ pathLength: [0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
    </svg>
  );

  // routine / default: a gentle pulse
  return (
    <svg viewBox="0 0 160 100" className="w-full h-full">
      <motion.circle cx="80" cy="50" r="20" fill="currentColor" opacity="0.6"
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.3, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
      {[30, 40].map((r, i) => (
        <motion.circle key={i} cx="80" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.2"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }} />
      ))}
    </svg>
  );
}

export default function ScheduleTimeline({ schedule }: { schedule: any[] }) {
  const [selected, setSelected] = useState<any | null>(null);

  if (!schedule || schedule.length === 0) return null;

  return (
    <>
      <section className="space-y-3">
        <h3 className="text-xs uppercase font-black opacity-40 px-1 tracking-widest">Daily Timeline</h3>

        <div className="space-y-3 relative">
          {/* Vertical connecting line */}
          <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-black/5" />

          {schedule.map((item, idx) => {
            const cfg = TYPE_CONFIG[item.type?.toLowerCase()] || DEFAULT_CONFIG;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06, type: "spring", stiffness: 220, damping: 22 }}
                onClick={() => setSelected(item)}
                className="flex gap-3 relative z-10 group cursor-pointer"
              >
                {/* Time icon */}
                <div className={`w-12 h-12 rounded-2xl ${cfg.bg} text-white flex items-center justify-center shrink-0 shadow-lg transition-transform group-active:scale-95`}>
                  {cfg.icon}
                </div>

                {/* Card */}
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-white rounded-[22px] px-5 py-3.5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">{item.time}</span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${cfg.light} ${cfg.text}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="font-bold text-sm truncate">{item.task}</p>
                  </div>
                  <ChevronRight size={16} className="opacity-20 shrink-0 group-hover:opacity-60 transition-opacity" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── Detail Bottom Sheet ─── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-end justify-center"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-lg rounded-t-[40px] overflow-hidden shadow-2xl"
            >
              {/* Colored hero header */}
              {(() => {
                const cfg = TYPE_CONFIG[selected.type?.toLowerCase()] || DEFAULT_CONFIG;
                return (
                  <>
                    <div className={`${cfg.bg} px-8 pt-8 pb-6 relative overflow-hidden`}>
                      <button onClick={() => setSelected(null)}
                        className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">
                        <X size={18} />
                      </button>

                      {/* Decorative rings */}
                      <motion.div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10"
                        animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 4, repeat: Infinity }} />
                      <motion.div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/5" />

                      {/* Animated illustration */}
                      <div className="w-40 h-28 mx-auto text-white my-2">
                        <TimelineIllustration type={selected.type} />
                      </div>

                      <div className="text-center relative z-10 mt-2">
                        <span className="inline-block bg-white/20 text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-2">
                          {selected.time}
                        </span>
                        <h2 className="text-white font-black text-2xl leading-tight">{selected.task}</h2>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="px-8 pt-6 pb-8 space-y-5">
                      {/* Category chip */}
                      <div className={`inline-flex items-center gap-2 ${cfg.light} ${cfg.text} px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider`}>
                        {cfg.icon} {cfg.label}
                      </div>

                      {/* Description */}
                      <div className={`${cfg.light} rounded-[20px] p-5`}>
                        <p className={`text-sm font-semibold ${cfg.text} leading-relaxed`}>{cfg.desc}</p>
                      </div>

                      {/* Fun fact / tip */}
                      <div className="bg-black/3 rounded-[20px] p-4 flex gap-3 items-start">
                        <div className={`w-8 h-8 ${cfg.bg} text-white rounded-xl flex items-center justify-center shrink-0`}>
                          <Zap size={14} />
                        </div>
                        <p className="text-sm font-semibold opacity-60 leading-relaxed">
                          Sticking to your schedule builds powerful daily habits. Your AI buddy has placed this at the optimal time for your body.
                        </p>
                      </div>

                      {/* Done button */}
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelected(null)}
                        className={`w-full py-4 rounded-[20px] font-black text-sm text-white shadow-xl ${cfg.bg}`}
                      >
                        Got it, closing!
                      </motion.button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
