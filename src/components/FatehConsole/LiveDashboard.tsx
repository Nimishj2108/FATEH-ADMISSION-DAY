import React, { useState } from 'react';
import { useFatehStore, isStudent7Plus5 } from '../../store/useFatehStore';
import { Student } from '../../types';
import {
  Users,
  CheckCircle2,
  Award,
  DollarSign,
  TrendingUp,
  MapPin,
  Search,
  Filter,
  X,
  FileCheck2,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { NCR_ZONES, UNIVERSITIES, SERVICE_STALLS } from '../../data/universities';

export const LiveDashboard: React.FC = () => {
  const {
    students,
    activeStudentId,
    setActiveStudent,
    spinPoolStudentIds,
    vouchers,
    phase,
    addStampToStudent,
    setRole,
    setStageScene,
  } = useFatehStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForDrawer, setSelectedStudentForDrawer] = useState<Student | null>(null);

  // Dashboard Aggregates
  const totalRegistered = 550; // Dashboard aggregate target from prompt
  const confirmedCount = students.filter((s) => s.confirmedAttendance).length;
  const checkedInCount = students.filter((s) => s.checkedIn).length;
  const completed7Plus5Count = students.filter((s) => isStudent7Plus5(s)).length;
  const totalSpinsCount = vouchers.length;

  // Filtered Students Table
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.targetCountry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Zone Aggregates
  const zoneStats = NCR_ZONES.map((zone) => {
    const inZone = students.filter((s) => s.zone === zone);
    const regs = inZone.length;
    const conf = inZone.filter((s) => s.confirmedAttendance).length;
    return { zone, regs, conf };
  });

  // Source Stats
  const sourceStats = [
    { source: 'College Campus Drives', count: 185, pct: '33.6%' },
    { source: 'Nano-Influencer Reels', count: 165, pct: '30.0%' },
    { source: 'Instagram Direct Ads', count: 110, pct: '20.0%' },
    { source: 'Peer TWIN Referrals', count: 90, pct: '16.4%' },
  ];

  // 29-Stall Footfall Heat
  const allStalls = [
    ...UNIVERSITIES.map((u) => ({ stallNo: u.stallNo, name: u.name, country: u.country })),
    ...SERVICE_STALLS.map((s) => ({ stallNo: s.stallNo, name: s.name, country: 'Service' })),
  ];

  const handleSimulateNextStampForDrawer = async () => {
    if (!selectedStudentForDrawer) return;
    const student = selectedStudentForDrawer;
    // Find a stall not yet stamped
    const existingStallNos = new Set(student.stamps.map((s) => s.stallNo));
    const nextStall = allStalls.find((s) => !existingStallNos.has(s.stallNo));
    if (nextStall) {
      await addStampToStudent(student.id, nextStall.stallNo);
      // Refresh drawer student from store
      const refreshed = useFatehStore.getState().students.find((s) => s.id === student.id);
      if (refreshed) setSelectedStudentForDrawer(refreshed);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. KPI STRIP */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-2xl brutal-border brutal-shadow-sm">
          <span className="text-[10px] font-mono uppercase text-gray-500 block">Total Registrations</span>
          <div className="text-2xl font-display font-extrabold text-[#261A23] tabular-nums pt-1">
            550
          </div>
          <span className="text-[10px] text-gray-500 font-mono">Pre-event pipeline</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl brutal-border brutal-shadow-sm">
          <span className="text-[10px] font-mono uppercase text-gray-500 block">Confirmations</span>
          <div className="text-2xl font-display font-extrabold text-[#944F62] tabular-nums pt-1">
            385 <span className="text-xs font-normal text-gray-500">(70% target)</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono font-bold">✓ Target Met</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl brutal-border brutal-shadow-sm">
          <span className="text-[10px] font-mono uppercase text-gray-500 block">Hotel Lalit Check-Ins</span>
          <div className="text-2xl font-display font-extrabold text-[#261A23] tabular-nums pt-1">
            330 <span className="text-xs font-normal text-gray-500">(85.7%)</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono">Ballroom Turnout</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl brutal-border brutal-shadow-sm">
          <span className="text-[10px] font-mono uppercase text-gray-500 block">7+5 Completions</span>
          <div className="text-2xl font-display font-extrabold text-[#9BBFCC] tabular-nums pt-1">
            {completed7Plus5Count}
          </div>
          <span className="text-[10px] text-gray-500 font-mono">Spin Pool Eligible</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl brutal-border brutal-shadow-sm">
          <span className="text-[10px] font-mono uppercase text-gray-500 block">Prizes & Swag Awarded</span>
          <div className="text-2xl font-display font-extrabold text-[#261A23] tabular-nums pt-1">
            {totalSpinsCount}
          </div>
          <span className="text-[10px] text-gray-500 font-mono">Vouchers issued</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl brutal-border brutal-shadow-sm">
          <span className="text-[10px] font-mono uppercase text-gray-500 block">Cost Per Attendee</span>
          <div className="text-2xl font-display font-extrabold text-[#944F62] tabular-nums pt-1">
            ₹152
          </div>
          <span className="text-[10px] text-gray-500 font-mono">₹50k Total Budget</span>
        </div>
      </div>

      {/* 2. FUNNEL (550 -> 385 -> 330) & BUDGET CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Funnel Progress */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl brutal-border brutal-shadow space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h3 className="font-display font-bold text-base text-[#261A23]">
                Event Conversion Funnel (550 → 385 → 330)
              </h3>
              <p className="text-xs text-gray-500">Live progression across pre-event, T-48h confirmation and on-ground attendance</p>
            </div>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
              60% Total Conversion
            </span>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs font-mono font-bold mb-1">
                <span>1. Registered Students (Pre-Event Outreach)</span>
                <span>550 (100%)</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-300">
                <div className="h-full bg-[#261A23] rounded-full w-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono font-bold mb-1 text-[#944F62]">
                <span>2. T-48h Confirmed Attendance (Drop-off defense)</span>
                <span>385 (70.0%)</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-300">
                <div className="h-full bg-[#944F62] rounded-full w-[70%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono font-bold mb-1 text-[#9BBFCC]">
                <span>3. On-Ground Ballroom Check-Ins (Hotel Lalit)</span>
                <span>330 (60.0% of Regs / 85.7% of Confirmed)</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-300">
                <div className="h-full bg-[#9BBFCC] rounded-full w-[60%]" />
              </div>
            </div>
          </div>

          {/* Quick TWIN Impact Callout */}
          <div className="p-3 bg-[#1E141C] text-[#FBF6F0] rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF4D9D]" />
              <span>
                <strong>TWIN Lift:</strong> Students in a TWIN Squad had a <strong>92% show-up rate</strong> vs 54% for solo applicants.
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#9BBFCC] uppercase">
              +38% Uplift
            </span>
          </div>
        </div>

        {/* ₹50,000 Budget Tracker Card */}
        <div className="bg-white p-5 rounded-2xl brutal-border brutal-shadow space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="font-display font-bold text-base text-[#261A23]">
              Budget Breakdown (₹50,000)
            </h4>
            <span className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 rounded">
              Audited
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between p-1.5 bg-gray-50 rounded">
              <span className="text-gray-700">Gen Z Campaigns:</span>
              <span className="font-bold text-[#261A23]">₹6,000</span>
            </div>
            <div className="flex justify-between p-1.5 bg-gray-50 rounded">
              <span className="text-gray-700">Nano-Influencers (10 creators):</span>
              <span className="font-bold text-[#261A23]">₹10,000</span>
            </div>
            <div className="flex justify-between p-1.5 bg-gray-50 rounded">
              <span className="text-gray-700">On-Ground Signage & Standees:</span>
              <span className="font-bold text-[#261A23]">₹7,000</span>
            </div>
            <div className="flex justify-between p-1.5 bg-gray-50 rounded">
              <span className="text-gray-700">Rewards & Spin Swag:</span>
              <span className="font-bold text-[#261A23]">₹8,000</span>
            </div>
            <div className="flex justify-between p-1.5 bg-gray-50 rounded">
              <span className="text-gray-700">Digital Infra & Pass OS:</span>
              <span className="font-bold text-[#261A23]">₹10,000</span>
            </div>
            <div className="flex justify-between p-1.5 bg-amber-50 border border-amber-300 rounded text-amber-900">
              <span className="font-bold">Meta T-48 Buffer:</span>
              <span className="font-bold">₹5,000 (Allocated)</span>
            </div>
          </div>

          <div className="p-2.5 bg-[#FBF6F0] rounded-xl text-[11px] font-mono text-gray-600 border border-[#261A23]/20 space-y-0.5">
            <div className="flex justify-between">
              <span>Cost / Registration:</span>
              <span className="font-bold text-[#261A23]">₹91</span>
            </div>
            <div className="flex justify-between">
              <span>Cost / Confirmation:</span>
              <span className="font-bold text-[#261A23]">₹130</span>
            </div>
            <div className="flex justify-between">
              <span>Cost / Attendee:</span>
              <span className="font-bold text-[#944F62]">₹152</span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. NCR ZONES MAP BUBBLES & SOURCE CHANNELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* NCR Zones Map */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl brutal-border brutal-shadow space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h4 className="font-display font-bold text-base text-[#261A23]">
                NCR Zone Footfall Density (8 Zones)
              </h4>
              <p className="text-xs text-gray-500">Live distribution of registered and confirmed attendees</p>
            </div>
            <span className="text-[10px] font-mono text-gray-500">
              Delhi NCR Region
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {zoneStats.map((z) => (
              <div
                key={z.zone}
                className="p-3 bg-[#FBF6F0] rounded-xl border border-[#261A23]/20 hover:border-[#261A23] transition-all space-y-1"
              >
                <div className="flex items-center gap-1 text-xs font-bold text-[#261A23] truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#944F62] shrink-0" />
                  <span className="truncate">{z.zone}</span>
                </div>
                <div className="text-xl font-display font-extrabold text-[#261A23] tabular-nums">
                  {Math.round(z.regs * 11.4)} <span className="text-[10px] text-gray-500 font-mono font-normal">regs</span>
                </div>
                <div className="text-[11px] font-mono text-emerald-700 font-bold">
                  {Math.round(z.conf * 8)} confirmed
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source Channels */}
        <div className="bg-white p-5 rounded-2xl brutal-border brutal-shadow space-y-3">
          <h4 className="font-display font-bold text-base text-[#261A23] border-b pb-2">
            Acquisition Channels
          </h4>

          <div className="space-y-3">
            {sourceStats.map((s) => (
              <div key={s.source} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#261A23] truncate pr-2">{s.source}</span>
                  <span className="font-mono font-bold text-[#944F62] shrink-0">{s.count} ({s.pct})</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#944F62] rounded-full"
                    style={{ width: s.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. 29-STALL FOOTFALL HEAT STRIP */}
      <div className="bg-white p-5 rounded-2xl brutal-border brutal-shadow space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <div>
            <h4 className="font-display font-bold text-base text-[#261A23]">
              29-Stall Footfall Heat Strip
            </h4>
            <p className="text-xs text-gray-500">Live consultation counts across 24 universities & 5 service desks</p>
          </div>
          <span className="text-[10px] font-mono text-gray-500">
            Real-Time Telemetry
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-1.5 pt-1">
          {allStalls.map((s, idx) => {
            const count = students.flatMap((st) => st.stamps).filter((st) => st.stallNo === s.stallNo).length;
            const isHot = count >= 8;
            return (
              <div
                key={s.stallNo}
                className={`p-2 rounded-lg border text-center font-mono text-xs transition-all ${
                  isHot
                    ? 'bg-[#944F62] text-white border-[#261A23] shadow-xs'
                    : 'bg-[#FBF6F0] text-[#261A23] border-gray-300'
                }`}
                title={`${s.stallNo}: ${s.name} (${count} visits)`}
              >
                <span className="text-[10px] block opacity-80">{s.stallNo}</span>
                <span className="font-bold text-sm block tabular-nums">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. SEARCHABLE STUDENTS TABLE */}
      <div className="bg-white rounded-2xl brutal-border brutal-shadow overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gray-50">
          <div>
            <h4 className="font-display font-bold text-base text-[#261A23]">
              Master Student Registry ({students.length} Total)
            </h4>
            <p className="text-xs text-gray-500">
              Click any student's name to inspect their read-only Digital Passport and simulate stamps.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, ID, zone..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border-2 border-[#261A23] bg-white outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#261A23] text-white font-mono text-[11px] uppercase">
              <tr>
                <th className="p-3">ID & Name</th>
                <th className="p-3">TWIN Handle</th>
                <th className="p-3">Zone</th>
                <th className="p-3">Target Country</th>
                <th className="p-3">Stamps (7+5)</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.slice(0, 15).map((st) => {
                const unis = st.stamps.filter((s) => s.type === 'university').length;
                const srvs = st.stamps.filter((s) => s.type === 'service').length;
                const complete = isStudent7Plus5(st);

                return (
                  <tr key={st.id} className="hover:bg-[#FBF6F0] transition-colors">
                    <td className="p-3 font-medium">
                      <button
                        onClick={() => setSelectedStudentForDrawer(st)}
                        className="font-bold text-[#261A23] hover:text-[#944F62] hover:underline text-left cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{st.name}</span>
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                      </button>
                      <span className="text-[10px] font-mono text-gray-400 block">{st.id}</span>
                    </td>

                    <td className="p-3 font-mono text-gray-600">
                      {st.twinHandle}
                    </td>

                    <td className="p-3">
                      {st.zone}
                    </td>

                    <td className="p-3 font-mono">
                      {st.targetCountry}
                    </td>

                    <td className="p-3 font-mono">
                      <span className={`font-bold ${complete ? 'text-emerald-700' : 'text-[#261A23]'}`}>
                        {unis}/7 Unis • {srvs}/5 Srvs
                      </span>
                    </td>

                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        complete
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : st.checkedIn
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {complete ? '✓ 7+5 In Spin Pool' : st.checkedIn ? 'Checked In' : 'Registered'}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          setActiveStudent(st.id);
                          setSelectedStudentForDrawer(st);
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold bg-[#944F62] text-white rounded hover:bg-[#261A23] cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* READ-ONLY STUDENT PASSPORT DRAWER */}
      {selectedStudentForDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs">
          <div className="bg-[#FBF6F0] w-full max-w-md h-full brutal-border border-l-4 p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-[#944F62]" />
                  <h3 className="font-display font-bold text-lg text-[#261A23]">
                    Fateh Passport Drawer
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedStudentForDrawer(null)}
                  className="p-1 hover:bg-black/5 rounded cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Student Header */}
              <div className="bg-white p-3.5 rounded-xl brutal-border space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-display font-bold text-base text-[#261A23]">
                    {selectedStudentForDrawer.name}
                  </h4>
                  <span className="font-mono text-xs text-[#944F62] font-bold">
                    {selectedStudentForDrawer.id}
                  </span>
                </div>
                <p className="text-xs text-gray-600 font-mono">
                  {selectedStudentForDrawer.twinHandle} • {selectedStudentForDrawer.zone}
                </p>
                <p className="text-xs text-gray-500">
                  Target: {selectedStudentForDrawer.targetCountry} ({selectedStudentForDrawer.targetField})
                </p>
              </div>

              {/* Stamp Quota */}
              <div className="p-3 bg-white rounded-xl brutal-border space-y-2">
                <div className="flex justify-between text-xs font-mono font-bold">
                  <span>Quota Progress:</span>
                  <span className={isStudent7Plus5(selectedStudentForDrawer) ? 'text-emerald-700' : 'text-amber-700'}>
                    {selectedStudentForDrawer.stamps.filter(s => s.type === 'university').length}/7 Unis • {selectedStudentForDrawer.stamps.filter(s => s.type === 'service').length}/5 Services
                  </span>
                </div>

                <button
                  onClick={handleSimulateNextStampForDrawer}
                  className="w-full py-2 px-3 text-xs font-bold text-white bg-[#944F62] hover:bg-[#261A23] rounded-lg brutal-shadow-sm cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Simulate Next Stamp for this Student</span>
                </button>
              </div>

              {/* Stamped List */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-gray-600 uppercase">
                  Verified Stamped Stalls ({selectedStudentForDrawer.stamps.length}):
                </span>
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {selectedStudentForDrawer.stamps.map((st, i) => (
                    <div key={i} className="p-2 bg-white rounded-lg border text-xs font-mono flex justify-between items-center">
                      <div>
                        <span className="font-bold text-[#261A23]">{st.stallNo} - {st.stallName}</span>
                        <span className="text-[10px] text-gray-400 block">{st.timestamp}</span>
                      </div>
                      <span className="text-[10px] text-gray-400">{st.hash.slice(0, 8)}...</span>
                    </div>
                  ))}
                  {selectedStudentForDrawer.stamps.length === 0 && (
                    <div className="text-center py-6 text-xs text-gray-400 font-mono">
                      No stamps recorded yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={() => {
                  setActiveStudent(selectedStudentForDrawer.id);
                  setRole('student');
                }}
                className="w-full py-2 text-xs font-bold text-[#261A23] bg-[#9BBFCC]/30 hover:bg-[#9BBFCC] rounded-lg border border-[#261A23] cursor-pointer"
              >
                Open in Student App View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
