import React, { useState } from 'react';
import { useFatehStore } from '../../store/useFatehStore';
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Sliders,
  DollarSign,
  Radio,
  Send,
  Sparkles,
  Users,
  Video,
} from 'lucide-react';
import { NCR_ZONES } from '../../data/universities';

export const WarRoom: React.FC = () => {
  const {
    warRoomConfirmations,
    setWarRoomConfirmations,
    warRoomBufferDeployed,
    deployWarRoomBuffer,
    warRoomCPM,
    setWarRoomCPM,
    warRoomCTR,
    setWarRoomCTR,
    warRoomConversion,
    setWarRoomConversion,
    warRoomSelectedZones,
    toggleWarRoomZone,
    warRoomBudgetAmount,
    setWarRoomBudgetAmount,
    influencers,
  } = useFatehStore();

  const [radiusKm, setRadiusKm] = useState<5 | 10 | 20>(10);
  const [selectedInfluencerIds, setSelectedInfluencerIds] = useState<string[]>(['inf-1', 'inf-3', 'inf-6']);

  const targetConfirmations = 385; // 70% of 550
  const gap = Math.max(0, targetConfirmations - warRoomConfirmations);
  const isBufferTriggered = warRoomConfirmations < targetConfirmations;

  // Compute modeled Meta Geo-Boost impact
  // Budget ₹2,500 or ₹5,000
  // Impressions = (Budget / CPM) * 1000
  // Clicks = Impressions * (CTR / 100)
  // Extra Confirmations = Clicks * (Conversion / 100)
  const impressions = Math.round((warRoomBudgetAmount / warRoomCPM) * 1000);
  const clicks = Math.round(impressions * (warRoomCTR / 100));
  const modeledExtraConfirmations = Math.round(clicks * (warRoomConversion / 100));
  const projectedTotalConfirmations = warRoomConfirmations + (warRoomBufferDeployed ? modeledExtraConfirmations : 0);
  const projectedPct = Math.round((projectedTotalConfirmations / 550) * 100);

  // Zone Heat Analysis data
  const zoneAnalysis = [
    { zone: 'North Delhi (DU Belt)', regs: 110, conf: Math.round(warRoomConfirmations * 0.22), distance: 'Near', priority: 'High (DU Metro Line)' },
    { zone: 'Gurugram (Cyber City)', regs: 95, conf: Math.round(warRoomConfirmations * 0.18), distance: 'Mid', priority: 'High (Tech & MBA)' },
    { zone: 'South Delhi', regs: 90, conf: Math.round(warRoomConfirmations * 0.17), distance: 'Near', priority: 'Medium' },
    { zone: 'Noida (Amity Belt)', regs: 80, conf: Math.round(warRoomConfirmations * 0.14), distance: 'Mid', priority: 'High (Engineering)' },
    { zone: 'West Delhi (Dwarka/Janakpuri)', regs: 70, conf: Math.round(warRoomConfirmations * 0.12), distance: 'Near', priority: 'Medium' },
    { zone: 'East Delhi', regs: 45, conf: Math.round(warRoomConfirmations * 0.08), distance: 'Near', priority: 'Normal' },
    { zone: 'Ghaziabad', regs: 35, conf: Math.round(warRoomConfirmations * 0.05), distance: 'Far', priority: 'Low' },
    { zone: 'Faridabad', regs: 25, conf: Math.round(warRoomConfirmations * 0.04), distance: 'Far', priority: 'Low' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Simulation Chip & Header */}
      <div className="bg-white p-5 rounded-2xl brutal-border brutal-shadow space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase bg-[#944F62] text-white px-2 py-0.5 rounded">
              T-48h Drop-off Defense Matrix
            </span>
            <span className="text-[10px] font-mono bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-bold">
              Guesstimate, editable assumptions, not real Meta data • Simulation
            </span>
          </div>

          <span className="text-xs font-mono text-gray-500">
            Escalation Rule: Release ₹2,500 Buffer if Confirmations &lt; 70%
          </span>
        </div>

        <h3 className="font-display font-extrabold text-2xl text-[#261A23]">
          Pre-Event Drop-off Defense & Geo-Targeting War Room
        </h3>

        <p className="text-xs text-[#261A23]/80 leading-relaxed font-body">
          Indian students face high drop-off between registration and in-person attendance due to distance, exam clashes, and traffic. This panel models dynamic hyper-local Meta ad boosting to plug turnout gaps.
        </p>
      </div>

      {/* Confirmation Slider & Buffer Status Banner */}
      <div className="bg-white p-5 rounded-2xl brutal-border brutal-shadow space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b pb-3">
          <div>
            <h4 className="font-display font-bold text-base text-[#261A23]">
              Simulate T-48h Attendance Confirmation Rate
            </h4>
            <p className="text-xs text-gray-500 font-mono">
              Drag slider to test trigger thresholds (Target: 385 / 550 = 70%)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-2xl text-[#261A23] tabular-nums">
              {warRoomConfirmations}
            </span>
            <span className="text-xs font-mono text-gray-500">/ 550 ({Math.round((warRoomConfirmations / 550) * 100)}%)</span>
          </div>
        </div>

        {/* Interactive Slider */}
        <div className="space-y-1">
          <input
            type="range"
            min="250"
            max="450"
            value={warRoomConfirmations}
            onChange={(e) => setWarRoomConfirmations(Number(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#944F62]"
          />
          <div className="flex justify-between text-[10px] font-mono text-gray-500">
            <span>250 (Critical Deficit)</span>
            <span className="font-bold text-[#944F62]">385 (70% Target Threshold)</span>
            <span>450 (Capacity Peak)</span>
          </div>
        </div>

        {/* Trigger Status Alert */}
        <div
          className={`p-4 rounded-xl border-2 flex items-center justify-between ${
            isBufferTriggered
              ? 'bg-red-50 border-red-500 text-red-950'
              : 'bg-emerald-50 border-emerald-500 text-emerald-950'
          }`}
        >
          <div className="flex items-center gap-3">
            {isBufferTriggered ? (
              <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            )}
            <div>
              <h5 className="font-display font-extrabold text-sm">
                {isBufferTriggered ? `BUFFER TRIGGERED: Gap of ${gap} Confirmations` : 'ATTENDANCE ON TRACK (≥ 70%)'}
              </h5>
              <p className="text-xs">
                {isBufferTriggered
                  ? `Current rate is ${Math.round((warRoomConfirmations / 550) * 100)}%. Release ₹2,500 Meta geo-boost in high-priority zones.`
                  : `Current rate is ${Math.round((warRoomConfirmations / 550) * 100)}%. No emergency buffer draw required.`}
              </p>
            </div>
          </div>

          {isBufferTriggered && !warRoomBufferDeployed && (
            <button
              onClick={deployWarRoomBuffer}
              className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg brutal-shadow-sm cursor-pointer whitespace-nowrap"
            >
              Deploy Buffer (₹{warRoomBudgetAmount})
            </button>
          )}

          {warRoomBufferDeployed && (
            <span className="px-3 py-1.5 text-xs font-mono font-bold bg-emerald-600 text-white rounded-lg">
              ✓ Buffer Live (+{modeledExtraConfirmations} Projected)
            </span>
          )}
        </div>
      </div>

      {/* Two Column Section: Zone Heat Table & Boost Planner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Zone Heat Table */}
        <div className="bg-white p-5 rounded-2xl brutal-border brutal-shadow space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="font-display font-bold text-base text-[#261A23]">
              NCR Zone Heat & Drop-off Table
            </h4>
            <span className="text-[10px] font-mono text-gray-500">8 Regions</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#261A23] text-white font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-2">Zone</th>
                  <th className="p-2">Regs</th>
                  <th className="p-2">Conf</th>
                  <th className="p-2">% Rate</th>
                  <th className="p-2">Transit</th>
                  <th className="p-2">Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {zoneAnalysis.map((z) => {
                  const pct = Math.round((z.conf / z.regs) * 100);
                  const isSelected = warRoomSelectedZones.includes(z.zone.split(' ')[0]);
                  return (
                    <tr key={z.zone} className="hover:bg-gray-50">
                      <td className="p-2 font-medium text-[#261A23] truncate max-w-[140px]">{z.zone}</td>
                      <td className="p-2 font-mono">{z.regs}</td>
                      <td className="p-2 font-mono font-bold">{z.conf}</td>
                      <td className="p-2 font-mono">
                        <span className={pct < 65 ? 'text-red-600 font-bold' : 'text-emerald-700'}>
                          {pct}%
                        </span>
                      </td>
                      <td className="p-2 font-mono text-[10px] text-gray-500">{z.distance}</td>
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleWarRoomZone(z.zone.split(' ')[0])}
                          className="accent-[#944F62] cursor-pointer"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Boost Planner & Editable Meta Assumptions */}
        <div className="bg-white p-5 rounded-2xl brutal-border brutal-shadow space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="font-display font-bold text-base text-[#261A23]">
              Editable Meta Ad Modeling Engine
            </h4>
            <span className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 rounded">
              Guesstimate Formula
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label className="block text-[10px] font-mono text-gray-500 mb-1">CPM (₹/1k Impr)</label>
              <input
                type="number"
                value={warRoomCPM}
                onChange={(e) => setWarRoomCPM(Number(e.target.value))}
                className="w-full p-1.5 border-2 border-[#261A23] rounded-lg font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-500 mb-1">CTR (%)</label>
              <input
                type="number"
                step="0.1"
                value={warRoomCTR}
                onChange={(e) => setWarRoomCTR(Number(e.target.value))}
                className="w-full p-1.5 border-2 border-[#261A23] rounded-lg font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-500 mb-1">Click-to-Confirm (%)</label>
              <input
                type="number"
                step="0.5"
                value={warRoomConversion}
                onChange={(e) => setWarRoomConversion(Number(e.target.value))}
                className="w-full p-1.5 border-2 border-[#261A23] rounded-lg font-mono font-bold"
              />
            </div>
          </div>

          {/* Budget & Radius Selector */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="block text-[10px] font-mono text-gray-500 mb-1">Buffer Budget</span>
              <div className="flex gap-2">
                {[2500, 5000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setWarRoomBudgetAmount(amt as 2500 | 5000)}
                    className={`flex-1 py-1.5 rounded-lg border-2 border-[#261A23] font-mono font-bold cursor-pointer ${
                      warRoomBudgetAmount === amt ? 'bg-[#944F62] text-white' : 'bg-gray-50'
                    }`}
                  >
                    ₹{amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-[10px] font-mono text-gray-500 mb-1">Geo Radius</span>
              <div className="flex gap-1.5">
                {([5, 10, 20] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRadiusKm(r)}
                    className={`flex-1 py-1.5 rounded-lg border-2 border-[#261A23] font-mono font-bold cursor-pointer ${
                      radiusKm === r ? 'bg-[#261A23] text-white' : 'bg-gray-50'
                    }`}
                  >
                    {r}km
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Modeled Output Preview */}
          <div className="p-3 bg-[#FBF6F0] rounded-xl border border-[#261A23]/20 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-gray-600">Est. Impressions:</span>
              <span className="font-bold">{impressions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Est. Clicks:</span>
              <span className="font-bold">{clicks}</span>
            </div>
            <div className="flex justify-between text-[#944F62]">
              <span className="font-bold">Modeled Extra Confirmations:</span>
              <span className="font-bold text-sm">+{modeledExtraConfirmations}</span>
            </div>
            <div className="flex justify-between border-t pt-1 font-bold text-[#261A23]">
              <span>Projected New Attendance:</span>
              <span>{projectedTotalConfirmations} ({projectedPct}%)</span>
            </div>
          </div>
        </div>

      </div>

      {/* Influencer Board (Sort by best converting) */}
      <div className="bg-white p-5 rounded-2xl brutal-border brutal-shadow space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <div>
            <h4 className="font-display font-bold text-base text-[#261A23]">
              Campus Nano-Influencer Attribution Board (10 Audited Creators)
            </h4>
            <p className="text-xs text-gray-500">
              Filtered for &lt;10% fake followers; track attributed registrations and boost top converting reels.
            </p>
          </div>
          <span className="text-[10px] font-mono text-gray-500">₹10k Nano Budget</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {influencers.slice(0, 6).map((inf) => {
            const isPicked = selectedInfluencerIds.includes(inf.id);
            return (
              <div
                key={inf.id}
                className={`p-3.5 rounded-xl border-2 transition-all space-y-2 ${
                  isPicked ? 'bg-[#FBF6F0] border-[#944F62] brutal-shadow-sm' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-display font-bold text-xs text-[#261A23]">
                      {inf.name}
                    </h5>
                    <span className="text-[10px] font-mono text-[#944F62]">
                      {inf.handle}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    {inf.conversionRate} Conv
                  </span>
                </div>

                <div className="text-[11px] text-gray-600 line-clamp-1 italic">
                  "{inf.topReelTitle}"
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 border-t pt-1.5">
                  <span>{inf.followers} followers</span>
                  <span className="font-bold text-[#261A23]">{inf.attributedRegs} regs attributed</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
