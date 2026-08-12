import React, { useState } from 'react';

/**
 * 24K REALTORS PUNE — Official Brand Logo Component
 * Renders the official brand emblem:
 * - Two crossed luxury gold keys forming an architectural roof
 * - Centered 4-pane house window [田]
 * - "24K REALTORS" serif typography
 * - "— PUNE —" sub-headline with flanking rule lines
 */

const GoldDefs = ({ id = 'g' }) => (
  <defs>
    <linearGradient id={`${id}Shine`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stopColor="#9A7B1C" />
      <stop offset="25%"  stopColor="#D4AF37" />
      <stop offset="50%"  stopColor="#FFF4D0" />
      <stop offset="75%"  stopColor="#D4AF37" />
      <stop offset="100%" stopColor="#8B6914" />
    </linearGradient>
    <linearGradient id={`${id}Shaft`} x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stopColor="#8B6914" />
      <stop offset="45%"  stopColor="#F3E5AB" />
      <stop offset="55%"  stopColor="#D4AF37" />
      <stop offset="100%" stopColor="#9A7B1C" />
    </linearGradient>
    <linearGradient id={`${id}Text`} x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stopColor="#FFF4D0" />
      <stop offset="35%"  stopColor="#E6C35C" />
      <stop offset="70%"  stopColor="#D4AF37" />
      <stop offset="100%" stopColor="#9A7B1C" />
    </linearGradient>

    {/* Glow filter for luxury metallic sheen */}
    <filter id={`${id}Glow`} x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
);

/* ─── Crossed Keys & Window Crest SVG ───────────────────── */
const CrossedKeysIcon = ({ cx, cy, size, gid }) => {
  const s  = size;
  const r  = s * 0.18;
  const r2 = s * 0.09;
  const sw = s * 0.06;
  const sh = s * 0.58;
  const tw = s * 0.09;
  const th = s * 0.06;

  const Key = ({ angle }) => (
    <g transform={`rotate(${angle})`}>
      {/* Clover Top Ring */}
      <circle cx={0} cy={-sh * 0.52} r={r}
        stroke={`url(#${gid}Shine)`} strokeWidth={s * 0.05} fill="none" />
      <circle cx={0} cy={-sh * 0.52} r={r2}
        stroke={`url(#${gid}Shine)`} strokeWidth={s * 0.03} fill="none" />
      {[0, 90, 180, 270].map(a => (
        <circle key={a}
          cx={Math.cos((a - 90) * Math.PI / 180) * (r + s * 0.04)}
          cy={-sh * 0.52 + Math.sin((a - 90) * Math.PI / 180) * (r + s * 0.04)}
          r={s * 0.05}
          fill={`url(#${gid}Shine)`} />
      ))}
      {/* Shaft */}
      <rect x={-sw / 2} y={-sh * 0.52 + r}
        width={sw} height={sh - r * 0.9}
        rx={sw * 0.3} fill={`url(#${gid}Shaft)`} />
      {/* Key Teeth */}
      <rect x={angle < 0 ? sw / 2 : -sw / 2 - tw}
        y={sh * 0.26} width={tw} height={th}
        rx={th * 0.3} fill={`url(#${gid}Shine)`} />
      <rect x={angle < 0 ? sw / 2 : -sw / 2 - tw}
        y={sh * 0.38} width={tw * 1.2} height={th}
        rx={th * 0.3} fill={`url(#${gid}Shine)`} />
    </g>
  );

  return (
    <g transform={`translate(${cx},${cy})`} filter={`url(#${gid}Glow)`}>
      {/* Left Key */}
      <Key angle={42} />
      {/* Right Key */}
      <Key angle={-42} />

      {/* House Window Outline underneath Key Crossing */}
      <g transform="translate(0, 10)">
        <rect x={-11} y={-11} width={22} height={22}
          rx={2} fill="#040814" stroke={`url(#${gid}Shine)`} strokeWidth={2} />
        {/* 4 Panes */}
        <line x1={0} y1={-10} x2={0} y2={10} stroke={`url(#${gid}Shine)`} strokeWidth={1.5} />
        <line x1={-10} y1={0} x2={10} y2={0} stroke={`url(#${gid}Shine)`} strokeWidth={1.5} />
      </g>
    </g>
  );
};

/* ─── FULL Stacked Logo ────────────────────────────────── */
function Logo24KFull({ width = 240, style = {} }) {
  const vw = 440, vh = 240;
  const cx = vw / 2;

  return (
    <svg
      width={width}
      viewBox={`0 0 ${vw} ${vh}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', maxWidth: '100%', height: 'auto', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))', ...style }}
      aria-label="24K Realtors Pune — Official Logo"
    >
      <GoldDefs id="F" />
      <CrossedKeysIcon cx={cx} cy={72} size={135} gid="F" />
      
      {/* 24K REALTORS */}
      <text x={cx} y={165} textAnchor="middle"
        fontFamily="'Cinzel Decorative','Cinzel','Trajan Pro','Georgia',serif"
        fontWeight="700" fontSize="42" letterSpacing="3"
        fill="url(#FText)">24K REALTORS</text>
      
      {/* — PUNE — */}
      <line x1={100} y1={192} x2={165} y2={192} stroke="url(#FShine)" strokeWidth={1.5} />
      <text x={cx} y={198} textAnchor="middle"
        fontFamily="'Cinzel','Trajan Pro','Georgia',serif"
        fontWeight="600" fontSize="18" letterSpacing="10"
        fill="url(#FText)">PUNE</text>
      <line x1={275} y1={192} x2={340} y2={192} stroke="url(#FShine)" strokeWidth={1.5} />
    </svg>
  );
}

/* ─── COMPACT Horizontal Logo (For Navbar) ─────────────── */
function Logo24KCompact({ width = 210, style = {} }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', ...style }}>
      <svg
        width={width}
        viewBox="0 0 380 65"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
        aria-label="24K Realtors Pune"
      >
        <GoldDefs id="C" />
        <CrossedKeysIcon cx={32} cy={32} size={54} gid="C" />
        <text x={70} y={28}
          fontFamily="'Cinzel Decorative','Cinzel','Trajan Pro','Georgia',serif"
          fontWeight="800" fontSize="23" letterSpacing="2"
          fill="url(#CText)">24K REALTORS</text>
        <line x1={70} y1={46} x2={105} y2={46} stroke="url(#CShine)" strokeWidth={1.2} />
        <text x={112} y={50}
          fontFamily="'Cinzel','Trajan Pro','Georgia',serif"
          fontWeight="600" fontSize="11.5" letterSpacing="6"
          fill="url(#CText)">PUNE</text>
        <line x1={155} y1={46} x2={190} y2={46} stroke="url(#CShine)" strokeWidth={1.2} />
      </svg>
    </div>
  );
}

/* ─── ICON ONLY ─────────────────────────────────────────── */
function Logo24KIcon({ size = 48, style = {} }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 65 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', ...style }}
      aria-label="24K Realtors Emblem"
    >
      <GoldDefs id="I" />
      <CrossedKeysIcon cx={32.5} cy={32.5} size={56} gid="I" />
    </svg>
  );
}

/* ─── IMAGE BRAND LOGO ──────────────────────────────────── */
function LogoImage({ variant = 'full', width, style = {} }) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    if (variant === 'icon') return <Logo24KIcon size={width || 48} style={style} />;
    if (variant === 'compact') return <Logo24KCompact width={width || 210} style={style} />;
    return <Logo24KFull width={width || 240} style={style} />;
  }

  const isCompact = variant === 'compact';
  const imgWidth = width || (isCompact ? '195px' : '230px');

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      <img
        src="/24k_logo.png"
        alt="24K Realtors Pune — Official Logo"
        onError={() => setImgError(true)}
        style={{
          width: typeof imgWidth === 'number' ? `${imgWidth}px` : imgWidth,
          height: 'auto',
          display: 'block',
          objectFit: 'contain',
          filter: 'drop-shadow(0 2px 10px rgba(212,175,55,0.35))',
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
}

/* ─── Default Export Component ─────────────────────────── */
export default function CompanyLogo({
  variant = 'compact',
  width,
  height,
  useImage = false,
  className = '',
  style = {}
}) {
  if (useImage) {
    return <LogoImage variant={variant} width={width} style={style} />;
  }

  if (variant === 'icon')    return <Logo24KIcon    size={width || 48}   style={style} className={className} />;
  if (variant === 'compact') return <Logo24KCompact width={width || 210}  style={style} className={className} />;
  return                            <Logo24KFull    width={width || 240}  style={style} className={className} />;
}
