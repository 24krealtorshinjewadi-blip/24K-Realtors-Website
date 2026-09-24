import React, { useState } from 'react';
import { 
  Search, SlidersHorizontal, X, Check, ShieldCheck, 
  ChevronDown, RotateCcw, Building2, MapPin, IndianRupee, Bed
} from 'lucide-react';

const BUDGET_PRESETS = [
  { id: 'all', label: 'All Budgets', min: '', max: '' },
  { id: 'under-50l', label: 'Upto 50 Lakhs', min: '', max: '5000000' },
  { id: '1cr-1.3cr', label: '1Cr to 1.3Cr', min: '10000000', max: '13000000' },
  { id: '1.3cr-1.8cr', label: '1.3Cr to 1.8Cr', min: '13000000', max: '18000000' },
  { id: 'above-1.8cr', label: '1.8Cr onwards', min: '18000000', max: '' },
];

const BHK_PRESETS = [
  { id: '', label: 'All BHK' },
  { id: '1', label: '1 BHK' },
  { id: '2', label: '2 BHK' },
  { id: '3', label: '3 BHK' },
  { id: '4', label: '4+ BHK' },
  { id: 'SHOP', label: 'Shop' },
  { id: 'SHOWROOM', label: 'Showroom' },
  { id: 'OFFICE', label: 'Office' },
];

export default function AdvancedPropertyFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  totalCount = 0,
  isMobile = false,
  builders = []
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Active budget preset matching
  const currentBudgetPreset = BUDGET_PRESETS.find(
    b => b.min === String(filters.minPrice || '') && b.max === String(filters.maxPrice || '')
  )?.id || (filters.minPrice || filters.maxPrice ? 'custom' : 'all');

  const handleBudgetSelect = (preset) => {
    onFilterChange({
      ...filters,
      minPrice: preset.min,
      maxPrice: preset.max
    });
  };

  const handleBhkSelect = (bhkId) => {
    onFilterChange({
      ...filters,
      bedrooms: bhkId
    });
  };

  const activeFiltersCount = [
    filters.location,
    filters.bedrooms,
    filters.minPrice || filters.maxPrice,
    filters.propertyType,
    filters.transactionType,
    filters.builder,
    filters.furnishingStatus,
    filters.reraOnly,
    filters.hasAerialOnly,
    filters.query
  ].filter(Boolean).length;

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(8, 16, 32, 0.95) 0%, rgba(5, 10, 22, 0.98) 100%)',
      border: '1.5px solid rgba(212, 175, 55, 0.35)',
      borderRadius: '20px',
      padding: isMobile ? '16px 14px' : '20px 24px',
      marginBottom: '24px',
      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(212, 175, 55, 0.12)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      position: 'relative',
      zIndex: 5
    }}>
      {/* ── Top Bar: Search Input + Quick Selects + Filter Toggle ── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        {/* Quick Search Query */}
        <div style={{
          position: 'relative',
          flex: '1 1 240px',
          minWidth: '220px'
        }}>
          <Search size={16} color="#D4AF37" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by project name, developer, or landmark..."
            value={filters.query || ''}
            onChange={(e) => onFilterChange({ ...filters, query: e.target.value })}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '50px',
              padding: '10px 16px 10px 40px',
              color: '#FFFFFF',
              fontSize: '0.84rem',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(212, 175, 55, 0.25)'}
          />
          {filters.query && (
            <button
              onClick={() => onFilterChange({ ...filters, query: '' })}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Location Dropdown */}
        <div style={{ minWidth: '180px', flex: isMobile ? '1 1 100%' : '0 1 auto' }}>
          <select
            value={filters.location || ''}
            onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '50px',
              padding: '10px 16px',
              color: '#F5D77F',
              fontSize: '0.82rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="">📍 All Pune West Micro-Markets</option>
            <optgroup label="Hinjewadi IT Corridors (Metro Line 3)">
              <option value="HINJEWADI_PHASE_1">📍 Hinjewadi Phase 1</option>
              <option value="HINJEWADI_PHASE_2">📍 Hinjewadi Phase 2</option>
              <option value="HINJEWADI_PHASE_3">📍 Hinjewadi Phase 3 (Megapolis)</option>
            </optgroup>
            <optgroup label="Prime Pune West Localities">
              <option value="MAHALUNGE">📍 Mahalunge Smart City</option>
              <option value="WAKAD">📍 Wakad (Phoenix Mall)</option>
              <option value="BANER">📍 Baner High Street</option>
              <option value="BALEWADI">📍 Balewadi Stadium</option>
              <option value="TATHAWADE">📍 Tathawade Expressway</option>
              <option value="KHARADI">📍 Kharadi IT Park</option>
              <option value="RAVET">📍 Ravet</option>
              <option value="PUNEWALE">📍 Punewale</option>
            </optgroup>
          </select>
        </div>

        {/* Toggle Advanced Panel Button */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: showAdvanced ? 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)' : 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '50px',
            padding: '9px 18px',
            color: showAdvanced ? '#040814' : '#F5D77F',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.25s ease'
          }}
        >
          <SlidersHorizontal size={15} />
          <span>Advanced Filters</span>
          {activeFiltersCount > 0 && (
            <span style={{
              background: showAdvanced ? '#040814' : '#D4AF37',
              color: showAdvanced ? '#F5D77F' : '#040814',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.68rem',
              fontWeight: 800
            }}>
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown size={14} style={{ transform: showAdvanced ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </button>
      </div>

      {/* ── Row 2: 99acres-Style Quick BHK & Budget Pills ── */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '14px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '14px'
      }}>
        {/* BHK Quick Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: '35px' }}>
            BHK:
          </span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {BHK_PRESETS.map(bhk => {
              const active = String(filters.bedrooms || '') === bhk.id;
              return (
                <button
                  key={bhk.id}
                  onClick={() => handleBhkSelect(bhk.id)}
                  style={{
                    background: active ? 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 100%)' : 'rgba(255, 255, 255, 0.04)',
                    border: active ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                    color: active ? '#040814' : '#E2E8F0',
                    fontSize: '0.76rem',
                    fontWeight: active ? 800 : 500,
                    padding: '5px 12px',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {bhk.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget Quick Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: '55px' }}>
            Budget:
          </span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', overflowX: 'auto', paddingBottom: '2px' }}>
            {BUDGET_PRESETS.map(preset => {
              const active = currentBudgetPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleBudgetSelect(preset)}
                  style={{
                    background: active ? 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 100%)' : 'rgba(255, 255, 255, 0.04)',
                    border: active ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                    color: active ? '#040814' : '#E2E8F0',
                    fontSize: '0.74rem',
                    fontWeight: active ? 800 : 500,
                    padding: '5px 11px',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Row 3: Collapsible Advanced Filter Drawer (Developers, Buy/Rent, Furnishing, Trust) ── */}
      {showAdvanced && (
        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(212, 175, 55, 0.2)',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          animation: 'fadeIn 0.3s ease'
        }}>
          {/* Developer / Builder Select */}
          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              Developer / Group
            </label>
            <select
              value={filters.builder || ''}
              onChange={(e) => onFilterChange({ ...filters, builder: e.target.value })}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#fff',
                fontSize: '0.80rem',
                outline: 'none'
              }}
            >
              <option value="">All Top Developers</option>
              {builders && builders.length > 0 ? (
                builders.map(b => (
                  <option key={b.id || b.slug} value={b.name}>{b.name}</option>
                ))
              ) : (
                <>
                  <option value="Kolte Patil Developers">Kolte Patil Developers</option>
                  <option value="Shapoorji Pallonji Real Estate">Shapoorji Pallonji</option>
                  <option value="Godrej Properties">Godrej Properties</option>
                  <option value="Paranjape Schemes">Paranjape Schemes</option>
                  <option value="Vilas Javdekar Developers (VJ)">Vilas Javdekar (VJ)</option>
                  <option value="VTP Realty">VTP Realty</option>
                  <option value="Kohinoor Group">Kohinoor Group</option>
                  <option value="Rohan Builders">Rohan Builders</option>
                </>
              )}
            </select>
          </div>

          {/* Property Category */}
          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              Property Type
            </label>
            <select
              value={filters.propertyType || ''}
              onChange={(e) => onFilterChange({ ...filters, propertyType: e.target.value })}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#fff',
                fontSize: '0.80rem',
                outline: 'none'
              }}
            >
              <option value="">All Types</option>
              <option value="RESIDENTIAL">Residential Homes</option>
              <option value="COMMERCIAL">Commercial IT &amp; Retail</option>
            </select>
          </div>

          {/* Transaction Type */}
          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              Purpose
            </label>
            <select
              value={filters.transactionType || ''}
              onChange={(e) => onFilterChange({ ...filters, transactionType: e.target.value })}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#fff',
                fontSize: '0.80rem',
                outline: 'none'
              }}
            >
              <option value="">Buy &amp; Rent</option>
              <option value="BUY">For Sale (Buy)</option>
              <option value="RENT">For Lease (Rent)</option>
            </select>
          </div>

          {/* Furnishing Status */}
          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              Furnishing
            </label>
            <select
              value={filters.furnishingStatus || ''}
              onChange={(e) => onFilterChange({ ...filters, furnishingStatus: e.target.value })}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#fff',
                fontSize: '0.80rem',
                outline: 'none'
              }}
            >
              <option value="">Any Furnishing</option>
              <option value="FURNISHED">Fully Furnished</option>
              <option value="SEMI_FURNISHED">Semi-Furnished</option>
              <option value="UNFURNISHED">Unfurnished</option>
            </select>
          </div>

          {/* Trust Toggles (RERA Verified & Aerial View) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
            <label style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.78rem',
              color: filters.reraOnly ? '#22c55e' : '#A0AEC0',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={Boolean(filters.reraOnly)}
                onChange={(e) => onFilterChange({ ...filters, reraOnly: e.target.checked })}
                style={{ accentColor: '#22c55e' }}
              />
              <ShieldCheck size={16} color={filters.reraOnly ? '#22c55e' : '#D4AF37'} />
              <span>🛡️ MahaRERA Verified Only</span>
            </label>

            <label style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.78rem',
              color: filters.hasAerialOnly ? '#F5D77F' : '#A0AEC0',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={Boolean(filters.hasAerialOnly)}
                onChange={(e) => onFilterChange({ ...filters, hasAerialOnly: e.target.checked })}
                style={{ accentColor: '#D4AF37' }}
              />
              <span>🚁 Authentic Drone / Aerial View Only</span>
            </label>
          </div>
        </div>
      )}

      {/* ── Row 4: Active Badges Strip + Live Counter + Reset ── */}
      {activeFiltersCount > 0 && (
        <div style={{
          marginTop: '14px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.70rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Filters:
            </span>

            {filters.location && (
              <span style={activeChipStyle}>
                📍 {filters.location.replace(/_/g, ' ')}
                <X size={12} onClick={() => onFilterChange({ ...filters, location: '' })} style={{ cursor: 'pointer' }} />
              </span>
            )}
            {filters.bedrooms && (
              <span style={activeChipStyle}>
                🛏️ {filters.bedrooms} BHK
                <X size={12} onClick={() => onFilterChange({ ...filters, bedrooms: '' })} style={{ cursor: 'pointer' }} />
              </span>
            )}
            {(filters.minPrice || filters.maxPrice) && (
              <span style={activeChipStyle}>
                💰 {currentBudgetPreset !== 'custom' ? BUDGET_PRESETS.find(b => b.id === currentBudgetPreset)?.label : 'Custom Budget'}
                <X size={12} onClick={() => onFilterChange({ ...filters, minPrice: '', maxPrice: '' })} style={{ cursor: 'pointer' }} />
              </span>
            )}
            {filters.propertyType && (
              <span style={activeChipStyle}>
                🏢 {filters.propertyType}
                <X size={12} onClick={() => onFilterChange({ ...filters, propertyType: '' })} style={{ cursor: 'pointer' }} />
              </span>
            )}
            {filters.builder && (
              <span style={activeChipStyle}>
                🏗️ {filters.builder}
                <X size={12} onClick={() => onFilterChange({ ...filters, builder: '' })} style={{ cursor: 'pointer' }} />
              </span>
            )}
            {filters.reraOnly && (
              <span style={{ ...activeChipStyle, color: '#22c55e', borderColor: 'rgba(34,197,94,0.4)' }}>
                🛡️ MahaRERA Only
                <X size={12} onClick={() => onFilterChange({ ...filters, reraOnly: false })} style={{ cursor: 'pointer' }} />
              </span>
            )}
            {filters.hasAerialOnly && (
              <span style={{ ...activeChipStyle, color: '#F5D77F' }}>
                🚁 Aerial View
                <X size={12} onClick={() => onFilterChange({ ...filters, hasAerialOnly: false })} style={{ cursor: 'pointer' }} />
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.78rem', color: '#E2E8F0', fontWeight: 600 }}>
              Showing <strong style={{ color: '#F5D77F' }}>{totalCount}</strong> verified residences
            </span>
            <button
              onClick={onResetFilters}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'transparent',
                border: 'none',
                color: '#D4AF37',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              <RotateCcw size={12} />
              Reset All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const activeChipStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  background: 'rgba(212, 175, 55, 0.12)',
  border: '1px solid rgba(212, 175, 55, 0.35)',
  borderRadius: '50px',
  padding: '3px 10px',
  color: '#FFFFFF',
  fontSize: '0.72rem',
  fontWeight: 600
};
