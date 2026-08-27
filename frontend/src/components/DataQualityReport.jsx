import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle, Clock, 
  Building2, Search, Filter, ArrowUpRight, Edit2, Sparkles, FileText
} from 'lucide-react';

export default function DataQualityReport({ societies = [], onEditSociety }) {
  const [filterType, setFilterType] = useState('ALL'); // ALL | MISSING_RERA | MISSING_PRICE_DATE | MISSING_POSSESSION | LOW_CONFIDENCE
  const [searchTerm, setSearchTerm] = useState('');

  // ── Metrics Computation ──
  const total = societies.length || 1;
  const withRera = societies.filter(s => s.reraNumber && s.reraNumber.trim().length > 0).length;
  const withPriceDate = societies.filter(s => s.priceLastVerified || s.lastVerifiedAt).length;
  const withPossession = societies.filter(s => s.possessionDate && s.possessionDate.trim().length > 0).length;
  const highConfidence = societies.filter(s => s.confidenceLevel === 'HIGH' || s.confidenceLevel === 'HIGH_CONFIDENCE' || !s.confidenceLevel).length;

  const reraScore = Math.round((withRera / total) * 100);
  const priceScore = Math.round((withPriceDate / total) * 100);
  const healthScore = Math.round((reraScore + priceScore + Math.round((withPossession / total) * 100)) / 3);

  // ── Flagged records filter ──
  const filteredRecords = societies.filter(s => {
    const matchesSearch = !searchTerm.trim() || 
      (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (s.developer && s.developer.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === 'MISSING_RERA') return !s.reraNumber || s.reraNumber.trim().length === 0;
    if (filterType === 'MISSING_PRICE_DATE') return !s.priceLastVerified && !s.lastVerifiedAt;
    if (filterType === 'MISSING_POSSESSION') return !s.possessionDate || s.possessionDate.trim().length === 0;
    if (filterType === 'LOW_CONFIDENCE') return s.confidenceLevel === 'LOW' || s.confidenceLevel === 'UNVERIFIED';

    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.3s ease' }}>
      
      {/* ── Summary Strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Overall Health Score */}
        <div style={{ background: 'rgba(13, 24, 42, 0.85)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', fontWeight: 900, fontSize: '1.2rem' }}>
            {healthScore}%
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#A0AEC0', fontWeight: 700, letterSpacing: '0.05em' }}>Database Health</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: healthScore >= 80 ? '#34D399' : '#FBBF24', marginTop: '2px' }}>
              {healthScore >= 80 ? 'Production Ready' : 'Audit Required'}
            </div>
          </div>
        </div>

        {/* MahaRERA Compliance */}
        <div style={{ background: 'rgba(13, 24, 42, 0.85)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34D399' }}>
            <ShieldCheck size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#A0AEC0', fontWeight: 700, letterSpacing: '0.05em' }}>MahaRERA Onboarded</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>
              {withRera} / {societies.length} <span style={{ fontSize: '0.78rem', color: '#34D399' }}>({reraScore}%)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Price Verification */}
        <div style={{ background: 'rgba(13, 24, 42, 0.85)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#A0AEC0', fontWeight: 700, letterSpacing: '0.05em' }}>Price Audit Dates</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>
              {withPriceDate} / {societies.length} <span style={{ fontSize: '0.78rem', color: '#D4AF37' }}>({priceScore}%)</span>
            </div>
          </div>
        </div>

        {/* High Confidence Records */}
        <div style={{ background: 'rgba(13, 24, 42, 0.85)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60A5FA' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#A0AEC0', fontWeight: 700, letterSpacing: '0.05em' }}>High Confidence</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>
              {highConfidence} / {societies.length} <span style={{ fontSize: '0.78rem', color: '#60A5FA' }}>({Math.round((highConfidence / total) * 100)}%)</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Filter Tabs & Search Strip ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', background: 'rgba(7,15,30,0.9)', padding: '14px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {[
            { id: 'ALL', label: `All Records (${societies.length})` },
            { id: 'MISSING_RERA', label: `Missing RERA (${societies.length - withRera})` },
            { id: 'MISSING_PRICE_DATE', label: `Missing Price Audit (${societies.length - withPriceDate})` },
            { id: 'MISSING_POSSESSION', label: `Missing Possession (${societies.length - withPossession})` },
            { id: 'LOW_CONFIDENCE', label: 'Low Confidence' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: filterType === tab.id ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.08)',
                background: filterType === tab.id ? 'rgba(212,175,55,0.2)' : 'transparent',
                color: filterType === tab.id ? '#F3E5AB' : '#A0AEC0',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '240px', background: 'rgba(255,255,255,0.04)', padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Search size={14} color="#A0AEC0" />
          <input
            type="text"
            placeholder="Search flagged records..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ background: 'none', border: 'none', color: '#FFF', fontSize: '0.78rem', outline: 'none', width: '100%' }}
          />
        </div>

      </div>

      {/* ── Flagged Records Table ── */}
      <div style={{ overflowX: 'auto', background: 'rgba(10, 18, 34, 0.85)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: '#070F1E', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
              <th style={{ padding: '12px 16px', color: '#D4AF37', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Society / Project</th>
              <th style={{ padding: '12px 16px', color: '#D4AF37', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Location</th>
              <th style={{ padding: '12px 16px', color: '#D4AF37', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>MahaRERA Status</th>
              <th style={{ padding: '12px 16px', color: '#D4AF37', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Price Audit Timestamp</th>
              <th style={{ padding: '12px 16px', color: '#D4AF37', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Possession</th>
              <th style={{ padding: '12px 16px', color: '#D4AF37', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((soc, idx) => {
                const hasRera = soc.reraNumber && soc.reraNumber.trim().length > 0;
                const hasPriceDate = soc.priceLastVerified || soc.lastVerifiedAt;
                const hasPoss = soc.possessionDate && soc.possessionDate.trim().length > 0;

                return (
                  <tr key={soc.id || idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#FFF' }}>{soc.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#A0AEC0' }}>{soc.developer || 'Pride Purple Group'}</div>
                    </td>

                    <td style={{ padding: '14px 16px', color: '#CBD5E1' }}>
                      {soc.hinjewadiPhase ? soc.hinjewadiPhase.replace('_', ' ') : soc.location}
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      {hasRera ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#34D399', fontSize: '0.75rem', fontWeight: 600 }}>
                          <CheckCircle size={13} />
                          <span>{soc.reraNumber}</span>
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#EF4444', fontSize: '0.75rem', fontWeight: 700 }}>
                          <AlertTriangle size={13} />
                          <span>Missing RERA No</span>
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      {hasPriceDate ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#F3E5AB', fontSize: '0.75rem' }}>
                          <Clock size={12} color="#D4AF37" />
                          <span>{soc.priceLastVerified || soc.lastVerifiedAt}</span>
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontSize: '0.75rem', fontWeight: 600 }}>
                          <AlertTriangle size={13} />
                          <span>Audit Date Needed</span>
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '14px 16px', color: hasPoss ? '#E2E8F0' : '#EF4444' }}>
                      {soc.possessionDate || 'Not Specified'}
                    </td>

                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => onEditSociety && onEditSociety(soc)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: 'rgba(212,175,55,0.15)',
                          border: '1px solid rgba(212,175,55,0.4)',
                          color: '#F3E5AB',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <Edit2 size={12} />
                        <span>Verify &amp; Update</span>
                      </button>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#A0AEC0' }}>
                  No records match the selected audit filter. All records are compliant!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
