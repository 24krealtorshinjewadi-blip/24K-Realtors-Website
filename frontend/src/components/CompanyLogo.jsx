import React from 'react';

/**
 * 24K REALTORS PUNE — Pixel-Perfect Brand Logo Component
 * Faithfully recreates the official logo from business card / brand assets:
 *  - Two crossed golden keys with clover-top rings, forming an inverted V (roof) shape
 *  - A small window/grid icon at the center crossing point
 *  - "24K REALTORS" in bold serif
 *  - "— PUNE —" tagline with flanking lines
 *
 * Three variants:
 *   full    — stacked icon + text (for hero, property detail, etc.)
 *   compact — horizontal icon + text (for navbar)
 *   icon    — keys icon only (favicon-style)
 */

/* ─── Shared gradient defs ─────────────────────────────── */
const GoldDefs = ({ id = 'g' }) => (
  <defs>
    <linearGradient id={`${id}Shine`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stopColor="#8B6914" />
      <stop offset="25%"  stopColor="#D4AF37" />
      <stop offset="50%"  stopColor="#F5E27A" />
      <stop offset="75%"  stopColor="#D4AF37" />
      <stop offset="100%" stopColor="#8B6914" />
    </linearGradient>
    <linearGradient id={`${id}Shaft`} x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stopColor="#9A7B1C" />
      <stop offset="40%"  stopColor="#F3E5AB" />
      <stop offset="60%"  stopColor="#D4AF37" />
      <stop offset="100%" stopColor="#9A7B1C" />
    </linearGradient>
    <linearGradient id={`${id}Text`} x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stopColor="#F5E27A" />
      <stop offset="50%"  stopColor="#D4AF37" />
      <stop offset="100%" stopColor="#9A7B1C" />
    </linearGradient>
  </defs>
);

/* ─── Crossed Keys Icon ────────────────────────────────── */
const CrossedKeysIcon = ({ cx, cy, size, gid }) => {
  const s  = size;
  const r  = s * 0.18;
  const r2 = s * 0.10;
  const sw = s * 0.065;
  const sh = s * 0.55;
  const tw = s * 0.09;
  const th = s * 0.065;
  const wh = s * 0.18;

  const Key = ({ angle }) => (
    <g transform={`rotate(${angle})`}>
      <circle cx={0} cy={-sh * 0.5} r={r}
        stroke={`url(#${gid}Shine)`} strokeWidth={s * 0.055} fill="none" />
      <circle cx={0} cy={-sh * 0.5} r={r2}
        stroke={`url(#${gid}Shine)`} strokeWidth={s * 0.032} fill="none" />
      {[0, 90, 180, 270].map(a => (
        <circle key={a}
          cx={Math.cos((a - 90) * Math.PI / 180) * (r + s * 0.055)}
          cy={-sh * 0.5 + Math.sin((a - 90) * Math.PI / 180) * (r + s * 0.055)}
          r={s * 0.06}
          fill={`url(#${gid}Shine)`} />
      ))}
      <rect x={-sw / 2} y={-sh * 0.5 + r + s * 0.01}
        width={sw} height={sh - r * 1.1}
        rx={sw * 0.35} fill={`url(#${gid}Shaft)`} />
      <rect x={angle < 0 ? sw / 2 : -sw / 2 - tw}
        y={sh * 0.28} width={tw} height={th}
        rx={th * 0.4} fill={`url(#${gid}Shine)`} />
      <rect x={angle < 0 ? sw / 2 : -sw / 2 - tw}
        y={sh * 0.41} width={tw * 1.25} height={th}
        rx={th * 0.4} fill={`url(#${gid}Shine)`} />
    </g>
  );

  return (
    <g transform={`translate(${cx},${cy})`}>
      <Key angle={38} />
      <g transform={`translate(${-wh / 2},${-wh * 0.25})`}>
        <rect x={0} y={0} width={wh} height={wh}
          rx={wh * 0.12} fill={`url(#${gid}Shine)`} />
        <line x1={wh / 3} y1={0} x2={wh / 3} y2={wh}
          stroke="rgba(9,17,31,0.55)" strokeWidth={wh * 0.07} />
        <line x1={wh * 2 / 3} y1={0} x2={wh * 2 / 3} y2={wh}
          stroke="rgba(9,17,31,0.55)" strokeWidth={wh * 0.07} />
        <line x1={0} y1={wh / 3} x2={wh} y2={wh / 3}
          stroke="rgba(9,17,31,0.55)" strokeWidth={wh * 0.07} />
        <line x1={0} y1={wh * 2 / 3} x2={wh} y2={wh * 2 / 3}
          stroke="rgba(9,17,31,0.55)" strokeWidth={wh * 0.07} />
      </g>
      <Key angle={-38} />
    </g>
  );
};

/* ─── FULL Logo (stacked) ──────────────────────────────── */
function Logo24KFull({ width = 220, style = {} }) {
  const vw = 440, vh = 230;
  const cx = vw / 2, iconSize = 130, iconCY = 70;

  return (
    <svg
      width={width}
      viewBox={`0 0 ${vw} ${vh}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', ...style }}
      aria-label="24K Realtors Pune — Official Logo"
    >
      <GoldDefs id="F" />
      <CrossedKeysIcon cx={cx} cy={iconCY} size={iconSize} gid="F" />
      <line x1={38} y1={125} x2={178} y2={125} stroke="url(#FShine)" strokeWidth={1.2} />
      <line x1={262} y1={125} x2={402} y2={125} stroke="url(#FShine)" strokeWidth={1.2} />
      <text x={cx} y={158} textAnchor="middle"
        fontFamily="'Cinzel','Trajan Pro','Georgia',serif"
        fontWeight="700" fontSize="48" letterSpacing="2.5"
        fill="url(#FText)">24K REALTORS</text>
      <line x1={118} y1={185} x2={174} y2={185} stroke="url(#FShine)" strokeWidth={1} />
      <text x={cx} y={190} textAnchor="middle"
        fontFamily="'Cinzel','Trajan Pro','Georgia',serif"
        fontWeight="400" fontSize="17" letterSpacing="9"
        fill="url(#FText)">PUNE</text>
      <line x1={270} y1={185} x2={326} y2={185} stroke="url(#FShine)" strokeWidth={1} />
    </svg>
  );
}

/* ─── COMPACT Logo (horizontal — for navbar) ───────────── */
function Logo24KCompact({ width = 185, style = {} }) {
  return (
    <svg
      width={width}
      viewBox="0 0 370 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', ...style }}
      aria-label="24K Realtors Pune"
    >
      <GoldDefs id="C" />
      <CrossedKeysIcon cx={28} cy={30} size={50} gid="C" />
      <text x={62} y={26}
        fontFamily="'Cinzel','Trajan Pro','Georgia',serif"
        fontWeight="700" fontSize="22" letterSpacing="1.5"
        fill="url(#CText)">24K REALTORS</text>
      <line x1={62}  y1={42} x2={92}  y2={42} stroke="url(#CShine)" strokeWidth={0.9} />
      <text x={96} y={46}
        fontFamily="'Cinzel','Trajan Pro','Georgia',serif"
        fontWeight="400" fontSize="10.5" letterSpacing="5"
        fill="url(#CText)">PUNE</text>
      <line x1={130} y1={42} x2={160} y2={42} stroke="url(#CShine)" strokeWidth={0.9} />
    </svg>
  );
}

/* ─── ICON only ─────────────────────────────────────────── */
function Logo24KIcon({ size = 44, style = {} }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', ...style }}
      aria-label="24K Realtors"
    >
      <GoldDefs id="I" />
      <CrossedKeysIcon cx={30} cy={30} size={52} gid="I" />
    </svg>
  );
}

/* ─── Default Export ───────────────────────────────────── */
export default function CompanyLogo({
  variant = 'full',
  width,
  height,
  className = '',
  style = {}
}) {
  if (variant === 'icon')    return <Logo24KIcon    size={width || 44}   style={style} className={className} />;
  if (variant === 'compact') return <Logo24KCompact width={width || 185}  style={style} className={className} />;
  return                            <Logo24KFull    width={width || 240}  style={style} className={className} />;
}

