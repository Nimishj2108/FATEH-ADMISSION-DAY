export type AppPhase = 'T-21' | 'T-48h' | 'EventDay' | 'T+1' | 'T+2';

export type UserRole = 'student' | 'scanner' | 'console' | 'stage';

export interface University {
  id: string;
  name: string;
  country: 'UK' | 'Ireland' | 'Dubai' | 'NZ';
  stallNo: string;
  tuitionINR: number; // in Lakhs
  minIELTS: number;
  minGradPercent: number;
  intakes: string[];
  visaDifficulty: number; // 1-5
  tags: string[];
  prizeItem: string;
  color: string;
}

export interface ServiceStall {
  id: string;
  name: string;
  stallNo: string;
  category: 'Visa' | 'IELTS/PTE' | 'Forex' | 'Accommodation' | 'Counsellor';
  description: string;
}

export interface StampRecord {
  stallId: string;
  stallName: string;
  stallNo: string;
  type: 'university' | 'service';
  timestamp: string;
  hash: string;
  prevHash: string;
  rotation: number;
}

export interface Student {
  id: string;
  name: string;
  twinHandle: string;
  email: string;
  phone: string;
  zone: string; // 'North Delhi' | 'South Delhi' | 'West Delhi' | 'East Delhi' | 'Gurugram' | 'Noida' | 'Ghaziabad' | 'Faridabad'
  targetCountry: string;
  targetField: string;
  budgetLakhs: number;
  ielts: number;
  gradPercent: number;
  interests: string[];
  stamps: StampRecord[];
  checkedIn: boolean;
  confirmedAttendance: boolean;
  twinOptIn: boolean;
  twinSquad: string[];
  twinMatchId?: string;
  spinWonPrize?: string;
  spinWonAt?: string;
  isMinor: boolean;
  avatarSeed: number;
  mintedTokenId?: string;
}

export interface SpotlightCandidate {
  id: string;
  studentId: string;
  name: string;
  headline: string;
  zone: string;
  college: string;
  interests: string[];
  dreamStalls: string[];
  fatehMoment: string;
  storyLines: string[];
  askTheRoom: string;
  avatarSeed: number;
}

export interface Influencer {
  id: string;
  name: string;
  handle: string;
  zone: string;
  followers: string;
  engagement: string;
  fakeFollowerPct: number;
  reelsCount: number;
  attributedRegs: number;
  conversionRate: string;
  topReelTitle: string;
  avatarSeed: number;
}

export interface UniversityPledge {
  id: string;
  uniName: string;
  stallNo: string;
  item: string;
  pledgedQty: number;
  receivedQty: number;
  status: 'Pledged' | 'Received' | 'Allocated';
}

export interface WinnerVoucher {
  id: string;
  studentId: string;
  studentName: string;
  studentPhone: string;
  drawType: 'Hourly Draw' | 'Instant Spin';
  time: string;
  prizeTitle: string;
  donorName: string;
  status: 'Allocated' | 'Sent' | 'Redeemed';
  voucherCode: string;
  sentChannel: 'WhatsApp' | 'Email';
}

export interface HourlyDrawSchedule {
  timeSlot: string; // '11:00 AM', '12:00 PM', '01:00 PM', etc.
  hour: number;
  status: 'Upcoming' | 'Live' | 'Done';
  winnerIds: string[];
}
