"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  mdSize?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  unit?: string;
}

export default function ProgressRing({
  value,
  max,
  size = 120,
  mdSize,
  strokeWidth = 10,
  color = "#3b82f6",
  label,
  unit,
}: ProgressRingProps) {
  const [currentSize, setCurrentSize] = useState(size);

  useEffect(() => {
    if (!mdSize) return;
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setCurrentSize(mdSize);
      } else {
        setCurrentSize(size);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [size, mdSize]);

  const radius = (currentSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center transition-all duration-300" style={{ width: currentSize, height: currentSize }}>
      <svg width={currentSize} height={currentSize} className="transform -rotate-90">
        <circle
          cx={currentSize / 2}
          cy={currentSize / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-100 dark:text-gray-800"
        />
        <motion.circle
          cx={currentSize / 2}
          cy={currentSize / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xl md:text-3xl font-black tracking-tighter">{value}</span>
        <div className="flex flex-col -space-y-1">
          {unit && <span className="text-[8px] md:text-[10px] uppercase opacity-40 font-black tracking-widest">{unit}</span>}
          {label && <span className="text-[8px] md:text-[10px] uppercase opacity-20 font-black tracking-widest">{label}</span>}
        </div>
      </div>
    </div>
  );
}
