import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import LoginModal from './components/LoginModal'; // legacy modal — kept for backward compat
import CompanyLogo from './components/CompanyLogo';
import { auth, subscribeToNotifications, onForegroundMessage } from './services/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Lenis from 'lenis';
import './App.css';

// Lazy load heavy components — reduces initial bundle
const Portal = lazy(() => import('./components/Portal'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const LoginPage = lazy(() => import('./components/LoginPage'));   // new SaaS full-page login
const ListPropertyPage = lazy(() => import('./components/ListPropertyPage'));
const AiAssistantPanel = lazy(() => import('./components/AiAssistantPanel'));

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

export default function App() {
  // views: 'portal' | 'dashboard' | 'login'
  const [currentView, setCurrentView] = useState('portal');
  const [showLoginModal, setShowLoginModal] = useState(false); // legacy fallback
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

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

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

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

  const handleViewChange = useCallback((view) => {
    if (view === 'dashboard') {
      const token = localStorage.getItem('token');
      if (!token) {
        // Use new full-page login instead of modal
        setCurrentView('login');
        return;
      }
    }
    if (view === 'logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userFullName');
      localStorage.removeItem('username');
      setCurrentView('portal');
      return;
    }
    setCurrentView(view);
  }, []);

  const handleLoginSuccess = useCallback(() => {
    setShowLoginModal(false);
    setCurrentView('dashboard');
  }, []);

  return (
    <ErrorBoundary>
      <div className="app-wrapper">
        <main
          id="main-content"
          className="main-content"
          role="main"
          aria-label="Main content"
          tabIndex={-1}
        >
          <Suspense fallback={<AppLoadingScreen />}>
            {currentView === 'login' ? (
              // ✨ New SaaS full-page login
              <LoginPage onSuccess={(data) => {
                setCurrentView('dashboard');
              }} />
            ) : currentView === 'list-property' ? (
              <ListPropertyPage onBack={() => setCurrentView('portal')} />
            ) : currentView === 'portal' ? (
              <Portal onViewChange={handleViewChange} />
            ) : (
              <Dashboard onViewChange={handleViewChange} />
            )}
          </Suspense>
        </main>

        {/* Legacy modal — retained for any in-app re-auth triggers */}
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onSuccess={() => {
              setShowLoginModal(false);
              setCurrentView('dashboard');
            }}
          />
        )}

        {/* 🤖 AI CRM Co-pilot — available on Dashboard */}
        {currentView === 'dashboard' && (
          <AiAssistantPanel
            onCommand={(cmd) => console.log('[Voice Command]', cmd)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
