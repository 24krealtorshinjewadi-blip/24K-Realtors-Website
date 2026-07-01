import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Portal: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col justify-between">
      {/* Brand Header */}
      <header className="border-b border-[#D4AF37]/20 bg-[#070f1e]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-wider text-white">24K REALTORS</span>
            <span className="text-[9px] text-[#D4AF37] tracking-[0.3em] font-semibold uppercase">PUNE - PREMIUM ADVISORY</span>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="border border-[#D4AF37] text-[#D4AF37] px-6 py-2 rounded-lg text-sm font-semibold tracking-wide hover:bg-[#D4AF37] hover:text-[#020617] transition-all"
          >
            Access CRM
          </button>
        </div>
      </header>

      {/* Main Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
          Premium Real Estate <br/>
          <span className="bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] bg-clip-text text-transparent">Advisory & Digital Marketing</span>
        </h1>
        <p className="max-w-2xl text-slate-400 text-base md:text-lg mb-10 leading-relaxed">
          Platform for premium residential and commercial inventory across prime IT growth corridors of Pune: Hinjewadi, Baner, Wakad, Balewadi, and Tathawade.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-gradient-to-r from-[#D4AF37] to-[#AA8B24] text-[#020617] px-8 py-3.5 rounded-lg text-md font-bold hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all transform hover:-translate-y-0.5"
        >
          Explore Inventory Portal
        </button>
      </main>

      {/* Portal Footer */}
      <footer className="border-t border-[#D4AF37]/20 bg-[#070f1e] py-8 text-center text-sm text-slate-400">
        <p>© 2026 24K Realtors Pune. All rights reserved.</p>
        <p className="text-xs text-slate-500 mt-2">Premium residential and commercial properties in Hinjewadi, Wakad, Baner, Balewadi, and Tathawade.</p>
      </footer>
    </div>
  );
};
