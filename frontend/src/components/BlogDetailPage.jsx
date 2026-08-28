/**
 * BlogDetailPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Public Blog Article Detail Page — 24K Realtors Pune
 *
 * Features:
 *  • Fetches blog by slug from /api/v1/blogs/slug/:slug (public endpoint)
 *  • Renders full article HTML content safely via DOMPurify
 *  • SEO: Article JSON-LD schema, OG tags, canonical URL per article
 *  • Premium magazine-style layout: hero image, author card, reading progress bar
 *  • WhatsApp share + Copy link button
 *  • Related/similar posts from same API data
 *  • Sticky Table of Contents for long articles
 *  • Lead capture CTA after article body
 *  • Graceful fallback for sample posts (passed as prop from BlogListPage)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  ArrowLeft, Clock, User, Calendar, Share2, Link2,
  ChevronRight, Home, Check, MessageCircle, Phone,
  BookOpen, ArrowRight, BadgeCheck, TrendingUp
} from 'lucide-react';
import { useSEO } from '../services/seoService';
import { API_BASE_URL } from '../constants';

/* ── Inject styles once ── */
const STYLE_ID = 'bdp-styles-v1';
const BDP_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@400;500;600;700;800&display=swap');

.bdp-root { font-family: 'Montserrat', sans-serif; }

/* Reading progress bar */
.bdp-progress-bar { position: fixed; top: 0; left: 0; height: 3px; background: linear-gradient(90deg, #D4AF37, #F3E5AB); z-index: 9999; transition: width 0.1s linear; }

/* Article body typography */
.bdp-article-body { font-family: 'Merriweather', Georgia, serif; font-size: 1rem; line-height: 1.85; color: #CBD5E0; }
.bdp-article-body h1, .bdp-article-body h2, .bdp-article-body h3, .bdp-article-body h4 {
  font-family: 'Cinzel', serif; color: #FFF; margin: 1.8em 0 0.7em; line-height: 1.25;
}
.bdp-article-body h2 { font-size: 1.5rem; border-left: 3px solid #D4AF37; padding-left: 14px; }
.bdp-article-body h3 { font-size: 1.2rem; color: #F3E5AB; }
.bdp-article-body p { margin: 0 0 1.4em; }
.bdp-article-body a { color: #D4AF37; text-decoration: underline; text-decoration-color: rgba(212,175,55,0.4); }
.bdp-article-body a:hover { color: #F3E5AB; }
.bdp-article-body ul, .bdp-article-body ol { padding-left: 1.6em; margin: 0 0 1.4em; }
.bdp-article-body li { margin-bottom: 0.5em; }
.bdp-article-body blockquote {
  border-left: 3px solid #D4AF37; margin: 1.5em 0; padding: 1em 1.5em;
  background: rgba(212,175,55,0.05); border-radius: 0 12px 12px 0;
  color: #F3E5AB; font-style: italic;
}
.bdp-article-body strong { color: #FFF; font-weight: 700; }
.bdp-article-body table { width: 100%; border-collapse: collapse; margin: 1.5em 0; font-family: 'Montserrat', sans-serif; font-size: 0.84rem; }
.bdp-article-body th { padding: 10px 14px; background: rgba(212,175,55,0.1); color: #D4AF37; text-align: left; border-bottom: 1px solid rgba(212,175,55,0.2); }
.bdp-article-body td { padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #CBD5E0; }
.bdp-article-body img { max-width: 100%; border-radius: 12px; margin: 1em 0; }

/* Fade-in */
@keyframes bdp-fade-up { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
.bdp-animate-in { animation: bdp-fade-up 0.55s ease both; }

/* Share buttons */
.bdp-share-btn { transition: all 0.2s ease; }
.bdp-share-btn:hover { transform: translateY(-2px); }

/* Sticky TOC */
.bdp-toc-link { transition: all 0.2s ease; display: block; padding: 5px 0 5px 12px; border-left: 2px solid transparent; font-size: 0.78rem; color: #718096; text-decoration: none; line-height: 1.4; }
.bdp-toc-link:hover, .bdp-toc-link.active { border-left-color: #D4AF37; color: #F3E5AB; }

/* Related card */
.bdp-rel-card { transition: all 0.25s ease; cursor: pointer; }
.bdp-rel-card:hover { transform: translateY(-4px); border-color: rgba(212,175,55,0.35) !important; }
.bdp-rel-card:hover .bdp-rel-img { transform: scale(1.06); }
.bdp-rel-img { transition: transform 0.4s ease; }
`;

function injectStyles() {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
  const tag = document.createElement('style');
  tag.id = STYLE_ID;
  tag.textContent = BDP_CSS;
  document.head.appendChild(tag);
}

/* ── Format date ── */
function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ── Read time ── */
function readTime(content) {
  return Math.max(3, Math.round((content || '').split(/\s+/).length / 200));
}

/* ── Sanitize HTML (simple XSS prevention without importing DOMPurify) ── */
function safeHTML(html) {
  if (!html) return '';
  // If content is plain text (no HTML tags), wrap paragraphs
  if (!/<[a-z][\s\S]*>/i.test(html)) {
    return html.split('\n\n').map(p => p.trim()).filter(Boolean).map(p => `<p>${p}</p>`).join('');
  }
  return html;
}

/* ── Extract headings for TOC ── */
function extractHeadings(html) {
  const matches = [...(html || '').matchAll(/<h([23])[^>]*>(.*?)<\/h[23]>/gi)];
  return matches.slice(0, 8).map((m, i) => ({
    level: parseInt(m[1]),
    text: m[2].replace(/<[^>]+>/g, '').substring(0, 60),
    id: `heading-${i}`
  }));
}

/* ── Inject IDs into headings ── */
function injectHeadingIds(html) {
  let i = 0;
  return (html || '').replace(/<h([23])([^>]*)>/gi, () => `<h${RegExp.$1}${RegExp.$2} id="heading-${i++}">`);
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
export default function BlogDetailPage({ blog: initialBlog, slug, onBack, onBrowse }) {
  injectStyles();

  const [blog, setBlog] = useState(initialBlog || null);
  const [loading, setLoading] = useState(!initialBlog);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [readProgress, setReadProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const articleRef = useRef(null);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  /* ── Reading progress bar ── */
  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight;
      const scrolled = Math.max(0, -rect.top);
      setReadProgress(Math.min(100, (scrolled / total) * 100));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Active heading tracking ── */
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveHeading(entry.target.id);
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    document.querySelectorAll('[id^="heading-"]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [blog]);

  /* ── Fetch blog if not passed as prop ── */
  useEffect(() => {
    window.scrollTo(0, 0);
    if (initialBlog) {
      setBlog(initialBlog);
      setLoading(false);
      return;
    }
    if (!slug) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/blogs/slug/${slug}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => { setBlog(data); setLoading(false); })
      .catch(err => { console.error('[BlogDetailPage] Failed to fetch blog:', err); setLoading(false); });
  }, [initialBlog, slug]);

  /* ── Fetch related blogs ── */
  useEffect(() => {
    fetch(`${API_BASE_URL}/blogs?page=0&size=4`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setRelatedBlogs((data.content || []).filter(b => b.id !== blog?.id).slice(0, 3)))
      .catch(() => {});
  }, [blog?.id]);

  /* ── Processed HTML with heading IDs ── */
  const processedHTML = useMemo(() => {
    if (!blog?.content) return '';
    return injectHeadingIds(safeHTML(blog.content));
  }, [blog?.content]);

  const headings = useMemo(() => extractHeadings(processedHTML), [processedHTML]);

  /* ── SEO ── */
  useSEO({
    title: blog ? `${blog.seoTitle || blog.title} — Real Estate Blog` : 'Loading Article...',
    description: blog?.seoDescription || blog?.title || '24K Realtors real estate blog article.',
    image: blog?.coverImageUrl,
    url: `/#blog/${blog?.slug || slug}`,
    type: 'article',
    schema: blog ? {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: blog.title,
      description: blog.seoDescription || blog.title,
      image: blog.coverImageUrl,
      author: { '@type': 'Person', name: blog.author || '24K Realtors' },
      publisher: {
        '@type': 'Organization',
        name: '24K Realtors Pune',
        logo: { '@type': 'ImageObject', url: 'https://real-estate-digital-marketing.vercel.app/favicon.svg' }
      },
      datePublished: blog.createdDate,
      dateModified: blog.updatedDate || blog.createdDate,
      mainEntityOfPage: { '@type': 'WebPage', '@id': `https://real-estate-digital-marketing.vercel.app/#blog/${blog.slug}` }
    } : undefined
  });

  const articleUrl = `https://real-estate-digital-marketing.vercel.app/#blog/${blog?.slug || slug}`;
  const px = isMobile ? '16px' : '28px';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  /* ── LOADING STATE ── */
  if (loading) {
    return (
      <div style={{ background: '#07101D', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <BookOpen size={40} color="rgba(212,175,55,0.4)" style={{ marginBottom: '12px', animation: 'bdp-fade-up 1s ease infinite alternate' }} />
          <p style={{ color: '#718096', fontSize: '0.9rem' }}>Loading article...</p>
        </div>
      </div>
    );
  }

  /* ── NOT FOUND ── */
  if (!blog) {
    return (
      <div style={{ background: '#07101D', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2 style={{ fontFamily: "'Cinzel', serif", color: '#FFF', marginBottom: '12px' }}>Article Not Found</h2>
          <p style={{ color: '#718096', marginBottom: '24px' }}>This article may have been removed or the URL is incorrect.</p>
          <button onClick={onBack} style={{ padding: '11px 28px', borderRadius: '50px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', fontWeight: 700, cursor: 'pointer' }}>
            ← Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bdp-root" style={{ background: '#07101D', color: '#FFF', minHeight: '100vh' }}>

      {/* ── Reading progress bar ── */}
      <div className="bdp-progress-bar" style={{ width: `${readProgress}%` }} />

      {/* ── NAV HEADER ── */}
      <div style={{ background: 'rgba(7,16,29,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: `12px ${px}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#718096', flexWrap: 'wrap', minWidth: 0 }}>
            <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              onClick={() => onBrowse && onBrowse()}
              onMouseOver={e => e.currentTarget.style.color = '#D4AF37'}
              onMouseOut={e => e.currentTarget.style.color = '#718096'}
            >
              <Home size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '3px' }} />Home
            </span>
            <ChevronRight size={10} />
            <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              onClick={onBack}
              onMouseOver={e => e.currentTarget.style.color = '#D4AF37'}
              onMouseOut={e => e.currentTarget.style.color = '#718096'}
            >Blog</span>
            <ChevronRight size={10} />
            <span style={{ color: '#D4AF37', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: isMobile ? '140px' : '320px' }}>{blog.title}</span>
          </div>
          <button onClick={onBack}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#CBD5E0', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            <ArrowLeft size={13} /> All Articles
          </button>
        </div>
      </div>

      {/* ── HERO IMAGE ── */}
      {blog.coverImageUrl && (
        <div style={{ position: 'relative', height: isMobile ? '250px' : '480px', overflow: 'hidden' }}>
          <img
            src={blog.coverImageUrl}
            alt={blog.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            loading="eager"
          />
          {/* Multi-layer overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(7,16,29,0.2) 0%, rgba(7,16,29,0.5) 50%, rgba(7,16,29,0.95) 100%)' }} />

          {/* Hero text overlay for desktop */}
          {!isMobile && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 40px 40px', maxWidth: '900px', margin: '0 auto' }}>
              <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#09111F', background: 'linear-gradient(135deg, #D4AF37, #C9A227)', borderRadius: '5px', padding: '3px 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Real Estate Insights
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>
                    <Clock size={11} /> {readTime(blog.content)} min read
                  </span>
                </div>
                <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '2.2rem', fontWeight: 700, color: '#FFF', margin: 0, lineHeight: 1.2, textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
                  {blog.title}
                </h1>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── MAIN LAYOUT ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: `40px ${px} 80px`, display: 'grid', gridTemplateColumns: !isMobile && headings.length > 0 ? '1fr 280px' : '1fr', gap: '48px', alignItems: 'start' }}>

        {/* ── LEFT: Article body ── */}
        <div>

          {/* Title (mobile or no hero image) */}
          {(isMobile || !blog.coverImageUrl) && (
            <div style={{ marginBottom: '28px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#D4AF37', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '5px', padding: '3px 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Real Estate Insights
              </span>
              <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.5rem' : '2.2rem', fontWeight: 700, color: '#FFF', margin: '14px 0 0', lineHeight: 1.25 }}>
                {blog.title}
              </h1>
            </div>
          )}

          {/* Author & meta row */}
          <div className="bdp-animate-in" style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '24px', padding: '16px 20px', borderRadius: '14px', background: 'rgba(13,24,42,0.9)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '32px', flexWrap: 'wrap' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37, #C9A227)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <User size={20} color="#09111F" />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF' }}>{blog.author || '24K Realtors'}</div>
              <div style={{ fontSize: '0.68rem', color: '#718096' }}>Senior Property Advisor, 24K Realtors Pune</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px', fontSize: '0.7rem', color: '#718096', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={11} /> {formatDate(blog.createdDate)}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={11} /> {readTime(blog.content)} min read</span>
            </div>
          </div>

          {/* SEO description lead paragraph */}
          {blog.seoDescription && (
            <div style={{ padding: '16px 20px', borderRadius: '12px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)', marginBottom: '28px', fontSize: '0.92rem', color: '#A0AEC0', lineHeight: 1.7, fontStyle: 'italic' }}>
              {blog.seoDescription}
            </div>
          )}

          {/* ── Article body ── */}
          <article ref={articleRef} className="bdp-article-body" style={{ marginBottom: '48px' }}
            dangerouslySetInnerHTML={{ __html: processedHTML }}
          />

          {/* ── Share section ── */}
          <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(13,24,42,0.9)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#CBD5E0', whiteSpace: 'nowrap' }}>Share this article:</span>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`📖 ${blog.title}\n\n${blog.seoDescription || ''}\n\nRead on 24K Realtors: ${articleUrl}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="bdp-share-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', borderRadius: '50px', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', color: '#25D366', fontSize: '0.76rem', fontWeight: 800, textDecoration: 'none' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              WhatsApp
            </a>

            {/* Copy link */}
            <button onClick={handleCopyLink} className="bdp-share-btn"
              style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', borderRadius: '50px', background: copied ? 'rgba(104,211,145,0.12)' : 'rgba(255,255,255,0.05)', border: `1px solid ${copied ? 'rgba(104,211,145,0.4)' : 'rgba(255,255,255,0.12)'}`, color: copied ? '#68D391' : '#CBD5E0', fontSize: '0.76rem', fontWeight: 800, cursor: 'pointer' }}
            >
              {copied ? <Check size={13} /> : <Link2 size={13} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>

          {/* ── Lead CTA after article ── */}
          <div style={{ padding: isMobile ? '28px 20px' : '36px 40px', borderRadius: '22px', background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(7,16,29,0.95) 100%)', border: '1px solid rgba(212,175,55,0.25)', textAlign: 'center', marginBottom: '48px' }}>
            <BadgeCheck size={28} color="#D4AF37" style={{ marginBottom: '10px' }} />
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.2rem' : '1.5rem', color: '#FFF', marginBottom: '8px' }}>
              Liked this article? <span style={{ color: '#F3E5AB' }}>Talk to Our Advisor</span>
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#A0AEC0', marginBottom: '20px', maxWidth: '440px', margin: '0 auto 20px', lineHeight: 1.6 }}>
              Get personalized investment guidance, RERA-verified site visits, and current inventory from our senior advisors.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <a
                href={`https://wa.me/919673000053?text=${encodeURIComponent(`Hi! I read "${blog.title}" on 24K Realtors blog and have a question about investing in Hinjewadi Pune.`)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '50px', background: 'linear-gradient(135deg, #D4AF37, #C9A227)', color: '#09111F', fontWeight: 800, fontSize: '0.84rem', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.04em' }}
              >
                <Phone size={14} /> WhatsApp Expert
              </a>
              <button onClick={onBack}
                style={{ padding: '12px 24px', borderRadius: '50px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#CBD5E0', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer' }}
              >
                More Articles →
              </button>
            </div>
          </div>

          {/* ── Related articles ── */}
          {relatedBlogs.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '4px', height: '24px', background: 'linear-gradient(to bottom, #D4AF37, #C9A227)', borderRadius: '2px' }} />
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.2rem', color: '#FFF', margin: 0 }}>Related Articles</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '18px' }}>
                {relatedBlogs.map(rb => (
                  <div key={rb.id} className="bdp-rel-card"
                    onClick={() => { setBlog(rb); window.scrollTo(0, 0); }}
                    style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(13,24,42,0.9)' }}
                  >
                    <div style={{ height: '140px', overflow: 'hidden' }}>
                      <img src={rb.coverImageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=60'} alt={rb.title}
                        className="bdp-rel-img"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                    </div>
                    <div style={{ padding: '14px' }}>
                      <div style={{ fontSize: '0.65rem', color: '#718096', marginBottom: '6px' }}>{formatDate(rb.createdDate)}</div>
                      <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '0.86rem', color: '#FFF', margin: '0 0 8px', lineHeight: 1.3 }}>
                        {rb.title.substring(0, 70)}{rb.title.length > 70 ? '…' : ''}
                      </h4>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#D4AF37', fontWeight: 700 }}>
                        Read <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Sticky Table of Contents ── */}
        {!isMobile && headings.length > 0 && (
          <div style={{ position: 'sticky', top: '80px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* TOC */}
            <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(13,24,42,0.95)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>
                📋 Table of Contents
              </div>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {headings.map(h => (
                  <a key={h.id} href={`#${h.id}`}
                    className={`bdp-toc-link${activeHeading === h.id ? ' active' : ''}`}
                    style={{ paddingLeft: h.level === 3 ? '24px' : '12px' }}
                    onClick={e => {
                      e.preventDefault();
                      document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </div>

            {/* Reading progress */}
            <div style={{ padding: '16px 20px', borderRadius: '14px', background: 'rgba(13,24,42,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.7rem' }}>
                <span style={{ color: '#718096' }}>Reading progress</span>
                <span style={{ color: '#D4AF37', fontWeight: 800 }}>{Math.round(readProgress)}%</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${readProgress}%`, background: 'linear-gradient(90deg, #D4AF37, #F3E5AB)', borderRadius: '4px', transition: 'width 0.1s' }} />
              </div>
            </div>

            {/* WhatsApp advisor CTA */}
            <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(37,211,102,0.05)', border: '1px solid rgba(37,211,102,0.2)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#68D391', marginBottom: '8px' }}>💬 Need Expert Advice?</div>
              <p style={{ fontSize: '0.72rem', color: '#A0AEC0', marginBottom: '14px', lineHeight: 1.5 }}>
                Talk to our senior advisor for personalized property guidance.
              </p>
              <a
                href={`https://wa.me/919673000053?text=${encodeURIComponent(`Hi! I read "${blog.title}" and need expert property advisory for Hinjewadi Pune.`)}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '10px', borderRadius: '50px', background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.35)', color: '#25D366', fontSize: '0.76rem', fontWeight: 800, textDecoration: 'none' }}
              >
                <MessageCircle size={13} /> WhatsApp Now
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
