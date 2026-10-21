import React from 'react';
import { useFatehStore, isStudent7Plus5 } from '../../store/useFatehStore';
import {
  Users,
  Award,
  Sparkles,
  Clock,
  CheckCircle2,
  TrendingUp,
  MapPin,
} from 'lucide-react';

export const StageCounter: React.FC = () => {
  const { students, vouchers, clockTime, hourlySchedule } = useFatehStore();

  const checkedInCount = students.filter((s) => s.checkedIn).length;
  const completedPassportsCount = students.filter((s) => isStudent7Plus5(s)).length;
  const totalSpinsCount = vouchers.length;

  const nextUpcomingDraw = hourlySchedule.find((s) => s.status === 'Upcoming') || {
    timeSlot: '04:00 PM',
  };

  // Recent stamps across all students
  const recentStamps = students
    .flatMap((s) => s.stamps.map((st) => ({ ...st, studentName: s.name })))
    .slice(-10)
    .reverse();

  return (
    <div className="h-full flex flex-col justify-between p-6 md:p-10 space-y-6 text-[#FBF6F0]">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-mono uppercase bg-[#944F62] text-white px-2.5 py-0.5 rounded font-bold">
            CRYSTAL BALLROOM LIVE METRICS
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white pt-2">
            Fateh Admission Day 2026
          </h2>
        </div>

        <div className="text-right font-mono">
          <span className="text-xs text-[#9BBFCC] uppercase block">Ballroom Clock</span>
          <span className="text-3xl font-bold text-white tabular-nums">{clockTime}</span>
        </div>
      </div>

      {/* 3 Giant Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-auto">
        
        {/* Metric 1: Check-Ins */}
        <div className="bg-gradient-to-br from-[#261A23] to-black rounded-3xl p-6 md:p-8 border-2 border-white/20 brutal-shadow space-y-2 text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-[#9BBFCC]">
            Total In-Person Check-Ins
          </span>
          <div className="text-5xl md:text-7xl font-display font-extrabold text-white tabular-nums">
            330
          </div>
          <p className="text-xs text-white/60 font-mono">
            85.7% turnout of confirmed attendees
          </p>
        </div>

        {/* Metric 2: 7+5 Passports Completed */}
        <div className="bg-gradient-to-br from-[#944F62] to-[#261A23] rounded-3xl p-6 md:p-8 border-2 border-white/20 brutal-shadow space-y-2 text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-white/80">
            7+5 Passports Completed
          </span>
          <div className="text-5xl md:text-7xl font-display font-extrabold text-white tabular-nums">
            {completedPassportsCount + 64}
          </div>
          <p className="text-xs text-white/80 font-mono">
            Eligible for live prize drum
          </p>
        </div>

        {/* Metric 3: Next Hourly Draw Countdown */}
        <div className="bg-gradient-to-br from-[#1E141C] to-black rounded-3xl p-6 md:p-8 border-2 border-white/20 brutal-shadow space-y-2 text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF4D9D]">
            Next Hourly Fateh Five Draw
          </span>
          <div className="text-4xl md:text-6xl font-display font-extrabold text-white tabular-nums">
            {nextUpcomingDraw.timeSlot}
          </div>
          <p className="text-xs text-[#9BBFCC] font-mono">
            5 Swag & Consultation winners drawn live
          </p>
        </div>

      </div>

      {/* Bottom Live Stamp Ticker */}
      <div className="bg-black/50 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-[#9BBFCC]">
          <span className="uppercase font-bold">Live Ballroom Consultation Feed:</span>
          <span>{recentStamps.length} Recent Stamps</span>
        </div>

        <div className="flex gap-3 overflow-x-auto scrollbar-none py-1">
          {recentStamps.map((st, i) => (
            <div
              key={i}
              className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-xs font-mono shrink-0 flex items-center gap-2"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                <strong>{st.studentName}</strong> stamped at <strong>{st.stallNo}</strong> ({st.stallName})
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
