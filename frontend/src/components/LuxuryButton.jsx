import React from 'react';
import { motion } from 'framer-motion';

export default function LuxuryButton({ 
  children, 
  onClick, 
  variant = 'primary', // 'primary' | 'outline' | 'glass'
  className = '', 
  style = {}, 
  type = 'button',
  disabled = false,
  ...props 
}) {
  const getStyles = () => {
    switch (variant) {
      case 'outline':
        return {
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(230, 195, 92, 0.3)',
          color: '#FFF4D0',
          boxShadow: 'none',
        };
      case 'glass':
        return {
          background: 'rgba(4, 8, 20, 0.55)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          color: '#fff',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        };
      case 'primary':
      default:
        return {
          background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)',
          border: 'none',
          color: '#040814',
          boxShadow: '0 8px 24px rgba(230, 195, 92, 0.25)',
        };
    }
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`luxury-btn ${className}`}
      style={{
        ...getStyles(),
        padding: '14px 28px',
        borderRadius: '50px',
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: 700,
        fontSize: '0.88rem',
        letterSpacing: '0.05em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        outline: 'none',
        opacity: disabled ? 0.6 : 1,
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        ...style
      }}
      whileHover={disabled ? {} : { 
        y: -3, 
        scale: 1.03,
        boxShadow: variant === 'primary' 
          ? '0 12px 30px rgba(230, 195, 92, 0.4)' 
          : '0 12px 30px rgba(255, 255, 255, 0.1)'
      }}
      whileTap={disabled ? {} : { scale: 0.98, y: 0 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
