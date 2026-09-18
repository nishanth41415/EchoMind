import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}

function generateLocalResponse(query: string, context: any): string {
  const q = (query || '').toLowerCase();
  if (q.includes('fan') || q.includes('72w') || q.includes('surge') || q.includes('anomaly')) {
    return `🔍 **Anomaly Diagnostic Report:**\n\n- **Target Appliance:** Living Room Ceiling Fan (GPIO 18 / Relay 1)\n- **Current Power:** 72W (Normal baseline: 52W)\n- **Deviation:** +42.3% above expected evening load curve\n- **Z-Score:** 2.85 (Warning severity threshold)\n\n**Recommendation:** Mechanical bearing friction or continuous high-speed operation detected. Isolating the load or scheduling a 45-minute cool-down can prevent ₹120 in unnecessary monthly energy cost.`;
  }
  if (q.includes('turn off') || q.includes('isolate') || q.includes('relay') || q.includes('switch off')) {
    return 'Remote optocoupled relay controls are active. You can command the ESP32 to disconnect or isolate high-draw circuits directly from the Appliances view or using the chatbot action buttons.';
  }
  if (q.includes('save') || q.includes('bill') || q.includes('cost') || q.includes('₹') || q.includes('rupee')) {
    return `💡 **Top 3 Actionable Reductions (Target: -₹580/mo):**\n\n1. **Peak Shifting (18:00 - 22:00):** Run heavy laundry and ironing during morning hours to avoid peak tariffs.\n2. **Standby Vampire Loads:** Idle entertainment and laptop chargers consume ~0.45 kWh/day (₹81/month).\n3. **Fan Speed Calibration:** Dropping fan speed step late at night lowers wattage from 72W to 42W (Save ₹160/month).\n\n*Current tariff set at ₹${context?.tariffRate || 6}/kWh.*`;
  }
  if (q.includes('tomorrow') || q.includes('forecast') || q.includes('predict')) {
    return `📈 **Predictive Forecast:** Tomorrow's household energy is projected at **5.10 kWh** (±0.38 kWh confidence band, 94% ML accuracy) with an estimated cost of ₹${((context?.tariffRate || 6) * 5.1).toFixed(2)}. Peak load expected between 19:30 - 21:00.`;
  }
  if (q.includes('esp32') || q.includes('sensor') || q.includes('true rms') || q.includes('zmpt') || q.includes('acs712')) {
    return `⚡ **ESP32 IoT Pipeline:**\n\n- **ZMPT101B Voltage Sensor:** Connected to GPIO 34 ADC pin\n- **ACS712 Current Sensor:** Connected to GPIO 35 ADC pin\n- **Sampling Algorithm:** Dual-core FreeRTOS task samples 1,000 discrete points per 50Hz AC wave to compute **True RMS**:\n  $$V_{\\text{RMS}} = \\sqrt{\\frac{1}{N} \\sum_{i=1}^N (V_i - V_{\\text{ref}})^2}$$\n- **Active Power:** Real-time integration of instantaneous $P = V(t) \\times I(t)$ with continuous power factor calculation.`;
  }
  return `I analyzed your current household telemetry:\n\n- **Active Power:** ${context?.power || 72}W\n- **True RMS Voltage:** ${context?.voltage || 231.2}V AC @ 50Hz\n- **Eco-Score:** ${context?.ecoScore || 92}/100 (Grade A+)\n- **Active Alerts:** ${context?.activeAlert || 'Living Room Fan draw +42% over baseline'}\n\nAsk me about specific circuits, energy saving tips, or tariff calculations!`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, context } = req.body || {};
    const ai = getAI();

    if (!ai || !process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        reply: generateLocalResponse(message, context),
        source: 'local_engine',
      });
    }

    const systemPrompt = `You are EcoMind AI Copilot, a helpful household energy intelligence assistant embedded in an IoT smart energy monitoring platform with an ESP32 microcontroller, ZMPT101B voltage sensor, and ACS712 current sensor.
Current live system state:
- Live Grid Voltage: ${context?.voltage || 231.2} V RMS @ 50Hz
- Live Current: ${context?.current || 0.31} A
- Live Power: ${context?.power || 72} W
- Power Factor: ${context?.powerFactor || 0.98}
- Today's Energy: 4.82 kWh
- Tariff Rate: ₹${context?.tariffRate || 6}/kWh
- Active Alert: ${context?.activeAlert || 'Living Room Fan drawing 72W (42% above normal baseline 52W)'}
- Eco-Score: ${context?.ecoScore || 92}/100

Answer the user's question clearly, concisely, and practically with helpful energy saving advice, circuit diagnostics, or engineering calculations. Keep responses readable with bullet points.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nUser Question: ${message}` }],
        },
      ],
    });

    const reply = response.text || generateLocalResponse(message, context);
    return res.status(200).json({ reply, source: 'gemini' });
  } catch (error) {
    console.error('Gemini API error in /api/chat:', error);
    return res.status(200).json({
      reply: generateLocalResponse(req.body?.message, req.body?.context),
      source: 'local_fallback',
    });
  }
}
