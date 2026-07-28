// ═══════════════════════════════════════════════════════════════════════════
// 24K REALTORS — Commissions & Payroll Module
// Features:
//   - 5 KPI Header Sparkline Cards (Total, Pending, Approved, Paid, This Month)
//   - Tab Filters: All Commissions, Pending Approval (12), Approved (18), Paid (24), Cancelled (3)
//   - Multi-select Filters (Employee, Status, Deal Status, Date Range)
//   - Commissions Data Table with checkboxes, status badges, employee avatars, action buttons
//   - Right Sidebar: Donut Breakdown, Monthly Status Trend line chart, Top Earners Leaderboard
//   - Bottom Grid: Commission Lifecycle Flow, Upcoming Payouts, Recent Payouts, Quick Actions
//   - Action Modals: Commission Settings, Add Manual Commission, Approve Selected
// ═══════════════════════════════════════════════════════════════════════════
import React, { useState, useMemo } from 'react';
import {
  Award, Clock, CheckCircle2, DollarSign, Calendar, Filter, Download,
  Settings, Check, X, Search, ChevronRight, Eye, Edit2, Plus, FileText,
  TrendingUp, ArrowUpRight, ArrowDownRight, RefreshCw, User, Sparkles
} from 'lucide-react';

const GOLD = '#D4AF37';

const MOCK_COMMISSIONS = [
  { id: 'DEAL-2026-032', project: 'Lodha Hinjewadi', unit: '2 BHK - 1050 Sq.ft.', empName: 'Manish Rai', empRole: 'Sales Consultant', empAvatar: 'MR', empColor: '#F59E0B', dealValue: '₹1.20 Cr', commRate: '2.50%', commAmount: '₹3,00,000', status: 'PENDING', expectedDate: '05 Aug 2026' },
  { id: 'DEAL-2026-031', project: 'VTP Blue Waters', unit: '3 BHK - 1250 Sq.ft.', empName: 'Jyoti Dhale', empRole: 'Senior Sales Consultant', empAvatar: 'JD', empColor: '#EC4899', dealValue: '₹75.0 L', commRate: '2.00%', commAmount: '₹1,50,000', status: 'PENDING', expectedDate: '03 Aug 2026' },
  { id: 'DEAL-2026-030', project: 'Panchshil Towers', unit: '4 BHK - 2100 Sq.ft.', empName: 'Yash Murkute', empRole: 'Sales Consultant', empAvatar: 'YM', empColor: '#3B82F6', dealValue: '₹1.45 Cr', commRate: '2.25%', commAmount: '₹3,26,250', status: 'APPROVED', expectedDate: '10 Aug 2026' },
  { id: 'DEAL-2026-029', project: 'Megapolis Symphony', unit: '3 BHK - 1500 Sq.ft.', empName: 'Rohini K.', empRole: 'Sales Consultant', empAvatar: 'RK', empColor: '#8B5CF6', dealValue: '₹82.0 L', commRate: '2.00%', commAmount: '₹1,64,000', status: 'APPROVED', expectedDate: '02 Aug 2026' },
  { id: 'DEAL-2026-028', project: 'Lodha Belmondo', unit: '3 BHK - 1600 Sq.ft.', empName: 'Amit Singh', empRole: 'Team Leader', empAvatar: 'AS', empColor: '#10B981', dealValue: '₹1.05 Cr', commRate: '2.50%', commAmount: '₹2,62,500', status: 'PAID', expectedDate: '20 Jul 2026' },
  { id: 'DEAL-2026-027', project: 'Godrej Hillside', unit: '2 BHK - 950 Sq.ft.', empName: 'Sneha Iyer', empRole: 'Sales Consultant', empAvatar: 'SI', empColor: '#F97316', dealValue: '₹65.0 L', commRate: '2.00%', commAmount: '₹1,30,000', status: 'PAID', expectedDate: '18 Jul 2026' },
  { id: 'DEAL-2026-026', project: 'Kolte Patil Life Republic', unit: '2 BHK - 850 Sq.ft.', empName: 'Vikram Malhotra', empRole: 'Sales Consultant', empAvatar: 'VM', empColor: '#3B82F6', dealValue: '₹55.0 L', commRate: '2.00%', commAmount: '₹1,10,000', status: 'PAID', expectedDate: '15 Jul 2026' },
  { id: 'DEAL-2026-025', project: 'VTP Beaumonde', unit: '2 BHK - 1100 Sq.ft.', empName: 'Meera Gupta', empRole: 'Sales Consultant', empAvatar: 'MG', empColor: '#EC4899', dealValue: '₹68.0 L', commRate: '2.00%', commAmount: '₹1,36,000', status: 'CANCELLED', expectedDate: '12 Jul 2026' },
];

const TOP_EARNERS = [
  { name: 'Manish Rai', amount: '₹1,25,000', avatar: 'MR', color: '#F59E0B' },
  { name: 'Jyoti Dhale', amount: '₹98,000', avatar: 'JD', color: '#EC4899' },
  { name: 'Yash Murkute', amount: '₹85,500', avatar: 'YM', color: '#3B82F6' },
  { name: 'Amit Singh', amount: '₹62,500', avatar: 'AS', color: '#10B981' },
  { name: 'Rohini K.', amount: '₹48,000', avatar: 'RK', color: '#8B5CF6' },
];

const UPCOMING_PAYOUTS = [
  { name: 'Manish Rai', amount: '₹3,00,000', date: '05 Aug 2026', status: 'PENDING', color: '#F59E0B' },
  { name: 'Jyoti Dhale', amount: '₹1,50,000', date: '03 Aug 2026', status: 'PENDING', color: '#F59E0B' },
  { name: 'Yash Murkute', amount: '₹3,26,250', date: '10 Aug 2026', status: 'APPROVED', color: '#10B981' },
];

const RECENT_PAYOUTS = [
  { name: 'Amit Singh', amount: '₹2,62,500', date: '20 Jul 2026', status: 'PAID', color: '#3B82F6' },
  { name: 'Sneha Iyer', amount: '₹1,30,000', date: '18 Jul 2026', status: 'PAID', color: '#3B82F6' },
  { name: 'Vikram Malhotra', amount: '₹1,10,000', date: '15 Jul 2026', status: 'PAID', color: '#3B82F6' },
];

const Avatar = ({ initials, color, size = 32 }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', background: `${color}22`, border: `1.5px solid ${color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.35, fontWeight: 800, color, flexShrink: 0 }}>
    {initials}
  </div>
);

const Sparkline = ({ color }) => (
  <svg width="100%" height="24" viewBox="0 0 120 24" fill="none">
    <path d="M0 18 Q 20 12, 40 16 T 80 8 T 120 4" stroke={color} strokeWidth="2" fill="none" />
  </svg>
);

export default function CommissionsTab() {
  const [activeSubTab, setActiveSubTab] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [commissionsList, setCommissionsList] = useState(MOCK_COMMISSIONS);

  const filtered = useMemo(() => {
    return commissionsList.filter(item => {
      if (activeSubTab === 'PENDING' && item.status !== 'PENDING') return false;
      if (activeSubTab === 'APPROVED' && item.status !== 'APPROVED') return false;
      if (activeSubTab === 'PAID' && item.status !== 'PAID') return false;
      if (activeSubTab === 'CANCELLED' && item.status !== 'CANCELLED') return false;
      if (selectedEmployee !== 'ALL' && item.empName !== selectedEmployee) return false;
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      return true;
    });
  }, [commissionsList, activeSubTab, selectedEmployee, statusFilter]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(c => c.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleApproveSelected = () => {
    if (selectedIds.length === 0) return alert('Select at least one commission to approve.');
    setCommissionsList(prev => prev.map(c => selectedIds.includes(c.id) ? { ...c, status: 'APPROVED' } : c));
    setSelectedIds([]);
    alert(`✅ ${selectedIds.length} commission(s) approved successfully!`);
  };

  const statusBadge = (status) => {
    const map = {
      PENDING: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
      APPROVED: { bg: 'rgba(16,185,129,0.12)', color: '#10B981', border: 'rgba(16,185,129,0.3)' },
      PAID: { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6', border: 'rgba(59,130,246,0.3)' },
      CANCELLED: { bg: 'rgba(239,68,68,0.12)', color: '#EF4444', border: 'rgba(239,68,68,0.3)' },
    };
    const s = map[status] || map.PENDING;
    return (
      <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '0.66rem', fontWeight: 800, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFF' }}>Commissions</div>
          <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>Track, approve and manage team commissions</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button onClick={handleApproveSelected}
            style={{ padding: '9px 18px', borderRadius: '8px', background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, border: 'none', color: '#070D18', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: `0 4px 14px ${GOLD}30` }}>
            <CheckCircle2 size={15} /> Approve Selected
          </button>
          <button style={{ padding: '9px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={14} /> Export
          </button>
          <button onClick={() => setShowSettingsModal(true)}
            style={{ padding: '9px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Settings size={14} /> Commission Settings
          </button>
        </div>
      </div>

      {/* ── 5 KPI CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
        {[
          { label: 'TOTAL COMMISSION', val: '₹28,45,000', change: '↑ 18.6% vs last month', color: '#8B5CF6', icon: Award },
          { label: 'PENDING APPROVAL', val: '₹7,85,000', change: '↑ 12.4% vs last month', color: '#F59E0B', icon: Clock },
          { label: 'APPROVED', val: '₹14,20,000', change: '↑ 16.8% vs last month', color: '#10B981', icon: CheckCircle2 },
          { label: 'PAID', val: '₹6,40,000', change: '↑ 20.5% vs last month', color: '#3B82F6', icon: DollarSign },
          { label: 'THIS MONTH (JUL 2026)', val: '₹4,25,000', change: '↑ 15.6% vs last month', color: GOLD, icon: Calendar },
        ].map((kpi, i) => {
          const IconC = kpi.icon;
          return (
            <div key={i} style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '6px', background: `${kpi.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconC size={13} color={kpi.color} />
                  </div>
                  <span style={{ fontSize: '0.64rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>{kpi.label}</span>
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFF', marginBottom: '4px' }}>{kpi.val}</div>
                <div style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 600 }}>{kpi.change}</div>
              </div>
              <div style={{ marginTop: '10px' }}>
                <Sparkline color={kpi.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MAIN CONTENT (TABLE + RIGHT SIDEBAR) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 330px', gap: '18px', alignItems: 'start' }}>

        {/* LEFT — TABLE CONTAINER */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>

          {/* Sub Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 16px' }}>
            {[
              { id: 'ALL', label: 'All Commissions' },
              { id: 'PENDING', label: 'Pending Approval (12)' },
              { id: 'APPROVED', label: 'Approved (18)' },
              { id: 'PAID', label: 'Paid (24)' },
              { id: 'CANCELLED', label: 'Cancelled (3)' },
            ].map(t => (
              <button key={t.id} onClick={() => setActiveSubTab(t.id)}
                style={{ padding: '13px 16px', background: 'none', border: 'none', borderBottom: activeSubTab === t.id ? `2px solid ${GOLD}` : '2px solid transparent', color: activeSubTab === t.id ? GOLD : 'rgba(255,255,255,0.45)', fontSize: '0.78rem', fontWeight: activeSubTab === t.id ? 700 : 400, cursor: 'pointer', marginBottom: '-1px' }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Filters Bar */}
          <div style={{ padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
            <select style={{ padding: '7px 12px', borderRadius: '8px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '0.76rem', outline: 'none' }}
              value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)}>
              <option value="ALL">Select Employee</option>
              <option value="Manish Rai">Manish Rai</option>
              <option value="Jyoti Dhale">Jyoti Dhale</option>
              <option value="Yash Murkute">Yash Murkute</option>
              <option value="Rohini K.">Rohini K.</option>
              <option value="Amit Singh">Amit Singh</option>
            </select>

            <select style={{ padding: '7px 12px', borderRadius: '8px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '0.76rem', outline: 'none' }}
              value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="ALL">Commission Status</option>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="PAID">PAID</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            <select style={{ padding: '7px 12px', borderRadius: '8px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '0.76rem', outline: 'none' }}>
              <option>Deal Status</option>
              <option>WON</option>
              <option>AGREEMENT_DONE</option>
              <option>REGISTRATION_COMPLETE</option>
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.74rem', color: 'rgba(255,255,255,0.6)' }}>
              <Calendar size={13} color={GOLD} />
              <span>01 Jul 2026 - 31 Jul 2026</span>
            </div>

            <button onClick={() => { setSelectedEmployee('ALL'); setStatusFilter('ALL'); setActiveSubTab('ALL'); }}
              style={{ padding: '7px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: '0.74rem', cursor: 'pointer' }}>
              Reset
            </button>

            <button style={{ marginLeft: 'auto', padding: '7px 14px', borderRadius: '8px', background: `rgba(212,175,55,0.1)`, border: `1px solid ${GOLD}30`, color: GOLD, fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Filter size={12} /> Filters
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.015)' }}>
                  <th style={{ padding: '10px 14px', width: 30 }}>
                    <input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={toggleSelectAll} style={{ cursor: 'pointer' }} />
                  </th>
                  {['DEAL ID', 'CLIENT / PROJECT', 'EMPLOYEE', 'DEAL VALUE', 'COMM. %', 'COMM. AMOUNT', 'STATUS', 'EXPECTED DATE', 'ACTIONS'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.64rem', fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(row => (
                  <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 14px' }}>
                      <input type="checkbox" checked={selectedIds.includes(row.id)} onChange={() => toggleSelect(row.id)} style={{ cursor: 'pointer' }} />
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.74rem', color: GOLD, fontFamily: 'monospace', fontWeight: 700, whiteSpace: 'nowrap' }}>{row.id}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFF', whiteSpace: 'nowrap' }}>{row.project}</div>
                      <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.38)', marginTop: '2px' }}>{row.unit}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Avatar initials={row.empAvatar} color={row.empColor} size={28} />
                        <div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFF', whiteSpace: 'nowrap' }}>{row.empName}</div>
                          <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.35)' }}>{row.empRole}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.8rem', fontWeight: 700, color: '#FFF', whiteSpace: 'nowrap' }}>{row.dealValue}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>{row.commRate}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.82rem', fontWeight: 900, color: GOLD, whiteSpace: 'nowrap' }}>{row.commAmount}</td>
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>{statusBadge(row.status)}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.74rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>{row.expectedDate}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button style={{ width: 26, height: 26, borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="View Details"><Eye size={12} /></button>
                        <button style={{ width: 26, height: 26, borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Edit"><Edit2 size={12} /></button>
                        <button style={{ width: 26, height: 26, borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Download Invoice"><Download size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '12px 16px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Showing 1 to {filtered.length} of {commissionsList.length} commissions</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map(p => (
                  <button key={p} style={{ width: 24, height: 24, borderRadius: '4px', background: p === 1 ? GOLD : 'rgba(255,255,255,0.04)', border: 'none', color: p === 1 ? '#000' : 'rgba(255,255,255,0.6)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Donut Overview */}
          <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF', marginBottom: '14px' }}>Commission Overview (This Month)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: 90, height: 90, borderRadius: '50%', background: `conic-gradient(#F59E0B 0% 29.4%, #10B981 29.4% 71.8%, #3B82F6 71.8% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ width: 62, height: 62, borderRadius: '50%', background: '#070F1E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 900, color: GOLD }}>₹4.25L</div>
                  <div style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.4)' }}>Total</div>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { label: 'Pending', val: '₹1.25L (29.4%)', color: '#F59E0B' },
                  { label: 'Approved', val: '₹1.80L (42.4%)', color: '#10B981' },
                  { label: 'Paid', val: '₹1.20L (28.2%)', color: '#3B82F6' },
                  { label: 'Cancelled', val: '₹0 (0%)', color: '#EF4444' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: item.color }} />
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>{item.label}</span>
                    </div>
                    <span style={{ color: item.color, fontWeight: 700 }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status Trend Chart */}
          <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF' }}>Commission Status Trend</div>
              <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>This Month</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', fontSize: '0.66rem' }}>
              <span style={{ color: '#F59E0B', fontWeight: 700 }}>-- Pending</span>
              <span style={{ color: '#10B981', fontWeight: 700 }}>-- Approved</span>
              <span style={{ color: '#3B82F6', fontWeight: 700 }}>-- Paid</span>
            </div>
            <div style={{ height: 90, display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              {[
                { date: '1 Jul', p: 40, a: 20, pd: 10 },
                { date: '8 Jul', p: 65, a: 35, pd: 20 },
                { date: '15 Jul', p: 85, a: 55, pd: 30 },
                { date: '22 Jul', p: 110, a: 70, pd: 45 },
                { date: '31 Jul', p: 125, a: 85, pd: 60 },
              ].map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: 68 }}>
                    <div style={{ flex: 1, height: `${d.p}%`, background: '#F59E0B', borderRadius: '2px 2px 0 0' }} />
                    <div style={{ flex: 1, height: `${d.a}%`, background: '#10B981', borderRadius: '2px 2px 0 0' }} />
                    <div style={{ flex: 1, height: `${d.pd}%`, background: '#3B82F6', borderRadius: '2px 2px 0 0' }} />
                  </div>
                  <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)' }}>{d.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Earners Leaderboard */}
          <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF', marginBottom: '14px' }}>🏆 Top Earners (This Month)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {TOP_EARNERS.map((e, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: i === 0 ? GOLD : 'rgba(255,255,255,0.4)', width: 14 }}>{i + 1}</span>
                  <Avatar initials={e.avatar} color={e.color} size={28} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFF', flex: 1 }}>{e.name}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: GOLD }}>{e.amount}</span>
                </div>
              ))}
            </div>
            <button style={{ width: '100%', marginTop: '14px', padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: GOLD, fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}>
              View Full Report →
            </button>
          </div>
        </div>
      </div>

      {/* ── BOTTOM GRID (LIFECYCLE, PAYOUTS, QUICK ACTIONS) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 220px', gap: '16px', alignItems: 'stretch' }}>

        {/* Commission Lifecycle Flow */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF', marginBottom: '16px' }}>Commission Lifecycle</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            {[
              { label: 'PENDING', desc: 'Waiting for approval', color: '#F59E0B', icon: Clock },
              { label: 'APPROVED', desc: 'Approved by Manager/Admin', color: '#10B981', icon: CheckCircle2 },
              { label: 'PAID', desc: 'Paid to employee', color: '#3B82F6', icon: DollarSign },
              { label: 'CANCELLED', desc: 'Cancelled commission', color: '#EF4444', icon: X },
            ].map((step, i) => {
              const IconC = step.icon;
              return (
                <React.Fragment key={i}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', zIndex: 2 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${step.color}15`, border: `2px solid ${step.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px' }}>
                      <IconC size={16} color={step.color} />
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 800, color: step.color }}>{step.label}</div>
                    <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.35)', maxWidth: 80, marginTop: '2px' }}>{step.desc}</div>
                  </div>
                  {i < 3 && <div style={{ height: 2, flex: 1, background: 'rgba(255,255,255,0.1)', margin: '0 4px', marginBottom: 20 }} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Upcoming Payouts */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF' }}>Upcoming Payouts</div>
            <span style={{ fontSize: '0.68rem', color: GOLD, fontWeight: 700, cursor: 'pointer' }}>View All</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {UPCOMING_PAYOUTS.map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'rgba(255,255,255,0.025)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Avatar initials={p.name.split(' ').map(n=>n[0]).join('')} color={p.color} size={24} />
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#FFF' }}>{p.name}</div>
                    <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)' }}>Expected {p.date}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: GOLD }}>{p.amount}</div>
                  <span style={{ fontSize: '0.58rem', color: p.status === 'APPROVED' ? '#10B981' : '#F59E0B', fontWeight: 700 }}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payouts */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF' }}>Recent Payouts</div>
            <span style={{ fontSize: '0.68rem', color: GOLD, fontWeight: 700, cursor: 'pointer' }}>View All</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {RECENT_PAYOUTS.map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'rgba(255,255,255,0.025)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Avatar initials={p.name.split(' ').map(n=>n[0]).join('')} color={p.color} size={24} />
                  <div>
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#FFF' }}>{p.name}</div>
                    <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)' }}>Paid {p.date}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#10B981' }}>{p.amount}</div>
                  <span style={{ fontSize: '0.58rem', color: '#3B82F6', fontWeight: 700 }}>PAID</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF', marginBottom: '4px' }}>Quick Actions</div>
          {[
            { label: 'Approve Commission', icon: CheckCircle2, color: '#10B981', action: handleApproveSelected },
            { label: 'Add Manual Commission', icon: Plus, color: GOLD, action: () => setShowAddModal(true) },
            { label: 'Commission Report', icon: FileText, color: '#3B82F6', action: () => alert('Generating full commission PDF report...') },
          ].map((act, i) => {
            const IconC = act.icon;
            return (
              <button key={i} onClick={act.action}
                style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#FFF', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
                <IconC size={15} color={act.color} />
                <span>{act.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── SETTINGS MODAL ── */}
      {showSettingsModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#070F1E', border: `1px solid ${GOLD}30`, borderRadius: '16px', width: '100%', maxWidth: '520px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#FFF' }}>⚙️ Commission Slab Settings</div>
              <button onClick={() => setShowSettingsModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { role: 'Sales Consultant', defaultRate: '2.00%' },
                { label: 'Senior Sales Consultant', defaultRate: '2.25%' },
                { label: 'Team Leader', defaultRate: '2.50%' },
                { label: 'Reporting Manager Bonus', defaultRate: '0.50%' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#FFF' }}>{s.role || s.label}</span>
                  <input style={{ width: 70, padding: '4px 8px', borderRadius: '6px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.15)', color: GOLD, fontSize: '0.78rem', fontWeight: 800, textAlign: 'center' }} defaultValue={s.defaultRate} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowSettingsModal(false)} style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { setShowSettingsModal(false); alert('Settings saved!'); }} style={{ padding: '8px 20px', borderRadius: '8px', background: GOLD, border: 'none', color: '#000', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>Save Settings</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD MANUAL COMMISSION MODAL ── */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#070F1E', border: `1px solid ${GOLD}30`, borderRadius: '16px', width: '100%', maxWidth: '540px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#FFF' }}>➕ Add Manual Commission Record</div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>DEAL ID</label>
                <input placeholder="DEAL-2026-033" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>EMPLOYEE</label>
                <select style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none' }}>
                  <option>Manish Rai</option>
                  <option>Jyoti Dhale</option>
                  <option>Yash Murkute</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>DEAL VALUE</label>
                <input placeholder="₹1.20 Cr" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>COMMISSION AMOUNT</label>
                <input placeholder="₹3,00,000" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowAddModal(false)} style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { setShowAddModal(false); alert('Commission Record Added!'); }} style={{ padding: '8px 20px', borderRadius: '8px', background: GOLD, border: 'none', color: '#000', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>Add Commission</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
