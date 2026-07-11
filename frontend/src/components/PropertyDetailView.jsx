import React, { useState, useEffect } from 'react';
import {
  MapPin, ShieldCheck, Bed, Bath, Maximize, Sparkles,
  Car, Calculator, TrendingUp, HelpCircle,
  MessageSquare, ChevronLeft, ChevronRight, Download,
  Building, CheckCircle, FileText, ArrowRight, ArrowLeft,
  Share2, Heart, Award, Wifi, Zap, Camera, Trees, Coffee,
  Dumbbell, ParkingCircle, Droplets, UtensilsCrossed, Phone,
  Star, Shield, Sun, Wind, Tv, Lock
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/apiService';

/* ─── Builder lookup ──────────────────────────────────────────── */
const getBuilderInfo = (title = '') => {
  if (title.includes('24K') || title.includes('Opula') || title.includes('Sereno'))
    return { name: 'Kolte-Patil Developers', brand: '24K Luxury Brand', reraId: 'A52100028461', desc: "Kolte-Patil's 24K brand delivers architectural design excellence, smart home configurations, and high-appreciation corridor landmarks across Pune West." };
  if (title.includes('Godrej'))
    return { name: 'Godrej Properties', brand: 'Premium Luxury Homes', reraId: 'A52100012431', desc: 'Godrej Properties brings a legacy of innovation, trust, and advanced home automation to ultra-premium gated communities.' };
  if (title.includes('Kasturi'))
    return { name: 'Kasturi Builders', brand: 'Signature Penthouses', reraId: 'A52100045231', desc: 'Kasturi is renowned for Italian marble finishes, double-height lobbies, and ultra-high-net-worth residences in Pune.' };
  if (title.includes('Lodha'))
    return { name: 'Lodha Group', brand: 'World-Class Residences', reraId: 'A52100033211', desc: 'Lodha Group creates landmark towers with premium lifestyle infrastructure and world-class finish standards.' };
  return { name: 'Tier-1 Authorized Developer', brand: 'Verified Portfolio Partner', reraId: 'A52100028461', desc: 'Managed under 24K Realtors authorized developer alliance — verified for clear land title deed registrations and RERA compliance.' };
};

/* ─── Location scorecard ─────────────────────────────────────── */
const CORRIDOR_DATA = {
  HINJEWADI:   { appreciation: 14.2, commute: 9.2, green: 8.4, infra: 8.8, landmarks: ['Infosys Campus (1.2 km)', 'Wipro SEZ (2.8 km)', 'Blue Ridge Mall (3 km)', 'Hinjewadi Metro (planned)'] },
  WAKAD:       { appreciation: 14.2, commute: 8.9, green: 8.0, infra: 8.5, landmarks: ['Wakad Chowk (0.5 km)', 'D-Mart Wakad (1 km)', 'Pimpri Railway (7 km)', 'Aditya Birla Hospital (4 km)'] },
  BANER:       { appreciation: 16.5, commute: 9.5, green: 8.8, infra: 9.2, landmarks: ['Balewadi High Street (1 km)', 'Symbiosis College (2 km)', 'Baner Metro (planned)', 'SB Road (1.5 km)'] },
  BALEWADI:    { appreciation: 15.8, commute: 9.3, green: 8.6, infra: 9.0, landmarks: ['Balewadi Stadium (0.8 km)', 'High Street Phoenix (1.2 km)', 'Croma Mall (2 km)', 'Baner Road (1 km)'] },
  KHARADI:     { appreciation: 15.2, commute: 8.7, green: 8.2, infra: 8.9, landmarks: ['EON IT Park (0.5 km)', 'World Trade Center (1 km)', 'Pune Airport (6 km)', 'Koregaon Park (5 km)'] },
};
const getCorridorData = (location = '') => {
  const key = location.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z_]/g, '');
  for (const [k, v] of Object.entries(CORRIDOR_DATA)) {
    if (key.includes(k)) return v;
  }
  return { appreciation: 13.5, commute: 8.5, green: 8.0, infra: 8.2, landmarks: ['Pune IT Park (2 km)', 'Local Schools (1 km)', 'Highway Access (3 km)', 'Hospital (4 km)'] };
};

/* ─── Score bar ──────────────────────────────────────────────── */
function ScoreBar({ label, value, max = 10 }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gold-primary)' }}>{value}{max === 10 ? '/10' : '%'}</span>
      </div>
      <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          style={{ height: '100%', borderRadius: '4px', background: 'linear-gradient(90deg, var(--gold-secondary), var(--gold-primary))' }}
        />
      </div>
    </div>
  );
}

/* ─── Amenity icon map with 4K-quality background backdrops ──── */
const AMENITY_ICONS = {
  '24/7 Concierge Desk':       { icon: Phone,          color: '#D4AF37', bg: 'rgba(212,175,55,0.12)', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80' },
  'Infinity Sky Pool':         { icon: Droplets,       color: '#38bdf8', bg: 'rgba(56,189,248,0.10)', img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=400&q=80' },
  'Private Elevator Access':   { icon: Building,       color: '#a78bfa', bg: 'rgba(167,139,250,0.10)', img: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=400&q=80' },
  'Smart Home Automation':     { icon: Wifi,           color: '#34d399', bg: 'rgba(52,211,153,0.10)', img: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&q=80' },
  'Modular Kitchen Provisions':{ icon: UtensilsCrossed,color: '#fb923c', bg: 'rgba(251,146,60,0.10)', img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80' },
  '100% Power Backup Grid':    { icon: Zap,            color: '#fbbf24', bg: 'rgba(251,191,36,0.10)', img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=400&q=80' },
  'CCTV & Video Door Phone':   { icon: Camera,         color: '#f87171', bg: 'rgba(248,113,113,0.10)', img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80' },
  'Landscaped Zen Gardens':    { icon: Trees,          color: '#4ade80', bg: 'rgba(74,222,128,0.10)', img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=400&q=80' },
  'Clubhouse & Co-work Space': { icon: Coffee,         color: '#c084fc', bg: 'rgba(192,132,252,0.10)', img: 'https://images.unsplash.com/photo-1527192491265-7e452a145d55?auto=format&fit=crop&w=400&q=80' },
  "Children's Play Zone":      { icon: Star,           color: '#f9a8d4', bg: 'rgba(249,168,212,0.10)', img: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=400&q=80' },
  'Multi-Level Car Parking':   { icon: ParkingCircle,  color: '#93c5fd', bg: 'rgba(147,197,253,0.10)', img: 'https://images.unsplash.com/photo-1506521788723-868126d5e368?auto=format&fit=crop&w=400&q=80' },
  'Rainwater Harvesting':      { icon: Wind,           color: '#6ee7b7', bg: 'rgba(110,231,183,0.10)', img: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=400&q=80' },
};

/* ─── Premium 3D Netflix-style Amenity Card with Cover Image ─── */
function AmenityChip({ label }) {
  const meta = AMENITY_ICONS[label] || { icon: CheckCircle, color: '#D4AF37', bg: 'rgba(212,175,55,0.10)', img: '' };
  const IconComp = meta.icon;
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 12; // 12deg max tilt
    const rotateX = -((y - centerY) / centerY) * 12;
    
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        gap: '14px',
        background: isHovered 
          ? 'linear-gradient(135deg, rgba(10,18,36,0.85) 0%, rgba(5,10,22,0.7) 100%)' 
          : 'linear-gradient(135deg, rgba(8,15,30,0.8) 0%, rgba(4,8,16,0.65) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px', padding: '22px 20px',
        cursor: 'default',
        backdropFilter: 'blur(10px)',
        transform: `perspective(800px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(${isHovered ? '8px' : '0px'})`,
        transition: isHovered ? 'none' : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        boxShadow: isHovered 
          ? `0 14px 35px rgba(0, 0, 0, 0.6), 0 0 0 1px ${meta.color}3a, 0 6px 20px ${meta.color}15` 
          : '0 4px 12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.02)',
        borderColor: isHovered ? `${meta.color}77` : 'rgba(255,255,255,0.06)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 4K Background Cover Image */}
      {meta.img && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${meta.img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: isHovered ? 0.20 : 0.06,
          mixBlendMode: 'luminosity',
          transform: isHovered ? 'scale(1.15) translateZ(-5px)' : 'scale(1) translateZ(0px)',
          transition: 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      )}

      {/* Dark overlay grid to secure text readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: isHovered 
          ? 'linear-gradient(to bottom, rgba(10,18,36,0.35) 0%, rgba(5,10,22,0.85) 100%)' 
          : 'linear-gradient(to bottom, rgba(8,15,30,0.55) 0%, rgba(4,8,16,0.92) 100%)',
        zIndex: 1,
        pointerEvents: 'none',
        transition: 'all 0.3s ease',
      }} />

      {/* Glossy holographic sheen highlight */}
      {isHovered && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.1) 0%, transparent 60%)`,
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
          zIndex: 2,
        }} 
        ref={el => {
          if (el && el.parentElement) {
            el.style.setProperty('--mouse-x', `${(rotate.y / 12 * 50) + 50}%`);
            el.style.setProperty('--mouse-y', `${(-rotate.x / 12 * 50) + 50}%`);
          }
        }}/>
      )}

      {/* Content wrapper above all background layers */}
      <div style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
        {/* Icon badge */}
        <div style={{
          width: '46px', height: '46px', borderRadius: '14px',
          background: meta.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: isHovered ? `0 4px 14px ${meta.color}25` : 'none',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'scale(1.08) translateZ(4px)' : 'scale(1)',
        }}>
          <IconComp size={22} color={meta.color} strokeWidth={2} />
        </div>
        {/* Label */}
        <span style={{
          fontSize: '0.86rem', fontWeight: 600,
          color: isHovered ? '#fff' : 'rgba(255,255,255,0.85)',
          lineHeight: 1.35,
          letterSpacing: '0.01em',
          textShadow: isHovered ? '0 2px 4px rgba(0,0,0,0.5)' : 'none',
          transition: 'color 0.3s ease',
        }}>{label}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function PropertyDetailView({
  property,
  onBack,
  onOpenInquiry,
  onOpenChauffeur,
  formatPrice,
  getEmbedVideoUrl,
  allProperties = []
}) {

  const [activeSlide, setActiveSlide] = useState(0);
  const [downPayment, setDownPayment] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTerm, setLoanTerm] = useState(20);
  const [activePlan, setActivePlan] = useState('floor');

  const [isWishlisted, setIsWishlisted] = useState(() => {
    try {
      const saved = localStorage.getItem('wishlist_properties');
      const list = saved ? JSON.parse(saved) : [];
      return list.includes(property.id);
    } catch {
      return false;
    }
  });

  const [marketTrends, setMarketTrends] = useState(null);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const trends = await apiService.getMarketTrends(property.location);
        setMarketTrends(trends);
      } catch (err) {
        console.error('Failed to fetch market trends:', err);
      }
    };
    fetchTrends();
  }, [property.location]);


  const isCommercial = property.propertyType === 'COMMERCIAL';
  const builder = getBuilderInfo(property.title);
  const corridor = getCorridorData(property.location);

  const slideshowImages = [
    property.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    isCommercial
      ? 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=85'
      : 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
    isCommercial
      ? 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=85'
      : 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
  ];

  // EMI calc
  const principal = Number(property.price) * (1 - downPayment / 100);
  const monthlyRate = (interestRate / 12) / 100;
  const totalMonths = loanTerm * 12;
  const emi = monthlyRate > 0
    ? (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : principal / totalMonths;

  const handleToggleWishlist = async () => {
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    
    try {
      const saved = localStorage.getItem('wishlist_properties');
      let list = saved ? JSON.parse(saved) : [];
      if (nextState) {
        if (!list.includes(property.id)) list.push(property.id);
      } else {
        list = list.filter(id => id !== property.id);
      }
      localStorage.setItem('wishlist_properties', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }

    try {
      if (nextState) {
        await apiService.addToWishlist(property.id);
      } else {
        await apiService.removeFromWishlist(property.id);
      }
    } catch (err) {
      console.error('Failed to sync wishlist with backend:', err);
    }
  };

  const nextSlide = () => setActiveSlide(p => (p + 1) % slideshowImages.length);
  const prevSlide = () => setActiveSlide(p => (p - 1 + slideshowImages.length) % slideshowImages.length);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [property.id]);

  const waLink = `https://wa.me/919673000053?text=Hi%2024K%20Realtors,%20I'm%20interested%20in%20"${encodeURIComponent(property.title)}"%20at%20${encodeURIComponent(property.location)}.%20Please%20share%20details.`;

  const getSimilarityScore = (p) => {
    let score = 0;
    if (p.location === property.location) score += 35;
    if (p.propertyType === property.propertyType) score += 20;
    if (p.bedrooms === property.bedrooms) score += 20;
    
    const priceDiff = Math.abs(Number(p.price) - Number(property.price));
    const priceRatio = priceDiff / Number(property.price);
    if (priceRatio <= 0.1) score += 25;
    else if (priceRatio <= 0.25) score += 15;
    else if (priceRatio <= 0.5) score += 5;
    
    return score;
  };

  const similarProperties = allProperties
    .filter(p => p.id !== property.id)
    .map(p => ({ ...p, similarityScore: getSimilarityScore(p) }))
    .filter(p => p.similarityScore >= 40)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, 3);


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{ color: 'var(--text-light)', paddingBottom: '100px' }}
    >

      {/* ══════════════════════════════════════════════════════════
          IMMERSIVE FULL-WIDTH HERO GALLERY
      ══════════════════════════════════════════════════════════ */}
      <div style={{ position: 'relative', width: '100%', height: '70vh', minHeight: '520px', maxHeight: '760px', overflow: 'hidden', borderRadius: '0 0 24px 24px' }}>

        {/* Main image with crossfade */}
        <AnimatePresence mode="wait">
          <motion.img
            key={activeSlide}
            src={slideshowImages[activeSlide]}
            alt={`${property.title} — view ${activeSlide + 1}`}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AnimatePresence>

        {/* Deep gradient vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(4,8,20,0.35) 0%, transparent 40%, rgba(4,8,20,0.75) 75%, rgba(4,8,20,0.97) 100%)',
          zIndex: 1,
        }} />

        {/* ── Back button top-left ── */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute', top: '24px', left: '24px', zIndex: 10,
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(4,8,20,0.7)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '50px', padding: '9px 18px',
            color: '#fff', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
        >
          <ArrowLeft size={15} /> Portfolio
        </button>

        {/* ── Action buttons top-right ── */}
        <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 10, display: 'flex', gap: '10px' }}>
          <button
            onClick={handleToggleWishlist}
            style={{
              background: isWishlisted ? 'var(--gold-primary)' : 'rgba(4,8,20,0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%', width: '42px', height: '42px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isWishlisted ? '#070F1E' : '#fff', cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            aria-label="Save to wishlist"
          >
            <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={() => navigator.share?.({ title: property.title, url: window.location.href }).catch(() => {})}
            style={{
              background: 'rgba(4,8,20,0.7)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%', width: '42px', height: '42px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', cursor: 'pointer', transition: 'all 0.2s ease',
            }}
            aria-label="Share"
          >
            <Share2 size={15} />
          </button>
        </div>

        {/* ── Slider arrows ── */}
        <button onClick={prevSlide} style={{
          position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(4,8,20,0.55)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%',
          width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', cursor: 'pointer', zIndex: 5, transition: 'all 0.2s ease',
        }}>
          <ChevronLeft size={20} />
        </button>
        <button onClick={nextSlide} style={{
          position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(4,8,20,0.55)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%',
          width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', cursor: 'pointer', zIndex: 5, transition: 'all 0.2s ease',
        }}>
          <ChevronRight size={20} />
        </button>

        {/* ── Dot indicators ── */}
        <div style={{ position: 'absolute', bottom: '140px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 5 }}>
          {slideshowImages.map((_, i) => (
            <button key={i} onClick={() => setActiveSlide(i)} style={{
              width: i === activeSlide ? '24px' : '8px', height: '8px',
              borderRadius: '4px', border: 'none', cursor: 'pointer',
              background: i === activeSlide ? 'var(--gold-primary)' : 'rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease', padding: 0,
            }} />
          ))}
        </div>

        {/* ── Hero info overlay at bottom ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px 40px 36px',
          zIndex: 3,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              {/* RERA + Type badges */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span style={{
                  background: 'var(--gold-primary)', color: '#070F1E',
                  fontSize: '0.65rem', fontWeight: 800, padding: '4px 12px',
                  borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.8px',
                }}>
                  {property.transactionType}
                </span>
                <span style={{
                  background: 'rgba(4,8,20,0.7)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(212,175,55,0.3)',
                  color: 'var(--gold-secondary)', fontSize: '0.65rem', fontWeight: 700,
                  padding: '4px 12px', borderRadius: '4px',
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                  <ShieldCheck size={11} /> MahaRERA Verified
                </span>
                {property.exclusiveDeal && (
                  <span style={{
                    background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)',
                    color: 'var(--gold-primary)', fontSize: '0.65rem', fontWeight: 700,
                    padding: '4px 12px', borderRadius: '4px',
                  }}>
                    ★ EXCLUSIVE
                  </span>
                )}
              </div>

              <h1 style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(1.6rem, 3vw, 2.8rem)',
                color: '#fff',
                margin: '0 0 8px',
                textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
              }}>
                {property.title}
              </h1>

              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                <MapPin size={13} color="var(--gold-primary)" />
                {property.address || property.location}, Pune
              </p>
            </div>

            {/* Price box */}
            <div style={{
              background: 'rgba(4,8,20,0.75)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(212,175,55,0.25)',
              borderRadius: '16px', padding: '18px 28px', textAlign: 'right',
              minWidth: '200px',
            }}>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                Investment Value
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold-primary)', lineHeight: 1 }}>
                {formatPrice(property.price, property.transactionType)}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                Zero Brokerage · {property.status || 'Available'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Thumbnail strip ── */}
      <div style={{ display: 'flex', gap: '10px', padding: '16px 40px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {slideshowImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveSlide(i)}
            style={{
              flexShrink: 0, width: '90px', height: '62px',
              borderRadius: '8px', overflow: 'hidden',
              border: activeSlide === i ? '2px solid var(--gold-primary)' : '2px solid rgba(255,255,255,0.06)',
              opacity: activeSlide === i ? 1 : 0.55,
              transition: 'all 0.25s ease', cursor: 'pointer', padding: 0,
              background: 'none',
            }}
          >
            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════
          QUICK SPEC STRIP
      ══════════════════════════════════════════════════════════ */}
      <div style={{ padding: '0 40px', marginBottom: '40px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1px',
          background: 'rgba(212,175,55,0.1)',
          border: '1px solid rgba(212,175,55,0.1)',
          borderRadius: '16px', overflow: 'hidden',
        }}>
          {[
            { icon: <Bed size={20} color="var(--gold-primary)" />, label: 'Configuration', value: isCommercial ? 'Commercial' : property.bedrooms > 0 ? `${property.bedrooms} BHK` : 'Studio' },
            { icon: <Bath size={20} color="var(--gold-primary)" />, label: 'Bathrooms', value: `${property.bathrooms} Bath` },
            { icon: <Maximize size={20} color="var(--gold-primary)" />, label: 'Carpet Area', value: `${property.areaSquareFeet} sqft` },
            { icon: <TrendingUp size={20} color="var(--gold-primary)" />, label: 'Appreciation', value: `${corridor.appreciation}% p.a.` },
            { icon: <Award size={20} color="var(--gold-primary)" />, label: 'Status', value: property.status || 'Available' },
          ].map((spec, i) => (
            <div key={i} style={{
              background: 'rgba(7,15,30,0.9)',
              padding: '22px 20px',
              textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            }}>
              {spec.icon}
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{spec.label}</span>
              <strong style={{ fontSize: '1rem', color: '#fff', fontFamily: 'var(--font-title)' }}>{spec.value}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          MAIN TWO-COLUMN BODY
      ══════════════════════════════════════════════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.65fr) minmax(0, 1fr)',
        gap: '32px',
        padding: '0 40px',
        alignItems: 'start',
      }} className="detail-two-col">

        {/* ── LEFT COLUMN ─────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Description */}
          <div style={{
            background: 'rgba(10,18,36,0.5)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px', padding: '32px',
          }}>
            <h2 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '1.2rem', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={18} /> About This Property
            </h2>
            <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, margin: 0 }}>
              {property.description || `${property.title} is a meticulously designed luxury residence nestled in the heart of ${property.location}, Pune. Featuring premium Italian marble flooring, a double-height entrance lobby, and panoramic city views, this property represents an exceptional blend of investment value and lifestyle excellence.`}
            </p>
          </div>

          {/* Amenities — Netflix-style luxury cards */}
          <div style={{
            background: 'rgba(8,14,30,0.55)', border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '20px', padding: '32px',
          }}>
            <h2 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '1.2rem', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={18} /> Elite Lifestyle Amenities
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
              {['24/7 Concierge Desk', 'Infinity Sky Pool', 'Private Elevator Access', 'Smart Home Automation', 'Modular Kitchen Provisions', '100% Power Backup Grid', 'CCTV & Video Door Phone', 'Landscaped Zen Gardens', 'Clubhouse & Co-work Space', "Children's Play Zone", 'Multi-Level Car Parking', 'Rainwater Harvesting'].map(a => (
                <AmenityChip key={a} label={a} />
              ))}
            </div>
          </div>

          {/* Floor Plan */}
          <div style={{
            background: 'rgba(10,18,36,0.5)', border: '1px solid rgba(212,175,55,0.1)',
            borderRadius: '20px', padding: '32px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '1.2rem', margin: 0 }}>
                📐 Layout Blueprints
              </h2>
              <div style={{ display: 'inline-flex', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.06)' }}>
                {['floor', 'master'].map(plan => (
                  <button key={plan} onClick={() => setActivePlan(plan)} style={{
                    background: activePlan === plan ? 'var(--gold-primary)' : 'transparent',
                    color: activePlan === plan ? '#070f1e' : 'rgba(255,255,255,0.6)',
                    border: 'none', padding: '7px 18px', borderRadius: '30px',
                    fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s ease',
                  }}>
                    {plan === 'floor' ? 'Unit Floor Plan' : 'Master Site Plan'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '28px', alignItems: 'center' }} className="floor-plan-grid">
              <div style={{ background: 'rgba(4,8,20,0.8)', border: '1px dashed rgba(212,175,55,0.25)', borderRadius: '14px', padding: '20px', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {activePlan === 'floor' ? (
                  <svg viewBox="0 0 200 150" style={{ width: '100%', height: '100%' }}>
                    <rect x="10" y="10" width="180" height="130" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="3,3" />
                    <rect x="10" y="10" width="90" height="70" fill="rgba(212,175,55,0.05)" stroke="rgba(212,175,55,0.5)" strokeWidth="1" />
                    <text x="55" y="43" fill="rgba(255,255,255,0.85)" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Master Bed</text>
                    <text x="55" y="54" fill="#D4AF37" fontSize="7" textAnchor="middle" fontFamily="sans-serif">14' × 12'</text>
                    <rect x="100" y="10" width="40" height="40" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                    <text x="120" y="33" fill="rgba(255,255,255,0.45)" fontSize="6" textAnchor="middle">Bath</text>
                    <rect x="10" y="80" width="130" height="60" fill="rgba(212,175,55,0.07)" stroke="rgba(212,175,55,0.5)" strokeWidth="1" />
                    <text x="75" y="111" fill="rgba(255,255,255,0.85)" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Living & Dining</text>
                    <text x="75" y="122" fill="#D4AF37" fontSize="7" textAnchor="middle" fontFamily="sans-serif">18' × 14'</text>
                    <rect x="140" y="50" width="50" height="60" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                    <text x="165" y="82" fill="rgba(255,255,255,0.7)" fontSize="7" textAnchor="middle">Kitchen</text>
                    <rect x="140" y="110" width="50" height="30" fill="rgba(46,196,182,0.05)" stroke="#2ec4b6" strokeWidth="1" />
                    <text x="165" y="128" fill="#2ec4b6" fontSize="6" textAnchor="middle" fontWeight="bold">Sky Deck</text>
                  </svg>
                ) : (
                  <svg viewBox="0 0 200 150" style={{ width: '100%', height: '100%' }}>
                    <circle cx="100" cy="75" r="28" fill="rgba(212,175,55,0.05)" stroke="var(--gold-primary)" strokeWidth="1" />
                    <text x="100" y="78" fill="#fff" fontSize="6" textAnchor="middle">Luxury Club</text>
                    <rect x="20" y="20" width="40" height="40" rx="4" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
                    <text x="40" y="42" fill="rgba(255,255,255,0.75)" fontSize="6" textAnchor="middle">Tower A</text>
                    <rect x="140" y="20" width="40" height="40" rx="4" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
                    <text x="160" y="42" fill="rgba(255,255,255,0.75)" fontSize="6" textAnchor="middle">Tower B</text>
                    <ellipse cx="100" cy="125" rx="35" ry="14" fill="rgba(46,196,182,0.05)" stroke="#2ec4b6" strokeWidth="1" />
                    <text x="100" y="128" fill="#2ec4b6" fontSize="6" textAnchor="middle">Infinity Pool</text>
                  </svg>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {activePlan === 'floor' ? 'Area Breakdown' : 'Site Allocation'}
                </span>
                {activePlan === 'floor' ? (
                  [['Living & Dining', '260 sqft'], ['Master Suite', '175 sqft'], ['Kitchen & Utility', '110 sqft'], ['Sky Deck', '120 sqft']].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '6px', fontSize: '0.82rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.65)' }}>{k}</span>
                      <strong style={{ color: k === 'Sky Deck' ? '#2ec4b6' : '#fff' }}>{v}</strong>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>
                    12-acre premium gated community · 4 towers · 75% open landscaped spaces · modern glass facades · dual podium levels.
                  </p>
                )}
                <button onClick={onOpenInquiry} style={{
                  marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center',
                  background: 'none', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '8px',
                  color: 'var(--gold-secondary)', padding: '9px 14px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
                  transition: 'all 0.2s ease',
                }}>
                  <Download size={13} /> Download PDF Dossier
                </button>
              </div>
            </div>
          </div>

          {/* Video Tour */}
          {property.videoUrl && (
            <div style={{ background: 'rgba(10,18,36,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '32px' }}>
              <h2 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '1.2rem', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                🎬 Drone Virtual Walkthrough
              </h2>
              <div style={{ borderRadius: '14px', overflow: 'hidden', aspectRatio: '16/9' }}>
                <iframe src={getEmbedVideoUrl(property.videoUrl)} title="Drone Tour" style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen />
              </div>
            </div>
          )}

          {/* FAQ */}
          <div style={{ background: 'rgba(10,18,36,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '1.2rem', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <HelpCircle size={18} /> Compliance & Buying FAQ
            </h2>
            {[
              { q: 'Is title clear and RERA registration verified?', a: `Yes. All 24K Realtors listings undergo a 5-stage carpet and registry deed audit. Developer ID ${builder.reraId} is registered with MahaRERA under Section 9 of the Real Estate Act, 2016.` },
              { q: 'What does all-inclusive pricing comprise?', a: 'Agreement value, stamp duty, registration taxes, development charges, piped gas fees, and society corpus deposits as applicable under standard builder rules.' },
              { q: 'What is the brokerage structure?', a: '24K Realtors charges zero brokerage to buyers. Our advisory is 100% developer-compensated, ensuring full conflict-free guidance.' },
            ].map(({ q, a }) => (
              <details key={q} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)', padding: '16px 20px', marginBottom: '10px', cursor: 'pointer' }}>
                <summary style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {q} <ChevronRight size={14} style={{ color: 'var(--gold-secondary)', flexShrink: 0 }} />
                </summary>
                <p style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.6)', marginTop: '12px', lineHeight: 1.7, marginBottom: 0 }}>{a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN (sticky) ────────────────────────────── */}
        <div style={{ position: 'sticky', top: '90px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Booking card */}
          <div style={{
            background: 'radial-gradient(circle at top left, rgba(22,34,58,0.98) 0%, rgba(7,15,30,0.99) 100%)',
            border: '1px solid rgba(212,175,55,0.25)',
            borderRadius: '20px', padding: '28px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '6px' }}>
              Investment Value
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--gold-primary)', marginBottom: '6px', lineHeight: 1 }}>
              {formatPrice(property.price, property.transactionType)}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>
              {property.areaSquareFeet} sqft · ₹{Math.round(property.price / property.areaSquareFeet).toLocaleString()}/sqft
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenInquiry(property)}
                style={{
                  width: '100%', padding: '14px', borderRadius: '50px',
                  background: 'linear-gradient(135deg, var(--gold-primary), var(--gold-secondary))',
                  border: 'none', color: '#070F1E', fontWeight: 800, fontSize: '0.9rem',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                Inquire & Receive Brochure <ArrowRight size={15} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenChauffeur(property)}
                style={{
                  width: '100%', padding: '13px', borderRadius: '50px',
                  background: 'transparent',
                  border: '1px solid rgba(212,175,55,0.35)', color: 'var(--gold-secondary)',
                  fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  fontFamily: 'var(--font-sans)', transition: 'all 0.2s ease',
                }}
              >
                <Car size={15} /> Book VIP Chauffeur Tour
              </motion.button>
              <a
                href={waLink} target="_blank" rel="noopener noreferrer"
                style={{
                  width: '100%', padding: '13px', borderRadius: '50px',
                  background: 'rgba(37,211,102,0.08)',
                  border: '1px solid rgba(37,211,102,0.3)', color: '#25D366',
                  fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  textDecoration: 'none', transition: 'all 0.2s ease',
                  fontFamily: 'var(--font-sans)', boxSizing: 'border-box',
                }}
              >
                <MessageSquare size={15} /> WhatsApp Site Visit
              </a>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'rgba(255,255,255,0.4)' }}>
              <span>Status: <strong style={{ color: '#fff' }}>{property.status || 'Available'}</strong></span>
              <span>Brokerage: <strong style={{ color: 'var(--gold-secondary)' }}>Zero</strong></span>
            </div>
          </div>

          {/* Developer */}
          <div style={{ background: 'rgba(10,18,36,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '0.95rem', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={16} /> Developer Dossier
            </h3>
            <strong style={{ fontSize: '0.95rem', color: '#fff', display: 'block', marginBottom: '4px' }}>{builder.name}</strong>
            <span style={{ fontSize: '0.72rem', color: 'var(--gold-secondary)', fontWeight: 700, display: 'block', marginBottom: '10px' }}>License: {builder.reraId}</span>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>{builder.desc}</p>
          </div>

          {/* Location intelligence */}
          <div style={{ background: 'rgba(10,18,36,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '0.95rem', margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={16} /> Location Intelligence
            </h3>
            <ScoreBar label="IT Hub Connectivity" value={corridor.commute} max={10} />
            <ScoreBar label="Infrastructure Index" value={corridor.infra} max={10} />
            <ScoreBar label="Green Index" value={corridor.green} max={10} />
            <ScoreBar label="Capital Appreciation" value={corridor.appreciation} max={25} />
            <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>Proximity Hubs</div>
              {corridor.landmarks.map((l, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '6px 0', borderBottom: i < corridor.landmarks.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{l.split('(')[0].trim()}</span>
                  <span style={{ color: 'var(--gold-secondary)', fontWeight: 600 }}>{l.includes('(') ? l.split('(')[1].replace(')', '') : '—'}</span>
                </div>
              ))}
            </div>

            {marketTrends && (
              <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)', fontSize: '0.78rem' }}>
                <div style={{ color: 'var(--gold-secondary)', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em' }}>Live Corridor Metrics</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Avg Price Per Sqft:</span>
                  <strong style={{ color: '#fff' }}>{marketTrends.averagePricePerSqft}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Annual appreciation:</span>
                  <strong style={{ color: '#2ec4b6' }}>{marketTrends.appreciationRate}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Expected Yield:</span>
                  <strong style={{ color: '#2ec4b6' }}>{marketTrends.rentalYield}</strong>
                </div>
              </div>
            )}
          </div>

          {/* EMI Calculator */}
          <div style={{ background: 'rgba(10,18,36,0.5)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '0.95rem', margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={16} /> Mortgage Calculator
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Down Payment ({downPayment}%)</span>
                  <strong style={{ color: '#fff' }}>{formatPrice(Number(property.price) * (downPayment / 100))}</strong>
                </div>
                <input type="range" min="10" max="60" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--gold-primary)', cursor: 'pointer' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[{ label: 'Rate (%)', value: interestRate, set: setInterestRate, step: 0.1 }, { label: 'Term (Yrs)', value: loanTerm, set: setLoanTerm, step: 1 }].map(({ label, value, set, step }) => (
                  <div key={label}>
                    <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
                    <input type="number" step={step} value={value} onChange={e => set(Number(e.target.value))} className="form-input" style={{ width: '100%', margin: 0, padding: '8px 10px', boxSizing: 'border-box' }} />
                  </div>
                ))}
              </div>
              <div style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.06), rgba(212,175,55,0.02))', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '12px', padding: '18px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block' }}>Monthly EMI Outflow</span>
                <strong style={{ fontSize: '1.7rem', color: 'var(--gold-primary)', display: 'block', margin: '6px 0 4px', lineHeight: 1 }}>{formatPrice(emi)}<span style={{ fontSize: '0.85rem', fontWeight: 400 }}>/mo</span></strong>
                <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)' }}>Loan Principal: {formatPrice(principal)}</span>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div style={{ background: 'rgba(10,18,36,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '0.95rem', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} /> Cost Breakdown
            </h3>
            {[
              ['Agreement Value', property.price, '#fff'],
              ['Stamp Duty (6%)', Number(property.price) * 0.06, 'rgba(255,255,255,0.7)'],
              ['GST (5%)', Number(property.price) * 0.05, 'rgba(255,255,255,0.7)'],
              ['Dev & Legal Charges', 150000, 'rgba(255,255,255,0.7)'],
            ].map(([label, val, color]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '8px 0', fontSize: '0.82rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</span>
                <strong style={{ color }}>{formatPrice(val)}</strong>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>All-Inclusive Total</span>
              <strong style={{ color: 'var(--gold-primary)' }}>{formatPrice(Number(property.price) * 1.11 + 150000)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SIMILAR PROPERTIES
      ══════════════════════════════════════════════════════════ */}
      {similarProperties.length > 0 && (
        <div style={{ padding: '50px 40px 0' }}>
          <h2 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '1.5rem', marginBottom: '28px' }}>
            ⚜️ Similar Curated Residences
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {similarProperties.map(sim => (
              <motion.div
                key={sim.id}
                whileHover={{ y: -6 }}
                onClick={() => { onBack(); setTimeout(() => { document.getElementById(`property-${sim.id}`)?.click(); }, 100); }}
                style={{ cursor: 'pointer', background: 'rgba(10,18,36,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}
              >
                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                  <img src={sim.imageUrl || slideshowImages[0]} alt={sim.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                  <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--gold-primary)', color: '#070f1e', fontSize: '0.62rem', fontWeight: 800, padding: '3px 8px', borderRadius: '3px', textTransform: 'uppercase' }}>{sim.transactionType}</span>
                  <span style={{ 
                    position: 'absolute', top: '10px', right: '10px', 
                    background: 'rgba(7, 15, 30, 0.85)', backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    color: 'var(--gold-primary)', fontSize: '0.65rem', fontWeight: 700, 
                    padding: '3px 8px', borderRadius: '4px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                  }}>
                    ✨ {sim.similarityScore}% Match
                  </span>
                </div>
                <div style={{ padding: '18px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}><MapPin size={10} color="var(--gold-primary)" /> {sim.location}</span>
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

      {/* ══════════════════════════════════════════════════════════
          STICKY BOTTOM BAR
      ══════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(4,8,20,0.94)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(212,175,55,0.2)',
        padding: '14px 40px', zIndex: 999,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 -12px 40px rgba(0,0,0,0.5)',
      }} className="sticky-booking-bar">
        <div>
          <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Valuation Mandate</div>
          <strong style={{ fontSize: '1.3rem', color: 'var(--gold-primary)' }}>{formatPrice(property.price, property.transactionType)}</strong>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a href={waLink} target="_blank" rel="noopener noreferrer" style={{
            padding: '10px 18px', borderRadius: '50px',
            background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)',
            color: '#25D366', display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none',
          }}>
            <MessageSquare size={14} /> WhatsApp
          </a>
          <button onClick={() => onOpenInquiry(property)} style={{
            padding: '10px 22px', borderRadius: '50px',
            background: 'linear-gradient(135deg, var(--gold-primary), var(--gold-secondary))',
            border: 'none', color: '#070F1E', fontWeight: 800, fontSize: '0.88rem',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            Inquire Now <ArrowRight size={14} />
          </button>
        </div>
      </div>

    </motion.div>
  );
}
