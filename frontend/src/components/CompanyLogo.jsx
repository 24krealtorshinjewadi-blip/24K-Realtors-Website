import React, { useState } from 'react';

/**
 * 24K REALTORS PUNE — Official Brand Logo Component
 * Renders the EXACT 3D Gold Logo Image (/24k_logo.png) uploaded by the user.
 */

export default function CompanyLogo({
  variant = 'compact', // 'compact' | 'full' | 'icon'
  width,
  height,
  className = '',
  style = {}
}) {
  const [imgError, setImgError] = useState(false);

  // Responsive sizes for navbar, footer, login & modals
  const defaultWidth = variant === 'compact' ? 180 : variant === 'icon' ? 60 : 250;
  const targetWidth = width || defaultWidth;

  if (imgError) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', color: '#D4AF37', fontFamily: "'Cinzel', serif", fontWeight: 800, fontSize: '1.1rem', ...style }}>
        <span>24K REALTORS PUNE</span>
      </div>
    );
  }

  // Variant specific styling for exact brand image display
  const isCompact = variant === 'compact';

  return (
    <div
      className={`company-logo-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFFFFF',
        padding: isCompact ? '4px 10px' : '10px 18px',
        borderRadius: isCompact ? '10px' : '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.35), 0 0 15px rgba(212,175,55,0.25)',
        border: '1px solid rgba(212,175,55,0.4)',
        lineHeight: 0,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        ...style
      }}
    >
      <img
        src="/24k_logo.png"
        alt="24K Realtors Pune — Official Logo"
        onError={() => setImgError(true)}
        style={{
          width: typeof targetWidth === 'number' ? `${targetWidth}px` : targetWidth,
          height: height ? (typeof height === 'number' ? `${height}px` : height) : 'auto',
          maxHeight: isCompact ? '42px' : '120px',
          objectFit: 'contain',
          display: 'block'
        }}
      />
    </div>
  );
}
