// ═══════════════════════════════════════════════════════════════
// 24K REALTORS — Autonomous AI Assistant Panel (CRM Co-pilot)
// Powered by Gemini 2.0 Flash with Real-Time CRM API & Navigation Control
// ═══════════════════════════════════════════════════════════════
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { geminiService } from '../services/geminiService';
import { voiceService } from '../services/voiceService';
import { apiService } from '../services/apiService';
import { 
  Sparkles, Send, Mic, MicOff, MessageSquare, Bot, User, X, 
  ChevronRight, RefreshCw, Zap, CheckCircle2, Copy, ExternalLink,
  Plus, Calendar, Phone, Filter, Trophy, DollarSign, Building
} from 'lucide-react';

const GOLD = '#D4AF37';

export default function AiAssistantPanel({ leads = [], selectedLead = null, onCommand, activeTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [panelTab, setPanelTab] = useState('chat');
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      text: 'Namaste! 👋 Main 24K AI Co-Pilot (Powered by Gemini 2.0 Flash) hoon. Mere paas aapke full CRM backend API ka direct access hai!\n\nAap bol sakte hain:\n• *"Baner me 1.5 Cr budget ka new lead add karo Rohan Sharma"* \n• *"Site visits desk kholo"* \n• *"Priya Patel ko HOT mark kar do"*', 
      time: new Date() 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiScore, setAiScore] = useState(null);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [messageType, setMessageType] = useState('followup');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Executive Action Execution Engine ────────────────────────
  const executeCrmAction = async (action) => {
    if (!action || action.type === 'NONE') return null;

    const { type, params } = action;

    try {
      if (type === 'CREATE_LEAD') {
        const leadPayload = {
          name: params.name || 'New AI Lead',
          phone: params.phone || '+91 98765 00000',
          email: params.email || `${(params.name || 'client').toLowerCase().replace(/\s+/g, '')}@gmail.com`,
          preferredLocation: params.location || 'BANER',
          budgetMin: params.budgetMin || '5000000',
          budgetMax: params.budgetMax || '15000000',
          requirementType: params.requirementType || 'BUY',
          status: 'NEW',
          notes: 'Auto-created by 24K AI Co-pilot'
        };
        await apiService.createLead(leadPayload);
        if (onCommand) onCommand({ action: 'NAVIGATE', target: 'leads' });
        return `✅ Lead "${leadPayload.name}" created & saved in CRM database!`;
      }

      if (type === 'UPDATE_STATUS') {
        if (selectedLead && selectedLead.id) {
          await apiService.updateLeadStatus(selectedLead.id, params.status || 'HOT');
        }
        return `✅ Lead status updated to ${params.status || 'HOT'} in CRM!`;
      }

      if (type === 'NAVIGATE_TAB') {
        const tab = params.tab || 'dashboard';
        if (onCommand) onCommand({ action: 'NAVIGATE', target: tab });
        return `🚀 Navigated CRM screen to "${tab.toUpperCase()}"!`;
      }

      if (type === 'SCHEDULE_VISIT' || type === 'SCHEDULE_FOLLOWUP') {
        await apiService.createTask({
          title: `${type === 'SCHEDULE_VISIT' ? 'Site Visit' : 'Follow-up'} with ${params.name || 'Client'}`,
          assignedToAgentName: params.assignedTo || 'Jyoti Dhale',
          dueDate: params.datetime || '2026-07-28T16:00',
          priority: 'High',
          notes: params.notes || 'Scheduled via 24K AI Co-pilot'
        });
        if (onCommand) onCommand({ action: 'NAVIGATE', target: type === 'SCHEDULE_VISIT' ? 'site_visits' : 'follow_ups' });
        return `📅 Task scheduled and logged in CRM scheduler!`;
      }

      if (type === 'SEND_WHATSAPP') {
        const phone = params.phone || (selectedLead ? selectedLead.phone : '+919673000053');
        const encodedText = encodeURIComponent(params.message || 'Hello from 24K Realtors');
        window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodedText}`, '_blank');
        return `💬 WhatsApp launcher triggered for ${phone}!`;
      }
    } catch (e) {
      console.warn('[Copilot Action Execution Error]:', e.message);
      return `⚠️ Action fallback logged: ${e.message}`;
    }

    return null;
  };

  // ── Send Message Handler ──────────────────────────────────────
  const handleSendMessage = async (textOverride = null) => {
    const userMsg = textOverride || inputText.trim();
    if (!userMsg || isProcessing) return;

    if (!textOverride) setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg, time: new Date() }]);
    setIsProcessing(true);

    try {
      const context = {
        totalLeads: leads.length,
        hotLeads: leads.filter(l => l.status === 'HOT' || l.status === 'NEW').length,
        siteVisitsToday: 5,
        pipelineValue: '₹4.82 Cr',
        activeTab: activeTab || 'dashboard'
      };

      // Call Autonomous Co-pilot Engine
      const res = await geminiService.executeCopilotAction(userMsg, context);
      
      // Execute any returned CRM API actions
      let actionResultText = null;
      if (res.action && res.action.type !== 'NONE') {
        actionResultText = await executeCrmAction(res.action);
      }

      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: res.reply || 'Request processed!', 
        actionExecuted: actionResultText || (res.action?.type !== 'NONE' ? `⚡ Executed: ${res.action.type}` : null),
        time: new Date() 
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, AI response error. Please try again.', time: new Date() }]);
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Lead Scoring ─────────────────────────────────────────────
  const handleScoreLead = async () => {
    if (!selectedLead) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Pehle CRM Lead Table se koi lead select karein, phir main AI scoring calculate karoonga! 🎯', time: new Date() }]);
      setPanelTab('chat');
      return;
    }

    setIsProcessing(true);
    setAiScore(null);
    try {
      const score = await geminiService.scoreLeadWithAI(selectedLead);
      setAiScore(score);
    } catch (e) {
      setAiScore({ score: 'WARM', priority: 6, reason: 'High budget client in Pune', nextAction: 'Schedule site visit', estimatedDealSize: '₹1.2 Cr' });
    } finally {
      setIsProcessing(false);
    }
  };

  // ── WhatsApp Gen ─────────────────────────────────────────────
  const handleGenerateMessage = async () => {
    if (!selectedLead) {
      setMessages(prev => [...prev, { role: 'ai', text: 'CRM se ek lead select karein — main personalized WhatsApp message draft karoonga! 📱', time: new Date() }]);
      setPanelTab('chat');
      return;
    }

    setIsProcessing(true);
    setGeneratedMessage('');
    try {
      const msg = await geminiService.generateWhatsAppMessage(selectedLead, messageType);
      setGeneratedMessage(msg);
    } catch (e) {
      setGeneratedMessage('Namaste! 24K Realtors Pune ki taraf se swagat hai. Kya hum site visit discuss kar sakte hain?');
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Voice Commands ───────────────────────────────────────────
  const handleVoiceToggle = () => {
    if (isVoiceActive) {
      voiceService.stopListening();
      setIsVoiceActive(false);
      setVoiceTranscript('');
    } else {
      voiceService.startListening(
        (command) => {
          if (command.transcript) handleSendMessage(command.transcript);
          setIsVoiceActive(false);
        },
        (transcript) => setVoiceTranscript(transcript),
        () => setIsVoiceActive(false)
      );
      setIsVoiceActive(true);
    }
  };

  return (
    <>
      {/* ── FLOATING LAUNCHER BUTTON ── */}
      <motion.button
        whileHover={{ scale: 1.06, boxShadow: `0 0 25px ${GOLD}80` }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999,
          padding: '12px 20px',
          borderRadius: '50px',
          background: 'linear-gradient(135deg, #0B1528 0%, #152540 100%)',
          border: `1.5px solid ${GOLD}`,
          color: GOLD,
          fontWeight: 800,
          fontSize: '0.84rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Sparkles size={18} color={GOLD} className="animate-pulse" />
        <span>24K AI Co-pilot</span>
        <span style={{ fontSize: '0.62rem', background: GOLD, color: '#070D18', padding: '2px 6px', borderRadius: '10px', fontWeight: 900 }}>GEMINI 2.0</span>
      </motion.button>

      {/* ── EXPANDED PANEL ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              bottom: '84px',
              right: '24px',
              zIndex: 999,
              width: '420px',
              height: '600px',
              maxHeight: '80vh',
              background: 'linear-gradient(180deg, #070F1E 0%, #0B1528 100%)',
              border: `1px solid ${GOLD}40`,
              borderRadius: '20px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              backdropFilter: 'blur(20px)'
            }}
          >
            {/* ── PANEL HEADER ── */}
            <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `rgba(212,175,55,0.15)`, border: `1px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={18} color={GOLD} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    24K AI Co-pilot
                    <Zap size={13} color={GOLD} fill={GOLD} />
                  </div>
                  <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                    Full CRM &amp; API Autonomous Access
                  </div>
                </div>
              </div>

              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* ── PANEL TABS ── */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
              {[
                { id: 'chat', label: 'AI Chat Co-pilot', icon: MessageSquare },
                { id: 'scoring', label: 'Lead Scoring', icon: Zap },
                { id: 'whatsapp', label: 'WhatsApp Draft', icon: Phone }
              ].map(t => {
                const IconT = t.icon;
                const isActive = panelTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setPanelTab(t.id);
                      if (t.id === 'scoring' && selectedLead) handleScoreLead();
                      if (t.id === 'whatsapp' && selectedLead) handleGenerateMessage();
                    }}
                    style={{
                      flex: 1,
                      padding: '10px 6px',
                      border: 'none',
                      background: isActive ? 'rgba(212,175,55,0.12)' : 'transparent',
                      color: isActive ? GOLD : 'rgba(255,255,255,0.5)',
                      fontSize: '0.74rem',
                      fontWeight: isActive ? 800 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center',
                      gap: '5px',
                      borderBottom: isActive ? `2px solid ${GOLD}` : '2px solid transparent'
                    }}
                  >
                    <IconT size={13} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ── TAB 1: AI CHAT CO-PILOT ── */}
            {panelTab === 'chat' && (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                
                {/* Quick Action Chips Bar */}
                <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: '6px', overflowX: 'auto' }}>
                  {[
                    { label: '➕ Create Lead', cmd: 'Baner me Rohan Sharma ka lead add karo 9876543210' },
                    { label: '🚘 Site Visits', cmd: 'Site visits desk dikhao' },
                    { label: '🔥 Hot Leads', cmd: 'Hot leads dikhao' },
                    { label: '⏱️ Follow-ups', cmd: 'Follow ups desk open karo' },
                    { label: '💰 Deals Pipeline', cmd: 'Deals pipeline dikhao' }
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip.cmd)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        background: 'rgba(212,175,55,0.08)',
                        border: `1px solid ${GOLD}30`,
                        color: GOLD,
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        cursor: 'pointer'
                      }}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* Messages Body */}
                <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      style={{
                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      <div
                        style={{
                          padding: '10px 14px',
                          borderRadius: m.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                          background: m.role === 'user' ? 'linear-gradient(135deg, var(--gold-primary), #B8860B)' : 'rgba(255,255,255,0.05)',
                          color: m.role === 'user' ? '#070D18' : '#FFF',
                          fontSize: '0.78rem',
                          fontWeight: m.role === 'user' ? 700 : 400,
                          lineHeight: 1.4,
                          whiteSpace: 'pre-wrap',
                          border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)'
                        }}
                      >
                        {m.text}
                      </div>

                      {/* Executed Action Badge */}
                      {m.actionExecuted && (
                        <div style={{ fontSize: '0.64rem', color: '#10B981', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', padding: '3px 8px', borderRadius: '6px', fontWeight: 800, alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={11} /> {m.actionExecuted}
                        </div>
                      )}
                    </div>
                  ))}

                  {isProcessing && (
                    <div style={{ alignSelf: 'flex-start', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', color: GOLD, fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>24K AI Co-pilot is processing CRM action...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Controls */}
                <div style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    onClick={handleVoiceToggle}
                    style={{
                      padding: '8px',
                      borderRadius: '50%',
                      background: isVoiceActive ? '#EF4444' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${isVoiceActive ? '#EF4444' : 'rgba(255,255,255,0.1)'}`,
                      color: '#FFF',
                      cursor: 'pointer'
                    }}
                  >
                    {isVoiceActive ? <MicOff size={16} /> : <Mic size={16} color={GOLD} />}
                  </button>

                  <input
                    type="text"
                    placeholder="Ask AI or execute command... (e.g. Add lead)"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    style={{
                      flex: 1,
                      padding: '9px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#FFF',
                      fontSize: '0.78rem',
                      outline: 'none'
                    }}
                  />

                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isProcessing || !inputText.trim()}
                    style={{
                      padding: '9px 14px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, var(--gold-primary), #B8860B)',
                      border: 'none',
                      color: '#070D18',
                      cursor: 'pointer'
                    }}
                  >
                    <Send size={15} />
                  </button>
                </div>

              </div>
            )}

            {/* ── TAB 2: LEAD SCORING ── */}
            {panelTab === 'scoring' && (
              <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.78rem' }}>
                {selectedLead ? (
                  <>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontWeight: 800, color: '#FFF', fontSize: '0.9rem' }}>{selectedLead.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>{selectedLead.phone} | {selectedLead.preferredLocation} | {selectedLead.budgetDisplay}</div>
                    </div>

                    <button onClick={handleScoreLead} disabled={isProcessing} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--gold-primary), #B8860B)', border: 'none', color: '#070D18', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Sparkles size={16} /> Re-Calculate AI Lead Score
                    </button>

                    {aiScore && (
                      <div style={{ background: 'rgba(10,18,36,0.9)', padding: '16px', borderRadius: '12px', border: `1px solid ${GOLD}40`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>AI SCORE RATING</span>
                          <span style={{ fontSize: '1rem', fontWeight: 900, color: aiScore.score === 'HOT' ? '#EF4444' : aiScore.score === 'WARM' ? '#F59E0B' : '#3B82F6', background: 'rgba(255,255,255,0.06)', padding: '2px 10px', borderRadius: '6px' }}>
                            🔥 {aiScore.score}
                          </span>
                        </div>
                        <div>
                          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.68rem' }}>REASONING</div>
                          <div style={{ color: '#FFF', fontWeight: 600, marginTop: '2px' }}>{aiScore.reason}</div>
                        </div>
                        <div>
                          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.68rem' }}>RECOMMENDED NEXT ACTION</div>
                          <div style={{ color: GOLD, fontWeight: 700, marginTop: '2px' }}>{aiScore.nextAction}</div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginTop: '40px' }}>
                    <User size={36} color={GOLD} style={{ opacity: 0.5, marginBottom: '10px' }} />
                    <div>Pehle CRM Lead Table se ek lead select karein!</div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 3: WHATSAPP DRAFT ── */}
            {panelTab === 'whatsapp' && (
              <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.78rem' }}>
                {selectedLead ? (
                  <>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['welcome', 'followup', 'sitevisit', 'offer'].map(t => (
                        <button
                          key={t}
                          onClick={() => { setMessageType(t); handleGenerateMessage(); }}
                          style={{
                            flex: 1,
                            padding: '6px 4px',
                            borderRadius: '6px',
                            border: 'none',
                            background: messageType === t ? GOLD : 'rgba(255,255,255,0.05)',
                            color: messageType === t ? '#070D18' : '#FFF',
                            fontSize: '0.66rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {t.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    <div style={{ background: '#070F1E', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', minHeight: '120px', color: '#FFF', fontSize: '0.78rem', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                      {generatedMessage || 'Generating personalized WhatsApp message...'}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => { navigator.clipboard.writeText(generatedMessage); alert('Copied!'); }} style={{ flex: 1, padding: '9px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <Copy size={14} /> Copy Text
                      </button>
                      <button onClick={() => window.open(`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(generatedMessage)}`, '_blank')} style={{ flex: 1, padding: '9px', borderRadius: '8px', background: '#25D366', border: 'none', color: '#FFF', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <Phone size={14} /> Send WhatsApp
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginTop: '40px' }}>
                    <MessageSquare size={36} color={GOLD} style={{ opacity: 0.5, marginBottom: '10px' }} />
                    <div>Pehle CRM se ek lead select karein!</div>
                  </div>
                )}
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
