import React from 'react';
import { useFatehStore } from '../store/useFatehStore';
import { AppPhase, UserRole } from '../types';
import { Sparkles, ArrowRight, ArrowLeft, X, CheckCircle2 } from 'lucide-react';

interface TourStep {
  title: string;
  hindiTitle: string;
  targetRole: UserRole;
  targetPhase: AppPhase;
  description: string;
  actionHint: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: '1. Namaste Preloader',
    hindiTitle: 'नमस्ते स्वागतम',
    targetRole: 'student',
    targetPhase: 'EventDay',
    description: 'A bespoke cultural intro with rotating mandala, Rozha One Devanagari typography, and falling petals setting an unforgettable human-first tone for Delhi NCR students.',
    actionHint: 'Click "Replay नमस्ते" in the top bar anytime to experience the 3.2s split-curtain reveal.',
  },
  {
    title: '2. 3-Step Enrollment & QR Pass',
    hindiTitle: 'रजिस्ट्रेशन व पास',
    targetRole: 'student',
    targetPhase: 'T-21',
    description: 'During T-21 Launch, students register with their dream country, budget, and test scores, generating an instant dynamic QR entry pass with "Bring your twin" callout.',
    actionHint: 'In the Student App Home tab, test the 3-step registration flow or generate a fresh pass.',
  },
  {
    title: '3. Soft Eligibility Funnel ("My Stalls")',
    hindiTitle: 'योग्य व व्यावहारिक स्टॉल्स',
    targetRole: 'student',
    targetPhase: 'EventDay',
    description: '"Eligible for many. Feasible for a few." An animated funnel filters 24 university dots through budget, scores, intake, and visa, ranking stalls by personal fit with interactive floor navigation.',
    actionHint: 'Check the "My Stalls" tab in the Student App to explore the interactive floor plan.',
  },
  {
    title: '4. The TWIN System',
    hindiTitle: 'ट्विन डिस्कवरी',
    targetRole: 'student',
    targetPhase: 'EventDay',
    description: 'The visual jewel of the OS: dark plum canvas with vibrant violet-pink & sky glow. "Get My Twin" locks a squad pact with friends, while "Find My Twin" anonymously matches with peers.',
    actionHint: 'Explore both "GET MY TWIN" and "FIND MY TWIN" tabs. Notice the anonymous handles and mutual reveal.',
  },
  {
    title: '5. Fateh Passport & 7+5 Rule',
    hindiTitle: 'फ़तेह पासपोर्ट',
    targetRole: 'student',
    targetPhase: 'EventDay',
    description: 'Realistic leatherette embassy page-flip book with MRZ data page, procedural consular ink stamps, and SHA-256 ledger. Stamping 7 distinct universities + 5 services auto-unlocks Spin Your Fate.',
    actionHint: 'Load Aarav Sharma (he has 6/7 uni stamps!). Stamp him once at A01 Northbridge to see 7+5 auto-unlock!',
  },
  {
    title: '6. Spin Your Fate (Stage Drum)',
    hindiTitle: 'स्पिन योर फेट',
    targetRole: 'stage',
    targetPhase: 'EventDay',
    description: 'Rebuilt for fairness: shows 3 tangible small prizes on top, draws from the pool of 7+5 verified students, animates a names drum with real ticks, and notifies the winner instantly.',
    actionHint: 'Switch to Stage Screen → Spin Your Fate, or press "Spin Your Fate" to watch the drumroll!',
  },
  {
    title: '7. Profile Spotlight (5-Min Stage Timer)',
    hindiTitle: 'प्रोफाइल स्पॉटलाइट',
    targetRole: 'stage',
    targetPhase: 'EventDay',
    description: 'Operator-controlled stage showcase featuring all 6 consented candidates, working 5:00 countdown clock, timed story reveals (0:00, 1:00, 2:00, 3:30, 4:30), and audio chimes.',
    actionHint: 'Control the spotlight timer, swap between candidates, or toggle "Hide marks" from Fateh Console.',
  },
  {
    title: '8. T-48 War Room & Post-Event Delivery',
    hindiTitle: 'वॉर रूम व वाउचर्स',
    targetRole: 'console',
    targetPhase: 'T-48h',
    description: 'Console T-48 War Room monitors confirmation drop-offs, trigger-allocates a ₹2,500 Meta geo-boost, audits nano-influencer conversions, and disburses partner swag vouchers post-event.',
    actionHint: 'Drag the War Room confirmations slider below 385 to see the coral "BUFFER TRIGGERED" defense alert.',
  },
];

export const GuidedTour: React.FC = () => {
  const { tourStep, setTourStep, setRole, setPhase } = useFatehStore();

  if (tourStep === null || tourStep < 0 || tourStep >= TOUR_STEPS.length) {
    return null;
  }

  const step = TOUR_STEPS[tourStep];

  const handleNext = () => {
    if (tourStep < TOUR_STEPS.length - 1) {
      const nextStep = tourStep + 1;
      setTourStep(nextStep);
      setRole(TOUR_STEPS[nextStep].targetRole);
      setPhase(TOUR_STEPS[nextStep].targetPhase);
    } else {
      setTourStep(null);
    }
  };

  const handlePrev = () => {
    if (tourStep > 0) {
      const prevStep = tourStep - 1;
      setTourStep(prevStep);
      setRole(TOUR_STEPS[prevStep].targetRole);
      setPhase(TOUR_STEPS[prevStep].targetPhase);
    }
  };

  const handleJumpToStep = (index: number) => {
    setTourStep(index);
    setRole(TOUR_STEPS[index].targetRole);
    setPhase(TOUR_STEPS[index].targetPhase);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FBF6F0] text-[#261A23] rounded-2xl brutal-border brutal-shadow-lg max-w-xl w-full p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top accent tag */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#261A23]/20">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold bg-[#944F62] text-white px-2 py-0.5 rounded">
              SPOTLIGHT TOUR ({tourStep + 1}/8)
            </span>
            <span className="font-hindi text-sm text-[#944F62] font-semibold">
              {step.hindiTitle}
            </span>
          </div>

          <button
            onClick={() => setTourStep(null)}
            className="p-1 hover:bg-[#261A23]/10 rounded-lg text-[#261A23] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-1.5 py-3">
          {TOUR_STEPS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleJumpToStep(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === tourStep
                  ? 'w-8 bg-[#944F62]'
                  : idx < tourStep
                  ? 'w-3 bg-[#9BBFCC]'
                  : 'w-2 bg-[#261A23]/20'
              }`}
              title={s.title}
            />
          ))}
        </div>

        {/* Content */}
        <div className="space-y-3 py-2">
          <h3 className="font-display font-extrabold text-xl text-[#261A23]">
            {step.title}
          </h3>

          <p className="text-sm text-[#261A23]/85 leading-relaxed font-body">
            {step.description}
          </p>

          <div className="bg-[#9BBFCC]/20 border border-[#9BBFCC] rounded-xl p-3 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#944F62] shrink-0 mt-0.5" />
            <p className="text-xs text-[#261A23] font-mono leading-snug">
              <span className="font-bold text-[#944F62]">Try this: </span>
              {step.actionHint}
            </p>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-4 mt-2 border-t-2 border-[#261A23]/20">
          <button
            onClick={handlePrev}
            disabled={tourStep === 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg brutal-border ${
              tourStep === 0
                ? 'opacity-40 cursor-not-allowed bg-transparent'
                : 'hover:bg-black/5 cursor-pointer brutal-shadow-sm'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTourStep(null)}
              className="px-3 py-1.5 text-xs text-[#261A23]/70 hover:text-[#261A23] cursor-pointer"
            >
              Exit Tour
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#944F62] hover:bg-[#261A23] rounded-lg brutal-shadow-sm transition-all cursor-pointer"
            >
              <span>{tourStep === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
              {tourStep === TOUR_STEPS.length - 1 ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
