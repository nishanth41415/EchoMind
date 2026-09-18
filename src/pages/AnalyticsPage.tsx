import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Filter,
  Download,
  TrendingDown,
  TrendingUp,
  Zap,
  Leaf,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { TariffSettings } from '../types';

interface AnalyticsPageProps {
  tariff: TariffSettings;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ tariff }) => {
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days'>('7days');
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [selectedAppliance, setSelectedAppliance] = useState<string>('all');

  // Chart 1: Energy Consumption Over Time
  const timeSeriesData = [
    { label: 'Mon', actual: 4.65, baseline: 5.12, carbonKg: 3.81, cost: 27.9 },
    { label: 'Tue', actual: 4.90, baseline: 5.30, carbonKg: 4.01, cost: 29.4 },
    { label: 'Wed', actual: 5.05, baseline: 5.42, carbonKg: 4.14, cost: 30.3 },
    { label: 'Thu', actual: 4.70, baseline: 5.10, carbonKg: 3.85, cost: 28.2 },
    { label: 'Fri', actual: 5.30, baseline: 5.80, carbonKg: 4.34, cost: 31.8 },
    { label: 'Sat', actual: 5.85, baseline: 6.20, carbonKg: 4.79, cost: 35.1 },
    { label: 'Sun', actual: 4.82, baseline: 5.48, carbonKg: 3.95, cost: 28.9 },
  ];

  // Chart 2: Appliance Comparison
  const applianceComparisonData = [
    { name: 'Ceiling Fan', energy: 1.84, cost: 11.04, efficiency: 78 },
    { name: 'Ambient Lamp', energy: 1.21, cost: 7.26, efficiency: 95 },
    { name: 'Laptop Dock', energy: 0.97, cost: 5.82, efficiency: 86 },
    { name: 'Eco Fridge', energy: 0.80, cost: 4.80, efficiency: 92 },
  ];

  // Chart 3: Room Comparison
  const roomComparisonData = [
    { room: 'Bedroom', energy: 2.1, peakWatts: 145, cost: 12.6 },
    { room: 'Living Room', energy: 1.5, peakWatts: 115, cost: 9.0 },
    { room: 'Kitchen', energy: 0.9, peakWatts: 180, cost: 5.4 },
    { room: 'Others', energy: 0.4, peakWatts: 35, cost: 2.4 },
  ];

  // Chart 4: Peak Consumption Periods (Hourly 24h Distribution)
  const hourlyPeakData = [
    { hour: '00h', watts: 75, isPeak: false },
    { hour: '03h', watts: 60, isPeak: false },
    { hour: '06h', watts: 120, isPeak: false },
    { hour: '09h', watts: 210, isPeak: false },
    { hour: '12h', watts: 190, isPeak: false },
    { hour: '15h', watts: 175, isPeak: false },
    { hour: '18h', watts: 310, isPeak: true },
    { hour: '19h', watts: 342, isPeak: true }, // Peak
    { hour: '20h', watts: 325, isPeak: true },
    { hour: '21h', watts: 290, isPeak: true },
    { hour: '22h', watts: 180, isPeak: false },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Workspace Header with Filters */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900">
              Analytics Workspace
            </h2>
            <p className="text-xs text-stone-500">
              Comprehensive historical energy trends, cost modeling, and carbon footprint telemetry.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Date range filter */}
            <div className="flex rounded-xl bg-stone-100 p-1">
              {(['today', '7days', '30days'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                    dateRange === range
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {range === 'today' ? 'Today' : range === '7days' ? 'Last 7 Days' : 'Last 30 Days'}
                </button>
              ))}
            </div>

            {/* Room selector */}
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-2xs focus:outline-emerald-500"
            >
              <option value="all">All Rooms</option>
              <option value="living">Living Room</option>
              <option value="bedroom">Bedroom</option>
              <option value="kitchen">Kitchen</option>
            </select>

            {/* Export CSV button */}
            <button
              onClick={() => alert('Exporting TimescaleDB telemetry dataset to CSV format...')}
              className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-2xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 SUMMARY METRICS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total Energy
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-['Outfit',sans-serif] text-3xl font-bold text-stone-900">
              35.22
            </span>
            <span className="text-sm font-semibold text-stone-500">kWh (7d)</span>
          </div>
          <div className="mt-2 text-xs text-emerald-700 font-medium flex items-center gap-1">
            <TrendingDown className="h-3.5 w-3.5" />
            <span>8.4% below historical baseline</span>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Average Daily Energy
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-['Outfit',sans-serif] text-3xl font-bold text-stone-900">
              4.95
            </span>
            <span className="text-sm font-semibold text-stone-500">kWh/day</span>
          </div>
          <div className="mt-2 text-xs text-stone-500">
            Median consumption: 4.86 kWh
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Peak Power Draw
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-['Outfit',sans-serif] text-3xl font-bold text-rose-600">
              342
            </span>
            <span className="text-sm font-semibold text-stone-500">Watts</span>
          </div>
          <div className="mt-2 text-xs text-rose-600 font-medium">
            Recorded at 19:42 (Evening slot)
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Estimated Monthly Bill
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold text-stone-700">₹</span>
            <span className="font-['Outfit',sans-serif] text-3xl font-bold text-stone-900">
              891
            </span>
          </div>
          <div className="mt-2 text-xs text-emerald-700 font-medium">
            Projected ₹120 savings this billing cycle
          </div>
        </div>
      </div>

      {/* CHART 1: ENERGY CONSUMPTION OVER TIME */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-stone-100">
          <div>
            <h3 className="font-['Outfit',sans-serif] text-base font-bold text-stone-900">
              1. Energy Consumption Over Time
            </h3>
            <p className="text-xs text-stone-500">Daily kWh usage compared against typical household baseline</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Actual Draw
            </span>
            <span className="flex items-center gap-1 text-stone-400">
              <span className="h-2.5 w-2.5 rounded-full bg-stone-300" /> Baseline Expected
            </span>
          </div>
        </div>

        <div className="mt-5 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="analyticsArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={{ stroke: '#E5E7EB' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={{ stroke: '#E5E7EB' }} unit=" kWh" />
              <Tooltip
                contentStyle={{ borderRadius: '12px', fontSize: '11px' }}
                formatter={(val: any, name: any) => [`${val} kWh`, name]}
              />
              <Area type="monotone" dataKey="actual" name="Actual Consumption" stroke="#10B981" strokeWidth={2.5} fill="url(#analyticsArea)" />
              <Line type="monotone" dataKey="baseline" name="Expected Baseline" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 4" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHARTS 2 & 3: APPLIANCE & ROOM COMPARISONS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Appliance Comparison */}
        <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs">
          <div className="pb-3 border-b border-stone-100">
            <h3 className="font-['Outfit',sans-serif] text-base font-bold text-stone-900">
              2. Appliance Comparison
            </h3>
            <p className="text-xs text-stone-500">Cumulative energy draw (kWh) and associated cost</p>
          </div>

          <div className="mt-4 h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applianceComparisonData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" unit=" kWh" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#374151' }} width={90} />
                <Tooltip
                  formatter={(val: any) => [`${val} kWh`, 'Energy']}
                  contentStyle={{ borderRadius: '12px', fontSize: '11px' }}
                />
                <Bar dataKey="energy" fill="#10B981" radius={[0, 6, 6, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Room Comparison */}
        <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs">
          <div className="pb-3 border-b border-stone-100">
            <h3 className="font-['Outfit',sans-serif] text-base font-bold text-stone-900">
              3. Room Comparison
            </h3>
            <p className="text-xs text-stone-500">Energy distribution across household physical zones</p>
          </div>

          <div className="mt-4 h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roomComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="room" tick={{ fontSize: 11 }} />
                <YAxis unit=" kWh" tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any) => [`${val} kWh`, 'Energy']}
                  contentStyle={{ borderRadius: '12px', fontSize: '11px' }}
                />
                <Bar dataKey="energy" fill="#059669" radius={[6, 6, 0, 0]} barSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* CHARTS 4, 5 & 6: PEAK PERIODS, COST, EFFICIENCY */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Peak Consumption Periods */}
        <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h4 className="font-['Outfit',sans-serif] text-sm font-bold text-stone-900">
                4. Peak Periods (Watts)
              </h4>
              <span className="text-[11px] text-stone-400">Peak Window: 18h - 22h</span>
            </div>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>

          <div className="mt-3 h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyPeakData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="hour" tick={{ fontSize: 9 }} />
                <YAxis unit="W" tick={{ fontSize: 9 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '10px' }} />
                <Bar
                  dataKey="watts"
                  fill="#F59E0B"
                  radius={[3, 3, 0, 0]}
                  barSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg font-medium">
            Peak surge detected at 19h (342W) during evening fan + lighting overlap.
          </div>
        </div>

        {/* Estimated Electricity Cost */}
        <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h4 className="font-['Outfit',sans-serif] text-sm font-bold text-stone-900">
                5. Electricity Cost Trend
              </h4>
              <span className="text-[11px] text-stone-400">Tariff ₹{tariff.rate_per_kwh}/kWh</span>
            </div>
            <span className="font-bold text-emerald-700 text-xs">₹28.92 today</span>
          </div>

          <div className="mt-3 h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="label" tick={{ fontSize: 9 }} />
                <YAxis unit="₹" tick={{ fontSize: 9 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#059669' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg font-medium">
            Off-peak shift is saving ₹4.20 per day compared to peak tariff billing.
          </div>
        </div>

        {/* Efficiency Trend & Sustainability */}
        <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h4 className="font-['Outfit',sans-serif] text-sm font-bold text-stone-900">
                6. Carbon Footprint (kg)
              </h4>
              <span className="text-[11px] text-emerald-700 font-semibold">↓ 12% Emission Rate</span>
            </div>
            <Leaf className="h-4 w-4 text-emerald-600" />
          </div>

          <div className="mt-3 h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeSeriesData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="label" tick={{ fontSize: 9 }} />
                <YAxis unit=" kg" tick={{ fontSize: 9 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="carbonKg"
                  stroke="#14B8A6"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#14B8A6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-[11px] text-teal-800 bg-teal-50 p-2 rounded-lg font-medium">
            3.95 kg CO₂ emitted today, saving 0.54 kg CO₂ equivalent vs regional grid baseline.
          </div>
        </div>
      </div>
    </div>
  );
};
