import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Filter,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  X,
  Search,
} from 'lucide-react';
import { AlertItem } from '../types';

interface AlertsPageProps {
  alerts: AlertItem[];
  onInvestigate: (id: string) => void;
  onDismiss: (id: string) => void;
  onNavigateToAppliances: () => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts,
  onInvestigate,
  onDismiss,
  onNavigateToAppliances,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [investigatingAlert, setInvestigatingAlert] = useState<AlertItem | null>(null);

  const filteredAlerts =
    filterSeverity === 'all'
      ? alerts
      : alerts.filter((a) => a.severity === filterSeverity || (filterSeverity === 'resolved' && a.status === 'resolved'));

  const getSeverityBadge = (severity: string, status: string) => {
    if (status === 'resolved') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
          <CheckCircle2 className="h-3 w-3" />
          Resolved
        </span>
      );
    }
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-800">
            <AlertCircle className="h-3 w-3" />
            Critical
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
            <AlertTriangle className="h-3 w-3" />
            Warning
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-0.5 text-[10px] font-bold text-teal-800">
            <Info className="h-3 w-3" />
            Information
          </span>
        );
    }
  };

  const activeCount = alerts.filter((a) => a.status === 'active').length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900">
                System Anomaly & Safety Alerts
              </h2>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                {activeCount} Active
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Continuous electrical threshold telemetry, over-current safeguards, and AI pattern monitoring.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-stone-100 p-1">
            {(['all', 'warning', 'info', 'resolved'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                  filterSeverity === sev
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Positive System Status Banner */}
      <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs text-emerald-950">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-emerald-950 uppercase tracking-wide">
              SYSTEM NORMAL & CIRCUIT MONITORING ENGAGED
            </span>
            <p className="text-emerald-800 text-[11px] mt-0.5">
              All other monitored appliances and high-voltage circuits are operating within expected thermodynamic and electrical limits.
            </p>
          </div>
        </div>
        <span className="font-mono text-[11px] text-emerald-700 hidden md:inline">
          Isolation Rating: 2.5 kV
        </span>
      </div>

      {/* Categorized Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isWarning = alert.severity === 'warning';
          const isResolved = alert.status === 'resolved';

          return (
            <div
              key={alert.id}
              className={`rounded-2xl border p-5 transition-all shadow-xs ${
                isResolved
                  ? 'border-stone-200 bg-stone-50/40 opacity-75'
                  : isWarning
                  ? 'border-amber-300 bg-white ring-1 ring-amber-200'
                  : 'border-stone-200 bg-white'
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(alert.severity, alert.status)}
                    <span className="text-xs text-stone-400 font-medium">{alert.timestamp}</span>
                  </div>

                  <h3 className="font-['Outfit',sans-serif] text-base font-bold text-stone-900 mt-2">
                    {alert.message}
                  </h3>
                  <div className="text-xs font-semibold text-stone-700">
                    Appliance: {alert.device} • Location: {alert.room}
                  </div>
                </div>

                {/* Status Action Buttons */}
                {!isResolved && (
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      id={`btn-investigate-${alert.id}`}
                      onClick={() => setInvestigatingAlert(alert)}
                      className="rounded-xl bg-stone-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-stone-800 transition shadow-xs"
                    >
                      Investigate
                    </button>
                    <button
                      id={`btn-dismiss-${alert.id}`}
                      onClick={() => onDismiss(alert.id)}
                      className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>

              {/* Data comparison matrix */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="rounded-xl bg-stone-50 p-2.5 border border-stone-100">
                  <span className="text-[10px] text-stone-400 font-medium">Measured Value</span>
                  <div className="font-mono font-bold text-stone-900 text-sm mt-0.5">
                    {alert.actual_value}
                  </div>
                </div>
                <div className="rounded-xl bg-stone-50 p-2.5 border border-stone-100">
                  <span className="text-[10px] text-stone-400 font-medium">Expected Value</span>
                  <div className="font-mono font-bold text-stone-600 text-sm mt-0.5">
                    {alert.expected_value}
                  </div>
                </div>
                <div className="rounded-xl bg-stone-50 p-2.5 border border-stone-100">
                  <span className="text-[10px] text-stone-400 font-medium">Difference</span>
                  <div className="font-bold text-amber-700 text-sm mt-0.5">
                    {alert.difference}
                  </div>
                </div>
              </div>

              {/* AI Explanation & Recommended Action */}
              <div className="mt-4 space-y-2 rounded-xl bg-stone-50/70 p-3.5 border border-stone-100 text-xs">
                <div>
                  <span className="font-bold text-stone-800 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                    AI Diagnostic Analysis:
                  </span>
                  <p className="mt-0.5 text-stone-600 leading-relaxed pl-5">
                    {alert.ai_explanation}
                  </p>
                </div>
                <div className="pt-2 border-t border-stone-200/60">
                  <span className="font-bold text-emerald-900">Recommended Action: </span>
                  <span className="text-stone-700">{alert.recommended_action}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Investigation Modal */}
      {investigatingAlert && (
        <div
          id="investigation-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl">
            <button
              onClick={() => setInvestigatingAlert(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider">
                  Deep Circuit Investigation
                </span>
                <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-stone-900">
                  {investigatingAlert.device} ({investigatingAlert.room})
                </h3>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <p className="text-stone-600 leading-relaxed">
                The AI isolation forest algorithm flagged this circuit based on a 42% deviation above its rolling 14-day evening baseline. Voltage remained steady at 231.2V while current surged to 0.31A, indicating resistive drag or continuous top-speed operation.
              </p>

              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 text-amber-950">
                <div className="font-bold">Next Recommended Engineering Steps:</div>
                <ul className="mt-1 list-disc pl-4 space-y-1 text-stone-700">
                  <li>Check mechanical shaft/bearing friction on the fan motor.</li>
                  <li>Verify that the electronic step regulator is not bypassing resistances.</li>
                  <li>Optionally engage Remote Load Control to switch off the circuit remotely.</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-3 border-t border-stone-100">
              <button
                onClick={() => {
                  setInvestigatingAlert(null);
                  onNavigateToAppliances();
                }}
                className="flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 text-xs"
              >
                <span>Go to Remote Load Control</span>
                <ArrowRight className="h-3 w-3" />
              </button>

              <button
                onClick={() => setInvestigatingAlert(null)}
                className="rounded-xl bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800 transition"
              >
                Close Investigation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
