/**
 * MegapolisTownshipPage.jsx — 24K Realtors
 * ─────────────────────────────────────────────────────────────────────────────
 * Ultra-Luxury Flagship Project Subpage for Megapolis Township, Hinjewadi Phase 3.
 * Matching the architectural depth, aesthetic excellence, and feature completeness
 * of Godrej 24 & Godrej Elements.
 *
 * Highlights:
 *  - Sticky Luxury Topbar with 24K Realtors Brand & Call CTA
 *  - Cinzel Hero Elevation with MahaRERA Verification & Key Stats
 *  - 6-Creative Interactive Virtual Tour Gallery with Pan & Zoom Lightbox
 *  - Society Explorer Grid (Sangria, Mystic, Splendour, Sunway, Sparkle)
 *  - RERA Verified Configurations & Floor Space Guidance
 *  - 12 World-Class Township Amenities Grid
 *  - Proximity Matrix to Infosys Phase 3, Embassy Techzone & Metro Line 3
 *  - Developer Profile (Pride Purple Group — 25+ Years Legacy)
 *  - Interactive FAQ Accordion & Sticky Bottom Mobile Action Bar
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, ShieldCheck, Phone, MessageSquare, ArrowLeft,
  CheckCircle2, Star, Clock, Zap, Car, Dumbbell, Trees,
  Wifi, Lock, Coffee, Users, Home, IndianRupee, ExternalLink,
  ChevronDown, ChevronUp, Building2, Award, X, ChevronLeft, ChevronRight, Maximize2,
  ZoomIn, ZoomOut, RotateCcw, Bus, Sparkles, Layers, ArrowRight
} from 'lucide-react';
import { useSEO } from '../services/seoService';
import CompanyLogo from './CompanyLogo';

/* ══════════════════════════════════════════════════════════════════
   MEGAPOLIS SOCIETY CONFIGURATION (Exported for SocietyListings)
══════════════════════════════════════════════════════════════════ */
export const MEGAPOLIS_SOCIETIES = [
  {
    id: 'sangria',
    slug: 'megapolis-sangria',
    displayName: 'Sangria',
    fullName: 'Megapolis Sangria',
    tagline: 'Vibrant Living. Bold Character.',
    bhkOptions: ['2 BHK', '2.5 BHK', '3 BHK'],
    carpetRange: '645 – 1,150 sqft',
    priceRange: '₹95L – ₹1.85Cr',
    unitCount: 480,
    towers: 4,
    status: 'READY_TO_MOVE',
    reraNumber: 'P52100047112',
    accentHex: '#E11D48',
    imageUrl: '/sangria_living_room.jpg',
    features: ['Pool View Units', 'Club Access', 'Sky Deck'],
    possession: 'Ready'
  },
  {
    id: 'mystic',
    slug: 'megapolis-mystic',
    displayName: 'Mystic',
    fullName: 'Megapolis Mystic',
    tagline: 'Serenity Meets Modern Luxury.',
    bhkOptions: ['2 BHK', '3 BHK'],
    carpetRange: '720 – 1,200 sqft',
    priceRange: '₹1.05Cr – ₹1.95Cr',
    unitCount: 396,
    towers: 3,
    status: 'READY_TO_MOVE',
    reraNumber: 'P52100046891',
    accentHex: '#7C3AED',
    imageUrl: '/dev_kolte_patil_township.png',
    features: ['Garden Facing', 'Terrace Lounge', 'Zen Garden'],
    possession: 'Ready'
  },
  {
    id: 'splendour',
    slug: 'megapolis-splendour',
    displayName: 'Splendour',
    fullName: 'Megapolis Splendour',
    tagline: 'Ready 2 & 3 BHK Luxury Residences. Pegasus Properties.',
    bhkOptions: ['2 BHK', '3 BHK'],
    carpetRange: '741 – 1,215 sqft (Std 855 sqft)',
    priceRange: '₹74L – ₹1.35Cr (Negotiable)',
    unitCount: 512,
    towers: 5,
    status: 'READY_TO_MOVE',
    reraNumber: 'P52100022957 · P52100023051',
    accentHex: '#D4AF37',
    imageUrl: '/megapolis_splendour_kitchen.jpg',
    features: ['Gym, Pool & Club', 'Tennis & Cricket Nets', '24x7 Security & Power Backup'],
    possession: 'Ready'
  },
  {
    id: 'saffron',
    slug: 'megapolis-saffron',
    displayName: 'Saffron',
    fullName: 'Megapolis Saffron',
    tagline: 'Ready 1 & 2 BHK Homes. Ground-Floor Retail Shops.',
    bhkOptions: ['1 BHK', '2 BHK'],
    carpetRange: '444 – 698 sqft (1BHK: 445 sqft | 2BHK: 637 sqft)',
    priceRange: '₹46L – ₹75L (Negotiable)',
    unitCount: 560,
    towers: 12,
    status: 'READY_TO_MOVE',
    reraNumber: 'P52100018779 · P52100021609 · P52100034988',
    accentHex: '#F97316',
    imageUrl: '/megapolis_saffron_kitchen.jpg',
    features: ['1 BHK (445 sq.ft) & 2 BHK (637 sq.ft)', 'Saffron Commercial Shops', 'Gym, Pool & Clubhouse'],
    possession: 'Ready'
  },
  {
    id: 'sparklet',
    slug: 'megapolis-sparklet',
    displayName: 'Sparklet',
    fullName: 'Megapolis Sparklet',
    tagline: 'Scenic Balcony Vistas. Ready 1 & 2 BHK Residences. Pegasus Properties.',
    bhkOptions: ['1 BHK', '2 BHK'],
    carpetRange: '450 – 760 sqft (1BHK: 450-480 sqft | 2BHK: 680-760 sqft)',
    priceRange: '₹48L – ₹82L (Negotiable)',
    unitCount: 520,
    towers: 6,
    status: 'READY_TO_MOVE',
    reraNumber: 'A51800000454 · P52100078240',
    accentHex: '#06B6D4',
    imageUrl: '/megapolis_sparklet_balcony.jpg',
    features: ['1 BHK (450-480 sq.ft) & 2 BHK (680-760 sq.ft)', 'Dual MahaRERA A51800000454 · P52100078240', 'Olympic Pool, Gym & Sports Club'],
    possession: 'Ready'
  },
  {
    id: 'sunway',
    slug: 'megapolis-sunway',
    displayName: 'Sunway',
    fullName: 'Megapolis Sunway',
    tagline: 'Sun-Drenched Spaces. Smart Layouts.',
    bhkOptions: ['1 BHK', '2 BHK', '2.5 BHK'],
    carpetRange: '440 – 870 sqft',
    priceRange: '₹65L – ₹1.35Cr',
    unitCount: 644,
    towers: 6,
    status: 'READY_TO_MOVE',
    reraNumber: 'P52100045780',
    accentHex: '#F59E0B',
    imageUrl: '/dev_kolte_patil_township.png',
    features: ['Corner Units', 'Vastu-Compliant', 'Low Maintenance'],
    possession: 'Ready'
  },
  {
    id: 'sparkle',
    slug: 'megapolis-sparkle',
    displayName: 'Sparkle',
    fullName: 'Megapolis Sparkle',
    tagline: 'Effortless Style. Modern Living.',
    bhkOptions: ['2 BHK', '2.5 BHK'],
    carpetRange: '590 – 820 sqft',
    priceRange: '₹78L – ₹1.25Cr',
    unitCount: 380,
    towers: 4,
    status: 'READY_TO_MOVE',
    reraNumber: 'P52100046550',
    accentHex: '#10B981',
    imageUrl: '/dev_kolte_patil_township.png',
    features: ['Clubhouse', 'Children Play Zone', 'Central Lawn'],
    possession: 'Ready'
  },
  {
    id: 'serenity',
    slug: 'megapolis-serenity',
    displayName: 'Serenity',
    fullName: 'Megapolis Serenity',
    tagline: 'Peaceful Living. Elevated Comfort.',
    bhkOptions: ['2 BHK'],
    carpetRange: '700 sqft',
    priceRange: '₹78 Lakhs',
    unitCount: 320,
    towers: 4,
    status: 'READY_TO_MOVE',
    reraNumber: 'P52100046552',
    accentHex: '#0EA5E9',
    imageUrl: '/megapolis_serenity_living.jpg',
    features: ['700 sq.ft Carpet Area', 'L-Shaped Granite Kitchen', 'Attached Dry Balcony'],
    possession: 'Ready'
  }
];

/* ══════════════════════════════════════════════════════════════════
   MEGAPOLIS TOWNSHIP DATA SPECIFICATION
══════════════════════════════════════════════════════════════════ */
const MEGAPOLIS_DATA = {
  key: 'megapolis',
  name: 'Megapolis Township',
  fullName: 'Megapolis Township — Hinjewadi Phase 3',
  developer: 'Pride Purple Group & Pegasus Properties',
  rera: 'P52100047112 / P52100046891',
  location: 'Rajiv Gandhi Infotech Park, Hinjewadi Phase 3, Pune — 411057',
  status: 'Ready to Move & New Phases',
  tagline: "Pune's Premier 142-Acre Mega Integrated Township",
  heroSubline: "Walk-to-work residences adjoining Infosys Phase 3 & Embassy Techzone with Olympic-grade lifestyle amenities",
  accentColor: '#7C3AED',
  accentGradient: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 50%, #A855F7 100%)',
  heroBg: 'linear-gradient(160deg, #05020c 0%, #15082b 40%, #2e1065 100%)',
  showcaseImage: '/megapolis_hero_card.jpg',
  investmentScore: 95,
  rentalYield: '5.2%',
  whatsappText: 'Hi 24K Realtors, I am interested in Megapolis Township in Hinjewadi Phase 3. Please share current pricing and available units.',

  gallery: [
    {
      id: 1,
      tag: 'Township Aerial View',
      icon: '🏢',
      roomName: 'Township & Towers',
      title: 'Megapolis Township — 142 Acres of Integrated Living',
      subtitle: 'Majestic high-rise towers, sprawling landscaped podiums, Olympic amenities, and direct proximity to Hinjewadi Phase 3 IT hubs.',
      src: '/megapolis_hero_card.jpg',
      features: [
        { icon: '🏊', title: 'Olympic Swimming Pool', desc: 'Resort-style pool, lap tracks & kids wading pool' },
        { icon: '🌳', title: '142-Acre Masterplan', desc: 'Integrated ecosystem with schools, clinics & shopping arcades' },
        { icon: '🛡️', title: 'Multi-Tier Security', desc: '24x7 gated RFID barrier entry, CCTV monitoring & patrols' },
        { icon: '🚍', title: 'IT Shuttle Bus', desc: 'Direct township shuttle services to Infosys and tech companies' }
      ]
    },
    {
      id: 2,
      tag: 'Living & Dining Lounge',
      icon: '🛋️',
      roomName: 'Living Area',
      title: 'Spacious Living Area — Sangria & Mystic Clusters',
      subtitle: 'Expansive vitrified flooring, large sliding balcony apertures, and natural cross-ventilation designed for modern tech lifestyle.',
      src: '/sangria_living_room.jpg',
      features: [
        { icon: '🛋️', title: 'Ergonomic Space Flow', desc: 'Optimized layout maximizing carpet efficiency & furniture placement' },
        { icon: '☀️', title: 'Abundant Natural Light', desc: 'Expansive sliding UPVC glass doors allowing golden daylight' },
        { icon: '🌅', title: 'Attached Sit-out Balcony', desc: 'Scenic hill-view and landscaped greens vista from your lounge' },
        { icon: '📶', title: 'Smart Home Ready', desc: 'Concealed copper wiring with inverter backup & high-speed FTTH' }
      ]
    },
    {
      id: 3,
      tag: 'Master Bedroom Retreat',
      icon: '🛏️',
      roomName: 'Master Bedroom',
      title: 'Master Bedroom — Peaceful Space with Open Hill Views',
      subtitle: 'Serene king-sized bedroom sanctuary with private wardrobe alcove and panoramic view of the Hinjewadi hills.',
      src: '/sangria_bedroom.jpg',
      features: [
        { icon: '🛏️', title: 'King-Size Layout', desc: 'Generously proportioned bedroom with room for work desk or dresser' },
        { icon: '🚪', title: 'Dedicated Wardrobe Alcove', desc: 'Space-saving integrated closet niche preserving floor space' },
        { icon: '💨', title: 'Fresh Sahyadri Breeze', desc: 'Large window aperture capturing soothing unpolluted evening winds' },
        { icon: '🔌', title: 'AC & Media Provisions', desc: 'Pre-installed electrical conduits for television and split AC' }
      ]
    },
    {
      id: 4,
      tag: 'Modern Modular Kitchen',
      icon: '🍳',
      roomName: 'Modular Kitchen',
      title: 'Contemporary Kitchen with Attached Utility Area',
      subtitle: 'Polished granite cooking counter, stainless steel sink, branded CP fittings, and dedicated dry balcony for washing machines.',
      src: '/sangria_kitchen.jpg',
      features: [
        { icon: '🍳', title: 'Granite Countertop', desc: 'Durable premium polished jet-black granite cooking platform' },
        { icon: '🚰', title: 'Branded CP Fixtures', desc: 'Stainless steel deep basin sink with hot & cold water lines' },
        { icon: '🧺', title: 'Separate Utility Balcony', desc: 'Dedicated dry area with drainage for washing machine and dryer' },
        { icon: '💨', title: 'Natural Ventilation', desc: 'Wide utility window providing continuous fresh air and natural daylight' }
      ]
    },
    {
      id: 5,
      tag: 'Designer Bathroom',
      icon: '🚿',
      roomName: 'Modern Bathroom',
      title: 'Designer Bathroom — Clean Wet & Dry Separation',
      subtitle: 'Anti-skid designer ceramic tiling, branded sanitaryware, concealed plumbing, and pre-fitted solar water heating provision.',
      src: '/sangria_bathroom.jpg',
      features: [
        { icon: '🚿', title: 'Rain Shower Diverter', desc: 'Branded CP fittings with luxury overhead shower fixture' },
        { icon: '🚽', title: 'Wall-Hung Sanitaryware', desc: 'Designer wall-hung commode with concealed dual-flush cistern' },
        { icon: '🧼', title: 'Anti-Skid Flooring', desc: 'Moisture-resistant, safe textured ceramic floor tiles' },
        { icon: '☀️', title: 'Solar Water Heating', desc: 'Eco-friendly energy saving hot water supply in master bath' }
      ]
    },
    {
      id: 6,
      tag: 'Private Viewing Balcony',
      icon: '🌇',
      roomName: 'Private Balcony',
      title: 'Private Balcony — Lush Sahyadri Hill Views',
      subtitle: 'Unobstructed scenic nature & Hinjewadi skyline vistas, ideal for morning tea, yoga, and evening sunset unwind.',
      src: '/sangria_balcony.jpg',
      features: [
        { icon: '🌄', title: 'Scenic Panoramic Views', desc: 'Uninterrupted green hills and open Hinjewadi skyline vistas' },
        { icon: '☕', title: 'Outdoor Relaxation Deck', desc: 'Comfortable outdoor space for coffee table, chairs & planters' },
        { icon: '🛡️', title: 'MS Safety Railing', desc: 'Sturdy powder-coated safety balustrade designed for family safety' },
        { icon: '☀️', title: 'Morning Sun Exposure', desc: 'Energizing eastern sunrise orientation in select inventory' }
      ]
    }
  ],

  uniqueFeatures: [
    'Adjacent to Infosys Phase 3 (350m walk)',
    '142-Acre Masterplanned Integrated Ecosystem',
    '5 Gated Society Clusters (Sangria, Mystic, etc.)',
    'Dedicated IT Shuttle Bus to Hinjewadi Tech Parks',
    'In-Township Pawar Public School Campus',
    'Olympic Swimming Pools & Grand Sports Arena'
  ],

  configurations: [
    { bhk: '1 BHK', carpet: '440 – 550 sq.ft', price: '₹65 Lakhs onwards', highlight: false, note: 'Sunway Cluster · Perfect for IT Professionals' },
    { bhk: '2 BHK', carpet: '645 – 850 sq.ft', price: '₹95 Lakhs onwards', highlight: true, note: 'Sangria & Mystic · Most Popular Choice' },
    { bhk: '2.5 BHK', carpet: '950 – 1,050 sq.ft', price: '₹1.25 Cr onwards', highlight: false, note: 'Splendour & Sangria · With Study / WFH Room' },
    { bhk: '3 BHK', carpet: '1,150 – 1,350 sq.ft', price: '₹1.65 Cr – ₹2.20 Cr', highlight: true, note: 'Splendour & Mystic · Luxury Podium View' }
  ],

  amenities: [
    { icon: <Trees size={18} />, label: 'Olympic Swimming Pool' },
    { icon: <Star size={18} />, label: 'Multisport Arena & Tennis' },
    { icon: <Dumbbell size={18} />, label: 'State-of-the-Art Gymnasium' },
    { icon: <Bus size={18} />, label: 'Dedicated IT Shuttle Bus' },
    { icon: <Trees size={18} />, label: 'Landscaped Podium Parks' },
    { icon: <Lock size={18} />, label: '24x7 Multi-Tier Security' },
    { icon: <Home size={18} />, label: 'Supermarket & Convenience Stores' },
    { icon: <Coffee size={18} />, label: 'Grand Clubhouses & Cafes' },
    { icon: <Zap size={18} />, label: 'EV Charging Stations' },
    { icon: <Building2 size={18} />, label: 'Pawar Public School Campus' },
    { icon: <Users size={18} />, label: 'Children Adventure Zones' },
    { icon: <Car size={18} />, label: 'Covered Multi-Level Parking' }
  ],

  nearbyIt: [
    { name: 'Infosys Phase 3', distance: '~350 m', time: '1 min walk' },
    { name: 'Embassy Techzone', distance: '~1.5 km', time: '3 mins' },
    { name: 'TCS Sahyadri Park', distance: '~3.2 km', time: '7 mins' },
    { name: 'Wipro Circle (Phase 2)', distance: '~3.8 km', time: '8 mins' }
  ],

  nearbyLifestyle: [
    { label: 'Pawar Public School', value: 'Inside Megapolis (2 mins)' },
    { label: 'Hinjewadi Metro Line 3 Station', value: '~1.2 km (under testing)' },
    { label: 'Ruby Hall Clinic Hinjewadi', value: '5.5 km' },
    { label: 'Grand Highstreet Hinjewadi', value: '6.0 km' },
    { label: 'Mumbai-Pune Expressway', value: '7.5 km' }
  ],

  faqs: [
    {
      q: 'What makes Megapolis Township unique in Hinjewadi Phase 3?',
      a: 'Megapolis is a 142-acre flagship mega integrated township developed by Pride Purple Group. Located directly adjacent to Infosys Phase 3 and Embassy Techzone, it allows tech professionals to literally walk to work while enjoying self-sustained amenities including Pawar Public School, Olympic swimming pools, shuttle services, and shopping arcades.'
    },
    {
      q: 'Which societies are part of Megapolis Township?',
      a: 'Megapolis features iconic gated society clusters: Splendour (ready 2 & 3 BHK luxury homes), Saffron (ready 1 & 2 BHK smart residences + commercial shops), Sparklet (ready 1 & 2 BHK hillside homes with dual RERA), Sangria (premium ready residences with pool view), Mystic (serene garden-facing 2 & 3 BHKs), Sunway (smart compact 1 & 2 BHKs), and Sparkle (modern community living).'
    },
    {
      q: 'Are properties in Megapolis ready to move or under construction?',
      a: 'Major societies including Sparklet, Saffron, Splendour, Sangria, Mystic, Sunway, and Sparkle are completely ready to move with full Occupancy Certificates (OC). Sparklet offers 1 BHK (450–480 sq.ft) & 2 BHK (680–760 sq.ft) ready homes.'
    },
    {
      q: 'What is the long-term investment potential in Megapolis?',
      a: 'Due to its unmatched walking distance to Tech Mahindra, TCS, Infosys Phase 3 and Embassy Techzone, Megapolis commands the highest IT residential occupancy in Pune West, with continuous tenant demand from tech engineers and steady capital appreciation.'
    },
    {
      q: 'What is the MahaRERA registration status for Megapolis?',
      a: 'Each society cluster within Megapolis is individually registered with MahaRERA (e.g., Sparklet: A51800000454 & P52100078240; Saffron: P52100018779, P52100021609 & P52100034988; Splendour: P52100022957 & P52100023051; Sangria: P52100047112; Mystic: P52100046891). 24K Realtors exclusively deals in verified titles with complete legal documentation.'
    },
    {
      q: 'How can I schedule a private site visit to Megapolis?',
      a: 'Contact 24K Realtors directly at +91 96730 00053 or click "Book Private Site Visit". Our dedicated Hinjewadi advisory team provides private guided visits across all societies with live resale and builder inventory tours.'
    }
  ]
};

/* ══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════ */
export default function MegapolisTownshipPage({ onBackHome }) {
  const navigate = useNavigate();
  const p = MEGAPOLIS_DATA;

  const [openFaq, setOpenFaq] = useState(null);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  // SEO Injection
  useSEO({
    title: 'Megapolis Township Hinjewadi Phase 3 | 24K Realtors Luxury Subpage',
    description: 'Explore Megapolis Township by Pride Purple Group in Hinjewadi Phase 3. 142 acres, 5 gated societies, authentic interior tour, RERA verified pricing and direct site visits.',
    canonical: 'https://24krealtors.in/townships/megapolis'
  });

  // Reset zoom on photo change or close
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

  // Lock scroll when lightbox is open
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
    const text = `Hi 24K Realtors, I would like to schedule a private site visit for Megapolis Township in Hinjewadi Phase 3.`;
    window.open(`https://wa.me/919673000053?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleBack = () => {
    if (onBackHome) onBackHome();
    else navigate('/');
  };

  const handleSocietyClick = (society) => {
    if (society.id === 'splendour') {
      navigate('/megapolis-splendour');
    } else if (society.id === 'saffron') {
      navigate('/megapolis-saffron');
    } else if (society.id === 'sparklet' || society.id === 'spaklet') {
      navigate('/megapolis-sparklet');
    } else {
      navigate(`/townships/megapolis/${society.id}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#040814', color: '#fff', fontFamily: "'Inter', 'Segoe UI', sans-serif", overflowX: 'hidden' }}>
      
      {/* ── Background Glow Blobs ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', filter: 'blur(50px)', animation: 'blobFloat 14s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'blobFloat 18s ease-in-out infinite reverse' }} />
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
          <button onClick={handleWhatsApp} style={{ background: p.accentGradient, border: 'none', color: '#fff', padding: '7px 18px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 700, letterSpacing: '0.03em' }}>
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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: `${p.accentColor}25`, border: `1px solid ${p.accentColor}50`, borderRadius: '20px', padding: '6px 16px', marginBottom: '20px' }}>
          <ShieldCheck size={14} style={{ color: '#A78BFA' }} />
          <span style={{ fontSize: '0.72rem', color: '#DDD6FE', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            MahaRERA: {p.rera} · Verified Integrated Township
          </span>
        </div>

        {/* Hero Title */}
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '16px', background: 'linear-gradient(135deg, #FFFFFF 0%, #F3E5AB 50%, #D4AF37 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {p.fullName}
        </h1>

        <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: '#C4B5FD', fontWeight: 400, marginBottom: '10px', lineHeight: 1.6 }}>
          {p.tagline}
        </p>
        <p style={{ fontSize: '0.92rem', color: '#94A3B8', marginBottom: '32px', maxWidth: '780px' }}>
          {p.heroSubline}
        </p>

        {/* Key Stats Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '36px' }}>
          {[
            { icon: <MapPin size={14} />, label: 'Location', value: 'Hinjewadi Phase 3, Pune' },
            { icon: <Building2 size={14} />, label: 'Developer', value: 'Pride Purple Group' },
            { icon: <Clock size={14} />, label: 'Possession', value: 'Ready to Move & New Phase' },
            { icon: <Award size={14} />, label: 'Investment Score', value: `${p.investmentScore}/100` },
            { icon: <CheckCircle2 size={14} />, label: 'Township Status', value: '100% Integrated' },
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
      <section style={{ position: 'relative', zIndex: 1, background: `${p.accentColor}18`, borderTop: `1px solid ${p.accentColor}35`, borderBottom: `1px solid ${p.accentColor}35`, padding: '22px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: '8px' }}>
            Township Highlights →
          </span>
          {p.uniqueFeatures.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${p.accentColor}40`, borderRadius: '20px', padding: '7px 16px' }}>
              <CheckCircle2 size={14} style={{ color: '#A78BFA', flexShrink: 0 }} />
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
                ✨ Verified Visual Tour · {p.gallery.length} Authentic Creatives
              </span>
            </div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 700, color: '#F3E5AB', marginBottom: '8px' }}>
              Explore Megapolis Living &amp; Interiors
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', maxWidth: '580px', margin: '0 auto' }}>
              Authentic room creatives representing Megapolis Township residences. Click any photo to zoom in fullscreen.
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
                  color: activeGalleryIdx === idx ? '#FFFFFF' : '#CBD5E1',
                  border: activeGalleryIdx === idx ? `1px solid ${p.accentColor}` : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '30px',
                  padding: '8px 18px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  boxShadow: activeGalleryIdx === idx ? '0 4px 16px rgba(124,58,237,0.4)' : 'none'
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
                  background: activeGalleryIdx === idx ? 'rgba(124,58,237,0.18)' : 'rgba(255,255,255,0.03)',
                  border: activeGalleryIdx === idx ? '2px solid #A78BFA' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: activeGalleryIdx === idx ? '0 4px 20px rgba(124,58,237,0.3)' : 'none',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ height: '90px', background: '#020610', overflow: 'hidden', position: 'relative' }}>
                  <img src={item.src} alt={item.tag} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {activeGalleryIdx === idx && (
                    <div style={{ position: 'absolute', top: '6px', right: '6px', background: '#7C3AED', color: '#fff', fontSize: '0.6rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                      ACTIVE
                    </div>
                  )}
                </div>
                <div style={{ padding: '8px 10px', fontSize: '0.75rem', fontWeight: 600, color: activeGalleryIdx === idx ? '#DDD6FE' : '#94A3B8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span>{item.icon}</span>
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── TOWNSHIP SOCIETY EXPLORER (SPECIAL MEGAPOLIS FEATURE) ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '70px 24px 30px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '20px', padding: '5px 16px', marginBottom: '12px' }}>
            <Building2 size={13} color="#A78BFA" />
            <span style={{ fontSize: '0.7rem', color: '#DDD6FE', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Township Society Explorer · 5 Distinct Clusters
            </span>
          </div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 700, color: '#F3E5AB', marginBottom: '10px' }}>
            Explore Megapolis Societies
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', maxWidth: '580px', margin: '0 auto' }}>
            Select any society below to browse active listings, configurations, and verified pricing.
          </p>
        </div>

        {/* 5-Society Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {MEGAPOLIS_SOCIETIES.map((soc) => (
            <div
              key={soc.id}
              onClick={() => handleSocietyClick(soc)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = soc.accentHex;
                e.currentTarget.style.boxShadow = `0 12px 30px ${soc.accentHex}25`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
                <img src={soc.imageUrl} alt={soc.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(4,8,20,0.85)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700, color: soc.accentHex, border: `1px solid ${soc.accentHex}50` }}>
                  {soc.status === 'READY_TO_MOVE' ? 'Ready to Move' : 'Under Construction'}
                </div>
                {soc.id === 'sangria' && (
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: '#E11D48', color: '#fff', fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                    📸 5 Photos
                  </div>
                )}
                {soc.id === 'splendour' && (
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: '#D4AF37', color: '#040814', fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                    🌟 Showcase Subpage · 5 Photos
                  </div>
                )}
                {soc.id === 'saffron' && (
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: '#F97316', color: '#FFFFFF', fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                    🌟 Showcase Subpage · 5 Photos
                  </div>
                )}
                {soc.id === 'sparklet' && (
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: '#06B6D4', color: '#040814', fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                    🌟 Showcase Subpage · 5 Photos
                  </div>
                )}
              </div>

              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.05rem', fontWeight: 700, color: '#F3E5AB', marginBottom: '4px' }}>
                    {soc.displayName}
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '8px 0 10px' }}>
                    <span style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', color: '#F3E5AB', fontSize: '0.68rem', fontWeight: 600, padding: '3px 8px', borderRadius: '4px' }}>
                      📐 {soc.carpetRange}
                    </span>
                    <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#CBD5E1', fontSize: '0.68rem', fontWeight: 500, padding: '3px 8px', borderRadius: '4px' }}>
                      {soc.bhkOptions.join(' · ')}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#4ADE80' }}>
                    {soc.priceRange}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#A78BFA', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Explore <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── APARTMENT CONFIGURATIONS ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '70px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 700, color: '#F3E5AB', marginBottom: '12px' }}>
            Township Configurations &amp; Floor Space
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto' }}>
            RERA-verified carpet areas across Megapolis clusters. MahaRERA: {p.rera}.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {p.configurations.map((c, i) => (
            <div 
              key={i} 
              style={{ 
                position: 'relative', 
                background: c.highlight ? 'linear-gradient(135deg, rgba(124,58,237,0.22), rgba(124,58,237,0.08))' : 'rgba(255,255,255,0.04)', 
                border: c.highlight ? '1px solid #A78BFA' : '1px solid rgba(255,255,255,0.08)', 
                borderRadius: '16px', 
                padding: '28px 24px', 
                textAlign: 'center', 
                transition: 'transform 0.2s, box-shadow 0.2s', 
                cursor: 'default' 
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(124,58,237,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {c.highlight && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(90deg, #D4AF37, #F3E5AB)', color: '#1a1a1a', fontSize: '0.65rem', fontWeight: 700, padding: '3px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Most Popular
                </div>
              )}
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F3E5AB', fontFamily: "'Cinzel', serif", lineHeight: 1, marginBottom: '6px' }}>{c.bhk}</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: c.highlight ? '#D4AF37' : '#CBD5E1', marginBottom: '12px' }}>{c.carpet}</div>
              <div style={{ fontSize: '0.78rem', color: '#4ADE80', fontWeight: 600, marginBottom: '8px' }}>{c.price}</div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginBottom: '20px', lineHeight: 1.4 }}>{c.note}</div>
              <button onClick={handleWhatsApp} style={{ width: '100%', background: p.accentGradient, border: 'none', color: '#fff', padding: '10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                Get Quote &amp; Floor Plan →
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '28px', padding: '16px', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '10px', fontSize: '0.8rem', color: '#D4AF37' }}>
          ℹ️ All carpet areas listed above comply with MahaRERA standards. Pricing is indicative and subject to tower floor-rise and orientation.
        </div>
      </section>

      {/* ── AMENITIES ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '70px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, color: '#F3E5AB', marginBottom: '12px', textAlign: 'center' }}>
            142-Acre Township Amenities
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', textAlign: 'center', marginBottom: '48px' }}>
            Megapolis Township — Hinjewadi Phase 3, Pune
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
          Location &amp; Strategic IT Connectivity
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem', textAlign: 'center', marginBottom: '48px' }}>
          Rajiv Gandhi Infotech Park, Hinjewadi Phase 3, Pune — 411057
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
              <MapPin size={16} /> Township &amp; Civic Infrastructure
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
          background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(212,175,55,0.06) 100%)',
          border: '1px solid rgba(212,175,55,0.22)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#A78BFA', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
              Master Developer
            </div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: '1.45rem', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>
              Pride Purple Group &amp; Pegasus Properties
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.6, maxWidth: '580px' }}>
              Premier Pune developer with 25+ years of landmark township delivery. Megapolis is their flagship 142-acre integrated city in Hinjewadi Phase 3 with 5 distinct society clusters housing over 5,000 satisfied tech families.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['25+ Years', '142 Acres', '5,000+ Homes'].map(tag => (
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
              <span>Private Township Tour</span>
              <ArrowRight size={14} />
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
            Megapolis Township — Hinjewadi Phase 3, Pune
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
            Ready to Explore Megapolis Township?
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '36px' }}>
            Connect with 24K Realtors for live resale pricing, floor plans, and an exclusive private site visit across all 5 Megapolis societies in Hinjewadi Phase 3.
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
                  {p.name} · Verified 24K Realtors Visual Creative
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
