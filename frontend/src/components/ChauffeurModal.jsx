import React from 'react';
import { Car, Loader } from 'lucide-react';

export default function ChauffeurModal({ isOpen, property, onClose, onSubmit, chauffeurForm, setChauffeurForm, chauffeurSubmitting }) {
  if (!isOpen || !property) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--gold-primary)', marginBottom: '14px', borderBottom: '1px solid var(--border-muted)', paddingBottom: '12px' }}>
          <Car size={26} className="animate-pulse" />
          <div>
            <h3 className="modal-title" style={{ border: 'none', margin: 0, padding: 0, fontSize: '1.4rem' }}>Book Private Site Visit</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Complimentary Chauffeur Pickup & Site Tour</span>
          </div>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
          Schedule a premium, private chauffeured viewing of <strong>{property.title}</strong> in Pune's prime tech corridors.
        </p>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              required 
              placeholder="e.g. Anand Mahindra"
              value={chauffeurForm.name}
              onChange={e => setChauffeurForm({ ...chauffeurForm, name: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">WhatsApp Mobile</label>
              <input 
                type="tel" 
                className="form-input" 
                required 
                placeholder="e.g. +919876543210"
                value={chauffeurForm.phone}
                onChange={e => setChauffeurForm({ ...chauffeurForm, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Preferred Date</label>
              <input 
                type="date" 
                className="form-input" 
                required
                value={chauffeurForm.visitDate}
                onChange={e => setChauffeurForm({ ...chauffeurForm, visitDate: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Preferred Time Slot</label>
              <select 
                value={chauffeurForm.timeSlot} 
                onChange={e => setChauffeurForm({ ...chauffeurForm, timeSlot: e.target.value })} 
                className="form-input"
              >
                <option value="MORNING">Morning (9 AM - 12 PM)</option>
                <option value="AFTERNOON">Afternoon (12 PM - 4 PM)</option>
                <option value="EVENING">Evening (4 PM - 7 PM)</option>
              </select>
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-light)', marginTop: '24px' }}>
                <input 
                  type="checkbox" 
                  checked={chauffeurForm.includeExecutiveChauffeur} 
                  onChange={e => setChauffeurForm({ ...chauffeurForm, includeExecutiveChauffeur: e.target.checked })} 
                />
                Request Chauffeur Service
              </label>
            </div>
          </div>

          {chauffeurForm.includeExecutiveChauffeur && (
            <div style={{ animation: 'fadeIn 0.3s forwards', display: 'flex', flexDirection: 'column', gap: '15px', background: 'rgba(212,175,55,0.03)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.15)', marginBottom: '15px' }}>
              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--gold-primary)' }}>Luxury Fleet Selection</label>
                <select 
                  value={chauffeurForm.luxuryCarModel || 'MAYBACH'} 
                  onChange={e => setChauffeurForm({ ...chauffeurForm, luxuryCarModel: e.target.value })} 
                  className="form-input"
                  style={{ background: '#070f1e', borderColor: 'var(--border-gold)' }}
                >
                  <option value="MAYBACH">Mercedes-Maybach S-Class (VIP default)</option>
                  <option value="BMW7">BMW 7 Series 740Li M-Sport</option>
                  <option value="AUDIA8">Audi A8 L (Executive Edition)</option>
                  <option value="TESLAX">Tesla Model X (Private HNWI Office)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Pickup Address (Pune Corridor Only)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="Enter pickup residency/office address..."
                  value={chauffeurForm.pickupAddress}
                  onChange={e => setChauffeurForm({ ...chauffeurForm, pickupAddress: e.target.value })}
                />
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                ℹ️ Commute times: Hinjewadi/Baner pickups take approx. 20-30 mins to site locations via the prime corridor bypass highway.
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn-gold" 
            style={{ width: '100%', justifyContent: 'center', marginTop: '10px', fontSize: '0.9rem', padding: '12px' }}
            disabled={chauffeurSubmitting}
          >
            {chauffeurSubmitting ? <Loader className="animate-spin" size={20} /> : 'Book VIP Maybach Viewing'}
          </button>
        </form>
      </div>
    </div>
  );
}
