import React from 'react';

/**
 * 24K REALTORS — Official Brand Logo
 * Renders official high-res logo image (/24k_logo.png)
 */
export default function CompanyLogo({ variant = 'full', width, height, className = '' }) {
  if (variant === 'icon') {
    return (
      <img
        src="/24k_logo.png"
        alt="24K REALTORS PUNE"
        className={className}
        style={{ width: width || 48, height: height || 'auto', maxHeight: 38, objectFit: 'contain', display: 'inline-block', verticalAlign: 'middle' }}
        onError={e => { e.currentTarget.style.display = 'none'; }}
      />
    );
  }

  if (variant === 'compact') {
    return (
      <div className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <img
          src="/24k_logo.png"
          alt="24K REALTORS PUNE"
          style={{ width: width || 155, height: height || 'auto', maxHeight: 44, objectFit: 'contain' }}
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
      </div>
    );
  }

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <img
        src="/24k_logo.png"
        alt="24K REALTORS PUNE"
        style={{ width: width || 260, height: height || 'auto', maxWidth: '100%', objectFit: 'contain' }}
        onError={e => { e.currentTarget.style.display = 'none'; }}
      />
    </div>
  );
}
