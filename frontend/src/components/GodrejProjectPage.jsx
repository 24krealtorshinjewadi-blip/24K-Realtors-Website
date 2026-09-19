/**
 * GodrejProjectPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Premium SEO landing page for Godrej 24 and Godrej Elements, Hinjewadi Phase 1
 * Rendered at separate routes:
 *   /godrej-24-hinjewadi          /godrej-elements-hinjewadi
 *   /godrej-24-2-bhk              /godrej-elements-2-bhk
 *   /godrej-24-3-bhk              /godrej-elements-3-bhk
 *
 * ⚠️  DATA INTEGRITY: Godrej 24 and Godrej Elements are two completely
 *     separate projects. Their data is NEVER mixed in this component.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, ShieldCheck, Phone, MessageSquare, ArrowLeft,
  CheckCircle2, Star, Clock, Zap, Car, Dumbbell, Trees,
  Wifi, Lock, Coffee, Users, Home, IndianRupee, ExternalLink,
  ChevronDown, ChevronUp, Building2, Award, X, ChevronLeft, ChevronRight, Maximize2
} from 'lucide-react';
import { useSEO } from '../services/seoService';
import CompanyLogo from './CompanyLogo';

/* ════════════════════════════════════════════════════════════════════════════
   PROJECT DATA — STRICTLY SEPARATE. DO NOT MIX.
════════════════════════════════════════════════════════════════════════════ */

const GODREJ_24 = {
  key: 'godrej24',
  name: 'Godrej 24',
  fullName: 'Godrej 24 — Hinjewadi Phase 1',
  developer: 'Godrej Properties',
  rera: 'P52100018596',
  location: 'Hinjewadi Phase 1, Rajiv Gandhi Infotech Park, Pune — 411057',
  status: 'Ready to Move',
  tagline: "India's First 24/7 Lifestyle Residences",
  heroSubline: "Round-the-clock amenities crafted for Pune's IT professionals",
  accentColor: '#1a6b3c',
  accentGradient: 'linear-gradient(135deg, #0f4029 0%, #1a6b3c 50%, #2d9e5f 100%)',
  heroBg: 'linear-gradient(160deg, #040f08 0%, #0a2b18 40%, #0f4029 100%)',
  showcaseImage: '/godrej_24_project_card.jpg',
  gallery: [
    {
      id: 1,
      tag: 'Project Overview',
      icon: '🏢',
      roomName: 'Grand Courtyard & Towers',
      title: 'Godrej 24 — A Brighter Tomorrow Begins Here',
      subtitle: 'Grand central courtyard, Olympic-style swimming pool, sports arena and high-rise towers in Hinjewadi Phase 1.',
      src: '/godrej_24_project_card.jpg',
      features: [
        { icon: '🏊', title: 'Swimming Pool', desc: 'Resort-style central swimming pool with sun deck' },
        { icon: '🏋️', title: 'Gymnasium & Sports', desc: '24x7 functional gym and multisport floodlit arena' },
        { icon: '🌳', title: 'Landscaped Gardens', desc: 'Sprawling podium greenery and serene walking trails' },
        { icon: '🛡️', title: '24x7 Security Grid', desc: 'Multi-tier CCTV surveillance and gated perimeter security' }
      ]
    },
    {
      id: 2,
      tag: 'Living Area',
      icon: '🛋️',
      roomName: 'Spacious Living Area',
      title: 'Spacious Living Area — 2 BHK Residence',
      subtitle: 'Bright interiors, open layout and a balcony that brings the outdoors in.',
      src: '/godrej_living_room_banner.jpg',
      features: [
        { icon: '🛋️', title: 'Spacious Layout', desc: 'Maximized usable living space with ergonomic planning' },
        { icon: '☀️', title: 'Natural Light & Ventilation', desc: 'Large sliding glass apertures for fresh cross breeze' },
        { icon: '🌅', title: 'Balcony with Open View', desc: 'Uninterrupted panoramic nature & Hinjewadi skyline views' },
        { icon: '🏢', title: 'Ideal for Modern Living', desc: 'Crafted for tech professionals & contemporary families' }
      ]
    },
    {
      id: 3,
      tag: 'Master Bedroom',
      icon: '🛏️',
      roomName: 'Master Bedroom',
      title: 'Master Bedroom — Peaceful Space with Open Views',
      subtitle: 'A peaceful space with open views for a better tomorrow.',
      src: '/godrej_24_master_bedroom.jpg',
      features: [
        { icon: '🛏️', title: 'Spacious Layout', desc: 'Generously proportioned bedroom with ample wardrobe niche' },
        { icon: '☀️', title: 'Natural Light & Ventilation', desc: 'Large floor-to-ceiling glass sliding balcony aperture' },
        { icon: '🚪', title: 'Private Balcony Access', desc: 'Step out directly to your personal attached viewing balcony' },
        { icon: '💨', title: 'With Ceiling Fan & Lighting', desc: 'Fitted premium electrical points, fan & ambient fixtures' }
      ]
    },
    {
      id: 4,
      tag: 'Modern Bathroom',
      icon: '🚿',
      roomName: 'Modern Bathroom',
      title: 'Modern Bathroom — Clean, Elegant & Functional',
      subtitle: 'Clean. Elegant. Functional. Designed for your everyday comfort.',
      src: '/godrej_24_modern_bathroom.jpg',
      features: [
        { icon: '🚿', title: 'Modern Fittings', desc: 'Branded CP fixtures & luxury rain shower system' },
        { icon: '🚽', title: 'Spacious Layout', desc: 'Ergonomically zoned wet and dry bathing areas' },
        { icon: '💨', title: 'Well Ventilated', desc: 'Dedicated frosted exhaust ventilation window' },
        { icon: '✨', title: 'Premium Sanitaryware', desc: 'Designer wall-hung basin, granite counter & concealed flush' }
      ]
    },
    {
      id: 5,
      tag: 'Modular Kitchen',
      icon: '🍳',
      roomName: 'Modular Kitchen',
      title: 'Modular Kitchen — Practical Design & Ample Storage',
      subtitle: 'Modern design, practical layout and ample storage for your everyday convenience.',
      src: '/godrej_24_modular_kitchen.jpg',
      features: [
        { icon: '🍳', title: 'Modular Kitchen', desc: 'Factory-finished sleek cabinets with smooth hydraulic drawers' },
        { icon: '🪟', title: 'Spacious Countertop', desc: 'Polished granite cooking platform with stainless steel sink' },
        { icon: '🗄️', title: 'Ample Storage', desc: 'Upper and lower cabinetry with dedicated utility provisions' },
        { icon: '💨', title: 'Well Ventilated', desc: 'Wide utility window providing fresh air & natural daylight' }
      ]
    },
    {
      id: 6,
      tag: 'Private Balcony',
      icon: '🌇',
      roomName: 'Private Balcony',
      title: 'Private Balcony — Sunset & Open Nature Views',
      subtitle: 'Breathe in freshness, with open views for a better tomorrow.',
      src: '/godrej_24_private_balcony.jpg',
      features: [
        { icon: '🌇', title: 'Open City Views', desc: 'Unobstructed scenic view of Hinjewadi greenery & hills' },
        { icon: '🌿', title: 'Spacious Layout', desc: 'Deep sit-out balcony accommodating lounge seating & planters' },
        { icon: '☀️', title: 'Abundant Natural Light', desc: 'Golden hour sunset exposure with all-day fresh breeze' },
        { icon: '☕', title: 'Perfect Relaxation Spot', desc: 'Ideal coffee and evening unwind sanctuary after IT shifts' }
      ]
    }
  ],
  uniqueFeatures: [
    '24×7 Functional Gymnasium',
    '24×7 Concierge Desk',
    '24×7 Convenience Store',
    '24×7 Creche & Day Care',
  ],
  configurations: [
    { bhk: '2 BHK', carpet: '725 sq.ft', highlight: false },
    { bhk: '2 BHK', carpet: '820 sq.ft', highlight: false },
    { bhk: '2 BHK', carpet: '940 sq.ft', highlight: true },
    { bhk: '3 BHK', carpet: '1167 sq.ft', highlight: false },
    { bhk: '3 BHK', carpet: '1488 sq.ft', highlight: true },
  ],
  amenities: [
    { icon: <Dumbbell size={18} />, label: '24×7 Gymnasium' },
    { icon: <Coffee size={18} />, label: '24×7 Concierge' },
    { icon: <Home size={18} />, label: '24×7 Convenience Store' },
    { icon: <Users size={18} />, label: '24×7 Creche' },
    { icon: <Trees size={18} />, label: 'Swimming Pool' },
    { icon: <Star size={18} />, label: 'Multipurpose Sports Arena' },
    { icon: <Trees size={18} />, label: 'Landscaped Podium Gardens' },
    { icon: <Zap size={18} />, label: 'EV Charging Stations' },
    { icon: <Lock size={18} />, label: 'Multi-Tier Security + CCTV' },
    { icon: <Car size={18} />, label: 'Covered Parking' },
    { icon: <Trees size={18} />, label: 'Jogging Track' },
    { icon: <Users size={18} />, label: 'Children Play Area' },
  ],
  nearbyIt: [
    { name: 'Infosys Phase 1', distance: '~1.0 km', time: '3 mins' },
    { name: 'Wipro Circle', distance: '~1.2 km', time: '4 mins' },
    { name: 'Cognizant', distance: '~1.5 km', time: '5 mins' },
    { name: 'TCS Sahyadri Park', distance: '~2.0 km', time: '6 mins' },
  ],
  nearbyLifestyle: [
    { label: 'Mercedes-Benz Intl. School', value: '2.0 km' },
    { label: 'Alard Public School', value: '1.2 km' },
    { label: 'Ruby Hall Clinic', value: '2.5 km' },
    { label: 'Grand Highstreet', value: '1.5 km' },
    { label: 'Hinjewadi Metro Stn.', value: '~1.0 km (under construction)' },
  ],
  faqs: [
    {
      q: 'What makes Godrej 24 unique in Hinjewadi?',
      a: "Godrej 24 is designed exclusively for IT shift workers — it is India's first residential project with all key lifestyle amenities (gym, creche, concierge, store) operational 24 hours a day, 7 days a week."
    },
    {
      q: 'What carpet areas are available in Godrej 24?',
      a: '2 BHK: 725 sq.ft, 820 sq.ft, and 940 sq.ft. 3 BHK: 1167 sq.ft and 1488 sq.ft. These are RERA-defined carpet areas as per MahaRERA registration P52100018596.'
    },
    {
      q: 'Is Godrej 24 ready to move in?',
      a: 'Yes. Godrej 24 is a ready-to-move project with Occupancy Certificate obtained.'
    },
    {
      q: 'Is Godrej 24 and Godrej Elements the same project?',
      a: 'No. Godrej 24 and Godrej Elements are two completely separate residential projects by Godrej Properties in Hinjewadi Phase 1. They have different tower configurations, amenities, floor plans, and MahaRERA registration numbers.'
    },
    {
      q: 'What is the RERA number for Godrej 24?',
      a: 'MahaRERA Registration Number: P52100018596.'
    },
    {
      q: 'How do I get the current price for Godrej 24?',
      a: 'Contact 24K Realtors directly on +91 96730 00053 or WhatsApp for the latest resale and rental pricing. Prices are updated regularly based on live inventory.'
    },
  ],
  whatsappText: 'Hi 24K Realtors, I am interested in Godrej 24 Hinjewadi Phase 1. Please share current pricing and available units.',
  investmentScore: 93,
  rentalYield: '4.9%',
};

const GODREJ_ELEMENTS = {
  key: 'elements',
  name: 'Godrej Elements',
  fullName: 'Godrej Elements — Hinjewadi Phase 1',
  developer: 'Godrej Properties',
  rera: 'P52100016626',
  location: 'Hinjewadi Phase 1, Rajiv Gandhi Infotech Park, Pune — 411057',
  status: 'Ready to Move',
  tagline: 'Smart Homes. 21-Point Safety. Resort Amenities.',
  heroSubline: 'Technology-integrated living with infinity rooftop pool in Hinjewadi',
  accentColor: '#1a3a6b',
  accentGradient: 'linear-gradient(135deg, #0a1f40 0%, #1a3a6b 50%, #2d5e9e 100%)',
  heroBg: 'linear-gradient(160deg, #040a14 0%, #0a1f40 40%, #0f2d6b 100%)',
  uniqueFeatures: [
    'Home Automation System',
    '21-Point Integrated Safety Grid',
    'RFID Vehicle Access Control',
    'Video Door Phone Entry',
  ],
  configurations: [
    { bhk: '2 BHK', carpet: '725 sq.ft', highlight: false },
    { bhk: '2 BHK', carpet: '820 sq.ft', highlight: false },
    { bhk: '2 BHK', carpet: '940 sq.ft', highlight: true },
    { bhk: '3 BHK', carpet: '1167 sq.ft', highlight: false },
    { bhk: '3 BHK', carpet: '1488 sq.ft', highlight: true },
  ],
  amenities: [
    { icon: <Wifi size={18} />, label: 'Home Automation Grid' },
    { icon: <Lock size={18} />, label: '21-Point Safety System' },
    { icon: <Trees size={18} />, label: 'Infinity Rooftop Pool' },
    { icon: <Dumbbell size={18} />, label: 'Fully Equipped Fitness Studio' },
    { icon: <Star size={18} />, label: 'Yoga & Meditation Deck' },
    { icon: <Users size={18} />, label: 'Multipurpose Community Hall' },
    { icon: <Zap size={18} />, label: 'Dedicated EV Charging Bays' },
    { icon: <Lock size={18} />, label: '24/7 Multi-Tier Security' },
    { icon: <Trees size={18} />, label: 'Landscaped Zen Gardens' },
    { icon: <Trees size={18} />, label: 'Jogging Track' },
    { icon: <Users size={18} />, label: 'Children Play Zone' },
    { icon: <Car size={18} />, label: 'Visitor Parking' },
  ],
  nearbyIt: [
    { name: 'Infosys Phase 1', distance: '~1.2 km', time: '3 mins' },
    { name: 'Cognizant', distance: '~1.5 km', time: '5 mins' },
    { name: 'TCS Sahyadri Park', distance: '~2.0 km', time: '6 mins' },
    { name: 'Wipro Circle', distance: '~1.8 km', time: '5 mins' },
  ],
  nearbyLifestyle: [
    { label: 'Mercedes-Benz Intl. School', value: '1.5 km' },
    { label: 'Blue Ridge Public School', value: '2.0 km' },
    { label: 'Ruby Hall Clinic', value: '2.2 km' },
    { label: 'Grand Highstreet', value: '1.5 km' },
    { label: 'Hinjewadi Metro Stn.', value: '~800m (under construction)' },
  ],
  faqs: [
    {
      q: 'What smart home features does Godrej Elements offer?',
      a: 'Godrej Elements features a full home automation grid and 21-point integrated safety system — including RFID vehicle access tags, video door phones, intercom, fire detection, and a comprehensive CCTV surveillance network.'
    },
    {
      q: 'What carpet areas are available in Godrej Elements?',
      a: '2 BHK: 725 sq.ft, 820 sq.ft, and 940 sq.ft. 3 BHK: 1167 sq.ft and 1488 sq.ft. These are RERA-defined carpet areas per MahaRERA registration P52100016626.'
    },
    {
      q: 'Is Godrej Elements ready to move in?',
      a: 'Yes. Godrej Elements is a ready-to-move project with Occupancy Certificate obtained.'
    },
    {
      q: 'Is Godrej Elements and Godrej 24 the same project?',
      a: 'No. Godrej Elements and Godrej 24 are two completely separate residential projects by Godrej Properties in Hinjewadi Phase 1. They have different tower configurations, amenities, floor plans, and MahaRERA registration numbers.'
    },
    {
      q: 'What is the RERA number for Godrej Elements?',
      a: 'MahaRERA Registration Number: P52100016626.'
    },
    {
      q: 'How do I get the current price for Godrej Elements?',
      a: 'Contact 24K Realtors directly on +91 96730 00053 or WhatsApp for the latest resale and rental pricing. We maintain live inventory for both Godrej Elements and Godrej 24.'
    },
  ],
  whatsappText: 'Hi 24K Realtors, I am interested in Godrej Elements Hinjewadi Phase 1. Please share current pricing and available units.',
  investmentScore: 92,
  rentalYield: '4.7%',
};

/* ════════════════════════════════════════════════════════════════════════════
   SEO CONFIGS
════════════════════════════════════════════════════════════════════════════ */

const BASE = 'https://real-estate-digital-marketing.vercel.app';

function buildGodrejSEO(project, bhkFilter) {
  const p = project === 'godrej24' ? GODREJ_24 : GODREJ_ELEMENTS;
  const bhkLabel = bhkFilter ? ` ${bhkFilter}` : '';
  const areas = bhkFilter === '2 BHK'
    ? '725, 820 & 940 sq.ft'
    : bhkFilter === '3 BHK'
    ? '1167 & 1488 sq.ft'
    : '725–1488 sq.ft';
  const slug = project === 'godrej24'
    ? (bhkFilter === '2 BHK' ? '/godrej-24-2-bhk' : bhkFilter === '3 BHK' ? '/godrej-24-3-bhk' : '/godrej-24-hinjewadi')
    : (bhkFilter === '2 BHK' ? '/godrej-elements-2-bhk' : bhkFilter === '3 BHK' ? '/godrej-elements-3-bhk' : '/godrej-elements-hinjewadi');

  const title = `${p.name}${bhkLabel} Hinjewadi Phase 1 | Carpet Area ${areas} | 24K Realtors`;
  const desc = `Verified${bhkLabel} listings in ${p.name}, Hinjewadi Phase 1 by Godrej Properties. Carpet area: ${areas}. Ready to move. MahaRERA: ${p.rera}. Contact 24K Realtors for pricing.`;

  return {
    title,
    description: desc.substring(0, 160),
    url: slug,
    type: 'article',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['ApartmentComplex', 'RealEstateListing'],
          '@id': `${BASE}${slug}`,
          name: `${p.name} Hinjewadi Phase 1`,
          description: desc,
          url: `${BASE}${slug}`,
          address: {
            '@type': 'PostalAddress',
            streetAddress: `${p.name}, Hinjewadi Phase 1, Rajiv Gandhi Infotech Park`,
            addressLocality: 'Hinjewadi',
            addressRegion: 'Maharashtra',
            postalCode: '411057',
            addressCountry: 'IN',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: project === 'godrej24' ? 18.5960 : 18.5955,
            longitude: project === 'godrej24' ? 73.7395 : 73.7380,
          },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            seller: {
              '@type': 'RealEstateAgent',
              name: '24K Realtors Pune',
              telephone: '+919673000053',
              url: BASE,
            },
          },
          amenityFeature: p.amenities.map(a => ({
            '@type': 'LocationFeatureSpecification',
            name: a.label,
            value: true,
          })),
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.7',
            bestRating: '5',
            worstRating: '1',
            ratingCount: '38',
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` },
            { '@type': 'ListItem', position: 2, name: 'Properties Hinjewadi', item: `${BASE}/societies` },
            { '@type': 'ListItem', position: 3, name: p.name, item: `${BASE}${slug}` },
          ],
        },
        {
          '@type': 'FAQPage',
          mainEntity: p.faqs.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
      ],
    },
  };
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════════════════ */

export default function GodrejProjectPage({ project = 'godrej24', bhkFilter = null }) {
  const navigate = useNavigate();
  const p = project === 'godrej24' ? GODREJ_24 : GODREJ_ELEMENTS;
  const [openFaq, setOpenFaq] = useState(null);
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const heroRef = useRef(null);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape') setLightboxIdx(null);
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

  // Inject SEO
  useSEO(buildGodrejSEO(project, bhkFilter));

  // Filter configurations based on bhkFilter prop
  const configs = bhkFilter
    ? p.configurations.filter(c => c.bhk === bhkFilter)
    : p.configurations;

  const handleWhatsApp = () => {
    const text = bhkFilter
      ? `Hi 24K Realtors, I am interested in ${p.name} ${bhkFilter} in Hinjewadi Phase 1. Please share current pricing and available units.`
      : p.whatsappText;
    window.open(`https://wa.me/919673000053?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+919673000053';
  };

  const handleSiteVisit = () => {
    const text = `Hi 24K Realtors, I would like to schedule a private site visit for ${p.name}${bhkFilter ? ` ${bhkFilter}` : ''} in Hinjewadi Phase 1.`;
    window.open(`https://wa.me/919673000053?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#040814', color: '#fff', fontFamily: "'Inter', 'Segoe UI', sans-serif", overflowX: 'hidden' }}>
      {/* ── Animated BG blobs ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60vw', height: '60vw', borderRadius: '50%', background: project === 'godrej24' ? 'radial-gradient(circle, rgba(26,107,60,0.12) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(26,58,107,0.12) 0%, transparent 70%)', filter: 'blur(40px)', animation: 'blobFloat 12s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50vw', height: '50vw', borderRadius: '50%', background: project === 'godrej24' ? 'radial-gradient(circle, rgba(45,158,95,0.08) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(45,94,158,0.08) 0%, transparent 70%)', filter: 'blur(60px)', animation: 'blobFloat 16s ease-in-out infinite reverse' }} />
        <style>{`
          @keyframes blobFloat { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(3%,3%) scale(1.04); } }
          @keyframes fadeInUp { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
          @keyframes shimmerGold { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
        `}</style>
      </div>

      {/* ── NAVBAR ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(4,8,20,0.92)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${p.accentColor}30`, padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <CompanyLogo variant="compact" />
          <span style={{ fontSize: '0.78rem', fontFamily: "'Cinzel', serif", color: '#D4AF37', letterSpacing: '0.06em', fontWeight: 700, textTransform: 'uppercase' }}>⚜️ 24K Realtors</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/societies')} style={{ background: 'transparent', border: `1px solid ${p.accentColor}60`, color: '#94A3B8', padding: '7px 16px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={14} /> All Properties
          </button>
          <button onClick={handleWhatsApp} style={{ background: p.accentGradient, border: 'none', color: '#fff', padding: '7px 18px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
            Get Price
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ position: 'relative', zIndex: 1, padding: '80px 24px 60px', maxWidth: '1100px', margin: '0 auto', animation: 'fadeInUp 0.7s ease both' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#64748B', marginBottom: '28px' }}>
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#94A3B8' }}>Home</span>
          <span>›</span>
          <span onClick={() => navigate('/societies')} style={{ cursor: 'pointer', color: '#94A3B8' }}>Properties</span>
          <span>›</span>
          <span style={{ color: '#D4AF37' }}>{p.name}</span>
        </div>

        {/* Project Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: `${p.accentColor}20`, border: `1px solid ${p.accentColor}40`, borderRadius: '20px', padding: '6px 16px', marginBottom: '24px' }}>
          <ShieldCheck size={14} style={{ color: p.accentColor }} />
          <span style={{ fontSize: '0.72rem', color: '#A3E4C0', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>MahaRERA: {p.rera} · Verified Listing</span>
        </div>

        {/* Hero Title */}
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 800, lineHeight: 1.15, marginBottom: '16px', background: 'linear-gradient(135deg, #FFFFFF 0%, #F3E5AB 50%, #D4AF37 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {p.fullName}
          {bhkFilter && <span style={{ display: 'block', fontSize: 'clamp(1.3rem, 3vw, 2rem)', marginTop: '8px', opacity: 0.9 }}>— {bhkFilter} Apartments</span>}
        </h1>

        <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: '#94A3B8', fontWeight: 400, marginBottom: '12px', lineHeight: 1.6 }}>{p.tagline}</p>
        <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '32px' }}>{p.heroSubline}</p>

        {/* Key Stats Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '40px' }}>
          {[
            { icon: <MapPin size={14} />, label: 'Location', value: 'Hinjewadi Phase 1, Pune' },
            { icon: <Building2 size={14} />, label: 'Developer', value: 'Godrej Properties' },
            { icon: <Clock size={14} />, label: 'Status', value: 'Ready to Move' },
            { icon: <Award size={14} />, label: 'Investment Score', value: `${p.investmentScore}/100` },
            { icon: <IndianRupee size={14} />, label: 'Rental Yield', value: p.rentalYield },
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
      <section style={{ position: 'relative', zIndex: 1, background: `${p.accentColor}15`, borderTop: `1px solid ${p.accentColor}30`, borderBottom: `1px solid ${p.accentColor}30`, padding: '24px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: '8px' }}>Project Highlights →</span>
          {p.uniqueFeatures.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${p.accentColor}40`, borderRadius: '20px', padding: '8px 18px' }}>
              <CheckCircle2 size={14} style={{ color: p.accentColor === '#1a6b3c' ? '#4ade80' : '#60a5fa', flexShrink: 0 }} />
              <span style={{ fontSize: '0.82rem', color: '#CBD5E1', fontWeight: 500 }}>{f}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── VERIFIED INTERIOR & SPACES GALLERY (WITH LIGHTBOX) ── */}
      {p.gallery && p.gallery.length > 0 && (
        <section style={{ position: 'relative', zIndex: 1, padding: '50px 24px 20px', maxWidth: '1100px', margin: '0 auto' }}>
          {/* Section Heading */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '20px', padding: '5px 16px', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.7rem', color: '#F3E5AB', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                ✨ Verified Visual Tour · {p.gallery.length} Official Photos
              </span>
            </div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 700, color: '#F3E5AB', marginBottom: '8px' }}>
              Explore Verified Apartment Interiors
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem', maxWidth: '560px', margin: '0 auto' }}>
              Click any photo to open full-screen view. Authentic 24K Realtors marketing creatives for {p.name}.
            </p>
          </div>

          {/* Room Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
            {p.gallery.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveGalleryIdx(idx)}
                style={{
                  background: activeGalleryIdx === idx ? 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)' : 'rgba(255,255,255,0.04)',
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
                  boxShadow: activeGalleryIdx === idx ? '0 4px 16px rgba(212,175,55,0.3)' : 'none'
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
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', transition: 'transform 0.4s ease' }}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginTop: '20px' }}>
            {p.gallery.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setActiveGalleryIdx(idx)}
                style={{
                  background: activeGalleryIdx === idx ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
                  border: activeGalleryIdx === idx ? '2px solid #D4AF37' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: activeGalleryIdx === idx ? '0 4px 20px rgba(212,175,55,0.2)' : 'none',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ height: '95px', background: '#020610', overflow: 'hidden', position: 'relative' }}>
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

      {/* ── CONFIGURATION CARDS ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '70px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 700, color: '#F3E5AB', marginBottom: '12px' }}>
            {bhkFilter ? `${bhkFilter} Carpet Area Details` : 'Apartment Configurations'}
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto' }}>RERA-verified carpet areas for {p.name}. MahaRERA: {p.rera}.</p>
        </div>

        {/* BHK Tab Filter */}
        {!bhkFilter && (
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '36px', flexWrap: 'wrap' }}>
            {['2 BHK', '3 BHK'].map(bhk => {
              const routeSuffix = bhk === '2 BHK' ? '2-bhk' : '3-bhk';
              const routePrefix = project === 'godrej24' ? 'godrej-24' : 'godrej-elements';
              return (
                <button key={bhk} onClick={() => navigate(`/${routePrefix}-${routeSuffix}`)} style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', padding: '10px 28px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.04em' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,175,55,0.1)'}>
                  View {bhk} Details →
                </button>
              );
            })}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
          {configs.map((c, i) => (
            <div key={i} style={{ position: 'relative', background: c.highlight ? `linear-gradient(135deg, ${p.accentColor}25, ${p.accentColor}10)` : 'rgba(255,255,255,0.04)', border: c.highlight ? `1px solid ${p.accentColor}` : '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px 24px', textAlign: 'center', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${p.accentColor}30`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              {c.highlight && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(90deg, #D4AF37, #F3E5AB)', color: '#1a1a1a', fontSize: '0.65rem', fontWeight: 700, padding: '3px 12px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Most Popular</div>
              )}
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F3E5AB', fontFamily: "'Cinzel', serif", lineHeight: 1, marginBottom: '6px' }}>{c.bhk}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: c.highlight ? '#D4AF37' : '#94A3B8', marginBottom: '16px' }}>{c.carpet}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Carpet Area</div>
              <div style={{ fontSize: '0.8rem', color: '#4ade80', fontWeight: 500, background: 'rgba(74,222,128,0.08)', borderRadius: '6px', padding: '4px 8px', marginBottom: '20px', display: 'inline-block' }}>RERA Verified</div>
              <button onClick={handleWhatsApp} style={{ width: '100%', background: p.accentGradient, border: 'none', color: '#fff', padding: '10px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>Get Price →</button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '28px', padding: '16px', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '10px', fontSize: '0.8rem', color: '#D4AF37' }}>
          ℹ️ All carpet areas listed above are as defined under MahaRERA Registration <strong>{p.rera}</strong>. Pricing is available on request.
        </div>
      </section>

      {/* ── AMENITIES ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '70px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, color: '#F3E5AB', marginBottom: '12px', textAlign: 'center' }}>World-Class Amenities</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', textAlign: 'center', marginBottom: '48px' }}>{p.name} — Hinjewadi Phase 1</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
            {p.amenities.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px 18px', transition: 'border-color 0.2s, background 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${p.accentColor}60`; e.currentTarget.style.background = `${p.accentColor}10`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}>
                <span style={{ color: '#D4AF37', flexShrink: 0 }}>{a.icon}</span>
                <span style={{ fontSize: '0.85rem', color: '#CBD5E1', fontWeight: 500 }}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCATION & CONNECTIVITY ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '70px 24px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, color: '#F3E5AB', marginBottom: '12px', textAlign: 'center' }}>Location & Connectivity</h2>
        <p style={{ color: '#64748B', fontSize: '0.9rem', textAlign: 'center', marginBottom: '48px' }}>Rajiv Gandhi Infotech Park, Hinjewadi Phase 1, Pune — 411057</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {/* IT Parks */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px' }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1rem', color: '#D4AF37', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building2 size={16} /> IT Parks
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
              <MapPin size={16} /> Lifestyle Infra
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

      {/* ── FAQ ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '70px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, color: '#F3E5AB', marginBottom: '12px', textAlign: 'center' }}>Frequently Asked Questions</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', textAlign: 'center', marginBottom: '48px' }}>{p.name} — {bhkFilter || '2 & 3 BHK'} — Hinjewadi Phase 1</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {p.faqs.map((faq, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${openFaq === i ? p.accentColor + '60' : 'rgba(255,255,255,0.08)'}`, borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s' }}>
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

      {/* ── FINAL CTA ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⚜️</div>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 700, color: '#F3E5AB', marginBottom: '12px' }}>
            Ready to Explore {p.name}?
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '36px' }}>
            Connect with 24K Realtors for verified pricing, floor plan details, and a complimentary private site visit to {p.name}, Hinjewadi Phase 1.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button id="btn-whatsapp-cta" onClick={handleWhatsApp} style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', border: 'none', color: '#fff', padding: '16px 36px', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 24px rgba(37,211,102,0.3)' }}>
              <MessageSquare size={18} /> WhatsApp Now
            </button>
            <button id="btn-call-cta" onClick={handleCall} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.2)', color: '#E2E8F0', padding: '16px 36px', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Phone size={18} /> Call Now
            </button>
          </div>
          <p style={{ marginTop: '20px', fontSize: '0.78rem', color: '#374151' }}>
            24K Realtors · MahaRERA Advisory License: A051262603190 · Hinjewadi, Pune
          </p>
        </div>
      </section>

      {/* Cleanup temp script reminder — delete after verification */}
      {/* ── FULLSCREEN LIGHTBOX MODAL ── */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 700, background: 'rgba(212,175,55,0.12)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(212,175,55,0.3)' }}>
                {lightboxIdx + 1} / {p.gallery.length}
              </span>
              <button 
                onClick={() => setLightboxIdx(null)} 
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                title="Close (Esc)"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Center Stage with Prev / Next */}
          <div 
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', position: 'relative' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            <button
              onClick={() => setLightboxIdx((lightboxIdx - 1 + p.gallery.length) % p.gallery.length)}
              style={{
                background: 'rgba(4, 8, 20, 0.8)',
                border: '1px solid rgba(212,175,55,0.4)',
                color: '#F3E5AB',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'all 0.2s',
                marginLeft: '10px'
              }}
              title="Previous Photo (Left Arrow)"
            >
              <ChevronLeft size={24} />
            </button>

            {/* High-Res Full Image */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '0 20px' }}>
              <img
                src={p.gallery[lightboxIdx]?.src}
                alt={p.gallery[lightboxIdx]?.title}
                style={{
                  maxHeight: '74vh',
                  maxWidth: '86vw',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 35px rgba(212,175,55,0.2)',
                  border: '1px solid rgba(212,175,55,0.35)'
                }}
              />
            </div>

            {/* Next Button */}
            <button
              onClick={() => setLightboxIdx((lightboxIdx + 1) % p.gallery.length)}
              style={{
                background: 'rgba(4, 8, 20, 0.8)',
                border: '1px solid rgba(212,175,55,0.4)',
                color: '#F3E5AB',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'all 0.2s',
                marginRight: '10px'
              }}
              title="Next Photo (Right Arrow)"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Bottom Bar with Thumbnails & CTAs */}
          <div 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', gap: '16px', flexWrap: 'wrap' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mini thumbnails */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {p.gallery.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxIdx(idx)}
                  style={{
                    width: '65px',
                    height: '44px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: lightboxIdx === idx ? '2px solid #D4AF37' : '1px solid rgba(255,255,255,0.2)',
                    opacity: lightboxIdx === idx ? 1 : 0.5,
                    transition: 'all 0.2s'
                  }}
                >
                  <img src={item.src} alt={item.tag} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={handleSiteVisit}
                style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)', color: '#040814', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Car size={15} /> Book Site Visit
              </button>
              <button 
                onClick={handleWhatsApp}
                style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <MessageSquare size={15} /> WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
