import React, { useState } from 'react';
import { useFatehStore } from '../../store/useFatehStore';
import {
  Filter,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Compass,
  DollarSign,
  GraduationCap,
} from 'lucide-react';
import { UNIVERSITIES } from '../../data/universities';

export const StallsTab: React.FC = () => {
  const { activeStudentId, students } = useFatehStore();
  const currentStudent = students.find((s) => s.id === activeStudentId) || students[0];

  const [highlightedStall, setHighlightedStall] = useState<string | null>(null);
  const [showOthersExpander, setShowOthersExpander] = useState(false);
  const [activeCountryFilter, setActiveCountryFilter] = useState<string>('all');
  const [filterMustTryOnly, setFilterMustTryOnly] = useState(false);

  // Interactive Live Criteria Sliders
  const [filterBudget, setFilterBudget] = useState(currentStudent.budgetLakhs || 24);
  const [filterIelts, setFilterIelts] = useState(currentStudent.ielts || 7.0);
  const [filterGradPercent, setFilterGradPercent] = useState(currentStudent.gradPercent || 72);
  const [filterIntake, setFilterIntake] = useState<string>('all');

  const userInterests = currentStudent.interests;

  // Curated High-Ambition / High-Scholarship "Must Try" Wildcards
  const MUST_TRY_STALL_IDS = ['uni-01', 'uni-02', 'uni-07', 'uni-09', 'uni-13', 'uni-19'];

  // Real-time calculation across all 24 universities
  let stage1All = 24;
  let stage2Scores = 0;
  let stage3Budget = 0;
  let stage4Intake = 0;
  let stage5Feasible = 0;

  const scoredUniversities = UNIVERSITIES.map((uni) => {
    const isMustTry = MUST_TRY_STALL_IDS.includes(uni.id);

    // 1. Academic eligibility (with 0.5 IELTS tolerance)
    const ieltsDiff = filterIelts - uni.minIELTS;
    const isAcademicEligible = ieltsDiff >= -0.5 && filterGradPercent >= uni.minGradPercent - 5;
    if (isAcademicEligible) stage2Scores++;

    // 2. Budget feasibility
    const isBudgetFeasible = uni.tuitionINR <= filterBudget + 2;
    if (isAcademicEligible && isBudgetFeasible) stage3Budget++;

    // 3. Intake alignment
    const matchesIntake = filterIntake === 'all' || uni.intakes.some((i) => i.toLowerCase().includes(filterIntake.toLowerCase()));
    if (isAcademicEligible && isBudgetFeasible && matchesIntake) stage4Intake++;

    // 4. Visa & Interest Fit Score
    const tagMatches = uni.tags.filter((t) => userInterests.includes(t));
    let fitScore = 40;
    fitScore += tagMatches.length * 20;
    if (uni.visaDifficulty <= 2) fitScore += 20;
    if (uni.tuitionINR <= filterBudget) fitScore += 20;
    if (isMustTry) fitScore += 12;

    const isFeasible = isAcademicEligible && isBudgetFeasible && matchesIntake;
    if (isFeasible) stage5Feasible++;

    return {
      ...uni,
      fitScore: Math.min(99, fitScore),
      isAcademicEligible,
      isBudgetFeasible,
      matchesIntake,
      isFeasible,
      isMustTry,
      tagMatches,
    };
  }).sort((a, b) => b.fitScore - a.fitScore);

  // Filter by country or must try
  const displayedStalls = scoredUniversities
    .filter((u) => activeCountryFilter === 'all' || u.country === activeCountryFilter)
    .filter((u) => {
      if (filterMustTryOnly) return u.isMustTry;
      return u.isFeasible || u.isMustTry;
    });

  const nonFeasibleStalls = scoredUniversities.filter((u) => !u.isFeasible && !u.isMustTry);

  return (
    <div className="space-y-4 pb-6">
      
      {/* ANIMATED PROFILE DATA LOADED BANNER */}
      <div className="bg-gradient-to-r from-[#261A23] via-[#3D1D2C] to-[#261A23] text-white p-3.5 rounded-2xl brutal-border brutal-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center shrink-0">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping absolute" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 relative" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                This Profile Data Has Been Loaded
              </span>
              <span className="text-xs font-mono text-[#FFB81C] font-bold">
                {currentStudent.name} • {currentStudent.id}
              </span>
            </div>
            <p className="text-[11px] text-[#FBF6F0]/90 font-mono pt-1">
              Target Field: {currentStudent.targetField} • {currentStudent.ielts} IELTS • {currentStudent.gradPercent}% Academics • Ceiling ₹{currentStudent.budgetLakhs}L
            </p>
          </div>
        </div>

        <div className="shrink-0 text-left sm:text-right flex items-center gap-2 sm:block">
          <span className="text-[10px] font-mono text-[#9BBFCC] block">Feasible & Must-Try Stalls:</span>
          <span className="text-xs font-mono font-bold text-emerald-300 bg-white/10 px-2 py-0.5 rounded">
            {displayedStalls.length} Stalls Matched
          </span>
        </div>
      </div>

      {/* Header & Soft Eligibility Philosophy */}
      <div className="bg-white rounded-2xl p-4 brutal-border brutal-shadow space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase bg-[#9BBFCC]/30 text-[#261A23] border border-[#261A23] px-2 py-0.5 rounded font-bold">
            Soft Eligibility Model
          </span>
          <span className="text-[10px] font-mono text-gray-500">
            Personalised Shortlist • Not an admission guarantee
          </span>
        </div>

        <h3 className="font-display font-extrabold text-xl text-[#261A23] tracking-tight">
          Eligible for many. Feasible for a few.
        </h3>

        <p className="text-xs text-[#261A23]/70 font-body leading-relaxed">
          Don't waste 4 hours wandering in the wrong queues. Test your test scores, tuition ceiling, and intake timeline to discover your mathematically feasible stalls.
        </p>

        {/* Dynamic Funnel Visual Counters Strip */}
        <div className="pt-1">
          <div className="grid grid-cols-5 gap-1.5 text-center font-mono text-xs">
            <div className="p-2 bg-gray-100 rounded-lg border border-gray-300">
              <span className="font-bold text-gray-800 block text-sm">{stage1All}</span>
              <span className="text-[9px] text-gray-500 block truncate">Ballroom</span>
            </div>
            <div className="p-2 bg-[#9BBFCC]/20 rounded-lg border border-[#9BBFCC]">
              <span className="font-bold text-[#261A23] block text-sm">{stage2Scores}</span>
              <span className="text-[9px] text-gray-600 block truncate">Scores</span>
            </div>
            <div className="p-2 bg-[#9BBFCC]/40 rounded-lg border border-[#9BBFCC]">
              <span className="font-bold text-[#261A23] block text-sm">{stage3Budget}</span>
              <span className="text-[9px] text-gray-700 block truncate">Budget</span>
            </div>
            <div className="p-2 bg-[#944F62]/20 rounded-lg border border-[#944F62]">
              <span className="font-bold text-[#944F62] block text-sm">{stage4Intake}</span>
              <span className="text-[9px] text-[#944F62] block truncate">Intakes</span>
            </div>
            <div className="p-2 bg-[#944F62] text-white rounded-lg brutal-shadow-sm">
              <span className="font-bold block text-sm">{stage5Feasible}</span>
              <span className="text-[9px] text-white/90 block truncate">Feasible</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Criteria Adjuster Card */}
      <div className="bg-[#FBF6F0] rounded-2xl p-4 brutal-border brutal-shadow space-y-3">
        <div className="flex items-center justify-between border-b border-[#261A23]/20 pb-2">
          <h4 className="font-display font-bold text-xs uppercase text-[#261A23] flex items-center gap-1.5 font-mono">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#944F62]" />
            <span>Interactive Feasibility Sliders</span>
          </h4>
          <span className="text-[10px] font-mono text-gray-500">Live Simulation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Budget Slider */}
          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-gray-600">Budget Limit:</span>
              <span className="font-bold text-[#944F62]">₹{filterBudget} Lakhs</span>
            </div>
            <input
              type="range"
              min="14"
              max="32"
              value={filterBudget}
              onChange={(e) => setFilterBudget(Number(e.target.value))}
              className="w-full accent-[#944F62] cursor-pointer"
            />
          </div>

          {/* IELTS Slider */}
          <div className="space-y-1">
            <div className="flex justify-between font-mono text-[11px]">
              <span className="text-gray-600">IELTS Band:</span>
              <span className="font-bold text-[#261A23]">{filterIelts} Band</span>
            </div>
            <input
              type="range"
              min="5.5"
              max="8.5"
              step="0.5"
              value={filterIelts}
              onChange={(e) => setFilterIelts(Number(e.target.value))}
              className="w-full accent-[#261A23] cursor-pointer"
            />
          </div>

          {/* Intake Filter */}
          <div className="space-y-1">
            <span className="text-gray-600 font-mono text-[11px] block">Intake Timeline:</span>
            <select
              value={filterIntake}
              onChange={(e) => setFilterIntake(e.target.value)}
              className="w-full bg-white text-xs p-1.5 rounded-lg border-2 border-[#261A23] outline-none"
            >
              <option value="all">All Intakes (Sep/Jan/Feb)</option>
              <option value="Sep 2027">Sep 2027 (Fall)</option>
              <option value="Jan 2028">Jan 2028 (Winter)</option>
              <option value="Feb 2028">Feb 2028 (NZ)</option>
            </select>
          </div>
        </div>

        {/* Country Quick Segment Tabs & Must Try Wildcards */}
        <div className="flex gap-1.5 pt-1 overflow-x-auto scrollbar-none items-center">
          <button
            onClick={() => setFilterMustTryOnly(!filterMustTryOnly)}
            className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              filterMustTryOnly
                ? 'bg-[#FF4D9D] text-white border-[#FF4D9D] shadow-md ring-2 ring-[#FF4D9D]/40'
                : 'bg-white text-[#944F62] border-[#944F62]/50 hover:bg-[#944F62]/10 font-bold'
            }`}
          >
            <span>🔥 Must Try / Wildcards</span>
            {filterMustTryOnly && <span className="text-xs">✓</span>}
          </button>
          {[
            { id: 'all', label: 'All Countries (24)' },
            { id: 'UK', label: 'UK (6)' },
            { id: 'Ireland', label: 'Ireland (6)' },
            { id: 'Dubai', label: 'Dubai (6)' },
            { id: 'NZ', label: 'New Zealand (6)' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCountryFilter(c.id);
                setFilterMustTryOnly(false);
              }}
              className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                activeCountryFilter === c.id && !filterMustTryOnly
                  ? 'bg-[#261A23] text-white border-[#261A23]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Interactive Ballroom Floor Map */}
      <div className="bg-[#261A23] text-[#FBF6F0] rounded-2xl p-4 brutal-border brutal-shadow space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-display font-bold text-sm text-[#FBF6F0]">
            Crystal Ballroom Floor Map Navigation
          </span>
          <span className="text-[10px] font-mono text-[#9BBFCC]">
            {highlightedStall ? `Selected Stall: ${highlightedStall}` : 'Tap stall card below to locate booth'}
          </span>
        </div>

        {/* Schematic SVG Map */}
        <div className="h-40 w-full bg-[#1A1118] rounded-xl border border-white/20 p-2 relative flex flex-col justify-between">
          
          {/* Top row: UK & Ireland */}
          <div className="flex justify-between items-center px-2">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono text-[#9BBFCC] block">UK Stalls (A01-A06)</span>
              <div className="flex gap-1">
                {['A01', 'A02', 'A03', 'A04', 'A05', 'A06'].map((s) => (
                  <div
                    key={s}
                    className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                      highlightedStall === s
                        ? 'bg-[#944F62] text-white ring-2 ring-white scale-110 z-10'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-0.5 text-right">
              <span className="text-[9px] font-mono text-[#9BBFCC] block">Ireland Stalls (B01-B06)</span>
              <div className="flex gap-1 justify-end">
                {['B01', 'B02', 'B03', 'B04', 'B05', 'B06'].map((s) => (
                  <div
                    key={s}
                    className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                      highlightedStall === s
                        ? 'bg-[#944F62] text-white ring-2 ring-white scale-110 z-10'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Stage & Spin Drum Lounge */}
          <div className="flex items-center justify-center">
            <div className="px-4 py-1.5 rounded-full bg-[#944F62]/20 border border-[#944F62] text-center">
              <span className="text-[10px] font-mono text-[#9BBFCC] font-bold">
                STAGE & SPIN DRUM • TWIN FOYER LOUNGE
              </span>
            </div>
          </div>

          {/* Bottom row: Dubai, NZ & Services */}
          <div className="flex justify-between items-center px-2">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono text-[#9BBFCC] block">Dubai (C01-C06)</span>
              <div className="flex gap-1">
                {['C01', 'C02', 'C03', 'C04', 'C05', 'C06'].map((s) => (
                  <div
                    key={s}
                    className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                      highlightedStall === s
                        ? 'bg-[#944F62] text-white ring-2 ring-white scale-110 z-10'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-0.5 text-right">
              <span className="text-[9px] font-mono text-[#9BBFCC] block">NZ (D01-D06)</span>
              <div className="flex gap-1 justify-end">
                {['D01', 'D02', 'D03', 'D04', 'D05', 'D06'].map((s) => (
                  <div
                    key={s}
                    className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                      highlightedStall === s
                        ? 'bg-[#944F62] text-white ring-2 ring-white scale-110 z-10'
                        : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Recommended Feasible Stalls List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-display font-bold text-base text-[#261A23]">
            Top Recommended Feasible Stalls ({displayedStalls.length})
          </h4>
          <span className="text-[11px] font-mono text-gray-500">
            Sorted by Personal Fit
          </span>
        </div>

        <div className="space-y-2.5">
          {displayedStalls.slice(0, 10).map((uni) => {
            const isSelected = highlightedStall === uni.stallNo;
            return (
              <div
                key={uni.id}
                className={`bg-white rounded-xl p-4 brutal-border transition-all ${
                  isSelected ? 'brutal-shadow-berry ring-2 ring-[#944F62]' : 'brutal-shadow-sm hover:brutal-shadow'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-xs font-bold bg-[#261A23] text-white px-2 py-0.5 rounded">
                        Stall {uni.stallNo}
                      </span>
                      <span className="text-xs font-mono text-gray-500 font-bold">
                        {uni.country}
                      </span>
                      <span className="text-[10px] font-mono text-[#944F62] font-bold bg-[#944F62]/10 px-1.5 py-0.5 rounded">
                        {uni.fitScore}% Fit Match
                      </span>
                      {uni.isMustTry && (
                        <span className="text-[10px] font-mono font-bold bg-gradient-to-r from-[#FF4D9D]/20 to-[#FFB81C]/20 text-[#944F62] border border-[#FF4D9D]/40 px-2 py-0.5 rounded flex items-center gap-1">
                          🔥 MUST TRY • High Scholarship & ROI
                        </span>
                      )}
                    </div>
                    <h5 className="font-display font-bold text-base text-[#261A23] pt-1">
                      {uni.name}
                    </h5>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-display font-extrabold text-base text-[#944F62] block">
                      ₹{uni.tuitionINR} L/yr
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      Min IELTS {uni.minIELTS} • {uni.minGradPercent}%
                    </span>
                  </div>
                </div>

                {/* "Why It Fits" & In-Kind Swag */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold">
                    ✓ Within ₹{filterBudget}L ceiling
                  </span>
                  {uni.tagMatches.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#9BBFCC]/20 text-[#261A23] border border-[#9BBFCC]"
                    >
                      ★ {tag} focus
                    </span>
                  ))}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    Intakes: {uni.intakes.join(', ')}
                  </span>
                </div>

                {/* Swag Item & Map Nav */}
                <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="text-gray-600 truncate max-w-[220px]">
                    🎁 Promised Swag: <strong>{uni.prizeItem}</strong>
                  </span>
                  <button
                    onClick={() => setHighlightedStall(uni.stallNo)}
                    className="text-[#944F62] hover:underline font-bold font-mono cursor-pointer flex items-center gap-1"
                  >
                    <span>Highlight on Map</span>
                    <MapPin className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* "Why Not the Others?" Expander with Specific Failure Reasons */}
      <div className="bg-white rounded-xl brutal-border overflow-hidden">
        <button
          onClick={() => setShowOthersExpander(!showOthersExpander)}
          className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-[#261A23] bg-gray-50 hover:bg-gray-100 cursor-pointer"
        >
          <span>Why not the remaining {nonFeasibleStalls.length} stalls?</span>
          {showOthersExpander ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showOthersExpander && (
          <div className="p-3.5 space-y-2 border-t text-xs">
            <p className="text-[11px] text-gray-500 font-body">
              These stalls do not meet your currently adjusted parameters (Budget ceiling ₹{filterBudget}L, IELTS {filterIelts}, or Intake {filterIntake}):
            </p>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {nonFeasibleStalls.slice(0, 10).map((u) => {
                const reasons: string[] = [];
                if (!u.isBudgetFeasible) reasons.push(`Tuition ₹${u.tuitionINR}L exceeds limit`);
                if (!u.isAcademicEligible) reasons.push(`Requires ${u.minIELTS} IELTS / ${u.minGradPercent}%`);
                if (!u.matchesIntake) reasons.push(`No ${filterIntake} intake`);

                return (
                  <div key={u.id} className="p-2.5 rounded bg-gray-50 border border-gray-200 flex justify-between items-center text-[11px]">
                    <div>
                      <span className="font-bold text-gray-800">{u.stallNo} - {u.name}</span>
                      <span className="text-gray-500 block text-[10px]">
                        Tuition: ₹{u.tuitionINR}L • Cutoff: {u.minIELTS} IELTS • {u.country}
                      </span>
                    </div>
                    <span className="text-[10px] text-red-700 font-mono bg-red-50 px-2 py-0.5 rounded border border-red-300">
                      {reasons[0] || 'Criteria gap'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
