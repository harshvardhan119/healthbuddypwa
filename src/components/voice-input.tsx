"use client";

import { useState } from "react";
import { Mic, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VoiceInput({ onResult }: { onResult: (text: string) => void }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <div>
      <button 
        onClick={() => setIsListening(true)}
        className="glass p-3 rounded-full text-primary hover:bg-primary hover:text-white transition-colors"
      >
        <Mic size={20} />
      </button>

      <AnimatePresence>
        {isListening && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-8 space-y-12"
          >
            <div className="relative">
               <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-primary/40 rounded-full blur-2xl"
               />
               <div className="relative w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white scale-110">
                  <Mic size={40} />
               </div>
            </div>

            <div className="text-center space-y-4 max-w-xs">
               <h2 className="text-2xl font-black">Listening...</h2>
               <p className="text-lg font-medium opacity-60">
                 {transcript || "Say something like 'I had two eggs and toast'"}
               </p>
            </div>

            <div className="flex gap-4">
               <button 
                 onClick={() => setIsListening(false)}
                 className="w-16 h-16 rounded-full glass flex items-center justify-center text-red-500"
               >
                 <X size={24} />
               </button>
               {transcript && (
                 <button 
                   onClick={() => {
                     onResult(transcript);
                     setIsListening(false);
                     setTranscript("");
                   }}
                   className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white"
                 >
                   <Send size={24} />
                 </button>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
