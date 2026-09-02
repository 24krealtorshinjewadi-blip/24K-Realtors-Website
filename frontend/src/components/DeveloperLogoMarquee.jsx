import React from 'react';

// ══════════════════════════════════════════════════════════════════════
// ✦ AUTHENTIC VECTOR LOGOS FOR ALL 12 TOP DEVELOPERS
// Pure transparent glass aesthetic · Zero card clutter · Slow moving
// ══════════════════════════════════════════════════════════════════════

export const DEVELOPERS_DATA = [
  {
    id: 'lodha',
    name: 'Lodha Group',
    searchQuery: 'Lodha',
    color: '#D4AF37',
    logo: (
      <svg viewBox="0 0 200 56" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lodhaGld" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF2C6" />
            <stop offset="60%" stopColor="#E6C35C" />
            <stop offset="100%" stopColor="#B38918" />
          </linearGradient>
        </defs>
        {/* Crown Spires Crest */}
        <g transform="translate(6, 6)">
          <path d="M8 32 L8 14 L14 20 L20 6 L26 20 L32 14 L32 32 Z" fill="url(#lodhaGld)" />
          <circle cx="20" cy="3.5" r="2.5" fill="url(#lodhaGld)" />
          <circle cx="8" cy="11" r="2" fill="url(#lodhaGld)" />
          <circle cx="32" cy="11" r="2" fill="url(#lodhaGld)" />
          <rect x="6" y="34" width="28" height="2.5" rx="1.2" fill="url(#lodhaGld)" />
        </g>
        <text x="50" y="28" fontFamily="'Cinzel', 'Georgia', serif" fontSize="22" fontWeight="900" fill="url(#lodhaGld)" letterSpacing="0.18em">
          LODHA
        </text>
        <text x="51" y="40" fontFamily="'Montserrat', sans-serif" fontSize="5.5" fontWeight="700" fill="rgba(255,255,255,0.55)" letterSpacing="0.28em">
          BUILDING A BETTER LIFE
        </text>
      </svg>
    )
  },
  {
    id: 'godrej',
    name: 'Godrej Properties',
    searchQuery: 'Godrej',
    color: '#38BDF8',
    logo: (
      <svg viewBox="0 0 200 56" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="godrejCoral" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 8)">
          <path d="M10 24 C8 14, 18 8, 26 15 C34 20, 32 28, 24 30 C16 32, 10 25, 17 19" stroke="url(#godrejCoral)" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="28" cy="16" r="2.5" fill="#E11D48" />
        </g>
        <text x="46" y="27" fontFamily="'Playfair Display', 'Georgia', serif" fontStyle="italic" fontSize="22" fontWeight="800" fill="#FFFFFF" letterSpacing="0.03em">
          Godrej
        </text>
        <text x="48" y="39" fontFamily="'Montserrat', sans-serif" fontSize="6.5" fontWeight="800" fill="#38BDF8" letterSpacing="0.3em">
          PROPERTIES
        </text>
      </svg>
    )
  },
  {
    id: 'vtp-realty',
    name: 'VTP Realty',
    searchQuery: 'VTP',
    color: '#F59E0B',
    logo: (
      <svg viewBox="0 0 200 56" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="vtpAmb" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 8)">
          <polygon points="16,3 29,29 3,29" fill="url(#vtpAmb)" />
          <polygon points="16,3 29,29 16,29" fill="#B45309" opacity="0.65" />
          <polygon points="16,13 22,26 10,26" fill="#040814" />
        </g>
        <text x="46" y="28" fontFamily="'Montserrat', sans-serif" fontSize="20" fontWeight="900" fill="#FFFFFF" letterSpacing="0.08em">
          VTP <tspan fill="url(#vtpAmb)">REALTY</tspan>
        </text>
        <text x="48" y="39" fontFamily="'Montserrat', sans-serif" fontSize="5.5" fontWeight="700" fill="rgba(255,255,255,0.55)" letterSpacing="0.22em">
          PUNE'S #1 BRAND
        </text>
      </svg>
    )
  },
  {
    id: 'joyville',
    name: 'Joyville (Shapoorji Pallonji)',
    searchQuery: 'Joyville',
    color: '#60A5FA',
    logo: (
      <svg viewBox="0 0 200 56" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="joyBlu" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 9)">
          <circle cx="16" cy="16" r="13" stroke="url(#joyBlu)" strokeWidth="2" fill="none" strokeDasharray="3 1.5" />
          <path d="M10 16 Q16 8 22 16 Q16 24 10 16 Z" fill="url(#joyBlu)" />
          <circle cx="16" cy="16" r="3.2" fill="#FFFFFF" />
        </g>
        <text x="46" y="26" fontFamily="'Montserrat', sans-serif" fontSize="19" fontWeight="900" fill="#FFFFFF" letterSpacing="0.02em">
          Joyville
        </text>
        <text x="48" y="39" fontFamily="'Montserrat', sans-serif" fontSize="5.5" fontWeight="700" fill="#93C5FD" letterSpacing="0.18em">
          BY SHAPOORJI PALLONJI
        </text>
      </svg>
    )
  },
  {
    id: 'kohinoor',
    name: 'Kohinoor Group',
    searchQuery: 'Kohinoor',
    color: '#22D3EE',
    logo: (
      <svg viewBox="0 0 200 56" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="kohiCy" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A5F3FC" />
            <stop offset="100%" stopColor="#0891B2" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 9)">
          <polygon points="8,9 24,9 30,19 16,30 2,19" fill="url(#kohiCy)" />
          <polygon points="8,9 16,30 24,9" fill="#FFFFFF" opacity="0.3" />
          <polygon points="2,19 16,30 30,19" fill="#0891B2" opacity="0.5" />
          <line x1="2" y1="19" x2="30" y2="19" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
        </g>
        <text x="46" y="27" fontFamily="'Cinzel', serif" fontSize="19" fontWeight="900" fill="#FFFFFF" letterSpacing="0.12em">
          KOHINOOR
        </text>
        <text x="48" y="39" fontFamily="'Montserrat', sans-serif" fontSize="5.5" fontWeight="700" fill="#67E8F9" letterSpacing="0.18em">
          A SADA SUKHI FEATURE
        </text>
      </svg>
    )
  },
  {
    id: 'pride-purple',
    name: 'Pride Purple Group',
    searchQuery: 'Pride',
    color: '#C084FC',
    logo: (
      <svg viewBox="0 0 200 56" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="pridePurp" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F3E8FF" />
            <stop offset="50%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#7E22CE" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 9)">
          <path d="M6 28 L6 8 L18 8 C23 8, 26 11, 26 16 C26 21, 23 24, 18 24 L13 24 L13 28 Z" fill="url(#pridePurp)" />
          <circle cx="18" cy="16" r="3" fill="#040814" />
          <polygon points="3,6 6,10 9,6 12,10 15,6" fill="#F5D77F" />
        </g>
        <text x="44" y="26" fontFamily="'Montserrat', sans-serif" fontSize="17" fontWeight="900" fill="#FFFFFF" letterSpacing="0.06em">
          PRIDE <tspan fill="url(#pridePurp)">PURPLE</tspan>
        </text>
        <text x="46" y="38" fontFamily="'Montserrat', sans-serif" fontSize="5.5" fontWeight="700" fill="#D8B4FE" letterSpacing="0.25em">
          PARK DISTRICT HOMES
        </text>
      </svg>
    )
  },
  {
    id: 'paranjape',
    name: 'Paranjape Schemes',
    searchQuery: 'Paranjape',
    color: '#34D399',
    logo: (
      <svg viewBox="0 0 200 56" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="emrldGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 9)">
          <circle cx="16" cy="16" r="14" stroke="url(#emrldGlow)" strokeWidth="2" fill="none" />
          <path d="M11 24 L11 9 L18 9 Q23 9 23 14 Q23 19 18 19 L11 19" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
        <text x="46" y="27" fontFamily="'Montserrat', sans-serif" fontSize="18" fontWeight="900" fill="#FFFFFF" letterSpacing="0.08em">
          PARANJAPE
        </text>
        <text x="48" y="39" fontFamily="'Montserrat', sans-serif" fontSize="5.5" fontWeight="700" fill="#6EE7B7" letterSpacing="0.2em">
          BLUE RIDGE TOWNSHIP
        </text>
      </svg>
    )
  },
  {
    id: 'kolte-patil',
    name: 'Kolte-Patil Developers',
    searchQuery: 'Kolte',
    color: '#EF4444',
    logo: (
      <svg viewBox="0 0 200 56" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="kolteRd" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 9)">
          <rect x="5" y="6" width="6" height="22" rx="1.5" fill="url(#kolteRd)" />
          <rect x="20" y="6" width="6" height="22" rx="1.5" fill="url(#kolteRd)" />
          <path d="M5 11 C5 4, 26 4, 26 11" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
        </g>
        <text x="44" y="27" fontFamily="'Montserrat', sans-serif" fontSize="17.5" fontWeight="900" fill="#FFFFFF" letterSpacing="0.06em">
          KOLTE<tspan fill="url(#kolteRd)">-PATIL</tspan>
        </text>
        <text x="46" y="39" fontFamily="'Montserrat', sans-serif" fontSize="5.5" fontWeight="700" fill="rgba(255,255,255,0.55)" letterSpacing="0.18em">
          CREATION, NOT CONSTRUCTION
        </text>
      </svg>
    )
  },
  {
    id: 'gera',
    name: 'Gera Developments',
    searchQuery: 'Gera',
    color: '#FB923C',
    logo: (
      <svg viewBox="0 0 200 56" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="geraOrn" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 9)">
          <path d="M16 3 L27 8 L27 19 Q16 30 16 30 Q5 19 5 19 L5 8 Z" fill="url(#geraOrn)" />
          <polygon points="16,10 18,15 23,15 19,18 21,23 16,20 11,23 13,18 9,15 14,15" fill="#FFFFFF" />
        </g>
        <text x="46" y="28" fontFamily="'Montserrat', sans-serif" fontSize="20" fontWeight="900" fill="#FFFFFF" letterSpacing="0.14em">
          GERA
        </text>
        <text x="48" y="40" fontFamily="'Montserrat', sans-serif" fontSize="6" fontWeight="800" fill="#FB923C" letterSpacing="0.25em">
          OUTDO · CHILD CENTRIC
        </text>
      </svg>
    )
  },
  {
    id: 'kasturi',
    name: 'Kasturi Housing',
    searchQuery: 'Kasturi',
    color: '#E2E8F0',
    logo: (
      <svg viewBox="0 0 200 56" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(6, 9)">
          <circle cx="16" cy="16" r="13" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
          <text x="10" y="22" fontFamily="'Cinzel', serif" fontSize="18" fontWeight="900" fill="#FFFFFF">K</text>
        </g>
        <text x="46" y="28" fontFamily="'Cinzel', serif" fontSize="19" fontWeight="700" fill="#FFFFFF" letterSpacing="0.2em">
          KASTURI
        </text>
        <text x="48" y="39" fontFamily="'Montserrat', sans-serif" fontSize="5" fontWeight="700" fill="rgba(255,255,255,0.55)" letterSpacing="0.24em">
          FINEST RESIDENCES
        </text>
      </svg>
    )
  },
  {
    id: 'mahindra',
    name: 'Mahindra Lifespaces',
    searchQuery: 'Mahindra',
    color: '#4ADE80',
    logo: (
      <svg viewBox="0 0 200 56" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mahRd" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 9)">
          <path d="M3 28 L9 9 L15 20 L21 9 L27 28" stroke="url(#mahRd)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="27" cy="9" r="2.8" fill="#22C55E" />
        </g>
        <text x="44" y="26" fontFamily="'Montserrat', sans-serif" fontSize="16" fontWeight="900" fill="#FFFFFF" letterSpacing="0.04em">
          Mahindra
        </text>
        <text x="46" y="38" fontFamily="'Montserrat', sans-serif" fontSize="6" fontWeight="800" fill="#4ADE80" letterSpacing="0.22em">
          LIFESPACES
        </text>
      </svg>
    )
  },
  {
    id: 'raheja',
    name: 'K. Raheja Corp',
    searchQuery: 'Raheja',
    color: '#38BDF8',
    logo: (
      <svg viewBox="0 0 200 56" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="rahejaBlu" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 9)">
          <rect x="5" y="12" width="4.5" height="16" rx="1" fill="url(#rahejaBlu)" />
          <rect x="13" y="4" width="4.5" height="24" rx="1" fill="#FFFFFF" />
          <rect x="21" y="9" width="4.5" height="19" rx="1" fill="url(#rahejaBlu)" />
        </g>
        <text x="44" y="27" fontFamily="'Cinzel', serif" fontSize="16" fontWeight="900" fill="#FFFFFF" letterSpacing="0.1em">
          K. RAHEJA
        </text>
        <text x="46" y="38" fontFamily="'Montserrat', sans-serif" fontSize="6" fontWeight="800" fill="#38BDF8" letterSpacing="0.25em">
          CORP · MINDSPACE
        </text>
      </svg>
    )
  }
];

export default function DeveloperLogoMarquee({ onSelectDeveloper, isMobile = false }) {
  // Triple-duplicated array for continuous, seamless infinite loop
  const seamlessMarquee = [...DEVELOPERS_DATA, ...DEVELOPERS_DATA, ...DEVELOPERS_DATA];

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
        background: 'linear-gradient(180deg, #040814 0%, #060c18 50%, #040814 100%)',
        padding: isMobile ? '32px 0 38px' : '48px 0 54px',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(212,175,55,0.14)',
        borderBottom: '1px solid rgba(212,175,55,0.14)'
      }}
    >
      {/* Background Subtle Radial Glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '700px', height: '140px',
        background: 'radial-gradient(ellipse, rgba(212,175,55,0.05) 0%, transparent 70%)',
        pointerEvents: 'none', filter: 'blur(40px)'
      }} />

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '0 16px' : '0 32px' }}>
        
        {/* Sleek Minimal Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '20px' : '26px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.22)',
            borderRadius: '50px', padding: '4px 14px', marginBottom: '10px'
          }}>
            <span style={{ fontSize: '11px', color: '#E6C35C' }}>✦</span>
            <span style={{
              color: '#F5D77F', fontSize: '0.68rem', fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase'
            }}>
              AUTHORIZED DEVELOPER PARTNERS
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: isMobile ? '1.5rem' : '2.1rem',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 0 6px',
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
            color: 'rgba(255,255,255,0.5)',
            fontSize: isMobile ? '0.8rem' : '0.88rem',
            maxWidth: '560px',
            margin: '0 auto',
            lineHeight: 1.5
          }}>
            Direct allocations with Pune West’s 12 landmark builders · Zero Brokerage to Direct Buyers
          </p>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════════
          ✦ 1 LINE SLOW-MOVING TRANSPARENT GLASS LOGO RIBBON
          Single line · Transparent glass capsules · Slow, majestic glide
      ══════════════════════════════════════════════════════════════════ */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          padding: '8px 0',
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)'
        }}
      >
        <div 
          className="developer-glass-track"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '16px' : '22px',
            width: 'max-content',
            animation: 'devSlowScroll 85s linear infinite'
          }}
        >
          {seamlessMarquee.map((dev, idx) => (
            <div
              key={`${dev.id}-${idx}`}
              onClick={() => handleDeveloperClick(dev.searchQuery)}
              className="developer-glass-capsule"
              title={`View verified ${dev.name} projects`}
              style={{
                width: isMobile ? '185px' : '215px',
                height: isMobile ? '60px' : '68px',
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: isMobile ? '8px 14px' : '10px 18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.07)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.45)';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.05)';
              }}
            >
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {dev.logo}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle Bottom Trust Indicators */}
      <div style={{ maxWidth: '900px', margin: '18px auto 0', padding: '0 16px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: isMobile ? '12px' : '28px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          fontSize: '0.72rem',
          color: 'rgba(255,255,255,0.45)',
          fontFamily: "'Montserrat', sans-serif"
        }}>
          <span>🛡️ MahaRERA Agent: <strong style={{ color: '#E6C35C' }}>A051262603190</strong></span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <span>🤝 100% Direct Developer Allotment</span>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
          <span>⚖️ Title Clearance Due Diligence</span>
        </div>
      </div>

      {/* Slow Moving Marquee Keyframes */}
      <style>{`
        @keyframes devSlowScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .developer-glass-track:hover {
          animation-play-state: paused !important;
        }
      `}</style>
    </section>
  );
}
