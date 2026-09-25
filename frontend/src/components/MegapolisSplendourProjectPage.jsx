/**
 * MegapolisSplendourProjectPage.jsx — 24K Realtors
 * ─────────────────────────────────────────────────────────────────────────────
 * Ultra-Luxury Flagship Project Subpage for Megapolis Splendour,
 * Hinjawadi Phase 3, Pune.
 *
 * Project Specifications (Official):
 *  - Project Name: Megapolis Splendour
 *  - Developer: Pegasus Properties (Megapolis)
 *  - MahaRERA Registration: P52100022957 & P52100023051
 *  - Status: Ready-to-Move
 *  - Location: Hinjawadi Phase 3, Pune, Maharashtra (142+ Acre Megapolis Smart Township)
 *  - Configurations: 2 BHK & 3 BHK Apartments
 *  - Carpet Area:
 *      • 2 BHK: 741 sq.ft. to 900 sq.ft. (Standard Layout: 855 sq.ft.)
 *      • 3 BHK: 1,215 sq.ft.
 *  - Amenities:
 *      • Fitness & Recreation: Gymnasium, Swimming Pool, Clubhouse
 *      • Sports & Outdoors: Tennis Court, Jogging Track, Cricket Nets, Kids Play Area
 *      • Convenience & Safety: 24x7 Security, Power Backup, Car Parking, Daily Conveniences
 *  - 100% Authentic Site Photos:
 *      • Modern Kitchen with Black Granite Counter & 24K Realtors Watermark
 *      • Spacious Living & Dining Hall with Safety Grilled Windows
 *      • Foyer & Living Room Perspective
 *      • Private Balcony with Greenery & Megapolis Skyline View
 *      • Contemporary Bathroom with Cera Sanitaryware & Basin
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, ShieldCheck, Phone, MessageSquare, ArrowLeft,
  CheckCircle2, Star, Clock, Zap, Car, Dumbbell, Trees,
  Lock, Home, IndianRupee, ChevronDown, ChevronUp,
  Building2, Award, X, ChevronLeft, ChevronRight, Maximize2,
  ZoomIn, ZoomOut, RotateCcw, Sparkles, Trophy, Activity, Waves,
  Check, ExternalLink, HelpCircle, Layers, Compass, Eye, Shield,
  Copy, ArrowRight, Share2, Calendar, UserCheck
} from 'lucide-react';
import { useSEO } from '../services/seoService';
import CompanyLogo from './CompanyLogo';

/* ══════════════════════════════════════════════════════════════════
   MEGAPOLIS SPLENDOUR PROJECT DATA SPECIFICATION
══════════════════════════════════════════════════════════════════ */
const SPLENDOUR_DATA = {
  key: 'megapolis-splendour',
  name: 'Megapolis Splendour',
  shortName: 'Splendour',
  developer: 'Pegasus Properties (Megapolis)',
  reraNumbers: [
    { number: 'P52100022957', label: 'Primary Cluster / Main Phase', status: 'Registered & Clear Title (OC Received)' },
    { number: 'P52100023051', label: 'Extension Wing / Tower Phase', status: 'Registered & Clear Title (OC Received)' }
  ],
  reraSummary: 'P52100022957 · P52100023051',
  location: 'Hinjawadi Phase 3, Rajiv Gandhi Infotech Park, Pune — 411057',
  status: 'Ready-to-Move',
  tagline: 'Ready-to-Move 2 & 3 BHK Luxury Residences in Megapolis Township',
  heroSubline: 'Established luxury cluster developed by Pegasus Properties within the 142-acre Megapolis Township. Offering spacious 2 BHK (741–900 sq.ft, std 855 sq.ft) & 3 BHK (1,215 sq.ft) homes with dual MahaRERA compliance, Olympic-grade amenities, and walking proximity to IT giants.',
  accentColor: '#D4AF37',
  accentGradient: 'linear-gradient(135deg, #B8860B 0%, #D4AF37 50%, #F3E5AB 100%)',
  heroBg: 'linear-gradient(160deg, #050814 0%, #0c1428 45%, #050b18 100%)',
  showcaseImage: '/megapolis_splendour_kitchen.jpg',
  investmentScore: 96,
  priceNegotiable: true,
  whatsappText: 'Hi 24K Realtors, I am interested in Megapolis Splendour Hinjewadi Phase 3 (Ready 2 BHK 855 sq.ft / 3 BHK 1,215 sq.ft - Negotiable). Please share floor plans, pricing breakup, and schedule a private site visit.',

  gallery: [
    {
      id: 1,
      tag: 'Designer Modular Kitchen',
      icon: '🍳',
      roomName: 'Modern Kitchen',
      title: 'Fitted Kitchen with Black Granite Counter & Utility Alcove',
      subtitle: 'Modern L-shaped jet-black granite countertop, stainless steel sink, tiled backsplash dado, safety-grilled window, and dedicated dry utility balcony. Verified by 24K Realtors.',
      src: '/megapolis_splendour_kitchen.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '🖤', title: 'Jet Black Granite Platform', desc: 'Heavy-duty polished granite platform with ample meal-prep counter space' },
        { icon: '🚰', title: 'Stainless Steel Sink', desc: 'Quality deep-bowl sink with branded chrome water tap fixture' },
        { icon: '🧱', title: 'Glazed Dado Tiles', desc: 'Easy-to-clean ceramic dado tiles up to lintel height protecting walls' },
        { icon: '🧺', title: 'Attached Dry Balcony', desc: 'Spacious utility area with drainage and electrical sockets for washing machines' }
      ]
    },
    {
      id: 2,
      tag: 'Spacious Living & Dining Lounge',
      icon: '🛋️',
      roomName: 'Living Hall',
      title: 'Sunlit Living & Dining Hall — Open Family Space',
      subtitle: 'Bright, expansive living room with pristine vitrified tile flooring, safety-grilled wide window for cross-draft, and seamless hallway corridor leading to bedrooms.',
      src: '/megapolis_splendour_living.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '🛋️', title: 'Expansive Open Layout', desc: 'Comfortably accommodates 6-seater sofa set, entertainment unit & 6-seater dining' },
        { icon: '✨', title: 'Glossy Vitrified Floors', desc: 'Pristine nano-finish tiles reflecting natural sunlight across the whole apartment' },
        { icon: '🪟', title: 'Safety-Grilled Window', desc: 'Wide window with robust MS grill for safety, sunlight, and steady breeze' },
        { icon: '🚪', title: 'Acoustic Separation', desc: 'Central hallway intelligently separates private bedroom quarters from the living zone' }
      ]
    },
    {
      id: 3,
      tag: 'Living Hall Perspective',
      icon: '🚪',
      roomName: 'Hall & Foyer',
      title: 'Living Room Perspective — Depth, Daylight & Flow',
      subtitle: 'Another perspective of the airy living lounge showing the smart layout, clean painted walls, high ceilings, and seamless connectivity to all bedrooms.',
      src: '/megapolis_splendour_hall.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '📐', title: 'Zero Space Wastage', desc: 'Efficient architectural layout ensuring every square foot of carpet area is functional' },
        { icon: '☀️', title: 'Dual Air Flow', desc: 'Cross ventilation keeping the home naturally cool and energy-efficient throughout the year' },
        { icon: '🎨', title: 'Fresh White Emulsion', desc: 'Clean, move-in ready wall surfaces suitable for custom wallpaper or accent panelling' },
        { icon: '⚡', title: 'Pre-Wired Electric Grid', desc: 'Concealed copper wiring with branded modular switches and inverter provisions' }
      ]
    },
    {
      id: 4,
      tag: 'Private Greenery Balcony View',
      icon: '🌿',
      roomName: 'Sit-out Balcony',
      title: 'Panoramic Balcony View Overlooking Tree Canopy & Towers',
      subtitle: 'Sliding glass door balcony presenting an unobstructed vista of lush green tree canopies, landscaped podiums, and the iconic Megapolis high-rise skyline.',
      src: '/megapolis_splendour_balcony.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '🍃', title: 'Perpetual Greenery', desc: 'Peaceful treetop view shielding the residence from noise and dust' },
        { icon: '🏙️', title: 'Township Skyline', desc: 'High-rise silhouette of Megapolis smart city against the open sky' },
        { icon: '🪟', title: 'Sliding UPVC Doors', desc: 'Smooth sliding glass apertures with mosquito net and durable safety balustrade' },
        { icon: '☕', title: 'Morning Tea Lounge', desc: 'Ideal outdoor relaxation corner for morning coffee, evening books, or potted plants' }
      ]
    },
    {
      id: 5,
      tag: 'Contemporary Fitted Bathroom',
      icon: '🚿',
      roomName: 'Modern Bathroom',
      title: 'Fitted Bathroom with Cera Sanitaryware & Vanity Basin',
      subtitle: 'Modern bathroom showcasing wall-mounted ceramic washbasin, branded Cera western commode with jet spray, chrome bib cock, and marble-veined wall tiles.',
      src: '/megapolis_splendour_bathroom.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '🚽', title: 'Cera Western Commode', desc: 'Branded ceramic water closet with dual-flush cistern and chrome health faucet' },
        { icon: '🧼', title: 'Wall-Mounted Vanity Basin', desc: 'Sleek integrated washbasin with toiletries counter shelf and waste trap' },
        { icon: '🚿', title: 'Branded CP Fittings', desc: 'Corrosion-resistant chrome fittings, hot/cold shower mixer, and geyser electrical line' },
        { icon: '🧱', title: 'Full-Height Wall Dado', desc: 'Elegant beige marble-effect ceramic tiles up to ceiling preventing moisture dampness' }
      ]
    }
  ],

  configurations: [
    {
      bhk: '2 BHK',
      badge: 'MOST POPULAR LAYOUT',
      type: '2 BHK Standard (855 sq.ft)',
      carpet: '855 sq.ft. (Range: 741 – 900 sq.ft.)',
      carpetNum: 855,
      priceRange: '₹74 Lakhs – ₹88 Lakhs',
      priceText: '₹78 Lakhs (Negotiable)',
      status: 'Ready-to-Move',
      possession: 'Immediate Occupancy',
      highlight: true,
      description: 'The signature 2 BHK layout of Megapolis Splendour. Featuring 855 sq.ft. of prime carpet area with zero wastage, 2 spacious bedrooms, 2 bathrooms, an L-shaped kitchen, and a private green-facing balcony.',
      specs: [
        'Carpet Area: 855 sq.ft. (Standard Layout)',
        'Also available in 741 sq.ft. & 900 sq.ft. variants',
        '2 Large Bedrooms + 2 Bathrooms (1 Attached, 1 Common)',
        'Airy Living Room with attached Sit-Out Balcony',
        'Fitted Black Granite Kitchen + Separate Dry Utility',
        'Ready to Move with Full Occupancy Certificate (OC)'
      ]
    },
    {
      bhk: '3 BHK',
      badge: 'LUXURY EXECUTIVE',
      type: '3 BHK Grand (1,215 sq.ft)',
      carpet: '1,215 sq.ft. Carpet Area',
      carpetNum: 1215,
      priceRange: '₹1.15 Cr – ₹1.35 Cr',
      priceText: '₹1.22 Cr (Negotiable)',
      status: 'Ready-to-Move',
      possession: 'Immediate Occupancy',
      highlight: false,
      description: 'Expansive 3 BHK residence designed for IT executives and growing families. Encompassing 1,215 sq.ft. of carpet space with 3 bathrooms, large living-dining lounge, master suite with panoramic views, and dual balconies.',
      specs: [
        'Carpet Area: 1,215 sq.ft. Carpet Space',
        '3 Expansive Bedrooms + 3 Bathrooms',
        'Double Balcony (Living Lounge & Master Suite)',
        'King-Size Dining & Living Hall Configuration',
        'Dedicated Wardrobe Niches & Work-From-Home Space',
        'Dual MahaRERA Certified: P52100022957 / P52100023051'
      ]
    }
  ],

  // 3 Exact Pillars requested by User + Interior Features
  amenityPillars: [
    {
      id: 'fitness-recreation',
      title: 'Fitness & Recreation',
      subtitle: 'Health, wellness, rejuvenation, and social celebration',
      badge: 'PILLAR 1',
      icon: '🏋️',
      color: '#F59E0B',
      items: [
        {
          icon: '🏋️‍♂️',
          title: 'Modern Gymnasium',
          desc: 'Fully equipped fitness center with cardio treadmills, cross trainers, multi-gym equipment, and dedicated free-weight section.'
        },
        {
          icon: '🏊‍♂️',
          title: 'Swimming Pool',
          desc: 'Crystal-clear temperature-balanced swimming pool with sunbathing deck, shallow children splash pool, and changing rooms.'
        },
        {
          icon: '🏛️',
          title: 'Grand Clubhouse',
          desc: 'Spacious air-conditioned community clubhouse for society cultural gatherings, birthday celebrations, and indoor leisure games.'
        }
      ]
    },
    {
      id: 'sports-outdoors',
      title: 'Sports & Outdoors',
      subtitle: 'Active lifestyle, competitive courts, and open green recreation',
      badge: 'PILLAR 2',
      icon: '🎾',
      color: '#10B981',
      items: [
        {
          icon: '🎾',
          title: 'Tennis Court',
          desc: 'Full-size regulation tennis court with durable all-weather synthetic surface and floodlight illumination for evening matches.'
        },
        {
          icon: '🏃‍♂️',
          title: 'Jogging Track',
          desc: 'Dedicated paved jogging and strolling track meandering through landscaped green buffers and fresh Sahyadri breezes.'
        },
        {
          icon: '🏏',
          title: 'Cricket Nets',
          desc: 'Enclosed professional practice cricket pitch with high safety netting for weekend batting and bowling drills.'
        },
        {
          icon: '🧒',
          title: 'Kids Play Area',
          desc: 'Vibrant outdoor children park with safety rubberized flooring, swings, slides, sand play pit, and adventure climbing frames.'
        }
      ]
    },
    {
      id: 'convenience-safety',
      title: 'Convenience & Safety',
      subtitle: '24x7 security, continuous utilities, covered parking, and daily essentials',
      badge: 'PILLAR 3',
      icon: '🛡️',
      color: '#3B82F6',
      items: [
        {
          icon: '🎥',
          title: '24x7 Security & CCTV',
          desc: 'Round-the-clock trained security guards, RFID boom barriers at entry gates, intercoms, and comprehensive CCTV monitoring.'
        },
        {
          icon: '⚡',
          title: '100% Power Backup',
          desc: 'Heavy-duty DG generator backup system ensuring uninterrupted power supply for elevators, water pumps, and common lighting.'
        },
        {
          icon: '🚗',
          title: 'Covered Car Parking',
          desc: 'Allotted covered parking bays for residents and well-marked guest parking zones with wide internal driveways.'
        },
        {
          icon: '🛒',
          title: 'Daily Conveniences',
          desc: 'On-campus convenience grocery stores, medical pharmacy, ATM kiosks, laundry, and daily essentials within 2 minutes walk.'
        }
      ]
    }
  ],

  townshipFeatures: [
    { icon: '🏫', title: 'Pawar Public School on Campus', desc: 'Prestigious CBSE Pawar Public School located directly inside the 142-acre Megapolis campus (300m walk).' },
    { icon: '🚇', title: 'Megapolis Metro Station (400m)', desc: 'Terminal station of Pune Metro Line 3 (Hinjewadi to Shivajinagar) positioned right outside the township gate.' },
    { icon: '🌳', title: '142-Acre Master Ecosystem', desc: 'Complete integrated smart township with wide four-lane internal roads, manicured parks, and underground utilities.' },
    { icon: '🚍', title: 'Dedicated IT Shuttle Buses', desc: 'Regular township feeder buses and corporate cabs picking up directly from Megapolis circle to Phase 1, 2 & 3 IT companies.' }
  ],

  transit: [
    { title: 'Tech Mahindra Hinjewadi Phase 3', dist: '400 meters', time: '2 mins walk', icon: '🏢' },
    { title: 'TCS Sahyadri Park Campus', dist: '600 meters', time: '4 mins walk', icon: '💼' },
    { title: 'Cognizant Hinjewadi Phase 3', dist: '800 meters', time: '5 mins walk', icon: '💻' },
    { title: 'Pawar Public School', dist: '300 meters', time: 'Inside Campus', icon: '🏫' },
    { title: 'Upcoming Megapolis Metro Station', dist: '400 meters', time: '3 mins walk', icon: '🚇' },
    { title: 'Wipro Circle (Phase 2)', dist: '4.2 km', time: '8 mins drive', icon: '🚗' },
    { title: 'Infosys Phase 1 & 2', dist: '5.5 km', time: '10 mins drive', icon: '🏢' },
    { title: 'Mumbai-Pune Expressway', dist: '14 km', time: '18 mins drive', icon: '🛣️' }
  ],

  faqs: [
    {
      q: 'What are the official MahaRERA registration numbers for Megapolis Splendour?',
      a: 'Megapolis Splendour is officially registered with the Maharashtra Real Estate Regulatory Authority (MahaRERA) under two verified registration numbers: P52100022957 and P52100023051. Both registrations have clear legal titles and verified compliance.'
    },
    {
      q: 'Who is the developer of Megapolis Splendour?',
      a: 'Megapolis Splendour is developed by Pegasus Properties (Megapolis), one of the principal entities behind the landmark 142+ acre Megapolis Smart Township in Hinjewadi Phase 3, Pune.'
    },
    {
      q: 'What is the construction status of Megapolis Splendour?',
      a: 'Megapolis Splendour is a 100% Ready-to-Move residential development with complete Occupancy Certificates (OC). You can move in immediately or rent it out to high-paying IT professionals.'
    },
    {
      q: 'What are the carpet area options available in Megapolis Splendour?',
      a: 'Megapolis Splendour offers 2 BHK and 3 BHK configurations. 2 BHK apartments typically range between 741 sq.ft. and 900 sq.ft. of carpet area, with 855 sq.ft. being the most common standard layout. 3 BHK apartments offer 1,215 sq.ft. of generous carpet area.'
    },
    {
      q: 'Are the prices negotiable through 24K Realtors?',
      a: 'Yes. 24K Realtors works directly with verified sellers and Pegasus Properties to provide transparent, pre-negotiated deals for both 2 BHK (₹74L–₹88L) and 3 BHK (₹1.15 Cr–₹1.35 Cr) homes. Contact our advisory team for customized quotation breakups.'
    },
    {
      q: 'What amenities are available within Megapolis Splendour?',
      a: 'Residents enjoy a comprehensive 3-pillar lifestyle: (1) Fitness & Recreation: Gymnasium, Swimming Pool, Clubhouse; (2) Sports & Outdoors: Tennis Court, Jogging Track, Cricket Nets, Kids Play Area; (3) Convenience & Safety: 24x7 Security with CCTV, 100% DG Power Backup, Covered Car Parking, and Daily Conveniences on campus.'
    },
    {
      q: 'Is Pawar Public School accessible inside the township?',
      a: 'Yes. The renowned Pawar Public School (CBSE) is operational directly within the Megapolis Township campus, just 300 meters from Splendour, allowing children to walk safely to school without crossing main arterial highways.'
    },
    {
      q: 'Are these actual site photos of the property?',
      a: 'Yes, 100% of the photos featured in this showcase dossier are authentic on-site photographs taken inside Megapolis Splendour, showing the actual fitted modular kitchen, spacious living hall, balcony greenery view, and bathroom.'
    }
  ],

  seo: {
    title: 'Megapolis Splendour Hinjewadi Phase 3 | Ready 2 & 3 BHK Flats | MahaRERA P52100022957 & P52100023051 | 24K Realtors',
    description: 'Megapolis Splendour by Pegasus Properties in Hinjewadi Phase 3, Pune. Ready-to-move 2 BHK (741-900 sq.ft, std 855 sq.ft) & 3 BHK (1,215 sq.ft) flats. Dual MahaRERA P52100022957 & P52100023051. 100% authentic photos, gym, pool, tennis court & negotiable pricing.',
    keywords: 'Megapolis Splendour, Megapolis Splendour Hinjewadi Phase 3, Pegasus Properties Megapolis, Megapolis 2 BHK 855 sqft, Megapolis 3 BHK 1215 sqft, MahaRERA P52100022957, P52100023051, Megapolis Township Hinjewadi, Ready to move flats Hinjewadi Phase 3, 24K Realtors'
  }
};

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT: MegapolisSplendourProjectPage
══════════════════════════════════════════════════════════════════ */
export default function MegapolisSplendourProjectPage({ initialBhkFilter = null, onBackHome = null }) {
  const navigate = useNavigate();
  const p = SPLENDOUR_DATA;

  // SEO Injection
  useSEO({
    title: p.seo.title,
    description: p.seo.description,
    keywords: p.seo.keywords,
    canonicalUrl: 'https://24krealtors.com/megapolis-splendour'
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
  const [modalForm, setModalForm] = useState({ name: '', phone: '', bhk: '2 BHK (855 sq.ft Standard)', date: '', message: '' });
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
    const text = `Hi 24K Realtors, I want to schedule a VIP site visit for Megapolis Splendour Hinjewadi Phase 3.\n\nName: ${modalForm.name}\nPhone: ${modalForm.phone}\nPreferred Configuration: ${modalForm.bhk}\nPreferred Date: ${modalForm.date || 'Earliest Available'}\nNotes: ${modalForm.message || 'Please share pricing & layout plans.'}`;
    setTimeout(() => {
      openWhatsApp(text);
      setShowScheduleModal(false);
      setFormSubmitted(false);
      setModalForm({ name: '', phone: '', bhk: '2 BHK (855 sq.ft Standard)', date: '', message: '' });
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
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '55vw', height: '55vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.09) 0%, transparent 70%)', filter: 'blur(70px)' }} />
        <div style={{ position: 'absolute', top: '35%', right: '-15%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '20%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)', filter: 'blur(70px)' }} />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .splendour-gold-btn {
          background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%);
          color: #040814;
          font-weight: 700;
          letter-spacing: 0.03em;
          border: none;
          box-shadow: 0 4px 20px rgba(212,175,55,0.35);
          transition: all 0.3s ease;
        }
        .splendour-gold-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(212,175,55,0.55);
          background: linear-gradient(135deg, #F3E5AB 0%, #D4AF37 100%);
        }
        .splendour-outline-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(212,175,55,0.4);
          color: #F3E5AB;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .splendour-outline-btn:hover {
          background: rgba(212,175,55,0.12);
          border-color: #D4AF37;
          transform: translateY(-2px);
        }
        .splendour-card-hover {
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .splendour-card-hover:hover {
          transform: translateY(-5px);
          border-color: rgba(212,175,55,0.45) !important;
          box-shadow: 0 16px 40px rgba(0,0,0,0.5);
        }
        .photo-thumb-btn {
          transition: all 0.25s ease;
        }
        .photo-thumb-btn:hover {
          transform: scale(1.03);
          border-color: #D4AF37 !important;
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
        borderBottom: '1px solid rgba(212, 175, 55, 0.22)',
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
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.95rem', fontWeight: 800, color: '#F3E5AB', letterSpacing: '0.04em' }}>
                  MEGAPOLIS SPLENDOUR
                </div>
                <div style={{ fontSize: '0.65rem', color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Hinjewadi Phase 3 · Pegasus Properties
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
                border: '1px solid rgba(212,175,55,0.3)',
                padding: '8px 16px',
                borderRadius: '30px',
                color: '#FFF4D0',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <Phone size={14} color="#D4AF37" />
              <span>+91 96730 00053</span>
            </a>

            <button
              onClick={() => openWhatsApp(p.whatsappText)}
              className="splendour-gold-btn"
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
          2. HERO SECTION — CINZEL ELEVATION & DUAL MAHARERA BANNER
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
          <span style={{ color: '#D4AF37', fontWeight: 600 }}>Megapolis Splendour</span>
        </div>

        {/* Dual MahaRERA Verification Banner */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          background: 'linear-gradient(90deg, rgba(212,175,55,0.14) 0%, rgba(16,185,129,0.12) 100%)',
          border: '1px solid rgba(212,175,55,0.35)',
          borderRadius: '14px',
          padding: '12px 20px',
          marginBottom: '26px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.2)', border: '1px solid #10B981', padding: '4px 10px', borderRadius: '6px', color: '#6EE7B7', fontSize: '0.75rem', fontWeight: 800 }}>
              <ShieldCheck size={14} />
              <span>DUAL MAHARERA VERIFIED</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', color: '#E2E8F0', fontWeight: 600 }}>Registration Numbers:</span>
              <button
                onClick={() => copyReraNumber('P52100022957')}
                title="Click to copy RERA Number"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px dashed rgba(212,175,55,0.6)',
                  color: '#F3E5AB',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <span>P52100022957</span>
                <Copy size={12} color="#D4AF37" />
              </button>
              <span style={{ color: '#64748B' }}>&</span>
              <button
                onClick={() => copyReraNumber('P52100023051')}
                title="Click to copy RERA Number"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px dashed rgba(212,175,55,0.6)',
                  color: '#F3E5AB',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <span>P52100023051</span>
                <Copy size={12} color="#D4AF37" />
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '20px', padding: '5px 14px', marginBottom: '14px' }}>
            <Sparkles size={13} color="#D4AF37" />
            <span style={{ fontSize: '0.75rem', color: '#F3E5AB', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
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
            Megapolis Splendour
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
              <MapPin size={16} color="#D4AF37" />
              <span>Hinjawadi Phase 3, Rajiv Gandhi Infotech Park, Pune</span>
            </div>
            <span style={{ color: '#475569' }}>•</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ADE80', fontSize: '0.88rem', fontWeight: 600 }}>
              <CheckCircle2 size={16} color="#4ADE80" />
              <span>Ready-to-Move (Full OC Received)</span>
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
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F3E5AB' }}>2 &amp; 3 BHK</div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Ready Apartments</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '12px', padding: '16px 18px' }}>
            <div style={{ fontSize: '0.72rem', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>2 BHK Standard</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>855 sq.ft.</div>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Range: 741 – 900 sq.ft.</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px 18px' }}>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>3 BHK Carpet</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>1,215 sq.ft.</div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Expansive 3 Bed + 3 Bath</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '16px 18px' }}>
            <div style={{ fontSize: '0.72rem', color: '#6EE7B7', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Price Guidance</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4ADE80' }}>₹74L – ₹1.35 Cr</div>
            <div style={{ fontSize: '0.72rem', color: '#A7F3D0' }}>Negotiable via 24K</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px 18px' }}>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>IT Proximity</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#93C5FD' }}>2–4 Mins Walk</div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Tech Mahindra &amp; TCS</div>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="splendour-gold-btn"
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
            onClick={() => openWhatsApp(`Hi 24K Realtors, please share the full brochure, price sheet, and floor plan PDF for Megapolis Splendour Hinjewadi Phase 3.`)}
            className="splendour-outline-btn"
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
            <MessageSquare size={18} color="#D4AF37" />
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
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 700, color: '#F3E5AB', margin: 0 }}>
              Megapolis Splendour — Actual Residence Tour
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', margin: '6px 0 0' }}>
              Explore real photos taken on-site inside ready units at Megapolis Splendour. Click any image to launch full-screen pan &amp; zoom mode.
            </p>
          </div>

          <button
            onClick={() => openLightbox(activePhotoIdx)}
            className="splendour-outline-btn"
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
            border: '1px solid rgba(212,175,55,0.3)',
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
              <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(4,8,20,0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '6px', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.9rem' }}>{activePhoto.icon}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F3E5AB' }}>{activePhoto.tag}</span>
              </div>

              {/* Click to Expand Trigger */}
              <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(4,8,20,0.85)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#E2E8F0' }}>
                <Maximize2 size={13} color="#D4AF37" />
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
                style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
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
                    border: activePhotoIdx === idx ? '2px solid #D4AF37' : '1px solid rgba(255,255,255,0.12)',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <img src={item.src} alt={item.roomName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {activePhotoIdx === idx && (
                    <div style={{ position: 'absolute', inset: 0, border: '2px solid #D4AF37' }} />
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
                <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.05rem', fontWeight: 700, color: '#F3E5AB', margin: 0 }}>
                  {activePhoto.roomName} Features
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
          4. CONFIGURATIONS & CARPET AREA EXPLORER (2 & 3 BHK)
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        zIndex: 1,
        padding: '50px 24px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '20px', padding: '4px 14px', marginBottom: '10px' }}>
            <Layers size={13} color="#D4AF37" />
            <span style={{ fontSize: '0.72rem', color: '#F3E5AB', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Carpet Area &amp; Layout Guidance
            </span>
          </div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', fontWeight: 700, color: '#FFFFFF', margin: '0 0 10px 0' }}>
            RERA-Verified Configurations
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', maxWidth: '640px', margin: '0 auto' }}>
            Detailed carpet space specifications. MahaRERA P52100022957 &amp; P52100023051. Standard 2 BHK layout is 855 sq.ft., with 3 BHK offering 1,215 sq.ft.
          </p>

          {/* Configuration Filter Tabs */}
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', borderRadius: '30px', padding: '4px', marginTop: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            {['ALL', '2 BHK', '3 BHK'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedBhk(tab)}
                style={{
                  background: selectedBhk === tab ? 'linear-gradient(135deg, #D4AF37, #B8860B)' : 'transparent',
                  color: selectedBhk === tab ? '#040814' : '#CBD5E1',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '7px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab === 'ALL' ? 'All Configurations' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Configuration Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredConfigs.map((cfg, idx) => (
            <div
              key={idx}
              className="splendour-card-hover"
              style={{
                position: 'relative',
                background: cfg.highlight ? 'linear-gradient(145deg, rgba(212,175,55,0.12) 0%, rgba(4,8,20,0.85) 60%)' : 'rgba(255,255,255,0.03)',
                border: cfg.highlight ? '1px solid rgba(212,175,55,0.45)' : '1px solid rgba(255,255,255,0.08)',
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
                  background: cfg.highlight ? '#D4AF37' : 'rgba(255,255,255,0.1)',
                  color: cfg.highlight ? '#040814' : '#E2E8F0',
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
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px 0' }}>
                  {cfg.type}
                </h3>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#D4AF37', marginBottom: '12px' }}>
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
                    onClick={() => openWhatsApp(`Hi 24K Realtors, I am interested in scheduling a site visit for the ${cfg.bhk} (${cfg.carpet}) at Megapolis Splendour Hinjewadi Phase 3. Please share price sheet & floor plan.`)}
                    className="splendour-gold-btn"
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
                    className="splendour-outline-btn"
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
          5. 3-PILLAR COMPREHENSIVE AMENITIES GRID
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '20px', padding: '4px 14px', marginBottom: '10px' }}>
            <Award size={13} color="#10B981" />
            <span style={{ fontSize: '0.72rem', color: '#6EE7B7', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Lifestyle &amp; Infrastructure
            </span>
          </div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', fontWeight: 700, color: '#FFFFFF', margin: '0 0 10px 0' }}>
            3-Pillar World-Class Amenities
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', maxWidth: '640px', margin: '0 auto' }}>
            Curated amenities supporting active fitness, outdoor competitive athletics, and 24x7 gated security in Hinjewadi Phase 3.
          </p>
        </div>

        {/* 3 Columns for 3 User Pillars */}
        <div className="amenity-grid-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {p.amenityPillars.map((pillar) => (
            <div
              key={pillar.id}
              className="splendour-card-hover"
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
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#F3E5AB', margin: '0 0 3px 0' }}>{item.title}</h4>
                      <p style={{ fontSize: '0.78rem', color: '#CBD5E1', margin: 0, lineHeight: 1.45 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Township Integration Highlight Card */}
        <div style={{
          marginTop: '32px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(212,175,55,0.08) 100%)',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: '16px',
          padding: '24px 28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Building2 size={18} color="#A78BFA" />
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.15rem', fontWeight: 700, color: '#DDD6FE', margin: 0 }}>
              The 142-Acre Megapolis Township Advantage
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {p.townshipFeatures.map((tf, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem', marginTop: '1px' }}>{tf.icon}</span>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF' }}>{tf.title}</div>
                  <div style={{ fontSize: '0.76rem', color: '#94A3B8', lineHeight: 1.4 }}>{tf.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          6. STRATEGIC TRANSIT & IT CORRIDOR COMMUTE MATRIX
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
            Save 2+ hours in daily commute. Megapolis Splendour places you within steps of Tech Mahindra, TCS, Cognizant, and upcoming Metro Line 3.
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
          7. DUAL MAHARERA COMPLIANCE & LEGAL TRANSPARENCY
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        zIndex: 1,
        padding: '50px 24px',
        maxWidth: '1280px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(16,185,129,0.06) 100%)',
          border: '1px solid rgba(212,175,55,0.35)',
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

            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.6rem', fontWeight: 700, color: '#F3E5AB', margin: '0 0 10px 0' }}>
              Dual MahaRERA Certified Transparency
            </h3>

            <p style={{ color: '#CBD5E1', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 16px 0' }}>
              Megapolis Splendour has been verified across two distinct registration numbers on the official MahaRERA authority portal. Both certifications hold complete Occupancy Certificates (OC) with zero legal disputes.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {p.reraNumbers.map((r, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', borderRadius: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#F3E5AB', fontFamily: 'monospace' }}>{r.number}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginLeft: '10px' }}>({r.label})</span>
                  </div>
                  <button
                    onClick={() => copyReraNumber(r.number)}
                    style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: '#F3E5AB', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
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
              24K Realtors Legal Desk Verification
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', color: '#CBD5E1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={15} color="#10B981" />
                <span>Sanctioned municipal building layouts &amp; fire NOC compliant</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={15} color="#10B981" />
                <span>Home loan approvals active from SBI, HDFC, ICICI &amp; Axis Bank</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={15} color="#10B981" />
                <span>Zero brokerage on direct developer inventory</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={15} color="#10B981" />
                <span>End-to-end registration &amp; stamping assistance</span>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <button
                onClick={() => openWhatsApp('Hi 24K Realtors, please share the MahaRERA certificates and legal title dossier for Megapolis Splendour Hinjewadi Phase 3.')}
                className="splendour-gold-btn"
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '20px', padding: '4px 14px', marginBottom: '10px' }}>
            <HelpCircle size={13} color="#D4AF37" />
            <span style={{ fontSize: '0.72rem', color: '#F3E5AB', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Buyer FAQ
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
                border: openFaq === idx ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.08)',
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
                {openFaq === idx ? <ChevronUp size={18} color="#D4AF37" /> : <ChevronDown size={18} color="#94A3B8" />}
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
          background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(4,8,20,0.9) 100%)',
          border: '1px solid rgba(212,175,55,0.4)',
          borderRadius: '20px',
          padding: '48px 30px',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: '#FFFFFF', margin: '0 0 12px 0' }}>
            Book Your Private Splendour Site Tour
          </h2>
          <p style={{ color: '#CBD5E1', fontSize: '0.96rem', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.5 }}>
            Inspect ready 2 BHK &amp; 3 BHK residences on-site with our senior Hinjewadi Phase 3 property advisors. Flexible appointment slots 7 days a week.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="splendour-gold-btn"
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
              className="splendour-outline-btn"
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
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F3E5AB' }}>{activePhoto.title}</div>
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
                  border: activePhotoIdx === idx ? '2px solid #D4AF37' : '1px solid rgba(255,255,255,0.2)',
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
            border: '1px solid rgba(212,175,55,0.4)',
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
              <Calendar size={18} color="#D4AF37" />
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', fontWeight: 700, color: '#F3E5AB', margin: 0 }}>
                Schedule Private Site Visit
              </h3>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: '0 0 20px 0' }}>
              Megapolis Splendour · Hinjewadi Phase 3 (Pegasus Properties)
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
                    placeholder="e.g. Rahul Sharma"
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
                    <option value="2 BHK (855 sq.ft Standard)">2 BHK (855 sq.ft Standard Layout - ₹78L)</option>
                    <option value="2 BHK (741 sq.ft Compact)">2 BHK (741 sq.ft - ₹74L)</option>
                    <option value="2 BHK (900 sq.ft Grand)">2 BHK (900 sq.ft - ₹84L)</option>
                    <option value="3 BHK (1,215 sq.ft Grand)">3 BHK (1,215 sq.ft - ₹1.22 Cr)</option>
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
                  className="splendour-gold-btn"
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
        borderTop: '1px solid rgba(212,175,55,0.3)',
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
          <Phone size={15} color="#D4AF37" />
          <span>Call Desk</span>
        </a>

        <button
          onClick={() => openWhatsApp(p.whatsappText)}
          className="splendour-gold-btn"
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
