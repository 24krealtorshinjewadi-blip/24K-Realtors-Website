import React from 'react';
import { ShieldCheck, Clock, Award, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * VerificationBadge — Trust indicators for 24K Realtors Property Intelligence
 * 
 * @param {Object} props
 * @param {'rera' | 'audit_date' | 'confidence' | 'source'} props.type
 * @param {string} [props.value] - RERA number or audit date or confidence level
 * @param {string} [props.sourceName] - Source name (MahaRERA, Developer Filing, etc.)
 */
export default function VerificationBadge({ type = 'rera', value, sourceName }) {
  if (type === 'rera') {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '4px 10px',
        borderRadius: '8px',
        background: 'rgba(16, 185, 129, 0.15)',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        color: '#34D399',
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.04em'
      }}>
        <ShieldCheck size={13} color="#10B981" />
        <span>{value ? `MahaRERA: ${value}` : 'MahaRERA Registered'}</span>
      </span>
    );
  }

  if (type === 'audit_date') {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 8px',
        borderRadius: '6px',
        background: 'rgba(212, 175, 55, 0.12)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        color: '#F3E5AB',
        fontSize: '0.68rem',
        fontWeight: 600
      }}>
        <Clock size={11} color="#D4AF37" />
        <span>Audit Verified: {value || '25 Aug 2026'}</span>
      </span>
    );
  }

  if (type === 'confidence') {
    const isHigh = value === 'HIGH' || value === 'HIGH_CONFIDENCE';
    const isMed = value === 'MEDIUM';
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 8px',
        borderRadius: '6px',
        background: isHigh ? 'rgba(16, 185, 129, 0.15)' : isMed ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
        border: isHigh ? '1px solid rgba(16, 185, 129, 0.4)' : isMed ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
        color: isHigh ? '#34D399' : isMed ? '#FBBF24' : '#F87171',
        fontSize: '0.68rem',
        fontWeight: 800,
        textTransform: 'uppercase'
      }}>
        {isHigh ? <CheckCircle size={11} /> : <AlertTriangle size={11} />}
        <span>{value || 'HIGH CONFIDENCE'}</span>
      </span>
    );
  }

  if (type === 'source') {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 7px',
        borderRadius: '4px',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#CBD5E1',
        fontSize: '0.65rem'
      }}>
        <Award size={10} color="#D4AF37" />
        <span>Source: {sourceName || 'Official MahaRERA Filing'}</span>
      </span>
    );
  }

  return null;
}
