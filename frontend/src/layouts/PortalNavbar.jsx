import React, { useState } from 'react';
import { 
  Phone, Calendar, Menu, X, ArrowRight, ShieldCheck, 
  UserCheck, LayoutDashboard, FileText, Compass 
} from 'lucide-react';
import ThemeSelector from '../components/ThemeSelector';

export default function PortalNavbar({ isHnwiMode, setIsHnwiMode, onViewChange, onBookVisitClick }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
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
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Phone Number Pill Button */}
            <a href="tel:+919673000053" className="nav-pill-phone">
              <Phone size={13} />
              <span>+91 96730 00053</span>
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

            {/* Hamburger Menu Button */}
            <button 
              onClick={() => setIsDrawerOpen(true)} 
              className="btn-hamburger-menu"
              title="Open Navigation Menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Sliding Navigation Drawer Backdrop */}
      <div 
        className={`nav-drawer-overlay ${isDrawerOpen ? 'open' : ''}`} 
        onClick={() => setIsDrawerOpen(false)} 
      />

      {/* Sliding Navigation Drawer Panel */}
      <div className={`nav-drawer-panel ${isDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-close-row">
          <span className="drawer-logo-text">24K REALTORS</span>
          <button onClick={() => setIsDrawerOpen(false)} className="btn-drawer-close">
            <X size={18} />
          </button>
        </div>

        <div className="drawer-links-section">
          <div className="drawer-section-title">⚜️ CLIENT PORTAL ACCESS</div>
          
          <button 
            onClick={() => { setIsDrawerOpen(false); onViewChange && onViewChange('dashboard'); }} 
            className="drawer-item-link"
            style={{ width: '100%', border: 'none', background: 'rgba(255, 255, 255, 0.02)' }}
          >
            <LayoutDashboard size={18} color="#d4af37" />
            <div className="drawer-item-text">
              <strong>CRM Operator Console</strong>
              <span>Lead routing & properties inventory panel</span>
            </div>
            <ArrowRight size={14} className="arrow-icon" />
          </button>

          <button 
            onClick={() => { setIsDrawerOpen(false); onBookVisitClick && onBookVisitClick(); }} 
            className="drawer-item-link"
            style={{ width: '100%', border: 'none', background: 'rgba(255, 255, 255, 0.02)' }}
          >
            <Calendar size={18} color="#d4af37" />
            <div className="drawer-item-text">
              <strong>VIP Chauffeur Visit</strong>
              <span>Book luxurious site pick-up and drop</span>
            </div>
            <ArrowRight size={14} className="arrow-icon" />
          </button>

          <div className="drawer-section-title">📄 SELLER DESK SERVICES</div>
          
          <a href="#seller-mandate-anchor" onClick={() => setIsDrawerOpen(false)} className="drawer-item-link">
            <FileText size={18} color="#d4af37" />
            <div className="drawer-item-text">
              <strong>Seller Advisory Mandate</strong>
              <span>List property under 24K premium consulting</span>
            </div>
            <ArrowRight size={14} className="arrow-icon" />
          </a>

          <a href="#corridors" onClick={() => setIsDrawerOpen(false)} className="drawer-item-link">
            <Compass size={18} color="#d4af37" />
            <div className="drawer-item-text">
              <strong>Pune Corridor Valuation</strong>
              <span>View Wakad, Baner & Hinjewadi Price Indices</span>
            </div>
            <ArrowRight size={14} className="arrow-icon" />
          </a>

          <div className="drawer-section-title">🏛️ COMPLIANCE & SAFETY</div>
          
          <a href="#rera-compliance" onClick={() => setIsDrawerOpen(false)} className="drawer-item-link">
            <ShieldCheck size={18} color="#2ec4b6" />
            <div className="drawer-item-text">
              <strong>MahaRERA Certifications</strong>
              <span>Verified registration numbers lookup</span>
            </div>
            <ArrowRight size={14} className="arrow-icon" />
          </a>

          <a href="#testimonials" onClick={() => setIsDrawerOpen(false)} className="drawer-item-link">
            <UserCheck size={18} color="#2ec4b6" />
            <div className="drawer-item-text">
              <strong>Advisory Team Directory</strong>
              <span>Meet active relationship managers</span>
            </div>
            <ArrowRight size={14} className="arrow-icon" />
          </a>
        </div>

        <div className="drawer-footer-branding">
          <span>24K Realtors Pune © 2026</span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>The Gold Standard of Advisory</span>
        </div>
      </div>
    </>
  );
}
