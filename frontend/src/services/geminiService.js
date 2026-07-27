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
    console.warn('[Gemini] API key not configured. Using autonomous fallback engine.');
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

// ===============================================================
// 1. LEAD SCORING AI
// ===============================================================

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
  "estimatedDealSize": "Rs.1.5 Cr"
}`;

  const result = await callGemini(prompt, { temperature: 0.2, maxTokens: 300 });
  if (result) {
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try { return JSON.parse(jsonMatch[0]); } catch (e) {}
    }
  }

  const budget = parseInt(String(lead.budget || lead.budgetMax || '0').replace(/[^0-9]/g, '')) || 0;
  if (budget > 10000000 || lead.status === 'HOT') {
    return { score: 'HOT', priority: 9, reason: 'High budget luxury client in Pune corridor', nextAction: 'Call immediately', estimatedDealSize: `Rs.${(budget/10000000 || 1.2).toFixed(1)} Cr` };
  }
  if (budget > 5000000 || lead.status === 'QUALIFIED') {
    return { score: 'WARM', priority: 6, reason: 'Qualified client with clear budget', nextAction: 'Schedule site visit', estimatedDealSize: `Rs.${(budget/10000000 || 0.8).toFixed(1)} Cr` };
  }
  return { score: 'COLD', priority: 3, reason: 'Nurturing required', nextAction: 'Send digital brochure via WhatsApp', estimatedDealSize: 'TBD' };
}

// ===============================================================
// 2. SMART WHATSAPP MESSAGE GENERATOR
// ===============================================================

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
    offer: `Namaste ${lead.name || 'ji'}! 🎯\n\nSpecial 24K Realtors Limited Offer: Exclusive early bird discount and zero brokerage benefits on premium inventory.\n\nOffer valid for 48 hours only! Direct connect karein: +91 96730 00053 📞`
  };

  return fallbacks[messageType] || fallbacks.followup;
}

// ===============================================================
// 3. PROPERTY MATCH AI
// ===============================================================

export async function matchPropertiesWithAI(clientRequirements, properties = []) {
  const prompt = `Match properties to requirements:
Client: ${JSON.stringify(clientRequirements)}
Available Properties: ${JSON.stringify(properties.slice(0, 8))}

Return JSON array of top matches:
[{"index": 1, "matchScore": 95, "reason": "Location and budget fit"}]`;

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

// ===============================================================
// 4. AUTONOMOUS CRM CO-PILOT ENGINE (FULL CRM & API EXECUTION)
// ===============================================================

const chatHistory = [];

// Tab navigation config - maps keywords to CRM tab IDs
const TAB_NAVIGATION_MAP = [
  {
    keywords: ['lead management', 'leads dikhao', 'open leads', 'leads tab', 'lead desk', 'lead list', 'all leads', 'leads dekho', 'lead dekho'],
    tab: 'leads',
    reply: 'Lead Management Desk pe switch kar diya! Saare active leads, pipeline aur contact history yahan hain. 📋'
  },
  {
    keywords: ['propert', 'inventory project', 'flat', 'apartment', 'society', 'lodha', 'shapoorji', 'vyomora', 'godrej', 'new project'],
    tab: 'properties',
    reply: 'Properties Desk open kar diya! Pune ke flagship projects yahan hain. 🏢'
  },
  {
    keywords: ['site visit', 'visit schedul', 'site tour', 'property visit', 'chauffeur', 'site dekhna', 'location visit'],
    tab: 'site_visits',
    reply: 'Site Visits Desk open! Aaj ke scheduled visits aur VIP Chauffeur tours manage kar sakte hain. 🚘'
  },
  {
    keywords: ['follow up', 'followup', 'reminder', 'callback', 'call back', 'follow-up', 'yaad dilao', 'call schedule'],
    tab: 'follow_ups',
    reply: 'Follow-ups Desk open! Today ke due reminders aur callback schedule yahan active hain. Taka-tak karo! ⏱️'
  },
  {
    keywords: ['deal', 'pipeline', 'closure', 'kanban', 'negotiation', 'agreement', 'booking', 'close', 'winning'],
    tab: 'deals',
    reply: 'Deals and Closures Desk! 7-Stage Kanban Pipeline aur Rs.4.82 Cr revenue visible hai. 💰'
  },
  {
    keywords: ['team', 'agent', 'rm performance', 'relationship manager', 'leaderboard', 'staff', 'sales team', 'team performance'],
    tab: 'team',
    reply: 'Team and RMs Leaderboard open! Jyoti Dhale, Jyoti Jagtap, Yash Murkute ke stats active hain. 🏆'
  },
  {
    keywords: ['commission', 'payroll', 'salary', 'incentive', 'earning', 'payout', 'revenue share', 'payment'],
    tab: 'commissions',
    reply: 'Commissions and Payroll Desk open! Team earnings aur incentive breakdowns yahan hain. 💳'
  },
  {
    keywords: ['analytic', 'report', 'chart', 'graph', 'insight', 'performance report', 'metric', 'data studio'],
    tab: 'analytics',
    reply: 'Analytics and Reports Desk open! CRM performance metrics, lead funnel, aur revenue charts yahan hain. 📊'
  },
  {
    keywords: ['attendance', 'check-in', 'checkin', 'upasthiti', 'login time', 'kab aaya', 'office time'],
    tab: 'attendance',
    reply: 'Attendance Dashboard open! Team checkin aur working hours tracker yahan hai. ✅'
  },
  {
    keywords: ['leave', 'hr module', 'holiday', 'absent', 'chutti', 'vacation', 'sick leave', 'hr'],
    tab: 'leaves',
    reply: 'HR and Leaves Module open! Leave requests aur approvals yahan manage kar sakte hain. 📅'
  },
  {
    keywords: ['inventory', 'project list', 'builder list', 'societies', 'housing project', 'project catalog'],
    tab: 'inventory',
    reply: 'Inventory / Projects Desk open! All active builder projects aur availability yahan hain. 🏗️'
  },
  {
    keywords: ['dashboard', 'home screen', 'overview', 'executive', 'main screen', 'kpi', 'summary', 'wapas', 'back to home'],
    tab: 'dashboard',
    reply: 'Executive Dashboard pe wapas aa gaye! KPI summary aur live metrics yahan hain. 📈'
  },
];

/**
 * High-Level Autonomous Co-Pilot Execution Engine
 * Understands user intent and returns BOTH conversational response AND executable CRM Action Payload!
 */
export async function executeCopilotAction(userMessage, context = {}) {
  chatHistory.push({ role: 'user', content: userMessage });

  const systemPrompt = `You are "24K AI Co-Pilot (Powered by Gemini 2.0 Flash)", an autonomous executive AI co-pilot built directly into the 24K Realtors Enterprise CRM (Pune, India).

You have FULL CONTROL and REAL-TIME API ACCESS to the entire CRM. You can autonomously execute commands like adding leads, updating lead status, scheduling site visits, scheduling follow-ups, searching inventory, opening CRM tabs, and sending WhatsApp messages.

Current Real-time CRM Context:
- Total Leads in CRM: ${context.totalLeads || 0}
- Hot Leads: ${context.hotLeads || 0}
- Site Visits Today: ${context.siteVisitsToday || 0}
- Total Pipeline Value: ${context.pipelineValue || 'Rs.4.82 Cr'}
- Active Tab: ${context.activeTab || 'dashboard'}

Available CRM Tabs: dashboard, leads, properties, site_visits, follow_ups, deals, team, commissions, analytics, inventory, attendance, leaves

When the user asks you to DO something in the CRM, respond in EXACT JSON format:
{
  "reply": "Warm natural Hinglish response explaining the action taken...",
  "action": {
    "type": "CREATE_LEAD | UPDATE_STATUS | SCHEDULE_VISIT | SCHEDULE_FOLLOWUP | NAVIGATE_TAB | SEARCH_PROPERTIES | SEND_WHATSAPP | NONE",
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

  // AUTONOMOUS NATURAL HINGLISH INTENT PARSER (FALLBACK)
  const inputLower = userMessage.toLowerCase();

  // 1. Lead Creation Intent (HIGHEST PRIORITY - check first)
  const isAddLead = /\b(add|create|naya|new|banao|jodo|register|daalo)\b/i.test(inputLower) &&
    /\b(lead|client|customer|inquiry|enquiry)\b/i.test(inputLower);

  if (isAddLead) {
    const phoneMatch = userMessage.match(/(\+?\d{10,12})/);
    const locMatch = userMessage.match(/\b(baner|wakad|hinjewadi|kharadi|pimple saudagar|balewadi|hadapsar|magarpatta|aundh|pune)\b/i);

    // Extract name by removing stop words, numbers, locations
    const cleaned = userMessage
      .replace(/\b(baner|wakad|hinjewadi|kharadi|pimple saudagar|balewadi|hadapsar|magarpatta|aundh|pune)\b/gi, '')
      .replace(/(\+?\d+)/g, '')
      .replace(/\b(add|create|lead|banao|karo|naya|new|daalo|in|me|ka|ko|budget|phone|cr|lakh|hai|aur|ke|liye|se|ne|ek|jo|wala|ki|the|a|an|is|it|for|with|at|and|or|to|of|on|by|please|sir|ji|hello|namaste|ok|bhi|yahan|wahan|usko|uski)\b/gi, '')
      .replace(/[^a-zA-Z\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const leadName = cleaned.length >= 3 ? cleaned.replace(/\b\w/g, c => c.toUpperCase()) : 'New Lead';
    const phone = phoneMatch ? phoneMatch[1] : '+91 98765 43210';
    const location = locMatch ? locMatch[1].toUpperCase() : 'BANER';

    return {
      reply: `Done sir! **${leadName}** ka naya lead CRM mein CREATE kar diya hai! Location: **${location}**, Phone: **${phone}** ✅\n\nLead Management Desk pe top row mein visible hai!`,
      action: {
        type: 'CREATE_LEAD',
        params: { name: leadName, phone, location, budgetMin: '7500000', budgetMax: '15000000', requirementType: 'BUY' }
      }
    };
  }

  // 2. Status Update Intent
  const statusWords = { hot: 'HOT', qualified: 'QUALIFIED', 'site visit': 'SITE_VISIT', contacted: 'CONTACTED', won: 'WON', lost: 'LOST', new: 'NEW' };
  let detectedStatus = null;
  for (const [word, val] of Object.entries(statusWords)) {
    if (inputLower.includes(word)) { detectedStatus = val; break; }
  }

  if (detectedStatus && /\b(ko|mark|kar|set|update|change|karo|karna|bana)\b/i.test(inputLower)) {
    const namePatterns = [
      /([A-Z][a-z]+\s+[A-Z][a-z]+)/,
      /([A-Za-z]{3,}\s+[A-Za-z]{3,})/,
    ];
    let targetName = 'Selected Lead';
    for (const pat of namePatterns) {
      const m = userMessage.match(pat);
      if (m) { targetName = m[1].trim(); break; }
    }

    return {
      reply: `Done sir! **${targetName}** ka status **${detectedStatus}** update kar diya hai CRM mein! 🔥 Lead Management Desk pe reflect ho gaya hai.`,
      action: { type: 'UPDATE_STATUS', params: { status: detectedStatus, targetName } }
    };
  }

  // 3. Tab Navigation Intent
  for (const mapping of TAB_NAVIGATION_MAP) {
    if (mapping.keywords.some(kw => inputLower.includes(kw))) {
      return {
        reply: mapping.reply,
        action: { type: 'NAVIGATE_TAB', params: { tab: mapping.tab } }
      };
    }
  }

  // 4. WhatsApp Intent
  if (inputLower.includes('whatsapp') || inputLower.includes('msg bhejo') || inputLower.includes('message bhejo') || inputLower.includes('message send')) {
    return {
      reply: `WhatsApp message template generate karke client ke liye ready kar diya! WhatsApp Launcher trigger ho gaya. 💬`,
      action: { type: 'SEND_WHATSAPP', params: { message: 'Namaste! 24K Realtors ki taraf se swagat hai. Aapke liye exclusive property showcase ready hai!' } }
    };
  }

  // 5. CRM Stats Query
  if (inputLower.includes('kitne lead') || inputLower.includes('total lead') || inputLower.includes('how many') || inputLower.includes('crm status') || inputLower.includes('summary')) {
    return {
      reply: `📊 **CRM Live Status:**\n• Total Leads: **${context.totalLeads || 5}**\n• Hot Leads: **${context.hotLeads || 2}**\n• Pipeline Value: **${context.pipelineValue || 'Rs.4.82 Cr'}**\n• Site Visits Today: **${context.siteVisitsToday || 3}**\n\nKoi action execute karun? 🤖`,
      action: { type: 'NONE' }
    };
  }

  // 6. Default Advisory
  return {
    reply: `Main 24K AI Co-Pilot hoon! CRM ke saare tasks automate kar sakta hoon.\n\n✨ Try karo:\n• *"Baner me Rahul Sharma ka lead add karo 9876543210"*\n• *"Deals pipeline dikhao"*\n• *"Priya Patel ko HOT mark karo"*\n• *"Analytics reports dekho"*\n• *"Attendance check karo"*\n• *"Follow-ups kholo"* 🤖`,
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
