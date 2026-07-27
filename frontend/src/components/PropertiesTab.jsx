import React, { useState } from 'react';
import { 
  Building, Home, Plus, Upload, Download, Search, Filter, Sliders, Eye, Edit2, 
  MoreVertical, Share2, ChevronRight, ArrowLeft, CheckCircle2, Clock, DollarSign,
  TrendingUp, BarChart3, PieChart, Star, MapPin, Award, FileText, Activity, Layers, Grid, List
} from 'lucide-react';

// ─── SVG Donut Component for Inventory Overview ──────────────────────────────
function InventoryDonut() {
  const size = 130;
  const strokeWidth = 18;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  // Available 342 (58.1%), On Hold 28 (8.4%), Booked 56 (15.9%), Sold 128 (21.6%)
  const segments = [
    { percent: 58.1, color: '#10B981', label: 'Available', val: '342 (58.1%)' },
    { percent: 8.4, color: '#F59E0B', label: 'On Hold', val: '28 (8.4%)' },
    { percent: 15.9, color: '#3B82F6', label: 'Booked', val: '56 (15.9%)' },
    { percent: 21.6, color: '#64748B', label: 'Sold', val: '128 (21.6%)' }
  ];

  let currentOffset = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          {segments.map((st, i) => {
            const dash = (st.percent / 100) * circumference;
            const gap = circumference - dash;
            const offset = currentOffset;
            currentOffset += dash;
            return (
              <circle
                key={i}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={st.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={-offset}
              />
            );
          })}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', fontFamily: "'Cinzel', serif" }}>342</span>
          <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.45)' }}>Total Units</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {segments.map((st, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: st.color }} />
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>{st.label}</span>
            </div>
            <span style={{ fontWeight: 700, color: '#FFF' }}>{st.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SVG Unit Type Donut Component ─────────────────────────────────────────
function UnitTypeDonut() {
  const size = 110;
  const strokeWidth = 16;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  // 2 BHK 45 (51.7%), 3 BHK 32 (36.8%), 4 BHK 10 (11.5%)
  const segments = [
    { percent: 51.7, color: '#10B981', label: '2 BHK', val: '45 (51.7%)' },
    { percent: 36.8, color: '#3B82F6', label: '3 BHK', val: '32 (36.8%)' },
    { percent: 11.5, color: '#F59E0B', label: '4 BHK', val: '10 (11.5%)' }
  ];

  let currentOffset = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          {segments.map((st, i) => {
            const dash = (st.percent / 100) * circumference;
            const gap = circumference - dash;
            const offset = currentOffset;
            currentOffset += dash;
            return (
              <circle
                key={i}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={st.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={-offset}
              />
            );
          })}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFF', fontFamily: "'Cinzel', serif" }}>87</span>
          <span style={{ fontSize: '0.56rem', color: 'rgba(255,255,255,0.45)' }}>Total Units</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {segments.map((st, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: st.color }} />
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>{st.label}</span>
            </div>
            <span style={{ fontWeight: 700, color: '#FFF' }}>{st.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SVG Price Bar Chart Component ──────────────────────────────────────────
function PriceBarChart() {
  const bars = [
    { label: '< ₹80 L', count: 12, height: 35 },
    { label: '₹80 L - ₹1.2 Cr', count: 38, height: 90 },
    { label: '₹1.2 Cr - ₹1.8 Cr', count: 25, height: 60 },
    { label: '> ₹1.8 Cr', count: 12, height: 35 }
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '110px', paddingTop: '20px' }}>
      {bars.map((b, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '6px' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#FFF' }}>{b.count}</span>
          <div style={{ width: '32px', height: `${b.height}px`, background: '#3B82F6', borderRadius: '4px 4px 0 0', boxShadow: '0 0 10px rgba(59,130,246,0.3)' }} />
          <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>{b.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function PropertiesTab() {
  const [activeView, setActiveView] = useState('MAIN'); // 'MAIN' or 'DETAIL'
  const [subTab, setSubTab] = useState('ALL');
  const [detailSubTab, setDetailSubTab] = useState('INVENTORY');

  // Sample projects data
  const projects = [
    {
      id: 'proj-1',
      title: 'Lodha Hinjewadi',
      featured: true,
      location: 'Hinjewadi Phase 3, Pune',
      builder: 'Lodha Group',
      bhk: '2, 3 BHK Apartments',
      price: '₹85 L - ₹1.65 Cr',
      possession: 'Possession: Dec 2028',
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
      available: 42, onHold: 5, booked: 12, sold: 28
    },
    {
      id: 'proj-2',
      title: 'VTP Blue Waters',
      featured: false,
      location: 'Hinjewadi Phase 1, Pune',
      builder: 'VTP Realty',
      bhk: '2, 3 BHK Apartments',
      price: '₹75 L - ₹1.45 Cr',
      possession: 'Possession: Jun 2027',
      img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
      available: 68, onHold: 6, booked: 18, sold: 34
    },
    {
      id: 'proj-3',
      title: 'Godrej Hillside',
      featured: false,
      location: 'Maan, Hinjewadi, Pune',
      builder: 'Godrej Properties',
      bhk: '2, 3, 4 BHK Apartments',
      price: '₹95 L - ₹2.10 Cr',
      possession: 'Possession: Mar 2029',
      img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
      available: 31, onHold: 4, booked: 10, sold: 22
    },
    {
      id: 'proj-4',
      title: 'Kolte Patil Life Republic',
      featured: false,
      location: 'Hinjewadi Phase 5, Pune',
      builder: 'Kolte Patil Developers',
      bhk: '2, 3 BHK Apartments',
      price: '₹60 L - ₹1.20 Cr',
      possession: 'Possession: Dec 2026',
      img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80',
      available: 21, onHold: 3, booked: 10, sold: 15
    }
  ];

  // Inventory units for Lodha Hinjewadi detail view
  const inventoryUnits = [
    { unitNo: 'T3-1204', tower: 'Tower 3', floor: '12th Floor', bhk: '2 BHK', area: '1050 sq.ft', price: '₹1.20 Cr', status: 'AVAILABLE', assigned: 'Manish Rai', updated: '25 Jul 2026' },
    { unitNo: 'T3-1205', tower: 'Tower 3', floor: '12th Floor', bhk: '2 BHK', area: '1050 sq.ft', price: '₹1.18 Cr', status: 'ON HOLD', assigned: 'Jyoti Dhale', updated: '24 Jul 2026' },
    { unitNo: 'T3-1301', tower: 'Tower 3', floor: '13th Floor', bhk: '3 BHK', area: '1450 sq.ft', price: '₹1.65 Cr', status: 'BOOKED', assigned: 'Yash Murkute', updated: '23 Jul 2026' },
    { unitNo: 'T2-804', tower: 'Tower 2', floor: '8th Floor', bhk: '2 BHK', area: '980 sq.ft', price: '₹95.0 L', status: 'AVAILABLE', assigned: '—', updated: '22 Jul 2026' },
    { unitNo: 'T1-1502', tower: 'Tower 1', floor: '15th Floor', bhk: '3 BHK', area: '1400 sq.ft', price: '₹1.55 Cr', status: 'SOLD', assigned: 'Rohini K.', updated: '20 Jul 2026' },
  ];

  // Render View 1: Main Properties Overview
  if (activeView === 'MAIN') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#FFF' }}>
        
        {/* TOP HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', margin: 0 }}>Properties &amp; Inventory</h2>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', margin: '2px 0 0' }}>Manage projects, properties and unit inventory</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button style={{ padding: '7px 14px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={13} /> Add Project
            </button>
            <button style={{ padding: '8px 16px', borderRadius: '7px', background: 'linear-gradient(135deg, var(--gold-primary), #B8860B)', border: 'none', color: '#070D18', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={15} /> Add Property / Unit
            </button>
            <button style={{ padding: '7px 12px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Upload size={13} /> Import
            </button>
            <button style={{ padding: '7px 12px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Download size={13} /> Export
            </button>
          </div>
        </div>

        {/* 6 TOP KPI METRIC CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px' }}>
          {[
            { label: 'Total Projects', val: '24', change: '↑ 20.0% vs last month', icon: Building, color: '#F59E0B' },
            { label: 'Active Projects', val: '18', change: '↑ 12.5% vs last month', icon: Home, color: '#10B981' },
            { label: 'Available Units', val: '342', change: '↑ 14.3% vs last month', icon: Layers, color: '#F59E0B' },
            { label: 'On Hold', val: '28', change: '↓ 5.1% vs last month', icon: Clock, color: '#EF4444' },
            { label: 'Booked', val: '56', change: '↑ 18.4% vs last month', icon: CheckCircle2, color: '#3B82F6' },
            { label: 'Sold', val: '128', change: '↑ 16.7% vs last month', icon: DollarSign, color: '#F59E0B' },
          ].map((card, i) => {
            const IconC = card.icon;
            return (
              <div key={i} style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconC size={16} color={card.color} />
                </div>
                <div>
                  <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700 }}>{card.label}</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF', fontFamily: "'Cinzel', serif", margin: '2px 0' }}>{card.val}</div>
                  <span style={{ fontSize: '0.64rem', color: card.change.includes('↓') ? '#EF4444' : '#10B981', fontWeight: 600 }}>{card.change}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* MAIN SPLIT VIEW: LEFT CONTENT (~70%) + RIGHT SIDEBAR (~30%) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
          
          {/* LEFT: PROJECTS CARDS GRID & FILTERS */}
          <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Sub-tabs */}
            <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
              {['All Properties', 'My Properties', 'Projects', 'Available Units', 'On Hold', 'Booked', 'Sold'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setSubTab(tab)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: subTab === tab ? 'rgba(212,175,55,0.15)' : 'transparent',
                    color: subTab === tab ? 'var(--gold-primary)' : 'rgba(255,255,255,0.5)',
                    fontSize: '0.74rem',
                    fontWeight: subTab === tab ? 700 : 500,
                    cursor: 'pointer',
                    borderBottom: subTab === tab ? '2px solid var(--gold-primary)' : '2px solid transparent'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Filter Controls Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
                <input type="text" placeholder="Search by project / location" style={{ width: '100%', padding: '6px 12px 6px 30px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.74rem', outline: 'none' }} />
                <Search size={12} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
              </div>
              
              {['Location', 'Builder', 'BHK Type', 'Budget', 'Status', 'Possession'].map((flt, idx) => (
                <select key={idx} style={{ padding: '6px 10px', borderRadius: '6px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', outline: 'none' }}>
                  <option>{flt} ▾</option>
                </select>
              ))}

              <button style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', cursor: 'pointer' }}>Reset</button>
              <button style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--gold-primary)', color: 'var(--gold-primary)', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Filter size={12} /> Filter
              </button>
            </div>

            {/* 4 Project Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              {projects.map((p) => (
                <div key={p.id} style={{ background: '#070F1E', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', height: '120px' }}>
                    <img src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {p.featured && (
                      <span style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--gold-primary)', color: '#070D18', fontSize: '0.58rem', fontWeight: 900, padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.04em' }}>
                        FEATURED
                      </span>
                    )}
                    <button style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#FFF', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Star size={11} />
                    </button>
                  </div>

                  <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFF' }}>{p.title}</div>
                      <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{p.location}</div>
                      <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)' }}>{p.builder}</div>
                    </div>

                    <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.6)' }}>{p.bhk}</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--gold-primary)', fontFamily: "'Cinzel', serif" }}>{p.price}</div>
                    <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>{p.possession}</div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', background: 'rgba(255,255,255,0.02)', padding: '6px 4px', borderRadius: '6px', textAlign: 'center', fontSize: '0.6rem' }}>
                      <div><div style={{ color: 'rgba(255,255,255,0.4)' }}>Available</div><div style={{ color: '#10B981', fontWeight: 800, fontSize: '0.78rem' }}>{p.available}</div></div>
                      <div><div style={{ color: 'rgba(255,255,255,0.4)' }}>On Hold</div><div style={{ color: '#F59E0B', fontWeight: 800, fontSize: '0.78rem' }}>{p.onHold}</div></div>
                      <div><div style={{ color: 'rgba(255,255,255,0.4)' }}>Booked</div><div style={{ color: '#3B82F6', fontWeight: 800, fontSize: '0.78rem' }}>{p.booked}</div></div>
                      <div><div style={{ color: 'rgba(255,255,255,0.4)' }}>Sold</div><div style={{ color: '#64748B', fontWeight: 800, fontSize: '0.78rem' }}>{p.sold}</div></div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', marginTop: 'auto', paddingTop: '6px' }}>
                      <button 
                        onClick={() => setActiveView('DETAIL')}
                        style={{ flex: 1, padding: '6px', borderRadius: '6px', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--gold-primary)', color: 'var(--gold-primary)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        View Project
                      </button>
                      <button style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Share2 size={12} /></button>
                      <button style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MoreVertical size={12} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT SIDEBAR WIDGETS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Widget 1: Inventory Overview Donut */}
            <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '18px' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFF', marginBottom: '14px' }}>Inventory Overview</div>
              <InventoryDonut />
            </div>

            {/* Widget 2: Unit Status Trend (This Month) */}
            <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '18px' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFF', marginBottom: '10px' }}>Unit Status Trend <span style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>(This Month)</span></div>
              <div style={{ width: '100%', height: '100px', position: 'relative' }}>
                <svg width="100%" height="80" viewBox="0 0 300 80" preserveAspectRatio="none">
                  <path d="M 0 30 Q 50 20, 100 25 T 200 15 T 300 10" stroke="#10B981" strokeWidth="2" fill="none" />
                  <path d="M 0 50 Q 50 45, 100 48 T 200 40 T 300 35" stroke="#3B82F6" strokeWidth="2" fill="none" />
                  <path d="M 0 65 Q 50 60, 100 62 T 200 55 T 300 50" stroke="#64748B" strokeWidth="2" fill="none" />
                  <path d="M 0 75 Q 50 72, 100 73 T 200 70 T 300 68" stroke="#F59E0B" strokeWidth="2" fill="none" />
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)' }}>
                  <span>1 Jul</span><span>8 Jul</span><span>15 Jul</span><span>22 Jul</span><span>31 Jul</span>
                </div>
              </div>
            </div>

            {/* Widget 3: Popular Locations */}
            <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '18px' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>Popular Locations</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.74rem' }}>
                {[
                  { loc: 'Hinjewadi Phase 3', units: '152 Units' },
                  { loc: 'Hinjewadi Phase 1', units: '98 Units' },
                  { loc: 'Hinjewadi Phase 2', units: '65 Units' },
                  { loc: 'Hinjewadi Phase 5', units: '27 Units' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={12} color="var(--gold-primary)" />
                      <span style={{ color: '#FFF', fontWeight: 600 }}>{item.loc}</span>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.68rem' }}>{item.units}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    );
  }

  // Render View 2: Detailed Project Inventory View (Lodha Hinjewadi)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#FFF' }}>
      
      {/* BREADCRUMBS & TOP ACTIONS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
          <button onClick={() => setActiveView('MAIN')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={14} /> Properties
          </button>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
          <span style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>Lodha Hinjewadi</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '7px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Share2 size={13} /> Share
          </button>
          <button style={{ padding: '7px 14px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer' }}>
            Add Unit
          </button>
          <button style={{ padding: '7px 16px', borderRadius: '6px', background: 'var(--gold-primary)', border: 'none', color: '#070D18', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer' }}>
            Edit Project
          </button>
        </div>
      </div>

      {/* PROJECT HEADER CARD & STATS */}
      <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '18px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=150&q=80" alt="Lodha" style={{ width: '120px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', margin: 0 }}>Lodha Hinjewadi</h2>
            <span style={{ fontSize: '0.6rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>Active</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>📍 Hinjewadi Phase 3, Pune | 🏢 Lodha Group | 📜 RERA: PS21000XXXX</div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>🏠 2, 3 BHK Apartments | 📅 Possession: Dec 2028</div>
        </div>

        {/* Project Stats Pills */}
        <div style={{ display: 'flex', gap: '14px', background: 'rgba(255,255,255,0.02)', padding: '12px 18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>Total Units</div><div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>87</div></div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>Available</div><div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10B981' }}>42</div><div style={{ fontSize: '0.58rem', color: '#10B981' }}>↑ 48.3%</div></div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>On Hold</div><div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F59E0B' }}>5</div><div style={{ fontSize: '0.58rem', color: '#F59E0B' }}>5.7%</div></div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>Booked</div><div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#3B82F6' }}>12</div><div style={{ fontSize: '0.58rem', color: '#3B82F6' }}>13.8%</div></div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>Sold</div><div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#64748B' }}>28</div><div style={{ fontSize: '0.58rem', color: '#10B981' }}>↑ 32.2%</div></div>
        </div>
      </div>

      {/* DETAIL SPLIT VIEW: LEFT INVENTORY TABLE (~68%) + RIGHT ANALYTICS (~32%) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
        
        {/* LEFT INVENTORY TABLE */}
        <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Detail Sub-tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['Overview', 'Inventory', 'Leads (32)', 'Site Visits (18)', 'Deals (11)', 'Documents', 'Activity'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setDetailSubTab(tab)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: detailSubTab === tab ? 'rgba(212,175,55,0.15)' : 'transparent',
                    color: detailSubTab === tab ? 'var(--gold-primary)' : 'rgba(255,255,255,0.5)',
                    fontSize: '0.74rem',
                    fontWeight: detailSubTab === tab ? 700 : 500,
                    cursor: 'pointer',
                    borderBottom: detailSubTab === tab ? '2px solid var(--gold-primary)' : '2px solid transparent'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button style={{ padding: '4px 10px', borderRadius: '5px', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--gold-primary)', color: 'var(--gold-primary)', fontSize: '0.68rem', fontWeight: 700 }}>Table View</button>
              <button style={{ padding: '4px 10px', borderRadius: '5px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '0.68rem' }}>Floor Plan View</button>
            </div>
          </div>

          {/* Unit Filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            {['Tower', 'Floor', 'Unit Type', 'Status', 'Price Range'].map((flt, idx) => (
              <select key={idx} style={{ padding: '5px 10px', borderRadius: '6px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', outline: 'none' }}>
                <option>{flt} ▾</option>
              </select>
            ))}
            <div style={{ position: 'relative', flex: 1 }}>
              <input type="text" placeholder="Search unit no..." style={{ width: '100%', padding: '5px 10px 5px 28px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.7rem', outline: 'none' }} />
              <Search size={11} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
            </div>
            <button style={{ padding: '5px 8px', borderRadius: '6px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', cursor: 'pointer' }}>Reset</button>
          </div>

          {/* Units Inventory Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.74rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontSize: '0.62rem', letterSpacing: '0.06em' }}>
                  <th style={{ padding: '10px' }}>UNIT NO.</th>
                  <th style={{ padding: '10px' }}>TOWER</th>
                  <th style={{ padding: '10px' }}>FLOOR</th>
                  <th style={{ padding: '10px' }}>BHK</th>
                  <th style={{ padding: '10px' }}>CARPET AREA</th>
                  <th style={{ padding: '10px' }}>PRICE</th>
                  <th style={{ padding: '10px' }}>STATUS</th>
                  <th style={{ padding: '10px' }}>ASSIGNED TO</th>
                  <th style={{ padding: '10px' }}>LAST UPDATED</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {inventoryUnits.map((u, i) => {
                  const statusBg = 
                    u.status === 'AVAILABLE' ? 'rgba(16,185,129,0.15)' :
                    u.status === 'ON HOLD' ? 'rgba(245,158,11,0.15)' :
                    u.status === 'BOOKED' ? 'rgba(59,130,246,0.15)' : 'rgba(100,116,139,0.15)';

                  const statusColor = 
                    u.status === 'AVAILABLE' ? '#10B981' :
                    u.status === 'ON HOLD' ? '#F59E0B' :
                    u.status === 'BOOKED' ? '#3B82F6' : '#94A3B8';

                  return (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 800, color: '#FFF' }}>{u.unitNo}</td>
                      <td style={{ padding: '12px 10px', color: 'rgba(255,255,255,0.7)' }}>{u.tower}</td>
                      <td style={{ padding: '12px 10px', color: 'rgba(255,255,255,0.7)' }}>{u.floor}</td>
                      <td style={{ padding: '12px 10px', color: '#FFF', fontWeight: 600 }}>{u.bhk}</td>
                      <td style={{ padding: '12px 10px', color: 'rgba(255,255,255,0.7)' }}>{u.area}</td>
                      <td style={{ padding: '12px 10px', color: 'var(--gold-primary)', fontWeight: 800 }}>{u.price}</td>
                      
                      <td style={{ padding: '12px 10px' }}>
                        <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '2px 7px', borderRadius: '4px', background: statusBg, color: statusColor }}>
                          {u.status}
                        </span>
                      </td>

                      <td style={{ padding: '12px 10px', color: 'rgba(255,255,255,0.8)' }}>{u.assigned}</td>
                      <td style={{ padding: '12px 10px', color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem' }}>{u.updated}</td>
                      
                      <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><Eye size={12} /></button>
                          <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><Edit2 size={12} /></button>
                          <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><MoreVertical size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT ANALYTICS SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Widget 1: Unit Type Distribution */}
          <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>Unit Type Distribution</div>
            <UnitTypeDonut />
          </div>

          {/* Widget 2: Price Range Distribution */}
          <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFF', marginBottom: '10px' }}>Price Range Distribution</div>
            <PriceBarChart />
          </div>

        </div>

      </div>

    </div>
  );
}
