export type PageTab =
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

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
}

export type DataMode = 'LIVE DATA' | 'DEMO DATA' | 'PREDICTED DATA';

export interface SensorReading {
  timestamp: string;
  device_id: string;
  device_name: string;
  voltage: number;      // V (e.g. 231 V)
  current: number;      // A (e.g. 0.31 A)
  power: number;        // W (e.g. 72 W)
  energy: number;       // kWh
  room: string;
  power_factor: number; // e.g. 0.98
  frequency: number;    // Hz (e.g. 50.0 Hz)
}

export interface Appliance {
  id: string;
  name: string;
  room: string;
  type: 'fan' | 'lamp' | 'laptop' | 'ac' | 'refrigerator' | 'heater' | 'other';
  status: 'online' | 'offline';
  current_power: number;  // W
  voltage: number;        // V
  current: number;        // A
  energy_today: number;   // kWh
  estimated_cost: number; // ₹
  is_abnormal: boolean;
  abnormality_note?: string;
  relay_state: boolean;   // true = ON, false = OFF
  eco_rating: number;     // 1 to 5 stars
  daily_limit_kwh: number;
  carbon_footprint_kg: number;
  icon_name: string;
}

export interface RoomUsage {
  room: string;
  energy_kwh: number;
  percentage: number;
  appliance_count: number;
  active_load_w: number;
  carbon_kg: number;
  color: string;
}

export interface ConsumptionDataPoint {
  timeLabel: string;
  actual: number;
  previous: number;
  peak: number;
  average: number;
  isPeakHour?: boolean;
}

export interface PredictionDataPoint {
  date: string;
  label: string;
  actual?: number;
  predicted: number;
  confidence: number;
  lowerBound: number;
  upperBound: number;
  isForecast: boolean;
}

export interface AlertItem {
  id: string;
  severity: 'critical' | 'warning' | 'info' | 'resolved';
  device: string;
  room: string;
  timestamp: string;
  message: string;
  expected_value: string;
  actual_value: string;
  difference: string;
  ai_explanation: string;
  recommended_action: string;
  status: 'active' | 'investigating' | 'dismissed' | 'resolved';
}

export interface RecommendationItem {
  id: string;
  title: string;
  category: 'efficiency' | 'standby' | 'peak_hours' | 'equipment';
  reason: string;
  estimated_energy_saving: string;
  estimated_cost_saving: string;
  carbon_saving_kg: number;
  confidence: number;
  status: 'pending' | 'applied' | 'dismissed';
  impact_level: 'High' | 'Medium' | 'Low';
  action_label: string;
}

export interface HardwareNode {
  id: string;
  name: string;
  subtitle: string;
  category: 'sensor' | 'controller' | 'network' | 'backend' | 'ai' | 'dashboard' | 'actuator';
  description: string;
  specs: { [key: string]: string };
  pinout?: string;
  status: 'active' | 'standby' | 'transmitting';
  status_label: string;
}

export interface HardwareBOMItem {
  component: string;
  model: string;
  quantity: number;
  role: string;
  pinConnection: string;
  voltageRating: string;
  status: 'operational' | 'ready';
}

export interface SystemHealth {
  esp32_status: 'CONNECTED' | 'DISCONNECTED';
  wifi_status: 'CONNECTED' | 'DISCONNECTED';
  api_status: 'OPERATIONAL' | 'DEGRADED';
  database_status: 'OPERATIONAL' | 'DEGRADED';
  ai_engine_status: 'READY' | 'TRAINING';
  last_sensor_update: string;
  rssi: number;
  ping_ms: number;
  packet_loss_pct: number;
  voltage_grid: number;
  frequency: number;
  eco_score: number;
}

export interface TariffSettings {
  rate_per_kwh: number;
  currency_symbol: string;
  peak_hours_start: string;
  peak_hours_end: string;
  peak_multiplier: number;
  eco_mode_active: boolean;
  refresh_interval_sec: number;
  budget_monthly_kwh: number;
}
