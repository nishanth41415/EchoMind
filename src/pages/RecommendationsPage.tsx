import React from 'react';
import {
  Lightbulb,
  CheckCircle2,
  Sparkles,
  TrendingDown,
  Leaf,
  Clock,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { RecommendationItem, TariffSettings } from '../types';

interface RecommendationsPageProps {
  recommendations: RecommendationItem[];
  tariff: TariffSettings;
  onApply: (id: string) => void;
  onDismiss: (id: string) => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({
  recommendations,
  tariff,
  onApply,
  onDismiss,
}) => {
  const pendingRecs = recommendations.filter((r) => r.status !== 'dismissed');

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="rounded-2xl border border-emerald-200/90 bg-linear-to-r from-emerald-50/90 via-white to-teal-50/60 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-100">
                <Lightbulb className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                AI Optimization Hub
              </span>
            </div>
            <h2 className="mt-3 font-['Outfit',sans-serif] text-2xl sm:text-3xl font-bold text-stone-900">
              AI Recommendation Center
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Autonomous energy conservation strategies synthesized from sensor readings and tariff schedules.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-white/95 p-4 shadow-2xs text-center backdrop-blur-xs">
            <span className="text-xs font-semibold text-stone-500 uppercase">
              Total Potential Savings
            </span>
            <div className="mt-1 flex items-baseline justify-center gap-1">
              <span className="text-lg font-bold text-emerald-800">₹</span>
              <span className="font-['Outfit',sans-serif] text-2xl font-bold text-emerald-800">
                315
              </span>
              <span className="text-xs text-stone-500">/month</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700">
              +1.75 kWh/day saved
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pendingRecs.map((rec) => {
          const isApplied = rec.status === 'applied';

          return (
            <div
              key={rec.id}
              className={`flex flex-col justify-between rounded-2xl border p-6 transition-all shadow-xs ${
                isApplied
                  ? 'border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-200'
                  : 'border-stone-200/90 bg-white hover:shadow-md'
              }`}
            >
              <div>
                {/* Header with confidence and impact */}
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 ring-1 ring-emerald-600/20">
                    {rec.confidence}% AI Confidence
                  </span>
                  <span className="text-xs font-semibold text-stone-500">
                    Impact: <strong className="text-stone-800">{rec.impact_level}</strong>
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-stone-900 mt-3 leading-snug">
                  {rec.title}
                </h3>

                {/* Potential savings metrics box */}
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-stone-50 p-3 text-xs border border-stone-100">
                  <div>
                    <span className="text-[10px] font-medium text-stone-400 uppercase">
                      Potential Saving
                    </span>
                    <div className="font-mono font-bold text-emerald-700 text-sm mt-0.5">
                      {rec.estimated_energy_saving}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium text-stone-400 uppercase">
                      Monthly Saving
                    </span>
                    <div className="font-mono font-bold text-stone-900 text-sm mt-0.5">
                      {rec.estimated_cost_saving}
                    </div>
                  </div>
                </div>

                {/* Reason explanation */}
                <div className="mt-4">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                    AI Diagnostic Reason:
                  </span>
                  <p className="mt-1 text-xs text-stone-600 leading-relaxed pl-5">
                    &ldquo;{rec.reason}&rdquo;
                  </p>
                </div>

                {/* Carbon offset badge */}
                <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg">
                  <Leaf className="h-3.5 w-3.5 text-teal-600" />
                  <span>Reduces approx. {rec.carbon_saving_kg} kg CO₂ / month</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                {isApplied ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Rule Applied to Smart Scheduler</span>
                  </div>
                ) : (
                  <>
                    <button
                      id={`btn-apply-rec-${rec.id}`}
                      onClick={() => onApply(rec.id)}
                      className="flex-1 rounded-xl bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs transition"
                    >
                      {rec.action_label || 'Apply Suggestion'}
                    </button>
                    <button
                      id={`btn-dismiss-rec-${rec.id}`}
                      onClick={() => onDismiss(rec.id)}
                      className="rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition"
                    >
                      Dismiss
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
