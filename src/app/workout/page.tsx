"use client";

import { useHealth } from "@/lib/health-context";
import { getAIPlanning } from "@/lib/ai-engine";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ExerciseCard from "@/components/exercise-card";
import { 
  Dumbbell, 
  Zap, 
  Thermometer, 
  Smile,
  Loader2,
  Calendar,
  Settings,
  Play,
  Square,
  Pause,
  Timer,
  Activity,
  Flame,
  Footprints,
  Briefcase,
  AlertCircle,
  Clock,
  ChevronRight,
  TrendingUp,
  BrainCircuit
} from "lucide-react";
import Link from "next/link";

export default function WorkoutPage() {
  const { 
    data, getPlanDayNumber, updateMood, setDailyPlan, 
    startTracker, stopTracker, pauseTracker, toggleMinimumMode 
  } = useHealth();
  const [autoGenerating, setAutoGenerating] = useState(false);

  const dayNumber = getPlanDayNumber();
  const totalDays = data.masterPlan?.totalDays || (data.profile.targetTimeline * 7);
  const hasActivePlan = data.masterPlan?.isActive && data.dailyPlan;

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const autoGenerate = async () => {
      if (!data.masterPlan?.isActive) return;
      const lastUpdated = data.dailyProgress?.lastUpdated;
      if (lastUpdated === today || autoGenerating) return;
      setAutoGenerating(true);
      try {
        const plan = await getAIPlanning({
          profile: data.profile,
          mood: data.mood,
          history: data.logs,
          dayNumber,
          totalDays,
        });
        if (plan) setDailyPlan({ ...plan, _generatedDate: today });
      } catch (e) {
        console.error("Auto-generate failed:", e);
      }
      setAutoGenerating(false);
    };
    if (data.masterPlan?.isActive && data.dailyPlan?._generatedDate !== today) autoGenerate();
  }, [data.masterPlan?.isActive, data.dailyPlan?._generatedDate]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  const moods = [
    { label: "Stress", name: "stress", icon: <Thermometer size={16} /> },
    { label: "Energy", name: "energy", icon: <Zap size={16} /> },
    { label: "Motivation", name: "motivation", icon: <Smile size={16} /> },
  ];

  const currentExercises = data.dailyPlan?.workout?.exercises;

  return (
    <div className="space-y-8 pb-32">
      {/* Header and Tracker Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Tracker */}
        <div className="bg-slate-900 rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[400px]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -mr-48 -mt-48" />
          
          <div className="relative z-10 flex justify-between items-start">
             <div>
                <h1 className="text-4xl font-black italic text-emerald-400">Tactical <br />Session</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mt-1">Movement Tracking Engaged</p>
             </div>
             {data.activeWorkout?.isRunning && (
                <div className={`flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-md border ${data.activeWorkout.isPaused ? 'bg-amber-500/20 border-amber-500/30 text-amber-500' : 'bg-red-500/20 border-red-500/30 text-red-500'}`}>
                   <div className={`w-2.5 h-2.5 rounded-full ${data.activeWorkout.isPaused ? 'bg-amber-500' : 'bg-red-500 animate-pulse'}`} />
                   <span className="text-[10px] font-black uppercase tracking-widest">{data.activeWorkout.isPaused ? 'Session Paused' : 'Live Tracking'}</span>
                </div>
             )}
          </div>

          <div className="relative z-10 text-center py-8">
             <h3 className={`text-8xl font-black font-mono tracking-tighter ${data.activeWorkout?.isPaused ? 'opacity-30' : ''}`}>
               {data.activeWorkout ? formatTime(data.activeWorkout.elapsed) : "00:00"}
             </h3>
             <div className="flex justify-center gap-4 mt-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/60 border border-emerald-500/20 px-4 py-1.5 rounded-full">
                  {data.activeWorkout?.type || "Idle Status"}
                </p>
             </div>
          </div>

          <div className="relative z-10 flex gap-4">
            {!data.activeWorkout ? (
              <button 
                onClick={() => startTracker('running')}
                className="flex-1 bg-white text-slate-900 py-6 rounded-[28px] font-black text-sm shadow-xl hover:bg-emerald-400 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <Play size={20} fill="currentColor" /> INITIATE COMMAND
              </button>
            ) : (
              <>
                <button 
                  onClick={pauseTracker}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-6 rounded-[28px] font-black text-sm border border-white/10 flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  {data.activeWorkout.isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
                  {data.activeWorkout.isPaused ? "RESUME" : "PAUSE"}
                </button>
                <button 
                  onClick={stopTracker}
                  className="w-24 bg-red-500 hover:bg-red-400 text-white py-6 rounded-[28px] font-black text-sm shadow-xl flex items-center justify-center transition-all active:scale-95"
                >
                  <Square size={20} fill="currentColor" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right: Mood & Setup Status */}
        <div className="flex flex-col gap-6">
           {/* Work Today Banner */}
           <button 
              onClick={toggleMinimumMode}
              className={`p-10 rounded-[48px] flex flex-col justify-between transition-all border-4 text-left group min-h-[200px] ${
                data.dailyProgress.isMinimumMode 
                ? 'bg-amber-500 border-amber-400 text-white shadow-2xl shadow-amber-500/20' 
                : 'bg-white border-white shadow-sm hover:border-black/5'
              }`}
           >
              <div className="flex justify-between items-start w-full">
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${data.dailyProgress.isMinimumMode ? 'bg-white/20' : 'bg-amber-50 text-amber-500 shadow-inner'}`}>
                    <Briefcase size={28} />
                 </div>
                 {data.dailyProgress.isMinimumMode && <AlertCircle className="animate-pulse" size={24} />}
              </div>
              <div className="mt-8">
                 <h3 className="text-2xl font-black tracking-tight leading-none mb-2">Busy Work Day Mode</h3>
                 <p className={`text-xs font-bold uppercase tracking-widest ${data.dailyProgress.isMinimumMode ? 'text-white/70' : 'opacity-40'}`}>
                    {data.dailyProgress.isMinimumMode ? 'Auto-Compensation logic active' : 'Click to prioritize efficiency today'}
                 </p>
              </div>
           </button>

           <div className="bg-white p-10 rounded-[48px] shadow-sm border border-white flex-1 space-y-8">
              <div className="flex justify-between items-center">
                 <h2 className="text-xs uppercase font-black opacity-40 tracking-widest">Bio-Performance Setup</h2>
                 <BrainCircuit className="opacity-10" />
              </div>
              <div className="space-y-6">
                {moods.map((m) => (
                  <div key={m.name} className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase opacity-60">
                      <span className="flex items-center gap-2">{m.icon} {m.label}</span>
                      <span className="font-mono">{data.mood[m.name]}/10</span>
                    </div>
                    <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${data.mood[m.name] * 10}%` }} className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full" />
                       <input type="range" min="1" max="10" value={data.mood[m.name]}
                        onChange={(e) => updateMood({ [m.name]: parseInt(e.target.value) })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>

      {/* Routine Detail Grid */}
      {!hasActivePlan ? (
        <div className="bg-white border border-black/5 p-16 rounded-[48px] text-center space-y-6">
           <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-inner">
              <Calendar size={48} />
           </div>
           <div className="max-w-md mx-auto">
              <h3 className="text-3xl font-black text-slate-900 mb-4">Awaiting Evolution Plan</h3>
              <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
                 You haven't initialized your 12-week blueprint yet. Your AI buddy is ready to scan your bio-stats.
              </p>
              <Link href="/profile" className="inline-flex items-center gap-3 bg-emerald-500 text-white px-10 py-5 rounded-[28px] font-black text-sm shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
                 <Settings size={20} /> INITIALIZE MASTER PLAN
              </Link>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
           {/* Left/Middle: Exercise List */}
           <div className="xl:col-span-2 space-y-6">
              <div className="flex justify-between items-center px-4">
                 <h2 className="text-xs uppercase font-black opacity-40 tracking-widest">Active Exercises</h2>
                 <p className="text-[10px] font-black bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full uppercase">
                   {data.dailyPlan?.workout?.focus || "Tactical Focus"}
                 </p>
              </div>

              {autoGenerating && (
                <div className="bg-white p-12 rounded-[40px] text-center flex flex-col items-center gap-4">
                   <Loader2 className="animate-spin text-emerald-500" size={32} />
                   <p className="text-sm font-black opacity-40 uppercase tracking-widest">Compiling tactical routine...</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                  {currentExercises ? (
                    currentExercises.map((ex: any, idx: number) => (
                      <motion.div key={ex.name + idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: idx * 0.1 }}>
                        <ExerciseCard exercise={ex} />
                      </motion.div>
                    ))
                  ) : !autoGenerating && (
                    <div className="md:col-span-2 bg-white rounded-[40px] p-20 text-center space-y-4 border border-black/5 border-dashed">
                      <Dumbbell className="mx-auto opacity-10" size={64} />
                      <p className="text-sm font-black opacity-30 uppercase tracking-widest">Rest Day Protocol Active</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
           </div>

           {/* Right: Stats Summary */}
           <div className="space-y-6">
              <div className="bg-white p-10 rounded-[48px] shadow-sm border border-white space-y-8">
                 <h3 className="text-xs uppercase font-black opacity-30 tracking-widest">Progression Flow</h3>
                 <div className="space-y-6">
                    <StatItem icon={<Calendar className="text-emerald-500" />} label="Plan Stage" val={`Day ${dayNumber} / ${totalDays}`} />
                    <StatItem icon={<TrendingUp className="text-blue-500" />} label="Intensity" val="Progressive" />
                    <StatItem icon={<Clock className="text-indigo-500" />} label="Est. Duration" val="45 min" />
                 </div>
                 <div className="pt-6 border-t border-black/5">
                    <div className="flex items-center justify-between mb-3">
                       <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">Overall evolution</p>
                       <p className="text-[10px] font-black text-emerald-600">{Math.round((dayNumber/totalDays)*100)}%</p>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${(dayNumber / totalDays) * 100}%` }} className="h-full bg-emerald-500" />
                    </div>
                 </div>
              </div>

              <div className="bg-slate-900 p-10 rounded-[48px] text-white flex items-center justify-between group cursor-pointer" onClick={() => window.location.href='/profile'}>
                 <div>
                    <h4 className="font-black text-lg">Timeline</h4>
                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">View 60-day roadmap</p>
                 </div>
                 <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                    <ChevronRight size={24} />
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function StatItem({ icon, label, val }: { icon: React.ReactNode, label: string, val: string }) {
  return (
    <div className="flex items-center justify-between">
       <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 shadow-inner">{icon}</div>
          <span className="text-sm font-bold text-slate-500">{label}</span>
       </div>
       <span className="text-sm font-black text-slate-900">{val}</span>
    </div>
  );
}
