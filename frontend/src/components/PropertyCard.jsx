import React from 'react';
import { MapPin, ShieldCheck, Sliders, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const getOptimizedImgUrl = (url, width) => {
  if (!url) return '';
  if (!url.includes('unsplash.com')) return url;
  const base = url.split('?')[0];
  return `${base}?auto=format,compress&q=75&fm=webp&w=${width}&fit=crop`;
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
  onOpenRera
}) {
  const defaultImg = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';

  return (
    <motion.div 
      className={`property-card premium-luxury-card radial-glow-card ${isCompared ? 'compared-active' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
      id={`property-${property.id}`}
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'rgba(10, 18, 36, 0.45)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      }}
      onClick={() => onOpenDetail ? onOpenDetail(property) : null}
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
          src={property.imageUrl ? getOptimizedImgUrl(property.imageUrl, 800) : defaultImg} 
          srcSet={property.imageUrl && property.imageUrl.includes('unsplash.com') 
            ? `${getOptimizedImgUrl(property.imageUrl, 400)} 400w, ${getOptimizedImgUrl(property.imageUrl, 800)} 800w, ${getOptimizedImgUrl(property.imageUrl, 1200)} 1200w`
            : undefined}
          sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt={`Exterior of ${property.title}`} 
          loading="lazy" 
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
            background: 'var(--gold-primary)',
            color: '#070F1E',
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
              background: isWishlisted ? 'var(--gold-primary)' : 'rgba(7, 15, 30, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isWishlisted ? '#070F1E' : '#fff',
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
              onToggleCompare(property); 
            }}
            style={{
              background: isCompared ? 'var(--gold-primary)' : 'rgba(7, 15, 30, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isCompared ? '#070F1E' : '#fff',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
            }}
            title={isCompared ? 'Remove from compare list' : 'Add to compare list'}
            aria-label={isCompared ? `Remove ${property.title} from compare list` : `Add ${property.title} to compare list`}
          >
            <Sliders size={14} />
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
            color: 'var(--gold-primary)',
            textShadow: '0 2px 4px rgba(0,0,0,0.7)',
            zIndex: 2
          }}
        >
          {isHnwiMode 
            ? `Yield: ${property.propertyType === 'COMMERCIAL' ? '7.2%' : '4.4%'} | ${formatPrice(property.price, property.transactionType)}` 
            : formatPrice(property.price, property.transactionType)}
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
            <MapPin size={12} color="var(--gold-primary)" />
            {property.location}
          </span>
          
          {/* MahaRERA Code */}
          <button 
            className="rera-interactive-btn"
            onClick={(e) => {
              e.stopPropagation();
              onOpenRera(property, e);
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '0.72rem',
              color: 'var(--gold-secondary)',
              fontWeight: 600
            }}
            title="MahaRERA dossier"
          >
            <ShieldCheck size={11} />
            <span>RERA Approved</span>
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
              <span style={{ color: 'var(--gold-secondary)', fontWeight: 600 }}>★ Exclusive</span>
            </>
          )}
        </div>

        {/* Sleek CTA */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginTop: '8px'
          }}
        >
          <span 
            className="view-details-cta"
            style={{
              fontSize: '0.78rem',
              color: 'var(--gold-primary)',
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
    </motion.div>
  );
}
