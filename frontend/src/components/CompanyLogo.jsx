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
  
  const defaultWidth = isCompact ? 160 : isIcon ? 52 : 220;
  const targetWidth  = width || defaultWidth;

  if (imgError) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#D4AF37', fontFamily: "'Cinzel', serif", fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.08em', ...style }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="#D4AF37"><path d="M12 2L8 6H4v4l-3 3 3 3v4h4l4 4 4-4h4v-4l3-3-3-3V6h-4L12 2z"/></svg>
        <span>24K REALTORS</span>
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
        src="/24k_logo_transparent.png?v=2026_v3"
        alt="24K Realtors Pune — Official Logo"
        onError={() => setImgError(true)}
        style={{
          width: typeof targetWidth === 'number' ? `${targetWidth}px` : targetWidth,
          height: height ? (typeof height === 'number' ? `${height}px` : height) : 'auto',
          maxHeight: isCompact ? '52px' : isIcon ? '44px' : '160px',
          objectFit: 'contain',
          display: 'block',
          filter: 'drop-shadow(0 2px 12px rgba(212,175,55,0.5))'
        }}
      />
    </div>
  );
}
