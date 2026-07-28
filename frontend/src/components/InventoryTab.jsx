// ═══════════════════════════════════════════════════════════════════════════
// 24K REALTORS — Inventory & Projects Module
// Features:
//   - 6 KPI Sparkline Cards (Total Projects 24, Total Units 1256, Available 342, On Hold 28, Booked 156, Sold 730)
//   - Projects Overview Carousel Cards (Lodha Hinjewadi, VTP Blue Waters, Godrej Hillside, Kolte Patil) with real-time unit breakdown
//   - Inventory Status Overview Donut Chart
//   - Units by BHK Type Donut Chart
//   - Projects by Location Widget
//   - Quick Insights (High Demand, Fastest Selling, Highest Value)
//   - Inventory / Units Data Table (Table View vs Floor Plan View)
//   - Multi-level Filter Bar (Project, Tower, BHK, Status, Price Range, Search Unit No)
//   - Modals for Add Project and Add Unit
// ═══════════════════════════════════════════════════════════════════════════
import React, { useState, useMemo } from 'react';
import {
  Building, Home, Layers, CheckCircle2, Clock, Award, DollarSign,
  Search, Filter, Plus, Download, Upload, Eye, Edit2, MoreVertical,
  ChevronRight, ChevronLeft, Star, Share2, MapPin, Sparkles, X,
  Grid, List, Sliders, CheckSquare, Calendar, User, TrendingUp, AlertTriangle
} from 'lucide-react';

const GOLD = '#D4AF37';

const MOCK_PROJECTS = [
  {
    id: 'PRJ-001',
    name: 'Lodha Hinjewadi',
    status: 'Active',
    location: 'Hinjewadi Phase 3, Pune',
    developer: 'Lodha Group',
    bhkTypes: '2, 3 BHK Apartments',
    priceRange: '₹85 L – ₹1.65 Cr',
    possession: 'Dec 2028',
    totalUnits: 420,
    available: 42,
    onHold: 5,
    booked: 12,
    sold: 361,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'PRJ-002',
    name: 'VTP Blue Waters',
    status: 'Active',
    location: 'Hinjewadi Phase 1, Pune',
    developer: 'VTP Realty',
    bhkTypes: '2, 3 BHK Apartments',
    priceRange: '₹75 L – ₹1.45 Cr',
    possession: 'Jun 2027',
    totalUnits: 380,
    available: 68,
    onHold: 6,
    booked: 18,
    sold: 288,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'PRJ-003',
    name: 'Godrej Hillside',
    status: 'Active',
    location: 'Maan, Hinjewadi, Pune',
    developer: 'Godrej Properties',
    bhkTypes: '2, 3, 4 BHK Apartments',
    priceRange: '₹95 L – ₹2.10 Cr',
    possession: 'Mar 2029',
    totalUnits: 310,
    available: 31,
    onHold: 4,
    booked: 10,
    sold: 265,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'PRJ-004',
    name: 'Kolte Patil Life Republic',
    status: 'Active',
    location: 'Hinjewadi Phase 5, Pune',
    developer: 'Kolte Patil Developers',
    bhkTypes: '2, 3 BHK Apartments',
    priceRange: '₹60 L – ₹1.20 Cr',
    possession: 'Dec 2026',
    totalUnits: 146,
    available: 21,
    onHold: 3,
    booked: 10,
    sold: 112,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
];

const MOCK_UNITS = [
  { unitNo: 'T3-1204', project: 'Lodha Hinjewadi', tower: 'Tower 3', floor: '12th Floor', bhk: '2 BHK', area: '1050 sq.ft.', price: '₹1.20 Cr', status: 'AVAILABLE', assignedTo: 'Manish Rai', updated: '25 Jul 2026' },
  { unitNo: 'T2-804', project: 'Lodha Hinjewadi', tower: 'Tower 2', floor: '8th Floor', bhk: '3 BHK', area: '1450 sq.ft.', price: '₹1.65 Cr', status: 'ON HOLD', assignedTo: 'Jyoti Dhale', updated: '24 Jul 2026' },
  { unitNo: 'T1-1502', project: 'VTP Blue Waters', tower: 'Tower 1', floor: '15th Floor', bhk: '3 BHK', area: '1400 sq.ft.', price: '₹1.55 Cr', status: 'BOOKED', assignedTo: 'Yash Murkute', updated: '23 Jul 2026' },
  { unitNo: 'T4-603', project: 'Godrej Hillside', tower: 'Tower 4', floor: '6th Floor', bhk: '2 BHK', area: '980 sq.ft.', price: '₹95 L', status: 'AVAILABLE', assignedTo: 'Amit Singh', updated: '22 Jul 2026' },
  { unitNo: 'T2-1101', project: 'Kolte Patil Life Republic', tower: 'Tower 2', floor: '11th Floor', bhk: '2 BHK', area: '850 sq.ft.', price: '₹62 L', status: 'SOLD', assignedTo: '-', updated: '20 Jul 2026' },
  { unitNo: 'T3-1803', project: 'Lodha Hinjewadi', tower: 'Tower 3', floor: '18th Floor', bhk: '3 BHK', area: '1600 sq.ft.', price: '₹1.80 Cr', status: 'BOOKED', assignedTo: 'Rohini K.', updated: '19 Jul 2026' },
  { unitNo: 'T1-703', project: 'VTP Blue Waters', tower: 'Tower 1', floor: '7th Floor', bhk: '2 BHK', area: '1100 sq.ft.', price: '₹1.05 Cr', status: 'ON HOLD', assignedTo: 'Meera Gupta', updated: '18 Jul 2026' },
];

const Sparkline = ({ color }) => (
  <svg width="100%" height="22" viewBox="0 0 100 22" fill="none">
    <path d="M0 16 Q 20 10, 40 14 T 80 4 T 100 2" stroke={color} strokeWidth="2" fill="none" />
  </svg>
);

export default function InventoryTab() {
  const [projectSubTab, setProjectSubTab] = useState('All Projects');
  const [viewMode, setViewMode] = useState('table'); // table vs floorplan
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [bhkFilter, setBhkFilter] = useState('ALL');

  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);

  const filteredUnits = useMemo(() => {
    return MOCK_UNITS.filter(u => {
      if (selectedProjectFilter !== 'ALL' && u.project !== selectedProjectFilter) return false;
      if (statusFilter !== 'ALL' && u.status !== statusFilter) return false;
      if (bhkFilter !== 'ALL' && u.bhk !== bhkFilter) return false;
      if (searchQuery && !u.unitNo.toLowerCase().includes(searchQuery.toLowerCase()) && !u.project.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [selectedProjectFilter, statusFilter, bhkFilter, searchQuery]);

  const statusBadge = (st) => {
    const map = {
      AVAILABLE: { bg: 'rgba(16,185,129,0.12)', color: '#10B981', border: 'rgba(16,185,129,0.3)' },
      'ON HOLD': { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
      BOOKED: { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6', border: 'rgba(59,130,246,0.3)' },
      SOLD: { bg: 'rgba(212,175,55,0.12)', color: GOLD, border: `rgba(212,175,55,0.3)` },
    };
    const s = map[st] || map.AVAILABLE;
    return (
      <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '0.66rem', fontWeight: 800, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
        {st}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFF' }}>Inventory / Projects</div>
          <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>Manage projects, inventory and track availability in real-time</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 260 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input placeholder="Search project, tower, unit, location..."
              style={{ width: '100%', padding: '8px 10px 8px 32px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#FFF', fontSize: '0.76rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button onClick={() => setShowAddProjectModal(true)}
            style={{ padding: '9px 16px', borderRadius: '8px', background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, border: 'none', color: '#070D18', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: `0 4px 14px ${GOLD}30` }}>
            <Plus size={15} /> Add Project
          </button>
          <button onClick={() => setShowAddUnitModal(true)}
            style={{ padding: '9px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={14} /> Add Unit
          </button>
          <button style={{ padding: '9px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Upload size={14} /> Import
          </button>
          <button style={{ padding: '9px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* ── 6 KPI SPARKLINE CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
        {[
          { label: 'Total Projects', val: '24', change: '↑ 14.3% vs last month', color: '#F59E0B', icon: Building },
          { label: 'Total Units', val: '1,256', change: '↑ 16.7% vs last month', color: '#10B981', icon: Layers },
          { label: 'Available Units', val: '342', change: '↑ 18.6% vs last month', color: GOLD, icon: Home },
          { label: 'On Hold', val: '28', change: '↓ 3.4% vs last month', color: '#F97316', icon: Clock },
          { label: 'Booked', val: '156', change: '↑ 9.8% vs last month', color: '#3B82F6', icon: CheckSquare },
          { label: 'Sold', val: '730', change: '↑ 17.2% vs last month', color: '#8B5CF6', icon: Award },
        ].map((kpi, i) => {
          const IconC = kpi.icon;
          return (
            <div key={i} style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '6px', background: `${kpi.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconC size={12} color={kpi.color} />
                  </div>
                  <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>{kpi.label}</span>
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FFF', marginBottom: '3px' }}>{kpi.val}</div>
                <div style={{ fontSize: '0.65rem', color: kpi.change.includes('↑') ? '#10B981' : '#F97316', fontWeight: 600 }}>{kpi.change}</div>
              </div>
              <div style={{ marginTop: '8px' }}>
                <Sparkline color={kpi.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MIDDLE ROW (PROJECTS CAROUSEL & SIDEBAR WIDGETS) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '18px', alignItems: 'start' }}>

        {/* LEFT — PROJECTS OVERVIEW CAROUSEL CARDS */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>Projects Overview</div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select style={{ padding: '5px 10px', borderRadius: '6px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', outline: 'none' }}>
                <option>All Locations</option>
                <option>Hinjewadi Phase 1</option>
                <option>Hinjewadi Phase 3</option>
                <option>Maan, Hinjewadi</option>
              </select>
              <button style={{ padding: '5px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: GOLD, fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Filter size={12} /> Filter
              </button>
            </div>
          </div>

          {/* Sub-Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {['All Projects', 'Active Projects', 'Upcoming', 'Completed', 'On Hold'].map(tab => (
              <button key={tab} onClick={() => setProjectSubTab(tab)}
                style={{ padding: '6px 12px', borderRadius: '8px', background: projectSubTab === tab ? `rgba(212,175,55,0.15)` : 'rgba(255,255,255,0.03)', border: `1px solid ${projectSubTab === tab ? GOLD : 'rgba(255,255,255,0.07)'}`, color: projectSubTab === tab ? GOLD : 'rgba(255,255,255,0.5)', fontSize: '0.72rem', fontWeight: projectSubTab === tab ? 700 : 400, cursor: 'pointer' }}>
                {tab}
              </button>
            ))}
          </div>

          {/* Project Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {MOCK_PROJECTS.map(prj => (
              <div key={prj.id} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 110, position: 'relative', overflow: 'hidden' }}>
                  <img src={prj.image} alt={prj.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: 8, right: 8, padding: '2px 6px', borderRadius: '4px', background: 'rgba(16,185,129,0.85)', color: '#FFF', fontSize: '0.58rem', fontWeight: 800 }}>{prj.status}</span>
                  <button style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.5)', border: 'none', color: '#FFF', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Star size={11} />
                  </button>
                </div>

                <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>{prj.name}</div>
                    <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{prj.location}</div>
                    <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.3)', marginTop: '1px' }}>{prj.developer}</div>

                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: GOLD, marginTop: '8px' }}>{prj.priceRange}</div>
                    <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Possession: {prj.possession}</div>
                  </div>

                  {/* Units Count Breakdown Row */}
                  <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '2px', textAlign: 'center' }}>
                    <div><div style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.3)' }}>Total</div><div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#FFF' }}>{prj.totalUnits}</div></div>
                    <div><div style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.3)' }}>Avail</div><div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10B981' }}>{prj.available}</div></div>
                    <div><div style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.3)' }}>Hold</div><div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#F59E0B' }}>{prj.onHold}</div></div>
                    <div><div style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.3)' }}>Booked</div><div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#3B82F6' }}>{prj.booked}</div></div>
                    <div><div style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.3)' }}>Sold</div><div style={{ fontSize: '0.72rem', fontWeight: 800, color: GOLD }}>{prj.sold}</div></div>
                  </div>

                  <div style={{ marginTop: '10px', display: 'flex', gap: '6px' }}>
                    <button style={{ flex: 1, padding: '6px', borderRadius: '6px', background: `rgba(212,175,55,0.12)`, border: `1px solid ${GOLD}30`, color: GOLD, fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer' }}>
                      View Inventory
                    </button>
                    <button style={{ width: 24, height: 24, borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Share2 size={11} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR WIDGETS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Inventory Status Overview Donut */}
          <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF', marginBottom: '14px' }}>Inventory Status Overview</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: 90, height: 90, borderRadius: '50%', background: `conic-gradient(#10B981 0% 27.2%, #F97316 27.2% 29.4%, #3B82F6 29.4% 41.8%, ${GOLD} 41.8% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 62, height: 62, borderRadius: '50%', background: '#070F1E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 900, color: GOLD }}>1,256</div>
                  <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)' }}>Total Units</div>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {[
                  { label: 'Available', val: '342 (27.2%)', color: '#10B981' },
                  { label: 'On Hold', val: '28 (2.2%)', color: '#F97316' },
                  { label: 'Booked', val: '156 (12.4%)', color: '#3B82F6' },
                  { label: 'Sold', val: '730 (58.1%)', color: GOLD },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.color }} />
                      <span style={{ color: 'rgba(255,255,255,0.55)' }}>{item.label}</span>
                    </div>
                    <span style={{ color: item.color, fontWeight: 700 }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Units by BHK Type Donut */}
          <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF', marginBottom: '14px' }}>Units by BHK Type</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: 90, height: 90, borderRadius: '50%', background: `conic-gradient(#8B5CF6 0% 8.9%, #3B82F6 8.9% 49.7%, #14B8A6 49.7% 85.7%, ${GOLD} 85.7% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 62, height: 62, borderRadius: '50%', background: '#070F1E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#FFF' }}>1,256</div>
                  <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)' }}>Total Units</div>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {[
                  { label: '1 BHK', val: '112 (8.9%)', color: '#8B5CF6' },
                  { label: '2 BHK', val: '512 (40.8%)', color: '#3B82F6' },
                  { label: '3 BHK', val: '452 (36.0%)', color: '#14B8A6' },
                  { label: '4+ BHK', val: '180 (14.3%)', color: GOLD },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.color }} />
                      <span style={{ color: 'rgba(255,255,255,0.55)' }}>{item.label}</span>
                    </div>
                    <span style={{ color: '#FFF', fontWeight: 700 }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF', marginBottom: '14px' }}>Quick Insights</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { title: 'High Demand Project', name: 'Lodha Hinjewadi', color: '#10B981' },
                { title: 'Fastest Selling Project', name: 'VTP Blue Waters', color: '#3B82F6' },
                { title: 'Highest Value Project', name: 'Godrej Hillside', color: GOLD },
              ].map((ins, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'rgba(255,255,255,0.025)', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{ins.title}</div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: ins.color, marginTop: '2px' }}>{ins.name}</div>
                  </div>
                  <Sparkline color={ins.color} />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── BOTTOM SECTION (INVENTORY / UNITS TABLE) ── */}
      <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
        
        {/* Table Top Header Bar */}
        <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFF' }}>Inventory / Units</div>
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.04)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => setViewMode('table')} style={{ padding: '5px 12px', borderRadius: '6px', background: viewMode === 'table' ? GOLD : 'transparent', color: viewMode === 'table' ? '#000' : 'rgba(255,255,255,0.6)', fontSize: '0.72rem', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <List size={12} /> Table View
            </button>
            <button onClick={() => setViewMode('floorplan')} style={{ padding: '5px 12px', borderRadius: '6px', background: viewMode === 'floorplan' ? GOLD : 'transparent', color: viewMode === 'floorplan' ? '#000' : 'rgba(255,255,255,0.6)', fontSize: '0.72rem', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Grid size={12} /> Floor Plan View
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div style={{ padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
          <select style={{ padding: '7px 12px', borderRadius: '8px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '0.76rem', outline: 'none' }}
            value={selectedProjectFilter} onChange={e => setSelectedProjectFilter(e.target.value)}>
            <option value="ALL">All Projects</option>
            <option value="Lodha Hinjewadi">Lodha Hinjewadi</option>
            <option value="VTP Blue Waters">VTP Blue Waters</option>
            <option value="Godrej Hillside">Godrej Hillside</option>
            <option value="Kolte Patil Life Republic">Kolte Patil Life Republic</option>
          </select>

          <select style={{ padding: '7px 12px', borderRadius: '8px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '0.76rem', outline: 'none' }}>
            <option>All Towers</option>
            <option>Tower 1</option>
            <option>Tower 2</option>
            <option>Tower 3</option>
          </select>

          <select style={{ padding: '7px 12px', borderRadius: '8px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '0.76rem', outline: 'none' }}
            value={bhkFilter} onChange={e => setBhkFilter(e.target.value)}>
            <option value="ALL">All BHK</option>
            <option value="1 BHK">1 BHK</option>
            <option value="2 BHK">2 BHK</option>
            <option value="3 BHK">3 BHK</option>
          </select>

          <select style={{ padding: '7px 12px', borderRadius: '8px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '0.76rem', outline: 'none' }}
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="ALL">All Status</option>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="ON HOLD">ON HOLD</option>
            <option value="BOOKED">BOOKED</option>
            <option value="SOLD">SOLD</option>
          </select>

          <select style={{ padding: '7px 12px', borderRadius: '8px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '0.76rem', outline: 'none' }}>
            <option>Price Range</option>
            <option>Under ₹80 L</option>
            <option>₹80 L - ₹1.5 Cr</option>
            <option>Above ₹1.5 Cr</option>
          </select>

          <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input placeholder="Search by unit no..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '7px 10px 7px 30px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#FFF', fontSize: '0.76rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <button onClick={() => { setSelectedProjectFilter('ALL'); setStatusFilter('ALL'); setBhkFilter('ALL'); setSearchQuery(''); }}
            style={{ padding: '7px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: '0.74rem', cursor: 'pointer' }}>
            Reset
          </button>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.015)' }}>
                {['UNIT NO.', 'PROJECT', 'TOWER', 'FLOOR', 'TYPE', 'CARPET AREA', 'PRICE', 'STATUS', 'ASSIGNED TO', 'LAST UPDATED', 'ACTIONS'].map(h => (
                  <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.62rem', fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUnits.map((u, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 14px', fontSize: '0.76rem', fontWeight: 800, color: GOLD, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{u.unitNo}</td>
                  <td style={{ padding: '12px 14px', fontSize: '0.78rem', fontWeight: 700, color: '#FFF', whiteSpace: 'nowrap' }}>{u.project}</td>
                  <td style={{ padding: '12px 14px', fontSize: '0.74rem', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>{u.tower}</td>
                  <td style={{ padding: '12px 14px', fontSize: '0.74rem', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>{u.floor}</td>
                  <td style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: 700, color: '#3B82F6', whiteSpace: 'nowrap' }}>{u.bhk}</td>
                  <td style={{ padding: '12px 14px', fontSize: '0.74rem', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>{u.area}</td>
                  <td style={{ padding: '12px 14px', fontSize: '0.82rem', fontWeight: 900, color: GOLD, whiteSpace: 'nowrap' }}>{u.price}</td>
                  <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>{statusBadge(u.status)}</td>
                  <td style={{ padding: '12px 14px', fontSize: '0.76rem', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>{u.assignedTo}</td>
                  <td style={{ padding: '12px 14px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>{u.updated}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button style={{ width: 26, height: 26, borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Eye size={12} /></button>
                      <button style={{ width: 26, height: 26, borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit2 size={12} /></button>
                      <button style={{ width: 26, height: 26, borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MoreVertical size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '12px 16px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Showing 1 to {filteredUnits.length} of 1,256 units</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 3, 4, 5, 180].map((p, i) => (
                <button key={i} style={{ width: 24, height: 24, borderRadius: '4px', background: p === 1 ? GOLD : 'rgba(255,255,255,0.04)', border: 'none', color: p === 1 ? '#000' : 'rgba(255,255,255,0.6)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>{p}</button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── ADD PROJECT MODAL ── */}
      {showAddProjectModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#070F1E', border: `1px solid ${GOLD}30`, borderRadius: '16px', width: '100%', maxWidth: '560px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#FFF' }}>🏗️ Add New Builder Project</div>
              <button onClick={() => setShowAddProjectModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>PROJECT NAME *</label>
                <input placeholder="e.g. Shapoorji Joyville" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>DEVELOPER *</label>
                <input placeholder="e.g. Shapoorji Pallonji" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>LOCATION *</label>
                <input placeholder="e.g. Hinjewadi Phase 1" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>TOTAL UNITS</label>
                <input type="number" placeholder="250" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowAddProjectModal(false)} style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { setShowAddProjectModal(false); alert('Project Added!'); }} style={{ padding: '8px 20px', borderRadius: '8px', background: GOLD, border: 'none', color: '#000', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>Save Project</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD UNIT MODAL ── */}
      {showAddUnitModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#070F1E', border: `1px solid ${GOLD}30`, borderRadius: '16px', width: '100%', maxWidth: '540px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#FFF' }}>🔑 Add New Unit / Inventory</div>
              <button onClick={() => setShowAddUnitModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>UNIT NO. *</label>
                <input placeholder="T3-1402" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>PROJECT</label>
                <select style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none' }}>
                  <option>Lodha Hinjewadi</option>
                  <option>VTP Blue Waters</option>
                  <option>Godrej Hillside</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>CARPET AREA</label>
                <input placeholder="1150 sq.ft." style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>AGREEMENT PRICE</label>
                <input placeholder="₹1.25 Cr" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowAddUnitModal(false)} style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { setShowAddUnitModal(false); alert('Unit Inventory Added!'); }} style={{ padding: '8px 20px', borderRadius: '8px', background: GOLD, border: 'none', color: '#000', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>Add Unit</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
