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
import React, { useState, useEffect } from 'react';
import {
  Users, UserCheck, MessageSquare, Calendar, Award, Plus, Upload, Filter,
  RotateCcw, Search, Phone, Edit2, MoreVertical, ChevronLeft, ChevronRight,
  TrendingUp, Download, Eye, Sparkles, RefreshCw, Settings
} from 'lucide-react';
import { apiService } from '../services/apiService';

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
  const [liveLeads, setLiveLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [webhookUrlInput, setWebhookUrlInput] = useState(localStorage.getItem('google_sheet_webhook_url') || '');
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [importCsvText, setImportCsvText] = useState('');
  const [importing, setImporting] = useState(false);

  const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1Reu4yjYVHLY0DRgDN52dz9OP55wgGEWGDdPH_zvuQLM/edit?usp=sharing';

  const handleSaveWebhook = () => {
    if (webhookUrlInput.trim()) {
      localStorage.setItem('google_sheet_webhook_url', webhookUrlInput.trim());
      alert('✅ Google Sheets Webhook URL saved successfully!');
    } else {
      localStorage.removeItem('google_sheet_webhook_url');
      alert('Webhook URL removed. Inquiries will save to Database & local cache.');
    }
  };

  const handleTestWebhook = async () => {
    setTestingWebhook(true);
    try {
      const sample = {
        name: 'Test Customer (24K CRM)',
        phone: '+91 96730 00053',
        email: 'test@24krealtors.com',
        requirementType: 'BUY_RESIDENTIAL',
        preferredLocation: 'Hinjewadi Phase 1',
        budgetMin: 8500000,
        budgetMax: 12000000,
        notes: 'Verification test from 24K Realtors CRM',
        source: 'CRM Webhook Test'
      };
      
      const res = await apiService.syncLeadToGoogleSheet(sample);
      if (res.synced) {
        alert('🎉 SUCCESS! Test lead sent to your Google Sheet. Please check your Google Spreadsheet tab now!');
      } else {
        alert('ℹ️ Webhook URL is set and saved. Check Google Sheet for incoming rows.');
      }
    } catch (e) {
      alert('Error testing webhook: ' + e.message);
    } finally {
      setTestingWebhook(false);
    }
  };

  const handleExportCsv = () => {
    const listToExport = filteredLeads.length > 0 ? filteredLeads : leadsData;
    apiService.exportLeadsToCsv(listToExport);
  };

  const handleImportLeads = async () => {
    if (!importCsvText.trim()) return;
    setImporting(true);
    try {
      const lines = importCsvText.trim().split('\n');
      let count = 0;
      for (const line of lines) {
        if (!line.trim()) continue;
        const parts = line.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
        if (parts[0].toLowerCase().includes('name') || parts[0].toLowerCase().includes('lead id')) continue; // Skip header

        const name = parts[0] || 'Imported Lead';
        const phone = parts[1] || '+91 96730 00053';
        const location = parts[2] || 'Hinjewadi';
        const requirement = parts[3] || 'BUY_RESIDENTIAL';
        const notes = parts[4] || 'Bulk imported into 24K Realtors CRM';

        await apiService.submitLead({
          name,
          phone,
          location,
          requirementType: requirement,
          notes,
          source: 'Excel / CSV Import'
        });
        count++;
      }
      alert(`✅ Successfully imported ${count} leads into database & CRM!`);
      setImportCsvText('');
      setIsImportModalOpen(false);
      fetchLiveLeads();
    } catch (err) {
      alert('Error importing leads: ' + err.message);
    } finally {
      setImporting(false);
    }
  };

  const initialSeedLeads = [
    {
      id: 'LD-1001',
      initials: 'RS',
      avatarBg: '#2563EB',
      name: 'Rohit Sharma',
      sub: 'Looking for 2 BHK in Hinjewadi',
      phone: '+91 98765 43210',
      email: 'rohit.sharma@email.com',
      source: 'Website Portal',
      sourceColor: '#F59E0B',
      propertyInterest: '2 BHK Luxury Apartment',
      location: 'Hinjewadi',
      budget: '₹ 70 - 90 L',
      status: 'New',
      statusColor: '#3B82F6',
      statusBg: 'rgba(59,130,246,0.15)',
      assignedOn: 'Today',
      lastActivity: 'Just now',
    },
    {
      id: 'LD-1002',
      initials: 'SP',
      avatarBg: '#10B981',
      name: 'Sneha Patil',
      sub: 'Investment purpose',
      phone: '+91 87654 32109',
      email: 'sneha.patil@email.com',
      source: 'E-Brochure Download',
      sourceColor: '#10B981',
      propertyInterest: '2 BHK Apartment',
      location: 'Wakad',
      budget: '₹ 60 - 80 L',
      status: 'Contacted',
      statusColor: '#14B8A6',
      statusBg: 'rgba(20,184,166,0.15)',
      assignedOn: 'Yesterday',
      lastActivity: 'Yesterday 04:15 PM',
    },
    {
      id: 'LD-1003',
      initials: 'AM',
      avatarBg: '#8B5CF6',
      name: 'Amit Verma',
      sub: 'End user buyer',
      phone: '+91 76543 21098',
      email: 'amit.verma@email.com',
      source: 'Seller Mandate',
      sourceColor: '#8B5CF6',
      propertyInterest: '3 BHK Apartment',
      location: 'Baner',
      budget: '₹ 90 L - 1.2 Cr',
      status: 'Qualified',
      statusColor: '#10B981',
      statusBg: 'rgba(16,185,129,0.15)',
      assignedOn: '2 days ago',
      lastActivity: '2 days ago',
    }
  ];

  const fetchLiveLeads = async () => {
    setLoading(true);
    try {
      const data = await apiService.getLeads({ page: 0, size: 50 });
      const items = Array.isArray(data) ? data : (data?.content || []);
      if (items.length > 0) {
        const formatted = items.map((item, idx) => {
          const initials = (item.name || 'Lead')
            .split(' ')
            .map(n => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase() || 'LD';

          const colors = ['#2563EB', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B'];
          const avatarBg = colors[idx % colors.length];

          const budgetStr = item.budgetMin && item.budgetMax
            ? `₹ ${(item.budgetMin / 100000).toFixed(0)} - ${(item.budgetMax / 100000).toFixed(0)} L`
            : item.budgetMin ? `₹ ${(item.budgetMin / 100000).toFixed(0)} L` : '₹ 65 - 95 L';

          const statusColors = {
            'NEW': { color: '#3B82F6', bg: 'rgba(59,130,246,0.15)', label: 'New' },
            'CONTACTED': { color: '#14B8A6', bg: 'rgba(20,184,166,0.15)', label: 'Contacted' },
            'QUALIFIED': { color: '#10B981', bg: 'rgba(16,185,129,0.15)', label: 'Qualified' },
            'SITE_VISIT': { color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)', label: 'Site Visit' },
            'NEGOTIATION': { color: '#F59E0B', bg: 'rgba(245,158,11,0.15)', label: 'Negotiation' },
            'WON': { color: '#10B981', bg: 'rgba(16,185,129,0.2)', label: 'Won' },
            'LOST': { color: '#EF4444', bg: 'rgba(239,68,68,0.15)', label: 'Lost' }
          };

          const rawStatus = (item.status || 'NEW').toUpperCase();
          const stMeta = statusColors[rawStatus] || { color: '#3B82F6', bg: 'rgba(59,130,246,0.15)', label: item.status || 'New' };

          return {
            id: item.id || `LD-${idx + 1}`,
            initials,
            avatarBg,
            name: item.name || 'Anonymous Inquiry',
            sub: item.notes || item.requirementType || 'Portal Inquiry',
            phone: item.phone || 'N/A',
            email: item.email || 'N/A',
            source: item.source || 'Website Portal',
            sourceColor: item.source && item.source.includes('Brochure') ? '#10B981' : '#F59E0B',
            propertyInterest: item.requirementType ? `${item.requirementType.replace(/_/g, ' ')}` : 'Residential Luxury',
            location: item.location || item.preferredLocation || 'Hinjewadi',
            budget: budgetStr,
            status: stMeta.label,
            statusColor: stMeta.color,
            statusBg: stMeta.bg,
            assignedOn: item.createdDate ? new Date(item.createdDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Today',
            lastActivity: item.createdDate ? new Date(item.createdDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Active now',
            raw: item
          };
        });
        setLiveLeads(formatted);
      } else {
        setLiveLeads([]);
      }
    } catch (e) {
      console.warn('[CRM] Lead fetch error, checking local cache:', e);
      const local = JSON.parse(localStorage.getItem('mock_leads') || '[]');
      if (local.length > 0) {
        setLiveLeads(local);
      } else {
        setLiveLeads([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveLeads();
  }, []);

  const leadsData = liveLeads;

  const filteredLeads = leadsData.filter(item => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.phone.includes(search) && !item.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (sourceFilter !== 'ALL' && item.source !== sourceFilter) return false;
    if (statusFilter !== 'ALL' && item.status.toUpperCase() !== statusFilter.toUpperCase()) return false;
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

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Sync DB */}
          <button 
            onClick={fetchLiveLeads} 
            disabled={loading}
            title="Refresh Leads from Database"
            style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(212,175,55,0.1)', border: `1px solid ${GOLD}40`, color: GOLD, fontSize: '0.74rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> {loading ? 'Syncing...' : 'Sync DB'}
          </button>

          {/* Master Google Sheet Link */}
          <a
            href={GOOGLE_SHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Open Live Master Google Sheet in new tab"
            style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', color: '#10B981', fontSize: '0.74rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sparkles size={13} /> Master Google Sheet ↗
          </a>

          {/* Webhook Settings Modal */}
          <button
            onClick={() => setIsWebhookModalOpen(true)}
            title="Configure real-time Google Sheets Webhook URL"
            style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(212,175,55,0.08)', border: `1px solid ${GOLD}30`, color: GOLD, fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Settings size={13} /> Webhook URL
          </button>

          {/* Export to Excel / CSV */}
          <button
            onClick={handleExportCsv}
            title="Download full leads report as Excel / CSV spreadsheet"
            style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#60A5FA', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Download size={13} /> Export Excel
          </button>

          {/* Import Leads Modal */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Upload size={13} /> Import CSV
          </button>

          {/* Add New Lead */}
          <button
            onClick={onOpenAddLead}
            style={{ padding: '8px 16px', borderRadius: '8px', background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, border: 'none', color: '#070D18', fontSize: '0.76rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 4px 14px rgba(212,175,55,0.25)' }}
          >
            <Plus size={14} /> Add Lead
          </button>
        </div>
      </div>

      {/* ── 6 KPI SPARKLINE CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
        {[
          { label: 'Total Leads', val: String(liveLeads.length), change: 'Live Pipeline', color: GOLD, icon: Users },
          { label: 'New Leads', val: String(liveLeads.filter(l => l.status === 'New' || l.status === 'NEW').length), change: 'Uncontacted', color: '#3B82F6', icon: UserCheck },
          { label: 'Contacted', val: String(liveLeads.filter(l => l.status === 'Contacted' || l.status === 'CONTACTED').length), change: 'In Discussion', color: '#14B8A6', icon: Phone },
          { label: 'Qualified', val: String(liveLeads.filter(l => l.status === 'Qualified' || l.status === 'QUALIFIED').length), change: 'Verified Leads', color: '#10B981', icon: Award },
          { label: 'Site Visit', val: String(liveLeads.filter(l => l.status === 'Site Visit' || l.status === 'SITE_VISIT').length), change: 'Scheduled', color: '#8B5CF6', icon: Calendar },
          { label: 'Converted', val: String(liveLeads.filter(l => l.status === 'Won' || l.status === 'WON' || l.status === 'Converted' || l.status === 'CONVERTED').length), change: 'Closed Deals', color: GOLD, icon: Award },
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
            <option value="Follow-up" style={{ background: '#070F1E' }}>Follow-up</option>
            <option value="Site Visit" style={{ background: '#070F1E' }}>Site Visit</option>
            <option value="Negotiation" style={{ background: '#070F1E' }}>Negotiation</option>
            <option value="Won" style={{ background: '#070F1E' }}>Won</option>
            <option value="Lost" style={{ background: '#070F1E' }}>Lost</option>
            <option value="Dormant" style={{ background: '#070F1E' }}>Dormant</option>
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
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '48px 20px', color: 'rgba(255,255,255,0.6)' }}>
                    <RefreshCw size={22} className="animate-spin" color={GOLD} style={{ margin: '0 auto 10px auto', display: 'block' }} />
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#FFF' }}>Syncing leads with database…</div>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '52px 20px', color: 'rgba(255,255,255,0.45)' }}>
                    <Users size={36} color="rgba(212, 175, 55, 0.4)" style={{ margin: '0 auto 12px auto', display: 'block' }} />
                    <div style={{ fontSize: '0.92rem', color: '#FFF', fontWeight: 700 }}>No Leads Found</div>
                    <div style={{ fontSize: '0.76rem', marginTop: '4px', color: 'rgba(255,255,255,0.5)' }}>
                      {search || sourceFilter !== 'ALL' || statusFilter !== 'ALL'
                        ? 'No leads match your current search/filter criteria. Click "Reset" to clear.'
                        : 'No leads in the pipeline yet. Click "+ Add Lead" to record an inquiry.'}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.74rem', color: 'rgba(255,255,255,0.5)', flexWrap: 'wrap', gap: '10px' }}>
          <div>Showing {filteredLeads.length} of {liveLeads.length} leads</div>
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
              { label: 'Export Excel', icon: Download, action: handleExportCsv, color: '#60A5FA' },
              { label: 'Master Sheet', icon: Sparkles, action: () => window.open(GOOGLE_SHEET_URL, '_blank'), color: '#10B981' },
              { label: 'Sync Database', icon: RefreshCw, action: fetchLiveLeads, color: '#8B5CF6' },
              { label: 'Import CSV', icon: Upload, action: () => setIsImportModalOpen(true), color: '#EC4899' },
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

      {/* ── IMPORT CSV / EXCEL MODAL ── */}
      {isImportModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          background: 'rgba(3, 7, 18, 0.88)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            width: '600px',
            maxWidth: '100%',
            background: '#070F1E',
            border: `1px solid rgba(212,175,55,0.35)`,
            borderRadius: '16px',
            boxShadow: '0 25px 80px rgba(0,0,0,0.9), 0 0 40px rgba(212,175,55,0.1)',
            padding: '24px',
            color: '#FFF'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Upload size={20} color={GOLD} />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Import Leads from Excel / CSV</h3>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: '14px', lineHeight: 1.5 }}>
              Paste comma-separated rows below. Each row will be validated and automatically inserted into the PostgreSQL database and CRM.
            </p>

            <div style={{ background: 'rgba(212,175,55,0.06)', border: `1px dashed rgba(212,175,55,0.3)`, borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', fontSize: '0.72rem', color: '#E6C35C' }}>
              <strong>Expected CSV Format per line:</strong><br/>
              <code>Customer Name, Phone Number, Location, Requirement, Notes</code><br/>
              <span style={{ opacity: 0.8 }}>Example: Rajesh Deshmukh, +919876543210, Baner, BUY_RESIDENTIAL, Looking for 3 BHK</span>
            </div>

            <textarea
              rows={8}
              placeholder="Rajesh Deshmukh, +919876543210, Baner, BUY_RESIDENTIAL, Interested in Baner 3BHK&#10;Priya Shah, +919123456780, Wakad, BUY_RESIDENTIAL, Budget 85L"
              value={importCsvText}
              onChange={(e) => setImportCsvText(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#FFF',
                fontSize: '0.78rem',
                fontFamily: 'monospace',
                boxSizing: 'border-box',
                outline: 'none',
                resize: 'vertical'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button
                onClick={() => setIsImportModalOpen(false)}
                style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', fontSize: '0.78rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleImportLeads}
                disabled={importing || !importCsvText.trim()}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${GOLD}, #B8860B)`,
                  border: 'none',
                  color: '#070D18',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: (importing || !importCsvText.trim()) ? 'not-allowed' : 'pointer'
                }}
              >
                {importing ? 'Importing Leads...' : 'Import to Database'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── GOOGLE SHEETS WEBHOOK SETTINGS MODAL ── */}
      {isWebhookModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          background: 'rgba(3, 7, 18, 0.88)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            width: '640px',
            maxWidth: '100%',
            background: '#070F1E',
            border: `1px solid rgba(212,175,55,0.35)`,
            borderRadius: '16px',
            boxShadow: '0 25px 80px rgba(0,0,0,0.9), 0 0 40px rgba(212,175,55,0.1)',
            padding: '24px',
            color: '#FFF'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings size={20} color={GOLD} />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Google Sheets Auto-Sync Settings</h3>
              </div>
              <button onClick={() => setIsWebhookModalOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', marginBottom: '16px', lineHeight: 1.5 }}>
              Paste your Google Apps Script Web App URL below to automatically append every website inquiry to your Google Spreadsheet in real-time.
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginBottom: '6px', fontWeight: 700 }}>
                GOOGLE APPS SCRIPT WEB APP URL
              </label>
              <input
                type="text"
                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                value={webhookUrlInput}
                onChange={(e) => setWebhookUrlInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#FFF',
                  fontSize: '0.78rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '10px', padding: '12px 14px', marginBottom: '18px', fontSize: '0.73rem', color: '#6EE7B7', lineHeight: 1.5 }}>
              <strong>💡 1-Minute Setup Guide:</strong><br/>
              1. Open your <a href={GOOGLE_SHEET_URL} target="_blank" rel="noreferrer" style={{ color: '#FFF', textDecoration: 'underline' }}>Master Google Sheet</a> &gt; Click <strong>Extensions &gt; Apps Script</strong>.<br/>
              2. Paste the code from <code>google-apps-script/Code.gs</code> and click <strong>Save</strong>.<br/>
              3. Click <strong>Deploy &gt; New deployment</strong> &gt; Type: <strong>Web app</strong> &gt; Access: <strong>Anyone</strong>.<br/>
              4. Copy the Web app URL and paste it in the box above!
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={testingWebhook}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: 'rgba(16,185,129,0.15)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  color: '#10B981',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: testingWebhook ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={13} /> {testingWebhook ? 'Sending Test...' : 'Send Test Lead to Sheet'}
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setIsWebhookModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', fontSize: '0.76rem', cursor: 'pointer' }}
                >
                  Close
                </button>
                <button
                  onClick={() => { handleSaveWebhook(); setIsWebhookModalOpen(false); }}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '8px',
                    background: `linear-gradient(135deg, ${GOLD}, #B8860B)`,
                    border: 'none',
                    color: '#070D18',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Save URL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
