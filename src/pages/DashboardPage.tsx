import React, { useState } from 'react';
import {
  Zap,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Leaf,
  Info,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Appliance,
  RoomUsage,
  ConsumptionDataPoint,
  PredictionDataPoint,
  AlertItem,
  TariffSettings,
  SensorReading,
  SystemHealth,
} from '../types';
import { EcoImpactBanner } from '../components/EcoImpactBanner';
import { EnerverseStrip } from '../components/EnerverseStrip';

interface DashboardPageProps {
  appliances: Appliance[];
  rooms: RoomUsage[];
  dayData: ConsumptionDataPoint[];
  weekData: ConsumptionDataPoint[];
  monthData: ConsumptionDataPoint[];
  forecastData: PredictionDataPoint[];
  alerts: AlertItem[];
  tariff: TariffSettings;
  readings?: SensorReading[];
  systemHealth?: SystemHealth;
  onNavigate: (page: any) => void;
  onInvestigateAlert: (id: string) => void;
  onDismissAlert: (id: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  appliances,
  rooms,
  dayData,
  weekData,
  monthData,
  forecastData,
  alerts,
  tariff,
  readings,
  systemHealth,
  onNavigate,
  onInvestigateAlert,
  onDismissAlert,
}) => {
  const [timeTab, setTimeTab] = useState<'day' | 'week' | 'month'>('day');

  // Select chart data based on active tab
  const activeChartData =
    timeTab === 'day' ? dayData : timeTab === 'week' ? weekData : monthData;

  // Appliance donut breakdown
  const applianceDonutData = [
    { name: 'Fan', value: 1.84, percent: 38, color: '#10B981', room: 'Living Room' },
    { name: 'Lamp', value: 1.21, percent: 25, color: '#059669', room: 'Bedroom' },
    { name: 'Laptop', value: 0.97, percent: 20, color: '#14B8A6', room: 'Bedroom' },
    { name: 'Others', value: 0.80, percent: 17, color: '#84CC16', room: 'Kitchen' },
  ];

  const activeAlert = alerts.find((a) => a.status === 'active' && a.severity === 'warning');

  // Custom chart tooltip
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-stone-200 bg-white/95 p-3 text-xs shadow-lg backdrop-blur-md">
          <div className="font-bold text-stone-900 mb-1 flex items-center justify-between gap-3">
            <span>{label}</span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
              Energy Profile
            </span>
          </div>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-stone-500">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  {entry.name}:
                </span>
                <span className="font-mono font-bold text-stone-800">
                  {entry.value} kWh
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-stone-100 text-[10px] text-stone-400">
            Est. Cost: ₹{(payload[0]?.value * tariff.rate_per_kwh || 0).toFixed(2)}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Signature EnerVerse-Grade Hardware & AI Ecosystem Telemetry Strip */}
      <EnerverseStrip
        latestReading={readings?.[readings.length - 1]}
        systemHealth={systemHealth}
        onNavigateToLive={() => onNavigate('live')}
        onNavigateToHardware={() => onNavigate('hardware')}
      />

      {/* Sustainability Highlight Banner */}
      <EcoImpactBanner onExploreRecommendations={() => onNavigate('recommendations')} />

      {/* TOP 4 KPI CARDS (EnerVerse-inspired high-contrast tactile cards) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Consumption */}
        <div
          id="kpi-total-consumption"
          className="enerverse-card enerverse-card-hover p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#435147] uppercase tracking-wider">
              Total Consumption
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#2E763B]">
              <Zap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-['Outfit',sans-serif] text-3xl font-extrabold tracking-tight text-[#081B13]">
              4.82
            </span>
            <span className="text-sm font-bold text-stone-400">kWh</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#2E763B]">
            <TrendingDown className="h-4 w-4" />
            <span>↓ 12% vs yesterday</span>
            <span className="text-stone-400 font-normal">(-0.66 kWh)</span>
          </div>
        </div>

        {/* Estimated Cost */}
        <div
          id="kpi-estimated-cost"
          className="enerverse-card enerverse-card-hover p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#435147] uppercase tracking-wider">
              Estimated Cost
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-[#2E763B] font-bold text-base">
              ₹
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold text-stone-500">₹</span>
            <span className="font-['Outfit',sans-serif] text-3xl font-extrabold tracking-tight text-[#081B13]">
              28.92
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#2E763B]">
            <TrendingDown className="h-4 w-4" />
            <span>↓ 15% vs yesterday</span>
            <span className="text-stone-400 font-normal">(tariff ₹{tariff.rate_per_kwh}/u)</span>
          </div>
        </div>

        {/* Predicted Usage */}
        <div
          id="kpi-predicted-usage"
          className="enerverse-card enerverse-card-hover p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#435147] uppercase tracking-wider">
              Predicted Usage
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-[#2E763B]">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-['Outfit',sans-serif] text-3xl font-extrabold tracking-tight text-[#081B13]">
              5.10
            </span>
            <span className="text-sm font-bold text-stone-400">kWh</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-[#435147] font-semibold">Tomorrow (Sep 19)</span>
            <span className="rounded-md border border-emerald-600/20 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#2E763B]">
              94% ML Conf.
            </span>
          </div>
        </div>

        {/* Active Alerts */}
        <div
          id="kpi-active-alerts"
          onClick={() => onNavigate('alerts')}
          className="enerverse-card enerverse-card-hover cursor-pointer p-5 border-amber-300/60 bg-linear-to-b from-amber-50/40 to-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
              Active Alerts
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-['Outfit',sans-serif] text-3xl font-extrabold tracking-tight text-amber-950">
              1
            </span>
            <span className="text-xs font-bold text-amber-800">Needs Review</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-800">
            <span>Living Room Fan Surge (+42%)</span>
            <ChevronRight className="h-3.5 w-3.5 ml-auto" />
          </div>
        </div>
      </div>

      {/* ALERT INVESTIGATION BANNER (if active) */}
      {activeAlert && (
        <div
          id="dashboard-alert-banner"
          className="rounded-2xl border border-rose-200 bg-linear-to-r from-rose-50/80 via-white to-amber-50/50 p-5 shadow-xs"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
                    HIGH USAGE DETECTED
                  </span>
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                    Live Anomaly
                  </span>
                </div>
                <h4 className="font-['Outfit',sans-serif] text-base font-bold text-stone-900 mt-0.5">
                  {activeAlert.device} — {activeAlert.room}
                </h4>
                <p className="text-xs text-stone-600 mt-1">
                  <span className="font-semibold text-rose-900">2.8 kWh in 2 hours</span> — {activeAlert.difference}. {activeAlert.ai_explanation}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
              <button
                id="btn-investigate-alert"
                onClick={() => onInvestigateAlert(activeAlert.id)}
                className="rounded-xl bg-stone-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-stone-800 transition"
              >
                Investigate
              </button>
              <button
                id="btn-dismiss-alert"
                onClick={() => onDismissAlert(activeAlert.id)}
                className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SYSTEM NORMAL STATUS (When no critical or positive status) */}
      <div className="flex items-center justify-between rounded-xl border border-emerald-200/70 bg-emerald-50/40 px-4 py-2.5 text-xs text-emerald-900">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span className="font-bold text-emerald-950">SYSTEM NORMAL:</span>
          <span>All monitored circuits and relay contacts operating within safety limits.</span>
        </div>
        <span className="text-[11px] text-emerald-700 hidden sm:inline">
          ESP32 Heartbeat: 2s ago
        </span>
      </div>

      {/* MAIN CONSUMPTION GRAPH */}
      <div
        id="main-consumption-card"
        className="enerverse-card p-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-stone-200/60">
          <div>
            <h2 className="font-['Outfit',sans-serif] text-lg font-extrabold text-[#081B13]">
              Energy Consumption
            </h2>
            <p className="text-xs text-[#435147]">
              Comparing actual electricity draw against previous-period baseline and peak limits.
            </p>
          </div>

          {/* Day / Week / Month Tab switcher */}
          <div className="flex rounded-xl bg-stone-100 p-1 self-start sm:self-auto">
            {(['day', 'week', 'month'] as const).map((tab) => (
              <button
                key={tab}
                id={`tab-btn-${tab}`}
                onClick={() => setTimeTab(tab)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition cursor-pointer ${
                  timeTab === tab
                    ? 'bg-white text-[#2E763B] shadow-2xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts interactive graph */}
        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={activeChartData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="actualEnergyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="timeLabel"
                tick={{ fontSize: 11, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
                unit=" kWh"
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: 12, fontSize: 12 }}
              />

              <Area
                type="monotone"
                dataKey="actual"
                name="Actual Consumption"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#actualEnergyGrad)"
              />
              <Line
                type="monotone"
                dataKey="previous"
                name="Previous Period"
                stroke="#94A3B8"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="peak"
                name="Peak Threshold"
                stroke="#F43F5E"
                strokeWidth={1.5}
                strokeDasharray="2 2"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="average"
                name="Average Baseline"
                stroke="#3B82F6"
                strokeWidth={1.5}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend notes */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-stone-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Current draw (4.82 kWh total)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500"></span> Evening peak tariff: 18:00 - 22:00
            </span>
          </div>
          <button
            onClick={() => onNavigate('analytics')}
            className="flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <span>Deep Analytics Workspace</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* APPLIANCE-WISE & ROOM-WISE USAGE (Two-column layout) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Appliance-Wise Consumption */}
        <div
          id="appliance-breakdown-card"
          className="enerverse-card p-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-stone-200/60">
            <div>
              <h3 className="font-['Outfit',sans-serif] text-base font-extrabold text-[#081B13]">
                Appliance-Wise Consumption
              </h3>
              <p className="text-xs text-[#435147]">Breakdown of total 4.82 kWh consumed today</p>
            </div>
            <button
              onClick={() => onNavigate('appliances')}
              className="text-xs font-bold text-[#2E763B] hover:text-[#081B13] flex items-center gap-1 cursor-pointer"
            >
              <span>Manage</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Donut Chart */}
            <div className="sm:col-span-5 h-44 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={applianceDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {applianceDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val} kWh`, 'Energy']}
                    contentStyle={{ borderRadius: '12px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-['Outfit',sans-serif] text-lg font-bold text-[#081B13]">
                  4.82
                </span>
                <span className="text-[10px] uppercase font-bold text-stone-400">kWh Total</span>
              </div>
            </div>

            {/* Appliance Stat Cards */}
            <div className="sm:col-span-7 space-y-2">
              {applianceDonutData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-stone-200/60 bg-[#F6F9F5] p-2.5 text-xs hover:border-emerald-600/30 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-3 w-3 rounded-md"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <div className="font-bold text-[#081B13]">{item.name}</div>
                      <div className="text-[10px] text-[#435147]">{item.room}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-[#081B13]">{item.value} kWh</div>
                    <div className="text-[10px] font-bold text-[#2E763B]">{item.percent}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Room-Wise Usage */}
        <div
          id="room-usage-card"
          className="enerverse-card p-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-stone-200/60">
            <div>
              <h3 className="font-['Outfit',sans-serif] text-base font-extrabold text-[#081B13]">
                Room-Wise Usage
              </h3>
              <p className="text-xs text-[#435147]">Distribution across domestic circuits</p>
            </div>
            <span className="text-xs font-bold text-[#2E763B]">4 Active Zones</span>
          </div>

          <div className="mt-5 space-y-4">
            {rooms.map((r) => (
              <div key={r.room} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#081B13]">{r.room}</span>
                    <span className="rounded bg-stone-100 px-1.5 py-0.2 text-[10px] text-stone-500">
                      {r.appliance_count} load{r.appliance_count > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-[#081B13]">{r.energy_kwh} kWh</span>
                    <span className="text-stone-400 font-sans">({r.percentage}%)</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${r.percentage}%`,
                      backgroundColor: r.color,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#435147]">
                  <span>Current live draw: {r.active_load_w} W</span>
                  <span>Carbon: {r.carbon_kg} kg CO₂</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI INSIGHTS & FORECASTING (Two-column layout) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* AI Insights Card (7 cols) */}
        <div
          id="ai-insights-card"
          className="lg:col-span-7 enerverse-card p-6 bg-linear-to-b from-[#F6F9F5]/80 via-white to-white"
        >
          <div className="flex items-center justify-between pb-4 border-b border-stone-200/60">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2E763B] text-white shadow-xs">
                <Sparkles className="h-4 w-4 text-[#A6F768]" />
              </div>
              <div>
                <h3 className="font-['Outfit',sans-serif] text-base font-extrabold text-[#081B13]">
                  AI Energy Intelligence
                </h3>
                <p className="text-xs text-[#435147]">Autonomous optimization suggestions</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('ai')}
              className="text-xs font-bold text-[#2E763B] hover:text-[#081B13] flex items-center gap-1 cursor-pointer"
            >
              <span>AI Center</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {/* Insight 1 */}
            <div className="rounded-xl border border-emerald-900/10 bg-emerald-50/50 p-3.5 text-xs">
              <div className="flex items-center justify-between font-bold text-[#081B13]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#2E763B]" />
                  Your usage is 12% lower than yesterday.
                </span>
                <span className="text-[10px] bg-emerald-100 text-[#2E763B] font-bold px-2 py-0.5 rounded">
                  96% Confidence
                </span>
              </div>
              <p className="mt-1 text-[#435147] pl-5.5">
                Effective passive cooling in the morning reduced peak appliance duty cycle. Keep bedroom curtains closed during peak sun hours.
              </p>
            </div>

            {/* Insight 2 */}
            <div className="rounded-xl border border-amber-200/70 bg-amber-50/50 p-3.5 text-xs">
              <div className="flex items-center justify-between font-bold text-amber-950">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  The fan is consuming more energy than its normal evening pattern.
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                  92% Confidence
                </span>
              </div>
              <p className="mt-1 text-stone-600 pl-5.5">
                Drawing 72W continuously vs 52W regular baseline. Potential bearing resistance or high-speed setting while living room is vacant.
              </p>
              <div className="mt-2 pl-5.5 flex items-center justify-between">
                <span className="text-[#2E763B] font-bold">Est. saving: 0.38 kWh/day</span>
                <button
                  onClick={() => onNavigate('recommendations')}
                  className="rounded-lg bg-white border border-stone-200 px-2.5 py-1 text-[11px] font-bold text-stone-800 hover:bg-stone-50 cursor-pointer"
                >
                  View Recommendation
                </button>
              </div>
            </div>

            {/* Insight 3 */}
            <div className="rounded-xl border border-teal-200/70 bg-teal-50/50 p-3.5 text-xs">
              <div className="flex items-center justify-between font-bold text-teal-950">
                <span className="flex items-center gap-1.5">
                  <Leaf className="h-4 w-4 text-[#2E763B]" />
                  You could save approximately ₹150/month by reducing standby consumption.
                </span>
                <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">
                  89% Confidence
                </span>
              </div>
              <p className="mt-1 text-stone-600 pl-5.5">
                Night vampire loads detected on laptop dock and kitchen small circuits between 11 PM and 6 AM.
              </p>
              <div className="mt-2 pl-5.5 flex items-center justify-between">
                <span className="text-[#2E763B] font-bold">Est. saving: ₹150 / month</span>
                <button
                  onClick={() => onNavigate('recommendations')}
                  className="rounded-lg bg-white border border-stone-200 px-2.5 py-1 text-[11px] font-bold text-stone-800 hover:bg-stone-50 cursor-pointer"
                >
                  View Recommendation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Forecasting Visualization (5 cols) */}
        <div
          id="forecast-preview-card"
          className="lg:col-span-5 enerverse-card p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-stone-200/60">
              <div>
                <h3 className="font-['Outfit',sans-serif] text-base font-extrabold text-[#081B13]">
                  Consumption Forecast
                </h3>
                <p className="text-xs text-[#435147]">Historical data followed by predicted values</p>
              </div>
              <span className="rounded-md border border-emerald-600/20 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#2E763B]">
                SARIMAX Model
              </span>
            </div>

            {/* Forecast Chart */}
            <div className="mt-4 h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={forecastData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#6B7280' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={false}
                    domain={[3.5, 6.0]}
                  />
                  <Tooltip
                    formatter={(val: any, name: any) => [`${val} kWh`, name]}
                    contentStyle={{ borderRadius: '12px', fontSize: '11px' }}
                  />
                  <Bar
                    dataKey="actual"
                    name="Actual (kWh)"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                    barSize={18}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    name="Predicted (kWh)"
                    stroke="#3B82F6"
                    strokeWidth={2.5}
                    strokeDasharray="3 3"
                    dot={{ r: 4, fill: '#3B82F6' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-xs text-blue-950">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>AI Predictive Assessment</span>
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              &ldquo;Based on the last 30 days of usage, tomorrow&apos;s estimated consumption is <strong>5.10 kWh</strong> (±0.3 kWh). Peak demand anticipated at 19:30.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
