import React, { useState } from 'react';
import {
  Fan,
  Lightbulb,
  Laptop,
  Refrigerator,
  Power,
  AlertTriangle,
  Info,
  CheckCircle2,
  Filter,
  Leaf,
  Zap,
  Sliders,
  X,
  ShieldAlert,
} from 'lucide-react';
import { Appliance, TariffSettings } from '../types';
import { RelayConfirmationModal } from '../components/RelayConfirmationModal';

interface AppliancesPageProps {
  appliances: Appliance[];
  tariff: TariffSettings;
  onToggleRelay: (appliance: Appliance, targetState: boolean) => void;
  onNavigateToHardware: () => void;
}

export const AppliancesPage: React.FC<AppliancesPageProps> = ({
  appliances,
  tariff,
  onToggleRelay,
  onNavigateToHardware,
}) => {
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [modalAppliance, setModalAppliance] = useState<Appliance | null>(null);
  const [targetState, setTargetState] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [detailAppliance, setDetailAppliance] = useState<Appliance | null>(null);

  const rooms = ['all', 'Living Room', 'Bedroom', 'Kitchen'];

  const filteredAppliances =
    selectedRoom === 'all'
      ? appliances
      : appliances.filter((a) => a.room.toLowerCase() === selectedRoom.toLowerCase());

  const getApplianceIcon = (type: string) => {
    switch (type) {
      case 'fan':
        return Fan;
      case 'lamp':
        return Lightbulb;
      case 'laptop':
        return Laptop;
      case 'refrigerator':
        return Refrigerator;
      default:
        return Zap;
    }
  };

  const handleOpenRelayConfirm = (app: Appliance, newState: boolean) => {
    setModalAppliance(app);
    setTargetState(newState);
    setIsModalOpen(true);
  };

  const handleConfirmSwitch = () => {
    if (modalAppliance) {
      onToggleRelay(modalAppliance, targetState);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900">
                Connected Appliances & Loads
              </h2>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                ESP32 IoT Monitored
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Live power telemetry and optocoupled relay actuation with safety confirmation.
            </p>
          </div>

          {/* Room Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-stone-100 p-1">
            {rooms.map((room) => (
              <button
                key={room}
                id={`filter-room-${room.toLowerCase().replace(' ', '-')}`}
                onClick={() => setSelectedRoom(room)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                  selectedRoom === room
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {room === 'all' ? 'All Rooms' : room}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appliances Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredAppliances.map((app) => {
          const Icon = getApplianceIcon(app.type);
          const isOnline = app.status === 'online';
          const isPowered = app.relay_state;

          return (
            <div
              key={app.id}
              className={`relative flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-xs transition-all hover:shadow-md ${
                app.is_abnormal
                  ? 'border-amber-300 ring-2 ring-amber-100'
                  : 'border-stone-200/90'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                        isPowered && isOnline
                          ? 'bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200'
                          : 'bg-stone-100 text-stone-400'
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-['Outfit',sans-serif] text-base font-bold text-stone-900">
                        {app.name}
                      </h3>
                      <div className="text-xs text-stone-500">{app.room}</div>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isOnline && isPowered
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isOnline && isPowered ? 'bg-emerald-500' : 'bg-stone-400'
                      }`}
                    />
                    {isPowered ? 'ACTIVE' : 'CUT OFF'}
                  </span>
                </div>

                {/* Abnormality warning tag */}
                {app.is_abnormal && (
                  <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50/80 px-2.5 py-1.5 text-[11px] font-medium text-amber-900">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span>{app.abnormality_note || 'Abnormal draw detected'}</span>
                  </div>
                )}

                {/* Key Metrics Matrix */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl border border-stone-100 bg-stone-50/70 p-2.5">
                    <span className="text-[10px] font-medium text-stone-500 uppercase">
                      Current Power
                    </span>
                    <div className="mt-0.5 font-mono text-base font-bold text-stone-900">
                      {isPowered ? `${app.current_power} W` : '0 W'}
                    </div>
                    <span className="text-[10px] text-stone-400">
                      {app.voltage}V • {app.current}A
                    </span>
                  </div>

                  <div className="rounded-xl border border-stone-100 bg-stone-50/70 p-2.5">
                    <span className="text-[10px] font-medium text-stone-500 uppercase">
                      Today&apos;s Energy
                    </span>
                    <div className="mt-0.5 font-mono text-base font-bold text-emerald-700">
                      {app.energy_today} kWh
                    </div>
                    <span className="text-[10px] font-semibold text-stone-700">
                      ₹{app.estimated_cost} cost
                    </span>
                  </div>
                </div>

                {/* Daily limit gauge */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-stone-500">Daily Energy Budget</span>
                    <span className="font-mono font-medium text-stone-700">
                      {app.energy_today} / {app.daily_limit_kwh} kWh
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        app.energy_today > app.daily_limit_kwh
                          ? 'bg-rose-500'
                          : app.energy_today > app.daily_limit_kwh * 0.8
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(100, (app.energy_today / app.daily_limit_kwh) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons & Remote Load Control */}
              <div className="mt-5 pt-3 border-t border-stone-100">
                <div className="flex items-center justify-between gap-2">
                  <button
                    id={`btn-details-${app.id}`}
                    onClick={() => setDetailAppliance(app)}
                    className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
                  >
                    Details
                  </button>

                  {/* Remote Load Control Button */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-stone-400 font-medium hidden sm:inline">
                      Remote Load Control:
                    </span>
                    <button
                      id={`btn-relay-toggle-${app.id}`}
                      onClick={() => handleOpenRelayConfirm(app, !isPowered)}
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                        isPowered
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                      }`}
                    >
                      <Power className="h-3.5 w-3.5" />
                      <span>{isPowered ? 'Turn OFF' : 'Turn ON'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal for Relay Load Control */}
      <RelayConfirmationModal
        appliance={modalAppliance}
        targetState={targetState}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSwitch}
      />

      {/* Appliance Details Inspection Drawer / Modal */}
      {detailAppliance && (
        <div
          id="appliance-detail-drawer"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl">
            <button
              onClick={() => setDetailAppliance(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-stone-900">
                  {detailAppliance.name} Specification
                </h3>
                <p className="text-xs text-stone-500">
                  Room: {detailAppliance.room} • Circuit ID: {detailAppliance.id}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-stone-50 p-3 border border-stone-100">
                  <span className="text-stone-400 font-medium">True RMS Voltage</span>
                  <div className="text-sm font-bold text-stone-900 mt-0.5">
                    {detailAppliance.voltage} V AC
                  </div>
                </div>
                <div className="rounded-xl bg-stone-50 p-3 border border-stone-100">
                  <span className="text-stone-400 font-medium">Instantaneous Current</span>
                  <div className="text-sm font-bold text-stone-900 mt-0.5">
                    {detailAppliance.current} A
                  </div>
                </div>
                <div className="rounded-xl bg-stone-50 p-3 border border-stone-100">
                  <span className="text-stone-400 font-medium">Carbon Footprint</span>
                  <div className="text-sm font-bold text-emerald-700 mt-0.5">
                    {detailAppliance.carbon_footprint_kg} kg CO₂
                  </div>
                </div>
                <div className="rounded-xl bg-stone-50 p-3 border border-stone-100">
                  <span className="text-stone-400 font-medium">Eco Efficiency Grade</span>
                  <div className="text-sm font-bold text-emerald-700 mt-0.5">
                    {'★'.repeat(detailAppliance.eco_rating)} (5-Star)
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-emerald-50/50 p-3.5 border border-emerald-100 text-emerald-950">
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-emerald-600" />
                  <span>Hardware Linkage (ESP32)</span>
                </div>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Analog monitoring via ACS712 Hall-Effect sensor on ADC Channel GPIO35. Remote load isolation supported through SPDT optocoupled relay channel on GPIO26.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setDetailAppliance(null)}
                className="rounded-xl bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
