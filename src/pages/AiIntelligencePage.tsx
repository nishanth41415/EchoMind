import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Calendar,
  Clock,
  Zap,
  Leaf,
  ChevronRight,
  Send,
  HelpCircle,
  BarChart2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { PredictionDataPoint, RecommendationItem, TariffSettings } from '../types';

interface AiIntelligencePageProps {
  forecastData: PredictionDataPoint[];
  recommendations: RecommendationItem[];
  tariff: TariffSettings;
  onApplyRecommendation: (id: string) => void;
  onNavigateToRecommendations: () => void;
}

export const AiIntelligencePage: React.FC<AiIntelligencePageProps> = ({
  forecastData,
  recommendations,
  tariff,
  onApplyRecommendation,
  onNavigateToRecommendations,
}) => {
  const [selectedHorizon, setSelectedHorizon] = useState<'hour' | 'tomorrow' | '7days'>('tomorrow');
  const [userQuery, setUserQuery] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am the EcoMind Autonomous Energy Advisor. I analyze real-time ESP32 voltage and current telemetry to detect anomalies, eliminate vampire loads, and forecast demand. How can I optimize your energy efficiency today?',
    },
  ]);

  // Anomaly comparison data (Normal vs Detected Pattern between 16:00 and 23:00)
  const anomalyTimelineData = [
    { time: '16:00', normal: 52, detected: 54, deviationPct: '+3.8%' },
    { time: '17:00', normal: 55, detected: 58, deviationPct: '+5.4%' },
    { time: '18:00', normal: 52, detected: 74, deviationPct: '+42.3%', isAnomaly: true },
    { time: '19:00', normal: 50, detected: 72, deviationPct: '+44.0%', isAnomaly: true },
    { time: '20:00', normal: 52, detected: 73, deviationPct: '+40.3%', isAnomaly: true },
    { time: '21:00', normal: 50, detected: 68, deviationPct: '+36.0%', isAnomaly: true },
    { time: '22:00', normal: 48, detected: 53, deviationPct: '+10.4%' },
    { time: '23:00', normal: 45, detected: 46, deviationPct: '+2.2%' },
  ];

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const query = userQuery;
    setUserQuery('');
    setChatLog((prev) => [...prev, { sender: 'user', text: query }]);

    setTimeout(() => {
      let reply =
        'Based on historical regression across your circuits: shifting high-draw appliances to the 11:00-15:00 window synchronizes with solar generation, saving approximately ₹120/month. Also, your living room fan bearing should be lubricated to reduce mechanical draw from 72W back to 52W.';
      if (query.toLowerCase().includes('fan')) {
        reply =
          'The living room fan is currently drawing 72W instead of its rated 52W (a +42% anomaly). This is adding ₹2.88 extra cost each day. We recommend checking the regulator contacts and applying the Eco-Speed rule.';
      } else if (query.toLowerCase().includes('standby') || query.toLowerCase().includes('laptop')) {
        reply =
          'Standby vampire power on your bedroom laptop workstation consumes ~14W continuously overnight. Enabling night auto-relay cutoff saves ~0.85 kWh/day (₹153/month).';
      }
      setChatLog((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="rounded-2xl border border-emerald-200/90 bg-linear-to-r from-emerald-50/80 via-white to-teal-50/50 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-100">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                AI / ML Core Engine
              </span>
            </div>
            <h2 className="mt-3 font-['Outfit',sans-serif] text-2xl sm:text-3xl font-bold text-stone-900">
              AI Energy Intelligence
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Your energy data, understood. Continuous anomaly detection, SARIMAX consumption forecasting, and autonomous eco-optimization.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="rounded-xl border border-emerald-200 bg-white/90 px-4 py-2.5 text-center shadow-2xs backdrop-blur-xs">
              <div className="text-[11px] font-medium text-stone-500">ML Confidence</div>
              <div className="font-['Outfit',sans-serif] text-xl font-bold text-emerald-700">94.2%</div>
            </div>
            <div className="rounded-xl border border-teal-200 bg-white/90 px-4 py-2.5 text-center shadow-2xs backdrop-blur-xs">
              <div className="text-[11px] font-medium text-stone-500">Anomaly Engine</div>
              <div className="font-['Outfit',sans-serif] text-xl font-bold text-teal-700">Active (3.2σ)</div>
            </div>
          </div>
        </div>
      </div>

      {/* MODULE 1: CONSUMPTION FORECASTING */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600 font-bold text-xs">
                1
              </span>
              <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-stone-900">
                Consumption Forecasting Engine
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Trained on 30-day rolling time-series datasets with SARIMAX + weather regression.
            </p>
          </div>

          {/* Horizon switcher */}
          <div className="flex rounded-xl bg-stone-100 p-1">
            <button
              onClick={() => setSelectedHorizon('hour')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                selectedHorizon === 'hour'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Next Hour
            </button>
            <button
              onClick={() => setSelectedHorizon('tomorrow')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                selectedHorizon === 'tomorrow'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Tomorrow (5.10 kWh)
            </button>
            <button
              onClick={() => setSelectedHorizon('7days')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                selectedHorizon === '7days'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Next 7 Days
            </button>
          </div>
        </div>

        {/* Prediction summary banner */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5">
            <span className="text-[10px] font-bold uppercase text-blue-700">Next Hour</span>
            <div className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900 mt-0.5">
              0.48 kWh <span className="text-xs text-stone-500 font-normal">(-4% vs avg)</span>
            </div>
            <span className="text-[10px] text-blue-600 font-semibold">96% Prediction Confidence</span>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 ring-1 ring-emerald-300">
            <span className="text-[10px] font-bold uppercase text-emerald-800">Tomorrow (Sep 19)</span>
            <div className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900 mt-0.5">
              5.10 kWh <span className="text-xs text-emerald-700 font-semibold">(₹30.60)</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold">94% Prediction Confidence</span>
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-3.5">
            <span className="text-[10px] font-bold uppercase text-stone-600">Next 7-Day Cumulative</span>
            <div className="font-['Outfit',sans-serif] text-xl font-bold text-stone-900 mt-0.5">
              34.8 kWh <span className="text-xs text-stone-500 font-normal">(est. ₹208.80)</span>
            </div>
            <span className="text-[10px] text-stone-600 font-semibold">91% Prediction Confidence</span>
          </div>
        </div>

        {/* Forecast Graph */}
        <div className="mt-6 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B7280' }} />
              <YAxis domain={[3.5, 6.0]} tick={{ fontSize: 11, fill: '#6B7280' }} unit=" kWh" />
              <Tooltip
                contentStyle={{ borderRadius: '12px', fontSize: '11px' }}
                formatter={(val: any, name: any) => [`${val} kWh`, name]}
              />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: 12, paddingBottom: 10 }} />
              <Area
                type="monotone"
                dataKey="actual"
                name="Historical Actual"
                fill="#10B981"
                fillOpacity={0.15}
                stroke="#10B981"
                strokeWidth={2.5}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                name="AI Predicted Consumption"
                stroke="#3B82F6"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                dot={{ r: 5, fill: '#3B82F6' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MODULE 2: ANOMALY DETECTION ENGINE */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-amber-800 font-bold text-xs">
              2
            </span>
            <div>
              <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-stone-900">
                Anomaly Detection Engine (Z-Score & Isolation Forest)
              </h3>
              <p className="text-xs text-stone-500">
                Detects deviations from appliance mathematical operating signatures in real time.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900">
            1 Active Anomaly
          </span>
        </div>

        {/* Anomaly Case Breakdown */}
        <div className="mt-4 rounded-xl border border-amber-200 bg-linear-to-r from-amber-50/80 via-white to-amber-50/50 p-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
              <span className="font-bold text-amber-950 text-sm">
                Fan consumption is 42% higher than its normal pattern between 6 PM and 9 PM.
              </span>
            </div>
            <span className="font-mono text-amber-900 font-bold bg-amber-100/70 px-2 py-0.5 rounded">
              Deviation: +42.3%
            </span>
          </div>
          <p className="mt-2 text-stone-600 leading-relaxed">
            The Living Room ceiling fan is drawing <strong>72 W</strong> continuous power compared to the <strong>52 W</strong> historical baseline. This represents a 3.4σ deviation outside normal distribution bounds. Possible causes: mechanical bearing dust accumulation or prolonged max-speed operation while the living room is unoccupied.
          </p>
        </div>

        {/* Anomaly Timeline Visualization */}
        <div className="mt-6">
          <div className="text-xs font-bold text-stone-800 mb-2 flex items-center justify-between">
            <span>Hourly Anomaly Signature: Normal Pattern vs Detected Pattern</span>
            <div className="flex items-center gap-3 text-[11px] font-normal text-stone-500">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-stone-300" /> Normal Pattern (50-52W)
              </span>
              <span className="flex items-center gap-1 text-rose-600 font-medium">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Detected Anomaly (72-74W)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {anomalyTimelineData.map((slot) => (
              <div
                key={slot.time}
                className={`rounded-xl border p-3 text-center transition ${
                  slot.isAnomaly
                    ? 'border-rose-300 bg-rose-50/60 ring-2 ring-rose-200'
                    : 'border-stone-100 bg-stone-50/60'
                }`}
              >
                <div className="text-[10px] font-semibold text-stone-500">{slot.time}</div>
                <div className="mt-1 font-mono text-xs font-bold text-stone-900">
                  {slot.detected} W
                </div>
                <div className="text-[10px] text-stone-400">norm: {slot.normal}W</div>
                <div
                  className={`mt-1 text-[10px] font-bold rounded px-1 py-0.5 inline-block ${
                    slot.isAnomaly ? 'bg-rose-100 text-rose-800' : 'bg-stone-200/60 text-stone-600'
                  }`}
                >
                  {slot.deviationPct}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODULE 3: AI RECOMMENDATIONS */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs">
              3
            </span>
            <div>
              <h3 className="font-['Outfit',sans-serif] text-lg font-bold text-stone-900">
                Actionable AI Recommendations
              </h3>
              <p className="text-xs text-stone-500">Autonomous energy-saving and carbon reduction recipes</p>
            </div>
          </div>
          <button
            onClick={onNavigateToRecommendations}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`flex flex-col justify-between rounded-xl border p-4.5 transition ${
                rec.status === 'applied'
                  ? 'border-emerald-200 bg-emerald-50/40 opacity-80'
                  : 'border-stone-200/90 bg-white hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                      <Lightbulb className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {rec.confidence}% Confidence
                    </span>
                  </div>
                  {rec.status === 'applied' && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Applied
                    </span>
                  )}
                </div>

                <h4 className="mt-3 font-['Outfit',sans-serif] text-base font-bold text-stone-900 leading-snug">
                  {rec.title}
                </h4>
                <p className="mt-1 text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {rec.reason}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-stone-50 p-2.5 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400">Energy Saving</span>
                    <div className="font-bold text-emerald-700">{rec.estimated_energy_saving}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400">Cost Saving</span>
                    <div className="font-bold text-stone-900">{rec.estimated_cost_saving}</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] text-stone-400">Impact: {rec.impact_level}</span>
                {rec.status !== 'applied' ? (
                  <button
                    id={`btn-apply-${rec.id}`}
                    onClick={() => onApplyRecommendation(rec.id)}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs transition"
                  >
                    {rec.action_label}
                  </button>
                ) : (
                  <span className="text-xs text-emerald-700 font-semibold">Active in System</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INTERACTIVE ECO-ADVISOR COPILOT */}
      <div className="rounded-2xl border border-stone-200/90 bg-white p-6 shadow-xs">
        <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-600 to-teal-700 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-['Outfit',sans-serif] text-base font-bold text-stone-900">
              Interactive EcoMind AI Advisor
            </h3>
            <p className="text-xs text-stone-500">
              Query telemetry models, ask for circuit diagnostics, or request custom energy reduction recipes.
            </p>
          </div>
        </div>

        {/* Chat History */}
        <div className="mt-4 max-h-60 overflow-y-auto space-y-3 p-1">
          {chatLog.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 font-bold">
                  AI
                </div>
              )}
              <div
                className={`max-w-xl rounded-2xl p-3.5 ${
                  msg.sender === 'user'
                    ? 'bg-stone-900 text-white rounded-br-xs'
                    : 'border border-stone-200 bg-stone-50 text-stone-800 rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendQuery} className="mt-4 flex gap-2">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="e.g., Why is my living room fan consuming 42% more energy than usual?"
            className="flex-1 rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-emerald-500 focus:outline-hidden shadow-2xs"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs transition"
          >
            <span>Ask AI</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
