import React from 'react';

/**
 * CompanyLogo Component
 * Renders the original 24K Realtors logo (crossed keys + house window + flourish).
 * 
 * Props:
 * @param {string} variant - 'full' (logo + text + tagline + flourish), 'compact' (logo + text), 'icon' (graphic only)
 * @param {number} width - custom width
 * @param {number} height - custom height
 * @param {string} className - optional CSS classes
 */
export default function CompanyLogo({ variant = 'full', width, height, className = '' }) {
  // Symmetrical Key template pointing downwards
  const KeyGraphic = () => (
    <g>
      {/* Bow (Ornate Head of the Key) */}
      <path 
        d="M 0,-48 C 12,-48 18,-38 18,-30 C 18,-20 8,-14 0,-14 C -8,-14 -18,-20 -18,-30 C -18,-38 -12,-48 0,-48 Z" 
        fill="none" 
        stroke="url(#goldGradient)" 
        strokeWidth="4" 
      />
      <circle cx="0" cy="-30" r="4" fill="url(#goldGradient)" />
      <circle cx="-7" cy="-34" r="3" fill="url(#goldGradient)" />
      <circle cx="7" cy="-34" r="3" fill="url(#goldGradient)" />

      {/* Ornate Collar */}
      <rect x="-6" y="-12" width="12" height="4" rx="1" fill="url(#goldGradient)" />
      <rect x="-4" y="-8" width="8" height="3" fill="url(#goldGradient)" />

      {/* Key Shaft */}
      <rect x="-2.5" y="-5" width="5" height="68" fill="url(#goldGradient)" />

      {/* Bit (Teeth) pointing outwards (left) */}
      <path d="M -2.5,35 H -12 V 43 H -2.5 Z" fill="url(#goldGradient)" />
      <path d="M -2.5,48 H -10 V 55 H -2.5 Z" fill="url(#goldGradient)" />
      <path d="M -2.5,59 H -12 V 61 H -2.5 Z" fill="url(#goldGradient)" />
    </g>
  );

  // House window silhouette
  const HouseWindow = () => (
    <g transform="translate(0, 8)">
      {/* Top Left Pane (Arched) */}
      <path d="M -11,-2 H -2 V -11 A 9,9 0 0,0 -11,-2" fill="url(#goldGradient)" />
      {/* Top Right Pane (Arched) */}
      <path d="M 2,-11 V -2 H 11 A 9,9 0 0,0 2,-11" fill="url(#goldGradient)" />
      {/* Bottom Left Pane */}
      <rect x="-11" y="2" width="9" height="11" fill="url(#goldGradient)" />
      {/* Bottom Right Pane */}
      <rect x="2" y="2" width="9" height="11" fill="url(#goldGradient)" />
    </g>
  );

  // Decorative Luxury Flourish Separator
  const Flourish = () => (
    <g transform="translate(250, 275)">
      {/* Central Diamond */}
      <polygon points="0,-6 6,0 0,6 -6,0" fill="url(#goldGradient)" />
      
      {/* Left Wing Flourish */}
      <path 
        d="M -12,0 C -25,-8 -45,-4 -55,4 C -45,0 -25,-2 -12,0 Z" 
        fill="url(#goldGradient)" 
      />
      <path 
        d="M -12,2 C -30,8 -55,6 -75,0 C -50,2 -30,0 -12,2 Z" 
        fill="url(#goldGradient)" 
      />
      <line x1="-75" y1="0" x2="-180" y2="0" stroke="url(#goldGradient)" strokeWidth="1.5" />

      {/* Right Wing Flourish (Mirrored) */}
      <path 
        d="M 12,0 C 25,-8 45,-4 55,4 C 45,0 25,-2 12,0 Z" 
        fill="url(#goldGradient)" 
      />
      <path 
        d="M 12,2 C 30,8 55,6 75,0 C 50,2 30,0 12,2 Z" 
        fill="url(#goldGradient)" 
      />
      <line x1="75" y1="0" x2="180" y2="0" stroke="url(#goldGradient)" strokeWidth="1.5" />
    </g>
  );

  if (variant === 'icon') {
    return (
      <svg 
        viewBox="0 0 160 120" 
        width={width || 120} 
        height={height || 90} 
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle' }}
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE58F" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#9A7510" />
          </linearGradient>
        </defs>
        
        {/* Crossed Keys */}
        <g transform="translate(80, 52)">
          <g transform="rotate(-40) translate(0, -10)">
            <KeyGraphic />
          </g>
          <g transform="scale(-1, 1) rotate(-40) translate(0, -10)">
            <KeyGraphic />
          </g>
          <HouseWindow />
        </g>
      </svg>
    );
  }

  if (variant === 'compact') {
    return (
      <div 
        className={`flex items-center gap-3 ${className}`} 
        style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}
      >
        <svg 
          viewBox="0 0 160 120" 
          width={width || 56} 
          height={height || 42}
        >
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE58F" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#9A7510" />
            </linearGradient>
          </defs>
          <g transform="translate(80, 52)">
            <g transform="rotate(-40) translate(0, -10)">
              <KeyGraphic />
            </g>
            <g transform="scale(-1, 1) rotate(-40) translate(0, -10)">
              <KeyGraphic />
            </g>
            <HouseWindow />
          </g>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ 
            fontFamily: "'Cinzel', serif", 
            fontWeight: 800, 
            fontSize: '1.15rem', 
            color: '#FFE58F', 
            letterSpacing: '0.06em',
            lineHeight: 1.1
          }}>24K REALTORS</span>
          <span style={{ 
            fontFamily: "'Montserrat', sans-serif", 
            fontWeight: 700, 
            fontSize: '0.52rem', 
            color: '#D4AF37', 
            letterSpacing: '0.12em',
            marginTop: '2px'
          }}>FIND YOUR SELF AT HOME</span>
        </div>
      </div>
    );
  }

  // Default: Full Brand Presentation
  return (
    <div 
      className={`flex flex-col items-center text-center ${className}`}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
    >
      <svg 
        viewBox="0 0 500 310" 
        width={width || '100%'} 
        height={height || 'auto'}
        style={{ maxWidth: '380px' }}
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE58F" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#9A7510" />
          </linearGradient>
        </defs>

        {/* Logo Icon (Keys + Window) */}
        <g transform="translate(250, 75)">
          <g transform="rotate(-42) translate(0, -10)">
            <KeyGraphic />
          </g>
          <g transform="scale(-1, 1) rotate(-42) translate(0, -10)">
            <KeyGraphic />
          </g>
          <HouseWindow />
        </g>

        {/* Brand Name Text */}
        <text 
          x="250" 
          y="190" 
          textAnchor="middle" 
          fill="url(#goldGradient)"
          style={{ 
            fontFamily: "'Cinzel', serif", 
            fontWeight: 700, 
            fontSize: '34px', 
            letterSpacing: '0.08em' 
          }}
        >
          24K REALTORS
        </text>

        {/* Tagline */}
        <text 
          x="250" 
          y="235" 
          textAnchor="middle" 
          fill="#FFE58F"
          style={{ 
            fontFamily: "'Montserrat', sans-serif", 
            fontWeight: 500, 
            fontSize: '15px', 
            letterSpacing: '0.22em' 
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
