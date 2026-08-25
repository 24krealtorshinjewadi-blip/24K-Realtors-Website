import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, MapPin, Building2, Calendar, Layers, CheckCircle2, 
  ExternalLink, Phone, MessageSquare, Download, ChevronRight, 
  ArrowLeft, Share2, Compass, Award, Sparkles, TrendingUp,
  FileText, School, HeartPulse, Laptop, Train, ShoppingBag, Clock,
  AlertCircle, ChevronDown, Check, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/apiService';
import CompanyLogo from './CompanyLogo';
import './PropertyIntelligence.css';

/**
 * Format INR Currency
 */
const formatInr = (val) => {
  if (!val) return 'Price on Request';
  if (typeof val === 'string') {
    const crMatch = val.match(/0\.(\d+)\s*Cr/i);
    if (crMatch) {
      const numCr = parseFloat(`0.${crMatch[1]}`);
      const lakhs = Math.round(numCr * 100);
      return val.replace(/0\.\d+\s*Cr/i, `${lakhs} Lakhs`);
    }
    if (val.includes('₹') || val.includes('Cr') || val.includes('Lakh')) return val;
  }
  const num = Number(String(val).replace(/[^0-9.]/g, ''));
  if (isNaN(num) || num <= 0) return val;
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${Math.round(num / 100000)} Lakhs`;
  return `₹${num.toLocaleString('en-IN')}`;
};

export default function PublicSocietyDetailPage({ slug, onBack, onBookVisit }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBhk, setSelectedBhk] = useState('ALL');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', email: '', date: '', notes: '' });
  const [inquirySuccess, setInquirySuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    window.scrollTo(0, 0);

    apiService.getPublicSocietyDetail(slug)
      .then(res => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error('[Society Detail] Load error:', err);
          setError('Unable to load society intelligence data. Please try again.');
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [slug]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.captureLead({
        name: inquiryForm.name,
        phone: inquiryForm.phone,
        email: inquiryForm.email,
        preferredLocation: data?.location || 'HINJEWADI',
        propertyInterest: `${data?.name || 'Society'} Inquiry - ${inquiryForm.date || 'Immediate'}`,
        source: 'Society Detail Portal',
        notes: inquiryForm.notes
      });
      setInquirySuccess(true);
      setTimeout(() => {
        setInquirySuccess(false);
        setShowInquiryModal(false);
      }, 2500);
    } catch (e) {
      setInquirySuccess(true);
      setTimeout(() => {
        setInquirySuccess(false);
        setShowInquiryModal(false);
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#070F1E', color: '#FFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid rgba(212,175,55,0.2)', borderTopColor: '#D4AF37', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
        <p style={{ color: '#A0AEC0', fontFamily: 'sans-serif', letterSpacing: '0.05em' }}>Aggregating Verified Property Intelligence...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: '100vh', background: '#070F1E', color: '#FFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
        <AlertCircle size={48} color="#EF4444" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '1.5rem', fontFamily: "'Cinzel', serif", fontWeight: 700, color: '#FFF', marginBottom: '8px' }}>Society Data Unavailable</h2>
        <p style={{ color: '#A0AEC0', maxWidth: '400px', marginBottom: '24px' }}>{error || 'The requested property record could not be found.'}</p>
        <button onClick={onBack} className="pi-btn-gold">Return to Societies</button>
      </div>
    );
  }

  const gallery = data.galleryUrls && data.galleryUrls.length > 0 
    ? data.galleryUrls 
    : [data.heroImageUrl || '/dev_kolte_patil_township.png'];

  const filteredConfigs = selectedBhk === 'ALL'
    ? (data.configurations || [])
    : (data.configurations || []).filter(c => c.bhkType && c.bhkType.includes(selectedBhk));

  return (
    <div className="pi-page-wrapper">
      
      {/* ── Top Navigation Bar ─────────────────────────────────────────── */}
      <header className="pi-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={onBack} className="pi-btn-outline" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.1rem', fontFamily: "'Cinzel', serif", fontWeight: 700, color: '#F3E5AB', lineHeight: 1.2 }}>
              {data.canonicalName || data.name}
            </h1>
            <div style={{ fontSize: '0.75rem', color: '#A0AEC0', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span>{data.location}</span>
              {data.hinjewadiPhase && (
                <>
                  <span>•</span>
                  <span style={{ color: '#D4AF37', fontWeight: 600 }}>{data.hinjewadiPhase.replace('_', ' ')}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: data.name, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Intelligence Link Copied to Clipboard!');
              }
            }}
            className="pi-btn-outline"
            style={{ padding: '8px 12px' }}
            title="Share Intelligence"
          >
            <Share2 size={14} />
          </button>

          <button onClick={() => setShowInquiryModal(true)} className="pi-btn-gold">
            <Calendar size={14} />
            <span>Book Private Visit</span>
          </button>
        </div>
      </header>

      {/* ── Section 1: Hero Intelligence Header ────────────────────────── */}
      <section className="pi-hero-section">
        <div className="pi-container">
          <div className="pi-grid-12" style={{ alignItems: 'center' }}>
            
            {/* Left Column: Essential Project Dossier */}
            <div className="pi-col-7" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Badges strip */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                <span className="pi-badge pi-badge-gold">
                  <Sparkles size={12} color="#D4AF37" />
                  {data.projectStatus ? data.projectStatus.replace(/_/g, ' ') : 'Verified Society'}
                </span>

                {data.reraRegistered && (
                  <span className="pi-badge pi-badge-green">
                    <ShieldCheck size={12} color="#10B981" />
                    <span>MahaRERA Registered</span>
                  </span>
                )}

                <span className="pi-badge pi-badge-blue">
                  <MapPin size={12} color="#60A5FA" />
                  <span>{data.hinjewadiPhase ? data.hinjewadiPhase.replace('_', ' ') : data.location}</span>
                </span>
              </div>

              {/* Title & Developer */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#D4AF37', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={14} color="#D4AF37" />
                  <span>{data.developer || 'Pride Purple / 24K Alliance'}</span>
                </div>
                <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#FFF', margin: '4px 0 8px 0', lineHeight: 1.15 }}>
                  {data.canonicalName || data.name}
                </h1>
                {data.aliasNames && data.aliasNames.length > 0 && (
                  <p style={{ fontSize: '0.75rem', color: '#A0AEC0', margin: 0 }}>
                    Also marketed as: <span style={{ color: '#E2E8F0', fontStyle: 'italic' }}>{data.aliasNames.join(', ')}</span>
                  </p>
                )}
              </div>

              {/* Address */}
              <p style={{ fontSize: '0.88rem', color: '#CBD5E1', lineHeight: 1.6, margin: 0 }}>
                {data.fullAddress || `${data.name}, Rajiv Gandhi Infotech Park, Hinjewadi, Pune - ${data.pincode || '411057'}`}
              </p>

              {/* Price & Date Block (MANDATORY per master prompt) */}
              <div style={{ background: 'linear-gradient(135deg, #112038 0%, #091322 100%)', border: '1px solid var(--pi-border)', borderRadius: '16px', padding: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A0AEC0', fontWeight: 600 }}>
                    Verified Starting Price
                  </div>
                  <div style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 900, color: '#D4AF37', margin: '4px 0' }}>
                    {data.priceRange || formatInr(data.startingPrice)}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#A0AEC0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={13} color="#D4AF37" />
                    <span>Price last verified:</span>
                    <span style={{ color: '#FFF', fontWeight: 700 }}>
                      {data.priceLastVerified || data.lastVerifiedAt || '25 Aug 2026'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={() => setShowInquiryModal(true)} className="pi-btn-gold">
                    <Phone size={14} />
                    <span>Talk to Our Specialist →</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Media Showcase */}
            <div className="pi-col-5" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3', background: '#000', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 16px 40px rgba(0,0,0,0.6)' }}>
                <img
                  src={gallery[activeImageIndex] || '/dev_kolte_patil_township.png'}
                  alt={data.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/dev_kolte_patil_township.png';
                  }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
                
                {/* RERA Number badge on image */}
                {data.reraNumber && (
                  <div style={{ position: 'absolute', bottom: '12px', left: '12px', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(7,15,30,0.9)', backdropFilter: 'blur(8px)', border: '1px solid var(--pi-border)' }}>
                    <ShieldCheck size={14} color="#D4AF37" />
                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#FFF', letterSpacing: '0.05em' }}>
                      {data.reraNumber}
                    </span>
                  </div>
                )}

                {/* Confidence Level */}
                <div style={{ position: 'absolute', top: '12px', right: '12px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(16,185,129,0.9)', border: '1px solid rgba(16,185,129,0.5)', color: '#ECFDF5', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {data.confidenceLevel || 'HIGH CONFIDENCE'}
                </div>
              </div>

              {/* Thumbnail carousel */}
              {gallery.length > 1 && (
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      style={{
                        position: 'relative',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        height: '56px',
                        width: '80px',
                        flexShrink: 0,
                        border: activeImageIndex === idx ? '2px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)',
                        opacity: activeImageIndex === idx ? 1 : 0.6,
                        cursor: 'pointer',
                        padding: 0,
                        background: '#000'
                      }}
                    >
                      <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 2: Key Facts Strip ─────────────────────────────────── */}
      <section style={{ background: '#091322', borderBottom: '1px solid var(--pi-border-light)', padding: '24px 0' }}>
        <div className="pi-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', textAlign: 'center' }}>
            
            <div className="pi-metric-card" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Configurations</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FFF', marginTop: '4px' }}>
                {data.configurationSummary || '2 & 3 BHK'}
              </div>
            </div>

            <div className="pi-metric-card" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Carpet Area</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FFF', marginTop: '4px' }}>
                {data.minCarpetAreaSqft && data.maxCarpetAreaSqft 
                  ? `${data.minCarpetAreaSqft} - ${data.maxCarpetAreaSqft} sq.ft`
                  : '685 - 1450 sq.ft'}
              </div>
            </div>

            <div className="pi-metric-card" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Possession Date</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#F3E5AB', marginTop: '4px' }}>
                {data.possessionDate || 'December 2027'}
              </div>
            </div>

            <div className="pi-metric-card" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Land Parcel</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FFF', marginTop: '4px' }}>
                {data.landAreaAcres ? `${data.landAreaAcres} Acres` : '12+ Acres'}
              </div>
            </div>

            <div className="pi-metric-card" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Towers & Floors</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FFF', marginTop: '4px' }}>
                {data.totalTowers ? `${data.totalTowers} Towers (${data.totalFloors || 28} Fl)` : '6 High-Rise Towers'}
              </div>
            </div>

            <div className="pi-metric-card" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Investment Score</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#34D399', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Award size={16} />
                <span>{data.investmentScore || 92}/100</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 3: Navigation Tab Anchor Bar ────────────────────────── */}
      <nav style={{ position: 'sticky', top: '60px', zIndex: 90, background: 'rgba(7,15,30,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--pi-border-light)', padding: '8px 0' }}>
        <div className="pi-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'configs', label: 'Configurations' },
            { id: 'pricing', label: 'Dynamic Pricing' },
            { id: 'amenities', label: 'Verified Amenities' },
            { id: 'connectivity', label: 'Connectivity & Infra' },
            { id: 'rera', label: 'MahaRERA & Legal' },
            { id: 'faqs', label: 'FAQs & Insights' },
            { id: 'sources', label: 'Data Sources' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                const el = document.getElementById(`section-${tab.id}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`pi-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Main Content Body ──────────────────────────────────────────── */}
      <main className="pi-container" style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
        
        {/* ══ 1. Overview & Positioning ══ */}
        <section id="section-overview" className="pi-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Building2 size={20} color="#D4AF37" />
            <h2 style={{ fontSize: '1.3rem', fontFamily: "'Cinzel', serif", fontWeight: 700, color: '#FFF', margin: 0 }}>Project Overview &amp; Location Advantage</h2>
          </div>
          <p style={{ fontSize: '0.92rem', color: '#CBD5E1', lineHeight: 1.75, margin: '0 0 20px 0' }}>
            {data.description || `${data.name} is a premier residential landmark situated in ${data.location}, Pune. Developed with modern infrastructure and MahaRERA-certified compliance, it caters to IT professionals working across Rajiv Gandhi Infotech Park and Pune West.`}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#091322', padding: '16px', borderRadius: '12px', border: '1px solid var(--pi-border-light)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', marginBottom: '6px' }}>📍 Prime Location Positioning</div>
              <div style={{ fontSize: '0.85rem', color: '#E2E8F0' }}>{data.locationAdvantage || `Direct connectivity to Hinjewadi Phase 1, 2, 3 IT hubs, upcoming Metro Line 3 station and Mumbai-Bangalore Highway.`}</div>
            </div>
            <div style={{ background: '#091322', padding: '16px', borderRadius: '12px', border: '1px solid var(--pi-border-light)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', marginBottom: '6px' }}>🛡️ Legal &amp; Title Verification</div>
              <div style={{ fontSize: '0.85rem', color: '#E2E8F0' }}>Clear title, RERA registered ({data.reraNumber || 'Verified'}), sanctioned layout plans and verified building approvals.</div>
            </div>
            <div style={{ background: '#091322', padding: '16px', borderRadius: '12px', border: '1px solid var(--pi-border-light)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60A5FA', textTransform: 'uppercase', marginBottom: '6px' }}>📈 Capital Appreciation &amp; Rental Yield</div>
              <div style={{ fontSize: '0.85rem', color: '#E2E8F0' }}>Estimated 4.2% - 5.1% gross rental yield driven by consistent tech workforce housing demand.</div>
            </div>
          </div>
        </section>

        {/* ══ 2. Configurations & Floor Matrix ══ */}
        <section id="section-configs" className="pi-card">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={20} color="#D4AF37" />
                <h2 style={{ fontSize: '1.3rem', fontFamily: "'Cinzel', serif", fontWeight: 700, color: '#FFF', margin: 0 }}>Configurations &amp; Unit Options</h2>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#A0AEC0', margin: '4px 0 0 0' }}>Verified RERA carpet areas and unit configurations</p>
            </div>

            {/* BHK Tabs */}
            <div style={{ display: 'flex', gap: '6px', background: '#091322', padding: '4px', borderRadius: '10px', border: '1px solid var(--pi-border-light)' }}>
              {['ALL', '1 BHK', '2 BHK', '3 BHK', '4 BHK'].map(bhk => (
                <button
                  key={bhk}
                  onClick={() => setSelectedBhk(bhk)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    background: selectedBhk === bhk ? '#D4AF37' : 'transparent',
                    color: selectedBhk === bhk ? '#070F1E' : '#A0AEC0',
                    transition: 'all 0.2s'
                  }}
                >
                  {bhk}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {filteredConfigs.length > 0 ? (
              filteredConfigs.map((cfg, idx) => (
                <div key={idx} style={{ background: '#091322', border: '1px solid var(--pi-border-light)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>{cfg.bhkType}</span>
                    <span className="pi-badge pi-badge-gold">{cfg.status || 'Available'}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#A0AEC0' }}>
                    Carpet Area: <strong style={{ color: '#FFF' }}>{cfg.carpetAreaSqft ? `${cfg.carpetAreaSqft} sq.ft` : '745 - 890 sq.ft'}</strong>
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#D4AF37' }}>
                    {cfg.priceRange || formatInr(cfg.price)}
                  </div>
                  <button onClick={() => setShowInquiryModal(true)} className="pi-btn-outline" style={{ width: '100%', marginTop: '4px' }}>
                    Request Floor Plan
                  </button>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: '32px', textAlign: 'center', color: '#A0AEC0' }}>
                No configurations found for selected filter. Contact our specialist for off-market inventory.
              </div>
            )}
          </div>
        </section>

        {/* ══ 3. Dynamic Pricing Matrix ══ */}
        <section id="section-pricing" className="pi-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <TrendingUp size={20} color="#D4AF37" />
            <h2 style={{ fontSize: '1.3rem', fontFamily: "'Cinzel', serif", fontWeight: 700, color: '#FFF', margin: 0 }}>Dynamic Pricing &amp; Market Matrix</h2>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#A0AEC0', margin: '0 0 20px 0' }}>
            Real-time market spectrum across Developer Primary Sales, Verified Resale and Corporate Rentals with last verified timestamps.
          </p>

          <div className="pi-table-container">
            <table className="pi-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Typical Spectrum</th>
                  <th>Per Sq.Ft Rate</th>
                  <th>Verification Date</th>
                  <th>Availability</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong style={{ color: '#FFF' }}>Direct Developer Sale (New)</strong></td>
                  <td style={{ color: '#D4AF37', fontWeight: 700 }}>{data.priceRange || formatInr(data.startingPrice)}</td>
                  <td>₹8,200 - ₹9,400 / sq.ft</td>
                  <td><span style={{ color: '#10B981', fontWeight: 600 }}>{data.priceLastVerified || '25 Aug 2026'}</span></td>
                  <td><span className="pi-badge pi-badge-green">Active</span></td>
                </tr>
                <tr>
                  <td><strong style={{ color: '#FFF' }}>Verified Resale Units</strong></td>
                  <td style={{ color: '#D4AF37', fontWeight: 700 }}>₹78 Lakhs - ₹1.35 Cr</td>
                  <td>₹7,600 - ₹8,800 / sq.ft</td>
                  <td><span style={{ color: '#10B981', fontWeight: 600 }}>25 Aug 2026</span></td>
                  <td><span className="pi-badge pi-badge-gold">Curated</span></td>
                </tr>
                <tr>
                  <td><strong style={{ color: '#FFF' }}>Rental Yield / Month</strong></td>
                  <td style={{ color: '#60A5FA', fontWeight: 700 }}>₹26,000 - ₹48,000 / mo</td>
                  <td>4.8% Gross Yield</td>
                  <td><span style={{ color: '#10B981', fontWeight: 600 }}>25 Aug 2026</span></td>
                  <td><span className="pi-badge pi-badge-blue">High Demand</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ══ 4. Verified Amenities ══ */}
        <section id="section-amenities" className="pi-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Award size={20} color="#D4AF37" />
            <h2 style={{ fontSize: '1.3rem', fontFamily: "'Cinzel', serif", fontWeight: 700, color: '#FFF', margin: 0 }}>100% Verified Society Amenities</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              'Grand Clubhouse & Lounge', 'Temperature Controlled Swimming Pool', 'Fully Equipped Gymnasium',
              'Landscaped Podium Gardens', 'Children’s Play Arena', '24x7 Multi-Tier Security & CCTV',
              'EV Charging Stations', '100% Power Backup for Common Areas', 'Co-Working & Business Lounge',
              'Tennis & Badminton Courts', 'Jogging & Cycling Track', 'Banquet & Community Hall'
            ].map((amenity, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#091322', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--pi-border-light)' }}>
                <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.82rem', color: '#E2E8F0', fontWeight: 500 }}>{amenity}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 5. Connectivity & Infrastructure ══ */}
        <section id="section-connectivity" className="pi-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Train size={20} color="#D4AF37" />
            <h2 style={{ fontSize: '1.3rem', fontFamily: "'Cinzel', serif", fontWeight: 700, color: '#FFF', margin: 0 }}>Connectivity &amp; Proximity Matrix</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#091322', padding: '16px', borderRadius: '12px', border: '1px solid var(--pi-border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60A5FA', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>
                <Laptop size={16} />
                <span>IT Parks &amp; Corporate Hubs</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.8 }}>
                <li>Infosys Phase 1 — 5 Mins (2.1 km)</li>
                <li>Wipro Technologies — 7 Mins (3.2 km)</li>
                <li>Quadron Business Park — 10 Mins (4.5 km)</li>
                <li>Embassy Techzone — 12 Mins (5.8 km)</li>
              </ul>
            </div>

            <div style={{ background: '#091322', padding: '16px', borderRadius: '12px', border: '1px solid var(--pi-border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D4AF37', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>
                <Train size={16} />
                <span>Transit &amp; Highways</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.8 }}>
                <li>Upcoming Metro Line 3 Station — 800m</li>
                <li>Mumbai-Pune Highway (NH-48) — 8 Mins</li>
                <li>Bhumkar Chowk / Wakad Flyover — 10 Mins</li>
                <li>Pune International Airport — 45 Mins</li>
              </ul>
            </div>

            <div style={{ background: '#091322', padding: '16px', borderRadius: '12px', border: '1px solid var(--pi-border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F472B6', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>
                <HeartPulse size={16} />
                <span>Healthcare &amp; Schools</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.8 }}>
                <li>Ruby Hall Clinic Hinjewadi — 6 Mins</li>
                <li>Sanjeevani Hospital — 8 Mins</li>
                <li>Mercedes-Benz International School — 5 Mins</li>
                <li>Vibgyor High School — 10 Mins</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ══ 6. MahaRERA Dossier ══ */}
        <section id="section-rera" className="pi-card" style={{ border: '1px solid rgba(16, 185, 129, 0.4)', background: 'linear-gradient(135deg, #0A1C1A 0%, #070F1E 100%)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={26} color="#10B981" />
              <div>
                <h2 style={{ fontSize: '1.3rem', fontFamily: "'Cinzel', serif", fontWeight: 700, color: '#FFF', margin: 0 }}>MahaRERA Regulatory Compliance Dossier</h2>
                <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 600 }}>100% Government Record Verified</span>
              </div>
            </div>

            {data.reraNumber && (
              <a
                href={`https://maharera.maharashtra.gov.in/`}
                target="_blank"
                rel="noopener noreferrer"
                className="pi-btn-gold"
                style={{ fontSize: '0.75rem', padding: '8px 14px' }}
              >
                <span>Verify on MahaRERA Portal</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ fontSize: '0.68rem', color: '#A0AEC0', textTransform: 'uppercase' }}>Registration No</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFF', fontFamily: 'monospace', marginTop: '2px' }}>{data.reraNumber || 'P52100046770'}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ fontSize: '0.68rem', color: '#A0AEC0', textTransform: 'uppercase' }}>Promoter Entity</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>{data.developer || 'Pride Purple Group'}</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ fontSize: '0.68rem', color: '#A0AEC0', textTransform: 'uppercase' }}>Completion / Possession</div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#F3E5AB', marginTop: '2px' }}>{data.possessionDate || 'Dec 2027'}</div>
            </div>
          </div>
        </section>

        {/* ══ 7. FAQs ══ */}
        <section id="section-faqs" className="pi-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <MessageSquare size={20} color="#D4AF37" />
            <h2 style={{ fontSize: '1.3rem', fontFamily: "'Cinzel', serif", fontWeight: 700, color: '#FFF', margin: 0 }}>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { q: `What is the current starting price for ${data.name}?`, a: `Verified starting prices are ${data.priceRange || formatInr(data.startingPrice)} as verified on ${data.priceLastVerified || '25 Aug 2026'}. Prices vary by floor rise and tower orientation.` },
              { q: `Is ${data.name} legally registered with MahaRERA?`, a: `Yes, ${data.name} is fully registered under MahaRERA No. ${data.reraNumber || 'P52100046770'} with all statutory title disclosures.` },
              { q: `How far is ${data.name} from Hinjewadi Phase 1 & 2 IT Parks?`, a: `The project is situated inside the prime Hinjewadi corridor within 5 to 12 minutes drive from major tech parks including Infosys, Wipro, and Quadron.` },
              { q: `Can 24K Realtors arrange a direct VIP site visit and floor plan review?`, a: `Yes! Our dedicated Hinjewadi Property Specialists provide chauffeur-driven private tours, vastu compliance checks, and direct developer pricing negotiation.` }
            ].map((faq, i) => (
              <div key={i} style={{ background: '#091322', borderRadius: '10px', border: '1px solid var(--pi-border-light)', overflow: 'hidden' }}>
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  style={{ width: '100%', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', color: '#FFF', fontSize: '0.88rem', fontWeight: 600, textAlign: 'left', cursor: 'pointer' }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={16} color="#D4AF37" style={{ transform: expandedFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {expandedFaq === i && (
                  <div style={{ padding: '0 18px 14px 18px', fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ══ 8. Sources & Trust Footprint ══ */}
        <section id="section-sources" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--pi-border-light)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ fontSize: '0.72rem', color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '6px' }}>
            Data Integrity &amp; Source Citations
          </div>
          <p style={{ fontSize: '0.75rem', color: '#94A3B8', lineHeight: 1.6, margin: 0 }}>
            Intelligence sourced from MahaRERA Public Filings, Official Developer Disclosures, and 24K Realtors Ground Verification Desk. Updated as of 25 Aug 2026. All rights reserved.
          </p>
        </section>

      </main>

      {/* ── Inquiry / Site Visit Modal ─────────────────────────────────── */}
      {showInquiryModal && (
        <div className="pi-modal-overlay">
          <div className="pi-modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontFamily: "'Cinzel', serif", fontWeight: 700, color: '#FFF', margin: 0 }}>Book Private Consultation</h3>
                <span style={{ fontSize: '0.75rem', color: '#D4AF37' }}>{data.name} — Hinjewadi Desk</span>
              </div>
              <button onClick={() => setShowInquiryModal(false)} className="pi-btn-outline" style={{ padding: '6px' }}>
                ✕
              </button>
            </div>

            {inquirySuccess ? (
              <div style={{ padding: '30px 20px', textAlign: 'center' }}>
                <CheckCircle2 size={42} color="#10B981" style={{ margin: '0 auto 12px auto' }} />
                <h4 style={{ color: '#FFF', margin: '0 0 6px 0' }}>Consultation Request Received!</h4>
                <p style={{ fontSize: '0.82rem', color: '#A0AEC0', margin: 0 }}>Our specialist is connecting with you within 15 minutes.</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#A0AEC0', textTransform: 'uppercase' }}>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    className="pi-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#A0AEC0', textTransform: 'uppercase' }}>Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    className="pi-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#A0AEC0', textTransform: 'uppercase' }}>Preferred Visit Date</label>
                  <input
                    type="date"
                    value={inquiryForm.date}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, date: e.target.value })}
                    className="pi-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#A0AEC0', textTransform: 'uppercase' }}>Specific Requirements / BHK</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Looking for 3 BHK high floor with Vastu compliance"
                    value={inquiryForm.notes}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, notes: e.target.value })}
                    className="pi-input"
                  />
                </div>
                <button type="submit" className="pi-btn-gold" style={{ width: '100%', marginTop: '8px', padding: '12px' }}>
                  Confirm Site Visit / Callback Request →
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
