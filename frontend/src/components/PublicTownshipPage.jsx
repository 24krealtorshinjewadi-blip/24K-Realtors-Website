/**
 * PublicTownshipPage.jsx — 24K Realtors
 * ─────────────────────────────────────────────────────────────────────────
 * Premium Township-Aware Property Discovery System
 *
 * Architecture:
 *   Left Sidebar  → Phase selector → Township accordion → BHK chips → Budget → Status toggles
 *   Main Content  → Township-grouped society cards OR flat grid
 *   URL Params    → ?phase=PHASE_3&township=megapolis&bhk=2BHK (shareable links)
 *
 * No new API needed — reuses /api/public/societies with existing filters.
 * Client-side grouping by developer/parentProjectId.
 *
 * Branch: feature/township-filter-ui
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search, Filter, X, ChevronDown, Check, MapPin,
  Building2, Phone, MessageSquare, Sparkles, ShieldCheck,
  Award, TrendingUp, ArrowRight, Layers, Grid3x3,
  LayoutList, RefreshCw, SlidersHorizontal, Calendar,
  Star, IndianRupee, Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/apiService';
import { useSEO } from '../services/seoService';
import SocietyCard from './SocietyCard';
import CompanyLogo from './CompanyLogo';
import './PropertyIntelligence.css';

/* ═══════════════════════════════════════════════════════════════════
   STATIC TOWNSHIP CONFIGURATION MAP
   Maps developer names → township groups with curated metadata.
   Updated when new townships are added to the portal.
═══════════════════════════════════════════════════════════════════ */
const TOWNSHIP_CONFIG = [
  {
    id: 'megapolis',
    displayName: 'Megapolis',
    developer: 'Pride Purple',
    phase: 'PHASE_3',
    location: 'Hinjewadi Phase 3',
    totalAcres: '142+',
    bhkOptions: ['1 BHK', '2 BHK', '3 BHK'],
    subSocieties: ['Sparkle', 'Sunway', 'Splendour', 'Mystic', 'Sangria'],
    priceRange: '₹65L – ₹1.85Cr',
    icon: '🏙️',
    accentHex: '#7C3AED',
    description: 'Pune\'s largest integrated township with 5 distinct society clusters across 142 acres.'
  },
  {
    id: 'tcg-phase-3',
    displayName: 'TCG Phase 3',
    developer: 'TCG',
    phase: 'PHASE_3',
    location: 'Hinjewadi Phase 3',
    bhkOptions: ['1 BHK', '2 BHK', '3 BHK'],
    subSocieties: [],
    priceRange: '₹72L – ₹1.65Cr',
    icon: '🏢',
    accentHex: '#10B981',
    description: 'Premium gated towers with modern specifications in Hinjewadi Phase 3 IT corridor.'
  },
  {
    id: 'life-republic',
    displayName: 'Life Republic',
    developer: 'Kolte-Patil',
    phase: 'PHASE_1',
    location: 'Hinjewadi Phase 1',
    bhkOptions: ['2 BHK', '3 BHK', '4 BHK'],
    subSocieties: [],
    priceRange: '₹95L – ₹2.8Cr',
    icon: '🌿',
    accentHex: '#D4AF37',
    description: '40-acre integrated township by Kolte-Patil with premium lifestyle and top-tier amenities.'
  },
  {
    id: 'godrej-24',
    displayName: 'Godrej 24',
    developer: 'Godrej',
    phase: 'PHASE_1',
    location: 'Hinjewadi Phase 1',
    bhkOptions: ['2 BHK', '3 BHK'],
    subSocieties: [],
    priceRange: '₹1.1Cr – ₹2.1Cr',
    icon: '⚡',
    accentHex: '#3B82F6',
    description: 'Iconic high-rise towers by Godrej Properties with world-class amenities.'
  },
  {
    id: 'vtp-urban-life',
    displayName: 'VTP Urban Life',
    developer: 'VTP',
    phase: 'PHASE_1',
    location: 'Hinjewadi Phase 1',
    bhkOptions: ['1 BHK', '2 BHK', '3 BHK'],
    subSocieties: [],
    priceRange: '₹68L – ₹1.5Cr',
    icon: '🏗️',
    accentHex: '#F59E0B',
    description: 'Well-planned urban residential community with excellent connectivity to IT parks.'
  },
  {
    id: 'other',
    displayName: 'Independent Projects',
    developer: null,
    phase: null,
    location: 'Hinjewadi & Baner',
    bhkOptions: ['1 BHK', '2 BHK', '3 BHK', '4 BHK'],
    subSocieties: [],
    priceRange: 'Price on Request',
    icon: '🏠',
    accentHex: '#64748B',
    description: 'Standalone premium projects and boutique residential developments.'
  }
];

/* ═══════════════════════════════════════════════════════════════════
   UTILITY: Format budget value for display
═══════════════════════════════════════════════════════════════════ */
function formatBudget(val) {
  if (!val) return 'Any';
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000)   return `₹${Math.round(val / 100000)} L`;
  return `₹${val.toLocaleString('en-IN')}`;
}

const BUDGET_MIN = 3000000;   // ₹30 Lakhs
const BUDGET_MAX = 50000000;  // ₹5 Crore

/* ═══════════════════════════════════════════════════════════════════
   FILTER SECTION — Collapsible Accordion Panel
═══════════════════════════════════════════════════════════════════ */
function FilterSection({ label, icon, isOpen, onToggle, badge, children }) {
  return (
    <div className="pi-filter-section">
      <button className="pi-filter-section__trigger" onClick={onToggle} aria-expanded={isOpen}>
        <div className="pi-filter-section__label">
          {icon}
          <span>{label}</span>
          {badge > 0 && (
            <span className="pi-filter-section__badge">{badge}</span>
          )}
        </div>
        <ChevronDown
          size={14}
          className={`pi-filter-section__chevron${isOpen ? ' open' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="pi-filter-section__body">
          {children}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TOWNSHIP ACCORDION ITEM in Sidebar
═══════════════════════════════════════════════════════════════════ */
function TownshipAccordionItem({ township, isExpanded, isSelected, societyCount, onToggle, onSelectSociety, selectedSocieties }) {
  return (
    <div className={`pi-township-accordion${isExpanded ? ' active' : ''}`}>
      <button
        className="pi-township-accordion__header"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <div className="pi-township-accordion__name">
          <span>{township.icon}</span>
          <span>{township.displayName}</span>
        </div>
        <div className="pi-township-accordion__meta">
          {societyCount > 0 && (
            <span className="pi-township-accordion__count">{societyCount}</span>
          )}
          <ChevronDown size={13} className="pi-township-accordion__chevron" />
        </div>
      </button>

      {isExpanded && township.subSocieties.length > 0 && (
        <div className="pi-township-accordion__children">
          {township.subSocieties.map(name => {
            const isActive = selectedSocieties.includes(name);
            return (
              <button
                key={name}
                className={`pi-township-child-option${isActive ? ' active' : ''}`}
                onClick={() => onSelectSociety(name)}
              >
                <span className="pi-township-child-dot" />
                <span>{name}</span>
                {isActive && <Check size={12} style={{ marginLeft: 'auto', color: '#D4AF37' }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TOGGLE SWITCH
═══════════════════════════════════════════════════════════════════ */
function Toggle({ id, checked, onChange, label, icon }) {
  return (
    <div className="pi-toggle-row">
      <label className="pi-toggle-label" htmlFor={id}>
        {icon && <span style={{ color: '#64748B' }}>{icon}</span>}
        {label}
      </label>
      <label className="pi-toggle" htmlFor={id}>
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={e => onChange(e.target.checked)}
        />
        <div className="pi-toggle-track" />
      </label>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TOWNSHIP GROUP — The header + card grid block in main area
═══════════════════════════════════════════════════════════════════ */
function TownshipGroup({ township, societies, onSelectSociety, onExploreTownship, index }) {
  if (societies.length === 0) return null;

  const isMegapolis = township.id === 'megapolis';

  return (
    <motion.div
      className="pi-township-group"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
    >
      {/* Township Group Header */}
      <div
        className="pi-township-group__header"
        style={{ borderLeftColor: township.accentHex, borderLeftWidth: '3px', borderLeftStyle: 'solid' }}
      >
        <div style={{ flex: 1, minWidth: '200px' }}>
          {/* Township Title Row */}
          <div className="pi-township-group__title">
            <span style={{ fontSize: '1.3rem' }}>{township.icon}</span>
            {township.displayName}
            <span
              style={{
                fontSize: '0.68rem',
                padding: '2px 8px',
                borderRadius: '5px',
                background: `${township.accentHex}22`,
                color: township.accentHex,
                border: `1px solid ${township.accentHex}44`,
                fontFamily: 'Inter, sans-serif',
                fontWeight: 800,
                letterSpacing: '0.04em'
              }}
            >
              {societies.length} {societies.length === 1 ? 'Society' : 'Societies'}
            </span>
          </div>

          {/* Subtitle meta */}
          <div className="pi-township-group__subtitle">
            <MapPin size={12} color="#D4AF37" />
            <span>{township.location}</span>
            {township.totalAcres && (
              <>
                <span className="pi-township-group__subtitle-dot" />
                <span>{township.totalAcres} Acres</span>
              </>
            )}
            {township.developer && (
              <>
                <span className="pi-township-group__subtitle-dot" />
                <Building2 size={12} />
                <span>{township.developer} Group</span>
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          {/* BHK Pills */}
          {township.bhkOptions.length > 0 && (
            <div className="pi-township-group__bhk-pills">
              {township.bhkOptions.map(bhk => (
                <span key={bhk} className="pi-township-group__bhk-pill">{bhk}</span>
              ))}
            </div>
          )}
          {/* Price Range */}
          <div className="pi-township-group__price-range">
            {township.priceRange}
          </div>

          {/* Deep-link CTA for Megapolis */}
          {isMegapolis && onExploreTownship && (
            <button
              onClick={() => onExploreTownship(township.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '7px 14px', borderRadius: '8px',
                background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(212,175,55,0.1) 100%)',
                border: '1px solid rgba(124,58,237,0.4)',
                color: '#C4B5FD', fontSize: '0.73rem', fontWeight: 700,
                cursor: 'pointer', letterSpacing: '0.02em',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.6)'; e.currentTarget.style.color = '#F3E5AB'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'; e.currentTarget.style.color = '#C4B5FD'; }}
            >
              <span>🏙️ Explore All Listings</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Society Cards Grid */}
      <div className="pi-township-group__body">
        <div className="pi-township-cards-grid">
          {societies.map((society, i) => (
            <SocietyCard
              key={society.id || society.slug || i}
              society={society}
              parentTownship={township.id !== 'other' ? township.displayName : null}
              onSelect={slug => onSelectSociety(slug)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
═══════════════════════════════════════════════════════════════════ */
export default function PublicTownshipPage({ onBackHome, onSelectSociety }) {

  useSEO({
    title: '24K Township Explorer — Hinjewadi Phase 3, Megapolis, TCG, Kolte-Patil | 24K Realtors',
    description: 'Discover Pune\'s finest integrated townships and societies. Filter by Megapolis, TCG Phase 3, Kolte-Patil Life Republic and more. Choose 1, 2, 3 BHK in Hinjewadi Phase 1–3.',
    canonical: 'https://24krealtors.in/townships'
  });

  const navigate     = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  /* ── State: Data ── */
  const [societies, setSocieties]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  /* ── State: Filters ── */
  const [searchQuery, setSearchQuery]         = useState(searchParams.get('q') || '');
  const [selectedPhase, setSelectedPhase]     = useState(searchParams.get('phase') || '');
  const [selectedTownship, setSelectedTownship] = useState(searchParams.get('township') || '');
  const [selectedSocieties, setSelectedSocieties] = useState([]); // sub-society names
  const [selectedBhk, setSelectedBhk]         = useState(searchParams.get('bhk') || '');
  const [selectedStatus, setSelectedStatus]   = useState('');
  const [maxBudget, setMaxBudget]             = useState(BUDGET_MAX);
  const [reraOnly, setReraOnly]               = useState(false);
  const [hasResale, setHasResale]             = useState(false);
  const [hasRental, setHasRental]             = useState(false);
  const [sortBy, setSortBy]                   = useState('verified_first');

  /* ── State: UI ── */
  const [viewMode, setViewMode]               = useState('grouped'); // 'grouped' | 'flat'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [openSections, setOpenSections]       = useState({
    phase: true, township: true, bhk: true, budget: false, status: false, special: false
  });
  const [expandedTownship, setExpandedTownship] = useState(
    searchParams.get('township') || null
  );

  /* ── Ref for Budget slider CSS progress ── */
  const sliderRef = useRef(null);

  /* ── Sync URL Params ── */
  useEffect(() => {
    const params = {};
    if (selectedPhase)    params.phase    = selectedPhase;
    if (selectedTownship) params.township = selectedTownship;
    if (selectedBhk)      params.bhk      = selectedBhk;
    if (searchQuery)      params.q        = searchQuery;
    setSearchParams(params, { replace: true });
  }, [selectedPhase, selectedTownship, selectedBhk, searchQuery]);

  /* ── Sync Budget Slider CSS ── */
  useEffect(() => {
    if (sliderRef.current) {
      const pct = ((maxBudget - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;
      sliderRef.current.style.setProperty('--val', `${pct}%`);
    }
  }, [maxBudget]);

  /* ── Fetch Societies ── */
  const fetchSocieties = useCallback(async () => {
    setLoading(true);
    try {
      // Derive developer from selected township config
      const twp = TOWNSHIP_CONFIG.find(t => t.id === selectedTownship);
      const developerFilter = twp?.developer || null;

      const res = await apiService.getPublicSocieties({
        hinjewadiPhase: selectedPhase || null,
        bhkType:        selectedBhk   || null,
        developer:      developerFilter,
        projectStatus:  selectedStatus || null,
        maxBudget:      maxBudget < BUDGET_MAX ? maxBudget : null,
        reraRegistered: reraOnly  ? true : null,
        hasResale:      hasResale ? true : null,
        hasRental:      hasRental ? true : null,
        sortBy,
        page: 0,
        size: 80
      });

      let list = res.content || res || [];

      // Client-side search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        list = list.filter(s =>
          (s.name            && s.name.toLowerCase().includes(q)) ||
          (s.canonicalName   && s.canonicalName.toLowerCase().includes(q)) ||
          (s.developer       && s.developer.toLowerCase().includes(q)) ||
          (s.location        && s.location.toLowerCase().includes(q))
        );
      }

      // Sub-society name filter (when specific society selected in sidebar)
      if (selectedSocieties.length > 0) {
        list = list.filter(s =>
          selectedSocieties.some(name =>
            (s.name          && s.name.toLowerCase().includes(name.toLowerCase())) ||
            (s.canonicalName && s.canonicalName.toLowerCase().includes(name.toLowerCase()))
          )
        );
      }

      setSocieties(list);
      setTotalCount(res.totalElements || list.length);
    } catch (err) {
      console.error('[TownshipPage] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedPhase, selectedBhk, selectedTownship, selectedStatus, maxBudget, reraOnly, hasResale, hasRental, sortBy, searchQuery, selectedSocieties]);

  useEffect(() => { fetchSocieties(); }, [fetchSocieties]);

  /* ── Township Grouping Logic ── */
  const groupedSocieties = useCallback(() => {
    const groups = [];
    const usedIds = new Set();

    TOWNSHIP_CONFIG.filter(twp => twp.id !== 'other').forEach(twp => {
      // Phase pre-filter
      if (selectedPhase && twp.phase && twp.phase !== selectedPhase) return;

      // Township pre-filter
      if (selectedTownship && twp.id !== selectedTownship) return;

      const matches = societies.filter(s => {
        if (usedIds.has(s.id || s.slug)) return false;
        const dev = (s.developer || '').toLowerCase();
        return dev.includes(twp.developer?.toLowerCase() || '###never###');
      });

      if (matches.length > 0) {
        matches.forEach(s => usedIds.add(s.id || s.slug));
        groups.push({ township: twp, societies: matches });
      }
    });

    // Remaining uncategorized → "Independent Projects"
    const others = societies.filter(s => !usedIds.has(s.id || s.slug));
    if (others.length > 0 && !selectedTownship) {
      groups.push({ township: TOWNSHIP_CONFIG.find(t => t.id === 'other'), societies: others });
    }

    return groups;
  }, [societies, selectedPhase, selectedTownship]);

  /* ── Township society counts for sidebar badges ── */
  const getTownshipCount = (twp) => {
    if (selectedTownship && twp.id !== selectedTownship) return 0;
    if (selectedPhase && twp.phase && twp.phase !== selectedPhase) return 0;
    return societies.filter(s => {
      const dev = (s.developer || '').toLowerCase();
      return dev.includes(twp.developer?.toLowerCase() || '###');
    }).length;
  };

  /* ── Reset Filters ── */
  const handleReset = () => {
    setSearchQuery('');
    setSelectedPhase('');
    setSelectedTownship('');
    setExpandedTownship(null);
    setSelectedSocieties([]);
    setSelectedBhk('');
    setSelectedStatus('');
    setMaxBudget(BUDGET_MAX);
    setReraOnly(false);
    setHasResale(false);
    setHasRental(false);
    setSortBy('verified_first');
    setSearchParams({});
  };

  const activeFilterCount = [
    selectedPhase, selectedTownship, selectedBhk, selectedStatus,
    reraOnly, hasResale, hasRental,
    searchQuery, selectedSocieties.length > 0,
    maxBudget < BUDGET_MAX
  ].filter(Boolean).length;

  const toggleSection = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  const toggleSocietyFilter = (name) => {
    setSelectedSocieties(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  /* ── Handle township select ── */
  const handleTownshipToggle = (twpId) => {
    if (expandedTownship === twpId) {
      setExpandedTownship(null);
    } else {
      setExpandedTownship(twpId);
    }
    if (selectedTownship === twpId) {
      setSelectedTownship('');
      setSelectedSocieties([]);
    } else {
      setSelectedTownship(twpId);
      setSelectedSocieties([]);
    }
  };

  /* ── Handle Society Navigation ── */
  const handleSocietySelect = (slug) => {
    if (onSelectSociety) onSelectSociety(slug);
    else navigate(`/society/${slug}`);
  };

  const handleBackHome = () => {
    if (onBackHome) onBackHome();
    else navigate('/');
  };

  const groups = viewMode === 'grouped' ? groupedSocieties() : [];

  /* ══════════════════════════════════════════════════════════════ */
  /*  RENDER                                                        */
  /* ══════════════════════════════════════════════════════════════ */
  return (
    <div className="pi-page-wrapper">

      {/* ── STICKY TOPBAR ──────────────────────────────────────────── */}
      <header className="pi-topbar" style={{ height: '64px' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
          onClick={handleBackHome}
        >
          <CompanyLogo variant="compact" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <span style={{ fontSize: '0.64rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
              Signature Collection
            </span>
            <span style={{ fontSize: '0.88rem', fontFamily: "'Cinzel', serif", fontWeight: 800, color: '#F3E5AB', letterSpacing: '0.03em' }}>
              🏙️ Township Explorer
            </span>
          </div>
        </div>

        {/* Desktop Search */}
        <div style={{ flex: 1, maxWidth: '400px', margin: '0 20px', position: 'relative', display: 'flex' }}>
          <Search size={14} color="#D4AF37" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="search"
            placeholder="Search township, society, or builder..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pi-input"
            style={{ paddingLeft: '34px', paddingRight: '34px', fontSize: '0.8rem', height: '38px', borderRadius: '50px', flex: 1 }}
            aria-label="Search townships and societies"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '2px' }}
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a
            href="https://wa.me/919673000053?text=Hi%2024K%20Realtors%2C%20I%20want%20to%20explore%20township%20properties"
            target="_blank"
            rel="noopener noreferrer"
            className="pi-btn-whatsapp"
            style={{ padding: '8px 14px', fontSize: '0.78rem' }}
          >
            <MessageSquare size={13} />
            <span>VIP Desk</span>
          </a>
          <button onClick={handleBackHome} className="pi-btn-outline" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>
            <Home size={13} />
            <span style={{ marginLeft: '4px' }}>Portal</span>
          </button>
        </div>
      </header>

      {/* ── HERO SECTION ───────────────────────────────────────────── */}
      <section style={{
        background: 'radial-gradient(ellipse at 50% 0%, #1A0E30 0%, #0C1A32 45%, #060D1A 100%)',
        borderBottom: '1px solid rgba(212,175,55,0.2)',
        padding: '44px 24px 32px 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow orb */}
        <div style={{
          position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, rgba(212,175,55,0.06) 40%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="pi-container" style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.35)',
            borderRadius: '50px', padding: '5px 18px', marginBottom: '16px'
          }}>
            <Layers size={13} color="#A78BFA" />
            <span style={{ color: '#C4B5FD', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              BROWSE BY TOWNSHIP → SOCIETY → BHK
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.9rem, 3.5vw, 3rem)',
            fontWeight: 800, color: '#FFFFFF',
            margin: '0 0 12px 0', letterSpacing: '-0.01em', lineHeight: 1.15
          }}>
            🏙️ Township Explorer
          </h1>

          <p style={{
            color: 'rgba(241,245,249,0.75)', fontSize: 'clamp(0.88rem, 1.1vw, 1rem)',
            lineHeight: 1.6, margin: '0 auto 24px auto', maxWidth: '680px',
            fontFamily: "'Inter', sans-serif"
          }}>
            Drill from township → society → BHK in seconds. Megapolis, TCG Phase 3, Kolte-Patil Life Republic &amp; more — all with live MahaRERA-verified price spectrums.
          </p>

          {/* Value Props */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            {[
              { icon: <ShieldCheck size={13} />, label: '100% MahaRERA Verified', cls: 'pi-hero-chip--green' },
              { icon: <Award size={13} color="#D4AF37" />, label: 'Direct Pricing' },
              { icon: <TrendingUp size={13} color="#60A5FA" />, label: '4.5%+ Rental Yield', cls: 'pi-hero-chip--white' },
              { icon: <Calendar size={13} color="#D4AF37" />, label: 'Private Site Tours', cls: 'pi-hero-chip--white' }
            ].map((chip, i) => (
              <div key={i} className={`pi-hero-chip ${chip.cls || ''}`} style={{ padding: '6px 14px', fontSize: '0.73rem' }}>
                {chip.icon}
                <span>{chip.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT AREA ──────────────────────────────────────── */}
      <div className="pi-container" style={{ padding: '0 24px' }}>
        <div className="pi-township-layout">

          {/* ══ LEFT SIDEBAR FILTER ════════════════════════════════════ */}
          <aside>
            {/* Mobile Backdrop */}
            <div
              className={`pi-filter-overlay${mobileFilterOpen ? ' open' : ''}`}
              onClick={() => setMobileFilterOpen(false)}
              aria-hidden="true"
            />

            <div className={`pi-filter-sidebar${mobileFilterOpen ? ' open' : ''}`} role="search" aria-label="Filter properties">

              {/* Sidebar Header */}
              <div className="pi-filter-sidebar__header">
                <div className="pi-filter-sidebar__title">
                  <SlidersHorizontal size={16} color="#D4AF37" />
                  <span>Smart Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="pi-filter-section__badge">{activeFilterCount}</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {activeFilterCount > 0 && (
                    <button className="pi-filter-sidebar__reset" onClick={handleReset}>
                      <RefreshCw size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      Reset
                    </button>
                  )}
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="pi-filter-sidebar__reset"
                    style={{ display: 'none' }}
                    aria-label="Close filters"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* ─ 1. LOCATION / PHASE ─ */}
              <FilterSection
                label="Location & Phase"
                icon={<MapPin size={13} color="#D4AF37" />}
                isOpen={openSections.phase}
                onToggle={() => toggleSection('phase')}
                badge={selectedPhase ? 1 : 0}
              >
                {[
                  { val: '', label: 'All Corridors' },
                  { val: 'PHASE_1', label: 'Hinjewadi Phase 1' },
                  { val: 'PHASE_2', label: 'Hinjewadi Phase 2' },
                  { val: 'PHASE_3', label: 'Hinjewadi Phase 3' },
                  { val: 'MAHALUNGE', label: 'Mahalunge IT Hub' }
                ].map(item => (
                  <button
                    key={item.val}
                    className={`pi-filter-option${selectedPhase === item.val ? ' active' : ''}`}
                    onClick={() => setSelectedPhase(item.val)}
                  >
                    <span>{item.label}</span>
                    {selectedPhase === item.val && <Check size={13} color="#D4AF37" />}
                  </button>
                ))}
              </FilterSection>

              {/* ─ 2. TOWNSHIP / BUILDER ─ */}
              <FilterSection
                label="Township / Builder"
                icon={<Building2 size={13} color="#D4AF37" />}
                isOpen={openSections.township}
                onToggle={() => toggleSection('township')}
                badge={selectedTownship ? 1 : 0}
              >
                {TOWNSHIP_CONFIG.filter(t => t.id !== 'other').map(twp => {
                  const count = getTownshipCount(twp);
                  const isExpanded = expandedTownship === twp.id;
                  const isSelected = selectedTownship === twp.id;
                  return (
                    <TownshipAccordionItem
                      key={twp.id}
                      township={twp}
                      isExpanded={isExpanded}
                      isSelected={isSelected}
                      societyCount={count}
                      onToggle={() => handleTownshipToggle(twp.id)}
                      onSelectSociety={toggleSocietyFilter}
                      selectedSocieties={selectedSocieties}
                    />
                  );
                })}
              </FilterSection>

              {/* ─ 3. BHK CONFIGURATION ─ */}
              <FilterSection
                label="BHK Configuration"
                icon={<Home size={13} color="#D4AF37" />}
                isOpen={openSections.bhk}
                onToggle={() => toggleSection('bhk')}
                badge={selectedBhk ? 1 : 0}
              >
                <div className="pi-bhk-chips">
                  {['', '1 BHK', '2 BHK', '3 BHK', '4 BHK'].map(bhk => (
                    <button
                      key={bhk || 'all'}
                      className={`pi-bhk-chip${selectedBhk === bhk ? ' active' : ''}`}
                      onClick={() => setSelectedBhk(bhk)}
                      aria-pressed={selectedBhk === bhk}
                    >
                      {bhk || 'All'}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* ─ 4. BUDGET RANGE ─ */}
              <FilterSection
                label="Budget Range"
                icon={<IndianRupee size={13} color="#D4AF37" />}
                isOpen={openSections.budget}
                onToggle={() => toggleSection('budget')}
                badge={maxBudget < BUDGET_MAX ? 1 : 0}
              >
                <div className="pi-budget-slider-wrap">
                  <div className="pi-budget-value">
                    Up to {formatBudget(maxBudget)}
                    {maxBudget >= BUDGET_MAX && ' (Any)'}
                  </div>
                  <input
                    ref={sliderRef}
                    type="range"
                    className="pi-slider"
                    min={BUDGET_MIN}
                    max={BUDGET_MAX}
                    step={500000}
                    value={maxBudget}
                    onChange={e => setMaxBudget(Number(e.target.value))}
                    aria-label="Maximum budget"
                  />
                  <div className="pi-budget-labels">
                    <span>₹30 Lakh</span>
                    <span>₹5 Crore</span>
                  </div>
                </div>
              </FilterSection>

              {/* ─ 5. DELIVERY STAGE ─ */}
              <FilterSection
                label="Delivery Stage"
                icon={<Calendar size={13} color="#D4AF37" />}
                isOpen={openSections.status}
                onToggle={() => toggleSection('status')}
                badge={selectedStatus ? 1 : 0}
              >
                {[
                  { val: '', label: 'All Stages' },
                  { val: 'READY_TO_MOVE', label: '✅ Ready to Move' },
                  { val: 'UNDER_CONSTRUCTION', label: '🏗️ Under Construction' },
                  { val: 'NEW_LAUNCH', label: '🚀 New Launch' }
                ].map(item => (
                  <button
                    key={item.val}
                    className={`pi-filter-option${selectedStatus === item.val ? ' active' : ''}`}
                    onClick={() => setSelectedStatus(item.val)}
                  >
                    <span>{item.label}</span>
                    {selectedStatus === item.val && <Check size={13} color="#D4AF37" />}
                  </button>
                ))}
              </FilterSection>

              {/* ─ 6. SPECIAL FILTERS ─ */}
              <FilterSection
                label="Special Filters"
                icon={<Star size={13} color="#D4AF37" />}
                isOpen={openSections.special}
                onToggle={() => toggleSection('special')}
                badge={[reraOnly, hasResale, hasRental].filter(Boolean).length}
              >
                <Toggle
                  id="rera-toggle"
                  checked={reraOnly}
                  onChange={setReraOnly}
                  label="MahaRERA Verified Only"
                  icon={<ShieldCheck size={13} />}
                />
                <Toggle
                  id="resale-toggle"
                  checked={hasResale}
                  onChange={setHasResale}
                  label="Resale Units Available"
                  icon={<TrendingUp size={13} />}
                />
                <Toggle
                  id="rental-toggle"
                  checked={hasRental}
                  onChange={setHasRental}
                  label="High Rental Yield"
                  icon={<IndianRupee size={13} />}
                />
              </FilterSection>

              {/* ─ Private Advisory Box ─ */}
              <div className="pi-advisory-box">
                <Sparkles size={22} color="#D4AF37" style={{ marginBottom: '8px' }} />
                <h4 style={{ fontFamily: "'Cinzel', serif", color: '#FFF', margin: '0 0 6px 0', fontSize: '0.92rem' }}>
                  Private Advisory
                </h4>
                <p style={{ fontSize: '0.72rem', color: '#64748B', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                  Pre-launch allotments &amp; direct developer pricing.
                </p>
                <a
                  href="tel:+919673000053"
                  className="pi-btn-gold pi-btn-gold--full"
                  style={{ fontSize: '0.76rem', padding: '9px' }}
                >
                  <Phone size={12} /> +91 96730 00053
                </a>
              </div>

            </div>{/* /pi-filter-sidebar */}
          </aside>

          {/* ══ MAIN RESULTS CONTENT ═══════════════════════════════════ */}
          <main className="pi-township-content">

            {/* Results Bar */}
            <div className="pi-results-bar">
              <div>
                <div className="pi-results-count">
                  <span>{loading ? '…' : totalCount}</span> Verified Societies
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                  {selectedPhase ? selectedPhase.replace('_', ' ') : 'All Corridors'} •
                  {selectedTownship ? ` ${TOWNSHIP_CONFIG.find(t => t.id === selectedTownship)?.displayName || 'Township'}` : ' All Townships'} •
                  {selectedBhk || ' All BHK'}
                </div>
              </div>

              <div className="pi-results-controls">
                {/* View Toggle */}
                <div className="pi-view-toggle" role="group" aria-label="View mode">
                  <button
                    className={`pi-view-btn${viewMode === 'grouped' ? ' active' : ''}`}
                    onClick={() => setViewMode('grouped')}
                    title="Grouped by Township"
                    aria-pressed={viewMode === 'grouped'}
                  >
                    <LayoutList size={15} />
                  </button>
                  <button
                    className={`pi-view-btn${viewMode === 'flat' ? ' active' : ''}`}
                    onClick={() => setViewMode('flat')}
                    title="Flat Grid"
                    aria-pressed={viewMode === 'flat'}
                  >
                    <Grid3x3 size={15} />
                  </button>
                </div>

                {/* Sort */}
                <select
                  className="pi-sort-select"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  aria-label="Sort societies"
                >
                  <option value="verified_first">Highest Trust First</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="newest">Newest Possession</option>
                </select>
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFilterCount > 0 && (
              <div className="pi-active-chips" aria-label="Active filters">
                <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Filters:
                </span>
                {selectedPhase && (
                  <span className="pi-active-chip">
                    📍 {selectedPhase.replace('_', ' ')}
                    <button className="pi-active-chip__remove" onClick={() => setSelectedPhase('')} aria-label="Remove phase filter"><X size={11} /></button>
                  </span>
                )}
                {selectedTownship && (
                  <span className="pi-active-chip">
                    🏙️ {TOWNSHIP_CONFIG.find(t => t.id === selectedTownship)?.displayName}
                    <button className="pi-active-chip__remove" onClick={() => { setSelectedTownship(''); setSelectedSocieties([]); setExpandedTownship(null); }} aria-label="Remove township filter"><X size={11} /></button>
                  </span>
                )}
                {selectedBhk && (
                  <span className="pi-active-chip">
                    🛏️ {selectedBhk}
                    <button className="pi-active-chip__remove" onClick={() => setSelectedBhk('')} aria-label="Remove BHK filter"><X size={11} /></button>
                  </span>
                )}
                {selectedSocieties.map(name => (
                  <span key={name} className="pi-active-chip">
                    • {name}
                    <button className="pi-active-chip__remove" onClick={() => toggleSocietyFilter(name)} aria-label={`Remove ${name} filter`}><X size={11} /></button>
                  </span>
                ))}
                {maxBudget < BUDGET_MAX && (
                  <span className="pi-active-chip">
                    💰 Up to {formatBudget(maxBudget)}
                    <button className="pi-active-chip__remove" onClick={() => setMaxBudget(BUDGET_MAX)} aria-label="Remove budget filter"><X size={11} /></button>
                  </span>
                )}
                {reraOnly && (
                  <span className="pi-active-chip">
                    ✅ RERA Only
                    <button className="pi-active-chip__remove" onClick={() => setReraOnly(false)} aria-label="Remove RERA filter"><X size={11} /></button>
                  </span>
                )}
                {searchQuery && (
                  <span className="pi-active-chip">
                    🔍 "{searchQuery}"
                    <button className="pi-active-chip__remove" onClick={() => setSearchQuery('')} aria-label="Clear search"><X size={11} /></button>
                  </span>
                )}
                <button
                  onClick={handleReset}
                  style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Clear All
                </button>
              </div>
            )}

            {/* ── CONTENT ── */}
            {loading ? (
              /* Loading State */
              <div style={{ padding: '80px 20px', textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid rgba(212,175,55,0.2)', borderTopColor: '#D4AF37', animation: 'pi-spin 1s linear infinite', margin: '0 auto 20px auto' }} />
                <p style={{ color: '#64748B', fontSize: '0.88rem', letterSpacing: '0.04em' }}>
                  Fetching verified township inventory...
                </p>
              </div>

            ) : societies.length === 0 ? (
              /* Empty State */
              <div className="pi-township-empty">
                <Building2 size={44} color="#D4AF37" style={{ margin: '0 auto 14px auto' }} />
                <h3 style={{ fontSize: '1.2rem', color: '#FFF', margin: '0 0 8px 0', fontFamily: "'Cinzel', serif" }}>
                  No societies match your criteria
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#94A3B8', marginBottom: '20px' }}>
                  Try adjusting your filters or search for a different builder or location.
                </p>
                <button onClick={handleReset} className="pi-btn-gold">
                  <RefreshCw size={14} style={{ marginRight: '6px' }} />
                  Reset All Filters
                </button>
              </div>

            ) : viewMode === 'grouped' ? (
              /* Grouped View */
              <AnimatePresence>
                {groups.length > 0 ? groups.map(({ township, societies: socs }, i) => (
                  <TownshipGroup
                    key={township.id}
                    township={township}
                    societies={socs}
                    onSelectSociety={handleSocietySelect}
                    onExploreTownship={(twpId) => {
                      if (twpId === 'megapolis') navigate('/townships/megapolis');
                    }}
                    index={i}
                  />
                )) : (
                  /* fallback to flat if grouping yields nothing */
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {societies.map((s, i) => (
                      <SocietyCard key={s.id || s.slug || i} society={s} onSelect={handleSocietySelect} />
                    ))}
                  </div>
                )}
              </AnimatePresence>

            ) : (
              /* Flat Grid View */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}
              >
                {societies.map((s, i) => (
                  <SocietyCard key={s.id || s.slug || i} society={s} onSelect={handleSocietySelect} />
                ))}
              </motion.div>
            )}

            {/* ── VIP TOUR CALLOUT ─────────────────────────────────────── */}
            {!loading && societies.length > 0 && (
              <div style={{
                marginTop: '36px',
                background: 'linear-gradient(135deg, #0E203C 0%, #07101F 100%)',
                border: '1px solid rgba(212,175,55,0.25)',
                borderRadius: '18px',
                padding: '28px 32px',
                display: 'flex', flexWrap: 'wrap',
                alignItems: 'center', justifyContent: 'space-between', gap: '20px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D4AF37', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                    <Sparkles size={14} />
                    <span>Off-Market &amp; Pre-Launch Inventory</span>
                  </div>
                  <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', color: '#FFF', margin: '0 0 6px 0' }}>
                    Request Bespoke Private Site Tour
                  </h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: 0, maxWidth: '600px' }}>
                    Our Hinjewadi Specialist Desk arranges private chauffeur-driven walkthroughs, direct developer allotments and verified pricing for all townships.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <a
                    href="https://wa.me/919673000053?text=Hi%2C%20I%20want%20to%20book%20a%20private%20township%20site%20visit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pi-btn-whatsapp"
                    style={{ padding: '12px 20px', fontSize: '0.82rem' }}
                  >
                    <MessageSquare size={14} /> WhatsApp Desk
                  </a>
                  <a
                    href="tel:+919673000053"
                    className="pi-btn-gold"
                    style={{ padding: '12px 20px', fontSize: '0.82rem' }}
                  >
                    <Phone size={14} /> +91 96730 00053
                  </a>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* ── MOBILE FILTER FAB ───────────────────────────────────────── */}
      <button
        className="pi-mobile-filter-fab"
        onClick={() => setMobileFilterOpen(true)}
        aria-label="Open filters"
        aria-expanded={mobileFilterOpen}
      >
        <SlidersHorizontal size={15} />
        Filters
        {activeFilterCount > 0 && (
          <span style={{
            background: '#D4AF37', color: '#070F1E',
            borderRadius: '50%', width: '20px', height: '20px',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.68rem', fontWeight: 900
          }}>
            {activeFilterCount}
          </span>
        )}
      </button>

    </div>
  );
}
