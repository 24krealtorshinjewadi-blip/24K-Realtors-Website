import React, { useState } from 'react';
import { 
  Phone, Calendar, Menu, X, ArrowRight, ShieldCheck, 
  UserCheck, LayoutDashboard, FileText, Compass, Info, Award, Eye, Building
} from 'lucide-react';
import ThemeSelector from '../components/ThemeSelector';

export default function PortalNavbar({ 
  isHnwiMode, 
  setIsHnwiMode, 
  onViewChange, 
  onBookVisitClick, 
  exclusiveTab, 
  onTabChange,
  activeSection,
  onSectionChange
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`luxury-navbar ${scrolled ? 'scrolled-active' : ''}`}>
        <div className="nav-container">
          <a href="#" onClick={(e) => { e.preventDefault(); onSectionChange && onSectionChange('listings'); }} className="nav-logo">
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

          {/* Desktop Navigation Links */}
          <div className="nav-transaction-tabs" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button 
              className={activeSection === 'listings' && exclusiveTab === 'BUY' ? 'active' : ''} 
              onClick={() => {
                onSectionChange && onSectionChange('listings');
                onTabChange && onTabChange('BUY');
              }}
            >
              BUY
            </button>
            <button 
              className={activeSection === 'listings' && exclusiveTab === 'RENT' ? 'active' : ''} 
              onClick={() => {
                onSectionChange && onSectionChange('listings');
                onTabChange && onTabChange('RENT');
              }}
            >
              RENT
            </button>
            <button 
              className={activeSection === 'listings' && exclusiveTab === 'SELL' ? 'active' : ''} 
              onClick={() => {
                onSectionChange && onSectionChange('listings');
                onTabChange && onTabChange('SELL');
              }}
            >
              SELL
            </button>

            <span style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.15)', margin: '0 4px' }}></span>

            <button 
              className={activeSection === 'societies' ? 'active' : ''} 
              onClick={() => onSectionChange && onSectionChange('societies')}
            >
              SOCIETIES
            </button>
            <button 
              className={activeSection === 'builders' ? 'active' : ''} 
              onClick={() => onSectionChange && onSectionChange('builders')}
            >
              BUILDERS
            </button>
            <button 
              className={activeSection === 'localities' ? 'active' : ''} 
              onClick={() => onSectionChange && onSectionChange('localities')}
            >
              LOCALITIES
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Book Visit CTA Button */}
            <button 
              onClick={onBookVisitClick} 
              className="nav-pill-book"
            >
              <Calendar size={13} />
              <span>BOOK VISIT</span>
            </button>

            {/* Circular Theme Selector */}
            <ThemeSelector />

            {/* Hamburger Menu Toggle Button */}
            <button 
              onClick={() => setIsDrawerOpen(true)} 
              className="btn-hamburger-menu"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
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
          <span className="drawer-logo-text">24K MENU TERMINAL</span>
          <button onClick={() => setIsDrawerOpen(false)} className="btn-drawer-close">
            <X size={18} />
          </button>
        </div>

        <div className="drawer-links-section">
          
          <div className="drawer-section-title">⚜️ PRIVATE CLIENT ACCESS</div>
          
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

          <a href="tel:+919673000053" className="drawer-item-link" style={{ textDecoration: 'none' }}>
            <Phone size={18} color="#2ec4b6" />
            <div className="drawer-item-text">
              <strong>Call Director Helpline</strong>
              <span>+91 96730 00053 (Direct Advisory Line)</span>
            </div>
            <ArrowRight size={14} className="arrow-icon" />
          </a>

          <div className="drawer-section-title">🏢 EXPLORE PORTFOLIOS</div>
          
          <button 
            onClick={() => { setIsDrawerOpen(false); onSectionChange && onSectionChange('listings'); }} 
            className="drawer-item-link"
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
          >
            <Compass size={18} color="#d4af37" />
            <div className="drawer-item-text">
              <strong>Premium Price Lists</strong>
              <span>Browse Wakad, Baner & Hinjewadi properties</span>
            </div>
            <ArrowRight size={14} className="arrow-icon" />
          </button>

          <button 
            onClick={() => { setIsDrawerOpen(false); onSectionChange && onSectionChange('societies'); }} 
            className="drawer-item-link"
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
          >
            <Building size={18} color="#d4af37" />
            <div className="drawer-item-text">
              <strong>Browse Societies</strong>
              <span>Check 24K Opula, Altura, township lists</span>
            </div>
            <ArrowRight size={14} className="arrow-icon" />
          </button>

          <button 
            onClick={() => { setIsDrawerOpen(false); onSectionChange && onSectionChange('builders'); }} 
            className="drawer-item-link"
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
          >
            <Award size={18} color="#d4af37" />
            <div className="drawer-item-text">
              <strong>Premium Builders</strong>
              <span>Kolte Patil, Gera developments directory</span>
            </div>
            <ArrowRight size={14} className="arrow-icon" />
          </button>

          <button 
            onClick={() => { setIsDrawerOpen(false); onSectionChange && onSectionChange('localities'); }} 
            className="drawer-item-link"
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
          >
            <Info size={18} color="#d4af37" />
            <div className="drawer-item-text">
              <strong>Locality Guides</strong>
              <span>Hinjewadi, Baner, Wakad connectivity index</span>
            </div>
            <ArrowRight size={14} className="arrow-icon" />
          </button>

          <div className="drawer-section-title">📄 SELLER DESK SERVICES</div>
          
          <a href="#seller-mandate-anchor" onClick={() => setIsDrawerOpen(false)} className="drawer-item-link">
            <FileText size={18} color="#d4af37" />
            <div className="drawer-item-text">
              <strong>Seller Advisory Mandate</strong>
              <span>List your flat directly with 24K advisory desk</span>
            </div>
            <ArrowRight size={14} className="arrow-icon" />
          </a>

          <div className="drawer-section-title">🏛️ TRUST & COMPLIANCE</div>
          
          <a href="#rera-compliance" onClick={() => setIsDrawerOpen(false)} className="drawer-item-link">
            <ShieldCheck size={18} color="#2ec4b6" />
            <div className="drawer-item-text">
              <strong>MahaRERA Certifications</strong>
              <span>Verify active project registration numbers</span>
            </div>
            <ArrowRight size={14} className="arrow-icon" />
          </a>

          <a href="#testimonials" onClick={() => setIsDrawerOpen(false)} className="drawer-item-link">
            <UserCheck size={18} color="#2ec4b6" />
            <div className="drawer-item-text">
              <strong>Client Testimonials</strong>
              <span>Read genuine feedback from active buyers</span>
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
