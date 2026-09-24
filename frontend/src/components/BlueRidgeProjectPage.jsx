/**
 * BlueRidgeProjectPage.jsx — 24K Realtors
 * ─────────────────────────────────────────────────────────────────────────────
 * Ultra-Luxury Flagship Project Subpage for Paranjape Blue Ridge,
 * Hinjewadi Phase 1, Pune.
 *
 * Features:
 *  - Official Paranjape Blue Ridge 138-Acre Integrated Township Identity
 *  - Verified 3 BHK & Larger (Golf Facing, 1,110+ sq.ft Carpet, ₹1.95 Cr - Negotiable) Flagship Listing
 *  - Primary MahaRERA Numbers: P52100016328, P52100000054, P52100027419
 *  - Newer Sub-Phases & Extensions: P52100055581, P52100029952
 *  - Full-Screen Interactive Lightbox Gallery with Pan, Zoom & Double-Click Zoom
 *  - 100% Authentic Photos: Living & Dining, Master Bedroom, Modular Kitchen, Luxury Bathroom, Golf-Facing Balcony
 *  - 4-Pillar Categorized Amenities: Sports & Fitness, Recreation & Relaxation, Community & Conveniences, Infrastructure & Security
 *  - Hinjewadi Phase 1 Transit & IT Park Proximity Matrix
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
  Check, ExternalLink, HelpCircle, Layers, Compass, Eye, Shield,
  GraduationCap, ShoppingBag, Radio, ShieldAlert
} from 'lucide-react';
import { useSEO } from '../services/seoService';
import CompanyLogo from './CompanyLogo';

/* ══════════════════════════════════════════════════════════════════
   BLUE RIDGE PROJECT DATA SPECIFICATION
══════════════════════════════════════════════════════════════════ */
const BLUE_RIDGE_DATA = {
  key: 'paranjape-blue-ridge',
  name: 'Paranjape Blue Ridge',
  shortName: 'Blue Ridge',
  developer: 'Paranjape Schemes',
  facing: 'Golf Facing',
  primaryReraNumbers: [
    { number: 'P52100016328', label: 'Primary Cluster / Main Township Phase', status: 'Registered & Clear Title' },
    { number: 'P52100000054', label: 'Township Residential Cluster Phase', status: 'Registered & Clear Title' },
    { number: 'P52100027419', label: 'Signature High-Rise Tower Phase', status: 'Registered & Clear Title' }
  ],
  newerReraNumbers: [
    { number: 'P52100055581', label: 'Newer Sub-Phase / Ongoing Extension', status: 'Active MahaRERA Registration' },
    { number: 'P52100029952', label: 'Sub-Phase & Wing Extension Registry', status: 'Active MahaRERA Registration' }
  ],
  reraSummary: 'Primary: P52100016328, P52100000054, P52100027419 · Extensions: P52100055581, P52100029952',
  location: 'Blue Ridge Township, Near Cognizant & Symbiosis, Hinjewadi Phase 1, Pune — 411057',
  status: 'Ready to Move & Ongoing Extensions / Direct Exclusive Mandate',
  tagline: '138-Acre Integrated Township Pioneer with Signature 9-Hole Golf Course',
  heroSubline: 'Hinjewadi Phase 1\'s landmark 138-acre integrated riverfront township by Paranjape Schemes. Exclusive Golf-Facing 3 BHK luxury residence priced at ₹1.95 Cr (Negotiable) with private 9-hole golf course views, Blue Ridge Public School on campus, expansive riverfront promenade, and immediate walking distance to IT hubs.',
  accentColor: '#10B981',
  accentGradient: 'linear-gradient(135deg, #047857 0%, #10B981 50%, #34D399 100%)',
  heroBg: 'radial-gradient(ellipse at 50% 0%, #06281e 0%, #031812 45%, #040814 100%)',
  showcaseImage: '/blue_ridge_project_card.jpg',
  investmentScore: 98,
  priceNegotiable: true,
  whatsappText: 'Hi 24K Realtors, I am interested in Paranjape Blue Ridge Hinjewadi Phase 1 (Golf Facing 3 BHK, ₹1.95 Cr - Negotiable). Please share floor plans, pricing breakup, and schedule a private site visit.',

  gallery: [
    {
      id: 1,
      tag: 'Township Overview & Project Dossier',
      icon: '🏢',
      roomName: 'Township Overview',
      title: 'Paranjape Blue Ridge — Elevate Your Lifestyle in Hinjewadi Phase 1',
      subtitle: 'Pioneering 138-acre riverfront & golf township by Paranjape Schemes. Ready homes available across 1 BHK, 2 BHK, and 3 BHK & Larger configurations. Featuring 40+ acres of development, lush open greens, signature golf course, and immediate IT park proximity.',
      src: '/blue_ridge_project_card.jpg',
      features: [
        { icon: '🏙️', title: 'Premium Township', desc: '138-acre master-planned riverfront township with signature golf course' },
        { icon: '🌳', title: 'Lush Green Spaces', desc: '40+ acres of open greens, tree-lined avenues, and riverfront parks' },
        { icon: '🏊', title: 'Clubhouse & Amenities', desc: 'Olympic pool, tennis & badminton courts, modern gym, and recreation' },
        { icon: '🚇', title: 'Prime Hinjewadi Location', desc: 'Walking distance to Cognizant, Infosys, schools, and upcoming metro line 3' }
      ]
    },
    {
      id: 2,
      tag: 'Grand Living & Dining Hall',
      icon: '🛋️',
      roomName: 'Living & Dining',
      title: 'Spacious Living & Dining Hall — Designer Wooden Ceiling Rafters',
      subtitle: 'Sunlit living lounge with exposed timber ceiling beams, modern 4-seater dining arrangement, plush sofa corner, decorative display alcove, split AC, and wide sliding doors opening to the balcony.',
      src: '/blue_ridge_living.jpg',
      features: [
        { icon: '🛋️', title: 'Generous Floorplan', desc: 'Seamlessly accommodates 6-seater dining suite and full family sofa lounge' },
        { icon: '🪵', title: 'Designer Wooden Rafters', desc: 'Bespoke ceiling false woodwork with warm recessed lighting and twin fans' },
        { icon: '🪟', title: 'Balcony Connectivity', desc: 'Floor-to-ceiling glass sliding doors bringing abundant natural daylight' },
        { icon: '❄️', title: 'Climate Control', desc: 'Pre-fitted split air conditioner for effortless year-round comfort' }
      ]
    },
    {
      id: 3,
      tag: 'Airy Master Bedroom',
      icon: '🛏️',
      roomName: 'Master Bedroom',
      title: 'Private Master Suite — Wood-Finish Floors, AC & Study Niche',
      subtitle: 'Elegant master bedroom retreat featuring dark timber textured flooring, custom dual-tone wardrobes, integrated vanity/study counter, false ceiling fan, and direct balcony walk-out.',
      src: '/blue_ridge_bedroom.jpg',
      features: [
        { icon: '🪵', title: 'Timber Finish Flooring', desc: 'Rich striped wood-textured floors lending a warm boutique hotel ambiance' },
        { icon: '🚪', title: 'Full-Height Wardrobes', desc: 'Wall-to-wall storage closets with integrated dressing mirror & study desk' },
        { icon: '❄️', title: 'Pre-Installed Split AC', desc: 'High-efficiency inverter air conditioner mounted with concealed cabling' },
        { icon: '🌅', title: 'Balcony Walk-Out', desc: 'Wide glass sliding window framing open sky and refreshing breeze' }
      ]
    },
    {
      id: 4,
      tag: 'Modular Kitchen with Chimney',
      icon: '🍳',
      roomName: 'Modular Kitchen',
      title: 'Contemporary Modular Kitchen — Polished Granite & Exhaust Chimney',
      subtitle: 'Spacious L-shaped kitchen with charcoal grey bottom drawers, pristine white overhead cabinetry, frosted glass showcase units, black granite counter, steel sink, and stainless steel gas stove.',
      src: '/blue_ridge_kitchen.jpg',
      features: [
        { icon: '🍳', title: 'Dual-Tone Cabinetry', desc: 'Matte charcoal grey pull-outs paired with glossy white top storage modules' },
        { icon: '💨', title: 'Chimney & Exhaust Fan', desc: 'Pre-fitted stainless steel cooker hood chimney and auxiliary wall exhaust' },
        { icon: '🖤', title: 'L-Shaped Black Granite', desc: 'Expansive heavy-duty polished platform with deep stainless steel wash sink' },
        { icon: '🍽️', title: 'Utensil Rack & Shelving', desc: 'Wall-mounted stainless steel dish drainage rack and spice storage ledges' }
      ]
    },
    {
      id: 5,
      tag: 'Luxury Designer Bathroom',
      icon: '🚿',
      roomName: 'Luxury Bathroom',
      title: 'Modern Master Bathroom — Glass Shower Cubicle & LED Mirror',
      subtitle: 'High-end contemporary bathroom with tempered frosted glass partition, illuminated backlit LED vanity mirror, jet black vitrified floor tiles, granite sink counter, and premium sanitary fittings.',
      src: '/blue_ridge_bathroom.jpg',
      features: [
        { icon: '🚿', title: 'Glass Shower Partition', desc: 'Full-height glass shower separator keeping wet and dry areas completely distinct' },
        { icon: '💡', title: 'LED Illuminated Mirror', desc: 'Smart backlit vanity mirror providing flattering morning grooming light' },
        { icon: '🖤', title: 'Black Vitrified Floors', desc: 'Non-slip premium black floor tiles paired with sleek granite wash basin slab' },
        { icon: '🚽', title: 'Modern Sanitaryware', desc: 'Branded ceramic commode, chrome towel ladder, and quality CP diverters' }
      ]
    },
    {
      id: 6,
      tag: 'Panoramic Golf-Facing Balcony',
      icon: '⛳',
      roomName: 'Golf Balcony',
      title: 'Expansive Golf-Facing Balcony — Stainless Steel & Glass Railings',
      subtitle: 'Scenic high-floor sit-out balcony overlooking green tree canopies, golf fairways, and Hinjewadi IT towers. Fitted with protective safety netting and durable wood-look exterior floor tiles.',
      src: '/blue_ridge_balcony.jpg',
      features: [
        { icon: '⛳', title: 'Golf & Green Views', desc: 'Direct unblocked panoramic vistas over lush landscape and IT park architecture' },
        { icon: '🛡️', title: 'Glass & Steel Railing', desc: 'Contemporary stainless steel handrails with toughened safety glass panels' },
        { icon: '🕊️', title: 'Fitted Bird Safety Net', desc: 'Full-height high-tensile protective netting installed for clean, safe living' },
        { icon: '☕', title: 'Outdoor Sit-Out Space', desc: 'Ample room for cozy patio armchairs, coffee table, and ornamental plants' }
      ]
    }
  ],

  configurations: [
    {
      bhk: '3 BHK & Larger',
      badge: 'FEATURED GOLF FACING',
      isPopular: true,
      carpet: '~1,110+ sq.ft',
      priceText: '₹1.95 Cr',
      priceSub: '(Negotiable · Golf Facing)',
      desc: 'Exclusive high-floor luxury residence with direct views of the 9-hole golf course. Includes wooden ceiling living room, fitted modular kitchen, master suite with AC, glass-partition bathroom, and scenic balcony.',
      features: [
        '~1,110+ sq.ft Verified RERA Carpet Area',
        'Direct 9-Hole Golf Course & Greenery Facing',
        'Designer Wooden Ceiling Beams & Split AC Installed',
        'Fitted L-Shaped Modular Kitchen with Chimney',
        'Luxury Bathroom with Glass Shower Cubicle & LED Mirror',
        'Price: ₹1.95 Cr (Negotiable) · Ready for Immediate Possession'
      ]
    },
    {
      bhk: '2 BHK',
      badge: 'POPULAR TOWNSHIP LAYOUT',
      isPopular: false,
      carpet: '~800 to 860 sq.ft',
      priceText: 'Price on Request',
      priceSub: '(Direct / Resale Inventory)',
      desc: 'Well-ventilated 2 BHK homes with efficient carpet layouts, dual bathrooms, and generous living-dining areas. Ideal for IT couples and growing families in Hinjewadi.',
      features: [
        '~800 to 860 sq.ft Optimized RERA Carpet',
        'Wide Living Room with Attached Covered Balcony',
        'Full Access to Golf Club, Pools & Sports Courts',
        '2 Mins Walk to Blue Ridge Public School on Campus',
        'High Rental Yield & Strong Capital Appreciation'
      ]
    },
    {
      bhk: '1 BHK',
      badge: 'HIGH RENTAL DEMAND',
      isPopular: false,
      carpet: '~440 to 550 sq.ft',
      priceText: 'Price on Request',
      priceSub: '(Investor Favourite)',
      desc: 'Smart 1 BHK apartments engineered for young tech professionals working in Hinjewadi Phase 1 IT parks. Consistently delivers top rental yields across Pune West.',
      features: [
        '~440 to 550 sq.ft Smart Functional Carpet Area',
        'Walking Distance to Cognizant, Infosys & Wipro Hubs',
        'Township Infrastructure with 24x7 Security & Backup',
        'Daily High-Street Shopping & Cafes on Campus',
        'Ready Tenant Demand from Tech Park Workforce'
      ]
    }
  ],

  // 4 Core Amenity Categories (Exact User-Specified Categories)
  amenityCategories: [
    {
      id: 'sports-fitness',
      title: 'Sports & Fitness',
      subtitle: '9-hole golf course, multi-sport courts, and professional training',
      badge: 'ACTIVE WELLNESS',
      icon: '🏌️',
      items: [
        { icon: '⛳', title: 'Signature Golf Course', desc: 'Pune\'s premier 9-hole executive golf course with professional greens and club academy' },
        { icon: '🏟️', title: 'Sports Facilities', desc: 'Full-fledged sports infrastructure catering to athletics, team sports, and fitness routines' },
        { icon: '🎾', title: 'Indoor & Outdoor Courts', desc: 'Championship-grade tennis, badminton, squash, and basketball courts with floodlights' },
        { icon: '🏋️‍♂️', title: 'Gym / Fitness Centre', desc: 'Modern air-conditioned fitness studio with advanced strength training and cardio machinery' },
        { icon: '🏃‍♂️', title: 'Jogging & Walking Tracks', desc: 'Paved, shaded jogging trails weaving through lush landscaped gardens and riverfronts' }
      ]
    },
    {
      id: 'recreation-relaxation',
      title: 'Recreation & Relaxation',
      subtitle: 'Clubhouses, waterfront decks, swimming pools, and serene nature',
      badge: 'RESORT LIFESTYLE',
      icon: '🏊',
      items: [
        { icon: '🏛️', title: 'Multiple Clubhouses', desc: 'Grand community clubhouses featuring banquet halls, indoor games, and social lounges' },
        { icon: '🏊‍♂️', title: 'Swimming Pool', desc: 'Olympic-sized lap pool with temperature control provisions and dedicated kid splash deck' },
        { icon: '🌊', title: 'Waterfront / Riverfront Areas', desc: 'Picturesque Mula river promenade with viewing decks, seating alcoves, and nature breeze' },
        { icon: '🎭', title: 'Entertainment Spaces', desc: 'Open-air amphitheatre, party lawns, and event pavilions for township cultural gatherings' },
        { icon: '🌳', title: 'Landscaped & Nature Areas', desc: 'Acres of manicured botanical gardens, tree avenues, zen parks, and butterfly groves' }
      ]
    },
    {
      id: 'community-conveniences',
      title: 'Community & Conveniences',
      subtitle: 'On-campus school, high street retail, and business hubs',
      badge: 'SELF-SUSTAINING',
      icon: '🌳',
      items: [
        { icon: '🎓', title: 'Blue Ridge Public School', desc: 'Renowned ICSE affiliated school situated right within the township boundaries for children' },
        { icon: '🧒', title: 'Children\'s Play Areas', desc: 'Safe, rubberized outdoor play zones with adventure slides, swings, and climbing frames' },
        { icon: '🌺', title: 'Podium / Landscaped Gardens', desc: 'Elevated green podium decks free from vehicular traffic, ideal for elderly strolls' },
        { icon: '🛍️', title: 'Daily Retail & Shopping', desc: 'High-street arcade with supermarkets, organic grocers, pharmacies, salons, and cafes' },
        { icon: '💼', title: 'Business & SEZ Facilities', desc: 'Integrated commercial IT spaces and Special Economic Zone hosting global tech employers' }
      ]
    },
    {
      id: 'infrastructure-security',
      title: 'Infrastructure & Security',
      subtitle: '24×7 safety grid, power backup, wide roads, and green utilities',
      badge: 'SECURE GRID',
      icon: '🛡️',
      items: [
        { icon: '👮‍♂️', title: '24×7 Multi-Tier Security', desc: 'Trained security personnel patrolling round-the-clock across all township checkpoints' },
        { icon: '📹', title: 'CCTV / Controlled Access', desc: 'High-definition digital camera surveillance with RFID boom barriers at entrance gates' },
        { icon: '⚡', title: '100% Power Backup', desc: 'Heavy-duty DG generator grid powering all common facilities, lifts, and water supply' },
        { icon: '🛣️', title: 'Well-Planned Internal Roads', desc: 'Wide 4-lane internal spine avenues with dedicated pedestrian sidewalks and streetlights' },
        { icon: '♻️', title: 'Water & Wastewater (STP)', desc: 'State-of-the-art water purification and sewage treatment plant for eco-friendly living' }
      ]
    }
  ],

  proximity: [
    { label: 'Cognizant & Symbiosis Infotech Campus', distance: '300 m', time: '2 mins walk' },
    { label: 'Infosys Phase 1 & Wipro Circle', distance: '1.2 km', time: '4 mins' },
    { label: 'Blue Ridge Public School (Within Township)', distance: '100 m', time: '1 min walk' },
    { label: 'Upcoming Metro Line 3 Station (Phase 1)', distance: '800 m', time: '3 mins' },
    { label: 'Mahalunge-Hinjewadi Bridge', distance: '2.5 km', time: '5 mins' },
    { label: 'Wakad Junction & Phoenix Marketcity', distance: '4.0 km', time: '8 mins' },
    { label: 'Balewadi High Street / Baner', distance: '5.5 km', time: '10 mins' },
    { label: 'Mumbai-Pune Expressway Bypass', distance: '4.8 km', time: '8 mins' }
  ],

  faqs: [
    {
      q: 'What are the MahaRERA registration numbers for Paranjape Blue Ridge?',
      a: 'Paranjape Blue Ridge is registered under multiple MahaRERA numbers across its landmark phases: Primary RERA Numbers: P52100016328, P52100000054, and P52100027419. Newer Sub-Phases & Extensions: P52100055581 and P52100029952.'
    },
    {
      q: 'What are the details of the Golf Facing 3 BHK flat listed here?',
      a: 'This exclusive Golf-Facing residence offers ~1,110+ sq.ft of carpet area with an unhindered panoramic view of the 9-hole golf course. It is priced at ₹1.95 Cr (Negotiable) and features authentic wooden ceiling rafters, fitted modular kitchen with chimney, AC in master suite, luxury bathroom with glass shower cubicle, and an expansive sit-out balcony.'
    },
    {
      q: 'Is the price of ₹1.95 Cr negotiable?',
      a: 'Yes, the price of ₹1.95 Cr is negotiable for serious buyers. 24K Realtors directly facilitates transparent price negotiation with the seller.'
    },
    {
      q: 'What carpet areas are available in Paranjape Blue Ridge?',
      a: 'The township offers 1 BHK (~440 to 550 sq.ft carpet), 2 BHK (~800 to 860 sq.ft carpet), and 3 BHK & Larger (~1,110+ sq.ft carpet).'
    },
    {
      q: 'Is Blue Ridge Public School situated inside the township?',
      a: 'Yes! Blue Ridge Public School is a fully operational, esteemed ICSE-curriculum school located directly within the 138-acre Blue Ridge Township, allowing children to walk to school safely without crossing public roads.'
    },
    {
      q: 'Are the photos displayed on this page authentic?',
      a: 'Yes, 100% of the photos on this page are authentic photographs taken on-site inside the flat and from the balcony overlooking the golf and IT views.'
    },
    {
      q: 'How can I schedule an in-person site visit?',
      a: 'You can connect directly with our Hinjewadi Phase 1 specialist team via WhatsApp (+91 96730 00053) or telephone. We arrange guided private visits, key inspections, and document verifications.'
    }
  ]
};

export default function BlueRidgeProjectPage({ onBackHome }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0); // active room in gallery
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [zoomScale, setZoomScale] = useState(1);
  const [activeAmenityCategory, setActiveAmenityCategory] = useState('sports-fitness');
  const [selectedBhk, setSelectedBhk] = useState('3 BHK & Larger');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '', requirement: '3 BHK Golf Facing (₹1.95 Cr)', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Apply SEO metadata
  useSEO({
    title: 'Paranjape Blue Ridge Hinjewadi Phase 1 | Golf Facing 3 BHK ₹1.95 Cr | 24K Realtors',
    description: 'Paranjape Blue Ridge Hinjewadi Phase 1. 138-Acre Township with 9-Hole Golf Course. 3 BHK Golf Facing (~1,110+ sq.ft, ₹1.95 Cr Negotiable). MahaRERA: P52100016328, P52100000054, P52100027419, P52100055581, P52100029952.',
    keywords: 'Paranjape Blue Ridge, Blue Ridge Hinjewadi, Blue Ridge Hinjewadi Phase 1, Golf Facing flat Hinjewadi, 3 BHK Blue Ridge, Blue Ridge 1.95 Cr, Blue Ridge Public School, Paranjape Schemes Hinjewadi, RERA P52100016328, RERA P52100055581, 24K Realtors',
    canonical: 'https://real-estate-digital-marketing.vercel.app/blue-ridge-hinjewadi'
  });

  const activePhoto = BLUE_RIDGE_DATA.gallery[activeTab] || BLUE_RIDGE_DATA.gallery[0];

  // Open Lightbox
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setZoomScale(1);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setZoomScale(1);
    document.body.style.overflow = '';
  };

  const nextLightbox = (e) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % BLUE_RIDGE_DATA.gallery.length);
    setZoomScale(1);
  };

  const prevLightbox = (e) => {
    if (e) e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + BLUE_RIDGE_DATA.gallery.length) % BLUE_RIDGE_DATA.gallery.length);
    setZoomScale(1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isLightboxOpen]);

  const handleWhatsApp = (customText) => {
    const text = customText || BLUE_RIDGE_DATA.whatsappText;
    window.open(`https://wa.me/919673000053?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+919673000053';
  };

  const handleSubmitLead = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setIsContactModalOpen(false);
      setFormSubmitted(false);
      setLeadForm({ name: '', phone: '', email: '', requirement: '3 BHK Golf Facing (₹1.95 Cr)', message: '' });
      alert('Thank you! Your inquiry for Paranjape Blue Ridge has been received. Our senior Hinjewadi consultant will call you shortly.');
    }, 1200);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#040814', color: '#f8fafc', fontFamily: "'Montserrat', sans-serif" }}>
      {/* ── TOP NAV HEADER ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(4, 8, 20, 0.95)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(16, 185, 129, 0.25)',
        padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => onBackHome ? onBackHome() : navigate('/')}
            style={{
              background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#10B981', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
                Paranjape Blue Ridge
              </span>
              <span style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.4))',
                border: '1px solid #10B981', color: '#34D399', fontSize: '0.68rem', fontWeight: 800,
                padding: '2px 8px', borderRadius: '20px', letterSpacing: '0.06em'
              }}>
                ⛳ GOLF FACING
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
              Hinjewadi Phase 1, Pune · 138-Acre Integrated Township
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => handleWhatsApp()}
            style={{
              background: '#25D366', color: '#040814', border: 'none',
              padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700
            }}
          >
            <MessageSquare size={16} /> WhatsApp
          </button>
          <button
            onClick={handleCall}
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#fff', border: 'none',
              padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700
            }}
          >
            <Phone size={16} /> +91 96730 00053
          </button>
        </div>
      </header>

      {/* ── HERO BANNER SECTION ── */}
      <section style={{
        background: BLUE_RIDGE_DATA.heroBg,
        borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
        padding: '48px 24px 36px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', padding: '6px 14px', borderRadius: '30px', marginBottom: '16px' }}>
              <Sparkles size={14} color="#10B981" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34D399', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Flagship Project 8 · Direct Mandate
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.15, margin: '0 0 14px' }}>
              Paranjape <span style={{ color: '#10B981' }}>Blue Ridge</span>
            </h1>

            <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 20px', maxWidth: '620px' }}>
              {BLUE_RIDGE_DATA.heroSubline}
            </p>

            {/* Quick Pricing & Orientation Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '10px 16px' }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Featured Listing</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10B981' }}>₹1.95 Cr</span>
                <span style={{ fontSize: '0.78rem', color: '#e2e8f0', marginLeft: '6px', fontWeight: 600 }}>(Negotiable)</span>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px', padding: '10px 16px' }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Orientation</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>⛳ Golf Facing</span>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px', padding: '10px 16px' }}>
                <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Carpet Area</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>~1,110+ sq.ft</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
              <button
                onClick={() => setIsContactModalOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#fff', border: 'none',
                  padding: '14px 28px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)'
                }}
              >
                <CalendarIcon /> Schedule Private Site Inspection
              </button>
              <button
                onClick={() => handleWhatsApp('Hi 24K Realtors, please send the complete brochure and pricing sheet for Paranjape Blue Ridge.')}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#34D399',
                  padding: '14px 24px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px'
                }}
              >
                <ExternalLink size={18} /> Request PDF Brochure
              </button>
            </div>
          </div>

          {/* Featured Preview Card */}
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '20px', overflow: 'hidden', border: '2px solid rgba(16, 185, 129, 0.35)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)', background: '#0a101d', position: 'relative'
            }}>
              <img
                src="/blue_ridge_project_card.jpg"
                alt="Paranjape Blue Ridge Project Overview & Master Township"
                style={{ width: '100%', height: '390px', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
                onClick={() => openLightbox(0)}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(4,8,20,0.95) 0%, rgba(4,8,20,0.4) 60%, transparent 100%)',
                padding: '20px 24px'
              }}>
                <span style={{ background: '#10B981', color: '#040814', fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                  Township Overview Dossier
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: '8px 0 4px' }}>
                  Elevate Your Lifestyle at Paranjape Blue Ridge
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1' }}>
                  138-Acre Township · 9-Hole Golf Course · Hinjewadi Phase 1
                </p>
              </div>
              <button
                onClick={() => openLightbox(0)}
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  background: 'rgba(4,8,20,0.75)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.5)'
                }}
              >
                <Maximize2 size={15} /> Fullscreen &amp; Zoom
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── MULTI-MAHARERA VERIFICATION BANNER ── */}
      <section style={{ background: 'rgba(16, 185, 129, 0.04)', borderBottom: '1px solid rgba(16, 185, 129, 0.15)', padding: '24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <ShieldCheck size={22} color="#10B981" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Official MahaRERA Verification &amp; Project Title Disclosure
            </h2>
            <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
              100% VERIFIED
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Primary Registrations */}
            <div style={{ background: 'rgba(4, 8, 20, 0.8)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', padding: '16px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
                ⭐ Primary RERA Numbers (Main Township)
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {BLUE_RIDGE_DATA.primaryReraNumbers.map(r => (
                  <div key={r.number} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', borderBottom: '1px dashed rgba(255,255,255,0.08)', paddingBottom: '6px' }}>
                    <span style={{ fontWeight: 700, color: '#fff', fontFamily: 'monospace', fontSize: '0.9rem' }}>{r.number}</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{r.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Newer Sub-Phases & Extensions */}
            <div style={{ background: 'rgba(4, 8, 20, 0.8)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', padding: '16px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#34D399', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
                🏗️ Newer Sub-Phases &amp; Extensions
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {BLUE_RIDGE_DATA.newerReraNumbers.map(r => (
                  <div key={r.number} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', borderBottom: '1px dashed rgba(255,255,255,0.08)', paddingBottom: '6px' }}>
                    <span style={{ fontWeight: 700, color: '#fff', fontFamily: 'monospace', fontSize: '0.9rem' }}>{r.number}</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{r.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AUTHENTIC ROOM-BY-ROOM PHOTO SHOWCASE ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ color: '#10B981', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Verified Real Site Tour
          </span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, color: '#fff', margin: '6px 0 10px' }}>
            100% Authentic <span style={{ color: '#10B981' }}>Flat Photographs</span>
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '640px', margin: '0 auto', fontSize: '0.92rem' }}>
            Explore actual high-resolution interior and balcony photographs captured directly on-site at Paranjape Blue Ridge.
          </p>
        </div>

        {/* Room Tab Selectors */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
          {BLUE_RIDGE_DATA.gallery.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(idx)}
              style={{
                background: activeTab === idx ? '#10B981' : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === idx ? '#040814' : '#cbd5e1',
                border: activeTab === idx ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.1)',
                padding: '10px 18px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s'
              }}
            >
              <span>{item.icon}</span> {item.roomName}
            </button>
          ))}
        </div>

        {/* Main Display Area */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px',
          background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '20px', padding: '24px', alignItems: 'center'
        }}>
          {/* Active Photo */}
          <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer' }} onClick={() => openLightbox(activeTab)}>
            <img
              src={activePhoto.src}
              alt={activePhoto.title}
              style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block', borderRadius: '16px', transition: 'transform 0.3s ease' }}
              className="photo-hover-zoom"
            />
            <div style={{
              position: 'absolute', bottom: '12px', right: '12px',
              background: 'rgba(4,8,20,0.85)', backdropFilter: 'blur(8px)',
              color: '#34D399', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: '4px'
            }}>
              <ZoomIn size={14} /> Click to Enlarge
            </div>
            <div style={{
              position: 'absolute', top: '12px', left: '12px',
              background: '#10B981', color: '#040814', fontSize: '0.68rem', fontWeight: 800,
              padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase'
            }}>
              {activePhoto.tag}
            </div>
          </div>

          {/* Room Specs & Key Highlights */}
          <div>
            <span style={{ color: '#10B981', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              ROOM DOSSIER
            </span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '6px 0 10px' }}>
              {activePhoto.title}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 20px' }}>
              {activePhoto.subtitle}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
              {activePhoto.features.map((feat, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span>{feat.icon}</span>
                    <strong style={{ fontSize: '0.82rem', color: '#fff' }}>{feat.title}</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.4 }}>{feat.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => openLightbox(activeTab)}
                style={{
                  background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#34D399',
                  padding: '10px 18px', borderRadius: '8px', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <Maximize2 size={16} /> Open Interactive Lightbox
              </button>
              <button
                onClick={() => handleWhatsApp(`Hi 24K Realtors, I have a query about the ${activePhoto.roomName} in Paranjape Blue Ridge.`)}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff',
                  padding: '10px 18px', borderRadius: '8px', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <MessageSquare size={16} /> Inquire About this Room
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONFIGURATION & CARPET AREA BREAKDOWN ── */}
      <section style={{ background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '48px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ color: '#10B981', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Verified Floorplans
            </span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, color: '#fff', margin: '6px 0 10px' }}>
              Carpet Area Breakdown <span style={{ color: '#10B981' }}>by Configuration</span>
            </h2>
            <p style={{ color: '#94a3b8', maxWidth: '640px', margin: '0 auto', fontSize: '0.92rem' }}>
              Official carpet area ranges for 1 BHK, 2 BHK, and flagship Golf-Facing 3 BHK residences at Blue Ridge.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {BLUE_RIDGE_DATA.configurations.map((cfg) => {
              const isSelected = selectedBhk === cfg.bhk;
              return (
                <div
                  key={cfg.bhk}
                  style={{
                    background: cfg.isPopular ? 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.12) 0%, rgba(4, 8, 20, 0.95) 100%)' : 'rgba(4, 8, 20, 0.7)',
                    border: cfg.isPopular ? '2px solid #10B981' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', position: 'relative'
                  }}
                >
                  {cfg.isPopular && (
                    <div style={{
                      position: 'absolute', top: '-12px', right: '20px',
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      color: '#fff', fontSize: '0.68rem', fontWeight: 800, padding: '3px 12px', borderRadius: '20px',
                      letterSpacing: '0.06em', textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                    }}>
                      {cfg.badge}
                    </div>
                  )}

                  <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>{cfg.bhk}</h3>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ fontSize: '1.6rem', fontWeight: 800, color: cfg.isPopular ? '#10B981' : '#fff' }}>
                        {cfg.priceText}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{cfg.priceSub}</span>
                    </div>
                    <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#34D399', fontWeight: 700, marginTop: '6px' }}>
                      📐 Carpet: {cfg.carpet}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 20px', flex: '0 0 auto' }}>
                    {cfg.desc}
                  </p>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', marginBottom: '24px', flex: '1 0 auto' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '10px' }}>
                      Key Inclusions
                    </span>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {cfg.features.map((f, i) => (
                        <li key={i} style={{ fontSize: '0.8rem', color: '#e2e8f0', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <Check size={14} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      setLeadForm(prev => ({ ...prev, requirement: `${cfg.bhk} (${cfg.priceText})` }));
                      setIsContactModalOpen(true);
                    }}
                    style={{
                      background: cfg.isPopular ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'rgba(255, 255, 255, 0.08)',
                      color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px',
                      fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', width: '100%'
                    }}
                  >
                    Inquire for {cfg.bhk}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4-PILLAR AMENITIES GRID (EXACT USER SPECIFICATION) ── */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ color: '#10B981', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Township Infrastructure
          </span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, color: '#fff', margin: '6px 0 10px' }}>
            Comprehensive <span style={{ color: '#10B981' }}>Township Amenities</span>
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '640px', margin: '0 auto', fontSize: '0.92rem' }}>
            Curated across four specialized pillars: Sports &amp; Fitness, Recreation &amp; Relaxation, Community &amp; Conveniences, and Infrastructure &amp; Security.
          </p>
        </div>

        {/* Category Tab Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '28px' }}>
          {BLUE_RIDGE_DATA.amenityCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveAmenityCategory(cat.id)}
              style={{
                background: activeAmenityCategory === cat.id ? '#10B981' : 'rgba(255,255,255,0.04)',
                color: activeAmenityCategory === cat.id ? '#040814' : '#cbd5e1',
                border: activeAmenityCategory === cat.id ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.1)',
                padding: '12px 20px', borderRadius: '12px', fontSize: '0.88rem', fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
              }}
            >
              <span>{cat.icon}</span> {cat.title}
            </button>
          ))}
        </div>

        {/* Active Amenity Cards */}
        {(() => {
          const activeCat = BLUE_RIDGE_DATA.amenityCategories.find(c => c.id === activeAmenityCategory) || BLUE_RIDGE_DATA.amenityCategories[0];
          return (
            <div>
              <div style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', padding: '14px 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ margin: '0 0 2px', fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{activeCat.icon} {activeCat.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>{activeCat.subtitle}</p>
                </div>
                <span style={{ background: '#10B981', color: '#040814', fontSize: '0.68rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
                  {activeCat.badge}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                {activeCat.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px', padding: '18px', transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '1.6rem', marginBottom: '10px' }}>{item.icon}</div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>{item.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.45 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </section>

      {/* ── TRANSIT & CONNECTIVITY MATRIX ── */}
      <section style={{ background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '48px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ color: '#10B981', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Micro-Market Advantage
            </span>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, color: '#fff', margin: '6px 0 10px' }}>
              Prime Hinjewadi Phase 1 <span style={{ color: '#10B981' }}>Transit Matrix</span>
            </h2>
            <p style={{ color: '#94a3b8', maxWidth: '640px', margin: '0 auto', fontSize: '0.92rem' }}>
              Situated at the core of Hinjewadi Phase 1 with quick access to IT giants, international schools, metro line 3, and expressway.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {BLUE_RIDGE_DATA.proximity.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(4, 8, 20, 0.8)', border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', display: 'block' }}>{item.label}</span>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>📍 {item.distance}</span>
                </div>
                <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: '6px' }}>
                  ⏱️ {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FREQUENTLY ASKED QUESTIONS (FAQS) ── */}
      <section style={{ maxWidth: '960px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ color: '#10B981', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Transparency &amp; Diligence
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 800, color: '#fff', margin: '6px 0 10px' }}>
            Frequently Asked <span style={{ color: '#10B981' }}>Questions</span>
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {BLUE_RIDGE_DATA.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px', overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  style={{
                    width: '100%', padding: '16px 20px', background: 'transparent', border: 'none',
                    color: '#fff', textAlign: 'left', fontSize: '0.92rem', fontWeight: 700,
                    cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} color="#10B981" /> : <ChevronDown size={18} color="#94a3b8" />}
                </button>
                {isOpen && (
                  <div style={{ padding: '0 20px 16px', fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FOOTER CALL TO ACTION ── */}
      <section style={{
        background: 'linear-gradient(180deg, #040814 0%, #031c13 100%)',
        borderTop: '1px solid rgba(16, 185, 129, 0.25)',
        padding: '54px 24px', textAlign: 'center'
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>
            Book Your Private Site Tour at <span style={{ color: '#10B981' }}>Blue Ridge</span>
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: '0 0 28px', lineHeight: 1.6 }}>
            Connect with 24K Realtors for an exclusive walk-through of the Golf-Facing 3 BHK flat, legal verification documents, and price closing.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleWhatsApp()}
              style={{
                background: '#25D366', color: '#040814', border: 'none',
                padding: '14px 28px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 800,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(37, 211, 102, 0.3)'
              }}
            >
              <MessageSquare size={18} /> Connect on WhatsApp
            </button>
            <button
              onClick={handleCall}
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#fff', border: 'none',
                padding: '14px 28px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 800,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
              }}
            >
              <Phone size={18} /> Call +91 96730 00053
            </button>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE FULLSCREEN LIGHTBOX MODAL ── */}
      {isLightboxOpen && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(2, 6, 18, 0.96)', backdropFilter: 'blur(20px)',
            display: 'flex', flexDirection: 'column'
          }}
        >
          {/* Lightbox Header */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(4,8,20,0.8)'
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Paranjape Blue Ridge · Image {lightboxIndex + 1} of {BLUE_RIDGE_DATA.gallery.length}
              </span>
              <h4 style={{ margin: '2px 0 0', fontSize: '1rem', color: '#fff', fontWeight: 700 }}>
                {BLUE_RIDGE_DATA.gallery[lightboxIndex].title}
              </h4>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setZoomScale(prev => Math.min(prev + 0.3, 3))}
                style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                title="Zoom In"
              >
                <ZoomIn size={18} />
              </button>
              <button
                onClick={() => setZoomScale(prev => Math.max(prev - 0.3, 1))}
                style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                title="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>
              <button
                onClick={() => setZoomScale(1)}
                style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', padding: '8px', borderRadius: '6px', cursor: 'pointer' }}
                title="Reset Zoom"
              >
                <RotateCcw size={18} />
              </button>
              <button
                onClick={closeLightbox}
                style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Lightbox Center Image with Nav Buttons */}
          <div
            style={{
              flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px', overflow: 'hidden'
            }}
          >
            <button
              onClick={prevLightbox}
              style={{
                position: 'absolute', left: '20px', zIndex: 10,
                background: 'rgba(4,8,20,0.7)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
                width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <ChevronLeft size={24} />
            </button>

            <img
              src={BLUE_RIDGE_DATA.gallery[lightboxIndex].src}
              alt={BLUE_RIDGE_DATA.gallery[lightboxIndex].title}
              onClick={(e) => {
                e.stopPropagation();
                setZoomScale(prev => prev > 1 ? 1 : 2);
              }}
              style={{
                maxWidth: '90%', maxHeight: '82vh', objectFit: 'contain', borderRadius: '8px',
                transform: `scale(${zoomScale})`, transition: 'transform 0.2s ease', cursor: zoomScale > 1 ? 'zoom-out' : 'zoom-in'
              }}
            />

            <button
              onClick={nextLightbox}
              style={{
                position: 'absolute', right: '20px', zIndex: 10,
                background: 'rgba(4,8,20,0.7)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
                width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Lightbox Thumbnails Strip */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: '12px 24px', background: 'rgba(4,8,20,0.9)', borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', gap: '10px', justifyContent: 'center', overflowX: 'auto'
            }}
          >
            {BLUE_RIDGE_DATA.gallery.map((g, idx) => (
              <img
                key={g.id}
                src={g.src}
                alt={g.roomName}
                onClick={() => {
                  setLightboxIndex(idx);
                  setZoomScale(1);
                }}
                style={{
                  width: '64px', height: '44px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer',
                  border: lightboxIndex === idx ? '2px solid #10B981' : '1px solid rgba(255,255,255,0.2)',
                  opacity: lightboxIndex === idx ? 1 : 0.6, transition: 'all 0.2s'
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── SCHEDULE SITE VISIT LEAD MODAL ── */}
      {isContactModalOpen && (
        <div
          onClick={() => setIsContactModalOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 110,
            background: 'rgba(2, 6, 18, 0.85)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#071224', border: '1px solid #10B981', borderRadius: '16px',
              padding: '32px', maxWidth: '480px', width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.8)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 800, textTransform: 'uppercase' }}>
                  24K Realtors Advisory Desk
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '1.25rem', color: '#fff', fontWeight: 800 }}>
                  Schedule Site Inspection
                </h3>
              </div>
              <button
                onClick={() => setIsContactModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitLead} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Deshmukh"
                  value={leadForm.name}
                  onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={leadForm.phone}
                  onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Configuration</label>
                <select
                  value={leadForm.requirement}
                  onChange={e => setLeadForm({ ...leadForm, requirement: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#0a172e', color: '#fff', outline: 'none' }}
                >
                  <option value="3 BHK Golf Facing (₹1.95 Cr)">3 BHK Golf Facing (~1,110+ sq.ft · ₹1.95 Cr Negotiable)</option>
                  <option value="2 BHK (~800 to 860 sq.ft)">2 BHK (~800 to 860 sq.ft · Price on Request)</option>
                  <option value="1 BHK (~440 to 550 sq.ft)">1 BHK (~440 to 550 sq.ft · Price on Request)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px', fontWeight: 600 }}>Preferred Inspection Day</label>
                <input
                  type="text"
                  placeholder="e.g. This Saturday 11 AM"
                  value={leadForm.message}
                  onChange={e => setLeadForm({ ...leadForm, message: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={formSubmitted}
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#fff',
                  border: 'none', padding: '14px', borderRadius: '8px', fontSize: '0.92rem', fontWeight: 800,
                  cursor: 'pointer', marginTop: '8px', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)'
                }}
              >
                {formSubmitted ? 'Confirming Site Visit...' : 'Confirm Site Inspection Call'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Icon helper
function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}
