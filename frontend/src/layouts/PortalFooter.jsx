import React from 'react';

export default function PortalFooter() {
  return (
    <footer className="footer" style={{ borderTop: '1px solid var(--border-gold)', background: '#020617', padding: '30px 20px', marginTop: 'auto' }}>
      <div className="footer-content" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>© 2026 24K Realtors Pune. All rights reserved.</p>
        <p className="footer-tagline" style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.8rem', lineHeight: 1.5 }}>Premium residential and commercial properties in Hinjewadi, Wakad, Baner, Balewadi, and Tathawade.</p>
      </div>
    </footer>
  );
}
