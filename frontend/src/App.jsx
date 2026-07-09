import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import LoginModal from './components/LoginModal';
import CompanyLogo from './components/CompanyLogo';
import Lenis from 'lenis';
import './App.css';

// Lazy load heavy components — reduces initial bundle
const Portal = lazy(() => import('./components/Portal'));
const Dashboard = lazy(() => import('./components/Dashboard'));

// Full-screen skeleton loader for Suspense fallback
function AppLoadingScreen() {
  return (
    <div
      role="status"
      aria-label="Loading 24K Realtors"
      style={{
        minHeight: '100vh', background: '#070F1E',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '20px',
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <CompanyLogo variant="full" width={220} height={140} style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div
        style={{
          width: '180px', height: '2px',
          background: 'rgba(212, 175, 55, 0.15)',
          borderRadius: '2px', overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <div
          style={{
            height: '100%', width: '40%',
            background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
            animation: 'shimmer 1.2s ease-in-out infinite',
          }}
        />
      </div>
      <span className="sr-only">Loading, please wait…</span>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes shimmer { 0% { transform: translateX(-200%); } 100% { transform: translateX(400%); } }
      `}</style>
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState('portal'); // portal | dashboard
  const [showLoginModal, setShowLoginModal] = useState(false);

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
        // Show premium login modal instead of silent redirect
        setShowLoginModal(true);
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
            {currentView === 'portal' ? (
              <Portal onViewChange={handleViewChange} />
            ) : (
              <Dashboard onViewChange={handleViewChange} />
            )}
          </Suspense>
        </main>

        {/* Premium login modal — triggered when unauthenticated user accesses dashboard */}
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onSuccess={handleLoginSuccess}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
