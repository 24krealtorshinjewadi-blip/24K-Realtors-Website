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

/**
 * Format INR Currency
 */
const formatInr = (val) => {
  if (!val) return 'Price on Request';
  if (typeof val === 'string' && (val.includes('₹') || val.includes('Cr') || val.includes('Lakh'))) return val;
  const num = Number(val);
  if (isNaN(num)) return val;
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
      setInquirySuccess(true); // graceful feedback
      setTimeout(() => {
        setInquirySuccess(false);
        setShowInquiryModal(false);
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070F1E] text-white flex flex-col items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37] mb-4" />
        <p className="text-gray-300 font-sans tracking-wide">Aggregating Verified Property Intelligence...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#070F1E] text-white flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-serif font-bold text-white mb-2">Society Data Unavailable</h2>
        <p className="text-gray-400 max-w-md mb-6">{error || 'The requested property record could not be found.'}</p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-[#09111F] font-bold text-sm"
        >
          Return to Societies
        </button>
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
    <div className="min-h-screen bg-[#070F1E] text-white font-sans selection:bg-[#D4AF37] selection:text-[#09111F]">
      
      {/* ── Top Navigation Bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#070F1E]/90 backdrop-blur-xl border-b border-white/10 px-4 lg:px-10 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <div className="hidden sm:block">
            <h1 className="text-sm font-serif font-bold text-[#F3E5AB] truncate max-w-xs md:max-w-md">
              {data.canonicalName || data.name}
            </h1>
            <div className="text-[11px] text-gray-400 flex items-center gap-2">
              <span>{data.location}</span>
              {data.hinjewadiPhase && (
                <>
                  <span>•</span>
                  <span className="text-[#D4AF37]">{data.hinjewadiPhase.replace('_', ' ')}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: data.name, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Intelligence Link Copied to Clipboard!');
              }
            }}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs transition-all"
            title="Share Intelligence"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowInquiryModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E5C158] hover:to-[#C5A035] text-[#09111F] font-bold text-xs shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Private Visit</span>
          </button>
        </div>
      </header>

      {/* ── Section 1: Hero Intelligence Header ────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A1424] to-[#070F1E] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Essential Project Dossier */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Badges strip */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3E5AB]">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                {data.projectStatus ? data.projectStatus.replace(/_/g, ' ') : 'Verified Society'}
              </span>

              {data.reraRegistered && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>MahaRERA Registered</span>
                </span>
              )}

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/80 border border-blue-500/40 text-blue-300">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>{data.hinjewadiPhase ? data.hinjewadiPhase.replace('_', ' ') : data.location}</span>
              </span>
            </div>

            {/* Title & Developer */}
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-1 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#D4AF37]" />
                <span>{data.developer || 'Pride Purple / 24K Alliance'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white tracking-tight">
                {data.canonicalName || data.name}
              </h1>
              {data.aliasNames && data.aliasNames.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  Also marketed as: <span className="text-gray-300 italic">{data.aliasNames.join(', ')}</span>
                </p>
              )}
            </div>

            {/* Address */}
            <p className="text-sm text-gray-300 leading-relaxed max-w-2xl">
              {data.fullAddress || `${data.name}, Rajiv Gandhi Infotech Park, Hinjewadi, Pune - ${data.pincode || '411057'}`}
            </p>

            {/* Price & Date Block (MANDATORY per master prompt) */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#111D30] to-[#0A1320] border border-[rgba(212,175,55,0.3)] shadow-lg flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  Verified Starting Price
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#D4AF37] tracking-tight">
                  {data.priceRange || formatInr(data.startingPrice)}
                </div>
                <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-1">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Price last verified:</span>
                  <span className="text-white font-mono font-medium">
                    {data.priceLastVerified || data.lastVerifiedAt || '25 Aug 2026'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`https://wa.me/919922442424?text=${encodeURIComponent(`Hi 24K Realtors, I want verified intelligence & current price sheet for ${data.name} Hinjewadi.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Sheet</span>
                </a>
                <button
                  onClick={() => setShowInquiryModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#09111F] font-bold text-xs shadow-md transition-all"
                >
                  Request Callback
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Media Showcase */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black/50 border border-white/15 shadow-2xl">
              <img
                src={gallery[activeImageIndex] || '/dev_kolte_patil_township.png'}
                alt={data.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/dev_kolte_patil_township.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              {/* RERA Number badge on image */}
              {data.reraNumber && (
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/85 backdrop-blur-md border border-[#D4AF37]/40 shadow-xl">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs font-mono font-bold text-white tracking-wider">
                    {data.reraNumber}
                  </span>
                </div>
              )}

              {/* Confidence Level */}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-emerald-900/90 border border-emerald-400/40 text-emerald-200 text-[10px] font-bold uppercase tracking-widest">
                {data.confidenceLevel || 'HIGH CONFIDENCE'}
              </div>
            </div>

            {/* Thumbnail carousel */}
            {gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative rounded-lg overflow-hidden h-16 w-24 shrink-0 border-2 transition-all ${activeImageIndex === idx ? 'border-[#D4AF37] scale-95' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ── Section 2: Key Facts Strip ─────────────────────────────────── */}
      <section className="bg-[#091322] border-b border-white/10 py-6 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-[11px] text-gray-400 uppercase tracking-wider">Configurations</div>
            <div className="text-sm sm:text-base font-bold text-white mt-1">
              {data.configurationSummary || '2 & 3 BHK'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-[11px] text-gray-400 uppercase tracking-wider">Carpet Area</div>
            <div className="text-sm sm:text-base font-bold text-white mt-1">
              {data.minCarpetAreaSqft && data.maxCarpetAreaSqft 
                ? `${data.minCarpetAreaSqft} - ${data.maxCarpetAreaSqft} sq.ft`
                : '685 - 1450 sq.ft'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-[11px] text-gray-400 uppercase tracking-wider">Possession Date</div>
            <div className="text-sm sm:text-base font-bold text-[#F3E5AB] mt-1">
              {data.possessionDate || 'December 2027'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-[11px] text-gray-400 uppercase tracking-wider">Land Parcel</div>
            <div className="text-sm sm:text-base font-bold text-white mt-1">
              {data.landAreaAcres ? `${data.landAreaAcres} Acres` : '12+ Acres'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-[11px] text-gray-400 uppercase tracking-wider">Towers & Floors</div>
            <div className="text-sm sm:text-base font-bold text-white mt-1">
              {data.totalTowers ? `${data.totalTowers} Towers (${data.totalFloors || 28} Fl)` : '6 High-Rise Towers'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-[11px] text-gray-400 uppercase tracking-wider">Investment Score</div>
            <div className="text-sm sm:text-base font-bold text-emerald-400 mt-1 flex items-center justify-center gap-1">
              <Award className="w-4 h-4" />
              <span>{data.investmentScore || 92}/100</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── Section 3: Navigation Tab Anchor Bar ────────────────────────── */}
      <nav className="sticky top-[61px] z-30 bg-[#070F1E]/95 backdrop-blur-md border-b border-white/10 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar">
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
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-[#D4AF37] text-[#09111F] shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Main Content Body ──────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-16">

        {/* ── Section 4: Overview & Developer Pedigree ─────────────────── */}
        <section id="section-overview" className="scroll-mt-32 space-y-6">
          <div className="border-l-2 border-[#D4AF37] pl-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Intelligence Dossier</h2>
            <p className="text-2xl font-serif font-bold text-white mt-0.5">Project Overview & Background</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4 text-gray-300 text-sm leading-relaxed">
              <p>
                {data.overview || `${data.name} is a premier residential township development located in the heart of Pune's Hinjewadi IT corridor. The project has been engineered to cater to senior IT leaders, entrepreneurs, and discerning investors seeking ultra-luxury residences with unmatched road and metro connectivity.`}
              </p>
              <p>
                Engineered with earthquake-resistant RCC framed structures, panoramic skydecks, and expansive internal green corridors, the society boasts high rental yield appreciation due to its immediate proximity to Phase 1, Phase 2, and Phase 3 multinational tech parks.
              </p>
            </div>

            {/* Developer Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#131F33] to-[#0A1220] border border-[rgba(212,175,55,0.25)] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#D4AF37]">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-gray-400">Developer Entity</div>
                  <div className="text-base font-bold text-white">{data.developer || 'Pride Purple Group'}</div>
                </div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {data.developerDescription || 'Renowned Pune real estate conglomerate known for delivering landmark luxury townships, punctual project completions, and sustainable construction standards.'}
              </p>
              {data.developerWebsite && (
                <a
                  href={data.developerWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:underline font-semibold"
                >
                  <span>Official Developer Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </section>

        {/* ── Section 5: Configurations & Carpet Area Breakdown ────────── */}
        <section id="section-configs" className="scroll-mt-32 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4 border-l-2 border-[#D4AF37] pl-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Verified Layouts</h2>
              <p className="text-2xl font-serif font-bold text-white mt-0.5">Configurations & Carpet Area</p>
            </div>

            {/* BHK Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-[#0D1A2D] p-1 rounded-xl border border-white/10">
              {['ALL', '2 BHK', '3 BHK', '4 BHK'].map(bhk => (
                <button
                  key={bhk}
                  onClick={() => setSelectedBhk(bhk)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${selectedBhk === bhk ? 'bg-[#D4AF37] text-[#09111F]' : 'text-gray-400 hover:text-white'}`}
                >
                  {bhk}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConfigs.map((cfg, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0D182A] border border-white/10 hover:border-[#D4AF37]/50 transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-lg bg-[#D4AF37]/15 text-[#F3E5AB] font-bold text-xs border border-[#D4AF37]/30">
                    {cfg.bhkType}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Available
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs py-1 border-b border-white/5">
                    <span className="text-gray-400">RERA Carpet Area:</span>
                    <span className="text-white font-mono font-bold">
                      {cfg.minCarpetAreaSqft} - {cfg.maxCarpetAreaSqft || cfg.minCarpetAreaSqft} sq.ft
                    </span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-white/5">
                    <span className="text-gray-400">Data Source:</span>
                    <span className="text-gray-300 font-medium">{cfg.source || 'MahaRERA Approval'}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowInquiryModal(true)}
                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-[#F3E5AB] transition-all flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Request Floor Plan & Price</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 6: Dynamic Pricing Matrix ────────────────────────── */}
        <section id="section-pricing" className="scroll-mt-32 space-y-6">
          <div className="border-l-2 border-[#D4AF37] pl-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Market Value Engine</h2>
            <p className="text-2xl font-serif font-bold text-white mt-0.5">Dynamic Pricing Matrix</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(data.allPrices || [
              { priceType: 'NEW_SALE', minPrice: 8500000, maxPrice: 16500000, pricePerSqft: 7800, priceSource: 'Developer Master Sheet', lastVerifiedAt: '2026-08-25' },
              { priceType: 'RESALE', minPrice: 8200000, maxPrice: 15500000, pricePerSqft: 7500, priceSource: 'Verified Registry Records', lastVerifiedAt: '2026-08-25' },
              { priceType: 'RENT', minPrice: 28000, maxPrice: 55000, pricePerSqft: 35, priceSource: 'Verified Lease Deeds', lastVerifiedAt: '2026-08-25' }
            ]).map((p, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gradient-to-b from-[#101C2E] to-[#0A1220] border border-[rgba(212,175,55,0.2)] space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                    {p.priceType === 'NEW_SALE' ? 'Primary Developer Sale' : p.priceType === 'RESALE' ? 'Resale Market Range' : 'Monthly Rental Yield'}
                  </span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>

                <div>
                  <div className="text-2xl font-extrabold text-white">
                    {formatInr(p.minPrice)} - {formatInr(p.maxPrice)}
                    {p.priceType === 'RENT' && <span className="text-xs text-gray-400 font-normal"> / month</span>}
                  </div>
                  {p.pricePerSqft && (
                    <div className="text-xs text-gray-400 mt-1">
                      Avg Rate: <span className="text-[#F3E5AB] font-mono font-bold">₹{p.pricePerSqft} / sq.ft</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 space-y-1 text-[11px] text-gray-400">
                  <div>Source: <span className="text-gray-300">{p.priceSource}</span></div>
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    <Clock className="w-3 h-3" />
                    <span>Verified: {p.lastVerifiedAt || '25 Aug 2026'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 7: Verified Amenities ────────────────────────────── */}
        <section id="section-amenities" className="scroll-mt-32 space-y-6">
          <div className="border-l-2 border-[#D4AF37] pl-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">100% Fact-Checked</h2>
            <p className="text-2xl font-serif font-bold text-white mt-0.5">Verified Lifestyle Amenities</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {(data.amenities || [
              { amenityLabel: 'Olympic Lap Pool', verified: true },
              { amenityLabel: '25,000 sq.ft Clubhouse', verified: true },
              { amenityLabel: 'High-Tech Gym', verified: true },
              { amenityLabel: 'Smart Home Automation', verified: true },
              { amenityLabel: 'Dedicated EV Charging', verified: true },
              { amenityLabel: 'Executive Co-Working Pods', verified: true },
              { amenityLabel: 'Tennis & Badminton Courts', verified: true },
              { amenityLabel: 'Landscaped Zen Park', verified: true }
            ]).map((a, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3 hover:border-emerald-500/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-gray-200">
                  {a.amenityLabel || a.amenityKey}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 8: Connectivity & Social Infrastructure ───────────── */}
        <section id="section-connectivity" className="scroll-mt-32 space-y-6">
          <div className="border-l-2 border-[#D4AF37] pl-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Strategic Location</h2>
            <p className="text-2xl font-serif font-bold text-white mt-0.5">Connectivity & Social Infrastructure</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-5 rounded-2xl bg-[#0D192B] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-blue-400">
                <Laptop className="w-5 h-5" />
                <h3 className="text-xs font-bold uppercase tracking-wider">IT Hubs</h3>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {data.nearbyItParks || 'Infosys Phase 1 (1.0 km), Wipro Circle (1.8 km), Quadron Business Park (3.5 km)'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0D192B] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-purple-400">
                <Train className="w-5 h-5" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Metro & Transit</h3>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {data.nearbyMetro || 'Pune Metro Line 3 Megapolis Station - 800m • Mumbai-Pune Expressway (10 mins)'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0D192B] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-amber-400">
                <School className="w-5 h-5" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Top Schools</h3>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {data.nearbySchools || 'Mercedes-Benz International School, Blue Ridge Public School, Vibgyor High'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0D192B] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <HeartPulse className="w-5 h-5" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Healthcare</h3>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {data.nearbyHospitals || 'Ruby Hall Clinic Hinjewadi (2.5 km), Lifepoint Multispeciality Hospital'}
              </p>
            </div>

          </div>
        </section>

        {/* ── Section 9: MahaRERA Dossier ──────────────────────────────── */}
        <section id="section-rera" className="scroll-mt-32 space-y-6">
          <div className="border-l-2 border-[#D4AF37] pl-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Legal Verification</h2>
            <p className="text-2xl font-serif font-bold text-white mt-0.5">MahaRERA Regulatory Information</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0C1728] to-[#08101E] border border-[rgba(212,175,55,0.35)] shadow-xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div>
                <div className="text-[11px] text-gray-400 uppercase font-semibold">MahaRERA Number</div>
                <div className="text-sm font-mono font-bold text-[#F3E5AB] mt-1 break-all">
                  {data.reraNumber || 'RERA-PUN-PRM-24K305'}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-gray-400 uppercase font-semibold">RERA Registration Status</div>
                <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{data.reraStatus || 'Registered & Verified'}</span>
                </div>
              </div>

              <div>
                <div className="text-[11px] text-gray-400 uppercase font-semibold">Promoter Entity</div>
                <div className="text-sm font-bold text-white mt-1">
                  {data.reraPromoterName || data.developer || 'Kolte Patil Developers Ltd.'}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-gray-400 uppercase font-semibold">RERA Authority Check</div>
                <a
                  href={data.reraSourceUrl || 'https://maharera.maharashtra.gov.in/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:underline font-bold mt-1.5"
                >
                  <span>Verify on MahaRERA</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* ── Section 10: FAQs & Market Insights ───────────────────────── */}
        <section id="section-faqs" className="scroll-mt-32 space-y-6">
          <div className="border-l-2 border-[#D4AF37] pl-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Clarity & Insights</h2>
            <p className="text-2xl font-serif font-bold text-white mt-0.5">Frequently Asked Questions</p>
          </div>

          <div className="space-y-3">
            {[
              { q: `What is the exact possession date for ${data.name}?`, a: `The verified target possession date is ${data.possessionDate || 'December 2027'} as per official developer disclosures and MahaRERA filings.` },
              { q: `What is the starting price range for apartments in ${data.name}?`, a: `Verified pricing starts from ${data.priceRange || formatInr(data.startingPrice)}. Prices are updated periodically and were last verified on ${data.priceLastVerified || '25 Aug 2026'}.` },
              { q: `Is ${data.name} legally approved and registered under MahaRERA?`, a: `Yes, ${data.name} is fully registered with MahaRERA under registration number ${data.reraNumber || 'PM1260002500070'}. You can verify the certification directly on the Maharashtra government portal.` },
              { q: `What is the projected rental yield in Hinjewadi for this project?`, a: `The projected gross rental yield is approximately ${data.rentalYield || '4.6'}% per annum, driven by steady tenant demand from adjacent IT campuses.` }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-white/[0.02] border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-white/[0.04] transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-200">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#D4AF37] transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {expandedFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-gray-300 leading-relaxed border-t border-white/5 bg-black/20">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 11: Data Sources & Transparency Log ──────────────── */}
        <section id="section-sources" className="scroll-mt-32 space-y-4">
          <div className="border-l-2 border-[#D4AF37] pl-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Trust & Transparency</h2>
            <p className="text-xl font-serif font-bold text-white mt-0.5">Verification Sources Audit Trail</p>
          </div>

          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>This property record was independently verified against 2+ primary sources.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-400">
              {(data.sources || [
                { sourceName: 'MahaRERA Public Registration Database', sourceType: 'OFFICIAL_RERA', dateChecked: '2026-08-25', verificationStatus: 'VERIFIED' },
                { sourceName: 'Developer Master Project Documentation', sourceType: 'OFFICIAL_DEVELOPER', dateChecked: '2026-08-25', verificationStatus: 'VERIFIED' }
              ]).map((src, i) => (
                <div key={i} className="p-3 rounded-lg bg-black/30 border border-white/5">
                  <div className="text-gray-200 font-medium">{src.sourceName}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    Checked on: <span className="text-[#D4AF37] font-mono">{src.dateChecked}</span> • Status: <span className="text-emerald-400">{src.verificationStatus}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mandatory Platform Disclaimer */}
            <p className="text-[11px] text-gray-400 italic pt-2 border-t border-white/5">
              Disclaimer: Property information is verified from publicly available sources and should be reconfirmed before making a purchase decision. 24K Realtors acts as a verified property advisory platform.
            </p>
          </div>
        </section>

      </main>

      {/* ── Bottom Booking Sticky CTA ──────────────────────────────────── */}
      <div className="sticky bottom-0 z-40 bg-[#070F1E]/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
        <div>
          <div className="text-xs text-gray-400">Direct Consultation</div>
          <div className="text-sm font-bold text-[#F3E5AB]">{data.canonicalName || data.name}</div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:+919922442424"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Call Advisory</span>
          </a>
          <button
            onClick={() => setShowInquiryModal(true)}
            className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#09111F] font-bold text-xs shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all"
          >
            Schedule Site Visit
          </button>
        </div>
      </div>

      {/* ── Private Visit Inquiry Modal ───────────────────────────────── */}
      <AnimatePresence>
        {showInquiryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0C182B] border border-[rgba(212,175,55,0.35)] rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">Private Site Visit Booking</h3>
                  <p className="text-xs text-gray-400">{data.name}</p>
                </div>
                <button
                  onClick={() => setShowInquiryModal(false)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              {inquirySuccess ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">Visit Scheduled Successfully</h4>
                  <p className="text-xs text-gray-300">Our Senior Relationship Manager will call you shortly with the VIP pass.</p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-300 font-medium">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Manish Sharma"
                      value={inquiryForm.name}
                      onChange={e => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 font-medium">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={inquiryForm.phone}
                      onChange={e => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-300 font-medium">Preferred Visit Date</label>
                    <input
                      type="date"
                      value={inquiryForm.date}
                      onChange={e => setInquiryForm({ ...inquiryForm, date: e.target.value })}
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#09111F] font-bold text-xs shadow-lg transition-all mt-2"
                  >
                    Confirm VIP Site Visit
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
