import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin, ShieldCheck, Bed, Bath, Maximize, Sparkles,
  Car, Calculator, TrendingUp, HelpCircle,
  MessageSquare, ChevronLeft, ChevronRight, Download,
  Building, CheckCircle, FileText, ArrowRight, ArrowLeft,
  Share2, Heart, Award, Wifi, Zap, Camera, Trees, Coffee,
  Dumbbell, ParkingCircle, Droplets, UtensilsCrossed, Phone,
  Star, Shield, Sun, Wind, Tv, Lock, Play, X, ZoomIn,
  Home, Grid, Map, Video, Info, ChevronDown, RotateCw,
  Navigation, Clock, CheckSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/apiService';
import { useSEO, buildPropertySEO } from '../services/seoService';

/* ─── Builder lookup ──────────────────────────────────────── */
const getBuilderInfo = (title = '') => {
  if (title.includes('24K') || title.includes('Opula') || title.includes('Sereno'))
    return { name: 'Kolte-Patil Developers', brand: '24K Luxury Brand', reraId: 'A52100028461', desc: "Kolte-Patil's 24K brand delivers architectural design excellence, smart home configurations, and high-appreciation corridor landmarks across Pune West." };
  if (title.includes('Shapoorji') || title.includes('Joyville') || title.includes('Vyomora'))
    return { name: 'Shapoorji Pallonji Real Estate', brand: 'Joyville Landmark Series', reraId: 'PR1260002600999', desc: 'Shapoorji Pallonji Real Estate brings over 160 years of engineering legacy, delivering high-end construction standards, structural stability, and premium spaces across major Indian cities.' };
  if (title.includes('Godrej') || title.includes('Ivara'))
    return { name: 'Godrej Properties', brand: 'Premium Luxury Homes', reraId: 'PR1260002502426', desc: 'Godrej Properties brings a legacy of innovation, trust, and advanced home automation to ultra-premium gated communities.' };
  if (title.includes('Kasturi'))
    return { name: 'Kasturi Builders', brand: 'Signature Penthouses', reraId: 'A52100045231', desc: 'Kasturi is renowned for Italian marble finishes, double-height lobbies, and ultra-high-net-worth residences in Pune.' };
  if (title.includes('Lodha'))
    return { name: 'Lodha Group', brand: 'World-Class Residences', reraId: 'A52100033211', desc: 'Lodha Group creates landmark towers with premium lifestyle infrastructure and world-class finish standards.' };
  return { name: 'Tier-1 Authorized Developer', brand: 'Verified Portfolio Partner', reraId: 'A52100028461', desc: 'Managed under 24K Realtors authorized developer alliance.' };
};

/* ─── Location data ───────────────────────────────────────── */
const CORRIDOR_DATA = {
  HINJEWADI:   { appreciation: 14.2, commute: 9.2, green: 8.4, infra: 8.8, social: 8.7, future: 9.1, landmarks: ['Infosys Campus (1.2 km)', 'Wipro SEZ (2.8 km)', 'Blue Ridge Mall (3 km)', 'Hinjewadi Metro (planned)'] },
  WAKAD:       { appreciation: 14.2, commute: 8.9, green: 8.0, infra: 8.5, social: 8.2, future: 8.6, landmarks: ['Wakad Chowk (0.5 km)', 'D-Mart Wakad (1 km)', 'Pimpri Railway (7 km)', 'Aditya Birla Hospital (4 km)'] },
  BANER:       { appreciation: 16.5, commute: 9.5, green: 8.8, infra: 9.2, social: 9.0, future: 9.3, landmarks: ['Balewadi High Street (1 km)', 'Symbiosis College (2 km)', 'Baner Metro (planned)', 'SB Road (1.5 km)'] },
  BALEWADI:    { appreciation: 15.8, commute: 9.3, green: 8.6, infra: 9.0, social: 8.9, future: 9.2, landmarks: ['Balewadi Stadium (0.8 km)', 'High Street Phoenix (1.2 km)', 'Croma Mall (2 km)', 'Baner Road (1 km)'] },
  KHARADI:     { appreciation: 15.2, commute: 8.7, green: 8.2, infra: 8.9, social: 8.6, future: 9.0, landmarks: ['EON IT Park (0.5 km)', 'World Trade Center (1 km)', 'Pune Airport (6 km)', 'Koregaon Park (5 km)'] },
};
const getCorridorData = (location = '') => {
  const key = location.toUpperCase().replace(/\s+/g,'_').replace(/[^A-Z_]/g,'');
  for (const [k,v] of Object.entries(CORRIDOR_DATA)) { if (key.includes(k)) return v; }
  return { appreciation: 13.5, commute: 8.5, green: 8.0, infra: 8.2, social: 8.0, future: 8.4, landmarks: ['Pune IT Park (2 km)', 'Local Schools (1 km)', 'Highway Access (3 km)', 'Hospital (4 km)'] };
};

/* ─── Score Bar ───────────────────────────────────────────── */
function ScoreBar({ label, value, max = 10 }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.02em' }}>{label}</span>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gold-primary)' }}>{value}{max === 10 ? '/10' : '%'}</span>
      </div>
      <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          style={{ height: '100%', borderRadius: '4px', background: 'linear-gradient(90deg, var(--gold-secondary), var(--gold-primary))' }} />
      </div>
    </div>
  );
}

/* ─── Amenity Photo Card ──────────────────────────────────── */
const AMENITY_META = {
  '24/7 Concierge Desk':          { emoji: '🛎️',  img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80' },
  'Infinity Sky Pool':            { emoji: '🏊',  img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80' },
  'Infinity Swimming Pool':       { emoji: '🏊',  img: '/properties/vyomora/pool.jpg' },
  'Smart Home Automation':        { emoji: '📱',  img: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80' },
  '100% Power Backup Grid':       { emoji: '⚡',  img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80' },
  'CCTV & Video Door Phone':      { emoji: '📷',  img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80' },
  'Landscaped Zen Gardens':       { emoji: '🌿',  img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80' },
  'Landscaped Gardens':           { emoji: '🌿',  img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80' },
  'Clubhouse & Co-work Space':    { emoji: '🏛️',  img: 'https://images.unsplash.com/photo-1527192491265-7e452a145d55?auto=format&fit=crop&w=600&q=80' },
  'Clubhouse':                    { emoji: '🏛️',  img: 'https://images.unsplash.com/photo-1527192491265-7e452a145d55?auto=format&fit=crop&w=600&q=80' },
  "Children's Play Zone":         { emoji: '🎠',  img: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=600&q=80' },
  'Kids Play Area':               { emoji: '🎠',  img: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=600&q=80' },
  'Multi-Level Car Parking':      { emoji: '🅿️',  img: 'https://images.unsplash.com/photo-1506521788723-868126d5e368?auto=format&fit=crop&w=600&q=80' },
  'Rainwater Harvesting':         { emoji: '💧',  img: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=600&q=80' },
  '25,454 sq.ft Grand Clubhouse': { emoji: '🏛️',  img: '/properties/vyomora/brochure_p4_Im0.jpg' },
  'Miyawaki Forest Zone':         { emoji: '🌳',  img: '/properties/vyomora/playarea.jpg' },
  'Wellness Clinic':              { emoji: '💊',  img: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80' },
  'Digital Dome Theater':         { emoji: '🎬',  img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80' },
  'Cricket Simulator Suite':      { emoji: '🏏',  img: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=80' },
  'Indoor Games':                 { emoji: '🎱',  img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80' },
  'Trampoline & Adventure Park':  { emoji: '🎪',  img: '/properties/vyomora/playarea.jpg' },
  'Spa & Reflexology Path':       { emoji: '🧘',  img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80' },
  'Library & Co-working Lounge':  { emoji: '📚',  img: 'https://images.unsplash.com/photo-1527192491265-7e452a145d55?auto=format&fit=crop&w=600&q=80' },
  'Modular Kitchen Provisions':   { emoji: '🍳',  img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80' },
  'Private Elevator Access':      { emoji: '🛗',  img: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=600&q=80' },
  'Modern Gymnasium':             { emoji: '💪',  img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80' },
  'Walking / Jogging Track':      { emoji: '🏃',  img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80' },
  '24x7 Security':                { emoji: '🔒',  img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80' },
  'Multipurpose Hall':            { emoji: '🎭',  img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80' },
};

function AmenityPhotoCard({ label, index }) {
  const meta = AMENITY_META[label] || { emoji: '✨', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' };
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: '14px',
        border: hov ? '1.5px solid rgba(212,175,55,0.6)' : '1.5px solid rgba(255,255,255,0.06)',
        cursor: 'default', transition: 'all 0.3s',
        boxShadow: hov ? '0 12px 32px rgba(0,0,0,0.55)' : '0 4px 12px rgba(0,0,0,0.3)',
        transform: hov ? 'translateY(-4px)' : 'translateY(0)',
        aspectRatio: '4/3',
      }}
    >
      <img
        src={meta.img}
        alt={label}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          transform: hov ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
        }}
        onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'; }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: hov
          ? 'linear-gradient(to top, rgba(4,8,20,0.85) 0%, rgba(4,8,20,0.2) 60%, transparent 100%)'
          : 'linear-gradient(to top, rgba(4,8,20,0.75) 0%, rgba(4,8,20,0.1) 60%, transparent 100%)',
        transition: 'background 0.3s',
      }} />
      <div style={{
        position: 'absolute', bottom: '12px', left: '12px', right: '12px',
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        <div style={{
          width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
          background: 'rgba(212,175,55,0.18)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(212,175,55,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.9rem',
        }}>
          {meta.emoji}
        </div>
        <span style={{
          fontSize: '0.78rem', fontWeight: 700, color: '#fff',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)', lineHeight: 1.25,
        }}>{label}</span>
      </div>
    </div>
  );
}

/* ─── Image Lightbox ──────────────────────────────────────── */
function Lightbox({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx(i => (i + 1) % images.length);
      if (e.key === 'ArrowLeft')  setIdx(i => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [images.length, onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onClose}>
      <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <X size={20}/>
      </button>
      <button onClick={(e) => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }}
        style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: '48px', height: '48px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
        <ChevronLeft size={22}/>
      </button>
      <AnimatePresence mode="wait">
        <motion.img key={idx} src={images[idx]} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3 }}
          style={{ maxWidth: '88vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 30px 80px rgba(0,0,0,0.8)' }}
          onClick={e => e.stopPropagation()}/>
      </AnimatePresence>
      <button onClick={(e) => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }}
        style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: '48px', height: '48px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
        <ChevronRight size={22}/>
      </button>
      <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
        {images.map((_, i) => (
          <button key={i} onClick={e => { e.stopPropagation(); setIdx(i); }} style={{ width: i === idx ? '24px' : '8px', height: '8px', borderRadius: '4px', border: 'none', background: i === idx ? 'var(--gold-primary)' : 'rgba(255,255,255,0.3)', transition: 'all 0.3s', cursor: 'pointer', padding: 0 }}/>
        ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function PropertyDetailView({ property, onBack, onOpenInquiry, onOpenChauffeur, onOpenBrochure, formatPrice, getEmbedVideoUrl, allProperties = [] }) {
  const [activeSlide, setActiveSlide]     = useState(0);
  const [downPayment, setDownPayment]     = useState(20);
  const [interestRate, setInterestRate]   = useState(8.5);
  const [loanTerm, setLoanTerm]           = useState(20);
  const [activePlan, setActivePlan]       = useState('2bhk');
  const [activeTab, setActiveTab]         = useState('overview');
  const [lightboxOpen, setLightboxOpen]   = useState(false);
  const [lightboxStart, setLightboxStart] = useState(0);
  const [marketTrends, setMarketTrends]   = useState(null);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [activeVideoTab, setActiveVideoTab] = useState('walkthrough');
  const [hoveredTrendPoint, setHoveredTrendPoint] = useState(null);

  const trendData = [
    { year: '2021', price: '₹5,400/sqft', growth: 'Base Year', x: 40, y: 110 },
    { year: '2022', price: '₹5,900/sqft', growth: '+9.2%', x: 120, y: 95 },
    { year: '2023', price: '₹6,500/sqft', growth: '+20.3%', x: 200, y: 78 },
    { year: '2024', price: '₹7,200/sqft', growth: '+33.3%', x: 280, y: 58 },
    { year: '2025', price: '₹7,800/sqft', growth: '+44.4%', x: 360, y: 40 },
    { year: '2026', price: '₹8,400/sqft', growth: '+55.5%', x: 440, y: 20 },
  ];

  const [isWishlisted, setIsWishlisted] = useState(() => {
    try { const s = localStorage.getItem('wishlist_properties'); return (s ? JSON.parse(s) : []).includes(property.id); }
    catch { return false; }
  });

  // Mobile breakpoint — reactive
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const go = async () => { try { setMarketTrends(await apiService.getMarketTrends(property.location)); } catch {} };
    go();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [property.id, property.location]);

  const isVyomora    = property.title?.toLowerCase().includes('vyomora');
  const isCommercial = property.propertyType === 'COMMERCIAL';
  const builder      = getBuilderInfo(property.title);
  const corridor     = getCorridorData(property.location);

  // ── Dynamic SEO for this property ────────────────────────────────────────────
  useSEO(buildPropertySEO(property));


  const slideshowImages = property.slideshowImages || [
    property.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&w=1600&q=85',
  ];

  const principal   = Number(property.price) * (1 - downPayment / 100);
  const mRate       = (interestRate / 12) / 100;
  const totalMonths = loanTerm * 12;
  const emi = mRate > 0 ? (principal * mRate * Math.pow(1 + mRate, totalMonths)) / (Math.pow(1 + mRate, totalMonths) - 1) : principal / totalMonths;

  const handleToggleWishlist = async () => {
    const next = !isWishlisted;
    setIsWishlisted(next);
    try {
      const s = localStorage.getItem('wishlist_properties');
      let list = s ? JSON.parse(s) : [];
      if (next) { if (!list.includes(property.id)) list.push(property.id); }
      else { list = list.filter(id => id !== property.id); }
      localStorage.setItem('wishlist_properties', JSON.stringify(list));
      if (next) await apiService.addToWishlist(property.id);
      else      await apiService.removeFromWishlist(property.id);
    } catch {}
  };

  const waLink = `https://wa.me/919673000053?text=Hi%2024K%20Realtors,%20I'm%20interested%20in%20"${encodeURIComponent(property.title)}"%20at%20${encodeURIComponent(property.location)}.%20Please%20share%20details.`;

  const simScore = (p) => {
    let s = 0;
    if (p.location === property.location)         s += 35;
    if (p.propertyType === property.propertyType) s += 20;
    if (p.bedrooms === property.bedrooms)         s += 20;
    const d = Math.abs(Number(p.price) - Number(property.price)) / Number(property.price);
    if (d <= 0.1) s += 25; else if (d <= 0.25) s += 15; else if (d <= 0.5) s += 5;
    return s;
  };
  const similar = allProperties.filter(p => p.id !== property.id)
    .map(p => ({ ...p, score: simScore(p) })).filter(p => p.score >= 40)
    .sort((a, b) => b.score - a.score).slice(0, 3);

  const TABS = [
    { id: 'overview',   icon: <Home size={15}/>,     label: 'Overview' },
    { id: 'amenities',  icon: <Sparkles size={15}/>,  label: 'Amenities' },
    { id: 'floorplans', icon: <Grid size={15}/>,      label: 'Floor Plans' },
    { id: 'pricing',    icon: <FileText size={15}/>,  label: 'Pricing' },
    { id: 'location',   icon: <Map size={15}/>,       label: 'Location' },
    { id: 'construction', icon: <Clock size={15}/>,   label: 'Progress' },
    { id: 'legacy',     icon: <Building size={15}/>,  label: 'Legacy' },
    ...(property.videoUrl ? [{ id: 'video', icon: <Video size={15}/>, label: 'Video Tour' }] : []),
  ];

  const fpVariants = [
    { id: '2bhk',   label: '2 BHK',       url: property.floorPlanUrl,     desc: '684 - 839 sq.ft' },
    { id: '3bhk',   label: '3 BHK',       url: property.floorPlan3BHKUrl, desc: '1052 - 1477 sq.ft' },
    { id: 'master', label: 'Master Plan', url: property.masterPlanUrl,    desc: '12.5 Acre Estate' },
  ].filter(v => v.url);
  const fpActive = fpVariants.find(v => v.id === activePlan) || fpVariants[0];

  const amenityList = property.specificAmenities || [
    'Infinity Swimming Pool', 'Modern Gymnasium', 'Kids Play Area',
    'Landscaped Gardens', 'Clubhouse', 'Indoor Games',
    'Walking / Jogging Track', '24x7 Security', 'Multipurpose Hall',
    '100% Power Backup Grid', 'Rainwater Harvesting', 'Multi-Level Car Parking',
  ];
  const displayedAmenities = showAllAmenities ? amenityList : amenityList.slice(0, 9);

  const Card = ({ children, style = {} }) => (
    <div style={{ background: 'rgba(10,18,36,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '20px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', ...style }}>
      {children}
    </div>
  );
  const SectionTitle = ({ icon, children, sub }) => (
    <div style={{ marginBottom: '22px' }}>
      <h2 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '1.15rem', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        {icon}{children}
      </h2>
      {sub && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', margin: 0 }}>{sub}</p>}
    </div>
  );

  /* ─── Unit config shorthand ─── */
  const unitConfigs = property.configurations || [
    { name: '2 BHK', area: '684 - 839 sq.ft', price: '₹84.00 L Onwards' },
    { name: '3 BHK', area: '990 - 1650 sq.ft', price: '₹1.17 Cr Onwards' },
    { name: '4 BHK', area: '1650 - 4200 sq.ft', price: '₹3.75 Cr Onwards' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
      style={{
        position: 'relative',
        color: 'var(--text-light)',
        paddingBottom: '100px',
        backgroundImage: 'radial-gradient(ellipse at top center, rgba(7, 15, 30, 0.85) 0%, rgba(3, 7, 18, 0.96) 100%), url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        borderRadius: '20px',
        border: '1px solid rgba(212, 175, 55, 0.25)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
        overflow: 'hidden'
      }}>

      {/* ══ TOP NAV BAR ══ */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(4,8,20,0.6)', backdropFilter: 'blur(12px)',
      }}>
        {/* Left: Back + Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <motion.button onClick={onBack} whileHover={{ x: -3 }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '7px 14px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s' }}>
            <ArrowLeft size={14}/> Back to Listings
          </motion.button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>
            <span style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.55)' }} onClick={onBack}>Home</span>
            <ChevronRight size={12}/>
            <span style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.55)' }} onClick={onBack}>Projects</span>
            <ChevronRight size={12}/>
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>Hinjewadi</span>
            <ChevronRight size={12}/>
            <span style={{ color: 'var(--gold-secondary)', fontWeight: 600, maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{property.title}</span>
          </div>
        </div>
        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={handleToggleWishlist}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: isWishlisted ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.04)', border: isWishlisted ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '7px 14px', color: isWishlisted ? 'var(--gold-primary)' : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.25s' }}>
            <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'}/> {isWishlisted ? 'Saved' : 'Save'}
          </button>
          <button onClick={() => navigator.share?.({ title: property.title, url: window.location.href }).catch(() => {})}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '7px 14px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
            <Share2 size={14}/> Share
          </button>
        </div>
      </div>

      {/* ══ HERO SPLIT GRID + RIGHT SIDEBAR ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 340px', gap: '0', padding: '0' }}>

        {/* Left: Hero Split Grid */}
        <div style={{ padding: isMobile ? '16px 14px' : '20px 20px 20px 32px' }}>
          {/* Image Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 0.42fr', gap: '8px', borderRadius: '18px', overflow: 'hidden', height: isMobile ? '240px' : '420px' }}>
            {/* Main big image */}
            <div style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => { setLightboxStart(activeSlide); setLightboxOpen(true); }}>
              <AnimatePresence mode="wait">
                <motion.img key={activeSlide} src={slideshowImages[activeSlide]}
                  initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}/>
              </AnimatePresence>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(4,8,20,0.4) 100%)' }}/>
              {isVyomora && (
                <div style={{ position: 'absolute', top: '14px', left: '14px', background: 'rgba(239,68,68,0.9)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '5px 12px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  🔥 New Launch
                </div>
              )}
              {/* Play button for video */}
              <button onClick={(e) => { e.stopPropagation(); document.getElementById('sec-video')?.scrollIntoView({ behavior: 'smooth' }); }}
                style={{ position: 'absolute', bottom: '16px', left: '16px', display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(4,8,20,0.82)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '30px', padding: '8px 14px', color: '#fff', cursor: 'pointer', fontSize: '0.76rem', fontWeight: 600 }}>
                <Play size={12} fill="white"/> Watch Video Tour
              </button>
            </div>

            {/* Right column: 3 thumbnails + more */}
            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr 1fr', gap: '8px' }}>
              {slideshowImages.slice(1, 3).map((img, i) => (
                <div key={i} style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', borderRadius: '4px' }}
                  onClick={() => { setActiveSlide(i + 1); }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', display: 'block' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.06)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}/>
                </div>
              ))}
              {/* +N More */}
              <div style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', borderRadius: '4px' }}
                onClick={() => { setLightboxStart(3); setLightboxOpen(true); }}>
                <img src={slideshowImages[3] || slideshowImages[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)', display: 'block' }}/>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Camera size={22} color="#fff"/>
                  <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 800 }}>+{Math.max(0, slideshowImages.length - 3)} Photos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Property Title + Info */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <span style={{ background: 'var(--gold-primary)', color: '#070F1E', fontSize: '0.62rem', fontWeight: 800, padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{property.transactionType}</span>
              <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', fontSize: '0.62rem', fontWeight: 700, padding: '4px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={10} color="var(--gold-primary)"/> MahaRERA: {builder.reraId}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', fontSize: '0.62rem', fontWeight: 700, padding: '4px 10px', borderRadius: '4px' }}>New Launch</span>
              <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', fontSize: '0.62rem', fontWeight: 700, padding: '4px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckSquare size={10} color="#10b981"/> RERA Certified
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1.4rem, 2.4vw, 2.2rem)', color: '#fff', margin: '0 0 8px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              {property.title}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.87rem', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 16px' }}>
              <MapPin size={13} color="var(--gold-primary)"/> {property.address || `Joyville Sensorium, Near Phase 1 IT Park, Hinjewadi`}, Pune, Maharashtra
            </p>

            {/* Spec Pills */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { icon: <Bed size={14} color="var(--gold-primary)"/>, label: 'Configuration', val: isCommercial ? 'Commercial' : `${property.bedrooms > 0 ? `2, 3 & 4 BHK` : 'Studio'}` },
                { icon: <Maximize size={14} color="var(--gold-primary)"/>, label: 'Carpet Area', val: '990 – 4200 sq.ft.' },
                { icon: null, label: 'Price Range', val: `₹84 L – ₹3.75 Cr*` },
                { icon: <Clock size={14} color="var(--gold-primary)"/>, label: 'Possession', val: 'Dec 2027 (Tent.)' },
                { icon: <Building size={14} color="var(--gold-primary)"/>, label: 'Towers', val: `Towers | G+22` },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px 14px' }}>
                  {s.icon}
                  <div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1 }}>{s.label}</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{s.val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* About Project (Moved Above Fold to Fill Space) */}
            <div style={{ marginTop: '24px', background: 'linear-gradient(135deg, rgba(12,24,48,0.7) 0%, rgba(6,12,24,0.85) 100%)', border: '1px solid rgba(212,175,55,0.18)', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
              <SectionTitle icon={<Info size={16} color="var(--gold-primary)"/>} sub="Official Developer Brief">About The Project</SectionTitle>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, margin: '0 0 14px', letterSpacing: '0.01em' }}>
                {property.description || `Vyomora by Shapoorji Pallonji Real Estate is a landmark residential project nestled at Hinjewadi Off Maan Road, Pune's fastest appreciating IT corridor. Spread across 12.5 acres with 6 premium towers, Vyomora offers intelligently designed 2 & 3 BHK residences featuring expansive balconies, superior RCC framed structure, and a 25,454 sq.ft Grand Clubhouse with 40+ world-class amenities.`}
              </p>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, margin: 0, letterSpacing: '0.01em' }}>
                Engineered with over 160 years of structural legacy, this residential sanctuary prioritizes low-density living, advanced security systems, and high capital appreciation corridors. Perfect for tech professionals seeking premium connectivity and refined gated estate living in Pune West.
              </p>
            </div>

            {/* Investment Highlights (6 Premium USPs) */}
            <div style={{ marginTop: '24px' }}>
              <SectionTitle icon={<Sparkles size={16} color="var(--gold-primary)"/>} sub="Key Project Anchors">⭐ Premium Highlights</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px' }}>
                {[
                  ['🏙️','6 Premium Towers','High Rise Luxury'],
                  ['🌿','70% Open Spaces','Eco-Friendly Gated'],
                  ['🏊','30+ Amenities','Elite Club Lifestyle'],
                  ['📐','16+ Acre Campus','Sprawling Gated Estate'],
                  ['🏗️','160 Yr Legacy','Engineering Trust'],
                  ['✅','MahaRERA Verified','PR1260002600999']
                ].map(([ic, lb, desc]) => (
                  <div key={lb} style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '12px', padding: '14px 16px', transition: 'all 0.25s', cursor: 'default' }}
                    onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(212,175,55,0.05)'; }}
                    onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{ic}</span>
                      <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 700 }}>{lb}</span>
                    </div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Trend Graph & Live Investment Metrics */}
            <div style={{ marginTop: '24px', background: 'rgba(10,18,36,0.55)', border: '1px solid rgba(255,255,255,0.065)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                <SectionTitle icon={<TrendingUp size={16} color="var(--gold-primary)"/>} sub="Historical Capital Appreciation Trend">📈 Market Value & Trends</SectionTitle>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <TrendingUp size={12} color="#10b981"/> +55.5% overall growth (5 Yrs)
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'center' }}>
                {/* SVG Graph */}
                <div style={{ background: 'rgba(4,8,20,0.4)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                  <svg viewBox="0 0 460 140" width="100%" height="100%" style={{ overflow: 'visible' }}>
                    <defs>
                      <linearGradient id="trend-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--gold-primary)" stopOpacity="0.25"/>
                        <stop offset="100%" stopColor="var(--gold-primary)" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    {/* Grid Lines */}
                    <line x1="40" y1="20" x2="440" y2="20" stroke="rgba(255,255,255,0.05)" />
                    <line x1="40" y1="50" x2="440" y2="50" stroke="rgba(255,255,255,0.05)" />
                    <line x1="40" y1="80" x2="440" y2="80" stroke="rgba(255,255,255,0.05)" />
                    <line x1="40" y1="110" x2="440" y2="110" stroke="rgba(255,255,255,0.05)" />
                    
                    {/* Area under line */}
                    <path d="M 40 110 L 120 95 L 200 78 L 280 58 L 360 40 L 440 20 L 440 120 L 40 120 Z" fill="url(#trend-gradient)" />
                    
                    {/* Trend Line */}
                    <path d="M 40 110 L 120 95 L 200 78 L 280 58 L 360 40 L 440 20" fill="none" stroke="var(--gold-primary)" strokeWidth="3" />
                    
                    {/* Interactive dots */}
                    {trendData.map((pt, i) => (
                      <g key={i} onMouseEnter={() => setHoveredTrendPoint(pt)} onMouseLeave={() => setHoveredTrendPoint(null)} style={{ cursor: 'pointer' }}>
                        <circle cx={pt.x} cy={pt.y} r={hoveredTrendPoint?.year === pt.year ? 7 : 4.5} fill="#070f1e" stroke="var(--gold-primary)" strokeWidth="2" />
                        <text x={pt.x} y="134" textAnchor="middle" fill={hoveredTrendPoint?.year === pt.year ? 'var(--gold-primary)' : 'rgba(255,255,255,0.4)'} style={{ fontSize: '9px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>{pt.year}</text>
                      </g>
                    ))}
                  </svg>
                  {/* Tooltip Overlay */}
                  {hoveredTrendPoint && (
                    <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(7,15,30,0.95)', border: '1px solid var(--gold-primary)', borderRadius: '6px', padding: '6px 12px', fontSize: '0.74rem', color: '#fff', pointerEvents: 'none', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                      <strong>Year {hoveredTrendPoint.year}:</strong> {hoveredTrendPoint.price} <span style={{ color: '#10b981', marginLeft: '5px' }}>({hoveredTrendPoint.growth})</span>
                    </div>
                  )}
                </div>

                {/* Investment Stats Grid */}
                <div style={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    ['📊 Expected ROI','5.8% p.a.','Based on 2BHK/3BHK average market data'],
                    ['💰 Est. Rental Yield','4.2%','High-demand tech tenant corridor'],
                    ['📈 Appreciation Index','14.2% p.a.','Hinjewadi Phase 1 historic performance']
                  ].map(([label, val, desc]) => (
                    <div key={label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                        <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>{label}</span>
                        <span style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--gold-primary)' }}>{val}</span>
                      </div>
                      <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.35)' }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sticky Sidebar (Above Fold) */}
        <div style={{ padding: '20px 32px 20px 0', position: 'sticky', top: '0', alignSelf: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Key Highlights Card */}
            <div style={{ background: 'rgba(10,18,36,0.7)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '0.88rem', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <Star size={14}/> Key Highlights
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Premium gated community with 24x7 security',
                  '70% open spaces with lush green landscape',
                  '30+ world-class lifestyle amenities',
                  'Excellent connectivity to IT Park, Metro & Expressway',
                  'Reputed developer with 160+ years of legacy',
                ].map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                      <CheckCircle size={10} color="var(--gold-primary)"/>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.45 }}>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Overview Card */}
            <div style={{ background: 'rgba(10,18,36,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '0.88rem', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                ₹ Price Overview
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: '3px' }}>Starting Price</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold-primary)', lineHeight: 1 }}>₹84.00 L*</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: '3px' }}>Price Range</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>₹84 L – ₹3.75 Cr*</div>
                </div>
              </div>
              <button onClick={() => document.getElementById('sec-pricing')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ width: '100%', padding: '10px', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '10px', background: 'rgba(212,175,55,0.06)', color: 'var(--gold-secondary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.12)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.6)'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.06)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; }}>
                🔍 View Price Breakup
              </button>
            </div>

            {/* Unit Configurations */}
            <div style={{ background: 'rgba(10,18,36,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '0.88rem', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Unit Configurations
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {unitConfigs.slice(0, 3).map((c, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < unitConfigs.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bed size={12} color="var(--gold-primary)"/>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{c.name || c.type}</div>
                        <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>{c.area}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gold-primary)' }}>{c.price || formatPrice(property.price)}</div>
                      <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)' }}>Onwards</div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => document.getElementById('sec-floorplans')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ marginTop: '12px', width: '100%', background: 'none', border: 'none', color: 'var(--gold-secondary)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 0' }}>
                View All Floor Plans <ArrowRight size={12}/>
              </button>
            </div>

            {/* Interested? CTA */}
            <div style={{ background: 'rgba(10,18,36,0.7)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>Interested in this Property?</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginBottom: '14px' }}>Schedule a free site visit or get more details.</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onOpenInquiry(property)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--gold-primary), var(--gold-secondary))', border: 'none', color: '#070F1E', fontWeight: 800, fontSize: '0.84rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
                  🏢 Book Site Visit
                </motion.button>
                <button
                  type="button"
                  onClick={() => onOpenBrochure && onOpenBrochure(property)}
                  style={{ width: '100%', padding: '11px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(197,168,128,0.3)', color: 'var(--gold-primary)', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '2px' }}
                >
                  📄 Download One-Pager PDF Brochure
                </button>
                <a href={waLink} target="_blank" rel="noopener noreferrer"
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.3)', color: '#25D366', fontWeight: 700, fontSize: '0.84rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', textDecoration: 'none', boxSizing: 'border-box' }}>
                  <MessageSquare size={14}/> WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ STICKY NAV TABS ══ */}
      <div style={{ position: 'sticky', top: '0px', zIndex: 50, background: 'rgba(4,8,20,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(212,175,55,0.1)', padding: '0 32px', display: 'flex', gap: '2px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); document.getElementById(`sec-${tab.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '14px 18px', border: 'none', background: 'none', color: activeTab === tab.id ? 'var(--gold-primary)' : 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontWeight: activeTab === tab.id ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, borderBottom: activeTab === tab.id ? '2px solid var(--gold-primary)' : '2px solid transparent', transition: 'all 0.2s' }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ══ BODY: LEFT CONTENT + RIGHT SIDEBAR ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.65fr) minmax(0,1fr)', gap: '28px', padding: '32px 32px 0', alignItems: 'start' }} className="detail-two-col">

        {/* ── LEFT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* anchor to allow Overview tab scroll behavior */}
          <div id="sec-overview" style={{ scrollMarginTop: '80px' }} />

          {/* Amenities — 3×3 Photo Grid */}
          <div id="sec-amenities">
            <Card style={{ background: 'linear-gradient(135deg, rgba(12,24,48,0.7) 0%, rgba(6,12,24,0.85) 100%)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <SectionTitle icon={<Sparkles size={17} color="var(--gold-primary)"/>} sub="World-class lifestyle amenities for you and your family">Amenities</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '18px' }}>
                {displayedAmenities.map((a, i) => (
                  <AmenityPhotoCard key={a} label={a} index={i}/>
                ))}
              </div>
              {amenityList.length > 9 && (
                <button onClick={() => setShowAllAmenities(!showAllAmenities)}
                  style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '10px', padding: '11px 20px', color: 'var(--gold-secondary)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.12)'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.06)'; }}>
                  {showAllAmenities ? 'Show Less ↑' : `View All Amenities (${amenityList.length}) →`}
                </button>
              )}
            </Card>
          </div>

          {/* Floor Plans */}
          <div id="sec-floorplans">
            <Card style={{ background: 'linear-gradient(135deg, rgba(12,24,48,0.7) 0%, rgba(6,12,24,0.88) 100%)', border: '1px solid rgba(255,255,255,0.07)', padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  📐 Layout Blueprints
                </h2>
                <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ZoomIn size={12}/> Click plan to zoom
                </span>
              </div>

              {fpActive ? (
                <>
                  {/* Variant Tabs */}
                  {fpVariants.length > 1 && (
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
                      {fpVariants.map(v => (
                        <button key={v.id} onClick={() => setActivePlan(v.id)}
                          style={{ padding: '8px 18px', borderRadius: '8px', border: activePlan === v.id ? '2px solid var(--gold-primary)' : '2px solid rgba(255,255,255,0.1)', background: activePlan === v.id ? 'rgba(212,175,55,0.1)' : 'transparent', color: activePlan === v.id ? 'var(--gold-primary)' : 'rgba(255,255,255,0.6)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                          {v.label} <span style={{ fontSize: '0.68rem', opacity: 0.7 }}>· {v.desc}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Main Plan Viewer */}
                  <div onClick={() => setLightboxOpen(true)}
                    style={{ position: 'relative', background: '#fff', borderRadius: '14px', border: '2px solid rgba(212,175,55,0.2)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)', overflow: 'hidden', cursor: 'zoom-in', marginBottom: '16px', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={fpActive.url} alt={`${fpActive.label} Floor Plan`}
                      style={{ width: '100%', maxHeight: '480px', objectFit: 'contain', display: 'block', transition: 'transform 0.4s ease' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}/>
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(7,15,30,0.8)', backdropFilter: 'blur(8px)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '8px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--gold-secondary)', pointerEvents: 'none' }}>
                      <ZoomIn size={12}/> Click to zoom
                    </div>
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'var(--gold-primary)', color: '#070f1e', borderRadius: '7px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 800 }}>
                      {fpActive.label} · {fpActive.desc}
                    </div>
                  </div>

                  {/* Specs row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', alignItems: 'end' }}>
                    <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px 14px' }}>
                      <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Unit Type</div>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--gold-primary)' }}>{fpActive.label}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px 14px' }}>
                      <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Carpet Area</div>
                      <div style={{ fontSize: '0.94rem', fontWeight: 700, color: '#fff' }}>{fpActive.desc}</div>
                    </div>
                    <button onClick={onOpenInquiry}
                      style={{ padding: '13px', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '10px', background: 'none', color: 'var(--gold-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '7px', justifyContent: 'center', transition: 'all 0.2s' }}
                      onMouseOver={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.08)'; }}
                      onMouseOut={e => { e.currentTarget.style.background = 'none'; }}>
                      <Download size={14}/> Download Brochure
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '48px', fontSize: '0.88rem' }}>
                  Floor plans available on inquiry
                </div>
              )}

              {/* Inline Zoom Lightbox */}
              {lightboxOpen && fpActive && (
                <div onClick={() => setLightboxOpen(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(4,8,20,0.96)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}>
                  <button onClick={e => { e.stopPropagation(); setLightboxOpen(false); }}
                    style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: '44px', height: '44px', color: '#fff', fontSize: '1.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
                    ×
                  </button>
                  {fpVariants.length > 1 && (
                    <>
                      <button onClick={e => { e.stopPropagation(); const idx = fpVariants.findIndex(v => v.id === activePlan); setActivePlan(fpVariants[(idx - 1 + fpVariants.length) % fpVariants.length].id); }}
                        style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '50%', width: '44px', height: '44px', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>‹</button>
                      <button onClick={e => { e.stopPropagation(); const idx = fpVariants.findIndex(v => v.id === activePlan); setActivePlan(fpVariants[(idx + 1) % fpVariants.length].id); }}
                        style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '50%', width: '44px', height: '44px', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>›</button>
                    </>
                  )}
                  <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh', background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.8)', position: 'relative' }}>
                    <img src={fpActive.url} alt={`${fpActive.label} Floor Plan`} style={{ display: 'block', maxWidth: '90vw', maxHeight: '88vh', objectFit: 'contain' }}/>
                    <div style={{ position: 'absolute', bottom: '14px', left: '14px', background: 'var(--gold-primary)', color: '#070f1e', borderRadius: '8px', padding: '5px 14px', fontSize: '0.78rem', fontWeight: 800 }}>
                      {fpActive.label} · {fpActive.desc}
                    </div>
                  </div>
                  <div style={{ position: 'absolute', bottom: '18px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>
                    Click anywhere to close · Use ‹ › to switch plans
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Pricing Table */}
          {property.configurations && property.configurations.length > 0 && (
            <div id="sec-pricing">
              <Card style={{ background: 'linear-gradient(135deg, rgba(12,24,48,0.7) 0%, rgba(6,12,24,0.85) 100%)', border: '1px solid rgba(212,175,55,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
                  <SectionTitle icon={<Building size={17} color="var(--gold-primary)"/>}>Tower Configurations & Pricing</SectionTitle>
                  <span style={{ fontSize: '0.66rem', color: 'var(--gold-secondary)', border: '1px solid rgba(212,175,55,0.25)', padding: '4px 10px', borderRadius: '4px', background: 'rgba(212,175,55,0.05)', display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 600, flexShrink: 0 }}>
                    🛡️ MahaRERA Escrow Protected
                  </span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '460px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {['Unit Type','Super Carpet Area','Investment Estimate','Status','Action'].map((h, i) => <th key={h} style={{ padding: '14px 16px', textAlign: i === 4 ? 'right' : 'left' }}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {property.configurations.map((c, idx) => {
                        const fast = c.status?.includes('Fast') || c.status?.includes('Exclusive');
                        const lim  = c.status?.includes('Limited') || c.status?.includes('Premium');
                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.88rem', transition: 'all 0.25s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.04)'; e.currentTarget.style.borderLeft = '2px solid var(--gold-primary)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderLeft = 'none'; }}>
                            <td style={{ padding: '16px 16px', fontWeight: 700, color: '#fff' }}>{c.name}</td>
                            <td style={{ padding: '16px 16px', color: 'rgba(255,255,255,0.7)' }}>{c.area}</td>
                            <td style={{ padding: '16px 16px', color: 'var(--gold-primary)', fontWeight: 800, fontSize: '0.98rem' }}>{c.price}</td>
                            <td style={{ padding: '16px 16px' }}>
                              {c.status && <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', background: fast ? 'rgba(239,68,68,0.12)' : lim ? 'rgba(251,191,36,0.12)' : 'rgba(16,185,129,0.12)', color: fast ? '#ef4444' : lim ? '#fbbf24' : '#10b981', border: `1px solid ${fast ? 'rgba(239,68,68,0.2)' : lim ? 'rgba(251,191,36,0.2)' : 'rgba(16,185,129,0.2)'}`, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.status}</span>}
                            </td>
                            <td style={{ padding: '16px 16px', textAlign: 'right' }}>
                              <button onClick={() => onOpenInquiry(property)} style={{ background: 'var(--gold-primary)', color: '#070f1e', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', transition: 'all 0.2s' }}
                                onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 0 14px rgba(212,175,55,0.5)'; }}
                                onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}>
                                Request Call <ArrowRight size={12}/>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* Video Tour */}
          {property.videoUrl && (
            <div id="sec-video">
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <SectionTitle icon={<Play size={17} color="var(--gold-primary)"/>}>🎬 Cinematic Video Tour</SectionTitle>
                  {isVyomora && (
                    <div style={{ display: 'inline-flex', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.07)' }}>
                      {[{ id: 'walkthrough', label: 'Drone Walkthrough' }, { id: 'showflat', label: 'Show Flat Tour' }, { id: 'location', label: 'Location AV' }].map(t => (
                        <button key={t.id} onClick={() => setActiveVideoTab(t.id)}
                          style={{ background: activeVideoTab === t.id ? 'var(--gold-primary)' : 'transparent', color: activeVideoTab === t.id ? '#070f1e' : 'rgba(255,255,255,0.6)', border: 'none', padding: '7px 16px', borderRadius: '30px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s', whiteSpace: 'nowrap' }}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {isVyomora ? (
                  <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '16/9', boxShadow: '0 25px 60px rgba(0,0,0,0.6)', border: '1px solid rgba(212,175,55,0.18)', background: '#040814' }}>
                    {activeVideoTab === 'walkthrough' && (
                      <video key="walkthrough" controls preload="metadata" poster={slideshowImages[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                        <source src="https://drive.google.com/uc?id=1DYALmyrqT27g5nS8fPwffNLFMO3iBpT0" type="video/mp4"/>
                      </video>
                    )}
                    {activeVideoTab === 'showflat' && (
                      <video key="showflat" controls preload="metadata" poster={slideshowImages[4] || slideshowImages[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                        <source src="https://drive.google.com/uc?id=1vXzk2x-kiWGtLj_jsTKsyPnKzMBJqSsR" type="video/mp4"/>
                      </video>
                    )}
                    {activeVideoTab === 'location' && (
                      <video key="location" controls preload="metadata" poster={property.locationMapUrl || slideshowImages[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                        <source src="https://drive.google.com/uc?id=1IsrDGjG8-1iHFtCJk15MVRxSsndNA63A" type="video/mp4"/>
                      </video>
                    )}
                  </div>
                ) : (
                  <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '16/9', boxShadow: '0 25px 60px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <iframe src={getEmbedVideoUrl(property.videoUrl)} title="Property Video Tour" style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen/>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Location */}
          <div id="sec-location">
            <Card style={{ background: 'linear-gradient(135deg, rgba(12,24,48,0.7) 0%, rgba(6,12,24,0.85) 100%)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <SectionTitle icon={<MapPin size={17} color="var(--gold-primary)"/>} sub="Strategically located in the heart of Hinjewadi">Location & Connectivity</SectionTitle>
              {property.locationMapUrl && (
                <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '14px', marginBottom: '22px', border: '1px solid rgba(212,175,55,0.2)', cursor: 'pointer' }} onClick={() => window.open(property.locationMapUrl, '_blank')}>
                  <img src={property.locationMapUrl} alt="Location Map" style={{ width: '100%', display: 'block', maxHeight: '280px', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}/>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,8,20,0.5), transparent)', pointerEvents: 'none' }}/>
                  <div style={{ position: 'absolute', bottom: '14px', right: '14px', background: 'var(--gold-primary)', color: '#070f1e', borderRadius: '8px', padding: '6px 14px', fontSize: '0.78rem', fontWeight: 800 }}>Open in Google Maps ↗</div>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                {corridor.landmarks.map((l, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '11px', padding: '12px 14px', gap: '10px', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'}
                    onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.1)'}>
                    <span style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>📍 {l.split('(')[0].trim()}</span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--gold-secondary)', fontWeight: 800, padding: '3px 8px', background: 'rgba(212,175,55,0.06)', borderRadius: '6px', whiteSpace: 'nowrap' }}>{l.includes('(') ? l.split('(')[1].replace(')','') : '—'}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Construction Progress Timeline */}
          <div id="sec-construction" style={{ scrollMarginTop: '80px' }}>
            <Card style={{ background: 'linear-gradient(135deg, rgba(12,24,48,0.7) 0%, rgba(6,12,24,0.85) 100%)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <SectionTitle icon={<Clock size={17} color="var(--gold-primary)"/>} sub="Live construction progress audit and milestones">🏗️ Construction Milestones</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingLeft: '20px' }}>
                <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '4px', width: '2px', background: 'rgba(212,175,55,0.2)' }}/>
                {[
                  { title: 'Excavation & Foundations', status: 'Completed', date: 'Q1 2024', pct: 100 },
                  { title: 'RCC Substructure Work', status: 'Completed', date: 'Q3 2024', pct: 100 },
                  { title: 'Superstructure (G+22 Slab Castings)', status: 'In Progress (Tower A/B at Slab 15)', date: 'Q2 2025', pct: 75 },
                  { title: 'Brickwork & Internal Plastering', status: 'In Progress', date: 'Q4 2025', pct: 20 },
                  { title: 'External Painting & Finishing', status: 'Scheduled', date: 'Q2 2026', pct: 0 },
                  { title: 'Final Handover & Possession', status: 'Scheduled', date: 'Dec 2027', pct: 0 }
                ].map((m, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-22px', top: '5px', width: '12px', height: '12px', borderRadius: '50%', background: m.pct === 100 ? '#10b981' : m.pct > 0 ? 'var(--gold-primary)' : 'rgba(255,255,255,0.15)', border: '2.5px solid #070f1e', zIndex: 2 }}/>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '12px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#fff' }}>{m.title}</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>Target Schedule: {m.date}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', background: m.pct === 100 ? 'rgba(16,185,129,0.1)' : m.pct > 0 ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.05)', color: m.pct === 100 ? '#10b981' : m.pct > 0 ? 'var(--gold-secondary)' : 'rgba(255,255,255,0.4)' }}>
                          {m.pct}% {m.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Developer Legacy Timeline */}
          <div id="sec-legacy" style={{ scrollMarginTop: '80px' }}>
            <Card style={{ background: 'linear-gradient(135deg, rgba(12,24,48,0.7) 0%, rgba(6,12,24,0.85) 100%)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <SectionTitle icon={<Building size={17} color="var(--gold-primary)"/>} sub={`${builder.name} — Trust & engineering excellence across generations`}>Developer Legacy</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gold-primary)', marginBottom: '4px' }}>160+ Yrs</div>
                  <div style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 700 }}>Engineering Legacy</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gold-primary)', marginBottom: '4px' }}>435+</div>
                  <div style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 700 }}>Landmark Structures</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--gold-primary)', marginBottom: '4px' }}>4+</div>
                  <div style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 700 }}>Continental Footprints</div>
                </div>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, margin: '0 0 20px' }}>
                {builder.desc}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                {[
                  ['1865','Founded','Shapoorji Pallonji founded in India'],
                  ['1970','South Asia Tallest','Constructed South Asia tallest towers'],
                  ['2016','Joyville Launch','Joyville series of premium trust-backed homes'],
                  ['2023','Vyomora Launch','Vyomora launched in Hinjewadi Phase 1, Pune']
                ].map(([yr, tag, desc]) => (
                  <div key={yr} style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px 14px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--gold-primary)', display: 'block' }}>{yr}</span>
                    <strong style={{ fontSize: '0.76rem', color: '#fff', display: 'block', margin: '3px 0' }}>{tag}</strong>
                    <span style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.3 }}>{desc}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Awards & Testimonials */}
          <div id="sec-testimonials" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <Card style={{ background: 'linear-gradient(135deg, rgba(12,24,48,0.7) 0%, rgba(6,12,24,0.85) 100%)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <SectionTitle icon={<Award size={17} color="var(--gold-primary)"/>} sub="Project recognitions & certifications">🏆 Awards</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  ['Best Luxury High Rise 2024','Pune Real Estate Awards','Recognized for modular tower ventilation layout'],
                  ['MahaRERA Registration Certified','RERA Act Compliant','Verified builder license and compliance audit record'],
                  ['Excellent Structural Health Rating','Civil Engineering Trust','Awarded for premium slab execution leg']
                ].map(([title, org, desc]) => (
                  <div key={title} style={{ paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff' }}>🥇 {title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--gold-secondary)', marginTop: '2px', fontWeight: 600 }}>{org}</div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{desc}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card style={{ background: 'linear-gradient(135deg, rgba(12,24,48,0.7) 0%, rgba(6,12,24,0.85) 100%)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <SectionTitle icon={<MessageSquare size={17} color="var(--gold-primary)"/>} sub="Words from verified corporate buyers">💬 Buyer Voices</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { name: 'Aniket M.', role: 'Senior Principal Engineer, IT MNC', quote: 'Vyomora’s structural specs and distance to Phase 1 IT Park made this a clear choice for my family. The 25k sq.ft clubhouse is best-in-class in Hinjewadi.' },
                  { name: 'Dr. Priya S.', role: 'Senior Resident, Wakad Hospital', quote: 'Extremely professional advisory by 24K Realtors. Clear document registry deed validation and seamless RERA verification help you buy conflict-free.' }
                ].map((t, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: '2px', marginBottom: '6px' }}>
                      {[...Array(5)].map((_, idx) => <span key={idx} style={{ fontSize: '0.78rem', color: 'var(--gold-primary)' }}>★</span>)}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', fontStyle: 'italic', margin: '0 0 8px', lineHeight: 1.5 }}>"{t.quote}"</p>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff' }}>— {t.name}</div>
                    <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{t.role}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* FAQ */}
          <Card style={{ background: 'linear-gradient(135deg, rgba(12,24,48,0.7) 0%, rgba(6,12,24,0.85) 100%)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <SectionTitle icon={<HelpCircle size={17} color="var(--gold-primary)"/>}>Compliance & Buying FAQ</SectionTitle>
            {[
              { q: 'Is title clear and RERA registration verified?', a: `Yes. All 24K Realtors listings undergo a 5-stage carpet and registry deed audit. Developer ID ${builder.reraId} is registered with MahaRERA under Section 9 of the Real Estate Act, 2016.` },
              { q: 'What does all-inclusive pricing comprise?', a: 'Agreement value, stamp duty, registration taxes, development charges, piped gas fees, and society corpus deposits as applicable under standard builder rules.' },
              { q: 'What is the brokerage structure?', a: '24K Realtors charges zero brokerage to buyers. Our advisory is 100% developer-compensated, ensuring full conflict-free guidance.' },
            ].map(({ q, a }) => (
              <details key={q} style={{ background: 'rgba(255,255,255,0.015)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '16px 20px', marginBottom: '12px', cursor: 'pointer' }}
                onToggle={e => e.currentTarget.style.borderColor = e.currentTarget.open ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.05)'}>
                <summary style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {q} <ChevronDown size={14} style={{ color: 'var(--gold-secondary)', flexShrink: 0 }}/>
                </summary>
                <p style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.65)', marginTop: '12px', lineHeight: 1.8, marginBottom: 0 }}>{a}</p>
              </details>
            ))}
          </Card>
        </div>

        {/* ── RIGHT COLUMN (STICKY SIDEBAR) ── */}
        <div style={{ position: 'sticky', top: '56px', display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Location Intelligence */}
          <div style={{ background: 'rgba(10,18,36,0.7)', border: '1px solid rgba(212,175,55,0.18)', borderRadius: '18px', padding: '24px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '0.95rem', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Navigation size={15}/> Location Intelligence
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', margin: '0 0 18px' }}>Strategically located in the heart of Hinjewadi</p>
            <ScoreBar label="IT Hub Connectivity"    value={corridor.commute}       max={10}/>
            <ScoreBar label="Infrastructure Index"   value={corridor.infra}         max={10}/>
            <ScoreBar label="Green Index"            value={corridor.green}         max={10}/>
            <ScoreBar label="Social Infrastructure"  value={corridor.social || 8.7} max={10}/>
            <ScoreBar label="Future Growth Potential" value={corridor.future || 9.1} max={10}/>
            {property.locationMapUrl && (
              <div style={{ marginTop: '16px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.18)', position: 'relative', cursor: 'pointer' }}
                onClick={() => window.open(property.locationMapUrl, '_blank')}>
                <img src={property.locationMapUrl} alt="Map" style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }}/>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(4,8,20,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <MapPin size={16} color="var(--gold-primary)"/>
                  <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700 }}>Hinjewadi Phase 1, Pune</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem' }}>Near Phase 1 IT Park, Metro Station & Expressway</span>
                </div>
                <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'var(--gold-primary)', color: '#070f1e', borderRadius: '6px', padding: '4px 10px', fontSize: '0.68rem', fontWeight: 800 }}>
                  View on Map →
                </div>
              </div>
            )}
            {marketTrends && (
              <div style={{ marginTop: '14px', padding: '12px 14px', borderRadius: '10px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
                <div style={{ color: 'var(--gold-secondary)', fontWeight: 700, marginBottom: '8px', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Corridor Metrics</div>
                {[['Avg Price/sqft', marketTrends.averagePricePerSqft], ['Annual Appreciation', marketTrends.appreciationRate, '#2ec4b6'], ['Expected Yield', marketTrends.rentalYield, '#2ec4b6']].map(([l,v,c]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.78rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.55)' }}>{l}:</span>
                    <strong style={{ color: c || '#fff' }}>{v}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Project Overview */}
          <div style={{ background: 'rgba(10,18,36,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '0.95rem', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              {[
                { icon: '🏞️', val: '16+', label: 'Acres Land Parcel' },
                { icon: '🛏️', val: '2, 3 & 4 BHK', label: 'Configurations' },
                { icon: '🏗️', val: 'G+22', label: 'Total Towers' },
                { icon: '🏠', val: '~1560', label: 'Total Units' },
                { icon: '📅', val: 'Dec 2027', label: 'Possession' },
                { icon: '🛡️', val: builder.reraId.slice(0, 8) + '…', label: 'MahaRERA' },
              ].map(({ icon, val, label }) => (
                <div key={label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '12px 6px' }}>
                  <div style={{ fontSize: '1.3rem', marginBottom: '3px' }}>{icon}</div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#fff', marginBottom: '2px', lineHeight: 1.2 }}>{val}</div>
                  <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Developer */}
          <div style={{ background: 'rgba(10,18,36,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '0.9rem', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={15}/> Developer Dossier
            </h3>
            {isVyomora && (
              <div style={{ marginBottom: '12px' }}>
                <img src="/properties/vyomora/logo.jpeg" alt="Shapoorji Pallonji" style={{ height: '32px', objectFit: 'contain', filter: 'brightness(1.1)', borderRadius: '4px' }} onError={e => e.currentTarget.style.display = 'none'}/>
              </div>
            )}
            <strong style={{ fontSize: '0.92rem', color: '#fff', display: 'block', marginBottom: '3px' }}>{builder.name}</strong>
            <span style={{ fontSize: '0.7rem', color: 'var(--gold-secondary)', fontWeight: 700, display: 'block', marginBottom: '10px' }}>RERA: {builder.reraId}</span>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0 }}>{builder.desc}</p>
          </div>

          {/* ═══ PREMIUM EMI CALCULATOR ═══ */}
          <div style={{ background: 'linear-gradient(135deg, rgba(10,18,36,0.95), rgba(7,15,30,0.98))', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '20px', padding: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px', borderBottom: '1px solid rgba(212,175,55,0.1)', paddingBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))', border: '1px solid rgba(212,175,55,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calculator size={16} color="var(--gold-primary)" />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '0.95rem', margin: 0, letterSpacing: '0.04em' }}>EMI Calculator</h3>
                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Home Loan Mortgage Planner</span>
              </div>
            </div>

            {/* ── Sliders ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>

              {/* Down Payment */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.55)' }}>Down Payment</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>{downPayment}%</span>
                    <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem' }}>({formatPrice(Number(property.price) * (downPayment / 100))})</span>
                  </div>
                </div>
                <input type="range" min="10" max="60" step="5" value={downPayment}
                  onChange={e => setDownPayment(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--gold-primary)', cursor: 'pointer', height: '4px' }}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', marginTop: '3px' }}>
                  <span>10%</span><span>60%</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.55)' }}>Interest Rate</span>
                  <span style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>{interestRate}% p.a.</span>
                </div>
                <input type="range" min="6" max="14" step="0.1" value={interestRate}
                  onChange={e => setInterestRate(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--gold-primary)', cursor: 'pointer', height: '4px' }}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', marginTop: '3px' }}>
                  <span>6%</span><span>14%</span>
                </div>
              </div>

              {/* Loan Term */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.55)' }}>Loan Tenure</span>
                  <span style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>{loanTerm} Years</span>
                </div>
                <input type="range" min="5" max="30" step="1" value={loanTerm}
                  onChange={e => setLoanTerm(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--gold-primary)', cursor: 'pointer', height: '4px' }}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', marginTop: '3px' }}>
                  <span>5 Yrs</span><span>30 Yrs</span>
                </div>
              </div>
            </div>

            {/* ── EMI Result Card ── */}
            {(() => {
              const loanAmt = Number(property.price) * (1 - downPayment / 100);
              const mR = (interestRate / 12) / 100;
              const nm = loanTerm * 12;
              const monthlyEmi = mR > 0 ? (loanAmt * mR * Math.pow(1 + mR, nm)) / (Math.pow(1 + mR, nm) - 1) : loanAmt / nm;
              const totalPay = monthlyEmi * nm;
              const totalInt = totalPay - loanAmt;
              const principalPct = Math.round((loanAmt / totalPay) * 100);
              const interestPct = 100 - principalPct;
              // SVG donut
              const r = 38, cx = 48, cy = 48, circ = 2 * Math.PI * r;
              const pDash = (principalPct / 100) * circ;
              const iDash = (interestPct / 100) * circ;

              return (
                <>
                  {/* Main EMI display */}
                  <div style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.03))', border: '1px solid rgba(212,175,55,0.18)', borderRadius: '14px', padding: '18px', marginBottom: '16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: '6px' }}>Monthly EMI</span>
                    <strong style={{ fontSize: '1.8rem', color: 'var(--gold-primary)', display: 'block', lineHeight: 1, fontFamily: 'var(--font-title)' }}>
                      {formatPrice(monthlyEmi)}<span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'rgba(255,255,255,0.4)' }}>/mo</span>
                    </strong>
                    <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px', display: 'block' }}>
                      Loan Amount: {formatPrice(loanAmt)}
                    </span>
                  </div>

                  {/* Donut + Breakdown */}
                  <div style={{ display: 'grid', gridTemplateColumns: '96px 1fr', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                    {/* SVG Donut */}
                    <svg width="96" height="96" viewBox="0 0 96 96">
                      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12"/>
                      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(212,175,55,0.85)" strokeWidth="12"
                        strokeDasharray={`${pDash} ${circ}`} strokeDashoffset={circ * 0.25}
                        style={{ transition: 'stroke-dasharray 0.6s ease' }} strokeLinecap="round"/>
                      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(239,68,68,0.6)" strokeWidth="12"
                        strokeDasharray={`${iDash} ${circ}`} strokeDashoffset={circ * 0.25 - pDash}
                        style={{ transition: 'stroke-dasharray 0.6s ease' }} strokeLinecap="round"/>
                      <text x={cx} y={cy - 4} textAnchor="middle" fill="var(--gold-primary)" fontSize="11" fontWeight="bold">{principalPct}%</text>
                      <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7">principal</text>
                    </svg>

                    {/* Breakdown stats */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(212,175,55,0.85)' }}/>
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Principal</span>
                        </div>
                        <strong style={{ fontSize: '0.78rem', color: '#fff' }}>{formatPrice(loanAmt)}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(239,68,68,0.7)' }}/>
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Total Interest</span>
                        </div>
                        <strong style={{ fontSize: '0.78rem', color: 'rgba(239,100,100,0.9)' }}>{formatPrice(totalInt)}</strong>
                      </div>
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Total Payable</span>
                        <strong style={{ fontSize: '0.82rem', color: 'var(--gold-primary)' }}>{formatPrice(totalPay)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Bank Rate Comparison */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>🏦 Bank Rate Comparison</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {[
                        { bank: 'SBI Home Loan', rate: 8.50 },
                        { bank: 'HDFC Ltd', rate: 8.75 },
                        { bank: 'ICICI Bank', rate: 9.00 },
                        { bank: 'Axis Bank', rate: 8.85 },
                      ].map(({ bank, rate }) => {
                        const mRb = (rate / 12) / 100;
                        const bmEmi = mRb > 0 ? (loanAmt * mRb * Math.pow(1 + mRb, nm)) / (Math.pow(1 + mRb, nm) - 1) : loanAmt / nm;
                        const isSelected = Math.abs(rate - interestRate) < 0.26;
                        return (
                          <div key={bank}
                            onClick={() => setInterestRate(rate)}
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', border: `1px solid ${isSelected ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.05)'}`, background: isSelected ? 'rgba(212,175,55,0.06)' : 'rgba(255,255,255,0.02)', transition: 'all 0.2s' }}>
                            <div>
                              <span style={{ fontSize: '0.72rem', color: isSelected ? 'var(--gold-primary)' : 'rgba(255,255,255,0.6)', fontWeight: isSelected ? 700 : 400 }}>{bank}</span>
                              {isSelected && <span style={{ marginLeft: '6px', fontSize: '0.58rem', background: 'var(--gold-primary)', color: '#070f1e', padding: '1px 5px', borderRadius: '3px', fontWeight: 700 }}>SELECTED</span>}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.7rem', color: 'var(--gold-secondary)', fontWeight: 700 }}>{rate}%</div>
                              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>{formatPrice(bmEmi)}/mo</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Share on WhatsApp */}
                  <a
                    href={`https://wa.me/919673000053?text=${encodeURIComponent(`Hi 24K Realtors,\n\nI've calculated my Home Loan EMI:\n📌 Property: ${property.title}\n💰 Property Price: ${formatPrice(property.price)}\n🏦 Down Payment: ${downPayment}% (${formatPrice(Number(property.price) * downPayment / 100)})\n📊 Loan Amount: ${formatPrice(loanAmt)}\n📈 Interest Rate: ${interestRate}% p.a.\n⏳ Tenure: ${loanTerm} Years\n💳 Monthly EMI: ${formatPrice(monthlyEmi)}/mo\n\nPlease help me with the next steps!`)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '10px', borderRadius: '10px', background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.25)', color: '#25D366', fontWeight: 700, fontSize: '0.78rem', textDecoration: 'none', boxSizing: 'border-box', transition: 'all 0.2s', marginTop: '4px' }}>
                    <MessageSquare size={14}/> Share EMI Plan on WhatsApp
                  </a>
                </>
              );
            })()}
          </div>


          {/* Cost Breakdown */}
          <div style={{ background: 'rgba(10,18,36,0.7)', border: '1px solid rgba(255,255,255,0.065)', borderRadius: '18px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '0.9rem', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={15}/> Cost Breakdown
            </h3>
            {[['Agreement Value', property.price, '#fff'], ['Stamp Duty (6%)', Number(property.price) * 0.06, 'rgba(255,255,255,0.7)'], ['GST (5%)', Number(property.price) * 0.05, 'rgba(255,255,255,0.7)'], ['Dev & Legal Charges', 150000, 'rgba(255,255,255,0.7)']].map(([l, v, c]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '8px 0', fontSize: '0.8rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.55)' }}>{l}</span>
                <strong style={{ color: c }}>{formatPrice(v)}</strong>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', fontSize: '0.86rem' }}>
              <span style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>All-Inclusive Total</span>
              <strong style={{ color: 'var(--gold-primary)' }}>{formatPrice(Number(property.price) * 1.11 + 150000)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ══ SIMILAR ══ */}
      {similar.length > 0 && (
        <div style={{ padding: '50px 32px 0' }}>
          <h2 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '1.4rem', marginBottom: '24px' }}>⚜️ Similar Curated Residences</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {similar.map(sim => (
              <motion.div key={sim.id} whileHover={{ y: -6 }}
                onClick={() => { onBack(); setTimeout(() => document.getElementById(`property-${sim.id}`)?.click(), 100); }}
                style={{ cursor: 'pointer', background: 'rgba(10,18,36,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                  <img src={sim.imageUrl || slideshowImages[0]} alt={sim.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}/>
                  <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--gold-primary)', color: '#070f1e', fontSize: '0.62rem', fontWeight: 800, padding: '3px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>{sim.transactionType}</span>
                  <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(7,15,30,0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(212,175,55,0.3)', color: 'var(--gold-primary)', fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>✨ {sim.score}% Match</span>
                </div>
                <div style={{ padding: '18px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}><MapPin size={10} color="var(--gold-primary)"/> {sim.location}</span>
                  <h4 style={{ fontSize: '0.96rem', color: '#fff', margin: '0 0 10px', fontFamily: 'var(--font-title)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sim.title}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: 'var(--gold-primary)', fontSize: '1rem' }}>{formatPrice(sim.price, sim.transactionType)}</strong>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{sim.bedrooms > 0 ? `${sim.bedrooms} BHK` : ''} · {sim.areaSquareFeet} sqft</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ══ STICKY BOTTOM BAR (Premium Style) ══ */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(4,8,20,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(212,175,55,0.15)', padding: '12px 32px', zIndex: 999, boxShadow: '0 -12px 40px rgba(0,0,0,0.5)' }} className="sticky-booking-bar">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
          {/* Info pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="var(--gold-primary)"/>
              <div>
                <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1 }}>MahaRERA Certified</div>
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#fff' }}>{builder.reraId}</div>
              </div>
            </div>
            <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }}/>
            <div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1 }}>RERA Carpet Area</div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#fff' }}>684 - 4200 sq.ft.</div>
            </div>
            <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }}/>
            <div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1 }}>Price Range</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gold-primary)' }}>₹84 L – ₹3.75 Cr*</div>
            </div>
            <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }}/>
            <div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1 }}>Launch Offer</div>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#10b981' }}>Limited Period Benefits*</div>
            </div>
          </div>
          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
            <button onClick={() => onOpenInquiry(property)}
              style={{ padding: '10px 22px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--gold-primary), var(--gold-secondary))', border: 'none', color: '#070F1E', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
              onMouseOver={e => e.currentTarget.style.boxShadow = '0 0 18px rgba(212,175,55,0.5)'}
              onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>
              🏢 Book Site Visit
            </button>
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              style={{ padding: '10px 20px', borderRadius: '10px', background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.3)', color: '#25D366', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              <MessageSquare size={14}/> WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && <Lightbox images={slideshowImages} startIndex={lightboxStart} onClose={() => setLightboxOpen(false)}/>}
      </AnimatePresence>

    </motion.div>
  );
}
