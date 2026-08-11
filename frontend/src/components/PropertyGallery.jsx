import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight, Play, Maximize, X,
  ZoomIn, ZoomOut, Share2, Grid, Camera, Layers,
  Compass, ShieldCheck, CheckCircle
} from 'lucide-react';

/* ── Default High-Res Luxury Architectural Fallback Gallery Items ── */
const DEFAULT_LUXURY_GALLERY = [
  {
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
    category: 'exterior',
    title: 'Twilight Tower Architecture & Facade',
    alt: 'Luxury residential tower exterior illuminated at twilight with sunset sky background'
  },
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    category: 'interior',
    title: 'High-Ceiling Italian Marble Living Suite',
    alt: 'Grand open-concept living lounge with double-height ceiling and floor-to-ceiling glass windows'
  },
  {
    url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1600&q=85',
    category: 'amenities',
    title: 'Rooftop Horizon Infinity Sky Pool',
    alt: 'Panoramic rooftop infinity swimming pool overlooking city skyline during golden hour'
  },
  {
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
    category: 'interior',
    title: 'Master Bedroom Suite with Panoramic Balcony',
    alt: 'Spacious master bedroom with plush timber flooring and private sun deck'
  },
  {
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=85',
    category: 'lifestyle',
    title: 'State-of-the-Art Wellness & Fitness Center',
    alt: 'Fully equipped modern gymnasium with cardio and strength training zones'
  },
  {
    url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
    category: 'exterior',
    title: 'Landscaped Miyawaki Garden Promenade',
    alt: 'Lush manicured garden walkways and private seating decks surrounded by nature'
  },
  {
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
    category: 'views',
    title: 'Aerial View of Gated Luxury Township',
    alt: 'Bird eye view of modern residential towers and central green clubhouse park'
  },
  {
    url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=85',
    category: 'amenities',
    title: 'Grand Club House & Executive Lounge',
    alt: '25000 sq ft luxury clubhouse with banquet hall and private meeting suites'
  },
  {
    url: '/floorplan_2bhk.png',
    category: 'floorplans',
    title: '2 & 3 BHK Luxury Architectural Blueprint',
    alt: 'Detailed floor plan blueprint showing space utility and carpet area layout'
  }
];

export default function PropertyGallery({
  property = {},
  onOpenInquiry,
  className = ''
}) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  // Derive title & location
  const propertyTitle = property.title || 'Godrej Woodsville';
  const propertyLocation = property.location || 'Hinjewadi Phase 1, Pune';
  const hasVideo = Boolean(property.videoUrl || property.threeDTourUrl || true);

  // Normalize dynamic gallery items
  const fullGallery = useMemo(() => {
    if (Array.isArray(property.gallery) && property.gallery.length > 0) {
      return property.gallery.map((item, i) => ({
        url: item.url || item.src || item,
        category: (item.category || 'exterior').toLowerCase(),
        title: item.title || item.alt || `${propertyTitle} - Image ${i + 1}`,
        alt: item.alt || `${propertyTitle} ${item.category || 'view'}`
      }));
    }
    if (Array.isArray(property.images) && property.images.length > 0) {
      const cats = ['exterior', 'interior', 'amenities', 'interior', 'lifestyle', 'views', 'floorplans'];
      return property.images.map((img, i) => ({
        url: typeof img === 'string' ? img : img.url,
        category: cats[i % cats.length],
        title: `${propertyTitle} - ${cats[i % cats.length].toUpperCase()} View ${i + 1}`,
        alt: `${propertyTitle} ${cats[i % cats.length]} view`
      }));
    }
    return DEFAULT_LUXURY_GALLERY;
  }, [property, propertyTitle]);

  // States
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(false);

  // Filtered Items based on category
  const filteredGallery = useMemo(() => {
    if (activeCategory === 'all') return fullGallery;
    return fullGallery.filter(item => item.category === activeCategory);
  }, [fullGallery, activeCategory]);

  // Active Item safely bounded
  const safeIdx = Math.min(activeIdx, filteredGallery.length - 1);
  const currentItem = filteredGallery[safeIdx] || fullGallery[0] || DEFAULT_LUXURY_GALLERY[0];

  // Category Tabs Definition
  const CATEGORIES = [
    { id: 'all', label: `All (${fullGallery.length})` },
    { id: 'exterior', label: 'Exterior' },
    { id: 'interior', label: 'Interior' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'views', label: 'Views' },
    { id: 'floorplans', label: 'Floor Plans' },
  ];

  // Next / Prev Handlers
  const handlePrev = useCallback(() => {
    setActiveIdx(prev => (prev > 0 ? prev - 1 : filteredGallery.length - 1));
  }, [filteredGallery.length]);

  const handleNext = useCallback(() => {
    setActiveIdx(prev => (prev < filteredGallery.length - 1 ? prev + 1 : 0));
  }, [filteredGallery.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, handleNext, handlePrev]);

  // Fallback image error handler
  const handleImageError = (e) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85';
  };

  return (
    <div className={`property-gallery-container ${className}`} style={{ background: '#09111F', borderRadius: '24px', padding: isMobile ? '12px' : '20px', border: '1px solid rgba(212, 175, 55, 0.25)', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
      
      {/* ── DESKTOP & TABLET GALLERY CONTAINER ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '90px 1fr', gap: '16px', alignItems: 'stretch' }}>
        
        {/* LEFT VERTICAL THUMBNAIL RAIL (Desktop) / HORIZONTAL SWIPE (Mobile) */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          gap: '10px',
          maxHeight: isMobile ? 'auto' : '520px',
          overflowY: isMobile ? 'hidden' : 'auto',
          overflowX: isMobile ? 'auto' : 'hidden',
          paddingRight: isMobile ? 0 : '4px',
          paddingBottom: isMobile ? '8px' : 0
        }}>
          {filteredGallery.map((item, idx) => {
            const isActive = idx === safeIdx;
            return (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                aria-label={`View photo ${idx + 1}: ${item.title}`}
                style={{
                  width: isMobile ? '76px' : '82px',
                  height: isMobile ? '56px' : '62px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  padding: 0,
                  border: isActive ? '2px solid #D4AF37' : '1px solid rgba(255,255,255,0.15)',
                  cursor: 'pointer',
                  opacity: isActive ? 1 : 0.7,
                  filter: isActive ? 'brightness(1.1)' : 'brightness(0.8)',
                  transition: 'all 0.25s ease',
                  flexShrink: 0,
                  background: '#0F1C2E',
                  position: 'relative'
                }}
              >
                <img
                  src={item.url}
                  alt={item.alt}
                  onError={handleImageError}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>

        {/* MAIN CINEMATIC 16:10 GALLERY DISPLAY STAGE */}
        <div style={{
          position: 'relative',
          borderRadius: '18px',
          overflow: 'hidden',
          border: '1px solid rgba(212,175,55,0.2)',
          background: '#000',
          aspectRatio: isMobile ? '4/3' : '16/10',
          maxHeight: isMobile ? '60vh' : '520px'
        }}>
          
          {/* Main Stage Image */}
          <img
            src={currentItem.url}
            alt={currentItem.alt}
            onError={handleImageError}
            onClick={() => setLightboxOpen(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in', transition: 'opacity 0.3s' }}
          />

          {/* Dark Subtle Overlay Gradient */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,17,31,0.85) 0%, transparent 40%), linear-gradient(to bottom, rgba(9,17,31,0.6) 0%, transparent 35%)', pointerEvents: 'none' }} />

          {/* TOP LEFT: PREMIUM RESIDENTIAL PILL BADGE */}
          <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(9,17,31,0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(212,175,55,0.5)', borderRadius: '100px', padding: '5px 14px', color: '#F3E5AB', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={12} color="#D4AF37" />
            PREMIUM RESIDENTIAL
          </div>

          {/* TOP RIGHT: FULLSCREEN PHOTOS BUTTON */}
          <button
            onClick={() => setLightboxOpen(true)}
            aria-label="Open Fullscreen Property Gallery"
            style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(9,17,31,0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(212,175,55,0.5)', borderRadius: '100px', padding: '6px 14px', color: '#FFF', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.04em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'transform 0.2s' }}
          >
            <Camera size={13} color="#D4AF37" />
            <span>{fullGallery.length} PHOTOS</span>
            <ChevronRight size={13} color="#D4AF37" />
          </button>

          {/* BOTTOM LEFT: CATEGORY LABEL BADGE */}
          <div style={{ position: 'absolute', bottom: '18px', left: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '6px', padding: '3px 8px', color: '#D4AF37', fontSize: '0.64rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', width: 'fit-content' }}>
              {currentItem.category || 'EXTERIOR'}
            </div>
            <div style={{ color: '#FFF', fontSize: isMobile ? '0.86rem' : '1.05rem', fontWeight: 700, fontFamily: "'Cinzel', serif", textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
              {currentItem.title}
            </div>
          </div>

          {/* BOTTOM CENTER: GLASSMORPHISM WATCH VIDEO BUTTON */}
          {hasVideo && (
            <button
              onClick={onOpenInquiry}
              aria-label="Watch Property Video"
              style={{
                position: 'absolute',
                bottom: '18px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(9,17,31,0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(212,175,55,0.6)',
                borderRadius: '50px',
                padding: '8px 18px',
                color: '#FFF',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: isMobile ? 'none' : 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                transition: 'all 0.25s'
              }}
            >
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37, #F3E5AB)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Play size={11} fill="#09111F" color="#09111F" style={{ marginLeft: '2px' }} />
              </div>
              <span>WATCH PROPERTY VIDEO</span>
            </button>
          )}

          {/* LEFT & RIGHT NAVIGATION BUTTONS */}
          {filteredGallery.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                aria-label="Previous Image"
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(9,17,31,0.75)', border: '1px solid rgba(255,255,255,0.2)', color: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(6px)', transition: 'all 0.2s' }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Image"
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(9,17,31,0.75)', border: '1px solid rgba(255,255,255,0.2)', color: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(6px)', transition: 'all 0.2s' }}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

        </div>

      </div>

      {/* ── MOBILE UX FLOATING ACTIONS BAR ── */}
      {isMobile && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '12px', marginBottom: '8px' }}>
          <button
            onClick={() => setLightboxOpen(true)}
            style={{ flex: 1, padding: '10px', borderRadius: '50px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,175,55,0.4)', color: '#FFF', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <Camera size={14} color="#D4AF37" /> [{fullGallery.length} Photos]
          </button>
          {hasVideo && (
            <button
              onClick={onOpenInquiry}
              style={{ flex: 1, padding: '10px', borderRadius: '50px', background: 'linear-gradient(135deg, #D4AF37, #F3E5AB)', color: '#09111F', border: 'none', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Play size={14} fill="#09111F" /> [Watch Video]
            </button>
          )}
        </div>
      )}

      {/* ── CATEGORY FILTER TABS BAR (Below Gallery) ── */}
      <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px', display: 'flex', gap: '8px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setActiveIdx(0); }}
              aria-label={`Filter by ${cat.label}`}
              style={{
                padding: '8px 18px',
                borderRadius: '50px',
                background: isActive ? 'linear-gradient(135deg, #D4AF37, #F3E5AB)' : 'rgba(255,255,255,0.04)',
                color: isActive ? '#09111F' : '#A0AEC0',
                border: isActive ? 'none' : '1px solid rgba(255,255,255,0.1)',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* ── FULLSCREEN LUXURY GALLERY LIGHTBOX MODAL ── */}
      {lightboxOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5,10,18,0.97)', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          
          {/* TOP CONTROLS BAR */}
          <div style={{ padding: isMobile ? '14px 16px' : '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(9,17,31,0.8)' }}>
            <div>
              <div style={{ color: '#FFF', fontSize: '1.05rem', fontWeight: 700, fontFamily: "'Cinzel', serif" }}>{propertyTitle}</div>
              <div style={{ color: '#D4AF37', fontSize: '0.74rem', fontWeight: 600 }}>{propertyLocation}</div>
            </div>

            {/* Counter Center Pill */}
            <div style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '100px', padding: '6px 16px', color: '#F3E5AB', fontSize: '0.82rem', fontWeight: 800, fontFamily: "'Montserrat', sans-serif" }}>
              {String(safeIdx + 1).padStart(2, '0')} / {String(filteredGallery.length).padStart(2, '0')}
            </div>

            {/* Right Action Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setLightboxZoom(!lightboxZoom)}
                aria-label="Toggle Zoom"
                style={{ background: 'none', border: 'none', color: '#A0AEC0', cursor: 'pointer', padding: '6px' }}
              >
                {lightboxZoom ? <ZoomOut size={20} color="#F3E5AB" /> : <ZoomIn size={20} color="#A0AEC0" />}
              </button>
              <button
                onClick={() => { if (navigator.share) navigator.share({ title: propertyTitle, url: window.location.href }); }}
                aria-label="Share Property"
                style={{ background: 'none', border: 'none', color: '#A0AEC0', cursor: 'pointer', padding: '6px' }}
              >
                <Share2 size={20} color="#A0AEC0" />
              </button>
              <button
                onClick={() => setLightboxOpen(false)}
                aria-label="Close Lightbox"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '36px', height: '36px', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* MAIN LIGHTBOX IMAGE CANVAS */}
          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '12px' : '24px', overflow: 'hidden' }}>
            
            <img
              src={currentItem.url}
              alt={currentItem.alt}
              onError={handleImageError}
              style={{
                maxWidth: '92vw',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
                transform: lightboxZoom ? 'scale(1.4)' : 'scale(1)',
                transition: 'transform 0.3s ease'
              }}
            />

            {/* Left / Right Lightbox Nav */}
            {filteredGallery.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  aria-label="Previous Lightbox Image"
                  style={{ position: 'absolute', left: isMobile ? '12px' : '32px', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(9,17,31,0.85)', border: '1px solid rgba(212,175,55,0.4)', color: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNext}
                  aria-label="Next Lightbox Image"
                  style={{ position: 'absolute', right: isMobile ? '12px' : '32px', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(9,17,31,0.85)', border: '1px solid rgba(212,175,55,0.4)', color: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

          </div>

          {/* BOTTOM LIGHTBOX CAPTION BAR */}
          <div style={{ padding: isMobile ? '14px 16px' : '20px 32px', background: 'rgba(9,17,31,0.8)', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
            <div style={{ color: '#D4AF37', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '4px' }}>
              {(currentItem.category || 'EXTERIOR').toUpperCase()} VIEW
            </div>
            <div style={{ color: '#FFF', fontSize: '0.98rem', fontWeight: 600, fontFamily: "'Montserrat', sans-serif" }}>
              {currentItem.title}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
