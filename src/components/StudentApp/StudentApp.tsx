import React, { useState } from 'react';
import { useFatehStore } from '../../store/useFatehStore';
import { HomeTab } from './HomeTab';
import { PassportTab } from './PassportTab';
import { TwinTab } from './TwinTab';
import { StallsTab } from './StallsTab';
import { FeedTab } from './FeedTab';
import {
  Home,
  BookOpen,
  Users2,
  Compass,
  Newspaper,
  UserCheck,
} from 'lucide-react';

type StudentTab = 'home' | 'passport' | 'twin' | 'stalls' | 'feed';

export const StudentApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StudentTab>('passport');
  const { activeStudentId, students, loadFeaturedAarav } = useFatehStore();
  const currentStudent = students.find((s) => s.id === activeStudentId) || students[0];

  const tabs: { id: StudentTab; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'passport', label: 'Fateh Passport', icon: BookOpen },
    { id: 'twin', label: 'TWIN', icon: Users2 },
    { id: 'stalls', label: 'My Stalls', icon: Compass },
    { id: 'feed', label: 'Feed', icon: Newspaper },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 px-2 sm:px-4">
      {/* Student Profile Quick Switcher strip on top of phone */}
      <div className="w-full max-w-md flex items-center justify-between text-xs mb-2 px-1">
        <div className="flex items-center gap-1.5 truncate">
          <span className="font-mono text-[10px] text-gray-500 uppercase">Current Attendee:</span>
          <span className="font-bold text-[#261A23] truncate">{currentStudent.name}</span>
          <span className="text-[10px] font-mono text-[#944F62]">({currentStudent.id})</span>
        </div>

        {currentStudent.id !== 'FE-26-0001' && (
          <button
            onClick={loadFeaturedAarav}
            className="text-[10px] font-mono font-bold text-[#944F62] hover:underline cursor-pointer shrink-0"
          >
            Switch to Aarav (Demo)
          </button>
        )}
      </div>

      {/* Realistic Mobile Device Container */}
      <div className="w-full max-w-md bg-[#FBF6F0] rounded-3xl brutal-border brutal-shadow-lg flex flex-col min-h-[680px] max-h-[88vh] overflow-hidden relative border-4 border-[#261A23]">
        
        {/* Device Status Bar */}
        <div className="bg-[#261A23] text-[#FBF6F0] px-5 py-2 flex items-center justify-between text-[11px] font-mono shrink-0 select-none">
          <span>09:41 AM</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#9BBFCC]">5G • Hotel Lalit WiFi</span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          {activeTab === 'home' && <HomeTab onNavigateTab={setActiveTab} />}
          {activeTab === 'passport' && <PassportTab />}
          {activeTab === 'twin' && <TwinTab />}
          {activeTab === 'stalls' && <StallsTab />}
          {activeTab === 'feed' && <FeedTab onNavigateTab={setActiveTab} />}
        </div>

        {/* Fixed Mobile Bottom Navigation Bar */}
        <div className="bg-white border-t-2 border-[#261A23] px-2 py-1.5 flex items-center justify-around shrink-0 select-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#944F62] font-bold scale-105'
                    : 'text-gray-500 hover:text-[#261A23]'
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-[#944F62]/10' : ''}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium tracking-tight">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

      </div>

    </div>
  );
};
