import React, { useState } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  Sliders,
  Bell,
  Sun,
  Moon,
  Layers,
  ShieldAlert,
  Leaf,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { TariffSettings, DataMode } from '../types';

interface SettingsPageProps {
  tariff: TariffSettings;
  dataMode: DataMode;
  onUpdateTariff: (newTariff: Partial<TariffSettings>) => void;
  onChangeDataMode: (mode: DataMode) => void;
  onShowToast: (title: string, msg: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  tariff,
  dataMode,
  onUpdateTariff,
  onChangeDataMode,
  onShowToast,
}) => {
  const [rate, setRate] = useState<number>(tariff.rate_per_kwh);
  const [currency, setCurrency] = useState<string>(tariff.currency_symbol);
  const [refreshSec, setRefreshSec] = useState<number>(tariff.refresh_interval_sec);
  const [ecoMode, setEcoMode] = useState<boolean>(tariff.eco_mode_active);
  const [budgetMonthly, setBudgetMonthly] = useState<number>(tariff.budget_monthly_kwh);

  // Notification state
  const [notifyAnomaly, setNotifyAnomaly] = useState(true);
  const [notifyPeak, setNotifyPeak] = useState(true);
  const [notifyStandby, setNotifyStandby] = useState(true);

  const handleSaveTariff = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTariff({
      rate_per_kwh: Number(rate),
      currency_symbol: currency,
      refresh_interval_sec: Number(refreshSec),
      eco_mode_active: ecoMode,
      budget_monthly_kwh: Number(budgetMonthly),
    });
    onShowToast('Configuration Saved', `Electricity tariff updated to ${currency}${rate}/kWh. Calculations synchronized.`);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 max-w-4xl">
      {/* Header */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-800">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900">
              System Settings & Tariff Calibration
            </h2>
            <p className="text-xs text-stone-500">
              Configure billing rates, IoT polling intervals, eco-mode thresholds, and alert notifications.
            </p>
          </div>
        </div>
      </div>

      {/* TARIFF CONFIGURATION FORM */}
      <form onSubmit={handleSaveTariff} className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs space-y-6">
        <div className="pb-3 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="font-['Outfit',sans-serif] text-base font-bold text-stone-900">
              Electricity Tariff & Billing Rules
            </h3>
            <p className="text-xs text-stone-500">Determines financial conversion for all measured watt-hours</p>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
            Current: ₹{tariff.rate_per_kwh} / kWh
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Base Electricity Tariff Rate (per kWh)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs font-bold text-stone-400">
                {currency}
              </span>
              <input
                type="number"
                step="0.5"
                min="1"
                max="50"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full rounded-xl border border-stone-200 pl-8 pr-4 py-2 text-xs font-semibold text-stone-900 focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-1">Default benchmark rate is ₹6 / kWh.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Monthly Household Target Budget (kWh)
            </label>
            <input
              type="number"
              value={budgetMonthly}
              onChange={(e) => setBudgetMonthly(Number(e.target.value))}
              className="w-full rounded-xl border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-900 focus:border-emerald-500 focus:outline-hidden"
            />
            <p className="text-[11px] text-stone-400 mt-1">Triggers cautionary alerts at 85% consumption.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              IoT Sensor Polling / Refresh Rate
            </label>
            <select
              value={refreshSec}
              onChange={(e) => setRefreshSec(Number(e.target.value))}
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-900 focus:border-emerald-500 focus:outline-hidden"
            >
              <option value={1}>1 Second (High Resolution / Stress Test)</option>
              <option value={2}>2 Seconds (Standard Laboratory Polling)</option>
              <option value={5}>5 Seconds (Low Bandwidth Battery Saver)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Data Pipeline Source
            </label>
            <select
              value={dataMode}
              onChange={(e) => onChangeDataMode(e.target.value as DataMode)}
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-900 focus:border-emerald-500 focus:outline-hidden"
            >
              <option value="LIVE DATA">LIVE DATA (Simulated ESP32 Stream)</option>
              <option value="DEMO DATA">DEMO DATA (Evaluation Benchmarks)</option>
              <option value="PREDICTED DATA">PREDICTED DATA (SARIMAX Forecast Mode)</option>
            </select>
          </div>
        </div>

        {/* Eco-Mode Switch */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-950">Autonomous Eco-Mode Active</div>
              <p className="text-[11px] text-emerald-800">
                Automatically flags standby loads and prioritizes low-tariff off-peak duty cycles.
              </p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={ecoMode}
            onChange={(e) => setEcoMode(e.target.checked)}
            className="h-5 w-5 rounded-md text-emerald-600 focus:ring-emerald-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs transition"
          >
            <Save className="h-4 w-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* NOTIFICATION PREFERENCES */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs space-y-4">
        <div className="pb-3 border-b border-stone-100 flex items-center gap-2">
          <Bell className="h-4 w-4 text-stone-500" />
          <h3 className="font-['Outfit',sans-serif] text-base font-bold text-stone-900">
            Notification & Anomaly Triggers
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl border border-stone-100 bg-stone-50/60 hover:bg-stone-50 transition cursor-pointer">
            <div>
              <div className="font-bold text-stone-900">Over-Current & Thermal Surge Alerts</div>
              <div className="text-stone-500 text-[11px]">Instant alert if circuit draw exceeds 3σ deviation.</div>
            </div>
            <input
              type="checkbox"
              checked={notifyAnomaly}
              onChange={(e) => setNotifyAnomaly(e.target.checked)}
              className="h-4 w-4 rounded text-emerald-600"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-stone-100 bg-stone-50/60 hover:bg-stone-50 transition cursor-pointer">
            <div>
              <div className="font-bold text-stone-900">Peak Tariff Advisory (18:00 - 22:00)</div>
              <div className="text-stone-500 text-[11px]">Reminder to shed non-essential motorized loads.</div>
            </div>
            <input
              type="checkbox"
              checked={notifyPeak}
              onChange={(e) => setNotifyPeak(e.target.checked)}
              className="h-4 w-4 rounded text-emerald-600"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-stone-100 bg-stone-50/60 hover:bg-stone-50 transition cursor-pointer">
            <div>
              <div className="font-bold text-stone-900">Night Phantom Load Warning</div>
              <div className="text-stone-500 text-[11px]">Alert when idle chargers or docks draw &gt;10W past 11 PM.</div>
            </div>
            <input
              type="checkbox"
              checked={notifyStandby}
              onChange={(e) => setNotifyStandby(e.target.checked)}
              className="h-4 w-4 rounded text-emerald-600"
            />
          </label>
        </div>
      </div>

      {/* SUSTAINABILITY & LIGHT THEME ASSURANCE */}
      <div className="rounded-2xl border border-emerald-200/90 bg-linear-to-r from-emerald-50/70 to-teal-50/50 p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <Sun className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-['Outfit',sans-serif] text-sm font-bold text-emerald-950">
              Design Standard: Eco-Friendly Light Theme
            </h4>
            <p className="text-xs text-stone-600 mt-0.5">
              High-contrast sustainable layout optimized for readability, clean white/stone surfaces, and minimal visual fatigue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
