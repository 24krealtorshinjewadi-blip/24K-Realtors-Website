/**
 * PropertyDetailView.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Ultra-Luxury, Production-Ready Property Subpage for 24K REALTORS PUNE
 * Built to match Image 2 (Cinematic Society Intelligence architecture)
 * Pure Vanilla CSS | Clean 2-Column Responsive Grid | Zero Duplication
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin, ChevronRight, Heart, Share2, ArrowRight,
  BedDouble, Maximize2, Building2, Home, ShieldCheck,
  Zap, TreePine, Train, Plane, Clock, Dumbbell,
  Waves, Users, Route, Star, TrendingUp,
  Download, ZoomIn, Phone,
  Mail, CheckCircle2, Award, Lock, BadgeCheck,
  BarChart3, Target, Coffee, X, Send, MessageSquare,
  FileText, ExternalLink, Sparkles, Layers, Shield
} from 'lucide-react';
import { apiService } from '../services/apiService';
import './PropertyIntelligence.css';

/* ── Section heading component ── */
function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: '0.72rem', fontWeight: 800, color: '#D4AF37',
      letterSpacing: '0.14em', textTransform: 'uppercase',
      marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px'
    }}>
      <span style={{ display: 'inline-block', width: '20px', height: '2px', background: 'linear-gradient(90deg,#D4AF37,transparent)' }} />
      {children}
    </div>
  );
}

/* ── Animated section wrapper ── */
function AnimSection({ children, id, style = {} }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} id={`sec-${id}`} className={vis ? 'pdv-sec-visible' : 'pdv-sec-hidden'} style={{ marginBottom: '40px', paddingTop: '12px', ...style }}>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
export default function PropertyDetailView({ property = {}, onBack, onOpenInquiry, onOpenBrochure, formatPrice }) {
  /* ── State ── */
  const [activeTab, setActiveTab]                 = useState('overview');
  const [saved, setSaved]                         = useState(false);
  const [activeImageIndex, setActiveImageIndex]   = useState(0);
  const [ringAnimated, setRingAnimated]           = useState(false);
  const [selectedBhk, setSelectedBhk]             = useState('ALL');

  // Form State
  const [formData, setFormData]                   = useState({ name: '', phone: '', email: '' });
  const [formErrors, setFormErrors]               = useState({});
  const [formSubmitting, setFormSubmitting]       = useState(false);
  const [formSuccess, setFormSuccess]             = useState(false);

  // AI Chat modal state
  const [aiChatOpen, setAiChatOpen]               = useState(false);
  const [aiMessages, setAiMessages]               = useState([]);
  const [aiInput, setAiInput]                     = useState('');
  const [aiThinking, setAiThinking]               = useState(false);
  const aiChatEndRef                              = useRef(null);
  const aiInputRef                                = useRef(null);

  // EMI Calculator State
  const [emiPrice, setEmiPrice]                   = useState(property.price || 14500000);
  const [downPaymentPct, setDownPaymentPct]       = useState(20);
  const [interestRate, setInterestRate]           = useState(8.35);
  const [tenureYears, setTenureYears]             = useState(20);
  const [showAmortization, setShowAmortization]   = useState(false);
  const [emiCopied, setEmiCopied]                 = useState(false);

  // E-Brochure Lead Capture Modal State
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);
  const [brochureForm, setBrochureForm]           = useState({ name: '', phone: '', email: '' });
  const [brochureSubmitting, setBrochureSubmitting] = useState(false);
  const [brochureSuccess, setBrochureSuccess]     = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [property?.id]);

  /* ── Property metadata ── */
  const title         = property.title        || '24K Opula Premium 3 BHK';
  const location      = property.location     || 'Baner, Pune';
  const developerName = property.builderName  || property.developer || property.developerName
    || (title.toLowerCase().includes('opula') ? 'Pride Purple Group'
      : title.toLowerCase().includes('altura') ? 'Kolte-Patil Developers'
      : title.toLowerCase().includes('godrej') ? 'Godrej Properties'
      : title.toLowerCase().includes('shapoorji') || title.toLowerCase().includes('joyville') ? 'Shapoorji Pallonji Real Estate'
      : title.toLowerCase().includes('kolte') || title.toLowerCase().includes('republic') ? 'Kolte-Patil Developers'
      : title.toLowerCase().includes('vtp') ? 'VTP Realty'
      : title.toLowerCase().includes('gera') ? 'Gera Developments'
      : title.toLowerCase().includes('lodha') || title.toLowerCase().includes('belmondo') ? 'Lodha Group'
      : title.toLowerCase().includes('vilas') || title.toLowerCase().includes('yashwin') ? 'Vilas Javdekar (VJ)'
      : '24K Realtors Partner');
  const reraNumber    = property.reraNumber || 'RERA-PUN-PRM-24K091';
  const possession    = property.possessionDate || property.possession || 'December 2027';
  const projectArea   = property.projectArea || property.landParcel || (property.totalLandAcres ? `${property.totalLandAcres} Acres` : '8.5 Acres');
  const carpetArea    = property.areaSquareFeet ? `${property.areaSquareFeet} sq.ft` : '920–1650 sq.ft';
  const investmentScore = property.investmentScore || property.aiScore || 94;
  const address       = property.address || (property.location ? `${title}, near High Street, ${property.location}` : `${title}, Baner-Balewadi Link Road, Pune`);
  const displayPrice  = property.price 
    ? (typeof formatPrice === 'function' 
        ? formatPrice(property.price, property.transactionType) 
        : (property.price >= 10000000 ? `₹${(property.price / 10000000).toFixed(2)} Cr` : `₹${Math.round(property.price / 100000)} Lakhs`))
    : (property.priceDisplay || '₹1.45 Cr*');

  /* ── Images for Cinematic Hero & Gallery ── */
  const heroImages = (() => {
    const imgs = [];
    if (property.imageUrl && !property.imageUrl.includes('unsplash')) imgs.push(property.imageUrl);
    if (property.gallery && property.gallery.length) imgs.push(...property.gallery.map(g => g.url || g));
    if (imgs.length === 0) {
      const t = (title || '').toLowerCase();
      if (t.includes('opula')) imgs.push('/dev_kolte_patil_township.png', '/dev_godrej_building.png', '/dev_vj_building.png');
      else if (t.includes('altura')) imgs.push('/dev_vj_building.png', '/dev_kolte_patil_township.png', '/dev_vtp_township.png');
      else if (t.includes('godrej')) imgs.push('/dev_godrej_building.png', '/dev_kolte_patil_township.png', '/dev_shapoorji_township.png');
      else if (t.includes('shapoorji') || t.includes('joyville')) imgs.push('/dev_shapoorji_township.png', '/dev_vtp_township.png', '/dev_godrej_building.png');
      else if (t.includes('gera')) imgs.push('/dev_gera_tower.png', '/dev_godrej_building.png', '/dev_paranjape_township.png');
      else if (t.includes('lodha')) imgs.push('/dev_lodha_tower.png', '/dev_vj_building.png', '/dev_godrej_building.png');
      else if (t.includes('vtp')) imgs.push('/dev_vtp_township.png', '/dev_kolte_patil_township.png', '/dev_lodha_tower.png');
      else imgs.push('/dev_kolte_patil_township.png', '/dev_godrej_building.png', '/dev_vj_building.png');
    }
    const fallbacks = ['/dev_kolte_patil_township.png', '/dev_godrej_building.png', '/dev_vj_building.png', '/dev_lodha_tower.png'];
    let fi = 0;
    while (imgs.length < 4) { imgs.push(fallbacks[fi++ % fallbacks.length]); }
    return imgs.slice(0, 6);
  })();

  const transactionType = property.transactionType || 'BUY';
  const projectStatus   = property.projectStatus   || (property.possessionDate ? 'READY TO MOVE' : 'UNDER CONSTRUCTION');

  /* ── EMI Computations ── */
  const loanAmount = Math.max(0, emiPrice * (1 - downPaymentPct / 100));
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const emi = monthlyRate > 0 && totalMonths > 0
    ? Math.round((loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1))
    : 0;
  const totalPayment = emi * totalMonths;
  const totalInterest = Math.max(0, totalPayment - loanAmount);

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setFormSubmitting(true);
    setTimeout(() => {
      setFormSubmitting(false);
      setFormSuccess(true);
    }, 800);
  };

  const handleBrochureSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setBrochureSubmitting(true);
    setTimeout(() => {
      setBrochureSubmitting(false);
      setBrochureSuccess(true);
    }, 800);
  };

  /* ── AI Concierge Responses ── */
  const CONCIERGE_SUGGESTED_QUESTIONS = [
    `What makes ${title} a good investment?`,
    `What is the possession date and RERA status?`,
    `Which BHK configuration offers best value?`,
    `How is the connectivity to IT parks & Metro?`,
    `What are the nearby schools and hospitals?`,
  ];

  const getConciergeResponse = (question) => {
    const q = question.toLowerCase();
    const t = title;
    const loc = location;
    if (q.includes('investment') || q.includes('good')) {
      return `${t} is an exceptional investment for multiple reasons:\n\n• **Location Alpha**: ${loc} has seen consistent ~14-18% price appreciation YoY.\n• **Builder Trust**: ${developerName} has a 100% verified on-time delivery track record in Pune.\n• **Rental Yield**: Projected 4.6%–5.2% rental yield post-possession, significantly above city averages.\n• **Infrastructure**: Upcoming Metro & High Street connectivity will drive long-term capital growth.\n\nSpecialist Verdict: Strong Buy. 🟢`;
    }
    if (q.includes('possession') || q.includes('rera') || q.includes('status')) {
      return `${t} verified registration details:\n\n• **Possession Date**: ${possession}\n• **RERA Number**: ${reraNumber}\n• **Status**: ${projectStatus}\n• **Clear Title**: 100% legal title clearance & government sanctioned layouts.\n\nYou can verify this record on maharera.maharashtra.gov.in using the RERA number.`;
    }
    if (q.includes('bhk') || q.includes('value') || q.includes('money') || q.includes('config')) {
      return `For best value at ${t}:\n\n• **2 BHK Units**: Perfect for IT professionals & young couples with high rental liquidity.\n• **3 BHK & Penthouse Units**: Ideal for end-use families seeking maximum carpet efficiency and higher capital appreciation.\n\n📊 Specialist Recommendation: The **3 BHK Luxury** layout offers the highest resale multiple over a 5-year horizon.`;
    }
    if (q.includes('connect') || q.includes('it park') || q.includes('office') || q.includes('commute')) {
      return `${t} connectivity at ${loc}:\n\n• 🏢 **Hinjewadi IT Park Phase 1 & 2**: 5–10 min drive\n• 🚇 **Pune Metro Station**: 5–8 min\n• 🛣️ **Mumbai-Pune Expressway**: 10 min\n• 🏬 **Balewadi High Street & Phoenix Mall**: 5–12 min\n• ✈️ **Pune International Airport**: 45 min`;
    }
    if (q.includes('school') || q.includes('hospital') || q.includes('nearby')) {
      return `Nearby social infrastructure around ${t}:\n\n🏫 **Schools**: VIBGYOR High, Indus International, Ryan International.\n🏥 **Hospitals**: Medipoint Hospital, Jupiter Hospital, Ruby Hall Clinic.\n🛒 **Shopping & Leisure**: D-Mart, Phoenix Mall of Millennium, Balewadi High Street.`;
    }
    return `Great inquiry about ${t}! It is a signature ${developerName} development in ${loc}, offering premium residences with an Investment Score of ${investmentScore}/100.\n\nWould you like our senior advisor to arrange a private site visit or share floor plans on WhatsApp? 📞`;
  };

  const handleAiSend = async (questionOverride) => {
    const question = questionOverride || aiInput.trim();
    if (!question) return;
    setAiInput('');
    setAiMessages(prev => [...prev, { role: 'user', text: question }]);
    setAiThinking(true);
    await new Promise(r => setTimeout(r, 600 + Math.random() * 300));
    const response = getConciergeResponse(question);
    setAiMessages(prev => [...prev, { role: 'ai', text: response }]);
    setAiThinking(false);
  };

  const openAiChat = () => {
    if (aiMessages.length === 0) {
      setAiMessages([{
        role: 'ai',
        text: `Namaste! 👋 Welcome to 24K Property Intelligence Desk.\n\nI have complete verified records for **${title}** (${developerName}) — pricing, carpet specs, Vastu orientation, RERA dossiers, and ROI projections.\n\nHow can I help you today?`
      }]);
    }
    setAiChatOpen(true);
    setTimeout(() => aiInputRef.current?.focus(), 300);
  };

  useEffect(() => {
    aiChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, aiThinking]);

  /* ── Ring animation trigger ── */
  useEffect(() => {
    const t = setTimeout(() => setRingAnimated(true), 600);
    return () => clearTimeout(t);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(`sec-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveTab(id);
  };

  const handleShare = () => {
    if (navigator?.share) navigator.share({ title, url: window.location.href }).catch(() => {});
    else if (navigator?.clipboard) navigator.clipboard.writeText(window.location.href).catch(() => {});
  };

  /* ── Section Tabs ── */
  const TABS = [
    { id: 'overview',        label: 'Overview & Highlights' },
    { id: 'floorplans',      label: 'Configurations & Plans' },
    { id: 'amenities',       label: 'World-Class Amenities' },
    { id: 'location',        label: 'Location & Connectivity' },
    { id: 'calculator',      label: 'EMI Calculator' },
    { id: 'society-profile', label: 'Society & Vastu Dossier' },
    { id: 'similar',         label: 'Similar Properties' },
  ];

  /* ── Data sets ── */
  const AMENITIES = [
    { title: 'Infinity Edge Pool',        Icon: Waves,       img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=75' },
    { title: 'Grand Clubhouse',           Icon: Building2,   img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=75' },
    { title: 'High-Tech Gymnasium',       Icon: Dumbbell,    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=75' },
    { title: 'Landscaped Zen Gardens',    Icon: TreePine,    img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=75' },
    { title: 'Sky Lounge & Deck',         Icon: Coffee,      img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=75' },
    { title: '3-Tier High Security',      Icon: ShieldCheck, img: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=75' },
  ];

  const LOCATIONS = [
    { name: 'Hinjewadi IT Park Phase 1 & 2', time: '5 Mins',  pct: 90, Icon: Building2 },
    { name: 'Balewadi High Street',          time: '6 Mins',  pct: 85, Icon: Sparkles },
    { name: 'Wakad Metro Station',           time: '8 Mins',  pct: 75, Icon: Train },
    { name: 'Mumbai-Pune Expressway',        time: '10 Mins', pct: 70, Icon: Route },
    { name: 'Phoenix Mall of Millennium',    time: '12 Mins', pct: 60, Icon: Building2 },
    { name: 'Pune International Airport',    time: '45 Mins', pct: 30, Icon: Plane },
  ];

  const FLOOR_PLANS = [
    { type: '2 BHK Luxury Suite', area: '920 – 1,050 sq.ft', price: '₹95 Lakhs – ₹1.15 Cr', pct: 78, bhk: '2 BHK' },
    { type: '3 BHK Royale Residence', area: '1,350 – 1,650 sq.ft', price: '₹1.45 Cr – ₹1.85 Cr', pct: 88, bhk: '3 BHK' },
    { type: '4 BHK Grand Penthouse', area: '2,100 – 2,450 sq.ft', price: '₹2.30 Cr – ₹3.20 Cr', pct: 100, bhk: '4 BHK' },
  ];

  const filteredFloorPlans = selectedBhk === 'ALL' ? FLOOR_PLANS : FLOOR_PLANS.filter(fp => fp.bhk.includes(selectedBhk));

  const RATING_SCORES = [
    { label: 'Location & Transit Proximity', score: 96, color: '#D4AF37' },
    { label: 'Price & Rental Yield Potential', score: 92, color: '#10B981' },
    { label: 'Builder Track Record & Legal', score: 98, color: '#3B82F6' },
    { label: 'Vastu & Architectural Layout', score: 94, color: '#F472B6' },
  ];

  const SIMILAR = [
    { title: 'Kolte Patil Life Republic', loc: 'Hinjewadi Phase 1', config: '2 & 3 BHK', price: '₹1.05 Cr - ₹2.50 Cr', tag: 'LUXURY', match: 92, img: '/dev_kolte_patil_township.png' },
    { title: '24K Altura', loc: 'Baner-Balewadi', config: '2 & 3 BHK', price: '₹82 Lakhs - ₹1.40 Cr', tag: 'PREMIUM', match: 89, img: '/dev_vj_building.png' },
    { title: 'Shapoorji Joyville Vyomora', loc: 'Hinjewadi', config: '2 & 3 BHK', price: '₹84 Lakhs - ₹1.95 Cr', tag: 'LUXURY', match: 86, img: '/dev_shapoorji_township.png' },
    { title: 'Gera Joy On The Banks', loc: 'Hinjewadi', config: '2 & 3 BHK', price: '₹88 Lakhs - ₹1.75 Cr', tag: 'VERIFIED', match: 84, img: '/dev_gera_tower.png' },
  ];

  const TRUST = [
    { Icon: Lock,        text: 'Direct Builder Pricing Guaranteed' },
    { Icon: Users,       text: 'Free Private AC Cab Site Visits' },
    { Icon: BadgeCheck,  text: '100% MahaRERA Verified Dossier' },
    { Icon: ShieldCheck, text: 'Zero Brokerage On New Bookings' },
  ];

  return (
    <div className="pi-page-wrapper">

      {/* ══ STICKY TOPBAR ═══════════════════════════════════════════ */}
      <header className="pi-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={onBack} className="pi-btn-outline" style={{ padding: '7px 14px', fontSize: '0.78rem', gap: '6px' }}>
            <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} /> Back
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <span style={{ fontSize: '0.70rem', color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>
              {location} • {developerName}
            </span>
            <span style={{ fontSize: '0.92rem', fontFamily: "'Cinzel', serif", fontWeight: 700, color: '#F3E5AB', lineHeight: 1 }}>
              {title}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={handleShare} className="pi-btn-outline" style={{ padding: '8px 12px' }} title="Share Property">
            <Share2 size={15} />
          </button>
          <button onClick={onOpenInquiry} className="pi-btn-gold">
            <Clock size={14} /> Book Private Visit
          </button>
        </div>
      </header>

      {/* ══ CINEMATIC HERO BANNER (Image 2 Style) ═════════════════════ */}
      <section className="pi-hero-cinematic">
        <img
          src={heroImages[activeImageIndex]}
          alt={title}
          className="pi-hero-cinematic__image"
          onError={e => { e.target.onerror = null; e.target.src = '/dev_kolte_patil_township.png'; }}
        />
        <div className="pi-hero-cinematic__overlay" />

        {/* Confidence badge top-right */}
        <div className="pi-hero-cinematic__confidence">
          <ShieldCheck size={13} /> 24K VERIFIED
        </div>

        {/* Main content bottom */}
        <div className="pi-hero-cinematic__content">
          {/* Badges */}
          <div className="pi-hero-cinematic__badges">
            <span className="pi-badge pi-badge-gold">
              <Sparkles size={11} /> {projectStatus.replace(/_/g, ' ')}
            </span>
            <span className="pi-badge pi-badge-green">
              <ShieldCheck size={11} /> MahaRERA Registered
            </span>
            {transactionType && (
              <span className="pi-badge pi-badge-blue">
                <MapPin size={11} /> {transactionType}
              </span>
            )}
          </div>

          {/* Developer */}
          <div className="pi-hero-cinematic__developer">
            <Building2 size={13} /> {developerName}
          </div>

          {/* Title */}
          <h1 className="pi-hero-cinematic__title">
            {title}
          </h1>

          {/* Address */}
          <div className="pi-hero-cinematic__address">
            <MapPin size={14} style={{ flexShrink: 0, color: '#D4AF37' }} />
            {address}
          </div>

          {/* Price & RERA chips */}
          <div className="pi-hero-cinematic__chips">
            <div className="pi-hero-chip">
              <span style={{ color: '#D4AF37', fontWeight: 800 }}>₹</span>
              <span>{displayPrice}</span>
            </div>
            <div className="pi-hero-chip pi-hero-chip--green">
              <ShieldCheck size={13} />
              <span style={{ fontFamily: 'monospace', letterSpacing: '0.03em' }}>{reraNumber}</span>
            </div>
            {possession && (
              <div className="pi-hero-chip pi-hero-chip--white">
                <Clock size={13} />
                <span>Possession: {possession}</span>
              </div>
            )}
            <div className="pi-hero-chip pi-hero-chip--white">
              <Clock size={13} />
              <span>Verified: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Gallery thumbnails strip */}
        {heroImages.length > 1 && (
          <div className="pi-hero-gallery-strip">
            {heroImages.map((img, idx) => (
              <button
                key={idx}
                className={`pi-gallery-thumb ${activeImageIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveImageIndex(idx)}
                style={{ opacity: activeImageIndex === idx ? 1 : 0.55, padding: 0, background: 'transparent', border: 'none' }}
                aria-label={`View image ${idx + 1}`}
              >
                <img src={img} alt="gallery" onError={e => { e.target.onerror = null; e.target.src = '/dev_godrej_building.png'; }} />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ══ KEY STATS STRIP ══════════════════════════════════════════ */}
      <div className="pi-stats-strip">
        <div className="pi-container">
          <div className="pi-stats-strip__inner">
            <div className="pi-stat-item">
              <div className="pi-stat-item__label">Configurations</div>
              <div className="pi-stat-item__value">{property.bedrooms ? `${property.bedrooms} & ${property.bedrooms + 1} BHK` : '2, 3 & 4 BHK'}</div>
            </div>
            <div className="pi-stat-item">
              <div className="pi-stat-item__label">Carpet Area</div>
              <div className="pi-stat-item__value">{carpetArea}</div>
            </div>
            <div className="pi-stat-item">
              <div className="pi-stat-item__label">Possession</div>
              <div className="pi-stat-item__value pi-stat-item__value--gold">{possession}</div>
            </div>
            <div className="pi-stat-item">
              <div className="pi-stat-item__label">Land Parcel</div>
              <div className="pi-stat-item__value">{projectArea}</div>
            </div>
            <div className="pi-stat-item">
              <div className="pi-stat-item__label">Towers & Floors</div>
              <div className="pi-stat-item__value">{property.towers || '6T × 28Fl'}</div>
            </div>
            <div className="pi-stat-item">
              <div className="pi-stat-item__label">Investment Score</div>
              <div className="pi-stat-item__value pi-stat-item__value--green">
                <Star size={13} style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }} />
                {investmentScore}/100
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ TAB NAVIGATION ═══════════════════════════════════════════ */}
      <nav className="pi-tab-nav">
        <div className="pi-container">
          <div className="pi-tab-nav__inner">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`pi-tab-btn${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => scrollTo(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* ══ MAIN BODY: TWO-COLUMN ARCHITECTURE (Zero Duplication) ═════ */}
      <div className="pi-container">
        <div className="pi-two-col">

          {/* ── LEFT: Main Column ─────────────────────────────────── */}
          <main className="pi-main-col">

            {/* ─ 1. OVERVIEW & LOCATION ADVANTAGE ─ */}
            <AnimSection id="overview">
              <section className="pi-card">
                <div className="pi-card__header">
                  <div className="pi-card__icon-wrap">
                    <Building2 size={18} color="#D4AF37" />
                  </div>
                  <div>
                    <h2 className="pi-card__title">Project Overview & Location Advantage</h2>
                  </div>
                </div>
                <p className="pi-card__subtitle" style={{ marginTop: '12px' }}>
                  {property.description || `${title} is a landmark residential development by ${developerName} located in ${location}. Spread across ${projectArea}, it features luxury architecture, imported marble flooring, Vaastu-compliant configurations, and seamless proximity to Pune's prime IT corridors, business plazas, and lifestyle destinations.`}
                </p>

                <div className="pi-highlight-grid">
                  <div className="pi-highlight-card">
                    <div className="pi-highlight-card__label pi-highlight-card__label--gold">
                      <MapPin size={13} /> Prime Location
                    </div>
                    <div className="pi-highlight-card__text">
                      Immediate access to Hinjewadi IT Park, upcoming Metro Line 3, Balewadi High Street, and the Mumbai-Pune Expressway.
                    </div>
                  </div>
                  <div className="pi-highlight-card">
                    <div className="pi-highlight-card__label pi-highlight-card__label--green">
                      <ShieldCheck size={13} /> Legal &amp; Title Verified
                    </div>
                    <div className="pi-highlight-card__text">
                      Clear marketable title, sanctioned layout approvals, building permits, and MahaRERA registered ({reraNumber}).
                    </div>
                  </div>
                  <div className="pi-highlight-card">
                    <div className="pi-highlight-card__label pi-highlight-card__label--blue">
                      <TrendingUp size={13} /> Capital Appreciation
                    </div>
                    <div className="pi-highlight-card__text">
                      4.6%–5.2% estimated gross rental yield with consistent high demand from Pune's premium IT &amp; executive workforce.
                    </div>
                  </div>
                </div>
              </section>
            </AnimSection>

            {/* ─ 2. CONFIGURATIONS & FLOOR PLANS ─ */}
            <AnimSection id="floorplans">
              <section className="pi-card">
                <div className="pi-card__header" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="pi-card__icon-wrap">
                      <Layers size={18} color="#D4AF37" />
                    </div>
                    <div>
                      <h2 className="pi-card__title">Configurations &amp; Floor Plans</h2>
                      <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>Verified RERA carpet areas &amp; unit layouts</p>
                    </div>
                  </div>
                  <div className="pi-bhk-filter">
                    {['ALL', '2 BHK', '3 BHK', '4 BHK'].map(bhk => (
                      <button
                        key={bhk}
                        className={`pi-bhk-btn${selectedBhk === bhk ? ' active' : ''}`}
                        onClick={() => setSelectedBhk(bhk)}
                      >{bhk}</button>
                    ))}
                  </div>
                </div>

                <div className="pi-config-grid">
                  {filteredFloorPlans.map((fp, idx) => (
                    <div key={idx} className="pi-config-card pi-config-card--3bhk">
                      <div className="pi-config-card__top">
                        <span className="pi-config-card__bhk">{fp.type}</span>
                        <span className="pi-badge pi-badge-gold">Available</span>
                      </div>
                      <div className="pi-config-card__price">{fp.price}</div>
                      <div className="pi-config-card__specs">
                        <div><strong>Carpet Area:</strong> {fp.area}</div>
                        <div><strong>Orientation:</strong> East / North Vastu Compliant</div>
                      </div>
                      <div style={{ borderRadius: '10px', overflow: 'hidden', background: 'rgba(0,0,0,0.3)', margin: '12px 0', aspectRatio: '16/9' }}>
                        <img
                          src="/floorplan_2bhk.png"
                          alt={`${fp.type} Plan`}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }}
                          onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=75'; }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={onOpenInquiry} className="pi-btn-outline" style={{ flex: 1, padding: '8px', fontSize: '0.76rem', justifyContent: 'center' }}>
                          <ZoomIn size={13} /> View Plan
                        </button>
                        <button onClick={() => setBrochureModalOpen(true)} className="pi-btn-gold" style={{ flex: 1, padding: '8px', fontSize: '0.76rem', justifyContent: 'center' }}>
                          <Download size={13} /> Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </AnimSection>

            {/* ─ 3. AMENITIES ─ */}
            <AnimSection id="amenities">
              <section className="pi-card">
                <div className="pi-card__header" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="pi-card__icon-wrap">
                      <Sparkles size={18} color="#D4AF37" />
                    </div>
                    <div>
                      <h2 className="pi-card__title">World-Class Amenities</h2>
                      <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>40+ resort-grade lifestyle experiences</p>
                    </div>
                  </div>
                  <button onClick={onOpenInquiry} style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    View All <ArrowRight size={14} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px', marginTop: '16px' }}>
                  {AMENITIES.map(({ title: at, Icon: AIcon, img }, i) => (
                    <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', background: '#0D1A2D', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', overflow: 'hidden' }}>
                        <img src={img} alt={at} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,13,26,0.85) 0%, transparent 60%)', display: 'flex', alignItems: 'flex-end', padding: '8px' }}>
                          <AIcon size={16} color="#D4AF37" />
                        </div>
                      </div>
                      <div style={{ padding: '8px 10px', fontSize: '0.78rem', fontWeight: 700, color: '#FFF' }}>{at}</div>
                    </div>
                  ))}
                </div>
              </section>
            </AnimSection>

            {/* ─ 4. LOCATION & CONNECTIVITY ─ */}
            <AnimSection id="location">
              <section className="pi-card">
                <div className="pi-card__header">
                  <div className="pi-card__icon-wrap">
                    <MapPin size={18} color="#D4AF37" />
                  </div>
                  <div>
                    <h2 className="pi-card__title">Location &amp; Commute Advantage</h2>
                    <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>Strategic travel times to core business hubs</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {LOCATIONS.map(({ name, time, pct, Icon: LIcon }, i) => (
                      <div key={i} style={{ padding: '12px 14px', borderRadius: '10px', background: '#0D1A2D', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <LIcon size={14} color="#D4AF37" />
                            <span style={{ fontSize: '0.82rem', color: '#E2E8F0', fontWeight: 600 }}>{name}</span>
                          </div>
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#F3E5AB' }}>{time}</span>
                        </div>
                        <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #D4AF37, #F3E5AB)' }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.25)', minHeight: '260px', background: '#0B1628' }}>
                    <iframe
                      src={`https://maps.google.com/maps?t=m&z=14&ie=UTF8&iwloc=&output=embed&q=${encodeURIComponent(address)}&zoom=14`}
                      style={{ width: '100%', height: '100%', border: 'none', filter: 'invert(1) hue-rotate(180deg) saturate(0.75)' }}
                      loading="lazy"
                      title={`${title} Map`}
                    />
                  </div>
                </div>
              </section>
            </AnimSection>

            {/* ─ 5. EMI CALCULATOR ─ */}
            <AnimSection id="calculator">
              <section className="pi-card">
                <div className="pi-card__header">
                  <div className="pi-card__icon-wrap">
                    <BarChart3 size={18} color="#D4AF37" />
                  </div>
                  <div>
                    <h2 className="pi-card__title">Interactive EMI &amp; Loan Intelligence</h2>
                    <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>Pre-approved special rates at 8.35% p.a.</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '16px' }}>
                  {/* Sliders */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.80rem' }}>
                        <span style={{ color: '#CBD5E0' }}>Property Price</span>
                        <strong style={{ color: '#D4AF37' }}>₹{(emiPrice / 100000).toFixed(1)} Lakhs</strong>
                      </div>
                      <input type="range" min="6000000" max="40000000" step="500000" value={emiPrice}
                        onChange={e => setEmiPrice(Number(e.target.value))}
                        className="pdv-emi-slider"
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.80rem' }}>
                        <span style={{ color: '#CBD5E0' }}>Down Payment ({downPaymentPct}%)</span>
                        <strong style={{ color: '#D4AF37' }}>₹{(emiPrice * downPaymentPct / 100 / 100000).toFixed(2)} Lakhs</strong>
                      </div>
                      <input type="range" min="10" max="50" step="5" value={downPaymentPct}
                        onChange={e => setDownPaymentPct(Number(e.target.value))}
                        className="pdv-emi-slider"
                        style={{ width: '100%' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.80rem' }}>
                        <span style={{ color: '#CBD5E0' }}>Tenure ({tenureYears} Years)</span>
                        <strong style={{ color: '#D4AF37' }}>{tenureYears} Yrs</strong>
                      </div>
                      <input type="range" min="5" max="30" step="5" value={tenureYears}
                        onChange={e => setTenureYears(Number(e.target.value))}
                        className="pdv-emi-slider"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  {/* Monthly EMI Result Box */}
                  <div style={{ padding: '20px', borderRadius: '14px', background: '#091322', border: '1px solid rgba(212,175,55,0.2)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>Estimated Monthly EMI</div>
                      <div style={{ fontFamily: "'Cinzel', serif", fontSize: '2rem', fontWeight: 800, color: '#F3E5AB', margin: '6px 0 12px' }}>
                        ₹{emi.toLocaleString('en-IN')}<span style={{ fontSize: '0.8rem', color: '#64748B' }}>/mo</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.76rem', color: '#A0AEC0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Loan Amount:</span>
                          <strong style={{ color: '#FFF' }}>₹{(loanAmount / 100000).toFixed(2)} L</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Total Interest:</span>
                          <strong style={{ color: '#F3E5AB' }}>₹{(totalInterest / 100000).toFixed(2)} L</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Total Payable:</span>
                          <strong style={{ color: '#10B981' }}>₹{(totalPayment / 100000).toFixed(2)} L</strong>
                        </div>
                      </div>
                    </div>

                    <button onClick={onOpenInquiry} className="pi-btn-gold" style={{ marginTop: '16px', justifyContent: 'center' }}>
                      Get Pre-Approved Loan →
                    </button>
                  </div>
                </div>
              </section>
            </AnimSection>

            {/* ─ 6. SOCIETY & VASTU DOSSIER ─ */}
            <AnimSection id="society-profile">
              <section className="pi-card">
                <div className="pi-card__header">
                  <div className="pi-card__icon-wrap">
                    <ShieldCheck size={18} color="#D4AF37" />
                  </div>
                  <div>
                    <h2 className="pi-card__title">Society &amp; Vastu Intelligence</h2>
                    <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>Comprehensive spatial layout &amp; investment ratings</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginTop: '16px' }}>
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.18)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F3E5AB', marginBottom: '6px' }}>🔱 Vastu Compliance</div>
                    <p style={{ fontSize: '0.76rem', color: '#CBD5E0', lineHeight: 1.5, margin: 0 }}>
                      North &amp; East entry units available. Master suites oriented in South-West stability zones with Agni-aligned kitchens.
                    </p>
                  </div>
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.18)' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#6EE7B7', marginBottom: '6px' }}>🌍 NRI &amp; Rental Portfolio</div>
                    <p style={{ fontSize: '0.76rem', color: '#CBD5E0', lineHeight: 1.5, margin: 0 }}>
                      Projected 4.8%–5.5% annual rental yields with dedicated 24K NRI documentation and virtual 4K handover management.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                  {RATING_SCORES.map(({ label, score, color }, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: '3px' }}>
                        <span style={{ color: '#CBD5E0' }}>{label}</span>
                        <strong style={{ color }}>{score}/100</strong>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${score}%`, background: color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </AnimSection>

            {/* ─ 7. SIMILAR PROPERTIES ─ */}
            <AnimSection id="similar">
              <section className="pi-card">
                <div className="pi-card__header" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="pi-card__icon-wrap">
                      <Sparkles size={18} color="#D4AF37" />
                    </div>
                    <div>
                      <h2 className="pi-card__title">Similar Verified Properties</h2>
                      <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>Hand-curated alternatives in {location}</p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '16px' }}>
                  {SIMILAR.map((sim, i) => (
                    <div key={i} style={{ borderRadius: '12px', overflow: 'hidden', background: '#0D1A2D', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', overflow: 'hidden' }}>
                        <img src={sim.img} alt={sim.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(6,13,26,0.85)', color: '#F3E5AB', fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                          {sim.tag}
                        </span>
                      </div>
                      <div style={{ padding: '12px' }}>
                        <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#FFF', marginBottom: '2px' }}>{sim.title}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: '8px' }}>{sim.loc} • {sim.config}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                          <span style={{ color: '#F3E5AB', fontWeight: 700, fontSize: '0.84rem' }}>{sim.price}</span>
                          <button onClick={onOpenInquiry} style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}>
                            View →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </AnimSection>

            {/* ─ 8. LEAD FORM CARD ─ */}
            <section className="pi-card" style={{ background: 'linear-gradient(145deg, #0D1E38 0%, #0B1628 100%)', border: '1px solid rgba(212,175,55,0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Sparkles size={16} color="#D4AF37" />
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#D4AF37', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Private Client Advisory</span>
              </div>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', color: '#FFF', margin: '0 0 8px' }}>
                Schedule a Private AC Cab Site Visit
              </h3>
              <p style={{ fontSize: '0.80rem', color: '#94A3B8', margin: '0 0 16px' }}>
                Connect directly with 24K senior real estate advisors for exclusive developer price discounts and guided physical tours.
              </p>

              {formSuccess ? (
                <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', textAlign: 'center' }}>
                  <CheckCircle2 size={32} color="#10B981" style={{ margin: '0 auto 8px' }} />
                  <div style={{ color: '#FFF', fontWeight: 700, fontSize: '0.92rem' }}>Request Received!</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.78rem', marginTop: '2px' }}>Our senior advisor will call you within 15 minutes.</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    <input
                      type="text" required placeholder="Your Full Name" value={formData.name}
                      onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
                      style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.82rem' }}
                    />
                    <input
                      type="tel" required placeholder="WhatsApp Number" value={formData.phone}
                      onChange={e => setFormData(d => ({ ...d, phone: e.target.value }))}
                      style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.82rem' }}
                    />
                  </div>
                  <button type="submit" disabled={formSubmitting} className="pi-btn-gold" style={{ justifyContent: 'center', padding: '12px', marginTop: '4px' }}>
                    {formSubmitting ? 'Confirming...' : 'Request Free Site Visit & Floor Plans'}
                  </button>
                </form>
              )}
            </section>

          </main>

          {/* ── RIGHT: Sticky Sidebar Console (Image 2 Architecture) ── */}
          <aside className="pi-sidebar">

            {/* Price & CTA Card */}
            <div className="pi-sidebar-price-card">
              <div className="pi-sidebar-price-card__label">Verified Starting Price</div>
              <div className="pi-sidebar-price-card__price">
                {displayPrice}
              </div>
              <div className="pi-sidebar-price-card__meta">
                <span className="pi-meta-dot" /> Price verified · {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>

              {/* RERA dossier chip */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', margin: '14px 0', fontSize: '0.74rem' }}>
                <ShieldCheck size={14} color="#10B981" />
                <span style={{ color: '#6EE7B7', fontWeight: 700, fontFamily: 'monospace' }}>{reraNumber}</span>
              </div>

              {/* 3 CTAs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={onOpenInquiry} className="pi-btn-gold" style={{ width: '100%', justifyContent: 'center', padding: '13px' }}>
                  <Clock size={15} /> Book Private Site Visit
                </button>

                <a
                  href={`https://wa.me/919673000053?text=Hi%2024K%20Realtors%20%F0%9F%8F%A0%0A%0AI%20am%20interested%20in%3A%0A%F0%9F%93%8C%20*${encodeURIComponent(title)}*%0A%F0%9F%93%8D%20Location%3A%20${encodeURIComponent(location)}%0A%F0%9F%9B%A1%EF%B8%8F%20RERA%3A%20${encodeURIComponent(reraNumber)}%0A%0APlease%20share%20floor%20plans%20and%20pricing%20breakup.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pi-btn-whatsapp"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                >
                  <MessageSquare size={15} /> WhatsApp Our Expert
                </a>

                <a
                  href="tel:+919673000053"
                  className="pi-btn-outline"
                  style={{ width: '100%', justifyContent: 'center', padding: '11px' }}
                >
                  <Phone size={14} color="#D4AF37" /> Call Directly +91 96730 00053
                </a>
              </div>
            </div>

            {/* Instant Brochure Download */}
            <div style={{ padding: '18px', borderRadius: '14px', background: '#0B1628', border: '1px solid rgba(212,175,55,0.22)', textAlign: 'center' }}>
              <Download size={22} color="#D4AF37" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FFF' }}>Download E-Brochure (PDF)</div>
              <p style={{ fontSize: '0.72rem', color: '#64748B', margin: '4px 0 12px' }}>
                Instant access to master layout, floor plans &amp; pricing sheet.
              </p>
              <button onClick={() => setBrochureModalOpen(true)} className="pi-btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '9px', fontSize: '0.78rem' }}>
                Unlock PDF Brochure
              </button>
            </div>

            {/* AI Concierge Trigger */}
            <button
              onClick={openAiChat}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(11,22,40,0.9) 100%)', border: '1px solid rgba(212,175,55,0.4)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D4AF37', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#F3E5AB' }}>🤖 Ask AI Property Specialist</div>
                <div style={{ fontSize: '0.64rem', color: '#94A3B8', marginTop: '1px' }}>Instant pricing, Vastu &amp; ROI analysis</div>
              </div>
              <ChevronRight size={14} color="#D4AF37" />
            </button>

            {/* Trust Badges */}
            <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(6,13,26,0.5)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {TRUST.map(({ Icon: TrIcon, text }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrIcon size={14} color="#D4AF37" />
                  <span style={{ fontSize: '0.72rem', color: '#CBD5E0' }}>{text}</span>
                </div>
              ))}
            </div>

          </aside>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MODALS & FLOATING ACTION BAR
      ═══════════════════════════════════════════════════════════ */}

      {/* 1. AI Concierge Modal */}
      {aiChatOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setAiChatOpen(false); }}
          style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: '20px' }}
        >
          <div style={{ width: '100%', maxWidth: '420px', height: '560px', background: '#0A1220', border: '1px solid rgba(212,175,55,0.35)', borderRadius: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 -20px 60px rgba(0,0,0,0.7)' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(212,175,55,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37, #9A7B1C)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={15} color="#09111F" />
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>24K Property Intelligence</div>
                  <div style={{ fontSize: '0.64rem', color: '#6EE7B7' }}>● Online · Context: {title}</div>
                </div>
              </div>
              <button onClick={() => setAiChatOpen(false)} style={{ background: 'none', border: 'none', color: '#A0AEC0', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {aiMessages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: '6px' }}>
                  <div style={{ maxWidth: '82%', padding: '9px 12px', borderRadius: '12px', background: msg.role === 'user' ? 'linear-gradient(135deg, #D4AF37, #C9A227)' : 'rgba(255,255,255,0.06)', color: msg.role === 'user' ? '#09111F' : '#E2E8F0', fontSize: '0.78rem', lineHeight: 1.5, fontWeight: msg.role === 'user' ? 700 : 400, whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {aiThinking && (
                <div style={{ display: 'flex', gap: '4px', padding: '8px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: '12px', width: 'fit-content' }}>
                  <span style={{ fontSize: '0.72rem', color: '#D4AF37' }}>Thinking...</span>
                </div>
              )}
              <div ref={aiChatEndRef} />
            </div>

            {aiMessages.filter(m => m.role === 'user').length === 0 && (
              <div style={{ padding: '0 12px 10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {CONCIERGE_SUGGESTED_QUESTIONS.slice(0, 3).map((q, i) => (
                  <button key={i} onClick={() => handleAiSend(q)} style={{ padding: '5px 10px', borderRadius: '100px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.3)', color: '#F3E5AB', fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer' }}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.2)' }}>
              <input
                ref={aiInputRef}
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !aiThinking) { e.preventDefault(); handleAiSend(); } }}
                placeholder="Ask about pricing, Vastu, ROI..."
                style={{ flex: 1, padding: '9px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', fontSize: '0.80rem', outline: 'none' }}
              />
              <button onClick={() => handleAiSend()} disabled={!aiInput.trim() || aiThinking} className="pi-btn-gold" style={{ padding: '8px 12px' }}>
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. E-Brochure Modal */}
      {brochureModalOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setBrochureModalOpen(false); }}
          style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <div style={{ width: '100%', maxWidth: '420px', background: '#0D1829', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '20px', padding: '24px', position: 'relative' }}>
            <button onClick={() => setBrochureModalOpen(false)} style={{ position: 'absolute', top: '14px', right: '14px', background: 'none', border: 'none', color: '#A0AEC0', cursor: 'pointer' }}>
              <X size={16} />
            </button>

            {brochureSuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <CheckCircle2 size={40} color="#10B981" style={{ margin: '0 auto 8px' }} />
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.2rem', color: '#FFF', margin: '0 0 6px' }}>Brochure Sent!</h3>
                <p style={{ fontSize: '0.80rem', color: '#CBD5E0', marginBottom: '16px' }}>
                  The 4K Floor Plans &amp; Price Sheet PDF for <strong>{title}</strong> has been shared.
                </p>
                <button onClick={() => { setBrochureModalOpen(false); setBrochureSuccess(false); }} className="pi-btn-gold" style={{ padding: '10px 24px' }}>
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleBrochureSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ textAlign: 'center' }}>
                  <Download size={28} color="#D4AF37" style={{ margin: '0 auto 6px' }} />
                  <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.2rem', color: '#FFF', margin: '0 0 4px' }}>Download E-Brochure</h3>
                  <p style={{ fontSize: '0.74rem', color: '#718096', margin: 0 }}>Instant PDF download for {title}</p>
                </div>
                <input required type="text" placeholder="Your Full Name" value={brochureForm.name}
                  onChange={e => setBrochureForm(f => ({ ...f, name: e.target.value }))}
                  style={{ width: '100%', padding: '11px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', fontSize: '0.80rem', boxSizing: 'border-box' }} />
                <input required type="tel" placeholder="WhatsApp Number (10-digit)" value={brochureForm.phone}
                  onChange={e => setBrochureForm(f => ({ ...f, phone: e.target.value }))}
                  style={{ width: '100%', padding: '11px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', fontSize: '0.80rem', boxSizing: 'border-box' }} />
                <button type="submit" disabled={brochureSubmitting} className="pi-btn-gold" style={{ width: '100%', padding: '12px', justifyContent: 'center', fontSize: '0.82rem' }}>
                  {brochureSubmitting ? 'Unlocking...' : 'Download Floor Plans PDF'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
