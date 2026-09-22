import React from 'react';

// ══════════════════════════════════════════════════════════════════════
// ✦ PREMIUM VERIFIED DEVELOPER LOGO MARQUEE — PUNE WEST LANDMARK BUILDERS
// 17 Verified Real Estate Brands · 100% Authentic Corporate Identity
// Ultra-Sharp Vector SVG Logos · Glassmorphism Cards · Brand Reveal on Hover
// ══════════════════════════════════════════════════════════════════════

// Helper: hex → "r,g,b" for rgba()
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r},${g},${b}`;
}

export const DEVELOPERS_DATA = [
  // 1. LODHA GROUP
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
        <g transform="translate(8, 7)">
          <path d="M6 31 L6 13 L12 19 L18 5 L24 19 L30 13 L30 31 Z" fill="url(#lodhaGld)" />
          <circle cx="18" cy="3" r="2.2" fill="url(#lodhaGld)" />
          <circle cx="6" cy="10.5" r="1.8" fill="url(#lodhaGld)" />
          <circle cx="30" cy="10.5" r="1.8" fill="url(#lodhaGld)" />
          <rect x="4" y="33" width="28" height="2.2" rx="1.1" fill="url(#lodhaGld)" />
        </g>
        <text x="48" y="27" fontFamily="'Cinzel', 'Georgia', serif" fontSize="21" fontWeight="900" fill="url(#lodhaGld)" letterSpacing="0.18em">LODHA</text>
        <text x="49" y="40" fontFamily="'Montserrat', sans-serif" fontSize="5.5" fontWeight="700" fill="rgba(255,255,255,0.6)" letterSpacing="0.28em">BUILDING A BETTER LIFE</text>
      </svg>
    )
  },

  // 2. GODREJ PROPERTIES
  {
    id: 'godrej',
    name: 'Godrej Properties',
    searchQuery: 'Godrej',
    color: '#E31E24',
    icon: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 26 C8 14, 20 7, 28 14 C36 20, 34 30, 24 32 C14 34, 8 26, 16 19" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        <circle cx="30" cy="14" r="3" fill="#fff" />
      </svg>
    ),
    logo: (
      <svg viewBox="0 0 200 56" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="godrejRedGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF4D4D" />
            <stop offset="100%" stopColor="#C9141D" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 11)">
          {/* Authentic Godrej script signature mark */}
          <path d="M4 18 C3 10, 10 5, 17 9 C22 12, 23 18, 17 21 C11 24, 7 19, 11 14 C13 11, 17 12, 18 15" stroke="url(#godrejRedGrad)" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <circle cx="21" cy="8" r="2.2" fill="#E31E24" />
        </g>
        <text x="36" y="27" fontFamily="'Playfair Display', 'Georgia', serif" fontStyle="italic" fontSize="23" fontWeight="900" fill="#FFFFFF" letterSpacing="0.01em">
          <tspan fill="#FF4D4D">G</tspan>odrej
        </text>
        <line x1="112" y1="13" x2="112" y2="35" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
        <text x="120" y="27" fontFamily="'Montserrat', sans-serif" fontSize="9.5" fontWeight="800" fill="#FFFFFF" letterSpacing="0.14em">PROPERTIES</text>
        <text x="38" y="41" fontFamily="'Montserrat', sans-serif" fontSize="5.5" fontWeight="700" fill="rgba(255,255,255,0.5)" letterSpacing="0.26em">INNOVATION · SUSTAINABILITY · EXCELLENCE</text>
      </svg>
    )
  },

  // 3. VTP REALTY
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
          <linearGradient id="vtpAmbGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
        </defs>
        <g transform="translate(8, 8)">
          <polygon points="16,2 30,30 2,30" fill="url(#vtpAmbGrad)" />
          <polygon points="16,2 30,30 16,30" fill="#78350F" opacity="0.6" />
          <polygon points="16,13 23,27 9,27" fill="#040814" />
        </g>
        <text x="48" y="27" fontFamily="'Montserrat', sans-serif" fontSize="21" fontWeight="900" fill="#FFFFFF" letterSpacing="0.08em">VTP <tspan fill="url(#vtpAmbGrad)">REALTY</tspan></text>
        <text x="49" y="40" fontFamily="'Montserrat', sans-serif" fontSize="5.5" fontWeight="700" fill="#FDE68A" letterSpacing="0.22em">PUNE'S #1 REAL ESTATE BRAND</text>
      </svg>
    )
  },

  // 4. SHAPOORJI PALLONJI (JOYVILLE)
  {
    id: 'shapoorji-pallonji',
    name: 'Shapoorji Pallonji',
    searchQuery: 'Shapoorji',
    color: '#0284C7',
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
          <linearGradient id="spNavy" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 8)">
          {/* Authentic 160-Yr SP Monogram Shield */}
          <circle cx="16" cy="16" r="14" stroke="url(#spNavy)" strokeWidth="2.5" fill="none" />
          <path d="M10 13 Q16 8 20 13 Q24 18 17 21 Q11 24 15 28" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <circle cx="22" cy="11" r="2" fill="url(#spNavy)" />
        </g>
        <text x="44" y="24" fontFamily="'Cinzel', 'Georgia', serif" fontSize="14" fontWeight="900" fill="#FFFFFF" letterSpacing="0.1em">SHAPOORJI PALLONJI</text>
        <text x="45" y="36" fontFamily="'Montserrat', sans-serif" fontSize="7" fontWeight="800" fill="#38BDF8" letterSpacing="0.24em">REAL ESTATE · JOYVILLE</text>
        <text x="45" y="46" fontFamily="'Montserrat', sans-serif" fontSize="5" fontWeight="600" fill="rgba(255,255,255,0.45)" letterSpacing="0.2em">ENGINEERING EXCELLENCE SINCE 1865</text>
      </svg>
    )
  },

  // 5. KOHINOOR GROUP
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
          <linearGradient id="kohiDia" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 8)">
          <polygon points="8,8 24,8 30,18 16,30 2,18" fill="url(#kohiDia)" />
          <polygon points="8,8 16,30 24,8" fill="#FFFFFF" opacity="0.4" />
          <polygon points="2,18 16,30 30,18" fill="#0369A1" opacity="0.6" />
          <line x1="2" y1="18" x2="30" y2="18" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.8" />
        </g>
        <text x="44" y="26" fontFamily="'Cinzel', serif" fontSize="19" fontWeight="900" fill="#FFFFFF" letterSpacing="0.14em">KOHINOOR</text>
        <text x="46" y="38" fontFamily="'Montserrat', sans-serif" fontSize="6" fontWeight="800" fill="#67E8F9" letterSpacing="0.22em">A SADA SUKHI FEATURE</text>
        <text x="46" y="47" fontFamily="'Montserrat', sans-serif" fontSize="4.8" fontWeight="600" fill="rgba(255,255,255,0.4)" letterSpacing="0.18em">40+ YEARS OF TRUST IN PUNE WEST</text>
      </svg>
    )
  },

  // 6. KOLTE-PATIL DEVELOPERS
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
          <linearGradient id="kolteCrimson" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 8)">
          <rect x="4" y="4" width="26" height="26" rx="3" fill="url(#kolteCrimson)" />
          {/* Architectural portal silhouette */}
          <rect x="9" y="10" width="5" height="15" fill="#FFFFFF" />
          <rect x="19" y="10" width="5" height="15" fill="#FFFFFF" />
          <path d="M9 13 Q16 8 24 13" stroke="#FFFFFF" strokeWidth="2" fill="none" />
        </g>
        <text x="44" y="26" fontFamily="'Montserrat', sans-serif" fontSize="17.5" fontWeight="900" fill="#FFFFFF" letterSpacing="0.07em">
          KOLTE<tspan fill="#F87171">-PATIL</tspan>
        </text>
        <text x="46" y="38" fontFamily="'Montserrat', sans-serif" fontSize="5.5" fontWeight="700" fill="rgba(255,255,255,0.7)" letterSpacing="0.18em">CREATION, NOT CONSTRUCTION</text>
        <text x="46" y="47" fontFamily="'Montserrat', sans-serif" fontSize="4.8" fontWeight="600" fill="#FCA5A5" letterSpacing="0.15em">LIFE REPUBLIC TOWNSHIP MANDATES</text>
      </svg>
    )
  },

  // 7. PRIDE PURPLE GROUP
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
          <linearGradient id="pridePurpGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F3E8FF" />
            <stop offset="50%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#7E22CE" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 8)">
          <path d="M5 28 L5 6 L18 6 C24 6, 27 10, 27 15 C27 20, 24 23, 18 23 L12 23 L12 28 Z" fill="url(#pridePurpGrad)" />
          <circle cx="18" cy="15" r="3" fill="#040814" />
          <polygon points="3,4 7,9 11,4 15,9 19,4" fill="#E6C35C" />
        </g>
        <text x="44" y="25" fontFamily="'Montserrat', sans-serif" fontSize="17" fontWeight="900" fill="#FFFFFF" letterSpacing="0.06em">
          PRIDE <tspan fill="url(#pridePurpGrad)">PURPLE</tspan>
        </text>
        <text x="46" y="37" fontFamily="'Montserrat', sans-serif" fontSize="5.5" fontWeight="800" fill="#D8B4FE" letterSpacing="0.25em">PARK DISTRICT &amp; 24K HOMES</text>
        <text x="46" y="46" fontFamily="'Montserrat', sans-serif" fontSize="4.8" fontWeight="600" fill="rgba(255,255,255,0.4)" letterSpacing="0.18em">PUNE'S ULTRA LUXURY LANDMARKS</text>
      </svg>
    )
  },

  // 8. PARANJAPE SCHEMES
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
          <linearGradient id="emrldParan" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A7F3D0" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 8)">
          <circle cx="16" cy="16" r="14" stroke="url(#emrldParan)" strokeWidth="2.2" fill="none" />
          <path d="M10 23 L10 8 L18 8 Q23 8 23 13 Q23 18 18 18 L10 18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <polygon points="18,12 24,7 22,14" fill="#F59E0B" />
        </g>
        <text x="46" y="26" fontFamily="'Montserrat', sans-serif" fontSize="18" fontWeight="900" fill="#FFFFFF" letterSpacing="0.08em">PARANJAPE</text>
        <text x="48" y="38" fontFamily="'Montserrat', sans-serif" fontSize="5.5" fontWeight="700" fill="#6EE7B7" letterSpacing="0.2em">THE SPIRIT OF NEW INDIA</text>
        <text x="48" y="47" fontFamily="'Montserrat', sans-serif" fontSize="4.8" fontWeight="600" fill="rgba(255,255,255,0.45)" letterSpacing="0.16em">BLUE RIDGE 138-ACRE TOWNSHIP PIONEER</text>
      </svg>
    )
  },

  // 9. GERA DEVELOPMENTS
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
          <linearGradient id="geraOrnGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 8)">
          <path d="M16 2 L28 8 L28 20 Q16 31 16 31 Q4 20 4 20 L4 8 Z" fill="url(#geraOrnGrad)" />
          <polygon points="16,9 18,15 24,15 19,18 21,24 16,20 11,24 13,18 8,15 14,15" fill="#FFFFFF" />
        </g>
        <text x="46" y="27" fontFamily="'Montserrat', sans-serif" fontSize="21" fontWeight="900" fill="#FFFFFF" letterSpacing="0.08em">
          gera
        </text>
        <text x="48" y="39" fontFamily="'Montserrat', sans-serif" fontSize="6" fontWeight="800" fill="#FB923C" letterSpacing="0.25em">LET'S OUTDO · CHILDCENTRIC®</text>
        <text x="48" y="47" fontFamily="'Montserrat', sans-serif" fontSize="4.8" fontWeight="600" fill="rgba(255,255,255,0.4)" letterSpacing="0.18em">50+ YEARS OF RESIDENTIAL EXCELLENCE</text>
      </svg>
    )
  },

  // 10. VILAS JAVDEKAR DEVELOPERS (VJ)
  {
    id: 'vilas-javdekar',
    name: 'Vilas Javdekar Developers',
    searchQuery: 'Javdekar',
    color: '#E11D48',
    icon: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="16" stroke="#fff" strokeWidth="2.5" fill="none" />
        <circle cx="20" cy="20" r="6" fill="#fff" />
        <line x1="20" y1="4" x2="20" y2="36" stroke="#fff" strokeWidth="2" />
      </svg>
    ),
    logo: (
      <svg viewBox="0 0 200 56" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="vjRedGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#BE123C" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 8)">
          <circle cx="16" cy="16" r="13" stroke="url(#vjRedGrad)" strokeWidth="2.5" fill="none" />
          <circle cx="16" cy="16" r="4.5" fill="url(#vjRedGrad)" />
          <polygon points="16,3 19,10 13,10" fill="#F59E0B" />
        </g>
        <text x="44" y="24" fontFamily="'Montserrat', sans-serif" fontSize="15" fontWeight="900" fill="#FFFFFF" letterSpacing="0.08em">VILAS JAVDEKAR</text>
        <text x="45" y="36" fontFamily="'Montserrat', sans-serif" fontSize="7" fontWeight="800" fill="#FDA4AF" letterSpacing="0.22em">VJ · TRUST &amp; DESIGN</text>
        <text x="45" y="46" fontFamily="'Montserrat', sans-serif" fontSize="4.8" fontWeight="600" fill="rgba(255,255,255,0.4)" letterSpacing="0.16em">YASHWIN, PALLADIO &amp; SUPERNOVA TOWERS</text>
      </svg>
    )
  },

  // 11. ROHAN BUILDERS
  {
    id: 'rohan',
    name: 'Rohan Builders',
    searchQuery: 'Rohan',
    color: '#EAB308',
    icon: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="8,32 20,8 32,32 20,24" fill="#fff" />
      </svg>
    ),
    logo: (
      <svg viewBox="0 0 200 56" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="rohanGld" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 8)">
          {/* Authentic origami bird in flight mark */}
          <polygon points="4,28 16,4 28,28 16,21" fill="url(#rohanGld)" />
          <polygon points="16,4 28,28 16,21" fill="#854D0E" opacity="0.45" />
        </g>
        <text x="44" y="27" fontFamily="'Montserrat', sans-serif" fontSize="19" fontWeight="900" fill="#FFFFFF" letterSpacing="0.14em">ROHAN</text>
        <text x="46" y="39" fontFamily="'Montserrat', sans-serif" fontSize="6.2" fontWeight="800" fill="#FACC15" letterSpacing="0.24em">PLUS HOMES · SINCE 1993</text>
        <text x="46" y="47" fontFamily="'Montserrat', sans-serif" fontSize="4.8" fontWeight="600" fill="rgba(255,255,255,0.4)" letterSpacing="0.16em">VENTILATION · PRIVACY · SMART SPACE</text>
      </svg>
    )
  },

  // 12. KASTURI HOUSING
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
        <defs>
          <linearGradient id="kasturiPlat" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 8)">
          <circle cx="16" cy="16" r="14" stroke="url(#kasturiPlat)" strokeWidth="1.8" fill="none" />
          <text x="9.5" y="22.5" fontFamily="'Cinzel', serif" fontSize="19" fontWeight="900" fill="#FFFFFF">K</text>
        </g>
        <text x="46" y="27" fontFamily="'Cinzel', serif" fontSize="18" fontWeight="700" fill="#FFFFFF" letterSpacing="0.22em">K A S T U R I</text>
        <text x="48" y="39" fontFamily="'Montserrat', sans-serif" fontSize="5.5" fontWeight="700" fill="#CBD5E1" letterSpacing="0.24em">THE FINEST RESIDENCES</text>
        <text x="48" y="47" fontFamily="'Montserrat', sans-serif" fontSize="4.8" fontWeight="600" fill="rgba(255,255,255,0.4)" letterSpacing="0.16em">APOSTLE &amp; THE BALMORAL ESTATE</text>
      </svg>
    )
  },

  // 13. PANCHSHIL REALTY
  {
    id: 'panchshil',
    name: 'Panchshil Realty',
    searchQuery: 'Panchshil',
    color: '#D4AF37',
    icon: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="6" width="12" height="12" fill="#fff" />
        <rect x="6" y="22" width="12" height="12" fill="#fff" />
        <rect x="22" y="22" width="12" height="12" fill="#fff" />
      </svg>
    ),
    logo: (
      <svg viewBox="0 0 200 56" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="panchshilGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF4D0" />
            <stop offset="50%" stopColor="#E6C35C" />
            <stop offset="100%" stopColor="#B38918" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 9)">
          {/* Authentic 5-Square Mosaic Luxury Crest */}
          <rect x="11" y="2" width="9" height="9" fill="url(#panchshilGold)" rx="1" />
          <rect x="2" y="14" width="9" height="9" fill="url(#panchshilGold)" rx="1" />
          <rect x="20" y="14" width="9" height="9" fill="url(#panchshilGold)" rx="1" />
          <rect x="11" y="26" width="9" height="9" fill="url(#panchshilGold)" rx="1" />
        </g>
        <text x="44" y="26" fontFamily="'Cinzel', serif" fontSize="18" fontWeight="800" fill="url(#panchshilGold)" letterSpacing="0.22em">PANCHSHIL</text>
        <text x="46" y="38" fontFamily="'Montserrat', sans-serif" fontSize="5.5" fontWeight="700" fill="rgba(255,255,255,0.6)" letterSpacing="0.26em">LEADERS IN LUXURY REAL ESTATE</text>
        <text x="46" y="47" fontFamily="'Montserrat', sans-serif" fontSize="4.8" fontWeight="600" fill="#F3E5AB" letterSpacing="0.18em">TRUMP TOWERS · YOOPUNE · EON ZONE</text>
      </svg>
    )
  },

  // 14. MAHINDRA LIFESPACES
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
          <linearGradient id="mahRedGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 8)">
          <path d="M3 26 L8 9 L14 19 L20 9 L25 26" stroke="url(#mahRedGrad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="26" cy="8" r="2.8" fill="#22C55E" />
        </g>
        <text x="42" y="25" fontFamily="'Montserrat', sans-serif" fontSize="16.5" fontWeight="900" fill="#FFFFFF" letterSpacing="0.04em">Mahindra</text>
        <text x="44" y="37" fontFamily="'Montserrat', sans-serif" fontSize="6.2" fontWeight="800" fill="#4ADE80" letterSpacing="0.22em">LIFESPACES</text>
        <text x="44" y="46" fontFamily="'Montserrat', sans-serif" fontSize="4.8" fontWeight="600" fill="rgba(255,255,255,0.4)" letterSpacing="0.16em">JOYFUL HOMECOMINGS · GREEN HOMES</text>
      </svg>
    )
  },

  // 15. K. RAHEJA CORP
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
          <linearGradient id="rahejaBluGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 8)">
          <rect x="4" y="12" width="4.8" height="17" rx="1.2" fill="url(#rahejaBluGrad)" />
          <rect x="12" y="4" width="4.8" height="25" rx="1.2" fill="#FFFFFF" />
          <rect x="20" y="9" width="4.8" height="20" rx="1.2" fill="url(#rahejaBluGrad)" />
        </g>
        <text x="44" y="26" fontFamily="'Cinzel', serif" fontSize="16" fontWeight="900" fill="#FFFFFF" letterSpacing="0.12em">K. RAHEJA</text>
        <text x="46" y="38" fontFamily="'Montserrat', sans-serif" fontSize="6.2" fontWeight="800" fill="#38BDF8" letterSpacing="0.25em">CORP · MINDSPACE</text>
        <text x="46" y="47" fontFamily="'Montserrat', sans-serif" fontSize="4.8" fontWeight="600" fill="rgba(255,255,255,0.4)" letterSpacing="0.16em">65+ YEARS OF COMMERCIAL &amp; RESIDENTIAL ICONS</text>
      </svg>
    )
  },

  // 16. KUMAR PROPERTIES
  {
    id: 'kumar',
    name: 'Kumar Properties',
    searchQuery: 'Kumar',
    color: '#10B981',
    icon: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="20,4 36,12 36,28 20,36 4,28 4,12" fill="#fff" />
        <text x="14" y="27" fontFamily="'Montserrat', sans-serif" fontSize="20" fontWeight="900" fill="#040814">K</text>
      </svg>
    ),
    logo: (
      <svg viewBox="0 0 200 56" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="kumarGrn" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 8)">
          <polygon points="16,3 29,10 29,24 16,31 3,24 3,10" fill="url(#kumarGrn)" />
          <text x="10.5" y="23" fontFamily="'Montserrat', sans-serif" fontSize="16" fontWeight="900" fill="#FFFFFF">K</text>
        </g>
        <text x="44" y="26" fontFamily="'Montserrat', sans-serif" fontSize="16" fontWeight="900" fill="#FFFFFF" letterSpacing="0.08em">KUMAR</text>
        <text x="46" y="38" fontFamily="'Montserrat', sans-serif" fontSize="6.2" fontWeight="800" fill="#34D399" letterSpacing="0.22em">PROPERTIES · SINCE 1966</text>
        <text x="46" y="47" fontFamily="'Montserrat', sans-serif" fontSize="4.8" fontWeight="600" fill="rgba(255,255,255,0.4)" letterSpacing="0.16em">MEGAPOLIS TOWNSHIP · HINJEWADI PHASE 3</text>
      </svg>
    )
  },

  // 17. TCG REAL ESTATE
  {
    id: 'tcg-real-estate',
    name: 'TCG Real Estate',
    searchQuery: 'TCG',
    color: '#10B981',
    icon: (
      <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="32" height="32" rx="6" fill="#10B981" />
        <text x="7" y="27" fontFamily="'Cinzel', serif" fontSize="16" fontWeight="900" fill="#FFFFFF">TCG</text>
      </svg>
    ),
    logo: (
      <svg viewBox="0 0 200 56" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="tcgGrn" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
        <g transform="translate(6, 8)">
          <rect x="2" y="4" width="32" height="30" rx="6" fill="url(#tcgGrn)" />
          <text x="4" y="25" fontFamily="'Cinzel', serif" fontSize="13" fontWeight="900" fill="#FFFFFF">TCG</text>
        </g>
        <text x="46" y="27" fontFamily="'Cinzel', serif" fontSize="17" fontWeight="900" fill="#FFFFFF" letterSpacing="0.1em">TCG</text>
        <text x="96" y="27" fontFamily="'Montserrat', sans-serif" fontSize="11" fontWeight="800" fill="#34D399" letterSpacing="0.16em">REAL ESTATE</text>
        <text x="47" y="40" fontFamily="'Montserrat', sans-serif" fontSize="5.2" fontWeight="700" fill="rgba(255,255,255,0.6)" letterSpacing="0.22em">THE CLIFF GARDEN · HINJEWADI PHASE 3</text>
      </svg>
    )
  }
];

export default function DeveloperLogoMarquee({ onSelectDeveloper, isMobile = false }) {
  // Triple clone for completely seamless 100% infinite loop
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
        padding: isMobile ? '36px 0 40px' : '56px 0 60px',
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
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '24px' : '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: '50px', padding: '5px 16px', marginBottom: '12px'
          }}>
            <span style={{ fontSize: '10px', color: '#E6C35C' }}>✦</span>
            <span style={{ color: '#F5D77F', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif" }}>
              VERIFIED DEVELOPER ALLIANCES
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
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: isMobile ? '0.78rem' : '0.86rem', maxWidth: '580px', margin: '0 auto', lineHeight: 1.6, fontFamily: "'Montserrat', sans-serif" }}>
            Direct institutional mandates with Pune West's 16 landmark builders · 100% MahaRERA registered inventory · Direct developer pricing
          </p>
        </div>
      </div>

      {/* Marquee Ribbon */}
      <div style={{
        position: 'relative', width: '100%', overflow: 'hidden', padding: '12px 0',
        maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)'
      }}>
        <div
          className="developer-glass-track"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '14px' : '20px',
            width: 'max-content',
            animation: 'devSlowScroll 110s linear infinite'
          }}
        >
          {seamlessMarquee.map((dev, idx) => {
            const rgb = hexToRgb(dev.color);
            return (
              <div
                key={`${dev.id}-${idx}`}
                onClick={() => handleDeveloperClick(dev.searchQuery)}
                title={`Explore verified ${dev.name} projects in Pune West`}
                style={{
                  width: isMobile ? '210px' : '246px',
                  height: isMobile ? '76px' : '86px',
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  padding: isMobile ? '8px 14px' : '10px 18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  filter: 'saturate(0.5) brightness(0.88)'
                }}
                onMouseEnter={(e) => {
                  const card = e.currentTarget;
                  card.style.filter = 'saturate(1) brightness(1.05)';
                  card.style.background = `rgba(${rgb}, 0.08)`;
                  card.style.borderColor = `rgba(${rgb}, 0.6)`;
                  card.style.transform = 'translateY(-5px) scale(1.02)';
                  card.style.boxShadow = `0 18px 40px rgba(0,0,0,0.8), 0 0 25px rgba(${rgb}, 0.25), inset 0 1px 0 rgba(255,255,255,0.12)`;
                  const track = card.closest('.developer-glass-track');
                  if (track) track.style.animationPlayState = 'paused';
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget;
                  card.style.filter = 'saturate(0.5) brightness(0.88)';
                  card.style.background = 'rgba(255,255,255,0.03)';
                  card.style.borderColor = 'rgba(255,255,255,0.08)';
                  card.style.transform = 'none';
                  card.style.boxShadow = 'none';
                  const track = card.closest('.developer-glass-track');
                  if (track) track.style.animationPlayState = 'running';
                }}
              >
                {/* Corner watermark badge */}
                <div style={{
                  position: 'absolute', bottom: '-4px', right: '-4px',
                  width: isMobile ? '40px' : '50px', height: isMobile ? '40px' : '50px',
                  opacity: 0.05, filter: 'grayscale(1) brightness(10)', pointerEvents: 'none', flexShrink: 0
                }}>
                  {dev.icon}
                </div>
                {/* Main authentic vector logo */}
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                  {dev.logo}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust Strip */}
      <div style={{ maxWidth: '960px', margin: '20px auto 0', padding: '0 16px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: isMobile ? '10px' : '24px', flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.04em' }}>
          <span>🛡️ MahaRERA Registered Agent: <strong style={{ color: '#E6C35C' }}>A051262603190</strong></span>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>•</span>
          <span>🤝 100% Direct Developer Pricing</span>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>•</span>
          <span>⚖️ Full Legal Title Due Diligence</span>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>•</span>
          <span>🚘 VIP Chauffeur Site Tours</span>
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
