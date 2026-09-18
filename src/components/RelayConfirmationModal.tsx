import React from 'react';
import { AlertCircle, Power, ShieldAlert, X } from 'lucide-react';
import { Appliance } from '../types';

interface RelayConfirmationModalProps {
  appliance: Appliance | null;
  targetState: boolean;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing?: boolean;
}

export const RelayConfirmationModal: React.FC<RelayConfirmationModalProps> = ({
  appliance,
  targetState,
  isOpen,
  onClose,
  onConfirm,
  isProcessing = false,
}) => {
  if (!isOpen || !appliance) return null;

  const actionText = targetState ? 'Turn ON' : 'Turn OFF';
  const actionColor = targetState ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700';

  return (
    <div
      id="relay-confirmation-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
              targetState ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}
          >
            <Power className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Remote Load Control (ESP32 Relay)
            </span>
            <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-stone-900">
              Confirm Load Switching
            </h3>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-stone-100 bg-stone-50/80 p-3.5 text-xs text-stone-600 space-y-2">
          <div className="flex justify-between">
            <span className="text-stone-500">Target Appliance:</span>
            <span className="font-semibold text-stone-900">{appliance.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Room Location:</span>
            <span className="font-medium text-stone-800">{appliance.room}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Current Power Draw:</span>
            <span className="font-mono font-semibold text-stone-900">{appliance.current_power} W</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Hardware Actuator:</span>
            <span className="font-mono text-emerald-700">GPIO26 Opto-Relay</span>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-900">
          <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
          <p>
            You are sending an instantaneous hardware command to the physical ESP32 relay module. Make sure no sensitive manual operation is interrupted.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition ${actionColor} ${
              isProcessing ? 'opacity-70 cursor-wait' : ''
            }`}
          >
            <Power className="h-4 w-4" />
            <span>{isProcessing ? 'Sending Signal...' : `Yes, ${actionText}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
