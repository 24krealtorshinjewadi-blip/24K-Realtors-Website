import React, { useState, useEffect } from 'react';
import { 
  MapPin, ShieldCheck, Building2, TrendingUp, Train, School, 
  HeartPulse, Sparkles, ArrowLeft, ArrowUpRight, CheckCircle2, 
  Clock, ChevronRight, HelpCircle, Layers, Award, Laptop,
  MessageSquare, Phone, Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import { apiService } from '../services/apiService';
import { useSEO, buildLocationSEO } from '../services/seoService';
import SocietyCard from './SocietyCard';
import CompanyLogo from './CompanyLogo';
import './PropertyIntelligence.css';

const formatInr = (val) => {
  if (!val) return '₹65 Lakhs';
  if (typeof val === 'string') {
    const crMatch = val.match(/0\.(\d+)\s*Cr/i);
    if (crMatch) {
      const numCr = parseFloat(`0.${crMatch[1]}`);
      const lakhs = Math.round(numCr * 100);
      return val.replace(/0\.\d+\s*Cr/i, `${lakhs} Lakhs`);
    }
    if (val.includes('₹') || val.includes('Cr') || val.includes('Lakh')) return val;
  }
  const num = Number(String(val).replace(/[^0-9.]/g, ''));
  if (isNaN(num) || num <= 0) return val;
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${Math.round(num / 100000)} Lakhs`;
  return `₹${num.toLocaleString('en-IN')}`;
};

export default function LocationLandingPage({ locationSlug = 'hinjewadi-phase-1', onBack, onSelectSociety }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dynamic SEO Injection for Location Page
  useSEO(buildLocationSEO(data));

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    window.scrollTo(0, 0);

    apiService.getPublicLocationData(locationSlug)
      .then(res => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error('[Location] Data load error:', err);
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [locationSlug]);

  if (loading || !data) {
    return (
      <div style={{ minHeight: '100vh', background: '#070F1E', color: '#FFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid rgba(212,175,55,0.2)', borderTopColor: '#D4AF37', animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
        <p style={{ color: '#A0AEC0', fontSize: '0.85rem' }}>Loading Micro-Location Intelligence...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="pi-page-wrapper">
      
      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <header className="pi-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={onBack} className="pi-btn-outline" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
            <ArrowLeft size={14} />
            <span>All Locations</span>
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '1rem', fontFamily: "'Cinzel', serif", fontWeight: 700, color: '#F3E5AB' }}>
              {data.name} Property Intelligence
            </h1>
            <span style={{ fontSize: '0.72rem', color: '#A0AEC0' }}>PIN: {data.pincode || '411057'} • Pune IT Corridor</span>
          </div>
        </div>

        <button onClick={onBack} className="pi-btn-gold" style={{ padding: '8px 16px', fontSize: '0.78rem' }}>
          Explore All Societies
        </button>
      </header>

      {/* ── Section 1: Hero Banner & Market Aggregation ─────────────────── */}
      <section className="pi-hero-section">
        <div className="pi-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            <span className="pi-badge pi-badge-gold">
              <MapPin size={12} color="#D4AF37" />
              <span>Micro-Market Intelligence</span>
            </span>
            <span className="pi-badge pi-badge-green">
              <ShieldCheck size={12} color="#10B981" />
              <span>MahaRERA Monitored Zone</span>
            </span>
          </div>

          <div>
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#FFF', margin: '4px 0 8px 0', lineHeight: 1.2 }}>
              {data.name} Real Estate &amp; Societies
            </h1>
            <p style={{ fontSize: '0.92rem', color: '#CBD5E1', maxWidth: '750px', lineHeight: 1.6, margin: 0 }}>
              {data.description || `${data.name} represents the focal IT growth corridor of Pune West. Featuring premier residential townships, robust infrastructure, and upcoming Metro Line 3 connectivity.`}
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginTop: '10px' }}>
            <div className="pi-metric-card">
              <div className="pi-metric-icon"><Building2 size={20} /></div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#A0AEC0', textTransform: 'uppercase' }}>Verified Societies</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFF' }}>{data.societiesCount || 14} Projects</div>
              </div>
            </div>

            <div className="pi-metric-card">
              <div className="pi-metric-icon"><TrendingUp size={20} /></div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#A0AEC0', textTransform: 'uppercase' }}>Price Spectrum</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#D4AF37' }}>{data.averagePriceRange || '₹68L - ₹1.85Cr'}</div>
              </div>
            </div>

            <div className="pi-metric-card">
              <div className="pi-metric-icon"><Award size={20} /></div>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#A0AEC0', textTransform: 'uppercase' }}>Livability Score</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#34D399' }}>95 / 100</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Section 2: Societies Grid in this Micro-Location ───────────── */}
      <section className="pi-container" style={{ padding: '40px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontFamily: "'Cinzel', serif", fontWeight: 700, color: '#FFF', margin: 0 }}>
              Verified Master Societies in {data.name}
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#A0AEC0', margin: '4px 0 0 0' }}>
              Fact-checked MahaRERA dossiers, verified pricing and available inventory
            </p>
          </div>
        </div>

        {data.societies && data.societies.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {data.societies.map((society, i) => (
              <SocietyCard
                key={society.id || society.slug || i}
                society={society}
                onSelect={(slug) => onSelectSociety && onSelectSociety(slug)}
              />
            ))}
          </div>
        ) : (
          <div style={{ padding: '50px 20px', textAlign: 'center', background: '#0D182A', borderRadius: '16px', border: '1px solid var(--pi-border-light)' }}>
            <Building2 size={36} color="#D4AF37" style={{ margin: '0 auto 10px auto' }} />
            <p style={{ color: '#A0AEC0' }}>Contact our Hinjewadi Desk to discover upcoming off-market society launches.</p>
          </div>
        )}
      </section>

      {/* ── Section 3: Pune Metro Line 3 & Infrastructure Corridor ──────── */}
      <section className="pi-container" style={{ padding: '20px 24px 40px' }}>
        <div style={{ padding: '28px', borderRadius: '20px', background: 'linear-gradient(145deg, #0D1E38 0%, #081224 100%)', border: '1px solid rgba(212,175,55,0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Train size={20} color="#10B981" />
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', color: '#FFF', margin: 0 }}>
                  Pune Metro Line 3 &amp; Transit Grid
                </h3>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94A3B8', margin: '4px 0 0' }}>
                Direct connectivity from {data.name} to Civil Court, Shivajinagar &amp; Pune Junction
              </p>
            </div>
            <span className="pi-badge pi-badge-green">
              <CheckCircle2 size={11} /> 23.2 km Elevated Corridor
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {[
              { station: 'Hinjewadi Megapolis Station', dist: '~450 meters', status: 'Near Completion', time: '2 min walk' },
              { station: 'Infosys Phase 2 Station', dist: '~1.1 km', status: 'Trial Runs Underway', time: '3 min drive' },
              { station: 'Wipro Phase 1 Station', dist: '~2.4 km', status: 'Station Slabs Ready', time: '6 min drive' },
              { station: 'Shivaji Chowk Junction', dist: '~3.2 km', status: 'Major Interchange', time: '8 min drive' }
            ].map((st, i) => (
              <div key={i} style={{ padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F3E5AB', marginBottom: '4px' }}>{st.station}</div>
                <div style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 600 }}>{st.dist} · {st.time}</div>
                <div style={{ fontSize: '0.68rem', color: '#64748B', marginTop: '6px' }}>Status: {st.status}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Tech Parks & Corporate Employment Hub ──────────── */}
      <section className="pi-container" style={{ padding: '0 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          <div style={{ padding: '24px', borderRadius: '18px', background: '#0B1628', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Laptop size={18} color="#60A5FA" />
              <h4 style={{ color: '#FFF', fontSize: '1rem', margin: 0, fontWeight: 700 }}>Major Tech Campuses</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { name: 'Infosys Campus', desc: '50-acre corporate campus with 35,000+ tech workforce' },
                { name: 'Wipro Technologies', desc: 'Major development center and R&D lab' },
                { name: 'TCS Sahyadri Park', desc: 'Largest IT campus in Hinjewadi Phase 3 with 20,000+ workforce' },
                { name: 'Embassy Techzone', desc: 'SEZ hosting IBM, Cognizant, Tech Mahindra & Atos' }
              ].map((tp, i) => (
                <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  <div style={{ color: '#E2E8F0', fontSize: '0.82rem', fontWeight: 700 }}>{tp.name}</div>
                  <div style={{ color: '#94A3B8', fontSize: '0.72rem', marginTop: '2px' }}>{tp.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Location Advisory Specialist Desk */}
          <div style={{ padding: '24px', borderRadius: '18px', background: 'linear-gradient(145deg, rgba(212,175,55,0.08) 0%, rgba(11,22,40,0.95) 100%)', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '50px', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', marginBottom: '14px' }}>
                <Sparkles size={11} color="#D4AF37" />
                <span style={{ color: '#F3E5AB', fontSize: '0.66rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Corridor Specialist Desk</span>
              </div>
              <h4 style={{ color: '#FFF', fontSize: '1.15rem', fontFamily: "'Cinzel', serif", margin: '0 0 8px' }}>
                Need Private Advisory for {data.name}?
              </h4>
              <p style={{ color: '#CBD5E1', fontSize: '0.80rem', lineHeight: 1.6, margin: '0 0 16px' }}>
                Our Hinjewadi &amp; Pune West specialists offer bespoke portfolio guidance, off-market developer allocations, and competitive home loan pre-approvals.
              </p>
              <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginBottom: '16px' }}>
                MahaRERA Reg. <strong>A051262603190</strong> · Senior Advisor: Neeraj Giri
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a
                href={`https://wa.me/919673000053?text=${encodeURIComponent(`Hi 24K Realtors, I am researching properties in ${data.name}. Please share available inventory and price trends.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pi-btn-whatsapp"
                style={{ flex: 1, padding: '12px', justifyContent: 'center', fontSize: '0.80rem' }}
              >
                <MessageSquare size={14} /> WhatsApp Specialist
              </a>
              <a
                href="tel:+919673000053"
                className="pi-btn-outline"
                style={{ padding: '12px 18px', fontSize: '0.80rem' }}
              >
                <Phone size={14} /> Call Desk
              </a>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
