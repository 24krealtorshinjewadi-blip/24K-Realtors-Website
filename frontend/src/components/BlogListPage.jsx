/**
 * BlogListPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Public Blog Listing Page — 24K Realtors Pune
 *
 * Features:
 *  • Fetches published blogs from /api/v1/blogs (public endpoint)
 *  • Client-side search + category filter
 *  • Server-side pagination (6 posts per page)
 *  • Premium dark-gold luxury design consistent with portal theme
 *  • Hero editorial header with animated gold gradient
 *  • Featured post (first post) in full-width hero card
 *  • SEO: Article JSON-LD schema, dynamic meta tags
 *  • WhatsApp share per card
 *  • Skeleton loading state
 *  • Fallback to sample blogs when API unavailable (dev/demo mode)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  BookOpen, Search, ChevronLeft, ChevronRight, Clock,
  User, Calendar, Tag, ArrowRight, Home, Sparkles,
  TrendingUp, MapPin, Building2, BadgeCheck
} from 'lucide-react';
import { useSEO } from '../services/seoService';
import { API_BASE_URL, WHATSAPP_BASE } from '../constants';

/* ── Inject styles once ── */
const STYLE_ID = 'blp-styles-v1';
const BLP_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Montserrat:wght@400;500;600;700;800&display=swap');

.blp-root { font-family: 'Montserrat', sans-serif; }

@keyframes blp-shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes blp-fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes blp-pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }

.blp-animate-in { animation: blp-fade-up 0.55s ease both; }
.blp-card { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; cursor: pointer; }
.blp-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,0,0,0.55) !important; border-color: rgba(212,175,55,0.35) !important; }
.blp-card:hover .blp-card-img { transform: scale(1.06); }
.blp-card-img { transition: transform 0.45s ease; }

.blp-featured-card { transition: box-shadow 0.3s ease, border-color 0.3s ease; }
.blp-featured-card:hover { box-shadow: 0 30px 80px rgba(0,0,0,0.6) !important; border-color: rgba(212,175,55,0.5) !important; }
.blp-featured-card:hover .blp-featured-img { transform: scale(1.04); }
.blp-featured-img { transition: transform 0.6s ease; }

.blp-search { transition: border-color 0.2s ease, box-shadow 0.2s ease; }
.blp-search:focus { border-color: rgba(212,175,55,0.6) !important; box-shadow: 0 0 0 3px rgba(212,175,55,0.1) !important; outline: none; }

.blp-cat { transition: all 0.2s ease; }
.blp-cat:hover { border-color: rgba(212,175,55,0.5) !important; background: rgba(212,175,55,0.08) !important; }
.blp-cat.active { background: linear-gradient(135deg, #D4AF37, #C9A227) !important; color: #09111F !important; border-color: #D4AF37 !important; }

.blp-page-btn { transition: all 0.2s ease; }
.blp-page-btn:hover:not(:disabled) { background: rgba(212,175,55,0.15) !important; border-color: rgba(212,175,55,0.5) !important; }
.blp-page-btn.active { background: linear-gradient(135deg, #D4AF37, #C9A227) !important; color: #09111F !important; border-color: #D4AF37 !important; }

/* Skeleton */
.blp-skeleton { background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%); background-size: 200% 100%; animation: blp-shimmer 1.5s infinite; border-radius: 8px; }
`;

function injectStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const tag = document.createElement('style');
  tag.id = STYLE_ID;
  tag.textContent = BLP_CSS;
  document.head.appendChild(tag);
}

/* ── Category tags for filtering ── */
const CATEGORIES = [
  { id: 'all',         label: 'All Articles' },
  { id: 'investment',  label: '📈 Investment' },
  { id: 'hinjewadi',   label: '📍 Hinjewadi' },
  { id: 'rera',        label: '🛡️ RERA & Legal' },
  { id: 'home-loan',   label: '🏦 Home Loan' },
  { id: 'market',      label: '📊 Market Trends' },
  { id: 'nri',         label: '🌍 NRI Guide' },
];

/* ── Sample fallback blogs (shown when API unavailable) ── */
const SAMPLE_BLOGS = [
  {
    id: '1', slug: 'best-3bhk-hinjewadi-phase-2-under-1-crore',
    title: 'Best 3 BHK Flats in Hinjewadi Phase 2 Under ₹1 Crore — 2026 Guide',
    seoDescription: 'A complete verified guide to the best 3 BHK apartments in Hinjewadi Phase 2 under 1 crore. Includes MahaRERA numbers, possession dates and builder track records.',
    coverImageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=75',
    author: 'Neeraj Giri', createdDate: '2026-08-20T10:00:00',
    content: 'Hinjewadi Phase 2 is Pune\'s fastest-growing IT micro-market...'
  },
  {
    id: '2', slug: 'hinjewadi-metro-impact-property-prices-2026',
    title: 'How Hinjewadi Metro (Line 3) Will Impact Property Prices in 2026–2028',
    seoDescription: 'Detailed analysis of how the upcoming Pune Metro Line 3 extension to Hinjewadi will drive 15–25% property appreciation in Wakad, Hinjewadi Phase 1 and Phase 2.',
    coverImageUrl: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?auto=format&fit=crop&w=800&q=75',
    author: '24K Research Desk', createdDate: '2026-08-15T09:00:00',
    content: 'The Pune Metro Line 3 extension to Hinjewadi is set to be a game-changer...'
  },
  {
    id: '3', slug: 'maharera-verified-societies-hinjewadi-2026',
    title: 'MahaRERA Verified Societies in Hinjewadi — Complete 2026 Checklist',
    seoDescription: 'How to verify a MahaRERA registration for Hinjewadi societies. Includes RERA numbers for Godrej Woodsville, Kolte Patil Life Republic, VTP Monarque & more.',
    coverImageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=75',
    author: 'Legal Advisory Desk', createdDate: '2026-08-10T11:00:00',
    content: 'MahaRERA verification is the single most important step before booking any property in Maharashtra...'
  },
  {
    id: '4', slug: 'home-loan-guide-sbi-hdfc-icici-hinjewadi-2026',
    title: 'Home Loan Guide 2026: SBI vs HDFC vs ICICI — Best Rates for Hinjewadi Properties',
    seoDescription: 'Compare SBI, HDFC, and ICICI home loan rates for Hinjewadi properties in 2026. Includes EMI calculator, eligibility tips, and pre-approval process for IT professionals.',
    coverImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=75',
    author: 'Finance Advisory Team', createdDate: '2026-08-05T08:00:00',
    content: 'If you\'re planning to buy a flat in Hinjewadi or Wakad, understanding home loan options is critical...'
  },
  {
    id: '5', slug: 'nri-investment-guide-hinjewadi-pune-2026',
    title: 'NRI Investment Guide: Why Hinjewadi Pune Is India\'s Best Real Estate Bet in 2026',
    seoDescription: 'Complete NRI investment guide for Hinjewadi Pune 2026. FEMA compliance, NRE/NRO accounts, rental yield projections (4.8–5.5%), and virtual site visit process.',
    coverImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=75',
    author: 'NRI Advisory Desk', createdDate: '2026-07-30T10:00:00',
    content: 'Hinjewadi IT corridor is now among the top 3 preferred destinations for NRI real estate investment...'
  },
  {
    id: '6', slug: 'godrej-kolte-vtp-shapoorji-comparison-hinjewadi',
    title: 'Godrej vs Kolte-Patil vs VTP vs Shapoorji — Which Builder Should You Choose in Hinjewadi?',
    seoDescription: 'Unbiased comparison of Godrej Properties, Kolte-Patil, VTP Realty, and Shapoorji Pallonji projects in Hinjewadi. On-time delivery, construction quality, and after-sales ratings.',
    coverImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=75',
    author: 'Manish Rai', createdDate: '2026-07-25T09:00:00',
    content: 'Choosing the right builder is as important as choosing the right location...'
  },
];

/* ── Format relative date ── */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ── Estimated read time ── */
function readTime(content) {
  const words = (content || '').split(/\s+/).length;
  return Math.max(3, Math.round(words / 200));
}

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div style={{ borderRadius: '18px', background: 'rgba(13,24,42,0.9)', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
      <div className="blp-skeleton" style={{ height: '200px', width: '100%' }} />
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="blp-skeleton" style={{ height: '14px', width: '60%' }} />
        <div className="blp-skeleton" style={{ height: '20px', width: '90%' }} />
        <div className="blp-skeleton" style={{ height: '20px', width: '75%' }} />
        <div className="blp-skeleton" style={{ height: '14px', width: '50%' }} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
export default function BlogListPage({ onBack, onSelectBlog }) {
  injectStyles();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const searchRef = useRef(null);

  const PAGE_SIZE = 6;

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  /* ── SEO ── */
  useSEO({
    title: 'Real Estate Blog — Expert Guides, Market Insights & Investment Tips',
    description: '24K Realtors expert blog: MahaRERA guides, Hinjewadi investment analysis, home loan comparisons, NRI guides, and Pune real estate market trends. Updated 2026.',
    url: '/#blog',
    type: 'website',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: '24K Realtors — Real Estate Insights Blog',
      description: 'Expert real estate guides, market analysis, RERA verification help, and investment tips for Hinjewadi, Wakad, and Pune West.',
      url: 'https://real-estate-digital-marketing.vercel.app/#blog',
      publisher: {
        '@type': 'RealEstateAgent',
        name: '24K Realtors Pune',
        url: 'https://real-estate-digital-marketing.vercel.app/',
        logo: { '@type': 'ImageObject', url: 'https://real-estate-digital-marketing.vercel.app/favicon.svg' }
      }
    }
  });

  /* ── Fetch blogs ── */
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/blogs?page=${page}&size=${PAGE_SIZE}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const content = data.content || [];
      setBlogs(content.length > 0 ? content : SAMPLE_BLOGS);
      setTotalPages(data.totalPages || (content.length === 0 ? 1 : Math.ceil(SAMPLE_BLOGS.length / PAGE_SIZE)));
    } catch (err) {
      console.warn('[BlogListPage] API unavailable, using sample data:', err.message);
      // Graceful fallback — show sample blogs
      setBlogs(SAMPLE_BLOGS);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlogs();
  }, [fetchBlogs]);

  /* ── Client-side filter ── */
  const filtered = blogs.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q || b.title?.toLowerCase().includes(q) || b.seoDescription?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q);
    const matchCat = activeCategory === 'all' || b.title?.toLowerCase().includes(activeCategory) || b.slug?.toLowerCase().includes(activeCategory) || b.content?.toLowerCase().includes(activeCategory);
    return matchSearch && matchCat;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const px = isMobile ? '16px' : '28px';
  const maxW = '1280px';

  return (
    <div className="blp-root" style={{ background: '#07101D', color: '#FFF', minHeight: '100vh' }}>

      {/* ── HERO HEADER ── */}
      <div style={{ background: 'linear-gradient(135deg, #0A1828 0%, #07101D 60%, #0D1E2F 100%)', borderBottom: '1px solid rgba(212,175,55,0.12)', paddingBottom: '0' }}>
        <div style={{ maxWidth: maxW, margin: '0 auto', padding: `14px ${px} 0` }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#718096', marginBottom: '28px', flexWrap: 'wrap' }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.color = '#D4AF37'}
              onMouseOut={e => e.currentTarget.style.color = '#718096'}
              onClick={onBack}
            >
              <Home size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />Home
            </span>
            <ChevronRight size={11} />
            <span style={{ color: '#D4AF37', fontWeight: 700 }}>Real Estate Blog</span>
          </div>

          {/* Hero text */}
          <div className="blp-animate-in" style={{ textAlign: 'center', paddingBottom: '48px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '100px', padding: '6px 18px', marginBottom: '20px' }}>
              <Sparkles size={13} color="#D4AF37" />
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#D4AF37', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Expert Real Estate Insights</span>
            </div>

            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '2rem' : '3rem', fontWeight: 700, color: '#FFF', margin: '0 0 16px', lineHeight: 1.15 }}>
              The <span style={{ background: 'linear-gradient(135deg, #D4AF37, #F3E5AB, #D4AF37)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'blp-shimmer 3s linear infinite' }}>24K Realtors</span> Blog
            </h1>
            <p style={{ fontSize: '1rem', color: '#A0AEC0', maxWidth: '560px', margin: '0 auto 28px', lineHeight: 1.7 }}>
              Expert guides on Hinjewadi investment, MahaRERA verification, home loans, NRI advisory, and Pune real estate market trends.
            </p>

            {/* Search */}
            <div style={{ maxWidth: '520px', margin: '0 auto', position: 'relative' }}>
              <Search size={16} color="#718096" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search articles, topics, builders..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(0); }}
                className="blp-search"
                style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: '50px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#FFF', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
            </div>

            {/* Category pills */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '20px', paddingBottom: '4px' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setPage(0); }}
                  className={`blp-cat${activeCategory === cat.id ? ' active' : ''}`}
                  style={{ padding: '7px 16px', borderRadius: '100px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#CBD5E0', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gold gradient divider */}
        <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #D4AF37 30%, #F3E5AB 50%, #D4AF37 70%, transparent)' }} />
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: maxW, margin: '0 auto', padding: `48px ${px} 80px` }}>

        {/* Results count */}
        {!loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ fontSize: '0.82rem', color: '#718096', margin: 0 }}>
              {search ? (
                <><span style={{ color: '#D4AF37', fontWeight: 700 }}>{filtered.length}</span> results for "<span style={{ color: '#FFF' }}>{search}</span>"</>
              ) : (
                <><span style={{ color: '#D4AF37', fontWeight: 700 }}>{filtered.length}</span> expert articles</>
              )}
            </p>
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#F3E5AB', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', padding: '4px 12px' }}>
                <Sparkles size={11} /> Showing curated sample articles
              </div>
            )}
          </div>
        )}

        {/* ── SKELETON ── */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '24px' }}>
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── FEATURED POST ── */}
        {!loading && featured && (
          <div className="blp-featured-card blp-animate-in"
            onClick={() => onSelectBlog && onSelectBlog(featured)}
            style={{ borderRadius: '22px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.2)', marginBottom: '48px', cursor: 'pointer', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.3fr 1fr', minHeight: isMobile ? 'auto' : '380px' }}
          >
            {/* Image */}
            <div style={{ position: 'relative', overflow: 'hidden', minHeight: isMobile ? '220px' : '380px' }}>
              <img
                src={featured.coverImageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=75'}
                alt={featured.title}
                className="blp-featured-img"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="eager"
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, rgba(7,16,29,0.95) 100%)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7,16,29,0.7) 0%, transparent 40%)' }} />
              {/* Featured badge */}
              <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'linear-gradient(135deg, #D4AF37, #C9A227)', borderRadius: '6px', padding: '4px 12px', fontSize: '0.65rem', fontWeight: 800, color: '#09111F', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                ⭐ Featured Article
              </div>
            </div>

            {/* Text */}
            <div style={{ background: 'rgba(10,18,32,0.98)', padding: isMobile ? '24px' : '36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={13} color="#D4AF37" />
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Latest Insight</span>
              </div>

              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.3rem' : '1.6rem', fontWeight: 700, color: '#FFF', margin: 0, lineHeight: 1.3 }}>
                {featured.title}
              </h2>

              <p style={{ fontSize: '0.84rem', color: '#A0AEC0', margin: 0, lineHeight: 1.7 }}>
                {(featured.seoDescription || featured.content || '').substring(0, 160)}…
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.72rem', color: '#718096', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><User size={11} /> {featured.author || '24K Realtors'}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={11} /> {formatDate(featured.createdDate)}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={11} /> {readTime(featured.content)} min read</span>
              </div>

              <button
                onClick={e => { e.stopPropagation(); onSelectBlog && onSelectBlog(featured); }}
                style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '7px', padding: '11px 24px', borderRadius: '50px', background: 'linear-gradient(135deg, #D4AF37, #C9A227)', color: '#09111F', border: 'none', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em' }}
              >
                Read Article <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ── BLOG GRID ── */}
        {!loading && rest.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' }}>
            {rest.map((blog, i) => (
              <div
                key={blog.id}
                className="blp-card blp-animate-in"
                onClick={() => onSelectBlog && onSelectBlog(blog)}
                style={{ animationDelay: `${i * 0.07}s`, borderRadius: '18px', overflow: 'hidden', background: 'rgba(13,24,42,0.9)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column' }}
              >
                {/* Cover */}
                <div style={{ position: 'relative', overflow: 'hidden', height: '200px', flexShrink: 0 }}>
                  <img
                    src={blog.coverImageUrl || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=75'}
                    alt={blog.title}
                    className="blp-card-img"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,24,42,0.7) 0%, transparent 50%)' }} />
                  {/* Read time badge */}
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(7,16,29,0.85)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '100px', padding: '3px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={9} color="#D4AF37" />
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#F3E5AB' }}>{readTime(blog.content)} min</span>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: '#718096' }}>
                    <User size={10} color="#D4AF37" />
                    <span style={{ color: '#D4AF37', fontWeight: 700 }}>{blog.author || '24K Realtors'}</span>
                    <span>·</span>
                    <Calendar size={10} />
                    <span>{formatDate(blog.createdDate)}</span>
                  </div>

                  <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '0.96rem', fontWeight: 700, color: '#FFF', margin: 0, lineHeight: 1.4 }}>
                    {blog.title}
                  </h3>

                  <p style={{ fontSize: '0.78rem', color: '#718096', margin: 0, lineHeight: 1.6, flex: 1 }}>
                    {(blog.seoDescription || blog.content || '').substring(0, 110)}…
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 'auto' }}>
                    <button
                      onClick={e => { e.stopPropagation(); onSelectBlog && onSelectBlog(blog); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', padding: 0 }}
                    >
                      Read More <ArrowRight size={13} />
                    </button>
                    {/* WhatsApp share */}
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`📖 ${blog.title}\n\n${blog.seoDescription || ''}\n\nRead on 24K Realtors: https://real-estate-digital-marketing.vercel.app/#blog/${blog.slug}`)}`}
                      target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      title="Share on WhatsApp"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)', color: '#25D366', textDecoration: 'none', transition: 'background 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(37,211,102,0.2)'}
                      onMouseOut={e => e.currentTarget.style.background = 'rgba(37,211,102,0.1)'}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <BookOpen size={48} color="rgba(212,175,55,0.3)" style={{ marginBottom: '16px' }} />
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', color: '#FFF', marginBottom: '8px' }}>No articles found</h3>
            <p style={{ color: '#718096', marginBottom: '20px' }}>Try a different search term or category.</p>
            <button onClick={() => { setSearch(''); setActiveCategory('all'); }}
              style={{ padding: '11px 28px', borderRadius: '50px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* ── PAGINATION ── */}
        {!loading && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
            <button
              disabled={page === 0}
              onClick={() => setPage(p => Math.max(0, p - 1))}
              className="blp-page-btn"
              style={{ padding: '9px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: page === 0 ? '#4A5568' : '#FFF', cursor: page === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700 }}
            >
              <ChevronLeft size={15} /> Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)}
                className={`blp-page-btn${page === i ? ' active' : ''}`}
                style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', cursor: 'pointer', fontSize: '0.84rem', fontWeight: 800 }}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              className="blp-page-btn"
              style={{ padding: '9px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: page >= totalPages - 1 ? '#4A5568' : '#FFF', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700 }}
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        )}

        {/* ── NEWSLETTER CTA ── */}
        <div style={{ marginTop: '64px', padding: isMobile ? '32px 24px' : '48px 56px', borderRadius: '22px', background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(13,24,42,0.95) 100%)', border: '1px solid rgba(212,175,55,0.25)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <BadgeCheck size={32} color="#D4AF37" style={{ marginBottom: '12px' }} />
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.4rem' : '1.8rem', fontWeight: 700, color: '#FFF', marginBottom: '10px' }}>
            Get Expert <span style={{ color: '#F3E5AB' }}>Property Advisory</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#A0AEC0', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Talk to our senior advisors for personalised property guidance, site visits, and verified investment recommendations.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/919673000053?text=${encodeURIComponent('Hi! I read your blog and would like expert property guidance for Hinjewadi Pune.')}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '13px 28px', borderRadius: '50px', background: 'linear-gradient(135deg, #D4AF37, #C9A227)', color: '#09111F', fontWeight: 800, fontSize: '0.86rem', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em' }}
            >
              📞 Talk to an Advisor
            </a>
            <button onClick={onBack}
              style={{ padding: '13px 28px', borderRadius: '50px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', fontSize: '0.86rem', fontWeight: 700, cursor: 'pointer' }}
            >
              View Properties →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
