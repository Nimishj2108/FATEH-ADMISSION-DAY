import React, { useEffect } from 'react';
import { useFatehStore } from '../../store/useFatehStore';
import confetti from 'canvas-confetti';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Sparkles,
  ChevronRight,
  Eye,
  EyeOff,
  Award,
  Users,
} from 'lucide-react';
import { sound } from '../../utils/audio';

export const StageSpotlight: React.FC = () => {
  const {
    spotlightCandidates,
    activeSpotlightCandidateId,
    setActiveSpotlightCandidate,
    spotlightSecondsLeft,
    spotlightRunning,
    startSpotlightTimer,
    pauseSpotlightTimer,
    adjustSpotlightTimer,
    resetSpotlightTimer,
    endSpotlightTimer,
    spotlightHideMarks,
    toggleHideMarks,
  } = useFatehStore();

  const activeCandidate =
    spotlightCandidates.find((c) => c.id === activeSpotlightCandidateId) ||
    spotlightCandidates[0];

  // Working countdown ticker
  useEffect(() => {
    if (!spotlightRunning) return;

    const timer = setInterval(() => {
      if (spotlightSecondsLeft <= 1) {
        endSpotlightTimer();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#944F62', '#9BBFCC', '#261A23', '#FF4D9D'],
        });
      } else {
        adjustSpotlightTimer(-1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [spotlightRunning, spotlightSecondsLeft, adjustSpotlightTimer, endSpotlightTimer]);

  const elapsedSeconds = 300 - spotlightSecondsLeft; // 5:00 = 300s
  const minutes = Math.floor(spotlightSecondsLeft / 60);
  const seconds = spotlightSecondsLeft % 60;
  const isUrgent = spotlightSecondsLeft <= 30 && spotlightSecondsLeft > 0;

  // Reveal schedule:
  // intro 0:00
  // interests 1:00 (60s)
  // story 2:00 (120s)
  // dream stalls 3:30 (210s)
  // ask-the-room 4:30 (270s)
  const showInterests = elapsedSeconds >= 60;
  const showStory = elapsedSeconds >= 120;
  const showDreamStalls = elapsedSeconds >= 210;
  const showAskTheRoom = elapsedSeconds >= 270;

  return (
    <div className="h-full flex flex-col justify-between p-4 md:p-8 space-y-4 text-[#FBF6F0]">
      
      {/* Top Stage Bar & Operator HUD */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-black/50 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#944F62] animate-ping" />
          <span className="font-display font-extrabold text-xl tracking-tight text-white">
            STAGE SPOTLIGHT • 5-MINUTE CANDIDATE PITCH
          </span>
          <span className="text-[10px] font-mono bg-[#944F62]/40 text-[#FBF6F0] px-2 py-0.5 rounded border border-[#944F62]">
            Hotel Lalit Main Screen
          </span>
        </div>

        {/* Operator Controls Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleHideMarks}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
              spotlightHideMarks
                ? 'bg-amber-900/60 text-amber-200 border-amber-500'
                : 'bg-white/10 text-white/80 border-white/20'
            }`}
          >
            {spotlightHideMarks ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{spotlightHideMarks ? 'Marks Hidden' : 'Show Marks'}</span>
          </button>

          <div className="flex items-center gap-1 bg-white/10 p-1 rounded-lg border border-white/20">
            <button
              onClick={() => adjustSpotlightTimer(-30)}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded cursor-pointer"
              title="-30s"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={spotlightRunning ? pauseSpotlightTimer : startSpotlightTimer}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold text-xs cursor-pointer ${
                spotlightRunning
                  ? 'bg-amber-600 text-white'
                  : 'bg-emerald-600 text-white shadow-lg'
              }`}
            >
              {spotlightRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{spotlightRunning ? 'Pause' : 'GO LIVE'}</span>
            </button>

            <button
              onClick={() => adjustSpotlightTimer(30)}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded cursor-pointer"
              title="+30s"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={resetSpotlightTimer}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded cursor-pointer"
              title="Reset 5:00"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Stage Grid: Candidate Cards Rail (All 6) + Enlarged Active Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 items-stretch">
        
        {/* Left Col: 6-Candidate Lineup Rail */}
        <div className="space-y-2 bg-black/40 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex flex-col justify-between overflow-y-auto max-h-[580px]">
          <span className="text-[11px] font-mono text-[#9BBFCC] uppercase tracking-wider block px-1">
            Spotlight Queue (All 6 Candidates):
          </span>

          <div className="space-y-2">
            {spotlightCandidates.map((c) => {
              const isActive = c.id === activeCandidate.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveSpotlightCandidate(c.id)}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#944F62] text-white border-white shadow-lg scale-[1.02]'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-display font-bold text-sm text-white truncate pr-2">
                      {c.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#9BBFCC] shrink-0">
                      {c.zone.split(' ')[0]}
                    </span>
                  </div>
                  <span className="text-[11px] block text-white/80 line-clamp-1">
                    {c.headline}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-[11px] font-mono text-center text-[#9BBFCC]">
            Keyboard: <strong>Space</strong> (Pause/Play) • <strong>N</strong> (Next)
          </div>
        </div>

        {/* Center & Right: Enlarged Active Candidate Hero Showcase */}
        <div className="lg:col-span-3 bg-gradient-to-br from-[#261A23] via-[#1E141C] to-black rounded-3xl p-6 md:p-8 border-2 border-white/20 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          
          {/* Top Row: Candidate Identity & Circular Timer Ring */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/15 pb-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold bg-[#9BBFCC] text-[#261A23] px-2.5 py-0.5 rounded-full">
                  Candidate #{activeCandidate.id.replace('spot-', '')} • Verified
                </span>
                <span className="text-xs font-mono text-[#9BBFCC]">
                  {activeCandidate.college} • {activeCandidate.zone}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded">
                  Consented Profile
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-display font-extrabold tracking-tight text-white pt-0.5">
                {activeCandidate.name}
              </h2>
              <p className="text-sm md:text-base text-[#9BBFCC] font-body">
                {activeCandidate.headline}
              </p>

              {/* Hardcoded Academic Biometrics Bar */}
              {!spotlightHideMarks && (
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-white/90">
                  <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10">
                    Academics: <strong className="text-emerald-300">82.4% Aggregate</strong>
                  </span>
                  <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10">
                    IELTS: <strong className="text-[#FFB81C]">7.5 (L:8.5, R:8.0, W:7.0, S:7.0)</strong>
                  </span>
                  <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10">
                    Intake: <strong className="text-[#9BBFCC]">Fall 2027</strong>
                  </span>
                  <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10">
                    Budget: <strong className="text-white">₹24 - 28 Lakhs</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Circular Countdown Ring */}
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all ${
                  isUrgent
                    ? 'border-red-500 bg-red-950/40 text-red-300 animate-pulse'
                    : 'border-[#944F62] bg-black/60 text-white shadow-xl'
                }`}
              >
                <Clock className="w-5 h-5 text-[#9BBFCC] mb-0.5" />
                <span className="text-2xl font-mono font-extrabold tabular-nums">
                  {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </span>
                <span className="text-[9px] font-mono text-white/60">
                  {spotlightSecondsLeft === 0 ? 'CONCLUDED' : 'PITCH TIME'}
                </span>
              </div>
            </div>
          </div>

          {/* Timed Content Reveal Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
            
            {/* Story Points (Revealed at 2:00) */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                showStory
                  ? 'bg-white/10 border-white/20 opacity-100'
                  : 'bg-white/5 border-dashed border-white/10 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono text-[#9BBFCC] mb-2">
                <span className="font-bold uppercase tracking-wider">The Candidate Story (02:00)</span>
                {!showStory && <span>Reveals at 02:00</span>}
              </div>

              {showStory ? (
                <ul className="space-y-2.5 text-xs md:text-sm text-[#FBF6F0] leading-relaxed font-body">
                  {activeCandidate.storyLines.map((line, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#FF4D9D] font-bold text-base leading-none">›</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-8 text-center text-xs text-white/50 italic">
                  Story lines will appear after 2 minutes of stage conversation.
                </div>
              )}
            </div>

            {/* Right Side: Dream Stalls & Ask the Room */}
            <div className="space-y-3">
              
              {/* Dream Stalls (Revealed at 3:30) */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  showDreamStalls
                    ? 'bg-white/10 border-white/20 opacity-100'
                    : 'bg-white/5 border-dashed border-white/10 opacity-40'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono text-[#9BBFCC] mb-2">
                  <span className="font-bold uppercase tracking-wider">Target Ballroom Stalls (03:30)</span>
                  {!showDreamStalls && <span>Reveals at 03:30</span>}
                </div>

                {showDreamStalls ? (
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap gap-2">
                      {activeCandidate.dreamStalls.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-mono px-3 py-1 rounded-lg bg-[#944F62] text-white border border-white/30 font-bold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] text-white/70 font-mono pt-1">
                      Priority meetings booked with university department deans at 11:30 AM & 2:00 PM.
                    </p>
                  </div>
                ) : (
                  <div className="py-4 text-xs text-white/50 italic">
                    Target stalls locked until 03:30 timestamp.
                  </div>
                )}
              </div>

              {/* Ask The Room (Revealed at 4:30) */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  showAskTheRoom
                    ? 'bg-gradient-to-r from-[#944F62]/40 to-[#7C3AED]/40 border-white/30 opacity-100'
                    : 'bg-white/5 border-dashed border-white/10 opacity-40'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono text-[#FF4D9D] mb-1">
                  <span className="font-bold uppercase tracking-wider">Ask to the Ballroom (04:30)</span>
                  {!showAskTheRoom && <span>Reveals at 04:30</span>}
                </div>

                {showAskTheRoom ? (
                  <p className="text-xs md:text-sm text-white font-medium italic leading-relaxed">
                    "{activeCandidate.askTheRoom}"
                  </p>
                ) : (
                  <div className="py-2 text-xs text-white/50 italic">
                    Room pitch prompt locked until final 30 seconds.
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Bottom Fateh Moment Quote & Prize Award */}
          <div className="p-3.5 bg-black/60 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF4D9D] shrink-0" />
              <span className="text-[#FBF6F0]/80 italic">
                Fateh Moment: "{activeCandidate.fatehMoment}"
              </span>
            </div>

            {spotlightSecondsLeft === 0 && (
              <div className="flex items-center gap-2 bg-[#944F62] text-white px-3 py-1 rounded-lg font-mono font-bold shrink-0">
                <Award className="w-4 h-4" />
                <span>Prize Awarded: Free Consultation + University Swag</span>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
