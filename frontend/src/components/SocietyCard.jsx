import React from 'react';
import { MapPin, ShieldCheck, CheckCircle2, Calendar, Building2, ArrowUpRight, Sparkles, Layers, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Format dynamic price in Indian Crores/Lakhs format
 */
const formatInrPrice = (val) => {
  if (!val) return 'Price on Request';
  if (typeof val === 'string') {
    const crMatch = val.match(/0\.(\d+)\s*Cr/i);
    if (crMatch) {
      const numCr = parseFloat(`0.${crMatch[1]}`);
      const lakhs = Math.round(numCr * 100);
      return val.replace(/0\.\d+\s*Cr/i, `${lakhs} Lakhs`);
    }
    if (val.includes('₹') || val.includes('Cr') || val.includes('Lakh')) return val;
  }
  const num = Number(String(val).replace(/[^0-9.]/g, ''));
  if (isNaN(num) || num <= 0) return val;
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr*`;
  if (num >= 100000) return `₹${Math.round(num / 100000)} Lakhs*`;
  return `₹${num.toLocaleString('en-IN')}`;
};

/**
 * Format Phase Name
 */
const formatPhase = (phase) => {
  if (!phase) return 'Hinjewadi';
  switch (phase) {
    case 'PHASE_1': return 'Phase 1';
    case 'PHASE_2': return 'Phase 2';
    case 'PHASE_3': return 'Phase 3';
    case 'MAHALUNGE': return 'Mahalunge';
    default: return phase.replace(/_/g, ' ');
  }
};

/**
 * Format Project Status Label & Color
 */
const formatStatus = (status) => {
  switch (status) {
    case 'READY_TO_MOVE':
      return { label: 'Ready to Move', color: 'rgba(56, 176, 0, 0.15)', text: '#38B000', border: 'rgba(56, 176, 0, 0.4)' };
    case 'UNDER_CONSTRUCTION':
      return { label: 'Under Construction', color: 'rgba(255, 190, 11, 0.15)', text: '#FFBE0B', border: 'rgba(255, 190, 11, 0.4)' };
    case 'NEW_LAUNCH':
      return { label: 'New Launch', color: 'rgba(58, 134, 255, 0.15)', text: '#3A86FF', border: 'rgba(58, 134, 255, 0.4)' };
    case 'UPCOMING':
      return { label: 'Upcoming Pre-Launch', color: 'rgba(131, 56, 236, 0.15)', text: '#A370F7', border: 'rgba(131, 56, 236, 0.4)' };
    default:
      return { label: status ? status.replace(/_/g, ' ') : 'Verified Project', color: 'rgba(212, 175, 55, 0.15)', text: '#D4AF37', border: 'rgba(212, 175, 55, 0.4)' };
  }
};

export default function SocietyCard({ society, onSelect, parentTownship }) {
  if (!society) return null;

  const statusInfo = formatStatus(society.projectStatus);
  const heroImage = society.heroImageUrl || (society.galleryUrls ? society.galleryUrls.split(',')[0] : '/dev_kolte_patil_township.png');
  const phaseLabel = formatPhase(society.hinjewadiPhase);
  const priceDisplay = society.priceRange || formatInrPrice(society.startingPrice);

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #131F33 0%, #0A111E 100%)',
        border: '1px solid rgba(212,175,55,0.22)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        boxSizing: 'border-box'
      }}
      onClick={() => onSelect && onSelect(society.slug || society.id)}
    >
      {/* ── Top Image Frame with Gradient Overlay ───────────────────────── */}
      <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden', background: '#070E1A' }}>
        <img
          src={heroImage}
          alt={society.canonicalName || society.name}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: (heroImage.includes('eon') || heroImage.includes('kasturi')) ? 'center 22%' : 'center' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/dev_kolte_patil_township.png';
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, #0A111E 0%, transparent 65%)' }} />

        {/* Top Badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', pointerEvents: 'none' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(9,17,31,0.85)', backdropFilter: 'blur(6px)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.35)' }}>
            <MapPin size={11} color="#D4AF37" />
            <span>{phaseLabel}</span>
          </span>

          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 700, background: statusInfo.color, color: statusInfo.text, border: `1px solid ${statusInfo.border}`, backdropFilter: 'blur(6px)' }}>
            <span>{statusInfo.label}</span>
          </span>
        </div>

        {/* Bottom MahaRERA Badge */}
        {society.reraNumber && (
          <div style={{ position: 'absolute', bottom: '12px', left: '12px', display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 8px', borderRadius: '6px', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', border: '1px solid rgba(212,175,55,0.35)' }}>
            <ShieldCheck size={13} color="#D4AF37" />
            <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', fontWeight: 700, color: '#FFF' }}>
              {society.reraNumber}
            </span>
          </div>
        )}
      </div>

      {/* ── Card Body ─────────────────────────────────────────────────── */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between', gap: '14px' }}>
        
        <div>
          {/* Township parent badge (shown from TownshipExplorer) */}
          {parentTownship && (
            <div className="pi-township-badge">
              <Building2 size={9} />
              {parentTownship}
            </div>
          )}

          {/* Developer Legacy */}
          <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#D4AF37', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Building2 size={12} color="#D4AF37" />
            <span>{society.developer || 'Pride Purple Group'}</span>
          </div>

          {/* Project Title */}
          <h3 style={{ fontSize: '1.15rem', fontFamily: "'Cinzel', serif", fontWeight: 700, color: '#FFF', margin: '0 0 6px 0', lineHeight: 1.25 }}>
            {society.canonicalName || society.name}
          </h3>

          {/* Configuration Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
            {society.configurationSummary ? (
              society.configurationSummary.split(',').map((bhk, i) => (
                <span key={i} style={{ fontSize: '0.72rem', color: '#CBD5E1', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                  {bhk.trim()}
                </span>
              ))
            ) : (
              <>
                <span style={{ fontSize: '0.72rem', color: '#CBD5E1', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '6px' }}>2 BHK</span>
                <span style={{ fontSize: '0.72rem', color: '#CBD5E1', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '6px' }}>3 BHK</span>
              </>
            )}
            {society.possessionDate && (
              <span style={{ fontSize: '0.72rem', color: '#A0AEC0', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '6px' }}>
                Poss: {society.possessionDate}
              </span>
            )}
          </div>
        </div>

        {/* ── Price and CTA Row ───────────────────────────────────────── */}
        <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#A0AEC0', fontWeight: 600 }}>
              Starting Spectrum
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#D4AF37', marginTop: '2px' }}>
              {priceDisplay}
            </div>
            <div style={{ fontSize: '0.62rem', color: '#A0AEC0', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
              <Clock size={10} color="#D4AF37" />
              <span>Verified: {society.priceLastVerified || '25 Aug 2026'}</span>
            </div>
          </div>

          <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '8px 14px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #D4AF37 0%, #B38F24 100%)',
              color: '#09111F',
              fontWeight: 800,
              fontSize: '0.75rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(212,175,55,0.35)',
              flexShrink: 0
            }}
          >
            <span>Intelligence</span>
            <ArrowUpRight size={13} />
          </button>
        </div>

      </div>
    </motion.div>
  );
}
