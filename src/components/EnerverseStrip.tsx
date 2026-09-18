import React from 'react';
import {
  Leaf,
  Cpu,
  Zap,
  Activity,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { SensorReading, SystemHealth } from '../types';

interface EnerverseStripProps {
  latestReading?: SensorReading;
  systemHealth?: SystemHealth;
  onNavigateToLive?: () => void;
  onNavigateToHardware?: () => void;
}

export const EnerverseStrip: React.FC<EnerverseStripProps> = ({
  latestReading,
  systemHealth,
  onNavigateToLive,
  onNavigateToHardware,
}) => {
  const voltage = latestReading?.voltage ?? 231.2;
  const frequency = latestReading?.frequency ?? 50.0;
  const powerFactor = latestReading?.power_factor ?? 0.98;

  return (
    <div
      id="enerverse-ecosystem-strip"
      className="relative overflow-hidden rounded-2xl border border-emerald-950/10 bg-white/95 px-4 sm:px-6 py-3 shadow-xs backdrop-blur-md transition-all hover:border-emerald-700/25"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 text-xs">
        {/* Left: Statement */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-[#2E763B] to-[#0B2118] text-white shadow-2xs">
            <Leaf className="h-4 w-4 text-[#A6F768]" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-[#081B13] tracking-tight">
              Purpose-Powered Intelligence.
            </span>
            <span className="text-[11px] text-[#435147]">
              Built for real-world circuit safety & measurable reduction.
            </span>
          </div>
        </div>

        {/* Center: Real hardware & ML engineering pillars */}
        <div className="hidden md:flex items-center gap-4 text-[11px] font-semibold text-[#2C4434] overflow-x-auto no-scrollbar">
          <button
            onClick={onNavigateToHardware}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 transition cursor-pointer"
            title="Inspect FreeRTOS ADC sampling pipeline"
          >
            <Cpu className="h-3.5 w-3.5 text-[#2E763B]" />
            <span>1 kHz True RMS (ESP32)</span>
          </button>

          <span className="h-3.5 w-px bg-stone-200" aria-hidden="true" />

          <button
            onClick={onNavigateToLive}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-stone-700 hover:bg-emerald-50 hover:text-emerald-900 transition cursor-pointer"
            title="Inspect AC sine wave integration"
          >
            <Zap className="h-3.5 w-3.5 text-[#2E763B]" />
            <span>Optocoupled Load Shedding</span>
          </button>

          <span className="h-3.5 w-px bg-stone-200" aria-hidden="true" />

          <div className="flex items-center gap-1.5 px-2 py-1 text-stone-700">
            <Sparkles className="h-3.5 w-3.5 text-[#2E763B]" />
            <span>SARIMAX Predictive Bounds</span>
          </div>
        </div>

        {/* Right: Live Grid Frequency & Power Factor Badges */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 rounded-lg border border-emerald-900/10 bg-[#F6F9F5] px-2.5 py-1 font-mono text-[11px] font-semibold text-[#081B13]">
            <span className="h-2 w-2 rounded-full bg-[#2E763B] animate-enerverse-breathe" />
            <span>{voltage.toFixed(1)}V</span>
            <span className="text-stone-400">|</span>
            <span>{frequency.toFixed(1)}Hz</span>
            <span className="text-stone-400">|</span>
            <span className="text-[#2E763B]">PF {powerFactor.toFixed(2)}</span>
          </div>

          <button
            onClick={onNavigateToLive}
            className="group flex items-center gap-1 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 px-2 py-1 text-[11px] font-bold text-emerald-800 transition cursor-pointer"
          >
            <span>Live Stream</span>
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
