import {
  Appliance,
  RoomUsage,
  ConsumptionDataPoint,
  PredictionDataPoint,
  AlertItem,
  RecommendationItem,
  SystemHealth,
  TariffSettings,
  DataMode,
  SensorReading,
} from '../types';
import {
  initialAppliances,
  initialRooms,
  dayConsumptionData,
  weekConsumptionData,
  monthConsumptionData,
  forecastData,
  initialAlerts,
  initialRecommendations,
  initialSystemHealth,
  initialTariff,
} from './mockData';

class EcoMindAPIService {
  private appliances: Appliance[] = JSON.parse(JSON.stringify(initialAppliances));
  private rooms: RoomUsage[] = JSON.parse(JSON.stringify(initialRooms));
  private alerts: AlertItem[] = JSON.parse(JSON.stringify(initialAlerts));
  private recommendations: RecommendationItem[] = JSON.parse(JSON.stringify(initialRecommendations));
  private systemHealth: SystemHealth = { ...initialSystemHealth };
  private tariff: TariffSettings = { ...initialTariff };
  private dataMode: DataMode = 'LIVE DATA';
  private subscribers: Array<() => void> = [];
  private liveReadingsHistory: SensorReading[] = [];
  private tickerInterval: any = null;

  constructor() {
    this.initHistory();
    this.startLiveSimulation();
  }

  private initHistory() {
    const now = Date.now();
    for (let i = 20; i >= 0; i--) {
      const time = new Date(now - i * 2000).toLocaleTimeString([], { hour12: false });
      this.liveReadingsHistory.push({
        timestamp: time,
        device_id: 'esp32_sens_01',
        device_name: 'Living Room Fan',
        voltage: 231.0 + (Math.random() * 1.6 - 0.8),
        current: 0.31 + (Math.random() * 0.04 - 0.02),
        power: Math.round(72 + (Math.random() * 4 - 2)),
        energy: 1.84,
        room: 'Living Room',
        power_factor: 0.98,
        frequency: 50.0 + (Math.random() * 0.06 - 0.03),
      });
    }
  }

  private startLiveSimulation() {
    if (this.tickerInterval) clearInterval(this.tickerInterval);
    this.tickerInterval = setInterval(() => {
      if (this.dataMode === 'LIVE DATA') {
        this.pulseLiveTelemetry();
      }
    }, this.tariff.refresh_interval_sec * 1000);
  }

  private pulseLiveTelemetry() {
    // Slight realistic fluctuation for connected appliances
    const jitterVolt = (Math.random() * 1.8 - 0.9);
    const volt = Number((231.2 + jitterVolt).toFixed(1));
    this.systemHealth.voltage_grid = volt;
    this.systemHealth.last_sensor_update = 'Just now';
    this.systemHealth.frequency = Number((50.0 + (Math.random() * 0.08 - 0.04)).toFixed(2));

    this.appliances = this.appliances.map(app => {
      if (app.relay_state && app.status === 'online') {
        const pJitter = (Math.random() * 3 - 1.5);
        let newP = Math.max(5, Math.round(app.current_power + pJitter));
        if (app.id === 'app-fan') {
          // fan is 70-75W
          newP = Math.round(72 + (Math.random() * 4 - 2));
        }
        const newCurr = Number((newP / volt / 0.98).toFixed(2));
        return {
          ...app,
          current_power: newP,
          voltage: volt,
          current: newCurr,
        };
      }
      return app;
    });

    // Append new reading
    const fan = this.appliances.find(a => a.id === 'app-fan');
    const nowTime = new Date().toLocaleTimeString([], { hour12: false });
    this.liveReadingsHistory.push({
      timestamp: nowTime,
      device_id: 'esp32_sens_01',
      device_name: fan?.name || 'Ceiling Fan',
      voltage: volt,
      current: fan ? fan.current : 0.31,
      power: fan ? fan.current_power : 72,
      energy: fan ? fan.energy_today : 1.84,
      room: fan ? fan.room : 'Living Room',
      power_factor: 0.98,
      frequency: this.systemHealth.frequency,
    });

    if (this.liveReadingsHistory.length > 25) {
      this.liveReadingsHistory.shift();
    }

    this.notifySubscribers();
  }

  public subscribe(callback: () => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(cb => {
      try {
        cb();
      } catch (err) {
        console.error('Subscriber error:', err);
      }
    });
  }

  // REST API Client Methods
  public async getDashboardData() {
    return {
      totalConsumptionKwh: 4.82,
      consumptionDeltaPercent: -12, // ↓ 12% vs yesterday
      estimatedCost: Number((4.82 * this.tariff.rate_per_kwh).toFixed(2)), // ₹28.92 at ₹6/kWh
      costDeltaPercent: -15, // ↓ 15% vs yesterday
      predictedTomorrowKwh: 5.10,
      activeAlertsCount: this.alerts.filter(a => a.status === 'active').length,
      ecoScore: this.systemHealth.eco_score,
      carbonAvoidedKg: 3.95,
      treesEquivalent: 2.8,
      cleanEnergyRatio: 74,
      greenHoursActive: false,
      dataMode: this.dataMode,
      appliances: [...this.appliances],
      rooms: [...this.rooms],
    };
  }

  public async getAppliances(): Promise<Appliance[]> {
    return [...this.appliances];
  }

  public async getReadings(): Promise<SensorReading[]> {
    return [...this.liveReadingsHistory];
  }

  public async getLatestReading(): Promise<SensorReading> {
    return this.liveReadingsHistory[this.liveReadingsHistory.length - 1];
  }

  public async getAnalytics() {
    return {
      day: dayConsumptionData,
      week: weekConsumptionData,
      month: monthConsumptionData,
      totalEnergyKwh: 4.82,
      avgDailyEnergyKwh: 4.95,
      peakPowerW: 342,
      estimatedMonthlyBill: Math.round(4.95 * 30 * this.tariff.rate_per_kwh),
      carbonEmissionsKg: Number((4.82 * 0.82).toFixed(2)),
      efficiencyTrendPercent: 8.4, // 8.4% improvement
    };
  }

  public async getForecast(): Promise<PredictionDataPoint[]> {
    return [...forecastData];
  }

  public async getAlerts(): Promise<AlertItem[]> {
    return [...this.alerts];
  }

  public async getRecommendations(): Promise<RecommendationItem[]> {
    return [...this.recommendations];
  }

  public async getSystemHealth(): Promise<SystemHealth> {
    return { ...this.systemHealth };
  }

  public async getTariff(): Promise<TariffSettings> {
    return { ...this.tariff };
  }

  public async updateTariff(newTariff: Partial<TariffSettings>) {
    this.tariff = { ...this.tariff, ...newTariff };
    if (newTariff.refresh_interval_sec) {
      this.startLiveSimulation();
    }
    // Update calculated costs
    this.appliances = this.appliances.map(a => ({
      ...a,
      estimated_cost: Number((a.energy_today * this.tariff.rate_per_kwh).toFixed(2)),
    }));
    this.notifySubscribers();
    return { ...this.tariff };
  }

  public async setRelayControl(deviceId: string, targetState: boolean): Promise<Appliance> {
    const appIndex = this.appliances.findIndex(a => a.id === deviceId);
    if (appIndex === -1) {
      throw new Error(`Device ${deviceId} not found`);
    }

    this.appliances[appIndex].relay_state = targetState;
    if (!targetState) {
      this.appliances[appIndex].current_power = 0;
      this.appliances[appIndex].current = 0;
    } else {
      this.appliances[appIndex].current_power = this.appliances[appIndex].id === 'app-fan' ? 72 : 24;
      this.appliances[appIndex].current = Number((this.appliances[appIndex].current_power / 231 / 0.98).toFixed(2));
    }

    this.notifySubscribers();
    return this.appliances[appIndex];
  }

  public async dismissAlert(alertId: string) {
    this.alerts = this.alerts.map(a => a.id === alertId ? { ...a, status: 'dismissed' } : a);
    this.notifySubscribers();
    return { success: true };
  }

  public async investigateAlert(alertId: string) {
    this.alerts = this.alerts.map(a => a.id === alertId ? { ...a, status: 'investigating' } : a);
    this.notifySubscribers();
    return { success: true };
  }

  public async applyRecommendation(recId: string) {
    this.recommendations = this.recommendations.map(r => r.id === recId ? { ...r, status: 'applied' } : r);
    // Applying an eco recommendation boosts eco-score!
    this.systemHealth.eco_score = Math.min(99, this.systemHealth.eco_score + 3);
    this.notifySubscribers();
    return { success: true };
  }

  public async dismissRecommendation(recId: string) {
    this.recommendations = this.recommendations.map(r => r.id === recId ? { ...r, status: 'dismissed' } : r);
    this.notifySubscribers();
    return { success: true };
  }

  public setDataMode(mode: DataMode) {
    this.dataMode = mode;
    this.notifySubscribers();
  }

  public getDataMode(): DataMode {
    return this.dataMode;
  }

  // Synchronous State Getters for React Hooks
  public getAppliancesSync(): Appliance[] {
    return [...this.appliances];
  }

  public getRoomsSync(): RoomUsage[] {
    return [...this.rooms];
  }

  public getAlertsSync(): AlertItem[] {
    return [...this.alerts];
  }

  public getRecommendationsSync(): RecommendationItem[] {
    return [...this.recommendations];
  }

  public getSystemHealthSync(): SystemHealth {
    return { ...this.systemHealth };
  }

  public getTariffSync(): TariffSettings {
    return { ...this.tariff };
  }

  public getLiveReadingsSync(): SensorReading[] {
    return [...this.liveReadingsHistory];
  }

  public getForecastSync(): PredictionDataPoint[] {
    return [...forecastData];
  }

  public getDayConsumptionSync(): ConsumptionDataPoint[] {
    return [...dayConsumptionData];
  }

  public getWeekConsumptionSync(): ConsumptionDataPoint[] {
    return [...weekConsumptionData];
  }

  public getMonthConsumptionSync(): ConsumptionDataPoint[] {
    return [...monthConsumptionData];
  }

  public setApplianceRelayState(deviceId: string, targetState: boolean): Appliance {
    const appIndex = this.appliances.findIndex(a => a.id === deviceId);
    if (appIndex !== -1) {
      this.appliances[appIndex].relay_state = targetState;
      if (!targetState) {
        this.appliances[appIndex].current_power = 0;
        this.appliances[appIndex].current = 0;
      } else {
        this.appliances[appIndex].current_power = this.appliances[appIndex].id === 'app-fan' ? 72 : 24;
        this.appliances[appIndex].current = Number((this.appliances[appIndex].current_power / 231 / 0.98).toFixed(2));
      }
      this.notifySubscribers();
      return this.appliances[appIndex];
    }
    throw new Error(`Device ${deviceId} not found`);
  }

  public applyRecommendationSync(recId: string): boolean {
    this.recommendations = this.recommendations.map(r => r.id === recId ? { ...r, status: 'applied' } : r);
    this.systemHealth.eco_score = Math.min(99, this.systemHealth.eco_score + 3);
    this.notifySubscribers();
    return true;
  }

  public dismissRecommendationSync(recId: string): boolean {
    this.recommendations = this.recommendations.map(r => r.id === recId ? { ...r, status: 'dismissed' } : r);
    this.notifySubscribers();
    return true;
  }

  public dismissAlertSync(alertId: string): boolean {
    this.alerts = this.alerts.map(a => a.id === alertId ? { ...a, status: 'dismissed' } : a);
    this.notifySubscribers();
    return true;
  }

  public updateTariffSync(newTariff: Partial<TariffSettings>): TariffSettings {
    this.tariff = { ...this.tariff, ...newTariff };
    if (newTariff.refresh_interval_sec) {
      this.startLiveSimulation();
    }
    this.appliances = this.appliances.map(a => ({
      ...a,
      estimated_cost: Number((a.energy_today * this.tariff.rate_per_kwh).toFixed(2)),
    }));
    this.notifySubscribers();
    return { ...this.tariff };
  }
}

export const apiService = new EcoMindAPIService();
