/**
 * PropertyDetailView.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Premium AI-Ready Property Subpage for 24K REALTORS PUNE
 *
 * Features:
 *  • IntersectionObserver scroll-spy → sticky tab auto-highlights
 *  • AI Match Score badge, Price Trend insight chip
 *  • Animated stat counters on scroll-in
 *  • Lucide SVG icons throughout (no emojis)
 *  • Stagger entrance animations on highlights cards
 *  • Amenities editorial grid with image hover zoom + overlay
 *  • Location: progress-bar style travel-time cards
 *  • Floor Plans: zoom, download, carpet area bars
 *  • AI Property Intelligence section (NEW)
 *  • Smart lead capture form with validation UI
 *  • Reactive useWindowWidth — no stale mobile detection
 *  • Clean architecture — dead state removed
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin, ChevronRight, Heart, Share2, ArrowRight,
  BedDouble, Maximize2, Building2, Home, ShieldCheck,
  Zap, TreePine, Train, Plane, Clock, Dumbbell,
  Waves, Users, Baby, Route, Star, TrendingUp,
  Brain, Sparkles, Download, ZoomIn, Phone,
  Mail, CheckCircle2, Award, Lock, BadgeCheck,
  BarChart3, Target, Coffee, X, Send, Bot, MessageSquare,
  Calculator, FileText, ExternalLink, Shield, QrCode
} from 'lucide-react';
import PropertyGallery from './PropertyGallery';
import { apiService } from '../services/apiService';

/* ── Inject CSS once ── */
const STYLE_ID = 'pdv-styles-v3';
const PDV_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Montserrat:wght@400;500;600;700;800&display=swap');

.pdv-root { font-family: 'Montserrat', sans-serif; }

/* Scroll-spy tab highlight */
.pdv-tab { transition: all 0.25s ease; border-bottom: 3px solid transparent; }
.pdv-tab:hover { color: #E2C87A !important; }
.pdv-tab.active { color: #F3E5AB !important; border-bottom-color: #D4AF37 !important; }

/* Card hover lifts */
.pdv-card-lift { transition: transform 0.25s ease, box-shadow 0.25s ease !important; }
.pdv-card-lift:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.5) !important; }

/* Highlight icon cards */
.pdv-hl-card { transition: all 0.25s ease !important; }
.pdv-hl-card:hover { border-color: rgba(212,175,55,0.5) !important; transform: translateY(-3px); box-shadow: 0 12px 32px rgba(212,175,55,0.12) !important; }

/* Amenity image zoom */
.pdv-amenity-img { transition: transform 0.45s ease; }
.pdv-amenity-card:hover .pdv-amenity-img { transform: scale(1.08); }
.pdv-amenity-overlay { opacity: 0; transition: opacity 0.3s ease; }
.pdv-amenity-card:hover .pdv-amenity-overlay { opacity: 1; }

/* Similar property cards */
.pdv-sim-card { transition: all 0.25s ease !important; }
.pdv-sim-card:hover { transform: translateY(-5px); box-shadow: 0 20px 50px rgba(0,0,0,0.5) !important; border-color: rgba(212,175,55,0.3) !important; }
.pdv-sim-card:hover .pdv-sim-img { transform: scale(1.06); }
.pdv-sim-img { transition: transform 0.4s ease; }

/* CTA buttons */
.pdv-btn-gold { transition: all 0.22s ease !important; }
.pdv-btn-gold:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(212,175,55,0.45) !important; }
.pdv-btn-outline { transition: all 0.22s ease !important; }
.pdv-btn-outline:hover { background: rgba(212,175,55,0.12) !important; border-color: #D4AF37 !important; transform: translateY(-2px); }

/* AI chip pulse */
@keyframes pdv-pulse { 0%,100% { opacity:1; } 50% { opacity:0.6; } }
.pdv-ai-dot { animation: pdv-pulse 2s infinite; }

/* Section fade-in on scroll */
@keyframes pdv-slide-up { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
.pdv-sec-visible { animation: pdv-slide-up 0.55s ease forwards; }
.pdv-sec-hidden { opacity:0; transform:translateY(28px); }

/* AI score ring */
@keyframes pdv-ring-draw { from { stroke-dashoffset: 283; } to { stroke-dashoffset: 17; } }
.pdv-ring-animate { animation: pdv-ring-draw 1.5s 0.5s ease forwards; }

/* Progress bar */
@keyframes pdv-bar { from { width:0; } to { width: var(--target-w); } }
.pdv-bar-animate { animation: pdv-bar 1.2s 0.3s ease forwards; }

/* Form input focus */
.pdv-input { transition: border-color 0.2s ease, box-shadow 0.2s ease !important; }
.pdv-input:focus { border-color: rgba(212,175,55,0.7) !important; box-shadow: 0 0 0 3px rgba(212,175,55,0.12) !important; outline: none !important; }

/* Location travel card */
.pdv-loc-card { transition: all 0.2s ease !important; }
.pdv-loc-card:hover { border-color: rgba(212,175,55,0.35) !important; background: rgba(20,38,62,0.9) !important; }

/* Floor plan card */
.pdv-fp-card { transition: all 0.25s ease !important; }
.pdv-fp-card:hover { border-color: rgba(212,175,55,0.4) !important; transform: translateY(-3px); }
.pdv-fp-img { transition: transform 0.3s ease; }
.pdv-fp-card:hover .pdv-fp-img { transform: scale(1.04); }

/* Mobile Action Dock */
@media (max-width: 768px) {
  .pdv-dock-info { display: none !important; }
  .pdv-mobile-action-dock { padding: 8px 10px !important; gap: 6px !important; }
  .pdv-mobile-action-dock a, .pdv-mobile-action-dock button { padding: 10px 10px !important; flex: 1 1 auto; justify-content: center; font-size: 0.72rem !important; }
}
`;


function injectStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const tag = document.createElement('style');
  tag.id = STYLE_ID;
  tag.textContent = PDV_CSS;
  document.head.appendChild(tag);
}

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return w;
}

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
    <div ref={ref} id={id} className={vis ? 'pdv-sec-visible' : 'pdv-sec-hidden'} style={{ marginBottom: '72px', paddingTop: '12px', ...style }}>
      {children}
    </div>
  );
}

/* ── Stat counter ── */
function StatCounter({ target, suffix = '', prefix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const duration = 1200;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        setVal(Math.floor(progress * target));
        if (progress < 1) requestAnimationFrame(step);
        else setVal(target);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
export default function PropertyDetailView({ property = {}, onBack, onOpenInquiry, onOpenBrochure }) {
  injectStyles();
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth <= 768;

  /* ── State ── */
  const [activeTab, setActiveTab]         = useState('overview');
  const [saved, setSaved]                 = useState(false);
  const [aiRingAnimated, setAiRingAnimated] = useState(false);
  const [formData, setFormData]           = useState({ name: '', phone: '', email: '' });
  const [formErrors, setFormErrors]       = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess]     = useState(false);
  // AI Chat modal state
  const [aiChatOpen, setAiChatOpen]       = useState(false);
  const [aiMessages, setAiMessages]       = useState([]);
  const [aiInput, setAiInput]             = useState('');
  const [aiThinking, setAiThinking]       = useState(false);
  const aiChatEndRef                      = useRef(null);
  const aiInputRef                        = useRef(null);

  // EMI Calculator State
  const [emiPrice, setEmiPrice]           = useState(property.price || 8500000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate]   = useState(8.35);
  const [tenureYears, setTenureYears]     = useState(20);

  // E-Brochure Lead Capture Modal State
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);
  const [brochureForm, setBrochureForm]   = useState({ name: '', phone: '', email: '' });
  const [brochureSubmitting, setBrochureSubmitting] = useState(false);
  const [brochureSuccess, setBrochureSuccess] = useState(false);

  /* ── Property metadata ── */
  const title         = property.title        || 'Godrej Woodsville';
  const location      = property.location     || 'Hinjewadi Phase 1, Pune';
  const address       = property.address      || `${title}, Hinjewadi Phase 1, Pune`;

  // Smart price formatter: < 1 Cr → show in Lakhs
  const formatPrice = (p) => {
    if (!p) return '₹85 L – ₹1.15 Cr*';
    if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr*`;
    return `₹${Math.round(p / 100000)} L*`;
  };
  const price         = formatPrice(property.price);
  const reraNumber    = property.reraNumber   || 'P52100046770';
  const possession    = property.possessionDate || property.possession || 'Nov 2028';
  const projectArea   = property.projectArea  || '4.54 Acres';
  const developerName = property.builderName  || property.developer || property.developerName
    || (title.toLowerCase().includes('godrej') ? 'Godrej Properties'
      : title.toLowerCase().includes('shapoorji') ? 'Shapoorji Pallonji Real Estate'
      : title.toLowerCase().includes('kolte') ? 'Kolte-Patil Developers'
      : title.toLowerCase().includes('vtp') ? 'VTP Realty'
      : title.toLowerCase().includes('vilas') || title.toLowerCase().includes('yashwin') ? 'Vilas Javdekar (VJ)'
      : '24K Realtors');
  const aiScore       = property.aiScore      || 94;

  /* ── AI Chat logic ── */
  const AI_SUGGESTED_QUESTIONS = [
    `What makes ${title} a good investment?`,
    `What is the possession date and RERA status?`,
    `Which BHK is best value for money here?`,
    `How is the connectivity to IT hubs?`,
    `What are the nearby schools and hospitals?`,
  ];

  // Pre-built intelligent responses based on property context
  const getAiResponse = (question) => {
    const q = question.toLowerCase();
    const t = title;
    const loc = location;
    if (q.includes('investment') || q.includes('good')) {
      return `${t} is an excellent investment for multiple reasons:\n\n• **Location Alpha**: Hinjewadi IT corridor has seen 18% price appreciation YoY — one of Pune's fastest growing micro-markets.\n• **Builder Trust**: ${developerName} has a 100% on-time delivery track record in Pune.\n• **Rental Yield**: Expected 4.8% rental yield post-possession, above the city average of 3.2%.\n• **Infrastructure**: Upcoming Metro connectivity will further boost property values by 15–20%.\n\nAI Verdict: Strong Buy. 🟢`;
    }
    if (q.includes('possession') || q.includes('rera') || q.includes('status')) {
      return `${t} possession details:\n\n• **Possession Date**: ${possession}\n• **RERA Number**: ${reraNumber}\n• **Construction Status**: On track — structure complete, finishing underway.\n• **RERA Verified**: Yes, registered with MahaRERA.\n\nYou can verify on maharera.mahaonline.gov.in using the RERA number above.`;
    }
    if (q.includes('bhk') || q.includes('value') || q.includes('money')) {
      return `For best value at ${t}:\n\n• **2 BHK (761–858 sq.ft)** — Best for young professionals and couples. Lower ticket price, higher rental demand.\n• **3 BHK (904–973 sq.ft)** — Best for families. Better resale value long-term.\n\n📊 AI Recommendation: If budget allows, the **3 BHK** offers better ROI by ~12% over a 5-year horizon due to family demand in Hinjewadi.`;
    }
    if (q.includes('connect') || q.includes('it hub') || q.includes('office') || q.includes('commute')) {
      return `${t} connectivity at ${loc}:\n\n• 🏢 **Hinjewadi IT Park Phase 1, 2 & 3**: 5–10 min drive\n• 🚇 **Metro Station (Wakad)**: 10 min\n• 🛣️ **Pune-Mumbai Expressway**: 10 min\n• 🏬 **Phoenix Mall of Millennium**: 15 min\n• ✈️ **Pune Airport**: 45 min\n\nIdeal for IT employees at Infosys, TCS, Wipro, Cognizant campuses nearby.`;
    }
    if (q.includes('school') || q.includes('hospital') || q.includes('nearby')) {
      return `Nearby facilities at ${t}:\n\n🏫 **Schools**:\n• Indus International School (5 km)\n• VIBGYOR High School (4 km)\n• Ryan International (6 km)\n\n🏥 **Hospitals**:\n• Medipoint Hospital (4 km)\n• Sahyadri Specialty Hospital (8 km)\n• Lifepoint Multispeciality Hospital (6 km)\n\n🛒 **Shopping**:\n• D-Mart Hinjewadi (3 km)\n• Phoenix Mall (15 min)`;
    }
    // Generic fallback
    return `Great question about ${t}! Here's what I know:\n\n${t} is a ${developerName} project in ${loc}, offering 2 & 3 BHK premium homes from ${price}. With an AI Match Score of ${aiScore}%, this project ranks highly on location, builder trust, and future potential.\n\nFor more specific details, our expert advisors can give you a personalized consultation. Shall I connect you? 📞`;
  };

  const handleAiSend = async (questionOverride) => {
    const question = questionOverride || aiInput.trim();
    if (!question) return;
    setAiInput('');
    setAiMessages(prev => [...prev, { role: 'user', text: question }]);
    setAiThinking(true);
    // Simulate AI response with realistic delay
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    const response = getAiResponse(question);
    setAiMessages(prev => [...prev, { role: 'ai', text: response }]);
    setAiThinking(false);
  };

  const openAiChat = () => {
    if (aiMessages.length === 0) {
      setAiMessages([{
        role: 'ai',
        text: `Namaste! 👋 I'm your 24K AI Property Advisor.\n\nI have complete data about **${title}** — pricing, specs, location, investment potential, and more.\n\nAsk me anything, or pick a question below!`
      }]);
    }
    setAiChatOpen(true);
    setTimeout(() => aiInputRef.current?.focus(), 300);
  };

  useEffect(() => {
    aiChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, aiThinking]);

  /* ── Scroll-spy: IntersectionObserver keeps tab in sync ── */
  const SECTION_IDS = ['overview', 'highlights', 'amenities', 'location', 'floorplans', 'calculator', 'ai-intel', 'similar'];
  useEffect(() => {
    const observers = [];
    SECTION_IDS.forEach(id => {
      const el = document.getElementById(`sec-${id}`);
      if (!el) return;
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) setActiveTab(id);
      }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  /* ── EMI Calculation Math ── */
  const calculateEmi = () => {
    const p = emiPrice * (1 - downPaymentPct / 100);
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;
    if (r === 0) return Math.round(p / n);
    const emi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;
    return { emi, loanAmount: p, totalInterest, totalPayment };
  };
  const { emi, loanAmount, totalInterest, totalPayment } = calculateEmi();

  /* ── Brochure Modal submit ── */
  const handleBrochureSubmit = async (e) => {
    e.preventDefault();
    if (!brochureForm.name || !brochureForm.phone) return;
    setBrochureSubmitting(true);

    // Save lead into Database with detailed tags
    await apiService.submitLeadToDatabase({
      name: brochureForm.name,
      phone: brochureForm.phone,
      email: brochureForm.email || '',
      requirementType: 'BUY_RESIDENTIAL',
      location: location,
      notes: `Requested E-Brochure & Floor Plans for ${title}`,
      source: 'E-Brochure Download Modal'
    });

    setBrochureSubmitting(false);
    setBrochureSuccess(true);
  };

  /* ── AI ring animation trigger ── */
  useEffect(() => {
    const t = setTimeout(() => setAiRingAnimated(true), 800);
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

  /* ── Form validation ── */
  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) errs.phone = 'Enter valid 10-digit number';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter valid email';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setFormSubmitting(true);

    // Save lead into Database with detailed tags
    await apiService.submitLeadToDatabase({
      name: formData.name,
      phone: formData.phone,
      email: formData.email || '',
      requirementType: 'BUY_RESIDENTIAL',
      location: location,
      notes: `Inquiry for ${title}. Notes: ${formData.notes || 'Interested in site visit'}`,
      source: 'Property Detail Page Form'
    });

    setFormSubmitting(false);
    setFormSuccess(true);
    setTimeout(() => onOpenInquiry && onOpenInquiry(), 800);
  };

  /* ── Data ── */
  const TABS = [
    { id: 'overview',   label: 'OVERVIEW' },
    { id: 'highlights', label: 'HIGHLIGHTS' },
    { id: 'amenities',  label: 'AMENITIES' },
    { id: 'location',   label: 'LOCATION' },
    { id: 'floorplans', label: 'FLOOR PLANS' },
    { id: 'calculator', label: '🧮 EMI CALCULATOR' },
    { id: 'ai-intel',   label: '✦ AI INTEL' },
    { id: 'similar',    label: 'SIMILAR' },
  ];

  const METRICS = [
    { Icon: BedDouble,  label: '2 & 3',      sub: 'BHK Homes' },
    { Icon: Maximize2,  label: '761–973',     sub: 'Sq.ft Carpet' },
    { Icon: Building2,  label: '4',           sub: 'Towers' },
    { Icon: Home,       label: '882',         sub: 'Total Units' },
  ];

  const HIGHLIGHTS = [
    { Icon: MapPin,      text: 'Prime Hinjewadi Phase 1 location' },
    { Icon: Train,       text: 'Metro & IT Park within 10 mins' },
    { Icon: TreePine,    text: '80%+ Open Green Spaces' },
    { Icon: Star,        text: 'Vaastu-compliant homes' },
    { Icon: Building2,   text: 'Grand Clubhouse & 40+ amenities' },
    { Icon: BadgeCheck,  text: '125+ years Godrej legacy' },
  ];

  const AMENITIES = [
    { title: 'Clubhouse',        Icon: Coffee,     img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=75' },
    { title: 'Swimming Pool',    Icon: Waves,      img: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=75' },
    { title: 'Gymnasium',        Icon: Dumbbell,   img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=75' },
    { title: "Kids Play Area",   Icon: Baby,       img: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=75' },
    { title: 'Jogging Track',    Icon: Route,      img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=75' },
    { title: 'Multipurpose Hall',Icon: Users,      img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=75' },
  ];

  const LOCATIONS = [
    { name: 'Hinjewadi IT Park',          time: '5 mins',  pct: 95, Icon: Building2 },
    { name: 'Wakad Metro Station',         time: '10 mins', pct: 80, Icon: Train },
    { name: 'Pune–Mumbai Expressway',      time: '10 mins', pct: 80, Icon: Route },
    { name: 'Phoenix Mall of Millennium',  time: '15 mins', pct: 68, Icon: Star },
    { name: 'Pune Railway Station',        time: '25 mins', pct: 45, Icon: Train },
    { name: 'Pune International Airport',  time: '45 mins', pct: 20, Icon: Plane },
  ];

  const FLOOR_PLANS = [
    { type: '2 BHK', area: '761 – 858 sq.ft', price: '₹85 L – ₹98 L*', pct: 62 },
    { type: '3 BHK', area: '904 – 973 sq.ft', price: '₹1.02 – ₹1.15 Cr*', pct: 80 },
  ];

  const AI_SCORES = [
    { label: 'Location Score',    score: 92, color: '#D4AF37' },
    { label: 'Price Fairness',    score: 88, color: '#68D391' },
    { label: 'Builder Trust',     score: 97, color: '#63B3ED' },
    { label: 'Future Potential',  score: 91, color: '#F687B3' },
  ];

  const SIMILAR = [
    { title: 'Godrej Greenfront',         loc: 'Hinjewadi Phase 2', config: '2 & 3 BHK', price: '₹1.25 Cr*', tag: 'PREMIUM', match: 87, img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=75' },
    { title: 'Kolte Patil Life Republic', loc: 'Hinjewadi Phase 1', config: '2 & 3 BHK', price: '₹1.10 Cr*', tag: 'LUXURY',  match: 82, img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=75' },
    { title: 'Lodha Panache',             loc: 'Hinjewadi Phase 1', config: '2, 3 & 5 BHK', price: '₹1.32 Cr*', tag: 'PREMIUM', match: 79, img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=75' },
    { title: 'VTP Monarque',              loc: 'Hinjewadi Phase 3', config: '2 & 3 BHK', price: '₹1.28 Cr*', tag: 'LUXURY',  match: 76, img: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=75' },
  ];

  const TRUST = [
    { Icon: Lock,        text: 'Best Price Guaranteed' },
    { Icon: Users,       text: 'Personalized Assistance' },
    { Icon: Brain,       text: 'AI-Powered Matching' },
    { Icon: BadgeCheck,  text: 'Zero Hidden Charges' },
  ];

  /* ── Shared styles ── */
  const G = {
    card:   { background: 'rgba(13,24,42,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px' },
    goldBorder: { border: '1px solid rgba(212,175,55,0.3)', borderRadius: '18px', background: 'rgba(13,24,42,0.9)' },
    secLabel: { fontSize: '0.7rem', fontWeight: 800, color: '#D4AF37', letterSpacing: '0.14em', textTransform: 'uppercase' },
  };

  const px = isMobile ? '16px' : '28px';

  /* ═══════════════════════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════════════════════ */
  return (
    <div className="pdv-root" style={{ background: '#07101D', color: '#FFF', minHeight: '100vh' }}>

      {/* ── BREADCRUMB ── */}
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: `14px ${px} 6px`, fontSize: '0.76rem', color: '#718096', display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
        <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} onClick={onBack}
          onMouseOver={e => e.target.style.color = '#D4AF37'} onMouseOut={e => e.target.style.color = '#718096'}>Home</span>
        <ChevronRight size={11} />
        <span>Projects</span>
        <ChevronRight size={11} />
        <span>Hinjewadi</span>
        <ChevronRight size={11} />
        <span style={{ color: '#D4AF37', fontWeight: 700 }}>{title}</span>
      </div>

      {/* ═══════════════════════════════════════
          HERO: GALLERY + RIGHT PANEL
      ═══════════════════════════════════════ */}
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: isMobile ? '10px 16px 28px' : '12px 28px 36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 0.9fr', gap: '24px', alignItems: 'start' }}>

          {/* LEFT: Gallery */}
          <PropertyGallery property={property} onOpenInquiry={onOpenInquiry} />

          {/* RIGHT: Insight Panel */}
          <div style={{ ...G.goldBorder, padding: '24px', display: 'flex', flexDirection: 'column', gap: '0' }}>

            {/* Developer + AI Score ring */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BadgeCheck size={14} color="#D4AF37" />
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#D4AF37', letterSpacing: '0.07em', textTransform: 'uppercase' }}>{developerName}</span>
              </div>
              {/* AI Score ring */}
              <div style={{ position: 'relative', width: '54px', height: '54px', flexShrink: 0 }}>
                <svg width="54" height="54" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#D4AF37" strokeWidth="8"
                    strokeDasharray="283" strokeLinecap="round"
                    className={aiRingAnimated ? 'pdv-ring-animate' : ''}
                    style={{ strokeDashoffset: aiRingAnimated ? `${283 - (283 * aiScore / 100)}` : 283, transition: 'stroke-dashoffset 1.5s ease' }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#F3E5AB', lineHeight: 1 }}>{aiScore}%</div>
                  <div style={{ fontSize: '0.45rem', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.05em' }}>AI SCORE</div>
                </div>
              </div>
            </div>

            {/* Title + Location */}
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.6rem' : '1.9rem', fontWeight: 700, color: '#FFF', margin: '0 0 6px', lineHeight: 1.15 }}>
              {title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.83rem', color: '#718096', marginBottom: '14px' }}>
              <MapPin size={13} color="#D4AF37" />
              <span>{location}</span>
            </div>

            {/* Price block */}
            <div style={{ padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: '1.5rem', fontWeight: 700, color: '#F3E5AB' }}>{price}</div>
                <button onClick={onOpenInquiry} style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}>Price Breakup →</button>
              </div>
              {/* AI trend chip */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(105,200,140,0.12)', border: '1px solid rgba(105,200,140,0.3)', borderRadius: '100px', padding: '3px 10px' }}>
                <div className="pdv-ai-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#68D391', flexShrink: 0 }} />
                <TrendingUp size={10} color="#68D391" />
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#68D391' }}>AI: Price up 12% YoY in this micro-market</span>
              </div>
            </div>

            {/* 4 Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '18px' }}>
              {METRICS.map(({ Icon, label, sub }, i) => (
                <div key={i} style={{ padding: '10px 6px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
                  <Icon size={16} color="#D4AF37" style={{ marginBottom: '4px' }} />
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.82rem', fontWeight: 700, color: '#FFF', lineHeight: 1.2 }}>{label}</div>
                  <div style={{ fontSize: '0.58rem', color: '#718096', marginTop: '2px', lineHeight: 1.3 }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={onOpenInquiry} className="pdv-btn-gold"
                  style={{ flex: 1, padding: '13px', fontSize: '0.84rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', background: 'linear-gradient(135deg, #D4AF37, #C9A227)', color: '#09111F', border: 'none', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(212,175,55,0.35)' }}>
                  ENQUIRE NOW
                </button>
                <button onClick={onOpenInquiry} className="pdv-btn-outline"
                  style={{ flex: 1, padding: '13px', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', background: 'rgba(255,255,255,0.04)', color: '#FFF', border: '1px solid rgba(212,175,55,0.35)', borderRadius: '50px', cursor: 'pointer' }}>
                  BOOK SITE VISIT
                </button>
              </div>

              {/* Instant Download Brochure Button */}
              <button onClick={() => setBrochureModalOpen(true)}
                style={{ width: '100%', padding: '11px', borderRadius: '10px', background: 'rgba(212,175,55,0.08)', border: '1px dashed rgba(212,175,55,0.4)', color: '#F3E5AB', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(212,175,55,0.16)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(212,175,55,0.08)'}
              >
                <Download size={14} color="#D4AF37" /> Download Floor Plans & E-Brochure (PDF)
              </button>
            </div>

            {/* Save + Share + WhatsApp */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '14px' }}>
              <button onClick={() => setSaved(s => !s)}
                style={{ background: 'none', border: 'none', color: saved ? '#D4AF37' : '#718096', fontSize: '0.76rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600, transition: 'color 0.2s' }}>
                <Heart size={14} fill={saved ? '#D4AF37' : 'none'} /> {saved ? 'Saved ✓' : 'Save Property'}
              </button>
              <button onClick={handleShare}
                style={{ background: 'none', border: 'none', color: '#718096', fontSize: '0.76rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                <Share2 size={14} /> Share
              </button>
              <a href={`https://wa.me/919175050519?text=Hi%2024K%20Realtors%2C%20I%20am%20interested%20in%20${encodeURIComponent(title)}%20(${encodeURIComponent(location)})`}
                target="_blank" rel="noopener noreferrer"
                style={{ color: '#25D366', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700, textDecoration: 'none' }}>
                💬 VIP WhatsApp
              </a>
            </div>

            {/* Meta: RERA / Possession / Area */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center', marginBottom: '12px' }}>
              {[
                { label: 'RERA NO.',    value: reraNumber },
                { label: 'POSSESSION',  value: possession },
                { label: 'PROJECT AREA',value: projectArea },
              ].map((m, i) => (
                <div key={i}>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#FFF', marginTop: '3px' }}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* MahaRERA Official Govt Verification Link */}
            <a href="https://maharera.maharashtra.gov.in" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', borderRadius: '8px', background: 'rgba(105,200,140,0.08)', border: '1px solid rgba(105,200,140,0.25)', textDecoration: 'none' }}>
              <ShieldCheck size={14} color="#68D391" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#68D391' }}>MahaRERA Registered Property</div>
                <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.5)' }}>Agent RERA: A051262603190 · 100% Legal Clearance</div>
              </div>
              <ExternalLink size={12} color="#68D391" />
            </a>

            {/* AI Ask chip — now opens working AI chat modal */}
            <button onClick={openAiChat}
              style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 16px', borderRadius: '12px', background: 'rgba(99,179,237,0.08)', border: '1px solid rgba(99,179,237,0.35)', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(99,179,237,0.16)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(99,179,237,0.08)'}
            >
              <div className="pdv-ai-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#63B3ED', flexShrink: 0 }} />
              <Sparkles size={14} color="#63B3ED" />
              <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#BEE3F8', flex: 1 }}>Ask AI anything about this property →</span>
              <MessageSquare size={13} color="#63B3ED" />
            </button>

          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          STICKY TABS BAR
      ═══════════════════════════════════════ */}
      <div style={{ position: 'sticky', top: 0, zIndex: 90, background: 'rgba(7,16,29,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(212,175,55,0.18)', borderBottom: '1px solid rgba(212,175,55,0.18)' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: `0 ${px}`, overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '0', whiteSpace: 'nowrap' }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => scrollTo(tab.id)}
                className={`pdv-tab${activeTab === tab.id ? ' active' : ''}`}
                style={{ padding: '15px 18px', background: 'none', border: 'none', color: activeTab === tab.id ? '#F3E5AB' : '#718096', fontFamily: "'Montserrat', sans-serif", fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', letterSpacing: '0.05em', borderBottom: `3px solid ${activeTab === tab.id ? '#D4AF37' : 'transparent'}` }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          MAIN CONTENT SECTIONS
      ═══════════════════════════════════════ */}
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: isMobile ? '44px 16px' : '60px 28px' }}>

        {/* ══ 1. OVERVIEW ══ */}
        <AnimSection id="sec-overview">
          <SectionLabel>Overview</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.15fr 0.85fr', gap: '40px', alignItems: 'start' }}>
            {/* Left: Editorial text */}
            <div>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.75rem' : '2.4rem', fontWeight: 700, color: '#FFF', margin: '0 0 16px', lineHeight: 1.2 }}>
                Where nature meets<br />
                <span style={{ color: '#F3E5AB' }}>luxury & connectivity.</span>
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#A0AEC0', lineHeight: 1.9, margin: '0 0 24px' }}>
                {title} is a thoughtfully planned residential development by {developerName} in Hinjewadi Phase 1. Spread across <strong style={{ color: '#FFF' }}>{projectArea}</strong>, it offers 2 & 3 BHK premium homes with world-class amenities, lush green spaces, and seamless connectivity to Pune's top IT hubs, schools, hospitals and entertainment zones.
              </p>
              {/* Animated stats */}
              <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
                {[
                  { num: 4.54, suffix: ' Ac', label: 'Project Area' },
                  { num: 882,  suffix: '+',   label: 'Premium Homes' },
                  { num: 40,   suffix: '+',   label: 'Amenities' },
                  { num: 125,  suffix: '+',   label: 'Years Legacy' },
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: '1.6rem', fontWeight: 700, color: '#F3E5AB' }}>
                      <StatCounter target={Math.round(s.num)} suffix={s.suffix} />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#718096', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: '2px' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Key facts grid */}
            <div style={{ ...G.card, padding: '22px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {[
                  { Icon: Building2,   label: 'DEVELOPER',    value: developerName },
                  { Icon: BedDouble,   label: 'CONFIG',       value: '2 & 3 BHK' },
                  { Icon: Maximize2,   label: 'CARPET AREA',  value: '761 – 973 sq.ft' },
                  { Icon: Home,        label: 'TOTAL UNITS',  value: '~882 Homes' },
                  { Icon: Building2,   label: 'TOWERS',       value: '4' },
                  { Icon: TreePine,    label: 'PROJECT AREA', value: projectArea },
                  { Icon: Clock,       label: 'POSSESSION',   value: possession },
                  { Icon: ShieldCheck, label: 'RERA NO.',     value: reraNumber },
                ].map(({ Icon, label, value }, i) => (
                  <div key={i} style={{ padding: '11px 13px', borderRadius: '11px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                      <Icon size={12} color="#D4AF37" />
                      <span style={{ fontSize: '0.6rem', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
                    </div>
                    <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.84rem', fontWeight: 700, color: '#FFF', lineHeight: 1.3 }}>{value}</div>
                  </div>
                ))}
              </div>
              {/* 24K Verified strip */}
              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <Award size={14} color="#D4AF37" />
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#F3E5AB' }}>24K Realtors Verified Property</span>
                <CheckCircle2 size={13} color="#68D391" style={{ marginLeft: 'auto' }} />
              </div>
            </div>
          </div>
        </AnimSection>

        {/* ══ 2. HIGHLIGHTS ══ */}
        <AnimSection id="sec-highlights">
          <SectionLabel>Key Highlights</SectionLabel>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 700, color: '#FFF', margin: '0 0 24px', lineHeight: 1.2 }}>
            Why choose <span style={{ color: '#F3E5AB' }}>{title}?</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(6,1fr)', gap: '14px' }}>
            {HIGHLIGHTS.map(({ Icon, text }, i) => (
              <div key={i} className="pdv-hl-card"
                style={{ padding: '22px 14px', borderRadius: '16px', background: 'rgba(13,24,42,0.9)', border: '1px solid rgba(255,255,255,0.07)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', cursor: 'default' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color="#D4AF37" />
                </div>
                <div style={{ fontSize: '0.78rem', color: '#CBD5E0', fontWeight: 600, lineHeight: 1.45 }}>{text}</div>
              </div>
            ))}
          </div>
        </AnimSection>

        {/* ══ 3. AMENITIES ══ */}
        <AnimSection id="sec-amenities">
          <SectionLabel>World-Class Amenities</SectionLabel>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '22px', gap: '12px', flexWrap: 'wrap' }}>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 700, color: '#FFF', margin: 0, lineHeight: 1.2 }}>
              40+ amenities for your <span style={{ color: '#F3E5AB' }}>lifestyle</span>
            </h2>
            <button onClick={onOpenInquiry}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(6,1fr)', gap: '14px' }}>
            {AMENITIES.map(({ title: t, Icon, img }, i) => (
              <div key={i} className="pdv-amenity-card"
                style={{ borderRadius: '14px', overflow: 'hidden', background: '#0F1C2E', border: '1px solid rgba(255,255,255,0.07)', cursor: 'default' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}>
                  <img src={img} alt={t} className="pdv-amenity-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                  <div className="pdv-amenity-overlay"
                    style={{ position: 'absolute', inset: 0, background: 'rgba(5,10,18,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={28} color="#D4AF37" />
                  </div>
                </div>
                <div style={{ padding: '9px 8px', textAlign: 'center', fontSize: '0.76rem', fontWeight: 700, color: '#FFF' }}>{t}</div>
              </div>
            ))}
            {/* View all card */}
            <div onClick={onOpenInquiry}
              style={{ borderRadius: '14px', background: 'rgba(13,24,42,0.9)', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '18px', cursor: 'pointer', minHeight: '120px', gap: '8px' }}>
              <Zap size={22} color="#D4AF37" />
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#F3E5AB', textAlign: 'center' }}>View All 40+ Amenities</div>
              <ArrowRight size={14} color="#D4AF37" />
            </div>
          </div>
        </AnimSection>

        {/* ══ 4. LOCATION ══ */}
        <AnimSection id="sec-location">
          <SectionLabel>Location Advantage</SectionLabel>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 700, color: '#FFF', margin: '0 0 22px', lineHeight: 1.2 }}>
            Everything within <span style={{ color: '#F3E5AB' }}>easy reach</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.3fr', gap: '24px', alignItems: 'start' }}>
            {/* Travel time cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {LOCATIONS.map(({ name, time, pct, Icon: LocIcon }, i) => (
                <div key={i} className="pdv-loc-card"
                  style={{ padding: '13px 16px', borderRadius: '13px', background: 'rgba(13,24,42,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <LocIcon size={14} color="#D4AF37" />
                      </div>
                      <span style={{ fontSize: '0.84rem', color: '#E2E8F0', fontWeight: 600 }}>{name}</span>
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#F3E5AB', flexShrink: 0 }}>{time}</span>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: '3px', background: 'rgba(255,255,255,0.07)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div className="pdv-bar-animate"
                      style={{ height: '100%', background: 'linear-gradient(90deg, #D4AF37, #F3E5AB)', borderRadius: '4px', '--target-w': `${pct}%`, width: `${pct}%` }} />
                  </div>
                </div>
              ))}
              <button onClick={onOpenInquiry} className="pdv-btn-outline"
                style={{ padding: '12px', borderRadius: '50px', background: 'rgba(255,255,255,0.04)', color: '#FFF', border: '1px solid rgba(212,175,55,0.35)', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer', marginTop: '4px', letterSpacing: '0.04em' }}>
                VIEW ON GOOGLE MAPS
              </button>
            </div>
            {/* Map iframe */}
            <div style={{ position: 'relative', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.25)', aspectRatio: '4/3', background: '#0F1C2E' }}>
              <iframe
                src={`https://maps.google.com/maps?t=m&z=14&ie=UTF8&iwloc=&output=embed&q=${encodeURIComponent(address)}&zoom=14`}
                style={{ width: '100%', height: '100%', border: 'none', filter: 'invert(1) hue-rotate(180deg) saturate(0.75)' }}
                loading="lazy"
                title={`${title} Location Map`}
              />
            </div>
          </div>
        </AnimSection>

        {/* ══ 5. FLOOR PLANS ══ */}
        <AnimSection id="sec-floorplans">
          <SectionLabel>Floor Plans</SectionLabel>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 700, color: '#FFF', margin: '0 0 22px', lineHeight: 1.2 }}>
            Thoughtfully designed <span style={{ color: '#F3E5AB' }}>spaces</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: '20px' }}>
            {FLOOR_PLANS.map(({ type, area, price: fp_price, pct }, i) => (
              <div key={i} className="pdv-fp-card"
                style={{ padding: '20px', borderRadius: '18px', ...G.card }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', fontWeight: 700, color: '#FFF' }}>{type}</div>
                  <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#D4AF37', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '100px', padding: '2px 10px' }}>AVAILABLE</span>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#718096', marginBottom: '4px' }}>{area}</div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: '1.1rem', fontWeight: 700, color: '#F3E5AB', marginBottom: '10px' }}>{fp_price}</div>
                {/* Area bar */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #D4AF37, #F3E5AB)', borderRadius: '4px' }} />
                  </div>
                  <div style={{ fontSize: '0.62rem', color: '#718096', marginTop: '4px' }}>Carpet area utilization</div>
                </div>
                {/* Floor plan image */}
                <div style={{ borderRadius: '12px', overflow: 'hidden', background: 'rgba(0,0,0,0.4)', marginBottom: '14px', aspectRatio: '4/3' }}>
                  <img src="/floorplan_2bhk.png" alt={`${type} Floor Plan`} className="pdv-fp-img"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px', display: 'block' }}
                    onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=75'; }} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={onOpenInquiry}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', background: 'none', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', color: '#D4AF37', fontSize: '0.74rem', fontWeight: 700, padding: '8px', cursor: 'pointer' }}>
                    <ZoomIn size={13} /> View Plan
                  </button>
                  <button onClick={onOpenInquiry}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '8px', color: '#F3E5AB', fontSize: '0.74rem', fontWeight: 700, padding: '8px', cursor: 'pointer' }}>
                    <Download size={13} /> Download
                  </button>
                </div>
              </div>
            ))}
            {/* Customization card */}
            <div style={{ padding: '28px 22px', borderRadius: '18px', ...G.goldBorder, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '12px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Target size={22} color="#D4AF37" />
              </div>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.05rem', fontWeight: 700, color: '#FFF', margin: 0 }}>Need Customization?</h3>
              <p style={{ fontSize: '0.82rem', color: '#718096', margin: 0, lineHeight: 1.5 }}>Our AI advisor will match you with the perfect home configuration.</p>
              <button onClick={onOpenInquiry} className="pdv-btn-gold"
                style={{ padding: '11px 24px', borderRadius: '50px', background: 'linear-gradient(135deg, #D4AF37, #C9A227)', color: '#09111F', border: 'none', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer' }}>
                TALK TO EXPERT
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.65rem', color: '#68D391' }}>
                <Brain size={11} /> AI-powered matching enabled
              </div>
            </div>
          </div>
        </AnimSection>

        {/* ══ 5.5. EMI CALCULATOR & FINANCIAL INTELLIGENCE ══ */}
        <AnimSection id="sec-calculator">
          <SectionLabel>Mortgage & Affordability</SectionLabel>
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 700, color: '#FFF', margin: '0 0 8px', lineHeight: 1.2 }}>
            Interactive <span style={{ color: '#F3E5AB' }}>EMI & Home Loan Calculator</span>
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#718096', margin: '0 0 24px', maxWidth: '640px', lineHeight: 1.6 }}>
            Calculate your estimated monthly installment with preferred home loan interest rates (SBI, HDFC, ICICI 8.35% p.a.).
          </p>

          <div style={{ padding: isMobile ? '20px' : '32px', borderRadius: '22px', background: 'rgba(13,24,42,0.95)', border: '1px solid rgba(212,175,55,0.25)', marginBottom: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 0.8fr', gap: '32px', alignItems: 'center' }}>

              {/* Controls / Sliders */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Slider 1: Down Payment */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E0' }}>Down Payment</span>
                    <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#D4AF37' }}>{downPaymentPct}% (₹{(emiPrice * downPaymentPct / 100 / 100000).toFixed(2)} Lakhs)</span>
                  </div>
                  <input type="range" min="10" max="50" step="5" value={downPaymentPct} onChange={e => setDownPaymentPct(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#D4AF37', cursor: 'pointer' }} />
                </div>

                {/* Slider 2: Interest Rate */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E0' }}>Interest Rate (p.a.)</span>
                    <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#D4AF37' }}>{interestRate}%</span>
                  </div>
                  <input type="range" min="7.5" max="11.5" step="0.15" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#D4AF37', cursor: 'pointer' }} />
                  <div style={{ fontSize: '0.66rem', color: '#718096', marginTop: '4px' }}>*SBI & HDFC Special Rate: 8.35% for 24K Buyers</div>
                </div>

                {/* Slider 3: Loan Tenure */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E0' }}>Loan Tenure</span>
                    <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#D4AF37' }}>{tenureYears} Years</span>
                  </div>
                  <input type="range" min="5" max="30" step="5" value={tenureYears} onChange={e => setTenureYears(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#D4AF37', cursor: 'pointer' }} />
                </div>

                {/* Bank Partner Badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>PRE-APPROVED BANK PARTNERS:</span>
                  {['SBI Home Loans', 'HDFC Bank', 'ICICI Bank', 'Axis Bank'].map((b, i) => (
                    <span key={i} style={{ fontSize: '0.68rem', fontWeight: 700, color: '#F3E5AB', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '3px 9px' }}>{b}</span>
                  ))}
                </div>

              </div>

              {/* Result Summary Box */}
              <div style={{ padding: '24px', borderRadius: '18px', background: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(7,16,29,0.9))', border: '1px solid rgba(212,175,55,0.3)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#D4AF37', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '8px' }}>ESTIMATED MONTHLY EMI</div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: '2.2rem', fontWeight: 700, color: '#FFF', marginBottom: '14px', lineHeight: 1 }}>
                  ₹{emi.toLocaleString('en-IN')}<span style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 500 }}>/month</span>
                </div>

                {/* Breakdown list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px', textAlign: 'left', fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E0' }}>
                    <span>Principal Loan Amount:</span>
                    <strong style={{ color: '#FFF' }}>₹{(loanAmount / 100000).toFixed(2)} Lakhs</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E0' }}>
                    <span>Total Interest Payable:</span>
                    <strong style={{ color: '#F3E5AB' }}>₹{(totalInterest / 100000).toFixed(2)} Lakhs</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E0', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
                    <span>Total Amount Payable:</span>
                    <strong style={{ color: '#68D391' }}>₹{(totalPayment / 100000).toFixed(2)} Lakhs</strong>
                  </div>
                </div>

                <button onClick={onOpenInquiry} className="pdv-btn-gold"
                  style={{ width: '100%', padding: '13px', borderRadius: '50px', background: 'linear-gradient(135deg, #D4AF37, #C9A227)', color: '#09111F', border: 'none', fontSize: '0.84rem', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 6px 20px rgba(212,175,55,0.35)' }}>
                  GET PRE-APPROVED LOAN →
                </button>
              </div>

            </div>
          </div>
        </AnimSection>

        {/* ══ 6. AI PROPERTY INTELLIGENCE (NEW) ══ */}
        <AnimSection id="sec-ai-intel">
          <div style={{ padding: isMobile ? '24px 18px' : '36px 40px', borderRadius: '22px', background: 'linear-gradient(135deg, rgba(13,24,42,0.95) 0%, rgba(7,16,29,0.98) 100%)', border: '1px solid rgba(99,179,237,0.25)', position: 'relative', overflow: 'hidden' }}>
            {/* BG glow */}
            <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,179,237,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div className="pdv-ai-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#63B3ED' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#63B3ED', letterSpacing: '0.12em', textTransform: 'uppercase' }}>AI Property Intelligence</span>
            </div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 700, color: '#FFF', margin: '0 0 6px', lineHeight: 1.2 }}>
              What AI says about <span style={{ color: '#BEE3F8' }}>{title}</span>
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#718096', margin: '0 0 28px', lineHeight: 1.6 }}>
              Our AI engine has analyzed 50,000+ data points — pricing trends, infrastructure growth, rental yield, builder track record — to give you the most accurate property intelligence.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: '24px' }}>
              {/* Score bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {AI_SCORES.map(({ label, score, color }, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#CBD5E0' }}>{label}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: color }}>{score}/100</span>
                    </div>
                    <div style={{ height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${score}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: '4px', transition: 'width 1.2s ease' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* AI insights list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { Icon: TrendingUp,  color: '#68D391', text: 'Property prices in Hinjewadi IT corridor rose 18% in 2024 — among the fastest in Pune.' },
                  { Icon: BarChart3,   color: '#F6AD55', text: 'Average rental yield: 4.2% per annum. This project is projected at 4.8% on completion.' },
                  { Icon: Building2,   color: '#63B3ED', text: 'Godrej Properties has 100% on-time delivery record in Pune over the last 10 years.' },
                  { Icon: Sparkles,    color: '#D4AF37', text: "AI Match Score 94% — this property is a strong fit for IT professionals and families." },
                ].map(({ Icon: AiIcon, color, text }, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AiIcon size={14} color={color} />
                    </div>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#A0AEC0', lineHeight: 1.55 }}>{text}</p>
                  </div>
                ))}
                <button onClick={onOpenInquiry} className="pdv-btn-gold"
                  style={{ padding: '12px 20px', borderRadius: '50px', background: 'rgba(99,179,237,0.1)', border: '1px solid rgba(99,179,237,0.3)', color: '#BEE3F8', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                  <Brain size={15} /> Ask AI a Custom Question →
                </button>
              </div>
            </div>
          </div>
        </AnimSection>

        {/* ══ 7. SIMILAR PROPERTIES ══ */}
        <AnimSection id="sec-similar">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '22px', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <SectionLabel>AI-Matched Alternatives</SectionLabel>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 700, color: '#FFF', margin: 0, lineHeight: 1.2 }}>
                Similar <span style={{ color: '#F3E5AB' }}>properties</span> near you
              </h2>
            </div>
            <button onClick={onOpenInquiry} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4,1fr)', gap: '18px' }}>
            {SIMILAR.map(({ title: st, loc, config, price: sp, tag, match, img }, i) => (
              <div key={i} className="pdv-sim-card"
                style={{ borderRadius: '16px', overflow: 'hidden', background: '#0D1829', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', overflow: 'hidden' }}>
                  <img src={img} alt={st} className="pdv-sim-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                  {/* Gradient overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,16,29,0.6) 0%, transparent 50%)', pointerEvents: 'none' }} />
                  {/* Tag */}
                  <span style={{ position: 'absolute', top: '10px', left: '10px', background: tag === 'LUXURY' ? 'linear-gradient(135deg, #D4AF37, #9A7B1C)' : 'rgba(7,16,29,0.85)', color: tag === 'LUXURY' ? '#09111F' : '#F3E5AB', fontSize: '0.6rem', fontWeight: 800, padding: '3px 9px', borderRadius: '4px', textTransform: 'uppercase' }}>{tag}</span>
                  {/* AI Match */}
                  <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(7,16,29,0.85)', border: '1px solid rgba(99,179,237,0.4)', borderRadius: '100px', padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Brain size={9} color="#63B3ED" />
                    <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#BEE3F8' }}>{match}% Match</span>
                  </div>
                </div>
                <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '0.94rem', fontWeight: 700, color: '#FFF', margin: '0 0 3px' }}>{st}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.73rem', color: '#718096', marginBottom: '6px' }}>
                      <MapPin size={11} color="#D4AF37" /> {loc}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{config}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginTop: '10px' }}>
                    <span style={{ fontFamily: "'Cinzel', serif", fontSize: '1rem', fontWeight: 700, color: '#F3E5AB' }}>{sp}</span>
                    <button onClick={onOpenInquiry} style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.73rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      Details <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimSection>

        {/* ══ 8. LEAD CAPTURE BANNER ══ */}
        <div style={{ padding: isMobile ? '28px 20px' : '44px 52px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(13,24,42,0.97) 0%, rgba(7,16,29,0.99) 100%)', border: '1px solid rgba(212,175,55,0.28)', marginBottom: '40px', position: 'relative', overflow: 'hidden' }}>
          {/* Glow */}
          <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.15fr 0.85fr', gap: '32px', alignItems: 'center' }}>

            {/* Left: CTA text */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Sparkles size={14} color="#D4AF37" />
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#D4AF37', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Get Expert Consultation</span>
              </div>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700, color: '#FFF', margin: '0 0 10px', lineHeight: 1.2 }}>
                Ready to find your<br /><span style={{ color: '#F3E5AB' }}>perfect home?</span>
              </h2>
              <p style={{ fontSize: '0.84rem', color: '#718096', margin: '0 0 16px', lineHeight: 1.6 }}>
                Connect with our AI-powered real estate advisors and unlock the best offers, site visits, and home loan guidance.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#68D391', fontWeight: 600 }}>
                <Brain size={12} /> AI will match you with the best homes instantly
              </div>
            </div>

            {/* Center: Smart form */}
            {formSuccess ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '32px', borderRadius: '16px', background: 'rgba(105,200,140,0.08)', border: '1px solid rgba(105,200,140,0.25)' }}>
                <CheckCircle2 size={40} color="#68D391" />
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: '1.1rem', fontWeight: 700, color: '#FFF', textAlign: 'center' }}>Thank You!</div>
                <div style={{ fontSize: '0.82rem', color: '#A0AEC0', textAlign: 'center' }}>Our advisor will call you within 30 minutes.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { key: 'name',  type: 'text',  placeholder: 'Your Full Name',    Icon: Users },
                  { key: 'phone', type: 'tel',   placeholder: 'Mobile Number',     Icon: Phone },
                  { key: 'email', type: 'email', placeholder: 'Email (Optional)',  Icon: Mail  },
                ].map(({ key, type, placeholder, Icon: FieldIcon }) => (
                  <div key={key} style={{ position: 'relative' }}>
                    <FieldIcon size={14} color={formErrors[key] ? '#FC8181' : '#718096'}
                      style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={formData[key]}
                      onChange={e => { setFormData(d => ({ ...d, [key]: e.target.value })); setFormErrors(er => ({ ...er, [key]: '' })); }}
                      className="pdv-input"
                      style={{ width: '100%', padding: '12px 14px 12px 38px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${formErrors[key] ? 'rgba(252,129,129,0.6)' : 'rgba(255,255,255,0.1)'}`, color: '#FFF', fontSize: '0.84rem', boxSizing: 'border-box' }}
                    />
                    {formErrors[key] && <div style={{ fontSize: '0.65rem', color: '#FC8181', marginTop: '3px', paddingLeft: '4px' }}>{formErrors[key]}</div>}
                  </div>
                ))}
                <button type="submit" disabled={formSubmitting} className="pdv-btn-gold"
                  style={{ padding: '14px', borderRadius: '50px', background: formSubmitting ? 'rgba(212,175,55,0.5)' : 'linear-gradient(135deg, #D4AF37, #C9A227)', color: '#09111F', border: 'none', fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', cursor: formSubmitting ? 'wait' : 'pointer', letterSpacing: '0.04em' }}>
                  {formSubmitting ? 'Connecting you...' : 'ENQUIRE NOW — FREE'}
                </button>
              </form>
            )}

            {/* Right: Trust badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderLeft: isMobile ? 'none' : '1px solid rgba(255,255,255,0.07)', paddingLeft: isMobile ? 0 : '24px' }}>
              {TRUST.map(({ Icon: TIcon, text }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <TIcon size={15} color="#D4AF37" />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#CBD5E0', fontWeight: 600 }}>{text}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════
          AI PROPERTY ADVISOR CHAT MODAL
      ═══════════════════════════════════════════════════════════ */}
      {aiChatOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setAiChatOpen(false); }}
          style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end', justifyContent: isMobile ? 'stretch' : 'flex-end', padding: isMobile ? 0 : '24px' }}
        >
          <div style={{ width: isMobile ? '100%' : '420px', height: isMobile ? '88vh' : '600px', background: '#0A1220', border: '1px solid rgba(99,179,237,0.3)', borderRadius: isMobile ? '24px 24px 0 0' : '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 -20px 60px rgba(0,0,0,0.7)' }}>

            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(99,179,237,0.06)' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #63B3ED, #3182CE)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Brain size={18} color="#FFF" />
                </div>
                <div className="pdv-ai-dot" style={{ position: 'absolute', bottom: '1px', right: '1px', width: '9px', height: '9px', borderRadius: '50%', background: '#68D391', border: '2px solid #0A1220' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFF' }}>24K AI Property Advisor</div>
                <div style={{ fontSize: '0.68rem', color: '#68D391', fontWeight: 600 }}>● Online · Powered by Gemini</div>
              </div>
              <button onClick={() => setAiChatOpen(false)}
                style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#A0AEC0', transition: 'background 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              >
                <X size={15} />
              </button>
            </div>

            {/* Context chip */}
            <div style={{ padding: '10px 16px', background: 'rgba(212,175,55,0.06)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BadgeCheck size={12} color="#D4AF37" />
              <span style={{ fontSize: '0.68rem', color: '#D4AF37', fontWeight: 700 }}>Context loaded: {title} · {location}</span>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {aiMessages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                  {msg.role === 'ai' && (
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #63B3ED, #3182CE)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                      <Brain size={13} color="#FFF" />
                    </div>
                  )}
                  <div style={{
                    maxWidth: '82%',
                    padding: '10px 13px',
                    borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #D4AF37, #C9A227)'
                      : 'rgba(255,255,255,0.06)',
                    border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.09)',
                    color: msg.role === 'user' ? '#09111F' : '#E2E8F0',
                    fontSize: '0.8rem',
                    lineHeight: 1.6,
                    fontWeight: msg.role === 'user' ? 700 : 400,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {/* Typing indicator */}
              {aiThinking && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #63B3ED, #3182CE)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Brain size={13} color="#FFF" />
                  </div>
                  <div style={{ padding: '10px 14px', borderRadius: '14px 14px 14px 4px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {[0,1,2].map(d => (
                      <div key={d} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#63B3ED', animation: `pdv-pulse 1.2s ${d * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={aiChatEndRef} />
            </div>

            {/* Suggested questions (show only when no user messages yet) */}
            {aiMessages.filter(m => m.role === 'user').length === 0 && !aiThinking && (
              <div style={{ padding: '0 12px 10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {AI_SUGGESTED_QUESTIONS.map((q, i) => (
                  <button key={i} onClick={() => handleAiSend(q)}
                    style={{ padding: '6px 12px', borderRadius: '100px', background: 'rgba(99,179,237,0.08)', border: '1px solid rgba(99,179,237,0.3)', color: '#BEE3F8', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(99,179,237,0.18)'}
                    onMouseOut={e => e.currentTarget.style.background = 'rgba(99,179,237,0.08)'}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input bar */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
              <input
                ref={aiInputRef}
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !aiThinking) { e.preventDefault(); handleAiSend(); } }}
                placeholder="Ask about price, location, ROI..."
                disabled={aiThinking}
                style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', fontSize: '0.84rem', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'rgba(99,179,237,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
              <button
                onClick={() => handleAiSend()}
                disabled={aiThinking || !aiInput.trim()}
                style={{ width: '40px', height: '40px', borderRadius: '10px', background: aiInput.trim() && !aiThinking ? 'linear-gradient(135deg, #63B3ED, #3182CE)' : 'rgba(255,255,255,0.06)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: aiInput.trim() && !aiThinking ? 'pointer' : 'not-allowed', transition: 'all 0.2s', flexShrink: 0 }}
              >
                <Send size={16} color={aiInput.trim() && !aiThinking ? '#FFF' : '#4A5568'} />
              </button>
            </div>

            {/* Footer note */}
            <div style={{ padding: '6px 16px 10px', textAlign: 'center', fontSize: '0.6rem', color: '#4A5568' }}>
              AI responses are informational. For decisions, consult our experts.
            </div>

          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          E-BROCHURE DOWNLOAD LEAD CAPTURE MODAL
      ═══════════════════════════════════════════════════════════ */}
      {brochureModalOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setBrochureModalOpen(false); }}
          style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <div style={{ width: '100%', maxWidth: '440px', background: '#0D1829', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '24px', padding: '28px', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
            <button onClick={() => setBrochureModalOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#A0AEC0' }}>
              <X size={16} />
            </button>

            {brochureSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle2 size={48} color="#68D391" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.3rem', color: '#FFF', margin: '0 0 8px' }}>Brochure Unlocked!</h3>
                <p style={{ fontSize: '0.84rem', color: '#CBD5E0', marginBottom: '20px', lineHeight: 1.5 }}>
                  The official floor plans & price sheet PDF for <strong>{title}</strong> has been sent to your WhatsApp.
                </p>
                <button onClick={() => { setBrochureModalOpen(false); setBrochureSuccess(false); }} className="pdv-btn-gold"
                  style={{ padding: '12px 28px', borderRadius: '50px', background: 'linear-gradient(135deg, #D4AF37, #C9A227)', color: '#09111F', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                  Close Preview
                </button>
              </div>
            ) : (
              <form onSubmit={handleBrochureSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ textAlign: 'center' }}>
                  <Download size={32} color="#D4AF37" style={{ marginBottom: '8px' }} />
                  <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.3rem', color: '#FFF', margin: '0 0 6px' }}>Download E-Brochure</h3>
                  <p style={{ fontSize: '0.78rem', color: '#718096', margin: 0 }}>
                    Enter details to instantly unlock 4K Floor Plans & Price Sheet for {title}.
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase' }}>Full Name *</label>
                  <input required type="text" placeholder="e.g. Rahul Sharma" value={brochureForm.name}
                    onChange={e => setBrochureForm(f => ({ ...f, name: e.target.value }))}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', fontSize: '0.84rem', marginTop: '4px', boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase' }}>WhatsApp Number *</label>
                  <input required type="tel" placeholder="10-digit mobile number" value={brochureForm.phone}
                    onChange={e => setBrochureForm(f => ({ ...f, phone: e.target.value }))}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', fontSize: '0.84rem', marginTop: '4px', boxSizing: 'border-box' }} />
                </div>

                <button type="submit" disabled={brochureSubmitting} className="pdv-btn-gold"
                  style={{ width: '100%', padding: '14px', borderRadius: '50px', background: 'linear-gradient(135deg, #D4AF37, #C9A227)', color: '#09111F', border: 'none', fontWeight: 800, fontSize: '0.86rem', textTransform: 'uppercase', cursor: 'pointer', marginTop: '6px' }}>
                  {brochureSubmitting ? 'Unlocking PDF...' : 'DOWNLOAD BROCHURE NOW (PDF)'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          STICKY LUXURY RESPONSIVE ACTION BAR (MOBILE + DESKTOP)
      ═══════════════════════════════════════════════════════════ */}
      <div
        className="pdv-mobile-action-dock"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: 'rgba(7, 15, 30, 0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(212, 175, 55, 0.35)',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.65)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px'
        }}
      >
        {/* Left: Quick Property Summary (Desktop/Tablet) */}
        <div className="pdv-dock-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontFamily: "'Cinzel', serif", color: '#D4AF37', fontWeight: 800, fontSize: '0.92rem' }}>
              {title}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.6)' }}>
              {location} • <span style={{ color: '#FFF', fontWeight: 700 }}>{displayPrice}</span>
            </div>
          </div>
        </div>

        {/* Right: 1-Tap Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap' }}>
          {/* 1. WhatsApp Instant */}
          <a
            href={`https://wa.me/919673000053?text=Hi%2024K%20Realtors%2C%20I%20am%20interested%20in%20${encodeURIComponent(title)}%20(${encodeURIComponent(location)})`}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat with Senior Real Estate Advisor on WhatsApp"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 14px',
              borderRadius: '50px',
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              color: '#FFF',
              fontSize: '0.78rem',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(37,211,102,0.35)',
              whiteSpace: 'nowrap',
              transition: 'transform 0.2s ease'
            }}
          >
            <MessageSquare size={14} />
            <span className="pdv-btn-text">WhatsApp</span>
          </a>

          {/* 2. Direct Call Advisor */}
          <a
            href="tel:+919673000053"
            title="Call 24K Luxury Advisor Hotline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 14px',
              borderRadius: '50px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#FFF',
              fontSize: '0.78rem',
              fontWeight: 700,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'transform 0.2s ease'
            }}
          >
            <Phone size={13} color="#D4AF37" />
            <span className="pdv-btn-text">Call</span>
          </a>

          {/* 3. E-Brochure Download */}
          <button
            type="button"
            onClick={() => setIsBrochureModalOpen(true)}
            title="Download Verified E-Brochure & Floorplans"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 14px',
              borderRadius: '50px',
              background: 'rgba(212,175,55,0.12)',
              border: '1px solid rgba(212,175,55,0.4)',
              color: '#D4AF37',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <Download size={13} />
            <span className="pdv-btn-text">Brochure</span>
          </button>

          {/* 4. Book VIP Site Visit (Primary Gold Button) */}
          <button
            type="button"
            onClick={() => {
              if (onOpenInquiry) {
                onOpenInquiry(property);
              } else {
                const leadSec = document.getElementById('pdv-lead-form');
                if (leadSec) leadSec.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            title="Schedule Free AC Cab Site Visit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '50px',
              background: 'linear-gradient(135deg, #D4AF37, #C9A227)',
              color: '#070D18',
              fontSize: '0.80rem',
              fontWeight: 900,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(212,175,55,0.4)',
              whiteSpace: 'nowrap',
              fontFamily: "'Montserrat', sans-serif"
            }}
          >
            <Clock size={13} />
            <span>Book VIP Visit</span>
          </button>
        </div>
      </div>


    </div>
  );
}
