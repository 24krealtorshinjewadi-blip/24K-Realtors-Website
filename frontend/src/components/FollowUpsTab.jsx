import React, { useState } from 'react';
import { 
  Plus, Upload, Download, Search, Sliders, Calendar as CalendarIcon, 
  Clock, CheckCircle2, AlertTriangle, Phone, MessageSquare, Mail, 
  MoreVertical, ChevronLeft, ChevronRight, User, Building, Filter, 
  Sparkles, FileText, Check, Send, RotateCcw, X, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { apiService } from '../services/apiService';

// Mock Initial Follow-ups list matching reference screenshot exactly
const initialFollowUpsData = [
  {
    id: 'FU-101',
    leadName: 'Rohan Sharma',
    leadPhone: '+91 98765 43210',
    initials: 'RS',
    avatarBg: '#10B981',
    propertyImg: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=100&q=80',
    propertyName: 'Lodha Hinjewadi',
    bhk: '3 BHK',
    type: 'Call',
    dateDisplay: 'Today 04:30 PM',
    rawDate: '2026-07-27T16:30',
    assignedTo: 'Jyoti Dhale',
    assignedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80',
    priority: 'High',
    status: 'Pending',
    filterTag: 'due_today'
  },
  {
    id: 'FU-102',
    leadName: 'Priya Patel',
    leadPhone: '+91 91234 56789',
    initials: 'PP',
    avatarBg: '#8B5CF6',
    propertyImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=100&q=80',
    propertyName: 'VTP Blue Waters',
    bhk: '3 BHK',
    type: 'Site Visit',
    dateDisplay: 'Today 06:00 PM',
    rawDate: '2026-07-27T18:00',
    assignedTo: 'Jyoti Jagtap',
    assignedAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=60&q=80',
    priority: 'Medium',
    status: 'Pending',
    filterTag: 'due_today'
  },
  {
    id: 'FU-103',
    leadName: 'Vikram Malhotra',
    leadPhone: '+91 99888 77665',
    initials: 'VM',
    avatarBg: '#3B82F6',
    propertyImg: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=100&q=80',
    propertyName: 'Godrej Hillside',
    bhk: '2 BHK',
    type: 'WhatsApp',
    dateDisplay: 'Tomorrow 11:00 AM',
    rawDate: '2026-07-28T11:00',
    assignedTo: 'Yash Murkute',
    assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80',
    priority: 'Medium',
    status: 'Pending',
    filterTag: 'this_week'
  },
  {
    id: 'FU-104',
    leadName: 'Amit Singh',
    leadPhone: '+91 90090 90900',
    initials: 'AS',
    avatarBg: '#10B981',
    propertyImg: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=100&q=80',
    propertyName: 'Megapolis Symphony',
    bhk: '2 BHK',
    type: 'Call',
    dateDisplay: '30 Jul 2026 03:00 PM',
    rawDate: '2026-07-30T15:00',
    assignedTo: 'Rohini K.',
    assignedAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=60&q=80',
    priority: 'Low',
    status: 'Pending',
    filterTag: 'this_week'
  },
  {
    id: 'FU-105',
    leadName: 'Neha Kulkarni',
    leadPhone: '+91 80808 08008',
    initials: 'NK',
    avatarBg: '#F59E0B',
    propertyImg: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=100&q=80',
    propertyName: 'Kolte Patil Life Republic',
    bhk: '3 BHK',
    type: 'Email',
    dateDisplay: '30 Jul 2026 05:00 PM',
    rawDate: '2026-07-30T17:00',
    assignedTo: 'Jyoti Dhale',
    assignedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80',
    priority: 'Low',
    status: 'Pending',
    filterTag: 'this_week'
  },
  {
    id: 'FU-106',
    leadName: 'Rahul Verma',
    leadPhone: '+91 77777 88888',
    initials: 'RV',
    avatarBg: '#3B82F6',
    propertyImg: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=100&q=80',
    propertyName: 'Panchshil Towers',
    bhk: '4 BHK',
    type: 'Call',
    dateDisplay: '01 Aug 2026 10:30 AM',
    rawDate: '2026-08-01T10:30',
    assignedTo: 'Yash Murkute',
    assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80',
    priority: 'High',
    status: 'Pending',
    filterTag: 'upcoming'
  },
  {
    id: 'FU-107',
    leadName: 'Sneha Iyer',
    leadPhone: '+91 99999 11111',
    initials: 'SI',
    avatarBg: '#EC4899',
    propertyImg: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=100&q=80',
    propertyName: 'Rohan Ekam',
    bhk: '2 BHK',
    type: 'WhatsApp',
    dateDisplay: '01 Aug 2026 01:00 PM',
    rawDate: '2026-08-01T13:00',
    assignedTo: 'Jyoti Jagtap',
    assignedAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=60&q=80',
    priority: 'Medium',
    status: 'Pending',
    filterTag: 'upcoming'
  },
  {
    id: 'FU-108',
    leadName: 'Ankit Tiwari',
    leadPhone: '+91 66666 22222',
    initials: 'AT',
    avatarBg: '#3B82F6',
    propertyImg: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=100&q=80',
    propertyName: 'Dosti Greenscape',
    bhk: '2 BHK',
    type: 'Call',
    dateDisplay: '02 Aug 2026 04:00 PM',
    rawDate: '2026-08-02T16:00',
    assignedTo: 'Rohini K.',
    assignedAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=60&q=80',
    priority: 'Low',
    status: 'Pending',
    filterTag: 'upcoming'
  },
  {
    id: 'FU-109',
    leadName: 'Sunil Pawar',
    leadPhone: '+91 88888 33333',
    initials: 'SP',
    avatarBg: '#10B981',
    propertyImg: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=100&q=80',
    propertyName: 'Lodha Belmondo',
    bhk: '3 BHK',
    type: 'Site Visit',
    dateDisplay: '03 Aug 2026 11:00 AM',
    rawDate: '2026-08-03T11:00',
    assignedTo: 'Yash Murkute',
    assignedAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80',
    priority: 'Low',
    status: 'Pending',
    filterTag: 'upcoming'
  },
  {
    id: 'FU-110',
    leadName: 'Meera Gupta',
    leadPhone: '+91 77778 99900',
    initials: 'MG',
    avatarBg: '#8B5CF6',
    propertyImg: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=100&q=80',
    propertyName: 'VTP Bellissimo',
    bhk: '2 BHK',
    type: 'Email',
    dateDisplay: '03 Aug 2026 03:30 PM',
    rawDate: '2026-08-03T15:30',
    assignedTo: 'Jyoti Dhale',
    assignedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80',
    priority: 'Medium',
    status: 'Pending',
    filterTag: 'upcoming'
  }
];

export default function FollowUpsTab() {
  const [followUpsList, setFollowUpsList] = useState(initialFollowUpsData);
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
    leadName: '',
    leadPhone: '',
    propertyName: 'Lodha Hinjewadi (3 BHK)',
    type: 'Call',
    date: '2026-07-28T10:00',
    priority: 'High',
    assignedTo: 'Jyoti Dhale',
    notes: 'Follow-up regarding unit pricing and payment schedule'
  });

  // Handle Mark Completed
  const handleMarkCompleted = (id) => {
    setFollowUpsList(prev => prev.map(fu => fu.id === id ? { ...fu, status: 'Completed' } : fu));
    setActiveRowMenuId(null);
  };

  // Handle Delete
  const handleDeleteFollowUp = (id) => {
    if (window.confirm('Are you sure you want to delete this follow-up?')) {
      setFollowUpsList(prev => prev.filter(fu => fu.id !== id));
      setActiveRowMenuId(null);
    }
  };

  // Handle Add Submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const newFu = {
      id: `FU-${Math.floor(100 + Math.random() * 900)}`,
      leadName: addForm.leadName || 'New Client',
      leadPhone: addForm.leadPhone || '+91 98989 89898',
      initials: (addForm.leadName || 'NC').split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase(),
      avatarBg: '#F59E0B',
      propertyImg: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=100&q=80',
      propertyName: addForm.propertyName.split(' (')[0],
      bhk: addForm.propertyName.includes('(') ? addForm.propertyName.split('(')[1].replace(')', '') : '3 BHK',
      type: addForm.type,
      dateDisplay: 'Tomorrow 10:00 AM',
      rawDate: addForm.date,
      assignedTo: addForm.assignedTo,
      assignedAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80',
      priority: addForm.priority,
      status: 'Pending',
      filterTag: 'upcoming'
    };

    try {
      await apiService.createTask({
        title: `Follow-up (${addForm.type}) with ${newFu.leadName}`,
        assignedToAgentName: addForm.assignedTo,
        dueDate: addForm.date,
        priority: addForm.priority,
        notes: addForm.notes
      });
    } catch (err) {
      console.warn('API fallback create task');
    }

    setFollowUpsList([newFu, ...followUpsList]);
    setIsAddModalOpen(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Lead Name', 'Phone', 'Property', 'Type', 'Date & Time', 'Assigned To', 'Priority', 'Status'];
    const rows = followUpsList.map(f => [
      f.id, `"${f.leadName}"`, `"${f.leadPhone}"`, `"${f.propertyName} (${f.bhk})"`, f.type, `"${f.dateDisplay}"`, `"${f.assignedTo}"`, f.priority, f.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `24k_followups_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered List
  const filteredList = followUpsList.filter(fu => {
    const matchesSearch = fu.leadName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          fu.leadPhone.includes(searchQuery) ||
                          fu.propertyName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeSubTab === 'ALL') return true;
    if (activeSubTab === 'DUE_TODAY') return fu.filterTag === 'due_today';
    if (activeSubTab === 'OVERDUE') return fu.filterTag === 'overdue' || fu.status === 'Overdue';
    if (activeSubTab === 'THIS_WEEK') return fu.filterTag === 'this_week' || fu.filterTag === 'due_today';
    if (activeSubTab === 'UPCOMING') return fu.filterTag === 'upcoming';
    if (activeSubTab === 'COMPLETED') return fu.status === 'Completed';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#FFF' }}>
      
      {/* ── TOP HEADER BAR ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, fontFamily: "'Cinzel', serif", color: '#FFF' }}>Follow-ups</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
            Never miss a follow-up. Build relationships, close deals.
          </p>
        </div>

        {/* Search Bar + Top Actions */}
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
            <Plus size={15} /> + Add Follow-up
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
          { label: 'TOTAL FOLLOW-UPS', val: '38', change: '↑ 18.6% vs last month', icon: Sparkles, color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)' },
          { label: 'DUE TODAY', val: '7', change: '↑ 12.5% vs last month', icon: Plus, color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
          { label: 'OVERDUE', val: '3', change: '↓ 25.0% vs last month', icon: AlertTriangle, color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
          { label: 'THIS WEEK', val: '15', change: '↑ 20.0% vs last month', icon: CalendarIcon, color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
          { label: 'COMPLETED (THIS MONTH)', val: '28', change: '↑ 22.4% vs last month', icon: CheckCircle2, color: '#10B981', bg: 'rgba(16,185,129,0.15)' }
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
                <span style={{ fontSize: '0.64rem', color: card.change.includes('↓') ? '#EF4444' : '#10B981', fontWeight: 600 }}>{card.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MAIN CONTENT GRID: LEFT TABLE (70%) + RIGHT SIDEBAR (30%) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: SUB-TABS, TABLE & PAGINATION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Sub-tabs Filter Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { id: 'ALL', label: 'All Follow-ups' },
                  { id: 'DUE_TODAY', label: 'Due Today', badge: '7', badgeColor: '#F59E0B' },
                  { id: 'OVERDUE', label: 'Overdue', badge: '3', badgeColor: '#EF4444' },
                  { id: 'THIS_WEEK', label: 'This Week', badge: '15', badgeColor: '#3B82F6' },
                  { id: 'UPCOMING', label: 'Upcoming', badge: '13', badgeColor: 'rgba(255,255,255,0.4)' },
                  { id: 'COMPLETED', label: 'Completed' }
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
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      borderBottom: activeSubTab === tab.id ? '2px solid var(--gold-primary)' : '2px solid transparent'
                    }}
                  >
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '1px 5px', borderRadius: '10px', background: tab.badgeColor, color: tab.badgeColor === '#F59E0B' || tab.badgeColor === 'var(--gold-primary)' ? '#070D18' : '#FFF' }}>
                        {tab.badge}
                      </span>
                    )}
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

            {/* Follow-ups Main Data Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.76rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontSize: '0.62rem', letterSpacing: '0.06em' }}>
                    <th style={{ padding: '10px 6px', width: '24px' }}><input type="checkbox" /></th>
                    <th style={{ padding: '10px 10px' }}>LEAD / CONTACT</th>
                    <th style={{ padding: '10px 10px' }}>PROPERTY</th>
                    <th style={{ padding: '10px 10px' }}>TYPE</th>
                    <th style={{ padding: '10px 10px' }}>FOLLOW-UP DATE &amp; TIME</th>
                    <th style={{ padding: '10px 10px' }}>ASSIGNED TO</th>
                    <th style={{ padding: '10px 10px' }}>PRIORITY</th>
                    <th style={{ padding: '10px 10px' }}>STATUS</th>
                    <th style={{ padding: '10px 6px', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((fu, idx) => {
                    const priorityBg = fu.priority === 'High' ? 'rgba(239,68,68,0.15)' : fu.priority === 'Medium' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)';
                    const priorityColor = fu.priority === 'High' ? '#EF4444' : fu.priority === 'Medium' ? '#F59E0B' : '#10B981';

                    const typeIcon = fu.type === 'Call' ? <Phone size={13} color="#3B82F6" /> : fu.type === 'Site Visit' ? <Building size={13} color="#F59E0B" /> : fu.type === 'WhatsApp' ? <MessageSquare size={13} color="#25D366" /> : <Mail size={13} color="#EC4899" />;

                    return (
                      <tr 
                        key={fu.id}
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s ease' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '12px 6px' }}><input type="checkbox" /></td>
                        
                        {/* Lead Contact Info */}
                        <td style={{ padding: '12px 10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: fu.avatarBg, color: '#070D18', fontWeight: 900, fontSize: '0.68rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {fu.initials}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#FFF' }}>{fu.leadName}</div>
                              <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)' }}>{fu.leadPhone}</div>
                            </div>
                          </div>
                        </td>

                        {/* Property */}
                        <td style={{ padding: '12px 10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img src={fu.propertyImg} alt={fu.propertyName} style={{ width: '26px', height: '26px', borderRadius: '4px', objectFit: 'cover' }} />
                            <div>
                              <div style={{ fontWeight: 600, color: '#FFF', fontSize: '0.74rem' }}>{fu.propertyName}</div>
                              <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>{fu.bhk}</div>
                            </div>
                          </div>
                        </td>

                        {/* Follow-up Type */}
                        <td style={{ padding: '12px 10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                            {typeIcon}
                            <span>{fu.type}</span>
                          </div>
                        </td>

                        {/* Date & Time */}
                        <td style={{ padding: '12px 10px' }}>
                          <div style={{ fontWeight: 700, color: fu.dateDisplay.includes('Today') ? '#F59E0B' : '#FFF' }}>
                            {fu.dateDisplay}
                          </div>
                        </td>

                        {/* Assigned RM */}
                        <td style={{ padding: '12px 10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <img src={fu.assignedAvatar} alt={fu.assignedTo} style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} />
                            <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.85)' }}>{fu.assignedTo}</span>
                          </div>
                        </td>

                        {/* Priority */}
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{ fontSize: '0.64rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: priorityBg, color: priorityColor }}>
                            {fu.priority}
                          </span>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{ fontSize: '0.64rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: fu.status === 'Completed' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: fu.status === 'Completed' ? '#10B981' : '#F59E0B' }}>
                            {fu.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '12px 6px', textAlign: 'right', position: 'relative' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                            <a href={`tel:${fu.leadPhone}`} style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                              <Phone size={12} />
                            </a>
                            <a href={`https://wa.me/${fu.leadPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(fu.leadName)},%20following%20up%20on%20${encodeURIComponent(fu.propertyName)}.`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366' }}>
                              <MessageSquare size={12} />
                            </a>
                            <button 
                              onClick={() => setActiveRowMenuId(activeRowMenuId === fu.id ? null : fu.id)}
                              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', width: '28px', height: '28px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <MoreVertical size={12} />
                            </button>
                          </div>

                          {/* Row Actions Floating Menu */}
                          {activeRowMenuId === fu.id && (
                            <div style={{ position: 'absolute', right: '10px', top: '40px', background: '#0B1528', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '8px', padding: '6px 0', zIndex: 100, boxShadow: '0 10px 30px rgba(0,0,0,0.8)', width: '160px', textAlign: 'left', fontSize: '0.74rem' }}>
                              <button onClick={() => handleMarkCompleted(fu.id)} style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', color: '#10B981', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                                ✓ Mark Completed
                              </button>
                              <button onClick={() => handleDeleteFollowUp(fu.id)} style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', color: '#EF4444', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                                🗑️ Delete Follow-up
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
              <span>Showing 1 to {filteredList.length} of 38 follow-ups</span>
              
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
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

                <select style={{ background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>
                  <option value="10">10 / page</option>
                  <option value="25">25 / page</option>
                  <option value="50">50 / page</option>
                </select>
              </div>
            </div>

          </div>

          {/* ── BOTTOM 3 CARDS ROW ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            
            {/* Widget 1: Upcoming Reminders */}
            <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFF' }}>Upcoming Reminders</div>
                <span style={{ fontSize: '0.7rem', color: 'var(--gold-primary)', fontWeight: 700, cursor: 'pointer' }}>View All</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { name: 'Rohan Sharma', sub: 'Call Follow-up', date: 'Today, 04:30 PM', priority: 'High', color: '#EF4444' },
                  { name: 'Priya Patel', sub: 'Site Visit Reminder', date: 'Today, 06:00 PM', priority: 'Medium', color: '#F59E0B' },
                  { name: 'Vikram Malhotra', sub: 'WhatsApp Follow-up', date: 'Tomorrow, 11:00 AM', priority: 'Medium', color: '#F59E0B' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>
                        <Phone size={13} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#FFF' }}>{item.name}</div>
                        <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>{item.sub}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.6)' }}>{item.date}</div>
                      <span style={{ fontSize: '0.6rem', fontWeight: 800, padding: '1px 5px', borderRadius: '3px', background: `${item.color}25`, color: item.color }}>{item.priority}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 2: Follow-up Templates */}
            <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFF' }}>Follow-up Templates</div>
                <span style={{ fontSize: '0.7rem', color: 'var(--gold-primary)', fontWeight: 700, cursor: 'pointer' }}>View All</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { title: 'After Site Visit', text: 'Thank you for visiting the property. Hope you had a great experience...' },
                  { title: 'Budget Discussion', text: 'Thank you for discussing your budget. Let me know if you need any...' },
                  { title: 'Price Negotiation', text: 'I understand your concern regarding the price. Let me share some...' }
                ].map((tpl, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div>
                      <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#FFF' }}>{tpl.title}</div>
                      <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '180px' }}>{tpl.text}</div>
                    </div>
                    <button onClick={() => alert(`Template "${tpl.title}" copied to clipboard!`)} style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--gold-primary)', color: 'var(--gold-primary)', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer' }}>Use</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 3: Follow-up Activity (Recent) */}
            <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>Follow-up Activity <span style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>(Recent)</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { title: 'Rohan Sharma follow-up completed', sub: 'Call - Interested in 2.5 BHK option', time: 'Today, 10:25 AM', icon: CheckCircle2, color: '#10B981' },
                  { title: 'Priya Patel follow-up scheduled', sub: 'Site Visit scheduled for tomorrow', time: 'Today, 09:15 AM', icon: CalendarIcon, color: '#3B82F6' },
                  { title: 'Vikram Malhotra follow-up completed', sub: 'WhatsApp - Sent new brochure', time: 'Yesterday, 06:30 PM', icon: MessageSquare, color: '#25D366' },
                  { title: 'Amit Singh follow-up overdue', sub: 'Call was not answered', time: 'Yesterday, 05:20 PM', icon: AlertTriangle, color: '#EF4444' }
                ].map((act, i) => {
                  const IconAct = act.icon;
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: `${act.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: act.color }}>
                          <IconAct size={12} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#FFF' }}>{act.title}</div>
                          <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>{act.sub}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>{act.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: CALENDAR, INSIGHTS DONUT CHART, QUICK ACTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Follow-up Calendar Widget */}
          <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFF' }}>Follow-up Calendar</div>
              <ChevronRight size={16} color="rgba(255,255,255,0.5)" style={{ cursor: 'pointer' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFF' }}>July 2026</span>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <button style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#FFF', cursor: 'pointer', fontSize: '0.7rem' }}>‹</button>
                <button style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#FFF', cursor: 'pointer', fontSize: '0.7rem' }}>›</button>
                <button style={{ padding: '2px 8px', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--gold-primary)', borderRadius: '4px', color: 'var(--gold-primary)', cursor: 'pointer', fontSize: '0.68rem', fontWeight: 700 }}>Today</button>
              </div>
            </div>

            {/* Calendar Grid Header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '0.62rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>
              <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
            </div>

            {/* Calendar Days */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '0.72rem' }}>
              {['30', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '1', '2', '3'].map((d, idx) => {
                const isCurrentMonth = idx >= 1 && idx <= 31;
                const isToday = d === '27' && isCurrentMonth;
                const hasDue = d === '27';
                
                return (
                  <div 
                    key={idx}
                    style={{
                      padding: '6px 0',
                      borderRadius: '6px',
                      background: isToday ? 'var(--gold-primary)' : 'rgba(255,255,255,0.02)',
                      color: isToday ? '#070D18' : isCurrentMonth ? '#FFF' : 'rgba(255,255,255,0.25)',
                      fontWeight: isToday ? 900 : 500,
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    {d}
                    {hasDue && !isToday && (
                      <span style={{ position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', borderRadius: '50%', background: '#F59E0B' }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)' }}>
              <div><span style={{ color: '#F59E0B' }}>●</span> Due Today (7)</div>
              <div><span style={{ color: '#EF4444' }}>●</span> Overdue (3)</div>
              <div><span style={{ color: '#3B82F6' }}>●</span> Upcoming (13)</div>
              <div><span style={{ color: '#10B981' }}>●</span> Completed (28)</div>
            </div>
          </div>

          {/* Follow-up Insights Donut Chart Widget */}
          <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '16px' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>Follow-up Insights <span style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>(This Month)</span></div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Donut Chart SVG */}
              <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="100" height="100" viewBox="0 0 42 42">
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4"></circle>
                  
                  {/* Completed 74% */}
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10B981" strokeWidth="4" strokeDasharray="74 26" strokeDashoffset="25"></circle>
                  {/* Pending 18% */}
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#F59E0B" strokeWidth="4" strokeDasharray="18 82" strokeDashoffset="51"></circle>
                  {/* Overdue 8% */}
                  <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#EF4444" strokeWidth="4" strokeDasharray="8 92" strokeDashoffset="33"></circle>
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: '#FFF' }}>38</div>
                  <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.45)' }}>Total</div>
                </div>
              </div>

              {/* Chart Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.7rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Completed</span>
                  <span style={{ fontWeight: 800, color: '#FFF', marginLeft: 'auto' }}>28 (74%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} />
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Pending</span>
                  <span style={{ fontWeight: 800, color: '#FFF', marginLeft: 'auto' }}>7 (18%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Overdue</span>
                  <span style={{ fontWeight: 800, color: '#FFF', marginLeft: 'auto' }}>3 (8%)</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.68rem' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.45)' }}>Best Time to Follow-up</div>
                <div style={{ fontWeight: 700, color: '#FFF', marginTop: '2px' }}>10:00 AM - 12:00 PM</div>
                <div style={{ fontWeight: 700, color: '#FFF' }}>04:00 PM - 06:00 PM</div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.45)' }}>Response Rate</div>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: '#FFF', marginTop: '2px' }}>68%</div>
                <div style={{ color: '#10B981', fontWeight: 600, fontSize: '0.62rem' }}>↑ 12.5% vs last month</div>
              </div>
            </div>
          </div>

          {/* Quick Actions Widget Grid (4 Cards) */}
          <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '16px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>Quick Actions</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { title: 'Schedule Follow-up', icon: CalendarIcon, action: () => setIsAddModalOpen(true) },
                { title: 'Add Follow-up', icon: Plus, action: () => setIsAddModalOpen(true) },
                { title: 'Follow-up Templates', icon: FileText, action: () => alert('Templates panel opened') },
                { title: 'Follow-up Report', icon: Download, action: handleExportCSV }
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
                      padding: '12px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'rgba(255,255,255,0.85)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <IconQA size={18} color="var(--gold-primary)" />
                    <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>{qa.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* ── ADD FOLLOW-UP MODAL ── */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0B1528', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Plus size={18} color="var(--gold-primary)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#FFF', fontFamily: "'Cinzel', serif" }}>Schedule New Follow-up</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.78rem' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>LEAD NAME</label>
                <input required type="text" placeholder="e.g. Rohan Sharma" value={addForm.leadName} onChange={e => setAddForm({ ...addForm, leadName: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>PHONE NUMBER</label>
                  <input required type="text" placeholder="+91 98765 43210" value={addForm.leadPhone} onChange={e => setAddForm({ ...addForm, leadPhone: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>FOLLOW-UP TYPE</label>
                  <select value={addForm.type} onChange={e => setAddForm({ ...addForm, type: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', outline: 'none' }}>
                    <option value="Call">Call</option>
                    <option value="Site Visit">Site Visit</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>PROPERTY</label>
                <select value={addForm.propertyName} onChange={e => setAddForm({ ...addForm, propertyName: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', outline: 'none' }}>
                  <option value="Lodha Hinjewadi (3 BHK)">Lodha Hinjewadi (3 BHK)</option>
                  <option value="VTP Blue Waters (3 BHK)">VTP Blue Waters (3 BHK)</option>
                  <option value="Godrej Hillside (2 BHK)">Godrej Hillside (2 BHK)</option>
                  <option value="Megapolis Symphony (2 BHK)">Megapolis Symphony (2 BHK)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>DATE &amp; TIME</label>
                  <input type="datetime-local" value={addForm.date} onChange={e => setAddForm({ ...addForm, date: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>PRIORITY</label>
                  <select value={addForm.priority} onChange={e => setAddForm({ ...addForm, priority: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', outline: 'none' }}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>ASSIGNED RELATIONSHIP MANAGER</label>
                <select value={addForm.assignedTo} onChange={e => setAddForm({ ...addForm, assignedTo: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', outline: 'none' }}>
                  <option value="Jyoti Dhale">Jyoti Dhale</option>
                  <option value="Jyoti Jagtap">Jyoti Jagtap</option>
                  <option value="Yash Murkute">Yash Murkute</option>
                  <option value="Rohini K.">Rohini K.</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>NOTES / AGENDA</label>
                <textarea rows="2" value={addForm.notes} onChange={e => setAddForm({ ...addForm, notes: e.target.value })} style={{ width: '100%', padding: '9px 12px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', outline: 'none', resize: 'none' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '7px', background: 'rgba(255,255,255,0.06)', border: 'none', color: '#FFF', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 20px', borderRadius: '7px', background: 'linear-gradient(135deg, var(--gold-primary), #B8860B)', border: 'none', color: '#070D18', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>Save Follow-up</button>
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
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#FFF', fontFamily: "'Cinzel', serif" }}>Import Follow-ups (CSV)</h3>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ border: '2px dashed rgba(212,175,55,0.3)', borderRadius: '12px', padding: '30px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <Upload size={32} color="var(--gold-primary)" />
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>Drag &amp; Drop CSV File</div>
              <input type="file" accept=".csv" style={{ display: 'none' }} id="fuCsvInput" onChange={() => { alert('10 Follow-ups imported successfully!'); setIsImportModalOpen(false); }} />
              <label htmlFor="fuCsvInput" style={{ padding: '8px 18px', borderRadius: '7px', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--gold-primary)', color: 'var(--gold-primary)', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', marginTop: '6px' }}>Browse File</label>
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
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#FFF', fontFamily: "'Cinzel', serif" }}>Filter Follow-ups</h3>
              </div>
              <button onClick={() => setIsFilterModalOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.78rem' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>MANAGER</label>
                <select style={{ width: '100%', padding: '8px 10px', borderRadius: '7px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', outline: 'none' }}>
                  <option value="">All Managers</option>
                  <option value="Jyoti Dhale">Jyoti Dhale</option>
                  <option value="Jyoti Jagtap">Jyoti Jagtap</option>
                  <option value="Yash Murkute">Yash Murkute</option>
                  <option value="Rohini K.">Rohini K.</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>PRIORITY</label>
                <select style={{ width: '100%', padding: '8px 10px', borderRadius: '7px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', outline: 'none' }}>
                  <option value="">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => setIsFilterModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '7px', background: 'rgba(255,255,255,0.06)', border: 'none', color: '#FFF', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>Reset</button>
              <button onClick={() => { setIsFilterModalOpen(false); alert('Follow-up filters applied!'); }} style={{ padding: '8px 18px', borderRadius: '7px', background: 'linear-gradient(135deg, var(--gold-primary), #B8860B)', border: 'none', color: '#070D18', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>Apply</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
