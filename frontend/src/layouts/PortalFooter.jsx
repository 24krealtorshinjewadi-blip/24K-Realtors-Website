import React, { useState } from 'react';
import CompanyDeskModal from '../components/CompanyDeskModal';
import CompanyLogo from '../components/CompanyLogo';

const FooterLink = ({ href = '#', children, external = false, onClick }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        color: hover ? '#E6C35C' : 'rgba(255, 255, 255, 0.82)',
        fontSize: '0.86rem',
        fontWeight: 500,
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        display: 'block',
        padding: '5px 0'
      }}
    >
      {children}
    </a>
  );
};

const AppButton = ({ store, name, subtitle, href }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <a href={href || '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '8px', background: '#070f1e',
          border: hover ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.12)',
          borderRadius: '6px', padding: '8px 14px', cursor: 'pointer', transition: 'all 0.3s ease',
          width: '150px', boxShadow: hover ? '0 0 10px rgba(212,175,55,0.2)' : 'none', boxSizing: 'border-box'
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div style={{ color: hover ? 'var(--gold-primary)' : '#fff', transition: 'color 0.3s ease', display: 'flex', alignItems: 'center' }}>
          {store === 'google' ? (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 5.277L14.77 17l4.35-4.35-4.35-4.35L3 5.277z M2 3.5v17l11.5-8.5L2 3.5zm19.262 7.738l-4.22-2.532-1.39 1.39 1.39 1.39 4.22-2.532c.32-.192.32-.712 0-.904z"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.55 2.95-1.39z"/></svg>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', lineHeight: 1.1 }}>{subtitle}</span>
          <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 'bold', lineHeight: 1.1, marginTop: '2px' }}>{name}</span>
        </div>
      </div>
    </a>
  );
};

export default function PortalFooter({ onViewChange }) {
  const [modalTab, setModalTab] = useState(null);

  const openTab = (tabId) => (e) => {
    e.preventDefault();
    setModalTab(tabId);
  };

  return (
    <footer className="footer" style={{ borderTop: '1px solid rgba(212,175,55,0.25)', background: 'radial-gradient(circle at bottom, rgba(15,23,42,0.98) 0%, rgba(7,15,30,1) 100%)', padding: '50px 30px 30px 30px', marginTop: '60px', position: 'relative', zIndex: 2 }}>
      <CompanyDeskModal isOpen={Boolean(modalTab)} onClose={() => setModalTab(null)} initialTab={modalTab || 'about'} />
      <div style={{ maxWidth: '100%', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', paddingBottom: '40px', paddingLeft: '5%', paddingRight: '5%', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Column 1: 24K Realtors */}
        <div>
          <div style={{ marginBottom: '14px' }}>
            <CompanyLogo variant="compact" width={180} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <FooterLink href="https://wa.me/919673000053?text=Hi%2C%20I%20want%20to%20explore%20properties%20via%2024K%20Realtors%20mobile%20channel" external>Mobile App Portal</FooterLink>
            <FooterLink href="https://wa.me/919673000053?text=I%20need%20advisory%20services%20for%20real%20estate%20in%20Pune" external>Our Advisory Services</FooterLink>
            <FooterLink href="https://www.99acres.com/real-estate-insights/pune/" external>Pune Price Trends Index</FooterLink>
            <FooterLink href="#list-property" onClick={e => { e.preventDefault(); if (onViewChange) onViewChange('list-property'); }}>Post Your Mandate (Sell/Rent)</FooterLink>
            <FooterLink href="https://www.magicbricks.com/propertyvalue" external>Real Estate Asset Valuation</FooterLink>
            <FooterLink href="https://www.unitconverters.net/area-converter.html" external>Area Converter Tool</FooterLink>
            <FooterLink href="https://maps.app.goo.gl/3gZ7F6YMXe1Y5Pfp7" external>Interactive Site Map</FooterLink>
          </div>
        </div>

        {/* Column 2: Company Desk */}
        <div>
          <h4 style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-title)', fontSize: '0.95rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '16px' }}>Company Desk</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <FooterLink href="#" onClick={openTab('about')}>About 24K Realtors</FooterLink>
            <FooterLink href="#" onClick={openTab('advisor')}>Contact Locality Advisor</FooterLink>
            <FooterLink href="#" onClick={openTab('careers')}>Careers at 24K Group</FooterLink>
            <FooterLink href="#" onClick={openTab('terms')}>Terms &amp; Conditions</FooterLink>
            <FooterLink href="#" onClick={openTab('privacy')}>Privacy Policy Registry</FooterLink>
            <FooterLink href="#" onClick={openTab('grievance')}>Grievance Redressal Officer</FooterLink>
            <FooterLink href="#" onClick={openTab('summons')}>Summons &amp; Safety Guide</FooterLink>
            <a href="#login" onClick={() => window.location.hash = 'login'} style={{ color: '#E6C35C', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 700, marginTop: '8px', display: 'inline-block' }}>
              ⚜️ Staff &amp; Agent Portal Login
            </a>
          </div>
        </div>

        {/* Column 3: Developer Partners */}
        <div>
          <h4 style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-title)', fontSize: '0.95rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '16px' }}>Developer Partners</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <FooterLink href="https://www.vtprealty.in" external>VTP Realty Gated Clusters</FooterLink>
            <FooterLink href="https://www.koltepatil.com" external>Kolte-Patil Integrated Townships</FooterLink>
            <FooterLink href="https://www.godrejproperties.com/pune" external>Godrej Properties West</FooterLink>
            <FooterLink href="https://www.panchshilrealty.com" external>Panchshil High-Yield Commercial</FooterLink>
            <FooterLink href="https://wa.me/919673000053?text=Tell%20me%20about%20Kasturi%20ultra-luxury%20portfolios" external>Kasturi Ultra-Luxury Portfolios</FooterLink>
            <FooterLink href="https://maharera.maharashtra.gov.in" external>MahaRERA Compliance Guide</FooterLink>
            <FooterLink href="https://wa.me/919673000053?text=I%20am%20interested%20in%20off-market%20property%20listings%20in%20Pune" external>Tier-1 Off-Market Registry</FooterLink>
          </div>
        </div>

        {/* Column 4: Contact Support */}
        <div>
          <h4 style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-title)', fontSize: '0.95rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '16px' }}>Contact Support</h4>
          <a href="tel:+919673000053" style={{ textDecoration: 'none' }}>
            <p style={{ margin: '0 0 2px 0', fontSize: '0.85rem', color: '#E6C35C', fontWeight: 700, cursor: 'pointer' }}>📞 +91 9673 000 053</p>
          </a>
          <a href="tel:18004199099" style={{ textDecoration: 'none' }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.72)', fontWeight: 500, cursor: 'pointer' }}>Toll Free · 1800 41 99099</p>
          </a>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>9:30 AM to 6:30 PM (Mon–Sun)</span>
          <a href="https://maps.app.goo.gl/3gZ7F6YMXe1Y5Pfp7" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '10px', lineHeight: 1.5, cursor: 'pointer' }}>📍 Office 19, Prem Mairah,<br/>Opp. VTP Bellissimo Maan Rd,<br/>Hinjewadi Phase 1, Pune 411057</span>
          </a>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block', marginBottom: '8px' }}>✉️ <a href="mailto:24krealtorspune@gmail.com" style={{ color: 'var(--gold-secondary)', textDecoration: 'none' }}>24krealtorspune@gmail.com</a></span>
          <a href="https://wa.me/919673000053?text=Hi%2C%20I%20am%20looking%20for%20property%20in%20Pune" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.35)', borderRadius: '6px', padding: '6px 12px', color: '#25D366', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.233-1.371a9.98 9.98 0 0 0 4.779 1.217h.005c5.502 0 9.987-4.476 9.988-9.986C22 7.478 17.517 2 12.012 2z"/></svg>
            WhatsApp Us Now
          </a>
        </div>
      </div>

      {/* 📱 App Store & Google Play Download Section (Centered Desktop & Mobile) */}
      <div style={{ maxWidth: '100%', margin: '36px auto 10px auto', padding: '24px 20px 0 20px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
        <h5 style={{ color: '#E6C35C', fontFamily: 'var(--font-title)', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px 0', textAlign: 'center' }}>Download 24K Realtors Mobile App</h5>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', flexWrap: 'wrap', margin: '0 auto' }}>
          <AppButton store="google" name="Google Play" subtitle="Get it on" href="https://play.google.com/store/search?q=real+estate+pune&c=apps" />
          <AppButton store="apple" name="App Store" subtitle="Download on the" href="https://apps.apple.com/in/charts/iphone/real-estate-apps/12012" />
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ maxWidth: '100%', margin: '25px auto 0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', paddingLeft: '5%', paddingRight: '5%', fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            All trademarks, logos, and developer registries are the property of their respective owners. 24K Realtors is an authorized location-advisory firm under MahaRERA license:{' '}
            <a href="https://maharera.maharashtra.gov.in/public/en-US/Agent/AgentView/A051262603190" target="_blank" rel="noopener noreferrer" style={{ color: '#E6C35C', fontWeight: 700, textDecoration: 'underline' }}>A051262603190</a>.
            Pricing and layouts are subject to developer adjustments.
          </p>
        </div>
        <div style={{ textAlign: 'right', minWidth: '200px' }}>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            © 2026 24K Realtors Pune. All rights reserved.<br/>
            <span style={{ color: 'rgba(255,255,255,0.65)' }}>A Naukri / Info Edge Associated Digital mandate.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
