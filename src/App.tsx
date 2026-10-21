/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useFatehStore } from './store/useFatehStore';
import { Preloader } from './components/Preloader';
import { AppHeader } from './components/AppHeader';
import { GuidedTour } from './components/GuidedTour';
import { StudentApp } from './components/StudentApp/StudentApp';
import { StallScanner } from './components/StallScanner/StallScanner';
import { FatehConsole } from './components/FatehConsole/FatehConsole';
import { StageScreen } from './components/StageScreen/StageScreen';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function App() {
  const { role, setRole, toast, clearToast } = useFatehStore();

  // Support direct URL role launch (e.g. ?role=stage or ?view=stage)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRole = params.get('role') || params.get('view');
      if (urlRole && ['student', 'scanner', 'console', 'stage'].includes(urlRole)) {
        setRole(urlRole as any);
      }
    }
  }, [setRole]);

  return (
    <div className="min-h-screen bg-[#FBF6F0] text-[#261A23] flex flex-col font-sans selection:bg-[#944F62] selection:text-white">
      {/* 1. Preloader Component */}
      <Preloader />

      {/* 2. Top Bar & Master Shell Navigation */}
      <AppHeader />

      {/* 3. Main Workspace Area */}
      <main className="flex-1 flex flex-col">
        {role === 'student' && <StudentApp />}
        {role === 'scanner' && <StallScanner />}
        {role === 'console' && <FatehConsole />}
        {role === 'stage' && <StageScreen />}
      </main>

      {/* 4. Guided Tour Modal */}
      <GuidedTour />

      {/* 5. Global Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-200 max-w-sm w-full">
          <div
            className={`p-3.5 rounded-xl border-2 brutal-shadow flex items-start gap-2.5 ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
                : toast.type === 'alert'
                ? 'bg-red-50 border-red-600 text-red-950'
                : 'bg-[#261A23] border-[#944F62] text-[#FBF6F0]'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
            {toast.type === 'alert' && <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-[#9BBFCC] shrink-0 mt-0.5" />}

            <div className="flex-1 text-xs font-medium leading-snug">
              {toast.message}
            </div>

            <button
              onClick={clearToast}
              className="p-1 hover:opacity-70 rounded cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
