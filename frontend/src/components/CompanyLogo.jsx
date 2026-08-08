import React from 'react';

/**
 * 24K REALTORS PUNE — Authentic Brand Logo Component
 * Inline SVG recreation of the official gold logo:
 *  - Two crossed golden keys (with house/grid grid-box in centre)
 *  - "24K REALTORS" bold lettering
 *  - "—— PUNE ——" tagline with decorative horizontal lines
 * Renders perfectly on any dark or light background (no image file dependency).
 */

function Logo24KFull({ width = 220, style = {} }) {
  return (
    <svg
      width={width}
      viewBox="0 0 440 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', ...style }}
      aria-label="24K Realtors Pune — Official Logo"
    >
      <defs>
        <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C8961A" />
          <stop offset="35%" stopColor="#F3E5AB" />
          <stop offset="65%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#9A7B1C" />
        </linearGradient>
        <linearGradient id="goldKey" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#9A7B1C" />
        </linearGradient>
      </defs>

      {/* === LEFT KEY (tilted -40°, centred at ~195,68) === */}
      <g transform="translate(220,72) rotate(-40)">
        {/* Key ring */}
        <circle cx="0" cy="-44" r="16" stroke="url(#goldKey)" strokeWidth="5" fill="none" />
        <circle cx="0" cy="-44" r="9" stroke="url(#goldKey)" strokeWidth="3" fill="none" />
        {/* Key shaft */}
        <rect x="-3" y="-28" width="6" height="52" rx="2" fill="url(#goldKey)" />
        {/* Key teeth */}
        <rect x="3" y="14" width="7" height="5" rx="1.5" fill="url(#goldKey)" />
        <rect x="3" y="24" width="10" height="5" rx="1.5" fill="url(#goldKey)" />
      </g>

      {/* === RIGHT KEY (tilted +40°, centred at ~225,68) === */}
      <g transform="translate(220,72) rotate(40)">
        <circle cx="0" cy="-44" r="16" stroke="url(#goldKey)" strokeWidth="5" fill="none" />
        <circle cx="0" cy="-44" r="9" stroke="url(#goldKey)" strokeWidth="3" fill="none" />
        <rect x="-3" y="-28" width="6" height="52" rx="2" fill="url(#goldKey)" />
        <rect x="-10" y="14" width="7" height="5" rx="1.5" fill="url(#goldKey)" />
        <rect x="-13" y="24" width="10" height="5" rx="1.5" fill="url(#goldKey)" />
      </g>

      {/* === House / grid icon at the key cross point === */}
      <g transform="translate(209, 61)">
        <rect x="0" y="0" width="22" height="22" rx="3" fill="url(#gold)" />
        {/* Grid lines */}
        <line x1="7.3" y1="0" x2="7.3" y2="22" stroke="rgba(9,17,31,0.5)" strokeWidth="1.2" />
        <line x1="14.7" y1="0" x2="14.7" y2="22" stroke="rgba(9,17,31,0.5)" strokeWidth="1.2" />
        <line x1="0" y1="7.3" x2="22" y2="7.3" stroke="rgba(9,17,31,0.5)" strokeWidth="1.2" />
        <line x1="0" y1="14.7" x2="22" y2="14.7" stroke="rgba(9,17,31,0.5)" strokeWidth="1.2" />
      </g>

      {/* === Horizontal decorative lines === */}
      <line x1="40" y1="112" x2="175" y2="112" stroke="url(#gold)" strokeWidth="1.5" />
      <line x1="265" y1="112" x2="400" y2="112" stroke="url(#gold)" strokeWidth="1.5" />

      {/* === "24K REALTORS" main text === */}
      <text
        x="220" y="148"
        textAnchor="middle"
        fontFamily="'Cinzel', 'Trajan Pro', 'Times New Roman', serif"
        fontWeight="700"
        fontSize="46"
        letterSpacing="3"
        fill="url(#gold)"
      >
        24K REALTORS
      </text>

      {/* === "— PUNE —" tagline === */}
      <text
        x="220" y="175"
        textAnchor="middle"
        fontFamily="'Cinzel', 'Trajan Pro', 'Times New Roman', serif"
        fontWeight="400"
        fontSize="18"
        letterSpacing="10"
        fill="url(#gold)"
      >
        PUNE
      </text>
      {/* Tagline side dashes */}
      <line x1="120" y1="170" x2="168" y2="170" stroke="url(#gold)" strokeWidth="1" />
      <line x1="272" y1="170" x2="320" y2="170" stroke="url(#gold)" strokeWidth="1" />
    </svg>
  );
}

function Logo24KCompact({ width = 160, style = {} }) {
  return (
    <svg
      width={width}
      viewBox="0 0 340 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', ...style }}
      aria-label="24K Realtors Pune"
    >
      <defs>
        <linearGradient id="goldC" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C8961A" />
          <stop offset="40%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#9A7B1C" />
        </linearGradient>
        <linearGradient id="goldKeyC" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#9A7B1C" />
        </linearGradient>
      </defs>

      {/* Keys icon — small */}
      <g transform="translate(30,30) rotate(-35) scale(0.42)">
        <circle cx="0" cy="-44" r="16" stroke="url(#goldKeyC)" strokeWidth="5" fill="none" />
        <circle cx="0" cy="-44" r="9" stroke="url(#goldKeyC)" strokeWidth="3" fill="none" />
        <rect x="-3" y="-28" width="6" height="50" rx="2" fill="url(#goldKeyC)" />
        <rect x="3" y="14" width="8" height="5" rx="1.5" fill="url(#goldKeyC)" />
        <rect x="3" y="23" width="11" height="5" rx="1.5" fill="url(#goldKeyC)" />
      </g>
      <g transform="translate(30,30) rotate(35) scale(0.42)">
        <circle cx="0" cy="-44" r="16" stroke="url(#goldKeyC)" strokeWidth="5" fill="none" />
        <circle cx="0" cy="-44" r="9" stroke="url(#goldKeyC)" strokeWidth="3" fill="none" />
        <rect x="-3" y="-28" width="6" height="50" rx="2" fill="url(#goldKeyC)" />
        <rect x="-11" y="14" width="8" height="5" rx="1.5" fill="url(#goldKeyC)" />
        <rect x="-14" y="23" width="11" height="5" rx="1.5" fill="url(#goldKeyC)" />
      </g>
      {/* Small grid box */}
      <g transform="translate(21.5, 21)">
        <rect x="0" y="0" width="17" height="17" rx="2.5" fill="url(#goldC)" />
        <line x1="5.7" y1="0" x2="5.7" y2="17" stroke="rgba(9,17,31,0.4)" strokeWidth="1" />
        <line x1="11.3" y1="0" x2="11.3" y2="17" stroke="rgba(9,17,31,0.4)" strokeWidth="1" />
        <line x1="0" y1="5.7" x2="17" y2="5.7" stroke="rgba(9,17,31,0.4)" strokeWidth="1" />
        <line x1="0" y1="11.3" x2="17" y2="11.3" stroke="rgba(9,17,31,0.4)" strokeWidth="1" />
      </g>

      {/* Text block */}
      <text x="60" y="26"
        fontFamily="'Cinzel', 'Trajan Pro', serif"
        fontWeight="700"
        fontSize="22"
        letterSpacing="1.5"
        fill="url(#goldC)"
      >
        24K REALTORS
      </text>
      <text x="60" y="46"
        fontFamily="'Cinzel', 'Trajan Pro', serif"
        fontWeight="400"
        fontSize="11"
        letterSpacing="5"
        fill="url(#goldC)"
      >
        — PUNE —
      </text>
    </svg>
  );
}

function Logo24KIcon({ size = 40, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', ...style }}
      aria-label="24K Realtors"
    >
      <defs>
        <linearGradient id="goldI" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F3E5AB" />
          <stop offset="100%" stopColor="#9A7B1C" />
        </linearGradient>
      </defs>
      <g transform="translate(30,30) rotate(-38) scale(0.55)">
        <circle cx="0" cy="-38" r="13" stroke="url(#goldI)" strokeWidth="5" fill="none" />
        <circle cx="0" cy="-38" r="7" stroke="url(#goldI)" strokeWidth="2.5" fill="none" />
        <rect x="-2.5" y="-25" width="5" height="44" rx="2" fill="url(#goldI)" />
        <rect x="2.5" y="11" width="7" height="4" rx="1.5" fill="url(#goldI)" />
        <rect x="2.5" y="19" width="9" height="4" rx="1.5" fill="url(#goldI)" />
      </g>
      <g transform="translate(30,30) rotate(38) scale(0.55)">
        <circle cx="0" cy="-38" r="13" stroke="url(#goldI)" strokeWidth="5" fill="none" />
        <circle cx="0" cy="-38" r="7" stroke="url(#goldI)" strokeWidth="2.5" fill="none" />
        <rect x="-2.5" y="-25" width="5" height="44" rx="2" fill="url(#goldI)" />
        <rect x="-9.5" y="11" width="7" height="4" rx="1.5" fill="url(#goldI)" />
        <rect x="-11.5" y="19" width="9" height="4" rx="1.5" fill="url(#goldI)" />
      </g>
      {/* Grid box */}
      <g transform="translate(22, 22)">
        <rect x="0" y="0" width="16" height="16" rx="2.5" fill="url(#goldI)" />
        <line x1="5.3" y1="0" x2="5.3" y2="16" stroke="rgba(9,17,31,0.45)" strokeWidth="1" />
        <line x1="10.7" y1="0" x2="10.7" y2="16" stroke="rgba(9,17,31,0.45)" strokeWidth="1" />
        <line x1="0" y1="5.3" x2="16" y2="5.3" stroke="rgba(9,17,31,0.45)" strokeWidth="1" />
        <line x1="0" y1="10.7" x2="16" y2="10.7" stroke="rgba(9,17,31,0.45)" strokeWidth="1" />
      </g>
    </svg>
  );
}

export default function CompanyLogo({ variant = 'full', width, height, className = '', style = {} }) {
  if (variant === 'icon') {
    return <Logo24KIcon size={width || 44} style={style} />;
  }
  if (variant === 'compact') {
    return <Logo24KCompact width={width || 170} style={style} />;
  }
  return <Logo24KFull width={width || 240} style={style} />;
}
