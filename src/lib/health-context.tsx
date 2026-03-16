"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export interface HealthData {
  user: {
    email: string | null;
    name: string | null;
    isAuthenticated: boolean;
    streak: number;
    lastActiveDate: string | null;
    completedDates: string[];
  };
  profile: {
    age: number;
    gender: string;
    height: number;
    weight: number;
    targetWeight: number;
    targetTimeline: number;
    activityLevel: string;
    dietPreference: string;
    allergies: string[];
    sleepHours: number;
    goal: string;
    mealsPerDay: number;
    waterGoal: number;
    stepsGoal: number;
    wakeUpTime: string;
    sleepTime: string;
    workoutDuration: number;
    workoutDaysPerWeek: number;
    medicalConditions: string;
    supplements: string;
    profileComplete: boolean;
  };
  mood: {
    stress: number;
    energy: number;
    mood: string;
    motivation: number;
    hunger: number;
    soreness: number;
  };
  logs: {
    meals: any[];
    workouts: any[];
    weightHistory: { date: string, weight: number }[];
    dailyCheckins: { date: string, summary: string, mood: string, weight: number }[];
    chatHistory: { role: 'user' | 'buddy', content: string, timestamp: string }[];
  };
  dailyPlan: any | null;
  masterPlan: {
    startDate: string;
    totalDays: number;
    currentDay: number;
    plans: any[];
    isActive: boolean;
    compensationQueue: any[];
  } | null;
  dailyProgress: {
    workoutCompleted: boolean;
    mealsCompleted: string[];
    ritualsCompleted: string[];
    waterGlass: number;
    steps: number;
    caloriesBurned: number;
    lastUpdated: string;
    isMinimumMode: boolean;
  };
  activeWorkout: {
    isRunning: boolean;
    isPaused: boolean;
    startTime: number | null;
    elapsed: number;
    type: 'running' | 'walking' | 'cycling';
  } | null;
}

const initialDefaultData: HealthData = {
  user: {
    email: null,
    name: null,
    isAuthenticated: false,
    streak: 0,
    lastActiveDate: null,
    completedDates: [],
  },
  profile: {
    age: 25,
    gender: 'male',
    height: 175,
    weight: 80,
    targetWeight: 75,
    targetTimeline: 12,
    activityLevel: 'moderately_active',
    dietPreference: 'Veg',
    allergies: [],
    sleepHours: 8,
    goal: '',
    mealsPerDay: 4,
    waterGoal: 8,
    stepsGoal: 10000,
    wakeUpTime: '06:00',
    sleepTime: '22:00',
    workoutDuration: 45,
    workoutDaysPerWeek: 5,
    medicalConditions: '',
    supplements: '',
    profileComplete: false,
  },
  mood: {
    stress: 3,
    energy: 7,
    mood: 'good',
    motivation: 8,
    hunger: 2,
    soreness: 1,
  },
  logs: {
    meals: [],
    workouts: [],
    weightHistory: [],
    dailyCheckins: [],
    chatHistory: [],
  },
  dailyPlan: null,
  masterPlan: null,
  dailyProgress: {
    workoutCompleted: false,
    mealsCompleted: [],
    ritualsCompleted: [],
    waterGlass: 0,
    steps: 0,
    caloriesBurned: 0,
    lastUpdated: '',
    isMinimumMode: false,
  },
  activeWorkout: null,
};

const HealthContext = createContext<any>(null);

export function HealthProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<HealthData>(initialDefaultData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const checkinTimerRef = useRef<any>(null);

  useEffect(() => {
    async function init() {
      const saved = localStorage.getItem('health_buddy_data');
      let currentData = saved ? JSON.parse(saved) : initialDefaultData;

      // Ensure data structure is up to date
      if (!currentData?.user) currentData.user = initialDefaultData.user;
      if (currentData.user?.streak === undefined) currentData.user.streak = 0;
      if (!currentData.user.completedDates) currentData.user.completedDates = [];
      if (!currentData.logs.chatHistory) currentData.logs.chatHistory = [];
      if (currentData.dailyProgress.isMinimumMode === undefined) currentData.dailyProgress.isMinimumMode = false;
      if (currentData.masterPlan && !currentData.masterPlan.compensationQueue) currentData.masterPlan.compensationQueue = [];

      const today = new Date().toISOString().split('T')[0];
      if (currentData.user?.lastActiveDate !== today) {
        currentData.dailyProgress = { ...initialDefaultData.dailyProgress, lastUpdated: today };
        currentData.activeWorkout = null;
      }

      setData(currentData);
      setIsLoaded(true);
    }
    init();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('health_buddy_data', JSON.stringify(data));
    }
  }, [data, isLoaded]);

  // Active workout timer
  useEffect(() => {
    let timer: any;
    if (data.activeWorkout?.isRunning && !data.activeWorkout?.isPaused) {
      timer = setInterval(() => {
        setData(prev => {
          if (!prev.activeWorkout || prev.activeWorkout.isPaused) return prev;
          const elapsed = prev.activeWorkout.elapsed + 1;
          let stepInc = 0;
          if (prev.activeWorkout.type === 'running') stepInc = 2.5;
          if (prev.activeWorkout.type === 'walking') stepInc = 1.3;
          
          return {
            ...prev,
            activeWorkout: { ...prev.activeWorkout, elapsed },
            dailyProgress: { 
              ...prev.dailyProgress, 
              steps: Math.floor(prev.dailyProgress.steps + stepInc),
              caloriesBurned: prev.dailyProgress.caloriesBurned + (stepInc * 0.04)
            }
          };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [data.activeWorkout?.isRunning]);

  const calculateStreak = (dates: string[]) => {
    if (!dates.length) return 0;
    const sortedDates = [...new Set(dates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const today = new Date().toISOString().split('T')[0];
    
    // Check if the latest date is today or yesterday
    const latest = sortedDates[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split('T')[0];

    if (latest !== today && latest !== yStr) return 0;

    let streak = 1;
    for (let i = 0; i < sortedDates.length - 1; i++) {
        const d1 = new Date(sortedDates[i]);
        const d2 = new Date(sortedDates[i+1]);
        const diff = (d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) streak++;
        else break;
    }
    return streak;
  };

  const checkDailyCompletion = useCallback(() => {
    setData(prev => {
      if (!prev.dailyPlan) return prev;
      
      const allExercisesDone = prev.dailyPlan.workout?.exercises?.every((ex: any) => ex.completed) ?? true;
      const allMealsDone = prev.dailyProgress.mealsCompleted.length >= (prev.profile.mealsPerDay || 3);
      const today = new Date().toISOString().split('T')[0];

      if (allExercisesDone && allMealsDone) {
        if (prev.user.completedDates.includes(today)) return prev;
        const newCompletedDates = [...prev.user.completedDates, today];
        return {
          ...prev,
          user: {
            ...prev.user,
            completedDates: newCompletedDates,
            streak: calculateStreak(newCompletedDates),
            lastActiveDate: today
          }
        };
      }
      return prev;
    });
  }, []);

  const checkStreak = useCallback(() => {
    // Legacy checkStreak kept for compatibility, now redirects to calculate
    setData(prev => ({ ...prev, user: { ...prev.user, streak: calculateStreak(prev.user.completedDates) } }));
  }, []);

  const login = async (email: string, name: string) => {
    const today = new Date().toISOString().split('T')[0];
    setData(prev => ({ ...prev, user: { ...prev.user, email, name, isAuthenticated: true, streak: 1, lastActiveDate: today, completedDates: [] } }));
  };

  const logout = () => {
    setData(initialDefaultData);
    localStorage.removeItem('health_buddy_data');
  };

  const updateUser = (user: any) => setData((prev: any) => ({ ...prev, user: { ...prev.user, ...user } }));
  
  const updateProfile = (profile: any) => {
    setData((prev: any) => ({ ...prev, profile: { ...prev.profile, ...profile } }));
  };

  const updateMood = (mood: any) => setData((prev: any) => ({ ...prev, mood: { ...prev.mood, ...mood } }));

  const startTracker = (type: 'running' | 'walking' | 'cycling') => {
    setData(prev => ({
      ...prev,
      activeWorkout: { isRunning: true, isPaused: false, startTime: Date.now(), elapsed: 0, type }
    }));
  };

  const pauseTracker = () => {
    setData(prev => {
      if (!prev.activeWorkout) return prev;
      return {
        ...prev,
        activeWorkout: { ...prev.activeWorkout, isPaused: !prev.activeWorkout.isPaused }
      };
    });
  };

  const stopTracker = () => {
    setData(prev => {
      if (!prev.activeWorkout) return prev;
      const log = {
        type: prev.activeWorkout.type,
        duration: prev.activeWorkout.elapsed,
        steps: prev.dailyProgress.steps,
        calories: prev.dailyProgress.caloriesBurned,
        date: new Date().toISOString()
      };
      return {
        ...prev,
        logs: { ...prev.logs, workouts: [...prev.logs.workouts, log] },
        activeWorkout: null
      };
    });
  };

  const toggleMinimumMode = () => {
    setData(prev => ({
      ...prev,
      dailyProgress: { ...prev.dailyProgress, isMinimumMode: !prev.dailyProgress.isMinimumMode }
    }));
  };

  const chatWithBuddy = async (message: string) => {
    const msg = { role: 'user' as const, content: message, timestamp: new Date().toISOString() };
    setData(prev => ({ ...prev, logs: { ...prev.logs, chatHistory: [...prev.logs.chatHistory, msg] } }));
    return msg;
  };

  const setChatResponse = (content: string) => {
    const msg = { role: 'buddy' as const, content, timestamp: new Date().toISOString() };
    setData(prev => ({ ...prev, logs: { ...prev.logs, chatHistory: [...prev.logs.chatHistory, msg] } }));
  };

  const setDailyPlan = (plan: any) => setData((prev: any) => ({
    ...prev,
    dailyPlan: plan,
    dailyProgress: { ...prev.dailyProgress, workoutCompleted: false, mealsCompleted: [] }
  }));

  const finalizePlan = (plan: any) => {
    const today = new Date().toISOString().split('T')[0];
    setData(prev => ({
      ...prev,
      dailyPlan: plan,
      masterPlan: {
        startDate: today,
        totalDays: prev.profile.targetTimeline * 7,
        currentDay: 1,
        plans: [plan],
        isActive: true,
        compensationQueue: []
      },
      user: { ...prev.user, lastActiveDate: today, streak: (prev.user.streak || 0) + 1 },
      dailyProgress: { ...prev.dailyProgress, workoutCompleted: false, mealsCompleted: [], steps: 0, waterGlass: 0 }
    }));
  };

  const resetPlan = () => setData((prev: any) => ({ ...prev, dailyPlan: null, masterPlan: null, dailyProgress: initialDefaultData.dailyProgress }));

  const getPlanDayNumber = () => {
    if (!data.masterPlan?.startDate) return 0;
    const start = new Date(data.masterPlan.startDate);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const toggleExercise = (name: string) => {
    setData(prev => {
      if (!prev.dailyPlan?.workout) return prev;
      const updated = prev.dailyPlan.workout.exercises.map((e: any) => e.name === name ? { ...e, completed: !e.completed } : e);
      return { ...prev, dailyPlan: { ...prev.dailyPlan, workout: { ...prev.dailyPlan.workout, exercises: updated } } };
    });
    setTimeout(checkDailyCompletion, 100);
  };

  const toggleMeal = (id: string) => {
    setData(prev => {
      const completed = prev.dailyProgress.mealsCompleted.includes(id)
        ? prev.dailyProgress.mealsCompleted.filter(m => m !== id)
        : [...prev.dailyProgress.mealsCompleted, id];
      return { ...prev, dailyProgress: { ...prev.dailyProgress, mealsCompleted: completed } };
    });
    setTimeout(checkDailyCompletion, 100);
  };

  const toggleRitual = (id: string) => {
    setData(prev => {
      const completed = prev.dailyProgress.ritualsCompleted.includes(id)
        ? prev.dailyProgress.ritualsCompleted.filter(m => m !== id)
        : [...prev.dailyProgress.ritualsCompleted, id];
      return { ...prev, dailyProgress: { ...prev.dailyProgress, ritualsCompleted: completed } };
    });
  };

  const addWater = () => setData(prev => ({ ...prev, dailyProgress: { ...prev.dailyProgress, waterGlass: prev.dailyProgress.waterGlass + 1 } }));
  const updateSteps = (steps: number) => setData(prev => ({ ...prev, dailyProgress: { ...prev.dailyProgress, steps } }));
  
  const addCompensatoryExercises = (exercises: any[]) => {
    setData(prev => {
      if (!prev.dailyPlan?.workout) return prev;
      const currentExercises = prev.dailyPlan.workout.exercises || [];
      return {
        ...prev,
        dailyPlan: {
          ...prev.dailyPlan,
          workout: {
            ...prev.dailyPlan.workout,
            exercises: [...currentExercises, ...exercises]
          }
        }
      };
    });
  };

  const setDietWarning = (warning: string) => {
    setData(prev => ({
      ...prev,
      dailyPlan: { ...prev.dailyPlan, dietWarning: warning }
    }));
  };

  const submitDailyCheckin = (checkin: any) => {
    const today = new Date().toISOString().split('T')[0];
    setData(prev => ({
      ...prev,
      logs: { ...prev.logs, dailyCheckins: [...prev.logs.dailyCheckins.filter((c: any) => c.date !== today), { date: today, ...checkin }] }
    }));
    setShowCheckin(false);
  };

  return (
    <HealthContext.Provider value={{
      data, isLoaded, showCheckin, setShowCheckin,
      login, logout, updateUser, updateProfile, updateMood,
      startTracker, pauseTracker, stopTracker, toggleMinimumMode, chatWithBuddy, setChatResponse,
      setDailyPlan, finalizePlan, resetPlan, getPlanDayNumber,
      toggleExercise, toggleMeal, toggleRitual, addWater, updateSteps,
      addCompensatoryExercises, setDietWarning, submitDailyCheckin
    }}>
      {children}
    </HealthContext.Provider>
  );
}

export const useHealth = () => useContext(HealthContext);
