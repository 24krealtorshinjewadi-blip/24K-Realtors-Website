/**
 * JoyvilleSensoriumProjectPage.jsx — 24K Realtors
 * ─────────────────────────────────────────────────────────────────────────────
 * Ultra-Luxury Flagship Project Subpage for Joyville Sensorium by Shapoorji Pallonji,
 * Hinjawadi, Pune.
 *
 * Project Specifications:
 *  - Project Name: Joyville Sensorium
 *  - Developer: Shapoorji Pallonji (Joyville Shapoorji Housing)
 *  - Location: Hinjawadi Phase 1 / Maan, Near Mula River, Pune — 411057
 *  - Status: Phased Possession / Ready-to-Move Residences
 *  - Tower-Wise MahaRERA Registrations:
 *      • Vista Tower: P52100027234
 *      • Elation Tower: P52100024965
 *      • Ambrosia Tower: P52100024963
 *      • Phase IV: P52100027244
 *  - Apartment Typology & RERA Usable Carpet Area:
 *      • 2 BHK Apartments: 697 to 792 sq. ft.
 *        Key Inclusions: 2 bedrooms, bathrooms, living & dining space, kitchen, terrace, and a dry balcony.
 *      • 3 BHK Apartments: 973 to 979 sq. ft.
 *        Key Inclusions: 3 bedrooms, bathrooms, living & dining space, kitchen, terrace, and a dry balcony.
 *  - Signature Amenities:
 *      • Wellness & Leisure: Riverfront Clubhouse, Swimming Pools, Relaxation Zones, Spa & Steam, Meditation Deck
 *      • Sports & Outdoor Recreation: Courts & Pitches, Tracks & Fitness, Family & Social Spaces, Amphitheatre
 *  - 100% Authentic On-Site Photos (5 Verified Views):
 *      • Panoramic Riverfront Balcony with Wood-Finish Tiling & Mula River / Mountain Vista
 *      • Expansive Living & Dining Hall with Glossy Vitrified Tiles & Double Sliding Terrace Doors
 *      • Scenic Master Bedroom with Safety Grill Window looking out at Nature
 *      • L-Shaped Granite Platform Kitchen with Gooseneck Tap & Dedicated Dry Balcony Opening
 *      • Designer Marble-Finished Bathroom with Wall-Hung Commode & Concealed Dual Flush
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
  Copy, ArrowRight, Share2, Calendar, Droplets, Sun, Wind
} from 'lucide-react';
import { useSEO } from '../services/seoService';
import CompanyLogo from './CompanyLogo';

/* ══════════════════════════════════════════════════════════════════
   JOYVILLE SENSORIUM PROJECT DATA SPECIFICATION
══════════════════════════════════════════════════════════════════ */
const SENSORIUM_DATA = {
  key: 'joyville-sensorium',
  name: 'Joyville Sensorium',
  shortName: 'Sensorium',
  developer: 'Shapoorji Pallonji',
  reraNumbers: [
    {
      tower: 'Vista',
      number: 'P52100027234',
      type: 'Residential High-Rise Tower',
      status: 'Registered & Clear Title'
    },
    {
      tower: 'Elation',
      number: 'P52100024965',
      type: 'Residential High-Rise Tower',
      status: 'Registered & Clear Title'
    },
    {
      tower: 'Ambrosia',
      number: 'P52100024963',
      type: 'Residential High-Rise Tower',
      status: 'Registered & Clear Title'
    },
    {
      tower: 'Phase IV',
      number: 'P52100027244',
      type: 'Residential Phase Expansion',
      status: 'Registered & Clear Title'
    }
  ],
  reraSummary: 'Vista: P52100027234 · Elation: P52100024965 · Ambrosia: P52100024963 · Phase IV: P52100027244',
  location: 'Hinjawadi Phase 1 / Maan, Near Mula River, Pune — 411057',
  status: 'Ready-to-Move / Phased Possession',
  tagline: 'Riverfront Biophilic Residences with 2.8-Acre Multi-Tier Central Greens',
  heroSubline: 'A landmark 10.5-acre riverfront development by Shapoorji Pallonji in Hinjawadi, Pune. Featuring premium 2 BHK (697–792 sq.ft) and 3 BHK (973–979 sq.ft) residences, all designed with attached private terraces, dry balconies, tower-wise MahaRERA registrations, iconic riverfront clubhouse, and seamless connectivity to Hinjawadi Phase 1 IT Park.',
  accentColor: '#10B981',
  accentGradient: 'linear-gradient(135deg, #047857 0%, #10B981 50%, #34D399 100%)',
  heroBg: 'linear-gradient(160deg, #040814 0%, #062319 45%, #03140f 100%)',
  showcaseImage: '/joyville_sensorium_balcony.jpg',
  investmentScore: 99,
  priceNegotiable: true,
  whatsappText: 'Hi 24K Realtors, I am interested in Joyville Sensorium by Shapoorji Pallonji in Hinjawadi (2 BHK 697-792 sq.ft / 3 BHK 973-979 sq.ft - Price Negotiable). Please share floor plans, tower inventory, and schedule a private site visit.',

  gallery: [
    {
      id: 1,
      tag: 'River & Mountain View Terrace',
      icon: '🏞️',
      roomName: 'Riverfront Balcony',
      title: 'Panoramic Riverfront Terrace — Mula River & Sahyadri Vistas',
      subtitle: 'Extra-deep private balcony terrace with wood-plank style anti-skid ceramic tiling and heavy-duty safety railing. Enjoy panoramic views of the perennial Mula river, green rolling hills, and sunrise breezes.',
      src: '/joyville_sensorium_balcony.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '🌊', title: 'Perennial Riverfront Sightlines', desc: 'Direct, unobstructed frontage overlooking the scenic Mula river valley' },
        { icon: '🪵', title: 'Wood-Textured Anti-Skid Deck', desc: 'Weather-resistant rustic timber floor finish creating a luxury resort feel' },
        { icon: '⛰️', title: 'Sahyadri Hill Panorama', desc: 'High-floor scenic vistas of lush western ghat foothills and open skies' }
      ]
    },
    {
      id: 2,
      tag: 'Grand Living & Dining Lounge',
      icon: '🛋️',
      roomName: 'Living & Dining',
      title: 'Expansive Living & Dining Hall — Dual Aspect Terrace Access',
      subtitle: 'Spacious open-concept living lounge laid with glossy premium vitrified tiles, twin multi-track black aluminum sliding glass doors opening directly out to the viewing terrace, and cross-ventilation window.',
      src: '/joyville_sensorium_living.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '☀️', title: 'Wall-to-Wall Glass Glazing', desc: 'Floor-to-ceiling sliding glass doors infusing maximum natural light' },
        { icon: '✨', title: 'Polished Mirror Vitrified Tiles', desc: 'Large format double-charged vitrified flooring with reflective sheen' },
        { icon: '🌬️', title: 'Optimum Airflow Dynamics', desc: 'Designed for cross-ventilation connecting terrace and dining zones' }
      ]
    },
    {
      id: 3,
      tag: 'Scenic Master Bedroom',
      icon: '🛏️',
      roomName: 'Master Bedroom',
      title: 'Serene Master Suite — Uninterrupted Nature & Hill Views',
      subtitle: 'Peaceful master bedroom with large matte-black aluminum window with integrated safety grill, smooth gypsum-finished white walls, glossy tile flooring, and peaceful green hillside landscape vistas.',
      src: '/joyville_sensorium_bedroom.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '🪟', title: 'Full-Sized Scenic Picture Window', desc: 'Framed panoramic views of surrounding green plantations and Sahyadri ridgeline' },
        { icon: '🔌', title: 'Concealed High-Grade Electricals', desc: 'Bedside two-way switches, TV cable provisions, and dedicated AC conduit' },
        { icon: '🧘', title: 'Quiet Low-Noise Zone', desc: 'Acoustically shielded positioning away from corridor and elevator core' }
      ]
    },
    {
      id: 4,
      tag: 'L-Shaped Granite Platform Kitchen',
      icon: '🍳',
      roomName: 'Modular Kitchen',
      title: 'Spacious Kitchen Space — Black Granite & Dedicated Dry Balcony',
      subtitle: 'Generous L-shaped jet-black polished granite cooking platform with stainless steel sink, gooseneck chrome swivel mixer, glazed ceramic tiled dado, and direct glass doorway leading to the utility dry balcony.',
      src: '/joyville_sensorium_kitchen.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '🖤', title: 'L-Shaped Polished Jet Black Granite', desc: 'Dual-side prep and cook zones with ample room for stove, microwave, and appliances' },
        { icon: '🚰', title: 'SS Sink with Arching Gooseneck Mixer', desc: 'Single-bowl stainless steel wash sink with high-clearance water spout' },
        { icon: '🧺', title: 'Attached Dry Balcony Provision', desc: 'Dedicated service area with washing machine inlet/outlet and drying rack space' }
      ]
    },
    {
      id: 5,
      tag: 'Designer Marble-Tiled Bathroom',
      icon: '🚿',
      roomName: 'Designer Bathroom',
      title: 'Fitted Bathroom — Italian Marble Texture & Wall-Hung Commode',
      subtitle: 'Hotel-grade bathroom enveloped in floor-to-ceiling beige Italian marble patterned ceramic tiles, premium wall-hung European water closet, concealed dual-flush plate, chrome shower mixer, and frosted louvered window.',
      src: '/joyville_sensorium_bathroom.jpg',
      badge: 'VERIFIED ON-SITE PHOTO',
      features: [
        { icon: '🏛️', title: 'Full-Height Marble-Patterned Tiles', desc: 'Elegant beige vein wall tiling ensuring complete waterproofing and luxury aesthetic' },
        { icon: '🚽', title: 'Wall-Hung Commode & Concealed Flush', desc: 'Sleek European sanitary ware with dual-flush chrome plate for water conservation' },
        { icon: '🚿', title: 'Branded Chrome Diverter & Spout', desc: 'Grohe/Jaquar grade brass fittings with hot/cold shower mixer and health faucet' }
      ]
    }
  ],

  configurations: [
    {
      type: '2 BHK Luxury Residence',
      shortType: '2 BHK',
      carpet: '697 – 792 sq. ft.',
      carpetNote: 'RERA Usable Carpet Area Range',
      inclusions: '2 Bedrooms, 2 Bathrooms, Living & Dining Space, Kitchen, Private Terrace, and Dry Balcony',
      balcony: 'Attached Riverfront Terrace + Separate Dry Balcony',
      bathrooms: '2 Bathrooms (Master En-suite + Common)',
      pricing: '₹88L – ₹1.05 Cr* (Negotiable)',
      status: 'Ready to Move / Phased Handover',
      idealFor: 'IT Executives, Families wanting spacious rooms with river views',
      highlightBadge: 'HIGH DEMAND RIVER RESIDENCE',
      specs: [
        { label: 'Living & Dining', val: 'Spacious lounge with full-height sliding glass doors' },
        { label: 'Bedrooms', val: '2 Well-appointed private bedrooms' },
        { label: 'Kitchen & Utility', val: 'L-shaped granite platform + attached dry balcony' },
        { label: 'Terrace', val: 'Private viewing deck with wood-finish tile' }
      ]
    },
    {
      type: '3 BHK Royal Residence',
      shortType: '3 BHK',
      carpet: '973 – 979 sq. ft.',
      carpetNote: 'RERA Usable Carpet Area Range',
      inclusions: '3 Bedrooms, 3 Bathrooms, Living & Dining Space, Kitchen, Private Terrace, and Dry Balcony',
      balcony: 'Grand Panoramic Riverfront Terrace + Dry Balcony',
      bathrooms: '3 Bathrooms with Italian Marble Finished Tiles',
      pricing: '₹1.25 Cr – ₹1.45 Cr* (Negotiable)',
      status: 'Ready to Move / Phased Handover',
      idealFor: 'Senior Tech Leaders, Multi-Gen Families, Luxury Upgraders',
      highlightBadge: 'SIGNATURE 3 BHK SUITE',
      specs: [
        { label: 'Living & Dining', val: 'Grand entertaining hall with riverfront vista' },
        { label: 'Bedrooms', val: '3 Spacious bedrooms (Master + Guest + Kids)' },
        { label: 'Kitchen & Utility', val: 'L-shaped granite platform with utility dry balcony' },
        { label: 'Bathrooms', val: '3 Luxury bathrooms with wall-hung commodes' }
      ]
    }
  ],

  amenities: [
    {
      category: 'Wellness & Leisure Amenities',
      icon: '🌿',
      accent: '#10B981',
      items: [
        { name: 'Grand Riverfront Clubhouse', desc: 'Over 30,000 sq.ft of luxury amenities overlooking the serene Mula river' },
        { name: 'Infinity Edge Swimming Pools', desc: 'Olympic-style lap pool with separate kids splash deck and sun lounger pavilion' },
        { name: 'Relaxation & Spa Zones', desc: 'Steam, sauna, massage rooms, and reflexology walking pathways' },
        { name: 'Meditation & Yoga Lawns', desc: 'Sunrise yoga pavilion surrounded by biophilic planting and water features' }
      ]
    },
    {
      category: 'Sports & Outdoor Recreation',
      icon: '🎾',
      accent: '#3B82F6',
      items: [
        { name: 'Multi-Sport Courts & Pitches', desc: 'Floodlit tennis court, futsal court, and dedicated cricket practice nets' },
        { name: 'Fitness Gym & Aerobics', desc: 'Fully equipped fitness center with Technogym equipment & free weights' },
        { name: 'Jogging & Cycling Tracks', desc: 'Dedicated 1.8 km vehicular-free jogging track woven through 2.8 acres of greens' },
        { name: 'Family & Social Spaces', desc: 'Open-air amphitheater, BBQ deck, celebration party lawn, and kids adventure park' }
      ]
    },
    {
      category: 'Shapoorji Legacy & Smart Living',
      icon: '🛡️',
      accent: '#D4AF37',
      items: [
        { name: '150+ Years Engineering Legacy', desc: 'World-renowned construction precision and unmatched build quality' },
        { name: '2.8-Acre Multi-Tier Central Park', desc: '75% open landscaped spaces designed on biophilic sensory principles' },
        { name: 'Multi-Tier Smart Security Grid', desc: 'RFID boom barriers, CCTV surveillance, and video door phone monitoring' },
        { name: '100% DG Power Backup', desc: 'Uninterrupted power for automatic elevators, water systems, and common areas' }
      ]
    }
  ],

  commuteMatrix: [
    { destination: 'Hinjawadi Phase 1 Circle (Wipro / Infosys)', distance: '2.5 km', time: '5 mins' },
    { destination: 'Pune Metro Line 3 Station (Hinjawadi Ph 1)', distance: '2.8 km', time: '6 mins' },
    { destination: 'Tech Mahindra & Phase 3 IT Campus', distance: '4.5 km', time: '9 mins' },
    { destination: 'Wakad Junction & Phoenix Mall of the Millennium', distance: '6.5 km', time: '12 mins' },
    { destination: 'Mumbai-Pune Expressway (Bypass)', distance: '7.8 km', time: '14 mins' },
    { destination: 'Bhumkar Chowk / D-Mart Wakad', distance: '6.8 km', time: '13 mins' },
    { destination: 'Ruby Hall Clinic Hinjawadi', distance: '5.2 km', time: '10 mins' }
  ],

  faqs: [
    {
      q: 'What are the MahaRERA registration numbers for Joyville Sensorium?',
      a: 'Joyville Sensorium is registered with MahaRERA tower-wise: Vista: P52100027234, Elation: P52100024965, Ambrosia: P52100024963, and Phase IV: P52100027244. All phases carry clear title and legal approvals.'
    },
    {
      q: 'What are the exact carpet area sizes for 2 BHK and 3 BHK apartments?',
      a: '2 BHK apartments feature a RERA carpet area of 697 to 792 sq. ft. including 2 bedrooms, bathrooms, living & dining space, kitchen, terrace, and dry balcony. 3 BHK apartments offer 973 to 979 sq. ft. of usable carpet area with 3 bedrooms, bathrooms, living & dining space, kitchen, terrace, and dry balcony.'
    },
    {
      q: 'Who is the developer of Joyville Sensorium?',
      a: 'Joyville Sensorium is developed by Shapoorji Pallonji Real Estate (Joyville Shapoorji Housing), a trusted real estate and construction conglomerate with a 150+ year legacy across India and the globe.'
    },
    {
      q: 'What makes Sensorium unique among Hinjawadi projects?',
      a: 'Sensorium is situated right along the scenic Mula river with direct riverfront views and 2.8 acres of multi-tier central biophilic greens. It features an exclusive riverfront clubhouse, infinity pools, attached private terraces for every unit, and separate dry balconies.'
    },
    {
      q: 'Are prices negotiable for Joyville Sensorium residences?',
      a: 'Yes, 24K Realtors assists clients with direct developer pricing and resale negotiation for 2 BHK and 3 BHK units, ensuring optimal commercial discounts and payment plan benefits.'
    }
  ]
};

export default function JoyvilleSensoriumProjectPage({ initialBhkFilter = null, onBackHome }) {
  const navigate = useNavigate();
  const p = SENSORIUM_DATA;

  // SEO
  useSEO({
    title: 'Joyville Sensorium Hinjewadi | 2 & 3 BHK Riverfront Flats | Shapoorji Pallonji | 24K Realtors',
    description: 'Explore verified ready-to-move 2 BHK (697-792 sq.ft) & 3 BHK (973-979 sq.ft) riverfront flats in Joyville Sensorium by Shapoorji Pallonji in Hinjawadi, Pune. Tower-wise MahaRERA: Vista (P52100027234), Elation (P52100024965), Ambrosia (P52100024963), Phase IV (P52100027244). 100% authentic on-site photos.',
    canonical: 'https://24krealtors.in/joyville-sensorium'
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

      {/* Global CSS for Joyville Sensorium Emerald-Gold luxury aesthetic */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;1,500&display=swap');
        
        .sensorium-emerald-text {
          background: linear-gradient(135deg, #10B981 0%, #34D399 50%, #6EE7B7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sensorium-gold-text {
          background: linear-gradient(135deg, #F3E5AB 0%, #D4AF37 60%, #AA771C 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sensorium-emerald-btn {
          background: linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%);
          color: #040814;
          font-weight: 800;
          border: none;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sensorium-emerald-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(16, 185, 129, 0.6);
        }

        .sensorium-outline-btn {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(16, 185, 129, 0.35);
          color: #E2E8F0;
          transition: all 0.2s ease;
        }
        .sensorium-outline-btn:hover {
          background: rgba(16, 185, 129, 0.12);
          border-color: #10B981;
          color: #6EE7B7;
        }

        .sensorium-glass-card {
          background: rgba(255, 255, 255, 0.025);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          transition: all 0.3s ease;
        }
        .sensorium-glass-card:hover {
          border-color: rgba(16, 185, 129, 0.4);
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.12);
        }

        @keyframes riverPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.05); }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════
          1. STICKY LUXURY TOPBAR
      ══════════════════════════════════════════════════════════════ */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        background: 'rgba(4, 8, 20, 0.94)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(16, 185, 129, 0.25)',
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
                else navigate('/societies');
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
              <span>Explore Societies</span>
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
                  color: '#34D399'
                }}>
                  JOYVILLE SENSORIUM
                </span>
                <span style={{
                  display: 'block',
                  fontSize: '0.65rem',
                  color: '#94A3B8',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}>
                  By Shapoorji Pallonji · Hinjawadi, Pune
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
              <Phone size={15} color="#10B981" />
              <span>+91 96730 00053</span>
            </a>

            <button
              onClick={() => openWhatsApp()}
              className="sensorium-emerald-btn"
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
        borderBottom: '1px solid rgba(16, 185, 129, 0.2)'
      }}>
        {/* Decorative Emerald Glow Blobs */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'riverPulse 8s ease-in-out infinite alternate',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-5%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(4,120,87,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          
          {/* Breadcrumb + Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Pune Luxury</span>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>/</span>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Hinjawadi Phase 1 Corridor</span>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>/</span>
            <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 600 }}>Shapoorji Pallonji</span>
            
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
                RIVERFRONT LUXURY · PHASED POSSESSION
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
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '6px 14px',
                borderRadius: '30px',
                marginBottom: '16px'
              }}>
                <Sparkles size={14} color="#10B981" />
                <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Shapoorji Pallonji · 150+ Years Legacy
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
                JOYVILLE <span className="sensorium-emerald-text">SENSORIUM</span>
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
                    2 BHK Carpet
                  </span>
                  <p style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34D399', margin: '4px 0 0' }}>
                    697 – 792 sqft
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    3 BHK Carpet
                  </span>
                  <p style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34D399', margin: '4px 0 0' }}>
                    973 – 979 sqft
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Inclusions
                  </span>
                  <p style={{ fontSize: '0.95rem', fontWeight: 800, color: '#F3E5AB', margin: '4px 0 0' }}>
                    Terrace + Dry Balc.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => openWhatsApp()}
                  className="sensorium-emerald-btn"
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
                    const el = document.getElementById('sensorium-gallery');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="sensorium-outline-btn"
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
                border: '1px solid rgba(16, 185, 129, 0.4)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.2)'
              }}>
                <img
                  src={p.showcaseImage}
                  alt="Joyville Sensorium Riverfront Balcony"
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
                        background: 'rgba(16, 185, 129, 0.85)',
                        color: '#040814',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        letterSpacing: '0.06em'
                      }}>
                        VERIFIED ON-SITE RIVER VIEW
                      </span>
                      <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', color: '#F3E5AB', margin: '8px 0 4px' }}>
                        Riverfront Balcony with Wood Tile Terrace
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: '#E2E8F0', margin: 0 }}>
                        Unobstructed panoramas of Mula river and rolling green Sahyadri hills.
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
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: '#040814',
                fontWeight: 900,
                fontSize: '0.75rem',
                padding: '6px 14px',
                borderRadius: '20px',
                boxShadow: '0 4px 15px rgba(16,185,129,0.4)',
                letterSpacing: '0.06em'
              }}>
                10.5 ACRES · 2.8 ACRE CENTRAL GREENS
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          3. TOWER-WISE MAHARERA REGISTRATION TRUST STRIP
      ══════════════════════════════════════════════════════════════ */}
      <section style={{
        background: 'rgba(16, 185, 129, 0.06)',
        borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
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
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={24} color="#10B981" />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
                Tower-Wise RERA Compliance
              </span>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#F3E5AB', margin: 0 }}>
                MahaRERA Registered Residential Towers
              </h3>
            </div>
          </div>

          {/* RERA Numbers with 1-Click Copy */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            {p.reraNumbers.map((r, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.66rem', color: '#34D399', display: 'block', fontWeight: 700 }}>
                    Tower {r.tower}
                  </span>
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.04em' }}>
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
                color: '#34D399',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              <span>Verify on MahaRERA</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          4. 5-PHOTO INTERACTIVE LIGHTBOX GALLERY
      ══════════════════════════════════════════════════════════════ */}
      <section id="sensorium-gallery" style={{ padding: '70px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Section Heading */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '20px',
            padding: '5px 16px',
            marginBottom: '12px'
          }}>
            <Eye size={14} color="#10B981" />
            <span style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
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
            Experience Joyville Sensorium Residences
          </h2>

          <p style={{ color: '#94A3B8', fontSize: '0.92rem', maxWidth: '620px', margin: '0 auto' }}>
            Explore actual photographs of ready Joyville Sensorium units. Click any photo to zoom in high-definition and inspect finishings.
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
        <div className="sensorium-glass-card" style={{ padding: '24px', marginBottom: '36px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'center' }}>
            
            {/* Left: Large Photo */}
            <div
              onClick={() => openLightbox(activeGalleryIdx)}
              style={{
                position: 'relative',
                borderRadius: '14px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid rgba(16, 185, 129, 0.3)',
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
                color: '#34D399',
                fontWeight: 800,
                fontSize: '0.68rem',
                padding: '4px 10px',
                borderRadius: '4px',
                border: '1px solid rgba(16, 185, 129, 0.4)'
              }}>
                {p.gallery[activeGalleryIdx].badge}
              </div>

              <div style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                background: 'rgba(16, 185, 129, 0.9)',
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
              <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
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
                  className="sensorium-emerald-btn"
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
                  onClick={() => openWhatsApp(`Hi 24K Realtors, I liked the ${p.gallery[activeGalleryIdx].tag} in Joyville Sensorium. Can you share availability for this layout?`)}
                  className="sensorium-outline-btn"
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
                  <span>Ask About This Layout</span>
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
                border: activeGalleryIdx === idx ? '2px solid #10B981' : '1px solid rgba(255,255,255,0.08)',
                boxShadow: activeGalleryIdx === idx ? '0 0 16px rgba(16,185,129,0.4)' : 'none',
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
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '20px',
              padding: '5px 16px',
              marginBottom: '12px'
            }}>
              <Home size={14} color="#10B981" />
              <span style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Apartment Typology &amp; RERA Carpet Areas
              </span>
            </div>

            <h2 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(1.7rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: '#F3E5AB',
              marginBottom: '10px'
            }}>
              Sensorium Configurations &amp; Inclusions
            </h2>

            <p style={{ color: '#94A3B8', fontSize: '0.92rem', maxWidth: '640px', margin: '0 auto' }}>
              Every residence includes private terrace and utility dry balcony as standard.
            </p>
          </div>

          {/* BHK Filter Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '32px' }}>
            {['ALL', '2 BHK', '3 BHK'].map((bhk) => (
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
                className="sensorium-glass-card"
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
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#34D399',
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
                    Shapoorji Pallonji · Joyville
                  </span>
                  <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', color: '#FFFFFF', margin: '4px 0 12px' }}>
                    {cfg.type}
                  </h3>

                  {/* Carpet Area Highlight Box */}
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: '10px',
                    padding: '14px',
                    marginBottom: '18px'
                  }}>
                    <span style={{ fontSize: '0.7rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      RERA Carpet Area Range
                    </span>
                    <p style={{ fontSize: '1.35rem', fontWeight: 900, color: '#34D399', margin: '2px 0 4px' }}>
                      {cfg.carpet}
                    </p>
                    <span style={{ fontSize: '0.74rem', color: '#CBD5E1' }}>
                      {cfg.carpetNote}
                    </span>
                  </div>

                  {/* Key Inclusions Box */}
                  <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '16px'
                  }}>
                    <span style={{ fontSize: '0.68rem', color: '#F3E5AB', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '4px' }}>
                      Key Inclusions:
                    </span>
                    <p style={{ fontSize: '0.8rem', color: '#E2E8F0', margin: 0, lineHeight: 1.45 }}>
                      {cfg.inclusions}
                    </p>
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
                      <span style={{ color: '#94A3B8' }}>Terrace &amp; Dry Balc:</span>
                      <span style={{ color: '#34D399', fontWeight: 600 }}>Included</span>
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
                    onClick={() => openWhatsApp(`Hi 24K Realtors, I am interested in Joyville Sensorium ${cfg.shortType} (${cfg.carpet} - ${cfg.pricing}). Please share floor plans and price breakdown.`)}
                    className="sensorium-emerald-btn"
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
          6. AMENITIES — WELLNESS, LEISURE & SPORTS
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '70px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '20px',
            padding: '5px 16px',
            marginBottom: '12px'
          }}>
            <Trophy size={14} color="#10B981" />
            <span style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Sensorium Lifestyle Privileges
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(1.7rem, 3.5vw, 2.5rem)',
            fontWeight: 800,
            color: '#F3E5AB',
            marginBottom: '10px'
          }}>
            Wellness, Leisure &amp; Outdoor Recreation
          </h2>

          <p style={{ color: '#94A3B8', fontSize: '0.92rem', maxWidth: '640px', margin: '0 auto' }}>
            Sensory-designed biophilic ecosystem with riverfront clubhouse, swimming pools, courts, and tranquil green parks.
          </p>
        </div>

        {/* 3 Pillars Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {p.amenities.map((col, idx) => (
            <div
              key={idx}
              className="sensorium-glass-card"
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
          7. COMMUTE MATRIX & CONNECTIVITY (HINJEWADI PHASE 1)
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
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '20px',
              padding: '5px 16px',
              marginBottom: '12px'
            }}>
              <MapPin size={14} color="#10B981" />
              <span style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Hinjawadi Phase 1 &amp; Riverfront Corridor
              </span>
            </div>

            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.8rem', color: '#F3E5AB', margin: '0 0 8px' }}>
              Prime Tech Park Connectivity
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem' }}>
              Minutes to Hinjawadi Phase 1 tech majors, upcoming Metro Line 3, and Mumbai-Pune Expressway bypass.
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
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  color: '#34D399',
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
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '20px',
            padding: '5px 16px',
            marginBottom: '12px'
          }}>
            <HelpCircle size={14} color="#10B981" />
            <span style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Buyer &amp; Investor FAQ
            </span>
          </div>

          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.8rem', color: '#F3E5AB', margin: '0 0 8px' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.88rem' }}>
            Clear insights into tower-wise MahaRERA numbers, carpet areas, and Shapoorji Pallonji build quality.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {p.faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: openFaqIdx === idx ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255,255,255,0.08)',
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
                {openFaqIdx === idx ? <ChevronUp size={18} color="#10B981" /> : <ChevronDown size={18} color="#94A3B8" />}
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
        background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(4,120,87,0.1) 100%)',
        borderTop: '1px solid rgba(16, 185, 129, 0.3)',
        padding: '60px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <CompanyLogo variant="full" width={180} height={40} style={{ margin: '0 auto 16px' }} />
          
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#F3E5AB', marginBottom: '12px' }}>
            Book Your Private Site Visit for Joyville Sensorium
          </h2>

          <p style={{ color: '#CBD5E1', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '28px' }}>
            24K Realtors offers complimentary private site tours, tower-wise floor plan consultation, legal due-diligence, and best pricing negotiation for Joyville Sensorium.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => openWhatsApp()}
              className="sensorium-emerald-btn"
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
              <Phone size={18} color="#10B981" />
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
              <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 800, textTransform: 'uppercase' }}>
                Joyville Sensorium Verified Photo {lightboxIdx + 1} of {p.gallery.length}
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
                  border: lightboxIdx === i ? '2px solid #10B981' : '1px solid rgba(255,255,255,0.2)',
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
        borderTop: '1px solid rgba(16,185,129,0.3)',
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
          <Phone size={15} color="#10B981" />
          <span>Call Desk</span>
        </a>

        <button
          onClick={() => openWhatsApp(p.whatsappText)}
          className="sensorium-emerald-btn"
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
