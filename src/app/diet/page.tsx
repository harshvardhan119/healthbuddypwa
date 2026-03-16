"use client";

import { useHealth } from "@/lib/health-context";
import { analyzeFoodImpact } from "@/lib/ai-engine";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Coffee, 
  Sun, 
  Moon, 
  Cookie, 
  CheckCircle2,
  AlertCircle,
  Scan,
  X,
  Loader2,
  Dumbbell,
  Sparkles,
  Camera,
  Apple,
  Utensils,
  ChevronRight,
  Zap,
  Flame,
  PieChart
} from "lucide-react";
import ProgressRing from "@/components/progress-ring";

export default function DietPage() {
  const { data, toggleMeal, addCompensatoryExercises, setDietWarning } = useHealth();
  const plan = data.dailyPlan?.diet;
  const mealsCompleted = data.dailyProgress.mealsCompleted;
  
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [foodInput, setFoodInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const mealSections = [
    { name: "Breakfast", icon: <Coffee size={18} />, key: "breakfast", color: "text-emerald-500", bg: "bg-emerald-50" },
    { name: "Lunch", icon: <Sun size={18} />, key: "lunch", color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Dinner", icon: <Moon size={18} />, key: "dinner", color: "text-purple-500", bg: "bg-purple-50" },
    { name: "Snacks", icon: <Cookie size={18} />, key: "snacks", color: "text-amber-500", bg: "bg-amber-50" },
  ];

  const handleAnalyzeFood = async () => {
    if (!foodInput.trim()) return;
    setAnalyzing(true);
    setAnalysisResult(null);

    const result = await analyzeFoodImpact({
      profile: data.profile,
      mood: data.mood,
      history: data.logs
    }, foodInput, data.dailyPlan);

    if (result) {
      setAnalysisResult(result);
      if (result.extraExercises && result.extraExercises.length > 0) {
        addCompensatoryExercises(result.extraExercises.map((ex: any) => ({
          ...ex,
          completed: false,
          isCompensatory: true 
        })));
        setDietWarning(`Neural scan complete: ${result.extraExercises.length} extra exercises added to neutralize: ${foodInput}`);
      } else {
        setDietWarning(result.analysis);
      }
    }
    setAnalyzing(false);
  };

  const currentCaloriesEaten = mealsCompleted.reduce((acc: number, key: string) => {
    return acc + (plan?.[key]?.calories || 0);
  }, 0);
  
  const totalCaloriesGoal = plan?.totalCalories || 2000;

  return (
    <div className="space-y-8 pb-32">
      {/* Hero Section: Stats & AI Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Stats & Goal */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[48px] shadow-sm border border-white flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full -ml-16 -mt-16 blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
           
           <div className="shrink-0 relative">
             <ProgressRing value={currentCaloriesEaten} max={totalCaloriesGoal} size={160} strokeWidth={12} color="#10b981" label="Consumed" />
             <div className="absolute inset-0 flex items-center justify-center">
                <Utensils className="text-emerald-500/20" size={40} />
             </div>
           </div>

           <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-4xl font-black text-foreground leading-tight">Elite <span className="text-emerald-500 italic">Fueling</span></h1>
                <p className="opacity-40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Metabolic Optimization Protocol</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 p-4 rounded-3xl border border-black/5">
                    <p className="text-2xl font-black text-slate-800">{currentCaloriesEaten}</p>
                    <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">Kcal Eaten</p>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-3xl border border-black/5">
                    <p className="text-2xl font-black text-slate-400">{totalCaloriesGoal}</p>
                    <p className="text-[10px] font-black opacity-30 uppercase tracking-widest">Daily Limit</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Right: AI Scan Button */}
        <motion.button 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => { setShowAnalyzer(true); setAnalysisResult(null); setFoodInput(""); }}
          className="lg:col-span-4 bg-slate-900 rounded-[48px] p-8 text-white flex flex-col items-center justify-center gap-6 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-50 group-hover:scale-110 transition-transform" />
          <div className="w-20 h-20 rounded-3xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-6 transition-all">
             <Scan size={36} />
          </div>
          <div className="text-center relative z-10">
             <h3 className="text-xl font-black italic">AI Vision Scan</h3>
             <p className="text-[10px] font-bold uppercase opacity-40 tracking-[0.3em] mt-2">Analyze any Deviation</p>
          </div>
        </motion.button>
      </div>

      {/* Impact Warning */}
      <AnimatePresence>
        {data.dailyPlan?.dietWarning && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-red-50 rounded-[40px] border border-red-100 flex gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <AlertCircle className="text-red-500 shrink-0 mt-1" size={24} />
            <div className="space-y-2">
              <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Neural Impact Prediction</p>
              <p className="text-sm font-medium text-red-700 leading-relaxed italic">
                {data.dailyPlan.dietWarning}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Meal Planner Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Meal Cards */}
        <div className="xl:col-span-8 space-y-6">
           <div className="flex justify-between items-center px-4">
              <h2 className="text-xs uppercase font-black opacity-40 tracking-widest">Tactical Nutrition Schedule</h2>
              <PieChart className="opacity-10" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mealSections.map((section, idx) => (
              <motion.div 
                key={section.key} whileHover={{ y: -4 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => toggleMeal(section.key)}
                className={`bg-white rounded-[40px] p-8 space-y-6 cursor-pointer transition-all border-2 group ${
                  mealsCompleted.includes(section.key) ? 'border-emerald-500/20 opacity-60' : 'border-transparent shadow-sm hover:border-black/5'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-inner ${mealsCompleted.includes(section.key) ? 'bg-emerald-500 text-white' : `${section.bg} ${section.color}`}`}>
                    {mealsCompleted.includes(section.key) ? <CheckCircle2 size={24} /> : section.icon}
                  </div>
                  <div className="text-right">
                     <p className="text-xl font-black">{plan?.[section.key]?.calories || 0}</p>
                     <p className="text-[9px] font-bold opacity-30 uppercase tracking-widest">Kcal Allocation</p>
                  </div>
                </div>

                <div className="space-y-3">
                   <h3 className={`text-lg font-black tracking-tight ${mealsCompleted.includes(section.key) ? 'line-through' : ''}`}>
                     {section.name}
                   </h3>
                   <div className="space-y-2">
                    {plan?.[section.key]?.meals?.map((meal: string, mealIdx: number) => (
                      <div key={mealIdx} className="flex items-center gap-3 text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                        <Zap size={10} className="text-emerald-500 shrink-0" />
                        <span className="truncate">{meal}</span>
                      </div>
                    ))}
                    {!plan && <p className="text-xs opacity-30 italic">Calculating optimal macros...</p>}
                   </div>
                </div>
              </motion.div>
            ))}
           </div>
        </div>

        {/* Right Column: Macro Breakdown & Insights */}
        <div className="xl:col-span-4 space-y-6">
           <div className="bg-white p-10 rounded-[48px] shadow-sm border border-white space-y-8">
              <h3 className="text-xs uppercase font-black opacity-30 tracking-widest">Macro-Vector Stats</h3>
              <div className="space-y-6">
                 <MacroProgress label="Proteins" current={45} target={120} color="bg-emerald-500" />
                 <MacroProgress label="Lipids (Fats)" current={22} target={60} color="bg-amber-500" />
                 <MacroProgress label="Glycogen (Carbs)" current={65} target={180} color="bg-sky-500" />
              </div>
           </div>

           <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 rounded-[48px] text-white space-y-4 shadow-xl shadow-emerald-500/10 relative overflow-hidden">
              <Sparkles className="text-white/20 absolute -bottom-4 -right-4" size={100} />
              <div className="relative z-10">
                 <h4 className="font-black text-lg">Metabolic Insight</h4>
                 <p className="text-sm font-medium leading-relaxed opacity-90 mt-2 italic">
                    &quot;Your protein intake is 15% higher today, optimal for muscle recovery before tomorrow's intensity.&quot;
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* Analyzer Modal */}
      <AnimatePresence>
        {showAnalyzer && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white w-full max-w-xl rounded-[48px] p-10 space-y-8 shadow-2xl overflow-hidden relative"
              >
                <button onClick={() => !analyzing && setShowAnalyzer(false)} className="absolute top-8 right-8 text-black/20 hover:text-black transition-colors">
                  <X size={24} />
                </button>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg"><Sparkles size={24} /></div>
                    <div>
                       <h2 className="font-black text-2xl tracking-tighter">AI Neural Vision</h2>
                       <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Predicting Metabolic Consequence</p>
                    </div>
                  </div>
                </div>

                {!analysisResult ? (
                  <div className="space-y-6">
                    <div className="relative group">
                      <textarea
                        value={foodInput}
                        onChange={(e) => setFoodInput(e.target.value)}
                        placeholder="What's for fuel? Describe your intake..."
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500/20 rounded-[32px] p-8 h-48 resize-none text-lg font-bold outline-none transition-all placeholder:opacity-30"
                        disabled={analyzing}
                      />
                      <div className="absolute bottom-6 right-6 flex gap-2">
                         <div className="p-4 bg-white shadow-xl rounded-2xl text-emerald-500"><Camera size={20} /></div>
                      </div>
                    </div>

                    <button 
                      onClick={handleAnalyzeFood}
                      disabled={analyzing || !foodInput.trim()}
                      className="w-full bg-emerald-500 text-white rounded-[28px] py-6 font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all"
                    >
                      {analyzing ? <><Loader2 className="animate-spin" size={24} /> Neural Scan...</> : <><Zap size={24} fill="currentColor" /> Analyze & Adapt Plan</>}
                    </button>
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className={`p-8 rounded-[36px] ${analysisResult.isHealthy ? 'bg-emerald-50 border border-emerald-100' : 'bg-red-50 border border-red-100'}`}>
                      <div className="flex items-center gap-3 mb-4">
                         {analysisResult.isHealthy ? <CheckCircle2 className="text-emerald-500" /> : <AlertCircle className="text-red-500" />}
                         <p className="text-xs font-black uppercase tracking-widest opacity-60">Impact Report</p>
                      </div>
                      <p className="text-lg font-bold leading-relaxed text-slate-900">{analysisResult.analysis}</p>
                      <div className="mt-6 flex justify-between items-center bg-white/50 p-4 rounded-2xl">
                         <p className="text-[10px] font-black uppercase opacity-40">Estimated Kcal</p>
                         <p className="text-xl font-black text-emerald-600">{analysisResult.estimatedCalories}</p>
                      </div>
                    </div>

                    {analysisResult.extraExercises && analysisResult.extraExercises.length > 0 && (
                      <div className="bg-slate-900 rounded-[36px] p-8 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-black text-xs uppercase tracking-[0.3em] text-emerald-400">Compensatory Protocol</h4>
                          <Dumbbell className="text-emerald-400" size={18} />
                        </div>
                        <div className="space-y-3">
                          {analysisResult.extraExercises.map((ex: any, i: number) => (
                            <div key={i} className="flex justify-between items-center text-white/90">
                              <span className="text-sm font-bold">{ex.name}</span>
                              <span className="text-xs font-black bg-white/10 px-3 py-1 rounded-full uppercase">{ex.sets}x{ex.reps}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={() => setShowAnalyzer(false)}
                      className="w-full bg-slate-900 text-white rounded-[28px] py-6 font-black text-lg shadow-xl"
                    >
                      Accept Vector Update
                    </button>
                  </motion.div>
                )}
              </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MacroProgress({ label, current, target, color }: { label: string, current: number, target: number, color: string }) {
   return (
      <div className="space-y-2">
         <div className="flex justify-between items-end">
            <p className="text-[10px] font-black uppercase opacity-40">{label}</p>
            <p className="text-sm font-black">{current}<span className="opacity-20">/{target}g</span></p>
         </div>
         <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(current/target)*100}%` }} className={`h-full ${color} rounded-full`} />
         </div>
      </div>
   );
}
