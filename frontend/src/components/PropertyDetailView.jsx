import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin, ShieldCheck, Bed, Bath, Maximize, Sparkles,
  Car, Calculator, TrendingUp, HelpCircle,
  MessageSquare, ChevronLeft, ChevronRight, Download,
  Building, CheckCircle, FileText, ArrowRight, ArrowLeft,
  Share2, Heart, Award, Wifi, Zap, Camera, Trees, Coffee,
  Dumbbell, ParkingCircle, Droplets, UtensilsCrossed, Phone,
  Star, Shield, Sun, Wind, Tv, Lock, Play, X, ZoomIn,
  Home, Grid, Map, Video, Info, ChevronDown, RotateCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/apiService';

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
  HINJEWADI:   { appreciation: 14.2, commute: 9.2, green: 8.4, infra: 8.8, landmarks: ['Infosys Campus (1.2 km)', 'Wipro SEZ (2.8 km)', 'Blue Ridge Mall (3 km)', 'Hinjewadi Metro (planned)'] },
  WAKAD:       { appreciation: 14.2, commute: 8.9, green: 8.0, infra: 8.5, landmarks: ['Wakad Chowk (0.5 km)', 'D-Mart Wakad (1 km)', 'Pimpri Railway (7 km)', 'Aditya Birla Hospital (4 km)'] },
  BANER:       { appreciation: 16.5, commute: 9.5, green: 8.8, infra: 9.2, landmarks: ['Balewadi High Street (1 km)', 'Symbiosis College (2 km)', 'Baner Metro (planned)', 'SB Road (1.5 km)'] },
  BALEWADI:    { appreciation: 15.8, commute: 9.3, green: 8.6, infra: 9.0, landmarks: ['Balewadi Stadium (0.8 km)', 'High Street Phoenix (1.2 km)', 'Croma Mall (2 km)', 'Baner Road (1 km)'] },
  KHARADI:     { appreciation: 15.2, commute: 8.7, green: 8.2, infra: 8.9, landmarks: ['EON IT Park (0.5 km)', 'World Trade Center (1 km)', 'Pune Airport (6 km)', 'Koregaon Park (5 km)'] },
};
const getCorridorData = (location = '') => {
  const key = location.toUpperCase().replace(/\s+/g,'_').replace(/[^A-Z_]/g,'');
  for (const [k,v] of Object.entries(CORRIDOR_DATA)) { if (key.includes(k)) return v; }
  return { appreciation: 13.5, commute: 8.5, green: 8.0, infra: 8.2, landmarks: ['Pune IT Park (2 km)', 'Local Schools (1 km)', 'Highway Access (3 km)', 'Hospital (4 km)'] };
};

/* ─── Score Bar ───────────────────────────────────────────── */
function ScoreBar({ label, value, max = 10 }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gold-primary)' }}>{value}{max === 10 ? '/10' : '%'}</span>
      </div>
      <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          style={{ height: '100%', borderRadius: '4px', background: 'linear-gradient(90deg, var(--gold-secondary), var(--gold-primary))' }} />
      </div>
    </div>
  );
}

/* ─── Amenity Icons ───────────────────────────────────────── */
const AMENITY_ICONS = {
  '24/7 Concierge Desk':          { icon: Phone,          color: '#D4AF37', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80' },
  'Infinity Sky Pool':            { icon: Droplets,       color: '#38bdf8', img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=400&q=80' },
  'Infinity Swimming Pool':       { icon: Droplets,       color: '#38bdf8', img: '/properties/vyomora/pool.jpg' },
  'Smart Home Automation':        { icon: Wifi,           color: '#34d399', img: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&q=80' },
  '100% Power Backup Grid':       { icon: Zap,            color: '#fbbf24', img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=400&q=80' },
  'CCTV & Video Door Phone':      { icon: Camera,         color: '#f87171', img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80' },
  'Landscaped Zen Gardens':       { icon: Trees,          color: '#4ade80', img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=400&q=80' },
  'Clubhouse & Co-work Space':    { icon: Coffee,         color: '#c084fc', img: 'https://images.unsplash.com/photo-1527192491265-7e452a145d55?auto=format&fit=crop&w=400&q=80' },
  "Children's Play Zone":         { icon: Star,           color: '#f9a8d4', img: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=400&q=80' },
  'Multi-Level Car Parking':      { icon: ParkingCircle,  color: '#93c5fd', img: 'https://images.unsplash.com/photo-1506521788723-868126d5e368?auto=format&fit=crop&w=400&q=80' },
  'Rainwater Harvesting':         { icon: Wind,           color: '#6ee7b7', img: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=400&q=80' },
  '25,454 sq.ft Grand Clubhouse': { icon: Building,       color: '#D4AF37', img: '/properties/vyomora/brochure_p4_Im0.jpg' },
  'Miyawaki Forest Zone':         { icon: Trees,          color: '#4ade80', img: '/properties/vyomora/playarea.jpg' },
  'Wellness Clinic':              { icon: Shield,         color: '#38bdf8', img: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=400&q=80' },
  'Digital Dome Theater':         { icon: Tv,             color: '#a78bfa', img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80' },
  'Cricket Simulator Suite':      { icon: Star,           color: '#fbbf24', img: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=400&q=80' },
  'Video Games Arcade Room':      { icon: Lock,           color: '#fb923c', img: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80' },
  'Trampoline & Adventure Park':  { icon: Sun,            color: '#f9a8d4', img: '/properties/vyomora/playarea.jpg' },
  'Spa & Reflexology Path':       { icon: Wind,           color: '#6ee7b7', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80' },
  'Library & Co-working Lounge':  { icon: Coffee,         color: '#c084fc', img: 'https://images.unsplash.com/photo-1527192491265-7e452a145d55?auto=format&fit=crop&w=400&q=80' },
  'Modular Kitchen Provisions':   { icon: UtensilsCrossed,color: '#fb923c', img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80' },
  'Private Elevator Access':      { icon: Building,       color: '#a78bfa', img: 'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=400&q=80' },
};

/* ─── 3D Netflix Amenity Card ─────────────────────────────── */
function AmenityCard({ label }) {
  const meta = AMENITY_ICONS[label] || { icon: CheckCircle, color: '#D4AF37', img: '' };
  const IconComp = meta.icon;
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHov, setIsHov] = useState(false);
  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setRotate({ x: -(((e.clientY-r.top)-r.height/2)/r.height)*14, y: (((e.clientX-r.left)-r.width/2)/r.width)*14 });
  };
  return (
    <div onMouseMove={handleMove} onMouseEnter={() => setIsHov(true)}
      onMouseLeave={() => { setIsHov(false); setRotate({ x: 0, y: 0 }); }}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: '14px', padding: '20px 18px',
        background: 'rgba(10,17,32,0.75)',
        border: isHov ? '1.5px solid rgba(212,175,55,0.55)' : '1px solid rgba(255,255,255,0.07)',
        cursor: 'default',
        transform: `perspective(700px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(${isHov ? '8px' : '0px'})`,
        transition: isHov ? 'none' : 'transform 0.45s cubic-bezier(0.25,1,0.5,1), border-color 0.3s, box-shadow 0.3s',
        boxShadow: isHov ? `0 18px 38px rgba(0,0,0,0.6), 0 0 12px ${meta.color}22` : '0 3px 12px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(16px)',
      }}>
      {meta.img && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${meta.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: isHov ? 0.4 : 0.15,
          transform: isHov ? 'scale(1.12)' : 'scale(1.04)',
          transition: 'transform 0.7s ease, opacity 0.4s ease', pointerEvents: 'none',
        }}/>
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(160deg, rgba(7,12,24,${isHov ? 0.3 : 0.55}) 0%, rgba(7,12,24,${isHov ? 0.82 : 0.92}) 100%)`,
        pointerEvents: 'none', transition: 'background 0.3s',
      }}/>
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: `${meta.color}18`, border: `1px solid ${meta.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconComp size={18} color={meta.color}/>
        </div>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: isHov ? '#fff' : 'rgba(255,255,255,0.8)', lineHeight: 1.35, transition: 'color 0.3s' }}>{label}</span>
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
export default function PropertyDetailView({ property, onBack, onOpenInquiry, onOpenChauffeur, formatPrice, getEmbedVideoUrl, allProperties = [] }) {
  const [activeSlide, setActiveSlide]     = useState(0);
  const [downPayment, setDownPayment]     = useState(20);
  const [interestRate, setInterestRate]   = useState(8.5);
  const [loanTerm, setLoanTerm]           = useState(20);
  const [activePlan, setActivePlan]       = useState('2bhk');
  const [activeTab, setActiveTab]         = useState('overview');
  const [lightboxOpen, setLightboxOpen]   = useState(false);
  const [lightboxStart, setLightboxStart] = useState(0);
  const [marketTrends, setMarketTrends]   = useState(null);
  
  // ── 3D Blueprint & Multi-Video Switcher States ──
  const [is3DMode, setIs3DMode] = useState(false);
  const [floorPlanRotation, setFloorPlanRotation] = useState(0);
  const [activeVideoTab, setActiveVideoTab] = useState('walkthrough');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [isWishlisted, setIsWishlisted] = useState(() => {
    try { const s = localStorage.getItem('wishlist_properties'); return (s ? JSON.parse(s) : []).includes(property.id); }
    catch { return false; }
  });

  useEffect(() => {
    const go = async () => { try { setMarketTrends(await apiService.getMarketTrends(property.location)); } catch {} };
    go();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [property.id, property.location]);

  const isVyomora    = property.title?.toLowerCase().includes('vyomora');
  const isCommercial = property.propertyType === 'COMMERCIAL';
  const builder      = getBuilderInfo(property.title);
  const corridor     = getCorridorData(property.location);

  const slideshowImages = property.slideshowImages || [
    property.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
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

  const nextSlide = () => setActiveSlide(p => (p + 1) % slideshowImages.length);
  const prevSlide = () => setActiveSlide(p => (p - 1 + slideshowImages.length) % slideshowImages.length);
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
    ...(property.videoUrl ? [{ id: 'video', icon: <Video size={15}/>, label: 'Video Tour' }] : []),
  ];

  const fpVariants = [
    { id: '2bhk',   label: '2 BHK',       url: property.floorPlanUrl,     desc: '684 - 839 sq.ft' },
    { id: '3bhk',   label: '3 BHK',       url: property.floorPlan3BHKUrl, desc: '1052 - 1477 sq.ft' },
    { id: 'master', label: 'Master Plan', url: property.masterPlanUrl,    desc: '12.5 Acre Estate' },
  ].filter(v => v.url);
  const fpActive = fpVariants.find(v => v.id === activePlan) || fpVariants[0];

  const handleMouseMoveFloorplan = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeaveFloorplan = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const Card = ({ children, style = {} }) => (
    <div style={{ background: 'rgba(10,18,36,0.55)', border: '1px solid rgba(255,255,255,0.065)', borderRadius: '20px', padding: '32px', ...style }}>
      {children}
    </div>
  );
  const H2 = ({ icon, children }) => (
    <h2 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '1.15rem', margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
      {icon}{children}
    </h2>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
      style={{ color: 'var(--text-light)', paddingBottom: '100px' }}>

      {/* ══ HERO GALLERY ══ */}
      <div style={{ position: 'relative', width: '100%', height: '75vh', minHeight: '540px', maxHeight: '800px', overflow: 'hidden', borderRadius: '0 0 28px 28px' }}>
        <AnimatePresence mode="wait">
          <motion.img key={activeSlide} src={slideshowImages[activeSlide]} alt={`${property.title} — view ${activeSlide + 1}`}
            initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.65 }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}/>
        </AnimatePresence>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(4,8,20,0.28) 0%, transparent 30%, rgba(4,8,20,0.65) 70%, rgba(4,8,20,0.98) 100%)', zIndex: 1 }}/>

        {/* Back btn */}
        <motion.button onClick={onBack} whileHover={{ x: -3 }} style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(4,8,20,0.72)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.13)', borderRadius: '50px', padding: '9px 20px', color: '#fff', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
          <ArrowLeft size={15}/> Portfolio
        </motion.button>

        {/* Action btns */}
        <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 10, display: 'flex', gap: '10px' }}>
          <button onClick={handleToggleWishlist} style={{ background: isWishlisted ? 'var(--gold-primary)' : 'rgba(4,8,20,0.72)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.13)', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isWishlisted ? '#070F1E' : '#fff', cursor: 'pointer', transition: 'all 0.3s' }}>
            <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'}/>
          </button>
          <button onClick={() => navigator.share?.({ title: property.title, url: window.location.href }).catch(() => {})} style={{ background: 'rgba(4,8,20,0.72)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.13)', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
            <Share2 size={15}/>
          </button>
        </div>

        {/* Slider arrows */}
        <button onClick={prevSlide} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(4,8,20,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '50%', width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', zIndex: 5 }}>
          <ChevronLeft size={20}/>
        </button>
        <button onClick={nextSlide} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(4,8,20,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '50%', width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', zIndex: 5 }}>
          <ChevronRight size={20}/>
        </button>

        {/* Photo count */}
        <button onClick={() => { setLightboxStart(activeSlide); setLightboxOpen(true); }} style={{ position: 'absolute', bottom: '155px', right: '20px', zIndex: 5, background: 'rgba(4,8,20,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '30px', padding: '8px 14px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.76rem', fontWeight: 600 }}>
          <ZoomIn size={13}/> {slideshowImages.length} Photos
        </button>

        {/* Dots */}
        <div style={{ position: 'absolute', bottom: '150px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 5 }}>
          {slideshowImages.map((_, i) => (
            <button key={i} onClick={() => setActiveSlide(i)} style={{ width: i === activeSlide ? '22px' : '7px', height: '7px', borderRadius: '4px', border: 'none', cursor: 'pointer', padding: 0, background: i === activeSlide ? 'var(--gold-primary)' : 'rgba(255,255,255,0.3)', transition: 'all 0.3s' }}/>
          ))}
        </div>

        {/* Hero info */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px 40px 36px', zIndex: 3 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span style={{ background: 'var(--gold-primary)', color: '#070F1E', fontSize: '0.65rem', fontWeight: 800, padding: '4px 12px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{property.transactionType}</span>
                <span style={{ background: 'rgba(4,8,20,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(212,175,55,0.35)', color: 'var(--gold-secondary)', fontSize: '0.65rem', fontWeight: 700, padding: '4px 12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ShieldCheck size={11}/> MahaRERA Verified
                </span>
                {isVyomora && <span style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#ef4444', fontSize: '0.65rem', fontWeight: 700, padding: '4px 12px', borderRadius: '4px' }}>🔥 NEW LAUNCH</span>}
              </div>
              <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(1.7rem, 3.2vw, 3rem)', color: '#fff', margin: '0 0 8px', textShadow: '0 2px 16px rgba(0,0,0,0.65)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                {property.title}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                <MapPin size={13} color="var(--gold-primary)"/> {property.address || property.location}, Pune
              </p>
            </div>
            <div style={{ background: 'rgba(4,8,20,0.78)', backdropFilter: 'blur(18px)', border: '1px solid rgba(212,175,55,0.28)', borderRadius: '18px', padding: '20px 30px', textAlign: 'right', minWidth: '210px' }}>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Investment Value</div>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--gold-primary)', lineHeight: 1 }}>{formatPrice(property.price, property.transactionType)}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Zero Brokerage · {property.status || 'Available'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ THUMBNAIL STRIP ══ */}
      <div style={{ display: 'flex', gap: '10px', padding: '16px 40px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {slideshowImages.map((img, i) => (
          <button key={i} onClick={() => { setActiveSlide(i); setLightboxStart(i); }} style={{ flexShrink: 0, width: '92px', height: '64px', borderRadius: '9px', overflow: 'hidden', border: activeSlide === i ? '2px solid var(--gold-primary)' : '2px solid rgba(255,255,255,0.06)', opacity: activeSlide === i ? 1 : 0.5, transition: 'all 0.25s', cursor: 'pointer', padding: 0, background: 'none' }}>
            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
          </button>
        ))}
      </div>

      {/* ══ SPEC STRIP ══ */}
      <div style={{ padding: '0 40px', marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
          {[
            { icon: <Bed size={20} color="var(--gold-primary)"/>, label: 'Configuration', value: isCommercial ? 'Commercial' : property.bedrooms > 0 ? `${property.bedrooms} BHK` : 'Studio' },
            { icon: <Bath size={20} color="var(--gold-primary)"/>, label: 'Bathrooms', value: `${property.bathrooms} Bath` },
            { icon: <Maximize size={20} color="var(--gold-primary)"/>, label: 'Carpet Area', value: `${property.areaSquareFeet} sqft` },
            { icon: <TrendingUp size={20} color="var(--gold-primary)"/>, label: 'Appreciation', value: `${corridor.appreciation}% p.a.` },
            { icon: <Award size={20} color="var(--gold-primary)"/>, label: 'Status', value: property.status || 'Available' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(7,15,30,0.9)', padding: '22px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              {s.icon}
              <span style={{ fontSize: '0.67rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</span>
              <strong style={{ fontSize: '0.98rem', color: '#fff', fontFamily: 'var(--font-title)' }}>{s.value}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* ══ NAV TABS ══ */}
      <div style={{ position: 'sticky', top: '0px', zIndex: 50, background: 'rgba(4,8,20,0.93)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(212,175,55,0.12)', padding: '0 40px', display: 'flex', gap: '2px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); document.getElementById(`sec-${tab.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '14px 18px', border: 'none', background: 'none', color: activeTab === tab.id ? 'var(--gold-primary)' : 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontWeight: activeTab === tab.id ? 700 : 500, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, borderBottom: activeTab === tab.id ? '2px solid var(--gold-primary)' : '2px solid transparent', transition: 'all 0.2s' }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ══ BODY ══ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.65fr) minmax(0,1fr)', gap: '28px', padding: '32px 40px 0', alignItems: 'start' }} className="detail-two-col">

        {/* ── LEFT ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* Overview */}
          <div id="sec-overview">
            <Card style={{ background: 'linear-gradient(135deg, rgba(12,24,48,0.7) 0%, rgba(6,12,24,0.85) 100%)', border: '1px solid rgba(212,175,55,0.18)', boxShadow: '0 16px 40px rgba(0,0,0,0.4)' }}>
              <H2 icon={<Sparkles size={18} color="var(--gold-primary)"/>}>About This Property</H2>
              <p style={{ fontSize: '0.96rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.9, margin: '0 0 24px', letterSpacing: '0.015em' }}>
                {property.description || `${property.title} is a meticulously designed luxury residence in ${property.location}, Pune, offering world-class amenities and superior construction standards. RERA registered and MahaRERA verified.`}
              </p>
              
              {isVyomora && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                  {[
                    ['🏙️','6 Premium Towers','High Rise Luxury'],
                    ['🌿','75% Open Spaces','Eco-Friendly Gated'],
                    ['🏊','40+ Amenities','Elite Club Lifestyle'],
                    ['📐','12.5 Acre Campus','Sprawling Gated Estate'],
                    ['🏗️','160 Yr Legacy','Engineering Trust'],
                    ['✅','MahaRERA Verified','PR1260002600999']
                  ].map(([ic, lb, desc]) => (
                    <div key={lb} style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '12px', padding: '14px 16px', transition: 'all 0.25s', cursor: 'default' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(212,175,55,0.05)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.12)'; e.currentTarget.style.boxShadow = 'none'; }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>{ic}</span>
                        <span style={{ fontSize: '0.84rem', color: '#fff', fontWeight: 700 }}>{lb}</span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>{desc}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Amenities */}
          <div id="sec-amenities">
            <Card style={{ background: 'linear-gradient(135deg, rgba(12,24,48,0.7) 0%, rgba(6,12,24,0.85) 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <H2 icon={<Sparkles size={18} color="var(--gold-primary)"/>}>Elite Lifestyle Amenities</H2>
              {isVyomora && property.amenityImages && (
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gridTemplateRows: '220px 220px', gap: '10px', borderRadius: '16px', overflow: 'hidden' }}>
                    <div style={{ gridRow: '1/3', position: 'relative', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }} onClick={() => { setLightboxStart(1); setLightboxOpen(true); }}>
                      <img src={property.amenityImages.pool} alt="Pool" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}/>
                      <div style={{ position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(4,8,20,0.85)', backdropFilter: 'blur(10px)', color: 'var(--gold-primary)', fontSize: '0.82rem', fontWeight: 800, padding: '6px 14px', borderRadius: '30px', border: '1px solid rgba(212,175,55,0.2)' }}>🏊 Infinite Swimming Pool</div>
                    </div>
                    <div style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }} onClick={() => { setLightboxStart(2); setLightboxOpen(true); }}>
                      <img src={property.amenityImages.playarea} alt="Play Area" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}/>
                      <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(4,8,20,0.85)', backdropFilter: 'blur(10px)', color: '#fff', fontSize: '0.78rem', fontWeight: 700, padding: '5px 12px', borderRadius: '30px' }}>🌳 Kids Play Park</div>
                    </div>
                    <div style={{ position: 'relative', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }} onClick={() => { setLightboxStart(4); setLightboxOpen(true); }}>
                      <img src={property.amenityImages.living} alt="Living Room" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}/>
                      <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(4,8,20,0.85)', backdropFilter: 'blur(10px)', color: '#fff', fontSize: '0.78rem', fontWeight: 700, padding: '5px 12px', borderRadius: '30px' }}>🛋️ Designer Living Room</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    {[{key:'kitchen',label:'🍳 Modern Kitchen',li:5},{key:'bedroom',label:'🛏️ Elite Bedroom',li:6},{key:'aerial',label:'🚁 Aerial Landscape',li:3}].map(({key, label, li}) => (
                      <div key={key} style={{ flex: 1, height: '120px', position: 'relative', overflow: 'hidden', borderRadius: '12px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.05)' }} onClick={() => { setLightboxStart(li); setLightboxOpen(true); }}>
                        <img src={property.amenityImages[key]} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}/>
                        <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(4,8,20,0.8)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: '0.74rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px' }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '10px' }}>
                {(property.specificAmenities || ['24/7 Concierge Desk','Infinity Sky Pool','Private Elevator Access','Smart Home Automation','Modular Kitchen Provisions','100% Power Backup Grid','CCTV & Video Door Phone','Landscaped Zen Gardens','Clubhouse & Co-work Space',"Children's Play Zone",'Multi-Level Car Parking','Rainwater Harvesting']).map(a => <AmenityCard key={a} label={a}/>)}
              </div>
            </Card>
          </div>

          {/* Floor Plans */}
          <div id="sec-floorplans">
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '1.15rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>📐 Layout Blueprints</h2>
                {fpVariants.length > 0 && (
                  <div style={{ display: 'inline-flex', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.07)' }}>
                    {fpVariants.map(v => (
                      <button key={v.id} onClick={() => { setActivePlan(v.id); setFloorPlanRotation(0); }} style={{ background: activePlan === v.id ? 'var(--gold-primary)' : 'transparent', color: activePlan === v.id ? '#070f1e' : 'rgba(255,255,255,0.6)', border: 'none', padding: '7px 16px', borderRadius: '30px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s', whiteSpace: 'nowrap' }}>
                        {v.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {fpActive ? (
                <div>
                  {/* Perspective Mode Switcher */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', width: 'fit-content' }}>
                    <button onClick={() => setIs3DMode(false)} style={{ background: !is3DMode ? 'rgba(212,175,55,0.15)' : 'transparent', color: !is3DMode ? 'var(--gold-primary)' : 'rgba(255,255,255,0.6)', border: !is3DMode ? '1px solid rgba(212,175,55,0.35)' : '1px solid transparent', padding: '6px 14px', borderRadius: '8px', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.25s', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Maximize size={12}/> 2D Orthographic
                    </button>
                    <button onClick={() => setIs3DMode(true)} style={{ background: is3DMode ? 'rgba(212,175,55,0.15)' : 'transparent', color: is3DMode ? 'var(--gold-primary)' : 'rgba(255,255,255,0.6)', border: is3DMode ? '1px solid rgba(212,175,55,0.35)' : '1px solid transparent', padding: '6px 14px', borderRadius: '8px', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.25s', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <RotateCw size={12}/> 3D Isometric View
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '24px', alignItems: 'center' }} className="floor-plan-grid">
                    {/* Visualizer Frame */}
                    <div 
                      style={{ 
                        position: 'relative', 
                        background: 'radial-gradient(circle at center, rgba(16,28,54,0.7) 0%, rgba(6,12,24,0.95) 100%)', 
                        border: '1px solid rgba(212,175,55,0.12)', 
                        borderRadius: '16px', 
                        minHeight: '340px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        overflow: 'hidden',
                        perspective: '1200px',
                        cursor: is3DMode ? 'grab' : 'zoom-in'
                      }}
                      onMouseMove={handleMouseMoveFloorplan}
                      onMouseLeave={handleMouseLeaveFloorplan}
                      onClick={() => !is3DMode && window.open(fpActive.url, '_blank')}
                    >
                      {/* Architectural Tech Grid */}
                      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none', opacity: is3DMode ? 0.8 : 0.3 }}/>
                      
                      {/* Volumetric Hologram Container */}
                      <div style={{
                        position: 'relative',
                        width: '80%',
                        height: '80%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transformStyle: 'preserve-3d',
                        transform: is3DMode 
                          ? `rotateX(${58 + mousePos.y * 15}deg) rotateY(${mousePos.x * 15}deg) rotateZ(${-35 + floorPlanRotation}deg) translateZ(10px)`
                          : 'none',
                        transition: 'transform 0.15s cubic-bezier(0.1, 0.8, 0.2, 1)',
                      }}>
                        
                        {/* 3D Depth Layer 3 (Far Shadow/Base) */}
                        {is3DMode && (
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `url(${fpActive.url})`,
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            transform: 'translateZ(-24px)',
                            filter: 'brightness(0) saturate(100%) invert(84%) sepia(21%) saturate(980%) hue-rotate(340deg) brightness(80%) contrast(75%) opacity(0.12)',
                            pointerEvents: 'none'
                          }}/>
                        )}

                        {/* 3D Depth Layer 2 (Mid Slab) */}
                        {is3DMode && (
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `url(${fpActive.url})`,
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            transform: 'translateZ(-12px)',
                            filter: 'brightness(0) saturate(100%) invert(84%) sepia(21%) saturate(980%) hue-rotate(340deg) brightness(88%) contrast(85%) opacity(0.35)',
                            pointerEvents: 'none'
                          }}/>
                        )}

                        {/* Top Main Render Layer */}
                        <div style={{
                          position: 'relative',
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transform: is3DMode ? 'translateZ(0px)' : 'none',
                          filter: is3DMode ? 'drop-shadow(0 25px 35px rgba(0,0,0,0.85))' : 'none',
                          transition: 'all 0.3s'
                        }}>
                          <img src={fpActive.url} alt={`${fpActive.label} Layout Blueprint`} style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '300px' }}/>
                        </div>
                      </div>

                      {/* 3D Mode Interaction Overlay controls */}
                      {is3DMode ? (
                        <div style={{ position: 'absolute', bottom: '14px', left: '14px', right: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
                          <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>↔ Drag mouse to tilt</span>
                          <button onClick={(e) => { e.stopPropagation(); setFloorPlanRotation(r => (r + 90) % 360); }} style={{ pointerEvents: 'auto', background: 'rgba(7,15,30,0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '6px 12px', color: 'var(--gold-secondary)', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.7)'} onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'}>
                            <RotateCw size={12}/> Rotate 90°
                          </button>
                        </div>
                      ) : (
                        <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(4,8,20,0.78)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '5px 10px', color: 'rgba(255,255,255,0.65)', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '5px', pointerEvents: 'none' }}>
                          <ZoomIn size={12}/> Click to expand
                        </div>
                      )}
                    </div>

                    {/* Stats & Specifications Side-Dossier */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Unit Type</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold-primary)', fontFamily: 'var(--font-title)' }}>{fpActive.label}</div>
                      </div>

                      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Super Built-Up Area</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{fpActive.desc}</div>
                      </div>

                      {isVyomora && activePlan !== 'master' && property.configurations && (
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Configurations Details</div>
                          {property.configurations.filter(c => activePlan === '2bhk' ? c.name.includes('2 BHK') : c.name.includes('3 BHK')).map(c => (
                            <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '7px', marginBottom: '7px', fontSize: '0.78rem' }}>
                              <span style={{ color: 'rgba(255,255,255,0.55)' }}>{c.name.replace('2 BHK ','').replace('3 BHK ','')}</span>
                              <strong style={{ color: '#fff' }}>{c.area}</strong>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <button onClick={onOpenInquiry} style={{ marginTop: '4px', width: '100%', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', background: 'none', border: '1px solid rgba(212,175,55,0.28)', borderRadius: '10px', color: 'var(--gold-secondary)', padding: '12px 18px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.25s' }} onMouseOver={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.08)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; }} onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.28)'; }}>
                        <Download size={13}/> Download Structural PDF
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '40px', fontSize: '0.88rem' }}>Floor plans available on inquiry</div>
              )}
            </Card>
          </div>

          {/* Pricing Table */}
          {property.configurations && property.configurations.length > 0 && (
            <div id="sec-pricing">
              <Card style={{ background: 'linear-gradient(135deg, rgba(12,24,48,0.7) 0%, rgba(6,12,24,0.85) 100%)', border: '1px solid rgba(212,175,55,0.18)', boxShadow: '0 16px 40px rgba(0,0,0,0.4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
                  <H2 icon={<Building size={18} color="var(--gold-primary)"/>} style={{ margin: 0 }}>Tower Configurations & Pricing</H2>
                  <span style={{ fontSize: '0.66rem', color: 'var(--gold-secondary)', border: '1px solid rgba(212,175,55,0.25)', padding: '4px 10px', borderRadius: '4px', background: 'rgba(212,175,55,0.05)', display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                    🛡️ MahaRERA Escrow Protected
                  </span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '460px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {['Unit Type','Super Carpet Area','Investment Estimate','Availability Status','Action'].map((h, i) => <th key={h} style={{ padding: '14px 16px', textAlign: i === 4 ? 'right' : 'left' }}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {property.configurations.map((c, idx) => {
                        const fast = c.status.includes('Fast') || c.status.includes('Exclusive');
                        const lim  = c.status.includes('Limited') || c.status.includes('Premium');
                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.88rem', transition: 'all 0.25s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.04)'; e.currentTarget.style.borderLeft = '2px solid var(--gold-primary)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderLeft = 'none'; }}>
                            <td style={{ padding: '16px 16px', fontWeight: 700, color: '#fff' }}>{c.name}</td>
                            <td style={{ padding: '16px 16px', color: 'rgba(255,255,255,0.7)' }}>{c.area}</td>
                            <td style={{ padding: '16px 16px', color: 'var(--gold-primary)', fontWeight: 800, fontSize: '0.98rem' }}>{c.price}</td>
                            <td style={{ padding: '16px 16px' }}>
                              <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', background: fast ? 'rgba(239,68,68,0.12)' : lim ? 'rgba(251,191,36,0.12)' : 'rgba(16,185,129,0.12)', color: fast ? '#ef4444' : lim ? '#fbbf24' : '#10b981', border: `1px solid ${fast ? 'rgba(239,68,68,0.2)' : lim ? 'rgba(251,191,36,0.2)' : 'rgba(16,185,129,0.2)'}`, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.status}</span>
                            </td>
                            <td style={{ padding: '16px 16px', textAlign: 'right' }}>
                              <button onClick={() => onOpenInquiry(property)} style={{ background: 'var(--gold-primary)', color: '#070f1e', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 0 14px rgba(212,175,55,0.5)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}>
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

          {/* Video */}
          {property.videoUrl && (
            <div id="sec-video">
              <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <H2 icon={<Play size={18}/>} style={{ margin: 0 }}>🎬 Cinematic Video Tour</H2>
                  
                  {isVyomora && (
                    <div style={{ display: 'inline-flex', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.07)' }}>
                      {[
                        { id: 'walkthrough', label: 'Drone Walkthrough' },
                        { id: 'showflat', label: 'Show Flat Tour' },
                        { id: 'location', label: 'Location AV' }
                      ].map(t => (
                        <button 
                          key={t.id} 
                          onClick={() => setActiveVideoTab(t.id)} 
                          style={{ 
                            background: activeVideoTab === t.id ? 'var(--gold-primary)' : 'transparent', 
                            color: activeVideoTab === t.id ? '#070f1e' : 'rgba(255,255,255,0.6)', 
                            border: 'none', 
                            padding: '7px 16px', 
                            borderRadius: '30px', 
                            fontSize: '0.78rem', 
                            fontWeight: 700, 
                            cursor: 'pointer', 
                            transition: 'all 0.3s', 
                            whiteSpace: 'nowrap' 
                          }}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {isVyomora ? (
                  <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '16/9', boxShadow: '0 25px 60px rgba(0,0,0,0.6)', border: '1px solid rgba(212,175,55,0.18)', background: '#040814' }}>
                    {activeVideoTab === 'walkthrough' && (
                      <video 
                        key="walkthrough"
                        controls 
                        preload="metadata"
                        poster={slideshowImages[0]}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      >
                        <source src="https://drive.google.com/uc?id=1DYALmyrqT27g5nS8fPwffNLFMO3iBpT0" type="video/mp4" />
                        Your browser does not support HTML5 video streaming.
                      </video>
                    )}
                    {activeVideoTab === 'showflat' && (
                      <video 
                        key="showflat"
                        controls 
                        preload="metadata"
                        poster={slideshowImages[4] || slideshowImages[0]}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      >
                        <source src="https://drive.google.com/uc?id=1vXzk2x-kiWGtLj_jsTKsyPnKzMBJqSsR" type="video/mp4" />
                        Your browser does not support HTML5 video streaming.
                      </video>
                    )}
                    {activeVideoTab === 'location' && (
                      <video 
                        key="location"
                        controls 
                        preload="metadata"
                        poster={property.locationMapUrl || slideshowImages[0]}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      >
                        <source src="https://drive.google.com/uc?id=1IsrDGjG8-1iHFtCJk15MVRxSsndNA63A" type="video/mp4" />
                        Your browser does not support HTML5 video streaming.
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
            <Card style={{ background: 'linear-gradient(135deg, rgba(12,24,48,0.7) 0%, rgba(6,12,24,0.85) 100%)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 16px 40px rgba(0,0,0,0.4)' }}>
              <H2 icon={<MapPin size={18} color="var(--gold-primary)"/>}>Location & Connectivity</H2>
              {property.locationMapUrl && (
                <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '14px', marginBottom: '24px', border: '1px solid rgba(212,175,55,0.2)', cursor: 'pointer', boxShadow: '0 12px 30px rgba(0,0,0,0.5)' }} onClick={() => window.open(property.locationMapUrl, '_blank')}>
                  <img src={property.locationMapUrl} alt="Location Map" style={{ width: '100%', display: 'block', maxHeight: '280px', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}/>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,8,20,0.5), transparent)', pointerEvents: 'none' }}/>
                  <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'var(--gold-primary)', color: '#070f1e', borderRadius: '8px', padding: '6px 14px', fontSize: '0.78rem', fontWeight: 800, boxShadow: '0 4px 12px rgba(212,175,55,0.3)' }}>Open in Google Maps ↗</div>
                </div>
              )}
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                {corridor.landmarks.map((l, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '12px', padding: '14px 16px', gap: '10px', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'} onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.12)'}>
                    <span style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>📍 {l.split('(')[0].trim()}</span>
                    <span style={{ fontSize: '0.76rem', color: 'var(--gold-secondary)', fontWeight: 800, padding: '3px 8px', background: 'rgba(212,175,55,0.06)', borderRadius: '6px', whiteSpace: 'nowrap' }}>{l.includes('(') ? l.split('(')[1].replace(')','') : '—'}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* FAQ */}
          <Card style={{ background: 'linear-gradient(135deg, rgba(12,24,48,0.7) 0%, rgba(6,12,24,0.85) 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <H2 icon={<HelpCircle size={18} color="var(--gold-primary)"/>}>Compliance & Buying FAQ</H2>
            {[
              { q: 'Is title clear and RERA registration verified?', a: `Yes. All 24K Realtors listings undergo a 5-stage carpet and registry deed audit. Developer ID ${builder.reraId} is registered with MahaRERA under Section 9 of the Real Estate Act, 2016.` },
              { q: 'What does all-inclusive pricing comprise?', a: 'Agreement value, stamp duty, registration taxes, development charges, piped gas fees, and society corpus deposits as applicable under standard builder rules.' },
              { q: 'What is the brokerage structure?', a: '24K Realtors charges zero brokerage to buyers. Our advisory is 100% developer-compensated, ensuring full conflict-free guidance.' },
            ].map(({ q, a }) => (
              <details key={q} style={{ background: 'rgba(255,255,255,0.015)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', padding: '16px 20px', marginBottom: '12px', cursor: 'pointer', transition: 'all 0.3s' }} onToggle={e => e.currentTarget.style.borderColor = e.currentTarget.open ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.05)'}>
                <summary style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {q} <ChevronDown size={14} style={{ color: 'var(--gold-secondary)', flexShrink: 0 }}/>
                </summary>
                <p style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.65)', marginTop: '12px', lineHeight: 1.8, marginBottom: 0 }}>{a}</p>
              </details>
            ))}
          </Card>
        </div>

        {/* ── RIGHT STICKY ── */}
        <div style={{ position: 'sticky', top: '56px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Booking Card */}
          <div style={{ background: 'radial-gradient(circle at top left, rgba(22,34,58,0.98) 0%, rgba(7,15,30,0.99) 100%)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '20px', padding: '28px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '130px', height: '130px', background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)', pointerEvents: 'none' }}/>
            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '6px' }}>Investment Value</div>
            <div style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--gold-primary)', marginBottom: '4px', lineHeight: 1 }}>{formatPrice(property.price, property.transactionType)}</div>
            <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.38)', marginBottom: '22px' }}>{property.areaSquareFeet} sqft · ₹{Math.round(property.price / property.areaSquareFeet).toLocaleString()}/sqft</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }} onClick={() => onOpenInquiry(property)} style={{ width: '100%', padding: '14px', borderRadius: '50px', background: 'linear-gradient(135deg, var(--gold-primary), var(--gold-secondary))', border: 'none', color: '#070F1E', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'var(--font-sans)' }}>
                Inquire & Receive Brochure <ArrowRight size={15}/>
              </motion.button>
              <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }} onClick={() => onOpenChauffeur(property)} style={{ width: '100%', padding: '13px', borderRadius: '50px', background: 'transparent', border: '1px solid rgba(212,175,55,0.35)', color: 'var(--gold-secondary)', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'var(--font-sans)', transition: 'all 0.2s' }}>
                <Car size={15}/> Book VIP Chauffeur Tour
              </motion.button>
              <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ width: '100%', padding: '13px', borderRadius: '50px', background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.3)', color: '#25D366', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none', transition: 'all 0.2s', fontFamily: 'var(--font-sans)', boxSizing: 'border-box' }}>
                <MessageSquare size={15}/> WhatsApp Site Visit
              </a>
            </div>
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'rgba(255,255,255,0.4)' }}>
              <span>Status: <strong style={{ color: '#fff' }}>{property.status || 'Available'}</strong></span>
              <span>Brokerage: <strong style={{ color: 'var(--gold-secondary)' }}>Zero</strong></span>
            </div>
          </div>

          {/* Developer Dossier */}
          <div style={{ background: 'rgba(10,18,36,0.55)', border: '1px solid rgba(255,255,255,0.065)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '0.95rem', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}><Building size={16}/> Developer Dossier</h3>
            {isVyomora && <div style={{ marginBottom: '12px' }}><img src="/properties/vyomora/logo.jpeg" alt="Shapoorji Pallonji" style={{ height: '34px', objectFit: 'contain', filter: 'brightness(1.1)', borderRadius: '4px' }} onError={e => e.currentTarget.style.display = 'none'}/></div>}
            <strong style={{ fontSize: '0.95rem', color: '#fff', display: 'block', marginBottom: '4px' }}>{builder.name}</strong>
            <span style={{ fontSize: '0.72rem', color: 'var(--gold-secondary)', fontWeight: 700, display: 'block', marginBottom: '10px' }}>RERA: {builder.reraId}</span>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, margin: 0 }}>{builder.desc}</p>
          </div>

          {/* Location Intelligence */}
          <div style={{ background: 'rgba(10,18,36,0.55)', border: '1px solid rgba(255,255,255,0.065)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '0.95rem', margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={16}/> Location Intelligence</h3>
            <ScoreBar label="IT Hub Connectivity" value={corridor.commute} max={10}/>
            <ScoreBar label="Infrastructure Index" value={corridor.infra} max={10}/>
            <ScoreBar label="Green Index" value={corridor.green} max={10}/>
            <ScoreBar label="Capital Appreciation" value={corridor.appreciation} max={25}/>
            {marketTrends && (
              <div style={{ marginTop: '18px', padding: '14px', borderRadius: '10px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.13)', fontSize: '0.78rem' }}>
                <div style={{ color: 'var(--gold-secondary)', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em' }}>Live Corridor Metrics</div>
                {[['Avg Price/sqft',marketTrends.averagePricePerSqft],['Annual Appreciation',marketTrends.appreciationRate,'#2ec4b6'],['Expected Yield',marketTrends.rentalYield,'#2ec4b6']].map(([l,v,c]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>{l}:</span>
                    <strong style={{ color: c || '#fff' }}>{v}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* EMI Calculator */}
          <div style={{ background: 'rgba(10,18,36,0.55)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '0.95rem', margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: '8px' }}><Calculator size={16}/> Mortgage Calculator</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '7px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Down Payment ({downPayment}%)</span>
                  <strong style={{ color: '#fff' }}>{formatPrice(Number(property.price) * (downPayment / 100))}</strong>
                </div>
                <input type="range" min="10" max="60" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--gold-primary)', cursor: 'pointer' }}/>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[{ label: 'Rate (%)', value: interestRate, set: setInterestRate, step: 0.1 }, { label: 'Term (Yrs)', value: loanTerm, set: setLoanTerm, step: 1 }].map(({ label, value, set, step }) => (
                  <div key={label}>
                    <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
                    <input type="number" step={step} value={value} onChange={e => set(Number(e.target.value))} className="form-input" style={{ width: '100%', margin: 0, padding: '8px 10px', boxSizing: 'border-box' }}/>
                  </div>
                ))}
              </div>
              <div style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.06), rgba(212,175,55,0.02))', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '12px', padding: '18px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block' }}>Monthly EMI</span>
                <strong style={{ fontSize: '1.65rem', color: 'var(--gold-primary)', display: 'block', margin: '6px 0 4px', lineHeight: 1 }}>{formatPrice(emi)}<span style={{ fontSize: '0.82rem', fontWeight: 400 }}>/mo</span></strong>
                <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)' }}>Principal: {formatPrice(principal)}</span>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div style={{ background: 'rgba(10,18,36,0.55)', border: '1px solid rgba(255,255,255,0.065)', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '0.95rem', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={16}/> Cost Breakdown</h3>
            {[['Agreement Value', property.price, '#fff'], ['Stamp Duty (6%)', Number(property.price) * 0.06, 'rgba(255,255,255,0.7)'], ['GST (5%)', Number(property.price) * 0.05, 'rgba(255,255,255,0.7)'], ['Dev & Legal Charges', 150000, 'rgba(255,255,255,0.7)']].map(([l, v, c]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '8px 0', fontSize: '0.82rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.55)' }}>{l}</span>
                <strong style={{ color: c }}>{formatPrice(v)}</strong>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontSize: '0.88rem' }}>
              <span style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>All-Inclusive Total</span>
              <strong style={{ color: 'var(--gold-primary)' }}>{formatPrice(Number(property.price) * 1.11 + 150000)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ══ SIMILAR ══ */}
      {similar.length > 0 && (
        <div style={{ padding: '50px 40px 0' }}>
          <h2 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '1.5rem', marginBottom: '28px' }}>⚜️ Similar Curated Residences</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {similar.map(sim => (
              <motion.div key={sim.id} whileHover={{ y: -6 }} onClick={() => { onBack(); setTimeout(() => document.getElementById(`property-${sim.id}`)?.click(), 100); }} style={{ cursor: 'pointer', background: 'rgba(10,18,36,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
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

      {/* ══ STICKY BOTTOM BAR ══ */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(4,8,20,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(212,175,55,0.18)', padding: '14px 40px', zIndex: 999, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 -12px 40px rgba(0,0,0,0.5)' }} className="sticky-booking-bar">
        <div>
          <div style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Valuation Mandate</div>
          <strong style={{ fontSize: '1.3rem', color: 'var(--gold-primary)' }}>{formatPrice(property.price, property.transactionType)}</strong>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 18px', borderRadius: '50px', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', color: '#25D366', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
            <MessageSquare size={14}/> WhatsApp
          </a>
          <button onClick={() => onOpenInquiry(property)} style={{ padding: '10px 22px', borderRadius: '50px', background: 'linear-gradient(135deg, var(--gold-primary), var(--gold-secondary))', border: 'none', color: '#070F1E', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Inquire Now <ArrowRight size={14}/>
          </button>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && <Lightbox images={slideshowImages} startIndex={lightboxStart} onClose={() => setLightboxOpen(false)}/>}
      </AnimatePresence>

    </motion.div>
  );
}
