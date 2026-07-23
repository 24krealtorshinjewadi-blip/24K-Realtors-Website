import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Phone, ShieldCheck, Car, ExternalLink, ArrowRight } from 'lucide-react';
import { geminiService } from '../services/geminiService';

/**
 * ChatWidget — Ultra-Luxury 24K AI Concierge Assistant.
 * Powered by Gemini 2.0 Flash with real-time property context & interactive quick chips.
 */
export default function ChatWidget({
  isOpen,
  setIsOpen,
  activeProperty = null,
  onOpenInquiry = null
}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Namaste! Welcome to 24K Realtors Pune. I am your 24K AI Concierge. How can I assist your luxury property search today?',
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Handle user submission
  const handleSendMessage = async (textToSend) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || isTyping) return;

    // Append user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      // Call Gemini AI service with active property context if available
      const responseText = await geminiService.chatWithVisitor(queryText, activeProperty);
      
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: responseText || 'I am happy to assist you with Pune West real estate options. Feel free to connect with our advisory desk at +91 96730 00053.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const fallbackMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: '24K Realtors covers Hinjewadi, Wakad, Baner & Kharadi. All properties are 100% MahaRERA verified (License: A52100028461). Would you like to schedule a private Maybach site visit or talk to an advisor?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const QUICK_PROMPTS = [
    { label: '🏡 3 BHK Hinjewadi', query: 'Tell me about 3 BHK luxury flats in Hinjewadi' },
    { label: '📍 Baner vs Wakad', query: 'Compare Baner vs Wakad rental yields and price trends' },
    { label: '🚘 VIP Maybach Visit', query: 'How can I book a free Mercedes Maybach site tour?' },
    { label: '🛡️ MahaRERA Compliance', query: 'What is 24K Realtors MahaRERA license details?' },
  ];

  return (
    <>
      {/* Floating Chat Trigger Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="floating-chat-badge"
        aria-label={isOpen ? 'Close chat assistant' : 'Open 24K AI Assistant'}
        aria-expanded={isOpen}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '30px',
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)',
          color: '#040814',
          border: '1px solid rgba(230, 195, 92, 0.6)',
          boxShadow: '0 8px 30px rgba(212, 175, 55, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 999,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Floating Glassmorphic Chat Window */}
      {isOpen && (
        <div
          id="chat-panel-window"
          role="dialog"
          aria-label="24K AI Concierge"
          style={{
            position: 'fixed',
            bottom: '95px',
            right: '30px',
            width: '380px',
            maxWidth: 'calc(100vw - 40px)',
            height: '520px',
            maxHeight: 'calc(100vh - 120px)',
            background: 'linear-gradient(135deg, rgba(7, 15, 30, 0.96) 0%, rgba(10, 20, 38, 0.98) 100%)',
            border: '1px solid rgba(197, 168, 128, 0.3)',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(230, 195, 92, 0.1)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            fontFamily: "'Montserrat', sans-serif"
          }}
        >
          {/* ── Chat Header ── */}
          <div
            style={{
              background: 'linear-gradient(90deg, rgba(230, 195, 92, 0.12) 0%, rgba(7, 15, 30, 0.6) 100%)',
              padding: '14px 18px',
              borderBottom: '1px solid rgba(197, 168, 128, 0.18)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#040814', fontWeight: 800, fontSize: '0.85rem' }}>
                  24K
                </div>
                <span style={{ position: 'absolute', bottom: 0, right: 0, width: '9px', height: '9px', borderRadius: '50%', background: '#25D366', border: '1.5px solid #070F1E' }} />
              </div>
              <div>
                <strong style={{ color: '#E6C35C', fontSize: '0.88rem', display: 'block', lineHeight: 1.2 }}>
                  24K AI Concierge
                </strong>
                <span style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Gemini 2.0 Powered Advisory
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <a
                href="https://wa.me/919673000053?text=Hi%2024K%20Realtors%20AI%20Concierge"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#25D366', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: 700, textDecoration: 'none', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', padding: '4px 8px', borderRadius: '6px' }}
              >
                WhatsApp
              </a>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.6)', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* ── Optional Active Property Context Banner ── */}
          {activeProperty && (
            <div style={{ background: 'rgba(230,195,92,0.06)', borderBottom: '1px solid rgba(230,195,92,0.15)', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '240px' }}>
                <Sparkles size={12} color="#E6C35C" />
                <span style={{ fontWeight: 700, color: '#E6C35C' }}>Viewing:</span> {activeProperty.title}
              </div>
              <button
                onClick={() => handleSendMessage(`Tell me all key details about ${activeProperty.title} at ${activeProperty.location}`)}
                style={{ background: 'none', border: 'none', color: '#E6C35C', fontWeight: 700, fontSize: '0.68rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
              >
                Ask AI <ArrowRight size={10} />
              </button>
            </div>
          )}

          {/* ── Message Log Area ── */}
          <div
            style={{
              flexGrow: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.sender === 'user'
                    ? 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 100%)'
                    : 'rgba(255,255,255,0.04)',
                  color: msg.sender === 'user' ? '#040814' : 'rgba(255,255,255,0.9)',
                  border: msg.sender === 'user' ? 'none' : '1px solid rgba(197, 168, 128, 0.15)',
                  padding: '11px 15px',
                  borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  maxWidth: '84%',
                  fontSize: '0.82rem',
                  lineHeight: '1.55',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              >
                <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                <div style={{ fontSize: '0.6rem', color: msg.sender === 'user' ? 'rgba(4,8,20,0.6)' : 'rgba(255,255,255,0.3)', marginTop: '4px', textAlign: 'right' }}>
                  {msg.time}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(197, 168, 128, 0.15)',
                  padding: '10px 16px',
                  borderRadius: '14px 14px 14px 2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span style={{ fontSize: '0.72rem', color: '#E6C35C', fontWeight: 600 }}>AI is typing</span>
                <span className="dot-pulse" style={{ color: '#E6C35C' }}>...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Quick Prompt Chips ── */}
          <div style={{ padding: '0 12px 8px 12px', display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {QUICK_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p.query)}
                style={{
                  whiteSpace: 'nowrap',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(197,168,128,0.2)',
                  borderRadius: '20px',
                  padding: '5px 11px',
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#E6C35C'; e.currentTarget.style.color = '#E6C35C'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(197,168,128,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* ── Input Form ── */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            style={{
              padding: '12px 16px',
              borderTop: '1px solid rgba(197,168,128,0.15)',
              display: 'flex',
              gap: '8px',
              background: 'rgba(4, 8, 20, 0.6)',
              flexShrink: 0
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about properties, pricing, RERA…"
              style={{
                flexGrow: 1,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(197,168,128,0.2)',
                borderRadius: '10px',
                padding: '9px 13px',
                color: '#fff',
                fontSize: '0.82rem',
                outline: 'none',
                fontFamily: "'Montserrat', sans-serif"
              }}
              onFocus={e => e.target.style.borderColor = '#E6C35C'}
              onBlur={e => e.target.style.borderColor = 'rgba(197,168,128,0.2)'}
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              style={{
                background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 100%)',
                border: 'none',
                color: '#040814',
                padding: '9px 14px',
                borderRadius: '10px',
                cursor: isTyping || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: isTyping || !input.trim() ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
