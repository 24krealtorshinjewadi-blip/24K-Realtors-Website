import React, { useState } from 'react';
import Portal from './components/Portal';
import Dashboard from './components/Dashboard';
import { Home, ShieldCheck, Building } from 'lucide-react';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('portal'); // portal | dashboard

  return (
    <div className="app-wrapper">
      {/* Main Core View Area */}
      <main className="main-content">
        {currentView === 'portal' ? (
          <Portal onViewChange={setCurrentView} />
        ) : (
          <Dashboard onViewChange={setCurrentView} />
        )}
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
