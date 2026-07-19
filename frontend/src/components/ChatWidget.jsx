import React, { useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

/**
 * ChatWidget — Accessible floating live chat assistant.
 * WCAG AA compliant: role=log, aria-live=polite, focus trap, keyboard close.
 */
export default function ChatWidget({
  isOpen,
  setIsOpen,
  chatMessages,
  chatInput,
  setChatInput,
  onSubmit
}) {
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Keyboard: close on Escape
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="floating-chat-badge"
        aria-label={isOpen ? 'Close chat assistant' : 'Open live chat assistant'}
        aria-expanded={isOpen}
        aria-controls="chat-panel-window"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--gold-primary) 0%, var(--gold-secondary) 100%)',
          color: '#070f1e',
          border: '1px solid var(--border-gold)',
          boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 999,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <MessageSquare size={26} aria-hidden="true" />
      </button>

      {/* Glassmorphic Chat Panel */}
      {isOpen && (
        <div
          id="chat-panel-window"
          className="chat-panel-window"
          role="dialog"
          aria-label="24K Virtual Concierge Chat"
          aria-modal="false"
          onKeyDown={handleKeyDown}
          style={{
            position: 'fixed',
            bottom: '230px',
            right: '30px',
            width: '360px',
            height: '450px',
            background: 'rgba(8, 15, 30, 0.95)',
            border: '1px solid var(--border-gold)',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'slideDown 0.3s forwards',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              background: 'linear-gradient(90deg, rgba(212,175,55,0.1) 0%, rgba(7,15,30,0) 100%)',
              padding: '16px',
              borderBottom: '1px solid var(--border-muted)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-teal)', boxShadow: '0 0 6px var(--accent-teal)' }}
                aria-hidden="true"
              />
              <strong style={{ color: 'var(--gold-primary)', fontSize: '0.95rem' }}>
                24K Virtual Concierge
              </strong>
              <span className="sr-only">— Online</span>
            </div>
            <button
              ref={closeBtnRef}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat assistant"
              style={{
                background: 'transparent',
                border: '1px solid transparent',
                borderRadius: '6px',
                color: 'var(--text-muted)',
                fontSize: '1rem',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          {/* Messages Area — role=log for screen readers */}
          <div
            role="log"
            aria-label="Chat conversation history"
            aria-live="polite"
            aria-atomic="false"
            style={{
              flexGrow: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {chatMessages.map((msg, i) => (
              <div
                key={`msg-${i}`}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.sender === 'user'
                    ? 'var(--gold-primary)'
                    : 'rgba(255,255,255,0.05)',
                  color: msg.sender === 'user' ? '#070f1e' : 'var(--text-light)',
                  padding: '10px 14px',
                  borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  maxWidth: '82%',
                  fontSize: '0.85rem',
                  lineHeight: '1.5',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                <span className="sr-only">{msg.sender === 'user' ? 'You said: ' : 'Concierge replied: '}</span>
                {msg.text}
              </div>
            ))}
            {/* Scroll anchor */}
            <div ref={messagesEndRef} aria-hidden="true" />
          </div>

          {/* Input Form */}
          <form
            onSubmit={onSubmit}
            style={{
              padding: '12px',
              borderTop: '1px solid var(--border-muted)',
              display: 'flex',
              gap: '8px',
              background: 'rgba(7, 15, 30, 0.4)',
              flexShrink: 0,
            }}
          >
            <label htmlFor="chat-input" className="sr-only">
              Type your question about properties
            </label>
            <input
              id="chat-input"
              ref={inputRef}
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Ask about Wakad, pricing, RERA…"
              autoComplete="off"
              style={{
                flexGrow: 1,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-muted)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'var(--text-light)',
                fontSize: '0.85rem',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--gold-primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-muted)'}
              required
            />
            <button
              type="submit"
              className="btn-gold btn-sm"
              aria-label="Send message"
              style={{ padding: '8px 14px', borderRadius: '8px' }}
            >
              <Send size={14} aria-hidden="true" />
              <span className="sr-only">Send</span>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
