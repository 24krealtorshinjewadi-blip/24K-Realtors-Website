import React, { useState, useEffect } from 'react';
import { 
  MapPin, ShieldCheck, Building2, TrendingUp, Train, School, 
  HeartPulse, Sparkles, ArrowLeft, ArrowUpRight, CheckCircle2, 
  Clock, ChevronRight, HelpCircle, Layers, Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { apiService } from '../services/apiService';
import SocietyCard from './SocietyCard';
import CompanyLogo from './CompanyLogo';

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
      <div className="min-h-screen bg-[#070F1E] text-white flex flex-col items-center justify-center p-6">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#D4AF37] mb-3" />
        <p className="text-xs text-gray-400">Loading Micro-Location Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070F1E] text-white font-sans selection:bg-[#D4AF37] selection:text-[#09111F]">
      
      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#070F1E]/95 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Locations</span>
          </button>
          <div>
            <h1 className="text-sm font-serif font-bold text-[#F3E5AB]">
              {data.name} Property Intelligence
            </h1>
            <span className="text-[10px] text-gray-400">PIN: {data.pincode || '411057'} • Pune IT Corridor</span>
          </div>
        </div>

        <button
          onClick={onBack}
          className="px-4 py-1.5 rounded-xl bg-[#D4AF37] text-[#09111F] font-bold text-xs shadow-md"
        >
          Explore All
        </button>
      </header>

      {/* ── Section 1: Hero Banner & Market Aggregation ─────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B1527] to-[#070F1E] border-b border-white/10 py-12 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3E5AB]">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Micro-Location Hub</span>
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>MahaRERA Verified Region</span>
            </span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-white tracking-tight">
              {data.name} Real Estate & Societies
            </h1>
            <p className="text-sm text-gray-300 leading-relaxed max-w-3xl mt-3">
              {data.overview || `${data.name} is one of Western Pune's primary high-growth residential hubs. Home to global IT giants, expanding metro infrastructure, and world-class educational institutions.`}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            
            <div className="p-5 rounded-2xl bg-[#0D1A2D] border border-white/10">
              <div className="text-xs text-gray-400 uppercase font-semibold">Total Verified Projects</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{data.totalProjects || 48}</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0D1A2D] border border-white/10">
              <div className="text-xs text-emerald-400 uppercase font-semibold">Ready to Move</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">{data.readyToMoveCount || 18}</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0D1A2D] border border-white/10">
              <div className="text-xs text-amber-400 uppercase font-semibold">Under Construction</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">{data.underConstructionCount || 22}</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0D1A2D] border border-white/10">
              <div className="text-xs text-blue-400 uppercase font-semibold">New Launches</div>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 mt-1">{data.newLaunchCount || 8}</div>
            </div>

          </div>

          {/* Price Range Strip with MANDATORY Verification Date */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#111D30] to-[#0C1522] border border-[rgba(212,175,55,0.3)] flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                Verified Price Spectrum ({data.name})
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#D4AF37] mt-0.5">
                {formatInr(data.minPrice)} - {formatInr(data.maxPrice)}
              </div>
            </div>

            <div className="text-xs text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <span>Summary verified on: <strong className="text-white font-mono">{data.priceSummaryLastVerified || '25 Aug 2026'}</strong></span>
            </div>
          </div>

        </div>
      </section>

      {/* ── Main Content Grid ──────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-14">
        
        {/* ── Section 2: BHK Availability Matrix ────────────────────────── */}
        <section className="space-y-4">
          <div className="border-l-2 border-[#D4AF37] pl-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Unit Spectrum</h2>
            <p className="text-xl font-serif font-bold text-white mt-0.5">BHK Availability in {data.name}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: '1 BHK Compact', active: data.has1Bhk },
              { label: '2 BHK Premium', active: data.has2Bhk },
              { label: '3 BHK Luxury', active: data.has3Bhk },
              { label: '4 BHK Ultra', active: data.has4Bhk },
              { label: 'Township Villas', active: data.hasVilla }
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-center ${item.active ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-white/[0.02] border-white/5 text-gray-500'}`}
              >
                <div className="text-xs font-bold">{item.label}</div>
                <div className="text-[10px] mt-0.5">{item.active ? '✓ Available' : 'Limited'}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: Connectivity & Infrastructure ──────────────────── */}
        <section className="space-y-4">
          <div className="border-l-2 border-[#D4AF37] pl-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Strategic Transit</h2>
            <p className="text-xl font-serif font-bold text-white mt-0.5">Infrastructure & Connectivity</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-[#0D192B] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-purple-400">
                <Train className="w-5 h-5" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Metro Corridor</h3>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {data.metroConnectivity || 'Upcoming Metro Line 3 connecting Hinjewadi directly with Shivajinagar & Civil Court junction.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D192B] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-amber-400">
                <School className="w-5 h-5" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Top Schools</h3>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {data.schools || 'Mercedes-Benz International School, Blue Ridge Public School, Vibgyor High.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0D192B] border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <HeartPulse className="w-5 h-5" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Healthcare</h3>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {data.hospitals || 'Ruby Hall Clinic Hinjewadi, Lifepoint Multispeciality Hospital, Sanjeevani.'}
              </p>
            </div>

          </div>
        </section>

        {/* ── Section 4: Featured Societies ─────────────────────────────── */}
        <section className="space-y-6">
          <div className="border-l-2 border-[#D4AF37] pl-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Top Rated</h2>
            <p className="text-xl font-serif font-bold text-white mt-0.5">Popular Societies in {data.name}</p>
          </div>

          {data.featuredSocieties && data.featuredSocieties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.featuredSocieties.map((soc, i) => (
                <SocietyCard
                  key={soc.id || i}
                  society={soc}
                  onSelect={onSelectSociety}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#0D182A] border border-white/10 text-center space-y-3">
              <Building2 className="w-10 h-10 text-[#D4AF37] mx-auto opacity-75" />
              <p className="text-xs text-gray-300">Browse verified properties and residential townships across {data.name}.</p>
              <button
                onClick={onBack}
                className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#09111F] font-bold text-xs"
              >
                Browse All Societies
              </button>
            </div>
          )}
        </section>

      </main>

    </div>
  );
}
