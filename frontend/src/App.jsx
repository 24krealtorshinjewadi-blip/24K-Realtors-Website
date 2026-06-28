import React, { useState } from 'react';
import Portal from './components/Portal';
import Dashboard from './components/Dashboard';
import { Home, ShieldCheck, Building } from 'lucide-react';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('portal'); // portal | dashboard

  return (
    <div className="app-wrapper">
      {/* Brand Header & Navigation Bar */}
      <header className="navbar">
        <div className="nav-logo" onClick={() => setCurrentView('portal')}>
          <Building className="logo-icon" />
          <span className="logo-text-primary">24K</span>
          <span className="logo-text-secondary">Realtors Pune</span>
        </div>
        
        <nav className="nav-links">
          <button 
            onClick={() => setCurrentView('portal')} 
            className={`nav-btn ${currentView === 'portal' ? 'active' : ''}`}
          >
            <Home size={16} />
            Properties Portal
          </button>
          <button 
            onClick={() => setCurrentView('dashboard')} 
            className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
          >
            <ShieldCheck size={16} />
            CRM Admin Dashboard
          </button>
        </nav>
      </header>

      {/* Main Core View Area */}
      <main className="main-content">
        {currentView === 'portal' ? <Portal /> : <Dashboard />}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2026 24K Realtors Pune. All rights reserved.</p>
          <p className="footer-tagline">Premium residential and commercial properties in Hinjewadi, Wakad, Baner, Balewadi, and Tathawade.</p>
        </div>
      </footer>
    </div>
  );
}
