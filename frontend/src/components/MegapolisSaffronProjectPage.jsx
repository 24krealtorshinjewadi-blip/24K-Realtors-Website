/**
 * MegapolisSaffronProjectPage.jsx — 24K Realtors
 * ─────────────────────────────────────────────────────────────────────────────
 * Ultra-Luxury Flagship Project Subpage for Megapolis Saffron,
 * Hinjewadi Phase 3, Pune.
 *
 * Project Specifications:
 *  - Project Name: Megapolis Saffron
 *  - Developer: Pegasus Properties (Megapolis Township)
 *  - Location: Hinjawadi Phase 3, Rajiv Gandhi Infotech Park, Pune — 411057
 *  - Status: Ready-to-Move (Occupancy Certificates Received)
 *  - Triple MahaRERA Registration:
 *      • Megapolis Saffron (Phases A3 to A9): P52100018779 (Residential / Group Housing)
 *      • Megapolis Saffron (Phases A10 to A14): P52100021609 (Residential / Group Housing)
 *      • Megapolis Saffron (Shops): P52100034988 (Commercial High-Street Retail)
 *  - Configurations & Exact Carpet Areas:
 *      • 1 BHK Apartments: 444 to 445 sq. ft.
 *      • 2 BHK Apartments: 617 to 637 sq. ft. (with select larger layouts scaling up to 698 sq. ft.)
 *  - Integrated Amenities:
 *      • Fitness & Recreation: Gymnasium, Swimming Pool, Grand Clubhouse
 *      • Sports & Outdoors: Jogging Track, Tennis Court, Children Play Area, Landscaped Greens
 *      • Commercial High Street: Ground-level commercial shops (MahaRERA P52100034988)
 *      • Convenience & Safety: 24x7 Security & CCTV Grid, 100% DG Power Backup, Car Parking
 *  - 100% Authentic On-Site Photos:
 *      • Fitted Modular Kitchen with L-shaped Black Granite Platform & Designer Cabinets
 *      • Spacious Living Hall with Sofa-cum-bed & Hallway View
 *      • Sunlit Master Bedroom with Work-From-Home Desk & Double Bed
 *      • Living Room towards Balcony with Sliding Glass Doors & Tower Vista
 *      • Modern Designer Bathroom with Geometric Patterned Wall Tiles & Wall-Hung Commode
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
  Copy, ArrowRight, Share2, Calendar, ShoppingBag, Store
} from 'lucide-react';
import { useSEO } from '../services/seoService';
import CompanyLogo from './CompanyLogo';

/* ══════════════════════════════════════════════════════════════════
   MEGAPOLIS SAFFRON PROJECT DATA SPECIFICATION
══════════════════════════════════════════════════════════════════ */
const SAFFRON_DATA = {
  key: 'megapolis-saffron',
  name: 'Megapolis Saffron',
  shortName: 'Saffron',
  developer: 'Pegasus Properties (Megapolis)',
  reraNumbers: [
    {
      number: 'P52100018779',
      label: 'Phases A3 to A9',
      type: 'Residential / Group Housing',
      status: 'Registered & Clear Title (OC Received)'
    },
    {
      number: 'P52100021609',
      label: 'Phases A10 to A14',
      type: 'Residential / Group Housing',
      status: 'Registered & Clear Title (OC Received)'
    },
    {
      number: 'P52100034988',
      label: 'Saffron Commercial Shops',
      type: 'Commercial / High Street Retail',
      status: 'Registered & Clear Title'
    }
  ],
  reraSummary: 'P52100018779 · P52100021609 · P52100034988',
  location: 'Hinjawadi Phase 3, Rajiv Gandhi Infotech Park, Pune — 411057',
  status: 'Ready-to-Move',
  tagline: 'Ready 1 & 2 BHK Smart Homes with Integrated High-Street Commercial Shops',
  heroSubline: 'Prime ready-to-move residential & commercial cluster in the 142-acre Megapolis Township. Featuring smart 1 BHK (444–445 sq.ft) and 2 BHK (617–637 sq.ft, up to 698 sq.ft) apartments, triple MahaRERA registration, on-campus shopping arcades, and walking distance to Tech Mahindra & TCS.',
  accentColor: '#F97316',
  accentGradient: 'linear-gradient(135deg, #EA580C 0%, #F97316 50%, #FBBF24 100%)',
  heroBg: 'linear-gradient(160deg, #050814 0%, #170d05 45%, #080c18 100%)',
  showcaseImage: '/megapolis_saffron_kitchen.jpg',
  investmentScore: 97,
  priceNegotiable: true,
  whatsappText: 'Hi 24K Realtors, I am interested in Megapolis Saffron Hinjewadi Phase 3 (Ready 1 BHK 445 sq.ft / 2 BHK 637 sq.ft - Negotiable). Please share floor plans, pricing breakup, and schedule a private site visit.',

  gallery: [
    {
      id: 1,
      tag: 'Fitted Modular Kitchen',
      icon: '🍳',
      roomName: 'Modular Kitchen',
      title: 'Fitted Modular Kitchen — Black Granite Counter & Custom Cabinets',
      subtitle: 'L-shaped polished jet-black granite countertop with dual-tone geometric patterned storage cabinets, smooth sliding drawers, stainless steel sink with drainboard, gas pipeline connection, and sunny window view.',
      src: '/megapolis_saffron_kitchen.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '🖤', title: 'L-Shaped Black Granite Counter', desc: 'Heavy-duty polished platform providing extensive cooking and appliance prep space' },
        { icon: '🗄️', title: 'Designer Patterned Cabinets', desc: 'Custom blue-and-white geometric laminate shutters with smooth-glide stainless steel pullouts' },
        { icon: '🚰', title: 'Sink with Drainboard', desc: 'Deep-bowl stainless steel wash sink equipped with integrated drying board and swivel tap' },
        { icon: '🪟', title: 'Natural Daylight Window', desc: 'Direct exterior window for kitchen ventilation, steam release, and ambient sunlight' }
      ]
    },
    {
      id: 2,
      tag: 'Spacious Living Lounge',
      icon: '🛋️',
      roomName: 'Living Hall',
      title: 'Bright Living Hall — Versatile Family Living Space',
      subtitle: 'Airy, open living hall with reflective vitrified tile flooring, twin daylight tube fittings, ceiling fan, space for sofa-cum-bed, study workstation, mandir corner, and central passage to master bedroom.',
      src: '/megapolis_saffron_living.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '🛋️', title: 'Multi-Purpose Living Layout', desc: 'Ample floor space accommodating daytime seating, sofa-cum-bed, dining and prayer mandir' },
        { icon: '✨', title: 'Vitrified Gloss Flooring', desc: 'High-grade reflective white ceramic floor tiles creating an open, expansive aesthetic' },
        { icon: '🚪', title: 'Private Passage Corridor', desc: 'Thoughtfully planned hallway shielding bedroom and bathroom quarters from the main entrance' },
        { icon: '⚡', title: 'Modular Electrical Grid', desc: 'Concealed copper electrical circuits with multiple device charging points and inverter readiness' }
      ]
    },
    {
      id: 3,
      tag: 'Sunlit Master Bedroom',
      icon: '🛏️',
      roomName: 'Master Bedroom',
      title: 'Comfortable Master Bedroom — Work-From-Home Haven',
      subtitle: 'Peaceful bedroom retreat featuring wooden king-size double bed with integrated base storage drawers, side table, ergonomic work desk with office chair, and serene privacy.',
      src: '/megapolis_saffron_bedroom.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '🛏️', title: 'Queen/King Bed Space', desc: 'Spacious layout comfortably accommodating double bed with under-bed storage drawers' },
        { icon: '💻', title: 'Work-From-Home Station', desc: 'Dedicated corner with power points for laptop, monitor, ergonomic chair and bookshelves' },
        { icon: '🍃', title: 'Tranquil Acoustic Privacy', desc: 'Acoustically separated from living areas, offering restful sleep after demanding IT shifts' },
        { icon: '❄️', title: 'AC Conduit Provision', desc: 'Pre-installed copper piping and electrical points for split air conditioner installation' }
      ]
    },
    {
      id: 4,
      tag: 'Living to Balcony Vista',
      icon: '🌿',
      roomName: 'Balcony Aperture',
      title: 'Living Room Balcony Vista — Sliding Glass Aperture & Skyline View',
      subtitle: 'View from the living room looking towards the full-height sliding glass balcony doors, presenting natural daylight, views of surrounding high-rise towers, and space for TV console setup.',
      src: '/megapolis_saffron_balcony.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '🚪', title: 'Full-Height Sliding Doors', desc: 'Smooth UPVC glass sliding doorway maximizing daylight ingress and evening breezes' },
        { icon: '🏙️', title: 'Megapolis Tower Views', desc: 'Unobstructed perspective overlooking the modern architecture of Megapolis smart township' },
        { icon: '📺', title: 'Media Console Zone', desc: 'Convenient wall-alignment for LCD/LED television, set-top box, and high-speed Wi-Fi router' },
        { icon: '☕', title: 'Fresh Air Circulation', desc: 'Direct balcony connectivity keeping the entire apartment naturally ventilated and fresh' }
      ]
    },
    {
      id: 5,
      tag: 'Designer Fitted Bathroom',
      icon: '🚿',
      roomName: 'Modern Bathroom',
      title: 'Modern Bathroom — Geometric Tile Dado & Wall-Hung Sanitaryware',
      subtitle: 'Contemporary bathroom featuring full-height grey and white geometric wall tiles, wall-mounted western commode with concealed flush plate, chrome health faucet, washbasin with mirror, and counter ledge.',
      src: '/megapolis_saffron_bathroom.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '🚽', title: 'Wall-Hung Commode', desc: 'Modern space-saving wall-mounted water closet with concealed in-wall flush actuator plate' },
        { icon: '🎨', title: 'Designer Geometric Tiles', desc: 'Striking monochrome geometric ceramic dado tiles protecting walls and enhancing elegance' },
        { icon: '🧼', title: 'Washbasin & Toiletry Ledge', desc: 'Ceramic basin with chrome bib tap and full-width granite ledge for toiletries and daily essentials' },
        { icon: '🚿', title: 'Branded Chrome Fixtures', desc: 'Hot & cold mixer unit, handheld bidet spray, and geyser electrical connections' }
      ]
    }
  ],

  configurations: [
    {
      bhk: '1 BHK',
      badge: 'HIGH RENTAL DEMAND',
      type: '1 BHK Smart Residence (444 – 445 sq.ft)',
      carpet: '444 – 445 sq.ft. Carpet Area',
      carpetNum: 445,
      priceRange: '₹46 Lakhs – ₹52 Lakhs',
      priceText: '₹47 Lakhs (Negotiable)',
      status: 'Ready-to-Move',
      possession: 'Immediate Occupancy',
      highlight: true,
      description: 'Compact, ultra-efficient 1 BHK residence tailored for IT bachelors and young couples. Features 444–445 sq.ft. of zero-wastage carpet area with a fitted modular kitchen, comfortable bedroom, living room, and modern bathroom.',
      specs: [
        'Carpet Area: 444 to 445 sq.ft. Carpet Space',
        'Spacious Living Hall with Natural Light',
        'Fitted Modular Kitchen with Granite Counter',
        'Comfortable Bedroom with WFH Workstation Space',
        'Modern Bathroom with Wall-Hung Commode & Geometric Tiles',
        'Rental Yield: 5.6%+ with constant IT tenant pipeline'
      ]
    },
    {
      bhk: '2 BHK',
      badge: 'FAMILY FAVORITE',
      type: '2 BHK Standard & Grand (617 – 698 sq.ft)',
      carpet: '617 – 637 sq.ft. (Scaling up to 698 sq.ft.)',
      carpetNum: 637,
      priceRange: '₹64 Lakhs – ₹75 Lakhs',
      priceText: '₹68 Lakhs (Negotiable)',
      status: 'Ready-to-Move',
      possession: 'Immediate Occupancy',
      highlight: false,
      description: 'Generously proportioned 2 BHK homes ranging from 617 to 637 sq.ft. of carpet space, with premium corner and higher-floor layouts scaling up to 698 sq.ft. Features 2 bedrooms, 2 bathrooms, sit-out balcony, and utility space.',
      specs: [
        'Carpet Area: 617 – 637 sq.ft. (Select layouts up to 698 sq.ft.)',
        '2 Large Bedrooms + 2 Bathrooms (Master En-Suite)',
        'Attached Sit-Out Balcony with Skyline Vista',
        'L-Shaped Modular Kitchen with Utility Alcove',
        'Registered under MahaRERA: P52100018779 & P52100021609',
        'Ready to Move with Full Occupancy Certificate (OC)'
      ]
    },
    {
      bhk: 'COMMERCIAL',
      badge: 'HIGH FOOTFALL RETAIL',
      type: 'Saffron High-Street Shops (Ground Level)',
      carpet: 'Commercial Retail Spaces (MahaRERA: P52100034988)',
      carpetNum: 350,
      priceRange: '₹35 Lakhs – ₹85 Lakhs',
      priceText: 'On Request (Negotiable)',
      status: 'Ready Operational',
      possession: 'Ready for Business',
      highlight: false,
      description: 'Dedicated ground-level commercial retail shops registered under MahaRERA P52100034988. Serving 10,000+ residents within Megapolis with captive footfall for grocery stores, pharmacies, clinics, cafes, and daily services.',
      specs: [
        'MahaRERA Registered Commercial: P52100034988',
        'High Road Frontage with Wide Pedestrian Walkways',
        'Captive Customer Base from 5,000+ Megapolis Households',
        'Ideal for Supermarkets, Pharmacies, Salons & Eateries',
        'Dedicated Power Backup & Customer Parking Bays'
      ]
    }
  ],

  amenityPillars: [
    {
      id: 'fitness-recreation',
      title: 'Fitness & Recreation',
      subtitle: 'Health, wellness, exercise, and leisure within the campus',
      badge: 'FITNESS & LEISURE',
      icon: '🏋️',
      color: '#F97316',
      items: [
        {
          icon: '🏋️‍♂️',
          title: 'Equipped Gymnasium',
          desc: 'Modern gym with cardio machines, weight stations, dumbbells, and fitness studio for daily workouts.'
        },
        {
          icon: '🏊‍♂️',
          title: 'Swimming Pool & Deck',
          desc: 'Well-maintained swimming pool with shallow kids splash section, poolside loungers, and clean shower rooms.'
        },
        {
          icon: '🏛️',
          title: 'Community Clubhouse',
          desc: 'Air-conditioned multipurpose clubhouse for social functions, birthday celebrations, and indoor leisure games.'
        }
      ]
    },
    {
      id: 'sports-outdoors',
      title: 'Sports & Outdoors',
      subtitle: 'Fresh air active recreation, running tracks, and children play zones',
      badge: 'OUTDOOR LIVING',
      icon: '🎾',
      color: '#10B981',
      items: [
        {
          icon: '🏃‍♂️',
          title: 'Jogging & Strolling Track',
          desc: 'Paved tree-lined jogging track running through manicured green lawns and fresh Sahyadri breezes.'
        },
        {
          icon: '🎾',
          title: 'Tennis & Badminton Courts',
          desc: 'All-weather sports courts with safety boundary fencing and floodlight illumination.'
        },
        {
          icon: '🧒',
          title: 'Children Adventure Play Park',
          desc: 'Dedicated kids park with rubberized soft flooring, swings, slides, and secure play frames.'
        },
        {
          icon: '🌳',
          title: 'Landscaped Podium Gardens',
          desc: 'Acutely landscaped flower beds, sitting gazebos, and senior citizens peaceful sit-out areas.'
        }
      ]
    },
    {
      id: 'commercial-convenience',
      title: 'Commercial Shops & Safety',
      subtitle: 'On-campus high-street shopping arcade, 24x7 security, and essential utilities',
      badge: 'RETAIL & SAFETY',
      icon: '🛍️',
      color: '#3B82F6',
      items: [
        {
          icon: '🛒',
          title: 'Megapolis Saffron Commercial Shops',
          desc: 'Ground-level retail high-street (MahaRERA P52100034988) housing convenience marts, laundry, medical pharmacy, and ATM.'
        },
        {
          icon: '🎥',
          title: '24x7 Security & CCTV Grid',
          desc: 'Round-the-clock trained guards, boom barriers, intercom connectivity, and comprehensive CCTV camera surveillance.'
        },
        {
          icon: '⚡',
          title: '100% DG Power Backup',
          desc: 'Heavy-duty diesel generators supplying uninterrupted power to elevators, water pumps, and common corridor lights.'
        },
        {
          icon: '🚗',
          title: 'Covered Resident & Visitor Parking',
          desc: 'Allotted covered parking spaces with wide internal driveway roads and demarcated guest parking slots.'
        }
      ]
    }
  ],

  transit: [
    { title: 'Tech Mahindra Hinjewadi Phase 3', dist: '400 meters', time: '2 mins walk', icon: '🏢' },
    { title: 'TCS Sahyadri Park Campus', dist: '600 meters', time: '4 mins walk', icon: '💼' },
    { title: 'Cognizant Phase 3 Campus', dist: '800 meters', time: '5 mins walk', icon: '💻' },
    { title: 'Pawar Public School', dist: '300 meters', time: 'Inside Campus', icon: '🏫' },
    { title: 'Upcoming Megapolis Metro Station', dist: '400 meters', time: '3 mins walk', icon: '🚇' },
    { title: 'Saffron High-Street Retail Arcade', dist: '0 meters', time: 'Downstairs', icon: '🛍️' },
    { title: 'Wipro Circle (Phase 2)', dist: '4.2 km', time: '8 mins drive', icon: '🚗' },
    { title: 'Mumbai-Pune Expressway', dist: '14 km', time: '18 mins drive', icon: '🛣️' }
  ],

  faqs: [
    {
      q: 'What are the MahaRERA registration numbers for Megapolis Saffron?',
      a: 'Megapolis Saffron is registered under three official MahaRERA numbers: (1) Phases A3 to A9: P52100018779 (Residential/Group Housing); (2) Phases A10 to A14: P52100021609 (Residential/Group Housing); and (3) Megapolis Saffron Shops: P52100034988 (Commercial High-Street Retail). All hold verified clear legal titles with zero encumbrance.'
    },
    {
      q: 'What are the exact carpet area configurations in Megapolis Saffron?',
      a: 'Megapolis Saffron offers 1 BHK and 2 BHK residences: 1 BHK apartments typically have a carpet area of 444 to 445 sq. ft. 2 BHK apartments typically range from 617 to 637 sq. ft., with select larger layouts scaling up to 698 sq. ft. Commercial retail shops are also available on the ground level.'
    },
    {
      q: 'Is Megapolis Saffron ready to move in?',
      a: 'Yes, Megapolis Saffron is a fully ready-to-move residential cluster with complete Occupancy Certificates (OC). You can take immediate possession, move in, or begin earning rental income immediately.'
    },
    {
      q: 'What are the commercial shops in Megapolis Saffron?',
      a: 'Megapolis Saffron features a dedicated commercial shopping arcade registered under MahaRERA P52100034988. It caters to the day-to-day shopping, grocery, pharmacy, salon, and banking needs of over 10,000 residents living in Megapolis Township.'
    },
    {
      q: 'What are the expected prices and rental returns?',
      a: 'Ready 1 BHK apartments start around ₹46L–₹52L (negotiable) generating ₹18,000–₹22,000 monthly rent. Ready 2 BHK apartments range from ₹64L–₹75L (negotiable) generating ₹24,000–₹28,000 monthly rent, delivering one of the highest rental yields in Hinjewadi Phase 3.'
    },
    {
      q: 'Is Pawar Public School accessible from Saffron?',
      a: 'Yes. The renowned Pawar Public School (CBSE) is situated directly inside the Megapolis Township boundary, just 300 meters walking distance from Saffron, eliminating long highway school bus commutes.'
    },
    {
      q: 'Are the displayed photographs authentic?',
      a: 'Yes, 100% of the photos shown in this dossier are authentic photographs taken on-site inside Megapolis Saffron, showing the real fitted modular kitchen, living room, master bedroom, balcony view, and designer bathroom.'
    }
  ],

  seo: {
    title: 'Megapolis Saffron Hinjewadi Phase 3 | Ready 1 & 2 BHK Flats | MahaRERA P52100018779, P52100021609 | 24K Realtors',
    description: 'Megapolis Saffron in Hinjewadi Phase 3, Pune. Ready-to-move 1 BHK (444-445 sq.ft) & 2 BHK (617-637 sq.ft up to 698 sq.ft) flats with commercial shops (P52100034988). Dual residential MahaRERA P52100018779 & P52100021609. Authentic photos & negotiable pricing.',
    keywords: 'Megapolis Saffron, Megapolis Saffron Hinjewadi Phase 3, Megapolis 1 BHK 445 sqft, Megapolis 2 BHK 637 sqft, MahaRERA P52100018779, P52100021609, P52100034988, Megapolis Saffron Shops, Megapolis Township Hinjewadi, Ready to move flats Hinjewadi Phase 3, 24K Realtors'
  }
};

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT: MegapolisSaffronProjectPage
══════════════════════════════════════════════════════════════════ */
export default function MegapolisSaffronProjectPage({ initialBhkFilter = null, onBackHome = null }) {
  const navigate = useNavigate();
  const p = SAFFRON_DATA;

  // SEO Injection
  useSEO({
    title: p.seo.title,
    description: p.seo.description,
    keywords: p.seo.keywords,
    canonicalUrl: 'https://24krealtors.com/megapolis-saffron'
  });

  // State Management
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [selectedBhk, setSelectedBhk] = useState(initialBhkFilter || 'ALL');
  const [openFaq, setOpenFaq] = useState(0);
  const [copiedRera, setCopiedRera] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [modalForm, setModalForm] = useState({ name: '', phone: '', bhk: '1 BHK (445 sq.ft)', date: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Sync initial BHK filter prop if changed
  useEffect(() => {
    if (initialBhkFilter) setSelectedBhk(initialBhkFilter);
  }, [initialBhkFilter]);

  // Lightbox Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, activePhotoIdx]);

  // Gallery Controls
  const openLightbox = (index) => {
    setActivePhotoIdx(index);
    setZoomLevel(1);
    setRotation(0);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setZoomLevel(1);
    setRotation(0);
  };

  const nextPhoto = () => {
    setActivePhotoIdx((prev) => (prev + 1) % p.gallery.length);
    setZoomLevel(1);
    setRotation(0);
  };

  const prevPhoto = () => {
    setActivePhotoIdx((prev) => (prev - 1 + p.gallery.length) % p.gallery.length);
    setZoomLevel(1);
    setRotation(0);
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.35, 3));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.35, 0.7));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  // Copy RERA Helper
  const copyReraNumber = (rera) => {
    navigator.clipboard.writeText(rera);
    setCopiedRera(rera);
    setTimeout(() => setCopiedRera(''), 3000);
  };

  // WhatsApp Helper
  const openWhatsApp = (customText) => {
    const text = customText || p.whatsappText;
    window.open(`https://wa.me/919673000053?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Site Visit Submit
  const handleModalSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    const text = `Hi 24K Realtors, I want to schedule a VIP site visit for Megapolis Saffron Hinjewadi Phase 3.\n\nName: ${modalForm.name}\nPhone: ${modalForm.phone}\nPreferred Configuration: ${modalForm.bhk}\nPreferred Date: ${modalForm.date || 'Earliest Available'}\nNotes: ${modalForm.message || 'Please share pricing & layout plans.'}`;
    setTimeout(() => {
      openWhatsApp(text);
      setShowScheduleModal(false);
      setFormSubmitted(false);
      setModalForm({ name: '', phone: '', bhk: '1 BHK (445 sq.ft)', date: '', message: '' });
    }, 1200);
  };

  // Back Navigation Helper
  const handleBack = () => {
    if (onBackHome) onBackHome();
    else navigate('/townships/megapolis');
  };

  const activePhoto = p.gallery[activePhotoIdx];
  const filteredConfigs = selectedBhk === 'ALL'
    ? p.configurations
    : p.configurations.filter(c => c.bhk === selectedBhk);

  return (
    <div style={{ minHeight: '100vh', background: '#040814', color: '#F8FAFC', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", overflowX: 'hidden' }}>
      
      {/* ── Background Ambience Glows ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '55vw', height: '55vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.09) 0%, transparent 70%)', filter: 'blur(70px)' }} />
        <div style={{ position: 'absolute', top: '35%', right: '-15%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '20%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', filter: 'blur(70px)' }} />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .saffron-orange-btn {
          background: linear-gradient(135deg, #F97316 0%, #EA580C 100%);
          color: #FFFFFF;
          font-weight: 700;
          letter-spacing: 0.03em;
          border: none;
          box-shadow: 0 4px 20px rgba(249,115,22,0.35);
          transition: all 0.3s ease;
        }
        .saffron-orange-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(249,115,22,0.55);
          background: linear-gradient(135deg, #FB923C 0%, #F97316 100%);
        }
        .saffron-outline-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(249,115,22,0.4);
          color: #FED7AA;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .saffron-outline-btn:hover {
          background: rgba(249,115,22,0.12);
          border-color: #F97316;
          transform: translateY(-2px);
        }
        .saffron-card-hover {
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .saffron-card-hover:hover {
          transform: translateY(-5px);
          border-color: rgba(249,115,22,0.45) !important;
          box-shadow: 0 16px 40px rgba(0,0,0,0.5);
        }
        .photo-thumb-btn {
          transition: all 0.25s ease;
        }
        .photo-thumb-btn:hover {
          transform: scale(1.03);
          border-color: #F97316 !important;
        }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .hero-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .gallery-layout-grid { grid-template-columns: 1fr !important; }
          .amenity-grid-3col { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════
          1. STICKY LUXURY NAVIGATION TOPBAR
      ══════════════════════════════════════════════════════════════ */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(4, 8, 20, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(249, 115, 22, 0.25)',
        padding: '12px 24px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          
          {/* Left: Brand + Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={handleBack}
              aria-label="Back to Megapolis Township"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                padding: '7px 12px',
                color: '#CBD5E1',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <ArrowLeft size={15} />
              <span className="hide-mobile">Megapolis Township</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => navigate('/')} role="button">
              <CompanyLogo style={{ height: '36px', width: 'auto', cursor: 'pointer' }} />
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '10px' }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.95rem', fontWeight: 800, color: '#FED7AA', letterSpacing: '0.04em' }}>
                  MEGAPOLIS SAFFRON
                </div>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Hinjewadi Phase 3 · 1 &amp; 2 BHK + Commercial
                </div>
              </div>
            </div>
          </div>

          {/* Right: Dual Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a
              href="tel:+919673000053"
              className="hide-mobile vapour-phone-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(249,115,22,0.3)',
                padding: '8px 16px',
                borderRadius: '30px',
                color: '#FFF4D0',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <Phone size={14} color="#F97316" />
              <span>+91 96730 00053</span>
            </a>

            <button
              onClick={() => openWhatsApp(p.whatsappText)}
              className="saffron-orange-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '30px',
                fontSize: '0.84rem',
                cursor: 'pointer'
              }}
            >
              <MessageSquare size={15} />
              <span>WhatsApp Dossier</span>
            </button>
          </div>

        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════
          2. HERO SECTION — CINZEL ELEVATION & TRIPLE MAHARERA BANNER
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        zIndex: 1,
        padding: '50px 24px 40px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        {/* Breadcrumb text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#94A3B8', marginBottom: '18px' }}>
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#CBD5E1' }}>Home</span>
          <span>/</span>
          <span onClick={() => navigate('/townships')} style={{ cursor: 'pointer', color: '#CBD5E1' }}>Townships</span>
          <span>/</span>
          <span onClick={() => navigate('/townships/megapolis')} style={{ cursor: 'pointer', color: '#CBD5E1' }}>Megapolis Township</span>
          <span>/</span>
          <span style={{ color: '#F97316', fontWeight: 600 }}>Megapolis Saffron</span>
        </div>

        {/* Triple MahaRERA Verification Banner */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          background: 'linear-gradient(90deg, rgba(249,115,22,0.14) 0%, rgba(16,185,129,0.12) 100%)',
          border: '1px solid rgba(249,115,22,0.35)',
          borderRadius: '14px',
          padding: '12px 20px',
          marginBottom: '26px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.2)', border: '1px solid #10B981', padding: '4px 10px', borderRadius: '6px', color: '#6EE7B7', fontSize: '0.75rem', fontWeight: 800 }}>
              <ShieldCheck size={14} />
              <span>TRIPLE MAHARERA REGISTERED</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', color: '#E2E8F0', fontWeight: 600 }}>Phases &amp; RERA:</span>
              
              <button
                onClick={() => copyReraNumber('P52100018779')}
                title="A3 to A9 (Residential)"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px dashed rgba(249,115,22,0.6)',
                  color: '#FED7AA',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <span>A3-A9: P52100018779</span>
                <Copy size={12} color="#F97316" />
              </button>

              <button
                onClick={() => copyReraNumber('P52100021609')}
                title="A10 to A14 (Residential)"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px dashed rgba(249,115,22,0.6)',
                  color: '#FED7AA',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <span>A10-A14: P52100021609</span>
                <Copy size={12} color="#F97316" />
              </button>

              <button
                onClick={() => copyReraNumber('P52100034988')}
                title="Commercial Shops"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px dashed rgba(59,130,246,0.6)',
                  color: '#93C5FD',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <span>Shops: P52100034988</span>
                <Copy size={12} color="#60A5FA" />
              </button>

              {copiedRera && (
                <span style={{ color: '#4ADE80', fontSize: '0.75rem', fontWeight: 600 }}>
                  ✓ Copied {copiedRera}!
                </span>
              )}
            </div>
          </div>

          <a
            href="https://maharera.maharashtra.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#93C5FD',
              fontSize: '0.78rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <span>Verify on MahaRERA Portal</span>
            <ExternalLink size={13} />
          </a>
        </div>

        {/* Project Title Block */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '20px', padding: '5px 14px', marginBottom: '14px' }}>
            <Sparkles size={13} color="#F97316" />
            <span style={{ fontSize: '0.75rem', color: '#FED7AA', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Pegasus Properties · Ready-to-Move · Hinjawadi Phase 3
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(2rem, 5vw, 3.4rem)',
            fontWeight: 800,
            color: '#FFFFFF',
            lineHeight: 1.15,
            letterSpacing: '0.02em',
            margin: '0 0 14px 0'
          }}>
            Megapolis Saffron
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: '#CBD5E1',
            maxWidth: '850px',
            lineHeight: 1.6,
            margin: '0 0 20px 0'
          }}>
            {p.heroSubline}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '0.88rem' }}>
              <MapPin size={16} color="#F97316" />
              <span>Hinjawadi Phase 3, Rajiv Gandhi Infotech Park, Pune</span>
            </div>
            <span style={{ color: '#475569' }}>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ADE80', fontSize: '0.88rem', fontWeight: 600 }}>
              <CheckCircle2 size={16} color="#4ADE80" />
              <span>Ready-to-Move (Full OC Received)</span>
            </div>
            <span style={{ color: '#475569' }}>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60A5FA', fontSize: '0.88rem', fontWeight: 600 }}>
              <Store size={15} color="#60A5FA" />
              <span>Ground Floor Commercial High-Street</span>
            </div>
          </div>
        </div>

        {/* Key Project Metrics Grid */}
        <div className="hero-stats-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          marginBottom: '32px'
        }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px 18px' }}>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Configurations</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FED7AA' }}>1 &amp; 2 BHK</div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>+ Commercial Retail</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '12px', padding: '16px 18px' }}>
            <div style={{ fontSize: '0.72rem', color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>1 BHK Carpet</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>444 – 445 sq.ft.</div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>High Rental Yield (5.6%+)</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px 18px' }}>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>2 BHK Carpet</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>617 – 637 sq.ft.</div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Select layouts up to 698 sq.ft.</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '16px 18px' }}>
            <div style={{ fontSize: '0.72rem', color: '#6EE7B7', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Starting Price</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4ADE80' }}>₹46L – ₹75L</div>
            <div style={{ fontSize: '0.72rem', color: '#A7F3D0' }}>Negotiable via 24K</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px 18px' }}>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>IT Commute</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#93C5FD' }}>2–4 Mins Walk</div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Tech Mahindra &amp; TCS</div>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="saffron-orange-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '9px',
              padding: '14px 28px',
              borderRadius: '10px',
              fontSize: '0.98rem',
              cursor: 'pointer'
            }}
          >
            <Calendar size={18} />
            <span>Schedule Private Site Visit</span>
          </button>

          <button
            onClick={() => openWhatsApp(`Hi 24K Realtors, please share the full brochure, price sheet, and floor plan PDF for Megapolis Saffron Hinjewadi Phase 3.`)}
            className="saffron-outline-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '9px',
              padding: '14px 26px',
              borderRadius: '10px',
              fontSize: '0.98rem',
              cursor: 'pointer'
            }}
          >
            <MessageSquare size={18} color="#F97316" />
            <span>Request Layouts &amp; Price Breakdown</span>
          </button>

          <a
            href="tel:+919673000053"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '10px',
              padding: '14px 22px',
              color: '#CBD5E1',
              fontSize: '0.95rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <Phone size={17} />
            <span>Speak with Advisor</span>
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          3. 100% AUTHENTIC SITE PHOTOS INTERACTIVE GALLERY & LIGHTBOX
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        zIndex: 1,
        padding: '50px 24px 60px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34D399', fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: '4px', marginBottom: '8px' }}>
              ✓ 100% AUTHENTIC ON-SITE PHOTOGRAPHS
            </div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 700, color: '#FED7AA', margin: 0 }}>
              Megapolis Saffron — Actual Residence Tour
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', margin: '6px 0 0' }}>
              Real photographs captured on-site inside Megapolis Saffron. Click any photo to launch full-screen interactive pan &amp; zoom mode.
            </p>
          </div>

          <button
            onClick={() => openLightbox(activePhotoIdx)}
            className="saffron-outline-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              cursor: 'pointer'
            }}
          >
            <Maximize2 size={16} />
            <span>Open Interactive Lightbox</span>
          </button>
        </div>

        {/* Gallery Interactive Stage */}
        <div className="gallery-layout-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px', alignItems: 'start' }}>
          
          {/* Main Large Display Frame */}
          <div style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#0B1120',
            border: '1px solid rgba(249,115,22,0.3)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
          }}>
            <div style={{ position: 'relative', height: '440px', overflow: 'hidden', cursor: 'zoom-in' }} onClick={() => openLightbox(activePhotoIdx)}>
              <img
                src={activePhoto.src}
                alt={activePhoto.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
              />

              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,8,20,0.92) 0%, rgba(4,8,20,0.2) 50%, transparent 100%)' }} />

              {/* Verified Watermark Badge */}
              <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(4,8,20,0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(249,115,22,0.4)', borderRadius: '6px', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.9rem' }}>{activePhoto.icon}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FED7AA' }}>{activePhoto.tag}</span>
              </div>

              {/* Click to Expand Trigger */}
              <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(4,8,20,0.85)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#E2E8F0' }}>
                <Maximize2 size={13} color="#F97316" />
                <span>Tap for Full View</span>
              </div>

              {/* Caption Overlay */}
              <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px' }}>
                <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {activePhoto.badge}
                </div>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px 0' }}>
                  {activePhoto.title}
                </h3>
                <p style={{ color: '#CBD5E1', fontSize: '0.84rem', margin: 0, lineHeight: 1.45 }}>
                  {activePhoto.subtitle}
                </p>
              </div>
            </div>

            {/* Left/Right Quick Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', background: 'rgba(11,17,32,0.95)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={prevPhoto}
                  style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', borderRadius: '6px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={nextPhoto}
                  style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', borderRadius: '6px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <ChevronRight size={18} />
                </button>
                <span style={{ fontSize: '0.8rem', color: '#94A3B8', marginLeft: '6px' }}>
                  Photo {activePhotoIdx + 1} of {p.gallery.length}
                </span>
              </div>

              <button
                onClick={() => openLightbox(activePhotoIdx)}
                style={{ background: 'none', border: 'none', color: '#F97316', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
              >
                <span>Pan &amp; Zoom</span>
                <ZoomIn size={14} />
              </button>
            </div>
          </div>

          {/* Right Thumbnails & Feature Highlights */}
          <div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '12px' }}>
              Select On-Site Photo
            </div>

            {/* Thumbnail Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '20px' }}>
              {p.gallery.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActivePhotoIdx(idx)}
                  className="photo-thumb-btn"
                  style={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#040814',
                    border: activePhotoIdx === idx ? '2px solid #F97316' : '1px solid rgba(255,255,255,0.12)',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <img src={item.src} alt={item.roomName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {activePhotoIdx === idx && (
                    <div style={{ position: 'absolute', inset: 0, border: '2px solid #F97316' }} />
                  )}
                </button>
              ))}
            </div>

            {/* Room Features Breakdown Card */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '1.2rem' }}>{activePhoto.icon}</span>
                <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.05rem', fontWeight: 700, color: '#FED7AA', margin: 0 }}>
                  {activePhoto.roomName} Highlights
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activePhoto.features.map((feat, fIdx) => (
                  <div key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ fontSize: '1.1rem', marginTop: '2px' }}>{feat.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#FFFFFF' }}>{feat.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#94A3B8', lineHeight: 1.4 }}>{feat.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          4. CONFIGURATIONS & CARPET AREA EXPLORER (1 & 2 BHK + SHOPS)
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        zIndex: 1,
        padding: '50px 24px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '20px', padding: '4px 14px', marginBottom: '10px' }}>
            <Layers size={13} color="#F97316" />
            <span style={{ fontSize: '0.72rem', color: '#FED7AA', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Carpet Space &amp; Floor Options
            </span>
          </div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', fontWeight: 700, color: '#FFFFFF', margin: '0 0 10px 0' }}>
            RERA-Verified Configurations
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', maxWidth: '640px', margin: '0 auto' }}>
            1 BHK (444–445 sq.ft) &amp; 2 BHK (617–637 sq.ft up to 698 sq.ft) residences, plus commercial retail shops. MahaRERA: P52100018779, P52100021609 &amp; P52100034988.
          </p>

          {/* Configuration Filter Tabs */}
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', borderRadius: '30px', padding: '4px', marginTop: '20px', border: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap' }}>
            {['ALL', '1 BHK', '2 BHK', 'COMMERCIAL'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedBhk(tab)}
                style={{
                  background: selectedBhk === tab ? 'linear-gradient(135deg, #F97316, #EA580C)' : 'transparent',
                  color: selectedBhk === tab ? '#FFFFFF' : '#CBD5E1',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '7px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab === 'ALL' ? 'All Units' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Configuration Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredConfigs.map((cfg, idx) => (
            <div
              key={idx}
              className="saffron-card-hover"
              style={{
                position: 'relative',
                background: cfg.highlight ? 'linear-gradient(145deg, rgba(249,115,22,0.12) 0%, rgba(4,8,20,0.85) 60%)' : 'rgba(255,255,255,0.03)',
                border: cfg.highlight ? '1px solid rgba(249,115,22,0.45)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {/* Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{
                  background: cfg.highlight ? '#F97316' : 'rgba(255,255,255,0.1)',
                  color: '#FFFFFF',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  padding: '4px 10px',
                  borderRadius: '4px'
                }}>
                  {cfg.badge}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#4ADE80', fontSize: '0.75rem', fontWeight: 600 }}>
                  <CheckCircle2 size={14} />
                  <span>{cfg.possession}</span>
                </div>
              </div>

              <div>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.35rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px 0' }}>
                  {cfg.type}
                </h3>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#F97316', marginBottom: '12px' }}>
                  📐 {cfg.carpet}
                </div>

                <p style={{ color: '#CBD5E1', fontSize: '0.86rem', lineHeight: 1.5, margin: '0 0 18px 0' }}>
                  {cfg.description}
                </p>

                {/* Specs List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px' }}>
                  {cfg.specs.map((sp, sIdx) => (
                    <div key={sIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.82rem', color: '#94A3B8' }}>
                      <Check size={14} color="#10B981" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{sp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & Booking Footer */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Indicative Pricing</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4ADE80' }}>{cfg.priceText}</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#CBD5E1', background: 'rgba(255,255,255,0.06)', padding: '4px 8px', borderRadius: '4px' }}>
                    Negotiable via 24K
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    onClick={() => openWhatsApp(`Hi 24K Realtors, I am interested in scheduling a site visit for the ${cfg.bhk} (${cfg.carpet}) at Megapolis Saffron Hinjewadi Phase 3. Please share price sheet & floor plan.`)}
                    className="saffron-orange-btn"
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    Inquire on WhatsApp
                  </button>

                  <button
                    onClick={() => {
                      setModalForm(prev => ({ ...prev, bhk: cfg.type }));
                      setShowScheduleModal(true);
                    }}
                    className="saffron-outline-btn"
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    Schedule Visit
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          5. 3-PILLAR AMENITIES & COMMERCIAL HIGH-STREET GRID
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        zIndex: 1,
        padding: '60px 24px',
        maxWidth: '1280px',
        margin: '0 auto',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '20px', padding: '4px 14px', marginBottom: '10px' }}>
            <Award size={13} color="#F97316" />
            <span style={{ fontSize: '0.72rem', color: '#FED7AA', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Lifestyle, Commercial &amp; Safety
            </span>
          </div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', fontWeight: 700, color: '#FFFFFF', margin: '0 0 10px 0' }}>
            Complete Community Infrastructure
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', maxWidth: '640px', margin: '0 auto' }}>
            Integrated with fitness gyms, swimming pool, sports courts, and ground-level commercial high-street retail shops for ultimate day-to-day convenience.
          </p>
        </div>

        {/* 3 Columns for 3 Pillars */}
        <div className="amenity-grid-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {p.amenityPillars.map((pillar) => (
            <div
              key={pillar.id}
              className="saffron-card-hover"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Pillar Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
                <span style={{ fontSize: '1.6rem' }}>{pillar.icon}</span>
                <div>
                  <div style={{ fontSize: '0.68rem', color: pillar.color, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{pillar.badge}</div>
                  <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.2rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>{pillar.title}</h3>
                </div>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '18px', lineHeight: 1.4 }}>
                {pillar.subtitle}
              </p>

              {/* Pillar Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                {pillar.items.map((item, iIdx) => (
                  <div key={iIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{ fontSize: '1.2rem', marginTop: '2px' }}>{item.icon}</span>
                    <div>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FED7AA', margin: '0 0 3px 0' }}>{item.title}</h4>
                      <p style={{ fontSize: '0.78rem', color: '#CBD5E1', margin: 0, lineHeight: 1.45 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Commercial High-Street Special Banner */}
        <div style={{
          marginTop: '32px',
          background: 'linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(59,130,246,0.12) 100%)',
          border: '1px solid rgba(249,115,22,0.35)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(59,130,246,0.2)', border: '1px solid #3B82F6', color: '#93C5FD', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, marginBottom: '8px' }}>
              <Store size={13} />
              <span>COMMERCIAL HIGH-STREET RETAIL ARCADE (RERA: P52100034988)</span>
            </div>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.3rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px 0' }}>
              Megapolis Saffron Commercial Shops
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.85rem', margin: 0, maxWidth: '680px', lineHeight: 1.45 }}>
              Ground-level operational shops with guaranteed footfall from 10,000+ residents living in the surrounding Megapolis clusters. Prime roadside frontage, customer parking, and high business visibility.
            </p>
          </div>

          <button
            onClick={() => openWhatsApp('Hi 24K Realtors, I am interested in Megapolis Saffron Commercial Shops (MahaRERA P52100034988). Please share available retail sizes, pricing and rental details.')}
            className="saffron-orange-btn"
            style={{
              padding: '12px 22px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            Inquire for Retail Shops
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          6. STRATEGIC TRANSIT & COMMUTE MATRIX
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        zIndex: 1,
        padding: '50px 24px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '20px', padding: '4px 14px', marginBottom: '10px' }}>
            <Compass size={13} color="#60A5FA" />
            <span style={{ fontSize: '0.72rem', color: '#93C5FD', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Strategic Hinjawadi Phase 3 Hub
            </span>
          </div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', fontWeight: 700, color: '#FFFFFF', margin: '0 0 10px 0' }}>
            Walk to Work Proximity Matrix
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', maxWidth: '640px', margin: '0 auto' }}>
            Unrivalled walking distance to Tech Mahindra, TCS Sahyadri, Cognizant, and Pawar Public School.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {p.transit.map((t, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.3rem' }}>{t.icon}</span>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF' }}>{t.title}</div>
                  <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>{t.dist}</div>
                </div>
              </div>

              <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#6EE7B7', fontSize: '0.72rem', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                {t.time}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          7. TRIPLE MAHARERA COMPLIANCE & LEGAL TRANSPARENCY
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        zIndex: 1,
        padding: '50px 24px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(249,115,22,0.08) 0%, rgba(16,185,129,0.06) 100%)',
          border: '1px solid rgba(249,115,22,0.35)',
          borderRadius: '18px',
          padding: '36px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '28px',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.18)', border: '1px solid #10B981', color: '#34D399', fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: '4px', marginBottom: '12px' }}>
              <ShieldCheck size={14} />
              <span>100% LEGAL &amp; TITLE DUE DILIGENCE</span>
            </div>

            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.6rem', fontWeight: 700, color: '#FED7AA', margin: '0 0 10px 0' }}>
              Triple MahaRERA Compliance
            </h3>

            <p style={{ color: '#CBD5E1', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 16px 0' }}>
              Megapolis Saffron is governed by three distinct registration certificates covering all residential towers and commercial retail arcades. Verified by 24K Realtors Legal Desk.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {p.reraNumbers.map((r, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '8px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FED7AA', fontFamily: 'monospace' }}>{r.number}</span>
                      <span style={{ fontSize: '0.72rem', color: '#60A5FA', background: 'rgba(59,130,246,0.15)', padding: '2px 6px', borderRadius: '4px' }}>{r.type}</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '2px' }}>{r.label} — {r.status}</div>
                  </div>
                  <button
                    onClick={() => copyReraNumber(r.number)}
                    style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', color: '#FED7AA', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Copy size={12} />
                    <span>Copy</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(4,8,20,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '24px' }}>
            <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 12px 0' }}>
              Buyer &amp; Investor Advantages
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', color: '#CBD5E1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={15} color="#10B981" />
                <span>Ready-to-move homes with immediate rental income generation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={15} color="#10B981" />
                <span>Home loan approvals active from SBI, HDFC, ICICI &amp; Axis Bank</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={15} color="#10B981" />
                <span>High appreciation corridor next to upcoming Line 3 Metro terminal</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={15} color="#10B981" />
                <span>On-campus retail shops providing daily living ease</span>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <button
                onClick={() => openWhatsApp('Hi 24K Realtors, please share the MahaRERA certificates and verified legal documentation for Megapolis Saffron Hinjewadi Phase 3.')}
                className="saffron-orange-btn"
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '8px',
                  fontSize: '0.86rem',
                  cursor: 'pointer'
                }}
              >
                Request Legal Title Pack
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          8. FREQUENTLY ASKED QUESTIONS (ACCORDION)
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        zIndex: 1,
        padding: '50px 24px 60px',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '20px', padding: '4px 14px', marginBottom: '10px' }}>
            <HelpCircle size={13} color="#F97316" />
            <span style={{ fontSize: '0.72rem', color: '#FED7AA', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Buyer &amp; Tenant FAQ
            </span>
          </div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {p.faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: openFaq === idx ? '1px solid #F97316' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'all 0.25s ease'
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                style={{
                  width: '100%',
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.94rem',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp size={18} color="#F97316" /> : <ChevronDown size={18} color="#94A3B8" />}
              </button>

              {openFaq === idx && (
                <div style={{ padding: '0 20px 20px', color: '#CBD5E1', fontSize: '0.86rem', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          9. BOTTOM CALL TO ACTION & TOWNSHIP LINK
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        zIndex: 1,
        padding: '50px 24px 80px',
        maxWidth: '1280px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(4,8,20,0.9) 100%)',
          border: '1px solid rgba(249,115,22,0.4)',
          borderRadius: '20px',
          padding: '48px 30px',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 12px 0' }}>
            Book Your Private Saffron Site Tour
          </h2>
          <p style={{ color: '#CBD5E1', fontSize: '0.96rem', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.5 }}>
            Inspect ready 1 BHK &amp; 2 BHK residences or commercial retail shops on-site with our senior Hinjewadi Phase 3 property advisors. Flexible appointment slots 7 days a week.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="saffron-orange-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                borderRadius: '10px',
                fontSize: '0.96rem',
                cursor: 'pointer'
              }}
            >
              <Calendar size={18} />
              <span>Schedule VIP Site Tour</span>
            </button>

            <button
              onClick={() => navigate('/townships/megapolis')}
              className="saffron-outline-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 24px',
                borderRadius: '10px',
                fontSize: '0.96rem',
                cursor: 'pointer'
              }}
            >
              <Building2 size={18} />
              <span>Explore Entire Megapolis Township</span>
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          10. FULL-SCREEN LIGHTBOX MODAL WITH ZOOM & PAN
      ══════════════════════════════════════════════════════════════ */}
      {lightboxOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(2, 4, 12, 0.96)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Top Bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0,0,0,0.6)',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>{activePhoto.icon}</span>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FED7AA' }}>{activePhoto.title}</div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{activePhoto.tag} · On-Site Verified</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleZoomIn}
                title="Zoom In"
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={handleZoomOut}
                title="Zoom Out"
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}
              >
                <ZoomOut size={16} />
              </button>
              <button
                onClick={handleRotate}
                title="Rotate 90°"
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={closeLightbox}
                title="Close (Esc)"
                style={{ background: '#EF4444', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', marginLeft: '6px' }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Centered Image with Transform */}
          <div style={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <img
              src={activePhoto.src}
              alt={activePhoto.title}
              style={{
                maxWidth: '90vw',
                maxHeight: '75vh',
                objectFit: 'contain',
                transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                transition: 'transform 0.25s ease'
              }}
            />
          </div>

          {/* Prev/Next Arrows */}
          <button
            onClick={prevPhoto}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              color: '#fff',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <ChevronLeft size={26} />
          </button>

          <button
            onClick={nextPhoto}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              color: '#fff',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <ChevronRight size={26} />
          </button>

          {/* Bottom Thumbnails Strip */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '10px',
            background: 'rgba(0,0,0,0.6)',
            padding: '8px 14px',
            borderRadius: '12px',
            zIndex: 10
          }}>
            {p.gallery.map((g, idx) => (
              <button
                key={g.id}
                onClick={() => {
                  setActivePhotoIdx(idx);
                  setZoomLevel(1);
                  setRotation(0);
                }}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: activePhotoIdx === idx ? '2px solid #F97316' : '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <img src={g.src} alt={g.roomName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          11. SCHEDULE SITE VISIT POPUP MODAL
      ══════════════════════════════════════════════════════════════ */}
      {showScheduleModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          background: 'rgba(2, 4, 12, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#0B1120',
            border: '1px solid rgba(249,115,22,0.4)',
            borderRadius: '18px',
            padding: '30px',
            maxWidth: '460px',
            width: '100%',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowScheduleModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Calendar size={18} color="#F97316" />
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', fontWeight: 700, color: '#FED7AA', margin: 0 }}>
                Schedule Private Site Visit
              </h3>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: '0 0 20px 0' }}>
              Megapolis Saffron · Hinjewadi Phase 3 (Pegasus Properties)
            </p>

            {formSubmitted ? (
              <div style={{ padding: '24px 0', textAlign: 'center' }}>
                <CheckCircle2 size={44} color="#10B981" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '1.1rem', color: '#FFFFFF', marginBottom: '6px' }}>Connecting to WhatsApp...</h4>
                <p style={{ color: '#94A3B8', fontSize: '0.82rem' }}>Redirecting you to our official advisory desk.</p>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '4px' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={modalForm.name}
                    onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                    placeholder="e.g. Amit Patil"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '0.86rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '4px' }}>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={modalForm.phone}
                    onChange={(e) => setModalForm({ ...modalForm, phone: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '0.86rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '4px' }}>Configuration of Interest</label>
                  <select
                    value={modalForm.bhk}
                    onChange={(e) => setModalForm({ ...modalForm, bhk: e.target.value })}
                    style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '0.86rem', outline: 'none' }}
                  >
                    <option value="1 BHK (445 sq.ft)">1 BHK (444–445 sq.ft - ₹47L)</option>
                    <option value="2 BHK (617–637 sq.ft)">2 BHK Standard (617–637 sq.ft - ₹68L)</option>
                    <option value="2 BHK (698 sq.ft Grand)">2 BHK Grand Layout (698 sq.ft - ₹74L)</option>
                    <option value="Commercial Shop">Commercial Retail Shop (P52100034988)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '4px' }}>Preferred Visit Date</label>
                  <input
                    type="date"
                    value={modalForm.date}
                    onChange={(e) => setModalForm({ ...modalForm, date: e.target.value })}
                    style={{ width: '100%', background: '#0B1120', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '0.86rem', outline: 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  className="saffron-orange-btn"
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  Confirm &amp; Open WhatsApp
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          12. MOBILE FIXED BOTTOM ACTION BAR
      ══════════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(4,8,20,0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(249,115,22,0.3)',
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
          <Phone size={15} color="#F97316" />
          <span>Call Desk</span>
        </a>

        <button
          onClick={() => openWhatsApp(p.whatsappText)}
          className="saffron-orange-btn"
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
