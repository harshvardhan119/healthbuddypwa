"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useHealth } from "@/lib/health-context";

// Live Step Counter using Accelerometer API
// Detects step-like peaks from device motion data
export function useStepCounter() {
  const { data, updateSteps } = useHealth();
  const [isActive, setIsActive] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const stepsRef = useRef(data.dailyProgress?.steps || 0);
  const lastPeakRef = useRef(0);
  const lastValRef = useRef(0);
  const isRisingRef = useRef(false);

  const requestPermission = useCallback(async () => {
    // Check for DeviceMotionEvent permission (required on iOS)
    if (typeof (DeviceMotionEvent as any)?.requestPermission === 'function') {
      try {
        const perm = await (DeviceMotionEvent as any).requestPermission();
        if (perm === 'granted') {
          setPermissionGranted(true);
          return true;
        }
      } catch (e) {
        console.error("Motion permission denied:", e);
        return false;
      }
    } else {
      // Android/desktop — no permission needed
      setPermissionGranted(true);
      return true;
    }
    return false;
  }, []);

  const startCounting = useCallback(async () => {
    const granted = await requestPermission();
    if (!granted) return;

    const THRESHOLD = 1.2;    // acceleration threshold for a "step"
    const MIN_GAP_MS = 300;   // minimum time between steps

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

      const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
      const normalized = Math.abs(magnitude - 9.81); // Remove gravity
      const now = Date.now();

      // Peak detection
      if (normalized > THRESHOLD && !isRisingRef.current) {
        isRisingRef.current = true;
      }

      if (isRisingRef.current && normalized < THRESHOLD * 0.6) {
        isRisingRef.current = false;
        if (now - lastPeakRef.current > MIN_GAP_MS) {
          lastPeakRef.current = now;
          stepsRef.current += 1;
          // Update context every 5 steps for performance
          if (stepsRef.current % 5 === 0) {
            updateSteps(stepsRef.current);
          }
        }
      }

      lastValRef.current = normalized;
    };

    window.addEventListener('devicemotion', handleMotion);
    setIsActive(true);

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      setIsActive(false);
    };
  }, [requestPermission, updateSteps]);

  // Auto-start if we have permission
  useEffect(() => {
    if (permissionGranted && !isActive) {
      startCounting();
    }
  }, [permissionGranted, isActive, startCounting]);

  // Sync final count on unmount
  useEffect(() => {
    return () => {
      updateSteps(stepsRef.current);
    };
  }, [updateSteps]);

  return {
    steps: stepsRef.current,
    isActive,
    permissionGranted,
    requestPermission: startCounting,
  };
}
