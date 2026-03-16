export interface HealthMetrics {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  targetWeight: number; // in kg
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  targetTimelineWeeks: number;
}

export const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

export const calculateBMR = (metrics: HealthMetrics): number => {
  const { age, gender, height, weight } = metrics;
  // Mifflin-St Jeor Equation
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  if (gender === 'male') {
    bmr += 5;
  } else if (gender === 'female') {
    bmr -= 161;
  }
  return Math.round(bmr);
};

export const calculateDailyCalorieRequirement = (bmr: number, activityLevel: HealthMetrics['activityLevel']): number => {
  const multipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
  };
  return Math.round(bmr * multipliers[activityLevel]);
};

export const calculateTargets = (metrics: HealthMetrics) => {
  const bmr = calculateBMR(metrics);
  const maintenanceCalories = calculateDailyCalorieRequirement(bmr, metrics.activityLevel);
  const weightDiff = metrics.weight - metrics.targetWeight;
  const totalCalorieDeficitNeeded = weightDiff * 7700; // ~7700 kcal per kg of fat
  const dailyDeficit = totalCalorieDeficitNeeded / (metrics.targetTimelineWeeks * 7);
  
  return {
    bmi: calculateBMI(metrics.weight, metrics.height),
    bmr,
    maintenanceCalories,
    targetCalories: Math.round(maintenanceCalories - dailyDeficit),
    requiredDeficit: Math.round(dailyDeficit),
    protein: Math.round(metrics.weight * 2.2), // 2.2g per kg (high for muscle preservation)
    fats: Math.round((maintenanceCalories * 0.25) / 9), // 25% of calories
    carbs: Math.round((maintenanceCalories - (metrics.weight * 2.2 * 4) - ((maintenanceCalories * 0.25))) / 4),
  };
};
