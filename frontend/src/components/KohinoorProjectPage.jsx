/**
 * KohinoorProjectPage.jsx — 24K Realtors
 * ─────────────────────────────────────────────────────────────────────────────
 * Ultra-Luxury Flagship Project Subpage for Kohinoor Sportsville,
 * Hinjewadi Phase 1, Pune.
 *
 * Features:
 *  - Official Kohinoor Sportsville Identity & Brand Emblem
 *  - Verified 3 BHK (930 sq.ft Carpet) Flagship Configuration
 *  - Clickable Full-Screen Interactive Lightbox Gallery with Pan & Zoom
 *  - 100% Authentic Interior Images of the Flat (Living Room, Modular Kitchen, Bedroom, Utility)
 *  - MahaRERA P52100029650 Verification Badge
 *  - 5 International Sports Arenas & Lifestyle Amenities Grid
 *  - Hinjewadi Phase 1 Strategic Proximity Matrix
 *  - Direct WhatsApp & Site Visit Booking
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, ShieldCheck, Phone, MessageSquare, ArrowLeft,
  CheckCircle2, Star, Clock, Zap, Car, Dumbbell, Trees,
  Lock, Coffee, Users, Home, IndianRupee,
  ChevronDown, ChevronUp, Building2, Award, X, ChevronLeft, ChevronRight, Maximize2,
  ZoomIn, ZoomOut, RotateCcw, Sparkles, Trophy, Activity, Waves
} from 'lucide-react';
import { useSEO } from '../services/seoService';
import CompanyLogo from './CompanyLogo';

/* ══════════════════════════════════════════════════════════════════
   KOHINOOR SPORTSVILLE PROJECT DATA SPECIFICATION
══════════════════════════════════════════════════════════════════ */
const KOHINOOR_DATA = {
  key: 'kohinoor-sportsville',
  name: 'Kohinoor Sportsville',
  fullName: 'Kohinoor Sportsville — Hinjewadi Phase 1',
  developer: 'Kohinoor Group',
  rera: 'P52100029650',
  location: 'Hinjewadi Phase 1, Rajiv Gandhi Infotech Park, Pune — 411057',
  status: 'Ready to Move & Ongoing',
  tagline: 'Live Active. Live Better. — Sports • Lifestyle • Community',
  heroSubline: 'Sports-centric luxury living with premium 3 BHK residences (930 sq.ft carpet) and 5 international sports arenas in Hinjewadi Phase 1',
  accentColor: '#E53E3E',
  accentGradient: 'linear-gradient(135deg, #9B2C2C 0%, #E53E3E 50%, #FEB2B2 100%)',
  heroBg: 'linear-gradient(160deg, #090B10 0%, #171015 40%, #201319 100%)',
  showcaseImage: '/kohinoor_hero_card.jpg',
  investmentScore: 96,
  rentalYield: '5.2%',
  whatsappText: 'Hi 24K Realtors, I am interested in Kohinoor Sportsville Hinjewadi Phase 1 (3 BHK 930 sq.ft carpet). Please share floor plans, pricing breakup, and schedule a site visit.',

  gallery: [
    {
      id: 1,
      tag: 'Grand Elevation & Sports Arena',
      icon: '🏢',
      roomName: 'Grand Elevation',
      title: 'Kohinoor Sportsville — Live Active. Live Better.',
      subtitle: 'Iconic sports-centric residential towers by Kohinoor Group in Hinjewadi Phase 1, featuring premium clubhouses, Olympic pool, and 5 sports arenas.',
      src: '/kohinoor_hero_card.jpg',
      features: [
        { icon: '🏆', title: '5 Sports Arenas', desc: 'Tennis, badminton, basketball, squash & cricket practice pitch' },
        { icon: '🏊‍♂️', title: 'Swimming Pool', desc: 'Olympic-grade swimming pool with kid splash deck & sun loungers' },
        { icon: '🛡️', title: 'MahaRERA P52100029650', desc: '100% verified legal clear title with on-time possession commitment' },
        { icon: '📍', title: 'Phase 1 Prime', desc: 'Immediate proximity to Rajiv Gandhi Infotech Park, Wipro & Infosys' }
      ]
    },
    {
      id: 2,
      tag: 'Spacious Living Room',
      icon: '🛋️',
      roomName: 'Living Room',
      title: 'Grand Living & Dining Room — Airy Open-Plan Layout',
      subtitle: 'Expansive vitrified flooring, large sliding French balcony glass windows, and unhindered natural sunlight for modern family living.',
      src: '/kohinoor_living_room.jpg',
      features: [
        { icon: '🛋️', title: 'Generous Space', desc: 'Thoughtfully planned layout accommodating large sofa set and dining table' },
        { icon: '☀️', title: 'French Balcony', desc: 'Full-height safety grill with sliding glass doors opening to scenic vista' },
        { icon: '✨', title: 'Vitrified Finish', desc: 'Glossy premium nano-finish vitrified floor tiles with immaculate reflection' },
        { icon: '🌬️', title: 'Cross-Ventilation', desc: 'Optimal orientation ensuring fresh cool airflow throughout the day' }
      ]
    },
    {
      id: 3,
      tag: 'Designer Modular Kitchen',
      icon: '🍳',
      roomName: 'Modular Kitchen',
      title: 'Premium Modular Kitchen — Polished Granite & Ample Storage',
      subtitle: 'Pre-fitted high-gloss purple overhead and under-counter cabinets, stainless steel sink, branded water purifier, and dedicated utility zone.',
      src: '/kohinoor_kitchen_1.jpg',
      features: [
        { icon: '🍳', title: 'Modular Cabinets', desc: 'Sleek soft-close drawers and overhead cabinetry in designer dual-tone finish' },
        { icon: '🖤', title: 'Granite Counter', desc: 'Heavy-duty polished jet black granite platform with glazed ceramic dado' },
        { icon: '💧', title: 'Water Purifier', desc: 'Dedicated electrical and plumbing setup with pre-mounted RO purifier' },
        { icon: '🍽️', title: 'Stainless Sink', desc: 'Deep-bowl SS sink with designer chrome swivel neck mixer faucet' }
      ]
    },
    {
      id: 4,
      tag: 'Master Bedroom',
      icon: '🛏️',
      roomName: 'Bedroom',
      title: 'Sunlit Master Bedroom — Calm Horizon View',
      subtitle: 'Comfortable master sanctuary with corner safety-grilled window framing scenic hillside horizon, premium electrical points, and fan fixtures.',
      src: '/kohinoor_bedroom.jpg',
      features: [
        { icon: '🛏️', title: 'King-Size Layout', desc: 'Spacious floor area for king bed, twin nightstands, and full wardrobe' },
        { icon: '🌄', title: 'Horizon Outlook', desc: 'Unobstructed green open view bringing peaceful daylight every morning' },
        { icon: '🔌', title: 'AC & Inverter Ready', desc: 'Pre-wired electrical conduits for split air-conditioner and concealed lights' },
        { icon: '🛡️', title: 'Safety Grill', desc: 'Powder-coated heavy-gauge MS security grill on sound-insulated window' }
      ]
    },
    {
      id: 5,
      tag: 'Kitchen & Extended Utility',
      icon: '🚰',
      roomName: 'Kitchen Utility',
      title: 'Kitchen Utility & Service Balcony',
      subtitle: 'Separate wet preparation counter and utility platform with exhaust window, providing segregated space for washing machine and supplies.',
      src: '/kohinoor_kitchen_2.jpg',
      features: [
        { icon: '🚰', title: 'Dual Counters', desc: 'Parallel utility service platform ensuring organized and clutter-free cooking' },
        { icon: '🪟', title: 'Natural Vent', desc: 'Dedicated exterior window ensuring instant ventilation of cooking aromas' },
        { icon: '⚡', title: 'Appliance Points', desc: 'Pre-installed 16A power outlets for microwave, mixer, and dishwasher' },
        { icon: '🧼', title: 'Anti-Skid Floors', desc: 'Matte-finish anti-skid ceramic tiles for safety in wet utility zones' }
      ]
    }
  ],

  configurations: [
    {
      bhk: '3 BHK',
      badge: 'FEATURED MANDATE',
      isPopular: true,
      carpet: '930 sq.ft',
      priceText: 'Price on Request',
      priceSub: 'Resale & Direct Builder Inventory',
      desc: 'Super-spacious 3 BHK residence with expansive living-dining hall, 3 bathrooms, designer modular kitchen, and scenic French balcony.',
      features: ['930 sq.ft Verified RERA Carpet', 'Living Room + French Balcony', 'Pre-Fitted Modular Kitchen Cabinets', 'Covered Dedicated Car Parking', 'Immediate Possession Available']
    },
    {
      bhk: '2 BHK',
      badge: 'VERIFIED OPTION',
      isPopular: false,
      carpet: '630+ sq.ft',
      priceText: 'Price on Request',
      priceSub: 'Prime Investment Opportunity',
      desc: 'Optimized 2 BHK layout designed for maximum utility, cross-ventilation, and high residential demand from IT workforce in Hinjewadi Phase 1.',
      features: ['630+ sq.ft Efficient Carpet', 'Master Bed with Attached Bath', 'L-Shaped Living/Dining Space', 'Modern Lifestyle Amenities', 'High Demand by IT Expats']
    },
    {
      bhk: '1 BHK',
      badge: 'STARTER HOME',
      isPopular: false,
      carpet: '480+ sq.ft',
      priceText: 'Price on Request',
      priceSub: 'Ideal for Young Tech Professionals',
      desc: 'Compact, high-efficiency 1 BHK home walking distance to IT hubs, with access to all sports and clubhouse facilities.',
      features: ['480+ sq.ft Smart Carpet', 'Low Maintenance Outgo', 'Full Sports Campus Access', 'Walking Distance to Phase 1 Hub', 'Strong Capital Appreciation']
    }
  ],

  amenities: [
    { icon: '🏆', title: '5 Sports Arenas', desc: 'Tennis, badminton, basketball, squash, and cricket pitch' },
    { icon: '🏊‍♂️', title: 'Swimming Pool', desc: 'Olympic-size pool with dedicated kids pool and sun deck' },
    { icon: '🏋️', title: 'Fitness Gymnasium', desc: 'Fully equipped modern gym with cardio and weight training zones' },
    { icon: '🏛️', title: 'Grand Clubhouse', desc: 'Multi-level community clubhouse with indoor games and banquet' },
    { icon: '🌿', title: 'Landscaped Podiums', desc: 'Lush green landscaped podium gardens with zen seating' },
    { icon: '🏃', title: 'Jogging Track', desc: 'Dedicated rubberized jogging and cycling track around campus' },
    { icon: '🛡️', title: '24x7 Multi-Tier Security', desc: 'CCTV surveillance grid, boom barriers, and biometric access' },
    { icon: '🚗', title: 'EV Charging Bays', desc: 'Dedicated electric vehicle charging infrastructure' },
    { icon: '👶', title: 'Children Play Zone', desc: 'Adventure play park with rubberized soft flooring and creche' },
    { icon: '🧘', title: 'Yoga & Meditation Deck', desc: 'Open-air elevated deck for morning yoga and wellness' }
  ],

  proximity: [
    { label: 'Hinjewadi Phase 1 Circle', distance: '1.2 km', time: '3 mins' },
    { label: 'Infosys Hinjewadi Phase 1', distance: '1.8 km', time: '5 mins' },
    { label: 'Wipro Technologies Phase 1', distance: '2.0 km', time: '5 mins' },
    { label: 'Proposed Metro Line 3 Station', distance: '800 m', time: '2 mins' },
    { label: 'Ruby Hall Clinic Hinjewadi', distance: '2.5 km', time: '6 mins' },
    { label: 'Mumbai-Pune Expressway Bypass', distance: '4.5 km', time: '10 mins' },
    { label: 'Sayaji Hotel / Wakad Junction', distance: '3.8 km', time: '8 mins' }
  ],

  faqs: [
    {
      q: 'What makes Kohinoor Sportsville unique in Hinjewadi Phase 1?',
      a: 'Kohinoor Sportsville is Pune West premier sports-centric luxury residential development. Unlike conventional developments, it integrates 5 international sports arenas, an Olympic-grade swimming pool, and high-performance fitness hubs directly into the residential campus, built specifically around active, healthy living.'
    },
    {
      q: 'What is the carpet area for the featured 3 BHK residence?',
      a: 'The featured 3 BHK residence offers 930 sq.ft of verified MahaRERA carpet area, meticulously planned with an expansive living room, French balcony, master suite, modular kitchen, and designated utility zone.'
    },
    {
      q: 'Is Kohinoor Sportsville MahaRERA registered?',
      a: 'Yes. Kohinoor Sportsville is registered with MahaRERA under registration number P52100029650. 24K Realtors provides complete documentation verification and transparent dossier review.'
    },
    {
      q: 'How close is Kohinoor Sportsville to Hinjewadi Phase 1 IT parks?',
      a: 'Kohinoor Sportsville is situated in the prime core of Hinjewadi Phase 1, just 3 minutes from Phase 1 circle and 5 minutes from Infosys, Wipro, Tata Technologies, and Cognizant.'
    },
    {
      q: 'How can I schedule a private flat walkthrough and get pricing?',
      a: 'You can contact 24K Realtors directly via WhatsApp (+91 96730 00053) or telephone. Our dedicated Phase 1 advisor will arrange an immediate on-site site visit and provide customized pricing breakups.'
    }
  ]
};

export default function KohinoorProjectPage({ onBackHome }) {
  const navigate = useNavigate();
  const p = KOHINOOR_DATA;

  const [openFaq, setOpenFaq] = useState(null);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // SEO Hook
  useSEO({
    title: 'Kohinoor Sportsville Hinjewadi Phase 1 | 3 BHK 930 Carpet | 24K Realtors',
    description: 'Kohinoor Sportsville Hinjewadi Phase 1 by Kohinoor Group. 3 BHK 930 sq.ft carpet premium residence. Real flat photos, modular kitchen, 5 sports arenas, MahaRERA P52100029650.',
    canonical: 'https://24krealtors.in/kohinoor-sportsville-hinjewadi'
  });

  const resetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    setIsDragging(false);
  };

  useEffect(() => {
    resetZoom();
  }, [lightboxIdx]);

  const handleZoomIn = (e) => {
    e?.stopPropagation?.();
    setZoomLevel(prev => Math.min(Number((prev + 0.5).toFixed(1)), 3.5));
  };

  const handleZoomOut = (e) => {
    e?.stopPropagation?.();
    setZoomLevel(prev => {
      const next = Math.max(Number((prev - 0.5).toFixed(1)), 1);
      if (next === 1) setPanPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleMouseDown = (e) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoomLevel <= 1) return;
    setPanPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowRight') setLightboxIdx(prev => (prev + 1) % p.gallery.length);
      if (e.key === 'ArrowLeft') setLightboxIdx(prev => (prev - 1 + p.gallery.length) % p.gallery.length);
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
      if (e.key === '0') resetZoom();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIdx, p.gallery.length]);

  return (
    <div style={{ background: '#05070B', color: '#F1F5F9', minHeight: '100vh', fontFamily: "'Montserrat', sans-serif" }}>
      {/* ── 1. Luxury Sticky Topbar ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(5, 7, 11, 0.94)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(229, 62, 62, 0.25)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => onBackHome ? onBackHome() : navigate('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '30px',
              padding: '6px 14px',
              color: '#CBD5E1',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#E53E3E'; e.currentTarget.style.color = '#FFFFFF'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#CBD5E1'; }}
          >
            <ArrowLeft size={14} />
            <span>All Properties</span>
          </button>
          <div style={{ height: '24px', width: '1px', background: 'rgba(255, 255, 255, 0.12)' }}></div>
          <CompanyLogo height={42} variant="compact" onClick={() => navigate('/')} />
        </div>

        {/* Project Branding in Topbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'none', md: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                background: '#E53E3E',
                color: '#fff',
                fontSize: '0.62rem',
                fontWeight: 900,
                padding: '2px 6px',
                borderRadius: '3px'
              }}>
                KOHINOOR
              </span>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.04em' }}>
                SPORTSVILLE
              </span>
            </div>
            <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Hinjewadi Phase 1 · RERA: {p.rera}</span>
          </div>

          <a
            href={`https://wa.me/919673000053?text=${encodeURIComponent(p.whatsappText)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#22C55E',
              borderRadius: '30px',
              padding: '8px 16px',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 2px 10px rgba(34, 197, 94, 0.3)'
            }}
          >
            <MessageSquare size={14} />
            <span>Book Visit</span>
          </a>
        </div>
      </header>

      {/* ── 2. Hero Section with Official Kohinoor Branding ── */}
      <section style={{
        position: 'relative',
        padding: '50px 24px 40px 24px',
        background: 'radial-gradient(ellipse at 50% 10%, rgba(229, 62, 62, 0.18) 0%, rgba(5, 7, 11, 0.98) 70%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Badge & Official Developer Pill */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{
              background: 'linear-gradient(135deg, #E53E3E 0%, #9B2C2C 100%)',
              color: '#FFFFFF',
              fontSize: '0.72rem',
              fontWeight: 900,
              letterSpacing: '0.08em',
              padding: '4px 12px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 12px rgba(229, 62, 62, 0.4)'
            }}>
              <Trophy size={13} />
              SPORTS-CENTRIC LIVING
            </span>

            <span style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '4px',
              padding: '4px 10px',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#34D399',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <ShieldCheck size={13} color="#10B981" />
              <span>MahaRERA Registered: {p.rera}</span>
            </span>

            <span style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '4px',
              padding: '4px 10px',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#F5D77F'
            }}>
              ★ 3 BHK Featured: 930 sq.ft Carpet
            </span>
          </div>

          {/* Main Title & Tagline */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'center' }}>
            <div>
              {/* Official Kohinoor Sportsville Brand Lockup */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #E53E3E 0%, #C53030 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 20px rgba(229, 62, 62, 0.45)',
                  flexShrink: 0
                }}>
                  <span style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 900,
                    fontSize: '1.9rem',
                    color: '#FFFFFF'
                  }}>
                    K
                  </span>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', color: '#FEB2B2', textTransform: 'uppercase' }}>
                    KOHINOOR GROUP PRESENTS
                  </div>
                  <h1 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    margin: '2px 0 0 0',
                    lineHeight: 1.15
                  }}>
                    Kohinoor Sportsville
                  </h1>
                </div>
              </div>

              <div style={{
                fontSize: '1.05rem',
                color: '#F1E5D1',
                fontFamily: "'Cinzel', serif",
                letterSpacing: '0.06em',
                fontWeight: 600,
                marginBottom: '12px'
              }}>
                LIVE ACTIVE. LIVE BETTER.
              </div>

              <p style={{
                fontSize: '0.92rem',
                color: '#94A3B8',
                lineHeight: 1.6,
                maxWidth: '620px',
                marginBottom: '20px'
              }}>
                {p.heroSubline}. Designed around 5 international sports arenas, Olympic swimming pool, and high-performance lifestyle facilities in the epicenter of Hinjewadi Phase 1.
              </p>

              {/* Quick Stats Strip */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '14px 16px',
                maxWidth: '540px'
              }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Featured Carpet</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F5D77F', marginTop: '2px' }}>930 sq.ft</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748B' }}>3 BHK Luxury</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sports Arenas</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>5 Olympic</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748B' }}>International Grade</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38BDF8', marginTop: '2px' }}>Phase 1</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748B' }}>Rajiv Gandhi Hub</div>
                </div>
              </div>
            </div>

            {/* Poster Showcase Card */}
            <div style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(229, 62, 62, 0.35)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(229, 62, 62, 0.15)',
              cursor: 'pointer'
            }}
            onClick={() => setLightboxIdx(0)}
            >
              <img
                src="/kohinoor_hero_card.jpg"
                alt="Kohinoor Sportsville Elevation & Poster"
                style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.4s ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              />
              <div style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                background: 'rgba(5, 7, 11, 0.85)',
                border: '1px solid rgba(229, 62, 62, 0.5)',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#FEB2B2',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backdropFilter: 'blur(6px)'
              }}>
                <Maximize2 size={13} />
                <span>Click to Full Screen Poster</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Interactive Virtual Tour Gallery (All Real Flat Photos) ── */}
      <section style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: '#E53E3E',
            textTransform: 'uppercase'
          }}>
            AUTHENTIC INTERIOR WALKTHROUGH
          </span>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.8rem, 3vw, 2.3rem)',
            color: '#FFFFFF',
            margin: '6px 0 10px 0'
          }}>
            Explore the Real 3 BHK Flat (930 sq.ft)
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8', maxWidth: '650px', margin: '0 auto' }}>
            Click on any photo below to inspect full-screen high-resolution views with pan, zoom, and interactive gallery controls.
          </p>
        </div>

        {/* Room Category Tabs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          justifyContent: 'center',
          marginBottom: '24px'
        }}>
          {p.gallery.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveGalleryIdx(idx)}
              style={{
                background: activeGalleryIdx === idx
                  ? 'linear-gradient(135deg, rgba(229, 62, 62, 0.3) 0%, rgba(197, 48, 48, 0.2) 100%)'
                  : 'rgba(255, 255, 255, 0.04)',
                border: activeGalleryIdx === idx
                  ? '1px solid #E53E3E'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '8px 16px',
                color: activeGalleryIdx === idx ? '#FEB2B2' : '#CBD5E1',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{item.icon}</span>
              <span>{item.roomName}</span>
            </button>
          ))}
        </div>

        {/* Active Room Interactive Showcase Card */}
        {(() => {
          const current = p.gallery[activeGalleryIdx];
          return (
            <div style={{
              background: 'linear-gradient(145deg, #0C101A 0%, #07090F 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                alignItems: 'stretch'
              }}>
                {/* Clickable Image Container */}
                <div
                  style={{
                    position: 'relative',
                    minHeight: '380px',
                    maxHeight: '520px',
                    overflow: 'hidden',
                    cursor: 'zoom-in',
                    background: '#000'
                  }}
                  onClick={() => setLightboxIdx(activeGalleryIdx)}
                  title="Click to open Full-Screen Lightbox with Zoom"
                >
                  <img
                    src={current.src}
                    alt={current.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />

                  {/* Room Tag Overlay */}
                  <span style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: 'rgba(5, 7, 11, 0.85)',
                    border: '1px solid rgba(229, 62, 62, 0.5)',
                    color: '#FEB2B2',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    backdropFilter: 'blur(6px)'
                  }}>
                    {current.tag}
                  </span>

                  {/* Full-Screen Pill on Image */}
                  <span style={{
                    position: 'absolute',
                    bottom: '16px',
                    right: '16px',
                    background: 'rgba(5, 7, 11, 0.88)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '30px',
                    padding: '6px 14px',
                    color: '#FFFFFF',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backdropFilter: 'blur(6px)'
                  }}>
                    <Maximize2 size={13} />
                    <span>View Full Screen</span>
                  </span>
                </div>

                {/* Details & Room Architectural Specs */}
                <div style={{
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: '#E53E3E',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: '6px'
                  }}>
                    VERIFIED FLAT ASSET · 930 SQ.FT 3 BHK
                  </div>

                  <h3 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1.45rem',
                    color: '#FFFFFF',
                    margin: '0 0 10px 0'
                  }}>
                    {current.title}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '24px' }}>
                    {current.subtitle}
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '14px',
                    marginBottom: '26px'
                  }}>
                    {current.features.map((f, fi) => (
                      <div
                        key={fi}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '8px',
                          padding: '10px 12px'
                        }}
                      >
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#F1F5F9', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{f.icon}</span>
                          <span>{f.title}</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '3px', lineHeight: 1.35 }}>
                          {f.desc}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setLightboxIdx(activeGalleryIdx)}
                      style={{
                        background: 'linear-gradient(135deg, #E53E3E 0%, #C53030 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 18px',
                        color: '#FFFFFF',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Maximize2 size={14} />
                      <span>Full Screen Lightbox</span>
                    </button>

                    <a
                      href={`https://wa.me/919673000053?text=${encodeURIComponent(`Hi 24K Realtors, I am viewing the ${current.roomName} of Kohinoor Sportsville 3 BHK (930 sq.ft). Please share live walk-in video and unit pricing.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: 'rgba(34, 197, 94, 0.12)',
                        border: '1px solid rgba(34, 197, 94, 0.4)',
                        borderRadius: '8px',
                        padding: '10px 18px',
                        color: '#4ADE80',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <MessageSquare size={14} />
                      <span>Inquire on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Thumbnail Gallery Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '12px',
          marginTop: '20px'
        }}>
          {p.gallery.map((img, i) => (
            <div
              key={img.id}
              onClick={() => {
                setActiveGalleryIdx(i);
                setLightboxIdx(i);
              }}
              style={{
                position: 'relative',
                height: '84px',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: activeGalleryIdx === i ? '2px solid #E53E3E' : '1px solid rgba(255, 255, 255, 0.1)',
                opacity: activeGalleryIdx === i ? 1 : 0.65,
                transition: 'all 0.2s ease'
              }}
              title={`View ${img.roomName}`}
            >
              <img
                src={img.src}
                alt={img.roomName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                padding: '4px 6px',
                fontSize: '0.62rem',
                color: '#FFFFFF',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {img.roomName}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Configurations & Floor Space Matrix ── */}
      <section style={{
        padding: '50px 24px',
        background: 'linear-gradient(180deg, rgba(229, 62, 62, 0.04) 0%, rgba(5, 7, 11, 0) 100%)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#E53E3E', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              RESIDENTIAL CONFIGURATIONS
            </span>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.6rem, 2.5vw, 2.1rem)',
              color: '#FFFFFF',
              margin: '6px 0'
            }}>
              Kohinoor Sportsville Floor Plans
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8' }}>
              MahaRERA: {p.rera} · All carpet areas verified as per RERA specifications.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {p.configurations.map((cfg, i) => (
              <div
                key={i}
                style={{
                  position: 'relative',
                  background: cfg.isPopular
                    ? 'linear-gradient(145deg, rgba(229, 62, 62, 0.14) 0%, rgba(15, 23, 42, 0.9) 100%)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: cfg.isPopular
                    ? '1.5px solid #E53E3E'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: cfg.isPopular ? '0 10px 30px rgba(229, 62, 62, 0.2)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                {cfg.isPopular && (
                  <span style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '24px',
                    background: 'linear-gradient(90deg, #E53E3E 0%, #FEB2B2 100%)',
                    color: '#05070B',
                    fontSize: '0.62rem',
                    fontWeight: 900,
                    padding: '3px 10px',
                    borderRadius: '4px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase'
                  }}>
                    {cfg.badge}
                  </span>
                )}

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                      {cfg.bhk}
                    </h3>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: cfg.isPopular ? '#F5D77F' : '#E2E8F0' }}>
                      {cfg.carpet}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '14px' }}>
                    {cfg.desc}
                  </div>

                  <div style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F1F5F9' }}>
                      {cfg.priceText}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                      {cfg.priceSub}
                    </div>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0' }}>
                    {cfg.features.map((feat, fi) => (
                      <li key={fi} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.78rem',
                        color: '#CBD5E1',
                        marginBottom: '8px'
                      }}>
                        <CheckCircle2 size={13} color="#E53E3E" style={{ flexShrink: 0 }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={`https://wa.me/919673000053?text=${encodeURIComponent(`Hi 24K Realtors, I am interested in ${cfg.bhk} (${cfg.carpet}) at Kohinoor Sportsville Hinjewadi Phase 1. Please send floor plan and cost sheet.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: cfg.isPopular ? '#E53E3E' : 'rgba(255, 255, 255, 0.08)',
                    border: cfg.isPopular ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '10px',
                    color: '#FFFFFF',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'block',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Request {cfg.bhk} Floor Plan
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Sports & Lifestyle Amenities Grid ── */}
      <section style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#E53E3E', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            WORLD-CLASS SPORTS INFRASTRUCTURE
          </span>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.8rem, 3vw, 2.2rem)',
            color: '#FFFFFF',
            margin: '6px 0 10px 0'
          }}>
            Amenities That Keep You Moving
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8', maxWidth: '600px', margin: '0 auto' }}>
            Designed for an active, athletic, and balanced lifestyle in Hinjewadi Phase 1.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          {p.amenities.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '20px 16px',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(229, 62, 62, 0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{item.icon}</div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F1F5F9', margin: '0 0 6px 0' }}>
                {item.title}
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: 0, lineHeight: 1.4 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Hinjewadi Phase 1 Strategic Proximity ── */}
      <section style={{
        padding: '50px 24px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#E53E3E', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              LOCATION ADVANTAGE
            </span>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.8rem',
              color: '#FFFFFF',
              margin: '6px 0'
            }}>
              Zero-Commute to Phase 1 Tech Hubs
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
              Situated in the core of Rajiv Gandhi Infotech Park Phase 1.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px'
          }}>
            {p.proximity.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '12px 18px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} color="#E53E3E" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '0.82rem', color: '#E2E8F0', fontWeight: 600 }}>{item.label}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#F5D77F' }}>{item.distance}</span>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginLeft: '6px' }}>({item.time})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Frequently Asked Questions ── */}
      <section style={{ padding: '60px 24px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#E53E3E', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            VERIFIED QUESTIONS
          </span>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.8rem',
            color: '#FFFFFF',
            margin: '6px 0'
          }}>
            Kohinoor Sportsville FAQ
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {p.faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '10px',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>{faq.q}</span>
                {openFaq === i ? <ChevronUp size={16} color="#E53E3E" /> : <ChevronDown size={16} color="#94A3B8" />}
              </button>
              {openFaq === i && (
                <div style={{
                  padding: '0 20px 16px 20px',
                  fontSize: '0.84rem',
                  color: '#94A3B8',
                  lineHeight: 1.6,
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. Full-Screen Interactive Lightbox with Zoom & Pan ── */}
      {lightboxIdx !== null && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(3, 7, 18, 0.98)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            userSelect: 'none'
          }}
          onClick={() => setLightboxIdx(null)}
        >
          {/* Lightbox Topbar */}
          <div
            style={{
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(0, 0, 0, 0.6)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              zIndex: 10
            }}
            onClick={e => e.stopPropagation()}
          >
            <div>
              <div style={{ fontSize: '0.72rem', color: '#FEB2B2', fontWeight: 800, textTransform: 'uppercase' }}>
                {p.gallery[lightboxIdx].tag} · PHOTO {lightboxIdx + 1} OF {p.gallery.length}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>
                {p.gallery[lightboxIdx].title}
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleZoomIn}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.78rem'
                }}
                title="Zoom In (+)"
              >
                <ZoomIn size={14} />
                <span>Zoom</span>
              </button>

              <button
                onClick={handleZoomOut}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.78rem'
                }}
                title="Zoom Out (-)"
              >
                <ZoomOut size={14} />
              </button>

              <button
                onClick={resetZoom}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.78rem'
                }}
                title="Reset Zoom (0)"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>

              <button
                onClick={() => setLightboxIdx(null)}
                style={{
                  background: 'rgba(229, 62, 62, 0.2)',
                  border: '1px solid #E53E3E',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.78rem',
                  fontWeight: 700
                }}
                title="Close (Esc)"
              >
                <X size={14} />
                <span>Close</span>
              </button>
            </div>
          </div>

          {/* Lightbox Main Stage */}
          <div
            style={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={e => e.stopPropagation()}
          >
            {/* Left Nav Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((lightboxIdx - 1 + p.gallery.length) % p.gallery.length);
              }}
              style={{
                position: 'absolute',
                left: '20px',
                zIndex: 20,
                background: 'rgba(5, 7, 11, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '46px',
                height: '46px',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ChevronLeft size={24} />
            </button>

            {/* Main Stage Image */}
            <img
              src={p.gallery[lightboxIdx].src}
              alt={p.gallery[lightboxIdx].title}
              style={{
                maxWidth: '92vw',
                maxHeight: '75vh',
                objectFit: 'contain',
                transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease',
                pointerEvents: 'auto'
              }}
            />

            {/* Right Nav Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx((lightboxIdx + 1) % p.gallery.length);
              }}
              style={{
                position: 'absolute',
                right: '20px',
                zIndex: 20,
                background: 'rgba(5, 7, 11, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '46px',
                height: '46px',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Lightbox Bottom Thumbnails & Subtitle */}
          <div
            style={{
              padding: '14px 24px',
              background: 'rgba(0, 0, 0, 0.7)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              zIndex: 10
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', textAlign: 'center', maxWidth: '800px' }}>
              {p.gallery[lightboxIdx].subtitle}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {p.gallery.map((g, gi) => (
                <div
                  key={g.id}
                  onClick={() => setLightboxIdx(gi)}
                  style={{
                    width: '64px',
                    height: '44px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: lightboxIdx === gi ? '2px solid #E53E3E' : '1px solid rgba(255, 255, 255, 0.2)',
                    opacity: lightboxIdx === gi ? 1 : 0.5,
                    cursor: 'pointer'
                  }}
                >
                  <img src={g.src} alt={g.roomName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 9. Sticky Bottom Mobile Action Bar ── */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 35,
        background: 'rgba(5, 7, 11, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(229, 62, 62, 0.3)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.5)'
      }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#FEB2B2', fontWeight: 800 }}>
            3 BHK · 930 SQ.FT CARPET
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>
            Kohinoor Sportsville
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <a
            href="tel:+919673000053"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '9px 14px',
              color: '#FFFFFF',
              fontSize: '0.8rem',
              fontWeight: 700,
              textDecoration: 'none'
            }}
          >
            <Phone size={13} />
            <span>Call</span>
          </a>

          <a
            href={`https://wa.me/919673000053?text=${encodeURIComponent(p.whatsappText)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#22C55E',
              borderRadius: '8px',
              padding: '9px 16px',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)'
            }}
          >
            <MessageSquare size={14} />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
