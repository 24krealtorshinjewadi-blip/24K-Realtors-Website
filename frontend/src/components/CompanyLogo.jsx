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

  // Responsive display heights for crystal-crisp rendering
  const imgHeight = height || (isFull ? 64 : isCompact ? 38 : 46);

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
          objectFit: 'contain',
          display: 'block',
          filter: 'drop-shadow(0 2px 10px rgba(212, 175, 55, 0.45))',
          transition: 'transform 0.3s ease'
        }}
      />
    </div>
  );
}
