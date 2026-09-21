import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { chatWithVisitor } from '../services/geminiService';
import { 
  Search, Loader, CheckCircle, IndianRupee, Laptop, Sparkles, Activity, 
  LineChart, Car, Users, ShieldCheck, 
  Calculator, Compass, Clock, Lock, TrendingUp, Building,
  ChevronLeft, ChevronRight, ChevronDown, MapPin, BedDouble, Phone, Calendar,
  Handshake, ArrowRight, Key, Home, Briefcase, Camera, Maximize2, X,
  Upload, Trash2, Plus, Image as ImageIcon
} from 'lucide-react';
import './Portal.css';

// Import Modular Components
import PortalNavbar from '../layouts/PortalNavbar';
import PortalFooter from '../layouts/PortalFooter';
import PropertyCard from './PropertyCard';
import PropertyDetailView from './PropertyDetailView';

const CompareOverlay = lazy(() => import('./CompareOverlay'));
const ReraDrawer = lazy(() => import('./ReraDrawer'));
const ChatWidget = lazy(() => import('./ChatWidget'));
const DataLabsView = lazy(() => import('./DataLabsView'));
import PdfBrochureModal from './PdfBrochureModal';
import DeveloperLogoMarquee from './DeveloperLogoMarquee';
import AdvancedPropertyFilterBar from './AdvancedPropertyFilterBar';

const DEFAULT_GALLERY_ITEMS = [
  {
    id: 1,
    title: '3 BHK Luxury Flat Handover Celebration',
    location: 'Wakad Central',
    category: 'HANDOVER',
    categoryLabel: '🔑 Key Handover',
    dev: 'Neeraj Giri & Happy Homebuyers',
    img: '/gallery_handover_1.png',
    rating: '5.0',
    reviewer: 'Dr. Anand Kulkarni & Family',
    reviewSnippet: '"Neeraj & the 24K team made our Wakad flat handover completely stress-free with 100% RERA verified title clarity."',
    desc: 'Neeraj Giri (Senior Property Advisor) handing over VIP possession keys to happy family at Wakad Central estate.'
  },
  {
    id: 2,
    title: 'RERA Token & Agreement Ceremony',
    location: 'Mahalunge Smart City',
    category: 'HANDOVER',
    categoryLabel: '🔑 Key Handover',
    dev: 'Nilesh Rai & Client',
    img: '/gallery_handover_2.png',
    rating: '5.0',
    reviewer: 'Rajesh & Pooja Deshmukh',
    reviewSnippet: '"Best investment guidance in Pune West. Transparent pricing, zero hidden charges, and quick bank loan clearance."',
    desc: 'Nilesh Rai (Investment Specialist) finalizing 100% RERA verified agreement and key handover at VTP Blue Waters.'
  },
  {
    id: 3,
    title: 'Executive Penthouse Key Presentation',
    location: 'Baner High Street',
    category: 'HANDOVER',
    categoryLabel: '🔑 Key Handover',
    dev: 'Jyoti Dhale & Client',
    img: '/gallery_handover_3.png',
    rating: '5.0',
    reviewer: 'Vikramaditya Singhania (NRI)',
    reviewSnippet: '"Being in Singapore, Jyoti managed everything from virtual walkthrough to final registry seamlessly."',
    desc: 'Jyoti Dhale celebrating successful key handover with client at Baner High Street luxury penthouse.'
  },
  {
    id: 4,
    title: 'VIP Client Spot Booking Celebration',
    location: 'Hinjewadi Phase 1',
    category: 'HANDOVER',
    categoryLabel: '🔑 Key Handover',
    dev: '24K Senior Advisory Desk',
    img: '/gallery_handover_4.png',
    rating: '5.0',
    reviewer: 'Amitava Sen (Tech VP)',
    reviewSnippet: '"Got ₹18L savings via exclusive 24K Realtors developer mandate on our 4 BHK township booking."',
    desc: 'Exclusive mandate spot booking milestone achieved for 400-acre township buyer.'
  },
  {
    id: 6,
    title: 'Private Mercedes Chauffeur Site Visit',
    location: 'Hinjewadi Phase 1',
    category: 'VISITS',
    categoryLabel: '🚗 VIP Site Visit',
    dev: '24K Luxury Advisory Desk',
    img: '/gallery_visit_1.png',
    desc: 'Complimentary door-to-door Mercedes pickup & drop for HNWI client inspecting Hinjewadi IT park high-rises.'
  },
  {
    id: 7,
    title: 'Site Inspection & Title Clearance Walk',
    location: 'Wakad Datta Mandir',
    category: 'VISITS',
    categoryLabel: '🚗 VIP Site Visit',
    dev: 'Neeraj Giri (Senior Advisor)',
    img: '/gallery_visit_2.png',
    desc: 'On-site technical inspection verifying RERA carpet area, parking slots & NOC legal titles.'
  },
  {
    id: 8,
    title: 'Family Site Tour & Sample Flat Inspection',
    location: 'Mahalunge Smart City',
    category: 'VISITS',
    categoryLabel: '🚗 VIP Site Visit',
    dev: 'Jyoti Dhale (Site Coordinator)',
    img: '/gallery_visit_3.png',
    desc: 'Guided tour of German show flat layout, clubhouse amenities, and upcoming metro line access.'
  },
  {
    id: 10,
    title: 'VJ Supernova 38-Story Glass Facade',
    location: 'Baner Main Road',
    category: 'TOWERS',
    categoryLabel: '🏙️ High-Rise',
    dev: 'Vilas Javdekar (VJ)',
    img: '/gallery_vj_supernova_tower.png',
    desc: 'Illuminated 38-story landmark glass tower facade situated right on Baner High Street.'
  },
  {
    id: 11,
    title: 'Kolte-Patil 400-Acre Smart Township',
    location: 'Hinjewadi Phase 1',
    category: 'TOWERS',
    categoryLabel: '🏙️ High-Rise',
    dev: 'Kolte-Patil Developers',
    img: '/gallery_tower_2.png',
    desc: 'Double-glazed glass high-rise towers with 360° views of Hinjewadi IT Corridor.'
  },
  {
    id: 12,
    title: 'VTP Blue Waters Township Skyline',
    location: 'Mahalunge Smart City',
    category: 'TOWERS',
    categoryLabel: '🏙️ High-Rise',
    dev: 'VTP Realty',
    img: '/gallery_tower_3.png',
    desc: '100+ acre riverfront smart township skyline surrounded by Mula River and hill views.'
  },
  {
    id: 13,
    title: 'Shapoorji Joyville High-Rise Arena',
    location: 'Hinjewadi Phase 2',
    category: 'TOWERS',
    categoryLabel: '🏙️ High-Rise',
    dev: 'Shapoorji Pallonji',
    img: '/gallery_key_handover.png',
    desc: 'Premium high-rise township cluster right opposite Embassy Techzone IT Park.'
  },
  {
    id: 15,
    title: 'Sky Club 24K Rooftop Infinity Pool',
    location: 'Wakad Central',
    category: 'INTERIORS',
    categoryLabel: '🏊 Resort Amenities',
    dev: 'Kohinoor Group',
    img: '/gallery_infinity_pool.png',
    desc: 'Temperature-controlled rooftop infinity pool with sunken poolside cabanas.'
  },
  {
    id: 16,
    title: 'Italian Marble 3 BHK Sample Suite',
    location: 'Wakad Central',
    category: 'INTERIORS',
    categoryLabel: '🛋️ Show Flat',
    dev: 'Gera Developments',
    img: '/gallery_sample_flat_interior.png',
    desc: 'Expansive 1,450 sq.ft. sample living room featuring Italian Bottochino marble flooring.'
  },
  {
    id: 19,
    title: '2-Acre Elevated Podium Central Park',
    location: 'Hinjewadi Phase 1',
    category: 'INTERIORS',
    categoryLabel: '🌳 Greens',
    dev: 'Pharande Spaces',
    img: '/gallery_tower_2.png',
    desc: 'Vehicle-free 2-acre elevated podium garden featuring cascading water walls.'
  },
  {
    id: 22,
    title: 'Kolte-Patil Life Republic 400-Acre Smart City',
    location: 'Hinjewadi Phase 1 Extension',
    category: 'HINJEWADI',
    categoryLabel: '🏙️ Hinjewadi Township',
    dev: 'Kolte-Patil Developers',
    img: '/gallery_tower_2.png',
    desc: '400+ acre mega township with Anisha Global School, botanical gardens & 150 ft wide spine roads.'
  },
  {
    id: 23,
    title: 'Megapolis 150-Acre Township',
    location: 'Hinjewadi Phase 3',
    category: 'HINJEWADI',
    categoryLabel: '🏙️ Hinjewadi Township',
    dev: 'Marvel Realtors',
    img: 'https://twentyfourk-realestate-media.s3.ap-south-1.amazonaws.com/properties/megapolis-sunway/01_aerial_hero.png',
    desc: '150-acre integrated smart township with 60+ amenities, resort pool, grand clubhouse, and direct walkability to TCS, Infosys & Wipro IT hubs.'
  },
  {
    id: 21,
    title: 'Paranjape Blue Ridge 138-Acre Riverfront Township',
    location: 'Hinjewadi Phase 1',
    category: 'HINJEWADI',
    categoryLabel: '🏙️ Hinjewadi Township',
    dev: 'Paranjape Schemes',
    img: '/gallery_tower_3.png',
    desc: '138-acre iconic riverfront township with 18-hole golf course, school & riverwalk promenade.'
  },
  {
    id: 31,
    title: 'Lodha Skyscraper Foundation & Tower Crane Stage',
    location: 'Lodha Panache & Belmondo Corridor',
    category: 'LODHA',
    categoryLabel: '🏗️ Lodha Construction Stage 1',
    dev: 'Lodha Group',
    img: '/lodha_1_under_construction.png',
    desc: 'Stage 1: High-rise structural steel framework and tower crane installation at golden hour sunset.'
  },
  {
    id: 32,
    title: 'Lodha Glass Facade & Mid-Stage Milestone',
    location: 'Lodha Bella Vita, NIBM-Baner Link',
    category: 'LODHA',
    categoryLabel: '🏗️ Lodha Construction Stage 2',
    dev: 'Lodha Group',
    img: '/lodha_2_mid_construction.png',
    desc: 'Stage 2: 25-story luxury tower mid-construction with curtain glass panels & podium deck structure.'
  },
  {
    id: 33,
    title: 'Lodha Belmondo 100-Acre Completed Drone View',
    location: 'Gagangiri Hills, Mumbai-Pune Expressway',
    category: 'LODHA',
    categoryLabel: '🏰 Lodha Completed Estate',
    dev: 'Lodha Group',
    img: '/lodha_3_completed_aerial.png',
    desc: 'Stage 3: Completed iconic 30-story towers overlooking 45-acre golf course & riverfront promenade.'
  },
  {
    id: 34,
    title: 'Lodha 5-Star Hotel Italian Marble Grand Lobby',
    location: 'Lodha Panache, Baner-Balewadi High St',
    category: 'LODHA',
    categoryLabel: '🏛️ Lodha 5-Star Amenities',
    dev: 'Lodha Group',
    img: '/lodha_4_grand_lobby.png',
    desc: 'Stage 4: Double-height entrance lobby with Italian Statuario marble, chandelier & 24/7 front desk.'
  },
  {
    id: 35,
    title: 'Lodha Ultra-Luxury 4BHK Master Living Suite',
    location: 'Lodha Bella Vita, NIBM Corridor',
    category: 'LODHA',
    categoryLabel: '🛋️ Lodha Show Flat Interior',
    dev: 'Lodha Group',
    img: '/lodha_5_luxury_living.png',
    desc: 'Stage 5: Floor-to-ceiling glass panoramic living room with Italian beige marble and sky deck.'
  },
  {
    id: 36,
    title: 'Lodha Designer Gourmet Italian Modular Kitchen',
    location: 'Lodha Panache Signature Series',
    category: 'LODHA',
    categoryLabel: '🍳 Lodha Designer Interiors',
    dev: 'Lodha Group',
    img: '/lodha_6_italian_kitchen.png',
    desc: 'Stage 6: Waterfall marble island counter, Miele appliances, & under-cabinet ambient LED illumination.'
  },
  {
    id: 37,
    title: 'Lodha Skyscraper Rooftop Infinity Swimming Pool',
    location: 'Lodha Towers Sky Promenade',
    category: 'LODHA',
    categoryLabel: '🏊 Lodha Sky Resort',
    dev: 'Lodha Group',
    img: '/lodha_7_infinity_pool.png',
    desc: 'Stage 7: Glass-edge infinity pool overlooking Pune skyline with submerged sun lounges.'
  },
  {
    id: 38,
    title: 'Lodha 25,000 sq.ft Clubhouse & Zen Water Gardens',
    location: 'Lodha Belmondo Gated Estate',
    category: 'LODHA',
    categoryLabel: '🌿 Lodha Zen Gardens',
    dev: 'Lodha Group',
    img: '/lodha_8_clubhouse_gardens.png',
    desc: 'Stage 8: Grand clubhouse with cascading fountains, Japanese zen gardens, & evening LED lighting.'
  },
  {
    id: 39,
    title: 'Lodha Presidential Master Suite & Private Terrace',
    location: 'Lodha Panache Penthouse Suite',
    category: 'LODHA',
    categoryLabel: '🛏️ Lodha Penthouse Suite',
    dev: 'Lodha Group',
    img: '/lodha_9_master_bedroom.png',
    desc: 'Stage 9: Velvet headboard master suite opening to private balcony with uninterrupted hill views.'
  },
  {
    id: 40,
    title: 'Lodha VIP Key Handover & Gold Box Ceremony',
    location: 'Lodha Belmondo Grand Entrance',
    category: 'LODHA',
    categoryLabel: '🔑 Client Key Handover',
    dev: 'Lodha & 24K Realtors',
    img: '/lodha_10_key_handover.png',
    desc: 'Stage 10: Happy executive client receiving golden key box with 24K Realtors VIP advisory team.'
  }
];






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
  const navigate = useNavigate();
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
    query: '',
    builder: '',
    reraOnly: false
  });

  const [activeCollection, setActiveCollection] = useState('ALL');
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [selectedPropertyDetail, setSelectedPropertyDetail] = useState(null);

  const handleOpenPropertyDetail = useCallback((prop) => {
    if (!prop) return;
    const targetKey = prop.id || prop.slug;
    if (targetKey) {
      navigate(`/property/${targetKey}`, { state: { property: prop } });
    } else {
      setSelectedPropertyDetail(prop);
      setActiveSubView(null);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [navigate]);

  const handleClosePropertyDetail = useCallback(() => {
    setSelectedPropertyDetail(null);
    if (window.location.pathname.startsWith('/property/')) {
      navigate('/');
    }
    if (window.location.hash.startsWith('#property/')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    setTimeout(() => {
      const el = document.getElementById('listings-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, [navigate]);

  useEffect(() => {
    const handlePopState = () => {
      if (!window.location.pathname.startsWith('/property/')) {
        setSelectedPropertyDetail(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
  const [searchBuilder, setSearchBuilder] = useState('');
  const [searchReraOnly, setSearchReraOnly] = useState(false);
  const [isAiSearchActive, setIsAiSearchActive] = useState(false);
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

  const [activeBrandFilter, setActiveBrandFilter] = useState('ALL');

  useEffect(() => {
    setSelectedSocietyDetail(null);
    setSelectedBuilderDetail(null);
    setSelectedLocalityDetail(null);
    setSelectedBlogDetail(null);
  }, [activeSection]);

  // ── SPA History & Hash Listener for Property Details (Browser Back ← / Forward →) ──
  useEffect(() => {
    const handlePortalHashChange = async () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('property/')) {
        const propId = hash.replace('property/', '');
        if (selectedPropertyDetail && (String(selectedPropertyDetail.id) === String(propId) || String(selectedPropertyDetail.id) === `prop-${propId}`)) {
          return;
        }
        const pool = (allRawProperties && allRawProperties.length > 0) ? allRawProperties : properties;
        let found = pool.find(p => String(p.id) === String(propId) || String(p.id) === `prop-${propId}` || (p.slug && p.slug === propId));
        if (found) {
          setSelectedPropertyDetail(found);
          setActiveSubView(null);
          window.scrollTo(0, 0);
        } else if (propId) {
          try {
            const fetched = await apiService.getPropertyById(propId);
            if (fetched) {
              setSelectedPropertyDetail(fetched);
              setActiveSubView(null);
              window.scrollTo(0, 0);
            }
          } catch (e) {
            console.warn('[HashRouter] Property lookup notice for ID:', propId, e);
          }
        }
      } else if (hash === 'portal' || hash === 'listings') {
        setSelectedPropertyDetail(null);
      }
    };

    window.addEventListener('hashchange', handlePortalHashChange);
    window.addEventListener('popstate', handlePortalHashChange);

    handlePortalHashChange();

    return () => {
      window.removeEventListener('hashchange', handlePortalHashChange);
      window.removeEventListener('popstate', handlePortalHashChange);
    };
  }, [allRawProperties, properties]);

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

  // ── Dynamic Hero Slideshow State (7 High-Res Serial Images from Drive) ──
  const HERO_SLIDES = [
    { img: '/hero-slider/hero_01.png', caption: '24K Realtors — Pune\'s Trusted Luxury Property Consultants', loc: 'Hinjewadi Phase 1, Pune' },
    { img: '/hero-slider/hero_02.png', caption: 'Premium 3 & 4 BHK High-Rise Residences & Skyline Living', loc: 'Hinjewadi Phase 1 & 2' },
    { img: '/hero-slider/hero_03.png', caption: 'Architectural Grandeur — Integrated Smart Townships', loc: 'Hinjewadi & Wakad Corridor' },
    { img: '/hero-slider/hero_04.png', caption: 'Curated Luxury Penthouses & Riverside Promenades', loc: 'Baner & Balewadi High Street' },
    { img: '/hero-slider/hero_05.png', caption: '400+ Acre Mega Townships with 80% Green Open Spaces', loc: 'Mahalunge Smart City' },
    { img: '/hero-slider/hero_06.png', caption: 'World-Class Club Amenities & Resort-Style Living', loc: 'Hinjewadi Phase 3 & PCMC' },
    { img: '/hero-slider/hero_07.png', caption: '15K+ Happy Families · 100% MahaRERA Verified Portfolio', loc: 'Served Across Pune' },
  ];
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroPrev, setHeroPrev] = useState(null);
  const [heroFading, setHeroFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      goToHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToHeroSlide = (indexOrFn) => {
    setHeroSlide(prev => {
      const next = typeof indexOrFn === 'function' ? indexOrFn(prev) : indexOrFn;
      if (next === prev) return prev;
      setHeroPrev(prev);
      setHeroFading(true);
      setTimeout(() => setHeroFading(false), 1100);
      return next;
    });
  };

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

  const [galleryFilter, setGalleryFilter] = useState('ALL');
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);

  const [customGalleryItems, setCustomGalleryItems] = useState(() => {
    try {
      const saved = localStorage.getItem('24k_custom_gallery');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  const [isGalleryUploadOpen, setIsGalleryUploadOpen] = useState(false);
  const [galleryUploadForm, setGalleryUploadForm] = useState({
    title: '',
    location: 'Hinjewadi Phase 1',
    category: 'TOWERS',
    dev: '24K Exclusive Mandate',
    img: '',
    desc: ''
  });

  const handleGalleryFileSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setGalleryUploadForm(prev => ({
        ...prev,
        img: uploadEvent.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddCustomGalleryImage = (e) => {
    e.preventDefault();
    if (!galleryUploadForm.img) {
      alert('Please upload an image file or enter an image URL.');
      return;
    }
    const newItem = {
      id: Date.now(),
      isCustom: true,
      title: galleryUploadForm.title || 'Custom Property Photo',
      location: galleryUploadForm.location || 'Hinjewadi Phase 1',
      category: galleryUploadForm.category || 'TOWERS',
      categoryLabel: galleryUploadForm.category === 'TOWERS' ? '🏙️ High-Rise' : galleryUploadForm.category === 'AMENITIES' ? '🏊 Amenities' : galleryUploadForm.category === 'INTERIORS' ? '🛋️ Interior' : '🌳 Greens',
      dev: galleryUploadForm.dev || '24K Custom Photo',
      img: galleryUploadForm.img,
      desc: galleryUploadForm.desc || 'Custom photo uploaded to 24K Realtors Gallery.'
    };
    const updated = [newItem, ...customGalleryItems];
    setCustomGalleryItems(updated);
    try {
      localStorage.setItem('24k_custom_gallery', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save custom gallery to localStorage:', err);
    }
    setIsGalleryUploadOpen(false);
    setGalleryUploadForm({ title: '', location: 'Hinjewadi Phase 1', category: 'TOWERS', dev: '24K Exclusive Mandate', img: '', desc: '' });
  };

  const handleDeleteCustomGalleryImage = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this uploaded photo from the gallery?')) {
      const updated = customGalleryItems.filter(item => item.id !== id);
      setCustomGalleryItems(updated);
      try {
        localStorage.setItem('24k_custom_gallery', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  const [isWideDesktop, setIsWideDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1400);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsWideDesktop(window.innerWidth >= 1400);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        const raw = data.content || [];
        const seen = new Set();
        const unique = [];
        for (const p of raw) {
          if (!p || !p.id) continue;
          const key = String(p.id);
          if (!seen.has(key)) {
            seen.add(key);
            unique.push(p);
          }
        }
        const sortOrder = (p) => {
          const t = (p?.title || '').toLowerCase();
          if (t.includes('godrej 24') || p?.id === 'prop-godrej-24') return 1;
          if (t.includes('elements') || p?.id === 'prop-godrej-elements') return 2;
          if (t.includes('megapolis') || p?.id === 'prop-megapolis-township') return 3;
          if (t.includes('yashone') || t.includes('javdekar') || p?.id === 'prop-vj-yashone') return 4;
          if (t.includes('sportsville') || t.includes('kohinoor') || p?.id === 'prop-kohinoor-sportsville') return 5;
          return 6;
        };
        unique.sort((a, b) => sortOrder(a) - sortOrder(b));
        setAllRawProperties(unique);
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
      
      if (activeCollection === 'GODREJ_24') {
        const filtered = allRawProperties.filter(p => (p.title || '').toLowerCase().includes('godrej 24'));
        setProperties(filtered);
        setTotalPages(1);
        setTotalElements(filtered.length);
        setLoading(false);
        return;
      }
      if (activeCollection === 'GODREJ_ELEMENTS') {
        const filtered = allRawProperties.filter(p => (p.title || '').toLowerCase().includes('elements'));
        setProperties(filtered);
        setTotalPages(1);
        setTotalElements(filtered.length);
        setLoading(false);
        return;
      }
      if (activeCollection === 'MEGAPOLIS') {
        const filtered = allRawProperties.filter(p => (p.title || '').toLowerCase().includes('megapolis'));
        setProperties(filtered);
        setTotalPages(1);
        setTotalElements(filtered.length);
        setLoading(false);
        return;
      }
      if (activeCollection === 'VJ_YASHONE') {
        const filtered = allRawProperties.filter(p => (p.title || '').toLowerCase().includes('yashone'));
        setProperties(filtered);
        setTotalPages(1);
        setTotalElements(filtered.length);
        setLoading(false);
        return;
      }
      if (activeCollection === '1_BHK') {
        queryFilters.bedrooms = '1';
      } else if (activeCollection === '2_BHK') {
        queryFilters.bedrooms = '2';
      } else if (activeCollection === '3_BHK') {
        queryFilters.bedrooms = '3';
      } else if (activeCollection === 'RENT') {
        queryFilters.transactionType = 'RENT';
      } else if (activeCollection === 'READY') {
        queryFilters.propertyType = 'RESIDENTIAL';
        queryFilters.transactionType = 'BUY';
      }

      const data = await apiService.getProperties(queryFilters, page, 12);
      const newItems = data.content || [];
      if (page === 0) {
        const seen = new Set();
        const unique = [];
        for (const p of newItems) {
          if (!p || !p.id) continue;
          const key = String(p.id);
          if (!seen.has(key)) {
            seen.add(key);
            unique.push(p);
          }
        }
        const sortOrder = (p) => {
          const t = (p?.title || '').toLowerCase();
          if (t.includes('godrej 24') || p?.id === 'prop-godrej-24') return 1;
          if (t.includes('elements') || p?.id === 'prop-godrej-elements') return 2;
          if (t.includes('megapolis') || p?.id === 'prop-megapolis-township') return 3;
          if (t.includes('yashone') || t.includes('javdekar') || p?.id === 'prop-vj-yashone') return 4;
          if (t.includes('sportsville') || t.includes('kohinoor') || p?.id === 'prop-kohinoor-sportsville') return 5;
          return 6;
        };
        unique.sort((a, b) => sortOrder(a) - sortOrder(b));
        setProperties(unique);
      } else {
        setProperties(prev => {
          const seen = new Set(prev.map(p => String(p.id)));
          const next = [...prev];
          for (const p of newItems) {
            if (!p || !p.id) continue;
            const key = String(p.id);
            if (!seen.has(key)) {
              seen.add(key);
              next.push(p);
            }
          }
          return next;
        });
      }
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.warn('Property fetch warning, loading verified catalog:', err);
      try {
        const fallbackData = await apiService.getProperties({ ...filters }, 0, 50);
        if (fallbackData?.content?.length) {
          const seen = new Set();
          const unique = [];
          for (const p of fallbackData.content) {
            if (!p || !p.id) continue;
            const key = String(p.id);
            if (!seen.has(key)) {
              seen.add(key);
              unique.push(p);
            }
          }
          setProperties(unique);
          setTotalPages(fallbackData.totalPages || 1);
          setTotalElements(fallbackData.totalElements || unique.length);
          setError(null);
        } else {
          setError(null);
        }
      } catch (innerErr) {
        console.error('Fallback load error:', innerErr);
        setError(null);
      }
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
                    <PropertyCard property={property} isHnwiMode={isHnwiMode} isCompared={selectedForCompare.some(p => p.id === property.id)} isWishlisted={wishlistIds.includes(property.id)} formatPrice={formatPrice} onToggleCompare={handleToggleCompare} onToggleWishlist={handleToggleWishlist} onOpenRera={handleOpenReraDrawer} onOpenBrochure={(prop) => setSelectedBrochureProperty(prop)} onOpenDetail={handleOpenPropertyDetail} />
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
    const parsed = { bedrooms: '', location: '', maxPrice: '', query: text, builder: '', reraOnly: false };
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

    // Micro-market & Hinjewadi Phase detection
    if (t.includes('phase 1') || t.includes('phase-1') || t.includes('ph 1')) {
      parsed.location = 'HINJEWADI_PHASE_1';
      chips.push({ label: '📍 Hinjewadi Phase 1', key: 'location' });
    } else if (t.includes('phase 2') || t.includes('phase-2') || t.includes('ph 2')) {
      parsed.location = 'HINJEWADI_PHASE_2';
      chips.push({ label: '📍 Hinjewadi Phase 2', key: 'location' });
    } else if (t.includes('phase 3') || t.includes('phase-3') || t.includes('ph 3') || t.includes('megapolis')) {
      parsed.location = 'HINJEWADI_PHASE_3';
      chips.push({ label: '📍 Hinjewadi Phase 3 (Megapolis)', key: 'location' });
    } else {
      const locations = ['hinjewadi', 'wakad', 'baner', 'balewadi', 'mahalunge', 'punawale', 'kharadi', 'tathawade'];
      for (const loc of locations) {
        if (t.includes(loc)) {
          parsed.location = loc.toUpperCase().replace(/\s+/g, '_');
          chips.push({ label: `📍 ${loc.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}`, key: 'location' });
          break;
        }
      }
    }

    // RERA Approved filter detection
    if (t.includes('rera') || t.includes('verified') || t.includes('approved')) {
      parsed.reraOnly = true;
      chips.push({ label: '🛡️ MahaRERA Approved', key: 'reraOnly' });
    }

    // Metro transit detection
    if (t.includes('metro') || t.includes('transit')) {
      chips.push({ label: '🚇 Near Metro Line 3', key: 'metro' });
    }

    // Builder detection
    const devList = [
      { key: 'lodha', name: 'Lodha' },
      { key: 'godrej', name: 'Godrej' },
      { key: 'vtp', name: 'VTP' },
      { key: 'joyville', name: 'Joyville' },
      { key: 'shapoorji', name: 'Shapoorji' },
      { key: 'kohinoor', name: 'Kohinoor' },
      { key: 'purple', name: 'Pride Purple' },
      { key: 'paranjape', name: 'Paranjape' },
      { key: 'kolte', name: 'Kolte Patil' },
      { key: 'gera', name: 'Gera' },
      { key: 'kasturi', name: 'Kasturi' },
      { key: 'mahindra', name: 'Mahindra' },
      { key: 'raheja', name: 'K. Raheja' }
    ];
    for (const d of devList) {
      if (t.includes(d.key)) {
        parsed.builder = d.name;
        chips.push({ label: `🏢 ${d.name}`, key: 'builder' });
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
      'hinjewadi phase 1': { label: '📍 Hinjewadi Phase 1 IT Park', filters: { location: 'HINJEWADI_PHASE_1' } },
      'hinjewadi phase 2': { label: '📍 Hinjewadi Phase 2 Quadron', filters: { location: 'HINJEWADI_PHASE_2' } },
      'hinjewadi phase 3': { label: '📍 Hinjewadi Phase 3 (Megapolis)', filters: { location: 'HINJEWADI_PHASE_3' } },
      'megapolis': { label: '🏔️ Megapolis Township Phase 3', filters: { location: 'HINJEWADI_PHASE_3' } },
      'hinjewadi': { label: '📍 Hinjewadi (All Phases 1, 2, 3)', filters: { location: 'HINJEWADI' } },
      'wakad': { label: '📍 Wakad Junction & Phoenix Mall', filters: { location: 'WAKAD' } },
      'baner': { label: '📍 Baner High Street Corridor', filters: { location: 'BANER' } },
      'balewadi': { label: '📍 Balewadi Stadium & High Street', filters: { location: 'BALEWADI' } },
      'tathawade': { label: '📍 Tathawade Expressway Link', filters: { location: 'TATHAWADE' } },
      'mahalunge': { label: '📍 Mahalunge Smart City (Godrej/VTP)', filters: { location: 'MAHALUNGE' } }
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
      'lodha': { label: '🏢 Lodha World-Class Towers', filters: { builder: 'Lodha' } },
      'godrej': { label: '🏢 Godrej Premium Properties', filters: { builder: 'Godrej' } },
      'vtp': { label: '🏢 VTP Realty High-Rise Townships', filters: { builder: 'VTP' } },
      'joyville': { label: '🏢 Shapoorji Pallonji Joyville', filters: { builder: 'Joyville' } },
      'kohinoor': { label: '🏢 Kohinoor Group Sada Sukhi', filters: { builder: 'Kohinoor' } },
      'paranjape': { label: '🏢 Paranjape Blue Ridge & Schemes', filters: { builder: 'Paranjape' } },
      'kolte': { label: '🏢 Kolte-Patil Life Republic & 24K', filters: { builder: 'Kolte' } },
      'gera': { label: '🏢 Gera Child-Centric Developments', filters: { builder: 'Gera' } },
      'kasturi': { label: '🏢 Kasturi Signature Residences', filters: { builder: 'Kasturi' } },
      'mahindra': { label: '🏢 Mahindra Lifespaces Green Homes', filters: { builder: 'Mahindra' } },
      'raheja': { label: '🏢 K. Raheja Corp Luxury Landmarks', filters: { builder: 'Raheja' } }
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
        transactionType: isCommercial ? '' : (heroTab === 'TOWNSHIPS' ? 'BUY' : heroTab),
        query: '',
        location: '',
        bedrooms: '',
        maxPrice: '',
        builder: '',
        reraOnly: false,
        propertyType: isCommercial ? 'COMMERCIAL' : (heroTab === 'TOWNSHIPS' ? 'TOWNSHIP' : ''),
        ...suggestion.filters
      };
    });
    setHeroSearchText('');
    setSmartChips([]);
    setSearchFocused(false);
    setExclusiveTab(heroTab);
    setActiveSection('listings');
    
    // Save to recent searches
    const cleanLabel = suggestion.label.replace(/^[📍🛏🏢💼🏔️]\s*/, '');
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
      const isTownships = heroTab === 'TOWNSHIPS';
      return {
        ...prev,
        transactionType: isCommercial ? 'BUY' : (isTownships ? 'BUY' : heroTab),
        location: searchLocation,
        propertyType: isCommercial ? 'COMMERCIAL' : (isTownships ? 'TOWNSHIP' : searchPropType),
        bedrooms: searchBHK,
        maxPrice: searchBudget,
        builder: searchBuilder,
        reraOnly: searchReraOnly,
        query: ''
      };
    });
    setExclusiveTab(heroTab === 'COMMERCIAL' ? 'BUY' : (heroTab === 'TOWNSHIPS' ? 'BUY' : heroTab));
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
      queryText.toLowerCase().includes(s.label.toLowerCase().replace(/^[📍🛏🏢💼🏔️]\s*/, ''))
    );

    setFilters(prev => {
      const isCommercial = heroTab === 'COMMERCIAL';
      const isTownships = heroTab === 'TOWNSHIPS';
      const baseFilters = {
        ...prev,
        transactionType: isCommercial ? '' : (isTownships ? 'BUY' : heroTab),
        query: '',
        location: '',
        bedrooms: '',
        maxPrice: '',
        builder: '',
        reraOnly: false,
        propertyType: isCommercial ? 'COMMERCIAL' : (isTownships ? 'TOWNSHIP' : '')
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
          ...(parsed.builder && { builder: parsed.builder }),
          ...(parsed.reraOnly && { reraOnly: true })
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
    setSelectedPropertyDetail(null);
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
    setSelectedPropertyDetail(null);
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
          <div className="subview-container" style={{ padding: isMobile ? '100px 16px 60px' : '130px 32px 80px', maxWidth: isWideDesktop ? '1680px' : '1380px', margin: '0 auto', minHeight: '85vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid rgba(212,175,55,0.25)', paddingBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '50px', padding: '4px 16px', marginBottom: '10px' }}>
                  <Sparkles size={13} color="#D4AF37" />
                  <span style={{ color: '#D4AF37', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>⚜️ ACTIVE BUYING PORTFOLIO</span>
                </div>
                <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.8rem' : '2.6rem', color: '#fff', margin: '0 0 6px 0', fontWeight: 700 }}>
                  Premium Properties <span style={{ color: '#D4AF37' }}>for Sale</span>
                </h1>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', fontFamily: "'Montserrat', sans-serif" }}>
                  Explore high-appreciation residential apartments, penthouses, and gated township villas in Hinjewadi, Wakad &amp; Baner.
                </p>
              </div>
              <button onClick={handleBackToHome} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', padding: '10px 22px', borderRadius: '50px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}>
                ← Back to Main Portfolio
              </button>
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
                  onOpenDetail={handleOpenPropertyDetail}
                />
              ))}
            </div>
          </div>
        );

      case 'properties-rent':
        return (
          <div className="subview-container" style={{ padding: isMobile ? '100px 16px 60px' : '130px 32px 80px', maxWidth: isWideDesktop ? '1680px' : '1380px', margin: '0 auto', minHeight: '85vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid rgba(212,175,55,0.25)', paddingBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '50px', padding: '4px 16px', marginBottom: '10px' }}>
                  <Home size={13} color="#D4AF37" />
                  <span style={{ color: '#D4AF37', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>🏢 PREMIUM RENTAL DESK</span>
                </div>
                <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.8rem' : '2.6rem', color: '#fff', margin: '0 0 6px 0', fontWeight: 700 }}>
                  Luxury Residences <span style={{ color: '#D4AF37' }}>for Rent</span>
                </h1>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', fontFamily: "'Montserrat', sans-serif" }}>
                  Fully furnished executive flats, IT corridor suites, and gated townhouses in Pune West.
                </p>
              </div>
              <button onClick={handleBackToHome} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', padding: '10px 22px', borderRadius: '50px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}>
                ← Back to Main Portfolio
              </button>
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
                  onOpenDetail={handleOpenPropertyDetail}
                />
              ))}
            </div>
          </div>
        );

      case 'verified-flats':
        return (
          <div className="subview-container" style={{ padding: isMobile ? '100px 16px 60px' : '130px 32px 80px', maxWidth: isWideDesktop ? '1680px' : '1380px', margin: '0 auto', minHeight: '85vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid rgba(212,175,55,0.25)', paddingBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(46,196,182,0.12)', border: '1px solid rgba(46,196,182,0.3)', borderRadius: '50px', padding: '4px 16px', marginBottom: '10px' }}>
                  <ShieldCheck size={13} color="#2ec4b6" />
                  <span style={{ color: '#2ec4b6', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>🛡️ 100% AUDITED TRUST SHIELD</span>
                </div>
                <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.8rem' : '2.6rem', color: '#fff', margin: '0 0 6px 0', fontWeight: 700 }}>
                  Verified <span style={{ color: '#D4AF37' }}>Premium Listings</span>
                </h1>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', fontFamily: "'Montserrat', sans-serif" }}>
                  Properties audited for physical carpet layout accuracy, title-clear registry status, and MahaRERA approvals.
                </p>
              </div>
              <button onClick={handleBackToHome} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', padding: '10px 22px', borderRadius: '50px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}>
                ← Back to Main Portfolio
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 350px', gap: '30px' }} className="verified-view-grid">
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
                    onOpenDetail={handleOpenPropertyDetail}
                  />
                ))}
              </div>

              <div className="verification-checklist-panel" style={{ background: 'radial-gradient(ellipse at top left, rgba(22, 36, 56, 0.85) 0%, rgba(9, 17, 31, 0.95) 100%)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '16px', padding: '28px', height: 'fit-content', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
                <h4 style={{ fontFamily: "var(--font-title)", color: "var(--gold-primary)", margin: '0 0 15px 0', fontSize: '1.15rem' }}>⚜️ 24K Verification Protocol</h4>
                <p style={{ fontSize: '0.84rem', color: "var(--text-muted)", lineHeight: 1.6, marginBottom: '20px' }}>Each property undergoes a strict 5-stage legal and spatial audit prior to public onboarding.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <ShieldCheck size={16} color="#2ec4b6" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: "var(--text-light)" }}>Title-Clear Registry Dossier</strong>
                      <p style={{ margin: '3px 0 0 0', fontSize: '0.78rem', color: "var(--text-muted)" }}>Verified land allocations and developer rights.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <ShieldCheck size={16} color="#2ec4b6" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: "var(--text-light)" }}>MahaRERA Status Mapping</strong>
                      <p style={{ margin: '3px 0 0 0', fontSize: '0.78rem', color: "var(--text-muted)" }}>Official registration and compliance verification.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <ShieldCheck size={16} color="#2ec4b6" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: "var(--text-light)" }}>Carpet Audit Compliance</strong>
                      <p style={{ margin: '3px 0 0 0', fontSize: '0.78rem', color: "var(--text-muted)" }}>Physical layout matches blueprint RERA carpet.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'maharera-directory':
        return (
          <div className="subview-container" style={{ padding: isMobile ? '100px 16px 60px' : '130px 32px 80px', maxWidth: isWideDesktop ? '1680px' : '1380px', margin: '0 auto', minHeight: '85vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid rgba(212,175,55,0.25)', paddingBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(46,196,182,0.12)', border: '1px solid rgba(46,196,182,0.3)', borderRadius: '50px', padding: '4px 16px', marginBottom: '10px' }}>
                  <ShieldCheck size={13} color="#2ec4b6" />
                  <span style={{ color: '#2ec4b6', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>🛡️ MAHARERA LEGAL COMPLIANCE DIRECTORY</span>
                </div>
                <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.8rem' : '2.6rem', color: '#fff', margin: '0 0 6px 0', fontWeight: 700 }}>
                  MahaRERA <span style={{ color: '#D4AF37' }}>Verified Projects</span>
                </h1>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', fontFamily: "'Montserrat', sans-serif" }}>
                  Verified MahaRERA registration certificates, title-clear dossiers, and authorized broker license disclosures.
                </p>
              </div>
              <button onClick={handleBackToHome} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', padding: '10px 22px', borderRadius: '50px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}>
                ← Back to Main Portfolio
              </button>
            </div>

            <div style={{ background: 'radial-gradient(ellipse at top left, rgba(22, 36, 56, 0.9) 0%, rgba(9, 17, 31, 0.98) 100%)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '16px', padding: '16px 24px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🛡️</div>
                <div>
                  <h4 style={{ fontFamily: "'Montserrat', sans-serif", color: '#D4AF37', margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>MahaRERA Registered Portfolio</h4>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>RERA Number: <strong style={{ color: '#F5D77F' }}>A051262603190</strong></div>
                </div>
              </div>
              <a href="https://maharera.maharashtra.gov.in" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(212,175,55,0.12)', border: '1px solid #D4AF37', color: '#F5D77F', padding: '7px 16px', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
                Verify on MahaRERA Portal ↗
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {societies.map(soc => (
                <div key={soc.id} style={{ background: 'rgba(22, 36, 56, 0.65)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '22px', transition: 'all 0.3s ease' }}>
                  <h4 style={{ color: '#fff', margin: '0 0 6px 0', fontFamily: "'Cinzel', serif", fontSize: '1.15rem', fontWeight: 700 }}>{soc.name}</h4>
                  <span style={{ fontSize: '0.74rem', color: '#D4AF37', fontWeight: 800, background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '50px', padding: '3px 10px', display: 'inline-block' }}>{soc.reraNumber}</span>
                  <div style={{ margin: '16px 0 0 0', fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <p style={{ margin: 0 }}><strong>Developer:</strong> {soc.developer || 'MahaRERA Developer'}</p>
                    <p style={{ margin: 0 }}><strong>Location:</strong> {soc.location || 'Pune West'}</p>
                    <p style={{ margin: 0 }}><strong>Status:</strong> <span style={{ color: '#22c55e', fontWeight: 700 }}>{(soc.projectStatus || 'AVAILABLE').replace('_', ' ')}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'exclusive-deals':
        return (
          <div className="subview-container" style={{ padding: isMobile ? '100px 16px 60px' : '130px 32px 80px', maxWidth: isWideDesktop ? '1680px' : '1380px', margin: '0 auto', minHeight: '85vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid rgba(212,175,55,0.25)', paddingBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span className="hero-gold-badge" style={{ marginBottom: '10px', background: 'rgba(212,175,55,0.15)', color: 'var(--gold-primary)' }}>⚜️ Private Client Desk</span>
                <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.8rem' : '2.6rem', color: '#fff', margin: 0, fontWeight: 700 }}>HNWI Mandates &amp; <span style={{ color: '#D4AF37' }}>Exclusive Deals</span></h2>
                <p style={{ margin: '6px 0 0 0', color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem' }}>Pre-release developer inventory, full-floor commercial assets, and high-yield properties.</p>
              </div>
              <button onClick={handleBackToHome} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', padding: '10px 22px', borderRadius: '50px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}>
                ← Back to Main Portfolio
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap: '30px' }} className="exclusive-view-grid">
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
                    onOpenBrochure={(prop) => setSelectedBrochureProperty(prop)}
                    onOpenDetail={handleOpenPropertyDetail}
                  />
                ))}
              </div>

              <div className="private-mandate-form-box" style={{ background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.95) 0%, rgba(7, 15, 30, 0.98) 100%)', border: '2px solid var(--gold-primary)', borderRadius: '16px', padding: '30px', height: 'fit-content', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
                <h4 style={{ fontFamily: 'var(--font-title)', color: 'var(--gold-primary)', margin: '0 0 10px 0', fontSize: '1.25rem' }}>Request Portfolio Access</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>Submit details to receive our locked PDF brochures, yield tables, and schedule a private Maybach chauffeur site tour.</p>
                <form onSubmit={(e) => { e.preventDefault(); setNotification('NDA request registered. A private client partner will reach out within 15 minutes.'); setTimeout(() => setNotification(null), 5000); }}>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px', fontWeight: 'bold' }}>FULL NAME</label>
                    <input type="text" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)', color: '#fff', outline: 'none' }} />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '5px', fontWeight: 'bold' }}>WHATSAPP NUMBER</label>
                    <input type="tel" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)', color: '#fff', outline: 'none' }} />
                  </div>
                  <button type="submit" className="btn-gold" style={{ width: '100%', padding: '14px', fontWeight: 800, border: 'none', cursor: 'pointer', borderRadius: '50px', background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)', color: '#040814' }}>Submit NDA Request</button>
                </form>
              </div>
            </div>
          </div>
        );

      case 'locality-guides':
        return (
          <div className="subview-container" style={{ padding: isMobile ? '100px 16px 60px' : '130px 32px 80px', maxWidth: isWideDesktop ? '1680px' : '1380px', margin: '0 auto', minHeight: '85vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', borderBottom: '1px solid rgba(212,175,55,0.25)', paddingBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '50px', padding: '4px 16px', marginBottom: '10px' }}>
                  <Compass size={13} color="#D4AF37" />
                  <span style={{ color: '#D4AF37', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>📍 PUNE WEST ADVISORY DESK</span>
                </div>
                <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.8rem' : '2.6rem', color: '#fff', margin: '0 0 6px 0', fontWeight: 700 }}>
                  Locality &amp; <span style={{ color: '#D4AF37' }}>Infrastructure Dossiers</span>
                </h1>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', fontFamily: "'Montserrat', sans-serif" }}>
                  Transit connectivity matrices, Metro Line 3 updates, and investment yield scores for Hinjewadi, Wakad &amp; Baner.
                </p>
              </div>
              <button onClick={handleBackToHome} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', padding: '10px 22px', borderRadius: '50px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}>
                ← Back to Main Portfolio
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
              {localities.map(loc => (
                <div key={loc.id} style={{ background: 'radial-gradient(ellipse at top left, rgba(22, 36, 56, 0.85) 0%, rgba(9, 17, 31, 0.95) 100%)', border: '1px solid rgba(212,175,55,0.22)', borderRadius: '20px', padding: '28px', boxShadow: '0 16px 40px rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)', transition: 'all 0.35s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <h3 style={{ color: '#fff', margin: 0, fontSize: '1.35rem', fontFamily: "'Cinzel', serif", fontWeight: 700 }}>{loc.name}</h3>
                    <span style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', borderRadius: '50px', padding: '3px 10px', fontSize: '0.65rem', fontWeight: 800 }}>RERA AUDITED</span>
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: '20px' }}>{loc.overview}</p>
                  
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>
                      <strong style={{ color: '#D4AF37' }}>Transit Connectivity:</strong> {loc.connectivityInfo}
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>
                      <strong style={{ color: '#60A5FA' }}>Metro Line 3 Progress:</strong> {loc.metroConnectivity}
                    </div>
                    <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.82rem', color: '#FFF' }}>
                      <strong style={{ color: '#D4AF37' }}>Investment CAGR:</strong> {loc.investmentAnalysis}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'developer-portfolios':
        return (
          <div className="subview-container" style={{ padding: isMobile ? '100px 16px 60px' : '130px 32px 80px', maxWidth: isWideDesktop ? '1680px' : '1380px', margin: '0 auto', minHeight: '85vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', borderBottom: '1px solid rgba(212,175,55,0.25)', paddingBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '50px', padding: '4px 16px', marginBottom: '10px' }}>
                  <Building size={13} color="#D4AF37" />
                  <span style={{ color: '#D4AF37', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>🏛️ CERTIFIED DEVELOPER DIRECTORY</span>
                </div>
                <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.8rem' : '2.6rem', color: '#fff', margin: '0 0 6px 0', fontWeight: 700 }}>
                  Authorized <span style={{ color: '#D4AF37' }}>Brand Partners</span>
                </h1>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', fontFamily: "'Montserrat', sans-serif" }}>
                  Official portfolios and active site registries of Pune West's leading Tier-1 builder groups.
                </p>
              </div>
              <button onClick={handleBackToHome} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37', padding: '10px 22px', borderRadius: '50px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}>
                ← Back to Main Portfolio
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
              {builders.map(builder => (
                <div key={builder.id} style={{ background: 'radial-gradient(ellipse at top left, rgba(22, 36, 56, 0.85) 0%, rgba(9, 17, 31, 0.95) 100%)', border: '1px solid rgba(212,175,55,0.22)', borderRadius: '20px', padding: '28px', boxShadow: '0 16px 40px rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)', transition: 'all 0.35s ease' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h3 style={{ color: '#fff', margin: 0, fontSize: '1.3rem', fontFamily: "'Cinzel', serif", fontWeight: 700 }}>{builder.name}</h3>
                    <span style={{ fontSize: '1.2rem' }}>🏛️</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#D4AF37', fontWeight: 800, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🏆 {builder.awards}</span>
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '18px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 6px', borderRadius: '10px' }}>
                      <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '2px' }}>Experience</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFF' }}>{builder.experienceYears} Yrs</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 6px', borderRadius: '10px' }}>
                      <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '2px' }}>Completed</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#D4AF37' }}>{builder.completedProjectsCount}+</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 6px', borderRadius: '10px' }}>
                      <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '2px' }}>Active Sites</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#60A5FA' }}>{builder.ongoingProjectsCount}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="subview-container" style={{ padding: isMobile ? '100px 16px 60px' : '130px 32px 80px', maxWidth: isWideDesktop ? '1680px' : '1380px', margin: '0 auto', minHeight: '90vh' }}>
            {/* Dedicated Subpage Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', borderBottom: '1px solid rgba(230,195,92,0.25)', paddingBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(230,195,92,0.1)', border: '1px solid rgba(230,195,92,0.3)', borderRadius: '50px', padding: '4px 16px', marginBottom: '10px' }}>
                  <Camera size={13} color="#E6C35C" />
                  <span style={{ color: '#E6C35C', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>📷 DEDICATED 24K LUXURY GALLERY SUBPAGE</span>
                </div>
                <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.8rem' : '2.6rem', color: '#fff', margin: '0 0 6px 0', fontWeight: 700 }}>
                  24K Luxury <span style={{ color: '#E6C35C' }}>Media &amp; Client Gallery</span>
                </h1>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', fontFamily: "'Montserrat', sans-serif" }}>
                  Real Pune Key Handover Celebrations, VIP Chauffeur Site Visit Tours &amp; High-Rise Townships in Wakad, Baner &amp; Hinjewadi.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                  className="btn-outline"
                  onClick={handleBackToHome}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    padding: '10px 20px',
                    borderRadius: '50px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ← Back to Home
                </button>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? '8px' : '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
              {[
                { id: 'ALL', label: '🔥 All Real Media (40)' },
                { id: 'LODHA', label: '🏰 Lodha: Construction to Delivery (10)' },
                { id: 'HINJEWADI', label: '🏙️ Hinjewadi Societies & Aerial Views' },
                { id: 'HANDOVER', label: '🔑 Client Key Handovers' },
                { id: 'VISITS', label: '🚗 VIP Site Visit Tours' },
                { id: 'TOWERS', label: '🏙️ Pune High-Rises' },
                { id: 'INTERIORS', label: '🛋️ Show Flats & Amenities' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setGalleryFilter(tab.id)}
                  style={{
                    background: galleryFilter === tab.id
                      ? 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)'
                      : 'rgba(255,255,255,0.03)',
                    border: galleryFilter === tab.id
                      ? 'none'
                      : '1px solid rgba(255,255,255,0.12)',
                    color: galleryFilter === tab.id ? '#040814' : 'rgba(255,255,255,0.75)',
                    padding: isMobile ? '8px 14px' : '10px 22px',
                    borderRadius: '50px',
                    fontSize: isMobile ? '0.72rem' : '0.82rem',
                    fontWeight: galleryFilter === tab.id ? 800 : 600,
                    cursor: 'pointer',
                    fontFamily: "'Montserrat', sans-serif",
                    transition: 'all 0.3s ease',
                    boxShadow: galleryFilter === tab.id ? '0 6px 20px rgba(230,195,92,0.35)' : 'none'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Media Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : isWideDesktop ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)',
              gap: isMobile ? '16px' : '24px'
            }}>
              {DEFAULT_GALLERY_ITEMS
                .filter(item => galleryFilter === 'ALL' || item.category === galleryFilter)
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedGalleryImage(item)}
                    style={{
                      position: 'relative',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      height: '300px',
                      cursor: 'pointer',
                      border: item.isCustom ? '1px solid rgba(230, 195, 92, 0.6)' : '1px solid rgba(230, 195, 92, 0.2)',
                      background: '#070f1e',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                      transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                      e.currentTarget.style.borderColor = '#E6C35C';
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.8), 0 0 25px rgba(230,195,92,0.25)';
                      const img = e.currentTarget.querySelector('img');
                      if (img) img.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.borderColor = item.isCustom ? 'rgba(230, 195, 92, 0.6)' : 'rgba(230, 195, 92, 0.2)';
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.5)';
                      const img = e.currentTarget.querySelector('img');
                      if (img) img.style.transform = 'scale(1)';
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(4,8,20,0.2) 0%, rgba(4,8,20,0.4) 40%, rgba(4,8,20,0.92) 100%)' }} />
                    <div style={{ position: 'absolute', top: '14px', left: '14px', right: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ background: 'rgba(7,15,30,0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(230,195,92,0.3)', borderRadius: '50px', padding: '3px 10px', fontSize: '0.62rem', fontWeight: 800, color: '#E6C35C' }}>
                          {item.categoryLabel}
                        </span>
                        {item.isCustom && (
                          <span style={{ background: 'rgba(229, 9, 20, 0.85)', color: '#fff', borderRadius: '50px', padding: '3px 8px', fontSize: '0.58rem', fontWeight: 800 }}>
                            🆕 UPLOADED
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {item.isCustom && (
                          <button
                            onClick={(e) => handleDeleteCustomGalleryImage(item.id, e)}
                            title="Delete custom upload"
                            style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(229,9,20,0.85)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(7,15,30,0.8)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Maximize2 size={14} color="#fff" />
                        </div>
                      </div>
                    </div>
                    {/* Bottom Gradient Content Overlay - Minimal & Ultra-Clean */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 18px', background: 'linear-gradient(to top, rgba(4,8,20,0.95) 0%, rgba(4,8,20,0.7) 60%, transparent 100%)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#E6C35C', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          📍 {item.location}
                        </div>
                        {item.rating && (
                          <div style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '50px', padding: '2px 8px', fontSize: '0.62rem', fontWeight: 800, color: '#FFF' }}>
                            ⭐ 5.0 Verified
                          </div>
                        )}
                      </div>
                      <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.04rem', fontWeight: 700, color: '#fff', margin: '0 0 4px 0', lineHeight: 1.3 }}>
                        {item.title}
                      </h4>
                      {item.reviewSnippet && (
                        <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)', fontStyle: 'italic', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.reviewSnippet}
                        </p>
                      )}
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
    setAiStep(4);
    
    let current = 0;
    const interval = setInterval(() => {
      current += 25;
      setAiProgress(Math.min(current, 100));
      if (current >= 100) {
        clearInterval(interval);
        setAiAnalyzing(false);
        
        let recommendedCorridor = 'WAKAD';
        let explanation = '';
        let appreciationIndex = '14.5%';
        let rentalYield = '4.7%';
        let connectivityScore = '9.4/10';
        let matchPercent = '96%';
        
        if (aiCorridor !== 'all' && aiCorridor) {
          recommendedCorridor = aiCorridor.toUpperCase();
        }

        if (recommendedCorridor === 'HINJEWADI' || aiPriority === 'yield') {
          recommendedCorridor = 'HINJEWADI';
          appreciationIndex = '14.8%';
          rentalYield = '5.4%';
          connectivityScore = '9.0/10';
          matchPercent = '98%';
          explanation = 'Hinjewadi IT Corridor is your top match! 300,000+ tech professionals drive high rental demand, delivering Pune West’s highest rental yields (5.4%) & steady 14.8% capital growth.';
        } else if (recommendedCorridor === 'BANER' || aiPriority === 'commute') {
          recommendedCorridor = 'BANER';
          appreciationIndex = '16.5%';
          rentalYield = '4.2%';
          connectivityScore = '9.8/10';
          matchPercent = '97%';
          explanation = 'Baner is your premium match! Ultra-luxury lifestyle near Balewadi High Street, top developer penthouses & fastest transit to Hinjewadi IT hubs & Expressway.';
        } else if (aiBudget === 'under-80L' || recommendedCorridor === 'MAHALUNGE') {
          recommendedCorridor = 'MAHALUNGE';
          appreciationIndex = '18.5%';
          rentalYield = '4.8%';
          connectivityScore = '8.5/10';
          matchPercent = '95%';
          explanation = 'Mahalunge Smart City is your top high-appreciation choice! Outstanding 18.5% YoY growth on entry budget with 100+ acre mega township infrastructure.';
        } else if (recommendedCorridor === 'TATHAWADE') {
          recommendedCorridor = 'TATHAWADE';
          appreciationIndex = '15.2%';
          rentalYield = '4.6%';
          connectivityScore = '8.8/10';
          matchPercent = '94%';
          explanation = 'Tathawade offers rapid appreciation next to education institutes & Expressway with modern high-rise gated communities.';
        } else {
          recommendedCorridor = 'WAKAD';
          appreciationIndex = '14.5%';
          rentalYield = '4.7%';
          connectivityScore = '9.4/10';
          matchPercent = '96%';
          explanation = 'Wakad Datta Mandir Rd is the most balanced investment corridor. 14.5% capital growth + 4.7% yield + instant highway & upcoming metro access.';
        }
        
        setAiReport({
          area: recommendedCorridor,
          appreciationIndex,
          rentalYield,
          connectivityScore,
          explanation,
          matchPercent
        });
      }
    }, 80);
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
    if (!price) return 'Price on Request';
    if (typeof price === 'string') {
      const crMatch = price.match(/0\.(\d+)\s*Cr/i);
      if (crMatch) {
        const numCr = parseFloat(`0.${crMatch[1]}`);
        const lakhs = Math.round(numCr * 100);
        return price.replace(/0\.\d+\s*Cr/i, `${lakhs} Lakhs`);
      }
      if (price.includes('₹') || price.includes('Cr') || price.includes('Lakh')) return price;
    }
    const cleanNum = Number(String(price).replace(/[^0-9.]/g, ''));
    if (isNaN(cleanNum) || cleanNum <= 0) return price;
    let formattedPrice = '';
    if (cleanNum >= 10000000) {
      formattedPrice = `₹${(cleanNum / 10000000).toFixed(2)} Cr`;
    } else if (cleanNum >= 100000) {
      formattedPrice = `₹${Math.round(cleanNum / 100000)} Lakhs`;
    } else {
      formattedPrice = `₹${cleanNum.toLocaleString('en-IN')}`;
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
    if (!url) return "https://drive.google.com/file/d/1d0bs-V09UXSMugFtcKOEpNo9_Wh-5G3N/preview";
    if (url.includes("drive.google.com")) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
      return url;
    }
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
        <div className="main-portal-listings-section" style={{ maxWidth: isMobile ? '100%' : '1410px', width: '100%', margin: '0 auto', padding: isMobile ? '0' : '0 20px', paddingTop: isMobile ? '0' : '20px', boxSizing: 'border-box' }}>
          <PropertyDetailView 
            property={selectedPropertyDetail} 
            onBack={handleClosePropertyDetail}
            onOpenInquiry={handleOpenInquiry}
            onOpenChauffeur={handleOpenInquiry}
            onOpenBrochure={(prop) => setSelectedBrochureProperty(prop || selectedPropertyDetail)}
            formatPrice={formatPrice}
            getEmbedVideoUrl={getEmbedVideoUrl}
            allProperties={allRawProperties}
          />
        </div>
      ) : activeSubView ? renderSubView() : (
        <>
          {/* ─── CINEMATIC HERO — 7 High-Res Slideshow from Drive ─── */}
          <section className="portal-hero" style={{
            position: 'relative',
            minHeight: isMobile ? '86vh' : '92vh',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            background: '#040814',
          }}>
            {/* ── Slide Images Stack ── */}
            {HERO_SLIDES.map((slide, i) => (
              <div
                key={slide.img}
                aria-hidden={i !== heroSlide}
                style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url('${slide.img}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: isMobile ? 'center 30%' : 'center 35%',
                  backgroundRepeat: 'no-repeat',
                  transition: 'opacity 0.9s ease-in-out',
                  opacity: i === heroSlide ? 1 : 0,
                  willChange: 'opacity',
                }}
              />
            ))}

            {/* Cinematic vignette — left dark gradient so text floats legibly on image without a card */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(105deg, rgba(4,8,20,0.88) 0%, rgba(4,8,20,0.72) 30%, rgba(4,8,20,0.35) 58%, rgba(4,8,20,0.0) 100%)',
              zIndex: 1
            }} />

            {/* ── Prev / Next Arrows (desktop only) ── */}
            {!isMobile && (
              <>
                <button
                  onClick={() => goToHeroSlide((heroSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                  aria-label="Previous slide"
                  style={{
                    position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)',
                    zIndex: 5, background: 'rgba(4,8,20,0.6)', backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(212,175,55,0.35)', borderRadius: '50%',
                    width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#D4AF37', fontSize: '1.2rem', transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.2)'; e.currentTarget.style.borderColor = '#D4AF37'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(4,8,20,0.6)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'; }}
                >‹</button>
                <button
                  onClick={() => goToHeroSlide((heroSlide + 1) % HERO_SLIDES.length)}
                  aria-label="Next slide"
                  style={{
                    position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
                    zIndex: 5, background: 'rgba(4,8,20,0.6)', backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(212,175,55,0.35)', borderRadius: '50%',
                    width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#D4AF37', fontSize: '1.2rem', transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.2)'; e.currentTarget.style.borderColor = '#D4AF37'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(4,8,20,0.6)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.35)'; }}
                >›</button>
              </>
            )}

            {/* Main hero content row */}
            <div style={{
              position: 'relative', zIndex: 2,
              width: '100%',
              maxWidth: '1380px',
              margin: '0 auto',
              padding: isMobile ? '80px 16px 36px' : '100px 32px 48px',
            }}>

              {/* ── LEFT: Text + CTAs + Trust Badges — Transparent Floating Style ── */}
              <div style={{
                maxWidth: isMobile ? '100%' : '1120px',
                background: 'transparent',
                padding: isMobile ? '0 4px' : '0',
                position: 'relative',
              }}>



                {/* Main Headline */}
                <h1 style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: isMobile ? 'clamp(2rem, 7vw, 2.6rem)' : 'clamp(2.6rem, 4vw, 4rem)',
                  color: '#fff',
                  lineHeight: 1.12,
                  margin: '0 0 6px 0',
                  fontWeight: 800,
                  letterSpacing: '-0.01em',
                  textShadow: '0 2px 8px rgba(0,0,0,1), 0 8px 40px rgba(0,0,0,0.95), 0 0 2px rgba(0,0,0,1)',
                }}>
                  Your Dream Homes
                </h1>
                <h1 style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: isMobile ? 'clamp(2rem, 7vw, 2.6rem)' : 'clamp(2.6rem, 4vw, 4rem)',
                  margin: '0 0 18px 0',
                  fontWeight: 800,
                  lineHeight: 1.12,
                  letterSpacing: '-0.01em',
                  background: 'linear-gradient(135deg, #FFF8E0 0%, #F5D77F 35%, #E6C35C 60%, #C5A032 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.9)) drop-shadow(0 6px 24px rgba(0,0,0,0.8))',
                }}>
                  Awaits in Pune.
                </h1>

                {/* Subtitle */}
                <p style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: isMobile ? '0.84rem' : '0.94rem',
                  color: 'rgba(255,255,255,0.92)',
                  lineHeight: 1.65,
                  marginBottom: isMobile ? '18px' : '22px',
                  maxWidth: '680px',
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                  textShadow: '0 2px 8px rgba(0,0,0,0.95), 0 4px 20px rgba(0,0,0,0.8)',
                }}>
                  1, 2, 3 &amp; 4 BHK Premium Homes in <strong style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 600 }}>Hinjewadi Phase 1, 2, 3</strong> &amp; Balewadi, Wakad, Baner, Mahalunge, Smart City &amp; PCMC – Curated for you.
                </p>

                {/* ══════════════════════════════════════════════════════════════════
                    ✦ NAUKRI & 99ACRES STYLE HERO SEARCH DOCK WITH AI INTEGRATION
                   ══════════════════════════════════════════════════════════════════ */}
                <div style={{
                  marginBottom: isMobile ? '20px' : '28px',
                  background: 'rgba(7, 15, 30, 0.90)',
                  border: '1.5px solid rgba(212, 175, 55, 0.45)',
                  borderRadius: '20px',
                  padding: isMobile ? '16px' : '20px 24px',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.7), 0 0 30px rgba(212,175,55,0.18)',
                  maxWidth: '1080px',
                  position: 'relative',
                  zIndex: 10
                }}>
                  {/* Row 1: Mode Tabs + AI Search Toggle */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '16px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    paddingBottom: '12px'
                  }}>
                    {/* Property Type Tabs */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {[
                        { id: 'BUY', label: 'Buy' },
                        { id: 'RENT', label: 'Rent' },
                        { id: 'COMMERCIAL', label: 'Commercial' },
                        { id: 'TOWNSHIPS', label: 'Townships' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setHeroTab(tab.id)}
                          style={{
                            background: heroTab === tab.id ? 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 100%)' : 'rgba(255,255,255,0.05)',
                            border: heroTab === tab.id ? 'none' : '1px solid rgba(255,255,255,0.12)',
                            color: heroTab === tab.id ? '#040814' : '#E2E8F0',
                            fontWeight: heroTab === tab.id ? 800 : 600,
                            fontSize: isMobile ? '0.74rem' : '0.82rem',
                            padding: '7px 16px',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            transition: 'all 0.25s ease'
                          }}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Dual Mode Switch: AI Natural Search Toggle */}
                    <button
                      type="button"
                      onClick={() => setIsAiSearchActive(!isAiSearchActive)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: isAiSearchActive ? 'linear-gradient(135deg, #9333ea 0%, #d946ef 100%)' : 'rgba(147, 51, 234, 0.15)',
                        border: '1px solid #d946ef',
                        color: '#fff',
                        fontSize: isMobile ? '0.72rem' : '0.78rem',
                        fontWeight: 700,
                        padding: '6px 14px',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        boxShadow: isAiSearchActive ? '0 0 15px rgba(217, 70, 239, 0.5)' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Sparkles size={14} />
                      <span>{isAiSearchActive ? 'Switch to Standard Filters' : '✨ AI Natural Search'}</span>
                    </button>
                  </div>

                  {/* Row 2: Standard Filter Controls vs AI Prompt Input */}
                  {!isAiSearchActive ? (
                    <form onSubmit={handleLuxurySearch}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(170px, 1fr)) 160px',
                        gap: '12px',
                        alignItems: 'center'
                      }}>
                        {/* 1. Location / Phase Dropdown */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.65rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Location / Phase
                          </label>
                          <select
                            value={searchLocation}
                            onChange={e => setSearchLocation(e.target.value)}
                            style={{
                              background: 'rgba(15, 23, 42, 0.95)',
                              border: '1px solid rgba(212, 175, 55, 0.35)',
                              color: '#fff',
                              padding: '10px 12px',
                              borderRadius: '10px',
                              fontSize: '0.82rem',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="">All Pune West</option>
                            <optgroup label="Hinjewadi IT Corridor (Pune Metro Line 3)">
                              <option value="HINJEWADI_PHASE_1">📍 Hinjewadi Phase 1 (Wipro/Blue Ridge)</option>
                              <option value="HINJEWADI_PHASE_2">📍 Hinjewadi Phase 2 (Embassy Techzone)</option>
                              <option value="HINJEWADI_PHASE_3">📍 Hinjewadi Phase 3 (Megapolis Township)</option>
                            </optgroup>
                            <optgroup label="Prime West Pune Micro-Markets">
                              <option value="MAHALUNGE">📍 Mahalunge Smart City</option>
                              <option value="WAKAD">📍 Wakad (Phoenix Mall)</option>
                              <option value="BANER">📍 Baner High Street</option>
                              <option value="BALEWADI">📍 Balewadi Stadium</option>
                              <option value="TATHAWADE">📍 Tathawade Expressway</option>
                              <option value="KHARADI">📍 Kharadi IT Hub</option>
                            </optgroup>
                          </select>
                        </div>

                        {/* 2. BHK Dropdown */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.65rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Bedrooms (BHK)
                          </label>
                          <select
                            value={searchBHK}
                            onChange={e => setSearchBHK(e.target.value)}
                            style={{
                              background: 'rgba(15, 23, 42, 0.95)',
                              border: '1px solid rgba(212, 175, 55, 0.35)',
                              color: '#fff',
                              padding: '10px 12px',
                              borderRadius: '10px',
                              fontSize: '0.82rem',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="">Any BHK</option>
                            <option value="1">1 BHK</option>
                            <option value="2">2 BHK</option>
                            <option value="3">3 BHK</option>
                            <option value="4">4+ BHK</option>
                          </select>
                        </div>

                        {/* 3. Budget Dropdown */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.65rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Max Budget
                          </label>
                          <select
                            value={searchBudget}
                            onChange={e => setSearchBudget(e.target.value)}
                            style={{
                              background: 'rgba(15, 23, 42, 0.95)',
                              border: '1px solid rgba(212, 175, 55, 0.35)',
                              color: '#fff',
                              padding: '10px 12px',
                              borderRadius: '10px',
                              fontSize: '0.82rem',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="">Any Budget</option>
                            <option value="5000000">Under ₹50 Lakhs</option>
                            <option value="10000000">Under ₹1.0 Crore</option>
                            <option value="15000000">Under ₹1.5 Crore</option>
                            <option value="25000000">Under ₹2.5 Crore</option>
                            <option value="50000000">Under ₹5.0 Crore</option>
                          </select>
                        </div>

                        {/* 4. Top Developers Dropdown */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.65rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Top Developer
                          </label>
                          <select
                            value={searchBuilder}
                            onChange={e => setSearchBuilder(e.target.value)}
                            style={{
                              background: 'rgba(15, 23, 42, 0.95)',
                              border: '1px solid rgba(212, 175, 55, 0.35)',
                              color: '#fff',
                              padding: '10px 12px',
                              borderRadius: '10px',
                              fontSize: '0.82rem',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="">All Top Developers</option>
                            {builders && builders.length > 0 ? (
                              builders.map(b => (
                                <option key={b.id || b.slug} value={b.name}>{b.name}</option>
                              ))
                            ) : (
                              <>
                                <option value="Kolte Patil Developers">Kolte Patil Developers</option>
                                <option value="Shapoorji Pallonji Real Estate">Shapoorji Pallonji</option>
                                <option value="Godrej Properties">Godrej Properties</option>
                                <option value="Paranjape Schemes">Paranjape Schemes</option>
                                <option value="Vilas Javdekar Developers (VJ)">Vilas Javdekar (VJ)</option>
                                <option value="VTP Realty">VTP Realty</option>
                                <option value="Kohinoor Group">Kohinoor Group</option>
                                <option value="Rohan Builders">Rohan Builders</option>
                              </>
                            )}
                          </select>
                        </div>

                        {/* 5. Submit Button */}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                          <button
                            type="submit"
                            style={{
                              background: 'linear-gradient(135deg, #C59B27 0%, #F0D060 45%, #B8860B 100%)',
                              border: 'none',
                              color: '#040814',
                              fontWeight: 800,
                              fontFamily: "'Montserrat', sans-serif",
                              fontSize: '0.85rem',
                              padding: '11px 18px',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              boxShadow: '0 4px 20px rgba(212,175,55,0.4)',
                              transition: 'all 0.25s ease'
                            }}
                          >
                            <Search size={16} strokeWidth={2.5} />
                            <span>SEARCH</span>
                          </button>
                        </div>
                      </div>

                      {/* MahaRERA Checkbox + Fast Links */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', flexWrap: 'wrap', gap: '10px' }}>
                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.78rem', color: '#FFF' }}>
                          <input
                            type="checkbox"
                            checked={searchReraOnly}
                            onChange={e => setSearchReraOnly(e.target.checked)}
                            style={{ accentColor: '#D4AF37', cursor: 'pointer' }}
                          />
                          <span style={{ color: '#F5D77F', fontWeight: 700 }}>🛡️ MahaRERA Approved Properties Only</span>
                        </label>
                      </div>
                    </form>
                  ) : (
                    /* AI Natural Language Search Mode */
                    <div>
                      <form
                        onSubmit={e => {
                          e.preventDefault();
                          handleHeroSearch(e);
                        }}
                        style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}
                      >
                        <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
                          <input
                            type="text"
                            value={heroSearchText}
                            onChange={e => handleSmartInputChange(e.target.value)}
                            placeholder="Type naturally e.g. '3 BHK in Hinjewadi Phase 1 under 1.2 Cr near Metro'..."
                            style={{
                              width: '100%',
                              background: 'rgba(15, 23, 42, 0.95)',
                              border: '1.5px solid #d946ef',
                              color: '#fff',
                              padding: '12px 16px',
                              borderRadius: '12px',
                              fontSize: '0.88rem',
                              outline: 'none',
                              boxShadow: '0 0 15px rgba(217, 70, 239, 0.2)'
                            }}
                          />
                        </div>
                        <button
                          type="submit"
                          style={{
                            background: 'linear-gradient(135deg, #9333ea 0%, #d946ef 100%)',
                            border: 'none',
                            color: '#fff',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 20px rgba(217, 70, 239, 0.4)'
                          }}
                        >
                          <Sparkles size={16} />
                          <span>AI SEARCH</span>
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Row 3: 99acres-Style Instant Filter Chips */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap',
                    marginTop: '14px',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(255,255,255,0.06)'
                  }}>
                    <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase' }}>
                      POPULAR:
                    </span>
                    {[
                      { label: '🛡️ MahaRERA Approved', onClick: () => { setSearchReraOnly(true); handleHeroSearch(null, 'RERA Approved'); } },
                      { label: '🏢 Hinjewadi Phase 1', onClick: () => { setSearchLocation('HINJEWADI_PHASE_1'); handleHeroSearch(null, 'Hinjewadi Phase 1'); } },
                      { label: '🌿 Hinjewadi Phase 2', onClick: () => { setSearchLocation('HINJEWADI_PHASE_2'); handleHeroSearch(null, 'Hinjewadi Phase 2'); } },
                      { label: '🏔️ Megapolis Phase 3', onClick: () => { setSearchLocation('HINJEWADI_PHASE_3'); handleHeroSearch(null, 'Megapolis Phase 3'); } },
                      { label: '🌊 Mahalunge Smart City', onClick: () => { setSearchLocation('MAHALUNGE'); handleHeroSearch(null, 'Mahalunge'); } },
                      { label: '🛍️ Wakad Junction', onClick: () => { setSearchLocation('WAKAD'); handleHeroSearch(null, 'Wakad'); } },
                      { label: '💎 3 BHK Under 1.5 Cr', onClick: () => { setSearchBHK('3'); setSearchBudget('15000000'); handleHeroSearch(null, '3 BHK under 1.5 Cr'); } },
                      { label: '🚇 Near Metro Line 3', onClick: () => { handleHeroSearch(null, 'Near Metro Line 3'); } }
                    ].map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={chip.onClick}
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(212,175,55,0.3)',
                          color: '#E2E8F0',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          padding: '4px 10px',
                          borderRadius: '20px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.2)'; e.currentTarget.style.borderColor = '#D4AF37'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; }}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', gap: isMobile ? '10px' : '14px', flexWrap: 'wrap', marginBottom: isMobile ? '20px' : '26px' }}>
                  <button
                    id="hero-explore-btn"
                    onClick={() => {
                      const el = document.getElementById('listings-anchor');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #C59B27 0%, #F0D060 45%, #B8860B 100%)',
                      border: '1px solid rgba(255,220,80,0.4)',
                      color: '#05091A',
                      padding: isMobile ? '11px 20px' : '13px 26px',
                      borderRadius: '50px',
                      fontWeight: 900,
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: isMobile ? '0.78rem' : '0.82rem',
                      letterSpacing: '0.08em',
                      cursor: 'pointer',
                      boxShadow: '0 6px 28px rgba(212,175,55,0.45), 0 2px 8px rgba(0,0,0,0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                      display: 'inline-flex', alignItems: 'center', gap: '10px',
                      textTransform: 'uppercase',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 14px 40px rgba(212,175,55,0.6), 0 4px 12px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 6px 28px rgba(212,175,55,0.45), 0 2px 8px rgba(0,0,0,0.3)';
                    }}
                  >
                    <span>EXPLORE PROJECTS</span>
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </button>

                  <button
                    id="hero-experts-btn"
                    onClick={handleOpenInquiry}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1.5px solid rgba(212,175,55,0.55)',
                      color: '#FFF4D0',
                      padding: isMobile ? '11px 20px' : '13px 24px',
                      borderRadius: '50px',
                      fontWeight: 700,
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: isMobile ? '0.78rem' : '0.82rem',
                      letterSpacing: '0.06em',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                      display: 'inline-flex', alignItems: 'center', gap: '10px',
                      textTransform: 'uppercase',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(212,175,55,0.15)';
                      e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                      e.currentTarget.style.borderColor = 'rgba(212,175,55,0.9)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(212,175,55,0.2)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.borderColor = 'rgba(212,175,55,0.55)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
                    }}
                  >
                    <Phone size={15} style={{ color: '#E6C35C' }} />
                    <span>TALK TO OUR EXPERTS</span>
                  </button>
                </div>

                {/* ── TRUST BADGES — Individual Glass Pills ── */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}>
                  {[
                    { icon: '✓', title: 'Verified Properties', sub: 'RERA Approved', iconBg: 'rgba(46,160,90,0.25)', iconColor: '#5DDB8A' },
                    { icon: '◎', title: 'Expert Guidance', sub: 'End-to-End Support', iconBg: 'rgba(99,149,255,0.25)', iconColor: '#7BA7FF' },
                    { icon: '◈', title: 'Best Price', sub: 'No Hidden Charges', iconBg: 'rgba(212,175,55,0.25)', iconColor: '#F5D77F' },
                    { icon: '⊕', title: 'Site Visits', sub: 'Hassle Free', iconBg: 'rgba(255,120,80,0.25)', iconColor: '#FF8C6B' },
                  ].map((badge, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      padding: '8px 14px 8px 10px',
                      background: 'rgba(4,8,20,0.72)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '50px',
                    }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: badge.iconBg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.85rem',
                        color: badge.iconColor,
                        fontWeight: 900,
                        flexShrink: 0,
                      }}>{badge.icon}</div>
                      <div>
                        <div style={{
                          fontSize: isMobile ? '0.7rem' : '0.68rem',
                          fontWeight: 700,
                          color: '#fff',
                          fontFamily: "'Montserrat', sans-serif",
                          letterSpacing: '0.01em',
                          lineHeight: 1.2,
                          whiteSpace: 'nowrap',
                        }}>{badge.title}</div>
                        <div style={{
                          fontSize: '0.56rem',
                          fontWeight: 500,
                          color: 'rgba(255,255,255,0.5)',
                          fontFamily: "'Montserrat', sans-serif",
                          marginTop: '1px',
                          whiteSpace: 'nowrap',
                        }}>{badge.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Subtle Minimal Dots Slider */}
            <div style={{
              position: 'absolute', bottom: '18px', right: isMobile ? 'auto' : '36px', left: isMobile ? '50%' : 'auto',
              transform: isMobile ? 'translateX(-50%)' : 'none',
              zIndex: 4, display: 'flex', gap: '6px', alignItems: 'center'
            }}>
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToHeroSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                  style={{
                    width: i === heroSlide ? '20px' : '6px',
                    height: '6px',
                    borderRadius: '50px',
                    background: i === heroSlide ? '#D4AF37' : 'rgba(255,255,255,0.3)',
                    border: 'none', cursor: 'pointer', padding: 0,
                    transition: 'all 0.35s ease',
                    boxShadow: i === heroSlide ? '0 0 8px rgba(212,175,55,0.6)' : 'none',
                  }}
                />
              ))}
            </div>

          </section>

      {/* ══════════════════════════════════════════════════════════════════════
          ✦ ANIMATED TRUST COUNTER STRIP — Social Proof at a Glance
      ══════════════════════════════════════════════════════════════════════ */}
      {!selectedPropertyDetail && !activeSubView && (
        <div style={{
          background: 'linear-gradient(90deg, #040814 0%, #070f1e 50%, #040814 100%)',
          borderTop: '1px solid rgba(212,175,55,0.18)',
          borderBottom: '1px solid rgba(212,175,55,0.18)',
          padding: isMobile ? '18px 16px' : '22px 32px',
        }}>
          <div style={{
            maxWidth: isWideDesktop ? '1680px' : '1380px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(5, 1fr)',
            gap: '0',
            alignItems: 'center',
          }}>
            {[
              { value: '800+', label: 'Verified Listings', icon: '🏢', color: '#E6C35C' },
              { value: '15K+', label: 'Happy Families', icon: '👨‍👩‍👧', color: '#25D366' },
              { value: '₹2,400 Cr+', label: 'Portfolio Value', icon: '📈', color: '#60A5FA' },
              { value: '100%', label: 'MahaRERA Verified', icon: '🛡️', color: '#2EC4B6' },
              { value: '4.9 ★', label: 'Client Rating', icon: '⭐', color: '#F59E0B' },
            ].map((stat, i) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: isMobile ? '12px 8px' : '10px 16px',
                borderRight: i < 4 && !isMobile ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}>
                <div style={{ fontSize: isMobile ? '1.4rem' : '1.6rem', marginBottom: '4px' }}>{stat.icon}</div>
                <div style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: isMobile ? '1.15rem' : '1.5rem',
                  fontWeight: 800,
                  color: stat.color,
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  textShadow: `0 0 20px ${stat.color}40`,
                }}>{stat.value}</div>
                <div style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: isMobile ? '0.6rem' : '0.66rem',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.5)',
                  marginTop: '3px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          ✦ TRUSTED BRANDS & PARTNERS - MOVING ORIGINAL DEVELOPER LOGOS
          Infinite authentic vector logo ribbon · Zero image dependency
      ══════════════════════════════════════════════════════════════════════ */}
      {!selectedPropertyDetail && !activeSubView && (
        <DeveloperLogoMarquee
          isMobile={isMobile}
          onSelectDeveloper={(builderQuery) => {
            handleApplyMegaFilter({ query: builderQuery }, 'listings');
          }}
        />
      )}





      {/* Main Listings and Directories Container with Luxury Ambient Background */}
      <div className="subpage-ambient-bg">
        <div className="main-portal-listings-section" style={{ maxWidth: isWideDesktop ? '1680px' : '1410px', margin: '0 auto', padding: isMobile ? '0 16px' : '0 24px' }}>
            
            {activeSection === 'listings' && (
              <>


                {/* Listings Anchor Target */}
                <div id="listings-anchor" style={{ scrollMarginTop: '80px' }} />

              {/* Premium Luxury Listings Count Header — Streamlined & Prestigious */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
                margin: '12px 0 28px',
                padding: '4px 0'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'linear-gradient(135deg, rgba(16, 26, 46, 0.88) 0%, rgba(7, 15, 30, 0.96) 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  borderRadius: '50px',
                  padding: '9px 24px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(12px)',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.28), rgba(197, 168, 128, 0.12))',
                    border: '1px solid rgba(212, 175, 55, 0.45)',
                    fontSize: '0.95rem'
                  }}>
                    🏢
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontFamily: "'Cinzel', serif",
                      color: '#F4D068',
                      fontSize: 'clamp(0.85rem, 2.5vw, 0.98rem)',
                      fontWeight: 700,
                      letterSpacing: '0.04em'
                    }}>
                      {totalElements > 0 ? totalElements : properties.length} Listings
                    </span>
                    <span style={{ color: 'rgba(212, 175, 55, 0.45)', fontSize: '0.9rem' }}>•</span>
                    <span style={{
                      fontFamily: "'Montserrat', sans-serif",
                      color: 'rgba(255, 255, 255, 0.88)',
                      fontSize: 'clamp(0.75rem, 2vw, 0.84rem)',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase'
                    }}>
                      {filters.location || 'Pune West'}
                    </span>
                  </div>
                  <div style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 10px #10B981',
                    marginLeft: '4px'
                  }} title="Live Verified Registry" />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.72rem',
                    color: 'rgba(212, 175, 55, 0.85)',
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    background: 'rgba(212, 175, 55, 0.08)',
                    border: '1px solid rgba(212, 175, 55, 0.22)',
                    borderRadius: '30px',
                    padding: '6px 14px'
                  }}>
                    <span style={{ color: '#25D366' }}>●</span> 100% MahaRERA Verified Mandates
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="properties-grid" style={{ minHeight: '400px' }}>
                  {[1, 2, 3, 4, 5, 6].map(i => <PropertySkeleton key={i} />)}
                </div>
              ) : error ? (
                <div className="error-card">{error}</div>
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
                              onOpenDetail={handleOpenPropertyDetail}
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
                        onOpenDetail={handleOpenPropertyDetail}
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
                {/* Unified Section Header */}
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '50px', padding: '6px 18px', marginBottom: '14px' }}>
                    <span style={{ color: '#D4AF37', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Residential Index</span>
                  </div>
                  <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
                    Premium Societies &amp; <span style={{ color: '#D4AF37' }}>Townships</span>
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
                    Discover tier-1 residential developments, smart townships, and luxury high-rise communities across Pune West. Direct developer mandates and verified pricing.
                  </p>
                </div>

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
                {/* Unified Section Header */}
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '50px', padding: '6px 18px', marginBottom: '14px' }}>
                    <span style={{ color: '#D4AF37', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Developer Partners</span>
                  </div>
                  <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
                    Tier-1 <span style={{ color: '#D4AF37' }}>Authorized Developers</span>
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
                    Partnered developer profiles. We coordinate directly with core offices to negotiate institutional prices, priority allotments, and verified direct terms.
                  </p>
                </div>

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
                {/* Unified Section Header */}
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '50px', padding: '6px 18px', marginBottom: '14px' }}>
                    <span style={{ color: '#D4AF37', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Locality Intelligence</span>
                  </div>
                  <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
                    Pune West <span style={{ color: '#D4AF37' }}>Corridor Guides</span>
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
                    Connectivity indexes, civic infrastructure, upcoming Metro networks, and investment appreciation CAGRs — know before you buy or rent.
                  </p>
                </div>

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
                {/* Unified Section Header */}
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '50px', padding: '6px 18px', marginBottom: '14px' }}>
                    <span style={{ color: '#D4AF37', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Market Intelligence</span>
                  </div>
                  <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 700, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
                    Premium <span style={{ color: '#D4AF37' }}>Real Estate Insights</span>
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', maxWidth: '560px', margin: '0 auto', lineHeight: 1.6 }}>
                    Expert editorials, township insights, infrastructure analyses, and investment guides curated by the 24K Realtors advisory team.
                  </p>
                </div>

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
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setIsModalOpen(false)} style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.88)", zIndex: 1000, backdropFilter: "blur(16px)" }}>
          <div className="modal-content" style={{ maxWidth: "480px", width: "92%", borderRadius: "24px", border: "1px solid rgba(212,175,55,0.3)", background: "linear-gradient(135deg, #060d1c 0%, #0b1628 50%, #060d1c 100%)", boxShadow: "0 40px 100px rgba(0,0,0,0.85), 0 0 40px rgba(212,175,55,0.12)", padding: "36px 30px", position: "relative", animation: 'fadeIn 0.25s ease' }}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)} style={{ position: "absolute", top: "16px", right: "16px", fontSize: "1.4rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.7)", transition: "all 0.2s" }}>×</button>

            {/* Modal Header with urgency badges */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.1em", color: "#E6C35C", textTransform: "uppercase", background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)", padding: "3px 10px", borderRadius: "20px" }}>🏙️ Pune Luxury Desk</span>
                <span style={{ fontSize: "0.66rem", fontWeight: 700, color: '#25D366', background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.25)', padding: "3px 10px", borderRadius: "20px" }}>⚡ Response in &lt;15 min</span>
              </div>
              <h3 className="modal-title" style={{ fontSize: "1.4rem", marginBottom: "6px", color: "#fff", fontWeight: 700, fontFamily: "'Cinzel', serif", lineHeight: 1.2 }}>Schedule a Free
                <span style={{ color: '#E6C35C' }}> Expert Call</span>
              </h3>
              <p className="modal-subtitle" style={{ marginBottom: "0", fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                For <strong style={{ color: "#E6C35C" }}>{selectedProperty.title || "Premium Listing"}</strong> · Verified Pricing · Direct Developer
              </p>
            </div>

            {/* Trust Mini Bar */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '22px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '10px 14px', flexWrap: 'wrap' }}>
              {['🛡️ MahaRERA Verified', '💎 Verified Pricing', '📞 Direct Developer'].map((item, i) => (
                <span key={i} style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontFamily: "'Montserrat', sans-serif", display: 'flex', alignItems: 'center', gap: '3px' }}>
                  {i > 0 && <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>}
                  {item}
                </span>
              ))}
            </div>

            <form onSubmit={handleLeadSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(212,175,55,0.8)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "6px" }}>Full Name *</label>
                <input type="text" className="form-input" required placeholder="e.g. Rahul Sharma"
                  value={leadForm.name} onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                  style={{ borderRadius: "12px", width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "13px 15px", color: "#fff", fontSize: '0.88rem', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(212,175,55,0.8)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "6px" }}>📱 WhatsApp Number (+91) *</label>
                <input type="tel" className="form-input" required placeholder="98765 43210"
                  value={leadForm.phone} onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                  style={{ borderRadius: "12px", width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "13px 15px", color: "#fff", fontSize: '0.88rem', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(212,175,55,0.8)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "6px" }}>Email ID</label>
                <input type="email" className="form-input" placeholder="you@gmail.com (optional)"
                  value={leadForm.email} onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                  style={{ borderRadius: "12px", width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", padding: "13px 15px", color: "#fff", fontSize: '0.88rem', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>

              <button type="submit" className="btn-gold"
                style={{ width: "100%", justifyContent: "center", marginTop: "6px", borderRadius: "14px", padding: "15px", fontSize: "0.88rem", fontWeight: 800, fontFamily: "'Montserrat', sans-serif", letterSpacing: "0.06em", cursor: "pointer", background: "linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)", border: "none", color: "#040814", boxShadow: '0 6px 24px rgba(212,175,55,0.4)', transition: 'all 0.25s ease', display: 'flex', alignItems: 'center', gap: '8px' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(212,175,55,0.55)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(212,175,55,0.4)'; }}
                disabled={submitLoading}>
                {submitLoading ? <Loader className="animate-spin" size={20} /> : (<><Phone size={16} /><span>Get Expert Callback — Free</span></>)}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <p style={{ textAlign: "center", fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", margin: 0, lineHeight: "1.4" }}>
                  Zero spam · No cold calls · Shared only with certified 24K advisor
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🤖 Ultra-Luxury 24K AI Assistant Chatbot */}
      {/* Sticky Floating WhatsApp */}
      {!selectedPropertyDetail && !selectedSocietyDetail && !selectedBuilderDetail && !selectedLocalityDetail && !selectedBlogDetail && (
        <a
          href="https://wa.me/919673000053?text=I%20am%20interested%20in%20real%20estate%20consultation"
          className="floating-whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          title="WhatsApp Consultation — 24K Realtors"
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
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

              {/* Parser Active Recommendation Chip */}
              {spotlightQuery.trim().length > 0 && (
                <div style={{ marginBottom: "18px" }}>
                  <span style={{ fontSize: "0.62rem", fontFamily: "'Montserrat', sans-serif", fontWeight: 800, color: "rgba(197,168,128,0.6)", letterSpacing: "0.08em", display: "block", marginBottom: "8px", textTransform: "uppercase" }}>⚡ SMART PROPERTY SEARCH INTENT</span>
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
                                handleOpenPropertyDetail(p);
                                setIsSpotlightOpen(false);
                                setSpotlightQuery("");
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
          style={{ position: 'fixed', inset: 0, background: 'rgba(4,8,20,0.85)', backdropFilter: 'blur(14px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
        >
          <div style={{ background: 'linear-gradient(135deg, #070f1e 0%, #0d1a30 100%)', border: '1px solid rgba(230,195,92,0.3)', borderRadius: '24px', padding: isMobile ? '24px 20px' : '36px 32px', maxWidth: '520px', width: '100%', position: 'relative', boxShadow: '0 24px 80px rgba(0,0,0,0.8)' }}>
            {/* Close */}
            <button onClick={() => { setIsAiModalOpen(false); setAiStep(1); }} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', width: '32px', height: '32px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>✕</button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(230,195,92,0.2) 0%, transparent 70%)', border: '1px solid rgba(230,195,92,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                <Sparkles size={24} color="#E6C35C" />
              </div>
              <h2 style={{ margin: '0 0 4px 0', fontFamily: "'Cinzel', serif", fontSize: '1.35rem', color: '#fff', fontWeight: 700 }}>24K Investment Advisory Engine</h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontFamily: "'Montserrat', sans-serif" }}>3 quick inputs · instant market intelligence recommendation</p>
            </div>

            {/* Step indicator */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
              {[1, 2, 3, 4].map(s => (
                <div key={s} style={{ width: s <= aiStep ? '28px' : '8px', height: '4px', borderRadius: '2px', background: s <= aiStep ? 'linear-gradient(90deg, #FFF4D0, #E6C35C)' : 'rgba(255,255,255,0.1)', transition: 'all 0.4s ease' }} />
              ))}
            </div>

            {/* Step 1 — Budget */}
            {aiStep === 1 && (
              <div>
                <p style={{ textAlign: 'center', fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', marginBottom: '18px', fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>1. What is your investment budget range?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    ['under-80L', 'Under ₹80 Lakhs', 'High-growth entry budget apartments'],
                    ['80L-1.5Cr', '₹80L – ₹1.5 Crore', 'Mid-luxury 2 & 3 BHK gated communities'],
                    ['1.5Cr-3Cr', '₹1.5 – ₹3 Crore', 'Luxury 3 & 4 BHK skyline residences'],
                    ['above-3Cr', 'Above ₹3 Crore', 'Ultra-luxury penthouses & private villas']
                  ].map(([val, label, sub]) => (
                    <button key={val} onClick={() => { setAiBudget(val); setAiStep(2); }} style={{ background: aiBudget === val ? 'rgba(230,195,92,0.12)' : 'rgba(255,255,255,0.02)', border: `1px solid ${aiBudget === val ? '#E6C35C' : 'rgba(255,255,255,0.08)'}`, borderRadius: '14px', padding: '14px 18px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                      <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.9rem', fontWeight: 700, color: aiBudget === val ? '#E6C35C' : '#fff' }}>{label}</div>
                      <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.45)', marginTop: '3px' }}>{sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 — Priority */}
            {aiStep === 2 && (
              <div>
                <p style={{ textAlign: 'center', fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', marginBottom: '18px', fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>2. What is your primary investment goal?</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    ['appreciation', '📈 Maximum Capital Appreciation', 'Focus on 15%+ YoY property price growth'],
                    ['yield', '💰 High Rental Yield (5%+)', 'Focus on corporate tenant rental income'],
                    ['commute', '🚗 IT Park Commute & Lifestyle', 'Direct transit to Hinjewadi IT Park & High Street']
                  ].map(([val, label, sub]) => (
                    <button key={val} onClick={() => { setAiPriority(val); setAiStep(3); }} style={{ background: aiPriority === val ? 'rgba(230,195,92,0.12)' : 'rgba(255,255,255,0.02)', border: `1px solid ${aiPriority === val ? '#E6C35C' : 'rgba(255,255,255,0.08)'}`, borderRadius: '14px', padding: '14px 18px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                      <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.9rem', fontWeight: 700, color: aiPriority === val ? '#E6C35C' : '#fff' }}>{label}</div>
                      <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.45)', marginTop: '3px' }}>{sub}</div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setAiStep(1)} style={{ marginTop: '16px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.8rem', fontFamily: "'Montserrat', sans-serif" }}>← Back to Budget</button>
              </div>
            )}

            {/* Step 3 — Preferred Area Selection */}
            {aiStep === 3 && (
              <div>
                <p style={{ textAlign: 'center', fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', marginBottom: '16px', fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>3. Select preferred corridor or best match:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '22px', justifyContent: 'center' }}>
                  {[
                    ['all', '✨ Specialist Best Match'],
                    ['HINJEWADI', '💻 Hinjewadi'],
                    ['WAKAD', '🛣️ Wakad'],
                    ['BANER', '🏙️ Baner'],
                    ['MAHALUNGE', '🌆 Mahalunge'],
                    ['TATHAWADE', '🎓 Tathawade']
                  ].map(([val, label]) => (
                    <button key={val} onClick={() => setAiCorridor(val)} style={{ background: aiCorridor === val ? 'rgba(230,195,92,0.2)' : 'rgba(255,255,255,0.03)', border: `1px solid ${aiCorridor === val ? '#E6C35C' : 'rgba(255,255,255,0.1)'}`, borderRadius: '50px', padding: '8px 16px', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", fontSize: '0.78rem', fontWeight: 700, color: aiCorridor === val ? '#E6C35C' : 'rgba(255,255,255,0.7)', transition: 'all 0.2s ease' }}>{label}</button>
                  ))}
                </div>
                <button
                  onClick={handleAiAnalyze}
                  style={{ width: '100%', background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)', border: 'none', color: '#040814', padding: '15px', borderRadius: '14px', fontSize: '0.92rem', fontWeight: 800, fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.06em', cursor: 'pointer', boxShadow: '0 6px 20px rgba(197,168,128,0.3)', transition: 'all 0.3s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(197,168,128,0.45)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(197,168,128,0.3)'; }}
                >
                  ✦ Generate Investment Recommendation
                </button>
                <button onClick={() => setAiStep(2)} style={{ marginTop: '14px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.8rem', fontFamily: "'Montserrat', sans-serif", display: 'block', margin: '14px auto 0 auto' }}>← Back to Priority</button>
              </div>
            )}

            {/* Step 4 — Analysis Result Report Screen */}
            {aiStep === 4 && (
              <div>
                {aiAnalyzing ? (
                  <div style={{ textAlign: 'center', padding: '28px 0' }}>
                    <div style={{ width: '48px', height: '48px', border: '3px solid rgba(230,195,92,0.2)', borderTop: '3px solid #E6C35C', borderRadius: '50%', margin: '0 auto 20px auto', animation: 'spin 0.8s linear infinite' }} />
                    <p style={{ fontSize: '0.92rem', color: '#E6C35C', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, margin: '0 0 6px 0' }}>Computing Market Metrics ({aiProgress}%)...</p>
                    <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', margin: 0 }}>Evaluating capital appreciation indices, rental yields &amp; transit scores</p>
                  </div>
                ) : aiReport ? (
                  <div style={{ animation: 'fadeIn 0.35s ease' }}>
                    <div style={{ background: 'rgba(230,195,92,0.08)', border: '1px solid rgba(230,195,92,0.35)', borderRadius: '16px', padding: '18px 20px', textAlign: 'center', marginBottom: '20px' }}>
                      <span style={{ fontSize: '0.64rem', fontWeight: 800, color: '#E6C35C', letterSpacing: '0.12em', textTransform: 'uppercase' }}>🎯 OPTIMAL INVESTMENT RECOMMENDATION</span>
                      <h3 style={{ margin: '8px 0 4px 0', fontFamily: "'Cinzel', serif", fontSize: '1.7rem', color: '#fff', fontWeight: 800 }}>
                        {aiReport.area} <span style={{ color: '#E6C35C', fontSize: '1.15rem' }}>({aiReport.matchPercent} Match)</span>
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.55 }}>
                        {aiReport.explanation}
                      </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '22px', textAlign: 'center' }}>
                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '10px 6px' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#34D399' }}>{aiReport.appreciationIndex}</div>
                        <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>YoY Appreciation</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '10px 6px' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#60A5FA' }}>{aiReport.rentalYield}</div>
                        <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>Rental Yield</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '10px 6px' }}>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#F59E0B' }}>{aiReport.transitScore}</div>
                        <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>Transit Score</div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handleApplyMegaFilter({ location: aiReport.area }, 'listings');
                        setIsAiModalOpen(false);
                        setAiStep(1);
                        setTimeout(() => {
                          const el = document.getElementById('listings-anchor');
                          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)',
                        border: 'none',
                        color: '#040814',
                        padding: '15px',
                        borderRadius: '14px',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        fontFamily: "'Montserrat', sans-serif",
                        letterSpacing: '0.06em',
                        cursor: 'pointer',
                        boxShadow: '0 6px 20px rgba(197,168,128,0.3)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      View AI Recommended Properties ({aiReport.area}) →
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
      {/* 4K FULL-SCREEN GALLERY LIGHTBOX MODAL */}
      {selectedGalleryImage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(4, 8, 20, 0.95)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '16px' : '32px'
          }}
          onClick={() => setSelectedGalleryImage(null)}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '1100px',
              background: '#070f1e',
              border: '1px solid rgba(230, 195, 92, 0.4)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 24px 80px rgba(0,0,0,0.9), 0 0 40px rgba(230,195,92,0.2)',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedGalleryImage(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                zIndex: 10,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(7, 15, 30, 0.85)',
                border: '1px solid rgba(230, 195, 92, 0.4)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            {/* High-Res Image Display */}
            <div style={{ flex: 1.4, height: isMobile ? '300px' : '520px', position: 'relative', background: '#040814' }}>
              <img
                src={selectedGalleryImage.img}
                alt={selectedGalleryImage.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(7,15,30,0.85)', border: '1px solid rgba(230,195,92,0.3)', borderRadius: '50px', padding: '4px 14px', fontSize: '0.7rem', fontWeight: 800, color: '#E6C35C' }}>
                {selectedGalleryImage.categoryLabel}
              </div>
            </div>

            {/* Details Panel */}
            <div style={{ flex: 1, padding: isMobile ? '24px 20px' : '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#E6C35C', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  📍 {selectedGalleryImage.location}
                </div>
                {selectedGalleryImage.rating && (
                  <div style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '50px', padding: '3px 10px', fontSize: '0.68rem', fontWeight: 800, color: '#FFF' }}>
                    ⭐ 5.0 Google Verified
                  </div>
                )}
              </div>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.3rem' : '1.7rem', fontWeight: 700, color: '#fff', margin: '0 0 8px 0', lineHeight: 1.2 }}>
                {selectedGalleryImage.title}
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginBottom: '14px' }}>
                Authorized Partner: <span style={{ color: '#fff' }}>{selectedGalleryImage.dev}</span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: '0 0 16px 0', fontFamily: "'Montserrat', sans-serif" }}>
                {selectedGalleryImage.desc}
              </p>
              {selectedGalleryImage.reviewSnippet && (
                <div style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '3px solid #E6C35C', borderRadius: '0 10px 10px 0', padding: '10px 14px', marginBottom: '22px' }}>
                  <div style={{ fontSize: '0.64rem', color: '#E6C35C', fontWeight: 800, textTransform: 'uppercase', marginBottom: '3px' }}>Client Experience & Verified Feedback</div>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', lineHeight: 1.4 }}>
                    {selectedGalleryImage.reviewSnippet}
                  </p>
                </div>
              )}


              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href={`https://wa.me/919673000053?text=${encodeURIComponent(`Hi Neeraj, I am interested in ${selectedGalleryImage.title} in ${selectedGalleryImage.location}. Please share floor plans & pricing.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)',
                    color: '#040814',
                    padding: '12px 20px',
                    borderRadius: '50px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                >
                  📞 Inquire via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM GALLERY PHOTO UPLOAD MODAL */}
      {isGalleryUploadOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(4, 8, 20, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setIsGalleryUploadOpen(false)}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'linear-gradient(135deg, #070f1e 0%, #0d1a30 100%)',
              border: '1px solid rgba(230, 195, 92, 0.35)',
              borderRadius: '24px',
              padding: isMobile ? '24px 18px' : '32px 28px',
              boxShadow: '0 24px 70px rgba(0, 0, 0, 0.9), 0 0 30px rgba(230, 195, 92, 0.15)'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.3rem', color: '#fff', margin: '0 0 4px 0', fontWeight: 700 }}>
                  📤 Upload Custom Gallery Photo
                </h3>
                <p style={{ margin: 0, fontSize: '0.76rem', color: 'rgba(255,255,255,0.5)', fontFamily: "'Montserrat', sans-serif" }}>
                  Select an image from your device or paste a URL to render directly in 24K Live Gallery
                </p>
              </div>
              <button
                onClick={() => setIsGalleryUploadOpen(false)}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCustomGalleryImage}>
              {/* File Select & Drop Area */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#E6C35C', marginBottom: '8px' }}>
                  1. Select Photo from Your Device
                </label>
                <div style={{
                  border: '2px dashed rgba(230, 195, 92, 0.4)',
                  borderRadius: '16px',
                  padding: '20px',
                  textAlign: 'center',
                  background: 'rgba(230, 195, 92, 0.03)',
                  cursor: 'pointer',
                  position: 'relative'
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryFileSelect}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                  />
                  {galleryUploadForm.img ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <img src={galleryUploadForm.img} alt="Preview" style={{ width: '90px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E6C35C' }} />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ color: '#25D366', fontSize: '0.78rem', fontWeight: 800 }}>✓ Image Selected</div>
                        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.68rem' }}>Click or drop to replace</div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload size={28} color="#E6C35C" style={{ margin: '0 auto 8px auto' }} />
                      <div style={{ color: '#fff', fontSize: '0.84rem', fontWeight: 600 }}>Click to Choose Image File or Drag &amp; Drop</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginTop: '4px' }}>PNG, JPG, WEBP up to 10MB</div>
                    </div>
                  )}
                </div>
              </div>

              {/* OR Image URL Input */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>
                  OR Paste Image Web URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={galleryUploadForm.img.startsWith('data:') ? '' : galleryUploadForm.img}
                  onChange={e => setGalleryUploadForm({ ...galleryUploadForm, img: e.target.value })}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '0.82rem', fontFamily: "'Montserrat', sans-serif", outline: 'none' }}
                />
              </div>

              {/* Title & Developer Row */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>Photo Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3 BHK Living Room View"
                    value={galleryUploadForm.title}
                    onChange={e => setGalleryUploadForm({ ...galleryUploadForm, title: e.target.value })}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '0.82rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>Developer / Partner</label>
                  <input
                    type="text"
                    placeholder="e.g. Kolte-Patil / VTP Realty"
                    value={galleryUploadForm.dev}
                    onChange={e => setGalleryUploadForm({ ...galleryUploadForm, dev: e.target.value })}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '0.82rem', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Category & Location Row */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>Category</label>
                  <select
                    value={galleryUploadForm.category}
                    onChange={e => setGalleryUploadForm({ ...galleryUploadForm, category: e.target.value })}
                    style={{ width: '100%', background: 'rgba(7,15,30,0.9)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '0.82rem', outline: 'none' }}
                  >
                    <option value="TOWERS">🏙️ High-Rise Architecture</option>
                    <option value="AMENITIES">🏊 Resort Amenities</option>
                    <option value="INTERIORS">🛋️ Sample Show Flats</option>
                    <option value="GREENS">🌳 Landscaped Greens</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>Corridor Location</label>
                  <select
                    value={galleryUploadForm.location}
                    onChange={e => setGalleryUploadForm({ ...galleryUploadForm, location: e.target.value })}
                    style={{ width: '100%', background: 'rgba(7,15,30,0.9)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '0.82rem', outline: 'none' }}
                  >
                    <option value="Hinjewadi Phase 1">📍 Hinjewadi Phase 1</option>
                    <option value="Hinjewadi Phase 2">📍 Hinjewadi Phase 2</option>
                    <option value="Wakad Central">📍 Wakad Central</option>
                    <option value="Baner High Street">📍 Baner High Street</option>
                    <option value="Mahalunge Smart City">📍 Mahalunge Smart City</option>
                    <option value="Balewadi">📍 Balewadi</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>Photo Description / Notes</label>
                <textarea
                  rows={2}
                  placeholder="Add details about the view, floor plan features, or amenities..."
                  value={galleryUploadForm.desc}
                  onChange={e => setGalleryUploadForm({ ...galleryUploadForm, desc: e.target.value })}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '0.82rem', fontFamily: "'Montserrat', sans-serif", outline: 'none', resize: 'none' }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)',
                  border: 'none',
                  color: '#040814',
                  padding: '14px',
                  borderRadius: '50px',
                  fontSize: '0.88rem',
                  fontWeight: 800,
                  fontFamily: "'Montserrat', sans-serif",
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(230,195,92,0.35)',
                  transition: 'all 0.3s ease'
                }}
              >
                ✦ Save &amp; Add Photo to Live Gallery →
              </button>
            </form>
          </div>
        </div>
      )}
      {!selectedPropertyDetail && !activeSubView && (
        <section style={{
          background: 'linear-gradient(180deg, #040814 0%, #070f1e 100%)',
          padding: isMobile ? '48px 16px 56px' : '72px 32px 80px',
        }}>
          <div style={{ maxWidth: isWideDesktop ? '1680px' : '1360px', margin: '0 auto' }}>
            {/* Section Header */}
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '50px', padding: '6px 18px', marginBottom: '16px' }}>
                <span style={{ color: '#D4AF37', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Expert Advisory</span>
              </div>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.6rem' : '2.2rem', fontWeight: 700, color: '#fff', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
                Meet Our <span style={{ color: '#D4AF37' }}>Senior Advisors</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
                Pune West's most trusted real estate experts — dedicated to finding you the perfect home.
              </p>
            </div>

            {/* Experts Grid — Ultra-Luxury Private Client Advisory Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))', gap: isMobile ? '20px' : '28px' }}>
              {[
                { 
                  name: 'Neeraj Giri', 
                  role: 'Founder & Principal Advisor', 
                  phone: '9673000053', 
                  initials: 'NG', 
                  deals: '500+', 
                  volume: '₹350 Cr+',
                  rating: '4.9 ★'
                },
                { 
                  name: 'Nilesh Omprakash Rai', 
                  phone: '9359595851', 
                  initials: 'NR', 
                  deals: '350+', 
                  volume: '₹220 Cr+',
                  rating: '4.8 ★'
                },
                { 
                  name: 'Jyoti Dhale', 
                  phone: '9356559727', 
                  initials: 'JD', 
                  deals: '420+', 
                  volume: '₹260 Cr+',
                  rating: '5.0 ★'
                },
                { 
                  name: 'Urvashi', 
                  phone: '6353745408', 
                  initials: 'UV', 
                  deals: '180+', 
                  volume: '₹120 Cr+',
                  rating: '4.9 ★'
                },
                { 
                  name: 'Yash Murkute', 
                  phone: '9822551862', 
                  initials: 'YM', 
                  deals: '250+', 
                  volume: '₹180 Cr+',
                  rating: '4.8 ★'
                },
              ].map((expert, i) => (
                <div 
                  key={i} 
                  style={{
                    background: 'linear-gradient(145deg, rgba(13, 25, 48, 0.85) 0%, rgba(6, 12, 24, 0.95) 100%)',
                    border: '1.5px solid rgba(212, 175, 55, 0.28)',
                    borderRadius: '24px',
                    padding: '28px 24px',
                    textAlign: 'center',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    boxShadow: '0 16px 36px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.65)';
                    e.currentTarget.style.boxShadow = '0 24px 50px rgba(0,0,0,0.7), 0 0 30px rgba(212,175,55,0.22)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.28)';
                    e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)';
                  }}
                >
                  {/* Subtle Top Gold Highlight */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '20%',
                    right: '20%',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.8), transparent)'
                  }} />

                  {/* MahaRERA Verified Tag */}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                    <span style={{
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: '50px',
                      padding: '4px 14px',
                      fontSize: '0.66rem',
                      fontWeight: 700,
                      color: 'rgba(212, 175, 55, 0.85)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase'
                    }}>
                      MahaRERA Certified
                    </span>
                  </div>

                  {/* Avatar with Dual Gold Rings */}
                  <div style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1A2639 0%, #0D1626 100%)',
                    border: '2px solid #D4AF37',
                    boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    position: 'relative'
                  }}>
                    <span style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      textShadow: '0 2px 10px rgba(212,175,55,0.5)'
                    }}>
                      {expert.initials}
                    </span>
                    <span style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      background: '#D4AF37',
                      color: '#040814',
                      borderRadius: '50%',
                      width: '22px',
                      height: '22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.68rem',
                      fontWeight: 900,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                    }} title="MahaRERA Certified Advisor">
                      ✓
                    </span>
                  </div>

                  {/* Advisor Identity */}
                  <h4 style={{
                    color: '#FFFFFF',
                    fontSize: '1.18rem',
                    margin: '0 0 4px',
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 700,
                    letterSpacing: '0.02em'
                  }}>
                    {expert.name}
                  </h4>
                  {expert.role ? (
                    <div style={{
                      color: '#D4AF37',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      marginBottom: '18px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em'
                    }}>
                      {expert.role}
                    </div>
                  ) : (
                    <div style={{ marginBottom: '18px' }} />
                  )}

                  {/* 3-Metric Performance Bar */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '12px 8px',
                    marginBottom: '20px'
                  }}>
                    <div>
                      <div style={{ color: '#FFFFFF', fontSize: '0.92rem', fontWeight: 800, fontFamily: "'Montserrat', sans-serif" }}>{expert.deals}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase' }}>Deals Closed</div>
                    </div>
                    <div style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                      <div style={{ color: '#F5D77F', fontSize: '0.92rem', fontWeight: 800, fontFamily: "'Montserrat', sans-serif" }}>{expert.volume}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase' }}>Volume</div>
                    </div>
                    <div>
                      <div style={{ color: '#22c55e', fontSize: '0.92rem', fontWeight: 800, fontFamily: "'Montserrat', sans-serif" }}>{expert.rating}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase' }}>Trust Score</div>
                    </div>
                  </div>

                  {/* Action CTAs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <a 
                      href={`https://wa.me/91${expert.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${expert.name}, I am contacting you from the 24K Realtors portal. I would like personalized guidance regarding verified properties in ${expert.area}.`)}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                        color: '#FFFFFF',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
                        transition: 'all 0.2s'
                      }}
                    >
                      <span>💬 Direct WhatsApp</span>
                    </a>
                    <a 
                      href={`tel:${expert.phone}`} 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        background: 'rgba(212, 175, 55, 0.06)',
                        border: '1px solid rgba(212, 175, 55, 0.35)',
                        color: '#F5D77F',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        transition: 'all 0.2s'
                      }}
                    >
                      <span>📞 Call: +91 {expert.phone}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Premium Trust Strip */}
            <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', padding: '14px 24px', background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '12px' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', fontWeight: 500, textAlign: 'center' }}>
                All advisors are <strong style={{ color: 'rgba(255,255,255,0.8)' }}>certified MahaRERA agents</strong>&nbsp;·&nbsp;RERA Reg. <strong style={{ color: '#D4AF37' }}>A051262603190</strong>&nbsp;·&nbsp;Pune West Exclusive Territory
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ── Seller / Landlord Advisory Desk — Full Width Premium Layout ── */}
      {!selectedPropertyDetail && !activeSubView && (
        <section style={{ padding: isMobile ? '48px 16px' : '64px 32px', background: 'linear-gradient(180deg, #070f1e 0%, #040814 100%)' }}>
          <div style={{ maxWidth: isWideDesktop ? '1680px' : '1360px', margin: '0 auto' }}>

            {/* Unified Section Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: '50px', padding: '6px 18px', marginBottom: '16px' }}>
                <span style={{ color: '#D4AF37', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Seller Advisory</span>
              </div>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.6rem' : '2.2rem', fontWeight: 700, color: '#fff', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
                List Your Property with <span style={{ color: '#D4AF37' }}>24K Realtors</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
                Register your mandate directly with Pune West's most trusted advisory team. Reach verified buyers, NRI investors, and institutional funds.
              </p>
            </div>

            {/* Full-Width Split Card */}
            <div id="seller-mandate-anchor" style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: isMobile ? '24px' : '0',
              background: 'linear-gradient(135deg, rgba(7,15,30,0.98) 0%, rgba(15,28,46,0.95) 100%)',
              border: '1px solid rgba(212,175,55,0.22)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)'
            }}>
              {/* Left: Info Panel */}
              <div style={{ padding: isMobile ? '32px 24px' : '48px 48px', borderRight: isMobile ? 'none' : '1px solid rgba(212,175,55,0.1)', borderBottom: isMobile ? '1px solid rgba(212,175,55,0.1)' : 'none', position: 'relative', overflow: 'hidden' }}>
                {/* Background glow */}
                <div style={{ position: 'absolute', top: '-40px', left: '-40px', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(184,140,28,0.08))', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building size={22} color="#E6C35C" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Seller & Landlord Desk</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>MahaRERA Compliant Mandate</div>
                  </div>
                </div>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: isMobile ? '1.35rem' : '1.7rem', color: '#fff', margin: '0 0 14px', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                  Your Property.<br/><span style={{ color: '#E6C35C' }}>Our Verified Buyers.</span> Direct Mandate.
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '28px' }}>
                  Direct access to 10,000+ verified buyer inquiries monthly, institutional property funds, NRI investors, and HNWI clients in Baner, Wakad & Hinjewadi.
                </p>
                {/* 3 Benefit Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {[
                    { icon: '✅', label: 'MahaRERA Verified' },
                    { icon: '🎯', label: 'Verified Buyers' },
                    { icon: '⚡', label: 'Live in 2 Minutes' },
                  ].map((b, bi) => (
                    <div key={bi} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.18)', borderRadius: '50px', padding: '6px 14px' }}>
                      <span style={{ fontSize: '0.8rem' }}>{b.icon}</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.04em' }}>{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: CTA Panel */}
              <div style={{ padding: isMobile ? '32px 24px' : '48px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '8px' }}>
                  {[
                    { val: '10K+', label: 'Active Buyer Inquiries', color: '#E6C35C' },
                    { val: '21+', label: 'Developer Partnerships', color: '#E6C35C' },
                    { val: '4.9★', label: 'Google Rating', color: '#E6C35C' },
                    { val: '<48h', label: 'Avg. Response Time', color: '#E6C35C' },
                  ].map((s, si) => (
                    <div key={si} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: "'Cinzel',serif", color: s.color, lineHeight: 1 }}>{s.val}</div>
                      <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px', lineHeight: 1.3 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => onViewChange && onViewChange('list-property')}
                  style={{
                    width: '100%', background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)',
                    border: 'none', color: '#040814', padding: '16px 28px', borderRadius: '14px',
                    fontSize: '0.9rem', fontWeight: 800, fontFamily: "'Montserrat', sans-serif",
                    letterSpacing: '0.06em', cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(197,168,128,0.3)', transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 14px 32px rgba(197,168,128,0.45)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(197,168,128,0.3)'; }}
                >
                  Start Free Listing →
                </button>
                <a
                  href="https://wa.me/919673000053?text=Hi, I want to list my property with 24K Realtors Pune. Please guide me."
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: '14px', padding: '14px', fontSize: '0.82rem', fontWeight: 700, color: '#25D366', textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.18)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.1)'; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  Instant WhatsApp Advisory
                </a>
                <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', margin: 0 }}>No spam · 100% confidential · MahaRERA compliant</p>
              </div>
            </div>
          </div>
        </section>
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
