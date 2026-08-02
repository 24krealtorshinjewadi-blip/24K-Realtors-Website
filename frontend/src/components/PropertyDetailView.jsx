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
import CompanyLogo from './CompanyLogo';

/* ─── 24K Realtors Brand CSS Injection ─────────────────── */
if (typeof document !== 'undefined' && !document.getElementById('brand-24k-styles')) {
  const style = document.createElement('style');
  style.id = 'brand-24k-styles';
  style.textContent = `
    :root {
      --bg-dark: #09111F;
      --bg-deep: #0F1C2E;
      --bg-card: #162438;
      --bg-card-hover: #1E2F46;
      --gold-primary: #D4AF37;
      --gold-light: #F3E5AB;
      --gold-glow: rgba(212, 175, 55, 0.25);
      --border-gold: rgba(212, 175, 55, 0.25);
      --border-muted: rgba(255, 255, 255, 0.08);
      --font-title: 'Cinzel', serif;
      --font-serif: 'Playfair Display', serif;
      --font-sans: 'Montserrat', 'Inter', sans-serif;
    }
    .brand-hide::-webkit-scrollbar { display: none; }
    .brand-hide { -ms-overflow-style: none; scrollbar-width: none; }
    .brand-glass-card {
      background: rgba(22, 36, 56, 0.75);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--border-gold);
      border-radius: 18px;
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s, border-color 0.35s;
    }
    .brand-glass-card:hover {
      transform: translateY(-4px);
      border-color: rgba(212, 175, 55, 0.5);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.15);
    }
    .brand-shimmer-text {
      background: linear-gradient(90deg, #D4AF37 0%, #F3E5AB 50%, #D4AF37 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: brand-shimmer 3s linear infinite;
    }
    @keyframes brand-shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    .brand-btn-gold {
      background: linear-gradient(135deg, #D4AF37, #F3E5AB);
      color: #0D1B2A;
      border: none;
      font-family: var(--font-sans);
      font-weight: 700;
      cursor: pointer;
      border-radius: 50px;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      letter-spacing: 0.03em;
    }
    .brand-btn-gold:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(212, 175, 55, 0.4);
      filter: brightness(1.08);
    }
    .brand-btn-outline {
      background: rgba(255, 255, 255, 0.05);
      color: #FFF;
      border: 1px solid var(--border-gold);
      font-family: var(--font-sans);
      font-weight: 600;
      cursor: pointer;
      border-radius: 50px;
      transition: all 0.3s;
    }
    .brand-btn-outline:hover {
      background: rgba(212, 175, 55, 0.12);
      border-color: #D4AF37;
      color: #F3E5AB;
      transform: translateY(-1px);
    }
    .brand-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 12px;
      border-radius: 100px;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      font-family: var(--font-sans);
    }
    .brand-range {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 5px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      outline: none;
    }
    .brand-range::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: linear-gradient(135deg, #D4AF37, #F3E5AB);
      cursor: pointer;
      box-shadow: 0 0 12px rgba(212, 175, 55, 0.6);
    }
  `;
  document.head.appendChild(style);
}

/* ── Developer Info Lookup ── */
const getBuilderInfo = (title = '') => {
  if (title.includes('24K') || title.includes('Opula') || title.includes('Sereno') || title.includes('Altura') || title.includes('Glitterati') || title.includes('Mahalunge'))
    return { name: 'Kolte-Patil Developers', brand: '24K Luxury Brand', reraId: 'A52100028461', logo: '🏛️', founded: 1991, projects: '85+', rating: 4.9, awards: ['CREDAI Award 2024', 'ET Best Luxury Brand'], desc: "Kolte-Patil's 24K flagship brand sets global benchmarks in architectural precision, smart home technology, and landmark residences across Pune West." };
  if (title.includes('Shapoorji') || title.includes('Joyville') || title.includes('Vyomora'))
    return { name: 'Shapoorji Pallonji Real Estate', brand: 'Joyville Signature Series', reraId: 'PR1260002600999', logo: '🏗️', founded: 1865, projects: '120+', rating: 4.8, awards: ['Construction World Award 2024'], desc: 'Shapoorji Pallonji brings 160+ years of engineering excellence, structural resilience, and luxury living to major Indian metro cities.' };
  if (title.includes('Godrej') || title.includes('Ivara'))
    return { name: 'Godrej Properties', brand: 'Premium Residences', reraId: 'PR1260002502426', logo: '🌿', founded: 1990, projects: '165+', rating: 4.9, awards: ['NDTV Property Award 2024'], desc: 'Godrej Properties combines trust, innovation, and sustainable luxury across premium gated townships.' };
  if (title.includes('Kasturi'))
    return { name: 'Kasturi Builders', brand: 'Signature Penthouses', reraId: 'A52100045231', logo: '💎', founded: 1998, projects: '42+', rating: 4.8, awards: ['Pune Luxury Realty Award'], desc: 'Kasturi is celebrated for Italian marble finishes, double-height grand lobbies, and ultra-exclusive residences.' };
  if (title.includes('Lodha'))
    return { name: 'Lodha Group', brand: 'World-Class Towers', reraId: 'A52100033211', logo: '🌍', founded: 1980, projects: '200+', rating: 4.8, awards: ['Developer of the Year 2024'], desc: 'Lodha Group creates iconic landmarks with premier lifestyle amenities and world-class interior standards.' };
  return { name: 'Tier-1 Authorized Developer', brand: 'Verified Portfolio Partner', reraId: 'A52100028461', logo: '🏠', founded: 2005, projects: '30+', rating: 4.7, awards: ['Verified Developer'], desc: 'Managed under 24K Realtors authorized developer alliance.' };
};

/* ── Location Intelligence ── */
const CORRIDOR_DATA = {
  HINJEWADI: { appreciation: 14.2, commute: 9.5, green: 8.8, infra: 9.4, social: 9.1, future: 9.6, rentalYield: 4.8, landmarks: ['Infosys Circle 1 (0.8 km)', 'Wipro SEZ (1.5 km)', 'Metro Line 3 (0.4 km)', 'Balewadi High Street (5.2 km)', 'International Airport (28 km)'] },
  WAKAD: { appreciation: 13.8, commute: 9.1, green: 8.2, infra: 8.9, social: 8.8, future: 9.0, rentalYield: 4.5, landmarks: ['Wakad Chowk (0.5 km)', 'D-Mart Wakad (1.0 km)', 'Pimpri Railway (7 km)', 'Aditya Birla Hospital (3.5 km)'] },
  BANER: { appreciation: 16.5, commute: 9.8, green: 9.0, infra: 9.6, social: 9.5, future: 9.7, rentalYield: 5.2, landmarks: ['Balewadi High Street (0.5 km)', 'Jupiter Hospital (1.8 km)', 'Baner Metro (0.6 km)', 'Expressway Connector (2.0 km)'] },
  BALEWADI: { appreciation: 15.8, commute: 9.4, green: 8.7, infra: 9.2, social: 9.1, future: 9.4, rentalYield: 5.0, landmarks: ['Balewadi Stadium (0.6 km)', 'High Street Phoenix (1.0 km)', 'Croma Mall (1.5 km)', 'Baner Road (0.8 km)'] },
  KHARADI: { appreciation: 15.2, commute: 9.0, green: 8.4, infra: 9.1, social: 8.9, future: 9.2, rentalYield: 4.9, landmarks: ['EON IT Park (0.4 km)', 'World Trade Center (0.8 km)', 'Airport (5.5 km)', 'Koregaon Park (4.5 km)'] },
};
const getCorridorData = (location = '') => {
  const key = location.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z_]/g, '');
  for (const [k, v] of Object.entries(CORRIDOR_DATA)) { if (key.includes(k)) return v; }
  return { appreciation: 14.0, commute: 9.0, green: 8.5, infra: 8.8, social: 8.6, future: 9.0, rentalYield: 4.5, landmarks: ['Tech Park (1.2 km)', 'International School (0.8 km)', 'Expressway (2.5 km)', 'Hospital (3.0 km)'] };
};

/* ── Score Bar ── */
function ScoreBar({ label, value, max = 10 }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '0.8rem', color: '#A0AEC0', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F3E5AB', fontFamily: 'var(--font-sans)' }}>{value}{max === 10 ? '/10' : '%'}</span>
      </div>
      <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
          style={{ height: '100%', borderRadius: '3px', background: 'linear-gradient(90deg, #D4AF37, #F3E5AB)' }} />
      </div>
    </div>
  );
}

/* ── Amenity Photo Card ── */
const AMENITY_META = {
  '24/7 Concierge Desk': { emoji: '🛎️', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=75' },
  'Infinity Sky Pool': { emoji: '🏊', img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=75' },
  'Infinity Swimming Pool': { emoji: '🏊', img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=75' },
  'Modern Gymnasium': { emoji: '💪', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=75' },
  'Smart Home Automation': { emoji: '📱', img: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=75' },
  'Landscaped Gardens': { emoji: '🌿', img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=75' },
  'Clubhouse & Co-work Space': { emoji: '🏛️', img: 'https://images.unsplash.com/photo-1527192491265-7e452a145d55?auto=format&fit=crop&w=600&q=75' },
  'Kids Play Area': { emoji: '🎠', img: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=600&q=75' },
  'Multi-Level Car Parking': { emoji: '🅿️', img: 'https://images.unsplash.com/photo-1506521788723-868126d5e368?auto=format&fit=crop&w=600&q=75' },
  'Rainwater Harvesting': { emoji: '💧', img: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=600&q=75' },
  '100% Power Backup Grid': { emoji: '⚡', img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=75' },
  '24x7 Security': { emoji: '🛡️', img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=75' },
  'Indoor Games': { emoji: '🎱', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=75' },
};

function AmenityPhotoCard({ label }) {
  const meta = AMENITY_META[label] || { emoji: '✨', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=75' };
  const [hov, setHov] = useState(false);
  return (
    <motion.div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}
      style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', border: hov ? '1px solid rgba(212,175,55,0.6)' : '1px solid rgba(255,255,255,0.08)', cursor: 'default', transition: 'all 0.35s', boxShadow: hov ? '0 16px 40px rgba(0,0,0,0.6)' : '0 4px 12px rgba(0,0,0,0.3)', transform: hov ? 'translateY(-4px)' : 'translateY(0)', aspectRatio: '4/3' }}>
      <img src={meta.img} alt={label} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: hov ? 'scale(1.08)' : 'scale(1)', transition: 'transform 0.6s' }} loading="lazy" onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=75'; }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,17,31,0.92) 0%, rgba(9,17,31,0.2) 60%, transparent 100%)' }} />
      <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0, background: 'rgba(212,175,55,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(212,175,55,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>{meta.emoji}</div>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFF', textShadow: '0 1px 4px rgba(0,0,0,0.8)', fontFamily: 'var(--font-sans)' }}>{label}</span>
      </div>
    </motion.div>
  );
}

/* ── Lightbox Modal ── */
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(9,17,31,0.97)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}><X size={20} /></button>
      <div style={{ position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)', color: '#A0AEC0', fontFamily: 'var(--font-sans)', fontSize: '0.85rem' }}>{idx + 1} / {images.length}</div>
      <button onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }} style={{ position: 'absolute', left: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '48px', height: '48px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}><ChevronLeft size={24} /></button>
      <AnimatePresence mode="wait">
        <motion.img key={idx} src={images[idx]} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          style={{ maxWidth: '88vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 30px 80px rgba(0,0,0,0.8)' }} onClick={e => e.stopPropagation()} />
      </AnimatePresence>
      <button onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }} style={{ position: 'absolute', right: '24px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '48px', height: '48px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}><ChevronRight size={24} /></button>
    </motion.div>
  );
}

/* ── FAQ Accordion Item ── */
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', textAlign: 'left', gap: '16px' }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.92rem', fontWeight: 600, color: open ? '#F3E5AB' : '#F8F9FA', transition: 'color 0.3s' }}>{q}</span>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }} style={{ width: '26px', height: '26px', borderRadius: '50%', background: open ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${open ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: open ? '#D4AF37' : '#888', flexShrink: 0 }}>+</motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: 'hidden' }}>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.86rem', color: '#A0AEC0', lineHeight: 1.7, paddingBottom: '18px', margin: 0 }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN 24K REALTORS LUXURY PROPERTY DETAIL VIEW
════════════════════════════════════════════════════════════ */
export default function PropertyDetailView({ property, onBack, onOpenInquiry, onOpenChauffeur, onOpenBrochure, formatPrice, getEmbedVideoUrl, allProperties = [] }) {

  /* ── Performance Throttled Scroll State ── */
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [showBottomCTA, setShowBottomCTA]   = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          setHeaderScrolled(y > 60);
          setShowBottomCTA(y > 500);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Interactive States ── */
  const [activeTab, setActiveTab]         = useState('overview');
  const [activePlan, setActivePlan]       = useState('2bhk');
  const [downPayment, setDownPayment]     = useState(20);
  const [interestRate, setInterestRate]   = useState(8.5);
  const [loanTerm, setLoanTerm]           = useState(20);
  const [lightboxOpen, setLightboxOpen]   = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
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

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [property.id]);

  /* ── S3 Folder Resolution ── */
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
  const isCommercial = property.propertyType === 'COMMERCIAL';
  const builder      = useMemo(() => getBuilderInfo(property.title), [property.title]);
  const corridor     = useMemo(() => getCorridorData(property.location), [property.location]);
  useSEO(buildPropertySEO(property));

  const slideshowImages = useMemo(() => {
    const raw = property.slideshowImages || [];
    const formatted = raw.map(img => {
      if (!img) return `${s3BaseUrl}/hero.png`;
      if (img.startsWith('http://') || img.startsWith('https://')) return img;
      const cleanName = img.split('/').pop();
      return `${s3BaseUrl}/${cleanName}`;
    });
    if (formatted.length > 0) return formatted;
    return [
      `${s3BaseUrl}/vyomora_hero_facade.png`, `${s3BaseUrl}/vyomora_master_living.png`,
      `${s3BaseUrl}/vyomora_italian_kitchen.png`, `${s3BaseUrl}/vyomora_master_bedroom.png`,
      `${s3BaseUrl}/vyomora_sky_pool.png`, `${s3BaseUrl}/vyomora_grand_lobby.png`,
      `${s3BaseUrl}/hero.png`, `${s3BaseUrl}/hero.jpg`
    ];
  }, [property.slideshowImages, s3BaseUrl]);

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

  /* ── Actions ── */
  const handleToggleWishlist = async () => {
    const next = !isWishlisted; setIsWishlisted(next);
    try {
      const s = localStorage.getItem('wishlist_properties'); let list = s ? JSON.parse(s) : [];
      if (next) { if (!list.includes(property.id)) list.push(property.id); } else { list = list.filter(id => id !== property.id); }
      localStorage.setItem('wishlist_properties', JSON.stringify(list));
      if (next) await apiService.addToWishlist(property.id); else await apiService.removeFromWishlist(property.id);
    } catch {}
  };

  const waLink   = `https://wa.me/919673000053?text=Hi%2024K%20Realtors,%20I'm%20interested%20in%20"${encodeURIComponent(property.title)}"%20at%20${encodeURIComponent(property.location)}.%20Please%20share%20details.`;
  const callLink = 'tel:+919673000053';

  /* ── Floor Plans ── */
  const fpVariants = [
    { id: '2bhk', label: '2 BHK Luxury', url: property.floorPlanUrl || `${s3BaseUrl}/floorplan_2bhk.png`, desc: '684 – 839 sq.ft Carpet' },
    { id: '3bhk', label: '3 BHK Estate', url: property.floorPlan3BHKUrl || `${s3BaseUrl}/floorplan_3bhk.png`, desc: '1052 – 1477 sq.ft Carpet' },
    { id: 'master', label: 'Master Layout', url: property.masterPlanUrl || `${s3BaseUrl}/masterplan.png`, desc: '16-Acre Township' },
  ];
  const fpActive = fpVariants.find(v => v.id === activePlan) || fpVariants[0];

  /* ── Amenities ── */
  const amenityList = property.specificAmenities || [
    '24/7 Concierge Desk', 'Infinity Swimming Pool', 'Modern Gymnasium', 'Kids Play Area',
    'Landscaped Gardens', 'Clubhouse & Co-work Space', 'Indoor Games', '24x7 Security',
    '100% Power Backup Grid', 'Rainwater Harvesting', 'Multi-Level Car Parking'
  ];
  const displayedAmenities = showAllAmenities ? amenityList : amenityList.slice(0, 8);

  const unitConfigs = property.configurations || [
    { name: '2 BHK Executive', area: '684 – 839 sq.ft', price: '₹84.00 L+', status: 'Fast Selling' },
    { name: '3 BHK Signature', area: '1052 – 1477 sq.ft', price: '₹1.17 Cr+', status: 'Limited Units' },
    { name: '4 BHK Duplex Penthouse', area: '2150 – 4200 sq.ft', price: '₹3.75 Cr+', status: 'Exclusive' },
  ];

  /* ── Similar Properties ── */
  const similar = useMemo(() => {
    return allProperties
      .filter(p => p.id !== property.id)
      .slice(0, 3);
  }, [allProperties, property.id]);

  /* ── AI Investment Score ── */
  const aiScore = Math.min(Math.round((corridor.appreciation / 20 * 40) + (corridor.future * 4) + (corridor.infra * 3) + (corridor.commute * 3)), 99);
  const rentalYield = corridor.rentalYield || 4.5;

  const STICKY_TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'highlights', label: 'Highlights' },
    { id: 'floorplans', label: 'Floor Plans' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'construction', label: 'Progress' },
    { id: 'location', label: 'Location' },
    { id: 'investment', label: 'AI Investment' },
    { id: 'pricing', label: 'Pricing & EMI' },
    { id: 'developer', label: 'Developer' },
  ];

  const secId = id => `brand-sec-${id}`;
  const scrollTo = id => {
    const el = document.getElementById(secId(id));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveTab(id);
  };

  const trendPts = [
    { year: '2021', price: 6200, x: 30, y: 140 }, { year: '2022', price: 6800, x: 110, y: 118 },
    { year: '2023', price: 7500, x: 190, y: 95 }, { year: '2024', price: 8400, x: 270, y: 70 },
    { year: '2025', price: 9300, x: 350, y: 46 }, { year: '2026', price: 10500, x: 430, y: 20 },
  ];
  const pathD = trendPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const faqs = [
    { q: 'What is the possession date?', a: `Expected possession is ${property.possessionDate || 'December 2027'}. Monthly progress reports are shared with all registered buyers.` },
    { q: 'What is the RERA registration number?', a: `RERA Registration: ${property.reraNumber || builder.reraId}. Fully verified on the official MahaRERA portal.` },
    { q: 'What payment plans are available?', a: 'Multiple payment plans are available: Construction Linked Plan (CLP), Down Payment Plan (10-90), and Flexi Payment Plan. Home loans available from SBI, HDFC, ICICI, and Axis Bank.' },
    { q: 'Are there any hidden charges?', a: 'Zero hidden charges. Stamp duty, registration, GST, and development fees are itemized transparently in our price breakup statement.' },
    { q: 'Can NRIs purchase this property?', a: 'Yes. NRIs can purchase under FEMA regulations with complete end-to-end legal and documentation support from our team.' },
  ];

  /* ── Section Title Component ── */
  const SectionHeader = ({ label, sub, align = 'left' }) => (
    <div style={{ marginBottom: '36px', textAlign: align }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <div style={{ width: '24px', height: '2px', background: 'linear-gradient(90deg, #D4AF37, #F3E5AB)' }} />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37' }}>24K REALTORS</span>
        <div style={{ width: '24px', height: '2px', background: 'linear-gradient(90deg, #F3E5AB, #D4AF37)' }} />
      </div>
      <h2 style={{ fontFamily: 'var(--font-title)', fontSize: isMobile ? '1.8rem' : '2.3rem', fontWeight: 700, color: '#FFF', margin: '0 0 10px', lineHeight: 1.2, letterSpacing: '0.02em' }}>{label}</h2>
      {sub && <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#A0AEC0', margin: align === 'center' ? '0 auto' : 0, lineHeight: 1.6, maxWidth: '540px' }}>{sub}</p>}
    </div>
  );

  /* ══════════════════ 24K LUXURY RENDER ══════════════════ */
  return (
    <div style={{ background: 'var(--bg-dark)', color: '#F8F9FA', fontFamily: 'var(--font-sans)', minHeight: '100vh', paddingBottom: '90px', position: 'relative', overflowX: 'hidden' }}>

      {/* ── STICKY BRAND HEADER ── */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999, transition: 'all 0.35s', background: headerScrolled ? 'rgba(9, 17, 31, 0.95)' : 'linear-gradient(to bottom, rgba(9,17,31,0.85), transparent)', backdropFilter: headerScrolled ? 'blur(16px)' : 'none', borderBottom: headerScrolled ? '1px solid rgba(212, 175, 55, 0.2)' : 'none' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '12px 16px' : '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 600 }}>
            <ChevronLeft size={18} /> Back to Listings
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-title)', fontSize: isMobile ? '1.05rem' : '1.25rem', fontWeight: 700, letterSpacing: '0.04em' }} className="brand-shimmer-text">24K REALTORS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={handleToggleWishlist} style={{ background: isWishlisted ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${isWishlisted ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Heart size={16} fill={isWishlisted ? '#EF4444' : 'none'} color={isWishlisted ? '#EF4444' : '#FFF'} />
            </button>
            {!isMobile && (
              <a href={callLink} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '50px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600 }}>
                <Phone size={14} color="#D4AF37" /> +91 96730 00053
              </a>
            )}
            <button onClick={onOpenInquiry} className="brand-btn-gold" style={{ padding: '9px 20px', fontSize: '0.82rem' }}>Enquire Now</button>
          </div>
        </div>
      </header>

      {/* ── CINEMATIC BRAND HERO ── */}
      <section style={{ position: 'relative', height: isMobile ? '72vh' : '86vh', minHeight: '540px', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <img src={slideshowImages[0]} alt={property.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '110%', objectFit: 'cover', objectPosition: 'center' }} onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=85'; }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #09111F 0%, rgba(9,17,31,0.7) 40%, rgba(9,17,31,0.2) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(9,17,31,0.6) 0%, transparent 60%)' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '28px 16px' : '56px 24px', width: '100%', boxSizing: 'border-box' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            {/* Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
              <span className="brand-badge" style={{ background: 'rgba(56,176,0,0.18)', border: '1px solid rgba(56,176,0,0.4)', color: '#38B000' }}><ShieldCheck size={11} /> RERA Certified</span>
              <span className="brand-badge" style={{ background: 'rgba(212,175,55,0.18)', border: '1px solid rgba(212,175,55,0.4)', color: '#F3E5AB' }}><Star size={11} /> Exclusive Portfolio</span>
              <span className="brand-badge" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF' }}><Building size={11} /> New Launch</span>
            </div>

            {/* Title */}
            <h1 style={{ fontFamily: 'var(--font-title)', fontSize: isMobile ? '2.1rem' : '3.4rem', fontWeight: 700, color: '#FFF', margin: '0 0 10px', lineHeight: 1.1, textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
              {property.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '22px' }}>
              <MapPin size={15} color="#D4AF37" />
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: '#A0AEC0' }}>{property.address || `${property.location}, Pune, Maharashtra`}</span>
            </div>

            {/* Key Quick Stats */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' }}>
              {[
                { label: 'Starting Price', value: fmt(property.price), highlight: true },
                { label: 'Carpet Area', value: `${property.areaSquareFeet || 990} sq.ft` },
                { label: 'Configuration', value: isCommercial ? 'Commercial' : `${property.bedrooms || 2}, 3 & 4 BHK` },
                { label: 'Possession Date', value: property.possessionDate || 'Dec 2027' },
              ].map((st, i) => (
                <div key={i} style={{ background: 'rgba(9,17,31,0.65)', backdropFilter: 'blur(12px)', border: st.highlight ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '10px 16px', minWidth: '110px' }}>
                  <div style={{ fontSize: '0.68rem', color: '#A0AEC0', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '3px' }}>{st.label}</div>
                  <div style={{ fontSize: isMobile ? '0.95rem' : '1.05rem', fontWeight: 700, color: st.highlight ? '#F3E5AB' : '#FFF', fontFamily: 'var(--font-serif)' }}>{st.value}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <button onClick={onOpenInquiry} className="brand-btn-gold" style={{ padding: isMobile ? '12px 20px' : '14px 28px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} /> Book Site Visit
              </button>
              <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: isMobile ? '12px 20px' : '14px 28px', borderRadius: '50px', background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.4)', color: '#25D366', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
                <MessageSquare size={16} /> WhatsApp
              </a>
              <a href={callLink} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: isMobile ? '12px 20px' : '14px 28px', borderRadius: '50px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, fontFamily: 'var(--font-sans)' }}>
                <Phone size={16} /> Call Now
              </a>
              {onOpenBrochure && (
                <button onClick={onOpenBrochure} className="brand-btn-outline" style={{ padding: isMobile ? '12px 20px' : '14px 28px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Download size={16} /> Brochure
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STICKY NAVIGATION BAR ── */}
      <div style={{ position: 'sticky', top: '62px', zIndex: 90, background: 'rgba(9,17,31,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', overflowX: 'auto' }} className="brand-hide">
          <div style={{ display: 'flex', gap: 0, whiteSpace: 'nowrap' }}>
            {STICKY_TABS.map(tab => (
              <button key={tab.id} onClick={() => scrollTo(tab.id)}
                style={{ padding: '16px 18px', background: 'none', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #D4AF37' : '2px solid transparent', color: activeTab === tab.id ? '#F3E5AB' : '#A0AEC0', fontFamily: 'var(--font-sans)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.25s', letterSpacing: '0.02em' }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '40px 16px' : '60px 24px', boxSizing: 'border-box' }}>

        {/* 1. QUICK STATS 10-GRID */}
        <div style={{ background: 'var(--bg-deep)', border: '1px solid var(--border-gold)', borderRadius: '20px', padding: isMobile ? '20px 12px' : '32px 24px', marginBottom: '60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
            {[
              { icon: '📐', label: 'Carpet Area', value: `${property.areaSquareFeet || 990} sq.ft` },
              { icon: '🏠', label: 'Config', value: isCommercial ? 'Commercial' : `${property.bedrooms || 2} BHK` },
              { icon: '💰', label: 'Starting Price', value: fmt(property.price) },
              { icon: '📅', label: 'Possession', value: property.possessionDate || 'Dec 2027' },
              { icon: '🏗️', label: 'Towers', value: 'G+22 Floors' },
              { icon: '🏢', label: 'Total Units', value: '202 Residences' },
              { icon: '🚗', label: 'Parking', value: '2 Covered Slots' },
              { icon: '🌳', label: 'Open Green', value: '70% Open Space' },
              { icon: '🏋️', label: 'Amenities', value: '30+ World Class' },
              { icon: '⭐', label: 'Google Rating', value: '4.9 / 5.0' },
            ].map((item, i) => (
              <div key={i} style={{ padding: isMobile ? '16px 10px' : '20px 16px', background: 'var(--bg-card)', textAlign: 'center' }}>
                <div style={{ fontSize: isMobile ? '1.3rem' : '1.6rem', marginBottom: '6px' }}>{item.icon}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: isMobile ? '0.88rem' : '0.98rem', fontWeight: 700, color: '#FFF' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. CINEMATIC MASONRY GALLERY */}
        <div id={secId('gallery')} style={{ marginBottom: '60px' }}>
          <SectionHeader label="Cinematic Property Gallery" sub="Every angle, room, and outdoor vista captured in high-definition" />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '2fr 1fr 1fr', gridTemplateRows: isMobile ? 'auto' : '280px 200px', gap: '12px' }}>
            <div onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }} style={{ gridRow: isMobile ? 'auto' : '1 / 3', position: 'relative', borderRadius: '18px', overflow: 'hidden', cursor: 'zoom-in', aspectRatio: isMobile ? '4/3' : 'auto' }}>
              <img src={slideshowImages[0]} alt="Hero View" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80'; }} />
              <div style={{ position: 'absolute', bottom: '14px', left: '14px' }}>
                <span className="brand-badge" style={{ background: 'rgba(9,17,31,0.8)', border: '1px solid rgba(212,175,55,0.4)', color: '#F3E5AB' }}><Play size={11} /> View Drone Video</span>
              </div>
            </div>
            {slideshowImages.slice(1, 5).map((img, i) => (
              <div key={i} onClick={() => { setLightboxIndex(i + 1); setLightboxOpen(true); }} style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', cursor: 'zoom-in', aspectRatio: '4/3' }}>
                <img src={img} alt={`View ${i + 2}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} loading="lazy" onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=75'; }} />
                {i === 3 && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(9,17,31,0.78)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-title)', fontSize: '1.8rem', fontWeight: 700, color: '#FFF' }}>+{(slideshowImages.length - 4) || 50}</span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#A0AEC0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>View All</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. ABOUT PROJECT & BUILDER NARRATIVE */}
        <div id={secId('overview')} style={{ marginBottom: '60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '48px', alignItems: 'start' }}>
            <div>
              <SectionHeader label="About The Project" sub={`A landmark luxury address in ${property.location || 'Baner-Hinjewadi Link Road, Pune'}`} />
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.92rem', color: '#A0AEC0', lineHeight: 1.85, marginBottom: '20px' }}>
                {property.description || `${property.title} redefines luxury living in ${property.location}, Pune. Designed with architectural precision, high-ceiling layouts, smart automation, and direct connectivity to Pune IT corridors.`}
              </p>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.8, fontStyle: 'italic', borderLeft: '3px solid #D4AF37', paddingLeft: '18px', marginBottom: '28px' }}>
                "Architecture is more than structures — it is an elevation of lifestyle. {property.title} represents standard-setting luxury."
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button onClick={onOpenInquiry} className="brand-btn-gold" style={{ padding: '12px 24px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={15} /> Schedule Visit
                </button>
                {onOpenBrochure && (
                  <button onClick={onOpenBrochure} className="brand-btn-outline" style={{ padding: '12px 24px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Download size={15} /> Download Brochure
                  </button>
                )}
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {unitConfigs.map((cfg, i) => (
                  <div key={i} className="brand-glass-card" style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={onOpenInquiry}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 700, color: '#FFF', marginBottom: '4px' }}>{cfg.name}</div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#A0AEC0' }}>{cfg.area}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 700, color: '#F3E5AB' }}>{cfg.price}</div>
                      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 700, color: cfg.status === 'Fast Selling' ? '#38B000' : cfg.status === 'Exclusive' ? '#D4AF37' : '#FFBE0B', textTransform: 'uppercase', marginTop: '4px' }}>{cfg.status}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '16px', padding: '16px 20px', borderRadius: '14px', background: 'rgba(212,175,55,0.08)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShieldCheck size={20} color="#D4AF37" />
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', fontWeight: 700, color: '#FFF' }}>RERA Verified Project</div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#A0AEC0' }}>Registration: {property.reraNumber || builder.reraId}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. VIDEO WALKTHROUGH */}
        <div style={{ marginBottom: '60px' }}>
          <SectionHeader label="Cinematic Video Tour" sub="Take a virtual walkthrough of the landmark towers and sky suites" align="center" />
          <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', aspectRatio: '16/9', maxWidth: '900px', margin: '0 auto', border: '1px solid var(--border-gold)', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}>
            {(() => {
              const driveFallback = "https://drive.google.com/file/d/1d0bs-V09UXSMugFtcKOEpNo9_Wh-5G3N/preview";
              const s3Candidates = [
                property.videoUrl,
                `${s3BaseUrl}/video.mp4`,
                `${s3BaseUrl}/vyomora_tour.mp4`,
                `${s3BaseUrl}/tour.mp4`,
                `${s3BaseUrl}/vyomora.mp4`,
                `${s3BaseUrl}/hero.mp4`,
                `/properties/vyomora/vyomora_tour.mp4`
              ].filter(Boolean);

              return (
                <video
                  src={s3Candidates[videoFallbackIndex] || property.videoUrl || `${s3BaseUrl}/video.mp4`}
                  controls
                  playsInline
                  autoPlay
                  muted
                  loop
                  poster={slideshowImages[0]}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    if (videoFallbackIndex < s3Candidates.length - 1) {
                      setVideoFallbackIndex(prev => prev + 1);
                    } else {
                      // Switch to Google Drive iframe preview stream if S3 files are not accessible
                      setUseDriveFallback(true);
                    }
                  }}
                />
              );
            })()}
            {useDriveFallback && (
              <iframe
                src="https://drive.google.com/file/d/1d0bs-V09UXSMugFtcKOEpNo9_Wh-5G3N/preview"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                title="Shapoorji Joyville Vyomora Video Tour"
              />
            )}

          </div>
        </div>

        {/* 5. PROJECT HIGHLIGHTS */}
        <div id={secId('highlights')} style={{ marginBottom: '60px' }}>
          <SectionHeader label="Project Highlights" sub="Designed for high-net-worth comfort and seamless modern living" />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '14px' }}>
            {[
              { icon: '🏊', title: 'Infinity Sky Pool', desc: 'Rooftop infinity pool with panoramic views of Pune West' },
              { icon: '🌿', title: '70% Open Space', desc: 'Miyawaki forest zones and walking tracks' },
              { icon: '🏛️', title: 'Grand Clubhouse', desc: '25,000 sq.ft state-of-the-art lifestyle lounge' },
              { icon: '🛡️', title: '24x7 AI Security', desc: 'CCTV surveillance with video door phone integration' },
              { icon: '💪', title: 'Modern Gymnasium', desc: 'Fully equipped fitness center with personal trainers' },
              { icon: '🧘', title: 'Yoga & Wellness Deck', desc: 'Dedicated meditation space amidst lush greens' },
              { icon: '🎠', title: "Children's Play Zone", desc: 'Safe, interactive play area for kids' },
              { icon: '⚡', title: '100% Power Backup', desc: 'Uninterrupted power grid for all apartments' },
            ].map((h, i) => (
              <div key={i} className="brand-glass-card" style={{ padding: isMobile ? '16px 12px' : '22px' }}>
                <div style={{ fontSize: isMobile ? '1.8rem' : '2.2rem', marginBottom: '10px' }}>{h.icon}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 700, color: '#FFF', marginBottom: '6px' }}>{h.title}</div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.76rem', color: '#A0AEC0', lineHeight: 1.5 }}>{h.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. FLOOR PLANS & CONFIGURATIONS */}
        <div id={secId('floorplans')} style={{ marginBottom: '60px' }}>
          <SectionHeader label="Floor Plans & Blueprints" sub="Optimal space utility with high-ceiling luxury architecture" />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '36px', alignItems: 'start' }}>
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {fpVariants.map(v => (
                  <button key={v.id} onClick={() => setActivePlan(v.id)}
                    style={{ padding: '9px 18px', borderRadius: '50px', fontFamily: 'var(--font-sans)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.25s', border: 'none', background: activePlan === v.id ? 'linear-gradient(135deg, #D4AF37, #F3E5AB)' : 'rgba(255,255,255,0.06)', color: activePlan === v.id ? '#0D1B2A' : '#A0AEC0' }}>
                    {v.label}
                  </button>
                ))}
              </div>
              <div style={{ position: 'relative', borderRadius: '18px', overflow: 'hidden', background: '#0F1C2E', border: '1px solid var(--border-gold)', cursor: 'zoom-in' }} onClick={() => { setLightboxIndex(5); setLightboxOpen(true); }}>
                <img src={fpActive.url} alt={fpActive.label} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'contain', padding: '16px', boxSizing: 'border-box' }} onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=600&q=75'; }} />
                <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(9,17,31,0.8)', backdropFilter: 'blur(8px)', borderRadius: '8px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ZoomIn size={12} color="#A0AEC0" /><span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: '#A0AEC0' }}>Tap to Zoom</span>
                </div>
                <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
                  <span style={{ background: 'rgba(9,17,31,0.85)', backdropFilter: 'blur(8px)', border: '1px solid var(--border-gold)', borderRadius: '8px', padding: '5px 12px', fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#F3E5AB', fontWeight: 700 }}>{fpActive.desc}</span>
                </div>
              </div>
              <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
                <button onClick={onOpenBrochure} className="brand-btn-gold" style={{ flex: 1, padding: '12px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Download size={14} /> Download PDF
                </button>
                <button onClick={onOpenInquiry} className="brand-btn-outline" style={{ flex: 1, padding: '12px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Phone size={14} /> Get Pricing
                </button>
              </div>
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem', color: '#FFF', marginBottom: '20px', fontWeight: 700 }}>{fpActive.label} — Blueprint Details</h3>
              {[
                { label: 'Carpet Area', value: fpActive.id === '2bhk' ? '684 – 839 sq.ft' : fpActive.id === '3bhk' ? '1052 – 1477 sq.ft' : '16 Acres' },
                { label: 'Super Built-up Area', value: fpActive.id === '2bhk' ? '870 – 1050 sq.ft' : fpActive.id === '3bhk' ? '1320 – 1840 sq.ft' : 'Mixed' },
                { label: 'Bedrooms', value: fpActive.id === '2bhk' ? '2 Beds' : fpActive.id === '3bhk' ? '3 Beds' : 'Multiple' },
                { label: 'Bathrooms', value: fpActive.id === '2bhk' ? '2 Baths' : fpActive.id === '3bhk' ? '3 Baths' : 'Multiple' },
                { label: 'Balcony', value: '1 Extended Deck' },
                { label: 'Parking Space', value: '2 Covered Slots' },
                { label: 'Building Structure', value: 'G+22 Floors' },
                { label: 'Starting Price', value: fpActive.id === '2bhk' ? '₹84.00 L*' : fpActive.id === '3bhk' ? '₹1.17 Cr*' : '₹3.75 Cr*' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 7 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#A0AEC0' }}>{row.label}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.86rem', fontWeight: 700, color: '#FFF' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 7. WORLD CLASS AMENITIES */}
        <div id={secId('amenities')} style={{ marginBottom: '60px' }}>
          <SectionHeader label="World-Class Photo Amenities" sub="Curated lifestyle features designed to offer complete leisure and luxury" />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
            {displayedAmenities.map(label => <AmenityPhotoCard key={label} label={label} />)}
          </div>
          {amenityList.length > 8 && (
            <div style={{ textAlign: 'center' }}>
              <button onClick={() => setShowAllAmenities(!showAllAmenities)} className="brand-btn-outline" style={{ padding: '12px 32px', fontSize: '0.85rem' }}>
                {showAllAmenities ? 'Show Less' : `View All ${amenityList.length} Amenities`}
              </button>
            </div>
          )}
        </div>

        {/* 8. CONSTRUCTION PROGRESS */}
        <div id={secId('construction')} style={{ marginBottom: '60px' }}>
          <SectionHeader label="Construction Progress" sub="Transparent milestone tracking for registered investors" />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '36px', alignItems: 'start' }}>
            <div>
              {[
                { phase: 'Foundation & Piling', date: 'Aug 2024', status: 'completed', pct: 100 },
                { phase: 'Basement Excavation', date: 'Oct 2024', status: 'completed', pct: 100 },
                { phase: 'Ground Floor Slab', date: 'Jan 2025', status: 'completed', pct: 100 },
                { phase: 'Floor 1–10 Construction', date: 'Jul 2025', status: 'active', pct: 72 },
                { phase: 'Floor 11–22 Construction', date: 'Mar 2026', status: 'upcoming', pct: 0 },
                { phase: 'Finishing & Handover', date: 'Dec 2027', status: 'upcoming', pct: 0 },
              ].map((item, i, arr) => (
                <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '18px', paddingBottom: '18px', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <div style={{ flexShrink: 0, marginTop: '2px' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: item.status === 'completed' ? '#38B000' : item.status === 'active' ? '#D4AF37' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.status === 'completed' && <CheckCircle size={12} color="#0D1B2A" />}
                      {item.status === 'active' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0D1B2A' }} />}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.86rem', fontWeight: 600, color: item.status === 'upcoming' ? '#666' : '#FFF' }}>{item.phase}</span>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: item.status === 'completed' ? '#38B000' : item.status === 'active' ? '#F3E5AB' : '#666' }}>{item.date}</span>
                    </div>
                    {item.status !== 'upcoming' && (
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.pct}%` }} viewport={{ once: true }} transition={{ duration: 1.2 }}
                          style={{ height: '100%', borderRadius: '2px', background: item.status === 'completed' ? 'linear-gradient(90deg, #38B000, #52B788)' : 'linear-gradient(90deg, #D4AF37, #F3E5AB)' }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="brand-glass-card" style={{ padding: '32px', textAlign: 'center' }}>
              <div className="brand-shimmer-text" style={{ fontFamily: 'var(--font-title)', fontSize: '3.2rem', fontWeight: 700, marginBottom: '6px' }}>68%</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.88rem', color: '#A0AEC0', marginBottom: '16px' }}>Overall Completion Status</div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
                <motion.div initial={{ width: 0 }} whileInView={{ width: '68%' }} viewport={{ once: true }} transition={{ duration: 1.5 }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #D4AF37, #F3E5AB)', borderRadius: '4px' }} />
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#A0AEC0' }}>Expected Possession: <span style={{ color: '#F3E5AB', fontWeight: 700 }}>December 2027</span></div>
            </div>
          </div>
        </div>

        {/* 9. LOCATION ADVANTAGE */}
        <div id={secId('location')} style={{ marginBottom: '60px' }}>
          <SectionHeader label="Location Advantage & Proximity" sub="Strategically connected to Pune’s IT hubs, expressway, and top schools" />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '36px' }}>
            <div style={{ borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--border-gold)', aspectRatio: '4/3' }}>
              <iframe
                src={`https://maps.google.com/maps?t=m&z=14&ie=UTF8&iwloc=&output=embed&q=${encodeURIComponent(property.address || `${property.title}, ${property.location}, Pune`)}&zoom=14`}
                style={{ width: '100%', height: '100%', border: 'none', filter: 'invert(1) hue-rotate(180deg) saturate(0.9)' }}
                title="Location Map" allowFullScreen />
            </div>
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {corridor.landmarks.map((lm, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Navigation size={15} color="#D4AF37" />
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.86rem', color: '#F8F9FA', fontWeight: 500 }}>{lm}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {[{ icon: '🏢', label: 'IT Park', time: '5 Min' }, { icon: '✈️', label: 'Airport', time: '28 Min' }, { icon: '🚇', label: 'Metro', time: '4 Min' }, { icon: '🏥', label: 'Hospital', time: '8 Min' }].map((c, i) => (
                  <div key={i} style={{ padding: '12px 6px', borderRadius: '12px', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{c.icon}</div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', color: '#A0AEC0', marginBottom: '2px' }}>{c.label}</div>
                    <div style={{ fontFamily: 'var(--font-title)', fontSize: '0.85rem', fontWeight: 700, color: '#F3E5AB' }}>{c.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
            <div className="brand-glass-card" style={{ padding: '24px' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Location Intelligence Scores</div>
              <ScoreBar label="Appreciation Potential" value={corridor.appreciation} max={20} />
              <ScoreBar label="Commute Ease" value={corridor.commute} />
              <ScoreBar label="Green & Wellness" value={corridor.green} />
              <ScoreBar label="Infrastructure" value={corridor.infra} />
              <ScoreBar label="Social Infrastructure" value={corridor.social} />
              <ScoreBar label="Future Growth" value={corridor.future} />
            </div>
            <div className="brand-glass-card" style={{ padding: '24px' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Corridor Market Metrics</div>
              {[
                { label: '5Y Price Appreciation (CAGR)', value: `${corridor.appreciation}%` },
                { label: 'Estimated Rental Yield', value: `${rentalYield}%` },
                { label: 'Avg. Micro-Market Rate', value: '₹8,200 – ₹11,500 psf' },
                { label: 'Rental Demand Index', value: 'Very High' },
                { label: 'Investment Grade Rating', value: '🏆 AAA Rating' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: '#A0AEC0' }}>{r.label}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 700, color: r.label.includes('Rating') ? '#38B000' : '#FFF' }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 10. AI INVESTMENT ANALYSIS */}
        <div id={secId('investment')} style={{ marginBottom: '60px' }}>
          <SectionHeader label="AI Investment Analysis & Forecast" sub="Predictive price growth models backed by corridor sales data" />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', gap: '24px', marginBottom: '32px' }}>
            <div className="brand-glass-card" style={{ padding: '32px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: '16px' }}>AI Investment Score</div>
              <div style={{ position: 'relative', width: '110px', height: '110px', margin: '0 auto 12px' }}>
                <svg viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <motion.circle cx="60" cy="60" r="50" fill="none" stroke="url(#brandGrad)" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`} initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                    whileInView={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - aiScore / 100) }} viewport={{ once: true }} transition={{ duration: 1.5 }} />
                  <defs><linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#D4AF37" /><stop offset="100%" stopColor="#F3E5AB" /></linearGradient></defs>
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="brand-shimmer-text" style={{ fontFamily: 'var(--font-title)', fontSize: '1.9rem', fontWeight: 700 }}>{aiScore}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.62rem', color: '#A0AEC0' }}>/ 100</span>
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 700, color: '#38B000', marginBottom: '4px' }}>Prime Investment</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#A0AEC0' }}>Top 5% ROI Potential in Pune</div>
            </div>
            <div className="brand-glass-card" style={{ padding: '24px' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>5-Year Historical Appreciation</div>
              <div style={{ overflowX: 'auto' }}>
                <svg viewBox="0 0 480 160" style={{ width: '100%', minWidth: '320px', height: '160px' }}>
                  <defs>
                    <linearGradient id="chartBg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[20, 60, 100, 140].map(y => <line key={y} x1="30" y1={y} x2="450" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />)}
                  <motion.path d={`M 30 140 ${trendPts.map(p => `L ${p.x} ${p.y}`).join(' ')} L 430 140 Z`} fill="url(#chartBg)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2 }} />
                  <motion.path d={pathD} fill="none" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }} />
                  {trendPts.map((p, i) => (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r="4" fill="#09111F" stroke="#D4AF37" strokeWidth="2" />
                      <text x={p.x} y="156" textAnchor="middle" fill="#A0AEC0" fontSize="9" fontFamily="Montserrat,sans-serif">{p.year}</text>
                      <text x={p.x} y={p.y - 8} textAnchor="middle" fill="#F3E5AB" fontSize="8.5" fontFamily="Montserrat,sans-serif" fontWeight="600">₹{p.price.toLocaleString('en-IN')}</text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 11. PRICING & EMI CALCULATOR */}
        <div id={secId('pricing')} style={{ marginBottom: '60px' }}>
          <SectionHeader label="Pricing Matrix & EMI Calculator" sub="Complete financial transparency with custom loan planning" />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '28px' }}>
            <div className="brand-glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.15rem', fontWeight: 700, color: '#FFF', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}><Calculator size={18} color="#D4AF37" /> Instant EMI Calculator</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.84rem', color: '#A0AEC0' }}>Property Price</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', fontWeight: 700, color: '#F3E5AB' }}>{fmt(propPrice)}</span>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#A0AEC0', marginBottom: '6px' }}><span>Down Payment:</span><strong style={{ color: '#FFF' }}>{downPayment}% ({fmt(propPrice * downPayment / 100)})</strong></div>
                <input type="range" min={10} max={50} value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} className="brand-range" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#A0AEC0', marginBottom: '6px' }}><span>Interest Rate:</span><strong style={{ color: '#FFF' }}>{interestRate}% p.a.</strong></div>
                <input type="range" min={6.5} max={12} step={0.1} value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} className="brand-range" />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#A0AEC0', marginBottom: '6px' }}><span>Loan Tenure:</span><strong style={{ color: '#FFF' }}>{loanTerm} Years</strong></div>
                <input type="range" min={5} max={30} value={loanTerm} onChange={e => setLoanTerm(Number(e.target.value))} className="brand-range" />
              </div>
              <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(212,175,55,0.08)', border: '1px solid var(--border-gold)', textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Estimated Monthly EMI</div>
                <div className="brand-shimmer-text" style={{ fontFamily: 'var(--font-title)', fontSize: '1.9rem', fontWeight: 700 }}>₹{Math.round(emiVal).toLocaleString('en-IN')}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[{ bank: 'SBI Home Loan', rate: '8.50%' }, { bank: 'HDFC Bank', rate: '8.75%' }, { bank: 'ICICI Bank', rate: '9.00%' }].map((b, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', fontSize: '0.8rem' }}>
                    <span style={{ color: '#A0AEC0' }}>{b.bank}</span>
                    <strong style={{ color: '#FFF' }}>{b.rate}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="brand-glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.15rem', fontWeight: 700, color: '#FFF', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={18} color="#D4AF37" /> Transparent Price Breakup</h3>
              {[
                { label: 'Agreement Value', value: fmt(propPrice) },
                { label: 'Stamp Duty (6%)', value: fmt(propPrice * 0.06) },
                { label: 'Registration (1%)', value: fmt(propPrice * 0.01) },
                { label: 'GST (5%)', value: fmt(propPrice * 0.05) },
                { label: 'Development & Legal', value: '₹1.50 L' },
                { label: 'Maintenance Deposit', value: '₹75,000' },
                { label: 'Parking Slot', value: 'Included' },
              ].map((r, i, a) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < a.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.84rem', color: '#A0AEC0' }}>{r.label}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.86rem', fontWeight: 700, color: '#FFF' }}>{r.value}</span>
                </div>
              ))}
              <div style={{ marginTop: '16px', padding: '16px', borderRadius: '14px', background: 'rgba(212,175,55,0.08)', border: '1px solid var(--border-gold)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.07em' }}>All-Inclusive Total</div>
                  <div className="brand-shimmer-text" style={{ fontFamily: 'var(--font-title)', fontSize: '1.35rem', fontWeight: 700 }}>{fmt(propPrice * 1.12 + 225000)}</div>
                </div>
                <button onClick={onOpenInquiry} className="brand-btn-gold" style={{ padding: '10px 18px', fontSize: '0.82rem' }}>Get Quote</button>
              </div>
            </div>
          </div>
        </div>

        {/* 12. DEVELOPER DOSSIER */}
        <div id={secId('developer')} style={{ marginBottom: '60px' }}>
          <SectionHeader label="Developer Profile & Legacy" sub="Decades of excellence in luxury architectural developments" />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '28px', alignItems: 'start' }}>
            <div className="brand-glass-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '18px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.7rem', flexShrink: 0 }}>{builder.logo}</div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.05rem', fontWeight: 700, color: '#FFF', margin: '0 0 2px' }}>{builder.name}</h3>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.76rem', color: '#D4AF37', fontWeight: 600, marginBottom: '4px' }}>{builder.brand}</div>
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                    {[1,2,3,4,5].map(i => <Star key={i} size={11} fill="#D4AF37" color="#D4AF37" />)}
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: '#A0AEC0', marginLeft: '4px' }}>{builder.rating} / 5.0</span>
                  </div>
                </div>
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: '#A0AEC0', lineHeight: 1.7, marginBottom: '20px' }}>{builder.desc}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[{ label: 'Founded', value: builder.founded }, { label: 'Projects', value: builder.projects }, { label: 'Rating', value: `${builder.rating}★` }].map((s, i) => (
                  <div key={i} style={{ padding: '12px 8px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-title)', fontSize: '1rem', fontWeight: 700, color: '#F3E5AB' }}>{s.value}</div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', color: '#A0AEC0' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="brand-glass-card" style={{ padding: '28px' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Why Buy With 24K Realtors</div>
              {[
                { icon: '🏆', text: '10+ Years Serving High-Net-Worth Buyers in Pune West' },
                { icon: '📋', text: '5,000+ Happy Families Housed Across Gated Townships' },
                { icon: '🔐', text: 'RERA Certified Transparency & Direct Builder Pricing' },
                { icon: '🚗', text: 'Free Chauffeur-Driven Site Visit Service' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.84rem', color: '#F8F9FA' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 13. FREQUENTLY ASKED QUESTIONS */}
        <div style={{ marginBottom: '60px' }}>
          <SectionHeader label="Frequently Asked Questions" sub="Clear answers to key buyer questions" align="center" />
          <div className="brand-glass-card" style={{ padding: '8px 24px', maxWidth: '760px', margin: '0 auto' }}>
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>

      </div>

      {/* ── LIGHTBOX ── */}
      {lightboxOpen && <Lightbox images={slideshowImages} startIndex={lightboxIndex} onClose={() => setLightboxOpen(false)} />}

      {/* ── STICKY BOTTOM ACTION BAR ── */}
      {showBottomCTA && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 980, background: 'rgba(9, 17, 31, 0.98)', borderTop: '1px solid var(--border-gold)', padding: isMobile ? '12px 16px' : '14px 32px', backdropFilter: 'blur(16px)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: isMobile ? 'none' : 'block' }}>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '0.98rem', fontWeight: 700, color: '#FFF' }}>{property.title}</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#A0AEC0' }}>{fmt(propPrice)} • {property.location}, Pune</div>
            </div>
            <div style={{ display: 'flex', gap: '10px', width: isMobile ? '100%' : 'auto' }}>
              <button onClick={onOpenInquiry} className="brand-btn-gold" style={{ padding: '11px 24px', fontSize: '0.85rem', flex: isMobile ? 1 : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <CheckCircle size={15} /> Book Visit
              </button>
              <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ padding: '11px 20px', borderRadius: '50px', background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.4)', color: '#25D366', textDecoration: 'none', fontWeight: 700, flex: isMobile ? 1 : 'none', textAlign: 'center', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <MessageSquare size={15} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
