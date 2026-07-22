import React, { useState, useEffect } from 'react';
import { X, MapPin, ShieldCheck, Building, Award, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Location scores by corridor ─────────────────────────────────────────────
const LOCATION_SCORES = {
  HINJEWADI:   { connectivity: 9.2, infrastructure: 8.8, appreciation: 14.2, yield: 4.4 },
  WAKAD:       { connectivity: 8.9, infrastructure: 8.5, appreciation: 14.2, yield: 4.4 },
  BANER:       { connectivity: 9.5, infrastructure: 9.2, appreciation: 16.5, yield: 4.6 },
  BALEWADI:    { connectivity: 9.3, infrastructure: 9.0, appreciation: 15.8, yield: 4.5 },
  MAHALUNGE:   { connectivity: 8.0, infrastructure: 7.5, appreciation: 18.1, yield: 5.1 },
  PUNAWALE:    { connectivity: 8.2, infrastructure: 8.0, appreciation: 13.5, yield: 4.2 },
  KHARADI:     { connectivity: 8.7, infrastructure: 8.9, appreciation: 15.2, yield: 4.8 },
  VIMAN_NAGAR: { connectivity: 9.0, infrastructure: 9.1, appreciation: 13.8, yield: 4.3 },
};

const getScores = (location) => {
  const key = (location || '').toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z_]/g, '');
  for (const [k, v] of Object.entries(LOCATION_SCORES)) {
    if (key.includes(k)) return v;
  }
  return { connectivity: 8.5, infrastructure: 8.0, appreciation: 13.0, yield: 4.2 };
};

const getBuilderName = (title = '') => {
  if (title.includes('24K') || title.includes('Opula') || title.includes('Sereno')) return 'Kolte-Patil Developers';
  if (title.includes('Godrej')) return 'Godrej Properties';
  if (title.includes('Kasturi')) return 'Kasturi Builders';
  if (title.includes('Lodha')) return 'Lodha Group';
  if (title.includes('Magarpatta')) return 'Magarpatta Corp';
  return 'Premium Developer';
};

// ─── Score bar ────────────────────────────────────────────────────────────────
function ScoreBar({ label, value, maxValue = 10, isWinner }) {
  const pct = Math.min((value / maxValue) * 100, 100);
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </span>
        <span style={{ fontSize: '0.74rem', fontWeight: 700, color: isWinner ? 'var(--gold-primary)' : 'var(--text-light)' }}>
          {typeof value === 'number' ? value.toFixed(1) : value}
          {maxValue === 10 ? '/10' : '%'}
          {isWinner && <span style={{ marginLeft: '4px' }}>★</span>}
        </span>
      </div>
      <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          style={{
            height: '100%',
            borderRadius: '4px',
            background: isWinner
              ? 'linear-gradient(90deg, var(--gold-secondary), var(--gold-primary))'
              : 'rgba(255,255,255,0.18)',
          }}
        />
      </div>
    </div>
  );
}

// ─── Spec row ─────────────────────────────────────────────────────────────────
function SpecRow({ label, values, winnerIdx, format }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `120px repeat(${values.length}, 1fr)`,
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      padding: '10px 0',
      alignItems: 'center',
      gap: '8px',
    }}>
      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
      {values.map((v, i) => (
        <span key={i} style={{
          fontSize: '0.82rem',
          fontWeight: i === winnerIdx ? 700 : 400,
          color: i === winnerIdx ? 'var(--gold-primary)' : 'var(--text-light)',
          textAlign: 'center',
        }}>
          {format ? format(v) : (v ?? '—')}
          {i === winnerIdx && <span style={{ marginLeft: '3px', fontSize: '0.65rem' }}>✓</span>}
        </span>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CompareOverlay({ isOpen, selectedForCompare, onClose, formatPrice, onOpenInquiry, onOpenBrochure }) {
  const [mobileIdx, setMobileIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Keyboard close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen || !selectedForCompare?.length) return null;

  const props = selectedForCompare;
  const scores = props.map(p => getScores(p.location));

  // winner = index of best value
  const winIdx = (arr) => {
    const max = Math.max(...arr.map(Number));
    return arr.map(Number).indexOf(max);
  };

  const priceWinner  = winIdx(props.map(p => -Number(p.price)));   // lower price = winner
  const areaWinner   = winIdx(props.map(p => p.areaSquareFeet));
  const apprecWinner = winIdx(scores.map(s => s.appreciation));
  const connWinner   = winIdx(scores.map(s => s.connectivity));
  const yieldWinner  = winIdx(scores.map(s => s.yield));

  const displayProps = isMobile ? [props[mobileIdx]] : props;
  const defaultImg = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="compare-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9900,
            background: 'rgba(4, 8, 20, 0.97)',
            backdropFilter: 'blur(24px)',
            overflowY: 'auto',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Property Comparison"
        >

          {/* ── Sticky Header ──────────────────────────────────────────── */}
          <div style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            background: 'rgba(4, 8, 20, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(212,175,55,0.12)',
            padding: '16px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-title)',
                fontSize: '1.25rem',
                color: 'var(--gold-primary)',
                margin: 0,
                letterSpacing: '0.03em',
              }}>
                Property Comparison
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {props.length} {props.length === 1 ? 'property' : 'properties'} · Pune Luxury Corridor · ★ = Best Value
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close comparison"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '50%',
                width: '40px', height: '40px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-light)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* ── Mobile swiper nav ──────────────────────────────────────── */}
          {isMobile && props.length > 1 && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px',
              padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
            }}>
              <button
                onClick={() => setMobileIdx(i => Math.max(0, i - 1))}
                disabled={mobileIdx === 0}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                  color: mobileIdx === 0 ? 'rgba(255,255,255,0.2)' : 'var(--gold-primary)' }}
              >
                <ChevronLeft size={22} />
              </button>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Property {mobileIdx + 1} of {props.length}
              </span>
              <button
                onClick={() => setMobileIdx(i => Math.min(props.length - 1, i + 1))}
                disabled={mobileIdx === props.length - 1}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                  color: mobileIdx === props.length - 1 ? 'rgba(255,255,255,0.2)' : 'var(--gold-primary)' }}
              >
                <ChevronRight size={22} />
              </button>
            </div>
          )}

          {/* ── Main Content ─────────────────────────────────────────── */}
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '20px 16px 60px' : '24px 28px 60px' }}>

            {/* Property Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : `repeat(${props.length}, 1fr)`,
              gap: '16px',
              marginBottom: '24px',
            }}>
              {displayProps.map((p, i) => {
                const actualIdx = isMobile ? mobileIdx : i;
                const sc = scores[actualIdx];
                const overallScore = ((sc.connectivity + sc.infrastructure) / 2).toFixed(1);

                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: actualIdx * 0.06 }}
                    style={{
                      background: 'rgba(10, 18, 36, 0.7)',
                      border: '1px solid rgba(212,175,55,0.14)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Image */}
                    <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                      <img
                        src={p.imageUrl || defaultImg}
                        alt={p.title}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 40%, rgba(4,8,20,0.92) 100%)',
                      }} />
                      {/* Type badge */}
                      <span style={{
                        position: 'absolute', top: '12px', left: '12px',
                        background: 'var(--gold-primary)', color: '#070F1E',
                        fontSize: '0.62rem', fontWeight: 800, padding: '3px 8px',
                        borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px',
                      }}>
                        {p.transactionType}
                      </span>
                      {/* Score bubble */}
                      <div style={{
                        position: 'absolute', top: '10px', right: '10px',
                        background: 'rgba(4,8,20,0.88)', border: '1px solid rgba(212,175,55,0.3)',
                        borderRadius: '8px', padding: '4px 10px', textAlign: 'center',
                      }}>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--gold-primary)', lineHeight: 1 }}>
                          {overallScore}
                        </div>
                        <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          Score
                        </div>
                      </div>
                      {/* Price */}
                      <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gold-primary)', textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
                          {formatPrice(p.price, p.transactionType)}
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                        <MapPin size={10} color="var(--gold-primary)" />
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.location}</span>
                      </div>
                      <h3 style={{
                        fontFamily: 'var(--font-title)',
                        fontSize: '0.92rem',
                        color: '#fff',
                        margin: '0 0 6px',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {p.title}
                      </h3>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
                        <Building size={10} />
                        <span>{getBuilderName(p.title)}</span>
                        <ShieldCheck size={10} color="var(--gold-secondary)" />
                        <span style={{ color: 'var(--gold-secondary)' }}>RERA Approved</span>
                      </div>

                      {/* Score bars */}
                      <ScoreBar label="Connectivity"   value={sc.connectivity}   maxValue={10}  isWinner={actualIdx === connWinner} />
                      <ScoreBar label="Infrastructure" value={sc.infrastructure} maxValue={10}  isWinner={actualIdx === connWinner} />
                      <ScoreBar label="Appreciation"   value={sc.appreciation}   maxValue={25}  isWinner={actualIdx === apprecWinner} />
                      <ScoreBar label="Rental Yield"   value={sc.yield}          maxValue={8}   isWinner={actualIdx === yieldWinner} />

                      {/* CTA Buttons */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => { onClose(); onOpenInquiry(p); }}
                          style={{
                            width: '100%',
                            padding: '11px',
                            background: 'linear-gradient(135deg, var(--gold-primary), var(--gold-secondary))',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#070F1E',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            fontFamily: 'var(--font-sans)',
                            letterSpacing: '0.03em',
                          }}
                        >
                          Request Presentation <ArrowRight size={13} />
                        </motion.button>

                        <button
                          type="button"
                          onClick={() => { onOpenBrochure && onOpenBrochure(p); }}
                          style={{
                            width: '100%',
                            padding: '8px',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(197,168,128,0.3)',
                            borderRadius: '8px',
                            color: 'var(--gold-primary)',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            fontFamily: 'var(--font-sans)',
                          }}
                        >
                          📄 1-Page PDF Brochure
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ── Spec Matrix Table (desktop only) ──────────────────── */}
            {!isMobile && props.length >= 2 && (
              <div style={{
                background: 'rgba(10, 18, 36, 0.55)',
                border: '1px solid rgba(212,175,55,0.08)',
                borderRadius: '16px',
                padding: '24px',
              }}>
                <h4 style={{
                  fontFamily: 'var(--font-title)',
                  color: 'var(--gold-secondary)',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  margin: '0 0 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <Award size={14} />
                  Specification Matrix — ✓ marks best value per row
                </h4>

                <SpecRow label="Price"        values={props.map(p => p.price)}            winnerIdx={priceWinner}  format={v => formatPrice(v)} />
                <SpecRow label="Carpet Area"  values={props.map(p => p.areaSquareFeet)}   winnerIdx={areaWinner}   format={v => `${Number(v).toLocaleString()} sqft`} />
                <SpecRow label="Bedrooms"     values={props.map(p => p.bedrooms)}          winnerIdx={winIdx(props.map(p => p.bedrooms))}   format={v => v > 0 ? `${v} BHK` : 'N/A'} />
                <SpecRow label="Bathrooms"    values={props.map(p => p.bathrooms)}         winnerIdx={winIdx(props.map(p => p.bathrooms))}  format={v => `${v} Bath`} />
                <SpecRow label="Appreciation" values={scores.map(s => s.appreciation)}     winnerIdx={apprecWinner} format={v => `${v}% p.a.`} />
                <SpecRow label="Rental Yield" values={scores.map(s => s.yield)}            winnerIdx={yieldWinner}  format={v => `${v}%`} />
                <SpecRow label="Status"       values={props.map(p => p.status || 'AVAILABLE')} winnerIdx={-1} />
                <SpecRow label="Developer"    values={props.map(p => getBuilderName(p.title))} winnerIdx={-1} />
                <SpecRow label="RERA"         values={props.map(p => p.reraNumber || 'Approved')} winnerIdx={-1} />

                {/* Overall winner banner */}
                {(() => {
                  const winCounts = props.map((_, idx) =>
                    [priceWinner, areaWinner, apprecWinner, connWinner, yieldWinner].filter(w => w === idx).length
                  );
                  const overall = winIdx(winCounts);
                  if (winCounts[overall] === 0) return null;
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      style={{
                        marginTop: '24px',
                        padding: '16px 20px',
                        background: 'linear-gradient(135deg, rgba(212,175,55,0.09), rgba(212,175,55,0.02))',
                        border: '1px solid rgba(212,175,55,0.22)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                      }}
                    >
                      <Award size={22} color="var(--gold-primary)" />
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          Best Overall Value
                        </div>
                        <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.05rem', color: 'var(--gold-primary)', fontWeight: 700, marginTop: '3px' }}>
                          {props[overall]?.title}
                          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '10px' }}>
                            wins {winCounts[overall]} of 5 key metrics
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
