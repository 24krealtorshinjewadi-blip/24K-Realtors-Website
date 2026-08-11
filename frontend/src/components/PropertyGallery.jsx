/**
 * PropertyGallery.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Premium, production-ready Real Estate Property Gallery UI
 * for 24K REALTORS PUNE
 *
 * Features:
 *  • Cinematic 16:10 main stage with dark gradient overlay
 *  • Vertical thumbnail rail (desktop) / horizontal swipe strip (mobile & tablet)
 *  • Category filter tabs: All / Exterior / Interior / Amenities / Lifestyle / Views / Floor Plans
 *  • Fullscreen luxury lightbox: zoom, share, keyboard ←/→/ESC, touch swipe, image counter
 *  • PREMIUM RESIDENTIAL pill badge (top-left) + Photo count button (top-right)
 *  • Glassmorphism WATCH PROPERTY VIDEO button (bottom-center, only if video exists)
 *  • Category label badge (bottom-left)
 *  • Mobile: floating [18 Photos] [Watch Video] action bar + horizontal thumb strip
 *  • Fully dynamic: property.gallery / property.images / fallback luxury images
 *  • Robust error fallback — never shows broken image or empty box
 *  • Accessible: aria-labels on all interactive elements
 *  • Performance: lazy loading, only hero preloaded
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, {
  useState, useEffect, useCallback, useMemo, useRef
} from 'react';
import {
  ChevronLeft, ChevronRight, Play, X,
  ZoomIn, ZoomOut, Share2, Camera, Shield
} from 'lucide-react';

/* ── Fallback Gallery ── */
const FALLBACK_GALLERY = [
  {
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85',
    category: 'exterior',
    title: 'Twilight Tower Architecture & Facade',
    alt: 'Luxury residential tower exterior illuminated at twilight with golden-hour sky',
  },
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    category: 'interior',
    title: 'Italian Marble Grand Living Suite',
    alt: 'Spacious open-concept living room with double-height ceiling and floor-to-ceiling glass',
  },
  {
    url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1600&q=85',
    category: 'amenities',
    title: 'Rooftop Infinity Horizon Pool',
    alt: 'Panoramic rooftop infinity swimming pool with city skyline at golden hour',
  },
  {
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
    category: 'interior',
    title: 'Master Bedroom Suite with Sun Deck',
    alt: 'Elegant master bedroom with plush timber flooring and private balcony',
  },
  {
    url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=85',
    category: 'amenities',
    title: 'State-of-the-Art Wellness Centre',
    alt: 'Modern gymnasium with full cardio and strength training equipment',
  },
  {
    url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85',
    category: 'exterior',
    title: 'Landscaped Promenade & Gardens',
    alt: 'Lush manicured garden walkways with evening accent lighting',
  },
  {
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85',
    category: 'views',
    title: 'Aerial View — Gated Township',
    alt: 'Bird-eye view of residential towers and central green township park',
  },
  {
    url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=85',
    category: 'amenities',
    title: 'Grand Clubhouse & Executive Lounge',
    alt: '25,000 sq.ft luxury clubhouse with banquet hall and private suites',
  },
  {
    url: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=85',
    category: 'exterior',
    title: 'Blue Hour Architectural Exterior',
    alt: 'Luxury residential towers captured at blue-hour with dramatic sky backdrop',
  },
];

const FALLBACK_URL =
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=85';

/* ── Category Definitions ── */
const ALL_CATEGORIES = [
  { id: 'all',        label: 'All' },
  { id: 'exterior',   label: 'Exterior' },
  { id: 'interior',   label: 'Interior' },
  { id: 'amenities',  label: 'Amenities' },
  { id: 'lifestyle',  label: 'Lifestyle' },
  { id: 'views',      label: 'Views' },
  { id: 'floorplans', label: 'Floor Plans' },
  { id: 'videos',     label: 'Videos' },
];

/* ── Inline CSS injected once ── */
const STYLE_ID = 'pg-gallery-styles-v2';
const GALLERY_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Montserrat:wght@400;600;700;800&display=swap');

.pg-root { font-family: 'Montserrat', sans-serif; }

.pg-thumb { transition: all 0.22s ease !important; }
.pg-thumb:hover { opacity: 1 !important; filter: brightness(1) !important; border-color: rgba(212,175,55,0.6) !important; transform: scale(1.04); }

.pg-cat-btn { transition: all 0.22s ease !important; }
.pg-cat-btn:hover { background: rgba(212,175,55,0.14) !important; color: #F3E5AB !important; }

.pg-nav-btn { transition: all 0.2s ease !important; }
.pg-nav-btn:hover { background: rgba(212,175,55,0.2) !important; border-color: #D4AF37 !important; }

.pg-nav-btn-lb { transition: all 0.2s ease !important; }
.pg-nav-btn-lb:hover { background: rgba(212,175,55,0.2) !important; border-color: #D4AF37 !important; }

.pg-photo-count { transition: background 0.2s ease !important; }
.pg-photo-count:hover { background: rgba(212,175,55,0.22) !important; }

.pg-video-btn { transition: all 0.25s ease !important; }
.pg-video-btn:hover { background: rgba(212,175,55,0.14) !important; box-shadow: 0 8px 28px rgba(212,175,55,0.3) !important; }

.pg-close-btn { transition: background 0.2s ease !important; }
.pg-close-btn:hover { background: rgba(212,175,55,0.18) !important; }

.pg-main-img { transition: transform 0.45s ease; }
.pg-main-img:hover { transform: scale(1.012); }

.pg-thumb-rail::-webkit-scrollbar { width: 3px; height: 3px; }
.pg-thumb-rail::-webkit-scrollbar-track { background: transparent; }
.pg-thumb-rail::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius: 4px; }

.pg-cat-bar::-webkit-scrollbar { height: 0; }

@keyframes pg-fade { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
.pg-img-fade { animation: pg-fade 0.28s ease forwards; }

@keyframes pg-lb-in { from { opacity: 0; } to { opacity: 1; } }
.pg-lightbox { animation: pg-lb-in 0.18s ease forwards; }
`;

function injectStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const tag = document.createElement('style');
  tag.id = STYLE_ID;
  tag.textContent = GALLERY_CSS;
  document.head.appendChild(tag);
}

/* ── Responsive width hook ── */
function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
export default function PropertyGallery({
  property = {},
  onOpenInquiry,
  className = '',
}) {
  injectStyles();

  const windowWidth = useWindowWidth();
  const isMobile  = windowWidth <= 768;
  const isTablet  = windowWidth > 768 && windowWidth <= 1024;

  /* ── Derived property metadata ── */
  const propertyTitle    = property.title    || 'Godrej Woodsville';
  const propertyLocation = property.location || 'Hinjewadi Phase 1, Pune';
  const hasVideo         = Boolean(property.videoUrl || property.threeDTourUrl);

  /* ── Normalize gallery items + sort exterior first ── */
  const fullGallery = useMemo(() => {
    const CATS = ['exterior', 'interior', 'amenities', 'lifestyle', 'views', 'floorplans'];
    // Category priority: exterior always first, then interior, etc.
    const CAT_ORDER = { exterior: 0, views: 1, interior: 2, lifestyle: 3, amenities: 4, floorplans: 5, videos: 6 };

    const sortByCategory = (arr) =>
      [...arr].sort((a, b) => (CAT_ORDER[a.category] ?? 99) - (CAT_ORDER[b.category] ?? 99));

    if (Array.isArray(property.gallery) && property.gallery.length > 0) {
      const mapped = property.gallery.map((item, i) => ({
        url:      item.url  || item.src || (typeof item === 'string' ? item : FALLBACK_URL),
        category: (item.category || CATS[i % CATS.length]).toLowerCase(),
        title:    item.title || `${propertyTitle} — Image ${i + 1}`,
        alt:      item.alt   || `${propertyTitle} ${item.category || 'view'} ${i + 1}`,
      }));
      return sortByCategory(mapped);
    }

    if (Array.isArray(property.images) && property.images.length > 0) {
      const mapped = property.images.map((img, i) => {
        const url = typeof img === 'string' ? img : img?.url || FALLBACK_URL;
        const cat = CATS[i % CATS.length];
        return {
          url,
          category: cat,
          title:    `${propertyTitle} — ${cat.charAt(0).toUpperCase() + cat.slice(1)}`,
          alt:      `${propertyTitle} ${cat} view`,
        };
      });
      return sortByCategory(mapped);
    }

    return FALLBACK_GALLERY; // already sorted exterior-first
  }, [property, propertyTitle]);

  /* ── State ── */
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeIdx,      setActiveIdx]      = useState(0);
  const [lightboxOpen,   setLightboxOpen]   = useState(false);
  const [lbZoomed,       setLbZoomed]       = useState(false);
  const [imgKey,         setImgKey]         = useState(0);

  /* ── Filtered gallery ── */
  const filteredGallery = useMemo(() => {
    if (activeCategory === 'all') return fullGallery;
    return fullGallery.filter(it => it.category === activeCategory);
  }, [fullGallery, activeCategory]);

  /* ── Only show categories that have images ── */
  const visibleCategories = useMemo(() => {
    const presentCats = new Set(fullGallery.map(it => it.category));
    return ALL_CATEGORIES.filter(
      cat => cat.id === 'all' || presentCats.has(cat.id)
    );
  }, [fullGallery]);

  /* ── Bounded active index ── */
  const safeIdx     = Math.min(activeIdx, Math.max(0, filteredGallery.length - 1));
  const currentItem = filteredGallery[safeIdx] || fullGallery[0] || FALLBACK_GALLERY[0];

  /* ── Navigation ── */
  const goTo = useCallback((idx) => {
    setActiveIdx(idx);
    setImgKey(k => k + 1);
  }, []);

  const handlePrev = useCallback(() => {
    goTo(safeIdx > 0 ? safeIdx - 1 : filteredGallery.length - 1);
  }, [safeIdx, filteredGallery.length, goTo]);

  const handleNext = useCallback(() => {
    goTo(safeIdx < filteredGallery.length - 1 ? safeIdx + 1 : 0);
  }, [safeIdx, filteredGallery.length, goTo]);

  /* ── Keyboard nav ── */
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft')  handlePrev();
      if (e.key === 'Escape')     { setLightboxOpen(false); setLbZoomed(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, handleNext, handlePrev]);

  /* ── Lock body scroll ── */
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = lightboxOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxOpen]);

  /* ── Touch swipe ── */
  const touchStartX = useRef(null);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? handleNext() : handlePrev(); }
    touchStartX.current = null;
  };

  /* ── Category change ── */
  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setActiveIdx(0);
    setImgKey(k => k + 1);
  };

  /* ── Image error fallback ── */
  const onImgError = (e) => {
    if (e.currentTarget.src !== FALLBACK_URL) {
      e.currentTarget.src = FALLBACK_URL;
    }
  };

  /* ── Share ── */
  const handleShare = () => {
    if (navigator?.share) {
      navigator.share({ title: propertyTitle, url: window.location.href }).catch(() => {});
    } else if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  };

  /* ── Thumb dimensions ── */
  const thumbW = isMobile ? 68 : isTablet ? 74 : 80;
  const thumbH = isMobile ? 52 : isTablet ? 56 : 62;

  /* ══════════════════════════════════════════════════════════
     JSX
  ══════════════════════════════════════════════════════════ */
  return (
    <div
      className={`pg-root ${className}`}
      style={{
        background:    '#0A1220',
        borderRadius:  isMobile ? '16px' : '22px',
        border:        '1px solid rgba(212,175,55,0.2)',
        boxShadow:     '0 24px 64px rgba(0,0,0,0.65)',
        overflow:      'hidden',
      }}
    >

      {/* ── MAIN GRID: [thumb rail] [stage] ── */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: isMobile ? '1fr' : `${thumbW + 20}px 1fr`,
      }}>

        {/* ── DESKTOP VERTICAL THUMBNAIL RAIL ── */}
        {!isMobile && (
          <div
            className="pg-thumb-rail"
            style={{
              display:    'flex',
              flexDirection: 'column',
              gap:        '8px',
              padding:    '16px 0 16px 16px',
              maxHeight:  '540px',
              overflowY:  'auto',
              overflowX:  'hidden',
              background: 'rgba(5,10,18,0.6)',
              borderRight:'1px solid rgba(212,175,55,0.12)',
            }}
          >
            {filteredGallery.map((item, idx) => {
              const active = idx === safeIdx;
              return (
                <button
                  key={`dt-${idx}-${item.url}`}
                  className="pg-thumb"
                  onClick={() => goTo(idx)}
                  aria-label={`View ${item.title}`}
                  title={item.title}
                  style={{
                    width:      `${thumbW}px`,
                    height:     `${thumbH}px`,
                    borderRadius:'8px',
                    overflow:   'hidden',
                    border:     active ? '2px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)',
                    padding:    0,
                    cursor:     'pointer',
                    opacity:    active ? 1 : 0.62,
                    filter:     active ? 'brightness(1.1)' : 'brightness(0.72)',
                    flexShrink: 0,
                    background: '#0F1C2E',
                    boxShadow:  active ? '0 0 0 1px rgba(212,175,55,0.3)' : 'none',
                  }}
                >
                  <img
                    src={item.url}
                    alt={item.alt}
                    onError={onImgError}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* ── MAIN CINEMATIC STAGE ── */}
        <div
          style={{ position: 'relative', overflow: 'hidden' }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Aspect-ratio wrapper */}
          <div style={{
            position:   'relative',
            aspectRatio: isMobile ? '4/3' : '16/10',
            maxHeight:  isMobile ? '62vh' : '540px',
            background: '#050A12',
            overflow:   'hidden',
          }}>

            {/* Main Image */}
            <img
              key={imgKey}
              className="pg-main-img pg-img-fade"
              src={currentItem.url}
              alt={currentItem.alt}
              onError={onImgError}
              onClick={() => setLightboxOpen(true)}
              loading="eager"
              style={{
                width:     '100%',
                height:    '100%',
                objectFit: 'cover',
                display:   'block',
                cursor:    'zoom-in',
              }}
            />

            {/* Gradient overlay */}
            <div style={{
              position:      'absolute',
              inset:         0,
              background:    `
                linear-gradient(to bottom, rgba(5,10,18,0.55) 0%, transparent 30%),
                linear-gradient(to top,    rgba(5,10,18,0.88) 0%, transparent 42%)
              `,
              pointerEvents: 'none',
            }} />

            {/* ── TOP-LEFT: PREMIUM RESIDENTIAL PILL ── */}
            <div style={{
              position:       'absolute',
              top:            '16px',
              left:           '16px',
              display:        'flex',
              alignItems:     'center',
              gap:            '6px',
              background:     'rgba(5,10,18,0.82)',
              backdropFilter: 'blur(10px)',
              border:         '1px solid rgba(212,175,55,0.45)',
              borderRadius:   '100px',
              padding:        '5px 14px 5px 10px',
              color:          '#F3E5AB',
              fontSize:       '0.67rem',
              fontWeight:     800,
              letterSpacing:  '0.09em',
              textTransform:  'uppercase',
              zIndex:         4,
            }}>
              <Shield size={11} color="#D4AF37" />
              PREMIUM RESIDENTIAL
            </div>

            {/* ── TOP-RIGHT: PHOTO COUNT BUTTON ── */}
            <button
              className="pg-photo-count"
              onClick={() => setLightboxOpen(true)}
              aria-label={`Open gallery — ${fullGallery.length} photos`}
              style={{
                position:       'absolute',
                top:            '16px',
                right:          '16px',
                display:        'flex',
                alignItems:     'center',
                gap:            '6px',
                background:     'rgba(5,10,18,0.82)',
                backdropFilter: 'blur(10px)',
                border:         '1px solid rgba(212,175,55,0.45)',
                borderRadius:   '100px',
                padding:        '5px 12px 5px 10px',
                color:          '#FFF',
                fontSize:       '0.72rem',
                fontWeight:     800,
                letterSpacing:  '0.04em',
                cursor:         'pointer',
                zIndex:         4,
              }}
            >
              <Camera size={13} color="#D4AF37" />
              <span>{fullGallery.length} PHOTOS</span>
              <ChevronRight size={13} color="#D4AF37" />
            </button>

            {/* ── BOTTOM-LEFT: CATEGORY LABEL + IMAGE TITLE ── */}
            <div style={{
              position:  'absolute',
              bottom:    '18px',
              left:      '18px',
              display:   'flex',
              flexDirection: 'column',
              gap:       '5px',
              maxWidth:  isMobile ? '58%' : '52%',
              zIndex:    4,
            }}>
              <span style={{
                display:        'inline-flex',
                alignItems:     'center',
                background:     'linear-gradient(135deg, rgba(212,175,55,0.45), rgba(212,175,55,0.25))',
                backdropFilter: 'blur(8px)',
                border:         '1px solid rgba(212,175,55,0.7)',
                borderRadius:   '6px',
                padding:        '4px 10px',
                color:          '#FFF',
                fontSize:       '0.65rem',
                fontWeight:     800,
                letterSpacing:  '0.14em',
                textTransform:  'uppercase',
                width:          'fit-content',
                textShadow:     '0 1px 4px rgba(0,0,0,0.8)',
                boxShadow:      '0 2px 8px rgba(0,0,0,0.4)',
              }}>
                {(currentItem.category || 'EXTERIOR').toUpperCase()}
              </span>
              <p style={{
                margin:     0,
                color:      '#FFF',
                fontSize:   isMobile ? '0.8rem' : '0.95rem',
                fontWeight: 700,
                fontFamily: "'Cinzel', serif",
                textShadow: '0 2px 12px rgba(0,0,0,0.9)',
                lineHeight: 1.3,
                display:    '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow:   'hidden',
              }}>
                {currentItem.title}
              </p>
            </div>

            {/* ── BOTTOM-CENTER: WATCH PROPERTY VIDEO BUTTON ── */}
            {hasVideo && !isMobile && (
              <button
                className="pg-video-btn"
                onClick={onOpenInquiry}
                aria-label="Watch property video"
                style={{
                  position:       'absolute',
                  bottom:         '18px',
                  left:           '50%',
                  transform:      'translateX(-50%)',
                  display:        'flex',
                  alignItems:     'center',
                  gap:            '10px',
                  background:     'rgba(5,10,18,0.78)',
                  backdropFilter: 'blur(14px)',
                  border:         '1px solid rgba(212,175,55,0.55)',
                  borderRadius:   '50px',
                  padding:        '10px 22px',
                  color:          '#FFF',
                  fontSize:       '0.74rem',
                  fontWeight:     800,
                  letterSpacing:  '0.05em',
                  cursor:         'pointer',
                  boxShadow:      '0 8px 24px rgba(0,0,0,0.6)',
                  whiteSpace:     'nowrap',
                  zIndex:         4,
                }}
              >
                <div style={{
                  width:          '26px',
                  height:         '26px',
                  borderRadius:   '50%',
                  background:     'linear-gradient(135deg, #D4AF37, #F3E5AB)',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  flexShrink:     0,
                }}>
                  <Play size={12} fill="#09111F" color="#09111F" style={{ marginLeft: '2px' }} />
                </div>
                WATCH PROPERTY VIDEO
              </button>
            )}

            {/* ── PREV / NEXT ARROWS ── */}
            {filteredGallery.length > 1 && (
              <>
                <button
                  className="pg-nav-btn"
                  onClick={handlePrev}
                  aria-label="Previous image"
                  style={{
                    position:       'absolute',
                    left:           isMobile ? '10px' : '16px',
                    top:            '50%',
                    transform:      'translateY(-50%)',
                    width:          isMobile ? '36px' : '42px',
                    height:         isMobile ? '36px' : '42px',
                    borderRadius:   '50%',
                    background:     'rgba(5,10,18,0.72)',
                    border:         '1px solid rgba(255,255,255,0.18)',
                    color:          '#D4AF37',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    cursor:         'pointer',
                    backdropFilter: 'blur(8px)',
                    zIndex:         5,
                  }}
                >
                  <ChevronLeft size={isMobile ? 18 : 20} />
                </button>
                <button
                  className="pg-nav-btn"
                  onClick={handleNext}
                  aria-label="Next image"
                  style={{
                    position:       'absolute',
                    right:          isMobile ? '10px' : '16px',
                    top:            '50%',
                    transform:      'translateY(-50%)',
                    width:          isMobile ? '36px' : '42px',
                    height:         isMobile ? '36px' : '42px',
                    borderRadius:   '50%',
                    background:     'rgba(5,10,18,0.72)',
                    border:         '1px solid rgba(255,255,255,0.18)',
                    color:          '#D4AF37',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    cursor:         'pointer',
                    backdropFilter: 'blur(8px)',
                    zIndex:         5,
                  }}
                >
                  <ChevronRight size={isMobile ? 18 : 20} />
                </button>
              </>
            )}

            {/* ── MOBILE: Floating image counter ── */}
            {isMobile && filteredGallery.length > 1 && (
              <div style={{
                position:       'absolute',
                bottom:         '12px',
                right:          '12px',
                background:     'rgba(5,10,18,0.78)',
                backdropFilter: 'blur(8px)',
                border:         '1px solid rgba(212,175,55,0.35)',
                borderRadius:   '100px',
                padding:        '3px 10px',
                color:          '#F3E5AB',
                fontSize:       '0.7rem',
                fontWeight:     800,
                zIndex:         4,
              }}>
                {String(safeIdx + 1).padStart(2, '0')} / {String(filteredGallery.length).padStart(2, '0')}
              </div>
            )}

          </div>{/* end aspect-ratio wrapper */}

          {/* ── MOBILE: Horizontal thumb strip ── */}
          {isMobile && (
            <div
              className="pg-thumb-rail"
              style={{
                display:   'flex',
                flexDirection: 'row',
                gap:       '8px',
                padding:   '10px 14px',
                overflowX: 'auto',
                overflowY: 'hidden',
                background:'rgba(5,10,18,0.6)',
                borderTop: '1px solid rgba(212,175,55,0.1)',
              }}
            >
              {filteredGallery.slice(0, 12).map((item, idx) => {
                const active = idx === safeIdx;
                return (
                  <button
                    key={`mob-${idx}`}
                    className="pg-thumb"
                    onClick={() => goTo(idx)}
                    aria-label={`View ${item.title}`}
                    style={{
                      width:        `${thumbW}px`,
                      height:       `${thumbH}px`,
                      borderRadius: '7px',
                      overflow:     'hidden',
                      border:       active ? '2px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)',
                      padding:      0,
                      cursor:       'pointer',
                      opacity:      active ? 1 : 0.62,
                      filter:       active ? 'brightness(1.1)' : 'brightness(0.72)',
                      flexShrink:   0,
                      background:   '#0F1C2E',
                    }}
                  >
                    <img
                      src={item.url}
                      alt={item.alt}
                      onError={onImgError}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </button>
                );
              })}
            </div>
          )}

        </div>{/* end stage column */}

      </div>{/* end main grid */}

      {/* ── MOBILE: FLOATING ACTION BAR ── */}
      {isMobile && (
        <div style={{
          display: 'flex',
          gap:     '10px',
          padding: '12px 14px 4px',
          background: 'rgba(5,10,18,0.5)',
        }}>
          <button
            onClick={() => setLightboxOpen(true)}
            aria-label={`Open gallery — ${fullGallery.length} photos`}
            style={{
              flex:           1,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            '6px',
              padding:        '10px',
              borderRadius:   '50px',
              background:     'rgba(255,255,255,0.06)',
              border:         '1px solid rgba(212,175,55,0.35)',
              color:          '#FFF',
              fontSize:       '0.79rem',
              fontWeight:     700,
              cursor:         'pointer',
            }}
          >
            <Camera size={14} color="#D4AF37" />
            {fullGallery.length} Photos
          </button>
          {hasVideo && (
            <button
              onClick={onOpenInquiry}
              aria-label="Watch property video"
              style={{
                flex:           1,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            '6px',
                padding:        '10px',
                borderRadius:   '50px',
                background:     'linear-gradient(135deg, #D4AF37, #C9A227)',
                border:         'none',
                color:          '#09111F',
                fontSize:       '0.79rem',
                fontWeight:     800,
                cursor:         'pointer',
              }}
            >
              <Play size={14} fill="#09111F" color="#09111F" />
              Watch Video
            </button>
          )}
        </div>
      )}

      {/* ── CATEGORY FILTER TABS ── */}
      <div
        className="pg-cat-bar"
        style={{
          display:   'flex',
          gap:       '6px',
          padding:   isMobile ? '12px 14px 14px' : '14px 20px 16px',
          overflowX: 'auto',
          whiteSpace:'nowrap',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          background:'rgba(5,10,18,0.4)',
        }}
      >
        {visibleCategories.map(cat => {
          const active = activeCategory === cat.id;
          const count  = cat.id === 'all'
            ? fullGallery.length
            : fullGallery.filter(it => it.category === cat.id).length;
          return (
            <button
              key={cat.id}
              className="pg-cat-btn"
              onClick={() => handleCategoryChange(cat.id)}
              aria-label={`Filter by ${cat.label}`}
              aria-pressed={active}
              style={{
                display:      'inline-flex',
                alignItems:   'center',
                gap:          '5px',
                padding:      isMobile ? '7px 14px' : '8px 18px',
                borderRadius: '50px',
                background:   active
                  ? 'linear-gradient(135deg, #D4AF37, #C9A227)'
                  : 'rgba(255,255,255,0.04)',
                color:        active ? '#09111F' : '#A0AEC0',
                border:       active ? 'none' : '1px solid rgba(255,255,255,0.1)',
                fontFamily:   "'Montserrat', sans-serif",
                fontSize:     isMobile ? '0.74rem' : '0.78rem',
                fontWeight:   active ? 800 : 600,
                cursor:       'pointer',
                flexShrink:   0,
              }}
            >
              {cat.label}
              <span style={{
                background:  active ? 'rgba(9,17,31,0.25)' : 'rgba(255,255,255,0.08)',
                borderRadius:'100px',
                padding:     '1px 6px',
                fontSize:    '0.65rem',
                fontWeight:  800,
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════
          FULLSCREEN LUXURY LIGHTBOX MODAL
      ══════════════════════════════════════════════════════════ */}
      {lightboxOpen && (
        <div
          className="pg-lightbox"
          style={{
            position:       'fixed',
            inset:          0,
            zIndex:         99999,
            background:     'rgba(3,7,14,0.97)',
            backdropFilter: 'blur(24px)',
            display:        'flex',
            flexDirection:  'column',
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >

          {/* ── TOP BAR ── */}
          <div style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            padding:        isMobile ? '14px 16px' : '18px 32px',
            borderBottom:   '1px solid rgba(255,255,255,0.08)',
            background:     'rgba(5,10,18,0.9)',
            flexShrink:     0,
          }}>
            {/* Property info */}
            <div>
              <div style={{
                color:      '#FFF',
                fontSize:   isMobile ? '0.9rem' : '1.05rem',
                fontWeight: 700,
                fontFamily: "'Cinzel', serif",
              }}>
                {propertyTitle}
              </div>
              <div style={{
                color:      '#D4AF37',
                fontSize:   '0.72rem',
                fontWeight: 600,
                marginTop:  '2px',
              }}>
                {propertyLocation}
              </div>
            </div>

            {/* Counter pill */}
            <div style={{
              background:    'rgba(212,175,55,0.12)',
              border:        '1px solid rgba(212,175,55,0.35)',
              borderRadius:  '100px',
              padding:       '6px 18px',
              color:         '#F3E5AB',
              fontSize:      '0.84rem',
              fontWeight:    800,
              letterSpacing: '0.04em',
              fontFamily:    "'Montserrat', sans-serif",
            }}>
              {String(safeIdx + 1).padStart(2, '0')} / {String(filteredGallery.length).padStart(2, '0')}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px' }}>
              {!isMobile && (
                <button
                  onClick={() => setLbZoomed(z => !z)}
                  aria-label={lbZoomed ? 'Zoom out' : 'Zoom in'}
                  style={{
                    background: 'none',
                    border:     'none',
                    color:      lbZoomed ? '#D4AF37' : '#718096',
                    cursor:     'pointer',
                    padding:    '6px',
                    display:    'flex',
                    alignItems: 'center',
                  }}
                >
                  {lbZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
                </button>
              )}
              <button
                onClick={handleShare}
                aria-label="Share property"
                style={{
                  background: 'none',
                  border:     'none',
                  color:      '#718096',
                  cursor:     'pointer',
                  padding:    '6px',
                  display:    'flex',
                  alignItems: 'center',
                }}
              >
                <Share2 size={18} />
              </button>
              <button
                className="pg-close-btn"
                onClick={() => { setLightboxOpen(false); setLbZoomed(false); }}
                aria-label="Close gallery"
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  width:          '36px',
                  height:         '36px',
                  borderRadius:   '50%',
                  background:     'rgba(255,255,255,0.1)',
                  border:         '1px solid rgba(255,255,255,0.2)',
                  color:          '#FFF',
                  cursor:         'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* ── IMAGE CANVAS ── */}
          <div style={{
            flex:           1,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            padding:        isMobile ? '12px 52px' : '24px 100px',
            position:       'relative',
            overflow:       'hidden',
          }}>
            <img
              key={`lb-${imgKey}`}
              className="pg-img-fade"
              src={currentItem.url}
              alt={currentItem.alt}
              onError={onImgError}
              style={{
                maxWidth:     '100%',
                maxHeight:    '74vh',
                objectFit:    'contain',
                borderRadius: isMobile ? '10px' : '14px',
                boxShadow:    '0 30px 80px rgba(0,0,0,0.9)',
                transform:    lbZoomed ? 'scale(1.5)' : 'scale(1)',
                transition:   'transform 0.35s ease',
                cursor:       lbZoomed ? 'zoom-out' : 'zoom-in',
              }}
              onClick={() => setLbZoomed(z => !z)}
            />

            {/* Prev / Next */}
            {filteredGallery.length > 1 && (
              <>
                <button
                  className="pg-nav-btn-lb"
                  onClick={handlePrev}
                  aria-label="Previous photo"
                  style={{
                    position:       'absolute',
                    left:           isMobile ? '8px' : '24px',
                    top:            '50%',
                    transform:      'translateY(-50%)',
                    width:          isMobile ? '40px' : '52px',
                    height:         isMobile ? '40px' : '52px',
                    borderRadius:   '50%',
                    background:     'rgba(5,10,18,0.82)',
                    border:         '1px solid rgba(212,175,55,0.35)',
                    color:          '#D4AF37',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    cursor:         'pointer',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <ChevronLeft size={isMobile ? 20 : 26} />
                </button>
                <button
                  className="pg-nav-btn-lb"
                  onClick={handleNext}
                  aria-label="Next photo"
                  style={{
                    position:       'absolute',
                    right:          isMobile ? '8px' : '24px',
                    top:            '50%',
                    transform:      'translateY(-50%)',
                    width:          isMobile ? '40px' : '52px',
                    height:         isMobile ? '40px' : '52px',
                    borderRadius:   '50%',
                    background:     'rgba(5,10,18,0.82)',
                    border:         '1px solid rgba(212,175,55,0.35)',
                    color:          '#D4AF37',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    cursor:         'pointer',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <ChevronRight size={isMobile ? 20 : 26} />
                </button>
              </>
            )}
          </div>

          {/* ── BOTTOM CAPTION ── */}
          <div style={{
            padding:    isMobile ? '14px 16px' : '16px 32px',
            background: 'rgba(5,10,18,0.9)',
            borderTop:  '1px solid rgba(255,255,255,0.07)',
            textAlign:  'center',
            flexShrink: 0,
          }}>
            <div style={{
              color:         '#D4AF37',
              fontSize:      '0.68rem',
              fontWeight:    800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom:  '4px',
            }}>
              {(currentItem.category || 'Exterior').toUpperCase()} &bull; {propertyTitle}
            </div>
            <div style={{
              color:      '#E2E8F0',
              fontSize:   isMobile ? '0.86rem' : '0.98rem',
              fontWeight: 600,
              fontFamily: "'Montserrat', sans-serif",
            }}>
              {currentItem.title}
            </div>
          </div>

          {/* ── DESKTOP: LIGHTBOX THUMBNAIL STRIP ── */}
          {!isMobile && filteredGallery.length > 1 && (
            <div style={{
              display:        'flex',
              gap:            '8px',
              padding:        '12px 32px 16px',
              overflowX:      'auto',
              background:     'rgba(5,10,18,0.85)',
              borderTop:      '1px solid rgba(255,255,255,0.06)',
              flexShrink:     0,
              justifyContent: filteredGallery.length <= 10 ? 'center' : 'flex-start',
            }}>
              {filteredGallery.map((item, idx) => {
                const active = idx === safeIdx;
                return (
                  <button
                    key={`lb-t-${idx}`}
                    className="pg-thumb"
                    onClick={() => goTo(idx)}
                    aria-label={`Jump to ${item.title}`}
                    style={{
                      width:        '64px',
                      height:       '46px',
                      borderRadius: '6px',
                      overflow:     'hidden',
                      border:       active ? '2px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)',
                      padding:      0,
                      cursor:       'pointer',
                      opacity:      active ? 1 : 0.52,
                      filter:       active ? 'brightness(1.1)' : 'brightness(0.68)',
                      flexShrink:   0,
                      background:   '#0A1220',
                    }}
                  >
                    <img
                      src={item.url}
                      alt={item.alt}
                      onError={onImgError}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </button>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
