import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, SlidersHorizontal, MapPin, Building2, ShieldCheck, 
  Sparkles, X, ChevronDown, Check, ArrowRight, RefreshCw, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/apiService';
import { useSEO, SEO_CONFIGS } from '../services/seoService';
import SocietyCard from './SocietyCard';
import CompanyLogo from './CompanyLogo';
import './PropertyIntelligence.css';

export default function PublicSocietiesPage({ onSelectSociety, onBackHome }) {
  // Inject SEO for Societies Directory
  useSEO(SEO_CONFIGS.societies);

  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedBhk, setSelectedBhk] = useState('');
  const [budgetTier, setBudgetTier] = useState('');
  const [selectedDeveloper, setSelectedDeveloper] = useState('');
  const [reraOnly, setReraOnly] = useState(false);
  const [hasResale, setHasResale] = useState(false);
  const [hasRental, setHasRental] = useState(false);
  const [sortBy, setSortBy] = useState('verified_first');
  const [currentPage, setCurrentPage] = useState(0);

  const fetchSocieties = useCallback(async () => {
    setLoading(true);
    try {
      let minBudget = null;
      let maxBudget = null;

      if (budgetTier === 'under_80l') {
        maxBudget = 8000000;
      } else if (budgetTier === '80l_1.5cr') {
        minBudget = 8000000;
        maxBudget = 15000000;
      } else if (budgetTier === '1.5cr_2.5cr') {
        minBudget = 15000000;
        maxBudget = 25000000;
      } else if (budgetTier === 'above_2.5cr') {
        minBudget = 25000000;
      }

      const res = await apiService.getPublicSocieties({
        hinjewadiPhase: selectedPhase || null,
        projectStatus: selectedStatus || null,
        bhkType: selectedBhk || null,
        developer: selectedDeveloper || (searchQuery ? searchQuery : null),
        minBudget,
        maxBudget,
        reraRegistered: reraOnly ? true : null,
        hasResale: hasResale ? true : null,
        hasRental: hasRental ? true : null,
        sortBy,
        page: currentPage,
        size: 18
      });

      const list = res.content || res || [];
      const filtered = searchQuery.trim()
        ? list.filter(s => 
            (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (s.developer && s.developer.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (s.location && s.location.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        : list;

      setSocieties(filtered);
      setTotalCount(res.totalElements || filtered.length);
    } catch (err) {
      console.error('[PublicSocieties] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedPhase, selectedStatus, selectedBhk, budgetTier, selectedDeveloper, reraOnly, hasResale, hasRental, sortBy, currentPage, searchQuery]);

  useEffect(() => {
    fetchSocieties();
  }, [fetchSocieties]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedPhase('');
    setSelectedStatus('');
    setSelectedBhk('');
    setBudgetTier('');
    setSelectedDeveloper('');
    setReraOnly(false);
    setHasResale(false);
    setHasRental(false);
    setSortBy('verified_first');
    setCurrentPage(0);
  };

  return (
    <div className="pi-page-wrapper">
      
      {/* ── Top Header Strip ───────────────────────────────────────────── */}
      <header className="pi-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={onBackHome}>
          <CompanyLogo variant="compact" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.88rem', fontFamily: "'Cinzel', serif", fontWeight: 800, color: '#F3E5AB' }}>
              INTELLIGENCE PORTAL
            </span>
            <span style={{ fontSize: '0.65rem', background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.4)', color: '#D4AF37', padding: '1px 5px', borderRadius: '4px' }}>
              PUNE
            </span>
          </div>
        </div>

        {/* Search Input on Desktop */}
        <div style={{ flex: 1, maxWidth: '420px', margin: '0 20px', position: 'relative' }}>
          <Search size={14} color="#A0AEC0" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search society, builder, or micro-location..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pi-input"
            style={{ paddingLeft: '34px', paddingRight: '34px', fontSize: '0.8rem', height: '38px' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#A0AEC0', cursor: 'pointer' }}>
              ✕
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setShowMobileFilters(true)} className="pi-btn-outline" style={{ display: 'none', padding: '8px 12px' }}>
            <SlidersHorizontal size={14} color="#D4AF37" />
            <span>Filters</span>
          </button>

          <button onClick={onBackHome} className="pi-btn-outline" style={{ padding: '8px 16px', fontSize: '0.78rem' }}>
            Back to Portal
          </button>
        </div>
      </header>

      {/* ── Trust Banner Strip ─────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(90deg, #0C172B 0%, #101F38 50%, #0C172B 100%)', borderBottom: '1px solid var(--pi-border-light)', padding: '10px 16px', textAlign: 'center' }}>
        <div className="pi-container" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '20px', fontSize: '0.78rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34D399' }}>
            <ShieldCheck size={15} />
            <span>MahaRERA Fact-Checked</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F3E5AB' }}>
            <Sparkles size={15} color="#D4AF37" />
            <span>Dynamic Pricing with Audit Timestamps</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60A5FA' }}>
            <Building2 size={15} />
            <span>Direct Developer Advisory Desk</span>
          </div>
        </div>
      </section>

      {/* ── Main Layout: Sidebar Filters + Grid ────────────────────────── */}
      <div className="pi-container" style={{ padding: '32px 24px' }}>
        <div className="pi-grid-12">
          
          {/* ── Desktop Filters Sidebar (Col 3) ─────────────────────────── */}
          <aside className="pi-col-3" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#0D182A', border: '1px solid var(--pi-border)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--pi-border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 800, color: '#FFF' }}>
                  <SlidersHorizontal size={15} color="#D4AF37" />
                  <span>Refine Database</span>
                </div>
                <button onClick={handleResetFilters} style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                  Reset All
                </button>
              </div>

              {/* 1. Hinjewadi Phase Filter */}
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A0AEC0', marginBottom: '8px' }}>
                  Micro-Location / Phase
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[
                    { val: '', label: 'All Hinjewadi & Mahalunge' },
                    { val: 'PHASE_1', label: 'Hinjewadi Phase 1' },
                    { val: 'PHASE_2', label: 'Hinjewadi Phase 2' },
                    { val: 'PHASE_3', label: 'Hinjewadi Phase 3' },
                    { val: 'MAHALUNGE', label: 'Mahalunge IT Corridor' }
                  ].map(item => (
                    <button
                      key={item.val}
                      onClick={() => setSelectedPhase(item.val)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: selectedPhase === item.val ? 'rgba(212,175,55,0.2)' : 'transparent',
                        color: selectedPhase === item.val ? '#F3E5AB' : '#CBD5E1',
                        transition: 'background 0.2s'
                      }}
                    >
                      <span>{item.label}</span>
                      {selectedPhase === item.val && <Check size={13} color="#D4AF37" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Project Status Filter */}
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A0AEC0', marginBottom: '8px' }}>
                  Project Status
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[
                    { val: '', label: 'All Project Stages' },
                    { val: 'READY_TO_MOVE', label: 'Ready to Move' },
                    { val: 'UNDER_CONSTRUCTION', label: 'Under Construction' },
                    { val: 'NEW_LAUNCH', label: 'New Launch (2026)' }
                  ].map(item => (
                    <button
                      key={item.val}
                      onClick={() => setSelectedStatus(item.val)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: selectedStatus === item.val ? 'rgba(212,175,55,0.2)' : 'transparent',
                        color: selectedStatus === item.val ? '#F3E5AB' : '#CBD5E1',
                        transition: 'background 0.2s'
                      }}
                    >
                      <span>{item.label}</span>
                      {selectedStatus === item.val && <Check size={13} color="#D4AF37" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. BHK Configuration */}
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A0AEC0', marginBottom: '8px' }}>
                  Bedrooms / BHK
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {['', '1 BHK', '2 BHK', '3 BHK', '4 BHK'].map(bhk => (
                    <button
                      key={bhk}
                      onClick={() => setSelectedBhk(bhk)}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: selectedBhk === bhk ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)',
                        background: selectedBhk === bhk ? '#D4AF37' : 'rgba(255,255,255,0.03)',
                        color: selectedBhk === bhk ? '#070F1E' : '#CBD5E1'
                      }}
                    >
                      {bhk || 'All BHK'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Budget Range */}
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A0AEC0', marginBottom: '8px' }}>
                  Budget Tier
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[
                    { val: '', label: 'Any Budget' },
                    { val: 'under_80l', label: 'Under ₹80 Lakhs' },
                    { val: '80l_1.5cr', label: '₹80 Lakhs - ₹1.5 Cr' },
                    { val: '1.5cr_2.5cr', label: '₹1.5 Cr - ₹2.5 Cr' },
                    { val: 'above_2.5cr', label: 'Above ₹2.5 Cr (Luxury)' }
                  ].map(b => (
                    <button
                      key={b.val}
                      onClick={() => setBudgetTier(b.val)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: budgetTier === b.val ? 'rgba(212,175,55,0.2)' : 'transparent',
                        color: budgetTier === b.val ? '#F3E5AB' : '#CBD5E1'
                      }}
                    >
                      <span>{b.label}</span>
                      {budgetTier === b.val && <Check size={13} color="#D4AF37" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Checkboxes (MahaRERA only, Resale, Rental) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--pi-border-light)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#CBD5E1', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={reraOnly}
                    onChange={e => setReraOnly(e.target.checked)}
                    style={{ accentColor: '#D4AF37' }}
                  />
                  <span>MahaRERA Registered Only</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#CBD5E1', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={hasResale}
                    onChange={e => setHasResale(e.target.checked)}
                    style={{ accentColor: '#D4AF37' }}
                  />
                  <span>Resale Units Available</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#CBD5E1', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={hasRental}
                    onChange={e => setHasRental(e.target.checked)}
                    style={{ accentColor: '#D4AF37' }}
                  />
                  <span>High Rental Yield Assets</span>
                </label>
              </div>

            </div>
          </aside>

          {/* ── Grid Results (Col 9) ────────────────────────────────────── */}
          <section className="pi-col-9" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Results Header Strip */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', background: '#0D182A', padding: '14px 20px', borderRadius: '12px', border: '1px solid var(--pi-border-light)' }}>
              <div>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFF' }}>
                  {totalCount} Verified Societies
                </span>
                <span style={{ fontSize: '0.78rem', color: '#A0AEC0', marginLeft: '8px' }}>
                  in Hinjewadi Ph 1, 2, 3 &amp; Mahalunge
                </span>
              </div>

              {/* Sorting Select */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: '#A0AEC0' }}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{
                    background: '#091322',
                    border: '1px solid var(--pi-border)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    color: '#F3E5AB',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                >
                  <option value="verified_first">Highest Trust / Verified First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest Possession</option>
                </select>
              </div>
            </div>

            {/* Grid of Society Cards */}
            {loading ? (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid rgba(212,175,55,0.2)', borderTopColor: '#D4AF37', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }} />
                <p style={{ color: '#A0AEC0', fontSize: '0.85rem' }}>Querying property intelligence database...</p>
                <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
              </div>
            ) : societies.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {societies.map((society, i) => (
                  <SocietyCard
                    key={society.id || society.slug || i}
                    society={society}
                    onSelect={(slug) => onSelectSociety && onSelectSociety(slug)}
                  />
                ))}
              </div>
            ) : (
              <div style={{ padding: '60px 20px', textAlign: 'center', background: '#0D182A', borderRadius: '16px', border: '1px solid var(--pi-border-light)' }}>
                <Building2 size={40} color="#D4AF37" style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '1.2rem', color: '#FFF', margin: '0 0 6px 0' }}>No societies match your criteria</h3>
                <p style={{ fontSize: '0.82rem', color: '#A0AEC0', margin: '0 0 16px 0' }}>Try broadening your filter criteria or search query.</p>
                <button onClick={handleResetFilters} className="pi-btn-gold">
                  Reset All Filters
                </button>
              </div>
            )}

          </section>

        </div>
      </div>

    </div>
  );
}
