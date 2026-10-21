import React, { useEffect } from 'react';
import { useFatehStore } from '../../store/useFatehStore';
import { StageSpotlight } from './StageSpotlight';
import { StageSpinDrum } from './StageSpinDrum';
import { StageCounter } from './StageCounter';
import {
  Tv,
  Maximize2,
  Sparkles,
  Users,
  Trophy,
  BarChart3,
} from 'lucide-react';

export const StageScreen: React.FC = () => {
  const {
    stageScene,
    setStageScene,
    spotlightRunning,
    startSpotlightTimer,
    pauseSpotlightTimer,
    endSpotlightTimer,
    spotlightCandidates,
    activeSpotlightCandidateId,
    setActiveSpotlightCandidate,
  } = useFatehStore();

  // Keyboard shortcut listener: Space = pause/play, N = next, E = end
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (stageScene === 'spotlight') {
          if (spotlightRunning) pauseSpotlightTimer();
          else startSpotlightTimer();
        }
      } else if (e.code === 'KeyN') {
        e.preventDefault();
        if (stageScene === 'spotlight') {
          // Switch to next candidate in queue
          const currentIdx = spotlightCandidates.findIndex((c) => c.id === activeSpotlightCandidateId);
          const nextIdx = (currentIdx + 1) % spotlightCandidates.length;
          setActiveSpotlightCandidate(spotlightCandidates[nextIdx].id);
        } else if (stageScene === 'spin') {
          setStageScene('counter');
        } else if (stageScene === 'counter') {
          setStageScene('spotlight');
        }
      } else if (e.code === 'KeyE') {
        e.preventDefault();
        if (stageScene === 'spotlight') {
          endSpotlightTimer();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    stageScene,
    spotlightRunning,
    startSpotlightTimer,
    pauseSpotlightTimer,
    endSpotlightTimer,
    spotlightCandidates,
    activeSpotlightCandidateId,
    setActiveSpotlightCandidate,
    setStageScene,
  ]);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-120px)] bg-[#1A1118] text-[#FBF6F0] flex flex-col justify-between relative overflow-hidden select-none">
      
      {/* Top Projector Scene Nav Bar */}
      <div className="bg-black/60 border-b border-white/10 px-4 py-2 flex items-center justify-between text-xs font-mono shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[#FF4D9D] font-bold">STAGE SCREEN 16:9</span>
          <span className="text-white/40">•</span>
          <span className="text-[#9BBFCC]">Mirroring live via BroadcastChannel</span>
        </div>

        {/* Scene Switcher Buttons */}
        <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-lg border border-white/10">
          <button
            onClick={() => setStageScene('spotlight')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              stageScene === 'spotlight' ? 'bg-[#944F62] text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Profile Spotlight</span>
          </button>

          <button
            onClick={() => setStageScene('spin')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              stageScene === 'spin' ? 'bg-[#944F62] text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Spin Your Fate</span>
          </button>

          <button
            onClick={() => setStageScene('counter')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              stageScene === 'counter' ? 'bg-[#944F62] text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Live Counter</span>
          </button>
        </div>

        <button
          onClick={handleToggleFullscreen}
          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono text-[#9BBFCC] hover:text-white rounded border border-white/20 cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Fullscreen</span>
        </button>
      </div>

      {/* Main Scene Body */}
      <div className="flex-1 overflow-hidden">
        {stageScene === 'spotlight' && <StageSpotlight />}
        {stageScene === 'spin' && <StageSpinDrum />}
        {stageScene === 'counter' && <StageCounter />}
      </div>

    </div>
  );
};
