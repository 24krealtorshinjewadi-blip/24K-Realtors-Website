import React from 'react';

// Custom reusable hover link component
const FooterLink = ({ href = '#', children }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <a 
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        color: hover ? 'var(--gold-primary)' : 'var(--text-muted)',
        fontSize: '0.82rem',
        textDecoration: 'none',
        transition: 'color 0.2s ease',
        cursor: 'pointer',
        display: 'block',
        padding: '4px 0'
      }}
    >
      {children}
    </a>
  );
};

// Reusable App Store / Play Store download badges
const AppButton = ({ store, name, subtitle }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: '#070f1e',
        border: hover ? '1px solid var(--gold-primary)' : '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '6px',
        padding: '8px 14px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        width: '150px',
        boxShadow: hover ? '0 0 10px rgba(212, 175, 55, 0.2)' : 'none',
        boxSizing: 'border-box'
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{ color: hover ? 'var(--gold-primary)' : '#fff', transition: 'color 0.3s ease', display: 'flex', alignItems: 'center' }}>
        {store === 'google' ? (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M3 5.277L14.77 17l4.35-4.35-4.35-4.35L3 5.277z M2 3.5v17l11.5-8.5L2 3.5zm19.262 7.738l-4.22-2.532-1.39 1.39 1.39 1.39 4.22-2.532c.32-.192.32-.712 0-.904z"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.55 2.95-1.39z"/>
          </svg>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', lineHeight: 1.1 }}>{subtitle}</span>
        <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 'bold', lineHeight: 1.1, marginTop: '2px' }}>{name}</span>
      </div>
    </div>
  );
};

export default function PortalFooter() {
  return (
    <footer 
      className="footer" 
      style={{ 
        borderTop: '1px solid rgba(212, 175, 55, 0.25)', 
        background: 'radial-gradient(circle at bottom, rgba(15, 23, 42, 0.98) 0%, rgba(7, 15, 30, 1) 100%)', 
        padding: '50px 30px 30px 30px', 
        marginTop: '60px',
        position: 'relative',
        zIndex: 2
      }}
    >
      <div 
        style={{ 
          maxWidth: '100%', 
          margin: '0 auto', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '40px',
          paddingBottom: '40px',
          paddingLeft: '5%',
          paddingRight: '5%',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        {/* Column 1: Brand Directory */}
        <div>
          <h4 style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-title)', fontSize: '0.95rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '16px' }}>
            24K Realtors
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <FooterLink>Mobile App Portal</FooterLink>
            <FooterLink>Our Advisory Services</FooterLink>
            <FooterLink>Pune Price Trends Index</FooterLink>
            <FooterLink>Post Your Mandate (Sell/Rent)</FooterLink>
            <FooterLink>Real Estate Asset Valuation</FooterLink>
            <FooterLink>Area Converter Tool</FooterLink>
            <FooterLink>Interactive Site Map</FooterLink>
          </div>
        </div>

        {/* Column 2: Corporate info */}
        <div>
          <h4 style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-title)', fontSize: '0.95rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Company Desk
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <FooterLink>About 24K Realtors</FooterLink>
            <FooterLink>Contact Locality Advisor</FooterLink>
            <FooterLink>Careers at 24K Group</FooterLink>
            <FooterLink>Terms & Conditions</FooterLink>
            <FooterLink>Privacy Policy Registry</FooterLink>
            <FooterLink>Grievance Redressal Officer</FooterLink>
            <FooterLink>Summons & Safety Guide</FooterLink>
          </div>
        </div>

        {/* Column 3: Partners Directory */}
        <div>
          <h4 style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-title)', fontSize: '0.95rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Developer Partners
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <FooterLink>VTP Realty Gated Clusters</FooterLink>
            <FooterLink>Kolte-Patil Integrated Townships</FooterLink>
            <FooterLink>Godrej Properties West</FooterLink>
            <FooterLink>Panchshil High-Yield Commercial</FooterLink>
            <FooterLink>Kasturi Ultra-Luxury Portfolios</FooterLink>
            <FooterLink>MahaRERA Compliance Guide</FooterLink>
            <FooterLink>Tier-1 Off-Market Registry</FooterLink>
          </div>
        </div>

        {/* Column 4: Contact & App Desk */}
        <div>
          <h4 style={{ color: 'var(--gold-primary)', fontFamily: 'var(--font-title)', fontSize: '0.95rem', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Contact Support
          </h4>
          <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>
            Toll Free - 1800 41 99099
          </p>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: '12px' }}>
            9:30 AM to 6:30 PM (Mon-Sun)
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block', marginBottom: '20px' }}>
            Email: <a href="mailto:contact@24krealestate.com" style={{ color: 'var(--gold-secondary)', textDecoration: 'none' }}>contact@24krealestate.com</a>
          </span>

          <h5 style={{ color: '#fff', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 12px 0' }}>
            Download the App
          </h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <AppButton store="google" name="Google Play" subtitle="Get it on" />
            <AppButton store="apple" name="App Store" subtitle="Download on the" />
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyrights & Trust */}
      <div 
        style={{ 
          maxWidth: '100%', 
          margin: '25px auto 0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '20px',
          paddingLeft: '5%',
          paddingRight: '5%',
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }}
      >
        <div style={{ flex: 1, minWidth: '280px' }}>
          <p style={{ margin: 0, lineHeight: 1.5 }}>
            All trademarks, logos, and developer registries are the property of their respective owners. 
            24K Realtors is an authorized location-advisory firm under MahaRERA license: <strong style={{ color: 'var(--gold-primary)' }}>A52100028461</strong>. 
            Pricing and layouts are subject to developer adjustments.
          </p>
        </div>
        <div style={{ textAlign: 'right', minWidth: '200px' }}>
          <p style={{ margin: 0 }}>
            © 2026 24K Realtors Pune. All rights reserved. 
            <br />
            A Naukri / Info Edge Associated Digital mandate.
          </p>
        </div>
      </div>
    </footer>
  );
}
