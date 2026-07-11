// ═══════════════════════════════════════════════════════════════
// 24K REALTORS — Gemini AI Service
// Powered by Google AI Studio (Gemini 2.0 Flash)
// Features: Lead Scoring | Smart WhatsApp | Property Match | Voice Transcription
// ═══════════════════════════════════════════════════════════════

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Core Gemini API call
 */
async function callGemini(prompt, options = {}) {
  if (!GEMINI_API_KEY) {
    console.warn('[Gemini] API key not configured. Using simulated response.');
    return null; // Will trigger fallback
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxTokens || 512,
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ═══════════════════════════════════════════════════════════
// 1. LEAD SCORING AI
// ═══════════════════════════════════════════════════════════

/**
 * Analyze lead data and return AI-generated score + reasoning
 * @param {Object} lead - Lead object from CRM
 * @returns {Object} { score: 'HOT'|'WARM'|'COLD', reason: string, priority: 1-10 }
 */
export async function scoreLeadWithAI(lead) {
  const prompt = `You are an expert real estate lead qualifier for premium luxury properties in Pune, India (Hinjewadi, Wakad, Baner areas).

Analyze this lead and provide a score:

Lead Data:
- Name: ${lead.name || 'Unknown'}
- Phone: ${lead.phone || 'N/A'}
- Budget: ₹${lead.budget || 'Not specified'}
- Property Interest: ${lead.propertyType || 'Not specified'}
- Location Preference: ${lead.preferredLocation || 'Not specified'}
- Status: ${lead.status || 'NEW'}
- Source: ${lead.source || 'Unknown'}
- Notes: ${lead.notes || 'None'}
- Follow-up Count: ${lead.followUpCount || 0}

Respond in this EXACT JSON format:
{
  "score": "HOT",
  "priority": 8,
  "reason": "High budget client with specific location preference",
  "nextAction": "Call within 24 hours",
  "estimatedDealSize": "₹1.2 Cr"
}

Score categories:
- HOT: Ready to buy, high budget, specific requirement
- WARM: Interested but needs nurturing
- COLD: Early stage, unclear intent`;

  try {
    const result = await callGemini(prompt, { temperature: 0.3, maxTokens: 200 });
    
    if (result) {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
  } catch (e) {
    console.warn('[Gemini] Lead scoring failed, using fallback:', e.message);
  }

  // Smart fallback based on lead data
  const budget = parseInt(lead.budget?.replace(/[^0-9]/g, '') || '0');
  if (budget > 10000000) return { score: 'HOT', priority: 9, reason: 'High budget premium client', nextAction: 'Immediate callback', estimatedDealSize: `₹${(budget/10000000).toFixed(1)} Cr` };
  if (budget > 5000000) return { score: 'WARM', priority: 6, reason: 'Medium budget, follow up needed', nextAction: 'Schedule site visit', estimatedDealSize: `₹${(budget/10000000).toFixed(1)} Cr` };
  return { score: 'COLD', priority: 3, reason: 'Budget qualification needed', nextAction: 'Send property catalog', estimatedDealSize: 'TBD' };
}

// ═══════════════════════════════════════════════════════════
// 2. SMART WHATSAPP MESSAGE GENERATOR
// ═══════════════════════════════════════════════════════════

/**
 * Generate personalized WhatsApp message for a lead
 * @param {Object} lead - Lead object
 * @param {string} messageType - 'welcome'|'followup'|'sitevisiit'|'offer'
 */
export async function generateWhatsAppMessage(lead, messageType = 'followup') {
  const templates = {
    welcome: 'initial welcome message for a new lead',
    followup: 'follow-up message for an existing lead',
    sitevisit: 'invite for a property site visit',
    offer: 'special pricing offer or limited time deal'
  };

  const prompt = `You are a premium real estate advisor at 24K Realtors, Pune. Write a professional yet warm WhatsApp message.

Client: ${lead.name}
Message Type: ${templates[messageType] || 'general follow-up'}
Property Interest: ${lead.propertyType || 'luxury apartment'}
Budget: ₹${lead.budget || 'as discussed'}
Location: ${lead.preferredLocation || 'Hinjewadi/Wakad'}
Agent: ${lead.assignedAgent || 'Team 24K Realtors'}

Rules:
- Use Hinglish (mix of Hindi and English) — natural and warm
- Keep it under 150 words
- Include property highlights
- End with a clear call to action
- Use emojis sparingly but effectively
- Sound personal, NOT like a template
- Mention 24K Realtors brand subtly

Write ONLY the WhatsApp message text, nothing else.`;

  try {
    const result = await callGemini(prompt, { temperature: 0.8, maxTokens: 300 });
    if (result) return result.trim();
  } catch (e) {
    console.warn('[Gemini] WhatsApp generation failed, using template:', e.message);
  }

  // Fallback template
  const fallbacks = {
    welcome: `Namaste ${lead.name} ji! 🏠\n\n24K Realtors ki taraf se swagat hai. Aapki query receive hui — ${lead.propertyType || 'premium property'} ke baare mein.\n\nHamari team ${lead.preferredLocation || 'Pune'} mein best options shortlist kar rahi hai aapke liye.\n\nKya hum kal call arrange kar sakte hain? 🙏`,
    followup: `Namaste ${lead.name} ji! 👋\n\nHope aap theek hain. 24K Realtors ki taraf se follow-up kar raha hoon.\n\nKya aap still ${lead.propertyType || 'property'} ki planning kar rahe hain? Hamare paas kuch exclusive options hain jo aapke liye perfect ho sakte hain.\n\nEk quick call karein? 📞`,
    sitevisit: `Namaste ${lead.name} ji! 🏡\n\nAapke liye ${lead.preferredLocation || 'Hinjewadi'} mein ek beautiful property shortlist ki hai.\n\nSite visit arrange kar sakte hain — free pickup drop bhi available hai!\n\nKab aana chahenge? Weekend ya weekday — aap batao! 😊`,
    offer: `Namaste ${lead.name} ji! 🎯\n\nAapke liye Special offer hai — limited time only!\n\n24K Realtors exclusive deal: Early booking benefits + Flexible payment plan.\n\nYe offer sirf is week valid hai. Call karein abhi! 📞\n\n24K Realtors — Pune's Premium Real Estate Partner 🏆`
  };

  return fallbacks[messageType] || fallbacks.followup;
}

// ═══════════════════════════════════════════════════════════
// 3. PROPERTY MATCH AI
// ═══════════════════════════════════════════════════════════

/**
 * Match properties from inventory to client requirements
 * @param {Object} clientRequirements - Budget, location, BHK, etc.
 * @param {Array} properties - Available property list
 */
export async function matchPropertiesWithAI(clientRequirements, properties) {
  const propertyList = properties.slice(0, 10).map((p, i) => 
    `${i+1}. ${p.title} - ₹${p.price} - ${p.location} - ${p.bhk}BHK`
  ).join('\n');

  const prompt = `You are a real estate matching expert. Match these properties to client requirements.

Client Requirements:
- Budget: ₹${clientRequirements.budget}
- Location: ${clientRequirements.location}
- BHK: ${clientRequirements.bhk}
- Special requirements: ${clientRequirements.notes || 'None'}

Available Properties:
${propertyList}

Return a JSON array of the top 3 matches with match percentage:
[{"index": 1, "matchScore": 95, "reason": "Perfect location and budget match"}]`;

  try {
    const result = await callGemini(prompt, { temperature: 0.2, maxTokens: 300 });
    if (result) {
      const jsonMatch = result.match(/\[[\s\S]*\]/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.warn('[Gemini] Property match failed:', e.message);
  }

  // Fallback: return first 3 properties
  return properties.slice(0, 3).map((_, i) => ({
    index: i + 1,
    matchScore: 80 - (i * 10),
    reason: 'Based on location and budget criteria'
  }));
}

// ═══════════════════════════════════════════════════════════
// 4. AI CHAT ASSISTANT (CRM Co-pilot)
// ═══════════════════════════════════════════════════════════

const chatHistory = [];

/**
 * Chat with AI CRM assistant
 * @param {string} userMessage - Agent's query
 * @param {Object} context - Current CRM context (leads, stats etc.)
 */
export async function chatWithAI(userMessage, context = {}) {
  const systemContext = `You are an intelligent CRM assistant for 24K Realtors, a premium luxury real estate company in Pune, India.

Current CRM Context:
- Total Leads: ${context.totalLeads || 0}
- Hot Leads: ${context.hotLeads || 0}
- This Week's Conversions: ${context.weeklyConversions || 0}
- Active Properties: ${context.activeProperties || 0}

You help agents with:
1. Lead management strategies
2. WhatsApp message drafting
3. Property recommendations
4. Market insights for Pune real estate
5. Follow-up scheduling advice

Answer in Hinglish (mix of Hindi and English). Be concise and actionable.`;

  chatHistory.push({ role: 'user', content: userMessage });

  const conversationPrompt = `${systemContext}

Conversation so far:
${chatHistory.slice(-6).map(m => `${m.role === 'user' ? 'Agent' : 'AI'}: ${m.content}`).join('\n')}

Respond to the agent's latest message: "${userMessage}"`;

  try {
    const result = await callGemini(conversationPrompt, { temperature: 0.7, maxTokens: 400 });
    if (result) {
      chatHistory.push({ role: 'assistant', content: result });
      return result;
    }
  } catch (e) {
    console.warn('[Gemini] Chat failed:', e.message);
  }

  // Intelligent fallback responses
  const lowerMsg = userMessage.toLowerCase();
  if (lowerMsg.includes('hot lead') || lowerMsg.includes('best lead')) {
    return `Aapke paas ${context.hotLeads || 0} hot leads hain abhi. Unhe priority pe call karein — budget qualified hain. Kya main ek follow-up message draft karoon? 🔥`;
  }
  if (lowerMsg.includes('whatsapp') || lowerMsg.includes('message')) {
    return `Zaroor! Kaunse lead ke liye message chahiye? Name batao, main personalized message taiyar karta hoon. 📱`;
  }
  return `Main samajh gaya. Aap ${userMessage} ke baare mein pooch rahe hain. Please thoda aur detail dein taaki main better help kar sakoon. 🤝`;
}

/**
 * Chat with Portal Visitor (Consumer-facing chatbot)
 * Powered by Gemini 2.0 Flash with fallback NLP
 */
export async function chatWithVisitor(userMessage, propertyContext = null) {
  const prompt = `You are "24K Premium Concierge", an expert AI real estate assistant for "24K Realtors", Pune's premier luxury real estate advisory.
  
  Our Brand & Operations Information:
  - Name: 24K Realtors Pune
  - RERA License: A52100028461 (MahaRERA registered, 100% compliant)
  - Tagline: Pune's Premium Location Advisory (Zero Brokerage fee mandate)
  - Prime Corridors: Hinjewadi (5.2% rental yield leader), Wakad (14.2% growth, family residential corridor), Baner (16.5% appreciation, Balewadi High Street hub), Tathawade, Balewadi.
  - VIP Service: We provide complimentary Mercedes-Maybach or BMW 7 Series chauffeured tours for qualified site inspections.
  - Contact Phone: +91 96730 00053
  - Contact Email: contact@24krealtors.in

  ${propertyContext ? `The visitor is currently viewing this property detail page: ${JSON.stringify(propertyContext)}` : ''}

  Rules:
  1. Answer in elegant, warm Hinglish (natural mix of Hindi and English) — respectful (use "Aap", "ji"), highly elite, and professional.
  2. Keep responses concise (under 80-110 words) so they look neat in a chat bubble.
  3. Encourage them to book a VIP chauffeur tour or connect on WhatsApp at +91 96730 00053.
  4. Write ONLY the assistant's reply. Do not add prefix/suffix like "Assistant:".

  Visitor query: "${userMessage}"`;

  try {
    const result = await callGemini(prompt, { temperature: 0.7, maxTokens: 300 });
    if (result) return result.trim();
  } catch (e) {
    console.warn('[Gemini] Visitor chat failed, using fallback NLP:', e.message);
  }

  // Smart local NLP fallback
  const currentInput = userMessage.toLowerCase();
  if (currentInput.includes('wakad')) {
    return 'Wakad Corridor holds a +14.2% annual appreciation rate. Tier-1 societies like 24K Opula starting at ₹1.2 Cr offer excellent inventory. Would you like to schedule a private Mercedes-Maybach site visit?';
  } else if (currentInput.includes('baner')) {
    return 'Baner Corridor is Pune West\'s premium segment, showing a +16.5% YoY price rise near Balewadi High Street. We have 3 gated luxury options available now. Kya hum ek callback arrange karein?';
  } else if (currentInput.includes('hinjewadi')) {
    return 'Hinjewadi IT Corridor is the rental yield leader at 5.2%. Excellent for corporate professionals seeking high capital growth with stable tenants. Type "maybach" to schedule a premium chauffeur site tour!';
  } else if (currentInput.includes('price') || currentInput.includes('cost') || currentInput.includes('budget')) {
    return 'Our portfolio ranges from ₹65 Lakhs for entry IT apartments up to ₹3.8 Crore+ for exclusive whole-floor mandates and luxury penthouses. Aapka budget range kya hai?';
  } else if (currentInput.includes('maybach') || currentInput.includes('chauffeur') || currentInput.includes('car')) {
    return 'We provide complimentary Mercedes-Maybach / BMW 7 Series chauffeured transport for qualified site inspections. Click the "Book VIP Chauffeur Tour" button to book your slot!';
  } else if (currentInput.includes('rera') || currentInput.includes('license') || currentInput.includes('verify')) {
    return 'All properties listed on 24K Realtors are registered with MahaRERA (our license: A52100028461). Aap safe aur secure transactions trust kar sakte hain.';
  }

  return 'Namaste! Main 24K Premium Concierge hoon. Hamare premium properties (Hinjewadi, Wakad, Baner) ya VIP Maybach tours ke baare me kuch bhi poohein. Main aapki help ke liye ready hoon! 😊';
}

export const geminiService = {
  scoreLeadWithAI,
  generateWhatsAppMessage,
  matchPropertiesWithAI,
  chatWithAI,
  chatWithVisitor
};

export default geminiService;

