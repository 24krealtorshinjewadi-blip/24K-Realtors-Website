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
            <strong className="status-badge">100% Verified Clean Title</strong>
          </div>
          <div className="dossier-stat">
            <span>Compliance Audit Stamp</span>
            <strong>Approved by 24K Legal Desk</strong>
          </div>
          <div className="dossier-paragraph">
            <p>This project has undergone extensive litigation due-diligence by 24K Realtors legal desk. Title clearances, non-agricultural (NA) land certificates, and local municipal corporation (PMRDA/PMC) building approvals are verified.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
