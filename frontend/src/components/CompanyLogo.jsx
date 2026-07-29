import React from 'react';

/**
 * 24K REALTORS — Official Brand Logo (Pure High-Fidelity Vector SVG)
 * Matches official emblem: Crossed Gold Keys + House Window + "24K REALTORS" + "FIND YOUR SELF AT HOME"
 */
export default function CompanyLogo({ variant = 'full', width, height, className = '' }) {
  // Premium 24K Metallic Gold Gradients
  const Gradients = () => (
    <defs>
      <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF2C6" />
        <stop offset="30%" stopColor="#F5D061" />
        <stop offset="65%" stopColor="#C8961D" />
        <stop offset="100%" stopColor="#8C650A" />
      </linearGradient>
      <linearGradient id="logoGoldLight" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFF9E6" />
        <stop offset="100%" stopColor="#D4AF37" />
      </linearGradient>
      <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#D4AF37" floodOpacity="0.3" />
      </filter>
    </defs>
  );

  // Key Vector Graphic (Single Key pointing left/up)
  const SingleKey = () => (
    <g fill="url(#logoGold)">
      {/* Bow (Key Head Oval ring with cutouts) */}
      <path d="M 0,-40 C 14,-40 22,-30 22,-20 C 22,-10 14,-2 0,-2 C -14,-2 -22,-10 -22,-20 C -22,-30 -14,-40 0,-40 Z M 0,-34 C -8,-34 -14,-28 -14,-20 C -14,-12 -8,-8 0,-8 C 8,-8 14,-12 14,-20 C 14,-28 8,-34 0,-34 Z" />
      {/* Inner Bow Details */}
      <circle cx="-5" cy="-24" r="3" />
      <circle cx="5" cy="-24" r="3" />
      <circle cx="0" cy="-15" r="3" />
      {/* Collar */}
      <rect x="-6" y="-2" width="12" height="4" rx="1" />
      {/* Shaft */}
      <rect x="-3" y="2" width="6" height="85" rx="1" />
      {/* Key Bit / Teeth */}
      <path d="M -3,50 H -14 V 60 H -3 Z M -3,66 H -12 V 74 H -3 Z M -3,78 H -14 V 83 H -3 Z" />
    </g>
  );

  // Crossed Keys Emblem Roof Canopy
  const CrossedKeysEmblem = () => (
    <g transform="translate(200, 75)" filter="url(#goldGlow)">
      {/* Left Key angled +38deg */}
      <g transform="rotate(-38) scale(0.85)">
        <SingleKey />
      </g>
      {/* Right Key angled -38deg */}
      <g transform="scale(-1, 1) rotate(-38) scale(0.85)">
        <SingleKey />
      </g>

      {/* House Silhouette & Window directly below crossover */}
      <g transform="translate(0, 32)">
        {/* Roof line */}
        <path d="M -22,8 L 0,-10 L 22,8 L 18,8 L 0,-6 L -18,8 Z" fill="url(#logoGoldLight)" />
        {/* House Box */}
        <rect x="-14" y="8" width="28" height="22" fill="#060C17" stroke="url(#logoGold)" strokeWidth="1.5" />
        {/* Arched Window (4 Panes) */}
        <path d="M -8,12 H -1 V 20 H -8 Z" fill="url(#logoGold)" />
        <path d="M 1,12 H 8 V 20 H 1 Z" fill="url(#logoGold)" />
        <path d="M -8,22 H -1 V 26 H -8 Z" fill="url(#logoGold)" />
        <path d="M 1,22 H 8 V 26 H 1 Z" fill="url(#logoGold)" />
      </g>
    </g>
  );

  if (variant === 'icon') {
    return (
      <svg viewBox="0 0 160 120" width={width || 54} height={height || 40} className={className} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
        <Gradients />
        <g transform="translate(-120, -20) scale(0.7)">
          <CrossedKeysEmblem />
        </g>
      </svg>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <svg viewBox="0 0 160 120" width={width || 44} height={height || 34} style={{ display: 'inline-block', flexShrink: 0 }}>
          <Gradients />
          <g transform="translate(-120, -20) scale(0.7)">
            <CrossedKeysEmblem />
          </g>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 900, fontSize: '1.02rem', color: '#F5D061', letterSpacing: '0.1em', lineHeight: 1, whiteSpace: 'nowrap' }}>
            24K REALTORS
          </span>
          <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: '0.46rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.18em', marginTop: '2px', whiteSpace: 'nowrap' }}>
            FIND YOUR SELF AT HOME
          </span>
        </div>
      </div>
    );
  }

  // Full Variant (Logo Icon + 24K REALTORS + FIND YOUR SELF AT HOME)
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <svg viewBox="0 0 400 230" width={width || 260} height={height || 'auto'} style={{ maxWidth: '100%', overflow: 'visible' }}>
        <Gradients />
        <CrossedKeysEmblem />

        {/* 24K REALTORS Text */}
        <text
          x="200"
          y="172"
          textAnchor="middle"
          fill="url(#logoGold)"
          style={{
            fontFamily: "'Cinzel', 'Times New Roman', serif",
            fontWeight: 900,
            fontSize: '30px',
            letterSpacing: '0.14em',
            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.8))'
          }}
        >
          24K REALTORS
        </text>

        {/* FIND YOUR SELF AT HOME Tagline Text */}
        <text
          x="200"
          y="204"
          textAnchor="middle"
          fill="url(#logoGoldLight)"
          style={{
            fontFamily: "'Cinzel', 'Montserrat', serif",
            fontWeight: 800,
            fontSize: '13.5px',
            letterSpacing: '0.26em',
            opacity: 0.95,
            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.6))'
          }}
        >
          FIND YOUR SELF AT HOME
        </text>
      </svg>
    </div>
  );
}
