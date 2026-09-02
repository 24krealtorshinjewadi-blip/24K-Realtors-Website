import React, { useState } from 'react';

// ══════════════════════════════════════════════════════════════════════
// ✦ AUTHENTIC VECTOR LOGOS FOR ALL 12 TOP DEVELOPERS
// Zero external image dependency · 100% crisp vector graphics
// ══════════════════════════════════════════════════════════════════════

export const DEVELOPERS_DATA = [
  {
    id: 'lodha',
    name: 'Lodha Group',
    shortName: 'Lodha',
    tagline: 'Building a Better Life',
    color: '#D4AF37',
    gradient: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)',
    established: 'Est. 1980',
    projectsCount: '5 Projects',
    corridors: ['HINJEWADI', 'TATHAWADE'],
    corridorLabel: '📍 Tathawade & Hinjewadi Link',
    searchQuery: 'Lodha',
    badge: 'LUXURY ICON',
    logo: (
      <svg viewBox="0 0 220 70" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lodhaGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF4D0" />
            <stop offset="50%" stopColor="#E6C35C" />
            <stop offset="100%" stopColor="#B38B1E" />
          </linearGradient>
        </defs>
        {/* Crown Spires Crest */}
        <g transform="translate(10, 10)">
          <path d="M12 40 L12 20 L20 28 L28 10 L36 28 L44 20 L44 40 Z" fill="url(#lodhaGold)" />
          <circle cx="28" cy="6" r="3" fill="url(#lodhaGold)" />
          <circle cx="12" cy="16" r="2.5" fill="url(#lodhaGold)" />
          <circle cx="44" cy="16" r="2.5" fill="url(#lodhaGold)" />
          <rect x="10" y="42" width="36" height="3" rx="1.5" fill="url(#lodhaGold)" />
        </g>
        {/* Typography */}
        <text x="66" y="36" fontFamily="'Cinzel', 'Georgia', serif" fontSize="26" fontWeight="900" fill="url(#lodhaGold)" letterSpacing="0.2em">
          LODHA
        </text>
        <text x="67" y="49" fontFamily="'Montserrat', sans-serif" fontSize="6.5" fontWeight="700" fill="rgba(255,255,255,0.6)" letterSpacing="0.32em">
          BUILDING A BETTER LIFE
        </text>
      </svg>
    )
  },
  {
    id: 'godrej',
    name: 'Godrej Properties',
    shortName: 'Godrej',
    tagline: 'Since 1897 · Legacy of Trust',
    color: '#38BDF8',
    gradient: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
    established: 'Est. 1897',
    projectsCount: '6 Projects',
    corridors: ['HINJEWADI', 'BANER', 'MAHALUNGE'],
    corridorLabel: '📍 Hinjewadi Ph 1 & 2',
    searchQuery: 'Godrej',
    badge: '127 YRS LEGACY',
    logo: (
      <svg viewBox="0 0 220 70" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="godrejRed" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
        </defs>
        {/* Signature script-like Godrej logo mark */}
        <g transform="translate(10, 15)">
          <path d="M12 28 C10 16, 22 10, 32 18 C40 24, 38 34, 28 36 C18 38, 12 30, 20 22" stroke="url(#godrejRed)" strokeWidth="4" strokeLinecap="round" />
          <circle cx="34" cy="20" r="3" fill="#E11D48" />
        </g>
        <text x="56" y="34" fontFamily="'Playfair Display', 'Georgia', serif" fontStyle="italic" fontSize="27" fontWeight="800" fill="#FFFFFF" letterSpacing="0.04em">
          Godrej
        </text>
        <text x="58" y="48" fontFamily="'Montserrat', sans-serif" fontSize="8" fontWeight="800" fill="#38BDF8" letterSpacing="0.35em">
          PROPERTIES
        </text>
      </svg>
    )
  },
  {
    id: 'vtp-realty',
    name: 'VTP Realty',
    shortName: 'VTP',
    tagline: "Pune's #1 Real Estate Brand",
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #FDE68A 0%, #F59E0B 100%)',
    established: 'Est. 2011',
    projectsCount: '8 Projects',
    corridors: ['MAHALUNGE', 'WAKAD', 'HINJEWADI'],
    corridorLabel: '📍 Mahalunge & Wakad',
    searchQuery: 'VTP',
    badge: '#1 BESTSELLER',
    logo: (
      <svg viewBox="0 0 220 70" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="vtpAmber" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
        {/* Triangular Faceted 3D Monogram */}
        <g transform="translate(12, 14)">
          <polygon points="20,4 36,36 4,36" fill="url(#vtpAmber)" />
          <polygon points="20,4 36,36 20,36" fill="#B45309" opacity="0.6" />
          <polygon points="20,16 28,32 12,32" fill="#040814" />
        </g>
        <text x="58" y="36" fontFamily="'Montserrat', sans-serif" fontSize="25" fontWeight="900" fill="#FFFFFF" letterSpacing="0.08em">
          VTP <tspan fill="url(#vtpAmber)">REALTY</tspan>
        </text>
        <text x="60" y="49" fontFamily="'Montserrat', sans-serif" fontSize="6.5" fontWeight="700" fill="rgba(255,255,255,0.6)" letterSpacing="0.25em">
          THOUGHTFULNESS INSIDE
        </text>
      </svg>
    )
  },
  {
    id: 'joyville',
    name: 'Joyville (Shapoorji Pallonji)',
    shortName: 'Joyville',
    tagline: 'By 160-Year Shapoorji Pallonji',
    color: '#60A5FA',
    gradient: 'linear-gradient(135deg, #93C5FD 0%, #3B82F6 100%)',
    established: 'Est. 1865',
    projectsCount: '4 Projects',
    corridors: ['HINJEWADI'],
    corridorLabel: '📍 Hinjewadi Phase 1',
    searchQuery: 'Joyville',
    badge: '160 YRS TRUST',
    logo: (
      <svg viewBox="0 0 220 70" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="joyBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        {/* SP Heritage Wreath + Butterfly */}
        <g transform="translate(10, 14)">
          <circle cx="20" cy="20" r="16" stroke="url(#joyBlue)" strokeWidth="2.5" fill="none" strokeDasharray="4 2" />
          <path d="M12 20 Q20 10 28 20 Q20 30 12 20 Z" fill="url(#joyBlue)" />
          <circle cx="20" cy="20" r="4" fill="#FFFFFF" />
        </g>
        <text x="56" y="34" fontFamily="'Montserrat', sans-serif" fontSize="23" fontWeight="900" fill="#FFFFFF" letterSpacing="0.02em">
          Joyville
        </text>
        <text x="58" y="48" fontFamily="'Montserrat', sans-serif" fontSize="6.5" fontWeight="700" fill="#93C5FD" letterSpacing="0.2em">
          BY SHAPOORJI PALLONJI
        </text>
      </svg>
    )
  },
  {
    id: 'kohinoor',
    name: 'Kohinoor Group',
    shortName: 'Kohinoor',
    tagline: 'A Sada Sukhi Feature · Est. 1983',
    color: '#22D3EE',
    gradient: 'linear-gradient(135deg, #67E8F9 0%, #06B6D4 100%)',
    established: 'Est. 1983',
    projectsCount: '7 Projects',
    corridors: ['HINJEWADI', 'WAKAD', 'TATHAWADE'],
    corridorLabel: '📍 Hinjewadi & Wakad',
    searchQuery: 'Kohinoor',
    badge: 'SADA SUKHI',
    logo: (
      <svg viewBox="0 0 220 70" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="kohiCyan" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A5F3FC" />
            <stop offset="100%" stopColor="#0891B2" />
          </linearGradient>
        </defs>
        {/* Faceted Brilliant Diamond Emblem */}
        <g transform="translate(10, 14)">
          <polygon points="10,12 30,12 38,24 20,38 2,24" fill="url(#kohiCyan)" />
          <polygon points="10,12 20,38 30,12" fill="#FFFFFF" opacity="0.3" />
          <polygon points="2,24 20,38 38,24" fill="#0891B2" opacity="0.5" />
          <line x1="2" y1="24" x2="38" y2="24" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.6" />
        </g>
        <text x="56" y="35" fontFamily="'Cinzel', serif" fontSize="23" fontWeight="900" fill="#FFFFFF" letterSpacing="0.14em">
          KOHINOOR
        </text>
        <text x="58" y="48" fontFamily="'Montserrat', sans-serif" fontSize="6.5" fontWeight="700" fill="#67E8F9" letterSpacing="0.22em">
          A SADA SUKHI FEATURE
        </text>
      </svg>
    )
  },
  {
    id: 'pride-purple',
    name: 'Pride Purple Group',
    shortName: 'Pride Purple',
    tagline: 'Park District · Signature Luxury',
    color: '#C084FC',
    gradient: 'linear-gradient(135deg, #E9D5FF 0%, #A855F7 100%)',
    established: 'Est. 2004',
    projectsCount: '5 Projects',
    corridors: ['HINJEWADI', 'WAKAD', 'BANER'],
    corridorLabel: '📍 Hinjewadi Ph 1 & Wakad',
    searchQuery: 'Pride',
    badge: 'PARK DISTRICT',
    logo: (
      <svg viewBox="0 0 220 70" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="purpleGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F3E8FF" />
            <stop offset="50%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#7E22CE" />
          </linearGradient>
        </defs>
        {/* Royal Crown & P Monogram */}
        <g transform="translate(10, 14)">
          <path d="M8 36 L8 12 L22 12 C28 12, 32 16, 32 22 C32 28, 28 32, 22 32 L16 32 L16 36 Z" fill="url(#purpleGlow)" />
          <circle cx="22" cy="22" r="4" fill="#040814" />
          <polygon points="4,10 8,14 12,10 16,14 20,10" fill="#F5D77F" />
        </g>
        <text x="54" y="32" fontFamily="'Montserrat', sans-serif" fontSize="20" fontWeight="900" fill="#FFFFFF" letterSpacing="0.08em">
          PRIDE <tspan fill="url(#purpleGlow)">PURPLE</tspan>
        </text>
        <text x="56" y="47" fontFamily="'Montserrat', sans-serif" fontSize="6.5" fontWeight="700" fill="#D8B4FE" letterSpacing="0.3em">
          PARK DISTRICT HOMES
        </text>
      </svg>
    )
  },
  {
    id: 'paranjape',
    name: 'Paranjape Schemes',
    shortName: 'Paranjape',
    tagline: 'The Spirit of New India · Blue Ridge',
    color: '#34D399',
    gradient: 'linear-gradient(135deg, #A7F3D0 0%, #10B981 100%)',
    established: 'Est. 1987',
    projectsCount: '5 Projects',
    corridors: ['HINJEWADI', 'WAKAD'],
    corridorLabel: '📍 Hinjewadi Phase 1',
    searchQuery: 'Paranjape',
    badge: '138-ACRE TOWNSHIP',
    logo: (
      <svg viewBox="0 0 220 70" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="emeraldGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        {/* Modern Wave 'P' Ribbon Emblem */}
        <g transform="translate(10, 14)">
          <circle cx="20" cy="20" r="17" stroke="url(#emeraldGlow)" strokeWidth="2.5" fill="none" />
          <path d="M14 30 L14 12 L22 12 Q28 12 28 18 Q28 24 22 24 L14 24" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
        <text x="56" y="34" fontFamily="'Montserrat', sans-serif" fontSize="21" fontWeight="900" fill="#FFFFFF" letterSpacing="0.08em">
          PARANJAPE
        </text>
        <text x="58" y="48" fontFamily="'Montserrat', sans-serif" fontSize="6.5" fontWeight="700" fill="#6EE7B7" letterSpacing="0.22em">
          BLUE RIDGE TOWNSHIP
        </text>
      </svg>
    )
  },
  {
    id: 'kolte-patil',
    name: 'Kolte-Patil Developers',
    shortName: 'Kolte-Patil',
    tagline: 'Creation, not construction · 24K Flagship',
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, #FCA5A5 0%, #EF4444 100%)',
    established: 'Est. 1991',
    projectsCount: '6 Projects',
    corridors: ['HINJEWADI', 'BANER', 'WAKAD'],
    corridorLabel: '📍 Hinjewadi Ph 1 & Baner',
    searchQuery: 'Kolte',
    badge: '24K FLAGSHIP',
    logo: (
      <svg viewBox="0 0 220 70" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="kolteRed" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
        </defs>
        {/* Architectural Gate & Arch Ribbon */}
        <g transform="translate(10, 14)">
          <rect x="6" y="8" width="8" height="28" rx="2" fill="url(#kolteRed)" />
          <rect x="24" y="8" width="8" height="28" rx="2" fill="url(#kolteRed)" />
          <path d="M6 14 C6 6, 32 6, 32 14" stroke="#FFFFFF" strokeWidth="3" fill="none" />
        </g>
        <text x="56" y="34" fontFamily="'Montserrat', sans-serif" fontSize="21" fontWeight="900" fill="#FFFFFF" letterSpacing="0.06em">
          KOLTE<tspan fill="url(#kolteRed)">-PATIL</tspan>
        </text>
        <text x="58" y="48" fontFamily="'Montserrat', sans-serif" fontSize="6.5" fontWeight="700" fill="rgba(255,255,255,0.6)" letterSpacing="0.22em">
          CREATION, NOT CONSTRUCTION
        </text>
      </svg>
    )
  },
  {
    id: 'gera',
    name: 'Gera Developments',
    shortName: 'Gera',
    tagline: 'Outdo · ChildCentric® Homes',
    color: '#FB923C',
    gradient: 'linear-gradient(135deg, #FDBA74 0%, #EA580C 100%)',
    established: 'Est. 1970',
    projectsCount: '5 Projects',
    corridors: ['HINJEWADI', 'WAKAD'],
    corridorLabel: '📍 Hinjewadi Phase 1 & Wakad',
    searchQuery: 'Gera',
    badge: 'CHILD CENTRIC',
    logo: (
      <svg viewBox="0 0 220 70" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="geraOrange" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>
        {/* Five Star Shield / Compass Mark */}
        <g transform="translate(10, 14)">
          <path d="M20 4 L34 10 L34 24 Q20 38 20 38 Q6 24 6 24 L6 10 Z" fill="url(#geraOrange)" />
          <polygon points="20,12 23,19 30,19 25,23 27,30 20,26 13,30 15,23 10,19 17,19" fill="#FFFFFF" />
        </g>
        <text x="56" y="35" fontFamily="'Montserrat', sans-serif" fontSize="24" fontWeight="900" fill="#FFFFFF" letterSpacing="0.14em">
          GERA
        </text>
        <text x="58" y="49" fontFamily="'Montserrat', sans-serif" fontSize="7" fontWeight="800" fill="#FB923C" letterSpacing="0.32em">
          OUTDO · 54 YRS PUNE
        </text>
      </svg>
    )
  },
  {
    id: 'kasturi',
    name: 'Kasturi Housing',
    shortName: 'Kasturi',
    tagline: "Pune's Finest Residences · Crafted with Passion",
    color: '#E2E8F0',
    gradient: 'linear-gradient(135deg, #FFFFFF 0%, #94A3B8 100%)',
    established: 'Est. 1999',
    projectsCount: '3 Projects',
    corridors: ['WAKAD', 'BANER'],
    corridorLabel: '📍 Wakad & Balewadi',
    searchQuery: 'Kasturi',
    badge: 'FINEST HOMES',
    logo: (
      <svg viewBox="0 0 220 70" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Minimalist Ultra-Luxury Serif K Monogram */}
        <g transform="translate(10, 14)">
          <circle cx="20" cy="20" r="16" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
          <text x="13" y="27" fontFamily="'Cinzel', serif" fontSize="22" fontWeight="900" fill="#FFFFFF">K</text>
        </g>
        <text x="56" y="35" fontFamily="'Cinzel', serif" fontSize="23" fontWeight="700" fill="#FFFFFF" letterSpacing="0.22em">
          KASTURI
        </text>
        <text x="58" y="48" fontFamily="'Montserrat', sans-serif" fontSize="6" fontWeight="700" fill="rgba(255,255,255,0.6)" letterSpacing="0.28em">
          THE ART OF EXCELLENCE
        </text>
      </svg>
    )
  },
  {
    id: 'mahindra',
    name: 'Mahindra Lifespaces',
    shortName: 'Mahindra',
    tagline: 'Joyful Homecomings · Net-Zero Pioneers',
    color: '#4ADE80',
    gradient: 'linear-gradient(135deg, #BBF7D0 0%, #22C55E 100%)',
    established: 'Est. 1994',
    projectsCount: '4 Projects',
    corridors: ['HINJEWADI', 'TATHAWADE'],
    corridorLabel: '📍 Hinjewadi Phase 1',
    searchQuery: 'Mahindra',
    badge: 'NET ZERO GREEN',
    logo: (
      <svg viewBox="0 0 220 70" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mahRed" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
        </defs>
        {/* Iconic Dynamic 'M' with Green Leaf */}
        <g transform="translate(10, 14)">
          <path d="M4 36 L12 12 L20 26 L28 12 L36 36" stroke="url(#mahRed)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="36" cy="12" r="3.5" fill="#22C55E" />
        </g>
        <text x="56" y="33" fontFamily="'Montserrat', sans-serif" fontSize="19" fontWeight="900" fill="#FFFFFF" letterSpacing="0.04em">
          Mahindra
        </text>
        <text x="58" y="47" fontFamily="'Montserrat', sans-serif" fontSize="7" fontWeight="800" fill="#4ADE80" letterSpacing="0.28em">
          LIFESPACES
        </text>
      </svg>
    )
  },
  {
    id: 'raheja',
    name: 'K. Raheja Corp',
    shortName: 'K. Raheja',
    tagline: 'Mindspace & Viva · Grade-A Infrastructure',
    color: '#38BDF8',
    gradient: 'linear-gradient(135deg, #BAE6FD 0%, #0284C7 100%)',
    established: 'Est. 1956',
    projectsCount: '6 Projects',
    corridors: ['HINJEWADI', 'BANER'],
    corridorLabel: '📍 Hinjewadi IT Park & Baner',
    searchQuery: 'Raheja',
    badge: 'GRADE-A ASSETS',
    logo: (
      <svg viewBox="0 0 220 70" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="rahejaBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
        </defs>
        {/* Skyscraper Triple Pillars */}
        <g transform="translate(10, 14)">
          <rect x="6" y="16" width="6" height="20" rx="1" fill="url(#rahejaBlue)" />
          <rect x="16" y="6" width="6" height="30" rx="1" fill="#FFFFFF" />
          <rect x="26" y="12" width="6" height="24" rx="1" fill="url(#rahejaBlue)" />
        </g>
        <text x="54" y="34" fontFamily="'Cinzel', serif" fontSize="20" fontWeight="900" fill="#FFFFFF" letterSpacing="0.1em">
          K. RAHEJA
        </text>
        <text x="56" y="47" fontFamily="'Montserrat', sans-serif" fontSize="7" fontWeight="800" fill="#38BDF8" letterSpacing="0.32em">
          CORP · MINDSPACE
        </text>
      </svg>
    )
  }
];

export default function DeveloperLogoMarquee({ onSelectDeveloper, isMobile = false }) {
  const [activeTab, setActiveTab] = useState('ALL');
  const [hoveredDev, setHoveredDev] = useState(null);

  const filteredDevelopers = activeTab === 'ALL'
    ? DEVELOPERS_DATA
    : DEVELOPERS_DATA.filter(d => d.corridors.includes(activeTab));

  // Duplicate data array for seamless 100% infinite marquee loop
  const marqueeList = [...DEVELOPERS_DATA, ...DEVELOPERS_DATA];

  const handleDeveloperClick = (searchQuery) => {
    if (typeof onSelectDeveloper === 'function') {
      onSelectDeveloper(searchQuery);
    }
    const anchor = document.getElementById('listings-anchor');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section 
      id="authorized-developers"
      style={{
        background: 'linear-gradient(180deg, #040814 0%, #071022 45%, #040814 100%)',
        padding: isMobile ? '40px 0 54px' : '64px 0 84px',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(212,175,55,0.18)',
        borderBottom: '1px solid rgba(212,175,55,0.18)'
      }}
    >
      {/* Subtle Background Glow Spheres */}
      <div style={{
        position: 'absolute', top: '20%', left: '10%', width: '380px', height: '380px',
        background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(50px)'
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '10%', width: '420px', height: '420px',
        background: 'radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(60px)'
      }} />

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '0 16px' : '0 32px' }}>
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '28px' : '36px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: '50px', padding: '6px 18px', marginBottom: '14px'
          }}>
            <span style={{ fontSize: '14px' }}>🛡️</span>
            <span style={{
              color: '#F5D77F', fontSize: '0.72rem', fontWeight: 800,
              letterSpacing: '0.14em', textTransform: 'uppercase'
            }}>
              OFFICIAL RERA AUTHORIZED PARTNERS
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: isMobile ? '1.75rem' : '2.6rem',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 0 12px',
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            Trusted <span style={{
              background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 25px rgba(212,175,55,0.3)'
            }}>Brands & Partners</span>
          </h2>

          <p style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: isMobile ? '0.86rem' : '0.96rem',
            maxWidth: '680px',
            margin: '0 auto 20px',
            lineHeight: 1.6
          }}>
            Direct developer tie-ups with Pune West’s 12 landmark builders. Zero brokerage, transparent allotment rates, and 100% MahaRERA litigation-free title clearance.
          </p>

          {/* Quick Filter Tabs */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: isMobile ? '6px' : '10px',
            flexWrap: 'wrap', marginTop: '16px'
          }}>
            {[
              { id: 'ALL', label: '🔥 All 12 Developers' },
              { id: 'HINJEWADI', label: '💻 Hinjewadi IT Corridor (8)' },
              { id: 'WAKAD', label: '🛣️ Wakad Hub (6)' },
              { id: 'MAHALUNGE', label: '🌆 Mahalunge Smart City (2)' },
              { id: 'BANER', label: '🏙️ Baner & Balewadi (4)' },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)'
                      : 'rgba(22, 34, 54, 0.6)',
                    border: isActive
                      ? 'none'
                      : '1px solid rgba(255,255,255,0.12)',
                    color: isActive ? '#040814' : 'rgba(255,255,255,0.75)',
                    padding: isMobile ? '7px 14px' : '9px 20px',
                    borderRadius: '50px',
                    fontSize: isMobile ? '0.74rem' : '0.82rem',
                    fontWeight: isActive ? 800 : 600,
                    cursor: 'pointer',
                    fontFamily: "'Montserrat', sans-serif",
                    transition: 'all 0.25s ease',
                    boxShadow: isActive ? '0 6px 20px rgba(212,175,55,0.35)' : 'none'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════════
          ✦ CONTINUOUS MOVING LOGO MARQUEE (TRACK 1 - SMOOTH INFINITE)
          Autoplay moving ribbon · Pauses on hover · Crisp authentic SVGs
      ══════════════════════════════════════════════════════════════════ */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          padding: '12px 0 20px',
          maskImage: 'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)'
        }}
      >
        <div 
          className="developer-marquee-track"
          style={{
            display: 'flex',
            gap: isMobile ? '16px' : '24px',
            width: 'max-content',
            animation: 'devMarqueeScroll 45s linear infinite'
          }}
        >
          {marqueeList.map((dev, idx) => {
            const isHovered = hoveredDev === `${dev.id}-${idx}`;
            return (
              <div
                key={`${dev.id}-${idx}`}
                onClick={() => handleDeveloperClick(dev.searchQuery)}
                onMouseEnter={() => setHoveredDev(`${dev.id}-${idx}`)}
                onMouseLeave={() => setHoveredDev(null)}
                style={{
                  width: isMobile ? '230px' : '280px',
                  height: isMobile ? '125px' : '140px',
                  background: isHovered
                    ? 'radial-gradient(ellipse at top, rgba(30, 48, 76, 0.95) 0%, rgba(10, 18, 34, 0.98) 100%)'
                    : 'radial-gradient(ellipse at top, rgba(20, 32, 52, 0.75) 0%, rgba(8, 14, 26, 0.92) 100%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: isHovered
                    ? `1.5px solid ${dev.color}`
                    : '1px solid rgba(212,175,55,0.18)',
                  borderRadius: '18px',
                  padding: isMobile ? '12px 16px' : '14px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isHovered
                    ? `0 16px 36px rgba(0,0,0,0.8), 0 0 24px ${dev.color}33`
                    : '0 8px 24px rgba(0,0,0,0.45)',
                  transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  flexShrink: 0,
                  position: 'relative'
                }}
              >
                {/* Top Badge Pill */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    color: dev.color,
                    background: 'rgba(4,8,20,0.7)',
                    padding: '2px 8px',
                    borderRadius: '50px',
                    border: `1px solid ${dev.color}44`
                  }}>
                    {dev.badge}
                  </span>
                  <span style={{
                    fontSize: '0.66rem',
                    color: '#D4AF37',
                    fontWeight: 700
                  }}>
                    {dev.projectsCount} ↗
                  </span>
                </div>

                {/* Centered Vector Logo Mark */}
                <div style={{
                  height: isMobile ? '46px' : '52px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2px 0'
                }}>
                  {dev.logo}
                </div>

                {/* Bottom Corridor Location info */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  paddingTop: '6px'
                }}>
                  <span style={{
                    fontSize: '0.66rem',
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {dev.corridorLabel}
                  </span>
                  <span style={{
                    fontSize: '0.62rem',
                    color: 'rgba(255,255,255,0.4)',
                    fontWeight: 600
                  }}>
                    {dev.established}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          ✦ REVERSE MOVING LOGO MARQUEE (TRACK 2 - OFFSET CONTRAST)
          Creates a mesmerizing luxury dual-ribbon effect
      ══════════════════════════════════════════════════════════════════ */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          padding: '4px 0 16px',
          maskImage: 'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)'
        }}
      >
        <div 
          className="developer-marquee-track"
          style={{
            display: 'flex',
            gap: isMobile ? '16px' : '24px',
            width: 'max-content',
            animation: 'devMarqueeScrollReverse 50s linear infinite'
          }}
        >
          {[...DEVELOPERS_DATA].reverse().concat([...DEVELOPERS_DATA].reverse()).map((dev, idx) => {
            const isHovered = hoveredDev === `rev-${dev.id}-${idx}`;
            return (
              <div
                key={`rev-${dev.id}-${idx}`}
                onClick={() => handleDeveloperClick(dev.searchQuery)}
                onMouseEnter={() => setHoveredDev(`rev-${dev.id}-${idx}`)}
                onMouseLeave={() => setHoveredDev(null)}
                style={{
                  width: isMobile ? '230px' : '280px',
                  height: isMobile ? '125px' : '140px',
                  background: isHovered
                    ? 'radial-gradient(ellipse at top, rgba(30, 48, 76, 0.95) 0%, rgba(10, 18, 34, 0.98) 100%)'
                    : 'radial-gradient(ellipse at top, rgba(20, 32, 52, 0.75) 0%, rgba(8, 14, 26, 0.92) 100%)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: isHovered
                    ? `1.5px solid ${dev.color}`
                    : '1px solid rgba(212,175,55,0.18)',
                  borderRadius: '18px',
                  padding: isMobile ? '12px 16px' : '14px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: isHovered
                    ? `0 16px 36px rgba(0,0,0,0.8), 0 0 24px ${dev.color}33`
                    : '0 8px 24px rgba(0,0,0,0.45)',
                  transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  flexShrink: 0
                }}
              >
                {/* Top Badge Pill */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    color: dev.color,
                    background: 'rgba(4,8,20,0.7)',
                    padding: '2px 8px',
                    borderRadius: '50px',
                    border: `1px solid ${dev.color}44`
                  }}>
                    {dev.badge}
                  </span>
                  <span style={{
                    fontSize: '0.66rem',
                    color: '#D4AF37',
                    fontWeight: 700
                  }}>
                    {dev.projectsCount} ↗
                  </span>
                </div>

                {/* Centered Vector Logo Mark */}
                <div style={{
                  height: isMobile ? '46px' : '52px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '2px 0'
                }}>
                  {dev.logo}
                </div>

                {/* Bottom Corridor Location info */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  paddingTop: '6px'
                }}>
                  <span style={{
                    fontSize: '0.66rem',
                    color: 'rgba(255,255,255,0.6)',
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {dev.corridorLabel}
                  </span>
                  <span style={{
                    fontSize: '0.62rem',
                    color: 'rgba(255,255,255,0.4)',
                    fontWeight: 600
                  }}>
                    {dev.established}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust & Guarantee Strip */}
      <div style={{ maxWidth: '1200px', margin: '24px auto 0', padding: isMobile ? '0 16px' : '0 32px' }}>
        <div style={{
          background: 'rgba(15, 25, 45, 0.5)',
          border: '1px solid rgba(212,175,55,0.15)',
          borderRadius: '16px',
          padding: isMobile ? '12px 16px' : '14px 28px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          textAlign: 'center'
        }}>
          {[
            { icon: '📜', text: '100% MahaRERA Registered', sub: 'License A051262603190' },
            { icon: '🤝', text: 'Direct Developer Allotments', sub: 'Zero Brokerage to Buyers' },
            { icon: '⚖️', text: 'Legal Due Diligence Desk', sub: 'Title Clearance Verified' },
            { icon: '🚗', text: 'Complimentary VIP Site Tours', sub: 'Chauffeur Driven AC Fleet' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFFFF' }}>{item.text}</div>
                <div style={{ fontSize: '0.68rem', color: '#D4AF37', fontWeight: 600 }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Keyframes CSS */}
      <style>{`
        @keyframes devMarqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes devMarqueeScrollReverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .developer-marquee-track:hover {
          animation-play-state: paused !important;
        }
      `}</style>
    </section>
  );
}
