import React from 'react';

/**
 * 24K REALTORS — Official Logo Component
 * Renders the uploaded official 24K Realtors logo (crossed gold keys + house + text & tagline)
 */
export default function CompanyLogo({ variant = 'full', width, height, className = '' }) {
  if (variant === 'icon') {
    return (
      <img 
        src="/logo.png" 
        alt="24K Realtors Logo" 
        className={className} 
        style={{ 
          width: width || 44, 
          height: height || 44, 
          objectFit: 'contain',
          display: 'inline-block',
          verticalAlign: 'middle',
        }} 
      />
    );
  }

  if (variant === 'compact') {
    return (
      <div className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
        <img 
          src="/logo.png" 
          alt="24K Realtors Logo" 
          style={{ width: width || 130, height: height || 'auto', objectFit: 'contain', maxHeight: 42 }} 
        />
      </div>
    );
  }

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <img 
        src="/logo.png" 
        alt="24K Realtors Logo — FIND YOUR SELF AT HOME" 
        style={{ width: width || 220, height: height || 'auto', objectFit: 'contain', maxWidth: '100%' }} 
      />
    </div>
  );
}
