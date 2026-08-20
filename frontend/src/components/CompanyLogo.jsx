import React from 'react';

/**
 * 24K REALTORS PUNE — Official Brand Logo Component
 *
 * Exact replica of the original 24K Realtors brand identity:
 *  - Two crossed antique golden keys forming a house roof gable
 *  - 4-pane arched window under the apex of the crossed keys
 *  - "24K REALTORS" in bold luxury gold serif
 *  - "FIND YOUR SELF AT HOME" tagline
 *
 * Variants:
 *  - 'compact': Stacked presentation for navbar and compact spaces
 *  - 'full': Large luxury presentation for Splash / Login modal
 *  - 'icon': Emblem-only for mobile badges / avatars
 */
export default function CompanyLogo({
  variant = 'compact',
  layout, // 'stacked' | 'horizontal'
  width,
  height,
  className = '',
  style = {},
  showSubtitle = true,
  onClick
}) {
  const isIcon = variant === 'icon';
  const isFull = variant === 'full';
  const isCompact = variant === 'compact';

  const effectiveLayout = layout || (isFull ? 'stacked' : isCompact ? 'stacked' : 'stacked');

  const emblemSize = isIcon
    ? (width || height || 46)
    : isFull
    ? (width ? width * 0.42 : 78)
    : (width ? width * 0.36 : 48);

  // 1. ICON-ONLY VARIANT
  if (isIcon) {
    return (
      <div
        className={`company-logo-icon ${className}`}
        onClick={onClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: onClick ? 'pointer' : 'default',
          userSelect: 'none',
          ...style
        }}
      >
        <KeysEmblemSVG size={emblemSize} />
      </div>
    );
  }

  // 2. STACKED LAYOUT (Exact match to original logo image)
  if (effectiveLayout === 'stacked') {
    return (
      <div
        className={`company-logo-container company-logo-stacked ${className}`}
        onClick={onClick}
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isFull ? '6px' : '2px',
          lineHeight: 1,
          cursor: onClick ? 'pointer' : 'default',
          userSelect: 'none',
          textDecoration: 'none',
          padding: '2px 0',
          ...style
        }}
      >
        <KeysEmblemSVG size={emblemSize} />

        <div
          style={{
            fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
            fontWeight: 800,
            fontSize: isFull ? '1.5rem' : isCompact ? '0.96rem' : '1.15rem',
            letterSpacing: isFull ? '0.22em' : '0.16em',
            lineHeight: 1.1,
            background: 'linear-gradient(135deg, #FFF8D6 0%, #F5D77F 35%, #D4AF37 70%, #9E7820 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            filter: 'drop-shadow(0 2px 8px rgba(212,175,55,0.3))'
          }}
        >
          24K REALTORS
        </div>

        {showSubtitle && (
          <div
            style={{
              fontFamily: "'Montserrat', 'Cinzel', sans-serif",
              fontWeight: 700,
              fontSize: isFull ? '0.62rem' : isCompact ? '0.41rem' : '0.48rem',
              letterSpacing: isFull ? '0.34em' : '0.24em',
              color: '#E8CA72',
              opacity: 0.95,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              textAlign: 'center',
              marginTop: '1px'
            }}
          >
            FIND YOUR SELF AT HOME
          </div>
        )}
      </div>
    );
  }

  // 3. HORIZONTAL LAYOUT
  return (
    <div
      className={`company-logo-container company-logo-horizontal ${className}`}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        lineHeight: 1,
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        textDecoration: 'none',
        ...style
      }}
    >
      <KeysEmblemSVG size={emblemSize} />

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '3px' }}>
        <div
          style={{
            fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
            fontWeight: 800,
            fontSize: isFull ? '1.5rem' : '1.15rem',
            letterSpacing: '0.18em',
            lineHeight: 1.1,
            background: 'linear-gradient(135deg, #FFF8D6 0%, #F5D77F 35%, #D4AF37 70%, #9E7820 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            whiteSpace: 'nowrap',
            filter: 'drop-shadow(0 2px 8px rgba(212,175,55,0.3))'
          }}
        >
          24K REALTORS
        </div>

        {showSubtitle && (
          <div
            style={{
              fontFamily: "'Montserrat', 'Cinzel', sans-serif",
              fontWeight: 700,
              fontSize: isFull ? '0.58rem' : '0.45rem',
              letterSpacing: '0.28em',
              color: '#E8CA72',
              opacity: 0.95,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap'
            }}
          >
            FIND YOUR SELF AT HOME
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KeysEmblemSVG — Exact Replica of Original 24K Realtors Crossed Keys + 4-Pane Window
// ─────────────────────────────────────────────────────────────────────────────
function KeysEmblemSVG({ size = 48 }) {
  const uid = `k24_${size}`;
  const width = size * 1.32;
  const height = size * 0.8;

  return (
    <svg
      viewBox="0 0 220 134"
      width={width}
      height={height}
      style={{ display: 'block', overflow: 'visible', filter: 'drop-shadow(0 3px 10px rgba(212,175,55,0.45))' }}
      aria-label="24K Realtors Crossed Keys Logo Emblem"
    >
      <defs>
        <linearGradient id={`${uid}_gold`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFBE6" />
          <stop offset="20%" stopColor="#F7E294" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="80%" stopColor="#AA7C1E" />
          <stop offset="100%" stopColor="#6E4D0C" />
        </linearGradient>

        <linearGradient id={`${uid}_shaft`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="45%" stopColor="#E5C158" />
          <stop offset="75%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8A6314" />
        </linearGradient>

        <linearGradient id={`${uid}_window`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF8D6" />
          <stop offset="50%" stopColor="#E8CA72" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>

      {/* ── 1. LEFT KEY (Rotated ~-32deg, Bow at Top-Left, Teeth at Bottom-Left) ── */}
      <g transform="translate(110, 48) rotate(-32)">
        <circle cx="0" cy="-44" r="17" fill="none" stroke={`url(#${uid}_gold)`} strokeWidth="5.5" />
        <circle cx="0" cy="-44" r="9" fill="none" stroke={`url(#${uid}_gold)`} strokeWidth="3" />
        <circle cx="-13" cy="-52" r="5" fill="none" stroke={`url(#${uid}_gold)`} strokeWidth="2.5" />
        <circle cx="13" cy="-52" r="5" fill="none" stroke={`url(#${uid}_gold)`} strokeWidth="2.5" />
        <circle cx="0" cy="-62" r="4" fill="none" stroke={`url(#${uid}_gold)`} strokeWidth="2.2" />

        <rect x="-4.5" y="-27" width="9" height="74" rx="3.5" fill={`url(#${uid}_shaft)`} />
        <line x1="0" y1="-25" x2="0" y2="44" stroke="#FFFCEB" strokeWidth="1.2" opacity="0.8" />

        <path
          d="M 4.5 16 L 16 16 L 16 23 L 4.5 23 Z 
             M 4.5 27 L 13 27 L 13 34 L 4.5 34 Z 
             M 4.5 38 L 18 38 L 18 45 L 4.5 45 Z"
          fill={`url(#${uid}_gold)`}
        />
        <circle cx="0" cy="47" r="4.5" fill={`url(#${uid}_gold)`} />
      </g>

      {/* ── 2. RIGHT KEY (Rotated ~+32deg, Bow at Top-Right, Teeth at Bottom-Right) ── */}
      <g transform="translate(110, 48) rotate(32)">
        <circle cx="0" cy="-44" r="17" fill="none" stroke={`url(#${uid}_gold)`} strokeWidth="5.5" />
        <circle cx="0" cy="-44" r="9" fill="none" stroke={`url(#${uid}_gold)`} strokeWidth="3" />
        <circle cx="-13" cy="-52" r="5" fill="none" stroke={`url(#${uid}_gold)`} strokeWidth="2.5" />
        <circle cx="13" cy="-52" r="5" fill="none" stroke={`url(#${uid}_gold)`} strokeWidth="2.5" />
        <circle cx="0" cy="-62" r="4" fill="none" stroke={`url(#${uid}_gold)`} strokeWidth="2.2" />

        <rect x="-4.5" y="-27" width="9" height="74" rx="3.5" fill={`url(#${uid}_shaft)`} />
        <line x1="0" y1="-25" x2="0" y2="44" stroke="#FFFCEB" strokeWidth="1.2" opacity="0.8" />

        <path
          d="M -4.5 16 L -16 16 L -16 23 L -4.5 23 Z 
             M -4.5 27 L -13 27 L -13 34 L -4.5 34 Z 
             M -4.5 38 L -18 38 L -18 45 L -4.5 45 Z"
          fill={`url(#${uid}_gold)`}
        />
        <circle cx="0" cy="47" r="4.5" fill={`url(#${uid}_gold)`} />
      </g>

      {/* ── 3. HOUSE ROOF GABLE CONNECTOR & ORNAMENTATION ── */}
      <circle cx="110" cy="48" r="7" fill={`url(#${uid}_gold)`} stroke="#1A1202" strokeWidth="1.5" />
      <polygon points="110,43 114,47 114,51 110,54 106,51 106,47" fill="#FFFCEB" />

      {/* ── 4. 4-PANE ARCHED HOUSE WINDOW UNDER THE KEYS APEX ── */}
      <g id="house-window" transform="translate(110, 68)">
        <path
          d="M -13 18 L -13 0 Q 0 -10 13 0 L 13 18 Z"
          fill="none"
          stroke={`url(#${uid}_gold)`}
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <line x1="-16" y1="18" x2="16" y2="18" stroke={`url(#${uid}_gold)`} strokeWidth="3" strokeLinecap="round" />

        <path d="M -10 -0.5 Q -4 -6 -1.8 -7.5 L -1.8 -0.5 Z" fill={`url(#${uid}_window)`} />
        <path d="M 10 -0.5 Q 4 -6 1.8 -7.5 L 1.8 -0.5 Z" fill={`url(#${uid}_window)`} />
        <rect x="-10" y="2.5" width="8.2" height="12.5" rx="1" fill={`url(#${uid}_window)`} />
        <rect x="1.8" y="2.5" width="8.2" height="12.5" rx="1" fill={`url(#${uid}_window)`} />
      </g>
    </svg>
  );
}
