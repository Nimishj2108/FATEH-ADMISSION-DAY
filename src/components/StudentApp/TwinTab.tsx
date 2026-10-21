import React, { useState } from 'react';
import { useFatehStore } from '../../store/useFatehStore';
import confetti from 'canvas-confetti';
import {
  Shield,
  Users,
  Radar,
  Sparkles,
  CheckCircle2,
  Copy,
  Car,
  Lock,
  Unlock,
  Send,
  Sliders,
  Compass,
  Briefcase,
  Home,
  Utensils,
  Moon,
  Building,
  GraduationCap,
} from 'lucide-react';

export const TwinTab: React.FC = () => {
  const { activeStudentId, students, setTwinOptIn, joinTwinSquad } = useFatehStore();
  const currentStudent = students.find((s) => s.id === activeStudentId) || students[0];

  const [mode, setMode] = useState<'find' | 'get'>('find');

  // Squad Pact state (Get My Twin)
  const [squadPactSigned, setSquadPactSigned] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Radar Scan & Matching state (Find My Twin)
  const [radarScanning, setRadarScanning] = useState(false);
  const [radarComplete, setRadarComplete] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [twinLocked, setTwinLocked] = useState(false);
  const [chatRevealed, setChatRevealed] = useState(false);
  const [messages, setMessages] = useState<string[]>([
    'Hey! Saw you are also targeting Dublin/London for MSc in AI Systems?',
    'Yes! Checking out Liffey Tech, Northbridge, and Al Noor. Are you at Stall A01 right now?',
  ]);
  const [chatInput, setChatInput] = useState('');

  // HARDCODED COMPREHENSIVE PARAMETERS IN FIND MY TWIN:
  const [targetCountry, setTargetCountry] = useState('UK / Ireland');
  const [intake, setIntake] = useState('Fall 2027');
  const [budgetLakhs, setBudgetLakhs] = useState(24);
  const [workExp, setWorkExp] = useState('1-2 Years');
  const [greStatus, setGreStatus] = useState('Waived (UK/Ireland)');
  const [accomPref, setAccomPref] = useState('Shared Flat');
  const [lifeRoadmap, setLifeRoadmap] = useState('Tech Startup & VC Incubator');
  const [studyVibe, setStudyVibe] = useState('Night Owl Hacker');
  const [cityPref, setCityPref] = useState('Tier-1 Tech Metro');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['CS/AI', 'startups', 'robotics']);

  const interestChips = [
    'CS/AI',
    'startups',
    'analytics',
    'design',
    'robotics',
    'fintech',
    'cleantech',
    'cybersec',
  ];

  // 6 Rich Diverse Candidates with multifaceted radar match scores
  const candidateMatches = [
    {
      handle: 'Lunar Voyager #3019',
      matchPct: 96,
      academicFit: 98,
      budgetFit: 94,
      vibeFit: 96,
      targetCountry: 'UK / Ireland',
      intake: 'Fall 2027',
      field: 'Distributed AI & Cloud Systems',
      budget: '₹22 - 25 Lakhs',
      workExp: '1.5 yrs (Fintech SWE)',
      accom: 'Shared 2BHK Flat',
      roadmap: 'Tech Startup & VC Incubation',
      vibe: 'Night Owl Coder',
      city: 'Dublin Tech Belt',
      traits: ['Liffey Tech Fan', 'Startup Founder', 'IELTS 7.5'],
      realName: 'Devansh Roy',
      realCollege: 'NSUT Dwarka (Delhi)',
      meetCode: 'TWIN-DESK-42',
    },
    {
      handle: 'Amber Horizon #7821',
      matchPct: 93,
      academicFit: 95,
      budgetFit: 92,
      vibeFit: 92,
      targetCountry: 'UK',
      intake: 'Fall 2027',
      field: 'Financial Engineering & Analytics',
      budget: '₹24 - 28 Lakhs',
      workExp: 'Fresher (Math/Stats)',
      accom: 'University Hall',
      roadmap: 'Management Consulting & Strategy',
      vibe: 'Library Regular',
      city: 'Central London',
      traits: ['Kingsmere London', 'Scholarship Applicant', 'IELTS 8.0'],
      realName: 'Tanvi Malhotra',
      realCollege: 'SRCC North Campus',
      meetCode: 'TWIN-DESK-18',
    },
    {
      handle: 'Prism Spark #4190',
      matchPct: 89,
      academicFit: 91,
      budgetFit: 88,
      vibeFit: 88,
      targetCountry: 'New Zealand',
      intake: 'Spring 2028',
      field: 'Autonomous Robotics & Drones',
      budget: '₹18 - 20 Lakhs',
      workExp: 'Fresher',
      accom: 'Shared Dorm',
      roadmap: 'Robotics & Automation Labs',
      vibe: 'Weekend Maker',
      city: 'Kiwi Coast Tech Hub',
      traits: ['Post-study Visa Focus', 'Lab Research', 'Kiwi Coast Uni'],
      realName: 'Aditya Sen',
      realCollege: 'DTU Rohini',
      meetCode: 'TWIN-DESK-09',
    },
    {
      handle: 'Velvet Orbit #5521',
      matchPct: 94,
      academicFit: 96,
      budgetFit: 93,
      vibeFit: 93,
      targetCountry: 'Ireland / UK',
      intake: 'Fall 2027',
      field: 'HCI & Creative Computing',
      budget: '₹20 - 24 Lakhs',
      workExp: '2 yrs (UI Designer)',
      accom: 'Shared Flat',
      roadmap: 'Creative Tech & Game Design',
      vibe: 'Studio Worker',
      city: 'Dublin South',
      traits: ['Corrib University', 'Behance Portfolio', 'IELTS 7.5'],
      realName: 'Rhea Bhasin',
      realCollege: 'NIFT Delhi',
      meetCode: 'TWIN-DESK-31',
    },
    {
      handle: 'Solar Atlas #6014',
      matchPct: 87,
      academicFit: 90,
      budgetFit: 85,
      vibeFit: 86,
      targetCountry: 'Ireland',
      intake: 'Fall 2027',
      field: 'Renewable IoT & Energy Grids',
      budget: '₹16 - 19 Lakhs',
      workExp: '1 yr (Solar Hardware)',
      accom: 'Private Room in Shared PBSA',
      roadmap: 'Cleantech & Sustainable Energy',
      vibe: 'Early Bird',
      city: 'Shannon / Limerick',
      traits: ['Shannon Tech', 'CleanTech', 'IELTS 7.0'],
      realName: 'Nikhil Taneja',
      realCollege: 'AKGEC Ghaziabad',
      meetCode: 'TWIN-DESK-55',
    },
    {
      handle: 'Cosmic Pulse #2210',
      matchPct: 91,
      academicFit: 94,
      budgetFit: 90,
      vibeFit: 89,
      targetCountry: 'Dubai / UK',
      intake: 'Spring 2028',
      field: 'Bio-Informatics & Health AI',
      budget: '₹18 - 22 Lakhs',
      workExp: 'Fresher',
      accom: 'Studio Flat',
      roadmap: 'CS / AI & Core Engineering SWE',
      vibe: 'Night Owl',
      city: 'Dubai Academic City',
      traits: ['Al Noor Dubai', 'Fast-track Visa', 'IELTS 6.5'],
      realName: 'Mehak Chhabra',
      realCollege: 'Amity Noida',
      meetCode: 'TWIN-DESK-24',
    },
  ];

  const currentMatch = candidateMatches[cardIndex % candidateMatches.length];

  const handleCopyInvite = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSignPact = () => {
    setSquadPactSigned(true);
    joinTwinSquad(currentStudent.id, 'Kabir Verma (Ghaziabad)');
    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#944F62', '#9BBFCC', '#7C3AED'],
    });
  };

  const handleRunRadar = () => {
    setRadarScanning(true);
    setRadarComplete(false);
    setTimeout(() => {
      setRadarScanning(false);
      setRadarComplete(true);
    }, 1800);
  };

  const handleSendWave = () => {
    setTimeout(() => {
      setTwinLocked(true);
      confetti({
        particleCount: 70,
        spread: 65,
        colors: ['#944F62', '#FF4D9D', '#9BBFCC'],
      });
    }, 800);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages([...messages, chatInput]);
    setChatInput('');
  };

  return (
    <div className="bg-[#1E141C] text-[#FBF6F0] rounded-2xl brutal-border brutal-shadow p-4 md:p-5 space-y-4 relative overflow-hidden select-none">
      
      {/* Background Violet/Pink Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#944F62]/35 via-[#7C3AED]/25 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#9BBFCC]/25 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner: Split-letter "TWIN" & Privacy Shield */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-display font-extrabold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FBF6F0] via-[#FF4D9D] to-[#9BBFCC]">
              T W I N
            </span>
            <span className="text-[10px] font-mono uppercase bg-[#944F62]/60 text-white px-2 py-0.5 rounded border border-[#944F62]">
              Study Abroad
            </span>
          </div>
          <p className="text-xs text-[#9BBFCC] font-body">
            Your Twin Is Out There. Don't wander Hotel Lalit alone.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono bg-white/5 border border-white/20 px-2.5 py-1 rounded-full text-[#9BBFCC]">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Anonymous until both say yes</span>
        </div>
      </div>

      {/* Mode Switcher: FIND MY TWIN | GET MY TWIN */}
      <div className="relative z-10 flex bg-black/40 p-1 rounded-xl border border-white/10">
        <button
          onClick={() => setMode('find')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            mode === 'find'
              ? 'bg-gradient-to-r from-[#7C3AED] to-[#FF4D9D] text-white shadow-lg'
              : 'text-[#FBF6F0]/70 hover:text-white'
          }`}
        >
          <Radar className="w-3.5 h-3.5" />
          <span>FIND MY TWIN (10 Match Criteria)</span>
        </button>

        <button
          onClick={() => setMode('get')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            mode === 'get'
              ? 'bg-gradient-to-r from-[#944F62] to-[#7C3AED] text-white shadow-lg'
              : 'text-[#FBF6F0]/70 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>GET MY TWIN (Squad Pact)</span>
        </button>
      </div>

      {/* TAB 1: FIND MY TWIN (Rich 10-Parameter Matcher & Cards) */}
      {mode === 'find' && (
        <div className="relative z-10 space-y-4">
          
          {/* Privacy opt-in toggle */}
          <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/10 text-xs">
            <div>
              <span className="font-bold text-[#FBF6F0] block">
                Radar Visibility: {currentStudent.twinOptIn ? 'Active (Broadcasting)' : 'Paused'}
              </span>
              <span className="text-[10px] text-[#9BBFCC]">
                Handle: {currentStudent.twinHandle} (Minors matched with minors)
              </span>
            </div>

            <button
              onClick={() => setTwinOptIn(currentStudent.id, !currentStudent.twinOptIn)}
              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                currentStudent.twinOptIn
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/20 text-white/60 hover:bg-white/30'
              }`}
            >
              {currentStudent.twinOptIn ? 'Opted In' : 'Turn On'}
            </button>
          </div>

          {/* 10 HARDCODED PARAMETERS CONFIGURATION PANEL */}
          {!radarComplete && !radarScanning && (
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3.5">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h4 className="font-display font-bold text-sm text-[#FBF6F0] flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[#FF4D9D]" />
                  <span>Configure Your 10 Twin Matching Criteria</span>
                </h4>
                <span className="text-[10px] font-mono text-[#9BBFCC]">
                  330 Delhi Applicants
                </span>
              </div>

              {/* 1. Target Country & Intake */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] font-mono text-[#9BBFCC] block mb-1 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-[#FF4D9D]" />
                    <span>Target Country:</span>
                  </label>
                  <select
                    value={targetCountry}
                    onChange={(e) => setTargetCountry(e.target.value)}
                    className="w-full bg-black/60 text-white text-xs p-2 rounded-lg border border-white/20 outline-none"
                  >
                    <option value="UK">United Kingdom</option>
                    <option value="Ireland">Ireland</option>
                    <option value="UK / Ireland">UK / Ireland Hybrid</option>
                    <option value="Dubai">Dubai (UAE)</option>
                    <option value="NZ">New Zealand</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#9BBFCC] block mb-1 flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-[#FF4D9D]" />
                    <span>Target Intake:</span>
                  </label>
                  <select
                    value={intake}
                    onChange={(e) => setIntake(e.target.value)}
                    className="w-full bg-black/60 text-white text-xs p-2 rounded-lg border border-white/20 outline-none"
                  >
                    <option value="Fall 2027">Fall (Sep) 2027</option>
                    <option value="Spring 2028">Spring (Jan) 2028</option>
                    <option value="Fall 2028">Fall 2028</option>
                  </select>
                </div>
              </div>

              {/* 2. Work Experience & GRE Status */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] font-mono text-[#9BBFCC] block mb-1 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-[#FF4D9D]" />
                    <span>Work Experience:</span>
                  </label>
                  <select
                    value={workExp}
                    onChange={(e) => setWorkExp(e.target.value)}
                    className="w-full bg-black/60 text-white text-xs p-2 rounded-lg border border-white/20 outline-none"
                  >
                    <option value="Fresher">College Fresher (0 yrs)</option>
                    <option value="1-2 Years">1 - 2 Years Experience</option>
                    <option value="3+ Years">3+ Years Professional</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#9BBFCC] block mb-1 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-[#FF4D9D]" />
                    <span>GRE / GMAT Status:</span>
                  </label>
                  <select
                    value={greStatus}
                    onChange={(e) => setGreStatus(e.target.value)}
                    className="w-full bg-black/60 text-white text-xs p-2 rounded-lg border border-white/20 outline-none"
                  >
                    <option value="Waived (UK/Ireland)">Targeting Waiver</option>
                    <option value="Taken (315+ GRE)">GRE 315+ Taken</option>
                    <option value="Planning to Take">Planning Next Month</option>
                  </select>
                </div>
              </div>

              {/* 3. Accommodation & Diet Lifestyle */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] font-mono text-[#9BBFCC] block mb-1 flex items-center gap-1">
                    <Home className="w-3 h-3 text-[#FF4D9D]" />
                    <span>Accommodation Vibe:</span>
                  </label>
                  <select
                    value={accomPref}
                    onChange={(e) => setAccomPref(e.target.value)}
                    className="w-full bg-black/60 text-white text-xs p-2 rounded-lg border border-white/20 outline-none"
                  >
                    <option value="Shared Flat">Shared Private 2BHK/Flat</option>
                    <option value="University Dorm">University On-Campus Dorm</option>
                    <option value="Studio">Solo Private Studio</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#9BBFCC] block mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#FF4D9D]" />
                    <span>General Life Roadmap:</span>
                  </label>
                  <select
                    value={lifeRoadmap}
                    onChange={(e) => setLifeRoadmap(e.target.value)}
                    className="w-full bg-black/60 text-white text-xs p-2 rounded-lg border border-white/20 outline-none"
                  >
                    <option value="Tech Startup & VC Incubator">Tech Startup Founder & VC Incubation</option>
                    <option value="Robotics & Automation Labs">Robotics & Hardware Automation Labs</option>
                    <option value="CS / AI & Core Engineering SWE">CS / AI & Core Engineering SWE</option>
                    <option value="Management Consulting & Strategy">Global Management Consulting & Strategy</option>
                    <option value="FinTech, Quant & Analytics">FinTech, Quant Trading & Analytics</option>
                    <option value="Creative Tech & Game Design">Creative Tech & Game Design</option>
                  </select>
                </div>
              </div>

              {/* 4. Study Cadence & City vs Campus Town */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] font-mono text-[#9BBFCC] block mb-1 flex items-center gap-1">
                    <Moon className="w-3 h-3 text-[#FF4D9D]" />
                    <span>Study Rhythm:</span>
                  </label>
                  <select
                    value={studyVibe}
                    onChange={(e) => setStudyVibe(e.target.value)}
                    className="w-full bg-black/60 text-white text-xs p-2 rounded-lg border border-white/20 outline-none"
                  >
                    <option value="Night Owl Hacker">Night Owl Hacker (2 AM coder)</option>
                    <option value="Library Regular">Library Regular (9 AM grinder)</option>
                    <option value="Weekend Explorer">Weekend Explorer</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#9BBFCC] block mb-1 flex items-center gap-1">
                    <Building className="w-3 h-3 text-[#FF4D9D]" />
                    <span>Location Vibe:</span>
                  </label>
                  <select
                    value={cityPref}
                    onChange={(e) => setCityPref(e.target.value)}
                    className="w-full bg-black/60 text-white text-xs p-2 rounded-lg border border-white/20 outline-none"
                  >
                    <option value="Tier-1 Tech Metro">Tier-1 Tech Metro (London/Dublin)</option>
                    <option value="Quiet College Town">Quiet Scenic University Town</option>
                  </select>
                </div>
              </div>

              {/* 5. Budget Ceiling Slider */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] font-mono text-[#9BBFCC]">
                  <span>Annual Tuition Ceiling:</span>
                  <span className="font-bold text-white">₹{budgetLakhs} Lakhs / Year</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="35"
                  value={budgetLakhs}
                  onChange={(e) => setBudgetLakhs(Number(e.target.value))}
                  className="w-full accent-[#FF4D9D] cursor-pointer"
                />
              </div>

              {/* 6. Interest Chips */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-[#9BBFCC] block">Core Disciplines & Passions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {interestChips.map((chip) => {
                    const sel = selectedInterests.includes(chip);
                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          setSelectedInterests(
                            sel ? selectedInterests.filter((c) => c !== chip) : [...selectedInterests, chip]
                          );
                        }}
                        className={`text-xs px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                          sel
                            ? 'bg-[#944F62] text-white font-bold border border-[#FF4D9D]'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scan Trigger Button */}
              <button
                onClick={handleRunRadar}
                className="w-full py-3 text-xs font-bold text-white bg-gradient-to-r from-[#7C3AED] via-[#944F62] to-[#FF4D9D] hover:opacity-90 rounded-xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-2 mt-2"
              >
                <Radar className="w-4 h-4 animate-spin" />
                <span>Run 10-Criteria Radar Scan (330 Attendees)</span>
              </button>
            </div>
          )}

          {/* Scanning Animation */}
          {radarScanning && (
            <div className="h-72 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative flex items-center justify-center w-28 h-28">
                <div className="absolute inset-0 rounded-full border border-[#FF4D9D] animate-ping opacity-30" />
                <div className="absolute inset-3 rounded-full border border-[#7C3AED] animate-pulse opacity-50" />
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#944F62] to-[#7C3AED] flex items-center justify-center text-white">
                  <Radar className="w-8 h-8 animate-spin" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-display font-bold text-[#FBF6F0]">
                  Comparing {selectedInterests.length} Interests, {targetCountry}, and Lifestyle Habits...
                </p>
                <p className="text-xs text-[#9BBFCC] font-mono">
                  Synthesizing Academic, Budget, and Roommate Synergies
                </p>
              </div>
            </div>
          )}

          {/* Swipeable Match Card with Multi-Dimensional Breakdown */}
          {radarComplete && !twinLocked && (
            <div className="space-y-3">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 space-y-3 relative shadow-2xl">
                
                {/* Header & Overall Match */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#FF4D9D] text-white flex items-center justify-center font-bold text-sm shadow-md">
                      {currentMatch.handle.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-[#FBF6F0]">
                        {currentMatch.handle}
                      </h4>
                      <p className="text-[11px] text-[#9BBFCC] font-mono">
                        {currentMatch.field}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-display font-extrabold text-[#FF4D9D] tabular-nums block">
                      {currentMatch.matchPct}%
                    </span>
                    <span className="text-[9px] font-mono text-[#9BBFCC]">Overall Fit</span>
                  </div>
                </div>

                {/* Multi-Dimensional Synergy Scores */}
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono py-1">
                  <div className="p-2 bg-black/40 rounded-lg border border-white/10">
                    <span className="text-gray-400 block">Academics</span>
                    <span className="text-emerald-400 font-bold text-xs">{currentMatch.academicFit}%</span>
                  </div>
                  <div className="p-2 bg-black/40 rounded-lg border border-white/10">
                    <span className="text-gray-400 block">Budget Fit</span>
                    <span className="text-[#9BBFCC] font-bold text-xs">{currentMatch.budgetFit}%</span>
                  </div>
                  <div className="p-2 bg-black/40 rounded-lg border border-white/10">
                    <span className="text-gray-400 block">Vibe & Habit</span>
                    <span className="text-[#FF4D9D] font-bold text-xs">{currentMatch.vibeFit}%</span>
                  </div>
                </div>

                {/* Deep Matched Parameters Grid */}
                <div className="p-2.5 bg-black/40 rounded-xl space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Target / Intake:</span>
                    <span className="font-bold text-white">{currentMatch.targetCountry} • {currentMatch.intake}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Budget Bracket:</span>
                    <span className="font-bold text-emerald-300">{currentMatch.budget}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Life Roadmap:</span>
                    <span className="text-emerald-300 font-bold truncate max-w-[200px]">{currentMatch.roadmap}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Accommodation:</span>
                    <span className="text-white">{currentMatch.accom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Study Cadence:</span>
                    <span className="text-[#9BBFCC]">{currentMatch.vibe} ({currentMatch.city})</span>
                  </div>
                </div>

                {/* Traits Badges */}
                <div className="flex flex-wrap gap-1.5 py-0.5">
                  {currentMatch.traits.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-[#FBF6F0] border border-white/15"
                    >
                      ★ {t}
                    </span>
                  ))}
                </div>

                {/* Action buttons: Skip / Send Wave */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => setCardIndex(cardIndex + 1)}
                    className="flex-1 py-2 text-xs font-bold text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all cursor-pointer"
                  >
                    Skip ({cardIndex + 1}/{candidateMatches.length})
                  </button>

                  <button
                    onClick={handleSendWave}
                    className="flex-2 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#FF4D9D] to-[#7C3AED] hover:opacity-90 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Send Twin Wave ({currentMatch.matchPct}% Fit)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TWIN LOCKED STATE: Anonymous Chat & Mutual Identity Reveal */}
          {twinLocked && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 space-y-3 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF4D9D]" />
                  <span className="font-display font-bold text-sm text-[#FBF6F0]">
                    TWIN LOCKED WITH {currentMatch.handle}!
                  </span>
                </div>

                <button
                  onClick={() => setChatRevealed(!chatRevealed)}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#9BBFCC] hover:text-white bg-white/10 px-2.5 py-1 rounded-lg cursor-pointer"
                >
                  {chatRevealed ? <Unlock className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-amber-400" />}
                  <span>{chatRevealed ? 'Identities Revealed' : 'Mutual Reveal'}</span>
                </button>
              </div>

              {chatRevealed ? (
                <div className="p-3 bg-emerald-950/50 border border-emerald-500/50 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-emerald-300">
                    <span>{currentMatch.realName}</span>
                    <span>{currentMatch.realCollege}</span>
                  </div>
                  <p className="text-[11px] text-[#9BBFCC]">
                    📍 Official Meetup Booth: <strong>{currentMatch.meetCode}</strong> at Crystal Ballroom Foyer.
                  </p>
                </div>
              ) : (
                <div className="p-2.5 bg-black/40 rounded-xl text-[11px] text-[#9BBFCC] flex items-center justify-between">
                  <span>Both accepted the wave! Chatting anonymously.</span>
                  <span className="text-amber-300 font-mono text-[10px]">Click "Mutual Reveal" to share names</span>
                </div>
              )}

              {/* Chat bubbles */}
              <div className="space-y-2 max-h-36 overflow-y-auto p-1 text-xs font-body">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl max-w-[85%] ${
                      idx % 2 === 0
                        ? 'bg-white/15 text-[#FBF6F0] mr-auto'
                        : 'bg-[#944F62] text-white ml-auto'
                    }`}
                  >
                    {m}
                  </div>
                ))}
              </div>

              {/* Chat input */}
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about stall B01 or hostel sharing..."
                  className="flex-1 bg-black/50 text-xs px-3 py-1.5 rounded-lg border border-white/20 focus:border-[#FF4D9D] outline-none text-white"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[#FF4D9D] hover:bg-[#944F62] text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: GET MY TWIN (Friends Squad Pact) */}
      {mode === 'get' && (
        <div className="relative z-10 space-y-4">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#FBF6F0]">
                Your Delhi NCR Squad Pact (2-4 Friends)
              </span>
              <span className="text-[10px] font-mono text-[#9BBFCC]">
                Pact: 3 of 4 Ready
              </span>
            </div>

            <p className="text-xs text-[#FBF6F0]/80 leading-relaxed font-body">
              Bring your friends or college crew. When everyone confirms, you unlock group cab-pooling from Barakhamba Metro and priority stall routing.
            </p>

            {/* Avatars circle ring */}
            <div className="flex items-center justify-center py-4">
              <div className="relative flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border-2 border-dashed border-[#944F62]/50 flex items-center justify-center relative">
                  
                  {/* You */}
                  <div className="absolute top-0 transform -translate-y-1/2 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#944F62] text-white flex items-center justify-center font-bold text-xs border-2 border-[#FBF6F0] shadow-md">
                      You
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 mt-1">✓ In</span>
                  </div>

                  {/* Member 2 */}
                  <div className="absolute right-0 transform translate-x-1/2 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-xs border-2 border-[#FBF6F0] shadow-md">
                      RB
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 mt-1">✓ In</span>
                  </div>

                  {/* Member 3 */}
                  <div className="absolute bottom-0 transform translate-y-1/2 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-[#9BBFCC] text-[#261A23] flex items-center justify-center font-bold text-xs border-2 border-[#FBF6F0] shadow-md">
                      KV
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 mt-1">✓ In</span>
                  </div>

                  {/* Member 4: Empty */}
                  <div className="absolute left-0 transform -translate-x-1/2 flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-white/10 text-white/40 border-2 border-dashed border-white/30 flex items-center justify-center font-bold text-xs">
                      +
                    </div>
                    <span className="text-[9px] font-mono text-white/40 mt-1">Invite</span>
                  </div>

                  {/* Center Pact Badge */}
                  <div className="w-16 h-16 rounded-full bg-black/60 border border-[#944F62] flex flex-col items-center justify-center text-center p-1">
                    <Sparkles className="w-4 h-4 text-[#FF4D9D]" />
                    <span className="text-[9px] font-mono text-white font-bold leading-tight">
                      {squadPactSigned ? 'SEALED' : '75% SEAL'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Invite share strip */}
            <div className="flex items-center gap-2 bg-black/40 p-2 rounded-lg border border-white/10">
              <span className="text-xs font-mono text-[#9BBFCC] truncate flex-1">
                fateh.app/twin/join?squad=delhi-squad-8821
              </span>
              <button
                onClick={handleCopyInvite}
                className="px-2.5 py-1 text-[11px] font-bold bg-[#944F62] hover:bg-[#FF4D9D] text-white rounded cursor-pointer transition-all shrink-0 flex items-center gap-1"
              >
                {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Pact Sign Button */}
            {!squadPactSigned ? (
              <button
                onClick={handleSignPact}
                className="w-full py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#944F62] via-[#7C3AED] to-[#FF4D9D] hover:opacity-90 rounded-xl shadow-lg cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Tap "I'm In" to Seal Squad Pact</span>
              </button>
            ) : (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Squad Pact Sealed! Cab-Pool Group Activated</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#9BBFCC] font-mono">
                  <Car className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ola/Uber share point: Barakhamba Metro Gate 3 → Hotel Lalit</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Safety Menu Footer */}
      <div className="relative z-10 flex items-center justify-between text-[10px] text-[#9BBFCC]/70 font-mono pt-1">
        <span>Zero Spam • Encrypted Anonymous Pairing</span>
        <button
          onClick={() => alert('Reported anonymously to Fateh event staff.')}
          className="hover:text-red-400 cursor-pointer"
        >
          Report / Block
        </button>
      </div>

    </div>
  );
};
