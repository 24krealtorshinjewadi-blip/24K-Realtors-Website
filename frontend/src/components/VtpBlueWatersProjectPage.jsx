/**
 * VtpBlueWatersProjectPage.jsx — 24K Realtors
 * ─────────────────────────────────────────────────────────────────────────────
 * Ultra-Luxury Flagship Project Subpage for VTP Blue Waters,
 * Mahalunge (Hinjewadi-Baner High-Growth Corridor), Pune.
 *
 * Features:
 *  - Official VTP Blue Waters 100+ Acre Riverside Township Identity
 *  - Verified 2 BHK (640 sq.ft Carpet, ₹72 Lakhs - Negotiable) Flagship Listing
 *  - Multi-MahaRERA Trust Verification Badge (6 Registrations across phases/buildings):
 *      P52100009531, P52100009529, P52100007943, P52100026772, P52100020112, P52100019986
 *  - Full-Screen Interactive Lightbox Gallery with Pan, Zoom & Double-Click Zoom
 *  - 100% Authentic Photos: Elevation, Living Room, Modular Kitchen, Bedroom, Bathroom, Balcony
 *  - 4-Pillar Lifestyle Amenities: Riverside Leisure, Sports & Fitness, Safety & Infrastructure, Smart Interiors
 *  - Mahalunge-Hinjewadi Bridge Transit & Proximity Matrix
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
   VTP BLUE WATERS PROJECT DATA SPECIFICATION
══════════════════════════════════════════════════════════════════ */
const VTP_DATA = {
  key: 'vtp-blue-waters',
  name: 'VTP Blue Waters',
  shortName: 'Blue Waters',
  developer: 'VTP Realty',
  reraNumbers: [
    { number: 'P52100009531', label: 'Phase / Cluster A (Acheron)', status: 'Registered & Clear Title' },
    { number: 'P52100009529', label: 'Phase / Cluster B (Leonara)', status: 'Registered & Clear Title' },
    { number: 'P52100007943', label: 'Phase / Cluster C (Bel Air)', status: 'Registered & Clear Title' },
    { number: 'P52100026772', label: 'Phase / Cluster D (Alpine)', status: 'Registered & Clear Title' },
    { number: 'P52100020112', label: 'Phase / Cluster E (Earth One)', status: 'Registered & Clear Title' },
    { number: 'P52100019986', label: 'Phase / Cluster F (Town Center)', status: 'Registered & Clear Title' }
  ],
  reraSummary: 'P52100009531 · P52100009529 · P52100007943 · P52100026772 · P52100020112 · P52100019986',
  location: 'Mahalunge (Hinjewadi-Baner Annex), Pune — 411045',
  status: 'Ready to Move & Ongoing / Direct Developer & Resale Inventory',
  tagline: '100+ Acre Mega Riverside Township at Mahalunge-Hinjewadi Bridge',
  heroSubline: 'Pune West\'s largest 100+ acre integrated riverside township by VTP Realty. Featuring ready 2 BHK (640 sq.ft carpet, ₹72 Lakhs - negotiable) residences with 1 km riverfront promenade, 5 luxury clubhouses, and seamless connectivity to Hinjewadi Phase 1 & Balewadi High Street.',
  accentColor: '#0284C7',
  accentGradient: 'linear-gradient(135deg, #0369A1 0%, #0284C7 50%, #38BDF8 100%)',
  heroBg: 'radial-gradient(ellipse at 50% 0%, #0b2545 0%, #06152a 45%, #040814 100%)',
  showcaseImage: '/properties/vtp-blue-waters/00_project_card.jpg',
  investmentScore: 96,
  priceNegotiable: true,
  whatsappText: 'Hi 24K Realtors, I am interested in VTP Blue Waters Mahalunge (2 BHK 640 sq.ft carpet, ₹72 Lakhs - Negotiable). Please share floor plans, pricing breakup, and schedule a private site visit.',

  gallery: [
    {
      id: 1,
      tag: 'Township Project Showcase',
      icon: '🏢',
      roomName: 'Township Showcase',
      title: 'VTP Blue Waters — A Greener, Brighter, Better Tomorrow',
      subtitle: 'Mahalunge, Pune — A premium township living by VTP Realty. 100+ acre master township, lush green spaces, modern amenities, thoughtful design, and MahaRERA registered (P52100026772).',
      src: '/properties/vtp-blue-waters/00_project_card.jpg',
      features: [
        { icon: '🌿', title: 'Lush Green Spaces', desc: 'Nature connects better living with sprawling green acres and riverfront trails' },
        { icon: '🏊', title: 'Modern Amenities', desc: '5 grand clubhouses, Olympic pool, sports facilities, and landscaped gardens' },
        { icon: '📐', title: 'Thoughtful Design', desc: 'High-efficiency space planning with maximum natural light and ventilation' },
        { icon: '🛡️', title: 'MahaRERA Registered', desc: 'Official MahaRERA registration P52100026772 for 100% verified compliance' }
      ]
    },
    {
      id: 2,
      tag: 'Expansive Living Hall',
      icon: '🛋️',
      roomName: 'Living Room',
      title: 'Spacious Living & Dining Hall — Glossy Marble-Finish Vitrified Flooring',
      subtitle: 'Sunlit living lounge with wide safety-grilled window, elegant marble-texture vitrified floor tiles, ceiling fan fixture, and expansive space for family entertaining.',
      src: '/properties/vtp-blue-waters/02_living_room.jpg',
      features: [
        { icon: '🛋️', title: 'Generous Floorplan', desc: 'Thoughtfully planned layout accommodating full sofa lounge and 6-seater dining' },
        { icon: '✨', title: 'Marble Vitrified Tiles', desc: 'Glossy Italian-marble finish large vitrified floor tiles reflecting natural daylight' },
        { icon: '🪟', title: 'Safety-Grilled Window', desc: 'Heavy-gauge safety grill with sliding aluminum windows framing green vistas' },
        { icon: '⚡', title: 'Concealed Wiring', desc: 'Pre-wired points for split AC, TV console, concealed ceiling fan and inverter' }
      ]
    },
    {
      id: 3,
      tag: 'Modular Kitchen with Granite Counter',
      icon: '🍳',
      roomName: 'Modular Kitchen',
      title: 'Fitted Modular Kitchen — Polished Granite & Ample Cabinets',
      subtitle: 'Modern parallel/L-counter setup with jet black granite cooking platform, stainless steel sink, beige lower modular drawers, and designer marble-finish backsplash tile dado.',
      src: '/properties/vtp-blue-waters/03_kitchen.jpg',
      features: [
        { icon: '🍳', title: 'Modular Lower Drawers', desc: 'Sleek beige laminated pull-out drawers with horizontal black metal handles' },
        { icon: '🖤', title: 'Jet Black Granite', desc: 'Heavy-duty polished granite platform with smooth beveled edge finish' },
        { icon: '🍽️', title: 'Stainless Steel Sink', desc: 'Deep stainless steel sink bowl with chrome swivel neck water tap' },
        { icon: '✨', title: 'Marble Dado Tiles', desc: 'Full-length designer ceramic wall dado for effortless wipe-down cleaning' }
      ]
    },
    {
      id: 4,
      tag: 'Airy Master Bedroom',
      icon: '🛏️',
      roomName: 'Bedroom',
      title: 'Tranquil Master Bedroom — Natural Light & Peaceful Vistas',
      subtitle: 'Spacious private master retreat with large safety-grilled sliding window, pre-installed ceiling fan and tube light, glossy vitrified floors, and unhindered outdoor horizon.',
      src: '/properties/vtp-blue-waters/04_bedroom.jpg',
      features: [
        { icon: '🛏️', title: 'King-Size Layout', desc: 'Ample space for king-size bed, double nightstands, and full-length wardrobe' },
        { icon: '🌞', title: 'Sunlit Window', desc: 'Wide exterior window bringing healthy morning sunlight and cooling breezes' },
        { icon: '💡', title: 'Electrical Fixtures', desc: 'Pre-fitted energy-efficient ceiling fan and bright tube light' },
        { icon: '🍃', title: 'Acoustic Calm', desc: 'Peaceful township setting away from highway noise for restorative sleep' }
      ]
    },
    {
      id: 5,
      tag: 'Modern Ceramic Bathroom',
      icon: '🚿',
      roomName: 'Bathroom',
      title: 'Modern Finished Bathroom — Grey Marble Tiles & Water Heater',
      subtitle: 'Sleek contemporary bathroom design with grey marble-texture full-height wall tiles, wall-hung western commode, concealed flush plate, instant geyser, and ventilation window.',
      src: '/properties/vtp-blue-waters/05_bathroom.jpg',
      features: [
        { icon: '🚽', title: 'Wall-Hung Commode', desc: 'Space-saving wall-mounted ceramic commode with sleek push-button concealed flush' },
        { icon: '♨️', title: 'Water Heater / Geyser', desc: 'Pre-mounted electric storage water heater for instant hot showers' },
        { icon: '🚿', title: 'Health Faucet & Taps', desc: 'Branded chrome-plated health spray, shower diverter, and water faucets' },
        { icon: '🌫️', title: 'Grey Marble Tile Dado', desc: 'Full-height glazed grey marble-finish ceramic tiles with ventilation louvers' }
      ]
    },
    {
      id: 6,
      tag: 'Scenic Balcony View',
      icon: '🌄',
      roomName: 'Balcony',
      title: 'Private Scenic Balcony — Glass Railing & Wood-Finish Tiles',
      subtitle: 'Inviting outdoor balcony with wooden-look ceramic floor tiles, stainless steel and frosted toughened glass railing framing open green horizon and township landscapes.',
      src: '/properties/vtp-blue-waters/06_balcony.jpg',
      features: [
        { icon: '🪵', title: 'Wood-Finish Tiles', desc: 'Rich timber-grain anti-skid ceramic tiles creating a warm resort vibe' },
        { icon: '🛡️', title: 'Glass Railing', desc: 'Stainless steel handrail with frosted tempered glass panels for privacy' },
        { icon: '🌳', title: 'Open Horizon View', desc: 'Sweeping outdoor view of Pune West greenery, mountains, and skyline' },
        { icon: '☕', title: 'Outdoor Sit-Out', desc: 'Perfect space for morning coffee, evening tea, and potted plant garden' }
      ]
    },
    {
      id: 7,
      tag: '100+ Acre Township Elevation',
      icon: '🌊',
      roomName: 'Township Elevation',
      title: 'VTP Blue Waters — 100+ Acre Mega Riverside Township Landmark',
      subtitle: 'Iconic master-planned riverside township seamlessly connecting Mahalunge, Baner, and Hinjewadi Phase 1. Multi-phase MahaRERA approved with five resort clubhouses.',
      src: '/properties/vtp-blue-waters/01_elevation.png',
      features: [
        { icon: '🌊', title: '1 km River Promenade', desc: 'Scenic Mula-Mutha riverfront walkway with nature trails & green decks' },
        { icon: '🏛️', title: '5 Mega Clubhouses', desc: 'Resort-grade lifestyle hubs with Olympic-sized pools and banquet facilities' },
        { icon: '🛡️', title: 'Multi-RERA Compliance', desc: 'Six distinct RERA registrations assuring 100% legal title transparency' },
        { icon: '🌉', title: 'Bridge to Hinjewadi', desc: 'Direct bridge connecting Mahalunge to Hinjewadi Phase 1 in just 5 mins' }
      ]
    }
  ],

  configurations: [
    {
      bhk: '2 BHK',
      badge: 'FEATURED MANDATE',
      isPopular: true,
      carpet: '640 sq.ft',
      priceText: '₹72 Lakhs',
      priceSub: '(Negotiable)',
      desc: 'Smartly designed 2 BHK home featuring a spacious marble-tiled living-dining hall, modular kitchen with black granite counter, master suite with grey marble bath, and private wood-tiled balcony.',
      features: [
        '640 sq.ft Verified RERA Carpet Area',
        'Private Balcony with Glass Railing & Wood-Finish Tiles',
        'Pre-Fitted Modular Kitchen with Granite Platform',
        'Grey Marble Finished Bathroom with Pre-Mounted Geyser',
        'Direct Bridge Access to Hinjewadi Phase 1 & Balewadi',
        'Price Negotiable · Ready for Immediate Registration'
      ]
    },
    {
      bhk: '1 BHK',
      badge: 'STARTER OPTION',
      isPopular: false,
      carpet: '450+ sq.ft',
      priceText: 'Price on Request',
      priceSub: '(Negotiable)',
      desc: 'Compact, high-efficiency 1 BHK residence within the mega township. Exceptional rental demand from Hinjewadi tech corridor workforce.',
      features: [
        '450+ sq.ft Optimized Carpet Area',
        'Full Access to 5 Mega Clubhouses & Riverfront',
        'Walking Distance to Township High-Street Retail',
        'Direct Hinjewadi Bridge Connectivity in 5 Mins',
        'Strong Capital Appreciation in Mahalunge Corridor'
      ]
    },
    {
      bhk: '3 BHK',
      badge: 'TOWNSHIP RESIDENCE',
      isPopular: false,
      carpet: '850 - 1050 sq.ft',
      priceText: 'Price on Request',
      priceSub: '(Family Luxury)',
      desc: 'Large 3 BHK luxury residences with multiple balconies, river views, and premium imported fittings across luxury tower clusters.',
      features: [
        '850 - 1050 sq.ft Expansive RERA Carpet',
        'Direct Mula-Mutha River Views from Balconies',
        'Dedicated Covered Car Parking Bays',
        'High-Speed Elevators with Automatic Rescue Devices',
        'Exclusive Tower Amenity Access'
      ]
    }
  ],

  // 4 Core Amenity Categories
  amenityCategories: [
    {
      id: 'riverside-leisure',
      title: 'Riverside & Leisure',
      subtitle: '1 km riverfront promenade, nature walks, and resort lifestyle',
      badge: 'WATERFRONT LIVING',
      icon: '🌊',
      items: [
        { icon: '🌊', title: '1 km Riverside Promenade', desc: 'Paved, illuminated riverfront walking trail with shaded benches and pergolas' },
        { icon: '🏛️', title: '5 Grand Clubhouses', desc: 'Multiple world-class clubhouses with banquet halls, lounges, and indoor recreation' },
        { icon: '🏊‍♂️', title: 'Olympic-Sized Swimming Pools', desc: 'Multiple lap pools, leisure pools, and dedicated toddler splash arenas' },
        { icon: '🎭', title: 'Open-Air Amphitheatre', desc: 'Tiered waterfront amphitheatre for cultural performances and community festivals' },
        { icon: '🎪', title: 'Barbecue & Party Lawns', desc: 'Lush landscaped green lawns for social gatherings and private family celebrations' },
        { icon: '🧒', title: 'Multi-Age Kids Adventure Parks', desc: 'Theme play zones with rubberized safety flooring, slides, and obstacle courses' }
      ]
    },
    {
      id: 'sports-fitness',
      title: 'Sports & Fitness',
      subtitle: 'Championship courts, indoor arenas, and wellness tracks',
      badge: 'ACTIVE LIVING',
      icon: '🏆',
      items: [
        { icon: '🏋️‍♂️', title: 'High-Tech Gymnasium & Aerobics', desc: 'State-of-the-art cardio decks, strength machines, and personal training studio' },
        { icon: '🏸', title: 'Badminton & Squash Courts', desc: 'Indoor wooden-floored professional courts with spectator seating' },
        { icon: '🎾', title: 'Tennis & Basketball Courts', desc: 'Floodlit acrylic sports courts for evening matches and tournaments' },
        { icon: '🏏', title: 'Cricket Practice Pitch', desc: 'Net-enclosed practice pitch with automated bowling machine provision' },
        { icon: '🏃‍♂️', title: 'Rubberized Jogging Track', desc: 'Continuous multi-kilometer jogging and cycling trails winding through green belts' },
        { icon: '🧘‍♀️', title: 'Sunrise Yoga & Meditation Pavilion', desc: 'Calm riverfront deck facing the morning sunrise for wellness' }
      ]
    },
    {
      id: 'safety-infrastructure',
      title: 'Convenience & Safety',
      subtitle: 'Multi-tier surveillance, high-speed transit, and eco-systems',
      badge: 'SMART TOWNSHIP',
      icon: '🛡️',
      items: [
        { icon: '🎥', title: '24/7 Multi-Tier Security & CCTV', desc: 'Automated boom barriers, RFID vehicle entry, and central command surveillance' },
        { icon: '🛗', title: 'High-Speed Elevators with ARD', desc: 'Branded passenger and stretcher elevators with Automatic Rescue Device backup' },
        { icon: '⚡', title: '100% DG Power Backup', desc: 'Uninterrupted generator backup for all common utilities, elevators, and pumps' },
        { icon: '🚗', title: 'Covered Resident Parking', desc: 'Multi-level covered parking bays with designated guest parking and EV bays' },
        { icon: '🛍️', title: 'High-Street Retail & Daily Mart', desc: 'On-campus grocery stores, pharmacy, salon, and daily essential shopping' },
        { icon: '💧', title: 'Rainwater Harvesting & STP', desc: 'Eco-sustainable water conservation and sewage treatment recycling' }
      ]
    },
    {
      id: 'smart-interiors',
      title: 'Internal Apartment Features',
      subtitle: 'Premium finishes, modular kitchen, branded bath fittings',
      badge: 'APARTMENT SPECS',
      icon: '✨',
      items: [
        { icon: '💎', title: 'Italian Marble Finish Tiles', desc: 'Large reflective vitrified floor tiles across living room, dining, and bedrooms' },
        { icon: '🪵', title: 'Wood-Finish Balcony Flooring', desc: 'Resort-style timber grain anti-skid ceramic tiles on the scenic balcony' },
        { icon: '🍳', title: 'Fitted Granite Kitchen Platform', desc: 'Jet black granite counter with stainless steel sink and beige lower storage' },
        { icon: '🚿', title: 'Branded Sanitary & CP Fittings', desc: 'Wall-hung commode with concealed flush, chrome diverter, and water heater' },
        { icon: '🪟', title: 'Safety-Grilled Aluminum Windows', desc: 'Heavy-gauge MS safety grills with smooth sliding powder-coated windows' },
        { icon: '🔌', title: 'Concealed Copper Wiring', desc: 'Fire-resistant conduits with branded modular switches and inverter point' }
      ]
    }
  ],

  proximity: [
    { label: 'Mahalunge-Hinjewadi Bridge', distance: '800 m', time: '2 mins' },
    { label: 'Hinjewadi Phase 1 IT Park', distance: '2.5 km', time: '5 mins' },
    { label: 'Balewadi High Street / Baner', distance: '3.8 km', time: '8 mins' },
    { label: 'Wakad Junction / Phoenix Mall', distance: '4.5 km', time: '8 mins' },
    { label: 'Mumbai-Pune Expressway Bypass', distance: '5.2 km', time: '10 mins' },
    { label: 'Jupiter Hospital Baner', distance: '6.5 km', time: '12 mins' },
    { label: 'Proposed Metro Line 3 Station', distance: '2.2 km', time: '5 mins' }
  ],

  faqs: [
    {
      q: 'Why does VTP Blue Waters have multiple MahaRERA registration numbers?',
      a: 'VTP Blue Waters is a massive 100+ acre integrated township comprising distinct residential clusters, high-rise phases, and commercial blocks (such as Acheron, Leonara, Bel Air, Alpine, Earth One, and Town Center). Each cluster is registered with MahaRERA under its own dedicated registration number: P52100009531, P52100009529, P52100007943, P52100026772, P52100020112, and P52100019986.'
    },
    {
      q: 'What is the carpet area and price of the featured 2 BHK residence?',
      a: 'The featured 2 BHK residence offers 640 sq.ft of verified MahaRERA carpet area at an asking price of ₹72 Lakhs (Negotiable). It includes a marble-finish living room, modular kitchen, master bedroom, ceramic bathroom with geyser, and a scenic wood-tiled balcony.'
    },
    {
      q: 'Is the price of ₹72 Lakhs negotiable?',
      a: 'Yes, the price of ₹72 Lakhs is negotiable. 24K Realtors assists you directly with price negotiations to secure the best closing value.'
    },
    {
      q: 'How does VTP Blue Waters connect to Hinjewadi Phase 1?',
      a: 'VTP Blue Waters is situated right at the Mahalunge-Hinjewadi bridge corridor. Across the newly constructed bridge, you reach Hinjewadi Phase 1 (Infosys, Wipro, Quadron) in just 5 minutes without facing highway traffic.'
    },
    {
      q: 'Are the photographs on this page authentic?',
      a: 'Yes, 100% of the interior and balcony photos shown here are authentic photographs taken directly inside the actual flat at VTP Blue Waters.'
    },
    {
      q: 'How can I schedule a private inspection of this 2 BHK flat?',
      a: 'You can contact 24K Realtors via WhatsApp (+91 96730 00053) or telephone. Our dedicated Mahalunge-Hinjewadi advisor will arrange an immediate on-site site visit.'
    }
  ]
};

export default function VtpBlueWatersProjectPage({ onBackHome }) {
  const navigate = useNavigate();
  const p = VTP_DATA;

  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeAmenityTab, setActiveAmenityTab] = useState('riverside-leisure');
  const [openFaq, setOpenFaq] = useState(null);
  const [showReraModal, setShowReraModal] = useState(false);

  // SEO Hook
  useSEO({
    title: 'VTP Blue Waters Mahalunge Pune | 2 BHK 640 Sq.Ft ₹72L (Negotiable) | 24K Realtors',
    description: 'VTP Blue Waters Mahalunge Pune by VTP Realty. 2 BHK 640 sq.ft carpet @ ₹72 Lakhs negotiable. Multi-MahaRERA P52100009531, P52100009529, P52100007943. 100+ acre riverside township.',
    url: '/vtp-blue-waters-mahalunge'
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
      {/* ── Top Navigation Bar ────────────────────────────────────────── */}
      <header className="subpage-topbar-wrapper">
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}>
          {/* Left: Back & Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleBack}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(2, 132, 199, 0.1)',
                border: '1px solid rgba(2, 132, 199, 0.35)',
                color: '#BAE6FD',
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '0.80rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minHeight: '38px',
                touchAction: 'manipulation'
              }}
              title="Return to Main Portal"
            >
              <ArrowLeft size={16} />
              <span className="subpage-hide-mobile">Back to Portal</span>
            </button>

            <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <CompanyLogo variant="compact" height={32} />
            </div>
          </div>

          {/* Center: RERA Badge with Popup Trigger (Desktop Only) */}
          <div className="subpage-hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setShowReraModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(2, 132, 199, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.45)',
                padding: '6px 12px',
                borderRadius: '6px',
                color: '#38BDF8',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              title="Click to view all 6 MahaRERA registration numbers"
            >
              <ShieldCheck size={16} color="#38BDF8" />
              <span>Multi-MahaRERA Verified</span>
              <span style={{
                background: 'rgba(2, 132, 199, 0.35)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.68rem',
                fontWeight: 800,
                color: '#E0F2FE'
              }}>
                6 CLUSTERS
              </span>
            </button>
          </div>

          {/* Right: Quick Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a
              href="tel:+919673000053"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#E2E8F0',
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '0.80rem',
                fontWeight: 600,
                textDecoration: 'none',
                minHeight: '38px',
                touchAction: 'manipulation',
                transition: 'background 0.2s'
              }}
              title="Call Senior Advisor Neeraj Giri"
            >
              <Phone size={14} color="#38BDF8" />
              <span className="subpage-hide-mobile">Call Advisor</span>
            </a>

            <button
              onClick={() => openWhatsApp()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                background: '#22C55E',
                color: '#FFFFFF',
                border: 'none',
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.80rem',
                fontWeight: 700,
                cursor: 'pointer',
                minHeight: '38px',
                touchAction: 'manipulation',
                boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)',
                transition: 'all 0.2s'
              }}
              title="Direct WhatsApp Inquiry"
            >
              <MessageSquare size={14} />
              <span className="subpage-hide-mobile">WhatsApp</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Banner Section ───────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        padding: '50px 24px 60px',
        background: 'radial-gradient(ellipse at 50% 0%, #0c2d48 0%, #06182e 45%, #040814 100%)',
        borderBottom: '1px solid rgba(2, 132, 199, 0.2)',
        overflow: 'hidden'
      }}>
        {/* Ambient mesh */}
        <div style={{
          position: 'absolute',
          top: '-120px',
          right: '-60px',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(2, 132, 199, 0.18) 0%, transparent 70%)',
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
              background: 'linear-gradient(90deg, rgba(2,132,199,0.25) 0%, rgba(56,189,248,0.2) 100%)',
              border: '1px solid rgba(56,189,248,0.4)',
              color: '#BAE6FD',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.12em',
              padding: '6px 12px',
              borderRadius: '20px',
              textTransform: 'uppercase'
            }}>
              <Sparkles size={13} color="#38BDF8" />
              7th Flagship Listing · 100+ Acre Riverside Township
            </span>

            <span style={{
              background: 'rgba(2,132,199,0.18)',
              border: '1px solid rgba(2,132,199,0.4)',
              color: '#7DD3FC',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '6px 12px',
              borderRadius: '20px'
            }}>
              Mahalunge · Hinjewadi Bridge
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
              💰 Price: ₹72 Lakhs (Negotiable)
            </span>
          </div>

          {/* Project Title & Developer */}
          <h1 style={{
            fontFamily: "'Cinzel', 'Playfair Display', serif",
            fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            margin: '0 0 12px',
            background: 'linear-gradient(135deg, #FFFFFF 20%, #BAE6FD 60%, #38BDF8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.02em'
          }}>
            VTP Blue Waters
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
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#BAE6FD' }}>
              <MapPin size={15} color="#38BDF8" />
              {p.location}
            </span>
          </div>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.05rem',
            lineHeight: 1.6,
            color: '#CBD5E1',
            maxWidth: '840px',
            margin: '0 0 28px'
          }}>
            {p.heroSubline}
          </p>

          {/* Multi-MahaRERA Banner */}
          <div style={{
            background: 'rgba(8, 24, 44, 0.7)',
            border: '1px solid rgba(2, 132, 199, 0.35)',
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
                background: 'rgba(2, 132, 199, 0.2)',
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                <ShieldCheck size={24} color="#38BDF8" />
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94A3B8', fontWeight: 700 }}>
                  Multi-Phase Township MahaRERA Registrations
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.92rem', fontWeight: 800, color: '#BAE6FD', letterSpacing: '0.02em' }}>
                  P52100009531 · P52100009529 · P52100007943 · P52100026772 · P52100020112 · P52100019986
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowReraModal(true)}
              style={{
                background: 'rgba(2, 132, 199, 0.18)',
                border: '1px solid rgba(56, 189, 248, 0.45)',
                color: '#BAE6FD',
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
              <span>View All 6 Clusters</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Featured Configuration Highlight Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(8, 28, 54, 0.8) 0%, rgba(5, 16, 32, 0.9) 100%)',
            border: '1.5px solid rgba(56, 189, 248, 0.45)',
            borderRadius: '14px',
            padding: '24px 28px',
            maxWidth: '960px',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontFamily: "'Cinzel', serif", fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF' }}>
                    2 BHK Luxury Riverside Residence
                  </span>
                  <span style={{
                    background: 'rgba(2, 132, 199, 0.25)',
                    color: '#7DD3FC',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '4px'
                  }}>
                    Carpet: 640 sq.ft
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: '#F3E5AB' }}>
                    ₹72 Lakhs
                  </span>
                  <span style={{ fontSize: '0.95rem', color: '#FACC15', fontWeight: 700 }}>
                    (Negotiable)
                  </span>
                </div>
                <p style={{ fontSize: '0.84rem', color: '#94A3B8', margin: '6px 0 0' }}>
                  Marble-finish living hall · Fitted granite kitchen · Master bedroom · Ceramic bathroom with geyser · Wood-finish balcony
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => openWhatsApp('Hi 24K Realtors, I want to discuss and negotiate the price for the 2 BHK (640 sq.ft, ₹72 Lakhs) at VTP Blue Waters Mahalunge.')}
                  style={{
                    background: '#22C55E',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)'
                  }}
                >
                  <MessageSquare size={16} />
                  <span>Negotiate & Inquire</span>
                </button>

                <button
                  onClick={() => setLightboxIdx(0)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#FFFFFF',
                    padding: '12px 18px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Eye size={16} />
                  <span>View 6 Photos</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Visual Lightbox Gallery Section (6 Photos) ───────────────── */}
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
            color: '#38BDF8',
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
            Click any photo below to inspect full-screen interactive high-resolution pan & zoom viewer.
          </p>
        </div>

        {/* Big Showcase Image Viewer */}
        <div style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(2, 132, 199, 0.35)',
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
                background: '#0284C7',
                color: '#FFFFFF',
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
                  border: isActive ? '2px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: isActive ? '0 0 16px rgba(56, 189, 248, 0.5)' : 'none',
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
        background: 'linear-gradient(180deg, #040814 0%, #06182C 50%, #040814 100%)',
        borderTop: '1px solid rgba(2, 132, 199, 0.2)',
        borderBottom: '1px solid rgba(2, 132, 199, 0.2)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{
              fontSize: '0.72rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#38BDF8',
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
              Choose Your Riverside Residence
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
              Direct mandates · Complete legal dossier · Negotiable closing values
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {p.configurations.map((cfg, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(7, 20, 38, 0.75)',
                  border: cfg.isPopular ? '1.5px solid #38BDF8' : '1px solid rgba(2, 132, 199, 0.3)',
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
                    background: cfg.isPopular ? '#0284C7' : 'rgba(255,255,255,0.2)',
                    color: '#FFFFFF',
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
                      color: '#BAE6FD',
                      fontWeight: 700,
                      background: 'rgba(2, 132, 199, 0.2)',
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
                          background: 'rgba(2, 132, 199, 0.2)',
                          borderRadius: '50%',
                          padding: '3px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Check size={13} color="#38BDF8" />
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    onClick={() => openWhatsApp(`Hi 24K Realtors, I am interested in negotiating and scheduling a visit for the ${cfg.bhk} (${cfg.carpet}, ${cfg.priceText}) at VTP Blue Waters Mahalunge.`)}
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
                      background: 'rgba(2, 132, 199, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.4)',
                      color: '#BAE6FD',
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
                      e.currentTarget.style.background = 'rgba(2, 132, 199, 0.25)';
                      e.currentTarget.style.borderColor = '#38BDF8';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(2, 132, 199, 0.15)';
                      e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
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
            color: '#38BDF8',
            fontWeight: 800
          }}>
            ✦ 100+ Acre Mega Township Lifestyle
          </span>
          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(1.6rem, 3vw, 2.5rem)',
            fontWeight: 800,
            margin: '8px 0 12px',
            color: '#FFFFFF'
          }}>
            World-Class Resort Infrastructure
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: '640px', margin: '0 auto' }}>
            Master-planned across 4 distinct pillars providing waterfront leisure, Olympic sports, and smart living.
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
                  border: isActive ? '1.5px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.12)',
                  background: isActive ? 'rgba(2, 132, 199, 0.22)' : 'rgba(10, 20, 32, 0.6)',
                  color: isActive ? '#BAE6FD' : '#94A3B8',
                  boxShadow: isActive ? '0 4px 18px rgba(2, 132, 199, 0.3)' : 'none',
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
                      background: 'rgba(8, 22, 42, 0.65)',
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
                      e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.45)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    <div style={{
                      fontSize: '1.6rem',
                      background: 'rgba(2, 132, 199, 0.18)',
                      borderRadius: '10px',
                      padding: '10px',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(56, 189, 248, 0.3)'
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
        background: 'linear-gradient(180deg, #040814 0%, #081d36 50%, #040814 100%)',
        borderTop: '1px solid rgba(2, 132, 199, 0.2)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{
              fontSize: '0.72rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#38BDF8',
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
              Mahalunge-Hinjewadi Bridge Connectivity
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
              Direct bridge corridor to Hinjewadi Phase 1, Baner high street, and expressway bypass.
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
                  background: 'rgba(7, 20, 38, 0.65)',
                  border: '1px solid rgba(2, 132, 199, 0.25)',
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
                  background: 'rgba(2, 132, 199, 0.2)',
                  color: '#BAE6FD',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
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
            color: '#38BDF8',
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
                  background: 'rgba(7, 20, 38, 0.75)',
                  border: isOpen ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
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
                  {isOpen ? <ChevronUp size={18} color="#38BDF8" /> : <ChevronDown size={18} color="#94A3B8" />}
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
        borderTop: '1px solid rgba(2, 132, 199, 0.3)',
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
              VTP Blue Waters · Mahalunge-Hinjewadi
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F3E5AB' }}>
                2 BHK (640 sq.ft) · ₹72 Lakhs
              </span>
              <span style={{ fontSize: '0.74rem', color: '#FACC15', fontWeight: 700 }}>
                (Negotiable)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => openWhatsApp('Hi 24K Realtors, I would like to schedule a VIP site visit for VTP Blue Waters Mahalunge.')}
              style={{
                background: 'rgba(2, 132, 199, 0.18)',
                border: '1px solid rgba(56, 189, 248, 0.45)',
                color: '#BAE6FD',
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
              <Car size={15} color="#38BDF8" />
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
              <span style={{ fontSize: '0.78rem', color: '#38BDF8', fontWeight: 700 }}>
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
              cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
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

      {/* ── Multi-MahaRERA Registration Modal ───────────────────────── */}
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
              background: '#07162C',
              border: '1px solid rgba(56, 189, 248, 0.45)',
              borderRadius: '16px',
              padding: '28px',
              maxWidth: '620px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.85)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={22} color="#38BDF8" />
                <h3 style={{ fontFamily: "'Cinzel', serif", margin: 0, color: '#FFFFFF', fontSize: '1.25rem' }}>
                  Multi-Phase Township MahaRERA Verification
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
              VTP Blue Waters in Mahalunge, Pune is an expansive 100+ acre mega township comprising distinct residential clusters and high-rise phases. Each cluster carries its own independent MahaRERA registration:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px', marginBottom: '24px' }}>
              {p.reraNumbers.map((r, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(2, 132, 199, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: '10px',
                    padding: '12px 14px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 600 }}>{r.label}</span>
                    <span style={{
                      background: 'rgba(2, 132, 199, 0.25)',
                      color: '#BAE6FD',
                      fontSize: '0.64rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      Verified
                    </span>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 800, color: '#F3E5AB' }}>
                    {r.number}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowReraModal(false)}
                style={{
                  background: 'rgba(2, 132, 199, 0.2)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  color: '#BAE6FD',
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
