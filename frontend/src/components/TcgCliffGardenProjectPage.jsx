/**
 * TcgCliffGardenProjectPage.jsx — 24K Realtors
 * ─────────────────────────────────────────────────────────────────────────────
 * Ultra-Luxury Flagship Project Subpage for TCG The Cliff Garden,
 * Hinjewadi Phase 3, Pune.
 *
 * Features:
 *  - Official TCG The Cliff Garden Brand Identity
 *  - Verified 1 BHK (462 sq.ft, ₹55 Lakhs - Negotiable) & 2 BHK (662 sq.ft, ₹75 Lakhs - Negotiable)
 *  - Triple MahaRERA Trust Banner: P52100004906, P52100015759, P52100028926
 *  - Clickable Full-Screen Interactive Lightbox Gallery with Pan & Zoom
 *  - 100% Authentic Photos: Balcony Valley View, Living Room, Modular Kitchen, Master Bed, Bathroom
 *  - Comprehensive 4-Pillar Amenities: Recreational & Sports, Fitness & Outdoors, Convenience & Safety, Internal Apartment Features
 *  - Hinjewadi Phase 3 Transit & Strategic IT Hub Proximity Matrix
 *  - Direct WhatsApp & Guided Site Tour Booking
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
  Check, ExternalLink, HelpCircle, Layers, Compass, Eye, Shield
} from 'lucide-react';
import { useSEO } from '../services/seoService';
import CompanyLogo from './CompanyLogo';

/* ══════════════════════════════════════════════════════════════════
   TCG THE CLIFF GARDEN PROJECT DATA SPECIFICATION
══════════════════════════════════════════════════════════════════ */
const TCG_DATA = {
  key: 'tcg-the-cliff-garden',
  name: 'TCG The Cliff Garden',
  shortName: 'The Cliff Garden',
  developer: 'TCG Real Estate',
  reraNumbers: [
    { number: 'P52100004906', label: 'Phase 1 / Wing A & B', status: 'Registered & Clear Title' },
    { number: 'P52100015759', label: 'Phase 2 / Wing C', status: 'Registered & Clear Title' },
    { number: 'P52100028926', label: 'Phase 3 / Extension Wing', status: 'Registered & Clear Title' }
  ],
  reraSummary: 'P52100004906 · P52100015759 · P52100028926',
  location: 'Hinjewadi Phase 3, Rajiv Gandhi Infotech Park, Pune — 411057',
  status: 'Ready to Move / Resale & Primary Inventory',
  tagline: 'Scenic Hillside Living with Sahyadri Valley Vistas in Hinjewadi Phase 3',
  heroSubline: 'Nestled on the scenic hill slopes of Hinjewadi Phase 3, offering ready 1 BHK (462 sq.ft carpet, ₹55L) & 2 BHK (662 sq.ft carpet, ₹75L) scenic homes with triple MahaRERA registration and resort lifestyle amenities.',
  accentColor: '#10B981',
  accentGradient: 'linear-gradient(135deg, #059669 0%, #10B981 50%, #D4AF37 100%)',
  heroBg: 'linear-gradient(160deg, #040814 0%, #06181C 40%, #031210 100%)',
  showcaseImage: '/properties/tcg-the-cliff-garden/hero.jpg',
  investmentScore: 94,
  priceNegotiable: true,
  whatsappText: 'Hi 24K Realtors, I am interested in TCG The Cliff Garden Hinjewadi Phase 3 (1 BHK ₹55L / 2 BHK ₹75L - Negotiable). Please share floor plans, pricing breakup, and schedule a private site visit.',

  gallery: [
    {
      id: 1,
      tag: 'Grand Elevation & Gate',
      icon: '🏢',
      roomName: 'Grand Elevation',
      title: 'TCG The Cliff Garden — Premium Hinjewadi Phase 3 Living',
      subtitle: 'Iconic high-rise towers and grand entrance portal set amidst the lush green Sahyadri hills in Hinjewadi Phase 3. MahaRERA registered: P52100028926.',
      src: '/properties/tcg-the-cliff-garden/00_project_card.jpg',
      features: [
        { icon: '🏢', title: 'Grand Entry Portal', desc: 'Secure gated entrance with landscaped boundary and security cabin' },
        { icon: '🌿', title: 'Perpetual Greenery', desc: 'Hillside vantage point with fresh breezes and panoramic views' },
        { icon: '🛡️', title: 'MahaRERA Registered', desc: 'Registered with clear title: P52100004906, P52100015759, P52100028926' },
        { icon: '📍', title: 'Prime Phase 3', desc: 'Minutes away from Megapolis circle, Tech Mahindra and TCS' }
      ]
    },
    {
      id: 2,
      tag: 'Spacious Living Lounge',
      icon: '🛋️',
      roomName: 'Living Room',
      title: 'Spacious Living & Dining Lounge — Open-Plan Family Living',
      subtitle: 'Airy vitrified-tiled living hall with direct balcony access, contemporary floral art accents, and custom entertainment TV console unit.',
      src: '/properties/tcg-the-cliff-garden/05_living_room.jpg',
      features: [
        { icon: '🛋️', title: 'Sectional Sofa Space', desc: 'Generous layout accommodating large L-shaped couch and dining table' },
        { icon: '📺', title: 'Designer TV Unit', desc: 'Custom wood-finish entertainment panel with decorative accent framing' },
        { icon: '✨', title: 'Glossy Vitrified Floor', desc: 'Reflective nano-finish ceramic tiles creating an expansive, bright ambiance' },
        { icon: '🚪', title: 'Balcony Slider', desc: 'Wide sliding glass doorway opening directly to the private green balcony' }
      ]
    },
    {
      id: 3,
      tag: 'Modular Kitchen & Counter',
      icon: '🍳',
      roomName: 'Modular Kitchen',
      title: 'Designer Modular Kitchen — Breakfast Counter & Storage',
      subtitle: 'L-shaped polished granite cooking platform with sage green lower cabinets, frosted glass overhead storage, and dual-level breakfast counter.',
      src: '/properties/tcg-the-cliff-garden/04_kitchen.jpg',
      features: [
        { icon: '🍳', title: 'Fitted Modular Cabinets', desc: 'Smooth-gliding lower drawers and overhead storage with frosted glass shutters' },
        { icon: '🍸', title: 'Breakfast Bar', desc: 'Dual-tier partition counter with stainless steel pillar and crockery storage' },
        { icon: '🖤', title: 'Polished Granite', desc: 'Heavy-duty jet black granite counter with stainless steel sink & designer tile dado' },
        { icon: '💨', title: 'Chimney Ready', desc: 'Dedicated electric chimney ducting and concealed appliance power outlets' }
      ]
    },
    {
      id: 4,
      tag: 'Sunlit Master Bedroom',
      icon: '🛏️',
      roomName: 'Bedroom',
      title: 'Well-Ventilated Master Bedroom — Dual Window Cross-Draft',
      subtitle: 'Quiet personal haven featuring dual framed windows for bright sunlight, wood-finish double bed, study workstation, and tranquil ambiance.',
      src: '/properties/tcg-the-cliff-garden/02_bedroom.jpg',
      features: [
        { icon: '🪟', title: 'Dual Windows', desc: 'Dual-aspect safety-grilled windows providing healthy daylight and ventilation' },
        { icon: '💻', title: 'Work-From-Home Desk', desc: 'Convenient space for study desk, wardrobe, and king/queen size bed' },
        { icon: '🍃', title: 'Calm Environment', desc: 'Peaceful acoustic separation away from city hustle with scenic outdoor outlook' },
        { icon: '⚡', title: 'Electrical Fittings', desc: 'Pre-wired points for ceiling fan, AC unit, and bedside charging ports' }
      ]
    },
    {
      id: 5,
      tag: 'Modern Ceramic Bathroom',
      icon: '🚿',
      roomName: 'Bathroom',
      title: 'Modern Finished Bathroom — Branded Sanitary & Mirror Vanity',
      subtitle: 'Contemporary bathroom design with wall-mounted western commode, washbasin vanity, mirror cabinet, exhaust louvers, and anti-skid flooring.',
      src: '/properties/tcg-the-cliff-garden/03_bathroom.jpg',
      features: [
        { icon: '🚽', title: 'Wall-Hung Commode', desc: 'Premium white ceramic commode with health faucet and sleek concealed flush' },
        { icon: '🪞', title: 'Vanity Mirror Cabinet', desc: 'Pre-installed mirror cabinet for organized toiletry storage' },
        { icon: '🚿', title: 'Hot & Cold Shower', desc: 'Branded chrome-plated diverter, overhead shower, and geyser electrical point' },
        { icon: '💨', title: 'Exhaust Fan Window', desc: 'Frosted louvered window with fitted electric exhaust fan for active ventilation' }
      ]
    },
    {
      id: 6,
      tag: 'Hillside & Valley View',
      icon: '🌄',
      roomName: 'Balcony View',
      title: 'Panoramic Balcony View — Sahyadri Greens & Metro Corridor',
      subtitle: 'Unobstructed scenic vistas framing lush tropical canopies, Hinjewadi Phase 3 IT skyline, and serene mountain horizons with breezy cross-ventilation.',
      src: '/properties/tcg-the-cliff-garden/01_balcony_view.jpg',
      features: [
        { icon: '🌿', title: 'Perpetual Greenery', desc: 'Direct views of Sahyadri hill slopes and open protected tree canopy' },
        { icon: '🌬️', title: 'Natural Breeze', desc: 'Elevated cliff vantage point ensuring cool air and ample natural sunlight' },
        { icon: '🛡️', title: 'Safety Netting', desc: 'Full-height pigeon & safety mesh installed for family comfort' },
        { icon: '🚇', title: 'Metro Corridor', desc: 'Clear sightline of upcoming Hinjewadi Metro Line 3 transit alignment' }
      ]
    }
  ],

  configurations: [
    {
      bhk: '1 BHK',
      badge: 'POPULAR CHOICE',
      isPopular: true,
      carpet: '462 sq.ft',
      priceText: '₹55 Lakhs',
      priceSub: '(Negotiable)',
      desc: 'Smartly engineered 1 BHK residence with full-sized living room, scenic balcony with Sahyadri views, modular kitchen with breakfast counter, and low maintenance overhead.',
      features: [
        '462 sq.ft Verified RERA Carpet Area',
        'Private Scenic Balcony with Valley Views',
        'Fitted Modular Kitchen with Cabinets',
        'Walking Proximity to Megapolis & Phase 3 IT Hub',
        'Price Negotiable · Ideal for IT Professionals'
      ]
    },
    {
      bhk: '2 BHK',
      badge: 'FAMILY LUXURY',
      isPopular: false,
      carpet: '662 sq.ft',
      priceText: '₹75 Lakhs',
      priceSub: '(Negotiable)',
      desc: 'Spacious 2 BHK home designed for modern IT families. Generous master suite, separate children/guest bedroom, expansive living-dining space, and uncompromised privacy.',
      features: [
        '662 sq.ft Verified RERA Carpet Area',
        'Master Bedroom with Attached Modern Bath',
        'L-Shaped Living Lounge with Scenic French Window',
        'Dedicated Breakfast Bar & Extended Kitchen Space',
        'Price Negotiable · Ready for Immediate Registration'
      ]
    }
  ],

  // 4 Core Amenity Categories as specifically requested
  amenityCategories: [
    {
      id: 'recreational-sports',
      title: 'Recreational & Sports',
      subtitle: 'Active leisure, sports courts, and community recreation zones',
      badge: 'SPORTS & LEISURE',
      icon: '🏆',
      items: [
        { icon: '🏸', title: 'Multipurpose Sports Court', desc: 'Floodlit court for badminton, basketball & active practice' },
        { icon: '🏛️', title: 'Grand Community Clubhouse', desc: 'Central indoor hub for events, meetings & community get-togethers' },
        { icon: '🏓', title: 'Indoor Games Pavilion', desc: 'Dedicated space for table tennis, carrom, chess & billiards' },
        { icon: '🎭', title: 'Amphitheatre & Stage', desc: 'Tiered open-air lawn amphitheatre for cultural and festival events' },
        { icon: '🎪', title: 'Party Lawn & Gazebos', desc: 'Lush landscaped green lawns for private family birthday parties & barbecues' },
        { icon: '🧒', title: 'Children Adventure Play Park', desc: 'Safe swings, slides, sand pit & soft rubberized play zone' }
      ]
    },
    {
      id: 'fitness-outdoors',
      title: 'Fitness & Outdoors',
      subtitle: 'Health, wellness, running tracks, and serene natural landscaping',
      badge: 'FITNESS & WELLNESS',
      icon: '🏋️',
      items: [
        { icon: '🏋️‍♂️', title: 'Fully Equipped Gymnasium', desc: 'State-of-the-art cardio machines, weight stacks & free weight section' },
        { icon: '🏊‍♂️', title: 'Swimming Pool & Splash Deck', desc: 'Clean, filtered pool with shallow kids splash pool and sun loungers' },
        { icon: '🏃‍♂️', title: 'Jogging & Strolling Track', desc: 'Smooth peripheral track lined with greenery for morning workouts' },
        { icon: '🧘‍♀️', title: 'Open-Air Yoga & Meditation Lawn', desc: 'Peaceful sunrise deck framed by Sahyadri hill breezes' },
        { icon: '🌳', title: 'Hillside Zen Gardens', desc: 'Acutely landscaped flower beds, sitting pavilions & quiet reflection corners' },
        { icon: '👵', title: 'Senior Citizens Sit-Out', desc: 'Shaded benches with ramped, step-free access for elders' }
      ]
    },
    {
      id: 'convenience-safety',
      title: 'Convenience & Safety',
      subtitle: 'Multi-tier security, backup power, water management, and parking',
      badge: 'SECURITY & INFRA',
      icon: '🛡️',
      items: [
        { icon: '🎥', title: '24/7 Security & CCTV Grid', desc: 'Comprehensive camera coverage at gates, lobbies, lifts, and common grounds' },
        { icon: '🛗', title: 'High-Speed Elevators with ARD', desc: 'Branded passenger elevators with Automatic Rescue Device in power cuts' },
        { icon: '⚡', title: '100% DG Power Backup', desc: 'Continuous generator backup for all common elevators, pumps, and hallway lights' },
        { icon: '🚗', title: 'Covered Vehicle Parking', desc: 'Demarcated covered parking for residents and safe visitor parking bays' },
        { icon: '📞', title: 'Intercom & Boom Barriers', desc: 'Direct gate security intercom communication and RFID boom barriers' },
        { icon: '💧', title: 'STP & Rainwater Harvesting', desc: 'Eco-conscious Sewage Treatment Plant and underground rainwater recharge wells' }
      ]
    },
    {
      id: 'internal-features',
      title: 'Internal Apartment Features',
      subtitle: 'Premium specifications, branded fittings, and durable architectural finishes',
      badge: 'INTERIOR SPECS',
      icon: '✨',
      items: [
        { icon: '💎', title: 'Vitrified Tile Flooring', desc: 'Glossy 2x2 vitrified tiles across living room, dining area, and all bedrooms' },
        { icon: '🍳', title: 'Jet Black Granite Counter', desc: 'Heavy-duty polished granite platform with stainless steel sink & glazed tile dado' },
        { icon: '🚿', title: 'Branded Sanitary & CP Fittings', desc: 'Chrome-plated sanitary fixtures from reputable brands (Jaquar/Cera equivalent)' },
        { icon: '🪟', title: 'Aluminum Sliding Windows', desc: 'Powder-coated 3-track sliding windows with mosquito mesh and MS safety grills' },
        { icon: '🔌', title: 'Concealed Copper Wiring', desc: 'Fire-resistant conduits with branded modular switches and inverter point' },
        { icon: '🛡️', title: 'Anti-Skid Balcony & Bath Floors', desc: 'Matte ceramic anti-skid tiles for safe wet-area footing' }
      ]
    }
  ],

  proximity: [
    { label: 'Megapolis Circle Hinjewadi', distance: '1.5 km', time: '3 mins' },
    { label: 'Tech Mahindra Hinjewadi Phase 3', distance: '2.0 km', time: '4 mins' },
    { label: 'TCS & Cognizant Phase 3 Campus', distance: '2.2 km', time: '5 mins' },
    { label: 'Pawar Public School (Megapolis)', distance: '1.8 km', time: '4 mins' },
    { label: 'Upcoming Metro Line 3 Terminal', distance: '2.5 km', time: '5 mins' },
    { label: 'Wipro Technologies Hinjewadi Phase 2', distance: '4.8 km', time: '9 mins' },
    { label: 'Mumbai-Pune Expressway Bypass', distance: '7.5 km', time: '12 mins' }
  ],

  faqs: [
    {
      q: 'What are the MahaRERA numbers for TCG The Cliff Garden?',
      a: 'TCG The Cliff Garden has multiple phases and wings registered under distinct MahaRERA numbers: P52100004906, P52100015759, and P52100028926. All phases have verified legal titles and clear compliance on the official MahaRERA portal.'
    },
    {
      q: 'What configurations and pricing are available?',
      a: 'We have 1 BHK residences with 462 sq.ft carpet at ₹55 Lakhs (Negotiable), and 2 BHK residences with 662 sq.ft carpet at ₹75 Lakhs (Negotiable). Both are ready to move with scenic hill views.'
    },
    {
      q: 'Is the price negotiable?',
      a: 'Yes, both the 1 BHK (₹55L) and 2 BHK (₹75L) prices are negotiable. 24K Realtors assists you directly in price negotiations and secures the best closing value on your behalf.'
    },
    {
      q: 'Are the photos displayed on this page authentic?',
      a: 'Yes, 100% of the photos shown in this dossier are actual photographs taken on-site at TCG The Cliff Garden, displaying the real balcony valley view, living room, fitted modular kitchen, bedroom, and bathroom.'
    },
    {
      q: 'How can I schedule a private visit and check the flat in person?',
      a: 'You can contact 24K Realtors via WhatsApp (+91 96730 00053) or schedule a complimentary guided site visit. Our Hinjewadi Phase 3 specialist will guide you through the property.'
    }
  ]
};

export default function TcgCliffGardenProjectPage({ onBackHome, initialBhkFilter = null }) {
  const navigate = useNavigate();
  const p = TCG_DATA;

  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeAmenityTab, setActiveAmenityTab] = useState('recreational-sports');
  const [openFaq, setOpenFaq] = useState(null);
  const [showReraModal, setShowReraModal] = useState(false);
  const [selectedBhk, setSelectedBhk] = useState(initialBhkFilter);

  // SEO Hook
  useSEO({
    title: 'TCG The Cliff Garden Hinjewadi Phase 3 | 1 & 2 BHK ₹55L - ₹75L (Negotiable) | 24K Realtors',
    description: 'TCG The Cliff Garden Hinjewadi Phase 3 by TCG Real Estate. 1 BHK (462 sq.ft, ₹55L) & 2 BHK (662 sq.ft, ₹75L) negotiable. Triple MahaRERA P52100004906, P52100015759, P52100028926. Real photos, modern amenities.',
    url: '/tcg-cliff-garden-hinjewadi'
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

  const handleBack = () => {
    if (onBackHome) {
      onBackHome();
    } else if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const openWhatsApp = (extraMessage = '') => {
    const msg = extraMessage || p.whatsappText;
    window.open(`https://wa.me/919673000053?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#040814',
      color: '#FFFFFF',
      fontFamily: "'Montserrat', sans-serif"
    }}>
      {/* ── Top Navigation Bar ────────────────────────────────────────── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(20px)',
        background: 'rgba(4, 8, 20, 0.88)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
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
          {/* Left: Back & Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={handleBack}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                color: '#F3E5AB',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
                e.currentTarget.style.borderColor = '#D4AF37';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Portal</span>
            </button>

            <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <CompanyLogo variant="compact" height={36} />
            </div>
          </div>

          {/* Center: RERA Badge with Popup Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setShowReraModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                padding: '6px 12px',
                borderRadius: '6px',
                color: '#6EE7B7',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              title="Click to view all 3 MahaRERA registration numbers"
            >
              <ShieldCheck size={16} color="#10B981" />
              <span>Triple MahaRERA Verified</span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.25)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.68rem',
                fontWeight: 800,
                color: '#A7F3D0'
              }}>
                3 PHASES
              </span>
            </button>
          </div>

          {/* Right: Quick Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href="tel:+919673000053"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#E2E8F0',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
            >
              <Phone size={14} color="#D4AF37" />
              <span>Call Advisor</span>
            </a>

            <button
              onClick={() => openWhatsApp()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#22C55E',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#16A34A'}
              onMouseLeave={e => e.currentTarget.style.background = '#22C55E'}
            >
              <MessageSquare size={14} />
              <span>WhatsApp Inquiry</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Banner Section ───────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        padding: '50px 24px 60px',
        background: 'radial-gradient(ellipse at 50% 0%, #0d2822 0%, #06131b 45%, #040814 100%)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
        overflow: 'hidden'
      }}>
        {/* Subtle background ambient mesh */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-50px',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Category Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(90deg, rgba(212,175,55,0.2) 0%, rgba(16,185,129,0.2) 100%)',
              border: '1px solid rgba(212,175,55,0.4)',
              color: '#F3E5AB',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              padding: '6px 12px',
              borderRadius: '20px',
              textTransform: 'uppercase'
            }}>
              <Sparkles size={13} color="#D4AF37" />
              6th Flagship Listing · Hinjewadi Phase 3
            </span>

            <span style={{
              background: 'rgba(16,185,129,0.15)',
              border: '1px solid rgba(16,185,129,0.35)',
              color: '#34D399',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: '20px'
            }}>
              Ready to Move / Resale
            </span>

            <span style={{
              background: 'rgba(234, 179, 8, 0.15)',
              border: '1px solid rgba(234, 179, 8, 0.4)',
              color: '#FACC15',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: '20px'
            }}>
              💰 Pricing Negotiable
            </span>
          </div>

          {/* Project Title & Developer */}
          <h1 style={{
            fontFamily: "'Cinzel', 'Playfair Display', serif",
            fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            margin: '0 0 12px',
            background: 'linear-gradient(135deg, #FFFFFF 20%, #F3E5AB 60%, #D4AF37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.02em'
          }}>
            TCG The Cliff Garden
          </h1>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#94A3B8',
            fontSize: '0.95rem',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <span style={{ color: '#E2E8F0', fontWeight: 600 }}>By {p.developer}</span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#F3E5AB' }}>
              <MapPin size={15} color="#D4AF37" />
              {p.location}
            </span>
          </div>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.05rem',
            lineHeight: 1.6,
            color: '#CBD5E1',
            maxWidth: '820px',
            margin: '0 0 28px'
          }}>
            {p.heroSubline}
          </p>

          {/* Triple MahaRERA Banner */}
          <div style={{
            background: 'rgba(6, 24, 28, 0.65)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '16px 20px',
            maxWidth: '960px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '32px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <ShieldCheck size={24} color="#10B981" />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', fontWeight: 700 }}>
                  Triple MahaRERA Registration
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 800, color: '#A7F3D0', letterSpacing: '0.04em' }}>
                  P52100004906 · P52100015759 · P52100028926
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowReraModal(true)}
              style={{
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                color: '#F3E5AB',
                fontSize: '0.78rem',
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>View Phase Details</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Configuration & Price Teasers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            maxWidth: '960px'
          }}>
            {/* 1 BHK Card */}
            <div
              onClick={() => setSelectedBhk('1 BHK')}
              style={{
                background: selectedBhk === '1 BHK' ? 'rgba(16, 185, 129, 0.16)' : 'rgba(5, 12, 22, 0.7)',
                border: selectedBhk === '1 BHK' ? '1.5px solid #10B981' : '1px solid rgba(212, 175, 55, 0.25)',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
                  1 BHK Scenic Flat
                </span>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#6EE7B7',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '4px'
                }}>
                  Carpet: 462 sq.ft
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F3E5AB' }}>
                  ₹55 Lakhs
                </span>
                <span style={{ fontSize: '0.85rem', color: '#FACC15', fontWeight: 700 }}>
                  (Negotiable)
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>
                Scenic balcony valley view · Modular kitchen · Low maintenance
              </p>
            </div>

            {/* 2 BHK Card */}
            <div
              onClick={() => setSelectedBhk('2 BHK')}
              style={{
                background: selectedBhk === '2 BHK' ? 'rgba(16, 185, 129, 0.16)' : 'rgba(5, 12, 22, 0.7)',
                border: selectedBhk === '2 BHK' ? '1.5px solid #10B981' : '1px solid rgba(212, 175, 55, 0.25)',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
                  2 BHK Luxury Flat
                </span>
                <span style={{
                  background: 'rgba(212, 175, 55, 0.2)',
                  color: '#F3E5AB',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '4px'
                }}>
                  Carpet: 662 sq.ft
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F3E5AB' }}>
                  ₹75 Lakhs
                </span>
                <span style={{ fontSize: '0.85rem', color: '#FACC15', fontWeight: 700 }}>
                  (Negotiable)
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>
                Master bed with attached bath · Breakfast counter · Dual window draft
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Visual Lightbox Gallery Section (5 Real Flat Photos) ──────── */}
      <section style={{
        padding: '60px 24px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{
            fontSize: '0.72rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#10B981',
            fontWeight: 800
          }}>
            ✦ 100% Authentic On-Site Photography
          </span>
          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(1.6rem, 3vw, 2.5rem)',
            fontWeight: 800,
            margin: '8px 0 12px',
            color: '#FFFFFF'
          }}>
            Explore The Living Experience
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: '640px', margin: '0 auto' }}>
            Click any photo below to open full-screen interactive high-resolution pan & zoom viewer.
          </p>
        </div>

        {/* Big Showcase Image Viewer */}
        <div style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          background: '#070E18',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)',
          marginBottom: '20px'
        }}>
          <div style={{
            position: 'relative',
            height: 'clamp(320px, 50vw, 560px)',
            cursor: 'zoom-in'
          }}
          onClick={() => setLightboxIdx(activeGalleryIdx)}
          >
            <img
              src={p.gallery[activeGalleryIdx].src}
              alt={p.gallery[activeGalleryIdx].title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />

            {/* Dark gradient overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(4,8,20,0.9) 0%, rgba(4,8,20,0.2) 50%, transparent 100%)',
              pointerEvents: 'none'
            }} />

            {/* Fullscreen icon trigger */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx(activeGalleryIdx);
              }}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Maximize2 size={14} />
              <span>Full Screen</span>
            </button>

            {/* Bottom Caption Overlay */}
            <div style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              right: '24px',
              zIndex: 3
            }}>
              <span style={{
                display: 'inline-block',
                background: '#10B981',
                color: '#040814',
                fontSize: '0.68rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '4px',
                marginBottom: '8px',
                letterSpacing: '0.06em'
              }}>
                {p.gallery[activeGalleryIdx].tag}
              </span>
              <h3 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
                margin: '0 0 6px',
                color: '#FFFFFF'
              }}>
                {p.gallery[activeGalleryIdx].title}
              </h3>
              <p style={{
                fontSize: '0.88rem',
                color: '#CBD5E1',
                margin: 0,
                maxWidth: '750px',
                lineHeight: 1.4
              }}>
                {p.gallery[activeGalleryIdx].subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* 6 Thumbnails Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px'
        }}>
          {p.gallery.map((item, idx) => {
            const isActive = idx === activeGalleryIdx;
            return (
              <div
                key={item.id}
                onClick={() => setActiveGalleryIdx(idx)}
                style={{
                  position: 'relative',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  height: '90px',
                  cursor: 'pointer',
                  border: isActive ? '2px solid #10B981' : '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: isActive ? '0 0 16px rgba(16, 185, 129, 0.5)' : 'none',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.2s ease'
                }}
              >
                <img
                  src={item.src}
                  alt={item.roomName}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: isActive ? 'transparent' : 'rgba(0, 0, 0, 0.4)'
                }} />
                <span style={{
                  position: 'absolute',
                  bottom: '4px',
                  left: '6px',
                  right: '6px',
                  fontSize: '0.66rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  textShadow: '0 1px 3px rgba(0,0,0,0.9)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {item.roomName}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Floor Plans & Configurations Section ──────────────────────── */}
      <section style={{
        padding: '60px 24px',
        background: 'linear-gradient(180deg, #040814 0%, #07131F 50%, #040814 100%)',
        borderTop: '1px solid rgba(212, 175, 55, 0.15)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.15)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{
              fontSize: '0.72rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#D4AF37',
              fontWeight: 800
            }}>
              ✦ Verified Floor Plans & Pricing
            </span>
            <h2 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(1.6rem, 3vw, 2.5rem)',
              fontWeight: 800,
              margin: '8px 0 12px',
              color: '#FFFFFF'
            }}>
              Choose Your Hillside Home
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
              Direct mandates · Complete legal dossier · Negotiable closing prices
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px'
          }}>
            {p.configurations.map((cfg, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(7, 16, 30, 0.75)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  borderRadius: '16px',
                  padding: '32px 28px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)'
                }}
              >
                {cfg.badge && (
                  <span style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '24px',
                    background: cfg.isPopular ? '#10B981' : '#D4AF37',
                    color: '#040814',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    padding: '4px 12px',
                    borderRadius: '12px'
                  }}>
                    {cfg.badge}
                  </span>
                )}

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <h3 style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      margin: 0
                    }}>
                      {cfg.bhk}
                    </h3>
                    <span style={{
                      fontSize: '0.85rem',
                      color: '#A7F3D0',
                      fontWeight: 700,
                      background: 'rgba(16, 185, 129, 0.15)',
                      padding: '4px 10px',
                      borderRadius: '6px'
                    }}>
                      Carpet: {cfg.carpet}
                    </span>
                  </div>

                  {/* Price */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '14px 0' }}>
                    <span style={{
                      fontSize: '2rem',
                      fontWeight: 800,
                      color: '#F3E5AB'
                    }}>
                      {cfg.priceText}
                    </span>
                    <span style={{
                      fontSize: '0.9rem',
                      color: '#FACC15',
                      fontWeight: 700
                    }}>
                      {cfg.priceSub}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '20px' }}>
                    {cfg.desc}
                  </p>

                  {/* Feature Checklist */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                    {cfg.features.map((feat, fIdx) => (
                      <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          background: 'rgba(16, 185, 129, 0.15)',
                          borderRadius: '50%',
                          padding: '3px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Check size={13} color="#10B981" />
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    onClick={() => openWhatsApp(`Hi 24K Realtors, I am interested in negotiating and scheduling a visit for the ${cfg.bhk} (${cfg.carpet}, ${cfg.priceText}) at TCG The Cliff Garden Hinjewadi Phase 3.`)}
                    style={{
                      background: '#22C55E',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#16A34A'}
                    onMouseLeave={e => e.currentTarget.style.background = '#22C55E'}
                  >
                    <MessageSquare size={15} />
                    <span>Inquire Best Price</span>
                  </button>

                  <button
                    onClick={() => setLightboxIdx(0)}
                    style={{
                      background: 'rgba(212, 175, 55, 0.12)',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                      color: '#F3E5AB',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(212, 175, 55, 0.22)';
                      e.currentTarget.style.borderColor = '#D4AF37';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(212, 175, 55, 0.12)';
                      e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                    }}
                  >
                    <Eye size={15} />
                    <span>View Photos</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 Categorized Amenities Tabs Section ──────────────────────── */}
      <section style={{
        padding: '70px 24px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{
            fontSize: '0.72rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#10B981',
            fontWeight: 800
          }}>
            ✦ Resort Living & Technical Specs
          </span>
          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(1.6rem, 3vw, 2.5rem)',
            fontWeight: 800,
            margin: '8px 0 12px',
            color: '#FFFFFF'
          }}>
            Comprehensive Project Amenities
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: '640px', margin: '0 auto' }}>
            Thoughtfully planned across 4 distinct pillars for balanced work, fitness, and family life.
          </p>
        </div>

        {/* Amenity Category Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '32px'
        }}>
          {p.amenityCategories.map(cat => {
            const isActive = activeAmenityTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveAmenityTab(cat.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: isActive ? '1.5px solid #10B981' : '1px solid rgba(255, 255, 255, 0.12)',
                  background: isActive ? 'rgba(16, 185, 129, 0.18)' : 'rgba(10, 20, 32, 0.6)',
                  color: isActive ? '#A7F3D0' : '#94A3B8',
                  boxShadow: isActive ? '0 4px 18px rgba(16, 185, 129, 0.25)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Items Grid */}
        {(() => {
          const currentCat = p.amenityCategories.find(c => c.id === activeAmenityTab) || p.amenityCategories[0];
          return (
            <div>
              <div style={{
                textAlign: 'center',
                marginBottom: '24px',
                color: '#CBD5E1',
                fontSize: '0.92rem'
              }}>
                <span style={{ color: '#F3E5AB', fontWeight: 600 }}>{currentCat.subtitle}</span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '16px'
              }}>
                {currentCat.items.map((amenity, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(8, 18, 30, 0.65)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      transition: 'transform 0.2s, border-color 0.2s'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    <div style={{
                      fontSize: '1.6rem',
                      background: 'rgba(16, 185, 129, 0.12)',
                      borderRadius: '10px',
                      padding: '10px',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}>
                      {amenity.icon}
                    </div>
                    <div>
                      <h4 style={{
                        fontSize: '0.98rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        margin: '0 0 4px'
                      }}>
                        {amenity.title}
                      </h4>
                      <p style={{
                        fontSize: '0.82rem',
                        color: '#94A3B8',
                        margin: 0,
                        lineHeight: 1.45
                      }}>
                        {amenity.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </section>

      {/* ── Location & Proximity Matrix Section ───────────────────────── */}
      <section style={{
        padding: '60px 24px',
        background: 'linear-gradient(180deg, #040814 0%, #06181E 50%, #040814 100%)',
        borderTop: '1px solid rgba(212, 175, 55, 0.15)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{
              fontSize: '0.72rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#D4AF37',
              fontWeight: 800
            }}>
              ✦ Strategic Connectivity & Transit
            </span>
            <h2 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(1.6rem, 3vw, 2.5rem)',
              fontWeight: 800,
              margin: '8px 0 12px',
              color: '#FFFFFF'
            }}>
              Hinjewadi Phase 3 Hub Proximity
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
              Walking & short drive access to Pune West's largest IT tech campuses and upcoming metro terminal.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px'
          }}>
            {p.proximity.map((loc, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(7, 16, 28, 0.65)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '12px',
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#E2E8F0', marginBottom: '4px' }}>
                    {loc.label}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                    Distance: {loc.distance}
                  </div>
                </div>

                <div style={{
                  background: 'rgba(212, 175, 55, 0.15)',
                  color: '#F3E5AB',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap'
                }}>
                  {loc.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQs Section ──────────────────────────────────────────────── */}
      <section style={{
        padding: '60px 24px 80px',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{
            fontSize: '0.72rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#10B981',
            fontWeight: 800
          }}>
            ✦ Frequently Asked Questions
          </span>
          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
            fontWeight: 800,
            margin: '8px 0 12px',
            color: '#FFFFFF'
          }}>
            Buyer FAQs & Legal Verification
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {p.faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(7, 16, 28, 0.75)',
                  border: isOpen ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s'
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: '16px'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} color="#10B981" /> : <ChevronDown size={18} color="#94A3B8" />}
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 20px 18px',
                    color: '#94A3B8',
                    fontSize: '0.86rem',
                    lineHeight: 1.6,
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    paddingTop: '12px'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Fixed Bottom Sticky Bar for Mobile & Desktop ──────────────── */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 40,
        background: 'rgba(4, 8, 20, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(212, 175, 55, 0.3)',
        padding: '12px 24px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 600 }}>
              TCG The Cliff Garden · Hinjewadi Phase 3
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F3E5AB' }}>
                1 BHK ₹55L · 2 BHK ₹75L
              </span>
              <span style={{ fontSize: '0.74rem', color: '#FACC15', fontWeight: 700 }}>
                (Negotiable)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => openWhatsApp('Hi 24K Realtors, I would like to schedule a VIP site visit for TCG The Cliff Garden Hinjewadi Phase 3.')}
              style={{
                background: 'rgba(212, 175, 55, 0.15)',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                color: '#F3E5AB',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Car size={15} color="#D4AF37" />
              <span>Book Site Visit</span>
            </button>

            <button
              onClick={() => openWhatsApp()}
              style={{
                background: '#22C55E',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(34, 197, 94, 0.35)'
              }}
            >
              <MessageSquare size={15} />
              <span>Inquire on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Fullscreen Interactive Lightbox Modal ────────────────────── */}
      {lightboxIdx !== null && (
        <div
          onClick={() => setLightboxIdx(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.94)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '16px'
          }}
        >
          {/* Lightbox Top Controls */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#FFFFFF',
              zIndex: 10
            }}
          >
            <div>
              <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>
                {p.gallery[lightboxIdx].tag}
              </span>
              <h4 style={{ margin: 0, fontSize: '1rem', color: '#FFFFFF' }}>
                {p.gallery[lightboxIdx].roomName} ({lightboxIdx + 1} of {p.gallery.length})
              </h4>
            </div>

            {/* Zoom controls + close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleZoomIn}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  cursor: 'pointer'
                }}
                title="Zoom In (+)"
              >
                <ZoomIn size={16} />
              </button>

              <button
                onClick={handleZoomOut}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  cursor: 'pointer'
                }}
                title="Zoom Out (-)"
              >
                <ZoomOut size={16} />
              </button>

              <button
                onClick={resetZoom}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  cursor: 'pointer'
                }}
                title="Reset Zoom (0)"
              >
                <RotateCcw size={16} />
              </button>

              <button
                onClick={() => setLightboxIdx(null)}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  color: '#FCA5A5',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  marginLeft: '8px'
                }}
                title="Close (Esc)"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Lightbox Center Image with Pan & Zoom */}
          <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
          >
            {/* Left Nav Button */}
            <button
              onClick={() => setLightboxIdx((lightboxIdx - 1 + p.gallery.length) % p.gallery.length)}
              style={{
                position: 'absolute',
                left: '12px',
                zIndex: 10,
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={24} />
            </button>

            <img
              src={p.gallery[lightboxIdx].src}
              alt={p.gallery[lightboxIdx].title}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (zoomLevel > 1) {
                  resetZoom();
                } else {
                  setZoomLevel(2.2);
                }
              }}
              title={zoomLevel > 1 ? "Double-click to reset zoom, or drag to pan" : "Double-click to zoom in, or use buttons above"}
              style={{
                maxHeight: '80vh',
                maxWidth: '90vw',
                objectFit: 'contain',
                transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                userSelect: 'none',
                pointerEvents: 'auto',
                cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
              }}
              draggable={false}
            />

            {/* Right Nav Button */}
            <button
              onClick={() => setLightboxIdx((lightboxIdx + 1) % p.gallery.length)}
              style={{
                position: 'absolute',
                right: '12px',
                zIndex: 10,
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Lightbox Bottom Info */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              textAlign: 'center',
              color: '#CBD5E1',
              fontSize: '0.86rem',
              padding: '8px',
              zIndex: 10
            }}
          >
            {p.gallery[lightboxIdx].subtitle}
          </div>
        </div>
      )}

      {/* ── MahaRERA Registration Modal ───────────────────────────────── */}
      {showReraModal && (
        <div
          onClick={() => setShowReraModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#07121F',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={22} color="#10B981" />
                <h3 style={{ fontFamily: "'Cinzel', serif", margin: 0, color: '#FFFFFF', fontSize: '1.25rem' }}>
                  Triple MahaRERA Verification
                </h3>
              </div>
              <button
                onClick={() => setShowReraModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '20px' }}>
              Multiple phases and wings of TCG The Cliff Garden carry distinct registration numbers with the Maharashtra Real Estate Regulatory Authority (MahaRERA):
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {p.reraNumbers.map((r, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: '10px',
                    padding: '14px 16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>{r.label}</span>
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#6EE7B7',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {r.status}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '1.05rem', fontWeight: 800, color: '#F3E5AB' }}>
                    {r.number}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowReraModal(false)}
                style={{
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  color: '#F3E5AB',
                  padding: '8px 18px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
