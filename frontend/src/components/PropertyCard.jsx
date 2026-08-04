import React from 'react';
import { MapPin, ShieldCheck, Sliders, Heart, ArrowRight, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const getForbesTeslaPropertyImage = (property) => {
  if (property.imageUrl && !property.imageUrl.includes('unsplash.com')) {
    return property.imageUrl;
  }
  const title = (property.title || '').toLowerCase();
  const desc = (property.description || '').toLowerCase();

  if (title.includes('opula')) return '/dev_kolte_patil_township.png';
  if (title.includes('altura')) return '/dev_vj_building.png';
  if (title.includes('office') || title.includes('plaza') || title.includes('commercial')) return '/dev_godrej_building.png';
  if (title.includes('balewadi') || title.includes('retail')) return '/dev_paranjape_township.png';
  if (title.includes('glitterati') || title.includes('penthouse')) return '/dev_lodha_tower.png';
  if (title.includes('mahalunge') || title.includes('oasis')) return '/dev_vtp_township.png';
  if (title.includes('studio') || title.includes('corporate')) return '/dev_kasturi_forbes.png';
  if (title.includes('megapolis')) return '/dev_gera_tower.png';
  if (title.includes('elements') || title.includes('godrej')) return '/dev_godrej_building.png';
  if (title.includes('crown') || title.includes('tcg')) return '/dev_shapoorji_township.png';
  if (title.includes('kasturi') || title.includes('apostle') || title.includes('villa')) return '/dev_kasturi_forbes.png';
  if (title.includes('republic') || title.includes('life')) return '/dev_kolte_patil_township.png';
  if (title.includes('gera') || title.includes('joy')) return '/dev_gera_tower.png';
  if (title.includes('pride') || title.includes('landmark')) return '/dev_kohinoor_tower.png';
  if (title.includes('sportsville') || title.includes('kohinoor')) return '/dev_kohinoor_tower.png';
  if (title.includes('blue waters') || title.includes('vtp')) return '/dev_vtp_township.png';
  if (title.includes('vyomora') || title.includes('shapoorji') || title.includes('joyville')) return '/dev_shapoorji_township.png';
  if (title.includes('yashwin') || title.includes('vj')) return '/dev_vj_building.png';
  if (title.includes('belmondo') || title.includes('lodha')) return '/dev_lodha_tower.png';
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
  if (t.includes('lodha')) return 'LODHA GROUP';
  if (t.includes('godrej')) return 'GODREJ PROPERTIES';
  if (t.includes('vtp')) return 'VTP REALTY';
  if (t.includes('kolte') || t.includes('24k')) return 'KOLTE PATIL';
  if (t.includes('shapoorji') || t.includes('joyville')) return 'SHAPOORJI PALLONJI';
  if (t.includes('gera')) return 'GERA DEVELOPERS';
  if (t.includes('nyati')) return 'NYATI GROUP';
  if (t.includes('kasturi')) return 'KASTURI BUILDERS';
  if (t.includes('kohinoor')) return 'KOHINOOR GROUP';
  if (t.includes('paranjape')) return 'PARANJAPE SCHEMES';
  if (t.includes('pharande')) return 'PHARANDE SPACES';
  if (t.includes('rohan')) return 'ROHAN BUILDERS';
  return 'PREMIUM ALLIANCE';
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
  const cardImgSrc = getForbesTeslaPropertyImage(property);
  const builderName = getBuilderName(property.title, property.description);

  return (
    <div 
      className={`property-card premium-luxury-card radial-glow-card ${isCompared ? 'compared-active' : ''}`}
      id={`property-${property.id}`}
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'rgba(7, 15, 30, 0.92)',
        border: '1px solid rgba(197, 168, 128, 0.22)',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s',
        cursor: 'pointer',
        boxShadow: '0 12px 35px rgba(0, 0, 0, 0.45)',
        transform: 'translateZ(0)',
        willChange: 'transform'
      }}
      onClick={() => onOpenDetail ? onOpenDetail(property) : null}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px) translateZ(0)'; e.currentTarget.style.borderColor = 'rgba(230, 195, 92, 0.5)'; e.currentTarget.style.boxShadow = '0 18px 45px rgba(0,0,0,0.65), 0 0 25px rgba(212, 175, 55, 0.15)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0) translateZ(0)'; e.currentTarget.style.borderColor = 'rgba(197, 168, 128, 0.22)'; e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.45)'; }}
    >
      {/* 1. Large Premium Image Container */}
      <div 
        className="property-image-container" 
        style={{ 
          position: 'relative', 
          height: '220px', 
          overflow: 'hidden' 
        }}
      >
        <img 
          src={cardImgSrc} 
          onError={e => { e.currentTarget.src = '/dev_kolte_patil_township.png'; }}
          sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt={`Exterior of ${property.title}`} 
          loading="lazy" 
          decoding="async"
          className="card-main-image"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />

        {/* Dark Vignette Overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 40%, rgba(7,15,30,0.85) 100%)',
          zIndex: 1
        }}></div>

        {/* Transaction Tag (Buy/Rent) */}
        <span 
          className="property-tag"
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: '#E6C35C',
            color: '#040814',
            fontWeight: 800,
            fontSize: '0.68rem',
            padding: '3px 8px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            zIndex: 2
          }}
        >
          {property.transactionType}
        </span>

        {/* Floating Quick Action Icons Overlay on Image */}
        <div 
          className="card-quick-actions"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            display: 'flex',
            gap: '8px',
            zIndex: 3
          }}
        >
          {/* Wishlist Toggle Button */}
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              if (onToggleWishlist) onToggleWishlist(property); 
            }}
            style={{
              background: isWishlisted ? '#E6C35C' : 'rgba(7, 15, 30, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isWishlisted ? '#040814' : '#fff',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-label={isWishlisted ? `Remove ${property.title} from wishlist` : `Add ${property.title} to wishlist`}
          >
            <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>

          {/* Compare Toggle Button */}
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              if (onToggleCompare) onToggleCompare(property); 
            }}
            style={{
              background: isCompared ? '#E6C35C' : 'rgba(7, 15, 30, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isCompared ? '#040814' : '#fff',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }}
            title={isCompared ? 'Remove from compare list' : 'Add to compare list'}
            aria-label={isCompared ? `Remove ${property.title} from compare list` : `Add ${property.title} to compare list`}
          >
            <Sliders size={14} />
          </button>

          {/* Instant PDF Brochure Button */}
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              if (onOpenBrochure) onOpenBrochure(property); 
            }}
            style={{
              background: 'rgba(7, 15, 30, 0.7)',
              border: '1px solid rgba(197, 168, 128, 0.3)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#E6C35C',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }}
            title="Download Instant 1-Page PDF Brochure"
            aria-label={`Download PDF Brochure for ${property.title}`}
          >
            <FileText size={14} />
          </button>
        </div>

        {/* Pricing tag aligned on bottom-left of image */}
        <span 
          className="property-price-tag"
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            fontSize: '1.2rem',
            fontWeight: 800,
            color: '#E6C35C',
            textShadow: '0 2px 4px rgba(0,0,0,0.7)',
            zIndex: 2
          }}
        >
          {isHnwiMode 
            ? `Yield: ${property?.propertyType === 'COMMERCIAL' ? '7.2%' : '4.4%'} | ${formatPrice ? formatPrice(property?.price, property?.transactionType) : property?.price}` 
            : (formatPrice ? formatPrice(property?.price, property?.transactionType) : property?.price)}
        </span>
      </div>

      {/* 2. Text Info Panel */}
      <div 
        className="property-info"
        style={{ 
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        {/* Builder & Premium Badge Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
          <span style={{
            fontSize: '0.65rem',
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 800,
            color: '#E6C35C',
            background: 'rgba(230, 195, 92, 0.08)',
            border: '1px solid rgba(230, 195, 92, 0.22)',
            padding: '2px 8px',
            borderRadius: '4px',
            letterSpacing: '0.05em'
          }}>
            {builderName}
          </span>
          {property?.exclusiveDeal && (
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 800,
              color: '#040814',
              background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 100%)',
              padding: '2px 8px',
              borderRadius: '4px',
              letterSpacing: '0.02em'
            }}>
              EXCL
            </span>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Location corridor */}
          <span 
            className="property-location"
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <MapPin size={12} color="#E6C35C" />
            {property?.location}
          </span>
          
          {/* MahaRERA Code */}
          <button 
            className="rera-interactive-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenRera) onOpenRera(property, e);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '4px',
              padding: '3px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.68rem',
              color: '#FFF4D0',
              fontWeight: 600
            }}
            title="MahaRERA dossier"
          >
            <ShieldCheck size={11} color="#E6C35C" />
            <span>RERA Certified</span>
          </button>
        </div>

        {/* Property Title */}
        <h3 
          className="property-title"
          style={{
            fontSize: '1rem',
            fontFamily: 'var(--font-title)',
            color: '#fff',
            margin: '4px 0 0 0',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            transition: 'color 0.3s ease'
          }}
        >
          {property.title}
        </h3>

        {/* Minimal configuration details (BHK + Area) */}
        <div 
          className="property-specs"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            paddingTop: '10px',
            marginTop: '4px'
          }}
        >
          <span>{property.bedrooms > 0 ? `${property.bedrooms} BHK` : 'N/A Layout'}</span>
          <span style={{ width: '4px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}></span>
          <span>{property.areaSquareFeet} sqft Carpet</span>
          {property.exclusiveDeal && (
            <>
              <span style={{ width: '4px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}></span>
              <span style={{ color: '#E6C35C', fontWeight: 600 }}>★ Exclusive</span>
            </>
          )}
        </div>

        {/* Sleek CTA Bar with WhatsApp Direct Inquiry */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '12px',
            paddingTop: '8px',
            borderTop: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          {/* WhatsApp Direct Inquiry Button */}
          <a
            href={`https://wa.me/919673000053?text=${encodeURIComponent(
              `Namaste 24K Realtors! 🏠\n\nI am interested in:\n📌 *${property.title}*\n📍 Location: ${property.location}\n💰 Price: ${formatPrice ? formatPrice(property.price) : property.price}\n🛡️ RERA: ${property.reraNumber || 'Verified'}\n\nPlease share floor plans, pricing breakup, and available site visit slots.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              background: 'rgba(37, 211, 102, 0.1)',
              border: '1px solid rgba(37, 211, 102, 0.35)',
              borderRadius: '6px',
              padding: '4px 10px',
              color: '#25D366',
              fontSize: '0.72rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            title="Chat on WhatsApp for instant property details"
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37, 211, 102, 0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37, 211, 102, 0.1)'; }}
          >
            <span>💬 WhatsApp</span>
          </a>

          <span 
            className="view-details-cta"
            style={{
              fontSize: '0.78rem',
              color: '#E6C35C',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'transform 0.3s ease'
            }}
          >
            View Details <ArrowRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );
}
