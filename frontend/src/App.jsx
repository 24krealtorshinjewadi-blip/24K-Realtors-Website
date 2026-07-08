import React, { useState, useCallback, Suspense, lazy } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Lazy load Dashboard (CRM) — only loads when authenticated user needs it
// This reduces initial bundle by ~100KB
const Portal = lazy(() => import('./components/Portal'));
const Dashboard = lazy(() => import('./components/Dashboard'));

// Full-screen skeleton loader for Suspense fallback
function AppLoadingScreen() {
  return (
    <div
      role="status"
      aria-label="Loading 24K Realtors"
      style={{
        minHeight: '100vh',
        background: '#070F1E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px',
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <div
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '1.6rem',
          fontWeight: 800,
          color: '#D4AF37',
          letterSpacing: '0.05em',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
        aria-hidden="true"
      >
        24K REALTORS
      </div>
      <div
        style={{
          width: '180px',
          height: '2px',
          background: 'rgba(212, 175, 55, 0.15)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <div
          style={{
            height: '100%',
            width: '40%',
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

  const handleViewChange = useCallback((view) => {
    // Auth guard: only allow dashboard access if JWT token exists
    if (view === 'dashboard') {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect unauthenticated users to portal with auth prompt
        console.warn('[Auth] Attempt to access Dashboard without token. Redirecting.');
        setCurrentView('portal');
        return;
      }
    }
    setCurrentView(view);
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
      </div>
    </ErrorBoundary>
  );
}
