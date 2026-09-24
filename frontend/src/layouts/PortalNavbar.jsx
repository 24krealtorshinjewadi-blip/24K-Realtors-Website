import React, { useState } from 'react';
import { 
  Phone, Calendar, Menu, X, ArrowRight, ShieldCheck, 
  UserCheck, LayoutDashboard, FileText, Compass, Info, Award, Building, Building2,
  Home, Search, Heart, ChevronDown, TrendingUp, Sparkles, BookOpen
} from 'lucide-react';

import CompanyLogo from '../components/CompanyLogo';
import CompanyDeskModal from '../components/CompanyDeskModal';

export default function PortalNavbar({ 
  isHnwiMode, 
  setIsHnwiMode, 
  onViewChange, 
  onBookVisitClick, 
  onOpenSpotlight,
  exclusiveTab, 
  onTabChange: _onTabChange,
  activeSection,
  onSectionChange,
  onApplyMegaFilter,
  onHomeClick,
  onSearchClick,
  onSavedClick,
  activeCollection,
  selectedPropertyDetail,
  filters,
  activeSubView
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAtListings, setIsAtListings] = useState(false);
  const [deskModalTab, setDeskModalTab] = useState(null);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Check if scroll has passed the hero section to highlight listings
      const listingsEl = document.getElementById('listings-container');
      if (listingsEl) {
        const rect = listingsEl.getBoundingClientRect();
        if (rect.top <= 100) {
          setIsAtListings(true);
        } else {
          setIsAtListings(false);
        }
      } else {
        setIsAtListings(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isSavedActive = !selectedPropertyDetail && activeCollection === 'WISHLIST';
  const isHomeActive = !selectedPropertyDetail && !isSavedActive && !isAtListings && activeSection === 'listings';
  const isSearchActive = !selectedPropertyDetail && !isSavedActive && (isAtListings || activeCollection !== 'ALL') && activeSection === 'listings';


  return (
    <>
      <nav
        className={`luxury-navbar ${scrolled ? 'scrolled-active' : ''}`}
        aria-label="Main navigation"
        role="navigation"
      >
        <div className="nav-container">
          <a href="#" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({}, 'listings', null, null); }} className="nav-logo">
            <CompanyLogo variant="compact" />
          </a>

          {/* HNWI Portfolio Mode Selector Desk */}
          <div className="hnwi-mode-desk" role="group" aria-label="Portfolio mode selector">
            <button
              className={`hnwi-label-btn ${!isHnwiMode ? 'active-label' : ''}`}
              onClick={() => setIsHnwiMode(false)}
              aria-pressed={!isHnwiMode}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, color: !isHnwiMode ? 'var(--text-light)' : 'var(--text-muted)', transition: 'color 0.2s', padding: '2px 4px', borderRadius: '4px', fontFamily: 'var(--font-sans)' }}
            >
              Residential
            </button>
            <div
              className={`hnwi-pill-switch ${isHnwiMode ? 'active' : ''}`}
              role="switch"
              aria-checked={isHnwiMode}
              aria-label="Toggle between Residential and HNWI Private Office mode"
              tabIndex={0}
              onClick={() => setIsHnwiMode(!isHnwiMode)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsHnwiMode(!isHnwiMode);
                }
              }}
            >
              <div className="hnwi-pill-knob" aria-hidden="true"></div>
            </div>
            <button
              className={`hnwi-label-btn ${isHnwiMode ? 'active-hnwi' : ''}`}
              onClick={() => setIsHnwiMode(true)}
              aria-pressed={isHnwiMode}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, color: isHnwiMode ? 'var(--gold-primary)' : 'var(--text-muted)', transition: 'color 0.2s', padding: '2px 4px', borderRadius: '4px', fontFamily: 'var(--font-sans)' }}
            >
              Private Office (HNWI)
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="nav-transaction-tabs" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div className="nav-dropdown-item-wrapper">
              <button 
                className={`nav-dropdown-trigger-btn ${activeSection === 'listings' && exclusiveTab === 'BUY' ? 'active' : ''}`} 
                onClick={(e) => {
                  e.preventDefault();
                  onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'BUY' }, 'listings', null, 'properties-sale');
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <span>BUY</span>
                <ChevronDown size={11} style={{ opacity: 0.8 }} />
              </button>
              <div className="mega-dropdown-menu mega-menu-buy">
                <div className="mega-menu-grid">
                  <div className="mega-menu-column">
                    <h5 className="mega-menu-title" style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'BUY', status: 'AVAILABLE' }, 'listings', null, 'properties-sale'); }}>Properties for Sale</h5>
                    <a href="#listings-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'BUY', status: 'AVAILABLE' }, 'listings', null, 'properties-sale'); }}>Active Listings</a>
                    <a href="#listings-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'BUY', query: 'verified' }, 'listings', null, 'verified-flats'); }}>100% Verified Flats</a>
                    <a href="#maharera-trust-banner" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({}, 'listings', null, 'maharera-directory'); }}>Approved</a>
                    <a href="#listings-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'BUY', query: 'exclusive' }, 'listings', null, 'exclusive-deals'); }}>Exclusive Agency Deals</a>
                  </div>
                  <div className="mega-menu-column">
                    <h5 className="mega-menu-title" style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({}, 'localities', null, 'locality-guides'); }}>Location</h5>
                    <a href="#listings-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'BUY', location: 'HINJEWADI_PHASE_1' }, 'listings', null, 'properties-sale'); }}>Hinjewadi Phase 1</a>
                    <a href="#listings-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'BUY', location: 'HINJEWADI_PHASE_2' }, 'listings', null, 'properties-sale'); }}>Hinjewadi Phase 2</a>
                    <a href="#listings-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'BUY', location: 'HINJEWADI_PHASE_3' }, 'listings', null, 'properties-sale'); }}>Hinjewadi Phase 3</a>
                    <a href="#listings-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'BUY', location: 'MAHALUNGE' }, 'listings', null, 'properties-sale'); }}>Mahalunge</a>
                    <a href="#listings-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'BUY', location: 'BALEWADI' }, 'listings', null, 'properties-sale'); }}>Balewadi</a>
                    <a href="#listings-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'BUY', location: 'KHARADI' }, 'listings', null, 'properties-sale'); }}>Kharadi</a>
                    <a href="#listings-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'BUY', location: 'RAVET' }, 'listings', null, 'properties-sale'); }}>Ravet</a>
                    <a href="#listings-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'BUY', location: 'PUNEWALE' }, 'listings', null, 'properties-sale'); }}>Punewale</a>
                    <a href="#listings-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'BUY', location: 'WAKAD' }, 'listings', null, 'properties-sale'); }}>Wakad</a>
                    <a href="#listings-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'BUY', location: 'BANER' }, 'listings', null, 'properties-sale'); }}>Baner</a>
                  </div>
                  <div className="mega-menu-column">
                    <h5 className="mega-menu-title" style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({}, 'builders', null, 'developer-portfolios'); }}>Top Builder</h5>
                    <a href="#builders-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'BUY', builder: 'Lodha' }, 'listings', null, 'developer-portfolios'); }}>Lodha</a>
                    <a href="#builders-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'BUY', builder: 'Godrej' }, 'listings', null, 'developer-portfolios'); }}>Godrej</a>
                    <a href="#builders-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'BUY', builder: 'Shapoorji' }, 'listings', null, 'developer-portfolios'); }}>Shapoorji</a>
                    <a href="#builders-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'BUY', builder: 'Kasturi' }, 'listings', null, 'developer-portfolios'); }}>Kasturi</a>
                    <a href="#builders-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'BUY', builder: 'Kohinoor' }, 'listings', null, 'developer-portfolios'); }}>Kohinoor</a>
                    <a href="#builders-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'BUY', builder: 'VTP' }, 'listings', null, 'developer-portfolios'); }}>VTP</a>
                    <a href="#builders-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'BUY', builder: 'Gera' }, 'listings', null, 'developer-portfolios'); }}>Gera</a>
                    <a href="#builders-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({}, 'builders', null, 'developer-portfolios'); }}>Many More</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="nav-dropdown-item-wrapper">
              <button 
                className={`nav-dropdown-trigger-btn ${activeSection === 'listings' && exclusiveTab === 'RENT' ? 'active' : ''}`} 
                onClick={(e) => {
                  e.preventDefault();
                  onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'RENT' }, 'listings', null, 'properties-rent');
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <span>RENT/LEASE</span>
                <ChevronDown size={11} style={{ opacity: 0.8 }} />
              </button>
              <div className="mega-dropdown-menu mega-menu-rent">
                <div className="mega-menu-grid">
                  <div className="mega-menu-column">
                    <h5 className="mega-menu-title" style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'RENT', status: 'AVAILABLE' }, 'listings', null, 'properties-rent'); }}>Apartments for Rent</h5>
                    <a href="#listings-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'RENT', status: 'AVAILABLE' }, 'listings', null, 'properties-rent'); }}>Premium Rented Flats</a>
                    <a href="#listings-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'RENT', furnishingStatus: 'SEMI_FURNISHED' }, 'listings', null, 'properties-rent'); }}>Semi-Furnished Flat</a>
                    <a href="#listings-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'RENT', furnishingStatus: 'FULLY_FURNISHED' }, 'listings', null, 'properties-rent'); }}>Fully Furnished Flat</a>
                  </div>
                  <div className="mega-menu-column">
                    <h5 className="mega-menu-title" style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'RENT' }, 'listings', null, 'properties-rent'); }}>Renter Tools</h5>
                    <a href="#listings-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'RENT', propertyType: 'RESIDENTIAL' }, 'listings', null, 'properties-rent'); }}>Verified Residential Properties</a>
                    <a href="#listings-anchor" onClick={(e) => { e.preventDefault(); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'RENT', propertyType: 'COMMERCIAL' }, 'listings', null, 'properties-rent'); }}>Verified Commercial Properties</a>
                  </div>
                  <div className="mega-menu-column">
                    <h5 className="mega-menu-title" style={{ cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); onViewChange && onViewChange('list-property'); }}>Landlord Tools</h5>
                    <a href="#seller-mandate-anchor" onClick={(e) => { e.preventDefault(); onViewChange && onViewChange('list-property'); }}>Owner Zone</a>
                    <a href="#seller-mandate-anchor" onClick={(e) => { e.preventDefault(); onViewChange && onViewChange('list-property'); }}>List Your Rental Flat</a>
                    <a href="#terms-modal" onClick={(e) => { e.preventDefault(); setDeskModalTab('terms'); }}>Terms &amp; Conditions</a>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onViewChange && onViewChange('list-property')}
              className={`nav-dropdown-trigger-btn ${activeSection === 'list-property' ? 'active' : ''}`}
              style={{ display: 'inline-flex', alignItems: 'center' }}
            >
              <span>SELL/RENT</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Spotlight Search removed from nav — available in hero section */}

            {/* Contact Phone Number Pill */}
            <a href="tel:+919673000053" className="nav-phone-pill" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '30px',
              border: '1px solid rgba(230, 195, 92, 0.3)',
              background: 'rgba(255,255,255,0.02)',
              color: '#FFF4D0',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
              transition: 'all 0.3s ease'
            }}>
              <Phone size={13} style={{ color: '#E6C35C' }} />
              <span>+91 96730 00053</span>
            </a>


            {/* Book Site Visit CTA Button (Desktop Only Header) */}
            <button 
              onClick={onBookVisitClick} 
              className="nav-pill-book desktop-only-enquire"
              style={{
                background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)',
                border: 'none',
                color: '#040814',
                padding: '10px 20px',
                borderRadius: '30px',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(230, 195, 92, 0.2)'
              }}
            >
              <Calendar size={13} />
              <span>ENQUIRE NOW</span>
            </button>


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
          <span className="drawer-logo-text">⚜️ 24K REALTORS</span>
          <button onClick={() => setIsDrawerOpen(false)} className="btn-drawer-close">
            <X size={18} />
          </button>
        </div>

        <div className="drawer-links-section">
          
          {/* Direct CRM Staff & Admin Login CTA for Mobile */}
          <button 
            onClick={() => { setIsDrawerOpen(false); onViewChange && onViewChange('login'); }} 
            className="drawer-enquire-btn"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #162438 0%, #0F1C2E 100%)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              color: '#F3E5AB',
              padding: '13px 20px',
              borderRadius: '12px',
              fontSize: '0.86rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(212, 175, 55, 0.15)',
              marginBottom: '12px'
            }}
          >
            <LayoutDashboard size={17} color="#D4AF37" />
            <span>💼 CRM STAFF &amp; ADMIN PORTAL LOGIN</span>
          </button>

          {/* Prominent Golden Enquire CTA inside Mobile Menu Drawer */}
          <button 
            onClick={() => { setIsDrawerOpen(false); onBookVisitClick && onBookVisitClick(); }} 
            className="drawer-enquire-btn"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)',
              border: 'none',
              color: '#040814',
              padding: '14px 20px',
              borderRadius: '12px',
              fontSize: '0.86rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(230, 195, 92, 0.3)',
              marginBottom: '20px'
            }}
          >
            <Calendar size={16} />
            <span>ENQUIRE NOW / BOOK SITE VISIT</span>
          </button>

          <div className="drawer-section-title">🔍 QUICK SEARCH &amp; ASSIST</div>

          <button 
            onClick={() => { setIsDrawerOpen(false); onOpenSpotlight && onOpenSpotlight(); }} 
            className="drawer-item-link"
            style={{ width: '100%', border: 'none', background: 'rgba(230, 195, 92, 0.08)', textAlign: 'left' }}
          >
            <Search size={18} color="#E6C35C" />
            <div className="drawer-item-text">
              <strong style={{ color: '#E6C35C' }}>Search Properties</strong>
              <span>Search by locality, BHK, builder or price</span>
            </div>
            <ArrowRight size={14} className="arrow-icon" color="#E6C35C" />
          </button>

          <a href="tel:+919673000053" className="drawer-item-link" style={{ textDecoration: 'none', background: 'rgba(46, 196, 182, 0.08)' }}>
            <Phone size={18} color="#2ec4b6" />
            <div className="drawer-item-text">
              <strong style={{ color: '#2ec4b6' }}>Call Advisory Line</strong>
              <span>+91 96730 00053 (Direct Assistance)</span>
            </div>
            <ArrowRight size={14} className="arrow-icon" color="#2ec4b6" />
          </a>

          <button 
            onClick={() => { setIsDrawerOpen(false); onBookVisitClick && onBookVisitClick(); }} 
            className="drawer-item-link"
            style={{ width: '100%', border: 'none', background: 'rgba(255, 255, 255, 0.02)', textAlign: 'left' }}
          >
            <Calendar size={18} color="#d4af37" />
            <div className="drawer-item-text">
              <strong>Schedule Site Visit</strong>
              <span>Request pricing &amp; tour booking</span>
            </div>
            <ArrowRight size={14} className="arrow-icon" />
          </button>


          <button 
            onClick={() => { setIsDrawerOpen(false); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'BUY' }, 'listings', null, 'properties-sale'); }} 
            className="drawer-item-link"
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
          >
            <Home size={18} color="#d4af37" />
            <div className="drawer-item-text">
              <strong>Buy a Property</strong>
              <span>Browse verified residences in Pune West</span>
            </div>
            <ArrowRight size={14} className="arrow-icon" />
          </button>

          <button 
            onClick={() => { setIsDrawerOpen(false); onApplyMegaFilter && onApplyMegaFilter({ transactionType: 'RENT' }, 'listings', null, 'properties-rent'); }} 
            className="drawer-item-link"
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
          >
            <Compass size={18} color="#d4af37" />
            <div className="drawer-item-text">
              <strong>Rent a Property</strong>
              <span>Premium furnished &amp; unfurnished rentals</span>
            </div>
            <ArrowRight size={14} className="arrow-icon" />
          </button>

          <button 
            onClick={() => { setIsDrawerOpen(false); onApplyMegaFilter && onApplyMegaFilter({ propertyType: 'COMMERCIAL' }, 'listings', null, 'properties-sale'); }} 
            className="drawer-item-link"
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
          >
            <Building size={18} color="#d4af37" />
            <div className="drawer-item-text">
              <strong>Commercial Spaces</strong>
              <span>Office, retail &amp; investment assets</span>
            </div>
            <ArrowRight size={14} className="arrow-icon" />
          </button>

          <button 
            onClick={() => { setIsDrawerOpen(false); onApplyMegaFilter && onApplyMegaFilter({}, 'listings', null, 'market-intelligence'); }} 
            className="drawer-item-link"
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
          >
            <TrendingUp size={18} color="#2ec4b6" />
            <div className="drawer-item-text">
              <strong>Market Trends &amp; Analytics</strong>
              <span>Price growth, capital appreciation &amp; area telemetry</span>
            </div>
            <ArrowRight size={14} className="arrow-icon" />
          </button>

          <div className="drawer-section-title">📄 ADVISORY SERVICES</div>
          
          <button 
            onClick={() => { setIsDrawerOpen(false); onViewChange && onViewChange('list-property'); }} 
            className="drawer-item-link"
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
          >
            <FileText size={18} color="#d4af37" />
            <div className="drawer-item-text">
              <strong>Sell / Rent Your Property</strong>
              <span>List directly on our premium owner desk</span>
            </div>
            <ArrowRight size={14} className="arrow-icon" />
          </button>

          <button 
            onClick={() => { 
              setIsDrawerOpen(false); 
              if (onViewChange) onViewChange('blog');
              else window.location.hash = 'blog';
            }} 
            className="drawer-item-link"
            style={{ width: '100%', border: 'none', background: 'rgba(212, 175, 55, 0.08)', textAlign: 'left', cursor: 'pointer' }}
          >
            <BookOpen size={18} color="#D4AF37" />
            <div className="drawer-item-text">
              <strong style={{ color: '#F3E5AB' }}>Real Estate Insights Blog</strong>
              <span>Guides, RERA checklists, EMI &amp; market trends</span>
            </div>
            <ArrowRight size={14} className="arrow-icon" color="#D4AF37" />
          </button>

          <a href="#rera-compliance" onClick={() => setIsDrawerOpen(false)} className="drawer-item-link">
            <ShieldCheck size={18} color="#2ec4b6" />
            <div className="drawer-item-text">
              <strong>MahaRERA Verified</strong>
              <span>Check active project registration numbers</span>
            </div>
            <ArrowRight size={14} className="arrow-icon" />
          </a>

        </div>
        <div className="drawer-footer-branding">
          <span>24K Realtors Pune © 2026</span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>The Gold Standard of Advisory</span>
        </div>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="mobile-bottom-tab-bar" role="navigation" aria-label="Mobile navigation bar">
        <button 
          onClick={onHomeClick}
          className={`mobile-tab-item ${isHomeActive ? 'active' : ''}`}
          aria-label="Home"
        >
          <Home size={18} />
          <span>Home</span>
        </button>

        <button 
          onClick={onSearchClick}
          className={`mobile-tab-item ${isSearchActive ? 'active' : ''}`}
          aria-label="Search Listings"
        >
          <Search size={18} />
          <span>Search</span>
        </button>

        <button 
          onClick={onSavedClick}
          className={`mobile-tab-item ${isSavedActive ? 'active' : ''}`}
          aria-label="Saved Portfolio"
        >
          <Heart size={18} />
          <span>Saved</span>
        </button>

        <button 
          onClick={() => onViewChange && onViewChange('login')}
          className="mobile-tab-item"
          aria-label="CRM Staff Login"
          style={{ color: '#D4AF37' }}
        >
          <LayoutDashboard size={18} color="#D4AF37" />
          <span style={{ color: '#D4AF37', fontWeight: 700 }}>CRM</span>
        </button>

        <button 
          onClick={onBookVisitClick}
          className="mobile-tab-item"
          aria-label="Contact Advisory"
        >
          <Phone size={18} />
          <span>Contact</span>
        </button>
      </div>

      <CompanyDeskModal 
        isOpen={Boolean(deskModalTab)} 
        onClose={() => setDeskModalTab(null)} 
        initialTab={deskModalTab || 'terms'} 
      />
    </>
  );
}
