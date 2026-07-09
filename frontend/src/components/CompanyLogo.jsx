import React from 'react';

/**
 * CompanyLogo Component
 * Renders the original 24K Realtors logo (crossed keys + house window + flourish).
 * Act as a Netflix Senior Designer: clean, bold, high-fidelity, premium metallic gradient.
 * 
 * Props:
 * @param {string} variant - 'full' (logo + text + tagline + flourish), 'compact' (logo + text), 'icon' (graphic only)
 * @param {number} width - custom width
 * @param {number} height - custom height
 * @param {string} className - optional CSS classes
 */
export default function CompanyLogo({ variant = 'full', width, height, className = '' }) {
  // Netflix-grade high-contrast metallic gold gradient styling
  const MetallicGoldGradient = () => (
    <defs>
      <linearGradient id="premiumGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF4D0" />
        <stop offset="25%" stopColor="#E6C35C" />
        <stop offset="50%" stopColor="#C59B27" />
        <stop offset="75%" stopColor="#E6C35C" />
        <stop offset="100%" stopColor="#9A7510" />
      </linearGradient>
    </defs>
  );

  // Symmetrical Key template pointing downwards (matches original logo shape)
  const KeyGraphic = () => (
    <g>
      {/* Bow (Ornate Head of the Key - Oval layout with trefoil cutout) */}
      <path 
        d="M 0,-44 C 15,-44 24,-34 24,-24 C 24,-14 15,-6 0,-6 C -15,-6 -24,-14 -24,-24 C -24,-34 -15,-44 0,-44 Z" 
        fill="none" 
        stroke="url(#premiumGold)" 
        strokeWidth="4.5" 
      />
      {/* Inner ornate loops / cutouts */}
      <circle cx="0" cy="-24" r="5.5" fill="url(#premiumGold)" />
      <circle cx="-9" cy="-28" r="4.5" fill="url(#premiumGold)" />
      <circle cx="9" cy="-28" r="4.5" fill="url(#premiumGold)" />
      <circle cx="0" cy="-35" r="4.5" fill="url(#premiumGold)" />

      {/* Ornate Collar */}
      <rect x="-8" y="-4" width="16" height="5" rx="1.5" fill="url(#premiumGold)" />
      <rect x="-5" y="1" width="10" height="3" fill="url(#premiumGold)" />

      {/* Bold Key Shaft */}
      <rect x="-3" y="4" width="6" height="96" fill="url(#premiumGold)" />

      {/* Bit (Teeth) pointing outwards (left) */}
      <path d="M -3,55 H -15 V 65 H -3 Z" fill="url(#premiumGold)" stroke="url(#premiumGold)" strokeWidth="1" strokeLinejoin="round" />
      <path d="M -3,71 H -13 V 79 H -3 Z" fill="url(#premiumGold)" stroke="url(#premiumGold)" strokeWidth="1" strokeLinejoin="round" />
      <path d="M -3,85 H -15 V 88 H -3 Z" fill="url(#premiumGold)" stroke="url(#premiumGold)" strokeWidth="1" strokeLinejoin="round" />
    </g>
  );

  // House window silhouette - positioned in the center under the key crossover
  const HouseWindow = () => (
    <g transform="translate(250, 142)">
      {/* Top Left Pane (Arched) */}
      <path d="M -16,-2 H -2 V -16 A 14,14 0 0,0 -16,-2" fill="url(#premiumGold)" />
      {/* Top Right Pane (Arched) */}
      <path d="M 2,-16 V -2 H 16 A 14,14 0 0,0 2,-16" fill="url(#premiumGold)" />
      {/* Bottom Left Pane */}
      <rect x="-16" y="2" width="14" height="17" fill="url(#premiumGold)" />
      {/* Bottom Right Pane */}
      <rect x="2" y="2" width="14" height="17" fill="url(#premiumGold)" />
    </g>
  );

  // Decorative Luxury Flourish Separator (Matches original emblem separator)
  const Flourish = () => (
    <g transform="translate(250, 276)">
      {/* Central Diamond */}
      <polygon points="0,-7 7,0 0,7 -7,0" fill="url(#premiumGold)" />
      
      {/* Left Wing Flourish (Ornate curls) */}
      <path d="M -15,0 C -30,-9 -55,-5 -65,5 C -55,0 -30,-2 -15,0 Z" fill="url(#premiumGold)" />
      <path d="M -15,2 C -35,9 -65,7 -85,0 C -60,2 -35,0 -15,2 Z" fill="url(#premiumGold)" />
      <line x1="-85" y1="0" x2="-220" y2="0" stroke="url(#premiumGold)" strokeWidth="2" />

      {/* Right Wing Flourish (Mirrored) */}
      <path d="M 15,0 C 30,-9 55,-5 65,5 C 55,0 30,-2 15,0 Z" fill="url(#premiumGold)" />
      <path d="M 15,2 C 35,9 65,7 85,0 C 60,2 35,0 15,2 Z" fill="url(#premiumGold)" />
      <line x1="85" y1="0" x2="220" y2="0" stroke="url(#premiumGold)" strokeWidth="2" />
    </g>
  );

  if (variant === 'icon') {
    return (
      <svg 
        viewBox="0 0 160 120" 
        width={width || 120} 
        height={height || 90} 
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', overflow: 'visible' }}
      >
        <MetallicGoldGradient />
        
        {/* Crossed Keys & Window nestled perfectly */}
        <g transform="translate(80, 48) scale(0.68)">
          <g transform="rotate(-38) translate(0, -10)">
            <KeyGraphic />
          </g>
          <g transform="scale(-1, 1) rotate(-38) translate(0, -10)">
            <KeyGraphic />
          </g>
        </g>
        <g transform="translate(-170, -88) scale(0.68)">
          <HouseWindow />
        </g>
      </svg>
    );
  }

  if (variant === 'compact') {
    return (
      <div 
        className={`flex items-center gap-4 ${className}`} 
        style={{ display: 'inline-flex', alignItems: 'center', gap: '14px' }}
      >
        <svg 
          viewBox="0 0 160 120" 
          width={width || 68} 
          height={height || 51}
          style={{ overflow: 'visible' }}
        >
          <MetallicGoldGradient />
          <g transform="translate(80, 48) scale(0.68)">
            <g transform="rotate(-38) translate(0, -10)">
              <KeyGraphic />
            </g>
            <g transform="scale(-1, 1) rotate(-38) translate(0, -10)">
              <KeyGraphic />
            </g>
          </g>
          <g transform="translate(-170, -88) scale(0.68)">
            <HouseWindow />
          </g>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ 
            fontFamily: "'Cinzel', serif", 
            fontWeight: 800, 
            fontSize: '1.25rem', 
            color: '#FFF4D0', 
            letterSpacing: '0.08em',
            lineHeight: 1.1,
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}>24K REALTORS</span>
          <span style={{ 
            fontFamily: "'Montserrat', sans-serif", 
            fontWeight: 700, 
            fontSize: '0.55rem', 
            color: '#E6C35C', 
            letterSpacing: '0.15em',
            marginTop: '3px'
          }}>FIND YOUR SELF AT HOME</span>
        </div>
      </div>
    );
  }

  // Default: Full Cinematic Brand Presentation (Netflix grade)
  return (
    <div 
      className={`flex flex-col items-center text-center ${className}`}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
    >
      <svg 
        viewBox="0 0 500 320" 
        width={width || '100%'} 
        height={height || 'auto'}
        style={{ maxWidth: '440px', overflow: 'visible' }}
      >
        <MetallicGoldGradient />

        {/* Logo Icon (Keys + Window) */}
        <g transform="translate(250, 95) scale(0.85)">
          <g transform="rotate(-36) translate(0, -12)">
            <KeyGraphic />
          </g>
          <g transform="scale(-1, 1) rotate(-36) translate(0, -12)">
            <KeyGraphic />
          </g>
        </g>
        <HouseWindow />

        {/* Brand Name Text (Bold cinematic serif) */}
        <text 
          x="250" 
          y="204" 
          textAnchor="middle" 
          fill="url(#premiumGold)"
          style={{ 
            fontFamily: "'Cinzel', serif", 
            fontWeight: 800, 
            fontSize: '36px', 
            letterSpacing: '0.08em',
            filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.6))'
          }}
        >
          24K REALTORS
        </text>

        {/* Tagline */}
        <text 
          x="250" 
          y="244" 
          textAnchor="middle" 
          fill="#FFF4D0"
          style={{ 
            fontFamily: "'Montserrat', sans-serif", 
            fontWeight: 700, 
            fontSize: '13px', 
            letterSpacing: '0.24em',
            opacity: 0.95,
            filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.5))'
          }}
        >
          FIND YOUR SELF AT HOME
        </text>

        {/* Flourish Divider */}
        <Flourish />
      </svg>
    </div>
  );
}
