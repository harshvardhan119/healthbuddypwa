import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || "",
  dangerouslyAllowBrowser: true
});

export interface HealthState {
  profile: any;
  mood: any;
  history: any;
  dayNumber?: number;
  totalDays?: number;
}

export const getAIPlanning = async (state: HealthState) => {
  const dayInfo = state.dayNumber
    ? `This is DAY ${state.dayNumber} of a ${state.totalDays}-day plan. Adapt the exercises and meals to the progression stage. Early days = lighter intro. Mid phase = peak intensity. Final phase = consolidation & maintenance.`
    : `This is a fresh plan generation. The user's goal timeline is ${state.profile.targetTimeline || 12} weeks (${(state.profile.targetTimeline || 12) * 7} days total).`;

  const prompt = `
    You are "AI Health Buddy", a world-class AI fitness coach.
    Analyze the user's complete profile and generate a FULL daily strategy.
    
    USER PROFILE: ${JSON.stringify(state.profile)}
    CURRENT FEELINGS: ${JSON.stringify(state.mood)}
    RECENT LOGS: ${JSON.stringify(state.history)}
    
    ${dayInfo}
    
    RULES:
    - The user has set their goal as: "${state.profile.goal || 'get_fit'}"
    - Diet preference: "${state.profile.dietPreference || 'Veg'}"
    - Activity level: "${state.profile.activityLevel || 'moderately_active'}"
    - Wake-up time: ${state.profile.wakeUpTime || '06:00'}, Sleep time: ${state.profile.sleepTime || '22:00'}
    - Medical conditions: "${state.profile.medicalConditions || 'None'}"
    - Allergies: ${JSON.stringify(state.profile.allergies || [])}
    
    STRICT RULES:
    1. If calorie deficit is aggressive, EXPLAIN CONSEQUENCES in "consequences".
    2. Exercises and meals MUST respect the user's dietary restrictions and medical conditions.
    
    RESPONSE FORMAT (JSON):
    {
      "strategy": "Overall strategy for this day",
      "coachQuote": "Short motivational quote",
      "consequences": "Analysis of their diet/goal path",
      "schedule": [
        { "time": "06:30", "task": "Morning hydration", "type": "routine" }
      ],
      "workout": {
        "focus": "Today's focus area",
        "exercises": [
          { "name": "Exercise", "sets": 3, "reps": "12", "calories": 50, "type": "cardio", "time": "10:00" }
        ]
      },
      "diet": {
        "focus": "Nutrition focus",
        "totalCalories": 2000,
        "breakfast": { "meals": ["Food A"], "calories": 400, "macros": {"p": 30, "c": 40, "f": 10}, "time": "08:00" },
        "lunch": { "meals": ["Food A"], "calories": 600, "macros": {"p": 40, "c": 60, "f": 20}, "time": "13:00" },
        "dinner": { "meals": ["Food A"], "calories": 500, "macros": {"p": 35, "c": 45, "f": 15}, "time": "19:00" },
        "snacks": { "meals": ["Snack A"], "calories": 200, "macros": {"p": 10, "c": 20, "f": 5}, "time": "16:00" }
      },
      "predictions": {
        "weightChange": "Expected change",
        "moodImprovement": "Expected mood shift"
      }
    }
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a professional fitness coach. You must only respond with valid JSON." },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });
    const content = chatCompletion.choices[0]?.message?.content;
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error("Groq AI Planner Error:", error);
    return null;
  }
};

export const analyzeFoodImpact = async (state: HealthState, foodInput: string, currentPlan: any) => {
  const prompt = `
    You are the "AI Health Buddy" nutritionist and coach.
    The user is about to eat (or requesting analysis for): "${foodInput}"
    
    USER PROFILE: ${JSON.stringify(state.profile)}
    GOAL: ${state.profile.goal}
    MEDICAL CONDITIONS: ${state.profile.medicalConditions}
    ALLERGIES: ${JSON.stringify(state.profile.allergies)}
    
    Analyze the immediate consequences of eating this based on their goal and medical profile.
    If this food is a "cheat" meal, high in bad calories, or violates their diet/goal significantly, you MUST generate 1 to 3 extra "compensatory" exercises they must do to burn it off or counteract it.
    If it's a very healthy meal that aligns with their goals, praise them and return an empty exercises array.
    
    RESPONSE FORMAT (JSON):
    {
      "analysis": "A direct, conversational message to the user analyzing the food. Be honest. If it's bad for their goal or medical condition, tell them the consequences. Keep it under 3 sentences.",
      "isHealthy": boolean,
      "estimatedCalories": number,
      "extraExercises": [
        { "name": "Name of new exercise to burn this off", "sets": 3, "reps": "15", "calories": 100, "type": "cardio", "time": "Anytime" }
      ]
    }
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a harsh but caring health buddy. You must only respond with valid JSON." },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });
    const content = chatCompletion.choices[0]?.message?.content;
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error("Groq AI Food Analyzer Error:", error);
    return null;
  }
};

export const buddyChat = async (state: HealthState, history: any[], message: string) => {
  const prompt = `
    You are the "AI Health Buddy". You are a proactive, supportive, and slightly geeky health coach.
    
    CONTEXT:
    - User Profile: ${JSON.stringify(state.profile)}
    - Daily Progress: ${JSON.stringify(state.history)}
    - Current Plan Day: ${state.dayNumber} of ${state.totalDays}
    
    HISTORY:
    ${JSON.stringify(history.slice(-10))}
    
    USER'S LATEST MESSAGE: "${message}"
    
    YOUR CAPABILITIES:
    1. Answer doubts about fitness, health, and diet.
    2. Provide progress reports based on history.
    3. EDIT THE USER'S GOALS OR PLAN: If the user asks to change their path, goal, or timeline, YOU MUST confirm you've done it in your response and describe the change.
    
    RESPONSE FORMAT (JSON):
    {
      "reply": "Your conversational reply to the user. Keep it fun and helpful.",
      "updates": {
        "profile": { "goal": "new goal", "targetWeight": 70 }, // Only if they requested a change
        "planAdjustment": "Brief description of plan change" // if any
      },
      "report": "If they asked for a report, provide a structured summary here, else null"
    }
  `;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are the AI Health Buddy. Respond in JSON. If the user asks to edit their goal, update the profile object in your response." },
        { role: "user", content: prompt },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });
    const content = chatCompletion.choices[0]?.message?.content;
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error("Groq AI Chat Error:", error);
    return null;
  }
};

export const reconcileMissedTasks = async (state: HealthState, missedTasks: any[]) => {
  const prompt = `
    The user missed several tasks today: ${JSON.stringify(missedTasks)}
    They are in "Minimum Mode" because of a busy schedule.
    
    Your task:
    1. Identify which tasks are essential and MUST be compensated for tomorrow or over the next few days.
    2. Group them or modify them to be efficient (e.g., if they missed 2 cardio sessions, maybe add 1 intense HIIT session tomorrow).
    3. Generate a list of "Compensatory Tasks" to add to future plans.
    
    RESPONSE FORMAT (JSON):
    {
       "compensationPlan": [
          { "name": "Compensatory HIIT", "sets": 1, "duration": 20, "type": "cardio", "reason": "Compensation for missed Monday workout" }
       ],
       "alert": "Message to user about the compensation"
    }
  `;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });
    const content = completion.choices[0]?.message?.content;
    return content ? JSON.parse(content) : null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

