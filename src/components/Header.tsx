import React, { useState, useEffect } from 'react';
import {
  Bell,
  Menu,
  Sparkles,
  Wifi,
  ShieldCheck,
  Clock,
  Leaf,
  X,
  AlertTriangle,
  ArrowRight,
  Bot,
} from 'lucide-react';
import { DataMode, AlertItem } from '../types';
import { PageId } from './Sidebar';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  dataMode: DataMode;
  alerts: AlertItem[];
  onNavigateToAlerts: () => void;
  tariffRate: number;
  currentPage?: PageId;
  onOpenChatbot?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  dataMode,
  alerts,
  onNavigateToAlerts,
  tariffRate,
  currentPage = 'dashboard',
  onOpenChatbot,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const pageMeta: Record<PageId, { title: string; subtitle: string; badge: string }> = {
    dashboard: {
      title: 'Energy Dashboard',
      subtitle: "Real-time consumption, tariffs, and today's summary.",
      badge: 'Overview',
    },
    live: {
      title: 'Live Real-Time Stream',
      subtitle: '1 kHz True RMS sensor telemetry, power factor, and AC waveforms.',
      badge: 'ESP32 Live',
    },
    appliances: {
      title: 'Connected Appliances',
      subtitle: 'Circuit-level power draw and remote optocoupled relay controls.',
      badge: 'Relay Controls',
    },
    analytics: {
      title: 'Energy Analytics & Trends',
      subtitle: 'Historical consumption datasets, baseline modeling, and carbon offsets.',
      badge: 'Analytics',
    },
    ai: {
      title: 'AI Energy Intelligence',
      subtitle: 'SARIMAX predictive load curves and automated anomaly detection.',
      badge: '94% ML Accuracy',
    },
    alerts: {
      title: 'Alerts & Circuit Safety',
      subtitle: 'Anomaly detection flags, threshold triggers, and diagnostic logs.',
      badge: 'Safety Monitor',
    },
    recommendations: {
      title: 'AI Recommendations',
      subtitle: 'Energy-saving optimizations, vampire load reduction, and solar shifts.',
      badge: 'Optimization',
    },
    hardware: {
      title: 'ESP32 Hardware & IoT',
      subtitle: 'Circuit schematic, ADC sampling pins, FreeRTOS tasks, and BOM.',
      badge: 'Hardware Node',
    },
    settings: {
      title: 'System Settings',
      subtitle: 'Tariff calibration, sensor polling frequency, and data pipeline.',
      badge: 'Configuration',
    },
    landing: {
      title: 'EcoMind IoT',
      subtitle: 'Smarter Energy. Smarter Living.',
      badge: 'Home',
    },
  };

  const currentMeta = pageMeta[currentPage] || pageMeta.dashboard;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setDateStr(
        now.toLocaleDateString([], {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeAlerts = alerts.filter((a) => a.status === 'active');

  return (
    <header className="sticky top-0 z-30 border-b border-emerald-950/10 bg-white/95 backdrop-blur-md shadow-2xs">
      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        {/* Left greeting & mobile button */}
        <div className="flex items-center gap-3">
          <button
            id="btn-mobile-menu"
            onClick={onToggleMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 text-[#081B13] hover:bg-stone-50 lg:hidden cursor-pointer"
            aria-label="Toggle navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Outfit',sans-serif] text-xl font-extrabold tracking-tight text-[#081B13] sm:text-2xl">
                {currentMeta.title}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-[#2E763B]/20 bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-[#2E763B]">
                <Leaf className="h-3 w-3 text-[#2E763B]" />
                {currentMeta.badge}
              </span>
            </div>
            <p className="text-xs text-[#435147] sm:text-sm font-medium">
              {currentMeta.subtitle}
            </p>
          </div>
        </div>

        {/* Right actions: Chatbot Button, live clock, ESP32 status, Tariff, Notifications */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Ask AI Chatbot Trigger Button */}
          {onOpenChatbot && (
            <button
              id="header-open-chatbot"
              onClick={onOpenChatbot}
              className="flex items-center gap-1.5 rounded-xl bg-[#081B13] hover:bg-[#14291E] px-3.5 py-2 text-xs font-bold text-white shadow-xs border border-emerald-600/30 transition cursor-pointer hover:shadow-sm"
              title="Open EcoMind AI Energy Chatbot"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#A6F768] animate-pulse" />
              <span className="hidden xs:inline">Ask</span>
              <span>EcoMind AI</span>
            </button>
          )}

          {/* Real-time Clock */}
          <div className="hidden md:flex items-center gap-1.5 rounded-xl border border-emerald-950/10 bg-[#F6F9F5] px-3 py-1.5 text-xs text-[#435147]">
            <Clock className="h-3.5 w-3.5 text-stone-400" />
            <span className="font-medium">{dateStr}</span>
            <span className="text-stone-300">|</span>
            <span className="font-mono font-bold text-[#081B13]">{timeStr}</span>
          </div>

          {/* ESP32 Hardware Status */}
          <div className="flex items-center gap-2 rounded-xl border border-emerald-900/15 bg-emerald-50/80 px-3 py-1.5 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#A6F768] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2E763B] animate-enerverse-breathe"></span>
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#081B13]">
              <Wifi className="h-3 w-3 text-[#2E763B]" />
              <span>ESP32 Node: 50Hz True RMS</span>
            </div>
          </div>

          {/* Current Tariff Rate Pill */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-xl border border-emerald-950/10 bg-white px-3 py-1.5 text-xs text-[#435147] shadow-2xs">
            <span className="text-stone-400 font-semibold">Tariff:</span>
            <span className="font-mono font-bold text-[#081B13]">₹{tariffRate}/kWh</span>
          </div>

          {/* Notifications / Alerts Popover Toggle */}
          <div className="relative">
            <button
              id="btn-notification-bell"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 shadow-2xs transition hover:bg-stone-50 hover:text-stone-900 cursor-pointer"
              aria-label="View notifications and alerts"
            >
              <Bell className="h-4 w-4" />
              {activeAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {activeAlerts.length}
                </span>
              )}
            </button>

            {/* Notification drop panel */}
            {showNotifications && (
              <div
                id="notifications-dropdown"
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-stone-200 bg-white p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-900 text-sm">System Alerts & Notices</span>
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600 font-medium">
                      {activeAlerts.length} active
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-stone-400 hover:text-stone-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                  {activeAlerts.length === 0 ? (
                    <div className="py-6 text-center text-xs text-stone-500">
                      <ShieldCheck className="h-8 w-8 text-emerald-500 mx-auto mb-1.5 opacity-80" />
                      All monitored circuits operating within green safety parameters.
                    </div>
                  ) : (
                    activeAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-3 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                            <span>{alert.device} ({alert.room})</span>
                          </div>
                          <span className="text-[10px] text-stone-400">{alert.timestamp}</span>
                        </div>
                        <p className="mt-1 text-stone-700">{alert.message}</p>
                        <div className="mt-2 text-[11px] font-medium text-amber-800 bg-amber-100/60 rounded px-2 py-0.5 inline-block">
                          {alert.difference}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-500">Pipeline: {dataMode}</span>
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      onNavigateToAlerts();
                    }}
                    className="flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>View all in Alerts</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
