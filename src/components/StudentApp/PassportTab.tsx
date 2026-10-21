import React, { useState } from 'react';
import { useFatehStore, isStudent7Plus5 } from '../../store/useFatehStore';
import confetti from 'canvas-confetti';
import {
  ChevronLeft,
  ChevronRight,
  QrCode,
  Radio,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Award,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  X,
  FileCheck2,
  Share2,
  Download,
  Linkedin,
  Instagram,
  Send,
  TrendingUp,
  Eye,
  BarChart2,
} from 'lucide-react';
import { UNIVERSITIES, SERVICE_STALLS } from '../../data/universities';

export const PassportTab: React.FC = () => {
  const {
    activeStudentId,
    students,
    addStampToStudent,
    isChainTampered,
    tamperChain,
    repairChain,
    phase,
    mintPassportNFT,
    setRole,
    setStageScene,
  } = useFatehStore();

  const student = students.find((s) => s.id === activeStudentId) || students[0];

  // Flipbook active page:
  // 0: Embossed Leatherette Cover
  // 1: Official Identity & Biometric Data Page with MRZ
  // 2: Quota & Endorsements (7+5 = Spin Unlocked)
  // 3: UK & Ireland Visas (A01-A06, B01-B06)
  // 4: Dubai & New Zealand Visas (C01-C06, D01-D06)
  // 5: Specialized Services Visas (S1-S5)
  // 6: Rewards & Spin Seal
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 7;

  // Stamping Drawer State
  const [stampSheetOpen, setStampSheetOpen] = useState(false);
  const [stampMethod, setStampMethod] = useState<'qr' | 'nfc'>('qr');
  const [selectedStallToStamp, setSelectedStallToStamp] = useState('A01');
  const [stampError, setStampError] = useState<string | null>(null);

  // Blockchain Ledger Sheet State
  const [chainSheetOpen, setChainSheetOpen] = useState(false);

  // Minting State for T+1
  const [isMinting, setIsMinting] = useState(false);
  const [mintStep, setMintStep] = useState(0);

  // Social Depart Modal State (LinkedIn & Instagram Analytics)
  const [departModalOpen, setDepartModalOpen] = useState(false);
  const [departPlatform, setDepartPlatform] = useState<'linkedin' | 'instagram'>('linkedin');
  const [copiedSocialText, setCopiedSocialText] = useState(false);

  const uniStamps = student.stamps.filter((s) => s.type === 'university');
  const srvStamps = student.stamps.filter((s) => s.type === 'service');
  const distinctUniCount = new Set(uniStamps.map((s) => s.stallId)).size;
  const distinctSrvCount = new Set(srvStamps.map((s) => s.stallId)).size;
  const isUnlocked = distinctUniCount >= 7 && distinctSrvCount >= 5;

  const handleSimulateStamp = async () => {
    setStampError(null);
    const result = await addStampToStudent(student.id, selectedStallToStamp, stampMethod === 'nfc');
    if (!result.success) {
      setStampError(result.reason || 'Failed to stamp');
    } else {
      setStampSheetOpen(false);
      const updatedStudent = useFatehStore.getState().students.find((s) => s.id === student.id);
      if (updatedStudent && isStudent7Plus5(updatedStudent)) {
        setCurrentPage(6); // Rewards page
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#944F62', '#9BBFCC', '#261A23'],
        });
      }
    }
  };

  const handleStartMint = () => {
    setIsMinting(true);
    setMintStep(1);
    setTimeout(() => setMintStep(2), 1000);
    setTimeout(() => setMintStep(3), 2000);
    setTimeout(() => {
      setMintStep(4);
      mintPassportNFT(student.id);
      setIsMinting(false);
      confetti({
        particleCount: 70,
        spread: 60,
        colors: ['#944F62', '#9BBFCC'],
      });
    }, 3000);
  };

  const handleCopyLinkedIn = () => {
    const text = `🎓 Proud to complete all 12 verified university & visa advisory consultations at Fateh Education's Study Abroad Admission Day at Hotel Lalit, Delhi NCR! Verified my cryptographic Fateh Passport NFT: ${student.mintedTokenId || 'FE-NFT-2026-884210'}. Exploring MSc in CS/AI for Fall 2027. #StudyAbroad #FatehEducation #DelhiNCR`;
    navigator.clipboard.writeText(text);
    setCopiedSocialText(true);
    setTimeout(() => setCopiedSocialText(false), 2500);
  };

  // Generate authentic consular rubber stamps (English only, extra bold)
  const renderConsularStamp = (stallNo: string, stallName: string, time: string, hash: string, rotation: number = 0, type: 'uk' | 'ie' | 'ae' | 'nz' | 'srv' = 'uk') => {
    const isOval = type === 'uk' || type === 'nz';
    const isHex = type === 'ie';
    const isDiamond = type === 'ae';
    const inkColor =
      type === 'uk'
        ? '#944F62'
        : type === 'ie'
        ? '#1E4334'
        : type === 'ae'
        ? '#A65D1E'
        : type === 'nz'
        ? '#1D3B53'
        : '#261A23';

    return (
      <div
        className="inline-block p-1.5 select-none relative group transition-transform hover:scale-105"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div
          className={`flex flex-col items-center justify-center text-center p-2 min-w-[122px] max-w-[130px] h-[105px] border-2 border-dashed relative shadow-xs ${
            isOval ? 'rounded-[32px]' : isHex ? 'rounded-2xl' : isDiamond ? 'rounded-xl' : 'rounded-2xl'
          }`}
          style={{ borderColor: inkColor, backgroundColor: `${inkColor}08` }}
        >
          <div
            className="text-[8px] font-mono uppercase tracking-widest font-black border-b pb-0.5 w-full truncate"
            style={{ color: inkColor, borderColor: `${inkColor}40` }}
          >
            FATEH ADMISSION • 24.10.26
          </div>

          <div className="flex items-center gap-1 my-0.5">
            <span
              className="font-display font-black text-xl tracking-tight leading-none"
              style={{ color: inkColor }}
            >
              {stallNo}
            </span>
            <span
              className="text-[9px] font-mono px-1 rounded-sm border uppercase font-black"
              style={{ borderColor: inkColor, color: inkColor }}
            >
              VERIFIED
            </span>
          </div>

          <div
            className="text-[9.5px] font-display font-black leading-tight line-clamp-1 max-w-[110px]"
            style={{ color: inkColor }}
          >
            {stallName}
          </div>

          <div
            className="text-[8px] font-mono mt-0.5 flex items-center justify-between w-full px-1 border-t pt-0.5"
            style={{ color: `${inkColor}CC`, borderColor: `${inkColor}30` }}
          >
            <span className="font-bold">{time}</span>
            <span className="font-bold">{hash.slice(0, 6)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-6">
      
      {/* Top Controls: Blockchain Verification Chip & Scan Button */}
      <div className="flex items-center justify-between gap-2 px-1">
        <button
          onClick={() => setChainSheetOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono rounded-full border transition-all cursor-pointer ${
            isChainTampered
              ? 'bg-red-100 text-red-800 border-red-500 font-extrabold animate-pulse'
              : 'bg-emerald-50 text-emerald-800 border-emerald-400 font-bold'
          }`}
        >
          {isChainTampered ? (
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          )}
          <span>{isChainTampered ? 'CHAIN TAMPERED' : 'CRYPTOGRAPHIC STAMPS • SHA-256'}</span>
        </button>

        <button
          onClick={() => {
            setStampError(null);
            setStampSheetOpen(true);
          }}
          className="flex items-center gap-1 px-3 py-1 text-xs font-black bg-[#944F62] text-white rounded-lg brutal-shadow-sm hover:bg-[#261A23] transition-all cursor-pointer uppercase"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Stamp at Stall</span>
        </button>
      </div>

      {/* REALISTIC EMBASSY PASSPORT BOOKLET */}
      <div className="bg-[#261A23] rounded-3xl p-2.5 brutal-border brutal-shadow-lg shadow-2xl relative">
        
        {/* Passport Leatherette Outer Binding with Stitched Border */}
        <div className="border-2 border-[#FBF6F0]/20 rounded-2xl p-1 bg-[#1A1118]">
          <div className="bg-[#FFFDF9] rounded-xl min-h-[490px] flex flex-col justify-between overflow-hidden relative shadow-inner text-[#261A23]">
            
            {/* Guilloche Micro-pattern Watermark Background */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.035] bg-repeat"
              style={{
                backgroundImage: `radial-gradient(#261A23 1px, transparent 1px), radial-gradient(#944F62 1px, transparent 1px)`,
                backgroundSize: '16px 16px',
                backgroundPosition: '0 0, 8px 8px',
              }}
            />

            {/* Passport Spine Ribbon Center Line */}
            <div className="h-2 bg-gradient-to-r from-[#261A23] via-[#944F62] to-[#261A23] relative z-10" />

            {/* FLIPBOOK PAGES */}
            <div className="p-4 md:p-5 flex-1 flex flex-col justify-between relative z-10">
              
              {/* PAGE 0: OFFICIAL EMBOSSED LEATHERETTE COVER (ENGLISH ONLY, ULTRA BOLD) */}
              {currentPage === 0 && (
                <div className="flex-1 flex flex-col items-center justify-between text-center py-6 px-3 bg-[#261A23] text-[#FBF6F0] rounded-xl border-2 border-[#FFB81C]/50 shadow-inner relative overflow-hidden">
                  
                  {/* Gold Foil Border Inset */}
                  <div className="absolute inset-2 border-2 border-dashed border-[#FFB81C]/40 rounded-lg pointer-events-none" />

                  {/* Top National Header */}
                  <div className="space-y-1 pt-4">
                    <span className="font-display font-black text-sm tracking-widest text-[#FFB81C] uppercase block">
                      FATEH ADMISSION AUTHORITY
                    </span>
                    <span className="text-[10px] font-mono tracking-widest text-[#FBF6F0]/80 uppercase block font-bold">
                      GLOBAL STUDY ABROAD CREDENTIAL
                    </span>
                  </div>

                  {/* Gold Foil Emblem */}
                  <div className="my-auto flex flex-col items-center py-4">
                    <div className="w-24 h-24 rounded-full border-2 border-[#FFB81C] p-1.5 flex items-center justify-center relative shadow-[0_0_25px_rgba(255,184,28,0.3)]">
                      <div className="w-full h-full rounded-full border border-dashed border-[#FFB81C]/60 flex flex-col items-center justify-center p-1">
                        <Award className="w-10 h-10 text-[#FFB81C]" />
                        <span className="text-[7.5px] font-mono uppercase text-[#FFB81C] font-black tracking-widest mt-0.5">
                          OFFICIAL DIPLOMATIC SEAL
                        </span>
                      </div>
                    </div>

                    <h2 className="font-display font-black text-3xl md:text-4xl text-[#FFB81C] mt-3 tracking-widest uppercase">
                      FATEH PASSPORT
                    </h2>
                    <h3 className="font-mono font-bold text-xs text-[#9BBFCC] tracking-wider uppercase pt-1">
                      INTERNATIONAL STUDENT CREDENTIAL
                    </h3>
                  </div>

                  {/* Bottom Diplomatic Details & RFID Chip Icon */}
                  <div className="space-y-2 pb-2">
                    <div className="flex items-center justify-center gap-1.5 text-[#FFB81C]">
                      <div className="w-7 h-4 border-2 border-[#FFB81C] rounded flex items-center justify-center px-1">
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-[#FFB81C]" />
                      </div>
                      <span className="text-[9.5px] font-mono font-black tracking-widest">BIOMETRIC ENTRY 2026</span>
                    </div>

                    <p className="text-[10px] font-mono text-[#9BBFCC] font-bold">
                      ADMISSION DAY • THE LALIT NEW DELHI
                    </p>
                  </div>
                </div>
              )}

              {/* PAGE 1: AUTHENTIC DIPLOMATIC DATA PAGE (ENGLISH ONLY, ULTRA BOLD) */}
              {currentPage === 1 && (
                <div className="space-y-3">
                  
                  {/* Top Passport Header */}
                  <div className="flex items-center justify-between border-b-2 border-[#261A23] pb-1.5">
                    <div>
                      <span className="font-display font-black text-sm tracking-wide text-[#944F62] block uppercase">
                        FATEH PASSPORT • OFFICIAL CREDENTIAL
                      </span>
                      <span className="text-[9px] font-mono text-gray-600 uppercase font-bold">
                        INTERNATIONAL ADMISSIONS COUNCIL • DELHI NCR
                      </span>
                    </div>
                    <div className="text-right font-mono text-[10px]">
                      <span className="text-gray-400 block font-bold">DOCUMENT NO.</span>
                      <span className="font-black text-sm text-[#944F62]">{student.id}</span>
                    </div>
                  </div>

                  {/* Photo & Identity Grid */}
                  <div className="grid grid-cols-3 gap-3 pt-1">
                    
                    {/* Left: Holographic Passport Photo Box */}
                    <div className="space-y-1">
                      <div className="w-full aspect-3/4 bg-[#261A23] rounded-lg p-1 border-2 border-[#261A23] relative overflow-hidden flex flex-col items-center justify-center shadow-md">
                        <div className="w-14 h-14 rounded-full bg-[#944F62] text-white flex items-center justify-center font-display font-black text-2xl">
                          {student.name.charAt(0)}
                        </div>
                        <div className="absolute inset-x-0 bottom-1 bg-gradient-to-r from-[#9BBFCC]/40 via-[#FF4D9D]/40 to-transparent text-[7px] font-mono text-white text-center py-0.5 tracking-tight font-black">
                          ★ VALIDATED ★
                        </div>
                      </div>

                      <div className="p-1 border border-dashed border-gray-400 rounded text-center">
                        <span className="text-[8px] font-mono text-gray-500 uppercase block font-bold">HOLDER SIGNATURE</span>
                        <span className="font-serif italic text-xs text-[#261A23] font-black">
                          {student.name}
                        </span>
                      </div>
                    </div>

                    {/* Right: Official Passport Fields (English Only, Bold) */}
                    <div className="col-span-2 space-y-1.5 text-[11px] font-mono">
                      <div className="grid grid-cols-2 gap-1 border-b border-gray-200 pb-1">
                        <div>
                          <span className="text-[8px] text-gray-500 block font-bold">SURNAME</span>
                          <span className="font-black text-xs text-[#261A23] uppercase">
                            {student.name.split(' ').slice(1).join(' ') || 'SCHOLAR'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[8px] text-gray-500 block font-bold">GIVEN NAMES</span>
                          <span className="font-black text-xs text-[#261A23] uppercase">
                            {student.name.split(' ')[0]}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1 border-b border-gray-200 pb-1">
                        <div>
                          <span className="text-[8px] text-gray-500 block font-bold">NATIONALITY</span>
                          <span className="font-black text-[#261A23]">INDIAN</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-gray-500 block font-bold">ZONE / REGION</span>
                          <span className="font-black text-[#261A23]">{student.zone}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1 border-b border-gray-200 pb-1">
                        <div>
                          <span className="text-[8px] text-gray-500 block font-bold">TARGET COUNTRY</span>
                          <span className="font-black text-[#944F62]">{student.targetCountry}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-gray-500 block font-bold">TEST SCORES</span>
                          <span className="font-black text-[#261A23]">IELTS {student.ielts} • {student.gradPercent}%</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-0.5">
                        <div>
                          <span className="text-[8px] text-gray-500 block font-bold">TWIN RADAR ID</span>
                          <span className="font-black text-[#944F62] text-[10.5px]">{student.twinHandle}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] text-gray-500 block font-bold">PLACE OF ISSUE</span>
                          <span className="text-[9px] text-gray-800 font-black">LALIT NEW DELHI</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Bottom: Official Machine Readable Zone (MRZ) Strip */}
                  <div className="bg-[#FBF6F0] p-2 rounded-lg border-2 border-[#261A23] font-mono text-[9.5px] leading-tight tracking-wider text-[#261A23] select-all shadow-inner font-bold">
                    <div>P&lt;INDFATEH&lt;&lt;{student.name.replace(/\s+/g, '&lt;&lt;').toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
                    <div>{student.id.replace(/-/g, '')}&lt;8IND0101019M2710245DELHI&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;04</div>
                  </div>

                </div>
              )}

              {/* PAGE 2: QUOTA & ENDORSEMENTS (7+5 = SPIN UNLOCKED) */}
              {currentPage === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <span className="font-display font-black text-sm text-[#261A23] uppercase">
                        FATEH VISA QUOTA & ENDORSEMENTS
                      </span>
                      <span className="text-[10px] font-mono text-gray-500 block font-bold">
                        PAGE 02 • QUOTA 7+5 FORMULA
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#944F62] font-black uppercase">
                      OFFICIAL VISAS
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-[#FBF6F0] rounded-xl border-2 border-[#261A23] text-center space-y-1 brutal-shadow-sm">
                      <span className="text-[10px] font-mono uppercase text-gray-600 block font-bold">
                        UNIVERSITY DESKS
                      </span>
                      <div className="text-3xl font-display font-black text-[#944F62] tabular-nums">
                        {distinctUniCount} <span className="text-base text-gray-400">/ 7</span>
                      </div>
                      <span className={`text-[10px] font-black block ${distinctUniCount >= 7 ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {distinctUniCount >= 7 ? '✓ 7 MET (QUOTA SATISFIED)' : `${7 - distinctUniCount} MORE NEEDED`}
                      </span>
                    </div>

                    <div className="p-3 bg-[#FBF6F0] rounded-xl border-2 border-[#261A23] text-center space-y-1 brutal-shadow-sm">
                      <span className="text-[10px] font-mono uppercase text-gray-600 block font-bold">
                        SPECIALIZED DESKS
                      </span>
                      <div className="text-3xl font-display font-black text-[#9BBFCC] tabular-nums">
                        {distinctSrvCount} <span className="text-base text-gray-400">/ 5</span>
                      </div>
                      <span className={`text-[10px] font-black block ${distinctSrvCount >= 5 ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {distinctSrvCount >= 5 ? '✓ 5 MET (QUOTA SATISFIED)' : `${5 - distinctSrvCount} MORE NEEDED`}
                      </span>
                    </div>
                  </div>

                  <div className={`p-3.5 rounded-xl border-2 transition-all flex items-center justify-between ${
                    isUnlocked
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      {isUnlocked ? (
                        <Unlock className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <Lock className="w-5 h-5 text-amber-600 shrink-0" />
                      )}
                      <div>
                        <h5 className="font-display font-black text-xs uppercase">
                          {isUnlocked ? 'ENDORSEMENT: SPIN YOUR FATE UNLOCKED' : 'ENDORSEMENT LOCKED (REQUIRES 7+5)'}
                        </h5>
                        <p className="text-[10px] text-gray-600 font-medium">
                          {isUnlocked
                            ? 'Seal unbroken. Enrolled into Stage Drum pool.'
                            : 'Collect 7 distinct universities and 5 support desks to validate admission credential.'}
                        </p>
                      </div>
                    </div>

                    {isUnlocked && (
                      <button
                        onClick={() => setCurrentPage(6)}
                        className="px-2.5 py-1 text-xs font-black text-white bg-[#944F62] rounded-lg cursor-pointer shrink-0 uppercase"
                      >
                        Rewards
                      </button>
                    )}
                  </div>

                  {student.id === 'FE-26-0001' && !isUnlocked && (
                    <div className="p-2.5 bg-[#9BBFCC]/20 rounded-lg border-2 border-[#9BBFCC] text-[11px] font-mono text-[#261A23]">
                      💡 <strong>Demo tip:</strong> Aarav has 6/7 uni stamps. Click <strong>"Stamp at Stall"</strong> above and pick <strong>A01 Northbridge</strong> to hit 7+5!
                    </div>
                  )}
                </div>
              )}

              {/* PAGE 3: UK & IRELAND VISAS */}
              {currentPage === 3 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <span className="font-display font-black text-sm text-[#261A23] uppercase">
                        UNITED KINGDOM & IRELAND VISAS
                      </span>
                      <span className="text-[10px] font-mono text-gray-500 block font-bold">
                        PAGE 03 • STALLS A01-A06 & B01-B06
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#944F62] font-black uppercase">
                      OFFICIAL VISAS
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 min-h-[280px] content-start">
                    {uniStamps
                      .filter((st) => st.stallNo.startsWith('A') || st.stallNo.startsWith('B'))
                      .map((st, i) => (
                        <div key={i} className="flex justify-center">
                          {renderConsularStamp(
                            st.stallNo,
                            st.stallName,
                            st.timestamp,
                            st.hash,
                            st.rotation,
                            st.stallNo.startsWith('A') ? 'uk' : 'ie'
                          )}
                        </div>
                      ))}

                    {uniStamps.filter((st) => st.stallNo.startsWith('A') || st.stallNo.startsWith('B')).length === 0 && (
                      <div className="col-span-2 text-center py-12 text-xs text-gray-400 font-mono font-bold">
                        No UK or Ireland immigration stamps yet. Visit Stalls A01-A06 or B01-B06.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PAGE 4: DUBAI & NEW ZEALAND VISAS */}
              {currentPage === 4 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <span className="font-display font-black text-sm text-[#261A23] uppercase">
                        DUBAI (UAE) & NEW ZEALAND VISAS
                      </span>
                      <span className="text-[10px] font-mono text-gray-500 block font-bold">
                        PAGE 04 • STALLS C01-C06 & D01-D06
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#944F62] font-black uppercase">
                      OFFICIAL VISAS
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 min-h-[280px] content-start">
                    {uniStamps
                      .filter((st) => st.stallNo.startsWith('C') || st.stallNo.startsWith('D'))
                      .map((st, i) => (
                        <div key={i} className="flex justify-center">
                          {renderConsularStamp(
                            st.stallNo,
                            st.stallName,
                            st.timestamp,
                            st.hash,
                            st.rotation,
                            st.stallNo.startsWith('C') ? 'ae' : 'nz'
                          )}
                        </div>
                      ))}

                    {uniStamps.filter((st) => st.stallNo.startsWith('C') || st.stallNo.startsWith('D')).length === 0 && (
                      <div className="col-span-2 text-center py-12 text-xs text-gray-400 font-mono font-bold">
                        No Dubai or NZ entry stamps yet. Visit Stalls C01-C06 or D01-D06.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PAGE 5: SPECIALIZED SERVICES DESKS (S1 - S5) */}
              {currentPage === 5 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <span className="font-display font-black text-sm text-[#261A23] uppercase">
                        SPECIALIZED ADVISORY & SERVICES
                      </span>
                      <span className="text-[10px] font-mono text-gray-500 block font-bold">
                        PAGE 05 • SUPPORT DESKS S1 TO S5
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#944F62] font-black uppercase">
                      SPECIAL SERVICES
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 min-h-[280px] content-start">
                    {srvStamps.map((st, i) => (
                      <div key={i} className="flex justify-center">
                        {renderConsularStamp(st.stallNo, st.stallName, st.timestamp, st.hash, st.rotation, 'srv')}
                      </div>
                    ))}

                    {srvStamps.length === 0 && (
                      <div className="col-span-2 text-center py-12 text-xs text-gray-400 font-mono font-bold">
                        No service desk endorsements yet. Visit Desks S1 to S5.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PAGE 6: OFFICIAL REWARDS & SPIN SEAL */}
              {currentPage === 6 && (
                <div className="space-y-4 text-center py-2">
                  <div className="flex items-center justify-between border-b pb-2 text-left">
                    <div>
                      <span className="font-display font-black text-sm text-[#261A23] uppercase">
                        OFFICIAL FATEH REWARDS SEAL
                      </span>
                      <span className="text-[10px] font-mono text-gray-500 block font-bold">
                        PAGE 06 • REWARDS ENDORSEMENT
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#944F62] font-black uppercase">
                      SPIN YOUR FATE
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center space-y-3 py-3">
                    <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all ${
                      isUnlocked
                        ? 'border-[#944F62] bg-[#944F62]/10 text-[#944F62] shadow-xl animate-bounce'
                        : 'border-gray-300 bg-gray-50 text-gray-400'
                    }`}>
                      <Award className="w-12 h-12" />
                    </div>

                    <div>
                      <h4 className="font-display font-black text-lg text-[#261A23] uppercase">
                        {isUnlocked ? 'SEAL VERIFIED • SPIN YOUR FATE UNLOCKED' : 'SEAL LOCKED (REQUIRES 7+5)'}
                      </h4>
                      <p className="text-xs text-[#261A23]/80 max-w-xs mx-auto font-medium">
                        {isUnlocked
                          ? `${student.name} is enrolled in the Stage Wheel & Drum for university goodies, hoodies, and free counselling sessions.`
                          : 'You need 7 distinct university stamps and 5 service stamps to break this seal.'}
                      </p>
                    </div>

                    {isUnlocked && (
                      <div className="w-full max-w-xs space-y-2 pt-2">
                        {student.spinWonPrize ? (
                          <div className="p-3 bg-emerald-50 border-2 border-emerald-500 rounded-xl text-emerald-950 text-xs space-y-1">
                            <span className="font-black block text-emerald-800">🎉 WON PRIZE:</span>
                            <span className="font-bold">{student.spinWonPrize}</span>
                            <span className="text-[10px] text-gray-600 block">Awarded at: {student.spinWonAt}</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setRole('stage');
                              setStageScene('spin');
                            }}
                            className="w-full py-2.5 px-4 text-xs font-black text-white bg-[#944F62] hover:bg-[#261A23] rounded-xl brutal-shadow transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase"
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>View Live Wheel on Stage Screen</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Passport Page Turn Controls */}
            <div className="bg-[#FBF6F0] border-t-2 border-[#261A23] p-3 flex items-center justify-between relative z-10">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className={`flex items-center gap-1 text-xs font-black text-[#261A23] px-2.5 py-1 rounded-lg border border-[#261A23]/40 ${
                  currentPage === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Page</span>
              </button>

              <div className="text-center">
                <span className="text-xs font-mono font-black text-[#261A23] block">
                  {currentPage === 0 ? 'COVER' : `PAGE 0${currentPage} / 06`}
                </span>
                <span className="text-[9px] font-mono text-gray-600 uppercase font-bold">
                  FATEH PASSPORT
                </span>
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                className={`flex items-center gap-1 text-xs font-black text-[#261A23] px-2.5 py-1 rounded-lg border border-[#261A23]/40 ${
                  currentPage === totalPages - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white cursor-pointer'
                }`}
              >
                <span>Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* PHASE T+1: Mint My Fateh Passport Card & DEPART TO SOCIALS */}
      {(phase === 'T+1' || phase === 'T+2') && (
        <div className="bg-white rounded-2xl p-4 brutal-border brutal-shadow space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase bg-[#944F62] text-white px-2 py-0.5 rounded font-black">
              T+1 Commemorative Mint
            </span>
            <span className="text-[10px] font-mono text-gray-500 font-bold">
              Simulation: No real blockchain used
            </span>
          </div>

          <h4 className="font-display font-black text-base text-[#261A23] uppercase">
            Mint Collectible Fateh Passport Card
          </h4>

          <p className="text-xs text-[#261A23]/80 font-medium">
            Generate an archival commemorative card compiled from your verified stamps, with cryptographic proof of your university consultations.
          </p>

          {!student.mintedTokenId ? (
            <button
              onClick={handleStartMint}
              disabled={isMinting}
              className="w-full py-2.5 px-4 text-xs font-black text-white bg-[#261A23] hover:bg-[#944F62] rounded-xl brutal-shadow cursor-pointer transition-all flex items-center justify-center gap-2 uppercase"
            >
              {isMinting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#9BBFCC]" />
                  <span>
                    {mintStep === 1 && 'Hashing 12 stamp proofs...'}
                    {mintStep === 2 && 'Compiling mandala artwork...'}
                    {mintStep === 3 && 'Signing Fateh proof root...'}
                    {mintStep === 4 && 'Minted!'}
                  </span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4 text-[#9BBFCC]" />
                  <span>Mint My Fateh Passport</span>
                </>
              )}
            </button>
          ) : (
            <div className="p-3 bg-[#FBF6F0] rounded-xl border-2 border-[#261A23] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-gray-600 font-bold">Token ID:</span>
                <span className="font-mono font-black text-[#944F62]">{student.mintedTokenId}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-gray-600 font-bold">Signer:</span>
                <span className="font-mono text-[10px] text-gray-700 font-bold truncate max-w-[170px]">
                  0x944f62...delhi2026
                </span>
              </div>

              {/* PROMINENT DEPART BUTTON FOR SOCIAL MEDIA SHARING & ANALYTICS */}
              <div className="pt-1">
                <button
                  onClick={() => setDepartModalOpen(true)}
                  className="w-full py-2.5 px-3 text-xs font-black bg-gradient-to-r from-[#944F62] via-[#FF4D9D] to-[#261A23] text-white rounded-xl brutal-shadow-sm hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase shadow-md"
                >
                  <Send className="w-4 h-4 text-[#FFB81C]" />
                  <span>Depart & Share NFT Credentials (LinkedIn & IG)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DEPART & SHARE SOCIAL MODAL (LINKEDIN & INSTAGRAM ANALYTICS) */}
      {departModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#FBF6F0] text-[#261A23] rounded-3xl brutal-border brutal-shadow-lg max-w-md w-full p-5 space-y-4 animate-in zoom-in-95 duration-200 border-4 border-[#261A23]">
            
            <div className="flex items-center justify-between border-b-2 border-[#261A23] pb-2">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-[#944F62]" />
                <h3 className="font-display font-black text-base uppercase">
                  Depart to Social Media Platforms
                </h3>
              </div>
              <button
                onClick={() => setDepartModalOpen(false)}
                className="p-1 hover:bg-black/10 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Platform Switcher: LinkedIn | Instagram */}
            <div className="flex bg-[#261A23]/10 p-1 rounded-xl border border-[#261A23]/20">
              <button
                onClick={() => setDepartPlatform('linkedin')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  departPlatform === 'linkedin'
                    ? 'bg-[#0077B5] text-white shadow-md'
                    : 'text-[#261A23]'
                }`}
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn Certificate</span>
              </button>

              <button
                onClick={() => setDepartPlatform('instagram')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  departPlatform === 'instagram'
                    ? 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white shadow-md'
                    : 'text-[#261A23]'
                }`}
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram Story</span>
              </button>
            </div>

            {/* LINKEDIN TAB CONTENT */}
            {departPlatform === 'linkedin' && (
              <div className="space-y-3">
                <div className="bg-white p-3.5 rounded-xl border-2 border-[#261A23] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#0077B5] font-black uppercase">
                      VERIFIABLE ACADEMIC BADGE
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 font-bold">
                      {student.mintedTokenId || 'FE-NFT-2026-884210'}
                    </span>
                  </div>

                  <h5 className="font-display font-black text-sm text-[#261A23]">
                    {student.name} • Certified Study Abroad Scholar
                  </h5>

                  <p className="text-[11px] text-gray-700 leading-snug">
                    Completed 12 verified consultations with UK, Irish, Dubai, and NZ university representatives at Hotel Lalit, Delhi NCR.
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-800 font-bold">
                      #StudyAbroad2027
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-800 font-bold">
                      #FatehPassport
                    </span>
                  </div>
                </div>

                {/* Copy post copy button */}
                <button
                  onClick={handleCopyLinkedIn}
                  className="w-full py-2.5 px-3 text-xs font-black text-white bg-[#0077B5] hover:bg-[#005E93] rounded-xl brutal-shadow-sm cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedSocialText ? '✓ LinkedIn Post Copied!' : 'Copy LinkedIn Post & Badge'}</span>
                </button>
              </div>
            )}

            {/* INSTAGRAM TAB CONTENT WITH LIVE SIMULATED ANALYTICS */}
            {departPlatform === 'instagram' && (
              <div className="space-y-3">
                {/* 9:16 Mini Story Preview Card */}
                <div className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] p-3 rounded-2xl text-white text-center space-y-2 shadow-lg">
                  <div className="flex justify-between text-[10px] font-mono font-bold">
                    <span>@fateheducation</span>
                    <span>OCT 24 STORY</span>
                  </div>

                  <div className="py-2">
                    <div className="w-12 h-12 rounded-full border-2 border-white mx-auto flex items-center justify-center font-display font-black text-lg mb-1">
                      {student.name.charAt(0)}
                    </div>
                    <span className="font-display font-black text-sm block">
                      {student.name}
                    </span>
                    <span className="text-[10px] font-mono text-white/90">
                      Fateh Passport Minted • 12 Stalls Unlocked
                    </span>
                  </div>

                  <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-lg text-[9.5px] font-mono font-bold">
                    TOKEN: {student.mintedTokenId || 'FE-NFT-2026-884210'}
                  </div>
                </div>

                {/* Simulated Instagram Analytics Matrix */}
                <div className="bg-white p-3 rounded-xl border-2 border-[#261A23] space-y-1.5">
                  <span className="text-[10px] font-mono text-gray-500 uppercase font-black block">
                    Simulated Instagram Story Reach & Engagement:
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center font-mono">
                    <div className="p-1.5 bg-gray-50 rounded">
                      <span className="text-[9px] text-gray-500 block">Est. Reach</span>
                      <span className="font-black text-xs text-[#261A23]">2,420</span>
                    </div>
                    <div className="p-1.5 bg-gray-50 rounded">
                      <span className="text-[9px] text-gray-500 block">Engagement</span>
                      <span className="font-black text-xs text-[#944F62]">89.4%</span>
                    </div>
                    <div className="p-1.5 bg-gray-50 rounded">
                      <span className="text-[9px] text-gray-500 block">Profile Taps</span>
                      <span className="font-black text-xs text-emerald-700">142</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => alert('Instagram Story graphic exported to simulated photos gallery!')}
                  className="w-full py-2.5 px-3 text-xs font-black text-white bg-gradient-to-r from-[#833AB4] to-[#FD1D1D] rounded-xl brutal-shadow-sm cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download 9:16 Instagram Story PNG</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* STAMP AT STALL BOTTOM SHEET */}
      {stampSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FBF6F0] text-[#261A23] rounded-2xl brutal-border brutal-shadow-lg max-w-md w-full p-5 space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#944F62]" />
                <h3 className="font-display font-black text-base uppercase">
                  Simulate Stall Scan / Tap
                </h3>
              </div>
              <button
                onClick={() => setStampSheetOpen(false)}
                className="p-1 hover:bg-black/5 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex bg-[#261A23]/5 p-1 rounded-xl border border-[#261A23]/20">
              <button
                onClick={() => setStampMethod('qr')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  stampMethod === 'qr' ? 'bg-[#944F62] text-white shadow' : 'text-[#261A23]'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>QR Viewfinder</span>
              </button>
              <button
                onClick={() => setStampMethod('nfc')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  stampMethod === 'nfc' ? 'bg-[#944F62] text-white shadow' : 'text-[#261A23]'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>NFC Desk Tap</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-black mb-1 uppercase">
                Select Stall to Stamp:
              </label>
              <select
                value={selectedStallToStamp}
                onChange={(e) => setSelectedStallToStamp(e.target.value)}
                className="w-full p-2 text-xs font-bold rounded-lg border-2 border-[#261A23] bg-white outline-none"
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
                <optgroup label="Support Desks (S1 - S5)">
                  {SERVICE_STALLS.map((s) => (
                    <option key={s.id} value={s.stallNo}>
                      {s.stallNo} - {s.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="h-32 bg-[#261A23] rounded-xl flex flex-col items-center justify-center text-center p-3 relative overflow-hidden">
              {stampMethod === 'qr' ? (
                <>
                  <div className="w-16 h-16 border-2 border-[#9BBFCC] rounded-lg relative flex items-center justify-center">
                    <div className="absolute inset-x-0 h-0.5 bg-red-500 animate-pulse" />
                    <QrCode className="w-8 h-8 text-white/40" />
                  </div>
                  <span className="text-[10px] font-mono text-[#9BBFCC] pt-2 font-bold">
                    Point camera at stall QR standee
                  </span>
                </>
              ) : (
                <>
                  <div className="relative flex items-center justify-center w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-2 border-[#944F62] animate-ping opacity-40" />
                    <div className="w-10 h-10 rounded-full bg-[#944F62] flex items-center justify-center text-white">
                      <Radio className="w-5 h-5 animate-pulse" />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#9BBFCC] pt-2 font-bold">
                    Hold phone within 4cm of stall NFC disc
                  </span>
                </>
              )}
            </div>

            {stampError && (
              <div className="p-2.5 bg-red-100 border border-red-400 rounded-lg text-xs text-red-800 flex items-start gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{stampError}</span>
              </div>
            )}

            <button
              onClick={handleSimulateStamp}
              className="w-full py-2.5 px-4 text-xs font-black text-white bg-[#944F62] hover:bg-[#261A23] rounded-xl brutal-shadow cursor-pointer transition-all uppercase"
            >
              Confirm Simulated {stampMethod === 'qr' ? 'Scan' : 'NFC Tap'}
            </button>
          </div>
        </div>
      )}

      {/* BLOCKCHAIN LEDGER VERIFICATION SHEET */}
      {chainSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FBF6F0] text-[#261A23] rounded-2xl brutal-border brutal-shadow-lg max-w-lg w-full p-5 space-y-4 animate-in slide-in-from-bottom duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#944F62]" />
                <h3 className="font-display font-black text-base uppercase">
                  Fateh Passport Chain Ledger
                </h3>
              </div>
              <button
                onClick={() => setChainSheetOpen(false)}
                className="p-1 hover:bg-black/5 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#261A23]/80 leading-relaxed font-body font-medium">
              "A normal database could run the game. The tamper-proof stamp layer lets universities verify visits independently without centralized trust."
            </p>

            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
              isChainTampered
                ? 'bg-red-50 border-red-500 text-red-900'
                : 'bg-emerald-50 border-emerald-500 text-emerald-900'
            }`}>
              <div className="flex items-center gap-2">
                {isChainTampered ? (
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                <div>
                  <span className="font-black block uppercase">
                    {isChainTampered ? 'HASH INTEGRITY FAILED' : 'ALL BLOCKS VERIFIED'}
                  </span>
                  <span className="text-[11px] text-gray-600 font-bold">
                    {isChainTampered
                      ? 'Block #3 prevHash discrepancy! Chain broken.'
                      : 'Authoritative root: 0x944F...62 verified'}
                  </span>
                </div>
              </div>

              {isChainTampered ? (
                <button
                  onClick={repairChain}
                  className="px-2.5 py-1 text-xs font-black bg-emerald-700 text-white rounded-lg cursor-pointer uppercase"
                >
                  Repair Chain
                </button>
              ) : (
                <button
                  onClick={tamperChain}
                  className="px-2.5 py-1 text-xs font-black bg-red-700 text-white rounded-lg cursor-pointer uppercase"
                >
                  Tamper Test
                </button>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono text-gray-500 uppercase font-black">
                Last 5 Cryptographic Stamp Blocks:
              </span>
              {student.stamps.slice(-5).map((st, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border text-xs font-mono space-y-1 ${
                    isChainTampered && idx === 2
                      ? 'bg-red-50 border-red-500 text-red-900'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-center font-bold">
                    <span className="font-black text-[#944F62]">
                      Block #{student.stamps.length - 5 + idx + 1}: {st.stallNo} ({st.stallName})
                    </span>
                    <span className="text-[10px] text-gray-500">{st.timestamp}</span>
                  </div>
                  <div className="text-[10px] text-gray-600 truncate">
                    Hash: {isChainTampered && idx === 2 ? '0000_TAMPERED_DISCREPANCY_7719' : st.hash}
                  </div>
                  <div className="text-[9px] text-gray-400 truncate">
                    PrevHash: {st.prevHash}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[10px] text-gray-500 text-center font-mono font-bold">
              Simulation only • Cryptographic hashing via Web Crypto API SHA-256
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
