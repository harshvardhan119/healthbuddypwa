"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone, BrainCircuit, CheckCircle2 } from "lucide-react";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show the prompt after a small delay to not annoy immediately
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-prompt-dismissed');
        if (!dismissed) {
          setShowPrompt(true);
        }
      }, 5000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (isInstalled) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          className="fixed bottom-24 md:bottom-10 left-4 right-4 md:left-auto md:right-10 md:w-96 z-[300] bg-slate-900 text-white rounded-[32px] p-6 shadow-2xl border border-white/10"
        >
          <div className="flex justify-between items-start mb-4">
             <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <BrainCircuit size={24} />
             </div>
             <button onClick={handleDismiss} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X size={18} className="opacity-40" />
             </button>
          </div>

          <div className="space-y-2 mb-6">
             <h3 className="text-xl font-black tracking-tight">Access Elite Health</h3>
             <p className="text-sm font-medium opacity-60 leading-relaxed">
                Add AI Health Buddy to your home screen for full tactical tracking and offline access.
             </p>
          </div>

          <div className="flex gap-3">
             <button 
               onClick={handleInstall}
               className="flex-1 bg-white text-slate-900 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl"
             >
                <Download size={16} /> INSTALL NOW
             </button>
             <div className="flex items-center gap-2 px-4 py-4 bg-white/5 rounded-2xl">
                <Smartphone size={16} className="text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Mobile v2</span>
             </div>
          </div>

          {/* iOS Instructions hint (simplified) */}
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] opacity-30">
             <CheckCircle2 size={10} /> Optimized for Matrix Persistence
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
