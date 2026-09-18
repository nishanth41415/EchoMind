import React from 'react';
import { Leaf, Sprout, Sun, Award, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface EcoImpactBannerProps {
  ecoScore?: number;
  carbonAvoidedKg?: number;
  treesEquivalent?: number;
  cleanEnergyRatio?: number;
  onExploreRecommendations?: () => void;
}

export const EcoImpactBanner: React.FC<EcoImpactBannerProps> = ({
  ecoScore = 92,
  carbonAvoidedKg = 3.95,
  treesEquivalent = 2.8,
  cleanEnergyRatio = 74,
  onExploreRecommendations,
}) => {
  return (
    <div
      id="eco-sustainability-banner"
      className="relative overflow-hidden enerverse-card p-5 bg-linear-to-r from-[#F6F9F5] via-white to-[#F6F9F5]"
    >
      {/* Decorative leaf watermarks */}
      <div className="pointer-events-none absolute -right-6 -bottom-6 text-[#2E763B]/10">
        <Leaf className="h-32 w-32 rotate-12" />
      </div>

      <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left message with Eco badge */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2E763B] text-white shadow-xs">
            <Leaf className="h-6 w-6 text-[#A6F768]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-['Outfit',sans-serif] text-base sm:text-lg font-extrabold text-[#081B13]">
                Sustainability & Carbon Reduction Index
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-[#2E763B]/20 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-[#2E763B]">
                <Award className="h-3 w-3" />
                Score: {ecoScore}/100 (A+ Certified)
              </span>
            </div>
            <p className="mt-0.5 text-xs sm:text-sm text-[#435147] max-w-2xl font-medium">
              Real-time ecological ledger: smart ESP32 scheduling and standby elimination have kept domestic consumption 12% below the grid baseline.
            </p>
          </div>
        </div>

        {/* Right metrics pill row */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
          <div className="rounded-xl border border-stone-200/70 bg-white px-3.5 py-2.5 text-center shadow-2xs">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-[#435147]">
              <Leaf className="h-3 w-3 text-[#2E763B]" />
              <span>CO₂ Saved</span>
            </div>
            <div className="mt-0.5 font-['Outfit',sans-serif] text-sm sm:text-base font-extrabold text-[#081B13]">
              {carbonAvoidedKg} kg
            </div>
            <div className="text-[10px] text-[#2E763B] font-bold">↓ 12% vs grid</div>
          </div>

          <div className="rounded-xl border border-stone-200/70 bg-white px-3.5 py-2.5 text-center shadow-2xs">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-[#435147]">
              <Sprout className="h-3 w-3 text-[#2E763B]" />
              <span>Trees Equiv.</span>
            </div>
            <div className="mt-0.5 font-['Outfit',sans-serif] text-sm sm:text-base font-extrabold text-[#081B13]">
              {treesEquivalent}
            </div>
            <div className="text-[10px] text-[#2E763B] font-bold">Seedlings offset</div>
          </div>

          <div className="rounded-xl border border-stone-200/70 bg-white px-3.5 py-2.5 text-center shadow-2xs">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-[#435147]">
              <Sun className="h-3 w-3 text-amber-500" />
              <span>Clean Sync</span>
            </div>
            <div className="mt-0.5 font-['Outfit',sans-serif] text-sm sm:text-base font-extrabold text-[#081B13]">
              {cleanEnergyRatio}%
            </div>
            <div className="text-[10px] text-amber-600 font-bold">Green window</div>
          </div>
        </div>
      </div>
    </div>
  );
};
