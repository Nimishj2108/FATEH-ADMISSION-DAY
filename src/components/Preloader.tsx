import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFatehStore } from '../store/useFatehStore';
import { Sparkles, ArrowRight } from 'lucide-react';

const STATUS_LINES = [
  'प्रणाम • Checking registration passes at Hotel Lalit, Delhi NCR...',
  'Inking 29 digital university & service passport stamps...',
  'Warming up TWIN discovery radar (anonymous mode)...',
  'Syncing Crystal Ballroom floor beacons & 24 university stalls...',
  'Calibrating Spin Your Fate live drum for 7+5 finishers...',
  'स्वागत है • Scene set hai! Crystal Ballroom is ready!',
];

export const Preloader: React.FC = () => {
  const { showPreloader, setShowPreloader, reducedMotion } = useFatehStore();
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    if (!showPreloader) return;

    setProgress(0);
    const totalDuration = 7500; // Increased to 7.5 seconds for higher display time
    const intervalTime = 40;
    const step = 100 / (totalDuration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => setShowPreloader(false), 500);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [showPreloader, setShowPreloader]);

  useEffect(() => {
    const idx = Math.min(
      STATUS_LINES.length - 1,
      Math.floor((progress / 100) * STATUS_LINES.length)
    );
    setStatusIndex(idx);
  }, [progress]);

  if (!showPreloader) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{
          clipPath: ['polygon(0 0, 100% 0, 100% 100%, 0 100%)', 'polygon(50% 0, 50% 0, 50% 100%, 50% 100%)'],
          opacity: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#261A23] text-[#FBF6F0] p-6 md:p-12 overflow-hidden select-none"
      >
        {/* Floating petals particles background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-6 rounded-full bg-gradient-to-br from-[#944F62] to-[#9BBFCC]"
              style={{
                left: `${(i * 6.5) % 95}%`,
                top: `-20px`,
                transform: `rotate(${i * 24}deg)`,
              }}
              animate={
                reducedMotion
                  ? {}
                  : {
                      y: ['0vh', '110vh'],
                      x: [0, (i % 2 === 0 ? 25 : -25)],
                      rotate: [0, 360],
                    }
              }
              transition={{
                duration: 4 + (i % 4),
                repeat: Infinity,
                ease: 'linear',
                delay: (i * 0.25) % 3,
              }}
            />
          ))}
        </div>

        {/* Top brand header */}
        <div className="w-full flex items-center justify-between z-10 max-w-5xl">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-xl tracking-tight text-[#FBF6F0]">
              FATEH <span className="text-[#9BBFCC]">EDUCATION</span>
            </span>
            <span className="text-xs font-mono uppercase bg-[#944F62]/40 text-[#FBF6F0] px-2 py-0.5 rounded border border-[#944F62]">
              Hotel Lalit • Delhi NCR
            </span>
          </div>

          <button
            onClick={() => setShowPreloader(false)}
            className="flex items-center gap-1.5 text-xs font-mono text-[#9BBFCC] hover:text-[#FBF6F0] transition-colors py-1 px-3 border border-[#9BBFCC]/40 rounded-full hover:border-[#9BBFCC] cursor-pointer"
          >
            <span>Skip Intro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Centerpiece: Rotating Mandala + Giant Devanagari "नमस्ते" */}
        <div className="flex flex-col items-center justify-center my-auto z-10 text-center">
          <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80 mb-6">
            {/* Rotating Decorative Mandala Ring */}
            <motion.div
              animate={reducedMotion ? {} : { rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 flex items-center justify-center opacity-70"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full text-[#944F62]">
                <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
                <circle cx="100" cy="100" r="76" fill="none" stroke="#9BBFCC" strokeWidth="1" />
                {[...Array(12)].map((_, idx) => {
                  const angle = (idx * 30 * Math.PI) / 180;
                  const x = 100 + 84 * Math.cos(angle);
                  const y = 100 + 84 * Math.sin(angle);
                  return (
                    <circle key={idx} cx={x} cy={y} r="3" fill="#FBF6F0" />
                  );
                })}
              </svg>
            </motion.div>

            {/* Inner glow halo */}
            <div className="absolute w-52 h-52 rounded-full bg-gradient-to-r from-[#944F62]/40 via-[#FFB81C]/25 to-[#9BBFCC]/30 blur-3xl animate-pulse" />

            {/* Giant Devanagari नमस्ते */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.05, 1], opacity: 1 }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
              className="relative z-10 flex flex-col items-center"
            >
              <h1
                className="font-hindi text-7xl md:text-8xl tracking-normal text-[#FBF6F0] drop-shadow-[0_8px_32px_rgba(255,184,28,0.45)] select-none"
                style={{ fontFamily: "'Rozha One', 'Tiro Devanagari Hindi', serif" }}
              >
                नमस्ते
              </h1>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <h2 className="text-xl md:text-2xl font-display font-bold tracking-tight text-[#FBF6F0]">
              स्वागत है • Welcome to Fateh Admission Day
            </h2>
            <p className="text-sm font-body text-[#9BBFCC] max-w-md mx-auto">
              24 October • Crystal Ballroom, The Lalit, New Delhi
            </p>
          </motion.div>
        </div>

        {/* Bottom Progress Bar & Status */}
        <div className="w-full max-w-xl z-10 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#9BBFCC]">
            <span className="flex items-center gap-1.5 truncate pr-2">
              <Sparkles className="w-3.5 h-3.5 text-[#944F62] shrink-0 animate-spin" />
              <span className="truncate">{STATUS_LINES[statusIndex]}</span>
            </span>
            <span className="shrink-0 font-bold text-[#FBF6F0] tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>

          {/* Dual tone progress bar */}
          <div className="w-full h-2.5 bg-[#261A23] border border-[#944F62] rounded-full overflow-hidden p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-[#944F62] via-[#9BBFCC] to-[#FBF6F0] rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-[#9BBFCC]/70 font-mono pt-1">
            <span>Powered by Fateh OS</span>
            <span>Click anywhere or Skip to enter</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
