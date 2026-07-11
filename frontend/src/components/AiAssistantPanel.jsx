// ═══════════════════════════════════════════════════════════════
// 24K REALTORS — AI Assistant Panel (CRM Co-pilot)
// Floating panel with: AI Chat | Lead Scoring | WhatsApp Gen | Voice
// ═══════════════════════════════════════════════════════════════
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import geminiService from '../services/geminiService';
import { voiceService } from '../services/voiceService';

const GOLD = '#D4AF37';

export default function AiAssistantPanel({ leads = [], selectedLead = null, onCommand }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Namaste! 👋 Main aapka CRM co-pilot hoon. Leads score karna ho, WhatsApp message likhna ho, ya koi bhi query — main ready hoon!', time: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiScore, setAiScore] = useState(null);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [messageType, setMessageType] = useState('followup');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Chat Handler ─────────────────────────────────────────
  const handleSendMessage = async () => {
    if (!inputText.trim() || isProcessing) return;

    const userMsg = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg, time: new Date() }]);
    setIsProcessing(true);

    try {
      const context = {
        totalLeads: leads.length,
        hotLeads: leads.filter(l => l.status === 'HOT').length,
        weeklyConversions: 0,
        activeProperties: 0
      };
      const response = await geminiService.chatWithAI(userMsg, context);
      setMessages(prev => [...prev, { role: 'ai', text: response, time: new Date() }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, kuch technical issue hua. Thodi der baad try karein. 🙏', time: new Date() }]);
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Lead Scoring ─────────────────────────────────────────
  const handleScoreLead = async () => {
    if (!selectedLead) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Pehle CRM se koi lead select karein, phir main score karoonga! 🎯', time: new Date() }]);
      setActiveTab('chat');
      return;
    }

    setIsProcessing(true);
    setAiScore(null);
    try {
      const score = await geminiService.scoreLeadWithAI(selectedLead);
      setAiScore(score);
    } catch (e) {
      setAiScore({ score: 'WARM', priority: 5, reason: 'Analysis unavailable', nextAction: 'Manual review needed', estimatedDealSize: 'TBD' });
    } finally {
      setIsProcessing(false);
    }
  };

  // ── WhatsApp Gen ─────────────────────────────────────────
  const handleGenerateMessage = async () => {
    if (!selectedLead) {
      setMessages(prev => [...prev, { role: 'ai', text: 'CRM se ek lead select karein — main personalized WhatsApp message draft karoonga! 📱', time: new Date() }]);
      setActiveTab('chat');
      return;
    }

    setIsProcessing(true);
    setGeneratedMessage('');
    try {
      const msg = await geminiService.generateWhatsAppMessage(selectedLead, messageType);
      setGeneratedMessage(msg);
    } catch (e) {
      setGeneratedMessage('Message generation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Voice Commands ───────────────────────────────────────
  const handleVoiceToggle = () => {
    if (isVoiceActive) {
      voiceService.stopListening();
      setIsVoiceActive(false);
      setVoiceTranscript('');
    } else {
      voiceService.startListening(
        (command) => {
          if (onCommand) onCommand(command);
          setMessages(prev => [...prev, {
            role: 'ai',
            text: `🎤 Command: "${command.transcript}" → ${command.action}`,
            time: new Date()
          }]);
          if (command.action === 'STOP_VOICE') {
            setIsVoiceActive(false);
          }
        },
        (transcript) => setVoiceTranscript(transcript),
        (state) => {
          setIsVoiceActive(state.listening || false);
          if (state.error) {
            setMessages(prev => [...prev, { role: 'ai', text: `🎤 Voice Error: ${state.error}`, time: new Date() }]);
          }
        }
      );
      setIsVoiceActive(true);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const scoreColors = { HOT: '#FF4444', WARM: '#FF8C00', COLD: '#4488FF' };
  const scoreEmojis = { HOT: '🔥', WARM: '🟡', COLD: '❄️' };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
          width: '56px', height: '56px', borderRadius: '50%',
          background: `linear-gradient(135deg, ${GOLD}, #B8960C)`,
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(212,175,55,0.4)',
          fontSize: '22px',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="AI CRM Assistant"
      >
        {isOpen ? '✕' : '🤖'}
      </motion.button>

      {/* AI Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed', bottom: '88px', right: '24px', zIndex: 9998,
              width: '380px', height: '520px',
              background: 'rgba(7, 15, 30, 0.95)',
              backdropFilter: 'blur(30px)',
              border: `1px solid rgba(212,175,55,0.2)`,
              borderRadius: '20px',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            {/* Header */}
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid rgba(212,175,55,0.15)',
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'rgba(212,175,55,0.04)',
            }}>
              <span style={{ fontSize: '20px' }}>🤖</span>
              <div>
                <div style={{ color: GOLD, fontWeight: 700, fontSize: '0.85rem' }}>24K AI Co-pilot</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem' }}>Powered by Gemini</div>
              </div>
              {/* Voice toggle */}
              <button
                onClick={handleVoiceToggle}
                style={{
                  marginLeft: 'auto',
                  background: isVoiceActive ? 'rgba(255,68,68,0.2)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${isVoiceActive ? 'rgba(255,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '20px', padding: '5px 10px',
                  color: isVoiceActive ? '#FF4444' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}
              >
                <span style={{ fontSize: '12px' }}>{isVoiceActive ? '⏹' : '🎤'}</span>
                {isVoiceActive ? 'Stop' : 'Voice'}
              </button>
            </div>

            {/* Voice transcript bar */}
            <AnimatePresence>
              {isVoiceActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{
                    background: 'rgba(255,68,68,0.08)',
                    borderBottom: '1px solid rgba(255,68,68,0.15)',
                    padding: '8px 16px', fontSize: '0.72rem',
                    color: '#FF8888', display: 'flex', alignItems: 'center', gap: '8px',
                  }}
                >
                  <span style={{ animation: 'pulse 1s infinite' }}>🔴</span>
                  <span>{voiceTranscript || 'Listening...'}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tab Bar */}
            <div style={{
              display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)',
              padding: '0 8px',
            }}>
              {['chat', 'score', 'message'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1, padding: '8px 4px',
                    background: 'none', border: 'none',
                    borderBottom: `2px solid ${activeTab === tab ? GOLD : 'transparent'}`,
                    color: activeTab === tab ? GOLD : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab === 'chat' ? '💬 Chat' : tab === 'score' ? '🎯 Score' : '📱 WA Msg'}
                </button>
              ))}
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

              {/* ── CHAT TAB ─────────────────────────── */}
              {activeTab === 'chat' && (
                <>
                  <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {messages.map((msg, i) => (
                      <div key={i} style={{
                        display: 'flex', flexDirection: 'column',
                        alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      }}>
                        <div style={{
                          maxWidth: '80%', padding: '8px 12px',
                          borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          background: msg.role === 'user' ? `linear-gradient(135deg, ${GOLD}, #B8960C)` : 'rgba(255,255,255,0.06)',
                          color: msg.role === 'user' ? '#070F1E' : 'rgba(255,255,255,0.85)',
                          fontSize: '0.78rem', lineHeight: 1.5, fontWeight: msg.role === 'user' ? 600 : 400,
                        }}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isProcessing && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px' }}>
                        <span style={{ color: GOLD, fontSize: '0.7rem' }}>AI is thinking</span>
                        <span style={{ color: GOLD }}>...</span>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <div style={{ padding: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '8px' }}>
                    <input
                      ref={inputRef}
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask anything about leads, properties..."
                      style={{
                        flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '20px', padding: '8px 14px', color: '#fff',
                        fontSize: '0.78rem', outline: 'none', fontFamily: 'inherit',
                      }}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isProcessing || !inputText.trim()}
                      style={{
                        background: `linear-gradient(135deg, ${GOLD}, #B8960C)`,
                        border: 'none', borderRadius: '50%', width: '36px', height: '36px',
                        cursor: 'pointer', fontSize: '14px', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        opacity: isProcessing ? 0.5 : 1,
                      }}
                    >→</button>
                  </div>
                </>
              )}

              {/* ── SCORE TAB ────────────────────────── */}
              {activeTab === 'score' && (
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flex: 1 }}>
                  {selectedLead ? (
                    <div style={{
                      background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '12px',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}>
                      <div style={{ color: GOLD, fontWeight: 700, fontSize: '0.8rem', marginBottom: '4px' }}>{selectedLead.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>{selectedLead.phone} · {selectedLead.propertyType}</div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', padding: '20px 0' }}>
                      CRM se koi lead select karein
                    </div>
                  )}

                  <button
                    onClick={handleScoreLead}
                    disabled={isProcessing || !selectedLead}
                    style={{
                      width: '100%', padding: '11px',
                      background: isProcessing ? 'rgba(212,175,55,0.2)' : `linear-gradient(135deg, ${GOLD}, #B8960C)`,
                      border: 'none', borderRadius: '10px', cursor: 'pointer',
                      color: '#070F1E', fontWeight: 700, fontSize: '0.82rem',
                      opacity: !selectedLead ? 0.5 : 1,
                    }}
                  >
                    {isProcessing ? '⏳ Analyzing...' : '🎯 Score with AI'}
                  </button>

                  {aiScore && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '14px',
                        border: `1px solid ${scoreColors[aiScore.score]}33`,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '22px' }}>{scoreEmojis[aiScore.score]}</span>
                        <div>
                          <div style={{ color: scoreColors[aiScore.score], fontWeight: 800, fontSize: '1rem' }}>{aiScore.score} LEAD</div>
                          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>Priority: {aiScore.priority}/10</div>
                        </div>
                        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                          <div style={{ color: GOLD, fontWeight: 700, fontSize: '0.8rem' }}>{aiScore.estimatedDealSize}</div>
                          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>Est. Deal</div>
                        </div>
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', marginBottom: '8px' }}>{aiScore.reason}</div>
                      <div style={{
                        background: `${scoreColors[aiScore.score]}15`, borderRadius: '8px', padding: '8px',
                        color: scoreColors[aiScore.score], fontSize: '0.72rem', fontWeight: 600,
                      }}>
                        ➤ {aiScore.nextAction}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* ── WHATSAPP MSG TAB ─────────────────── */}
              {activeTab === 'message' && (
                <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['welcome', 'followup', 'sitevisit', 'offer'].map(type => (
                      <button
                        key={type}
                        onClick={() => setMessageType(type)}
                        style={{
                          padding: '5px 10px', borderRadius: '20px', fontSize: '0.68rem', fontWeight: 600,
                          border: `1px solid ${messageType === type ? GOLD : 'rgba(255,255,255,0.12)'}`,
                          background: messageType === type ? `${GOLD}20` : 'transparent',
                          color: messageType === type ? GOLD : 'rgba(255,255,255,0.5)',
                          cursor: 'pointer', textTransform: 'capitalize',
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleGenerateMessage}
                    disabled={isProcessing || !selectedLead}
                    style={{
                      padding: '10px', background: `linear-gradient(135deg, #25D366, #128C7E)`,
                      border: 'none', borderRadius: '10px', cursor: 'pointer',
                      color: '#fff', fontWeight: 700, fontSize: '0.82rem',
                      opacity: !selectedLead ? 0.5 : 1,
                    }}
                  >
                    {isProcessing ? '⏳ Generating...' : '📱 Generate WhatsApp Message'}
                  </button>

                  {!selectedLead && (
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>
                      CRM se koi lead select karein
                    </div>
                  )}

                  {generatedMessage && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        background: 'rgba(37,211,102,0.06)', borderRadius: '12px', padding: '12px',
                        border: '1px solid rgba(37,211,102,0.2)', flex: 1,
                      }}
                    >
                      <div style={{ color: '#25D366', fontSize: '0.72rem', fontWeight: 700, marginBottom: '8px' }}>
                        Generated Message:
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {generatedMessage}
                      </div>
                      <button
                        onClick={() => copyToClipboard(generatedMessage)}
                        style={{
                          marginTop: '10px', padding: '7px 14px', background: 'rgba(37,211,102,0.15)',
                          border: '1px solid rgba(37,211,102,0.3)', borderRadius: '8px',
                          color: '#25D366', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600,
                        }}
                      >
                        📋 Copy to Clipboard
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
