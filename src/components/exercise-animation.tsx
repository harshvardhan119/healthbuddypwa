"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";

const ANIMATIONS: Record<string, string> = {
  pushups: "https://assets10.lottiefiles.com/packages/lf20_96bov0ig.json",
  squats: "https://assets10.lottiefiles.com/packages/lf20_atun8p.json",
  jumping_jacks: "https://assets10.lottiefiles.com/packages/lf20_6x8bhv.json",
  yoga: "https://assets10.lottiefiles.com/packages/lf20_m6cuL6.json",
  stretching: "https://assets5.lottiefiles.com/packages/lf20_peruaw4u.json",
};

export default function ExerciseAnimation({ name }: { name: string }) {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    // Normalize name
    const key = name.toLowerCase().replace(/\s+/g, '_');
    const url = ANIMATIONS[key] || ANIMATIONS['yoga'];

    fetch(url)
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error("Lottie Load Error:", err));
  }, [name]);

  if (!animationData) return <div className="w-full h-40 bg-white/5 animate-pulse rounded-2xl" />;

  return (
    <div className="w-full h-48 flex items-center justify-center p-4">
      <Lottie animationData={animationData} loop={true} style={{ height: '100%' }} />
    </div>
  );
}
