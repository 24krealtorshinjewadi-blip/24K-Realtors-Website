/**
 * YashOneProjectPage.jsx — 24K Realtors
 * ─────────────────────────────────────────────────────────────────────────────
 * Ultra-Luxury Flagship Project Subpage for Vilas Javdekar (VJ) YashOne,
 * Hinjewadi Phase 1.
 * Matches the architectural depth, aesthetic excellence, and feature completeness
 * of Godrej 24 and Megapolis Township.
 *
 * Highlights:
 *  - Sticky Luxury Topbar with 24K Realtors Brand & Call CTA
 *  - Cinzel Hero Elevation with MahaRERA Verification & Key Stats (678 sq.ft Carpet)
 *  - 5-Creative Interactive Virtual Tour Gallery with Pan & Zoom Lightbox
 *  - Verified Apartment Configuration Card
 *  - 10+ Modern Lifestyle Amenities Grid
 *  - Proximity Matrix to Wipro Circle, Infosys Phase 1 & Metro Line 3
 *  - Developer Profile (Vilas Javdekar Developers — 40+ Years Legacy)
 *  - Interactive FAQ Accordion & Sticky Bottom Mobile Action Bar
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, ShieldCheck, Phone, MessageSquare, ArrowLeft,
  CheckCircle2, Star, Clock, Zap, Car, Dumbbell, Trees,
  Lock, Coffee, Users, Home, IndianRupee,
  ChevronDown, ChevronUp, Building2, Award, X, ChevronLeft, ChevronRight, Maximize2,
  ZoomIn, ZoomOut, RotateCcw, Sparkles
} from 'lucide-react';
import { useSEO } from '../services/seoService';
import CompanyLogo from './CompanyLogo';

/* ══════════════════════════════════════════════════════════════════
   VJ YASHONE PROJECT DATA SPECIFICATION
══════════════════════════════════════════════════════════════════ */
const YASHONE_DATA = {
  key: 'yashone',
  name: 'VJ YashOne',
  fullName: 'VJ YashOne — Hinjewadi Phase 1',
  developer: 'Vilas Javdekar Developers (VJ)',
  rera: 'P52100021676',
  location: 'Hinjewadi Phase 1, Rajiv Gandhi Infotech Park, Pune — 411057',
  status: 'Ready to Move',
  tagline: 'Live. Connect. Grow. — A Home in the Heart of Hinjewadi',
  heroSubline: 'Thoughtfully planned 2 BHK residences with 678 sq.ft carpet area amidst lush green surroundings in Hinjewadi Phase 1',
  accentColor: '#C59B27',
  accentGradient: 'linear-gradient(135deg, #7A5B0B 0%, #C59B27 50%, #F3E5AB 100%)',
  heroBg: 'linear-gradient(160deg, #070913 0%, #121929 40%, #1f2a40 100%)',
  showcaseImage: '/yashone_hero_card.jpg',
  investmentScore: 94,
  rentalYield: '5.0%',
  whatsappText: 'Hi 24K Realtors, I am interested in VJ YashOne Hinjewadi Phase 1 (678 sq.ft 2 BHK). Please share current pricing and available units.',

  gallery: [
    {
      id: 1,
      tag: 'Grand Elevation & Towers',
      icon: '🏢',
      roomName: 'Grand Elevation',
      title: 'YashOne Hinjewadi — A Home in the Heart of Hinjewadi',
      subtitle: 'Majestic contemporary towers by Vilas Javdekar featuring lush green surroundings, modern podium amenities, and direct access to Phase 1 IT corridor.',
      src: '/yashone_hero_card.jpg',
      features: [
        { icon: '🏢', title: 'Iconic Architecture', desc: 'Sleek high-rise elevation with seismic-resistant RCC structure' },
        { icon: '🌿', title: 'Lush Green Podiums', desc: 'Thoughtfully landscaped garden areas and fresh open spaces' },
        { icon: '🛡️', title: 'Multi-Tier Security', desc: '24x7 gated security, boom barriers, and CCTV surveillance' },
        { icon: '📍', title: 'Prime Phase 1 Hub', desc: 'Walking distance to Wipro Circle and Rajiv Gandhi Infotech Park' }
      ]
    },
    {
      id: 2,
      tag: 'Living & Dining Room',
      icon: '🛋️',
      roomName: 'Living Room',
      title: 'Spacious Living Room — Designed for a Brighter Tomorrow',
      subtitle: 'Expansive vitrified flooring, large sliding balcony apertures, and natural cross-ventilation crafted for effortless modern living.',
      src: '/yashone_living_room.jpg',
      features: [
        { icon: '🛋️', title: 'Modern Living', desc: 'Ergonomically planned spaces maximizing natural movement and comfort' },
        { icon: '☀️', title: 'Natural Light', desc: 'Floor-to-ceiling glass sliding doors welcoming golden ambient light' },
        { icon: '🌿', title: 'Peaceful Surroundings', desc: 'Serene landscape outlook away from street traffic bustle' },
        { icon: '🌅', title: 'Attached Balcony', desc: 'Direct seamless connection to private open viewing deck' }
      ]
    },
    {
      id: 3,
      tag: 'Master Bedroom',
      icon: '🛏️',
      roomName: 'Bedroom',
      title: 'Spacious Master Bedroom — Peaceful Personal Sanctuary',
      subtitle: 'Calm, well-ventilated bedroom with dual window apertures, abundant sunlight, and ample space for king bed and wardrobes.',
      src: '/yashone_bedroom.jpg',
      features: [
        { icon: '🛏️', title: 'Spacious Bedroom', desc: 'Roomy master layout with dedicated niche for customized wardrobe' },
        { icon: '☀️', title: 'Dual Natural Light', desc: 'Twin corner windows delivering cross breeze and morning sunlight' },
        { icon: '🌿', title: 'Peaceful Outlook', desc: 'Tree-lined horizon view ensuring calm sleep and relaxation' },
        { icon: '🔌', title: 'Concealed Wiring', desc: 'Pre-fitted electrical points for split AC, TV, and reading lights' }
      ]
    },
    {
      id: 4,
      tag: 'Modern Designer Bathroom',
      icon: '🚿',
      roomName: 'Bathroom',
      title: 'Modern Bathroom — Clean, Functional & Premium Finishes',
      subtitle: 'Branded CP fittings, elegant wall-hung sanitaryware, textured full-height ceramic tiles, and frosted louvered window for instant exhaust.',
      src: '/yashone_bathroom.jpg',
      features: [
        { icon: '🚿', title: 'Branded Fittings', desc: 'Designer chrome mixer, health faucet, and rain shower fitting' },
        { icon: '🚽', title: 'Wall-Hung Commode', desc: 'Contemporary wall-hung WC with concealed water cistern' },
        { icon: '🧼', title: 'Anti-Skid Tiles', desc: 'Textured slip-resistant ceramic flooring for ultimate safety' },
        { icon: '💨', title: 'Louvered Ventilation', desc: 'Dedicated frosted ventilation window for fresh airflow' }
      ]
    },
    {
      id: 5,
      tag: 'Private Viewing Balcony',
      icon: '🌇',
      roomName: 'Balcony',
      title: 'Private Balcony — Scenic Greenery & Hinjewadi Skyline',
      subtitle: 'Unobstructed scenic views overlooking manicured green grounds and towers, completed with sleek modern glass balustrade.',
      src: '/yashone_balcony.jpg',
      features: [
        { icon: '🌇', title: 'Open Skyline Views', desc: 'Wide panoramic perspective over Hinjewadi Phase 1 tree canopy' },
        { icon: '🛡️', title: 'Toughened Glass Railing', desc: 'Sleek stainless steel & glass safety balustrade' },
        { icon: '☕', title: 'Relaxation Deck', desc: 'Perfect spot for your morning brew and evening unwinding' },
        { icon: '🪵', title: 'Wooden Finish Tiles', desc: 'Anti-skid wood-textured ceramic balcony decking' }
      ]
    }
  ],

  uniqueFeatures: [
    'Prime Location in Hinjewadi Phase 1',
    'RERA Carpet Area: 678 sq.ft (2 BHK)',
    'Vilas Javdekar Trust & Transparency (VJ 40+ Yrs)',
    'Lush Green Podium & Landscaped Parks',
    'Walking Distance to Wipro Circle & Tech Campuses',
    'Upcoming Hinjewadi Metro Line 3 Proximity'
  ],

  configurations: [
    { bhk: '2 BHK', carpet: '678 sq.ft', price: '₹68 Lakhs – ₹78 Lakhs', highlight: true, note: 'RERA Verified Carpet · Perfect for IT Professionals & Families' }
  ],

  amenities: [
    { icon: <Dumbbell size={18} />, label: 'Modern Fitness Gymnasium' },
    { icon: <Coffee size={18} />, label: 'Community Clubhouse & Hall' },
    { icon: <Trees size={18} />, label: 'Landscaped Green Podiums' },
    { icon: <Lock size={18} />, label: '24x7 Multi-Tier Security & CCTV' },
    { icon: <Users size={18} />, label: 'Children Play & Adventure Area' },
    { icon: <Car size={18} />, label: 'Dedicated Covered Parking' },
    { icon: <Zap size={18} />, label: 'EV Charging Provisions' },
    { icon: <Star size={18} />, label: 'Jogging & Walking Track' },
    { icon: <Home size={18} />, label: 'Senior Citizens Sit-Out Deck' },
    { icon: <Building2 size={18} />, label: 'High-Speed Elevators with DG Backup' }
  ],

  nearbyIt: [
    { name: 'Wipro Circle (Phase 1)', distance: '~800 m', time: '2 mins' },
    { name: 'Infosys Phase 1', distance: '~1.2 km', time: '3 mins' },
    { name: 'Cognizant Phase 1', distance: '~1.5 km', time: '4 mins' },
    { name: 'TCS Sahyadri Park', distance: '~2.2 km', time: '6 mins' }
  ],

  nearbyLifestyle: [
    { label: 'Hinjewadi Metro Line 3', value: '~900 m (under testing)' },
    { label: 'Grand Highstreet Mall', value: '~1.0 km' },
    { label: 'Ruby Hall Clinic Hinjewadi', value: '2.0 km' },
    { label: 'Blue Ridge Public School', value: '1.8 km' },
    { label: 'Mumbai-Pune Expressway', value: '5.5 km' }
  ],

  faqs: [
    {
      q: 'What is the exact carpet area of the 2 BHK in VJ YashOne?',
      a: 'The 2 BHK residence in VJ YashOne Hinjewadi Phase 1 features an exact RERA carpet area of 678 sq.ft, offering optimized space efficiency with zero wastage, large living room, attached sit-out balcony, and comfortable master bedroom.'
    },
    {
      q: 'Who is the developer of YashOne Hinjewadi?',
      a: 'YashOne is developed by Vilas Javdekar Developers (VJ), one of Pune\'s most trusted and celebrated builders with over 40 years of architectural excellence, renowned for timely delivery and customer-centric quality.'
    },
    {
      q: 'Where is VJ YashOne located?',
      a: 'VJ YashOne is situated right in the heart of Hinjewadi Phase 1, near Wipro Circle and Rajiv Gandhi Infotech Park. It offers unparalleled walkability and commute convenience to major IT majors like Infosys, Wipro, and Cognizant.'
    },
    {
      q: 'What is the MahaRERA registration number for VJ YashOne?',
      a: 'VJ YashOne Hinjewadi is fully registered with MahaRERA under Registration Number: P52100021676. All titles and documentations are 100% verified by 24K Realtors legal desk.'
    },
    {
      q: 'How can I schedule a private visit to inspect the flat?',
      a: 'You can contact 24K Realtors at +91 96730 00053 or click "Book Private Site Visit". Our Hinjewadi Phase 1 specialist team will arrange a guided on-site walkthrough of the actual flat and amenities.'
    }
  ]
};

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function YashOneProjectPage({ onBackHome }) {
  const navigate = useNavigate();
  const p = YASHONE_DATA;

  const [openFaq, setOpenFaq] = useState(null);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  // SEO
  useSEO({
    title: 'VJ YashOne Hinjewadi Phase 1 | 678 Carpet 2 BHK | 24K Realtors',
    description: 'Vilas Javdekar YashOne Hinjewadi Phase 1. 2 BHK Premium Residences with 678 sq.ft carpet area. Verified authentic interior photos, RERA P52100021676, live pricing & site visits.',
    canonical: 'https://24krealtors.in/vj-yashone-hinjewadi'
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

  const handleResetZoom = (e) => {
    e?.stopPropagation?.();
    resetZoom();
  };

  const handleWheel = (e) => {
    if (lightboxIdx === null) return;
    if (e.deltaY < 0) {
      setZoomLevel(prev => Math.min(Number((prev + 0.25).toFixed(2)), 3.5));
    } else {
      setZoomLevel(prev => {
        const next = Math.max(Number((prev - 0.25).toFixed(2)), 1);
        if (next === 1) setPanPosition({ x: 0, y: 0 });
        return next;
      });
    }
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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (zoomLevel > 1) {
      resetZoom();
    } else {
      setZoomLevel(2);
    }
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === '+' || e.key === '=') {
        setZoomLevel(prev => Math.min(Number((prev + 0.5).toFixed(1)), 3.5));
      }
      if (e.key === '-' || e.key === '_') {
        setZoomLevel(prev => {
          const next = Math.max(Number((prev - 0.5).toFixed(1)), 1);
          if (next === 1) setPanPosition({ x: 0, y: 0 });
          return next;
        });
      }
      if (e.key === '0') {
        resetZoom();
      }
      if (e.key === 'ArrowRight' && p.gallery) {
        setLightboxIdx(prev => (prev + 1) % p.gallery.length);
      }
      if (e.key === 'ArrowLeft' && p.gallery) {
        setLightboxIdx(prev => (prev - 1 + p.gallery.length) % p.gallery.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIdx, p.gallery]);

  useEffect(() => {
    if (lightboxIdx !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [lightboxIdx]);

  const handleWhatsApp = () => {
    window.open(`https://wa.me/919673000053?text=${encodeURIComponent(p.whatsappText)}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+919673000053';
  };

  const handleSiteVisit = () => {
    const text = `Hi 24K Realtors, I would like to schedule a private site visit for VJ YashOne (678 sq.ft) in Hinjewadi Phase 1.`;
    window.open(`https://wa.me/919673000053?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleBack = () => {
    if (onBackHome) onBackHome();
    else navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#040814', color: '#fff', fontFamily: "'Inter', 'Segoe UI', sans-serif", overflowX: 'hidden' }}>
      
      {/* ── Background Glow Blobs ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(197,155,39,0.12) 0%, transparent 70%)', filter: 'blur(50px)', animation: 'blobFloat 14s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(230,195,92,0.08) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'blobFloat 18s ease-in-out infinite reverse' }} />
        <style>{`
          @keyframes blobFloat { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(3%,3%) scale(1.04); } }
          @keyframes fadeInUp { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
          @media (max-width: 768px) {
            .mobile-subpage-cta-bar { display: flex !important; }
            .desktop-call-pill { display: none !important; }
          }
        `}</style>
      </div>

      {/* ── STICKY TOPBAR ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(4,8,20,0.92)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${p.accentColor}35`, padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <CompanyLogo variant="compact" />
          <span style={{ fontSize: '0.78rem', fontFamily: "'Cinzel', serif", color: '#D4AF37', letterSpacing: '0.06em', fontWeight: 700, textTransform: 'uppercase' }}>
            ⚜️ 24K Realtors
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={handleBack} style={{ background: 'transparent', border: `1px solid ${p.accentColor}60`, color: '#CBD5E1', padding: '7px 16px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <a href="tel:+919673000053" className="desktop-call-pill" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.3)', padding: '7px 14px', borderRadius: '30px', color: '#FFF4D0', fontSize: '0.78rem', fontWeight: 600 }}>
            <Phone size={12} color="#E6C35C" />
            <span>+91 96730 00053</span>
          </a>
          <button onClick={handleWhatsApp} style={{ background: p.accentGradient, border: 'none', color: '#040814', padding: '7px 18px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 800, letterSpacing: '0.03em' }}>
            Get Price &amp; Units
          </button>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section ref={heroRef} style={{ position: 'relative', zIndex: 1, padding: '70px 24px 50px', maxWidth: '1100px', margin: '0 auto', animation: 'fadeInUp 0.7s ease both' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#64748B', marginBottom: '24px' }}>
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#94A3B8' }}>Home</span>
          <span>›</span>
          <span onClick={() => navigate('/#listings-anchor')} style={{ cursor: 'pointer', color: '#94A3B8' }}>Properties</span>
          <span>›</span>
          <span style={{ color: '#D4AF37' }}>{p.name}</span>
        </div>

        {/* MahaRERA Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(197,155,39,0.18)', border: '1px solid rgba(212,175,55,0.5)', borderRadius: '20px', padding: '6px 16px', marginBottom: '20px' }}>
          <ShieldCheck size={14} style={{ color: '#E6C35C' }} />
          <span style={{ fontSize: '0.72rem', color: '#F3E5AB', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            MahaRERA: {p.rera} · Verified Landmark Residence
          </span>
        </div>

        {/* Hero Title */}
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '16px', background: 'linear-gradient(135deg, #FFFFFF 0%, #F3E5AB 50%, #D4AF37 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {p.fullName}
        </h1>

        <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: '#F3E5AB', fontWeight: 500, marginBottom: '10px', lineHeight: 1.6 }}>
          {p.tagline}
        </p>
        <p style={{ fontSize: '0.92rem', color: '#94A3B8', marginBottom: '32px', maxWidth: '780px' }}>
          {p.heroSubline}
        </p>

        {/* Key Stats Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '36px' }}>
          {[
            { icon: <MapPin size={14} />, label: 'Location', value: 'Hinjewadi Phase 1, Pune' },
            { icon: <Building2 size={14} />, label: 'Developer', value: 'Vilas Javdekar (VJ)' },
            { icon: <Home size={14} />, label: 'Carpet Area', value: '678 sq.ft (2 BHK)' },
            { icon: <Clock size={14} />, label: 'Status', value: 'Ready to Move' },
            { icon: <Award size={14} />, label: 'Investment Score', value: `${p.investmentScore}/100` },
            { icon: <CheckCircle2 size={14} />, label: 'Title Status', value: 'Clear & Verified' },
          ].map((stat, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px', minWidth: '180px' }}>
              <span style={{ color: '#D4AF37' }}>{stat.icon}</span>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{stat.label}</div>
                <div style={{ fontSize: '0.88rem', color: '#E2E8F0', fontWeight: 600, marginTop: '2px' }}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
          <button id="btn-whatsapp-hero" onClick={handleWhatsApp} style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', border: 'none', color: '#fff', padding: '14px 28px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 20px rgba(37,211,102,0.3)', transition: 'transform 0.2s', letterSpacing: '0.02em' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <MessageSquare size={18} /> WhatsApp — Get Price
          </button>
          <button id="btn-call-hero" onClick={handleCall} style={{ background: 'transparent', border: `2px solid ${p.accentColor}`, color: '#fff', padding: '14px 28px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = `${p.accentColor}20`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <Phone size={18} /> +91 96730 00053
          </button>
          <button id="btn-site-visit-hero" onClick={handleSiteVisit} style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.4)', color: '#D4AF37', padding: '14px 28px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,175,55,0.12)'}>
            <Car size={18} /> Book Private Site Visit
          </button>
        </div>
      </section>

      {/* ── UNIQUE FEATURES STRIP ── */}
      <section style={{ position: 'relative', zIndex: 1, background: 'rgba(197,155,39,0.12)', borderTop: '1px solid rgba(212,175,55,0.3)', borderBottom: '1px solid rgba(212,175,55,0.3)', padding: '22px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: '8px' }}>
            Project Highlights →
          </span>
          {p.uniqueFeatures.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '20px', padding: '7px 16px' }}>
              <CheckCircle2 size={14} style={{ color: '#E6C35C', flexShrink: 0 }} />
              <span style={{ fontSize: '0.82rem', color: '#E2E8F0', fontWeight: 500 }}>{f}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── VERIFIED INTERIOR & SPACES GALLERY (WITH LIGHTBOX) ── */}
      {p.gallery && p.gallery.length > 0 && (
        <section style={{ position: 'relative', zIndex: 1, padding: '60px 24px 20px', maxWidth: '1100px', margin: '0 auto' }}>
          {/* Section Heading */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '20px', padding: '5px 16px', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.7rem', color: '#F3E5AB', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                ✨ Verified Visual Tour · {p.gallery.length} Official Creatives
              </span>
            </div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 700, color: '#F3E5AB', marginBottom: '8px' }}>
              Explore VJ YashOne Residences
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', maxWidth: '580px', margin: '0 auto' }}>
              Authentic marketing creatives for VJ YashOne Hinjewadi Phase 1. Click any photo to open full-screen view.
            </p>
          </div>

          {/* Room Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
            {p.gallery.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveGalleryIdx(idx)}
                style={{
                  background: activeGalleryIdx === idx ? p.accentGradient : 'rgba(255,255,255,0.04)',
                  color: activeGalleryIdx === idx ? '#040814' : '#CBD5E1',
                  border: activeGalleryIdx === idx ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '30px',
                  padding: '8px 18px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  boxShadow: activeGalleryIdx === idx ? '0 4px 16px rgba(212,175,55,0.35)' : 'none'
                }}
              >
                <span>{item.icon}</span>
                <span>{item.roomName}</span>
              </button>
            ))}
          </div>

          {/* Active Creative Showcase Card */}
          {(() => {
            const cur = p.gallery[activeGalleryIdx] || p.gallery[0];
            return (
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              }}>
                {/* Visual Image with Zoom Overlay */}
                <div 
                  onClick={() => setLightboxIdx(activeGalleryIdx)}
                  style={{ position: 'relative', minHeight: '360px', background: '#020610', cursor: 'pointer', overflow: 'hidden' }}
                  title="Click to view full image in Lightbox"
                >
                  <img 
                    src={cur.src} 
                    alt={cur.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    background: 'rgba(4, 8, 20, 0.88)',
                    border: '1px solid #D4AF37',
                    borderRadius: '20px',
                    padding: '5px 12px',
                    fontSize: '0.68rem',
                    color: '#F3E5AB',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    backdropFilter: 'blur(8px)'
                  }}>
                    ✨ 24K VERIFIED · {cur.tag}
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setLightboxIdx(activeGalleryIdx); }}
                    style={{
                      position: 'absolute',
                      bottom: '14px',
                      right: '14px',
                      background: 'rgba(4, 8, 20, 0.85)',
                      border: '1px solid rgba(212,175,55,0.6)',
                      color: '#F3E5AB',
                      borderRadius: '8px',
                      padding: '6px 14px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      backdropFilter: 'blur(6px)'
                    }}
                  >
                    <Maximize2 size={13} /> View Fullscreen
                  </button>
                </div>

                {/* Feature Breakdown & Direct Action */}
                <div style={{ padding: '36px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Photo {activeGalleryIdx + 1} of {p.gallery.length} · {cur.tag}
                  </div>
                  <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', color: '#fff', marginBottom: '10px', fontWeight: 700, lineHeight: 1.25 }}>
                    {cur.title}
                  </h3>
                  <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '22px' }}>
                    {cur.subtitle}
                  </p>

                  {/* Feature 4-grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                    {cur.features.map((feat, idx) => (
                      <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 12px' }}>
                        <div style={{ fontSize: '1.1rem', marginBottom: '3px' }}>{feat.icon}</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#E2E8F0', marginBottom: '2px' }}>{feat.title}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748B', lineHeight: 1.3 }}>{feat.desc}</div>
                      </div>
                    ))}
                  </div>

                  {/* Direct Actions */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={() => setLightboxIdx(activeGalleryIdx)} style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid #D4AF37', color: '#F3E5AB', borderRadius: '8px', padding: '12px 16px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Maximize2 size={14} /> Fullscreen
                    </button>
                    <button onClick={handleSiteVisit} style={{ flex: 1, background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)', color: '#040814', border: 'none', borderRadius: '8px', padding: '12px 18px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <Car size={15} /> Book Site Visit →
                    </button>
                    <button onClick={handleWhatsApp} style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '12px 14px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MessageSquare size={15} /> Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Filmstrip / Thumbnail Row below */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginTop: '20px' }}>
            {p.gallery.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setActiveGalleryIdx(idx)}
                style={{
                  background: activeGalleryIdx === idx ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.03)',
                  border: activeGalleryIdx === idx ? '2px solid #D4AF37' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: activeGalleryIdx === idx ? '0 4px 20px rgba(212,175,55,0.3)' : 'none',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ height: '90px', background: '#020610', overflow: 'hidden', position: 'relative' }}>
                  <img src={item.src} alt={item.tag} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {activeGalleryIdx === idx && (
                    <div style={{ position: 'absolute', top: '6px', right: '6px', background: '#D4AF37', color: '#040814', fontSize: '0.6rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                      ACTIVE
                    </div>
                  )}
                </div>
                <div style={{ padding: '8px 10px', fontSize: '0.75rem', fontWeight: 600, color: activeGalleryIdx === idx ? '#F3E5AB' : '#94A3B8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>{item.icon}</span>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── APARTMENT CONFIGURATIONS ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '70px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 700, color: '#F3E5AB', marginBottom: '12px' }}>
            Apartment Configuration &amp; Carpet Details
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto' }}>
            RERA-verified carpet areas for VJ YashOne. MahaRERA: {p.rera}.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {p.configurations.map((c, i) => (
            <div 
              key={i} 
              style={{ 
                position: 'relative', 
                maxWidth: '420px',
                width: '100%',
                background: 'linear-gradient(135deg, rgba(212,175,55,0.22), rgba(212,175,55,0.06))', 
                border: '1px solid #D4AF37', 
                borderRadius: '16px', 
                padding: '36px 32px', 
                textAlign: 'center', 
                transition: 'transform 0.2s, box-shadow 0.2s', 
                cursor: 'default' 
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(212,175,55,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(90deg, #D4AF37, #F3E5AB)', color: '#1a1a1a', fontSize: '0.65rem', fontWeight: 800, padding: '3px 14px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Featured 2 BHK Listing
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#F3E5AB', fontFamily: "'Cinzel', serif", lineHeight: 1, marginBottom: '8px' }}>{c.bhk}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#D4AF37', marginBottom: '8px' }}>{c.carpet} Carpet</div>
              <div style={{ fontSize: '0.88rem', color: '#4ADE80', fontWeight: 700, marginBottom: '12px' }}>{c.price}</div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginBottom: '24px', lineHeight: 1.5 }}>{c.note}</div>
              <button onClick={handleWhatsApp} style={{ width: '100%', background: p.accentGradient, border: 'none', color: '#040814', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer' }}>
                Get Live Inventory &amp; Quote →
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '28px', padding: '16px', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '10px', fontSize: '0.8rem', color: '#D4AF37' }}>
          ℹ️ Carpet area of 678 sq.ft is certified under MahaRERA Registration <strong>{p.rera}</strong>. Resale and direct pricing are available on immediate request.
        </div>
      </section>

      {/* ── AMENITIES ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '70px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, color: '#F3E5AB', marginBottom: '12px', textAlign: 'center' }}>
            Lifestyle Amenities
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', textAlign: 'center', marginBottom: '48px' }}>
            VJ YashOne — Hinjewadi Phase 1, Pune
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {p.amenities.map((a, i) => (
              <div 
                key={i} 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px 18px', transition: 'border-color 0.2s, background 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${p.accentColor}80`; e.currentTarget.style.background = `${p.accentColor}15`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              >
                <span style={{ color: '#D4AF37', flexShrink: 0 }}>{a.icon}</span>
                <span style={{ fontSize: '0.85rem', color: '#CBD5E1', fontWeight: 500 }}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCATION & CONNECTIVITY ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '70px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, color: '#F3E5AB', marginBottom: '12px', textAlign: 'center' }}>
          Prime Hinjewadi Phase 1 Connectivity
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem', textAlign: 'center', marginBottom: '48px' }}>
          Heart of Rajiv Gandhi Infotech Park, Hinjewadi Phase 1, Pune — 411057
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {/* IT Parks */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px' }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1rem', color: '#D4AF37', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building2 size={16} /> IT &amp; Tech Parks Proximity
            </h3>
            {p.nearbyIt.map((it, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < p.nearbyIt.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <span style={{ fontSize: '0.88rem', color: '#CBD5E1', fontWeight: 500 }}>{it.name}</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#4ade80', fontWeight: 600 }}>{it.time}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{it.distance}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Lifestyle */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px' }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1rem', color: '#D4AF37', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={16} /> Civic &amp; Commute Infrastructure
            </h3>
            {p.nearbyLifestyle.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < p.nearbyLifestyle.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <span style={{ fontSize: '0.88rem', color: '#CBD5E1', fontWeight: 500 }}>{item.label}</span>
                <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEVELOPER CREDENTIALS ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 70px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          borderRadius: '20px',
          padding: '36px 40px',
          background: 'linear-gradient(135deg, rgba(197,155,39,0.12) 0%, rgba(212,175,55,0.06) 100%)',
          border: '1px solid rgba(212,175,55,0.25)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
              Master Developer
            </div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: '1.45rem', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>
              Vilas Javdekar Developers (VJ)
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.6, maxWidth: '580px' }}>
              Synonymous with trust, transparency, and architectural innovation across Pune for over 4 decades. Vilas Javdekar's YashOne brand brings smart urban living with unmatched build quality in Hinjewadi Phase 1.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['40+ Years Legacy', 'Pranay & Trust', 'On-Time Delivery'].map(tag => (
                <span key={tag} style={{
                  fontSize: '0.72rem', padding: '6px 14px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                  color: '#CBD5E1', fontWeight: 600
                }}>{tag}</span>
              ))}
            </div>
            <button
              onClick={handleSiteVisit}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                fontSize: '0.84rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)',
                color: '#040814',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              <Sparkles size={15} />
              <span>Schedule Flat Inspection</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '70px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, color: '#F3E5AB', marginBottom: '12px', textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', textAlign: 'center', marginBottom: '48px' }}>
            VJ YashOne — 2 BHK (678 Carpet) — Hinjewadi Phase 1
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {p.faqs.map((faq, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${openFaq === i ? p.accentColor + '70' : 'rgba(255,255,255,0.08)'}`, borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                <button id={`faq-btn-${i}`} onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', background: 'transparent', border: 'none', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left', gap: '16px' }}>
                  <span style={{ fontSize: '0.92rem', color: '#E2E8F0', fontWeight: 600, lineHeight: 1.5 }}>{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} style={{ color: p.accentColor, flexShrink: 0 }} /> : <ChevronDown size={18} style={{ color: '#64748B', flexShrink: 0 }} />}
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 24px 20px', fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.7, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA SECTION ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⚜️</div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 700, color: '#F3E5AB', marginBottom: '12px' }}>
            Ready to Explore VJ YashOne?
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '36px' }}>
            Connect with 24K Realtors for verified resale pricing, floor plan details, and a complimentary private site inspection for VJ YashOne (678 sq.ft 2 BHK) in Hinjewadi Phase 1.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button id="btn-whatsapp-cta" onClick={handleWhatsApp} style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', border: 'none', color: '#fff', padding: '16px 36px', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 24px rgba(37,211,102,0.3)' }}>
              <MessageSquare size={18} /> WhatsApp Now
            </button>
            <button id="btn-call-cta" onClick={handleCall} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', color: '#E2E8F0', padding: '16px 36px', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={18} /> Call Advisory Desk
            </button>
          </div>
          <p style={{ marginTop: '24px', fontSize: '0.78rem', color: '#475569' }}>
            24K Realtors · MahaRERA Advisory License: A051262603190 · Hinjewadi, Pune
          </p>
        </div>
      </section>

      {/* ── FULLSCREEN LIGHTBOX MODAL WITH ZOOM & PAN ── */}
      {lightboxIdx !== null && p.gallery && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(2, 6, 16, 0.96)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '16px 20px',
            animation: 'fadeInUp 0.25s ease both'
          }}
          onClick={() => setLightboxIdx(null)}
        >
          {/* Top Bar */}
          <div 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid rgba(212,175,55,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.2rem' }}>{p.gallery[lightboxIdx]?.icon}</span>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F3E5AB', fontFamily: "'Cinzel', serif" }}>
                  {p.gallery[lightboxIdx]?.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  {p.name} · Verified 24K Realtors Creative
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Zoom Controls */}
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  background: 'rgba(255,255,255,0.06)', 
                  border: '1px solid rgba(212,175,55,0.3)', 
                  borderRadius: '30px', 
                  padding: '3px 8px' 
                }}
              >
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 1}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: zoomLevel <= 1 ? 'rgba(255,255,255,0.25)' : '#F3E5AB',
                    cursor: zoomLevel <= 1 ? 'not-allowed' : 'pointer',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%'
                  }}
                  title="Zoom Out (-)"
                >
                  <ZoomOut size={14} />
                </button>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F3E5AB', minWidth: '40px', textAlign: 'center' }}>
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 3.5}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: zoomLevel >= 3.5 ? 'rgba(255,255,255,0.25)' : '#F3E5AB',
                    cursor: zoomLevel >= 3.5 ? 'not-allowed' : 'pointer',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%'
                  }}
                  title="Zoom In (+)"
                >
                  <ZoomIn size={14} />
                </button>
                {zoomLevel > 1 && (
                  <button
                    onClick={handleResetZoom}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#E6C35C',
                      cursor: 'pointer',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%'
                    }}
                    title="Reset Zoom (0)"
                  >
                    <RotateCcw size={13} />
                  </button>
                )}
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setLightboxIdx(null)}
                style={{ 
                  background: 'rgba(255,255,255,0.08)', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  color: '#fff', 
                  width: '36px', 
                  height: '36px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer' 
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Main Visual Image Area */}
          <div 
            style={{ 
              flex: 1, 
              position: 'relative', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              overflow: 'hidden', 
              padding: '12px 0',
              cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={handleDoubleClick}
          >
            {/* Prev Arrow */}
            <button 
              onClick={(e) => { e.stopPropagation(); setLightboxIdx(prev => (prev - 1 + p.gallery.length) % p.gallery.length); }}
              style={{ position: 'absolute', left: '16px', zIndex: 10, background: 'rgba(4,8,20,0.7)', border: '1px solid rgba(212,175,55,0.4)', color: '#F3E5AB', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)' }}
            >
              <ChevronLeft size={22} />
            </button>

            <img 
              src={p.gallery[lightboxIdx]?.src} 
              alt={p.gallery[lightboxIdx]?.title}
              draggable={false}
              style={{ 
                maxWidth: '90vw', 
                maxHeight: '75vh', 
                objectFit: 'contain', 
                borderRadius: '8px', 
                boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                userSelect: 'none',
                pointerEvents: 'auto'
              }}
            />

            {/* Next Arrow */}
            <button 
              onClick={(e) => { e.stopPropagation(); setLightboxIdx(prev => (prev + 1) % p.gallery.length); }}
              style={{ position: 'absolute', right: '16px', zIndex: 10, background: 'rgba(4,8,20,0.7)', border: '1px solid rgba(212,175,55,0.4)', color: '#F3E5AB', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)' }}
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Bottom Thumbnails */}
          <div 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', overflowX: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            {p.gallery.map((g, idx) => (
              <button
                key={g.id}
                onClick={() => setLightboxIdx(idx)}
                style={{
                  width: '56px',
                  height: '42px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  padding: 0,
                  border: lightboxIdx === idx ? '2px solid #D4AF37' : '1px solid rgba(255,255,255,0.15)',
                  cursor: 'pointer',
                  opacity: lightboxIdx === idx ? 1 : 0.6,
                  transition: 'all 0.2s',
                  background: '#020610'
                }}
              >
                <img src={g.src} alt={g.tag} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Mobile Floating Action Bar ── */}
      <div className="mobile-subpage-cta-bar" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 99,
        background: 'rgba(4, 8, 20, 0.96)',
        backdropFilter: 'blur(16px)',
        borderTop: `1px solid ${p.accentColor}50`,
        padding: '10px 16px',
        display: 'none',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 -10px 25px rgba(0,0,0,0.7)'
      }}>
        <a
          href="tel:+919673000053"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.18)',
            color: '#fff',
            textDecoration: 'none',
            padding: '11px 0',
            borderRadius: '8px',
            fontSize: '0.84rem',
            fontWeight: 600
          }}
        >
          <Phone size={14} color="#D4AF37" /> Call Advisor
        </a>
        <button
          onClick={handleWhatsApp}
          style={{
            flex: 1.3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #25D366, #128C7E)',
            border: 'none',
            color: '#fff',
            padding: '11px 0',
            borderRadius: '8px',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(37,211,102,0.3)'
          }}
        >
          <MessageSquare size={14} /> WhatsApp Price
        </button>
      </div>
    </div>
  );
}
