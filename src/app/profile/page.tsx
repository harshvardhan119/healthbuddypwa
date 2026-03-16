"use client";

import { useHealth } from "@/lib/health-context";
import { getAIPlanning } from "@/lib/ai-engine";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Scale, Ruler, Calendar as CalIcon, Activity, Zap, ShieldAlert,
  Target, Utensils, Droplets, Footprints, Moon, Sun, Clock,
  Dumbbell, Heart, Pill, CheckCircle2, ChevronRight, LogOut,
  Save, Sparkles, RotateCcw, Loader2, AlertCircle, X, Flame,
  Trophy, TrendingUp, Settings, BrainCircuit, Workflow,
  ShieldCheck, Info, Timer
} from "lucide-react";

export default function Profile() {
  const { data, updateProfile, updateUser, logout, resetPlan, getPlanDayNumber, finalizePlan } = useHealth();
  const [form, setForm] = useState({ ...data.profile });
  const [userName, setUserName] = useState(data.user.name || '');
  const [userEmail, setUserEmail] = useState(data.user.email || '');
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [loading, setLoading] = useState(false);
  const [tempPlan, setTempPlan] = useState<any>(null);

  useEffect(() => {
    setForm({ ...data.profile });
    setUserName(data.user.name || '');
    setUserEmail(data.user.email || '');
  }, [data.profile, data.user]);

  const handleChange = (name: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await updateProfile({ ...form, profileComplete: true });
    updateUser({ name: userName, email: userEmail });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm("Factory Reset System? Current progression and streak vectors will be purged.")) {
      resetPlan();
      setTempPlan(null);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const plan = await getAIPlanning({
        profile: { ...form, profileComplete: true },
        mood: data.mood,
        history: data.logs,
        totalDays: form.targetTimeline * 7,
      });
      if (plan) setTempPlan(plan);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleFinalize = () => {
    if (tempPlan) {
      finalizePlan(tempPlan);
      setTempPlan(null);
      setActiveTab(4); 
    }
  };

  const dayNumber = getPlanDayNumber();
  const totalDays = data.masterPlan?.totalDays || (form.targetTimeline * 7);

  const goals = [
    { value: 'lose_weight', label: 'Weight Reduction', icon: <Scale size={20} />, desc: 'Deficit protocol' },
    { value: 'gain_muscle', label: 'Muscle Synthesis', icon: <Dumbbell size={20} />, desc: 'Hypertrophy vector' },
    { value: 'get_fit', label: 'Conditioning', icon: <Activity size={20} />, desc: 'Endurance vector' },
    { value: 'maintain', label: 'Stasis Protocol', icon: <Heart size={20} />, desc: 'Health maintenance' },
  ];

  const tabs = ['Goal', 'Body', 'Life', 'Logs', 'Map'];

  // Calendar Logic
  const calendarDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const isToday = i === 0;
      const dateStr = d.toISOString().split('T')[0];
      const isCompleted = data.user.completedDates?.includes(dateStr);
      days.push({ day: d.getDate(), month: d.toLocaleString('default', { month: 'short' }), isCompleted, isToday, fullDate: dateStr });
    }
    return days;
  }, [data.user.completedDates]);

  return (
    <div className="space-y-6 pb-32">
      {/* Identity Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl md:rounded-[48px] shadow-sm border border-white flex flex-col md:flex-row justify-between items-center group relative overflow-hidden">
            <div className="relative z-10 flex items-center gap-4 text-center md:text-left">
               <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[32px] bg-slate-900 flex items-center justify-center text-white shadow-xl relative">
                  <span className="text-2xl md:text-3xl font-black">{data.user.name?.[0] || 'B'}</span>
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-lg border-2 border-white shadow-md">
                     <ShieldCheck size={12} />
                  </div>
               </div>
               <div>
                  <h1 className="text-xl md:text-3xl font-black text-slate-900 leading-tight">{data.user.name || 'Buddy'}</h1>
                  <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-30 mt-1 uppercase">Elite System Tier</p>
               </div>
            </div>

            <div className="mt-6 md:mt-0 relative z-10 flex gap-2">
               <button onClick={handleSave} className="px-5 py-3 bg-emerald-500 text-white rounded-xl md:rounded-[20px] font-black text-xs shadow-xl shadow-emerald-500/10 active:scale-95 transition-all">
                  Sync Profile
               </button>
               <button onClick={() => { if (confirm("Logout?")) logout(); }} className="p-3 bg-slate-50 text-slate-300 rounded-xl hover:text-red-500 transition-colors">
                  <LogOut size={16} />
               </button>
            </div>
         </div>

         {/* Mini Streak Tracker */}
         <div className="bg-slate-900 rounded-3xl md:rounded-[40px] p-6 md:p-8 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-rose-500 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-rose-500/20">
                     <Flame size={18} fill="white" />
                     <span className="text-xs font-black mt-0.5">{data.user.streak || 0}</span>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40">Persistence</h4>
                    <p className="text-sm font-black text-emerald-400">Current Streak</p>
                  </div>
               </div>
               <TrendingUp className="text-emerald-500/20" size={32} />
            </div>
         </div>
      </div>

      {/* Main Settings Area */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
         {/* Tabs - Horizontal on Mobile */}
         <div className="xl:col-span-1 flex xl:flex-col gap-2 overflow-x-auto pb-2 no-scrollbar">
            {tabs.map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(i)}
                className={`whitespace-nowrap px-6 py-3 md:py-4 rounded-xl md:rounded-[24px] text-left text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === i ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-50'
                }`}>
                {tab}
              </button>
            ))}
         </div>

         <div className="xl:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 0 && (
                <motion.div key="t0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    {goals.map(g => (
                      <button key={g.value} onClick={() => handleChange('goal', g.value)}
                        className={`p-5 md:p-8 rounded-3xl text-left transition-all border-2 ${
                          form.goal === g.value ? 'border-emerald-500 bg-emerald-50' : 'border-white bg-white hover:border-black/5'
                        }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${form.goal === g.value ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-300'}`}>{g.icon}</div>
                        <h4 className="text-base font-black text-slate-900 leading-tight">{g.label}</h4>
                      </button>
                    ))}
                  </div>

                  <div className="bg-white rounded-3xl p-6 md:p-10 space-y-6 shadow-sm border border-white">
                    <h3 className="text-[10px] uppercase font-black opacity-30 tracking-widest">Target Vectors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: 'targetWeight', label: 'Weight Goal (kg)', icon: <Scale size={18} /> },
                        { name: 'targetTimeline', label: 'Weeks', icon: <CalIcon size={18} /> }
                      ].map(f => (
                        <div key={f.name} className="flex justify-between items-center bg-slate-50 p-5 rounded-2xl border border-black/5">
                          <div className="flex items-center gap-3 text-slate-400">{f.icon} <span className="text-[9px] font-black uppercase tracking-widest">{f.label}</span></div>
                          <input type="number" value={(form as any)[f.name]} onChange={e => handleChange(f.name, Number(e.target.value))} className="w-16 bg-transparent text-right font-black text-xl text-emerald-600 outline-none" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {!data.masterPlan?.isActive && (
                    <button onClick={handleGenerate} disabled={loading}
                      className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xs shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all relative overflow-hidden group">
                      {loading ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} fill="currentColor" className="text-emerald-500" />}
                      <span className="relative z-10 uppercase tracking-widest leading-none">Synthesize Neural Blueprint</span>
                    </button>
                  )}

                  {tempPlan && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-500 p-8 rounded-[32px] text-white space-y-4 shadow-2xl shadow-emerald-500/10">
                      <div className="flex items-center gap-3">
                        <Sparkles size={24} />
                        <h3 className="text-xl font-black italic">Strategy Ready</h3>
                      </div>
                      <p className="text-sm font-bold opacity-90 italic leading-relaxed">
                        &quot;{tempPlan.consequences}&quot;
                      </p>
                      <button onClick={handleFinalize} className="w-full bg-white text-emerald-600 py-5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
                        Initialize Protocol <ChevronRight size={16} />
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {activeTab === 1 && (
                <motion.div key="t1" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-3 gap-4">
                  {['age', 'height', 'weight'].map(f => (
                    <div key={f} className="bg-white p-6 rounded-3xl border border-white shadow-sm text-center">
                       <p className="text-[8px] font-black uppercase opacity-20 tracking-widest mb-2">{f}</p>
                       <input type="number" value={(form as any)[f]} onChange={e => handleChange(f, Number(e.target.value))} className="w-full bg-transparent font-black text-2xl text-slate-900 text-center outline-none" />
                    </div>
                  ))}
                  <div className="col-span-3 bg-slate-900 p-6 rounded-3xl text-white">
                      <p className="text-[8px] font-black uppercase opacity-40 mb-3 ml-2 tracking-widest">Identify Credentials</p>
                      <input value={userName} onChange={e => setUserName(e.target.value)} className="w-full bg-white/5 rounded-xl px-4 py-3 mb-3 outline-none font-bold text-sm" />
                      <input value={userEmail} onChange={e => setUserEmail(e.target.value)} className="w-full bg-white/5 rounded-xl px-4 py-3 outline-none font-bold text-sm" />
                  </div>
                </motion.div>
              )}

              {activeTab === 2 && (
                <motion.div key="t2" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                  {/* Activity & Diet Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-white space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center"><Activity size={18} /></div>
                        <h3 className="text-[10px] uppercase font-black opacity-30 tracking-widest">Activity Gradient</h3>
                      </div>
                      <select 
                        value={form.activityLevel} 
                        onChange={e => handleChange('activityLevel', e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-sm outline-none appearance-none cursor-pointer"
                      >
                        <option value="sedentary">Sedentary (Office/Minimal)</option>
                        <option value="light">Light (1-2 days/week)</option>
                        <option value="moderate">Moderate (3-5 days/week)</option>
                        <option value="active">Active (6-7 days/week)</option>
                        <option value="elite">Elite (Professional/Hybrid)</option>
                      </select>
                    </div>

                    <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-white space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center"><Utensils size={18} /></div>
                        <h3 className="text-[10px] uppercase font-black opacity-30 tracking-widest">Nutrition protocol</h3>
                      </div>
                      <select 
                        value={form.dietPreference} 
                        onChange={e => handleChange('dietPreference', e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-sm outline-none appearance-none cursor-pointer"
                      >
                        <option value="omnivore">Omnivore (Balanced)</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="keto">Ketogenic</option>
                        <option value="paleo">Paleo</option>
                      </select>
                    </div>
                  </div>

                  {/* Daily Quotas Grid */}
                  <div className="bg-white p-6 md:p-10 rounded-[48px] shadow-sm border border-white">
                    <h3 className="text-[10px] uppercase font-black opacity-30 tracking-widest mb-8 text-center md:text-left">Daily System Quotas</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        { id: 'stepsGoal', label: 'Step Vector', icon: <Footprints size={18} />, color: 'text-indigo-500', bg: 'bg-indigo-50', unit: 'Steps' },
                        { id: 'waterGoal', label: 'Hydration', icon: <Droplets size={18} />, color: 'text-sky-500', bg: 'bg-sky-50', unit: 'Glasses' },
                        { id: 'sleepHours', label: 'Recovery', icon: <Moon size={18} />, color: 'text-purple-500', bg: 'bg-purple-50', unit: 'Hours' },
                        { id: 'mealsPerDay', label: 'Feeding Frequency', icon: <Clock size={18} />, color: 'text-rose-500', bg: 'bg-rose-50', unit: 'Meals' },
                        { id: 'workoutDuration', label: 'Session Intensity', icon: <Timer size={18} />, color: 'text-amber-500', bg: 'bg-amber-50', unit: 'Min' },
                        { id: 'workoutDaysPerWeek', label: 'Weekly Strain', icon: <Zap size={18} />, color: 'text-emerald-500', bg: 'bg-emerald-50', unit: 'Days' },
                      ].map(item => (
                        <div key={item.id} className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-lg ${item.bg} ${item.color} flex items-center justify-center`}>{item.icon}</div>
                            <span className="text-[9px] font-black uppercase opacity-20 tracking-widest">{item.label}</span>
                          </div>
                          <div className="flex items-end gap-2 bg-slate-50 p-4 rounded-2xl border border-black/5 hover:border-black/10 transition-colors">
                            <input 
                              type="number" 
                              value={(form as any)[item.id]} 
                              onChange={e => handleChange(item.id, Number(e.target.value))} 
                              className="w-full bg-transparent font-black text-xl text-slate-900 outline-none"
                            />
                            <span className="text-[8px] font-black uppercase opacity-30 pb-1">{item.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 3 && (
                <motion.div key="logs" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                  {/* Streak Calendar View */}
                  <div className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[48px] shadow-sm border border-white space-y-6">
                    <div>
                      <h3 className="text-xs uppercase font-black opacity-30 tracking-widest mb-1">Consistency Calendar</h3>
                      <p className="text-[10px] font-bold text-slate-400 italic">Tracking your daily full completion status.</p>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2">
                       {calendarDays.map((d, i) => (
                         <div key={i} className={`aspect-square flex flex-col items-center justify-center rounded-xl md:rounded-2xl transition-all relative ${
                           d.isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-105 z-10' : 'bg-slate-50 text-slate-300'
                         } ${d.isToday ? 'border-2 border-slate-900' : ''}`}>
                            <span className="text-[8px] font-bold uppercase opacity-40 mb-0.5">{d.month}</span>
                            <span className="text-xs md:text-sm font-black">{d.day}</span>
                            {d.isCompleted && <CheckCircle2 className="absolute top-1 right-1 opacity-40" size={10} />}
                         </div>
                       ))}
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-slate-50">
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-emerald-500" />
                          <span className="text-[9px] font-black uppercase opacity-40 tracking-widest">Completed</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-slate-100" />
                          <span className="text-[9px] font-black uppercase opacity-40 tracking-widest">Pending</span>
                       </div>
                    </div>
                  </div>
                  
                  <button onClick={handleReset} className="w-full text-red-400 font-black text-[9px] uppercase tracking-widest py-4 bg-red-50 rounded-2xl border border-red-100">
                    Purge All Progression Data
                  </button>
                </motion.div>
              )}

              {activeTab === 4 && (
                <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="bg-slate-900 p-8 rounded-[40px] text-white flex justify-between items-end">
                     <div>
                        <h2 className="text-3xl font-black italic text-emerald-400">Roadmap</h2>
                        <p className="text-[9px] font-black opacity-40 uppercase mt-1">60-Day Evolution Vector</p>
                     </div>
                     <p className="text-3xl font-black text-white">{Math.round((dayNumber / totalDays) * 100) || 0}%</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className={`p-6 rounded-3xl flex flex-col justify-between border-2 transition-all ${
                        i * 7 < dayNumber ? 'bg-emerald-50 border-emerald-500/10' : 'bg-white border-white shadow-sm'
                      }`}>
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black mb-6 ${
                            i * 7 < dayNumber ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 text-slate-300'
                         }`}>W{i+1}</div>
                         <h4 className={`text-xs font-black ${i * 7 < dayNumber ? 'text-emerald-900' : 'text-slate-900'}`}>{i < 2 ? 'Intro' : i < 5 ? 'Growth' : 'Mastery'}</h4>
                         {i * 7 < dayNumber && <CheckCircle2 className="text-emerald-500 mt-2" size={16} />}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
         </div>
      </div>

      {saved && (
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-2xl z-[100] flex items-center gap-3 text-xs"
        >
           <ShieldCheck size={16} className="text-emerald-500" />
           <span className="uppercase tracking-widest">Matrix Sync Successful</span>
        </motion.div>
      )}
    </div>
  );
}
