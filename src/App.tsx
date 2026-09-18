import React, { useState, useEffect } from 'react';
import {
  PageTab,
  DataMode,
  Appliance,
  RoomUsage,
  AlertItem,
  RecommendationItem,
  SystemHealth,
  TariffSettings,
  SensorReading,
  ConsumptionDataPoint,
  PredictionDataPoint,
} from './types';
import { apiService } from './services/apiService';
import { Sidebar, PageId } from './components/Sidebar';
import { Header } from './components/Header';
import { TopNavBar } from './components/TopNavBar';
import { Chatbot } from './components/Chatbot';
import { ToastContainer, ToastMessage } from './components/Toast';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { AppliancesPage } from './pages/AppliancesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AiIntelligencePage } from './pages/AiIntelligencePage';
import { AlertsPage } from './pages/AlertsPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { HardwarePage } from './pages/HardwarePage';
import { SettingsPage } from './pages/SettingsPage';

import {
  LayoutDashboard,
  Activity,
  Cpu,
  Zap,
  BrainCircuit,
} from 'lucide-react';

export default function App() {
  // Read initial page from hash if available
  const getInitialPage = (): PageId => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as PageId;
      const validPages: PageId[] = [
        'dashboard',
        'live',
        'appliances',
        'analytics',
        'ai',
        'alerts',
        'recommendations',
        'hardware',
        'settings',
        'landing',
      ];
      if (validPages.includes(hash)) {
        return hash;
      }
    }
    return 'dashboard';
  };

  const [currentPage, setCurrentPage] = useState<PageId>(getInitialPage());
  const [dataMode, setDataMode] = useState<DataMode>(apiService.getDataMode());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Synchronous initial state from the API service
  const [appliances, setAppliances] = useState<Appliance[]>(apiService.getAppliancesSync());
  const [rooms, setRooms] = useState<RoomUsage[]>(apiService.getRoomsSync());
  const [alerts, setAlerts] = useState<AlertItem[]>(apiService.getAlertsSync());
  const [tariff, setTariff] = useState<TariffSettings>(apiService.getTariffSync());
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(apiService.getRecommendationsSync());
  const [systemHealth, setSystemHealth] = useState<SystemHealth>(apiService.getSystemHealthSync());
  const [readings, setReadings] = useState<SensorReading[]>(apiService.getLiveReadingsSync());
  const [forecastData, setForecastData] = useState<PredictionDataPoint[]>(apiService.getForecastSync());
  const [dayData, setDayData] = useState<ConsumptionDataPoint[]>(apiService.getDayConsumptionSync());
  const [weekData, setWeekData] = useState<ConsumptionDataPoint[]>(apiService.getWeekConsumptionSync());
  const [monthData, setMonthData] = useState<ConsumptionDataPoint[]>(apiService.getMonthConsumptionSync());

  // Listen to browser hash changes (back/forward navigation)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageId;
      const validPages: PageId[] = [
        'dashboard',
        'live',
        'appliances',
        'analytics',
        'ai',
        'alerts',
        'recommendations',
        'hardware',
        'settings',
        'landing',
      ];
      if (validPages.includes(hash) && hash !== currentPage) {
        setCurrentPage(hash);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentPage]);

  // Robust Unified Navigation Function
  const navigateTo = (page: PageId) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Subscribe to live telemetry pulse
  useEffect(() => {
    const unsubscribe = apiService.subscribe(() => {
      setAppliances(apiService.getAppliancesSync());
      setRooms(apiService.getRoomsSync());
      setAlerts(apiService.getAlertsSync());
      setRecommendations(apiService.getRecommendationsSync());
      setSystemHealth(apiService.getSystemHealthSync());
      setReadings(apiService.getLiveReadingsSync());
      setTariff(apiService.getTariffSync());
    });
    return () => unsubscribe();
  }, []);

  // Toast Helper
  const showToast = (title: string, message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: Date.now().toString(),
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Change Data Mode
  const handleChangeDataMode = (newMode: DataMode) => {
    setDataMode(newMode);
    apiService.setDataMode(newMode);
    showToast('Data Pipeline Updated', `Switched telemetry stream to ${newMode}.`);
  };

  // Remote Relay Load Control
  const handleToggleRelay = (appliance: Appliance, targetState: boolean) => {
    try {
      apiService.setApplianceRelayState(appliance.id, targetState);
      const actionText = targetState ? 'Engaged (Power ON)' : 'Isolated (Power OFF)';
      showToast(
        'Remote Load Control Actuated',
        `${appliance.name} in ${appliance.room} is now ${actionText}.`,
        targetState ? 'success' : 'warning'
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Apply AI Recommendation
  const handleApplyRecommendation = (id: string) => {
    apiService.applyRecommendationSync(id);
    showToast('AI Rule Activated', 'Automated energy-saving schedule dispatched to ESP32 controller.');
  };

  // Dismiss Recommendation
  const handleDismissRecommendation = (id: string) => {
    apiService.dismissRecommendationSync(id);
    showToast('Recommendation Dismissed', 'AI model adjusted prioritization weights.', 'info');
  };

  // Dismiss Alert
  const handleDismissAlert = (id: string) => {
    apiService.dismissAlertSync(id);
    showToast('Alert Dismissed', 'Alert archived to historical event log.', 'info');
  };

  // Investigate Alert
  const handleInvestigateAlert = (id: string) => {
    navigateTo('appliances');
    showToast('Circuit Inspector', 'Navigated to Appliances view for hardware inspection.');
  };

  // Update Tariff
  const handleUpdateTariff = (newTariff: Partial<TariffSettings>) => {
    const updated = apiService.updateTariffSync(newTariff);
    setTariff(updated);
  };

  // Full Screen Landing Page View
  if (currentPage === 'landing') {
    return (
      <LandingPage
        onEnterDashboard={() => navigateTo('dashboard')}
        onExploreHardware={() => navigateTo('hardware')}
      />
    );
  }

  const activeAlertCount = alerts.filter((a) => a.status === 'active').length;
  const latestReading = readings[readings.length - 1];

  return (
    <div className="flex min-h-screen bg-[#F8FAF8] text-stone-900 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-200">
      {/* Sidebar Navigation (Desktop / Full Drawer) */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={navigateTo}
        activeAlertCount={activeAlertCount}
        dataMode={dataMode}
        onChangeDataMode={handleChangeDataMode}
        onOpenLanding={() => navigateTo('landing')}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Contextual Top Header with Dynamic Title & Chatbot launcher */}
        <Header
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          dataMode={dataMode}
          alerts={alerts}
          onNavigateToAlerts={() => navigateTo('alerts')}
          tariffRate={tariff.rate_per_kwh}
          currentPage={currentPage}
          onOpenChatbot={() => setIsChatbotOpen(true)}
        />

        {/* Persistent Top Navigation Bar for Direct View Switching */}
        <TopNavBar
          currentPage={currentPage}
          onSelectPage={navigateTo}
          activeAlertCount={activeAlertCount}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          <div key={currentPage} className="animate-in fade-in duration-200">
            {currentPage === 'dashboard' && (
              <DashboardPage
                appliances={appliances}
                rooms={rooms}
                dayData={dayData}
                weekData={weekData}
                monthData={monthData}
                forecastData={forecastData}
                alerts={alerts}
                tariff={tariff}
                readings={readings}
                systemHealth={systemHealth}
                onNavigate={navigateTo}
                onInvestigateAlert={handleInvestigateAlert}
                onDismissAlert={handleDismissAlert}
              />
            )}

            {currentPage === 'live' && (
              <LiveMonitoringPage
                appliances={appliances}
                readings={readings}
                tariff={tariff}
                onNavigateToHardware={() => navigateTo('hardware')}
              />
            )}

            {currentPage === 'appliances' && (
              <AppliancesPage
                appliances={appliances}
                tariff={tariff}
                onToggleRelay={handleToggleRelay}
                onNavigateToHardware={() => navigateTo('hardware')}
              />
            )}

            {currentPage === 'analytics' && (
              <AnalyticsPage tariff={tariff} />
            )}

            {currentPage === 'ai' && (
              <AiIntelligencePage
                forecastData={forecastData}
                recommendations={recommendations}
                tariff={tariff}
                onApplyRecommendation={handleApplyRecommendation}
                onNavigateToRecommendations={() => navigateTo('recommendations')}
              />
            )}

            {currentPage === 'alerts' && (
              <AlertsPage
                alerts={alerts}
                onInvestigate={handleInvestigateAlert}
                onDismiss={handleDismissAlert}
                onNavigateToAppliances={() => navigateTo('appliances')}
              />
            )}

            {currentPage === 'recommendations' && (
              <RecommendationsPage
                recommendations={recommendations}
                tariff={tariff}
                onApply={handleApplyRecommendation}
                onDismiss={handleDismissRecommendation}
              />
            )}

            {currentPage === 'hardware' && (
              <HardwarePage systemHealth={systemHealth} />
            )}

            {currentPage === 'settings' && (
              <SettingsPage
                tariff={tariff}
                dataMode={dataMode}
                onUpdateTariff={handleUpdateTariff}
                onChangeDataMode={handleChangeDataMode}
                onShowToast={(t, m) => showToast(t, m)}
              />
            )}
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav
          id="mobile-bottom-nav"
          className="lg:hidden sticky bottom-0 z-40 flex items-center justify-around border-t border-stone-200/90 bg-white/95 px-2 py-2 backdrop-blur-md shadow-lg"
          aria-label="Mobile bottom navigation"
        >
          <button
            id="mobile-nav-dashboard"
            onClick={() => navigateTo('dashboard')}
            className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition cursor-pointer ${
              currentPage === 'dashboard'
                ? 'bg-emerald-100/70 text-emerald-800 font-bold shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <LayoutDashboard className={`h-5 w-5 ${currentPage === 'dashboard' ? 'text-emerald-700' : ''}`} />
            <span>Dashboard</span>
          </button>

          <button
            id="mobile-nav-live"
            onClick={() => navigateTo('live')}
            className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition cursor-pointer ${
              currentPage === 'live'
                ? 'bg-emerald-100/70 text-emerald-800 font-bold shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Activity className={`h-5 w-5 ${currentPage === 'live' ? 'text-emerald-700' : ''}`} />
            <span>Live Stream</span>
          </button>

          <button
            id="mobile-nav-appliances"
            onClick={() => navigateTo('appliances')}
            className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition cursor-pointer ${
              currentPage === 'appliances'
                ? 'bg-emerald-100/70 text-emerald-800 font-bold shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Zap className={`h-5 w-5 ${currentPage === 'appliances' ? 'text-emerald-700' : ''}`} />
            <span>Appliances</span>
          </button>

          <button
            id="mobile-nav-ai"
            onClick={() => navigateTo('ai')}
            className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition cursor-pointer ${
              currentPage === 'ai'
                ? 'bg-emerald-100/70 text-emerald-800 font-bold shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <BrainCircuit className={`h-5 w-5 ${currentPage === 'ai' ? 'text-emerald-700' : ''}`} />
            <span>AI Intel</span>
          </button>

          <button
            id="mobile-nav-hardware"
            onClick={() => navigateTo('hardware')}
            className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition cursor-pointer ${
              currentPage === 'hardware'
                ? 'bg-emerald-100/70 text-emerald-800 font-bold shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Cpu className={`h-5 w-5 ${currentPage === 'hardware' ? 'text-emerald-700' : ''}`} />
            <span>ESP32</span>
          </button>
        </nav>
      </div>

      {/* Global Interactive AI Chatbot */}
      <Chatbot
        isOpen={isChatbotOpen}
        onOpen={() => setIsChatbotOpen(true)}
        onClose={() => setIsChatbotOpen(false)}
        appliances={appliances}
        latestReading={latestReading}
        tariff={tariff}
        alerts={alerts}
        systemHealth={systemHealth}
        onToggleRelay={handleToggleRelay}
        onNavigate={navigateTo}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
