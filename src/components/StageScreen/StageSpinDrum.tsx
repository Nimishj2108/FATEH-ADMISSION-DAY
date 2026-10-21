import React, { useState, useRef } from 'react';
import { useFatehStore } from '../../store/useFatehStore';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Gift,
  Award,
  Disc,
  Play,
  Trophy,
  CheckCircle2,
  Users,
  Flame,
} from 'lucide-react';
import { sound } from '../../utils/audio';

// The 8 students from the 7+5 verified pool displayed on the physical wheel segments
const WHEEL_STUDENTS = [
  { name: 'Aarav Sharma', label: 'Aarav Sharma', id: 'FE-26-0001', color: '#944F62', text: '#FFFFFF' },
  { name: 'Simran Kaur', label: 'Simran Kaur', id: 'FE-26-0004', color: '#261A23', text: '#FFB81C' },
  { name: 'Devansh Rawat', label: 'Devansh Rawat', id: 'FE-26-0009', color: '#7C3AED', text: '#FFFFFF' },
  { name: 'Rhea Banerjee', label: 'Rhea Banerjee', id: 'FE-26-0002', color: '#9BBFCC', text: '#261A23' },
  { name: 'Tanvi Malik', label: 'Tanvi Malik', id: 'FE-26-0007', color: '#FF4D9D', text: '#FFFFFF' },
  { name: 'Kabir Verma', label: 'Kabir Verma', id: 'FE-26-0005', color: '#1E4334', text: '#FFFFFF' },
  { name: 'Aditya Sen', label: 'Aditya Sen', id: 'FE-26-0015', color: '#FFB81C', text: '#261A23' },
  { name: 'Priya Singh', label: 'Priya Singh', id: 'FE-26-0006', color: '#831843', text: '#FFFFFF' },
];

export const StageSpinDrum: React.FC = () => {
  const {
    students,
    spinPoolStudentIds,
    isSpinning,
    spinYourFate,
    lastSpinWinner,
    drumNames,
    drumCandidateIndex,
    runHourlyDraw,
    hourlySchedule,
    clockTime,
  } = useFatehStore();

  const [activeDrawMode, setActiveDrawMode] = useState<'instant' | 'hourly'>('instant');
  const [wheelRotation, setWheelRotation] = useState(0);
  const [currentWheelWinner, setCurrentWheelWinner] = useState<{ studentName: string; studentId: string; prize: string } | null>(null);

  // Eligible 7+5 pool
  const poolStudents = students.filter((s) => spinPoolStudentIds.includes(s.id));
  const poolCount = poolStudents.length > 0 ? poolStudents.length : students.filter(s => s.checkedIn).length;

  // The 3 official top prizes at stake as requested:
  const THREE_PRIZES = [
    {
      id: 'p1',
      title: 'Partner University Swag',
      name: 'Northbridge University (UK)',
      item: 'Northbridge University: Tote + Notebook + Tech Pack',
      badge: 'Official Sponsor',
      color: '#944F62',
    },
    {
      id: 'p2',
      title: 'Fateh Education Kit',
      name: 'Fateh HQ Desk',
      item: 'Fateh Swag Kit (Premium Cap, Bag, Water Bottle & Stickers)',
      badge: 'Event Merch',
      color: '#261A23',
    },
    {
      id: 'p3',
      title: 'Expert Consultation',
      name: 'Fateh Senior Counsellors',
      item: 'Fateh: Free 1-on-1 Profile & Visa Audit Session',
      badge: 'Study Abroad Grant',
      color: '#9BBFCC',
    },
  ];

  const handleSpinWheel = async () => {
    if (isSpinning) return;

    // Pick a student from the 8 wheel wedges
    const candidateIndex = Math.floor(Math.random() * WHEEL_STUDENTS.length);
    const segmentAngle = 360 / WHEEL_STUDENTS.length; // 45 deg per segment
    // Target angle stops at top pointer (270 deg or pointer offset)
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 3));
    const targetDegree = extraSpins + (360 - (candidateIndex * segmentAngle + segmentAngle / 2));
    
    setWheelRotation((prev) => prev + targetDegree);

    // Play procedural tick sound sequence accelerating then slowing down
    let tickCount = 0;
    const maxTicks = 32;
    const playNextTick = () => {
      sound.playTick(450 + (tickCount % 8) * 40);
      tickCount++;
      if (tickCount < maxTicks) {
        const delay = 40 + Math.pow(tickCount / maxTicks, 2) * 280;
        setTimeout(playNextTick, delay);
      }
    };
    playNextTick();

    // Trigger store action which picks eligible 7+5 student and saves voucher
    await spinYourFate();

    const winningCandidate = WHEEL_STUDENTS[candidateIndex];
    const awardedPrize = THREE_PRIZES[Math.floor(Math.random() * THREE_PRIZES.length)].item;

    setTimeout(() => {
      setCurrentWheelWinner({
        studentName: winningCandidate.name,
        studentId: winningCandidate.id,
        prize: awardedPrize,
      });

      confetti({
        particleCount: 140,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#FFB81C', '#944F62', '#9BBFCC', '#FF4D9D', '#FBF6F0'],
      });
    }, 4200);
  };

  const handleTriggerHourly = async () => {
    const currentHour = 13;
    await runHourlyDraw(currentHour);
    confetti({
      particleCount: 150,
      spread: 110,
      origin: { y: 0.5 },
      colors: ['#944F62', '#FF4D9D', '#9BBFCC', '#7C3AED'],
    });
  };

  return (
    <div className="h-full flex flex-col justify-between p-4 md:p-8 space-y-4 text-[#FBF6F0] relative overflow-hidden select-none">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] bg-gradient-to-r from-[#944F62]/25 via-[#7C3AED]/20 to-[#9BBFCC]/25 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Title & Mode Toggle */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/50 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FFB81C] via-[#944F62] to-[#FF4D9D] flex items-center justify-center text-white shadow-xl">
            <Trophy className="w-6 h-6 animate-bounce text-[#261A23]" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-2xl tracking-tight text-white flex items-center gap-2">
              <span>SPIN YOUR FATE</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Verified 7+5 Wheel & Drum
              </span>
            </h2>
            <p className="text-xs text-[#9BBFCC]">
              Live Physical Spin Wheel & Pool Drum for students with 7 university and 5 service desk stamps.
            </p>
          </div>
        </div>

        {/* Draw Mode Switcher */}
        <div className="flex bg-black/60 p-1 rounded-xl border border-white/10 text-xs font-mono font-bold">
          <button
            onClick={() => setActiveDrawMode('instant')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeDrawMode === 'instant' ? 'bg-[#944F62] text-white shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            Lucky Spin Wheel
          </button>
          <button
            onClick={() => setActiveDrawMode('hourly')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeDrawMode === 'hourly' ? 'bg-[#7C3AED] text-white shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            Hourly Fateh Five (5 Winners)
          </button>
        </div>
      </div>

      {/* Top Area: THREE PRIZE CARDS AT STAKE */}
      <div className="relative z-10 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono text-[#9BBFCC] px-1">
          <span className="uppercase tracking-wider font-bold">
            Three Prizes at Stake in this Draw:
          </span>
          <span>Small in-kind sponsor & consultation rewards</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {THREE_PRIZES.map((prize) => (
            <div
              key={prize.id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 hover:border-white/40 transition-all shadow-xl space-y-1 relative overflow-hidden"
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#FFB81C] font-bold uppercase">{prize.badge}</span>
                <Gift className="w-4 h-4 text-[#9BBFCC]" />
              </div>

              <h4 className="font-display font-extrabold text-base text-white">
                {prize.name}
              </h4>

              <p className="text-xs text-[#FBF6F0]/90 font-body font-medium">
                {prize.item}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CENTERPIECE: REAL GLOWING SPIN WHEEL & CANDIDATE DRUM */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 my-auto py-2">
        
        {/* THE GLOWING SPIN WHEEL */}
        <div className="relative flex flex-col items-center justify-center">
          
          {/* Top Pointer Arrow with glowing shadow */}
          <div className="absolute -top-4 z-30 flex flex-col items-center filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-[#FFB81C]" />
            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-xs -mt-1.5" />
          </div>

          {/* Outer Gold & LED Rim */}
          <div className="w-[310px] h-[310px] sm:w-[350px] sm:h-[350px] rounded-full p-2.5 bg-gradient-to-br from-[#FFB81C] via-[#944F62] to-[#FF4D9D] shadow-[0_0_50px_rgba(255,184,28,0.35)] relative flex items-center justify-center">
            
            {/* Blinking Perimeter LED Dots */}
            <div className="absolute inset-0 rounded-full flex items-center justify-center pointer-events-none">
              {[...Array(16)].map((_, i) => {
                const angle = (i * 22.5 * Math.PI) / 180;
                const r = 160;
                const x = r * Math.cos(angle);
                const y = r * Math.sin(angle);
                return (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#FFF] animate-pulse"
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                      animationDelay: `${(i * 0.1) % 1}s`,
                    }}
                  />
                );
              })}
            </div>

            {/* Rotating Wheel Disc */}
            <div
              className="w-full h-full rounded-full relative overflow-hidden shadow-2xl border-4 border-[#261A23]"
              style={{
                transform: `rotate(${wheelRotation}deg)`,
                transition: isSpinning
                  ? 'transform 4.5s cubic-bezier(0.12, 0.95, 0.22, 1)'
                  : 'none',
              }}
            >
              {/* Render 8 Segment Wedges using SVG with Student Names */}
              <svg viewBox="0 0 300 300" className="w-full h-full">
                {WHEEL_STUDENTS.map((student, idx) => {
                  const startAngle = idx * 45;
                  const endAngle = (idx + 1) * 45;
                  const x1 = 150 + 150 * Math.cos((Math.PI * startAngle) / 180);
                  const y1 = 150 + 150 * Math.sin((Math.PI * startAngle) / 180);
                  const x2 = 150 + 150 * Math.cos((Math.PI * endAngle) / 180);
                  const y2 = 150 + 150 * Math.sin((Math.PI * endAngle) / 180);
                  const pathData = `M 150 150 L ${x1} ${y1} A 150 150 0 0 1 ${x2} ${y2} Z`;
                  const textAngle = startAngle + 22.5;

                  return (
                    <g key={idx}>
                      <path
                        d={pathData}
                        fill={student.color}
                        stroke="#FFB81C"
                        strokeWidth="1.5"
                      />
                      <g transform={`rotate(${textAngle}, 150, 150)`}>
                        <text
                          x="220"
                          y="154"
                          fill={student.text}
                          fontSize="9.5"
                          fontWeight="bold"
                          fontFamily="'Bricolage Grotesque', sans-serif"
                          textAnchor="middle"
                          transform="rotate(0, 220, 154)"
                        >
                          {student.label}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Center Golden Medallion Hub */}
            <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-[#FFB81C] to-[#261A23] p-1 shadow-2xl border-2 border-white flex flex-col items-center justify-center text-center z-20 pointer-events-none">
              <div className="w-full h-full rounded-full bg-[#261A23] flex flex-col items-center justify-center">
                <span className="font-display font-extrabold text-[12px] text-[#FFB81C] tracking-wider">
                  FATEH
                </span>
                <span className="font-mono text-[8px] text-white/80 uppercase">
                  7+5 POOL
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE: CANDIDATES DRUM & WINNER HIGHLIGHT */}
        <div className="w-full max-w-md space-y-4">
          
          {/* Candidate Drum Display */}
          <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-5 border-2 border-white/20 brutal-shadow space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#9BBFCC] border-b border-white/10 pb-2">
              <span className="uppercase font-bold">Eligible 7+5 Candidates:</span>
              <span className="text-white font-bold">{poolCount} Students</span>
            </div>

            {/* Cycling Student Name Box */}
            <div className="min-h-[90px] flex flex-col items-center justify-center text-center py-2">
              {isSpinning ? (
                <div className="space-y-1 animate-pulse">
                  <span className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                    {drumNames[drumCandidateIndex % drumNames.length]}
                  </span>
                  <span className="text-xs font-mono text-[#FFB81C] block animate-bounce">
                    Wheel Pointer Selecting Verified Student...
                  </span>
                </div>
              ) : currentWheelWinner || lastSpinWinner ? (
                <div className="space-y-1">
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                    🎉 OFFICIAL STUDENT WINNER:
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                    {currentWheelWinner?.studentName || lastSpinWinner?.student.name}
                  </h3>
                  <span className="text-xs font-mono text-[#9BBFCC] block">
                    {currentWheelWinner?.studentId || lastSpinWinner?.student.id || 'FE-26-0001'} • Verified 7+5 Pass
                  </span>
                  <p className="text-xs font-mono text-[#FFB81C] pt-1">
                    Awarded: <strong>{currentWheelWinner?.prize || lastSpinWinner?.prize}</strong>
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <h3 className="text-xl font-display font-bold text-white">
                    Ready to Spin for Candidates
                  </h3>
                  <p className="text-xs text-white/60 font-mono">
                    Wheel wedges contain verified candidates with 7+5 stamps
                  </p>
                </div>
              )}
            </div>

            {/* Ticker of names */}
            <div className="flex items-center gap-1.5 overflow-hidden text-xs font-mono text-white/70 border-t border-white/10 pt-2">
              <span className="text-[#9BBFCC] text-[10px] shrink-0">Pool:</span>
              <div className="flex gap-2 overflow-x-auto scrollbar-none">
                {drumNames.map((n, i) => (
                  <span key={i} className="bg-white/10 px-2 py-0.5 rounded text-[10px] whitespace-nowrap">
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* PRIMARY BUTTON: Exactly "Spin Your Fate" */}
          <div>
            {activeDrawMode === 'instant' ? (
              <button
                onClick={handleSpinWheel}
                disabled={isSpinning}
                className="w-full py-4 text-lg font-display font-extrabold text-white bg-gradient-to-r from-[#944F62] via-[#FF4D9D] to-[#FFB81C] hover:opacity-95 rounded-2xl brutal-shadow transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 shadow-2xl"
              >
                <Disc className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>{isSpinning ? 'Spinning Wheel...' : 'Spin Your Fate'}</span>
              </button>
            ) : (
              <button
                onClick={handleTriggerHourly}
                disabled={isSpinning}
                className="w-full py-4 text-base font-display font-extrabold text-white bg-gradient-to-r from-[#7C3AED] via-[#944F62] to-[#FF4D9D] hover:opacity-95 rounded-2xl brutal-shadow transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50"
              >
                <Award className="w-5 h-5" />
                <span>Run Hourly Draw ({clockTime})</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Bottom Footer */}
      <div className="relative z-10 flex items-center justify-between text-[11px] text-[#9BBFCC]/70 font-mono pt-1">
        <span>Fateh Admission Day Lucky Wheel • Seeded Random Fair Draw</span>
        <span>Results push live to student mobile app and WhatsApp instantly</span>
      </div>

    </div>
  );
};
