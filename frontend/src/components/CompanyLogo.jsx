import React from 'react';

/**
 * 24K REALTORS PUNE — Official Brand Logo Component
 *
 * Exact replica of the original 24K Realtors brand identity:
 *  - Two crossed antique golden keys forming a house roof gable
 *  - 4-pane arched window under the apex of the crossed keys
 *  - "24K REALTORS" in bold luxury gold serif
 *  - "FIND YOUR SELF AT HOME" tagline
 */
export default function CompanyLogo({
  variant = 'compact',
  layout, // 'stacked' | 'horizontal'
  width,
  height,
  className = '',
  style = {},
  showSubtitle = true,
  onClick
}) {
  const isFull = variant === 'full';
  const isCompact = variant === 'compact';

  // Responsive prominent display heights for crystal-crisp visibility
  const imgHeight = height || (isFull ? 110 : isCompact ? 78 : 88);

  return (
    <div
      className={`company-logo-container ${className}`}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
        textDecoration: 'none',
        lineHeight: 1,
        ...style
      }}
    >
      <img
        src="/24k_gold_brand_logo.png"
        alt="24K Realtors — Find Yourself At Home"
        style={{
          height: `${imgHeight}px`,
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block',
          filter: 'drop-shadow(0 2px 12px rgba(212, 175, 55, 0.5)) drop-shadow(0 4px 20px rgba(0, 0, 0, 0.7))',
          transition: 'transform 0.3s ease'
        }}
      />
    </div>
  );
}
