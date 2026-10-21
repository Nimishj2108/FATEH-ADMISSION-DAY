import React, { useState } from 'react';
import { useFatehStore } from '../../store/useFatehStore';
import { LiveDashboard } from './LiveDashboard';
import { WarRoom } from './WarRoom';
import { SpinControl } from './SpinControl';
import { PostEvent } from './PostEvent';
import {
  LayoutDashboard,
  ShieldAlert,
  Disc3,
  PackageCheck,
  Tv,
  ExternalLink,
} from 'lucide-react';

export const FatehConsole: React.FC = () => {
  const [activeConsoleTab, setActiveConsoleTab] = useState<'dashboard' | 'warroom' | 'spin' | 'postevent'>('dashboard');
  const { setRole, setStageScene } = useFatehStore();

  const tabs = [
    { id: 'dashboard', label: 'Live Dashboard', icon: LayoutDashboard },
    { id: 'warroom', label: 'T-48 War Room', icon: ShieldAlert },
    { id: 'spin', label: 'Spin Control', icon: Disc3 },
    { id: 'postevent', label: 'Post-Event Ops', icon: PackageCheck },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* Console Sub-Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#261A23] text-white p-2.5 rounded-2xl brutal-border brutal-shadow">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeConsoleTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveConsoleTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#944F62] text-white shadow-md'
                    : 'text-[#FBF6F0]/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            setRole('stage');
            setStageScene('spotlight');
          }}
          className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold bg-[#9BBFCC] text-[#261A23] hover:bg-white rounded-xl cursor-pointer transition-all shrink-0"
        >
          <Tv className="w-4 h-4" />
          <span>Stage Projector Controls</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Active Tab Component */}
      {activeConsoleTab === 'dashboard' && <LiveDashboard />}
      {activeConsoleTab === 'warroom' && <WarRoom />}
      {activeConsoleTab === 'spin' && <SpinControl />}
      {activeConsoleTab === 'postevent' && <PostEvent />}

    </div>
  );
};
