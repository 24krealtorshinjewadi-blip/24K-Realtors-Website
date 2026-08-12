import React, { useState } from 'react';

/**
 * 24K REALTORS PUNE — Transparent Brand Logo Component
 * Renders the EXACT 3D Gold Logo image (/24k_logo_transparent.png) with background removed.
 * Fits seamlessly onto dark and light backgrounds.
 */

export default function CompanyLogo({
  variant = 'compact', // 'compact' | 'full' | 'icon'
  width,
  height,
  className = '',
  style = {}
}) {
  const [imgError, setImgError] = useState(false);

  // Default widths based on placement
  const isCompact = variant === 'compact';
  const isIcon    = variant === 'icon';
  
  const defaultWidth = isCompact ? 175 : isIcon ? 46 : 240;
  const targetWidth  = width || defaultWidth;

  if (imgError) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', color: '#E6C35C', fontFamily: "'Cinzel', serif", fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.05em', ...style }}>
        <span>24K REALTORS PUNE</span>
      </div>
    );
  }

  return (
    <div
      className={`company-logo-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 0,
        transition: 'transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
        cursor: 'pointer',
        ...style
      }}
    >
      <img
        src="/24k_logo_transparent.png?v=2026_transparent_v1"
        alt="24K Realtors Pune — Official Logo"
        onError={() => setImgError(true)}
        style={{
          width: typeof targetWidth === 'number' ? `${targetWidth}px` : targetWidth,
          height: height ? (typeof height === 'number' ? `${height}px` : height) : 'auto',
          maxHeight: isCompact ? '48px' : isIcon ? '36px' : '140px',
          objectFit: 'contain',
          display: 'block',
          filter: 'drop-shadow(0 2px 10px rgba(212,175,55,0.45))'
        }}
      />
    </div>
  );
}
