import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Sliders, 
  Heart, 
  ArrowRight, 
  Building2 
} from 'lucide-react';

const getForbesTeslaPropertyImage = (property) => {
  const title = (property?.title || property?.projectName || '').toLowerCase();
  const id = String(property?.id || '').toLowerCase();

  // Paranjape Blue Ridge high-definition infographic card poster
  if (id.includes('blue-ridge') || title.includes('blue ridge') || title.includes('paranjape blue')) {
    return '/blue_ridge_project_card.jpg';
  }

  // Joyville Sensorium by Shapoorji Pallonji
  if (id.includes('sensorium') || title.includes('sensorium') || title.includes('joyville')) {
    return '/joyville_sensorium_project_card.jpg';
  }

  // Kasturi Eon Homes Hinjawadi Phase 3 — Verified on-site tower & gate elevation photo
  if (id.includes('eon') || title.includes('eon') || title.includes('kasturi')) {
    return '/kasturi_eon_homes_project_card.jpg';
  }

  if (property?.imageUrl && !property.imageUrl.includes('unsplash.com')) {
    return property.imageUrl;
  }

  if (title.includes('opula')) return '/dev_kolte_patil_township.png';
  if (title.includes('office') || title.includes('plaza') || title.includes('commercial')) return '/lodha_4_grand_lobby.png';
  if (title.includes('balewadi') || title.includes('retail')) return '/gallery_vj_supernova_tower.png';
  if (title.includes('glitterati') || title.includes('penthouse')) return '/lodha_7_infinity_pool.png';
  if (title.includes('mahalunge') || title.includes('oasis')) return '/gallery_tower_3.png';
  if (title.includes('studio') || title.includes('corporate')) return '/dev_vj_building.png';
  if (title.includes('splendour')) return '/megapolis_splendour_kitchen.jpg';
  if (title.includes('saffron')) return '/megapolis_saffron_kitchen.jpg';
  if (title.includes('sparklet') || title.includes('spaklet')) return '/megapolis_sparklet_balcony.jpg';
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
  if (title.includes('blue waters') || title.includes('bluewater') || title.includes('vtp')) return '/properties/vtp-blue-waters/00_project_card.jpg';
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
  if (t.includes('splendour') || t.includes('saffron') || t.includes('sparklet') || t.includes('spaklet')) return 'Pegasus Properties (Megapolis)';
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
    if (t.includes('sensorium') || t.includes('joyville')) {
      return { main: '₹78 Lakhs*', suffix: 'Onwards' };
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

  if (b.includes('shapoorji') || b.includes('joyville') || b.includes('sensorium')) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ 
          fontFamily: "'Cinzel', 'Playfair Display', serif", 
          fontWeight: 900, 
          fontSize: '0.96rem', 
          color: '#10B981', 
          letterSpacing: '0.04em' 
        }}>
          SHAPOORJI
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontSize: '0.48rem', fontWeight: 800, letterSpacing: '0.08em', color: '#E2E8F0' }}>PALLONJI</span>
          <span style={{ fontSize: '0.42rem', fontWeight: 600, letterSpacing: '0.06em', color: '#6EE7B7' }}>150+ YRS LEGACY</span>
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

// Streamlined luxury configuration summary helper
const getConfigSummary = (property) => {
  if (property?.configurations && property.configurations.length > 0) {
    const rawBhks = property.configurations.map(c => {
      const b = (c.bhk || '').replace(/ BHK.*$/i, '').trim();
      return b;
    }).filter(Boolean);
    const unique = [...new Set(rawBhks)];
    if (unique.length === 1) {
      return `${unique[0]} BHK Residences`;
    }
    if (unique.length === 2) {
      return `${unique[0]} & ${unique[1]} BHK Residences`;
    }
    if (unique.length > 2) {
      const last = unique[unique.length - 1];
      const rest = unique.slice(0, -1).join(', ');
      return `${rest} & ${last} BHK Residences`;
    }
  }
  if (property?.bedrooms) {
    const b = String(property.bedrooms);
    return b.toLowerCase().includes('bhk') ? `${b} Residences` : `${b} BHK Residences`;
  }
  return '2, 2.5 & 3 BHK Residences';
};

// Streamlined luxury carpet area range summary helper
const getCarpetSummary = (property) => {
  if (property?.configurations && property.configurations.length > 0) {
    const carpets = property.configurations
      .map(c => c.carpet || '')
      .filter(Boolean);
    
    const allNums = [];
    carpets.forEach(txt => {
      const matches = txt.match(/\d[\d,]*/g);
      if (matches) {
        matches.forEach(m => {
          const val = parseInt(m.replace(/,/g, ''), 10);
          if (!isNaN(val) && val > 100 && val < 25000) {
            allNums.push(val);
          }
        });
      }
    });

    if (allNums.length > 0) {
      const min = Math.min(...allNums);
      const max = Math.max(...allNums);
      if (min === max) {
        return `${min.toLocaleString('en-IN')} sq.ft`;
      }
      return `${min.toLocaleString('en-IN')} – ${max.toLocaleString('en-IN')} sq.ft`;
    }
  }
  if (property?.areaSquareFeet) {
    return `${Number(property.areaSquareFeet).toLocaleString('en-IN')} sq.ft`;
  }
  return 'Spacious Layout';
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
  const isMegapolis = (
    (property.title && property.title.toLowerCase().includes('megapolis')) ||
    (property.location && property.location.includes('HINJEWADI_PHASE_3')) ||
    (property.societySlug && property.societySlug.includes('megapolis'))
  );

  const getDedicatedProjectUrl = (prop) => {
    if (!prop) return null;
    const id = String(prop.id || '').toLowerCase();
    const title = String(prop.title || '').toLowerCase();
    const slug = String(prop.societySlug || '').toLowerCase();

    // 1. TCG The Cliff Garden
    if (id.includes('tcg') || title.includes('cliff') || title.includes('clip') || slug.includes('tcg')) {
      return '/tcg-cliff-garden-hinjewadi';
    }
    // 2. VTP Blue Waters
    if (id.includes('vtp') || title.includes('blue waters') || title.includes('bluewater') || slug.includes('vtp')) {
      return '/vtp-blue-waters-mahalunge';
    }
    // 3. Kohinoor Sportsville
    if (id.includes('kohinoor') || title.includes('sportsville') || slug.includes('kohinoor')) {
      return '/kohinoor-sportsville-hinjewadi';
    }
    // 4. Vilas Javdekar YashOne
    if (id.includes('yashone') || title.includes('yashone') || slug.includes('yashone')) {
      return '/vj-yashone-hinjewadi';
    }
    // 5. Godrej 24
    if (id === 'prop-godrej-24' || title === 'godrej 24' || (title.includes('godrej') && title.includes('24'))) {
      return '/godrej-24-hinjewadi';
    }
    // 6. Godrej Elements
    if (id === 'prop-godrej-elements' || (title.includes('godrej') && title.includes('element')) || title.includes('elements')) {
      return '/godrej-elements-hinjewadi';
    }
    // 7. Megapolis Splendour
    if (id.includes('splendour') || title.includes('splendour') || slug.includes('splendour')) {
      return '/megapolis-splendour';
    }
    // Megapolis Saffron
    if (id.includes('saffron') || title.includes('saffron') || slug.includes('saffron')) {
      return '/megapolis-saffron';
    }
    // Megapolis Sparklet
    if (id.includes('sparklet') || id.includes('spaklet') || title.includes('sparklet') || title.includes('spaklet') || slug.includes('sparklet') || slug.includes('spaklet')) {
      return '/megapolis-sparklet';
    }
    // 8. Megapolis Township
    if (id.includes('megapolis') || title.includes('megapolis') || slug.includes('megapolis')) {
      return '/townships/megapolis';
    }
    // 8. Paranjape Blue Ridge
    if (id.includes('blue-ridge') || title.includes('blue ridge') || slug.includes('blue-ridge')) {
      return '/blue-ridge-hinjewadi';
    }
    // 9. Joyville Sensorium by Shapoorji Pallonji
    if (id.includes('sensorium') || title.includes('sensorium') || slug.includes('sensorium') || title.includes('joyville')) {
      return '/joyville-sensorium';
    }
    // 10. Kasturi Eon Homes Hinjawadi Phase 3
    if (id.includes('eon') || title.includes('eon') || slug.includes('eon') || title.includes('kasturi') || slug.includes('kasturi')) {
      return '/kasturi-eon-homes-hinjawadi';
    }
    return null;
  };

  const priceObj = formatCardPrice(property?.price, property?.transactionType, property?.title);
  const subtitleCorridor = formatSubtitleCorridor(property?.location, property?.title);
  const locationLabel = formatCorridorLabel(property?.location);

  const handleCardClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const dedicatedUrl = getDedicatedProjectUrl(property);
    if (dedicatedUrl) {
      navigate(dedicatedUrl);
      return;
    }
    if (isMegapolis && !property.title?.toLowerCase().includes('sangria')) {
      navigate('/townships/megapolis');
    } else if (property.societySlug) {
      const slug = property.societySlug.startsWith('/') ? property.societySlug : `/${property.societySlug}`;
      navigate(slug);
    } else if (onOpenDetail) {
      onOpenDetail(property);
    }
  };

  const isNegotiable = property.priceNegotiable || property.priceNote === 'Negotiable' || property.title?.toLowerCase().includes('cliff') || property.title?.toLowerCase().includes('blue waters');
  const whatsappInquiryMessage = encodeURIComponent(
    `Namaste 24K Realtors! 🏛️\n\nI am interested in:\n📌 *${property.title}* — ${subtitleCorridor}\n📍 Location: ${locationLabel}\n🏢 Developer: ${builderName}\n💰 Listed Price: ${priceObj.main} ${priceObj.suffix}${isNegotiable ? ' (Negotiable)' : ''}\n🛡️ MahaRERA: ${property.reraNumber || 'Verified'}\n\nPlease share the official developer pricing sheet, verified floor plans, and negotiation margin.`
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
            objectPosition: (cardImgSrc.includes('kohinoor') || cardImgSrc.includes('sportsville')) ? 'center 12%' : (cardImgSrc.includes('eon') || cardImgSrc.includes('kasturi')) ? 'center 22%' : (cardImgSrc.includes('godrej_24') || cardImgSrc.includes('elements') || cardImgSrc.includes('yashone')) ? 'center 32%' : (cardImgSrc.includes('tcg') || cardImgSrc.includes('cliff')) ? 'center 20%' : (cardImgSrc.includes('vtp') || cardImgSrc.includes('blue-waters')) ? 'center 35%' : 'center',
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



        {/* Authentic Photos Badge */}
        <div 
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '12px',
            background: 'rgba(5, 10, 20, 0.85)',
            border: '1px solid rgba(212, 175, 55, 0.45)',
            color: '#E6C35C',
            fontSize: '0.62rem',
            fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '20px',
            zIndex: 2,
            backdropFilter: 'blur(6px)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}
        >
          <span>📷 {property.galleryImages?.length || 6} Photos</span>
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
        {/* Developer Eyebrow & Brand Mark */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ 
            fontSize: '0.72rem', 
            color: '#D4AF37', 
            fontWeight: 700,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {builderName}
          </span>
          <DeveloperBrandMark builderName={builderName} title={property.title} />
        </div>

        {/* Project Title & Micro-Location Corridor */}
        <div>
          <h3 
            style={{
              fontSize: '1.26rem',
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 600,
              color: '#FFFFFF',
              margin: '0 0 3px 0',
              lineHeight: 1.25,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {property.title}
          </h3>
          <div 
            style={{
              fontSize: '0.74rem',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <MapPin size={13} color="#D4AF37" style={{ flexShrink: 0 }} />
            <span>{locationLabel}</span>
          </div>
        </div>

        {/* Streamlined Luxury Configuration & Carpet Area Ribbon */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(212, 175, 55, 0.18)',
          borderRadius: '8px',
          padding: '8px 12px',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            <Building2 size={14} color="#D4AF37" style={{ flexShrink: 0 }} />
            <span style={{ 
              fontSize: '0.78rem', 
              fontWeight: 700, 
              color: '#FFFFFF', 
              letterSpacing: '0.01em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {getConfigSummary(property)}
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#E6C35C', fontWeight: 600, flexShrink: 0 }}>
            {getCarpetSummary(property)}
          </span>
        </div>

        {/* Price & MahaRERA Row */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: '8px',
            marginTop: '2px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
            <span 
              style={{
                fontSize: '1.36rem',
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
                  fontSize: '0.74rem',
                  color: '#94A3B8',
                  fontWeight: 500
                }}
              >
                {priceObj.suffix}
              </span>
            )}
            {isNegotiable && (
              <span style={{
                background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #B8860B 100%)',
                color: '#040814',
                fontSize: '0.58rem',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '3px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                Negotiable
              </span>
            )}
          </div>

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
              width: '13px',
              height: '13px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.25)',
              border: '1px solid rgba(16, 185, 129, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.5rem',
              fontWeight: 800,
              color: '#34D399'
            }}>
              e
            </div>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#A7F3D0', letterSpacing: '0.02em' }}>
              {(() => {
                if (!property.reraNumber) return 'RERA VERIFIED';
                if (property.reraNumber.includes('/')) {
                  const parts = property.reraNumber.split('/');
                  return `RERA ${parts[0].trim()} (+${parts.length - 1})`;
                }
                return `RERA ${property.reraNumber}`;
              })()}
            </span>
          </button>
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
              padding: '11px 12px',
              minHeight: '44px',
              touchAction: 'manipulation',
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

          {/* Explore Showcase Button */}
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
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(5,10,20,0.85) 100%)',
              border: '1px solid rgba(212, 175, 55, 0.55)',
              borderRadius: '8px',
              padding: '11px 12px',
              minHeight: '44px',
              touchAction: 'manipulation',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(212, 175, 55, 0.25)';
              e.currentTarget.style.borderColor = '#F4D068';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(5,10,20,0.85) 100%)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.55)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>Explore Showcase</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
