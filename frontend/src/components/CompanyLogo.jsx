import React, { useState } from 'react';

/**
 * 24K REALTORS PUNE — Exact User Uploaded Logo Component
 * Renders the 100% exact high-resolution brand image (/24k_logo.png).
 */

export default function CompanyLogo({
  variant = 'compact', // 'compact' | 'full' | 'icon'
  width,
  height,
  className = '',
  style = {}
}) {
  const [imgError, setImgError] = useState(false);

  // Default widths per placement
  const isCompact = variant === 'compact';
  const isIcon    = variant === 'icon';
  
  const defaultWidth = isCompact ? 170 : isIcon ? 50 : 260;
  const targetWidth  = width || defaultWidth;

  return (
    <div
      className={`company-logo-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFFFFF',
        padding: isCompact ? '5px 12px' : '10px 20px',
        borderRadius: isCompact ? '12px' : '18px',
        boxShadow: '0 4px 25px rgba(0,0,0,0.45), 0 0 20px rgba(212,175,55,0.3)',
        border: '1px solid rgba(212,175,55,0.5)',
        lineHeight: 0,
        transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
        cursor: 'pointer',
        ...style
      }}
    >
      <img
        src="/24k_logo.png?v=2026_final"
        alt="24K Realtors Pune — Official Logo"
        onError={() => setImgError(true)}
        style={{
          width: typeof targetWidth === 'number' ? `${targetWidth}px` : targetWidth,
          height: height ? (typeof height === 'number' ? `${height}px` : height) : 'auto',
          maxHeight: isCompact ? '44px' : isIcon ? '32px' : '130px',
          objectFit: 'contain',
          display: 'block'
        }}
      />
    </div>
  );
}
