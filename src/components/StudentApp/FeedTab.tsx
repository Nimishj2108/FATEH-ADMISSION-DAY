import React from 'react';
import { useFatehStore } from '../../store/useFatehStore';
import {
  Gift,
  Calendar,
  ExternalLink,
  Award,
  BookOpen,
  MessageCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface FeedTabProps {
  onNavigateTab: (tab: 'home' | 'passport' | 'twin' | 'stalls' | 'feed') => void;
}

export const FeedTab: React.FC<FeedTabProps> = ({ onNavigateTab }) => {
  const { activeStudentId, students, vouchers } = useFatehStore();
  const currentStudent = students.find((s) => s.id === activeStudentId) || students[0];

  const studentVouchers = vouchers.filter((v) => v.studentId === currentStudent.id);

  const feedItems = [
    {
      id: 'f1',
      tag: 'University Incubator Grant',
      title: 'Liffey Tech €15,000 Student Enterprise Seed Fund',
      summary: 'Based on your visit to Stall B01, Liffey Technological University has opened preliminary grant applications for Indian international founders entering Autumn 2027.',
      cta: 'Explore Grant Guidelines',
      action: () => alert('Opening Liffey Student Incubator brief!'),
    },
    {
      id: 'f2',
      tag: 'Alumni Case Study',
      title: 'From DTU Delhi to DeepMind London: Rohan\'s Playbook',
      summary: 'Read how a former Fateh student mapped course modules at Northbridge & Kingsmere to secure Tier 2 tech visa sponsorship in London.',
      cta: 'Read 4-Min Case Study',
      action: () => alert('Opening alumni story!'),
    },
    {
      id: 'f3',
      tag: 'Upcoming Webinar',
      title: 'Post-Study Work Visas: UK Graduate Route vs Ireland Stamp 1G',
      summary: 'Live comparative session with Fateh senior visa attorneys on Wednesday at 7 PM. Direct Q&A on spouse visas and tax treaty exemptions.',
      cta: 'Reserve Free Seat',
      action: () => alert('Seat reserved for webinar! Link sent to your registered WhatsApp.'),
    },
    {
      id: 'f4',
      tag: '1-on-1 Consultation',
      title: 'Lock In Your SOP Review & Application Fee Waivers',
      summary: 'You collected stamps at 11 stalls at Hotel Lalit. Book your dedicated Fateh senior counsellor session to shortlist your top 3 target universities.',
      cta: 'Book Counsellor Session',
      action: () => alert('Booking calendar opened for 1-on-1 Fateh consultation.'),
    },
  ];

  return (
    <div className="space-y-4 pb-6">
      
      {/* Won Prizes & Swag Vouchers Section */}
      <div className="bg-white rounded-2xl p-4 brutal-border brutal-shadow space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-[#944F62]" />
            <h4 className="font-display font-bold text-sm text-[#261A23]">
              Your Won Prizes & Swag Vouchers
            </h4>
          </div>
          <span className="text-[10px] font-mono text-gray-500">
            {studentVouchers.length} Recorded
          </span>
        </div>

        {studentVouchers.length > 0 ? (
          <div className="space-y-2">
            {studentVouchers.map((v) => (
              <div
                key={v.id}
                className="p-3 bg-[#FBF6F0] rounded-xl border border-[#261A23]/20 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#261A23]">{v.prizeTitle}</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      v.status === 'Redeemed'
                        ? 'bg-gray-200 text-gray-700'
                        : v.status === 'Sent'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-400'
                        : 'bg-amber-100 text-amber-800 border border-amber-400'
                    }`}
                  >
                    {v.status === 'Sent' ? 'Ready (Sent to WhatsApp)' : v.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-gray-600">
                  <span>Donor: {v.donorName}</span>
                  <span className="text-[#944F62] font-bold">{v.voucherCode}</span>
                </div>

                <p className="text-[10px] text-gray-500">
                  Collect from Fateh Hospitality Desk at Lalit Foyer or show voucher code during your counselling call.
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-xs text-gray-500 font-mono">
            No prizes won yet. Complete 7+5 stamps in your Passport to unlock the live prize drum!
          </div>
        )}
      </div>

      {/* Social-Style Feed Cards */}
      <div className="space-y-3">
        <h4 className="font-display font-bold text-sm text-[#261A23] px-1">
          Personalized Admissions Feed
        </h4>

        {feedItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-4 brutal-border brutal-shadow-sm hover:brutal-shadow transition-all space-y-2"
          >
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#944F62] font-bold uppercase">
                {item.tag}
              </span>
              <span className="text-gray-400">Oct 2026</span>
            </div>

            <h5 className="font-display font-bold text-base text-[#261A23]">
              {item.title}
            </h5>

            <p className="text-xs text-[#261A23]/80 leading-relaxed font-body">
              {item.summary}
            </p>

            <div className="pt-1">
              <button
                onClick={item.action}
                className="w-full py-2 px-3 text-xs font-bold text-[#261A23] bg-[#FBF6F0] hover:bg-[#944F62] hover:text-white rounded-lg border border-[#261A23]/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{item.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
