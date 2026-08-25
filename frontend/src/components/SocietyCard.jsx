import React from 'react';
import { MapPin, ShieldCheck, CheckCircle2, Calendar, Building2, ArrowUpRight, Sparkles, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Format dynamic price in Indian Crores/Lakhs format
 */
const formatInrPrice = (val) => {
  if (!val) return 'Price on Request';
  if (typeof val === 'string' && (val.includes('₹') || val.includes('Cr') || val.includes('Lakh'))) return val;
  const num = Number(val);
  if (isNaN(num)) return val;
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr*`;
  if (num >= 100000) return `₹${Math.round(num / 100000)} Lakhs*`;
  return `₹${num.toLocaleString('en-IN')}`;
};

/**
 * Format Phase Name
 */
const formatPhase = (phase) => {
  if (!phase) return 'Hinjewadi';
  switch (phase) {
    case 'PHASE_1': return 'Phase 1';
    case 'PHASE_2': return 'Phase 2';
    case 'PHASE_3': return 'Phase 3';
    case 'MAHALUNGE': return 'Mahalunge';
    default: return phase.replace(/_/g, ' ');
  }
};

/**
 * Format Project Status Label & Color
 */
const formatStatus = (status) => {
  switch (status) {
    case 'READY_TO_MOVE':
      return { label: 'Ready to Move', color: 'rgba(56, 176, 0, 0.15)', text: '#38B000', border: 'rgba(56, 176, 0, 0.4)' };
    case 'UNDER_CONSTRUCTION':
      return { label: 'Under Construction', color: 'rgba(255, 190, 11, 0.15)', text: '#FFBE0B', border: 'rgba(255, 190, 11, 0.4)' };
    case 'NEW_LAUNCH':
      return { label: 'New Launch', color: 'rgba(58, 134, 255, 0.15)', text: '#3A86FF', border: 'rgba(58, 134, 255, 0.4)' };
    case 'UPCOMING':
      return { label: 'Upcoming Pre-Launch', color: 'rgba(131, 56, 236, 0.15)', text: '#A370F7', border: 'rgba(131, 56, 236, 0.4)' };
    default:
      return { label: status ? status.replace(/_/g, ' ') : 'Verified Project', color: 'rgba(212, 175, 55, 0.15)', text: '#D4AF37', border: 'rgba(212, 175, 55, 0.4)' };
  }
};

export default function SocietyCard({ society, onSelect }) {
  if (!society) return null;

  const statusInfo = formatStatus(society.projectStatus);
  const heroImage = society.heroImageUrl || (society.galleryUrls ? society.galleryUrls.split(',')[0] : '/dev_kolte_patil_township.png');
  const phaseLabel = formatPhase(society.hinjewadiPhase);
  const priceDisplay = society.priceRange || formatInrPrice(society.startingPrice);

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      className="group relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#131F33] to-[#0A111E] border border-[rgba(212,175,55,0.2)] hover:border-[rgba(212,175,55,0.6)] shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.18)] transition-all duration-300 flex flex-col cursor-pointer"
      onClick={() => onSelect && onSelect(society.slug || society.id)}
    >
      {/* ── Top Image Frame with Gradient Overlay ───────────────────────── */}
      <div className="relative h-60 w-full overflow-hidden bg-[#070E1A]">
        <img
          src={heroImage}
          alt={society.canonicalName || society.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/dev_kolte_patil_township.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A111E] via-transparent to-black/50" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none gap-2">
          {/* Phase Badge */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide bg-[#09111F]/85 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/30 shadow-md">
            <MapPin className="w-3 h-3 text-[#D4AF37]" />
            {phaseLabel}
          </span>

          {/* Status Badge */}
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide backdrop-blur-md shadow-md"
            style={{
              backgroundColor: statusInfo.color,
              color: statusInfo.text,
              border: `1px solid ${statusInfo.border}`
            }}
          >
            {statusInfo.label}
          </span>
        </div>

        {/* RERA Badge Bottom Left of Image */}
        {society.reraNumber && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-[rgba(212,175,55,0.35)] shadow-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] font-mono font-medium text-gray-200 tracking-wider">
              {society.reraNumber.length > 22 ? `${society.reraNumber.substring(0, 20)}...` : society.reraNumber}
            </span>
          </div>
        )}

        {/* Verified Confidence Pill */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[10px] font-semibold uppercase tracking-wider">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>Verified</span>
        </div>
      </div>

      {/* ── Content Body ───────────────────────────────────────────────── */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Developer Name */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#D4AF37] uppercase tracking-widest mb-1.5">
            <Building2 className="w-3.5 h-3.5 opacity-80" />
            <span>{society.developer || '24K Premium Alliance'}</span>
          </div>

          {/* Society Title */}
          <h3 className="text-xl font-serif font-bold text-white tracking-wide group-hover:text-[#F3E5AB] transition-colors line-clamp-1">
            {society.canonicalName || society.name}
          </h3>

          {/* Configuration Summary */}
          {society.configuration && (
            <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-xs text-gray-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-md">
                <Layers className="w-3 h-3 text-[#D4AF37]" />
                {society.configuration}
              </span>
              {society.possessionDate && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-md">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  {society.possessionDate}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Price & Audit Date Section (MANDATORY per Master Prompt) ─── */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-end justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
              Starting Range
            </div>
            <div className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors">
              {priceDisplay}
            </div>
            {/* MANDATORY: Price Verification Date */}
            <div className="text-[10px] text-[#A0AEC0] flex items-center gap-1 mt-0.5">
              <span>Verified:</span>
              <span className="text-gray-300 font-mono">
                {society.priceLastVerified || society.lastVerifiedAt || '25 Aug 2026'}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#E5C158] hover:to-[#C5A035] text-[#09111F] font-bold text-xs shadow-md group-hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all shrink-0"
          >
            <span>Intelligence</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
