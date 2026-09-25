/**
 * MegapolisSparkletProjectPage.jsx — 24K Realtors
 * ─────────────────────────────────────────────────────────────────────────────
 * Ultra-Luxury Flagship Project Subpage for Megapolis Sparklet,
 * Hinjewadi Phase 3, Pune.
 *
 * Project Specifications:
 *  - Project Name: Megapolis Sparklet (also known as Spaklet)
 *  - Developer: Pegasus Properties (Megapolis Township)
 *  - Location: Hinjawadi Phase 3, Rajiv Gandhi Infotech Park, Pune — 411057
 *  - Status: Ready-to-Move (Occupancy Certificates Received)
 *  - Dual MahaRERA Registration:
 *      • Megapolis Sparklet: A51800000454 (Registered & Title Clear)
 *      • Megapolis Sparklet (Phases / Listings): P52100078240
 *  - Configurations & Exact Usable Carpet Areas:
 *      • 1 BHK Units: Approximately 450 sq. ft. – 480 sq. ft. usable carpet area
 *      • 2 BHK Units: Ranging from 680 sq. ft. – 760 sq. ft. usable carpet area
 *  - Integrated Township Amenities (Same as Megapolis):
 *      • Olympic Size Swimming Pool & Kids Pool
 *      • High-Tech Gymnasium & Clubhouse
 *      • Tennis Courts, Jogging Track & Cricket Nets
 *      • Pawar Public School within 142-acre Township campus
 *      • 24x7 Multi-Tier Security, CCTV Surveillance & 100% DG Power Backup
 *  - 100% Authentic On-Site Photos (5 Verified Views):
 *      • Panoramic Balcony View with Terracotta Tile Flooring, Glass & Steel Railing overlooking towers & pool
 *      • Expansive Living & Dining Lounge with Dual Ceiling Fans & Multi-Track Sliding Balcony Door
 *      • Sunlit Master Bedroom with Safety Grill Window & Township Vista
 *      • Fitted Kitchen with Jet-Black Granite Counter, Stainless Steel Sink & Utility Space
 *      • Modern Bathroom with Water Geyser, Shower, Sanitary Ware & Anti-Skid Tiling
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, ShieldCheck, Phone, MessageSquare, ArrowLeft,
  CheckCircle2, Star, Clock, Zap, Car, Dumbbell, Trees,
  Lock, Home, IndianRupee, ChevronDown, ChevronUp,
  Building2, Award, X, ChevronLeft, ChevronRight, Maximize2,
  ZoomIn, ZoomOut, RotateCcw, Sparkles, Trophy, Activity, Waves,
  Check, ExternalLink, HelpCircle, Layers, Compass, Eye, Shield,
  Copy, ArrowRight, Share2, Calendar
} from 'lucide-react';
import { useSEO } from '../services/seoService';
import CompanyLogo from './CompanyLogo';

/* ══════════════════════════════════════════════════════════════════
   MEGAPOLIS SPARKLET PROJECT DATA SPECIFICATION
══════════════════════════════════════════════════════════════════ */
const SPARKLET_DATA = {
  key: 'megapolis-sparklet',
  name: 'Megapolis Sparklet',
  shortName: 'Sparklet',
  developer: 'Pegasus Properties (Megapolis)',
  reraNumbers: [
    {
      number: 'A51800000454',
      label: 'Megapolis Sparklet Phase 1',
      type: 'Residential / Group Housing',
      status: 'Registered & Clear Title (OC Received)'
    },
    {
      number: 'P52100078240',
      label: 'Megapolis Sparklet Extended Phases',
      type: 'Residential / Group Housing',
      status: 'MahaRERA Registered'
    }
  ],
  reraSummary: 'A51800000454 · P52100078240',
  location: 'Hinjawadi Phase 3, Rajiv Gandhi Infotech Park, Pune — 411057',
  status: 'Ready-to-Move',
  tagline: 'Scenic Living. Ready 1 & 2 BHK Residences with Township Privileges',
  heroSubline: 'A premier residential cluster nestled inside the landmark 142-acre Megapolis Smart Township. Offering spacious 1 BHK (450–480 sq.ft) and 2 BHK (680–760 sq.ft) homes with panoramic balcony vistas, dual MahaRERA assurance, Olympic-grade amenities, and minutes from Tech Mahindra, TCS & Metro Line 3.',
  accentColor: '#06B6D4',
  accentGradient: 'linear-gradient(135deg, #0284C7 0%, #06B6D4 50%, #10B981 100%)',
  heroBg: 'linear-gradient(160deg, #040814 0%, #041b24 45%, #020b14 100%)',
  showcaseImage: '/megapolis_sparklet_balcony.jpg',
  investmentScore: 98,
  priceNegotiable: true,
  whatsappText: 'Hi 24K Realtors, I am interested in Megapolis Sparklet Hinjewadi Phase 3 (Ready 1 BHK 450-480 sq.ft / 2 BHK 680-760 sq.ft - Price Negotiable). Please share floor plans, pricing breakup, and schedule a private site visit.',

  gallery: [
    {
      id: 1,
      tag: 'Panoramic Balcony Vista',
      icon: '🌅',
      roomName: 'Balcony View',
      title: 'Panoramic Balcony — Terracotta Tiles & Tower Vista',
      subtitle: 'Spacious curved private balcony with warm terracotta anti-skid tiling, heavy-duty stainless steel & safety glass railing, overlooking Megapolis high-rise towers, landscaped courtyard, and Olympic swimming pool.',
      src: '/megapolis_sparklet_balcony.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '🏖️', title: 'Curved Balcony with Terracotta Flooring', desc: 'Premium weather-proof terracotta tile terrace with expansive panoramic views' },
        { icon: '🛡️', title: 'Toughened Glass & Steel Railing', desc: 'Secure architectural glass railing offering uninterrupted sightlines of the township' },
        { icon: '🏊', title: 'Courtyard & Pool Vista', desc: 'Direct visual connection to central gardens and Megapolis recreational facilities' }
      ]
    },
    {
      id: 2,
      tag: 'Living & Dining Lounge',
      icon: '🛋️',
      roomName: 'Living Hall',
      title: 'Expansive Living & Dining Hall — Sunlight & Airflow',
      subtitle: 'Extra-wide reception hall with glossy vitrified flooring, dual high-speed ceiling fans, and floor-to-ceiling multi-track sliding glass doors that open wide to the balcony.',
      src: '/megapolis_sparklet_living.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '☀️', title: 'Abundant Natural Daylight', desc: 'Dual-aspect illumination with sliding balcony doors plus side ventilation window' },
        { icon: '💨', title: 'Dual Ceiling Fan Setup', desc: 'High ceilings with twin fan points ensuring consistent cross-breeze throughout the lounge' },
        { icon: '✨', title: 'Vitrified Mirror Finish Tile Flooring', desc: 'Seamless high-grade tiles reflecting ample light and creating a grand open feel' }
      ]
    },
    {
      id: 3,
      tag: 'Master Bedroom Retreat',
      icon: '🛏️',
      roomName: 'Master Bedroom',
      title: 'Sunlit Master Bedroom — Quiet & Restful Sanctuary',
      subtitle: 'Generously proportioned bedroom with large exterior window fitted with safety grill, smooth finished walls, premium vitrified tile flooring, and unobstructed tower views.',
      src: '/megapolis_sparklet_bedroom.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '🪟', title: 'Large Safety Grilled Window', desc: 'Full-sized window ensuring serene daylight and pleasant hillside breezes' },
        { icon: '📐', title: 'Optimal Spatial Efficiency', desc: 'Square floor plan allowing king-sized bed, three-door wardrobe, and study desk' },
        { icon: '🔌', title: 'Concealed Electrical Points', desc: 'Dedicated AC provision, bedside charging sockets, and TV cable points' }
      ]
    },
    {
      id: 4,
      tag: 'Granite Platform Kitchen',
      icon: '🍳',
      roomName: 'Kitchen Space',
      title: 'Spacious Kitchen — Black Granite Counter & Utility',
      subtitle: 'Well-appointed kitchen featuring a wide polished jet-black granite countertop, stainless steel sink with swivel tap, wall-tiled dado backsplash, and dedicated electrical points for water purifier and appliances.',
      src: '/megapolis_sparklet_kitchen.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '🖤', title: 'Polished Black Granite Counter', desc: 'Durable, heat-resistant natural granite slab designed for heavy Indian cooking' },
        { icon: '🚰', title: 'Stainless Steel Sink & Splash Tiles', desc: 'Easy-maintenance glossy ceramic wall dado protecting walls from cooking splashes' },
        { icon: '💨', title: 'Dedicated Ventilation Window', desc: 'Natural exhaust window providing fresh air exchange alongside chimney provision' }
      ]
    },
    {
      id: 5,
      tag: 'Modern Bathroom & Geyser',
      icon: '🚿',
      roomName: 'Bathroom',
      title: 'Fitted Bathroom — Water Geyser & Anti-Skid Tiles',
      subtitle: 'Complete functional bathroom fitted with an instant electric water heater geyser, chrome diverter shower, ceramic sanitary ware, anti-skid floor tiles, and frosted louvered window.',
      src: '/megapolis_sparklet_bathroom.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '⚡', title: 'Electric Water Geyser Installed', desc: 'Equipped with instant hot water geyser for immediate everyday convenience' },
        { icon: '🚿', title: 'Chrome Shower Diverter', desc: 'Branded CP fittings with smooth wall-mounted showerhead and dual taps' },
        { icon: '💨', title: 'Louvered Glass Ventilation Window', desc: 'High-level frosted glass louvers ensuring continuous privacy and natural airflow' }
      ]
    }
  ],

  configurations: [
    {
      type: '1 BHK Smart Residence',
      shortType: '1 BHK',
      carpet: '450 – 480 sq. ft.',
      carpetNote: 'Usable Carpet Area (High Efficiency Layout)',
      balcony: 'Attached Private Balcony with Township Views',
      bathrooms: '1 Dedicated Bathroom with Geyser',
      pricing: '₹48 Lakhs* (Price Negotiable)',
      status: 'Ready to Move (OC Received)',
      idealFor: 'IT Professionals, Young Couples, High Rental Yield Investors',
      highlightBadge: 'HIGH RENTAL DEMAND',
      specs: [
        { label: 'Living & Dining', val: 'Spacious with balcony sliding doors' },
        { label: 'Master Bedroom', val: 'Sunlit with tower vista window' },
        { label: 'Kitchen', val: 'Black granite platform with sink' },
        { label: 'Bathroom', val: 'Fitted geyser & anti-skid tiles' }
      ]
    },
    {
      type: '2 BHK Premium Family Home',
      shortType: '2 BHK',
      carpet: '680 – 760 sq. ft.',
      carpetNote: 'Usable Carpet Area (Spacious 2-Bedroom Plan)',
      balcony: 'Curved Terracotta Balcony + Utility Space',
      bathrooms: '2 Bathrooms (Master En-suite + Common)',
      pricing: '₹72 – 82 Lakhs* (Price Negotiable)',
      status: 'Ready to Move (OC Received)',
      idealFor: 'Growing Families, Hinjewadi Tech Executives, End-Users',
      highlightBadge: 'MOST POPULAR 2 BHK',
      specs: [
        { label: 'Living & Dining', val: 'Grand lounge with curved balcony vista' },
        { label: 'Bedrooms', val: '2 Well-proportioned private bedrooms' },
        { label: 'Kitchen & Utility', val: 'Granite counter + dedicated dry balcony' },
        { label: 'Bathrooms', val: '2 Full bathrooms with branded CP fittings' }
      ]
    }
  ],

  amenities: [
    {
      category: 'Megapolis Fitness & Aquatics',
      icon: '🏊',
      accent: '#06B6D4',
      items: [
        { name: 'Olympic-Sized Swimming Pool', desc: 'Championship-standard pool with dedicated kids shallow splash pool' },
        { name: 'High-Tech Gymnasium', desc: 'Modern cardio machines, free weights & strength training studio' },
        { name: 'Grand Mega-Clubhouse', desc: 'Multipurpose air-conditioned banquet hall for community celebrations' },
        { name: 'Aerobics & Yoga Deck', desc: 'Peaceful morning sunrise studio overlooking lush township greens' }
      ]
    },
    {
      category: 'Sports & Active Outdoors',
      icon: '🎾',
      accent: '#10B981',
      items: [
        { name: 'Floodlit Tennis Courts', desc: 'All-weather hard courts for evening and weekend matches' },
        { name: 'Cricket Practice Nets', desc: 'Enclosed turf practice nets with bowling crease' },
        { name: 'Scenic Jogging Track', desc: 'Dedicated vehicular-free running and walking tracks through podiums' },
        { name: 'Children Play Zone', desc: 'Safe rubberized play equipment, slides, swings and sandpit' }
      ]
    },
    {
      category: 'Township Infrastructure & Safety',
      icon: '🛡️',
      accent: '#D4AF37',
      items: [
        { name: '24x7 Multi-Tier Security', desc: 'Boom barriers, RFID boom gates, security personnel and CCTV grid' },
        { name: '100% DG Power Backup', desc: 'Complete backup for automatic elevators, water pumps & common lights' },
        { name: 'Pawar Public School on Campus', desc: 'ICSE curriculum school located within Megapolis gates (~300m)' },
        { name: 'High-Street Retail & Daily Needs', desc: 'Supermarkets, pharmacies, clinics, salons & cafes inside township' }
      ]
    }
  ],

  commuteMatrix: [
    { destination: 'Tech Mahindra Hinjewadi Phase 3', distance: '1.2 km', time: '3 mins' },
    { destination: 'TCS Sahyadri Park Phase 3', distance: '1.4 km', time: '4 mins' },
    { destination: 'Infosys Hinjewadi Phase 3', distance: '1.8 km', time: '5 mins' },
    { destination: 'Cognizant / Wipro Tech Campus', distance: '2.5 km', time: '6 mins' },
    { destination: 'Pune Metro Line 3 (Megapolis Circle)', distance: '500 m', time: '2 mins walk' },
    { destination: 'Pawar Public School Hinjewadi', distance: '300 m', time: 'Inside Township' },
    { destination: 'Mumbai-Pune Expressway (Wakad Bypass)', distance: '8.5 km', time: '14 mins' }
  ],

  faqs: [
    {
      q: 'What is the MahaRERA registration number for Megapolis Sparklet?',
      a: 'Megapolis Sparklet is registered with MahaRERA under registration numbers A51800000454 and P52100078240. Both registrations ensure clear land titles, verified approvals, and legally transparent ownership.'
    },
    {
      q: 'What are the exact carpet areas of 1 BHK and 2 BHK flats in Megapolis Sparklet?',
      a: '1 BHK apartments offer approximately 450 to 480 sq. ft. of usable carpet area, designed with maximum spatial efficiency. 2 BHK apartments range from 680 to 760 sq. ft. of usable carpet area with spacious living rooms, curved balconies, and dual bathrooms.'
    },
    {
      q: 'Are the apartments in Megapolis Sparklet ready-to-move?',
      a: 'Yes, Megapolis Sparklet has received its Occupancy Certificates (OC). Apartments are ready for immediate handover and possession with active water, power, and elevator connections.'
    },
    {
      q: 'What amenities are available to Sparklet residents?',
      a: 'Sparklet residents enjoy the full spectrum of Megapolis 142-acre township amenities, including an Olympic-sized swimming pool, mega clubhouse, high-tech gym, tennis courts, cricket nets, jogging tracks, Pawar Public School on campus, 24x7 security, and convenience shopping arcades.'
    },
    {
      q: 'Are property prices negotiable for Megapolis Sparklet listings?',
      a: 'Yes, 24K Realtors offers direct developer-assisted and resale negotiations. Prices for 1 BHK (starting ~₹48 Lakhs*) and 2 BHK (starting ~₹72 Lakhs*) are subject to flexible commercial negotiations depending on floor rise and payment terms.'
    }
  ]
};

export default function MegapolisSparkletProjectPage({ initialBhkFilter = null, onBackHome }) {
  const navigate = useNavigate();
  const p = SPARKLET_DATA;

  // SEO setup
  useSEO({
    title: 'Megapolis Sparklet Hinjewadi Phase 3 | Ready 1 & 2 BHK Flats | Pegasus Properties | 24K Realtors',
    description: 'Explore verified ready-to-move 1 BHK (450-480 sq.ft) & 2 BHK (680-760 sq.ft) flats in Megapolis Sparklet, Hinjewadi Phase 3 by Pegasus Properties. Dual MahaRERA A51800000454 & P52100078240. 100% authentic on-site photos, Olympic pool, gym & Pawar Public School.',
    canonical: 'https://24krealtors.in/megapolis-sparklet'
  });

  // State
  const [selectedBhk, setSelectedBhk] = useState(initialBhkFilter || 'ALL');
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [openFaqIdx, setOpenFaqIdx] = useState(0);
  const [copiedRera, setCopiedRera] = useState('');
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [consultForm, setConsultForm] = useState({ name: '', phone: '', email: '', preferredUnit: '1 BHK' });
  const [consultSubmitted, setConsultSubmitted] = useState(false);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIdx]);

  // Lock body scroll during lightbox
  useEffect(() => {
    if (lightboxIdx !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [lightboxIdx]);

  const openLightbox = (index) => {
    setLightboxIdx(index);
    setZoomLevel(1);
    setRotation(0);
    setPanPosition({ x: 0, y: 0 });
  };

  const closeLightbox = () => {
    setLightboxIdx(null);
    setZoomLevel(1);
    setRotation(0);
    setPanPosition({ x: 0, y: 0 });
  };

  const nextPhoto = () => {
    setLightboxIdx(prev => (prev + 1) % p.gallery.length);
    setZoomLevel(1);
    setRotation(0);
    setPanPosition({ x: 0, y: 0 });
  };

  const prevPhoto = () => {
    setLightboxIdx(prev => (prev - 1 + p.gallery.length) % p.gallery.length);
    setZoomLevel(1);
    setRotation(0);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.4, 3.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.4, 1));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleResetView = () => {
    setZoomLevel(1);
    setRotation(0);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const copyRera = (num) => {
    navigator.clipboard?.writeText(num);
    setCopiedRera(num);
    setTimeout(() => setCopiedRera(''), 2500);
  };

  const openWhatsApp = (customText) => {
    const text = customText || p.whatsappText;
    window.open(`https://wa.me/919673000053?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleConsultSubmit = (e) => {
    e.preventDefault();
    setConsultSubmitted(true);
    const msg = `Hi 24K Realtors, I requested a consultation for Megapolis Sparklet.\nName: ${consultForm.name}\nPhone: ${consultForm.phone}\nInterested in: ${consultForm.preferredUnit}`;
    setTimeout(() => {
      openWhatsApp(msg);
      setShowConsultModal(false);
      setConsultSubmitted(false);
    }, 1200);
  };

  const filteredConfigs = selectedBhk === 'ALL'
    ? p.configurations
    : p.configurations.filter(c => c.shortType === selectedBhk);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#040814',
      color: '#FFFFFF',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflowX: 'hidden'
    }}>

      {/* Global CSS for luxury Sparklet aesthetic */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;1,500&display=swap');
        
        .sparklet-gold-text {
          background: linear-gradient(135deg, #06B6D4 0%, #38BDF8 50%, #10B981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sparklet-warm-gold {
          background: linear-gradient(135deg, #F3E5AB 0%, #D4AF37 60%, #AA771C 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sparklet-cyan-btn {
          background: linear-gradient(135deg, #0284C7 0%, #06B6D4 50%, #10B981 100%);
          color: #040814;
          font-weight: 800;
          border: none;
          box-shadow: 0 4px 20px rgba(6, 182, 212, 0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sparklet-cyan-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(6, 182, 212, 0.6);
        }

        .sparklet-outline-btn {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(6, 182, 212, 0.35);
          color: #E2E8F0;
          transition: all 0.2s ease;
        }
        .sparklet-outline-btn:hover {
          background: rgba(6, 182, 212, 0.12);
          border-color: #06B6D4;
          color: #38BDF8;
        }

        .sparklet-glass-card {
          background: rgba(255, 255, 255, 0.025);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          transition: all 0.3s ease;
        }
        .sparklet-glass-card:hover {
          border-color: rgba(6, 182, 212, 0.4);
          box-shadow: 0 10px 30px rgba(6, 182, 212, 0.12);
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════
          1. STICKY LUXURY TOPBAR
      ══════════════════════════════════════════════════════════════ */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        background: 'rgba(4, 8, 20, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(6, 182, 212, 0.25)',
        padding: '12px 24px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          {/* Left Brand + Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => {
                if (onBackHome) onBackHome();
                else navigate('/townships/megapolis');
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#CBD5E1',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                fontWeight: 600
              }}
            >
              <ArrowLeft size={16} />
              <span>Megapolis Hub</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CompanyLogo variant="compact" height={28} />
              <div style={{ height: '18px', width: '1px', background: 'rgba(255,255,255,0.2)' }} />
              <div>
                <span style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  color: '#38BDF8'
                }}>
                  MEGAPOLIS SPARKLET
                </span>
                <span style={{
                  display: 'block',
                  fontSize: '0.65rem',
                  color: '#94A3B8',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}>
                  Hinjawadi Phase 3, Pune
                </span>
              </div>
            </div>
          </div>

          {/* Right CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href="tel:+919673000053"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#FFFFFF',
                fontSize: '0.84rem',
                fontWeight: 700,
                padding: '8px 14px',
                borderRadius: '8px',
                textDecoration: 'none',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <Phone size={15} color="#06B6D4" />
              <span>+91 96730 00053</span>
            </a>

            <button
              onClick={() => openWhatsApp()}
              className="sparklet-cyan-btn"
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <MessageSquare size={16} />
              <span>WhatsApp Dossier</span>
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════
          2. HERO ELEVATION & CINZEL HEADLINE
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        background: p.heroBg,
        padding: '60px 24px 70px',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(6, 182, 212, 0.2)'
      }}>
        {/* Decorative Cyan-Emerald Glow Blobs */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'pulseGlow 8s ease-in-out infinite alternate',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-5%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          
          {/* Breadcrumb + Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Townships</span>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>/</span>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Megapolis Hinjawadi</span>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>/</span>
            <span style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 600 }}>Sparklet Cluster</span>
            
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '20px',
              padding: '3px 10px',
              marginLeft: '8px'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#34D399', letterSpacing: '0.05em' }}>
                OC RECEIVED · READY TO MOVE
              </span>
            </div>
          </div>

          {/* Main Grid: Headline & Image Hero Card */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
            
            {/* Left Column: Headline, Specs, RERA */}
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(6, 182, 212, 0.12)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                padding: '6px 14px',
                borderRadius: '30px',
                marginBottom: '16px'
              }}>
                <Sparkles size={14} color="#06B6D4" />
                <span style={{ fontSize: '0.75rem', color: '#38BDF8', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Pegasus Properties · Megapolis Township
                </span>
              </div>

              <h1 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'clamp(2.1rem, 4.5vw, 3.4rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                marginBottom: '16px',
                color: '#FFFFFF'
              }}>
                MEGAPOLIS <span className="sparklet-gold-text">SPARKLET</span>
              </h1>

              <p style={{
                fontSize: '1.05rem',
                color: '#CBD5E1',
                lineHeight: 1.6,
                marginBottom: '28px',
                maxWidth: '560px'
              }}>
                {p.heroSubline}
              </p>

              {/* Key Fast Facts */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '28px'
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    1 BHK Carpet
                  </span>
                  <p style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38BDF8', margin: '4px 0 0' }}>
                    450 – 480 sqft
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    2 BHK Carpet
                  </span>
                  <p style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38BDF8', margin: '4px 0 0' }}>
                    680 – 760 sqft
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Pricing
                  </span>
                  <p style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34D399', margin: '4px 0 0' }}>
                    Negotiable*
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => openWhatsApp()}
                  className="sparklet-cyan-btn"
                  style={{
                    padding: '14px 26px',
                    borderRadius: '10px',
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Calendar size={18} />
                  <span>Book Private Site Visit</span>
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('sparklet-gallery');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="sparklet-outline-btn"
                  style={{
                    padding: '14px 22px',
                    borderRadius: '10px',
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Eye size={18} />
                  <span>View 5 Real Photos</span>
                </button>
              </div>

            </div>

            {/* Right Column: Hero Visual Card with Balcony Preview */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(6, 182, 212, 0.2)'
              }}>
                <img
                  src={p.showcaseImage}
                  alt="Megapolis Sparklet Balcony View"
                  style={{ width: '100%', height: '390px', objectFit: 'cover', display: 'block' }}
                />
                
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(4,8,20,0.88) 0%, transparent 60%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <div>
                      <span style={{
                        background: 'rgba(6, 182, 212, 0.85)',
                        color: '#040814',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        letterSpacing: '0.06em'
                      }}>
                        VERIFIED ON-SITE BALCONY PHOTO
                      </span>
                      <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', color: '#F3E5AB', margin: '8px 0 4px' }}>
                        Curved Balcony Terrace & Tower Vista
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: '#E2E8F0', margin: 0 }}>
                        Terracotta tiling with glass railing overlooking Megapolis central amenities.
                      </p>
                    </div>

                    <button
                      onClick={() => openLightbox(0)}
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '50%',
                        width: '44px',
                        height: '44px',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Enlarge Photo"
                    >
                      <Maximize2 size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Float Badge */}
              <div style={{
                position: 'absolute',
                top: '-12px',
                right: '16px',
                background: 'linear-gradient(135deg, #10B981, #06B6D4)',
                color: '#040814',
                fontWeight: 900,
                fontSize: '0.75rem',
                padding: '6px 14px',
                borderRadius: '20px',
                boxShadow: '0 4px 15px rgba(16,185,129,0.4)',
                letterSpacing: '0.06em'
              }}>
                100% CLEAR TITLE · DUAL RERA
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          3. DUAL MAHARERA REGISTRATION TRUST STRIP
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        background: 'rgba(6, 182, 212, 0.06)',
        borderBottom: '1px solid rgba(6, 182, 212, 0.2)',
        padding: '24px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          {/* Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={24} color="#06B6D4" />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
                Regulatory Compliance
              </span>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#F3E5AB', margin: 0 }}>
                Dual MahaRERA Registered Project
              </h3>
            </div>
          </div>

          {/* RERA Numbers with 1-Click Copy */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
            {p.reraNumbers.map((r, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.66rem', color: '#38BDF8', display: 'block', fontWeight: 600 }}>
                    {r.label} ({r.type})
                  </span>
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.04em' }}>
                    {r.number}
                  </span>
                </div>

                <button
                  onClick={() => copyRera(r.number)}
                  style={{
                    background: copiedRera === r.number ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255,255,255,0.08)',
                    border: copiedRera === r.number ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.15)',
                    color: copiedRera === r.number ? '#34D399' : '#CBD5E1',
                    padding: '5px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Copy MahaRERA number"
                >
                  {copiedRera === r.number ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedRera === r.number ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            ))}

            <a
              href="https://maharera.mahaonline.gov.in"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '0.76rem',
                color: '#38BDF8',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              <span>Verify on MahaRERA Portal</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          4. 5-PHOTO INTERACTIVE LIGHTBOX GALLERY
      ══════════════════════════════════════════════════════════════ */}
      <section id="sparklet-gallery" style={{ padding: '70px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Section Heading */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(6, 182, 212, 0.1)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '20px',
            padding: '5px 16px',
            marginBottom: '12px'
          }}>
            <Eye size={14} color="#06B6D4" />
            <span style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Authentic Visual Dossier · 5 On-Site Verified Photos
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(1.7rem, 3.5vw, 2.5rem)',
            fontWeight: 800,
            color: '#F3E5AB',
            marginBottom: '10px'
          }}>
            Experience Megapolis Sparklet Residences
          </h2>

          <p style={{ color: '#94A3B8', fontSize: '0.92rem', maxWidth: '620px', margin: '0 auto' }}>
            Browse through real photographs of actual ready-to-move Sparklet units. Click any photo to launch the ultra-high-definition pan & zoom lightbox.
          </p>
        </div>

        {/* Room Filter Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' }}>
          {p.gallery.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveGalleryIdx(idx)}
              style={{
                background: activeGalleryIdx === idx ? p.accentGradient : 'rgba(255,255,255,0.04)',
                color: activeGalleryIdx === idx ? '#040814' : '#E2E8F0',
                border: activeGalleryIdx === idx ? 'none' : '1px solid rgba(255,255,255,0.1)',
                padding: '8px 16px',
                borderRadius: '24px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{item.icon}</span>
              <span>{item.roomName}</span>
            </button>
          ))}
        </div>

        {/* Featured Photo Showcase with Detailed Specs */}
        <div className="sparklet-glass-card" style={{ padding: '24px', marginBottom: '36px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'center' }}>
            
            {/* Left: Large Photo */}
            <div
              onClick={() => openLightbox(activeGalleryIdx)}
              style={{
                position: 'relative',
                borderRadius: '14px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                boxShadow: '0 12px 35px rgba(0,0,0,0.5)'
              }}
            >
              <img
                src={p.gallery[activeGalleryIdx].src}
                alt={p.gallery[activeGalleryIdx].title}
                style={{ width: '100%', height: '360px', objectFit: 'cover', display: 'block' }}
              />

              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: 'rgba(4, 8, 20, 0.85)',
                color: '#38BDF8',
                fontWeight: 800,
                fontSize: '0.68rem',
                padding: '4px 10px',
                borderRadius: '4px',
                border: '1px solid rgba(6, 182, 212, 0.4)'
              }}>
                {p.gallery[activeGalleryIdx].badge}
              </div>

              <div style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                background: 'rgba(6, 182, 212, 0.9)',
                color: '#040814',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Maximize2 size={14} />
                <span>Enlarge Lightbox</span>
              </div>
            </div>

            {/* Right: Key Features & Description */}
            <div>
              <span style={{ fontSize: '0.75rem', color: '#06B6D4', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {p.gallery[activeGalleryIdx].tag}
              </span>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', color: '#F3E5AB', margin: '8px 0 10px' }}>
                {p.gallery[activeGalleryIdx].title}
              </h3>
              <p style={{ color: '#CBD5E1', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
                {p.gallery[activeGalleryIdx].subtitle}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {p.gallery[activeGalleryIdx].features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{f.icon}</span>
                    <div>
                      <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#E2E8F0', margin: '0 0 2px' }}>
                        {f.title}
                      </h4>
                      <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: 0 }}>
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => openLightbox(activeGalleryIdx)}
                  className="sparklet-cyan-btn"
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ZoomIn size={16} />
                  <span>Inspect in Fullscreen</span>
                </button>
                <button
                  onClick={() => openWhatsApp(`Hi 24K Realtors, I liked the ${p.gallery[activeGalleryIdx].tag} in Megapolis Sparklet. Can you arrange a walkthrough?`)}
                  className="sparklet-outline-btn"
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <MessageSquare size={16} />
                  <span>Ask About This Unit</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Thumbnail Grid for 5 Photos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px' }}>
          {p.gallery.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => {
                setActiveGalleryIdx(idx);
                openLightbox(idx);
              }}
              style={{
                position: 'relative',
                borderRadius: '10px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: activeGalleryIdx === idx ? '2px solid #06B6D4' : '1px solid rgba(255,255,255,0.08)',
                boxShadow: activeGalleryIdx === idx ? '0 0 16px rgba(6,182,212,0.4)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <img
                src={item.src}
                alt={item.title}
                style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(4,8,20,0.85) 0%, transparent 60%)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '8px 10px'
              }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#FFFFFF' }}>
                  {item.icon} {item.roomName}
                </span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════
          5. CONFIGURATIONS & CARPET AREA BREAKDOWN
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '70px 24px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '20px',
              padding: '5px 16px',
              marginBottom: '12px'
            }}>
              <Home size={14} color="#06B6D4" />
              <span style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Floor Space &amp; Configuration Dossier
              </span>
            </div>

            <h2 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(1.7rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: '#F3E5AB',
              marginBottom: '10px'
            }}>
              Sparklet Apartment Configurations
            </h2>

            <p style={{ color: '#94A3B8', fontSize: '0.92rem', maxWidth: '640px', margin: '0 auto' }}>
              Precision-engineered residential plans featuring 1 BHK (450–480 sq.ft) smart homes and 2 BHK (680–760 sq.ft) family homes.
            </p>
          </div>

          {/* BHK Filter Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '32px' }}>
            {['ALL', '1 BHK', '2 BHK'].map((bhk) => (
              <button
                key={bhk}
                onClick={() => setSelectedBhk(bhk)}
                style={{
                  background: selectedBhk === bhk ? p.accentGradient : 'rgba(255,255,255,0.04)',
                  color: selectedBhk === bhk ? '#040814' : '#E2E8F0',
                  border: selectedBhk === bhk ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  padding: '10px 24px',
                  borderRadius: '30px',
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {bhk === 'ALL' ? 'View All Residences' : `${bhk} Units`}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {filteredConfigs.map((cfg, idx) => (
              <div
                key={idx}
                className="sparklet-glass-card"
                style={{
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                {/* Highlight Badge */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                  color: '#38BDF8',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '20px',
                  letterSpacing: '0.05em'
                }}>
                  {cfg.highlightBadge}
                </div>

                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Pegasus Properties · Megapolis
                  </span>
                  <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', color: '#FFFFFF', margin: '4px 0 12px' }}>
                    {cfg.type}
                  </h3>

                  {/* Carpet Area Highlight Box */}
                  <div style={{
                    background: 'rgba(6, 182, 212, 0.08)',
                    border: '1px solid rgba(6, 182, 212, 0.25)',
                    borderRadius: '10px',
                    padding: '14px',
                    marginBottom: '18px'
                  }}>
                    <span style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Usable Carpet Area
                    </span>
                    <p style={{ fontSize: '1.35rem', fontWeight: 900, color: '#38BDF8', margin: '2px 0 4px' }}>
                      {cfg.carpet}
                    </p>
                    <span style={{ fontSize: '0.74rem', color: '#CBD5E1' }}>
                      {cfg.carpetNote}
                    </span>
                  </div>

                  {/* Specs List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    {cfg.specs.map((s, si) => (
                      <div key={si} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', borderBottom: '1px dashed rgba(255,255,255,0.06)', paddingBottom: '6px' }}>
                        <span style={{ color: '#94A3B8' }}>{s.label}:</span>
                        <span style={{ color: '#E2E8F0', fontWeight: 600 }}>{s.val}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', paddingTop: '4px' }}>
                      <span style={{ color: '#94A3B8' }}>Balcony Vista:</span>
                      <span style={{ color: '#34D399', fontWeight: 600 }}>{cfg.balcony}</span>
                    </div>
                  </div>
                </div>

                {/* Footer & CTA */}
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    paddingTop: '14px'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.68rem', color: '#94A3B8', textTransform: 'uppercase' }}>Pricing Estimate</span>
                      <p style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F3E5AB', margin: 0 }}>
                        {cfg.pricing}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 700 }}>
                      {cfg.status}
                    </span>
                  </div>

                  <button
                    onClick={() => openWhatsApp(`Hi 24K Realtors, I am interested in Megapolis Sparklet ${cfg.shortType} (${cfg.carpet} - ${cfg.pricing}). Please share current floor plans and unit availability.`)}
                    className="sparklet-cyan-btn"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <MessageSquare size={16} />
                    <span>Inquire for {cfg.shortType}</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          6. TOWNSHIP AMENITIES (MEGAPOLIS STANDARD)
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '70px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(6, 182, 212, 0.1)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '20px',
            padding: '5px 16px',
            marginBottom: '12px'
          }}>
            <Trophy size={14} color="#06B6D4" />
            <span style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Full 142-Acre Megapolis Privileges
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(1.7rem, 3.5vw, 2.5rem)',
            fontWeight: 800,
            color: '#F3E5AB',
            marginBottom: '10px'
          }}>
            Township Amenities &amp; Infrastructure
          </h2>

          <p style={{ color: '#94A3B8', fontSize: '0.92rem', maxWidth: '640px', margin: '0 auto' }}>
            Megapolis Sparklet residents enjoy complete access to all integrated sports complexes, educational institutions, and lifestyle facilities across the township.
          </p>
        </div>

        {/* 3 Amenities Pillar Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {p.amenities.map((col, idx) => (
            <div
              key={idx}
              className="sparklet-glass-card"
              style={{ padding: '26px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '1.6rem' }}>{col.icon}</span>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.15rem', color: '#F3E5AB', margin: 0 }}>
                  {col.category}
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {col.items.map((item, ii) => (
                  <div key={ii} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={16} color={col.accent} style={{ flexShrink: 0, marginTop: '3px' }} />
                    <div>
                      <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#E2E8F0', margin: '0 0 2px' }}>
                        {item.name}
                      </h4>
                      <p style={{ fontSize: '0.76rem', color: '#94A3B8', margin: 0, lineHeight: 1.4 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════
          7. COMMUTE MATRIX & CONNECTIVITY (PHASE 3)
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '60px 24px'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(6, 182, 212, 0.1)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '20px',
              padding: '5px 16px',
              marginBottom: '12px'
            }}>
              <MapPin size={14} color="#06B6D4" />
              <span style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Hinjawadi Phase 3 Proximity Matrix
              </span>
            </div>

            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.8rem', color: '#F3E5AB', margin: '0 0 8px' }}>
              Strategic IT Hub Location
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem' }}>
              Rajiv Gandhi Infotech Park Phase 3 — walk or short commute to leading global tech centers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {p.commuteMatrix.map((dest, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.84rem', fontWeight: 700, color: '#E2E8F0', margin: '0 0 2px' }}>
                    {dest.destination}
                  </h4>
                  <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>{dest.distance}</span>
                </div>
                <span style={{
                  background: 'rgba(6, 182, 212, 0.15)',
                  border: '1px solid rgba(6, 182, 212, 0.35)',
                  color: '#38BDF8',
                  fontWeight: 800,
                  fontSize: '0.74rem',
                  padding: '4px 10px',
                  borderRadius: '6px'
                }}>
                  {dest.time}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          8. FREQUENTLY ASKED QUESTIONS (ACCORDION)
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '70px 24px', maxWidth: '880px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(6, 182, 212, 0.1)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '20px',
            padding: '5px 16px',
            marginBottom: '12px'
          }}>
            <HelpCircle size={14} color="#06B6D4" />
            <span style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Buyer &amp; Investor FAQ
            </span>
          </div>

          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.8rem', color: '#F3E5AB', margin: '0 0 8px' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem' }}>
            Detailed clarity on MahaRERA registrations, carpet areas, ready possession, and pricing.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {p.faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: openFaqIdx === idx ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.2s ease'
              }}
            >
              <button
                onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <span>{faq.q}</span>
                {openFaqIdx === idx ? <ChevronUp size={18} color="#06B6D4" /> : <ChevronDown size={18} color="#94A3B8" />}
              </button>

              {openFaqIdx === idx && (
                <div style={{ padding: '0 20px 18px', color: '#CBD5E1', fontSize: '0.86rem', lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════
          9. 24K VIP ADVISORY FOOTER BANNER
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(16,185,129,0.1) 100%)',
        borderTop: '1px solid rgba(6, 182, 212, 0.3)',
        padding: '60px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <CompanyLogo variant="full" width={180} height={40} style={{ margin: '0 auto 16px' }} />
          
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#F3E5AB', marginBottom: '12px' }}>
            Book Your Private Site Visit for Megapolis Sparklet
          </h2>

          <p style={{ color: '#CBD5E1', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '28px' }}>
            24K Realtors provides complimentary chauffeur-driven private site visits, floor-plan analysis, legal title verification, and direct developer pricing negotiation for Megapolis residences.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => openWhatsApp()}
              className="sparklet-cyan-btn"
              style={{
                padding: '14px 28px',
                borderRadius: '10px',
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <MessageSquare size={18} />
              <span>Connect on WhatsApp</span>
            </button>

            <a
              href="tel:+919673000053"
              style={{
                padding: '14px 24px',
                borderRadius: '10px',
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontWeight: 700
              }}
            >
              <Phone size={18} color="#06B6D4" />
              <span>Call +91 96730 00053</span>
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          10. FULLSCREEN INTERACTIVE LIGHTBOX MODAL
      ══════════════════════════════════════════════════════════════ */}
      {lightboxIdx !== null && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(2, 6, 16, 0.96)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '16px'
          }}
        >
          {/* Lightbox Header */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: '#06B6D4', fontWeight: 800, textTransform: 'uppercase' }}>
                Megapolis Sparklet Verified Photo {lightboxIdx + 1} of {p.gallery.length}
              </span>
              <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.05rem', color: '#F3E5AB', margin: 0 }}>
                {p.gallery[lightboxIdx].title}
              </h4>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleZoomIn}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={handleZoomOut}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <button
                onClick={handleRotate}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                title="Rotate 90°"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={handleResetView}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
                title="Reset View"
              >
                Reset
              </button>
              <button
                onClick={closeLightbox}
                style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#EF4444', padding: '8px', borderRadius: '6px', cursor: 'pointer', marginLeft: '8px' }}
                title="Close Lightbox (Esc)"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Lightbox Main Image Canvas */}
          <div
            onClick={e => e.stopPropagation()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
              cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
          >
            {/* Prev Button */}
            <button
              onClick={prevPhoto}
              style={{
                position: 'absolute',
                left: '20px',
                zIndex: 10,
                background: 'rgba(4, 8, 20, 0.75)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={22} />
            </button>

            {/* Img with Transform */}
            <img
              src={p.gallery[lightboxIdx].src}
              alt={p.gallery[lightboxIdx].title}
              draggable={false}
              style={{
                maxWidth: '90%',
                maxHeight: '75vh',
                objectFit: 'contain',
                transform: `scale(${zoomLevel}) rotate(${rotation}deg) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                transition: isDragging ? 'none' : 'transform 0.25s ease',
                userSelect: 'none'
              }}
            />

            {/* Next Button */}
            <button
              onClick={nextPhoto}
              style={{
                position: 'absolute',
                right: '20px',
                zIndex: 10,
                background: 'rgba(4, 8, 20, 0.75)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Lightbox Footer Thumbnail Strip */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '10px',
              padding: '10px 0',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {p.gallery.map((it, i) => (
              <div
                key={i}
                onClick={() => {
                  setLightboxIdx(i);
                  handleResetView();
                }}
                style={{
                  width: '60px',
                  height: '44px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: lightboxIdx === i ? '2px solid #06B6D4' : '1px solid rgba(255,255,255,0.2)',
                  opacity: lightboxIdx === i ? 1 : 0.6,
                  transition: 'all 0.2s'
                }}
              >
                <img src={it.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          11. FIXED MOBILE ACTION BAR
      ══════════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        background: 'rgba(4,8,20,0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(6,182,212,0.3)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px'
      }}>
        <a
          href="tel:+919673000053"
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#FFFFFF',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            textDecoration: 'none'
          }}
        >
          <Phone size={15} color="#06B6D4" />
          <span>Call Desk</span>
        </a>

        <button
          onClick={() => openWhatsApp(p.whatsappText)}
          className="sparklet-cyan-btn"
          style={{
            flex: 2,
            padding: '10px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <MessageSquare size={16} />
          <span>WhatsApp Advisor</span>
        </button>
      </div>

    </div>
  );
}
