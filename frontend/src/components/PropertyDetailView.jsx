import React, { useState } from 'react';
import {
  MapPin, ShieldCheck, ArrowRight,
  Heart, Share2, Play, ChevronRight, X, ChevronLeft
} from 'lucide-react';

export default function PropertyDetailView({
  property = {},
  onBack,
  onOpenInquiry,
  onOpenBrochure
}) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  // States
  const [activeTab, setActiveTab] = useState('overview');
  const [saved, setSaved] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [mainImgIdx, setMainImgIdx] = useState(0);

  // Property Details
  const title = property.title || 'Godrej Woodsville';
  const location = property.location || 'Hinjewadi Phase 1, Pune';
  const address = property.address || `${title}, Hinjewadi Phase 1, Pune`;
  const price = property.price ? `₹${(property.price / 10000000).toFixed(2)} Cr*` : 'Price on Request*';
  const reraNumber = property.reraNumber || 'P52100046770';
  const possession = property.possessionDate || 'Nov 2028';
  const projectArea = property.projectArea || '~4.54 Acres';
  const developerName = property.builderName || (title.includes('Godrej') ? 'Godrej Properties' : 'Kolte-Patil Properties');

  // Images for Slideshow
  const images = property.images && property.images.length > 0 ? property.images : [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85'
  ];

  // Scroll to section
  const scrollTo = id => {
    const el = document.getElementById(`sec-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveTab(id);
    try {
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', `#${id}`);
      }
    } catch (e) {}
  };

  // Tabs Definition matching Image 2
  const TABS = [
    { id: 'overview', label: 'OVERVIEW', icon: '🖼️' },
    { id: 'highlights', label: 'HIGHLIGHTS', icon: '✨' },
    { id: 'amenities', label: 'AMENITIES', icon: '🏊' },
    { id: 'location', label: 'LOCATION', icon: '📍' },
    { id: 'floorplans', label: 'FLOOR PLANS', icon: '📐' },
    { id: 'similar', label: 'SIMILAR PROPERTIES', icon: '🏢' },
  ];

  // Amenities List matching Image 2
  const AMENITIES = [
    { title: 'Clubhouse', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=75' },
    { title: 'Swimming Pool', img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=75' },
    { title: 'Gymnasium', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=75' },
    { title: "Children's Play Area", img: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=75' },
    { title: 'Jogging Track', img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=75' },
    { title: 'Multipurpose Hall', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=75' },
  ];

  // Similar Properties matching Image 2
  const SIMILAR_PROPERTIES = [
    { title: 'Godrej Greenfront', loc: 'Hinjewadi Phase 2', config: '2 & 3 BHK', area: '640 - 1200 sq.ft', price: '₹1.25 Cr*', tag: 'PREMIUM', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=75' },
    { title: 'Kolte Patil Life Republic', loc: 'Hinjewadi Phase 1', config: '2 & 3 BHK', area: '650 - 1300 sq.ft', price: '₹1.10 Cr*', tag: 'LUXURY', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=75' },
    { title: 'Lodha Panache', loc: 'Hinjewadi Phase 1', config: '2, 3 & 5 BHK', area: '1100 - 1800 sq.ft', price: '₹1.32 Cr*', tag: 'PREMIUM', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=75' },
    { title: 'VTP Monarque', loc: 'Hinjewadi Phase 3', config: '2 & 3 BHK', area: '1200 - 1800 sq.ft', price: '₹1.28 Cr*', tag: 'LUXURY', img: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=75' },
  ];

  return (
    <div style={{ background: '#09111F', color: '#FFF', fontFamily: "'Montserrat', 'Inter', sans-serif", minHeight: '100vh' }}>
      
      {/* ── BREADCRUMB ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px 8px', fontSize: '0.78rem', color: '#A0AEC0', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ cursor: 'pointer' }} onClick={onBack}>Home</span>
        <ChevronRight size={12} />
        <span>Projects</span>
        <ChevronRight size={12} />
        <span>Hinjewadi</span>
        <ChevronRight size={12} />
        <span style={{ color: '#D4AF37', fontWeight: 600 }}>{title} Phase 1</span>
      </div>

      {/* ── TOP HERO SECTION (IMAGE 2 MATCH) ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '12px 16px 32px' : '16px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.35fr 0.85fr', gap: '28px', alignItems: 'start' }}>
          
          {/* LEFT: MAIN IMAGE SHOWCASE + VERTICAL THUMBNAIL OVERLAY STRIP */}
          <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.25)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', aspectRatio: '16/10', background: '#000' }}>
            <img src={images[mainImgIdx]} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            
            {/* Top Left Premium Badge */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'linear-gradient(135deg, #D4AF37, #9A7B1C)', color: '#09111F', fontSize: '0.68rem', fontWeight: 800, padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              PREMIUM RESIDENTIAL
            </div>

            {/* Vertical Thumbnail Strip (Left Overlay) */}
            <div style={{ position: 'absolute', top: '56px', left: '16px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>
              {images.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImgIdx(idx)}
                  style={{
                    width: '48px',
                    height: '36px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: mainImgIdx === idx ? '2px solid #D4AF37' : '1px solid rgba(255,255,255,0.4)',
                    padding: 0,
                    cursor: 'pointer',
                    opacity: mainImgIdx === idx ? 1 : 0.7,
                    transition: 'all 0.2s'
                  }}
                >
                  <img src={img} alt={`Thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
              {images.length > 4 && (
                <button
                  onClick={() => setLightboxOpen(true)}
                  style={{ width: '48px', height: '36px', borderRadius: '6px', background: 'rgba(9,17,31,0.85)', border: '1px solid #D4AF37', color: '#F3E5AB', fontSize: '0.6rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  +{images.length - 4} Photos
                </button>
              )}
            </div>

            {/* Center Play Button Overlay */}
            <button
              onClick={() => setLightboxOpen(true)}
              style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(212,175,55,0.3)', border: '2px solid #D4AF37', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(6px)', transition: 'transform 0.2s' }}
            >
              <Play size={24} fill="#FFF" color="#FFF" style={{ marginLeft: '4px' }} />
            </button>

            {/* Prev / Next Arrows */}
            <button
              onClick={() => setMainImgIdx(prev => (prev > 0 ? prev - 1 : images.length - 1))}
              style={{ position: 'absolute', left: '16px', bottom: '16px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(9,17,31,0.7)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setMainImgIdx(prev => (prev < images.length - 1 ? prev + 1 : 0))}
              style={{ position: 'absolute', right: '16px', bottom: '16px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(9,17,31,0.7)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* RIGHT: DETAILS, METRICS, CTA & META DETAILS (IMAGE 2 MATCH) */}
          <div style={{ background: 'rgba(15,28,46,0.85)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(212,175,55,0.25)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            
            <div>
              {/* Developer Logo / Brand */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.78rem', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {developerName}
                </span>
                <span style={{ fontSize: '1.2rem' }}>🏛️</span>
              </div>

              {/* Title & Location */}
              <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2.1rem', fontWeight: 700, color: '#FFF', margin: '0 0 6px', lineHeight: 1.15 }}>
                {title}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.86rem', color: '#A0AEC0', marginBottom: '14px' }}>
                <MapPin size={15} color="#D4AF37" />
                <span>{location}</span>
              </div>

              <p style={{ fontSize: '0.84rem', color: '#CBD5E0', lineHeight: 1.5, margin: '0 0 20px' }}>
                Premium homes crafted for a life of comfort, connectivity & luxury in the heart of Hinjewadi.
              </p>

              {/* Price Block */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '18px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', fontWeight: 700, color: '#F3E5AB' }}>
                    {price}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#A0AEC0' }}>All-inclusive starting value</div>
                </div>
                <button onClick={onOpenInquiry} style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>
                  View Price Breakup →
                </button>
              </div>

              {/* 4 Metrics Row (Image 2 Match) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
                {[
                  { icon: '🛏️', label: '2 & 3', sub: 'BHK Homes' },
                  { icon: '📐', label: '761 - 973', sub: 'Carpet Area Sq.ft' },
                  { icon: '🏢', label: '4', sub: 'Towers' },
                  { icon: '🏠', label: '882', sub: 'Total Units' },
                ].map((m, idx) => (
                  <div key={idx} style={{ padding: '10px 8px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', marginBottom: '2px' }}>{m.icon}</div>
                    <div style={{ fontFamily: 'var(--font-title)', fontSize: '0.88rem', fontWeight: 700, color: '#FFF' }}>{m.label}</div>
                    <div style={{ fontSize: '0.64rem', color: '#A0AEC0' }}>{m.sub}</div>
                  </div>
                ))}
              </div>

              {/* Primary Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                <button
                  onClick={onOpenInquiry}
                  className="brand-btn-gold"
                  style={{ flex: 1, padding: '14px', fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', background: 'linear-gradient(135deg, #D4AF37, #F3E5AB)', color: '#09111F', border: 'none', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(212,175,55,0.35)' }}
                >
                  ENQUIRE NOW
                </button>
                <button
                  onClick={onOpenInquiry}
                  className="brand-btn-outline"
                  style={{ flex: 1, padding: '14px', fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase', background: 'rgba(255,255,255,0.05)', color: '#FFF', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '50px', cursor: 'pointer' }}
                >
                  BOOK SITE VISIT
                </button>
              </div>

              {/* Bookmark & Share */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' }}>
                <button onClick={() => setSaved(!saved)} style={{ background: 'none', border: 'none', color: saved ? '#D4AF37' : '#A0AEC0', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <Heart size={14} fill={saved ? '#D4AF37' : 'none'} color={saved ? '#D4AF37' : '#A0AEC0'} /> {saved ? 'Saved' : 'Save Property'}
                </button>
                <button onClick={() => { if (navigator.share) navigator.share({ title, url: window.location.href }); }} style={{ background: 'none', border: 'none', color: '#A0AEC0', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <Share2 size={14} color="#A0AEC0" /> Share
                </button>
              </div>
            </div>

            {/* 3 Meta Details Grid (Bottom of Right Box) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center', fontSize: '0.68rem', color: '#A0AEC0' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>RERA NO.</div>
                <div style={{ color: '#FFF', fontWeight: 700, fontSize: '0.76rem', marginTop: '2px' }}>{reraNumber}</div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>POSSESSION</div>
                <div style={{ color: '#FFF', fontWeight: 700, fontSize: '0.76rem', marginTop: '2px' }}>{possession}</div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PROJECT AREA</div>
                <div style={{ color: '#FFF', fontWeight: 700, fontSize: '0.76rem', marginTop: '2px' }}>{projectArea}</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── STICKY TABS BAR (IMAGE 2 MATCH) ── */}
      <div style={{ position: 'sticky', top: '0px', zIndex: 90, background: 'rgba(9,17,31,0.98)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(212,175,55,0.2)', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', overflowX: 'auto' }} className="brand-hide">
          <div style={{ display: 'flex', justifyContent: isMobile ? 'flex-start' : 'space-between', gap: '8px', whiteSpace: 'nowrap' }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => scrollTo(tab.id)}
                style={{
                  padding: '16px 20px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '3px solid #D4AF37' : '3px solid transparent',
                  color: activeTab === tab.id ? '#F3E5AB' : '#A0AEC0',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  letterSpacing: '0.04em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT SECTIONS (IMAGE 2 MATCH) ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '40px 16px' : '60px 24px' }}>

        {/* 1. OVERVIEW SECTION */}
        <div id="sec-overview" style={{ marginBottom: '70px', paddingTop: '10px' }}>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.78rem', fontWeight: 800, color: '#D4AF37', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>
            OVERVIEW
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 0.9fr', gap: '40px', alignItems: 'start' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: isMobile ? '1.8rem' : '2.3rem', fontWeight: 700, color: '#FFF', margin: '0 0 16px', lineHeight: 1.25 }}>
                A perfect blend of nature,<br />
                <span style={{ color: '#F3E5AB' }}>luxury &amp; connectivity.</span>
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#CBD5E0', lineHeight: 1.85, margin: '0 0 24px' }}>
                Godrej Woodsville is a thoughtfully planned residential development by Godrej Properties in Hinjewadi Phase 1. Spread across ~4.54 acres, it offers 2 & 3 BHK premium homes with world-class amenities, lush green spaces, and excellent connectivity to IT hubs, schools, hospitals and entertainment zones.
              </p>
            </div>

            {/* Right: Key Facts 8-Grid Box (Image 2 Match) */}
            <div style={{ background: 'rgba(15,28,46,0.85)', padding: '24px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                {[
                  { icon: '🏢', label: 'DEVELOPER', value: developerName },
                  { icon: '🛏️', label: 'CONFIGURATION', value: '2 & 3 BHK' },
                  { icon: '📐', label: 'CARPET AREA', value: '761 - 973 sq.ft' },
                  { icon: '🏠', label: 'TOTAL UNITS', value: '~882 Homes' },
                  { icon: '🏢', label: 'TOWERS', value: '4' },
                  { icon: '🌳', label: 'PROJECT AREA', value: projectArea },
                  { icon: '🕒', label: 'POSSESSION', value: possession },
                  { icon: '📋', label: 'RERA NO.', value: reraNumber },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                      <span style={{ fontSize: '0.66rem', color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-title)', fontSize: '0.88rem', fontWeight: 700, color: '#FFF' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. HIGHLIGHTS SECTION */}
        <div id="sec-highlights" style={{ marginBottom: '70px', paddingTop: '10px' }}>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.78rem', fontWeight: 800, color: '#D4AF37', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
            HIGHLIGHTS
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(6, 1fr)', gap: '14px' }}>
            {[
              { icon: '📍', text: 'Prime location in Hinjewadi Phase 1' },
              { icon: '🚆', text: 'Close to IT parks, Metro & Expressway' },
              { icon: '🌳', text: '80%+ Open Spaces with landscaping' },
              { icon: '🧘', text: 'Vaastu-compliant homes' },
              { icon: '🏛️', text: 'Grand Clubhouse with modern facilities' },
              { icon: '🏗️', text: 'Trusted developer with 125+ years of legacy' },
            ].map((h, idx) => (
              <div key={idx} style={{ padding: '20px 14px', borderRadius: '16px', background: 'rgba(15,28,46,0.85)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{h.icon}</div>
                <div style={{ fontSize: '0.78rem', color: '#CBD5E0', fontWeight: 600, lineHeight: 1.4 }}>{h.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. AMENITIES SECTION */}
        <div id="sec-amenities" style={{ marginBottom: '70px', paddingTop: '10px' }}>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.78rem', fontWeight: 800, color: '#D4AF37', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
            AMENITIES
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(7, 1fr)', gap: '14px' }}>
            {AMENITIES.map((item, idx) => (
              <div key={idx} style={{ borderRadius: '16px', overflow: 'hidden', background: '#0F1C2E', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}>
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                </div>
                <div style={{ padding: '10px 8px', textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#FFF' }}>
                  {item.title}
                </div>
              </div>
            ))}

            {/* 7th Card: View All Amenities */}
            <div onClick={onOpenInquiry} style={{ borderRadius: '16px', background: 'rgba(15,28,46,0.85)', border: '1px solid rgba(212,175,55,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', cursor: 'pointer' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#F3E5AB', marginBottom: '6px', textAlign: 'center' }}>
                View All Amenities
              </div>
              <ArrowRight size={18} color="#D4AF37" />
            </div>
          </div>
        </div>

        {/* 4. LOCATION ADVANTAGE SECTION */}
        <div id="sec-location" style={{ marginBottom: '70px', paddingTop: '10px' }}>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.78rem', fontWeight: 800, color: '#D4AF37', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
            LOCATION ADVANTAGE
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.3fr', gap: '28px', alignItems: 'center' }}>
            
            {/* Left Travel Times */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'Hinjewadi IT Park', time: '5 mins' },
                { name: 'Wakad Metro Station', time: '10 mins' },
                { name: 'Pune - Mumbai Expressway', time: '10 mins' },
                { name: 'Phoenix Mall of the Millennium', time: '15 mins' },
                { name: 'Pune Railway Station', time: '25 mins' },
                { name: 'Pune Airport', time: '45 mins' },
              ].map((loc, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', background: 'rgba(15,28,46,0.85)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', color: '#FFF' }}>
                    <span style={{ fontSize: '1rem' }}>📍</span>
                    <span>{loc.name}</span>
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F3E5AB' }}>{loc.time}</span>
                </div>
              ))}

              <button onClick={onOpenInquiry} style={{ padding: '12px', borderRadius: '50px', background: 'rgba(255,255,255,0.05)', color: '#FFF', border: '1px solid rgba(212,175,55,0.4)', fontSize: '0.82rem', marginTop: '8px', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer' }}>
                VIEW ON MAP
              </button>
            </div>

            {/* Right Map Card */}
            <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.3)', aspectRatio: '16/10', background: '#0F1C2E' }}>
              <iframe
                src={`https://maps.google.com/maps?t=m&z=14&ie=UTF8&iwloc=&output=embed&q=${encodeURIComponent(address)}&zoom=14`}
                style={{ width: '100%', height: '100%', border: 'none', filter: 'invert(1) hue-rotate(180deg) saturate(0.8)' }}
                loading="lazy"
                title="Location Map"
              />
            </div>
          </div>
        </div>

        {/* 5. FLOOR PLANS SECTION */}
        <div id="sec-floorplans" style={{ marginBottom: '70px', paddingTop: '10px' }}>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.78rem', fontWeight: 800, color: '#D4AF37', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
            FLOOR PLANS
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '20px' }}>
            
            {/* Card 1: 2 BHK */}
            <div style={{ padding: '20px', borderRadius: '18px', background: 'rgba(15,28,46,0.85)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.2rem', fontWeight: 700, color: '#FFF', marginBottom: '4px' }}>2 BHK</div>
              <div style={{ fontSize: '0.78rem', color: '#A0AEC0', marginBottom: '14px' }}>Carpet Area: 761 - 858 sq.ft</div>
              <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#000', marginBottom: '14px', aspectRatio: '4/3' }}>
                <img src="/floorplan_2bhk.png" alt="2 BHK Floor Plan" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }} onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=75'; }} />
              </div>
              <button onClick={onOpenInquiry} style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                View Plan →
              </button>
            </div>

            {/* Card 2: 3 BHK */}
            <div style={{ padding: '20px', borderRadius: '18px', background: 'rgba(15,28,46,0.85)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.2rem', fontWeight: 700, color: '#FFF', marginBottom: '4px' }}>3 BHK</div>
              <div style={{ fontSize: '0.78rem', color: '#A0AEC0', marginBottom: '14px' }}>Carpet Area: 904 - 973 sq.ft</div>
              <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#000', marginBottom: '14px', aspectRatio: '4/3' }}>
                <img src="/floorplan_2bhk.png" alt="3 BHK Floor Plan" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }} onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=75'; }} />
              </div>
              <button onClick={onOpenInquiry} style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                View Plan →
              </button>
            </div>

            {/* Card 3: Need Customization? */}
            <div style={{ padding: '28px 24px', borderRadius: '18px', background: 'rgba(15,28,46,0.85)', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.15rem', fontWeight: 700, color: '#FFF', margin: '0 0 8px' }}>Need Customization?</h3>
              <p style={{ fontSize: '0.84rem', color: '#A0AEC0', margin: '0 0 20px', lineHeight: 1.5 }}>
                Talk to our expert for your perfect home.
              </p>
              <button onClick={onOpenInquiry} style={{ padding: '12px 24px', borderRadius: '50px', background: 'linear-gradient(135deg, #D4AF37, #F3E5AB)', color: '#09111F', border: 'none', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer' }}>
                TALK TO EXPERT
              </button>
            </div>

          </div>
        </div>

        {/* 6. SIMILAR PROPERTIES SECTION */}
        <div id="sec-similar" style={{ marginBottom: '70px', paddingTop: '10px' }}>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.78rem', fontWeight: 800, color: '#D4AF37', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
            SIMILAR PROPERTIES
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: '20px' }}>
            {SIMILAR_PROPERTIES.map((item, idx) => (
              <div key={idx} style={{ borderRadius: '16px', overflow: 'hidden', background: '#0F1C2E', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', overflow: 'hidden' }}>
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  <span style={{ position: 'absolute', top: '10px', left: '10px', background: item.tag === 'LUXURY' ? 'linear-gradient(135deg, #D4AF37, #9A7B1C)' : 'rgba(9,17,31,0.85)', color: item.tag === 'LUXURY' ? '#09111F' : '#F3E5AB', fontSize: '0.62rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>{item.tag}</span>
                </div>
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-title)', fontSize: '0.98rem', fontWeight: 700, color: '#FFF', margin: '0 0 4px' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.76rem', color: '#A0AEC0', margin: '0 0 8px' }}>{item.loc}</p>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>{item.config} · {item.area}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 700, color: '#F3E5AB' }}>{item.price}</span>
                    <button onClick={onOpenInquiry} style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. LEAD CAPTURE BANNER (BOTTOM OF IMAGE 2) */}
        <div style={{ padding: isMobile ? '28px 18px' : '40px 48px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(15,28,46,0.95) 0%, rgba(9,17,31,0.98) 100%)', border: '1px solid rgba(212,175,55,0.3)', marginBottom: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.2fr 0.9fr', gap: '28px', alignItems: 'center' }}>
            
            <div>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: isMobile ? '1.6rem' : '2.1rem', fontWeight: 700, color: '#FFF', margin: '0 0 8px', lineHeight: 1.25 }}>
                Ready to find your<br />
                <span style={{ color: '#F3E5AB' }}>perfect home?</span>
              </h2>
              <p style={{ fontSize: '0.86rem', color: '#A0AEC0', margin: 0, lineHeight: 1.5 }}>
                Connect with our real estate experts and get the best offers.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={(e) => { e.preventDefault(); onOpenInquiry(); }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input type="text" placeholder="Your Name" required style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box' }} />
              <input type="tel" placeholder="Mobile Number" required style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box' }} />
              <input type="email" placeholder="Email Address" required style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box' }} />
              <button type="submit" style={{ padding: '14px', borderRadius: '50px', background: 'linear-gradient(135deg, #D4AF37, #F3E5AB)', color: '#09111F', border: 'none', fontSize: '0.88rem', width: '100%', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer' }}>
                ENQUIRE NOW
              </button>
            </form>

            {/* 4 Trust Badges Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: isMobile ? 'none' : '1px solid rgba(255,255,255,0.08)', paddingLeft: isMobile ? '0' : '20px' }}>
              {[
                { icon: '🛡️', text: 'Best Price Guaranteed' },
                { icon: '👤', text: 'Personalized Assistance' },
                { icon: '💡', text: 'Expert Guidance' },
                { icon: '🤝', text: 'No Hidden Charges' },
              ].map((b, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#CBD5E0', fontWeight: 600 }}>
                  <span>{b.icon}</span>
                  <span>{b.text}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* ── LIGHTBOX ── */}
      {lightboxOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button onClick={() => setLightboxOpen(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}>
            <X size={32} />
          </button>
          <img src={images[mainImgIdx]} alt="Full Lightbox" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
        </div>
      )}

    </div>
  );
}
