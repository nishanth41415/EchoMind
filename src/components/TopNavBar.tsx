import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Plug,
  BrainCircuit,
  Cpu,
  BarChart3,
  AlertTriangle,
  Lightbulb,
  Settings,
} from 'lucide-react';
import { PageId } from './Sidebar';

interface TopNavBarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  activeAlertCount: number;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  currentPage,
  onSelectPage,
  activeAlertCount,
}) => {
  const tabs = [
    {
      id: 'dashboard' as PageId,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'live' as PageId,
      label: 'Live Stream',
      icon: Activity,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      id: 'appliances' as PageId,
      label: 'Appliances',
      icon: Plug,
    },
    {
      id: 'ai' as PageId,
      label: 'AI Intel',
      icon: BrainCircuit,
      badge: '94% ML',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    {
      id: 'hardware' as PageId,
      label: 'ESP32',
      icon: Cpu,
      badge: 'IoT',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    },
    {
      id: 'analytics' as PageId,
      label: 'Analytics',
      icon: BarChart3,
    },
    {
      id: 'alerts' as PageId,
      label: 'Alerts',
      icon: AlertTriangle,
      count: activeAlertCount,
    },
    {
      id: 'recommendations' as PageId,
      label: 'Recommendations',
      icon: Lightbulb,
    },
    {
      id: 'settings' as PageId,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <div
      id="top-navigation-bar"
      className="sticky top-[69px] z-20 border-b border-emerald-950/10 bg-white/95 px-4 sm:px-6 lg:px-8 py-2.5 backdrop-blur-md shadow-2xs"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <nav
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5"
          aria-label="App view tabs"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentPage === tab.id;

            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => {
                  onSelectPage(tab.id);
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                className={`group flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#081B13] text-white shadow-xs ring-1 ring-emerald-600/40'
                    : 'bg-[#F6F9F5] text-[#435147] hover:bg-emerald-50/90 hover:text-[#081B13] border border-stone-200/60'
                }`}
              >
                <Icon
                  className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-[#A6F768]' : 'text-stone-500 group-hover:text-[#2E763B]'
                  }`}
                />
                <span className="whitespace-nowrap">{tab.label}</span>

                {tab.badge && (
                  <span
                    className={`rounded-md border px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider ${
                      isActive ? 'bg-white/20 text-[#A6F768] border-white/30' : tab.badgeColor
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}

                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                      isActive
                        ? 'bg-[#A6F768] text-[#081B13]'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
