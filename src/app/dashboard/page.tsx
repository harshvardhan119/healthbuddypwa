"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useHealth } from "@/lib/health-context";
import { calculateTargets } from "@/lib/health-calculator";
import ProgressRing from "@/components/progress-ring";
import WeightLogger from "@/components/weight-logger";
import ScheduleTimeline from "@/components/schedule-timeline";
import { 
  Flame as StreakIcon,
  BrainCircuit,
  Plus,
  Moon,
  Smile,
  Sun,
  CheckCircle2,
  Briefcase,
  Timer,
  Footprints,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Utensils,
  Flame,
  Zap,
  Droplets,
  Trophy
} from "lucide-react";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Dashboard() {
  const { data, addWater, setShowCheckin, getPlanDayNumber, toggleRitual } = useHealth();
  const targets = calculateTargets(data.profile);

  const calculateCaloriesEaten = () => {
    if (!data.dailyPlan?.diet) return 0;
    const meals = data.dailyProgress.mealsCompleted;
    return meals.reduce((acc: number, key: string) => acc + (data.dailyPlan.diet[key]?.calories || 0), 0);
  };

  const calculateMacros = () => {
    if (!data.dailyPlan?.diet) return { p: 0, c: 0, f: 0 };
    const meals = data.dailyProgress.mealsCompleted;
    return meals.reduce((acc: any, key: string) => {
      const macros = data.dailyPlan.diet[key]?.macros || { p: 0, c: 0, f: 0 };
      return { p: acc.p + macros.p, c: acc.c + macros.c, f: acc.f + macros.f };
    }, { p: 0, c: 0, f: 0 });
  };

  const calculateProgress = () => {
    const totalExercises = data.dailyPlan?.workout?.exercises?.length || 0;
    const completedExercises = data.dailyPlan?.workout?.exercises?.filter((ex: any) => ex.completed).length || 0;
    const totalMeals = 4;
    const completedMeals = data.dailyProgress.mealsCompleted.length;
    if (totalExercises === 0) return Math.round((completedMeals / totalMeals) * 100);
    return Math.round(((completedExercises / totalExercises) * 0.5 + (completedMeals / totalMeals) * 0.5) * 100);
  };

  const weightData = {
    labels: data.logs.weightHistory.length > 0 ? data.logs.weightHistory.map((h: any) => h.date) : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Weight',
      data: data.logs.weightHistory.length > 0 ? data.logs.weightHistory.map((h: any) => h.weight) : [80, 79.5, 79.8, 79.2, 78.9, 78.5, 78.2],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: { x: { display: false }, y: { display: false } },
    maintainAspectRatio: false,
  };

  const rituals = [
    { id: 'sleep', label: '8h Sleep', icon: <Moon size={16} />, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 'meditation', label: '10m Mind', icon: <Smile size={16} />, color: 'text-teal-400', bg: 'bg-teal-500/10' },
    { id: 'sunlight', label: 'Sunlight', icon: <Sun size={16} />, color: 'text-sky-400', bg: 'bg-sky-500/10' },
  ];

  const todayStr = new Date().toISOString().split('T')[0];
  const isGoalReached = data.user.completedDates?.includes(todayStr);

  return (
    <div className="space-y-6 pb-32">
      {/* Upper Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col justify-between bg-white p-6 md:p-10 rounded-3xl md:rounded-[48px] shadow-sm border border-white overflow-hidden relative">
          
          <div className="absolute top-4 right-4 z-20">
             <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl transition-all ${isGoalReached ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-rose-500/20'}`}>
                {isGoalReached ? <Trophy size={14} /> : <StreakIcon size={14} fill="white" />}
                <span className="text-[10px] md:text-xs font-black uppercase tracking-wider">
                  {isGoalReached ? 'GOAL ACHIEVED' : `${data.user.streak || 0} DAY STREAK`}
                </span>
             </div>
          </div>

          <div className="relative z-10">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-foreground">
              Hello, <br />
              <span className="text-emerald-500 italic">{data.user.name || 'Buddy'}</span>
            </h1>
            <p className="mt-2 opacity-40 text-[10px] font-black uppercase tracking-[0.2em]">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
            </p>
          </div>
          
          <div className="mt-8 relative z-10 flex gap-3">
             <button onClick={() => window.location.href='/workout'} className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs flex items-center gap-2 shadow-xl active:scale-95 transition-all">
                Continue <ChevronRight size={16} />
             </button>
             {data.dailyProgress.isMinimumMode && (
                <div className="px-4 py-4 bg-amber-50 text-amber-600 rounded-2xl flex items-center gap-2">
                   <Briefcase size={16} />
                   <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Work Mode Active</span>
                </div>
             )}
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-center opacity-5 md:opacity-20 pointer-events-none">
             <BrainCircuit size={180} />
          </div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 rounded-3xl md:rounded-[48px] p-8 text-white space-y-6 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
          <ProgressRing value={calculateProgress()} max={100} color="#10b981" size={120} mdSize={160} strokeWidth={10} unit="%" label="Tactical" />
          <AnimatePresence>
            {isGoalReached && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute bottom-6 flex items-center gap-2 text-emerald-400">
                <Sparkles size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Mastery Achieved</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
         <div className="col-span-2 bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] shadow-sm border border-black/5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <div>
                  <h4 className="text-[9px] font-black uppercase tracking-[0.2em] opacity-30 mb-1">Fuel Status</h4>
                  <p className="text-2xl md:text-3xl font-black">{calculateCaloriesEaten()} <span className="text-xs opacity-20">/ {targets.targetCalories}</span></p>
               </div>
               <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center"><Flame size={18} /></div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-6">
               <MacroMini label="P" val={calculateMacros().p} color="bg-emerald-500" />
               <MacroMini label="F" val={calculateMacros().f} color="bg-amber-500" />
               <MacroMini label="C" val={calculateMacros().c} color="bg-sky-500" />
            </div>
         </div>

         <div className="bg-slate-900 p-6 rounded-[32px] md:rounded-[40px] shadow-xl text-white flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
            <div className="relative z-10">
               <div className="flex justify-between items-start mb-4">
                  <Footprints size={18} className="text-emerald-400" />
                  <p className="text-xl md:text-2xl font-black">{data.dailyProgress.steps.toLocaleString()}</p>
               </div>
               <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((data.dailyProgress.steps / data.profile.stepsGoal) * 100, 100)}%` }} className="h-full bg-emerald-400" />
               </div>
               <p className="text-[8px] font-black uppercase opacity-30 tracking-widest mt-2">Activity Step Vector</p>
            </div>
         </div>

         <div className="bg-emerald-500 p-6 rounded-[32px] md:rounded-[40px] shadow-xl shadow-emerald-500/20 text-white flex flex-col justify-between group">
            <div className="flex justify-between items-start">
               <TrendingUp size={18} className="text-emerald-100" />
               <p className="text-xl md:text-2xl font-black">{Math.floor(data.dailyProgress.caloriesBurned)}</p>
            </div>
            <p className="text-[8px] font-black uppercase opacity-60 tracking-widest">Kcal Oxidation</p>
         </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 space-y-6">
            <ScheduleTimeline schedule={data.dailyPlan?.schedule || []} />
            <div className="grid grid-cols-3 gap-3">
              {rituals.map((item) => {
                const isDone = data.dailyProgress.ritualsCompleted?.includes(item.id);
                return (
                  <motion.div key={item.id} whileTap={{ scale: 0.98 }} onClick={() => toggleRitual(item.id)}
                    className={`p-4 rounded-2xl flex flex-col gap-3 group cursor-pointer border-2 transition-all ${
                      isDone ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-black/5'
                    }`}>
                    <div className={`w-10 h-10 rounded-xl ${isDone ? 'bg-emerald-500 text-white' : `${item.bg} ${item.color}`} flex items-center justify-center transition-colors`}>
                      {isDone ? <CheckCircle2 size={16} /> : item.icon}
                    </div>
                    <p className={`font-black text-[10px] tracking-tight ${isDone ? 'line-through opacity-20' : ''}`}>{item.label}</p>
                  </motion.div>
                );
              })}
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-white p-6 rounded-[32px] md:rounded-[40px] shadow-sm border border-black/5 space-y-4">
               <div className="flex justify-between items-center px-1">
                  <h3 className="text-[9px] uppercase font-black opacity-30 tracking-widest">Weight Tracker</h3>
                  <p className="text-xs font-black text-emerald-500">{data.profile.weight} kg</p>
               </div>
               <div className="h-40">
                  <Line data={weightData} options={chartOptions} />
               </div>
               <WeightLogger />
            </div>

            <div className="bg-white p-6 rounded-[32px] md:rounded-[40px] shadow-sm border border-black/5 flex items-center justify-between group relative cursor-pointer active:scale-95 transition-all overflow-hidden" onClick={() => addWater()}>
               <div className="relative z-10">
                  <p className="text-2xl font-black text-sky-600">{data.dailyProgress.waterGlass}</p>
                  <p className="text-[9px] font-bold uppercase text-sky-400">Hydration</p>
               </div>
               <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-inner">
                  <Droplets size={20} />
               </div>
               <motion.div animate={{ y: [30, 0, 30] }} transition={{ duration: 3, repeat: Infinity }} className="absolute bottom-0 left-0 right-0 h-1/2 bg-sky-50/50 -z-0" />
            </div>
         </div>
      </div>
    </div>
  );
}

function MacroMini({ label, val, color }: { label: string, val: number, color: string }) {
  return (
    <div className="bg-slate-50 p-3 rounded-2xl border border-black/5 flex flex-col items-center">
       <span className="text-xs font-black text-slate-900">{val}g</span>
       <div className="flex items-center gap-1 mt-1">
          <div className={`w-1 h-1 rounded-full ${color}`} />
          <span className="text-[8px] font-black uppercase opacity-40">{label}</span>
       </div>
    </div>
  );
}
