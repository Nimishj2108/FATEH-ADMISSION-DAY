import React, { useEffect } from 'react';
import { useFatehStore } from '../store/useFatehStore';
import { AppPhase, UserRole } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  Volume2,
  VolumeX,
  Compass,
  UserCheck,
  Smartphone,
  ScanLine,
  LayoutDashboard,
  Tv,
} from 'lucide-react';

const PHASES: { id: AppPhase; label: string; desc: string }[] = [
  { id: 'T-21', label: 'T-21 Launch', desc: 'Pre-registration' },
  { id: 'T-48h', label: 'T-48h War Room', desc: 'Drop-off defense' },
  { id: 'EventDay', label: 'Event Day', desc: '24 Oct • Lalit' },
  { id: 'T+1', label: 'T+1 Post-Event', desc: 'Vouchers & Mint' },
  { id: 'T+2', label: 'T+2 Feed', desc: 'Admissions feed' },
];

const ROLES: { id: UserRole; label: string; icon: React.ElementType }[] = [
  { id: 'student', label: 'Student App', icon: Smartphone },
  { id: 'scanner', label: 'Stall Scanner', icon: ScanLine },
  { id: 'console', label: 'Fateh Console', icon: LayoutDashboard },
  { id: 'stage', label: 'Stage Screen', icon: Tv },
];

export const AppHeader: React.FC = () => {
  const {
    phase,
    setPhase,
    role,
    setRole,
    clockTime,
    clockPlaying,
    clockSpeed,
    setClockPlaying,
    setClockSpeed,
    advanceClock,
    audioMuted,
    setAudioMuted,
    reducedMotion,
    setReducedMotion,
    resetDemo,
    loadFeaturedAarav,
    setTourStep,
    setShowPreloader,
  } = useFatehStore();

  // Clock ticker
  useEffect(() => {
    if (!clockPlaying || phase !== 'EventDay') return;

    const intervalMs = 1000;
    // 1x = 1 min every 60s
    // 60x = 1 min every 1s
    // 600x = 10 mins every 1s
    const deltaPerSec = clockSpeed === 600 ? 10 : clockSpeed === 60 ? 1 : 0.1;

    const timer = setInterval(() => {
      advanceClock(deltaPerSec);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [clockPlaying, clockSpeed, phase, advanceClock]);

  const openStageInNewWindow = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('role', 'stage');
    window.open(url.toString(), '_blank', 'width=1280,height=720');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF6F0] border-b-2 border-[#261A23] shadow-sm select-none">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Location Chip */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-lg tracking-tight text-[#261A23]">
              FATEH <span className="text-[#944F62]">OS</span>
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono font-bold bg-[#944F62] text-white px-2 py-0.5 rounded-md brutal-shadow-sm">
              24 Oct • Hotel Lalit • Delhi NCR
            </span>
          </div>

          <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-[#9BBFCC]/30 text-[#261A23] border border-[#261A23]/30">
            Pitch Prototype
          </span>
        </div>

        {/* Quick Utility Tools */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={loadFeaturedAarav}
            title="Load featured student: Aarav Sharma (Needs 1 more uni stamp to unlock 7+5 Spin)"
            className="flex items-center gap-1.5 px-2.5 py-1 font-medium bg-[#944F62]/10 hover:bg-[#944F62] text-[#944F62] hover:text-white border border-[#944F62] rounded-lg transition-all cursor-pointer whitespace-nowrap"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Demo:</span>
            <span>Load Aarav</span>
          </button>

          <button
            onClick={() => setTourStep(0)}
            className="flex items-center gap-1.5 px-2.5 py-1 font-medium bg-[#9BBFCC]/20 hover:bg-[#9BBFCC] text-[#261A23] border border-[#261A23] rounded-lg transition-all cursor-pointer whitespace-nowrap"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Guided Tour</span>
          </button>

          <button
            onClick={openStageInNewWindow}
            title="Open 16:9 Stage Screen in a second window for live projector mirroring"
            className="flex items-center gap-1 px-2.5 py-1 font-medium bg-[#261A23] text-white hover:bg-[#944F62] rounded-lg transition-all cursor-pointer whitespace-nowrap"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">2nd Screen</span>
            <span>Stage</span>
          </button>

          <button
            onClick={() => setAudioMuted(!audioMuted)}
            title={audioMuted ? 'Unmute sounds' : 'Mute sounds'}
            className="p-1.5 text-[#261A23] hover:bg-[#261A23]/10 rounded-lg border border-transparent hover:border-[#261A23] cursor-pointer"
          >
            {audioMuted ? <VolumeX className="w-4 h-4 text-red-600" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowPreloader(true)}
            className="hidden sm:inline-block text-[11px] text-[#944F62] hover:underline font-hindi cursor-pointer"
          >
            Replay नमस्ते
          </button>

          <button
            onClick={resetDemo}
            title="Reset all demo state to fresh baseline"
            className="flex items-center gap-1 p-1.5 text-[#261A23] hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Control Strip: Phase Scrubber + Clock + Role Switcher */}
      <div className="bg-[#261A23] text-[#FBF6F0] px-4 py-2 border-t border-[#944F62]/30">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
          
          {/* 1. Phase Scrubber */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <span className="text-[10px] font-mono text-[#9BBFCC] uppercase tracking-wider mr-1 shrink-0">
              Timeline:
            </span>
            <div className="flex items-center bg-[#1E141C] p-0.5 rounded-lg border border-[#944F62]/40 shrink-0">
              {PHASES.map((p) => {
                const isActive = phase === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPhase(p.id)}
                    className={`px-2.5 py-1 rounded-md font-medium text-xs transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#944F62] text-white font-bold shadow-sm'
                        : 'text-[#FBF6F0]/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Event Clock (Shows on Event Day) */}
          {phase === 'EventDay' ? (
            <div className="flex items-center gap-2 bg-[#1E141C] px-2.5 py-1 rounded-lg border border-[#9BBFCC]/30 shrink-0">
              <span className="text-[10px] font-mono text-[#9BBFCC] uppercase">Clock:</span>
              <span className="font-mono font-bold text-sm text-[#FBF6F0] tabular-nums min-w-[70px]">
                {clockTime}
              </span>

              <div className="flex items-center gap-1 pl-1 border-l border-white/20">
                <button
                  onClick={() => setClockPlaying(!clockPlaying)}
                  className="p-1 rounded hover:bg-white/10 text-white cursor-pointer"
                  title={clockPlaying ? 'Pause Clock' : 'Run Clock'}
                >
                  {clockPlaying ? <Pause className="w-3.5 h-3.5 text-[#9BBFCC]" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                </button>

                <div className="flex items-center gap-0.5">
                  {([1, 60, 600] as const).map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setClockSpeed(spd)}
                      className={`text-[10px] px-1.5 py-0.5 rounded cursor-pointer ${
                        clockSpeed === spd ? 'bg-[#9BBFCC] text-[#261A23] font-bold' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex items-center text-[11px] text-[#9BBFCC] font-mono">
              <span>Phase context: {PHASES.find(p => p.id === phase)?.desc}</span>
            </div>
          )}

          {/* 3. Role Switcher */}
          <div className="flex items-center gap-1 self-start lg:self-auto overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-mono text-[#9BBFCC] uppercase tracking-wider mr-1 shrink-0">
              Role:
            </span>
            <div className="flex items-center bg-[#1E141C] p-0.5 rounded-lg border border-[#944F62]/40 shrink-0">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const isActive = role === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium text-xs transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#FBF6F0] text-[#261A23] font-bold shadow-sm'
                        : 'text-[#FBF6F0]/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
