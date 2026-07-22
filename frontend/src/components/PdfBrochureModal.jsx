import React from 'react';
import { X, Printer, Share2, ShieldCheck, MapPin, CheckCircle, Sparkles, Download } from 'lucide-react';
import CompanyLogo from './CompanyLogo';

export default function PdfBrochureModal({ property, onClose, formatPrice, onOpenInquiry }) {
  if (!property) return null;

  const handlePrint = () => {
    window.print();
  };

  // Real PDF file download using jsPDF — no print dialog, direct .pdf file saved
  const handleDownloadPdf = () => {
    import('jspdf').then(({ jsPDF }) => {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 15;
      let y = margin;

      // Dark navy background
      doc.setFillColor(7, 15, 30);
      doc.rect(0, 0, pageW, pageH, 'F');

      // Gold top strip
      doc.setFillColor(197, 168, 128);
      doc.rect(0, 0, pageW, 2, 'F');

      // ── Header ──────────────────────────────────────────────
      y += 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(230, 195, 92);
      doc.text('24K REALTORS', margin, y + 8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(197, 168, 128);
      doc.text('PUNE WEST LUXURY REAL ESTATE ADVISORY', margin, y + 14);

      // RERA (top-right)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(230, 195, 92);
      doc.text(`MahaRERA: ${property.reraNumber || 'P52100028461'}`, pageW - margin, y + 8, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      const shortId = (property.id || 'LISTING').toString().substring(0, 8).toUpperCase();
      doc.text(`Ref: 24K-${shortId}`, pageW - margin, y + 14, { align: 'right' });

      // Divider
      y += 22;
      doc.setDrawColor(197, 168, 128);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageW - margin, y);
      y += 8;

      // ── Property Type Badge ──────────────────────────────────
      doc.setFillColor(30, 45, 70);
      doc.setDrawColor(197, 168, 128);
      doc.setLineWidth(0.2);
      doc.roundedRect(margin, y, 70, 7, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(230, 195, 92);
      doc.text(
        `${property.propertyType || 'RESIDENTIAL'}  •  FOR ${property.transactionType || 'SALE'}`,
        margin + 3, y + 4.8
      );

      // ── Property Title ───────────────────────────────────────
      y += 11;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(17);
      doc.setTextColor(255, 255, 255);
      const titleLines = doc.splitTextToSize(property.title || 'Luxury Property', pageW - margin * 2);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 7;

      // Address
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(160, 160, 160);
      doc.text(
        `${property.location} Corridor  —  ${property.address || 'Pune West'}`,
        margin, y + 1
      );
      y += 8;

      // ── Price ────────────────────────────────────────────────
      const priceStr = formatPrice
        ? formatPrice(property.price)
        : `Rs. ${(property.price || 0).toLocaleString('en-IN')}`;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(197, 168, 128);
      doc.text(priceStr, margin, y + 9);

      const ppsf = property.areaSquareFeet
        ? Math.round(property.price / property.areaSquareFeet)
        : 0;
      if (ppsf > 0) {
        doc.setFontSize(8);
        doc.setTextColor(230, 195, 92);
        doc.text(`Rs. ${ppsf.toLocaleString('en-IN')} / sq.ft`, margin, y + 16);
      }
      y += 23;

      // ── Spec Grid (4 boxes) ──────────────────────────────────
      const specs = [
        { label: 'BEDROOMS', val: `${property.bedrooms || 2} BHK` },
        { label: 'CARPET AREA', val: `${property.areaSquareFeet || 1000} sq.ft` },
        { label: 'FURNISHING', val: (property.furnishingStatus || 'SEMI FURNISHED').replace(/_/g, ' ') },
        { label: 'PIPED GAS', val: property.gasPipeline ? 'Available' : 'N/A' },
      ];
      const boxW = (pageW - margin * 2 - 9) / 4;
      specs.forEach((spec, i) => {
        const bx = margin + i * (boxW + 3);
        doc.setFillColor(20, 30, 50);
        doc.setDrawColor(55, 65, 90);
        doc.setLineWidth(0.2);
        doc.roundedRect(bx, y, boxW, 17, 2, 2, 'FD');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6.5);
        doc.setTextColor(110, 115, 140);
        doc.text(spec.label, bx + boxW / 2, y + 5.5, { align: 'center' });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(240, 240, 240);
        doc.text(spec.val, bx + boxW / 2, y + 13, { align: 'center' });
      });
      y += 24;

      // ── Executive Summary ────────────────────────────────────
      doc.setFillColor(15, 25, 45);
      doc.setDrawColor(197, 168, 128);
      doc.setLineWidth(0.2);
      doc.roundedRect(margin, y, pageW - margin * 2, 36, 3, 3, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(197, 168, 128);
      doc.text('EXECUTIVE SUMMARY', margin + 5, y + 7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(200, 200, 200);
      const desc = property.description ||
        'Premium residential property with modular kitchen, continuous power backup, and strategic proximity to prime IT corridors and international schools.';
      const descLines = doc.splitTextToSize(desc, pageW - margin * 2 - 12);
      doc.text(descLines.slice(0, 4), margin + 5, y + 14);
      y += 43;

      // ── Amenities ────────────────────────────────────────────
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(197, 168, 128);
      doc.text('KEY AMENITIES & FEATURES', margin, y);
      y += 5;

      const amenities = [
        '100% Power Backup',
        '24/7 Security & CCTV',
        'Clubhouse & Gym',
        'Modular Kitchen',
        'Reserved Parking',
        'High-Speed Lifts',
      ];
      const aBoxW = (pageW - margin * 2 - 10) / 3;
      amenities.forEach((a, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const ax = margin + col * (aBoxW + 5);
        const ay = y + row * 10;
        doc.setFillColor(18, 28, 48);
        doc.setDrawColor(38, 50, 75);
        doc.setLineWidth(0.2);
        doc.roundedRect(ax, ay, aBoxW, 8, 1.5, 1.5, 'FD');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(195, 195, 195);
        doc.text(`• ${a}`, ax + 3, ay + 5.2);
      });
      y += 26;

      // ── Footer ───────────────────────────────────────────────
      doc.setDrawColor(197, 168, 128);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageW - margin, y);
      y += 7;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text('24K REALTORS ADVISORY DESK', margin, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(140, 140, 140);
      doc.text('Hotline: +91 96730 00053  |  Email: advisory@24krealtors.com', margin, y + 6);
      doc.text('MahaRERA Agent Reg: A52100028461  •  Hinjewadi, Wakad & Baner Corridors', margin, y + 11);

      // Gold bottom strip
      doc.setFillColor(197, 168, 128);
      doc.rect(0, pageH - 2, pageW, 2, 'F');

      // ── Save .pdf directly ───────────────────────────────────
      const safeName = (property.title || 'Property')
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 50);
      doc.save(`24K_Realtors_Brochure_${safeName}.pdf`);
    }).catch(() => {
      // Fallback to print if jsPDF fails to load
      window.print();
    });
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🏡 *24K REALTORS — LUXURY PROPERTY BROCHURE*\n\n` +
      `📌 *${property.title}*\n` +
      `📍 Location: ${property.location} (${property.address || 'Pune'})\n` +
      `💰 Price: ${formatPrice ? formatPrice(property.price) : '₹' + property.price}\n` +
      `📐 Area: ${property.areaSquareFeet} sq.ft (${property.bedrooms || '2'} BHK)\n` +
      `📜 RERA No: ${property.reraNumber || 'MahaRERA Registered'}\n\n` +
      `🔗 Contact us for a VIP Site Visit!\n` +
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
        {/* ── Action Bar ── */}
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
              One-Pager Luxury Brochure
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* PRIMARY: Download PDF */}
            <button
              onClick={handleDownloadPdf}
              style={{
                background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)',
                border: 'none',
                color: '#040814',
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                fontFamily: "'Montserrat', sans-serif",
                boxShadow: '0 4px 14px rgba(197,168,128,0.35)'
              }}
            >
              <Download size={15} /> Download PDF
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(197, 168, 128, 0.3)',
                color: '#E6C35C',
                padding: '9px 14px',
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
              <Printer size={14} /> Print
            </button>

            {/* WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              style={{
                background: '#25D366',
                border: 'none',
                color: '#fff',
                padding: '9px 14px',
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
              <Share2 size={14} /> WhatsApp
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Brochure Preview Body ── */}
        <div style={{ padding: '36px 40px' }} className="brochure-print-body">
          {/* Header */}
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

          {/* Hero grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '24px' }}>
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
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Valuation</div>
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

          {/* Specs */}
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

          {/* Description */}
          <div style={{ background: 'rgba(197,168,128,0.02)', border: '1px solid rgba(197,168,128,0.1)', borderRadius: '12px', padding: '18px', marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontFamily: "'Cinzel', serif", fontSize: '0.85rem', color: '#C5A880', letterSpacing: '0.05em' }}>
              📋 Executive Summary
            </h4>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
              {property.description || 'Premium residential property with modular kitchen, continuous power backup, and strategic proximity to prime IT corridors, top international schools, and retail high streets.'}
            </p>
          </div>

          {/* Amenities */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontFamily: "'Cinzel', serif", fontSize: '0.85rem', color: '#C5A880', letterSpacing: '0.05em' }}>
              ✦ Key Amenities
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {['100% Power Backup', '24/7 Security & CCTV', 'Clubhouse & Gymnasium', 'Modular Kitchen Setup', 'Covered Reserved Parking', 'High-Speed Elevators'].map((amenity, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <CheckCircle size={12} color="#E6C35C" /> {amenity}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ borderTop: '1px solid rgba(197,168,128,0.2)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>24K REALTORS ADVISORY DESK</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                📞 +91 96730 00053 | ✉️ advisory@24krealtors.com
              </div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(197,168,128,0.6)', marginTop: '4px' }}>
                MahaRERA Agent Reg: A52100028461 • Pune West
              </div>
            </div>

            <button
              className="no-print"
              onClick={() => { onClose(); onOpenInquiry && onOpenInquiry(property); }}
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

      {/* Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .printable-brochure-sheet, .printable-brochure-sheet * { visibility: visible !important; }
          .printable-brochure-sheet {
            position: absolute !important;
            left: 0 !important; top: 0 !important;
            width: 100% !important; max-width: 100% !important;
            box-shadow: none !important; border: none !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
