import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, SlidersHorizontal, MapPin, Building2, ShieldCheck, 
  Sparkles, X, ChevronDown, Check, ArrowRight, RefreshCw, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/apiService';
import SocietyCard from './SocietyCard';
import CompanyLogo from './CompanyLogo';

export default function PublicSocietiesPage({ onSelectSociety, onBackHome }) {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedBhk, setSelectedBhk] = useState('');
  const [budgetTier, setBudgetTier] = useState('');
  const [selectedDeveloper, setSelectedDeveloper] = useState('');
  const [reraOnly, setReraOnly] = useState(false);
  const [hasResale, setHasResale] = useState(false);
  const [hasRental, setHasRental] = useState(false);
  const [sortBy, setSortBy] = useState('verified_first');
  const [currentPage, setCurrentPage] = useState(0);

  const fetchSocieties = useCallback(async () => {
    setLoading(true);
    try {
      let minBudget = null;
      let maxBudget = null;

      if (budgetTier === 'under_80l') {
        maxBudget = 8000000;
      } else if (budgetTier === '80l_1.5cr') {
        minBudget = 8000000;
        maxBudget = 15000000;
      } else if (budgetTier === '1.5cr_2.5cr') {
        minBudget = 15000000;
        maxBudget = 25000000;
      } else if (budgetTier === 'above_2.5cr') {
        minBudget = 25000000;
      }

      const res = await apiService.getPublicSocieties({
        hinjewadiPhase: selectedPhase || null,
        projectStatus: selectedStatus || null,
        bhkType: selectedBhk || null,
        developer: selectedDeveloper || (searchQuery ? searchQuery : null),
        minBudget,
        maxBudget,
        reraRegistered: reraOnly ? true : null,
        hasResale: hasResale ? true : null,
        hasRental: hasRental ? true : null,
        sortBy,
        page: currentPage,
        size: 18
      });

      const list = res.content || res || [];
      // Client-side query filter if search text present
      const filtered = searchQuery.trim()
        ? list.filter(s => 
            (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (s.developer && s.developer.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (s.location && s.location.toLowerCase().includes(searchQuery.toLowerCase()))
          )
        : list;

      setSocieties(filtered);
      setTotalCount(res.totalElements || filtered.length);
    } catch (err) {
      console.error('[PublicSocieties] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedPhase, selectedStatus, selectedBhk, budgetTier, selectedDeveloper, reraOnly, hasResale, hasRental, sortBy, currentPage, searchQuery]);

  useEffect(() => {
    fetchSocieties();
  }, [fetchSocieties]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedPhase('');
    setSelectedStatus('');
    setSelectedBhk('');
    setBudgetTier('');
    setSelectedDeveloper('');
    setReraOnly(false);
    setHasResale(false);
    setHasRental(false);
    setSortBy('verified_first');
    setCurrentPage(0);
  };

  return (
    <div className="min-h-screen bg-[#070F1E] text-white font-sans selection:bg-[#D4AF37] selection:text-[#09111F]">
      
      {/* ── Top Header Strip ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#070F1E]/95 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={onBackHome}>
            <CompanyLogo variant="symbol" width={36} height={36} />
            <div>
              <div className="text-sm font-serif font-bold text-[#F3E5AB] tracking-wide flex items-center gap-1.5">
                <span>24K REALTORS</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-mono">
                  INTELLIGENCE
                </span>
              </div>
              <p className="text-[10px] text-gray-400">Hinjewadi & Mahalunge Property Database</p>
            </div>
          </div>

          {/* Search bar inside header for tablet/desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5" />
            <input
              type="text"
              placeholder="Search society, builder, or project..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 text-gray-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 text-xs font-semibold text-gray-200 flex items-center gap-2"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Filters</span>
            </button>

            <button
              onClick={onBackHome}
              className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-all"
            >
              Back to Portal
            </button>
          </div>

        </div>
      </header>

      {/* ── Trust Banner Strip ─────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-[#0C172B] via-[#101F38] to-[#0C172B] border-b border-white/10 py-3 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-medium text-gray-300">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>MahaRERA Fact-Checked</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#F3E5AB]">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Dynamic Pricing with Audit Dates</span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-400">
            <Building2 className="w-4 h-4" />
            <span>Direct Developer Advisory</span>
          </div>
        </div>
      </section>

      {/* ── Main Layout: Sidebar Filters + Grid ────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* ── Desktop Filters Sidebar ──────────────────────────────────── */}
        <aside className="hidden lg:block space-y-6">
          <div className="p-6 rounded-2xl bg-[#0D182A] border border-white/10 shadow-xl space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                <span>Refine Intelligence</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#D4AF37] hover:underline font-medium"
              >
                Reset All
              </button>
            </div>

            {/* 1. Hinjewadi Phase Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Micro-Location / Phase</label>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { val: '', label: 'All Hinjewadi & Mahalunge' },
                  { val: 'PHASE_1', label: 'Hinjewadi Phase 1' },
                  { val: 'PHASE_2', label: 'Hinjewadi Phase 2' },
                  { val: 'PHASE_3', label: 'Hinjewadi Phase 3' },
                  { val: 'MAHALUNGE', label: 'Mahalunge IT Corridor' }
                ].map(item => (
                  <button
                    key={item.val}
                    onClick={() => setSelectedPhase(item.val)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${selectedPhase === item.val ? 'bg-[#D4AF37] text-[#09111F]' : 'text-gray-300 hover:bg-white/5'}`}
                  >
                    <span>{item.label}</span>
                    {selectedPhase === item.val && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Project Status Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Project Status</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { val: '', label: 'All Status' },
                  { val: 'READY_TO_MOVE', label: 'Ready to Move' },
                  { val: 'UNDER_CONSTRUCTION', label: 'Under Const.' },
                  { val: 'NEW_LAUNCH', label: 'New Launch' }
                ].map(item => (
                  <button
                    key={item.val}
                    onClick={() => setSelectedStatus(item.val)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all text-center ${selectedStatus === item.val ? 'bg-[#D4AF37] text-[#09111F]' : 'text-gray-300 bg-white/[0.02] hover:bg-white/5 border border-white/5'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. BHK Configuration */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">BHK Configuration</label>
              <div className="grid grid-cols-4 gap-1.5">
                {['', '1 BHK', '2 BHK', '3 BHK', '4 BHK'].map(bhk => (
                  <button
                    key={bhk}
                    onClick={() => setSelectedBhk(bhk)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all text-center ${selectedBhk === bhk ? 'bg-[#D4AF37] text-[#09111F]' : 'text-gray-300 bg-white/[0.02] hover:bg-white/5 border border-white/5'}`}
                  >
                    {bhk || 'All'}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Budget Range */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Budget Range</label>
              <div className="grid grid-cols-1 gap-1.5">
                {[
                  { val: '', label: 'Any Budget' },
                  { val: 'under_80l', label: 'Under ₹80 Lakhs' },
                  { val: '80l_1.5cr', label: '₹80 Lakhs - ₹1.50 Cr' },
                  { val: '1.5cr_2.5cr', label: '₹1.50 Cr - ₹2.50 Cr' },
                  { val: 'above_2.5cr', label: 'Above ₹2.50 Cr (Ultra-Luxury)' }
                ].map(tier => (
                  <button
                    key={tier.val}
                    onClick={() => setBudgetTier(tier.val)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${budgetTier === tier.val ? 'bg-[#D4AF37] text-[#09111F]' : 'text-gray-300 hover:bg-white/5'}`}
                  >
                    <span>{tier.label}</span>
                    {budgetTier === tier.val && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Checkboxes (RERA, Resale, Rental) */}
            <div className="pt-4 border-t border-white/10 space-y-2.5">
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reraOnly}
                  onChange={e => setReraOnly(e.target.checked)}
                  className="rounded accent-[#D4AF37]"
                />
                <span>MahaRERA Registered Only</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasResale}
                  onChange={e => setHasResale(e.target.checked)}
                  className="rounded accent-[#D4AF37]"
                />
                <span>Verified Resale Available</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasRental}
                  onChange={e => setHasRental(e.target.checked)}
                  className="rounded accent-[#D4AF37]"
                />
                <span>High Rental Yield Units</span>
              </label>
            </div>

          </div>
        </aside>

        {/* ── Right Content: Results Grid ──────────────────────────────── */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Controls Bar (Results Count + Sorting) */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0D182A] border border-white/10">
            <div>
              <span className="text-sm font-bold text-white">
                {totalCount} Verified Projects Found
              </span>
              <p className="text-[11px] text-gray-400">
                Sorted by {sortBy === 'verified_first' ? 'Trust & Verification Score' : sortBy}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="verified_first" className="bg-[#0D182A]">Verified First</option>
                <option value="price_asc" className="bg-[#0D182A]">Price: Low to High</option>
                <option value="price_desc" className="bg-[#0D182A]">Price: High to Low</option>
                <option value="newest" className="bg-[#0D182A]">Recently Added</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#D4AF37] mx-auto" />
              <p className="text-xs text-gray-400">Querying Pune Property Intelligence Database...</p>
            </div>
          ) : societies.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0D182A] border border-white/10 space-y-4">
              <Building2 className="w-12 h-12 text-gray-500 mx-auto" />
              <h3 className="text-lg font-serif font-bold text-white">No Matching Properties</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                No residential societies matched the selected filters. Try broadening your micro-location or budget filter.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#09111F] font-bold text-xs"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {societies.map((society, idx) => (
                <SocietyCard
                  key={society.id || idx}
                  society={society}
                  onSelect={onSelectSociety}
                />
              ))}
            </div>
          )}

        </main>

      </div>

      {/* ── Mobile Filters Drawer ──────────────────────────────────────── */}
      <AnimatePresence>
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm lg:hidden">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-full max-w-sm bg-[#0C182B] h-full overflow-y-auto p-6 space-y-6 border-l border-white/10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                  <span>Filters</span>
                </h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-1 text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Phase Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Micro-Location</label>
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    { val: '', label: 'All Hinjewadi & Mahalunge' },
                    { val: 'PHASE_1', label: 'Hinjewadi Phase 1' },
                    { val: 'PHASE_2', label: 'Hinjewadi Phase 2' },
                    { val: 'PHASE_3', label: 'Hinjewadi Phase 3' },
                    { val: 'MAHALUNGE', label: 'Mahalunge' }
                  ].map(item => (
                    <button
                      key={item.val}
                      onClick={() => { setSelectedPhase(item.val); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${selectedPhase === item.val ? 'bg-[#D4AF37] text-[#09111F]' : 'text-gray-300 bg-white/5'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Status */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Status</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { val: '', label: 'All Status' },
                    { val: 'READY_TO_MOVE', label: 'Ready to Move' },
                    { val: 'UNDER_CONSTRUCTION', label: 'Under Const.' },
                    { val: 'NEW_LAUNCH', label: 'New Launch' }
                  ].map(item => (
                    <button
                      key={item.val}
                      onClick={() => setSelectedStatus(item.val)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold ${selectedStatus === item.val ? 'bg-[#D4AF37] text-[#09111F]' : 'text-gray-300 bg-white/5'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex gap-3">
                <button
                  onClick={handleResetFilters}
                  className="w-1/2 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-[#D4AF37] text-[#09111F] font-bold text-xs"
                >
                  Apply Filters
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
