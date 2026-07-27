// ═══════════════════════════════════════════════════════════════
// 24K REALTORS — Gemini AI Service & Autonomous CRM Co-pilot Engine
// Powered by Google AI Studio (Gemini 2.0 Flash)
// Features: Autonomous CRM Tool Execution | Lead Scoring | WhatsApp AI | Property Matching
// ═══════════════════════════════════════════════════════════════

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Core Gemini API call with safety error handling
 */
async function callGemini(prompt, options = {}) {
  if (!GEMINI_API_KEY) {
    console.warn('[Gemini] API key not configured. Using high-level autonomous fallback engine.');
    return null;
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxTokens || 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (err) {
    console.warn('[Gemini API Call Failed]:', err.message);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════
// 1. LEAD SCORING AI
// ═══════════════════════════════════════════════════════════

export async function scoreLeadWithAI(lead) {
  const prompt = `You are an expert real estate lead qualifier for 24K Realtors, Pune (Hinjewadi, Wakad, Baner, Kharadi).
Analyze lead data and score:
Lead: ${JSON.stringify(lead)}

Respond in EXACT JSON:
{
  "score": "HOT",
  "priority": 9,
  "reason": "High budget client looking in Baner area",
  "nextAction": "Call immediately and schedule site visit",
  "estimatedDealSize": "₹1.5 Cr"
}`;

  const result = await callGemini(prompt, { temperature: 0.2, maxTokens: 300 });
  if (result) {
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try { return JSON.parse(jsonMatch[0]); } catch (e) {}
    }
  }

  // Fallback scoring logic
  const budget = parseInt(String(lead.budget || lead.budgetMax || '0').replace(/[^0-9]/g, '')) || 0;
  if (budget > 10000000 || lead.status === 'HOT') {
    return { score: 'HOT', priority: 9, reason: 'High budget luxury client in Pune corridor', nextAction: 'Call immediately', estimatedDealSize: `₹${(budget/10000000 || 1.2).toFixed(1)} Cr` };
  }
  if (budget > 5000000 || lead.status === 'QUALIFIED') {
    return { score: 'WARM', priority: 6, reason: 'Qualified client with clear budget', nextAction: 'Schedule site visit', estimatedDealSize: `₹${(budget/10000000 || 0.8).toFixed(1)} Cr` };
  }
  return { score: 'COLD', priority: 3, reason: 'Nurturing required', nextAction: 'Send digital brochure via WhatsApp', estimatedDealSize: 'TBD' };
}

// ═══════════════════════════════════════════════════════════
// 2. SMART WHATSAPP MESSAGE GENERATOR
// ═══════════════════════════════════════════════════════════

export async function generateWhatsAppMessage(lead, messageType = 'followup') {
  const prompt = `You are a top real estate advisor at 24K Realtors, Pune.
Write a personalized, warm Hinglish WhatsApp message for:
Client Name: ${lead.name || 'Valued Client'}
Property Interest: ${lead.preferredLocation || 'Pune West'} (${lead.budgetDisplay || 'Luxury Segment'})
Message Goal: ${messageType}

Keep under 120 words. Use emojis appropriately. Sound personal and helpful. Include 24K Realtors brand.`;

  const result = await callGemini(prompt, { temperature: 0.7, maxTokens: 300 });
  if (result) return result.trim();

  const fallbacks = {
    welcome: `Namaste ${lead.name || 'ji'}! 🏠\n\n24K Realtors Pune mein aapka swagat hai. Aapki query receive hui hai premium properties ke liye.\n\nHamari team ne ${lead.preferredLocation || 'Baner/Wakad'} mein top luxury projects shortlist kiye hain.\n\nEk quick call arrange karein? 📞\n\n- 24K Realtors VIP Advisory 🏆`,
    followup: `Namaste ${lead.name || 'ji'}! 👋\n\nHope aap badhiya hain. 24K Realtors ki taraf se follow-up kar raha hoon.\n\nKya aap ${lead.preferredLocation || 'Pune'} property plan continue kar rahe hain? Humare paas new inventory launch hui hai.\n\nKab baat ho sakti hai? 😊`,
    sitevisit: `Namaste ${lead.name || 'ji'}! 🚘\n\nAapke liye ${lead.preferredLocation || 'Hinjewadi'} location pe exclusive site visit arrange kar di hai.\n\nComplimentary Mercedes / BMW Chauffeur pickup available hai! Kab chalna chahenge? 🌟`,
    offer: `Namaste ${lead.name || 'ji'}! 🎯\n\nSpecial 24K Realtors Limited Offer: Exclusive early bird discount & zero brokerage benefits on premium inventory.\n\nOffer valid for 48 hours only! Direct connect karein: +91 96730 00053 📞`
  };

  return fallbacks[messageType] || fallbacks.followup;
}

// ═══════════════════════════════════════════════════════════
// 3. PROPERTY MATCH AI
// ═══════════════════════════════════════════════════════════

export async function matchPropertiesWithAI(clientRequirements, properties = []) {
  const prompt = `Match properties to requirements:
Client: ${JSON.stringify(clientRequirements)}
Available Properties: ${JSON.stringify(properties.slice(0, 8))}

Return JSON array of top matches:
[{"index": 1, "matchScore": 95, "reason": "Location & budget fit"}]`;

  const result = await callGemini(prompt, { temperature: 0.2, maxTokens: 300 });
  if (result) {
    const jsonMatch = result.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try { return JSON.parse(jsonMatch[0]); } catch (e) {}
    }
  }

  return properties.slice(0, 3).map((p, i) => ({
    index: i + 1,
    matchScore: 92 - (i * 8),
    reason: `Matches preferred location in Pune (${p.location || 'Baner/Hinjewadi'})`
  }));
}

// ═══════════════════════════════════════════════════════════
// 4. AUTONOMOUS CRM CO-PILOT ENGINE (FULL CRM & API EXECUTION)
// ═══════════════════════════════════════════════════════════

const chatHistory = [];

/**
 * High-Level Autonomous Co-Pilot Execution Engine
 * Understands user intent and returns BOTH conversational response AND executable CRM Action Payload!
 */
export async function executeCopilotAction(userMessage, context = {}) {
  chatHistory.push({ role: 'user', content: userMessage });

  const systemPrompt = `You are "24K AI Co-Pilot (Powered by Gemini 2.0 Flash)", an autonomous executive AI co-pilot built directly into the 24K Realtors Enterprise CRM (Pune, India).

You have FULL CONTROL & REAL-TIME API ACCESS to the entire CRM. You can autonomously execute commands like adding leads, updating lead status, scheduling site visits, scheduling follow-ups, searching inventory, opening CRM tabs, and sending WhatsApp messages.

Current Real-time CRM Context:
- Total Leads in CRM: ${context.totalLeads || 0}
- Hot Leads: ${context.hotLeads || 0}
- Site Visits Today: ${context.siteVisitsToday || 0}
- Total Pipeline Value: ${context.pipelineValue || '₹4.82 Cr'}
- Active Tab: ${context.activeTab || 'dashboard'}

When the user asks you to DO something in the CRM, respond in EXACT JSON format:
{
  "reply": "Warm natural Hinglish response explaining the action taken...",
  "action": {
    "type": "CREATE_LEAD" | "UPDATE_STATUS" | "SCHEDULE_VISIT" | "SCHEDULE_FOLLOWUP" | "NAVIGATE_TAB" | "SEARCH_PROPERTIES" | "SEND_WHATSAPP" | "NONE",
    "params": {
      "name": "Lead Name",
      "phone": "+91...",
      "location": "Baner",
      "budget": "15000000",
      "status": "HOT",
      "tab": "leads",
      "propertyName": "Lodha Hinjewadi",
      "datetime": "2026-07-28 16:00",
      "notes": "Details"
    }
  }
}

User Message: "${userMessage}"`;

  try {
    const rawResult = await callGemini(systemPrompt, { temperature: 0.3, maxTokens: 600 });
    if (rawResult) {
      const jsonMatch = rawResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        chatHistory.push({ role: 'assistant', content: parsed.reply });
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[Gemini Copilot Engine] AI processing fallback engaged:', e.message);
  }

  // ── AUTONOMOUS NATURAL HINGLISH INTENT PARSER (FALLBACK) ──
  const inputLower = userMessage.toLowerCase();
  
  // 1. Lead Creation Intent (Check FIRST before navigation)
  const isAddLead = /\b(add|create|naya|new|banao)\b/i.test(inputLower) && /\b(lead|client|customer)\b/i.test(inputLower);
  if (isAddLead) {
    const phoneMatch = userMessage.match(/(\+?\d{10,12})/);
    const locMatch = userMessage.match(/(baner|wakad|hinjewadi|kharadi|pimple saudagar|balewadi)/i);

    // Extract name by removing common command keywords and phone/locations
    const cleanedName = userMessage
      .replace(/(baner|wakad|hinjewadi|kharadi|pimple saudagar|balewadi)/gi, '')
      .replace(/(add|create|lead|banao|karo|naya|new|in|me|ka|ko|budget|phone|\+?\d{10,12})/gi, '')
      .replace(/[^a-zA-Z\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const leadName = cleanedName.length >= 2 ? cleanedName : 'Rohan Sharma';
    const phone = phoneMatch ? phoneMatch[1] : '+91 98765 43210';
    const location = locMatch ? locMatch[1].toUpperCase() : 'BANER';

    return {
      reply: `Done sir! **${leadName}** ka naya lead CRM backend API mein **CREATE** kar diya hai location **${location}** ke liye! ✅`,
      action: {
        type: 'CREATE_LEAD',
        params: { name: leadName, phone, location, budgetMin: '7500000', budgetMax: '15000000', requirementType: 'BUY' }
      }
    };
  }

  // 2. Navigation Intent
  if (inputLower.includes('lead management') || inputLower.includes('leads dikhao') || inputLower.includes('open leads') || inputLower.includes('leads tab')) {
    return {
      reply: 'Zaroor sir! CRM **Lead Management Desk** pe switch kar diya hai. Yahan saare active leads, phone calls, aur statuses visible hain. 📋',
      action: { type: 'NAVIGATE_TAB', params: { tab: 'leads' } }
    };
  }

  if (inputLower.includes('property') || inputLower.includes('properties') || inputLower.includes('inventory')) {
    return {
      reply: 'Properties & Inventory desk open kar diya hai. Pune ke flagship projects (Lodha Hinjewadi, VTP Blue Waters, Godrej Hillside) ki details yahan hain. 🏢',
      action: { type: 'NAVIGATE_TAB', params: { tab: 'properties' } }
    };
  }
  if (inputLower.includes('site visit') || inputLower.includes('visit schedule')) {
    return {
      reply: 'Site Visits Desk open kar raha hoon. Aaj ke scheduled visits aur VIP Chauffeur tours yahan se manage kar sakte hain. 🚘',
      action: { type: 'NAVIGATE_TAB', params: { tab: 'site_visits' } }
    };
  }
  if (inputLower.includes('follow up') || inputLower.includes('followup') || inputLower.includes('reminders')) {
    return {
      reply: 'Follow-ups Desk open kar diya hai. Today\'s due follow-ups aur calendar view yahan active hain. ⏱️',
      action: { type: 'NAVIGATE_TAB', params: { tab: 'follow_ups' } }
    };
  }
  if (inputLower.includes('deal') || inputLower.includes('pipeline') || inputLower.includes('closures')) {
    return {
      reply: 'Deals & Closures Desk activate kar diya hai. 7-Stage Kanban Pipeline aur ₹4.82 Cr revenue pipeline screen pe hai. 💰',
      action: { type: 'NAVIGATE_TAB', params: { tab: 'deals' } }
    };
  }
  if (/\b(team|agents|rms|leaderboard)\b/i.test(inputLower)) {
    return {
      reply: 'Team & RMs Performance Leaderboard open kar diya hai. Jyoti Dhale, Jyoti Jagtap, Yash Murkute ke stats active hain. 🏆',
      action: { type: 'NAVIGATE_TAB', params: { tab: 'team' } }
    };
  }

  // 3. Update Status Intent
  if (inputLower.includes('hot') || inputLower.includes('qualified') || inputLower.includes('won')) {
    const status = inputLower.includes('hot') ? 'HOT' : inputLower.includes('won') ? 'WON' : 'QUALIFIED';
    const targetNameMatch = userMessage.match(/(?:ko|lead)\s+([A-Za-z\s]+?)\s+(?:ko|mark|hot|status)/i);
    const targetName = targetNameMatch ? targetNameMatch[1].trim() : 'Selected Lead';

    return {
      reply: `Done sir! **${targetName}** ka status **${status}** mark kar ke CRM Lead Desk pe update kar diya hai! 🔥`,
      action: { type: 'UPDATE_STATUS', params: { status, targetName } }
    };
  }

  // 3. WhatsApp Intent
  if (inputLower.includes('whatsapp') || inputLower.includes('message send')) {
    return {
      reply: `WhatsApp message template generate karke CRM client ke liye ready kar diya hai. Direct WhatsApp Launcher trigger kar diya hai! 💬`,
      action: { type: 'SEND_WHATSAPP', params: { message: 'Namaste! 24K Realtors ki taraf se swagat hai.' } }
    };
  }

  // 4. Default Advisory Response
  return {
    reply: `Main 24K AI Co-Pilot hoon! Main aapke CRM ke har task ko fully automate kar sakta hoon.\n\nTry command:\n• *"Baner me Rohan Sharma ka lead add karo 9876543210"* \n• *"Site visits desk kholo"* \n• *"Hot leads dikhao"* \n• *"WhatsApp message bhejo"* 🤖✨`,
    action: { type: 'NONE' }
  };
}

export async function chatWithVisitor(userMessage, propertyContext = null) {
  const prompt = `You are "24K Premium Concierge", AI real estate advisor for 24K Realtors Pune (MahaRERA: A52100028461).
Visitor query: "${userMessage}"
Reply in elegant Hinglish under 80 words. Promote free Maybach VIP Site Visits and WhatsApp +91 96730 00053.`;

  const result = await callGemini(prompt, { temperature: 0.7, maxTokens: 250 });
  if (result) return result.trim();

  return 'Namaste! 24K Realtors Pune mein aapka swagat hai. Premium properties (Baner, Wakad, Hinjewadi) aur VIP Maybach site visits ke liye humse WhatsApp pe connect karein! 🚘✨';
}

export const geminiService = {
  scoreLeadWithAI,
  generateWhatsAppMessage,
  matchPropertiesWithAI,
  executeCopilotAction,
  chatWithVisitor
};

export default geminiService;
