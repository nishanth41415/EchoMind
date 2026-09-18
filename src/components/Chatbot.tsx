import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Zap,
  Cpu,
  AlertTriangle,
  Lightbulb,
  Maximize2,
  Minimize2,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Appliance, SensorReading, TariffSettings, AlertItem, SystemHealth } from '../types';
import { PageId } from './Sidebar';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  source?: 'gemini' | 'local_engine' | 'local_fallback';
  action?: {
    type: 'toggle_relay' | 'navigate';
    label: string;
    payload: any;
  };
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  appliances: Appliance[];
  latestReading?: SensorReading;
  tariff: TariffSettings;
  alerts: AlertItem[];
  systemHealth: SystemHealth;
  onToggleRelay?: (appliance: Appliance, targetState: boolean) => void;
  onNavigate?: (pageId: PageId) => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({
  isOpen,
  onClose,
  onOpen,
  appliances,
  latestReading,
  tariff,
  alerts,
  systemHealth,
  onToggleRelay,
  onNavigate,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "Hello! I'm **EcoMind AI Copilot**, your real-time household energy intelligence assistant.\n\nI monitor your **ESP32 microcontroller**, track live sensor telemetry (ZMPT101B voltage & ACS712 current), and detect circuit anomalies.\n\nHow can I help you optimize your energy consumption today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Suggested prompt chips
  const promptChips = [
    'Why is the Living Room Fan drawing 72W?',
    'How can I save ₹500 on my electricity bill?',
    'What is tomorrow\'s energy forecast?',
    'Turn off Living Room Fan',
    'How does ESP32 calculate True RMS?',
  ];

  // Local rule-based AI engine for offline/fallback responses
  const getLocalAIResponse = (query: string): { reply: string; action?: any } => {
    const q = query.toLowerCase();

    // Fan / Anomaly check
    if (q.includes('fan') || q.includes('72w') || q.includes('anomaly') || q.includes('surge')) {
      const fan = appliances.find((a) => a.id === 'app-fan');
      return {
        reply: `🔍 **Anomaly Diagnostic Report:**\n\n- **Target Appliance:** Living Room Ceiling Fan (GPIO 18 / Relay 1)\n- **Current Power:** ${fan ? fan.current_power : 72}W (Normal baseline: 52W)\n- **Deviation:** +42.3% above expected evening load curve\n- **Z-Score:** 2.85 (Triggers WARNING severity threshold)\n\n**Root Cause:** The fan's mechanical bearings appear stiff or high-speed oscillation is active during an off-peak study interval. Isolating the load or scheduling a 45-minute cool-down can prevent ₹120 in unnecessary monthly expense.`,
        action: fan && fan.relay_state ? {
          type: 'toggle_relay',
          label: 'Isolate Fan Load (Turn OFF Relay)',
          payload: { appliance: fan, targetState: false },
        } : undefined,
      };
    }

    // Remote relay or turn off
    if (q.includes('turn off') || q.includes('switch off') || q.includes('isolate') || q.includes('relay')) {
      const fan = appliances.find((a) => a.id === 'app-fan');
      const lamp = appliances.find((a) => a.id === 'app-lamp');
      
      if (q.includes('lamp')) {
        return {
          reply: `Relay command prepared for **Desk Lamp** in Bedroom (GPIO 19). You can trigger remote isolation immediately:`,
          action: lamp ? {
            type: 'toggle_relay',
            label: 'Turn OFF Desk Lamp',
            payload: { appliance: lamp, targetState: false },
          } : undefined,
        };
      }

      return {
        reply: `Remote optocoupled relay control is active. The Living Room Fan is currently drawing ${fan?.current_power || 72}W. Would you like to isolate this circuit?`,
        action: fan ? {
          type: 'toggle_relay',
          label: 'Turn OFF Living Room Fan',
          payload: { appliance: fan, targetState: false },
        } : undefined,
      };
    }

    // Savings & bill
    if (q.includes('save') || q.includes('bill') || q.includes('cost') || q.includes('₹') || q.includes('rupee')) {
      return {
        reply: `💡 **Top 3 Actionable Energy Reductions (Target: -₹580/mo):**\n\n1. **Shift Heavy Laundry/Iron Loads (18:00 - 22:00 peak):** Save ₹220/month by utilizing off-peak solar hours (10:00 - 15:00).\n2. **Isolate Standby Vampire Loads:** Appliances on standby consume ~0.45 kWh/day (₹81/month).\n3. **Calibrate Living Room Fan:** Lowering speed step during late night reduces draw from 72W to 42W (Save ₹160/month).\n\n*Current tariff configured at ₹${tariff.rate_per_kwh}/kWh.*`,
        action: {
          type: 'navigate',
          label: 'View All AI Recommendations',
          payload: 'recommendations',
        },
      };
    }

    // Tomorrow's forecast
    if (q.includes('tomorrow') || q.includes('forecast') || q.includes('predict')) {
      return {
        reply: `📈 **Predictive Consumption Forecast:**\n\n- **Projected Energy Tomorrow:** **5.10 kWh** (±0.38 kWh confidence band, 94% ML accuracy)\n- **Estimated Daily Cost:** ₹${(5.10 * tariff.rate_per_kwh).toFixed(2)}\n- **Peak Demand Window:** 19:30 - 21:00 (Expected 420W aggregate spike)\n- **Suggested Action:** Pre-cool or schedule heavy inductive loads before 17:00.`,
        action: {
          type: 'navigate',
          label: 'Inspect AI Forecasting Models',
          payload: 'ai',
        },
      };
    }

    // ESP32 & Sensors
    if (q.includes('esp32') || q.includes('sensor') || q.includes('true rms') || q.includes('zmpt') || q.includes('acs712')) {
      return {
        reply: `⚡ **ESP32 IoT Hardware Pipeline:**\n\n- **Voltage Sensor:** ZMPT101B potential transformer connected to ADC Pin **GPIO 34**\n- **Current Sensor:** ACS712-05B Hall effect sensor connected to ADC Pin **GPIO 35**\n- **Sampling Algorithm:** FreeRTOS dual-core task samples 1,000 discrete points per 50Hz AC wave (20ms period) to compute **True RMS**:\n  $$V_{\\text{RMS}} = \\sqrt{\\frac{1}{N} \\sum_{i=1}^N (V_i - V_{\\text{ref}})^2}$$\n- **Active Power:** Real-time integration of instantaneous $P = V(t) \\times I(t)$, calculating true power factor (${latestReading?.power_factor || 0.98}).`,
        action: {
          type: 'navigate',
          label: 'Open ESP32 Hardware Schematic',
          payload: 'hardware',
        },
      };
    }

    // Default general response
    return {
      reply: `I analyzed your current energy grid:\n\n- **Active Power:** ${latestReading?.power || 72}W\n- **Grid Voltage:** ${latestReading?.voltage || 231.2}V AC @ 50Hz\n- **Eco-Score:** ${systemHealth.eco_score}/100 (Grade A+)\n- **Active Alerts:** ${alerts.filter((a) => a.status === 'active').length} circuit warning\n\nYou can ask me to analyze specific appliances, check sensor telemetry, or automate your energy savings!`,
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Attempt server-side Gemini API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageContent,
          context: {
            voltage: latestReading?.voltage || 231.2,
            current: latestReading?.current || 0.31,
            power: latestReading?.power || 72,
            powerFactor: latestReading?.power_factor || 0.98,
            tariffRate: tariff.rate_per_kwh,
            ecoScore: systemHealth.eco_score,
            activeAlert: alerts.find((a) => a.status === 'active')?.message || 'Fan high power surge',
            appliances: appliances.map((a) => `${a.name} (${a.room}): ${a.current_power}W`),
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: data.source || 'gemini',
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        // Fallback to local AI engine
        const fallback = getLocalAIResponse(messageContent);
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: fallback.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'local_fallback',
          action: fallback.action,
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch {
      // Network or offline fallback
      const fallback = getLocalAIResponse(messageContent);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: fallback.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'local_engine',
        action: fallback.action,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: NonNullable<ChatMessage['action']>) => {
    if (action.type === 'toggle_relay' && onToggleRelay) {
      onToggleRelay(action.payload.appliance, action.payload.targetState);
      const confirmMsg: ChatMessage = {
        id: `action-confirm-${Date.now()}`,
        sender: 'bot',
        text: `✅ **Action Dispatched:** Commanded ESP32 relay to isolate **${action.payload.appliance.name}**. Real-time power reduced by ${action.payload.appliance.current_power}W.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, confirmMsg]);
    } else if (action.type === 'navigate' && onNavigate) {
      onNavigate(action.payload);
      onClose();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-fresh',
        sender: 'bot',
        text: "Chat cleared. I'm ready for your questions about household energy, sensor readings, or tariff optimization.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Launcher Trigger Button (Visible when closed) */}
      {!isOpen && (
        <button
          id="chatbot-floating-trigger"
          onClick={onOpen}
          className="fixed bottom-20 sm:bottom-6 right-5 z-40 flex items-center gap-2.5 rounded-full bg-linear-to-r from-emerald-600 to-teal-700 px-4 py-3 text-white shadow-xl hover:from-emerald-700 hover:to-teal-800 transition-all duration-300 hover:scale-105 ring-4 ring-emerald-100 cursor-pointer group"
          aria-label="Open EcoMind AI Energy Chatbot"
        >
          <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
            <Sparkles className="h-4 w-4 animate-pulse text-emerald-200" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
            </span>
          </div>
          <div className="text-left pr-1">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-100">
              AI Copilot
            </div>
            <div className="text-xs font-bold leading-tight text-white flex items-center gap-1">
              <span>Ask EcoMind</span>
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </button>
      )}

      {/* Interactive Chat Window Modal */}
      {isOpen && (
        <div
          id="ecomind-chat-modal"
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-white shadow-2xl border border-stone-200/90 overflow-hidden ${
            isExpanded
              ? 'inset-4 sm:inset-10 rounded-3xl'
              : 'bottom-20 sm:bottom-6 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[420px] h-[580px] rounded-2xl'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-100 bg-linear-to-r from-emerald-700 via-teal-800 to-emerald-900 px-4 py-3.5 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white shadow-xs ring-2 ring-white/20">
                <Bot className="h-5 w-5 text-emerald-200" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-['Outfit',sans-serif] text-sm font-bold tracking-tight">
                    EcoMind AI Copilot
                  </span>
                  <span className="rounded-full bg-emerald-400/20 px-1.5 py-0.2 text-[9px] font-bold text-emerald-200 border border-emerald-300/30">
                    ONLINE
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/80 font-medium">
                  ESP32 Smart Telemetry Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                id="btn-chat-clear"
                onClick={clearChat}
                title="Clear conversation"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-200 hover:bg-white/15 hover:text-white transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                id="btn-chat-expand"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Minimize' : 'Expand'}
                className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg text-emerald-200 hover:bg-white/15 hover:text-white transition"
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                id="btn-chat-close"
                onClick={onClose}
                title="Close chat"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-200 hover:bg-white/15 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Live Context Telemetry Bar */}
          <div className="bg-stone-50 border-b border-stone-200/70 px-4 py-1.5 flex items-center justify-between text-[11px] text-stone-600">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                <Zap className="h-3 w-3" />
                {latestReading?.power || 72}W Live
              </span>
              <span className="text-stone-300">|</span>
              <span className="font-mono text-stone-500">
                {latestReading?.voltage || 231.2}V RMS
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-stone-400">Tariff:</span>
              <span className="font-semibold text-stone-700">₹{tariff.rate_per_kwh}/kWh</span>
            </div>
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white shadow-xs rounded-tr-xs'
                      : 'border border-stone-200/90 bg-white text-stone-800 shadow-xs rounded-tl-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Interactive Action Button inside Bot Message */}
                  {msg.action && (
                    <div className="mt-3 pt-2.5 border-t border-stone-100">
                      <button
                        onClick={() => handleActionClick(msg.action!)}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-2xs cursor-pointer"
                      >
                        {msg.action.type === 'toggle_relay' ? (
                          <Zap className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <ArrowRight className="h-3.5 w-3.5 text-emerald-600" />
                        )}
                        <span>{msg.action.label}</span>
                      </button>
                    </div>
                  )}

                  <div
                    className={`mt-1 text-[9px] flex items-center justify-end gap-1 ${
                      msg.sender === 'user' ? 'text-emerald-100' : 'text-stone-400'
                    }`}
                  >
                    {msg.source && (
                      <span className="font-mono uppercase opacity-70">[{msg.source}]</span>
                    )}
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stone-300 text-stone-700 shadow-xs">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-xs text-stone-500 italic py-1">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs animate-pulse">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="flex items-center gap-1 rounded-2xl border border-stone-200 bg-white px-3 py-2 text-stone-600">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce"></span>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[11px] ml-1.5 font-medium">Analyzing telemetry...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="border-t border-stone-200/60 bg-white px-3 py-2 overflow-x-auto">
            <div className="flex gap-1.5 whitespace-nowrap">
              {promptChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  disabled={isLoading}
                  className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] font-medium text-stone-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 transition disabled:opacity-50"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Text Input Area */}
          <div className="border-t border-stone-200 bg-white p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                id="chatbot-input-field"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about live energy, appliances, or savings..."
                disabled={isLoading}
                className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
              <button
                id="btn-chatbot-send"
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
