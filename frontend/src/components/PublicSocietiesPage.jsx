import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, SlidersHorizontal, MapPin, Building2, ShieldCheck, 
  Sparkles, X, ChevronDown, Check, ArrowRight, RefreshCw, Layers,
  Phone, Calendar, Star, Award, TrendingUp, Filter, CheckCircle2, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/apiService';
import { useSEO, SEO_CONFIGS } from '../services/seoService';
import SocietyCard from './SocietyCard';
import CompanyLogo from './CompanyLogo';
import './PropertyIntelligence.css';

export default function PublicSocietiesPage({ onSelectSociety, onBackHome }) {
  // Inject SEO for Signature Collection Directory
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
        size: 30
      });

      const list = res.content || res || [];
      const filtered = searchQuery.trim()
        ? list.filter(s => 
            (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (s.canonicalName && s.canonicalName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (s.developer && s.developer.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (s.location && s.location.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        : list;

      setSocieties(filtered);
      setTotalCount(res.totalElements || filtered.length);
    } catch (err) {
      console.error('[SignatureCollection] Fetch error:', err);
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

  const activeFilterCount = [
    selectedPhase, selectedStatus, selectedBhk, budgetTier,
    selectedDeveloper, reraOnly, hasResale, hasRental, searchQuery
  ].filter(Boolean).length;

  return (
    <div className="pi-page-wrapper">
      
      {/* ── Top Header Strip ───────────────────────────────────────────── */}
      <header className="pi-topbar" style={{ height: '65px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={onBackHome}>
          <CompanyLogo variant="compact" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.9rem', fontFamily: "'Cinzel', serif", fontWeight: 800, color: '#F3E5AB', letterSpacing: '0.04em' }}>
              ⚜️ SIGNATURE COLLECTION
            </span>
          </div>
        </div>

        {/* Search Input on Desktop */}
        <div style={{ flex: 1, maxWidth: '440px', margin: '0 20px', position: 'relative' }}>
          <Search size={14} color="#D4AF37" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search society, builder, or micro-location..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pi-input"
            style={{ paddingLeft: '34px', paddingRight: '34px', fontSize: '0.8rem', height: '40px', borderRadius: '50px' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#A0AEC0', cursor: 'pointer' }}>
              ✕
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a
            href="https://wa.me/919673000053?text=Hi%2C%20I%20would%20like%20to%20inquire%20about%2024K%20Signature%20Collection%20properties"
            target="_blank"
            rel="noopener noreferrer"
            className="pi-btn-whatsapp"
            style={{ padding: '8px 14px', fontSize: '0.78rem' }}
          >
            <MessageSquare size={13} />
            <span>VIP Desk</span>
          </a>

          <button onClick={onBackHome} className="pi-btn-outline" style={{ padding: '8px 16px', fontSize: '0.78rem' }}>
            Back to Portal
          </button>
        </div>
      </header>

      {/* ── Luxury Hero Showcase Banner ───────────────────────────────── */}
      <section style={{
        background: 'radial-gradient(ellipse at 50% 20%, #152744 0%, #08101E 70%, #060D1A 100%)',
        borderBottom: '1px solid rgba(212,175,55,0.25)',
        padding: '48px 24px 36px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="pi-container" style={{ maxWidth: '980px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(212,175,55,0.12)',
            border: '1px solid rgba(212,175,55,0.4)',
            borderRadius: '50px',
            padding: '5px 18px',
            marginBottom: '16px'
          }}>
            <Sparkles size={13} color="#D4AF37" />
            <span style={{ color: '#F3E5AB', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              CURATED RESIDENTIAL PORTFOLIO • PUNE WEST
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 0 12px 0',
            letterSpacing: '-0.01em',
            lineHeight: 1.15
          }}>
            ⚜️ Signature Collection
          </h1>

          <p style={{
            color: 'rgba(241, 245, 249, 0.8)',
            fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)',
            lineHeight: 1.6,
            margin: '0 auto 24px auto',
            maxWidth: '780px',
            fontFamily: "'Inter', sans-serif"
          }}>
            Explore Pune&apos;s most prestigious master gated communities, luxury high-rises, and integrated townships in Hinjewadi Phases 1–3, Wakad, Baner &amp; Mahalunge. 100% MahaRERA fact-checked with verified real-time price spectrums.
          </p>

          {/* Key Value Propositions */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '8px'
          }}>
            <div className="pi-hero-chip pi-hero-chip--green" style={{ padding: '6px 14px', fontSize: '0.74rem' }}>
              <ShieldCheck size={13} />
              <span>100% MahaRERA Verified</span>
            </div>
            <div className="pi-hero-chip" style={{ padding: '6px 14px', fontSize: '0.74rem' }}>
              <Award size={13} color="#D4AF37" />
              <span>Zero Brokerage on Developer Sales</span>
            </div>
            <div className="pi-hero-chip pi-hero-chip--white" style={{ padding: '6px 14px', fontSize: '0.74rem' }}>
              <TrendingUp size={13} color="#60A5FA" />
              <span>4.5% – 5.2% Avg Rental Yield</span>
            </div>
            <div className="pi-hero-chip pi-hero-chip--white" style={{ padding: '6px 14px', fontSize: '0.74rem' }}>
              <Calendar size={13} color="#D4AF37" />
              <span>Chauffeur-Driven Site Tours</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Layout: Sidebar Filters + Grid ────────────────────────── */}
      <div className="pi-container" style={{ padding: '36px 24px 80px 24px' }}>
        <div className="pi-two-col" style={{ gridTemplateColumns: '300px 1fr', gap: '32px' }}>
          
          {/* ── Desktop Filters Sidebar (Left) ──────────────────────────── */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              background: 'linear-gradient(145deg, #0D1E38 0%, #0A1628 100%)',
              border: '1px solid var(--pi-border)',
              borderRadius: '16px',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              boxShadow: 'var(--pi-shadow-md)'
            }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid var(--pi-border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 800, color: '#FFF' }}>
                  <Filter size={15} color="#D4AF37" />
                  <span>Refine Collection</span>
                </div>
                {activeFilterCount > 0 && (
                  <button onClick={handleResetFilters} style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}>
                    Reset All ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* 1. Micro-Location / Phase Filter */}
              <div>
                <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A0AEC0', marginBottom: '8px' }}>
                  Location / Phase
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[
                    { val: '', label: 'All Prime Corridors' },
                    { val: 'PHASE_1', label: 'Hinjewadi Phase 1' },
                    { val: 'PHASE_2', label: 'Hinjewadi Phase 2' },
                    { val: 'PHASE_3', label: 'Hinjewadi Phase 3' },
                    { val: 'MAHALUNGE', label: 'Mahalunge IT Hub' }
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
                <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A0AEC0', marginBottom: '8px' }}>
                  Delivery Stage
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[
                    { val: '', label: 'All Stages' },
                    { val: 'READY_TO_MOVE', label: 'Ready to Move' },
                    { val: 'UNDER_CONSTRUCTION', label: 'Under Construction' },
                    { val: 'NEW_LAUNCH', label: 'New Launch' }
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
                <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A0AEC0', marginBottom: '8px' }}>
                  BHK Options
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {['', '1 BHK', '2 BHK', '3 BHK', '4 BHK'].map(bhk => (
                    <button
                      key={bhk}
                      onClick={() => setSelectedBhk(bhk)}
                      style={{
                        padding: '7px 8px',
                        borderRadius: '8px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: selectedBhk === bhk ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)',
                        background: selectedBhk === bhk ? '#D4AF37' : 'rgba(255,255,255,0.03)',
                        color: selectedBhk === bhk ? '#070F1E' : '#CBD5E1',
                        transition: 'all 0.2s'
                      }}
                    >
                      {bhk || 'All BHK'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Budget Range */}
              <div>
                <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A0AEC0', marginBottom: '8px' }}>
                  Budget Tier
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[
                    { val: '', label: 'Any Budget' },
                    { val: 'under_80l', label: 'Under ₹80 Lakhs' },
                    { val: '80l_1.5cr', label: '₹80 Lakhs – ₹1.5 Cr' },
                    { val: '1.5cr_2.5cr', label: '₹1.5 Cr – ₹2.5 Cr' },
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--pi-border-light)' }}>
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

            {/* Private Client Desk Callout */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(6,13,26,0.6) 100%)',
              border: '1px solid var(--pi-gold-border)',
              borderRadius: '14px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <Sparkles size={24} color="#D4AF37" style={{ marginBottom: '8px' }} />
              <h4 style={{ fontFamily: "'Cinzel', serif", color: '#FFF', margin: '0 0 6px 0', fontSize: '0.98rem' }}>
                Private Office Advisory
              </h4>
              <p style={{ fontSize: '0.76rem', color: '#94A3B8', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                Direct developer allotment, pre-launch builder quotes &amp; custom floor plans.
              </p>
              <a
                href="tel:+919673000053"
                className="pi-btn-gold pi-btn-gold--full"
                style={{ fontSize: '0.78rem', padding: '10px' }}
              >
                <Phone size={13} /> +91 96730 00053
              </a>
            </div>
          </aside>

          {/* ── Main Results Section (Right) ────────────────────────────── */}
          <main style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* ── Township Explorer CTA Banner ─────────────────────── */}
            <div className="pi-township-cta-banner">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '6px' }}>
                  <Layers size={15} color="#A78BFA" />
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#A78BFA' }}>
                    NEW: HIERARCHICAL BROWSE
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1rem', color: '#FFF', margin: '0 0 4px 0' }}>
                  🏙️ Browse by Township → Society → BHK
                </h3>
                <p style={{ fontSize: '0.76rem', color: '#64748B', margin: 0 }}>
                  Megapolis Sparkle/Sunway/Splendour · TCG Phase 3 · Life Republic &amp; more — with smart accordion filters
                </p>
              </div>
              <button
                onClick={() => window.location.href = '/townships'}
                className="pi-btn-gold"
                style={{ padding: '10px 20px', fontSize: '0.8rem', whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                <ArrowRight size={14} style={{ marginRight: '6px' }} />
                Township Explorer
              </button>
            </div>

            {/* Results Header Strip */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              background: '#0B1628',
              padding: '16px 22px',
              borderRadius: '14px',
              border: '1px solid var(--pi-border-light)'
            }}>
              <div>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#FFF', fontFamily: "'Cinzel', serif" }}>
                  {totalCount} Verified Signature Societies
                </span>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8', marginLeft: '8px' }}>
                  in Hinjewadi, Wakad &amp; Baner
                </span>
              </div>

              {/* Sorting Select */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{
                    background: '#070E1B',
                    border: '1px solid var(--pi-border)',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    color: '#F3E5AB',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="verified_first">Highest Trust / Verified First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest Possession</option>
                </select>
              </div>
            </div>

            {/* Active Filter Chips Bar */}
            {activeFilterCount > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                  Active Filters:
                </span>
                {selectedPhase && (
                  <span className="pi-badge pi-badge-gold">
                    Phase: {selectedPhase.replace('_', ' ')}
                    <X size={11} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setSelectedPhase('')} />
                  </span>
                )}
                {selectedStatus && (
                  <span className="pi-badge pi-badge-green">
                    {selectedStatus.replace('_', ' ')}
                    <X size={11} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setSelectedStatus('')} />
                  </span>
                )}
                {selectedBhk && (
                  <span className="pi-badge pi-badge-blue">
                    {selectedBhk}
                    <X size={11} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setSelectedBhk('')} />
                  </span>
                )}
                {budgetTier && (
                  <span className="pi-badge pi-badge-gold">
                    Budget Filter
                    <X size={11} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setBudgetTier('')} />
                  </span>
                )}
                {searchQuery && (
                  <span className="pi-badge pi-badge-blue">
                    &quot;{searchQuery}&quot;
                    <X size={11} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => setSearchQuery('')} />
                  </span>
                )}
                <button
                  onClick={handleResetFilters}
                  style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Grid of Society Cards */}
            {loading ? (
              <div style={{ padding: '80px 20px', textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid rgba(212,175,55,0.2)', borderTopColor: '#D4AF37', animation: 'spin 1s linear infinite', margin: '0 auto 16px auto' }} />
                <p style={{ color: '#94A3B8', fontSize: '0.88rem' }}>Querying verified Signature Collection database...</p>
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
              <div style={{ padding: '60px 20px', textAlign: 'center', background: '#0B1628', borderRadius: '16px', border: '1px solid var(--pi-border-light)' }}>
                <Building2 size={44} color="#D4AF37" style={{ margin: '0 auto 14px auto' }} />
                <h3 style={{ fontSize: '1.25rem', color: '#FFF', margin: '0 0 8px 0', fontFamily: "'Cinzel', serif" }}>
                  No societies match your criteria
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#94A3B8', margin: '0 0 20px 0' }}>
                  Try resetting your filters or search for another builder / project.
                </p>
                <button onClick={handleResetFilters} className="pi-btn-gold">
                  Reset All Filters
                </button>
              </div>
            )}

            {/* ── Bespoke VIP Site Tour Callout ─────────────────────────── */}
            <div style={{
              marginTop: '24px',
              background: 'linear-gradient(135deg, #0E203C 0%, #07101F 100%)',
              border: '1px solid var(--pi-gold-border)',
              borderRadius: '16px',
              padding: '28px 32px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D4AF37', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                  <Sparkles size={14} />
                  <span>Looking for Off-Market Inventory?</span>
                </div>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.3rem', color: '#FFFFFF', margin: '0 0 6px 0' }}>
                  Request Bespoke Private Site Tour &amp; Pre-Launch Allotments
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.84rem', margin: 0, maxWidth: '650px' }}>
                  Our Hinjewadi Specialist Desk arranges private chauffeur-driven walkthroughs, Vastu evaluations, and direct developer pricing with zero brokerage.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href="https://wa.me/919673000053?text=Hi%2C%20I%20want%20to%20book%20a%20private%20site%20visit%20for%20Signature%20Collection%20properties"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pi-btn-whatsapp"
                  style={{ padding: '12px 20px', fontSize: '0.82rem' }}
                >
                  <MessageSquare size={15} /> WhatsApp Desk
                </a>
                <a
                  href="tel:+919673000053"
                  className="pi-btn-gold"
                  style={{ padding: '12px 20px', fontSize: '0.82rem' }}
                >
                  <Phone size={15} /> +91 96730 00053
                </a>
              </div>
            </div>

          </main>

        </div>
      </div>

    </div>
  );
}
