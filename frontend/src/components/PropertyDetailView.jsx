import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  MapPin, ShieldCheck, Bed, Bath, Maximize, Sparkles,
  Car, Calculator, TrendingUp, HelpCircle,
  MessageSquare, ChevronLeft, ChevronRight, Download,
  Building, CheckCircle, FileText, ArrowRight, ArrowLeft,
  Share2, Heart, Award, Wifi, Zap, Camera, Trees, Coffee,
  Dumbbell, ParkingCircle, Droplets, UtensilsCrossed, Phone,
  Star, Shield, Sun, Wind, Tv, Lock, Play, X, ZoomIn,
  Home, Grid, Map, Video, Info, ChevronDown, RotateCw,
  Navigation, Clock, CheckSquare, Compass, Cpu, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/apiService';
import { useSEO, buildPropertySEO } from '../services/seoService';

/* ─── Netflix UI Global Styles ───────────────────────────── */
if (typeof document !== 'undefined' && !document.getElementById('nflx-styles')) {
  const style = document.createElement('style');
  style.id = 'nflx-styles';
  style.textContent = `
    :root {
      --nflx-bg: #141414;
      --nflx-card: #181818;
      --nflx-card-hover: #232323;
      --nflx-gold: #E5A93C;
      --nflx-gold-bright: #F5C518;
      --nflx-red: #E50914;
      --nflx-text: #FFFFFF;
      --nflx-muted: #AAAAAA;
      --nflx-border: rgba(255,255,255,0.08);
      --font-serif: 'Playfair Display', Georgia, serif;
      --font-sans: 'Inter', system-ui, sans-serif;
    }
    .nflx-hide::-webkit-scrollbar { display: none; }
    .nflx-hide { -ms-overflow-style: none; scrollbar-width: none; }
    .nflx-card {
      background: var(--nflx-card);
      border: 1px solid var(--nflx-border);
      border-radius: 12px;
      transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.35s, border-color 0.35s;
      will-change: transform;
    }
    .nflx-card:hover {
      transform: translateY(-6px) scale(1.02);
      border-color: rgba(229, 169, 60, 0.5);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.8);
      z-index: 2;
    }
    .nflx-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .nflx-btn-primary {
      background: linear-gradient(135deg, #E5A93C, #F5C518);
      color: #0A0A0A;
      border: none;
      font-family: var(--font-sans);
      font-weight: 700;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .nflx-btn-primary:hover {
      transform: scale(1.03);
      filter: brightness(1.1);
      box-shadow: 0 8px 24px rgba(229,169,60,0.4);
    }
    .nflx-btn-secondary {
      background: rgba(255,255,255,0.1);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.2);
      font-family: var(--font-sans);
      font-weight: 600;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.2s;
    }
    .nflx-btn-secondary:hover {
      background: rgba(255,255,255,0.2);
      border-color: var(--nflx-gold);
    }
    .nflx-range {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 4px;
      background: rgba(255,255,255,0.12);
      border-radius: 2px;
      outline: none;
    }
    .nflx-range::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #F5C518;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(245,197,24,0.6);
    }
  `;
  document.head.appendChild(style);
}

/* ── Builder Lookup ── */
const getBuilderInfo = (title = '') => {
  if (title.includes('24K') || title.includes('Opula') || title.includes('Sereno') || title.includes('Altura') || title.includes('Glitterati') || title.includes('Mahalunge'))
    return { name: 'Kolte-Patil Developers', brand: '24K Luxury Series', reraId: 'A52100028461', logo: '🏛️', rating: 4.9, year: '1991', projects: '85+', desc: 'Kolte-Patil 24K represents architectural precision, smart home integration, and prime landmark locations across Pune.' };
  if (title.includes('Shapoorji') || title.includes('Joyville') || title.includes('Vyomora'))
    return { name: 'Shapoorji Pallonji', brand: 'Joyville Landmark Series', reraId: 'PR1260002600999', logo: '🏗️', rating: 4.8, year: '1865', projects: '120+', desc: 'Over 160 years of engineering legacy delivering landmark structural quality across major Indian metro corridors.' };
  if (title.includes('Godrej') || title.includes('Ivara'))
    return { name: 'Godrej Properties', brand: 'Signature Luxury Homes', reraId: 'PR1260002502426', logo: '🌿', rating: 4.9, year: '1990', projects: '165+', desc: 'Combining trust, cutting-edge sustainability, and luxury amenities.' };
  if (title.includes('Kasturi'))
    return { name: 'Kasturi Builders', brand: 'Signature Penthouses', reraId: 'A52100045231', logo: '💎', rating: 4.8, year: '1998', projects: '42+', desc: 'Renowned for Italian marble finishes and double-height luxury lobbies.' };
  if (title.includes('Lodha'))
    return { name: 'Lodha Group', brand: 'World-Class Residences', reraId: 'A52100033211', logo: '🌍', rating: 4.8, year: '1980', projects: '200+', desc: 'India’s premier real estate developer delivering world-class residential towers.' };
  return { name: 'Tier-1 Authorized Builder', brand: 'Verified Partner', reraId: 'A52100028461', logo: '🏠', rating: 4.7, year: '2005', projects: '30+', desc: 'Managed under 24K Realtors authorized developer alliance.' };
};

/* ── Corridor Location Data ── */
const CORRIDOR_DATA = {
  HINJEWADI: { appreciation: 14.2, commute: 9.5, green: 8.8, infra: 9.4, social: 9.1, future: 9.6, rentalYield: 4.8, landmarks: ['Infosys Circle 1 (0.8 km)', 'Wipro SEZ (1.5 km)', 'Metro Line 3 (0.4 km)', 'Balewadi High Street (5.2 km)', 'International Airport (28 km)'] },
  WAKAD: { appreciation: 13.8, commute: 9.1, green: 8.2, infra: 8.9, social: 8.8, future: 9.0, rentalYield: 4.5, landmarks: ['Wakad Chowk (0.5 km)', 'D-Mart Wakad (1.0 km)', 'Pimpri Railway (7 km)', 'Aditya Birla Hospital (3.5 km)'] },
  BANER: { appreciation: 16.5, commute: 9.8, green: 9.0, infra: 9.6, social: 9.5, future: 9.7, rentalYield: 5.2, landmarks: ['Balewadi High Street (0.5 km)', 'Jupiter Hospital (1.8 km)', 'Baner Metro (0.6 km)', 'Expressway (2.0 km)'] },
  BALEWADI: { appreciation: 15.8, commute: 9.4, green: 8.7, infra: 9.2, social: 9.1, future: 9.4, rentalYield: 5.0, landmarks: ['Balewadi Stadium (0.6 km)', 'High Street Phoenix (1.0 km)', 'Croma Mall (1.5 km)', 'Baner Road (0.8 km)'] },
  KHARADI: { appreciation: 15.2, commute: 9.0, green: 8.4, infra: 9.1, social: 8.9, future: 9.2, rentalYield: 4.9, landmarks: ['EON IT Park (0.4 km)', 'World Trade Center (0.8 km)', 'Airport (5.5 km)', 'Koregaon Park (4.5 km)'] },
};
const getCorridorData = (location = '') => {
  const key = location.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z_]/g, '');
  for (const [k, v] of Object.entries(CORRIDOR_DATA)) { if (key.includes(k)) return v; }
  return { appreciation: 14.0, commute: 9.0, green: 8.5, infra: 8.8, social: 8.6, future: 9.0, rentalYield: 4.5, landmarks: ['Tech Park (1.2 km)', 'International School (0.8 km)', 'Expressway (2.5 km)', 'Hospital (3.0 km)'] };
};

/* ── Amenity Catalog ── */
const AMENITY_META = {
  '24/7 Concierge Desk': { emoji: '🛎️', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=500&q=75' },
  'Infinity Sky Pool': { emoji: '🏊', img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=500&q=75' },
  'Infinity Swimming Pool': { emoji: '🏊', img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=500&q=75' },
  'Modern Gymnasium': { emoji: '💪', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=500&q=75' },
  'Smart Home Automation': { emoji: '📱', img: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=500&q=75' },
  'Landscaped Gardens': { emoji: '🌿', img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=500&q=75' },
  'Clubhouse & Co-work Space': { emoji: '🏛️', img: 'https://images.unsplash.com/photo-1527192491265-7e452a145d55?auto=format&fit=crop&w=500&q=75' },
  'Kids Play Area': { emoji: '🎠', img: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=500&q=75' },
  'Multi-Level Car Parking': { emoji: '🅿️', img: 'https://images.unsplash.com/photo-1506521788723-868126d5e368?auto=format&fit=crop&w=500&q=75' },
  '100% Power Backup Grid': { emoji: '⚡', img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=500&q=75' },
  '24x7 Security': { emoji: '🛡️', img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=500&q=75' },
  'Indoor Games': { emoji: '🎱', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=500&q=75' },
};

/* ── Lightbox ── */
function Lightbox({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  useEffect(() => {
    const h = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx(i => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setIdx(i => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [images.length, onClose]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 44, height: 44, color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
      <button onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }} style={{ position: 'absolute', left: 20, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 48, height: 48, color: '#fff', cursor: 'pointer' }}><ChevronLeft size={24} /></button>
      <img src={images[idx]} alt="Gallery" style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 12 }} onClick={e => e.stopPropagation()} />
      <button onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }} style={{ position: 'absolute', right: 20, background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 48, height: 48, color: '#fff', cursor: 'pointer' }}><ChevronRight size={24} /></button>
    </div>
  );
}

/* ── FAQ Accordion ── */
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: open ? '#F5C518' : '#E8E8E8' }}>{q}</span>
        <span style={{ color: open ? '#F5C518' : '#888', fontSize: '1.2rem' }}>{open ? '−' : '+'}</span>
      </button>
      {open && <p style={{ fontSize: '0.85rem', color: '#AAA', lineHeight: 1.6, paddingBottom: 16, margin: 0 }}>{a}</p>}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT — ULTRA FAST NETFLIX UI PROPERTY VIEW
════════════════════════════════════════════════════════════ */
export default function PropertyDetailView({ property, onBack, onOpenInquiry, onOpenBrochure, formatPrice, getEmbedVideoUrl, allProperties = [] }) {

  /* ── Performance Throttled Scroll State ── */
  const [scrolledHeader, setScrolledHeader] = useState(false);
  const [showBottomBar, setShowBottomBar]   = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          setScrolledHeader(y > 80);
          setShowBottomBar(y > 500);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Interactive States ── */
  const [activePlan, setActivePlan]       = useState('2bhk');
  const [downPayment, setDownPayment]     = useState(20);
  const [interestRate, setInterestRate]   = useState(8.5);
  const [loanTerm, setLoanTerm]           = useState(20);
  const [lightboxOpen, setLightboxOpen]   = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isWishlisted, setIsWishlisted]   = useState(() => {
    try { const s = localStorage.getItem('wishlist_properties'); return (s ? JSON.parse(s) : []).includes(property.id); }
    catch { return false; }
  });

  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  useEffect(() => {
    const r = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
  }, []);

  /* ── Memoized Data Calculations ── */
  const s3Slug = useMemo(() => {
    if (!property) return '24k-opula';
    const t = (property.title || '').toLowerCase();
    if (t.includes('opula')) return '24k-opula';
    if (t.includes('altura')) return '24k-altura';
    if (t.includes('it plaza') || t.includes('hinjewadi office')) return 'hinjewadi-it-plaza';
    if (t.includes('balewadi') && t.includes('retail')) return 'balewadi-retail';
    if (t.includes('glitterati')) return '24k-glitterati';
    if (t.includes('studio') || t.includes('corporate tower')) return 'baner-studio';
    if (t.includes('mahalunge oasis')) return '24k-mahalunge-oasis';
    if (t.includes('megapolis splendour')) return 'megapolis-splendour';
    if (t.includes('godrej elements')) return 'godrej-elements';
    if (t.includes('tcg') || t.includes('crown greens')) return 'tcg-crown-greens';
    if (t.includes('kasturi') || t.includes('apostle')) return 'kasturi-apostle';
    if (t.includes('life republic')) return 'kolte-patil-life-republic';
    if (t.includes('gera')) return 'gera-joy-banks';
    if (t.includes('pride purple') || t.includes('park landmark')) return 'pride-purple-park';
    if (t.includes('megapolis sunway')) return 'megapolis-sunway';
    if (t.includes('kohinoor') || t.includes('sportsville')) return 'kohinoor-sportsville';
    if (t.includes('vtp') || t.includes('blue waters')) return 'vtp-blue-waters';
    if (t.includes('vyomora') || t.includes('joyville premium')) return 'shapoorji-joyville-vyomora';
    if (t.includes('yashwin')) return 'vilas-javdekar-yashwin';
    if (t.includes('belmondo') || t.includes('lodha belmondo')) return 'lodha-belmondo';
    if (t.includes('godrej ivara') || t.includes('kharadi')) return 'godrej-ivara-kharadi';
    return '24k-opula';
  }, [property]);

  const s3BaseUrl = `https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/${s3Slug}`;

  const builder  = useMemo(() => getBuilderInfo(property.title), [property.title]);
  const corridor = useMemo(() => getCorridorData(property.location), [property.location]);
  useSEO(buildPropertySEO(property));

  const slideshowImages = useMemo(() => property.slideshowImages || [
    `${s3BaseUrl}/hero.png`, `${s3BaseUrl}/living.png`, `${s3BaseUrl}/kitchen.png`,
    `${s3BaseUrl}/bedroom.png`, `${s3BaseUrl}/pool.png`, `${s3BaseUrl}/floorplan_2bhk.png`,
    `${s3BaseUrl}/floorplan_3bhk.png`, `${s3BaseUrl}/masterplan.png`,
  ], [property.slideshowImages, s3BaseUrl]);

  const propPrice = useMemo(() => Number(property.price || 8400000), [property.price]);

  const fmt = useCallback(v => {
    if (formatPrice) return formatPrice(v);
    const n = Number(v);
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(0)} L`;
    return `₹${n.toLocaleString('en-IN')}`;
  }, [formatPrice]);

  /* ── EMI Memo ── */
  const emiVal = useMemo(() => {
    const principal = propPrice * (1 - downPayment / 100);
    const mRate     = (interestRate / 12) / 100;
    const totalMos  = loanTerm * 12;
    return mRate > 0 ? (principal * mRate * Math.pow(1 + mRate, totalMos)) / (Math.pow(1 + mRate, totalMos) - 1) : principal / totalMos;
  }, [propPrice, downPayment, interestRate, loanTerm]);

  /* ── Similar Properties Memo ── */
  const similar = useMemo(() => {
    return allProperties
      .filter(p => p.id !== property.id)
      .slice(0, 4);
  }, [allProperties, property.id]);

  const waLink = `https://wa.me/919673000053?text=Hi%2024K%20Realtors,%20I'm%20interested%20in%20"${encodeURIComponent(property.title)}"%20at%20${encodeURIComponent(property.location)}.`;

  const fpVariants = [
    { id: '2bhk', label: '2 BHK Luxury', url: property.floorPlanUrl || `${s3BaseUrl}/floorplan_2bhk.png`, desc: '684 – 839 sq.ft' },
    { id: '3bhk', label: '3 BHK Estate', url: property.floorPlan3BHKUrl || `${s3BaseUrl}/floorplan_3bhk.png`, desc: '1052 – 1477 sq.ft' },
    { id: 'master', label: 'Masterplan', url: property.masterPlanUrl || `${s3BaseUrl}/masterplan.png`, desc: '16-Acre Layout' },
  ];
  const fpActive = fpVariants.find(v => v.id === activePlan) || fpVariants[0];

  const amenityList = property.specificAmenities || [
    '24/7 Concierge Desk', 'Infinity Swimming Pool', 'Modern Gymnasium', 'Kids Play Area',
    'Landscaped Gardens', 'Clubhouse & Co-work Space', 'Indoor Games', '24x7 Security'
  ];

  /* ══════════════════ NETFLIX UI RENDER ══════════════════ */
  return (
    <div style={{ background: '#141414', color: '#FFF', fontFamily: 'var(--font-sans)', minHeight: '100vh', paddingBottom: '80px' }}>

      {/* ── NETFLIX HEADER ── */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: scrolledHeader ? 'rgba(20,20,20,0.95)' : 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)', backdropFilter: scrolledHeader ? 'blur(10px)' : 'none', borderBottom: scrolledHeader ? '1px solid rgba(255,255,255,0.08)' : 'none', transition: 'background 0.3s' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.88rem' }}>
          <ChevronLeft size={20} /> Back to Catalog
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="nflx-badge" style={{ background: '#E50914', color: '#fff' }}>NETFLIX REALTY</span>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 800, color: '#F5C518' }}>24K REALTORS</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="tel:+919673000053" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, display: isMobile ? 'none' : 'block' }}>📞 +91 96730 00053</a>
          <button onClick={onOpenInquiry} className="nflx-btn-primary" style={{ padding: '8px 18px', fontSize: '0.82rem' }}>Book Visit</button>
        </div>
      </header>

      {/* ── NETFLIX HERO ROW ── */}
      <section style={{ position: 'relative', height: isMobile ? '70vh' : '82vh', minHeight: '500px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <img src={slideshowImages[0]} alt={property.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'; }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #141414 0%, rgba(20,20,20,0.6) 40%, rgba(0,0,0,0.2) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(20,20,20,0.8) 0%, transparent 60%)' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: isMobile ? '24px 16px' : '48px 24px', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <span className="nflx-badge" style={{ background: '#E5A93C', color: '#000' }}>★ 4.9 RATING</span>
            <span className="nflx-badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>RERA: {property.reraNumber || builder.reraId}</span>
            <span className="nflx-badge" style={{ background: '#10B981', color: '#fff' }}>{property.transactionType || 'BUY'}</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? '2.2rem' : '3.6rem', fontWeight: 800, margin: '0 0 10px', lineHeight: 1.1, color: '#FFF' }}>
            {property.title}
          </h1>

          <p style={{ fontSize: '0.95rem', color: '#DDD', margin: '0 0 20px', maxWidth: 650 }}>
            📍 {property.address || `${property.location}, Pune`} • <strong style={{ color: '#F5C518' }}>{fmt(propPrice)}</strong> Starting
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={onOpenInquiry} className="nflx-btn-primary" style={{ padding: '14px 28px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Play size={18} fill="#0A0A0A" /> Book Site Visit
            </button>
            <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 24px', borderRadius: 6, background: 'rgba(37,211,102,0.2)', border: '1px solid rgba(37,211,102,0.4)', color: '#25D166', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
              <MessageSquare size={18} /> WhatsApp
            </a>
            {onOpenBrochure && (
              <button onClick={onOpenBrochure} className="nflx-btn-secondary" style={{ padding: '14px 24px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Download size={18} /> Download Brochure
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── NETFLIX CONTENT CONTAINER ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '24px 16px' : '40px 24px', boxSizing: 'border-box' }}>

        {/* 1. NETFLIX QUICK STATS ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12, marginBottom: 48 }}>
          {[
            { label: 'CARPET AREA', val: `${property.areaSquareFeet || 990} sq.ft`, icon: '📐' },
            { label: 'CONFIGURATION', val: `${property.bedrooms || 2} & 3 BHK`, icon: '🏠' },
            { label: 'POSSESSION', val: property.possessionDate || 'Dec 2027', icon: '📅' },
            { label: 'BUILDER LEGACY', val: builder.name, icon: '🏛️' },
          ].map((s, i) => (
            <div key={i} className="nflx-card" style={{ padding: '18px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: '0.68rem', color: '#888', fontWeight: 700, letterSpacing: '0.08em', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* 2. NETFLIX CAROUSEL: GALLERY POSTERS */}
        <div style={{ marginBottom: 48 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 16, color: '#FFF', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 4, height: 18, background: '#E50914', borderRadius: 2 }} /> Gallery & Scene Previews
          </h3>
          <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 10 }} className="nflx-hide">
            {slideshowImages.map((img, i) => (
              <div key={i} onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }} className="nflx-card" style={{ flexShrink: 0, width: isMobile ? 220 : 280, aspectRatio: '16/10', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}>
                <img src={img} alt={`Preview ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=75'; }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                <div style={{ position: 'absolute', bottom: 10, left: 10, fontSize: '0.75rem', fontWeight: 700, color: '#FFF' }}>Scene #{i + 1}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. NETFLIX ROW: ABOUT & SPECS */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: 24, marginBottom: 48 }}>
          <div className="nflx-card" style={{ padding: 28 }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 14px', color: '#F5C518' }}>Project Dossier</h3>
            <p style={{ fontSize: '0.9rem', color: '#BBB', lineHeight: 1.7, margin: '0 0 20px' }}>
              {property.description || `${property.title} delivers ultra-luxury living standards in ${property.location}, Pune. Designed with modern architecture, premium amenities, and high capital appreciation potential.`}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <div style={{ background: '#111', padding: 14, borderRadius: 8 }}>
                <div style={{ fontSize: '0.72rem', color: '#888' }}>RERA NUMBER</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>{property.reraNumber || builder.reraId}</div>
              </div>
              <div style={{ background: '#111', padding: 14, borderRadius: 8 }}>
                <div style={{ fontSize: '0.72rem', color: '#888' }}>PROJECT STATUS</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10B981' }}>{property.constructionStatus || 'Under Construction'}</div>
              </div>
            </div>
          </div>

          <div className="nflx-card" style={{ padding: 24, background: 'linear-gradient(135deg, #1A1A1A, #222)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 16px', color: '#E5A93C' }}>AI Investment Rating</h4>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#F5C518', marginBottom: 4 }}>89 <span style={{ fontSize: '1rem', color: '#888' }}>/ 100</span></div>
            <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 700, marginBottom: 16 }}>★ Top 5% Appreciation Corridor</div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 6 }}><span style={{ color: '#888' }}>Rental Yield:</span><strong>{corridor.rentalYield}%</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}><span style={{ color: '#888' }}>5Y CAGR:</span><strong>{corridor.appreciation}%</strong></div>
            </div>
          </div>
        </div>

        {/* 4. NETFLIX CAROUSEL: FLOOR PLANS */}
        <div style={{ marginBottom: 48 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 16, color: '#FFF', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 4, height: 18, background: '#E5A93C', borderRadius: 2 }} /> Floor Blueprints & Layouts
          </h3>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            {fpVariants.map(v => (
              <button key={v.id} onClick={() => setActivePlan(v.id)} style={{ padding: '8px 18px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', background: activePlan === v.id ? '#F5C518' : 'rgba(255,255,255,0.08)', color: activePlan === v.id ? '#000' : '#FFF' }}>
                {v.label}
              </button>
            ))}
          </div>
          <div className="nflx-card" style={{ padding: 20, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20, alignItems: 'center' }}>
            <div style={{ background: '#0A0A0A', borderRadius: 8, padding: 16, textAlign: 'center' }}>
              <img src={fpActive.url} alt={fpActive.label} style={{ maxWidth: '100%', maxHeight: 280, objectFit: 'contain' }} onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=600&q=75'; }} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#FFF', margin: '0 0 12px' }}>{fpActive.label} Specifications</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 6 }}><span style={{ color: '#888' }}>Carpet Area:</span><strong>{fpActive.desc}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 6 }}><span style={{ color: '#888' }}>Parking:</span><strong>2 Slots Included</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 6 }}><span style={{ color: '#888' }}>Pricing:</span><strong style={{ color: '#F5C518' }}>On Request</strong></div>
              </div>
              <button onClick={onOpenInquiry} className="nflx-btn-primary" style={{ width: '100%', padding: '12px', marginTop: 20, fontSize: '0.85rem' }}>Request Complete Floorplan PDF</button>
            </div>
          </div>
        </div>

        {/* 5. NETFLIX CAROUSEL: PHOTO AMENITIES */}
        <div style={{ marginBottom: 48 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 16, color: '#FFF', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 4, height: 18, background: '#10B981', borderRadius: 2 }} /> Lifestyle & Amenities Catalog
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 14 }}>
            {amenityList.map((label, i) => {
              const meta = AMENITY_META[label] || { emoji: '✨', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=75' };
              return (
                <div key={i} className="nflx-card" style={{ overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}>
                  <img src={meta.img} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=500&q=75'; }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }} />
                  <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '1rem' }}>{meta.emoji}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFF' }}>{label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. NETFLIX MATRIX: EMI CALCULATOR */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24, marginBottom: 48 }}>
          <div className="nflx-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 20px', color: '#F5C518' }}>Smart EMI Calculator</h3>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#888', marginBottom: 6 }}><span>Down Payment:</span><strong style={{ color: '#FFF' }}>{downPayment}% ({fmt(propPrice * downPayment / 100)})</strong></div>
              <input type="range" min={10} max={50} value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} className="nflx-range" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#888', marginBottom: 6 }}><span>Interest Rate:</span><strong style={{ color: '#FFF' }}>{interestRate}%</strong></div>
              <input type="range" min={6.5} max={12} step={0.1} value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} className="nflx-range" />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#888', marginBottom: 6 }}><span>Tenure:</span><strong style={{ color: '#FFF' }}>{loanTerm} Years</strong></div>
              <input type="range" min={5} max={30} value={loanTerm} onChange={e => setLoanTerm(Number(e.target.value))} className="nflx-range" />
            </div>
            <div style={{ background: '#111', padding: 16, borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: '#888' }}>ESTIMATED MONTHLY EMI</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F5C518' }}>₹{Math.round(emiVal).toLocaleString('en-IN')}</div>
            </div>
          </div>

          {/* Location Landmarks */}
          <div className="nflx-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 20px', color: '#FFF' }}>Nearby Landmarks & Transit</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {corridor.landmarks.map((lm, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#111', padding: '12px 14px', borderRadius: 8 }}>
                  <Navigation size={16} color="#F5C518" />
                  <span style={{ fontSize: '0.85rem', color: '#DDD', fontWeight: 500 }}>{lm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7. NETFLIX FAQ ACCORDION */}
        <div style={{ marginBottom: 48 }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 16, color: '#FFF' }}>Frequently Asked Questions</h3>
          <div className="nflx-card" style={{ padding: '8px 24px' }}>
            <FAQItem q="What is the expected possession date?" a={`Expected possession is ${property.possessionDate || 'December 2027'}. Monthly construction updates are shared.`} />
            <FAQItem q="Is the property RERA approved?" a={`Yes, RERA Number: ${property.reraNumber || builder.reraId}. Certified on MahaRERA portal.`} />
            <FAQItem q="What payment plans are available?" a="Construction Linked Plan (CLP) and Flexi Payment Plans are available with zero cost site visits." />
            <FAQItem q="Are there any hidden costs?" a="Zero hidden costs. Stamp duty, GST and registration details are provided transparently." />
          </div>
        </div>

      </div>

      {/* ── LIGHTBOX MODAL ── */}
      {lightboxOpen && <Lightbox images={slideshowImages} startIndex={lightboxIndex} onClose={() => setLightboxOpen(false)} />}

      {/* ── NETFLIX STICKY BOTTOM BAR ── */}
      {showBottomBar && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 980, background: 'rgba(20,20,20,0.98)', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '12px 24px', backdropFilter: 'blur(10px)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: isMobile ? 'none' : 'block' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF' }}>{property.title}</div>
              <div style={{ fontSize: '0.78rem', color: '#888' }}>{fmt(propPrice)} • {property.location}</div>
            </div>
            <div style={{ display: 'flex', gap: 10, width: isMobile ? '100%' : 'auto' }}>
              <button onClick={onOpenInquiry} className="nflx-btn-primary" style={{ padding: '10px 20px', flex: isMobile ? 1 : 'none' }}>Book Site Visit</button>
              <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 20px', borderRadius: 6, background: 'rgba(37,211,102,0.2)', color: '#25D166', textDecoration: 'none', fontWeight: 700, flex: isMobile ? 1 : 'none', textAlign: 'center', fontSize: '0.85rem' }}>WhatsApp</a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
