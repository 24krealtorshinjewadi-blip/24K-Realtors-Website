import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
  Navigate
} from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LoginModal from './components/LoginModal'; // legacy modal — kept for backward compat
import CompanyLogo from './components/CompanyLogo';
import { auth, onForegroundMessage } from './services/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Lenis from 'lenis';
import { useSEO, SEO_CONFIGS } from './services/seoService';
import { apiService } from './services/apiService';
import ToastContainer from './components/Toast';
import './App.css';

// Lazy load heavy components — reduces initial bundle
const Portal = lazy(() => import('./components/Portal'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const LoginPage = lazy(() => import('./components/LoginPage'));
const ListPropertyPage = lazy(() => import('./components/ListPropertyPage'));
const AiAssistantPanel = lazy(() => import('./components/AiAssistantPanel'));
const PublicSocietiesPage = lazy(() => import('./components/PublicSocietiesPage'));
const PublicSocietyDetailPage = lazy(() => import('./components/PublicSocietyDetailPage'));
const PropertyDetailView = lazy(() => import('./components/PropertyDetailView'));
const LocationLandingPage = lazy(() => import('./components/LocationLandingPage'));
const BlogListPage       = lazy(() => import('./components/BlogListPage'));
const BlogDetailPage     = lazy(() => import('./components/BlogDetailPage'));
const PublicTownshipPage        = lazy(() => import('./components/PublicTownshipPage'));
const GodrejProjectPage         = lazy(() => import('./components/GodrejProjectPage'));
const MegapolisTownshipPage     = lazy(() => import('./components/MegapolisTownshipPage'));
const MegapolisSocietyListingsPage = lazy(() => import('./components/MegapolisSocietyListingsPage'));
const YashOneProjectPage        = lazy(() => import('./components/YashOneProjectPage'));
const KohinoorProjectPage       = lazy(() => import('./components/KohinoorProjectPage'));
const TcgCliffGardenProjectPage  = lazy(() => import('./components/TcgCliffGardenProjectPage'));
const VtpBlueWatersProjectPage   = lazy(() => import('./components/VtpBlueWatersProjectPage'));

// Full-screen skeleton loader for Suspense fallback
function AppLoadingScreen() {
  return (
    <div
      role="status"
      aria-label="Loading 24K Realtors"
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle, #0e1e36 0%, #040814 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '30px',
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <div style={{
        animation: 'cinematicPulse 2.5s ease-in-out infinite',
        transform: 'scale(1)',
        opacity: 0.95,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <CompanyLogo variant="full" width={320} height={200} />
      </div>
      
      {/* Sleek Golden Loading Bar */}
      <div
        style={{
          width: '240px',
          height: '2px',
          background: 'rgba(212, 175, 55, 0.12)',
          borderRadius: '4px',
          overflow: 'hidden',
          marginTop: '10px',
          boxShadow: '0 0 10px rgba(212, 175, 55, 0.2)'
        }}
        aria-hidden="true"
      >
        <div
          style={{
            height: '100%',
            width: '35%',
            background: 'linear-gradient(90deg, transparent, #FFDF79, #D4AF37, transparent)',
            animation: 'shimmer 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          }}
        />
      </div>
      <span className="sr-only">Loading 24K Realtors Platform…</span>
      <style>{`
        @keyframes cinematicPulse {
          0%, 100% { transform: scale(0.98); opacity: 0.85; filter: brightness(0.9); }
          50% { transform: scale(1.02); opacity: 1; filter: brightness(1.1) drop-shadow(0 0 15px rgba(212,175,55,0.2)); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-150%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
}

// ── Protected Route for CRM Dashboard ───────────────────────────────────────
function ProtectedDashboardRoute({ onViewChange }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Dashboard onViewChange={onViewChange} />;
}

// ── Route Wrappers for Dynamic Slug Pages ───────────────────────────────────
function SocietyDetailRouteWrapper({ onBack }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  return (
    <PublicSocietyDetailPage
      slug={slug || 'kolte-patil-life-republic-hinjewadi'}
      onBack={() => navigate('/societies')}
    />
  );
}

function PropertyDetailRouteWrapper() {
  const { id, slug } = useParams();
  const propertyKey = id || slug || 'prop-1';
  const navigate = useNavigate();
  const location = useLocation();

  // ── Direct Redirection for 7 Flagship Dedicated Showcases ──
  const keyStr = String(propertyKey).toLowerCase();
  if (keyStr.includes('tcg') || keyStr.includes('cliff') || keyStr.includes('clip')) {
    return <Navigate to="/tcg-cliff-garden-hinjewadi" replace />;
  }
  if (keyStr.includes('vtp') || keyStr.includes('bluewater') || keyStr.includes('blue-water')) {
    return <Navigate to="/vtp-blue-waters-mahalunge" replace />;
  }
  if (keyStr.includes('kohinoor') || keyStr.includes('sportsville')) {
    return <Navigate to="/kohinoor-sportsville-hinjewadi" replace />;
  }
  if (keyStr.includes('yashone') || keyStr.includes('yash-one')) {
    return <Navigate to="/vj-yashone-hinjewadi" replace />;
  }
  if (keyStr === 'prop-godrej-24' || keyStr === 'godrej-24') {
    return <Navigate to="/godrej-24-hinjewadi" replace />;
  }
  if (keyStr === 'prop-godrej-elements' || keyStr === 'godrej-elements') {
    return <Navigate to="/godrej-elements-hinjewadi" replace />;
  }
  if (keyStr.includes('megapolis-township') || keyStr === 'prop-megapolis-township') {
    return <Navigate to="/townships/megapolis" replace />;
  }

  const [property, setProperty] = useState(location.state?.property || null);
  const [loading, setLoading] = useState(!location.state?.property);
  const [allProps, setAllProps] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const matchesKey = property && (
      String(property.id) === String(propertyKey) ||
      `prop-${property.id}` === String(propertyKey) ||
      String(property.id) === `prop-${propertyKey}` ||
      property.slug === propertyKey
    );

    if (property) {
      const t = (property.title || '').toLowerCase();
      if (t.includes('cliff') || t.includes('tcg')) { navigate('/tcg-cliff-garden-hinjewadi', { replace: true }); return; }
      if (t.includes('blue waters') || t.includes('bluewater') || (t.includes('vtp') && t.includes('water'))) { navigate('/vtp-blue-waters-mahalunge', { replace: true }); return; }
      if (t.includes('sportsville') || t.includes('kohinoor')) { navigate('/kohinoor-sportsville-hinjewadi', { replace: true }); return; }
      if (t.includes('yashone')) { navigate('/vj-yashone-hinjewadi', { replace: true }); return; }
      if (t.includes('godrej 24') || (t.includes('godrej') && t.includes('24'))) { navigate('/godrej-24-hinjewadi', { replace: true }); return; }
      if (t.includes('godrej elements') || (t.includes('godrej') && t.includes('element'))) { navigate('/godrej-elements-hinjewadi', { replace: true }); return; }
      if (t.includes('megapolis township')) { navigate('/townships/megapolis', { replace: true }); return; }
    }

    if (!property || !matchesKey) {
      setLoading(true);
      apiService.getPropertyById(propertyKey)
        .then(res => {
          if (isMounted && res) {
            setProperty(res);
            setLoading(false);
          } else if (isMounted) {
            setLoading(false);
          }
        })
        .catch(err => {
          console.error('[PropertyDetailRouteWrapper] Failed to fetch:', err);
          if (isMounted) setLoading(false);
        });
    }

    apiService.getProperties({}, 0, 50)
      .then(res => {
        if (isMounted) setAllProps(res.content || res || []);
      })
      .catch(() => {});

    return () => { isMounted = false; };
  }, [propertyKey]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#040814', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#F3E5AB', fontFamily: "'Cinzel', serif" }}>
        <div style={{ width: '44px', height: '44px', border: '3px solid rgba(212,175,55,0.2)', borderTopColor: '#D4AF37', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
        <p style={{ letterSpacing: '0.12em', fontSize: '0.9rem', textTransform: 'uppercase' }}>Accessing 24K Property Dossier...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{ minHeight: '100vh', background: '#040814', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#FFF', gap: '16px', padding: '24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Cinzel', serif", color: '#F3E5AB' }}>Property Dossier Not Found</h2>
        <p style={{ color: '#94A3B8', maxWidth: '400px' }}>The requested property record could not be loaded or may have been updated.</p>
        <button onClick={() => navigate('/')} className="pi-btn-gold">Explore All Properties</button>
      </div>
    );
  }

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <PropertyDetailView
      property={property}
      allProperties={allProps}
      onBack={handleBack}
      onOpenInquiry={() => {
        window.open(`https://wa.me/919673000053?text=Hi%2024K%20Realtors%2C%20I%20am%20interested%20in%20${encodeURIComponent(property.title || 'this property')}%20%7C%20Price%3A%20${encodeURIComponent(property.price ? '₹' + property.price : '')}`, '_blank');
      }}
      onOpenChauffeur={() => {
        window.open(`https://wa.me/919673000053?text=Hi%2024K%20Realtors%2C%20I%20would%20like%20to%20schedule%20a%20private%20site%20visit%20for%20${encodeURIComponent(property.title || 'this property')}`, '_blank');
      }}
      onOpenBrochure={(prop) => {
        const p = prop || property;
        window.open(`https://wa.me/919673000053?text=Hi%2024K%20Realtors%2C%20please%20share%20the%20official%20PDF%20brochure%20and%20pricing%20breakup%20for%20${encodeURIComponent(p?.title || 'this property')}`, '_blank');
      }}
    />
  );
}

function LocationLandingRouteWrapper() {
  const { slug } = useParams();
  const navigate = useNavigate();
  return (
    <LocationLandingPage
      locationSlug={slug || 'hinjewadi-phase-1'}
      onBack={() => navigate('/societies')}
      onSelectSociety={(socSlug) => navigate(`/society/${socSlug}`)}
    />
  );
}

function BlogDetailRouteWrapper() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const blog = location.state?.blog || null;
  return (
    <BlogDetailPage
      blog={blog}
      slug={slug}
      onBack={() => navigate('/blog')}
      onBrowse={() => navigate('/')}
    />
  );
}

// ── Legacy Hash Handler: Converts #routes to real browser URLs ───────────────
function LegacyHashRedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash) return;

      if (hash.startsWith('property/')) {
        const propId = hash.replace('property/', '');
        navigate(`/property/${propId}`, { replace: true });
        return;
      }

      if (hash === 'townships' || hash === 'township-explorer') {
        navigate('/townships', { replace: true });
        return;
      }
      if (hash === 'townships/megapolis' || hash === 'megapolis') {
        navigate('/townships/megapolis', { replace: true });
        return;
      }
      if (hash.startsWith('townships/megapolis/')) {
        const socId = hash.replace('townships/megapolis/', '');
        navigate(`/townships/megapolis/${socId}`, { replace: true });
        return;
      }
      if (hash === 'signature-collection' || hash === 'signature') {
        navigate('/', { replace: true });
      } else if (hash === 'societies' || hash === 'properties') {
        navigate('/societies', { replace: true });
      } else if (hash.startsWith('society/')) {
        const slug = hash.replace('society/', '');
        navigate(`/society/${slug}`, { replace: true });
      } else if (hash.startsWith('locations/') || hash.startsWith('location/')) {
        const loc = hash.replace('locations/', '').replace('location/', '');
        navigate(`/locations/${loc}`, { replace: true });
      } else if (hash === 'list-property') {
        navigate('/list-property', { replace: true });
      } else if (hash === 'login') {
        navigate('/login', { replace: true });
      } else if (hash === 'dashboard') {
        navigate('/dashboard', { replace: true });
      } else if (hash === 'blog') {
        navigate('/blog', { replace: true });
      } else if (hash.startsWith('blog/')) {
        const slug = hash.replace('blog/', '');
        navigate(`/blog/${slug}`, { replace: true });
      }
    };

    if (window.location.hash) {
      handleHash();
    }
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [navigate]);

  return null;
}

// ── Main App Content with Router Hooks ──────────────────────────────────────
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // ── Dynamic SEO per route ────────────────────────────────────────────────
  const pathname = location.pathname;
  const seoConfig = pathname === '/'                ? SEO_CONFIGS.portal
                  : pathname === '/dashboard'       ? SEO_CONFIGS.dashboard
                  : pathname === '/login'           ? SEO_CONFIGS.login
                  : pathname === '/list-property'   ? SEO_CONFIGS.listProperty
                  : pathname.startsWith('/blog')    ? SEO_CONFIGS.blog
                  : SEO_CONFIGS.portal;
  useSEO(seoConfig);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        console.log('[Firebase] User signed in:', user.email);
      }
    });
    return () => unsubscribe();
  }, []);

  // FCM Foreground notifications
  useEffect(() => {
    const unsubFCM = onForegroundMessage((payload) => {
      const notif = payload.notification || {};
      console.log('[FCM] New notification:', notif.title);
      setNotifications(prev => [{ ...notif, id: Date.now() }, ...prev.slice(0, 9)]);
    });
    return () => { if (unsubFCM) unsubFCM(); };
  }, []);

  // Lenis Smooth Scroll
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Disable Lenis on mobile devices & touch screens to prevent touch scroll freeze on iOS / iPhone
    const isMobileDevice = typeof window !== 'undefined' && (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.innerWidth <= 768 ||
      ('ontouchstart' in window)
    );
    if (isMobileDevice) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    let animationId;
    function raf(time) {
      lenis.raf(time);
      animationId = requestAnimationFrame(raf);
    }
    animationId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationId);
      lenis.destroy();
    };
  }, []);

  // Scroll to top whenever pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Backward-compatible navigation handler for components passing onViewChange
  const handleViewChange = useCallback((view) => {
    window.scrollTo(0, 0);
    if (!view || view === 'portal') {
      navigate('/');
      return;
    }
    if (view === 'societies' || view === 'properties') {
      navigate('/societies');
      return;
    }
    if (view === 'townships' || view === 'township-explorer') {
      navigate('/townships');
      return;
    }
    if (view.startsWith('society/')) {
      const slug = view.replace('society/', '');
      navigate(`/society/${slug}`);
      return;
    }
    if (view.startsWith('location/') || view.startsWith('locations/')) {
      const loc = view.replace('locations/', '').replace('location/', '');
      navigate(`/locations/${loc}`);
      return;
    }
    if (view === 'blog') {
      navigate('/blog');
      return;
    }
    if (view.startsWith('blog/')) {
      const slug = view.replace('blog/', '');
      navigate(`/blog/${slug}`);
      return;
    }
    if (view === 'dashboard') {
      navigate('/dashboard');
      return;
    }
    if (view === 'login') {
      navigate('/login');
      return;
    }
    if (view === 'list-property') {
      navigate('/list-property');
      return;
    }
    if (view === 'logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userFullName');
      localStorage.removeItem('username');
      navigate('/');
      return;
    }
    navigate(`/${view}`);
  }, [navigate]);

  return (
    <ErrorBoundary>
      <LegacyHashRedirectHandler />
      <div className="app-wrapper">
        <main
          id="main-content"
          className="main-content"
          role="main"
          aria-label="Main content"
          tabIndex={-1}
        >
          <Suspense fallback={<AppLoadingScreen />}>
            <Routes>
              {/* Home / Public Portal */}
              <Route path="/" element={<Portal onViewChange={handleViewChange} />} />

              {/* Login Page */}
              <Route
                path="/login"
                element={<LoginPage onSuccess={() => navigate('/dashboard')} />}
              />

              {/* CRM Dashboard (Protected) */}
              <Route
                path="/dashboard"
                element={<ProtectedDashboardRoute onViewChange={handleViewChange} />}
              />

              {/* Public Societies */}
              <Route
                path="/societies"
                element={
                  <PublicSocietiesPage
                    onSelectSociety={(slug) => navigate(`/society/${slug}`)}
                    onBackHome={() => navigate('/')}
                  />
                }
              />
              <Route path="/properties" element={<Navigate to="/societies" replace />} />

              {/* Township Explorer */}
              <Route
                path="/townships"
                element={
                  <PublicTownshipPage
                    onBackHome={() => navigate('/')}
                    onSelectSociety={(slug) => navigate(`/society/${slug}`)}
                    onExploreTownship={(id) => navigate(`/townships/${id}`)}
                  />
                }
              />

              {/* Megapolis Township — Collection / Landing Page */}
              <Route
                path="/townships/megapolis"
                element={
                  <MegapolisTownshipPage
                    onBackHome={() => navigate('/townships')}
                  />
                }
              />

              {/* Megapolis Society Listings — Dual Panel Filter + Units */}
              <Route
                path="/townships/megapolis/:societyId"
                element={
                  <MegapolisSocietyListingsPage
                    onBack={() => navigate('/townships/megapolis')}
                  />
                }
              />

              {/* Megapolis SEO & Direct Friendly Alias Routes */}
              <Route path="/megapolis-hinjewadi" element={<Navigate to="/townships/megapolis" replace />} />
              <Route path="/megapolis-township" element={<Navigate to="/townships/megapolis" replace />} />
              <Route path="/megapolis-sangria" element={<Navigate to="/townships/megapolis/sangria" replace />} />
              <Route path="/megapolis-mystic" element={<Navigate to="/townships/megapolis/mystic" replace />} />
              <Route path="/megapolis-splendour" element={<Navigate to="/townships/megapolis/splendour" replace />} />
              <Route path="/megapolis-sunway" element={<Navigate to="/townships/megapolis/sunway" replace />} />
              <Route path="/megapolis-sparkle" element={<Navigate to="/townships/megapolis/sparkle" replace />} />

              {/* Society Detail */}
              <Route path="/society/:slug" element={<SocietyDetailRouteWrapper />} />

              {/* Property Detail (First-Class Deep Linking) */}
              <Route path="/property/:id" element={<PropertyDetailRouteWrapper />} />
              <Route path="/property/slug/:slug" element={<PropertyDetailRouteWrapper />} />

              {/* Location Landing */}
              <Route path="/locations/:slug" element={<LocationLandingRouteWrapper />} />
              <Route path="/location/:slug" element={<LocationLandingRouteWrapper />} />

              {/* List Property */}
              <Route
                path="/list-property"
                element={<ListPropertyPage onBack={() => navigate('/')} />}
              />

              {/* Blog Pages */}
              <Route
                path="/blog"
                element={
                  <BlogListPage
                    onBack={() => navigate('/')}
                    onSelectBlog={(blog) => navigate(`/blog/${blog.slug}`, { state: { blog } })}
                  />
                }
              />
              <Route path="/blog/:slug" element={<BlogDetailRouteWrapper />} />

              {/* ─── GODREJ 24 — Dedicated SEO Pages ──────────────────────────── */}
              {/* /godrej-24-hinjewadi — Project overview page */}
              <Route
                path="/godrej-24-hinjewadi"
                element={<GodrejProjectPage project="godrej24" bhkFilter={null} />}
              />
              {/* /godrej-24-2-bhk — 2 BHK only page */}
              <Route
                path="/godrej-24-2-bhk"
                element={<GodrejProjectPage project="godrej24" bhkFilter="2 BHK" />}
              />
              {/* /godrej-24-3-bhk — 3 BHK only page */}
              <Route
                path="/godrej-24-3-bhk"
                element={<GodrejProjectPage project="godrej24" bhkFilter="3 BHK" />}
              />

              {/* ─── GODREJ ELEMENTS — Dedicated SEO Pages ──────────────────────── */}
              {/* /godrej-elements-hinjewadi — Project overview page */}
              <Route
                path="/godrej-elements-hinjewadi"
                element={<GodrejProjectPage project="elements" bhkFilter={null} />}
              />
              {/* /godrej-elements-2-bhk — 2 BHK only page */}
              <Route
                path="/godrej-elements-2-bhk"
                element={<GodrejProjectPage project="elements" bhkFilter="2 BHK" />}
              />
              {/* /godrej-elements-3-bhk — 3 BHK only page */}
              <Route
                path="/godrej-elements-3-bhk"
                element={<GodrejProjectPage project="elements" bhkFilter="3 BHK" />}
              />

              {/* ─── VJ YASHONE — Dedicated Showcase Pages ─────────────────────── */}
              <Route
                path="/vj-yashone-hinjewadi"
                element={<YashOneProjectPage onBackHome={() => navigate('/')} />}
              />
              <Route path="/yashone-hinjewadi" element={<Navigate to="/vj-yashone-hinjewadi" replace />} />
              <Route path="/yashone" element={<Navigate to="/vj-yashone-hinjewadi" replace />} />

              {/* ─── KOHINOOR SPORTSVILLE — Dedicated Subpage ───────────────────── */}
              <Route
                path="/kohinoor-sportsville-hinjewadi"
                element={<KohinoorProjectPage onBackHome={() => navigate('/')} />}
              />
              <Route path="/kohinoor-sportsville" element={<Navigate to="/kohinoor-sportsville-hinjewadi" replace />} />
              <Route path="/kohinoor" element={<Navigate to="/kohinoor-sportsville-hinjewadi" replace />} />

              {/* ─── TCG THE CLIFF GARDEN — Dedicated Showcase Subpage ──────────── */}
              <Route
                path="/tcg-cliff-garden-hinjewadi"
                element={<TcgCliffGardenProjectPage onBackHome={() => navigate('/')} />}
              />
              <Route
                path="/tcg-the-cliff-garden-hinjewadi"
                element={<TcgCliffGardenProjectPage onBackHome={() => navigate('/')} />}
              />
              <Route
                path="/tcg-cliff-garden-1-bhk"
                element={<TcgCliffGardenProjectPage initialBhkFilter="1 BHK" onBackHome={() => navigate('/')} />}
              />
              <Route
                path="/tcg-cliff-garden-2-bhk"
                element={<TcgCliffGardenProjectPage initialBhkFilter="2 BHK" onBackHome={() => navigate('/')} />}
              />
              <Route path="/tcg-the-cliff-garden" element={<Navigate to="/tcg-cliff-garden-hinjewadi" replace />} />
              <Route path="/tcg-the-clip-garden" element={<Navigate to="/tcg-cliff-garden-hinjewadi" replace />} />
              <Route path="/tcg-cliff-garden" element={<Navigate to="/tcg-cliff-garden-hinjewadi" replace />} />
              <Route path="/tcg-clip-garden" element={<Navigate to="/tcg-cliff-garden-hinjewadi" replace />} />
              <Route path="/tcg-hinjewadi" element={<Navigate to="/tcg-cliff-garden-hinjewadi" replace />} />
              <Route path="/projects/tcg-cliff-garden" element={<Navigate to="/tcg-cliff-garden-hinjewadi" replace />} />
              <Route path="/projects/tcg-the-cliff-garden" element={<Navigate to="/tcg-cliff-garden-hinjewadi" replace />} />
              <Route path="/projects/tcg-the-clip-garden" element={<Navigate to="/tcg-cliff-garden-hinjewadi" replace />} />

              {/* ─── VTP BLUE WATERS — Dedicated Showcase Subpage ────────────── */}
              <Route
                path="/vtp-blue-waters-mahalunge"
                element={<VtpBlueWatersProjectPage onBackHome={() => navigate('/')} />}
              />
              <Route
                path="/vtp-bluewater-mahalunge"
                element={<VtpBlueWatersProjectPage onBackHome={() => navigate('/')} />}
              />
              <Route path="/vtp-blue-waters" element={<Navigate to="/vtp-blue-waters-mahalunge" replace />} />
              <Route path="/vtp-bluewater" element={<Navigate to="/vtp-blue-waters-mahalunge" replace />} />
              <Route path="/vtp-blue-water" element={<Navigate to="/vtp-blue-waters-mahalunge" replace />} />
              <Route path="/vtp-mahalunge" element={<Navigate to="/vtp-blue-waters-mahalunge" replace />} />
              <Route path="/projects/vtp-blue-waters" element={<Navigate to="/vtp-blue-waters-mahalunge" replace />} />
              <Route path="/projects/vtp-bluewater" element={<Navigate to="/vtp-blue-waters-mahalunge" replace />} />

              {/* Catch-all (MUST BE LAST) */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        {/* Legacy modal — retained for any in-app re-auth triggers */}
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onSuccess={() => {
              setShowLoginModal(false);
              navigate('/dashboard');
            }}
          />
        )}

        {/* AI CRM Co-pilot — available on Dashboard */}
        {pathname === '/dashboard' && (
          <AiAssistantPanel
            onCommand={(cmd) => console.log('[Voice Command]', cmd)}
          />
        )}

        {/* Global Toast Notification Container */}
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

