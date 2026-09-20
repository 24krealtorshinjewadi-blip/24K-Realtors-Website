/**
 * MegapolisSocietyListingsPage.jsx — 24K Realtors
 * ─────────────────────────────────────────────────────────────────
 * Level-3 of the Property Hierarchy:
 *   /townships/megapolis/:societyId
 *
 * Dual-panel layout:
 *   LEFT  → Advanced Filter Sidebar (sticky, collapsible sections)
 *           Filters: Society, BHK, Budget, Carpet Area, Furnishing,
 *                    View Type, Floor Range, Status
 *   RIGHT → Listing count bar + Auto-updating unit cards grid
 *
 * Data: apiService.getPublicInventory({ societySlug }) with mock fallback
 *
 * Branch: feature/township-filter-ui
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal, ChevronDown, Check, RefreshCw, X,
  MapPin, Home, Layers, Eye, IndianRupee, Building2, ShieldCheck,
  ArrowUpRight, MessageCircle, ChevronRight, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/apiService';
import { useSEO } from '../services/seoService';
import CompanyLogo from './CompanyLogo';
import UnitListingCard from './UnitListingCard';
import { MEGAPOLIS_SOCIETIES } from './MegapolisTownshipPage';
import './PropertyIntelligence.css';

/* ══════════════════════════════════════════════════════════════════
   MOCK INVENTORY FALLBACK DATA
   Shown when backend is offline — realistic Megapolis unit listings.
══════════════════════════════════════════════════════════════════ */
function buildMockUnits(societyId) {
  const soc = MEGAPOLIS_SOCIETIES.find(s => s.id === societyId) || MEGAPOLIS_SOCIETIES[0];

  const BHK_SPECS = {
    '1 BHK':   { carpet: [440, 490, 510], builtUp: 620, basePrice: 6800000,  psf: 13800 },
    '2 BHK':   { carpet: [645, 695, 730], builtUp: 920, basePrice: 9500000,  psf: 14000 },
    '2.5 BHK': { carpet: [800, 850, 880], builtUp: 1100, basePrice: 12500000, psf: 14800 },
    '3 BHK':   { carpet: [990, 1050, 1100], builtUp: 1380, basePrice: 16000000, psf: 15500 },
    '3.5 BHK': { carpet: [1200, 1250, 1300], builtUp: 1650, basePrice: 19500000, psf: 16000 },
  };

  const VIEWS    = ['Pool View', 'Garden View', 'City View', 'Open View'];
  const FURNISH  = ['Unfurnished', 'Semi-Furnished', 'Furnished'];
  const STATUSES = ['AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'RESALE', 'AVAILABLE', 'BOOKED'];
  const TOWERS   = ['A', 'B', 'C', 'D', 'E', 'F'];

  const units = [];
  let idx = 1;

  soc.bhkOptions.forEach(bhk => {
    const spec = BHK_SPECS[bhk] || BHK_SPECS['2 BHK'];
    const count = bhk === '2 BHK' ? 8 : bhk === '3 BHK' ? 6 : 4;
    for (let i = 0; i < count; i++) {
      const carpet = spec.carpet[i % spec.carpet.length];
      const price  = Math.round(spec.basePrice * (1 + (i % 3) * 0.04));
      const tower  = TOWERS[i % TOWERS.length];
      const floor  = 3 + (i % 18);
      const furnish = FURNISH[i % FURNISH.length];
      const view    = VIEWS[i % VIEWS.length];
      const status  = STATUSES[i % STATUSES.length];

      units.push({
        id: `mock-${soc.id}-${bhk.replace(/\s/g, '')}-${idx++}`,
        bhkType: bhk,
        societySlug: soc.id,
        societyName: soc.displayName,
        carpetAreaSqft: carpet,
        builtUpAreaSqft: spec.builtUp,
        totalPrice: price,
        tower,
        floorNumber: floor,
        furnishingStatus: furnish,
        viewType: view,
        availabilityStatus: status,
        reraNumber: soc.reraNumber,
        imageUrl: soc.imageUrl,
        possessionDate: soc.possession,
        isMock: true,
      });
    }
  });

  return units;
}

/* ── Budget Formatter ─────────────────────────────────────────────── */
function fmtBudget(val) {
  if (!val) return 'Any';
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000)   return `₹${Math.round(val / 100000)} L`;
  return `₹${val.toLocaleString('en-IN')}`;
}
const BUDGET_MIN = 3000000;
const BUDGET_MAX = 30000000;

/* ── Collapsible Filter Section ──────────────────────────────────── */
function FilterSection({ label, icon, isOpen, onToggle, badge, children }) {
  return (
    <div className="pi-adv-filter-section">
      <button
        className="pi-adv-filter-section__trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`fs-${label}`}
      >
        <div className="pi-adv-filter-section__label">
          {icon}
          <span>{label}</span>
          {badge > 0 && <span className="pi-adv-filter-section__badge">{badge}</span>}
        </div>
        <ChevronDown size={14} className={`pi-adv-filter-section__chevron${isOpen ? ' open' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`fs-${label}`}
            className="pi-adv-filter-section__body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function MegapolisSocietyListingsPage({ onBack }) {
  const { societyId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  /* ── Find current society config ─────────────────────────────── */
  const currentSociety = MEGAPOLIS_SOCIETIES.find(s => s.id === societyId)
    || MEGAPOLIS_SOCIETIES[0];

  useSEO({
    title: `Megapolis ${currentSociety.displayName} — 2BHK 3BHK Properties | 24K Realtors Hinjewadi`,
    description: `Browse ${currentSociety.bhkOptions.join(', ')} apartments at Megapolis ${currentSociety.displayName}, Hinjewadi Phase 3. Carpet: ${currentSociety.carpetRange}. Price: ${currentSociety.priceRange}. MahaRERA: ${currentSociety.reraNumber}.`,
    canonical: `https://24krealtors.in/townships/megapolis/${societyId}`
  });

  /* ── State: Data ───────────────────────────────────────────────── */
  const [allUnits, setAllUnits]   = useState([]);
  const [loading, setLoading]     = useState(true);

  /* ── State: Filters ────────────────────────────────────────────── */
  const [selectedSocieties, setSelectedSocieties] = useState(
    societyId ? [societyId] : []
  );
  const [selectedBhk, setSelectedBhk]       = useState(searchParams.get('bhk') || '');
  const [maxBudget, setMaxBudget]           = useState(BUDGET_MAX);
  const [carpetMin, setCarpetMin]           = useState('');
  const [carpetMax, setCarpetMax]           = useState('');
  const [furnishing, setFurnishing]         = useState('');
  const [viewType, setViewType]             = useState('');
  const [floorMin, setFloorMin]             = useState('');
  const [floorMax, setFloorMax]             = useState('');
  const [statusFilter, setStatusFilter]     = useState('');
  const [sortBy, setSortBy]                 = useState('price_asc');

  /* ── State: UI ─────────────────────────────────────────────────── */
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [openSections, setOpenSections]     = useState({
    society: true, bhk: true, budget: false,
    carpet: false, furnishing: false, view: false, floor: false, status: false
  });
  const sliderRef = useRef(null);

  /* ── Sync budget slider CSS fill ──────────────────────────────── */
  useEffect(() => {
    if (sliderRef.current) {
      const pct = ((maxBudget - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;
      sliderRef.current.style.setProperty('--val', `${pct}%`);
    }
  }, [maxBudget]);

  /* ── Sync URL params ───────────────────────────────────────────── */
  useEffect(() => {
    const p = {};
    if (selectedBhk) p.bhk = selectedBhk;
    if (furnishing)  p.furnishing = furnishing;
    if (viewType)    p.view = viewType;
    setSearchParams(p, { replace: true });
  }, [selectedBhk, furnishing, viewType]);

  /* ── Fetch Units ───────────────────────────────────────────────── */
  const fetchUnits = useCallback(async () => {
    setLoading(true);
    try {
      // Build list of society slugs to query
      const slugsToQuery = selectedSocieties.length > 0
        ? selectedSocieties
        : MEGAPOLIS_SOCIETIES.map(s => s.id);

      // Attempt live API for each society
      const results = await Promise.allSettled(
        slugsToQuery.map(slug =>
          apiService.getPublicInventory({
            societySlug: slug,
            hinjewadiPhase: 'PHASE_3',
            bhkType: selectedBhk || null,
            maxPrice: maxBudget < BUDGET_MAX ? maxBudget : null,
            page: 0,
            size: 100
          })
        )
      );

      let combined = [];
      let gotRealData = false;

      results.forEach((r, i) => {
        if (r.status === 'fulfilled') {
          const content = r.value?.content || r.value || [];
          if (Array.isArray(content) && content.length > 0) {
            gotRealData = true;
            combined = [...combined, ...content];
          }
        }
      });

      if (!gotRealData) {
        // Build mock for each selected or all societies
        combined = slugsToQuery.flatMap(slug => buildMockUnits(slug));
      }

      setAllUnits(combined);
    } catch (err) {
      console.error('[MegapolisListings] Fetch error:', err);
      // On total failure, use mock data
      const mockSlugs = selectedSocieties.length > 0
        ? selectedSocieties
        : MEGAPOLIS_SOCIETIES.map(s => s.id);
      setAllUnits(mockSlugs.flatMap(slug => buildMockUnits(slug)));
    } finally {
      setLoading(false);
    }
  }, [selectedSocieties, selectedBhk, maxBudget]);

  useEffect(() => { fetchUnits(); }, [fetchUnits]);

  /* ── Client-side filtering + sorting ─────────────────────────── */
  const filteredUnits = useMemo(() => {
    let list = [...allUnits];

    // Society filter
    if (selectedSocieties.length > 0) {
      list = list.filter(u => {
        const slug = (u.societySlug || u.society || '').toLowerCase();
        return selectedSocieties.some(s => slug.includes(s.toLowerCase()));
      });
    }

    // BHK filter
    if (selectedBhk) {
      list = list.filter(u => {
        const b = (u.bhkType || u.bhk || '').trim().toLowerCase();
        return b === selectedBhk.toLowerCase();
      });
    }

    // Budget
    if (maxBudget < BUDGET_MAX) {
      list = list.filter(u => {
        const p = Number(String(u.totalPrice || u.price || 0).replace(/[^0-9]/g, ''));
        return !p || p <= maxBudget;
      });
    }

    // Carpet
    if (carpetMin) {
      list = list.filter(u => (u.carpetAreaSqft || 0) >= Number(carpetMin));
    }
    if (carpetMax) {
      list = list.filter(u => (u.carpetAreaSqft || 9999) <= Number(carpetMax));
    }

    // Furnishing
    if (furnishing) {
      list = list.filter(u => {
        const f = (u.furnishingStatus || u.furnishing || '').toLowerCase();
        return f.includes(furnishing.toLowerCase());
      });
    }

    // View
    if (viewType) {
      list = list.filter(u => {
        const v = (u.viewType || u.view || '').toLowerCase();
        return v.includes(viewType.toLowerCase());
      });
    }

    // Floor
    if (floorMin) list = list.filter(u => (u.floorNumber || 0) >= Number(floorMin));
    if (floorMax) list = list.filter(u => (u.floorNumber || 99) <= Number(floorMax));

    // Status
    if (statusFilter) {
      list = list.filter(u => {
        const s = (u.availabilityStatus || u.status || '').toUpperCase();
        return s.includes(statusFilter.toUpperCase());
      });
    }

    // Sort
    list.sort((a, b) => {
      const pa = Number(String(a.totalPrice || a.price || 0).replace(/[^0-9]/g, ''));
      const pb = Number(String(b.totalPrice || b.price || 0).replace(/[^0-9]/g, ''));
      const ca = Number(a.carpetAreaSqft || 0);
      const cb = Number(b.carpetAreaSqft || 0);
      switch (sortBy) {
        case 'price_asc':  return pa - pb;
        case 'price_desc': return pb - pa;
        case 'carpet_asc': return ca - cb;
        case 'carpet_desc': return cb - ca;
        default: return 0;
      }
    });

    return list;
  }, [allUnits, selectedSocieties, selectedBhk, maxBudget, carpetMin, carpetMax, furnishing, viewType, floorMin, floorMax, statusFilter, sortBy]);

  /* ── Helpers ──────────────────────────────────────────────────── */
  const toggleSection = key => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  const toggleSociety = slug => {
    setSelectedSocieties(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const handleReset = () => {
    setSelectedSocieties(societyId ? [societyId] : []);
    setSelectedBhk('');
    setMaxBudget(BUDGET_MAX);
    setCarpetMin('');
    setCarpetMax('');
    setFurnishing('');
    setViewType('');
    setFloorMin('');
    setFloorMax('');
    setStatusFilter('');
    setSortBy('price_asc');
    setSearchParams({});
  };

  const activeFilterCount = [
    selectedBhk,
    furnishing,
    viewType,
    statusFilter,
    carpetMin,
    carpetMax,
    floorMin,
    floorMax,
    maxBudget < BUDGET_MAX,
    selectedSocieties.length > 1 || (selectedSocieties.length === 1 && selectedSocieties[0] !== societyId)
  ].filter(Boolean).length;

  const handleBack = () => {
    if (onBack) onBack();
    else navigate('/townships/megapolis');
  };

  /* ── Collect unique BHK options across selected societies ──────── */
  const availableBhk = useMemo(() => {
    const set = new Set();
    MEGAPOLIS_SOCIETIES.forEach(s => {
      if (!selectedSocieties.length || selectedSocieties.includes(s.id)) {
        s.bhkOptions.forEach(b => set.add(b));
      }
    });
    return Array.from(set).sort();
  }, [selectedSocieties]);

  /* ══════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════ */
  return (
    <div className="pi-page-wrapper">

      {/* ── TOPBAR ─────────────────────────────────────────────────── */}
      <header className="pi-topbar" style={{ height: '64px' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
          onClick={handleBack}
        >
          <CompanyLogo variant="compact" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <span style={{ fontSize: '0.64rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
              Megapolis Township
            </span>
            <span style={{ fontSize: '0.88rem', fontFamily: "'Cinzel', serif", fontWeight: 800, color: '#F3E5AB', letterSpacing: '0.03em' }}>
              {currentSociety.displayName}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a
            href={`https://wa.me/919673000053?text=Hi%2024K%20Realtors%2C%20I%20want%20to%20explore%20Megapolis%20${encodeURIComponent(currentSociety.displayName)}%20properties`}
            target="_blank"
            rel="noopener noreferrer"
            className="pi-btn-whatsapp"
            style={{ padding: '8px 14px', fontSize: '0.78rem' }}
          >
            <span>VIP Desk</span>
          </a>
          <button onClick={handleBack} className="pi-btn-outline" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>
            <Home size={13} />
            <span style={{ marginLeft: '4px' }}>Megapolis</span>
          </button>
        </div>
      </header>

      {/* ── BREADCRUMB ──────────────────────────────────────────────── */}
      <nav className="pi-breadcrumb-nav" aria-label="Breadcrumb">
        <span className="pi-breadcrumb-item" onClick={() => navigate('/')}>Home</span>
        <ChevronRight size={12} className="pi-breadcrumb-sep" />
        <span className="pi-breadcrumb-item" onClick={() => navigate('/townships')}>Properties</span>
        <ChevronRight size={12} className="pi-breadcrumb-sep" />
        <span className="pi-breadcrumb-item" onClick={() => navigate('/townships/megapolis')}>Megapolis Township</span>
        <ChevronRight size={12} className="pi-breadcrumb-sep" />
        <span className="pi-breadcrumb-item active">{currentSociety.displayName}</span>
      </nav>

      {/* ── DUAL PANEL LAYOUT ───────────────────────────────────────── */}
      <div className="pi-dual-panel">

        {/* ══ LEFT SIDEBAR FILTER ══════════════════════════════════════ */}
        {/* Mobile overlay */}
        <div
          className={`pi-adv-filter-overlay${mobileFilterOpen ? ' open' : ''}`}
          onClick={() => setMobileFilterOpen(false)}
          aria-hidden="true"
        />

        <aside className={`pi-adv-filter-sidebar${mobileFilterOpen ? ' open' : ''}`} role="search" aria-label="Filter listings">

          {/* Sidebar Header */}
          <div className="pi-adv-filter-header">
            <div className="pi-adv-filter-title">
              <SlidersHorizontal size={15} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="pi-adv-filter-section__badge">{activeFilterCount}</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {activeFilterCount > 0 && (
                <button className="pi-adv-filter-reset" onClick={handleReset}>
                  <RefreshCw size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  Reset
                </button>
              )}
              <button
                className="pi-adv-filter-reset"
                onClick={() => setMobileFilterOpen(false)}
                style={{ display: 'none' }}
                aria-label="Close filters"
                id="filter-close-btn"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* ─ 1. SOCIETY ──────────────────────────────────────────── */}
          <FilterSection
            label="Society"
            icon={<Building2 size={13} color="#D4AF37" />}
            isOpen={openSections.society}
            onToggle={() => toggleSection('society')}
            badge={selectedSocieties.length > 0 ? selectedSocieties.length : 0}
          >
            {MEGAPOLIS_SOCIETIES.map(s => {
              const isActive = selectedSocieties.includes(s.id);
              return (
                <button
                  key={s.id}
                  className={`pi-adv-filter-option${isActive ? ' active' : ''}`}
                  onClick={() => toggleSociety(s.id)}
                >
                  <span>{s.displayName}</span>
                  {isActive && <Check size={13} color="#D4AF37" />}
                </button>
              );
            })}
          </FilterSection>

          {/* ─ 2. BHK CONFIG ──────────────────────────────────────── */}
          <FilterSection
            label="BHK Configuration"
            icon={<Home size={13} color="#D4AF37" />}
            isOpen={openSections.bhk}
            onToggle={() => toggleSection('bhk')}
            badge={selectedBhk ? 1 : 0}
          >
            <div className="pi-adv-bhk-chips">
              {['', ...availableBhk].map(bhk => (
                <button
                  key={bhk || 'all'}
                  className={`pi-adv-bhk-chip${selectedBhk === bhk ? ' active' : ''}`}
                  onClick={() => setSelectedBhk(bhk)}
                  aria-pressed={selectedBhk === bhk}
                >
                  {bhk || 'All'}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* ─ 3. BUDGET ──────────────────────────────────────────── */}
          <FilterSection
            label="Budget"
            icon={<IndianRupee size={13} color="#D4AF37" />}
            isOpen={openSections.budget}
            onToggle={() => toggleSection('budget')}
            badge={maxBudget < BUDGET_MAX ? 1 : 0}
          >
            <div className="pi-adv-budget-wrap">
              <div className="pi-adv-budget-val">
                Up to {fmtBudget(maxBudget)}{maxBudget >= BUDGET_MAX && ' (Any)'}
              </div>
              <input
                ref={sliderRef}
                type="range"
                className="pi-adv-budget-slider"
                min={BUDGET_MIN}
                max={BUDGET_MAX}
                step={500000}
                value={maxBudget}
                onChange={e => setMaxBudget(Number(e.target.value))}
                aria-label="Maximum budget"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: '#475569', marginTop: '6px' }}>
                <span>{fmtBudget(BUDGET_MIN)}</span>
                <span>{fmtBudget(BUDGET_MAX)}+</span>
              </div>
            </div>
          </FilterSection>

          {/* ─ 4. CARPET AREA ─────────────────────────────────────── */}
          <FilterSection
            label="Carpet Area (sqft)"
            icon={<Layers size={13} color="#D4AF37" />}
            isOpen={openSections.carpet}
            onToggle={() => toggleSection('carpet')}
            badge={(carpetMin || carpetMax) ? 1 : 0}
          >
            <div className="pi-carpet-range">
              <input
                type="number"
                placeholder="Min sqft"
                value={carpetMin}
                onChange={e => setCarpetMin(e.target.value)}
                className="pi-carpet-input"
                min={0}
                aria-label="Minimum carpet area"
              />
              <input
                type="number"
                placeholder="Max sqft"
                value={carpetMax}
                onChange={e => setCarpetMax(e.target.value)}
                className="pi-carpet-input"
                min={0}
                aria-label="Maximum carpet area"
              />
            </div>
          </FilterSection>

          {/* ─ 5. FURNISHING ──────────────────────────────────────── */}
          <FilterSection
            label="Furnishing"
            icon={<Home size={13} color="#D4AF37" />}
            isOpen={openSections.furnishing}
            onToggle={() => toggleSection('furnishing')}
            badge={furnishing ? 1 : 0}
          >
            {['', 'Furnished', 'Semi', 'Unfurnished'].map(f => (
              <button
                key={f || 'any'}
                className={`pi-adv-filter-option${furnishing === f ? ' active' : ''}`}
                onClick={() => setFurnishing(f)}
              >
                <span>{f || 'Any'}</span>
                {furnishing === f && f && <Check size={13} color="#D4AF37" />}
              </button>
            ))}
          </FilterSection>

          {/* ─ 6. VIEW TYPE ───────────────────────────────────────── */}
          <FilterSection
            label="View Type"
            icon={<Eye size={13} color="#D4AF37" />}
            isOpen={openSections.view}
            onToggle={() => toggleSection('view')}
            badge={viewType ? 1 : 0}
          >
            {['', 'Pool', 'Garden', 'City', 'Open'].map(v => (
              <button
                key={v || 'any'}
                className={`pi-adv-filter-option${viewType === v ? ' active' : ''}`}
                onClick={() => setViewType(v)}
              >
                <span>{v || 'Any View'}</span>
                {viewType === v && v && <Check size={13} color="#D4AF37" />}
              </button>
            ))}
          </FilterSection>

          {/* ─ 7. FLOOR RANGE ─────────────────────────────────────── */}
          <FilterSection
            label="Floor Range"
            icon={<Layers size={13} color="#D4AF37" />}
            isOpen={openSections.floor}
            onToggle={() => toggleSection('floor')}
            badge={(floorMin || floorMax) ? 1 : 0}
          >
            <div className="pi-carpet-range">
              <input
                type="number"
                placeholder="Min floor"
                value={floorMin}
                onChange={e => setFloorMin(e.target.value)}
                className="pi-carpet-input"
                min={0} max={40}
                aria-label="Minimum floor"
              />
              <input
                type="number"
                placeholder="Max floor"
                value={floorMax}
                onChange={e => setFloorMax(e.target.value)}
                className="pi-carpet-input"
                min={0} max={40}
                aria-label="Maximum floor"
              />
            </div>
          </FilterSection>

          {/* ─ 8. STATUS ──────────────────────────────────────────── */}
          <FilterSection
            label="Availability"
            icon={<ShieldCheck size={13} color="#D4AF37" />}
            isOpen={openSections.status}
            onToggle={() => toggleSection('status')}
            badge={statusFilter ? 1 : 0}
          >
            {[
              { val: '', label: 'All Units' },
              { val: 'AVAILABLE', label: 'New Sale' },
              { val: 'RESALE', label: 'Resale' },
              { val: 'RENT', label: 'Rental' },
            ].map(item => (
              <button
                key={item.val || 'all'}
                className={`pi-adv-filter-option${statusFilter === item.val ? ' active' : ''}`}
                onClick={() => setStatusFilter(item.val)}
              >
                <span>{item.label}</span>
                {statusFilter === item.val && item.val && <Check size={13} color="#D4AF37" />}
              </button>
            ))}
          </FilterSection>

          {/* Bottom Advisory */}
          <div className="pi-advisory-box" style={{ margin: '20px 0 0' }}>
            <div style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 700, marginBottom: '4px' }}>
              📞 Need Help Choosing?
            </div>
            <div style={{ fontSize: '0.68rem', color: '#64748B', marginBottom: '10px', lineHeight: 1.5 }}>
              Our Megapolis specialists will shortlist the best units based on your budget & preferences.
            </div>
            <a
              href="https://wa.me/919673000053?text=Hi%2024K%20Realtors%2C%20please%20help%20me%20shortlist%20units%20in%20Megapolis"
              target="_blank"
              rel="noopener noreferrer"
              className="pi-btn-whatsapp"
              style={{ fontSize: '0.72rem', padding: '7px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
            >
              <MessageCircle size={12} />
              <span>Get Free Shortlist</span>
            </a>
          </div>
        </aside>

        {/* ══ RIGHT LISTINGS AREA ══════════════════════════════════════ */}
        <div className="pi-listings-area">

          {/* Listings Topbar */}
          <div className="pi-listings-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              {/* Mobile filter toggle */}
              <button
                className="pi-mobile-filter-btn"
                onClick={() => setMobileFilterOpen(true)}
                aria-label="Open filters"
              >
                <Filter size={14} />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span style={{ background: '#D4AF37', color: '#09111F', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="pi-listings-count">
                <span>{loading ? '—' : filteredUnits.length}</span>
                {loading ? 'Loading...' : `${filteredUnits.length === 1 ? 'Property' : 'Properties'} Found`}
                {!loading && allUnits.some(u => u.isMock) && (
                  <span style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 400, marginLeft: '4px' }}>
                    (Sample data)
                  </span>
                )}
              </div>
            </div>

            <select
              className="pi-listings-sort"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              aria-label="Sort listings"
            >
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="carpet_asc">Carpet: Small to Large</option>
              <option value="carpet_desc">Carpet: Large to Small</option>
            </select>
          </div>

          {/* Listings Grid */}
          {loading ? (
            <div className="pi-listings-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="pi-unit-skeleton">
                  <div className="pi-skeleton-shimmer" />
                </div>
              ))}
            </div>
          ) : filteredUnits.length === 0 ? (
            <div className="pi-listings-empty">
              <div className="pi-listings-empty__icon">🔍</div>
              <div className="pi-listings-empty__title">No Listings Match Your Filters</div>
              <div className="pi-listings-empty__sub">
                Try adjusting your BHK type, budget, or carpet area filters. Or reset all filters to see all available units.
              </div>
              <button className="pi-adv-filter-reset" style={{ padding: '10px 20px', fontSize: '0.8rem' }} onClick={handleReset}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="pi-listings-grid">
              <AnimatePresence mode="wait">
                {filteredUnits.map((unit, i) => (
                  <UnitListingCard
                    key={unit.id || `unit-${i}`}
                    unit={unit}
                    societyName={
                      MEGAPOLIS_SOCIETIES.find(s => s.id === (unit.societySlug || unit.society))?.displayName
                      || currentSociety.displayName
                    }
                    index={i}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
