import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function ChatWidget({ 
  isOpen, 
  setIsOpen, 
  chatMessages, 
  chatInput, 
  setChatInput, 
  onSubmit 
}) {
  return (
    <>
      {/* Floating Live Chat Assistant Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="floating-chat-badge"
        style={{
          position: 'fixed',
          bottom: '160px',
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
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        title="Chat with Real Estate Assistant"
      >
        <MessageSquare size={26} />
      </button>

      {/* Glassmorphic Live Chat Window Console */}
      {isOpen && (
        <div style={{
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
          backdropFilter: 'blur(10px)'
        }}>
          {/* Chat Header */}
          <div style={{
            background: 'linear-gradient(90deg, rgba(212,175,55,0.1) 0%, rgba(7,15,30,0) 100%)',
            padding: '16px',
            borderBottom: '1px solid var(--border-muted)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2ec4b6', boxShadow: '0 0 6px #2ec4b6' }}></span>
              <strong style={{ color: 'var(--gold-primary)', fontSize: '0.95rem' }}>24K Virtual Concierge</strong>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>

          {/* Messages Area */}
          <div style={{ flexGrow: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {chatMessages.map((msg, i) => (
              <div 
                key={i} 
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.sender === 'user' ? 'var(--gold-primary)' : 'rgba(255,255,255,0.05)',
                  color: msg.sender === 'user' ? '#070f1e' : 'var(--text-light)',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  maxWidth: '80%',
                  fontSize: '0.85rem',
                  lineHeight: '1.4',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Chat Input / Action Form */}
          <form 
            onSubmit={onSubmit}
            style={{
              padding: '12px',
              borderTop: '1px solid var(--border-muted)',
              display: 'flex',
              gap: '8px',
              background: 'rgba(7, 15, 30, 0.4)'
            }}
          >
            <input 
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Ask about properties, pricing..."
              style={{
                flexGrow: 1,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-muted)',
                borderRadius: '6px',
                padding: '8px 12px',
                color: 'var(--text-light)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
              required
            />
            <button 
              type="submit" 
              className="btn-gold"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
