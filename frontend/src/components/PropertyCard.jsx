import React from 'react';
import { MapPin, ShieldCheck, Lock, Bed, Bath, Maximize, Sparkles, Eye, Compass, Car, Sliders } from 'lucide-react';

export default function PropertyCard({ 
  property, 
  isHnwiMode, 
  isCompared, 
  formatPrice, 
  onToggleCompare, 
  onOpenRera, 
  onOpenWalkthrough, 
  onOpen3DTour, 
  onOpenChauffeur,
  getLocationScorecard,
  getLandmarks 
}) {
  const scores = getLocationScorecard(property.location);
  const defaultImg = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';
  const waLink = `https://wa.me/919673000053?text=Hi%2024K%20Realtors,%20I%20am%20interested%20in%20"${property.title}"%20located%20at%20${property.address}%20for%20₹${property.price}`;

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div className="property-card premium-luxury-card radial-glow-card" onMouseMove={handleCardMouseMove}>
      <div className="property-image-container premium-hover-tint" style={{ position: 'relative', overflow: 'hidden' }}>
        <img 
          src={property.imageUrl || defaultImg} 
          alt={property.title} 
          loading="lazy" 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            zIndex: 0
          }}
        />
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(7,15,30,0.9) 100%)',
          zIndex: 1
        }}></div>
        <span className="property-tag">{property.transactionType}</span>
        <div className="property-badge-container">
          {property.verifiedListing && <span className="p-badge p-badge-verified">✓ Verified</span>}
          {property.exclusiveDeal && <span className="p-badge p-badge-exclusive">★ Exclusive</span>}
          {property.noBrokerage && <span className="p-badge p-badge-nobroker">No Brokerage</span>}
          {property.threeDTourUrl && <span className="p-badge p-badge-tour-glow">📐 3D Tour</span>}
          {property.videoUrl && <span className="p-badge p-badge-video-glow">📹 Drone Tour</span>}
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleCompare(property); }}
          className={`btn-compare-badge ${isCompared ? 'compared' : ''}`}
          title={isCompared ? 'Remove from comparison' : 'Compare property'}
        >
          <Sliders size={14} />
          <span>{isCompared ? 'Compared' : 'Compare'}</span>
        </button>

        <span className="property-price-tag">
          {isHnwiMode 
            ? `Gross Yield: ${property.propertyType === 'COMMERCIAL' ? '7.2%' : '4.4%'} | ${formatPrice(property.price, property.transactionType)}` 
            : formatPrice(property.price, property.transactionType)}
        </span>
      </div>
      
      <div className="property-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span className="property-location">
            <MapPin size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            {property.location}
          </span>
          
          <button 
            className="rera-interactive-btn"
            onClick={(e) => onOpenRera(property, e)}
            title="Open compliance dossier"
          >
            <ShieldCheck size={12} color="#D4AF37" style={{ marginRight: '4px' }} />
            <span>{property.reraNumber || 'PRM/VERIFIED'}</span>
          </button>
        </div>

        <h3 className="property-title">{property.title}</h3>
        
        <div className="signature-compliance-stamp">
          <Lock size={12} color="#D4AF37" />
          <span>Certified Title-Clear Portfolio (Regional Lead Advisory)</span>
        </div>

        <p className="property-desc">{property.description || 'Premium architectural layout featuring cross ventilation, modern structural design.'}</p>
        
        <div className="location-scorecard">
          <div className="score-item">
            <span>Appreciation</span>
            <strong>{scores.appreciation}/10</strong>
          </div>
          <div className="score-item">
            <span>Commute</span>
            <strong>{scores.commute}/10</strong>
          </div>
          <div className="score-item">
            <span>Green Index</span>
            <strong>{scores.green}/10</strong>
          </div>
        </div>

        <div className="landmarks-snippets">
          <span className="landmark-tag-mini">{getLandmarks(property.location)[0]}</span>
          <span className="landmark-tag-mini">{getLandmarks(property.location)[1]}</span>
        </div>

        <div className="property-specs">
          <div className="spec-item">
            <Bed size={16} color="#C5A880" />
            <span className="spec-value">{property.bedrooms > 0 ? `${property.bedrooms} BHK` : 'N/A'}</span>
          </div>
          <div className="spec-item">
            <Bath size={16} color="#C5A880" />
            <span className="spec-value">{property.bathrooms} Baths</span>
          </div>
          <div className="spec-item">
            <Maximize size={16} color="#C5A880" />
            <span className="spec-value">{property.areaSquareFeet} sqft</span>
          </div>
        </div>

        <div className="luxury-amenities-mini-grid">
          <span className="amenity-badge" style={{ borderColor: 'rgba(212,175,55,0.4)', color: 'var(--gold-primary)', fontWeight: 600 }}>
            <Sparkles size={10} /> {property.furnishingStatus ? property.furnishingStatus.replace('_', ' ') : 'FULLY FURNISHED'}
          </span>
          {property.gasPipeline && (
            <span className="amenity-badge" style={{ borderColor: '#2ec4b6', color: '#2ec4b6' }}>
              🔥 Piped Gas
            </span>
          )}
          <span className="amenity-badge"><Sparkles size={10} /> Infinity Pool</span>
          <span className="amenity-badge"><Sparkles size={10} /> 24/7 Concierge</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => onOpenWalkthrough(property)}
            className="btn-outline"
            title="Drone Virtual Tour"
            style={{ padding: '10px 12px' }}
          >
            <Eye size={14} />
          </button>

          <button 
            onClick={() => onOpen3DTour(property)}
            className="btn-outline"
            title="3D Floor View"
            style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Compass size={14} />
            <span style={{ fontSize: '0.78rem' }}>3D Tour</span>
          </button>
          
          <button 
            onClick={() => onOpenChauffeur(property)}
            className="btn-outline"
            style={{ flex: '1 1 auto', padding: '10px 8px', justifyContent: 'center', borderColor: 'var(--gold-secondary)', color: 'var(--gold-secondary)', fontSize: '0.78rem' }}
          >
            <Car size={14} style={{ marginRight: '4px' }} />
            <span>VIP Chauffeur</span>
          </button>

          <a 
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
            style={{ padding: '10px 12px', background: '#2ec4b6', borderColor: '#2ec4b6', color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Direct WhatsApp Negotiation"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.233-1.371c1.394.756 2.96 1.157 4.777 1.158h.005c5.502 0 9.987-4.476 9.988-9.986C22 7.478 17.517 2 12.012 2zm5.787 14.404c-.24.675-1.397 1.285-1.92 1.36-.474.07-1.088.13-3.18-.737-2.677-1.11-4.4-3.837-4.536-4.015-.132-.178-1.08-1.433-1.08-2.73 0-1.298.68-1.936.92-2.199.243-.263.53-.328.706-.328.176 0 .353.003.507.01.162.007.382-.062.597.45.22.524.75 1.83.816 1.964.066.13.11.286.022.463-.087.177-.13.287-.26.439-.13.15-.27.337-.385.45-.126.126-.259.263-.11.517.15.253.66.1.91 1.488.75 1.309 1.37 2.14 2.15 2.65.783.51 1.237.585 1.58.204.34-.38 1.484-1.72 1.88-2.31.398-.59.794-.49 1.346-.29.553.2.3.5 1.764 1.226.22.11.365.163.475.328.11.165.11.954-.13 1.63z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
