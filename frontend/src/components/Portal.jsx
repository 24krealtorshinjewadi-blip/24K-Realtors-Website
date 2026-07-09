import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { apiService } from '../services/apiService';
import { 
  Search, Loader, CheckCircle, IndianRupee, Laptop, Sparkles, Activity, 
  LineChart, Car, Users, ShieldCheck, 
  Calculator, Compass, Clock, Lock, TrendingUp, Building,
  ChevronLeft, ChevronRight, MapPin, BedDouble, Phone, Calendar,
  Handshake, ArrowRight, Key, Home, Briefcase
} from 'lucide-react';
import './Portal.css';
import * as THREE from 'three';

// Import Modular Components
import PortalNavbar from '../layouts/PortalNavbar';
import PortalFooter from '../layouts/PortalFooter';
import PropertyCard from './PropertyCard';

const PropertyDetailView = lazy(() => import('./PropertyDetailView'));
const CompareOverlay = lazy(() => import('./CompareOverlay'));
const ReraDrawer = lazy(() => import('./ReraDrawer'));
const ChauffeurModal = lazy(() => import('./ChauffeurModal'));
const ChatWidget = lazy(() => import('./ChatWidget'));




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
  const [exclusiveTab, setExclusiveTab] = useState('BUY');
  const [activeSection, setActiveSection] = useState('listings');
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
    const loadRawProperties = async () => {
      try {
        const data = await apiService.getProperties({}, 0, 100);
        setAllRawProperties(data.content || []);
      } catch (err) {
        console.error("Error loading raw properties for carousels:", err);
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

  const renderCuratedCarousels = () => {
    const collections = [
      { title: "Featured Luxury Homes", data: allRawProperties.filter(p => p.exclusiveDeal || p.verifiedListing) },
      { title: "Ready To Move Residences", data: allRawProperties.filter(p => p.propertyType === 'RESIDENTIAL' && (p.reraNumber?.includes('24K') || p.exclusiveDeal)) },
      { title: "Premium Apartments", data: allRawProperties.filter(p => p.propertyType === 'RESIDENTIAL' && p.bedrooms <= 3 && !p.title.toLowerCase().includes('penthouse')) },
      { title: "Luxury Villas", data: allRawProperties.filter(p => p.title.toLowerCase().includes('villa') || p.bedrooms >= 4) },
      { title: "Penthouse Collection", data: allRawProperties.filter(p => p.title.toLowerCase().includes('penthouse') || p.description.toLowerCase().includes('penthouse')) },
      { title: "Commercial Assets", data: allRawProperties.filter(p => p.propertyType === 'COMMERCIAL') },
      { title: "Investment Picks", data: allRawProperties.filter(p => p.location === 'BANER' || p.location === 'MAHALUNGE' || p.location === 'WAKAD') },
      { title: "New Launches", data: [...allRawProperties].reverse() },
      { title: "Trending in Pune", data: allRawProperties.filter(p => p.location === 'HINJEWADI' || p.location === 'BALEWADI') },
      { title: "Editor's Choice", data: allRawProperties.filter(p => p.verifiedListing).slice(0, 6) }
    ];

    return (
      <div className="curated-carousels-container">
        {collections.map((col, i) => {
          if (col.data.length === 0) return null;
          return (
            <div key={i} className="luxury-carousel-section" id={`carousel-section-${i}`}>
              <div className="carousel-title-row">
                <h3>⚜️ {col.title}</h3>
                <div className="carousel-nav-buttons">
                  <button 
                    onClick={() => handleCarouselScroll(i, 'left')} 
                    className="carousel-nav-btn"
                    aria-label="Scroll left"
                    type="button"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button 
                    onClick={() => handleCarouselScroll(i, 'right')} 
                    className="carousel-nav-btn"
                    aria-label="Scroll right"
                    type="button"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
              <div className="carousel-track-container">
                <div className="carousel-track" id={`carousel-track-${i}`}>
                  {col.data.map(property => (
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
                        window.scrollTo({ top: 300, behavior: 'smooth' }); 
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const handleCollectionChange = (collection) => {
    setActiveCollection(collection);
    setPage(0);
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
    const currentInput = chatInput.toLowerCase();
    const rawInput = chatInput;
    setChatInput('');
    
    setTimeout(async () => {
      let replyText = 'Thank you for reaching out! A senior portfolio advisor is being notified to connect with you regarding this.';
      
      if (currentInput.includes('wakad')) {
        replyText = 'Wakad Corridor holds a +14% annual appreciation rate driven by multi-lane transit connectivity. Tier-1 societies like 24K Opula starting at ₹1.2 Cr offer excellent inventory. Would you like to schedule a private site visit?';
      } else if (currentInput.includes('baner')) {
        replyText = 'Baner Corridor is Pune West\'s premium segment, showing a +16% YoY price rise. Excellent lifestyle avenues near Balewadi High Street. We have 3 gated luxury options available now.';
      } else if (currentInput.includes('hinjewadi')) {
        replyText = 'Hinjewadi IT Corridor is the rental yield leader at 5.2%. Excellent for corporate professionals seeking high capital growth with stable tenants. Type "maybach" to schedule a premium chauffeur site tour!';
      } else if (currentInput.includes('price') || currentInput.includes('cost') || currentInput.includes('budget')) {
        replyText = 'Our portfolio ranges from ₹65 Lakhs for entry IT apartments up to ₹3.8 Crore+ for exclusive whole-floor mandates and luxury penthouses. What budget range are you evaluating?';
      } else if (currentInput.includes('maybach') || currentInput.includes('chauffeur') || currentInput.includes('car')) {
        replyText = 'We provide complimentary Mercedes-Maybach / BMW 7 Series chauffeured transport for qualified site inspections. Click the "VIP Chauffeur" option in any property listing to book your slot!';
      } else if (currentInput.includes('rera') || currentInput.includes('license') || currentInput.includes('verify')) {
        replyText = 'All properties listed on 24K Realtors are registered with MahaRERA (our license: A52100028461) and have certified title-clear registry dossiers. You can explore the RERA compliance stamp on any card!';
      }
      
      const botMsg = { sender: 'bot', text: replyText };
      setChatMessages(prev => [...prev, botMsg]);
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
    }, 800);
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
      baner: { label: '📍 Properties in Baner Tech Corridor', filters: { location: 'BANER' } },
      balewadi: { label: '📍 Properties in Balewadi High Street', filters: { location: 'BALEWADI' } },
      tathawade: { label: '📍 Properties in Tathawade Corridor', filters: { location: 'TATHAWADE' } },
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
          explanation = 'Based on your preference for High Rental Yields, Hinjewadi IT Corridor is recommended. The tech hubs generate stable corporate tenant demand, pushing yields to 5.2%—the highest in Pune West.';
        } else if (aiPriority === 'commute') {
          recommendedCorridor = 'BANER';
          appreciationIndex = '16.5%';
          rentalYield = '3.8%';
          connectivityScore = '9.5/10';
          explanation = 'For optimized commute time and high appreciation, Baner Corridor is recommended. It lies adjacent to Balewadi High Street with excellent transit routes to IT offices.';
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
            explanation = 'Wakad Corridor offers the most balanced profile. Excellent 14% capital appreciation combined with a solid 4.5% yield and multi-lane highway transit.';
          }
        }
        
        setAiReport({
          corridor: recommendedCorridor,
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
      preferredLocation: property.location || '',
      notes: `Interested in property: "${property.title}" (ID: ${property.id})`,
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

  const handleChauffeurSubmit = async (e) => {
    e.preventDefault();
    const phonePattern = /^(?:\+91|0)?[6789]\d{9}$/;
    if (!phonePattern.test(chauffeurForm.phone)) {
      showNotification('⚠️ Invalid Phone: Enter a valid 10-digit Indian mobile number.');
      return;
    }
    setChauffeurSubmitting(true);
    try {
      const notesMsg = `VIP SITE VISIT SCHEDULER: Scheduled viewing for "${selectedChauffeurProp.title}" (ID: ${selectedChauffeurProp.id}). Date: ${chauffeurForm.visitDate}, Time slot: ${chauffeurForm.timeSlot}. Executive pickup service: ${chauffeurForm.includeExecutiveChauffeur ? 'REQUIRED' : 'NOT REQUIRED'}. Pickup address: "${chauffeurForm.pickupAddress || 'Direct site visit'}". Fleet Selected: ${chauffeurForm.luxuryCarModel || 'MAYBACH'}`;
      
      await apiService.submitLead({
        name: chauffeurForm.name,
        phone: chauffeurForm.phone,
        email: chauffeurForm.email || 'site.visit@24krealtors.com',
        requirementType: 'BUY',
        budgetMin: selectedChauffeurProp.price ? selectedChauffeurProp.price.toString() : '10000000',
        budgetMax: selectedChauffeurProp.price ? (Number(selectedChauffeurProp.price) * 1.1).toString() : '20000000',
        preferredLocation: selectedChauffeurProp.location || '',
        notes: notesMsg,
        propertyId: selectedChauffeurProp.id
      });

      setIsChauffeurModalOpen(false);
      setChauffeurForm({
        name: '',
        phone: '',
        email: '',
        visitDate: '',
        timeSlot: 'MORNING',
        pickupAddress: '',
        includeExecutiveChauffeur: true,
        luxuryCarModel: 'MAYBACH'
      });
      showNotification('VIP Site Visit Booked! Chauffeur confirmation sent on WhatsApp.');
    } catch (err) {
      alert(`Booking error: ${err.message}`);
    } finally {
      setChauffeurSubmitting(false);
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
      const notesMsg = "VIP 60-Second Callback Request. Urgently contact customer for property guidance.";
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
        onViewChange={onViewChange} 
        onBookVisitClick={() => { setSelectedChauffeurProp(properties[0] || null); setIsChauffeurModalOpen(true); }}
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
              onOpenChauffeur={(prop) => { setSelectedChauffeurProp(prop); setIsChauffeurModalOpen(true); }}
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
            backgroundImage: "url('/luxury_sunset_tower.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden'
          }}>
            {/* Dark vignette overlay for readability */}
            <div className="hero-vignette-overlay" style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(to right, rgba(4, 8, 20, 0.95) 0%, rgba(4, 8, 20, 0.4) 60%, rgba(4, 8, 20, 0.8) 100%), linear-gradient(to bottom, rgba(4, 8, 20, 0.5) 0%, rgba(4, 8, 20, 0.95) 100%)',
              zIndex: 1
            }} />
            
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
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#E6C35C',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}>
                  PUNE'S MOST TRUSTED REAL ESTATE CONSULTANTS
                </span>
                
                <h1 style={{ 
                  fontFamily: "'Cinzel', serif", 
                  fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', 
                  color: '#fff', 
                  lineHeight: 1.15, 
                  margin: '20px 0', 
                  fontWeight: 700,
                  textShadow: '0 4px 15px rgba(0,0,0,0.6)' 
                }}>
                  Find Your <span style={{ color: '#E6C35C' }}>Dream Home</span> in Pune
                </h1>
                
                <p className="hero-subtext" style={{ 
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 'clamp(0.95rem, 1.2vw, 1.15rem)', 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  lineHeight: 1.6, 
                  marginBottom: '35px',
                  textShadow: '0 2px 5px rgba(0,0,0,0.5)'
                }}>
                  Handpicked, 100% verified properties in Hinjewadi, Wakad, Baner & Pune's most premium locations.
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

              {/* Structured Floating Search Panel */}
              <div className="luxury-search-panel" style={{
                background: 'rgba(7, 15, 30, 0.55)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border: '1px solid rgba(230, 195, 92, 0.2)',
                borderRadius: '24px',
                padding: '24px 32px',
                width: '100%',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
                boxSizing: 'border-box',
                marginTop: '40px'
              }}>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: '24px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,0.06)', paddingBottom: '12px' }}>
                  <button 
                    onClick={() => setHeroTab('BUY')}
                    type="button"
                    style={{
                      background: 'none', border: 'none', color: heroTab === 'BUY' ? '#E6C35C' : 'rgba(255,255,255,0.6)',
                      fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px',
                      borderBottom: heroTab === 'BUY' ? '2px solid #E6C35C' : 'none',
                      transition: 'all 0.3s ease', textTransform: 'uppercase'
                    }}
                  >
                    <Home size={14} />
                    <span>BUY</span>
                  </button>
                  <button 
                    onClick={() => setHeroTab('RENT')}
                    type="button"
                    style={{
                      background: 'none', border: 'none', color: heroTab === 'RENT' ? '#E6C35C' : 'rgba(255,255,255,0.6)',
                      fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px',
                      borderBottom: heroTab === 'RENT' ? '2px solid #E6C35C' : 'none',
                      transition: 'all 0.3s ease', textTransform: 'uppercase'
                    }}
                  >
                    <Key size={14} />
                    <span>RENT</span>
                  </button>
                  <button 
                    onClick={() => setHeroTab('COMMERCIAL')}
                    type="button"
                    style={{
                      background: 'none', border: 'none', color: heroTab === 'COMMERCIAL' ? '#E6C35C' : 'rgba(255,255,255,0.6)',
                      fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px',
                      borderBottom: heroTab === 'COMMERCIAL' ? '2px solid #E6C35C' : 'none',
                      transition: 'all 0.3s ease', textTransform: 'uppercase'
                    }}
                  >
                    <Briefcase size={14} />
                    <span>COMMERCIAL</span>
                  </button>
                </div>

                {/* Form fields grid */}
                <form onSubmit={handleLuxurySearch} style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 180px',
                  gap: '20px',
                  alignItems: 'end'
                }}>
                  {/* Location Field */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: '#FFF4D0', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      <MapPin size={12} style={{ color: '#E6C35C' }} />
                      <span>LOCATION</span>
                    </label>
                    <select 
                      value={searchLocation} 
                      onChange={e => setSearchLocation(e.target.value)}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#fff',
                        fontSize: '0.85rem',
                        fontFamily: "'Montserrat', sans-serif",
                        outline: 'none',
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      <option value="" style={{ background: '#070F1E' }}>Hinjewadi, Wakad, Baner...</option>
                      <option value="HINJEWADI" style={{ background: '#070F1E' }}>Hinjewadi IT Zone</option>
                      <option value="WAKAD" style={{ background: '#070F1E' }}>Wakad Junction</option>
                      <option value="BANER" style={{ background: '#070F1E' }}>Baner Tech Corridor</option>
                      <option value="BALEWADI" style={{ background: '#070F1E' }}>Balewadi High Street</option>
                      <option value="TATHAWADE" style={{ background: '#070F1E' }}>Tathawade Hub</option>
                      <option value="MAHALUNGE" style={{ background: '#070F1E' }}>Mahalunge Township</option>
                    </select>
                  </div>

                  {/* Property Type Field */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: '#FFF4D0', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      <Building size={12} style={{ color: '#E6C35C' }} />
                      <span>PROPERTY TYPE</span>
                    </label>
                    <select 
                      value={searchPropType} 
                      onChange={e => setSearchPropType(e.target.value)}
                      disabled={heroTab === 'COMMERCIAL'}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#fff',
                        fontSize: '0.85rem',
                        fontFamily: "'Montserrat', sans-serif",
                        outline: 'none',
                        cursor: heroTab === 'COMMERCIAL' ? 'not-allowed' : 'pointer',
                        width: '100%',
                        opacity: heroTab === 'COMMERCIAL' ? 0.5 : 1
                      }}
                    >
                      {heroTab === 'COMMERCIAL' ? (
                        <option value="COMMERCIAL" style={{ background: '#070F1E' }}>Commercial</option>
                      ) : (
                        <>
                          <option value="" style={{ background: '#070F1E' }}>Select Type</option>
                          <option value="RESIDENTIAL" style={{ background: '#070F1E' }}>Residential Apartment</option>
                          <option value="COMMERCIAL" style={{ background: '#070F1E' }}>Commercial Workspace</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* Budget Field */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: '#FFF4D0', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      <IndianRupee size={12} style={{ color: '#E6C35C' }} />
                      <span>BUDGET</span>
                    </label>
                    <select 
                      value={searchBudget} 
                      onChange={e => setSearchBudget(e.target.value)}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#fff',
                        fontSize: '0.85rem',
                        fontFamily: "'Montserrat', sans-serif",
                        outline: 'none',
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      <option value="" style={{ background: '#070F1E' }}>Select Budget</option>
                      {heroTab === 'RENT' ? (
                        <>
                          <option value="20000" style={{ background: '#070F1E' }}>Under 20k / Month</option>
                          <option value="35000" style={{ background: '#070F1E' }}>Under 35k / Month</option>
                          <option value="50000" style={{ background: '#070F1E' }}>Under 50k / Month</option>
                          <option value="100000" style={{ background: '#070F1E' }}>Under 1 Lakh / Month</option>
                        </>
                      ) : (
                        <>
                          <option value="8000000" style={{ background: '#070F1E' }}>Under 80 Lakhs</option>
                          <option value="12000000" style={{ background: '#070F1E' }}>Under 1.2 Crore</option>
                          <option value="20000000" style={{ background: '#070F1E' }}>Under 2 Crore</option>
                          <option value="50000000" style={{ background: '#070F1E' }}>Under 5 Crore</option>
                          <option value="500000000" style={{ background: '#070F1E' }}>Under 50 Crore</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* BHK Layout Field */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: '#FFF4D0', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      <BedDouble size={12} style={{ color: '#E6C35C' }} />
                      <span>BHK</span>
                    </label>
                    <select 
                      value={searchBHK} 
                      onChange={e => setSearchBHK(e.target.value)}
                      disabled={heroTab === 'COMMERCIAL'}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#fff',
                        fontSize: '0.85rem',
                        fontFamily: "'Montserrat', sans-serif",
                        outline: 'none',
                        cursor: heroTab === 'COMMERCIAL' ? 'not-allowed' : 'pointer',
                        width: '100%',
                        opacity: heroTab === 'COMMERCIAL' ? 0.5 : 1
                      }}
                    >
                      <option value="" style={{ background: '#070F1E' }}>Any Layout</option>
                      <option value="1" style={{ background: '#070F1E' }}>1 BHK</option>
                      <option value="2" style={{ background: '#070F1E' }}>2 BHK</option>
                      <option value="3" style={{ background: '#070F1E' }}>3 BHK</option>
                      <option value="4" style={{ background: '#070F1E' }}>4 BHK+</option>
                    </select>
                  </div>

                  {/* Search Button */}
                  <button 
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)',
                      border: 'none',
                      color: '#040814',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '0.78rem',
                      letterSpacing: '0.06em',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      height: '42px',
                      boxShadow: '0 4px 15px rgba(230, 195, 92, 0.25)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.08)'}
                    onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
                  >
                    <Search size={14} />
                    <span>SEARCH PROPERTIES</span>
                  </button>
                </form>
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

          {/* ⚜️ Premium Builders Alliance grayscale gallery */}
          <section className="builder-showcase-section" style={{ padding: '40px 0 60px 0' }}>
            <div style={{ maxWidth: '94%', margin: '0 auto', textAlign: 'center' }}>
              <span className="hero-gold-badge" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', color: '#E6C35C', marginBottom: '8px', display: 'inline-block' }}>
                TRUSTED BY INDIA'S LEADING BUILDERS
              </span>
              <div style={{ width: '40px', height: '2px', background: '#E6C35C', margin: '8px auto 30px auto', borderRadius: '2px' }} />
              
              <div className="builder-showcase-grid" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '40px 30px',
                opacity: 0.85
              }}>
                <div className="builder-logo-item" style={{ fontSize: '1.15rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <strong style={{ color: '#fff', fontSize: '1.35rem', letterSpacing: '0.06em' }}>LODHA</strong>
                  <span style={{ fontSize: '0.52rem', color: '#888', letterSpacing: '0.1em' }}>BUILDING A BETTER LIFE</span>
                </div>
                <div className="builder-logo-item" style={{ fontSize: '1.15rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <strong style={{ color: '#fff', fontSize: '1.35rem', fontStyle: 'italic', fontFamily: 'serif' }}>godrej</strong>
                  <span style={{ fontSize: '0.52rem', color: '#888', letterSpacing: '0.1em' }}>PROPERTIES</span>
                </div>
                <div className="builder-logo-item" style={{ fontSize: '1.15rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <strong style={{ color: '#fff', fontSize: '1.35rem', letterSpacing: '0.08em' }}>VTP REALTY</strong>
                  <span style={{ fontSize: '0.52rem', color: '#888', letterSpacing: '0.1em' }}>VTP TP</span>
                </div>
                <div className="builder-logo-item" style={{ fontSize: '1.15rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <strong style={{ color: '#fff', fontSize: '1.3rem', letterSpacing: '0.06em' }}>KOLTE-PATIL</strong>
                  <span style={{ fontSize: '0.52rem', color: '#888', letterSpacing: '0.06em' }}>Creation, not Construction.</span>
                </div>
                <div className="builder-logo-item" style={{ fontSize: '1.15rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <strong style={{ color: '#fff', fontSize: '1.25rem', letterSpacing: '0.05em' }}>SHAPOORJI PALLONJI</strong>
                  <span style={{ fontSize: '0.52rem', color: '#888', letterSpacing: '0.1em' }}>Real Estate</span>
                </div>
                <div className="builder-logo-item" style={{ fontSize: '1.15rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <strong style={{ color: '#fff', fontSize: '1.35rem', letterSpacing: '0.06em' }}>GERA</strong>
                  <span style={{ fontSize: '0.52rem', color: '#888', letterSpacing: '0.1em' }}>Let's Outdo</span>
                </div>
                <div className="builder-logo-item" style={{ fontSize: '1.15rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <strong style={{ color: '#fff', fontSize: '1.35rem', letterSpacing: '0.06em' }}>NYATI</strong>
                  <span style={{ fontSize: '0.52rem', color: '#888', letterSpacing: '0.1em' }}>BUILDING RELATIONSHIPS</span>
                </div>
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
      <div className="ai-advisor-panel">
        <div className="ai-advisor-header">
          <div className="ai-advisor-icon-pulse">
            <Sparkles size={28} color="var(--gold-primary)" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.4rem', fontFamily: 'var(--font-title)', color: 'var(--text-light)', letterSpacing: '0.04em' }}>
              ⚜️ 24K AI LOCATION ADVISOR
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Real-time multi-metric optimization engine for Pune's high-growth corridors.
            </p>
          </div>
        </div>

        <div className="ai-advisor-grid">
          <div className="ai-select-wrapper">
            <label className="ai-select-label">Investment Budget</label>
            <select 
              value={aiBudget} 
              onChange={e => setAiBudget(e.target.value)} 
              className="ai-select-input"
            >
              <option value="under-80L">Under ₹80 Lakhs</option>
              <option value="80L-1.5Cr">₹80 Lakhs - ₹1.5 Crore</option>
              <option value="1.5Cr-3Cr">₹1.5 Crore - ₹3.0 Crore</option>
              <option value="above-3Cr">Above ₹3.0 Crore (Luxury Mandate)</option>
            </select>
          </div>

          <div className="ai-select-wrapper">
            <label className="ai-select-label">Primary Driver</label>
            <select 
              value={aiPriority} 
              onChange={e => setAiPriority(e.target.value)} 
              className="ai-select-input"
            >
              <option value="appreciation">Capital Appreciation Index</option>
              <option value="yield">High Rental Yield %</option>
              <option value="commute">Commute Time & Proximity</option>
            </select>
          </div>

          <div className="ai-select-wrapper">
            <label className="ai-select-label">Corridor Interest</label>
            <select 
              value={aiCorridor} 
              onChange={e => setAiCorridor(e.target.value)} 
              className="ai-select-input"
            >
              <option value="all">All Growth Corridors</option>
              <option value="WAKAD">Wakad Corridor</option>
              <option value="BANER">Baner Corridor</option>
              <option value="HINJEWADI">Hinjewadi IT Corridor</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button 
              onClick={handleAiAnalyze} 
              className="ai-btn-analyze" 
              style={{ width: '100%', height: '42px' }}
              disabled={aiAnalyzing}
            >
              {aiAnalyzing ? 'Analyzing Location Metrics...' : 'Compute AI Recommendation'}
            </button>
          </div>
        </div>

        {aiAnalyzing && (
          <div className="ai-diagnostic-bar">
            <div className="ai-diagnostic-fill" style={{ width: `${aiProgress}%` }}></div>
          </div>
        )}

        {aiReport && (
          <div className="ai-report-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem', color: '#fff' }}>Recommended Corridor:</span>
                <strong style={{ fontSize: '1.25rem', color: 'var(--gold-primary)', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => handleCorridorClick(aiReport.corridor)}>
                  {aiReport.corridor} CORRIDOR
                </strong>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span className="society-metric-badge" style={{ background: 'rgba(212,175,55,0.1)', color: 'var(--gold-primary)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  Appreciation: {aiReport.appreciationIndex}
                </span>
                <span className="society-metric-badge" style={{ background: 'rgba(46,196,182,0.1)', color: '#2ec4b6', border: '1px solid rgba(46,196,182,0.2)' }}>
                  Yield: {aiReport.rentalYield}
                </span>
                <span className="society-metric-badge" style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                  Transit: {aiReport.connectivityScore}
                </span>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {aiReport.explanation} <strong style={{ color: 'var(--gold-primary)', cursor: 'pointer' }} onClick={() => handleCorridorClick(aiReport.corridor)}>Click here to filter verified properties in this sector.</strong>
            </p>
          </div>
        )}
      </div>

      {/* Corporate Statistics Showcase */}
      <section className="stats-showcase">
        <div className="stats-grid">
          <div className="stat-item" style={{ transform: 'none', transition: 'all 0.3s ease' }}>
            <h4 style={{ fontSize: '2.2rem', color: 'var(--gold-primary)', textShadow: '0 0 10px rgba(212,175,55,0.15)' }}>₹{stats.inventory}+ Cr</h4>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Curated Inventory</p>
          </div>
          <div className="stat-item">
            <h4 style={{ fontSize: '2.2rem', color: 'var(--gold-primary)', textShadow: '0 0 10px rgba(212,175,55,0.15)' }}>{stats.verified}%</h4>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Verified Availability</p>
          </div>
          <div className="stat-item">
            <h4 style={{ fontSize: '2.2rem', color: 'var(--gold-primary)', textShadow: '0 0 10px rgba(212,175,55,0.15)' }}>{stats.families}+</h4>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Pune Families Guided</p>
          </div>
          <div className="stat-item">
            <h4 style={{ fontSize: '2.2rem', color: '#2ec4b6', textShadow: '0 0 10px rgba(46,196,182,0.15)' }}>0%</h4>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Developer Brokerage</p>
          </div>
        </div>
      </section>

      {/* Authorized Developer Associations */}
      <div className="builder-partners-showcase">
        <span className="partners-label">Authorized Portfolio Advisors for Pune's Tier-1 Developers</span>
        <div className="partners-list">
          <span className="partner-name">VTP REALTY</span>
          <span className="partner-name">KOLTE-PATIL</span>
          <span className="partner-name">GODREJ PROPERTIES</span>
          <span className="partner-name">PANCHSHIL</span>
          <span className="partner-name">KASTURI</span>
        </div>
      </div>

      {/* Interactive Corridor Cards Grid with Live Metrics */}
      <section className="corridors-section" id="corridors">
        <div className="section-header">
          <h2 className="luxury-title reveal-mask">
            <span className="reveal-mask-content">Pune Tech Corridor Live Market Trends</span>
          </h2>
          <p className="section-subtitle reveal-fade-up">Select an area to explore live pricing and average appreciation index metrics</p>
        </div>
        
        <div className="corridors-grid">
          {corridorData.map((corridor) => (
            <div 
              key={corridor.id} 
              className={`corridor-card ${filters.location === corridor.id ? 'active' : ''}`}
              onClick={() => handleCorridorClick(corridor.id)}
            >
              <div className="corridor-card-glow"></div>
              <div className="corridor-icon-wrapper">{corridor.icon}</div>
              <div className="corridor-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h3 style={{ margin: 0 }}>{corridor.name}</h3>
                  <span className="growth-indicator">{corridor.growth}</span>
                </div>
                <p style={{ marginBottom: '8px' }}>{corridor.tagline}</p>
                <div className="corridor-metrics">
                  <span>Avg. Price: <strong>{corridor.pricePerSqft}/sqft</strong></span>
                  <span>Yield: <strong>{corridor.yield}</strong></span>
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
            <p>Appreciation-rich corridors delivering strong capital growth and consistent rental yields.</p>
          </div>
        </div>
      </section>

      {/* Main Listings and Directories Container */}
      <div className="main-portal-listings-section" style={{ maxWidth: '1410px', margin: '0 auto', padding: '0 20px' }}>
          
          {activeSection === 'listings' && (
            <>
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
                      <option value="BANER">Baner Tech Corridor</option>
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

              {/* Listings Header Row */}
              <div className="listings-header-row" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
                <span className="total-found-badge" style={{ alignSelf: 'flex-start' }}>
                  🏢 {totalElements} Verified listings found in {filters.location || 'Pune West'}
                </span>
                
                {/* Horizontal Segmented Luxury controls */}
                <div className="luxury-segmented-controls">
                  <button onClick={() => handleCollectionChange('ALL')} className={`luxury-segment-btn ${activeCollection === 'ALL' ? 'active' : ''}`}>All Luxury</button>
                  <button onClick={() => handleCollectionChange('APARTMENT')} className={`luxury-segment-btn ${activeCollection === 'APARTMENT' ? 'active' : ''}`}>Premium Apartments</button>
                  <button onClick={() => handleCollectionChange('VILLA')} className={`luxury-segment-btn ${activeCollection === 'VILLA' ? 'active' : ''}`}>Luxury Villas</button>
                  <button onClick={() => handleCollectionChange('PENTHOUSE')} className={`luxury-segment-btn ${activeCollection === 'PENTHOUSE' ? 'active' : ''}`}>Penthouse Portfolio</button>
                  <button onClick={() => handleCollectionChange('COMMERCIAL')} className={`luxury-segment-btn ${activeCollection === 'COMMERCIAL' ? 'active' : ''}`}>Commercial Assets</button>
                  <button onClick={() => handleCollectionChange('READY')} className={`luxury-segment-btn ${activeCollection === 'READY' ? 'active' : ''}`}>Ready To Move</button>
                  <button onClick={() => handleCollectionChange('NEW')} className={`luxury-segment-btn ${activeCollection === 'NEW' ? 'active' : ''}`}>New Launches</button>
                  <button onClick={() => handleCollectionChange('WISHLIST')} className={`luxury-segment-btn ${activeCollection === 'WISHLIST' ? 'active' : ''}`}>Saved Portfolio ({wishlistIds.length})</button>
                </div>
              </div>

              {loading ? (
                <div className="properties-grid" style={{ minHeight: '400px' }}>
                  {[1, 2, 3, 4, 5, 6].map(i => <PropertySkeleton key={i} />)}
                </div>
              ) : error ? (
                <div className="error-card">{error}</div>
              ) : (!isSearchActive && activeCollection === 'ALL') ? (
                renderCuratedCarousels()
              ) : properties.length === 0 ? (
                <div className="empty-state">
                  <p>No premium properties match the filter configuration.</p>
                  <button onClick={handleResetFilters} className="btn-gold" style={{ marginTop: '10px' }}>Reset Filters</button>
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
                      onOpenDetail={(prop) => { 
                        setSelectedPropertyDetail(prop); 
                        window.scrollTo({ top: 300, behavior: 'smooth' }); 
                      }}
                    />
                  ))}
                </div>
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

              {/* Grayscale Closed Deals FOMO Section */}
              <section className="closed-deals-section" style={{ marginTop: '50px', borderTop: '1px solid var(--border-muted)', paddingTop: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888', marginBottom: '16px' }}>
                  <Lock size={18} />
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, letterSpacing: '0.05em' }}>RECENTLY CLOSED TRANSACTIONS</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px', lineHeight: 1.5 }}>
                  Advisory records of successfully completed property assignments. Grayscale display signifies unavailable listings. Enquire for similar configurations.
                </p>

                {closedLoading ? (
                  <div className="closed-deals-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{ height: '220px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                        <div className="shimmer" style={{ height: '140px' }} />
                        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div className="shimmer" style={{ width: '70%', height: '14px', borderRadius: '3px' }} />
                          <div className="shimmer" style={{ width: '40%', height: '12px', borderRadius: '3px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : closedProperties.length === 0 ? (
                  <div className="empty-state" style={{ color: '#888', borderStyle: 'dashed' }}><p>No recently closed records loaded.</p></div>
                ) : (
                  <div className="closed-deals-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                    {closedProperties.map(p => (
                      <div key={p.id} className="closed-deal-card" style={{ filter: 'grayscale(100%)', opacity: 0.65, border: '1px solid var(--border-muted)', borderRadius: '8px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)', position: 'relative' }}>
                        <div style={{ height: '140px', backgroundImage: `url('${p.imageUrl || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80"}')`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Lock size={14} color="var(--gold-primary)" />
                            </div>
                          </div>
                          <span style={{ position: 'absolute', bottom: '10px', left: '10px', background: '#000', color: '#fff', fontSize: '0.65rem', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                            Acquired under private mandate
                          </span>
                        </div>
                        <div style={{ padding: '12px' }}>
                          <h4 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</h4>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>Location: {p.location} Corridor</p>
                          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gold-primary)' }}>{formatPrice(p.price, p.transactionType)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
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
                      <span style={{ fontSize: '0.78rem', background: 'rgba(212,175,55,0.1)', color: 'var(--gold-primary)', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{selectedSocietyDetail.location} Corridor</span>
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
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{selectedSocietyDetail.nearbyItParks || 'Nearby Hinjewadi IT Corridors'}</span>
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
                  Discover tier-1 residential developments, integrated smart townships, and luxury high-rise communities across Pune West's growth corridors. Direct developer mandates with 0% brokerage.
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
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Delivered 1200+ units in Wakad and Baner Corridors.</p>
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
                    <div className="empty-state">No gated townships currently listed in this corridor.</div>
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
          
          {/* Priority Callback Desk */}
          <div className="callback-card" style={{ margin: 0, height: '100%' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--gold-primary)', marginBottom: '10px' }}>
              <Clock size={18} className="animate-pulse" />
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-title)' }}>60-Second Priority Callback</h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '16px' }}>
              Submit your mobile number. Our regional tech-corridor specialist will dial your line within 60 seconds.
            </p>
            <form onSubmit={handleVipSubmit}>
              <div className="form-group-floating">
                <input 
                  type="text" 
                  id="callbackName"
                  className="form-input-floating" 
                  required 
                  placeholder=" " 
                  value={vipForm.name} 
                  onChange={e => setVipForm({ ...vipForm, name: e.target.value })} 
                />
                <label htmlFor="callbackName" className="form-label-floating">Your Name</label>
              </div>
              <div className="form-group-floating">
                <input 
                  type="tel" 
                  id="callbackPhone"
                  className="form-input-floating" 
                  required 
                  placeholder=" " 
                  value={vipForm.phone} 
                  onChange={e => setVipForm({ ...vipForm, phone: e.target.value })} 
                />
                <label htmlFor="callbackPhone" className="form-label-floating">WhatsApp Mobile (+91)</label>
              </div>
              <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center' }} disabled={vipSubmitting}>
                {vipSubmitting ? <Loader className="animate-spin" size={16} /> : 'Connect Priority Advisor'}
              </button>
            </form>
          </div>

          {/* Seller Exclusive Mandate Desk */}
          <div id="seller-mandate-anchor" className="seller-mandate-premium" style={{ margin: 0, height: '100%' }}>
            <div className="seller-mandate-header">
              <div className="seller-mandate-icon-ring">
                <Building size={20} />
              </div>
              <div>
                <h3 className="seller-mandate-title">Seller Advisory Mandate</h3>
                <p className="seller-mandate-subtitle">List Your Property • 0% Brokerage</p>
              </div>
            </div>
            <p className="seller-mandate-desc">
              Direct access to premium verified buyers, institutional property funds, and HNWI investors in Baner, Wakad, and Hinjewadi.
            </p>
            <form onSubmit={handleSellerSubmit} className="seller-mandate-form">
              <div className="form-group">
                <label className="seller-form-label">Owner Name</label>
                <input 
                  type="text" 
                  name="name"
                  className="form-input seller-input" 
                  required 
                  placeholder="Full Name" 
                  value={sellerForm.name} 
                  onChange={handleSellerFormChange} 
                />
              </div>
              <div className="seller-form-grid">
                <div className="form-group">
                  <label className="seller-form-label">WhatsApp Mobile</label>
                  <input 
                    type="tel" 
                    name="phone"
                    className="form-input seller-input" 
                    required 
                    placeholder="+91 XXXXX XXXXX" 
                    value={sellerForm.phone} 
                    onChange={handleSellerFormChange} 
                  />
                </div>
                <div className="form-group">
                  <label className="seller-form-label">Owner Email</label>
                  <input 
                    type="email" 
                    name="email"
                    className="form-input seller-input" 
                    required 
                    placeholder="your@email.com" 
                    value={sellerForm.email} 
                    onChange={handleSellerFormChange} 
                  />
                </div>
              </div>
              <div className="seller-form-grid">
                <div className="form-group">
                  <label className="seller-form-label">Project / BHK</label>
                  <input 
                    type="text" 
                    name="propertyTitle"
                    className="form-input seller-input" 
                    required 
                    placeholder="e.g. Blue Ridge 3 BHK" 
                    value={sellerForm.propertyTitle} 
                    onChange={handleSellerFormChange} 
                  />
                </div>
                <div className="form-group">
                  <label className="seller-form-label">Location</label>
                  <select 
                    name="location" 
                    className="form-input seller-input" 
                    value={sellerForm.location} 
                    onChange={handleSellerFormChange}
                  >
                    <option value="HINJEWADI">Hinjewadi</option>
                    <option value="BANER">Baner</option>
                    <option value="WAKAD">Wakad</option>
                    <option value="BALEWADI">Balewadi</option>
                    <option value="TATHAWADE">Tathawade</option>
                    <option value="MAHALUNGE">Mahalunge</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="seller-form-label">Expected Valuation (₹)</label>
                <input 
                  type="number" 
                  name="expectedPrice" 
                  className="form-input seller-input" 
                  required 
                  placeholder="e.g. 85,00,000" 
                  value={sellerForm.expectedPrice} 
                  onChange={handleSellerFormChange} 
                />
              </div>
              <div className="form-group">
                <label className="seller-form-label">Property Highlights</label>
                <textarea 
                  name="description" 
                  className="form-input seller-input" 
                  rows="2" 
                  placeholder="e.g. 12th floor, modular kitchen, park view, covered parking..."
                  value={sellerForm.description} 
                  onChange={handleSellerFormChange} 
                />
              </div>
              <button type="submit" className="btn-seller-mandate" disabled={submitLoading}>
                {submitLoading ? 'Registering...' : '📋 Register Sale Mandate'}
              </button>
            </form>
          </div>
        </div>
      </section>

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

      {/* Modular Chauffeur Site Visit Modal */}
      <Suspense fallback={null}>
        <ChauffeurModal 
          isOpen={isChauffeurModalOpen}
          property={selectedChauffeurProp}
          onClose={() => setIsChauffeurModalOpen(false)}
          onSubmit={handleChauffeurSubmit}
          chauffeurForm={chauffeurForm}
          setChauffeurForm={setChauffeurForm}
          chauffeurSubmitting={chauffeurSubmitting}
        />
      </Suspense>

      {/* Modular MahaRERA compliance slide drawer */}
      <Suspense fallback={null}>
        <ReraDrawer 
          isOpen={isReraDrawerOpen}
          property={selectedReraProperty}
          onClose={() => setIsReraDrawerOpen(false)}
        />
      </Suspense>

      {/* Modular Enquiry Callback Modal with Mortgage Calculator */}
      {isModalOpen && selectedProperty && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '850px' }}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            
            <div className="modal-split-layout">
              <div className="modal-form-side">
                <h3 className="modal-title">Request Private Presentation</h3>
                <p className="modal-subtitle">Register interest for <strong>{selectedProperty.title}</strong>.</p>
                
                <form onSubmit={handleLeadSubmit}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required 
                      placeholder="e.g. Rohan Sharma"
                      value={leadForm.name} 
                      onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">WhatsApp Mobile</label>
                      <input 
                        type="tel" 
                        className="form-input" 
                        required 
                        placeholder="e.g. +919876543210"
                        value={leadForm.phone} 
                        onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        required 
                        placeholder="e.g. rohan@gmail.com"
                        value={leadForm.email} 
                        onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea 
                      className="form-input" 
                      rows="2" 
                      value={leadForm.notes} 
                      onChange={e => setLeadForm({ ...leadForm, notes: e.target.value })}
                    />
                  </div>

                  <div className="advisory-appreciation-calculator">
                    <span className="cal-title"><TrendingUp size={14} style={{ marginRight: '6px' }} /> Capital Appreciation Projection</span>
                    <div className="appreciation-selectors">
                      <button type="button" className={appreciationYears === 3 ? 'active' : ''} onClick={() => setAppreciationYears(3)}>3 Years</button>
                      <button type="button" className={appreciationYears === 5 ? 'active' : ''} onClick={() => setAppreciationYears(5)}>5 Years</button>
                      <button type="button" className={appreciationYears === 10 ? 'active' : ''} onClick={() => setAppreciationYears(10)}>10 Years</button>
                    </div>
                    <div className="appreciation-result">
                      <span>Projected Value:</span>
                      <strong>{formatPrice(calculateAppreciatedValue(selectedProperty.price, selectedProperty.location, appreciationYears))}</strong>
                      <span className="cagr-sub">Based on {getAppreciationCAGR(selectedProperty.location)}% historical corridor CAGR</span>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-gold" 
                    style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
                    disabled={submitLoading}
                  >
                    {submitLoading ? <Loader className="animate-spin" size={20} /> : 'Submit Inquiry Desk'}
                  </button>
                </form>
              </div>

              <div id="mortgage-desk" className="modal-calculator-side">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--gold-primary)', marginBottom: '16px' }}>
                  <Calculator size={20} />
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--font-title)' }}>Mortgage Estimator</h4>
                </div>

                <div className="emi-result-box">
                  <span className="emi-label">Estimated Monthly EMI</span>
                  <span className="emi-value">{formatPrice(mortgageDetails.monthlyEMI)}</span>
                  <span className="emi-sub">Principal & Interest only</span>
                </div>

                <div className="ltv-proportion-container">
                  <span className="ltv-title">Capital Structure (LTV)</span>
                  <div className="ltv-bar-wrapper">
                    <div className="ltv-bar-equity" style={{ width: `${mortgageDetails.downPaymentPercent}%` }}></div>
                    <div className="ltv-bar-debt" style={{ width: `${100 - mortgageDetails.downPaymentPercent}%` }}></div>
                  </div>
                  <div className="ltv-bar-labels">
                    <span>Equity: {mortgageDetails.downPaymentPercent}%</span>
                    <span>Debt (Bank): {100 - mortgageDetails.downPaymentPercent}%</span>
                  </div>
                </div>

                <div className="slider-group" style={{ marginTop: '20px' }}>
                  <div className="slider-header">
                    <span>Down Payment ({mortgageDetails.downPaymentPercent}%)</span>
                    <span>{formatPrice(Number(selectedProperty.price) * (mortgageDetails.downPaymentPercent / 100))}</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="80" 
                    step="5"
                    value={mortgageDetails.downPaymentPercent} 
                    onChange={e => handleMortgageChange('downPaymentPercent', e.target.value)}
                    className="calculator-slider"
                  />
                </div>

                <div className="slider-group">
                  <div className="slider-header">
                    <span>Interest Rate</span>
                    <span>{mortgageDetails.interestRate}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="15" 
                    step="0.1" 
                    value={mortgageDetails.interestRate} 
                    onChange={e => handleMortgageChange('interestRate', e.target.value)}
                    className="calculator-slider"
                  />
                </div>

                <div className="slider-group">
                  <div className="slider-header">
                    <span>Loan Term</span>
                    <span>{mortgageDetails.loanTermYears} Years</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="30" 
                    step="1" 
                    value={mortgageDetails.loanTermYears} 
                    onChange={e => handleMortgageChange('loanTermYears', e.target.value)}
                    className="calculator-slider"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating chatbot widget */}
      <Suspense fallback={null}>
        <ChatWidget 
          isOpen={isChatWidgetOpen}
          setIsOpen={setIsChatWidgetOpen}
          chatMessages={chatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          onSubmit={handleChatSubmit}
        />
      </Suspense>

      {/* Sticky Floating WhatsApp */}
      <a 
        href="https://wa.me/919673000053?text=I%20am%20interested%20in%20real%20estate%20consultation"
        className="floating-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        title="WhatsApp Consultation Desk"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.233-1.371c1.394.756 2.96 1.157 4.777 1.158h.005c5.502 0 9.987-4.476 9.988-9.986C22 7.478 17.517 2 12.012 2zm5.787 14.404c-.24.675-1.397 1.285-1.92 1.36-.474.07-1.088.13-3.18-.737-2.677-1.11-4.4-3.837-4.536-4.015-.132-.178-1.08-1.433-1.08-2.73 0-1.298.68-1.936.92-2.199.243-.263.53-.328.706-.328.176 0 .353.003.507.01.162.007.382-.062.597.45.22.524.75 1.83.816 1.964.066.13.11.286.022.463-.087.177-.13.287-.26.439-.13.15-.27.337-.385.45-.126.126-.259.263-.11.517.15.253.66.1.91 1.488.75 1.309 1.37 2.14 2.15 2.65.783.51 1.237.585 1.58.204.34-.38 1.484-1.72 1.88-2.31.398-.59.794-.49 1.346-.29.553.2.3.5 1.764 1.226.22.11.365.163.475.328.11.165.11.954-.13 1.63z"/>
        </svg>
      </a>

      {/* Portal Footer */}
      <PortalFooter />
    </div>
  );
}



// Corridor static datasets used for the tech corridor filters (Redesigned with Metrics)
const corridorData = [
  { id: 'BANER', name: 'Baner Corridor', tagline: 'Balewadi Link Road, high appreciation', icon: <Activity size={20} />, pricePerSqft: '₹11,500', yield: '3.8%', growth: '+16%' },
  { id: 'WAKAD', name: 'Wakad Corridor', tagline: 'Datta Mandir, multi-lane connectivity', icon: <TrendingUp size={20} />, pricePerSqft: '₹8,200', yield: '4.5%', growth: '+14%' },
  { id: 'HINJEWADI', name: 'Hinjewadi IT Corridor', tagline: 'Phase 1 & 2 Infotech park hub', icon: <Laptop size={20} />, pricePerSqft: '₹7,800', yield: '5.2%', growth: '+11%' },
  { id: 'BALEWADI', name: 'Balewadi High Street', tagline: 'Premium retail & high-end dining', icon: <Sparkles size={20} />, pricePerSqft: '₹10,200', yield: '4.0%', growth: '+13%' },
  { id: 'TATHAWADE', name: 'Tathawade Corridor', tagline: 'Educational hub & premium villas', icon: <Users size={20} />, pricePerSqft: '₹7,200', yield: '4.6%', growth: '+15%' },
  { id: 'MAHALUNGE', name: 'Mahalunge Corridor', tagline: 'Next-gen smart city township plots', icon: <LineChart size={20} />, pricePerSqft: '₹6,900', yield: '4.8%', growth: '+18%' }
];

