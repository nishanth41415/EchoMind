import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Zap,
  Gauge,
  Wifi,
  Server,
  Database,
  BrainCircuit,
  LayoutDashboard,
  Power,
  Layers,
  CheckCircle2,
  ChevronRight,
  Info,
  Radio,
  Sliders,
  ShieldCheck,
  X,
} from 'lucide-react';
import { HardwareNode, HardwareBOMItem, SystemHealth } from '../types';
import { hardwareNodes, hardwareBOM } from '../services/mockData';

interface HardwarePageProps {
  systemHealth: SystemHealth;
}

export const HardwarePage: React.FC<HardwarePageProps> = ({ systemHealth }) => {
  const [selectedNode, setSelectedNode] = useState<HardwareNode>(hardwareNodes[2]); // ESP32 by default
  const [packetIndex, setPacketIndex] = useState(0);

  // Animate moving data packets through the flow
  useEffect(() => {
    const timer = setInterval(() => {
      setPacketIndex((prev) => (prev + 1) % hardwareNodes.length);
    }, 900);
    return () => clearInterval(timer);
  }, []);

  const getNodeIcon = (id: string) => {
    switch (id) {
      case 'node-appliance':
        return Zap;
      case 'node-sensors':
        return Gauge;
      case 'node-esp32':
        return Cpu;
      case 'node-wifi':
        return Wifi;
      case 'node-backend':
        return Server;
      case 'node-database':
        return Database;
      case 'node-ai':
        return BrainCircuit;
      case 'node-dashboard':
        return LayoutDashboard;
      case 'node-relay':
        return Power;
      default:
        return Cpu;
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-100">
                <Cpu className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                Engineering Hardware Specification
              </span>
            </div>
            <h2 className="mt-3 font-['Outfit',sans-serif] text-2xl sm:text-3xl font-bold text-stone-900">
              ESP32 IoT & Physical Architecture
            </h2>
            <p className="mt-1 text-sm text-stone-600 max-w-2xl">
              End-to-end hardware schematic from AC mains load transducers to FreeRTOS microcontroller ADC sampling, encrypted MQTT wireless uplink, and cloud time-series persistence.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
              ● Hardware Prototype Active
            </span>
          </div>
        </div>
      </div>

      {/* SYSTEM HEALTH PANEL */}
      <div
        id="system-health-panel"
        className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs"
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              INFRASTRUCTURE TELEMETRY
            </span>
            <h3 className="font-['Outfit',sans-serif] text-base font-bold text-stone-900">
              Real-Time System Health Monitor
            </h3>
          </div>
          <div className="text-xs text-stone-500">
            Last Sensor Update: <strong className="text-emerald-700">{systemHealth.last_sensor_update}</strong>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* ESP32 */}
          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3 text-center">
            <div className="text-[10px] font-bold uppercase text-stone-500">ESP32 MCU</div>
            <div className="mt-1 font-['Outfit',sans-serif] text-sm font-bold text-emerald-700 flex items-center justify-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {systemHealth.esp32_status}
            </div>
            <span className="text-[10px] text-stone-400">GPIO34 & 35 ADC</span>
          </div>

          {/* Wi-Fi */}
          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3 text-center">
            <div className="text-[10px] font-bold uppercase text-stone-500">Wi-Fi (2.4GHz)</div>
            <div className="mt-1 font-['Outfit',sans-serif] text-sm font-bold text-emerald-700 flex items-center justify-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {systemHealth.wifi_status}
            </div>
            <span className="text-[10px] text-stone-400">RSSI {systemHealth.rssi} dBm</span>
          </div>

          {/* API Gateway */}
          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3 text-center">
            <div className="text-[10px] font-bold uppercase text-stone-500">Backend API</div>
            <div className="mt-1 font-['Outfit',sans-serif] text-sm font-bold text-emerald-700 flex items-center justify-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {systemHealth.api_status}
            </div>
            <span className="text-[10px] text-stone-400">Latency {systemHealth.ping_ms} ms</span>
          </div>

          {/* Database */}
          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3 text-center">
            <div className="text-[10px] font-bold uppercase text-stone-500">TimescaleDB</div>
            <div className="mt-1 font-['Outfit',sans-serif] text-sm font-bold text-emerald-700 flex items-center justify-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {systemHealth.database_status}
            </div>
            <span className="text-[10px] text-stone-400">Hypertables Active</span>
          </div>

          {/* AI Engine */}
          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3 text-center">
            <div className="text-[10px] font-bold uppercase text-stone-500">AI / ML Engine</div>
            <div className="mt-1 font-['Outfit',sans-serif] text-sm font-bold text-emerald-700 flex items-center justify-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {systemHealth.ai_engine_status}
            </div>
            <span className="text-[10px] text-stone-400">Confidence 94%</span>
          </div>

          {/* Grid Quality */}
          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3 text-center">
            <div className="text-[10px] font-bold uppercase text-stone-500">Mains Freq</div>
            <div className="mt-1 font-['Outfit',sans-serif] text-sm font-bold text-stone-900">
              {systemHealth.frequency} Hz
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold">{systemHealth.voltage_grid}V RMS</span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE ARCHITECTURE DIAGRAM (Main Feature) */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-stone-100">
          <div>
            <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-stone-900">
              Interactive System Architecture & Hardware Data-Flow
            </h3>
            <p className="text-xs text-stone-500">
              Click on any component node to inspect electrical specs, firmware routines, and pinout schematics.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
            <Radio className="h-4 w-4 animate-pulse" />
            <span>Packet flow animation active</span>
          </div>
        </div>

        {/* 9-Node Architecture Canvas / Flow Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          {hardwareNodes.map((node, index) => {
            const Icon = getNodeIcon(node.id);
            const isSelected = selectedNode.id === node.id;
            const isPacketTransmitting = packetIndex === index;

            return (
              <button
                key={node.id}
                id={`arch-node-${node.id}`}
                onClick={() => setSelectedNode(node)}
                className={`relative flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-300 shadow-sm'
                    : 'border-stone-200/80 bg-white hover:border-emerald-300 hover:bg-stone-50/50'
                }`}
              >
                {/* Visual pulse for traveling data packet */}
                {isPacketTransmitting && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  </span>
                )}

                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-stone-400">
                      Step 0{index + 1}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                      {node.status_label}
                    </span>
                  </div>
                  <h4 className="font-['Outfit',sans-serif] text-sm font-bold text-stone-900 truncate mt-0.5">
                    {node.name}
                  </h4>
                  <p className="text-xs text-stone-500 truncate">{node.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Component Inspection Panel */}
        {selectedNode && (
          <div
            id="node-inspector-panel"
            className="mt-6 rounded-2xl border border-emerald-200/90 bg-linear-to-r from-emerald-50/50 via-white to-stone-50/50 p-6 shadow-xs animate-in fade-in duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-stone-200/70">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                  {React.createElement(getNodeIcon(selectedNode.id), { className: 'h-6 w-6' })}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">
                    Hardware Subsystem Inspector
                  </span>
                  <h4 className="font-['Outfit',sans-serif] text-lg font-bold text-stone-900">
                    {selectedNode.name} — {selectedNode.subtitle}
                  </h4>
                </div>
              </div>

              <div className="mt-2 sm:mt-0 flex items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  Status: {selectedNode.status_label}
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs text-stone-700 leading-relaxed max-w-3xl">
              {selectedNode.description}
            </p>

            {/* Pinout info if available */}
            {selectedNode.pinout && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs">
                <span className="font-bold text-emerald-950">ESP32 Pinout & Hardware Bus Connection:</span>
                <div className="mt-1 font-mono text-emerald-900 font-semibold">{selectedNode.pinout}</div>
              </div>
            )}

            {/* Technical Specifications Grid */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(selectedNode.specs).map(([key, value]) => (
                <div key={key} className="rounded-xl border border-stone-100 bg-white p-3 text-xs shadow-2xs">
                  <span className="text-[10px] font-medium text-stone-400 uppercase">{key}</span>
                  <div className="mt-1 font-semibold text-stone-900 leading-snug">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* HARDWARE INVENTORY (BILL OF MATERIALS - BOM) */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs">
        <div className="pb-4 border-b border-stone-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            PROTOTYPE BILL OF MATERIALS
          </span>
          <h3 className="font-['Outfit',sans-serif] text-base font-bold text-stone-900">
            Hardware Inventory & Components
          </h3>
          <p className="text-xs text-stone-500">
            Laboratory verified physical components and wiring modules for the ESP32 IoT energy analyzer.
          </p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/70 text-stone-500 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Component</th>
                <th className="py-3 px-4">Model / Specification</th>
                <th className="py-3 px-4">Qty</th>
                <th className="py-3 px-4">Circuit Role</th>
                <th className="py-3 px-4">Pin Connection</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {hardwareBOM.map((item, idx) => (
                <tr key={idx} className="hover:bg-stone-50/60 transition">
                  <td className="py-3 px-4 font-bold text-stone-900">{item.component}</td>
                  <td className="py-3 px-4 font-mono text-stone-600">{item.model}</td>
                  <td className="py-3 px-4 font-semibold text-stone-800">{item.quantity}</td>
                  <td className="py-3 px-4 text-stone-600 max-w-xs">{item.role}</td>
                  <td className="py-3 px-4 font-mono text-emerald-700">{item.pinConnection}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      <CheckCircle2 className="h-3 w-3" />
                      Operational
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
