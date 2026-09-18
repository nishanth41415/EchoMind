import React from 'react';
import {
  Zap,
  Leaf,
  Activity,
  Cpu,
  Cloud,
  BrainCircuit,
  LayoutDashboard,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface LandingPageProps {
  onEnterDashboard: () => void;
  onExploreHardware: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterDashboard,
  onExploreHardware,
}) => {
  return (
    <div
      id="landing-hero-container"
      className="min-h-screen bg-[#F8FAF8] text-stone-900 flex flex-col justify-between selection:bg-emerald-200"
    >
      {/* Top Navigation Bar */}
      <header className="border-b border-stone-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-100">
              <Leaf className="h-5 w-5 text-emerald-100" />
              <Zap className="absolute h-4 w-4 fill-white text-white drop-shadow-xs" />
            </div>
            <div>
              <span className="font-['Outfit',sans-serif] text-xl font-bold tracking-tight text-stone-900">
                Eco<span className="text-emerald-600">Mind</span>
              </span>
              <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-600/20">
                IoT Energy Intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExploreHardware}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition shadow-2xs"
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>ESP32 Architecture</span>
            </button>
            <button
              onClick={onEnterDashboard}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm transition"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 lg:py-16 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-1 text-xs font-bold text-emerald-800 mb-6 shadow-2xs">
            <Leaf className="h-3.5 w-3.5 text-emerald-600" />
            <span>Sustainability-First IoT Architecture • College Engineering Prototype</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="font-['Outfit',sans-serif] text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-900 leading-[1.1]">
            Understand Your <span className="text-emerald-600">Energy.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-stone-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Monitor every watt. Predict tomorrow&apos;s consumption. Make smarter decisions with AI.
          </p>

          <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            &ldquo;Measure. Predict. Optimize.&rdquo;
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              id="cta-open-dashboard"
              onClick={onEnterDashboard}
              className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-7 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition hover:shadow-lg"
            >
              <Zap className="h-4 w-4" />
              <span>Open Energy Dashboard</span>
            </button>
            <button
              id="cta-explore-system"
              onClick={onExploreHardware}
              className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-6 py-3.5 text-sm font-bold text-stone-700 shadow-2xs hover:bg-stone-50 transition"
            >
              <Cpu className="h-4 w-4 text-emerald-600" />
              <span>Explore System Hardware</span>
            </button>
          </div>
        </div>

        {/* FUTURISTIC HOUSE ENERGY VISUALIZATION */}
        <div className="mt-14 rounded-3xl border border-emerald-200/90 bg-linear-to-b from-white via-emerald-50/30 to-teal-50/30 p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              PHYSICAL TO CLOUD CLOSED-LOOP TOPOLOGY
            </span>
            <h3 className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900 mt-1">
              End-to-End IoT Energy Pipeline
            </h3>
            <p className="text-xs text-stone-500 max-w-xl mx-auto mt-1">
              Continuous sampling from appliance sensors to ESP32 microcontroller, encrypted Wi-Fi transport, time-series storage, and autonomous AI recommendations.
            </p>
          </div>

          {/* 5-Node Interactive Flow Visualization */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
            {/* Node 1: Sensors */}
            <div className="rounded-2xl border border-stone-200 bg-white/95 p-5 text-center shadow-xs backdrop-blur-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mx-auto">
                <Activity className="h-6 w-6" />
              </div>
              <div className="mt-3 font-bold text-stone-900 text-sm">1. Sensors</div>
              <div className="text-xs text-stone-500 mt-0.5">ZMPT101B + ACS712</div>
              <span className="mt-2 inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                1 kHz True RMS
              </span>
            </div>

            {/* Node 2: ESP32 */}
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50/50 p-5 text-center shadow-xs ring-2 ring-emerald-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white mx-auto shadow-xs">
                <Cpu className="h-6 w-6" />
              </div>
              <div className="mt-3 font-bold text-stone-900 text-sm">2. ESP32 MCU</div>
              <div className="text-xs text-stone-500 mt-0.5">Dual-Core 240MHz</div>
              <span className="mt-2 inline-block text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                FreeRTOS ADC
              </span>
            </div>

            {/* Node 3: Cloud & Wi-Fi */}
            <div className="rounded-2xl border border-stone-200 bg-white/95 p-5 text-center shadow-xs backdrop-blur-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mx-auto">
                <Cloud className="h-6 w-6" />
              </div>
              <div className="mt-3 font-bold text-stone-900 text-sm">3. Cloud Gateway</div>
              <div className="text-xs text-stone-500 mt-0.5">TimescaleDB / MQTT</div>
              <span className="mt-2 inline-block text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                Telemetry Lake
              </span>
            </div>

            {/* Node 4: AI Engine */}
            <div className="rounded-2xl border border-stone-200 bg-white/95 p-5 text-center shadow-xs backdrop-blur-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 mx-auto">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <div className="mt-3 font-bold text-stone-900 text-sm">4. AI Engine</div>
              <div className="text-xs text-stone-500 mt-0.5">SARIMAX & Anomaly</div>
              <span className="mt-2 inline-block text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                94% Confidence
              </span>
            </div>

            {/* Node 5: Dashboard */}
            <div className="rounded-2xl border border-emerald-300 bg-white p-5 text-center shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 mx-auto">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <div className="mt-3 font-bold text-stone-900 text-sm">5. Dashboard</div>
              <div className="text-xs text-stone-500 mt-0.5">Relay & Analytics</div>
              <span className="mt-2 inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Live Interface
              </span>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-8 pt-6 border-t border-stone-200/70 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold font-['Outfit',sans-serif] text-stone-900">4.82 kWh</div>
              <div className="text-xs text-stone-500 font-medium">Daily Consumption</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-['Outfit',sans-serif] text-emerald-700">₹28.92</div>
              <div className="text-xs text-stone-500 font-medium">Estimated Daily Cost</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-['Outfit',sans-serif] text-teal-700">3.95 kg</div>
              <div className="text-xs text-stone-500 font-medium">CO₂ Avoided</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-['Outfit',sans-serif] text-stone-900">92 / 100</div>
              <div className="text-xs text-stone-500 font-medium">Grade A+ Eco-Score</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 bg-white py-6 px-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">EcoMind Prototype</span>
            <span>•</span>
            <span>College Engineering Project Demonstration</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400 text-[11px]">
            <span>ESP32 DevKit v1</span>
            <span>•</span>
            <span>ZMPT101B AC Volt</span>
            <span>•</span>
            <span>ACS712 20A Curr</span>
            <span>•</span>
            <span>Relay SPDT</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
