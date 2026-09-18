import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Plug,
  BarChart3,
  BrainCircuit,
  AlertTriangle,
  Lightbulb,
  Cpu,
  Settings,
  Zap,
  Leaf,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { DataMode } from '../types';

export type PageId =
  | 'dashboard'
  | 'live'
  | 'appliances'
  | 'analytics'
  | 'ai'
  | 'alerts'
  | 'recommendations'
  | 'hardware'
  | 'settings'
  | 'landing';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  activeAlertCount: number;
  dataMode: DataMode;
  onChangeDataMode: (mode: DataMode) => void;
  onOpenLanding: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  activeAlertCount,
  dataMode,
  onChangeDataMode,
  onOpenLanding,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'dashboard' as PageId, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live' as PageId, label: 'Live Monitoring', icon: Activity, badge: 'LIVE' },
    { id: 'appliances' as PageId, label: 'Appliances', icon: Plug },
    { id: 'analytics' as PageId, label: 'Analytics', icon: BarChart3 },
    { id: 'ai' as PageId, label: 'AI Intelligence', icon: BrainCircuit, highlight: true },
    { id: 'alerts' as PageId, label: 'Alerts', icon: AlertTriangle, count: activeAlertCount },
    { id: 'recommendations' as PageId, label: 'Recommendations', icon: Lightbulb },
    { id: 'hardware' as PageId, label: 'Hardware & IoT', icon: Cpu, badge: 'ESP32' },
    { id: 'settings' as PageId, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div
          id="mobile-sidebar-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-stone-900/30 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        id="ecomind-sidebar"
        aria-label="Sidebar navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-stone-200/80 bg-white shadow-xs transition-transform duration-300 lg:static lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header with EnerVerse-inspired styling */}
        <div className="border-b border-stone-200/60 px-5 py-5 bg-linear-to-b from-[#F6F9F5] to-white">
          <div className="flex items-center gap-3">
            {/* Custom EnerVerse-style Leaf Emblem */}
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#2E763B] to-[#081B13] text-white shadow-xs ring-2 ring-emerald-600/20">
              <Leaf className="h-5 w-5 text-[#A6F768]" />
              <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#A6F768] animate-enerverse-breathe" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Outfit',sans-serif] text-xl font-extrabold tracking-tight text-[#081B13]">
                  ECO<span className="text-[#2E763B]">MIND</span>
                </span>
                <span className="rounded-md border border-[#2E763B]/20 bg-[#2E763B]/10 px-1.5 py-0.2 text-[9px] font-bold text-[#081B13] uppercase tracking-wider">
                  IoT Clean-Tech
                </span>
              </div>
              <p className="text-[9px] font-extrabold tracking-[0.18em] text-[#14291E] uppercase mt-0.5">
                POWERING HOMES. PROTECTING PLANET.
              </p>
            </div>
          </div>
        </div>

        {/* Live ESP32 Hardware Status Chip */}
        <div className="px-4 pt-3 pb-1">
          <div className="rounded-xl border border-emerald-950/10 bg-[#F6F9F5] p-2.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#435147] uppercase tracking-wider">
              <span>Hardware Telemetry</span>
              <span className="flex items-center gap-1 text-[#2E763B]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2E763B] animate-enerverse-breathe" />
                ESP32 Online
              </span>
            </div>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5 font-mono text-[11px] font-semibold text-[#081B13]">
              <div className="rounded-lg bg-white px-2 py-1 border border-stone-200/70">
                <div className="text-[9px] text-stone-400 font-sans font-medium">Grid RMS</div>
                <div>231.2 V</div>
              </div>
              <div className="rounded-lg bg-white px-2 py-1 border border-stone-200/70">
                <div className="text-[9px] text-stone-400 font-sans font-medium">Sampling</div>
                <div>1 kHz True</div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Source Mode Switcher */}
        <div className="px-4 pt-2 pb-1">
          <div className="rounded-xl bg-stone-100/90 p-1">
            <div className="text-[9px] font-bold tracking-wider text-stone-600 uppercase px-2 py-0.5">
              Data Pipeline Mode
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1">
              {(['LIVE DATA', 'DEMO DATA', 'PREDICTED DATA'] as DataMode[]).map((mode) => (
                <button
                  key={mode}
                  id={`mode-btn-${mode.toLowerCase().replace(' ', '-')}`}
                  onClick={() => onChangeDataMode(mode)}
                  className={`rounded-lg py-1 text-[10px] font-semibold transition-all cursor-pointer ${
                    dataMode === mode
                      ? 'bg-white text-[#2E763B] shadow-2xs font-bold ring-1 ring-emerald-600/20'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {mode === 'LIVE DATA' ? 'Live ESP' : mode === 'DEMO DATA' ? 'Demo' : 'Forecast'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => {
                  onSelectPage(item.id);
                  onCloseMobile();
                }}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-100 text-stone-500 group-hover:bg-emerald-100/60 group-hover:text-emerald-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                        item.badge === 'LIVE'
                          ? 'animate-pulse bg-emerald-100 text-emerald-700'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-white shadow-xs">
                      {item.count}
                    </span>
                  )}
                  {isActive && <ChevronRight className="h-4 w-4 text-emerald-600" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Sustainability & Landing Callout Box with EnerVerse Card Aesthetic */}
        <div className="border-t border-stone-200/60 p-4 bg-[#F6F9F5]/60">
          <div className="enerverse-card p-3.5 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2E763B] text-white shadow-2xs">
                  <Leaf className="h-4 w-4 text-[#A6F768]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#081B13]">Eco-Index: 92/100</div>
                  <div className="text-[10px] font-semibold text-[#2E763B]">Grade A+ Certified</div>
                </div>
              </div>
              <span className="rounded-md border border-emerald-700/20 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-[#2E763B]">
                -12% CO₂
              </span>
            </div>

            <p className="mt-2 text-[11px] leading-relaxed text-[#435147]">
              Hardware True RMS + SARIMAX forecasting deployed on local ESP32 controller.
            </p>

            <button
              id="btn-open-landing"
              onClick={onOpenLanding}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-stone-300/80 bg-white py-2 text-xs font-bold text-[#081B13] shadow-2xs transition hover:border-[#2E763B] hover:text-[#2E763B] cursor-pointer"
            >
              <span>Explore Clean-Tech Ecosystem</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
