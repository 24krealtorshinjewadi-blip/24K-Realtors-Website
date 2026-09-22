import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  ShieldCheck, 
  Sliders, 
  Heart, 
  ArrowRight, 
  FileText,
  Building2,
  Building,
  Home,
  Leaf,
  Star,
  Sparkles,
  Landmark,
  Trophy,
  Share2,
  Sun
} from 'lucide-react';

const getForbesTeslaPropertyImage = (property) => {
  if (property.imageUrl && !property.imageUrl.includes('unsplash.com')) {
    return property.imageUrl;
  }
  const title = (property.title || '').toLowerCase();

  if (title.includes('opula')) return '/dev_kolte_patil_township.png';
  if (title.includes('office') || title.includes('plaza') || title.includes('commercial')) return '/lodha_4_grand_lobby.png';
  if (title.includes('balewadi') || title.includes('retail')) return '/gallery_vj_supernova_tower.png';
  if (title.includes('glitterati') || title.includes('penthouse')) return '/lodha_7_infinity_pool.png';
  if (title.includes('mahalunge') || title.includes('oasis')) return '/gallery_tower_3.png';
  if (title.includes('studio') || title.includes('corporate')) return '/dev_vj_building.png';
  if (title.includes('sangria')) return '/sangria_living_room.jpg';
  if (title.includes('megapolis')) return '/megapolis_hero_card.jpg';
  if (title.includes('godrej 24') || title === 'godrej 24') return '/godrej_24_project_card.jpg';
  if (title.includes('elements') || title.includes('godrej elements')) return '/godrej_elements_project_card.jpg';
  if (title.includes('cliff') || title.includes('clip') || title.includes('tcg')) return '/properties/tcg-the-cliff-garden/00_project_card.jpg';
  if (title.includes('crown')) return '/gallery_tower_2.png';
  if (title.includes('kasturi') || title.includes('apostle')) return '/dev_kasturi_forbes.png';
  if (title.includes('republic') || title.includes('life republic')) return '/dev_kolte_patil_township.png';
  if (title.includes('gera') || title.includes('joy')) return '/dev_gera_tower.png';
  if (title.includes('pride') || title.includes('landmark')) return '/gallery_tower_3.png';
  if (title.includes('sportsville')) return '/dev_kohinoor_tower.png';
  if (title.includes('blue waters') || title.includes('bluewater') || title.includes('vtp')) return '/properties/vtp-blue-waters/01_elevation.png';
  if (title.includes('vyomora') || title.includes('joyville')) return '/dev_shapoorji_township.png';
  if (title.includes('yashwin') || title.includes('vj')) return '/dev_vj_building.png';
  if (title.includes('sportsville') || title.includes('kohinoor')) return '/kohinoor_hero_card.jpg';
  if (title.includes('belmondo') || title.includes('lodha')) return '/lodha_3_completed_aerial.png';
  if (title.includes('rohan')) return '/dev_rohan_forbes.png';
  if (title.includes('pharande') || title.includes('puneville')) return '/dev_pharande_building.png';

  const fallbacks = [
    '/dev_kolte_patil_township.png',
    '/dev_godrej_building.png',
    '/dev_vj_building.png',
    '/dev_lodha_tower.png',
    '/dev_vtp_township.png',
    '/dev_shapoorji_township.png',
    '/dev_kasturi_forbes.png',
    '/dev_rohan_forbes.png',
    '/dev_pharande_building.png',
    '/dev_kohinoor_tower.png',
    '/dev_gera_tower.png',
    '/dev_paranjape_township.png'
  ];
  const numId = typeof property.id === 'number' ? property.id : (property.id ? property.id.length : 0);
  return fallbacks[numId % fallbacks.length];
};

const getBuilderName = (title = '', desc = '') => {
  const t = ((title || '') + ' ' + (desc || '')).toLowerCase();
  if (t.includes('megapolis') || t.includes('sangria') || t.includes('pride purple')) return 'Pride Purple Group';
  if (t.includes('lodha')) return 'Lodha Group';
  if (t.includes('godrej')) return 'Godrej Properties';
  if (t.includes('vtp')) return 'VTP Realty';
  if (t.includes('kolte') || t.includes('24k')) return 'Kolte Patil Developers';
  if (t.includes('shapoorji') || t.includes('joyville')) return 'Shapoorji Pallonji';
  if (t.includes('gera')) return 'Gera Developments';
  if (t.includes('nyati')) return 'Nyati Group';
  if (t.includes('kasturi')) return 'Kasturi Housing';
  if (t.includes('kohinoor')) return 'Kohinoor Group';
  if (t.includes('paranjape')) return 'Paranjape Schemes';
  if (t.includes('pharande')) return 'Pharande Spaces';
  if (t.includes('rohan')) return 'Rohan Builders';
  if (t.includes('yashone') || t.includes('vj') || t.includes('vilas')) return 'Vilas Javdekar Developers';
  if (t.includes('tcg') || t.includes('cliff') || t.includes('clip')) return 'TCG Real Estate';
  return 'Premium Developer';
};

const formatCorridorLabel = (loc) => {
  if (!loc) return 'Hinjewadi, Pune';
  const mapping = {
    'HINJEWADI_PHASE_1': 'Hinjewadi Phase 1, Pune',
    'HINJEWADI_PHASE_2': 'Hinjewadi Phase 2, Pune',
    'HINJEWADI_PHASE_3': 'Hinjewadi Phase 3, Pune',
    'HINJEWADI': 'Hinjewadi, Pune',
    'MAHALUNGE': 'Mahalunge, Pune',
    'WAKAD': 'Wakad, Pune',
    'BANER': 'Baner, Pune',
    'BALEWADI': 'Balewadi, Pune',
    'TATHAWADE': 'Tathawade, Pune',
    'KHARADI': 'Kharadi, Pune'
  };
  return mapping[loc] || `${loc.replace(/_/g, ' ')}, Pune`;
};

const formatSubtitleCorridor = (loc, title = '') => {
  const t = title.toLowerCase();
  if (t.includes('phase 3') || loc === 'HINJEWADI_PHASE_3') return 'HINJEWADI PHASE 3';
  if (t.includes('phase 2') || loc === 'HINJEWADI_PHASE_2') return 'HINJEWADI PHASE 2';
  if (t.includes('phase 1') || loc === 'HINJEWADI_PHASE_1') return 'HINJEWADI PHASE 1';
  if (loc) return loc.replace(/_/g, ' ').toUpperCase();
  return 'HINJEWADI PHASE 1';
};

const formatCardPrice = (p, transactionType, propertyTitle = '') => {
  const t = (propertyTitle || '').toLowerCase();
  if (!p || p === 0 || p === '0') {
    if (t.includes('godrej 24') || t.includes('elements') || t.includes('yashone')) {
      return { main: '₹68 Lakhs*', suffix: 'Onwards' };
    }
    if (t.includes('megapolis')) {
      return { main: '₹65 Lakhs*', suffix: 'Onwards' };
    }
    if (t.includes('cliff') || t.includes('clip') || t.includes('tcg')) {
      return { main: '₹55 Lakhs*', suffix: '(Negotiable)' };
    }
    if (t.includes('blue waters') || t.includes('bluewater') || t.includes('vtp')) {
      return { main: '₹72 Lakhs*', suffix: '(Negotiable)' };
    }
    return { main: 'Price on Request', suffix: '' };
  }

  if (typeof p === 'string') {
    if (p.includes('Lakh') || p.includes('Cr') || p.includes('₹')) {
      return { main: p, suffix: 'Onwards' };
    }
  }

  const num = Number(String(p).replace(/[^0-9.]/g, ''));
  if (isNaN(num) || num <= 0) {
    return { main: 'Price on Request', suffix: '' };
  }

  if (transactionType === 'RENT') {
    return {
      main: num >= 100000 ? `₹${(num / 100000).toFixed(2)} L` : `₹${num.toLocaleString('en-IN')}`,
      suffix: '/month'
    };
  }

  if (num >= 10000000) {
    return { main: `₹${(num / 10000000).toFixed(2)} Cr*`, suffix: 'Onwards' };
  }
  if (num >= 100000) {
    const isNeg = t.includes('cliff') || t.includes('clip') || t.includes('tcg') || t.includes('blue water') || t.includes('bluewater') || t.includes('vtp');
    return { main: `₹${Math.round(num / 100000)} Lakhs*`, suffix: isNeg ? '(Negotiable)' : 'Onwards' };
  }
  return { main: `₹${num.toLocaleString('en-IN')}`, suffix: 'Onwards' };
};

// Authentic Developer Brand Logo / Wordmark Renderer
const DeveloperBrandMark = ({ builderName = '', title = '' }) => {
  const b = (builderName + ' ' + title).toLowerCase();

  if (b.includes('godrej')) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ 
          fontFamily: "'Playfair Display', Georgia, serif", 
          fontStyle: 'italic', 
          fontWeight: 700, 
          fontSize: '1rem', 
          color: '#E2E8F0',
          letterSpacing: '0.02em' 
        }}>
          Godrej
        </span>
        <span style={{ height: '12px', width: '1px', background: 'rgba(255,255,255,0.3)' }}></span>
        <span style={{ fontSize: '0.52rem', letterSpacing: '0.12em', fontWeight: 800, color: '#94A3B8' }}>
          PROPERTIES
        </span>
      </div>
    );
  }

  if (b.includes('pride') || b.includes('megapolis')) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="3.5" fill="#D4AF37" />
          <path 
            d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" 
            stroke="#D4AF37" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
          />
        </svg>
        <span style={{ fontSize: '0.56rem', fontWeight: 800, letterSpacing: '0.08em', color: '#D4AF37' }}>
          PRIDE PURPLE
        </span>
      </div>
    );
  }

  if (b.includes('vj') || b.includes('yashone') || b.includes('vilas')) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ 
          fontFamily: "'Cinzel', 'Playfair Display', serif", 
          fontWeight: 900, 
          fontSize: '1.05rem', 
          color: '#FFFFFF', 
          letterSpacing: '-0.04em' 
        }}>
          VJ
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontSize: '0.5rem', fontWeight: 800, letterSpacing: '0.06em', color: '#E2E8F0' }}>VILAS</span>
          <span style={{ fontSize: '0.46rem', fontWeight: 600, letterSpacing: '0.05em', color: '#94A3B8' }}>JAVDEKAR</span>
        </div>
      </div>
    );
  }

  if (b.includes('kohinoor') || b.includes('sportsville')) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#C53030" />
          <path d="M7 6v12M17 6l-6 6 6 6" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontSize: '0.52rem', fontWeight: 900, letterSpacing: '0.06em', color: '#FFFFFF' }}>KOHINOOR</span>
          <span style={{ fontSize: '0.44rem', fontWeight: 700, letterSpacing: '0.08em', color: '#FEB2B2' }}>SPORTSVILLE</span>
        </div>
      </div>
    );
  }

  if (b.includes('tcg') || b.includes('cliff') || b.includes('clip')) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ 
          fontFamily: "'Cinzel', 'Playfair Display', serif", 
          fontWeight: 900, 
          fontSize: '0.98rem', 
          color: '#10B981', 
          letterSpacing: '0.04em' 
        }}>
          TCG
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontSize: '0.48rem', fontWeight: 800, letterSpacing: '0.08em', color: '#E2E8F0' }}>REAL</span>
          <span style={{ fontSize: '0.44rem', fontWeight: 600, letterSpacing: '0.06em', color: '#6EE7B7' }}>ESTATE</span>
        </div>
      </div>
    );
  }

  if (b.includes('vtp') || b.includes('blue waters') || b.includes('bluewater')) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ 
          fontFamily: "'Cinzel', 'Playfair Display', serif", 
          fontWeight: 900, 
          fontSize: '1.02rem', 
          color: '#38BDF8', 
          letterSpacing: '0.04em' 
        }}>
          VTP
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontSize: '0.48rem', fontWeight: 800, letterSpacing: '0.08em', color: '#E2E8F0' }}>REALTY</span>
          <span style={{ fontSize: '0.42rem', fontWeight: 600, letterSpacing: '0.06em', color: '#7DD3FC' }}>PUNE NO. 1</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ 
        fontSize: '0.56rem', 
        fontWeight: 700, 
        letterSpacing: '0.06em', 
        color: '#D4AF37', 
        border: '1px solid rgba(212,175,55,0.35)', 
        padding: '2px 5px', 
        borderRadius: '3px' 
      }}>
        VERIFIED
      </span>
    </div>
  );
};

// Tagline overlay on the hero image
const getImageTagline = (property) => {
  const t = (property.title || '').toLowerCase();
  if (t.includes('godrej 24')) return 'LUXURY LIVING IN HINJEWADI';
  if (t.includes('elements')) return 'ELEVATE EVERYDAY LIVING';
  if (t.includes('megapolis')) return 'MEGAPOLIS\nA WORLD WITHIN';
  if (t.includes('yashone') || t.includes('vj')) return 'MODERN HOMES\nBRIGHTER TOMORROWS';
  if (t.includes('sportsville') || t.includes('kohinoor')) return 'MORE THAN A HOME\nA HEALTHIER TOMORROW';
  if (t.includes('cliff') || t.includes('clip') || t.includes('tcg')) return 'PANORAMIC HILLSIDE LIVING\nHINJEWADI PHASE 3';
  if (t.includes('blue waters') || t.includes('bluewater') || t.includes('vtp')) return '100+ ACRE RIVERSIDE TOWNSHIP\nMAHALUNGE-HINJEWADI';
  if (property.tagline) return property.tagline;
  return 'PREMIUM HOMES • BETTER LIVING';
};

// 3 Key Feature Highlights (Icon + Label) matching exact screenshot aesthetics
const getCardHighlights = (property) => {
  const t = (property.title || '').toLowerCase();

  if (t.includes('godrej 24')) {
    return [
      { icon: Building2, line1: 'Modern', line2: 'Amenities' },
      { icon: MapPin, line1: 'Prime', line2: 'Location' },
      { icon: ShieldCheck, line1: 'Trusted', line2: 'Developer' }
    ];
  }

  if (t.includes('elements')) {
    return [
      { icon: Home, line1: 'Clubhouse', line2: '' },
      { icon: Leaf, line1: 'Green', line2: 'Spaces' },
      { icon: Star, line1: 'Lifestyle', line2: 'Amenities' }
    ];
  }

  if (t.includes('megapolis')) {
    return [
      { icon: Landmark, line1: 'Integrated', line2: 'Township' },
      { icon: Trophy, line1: 'World Class', line2: 'Amenities' },
      { icon: Share2, line1: 'Great', line2: 'Connectivity' }
    ];
  }

  if (t.includes('yashone') || t.includes('vj')) {
    return [
      { icon: Sun, line1: 'Premium', line2: 'Design' },
      { icon: Building, line1: 'Urban', line2: 'Lifestyle' },
      { icon: MapPin, line1: 'Excellent', line2: 'Connectivity' }
    ];
  }

  if (t.includes('sportsville') || t.includes('kohinoor')) {
    return [
      { icon: Trophy, line1: 'Sports-Centric', line2: 'Living' },
      { icon: Home, line1: 'Clubhouse &', line2: 'Pool' },
      { icon: MapPin, line1: 'Prime', line2: 'Hinjewadi Ph 1' }
    ];
  }

  if (t.includes('cliff') || t.includes('clip') || t.includes('tcg')) {
    return [
      { icon: Building2, line1: '1 & 2 BHK', line2: 'Scenic Views' },
      { icon: ShieldCheck, line1: 'Triple MahaRERA', line2: 'Verified' },
      { icon: MapPin, line1: 'Hinjewadi', line2: 'Phase 3' }
    ];
  }

  if (t.includes('blue waters') || t.includes('bluewater') || t.includes('vtp')) {
    return [
      { icon: Building2, line1: '2 BHK (640 sq.ft)', line2: 'Scenic River View' },
      { icon: ShieldCheck, line1: 'Multi-RERA', line2: '6 Numbers Reg.' },
      { icon: MapPin, line1: 'Mahalunge', line2: 'Hinjewadi Annex' }
    ];
  }

  return [
    { icon: Building2, line1: 'Modern', line2: 'Amenities' },
    { icon: MapPin, line1: 'Prime', line2: 'Location' },
    { icon: ShieldCheck, line1: 'Verified', line2: 'Listing' }
  ];
};

export default function PropertyCard({ 
  property, 
  isHnwiMode, 
  isCompared, 
  isWishlisted,
  formatPrice, 
  onToggleCompare, 
  onToggleWishlist,
  onOpenDetail,
  onOpenRera,
  onOpenBrochure
}) {
  const navigate = useNavigate();
  const cardImgSrc = getForbesTeslaPropertyImage(property);
  const builderName = property.builderName || property.developer || property.builder?.name || getBuilderName(property.title, property.description);
  
  const isMegapolis = Boolean(
    (property.title || '').toLowerCase().includes('megapolis') || 
    (property.projectName || '').toLowerCase().includes('megapolis') ||
    property.id === 'prop-megapolis-township' ||
    (property.societySlug && property.societySlug.includes('megapolis'))
  );

  const priceObj = formatCardPrice(property?.price, property?.transactionType, property?.title);
  const imageTagline = getImageTagline(property);
  const highlights = getCardHighlights(property);
  const subtitleCorridor = formatSubtitleCorridor(property?.location, property?.title);
  const locationLabel = formatCorridorLabel(property?.location);

  const handleCardClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (isMegapolis && !property.title?.toLowerCase().includes('sangria')) {
      navigate('/townships/megapolis');
    } else if (property.societySlug) {
      const slug = property.societySlug.startsWith('/') ? property.societySlug : `/${property.societySlug}`;
      navigate(slug);
    } else if (onOpenDetail) {
      onOpenDetail(property);
    }
  };

  const whatsappInquiryMessage = encodeURIComponent(
    `Namaste 24K Realtors! 🏠\n\nI am interested in:\n📌 *${property.title}* — ${subtitleCorridor}\n📍 Location: ${locationLabel}\n🏢 Developer: ${builderName}\n💰 Price: ${priceObj.main} ${priceObj.suffix}\n🛡️ MahaRERA: ${property.reraNumber || 'Verified'}\n\nPlease share current pricing breakup, verified floor plans, and schedule a site visit.`
  );

  return (
    <div 
      className={`property-card premium-luxury-card ${isCompared ? 'compared-active' : ''}`}
      id={`property-${property.id}`}
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at top, #0A1322 0%, #050A14 100%)',
        border: '1px solid rgba(212, 175, 55, 0.28)',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s',
        cursor: 'pointer',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.55)',
        display: 'flex',
        flexDirection: 'column'
      }}
      onClick={handleCardClick}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.borderColor = 'rgba(230, 195, 92, 0.55)';
        e.currentTarget.style.boxShadow = '0 18px 45px rgba(0, 0, 0, 0.7), 0 0 25px rgba(212, 175, 55, 0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.28)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.55)';
      }}
    >
      {/* ── 1. Image Container with Badges & Tagline Overlay ── */}
      <div 
        className="property-image-container" 
        style={{ 
          position: 'relative', 
          height: '215px', 
          overflow: 'hidden' 
        }}
      >
        <img 
          src={cardImgSrc} 
          onError={e => { e.currentTarget.src = '/dev_kolte_patil_township.png'; }}
          sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 25vw"
          alt={`Exterior view of ${property.title}`} 
          loading="lazy" 
          decoding="async"
          className="card-main-image"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            objectPosition: (cardImgSrc.includes('kohinoor') || cardImgSrc.includes('sportsville')) ? 'center 12%' : (cardImgSrc.includes('godrej_24') || cardImgSrc.includes('elements') || cardImgSrc.includes('yashone')) ? 'center 32%' : (cardImgSrc.includes('tcg') || cardImgSrc.includes('cliff')) ? 'center 20%' : (cardImgSrc.includes('vtp') || cardImgSrc.includes('blue-waters')) ? 'center 35%' : 'center',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />

        {/* Ambient Dark Gradient Overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, rgba(4, 8, 16, 0.2) 30%, rgba(5, 10, 20, 0.65) 75%, #050A14 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }}></div>

        {/* Top-Left Transaction Tag (BUY) */}
        <span 
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: '#D4AF37',
            color: '#070C15',
            fontWeight: 800,
            fontSize: '0.68rem',
            padding: '4px 10px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            zIndex: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
        >
          {property.transactionType || 'BUY'}
        </span>

        {/* Top-Right Quick Actions (Wishlist Heart + Compare/Brochure) */}
        <div 
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            display: 'flex',
            gap: '6px',
            zIndex: 3
          }}
        >
          {/* Compare Button */}
          {onToggleCompare && (
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                onToggleCompare(property); 
              }}
              style={{
                background: isCompared ? '#D4AF37' : 'rgba(5, 10, 20, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isCompared ? '#070C15' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(4px)'
              }}
              title={isCompared ? 'Remove from compare' : 'Compare property'}
            >
              <Sliders size={13} />
            </button>
          )}

          {/* Wishlist Heart Button */}
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              if (onToggleWishlist) onToggleWishlist(property); 
            }}
            style={{
              background: isWishlisted ? '#D4AF37' : 'rgba(5, 10, 20, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isWishlisted ? '#070C15' : '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(4px)'
            }}
            title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-label={isWishlisted ? `Remove ${property.title} from wishlist` : `Add ${property.title} to wishlist`}
          >
            <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={2.2} />
          </button>
        </div>

        {/* Tagline Overlay on Image */}
        <div 
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '16px',
            right: '16px',
            zIndex: 2,
            pointerEvents: 'none'
          }}
        >
          <div style={{
            fontSize: '0.72rem',
            fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: '#F1E5D1',
            textTransform: 'uppercase',
            textShadow: '0 2px 6px rgba(0,0,0,0.95)',
            whiteSpace: 'pre-line',
            lineHeight: 1.25
          }}>
            {imageTagline}
          </div>
        </div>
      </div>

      {/* ── 2. Card Content Panel ── */}
      <div 
        style={{ 
          padding: '16px 18px 18px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          flex: 1
        }}
      >
        {/* Title and Subtitle */}
        <div>
          <h3 
            style={{
              fontSize: '1.24rem',
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 600,
              color: '#FFFFFF',
              margin: '0 0 2px 0',
              lineHeight: 1.25,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}
          >
            {property.title}
          </h3>
          <div 
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#94A3B8',
              textTransform: 'uppercase'
            }}
          >
            {subtitleCorridor}
          </div>
        </div>

        {/* Developer Name & Brand Mark Row */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}
        >
          <span style={{ 
            fontSize: '0.82rem', 
            color: '#CBD5E1', 
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '160px'
          }}>
            {builderName}
          </span>
          <DeveloperBrandMark builderName={builderName} title={property.title} />
        </div>

        {/* Price Row: Bold Price + Onwards */}
        <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '2px' }}>
          <span 
            style={{
              fontSize: '1.38rem',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              fontFamily: "'Montserrat', sans-serif"
            }}
          >
            {priceObj.main}
          </span>
          {priceObj.suffix && (
            <span 
              style={{
                fontSize: '0.78rem',
                color: '#94A3B8',
                fontWeight: 400,
                marginLeft: '6px'
              }}
            >
              {priceObj.suffix}
            </span>
          )}
        </div>

        {/* Location & MahaRERA Pill Row */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {/* Location corridor */}
          <span 
            style={{
              fontSize: '0.76rem',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            <MapPin size={13} color="#94A3B8" style={{ flexShrink: 0 }} />
            <span>{locationLabel}</span>
          </span>

          {/* MahaRERA Pill Button */}
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenRera) onOpenRera(property, e);
            }}
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '6px',
              padding: '3px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              flexShrink: 0,
              transition: 'background 0.2s ease, border-color 0.2s ease'
            }}
            title={property.reraNumber ? `MahaRERA: ${property.reraNumber}` : 'MahaRERA dossier'}
          >
            <div style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.25)',
              border: '1px solid rgba(16, 185, 129, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.55rem',
              fontWeight: 800,
              color: '#34D399'
            }}>
              e
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1 }}>
              <span style={{ fontSize: '0.52rem', fontWeight: 800, color: '#34D399', letterSpacing: '0.04em' }}>
                RERA
              </span>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#A7F3D0', letterSpacing: '0.02em' }}>
                {property.reraNumber ? property.reraNumber : 'VERIFIED'}
              </span>
            </div>
          </button>
        </div>

        {/* ── 3. Available Configurations ── */}
        <div style={{ marginTop: '2px' }}>
          <div style={{ 
            fontSize: '0.72rem', 
            color: '#94A3B8', 
            fontWeight: 500, 
            marginBottom: '7px' 
          }}>
            Available Configurations
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {property.configurations && property.configurations.length > 0 ? (
              property.configurations.map((cfg, idx) => (
                <div
                  key={idx}
                  style={{
                    flex: '1 1 0px',
                    minWidth: '60px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: cfg.highlight 
                      ? 'rgba(212, 175, 55, 0.08)' 
                      : 'rgba(255, 255, 255, 0.03)',
                    border: cfg.highlight 
                      ? '1px solid #D4AF37' 
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '8px 4px',
                    position: 'relative',
                    cursor: 'default'
                  }}
                >
                  {cfg.highlight && (
                    <span 
                      style={{
                        position: 'absolute',
                        top: '-7px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'linear-gradient(90deg, #D4AF37 0%, #F3E5AB 100%)',
                        color: '#070C15',
                        fontSize: '0.5rem',
                        fontWeight: 900,
                        padding: '1px 5px',
                        borderRadius: '3px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      POPULAR
                    </span>
                  )}
                  <span 
                    style={{ 
                      fontSize: '0.76rem', 
                      fontWeight: 700, 
                      color: cfg.highlight ? '#E6C35C' : '#FFFFFF',
                      lineHeight: 1.2
                    }}
                  >
                    {cfg.bhk}
                  </span>
                  <span 
                    style={{ 
                      fontSize: '0.64rem', 
                      color: cfg.highlight ? '#CBD5E1' : '#94A3B8', 
                      marginTop: '2px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cfg.carpet}
                  </span>
                </div>
              ))
            ) : (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
              >
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFFFFF' }}>
                  {property.bedrooms ? `${property.bedrooms} BHK` : '2 & 3 BHK'}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  {property.areaSquareFeet ? `${property.areaSquareFeet} sq.ft` : 'Spacious Layout'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── 4. 3 Highlights Row (Thin Gold Icons + Labels) ── */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '4px',
            padding: '10px 0 6px 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          {highlights.map((h, i) => {
            const IconComp = h.icon;
            return (
              <div 
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D4AF37',
                  flexShrink: 0
                }}>
                  <IconComp size={16} strokeWidth={1.7} />
                </div>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  lineHeight: 1.15,
                  fontSize: '0.64rem', 
                  color: '#CBD5E1', 
                  fontWeight: 500 
                }}>
                  <span>{h.line1}</span>
                  {h.line2 && <span>{h.line2}</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── 5. Bottom Action Buttons: WhatsApp & Explore Project ── */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            marginTop: '4px'
          }}
        >
          {/* WhatsApp Direct Inquiry Button */}
          <a
            href={`https://wa.me/919673000053?text=${whatsappInquiryMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: '#22C55E',
              borderRadius: '8px',
              padding: '9px 12px',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'background 0.2s ease, transform 0.2s ease',
              boxShadow: '0 2px 10px rgba(34, 197, 94, 0.25)'
            }}
            title="Chat directly on WhatsApp"
            onMouseEnter={e => { 
              e.currentTarget.style.background = '#16A34A'; 
              e.currentTarget.style.transform = 'translateY(-1px)'; 
            }}
            onMouseLeave={e => { 
              e.currentTarget.style.background = '#22C55E'; 
              e.currentTarget.style.transform = 'translateY(0)'; 
            }}
          >
            {/* WhatsApp Logo SVG */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.392-12.416c-5.523 0-10 4.477-10 10 0 1.764.46 3.42 1.261 4.862l-1.292 4.722 4.834-1.268c1.391.758 2.979 1.184 4.673 1.184 5.522 0 10-4.477 10-10s-4.478-10-10-10zm0 18.2c-1.579 0-3.058-.451-4.316-1.228l-.309-.188-2.868.752.766-2.798-.206-.328c-.852-1.353-1.306-2.934-1.306-4.57 0-4.521 3.679-8.2 8.2-8.2 4.522 0 8.2 3.679 8.2 8.2 0 4.522-3.678 8.2-8.2 8.2z"/>
            </svg>
            <span>WhatsApp</span>
          </a>

          {/* Explore Project Button */}
          <button 
            type="button"
            className="explore-project-cta"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            style={{
              fontSize: '0.82rem',
              color: '#F5D77F',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: 'rgba(5, 10, 20, 0.65)',
              border: '1px solid rgba(212, 175, 55, 0.45)',
              borderRadius: '8px',
              padding: '9px 12px',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(244, 208, 104, 0.75)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(5, 10, 20, 0.65)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.45)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>Explore Project</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
