import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

let toastSubscriber = null;

export const toast = {
  success: (message, duration = 4000) => toastSubscriber?.({ type: 'success', message, duration }),
  error: (message, duration = 5000) => toastSubscriber?.({ type: 'error', message, duration }),
  info: (message, duration = 4000) => toastSubscriber?.({ type: 'info', message, duration }),
  warning: (message, duration = 4500) => toastSubscriber?.({ type: 'warning', message, duration }),
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    toastSubscriber = (toastItem) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { ...toastItem, id }]);

      if (toastItem.duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, toastItem.duration);
      }
    };

    return () => {
      toastSubscriber = null;
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (toasts.length === 0) return null;

  const getStyle = (type) => {
    switch (type) {
      case 'success':
        return {
          border: '1px solid rgba(16, 185, 129, 0.4)',
          bg: 'rgba(10, 24, 18, 0.95)',
          color: '#10B981',
          icon: CheckCircle2,
        };
      case 'error':
        return {
          border: '1px solid rgba(239, 68, 68, 0.4)',
          bg: 'rgba(28, 10, 10, 0.95)',
          color: '#EF4444',
          icon: AlertCircle,
        };
      case 'warning':
        return {
          border: '1px solid rgba(245, 158, 11, 0.4)',
          bg: 'rgba(28, 20, 10, 0.95)',
          color: '#F59E0B',
          icon: AlertTriangle,
        };
      default:
        return {
          border: '1px solid rgba(212, 175, 55, 0.4)',
          bg: 'rgba(10, 18, 36, 0.95)',
          color: '#D4AF37',
          icon: Info,
        };
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        width: 'calc(100vw - 48px)',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => {
        const conf = getStyle(t.type);
        const IconComponent = conf.icon;
        return (
          <div
            key={t.id}
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '10px',
              background: conf.bg,
              border: conf.border,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 12px rgba(212, 175, 55, 0.08)',
              backdropFilter: 'blur(12px)',
              animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <IconComponent size={18} color={conf.color} style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.8rem', color: '#FFF', fontWeight: 600, lineHeight: 1.4 }}>
                {t.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
