import React from 'react';

export default function GoldBadge({ 
  children, 
  variant = 'gold', // 'gold' | 'charcoal' | 'gradient'
  className = '', 
  style = {},
  ...props 
}) {
  const getStyles = () => {
    switch (variant) {
      case 'charcoal':
        return {
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'rgba(255, 255, 255, 0.75)'
        };
      case 'gradient':
        return {
          background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 100%)',
          border: 'none',
          color: '#040814',
          fontWeight: 800
        };
      case 'gold':
      default:
        return {
          background: 'rgba(230, 195, 92, 0.08)',
          border: '1px solid rgba(230, 195, 92, 0.22)',
          color: '#E6C35C'
        };
    }
  };

  return (
    <span
      className={`gold-badge ${className}`}
      style={{
        ...getStyles(),
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3px 10px',
        borderRadius: '4px',
        fontSize: '0.66rem',
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        userSelect: 'none',
        ...style
      }}
      {...props}
    >
      {children}
    </span>
  );
}
