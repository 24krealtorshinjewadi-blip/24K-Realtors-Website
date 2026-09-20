/**
 * MegapolisTownshipPage.jsx — 24K Realtors
 * ─────────────────────────────────────────────────────────────────
 * Level-2 of the Property Hierarchy:
 *   /townships/megapolis
 *
 * Shows a premium landing page for Megapolis Township (Pride Purple)
 * with hero stats, description, and a 5-card Society Explorer grid.
 * Clicking a society card → /townships/megapolis/:societySlug
 *
 * Branch: feature/township-filter-ui
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Building2, ArrowRight, ShieldCheck, Layers,
  Star, Award, TrendingUp, ChevronRight, Home, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CompanyLogo from './CompanyLogo';
import { useSEO } from '../services/seoService';
import './PropertyIntelligence.css';

/* ══════════════════════════════════════════════════════════════════
   MEGAPOLIS SOCIETY CONFIG
   Each society within the Megapolis township by Pride Purple Group.
══════════════════════════════════════════════════════════════════ */
export const MEGAPOLIS_SOCIETIES = [
  {
    id: 'sangria',
    slug: 'megapolis-sangria',
    displayName: 'Sangria',
    fullName: 'Megapolis Sangria',
    tagline: 'Vibrant Living. Bold Character.',
    bhkOptions: ['2 BHK', '2.5 BHK', '3 BHK'],
    carpetRange: '645 – 1,150 sqft',
    priceRange: '₹95L – ₹1.85Cr',
    unitCount: 480,
    towers: 4,
    status: 'READY_TO_MOVE',
    reraNumber: 'P52100047112',
    accentHex: '#E11D48',
    imageUrl: '/sangria_living_room.jpg',
    features: ['Pool View Units', 'Club Access', 'Sky Deck'],
    possession: 'Ready'
  },
  {
    id: 'mystic',
    slug: 'megapolis-mystic',
    displayName: 'Mystic',
    fullName: 'Megapolis Mystic',
    tagline: 'Serenity Meets Modern Luxury.',
    bhkOptions: ['2 BHK', '3 BHK'],
    carpetRange: '720 – 1,200 sqft',
    priceRange: '₹1.05Cr – ₹1.95Cr',
    unitCount: 396,
    towers: 3,
    status: 'READY_TO_MOVE',
    reraNumber: 'P52100046891',
    accentHex: '#7C3AED',
    imageUrl: '/dev_kolte_patil_township.png',
    features: ['Garden Facing', 'Terrace Lounge', 'Zen Garden'],
    possession: 'Ready'
  },
  {
    id: 'splendour',
    slug: 'megapolis-splendour',
    displayName: 'Splendour',
    fullName: 'Megapolis Splendour',
    tagline: 'Grand Scale. Timeless Elegance.',
    bhkOptions: ['2 BHK', '2.5 BHK', '3 BHK', '3.5 BHK'],
    carpetRange: '680 – 1,350 sqft',
    priceRange: '₹1.1Cr – ₹2.2Cr',
    unitCount: 512,
    towers: 5,
    status: 'UNDER_CONSTRUCTION',
    reraNumber: 'P52100048230',
    accentHex: '#D4AF37',
    imageUrl: '/dev_kolte_patil_township.png',
    features: ['Amphitheatre', 'Rooftop Pool', 'Premium Finishes'],
    possession: 'Dec 2026'
  },
  {
    id: 'sunway',
    slug: 'megapolis-sunway',
    displayName: 'Sunway',
    fullName: 'Megapolis Sunway',
    tagline: 'Sun-Drenched Spaces. Smart Layouts.',
    bhkOptions: ['1 BHK', '2 BHK', '2.5 BHK'],
    carpetRange: '440 – 870 sqft',
    priceRange: '₹65L – ₹1.35Cr',
    unitCount: 644,
    towers: 6,
    status: 'READY_TO_MOVE',
    reraNumber: 'P52100045780',
    accentHex: '#F59E0B',
    imageUrl: '/dev_kolte_patil_township.png',
    features: ['Corner Units', 'Vastu-Compliant', 'Low Maintenance'],
    possession: 'Ready'
  },
  {
    id: 'sparkle',
    slug: 'megapolis-sparkle',
    displayName: 'Sparkle',
    fullName: 'Megapolis Sparkle',
    tagline: 'Bright Future. Sparkling Homes.',
    bhkOptions: ['2 BHK', '3 BHK'],
    carpetRange: '700 – 1,100 sqft',
    priceRange: '₹1.0Cr – ₹1.75Cr',
    unitCount: 360,
    towers: 3,
    status: 'UNDER_CONSTRUCTION',
    reraNumber: 'P52100049005',
    accentHex: '#3B82F6',
    imageUrl: '/dev_kolte_patil_township.png',
    features: ['IT Park View', 'Smart Home', 'Business Centre'],
    possession: 'Jun 2027'
  },
];

/* ── Status helpers ──────────────────────────────────────────────── */
function statusStyle(s) {
  if (s === 'READY_TO_MOVE') return { color: '#10B981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.35)', label: 'Ready to Move' };
  if (s === 'UNDER_CONSTRUCTION') return { color: '#FFBE0B', bg: 'rgba(255,190,11,0.12)', border: 'rgba(255,190,11,0.35)', label: 'Under Construction' };
  return { color: '#D4AF37', bg: 'rgba(212,175,55,0.12)', border: 'rgba(212,175,55,0.35)', label: 'Verified Project' };
}

/* ── Individual Society Explorer Card ───────────────────────────── */
function SocietyExplorerCard({ society, onClick, index }) {
  const st = statusStyle(society.status);

  return (
    <motion.div
      className="pi-society-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={`Explore ${society.fullName}`}
      style={{ '--accent': society.accentHex }}
    >
      {/* Image */}
      <div className="pi-society-card__img-wrap">
        <img
          src={society.imageUrl}
          alt={society.fullName}
          loading="lazy"
          onError={e => { e.target.onerror = null; e.target.src = '/dev_kolte_patil_township.png'; }}
        />
        <div className="pi-society-card__img-overlay" />

        {/* Phase badge */}
        <span className="pi-society-card__badge">Phase 3</span>

        {/* Unit count badge */}
        <span className="pi-society-card__unit-count">
          {society.unitCount}+ Units
        </span>
      </div>

      {/* Body */}
      <div className="pi-society-card__body">
        <div>
          {/* Status pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontSize: '0.65rem', fontWeight: 700,
            padding: '2px 9px', borderRadius: '50px', marginBottom: '8px',
            background: st.bg, color: st.color, border: `1px solid ${st.border}`
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: st.color }} />
            {st.label}
          </div>

          {/* Society name */}
          <div className="pi-society-card__name">{society.displayName}</div>

          {/* Tagline */}
          <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '3px', fontStyle: 'italic' }}>
            {society.tagline}
          </div>

          {/* BHK Options */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
            {society.bhkOptions.map(bhk => (
              <span key={bhk} style={{
                fontSize: '0.65rem', color: '#94A3B8',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                padding: '2px 7px', borderRadius: '5px'
              }}>{bhk}</span>
            ))}
          </div>

          {/* Carpet & Possession */}
          <div className="pi-society-card__meta" style={{ marginTop: '8px' }}>
            <Home size={11} />
            <span>{society.carpetRange}</span>
            {society.possession && (
              <>
                <span style={{ opacity: 0.3 }}>·</span>
                <span>Poss: {society.possession}</span>
              </>
            )}
          </div>
        </div>

        {/* Price + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: '8px' }}>
          <div className="pi-society-card__price">{society.priceRange}</div>
          <div className="pi-society-card__cta">
            <span>Explore</span>
            <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function MegapolisTownshipPage({ onBackHome }) {
  const navigate = useNavigate();

  useSEO({
    title: 'Megapolis Township — Society Explorer | 24K Realtors Hinjewadi Phase 3',
    description: 'Explore Megapolis Township by Pride Purple Group. Browse Sangria, Mystic, Splendour, Sunway & Sparkle societies. 2 BHK, 2.5 BHK, 3 BHK from ₹65L to ₹2.2Cr in Hinjewadi Phase 3.',
    canonical: 'https://24krealtors.in/townships/megapolis'
  });

  const handleBack = () => {
    if (onBackHome) onBackHome();
    else navigate('/townships');
  };

  const handleSocietyClick = (society) => {
    navigate(`/townships/megapolis/${society.id}`);
  };

  const totalUnits = MEGAPOLIS_SOCIETIES.reduce((s, x) => s + (x.unitCount || 0), 0);

  return (
    <div className="pi-page-wrapper">

      {/* ── STICKY TOPBAR ──────────────────────────────────────────── */}
      <header className="pi-topbar" style={{ height: '64px' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
          onClick={handleBack}
        >
          <CompanyLogo variant="compact" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <span style={{ fontSize: '0.64rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
              Township Explorer
            </span>
            <span style={{ fontSize: '0.88rem', fontFamily: "'Cinzel', serif", fontWeight: 800, color: '#F3E5AB', letterSpacing: '0.03em' }}>
              🏙️ Megapolis
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a
            href="https://wa.me/919673000053?text=Hi%2024K%20Realtors%2C%20I%20want%20to%20explore%20Megapolis%20Township%20properties"
            target="_blank"
            rel="noopener noreferrer"
            className="pi-btn-whatsapp"
            style={{ padding: '8px 14px', fontSize: '0.78rem' }}
          >
            <span>VIP Desk</span>
          </a>
          <button onClick={handleBack} className="pi-btn-outline" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>
            <Home size={13} />
            <span style={{ marginLeft: '4px' }}>All Townships</span>
          </button>
        </div>
      </header>

      {/* ── BREADCRUMB ─────────────────────────────────────────────── */}
      <nav className="pi-breadcrumb-nav" aria-label="Breadcrumb">
        <span className="pi-breadcrumb-item" onClick={() => navigate('/')}>Home</span>
        <ChevronRight size={12} className="pi-breadcrumb-sep" />
        <span className="pi-breadcrumb-item" onClick={() => navigate('/townships')}>Properties</span>
        <ChevronRight size={12} className="pi-breadcrumb-sep" />
        <span className="pi-breadcrumb-item active">Megapolis Township</span>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="pi-megapolis-hero">
        <div className="pi-megapolis-hero__orb" aria-hidden="true" />

        <div className="pi-container" style={{ position: 'relative', zIndex: 1, maxWidth: '980px' }}>
          {/* Eyebrow */}
          <div className="pi-megapolis-hero__eyebrow">
            <Layers size={13} color="#A78BFA" />
            <span>Hinjewadi Phase 3 · Pride Purple Group</span>
          </div>

          {/* Title */}
          <h1 className="pi-megapolis-hero__title">
            🏙️ Megapolis <span>Township</span>
          </h1>

          {/* Subtitle */}
          <p className="pi-megapolis-hero__sub">
            Pune's largest integrated township across 142 acres — 5 distinct society clusters, {totalUnits.toLocaleString()}+ premium units, MahaRERA-verified with direct builder pricing.
          </p>

          {/* Stats */}
          <div className="pi-megapolis-hero__stats">
            {[
              { val: '142+', label: 'Acres' },
              { val: '5',    label: 'Societies' },
              { val: `${totalUnits.toLocaleString()}+`, label: 'Units' },
              { val: '₹65L+', label: 'Starting' },
              { val: '100%', label: 'RERA Verified' },
            ].map(s => (
              <div key={s.label} className="pi-megapolis-stat">
                <div className="pi-megapolis-stat__val">{s.val}</div>
                <div className="pi-megapolis-stat__label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Value Props */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            {[
              { icon: <ShieldCheck size={13} />, label: 'MahaRERA Registered', cls: 'pi-hero-chip--green' },
              { icon: <Award size={13} color="#D4AF37" />, label: 'Builder Direct Pricing' },
              { icon: <TrendingUp size={13} color="#60A5FA" />, label: 'IT Corridor — 4.5% Yield', cls: 'pi-hero-chip--white' },
              { icon: <Star size={13} color="#D4AF37" />, label: 'Private Site Visits', cls: 'pi-hero-chip--white' },
            ].map((chip, i) => (
              <div key={i} className={`pi-hero-chip ${chip.cls || ''}`} style={{ padding: '6px 14px', fontSize: '0.73rem' }}>
                {chip.icon}
                <span>{chip.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIETY EXPLORER GRID ──────────────────────────────────── */}
      <div className="pi-container" style={{ padding: '0 24px' }}>
        <section className="pi-society-explorer-section">
          <div className="pi-society-explorer-section__heading">
            <Building2 size={18} color="#D4AF37" />
            Society Explorer
          </div>
          <div className="pi-society-explorer-section__sub">
            Choose a society below to explore individual 2BHK / 2.5BHK / 3BHK listings with live pricing
          </div>

          <div className="pi-society-explorer-grid">
            {MEGAPOLIS_SOCIETIES.map((society, i) => (
              <SocietyExplorerCard
                key={society.id}
                society={society}
                index={i}
                onClick={() => handleSocietyClick(society)}
              />
            ))}
          </div>
        </section>

        {/* ── DEVELOPER BLOCK ─────────────────────────────────────── */}
        <section style={{
          marginTop: '16px',
          marginBottom: '48px',
          borderRadius: '20px',
          padding: '32px 36px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(212,175,55,0.05) 100%)',
          border: '1px solid rgba(212,175,55,0.18)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#7C3AED', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
              Developer
            </div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: '1.35rem', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>
              Pride Purple Group
            </div>
            <div style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.6, maxWidth: '540px' }}>
              Established developer with 25+ years of premium real estate delivery in Pune. Megapolis is their flagship township project — 142 acres of integrated living in Hinjewadi Phase 3 with 5 distinct society clusters.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['25+ Years', '5,000+ Units', '97% Delivered'].map(tag => (
                <span key={tag} style={{
                  fontSize: '0.7rem', padding: '5px 12px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#CBD5E1', fontWeight: 600
                }}>{tag}</span>
              ))}
            </div>
            <a
              href="https://wa.me/919673000053?text=Hi%2024K%20Realtors%2C%20I%20want%20to%20know%20more%20about%20Pride%20Purple%20Megapolis%20Township"
              target="_blank"
              rel="noopener noreferrer"
              className="pi-btn-gold"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', fontSize: '0.8rem', textDecoration: 'none', borderRadius: '10px' }}
            >
              <Sparkles size={14} />
              <span>Private Township Tour</span>
              <ArrowRight size={13} />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
