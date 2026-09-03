import React from 'react';

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// âœ¦ PREMIUM DEVELOPER LOGO MARQUEE â€” v3 LUXURY REDESIGN
// Taller glassmorphism cards Â· Monochrome-by-default Â· Brand reveal on hover
// Icon-only corner watermark Â· Smooth edge-fade Â· Animated glow
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

// Helper: hex â†’ "r,g,b" for rgba()
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r},${g},${b}`;
}

export const DEVELOPERS_DATA = [
  {
    id: 'lodha',
    name: 'Lodha Group',
    searchQuery: 'Lodha',
    color: '#D4AF37',
    icon: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 36 L8 16 L14 22 L20 6 L26 22 L32 16 L32 36 Z" fill="#fff" />
        <circle cx="20" cy="4" r="3" fill="#fff" />
        <rect x="6" y="37" width="28" height="2" rx="1" fill="#fff" />
      </svg>
    ),
    logo: (
      <svg viewBox="0 0 200 56" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lodhaGld" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF2C6" />
            <stop offset="60%" stopColor="#E6C35C" />
            <stop offset="100%" stopColor="#B38918" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 6)">
          <path d="M8 32 L8 14 L14 20 L20 6 L26 20 L32 14 L32 32 Z" fill="url(#lodhaGld)" />
          <circle cx="20" cy="3.5" r="2.5" fill="url(#lodhaGld)" />
          <circle cx="8" cy="11" r="2" fill="url(#lodhaGld)" />
          <circle cx="32" cy="11" r="2" fill="url(#lodhaGld)" />
          <rect x="6" y="34" width="28" height="2.5" rx="1.2" fill="url(#lodhaGld)" />
        </g>
        <text x="50" y="28" fontFamily="'Cinzel', 'Georgia', serif" fontSize="22" fontWeight="900" fill="url(#lodhaGld)" letterSpacing="0.18em">LODHA</text>
        <text x="51" y="40" fontFamily="'Montserrat', sans-serif" fontSize="5.5" fontWeight="700" fill="rgba(255,255,255,0.55)" letterSpacing="0.28em">BUILDING A BETTER LIFE</text>
      </svg>
    )
  },
  {
    id: 'godrej',
    name: 'Godrej Properties',
    searchQuery: 'Godrej',
    color: '#E11D48',
    icon: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 26 C8 14, 20 7, 28 14 C36 20, 34 30, 24 32 C14 34, 8 26, 16 19" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        <circle cx="30" cy="14" r="3" fill="#fff" />
      </svg>
    ),
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
        <text x="46" y="27" fontFamily="'Playfair Display', 'Georgia', serif" fontStyle="italic" fontSize="22" fontWeight="800" fill="#FFFFFF" letterSpacing="0.03em">Godrej</text>
        <text x="48" y="39" fontFamily="'Montserrat', sans-serif" fontSize="6.5" fontWeight="800" fill="#FB7185" letterSpacing="0.3em">PROPERTIES</text>
      </svg>
    )
  },
  {
    id: 'vtp-realty',
    name: 'VTP Realty',
    searchQuery: 'VTP',
    color: '#F59E0B',
    icon: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="20,4 36,36 4,36" fill="#fff" />
        <polygon points="20,16 28,33 12,33" fill="rgba(0,0,0,0.3)" />
      </svg>
    ),
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
        <text x="46" y="28" fontFamily="'Montserrat', sans-serif" fontSize="20" fontWeight="900" fill="#FFFFFF" letterSpacing="0.08em">VTP <tspan fill="url(#vtpAmb)">REALTY</tspan></text>
        <text x="48" y="39" fontFamily="'Montserrat', sans-serif" fontSize="5.5" fontWeight="700" fill="rgba(255,255,255,0.55)" letterSpacing="0.22em">PUNE'S #1 BRAND</text>
      </svg>
    )
  },
  {
    id: 'joyville',
    name: 'Joyville (Shapoorji)',
    searchQuery: 'Joyville',
    color: '#3B82F6',
    icon: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="16" stroke="#fff" strokeWidth="2.5" fill="none" strokeDasharray="4 2" />
        <path d="M12 20 Q20 10 28 20 Q20 30 12 20 Z" fill="#fff" />
        <circle cx="20" cy="20" r="4" fill="rgba(0,0,0,0.4)" />
      </svg>
    ),
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
        <text x="46" y="26" fontFamily="'Montserrat', sans-serif" fontSize="19" fontWeight="900" fill="#FFFFFF" letterSpacing="0.02em">Joyville</text>
        <text x="48" y="39" fontFamily="'Montserrat', sans-serif" fontSize="5.5" fontWeight="700" fill="#93C5FD" letterSpacing="0.18em">BY SHAPOORJI PALLONJI</text>
      </svg>
    )
  },
  {
    id: 'kohinoor',
    name: 'Kohinoor Group',
    searchQuery: 'Kohinoor',
    color: '#06B6D4',
    icon: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="8,10 32,10 38,22 20,36 2,22" fill="#fff" />
        <polygon points="8,10 20,36 32,10" fill="rgba(0,0,0,0.2)" />
        <line x1="2" y1="22" x2="38" y2="22" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
      </svg>
    ),
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
        <text x="46" y="27" fontFamily="'Cinzel', serif" fontSize="19" fontWeight="900" fill="#FFFFFF" letterSpacing="0.12em">KOHINOOR</text>
        <text x="48" y="39" fontFamily="'Montserrat', sans-serif" fontSize="5.5" fontWeight="700" fill="#67E8F9" letterSpacing="0.18em">A SADA SUKHI FEATURE</text>
      </svg>
    )
  },
  {
    id: 'pride-purple',
    name: 'Pride Purple Group',
    searchQuery: 'Pride',
    color: '#A855F7',
    icon: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 36 L8 10 L22 10 C28 10, 32 14, 32 20 C32 26, 28 30, 22 30 L16 30 L16 36 Z" fill="#fff" />
        <circle cx="22" cy="20" r="4" fill="rgba(0,0,0,0.3)" />
      </svg>
    ),
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
        <text x="44" y="26" fontFamily="'Montserrat', sans-serif" fontSize="17" fontWeight="900" fill="#FFFFFF" letterSpacing="0.06em">PRIDE <tspan fill="url(#pridePurp)">PURPLE</tspan></text>
        <text x="46" y="38" fontFamily="'Montserrat', sans-serif" fontSize="5.5" fontWeight="700" fill="#D8B4FE" letterSpacing="0.25em">PARK DISTRICT HOMES</text>
      </svg>
    )
  },
  {
    id: 'paranjape',
    name: 'Paranjape Schemes',
    searchQuery: 'Paranjape',
    color: '#10B981',
    icon: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="17" stroke="#fff" strokeWidth="2.5" fill="none" />
        <path d="M14 30 L14 10 L22 10 Q28 10 28 17 Q28 24 22 24 L14 24" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
    ),
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
        <text x="46" y="27" fontFamily="'Montserrat', sans-serif" fontSize="18" fontWeight="900" fill="#FFFFFF" letterSpacing="0.08em">PARANJAPE</text>
        <text x="48" y="39" fontFamily="'Montserrat', sans-serif" fontSize="5.5" fontWeight="700" fill="#6EE7B7" letterSpacing="0.2em">BLUE RIDGE TOWNSHIP</text>
      </svg>
    )
  },
  {
    id: 'kolte-patil',
    name: 'Kolte-Patil Developers',
    searchQuery: 'Kolte',
    color: '#EF4444',
    icon: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="8" width="8" height="26" rx="2" fill="#fff" />
        <rect x="26" y="8" width="8" height="26" rx="2" fill="#fff" />
        <path d="M6 14 C6 4, 34 4, 34 14" stroke="#fff" strokeWidth="3" fill="none" />
      </svg>
    ),
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
        <text x="44" y="27" fontFamily="'Montserrat', sans-serif" fontSize="17.5" fontWeight="900" fill="#FFFFFF" letterSpacing="0.06em">KOLTE<tspan fill="url(#kolteRd)">-PATIL</tspan></text>
        <text x="46" y="39" fontFamily="'Montserrat', sans-serif" fontSize="5.5" fontWeight="700" fill="rgba(255,255,255,0.55)" letterSpacing="0.18em">CREATION, NOT CONSTRUCTION</text>
      </svg>
    )
  },
  {
    id: 'gera',
    name: 'Gera Developments',
    searchQuery: 'Gera',
    color: '#F97316',
    icon: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4 L34 10 L34 24 Q20 38 20 38 Q6 24 6 24 L6 10 Z" fill="#fff" />
        <polygon points="20,12 22,19 29,19 24,23 26,30 20,26 14,30 16,23 11,19 18,19" fill="rgba(0,0,0,0.3)" />
      </svg>
    ),
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
        <text x="46" y="28" fontFamily="'Montserrat', sans-serif" fontSize="20" fontWeight="900" fill="#FFFFFF" letterSpacing="0.14em">GERA</text>
        <text x="48" y="40" fontFamily="'Montserrat', sans-serif" fontSize="6" fontWeight="800" fill="#FB923C" letterSpacing="0.25em">OUTDO Â· CHILD CENTRIC</text>
      </svg>
    )
  },
  {
    id: 'kasturi',
    name: 'Kasturi Housing',
    searchQuery: 'Kasturi',
    color: '#94A3B8',
    icon: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="17" stroke="#fff" strokeWidth="2.5" fill="none" />
        <text x="12" y="28" fontFamily="'Cinzel', serif" fontSize="22" fontWeight="900" fill="#fff">K</text>
      </svg>
    ),
    logo: (
      <svg viewBox="0 0 200 56" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(6, 9)">
          <circle cx="16" cy="16" r="13" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
          <text x="10" y="22" fontFamily="'Cinzel', serif" fontSize="18" fontWeight="900" fill="#FFFFFF">K</text>
        </g>
        <text x="46" y="28" fontFamily="'Cinzel', serif" fontSize="19" fontWeight="700" fill="#FFFFFF" letterSpacing="0.2em">KASTURI</text>
        <text x="48" y="39" fontFamily="'Montserrat', sans-serif" fontSize="5" fontWeight="700" fill="rgba(255,255,255,0.55)" letterSpacing="0.24em">FINEST RESIDENCES</text>
      </svg>
    )
  },
  {
    id: 'mahindra',
    name: 'Mahindra Lifespaces',
    searchQuery: 'Mahindra',
    color: '#22C55E',
    icon: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 34 L12 10 L20 24 L28 10 L36 34" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="36" cy="10" r="4" fill="#fff" />
      </svg>
    ),
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
        <text x="44" y="26" fontFamily="'Montserrat', sans-serif" fontSize="16" fontWeight="900" fill="#FFFFFF" letterSpacing="0.04em">Mahindra</text>
        <text x="46" y="38" fontFamily="'Montserrat', sans-serif" fontSize="6" fontWeight="800" fill="#4ADE80" letterSpacing="0.22em">LIFESPACES</text>
      </svg>
    )
  },
  {
    id: 'raheja',
    name: 'K. Raheja Corp',
    searchQuery: 'Raheja',
    color: '#38BDF8',
    icon: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="14" width="6" height="22" rx="1.5" fill="#fff" />
        <rect x="17" y="4" width="6" height="32" rx="1.5" fill="#fff" />
        <rect x="28" y="10" width="6" height="26" rx="1.5" fill="#fff" />
      </svg>
    ),
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
        <text x="44" y="27" fontFamily="'Cinzel', serif" fontSize="16" fontWeight="900" fill="#FFFFFF" letterSpacing="0.1em">K. RAHEJA</text>
        <text x="46" y="38" fontFamily="'Montserrat', sans-serif" fontSize="6" fontWeight="800" fill="#38BDF8" letterSpacing="0.25em">CORP Â· MINDSPACE</text>
      </svg>
    )
  }
];

export default function DeveloperLogoMarquee({ onSelectDeveloper, isMobile = false }) {
  const seamlessMarquee = [...DEVELOPERS_DATA, ...DEVELOPERS_DATA, ...DEVELOPERS_DATA];

  const handleDeveloperClick = (searchQuery) => {
    if (typeof onSelectDeveloper === 'function') {
      onSelectDeveloper(searchQuery);
    }
    const anchor = document.getElementById('listings-anchor');
    if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="authorized-developers"
      style={{
        background: 'linear-gradient(180deg, #040814 0%, #060d1a 50%, #040814 100%)',
        padding: isMobile ? '40px 0 44px' : '60px 0 66px',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(212,175,55,0.12)',
        borderBottom: '1px solid rgba(212,175,55,0.12)'
      }}
    >
      {/* Ambient radial glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: '900px', height: '200px',
        background: 'radial-gradient(ellipse, rgba(212,175,55,0.04) 0%, transparent 65%)',
        pointerEvents: 'none', filter: 'blur(60px)'
      }} />

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '0 16px' : '0 32px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '28px' : '36px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: '50px', padding: '5px 16px', marginBottom: '14px'
          }}>
            <span style={{ fontSize: '10px', color: '#E6C35C' }}>âœ¦</span>
            <span style={{ color: '#F5D77F', fontSize: '0.67rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif" }}>
              AUTHORIZED DEVELOPER PARTNERS
            </span>
          </div>
          <h2 style={{
            fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.55rem' : '2.2rem',
            fontWeight: 800, color: '#FFFFFF', margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.2
          }}>
            Trusted{' '}
            <span style={{ background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Brands &amp; Partners
            </span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: isMobile ? '0.78rem' : '0.85rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6, fontFamily: "'Montserrat', sans-serif" }}>
            Direct mandates with Pune West's 12 landmark builders Â· Zero brokerage to direct buyers
          </p>
        </div>
      </div>

      {/* Marquee Ribbon */}
      <div style={{
        position: 'relative', width: '100%', overflow: 'hidden', padding: '12px 0',
        maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)'
      }}>
        <div
          className="developer-glass-track"
          style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '14px' : '20px', width: 'max-content', animation: 'devSlowScroll 90s linear infinite' }}
        >
          {seamlessMarquee.map((dev, idx) => (
            <div
              key={`${dev.id}-${idx}`}
              onClick={() => handleDeveloperClick(dev.searchQuery)}
              title={`View verified ${dev.name} projects`}
              style={{
                width: isMobile ? '200px' : '240px',
                height: isMobile ? '76px' : '88px',
                background: 'rgba(255,255,255,0.025)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                padding: isMobile ? '10px 16px' : '14px 22px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                overflow: 'hidden',
                filter: 'saturate(0.3) brightness(0.8)'
              }}
              onMouseEnter={(e) => {
                const card = e.currentTarget;
                const rgb = hexToRgb(dev.color);
                card.style.filter = 'saturate(1) brightness(1)';
                card.style.background = `rgba(${rgb}, 0.07)`;
                card.style.borderColor = `rgba(${rgb}, 0.55)`;
                card.style.transform = 'translateY(-6px) scale(1.03)';
                card.style.boxShadow = `0 20px 45px rgba(0,0,0,0.75), 0 0 30px rgba(${rgb}, 0.28), inset 0 1px 0 rgba(255,255,255,0.08)`;
                const track = card.closest('.developer-glass-track');
                if (track) track.style.animationPlayState = 'paused';
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget;
                card.style.filter = 'saturate(0.3) brightness(0.8)';
                card.style.background = 'rgba(255,255,255,0.025)';
                card.style.borderColor = 'rgba(255,255,255,0.07)';
                card.style.transform = 'none';
                card.style.boxShadow = 'none';
                const track = card.closest('.developer-glass-track');
                if (track) track.style.animationPlayState = 'running';
              }}
            >
              {/* Corner icon watermark */}
              <div style={{
                position: 'absolute', bottom: '-6px', right: '-6px',
                width: isMobile ? '46px' : '58px', height: isMobile ? '46px' : '58px',
                opacity: 0.06, filter: 'grayscale(1) brightness(10)', pointerEvents: 'none', flexShrink: 0
              }}>
                {dev.icon}
              </div>
              {/* Main logo */}
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                {dev.logo}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Strip */}
      <div style={{ maxWidth: '900px', margin: '24px auto 0', padding: '0 16px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: isMobile ? '10px' : '28px', flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.38)', fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.04em' }}>
          <span>ðŸ›¡ï¸ MahaRERA Agent: <strong style={{ color: '#E6C35C' }}>A051262603190</strong></span>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>â€¢</span>
          <span>ðŸ¤ 100% Direct Developer Allotment</span>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>â€¢</span>
          <span>âš–ï¸ Title Clearance Due Diligence</span>
        </div>
      </div>

      <style>{`
        @keyframes devSlowScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </section>
  );
}

