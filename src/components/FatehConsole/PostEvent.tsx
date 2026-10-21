import React, { useState } from 'react';
import { useFatehStore } from '../../store/useFatehStore';
import {
  PackageCheck,
  Send,
  MessageCircle,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  TrendingUp,
  Users,
  Clock,
} from 'lucide-react';

export const PostEvent: React.FC = () => {
  const {
    pledges,
    markPledgeReceived,
    vouchers,
    disburseVoucher,
    disburseAllPendingVouchers,
    students,
  } = useFatehStore();

  const [activeTab, setActiveTab] = useState<'pledges' | 'vouchers' | 'feedback' | 'mints'>('vouchers');
  const [selectedVoucherForPreview, setSelectedVoucherForPreview] = useState<string | null>(null);

  const pendingVouchers = vouchers.filter((v) => v.status === 'Allocated');
  const sentVouchers = vouchers.filter((v) => v.status === 'Sent');
  const redeemedVouchers = vouchers.filter((v) => v.status === 'Redeemed');

  const mintedStudentsCount = students.filter((s) => s.mintedTokenId).length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl brutal-border brutal-shadow space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold uppercase bg-[#944F62] text-white px-2 py-0.5 rounded">
            T+1 / T+2 Post-Admission Day Operations
          </span>
          <span className="text-xs font-mono text-gray-500">
            Hotel Lalit Follow-Up
          </span>
        </div>
        <h3 className="font-display font-extrabold text-2xl text-[#261A23]">
          Post-Event Inventory, Voucher Disbursal & Feedback
        </h3>
        <p className="text-xs text-[#261A23]/70 font-body">
          Reconcile university swag pledges, disburse prize claim codes via WhatsApp automation, and analyze lead quality scores.
        </p>

        {/* Sub-tab Switcher */}
        <div className="flex gap-2 pt-2 border-t mt-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'vouchers', label: `Winner Disbursal (${vouchers.length})` },
            { id: 'pledges', label: `University Pledges (${pledges.length})` },
            { id: 'feedback', label: 'NPS & Analytics' },
            { id: 'mints', label: `Passport Mints (${mintedStudentsCount})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-[#261A23] text-white brutal-shadow-sm'
                  : 'bg-gray-100 text-[#261A23] hover:bg-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: VOUCHERS DISBURSAL */}
      {activeTab === 'vouchers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-xl brutal-border text-center">
              <span className="text-[10px] font-mono uppercase text-gray-500 block">Pending Dispatch</span>
              <span className="text-2xl font-display font-extrabold text-amber-700 tabular-nums">
                {pendingVouchers.length}
              </span>
              <span className="text-[10px] text-gray-400 font-mono block">Allocated to winners</span>
            </div>

            <div className="bg-white p-4 rounded-xl brutal-border text-center">
              <span className="text-[10px] font-mono uppercase text-gray-500 block">Sent (WhatsApp / Email)</span>
              <span className="text-2xl font-display font-extrabold text-emerald-700 tabular-nums">
                {sentVouchers.length}
              </span>
              <span className="text-[10px] text-gray-400 font-mono block">Claim links delivered</span>
            </div>

            <div className="bg-white p-4 rounded-xl brutal-border text-center">
              <span className="text-[10px] font-mono uppercase text-gray-500 block">Redeemed / Claimed</span>
              <span className="text-2xl font-display font-extrabold text-[#261A23] tabular-nums">
                {redeemedVouchers.length}
              </span>
              <span className="text-[10px] text-gray-400 font-mono block">Swag collected</span>
            </div>
          </div>

          {/* Action Strip: Send All Button */}
          {pendingVouchers.length > 0 && (
            <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <h5 className="font-display font-bold text-sm text-amber-950">
                    {pendingVouchers.length} Winners Awaiting Delivery
                  </h5>
                  <p className="text-xs text-amber-800">
                    Policy alert: All vouchers must be disbursed within 48 hours of event close.
                  </p>
                </div>
              </div>

              <button
                onClick={disburseAllPendingVouchers}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl brutal-shadow-sm cursor-pointer whitespace-nowrap flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>Send All via WhatsApp API</span>
              </button>
            </div>
          )}

          {/* Vouchers Table */}
          <div className="bg-white rounded-2xl brutal-border brutal-shadow overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h4 className="font-display font-bold text-sm text-[#261A23]">
                Winner Claim Vouchers Registry ({vouchers.length})
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#261A23] text-white font-mono text-[10px] uppercase">
                  <tr>
                    <th className="p-3">Winner Student</th>
                    <th className="p-3">Prize Title</th>
                    <th className="p-3">Draw Time</th>
                    <th className="p-3">Voucher Code</th>
                    <th className="p-3">Delivery Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vouchers.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="p-3 font-medium">
                        <span className="font-bold text-[#261A23]">{v.studentName}</span>
                        <span className="text-[10px] font-mono text-gray-500 block">{v.studentPhone}</span>
                      </td>

                      <td className="p-3">
                        <span className="font-medium text-[#261A23]">{v.prizeTitle}</span>
                        <span className="text-[10px] text-gray-500 block">From: {v.donorName}</span>
                      </td>

                      <td className="p-3 font-mono text-gray-600">
                        {v.time} ({v.drawType})
                      </td>

                      <td className="p-3 font-mono font-bold text-[#944F62]">
                        {v.voucherCode}
                      </td>

                      <td className="p-3 font-mono">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            v.status === 'Sent'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>

                      <td className="p-3 text-right space-x-1">
                        {v.status === 'Allocated' ? (
                          <button
                            onClick={() => disburseVoucher(v.id, 'WhatsApp')}
                            className="px-2.5 py-1 text-[11px] font-bold bg-[#944F62] text-white rounded hover:bg-[#261A23] cursor-pointer"
                          >
                            Send WA
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedVoucherForPreview(v.voucherCode)}
                            className="px-2 py-1 text-[10px] font-mono text-gray-600 hover:text-black underline cursor-pointer"
                          >
                            Preview Bubble
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: UNIVERSITY PLEDGES */}
      {activeTab === 'pledges' && (
        <div className="bg-white rounded-2xl brutal-border brutal-shadow p-5 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h4 className="font-display font-bold text-base text-[#261A23]">
                University Swag Pledges Reconciliation
              </h4>
              <p className="text-xs text-gray-500">Track physical in-kind swag cartons received at Hotel Lalit</p>
            </div>
          </div>

          <div className="space-y-3">
            {pledges.map((p) => {
              const diff = p.pledgedQty - p.receivedQty;
              return (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl border-2 border-[#261A23] bg-[#FBF6F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-[#261A23] text-white px-2 py-0.5 rounded">
                        Stall {p.stallNo}
                      </span>
                      <span className="font-display font-bold text-sm text-[#261A23]">
                        {p.uniName}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700">
                      Item: <strong>{p.item}</strong>
                    </p>
                    <span className="text-[10px] font-mono text-gray-500">
                      Pledged: {p.pledgedQty} units • Received: {p.receivedQty} units
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {diff > 0 ? (
                      <button
                        onClick={() => markPledgeReceived(p.id, 5)}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-[#944F62] hover:bg-[#261A23] rounded-lg brutal-shadow-sm cursor-pointer"
                      >
                        + Mark 5 Received
                      </button>
                    ) : (
                      <span className="text-xs font-mono font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>All Received</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: NPS & FEEDBACK ANALYTICS */}
      {activeTab === 'feedback' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl brutal-border brutal-shadow space-y-3">
            <h4 className="font-display font-bold text-base text-[#261A23] border-b pb-2">
              Attendee Experience Metrics
            </h4>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-[#FBF6F0] rounded-xl border border-[#261A23]/20">
                <span className="text-[10px] font-mono text-gray-500 uppercase block">Event NPS</span>
                <span className="text-3xl font-display font-extrabold text-[#944F62] block pt-1">+68</span>
                <span className="text-[10px] text-emerald-700 font-mono font-bold">World Class</span>
              </div>

              <div className="p-3 bg-[#FBF6F0] rounded-xl border border-[#261A23]/20">
                <span className="text-[10px] font-mono text-gray-500 uppercase block">Avg Stalls Visited</span>
                <span className="text-3xl font-display font-extrabold text-[#261A23] block pt-1">8.4</span>
                <span className="text-[10px] text-gray-500 font-mono">Per attendee</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <span className="font-bold block text-[#261A23]">Top Rated Stalls by Student Review:</span>
              <div className="p-2 bg-gray-50 rounded border text-[11px] flex justify-between">
                <span>1. Liffey Tech (Ireland) - Stall B01</span>
                <span className="font-bold text-emerald-700">4.9 / 5.0</span>
              </div>
              <div className="p-2 bg-gray-50 rounded border text-[11px] flex justify-between">
                <span>2. Northbridge University (UK) - Stall A01</span>
                <span className="font-bold text-emerald-700">4.8 / 5.0</span>
              </div>
              <div className="p-2 bg-gray-50 rounded border text-[11px] flex justify-between">
                <span>3. Fateh Visa Guidance - Desk S1</span>
                <span className="font-bold text-emerald-700">4.9 / 5.0</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl brutal-border brutal-shadow space-y-3">
            <h4 className="font-display font-bold text-base text-[#261A23] border-b pb-2">
              TWIN Feature Performance
            </h4>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Total TWIN Opt-in Rate:</span>
                <span className="font-bold text-[#261A23]">54% (178 / 330)</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Squad Pacts Sealed:</span>
                <span className="font-bold text-[#261A23]">42 Squads (148 students)</span>
              </div>
              <div className="flex justify-between p-2 bg-gray-50 rounded">
                <span>Mutual Identity Reveals:</span>
                <span className="font-bold text-[#944F62]">64 Matches</span>
              </div>
              <div className="flex justify-between p-2 bg-emerald-50 rounded text-emerald-900 border border-emerald-300">
                <span>Attendance Lift for TWIN users:</span>
                <span className="font-bold">+38% vs solo applicants</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: PASSPORT MINTS */}
      {activeTab === 'mints' && (
        <div className="bg-white p-5 rounded-2xl brutal-border brutal-shadow space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h4 className="font-display font-bold text-base text-[#261A23]">
                Digital Passport NFT Mint Rates
              </h4>
              <p className="text-xs text-gray-500">Commemorative cryptographic mandala cards generated by attendees</p>
            </div>
            <span className="text-[10px] font-mono bg-[#9BBFCC]/30 px-2 py-0.5 rounded font-bold">
              Simulation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-[#FBF6F0] rounded-xl border border-[#261A23]/20 text-center">
              <span className="text-[10px] font-mono uppercase text-gray-500 block">Total Mints</span>
              <span className="text-2xl font-display font-extrabold text-[#944F62]">
                {mintedStudentsCount + 44}
              </span>
            </div>
            <div className="p-3 bg-[#FBF6F0] rounded-xl border border-[#261A23]/20 text-center">
              <span className="text-[10px] font-mono uppercase text-gray-500 block">Eligible 7+5</span>
              <span className="text-2xl font-display font-extrabold text-[#261A23]">
                112
              </span>
            </div>
            <div className="p-3 bg-[#FBF6F0] rounded-xl border border-[#261A23]/20 text-center">
              <span className="text-[10px] font-mono uppercase text-gray-500 block">Social Shares</span>
              <span className="text-2xl font-display font-extrabold text-emerald-700">
                86
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Simulated WhatsApp Bubble Preview Modal */}
      {selectedVoucherForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#EFEAE2] text-[#111B21] rounded-2xl max-w-sm w-full p-4 space-y-3 shadow-2xl border-2 border-[#261A23]">
            <div className="flex items-center justify-between border-b border-gray-300 pb-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-xs">WhatsApp Notification Preview</span>
              </div>
              <button
                onClick={() => setSelectedVoucherForPreview(null)}
                className="text-gray-500 hover:text-black text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Simulated WhatsApp Chat Bubble */}
            <div className="bg-white p-3 rounded-xl shadow-xs space-y-1.5 text-xs font-body">
              <p className="font-bold text-[#944F62]">
                🎉 Congratulations from Fateh Education!
              </p>
              <p>
                You won during the Admission Day draw at Hotel Lalit! Here is your official prize claim code:
              </p>
              <div className="p-2 bg-gray-100 rounded-lg font-mono font-bold text-center text-sm text-[#261A23] border border-dashed border-gray-400">
                {selectedVoucherForPreview}
              </div>
              <p className="text-[11px] text-gray-500">
                Show this message at the Fateh Hospitality Desk or to your senior counsellor during your 1-on-1 strategy session.
              </p>
              <div className="text-[9px] text-right text-gray-400 font-mono pt-1">
                Delivered 11:42 AM ✓✓
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
