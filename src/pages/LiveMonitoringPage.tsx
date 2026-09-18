import React, { useState, useEffect } from 'react';
import {
  Activity,
  Wifi,
  Cpu,
  Server,
  LayoutDashboard,
  Zap,
  Gauge,
  ArrowRight,
  Radio,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Leaf,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Appliance, SensorReading, TariffSettings } from '../types';

interface LiveMonitoringPageProps {
  appliances: Appliance[];
  readings: SensorReading[];
  tariff: TariffSettings;
  onNavigateToHardware: () => void;
}

export const LiveMonitoringPage: React.FC<LiveMonitoringPageProps> = ({
  appliances,
  readings,
  tariff,
  onNavigateToHardware,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [packetStep, setPacketStep] = useState(0);

  // Animated packet traveling across pipeline: Sensor -> ESP32 -> Wi-Fi -> Server -> Dashboard
  useEffect(() => {
    const interval = setInterval(() => {
      setPacketStep((prev) => (prev + 1) % 5);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  const latestReading = readings[readings.length - 1] || {
    voltage: 231.2,
    current: 0.31,
    power: 72,
    energy: 1.84,
    power_factor: 0.98,
    frequency: 50.02,
  };

  const pipelineNodes = [
    { id: 0, title: 'Voltage/Current Sensors', icon: Gauge, desc: 'ZMPT101B + ACS712', tag: '1 kHz ADC' },
    { id: 1, title: 'ESP32 Microcontroller', icon: Cpu, desc: 'True RMS Sampling', tag: 'FreeRTOS' },
    { id: 2, title: 'Wi-Fi 802.11 b/g/n', icon: Wifi, desc: 'MQTT / JSON Uplink', tag: '-58 dBm' },
    { id: 3, title: 'Backend Server & DB', icon: Server, desc: 'FastAPI / TimescaleDB', tag: 'HTTP 200' },
    { id: 4, title: 'EcoMind Dashboard', icon: LayoutDashboard, desc: 'Live Telemetry & UI', tag: 'Rendering' },
  ];

  // Calculate live total instantaneous power across online appliances
  const totalLivePowerW = appliances.reduce(
    (acc, a) => acc + (a.relay_state && a.status === 'online' ? a.current_power : 0),
    0
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Status & Controls Header */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-100">
              <Activity className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-600 border-2 border-white"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Outfit',sans-serif] text-lg font-bold text-stone-900">
                  LIVE SYSTEM STATUS
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-600/20">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Connected
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Data refresh: <strong className="text-emerald-700">Real-time (every {tariff.refresh_interval_sec}s)</strong> • ADC True RMS active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-pause-stream"
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
            >
              {isPaused ? <Play className="h-3.5 w-3.5 text-emerald-600" /> : <Pause className="h-3.5 w-3.5 text-stone-500" />}
              <span>{isPaused ? 'Resume Stream' : 'Freeze Stream'}</span>
            </button>
            <button
              onClick={onNavigateToHardware}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>Inspect Hardware</span>
            </button>
          </div>
        </div>
      </div>

      {/* LIVE DATA-FLOW VISUALIZATION (Sensor -> ESP32 -> Wi-Fi -> Server -> Dashboard) */}
      <div
        id="live-dataflow-card"
        className="rounded-2xl border border-emerald-200/90 bg-linear-to-r from-emerald-50/70 via-white to-teal-50/50 p-6 shadow-xs"
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-200/60">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              PHYSICAL TO DIGITAL PIPELINE
            </span>
            <h3 className="font-['Outfit',sans-serif] text-base font-bold text-stone-900">
              Live IoT System Data-Flow
            </h3>
          </div>
          <span className="text-xs text-stone-500 hidden sm:inline">
            Packet Ingestion Latency: <strong className="text-emerald-700 font-mono">14 ms</strong>
          </span>
        </div>

        {/* 5-Node Flow Diagram with animated traveling packet */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
          {pipelineNodes.map((node, idx) => {
            const Icon = node.icon;
            const isPacketHere = packetStep === idx;
            return (
              <div
                key={node.id}
                className={`relative rounded-xl border p-4 transition-all duration-300 ${
                  isPacketHere
                    ? 'border-emerald-500 bg-white shadow-md ring-2 ring-emerald-300'
                    : 'border-stone-200/80 bg-white/80 shadow-xs'
                }`}
              >
                {/* Visual pulse packet beacon */}
                {isPacketHere && (
                  <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm ring-2 ring-white">
                    <Radio className="h-3 w-3 animate-ping" />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                      isPacketHere ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {node.tag}
                  </span>
                </div>

                <div className="mt-2.5 font-bold text-xs text-stone-900 leading-tight">
                  {node.title}
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">{node.desc}</div>

                {/* Arrow connector indicator */}
                {idx < 4 && (
                  <div className="hidden sm:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 text-stone-400">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* REAL-TIME ANIMATED WAVEFORM / ENERGY GRAPH */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-['Outfit',sans-serif] text-base font-bold text-stone-900">
                Instantaneous Power & Voltage Waveform
              </h3>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 animate-pulse">
                LIVE SAMPLING
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Live oscilloscope-style telemetry stream emitted from ESP32 ADC pin GPIO34 / GPIO35.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="rounded-lg bg-stone-50 border border-stone-200 px-2.5 py-1">
              <span className="text-stone-400">Grid Voltage: </span>
              <span className="font-mono font-bold text-stone-900">{latestReading.voltage} V</span>
            </div>
            <div className="rounded-lg bg-stone-50 border border-stone-200 px-2.5 py-1">
              <span className="text-stone-400">Mains Freq: </span>
              <span className="font-mono font-bold text-emerald-700">{latestReading.frequency} Hz</span>
            </div>
            <div className="rounded-lg bg-stone-50 border border-stone-200 px-2.5 py-1">
              <span className="text-stone-400">Power Factor: </span>
              <span className="font-mono font-bold text-stone-900">cos φ 0.98</span>
            </div>
          </div>
        </div>

        {/* Live streaming chart */}
        <div className="mt-5 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={readings} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: 10, fill: '#64748B' }}
                axisLine={{ stroke: '#E2E8F0' }}
                tickLine={false}
              />
              <YAxis
                yAxisId="power"
                tick={{ fontSize: 10, fill: '#10B981' }}
                axisLine={{ stroke: '#E2E8F0' }}
                tickLine={false}
                unit=" W"
                domain={[40, 100]}
              />
              <YAxis
                yAxisId="volt"
                orientation="right"
                tick={{ fontSize: 10, fill: '#3B82F6' }}
                axisLine={{ stroke: '#E2E8F0' }}
                tickLine={false}
                unit=" V"
                domain={[225, 235]}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', fontSize: '11px' }}
                formatter={(val: any, name: any) => [`${val}`, name]}
              />
              <Line
                yAxisId="power"
                type="monotone"
                dataKey="power"
                name="Appliance Power (W)"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                yAxisId="volt"
                type="monotone"
                dataKey="voltage"
                name="Mains Potential (V)"
                stroke="#3B82F6"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Real-time Active Power (Watts)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              Mains Voltage (RMS 230V AC)
            </span>
          </div>
          <span>Total Live Building Load: <strong className="text-stone-900 font-mono">{totalLivePowerW} W</strong></span>
        </div>
      </div>

      {/* APPLIANCE TELEMETRY CARDS (FAN, LAMP, LAPTOP, REFRIGERATOR) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-['Outfit',sans-serif] text-base font-bold text-stone-900">
              Live Appliance Telemetry Units
            </h3>
            <p className="text-xs text-stone-500">Individual circuit readings from ESP32 multiplexer</p>
          </div>
          <span className="text-xs font-semibold text-stone-500">{appliances.length} Monitored Loads</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {appliances.map((app) => (
            <div
              key={app.id}
              className={`rounded-2xl border p-5 transition-all ${
                app.is_abnormal
                  ? 'border-amber-300 bg-linear-to-b from-amber-50/50 via-white to-white shadow-xs'
                  : 'border-stone-200/90 bg-white shadow-xs hover:shadow-md'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-['Outfit',sans-serif] text-base font-bold text-stone-900">
                    {app.name.toUpperCase()}
                  </h4>
                  <span className="text-xs text-stone-500">{app.room}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      app.status === 'online' && app.relay_state
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        app.status === 'online' && app.relay_state
                          ? 'bg-emerald-500 animate-pulse'
                          : 'bg-stone-400'
                      }`}
                    />
                    {app.status === 'online' && app.relay_state ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
              </div>

              {app.is_abnormal && (
                <div className="mt-2 rounded-md bg-amber-100/70 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                  ⚠️ High Draw Anomaly
                </div>
              )}

              {/* Telemetry Metrics */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-stone-100">
                  <span className="text-stone-500">Power:</span>
                  <span className="font-mono font-bold text-stone-900 text-sm">
                    {app.current_power} W
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-stone-100">
                  <span className="text-stone-500">Voltage:</span>
                  <span className="font-mono font-medium text-stone-800">{app.voltage} V</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-stone-100">
                  <span className="text-stone-500">Current:</span>
                  <span className="font-mono font-medium text-stone-800">{app.current} A</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-stone-100">
                  <span className="text-stone-500">Energy Today:</span>
                  <span className="font-mono font-bold text-emerald-700">{app.energy_today} kWh</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-stone-500">Estimated Cost:</span>
                  <span className="font-mono font-bold text-stone-900">₹{app.estimated_cost}</span>
                </div>
              </div>

              {/* Eco Rating */}
              <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span className="flex items-center gap-1">
                  <Leaf className="h-3 w-3 text-emerald-600" />
                  Eco Rating:
                </span>
                <span className="font-bold text-emerald-700">{'★'.repeat(app.eco_rating)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
