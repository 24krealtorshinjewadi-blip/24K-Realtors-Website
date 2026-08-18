import React, { useState } from 'react';

/**
 * 24K REALTORS PUNE — Official Luxury Brand Logo Component
 * 
 * High-definition, 100% vector SVG rendering with 24K Metallic Gold Gradients.
 * Zero background artifacts, zero fake checkerboards.
 * Supports 'compact' (navbars), 'full' (login/splash/footers), and 'icon' (mobile/badges).
 */
export default function CompanyLogo({
  variant = 'compact', // 'compact' | 'full' | 'icon'
  width,
  height,
  className = '',
  style = {},
  showSubtitle = true,
  onClick
}) {
  const [useFallback, setUseFallback] = useState(false);

  // Sizing configurations
  const isCompact = variant === 'compact';
  const isIcon = variant === 'icon';
  const isFull = variant === 'full';

  // Responsive default dimensions
  const defaultWidth = isIcon ? 44 : isCompact ? 175 : 240;
  const defaultHeight = isIcon ? 44 : isCompact ? 42 : 68;

  const targetWidth = width || defaultWidth;
  const targetHeight = height || defaultHeight;

  // ── 1. STANDALONE LUXURY EMBLEM (ICON VARIANT) ──
  if (isIcon) {
    return (
      <div
        className={`company-logo-icon ${className}`}
        onClick={onClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 0,
          cursor: onClick ? 'pointer' : 'default',
          transition: 'transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
          ...style
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width={targetWidth}
          height={targetHeight}
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="iconGoldKey" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFF3B0" />
              <stop offset="30%" stop-color="#E5C158" />
              <stop offset="60%" stop-color="#D4AF37" />
              <stop offset="100%" stop-color="#80590E" />
            </linearGradient>
            <filter id="iconGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#D4AF37" flood-opacity="0.5" />
            </filter>
          </defs>

          <g transform="translate(50, 50) scale(0.62)" filter="url(#iconGlow)">
            {/* Concentric Gold Rings */}
            <circle cx="0" cy="0" r="66" fill="none" stroke="url(#iconGoldKey)" stroke-width="1.8" stroke-dasharray="4 3" opacity="0.6" />
            <circle cx="0" cy="0" r="58" fill="none" stroke="#D4AF37" stroke-width="1.2" opacity="0.8" />

            {/* Key 1 (-45 deg) */}
            <g transform="rotate(-45)">
              <circle cx="0" cy="-44" r="16" fill="none" stroke="url(#iconGoldKey)" stroke-width="4.5" />
              <circle cx="0" cy="-44" r="9" fill="none" stroke="url(#iconGoldKey)" stroke-width="2.5" />
              <circle cx="-13" cy="-44" r="6" fill="none" stroke="url(#iconGoldKey)" stroke-width="2" />
              <circle cx="13" cy="-44" r="6" fill="none" stroke="url(#iconGoldKey)" stroke-width="2" />
              <circle cx="0" cy="-57" r="5" fill="none" stroke="url(#iconGoldKey)" stroke-width="2" />
              <circle cx="0" cy="-31" r="5" fill="none" stroke="url(#iconGoldKey)" stroke-width="2" />
              <circle cx="0" cy="-44" r="3" fill="url(#iconGoldKey)" />
              <rect x="-6" y="-27" width="12" height="4" rx="2" fill="url(#iconGoldKey)" />
              <rect x="-4.5" y="-22" width="9" height="3" rx="1.5" fill="url(#iconGoldKey)" />
              <rect x="-3" y="-20" width="6" height="66" rx="2" fill="url(#iconGoldKey)" />
              <line x1="0" y1="-18" x2="0" y2="44" stroke="#FFF7D6" stroke-width="1" opacity="0.8" />
              <path d="M 3 24 L 18 24 L 18 30 L 11 30 L 11 35 L 17 35 L 17 41 L 11 41 L 11 46 L 19 46 L 19 52 L 3 52 Z" fill="url(#iconGoldKey)" />
              <circle cx="0" cy="46" r="3.5" fill="url(#iconGoldKey)" />
            </g>

            {/* Key 2 (+45 deg) */}
            <g transform="rotate(45)">
              <circle cx="0" cy="-44" r="16" fill="none" stroke="url(#iconGoldKey)" stroke-width="4.5" />
              <circle cx="0" cy="-44" r="9" fill="none" stroke="url(#iconGoldKey)" stroke-width="2.5" />
              <circle cx="-13" cy="-44" r="6" fill="none" stroke="url(#iconGoldKey)" stroke-width="2" />
              <circle cx="13" cy="-44" r="6" fill="none" stroke="url(#iconGoldKey)" stroke-width="2" />
              <circle cx="0" cy="-57" r="5" fill="none" stroke="url(#iconGoldKey)" stroke-width="2" />
              <circle cx="0" cy="-31" r="5" fill="none" stroke="url(#iconGoldKey)" stroke-width="2" />
              <circle cx="0" cy="-44" r="3" fill="url(#iconGoldKey)" />
              <rect x="-6" y="-27" width="12" height="4" rx="2" fill="url(#iconGoldKey)" />
              <rect x="-4.5" y="-22" width="9" height="3" rx="1.5" fill="url(#iconGoldKey)" />
              <rect x="-3" y="-20" width="6" height="66" rx="2" fill="url(#iconGoldKey)" />
              <line x1="0" y1="-18" x2="0" y2="44" stroke="#FFF7D6" stroke-width="1" opacity="0.8" />
              <path d="M -3 24 L -18 24 L -18 30 L -11 30 L -11 35 L -17 35 L -17 41 L -11 41 L -11 46 L -19 46 L -19 52 L -3 52 Z" fill="url(#iconGoldKey)" />
              <circle cx="0" cy="46" r="3.5" fill="url(#iconGoldKey)" />
            </g>

            {/* Center Rosette Jewel */}
            <circle cx="0" cy="0" r="6.5" fill="url(#iconGoldKey)" stroke="#070D18" stroke-width="1.5" />
            <polygon points="0,-4 3,-1 4,3 0,5 -4,3 -3,-1" fill="#FFFFFF" />
          </g>
        </svg>
      </div>
    );
  }

  // ── 2. COMPACT & FULL LUXURY BRAND LOGO (CREST + TYPOGRAPHY) ──
  return (
    <div
      className={`company-logo-container ${className}`}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isFull ? '14px' : '10px',
        lineHeight: 1,
        cursor: onClick ? 'pointer' : 'default',
        textDecoration: 'none',
        userSelect: 'none',
        ...style
      }}
    >
      {/* 2.1 Vector Crossed Keys Crest */}
      <svg
        viewBox="0 0 100 100"
        width={isFull ? 56 : 38}
        height={isFull ? 56 : 38}
        style={{ flexShrink: 0, overflow: 'visible', filter: 'drop-shadow(0 2px 8px rgba(212,175,55,0.45))' }}
      >
        <defs>
          <linearGradient id={`goldKeyGrad_${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFF3B0" />
            <stop offset="30%" stop-color="#E5C158" />
            <stop offset="60%" stop-color="#D4AF37" />
            <stop offset="100%" stop-color="#80590E" />
          </linearGradient>
        </defs>

        <g transform="translate(50, 50) scale(0.62)">
          {/* Concentric Gold Rings */}
          <circle cx="0" cy="0" r="66" fill="none" stroke={`url(#goldKeyGrad_${variant})`} stroke-width="1.8" stroke-dasharray="4 3" opacity="0.6" />
          <circle cx="0" cy="0" r="58" fill="none" stroke="#D4AF37" stroke-width="1.2" opacity="0.8" />

          {/* Key 1 (-45 deg) */}
          <g transform="rotate(-45)">
            <circle cx="0" cy="-44" r="16" fill="none" stroke={`url(#goldKeyGrad_${variant})`} stroke-width="4.5" />
            <circle cx="0" cy="-44" r="9" fill="none" stroke={`url(#goldKeyGrad_${variant})`} stroke-width="2.5" />
            <circle cx="-13" cy="-44" r="6" fill="none" stroke={`url(#goldKeyGrad_${variant})`} stroke-width="2" />
            <circle cx="13" cy="-44" r="6" fill="none" stroke={`url(#goldKeyGrad_${variant})`} stroke-width="2" />
            <circle cx="0" cy="-57" r="5" fill="none" stroke={`url(#goldKeyGrad_${variant})`} stroke-width="2" />
            <circle cx="0" cy="-31" r="5" fill="none" stroke={`url(#goldKeyGrad_${variant})`} stroke-width="2" />
            <circle cx="0" cy="-44" r="3" fill={`url(#goldKeyGrad_${variant})`} />
            <rect x="-6" y="-27" width="12" height="4" rx="2" fill={`url(#goldKeyGrad_${variant})`} />
            <rect x="-4.5" y="-22" width="9" height="3" rx="1.5" fill={`url(#goldKeyGrad_${variant})`} />
            <rect x="-3" y="-20" width="6" height="66" rx="2" fill={`url(#goldKeyGrad_${variant})`} />
            <line x1="0" y1="-18" x2="0" y2="44" stroke="#FFF7D6" stroke-width="1" opacity="0.8" />
            <path d="M 3 24 L 18 24 L 18 30 L 11 30 L 11 35 L 17 35 L 17 41 L 11 41 L 11 46 L 19 46 L 19 52 L 3 52 Z" fill={`url(#goldKeyGrad_${variant})`} />
            <circle cx="0" cy="46" r="3.5" fill={`url(#goldKeyGrad_${variant})`} />
          </g>

          {/* Key 2 (+45 deg) */}
          <g transform="rotate(45)">
            <circle cx="0" cy="-44" r="16" fill="none" stroke={`url(#goldKeyGrad_${variant})`} stroke-width="4.5" />
            <circle cx="0" cy="-44" r="9" fill="none" stroke={`url(#goldKeyGrad_${variant})`} stroke-width="2.5" />
            <circle cx="-13" cy="-44" r="6" fill="none" stroke={`url(#goldKeyGrad_${variant})`} stroke-width="2" />
            <circle cx="13" cy="-44" r="6" fill="none" stroke={`url(#goldKeyGrad_${variant})`} stroke-width="2" />
            <circle cx="0" cy="-57" r="5" fill="none" stroke={`url(#goldKeyGrad_${variant})`} stroke-width="2" />
            <circle cx="0" cy="-31" r="5" fill="none" stroke={`url(#goldKeyGrad_${variant})`} stroke-width="2" />
            <circle cx="0" cy="-44" r="3" fill={`url(#goldKeyGrad_${variant})`} />
            <rect x="-6" y="-27" width="12" height="4" rx="2" fill={`url(#goldKeyGrad_${variant})`} />
            <rect x="-4.5" y="-22" width="9" height="3" rx="1.5" fill={`url(#goldKeyGrad_${variant})`} />
            <rect x="-3" y="-20" width="6" height="66" rx="2" fill={`url(#goldKeyGrad_${variant})`} />
            <line x1="0" y1="-18" x2="0" y2="44" stroke="#FFF7D6" stroke-width="1" opacity="0.8" />
            <path d="M -3 24 L -18 24 L -18 30 L -11 30 L -11 35 L -17 35 L -17 41 L -11 41 L -11 46 L -19 46 L -19 52 L -3 52 Z" fill={`url(#goldKeyGrad_${variant})`} />
            <circle cx="0" cy="46" r="3.5" fill={`url(#goldKeyGrad_${variant})`} />
          </g>

          {/* Center Rosette Jewel */}
          <circle cx="0" cy="0" r="6.5" fill={`url(#goldKeyGrad_${variant})`} stroke="#070D18" stroke-width="1.5" />
          <polygon points="0,-4 3,-1 4,3 0,5 -4,3 -3,-1" fill="#FFFFFF" />
        </g>
      </svg>

      {/* 2.2 Brand Typography Block */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Main Title: 24K REALTORS */}
        <div
          style={{
            fontFamily: "'Cinzel', 'Playfair Display', 'Times New Roman', serif",
            fontWeight: 800,
            fontSize: isFull ? '1.55rem' : '1.18rem',
            letterSpacing: '0.12em',
            lineHeight: 1.1,
            background: 'linear-gradient(135deg, #FFF5C0 0%, #F5D77F 30%, #D4AF37 60%, #AA7C1E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 10px rgba(212,175,55,0.28)',
            whiteSpace: 'nowrap'
          }}
        >
          24K REALTORS
        </div>

        {/* Subtitle: PUNE'S LUXURY REAL ESTATE */}
        {showSubtitle && (
          <div
            style={{
              fontFamily: "'Montserrat', 'Inter', sans-serif",
              fontWeight: 600,
              fontSize: isFull ? '0.62rem' : '0.48rem',
              letterSpacing: isFull ? '0.38em' : '0.32em',
              color: '#D4AF37',
              opacity: 0.88,
              marginTop: '3px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap'
            }}
          >
            {isFull ? "PUNE'S LUXURY REAL ESTATE" : "PUNE LUXURY REAL ESTATE"}
          </div>
        )}
      </div>
    </div>
  );
}
