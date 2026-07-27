import React, { useState } from 'react';
import { 
  Plus, Upload, Download, Search, Sliders, DollarSign, Trophy, 
  Briefcase, Target, Eye, Edit2, MoreVertical, X, Filter, CheckCircle2,
  Calendar, ArrowUpRight, ChevronRight, FileText, Share2, HelpCircle
} from 'lucide-react';
import { apiService } from '../services/apiService';

// Mock Initial Deals Data matching reference screenshot exactly
const initialDealsData = [
  {
    id: 'DEAL-2026-032',
    clientName: 'Rohan Sharma',
    clientPhone: '+91 98765 43210',
    propertyTitle: 'Lodha Hinjewadi - Tower 3',
    unitDetail: '2 BHK | 1050 Sq.ft.',
    dealValueDisplay: '₹1.20 Cr',
    dealValueNum: 12000000,
    stage: 'NEGOTIATION',
    assignedTo: 'Manish Rai',
    assignedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80',
    expectedClosing: '05 Aug 2026',
    probability: '65%',
    lastActivity: '25 Jul 2026',
    lastActivityType: 'Called'
  },
  {
    id: 'DEAL-2026-031',
    clientName: 'Priya Patel',
    clientPhone: '+91 91234 56789',
    propertyTitle: 'VTP Blue Waters - Tower A',
    unitDetail: '3 BHK | 1250 Sq.ft.',
    dealValueDisplay: '₹75.0 L',
    dealValueNum: 7500000,
    stage: 'PROPOSAL',
    assignedTo: 'Jyoti Jagtap',
    assignedAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=60&q=80',
    expectedClosing: '03 Aug 2026',
    probability: '50%',
    lastActivity: '24 Jul 2026',
    lastActivityType: 'Site Visit'
  },
  {
    id: 'DEAL-2026-030',
    clientName: 'Rahul Verma',
    clientPhone: '+91 77777 88888',
    propertyTitle: 'Panchshil Towers - Tower B',
    unitDetail: '4 BHK | 2100 Sq.ft.',
    dealValueDisplay: '₹1.45 Cr',
    dealValueNum: 14500000,
    stage: 'NEGOTIATION',
    assignedTo: 'Yash Murkute',
    assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80',
    expectedClosing: '10 Aug 2026',
    probability: '70%',
    lastActivity: '24 Jul 2026',
    lastActivityType: 'WhatsApp'
  },
  {
    id: 'DEAL-2026-029',
    clientName: 'Amit Singh',
    clientPhone: '+91 90909 09090',
    propertyTitle: 'Megapolis Symphony - Tower C',
    unitDetail: '3 BHK | 1500 Sq.ft.',
    dealValueDisplay: '₹82.0 L',
    dealValueNum: 8200000,
    stage: 'PROPOSAL',
    assignedTo: 'Rohini K.',
    assignedAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=60&q=80',
    expectedClosing: '02 Aug 2026',
    probability: '45%',
    lastActivity: '25 Jul 2026',
    lastActivityType: 'Email'
  },
  {
    id: 'DEAL-2026-028',
    clientName: 'Karan Mehta',
    clientPhone: '+91 80808 08008',
    propertyTitle: 'Lodha Hinjewadi - Tower 2',
    unitDetail: '3 BHK | 1300 Sq.ft.',
    dealValueDisplay: '₹1.05 Cr',
    dealValueNum: 10500000,
    stage: 'CLOSED WON',
    assignedTo: 'Manish Rai',
    assignedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80',
    expectedClosing: '20 Jul 2026',
    probability: '100%',
    lastActivity: '20 Jul 2026',
    lastActivityType: 'Agreement Signed'
  }
];

export default function DealsTab() {
  const [dealsList, setDealsList] = useState(initialDealsData);
  const [activeSubTab, setActiveSubTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeRowMenuId, setActiveRowMenuId] = useState(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Add Form State
  const [addForm, setAddForm] = useState({
    clientName: '',
    clientPhone: '',
    propertyTitle: 'Lodha Hinjewadi - Tower 3',
    unitDetail: '3 BHK | 1350 Sq.ft.',
    dealValue: '12000000',
    stage: 'QUALIFIED',
    assignedTo: 'Manish Rai',
    expectedClosing: '2026-08-15',
    probability: '60'
  });

  // Handle Add Deal Submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const valNum = parseInt(addForm.dealValue) || 10000000;
    const valDisp = valNum >= 10000000 ? `₹${(valNum / 10000000).toFixed(2)} Cr` : `₹${(valNum / 100000).toFixed(1)} L`;

    const newDeal = {
      id: `DEAL-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: addForm.clientName || 'New Client',
      clientPhone: addForm.clientPhone || '+91 98765 00000',
      propertyTitle: addForm.propertyTitle,
      unitDetail: addForm.unitDetail,
      dealValueDisplay: valDisp,
      dealValueNum: valNum,
      stage: addForm.stage,
      assignedTo: addForm.assignedTo,
      assignedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80',
      expectedClosing: addForm.expectedClosing,
      probability: `${addForm.probability}%`,
      lastActivity: 'Just Now',
      lastActivityType: 'Created'
    };

    setDealsList([newDeal, ...dealsList]);
    setIsAddModalOpen(false);
  };

  // Handle Delete Deal
  const handleDeleteDeal = (id) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      setDealsList(prev => prev.filter(d => d.id !== id));
      setActiveRowMenuId(null);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Deal ID', 'Client Name', 'Phone', 'Property', 'Value', 'Stage', 'Assigned To', 'Expected Closing', 'Probability'];
    const rows = dealsList.map(d => [
      d.id, `"${d.clientName}"`, `"${d.clientPhone}"`, `"${d.propertyTitle}"`, `"${d.dealValueDisplay}"`, d.stage, `"${d.assignedTo}"`, d.expectedClosing, d.probability
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `24k_deals_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered List
  const filteredList = dealsList.filter(d => {
    const matchesSearch = d.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeSubTab === 'ALL') return true;
    if (activeSubTab === 'MY_DEALS') return d.assignedTo === 'Manish Rai';
    if (activeSubTab === 'WON') return d.stage === 'CLOSED WON';
    if (activeSubTab === 'LOST') return d.stage === 'CLOSED LOST';
    if (activeSubTab === 'OPEN') return d.stage !== 'CLOSED WON' && d.stage !== 'CLOSED LOST';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#FFF' }}>
      
      {/* ── TOP HEADER BAR ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, fontFamily: "'Cinzel', serif", color: '#FFF' }}>Deals &amp; Closures</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
            Track your deals, manage pipeline &amp; close more business.
          </p>
        </div>

        {/* Search Bar + Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
            <input 
              type="text"
              placeholder="Search leads, clients, properties... Ctrl+K"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: '8px',
                background: 'rgba(10, 18, 36, 0.85)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#FFF',
                fontSize: '0.76rem',
                outline: 'none'
              }}
            />
          </div>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--gold-primary), #B8860B)',
              border: 'none',
              color: '#070D18',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Plus size={15} /> + Add New Deal
          </button>

          <button 
            onClick={() => setIsImportModalOpen(true)}
            style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Upload size={14} /> Import
          </button>

          <button 
            onClick={handleExportCSV}
            style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* ── TOP 5 KPI METRIC CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px' }}>
        {[
          { label: 'TOTAL PIPELINE VALUE', val: '₹4.82 Cr', change: '↑ 18.6% vs last month', icon: DollarSign, color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)' },
          { label: 'OPEN DEALS', val: '32', change: '↑ 12.3% vs last month', icon: Briefcase, color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
          { label: 'WON (THIS MONTH)', val: '7', subVal: '₹1.85 Cr', icon: Trophy, color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
          { label: 'LOST (THIS MONTH)', val: '2', subVal: '₹42.5 L', icon: X, color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
          { label: 'CLOSURE RATE (THIS MONTH)', val: '21.9%', change: '↑ 16.8% vs last month', icon: Target, color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' }
        ].map((card, i) => {
          const IconC = card.icon;
          return (
            <div 
              key={i}
              style={{
                background: 'rgba(10, 18, 36, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconC size={20} color={card.color} />
              </div>
              <div>
                <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, letterSpacing: '0.05em' }}>{card.label}</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF', fontFamily: "'Cinzel', serif", lineHeight: 1.1, margin: '2px 0' }}>{card.val}</div>
                {card.change && <span style={{ fontSize: '0.64rem', color: '#10B981', fontWeight: 600 }}>{card.change}</span>}
                {card.subVal && <span style={{ fontSize: '0.74rem', color: card.color, fontWeight: 800 }}>{card.subVal}</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── KANBAN DEAL PIPELINE BOARD (7 STAGES) ── */}
      <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFF' }}>Deal Pipeline</div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select style={{ background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem' }}>
              <option value="this_month">This Month ▾</option>
              <option value="this_quarter">This Quarter</option>
            </select>
          </div>
        </div>

        {/* 7 Stage Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', overflowX: 'auto' }}>
          {[
            {
              title: 'QUALIFIED', count: '8 Deals', val: '₹85.0 L', color: '#3B82F6',
              cards: [
                { name: 'Rohan Sharma', prop: 'Lodha Hinjewadi - 2 BHK', price: '₹1.20 Cr', agent: 'Manish Rai', date: '25 Jul 2026' },
                { name: 'Priya Patel', prop: 'VTP Blue Waters - 3 BHK', price: '₹75.0 L', agent: 'Jyoti Jagtap', date: '24 Jul 2026' }
              ]
            },
            {
              title: 'PROPOSAL', count: '7 Deals', val: '₹1.05 Cr', color: '#F59E0B',
              cards: [
                { name: 'Amit Singh', prop: 'Megapolis Symphony - 3 BHK', price: '₹82.0 L', agent: 'Rohini K.', date: '25 Jul 2026' },
                { name: 'Neha Kulkarni', prop: 'Kolte Patil Life Republic - 3 BHK', price: '₹1.10 Cr', agent: 'Jyoti Dhale', date: '24 Jul 2026' }
              ]
            },
            {
              title: 'NEGOTIATION', count: '6 Deals', val: '₹1.45 Cr', color: '#8B5CF6',
              cards: [
                { name: 'Rahul Verma', prop: 'Panchshil Towers - 4 BHK', price: '₹1.45 Cr', agent: 'Yash Murkute', date: '24 Jul 2026' },
                { name: 'Sneha Iyer', prop: 'Rohan Ekam - 2 BHK', price: '₹65.0 L', agent: 'Jyoti Jagtap', date: '23 Jul 2026' }
              ]
            },
            {
              title: 'BOOKING', count: '5 Deals', val: '₹92.0 L', color: '#EC4899',
              cards: [
                { name: 'Ankit Tiwari', prop: 'Dosti Greenscape - 2 BHK', price: '₹61.0 L', agent: 'Rohini K.', date: '22 Jul 2026' },
                { name: 'Sunil Pawar', prop: 'Lodha Belmondo - 3 BHK', price: '₹91.0 L', agent: 'Yash Murkute', date: '22 Jul 2026' }
              ]
            },
            {
              title: 'AGREEMENT', count: '3 Deals', val: '₹78.0 L', color: '#6366F1',
              cards: [
                { name: 'Meera Gupta', prop: 'Dosti Greenscape - 2 BHK', price: '₹78.0 L', agent: 'Jyoti Dhale', date: '21 Jul 2026' }
              ]
            },
            {
              title: 'CLOSED WON', count: '7 Deals', val: '₹1.85 Cr', color: '#10B981',
              cards: [
                { name: 'Karan Mehta', prop: 'Lodha Hinjewadi - 3 BHK', price: '₹1.05 Cr', agent: 'Manish Rai', tag: 'Won', date: '20 Jul 2026' }
              ],
              viewAll: 'View All (7)'
            },
            {
              title: 'CLOSED LOST', count: '1 Deals', val: '₹15.0 L', color: '#EF4444',
              cards: [
                { name: 'Simran Kaur', prop: 'Rohan Ekam - 2 BHK', price: '₹15.0 L', agent: 'Jyoti Jagtap', tag: 'Lost', date: '18 Jul 2026' }
              ],
              viewAll: 'View All (1)'
            }
          ].map((col, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
              
              {/* Header Badge */}
              <div style={{ background: 'rgba(255,255,255,0.03)', borderTop: `3px solid ${col.color}`, borderRadius: '6px', padding: '8px 10px', fontSize: '0.66rem' }}>
                <div style={{ fontWeight: 800, color: col.color }}>{col.title}</div>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{col.count} | {col.val}</div>
              </div>

              {/* Cards */}
              {col.cards.map((c, cIdx) => (
                <div 
                  key={cIdx}
                  style={{
                    background: '#070F1E',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '8px',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    fontSize: '0.72rem'
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#FFF' }}>{c.name}</div>
                  <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.5)' }}>{c.prop}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gold-primary)', marginTop: '2px' }}>{c.price}</div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.04)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>
                    <span>{c.agent}</span>
                    <span>{c.date}</span>
                  </div>
                </div>
              ))}

              {col.viewAll ? (
                <button style={{ padding: '6px', background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--gold-primary)', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer', marginTop: 'auto' }}>
                  {col.viewAll}
                </button>
              ) : (
                <button onClick={() => setIsAddModalOpen(true)} style={{ padding: '6px', background: 'transparent', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '6px', color: 'rgba(255,255,255,0.5)', fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer', marginTop: 'auto' }}>
                  + Add Deal
                </button>
              )}

            </div>
          ))}
        </div>
      </div>

      {/* ── LOWER SECTION: TABLE (70%) + RIGHT SIDEBAR (30%) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: TABLE */}
        <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Sub-tabs Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { id: 'ALL', label: 'All Deals' },
                { id: 'MY_DEALS', label: 'My Deals' },
                { id: 'WON', label: 'Won' },
                { id: 'LOST', label: 'Lost' },
                { id: 'OPEN', label: 'Open Deals' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveSubTab(tab.id); setCurrentPage(1); }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeSubTab === tab.id ? 'rgba(212,175,55,0.15)' : 'transparent',
                    color: activeSubTab === tab.id ? 'var(--gold-primary)' : 'rgba(255,255,255,0.5)',
                    fontSize: '0.74rem',
                    fontWeight: activeSubTab === tab.id ? 700 : 500,
                    cursor: 'pointer',
                    borderBottom: activeSubTab === tab.id ? '2px solid var(--gold-primary)' : '2px solid transparent'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button 
                onClick={() => setIsFilterModalOpen(true)}
                style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Sliders size={12} /> Advanced Filter
              </button>
            </div>
          </div>

          {/* Deals Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.76rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontSize: '0.62rem', letterSpacing: '0.06em' }}>
                  <th style={{ padding: '10px 8px' }}>DEAL ID</th>
                  <th style={{ padding: '10px 8px' }}>CLIENT / LEAD</th>
                  <th style={{ padding: '10px 8px' }}>PROPERTY / UNIT</th>
                  <th style={{ padding: '10px 8px' }}>DEAL VALUE</th>
                  <th style={{ padding: '10px 8px' }}>STAGE</th>
                  <th style={{ padding: '10px 8px' }}>ASSIGNED TO</th>
                  <th style={{ padding: '10px 8px' }}>EXPECTED CLOSING</th>
                  <th style={{ padding: '10px 8px' }}>PROBABILITY</th>
                  <th style={{ padding: '10px 8px' }}>LAST ACTIVITY</th>
                  <th style={{ padding: '10px 6px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((d, idx) => {
                  const stageBg = d.stage === 'NEGOTIATION' ? 'rgba(139,92,246,0.15)' : d.stage === 'PROPOSAL' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)';
                  const stageColor = d.stage === 'NEGOTIATION' ? '#8B5CF6' : d.stage === 'PROPOSAL' ? '#F59E0B' : '#10B981';

                  return (
                    <tr 
                      key={d.id}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s ease' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '12px 8px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '0.72rem' }}>{d.id}</td>
                      
                      {/* Client */}
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ fontWeight: 700, color: '#FFF' }}>{d.clientName}</div>
                        <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)' }}>{d.clientPhone}</div>
                      </td>

                      {/* Property Unit */}
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ fontWeight: 600, color: '#FFF', fontSize: '0.74rem' }}>{d.propertyTitle}</div>
                        <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>{d.unitDetail}</div>
                      </td>

                      {/* Deal Value */}
                      <td style={{ padding: '12px 8px', fontSize: '0.82rem', fontWeight: 800, color: 'var(--gold-primary)' }}>
                        {d.dealValueDisplay}
                      </td>

                      {/* Stage */}
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: stageBg, color: stageColor }}>
                          {d.stage}
                        </span>
                      </td>

                      {/* Assigned */}
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <img src={d.assignedAvatar} alt={d.assignedTo} style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} />
                          <span style={{ fontSize: '0.72rem', color: '#FFF' }}>{d.assignedTo}</span>
                        </div>
                      </td>

                      {/* Expected Closing */}
                      <td style={{ padding: '12px 8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem' }}>{d.expectedClosing}</td>

                      {/* Probability */}
                      <td style={{ padding: '12px 8px', fontWeight: 700, color: '#FFF' }}>{d.probability}</td>

                      {/* Last Activity */}
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ fontSize: '0.72rem', color: '#FFF' }}>{d.lastActivity}</div>
                        <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>{d.lastActivityType}</div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 6px', textAlign: 'right', position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          <button onClick={() => alert(`Viewing details for ${d.clientName}`)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', width: '26px', height: '26px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Eye size={12} />
                          </button>
                          <button onClick={() => alert(`Editing deal ${d.id}`)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', width: '26px', height: '26px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Edit2 size={12} />
                          </button>
                          <button 
                            onClick={() => setActiveRowMenuId(activeRowMenuId === d.id ? null : d.id)}
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', width: '26px', height: '26px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <MoreVertical size={12} />
                          </button>
                        </div>

                        {activeRowMenuId === d.id && (
                          <div style={{ position: 'absolute', right: '10px', top: '40px', background: '#0B1528', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '6px 0', zIndex: 100, boxShadow: '0 10px 30px rgba(0,0,0,0.8)', width: '150px', textAlign: 'left', fontSize: '0.74rem' }}>
                            <button onClick={() => handleDeleteDeal(d.id)} style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', color: '#EF4444', textAlign: 'left', cursor: 'pointer', fontWeight: 700 }}>
                              🗑️ Delete Deal
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>
            <span>Showing 1 to {filteredList.length} of 32 deals</span>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>‹</button>
              {[1, 2, 3, 4].map(pg => (
                <button 
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  style={{ 
                    padding: '4px 9px', 
                    borderRadius: '4px', 
                    background: currentPage === pg ? 'var(--gold-primary)' : 'rgba(255,255,255,0.04)', 
                    border: currentPage === pg ? 'none' : '1px solid rgba(255,255,255,0.1)', 
                    color: currentPage === pg ? '#070D18' : 'rgba(255,255,255,0.7)', 
                    fontWeight: currentPage === pg ? 800 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {pg}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(4, p + 1))} style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>›</button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ANALYTICS & QUICK ACTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Deal Analytics Donut Chart */}
          <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '16px' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>Deal Analytics <span style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>(This Month)</span></div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="100" height="100" viewBox="0 0 42 42">
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4"></circle>
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#3B82F6" strokeWidth="4" strokeDasharray="72 28" strokeDashoffset="25"></circle>
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10B981" strokeWidth="4" strokeDasharray="22 78" strokeDashoffset="53"></circle>
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#EF4444" strokeWidth="4" strokeDasharray="6 94" strokeDashoffset="31"></circle>
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: '#FFF' }}>32</div>
                  <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.45)' }}>Total Deals</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.7rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Won</span>
                  <span style={{ fontWeight: 800, color: '#FFF', marginLeft: 'auto' }}>7 (21.9%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Lost</span>
                  <span style={{ fontWeight: 800, color: '#FFF', marginLeft: 'auto' }}>2 (6.3%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3B82F6' }} />
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Open</span>
                  <span style={{ fontWeight: 800, color: '#FFF', marginLeft: 'auto' }}>23 (71.9%)</span>
                </div>
              </div>
            </div>

            {/* Pipeline Value breakdown */}
            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.68rem' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#FFF', marginBottom: '4px' }}>Pipeline Value by Stage</div>
              {[
                { stage: 'Qualified', val: '₹85.0 L (17.6%)', color: '#3B82F6' },
                { stage: 'Proposal', val: '₹1.05 Cr (21.8%)', color: '#F59E0B' },
                { stage: 'Negotiation', val: '₹1.48 Cr (30.7%)', color: '#8B5CF6' },
                { stage: 'Booking', val: '₹92.0 L (19.1%)', color: '#EC4899' },
                { stage: 'Agreement', val: '₹78.0 L (16.2%)', color: '#6366F1' },
                { stage: 'Won', val: '₹1.85 Cr (38.4%)', color: '#10B981' },
                { stage: 'Lost', val: '₹42.5 L (8.8%)', color: '#EF4444' }
              ].map((st, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: st.color }} />
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>{st.stage}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#FFF' }}>{st.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Deal Owners Widget */}
          <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '16px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>Top Deal Owners <span style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>(This Month)</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { rank: '1', name: 'Manish Rai', val: '₹1.25 Cr', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80' },
                { rank: '2', name: 'Yash Murkute', val: '₹86.0 L', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80' },
                { rank: '3', name: 'Jyoti Jagtap', val: '₹75.0 L', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=60&q=80' },
                { rank: '4', name: 'Rohini K.', val: '₹61.0 L', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=60&q=80' },
                { rank: '5', name: 'Jyoti Dhale', val: '₹48.0 L', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80' }
              ].map((owner, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', width: '12px' }}>{owner.rank}</span>
                    <img src={owner.img} alt={owner.name} style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#FFF' }}>{owner.name}</span>
                  </div>
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--gold-primary)' }}>{owner.val}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--gold-primary)', fontWeight: 700, cursor: 'pointer' }}>View Full Report →</span>
            </div>
          </div>

          {/* Quick Actions Grid (6 Cards) */}
          <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '16px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>Quick Actions</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { title: 'Add New Deal', icon: Plus, action: () => setIsAddModalOpen(true) },
                { title: 'Add Note', icon: FileText, action: () => alert('Add Note modal') },
                { title: 'Stage Update', icon: Sliders, action: () => alert('Stage Update panel') },
                { title: 'Schedule Follow-up', icon: Calendar, action: () => alert('Follow-up panel') },
                { title: 'Generate Proposal', icon: Share2, action: () => alert('Proposal Generator') },
                { title: 'Deal Report', icon: Download, action: handleExportCSV }
              ].map((qa, i) => {
                const IconQA = qa.icon;
                return (
                  <button 
                    key={i}
                    onClick={qa.action}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '8px',
                      padding: '10px 6px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'rgba(255,255,255,0.85)',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <IconQA size={16} color="var(--gold-primary)" />
                    <span style={{ fontSize: '0.62rem', fontWeight: 700 }}>{qa.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* ── ADD NEW DEAL MODAL ── */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0B1528', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Plus size={18} color="var(--gold-primary)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#FFF', fontFamily: "'Cinzel', serif" }}>Create New Deal</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.78rem' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>CLIENT NAME</label>
                <input required type="text" placeholder="e.g. Rohan Sharma" value={addForm.clientName} onChange={e => setAddForm({ ...addForm, clientName: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>PHONE NUMBER</label>
                  <input required type="text" placeholder="+91 98765 43210" value={addForm.clientPhone} onChange={e => setAddForm({ ...addForm, clientPhone: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>DEAL VALUE (₹)</label>
                  <input required type="number" placeholder="12000000" value={addForm.dealValue} onChange={e => setAddForm({ ...addForm, dealValue: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', outline: 'none' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>PROPERTY &amp; UNIT</label>
                <select value={addForm.propertyTitle} onChange={e => setAddForm({ ...addForm, propertyTitle: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', outline: 'none' }}>
                  <option value="Lodha Hinjewadi - Tower 3">Lodha Hinjewadi - Tower 3 (2 BHK)</option>
                  <option value="VTP Blue Waters - Tower A">VTP Blue Waters - Tower A (3 BHK)</option>
                  <option value="Godrej Hillside - Tower C">Godrej Hillside - Tower C (2 BHK)</option>
                  <option value="Panchshil Towers - Tower B">Panchshil Towers - Tower B (4 BHK)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>PIPELINE STAGE</label>
                  <select value={addForm.stage} onChange={e => setAddForm({ ...addForm, stage: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', outline: 'none' }}>
                    <option value="QUALIFIED">QUALIFIED</option>
                    <option value="PROPOSAL">PROPOSAL</option>
                    <option value="NEGOTIATION">NEGOTIATION</option>
                    <option value="BOOKING">BOOKING</option>
                    <option value="AGREEMENT">AGREEMENT</option>
                    <option value="CLOSED WON">CLOSED WON</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>EXPECTED CLOSING</label>
                  <input type="date" value={addForm.expectedClosing} onChange={e => setAddForm({ ...addForm, expectedClosing: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', outline: 'none' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>ASSIGNED MANAGER</label>
                <select value={addForm.assignedTo} onChange={e => setAddForm({ ...addForm, assignedTo: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', outline: 'none' }}>
                  <option value="Manish Rai">Manish Rai</option>
                  <option value="Jyoti Dhale">Jyoti Dhale</option>
                  <option value="Jyoti Jagtap">Jyoti Jagtap</option>
                  <option value="Yash Murkute">Yash Murkute</option>
                  <option value="Rohini K.">Rohini K.</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '7px', background: 'rgba(255,255,255,0.06)', border: 'none', color: '#FFF', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 20px', borderRadius: '7px', background: 'linear-gradient(135deg, var(--gold-primary), #B8860B)', border: 'none', color: '#070D18', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>Create Deal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── IMPORT MODAL ── */}
      {isImportModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0B1528', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '16px', width: '100%', maxWidth: '450px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Upload size={18} color="var(--gold-primary)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#FFF', fontFamily: "'Cinzel', serif" }}>Import Deals (CSV)</h3>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ border: '2px dashed rgba(212,175,55,0.3)', borderRadius: '12px', padding: '30px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <Upload size={32} color="var(--gold-primary)" />
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>Drag &amp; Drop CSV File</div>
              <input type="file" accept=".csv" style={{ display: 'none' }} id="dealCsvInput" onChange={() => { alert('5 Deals imported successfully!'); setIsImportModalOpen(false); }} />
              <label htmlFor="dealCsvInput" style={{ padding: '8px 18px', borderRadius: '7px', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--gold-primary)', color: 'var(--gold-primary)', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', marginTop: '6px' }}>Browse File</label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setIsImportModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '7px', background: 'rgba(255,255,255,0.06)', border: 'none', color: '#FFF', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADVANCED FILTER MODAL ── */}
      {isFilterModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0B1528', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '16px', width: '100%', maxWidth: '440px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Filter size={18} color="var(--gold-primary)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#FFF', fontFamily: "'Cinzel', serif" }}>Filter Deals</h3>
              </div>
              <button onClick={() => setIsFilterModalOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.78rem' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>MANAGER</label>
                <select style={{ width: '100%', padding: '8px 10px', borderRadius: '7px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', outline: 'none' }}>
                  <option value="">All Managers</option>
                  <option value="Manish Rai">Manish Rai</option>
                  <option value="Jyoti Dhale">Jyoti Dhale</option>
                  <option value="Jyoti Jagtap">Jyoti Jagtap</option>
                  <option value="Yash Murkute">Yash Murkute</option>
                  <option value="Rohini K.">Rohini K.</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>PIPELINE STAGE</label>
                <select style={{ width: '100%', padding: '8px 10px', borderRadius: '7px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', outline: 'none' }}>
                  <option value="">All Stages</option>
                  <option value="QUALIFIED">QUALIFIED</option>
                  <option value="PROPOSAL">PROPOSAL</option>
                  <option value="NEGOTIATION">NEGOTIATION</option>
                  <option value="BOOKING">BOOKING</option>
                  <option value="AGREEMENT">AGREEMENT</option>
                  <option value="CLOSED WON">CLOSED WON</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => setIsFilterModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '7px', background: 'rgba(255,255,255,0.06)', border: 'none', color: '#FFF', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>Reset</button>
              <button onClick={() => { setIsFilterModalOpen(false); alert('Deal filters applied!'); }} style={{ padding: '8px 18px', borderRadius: '7px', background: 'linear-gradient(135deg, var(--gold-primary), #B8860B)', border: 'none', color: '#070D18', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>Apply</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
