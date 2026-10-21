import { create } from 'zustand';
import {
  AppPhase,
  UserRole,
  Student,
  University,
  ServiceStall,
  SpotlightCandidate,
  Influencer,
  UniversityPledge,
  WinnerVoucher,
  HourlyDrawSchedule,
  StampRecord,
} from '../types';
import { UNIVERSITIES, SERVICE_STALLS } from '../data/universities';
import { INITIAL_STUDENTS, SPOTLIGHT_CANDIDATES, INFLUENCERS } from '../data/students';
import { UNIVERSITY_PLEDGES, HOURLY_SCHEDULE, INITIAL_VOUCHERS } from '../data/prizes';
import { sound } from '../utils/audio';
import { sha256 } from '../utils/hash';

interface ToastInfo {
  id: string;
  message: string;
  type: 'info' | 'success' | 'alert';
}

interface FatehState {
  // Navigation & Phases
  phase: AppPhase;
  role: UserRole;
  showPreloader: boolean;
  reducedMotion: boolean;
  audioMuted: boolean;
  tourStep: number | null; // 0 to 7, or null if inactive
  toast: ToastInfo | null;

  // Event Clock (Event Day: 10:00 AM - 05:00 PM)
  clockTime: string;
  clockMinutes: number; // minutes from 10:00 AM (0 to 420)
  clockPlaying: boolean;
  clockSpeed: 1 | 60 | 600;

  // Selected & Logged In
  activeStudentId: string;
  selectedScannerStall: string;

  // Data Collections
  students: Student[];
  universities: University[];
  serviceStalls: ServiceStall[];
  pledges: UniversityPledge[];
  vouchers: WinnerVoucher[];
  hourlySchedule: HourlyDrawSchedule[];
  spotlightCandidates: SpotlightCandidate[];
  influencers: Influencer[];

  // Blockchain Stamp State
  isChainTampered: boolean;
  tamperedIndex: number | null;

  // Stage Control
  stageScene: 'spotlight' | 'spin' | 'counter';
  activeSpotlightCandidateId: string;
  spotlightSecondsLeft: number;
  spotlightRunning: boolean;
  spotlightHideMarks: boolean;

  // Spin Your Fate State
  spinPoolStudentIds: string[];
  isSpinning: boolean;
  lastSpinWinner: { student: Student; prize: string } | null;
  drumNames: string[];
  drumCandidateIndex: number;

  // War Room T-48 Parameters
  warRoomConfirmations: number;
  warRoomBufferDeployed: boolean;
  warRoomCPM: number;
  warRoomCTR: number;
  warRoomConversion: number;
  warRoomSelectedZones: string[];
  warRoomBudgetAmount: 2500 | 5000;

  // Actions
  setPhase: (phase: AppPhase) => void;
  setRole: (role: UserRole) => void;
  setShowPreloader: (show: boolean) => void;
  setReducedMotion: (val: boolean) => void;
  setAudioMuted: (val: boolean) => void;
  setTourStep: (step: number | null) => void;
  showToast: (message: string, type?: 'info' | 'success' | 'alert') => void;
  clearToast: () => void;

  // Clock Actions
  setClockPlaying: (playing: boolean) => void;
  setClockSpeed: (speed: 1 | 60 | 600) => void;
  advanceClock: (deltaMinutes: number) => void;

  // Student Actions
  setActiveStudent: (studentId: string) => void;
  loadFeaturedAarav: () => void;
  enrollStudent: (data: Partial<Student>) => void;
  confirmAttendance: (studentId: string) => void;
  checkInStudent: (studentId: string) => void;
  addStampToStudent: (studentId: string, stallId: string, isNfc?: boolean) => Promise<{ success: boolean; reason?: string }>;
  mintPassportNFT: (studentId: string) => void;
  setTwinOptIn: (studentId: string, optIn: boolean) => void;
  joinTwinSquad: (studentId: string, mateName: string) => void;

  // Scanner Actions
  setSelectedScannerStall: (stallNo: string) => void;
  scanRandomCheckedInStudent: () => Promise<{ success: boolean; message: string }>;

  // Blockchain Actions
  tamperChain: () => void;
  repairChain: () => void;

  // Stage Spotlight Actions
  setStageScene: (scene: 'spotlight' | 'spin' | 'counter') => void;
  setActiveSpotlightCandidate: (id: string) => void;
  startSpotlightTimer: () => void;
  pauseSpotlightTimer: () => void;
  adjustSpotlightTimer: (deltaSeconds: number) => void;
  resetSpotlightTimer: () => void;
  endSpotlightTimer: () => void;
  toggleHideMarks: () => void;

  // Spin Actions
  spinYourFate: () => Promise<void>;
  runHourlyDraw: (hour: number) => Promise<void>;

  // War Room Actions
  setWarRoomConfirmations: (val: number) => void;
  setWarRoomCPM: (cpm: number) => void;
  setWarRoomCTR: (ctr: number) => void;
  setWarRoomConversion: (conv: number) => void;
  setWarRoomBudgetAmount: (amt: 2500 | 5000) => void;
  toggleWarRoomZone: (zone: string) => void;
  deployWarRoomBuffer: () => void;

  // Post Event Actions
  markPledgeReceived: (pledgeId: string, qty: number) => void;
  disburseVoucher: (voucherId: string, channel: 'WhatsApp' | 'Email') => void;
  disburseAllPendingVouchers: () => void;

  // Reset
  resetDemo: () => void;
}

// BroadcastChannel for cross-window / dual-screen mirroring
let syncChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    syncChannel = new BroadcastChannel('fateh-os-sync');
  } catch (e) {
    console.warn('BroadcastChannel not supported', e);
  }
}

// Helper: Calculate 7+5 eligibility
export function isStudent7Plus5(student: Student): boolean {
  const uniStalls = new Set(student.stamps.filter(s => s.type === 'university').map(s => s.stallId));
  const srvStalls = new Set(student.stamps.filter(s => s.type === 'service').map(s => s.stallId));
  return uniStalls.size >= 7 && srvStalls.size >= 5;
}

export const useFatehStore = create<FatehState>((set, get) => {
  // Broadcast helper
  const broadcast = (data: Record<string, unknown>) => {
    if (syncChannel) {
      syncChannel.postMessage({ type: 'SYNC_ACTION', data });
    }
  };

  // Listen for broadcast messages from other windows (e.g., Stage Screen)
  if (syncChannel) {
    syncChannel.onmessage = (event) => {
      if (event.data?.type === 'SYNC_ACTION' && event.data.data) {
        set(event.data.data);
      }
    };
  }

  return {
    // Initial State
    phase: 'EventDay',
    role: 'student',
    showPreloader: true,
    reducedMotion: false,
    audioMuted: false,
    tourStep: null,
    toast: null,

    clockTime: '11:00 AM',
    clockMinutes: 60, // 11:00 AM (60 mins after 10:00 AM)
    clockPlaying: false,
    clockSpeed: 1,

    activeStudentId: 'FE-26-0001', // Aarav Sharma
    selectedScannerStall: 'A01',

    students: INITIAL_STUDENTS,
    universities: UNIVERSITIES,
    serviceStalls: SERVICE_STALLS,
    pledges: UNIVERSITY_PLEDGES,
    vouchers: INITIAL_VOUCHERS,
    hourlySchedule: HOURLY_SCHEDULE,
    spotlightCandidates: SPOTLIGHT_CANDIDATES,
    influencers: INFLUENCERS,

    isChainTampered: false,
    tamperedIndex: null,

    stageScene: 'spotlight',
    activeSpotlightCandidateId: 'spot-1',
    spotlightSecondsLeft: 300,
    spotlightRunning: false,
    spotlightHideMarks: false,

    spinPoolStudentIds: ['FE-26-0004'], // Simran Kaur initial
    isSpinning: false,
    lastSpinWinner: null,
    drumNames: ['Aarav S. #0001', 'Simran K. #0004', 'Tanvi M. #0007', 'Aditya S. #0015', 'Rhea B. #0002'],
    drumCandidateIndex: 0,

    warRoomConfirmations: 330,
    warRoomBufferDeployed: false,
    warRoomCPM: 115,
    warRoomCTR: 1.2,
    warRoomConversion: 9.5,
    warRoomSelectedZones: ['North Delhi', 'Gurugram', 'South Delhi', 'Noida'],
    warRoomBudgetAmount: 2500,

    // Navigation
    setPhase: (phase) => {
      set({ phase });
      broadcast({ phase });
    },
    setRole: (role) => {
      set({ role });
      broadcast({ role });
    },
    setShowPreloader: (showPreloader) => set({ showPreloader }),
    setReducedMotion: (reducedMotion) => set({ reducedMotion }),
    setAudioMuted: (audioMuted) => {
      sound.muted = audioMuted;
      set({ audioMuted });
    },
    setTourStep: (tourStep) => set({ tourStep }),
    showToast: (message, type = 'info') => {
      const id = Date.now().toString();
      set({ toast: { id, message, type } });
      setTimeout(() => {
        if (get().toast?.id === id) {
          set({ toast: null });
        }
      }, 4000);
    },
    clearToast: () => set({ toast: null }),

    // Clock
    setClockPlaying: (clockPlaying) => {
      set({ clockPlaying });
      broadcast({ clockPlaying });
    },
    setClockSpeed: (clockSpeed) => {
      set({ clockSpeed });
      broadcast({ clockSpeed });
    },
    advanceClock: (deltaMinutes) => {
      const currentMins = get().clockMinutes;
      const nextMins = Math.min(420, Math.max(0, currentMins + deltaMinutes)); // 10 AM to 5 PM = 420 mins
      const totalHour = 10 + Math.floor(nextMins / 60);
      const minutesRem = nextMins % 60;
      const period = totalHour >= 12 ? 'PM' : 'AM';
      const displayHour = totalHour > 12 ? totalHour - 12 : totalHour;
      const clockTime = `${displayHour.toString().padStart(2, '0')}:${minutesRem.toString().padStart(2, '0')} ${period}`;

      set({ clockMinutes: nextMins, clockTime });
      broadcast({ clockMinutes: nextMins, clockTime });

      // Check if an hourly draw should trigger on the hour
      if (minutesRem === 0 && totalHour >= 11 && totalHour <= 16) {
        const schedule = get().hourlySchedule.find(s => s.hour === totalHour);
        if (schedule && schedule.status === 'Upcoming') {
          get().runHourlyDraw(totalHour);
        }
      }
    },

    // Active Student
    setActiveStudent: (activeStudentId) => {
      set({ activeStudentId });
      broadcast({ activeStudentId });
    },
    loadFeaturedAarav: () => {
      set({ activeStudentId: 'FE-26-0001', role: 'student' });
      get().showToast('Loaded featured demo student: Aarav Sharma (6/7 Uni + 5/5 Service stamps)', 'info');
      broadcast({ activeStudentId: 'FE-26-0001' });
    },

    enrollStudent: (data) => {
      const newId = `FE-26-${(get().students.length + 1).toString().padStart(4, '0')}`;
      const newStudent: Student = {
        id: newId,
        name: data.name || 'New Attendee',
        twinHandle: `Cosmic Pioneer #${Math.floor(1000 + Math.random() * 9000)}`,
        email: data.email || 'attendee@fateh.com',
        phone: data.phone || '+91 98110 00000',
        zone: data.zone || 'South Delhi',
        targetCountry: data.targetCountry || 'UK / Ireland',
        targetField: data.targetField || 'CS & AI Systems',
        budgetLakhs: data.budgetLakhs || 22,
        ielts: data.ielts || 6.5,
        gradPercent: data.gradPercent || 70,
        interests: data.interests || ['CS/AI', 'startups'],
        stamps: [],
        checkedIn: false,
        confirmedAttendance: false,
        twinOptIn: false,
        twinSquad: [],
        isMinor: false,
        avatarSeed: Math.floor(Math.random() * 100),
      };
      set((state) => ({
        students: [newStudent, ...state.students],
        activeStudentId: newId,
      }));
      get().showToast(`Enrolled ${newStudent.name}! Digital pass ready.`, 'success');
    },

    confirmAttendance: (studentId) => {
      set((state) => ({
        students: state.students.map((s) =>
          s.id === studentId ? { ...s, confirmedAttendance: true } : s
        ),
      }));
      get().showToast('Attendance confirmed! See you at Hotel Lalit.', 'success');
    },

    checkInStudent: (studentId) => {
      set((state) => ({
        students: state.students.map((s) =>
          s.id === studentId ? { ...s, checkedIn: true } : s
        ),
      }));
      get().showToast('Checked in at reception! Digital Passport opened.', 'success');
    },

    addStampToStudent: async (studentId, stallId, isNfc = false) => {
      const state = get();
      const student = state.students.find((s) => s.id === studentId);
      if (!student) return { success: false, reason: 'Student not found' };

      if (!student.checkedIn) {
        sound.playError();
        return { success: false, reason: 'Student must check in at reception first!' };
      }

      // Check if already stamped at this stall
      const existing = student.stamps.find((st) => st.stallId === stallId);
      if (existing) {
        sound.playError();
        return {
          success: false,
          reason: `Already stamped at ${existing.stallName} (${existing.stallNo}) at ${existing.timestamp}! One stamp per stall.`,
        };
      }

      // Find stall metadata
      const uni = state.universities.find((u) => u.id === stallId || u.stallNo === stallId);
      const srv = state.serviceStalls.find((s) => s.id === stallId || s.stallNo === stallId);
      if (!uni && !srv) {
        return { success: false, reason: 'Invalid stall identifier' };
      }

      const stallName = uni ? uni.name : srv!.name;
      const stallNo = uni ? uni.stallNo : srv!.stallNo;
      const type: 'university' | 'service' = uni ? 'university' : 'service';
      const timestamp = state.clockTime;

      // Build simulated SHA-256 block linked to previous stamp hash
      const prevHash = student.stamps.length > 0
        ? student.stamps[student.stamps.length - 1].hash
        : '0000000000000000000000000000000000000000000000000000000000000000';
      const blockContent = `${student.id}:${stallNo}:${timestamp}:${prevHash}:${Math.random()}`;
      const hash = await sha256(blockContent);
      const rotation = Math.floor(Math.random() * 14) - 7;

      const newStamp: StampRecord = {
        stallId: uni ? uni.id : srv!.id,
        stallName,
        stallNo,
        type,
        timestamp,
        hash,
        prevHash,
        rotation,
      };

      const updatedStamps = [...student.stamps, newStamp];
      const updatedStudent = { ...student, stamps: updatedStamps };

      // Play audio thud
      sound.playStampThud();

      // Check 7+5 condition
      const wasEligible = isStudent7Plus5(student);
      const isEligibleNow = isStudent7Plus5(updatedStudent);

      let nextSpinPool = state.spinPoolStudentIds;
      if (!wasEligible && isEligibleNow) {
        sound.playUnlock();
        if (!nextSpinPool.includes(student.id)) {
          nextSpinPool = [...nextSpinPool, student.id];
        }
        get().showToast(
          `🎉 Criteria Met! 7 Universities + 5 Services completed. ${student.name} is now enrolled in Spin Your Fate!`,
          'success'
        );
      } else {
        const uniCount = updatedStamps.filter((s) => s.type === 'university').length;
        const srvCount = updatedStamps.filter((s) => s.type === 'service').length;
        get().showToast(
          `Stamped: ${stallName} (${stallNo}) via ${isNfc ? 'NFC Tap' : 'QR Scan'} • Progress: ${uniCount}/7 Unis, ${srvCount}/5 Services`,
          'info'
        );
      }

      const newDrumNames = state.students
        .filter((s) => nextSpinPool.includes(s.id))
        .map((s) => `${s.name.split(' ')[0]} ${s.name.split(' ')[1]?.[0] || ''}. #${s.id.slice(-4)}`);

      set((s) => ({
        students: s.students.map((st) => (st.id === studentId ? updatedStudent : st)),
        spinPoolStudentIds: nextSpinPool,
        drumNames: newDrumNames.length > 0 ? newDrumNames : s.drumNames,
      }));

      broadcast({
        students: get().students,
        spinPoolStudentIds: nextSpinPool,
      });

      return { success: true };
    },

    mintPassportNFT: (studentId) => {
      const student = get().students.find((s) => s.id === studentId);
      if (!student) return;
      const tokenId = `FT-NFT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
      set((state) => ({
        students: state.students.map((s) =>
          s.id === studentId ? { ...s, mintedTokenId: tokenId } : s
        ),
      }));
      sound.playUnlock();
      get().showToast(`Digital Passport minted! Token ID: ${tokenId} (Simulation)`, 'success');
    },

    setTwinOptIn: (studentId, optIn) => {
      set((state) => ({
        students: state.students.map((s) =>
          s.id === studentId ? { ...s, twinOptIn: optIn } : s
        ),
      }));
      get().showToast(optIn ? 'TWIN Radar active! Looking for matches.' : 'TWIN Radar paused.', 'info');
    },

    joinTwinSquad: (studentId, mateName) => {
      set((state) => ({
        students: state.students.map((s) =>
          s.id === studentId ? { ...s, twinSquad: [...s.twinSquad, mateName] } : s
        ),
      }));
      get().showToast(`${mateName} accepted the Squad Pact!`, 'success');
    },

    // Scanner
    setSelectedScannerStall: (stallNo) => set({ selectedScannerStall: stallNo }),
    scanRandomCheckedInStudent: async () => {
      const stallNo = get().selectedScannerStall;
      const checkedInStudents = get().students.filter((s) => s.checkedIn);
      if (checkedInStudents.length === 0) {
        return { success: false, message: 'No students checked in yet' };
      }
      // Pick random student or prioritize Aarav if he lacks this stamp
      const aarav = checkedInStudents.find((s) => s.id === 'FE-26-0001');
      let target = checkedInStudents[Math.floor(Math.random() * checkedInStudents.length)];
      if (aarav && !aarav.stamps.some((st) => st.stallNo === stallNo)) {
        target = aarav;
      }

      const res = await get().addStampToStudent(target.id, stallNo);
      if (res.success) {
        return { success: true, message: `Stamped ${target.name} (${target.id}) at Stall ${stallNo}` };
      } else {
        return { success: false, message: res.reason || 'Failed to stamp' };
      }
    },

    // Blockchain
    tamperChain: () => {
      set({ isChainTampered: true, tamperedIndex: 2 });
      sound.playError();
      get().showToast('ALERT: Block #3 tampered! SHA-256 hash mismatch detected. Chain invalid.', 'alert');
    },
    repairChain: () => {
      set({ isChainTampered: false, tamperedIndex: null });
      sound.playUnlock();
      get().showToast('Chain verified & repaired against Fateh authoritative root signature.', 'success');
    },

    // Stage Spotlight
    setStageScene: (stageScene) => {
      set({ stageScene });
      broadcast({ stageScene });
    },
    setActiveSpotlightCandidate: (id) => {
      set({ activeSpotlightCandidateId: id, spotlightSecondsLeft: 300, spotlightRunning: false });
      broadcast({ activeSpotlightCandidateId: id, spotlightSecondsLeft: 300, spotlightRunning: false });
    },
    startSpotlightTimer: () => {
      set({ spotlightRunning: true });
      broadcast({ spotlightRunning: true });
    },
    pauseSpotlightTimer: () => {
      set({ spotlightRunning: false });
      broadcast({ spotlightRunning: false });
    },
    adjustSpotlightTimer: (delta) => {
      const next = Math.max(0, get().spotlightSecondsLeft + delta);
      set({ spotlightSecondsLeft: next });
      broadcast({ spotlightSecondsLeft: next });
    },
    resetSpotlightTimer: () => {
      set({ spotlightSecondsLeft: 300, spotlightRunning: false });
      broadcast({ spotlightSecondsLeft: 300, spotlightRunning: false });
    },
    endSpotlightTimer: () => {
      set({ spotlightSecondsLeft: 0, spotlightRunning: false });
      sound.playFanfare();
      broadcast({ spotlightSecondsLeft: 0, spotlightRunning: false });
    },
    toggleHideMarks: () => {
      set((s) => ({ spotlightHideMarks: !s.spotlightHideMarks }));
    },

    // Spin Your Fate (Stage Drum & Student App)
    spinYourFate: async () => {
      const state = get();
      if (state.isSpinning) return;

      // Eligible pool
      const pool = state.students.filter((s) => state.spinPoolStudentIds.includes(s.id));
      if (pool.length === 0) {
        // Fallback to top students with most stamps
        pool.push(state.students[0]);
      }

      set({ isSpinning: true });
      broadcast({ isSpinning: true });

      // Small prizes only from prompt rules
      const smallPrizes = [
        'Northbridge University: Tote + Notebook Pack',
        'Liffey Tech: Embroidered Campus Hoodie',
        'Kiwi Coast: Recycled Metal Water Bottle',
        'Fateh Swag Kit (Cap, Bag, Stickers)',
        'Fateh: Free 1-on-1 Profile & Visa Audit Session',
      ];

      // Simulate drum rotation with tick sounds
      let elapsed = 0;
      const spinDuration = 3500;
      const interval = 100;
      const namesList = pool.map((s) => `${s.name} (${s.id})`);

      const timer = setInterval(() => {
        elapsed += interval;
        const candidateIdx = Math.floor(Math.random() * namesList.length);
        set({ drumCandidateIndex: candidateIdx });
        sound.playTick(500 + Math.random() * 200);

        if (elapsed >= spinDuration) {
          clearInterval(timer);
          // Pick winner
          const winnerStudent = pool[Math.floor(Math.random() * pool.length)];
          const prize = smallPrizes[Math.floor(Math.random() * smallPrizes.length)];

          sound.playFanfare();

          // Create voucher for winner
          const newVoucher: WinnerVoucher = {
            id: `vouch-${Date.now()}`,
            studentId: winnerStudent.id,
            studentName: winnerStudent.name,
            studentPhone: winnerStudent.phone,
            drawType: 'Instant Spin',
            time: state.clockTime,
            prizeTitle: prize,
            donorName: prize.split(':')[0],
            status: 'Allocated',
            voucherCode: `FATEH-WIN-${Math.floor(1000 + Math.random() * 9000)}`,
            sentChannel: 'WhatsApp',
          };

          // Update student
          const updatedStudents = get().students.map((s) =>
            s.id === winnerStudent.id
              ? { ...s, spinWonPrize: prize, spinWonAt: state.clockTime }
              : s
          );

          set({
            isSpinning: false,
            lastSpinWinner: { student: winnerStudent, prize },
            vouchers: [newVoucher, ...get().vouchers],
            students: updatedStudents,
          });

          broadcast({
            isSpinning: false,
            lastSpinWinner: { student: winnerStudent, prize },
            vouchers: get().vouchers,
            students: updatedStudents,
          });

          get().showToast(`🏆 WINNER: ${winnerStudent.name} won ${prize}!`, 'success');
        }
      }, interval);
    },

    runHourlyDraw: async (hour) => {
      const state = get();
      const scheduleItem = state.hourlySchedule.find((s) => s.hour === hour);
      if (!scheduleItem) return;

      const pool = state.students.filter((s) => state.spinPoolStudentIds.includes(s.id) && !s.spinWonPrize);
      const eligiblePool = pool.length >= 5 ? pool : state.students.filter((s) => s.checkedIn && !s.spinWonPrize);

      const pickedWinners: Student[] = [];
      const shuffled = [...eligiblePool].sort(() => 0.5 - Math.random());
      for (let i = 0; i < Math.min(5, shuffled.length); i++) {
        pickedWinners.push(shuffled[i]);
      }

      const prizes = [
        'Northbridge Tote + Notebook Pack',
        'Liffey Tech Embroidered Hoodie',
        'Kiwi Coast Recycled Metal Water Bottle',
        'Fateh Swag Kit',
        'Free 1-on-1 Profile & Visa Audit Session',
      ];

      const newVouchers: WinnerVoucher[] = pickedWinners.map((winner, idx) => ({
        id: `vouch-hr-${hour}-${idx}`,
        studentId: winner.id,
        studentName: winner.name,
        studentPhone: winner.phone,
        drawType: 'Hourly Draw',
        time: scheduleItem.timeSlot,
        prizeTitle: prizes[idx % prizes.length],
        donorName: 'Partner University & Fateh',
        status: 'Allocated',
        voucherCode: `FATEH-HR${hour}-${Math.floor(1000 + Math.random() * 9000)}`,
        sentChannel: 'WhatsApp',
      }));

      const winnerIds = pickedWinners.map((w) => w.id);
      const updatedSchedule = state.hourlySchedule.map((s) =>
        s.hour === hour ? { ...s, status: 'Done' as const, winnerIds } : s
      );

      const updatedStudents = state.students.map((s) => {
        const winIdx = winnerIds.indexOf(s.id);
        if (winIdx !== -1) {
          return {
            ...s,
            spinWonPrize: prizes[winIdx % prizes.length],
            spinWonAt: `${scheduleItem.timeSlot} Hourly Draw`,
          };
        }
        return s;
      });

      sound.playFanfare();
      set({
        hourlySchedule: updatedSchedule,
        vouchers: [...newVouchers, ...state.vouchers],
        students: updatedStudents,
      });

      broadcast({
        hourlySchedule: updatedSchedule,
        vouchers: get().vouchers,
        students: updatedStudents,
      });

      get().showToast(
        `⚡ Hourly Fateh Five Draw (${scheduleItem.timeSlot}) completed! 5 winners announced.`,
        'success'
      );
    },

    // War Room
    setWarRoomConfirmations: (warRoomConfirmations) => set({ warRoomConfirmations }),
    setWarRoomCPM: (warRoomCPM) => set({ warRoomCPM }),
    setWarRoomCTR: (warRoomCTR) => set({ warRoomCTR }),
    setWarRoomConversion: (warRoomConversion) => set({ warRoomConversion }),
    setWarRoomBudgetAmount: (warRoomBudgetAmount) => set({ warRoomBudgetAmount }),
    toggleWarRoomZone: (zone) => {
      set((s) => {
        const exists = s.warRoomSelectedZones.includes(zone);
        return {
          warRoomSelectedZones: exists
            ? s.warRoomSelectedZones.filter((z) => z !== zone)
            : [...s.warRoomSelectedZones, zone],
        };
      });
    },
    deployWarRoomBuffer: () => {
      set({ warRoomBufferDeployed: true });
      sound.playUnlock();
      get().showToast(
        'Meta Geo-Boost deployed: ₹2,500 targeted buffer campaign live across selected zones!',
        'success'
      );
    },

    // Post Event
    markPledgeReceived: (pledgeId, qty) => {
      set((s) => ({
        pledges: s.pledges.map((p) =>
          p.id === pledgeId
            ? { ...p, receivedQty: Math.min(p.pledgedQty, p.receivedQty + qty), status: 'Received' as const }
            : p
        ),
      }));
      get().showToast('University in-kind swag count updated.', 'info');
    },
    disburseVoucher: (voucherId, channel) => {
      set((s) => ({
        vouchers: s.vouchers.map((v) =>
          v.id === voucherId ? { ...v, status: 'Sent' as const, sentChannel: channel } : v
        ),
      }));
      get().showToast(`Voucher link sent to student via ${channel}!`, 'success');
    },
    disburseAllPendingVouchers: () => {
      const pendingCount = get().vouchers.filter((v) => v.status === 'Allocated').length;
      set((s) => ({
        vouchers: s.vouchers.map((v) => ({ ...v, status: 'Sent' as const })),
      }));
      sound.playUnlock();
      get().showToast(`Disbursed ${pendingCount} vouchers via WhatsApp Automation API.`, 'success');
    },

    // Reset
    resetDemo: () => {
      set({
        phase: 'EventDay',
        role: 'student',
        showPreloader: false,
        clockTime: '11:00 AM',
        clockMinutes: 60,
        clockPlaying: false,
        clockSpeed: 1,
        activeStudentId: 'FE-26-0001',
        students: INITIAL_STUDENTS,
        vouchers: INITIAL_VOUCHERS,
        hourlySchedule: HOURLY_SCHEDULE,
        pledges: UNIVERSITY_PLEDGES,
        isChainTampered: false,
        tamperedIndex: null,
        stageScene: 'spotlight',
        activeSpotlightCandidateId: 'spot-1',
        spotlightSecondsLeft: 300,
        spotlightRunning: false,
        spinPoolStudentIds: ['FE-26-0004'],
        lastSpinWinner: null,
        warRoomConfirmations: 330,
        warRoomBufferDeployed: false,
        tourStep: null,
      });
      broadcast({ reset: true });
      get().showToast('Demo reset to initial baseline state.', 'info');
    },
  };
});
