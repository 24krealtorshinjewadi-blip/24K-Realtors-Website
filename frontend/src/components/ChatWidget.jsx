import React from 'react';

/**
 * ChatWidget — Replaced with clean WhatsApp Floating Action Button per user request.
 * Direct WhatsApp connection to 24K Realtors Advisory (+91 96730 00053).
 */
export default function ChatWidget({ activeProperty = null }) {
  const propertyTitle = activeProperty?.title ? ` regarding ${activeProperty.title}` : '';
  const waUrl = `https://wa.me/919673000053?text=${encodeURIComponent(`Hi 24K Realtors, I am browsing your portal and need assistance${propertyTitle}. Please guide me.`)}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp 24K Realtors Advisory"
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
        color: '#FFF',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        boxShadow: '0 8px 25px rgba(37, 211, 102, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        cursor: 'pointer',
        zIndex: 9999,
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.08)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(37, 211, 102, 0.6)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(37, 211, 102, 0.45)';
      }}
    >
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
        <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.233-1.371a9.98 9.98 0 0 0 4.779 1.217h.005c5.502 0 9.987-4.476 9.988-9.986C22 7.478 17.517 2 12.012 2z"/>
      </svg>
    </a>
  );
}
