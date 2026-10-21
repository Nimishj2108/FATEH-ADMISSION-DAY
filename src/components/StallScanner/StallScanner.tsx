import React, { useState } from 'react';
import { useFatehStore } from '../../store/useFatehStore';
import {
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  Users,
  Store,
  History,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { UNIVERSITIES, SERVICE_STALLS } from '../../data/universities';

export const StallScanner: React.FC = () => {
  const {
    selectedScannerStall,
    setSelectedScannerStall,
    scanRandomCheckedInStudent,
    students,
    clockTime,
  } = useFatehStore();

  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Find active stall details
  const allStalls = [
    ...UNIVERSITIES.map((u) => ({
      id: u.id,
      stallNo: u.stallNo,
      name: u.name,
      countryOrCategory: u.country,
      type: 'university' as const,
      prizeItem: u.prizeItem,
    })),
    ...SERVICE_STALLS.map((s) => ({
      id: s.id,
      stallNo: s.stallNo,
      name: s.name,
      countryOrCategory: s.category,
      type: 'service' as const,
      prizeItem: 'Guidance Docket',
    })),
  ];

  const currentStall = allStalls.find((s) => s.stallNo === selectedScannerStall) || allStalls[0];

  // Count visits to this stall across all students
  const visits = students.flatMap((st) => st.stamps).filter((st) => st.stallNo === currentStall.stallNo);
  const footfallCount = visits.length;

  const handleScanAction = async () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(async () => {
      const res = await scanRandomCheckedInStudent();
      setScanResult(res);
      setIsScanning(false);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl brutal-border brutal-shadow">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase bg-[#944F62] text-white px-2 py-0.5 rounded">
              TABLET SCANNER KIOSK
            </span>
            <span className="text-xs font-mono text-gray-500">
              Hotel Lalit Crystal Ballroom
            </span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-[#261A23] pt-1">
            University & Service Desk Scanner
          </h2>
          <p className="text-xs text-[#261A23]/70 font-body">
            Stall representatives use this terminal to scan attendee passes, award digital passport stamps, and record independent verification proofs.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] font-mono text-gray-500 uppercase block">Active Time</span>
          <span className="font-mono font-bold text-lg text-[#261A23]">{clockTime}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Stall Selector & Metadata */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl brutal-border brutal-shadow space-y-3">
            <label className="block text-xs font-bold text-[#261A23] uppercase font-mono">
              Select Your Assigned Stall (29 Total)
            </label>

            <select
              value={selectedScannerStall}
              onChange={(e) => setSelectedScannerStall(e.target.value)}
              className="w-full p-2.5 text-xs font-bold rounded-xl border-2 border-[#261A23] bg-white outline-none focus:ring-2 focus:ring-[#944F62]"
            >
              <optgroup label="United Kingdom (A01 - A06)">
                {UNIVERSITIES.filter((u) => u.country === 'UK').map((u) => (
                  <option key={u.id} value={u.stallNo}>
                    {u.stallNo} - {u.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Ireland (B01 - B06)">
                {UNIVERSITIES.filter((u) => u.country === 'Ireland').map((u) => (
                  <option key={u.id} value={u.stallNo}>
                    {u.stallNo} - {u.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Dubai (C01 - C06)">
                {UNIVERSITIES.filter((u) => u.country === 'Dubai').map((u) => (
                  <option key={u.id} value={u.stallNo}>
                    {u.stallNo} - {u.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="New Zealand (D01 - D06)">
                {UNIVERSITIES.filter((u) => u.country === 'NZ').map((u) => (
                  <option key={u.id} value={u.stallNo}>
                    {u.stallNo} - {u.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Service Desks (S1 - S5)">
                {SERVICE_STALLS.map((s) => (
                  <option key={s.id} value={s.stallNo}>
                    {s.stallNo} - {s.name}
                  </option>
                ))}
              </optgroup>
            </select>

            {/* Selected Stall Card */}
            <div className="p-3 bg-[#FBF6F0] rounded-xl border border-[#261A23]/20 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-[#944F62]">
                  {currentStall.stallNo}
                </span>
                <span className="text-[10px] font-mono text-gray-500 uppercase">
                  {currentStall.countryOrCategory}
                </span>
              </div>
              <h4 className="font-display font-bold text-sm text-[#261A23]">
                {currentStall.name}
              </h4>
              <p className="text-[11px] text-gray-600">
                Pledged Swag: <strong>{currentStall.prizeItem}</strong>
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 block">Total Footfall</span>
                <span className="font-display font-extrabold text-xl text-[#261A23] tabular-nums">
                  {footfallCount}
                </span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="text-[10px] text-gray-500 block">Est. Queue</span>
                <span className="font-display font-extrabold text-xl text-[#944F62] tabular-nums">
                  {Math.max(1, Math.floor(footfallCount / 4))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center & Right Columns: Scanner Terminal & Live Queue */}
        <div className="md:col-span-2 space-y-4">
          
          {/* Main Action Terminal */}
          <div className="bg-[#261A23] text-[#FBF6F0] p-6 rounded-2xl brutal-border brutal-shadow space-y-4 text-center">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#9BBFCC] uppercase tracking-wider">
                Simulated Laser Optical / NFC Scanner
              </span>
              <h3 className="font-display font-extrabold text-2xl text-[#FBF6F0]">
                Scan Student Pass at {currentStall.stallNo}
              </h3>
              <p className="text-xs text-[#FBF6F0]/70 max-w-md mx-auto">
                Validates student check-in, prevents duplicate stamps, and securely commits SHA-256 block to their Digital Passport.
              </p>
            </div>

            <div className="py-4">
              <button
                onClick={handleScanAction}
                disabled={isScanning}
                className="w-full max-w-sm mx-auto py-4 px-6 text-sm font-display font-extrabold text-white bg-[#944F62] hover:bg-[#FF4D9D] rounded-2xl brutal-shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-95"
              >
                <ScanLine className={`w-5 h-5 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'Validating Pass...' : 'Scan Next Checked-In Student'}</span>
              </button>
            </div>

            {/* Scan feedback alert */}
            {scanResult && (
              <div
                className={`p-3 rounded-xl border text-xs max-w-md mx-auto flex items-center gap-2 text-left ${
                  scanResult.success
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                    : 'bg-red-950/60 border-red-500 text-red-200'
                }`}
              >
                {scanResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                )}
                <span>{scanResult.message}</span>
              </div>
            )}
          </div>

          {/* Recent Scans Table at this stall */}
          <div className="bg-white p-4 rounded-2xl brutal-border brutal-shadow space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-1.5">
                <History className="w-4 h-4 text-[#944F62]" />
                <h4 className="font-display font-bold text-sm text-[#261A23]">
                  Recent Stamped Attendees at {currentStall.stallNo}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-gray-500">
                {visits.length} Verified
              </span>
            </div>

            {visits.length > 0 ? (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {visits.slice(-6).reverse().map((v, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-[#FBF6F0] border border-[#261A23]/15 flex items-center justify-between text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#261A23]">{v.stallName}</span>
                      <span className="text-[10px] text-gray-500">{v.timestamp}</span>
                    </div>
                    <span className="text-[10px] text-[#944F62] truncate max-w-[120px]">
                      {v.hash.slice(0, 12)}...
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-gray-400 font-mono">
                No students scanned at this stall yet. Press the scan button above!
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
