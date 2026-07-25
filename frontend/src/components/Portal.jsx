import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { apiService } from '../services/apiService';
import { chatWithVisitor } from '../services/geminiService';
import { 
  Search, Loader, CheckCircle, IndianRupee, Laptop, Sparkles, Activity, 
  LineChart, Car, Users, ShieldCheck, 
  Calculator, Compass, Clock, Lock, TrendingUp, Building,
  ChevronLeft, ChevronRight, MapPin, BedDouble, Phone, Calendar,
  Handshake, ArrowRight, Key, Home, Briefcase
} from 'lucide-react';
import './Portal.css';

// Import Modular Components
import PortalNavbar from '../layouts/PortalNavbar';
import PortalFooter from '../layouts/PortalFooter';
import PropertyCard from './PropertyCard';

const PropertyDetailView = lazy(() => import('./PropertyDetailView'));
const CompareOverlay = lazy(() => import('./CompareOverlay'));
const ReraDrawer = lazy(() => import('./ReraDrawer'));
const ChatWidget = lazy(() => import('./ChatWidget'));
const DataLabsView = lazy(() => import('./DataLabsView'));
import PdfBrochureModal from './PdfBrochureModal';




function PropertySkeleton() {
  return (
    <div style={{
      background: 'rgba(10, 18, 36, 0.45)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      overflow: 'hidden',
      height: '380px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div className="shimmer" style={{ height: '220px' }} />
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
        <div className="shimmer" style={{ width: '40%', height: '14px', borderRadius: '4px' }} />
        <div className="shimmer" style={{ width: '85%', height: '20px', borderRadius: '4px' }} />
        <div className="shimmer" style={{ width: '60%', height: '14px', borderRadius: '4px' }} />
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="shimmer" style={{ width: '35%', height: '20px', borderRadius: '4px' }} />
          <div className="shimmer" style={{ width: '25%', height: '20px', borderRadius: '4px' }} />
        </div>
      </div>
    </div>
  );
}

// ── Premium Railway Wake-Up Loader ─────────────────────────────────────────
// Shows while Railway backend cold-starts (typically 10-40 sec on free tier)
function RailwayWakeLoader({ elapsed }) {
  const steps = [
    { label: 'Connecting to 24K Realtors server', done: elapsed >= 2 },
    { label: 'Waking up secure data layer',        done: elapsed >= 8 },
    { label: 'Loading verified listings',           done: elapsed >= 18 },
    { label: 'Applying RERA filters',               done: elapsed >= 28 },
  ];
  const pct = Math.min(Math.round((elapsed / 35) * 100), 95);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9998,
      background: 'linear-gradient(135deg, #040814 0%, #070f1e 60%, #0a1828 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '32px',
    }}>
      {/* Logo pulse */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '18px', margin: '0 auto 20px',
          background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(184,140,28,0.05))',
          border: '1px solid rgba(212,175,55,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 40px rgba(212,175,55,0.12)',
          animation: 'pulse 2s ease-in-out infinite',
        }}>
          <span style={{ fontSize: '2.2rem' }}>🏆</span>
        </div>
        <div style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          24K Realtors
        </div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginTop: '4px' }}>
          Pune's Premium Property Portal
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: '320px', maxWidth: '85vw' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.78rem' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Loading live listings...</span>
          <span style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '4px',
            width: `${pct}%`,
            background: 'linear-gradient(90deg, var(--gold-secondary), var(--gold-primary))',
            transition: 'width 1s ease',
            boxShadow: '0 0 10px rgba(212,175,55,0.5)',
          }}/>
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '320px', maxWidth: '85vw' }}>
        {steps.map(({ label, done }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: done ? 1 : 0.3, transition: 'opacity 0.5s ease' }}>
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
              background: done ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${done ? 'rgba(212,175,55,0.6)' : 'rgba(255,255,255,0.1)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', color: done ? '#D4AF37' : 'transparent',
            }}>
              ✓
            </div>
            <span style={{ fontSize: '0.82rem', color: done ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.3)' }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
        Secure server starting up · Usually takes 15-30 seconds on first visit
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 30px rgba(212,175,55,0.12); }
          50%        { box-shadow: 0 0 60px rgba(212,175,55,0.28); }
        }
      `}</style>
    </div>
  );
}


// Reusable 60-FPS Animated Counter Component for trust stats
function AnimatedCounter({ value, duration = 2000 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value.replace(/[^0-9]/g, ''), 10);
    if (isNaN(end)) {
      setCount(value);
      return;
    }
    const suffix = value.replace(/[0-9]/g, '');
    const startTime = performance.now();

    const animateCount = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end) + suffix);
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };
    requestAnimationFrame(animateCount);
  }, [value, duration]);

  return <span>{count}</span>;
}

export default function Portal({ onViewChange }) {
  const [isHnwiMode, setIsHnwiMode] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingElapsed, setLoadingElapsed] = useState(0); // seconds elapsed during initial load
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    transactionType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    furnishingStatus: '',
    status: 'AVAILABLE',
    query: ''
  });

  const [activeCollection, setActiveCollection] = useState('ALL');
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [selectedPropertyDetail, setSelectedPropertyDetail] = useState(null);

  const [allRawProperties, setAllRawProperties] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const saved = localStorage.getItem('wishlist_properties');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleToggleWishlist = async (property) => {
    const isAdding = !wishlistIds.includes(property.id);
    setWishlistIds(prev => {
      const updated = prev.includes(property.id)
        ? prev.filter(id => id !== property.id)
        : [...prev, property.id];
      localStorage.setItem('wishlist_properties', JSON.stringify(updated));
      return updated;
    });

    try {
      if (isAdding) {
        await apiService.addToWishlist(property.id);
      } else {
        await apiService.removeFromWishlist(property.id);
      }
    } catch (err) {
      console.error('Failed to sync wishlist with backend:', err);
    }
  };

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    requirementType: 'BUY',
    budgetMin: '',
    budgetMax: '',
    preferredLocation: '',
    notes: ''
  });
  
  const [submitLoading, setSubmitLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [selectedBrochureProperty, setSelectedBrochureProperty] = useState(null);

  const [exclusiveTab, setExclusiveTab] = useState('BUY');
  const [showAllGrid, setShowAllGrid] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [viewMode, setViewMode] = useState('GRID'); // GRID | MAP
  const [hoveredPropertyLoc, setHoveredPropertyLoc] = useState(null);
  const [hoveredMapNode, setHoveredMapNode] = useState(null);
  const [mapSource, setMapSource] = useState('GOOGLE'); // GOOGLE | VECTOR
  const [googleMapType, setGoogleMapType] = useState('m'); // m = Roadmap, k = Satellite
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiStep, setAiStep] = useState(1);
  const [advisoryTab, setAdvisoryTab] = useState('buyer');
  const [activeSection, setActiveSection] = useState(() => {
    try {
      const hash = window.location.hash.replace('#', '');
      if (['listings', 'market-intelligence', 'properties-sale', 'properties-rent', 'saved-properties'].includes(hash)) {
        return hash;
      }
      return sessionStorage.getItem('24k_active_section') || 'listings';
    } catch {
      return 'listings';
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('24k_active_section', activeSection);
    } catch (e) {}
  }, [activeSection]);
  const [heroSearchText, setHeroSearchText] = useState('');
  const [heroTab, setHeroTab] = useState('BUY');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchPropType, setSearchPropType] = useState('');
  const [searchBudget, setSearchBudget] = useState('');
  const [searchBHK, setSearchBHK] = useState('');
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem('recent_searches') || '[]'); } catch { return []; }
  });
  const [searchFocused, setSearchFocused] = useState(false);
  const [smartChips, setSmartChips] = useState([]);
  const [activeSubView, setActiveSubView] = useState(null);
  const [societies, setSocieties] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [directoriesLoading, setDirectoriesLoading] = useState(false);
  const [selectedSocietyDetail, setSelectedSocietyDetail] = useState(null);
  const [selectedBuilderDetail, setSelectedBuilderDetail] = useState(null);
  const [selectedLocalityDetail, setSelectedLocalityDetail] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [selectedBlogDetail, setSelectedBlogDetail] = useState(null);

  useEffect(() => {
    setSelectedSocietyDetail(null);
    setSelectedBuilderDetail(null);
    setSelectedLocalityDetail(null);
    setSelectedBlogDetail(null);
  }, [activeSection]);

  // ── SPA History & Hash Listener for Property Details (Browser Back ← / Forward →) ──
  useEffect(() => {
    const handlePortalHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('property/')) {
        const propId = hash.replace('property/', '');
        if (allRawProperties && allRawProperties.length > 0) {
          const found = allRawProperties.find(p => String(p.id) === String(propId));
          if (found) {
            setSelectedPropertyDetail(found);
            window.scrollTo(0, 0);
          }
        }
      } else if (hash === 'portal' || hash === '' || hash === 'listings') {
        setSelectedPropertyDetail(null);
      }
    };

    window.addEventListener('hashchange', handlePortalHashChange);
    window.addEventListener('popstate', handlePortalHashChange);

    if (allRawProperties && allRawProperties.length > 0) {
      handlePortalHashChange();
    }

    return () => {
      window.removeEventListener('hashchange', handlePortalHashChange);
      window.removeEventListener('popstate', handlePortalHashChange);
    };
  }, [allRawProperties]);

  // Spotlight Keyboard Shortcut & Natural Query Parser
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSpotlightOpen(prev => !prev);
        setSpotlightIndex(0);
      }
      if (e.key === 'Escape') {
        setIsSpotlightOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  const parseNaturalQuery = (queryStr) => {
    const q = queryStr.toLowerCase().trim();
    let parsedFilters = {
      location: '',
      propertyType: '',
      transactionType: '',
      bedrooms: '',
      maxPrice: '',
      query: ''
    };

    // Parse location
    const locations = {
      'baner': 'BANER',
      'hinjewadi': 'HINJEWADI',
      'wakad': 'WAKAD',
      'balewadi': 'BALEWADI',
      'tathawade': 'TATHAWADE',
      'mahalunge': 'MAHALUNGE'
    };
    for (const [key, val] of Object.entries(locations)) {
      if (q.includes(key)) {
        parsedFilters.location = val;
      }
    }

    // Parse BHK/Bedrooms
    if (q.includes('1 bhk') || q.includes('1bhk')) parsedFilters.bedrooms = '1';
    else if (q.includes('2 bhk') || q.includes('2bhk')) parsedFilters.bedrooms = '2';
    else if (q.includes('3 bhk') || q.includes('3bhk')) parsedFilters.bedrooms = '3';
    else if (q.includes('4 bhk') || q.includes('4bhk') || q.includes('villa') || q.includes('penthouse')) parsedFilters.bedrooms = '4';

    // Parse propertyType
    if (q.includes('commercial') || q.includes('office') || q.includes('shop') || q.includes('workspace') || q.includes('showroom')) {
      parsedFilters.propertyType = 'COMMERCIAL';
    } else if (q.includes('apartment') || q.includes('flat') || q.includes('residence') || q.includes('home') || q.includes('villa') || q.includes('penthouse')) {
      parsedFilters.propertyType = 'RESIDENTIAL';
    }

    // Parse transactionType
    if (q.includes('rent') || q.includes('lease')) {
      parsedFilters.transactionType = 'RENT';
    } else if (q.includes('buy') || q.includes('purchase') || q.includes('sale') || q.includes('sell')) {
      parsedFilters.transactionType = 'BUY';
    }

    // Parse price
    const crMatch = q.match(/(?:under|below|max|upto)?\s*(\d+(?:\.\d+)?)\s*(?:cr|crore)/);
    if (crMatch) {
      parsedFilters.maxPrice = String(parseFloat(crMatch[1]) * 10000000);
    } else {
      const lMatch = q.match(/(?:under|below|max|upto)?\s*(\d+(?:\.\d+)?)\s*(?:l|lakh|lakhs)/);
      if (lMatch) {
        parsedFilters.maxPrice = String(parseFloat(lMatch[1]) * 100000);
      }
    }

    // If nothing structural is matched but there is query text, set it as keyword search
    if (!parsedFilters.location && !parsedFilters.bedrooms && !parsedFilters.propertyType && !parsedFilters.transactionType && !parsedFilters.maxPrice) {
      parsedFilters.query = queryStr;
    }

    return parsedFilters;
  };

  const [sellerForm, setSellerForm] = useState({
    name: '',
    phone: '',
    email: '',
    propertyTitle: '',
    location: 'HINJEWADI',
    expectedPrice: '',
    description: ''
  });

  const [vipForm, setVipForm] = useState({ name: '', phone: '' });
  const [vipSubmitting, setVipSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);


  const [isChatWidgetOpen, setIsChatWidgetOpen] = useState(false);

  const getAmenityIcon = (name) => {
    const lowercase = name.toLowerCase();
    if (lowercase.includes('club') || lowercase.includes('hall') || lowercase.includes('lounge')) return <Users size={12} color="var(--gold-primary)" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }} />;
    if (lowercase.includes('gym') || lowercase.includes('fitness') || lowercase.includes('health') || lowercase.includes('sports')) return <Activity size={12} color="var(--gold-primary)" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }} />;
    if (lowercase.includes('pool') || lowercase.includes('swim') || lowercase.includes('water')) return <Activity size={12} color="var(--gold-primary)" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }} />;
    if (lowercase.includes('security') || lowercase.includes('cctv') || lowercase.includes('guard')) return <ShieldCheck size={12} color="var(--gold-primary)" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }} />;
    if (lowercase.includes('garden') || lowercase.includes('park') || lowercase.includes('lawn') || lowercase.includes('green') || lowercase.includes('play')) return <Compass size={12} color="var(--gold-primary)" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }} />;
    if (lowercase.includes('gas') || lowercase.includes('pipe')) return <TrendingUp size={12} color="var(--gold-primary)" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }} />;
    return <Sparkles size={12} color="var(--gold-primary)" style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }} />;
  };

  const renderScoreCircle = (label, score, maxScore = 10, color = 'var(--gold-primary)') => {
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const value = parseFloat(score || 8.0);
    const strokeDashoffset = circumference - (value / maxScore) * circumference;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-muted)', textAlign: 'center', flex: 1, minWidth: '100px' }}>
        <svg width="50" height="50" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
          <circle 
            cx="25" cy="25" r={radius} 
            fill="none" 
            stroke={color} 
            strokeWidth="3" 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="progress-ring-circle"
          />
          <text x="25" y="29" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
            {score}
          </text>
        </svg>
        <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
      </div>
    );
  };
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Welcome to 24K Realtors. How can we assist you with Wakad or Baner properties today?' }
  ]);

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [closedProperties, setClosedProperties] = useState([]);
  const [closedLoading, setClosedLoading] = useState(true);

  const [isChauffeurModalOpen, setIsChauffeurModalOpen] = useState(false);
  const [selectedChauffeurProp, setSelectedChauffeurProp] = useState(null);
  const [chauffeurForm, setChauffeurForm] = useState({
    name: '',
    phone: '',
    email: '',
    visitDate: '',
    timeSlot: 'MORNING',
    pickupAddress: '',
    includeExecutiveChauffeur: true
  });
  const [chauffeurSubmitting, setChauffeurSubmitting] = useState(false);

  const [isReraDrawerOpen, setIsReraDrawerOpen] = useState(false);
  const [selectedReraProperty, setSelectedReraProperty] = useState(null);

  const [appreciationYears, setAppreciationYears] = useState(5);
  const [mortgageDetails, setMortgageDetails] = useState({
    downPaymentPercent: 20,
    interestRate: 8.5,
    loanTermYears: 20,
    monthlyEMI: 0
  });

  const [stats, setStats] = useState({ inventory: 0, verified: 0, families: 0 });

  const [aiBudget, setAiBudget] = useState('80L-1.5Cr');
  const [aiPriority, setAiPriority] = useState('appreciation');
  const [aiCorridor, setAiCorridor] = useState('all');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiReport, setAiReport] = useState(null);

  useEffect(() => {
    let invInterval = setInterval(() => {
      setStats(prev => {
        if (prev.inventory >= 800) {
          clearInterval(invInterval);
          return prev;
        }
        return { ...prev, inventory: Math.min(800, prev.inventory + 40) };
      });
    }, 50);

    let verInterval = setInterval(() => {
      setStats(prev => {
        if (prev.verified >= 100) {
          clearInterval(verInterval);
          return prev;
        }
        return { ...prev, verified: Math.min(100, prev.verified + 5) };
      });
    }, 50);

    let famInterval = setInterval(() => {
      setStats(prev => {
        if (prev.families >= 150) {
          clearInterval(famInterval);
          return prev;
        }
        return { ...prev, families: Math.min(150, prev.families + 10) };
      });
    }, 50);

    return () => {
      clearInterval(invInterval);
      clearInterval(verInterval);
      clearInterval(famInterval);
    };
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  useEffect(() => {
    const fetchClosedProperties = async () => {
      setClosedLoading(true);
      try {
        const soldData = await apiService.getProperties({ status: 'SOLD' }, 0, 4);
        const rentedData = await apiService.getProperties({ status: 'RENTED' }, 0, 4);
        setClosedProperties([...(soldData.content || []), ...(rentedData.content || [])]);
      } catch (err) {
        console.error("Failed to load closed properties:", err);
      } finally {
        setClosedLoading(false);
      }
    };

    const fetchDirectories = async () => {
      setDirectoriesLoading(true);
      try {
        const socs = await apiService.getSocieties(0, 100);
        setSocieties(socs.content || []);
        const blds = await apiService.getBuilders();
        setBuilders(blds || []);
        const locs = await apiService.getLocalities();
        setLocalities(locs || []);
        const blgs = await apiService.getBlogs(0, 100);
        setBlogs(blgs.content || []);
      } catch (err) {
        console.error("Failed to load directories:", err);
      } finally {
        setDirectoriesLoading(false);
      }
    };

    fetchClosedProperties();
    fetchDirectories();
  }, []);

  // Intersection Observer Scroll-Triggered reveals (Phase 2)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal-mask, .reveal-fade-up').forEach(el => {
        el.classList.add('active');
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Trigger once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    const elements = document.querySelectorAll('.reveal-mask, .reveal-fade-up');
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
      observer.disconnect();
    };
  }, [properties]);



  // Interactive 3D Canvas Particle Grid for Hero Section
  useEffect(() => {
    const canvas = document.getElementById('hero-particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles = [];
    const particleCount = 65;
    const connectionDistance = 110;
    const mouse = { x: null, y: null, radius: 120 };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * force * 1.5;
            this.y += Math.sin(angle) * force * 1.5;
          }
        }
      }

      draw() {
        const isLight = document.documentElement.classList.contains('light-theme');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isLight ? 'rgba(154, 123, 28, 0.7)' : 'rgba(212, 175, 55, 0.45)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    const parentSection = canvas.closest('.portal-hero');
    if (parentSection) {
      parentSection.addEventListener('mousemove', handleMouseMove);
      parentSection.addEventListener('mouseleave', handleMouseLeave);
    }

    const drawGrid = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const isLight = document.documentElement.classList.contains('light-theme');
            const alpha = (1 - dist / connectionDistance) * (isLight ? 0.32 : 0.18);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isLight ? `rgba(154, 123, 28, ${alpha})` : `rgba(212, 175, 55, ${alpha})`;
            ctx.lineWidth = isLight ? 0.9 : 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(drawGrid);
    };

    drawGrid();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (parentSection) {
        parentSection.removeEventListener('mousemove', handleMouseMove);
        parentSection.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Redesigned with premium sunset luxury property image background instead of canvas models.

  useEffect(() => {
    // ── Elapsed timer: show premium loader if Railway takes long to respond ──
    const startTime = Date.now();
    const ticker = setInterval(() => {
      const sec = Math.floor((Date.now() - startTime) / 1000);
      setLoadingElapsed(sec);
    }, 1000);

    const loadRawProperties = async () => {
      try {
        const data = await apiService.getProperties({}, 0, 100);
        setAllRawProperties(data.content || []);
      } catch (err) {
        console.error("Error loading raw properties for carousels:", err);
      } finally {
        clearInterval(ticker);
        setLoadingElapsed(0);
      }
    };
    const syncWishlist = async () => {
      try {
        const serverWishlist = await apiService.getWishlist();
        if (serverWishlist && Array.isArray(serverWishlist)) {
          const serverIds = serverWishlist.map(p => p.id);
          setWishlistIds(serverIds);
          localStorage.setItem('wishlist_properties', JSON.stringify(serverIds));
        }
      } catch (err) {
        console.error("Failed to sync wishlist with server on mount:", err);
      }
    };

    loadRawProperties();
    syncWishlist();
  }, []);

  useEffect(() => {
    if (selectedPropertyDetail) {
      document.title = `${selectedPropertyDetail.title} | ${selectedPropertyDetail.bedrooms} BHK Luxury Home in ${selectedPropertyDetail.location} | 24K Realtors`;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', `Explore ${selectedPropertyDetail.title} in ${selectedPropertyDetail.location} Corridor, Pune. Features: ${selectedPropertyDetail.bedrooms} BHK, ${selectedPropertyDetail.areaSquareFeet} sqft carpet, MahaRERA: ${selectedPropertyDetail.reraNumber}. Exclusive listings by 24K Realtors.`);
    } else {
      document.title = isHnwiMode 
        ? "HNWI Private Portfolios & Institutional Mandates | 24K Realtors Pune"
        : "24K Realtors | Premium Luxury Real Estate Pune | Hinjewadi, Wakad & Baner";
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', "Discover premium residential apartments, penthouses, commercial assets, and HNWI exclusive mandates in Hinjewadi, Wakad, Baner, Pune West. 100% verified listings.");
    }
  }, [selectedPropertyDetail, isHnwiMode]);

  const fetchProperties = useCallback(async () => {
    setError(null);
    try {
      let queryFilters = { ...filters };
      
      if (activeCollection === 'WISHLIST') {
        const saved = allRawProperties.filter(p => wishlistIds.includes(p.id));
        setProperties(saved);
        setTotalPages(1);
        setTotalElements(saved.length);
        setLoading(false);
        return;
      }
      
      if (activeCollection === 'NEW') {
        const newLaunches = allRawProperties.filter(p => 
          p.id === 'prop-21' || 
          p.id === 'prop-22' || 
          p.id === 21 ||
          p.id === 22 ||
          (p.title && (
            p.title.toLowerCase().includes('ivara') || 
            p.title.toLowerCase().includes('vyomora') ||
            p.title.toLowerCase().includes('joyville') ||
            p.title.toLowerCase().includes('shapoorji') ||
            p.title.toLowerCase().includes('elements')
          ))
        );
        setProperties(newLaunches);
        setTotalPages(1);
        setTotalElements(newLaunches.length);
        setLoading(false);
        return;
      }

      if (activeCollection === 'APARTMENT') {
        queryFilters.propertyType = 'RESIDENTIAL';
      } else if (activeCollection === 'VILLA') {
        queryFilters.bedrooms = '4';
      } else if (activeCollection === 'PENTHOUSE') {
        queryFilters.bedrooms = '4';
        queryFilters.propertyType = 'RESIDENTIAL';
      } else if (activeCollection === 'COMMERCIAL') {
        queryFilters.propertyType = 'COMMERCIAL';
      } else if (activeCollection === 'READY') {
        queryFilters.propertyType = 'RESIDENTIAL';
        queryFilters.transactionType = 'BUY';
      } else if (activeCollection === 'SKY_PENTHOUSE') {
        queryFilters.bedrooms = '4';
        queryFilters.propertyType = 'RESIDENTIAL';
      } else if (activeCollection === 'TECH_OFFICE') {
        queryFilters.propertyType = 'COMMERCIAL';
      } else if (activeCollection === 'READY_TO_MOVE') {
        queryFilters.propertyType = 'RESIDENTIAL';
        queryFilters.transactionType = 'BUY';
      } else if (activeCollection === 'RENT') {
        queryFilters.transactionType = 'RENT';
      } else if (activeCollection === 'HINJEWADI_RENTALS') {
        queryFilters.location = 'HINJEWADI';
        queryFilters.transactionType = 'RENT';
      }

      const data = await apiService.getProperties(queryFilters, page, 12);
      if (page === 0) {
        setProperties(data.content || []);
      } else {
        setProperties(prev => {
          const newItems = data.content || [];
          const existingIds = new Set(prev.map(p => p.id));
          return [...prev, ...newItems.filter(p => !existingIds.has(p.id))];
        });
      }
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error(err);
      setError('Could not load properties. Please check if the Spring Boot server is running.');
    } finally {
      setLoading(false);
    }
  }, [filters, activeCollection, page, allRawProperties, wishlistIds]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Smooth Infinite Scroll Trigger Hook
  useEffect(() => {
    if (loading || page >= totalPages - 1) return;
    const trigger = document.getElementById('infinite-scroll-trigger');
    if (!trigger) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    }, { threshold: 0.1 });

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [loading, page, totalPages]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [filters]);

  const isSearchActive = !!(
    filters.location ||
    filters.propertyType ||
    filters.transactionType ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.bedrooms ||
    filters.furnishingStatus ||
    filters.query ||
    heroSearchText
  );

  const handleCarouselScroll = (index, direction) => {
    const track = document.getElementById(`carousel-track-${index}`);
    if (track) {
      const scrollAmount = track.clientWidth * 0.75;
      track.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const renderInteractiveVectorMap = () => {
    const mapNodes = [
      { id: 'BANER', name: 'Baner', x: 380, y: 350, price: '11.5K', growth: '+16%', yield: '3.8%', tag: 'Established', query: 'Baner, Pune, Maharashtra' },
      { id: 'BALEWADI', name: 'Balewadi', x: 340, y: 280, price: '10.2K', growth: '+13%', yield: '4.0%', tag: 'Premium', query: 'Balewadi High Street, Pune, Maharashtra' },
      { id: 'WAKAD', name: 'Wakad', x: 230, y: 200, price: '8.2K', growth: '+14%', yield: '4.5%', tag: 'High Growth', query: 'Wakad, Pune, Maharashtra' },
      { id: 'TATHAWADE', name: 'Tathawade', x: 120, y: 130, price: '7.2K', growth: '+15%', yield: '4.8%', tag: 'Emerging', query: 'Tathawade, Pune, Maharashtra' },
      { id: 'HINJEWADI', name: 'Hinjewadi', x: 100, y: 320, price: '7.8K', growth: '+11%', yield: '5.2%', tag: 'IT Hub', query: 'Hinjewadi Phase 1, Pune, Maharashtra' },
      { id: 'MAHALUNGE', name: 'Mahalunge', x: 200, y: 360, price: '6.9K', growth: '+18%', yield: '5.5%', tag: 'Best Value', query: 'Mahalunge, Pune, Maharashtra' },
      { id: 'KHARADI', name: 'Kharadi', x: 430, y: 160, price: '9.8K', growth: '+12%', yield: '4.2%', tag: 'EON IT Park', query: 'Kharadi, Pune, Maharashtra' },
    ];

    const connections = [
      ['TATHAWADE', 'WAKAD'], ['WAKAD', 'BALEWADI'], ['BALEWADI', 'BANER'],
      ['HINJEWADI', 'WAKAD'], ['MAHALUNGE', 'HINJEWADI'], ['MAHALUNGE', 'WAKAD'],
      ['KHARADI', 'BANER'],
    ];

    const activeNode = hoveredPropertyLoc || hoveredMapNode;
    const activeFilter = filters.location;

    // Determine target location for Google Map query
    const targetLocObj = mapNodes.find(n => n.id === (activeFilter || activeNode));
    const activeLocName = targetLocObj ? targetLocObj.name : 'Pune West';
    const googleMapQueryStr = encodeURIComponent(
      targetLocObj ? targetLocObj.query : 'Hinjewadi, Baner, Wakad, Pune, Maharashtra'
    );
    const googleMapEmbedUrl = `https://maps.google.com/maps?q=${googleMapQueryStr}&t=${googleMapType}&z=13&ie=UTF8&iwloc=&output=embed`;
    const googleMapDirectUrl = `https://www.google.com/maps/search/?api=1&query=${googleMapQueryStr}`;

    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', fontFamily: "'Montserrat', sans-serif" }}>
        {/* Header with Mode Switchers */}
        <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(197,168,128,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', background: 'rgba(4,8,20,0.92)', backdropFilter: 'blur(10px)', flexShrink: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4285F4', boxShadow: '0 0 8px #4285F4' }} />
            <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#E6C35C', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              📍 {activeLocName} · Google Map Search
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Map Source Switcher: Google Maps vs SVG Radar */}
            <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(197,168,128,0.2)', borderRadius: '30px', padding: '2px' }}>
              <button
                type="button"
                onClick={() => setMapSource('GOOGLE')}
                style={{
                  background: mapSource === 'GOOGLE' ? 'linear-gradient(135deg, #4285F4, #34A853)' : 'transparent',
                  border: 'none',
                  color: mapSource === 'GOOGLE' ? '#fff' : 'rgba(255,255,255,0.5)',
                  padding: '3px 10px',
                  borderRadius: '30px',
                  fontSize: '0.58rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                🗺️ Google Maps
              </button>
              <button
                type="button"
                onClick={() => setMapSource('VECTOR')}
                style={{
                  background: mapSource === 'VECTOR' ? 'linear-gradient(135deg, #E6C35C, #C59B27)' : 'transparent',
                  border: 'none',
                  color: mapSource === 'VECTOR' ? '#040814' : 'rgba(255,255,255,0.5)',
                  padding: '3px 10px',
                  borderRadius: '30px',
                  fontSize: '0.58rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                📡 Vector Radar
              </button>
            </div>

            {/* Satellite vs Roadmap button when Google Maps is active */}
            {mapSource === 'GOOGLE' && (
              <button
                type="button"
                onClick={() => setGoogleMapType(prev => prev === 'm' ? 'k' : 'm')}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#E6C35C',
                  padding: '3px 9px',
                  borderRadius: '6px',
                  fontSize: '0.58rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                title="Toggle Satellite / Map view"
              >
                {googleMapType === 'm' ? '🛰️ Satellite' : '🗺️ Map View'}
              </button>
            )}

            {/* Open Direct Google Maps */}
            <a
              href={googleMapDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.58rem',
                color: 'rgba(255,255,255,0.7)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '6px',
                padding: '3px 8px',
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              ↗️ Google
            </a>
          </div>
        </div>

        {/* Locality Quick Pills Selector Bar */}
        <div style={{ padding: '6px 12px', background: 'rgba(7,15,30,0.95)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0, zIndex: 5 }}>
          {mapNodes.map(node => {
            const isSelected = activeFilter === node.id || activeNode === node.id;
            const count = allRawProperties.filter(p => p.location === node.id).length;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => {
                  setFilters(prev => ({ ...prev, location: activeFilter === node.id ? '' : node.id }));
                  setPage(0);
                }}
                onMouseEnter={() => setHoveredMapNode(node.id)}
                onMouseLeave={() => setHoveredMapNode(null)}
                style={{
                  background: isSelected ? 'linear-gradient(135deg, rgba(230,195,92,0.25), rgba(212,175,55,0.12))' : 'rgba(255,255,255,0.03)',
                  border: isSelected ? '1px solid #E6C35C' : '1px solid rgba(255,255,255,0.08)',
                  color: isSelected ? '#E6C35C' : 'rgba(255,255,255,0.6)',
                  padding: '3px 9px',
                  borderRadius: '20px',
                  fontSize: '0.6rem',
                  fontWeight: isSelected ? 800 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>📍 {node.name}</span>
                <span style={{ fontSize: '0.55rem', opacity: 0.7 }}>({count})</span>
              </button>
            );
          })}
        </div>

        {/* Main Map Render: GOOGLE vs VECTOR */}
        <div style={{ flex: 1, position: 'relative', background: '#02060f', overflow: 'hidden', minHeight: 0 }}>
          {mapSource === 'GOOGLE' ? (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <iframe
                title="Google Maps Pune West Real Estate Radar"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
                loading="lazy"
                allowFullScreen
                src={googleMapEmbedUrl}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(4,8,20,0.85)',
                border: '1px solid rgba(230,195,92,0.25)',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '0.6rem',
                color: '#E6C35C',
                fontWeight: 700,
                pointerEvents: 'none',
                boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)'
              }}>
                ⚡ Live Google Maps Engine Active
              </div>
            </div>
          ) : (
            <svg viewBox="0 0 500 460" style={{ width: '100%', height: '100%' }}>
              <defs>
                <pattern id="mapgrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.018)" strokeWidth="0.8" />
                </pattern>
                <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#071226" />
                  <stop offset="100%" stopColor="#02060f" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="softglow">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              <rect width="100%" height="100%" fill="url(#bgGrad)" />
              <rect width="100%" height="100%" fill="url(#mapgrid)" />

              {/* Terrain watermark */}
              <text x="250" y="240" textAnchor="middle" fill="rgba(197,168,128,0.03)" fontSize="80" fontWeight="900" fontFamily="'Montserrat',sans-serif" style={{ userSelect: 'none' }}>PUNE</text>

              {/* Grid labels */}
              <text x="445" y="16" fill="rgba(255,255,255,0.07)" fontSize="7" fontFamily="monospace">SEC_E</text>
              <text x="8" y="452" fill="rgba(255,255,255,0.07)" fontSize="7" fontFamily="monospace">SEC_W</text>
              <text x="8" y="16" fill="rgba(255,255,255,0.07)" fontSize="7" fontFamily="monospace">SEC_NW</text>

              {/* Corridor connection lines */}
              {connections.map(([fromId, toId]) => {
                const from = mapNodes.find(n => n.id === fromId);
                const to = mapNodes.find(n => n.id === toId);
                if (!from || !to) return null;
                const isHighlighted = activeFilter === fromId || activeFilter === toId || activeNode === fromId || activeNode === toId;
                return (
                  <line
                    key={`${fromId}-${toId}`}
                    x1={from.x} y1={from.y}
                    x2={to.x} y2={to.y}
                    stroke={isHighlighted ? 'rgba(230,195,92,0.55)' : 'rgba(197,168,128,0.1)'}
                    strokeWidth={isHighlighted ? '2' : '1.2'}
                    strokeDasharray={isHighlighted ? 'none' : '5,4'}
                    style={{ transition: 'all 0.35s ease' }}
                  />
                );
              })}

              {/* Map Nodes */}
              {mapNodes.map((node) => {
                const isActive = activeFilter === node.id;
                const isHovered = activeNode === node.id;
                const isLit = isActive || isHovered;
                const nodeCount = allRawProperties.filter(p => p.location === node.id).length;

                return (
                  <g
                    key={node.id}
                    onClick={() => {
                      setFilters(prev => ({ ...prev, location: isActive ? '' : node.id }));
                      setPage(0);
                    }}
                    onMouseEnter={() => setHoveredMapNode(node.id)}
                    onMouseLeave={() => setHoveredMapNode(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Outer pulse rings */}
                    {isLit && (
                      <>
                        <circle cx={node.x} cy={node.y} r="28" fill="none"
                          stroke={isActive ? 'rgba(230,195,92,0.3)' : 'rgba(230,195,92,0.18)'}
                          strokeWidth="1"
                          style={{ animation: 'mapPulse 2s ease-in-out infinite', transformOrigin: `${node.x}px ${node.y}px` }} />
                        <circle cx={node.x} cy={node.y} r="40" fill="none"
                          stroke={isActive ? 'rgba(230,195,92,0.12)' : 'rgba(230,195,92,0.07)'}
                          strokeWidth="0.8"
                          style={{ animation: 'mapPulse2 2.8s ease-in-out infinite', transformOrigin: `${node.x}px ${node.y}px` }} />
                      </>
                    )}

                    {/* Halo fill */}
                    <circle
                      cx={node.x} cy={node.y}
                      r={isLit ? 20 : 13}
                      fill={isLit ? 'rgba(230,195,92,0.07)' : 'rgba(7,15,30,0.6)'}
                      stroke={isLit ? 'rgba(230,195,92,0.55)' : 'rgba(197,168,128,0.22)'}
                      strokeWidth="1.5"
                      strokeDasharray={isLit ? 'none' : '4,3'}
                      style={{ transition: 'all 0.3s ease' }}
                      filter={isLit ? 'url(#softglow)' : 'none'}
                    />

                    {/* Center dot */}
                    <circle
                      cx={node.x} cy={node.y}
                      r={isLit ? 7 : 4.5}
                      fill={isLit ? '#E6C35C' : 'rgba(7,15,30,0.9)'}
                      stroke={isLit ? 'none' : '#C5A880'}
                      strokeWidth="1.8"
                      style={{ transition: 'all 0.3s ease' }}
                      filter={isLit ? 'url(#glow)' : 'none'}
                    />
                    {isLit && <circle cx={node.x} cy={node.y} r="3" fill="#040814" />}

                    {/* Location name */}
                    <text
                      x={node.x} y={node.y - (isLit ? 27 : 19)}
                      textAnchor="middle"
                      fill={isLit ? '#E6C35C' : '#7a90a4'}
                      fontSize={isLit ? '10' : '8.5'}
                      fontWeight={isLit ? '800' : '600'}
                      fontFamily="'Montserrat', sans-serif"
                      style={{ transition: 'all 0.3s ease' }}
                    >
                      {node.name.toUpperCase()}
                    </text>

                    {/* Listing count */}
                    {nodeCount > 0 && (
                      <text
                        x={node.x} y={node.y - (isLit ? 17 : 11)}
                        textAnchor="middle"
                        fill={isLit ? 'rgba(230,195,92,0.85)' : 'rgba(197,168,128,0.45)'}
                        fontSize="7"
                        fontFamily="'Montserrat', sans-serif"
                        fontWeight="700"
                        style={{ transition: 'all 0.3s ease' }}
                      >
                        {nodeCount} listing{nodeCount !== 1 ? 's' : ''}
                      </text>
                    )}

                    {/* Price + growth below node */}
                    <text
                      x={node.x} y={node.y + (isLit ? 24 : 19)}
                      textAnchor="middle"
                      fill="rgba(197,168,128,0.55)"
                      fontSize="7"
                      fontFamily="monospace"
                      style={{ opacity: isLit ? 1 : 0.45, transition: 'all 0.25s ease' }}
                    >
                      ₹{node.price}/sqft · {node.growth}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}

          {/* Floating tooltip for hovered map node in Vector mode */}
          {mapSource === 'VECTOR' && hoveredMapNode && (() => {
            const node = mapNodes.find(n => n.id === hoveredMapNode);
            if (!node) return null;
            const count = allRawProperties.filter(p => p.location === node.id).length;
            const tooltipRight = node.x < 320;
            return (
              <div style={{
                position: 'absolute',
                top: `${(node.y / 460) * 100}%`,
                ...(tooltipRight
                  ? { left: `calc(${(node.x / 500) * 100}% + 28px)` }
                  : { right: `calc(${(1 - node.x / 500) * 100}% + 28px)` }),
                transform: 'translateY(-50%)',
                background: 'rgba(4,8,20,0.97)',
                border: '1px solid rgba(230,195,92,0.3)',
                borderRadius: '10px',
                padding: '11px 14px',
                minWidth: '158px',
                pointerEvents: 'none',
                zIndex: 20,
                boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
                backdropFilter: 'blur(16px)',
              }}>
                <div style={{ fontSize: '0.58rem', color: 'rgba(230,195,92,0.55)', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '3px', textTransform: 'uppercase' }}>{node.tag}</div>
                <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 800, marginBottom: '8px' }}>{node.name}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px 10px' }}>
                  {[
                    { label: 'Avg Price', val: `₹${node.price}/sqft`, color: '#E6C35C' },
                    { label: '5-Yr Growth', val: node.growth, color: '#22c55e' },
                    { label: 'Rental Yield', val: node.yield, color: '#60a5fa' },
                    { label: 'Listings', val: `${count} active`, color: '#e2e8f0' },
                  ].map(({ label, val, color }) => (
                    <div key={label}>
                      <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)', marginBottom: '2px' }}>{label}</div>
                      <div style={{ fontSize: '0.72rem', color, fontWeight: 700 }}>{val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '9px', padding: '5px 8px', background: 'rgba(230,195,92,0.07)', border: '1px solid rgba(230,195,92,0.18)', borderRadius: '6px', fontSize: '0.6rem', color: 'rgba(230,195,92,0.75)', fontWeight: 700, textAlign: 'center', letterSpacing: '0.04em' }}>
                  Click pin to filter listings →
                </div>
              </div>
            );
          })()}
        </div>

        {/* Bottom live corridor stats bar */}
        {activeNode ? (() => {
          const node = mapNodes.find(n => n.id === activeNode);
          if (!node) return null;
          const count = allRawProperties.filter(p => p.location === node.id).length;
          const prices = allRawProperties.filter(p => p.location === node.id && p.price);
          const minPrice = prices.length > 0 ? Math.min(...prices.map(p => Number(p.price))) : null;
          return (
            <div style={{ flexShrink: 0, borderTop: '1px solid rgba(197,168,128,0.1)', background: 'rgba(4,8,20,0.95)', padding: '9px 14px', display: 'flex', gap: '14px', alignItems: 'center', overflowX: 'auto', scrollbarWidth: 'none' }}>
              <div style={{ flexShrink: 0 }}>
                <div style={{ fontSize: '0.58rem', color: 'rgba(230,195,92,0.65)', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1px' }}>📍 {node.name}</div>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)' }}>{node.tag}</div>
              </div>
              <div style={{ width: '1px', height: '26px', background: 'rgba(197,168,128,0.12)', flexShrink: 0 }} />
              {[
                { label: 'Avg Price', value: `₹${node.price}/sqft`, color: '#E6C35C' },
                { label: '5-Yr Growth', value: node.growth, color: '#22c55e' },
                { label: 'Rental Yield', value: node.yield, color: '#60a5fa' },
                { label: 'Active', value: `${count}`, color: '#fff' },
                ...(minPrice ? [{ label: 'From', value: formatPrice(minPrice), color: 'rgba(255,255,255,0.6)' }] : []),
              ].map(({ label, value, color }) => (
                <div key={label} style={{ flexShrink: 0, textAlign: 'center', minWidth: '58px' }}>
                  <div style={{ fontSize: '0.56rem', color: 'rgba(255,255,255,0.3)', marginBottom: '2px', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                  <div style={{ fontSize: '0.72rem', color, fontWeight: 700, whiteSpace: 'nowrap' }}>{value}</div>
                </div>
              ))}
            </div>
          );
        })() : (
          <div style={{ flexShrink: 0, borderTop: '1px solid rgba(197,168,128,0.08)', background: 'rgba(4,8,20,0.9)', padding: '9px 14px' }}>
            <span style={{ fontSize: '0.6rem', color: 'rgba(197,168,128,0.35)', fontWeight: 600 }}>
              💡 Select a locality chip or hover a property card to auto-center Google Maps
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderCuratedCarousels = () => {
    // Show all verified/exclusive properties directly — no sub-tabs
    const displayData = allRawProperties.filter(p => p.exclusiveDeal || p.verifiedListing);
    return (
      <div style={{ paddingBottom: '20px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.65rem', color: 'rgba(197,168,128,0.6)', letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, display: 'block', marginBottom: '8px' }}>Curated Portfolio</span>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', color: '#fff', margin: 0, fontWeight: 700, letterSpacing: '-0.01em' }}>⚜️ Signature Collection</h2>
              <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: 'rgba(255,255,255,0.5)', fontSize: '0.92rem', marginTop: '6px', marginBottom: 0 }}>Editor&apos;s picks — verified, exclusive, and hand-curated</p>
            </div>
          </div>
          <div style={{ marginTop: '24px', height: '1px', background: 'linear-gradient(to right, rgba(197,168,128,0.3), rgba(197,168,128,0.06), transparent)' }} />
        </div>
        {displayData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '1.1rem' }}>No properties in this collection yet.</div>
        ) : (
          <>
            <div style={{ position: 'relative' }}>
              <div id="editorial-carousel-track" style={{ display: 'flex', gap: '24px', overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingBottom: '8px' }}>
                {displayData.slice(0, 10).map(property => (
                  <div key={property.id} style={{ flexShrink: 0, width: 'clamp(270px, 75vw, 360px)' }}>
                    <PropertyCard property={property} isHnwiMode={isHnwiMode} isCompared={selectedForCompare.some(p => p.id === property.id)} isWishlisted={wishlistIds.includes(property.id)} formatPrice={formatPrice} onToggleCompare={handleToggleCompare} onToggleWishlist={handleToggleWishlist} onOpenRera={handleOpenReraDrawer} onOpenBrochure={(prop) => setSelectedBrochureProperty(prop)} onOpenDetail={(prop) => { setSelectedPropertyDetail(prop); window.scrollTo({ top: 300, behavior: 'smooth' }); }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button onClick={() => { const t = document.getElementById('editorial-carousel-track'); if(t) t.scrollBy({ left: -t.clientWidth * 0.7, behavior: 'smooth' }); }} type="button" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(197,168,128,0.3)', background: 'rgba(7,15,30,0.6)', color: 'rgba(197,168,128,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(197,168,128,0.7)'; e.currentTarget.style.color = '#E6C35C'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(197,168,128,0.3)'; e.currentTarget.style.color = 'rgba(197,168,128,0.7)'; }}><ChevronLeft size={16} /></button>
                <button onClick={() => { const t = document.getElementById('editorial-carousel-track'); if(t) t.scrollBy({ left: t.clientWidth * 0.7, behavior: 'smooth' }); }} type="button" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(197,168,128,0.3)', background: 'rgba(7,15,30,0.6)', color: 'rgba(197,168,128,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(197,168,128,0.7)'; e.currentTarget.style.color = '#E6C35C'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(197,168,128,0.3)'; e.currentTarget.style.color = 'rgba(197,168,128,0.7)'; }}><ChevronRight size={16} /></button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '36px' }}>
              <button
                onClick={() => {
                  setShowAllGrid(true);
                  setPage(0);
                  // scroll to grid
                  setTimeout(() => {
                    const el = document.getElementById('listings-anchor');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 80);
                }}
                type="button"
                style={{ background: 'linear-gradient(135deg, rgba(197,168,128,0.08) 0%, rgba(212,175,55,0.04) 100%)', border: '1px solid rgba(197,168,128,0.4)', color: '#E6C35C', padding: '13px 40px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700, fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.12em', cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.3s ease', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 16px rgba(197,168,128,0.12)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(197,168,128,0.14)'; e.currentTarget.style.borderColor = 'rgba(197,168,128,0.7)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(197,168,128,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(197,168,128,0.08) 0%, rgba(212,175,55,0.04) 100%)'; e.currentTarget.style.borderColor = 'rgba(197,168,128,0.4)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(197,168,128,0.12)'; }}
              >
                View All {allRawProperties.length} Properties <ArrowRight size={14} />
              </button>
            </div>
          </>
        )}
      </div>
    );
  };
  const handleCollectionChange = (collection) => {
    setActiveCollection(collection);
    setPage(0);
    // When any specific tab is clicked, reset to carousel for ALL, show grid for others
    if (collection !== 'ALL') {
      setShowAllGrid(false);
      const el = document.getElementById('listings-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setShowAllGrid(false);
    }
  };

  const handleTabChange = (tab) => {
    setExclusiveTab(tab);
    if (tab === 'SELL') {
      const element = document.getElementById('seller-mandate-anchor');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setFilters(prev => ({
        ...prev,
        transactionType: tab
      }));
      const element = document.getElementById('listings-anchor');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleSellerFormChange = (e) => {
    const { name, value } = e.target;
    setSellerForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSellerSubmit = async (e) => {
    e.preventDefault();
    const phonePattern = /^(?:\+91|0)?[6789]\d{9}$/;
    if (!phonePattern.test(sellerForm.phone)) {
      showNotification('⚠️ Invalid Phone: Enter a valid 10-digit Indian mobile number.');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(sellerForm.email)) {
      showNotification('⚠️ Invalid Email: Enter a valid email address.');
      return;
    }
    setSubmitLoading(true);
    try {
      const notes = `[SELLER EXCLUSIVE REGISTRY] Asset: "${sellerForm.propertyTitle}", Corridor: ${sellerForm.location}, Expected Valuation: ₹${sellerForm.expectedPrice}. Owner description: ${sellerForm.description}`;
      await apiService.submitLead({
        name: sellerForm.name,
        phone: sellerForm.phone,
        email: sellerForm.email,
        requirementType: 'BUY',
        budgetMin: sellerForm.expectedPrice ? sellerForm.expectedPrice : '0',
        budgetMax: sellerForm.expectedPrice ? sellerForm.expectedPrice : '0',
        preferredLocation: sellerForm.location,
        notes: notes
      });
      showNotification('Success! Your asset has been listed on our Private Seller Desk.');
      setSellerForm({
        name: '',
        phone: '',
        email: '',
        propertyTitle: '',
        location: 'HINJEWADI',
        expectedPrice: '',
        description: ''
      });
    } catch (err) {
      alert(`Seller registration failed: ${err.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    const rawInput = chatInput;
    setChatInput('');
    
    // Add temporary loading indicator for visitor
    const typingId = 'typing-' + Date.now();
    setChatMessages(prev => [...prev, { id: typingId, sender: 'bot', text: 'Typing...', isTyping: true }]);
    
    // Let's call Gemini
    try {
      const replyText = await chatWithVisitor(rawInput, selectedPropertyDetail);
      setChatMessages(prev => prev.filter(m => m.id !== typingId).concat({ sender: 'bot', text: replyText }));
    } catch (err) {
      console.error("Gemini response failed:", err);
      setChatMessages(prev => prev.filter(m => m.id !== typingId).concat({ 
        sender: 'bot', 
        text: 'Thank you for reaching out! A senior portfolio advisor is being notified to connect with you regarding this.' 
      }));
    }

    try {
      await apiService.submitLead({
        name: '[LIVE CHAT CLIENT]',
        phone: '+919673000053',
        email: 'chat@24krealestate.com',
        requirementType: 'BUY',
        budgetMin: '0',
        budgetMax: '0',
        preferredLocation: 'HINJEWADI',
        notes: `[LIVE SUPPORT CHAT] User inquiry: "${rawInput}"`
      });
    } catch (err) {
      console.error("Failed to register live chat lead:", err);
    }
  };

  // ── Smart NLP query parser ─────────────────────────────────────────────────
  const parseSmartQuery = (text) => {
    const t = text.toLowerCase();
    const parsed = { bedrooms: '', location: '', maxPrice: '', query: text };
    const chips = [];

    // BHK detection
    const bhkMatch = t.match(/(\d+)\s*(?:bhk|bed|bedroom|beds|bedrooms)/i);
    if (bhkMatch) {
      parsed.bedrooms = bhkMatch[1];
      chips.push({ label: `🛏 ${bhkMatch[1]} BHK`, key: 'bedrooms' });
    }

    // Price detection — "under 1.2 cr", "below 80 lakh", "upto 2cr", "under 90l"
    const crMatch = t.match(/(?:under|below|upto|max|within|<)\s*([\d.]+)\s*(?:cr|crore|crores)/i);
    const lakhMatch = t.match(/(?:under|below|upto|max|within|<)\s*([\d.]+)\s*(?:lakh|lakhs|l)/i);
    if (crMatch) {
      parsed.maxPrice = Math.round(parseFloat(crMatch[1]) * 10000000);
      chips.push({ label: `₹ < ${crMatch[1]} Cr`, key: 'maxPrice' });
    } else if (lakhMatch) {
      parsed.maxPrice = Math.round(parseFloat(lakhMatch[1]) * 100000);
      chips.push({ label: `₹ < ${lakhMatch[1]} L`, key: 'maxPrice' });
    }

    // Location detection
    const locations = ['hinjewadi', 'wakad', 'baner', 'balewadi', 'mahalunge', 'punawale', 'kharadi', 'viman nagar', 'aundh', 'pashan', 'sus road', 'tathawade'];
    for (const loc of locations) {
      if (t.includes(loc)) {
        parsed.location = loc.toUpperCase().replace(/\s+/g, '_');
        chips.push({ label: `📍 ${loc.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}`, key: 'location' });
        break;
      }
    }

    return { parsed, chips };
  };

  const getSearchSuggestions = (text) => {
    if (!text || text.trim().length < 2) return [];
    const t = text.toLowerCase().trim();
    const suggestions = [];

    // Location matches
    const locMap = {
      hinjewadi: { label: '📍 Properties in Hinjewadi IT Hub', filters: { location: 'HINJEWADI' } },
      wakad: { label: '📍 Properties in Wakad Junction', filters: { location: 'WAKAD' } },
      baner: { label: '📍 Properties in Baner', filters: { location: 'BANER' } },
      balewadi: { label: '📍 Properties in Balewadi High Street', filters: { location: 'BALEWADI' } },
      tathawade: { label: '📍 Properties in Tathawade', filters: { location: 'TATHAWADE' } },
      mahalunge: { label: '📍 Properties in Mahalunge Smart City', filters: { location: 'MAHALUNGE' } }
    };
    for (const [k, v] of Object.entries(locMap)) {
      if (k.startsWith(t) || t.includes(k)) {
        suggestions.push(v);
      }
    }

    // BHK matches
    const bhkMap = {
      '1': { label: '🛏 1 BHK Smart Luxury Homes', filters: { bedrooms: '1' } },
      '2': { label: '🛏 2 BHK Elite Residences', filters: { bedrooms: '2' } },
      '3': { label: '🛏 3 BHK Premium Penthouses', filters: { bedrooms: '3' } },
      '4': { label: '🛏 4 BHK Ultra-Luxury Villas', filters: { bedrooms: '4' } }
    };
    const digits = t.match(/\d/);
    if (digits && bhkMap[digits[0]]) {
      suggestions.push(bhkMap[digits[0]]);
    }

    // Developer matches
    const devMap = {
      '24k': { label: '🏢 Kolte-Patil 24K Luxury Brand', filters: { query: '24K' } },
      'godrej': { label: '🏢 Godrej Premium Properties', filters: { query: 'Godrej' } },
      'kasturi': { label: '🏢 Kasturi Signature Projects', filters: { query: 'Kasturi' } },
      'lodha': { label: '🏢 Lodha World-Class Towers', filters: { query: 'Lodha' } }
    };
    for (const [k, v] of Object.entries(devMap)) {
      if (k.startsWith(t) || t.includes(k)) {
        suggestions.push(v);
      }
    }

    // Typology matches
    if ('apartment'.startsWith(t) || 'flat'.startsWith(t) || t.includes('apartment') || t.includes('flat')) {
      suggestions.push({ label: '🏢 Residential Apartments Portfolio', filters: { propertyType: 'RESIDENTIAL' } });
    }
    if ('commercial'.startsWith(t) || 'office'.startsWith(t) || 'shop'.startsWith(t) || t.includes('commercial') || t.includes('office')) {
      suggestions.push({ label: '💼 Commercial Workspaces & Offices', filters: { propertyType: 'COMMERCIAL' } });
    }

    return suggestions.slice(0, 5);
  };

  const handleSelectSuggestion = (suggestion) => {
    setSelectedPropertyDetail(null);
    setFilters(prev => {
      const isCommercial = heroTab === 'COMMERCIAL';
      return {
        ...prev,
        transactionType: isCommercial ? '' : heroTab,
        query: '',
        location: '',
        bedrooms: '',
        maxPrice: '',
        propertyType: isCommercial ? 'COMMERCIAL' : '',
        ...suggestion.filters
      };
    });
    setHeroSearchText('');
    setSmartChips([]);
    setSearchFocused(false);
    setExclusiveTab(heroTab);
    setActiveSection('listings');
    
    // Save to recent searches
    const cleanLabel = suggestion.label.replace(/^[📍🛏🏢💼]\s*/, '');
    setRecentSearches(prev => {
      const updated = [cleanLabel, ...prev.filter(s => s !== cleanLabel)].slice(0, 5);
      localStorage.setItem('recent_searches', JSON.stringify(updated));
      return updated;
    });

    setTimeout(() => {
      const el = document.getElementById('listings-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleSmartInputChange = (val) => {
    setHeroSearchText(val);
    if (val.trim().length > 2) {
      const { chips } = parseSmartQuery(val);
      setSmartChips(chips);
    } else {
      setSmartChips([]);
    }
  };

  const handleLuxurySearch = (e) => {
    if (e) e.preventDefault();
    setSelectedPropertyDetail(null);
    setFilters(prev => {
      const isCommercial = heroTab === 'COMMERCIAL';
      return {
        ...prev,
        transactionType: isCommercial ? 'BUY' : heroTab,
        location: searchLocation,
        propertyType: isCommercial ? 'COMMERCIAL' : searchPropType,
        bedrooms: searchBHK,
        maxPrice: searchBudget,
        query: ''
      };
    });
    setExclusiveTab(heroTab === 'COMMERCIAL' ? 'BUY' : heroTab);
    setActiveSection('listings');
    setPage(0);
    setTimeout(() => {
      const el = document.getElementById('listings-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleHeroSearch = (e, searchTextOverride = null) => {
    if (e) e.preventDefault();
    setSelectedPropertyDetail(null);
    const queryText = searchTextOverride !== null ? searchTextOverride : heroSearchText;
    
    // Check if the query text matches one of the autocomplete suggestions
    const suggestions = getSearchSuggestions(queryText);
    const matchedSuggestion = suggestions.find(s => 
      s.label.toLowerCase().includes(queryText.toLowerCase()) || 
      queryText.toLowerCase().includes(s.label.toLowerCase().replace(/^[📍🛏🏢💼]\s*/, ''))
    );

    setFilters(prev => {
      const isCommercial = heroTab === 'COMMERCIAL';
      const baseFilters = {
        ...prev,
        transactionType: isCommercial ? '' : heroTab,
        query: '',
        location: '',
        bedrooms: '',
        maxPrice: '',
        propertyType: isCommercial ? 'COMMERCIAL' : ''
      };

      if (matchedSuggestion) {
        return {
          ...baseFilters,
          ...matchedSuggestion.filters
        };
      } else {
        const { parsed } = parseSmartQuery(queryText);
        return {
          ...baseFilters,
          query: queryText,
          ...(parsed.bedrooms && { bedrooms: parsed.bedrooms }),
          ...(parsed.maxPrice && { maxPrice: String(parsed.maxPrice) }),
          ...(parsed.location && { location: parsed.location }),
        };
      }
    });
    
    setExclusiveTab(heroTab);
    setActiveSection('listings');
    setSmartChips([]);
    setSearchFocused(false);
    if (searchTextOverride !== null) {
      setHeroSearchText(searchTextOverride);
    }
    
    // Save to recent searches
    if (queryText.trim()) {
      setRecentSearches(prev => {
        const updated = [queryText.trim(), ...prev.filter(s => s !== queryText.trim())].slice(0, 5);
        localStorage.setItem('recent_searches', JSON.stringify(updated));
        return updated;
      });
    }
    setTimeout(() => {
      const el = document.getElementById('listings-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleSectionChange = (section) => {
    setActiveSubView(null);
    setActiveSection(section);
    
    setTimeout(() => {
      let targetId = 'listings-anchor';
      if (section === 'societies') targetId = 'societies-anchor';
      else if (section === 'builders') targetId = 'builders-anchor';
      else if (section === 'localities') targetId = 'localities-anchor';
      else if (section === 'blogs') targetId = 'blogs-anchor';
      
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleApplyMegaFilter = (newFilters, section = 'listings', targetAnchorId = null, subView = null) => {
    setActiveSubView(subView);

    setFilters({
      location: '',
      propertyType: '',
      transactionType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      furnishingStatus: '',
      status: 'AVAILABLE',
      query: '',
      ...newFilters
    });

    if (newFilters.transactionType) {
      setExclusiveTab(newFilters.transactionType);
      setHeroTab(newFilters.transactionType);
    }
    
    if (newFilters.query) {
      setHeroSearchText(newFilters.query);
    } else {
      setHeroSearchText('');
    }

    setActiveSection(section);

    if (targetAnchorId === 'mortgage-desk') {
      const firstProp = properties[0] || (properties.length > 0 ? properties[0] : null);
      if (firstProp) {
        setSelectedProperty(firstProp);
        setIsModalOpen(true);
        setTimeout(() => {
          const el = document.getElementById('mortgage-desk');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
      return;
    }

    setTimeout(() => {
      let targetId = targetAnchorId || 'listings-anchor';
      if (!targetAnchorId) {
        if (section === 'societies') targetId = 'societies-anchor';
        else if (section === 'builders') targetId = 'builders-anchor';
        else if (section === 'localities') targetId = 'localities-anchor';
        else if (section === 'blogs') targetId = 'blogs-anchor';
      }
      
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const renderSubView = () => {
    const saleProps = properties.filter(p => p.transactionType === 'BUY');
    const rentProps = properties.filter(p => p.transactionType === 'RENT');
    const verifiedProps = properties.filter(p => p.verifiedListing);
    const exclusiveProps = properties.filter(p => p.exclusiveDeal);

    const handleBackToHome = () => {
      setActiveSubView(null);
      setFilters({
        location: '',
        propertyType: '',
        transactionType: '',
        minPrice: '',
        maxPrice: '',
        bedrooms: '',
        furnishingStatus: '',
        status: 'AVAILABLE',
        query: ''
      });
      setHeroSearchText('');
    };

    switch (activeSubView) {
      case "market-intelligence":
        return (
          <div className="subview-container" style={{ padding: '80px 0 60px 0', minHeight: '80vh' }}>
            <Suspense fallback={
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: '#E6C35C' }}>
                <Loader className="animate-spin" size={32} />
              </div>
            }>
              <DataLabsView onBack={handleBackToHome} onOpenInquiry={handleOpenInquiry} />
            </Suspense>
          </div>
        );
      case 'properties-sale':
        return (
          <div className="subview-container" style={{ padding: '120px 20px 80px 20px', maxWidth: '1410px', margin: '0 auto', minHeight: '80vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
              <div>
                <span className="hero-gold-badge" style={{ marginBottom: '10px' }}>Active Portfolio</span>
                <h2 className="reveal-mask" style={{ fontFamily: 'var(--font-title)', fontSize: '2.2rem', color: '#fff', margin: 0 }}>
                  <span className="reveal-mask-content">⚜️ Premium Properties for Sale</span>
                </h2>
                <p className="reveal-fade-up" style={{ margin: '5px 0 0 0', color: 'var(--text-muted)' }}>Explore high-appreciation residential apartments and penthouses in Pune West.</p>
              </div>
              <button className="btn-outline" onClick={handleBackToHome}>Back to Advisor</button>
            </div>
            
            <div className="properties-subview-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
              {saleProps.map(property => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  isHnwiMode={isHnwiMode}
                  isCompared={selectedForCompare.some(p => p.id === property.id)}
                  isWishlisted={wishlistIds.includes(property.id)}
                  formatPrice={formatPrice}
                  onToggleCompare={handleToggleCompare}
                  onToggleWishlist={handleToggleWishlist}
                  onOpenRera={handleOpenReraDrawer}
                  onOpenBrochure={(prop) => setSelectedBrochureProperty(prop)}
                  onOpenDetail={(prop) => { 
                    setSelectedPropertyDetail(prop); 
                    setActiveSection('listings'); 
                    window.scrollTo({ top: 300, behavior: 'smooth' }); 
                  }}
                />
              ))}
            </div>
          </div>
        );

      case 'properties-rent':
        return (
          <div className="subview-container" style={{ padding: '120px 20px 80px 20px', maxWidth: '1410px', margin: '0 auto', minHeight: '80vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
              <div>
                <span className="hero-gold-badge" style={{ marginBottom: '10px' }}>Active Portfolio</span>
                <h2 className="reveal-mask" style={{ fontFamily: 'var(--font-title)', fontSize: '2.2rem', color: '#fff', margin: 0 }}>
                  <span className="reveal-mask-content">⚜️ Luxury Residences for Rent</span>
                </h2>
                <p className="reveal-fade-up" style={{ margin: '5px 0 0 0', color: 'var(--text-muted)' }}>Premium rental flats, corporate suites, and townhouses near IT parks.</p>
              </div>
              <button className="btn-outline" onClick={handleBackToHome}>Back to Advisor</button>
            </div>
            
            <div className="properties-subview-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
              {rentProps.map(property => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  isHnwiMode={isHnwiMode}
                  isCompared={selectedForCompare.some(p => p.id === property.id)}
                  isWishlisted={wishlistIds.includes(property.id)}
                  formatPrice={formatPrice}
                  onToggleCompare={handleToggleCompare}
                  onToggleWishlist={handleToggleWishlist}
                  onOpenRera={handleOpenReraDrawer}
                  onOpenBrochure={(prop) => setSelectedBrochureProperty(prop)}
                  onOpenDetail={(prop) => { 
                    setSelectedPropertyDetail(prop); 
                    setActiveSection('listings'); 
                    window.scrollTo({ top: 300, behavior: 'smooth' }); 
                  }}
                />
              ))}
            </div>
          </div>
        );

      case 'verified-flats':
        return (
          <div className="subview-container" style={{ padding: '120px 20px 80px 20px', maxWidth: '1410px', margin: '0 auto', minHeight: '80vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
              <div>
                <span className="hero-gold-badge" style={{ marginBottom: '10px', background: 'rgba(46,196,182,0.15)', color: '#2ec4b6' }}>🛡️ 100% Trust Shield</span>
                <h2 className="reveal-mask" style={{ fontFamily: 'var(--font-title)', fontSize: '2.2rem', color: '#fff', margin: 0 }}>
                  <span className="reveal-mask-content">Verified Premium Listings</span>
                </h2>
                <p className="reveal-fade-up" style={{ margin: '5px 0 0 0', color: 'var(--text-muted)' }}>Properties audited for carpet layout compliance, registry status, and MahaRERA approvals.</p>
              </div>
              <button className="btn-outline" onClick={handleBackToHome}>Back to Advisor</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px', flexWrap: 'wrap' }} className="verified-view-grid">
              <div className="properties-subview-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                {verifiedProps.map(property => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    isHnwiMode={isHnwiMode}
                    isCompared={selectedForCompare.some(p => p.id === property.id)}
                    isWishlisted={wishlistIds.includes(property.id)}
                    formatPrice={formatPrice}
                    onToggleCompare={handleToggleCompare}
                    onToggleWishlist={handleToggleWishlist}
                    onOpenRera={handleOpenReraDrawer}
                    onOpenBrochure={(prop) => setSelectedBrochureProperty(prop)}
                    onOpenDetail={(prop) => { 
                      setSelectedPropertyDetail(prop); 
                      setActiveSection('listings'); 
                      window.scrollTo({ top: 300, behavior: 'smooth' }); 
                    }}
                  />
                ))}
              </div>

              <div className="verification-checklist-panel" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '12px', padding: '24px', height: 'fit-content' }}>
                <h4 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', margin: '0 0 15px 0' }}>⚜️ 24K Verification Protocol</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>Each property undergoes a strict 5-stage legal and spatial audit prior to public onboarding.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <ShieldCheck size={16} color="#2ec4b6" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--text-light)' }}>Title-Clear Registry Dossier</strong>
                      <p style={{ margin: '3px 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Verified land allocations and developer rights.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <ShieldCheck size={16} color="#2ec4b6" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--text-light)' }}>MahaRERA Status Mapping</strong>
                      <p style={{ margin: '3px 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Official registration and compliance verification.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <ShieldCheck size={16} color="#2ec4b6" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--text-light)' }}>Carpet Audit Compliance</strong>
                      <p style={{ margin: '3px 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Physical layout matches blueprint RERA carpet.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'maharera-directory':
        return (
          <div className="subview-container" style={{ padding: '120px 20px 80px 20px', maxWidth: '1410px', margin: '0 auto', minHeight: '80vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
              <div>
                <span className="hero-gold-badge" style={{ marginBottom: '10px' }}>Compliance Directory</span>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2.2rem', color: '#fff', margin: 0 }}>⚜️ MahaRERA Onboarded Projects</h2>
                <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)' }}>Verified MahaRERA registration certificates and broker license details.</p>
              </div>
              <button className="btn-outline" onClick={handleBackToHome}>Back to Advisor</button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '12px', padding: '30px', marginBottom: '30px' }}>
              <h4 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', margin: '0 0 10px 0' }}>Authorized Broker License: A52100028461</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>In compliance with Section 9 of the Real Estate (Regulation and Development) Act, 2016, all portfolios offered by 24K Realtors are registered under authorized MahaRERA directories. Buyers can cross-verify registrations via the official Maharashtra government portal.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {societies.map(soc => (
                <div key={soc.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '20px' }}>
                  <h4 style={{ color: '#fff', margin: '0 0 5px 0', fontFamily: 'var(--font-title)' }}>{soc.name}</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--gold-primary)', fontWeight: 'bold' }}>{soc.reraNumber}</span>
                  <div style={{ margin: '15px 0 0 0', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    <p style={{ margin: '0 0 5px 0' }}><strong>Developer:</strong> {soc.developer}</p>
                    <p style={{ margin: '0 0 5px 0' }}><strong>Location:</strong> {soc.location}</p>
                    <p style={{ margin: '0 0 5px 0' }}><strong>Status:</strong> {soc.projectStatus.replace('_', ' ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'exclusive-deals':
        return (
          <div className="subview-container" style={{ padding: '120px 20px 80px 20px', maxWidth: '1410px', margin: '0 auto', minHeight: '80vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(212,175,55,0.22)', paddingBottom: '15px' }}>
              <div>
                <span className="hero-gold-badge" style={{ marginBottom: '10px', background: 'rgba(212,175,55,0.15)', color: 'var(--gold-primary)' }}>⚜️ Private Client Desk</span>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2.2rem', color: '#fff', margin: 0 }}>HNWI Mandates & Exclusive Deals</h2>
                <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)' }}>Pre-release developer inventory, full-floor commercial assets, and high-yield properties.</p>
              </div>
              <button className="btn-outline" onClick={handleBackToHome}>Back to Advisor</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px' }} className="exclusive-view-grid">
              <div className="properties-subview-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '30px' }}>
                {exclusiveProps.map(property => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    isHnwiMode={isHnwiMode}
                    isCompared={selectedForCompare.some(p => p.id === property.id)}
                    isWishlisted={wishlistIds.includes(property.id)}
                    formatPrice={formatPrice}
                    onToggleCompare={handleToggleCompare}
                    onToggleWishlist={handleToggleWishlist}
                    onOpenRera={handleOpenReraDrawer}
                    onOpenDetail={(prop) => { 
                      setSelectedPropertyDetail(prop); 
                      setActiveSection('listings'); 
                      window.scrollTo({ top: 300, behavior: 'smooth' }); 
                    }}
                  />
                ))}
              </div>

              <div className="private-mandate-form-box" style={{ background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.95) 0%, rgba(7, 15, 30, 0.98) 100%)', border: '2px solid var(--gold-primary)', borderRadius: '12px', padding: '30px', height: 'fit-content' }}>
                <h4 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', margin: '0 0 10px 0', fontSize: '1.2rem' }}>Request Portfolio Access</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>Submit details to receive our locked PDF brochures, yield tables, and schedule a private Maybach chauffeur site tour.</p>
                <form onSubmit={(e) => { e.preventDefault(); setNotification('NDA request registered. A private client partner will reach out within 15 minutes.'); setTimeout(() => setNotification(null), 5000); }}>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px', fontWeight: 'bold' }}>FULL NAME</label>
                    <input type="text" required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: '#fff' }} />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px', fontWeight: 'bold' }}>WHATSAPP NUMBER</label>
                    <input type="tel" required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: '#fff' }} />
                  </div>
                  <button type="submit" className="btn-gold" style={{ width: '100%', padding: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Submit NDA Request</button>
                </form>
              </div>
            </div>
          </div>
        );

      case 'locality-guides':
        return (
          <div className="subview-container" style={{ padding: '120px 20px 80px 20px', maxWidth: '1410px', margin: '0 auto', minHeight: '80vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
              <div>
                <span className="hero-gold-badge" style={{ marginBottom: '10px' }}>Advisory Desk</span>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2.2rem', color: '#fff', margin: 0 }}>⚜️ Locality & Infrastructure Guides</h2>
                <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)' }}>Connectivity matrices, upcoming metro updates, and school maps for Hinjewadi, Wakad & Baner.</p>
              </div>
              <button className="btn-outline" onClick={handleBackToHome}>Back to Advisor</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
              {localities.map(loc => (
                <div key={loc.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '24px' }}>
                  <h4 style={{ color: '#fff', margin: '0 0 10px 0', fontSize: '1.25rem', fontFamily: 'var(--font-title)' }}>{loc.name} Area Profile</h4>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '15px' }}>{loc.overview}</p>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <p style={{ margin: '0 0 8px 0' }}><strong>Transit Connectivity:</strong> {loc.connectivityInfo}</p>
                    <p style={{ margin: '0 0 8px 0' }}><strong>Metro Line 3 Progress:</strong> {loc.metroConnectivity}</p>
                    <p style={{ margin: '0 0 8px 0' }}><strong>Investment Score:</strong> {loc.investmentAnalysis}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'developer-portfolios':
        return (
          <div className="subview-container" style={{ padding: '120px 20px 80px 20px', maxWidth: '1410px', margin: '0 auto', minHeight: '80vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
              <div>
                <span className="hero-gold-badge" style={{ marginBottom: '10px' }}>Developer Directory</span>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2.2rem', color: '#fff', margin: 0 }}>⚜️ Premium Real Estate Developers</h2>
                <p style={{ margin: '5px 0 0 0', color: 'var(--text-muted)' }}>Profile directories of Pune West's leading certified builder groups.</p>
              </div>
              <button className="btn-outline" onClick={handleBackToHome}>Back to Advisor</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
              {builders.map(builder => (
                <div key={builder.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '12px', padding: '24px' }}>
                  <h4 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '1.25rem', fontFamily: 'var(--font-title)' }}>{builder.name}</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--gold-primary)', fontWeight: 'bold' }}>{builder.awards}</span>
                  <div style={{ margin: '20px 0 0 0', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    <p style={{ margin: '0 0 6px 0' }}><strong>Experience Years:</strong> {builder.experienceYears} Years</p>
                    <p style={{ margin: '0 0 6px 0' }}><strong>Completed Projects:</strong> {builder.completedProjectsCount}+ Projects</p>
                    <p style={{ margin: '0 0 6px 0' }}><strong>Ongoing Projects:</strong> {builder.ongoingProjectsCount} Active Sites</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleAiAnalyze = () => {
    setAiAnalyzing(true);
    setAiProgress(0);
    setAiReport(null);
    
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setAiProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setAiAnalyzing(false);
        
        let recommendedCorridor = 'WAKAD';
        let explanation = '';
        let appreciationIndex = '14.2%';
        let rentalYield = '4.5%';
        let connectivityScore = '9.2/10';
        
        if (aiPriority === 'yield') {
          recommendedCorridor = 'HINJEWADI';
          appreciationIndex = '11.8%';
          rentalYield = '5.2%';
          connectivityScore = '8.8/10';
          explanation = 'Based on your preference for High Rental Yields, Hinjewadi is recommended. The tech hubs generate stable corporate tenant demand, pushing yields to 5.2%—the highest in Pune West.';
        } else if (aiPriority === 'commute') {
          recommendedCorridor = 'BANER';
          appreciationIndex = '16.5%';
          rentalYield = '3.8%';
          connectivityScore = '9.5/10';
          explanation = 'For optimized commute time and high appreciation, Baner is recommended. It lies adjacent to Balewadi High Street with excellent transit routes to IT offices.';
        } else {
          if (aiBudget === 'under-80L') {
            recommendedCorridor = 'MAHALUNGE';
            appreciationIndex = '18.1%';
            rentalYield = '4.8%';
            connectivityScore = '8.0/10';
            explanation = 'For maximum capital appreciation on an entry budget, Mahalunge smart city township is the optimal choice. It exhibits a high 18% YoY growth profile.';
          } else {
            recommendedCorridor = 'WAKAD';
            appreciationIndex = '14.2%';
            rentalYield = '4.5%';
            connectivityScore = '9.2/10';
            explanation = 'Wakad offers the most balanced profile. Excellent 14% capital appreciation combined with a solid 4.5% yield and multi-lane highway transit.';
          }
        }
        
        setAiReport({
          area: recommendedCorridor,
          appreciationIndex,
          rentalYield,
          connectivityScore,
          explanation
        });
      }
    }, 150);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setPage(0);
    setActiveCollection('ALL');
    fetchProperties();
  };

  const handleResetFilters = () => {
    setFilters({
      location: '',
      propertyType: '',
      transactionType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      furnishingStatus: '',
      status: 'AVAILABLE'
    });
    setActiveCollection('ALL');
    setPage(0);
    setTimeout(() => fetchProperties(), 0);
  };

  const handleCorridorClick = (locationId) => {
    const updatedFilters = { ...filters, location: locationId };
    setFilters(updatedFilters);
    setPage(0);
    setActiveCollection('ALL');
    
    const element = document.getElementById('listings-anchor');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setLoading(true);
    apiService.getProperties(updatedFilters, 0, 6)
      .then(data => {
        setProperties(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Could not filter properties.');
        setLoading(false);
      });
  };

  const handleOpenInquiry = (property) => {
    setSelectedProperty(property);
    setLeadForm({
      name: '',
      phone: '',
      email: '',
      requirementType: property.transactionType === 'RENT' ? 'RENT' : 'BUY',
      budgetMin: property.price ? (Number(property.price) * 0.9).toString() : '',
      budgetMax: property.price ? (Number(property.price) * 1.1).toString() : '',
      preferredLocation: property.location || 'HINJEWADI',
      bhkType: '',
      visitSlot: '',
      notes: `Interested in ${property.title} — please share brochure and availability.`,
      propertyId: property.id
    });
    
    calculateEMI(property.price, mortgageDetails.downPaymentPercent, mortgageDetails.interestRate, mortgageDetails.loanTermYears);
    setIsModalOpen(true);
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    const phonePattern = /^(?:\+91|0)?[6789]\d{9}$/;
    if (!phonePattern.test(leadForm.phone)) {
      showNotification('⚠️ Invalid Phone: Enter a valid 10-digit Indian mobile number.');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(leadForm.email)) {
      showNotification('⚠️ Invalid Email: Enter a valid email address.');
      return;
    }
    setSubmitLoading(true);
    try {
      await apiService.submitLead(leadForm);
      setIsModalOpen(false);
      showNotification('Inquiry submitted! Welcome message dispatched on WhatsApp.');
    } catch (err) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleVipSubmit = async (e) => {
    e.preventDefault();
    const phonePattern = /^(?:\+91|0)?[6789]\d{9}$/;
    if (!phonePattern.test(vipForm.phone)) {
      showNotification('⚠️ Invalid Phone: Enter a valid 10-digit Indian mobile number.');
      return;
    }
    setVipSubmitting(true);
    try {
      const notesMsg = "VIP Priority Advisory Callback Request. Urgently contact customer for property guidance.";
      await apiService.submitLead({
        name: vipForm.name,
        phone: vipForm.phone,
        email: 'vip.callback@24krealtors.com',
        requirementType: 'BUY',
        budgetMin: '10000000',
        budgetMax: '30000000',
        preferredLocation: 'HINJEWADI',
        notes: notesMsg
      });
      setVipForm({ name: '', phone: '' });
      setCountdown(60);
      showNotification('VIP Callback logged! Connecting Location Advisor...');
    } catch (err) {
      alert(err.message);
    } finally {
      setVipSubmitting(false);
    }
  };

  const handleToggleCompare = (property) => {
    setSelectedForCompare(prev => {
      const exists = prev.some(p => p.id === property.id);
      if (exists) {
        return prev.filter(p => p.id !== property.id);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 properties side-by-side.');
        return prev;
      }
      return [...prev, property];
    });
  };



  const handleOpenReraDrawer = (property, e) => {
    e.stopPropagation();
    setSelectedReraProperty(property);
    setIsReraDrawerOpen(true);
  };

  const calculateEMI = (price, downPercent, rate, years) => {
    const principal = Number(price) * (1 - downPercent / 100);
    const monthlyRate = (rate / 12) / 100;
    const months = years * 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    setMortgageDetails(prev => ({
      ...prev,
      downPaymentPercent: downPercent,
      interestRate: rate,
      loanTermYears: years,
      monthlyEMI: Math.round(emi)
    }));
  };

  const handleMortgageChange = (name, value) => {
    const updated = { ...mortgageDetails, [name]: Number(value) };
    calculateEMI(selectedProperty.price, updated.downPaymentPercent, updated.interestRate, updated.loanTermYears);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 5000);
  };

  const formatPrice = (price, transactionType = null) => {
    if (!price) return 'N/A';
    const num = Number(price);
    let formattedPrice = '';
    if (num >= 10000000) {
      formattedPrice = `₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      formattedPrice = `₹${(num / 100000).toFixed(2)} L`;
    } else {
      formattedPrice = `₹${num.toLocaleString('en-IN')}`;
    }
    
    if (transactionType === 'RENT') {
      return `${formattedPrice} / Month`;
    }
    return formattedPrice;
  };

  const _getLandmarks = (loc) => {
    switch (loc) {
      case 'BANER':
        return ['Balewadi High Street (5 mins)', 'Mumbai-Pune Highway (10 mins)'];
      case 'WAKAD':
        return ['Phoenix Marketcity (8 mins)', 'D.Y. Patil University (12 mins)'];
      case 'HINJEWADI':
        return ['Rajiv Gandhi IT Park Phase 1 (3 mins)', 'Hinjewadi Metro (5 mins)'];
      case 'BALEWADI':
        return ['Sports Complex Stadium (4 mins)', 'Balewadi High Street (2 mins)'];
      case 'TATHAWADE':
        return ['Indira College Campus (6 mins)', 'D-Mart Tathawade (4 mins)'];
      case 'MAHALUNGE':
        return ['Mahalunge-Nande Highway (3 mins)', 'Radisson Blu (12 mins)'];
      default:
        return ['IT Tech Parks (10 mins)', 'Mumbai Highway (15 mins)'];
    }
  };

  const _getLocationScorecard = (loc) => {
    switch (loc) {
      case 'BANER':
        return { appreciation: '9.6', commute: '9.0', schools: '9.5', noise: '8.8', green: '9.0' };
      case 'WAKAD':
        return { appreciation: '8.8', commute: '8.6', schools: '9.2', noise: '7.8', green: '8.4' };
      case 'HINJEWADI':
        return { appreciation: '9.1', commute: '9.8', schools: '7.8', noise: '6.5', green: '8.0' };
      case 'BALEWADI':
        return { appreciation: '9.4', commute: '9.1', schools: '9.6', noise: '8.0', green: '8.5' };
      case 'TATHAWADE':
        return { appreciation: '8.6', commute: '8.2', schools: '9.0', noise: '8.2', green: '8.8' };
      case 'MAHALUNGE':
        return { appreciation: '9.8', commute: '8.8', schools: '8.5', noise: '9.0', green: '9.2' };
      default:
        return { appreciation: '9.0', commute: '9.0', schools: '9.0', noise: '8.0', green: '8.5' };
    }
  };


  const getAppreciationCAGR = (loc) => {
    switch (loc) {
      case 'BANER': return 12.0;
      case 'WAKAD': return 10.5;
      case 'HINJEWADI': return 9.8;
      case 'BALEWADI': return 11.0;
      case 'TATHAWADE': return 8.5;
      case 'MAHALUNGE': return 13.5;
      default: return 10.0;
    }
  };

  const calculateAppreciatedValue = (price, loc, years) => {
    const cagr = getAppreciationCAGR(loc) / 100;
    return Math.round(Number(price) * Math.pow(1 + cagr, years));
  };

  const getEmbedVideoUrl = (url) => {
    if (!url) return "https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&loop=1&playlist=LXb3EKWsInQ";
    if (url.includes("/embed/")) {
      return url.includes("?") ? `${url}&autoplay=1&mute=1` : `${url}?autoplay=1&mute=1`;
    }
    // eslint-disable-next-line no-useless-escape
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(ytRegex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}`;
    }
    return url;
  };

  return (
    <div className="portal-container" style={{ paddingTop: '80px' }}>
      {/* Railway Wake Loader */}
      {loadingElapsed > 3 && <RailwayWakeLoader elapsed={loadingElapsed} />}
      
      {/* Toast Notification */}
      {notification && (
        <div className="notification premium-toast">
          <CheckCircle size={20} color="#D4AF37" />
          <span>{notification}</span>
        </div>
      )}

      {/* VIP Callback Active Countdown Timer Overlay */}
      {countdown > 0 && (
        <div className="callback-countdown-overlay">
          <div className="countdown-ring-box">
            <Clock size={20} className="spin-slow" />
            <span>Advisory Connection: <strong>{countdown}s</strong></span>
          </div>
          <p>Priority Line #1 - Region Location Advisor is dialing your number</p>
        </div>
      )}

      {/* Premium Luxury Navbar */}
      <PortalNavbar 
        isHnwiMode={isHnwiMode} 
        setIsHnwiMode={setIsHnwiMode} 
        filters={filters}
        activeSubView={activeSubView}
        onViewChange={(view) => {
          setSelectedPropertyDetail(null);
          if (onViewChange) onViewChange(view);
        }} 
        onBookVisitClick={() => { handleOpenInquiry(properties[0] || allRawProperties[0] || { id: null, title: 'Advisory Consultation', price: '0', location: 'HINJEWADI', transactionType: 'BUY' }); }}
        onOpenSpotlight={() => setIsSpotlightOpen(true)}
        exclusiveTab={exclusiveTab}
        onTabChange={handleTabChange}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onApplyMegaFilter={handleApplyMegaFilter}
        onHomeClick={() => { 
          setSelectedPropertyDetail(null); 
          handleResetFilters(); 
          window.scrollTo({ top: 0, behavior: 'smooth' }); 
        }}
        onSearchClick={() => { 
          setSelectedPropertyDetail(null); 
          setTimeout(() => {
            const el = document.getElementById('listings-anchor'); 
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
          }, 100);
        }}
        onSavedClick={() => { 
          setSelectedPropertyDetail(null); 
          handleCollectionChange('WISHLIST'); 
          setTimeout(() => {
            const el = document.getElementById('listings-anchor'); 
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
          }, 100);
        }}
        activeCollection={activeCollection}
        selectedPropertyDetail={selectedPropertyDetail}
      />

      {selectedPropertyDetail ? (
        <div className="main-portal-listings-section" style={{ maxWidth: '1410px', margin: '0 auto', padding: '0 20px', paddingTop: '20px' }}>
          <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
              <Loader className="animate-spin" size={36} color="var(--gold-primary)" />
            </div>
          }>
            <PropertyDetailView 
              property={selectedPropertyDetail} 
              onBack={() => {
                setSelectedPropertyDetail(null);
                setTimeout(() => {
                  const el = document.getElementById('listings-anchor');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
              }}
              onOpenInquiry={handleOpenInquiry}
              onOpenChauffeur={handleOpenInquiry}
              onOpenBrochure={(prop) => setSelectedBrochureProperty(prop || selectedPropertyDetail)}
              formatPrice={formatPrice}
              getEmbedVideoUrl={getEmbedVideoUrl}
              allProperties={allRawProperties}
            />
          </Suspense>
        </div>
      ) : activeSubView ? renderSubView() : (
        <>
          {/* Redesigned Full-Screen Cinematic Hero Section */}
          <section className="portal-hero" style={{
            position: 'relative',
            minHeight: '85vh',
            backgroundImage: "url('/hero_bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden'
          }}>
            {/* Dark vignette overlay for readability */}
            <div className="hero-vignette-overlay" style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(to right, rgba(4, 8, 20, 0.78) 0%, rgba(4, 8, 20, 0.20) 55%, rgba(4, 8, 20, 0.35) 100%), linear-gradient(to bottom, rgba(4, 8, 20, 0.25) 0%, rgba(4, 8, 20, 0.75) 100%)',
              zIndex: 1
            }} />
            {/* Flashing System Status & Real-time Ticker Ribbon */}
            <div style={{
              position: "absolute",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 3,
              width: "94%",
              maxWidth: "1410px",
              background: "rgba(7, 15, 30, 0.75)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(197, 168, 128, 0.18)",
              borderRadius: "50px",
              padding: "10px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                <span className="live-pulse-dot" style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#25D366",
                  boxShadow: "0 0 10px #25D366",
                  display: "inline-block",
                  animation: "pulseGlow 2s infinite"
                }} />
                <span style={{ fontSize: "0.65rem", fontFamily: "'Montserrat', sans-serif", fontWeight: 800, color: "rgba(255,255,255,0.7)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  SYSTEM STATUS: <span style={{ color: "#25D366" }}>ONLINE & SYNCED</span>
                </span>
              </div>
              <div className="ticker-container" style={{ flex: 1, overflow: "hidden", whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>
                <div className="ticker-text" style={{
                  display: "inline-block",
                  fontSize: "0.68rem",
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  color: "rgba(255, 255, 255, 0.5)",
                  letterSpacing: "0.04em",
                  animation: "marqueeText 30s linear infinite",
                  paddingLeft: "100%"
                }}>
                  ✦ [LIVE METRIC] BANER avg price: ₹11,500/sqft (+1.6% this week) &nbsp;&nbsp;&nbsp;&nbsp; ✦ [LIVE DEALS] Hinjewadi IT Plaza Office Space leased by Tech MNC &nbsp;&nbsp;&nbsp;&nbsp; ✦ [MARKET] Hinjewadi rental yields reach 5.2% high index &nbsp;&nbsp;&nbsp;&nbsp; ✦ [PORTFOLIO] 24K Altura Smart 2 BHK demand is up 14% &nbsp;&nbsp;&nbsp;&nbsp; ✦ [VALUATION] AI Compute Engine update complete v2.4
                </div>
              </div>
              <style>{`
                @keyframes pulseGlow {
                  0%, 100% { opacity: 0.5; transform: scale(0.9); }
                  50% { opacity: 1; transform: scale(1.1); box-shadow: 0 0 14px #25D366; }
                }
                @keyframes marqueeText {
                  0% { transform: translate3d(0, 0, 0); }
                  100% { transform: translate3d(-100%, 0, 0); }
                }
              `}</style>
            </div>
            
            <div className="hero-content" style={{ 
              position: 'relative',
              zIndex: 2,
              width: '100%',
              maxWidth: '94%',
              margin: '0 auto',
              padding: '120px 0 60px 0'
            }}>
              <div className="hero-text-block" style={{ maxWidth: '650px', marginBottom: '40px' }}>
                <span className="hero-gold-badge" style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: '#C5A880',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ width: '24px', height: '1px', background: 'rgba(197,168,128,0.6)', display: 'inline-block' }} />
                  PUNE'S MOST TRUSTED ADVISORY SINCE 2015
                  <span style={{ width: '24px', height: '1px', background: 'rgba(197,168,128,0.6)', display: 'inline-block' }} />
                </span>
                
                <h1 style={{ 
                  fontFamily: "'Cinzel', serif", 
                  fontSize: 'clamp(2.4rem, 4.8vw, 4.5rem)', 
                  color: '#fff', 
                  lineHeight: 1.12, 
                  margin: '22px 0 18px 0', 
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  textShadow: '0 4px 20px rgba(0,0,0,0.5)' 
                }}>
                  Pune's Most Coveted<br />
                  <span style={{ 
                    background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 40%, #C5A880 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>Addresses, Curated For You</span>
                </h1>
                
                <p className="hero-subtext" style={{ 
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  fontSize: 'clamp(1rem, 1.3vw, 1.2rem)', 
                  color: 'rgba(255, 255, 255, 0.72)', 
                  lineHeight: 1.7, 
                  marginBottom: '36px',
                  textShadow: '0 2px 5px rgba(0,0,0,0.5)',
                  maxWidth: '520px'
                }}>
                  Where legacy builders meet verified portfolios — Hinjewadi, Wakad, Baner & Pune's most prestigious areas.
                </p>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('listings-anchor');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)',
                      border: 'none',
                      color: '#040814',
                      padding: '14px 32px',
                      borderRadius: '30px',
                      fontWeight: 700,
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '0.85rem',
                      letterSpacing: '0.06em',
                      cursor: 'pointer',
                      boxShadow: '0 8px 24px rgba(230, 195, 92, 0.3)',
                      transition: 'all 0.3s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(230, 195, 92, 0.4)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(230, 195, 92, 0.3)';
                    }}
                  >
                    <span>EXPLORE PROJECTS</span>
                    <ArrowRight size={14} />
                  </button>
                  
                  <button 
                    onClick={handleOpenInquiry}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(230, 195, 92, 0.3)',
                      color: '#FFF4D0',
                      padding: '14px 32px',
                      borderRadius: '30px',
                      fontWeight: 700,
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '0.85rem',
                      letterSpacing: '0.06em',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(230, 195, 92, 0.05)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <Phone size={14} style={{ color: '#E6C35C' }} />
                    <span>TALK TO EXPERT</span>
                  </button>
                </div>
              </div>

              {/* Hero scroll indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', animation: 'fadeIn 2s ease 1.5s both' }}>
                <span style={{ fontSize: '0.68rem', color: 'rgba(197,168,128,0.6)', letterSpacing: '0.1em', fontFamily: "'Montserrat', sans-serif", textTransform: 'uppercase' }}>Discover Properties</span>
                <div style={{ width: '1px', height: '16px', background: 'rgba(197,168,128,0.3)' }} />
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(197,168,128,0.55)" strokeWidth="1.5" style={{ animation: 'float 2s ease-in-out infinite' }}>
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </div>

              {/* Futuristic Raycast Command Bar */}
              <div
                onClick={() => setIsSpotlightOpen(true)}
                className="tech-command-bar"
                style={{
                  width: "100%",
                  maxWidth: "720px",
                  background: "rgba(7, 15, 30, 0.45)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(230, 195, 92, 0.25)",
                  borderRadius: "16px",
                  padding: "16px 24px",
                  margin: "40px auto 0 auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255,255,255,0.05), 0 0 0 1px rgba(230, 195, 92, 0.05)",
                  transition: "all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "rgba(230, 195, 92, 0.5)";
                  e.currentTarget.style.boxShadow = "0 24px 50px rgba(0, 0, 0, 0.5), 0 0 15px rgba(230, 195, 92, 0.1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(230, 195, 92, 0.25)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255,255,255,0.05), 0 0 0 1px rgba(230, 195, 92, 0.05)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px", color: "rgba(255, 255, 255, 0.5)" }}>
                  <span style={{ color: "#E6C35C", fontSize: "1.1rem" }}>🔍</span>
                  <span style={{ fontSize: "0.92rem", fontFamily: "'Montserrat', sans-serif", fontWeight: 500, letterSpacing: "0.02em", color: "#fff" }}>
                    Search listings, developers, or type a command...
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "0.68rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "3px 8px", color: "rgba(255,255,255,0.4)", fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>
                    CTRL
                  </span>
                  <span style={{ fontSize: "0.68rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "3px 8px", color: "rgba(255,255,255,0.4)", fontFamily: "'Montserrat', sans-serif", fontWeight: 700 }}>
                    K
                  </span>
                </div>
              </div>

            </div>
          </section>

          {/* ⚜️ Trust statistics Counter Ribbon */}
          <section className="trust-stats-section" style={{
            background: 'rgba(7, 15, 30, 0.45)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(230, 195, 92, 0.15)',
            borderRadius: '24px',
            padding: '28px 40px',
            maxWidth: '94%',
            margin: '-40px auto 40px auto',
            position: 'relative',
            zIndex: 3,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
          }}>
            <div className="trust-stats-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '30px',
              alignItems: 'center'
            }}>
              <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'rgba(230, 195, 92, 0.08)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(230,195,92,0.15)' }}>
                  <Users size={24} color="#E6C35C" />
                </div>
                <div>
                  <div className="stat-number" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#E6C35C', fontFamily: "'Cinzel', serif" }}>
                    <AnimatedCounter value="500+" />
                  </div>
                  <div className="stat-label" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Families Assisted</div>
                </div>
              </div>
              
              <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'rgba(230, 195, 92, 0.08)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(230,195,92,0.15)' }}>
                  <IndianRupee size={24} color="#E6C35C" />
                </div>
                <div>
                  <div className="stat-number" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#E6C35C', fontFamily: "'Cinzel', serif" }}>
                    <AnimatedCounter value="800Cr+" />
                  </div>
                  <div className="stat-label" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Certified Sales</div>
                </div>
              </div>
              
              <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'rgba(230, 195, 92, 0.08)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(230,195,92,0.15)' }}>
                  <ShieldCheck size={24} color="#E6C35C" />
                </div>
                <div>
                  <div className="stat-number" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#E6C35C', fontFamily: "'Cinzel', serif" }}>
                    <AnimatedCounter value="100%" />
                  </div>
                  <div className="stat-label" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Verified Listings</div>
                </div>
              </div>
              
              <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'rgba(230, 195, 92, 0.08)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(230,195,92,0.15)' }}>
                  <Handshake size={24} color="#E6C35C" />
                </div>
                <div>
                  <div className="stat-number" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#E6C35C', fontFamily: "'Cinzel', serif" }}>
                    <AnimatedCounter value="15+" />
                  </div>
                  <div className="stat-label" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Top Builder Partnerships</div>
                </div>
              </div>
            </div>
          </section>

          {/* ⚜️ Premium Builder Alliance — Thin Editorial Strip */}
          <section className="builder-showcase-section" style={{ 
            padding: '32px 0 48px 0',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ maxWidth: '94%', margin: '0 auto' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                gap: '40px',
                flexWrap: 'wrap'
              }}>
                <span style={{ 
                  fontSize: '0.6rem', 
                  color: 'rgba(255,255,255,0.25)',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 700,
                  whiteSpace: 'nowrap'
                }}>Authorized Advisors For</span>
                {['LODHA', 'KOLTE-PATIL', 'GODREJ', 'VTP REALTY', 'SHAPOORJI', 'PANCHSHIL'].map(name => (
                  <span key={name} style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: 'rgba(255,255,255,0.22)',
                    letterSpacing: '0.1em',
                    fontFamily: "'Cinzel', serif",
                    transition: 'color 0.3s ease, text-shadow 0.3s ease',
                    cursor: 'default'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'rgba(197,168,128,0.7)';
                    e.currentTarget.style.textShadow = '0 0 12px rgba(197,168,128,0.2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.22)';
                    e.currentTarget.style.textShadow = 'none';
                  }}>
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </section>

      {/* MahaRERA Authorized Trust Banner */}
      <div id="maharera-trust-banner" className="maharera-trust-banner" style={{ border: '2px solid rgba(212,175,55,0.4)', background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.95) 0%, rgba(7, 15, 30, 0.98) 100%)', borderRadius: '12px', padding: '24px 30px', margin: '30px auto', maxWidth: '1410px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
        <div className="maharera-content" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(212,175,55,0.1)', padding: '15px', borderRadius: '50%', border: '1px solid var(--gold-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={36} color="var(--gold-primary)" className="trust-shield-icon" style={{ filter: 'drop-shadow(0 0 8px var(--gold-primary))' }} />
          </div>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '1.25rem', fontFamily: 'var(--font-title)', color: 'var(--text-light)', letterSpacing: '0.04em' }}>⚜️ MahaRERA Registered Authorized Portfolio Advisory</h4>
            <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Authorized Broker License Registration Number: <strong style={{ color: 'var(--gold-primary)' }}>A52100028461</strong>. 24K Realtors strictly complies with Maharashtra Real Estate Regulatory Authority guidelines. All pricing, layout structures, and inventories are verified directly with builder RERA registries prior to listing onboarding.</p>
          </div>
        </div>
      </div>

      {/* 24K AI Location Advisor Panel */}
      {/* AI Area Match Teaser — full panel moved to floating modal */}
      <div style={{ maxWidth: '94%', margin: '0 auto 40px auto', padding: '0 20px' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(7,15,30,0.9) 0%, rgba(15,28,46,0.8) 100%)', border: '1px solid rgba(197,168,128,0.18)', borderRadius: '16px', padding: '28px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(197,168,128,0.12) 0%, transparent 70%)', border: '1px solid rgba(197,168,128,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={22} color="#E6C35C" />
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontFamily: "'Cinzel', serif", fontSize: '1.05rem', color: '#fff', fontWeight: 700, letterSpacing: '0.02em' }}>AI Area Recommendation</h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>Answer 3 questions — get your ideal Pune West location match</p>
            </div>
          </div>
          <button
            onClick={() => setIsAiModalOpen(true)}
            style={{ background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)', border: 'none', color: '#040814', padding: '12px 28px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800, fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.08em', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 15px rgba(197,168,128,0.25)', transition: 'all 0.3s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(197,168,128,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(197,168,128,0.25)'; }}
          >
            Get My Match →
          </button>
        </div>
      </div>

      {/* Editorial Section Divider */}
      <div style={{ maxWidth: '94%', margin: '0 auto 48px auto', display: 'flex', alignItems: 'center', gap: '20px', padding: '0 20px' }}>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(197,168,128,0.2))' }} />
        <span style={{ fontSize: '0.62rem', color: 'rgba(197,168,128,0.45)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Cinzel', serif", whiteSpace: 'nowrap' }}>Live Market Intelligence</span>
        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(197,168,128,0.2))' }} />
      </div>

      {/* Interactive Corridor Cards Grid with Live Metrics */}
      <section className="areas-section" id="areas">
        <div className="section-header">
          <h2 className="luxury-title reveal-mask">
            <span className="reveal-mask-content">Pune West Market Intelligence</span>
          </h2>
          <p className="section-subtitle reveal-fade-up">Select an area to explore live pricing and average appreciation index metrics</p>
        </div>
        
        <div className="areas-grid">
          {areaData.map((area) => (
            <div 
              key={area.id} 
              className={`area-card ${filters.location === area.id ? 'active' : ''}`}
              onClick={() => handleCorridorClick(area.id)}
            >
              <div className="area-card-glow"></div>
              <div className="area-icon-wrapper">{area.icon}</div>
              <div className="area-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h3 style={{ margin: 0 }}>{area.name}</h3>
                  <span className="growth-indicator">{area.growth}</span>
                </div>
                <p style={{ marginBottom: '8px' }}>{area.tagline}</p>
                <div className="area-metrics">
                  <span>Avg. Price: <strong>{area.pricePerSqft}/sqft</strong></span>
                  <span>Yield: <strong>{area.yield}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="philosophy-section" id="philosophy">
        <div className="section-header">
          <h2 className="luxury-title">The Best Location Depends On</h2>
          <p className="section-subtitle">Our proprietary advice framework for premium real estate investment</p>
        </div>

        <div className="philosophy-grid">
          <div className="philosophy-card">
            <div className="ph-icon-wrapper"><IndianRupee size={24} /></div>
            <h3>Your Budget</h3>
            <p>From luxury 2 BHK apartments in Wakad to premium commercial properties in Hinjewadi to fit your goals.</p>
          </div>
          <div className="philosophy-card">
            <div className="ph-icon-wrapper"><Car size={24} /></div>
            <h3>Daily Commute</h3>
            <p>Strategic locations offering direct access to Hinjewadi IT parks, Baner offices, and highway routes.</p>
          </div>
          <div className="philosophy-card">
            <div className="ph-icon-wrapper"><Users size={24} /></div>
            <h3>Family Needs</h3>
            <p>Proximity to top-tier schools, premium high street retail, healthcare centers, and fitness centers.</p>
          </div>
          <div className="philosophy-card">
            <div className="ph-icon-wrapper"><LineChart size={24} /></div>
            <h3>Investment Goals</h3>
            <p>Appreciation-rich areas delivering strong capital growth and consistent rental yields.</p>
          </div>
        </div>
      </section>

      {/* Main Listings and Directories Container with Luxury Ambient Background */}
      <div className="subpage-ambient-bg">
        <div className="main-portal-listings-section" style={{ maxWidth: '1410px', margin: '0 auto', padding: '0 20px' }}>
            
            {activeSection === 'listings' && (
              <>
                {/* Ultra-Premium Subpage Header Banner */}
                <div className="subpage-header-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{ margin: 0, fontFamily: "'Cinzel', serif", fontSize: 'clamp(1rem, 4vw, 1.45rem)', color: '#fff', letterSpacing: '0.03em' }}>
                      ⚜️ Verified Estates &amp; Luxury Portfolios
                    </h2>
                    <span style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.65)', fontFamily: "'Montserrat', sans-serif", marginTop: '4px', display: 'block', lineHeight: 1.5 }}>
                      Curated MahaRERA verified residences · Hinjewadi, Wakad, Baner
                    </span>
                  </div>
                  {/* Badges — hide on very small mobile, show on tablet+ */}
                  <div className="subpage-banner-badges" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <div className="subpage-stats-badge">
                      <span>📌 {allRawProperties.length || 22}+ Listings</span>
                    </div>
                    <div className="subpage-stats-badge" style={{ background: 'rgba(37,211,102,0.08)', borderColor: 'rgba(37,211,102,0.3)', color: '#25D366' }}>
                      <span>🛡️ MahaRERA</span>
                    </div>
                    <div className="subpage-stats-badge" style={{ background: 'rgba(46,196,182,0.08)', borderColor: 'rgba(46,196,182,0.3)', color: '#2EC4B6' }}>
                      <span>💎 0% Brokerage</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic Advanced Filtering */}
                <section className="filter-section" id="listings-anchor">
                <h2 className="filter-title">
                  <Search size={18} />
                  Refine Your Property Search
                </h2>
                <form onSubmit={handleApplyFilters} className="filter-grid">
                  <div className="form-group">
                    <label className="form-label">Location Corridor</label>
                    <select name="location" value={filters.location} onChange={handleFilterChange} className="form-input">
                      <option value="">All Pune West Corridors</option>
                      <option value="HINJEWADI">Hinjewadi IT Zone</option>
                      <option value="WAKAD">Wakad Junction</option>
                      <option value="BANER">Baner</option>
                      <option value="BALEWADI">Balewadi High Street</option>
                      <option value="TATHAWADE">Tathawade Hub</option>
                      <option value="MAHALUNGE">Mahalunge Township</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Property Typology</label>
                    <select name="propertyType" value={filters.propertyType} onChange={handleFilterChange} className="form-input">
                      <option value="">All Types (Res. & Com.)</option>
                      <option value="RESIDENTIAL">Residential Apartments</option>
                      <option value="COMMERCIAL">Commercial Workspaces</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Transaction</label>
                    <select name="transactionType" value={filters.transactionType} onChange={handleFilterChange} className="form-input">
                      <option value="">Buy & Rent Inventory</option>
                      <option value="BUY">For Sale (Direct Purchase)</option>
                      <option value="RENT">To Rent (Monthly Yield)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bedrooms (BHK)</label>
                    <select name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange} className="form-input">
                      <option value="">Any Layout</option>
                      <option value="1">1 BHK Layout</option>
                      <option value="2">2 BHK Smart layout</option>
                      <option value="3">3 BHK Premium layout</option>
                      <option value="4">4 BHK Penthouse/Elite</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Furnishing</label>
                    <select name="furnishingStatus" value={filters.furnishingStatus} onChange={handleFilterChange} className="form-input">
                      <option value="">Any furnishing</option>
                      <option value="FULLY_FURNISHED">Fully Furnished</option>
                      <option value="SEMI_FURNISHED">Semi Furnished</option>
                      <option value="UNFURNISHED">Unfurnished</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
                    <button type="submit" className="btn-gold" style={{ flexGrow: 1, height: '42px', justifyContent: 'center' }}>
                      Apply Filter
                    </button>
                    <button type="button" onClick={handleResetFilters} className="btn-outline" style={{ height: '42px', padding: '0 15px' }} title="Reset Filters">
                      Reset
                    </button>
                  </div>
                </form>
              </section>

              {/* Listings Controls — Responsive two-row layout */}
              <div style={{ marginBottom: '24px' }}>
                {/* Row 1: Count + View Toggle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                  <span className="total-found-badge" style={{ margin: 0, fontSize: 'clamp(0.72rem, 2.5vw, 0.8rem)' }}>
                    🏢 {totalElements} listings · {filters.location || 'Pune West'}
                  </span>
                  <div style={{ display: 'flex', background: 'rgba(7,15,30,0.6)', border: '1px solid rgba(197,168,128,0.15)', borderRadius: '50px', padding: '3px', gap: '2px' }}>
                    <button
                      onClick={() => setViewMode('GRID')}
                      type="button"
                      style={{ background: viewMode === 'GRID' ? 'linear-gradient(135deg, rgba(197,168,128,0.15), rgba(212,175,55,0.08))' : 'transparent', border: viewMode === 'GRID' ? '1px solid rgba(197,168,128,0.35)' : '1px solid transparent', color: viewMode === 'GRID' ? '#E6C35C' : 'rgba(255,255,255,0.45)', padding: '7px 14px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700, fontFamily: "'Montserrat', sans-serif", cursor: 'pointer', transition: 'all 0.25s ease', whiteSpace: 'nowrap' }}
                    >
                      ☰ Grid
                    </button>
                    <button
                      onClick={() => setViewMode('MAP')}
                      type="button"
                      style={{ background: viewMode === 'MAP' ? 'linear-gradient(135deg, rgba(197,168,128,0.15), rgba(212,175,55,0.08))' : 'transparent', border: viewMode === 'MAP' ? '1px solid rgba(197,168,128,0.35)' : '1px solid transparent', color: viewMode === 'MAP' ? '#E6C35C' : 'rgba(255,255,255,0.45)', padding: '7px 14px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700, fontFamily: "'Montserrat', sans-serif", cursor: 'pointer', transition: 'all 0.25s ease', whiteSpace: 'nowrap' }}
                    >
                      🗺️ Map
                    </button>
                  </div>
                </div>
                {/* Row 2: Segmented Category Pills — full width horizontal scroll */}
                <div className="luxury-segmented-controls" style={{ display: 'flex', overflowX: 'auto', paddingBottom: '6px', scrollbarWidth: 'none', msOverflowStyle: 'none', gap: '6px', flexWrap: 'nowrap' }}>
                  {[
                    { id: 'ALL', label: 'All', icon: '\u2726', count: allRawProperties.length },
                    { id: 'APARTMENT', label: 'Apartments', icon: '\ud83c\udfe2', count: allRawProperties.filter(p => p.propertyType === 'RESIDENTIAL' && (p.bedrooms || 0) <= 3).length },
                    { id: 'VILLA', label: 'Villas', icon: '\ud83c\udfe1', count: allRawProperties.filter(p => (p.bedrooms || 0) >= 4 && p.propertyType === 'RESIDENTIAL').length },
                    { id: 'PENTHOUSE', label: 'Penthouse', icon: '\ud83c\udf06', count: allRawProperties.filter(p => (p.bedrooms || 0) >= 4).length },
                    { id: 'COMMERCIAL', label: 'Commercial', icon: '\ud83c\udfe6', count: allRawProperties.filter(p => p.propertyType === 'COMMERCIAL').length },
                    { id: 'READY', label: 'Ready', icon: '\u2705', count: allRawProperties.filter(p => p.status === 'AVAILABLE' && p.transactionType === 'BUY').length },
                    { id: 'NEW', label: 'New Launch', icon: '\ud83d\ude80', count: allRawProperties.filter(p => (p.title || '').toLowerCase().includes('vyomora') || (p.title || '').toLowerCase().includes('ivara') || (p.title || '').toLowerCase().includes('joyville') || (p.title || '').toLowerCase().includes('elements')).length },
                    { id: 'RENT', label: 'Rent', icon: '\ud83d\udd11', count: allRawProperties.filter(p => p.transactionType === 'RENT').length },
                    { id: 'WISHLIST', label: 'Saved', icon: '\u2665', count: wishlistIds.length },
                  ].map(({ id, label, icon, count }) => (
                    <button
                      key={id}
                      onClick={() => handleCollectionChange(id)}
                      className={`luxury-segment-btn ${activeCollection === id ? 'active' : ''}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}
                    >
                      <span style={{ fontSize: '0.82em' }}>{icon}</span>
                      {label}
                      {count > 0 && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '17px', height: '17px', borderRadius: '50px', padding: '0 4px', fontSize: '0.58rem', fontWeight: 800, background: activeCollection === id ? 'rgba(7,15,30,0.5)' : 'rgba(197,168,128,0.08)', color: activeCollection === id ? '#E6C35C' : 'rgba(197,168,128,0.5)', border: `1px solid ${activeCollection === id ? 'rgba(230,195,92,0.4)' : 'rgba(197,168,128,0.2)'}`, marginLeft: '2px' }}>
                          {count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="properties-grid" style={{ minHeight: '400px' }}>
                  {[1, 2, 3, 4, 5, 6].map(i => <PropertySkeleton key={i} />)}
                </div>
              ) : error ? (
                <div className="error-card">{error}</div>
              ) : (!isSearchActive && activeCollection === 'ALL' && !showAllGrid && properties.length > 0) ? (
                renderCuratedCarousels()
              ) : (showAllGrid && properties.length > 0) ? (
                <>
                  {/* Back to curated view */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <button
                      onClick={() => { setShowAllGrid(false); setPage(0); }}
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '50px', padding: '8px 18px', fontSize: '0.72rem', fontWeight: 600, fontFamily: "'Montserrat', sans-serif", cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s ease' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(197,168,128,0.4)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                    >
                      ← Curated View
                    </button>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', fontFamily: "'Montserrat', sans-serif" }}>
                      Showing all {properties.length} verified listings
                    </span>
                  </div>
                  <div className="properties-grid">
                    {properties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        isHnwiMode={isHnwiMode}
                        isCompared={selectedForCompare.some(p => p.id === property.id)}
                        isWishlisted={wishlistIds.includes(property.id)}
                        formatPrice={formatPrice}
                        onToggleCompare={handleToggleCompare}
                        onToggleWishlist={handleToggleWishlist}
                        onOpenRera={handleOpenReraDrawer}
                        onOpenBrochure={(prop) => setSelectedBrochureProperty(prop)}
                        onOpenDetail={(prop) => { setSelectedPropertyDetail(prop); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                      />
                    ))}
                  </div>
                </>
              ) : properties.length === 0 ? (
                <div className="empty-state">
                  <p>No premium properties match the filter configuration.</p>
                  <button onClick={handleResetFilters} className="btn-gold" style={{ marginTop: '10px' }}>Reset Filters</button>
                </div>
              ) : (
                viewMode === "MAP" ? (
                  <div className="map-view-layout" style={{ display: 'flex', gap: '20px', alignItems: 'stretch', minHeight: '500px', marginTop: '20px' }}>
                    <div style={{ flex: "1", maxHeight: "80vh", overflowY: "auto", paddingRight: "8px", scrollbarWidth: "thin" }}>
                      <div className="properties-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                        {properties.map((property) => (
                          <div 
                            key={property.id} 
                            onMouseEnter={() => setHoveredPropertyLoc(property.location)} 
                            onMouseLeave={() => setHoveredPropertyLoc(null)}
                            style={{ transition: 'transform 0.25s ease' }}
                          >
                            <PropertyCard
                              property={property}
                              isHnwiMode={isHnwiMode}
                              isCompared={selectedForCompare.some(p => p.id === property.id)}
                              isWishlisted={wishlistIds.includes(property.id)}
                              formatPrice={formatPrice}
                              onToggleCompare={handleToggleCompare}
                              onToggleWishlist={handleToggleWishlist}
                              onOpenRera={handleOpenReraDrawer}
                              onOpenBrochure={(prop) => setSelectedBrochureProperty(prop)}
                              onOpenDetail={(prop) => {
                                setSelectedPropertyDetail(prop);
                                window.location.hash = `property/${prop.id}`;
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ flex: "1.1", position: "sticky", top: "100px", height: "600px", background: "rgba(7, 15, 30, 0.45)", border: "1px solid rgba(197, 168, 128, 0.25)", borderRadius: "16px", overflow: "hidden" }}>
                      {renderInteractiveVectorMap()}
                    </div>
                  </div>
                ) : (
                  <div className="properties-grid">
                    {properties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        isHnwiMode={isHnwiMode}
                        isCompared={selectedForCompare.some(p => p.id === property.id)}
                        isWishlisted={wishlistIds.includes(property.id)}
                        formatPrice={formatPrice}
                        onToggleCompare={handleToggleCompare}
                        onToggleWishlist={handleToggleWishlist}
                        onOpenRera={handleOpenReraDrawer}
                        onOpenBrochure={(prop) => setSelectedBrochureProperty(prop)}
                        onOpenDetail={(prop) => {
                          setSelectedPropertyDetail(prop);
                          window.location.hash = `property/${prop.id}`;
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      />
                    ))}
                  </div>
                )
              )}
                  {/* Smooth Infinite Scroll Loader Trigger */}
                  {page < totalPages - 1 && (
                    <div id="infinite-scroll-trigger" style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '40px 0',
                      width: '100%'
                    }}>
                      <div className="infinite-scroll-spinner" style={{
                        width: '32px',
                        height: '32px',
                        border: '3px solid rgba(230, 195, 92, 0.15)',
                        borderTopColor: '#E6C35C',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                    </div>
                  )}

            </>
          )}

          {activeSection === 'societies' && (
            selectedSocietyDetail ? (
              <div style={{ animation: 'fadeIn 0.3s forwards' }}>
                <button 
                  onClick={() => setSelectedSocietyDetail(null)} 
                  className="btn-outline" 
                  style={{ marginBottom: '20px', padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid var(--border-gold)', borderRadius: '4px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-light)' }}
                >
                  ← Back to Societies
                </button>

                <div className="exclusive-details-card" style={{ border: '1px solid var(--border-gold)', background: 'radial-gradient(circle at top left, rgba(21, 34, 56, 0.9) 0%, rgba(7, 15, 30, 0.95) 100%)', borderRadius: '12px', padding: '24px', marginBottom: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px', borderBottom: '1px solid var(--border-muted)', paddingBottom: '16px', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '1.6rem', color: 'var(--text-light)' }}>{selectedSocietyDetail.name}</h3>
                      <span style={{ fontSize: '0.78rem', background: 'rgba(212,175,55,0.1)', color: 'var(--gold-primary)', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{selectedSocietyDetail.location}</span>
                      <p style={{ margin: '6px 0 0 0', fontSize: '0.9rem', color: 'var(--gold-primary)' }}>Developer: {selectedSocietyDetail.developer}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Valuation Starts At</span>
                      <strong style={{ fontSize: '1.5rem', color: 'var(--gold-primary)' }}>{formatPrice(selectedSocietyDetail.startingPrice)}</strong>
                    </div>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
                    {selectedSocietyDetail.overview}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-muted)' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>RERA Index ID</span>
                      <strong style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{selectedSocietyDetail.reraNumber}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Project Status</span>
                      <strong style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{selectedSocietyDetail.projectStatus?.replace(/_/g, ' ')}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Possession Date</span>
                      <strong style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{selectedSocietyDetail.possessionDate || 'Immediate'}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Configurations</span>
                      <strong style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{selectedSocietyDetail.configuration || '2 & 3 BHK'}</strong>
                    </div>
                  </div>

                  {selectedSocietyDetail.amenities && (
                    <div style={{ marginBottom: '20px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', marginBottom: '8px' }}>Exclusive Club Amenities</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {selectedSocietyDetail.amenities.split(',').map(am => (
                          <span key={am} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.04)', color: 'var(--text-light)', padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--border-muted)', display: 'flex', alignItems: 'center' }}>
                            {getAmenityIcon(am)} {am.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>IT Parks Commute</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{selectedSocietyDetail.nearbyItParks || 'Nearby Hinjewadis'}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Transit & Metro</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{selectedSocietyDetail.nearbyMetro || 'Wakad/Hinjewadi Metro lines'}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Elite Academies</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{selectedSocietyDetail.nearbySchools || 'Top schools and academies'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', borderTop: '1px solid var(--border-muted)', paddingTop: '15px' }}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <div style={{ background: 'rgba(46,196,182,0.06)', border: '1px solid rgba(46,196,182,0.15)', borderRadius: '6px', padding: '8px 12px', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.62rem', color: '#2ec4b6', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>Investment Score</span>
                        <strong style={{ fontSize: '1.1rem', color: '#2ec4b6' }}>{selectedSocietyDetail.investmentScore || 85}/100</strong>
                      </div>
                      <div style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '6px', padding: '8px 12px', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.62rem', color: 'var(--gold-primary)', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>Avg Rental Yield</span>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--gold-primary)' }}>{selectedSocietyDetail.rentalYield || '4.0'}%</strong>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setSelectedChauffeurProp({ title: `${selectedSocietyDetail.name} Site Inspection`, id: selectedSocietyDetail.id, price: selectedSocietyDetail.startingPrice, location: selectedSocietyDetail.location });
                        setIsChauffeurModalOpen(true);
                      }} 
                      className="btn-gold" 
                      style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                    >
                      Enquire About Society Listings
                    </button>
                  </div>
                </div>

                {/* Society Listings */}
                <div style={{ marginTop: '30px' }}>
                  <h4 style={{ color: 'var(--gold-primary)', fontSize: '1.1rem', marginBottom: '15px', borderBottom: '1px solid var(--border-gold)', paddingBottom: '6px' }}>
                    🏢 Active Inventory in {selectedSocietyDetail.name}
                  </h4>
                  {properties.filter(p => p.society && p.society.id === selectedSocietyDetail.id).length === 0 ? (
                    <div className="empty-state" style={{ padding: '30px', borderStyle: 'dashed' }}>
                      <p style={{ margin: 0 }}>Currently no active listings are registered for this society. Contact our desk for off-market units.</p>
                      <button 
                        onClick={() => {
                          setSelectedChauffeurProp({ title: `${selectedSocietyDetail.name} Off-Market Listings`, id: selectedSocietyDetail.id, price: selectedSocietyDetail.startingPrice, location: selectedSocietyDetail.location });
                          setIsChauffeurModalOpen(true);
                        }}
                        className="btn-gold" 
                        style={{ marginTop: '10px', padding: '6px 12px', fontSize: '0.75rem' }}
                      >
                        Request Off-Market Info
                      </button>
                    </div>
                  ) : (
                    <div className="properties-grid">
                      {properties.filter(p => p.society && p.society.id === selectedSocietyDetail.id).map(property => (
                        <div key={property.id} className="property-card" onClick={() => { setSelectedPropertyDetail(property); setActiveSection('listings'); window.scrollTo({ top: 400, behavior: 'smooth' }); }} style={{ cursor: 'pointer' }}>
                          <div className="property-card-image" style={{ height: '140px', backgroundImage: `url('${property.imageUrl || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80"}')` }}>
                            <div className="card-top-badges">
                              <span className="location-badge" style={{ fontSize: '0.65rem' }}>{property.location}</span>
                            </div>
                          </div>
                          <div style={{ padding: '10px' }}>
                            <h5 style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{property.title}</h5>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{property.bedrooms} BHK | {property.areaSquareFeet} SqFt</p>
                            <strong style={{ display: 'block', margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--gold-primary)' }}>{formatPrice(property.price, property.transactionType)}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ animation: 'fadeIn 0.3s forwards' }}>
                <h2 className="luxury-title" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>⚜️ Premium Societies & Townships Index</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '25px', lineHeight: 1.5 }}>
                  Discover tier-1 residential developments, integrated smart townships, and luxury high-rise communities across Pune West's growth areas. Direct developer mandates with 0% brokerage.
                </p>

                {directoriesLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
                    <Loader className="animate-spin" size={32} color="#D4AF37" />
                  </div>
                ) : societies.length === 0 ? (
                  <div className="empty-state">No societies data loaded. Check connection.</div>
                ) : (
                  <div className="societies-grid">
                    {societies.map(soc => (
                      <div key={soc.id} className="society-grid-card">
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
                            <h3 
                              onClick={() => setSelectedSocietyDetail(soc)}
                              style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-light)', cursor: 'pointer', fontFamily: 'var(--font-title)', textDecoration: 'underline' }}
                            >
                              {soc.name}
                            </h3>
                            <span className="society-metric-badge" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold-primary)', border: '1px solid rgba(212,175,55,0.2)' }}>
                              {soc.location}
                            </span>
                          </div>

                          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {soc.overview}
                          </p>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 15px', marginBottom: '16px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '12px' }}>
                            <div>
                              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>RERA Registration</span>
                              <strong style={{ color: 'var(--text-light)', fontSize: '0.78rem', wordBreak: 'break-all' }}>{soc.reraNumber}</strong>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Possession</span>
                              <strong style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>{soc.possessionDate || 'Immediate'}</strong>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Configurations</span>
                              <strong style={{ color: 'var(--text-light)', fontSize: '0.78rem' }}>{soc.configuration || '2 & 3 BHK'}</strong>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Starting Val.</span>
                              <strong style={{ color: 'var(--gold-primary)', fontSize: '0.82rem' }}>{formatPrice(soc.startingPrice)}</strong>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '14px', marginTop: '10px' }}>
                            <button 
                              onClick={() => setSelectedSocietyDetail(soc)} 
                              className="btn-outline" 
                              style={{ flex: 1, padding: '8px 0', fontSize: '0.78rem', justifyContent: 'center' }}
                            >
                              Explore
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedChauffeurProp({ title: `${soc.name} Site Inspection`, id: soc.id, price: soc.startingPrice, location: soc.location });
                                setIsChauffeurModalOpen(true);
                              }} 
                              className="btn-gold" 
                              style={{ flex: 1, padding: '8px 0', fontSize: '0.78rem', justifyContent: 'center' }}
                            >
                              Enquire
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          )}

          {activeSection === 'builders' && (
            selectedBuilderDetail ? (
              <div style={{ animation: 'fadeIn 0.3s forwards' }}>
                <button 
                  onClick={() => setSelectedBuilderDetail(null)} 
                  className="btn-outline" 
                  style={{ marginBottom: '20px', padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid var(--border-gold)', borderRadius: '4px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-light)' }}
                >
                  ← Back to Developers
                </button>

                <div className="exclusive-details-card" style={{ border: '1px solid var(--border-gold)', background: 'rgba(7,15,30,0.85)', borderRadius: '12px', padding: '24px', marginBottom: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-gold)', paddingBottom: '16px', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--text-light)', fontFamily: 'var(--font-title)' }}>{selectedBuilderDetail.name}</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', fontWeight: 'bold' }}>⚜️ Preferred Partner Developer</span>
                    </div>
                    {selectedBuilderDetail.awards && (
                      <div style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid var(--gold-primary)', color: 'var(--gold-primary)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                        🏆 {selectedBuilderDetail.awards}
                      </div>
                    )}
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '20px' }}>
                    {selectedBuilderDetail.description}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', textAlign: 'center', marginBottom: '25px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-muted)' }}>
                    <div>
                      <strong style={{ fontSize: '1.4rem', color: 'var(--gold-primary)', display: 'block' }}>{selectedBuilderDetail.experienceYears || '20'}+</strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Years Experience</span>
                    </div>
                    <div>
                      <strong style={{ fontSize: '1.4rem', color: 'var(--text-light)', display: 'block' }}>{selectedBuilderDetail.completedProjectsCount || '40'}+</strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Projects Delivered</span>
                    </div>
                    <div>
                      <strong style={{ fontSize: '1.4rem', color: 'var(--text-light)', display: 'block' }}>{selectedBuilderDetail.ongoingProjectsCount || '6'} Active</strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Ongoing</span>
                    </div>
                  </div>

                  {/* Timeline of Delivered Projects */}
                  <div style={{ marginBottom: '30px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>⚜️ Construction Milestones & Delivered Portfolios</span>
                    <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', padding: '15px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ minWidth: '160px', flex: 1, background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-muted)', borderRadius: '8px', padding: '12px', position: 'relative' }}>
                        <div style={{ width: '8px', height: '8px', background: 'var(--gold-primary)', borderRadius: '50%', position: 'absolute', top: '-4px', left: '15px', boxShadow: '0 0 8px var(--gold-primary)' }} />
                        <span style={{ fontSize: '0.9rem', color: 'var(--gold-primary)', fontWeight: 'bold', display: 'block' }}>2018 - 2020</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600, display: 'block', margin: '4px 0' }}>Launch Epoch</span>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Delivered 1200+ units in Wakad and Baners.</p>
                      </div>
                      <div style={{ minWidth: '160px', flex: 1, background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-muted)', borderRadius: '8px', padding: '12px', position: 'relative' }}>
                        <div style={{ width: '8px', height: '8px', background: 'var(--gold-primary)', borderRadius: '50%', position: 'absolute', top: '-4px', left: '15px', boxShadow: '0 0 8px var(--gold-primary)' }} />
                        <span style={{ fontSize: '0.9rem', color: 'var(--gold-primary)', fontWeight: 'bold', display: 'block' }}>2021 - 2023</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600, display: 'block', margin: '4px 0' }}>IT Hub Integration</span>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Completed Phase 1 & 2 corporate housing in Hinjewadi.</p>
                      </div>
                      <div style={{ minWidth: '160px', flex: 1, background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-muted)', borderRadius: '8px', padding: '12px', position: 'relative' }}>
                        <div style={{ width: '8px', height: '8px', background: '#2ec4b6', borderRadius: '50%', position: 'absolute', top: '-4px', left: '15px', boxShadow: '0 0 8px #2ec4b6' }} />
                        <span style={{ fontSize: '0.9rem', color: '#2ec4b6', fontWeight: 'bold', display: 'block' }}>2024 - 2026</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: 600, display: 'block', margin: '4px 0' }}>Smart Townships</span>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Mahalunge and Balewadi high-rise luxury units possession.</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Active projects developed: <strong>{societies.filter(s => s.developer === selectedBuilderDetail.name || s.builder?.name === selectedBuilderDetail.name).length} Gated Communities</strong>
                    </span>
                    <button 
                      onClick={() => {
                        setVipForm({ name: '', phone: '' });
                        setCountdown(60);
                        showNotification(`Consultation scheduled for developer ${selectedBuilderDetail.name}. Relationship Manager is connecting.`);
                      }} 
                      className="btn-gold"
                      style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                    >
                      Request Developer Consultation
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '30px' }}>
                  <h4 style={{ color: 'var(--gold-primary)', fontSize: '1.1rem', marginBottom: '15px', borderBottom: '1px solid var(--border-gold)', paddingBottom: '6px' }}>
                    🏢 Townships Developed by {selectedBuilderDetail.name}
                  </h4>
                  {societies.filter(s => s.developer === selectedBuilderDetail.name || s.builder?.name === selectedBuilderDetail.name).length === 0 ? (
                    <div className="empty-state">No gated townships currently listed for this developer.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {societies.filter(s => s.developer === selectedBuilderDetail.name || s.builder?.name === selectedBuilderDetail.name).map(soc => (
                        <div key={soc.id} className="exclusive-details-card" style={{ border: '1px solid var(--border-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                          <div>
                            <h5 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#fff' }}>{soc.name}</h5>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📍 Location: {soc.location} Corridor</span>
                          </div>
                          <button 
                            onClick={() => { setSelectedSocietyDetail(soc); setActiveSection('societies'); }}
                            className="btn-gold" 
                            style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                          >
                            Explore Society
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ animation: 'fadeIn 0.3s forwards' }}>
                <h2 className="luxury-title" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>⚜️ Tier-1 Authorized Developers</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '25px', lineHeight: 1.5 }}>
                  Partnered developer profiles. We coordinate directly with developer core offices to negotiate institutional prices, priority allotments, and zero brokerage terms.
                </p>

                {directoriesLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
                    <Loader className="animate-spin" size={32} color="#D4AF37" />
                  </div>
                ) : builders.length === 0 ? (
                  <div className="empty-state">No developer profiles loaded. Check connection.</div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '25px' }}>
                    {builders.map(bld => (
                      <div key={bld.id} className="exclusive-details-card" style={{ border: '1px solid var(--border-gold)', background: 'rgba(7,15,30,0.7)', borderRadius: '12px', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-muted)', paddingBottom: '16px', marginBottom: '16px' }}>
                          <h3 
                            onClick={() => setSelectedBuilderDetail(bld)}
                            style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-light)', cursor: 'pointer', textDecoration: 'underline' }}
                          >
                            {bld.name}
                          </h3>
                          <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', padding: '4px 8px', borderRadius: '4px' }}>Est. Partner</span>
                        </div>

                        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '20px' }}>
                          {bld.description}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', textAlign: 'center', marginBottom: '20px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                          <div>
                            <strong style={{ fontSize: '1.2rem', color: 'var(--gold-primary)', display: 'block' }}>{bld.experienceYears || '20'}+</strong>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Years Experience</span>
                          </div>
                          <div>
                            <strong style={{ fontSize: '1.2rem', color: 'var(--text-light)', display: 'block' }}>{bld.completedProjectsCount || '35'}+</strong>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Projects Delivered</span>
                          </div>
                          <div>
                            <strong style={{ fontSize: '1.2rem', color: 'var(--text-light)', display: 'block' }}>{bld.ongoingProjectsCount || '8'} Active</strong>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Under Construction</span>
                          </div>
                        </div>

                        {bld.awards && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', marginBottom: '20px', background: 'rgba(212,175,55,0.05)', padding: '8px 12px', borderRadius: '4px', borderLeft: '3px solid var(--gold-primary)' }}>
                            🏆 {bld.awards}
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Active Projects: <strong>{societies.filter(s => s.developer === bld.name || s.builder?.name === bld.name).length} Listed</strong>
                          </span>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                              onClick={() => setSelectedBuilderDetail(bld)} 
                              className="btn-outline" 
                              style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                            >
                              Explore Projects
                            </button>
                            <button 
                              onClick={() => {
                                setVipForm({ name: '', phone: '' });
                                setCountdown(60);
                                showNotification(`Advisory session requested for developer ${bld.name}. RM connecting.`);
                              }} 
                              className="btn-gold" 
                              style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                            >
                              Consult
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          )}

          {activeSection === 'localities' && (
            selectedLocalityDetail ? (
              <div style={{ animation: 'fadeIn 0.3s forwards' }}>
                <button 
                  onClick={() => setSelectedLocalityDetail(null)} 
                  className="btn-outline" 
                  style={{ marginBottom: '20px', padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid var(--border-gold)', borderRadius: '4px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-light)' }}
                >
                  ← Back to Locality Guides
                </button>

                <div className="exclusive-details-card" style={{ border: '1px solid var(--border-gold)', background: 'rgba(7,15,30,0.85)', borderRadius: '12px', padding: '24px', marginBottom: '30px' }}>
                  <div style={{ borderBottom: '1px solid var(--border-gold)', paddingBottom: '16px', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--text-light)', fontFamily: 'var(--font-title)' }}>{selectedLocalityDetail.name} Corridor Guide</h3>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.7, marginBottom: '20px' }}>
                    {selectedLocalityDetail.overview}
                  </p>

                  <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '25px' }}>
                    {renderScoreCircle("Commute Index", selectedLocalityDetail.commuteIndex || '8.8', 10, '#2ec4b6')}
                    {renderScoreCircle("Civic Infra", selectedLocalityDetail.civicInfraScore || '9.0', 10, 'var(--gold-primary)')}
                    {renderScoreCircle("Safety Rating", selectedLocalityDetail.safetyScore || '9.2', 10, '#2ec4b6')}
                    {renderScoreCircle("CAGR Growth", selectedLocalityDetail.cagrAppreciation || '8.5', 10, 'var(--gold-primary)')}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '25px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-muted)' }}>
                      <strong style={{ color: 'var(--gold-primary)', display: 'block', fontSize: '0.85rem', marginBottom: '6px' }}>🚗 Connectivity</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{selectedLocalityDetail.connectivityInfo}</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-muted)' }}>
                      <strong style={{ color: 'var(--gold-primary)', display: 'block', fontSize: '0.85rem', marginBottom: '6px' }}>🎓 Schools</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{selectedLocalityDetail.schools}</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-muted)' }}>
                      <strong style={{ color: 'var(--gold-primary)', display: 'block', fontSize: '0.85rem', marginBottom: '6px' }}>🏥 Healthcare</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{selectedLocalityDetail.hospitals}</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-muted)' }}>
                      <strong style={{ color: 'var(--gold-primary)', display: 'block', fontSize: '0.85rem', marginBottom: '6px' }}>📈 Investment</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{selectedLocalityDetail.investmentAnalysis} (Demand: {selectedLocalityDetail.rentalDemand})</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#2ec4b6' }}>
                      🚇 Metro Lines: <strong>{selectedLocalityDetail.metroConnectivity || 'Active planning'}</strong>
                    </span>
                    <button 
                      onClick={() => {
                        setVipForm({ name: '', phone: '' });
                        setCountdown(60);
                        showNotification(`Locality investment report requested for ${selectedLocalityDetail.name}. Connecting Director.`);
                      }} 
                      className="btn-gold"
                      style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                    >
                      Request Locality Advisory Report
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '30px' }}>
                  <h4 style={{ color: 'var(--gold-primary)', fontSize: '1.1rem', marginBottom: '15px', borderBottom: '1px solid var(--border-gold)', paddingBottom: '6px' }}>
                    🏢 Premium Townships in {selectedLocalityDetail.name}
                  </h4>
                  {societies.filter(s => s.location?.toString().toUpperCase() === selectedLocalityDetail.slug?.toUpperCase() || s.location?.toString().toUpperCase() === selectedLocalityDetail.name?.toUpperCase()).length === 0 ? (
                    <div className="empty-state">No gated townships currently listed in this area.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {societies.filter(s => s.location?.toString().toUpperCase() === selectedLocalityDetail.slug?.toUpperCase() || s.location?.toString().toUpperCase() === selectedLocalityDetail.name?.toUpperCase()).map(soc => (
                        <div key={soc.id} className="exclusive-details-card" style={{ border: '1px solid var(--border-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                          <div>
                            <h5 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#fff' }}>{soc.name}</h5>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Developed by {soc.developer}</span>
                          </div>
                          <button 
                            onClick={() => { setSelectedSocietyDetail(soc); setActiveSection('societies'); }}
                            className="btn-gold" 
                            style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                          >
                            Explore Society
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ animation: 'fadeIn 0.3s forwards' }}>
                <h2 className="luxury-title" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>⚜️ Pune West Corridor Connectivity & Locality Guides</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '25px', lineHeight: 1.5 }}>
                  Understand connectivity indexes, civic infrastructure, upcoming metro networks, and investment appreciation cagrs before buying or renting.
                </p>

                {directoriesLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
                    <Loader className="animate-spin" size={32} color="#D4AF37" />
                  </div>
                ) : localities.length === 0 ? (
                  <div className="empty-state">No locality guides data loaded. Check connection.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    {localities.map(loc => (
                      <div key={loc.id} className="exclusive-details-card" style={{ border: '1px solid var(--border-gold)', background: 'rgba(7,15,30,0.7)', borderRadius: '12px', padding: '24px' }}>
                        <h3 
                          onClick={() => setSelectedLocalityDetail(loc)}
                          style={{ margin: '0 0 10px 0', fontSize: '1.3rem', color: 'var(--text-light)', borderBottom: '1px solid var(--border-muted)', paddingBottom: '10px', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          {loc.name} Locality Profile
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '20px' }}>
                          {loc.overview}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                          <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-muted)' }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--gold-primary)', display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>🚗 Connectivity & Transit</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{loc.connectivityInfo}</span>
                          </div>
                          <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-muted)' }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--gold-primary)', display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>🎓 Elite Educational Academies</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{loc.schools}</span>
                          </div>
                          <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-muted)' }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--gold-primary)', display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>🏥 Healthcare Establishments</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{loc.hospitals}</span>
                          </div>
                          <div style={{ background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-muted)' }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--gold-primary)', display: 'block', fontSize: '0.85rem', marginBottom: '4px' }}>📈 Investment Analysis & Yields</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{loc.investmentAnalysis} ({loc.rentalDemand})</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                          <span style={{ fontSize: '0.8rem', color: '#2ec4b6' }}>
                            🚇 Metro Lines: <strong>{loc.metroConnectivity || 'Under active layout planning'}</strong>
                          </span>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                              onClick={() => setSelectedLocalityDetail(loc)} 
                              className="btn-outline" 
                              style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                            >
                              Explore Locality
                            </button>
                            <button 
                              onClick={() => {
                                setVipForm({ name: '', phone: '' });
                                setCountdown(60);
                                showNotification(`Locality investment report requested for ${loc.name}. Connecting Director...`);
                              }} 
                              className="btn-gold" 
                              style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                            >
                              Request Report
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          )}

          {activeSection === 'blogs' && (
            selectedBlogDetail ? (
              // Blog Reader View
              <div style={{ animation: 'fadeIn 0.3s forwards' }}>
                <button 
                  onClick={() => setSelectedBlogDetail(null)} 
                  className="btn-outline" 
                  style={{ marginBottom: '20px', padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid var(--border-gold)', borderRadius: '4px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-light)' }}
                >
                  ← Back to Articles
                </button>

                <article className="exclusive-details-card" style={{ border: '1px solid var(--border-gold)', background: 'rgba(7,15,30,0.85)', borderRadius: '12px', padding: '0', overflow: 'hidden', marginBottom: '30px' }}>
                  {selectedBlogDetail.coverImageUrl && (
                    <div style={{ width: '100%', height: '350px', backgroundImage: `url(${selectedBlogDetail.coverImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '1px solid var(--border-gold)' }} />
                  )}
                  <div style={{ padding: '30px' }}>
                    <h1 style={{ margin: '0 0 15px 0', fontSize: '2rem', color: 'var(--text-light)', fontFamily: 'var(--font-title)', lineHeight: 1.3 }}>
                      {selectedBlogDetail.title}
                    </h1>

                    <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '25px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '15px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        ✍️ Written by: <strong style={{ color: 'var(--gold-primary)' }}>{selectedBlogDetail.author || 'Admin'}</strong>
                      </span>
                      <span>
                        📅 Published: <strong>{new Date(selectedBlogDetail.createdDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                      </span>
                    </div>

                    <div 
                      className="blog-rich-content" 
                      style={{ color: 'var(--text-light)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '30px' }}
                      dangerouslySetInnerHTML={{ __html: selectedBlogDetail.content }}
                    />
                    
                    <div style={{ background: 'rgba(212, 175, 55, 0.05)', border: '1px solid var(--border-gold)', borderRadius: '8px', padding: '20px', marginTop: '40px' }}>
                      <h4 style={{ margin: '0 0 10px 0', color: 'var(--gold-primary)', fontSize: '1.1rem' }}>Interested in this Location?</h4>
                      <p style={{ margin: '0 0 15px 0', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        Get personalized investment advisory reports regarding {selectedBlogDetail.title.includes('Wakad') ? 'Wakad' : selectedBlogDetail.title.includes('Hinjewadi') ? 'Hinjewadi' : selectedBlogDetail.title.includes('Baner') ? 'Baner' : 'West Pune'} directly in your inbox.
                      </p>
                      <button 
                        onClick={() => {
                          setVipForm({ name: '', phone: '' });
                          setCountdown(60);
                          showNotification(`Priority Callback requested for article: ${selectedBlogDetail.title}`);
                        }}
                        className="btn-gold"
                        style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                      >
                        Request Expert Locality Consultation
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            ) : (
              // Blogs Listing Grid View
              <div style={{ animation: 'fadeIn 0.3s forwards' }}>
                <h2 className="luxury-title" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>⚜️ Premium Real Estate Insights & Market Analysis</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '25px', lineHeight: 1.5 }}>
                  Expert editorials, upcoming township insights, infrastructure connectivity analyses, and investment guides from 24K Realtors.
                </p>

                {directoriesLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
                    <Loader className="animate-spin" size={32} color="#D4AF37" />
                  </div>
                ) : blogs.length === 0 ? (
                  <div className="empty-state" style={{ padding: '60px 20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-muted)', borderRadius: '8px' }}>
                    No editorial articles currently published. Check back soon for premium updates.
                  </div>
                ) : (
                  <div>
                    {/* Featured Blog (First post) */}
                    {blogs[0] && (
                      <div 
                        onClick={() => setSelectedBlogDetail(blogs[0])}
                        className="exclusive-details-card featured-blog-card" 
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px', padding: '0', overflow: 'hidden', border: '1px solid var(--border-gold)', background: 'rgba(7,15,30,0.85)', borderRadius: '12px', cursor: 'pointer', marginBottom: '40px' }}
                      >
                        <div style={{ height: '300px', backgroundImage: `url(${blogs[0].coverImageUrl || 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80'})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <span style={{ color: 'var(--gold-primary)', fontSize: '0.72rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>★ FEATURED ARTICLE</span>
                          <h3 style={{ margin: '0 0 12px 0', fontSize: '1.5rem', color: '#fff', fontFamily: 'var(--font-title)', lineHeight: 1.3 }}>{blogs[0].title}</h3>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 15px 0' }}>
                            {blogs[0].content ? blogs[0].content.replace(/<[^>]*>/g, '').substring(0, 180) + '...' : ''}
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            <span>By <strong>{blogs[0].author || 'Admin'}</strong></span>
                            <span>{new Date(blogs[0].createdDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Regular Blogs Grid */}
                    {blogs.length > 1 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
                        {blogs.slice(1).map(blog => (
                          <div 
                            key={blog.id} 
                            onClick={() => setSelectedBlogDetail(blog)}
                            className="exclusive-details-card blog-grid-card" 
                            style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden', border: '1px solid var(--border-muted)', background: 'rgba(7,15,30,0.6)', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.3s ease' }}
                          >
                            <div style={{ height: '180px', backgroundImage: `url(${blog.coverImageUrl || 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80'})`, backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }} />
                            <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                              <div>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '1.15rem', color: '#fff', fontFamily: 'var(--font-title)', lineHeight: 1.4 }}>{blog.title}</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.4, margin: '0 0 15px 0' }}>
                                  {blog.content ? blog.content.replace(/<[^>]*>/g, '').substring(0, 110) + '...' : ''}
                                </p>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '10px' }}>
                                <span>By <strong>{blog.author || 'Admin'}</strong></span>
                                <span>{new Date(blog.createdDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          )}
        </div>

      {/* Portfolio Transaction Desk (Callback & Seller Mandate) */}
      <section className="portfolio-transaction-section" style={{ maxWidth: '1410px', margin: '60px auto 30px auto', padding: '0 20px' }}>
        <div className="section-header" style={{ marginBottom: '35px', textAlign: 'center' }}>
          <h2 className="luxury-title" style={{ fontSize: '1.5rem', color: 'var(--gold-primary)' }}>⚜️ Private Client & Seller Advisory Desk</h2>
          <p className="section-subtitle">Request instant advisory callbacks or register your property mandate directly with our West Pune locality directors</p>
        </div>
        <div className="transaction-desk-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '30px', alignItems: 'start' }}>
          
          {/* Priority Callback Desk — Pune Targeted */}
          <div className="callback-card" style={{ margin: 0, height: '100%', borderRadius: '16px', border: '1px solid rgba(212,175,55,0.15)', background: 'linear-gradient(135deg, rgba(12,24,48,0.6) 0%, rgba(6,12,24,0.8) 100%)' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--gold-primary)', marginBottom: '6px' }}>
              <Clock size={18} className="animate-pulse" />
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-title)' }}>⚡ Instant Priority Callback</h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
              Drop your number — our Pune IT locality director will connect with you immediately. Available Mon–Sun, 9am to 9pm.
            </p>
            <form onSubmit={handleVipSubmit}>
              <div className="form-group-floating">
                <input type="text" id="callbackName" className="form-input-floating" required placeholder=" "
                  value={vipForm.name} onChange={e => setVipForm({ ...vipForm, name: e.target.value })} />
                <label htmlFor="callbackName" className="form-label-floating">Your Full Name</label>
              </div>
              <div className="form-group-floating">
                <input type="tel" id="callbackPhone" className="form-input-floating" required placeholder=" "
                  value={vipForm.phone} onChange={e => setVipForm({ ...vipForm, phone: e.target.value })} />
                <label htmlFor="callbackPhone" className="form-label-floating">📱 WhatsApp No. (+91)</label>
              </div>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <select className="form-input" value={vipForm.location || 'HINJEWADI'}
                  onChange={e => setVipForm({ ...vipForm, location: e.target.value })}
                  style={{ fontSize: '0.84rem', borderRadius: '10px' }}>
                  <option value="HINJEWADI">📍 Hinjewadi</option>
                  <option value="BANER">📍 Baner – Balewadi</option>
                  <option value="WAKAD">📍 Wakad – Pimple Saudagar</option>
                  <option value="MAHALUNGE">📍 Mahalunge – Maan Road</option>
                  <option value="KHARADI">📍 Kharadi – EON IT Park</option>
                  <option value="UNDRI">📍 Undri – Pisoli</option>
                  <option value="ANY">📍 Open to all Pune locations</option>
                </select>
              </div>
              <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', borderRadius: '12px' }} disabled={vipSubmitting}>
                {vipSubmitting ? <Loader className="animate-spin" size={16} /> : '📞 Get Instant Callback'}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', marginTop: '10px' }}>Zero spam · Only verified property advisors call you</p>
            </form>
          </div>

          {/* Seller Exclusive Mandate Desk */}
          <div id="seller-mandate-anchor" className="seller-mandate-premium" style={{ margin: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 30px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(7,15,30,0.95) 0%, rgba(15,28,46,0.9) 100%)', border: '1px solid rgba(197,168,128,0.25)', borderRadius: '16px' }}>
            <div className="seller-mandate-header" style={{ marginBottom: '24px' }}>
              <div className="seller-mandate-icon-ring" style={{ margin: '0 auto 16px auto', width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(197,168,128,0.08)', border: '1px solid rgba(197,168,128,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building size={24} color="#E6C35C" />
              </div>
              <h3 className="seller-mandate-title" style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', color: '#fff', margin: '0 0 6px 0', letterSpacing: '0.04em' }}>Seller / Landlord Mandate</h3>
              <p className="seller-mandate-subtitle" style={{ fontSize: '0.75rem', color: '#E6C35C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>List Your Property • 0% Brokerage</p>
            </div>
            
            <p className="seller-mandate-desc" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '32px' }}>
              Direct access to premium verified buyers, institutional property funds, and HNWI investors in Baner, Wakad, and Hinjewadi. List with photos and video tour.
            </p>

            <button 
              onClick={() => onViewChange && onViewChange('list-property')}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)',
                border: 'none',
                color: '#040814',
                padding: '14px 28px',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 800,
                fontFamily: "'Montserrat', sans-serif",
                letterSpacing: '0.06em',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(197,168,128,0.25)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(197,168,128,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(197,168,128,0.25)'; }}
            >
              Start Listing Mandate →
            </button>
            <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', marginTop: '16px' }}>MahaRERA compliant · Takes less than 2 minutes</p>
          </div>
        </div>
      </section>
        </div>

      {/* Modular Comparison Overlay Modal */}
      <Suspense fallback={null}>
        <CompareOverlay 
          isOpen={isCompareOpen}
          selectedForCompare={selectedForCompare}
          onClose={() => setIsCompareOpen(false)}
          formatPrice={formatPrice}
          onOpenInquiry={handleOpenInquiry}
        />
      </Suspense>

      {/* Comparison Drawer Sticky Bar */}
      {selectedForCompare.length > 0 && (
        <div className="comparison-drawer-bar">
          <div className="drawer-bar-content">
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              📊 Property Comparison: {selectedForCompare.length} of 3 selected
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setSelectedForCompare([])} className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Clear
              </button>
              <button 
                onClick={() => setIsCompareOpen(true)} 
                className="btn-gold" 
                style={{ padding: '8px 20px', fontSize: '0.85rem' }}
                disabled={selectedForCompare.length < 2}
              >
                Compare Now
              </button>
              </div>
            </div>
          </div>
        )}
        </>
      )}

      

      {/* Modular MahaRERA compliance slide drawer */}
      <Suspense fallback={null}>
        <ReraDrawer 
          isOpen={isReraDrawerOpen}
          property={selectedReraProperty}
          onClose={() => setIsReraDrawerOpen(false)}
        />
      </Suspense>

      {/* Pune-Targeted Inquiry Modal with Mortgage Calculator */}
      {isModalOpen && selectedProperty && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setIsModalOpen(false)} style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.85)", zIndex: 1000, backdropFilter: "blur(12px)" }}>
          <div className="modal-content" style={{ maxWidth: "460px", width: "90%", borderRadius: "20px", border: "1px solid rgba(197,168,128,0.22)", background: "linear-gradient(135deg, #070f1e 0%, #0a1828 100%)", boxShadow: "0 40px 80px rgba(0,0,0,0.7)", padding: "36px 30px", position: "relative" }}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)} style={{ position: "absolute", top: "16px", right: "16px", fontSize: "1.4rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.7)", transition: "all 0.2s" }}>×</button>

            <div style={{ marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.1em", color: "#E6C35C", textTransform: "uppercase", background: "rgba(197,168,128,0.1)", border: "1px solid rgba(197,168,128,0.15)", padding: "3px 10px", borderRadius: "20px" }}>🏙️ Pune Luxury Desk</span>
            </div>
            <h3 className="modal-title" style={{ fontSize: "1.35rem", marginBottom: "6px", color: "#fff", fontWeight: 700, fontFamily: "'Cinzel', serif" }}>Quick Property Enquiry</h3>
            <p className="modal-subtitle" style={{ marginBottom: "24px", fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
              Enquiring for <strong style={{ color: "#E6C35C" }}>{selectedProperty.title || "Premium Listing"}</strong>
            </p>

            <form onSubmit={handleLeadSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(197,168,128,0.7)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "6px" }}>Full Name *</label>
                <input type="text" className="form-input" required placeholder="e.g. Rahul Sharma"
                  value={leadForm.name} onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                  style={{ borderRadius: "10px", width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", padding: "12px", color: "#fff" }}/>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(197,168,128,0.7)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "6px" }}>📱 WhatsApp Number (+91) *</label>
                <input type="tel" className="form-input" required placeholder="98765 43210"
                  value={leadForm.phone} onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                  style={{ borderRadius: "10px", width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", padding: "12px", color: "#fff" }}/>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(197,168,128,0.7)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "6px" }}>Email ID *</label>
                <input type="email" className="form-input" required placeholder="you@gmail.com"
                  value={leadForm.email} onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                  style={{ borderRadius: "10px", width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", padding: "12px", color: "#fff" }}/>
              </div>

              <button type="submit" className="btn-gold"
                style={{ width: "100%", justifyContent: "center", marginTop: "8px", borderRadius: "12px", padding: "14px", fontSize: "0.85rem", fontWeight: 700, fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.05em", cursor: "pointer", background: "linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)", border: "none", color: "#040814" }}
                disabled={submitLoading}>
                {submitLoading ? <Loader className="animate-spin" size={20} /> : "Submit Enquiry"}
              </button>

              <p style={{ textAlign: "center", fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", marginTop: "8px", lineHeight: "1.4" }}>
                Zero spam guarantee · Your details are securely shared with our direct advisory desk
              </p>
            </form>
          </div>
        </div>
      )}

      {/* 🤖 Ultra-Luxury 24K AI Assistant Chatbot */}
      <Suspense fallback={null}>
        <ChatWidget 
          isOpen={isChatWidgetOpen}
          setIsOpen={setIsChatWidgetOpen}
          activeProperty={selectedPropertyDetail}
        />
      </Suspense>

      {/* Sticky Floating WhatsApp */}
      {!selectedPropertyDetail && !selectedSocietyDetail && !selectedBuilderDetail && !selectedLocalityDetail && !selectedBlogDetail && (
        <a
          href="https://wa.me/919673000053?text=I%20am%20interested%20in%20real%20estate%20consultation"
          className="floating-whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          title="WhatsApp Consultation — 24K Realtors"
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.233-1.371c1.394.756 2.96 1.157 4.777 1.158h.005c5.502 0 9.987-4.476 9.988-9.986C22 7.478 17.517 2 12.012 2zm5.787 14.404c-.24.675-1.397 1.285-1.92 1.36-.474.07-1.088.13-3.18-.737-2.677-1.11-4.4-3.837-4.536-4.015-.132-.178-1.08-1.433-1.08-2.73 0-1.298.68-1.936.92-2.199.243-.263.53-.328.706-.328.176 0 .353.003.507.01.162.007.382-.062.597.45.22.524.75 1.83.816 1.964.066.13.11.286.022.463-.087.177-.13.287-.26.439-.13.15-.27.337-.385.45-.126.126-.259.263-.11.517.15.253.66.1.91 1.488.75 1.309 1.37 2.14 2.15 2.65.783.51 1.237.585 1.58.204.34-.38 1.484-1.72 1.88-2.31.398-.59.794-.49 1.346-.29.553.2.3.5 1.764 1.226.22.11.365.163.475.328.11.165.11.954-.13 1.63z"/>
          </svg>
        </a>
      )}
      {/* Spotlight Command Palette (Ctrl+K / Cmd+K Overlay) */}
      {isSpotlightOpen && (
        <div
          onClick={e => { if (e.target === e.currentTarget) { setIsSpotlightOpen(false); setSpotlightQuery(""); setSpotlightIndex(0); } }}
          style={{ position: "fixed", inset: 0, background: "rgba(4,8,20,0.88)", backdropFilter: "blur(20px)", zIndex: 10000, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "10vh", paddingLeft: "20px", paddingRight: "20px" }}
        >
          <div style={{ background: "linear-gradient(135deg, #070f1e 0%, #0d1a30 100%)", border: "1px solid rgba(197,168,128,0.3)", borderRadius: "20px", width: "100%", maxWidth: "700px", boxShadow: "0 32px 90px rgba(0,0,0,0.85), 0 0 0 1px rgba(230,195,92,0.1)", overflow: "hidden", display: "flex", flexDirection: "column" }}>

            {/* Input Bar */}
            <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid rgba(197,168,128,0.15)", padding: "18px 24px", gap: "14px", background: "rgba(255,255,255,0.02)" }}>
              <span style={{ fontSize: "1.2rem", color: "#E6C35C" }}>🔍</span>
              <input
                type="text"
                autoFocus
                value={spotlightQuery}
                onChange={e => { setSpotlightQuery(e.target.value); setSpotlightIndex(0); }}
                onKeyDown={e => {
                  const filtered = allRawProperties.filter(p => {
                    if (!spotlightQuery.trim()) return true;
                    const parsed = parseNaturalQuery(spotlightQuery);
                    if (parsed.location && p.location !== parsed.location) return false;
                    if (parsed.bedrooms && p.bedrooms !== Number(parsed.bedrooms)) return false;
                    if (parsed.propertyType && p.propertyType !== parsed.propertyType) return false;
                    if (parsed.transactionType && p.transactionType !== parsed.transactionType) return false;
                    if (parsed.maxPrice && p.price > Number(parsed.maxPrice)) return false;
                    if (parsed.query && !p.title.toLowerCase().includes(parsed.query.toLowerCase()) && !(p.description || '').toLowerCase().includes(parsed.query.toLowerCase())) return false;
                    return true;
                  }).slice(0, 6);

                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSpotlightIndex(prev => (prev + 1) % Math.max(1, filtered.length));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSpotlightIndex(prev => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (filtered[spotlightIndex]) {
                      setSelectedPropertyDetail(filtered[spotlightIndex]);
                      setIsSpotlightOpen(false);
                      setSpotlightQuery("");
                      window.scrollTo({ top: 300, behavior: "smooth" });
                    } else if (spotlightQuery.trim()) {
                      const parsed = parseNaturalQuery(spotlightQuery);
                      setFilters(prev => ({ ...prev, ...parsed }));
                      setIsSpotlightOpen(false);
                      setSpotlightQuery("");
                      setActiveSection("listings");
                      setPage(0);
                    }
                  }
                }}
                placeholder="Type to search (e.g. 3 BHK Hinjewadi under 1 Cr, rent Wakad)..."
                style={{ flex: 1, background: "none", border: "none", color: "#fff", fontFamily: "'Montserrat', sans-serif", fontSize: "1.05rem", fontWeight: 500, outline: "none" }}
              />
              <button onClick={() => { setIsSpotlightOpen(false); setSpotlightQuery(""); setSpotlightIndex(0); }} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "0.68rem", fontWeight: 700, padding: "4px 8px", textTransform: "uppercase" }}>ESC</button>
            </div>

            {/* Suggestions list */}
            <div style={{ maxHeight: "450px", overflowY: "auto", padding: "16px 24px" }}>

              {/* Quick Chip Shortcuts when query is empty */}
              {!spotlightQuery.trim() && (
                <div style={{ marginBottom: "20px" }}>
                  <span style={{ fontSize: "0.62rem", fontFamily: "'Montserrat', sans-serif", fontWeight: 800, color: "rgba(197,168,128,0.6)", letterSpacing: "0.08em", display: "block", marginBottom: "10px", textTransform: "uppercase" }}>⚡ POPULAR QUICK FILTERS</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {[
                      { label: "🏡 3 BHK Hinjewadi", query: "3 BHK Hinjewadi" },
                      { label: "📍 Wakad Flats", query: "Wakad" },
                      { label: "💰 Under ₹1 Cr", query: "under 1 Cr" },
                      { label: "🔑 For Rent", query: "rent" },
                      { label: "🏬 Commercial", query: "commercial" },
                      { label: "🛡️ MahaRERA Verified", query: "verified" },
                    ].map(chip => (
                      <button
                        key={chip.query}
                        onClick={() => setSpotlightQuery(chip.query)}
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(197,168,128,0.2)",
                          borderRadius: "20px",
                          padding: "6px 14px",
                          color: "rgba(255,255,255,0.85)",
                          fontSize: '0.74rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: "'Montserrat', sans-serif",
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#E6C35C"; e.currentTarget.style.color = "#E6C35C"; e.currentTarget.style.background = "rgba(230,195,92,0.1)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(197,168,128,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Parser Active Recommendation Chip */}
              {spotlightQuery.trim().length > 0 && (
                <div style={{ marginBottom: "18px" }}>
                  <span style={{ fontSize: "0.62rem", fontFamily: "'Montserrat', sans-serif", fontWeight: 800, color: "rgba(197,168,128,0.6)", letterSpacing: "0.08em", display: "block", marginBottom: "8px", textTransform: "uppercase" }}>🤖 AI NATURAL LANGUAGE INTENT</span>
                  <button
                    onClick={() => {
                      const parsed = parseNaturalQuery(spotlightQuery);
                      setFilters(prev => ({ ...prev, ...parsed }));
                      setIsSpotlightOpen(false);
                      setSpotlightQuery("");
                      setActiveSection("listings");
                      setPage(0);
                      setTimeout(() => {
                        const el = document.getElementById("listings-anchor");
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }, 100);
                    }}
                    style={{ background: "rgba(230,195,92,0.08)", border: "1px solid rgba(230,195,92,0.3)", borderRadius: "10px", width: "100%", padding: "12px 16px", textAlign: "left", cursor: "pointer", color: "#E6C35C", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.2s ease" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(230,195,92,0.15)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(230,195,92,0.08)"}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "1rem" }}>⚡</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                        Apply Smart Filters: {Object.entries(parseNaturalQuery(spotlightQuery)).filter(([k,v]) => v).map(([k,v]) => `${k.toUpperCase()}: ${v}`).join(", ") || spotlightQuery}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.76rem", fontWeight: 800 }}>Apply ↵</span>
                  </button>
                </div>
              )}

              {/* Live Preview List */}
              {(() => {
                const matches = allRawProperties.filter(p => {
                  if (!spotlightQuery.trim()) return true;
                  const parsed = parseNaturalQuery(spotlightQuery);
                  if (parsed.location && p.location !== parsed.location) return false;
                  if (parsed.bedrooms && p.bedrooms !== Number(parsed.bedrooms)) return false;
                  if (parsed.propertyType && p.propertyType !== parsed.propertyType) return false;
                  if (parsed.transactionType && p.transactionType !== parsed.transactionType) return false;
                  if (parsed.maxPrice && p.price > Number(parsed.maxPrice)) return false;
                  if (parsed.query && !p.title.toLowerCase().includes(parsed.query.toLowerCase()) && !(p.description || '').toLowerCase().includes(parsed.query.toLowerCase())) return false;
                  return true;
                }).slice(0, 6);

                return (
                  <div>
                    <span style={{ fontSize: "0.62rem", fontFamily: "'Montserrat', sans-serif", fontWeight: 800, color: "rgba(197,168,128,0.6)", letterSpacing: "0.08em", display: "block", marginBottom: "12px", textTransform: "uppercase" }}>
                      🏢 MATCHING RESIDENCES ({matches.length})
                    </span>

                    {matches.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.84rem' }}>
                        No exact property matches found. Press <strong>Enter</strong> to apply natural language filter to full database.
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {matches.map((p, idx) => {
                          const isSelected = idx === spotlightIndex;
                          return (
                            <div
                              key={p.id}
                              onClick={() => {
                                setSelectedPropertyDetail(p);
                                setIsSpotlightOpen(false);
                                setSpotlightQuery("");
                                window.scrollTo({ top: 300, behavior: "smooth" });
                              }}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                background: isSelected ? "rgba(230,195,92,0.12)" : "rgba(255,255,255,0.02)",
                                border: `1px solid ${isSelected ? "rgba(230,195,92,0.4)" : "rgba(255,255,255,0.06)"}`,
                                borderRadius: "10px",
                                padding: "10px 14px",
                                cursor: "pointer",
                                transition: "all 0.2s ease"
                              }}
                              onMouseEnter={() => setSpotlightIndex(idx)}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <img src={p.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=100&q=70'} alt={p.title} style={{ width: "42px", height: "42px", borderRadius: "8px", objectFit: "cover" }} />
                                <div>
                                  <div style={{ fontSize: "0.84rem", fontWeight: 700, color: isSelected ? "#E6C35C" : "#fff" }}>{p.title}</div>
                                  <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)" }}>
                                    {p.location} Corridor · {p.bedrooms ? `${p.bedrooms} BHK` : p.propertyType} · {p.transactionType || 'BUY'}
                                  </div>
                                </div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: "0.84rem", fontWeight: 800, color: "#E6C35C" }}>{formatPrice(p.price)}</div>
                                {isSelected && <span style={{ fontSize: '0.6rem', color: '#E6C35C', fontWeight: 800 }}>PRESS ↵</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Bottom Hotkeys Helper */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "14px", color: "rgba(255,255,255,0.4)", fontSize: "0.68rem" }}>
                <div style={{ display: "flex", gap: "14px" }}>
                  <span><kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 4px', borderRadius: '3px' }}>↑↓</kbd> Navigate</span>
                  <span><kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 4px', borderRadius: '3px' }}>↵</kbd> Select</span>
                  <span><kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 4px', borderRadius: '3px' }}>ESC</kbd> Close</span>
                </div>
                <span style={{ color: "rgba(230,195,92,0.7)", fontWeight: 600 }}>24K Spotlight Engine v2.0</span>
              </div>

            </div>
          </div>
        </div>
      )}

      {isAiModalOpen && (
        <div
          onClick={e => { if (e.target === e.currentTarget) { setIsAiModalOpen(false); setAiStep(1); } }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(4,8,20,0.85)', backdropFilter: 'blur(12px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <div style={{ background: 'linear-gradient(135deg, #070f1e 0%, #0d1a30 100%)', border: '1px solid rgba(197,168,128,0.25)', borderRadius: '20px', padding: '40px', maxWidth: '480px', width: '100%', position: 'relative', boxShadow: '0 24px 80px rgba(0,0,0,0.7)' }}>
            {/* Close */}
            <button onClick={() => { setIsAiModalOpen(false); setAiStep(1); }} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', width: '32px', height: '32px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>✕</button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(197,168,128,0.15) 0%, transparent 70%)', border: '1px solid rgba(197,168,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <Sparkles size={24} color="#E6C35C" />
              </div>
              <h2 style={{ margin: '0 0 6px 0', fontFamily: "'Cinzel', serif", fontSize: '1.3rem', color: '#fff', fontWeight: 700 }}>AI Area Match</h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>3 questions · instant recommendation</p>
            </div>

            {/* Step indicator */}
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '28px' }}>
              {[1,2,3].map(s => (
                <div key={s} style={{ width: s <= aiStep ? '28px' : '8px', height: '4px', borderRadius: '2px', background: s <= aiStep ? 'linear-gradient(90deg, #E6C35C, #C5A880)' : 'rgba(255,255,255,0.1)', transition: 'all 0.4s ease' }} />
              ))}
            </div>

            {/* Step 1 — Budget */}
            {aiStep === 1 && (
              <div>
                <p style={{ textAlign: 'center', fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '20px', fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>What is your investment budget?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[['under-80L','Under ₹80 Lakhs','Affordable premium apartments'],['80L-1.5Cr','₹80L – ₹1.5 Crore','Mid-luxury 2-3 BHK range'],['1.5Cr-3Cr','₹1.5 – ₹3 Crore','Luxury 3-4 BHK & penthouses'],['above-3Cr','Above ₹3 Crore','Ultra-luxury private mandates']].map(([val, label, sub]) => (
                    <button key={val} onClick={() => { setAiBudget(val); setAiStep(2); }} style={{ background: aiBudget === val ? 'rgba(197,168,128,0.12)' : 'rgba(255,255,255,0.02)', border: `1px solid ${aiBudget === val ? 'rgba(197,168,128,0.5)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '12px', padding: '14px 18px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                      <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.9rem', fontWeight: 700, color: aiBudget === val ? '#E6C35C' : '#fff' }}>{label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>{sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 — Priority */}
            {aiStep === 2 && (
              <div>
                <p style={{ textAlign: 'center', fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '20px', fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>What matters most to you?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[['appreciation','📈 Capital Appreciation','Long-term asset value growth'],['yield','💰 Rental Yield','Monthly rental income focus'],['commute','🚗 Commute & Connectivity','Easy IT park / city access']].map(([val, label, sub]) => (
                    <button key={val} onClick={() => { setAiPriority(val); setAiStep(3); }} style={{ background: aiPriority === val ? 'rgba(197,168,128,0.12)' : 'rgba(255,255,255,0.02)', border: `1px solid ${aiPriority === val ? 'rgba(197,168,128,0.5)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '12px', padding: '14px 18px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                      <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.9rem', fontWeight: 700, color: aiPriority === val ? '#E6C35C' : '#fff' }}>{label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>{sub}</div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setAiStep(1)} style={{ marginTop: '16px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '0.8rem', fontFamily: "'Montserrat', sans-serif" }}>← Back</button>
              </div>
            )}

            {/* Step 3 — Preferred Area + Result */}
            {aiStep === 3 && (
              <div>
                <p style={{ textAlign: 'center', fontSize: '1rem', color: 'rgba(255,255,255,0.7)', marginBottom: '20px', fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>Any preferred area?</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                  {[['all','Any Area'],['BANER','Baner'],['WAKAD','Wakad'],['HINJEWADI','Hinjewadi'],['MAHALUNGE','Mahalunge'],['TATHAWADE','Tathawade']].map(([val, label]) => (
                    <button key={val} onClick={() => setAiCorridor(val)} style={{ background: aiCorridor === val ? 'rgba(197,168,128,0.15)' : 'rgba(255,255,255,0.02)', border: `1px solid ${aiCorridor === val ? 'rgba(197,168,128,0.5)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '50px', padding: '8px 16px', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", fontSize: '0.78rem', fontWeight: 700, color: aiCorridor === val ? '#E6C35C' : 'rgba(255,255,255,0.6)', transition: 'all 0.2s ease' }}>{label}</button>
                  ))}
                </div>
                <button
                  onClick={() => { handleAiAnalyze(); setIsAiModalOpen(false); setAiStep(1); document.getElementById('areas')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                  style={{ width: '100%', background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)', border: 'none', color: '#040814', padding: '15px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 800, fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.06em', cursor: 'pointer', boxShadow: '0 6px 20px rgba(197,168,128,0.3)', transition: 'all 0.3s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(197,168,128,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(197,168,128,0.3)'; }}
                >
                  ✦ Compute My Match
                </button>
                <button onClick={() => setAiStep(2)} style={{ marginTop: '12px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '0.8rem', fontFamily: "'Montserrat', sans-serif", display: 'block', margin: '12px auto 0 auto' }}>← Back</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Bottom Compare Action Bar */}
      {selectedForCompare.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: '28px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 995,
            background: 'rgba(7, 15, 30, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '50px',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 16px 50px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.2)'
          }}
        >
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#E6C35C' }}>⚔️</span>
            <span>{selectedForCompare.length} {selectedForCompare.length === 1 ? 'Property' : 'Properties'} Selected</span>
          </div>

          <button
            onClick={() => setIsCompareOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)',
              border: 'none',
              color: '#040814',
              padding: '8px 18px',
              borderRadius: '50px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: "'Montserrat', sans-serif"
            }}
          >
            Compare Matrix →
          </button>

          <button
            onClick={() => setSelectedForCompare([])}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Compare Matrix Modal Overlay */}
      {isCompareOpen && (
        <Suspense fallback={null}>
          <CompareOverlay
            isOpen={isCompareOpen}
            selectedForCompare={selectedForCompare}
            onClose={() => setIsCompareOpen(false)}
            formatPrice={formatPrice}
            onOpenInquiry={handleOpenInquiry}
            onOpenBrochure={(prop) => {
              setIsCompareOpen(false);
              setSelectedBrochureProperty(prop);
            }}
          />
        </Suspense>
      )}

      {/* Instant 1-Page PDF Brochure Modal */}
      {selectedBrochureProperty && (
        <PdfBrochureModal
          property={selectedBrochureProperty}
          onClose={() => setSelectedBrochureProperty(null)}
          formatPrice={formatPrice}
          onOpenInquiry={handleOpenInquiry}
        />
      )}

      <PortalFooter />

    </div>
  );
}



// Corridor static datasets used for the tech area filters (Redesigned with Metrics)
const areaData = [
  { id: 'BANER', name: 'Baner', tagline: 'Balewadi Link Road, high appreciation', icon: <Activity size={20} />, pricePerSqft: '₹11,500', yield: '3.8%', growth: '+16%' },
  { id: 'WAKAD', name: 'Wakad', tagline: 'Datta Mandir, multi-lane connectivity', icon: <TrendingUp size={20} />, pricePerSqft: '₹8,200', yield: '4.5%', growth: '+14%' },
  { id: 'HINJEWADI', name: 'Hinjewadi', tagline: 'Phase 1 & 2 Infotech park hub', icon: <Laptop size={20} />, pricePerSqft: '₹7,800', yield: '5.2%', growth: '+11%' },
  { id: 'BALEWADI', name: 'Balewadi', tagline: 'Premium retail & high-end dining', icon: <Sparkles size={20} />, pricePerSqft: '₹10,200', yield: '4.0%', growth: '+13%' },
  { id: 'TATHAWADE', name: 'Tathawade', tagline: 'Educational hub & premium villas', icon: <Users size={20} />, pricePerSqft: '₹7,200', yield: '4.6%', growth: '+15%' },
  { id: 'MAHALUNGE', name: 'Mahalunge', tagline: 'Next-gen smart city township plots', icon: <LineChart size={20} />, pricePerSqft: '₹6,900', yield: '4.8%', growth: '+18%' }
];
