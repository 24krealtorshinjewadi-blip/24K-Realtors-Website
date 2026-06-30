import React from 'react';
import { Phone, Calendar } from 'lucide-react';
import ThemeSelector from '../components/ThemeSelector';

export default function PortalNavbar({ isHnwiMode, setIsHnwiMode, onViewChange, onBookVisitClick }) {
  return (
    <nav className="luxury-navbar scrolled">
      <div className="nav-container">
        <a href="#" className="nav-logo">
          <span className="logo-number">24K REALTORS</span>
          <span className="logo-city-tagline">PUNE • PREMIUM ADVISORY</span>
        </a>

        {/* HNWI Portfolio Mode Selector Desk */}
        <div className="hnwi-mode-desk">
          <span className={!isHnwiMode ? 'active-label' : ''} onClick={() => setIsHnwiMode(false)}>Residential</span>
          <div className={`hnwi-pill-switch ${isHnwiMode ? 'active' : ''}`} onClick={() => setIsHnwiMode(!isHnwiMode)}>
            <div className="hnwi-pill-knob"></div>
          </div>
          <span className={isHnwiMode ? 'active-hnwi' : ''} onClick={() => setIsHnwiMode(true)}>Private Office (HNWI)</span>
        </div>
        
        <div className="nav-links">
          <a href="#philosophy">OVERVIEW</a>
          <a href="#corridors">WHY 24K</a>
          <a href="#listings-anchor">{isHnwiMode ? 'PORTFOLIOS' : 'PRICE LIST'}</a>
          <a href="#listings-anchor">FLOOR PLANS</a>
          <a href="#testimonials">CLIENTS</a>
          <button 
            onClick={() => onViewChange && onViewChange('dashboard')} 
            className="nav-dashboard-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
          >
            CRM
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Phone Number Pill Button */}
          <a href="tel:+919673000053" className="nav-pill-phone">
            <Phone size={13} />
            <span>+91 96730 00053</span>
          </a>
          
          {/* WhatsApp Pill Button */}
          <a href="https://wa.me/919673000053" target="_blank" rel="noopener noreferrer" className="nav-pill-whatsapp">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
              <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.233-1.371c1.394.756 2.96 1.157 4.777 1.158h.005c5.502 0 9.987-4.476 9.988-9.986C22 7.478 17.517 2 12.012 2zm5.787 14.404c-.24.675-1.397 1.285-1.92 1.36-.474.07-1.088.13-3.18-.737-2.677-1.11-4.4-3.837-4.536-4.015-.132-.178-1.08-1.433-1.08-2.73 0-1.298.68-1.936.92-2.199.243-.263.53-.328.706-.328.176 0 .353.003.507.01.162.007.382-.062.597.45.22.524.75 1.83.816 1.964.066.13.11.286.022.463-.087.177-.13.287-.26.439-.13.15-.27.337-.385.45-.126.126-.259.263-.11.517.15.253.66.1.91 1.488.75 1.309 1.37 2.14 2.15 2.65.783.51 1.237.585 1.58.204.34-.38 1.484-1.72 1.88-2.31.398-.59.794-.49 1.346-.29.553.2.3.5 1.764 1.226.22.11.365.163.475.328.11.165.11.954-.13 1.63z"/>
            </svg>
            <span>WhatsApp</span>
          </a>

          {/* Book Visit Pill Button */}
          <button 
            onClick={onBookVisitClick} 
            className="nav-pill-book"
          >
            <Calendar size={13} />
            <span>BOOK VISIT</span>
          </button>

          {/* Circular Theme Selector */}
          <ThemeSelector />
        </div>
      </div>
    </nav>
  );
}
