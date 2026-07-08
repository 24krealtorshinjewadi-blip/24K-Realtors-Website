import React, { useState, useEffect } from 'react';
import { 
  MapPin, ShieldCheck, Bed, Bath, Maximize, Sparkles, 
  Compass, Car, Calculator, TrendingUp, HelpCircle, 
  MessageSquare, ChevronLeft, ChevronRight, Download, 
  Building, CheckCircle, FileText, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PropertyDetailView({ 
  property, 
  onBack, 
  onOpenInquiry, 
  onOpenChauffeur, 
  formatPrice, 
  getLocationScorecard, 
  getLandmarks, 
  getEmbedVideoUrl,
  allProperties = []
}) {
  const scores = getLocationScorecard(property.location);
  const landmarks = getLandmarks(property.location);
  
  // Interactive EMI State
  const [downPayment, setDownPayment] = useState(20); // 20%
  const [interestRate, setInterestRate] = useState(8.5); // 8.5%
  const [loanTerm, setLoanTerm] = useState(20); // 20 years
  
  // Gallery Slider State
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Interactive floor plan toggle
  const [activePlan, setActivePlan] = useState('floor'); // floor | master
  
  // Dynamic pricing plan toggle
  const [activePaymentPlan, setActivePaymentPlan] = useState('subvention'); // subvention | CLP | downpayment

  // Generate 4 premium Unsplash images for the slideshow based on the property config
  const isCommercial = property.propertyType === 'COMMERCIAL';
  const slideshowImages = [
    property.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    isCommercial 
      ? 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80' 
      : 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
    isCommercial
      ? 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'
      : 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
  ];

  // Mortgage Logic
  const principal = Number(property.price) * (1 - downPayment / 100);
  const monthlyRate = (interestRate / 12) / 100;
  const totalMonths = loanTerm * 12;
  const emi = monthlyRate > 0 
    ? (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : principal / totalMonths;

  // Next / Prev slide handlers
  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % slideshowImages.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + slideshowImages.length) % slideshowImages.length);

  // Auto-scroll to top when a property is loaded
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [property.id]);

  // WhatsApp Link generator
  const waLink = `https://wa.me/919673000053?text=Hi%2024K%20Realtors,%20I%20am%20interested%20in%20"${property.title}"%20located%20at%20${property.address}%20valued%20at%20₹${property.price}.%20Please%20schedule%20a%20site%20visit.`;

  // Filter similar properties (exclude current, matching location/type)
  const similarProperties = allProperties
    .filter(p => p.id !== property.id && (p.location === property.location || p.propertyType === property.propertyType))
    .slice(0, 3);

  // Dynamic builder details
  const getBuilderInfo = (title) => {
    if (title.includes('24K')) return { name: 'Kolte-Patil Developers', brand: '24K Luxury Brand', reraId: 'A52100028461', desc: 'Kolte-Patil’s signature 24K brand stands for architectural design excellence, smart configurations, and high appreciation landmarks.' };
    if (title.includes('Godrej')) return { name: 'Godrej Properties', brand: 'Premium Luxury Homes', reraId: 'A52100012431', desc: 'Godrej Properties brings a legacy of innovation and trust, delivering high-end homes with advanced home automation and community features.' };
    if (title.includes('Kasturi')) return { name: 'Kasturi Builders', brand: 'Signature Penthouses', reraId: 'A52100045231', desc: 'Kasturi is renowned for architectural layouts, Italian marble finishes, premium design details, and ultra-high-end specifications.' };
    return { name: 'Tier-1 Authorized Developer', brand: 'Verified Portfolio Partner', reraId: 'A52100028461', desc: 'Managed under 24K Realtors authorized developer alliance program, verified for clear land title deed registrations.' };
  };
  const builder = getBuilderInfo(property.title);

  return (
    <div className="property-detail-page-wrapper" style={{ color: 'var(--text-light)', paddingBottom: '100px' }}>
      
      {/* Back button & RERA code */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0', flexWrap: 'wrap', gap: '15px' }}>
        <button onClick={onBack} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.88rem', cursor: 'pointer', borderRadius: '50px' }}>
          ← Back to Luxury Portfolio
        </button>
        <span style={{ fontSize: '0.78rem', background: 'rgba(212,175,55,0.1)', color: 'var(--gold-primary)', padding: '6px 14px', borderRadius: '50px', border: '1px solid rgba(212,175,55,0.2)', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={14} /> MahaRERA: {property.reraNumber || 'PRM/VERIFIED'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.8fr) minmax(300px, 1.2fr)', gap: '40px', marginTop: '20px' }}>
        
        {/* Left Column: Visuals, Floor Plans, Video, Blueprint */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
          
          {/* 1. Hero Gallery Image Slider */}
          <div style={{ position: 'relative', height: '480px', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(212, 175, 55, 0.15)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeSlide}
                src={slideshowImages[activeSlide]}
                alt={`Premium showcase view ${activeSlide + 1}`}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </AnimatePresence>

            {/* Gradient Overlay */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(7, 15, 30, 0.95), transparent)', zIndex: 2 }}></div>

            {/* Title / Info Overlay */}
            <div style={{ position: 'absolute', bottom: '24px', left: '24px', zIndex: 3 }}>
              <span style={{ background: 'var(--gold-primary)', color: '#070f1e', fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase', marginBottom: '8px', display: 'inline-block' }}>
                {property.transactionType}
              </span>
              <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-title)', color: '#fff', margin: '4px 0', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{property.title}</h1>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="var(--gold-primary)" /> {property.address || property.location}
              </p>
            </div>

            {/* Slider arrows */}
            <button onClick={prevSlide} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(7, 15, 30, 0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px', borderRadius: '50%', cursor: 'pointer', zIndex: 3 }}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextSlide} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(7, 15, 30, 0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px', borderRadius: '50%', cursor: 'pointer', zIndex: 3 }}>
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Slider Thumbnails */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '-15px' }}>
            {slideshowImages.map((img, index) => (
              <div 
                key={index} 
                onClick={() => setActiveSlide(index)}
                style={{ 
                  width: '90px', 
                  height: '60px', 
                  borderRadius: '8px', 
                  overflow: 'hidden', 
                  cursor: 'pointer', 
                  border: activeSlide === index ? '2px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.1)',
                  opacity: activeSlide === index ? 1 : 0.6,
                  transition: 'all 0.3s ease'
                }}
              >
                <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              </div>
            ))}
          </div>

          {/* Quick Specifications Banner */}
          <div style={{ background: 'rgba(10, 18, 36, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', textAlign: 'center' }}>
            <div style={{ borderRight: '1px solid rgba(255,255,255,0.08)' }}>
              <Bed size={22} color="var(--gold-primary)" style={{ margin: '0 auto 8px auto' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Configuration</span>
              <strong style={{ fontSize: '1.2rem', color: '#fff' }}>{isCommercial ? 'Commercial Office' : property.bedrooms > 0 ? `${property.bedrooms} BHK` : 'N/A'}</strong>
            </div>
            <div style={{ borderRight: '1px solid rgba(255,255,255,0.08)' }}>
              <Bath size={22} color="var(--gold-primary)" style={{ margin: '0 auto 8px auto' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Bathrooms</span>
              <strong style={{ fontSize: '1.2rem', color: '#fff' }}>{property.bathrooms} Baths</strong>
            </div>
            <div>
              <Maximize size={22} color="var(--gold-primary)" style={{ margin: '0 auto 8px auto' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Carpet Area</span>
              <strong style={{ fontSize: '1.2rem', color: '#fff' }}>{property.areaSquareFeet} sqft</strong>
            </div>
          </div>

          {/* 2. Interactive Custom SVG Floor Plan & Master Layout Visualizer */}
          <div style={{ background: 'rgba(10, 18, 36, 0.4)', border: '1px solid rgba(212, 175, 55, 0.15)', borderRadius: '16px', padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '15px' }}>
              <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '1.25rem', margin: 0 }}>📐 Layout Blueprints</h3>
              
              {/* Toggle Buttons */}
              <div style={{ display: 'inline-flex', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <button 
                  onClick={() => setActivePlan('floor')} 
                  style={{ background: activePlan === 'floor' ? 'var(--gold-primary)' : 'transparent', color: activePlan === 'floor' ? '#070f1e' : '#fff', border: 'none', padding: '6px 16px', borderRadius: '30px', fontSize: '0.78rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' }}
                >
                  Unit Floor Plan
                </button>
                <button 
                  onClick={() => setActivePlan('master')} 
                  style={{ background: activePlan === 'master' ? 'var(--gold-primary)' : 'transparent', color: activePlan === 'master' ? '#070f1e' : '#fff', border: 'none', padding: '6px 16px', borderRadius: '30px', fontSize: '0.78rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' }}
                >
                  Master Site Plan
                </button>
              </div>
            </div>

            {activePlan === 'floor' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }} className="floor-plan-grid">
                
                {/* SVG Blueprint */}
                <div style={{ background: 'rgba(7, 15, 30, 0.8)', border: '1px dashed rgba(212,175,55,0.3)', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'center', height: '260px' }}>
                  <svg viewBox="0 0 200 150" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.5))' }}>
                    <rect x="10" y="10" width="180" height="130" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="3,3" />
                    {/* Master Bedroom */}
                    <rect x="10" y="10" width="90" height="70" fill="rgba(212,175,55,0.05)" stroke="rgba(212,175,55,0.6)" strokeWidth="1" />
                    <text x="55" y="45" fill="rgba(255,255,255,0.8)" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Master Bed</text>
                    <text x="55" y="55" fill="var(--gold-secondary)" fontSize="7" textAnchor="middle" fontFamily="sans-serif">14' x 12'</text>
                    {/* Bathroom 1 */}
                    <rect x="100" y="10" width="40" height="40" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                    <text x="120" y="32" fill="rgba(255,255,255,0.5)" fontSize="6" textAnchor="middle">Bath</text>
                    {/* Living Room */}
                    <rect x="10" y="80" width="130" height="60" fill="rgba(212,175,55,0.08)" stroke="rgba(212,175,55,0.6)" strokeWidth="1" />
                    <text x="75" y="112" fill="rgba(255,255,255,0.8)" fontSize="8" textAnchor="middle" fontFamily="sans-serif">Living Space</text>
                    <text x="75" y="122" fill="var(--gold-secondary)" fontSize="7" textAnchor="middle" fontFamily="sans-serif">18' x 14'</text>
                    {/* Kitchen */}
                    <rect x="140" y="50" width="50" height="60" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                    <text x="165" y="82" fill="rgba(255,255,255,0.8)" fontSize="7" textAnchor="middle">Kitchen</text>
                    {/* Private Balcony Deck */}
                    <rect x="140" y="110" width="50" height="30" fill="rgba(46,196,182,0.05)" stroke="#2ec4b6" strokeWidth="1" />
                    <text x="165" y="128" fill="#2ec4b6" fontSize="6" textAnchor="middle" fontWeight="bold">Sky Deck</text>
                  </svg>
                </div>

                {/* Blueprint details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Super Built-Up Area Breakdown</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                    <span style={{ fontSize: '0.85rem' }}>Living & Dining Room</span>
                    <strong style={{ fontSize: '0.85rem', color: '#fff' }}>260 sqft</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                    <span style={{ fontSize: '0.85rem' }}>Master Bedroom Suite</span>
                    <strong style={{ fontSize: '0.85rem', color: '#fff' }}>175 sqft</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                    <span style={{ fontSize: '0.85rem' }}>Kitchen & Utility Yard</span>
                    <strong style={{ fontSize: '0.85rem', color: '#fff' }}>110 sqft</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                    <span style={{ fontSize: '0.85rem' }}>Double Balcony Deck</span>
                    <strong style={{ fontSize: '0.85rem', color: '#2ec4b6' }}>120 sqft</strong>
                  </div>
                  <button onClick={onOpenInquiry} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', fontSize: '0.78rem', marginTop: '8px', padding: '8px 12px' }}>
                    <Download size={12} /> Download PDF Architectural Dossier
                  </button>
                </div>
              </div>
            ) : (
              // Master Plan View
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }} className="floor-plan-grid">
                
                {/* Site layout placeholder */}
                <div style={{ background: 'rgba(7, 15, 30, 0.8)', border: '1px dashed rgba(212,175,55,0.3)', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'center', height: '260px' }}>
                  <svg viewBox="0 0 200 150" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.5))' }}>
                    {/* Club House Circle */}
                    <circle cx="100" cy="75" r="30" fill="rgba(212,175,55,0.05)" stroke="var(--gold-primary)" strokeWidth="1" />
                    <text x="100" y="78" fill="#fff" fontSize="6" textAnchor="middle">Luxury Club</text>
                    {/* Tower A */}
                    <rect x="20" y="20" width="40" height="40" rx="4" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                    <text x="40" y="42" fill="rgba(255,255,255,0.8)" fontSize="6" textAnchor="middle">Tower A</text>
                    {/* Tower B */}
                    <rect x="140" y="20" width="40" height="40" rx="4" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                    <text x="160" y="42" fill="rgba(255,255,255,0.8)" fontSize="6" textAnchor="middle">Tower B</text>
                    {/* Infinity Pool */}
                    <ellipse cx="100" cy="125" rx="35" ry="15" fill="rgba(46,196,182,0.05)" stroke="#2ec4b6" strokeWidth="1" />
                    <text x="100" y="128" fill="#2ec4b6" fontSize="6" textAnchor="middle">Infinity Pool</text>
                  </svg>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tower & Amenities Allocation</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                    Sprawling 12-acre premium gated community with only 4 towers. Over 75% open landscaped spaces, modern glass facades, dual podium levels, and complete multi-tier vehicle-free walkways.
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '5px' }}>
                    <span style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>Clubhouse: 25,000 sqft</span>
                    <span style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>Vehicle Free Zones</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Drone Walkthrough & Video Tours */}
          {property.videoUrl && (
            <div style={{ background: 'rgba(10, 18, 36, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '30px' }}>
              <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '1.25rem', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={20} /> Drone Virtual Walkthrough
              </h3>
              <div style={{ borderRadius: '12px', overflow: 'hidden', height: '340px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <iframe 
                  src={getEmbedVideoUrl(property.videoUrl)} 
                  title="Drone Tour"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* 4. Matterport 3D Walkthrough iframe */}
          {property.threeDTourUrl && (
            <div style={{ background: 'rgba(10, 18, 36, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '30px' }}>
              <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '1.25rem', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={20} /> Interactive 3D Virtual Space Tour
              </h3>
              <div style={{ borderRadius: '12px', overflow: 'hidden', height: '380px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <iframe 
                  src={property.threeDTourUrl} 
                  title="3D Space Tour"
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* 5. Detailed Luxury Amenities Section */}
          <div style={{ background: 'rgba(10, 18, 36, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '30px' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '1.25rem', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} /> Elite Lifestyle Features & Amenities
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <CheckCircle size={16} color="var(--gold-primary)" />
                <span style={{ fontSize: '0.88rem' }}>24/7 Concierge Desk</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <CheckCircle size={16} color="var(--gold-primary)" />
                <span style={{ fontSize: '0.88rem' }}>Infinity Sky Pool</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <CheckCircle size={16} color="var(--gold-primary)" />
                <span style={{ fontSize: '0.88rem' }}>Private Elevator Access</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <CheckCircle size={16} color="var(--gold-primary)" />
                <span style={{ fontSize: '0.88rem' }}>Automated Smart HVAC</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <CheckCircle size={16} color="var(--gold-primary)" />
                <span style={{ fontSize: '0.88rem' }}>Modular Kitchen Provisions</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <CheckCircle size={16} color="var(--gold-primary)" />
                <span style={{ fontSize: '0.88rem' }}>100% Power Backup Grid</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Booking desk, Location scores, Payment Plans, Mortgage Calculator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '35px' }}>
          
          {/* 1. Dynamic Pricing & Private Booking Box */}
          <div style={{ background: 'radial-gradient(circle at top left, rgba(20, 32, 54, 0.95) 0%, rgba(7, 15, 30, 0.98) 100%)', border: '2px solid var(--border-gold)', borderRadius: '20px', padding: '30px', boxShadow: '0 15px 35px rgba(0,0,0,0.4)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)', zIndex: 0 }}></div>
            
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '1px', zIndex: 1, position: 'relative' }}>Investment Value</span>
            <div style={{ fontSize: '2.4rem', fontWeight: 'bold', color: 'var(--gold-primary)', margin: '8px 0 20px 0', zIndex: 1, position: 'relative' }}>
              {formatPrice(property.price, property.transactionType)}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 1, position: 'relative' }}>
              <button 
                onClick={() => onOpenInquiry(property)} 
                className="btn-gold" 
                style={{ width: '100%', padding: '14px 0', fontSize: '0.92rem', justifyContent: 'center', cursor: 'pointer', borderRadius: '50px' }}
              >
                Inquire & Receive Brochure
              </button>
              <button 
                onClick={() => onOpenChauffeur(property)} 
                className="btn-outline" 
                style={{ width: '100%', padding: '14px 0', fontSize: '0.92rem', justifyContent: 'center', borderColor: 'var(--gold-secondary)', color: 'var(--gold-secondary)', cursor: 'pointer', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Car size={16} /> Book VIP Chauffeur Tour
              </button>
            </div>
            
            <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Status: <strong>{property.status}</strong></span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Brokerage: <strong>Zero</strong></span>
            </div>
          </div>

          {/* 2. Builder & Developer Profile */}
          <div style={{ background: 'rgba(10, 18, 36, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px' }}>
            <h4 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={18} /> Developer Dossier
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <strong style={{ fontSize: '1rem', color: '#fff' }}>{builder.name}</strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--gold-secondary)', fontWeight: 'bold' }}>License ID: {builder.reraId}</span>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                {builder.desc}
              </p>
            </div>
          </div>

          {/* 3. Detailed Cost Breakdown & Payment Plans */}
          <div style={{ background: 'rgba(10, 18, 36, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px' }}>
            <h4 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} /> Cost Breakdown Estimate
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Agreed Capital Cost (Agreement)</span>
                <strong>{formatPrice(property.price)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Stamp Duty (Estimated 6%)</span>
                <strong>{formatPrice(Number(property.price) * 0.06)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>GST (Estimated 5%)</span>
                <strong>{formatPrice(Number(property.price) * 0.05)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Development & Legal Charges</span>
                <strong>{formatPrice(150000)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                <span style={{ color: 'var(--gold-primary)' }}>Estimated All-Inclusive Total</span>
                <strong style={{ color: 'var(--gold-primary)' }}>{formatPrice(Number(property.price) * 1.11 + 150000)}</strong>
              </div>
            </div>

            <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '15px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', marginBottom: '12px' }}>Payment Schedule</span>
              
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                <button 
                  onClick={() => setActivePaymentPlan('subvention')}
                  style={{ flex: 1, padding: '6px 2px', fontSize: '0.7rem', background: activePaymentPlan === 'subvention' ? 'var(--gold-primary)' : 'rgba(255,255,255,0.03)', color: activePaymentPlan === 'subvention' ? '#070f1e' : '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  10:90 Subvention
                </button>
                <button 
                  onClick={() => setActivePaymentPlan('CLP')}
                  style={{ flex: 1, padding: '6px 2px', fontSize: '0.7rem', background: activePaymentPlan === 'CLP' ? 'var(--gold-primary)' : 'rgba(255,255,255,0.03)', color: activePaymentPlan === 'CLP' ? '#070f1e' : '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  CLP Progress
                </button>
              </div>

              {activePaymentPlan === 'subvention' ? (
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  💰 Pay <strong>10%</strong> down payment now. Remaining <strong>90%</strong> is bank financed with EMI subvention paid entirely by developer until possession handover certificate.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Booking Amount</span>
                    <strong>10%</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Plinth Commencement</span>
                    <strong>15%</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Slab 1 to 10 Casting</span>
                    <strong>40%</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Finishing & Handover</span>
                    <strong>35%</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. Location Analytics Scorecard & Local Commutes */}
          <div style={{ background: 'rgba(10, 18, 36, 0.4)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '24px' }}>
            <h4 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} /> Location Commute & Analytics
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Capital Appreciation Score</span>
                <strong style={{ color: '#ecc94b' }}>{scores?.appreciation || 8.0}/10</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>IT Hub Commute Score</span>
                <strong style={{ color: '#ecc94b' }}>{scores?.commute || 8.5}/10</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Eco Green Index</span>
                <strong style={{ color: '#ecc94b' }}>{scores?.green || 8.0}/10</strong>
              </div>
            </div>

            {landmarks && landmarks.length > 0 && (
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', marginBottom: '10px' }}>Local Infrastructure Hubs</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {landmarks.map((landmark, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', background: 'rgba(255,255,255,0.01)', padding: '6px 10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <span style={{ color: 'var(--text-light)' }}>{landmark.split('(')[0]}</span>
                      <span style={{ color: 'var(--gold-secondary)' }}>{landmark.includes('(') ? landmark.split('(')[1].replace(')', '') : 'Nearby'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 5. EMI Calculator */}
          <div style={{ background: 'rgba(10, 18, 36, 0.4)', border: '1px solid rgba(212, 175, 55, 0.15)', borderRadius: '16px', padding: '24px' }}>
            <h4 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={18} /> Interactive Mortgage Desk
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span>Down Payment ({downPayment}%)</span>
                  <strong>{formatPrice(Number(property.price) * (downPayment / 100))}</strong>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="60" 
                  value={downPayment} 
                  onChange={e => setDownPayment(Number(e.target.value))} 
                  style={{ width: '100%', accentColor: 'var(--gold-primary)', cursor: 'pointer' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Interest Rate (%)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={interestRate} 
                    onChange={e => setInterestRate(Number(e.target.value))} 
                    className="form-input" 
                    style={{ width: '100%', margin: 0, padding: '8px' }} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Term (Years)</label>
                  <input 
                    type="number" 
                    value={loanTerm} 
                    onChange={e => setLoanTerm(Number(e.target.value))} 
                    className="form-input" 
                    style={{ width: '100%', margin: 0, padding: '8px' }} 
                  />
                </div>
              </div>

              <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '10px', padding: '15px', textAlign: 'center', marginTop: '5px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Monthly EMI Outflow</span>
                <strong style={{ fontSize: '1.6rem', color: 'var(--gold-primary)', display: 'block', marginTop: '4px' }}>
                  {formatPrice(emi)} / mo
                </strong>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                  Computed on Loan Principal: {formatPrice(principal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ marginTop: '50px', background: 'rgba(10, 18, 36, 0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '30px' }}>
        <h3 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '1.25rem', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpCircle size={20} /> Compliance & Buying FAQ
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <details style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}>
            <summary style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#fff' }}>Is the title clear and RERA registration verified?</summary>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.5' }}>
              Yes, all properties onboarded under 24K Realtors undergo a strict 5-stage carpet and registry deed audit. The developer registration ID ({builder.reraId}) is registered with MahaRERA and compliant under Section 9 of the Real Estate Act, 2016.
            </p>
          </details>
          <details style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}>
            <summary style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#fff' }}>What does all-inclusive pricing comprise?</summary>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.5' }}>
              All-inclusive pricing covers basic agreement value, stamp duty, registration taxes, development and infrastructure charges, piped gas connection fees, and society corpus deposits as applicable under standard builder rules.
            </p>
          </details>
        </div>
      </div>

      {/* Similar Properties Section */}
      {similarProperties.length > 0 && (
        <div style={{ marginTop: '50px' }}>
          <h3 style={{ fontFamily: 'var(--font-title)', color: '#fff', fontSize: '1.4rem', marginBottom: '24px' }}>⚜️ Similar Curated Residences</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
            {similarProperties.map(sim => (
              <div 
                key={sim.id}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  // Simulate detail view change
                  onBack();
                  setTimeout(() => {
                    const el = document.getElementById(`property-${sim.id}`);
                    if (el) el.click();
                  }, 100);
                }}
                className="property-card"
                style={{ cursor: 'pointer', background: 'rgba(10, 18, 36, 0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}
              >
                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                  <img src={sim.imageUrl || slideshowImages[0]} alt={sim.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--gold-primary)', color: '#070f1e', fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '2px' }}>{sim.transactionType}</span>
                </div>
                <div style={{ padding: '16px' }}>
                  <h4 style={{ fontSize: '1rem', color: '#fff', margin: '0 0 4px 0', fontFamily: 'var(--font-title)' }}>{sim.title}</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📍 {sim.location}</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <strong style={{ color: 'var(--gold-primary)', fontSize: '1.05rem' }}>{formatPrice(sim.price, sim.transactionType)}</strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{sim.bedrooms} BHK | {sim.areaSquareFeet} sqft</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sticky Bottom Booking Bar */}
      <div 
        style={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          background: 'rgba(7, 15, 30, 0.85)', 
          backdropFilter: 'blur(20px)', 
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(212, 175, 55, 0.25)', 
          padding: '14px 40px', 
          zIndex: 999, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.5)'
        }}
        className="sticky-booking-bar"
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Valuation Mandate</span>
          <strong style={{ fontSize: '1.25rem', color: 'var(--gold-primary)' }}>{formatPrice(property.price, property.transactionType)}</strong>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a 
            href={waLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-gold" 
            style={{ padding: '10px 20px', borderRadius: '50px', background: '#2ec4b6', borderColor: '#2ec4b6', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: '#fff', textDecoration: 'none' }}
          >
            <MessageSquare size={14} /> WhatsApp Site Visit
          </a>
          <button 
            onClick={() => onOpenInquiry(property)} 
            className="btn-gold" 
            style={{ padding: '10px 20px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}
          >
            Inquire Now <ArrowRight size={14} />
          </button>
        </div>
      </div>

    </div>
  );
}
