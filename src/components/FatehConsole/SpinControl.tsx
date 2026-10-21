import React from 'react';
import { useFatehStore } from '../../store/useFatehStore';
import {
  Sparkles,
  Award,
  Clock,
  Play,
  CheckCircle2,
  Tv,
  Gift,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const SpinControl: React.FC = () => {
  const {
    hourlySchedule,
    runHourlyDraw,
    spinPoolStudentIds,
    students,
    vouchers,
    setRole,
    setStageScene,
  } = useFatehStore();

  const eligibleStudents = students.filter((s) => spinPoolStudentIds.includes(s.id));

  // Small prize pool
  const smallPrizeTiers = [
    { name: 'Northbridge University (UK)', item: 'Tote + Hardbound Notebook Pack', qty: 25 },
    { name: 'Liffey Technological Univ (Ireland)', item: 'Embroidered Campus Hoodie', qty: 20 },
    { name: 'Kiwi Coast University (NZ)', item: 'Recycled Metal Water Bottle', qty: 30 },
    { name: 'Fateh Education Desk', item: 'Fateh Swag Kit (Cap, Bag, Stickers)', qty: 50 },
    { name: 'Fateh Education Desk', item: 'Free 1-on-1 Profile & Visa Audit Session', qty: 100 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl brutal-border brutal-shadow">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase bg-[#944F62] text-white px-2 py-0.5 rounded">
              HOURLY FATEH FIVE & STAGE DRUM
            </span>
            <span className="text-xs font-mono text-gray-500">
              Crystal Ballroom Main Stage
            </span>
          </div>
          <h3 className="font-display font-extrabold text-2xl text-[#261A23] pt-1">
            Spin Control & Small-Prize Disbursal
          </h3>
          <p className="text-xs text-[#261A23]/70 font-body">
            Automated hourly draws (11 AM to 4 PM) drawing 5 winners each from verified 7+5 stamp finishers. Small in-kind prizes only.
          </p>
        </div>

        <button
          onClick={() => {
            setRole('stage');
            setStageScene('spin');
          }}
          className="flex items-center gap-1.5 px-4 py-2 font-bold text-xs bg-[#261A23] text-white hover:bg-[#944F62] rounded-xl brutal-shadow-sm cursor-pointer whitespace-nowrap"
        >
          <Tv className="w-4 h-4" />
          <span>Launch Stage Spin Screen</span>
        </button>
      </div>

      {/* Hourly Schedule Table & Quick Trigger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hourly Draw Grid */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl brutal-border brutal-shadow space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="font-display font-bold text-base text-[#261A23]">
              Hourly Fateh Five Schedule (30 Total Winners)
            </h4>
            <span className="text-xs font-mono text-gray-500">
              6 Hourly Draws • 5 Winners Each
            </span>
          </div>

          <div className="space-y-3">
            {hourlySchedule.map((slot) => {
              const isUpcoming = slot.status === 'Upcoming';
              const isLive = slot.status === 'Live';
              const isDone = slot.status === 'Done';

              return (
                <div
                  key={slot.timeSlot}
                  className={`p-3.5 rounded-xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isLive
                      ? 'bg-amber-50 border-amber-500 brutal-shadow-sm'
                      : isDone
                      ? 'bg-gray-50 border-gray-200 opacity-90'
                      : 'bg-white border-[#261A23]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#261A23] text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      <Clock className="w-5 h-5 text-[#9BBFCC]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm text-[#261A23]">
                          {slot.timeSlot} Draw
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-800'
                              : isLive
                              ? 'bg-amber-200 text-amber-900 animate-pulse'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {slot.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-mono">
                        {isDone
                          ? `${slot.winnerIds.length} Winners Awarded Vouchers`
                          : '5 Random students from 7+5 pool'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {isDone ? (
                      <span className="text-xs font-mono font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => runHourlyDraw(slot.hour)}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-[#944F62] hover:bg-[#261A23] rounded-lg brutal-shadow-sm cursor-pointer flex items-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Run Draw Now</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Small Prize Tier Limits */}
        <div className="bg-white p-5 rounded-2xl brutal-border brutal-shadow space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="font-display font-bold text-base text-[#261A23]">
              Approved In-Kind Prize Pool
            </h4>
            <span className="text-[10px] font-mono text-emerald-700 font-bold">
              No Cash / Big Prizes
            </span>
          </div>

          <p className="text-xs text-[#261A23]/70 font-body">
            Strictly university goodies, apparel, and free Fateh consultation vouchers. No expensive electronics or flight tickets.
          </p>

          <div className="space-y-2.5">
            {smallPrizeTiers.map((p, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-[#FBF6F0] border border-[#261A23]/20 space-y-0.5 text-xs"
              >
                <div className="flex justify-between font-bold text-[#261A23]">
                  <span>{p.item}</span>
                  <span className="font-mono text-[#944F62]">{p.qty} Units</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono block">
                  Provided by: {p.name}
                </span>
              </div>
            ))}
          </div>

          {/* Current Eligible Pool Count */}
          <div className="p-3 bg-[#261A23] text-white rounded-xl text-xs space-y-1">
            <div className="flex justify-between font-mono">
              <span className="text-[#9BBFCC]">Current 7+5 Pool:</span>
              <span className="font-bold text-emerald-400">{eligibleStudents.length} Students</span>
            </div>
            <p className="text-[10px] text-gray-400">
              Only verified attendees with 7 university and 5 service desk stamps are eligible.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
