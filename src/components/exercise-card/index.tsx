"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHealth } from "@/lib/health-context";
import { 
  Dumbbell, 
  RotateCcw, 
  Flame, 
  X, 
  Wind, 
  Zap, 
  Activity, 
  Smile, 
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  ChevronRight
} from "lucide-react";

const TYPE_META: Record<string, { color: string; bg: string; shadow: string; icon: React.ReactNode; muscles: string }> = {
  cardio:     { color: "text-blue-500",    bg: "bg-blue-500",    shadow: "shadow-blue-500/30", icon: <Wind size={28} />,    muscles: "Heart, Lungs, Legs" },
  resistance: { color: "text-indigo-500",  bg: "bg-indigo-500",  shadow: "shadow-indigo-500/30", icon: <Dumbbell size={28} />, muscles: "Full Body, Core" },
  strength:   { color: "text-emerald-500", bg: "bg-emerald-500", shadow: "shadow-emerald-500/30", icon: <Zap size={28} />,      muscles: "Targeted Muscles" },
  stretching: { color: "text-purple-500",  bg: "bg-purple-500",  shadow: "shadow-purple-500/30", icon: <Activity size={28} />, muscles: "Flexibility, Joints" },
  mobility:   { color: "text-teal-500",    bg: "bg-teal-500",    shadow: "shadow-teal-500/30", icon: <Dumbbell size={28} />,   muscles: "Range of Motion" },
  hiit:       { color: "text-rose-500",    bg: "bg-rose-500",    shadow: "shadow-rose-500/30", icon: <Zap size={28} />,      muscles: "Full Body, HIIT" },
  yoga:       { color: "text-violet-500",  bg: "bg-violet-500",  shadow: "shadow-violet-500/30", icon: <Activity size={28} />, muscles: "Core, Balance" },
};

const DEFAULT_META = { color: "text-slate-500", bg: "bg-slate-500", shadow: "shadow-slate-500/20", icon: <Dumbbell size={28} />, muscles: "Active Muscles" };

function ExerciseIllustration({ type }: { type: string }) {
  const t = type?.toLowerCase() || "";
  if (t.includes("cardio") || t.includes("hiit") || t.includes("run") || t.includes("cycle")) {
    return (
      <svg viewBox="0 0 200 160" className="w-full h-full">
        <motion.circle cx="100" cy="80" r="40" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.2"
          animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        <motion.path d="M60 100 L80 60 L120 100 L140 60" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" 
          animate={{ pathLength: [0, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
        <circle cx="140" cy="60" r="10" fill="currentColor" />
      </svg>
    );
  }
  if (t.includes("stretch") || t.includes("mobility") || t.includes("yoga") || t.includes("flow")) {
    return (
      <svg viewBox="0 0 200 160" className="w-full h-full" fill="none" stroke="currentColor">
        <motion.path d="M40 120 Q100 20 160 120" strokeWidth="8" strokeLinecap="round"
          animate={{ d: ["M40 120 Q100 20 160 120", "M40 120 Q100 60 160 120", "M40 120 Q100 20 160 120"] }} transition={{ duration: 3, repeat: Infinity }} />
        <circle cx="100" cy="40" r="12" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full" fill="currentColor">
      <rect x="40" y="70" width="120" height="10" rx="5" opacity="0.3" />
      <motion.g animate={{ y: [0, -20, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
        <rect x="20" y="50" width="30" height="50" rx="8" />
        <rect x="150" y="50" width="30" height="50" rx="8" />
        <rect x="50" y="65" width="100" height="20" rx="4" />
      </motion.g>
    </svg>
  );
}

export default function ExerciseCard({ exercise }: { exercise: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const { toggleExercise } = useHealth();
  
  const typeKey = Object.keys(TYPE_META).find(k => exercise.type?.toLowerCase().includes(k)) || "";
  const meta = TYPE_META[typeKey] || DEFAULT_META;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleExercise(exercise.name);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className={`bg-white rounded-[40px] overflow-hidden transition-all cursor-pointer relative border-2 ${
          exercise.completed ? "border-emerald-500/10 opacity-60" : "border-white shadow-sm hover:border-black/5"
        }`}
      >
        <div className="p-6 flex items-center gap-6">
          <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center shrink-0 shadow-lg ${meta.shadow} ${
            exercise.completed ? "bg-emerald-500" : exercise.isCompensatory ? "bg-red-500" : meta.bg
          } text-white relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-10 transform scale-150 rotate-12"><ExerciseIllustration type={exercise.type} /></div>
            <div className="relative z-10">{exercise.completed ? <CheckCircle2 size={32} /> : meta.icon}</div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[9px] font-black uppercase tracking-widest ${meta.color}`}>{exercise.type}</span>
              {exercise.isCompensatory && <span className="text-[8px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">Penalty</span>}
            </div>
            <h3 className={`text-xl font-black leading-tight truncate ${exercise.completed ? "line-through opacity-30" : ""}`}>{exercise.name}</h3>
            <div className="flex items-center gap-3 mt-1.5 opacity-30 text-[10px] font-bold uppercase tracking-widest">
               <span>{exercise.sets} Sets</span>
               <div className="w-1 h-1 bg-black rounded-full" />
               <span>{exercise.reps} Reps</span>
            </div>
          </div>

          <button onClick={handleToggle} className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all ${exercise.completed ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20" : "bg-slate-50 text-slate-300 hover:bg-emerald-50 hover:text-emerald-500"}`}>
            {exercise.completed ? <CheckCircle2 size={24} /> : <ChevronRight size={24} />}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-2xl rounded-[56px] overflow-hidden shadow-2xl relative"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                 <div className={`h-64 md:h-full ${exercise.completed ? "bg-emerald-500" : exercise.isCompensatory ? "bg-red-500" : meta.bg} flex items-center justify-center relative`}>
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                       <svg className="w-full h-full" viewBox="0 0 100 100"><pattern id="gridDet" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" /></pattern><rect width="100" height="100" fill="url(#gridDet)" /></svg>
                    </div>
                    <div className="w-64 h-64 text-white p-12 transition-transform duration-700 hover:scale-110"><ExerciseIllustration type={exercise.type} /></div>
                    <button onClick={() => setIsOpen(false)} className="md:hidden absolute top-8 right-8 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white"><X size={24} /></button>
                 </div>

                 <div className="p-10 md:p-14 space-y-10">
                    <button onClick={() => setIsOpen(false)} className="hidden md:flex absolute top-10 right-10 w-12 h-12 rounded-2xl bg-slate-50 items-center justify-center text-slate-300 hover:text-black transition-colors"><X size={24} /></button>
                    
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <span className={`${meta.color} bg-black/5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest`}>{exercise.type}</span>
                          {exercise.isCompensatory && <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Extra Load</span>}
                       </div>
                       <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">{exercise.name}</h2>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                       {[
                         { label: "Sets", value: exercise.sets, icon: <Activity className="text-emerald-500" /> },
                         { label: "Reps", value: exercise.reps, icon: <RotateCcw className="text-indigo-500" /> },
                         { label: "Kcal", value: exercise.calories, icon: <Flame className="text-orange-500" /> }
                       ].map((s,i) => (
                         <div key={i} className="bg-slate-50 p-5 rounded-[32px] border border-slate-100 flex flex-col items-center text-center">
                            <div className="mb-2">{s.icon}</div>
                            <p className="text-xl font-black">{s.value}</p>
                            <p className="text-[10px] font-black uppercase opacity-20 tracking-widest">{s.label}</p>
                         </div>
                       ))}
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[40px] relative overflow-hidden">
                       <Smile size={60} className="absolute -bottom-4 -right-4 text-emerald-500/10" />
                       <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-2">Neural Guidance</p>
                       <p className="text-sm font-bold text-emerald-900/70 leading-relaxed italic">
                          {exercise.isCompensatory ? "Strategic deviation detected! This movement compensates for earlier dietary intake to maintain stasis." : "Bio-feedback indicates you're scaling well. Maintain consistent tension throughout the full range of motion."}
                       </p>
                    </div>

                    <button onClick={handleToggle} className={`w-full py-6 rounded-[32px] font-black text-lg flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 ${exercise.completed ? 'bg-slate-100 text-slate-400' : 'bg-emerald-500 text-white shadow-emerald-500/30 hover:bg-emerald-400'}`}>
                       {exercise.completed ? <><RotateCcw size={24} /> RE-INITIATE</> : <><CheckCircle2 size={24} /> FINALIZE MISSION</>}
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
