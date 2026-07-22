import React from 'react';
import { X, Printer, Share2, ShieldCheck, MapPin, CheckCircle, Phone, Award, Sparkles, QrCode } from 'lucide-react';
import CompanyLogo from './CompanyLogo';

export default function PdfBrochureModal({ property, onClose, formatPrice, onOpenInquiry }) {
  if (!property) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🏡 *24K REALTORS — LUXURY PROPERTY BROCHURE*\n\n` +
      `📌 *${property.title}*\n` +
      `📍 Location: ${property.location} (${property.address || 'Pune'})\n` +
      `💰 Price: ${formatPrice ? formatPrice(property.price) : '₹' + property.price}\n` +
      `📐 Area: ${property.areaSquareFeet} sq.ft (${property.bedrooms || '2'} BHK)\n` +
      `📜 RERA No: ${property.reraNumber || 'MahaRERA Registered'}\n\n` +
      `🔗 View details on our portal or contact us for a VIP Site Visit!\n` +
      `📞 Hotline: +91 96730 00053`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const pricePerSqft = property.areaSquareFeet ? Math.round(property.price / property.areaSquareFeet) : 0;

  return (
    <div
      className="pdf-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(4, 8, 20, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Printable Sheet Container */}
      <div
        className="printable-brochure-sheet"
        style={{
          width: '100%',
          maxWidth: '820px',
          background: '#070F1E',
          border: '1px solid rgba(197, 168, 128, 0.3)',
          borderRadius: '20px',
          boxShadow: '0 32px 90px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,175,55,0.1)',
          color: '#fff',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Action Bar (Hidden when printing) */}
        <div
          className="no-print"
          style={{
            background: 'rgba(10, 20, 38, 0.9)',
            borderBottom: '1px solid rgba(197, 168, 128, 0.15)',
            padding: '14px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="#E6C35C" />
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.8rem', fontWeight: 700, color: '#E6C35C', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Instant One-Pager Luxury Brochure
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handlePrint}
              style={{
                background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)',
                border: 'none',
                color: '#040814',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              <Printer size={14} /> Print / Save as PDF
            </button>

            <button
              onClick={handleShareWhatsApp}
              style={{
                background: '#25D366',
                border: 'none',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              <Share2 size={14} /> Share WhatsApp
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Brochure Printable Content Area */}
        <div style={{ padding: '36px 40px' }} className="brochure-print-body">
          {/* Header Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(197, 168, 128, 0.2)', paddingBottom: '20px', marginBottom: '24px' }}>
            <div>
              <CompanyLogo variant="compact" />
              <div style={{ fontSize: '0.68rem', color: 'rgba(197,168,128,0.7)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '6px', fontWeight: 600 }}>
                Pune West Premium Real Estate Advisory
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(197,168,128,0.1)', border: '1px solid rgba(197,168,128,0.25)', borderRadius: '6px', padding: '4px 10px', fontSize: '0.68rem', color: '#E6C35C', fontWeight: 700 }}>
                <ShieldCheck size={12} /> {property.reraNumber || 'MahaRERA Registered'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                Ref ID: 24K-{property.id || 'LISTING'}
              </div>
            </div>
          </div>

          {/* Hero Media + Title Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '24px', alignItems: 'stretch' }}>
            <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(197, 168, 128, 0.2)', minHeight: '220px' }}>
              <img
                src={property.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
                alt={property.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(4, 8, 20, 0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(197,168,128,0.3)', borderRadius: '8px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#fff', fontWeight: 600 }}>
                <MapPin size={13} color="#E6C35C" /> {property.location} Corridor
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(197,168,128,0.03)', border: '1px solid rgba(197,168,128,0.12)', borderRadius: '14px', padding: '20px' }}>
              <div>
                <span style={{ fontSize: '0.65rem', background: 'rgba(197,168,128,0.12)', color: '#E6C35C', padding: '3px 8px', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {property.propertyType || 'RESIDENTIAL'} • FOR {property.transactionType || 'BUY'}
                </span>
                <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', color: '#fff', margin: '10px 0 8px 0', lineHeight: 1.3 }}>
                  {property.title}
                </h2>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.4 }}>
                  {property.address || `${property.location}, Pune West Corridor`}
                </p>
              </div>

              <div style={{ borderTop: '1px dashed rgba(197,168,128,0.2)', paddingTop: '14px', marginTop: '14px' }}>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Valuation / Pricing</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#C5A880', fontFamily: "'Cinzel', serif" }}>
                  {formatPrice ? formatPrice(property.price) : '₹' + property.price}
                  {property.transactionType === 'RENT' && <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>/mo</span>}
                </div>
                {pricePerSqft > 0 && (
                  <div style={{ fontSize: '0.72rem', color: '#E6C35C', marginTop: '2px', fontWeight: 600 }}>
                    ₹{pricePerSqft.toLocaleString('en-IN')}/sq.ft
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Key Specifications Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Bedrooms', val: `${property.bedrooms || 2} BHK` },
              { label: 'Carpet Area', val: `${property.areaSquareFeet || 1000} sq.ft` },
              { label: 'Furnishing', val: (property.furnishingStatus || 'SEMI_FURNISHED').replace(/_/g, ' ') },
              { label: 'Piped Gas', val: property.gasPipeline ? 'Available ✓' : 'N/A' },
            ].map((spec, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{spec.label}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{spec.val}</div>
              </div>
            ))}
          </div>

          {/* Description & Overview */}
          <div style={{ background: 'rgba(197,168,128,0.02)', border: '1px solid rgba(197,168,128,0.1)', borderRadius: '12px', padding: '18px', marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontFamily: "'Cinzel', serif", fontSize: '0.85rem', color: '#C5A880', letterSpacing: '0.05em' }}>
              📋 Executive Summary & Highlights
            </h4>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
              {property.description || 'Premium residential property with modular kitchen, continuous power backup, and strategic proximity to prime IT corridors, top international schools, and retail high streets.'}
            </p>
          </div>

          {/* Key Amenities */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontFamily: "'Cinzel', serif", fontSize: '0.85rem', color: '#C5A880', letterSpacing: '0.05em' }}>
              ✦ Key Amenities & Features
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {(property.specificAmenities || [
                '100% Power Backup',
                '24/7 Security & CCTV',
                'Clubhouse & Gymnasium',
                'Modular Kitchen Setup',
                'Covered Reserved Parking',
                'High-Speed Elevators'
              ]).slice(0, 6).map((amenity, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <CheckCircle size={12} color="#E6C35C" /> {amenity}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Contact & Advisory Verification */}
          <div style={{ borderTop: '1px solid rgba(197,168,128,0.2)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>24K REALTORS ADVISORY DESK</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                📞 Hotline: +91 96730 00053 | ✉️ advisory@24krealtors.com
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(197,168,128,0.6)', marginTop: '4px' }}>
                MahaRERA Agent Registration: A52100024K99 • Pune West Operations
              </div>
            </div>

            <button
              className="no-print"
              onClick={() => {
                onClose();
                onOpenInquiry && onOpenInquiry(property);
              }}
              style={{
                background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)',
                border: 'none',
                color: '#040814',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              Book Site Visit
            </button>
          </div>
        </div>
      </div>

      {/* Print Stylesheet */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .printable-brochure-sheet, .printable-brochure-sheet * { visibility: visible !important; }
          .printable-brochure-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            background: #fff !important;
            color: #000 !important;
          }
          .brochure-print-body { padding: 20px !important; color: #000 !important; }
          .brochure-print-body h2, .brochure-print-body h4 { color: #000 !important; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
