import React from 'react';

export default function CompareOverlay({ isOpen, selectedForCompare, onClose, formatPrice, onOpenInquiry }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '850px' }}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h3 className="modal-title">Property Comparison</h3>
        <p className="modal-subtitle">Side-by-side comparison of selected luxury Pune tech corridor deals.</p>
        
        <div className="compare-grid">
          {selectedForCompare.map(p => (
            <div key={p.id} className="compare-column">
              <div className="compare-img" style={{ backgroundImage: `url('${p.imageUrl || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80"}')` }} />
              <h4 style={{ color: 'var(--gold-primary)', margin: '12px 0 6px 0', fontSize: '1.1rem' }}>{p.title}</h4>
              <div className="compare-field"><strong>Location:</strong> {p.location}</div>
              <div className="compare-field"><strong>Price:</strong> {formatPrice(p.price, p.transactionType)}</div>
              <div className="compare-field"><strong>Size:</strong> {p.areaSquareFeet} sqft</div>
              <div className="compare-field"><strong>Rooms:</strong> {p.bedrooms > 0 ? `${p.bedrooms} BHK` : 'N/A'}</div>
              <div className="compare-field"><strong>Baths:</strong> {p.bathrooms}</div>
              <div className="compare-field"><strong>RERA ID:</strong> {p.reraNumber || 'Pending'}</div>
              <button onClick={() => { onClose(); onOpenInquiry(p); }} className="btn-gold" style={{ marginTop: '15px', width: '100%', justifyContent: 'center' }}>
                Request Presentation
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
