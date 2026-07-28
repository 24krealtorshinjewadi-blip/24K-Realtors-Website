// ═══════════════════════════════════════════════════════════════════════════
// 24K REALTORS — My Leads Desk Component
// 1:1 Screenshot Design Matching
// Features:
//   - Header & Breadcrumbs (Dashboard > My Leads)
//   - Import Leads & + Add New Lead Action Buttons
//   - 6 KPI Sparkline Cards (Total Leads 128, New Leads 32, Contacted 48, Qualified 28, Site Visit 14, Converted 6)
//   - Multi-Filter Bar (Search, Source, Status, Property Interest, Budget, Date Range, Filters, Reset)
//   - High-Fidelity Data Table (Lead Details, Contact Info, Source, Property Interest, Budget, Status, Assigned On, Last Activity, Actions)
//   - Table Footer Pagination (< 1 2 3 4 5 >)
//   - Bottom Grid: Lead Source Distribution Donut + Lead Status Overview Bar Chart + Quick Actions Tiles
// ═══════════════════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import {
  Users, UserCheck, MessageSquare, Calendar, Award, Plus, Upload, Filter,
  RotateCcw, Search, Phone, Edit2, MoreVertical, ChevronLeft, ChevronRight,
  TrendingUp, Download, Eye, Sparkles
} from 'lucide-react';

const GOLD = '#D4AF37';

const Sparkline = ({ color = GOLD }) => (
  <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
    <path d="M0 16 Q 15 4, 30 10 T 60 2" stroke={color} strokeWidth="2" fill="none" />
  </svg>
);

export default function MyLeadsTab({ onOpenAddLead, onSelectLead }) {
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [propertyFilter, setPropertyFilter] = useState('ALL');
  const [budgetFilter, setBudgetFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const leadsData = [
    {
      id: '1',
      initials: 'RS',
      avatarBg: '#2563EB',
      name: 'Rohit Sharma',
      sub: 'Looking for 2 BHK',
      phone: '+91 98765 43210',
      email: 'rohit.sharma@email.com',
      source: 'Website',
      sourceColor: '#F59E0B',
      propertyInterest: '2 BHK Apartment',
      location: 'Hinjewadi',
      budget: '₹ 70 - 90 L',
      status: 'New',
      statusColor: '#3B82F6',
      statusBg: 'rgba(59,130,246,0.15)',
      assignedOn: '28 Jul 2026',
      lastActivity: '28 Jul 2026 10:30 AM',
    },
    {
      id: '2',
      initials: 'SP',
      avatarBg: '#10B981',
      name: 'Sneha Patil',
      sub: 'Investment purpose',
      phone: '+91 87654 32109',
      email: 'sneha.patil@email.com',
      source: 'Referral',
      sourceColor: '#10B981',
      propertyInterest: '2 BHK Apartment',
      location: 'Wakad',
      budget: '₹ 60 - 80 L',
      status: 'Contacted',
      statusColor: '#14B8A6',
      statusBg: 'rgba(20,184,166,0.15)',
      assignedOn: '27 Jul 2026',
      lastActivity: '27 Jul 2026 04:15 PM',
    },
    {
      id: '3',
      initials: 'AM',
      avatarBg: '#8B5CF6',
      name: 'Amit Verma',
      sub: 'End user',
      phone: '+91 76543 21098',
      email: 'amit.verma@email.com',
      source: 'Facebook Ads',
      sourceColor: '#8B5CF6',
      propertyInterest: '3 BHK Apartment',
      location: 'Hinjewadi',
      budget: '₹ 90 L - 1.2 Cr',
      status: 'Qualified',
      statusColor: '#10B981',
      statusBg: 'rgba(16,185,129,0.15)',
      assignedOn: '27 Jul 2026',
      lastActivity: '27 Jul 2026 02:45 PM',
    },
    {
      id: '4',
      initials: 'NS',
      avatarBg: '#EC4899',
      name: 'Neha Singh',
      sub: 'Looking for 1 BHK',
      phone: '+91 65432 10987',
      email: 'neha.singh@email.com',
      source: 'Instagram',
      sourceColor: '#EC4899',
      propertyInterest: '1 BHK Apartment',
      location: 'Tathawade',
      budget: '₹ 45 - 55 L',
      status: 'Site Visit',
      statusColor: '#8B5CF6',
      statusBg: 'rgba(139,92,246,0.15)',
      assignedOn: '26 Jul 2026',
      lastActivity: '28 Jul 2026 09:10 AM',
    },
    {
      id: '5',
      initials: 'RM',
      avatarBg: '#3B82F6',
      name: 'Raj Malhotra',
      sub: 'Premium 3 BHK',
      phone: '+91 54321 09876',
      email: 'raj.malhotra@email.com',
      source: 'Google Ads',
      sourceColor: '#3B82F6',
      propertyInterest: '3 BHK Apartment',
      location: 'Baner',
      budget: '₹ 1.2 - 1.6 Cr',
      status: 'Negotiation',
      statusColor: '#F59E0B',
      statusBg: 'rgba(245,158,11,0.15)',
      assignedOn: '25 Jul 2026',
      lastActivity: '27 Jul 2026 06:30 PM',
    },
    {
      id: '6',
      initials: 'PK',
      avatarBg: '#F59E0B',
      name: 'Pooja Kulkarni',
      sub: 'First time buyer',
      phone: '+91 43210 98765',
      email: 'pooja.kulkarni@email.com',
      source: 'Walk-in',
      sourceColor: '#14B8A6',
      propertyInterest: '2 BHK Apartment',
      location: 'Hinjewadi',
      budget: '₹ 55 - 75 L',
      status: 'New',
      statusColor: '#3B82F6',
      statusBg: 'rgba(59,130,246,0.15)',
      assignedOn: '25 Jul 2026',
      lastActivity: '25 Jul 2026 11:20 AM',
    },
    {
      id: '7',
      initials: 'DG',
      avatarBg: '#B45309',
      name: 'Deepak Gupta',
      sub: 'Investment',
      phone: '+91 32109 87654',
      email: 'deepak.gupta@email.com',
      source: 'Referral',
      sourceColor: '#10B981',
      propertyInterest: '2 BHK Apartment',
      location: 'Punawale',
      budget: '₹ 60 - 85 L',
      status: 'Contacted',
      statusColor: '#14B8A6',
      statusBg: 'rgba(20,184,166,0.15)',
      assignedOn: '24 Jul 2026',
      lastActivity: '24 Jul 2026 03:50 PM',
    },
  ];

  const filteredLeads = leadsData.filter(item => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.phone.includes(search) && !item.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (sourceFilter !== 'ALL' && item.source !== sourceFilter) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '40px' }}>

      {/* ── HEADER BREADCRUMB ROW ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
            Dashboard &gt; <span style={{ color: GOLD, fontWeight: 700 }}>My Leads</span>
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#FFF', margin: 0, fontFamily: "'Inter', sans-serif" }}>My Leads</h1>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginTop: '3px' }}>Manage and track all your leads in one place.</div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Upload size={14} /> Import Leads
          </button>
          <button onClick={onOpenAddLead} style={{ padding: '8px 18px', borderRadius: '8px', background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, border: 'none', color: '#070D18', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={15} /> Add New Lead
          </button>
        </div>
      </div>

      {/* ── 6 KPI SPARKLINE CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
        {[
          { label: 'Total Leads', val: '128', change: '↑ 18% vs last month', color: GOLD, icon: Users },
          { label: 'New Leads', val: '32', change: '↑ 14% vs last month', color: '#3B82F6', icon: UserCheck },
          { label: 'Contacted', val: '48', change: '↑ 12% vs last month', color: '#14B8A6', icon: Phone },
          { label: 'Qualified', val: '28', change: '↑ 8% vs last month', color: '#10B981', icon: Award },
          { label: 'Site Visit', val: '14', change: '↑ 5% vs last month', color: '#8B5CF6', icon: Calendar },
          { label: 'Converted', val: '6', change: '↑ 20% vs last month', color: GOLD, icon: Award },
        ].map((kpi, i) => {
          const IconC = kpi.icon;
          return (
            <div key={i} style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>{kpi.label}</span>
                  <div style={{ width: 22, height: 22, borderRadius: '6px', background: `${kpi.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconC size={12} color={kpi.color} />
                  </div>
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FFF', marginBottom: '3px' }}>{kpi.val}</div>
                <div style={{ fontSize: '0.62rem', color: '#10B981', fontWeight: 700 }}>{kpi.change}</div>
              </div>
              <div style={{ marginTop: '8px' }}>
                <Sparkline color={kpi.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MULTI-FILTER BAR ── */}
      <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
          
          {/* Search */}
          <div style={{ position: 'relative', width: 220 }}>
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '7px 12px 7px 32px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.76rem', outline: 'none', boxSizing: 'border-box' }}
            />
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
          </div>

          {/* Lead Source */}
          <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}
            style={{ padding: '7px 12px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.74rem', outline: 'none' }}>
            <option value="ALL" style={{ background: '#070F1E' }}>All Sources</option>
            <option value="Website" style={{ background: '#070F1E' }}>Website</option>
            <option value="Referral" style={{ background: '#070F1E' }}>Referral</option>
            <option value="Facebook Ads" style={{ background: '#070F1E' }}>Facebook Ads</option>
            <option value="Instagram" style={{ background: '#070F1E' }}>Instagram</option>
            <option value="Google Ads" style={{ background: '#070F1E' }}>Google Ads</option>
            <option value="Walk-in" style={{ background: '#070F1E' }}>Walk-in</option>
          </select>

          {/* Status */}
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '7px 12px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.74rem', outline: 'none' }}>
            <option value="ALL" style={{ background: '#070F1E' }}>All Status</option>
            <option value="New" style={{ background: '#070F1E' }}>New</option>
            <option value="Contacted" style={{ background: '#070F1E' }}>Contacted</option>
            <option value="Qualified" style={{ background: '#070F1E' }}>Qualified</option>
            <option value="Site Visit" style={{ background: '#070F1E' }}>Site Visit</option>
            <option value="Negotiation" style={{ background: '#070F1E' }}>Negotiation</option>
            <option value="Converted" style={{ background: '#070F1E' }}>Converted</option>
          </select>

          {/* Property Interest */}
          <select value={propertyFilter} onChange={e => setPropertyFilter(e.target.value)}
            style={{ padding: '7px 12px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.74rem', outline: 'none' }}>
            <option value="ALL" style={{ background: '#070F1E' }}>All Property Interests</option>
            <option value="1BHK" style={{ background: '#070F1E' }}>1 BHK Apartment</option>
            <option value="2BHK" style={{ background: '#070F1E' }}>2 BHK Apartment</option>
            <option value="3BHK" style={{ background: '#070F1E' }}>3 BHK Apartment</option>
          </select>

          {/* Budget */}
          <select value={budgetFilter} onChange={e => setBudgetFilter(e.target.value)}
            style={{ padding: '7px 12px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.74rem', outline: 'none' }}>
            <option value="ALL" style={{ background: '#070F1E' }}>All Budget</option>
            <option value="50L" style={{ background: '#070F1E' }}>Below ₹ 50 L</option>
            <option value="50L-1Cr" style={{ background: '#070F1E' }}>₹ 50 L - 1 Cr</option>
            <option value="1Cr+" style={{ background: '#070F1E' }}>Above ₹ 1 Cr</option>
          </select>

          {/* Date Range */}
          <div style={{ padding: '7px 12px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            01 Jul 2026 - 28 Jul 2026 <Calendar size={13} color={GOLD} />
          </div>

        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button style={{ padding: '7px 14px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Filter size={13} color={GOLD} /> Filters
          </button>
          <button onClick={() => { setSearch(''); setSourceFilter('ALL'); setStatusFilter('ALL'); }}
            style={{ padding: '7px 12px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '0.74rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* ── LEADS TABLE ── */}
      <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '16px 20px' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontSize: '0.64rem', letterSpacing: '0.07em' }}>
                <th style={{ padding: '12px 10px' }}>LEAD DETAILS</th>
                <th style={{ padding: '12px 10px' }}>CONTACT INFO</th>
                <th style={{ padding: '12px 10px' }}>SOURCE</th>
                <th style={{ padding: '12px 10px' }}>PROPERTY INTEREST</th>
                <th style={{ padding: '12px 10px' }}>BUDGET</th>
                <th style={{ padding: '12px 10px' }}>STATUS</th>
                <th style={{ padding: '12px 10px' }}>ASSIGNED ON</th>
                <th style={{ padding: '12px 10px' }}>LAST ACTIVITY</th>
                <th style={{ padding: '12px 10px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  
                  {/* Lead Details */}
                  <td style={{ padding: '14px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: lead.avatarBg, color: '#FFF', fontWeight: 900, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {lead.initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#FFF', cursor: 'pointer' }} onClick={() => onSelectLead?.(lead)}>{lead.name}</div>
                        <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{lead.sub}</div>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td style={{ padding: '14px 10px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#FFF', fontWeight: 700 }}>📞 {lead.phone}</div>
                    <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>✉️ {lead.email}</div>
                  </td>

                  {/* Source */}
                  <td style={{ padding: '14px 10px' }}>
                    <span style={{ fontSize: '0.66rem', fontWeight: 800, padding: '3px 9px', borderRadius: '6px', background: `${lead.sourceColor}20`, border: `1px solid ${lead.sourceColor}40`, color: lead.sourceColor }}>
                      {lead.source}
                    </span>
                  </td>

                  {/* Property Interest */}
                  <td style={{ padding: '14px 10px' }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#FFF' }}>{lead.propertyInterest}</div>
                    <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)' }}>{lead.location}</div>
                  </td>

                  {/* Budget */}
                  <td style={{ padding: '14px 10px', fontSize: '0.8rem', fontWeight: 800, color: GOLD }}>
                    {lead.budget}
                  </td>

                  {/* Status */}
                  <td style={{ padding: '14px 10px' }}>
                    <span style={{ fontSize: '0.66rem', fontWeight: 800, padding: '3px 10px', borderRadius: '12px', background: lead.statusBg, color: lead.statusColor, border: `1px solid ${lead.statusColor}40`, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: lead.statusColor }} />
                      {lead.status}
                    </span>
                  </td>

                  {/* Assigned On */}
                  <td style={{ padding: '14px 10px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>
                    {lead.assignedOn}
                  </td>

                  {/* Last Activity */}
                  <td style={{ padding: '14px 10px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>
                    {lead.lastActivity}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 10px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <a href={`tel:${lead.phone}`} style={{ width: 28, height: 28, borderRadius: '6px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Phone size={13} />
                      </a>
                      <button style={{ width: 28, height: 28, borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Edit2 size={13} />
                      </button>
                      <button style={{ width: 28, height: 28, borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MoreVertical size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.74rem', color: 'rgba(255,255,255,0.5)', flexWrap: 'wrap', gap: '10px' }}>
          <div>Showing 1 to 7 of 128 leads</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div>
              Rows per page: <select style={{ background: '#070F1E', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '2px 6px' }}><option>10</option><option>25</option></select>
            </div>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <button style={{ width: 26, height: 26, borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>&lt;</button>
              <button style={{ width: 26, height: 26, borderRadius: '4px', background: GOLD, border: 'none', color: '#000', fontWeight: 800 }}>1</button>
              <button style={{ width: 26, height: 26, borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>2</button>
              <button style={{ width: 26, height: 26, borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>3</button>
              <button style={{ width: 26, height: 26, borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>4</button>
              <button style={{ width: 26, height: 26, borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>5</button>
              <button style={{ width: 26, height: 26, borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>&gt;</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ANALYTICS & QUICK ACTIONS GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', alignItems: 'stretch' }}>

        {/* Donut Chart: Lead Source Distribution */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF', marginBottom: '14px' }}>Lead Source Distribution</div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: `conic-gradient(#F59E0B 0% 35.2%, #10B981 35.2% 57.1%, #8B5CF6 57.1% 72.7%, #3B82F6 72.7% 86.8%, #EC4899 86.8% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 62, height: 62, borderRadius: '50%', background: '#070F1E' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.68rem' }}>
              <div style={{ color: '#F59E0B' }}>• Website 45 (35.2%)</div>
              <div style={{ color: '#10B981' }}>• Referral 28 (21.9%)</div>
              <div style={{ color: '#8B5CF6' }}>• Facebook Ads 20 (15.6%)</div>
              <div style={{ color: '#3B82F6' }}>• Google Ads 18 (14.1%)</div>
              <div style={{ color: '#EC4899' }}>• Instagram 17 (13.2%)</div>
            </div>
          </div>
        </div>

        {/* Bar Chart: Lead Status Overview */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF', marginBottom: '14px' }}>Lead Status Overview</div>

          <div style={{ height: 90, display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
            {[
              { label: 'New', count: 32, color: '#3B82F6' },
              { label: 'Contacted', count: 48, color: '#14B8A6' },
              { label: 'Qualified', count: 28, color: '#10B981' },
              { label: 'Site Visit', count: 14, color: '#8B5CF6' },
              { label: 'Negotiation', count: 10, color: '#F59E0B' },
              { label: 'Converted', count: 6, color: GOLD },
            ].map((bar, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.6rem', color: '#FFF', fontWeight: 800 }}>{bar.count}</span>
                <div style={{ width: '100%', height: `${bar.count * 1.5}px`, background: bar.color, borderRadius: '4px 4px 0 0' }} />
                <span style={{ fontSize: '0.54rem', color: 'rgba(255,255,255,0.4)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF', marginBottom: '14px' }}>Quick Actions</div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
            {[
              { label: 'Add New Lead', icon: Plus, action: onOpenAddLead, color: GOLD },
              { label: 'Add Follow-up', icon: Phone, action: () => {}, color: '#10B981' },
              { label: 'Schedule Visit', icon: Calendar, action: () => {}, color: '#3B82F6' },
              { label: 'View All Leads', icon: Users, action: () => {}, color: '#8B5CF6' },
              { label: 'Import Leads', icon: Upload, action: () => {}, color: '#EC4899' },
            ].map((qa, i) => {
              const IconC = qa.icon;
              return (
                <div key={i} onClick={qa.action}
                  style={{ padding: '10px 4px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', textAlign: 'center' }}>
                  <IconC size={15} color={qa.color} />
                  <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, lineHeight: 1.2 }}>{qa.label}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
