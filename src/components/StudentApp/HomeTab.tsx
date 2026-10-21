import React, { useState } from 'react';
import { useFatehStore } from '../../store/useFatehStore';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Languages,
} from 'lucide-react';
import { NCR_ZONES } from '../../data/universities';

interface HomeTabProps {
  onNavigateTab: (tab: 'home' | 'passport' | 'twin' | 'stalls' | 'feed') => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ onNavigateTab }) => {
  const {
    phase,
    activeStudentId,
    students,
    checkInStudent,
    confirmAttendance,
    enrollStudent,
    clockTime,
  } = useFatehStore();

  const [useHindi, setUseHindi] = useState(false);
  const currentStudent = students.find((s) => s.id === activeStudentId) || students[0];

  // 3-step enrollment state for T-21
  const [enrolStep, setEnrolStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    zone: 'North Delhi',
    targetCountry: 'UK / Ireland',
    targetField: 'CS & AI Systems',
    budgetLakhs: 22,
    ielts: 6.5,
    gradPercent: 72,
    isMinor: false,
    consentShare: true,
  });

  const handleEnrolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enrolStep < 3) {
      setEnrolStep(enrolStep + 1);
    } else {
      enrollStudent({
        name: formData.name || 'Pratham Malhotra',
        phone: formData.phone || '+91 98112 55431',
        zone: formData.zone,
        targetCountry: formData.targetCountry,
        targetField: formData.targetField,
        budgetLakhs: formData.budgetLakhs,
        ielts: formData.ielts,
        gradPercent: formData.gradPercent,
        isMinor: formData.isMinor,
      });
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#944F62', '#9BBFCC', '#261A23'],
      });
      setEnrolStep(1);
    }
  };

  const handleSimulatedCheckIn = () => {
    checkInStudent(currentStudent.id);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.5 },
      colors: ['#944F62', '#9BBFCC'],
    });
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Top Language Toggle */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-mono text-[#261A23]/60 uppercase">
          {phase === 'T-21' ? 'Phase: Pre-Launch' : phase === 'T-48h' ? 'Phase: T-48h War Room' : 'Phase: Event Live'}
        </span>

        <button
          onClick={() => setUseHindi(!useHindi)}
          className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border border-[#261A23]/30 bg-white hover:bg-black/5 cursor-pointer"
        >
          <Languages className="w-3.5 h-3.5 text-[#944F62]" />
          <span>{useHindi ? 'English' : 'हिंदी'}</span>
        </button>
      </div>

      {/* Hero Welcome Card */}
      <div className="bg-[#261A23] text-[#FBF6F0] rounded-2xl p-5 brutal-border brutal-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#944F62]/30 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase bg-[#944F62] text-white px-2 py-0.5 rounded">
              Lalit Hotel • Delhi NCR
            </span>
            <span className="text-[10px] font-mono text-[#9BBFCC]">
              Simulation
            </span>
          </div>

          <h2 className="text-2xl font-display font-extrabold tracking-tight">
            {useHindi ? 'फतेह एडमिशन डे 2026' : 'Fateh Admission Day'}
          </h2>

          <p className="text-xs text-[#FBF6F0]/80 leading-relaxed font-body">
            {useHindi
              ? 'यूके, आयरलैंड, दुबई और न्यूज़ीलैंड की 24 शीर्ष यूनिवर्सिटीज व 5 विशेषज्ञ सहायता डेस्क सीधे होटल ललित में।'
              : 'Direct 1-on-1 access to 24 top universities across UK, Ireland, Dubai & NZ + 5 specialized visa & funding desks.'}
          </p>

          <div className="pt-2 flex flex-wrap gap-3 text-[11px] text-[#9BBFCC] font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#944F62]" />
              24 October 2026
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#944F62]" />
              10:00 AM – 05:00 PM
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#944F62]" />
              Crystal Ballroom
            </span>
          </div>
        </div>
      </div>

      {/* PHASE 1: T-21 3-Step Enrollment Flow */}
      {phase === 'T-21' && (
        <div className="bg-white rounded-2xl p-4 brutal-border brutal-shadow space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h3 className="font-display font-bold text-base text-[#261A23]">
                {useHindi ? '3-चरणीय सीट आरक्षण' : 'Step-by-Step Seat Reservation'}
              </h3>
              <p className="text-[11px] text-[#261A23]/60">Step {enrolStep} of 3</p>
            </div>
            <span className="text-[10px] font-mono bg-[#9BBFCC]/30 text-[#261A23] px-2 py-0.5 rounded">
              Free Pass
            </span>
          </div>

          <form onSubmit={handleEnrolSubmit} className="space-y-3">
            {enrolStep === 1 && (
              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-bold text-[#261A23] mb-1">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full text-xs p-2 rounded-lg border-2 border-[#261A23] focus:ring-2 focus:ring-[#944F62] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-[#261A23] mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98110..."
                      className="w-full text-xs p-2 rounded-lg border-2 border-[#261A23] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#261A23] mb-1">
                      NCR Zone
                    </label>
                    <select
                      value={formData.zone}
                      onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                      className="w-full text-xs p-2 rounded-lg border-2 border-[#261A23] bg-white outline-none"
                    >
                      {NCR_ZONES.map((z) => (
                        <option key={z} value={z}>{z}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="parentToggle"
                    checked={formData.isMinor}
                    onChange={(e) => setFormData({ ...formData, isMinor: e.target.checked })}
                    className="accent-[#944F62] w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="parentToggle" className="text-xs text-[#261A23] cursor-pointer">
                    Attending with parent / Under 18 applicant
                  </label>
                </div>
              </div>
            )}

            {enrolStep === 2 && (
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-[#261A23] mb-1">Target Country</label>
                    <select
                      value={formData.targetCountry}
                      onChange={(e) => setFormData({ ...formData, targetCountry: e.target.value })}
                      className="w-full text-xs p-2 rounded-lg border-2 border-[#261A23] bg-white"
                    >
                      <option value="UK">United Kingdom</option>
                      <option value="Ireland">Ireland</option>
                      <option value="Dubai">Dubai (UAE)</option>
                      <option value="NZ">New Zealand</option>
                      <option value="UK / Ireland">UK / Ireland Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#261A23] mb-1">Intended Field</label>
                    <select
                      value={formData.targetField}
                      onChange={(e) => setFormData({ ...formData, targetField: e.target.value })}
                      className="w-full text-xs p-2 rounded-lg border-2 border-[#261A23] bg-white"
                    >
                      <option value="CS & AI Systems">CS & AI Systems</option>
                      <option value="Data Analytics">Data Analytics</option>
                      <option value="Design & UX">Design & UX</option>
                      <option value="Engineering">Core Engineering</option>
                      <option value="FinTech & Management">FinTech & MBA</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-[#261A23] mb-1">Max Budget</label>
                    <input
                      type="number"
                      value={formData.budgetLakhs}
                      onChange={(e) => setFormData({ ...formData, budgetLakhs: Number(e.target.value) })}
                      className="w-full text-xs p-2 rounded-lg border-2 border-[#261A23]"
                    />
                    <span className="text-[10px] text-gray-500">₹ Lakhs</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#261A23] mb-1">IELTS/PTE</label>
                    <input
                      type="number"
                      step="0.5"
                      value={formData.ielts}
                      onChange={(e) => setFormData({ ...formData, ielts: Number(e.target.value) })}
                      className="w-full text-xs p-2 rounded-lg border-2 border-[#261A23]"
                    />
                    <span className="text-[10px] text-gray-500">Band (0-9)</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#261A23] mb-1">Grad/12th %</label>
                    <input
                      type="number"
                      value={formData.gradPercent}
                      onChange={(e) => setFormData({ ...formData, gradPercent: Number(e.target.value) })}
                      className="w-full text-xs p-2 rounded-lg border-2 border-[#261A23]"
                    />
                    <span className="text-[10px] text-gray-500">% score</span>
                  </div>
                </div>
              </div>
            )}

            {enrolStep === 3 && (
              <div className="space-y-3 text-center py-2">
                <div className="w-12 h-12 bg-[#944F62]/10 text-[#944F62] rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-sm text-[#261A23]">
                  Activate Anonymous TWIN Matching?
                </h4>
                <p className="text-xs text-[#261A23]/70 max-w-xs mx-auto">
                  Match with Delhi students applying to the same universities. Your real name and college remain hidden until you both agree.
                </p>

                <div className="p-3 bg-[#FBF6F0] rounded-xl border border-[#261A23]/20 text-left text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Handles only (e.g. Quiet Falcon #4821)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Minors matched only with minors</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              {enrolStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setEnrolStep(enrolStep - 1)}
                  className="px-3 py-1.5 text-xs text-[#261A23] hover:underline"
                >
                  Back
                </button>
              ) : <div />}

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#944F62] hover:bg-[#261A23] rounded-lg brutal-shadow-sm cursor-pointer"
              >
                <span>{enrolStep === 3 ? 'Generate Pass & TWIN' : 'Next Step'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PHASE 2: T-48h Drop-off Defense & Attendance Confirmation */}
      {phase === 'T-48h' && (
        <div className="bg-white rounded-2xl p-4 brutal-border brutal-shadow space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase bg-[#944F62] text-white px-2 py-0.5 rounded font-bold">
              Action Required • 48 Hours to Event
            </span>
            <span className="text-xs text-red-600 font-bold font-mono">
              Seats limited to 400
            </span>
          </div>

          <h3 className="font-display font-extrabold text-lg text-[#261A23]">
            {useHindi ? 'अपनी उपस्थिति की पुष्टि करें' : 'Confirm Your In-Person Attendance'}
          </h3>

          <p className="text-xs text-[#261A23]/80 leading-relaxed font-body">
            {useHindi
              ? 'होटल ललित में विश्वविद्यालय प्रतिनिधियों के साथ सीधे स्लॉट सुरक्षित रखने हेतु अपनी उपस्थिति कन्फर्म करें।'
              : 'Help university deans allocate 1-on-1 discussion slots. Confirm your slot to secure guaranteed fast-track entry.'}
          </p>

          <div className="p-3 bg-[#FBF6F0] rounded-xl border border-[#261A23]/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span>Current Status:</span>
              <span className={currentStudent.confirmedAttendance ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                {currentStudent.confirmedAttendance ? 'Confirmed (Ready for Entry)' : 'Pending Confirmation'}
              </span>
            </div>

            {!currentStudent.confirmedAttendance ? (
              <button
                onClick={() => confirmAttendance(currentStudent.id)}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#944F62] hover:bg-[#261A23] rounded-xl brutal-shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm My Attendance (I will be there!)</span>
              </button>
            ) : (
              <div className="text-xs text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Slot Locked! Metro token subsidy info will be sent on WhatsApp.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PHASE 3: EVENT DAY - Check-in & Pass */}
      {phase === 'EventDay' && (
        <div className="bg-white rounded-2xl p-4 brutal-border brutal-shadow space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-base text-[#261A23]">
                {currentStudent.name}
              </span>
              <span className="text-[10px] font-mono text-gray-500">
                {currentStudent.id}
              </span>
            </div>

            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
              currentStudent.checkedIn
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-400'
                : 'bg-amber-100 text-amber-800 border border-amber-400'
            }`}>
              {currentStudent.checkedIn ? '✓ Checked In' : 'Not Checked In'}
            </span>
          </div>

          {!currentStudent.checkedIn ? (
            <div className="space-y-3 text-center py-2">
              <p className="text-xs text-[#261A23]/70">
                Show this digital pass at Hotel Lalit Crystal Ballroom reception to receive your physical badge and activate your official Fateh Passport book.
              </p>

              <div className="flex justify-center p-3 bg-[#FBF6F0] rounded-xl border border-[#261A23]/20 w-44 mx-auto">
                <QRCodeSVG
                  value={`FATEH-CHECKIN:${currentStudent.id}:${currentStudent.name}`}
                  size={140}
                  bgColor="#FBF6F0"
                  fgColor="#261A23"
                  level="M"
                />
              </div>

              <button
                onClick={handleSimulatedCheckIn}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#944F62] hover:bg-[#261A23] rounded-xl brutal-shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Simulate Reception Check-In</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-[#9BBFCC]/20 rounded-xl border border-[#9BBFCC] flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#261A23]">
                    Reception Verified • Fateh Passport Active
                  </p>
                  <p className="text-[11px] text-[#261A23]/70">
                    Stamps: {currentStudent.stamps.filter(s => s.type === 'university').length}/7 Unis, {currentStudent.stamps.filter(s => s.type === 'service').length}/5 Services
                  </p>
                </div>

                <button
                  onClick={() => onNavigateTab('passport')}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-[#261A23] hover:bg-[#944F62] rounded-lg cursor-pointer"
                >
                  Open Fateh Passport
                </button>
              </div>

              {/* Quick links to core tabs */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => onNavigateTab('stalls')}
                  className="p-3 bg-[#FBF6F0] rounded-xl border border-[#261A23]/20 hover:border-[#261A23] text-left transition-all cursor-pointer"
                >
                  <span className="font-bold block text-[#261A23]">My Stalls</span>
                  <span className="text-[10px] text-[#261A23]/70">Soft eligibility funnel</span>
                </button>

                <button
                  onClick={() => onNavigateTab('twin')}
                  className="p-3 bg-[#261A23] text-white rounded-xl border border-[#261A23] hover:bg-[#944F62] text-left transition-all cursor-pointer"
                >
                  <span className="font-bold block text-[#9BBFCC]">TWIN Radar</span>
                  <span className="text-[10px] text-white/70">Find squad & matches</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PHASE 4: T+1 / T+2 Post Event Highlights */}
      {(phase === 'T+1' || phase === 'T+2') && (
        <div className="bg-white rounded-2xl p-4 brutal-border brutal-shadow space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-purple-100 text-purple-900 border border-purple-300 px-2 py-0.5 rounded font-bold">
              Post-Admission Day
            </span>
            <span className="text-[10px] font-mono text-gray-500">
              Simulation
            </span>
          </div>

          <h3 className="font-display font-extrabold text-lg text-[#261A23]">
            {useHindi ? 'धन्यवाद! आपकी अध्ययन यात्रा जारी है' : 'Thank You for Attending!'}
          </h3>

          <p className="text-xs text-[#261A23]/80 leading-relaxed font-body">
            You explored partner universities at Hotel Lalit. Access your verified passport mint card, claimed prizes, and personalized admission feed.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onNavigateTab('passport')}
              className="flex-1 py-2 text-xs font-bold text-white bg-[#944F62] hover:bg-[#261A23] rounded-lg brutal-shadow-sm cursor-pointer text-center"
            >
              Mint Fateh Passport Card
            </button>

            <button
              onClick={() => onNavigateTab('feed')}
              className="flex-1 py-2 text-xs font-bold text-[#261A23] bg-[#9BBFCC]/30 hover:bg-[#9BBFCC] rounded-lg border border-[#261A23] cursor-pointer text-center"
            >
              View Feed & Vouchers
            </button>
          </div>
        </div>
      )}

      {/* Bottom Info Footnote */}
      <div className="text-[11px] text-center text-[#261A23]/60 font-mono pt-2">
        <span>Fateh Education Admission Day • 24 Oct • Lalit New Delhi</span>
      </div>
    </div>
  );
};
