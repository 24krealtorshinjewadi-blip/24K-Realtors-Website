import React from 'react';

export default function GlassInput({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
  style = {},
  required = false,
  ...props
}) {
  return (
    <div className={`glass-input-wrapper ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', ...style }}>
      {label && (
        <label style={{ 
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '0.78rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#FFF4D0',
          opacity: 0.85
        }}>
          {label} {required && <span style={{ color: '#E6C35C' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: '100%',
          background: 'rgba(4, 8, 20, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '14px 20px',
          fontSize: '0.92rem',
          color: '#fff',
          fontFamily: "'Montserrat', sans-serif",
          outline: 'none',
          boxSizing: 'border-box',
          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.03)',
          transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
        }}
        className="glass-input-field"
        {...props}
      />
    </div>
  );
}
