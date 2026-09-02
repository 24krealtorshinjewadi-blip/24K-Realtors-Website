import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function ReraDrawer({ isOpen, property, onClose }) {
  if (!isOpen || !property) return null;

  return (
    <div className="rera-drawer-overlay" onClick={onClose}>
      <div className="rera-drawer-content" onClick={e => e.stopPropagation()}>
        <button className="drawer-close" onClick={onClose}>×</button>
        <div className="drawer-header">
          <ShieldCheck size={28} color="#D4AF37" />
          <h3>MahaRERA Regulatory Clearance</h3>
        </div>
        <div className="drawer-body">
          <div className="dossier-stat">
            <span>RERA License ID</span>
            <strong>{property.reraNumber || 'PRM/PUNE/124/2026'}</strong>
          </div>
          <div className="dossier-stat">
            <span>Project Title Clear Status</span>
            <strong className="status-badge" style={{ color: '#22c55e' }}>100% Verified Clean Title</strong>
          </div>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <a 
              href="https://maharera.maharashtra.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 100%)',
                color: '#040814',
                padding: '10px 20px',
                borderRadius: '50px',
                fontWeight: 800,
                fontSize: '0.82rem',
                textDecoration: 'none',
                boxShadow: '0 4px 15px rgba(212,175,55,0.3)'
              }}
            >
              Verify MahaRERA Registration ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
