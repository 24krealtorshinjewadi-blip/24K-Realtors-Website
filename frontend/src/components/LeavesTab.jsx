// ═══════════════════════════════════════════════════════════════════════════
// 24K REALTORS — HR & Leaves Management Suite
// Features:
//   - 6 KPI Sparkline Cards (Total Employees 32, Active 28, On Probation 2, Resigned 2, Depts 6, Birthdays 1)
//   - Leave Overview Donut Chart (42 Total Leaves: Approved, Pending, Rejected, Cancelled, Expired)
//   - July 2026 Interactive Leave Calendar
//   - Leave Balance (As on Today) Allocation Table (CL, EL, SL, PL, ML, Paternity)
//   - Leave Requests Data Table with 5 Sub-Tabs (All, Pending, Approved, Rejected, Cancelled), Filters & Export
//   - Employee Distribution Donut Chart (Sales 50%, Marketing 18.75%, Ops 12.5%, HR 9.38%, Admin 9.38%)
//   - HR Announcements Widget with New Announcement creator
//   - Upcoming Birthdays Tracker
//   - Quick Actions Grid (8 One-Click Tiles: Add Emp, Leave Req, Approve, Policies, Directory, Attendance, Calendar, HR Report)
//   - Action Modals for Add Employee, Leave Request, HR Policies
// ═══════════════════════════════════════════════════════════════════════════
import React, { useState, useMemo } from 'react';
import {
  Users, UserCheck, UserX, Clock, Calendar, ShieldCheck, CheckCircle2,
  XCircle, Filter, Download, Plus, Search, Eye, Edit2, Check, X,
  Bell, FileText, Gift, Award, Briefcase, ChevronRight, ChevronLeft,
  Building, Sparkles, AlertCircle
} from 'lucide-react';

const GOLD = '#D4AF37';

const MOCK_LEAVE_BALANCES = [
  { type: 'Casual Leave (CL)', allocated: 12, used: 5, balance: 7, color: '#10B981' },
  { type: 'Earned Leave (EL)', allocated: 18, used: 6, balance: 12, color: '#3B82F6' },
  { type: 'Sick Leave (SL)', allocated: 12, used: 2, balance: 10, color: '#F59E0B' },
  { type: 'Privilege Leave (PL)', allocated: 6, used: 1, balance: 5, color: '#8B5CF6' },
  { type: 'Maternity Leave (ML)', allocated: 180, used: 0, balance: 180, color: '#EC4899' },
  { type: 'Paternity Leave', allocated: 10, used: 0, balance: 10, color: '#14B8A6' },
];

const MOCK_LEAVE_REQUESTS = [
  { id: 'LR-001', name: 'Jyoti Dhale', role: 'Senior Sales Consultant', avatar: 'JD', color: '#EC4899', leaveType: 'Casual Leave (CL)', fromDate: '28 Jul 2026', toDate: '29 Jul 2026', days: 2, reason: 'Personal Work', status: 'Pending', appliedOn: '24 Jul 2026' },
  { id: 'LR-002', name: 'Yash Murkute', role: 'Sales Consultant', avatar: 'YM', color: '#3B82F6', leaveType: 'Earned Leave (EL)', fromDate: '03 Aug 2026', toDate: '07 Aug 2026', days: 5, reason: 'Family Function', status: 'Pending', appliedOn: '24 Jul 2026' },
  { id: 'LR-003', name: 'Amit Singh', role: 'Team Leader', avatar: 'AS', color: '#10B981', leaveType: 'Sick Leave (SL)', fromDate: '25 Jul 2026', toDate: '25 Jul 2026', days: 1, reason: 'Fever', status: 'Pending', appliedOn: '24 Jul 2026' },
  { id: 'LR-004', name: 'Sneha Iyer', role: 'Sales Consultant', avatar: 'SI', color: '#F97316', leaveType: 'Casual Leave (CL)', fromDate: '31 Jul 2026', toDate: '31 Jul 2026', days: 1, reason: 'Personal Work', status: 'Pending', appliedOn: '23 Jul 2026' },
  { id: 'LR-005', name: 'Rohini K.', role: 'Sales Consultant', avatar: 'RK', color: '#8B5CF6', leaveType: 'Earned Leave (EL)', fromDate: '05 Aug 2026', toDate: '06 Aug 2026', days: 2, reason: 'Travel', status: 'Pending', appliedOn: '23 Jul 2026' },
  { id: 'LR-006', name: 'Manish Rai', role: 'Sales Consultant', avatar: 'MR', color: '#F59E0B', leaveType: 'Casual Leave (CL)', fromDate: '10 Jul 2026', toDate: '11 Jul 2026', days: 2, reason: 'Personal', status: 'Approved', appliedOn: '08 Jul 2026' },
  { id: 'LR-007', name: 'Vikram Malhotra', role: 'Sales Consultant', avatar: 'VM', color: '#3B82F6', leaveType: 'Sick Leave (SL)', fromDate: '02 Jul 2026', toDate: '02 Jul 2026', days: 1, reason: 'Dental Checkup', status: 'Approved', appliedOn: '01 Jul 2026' },
];

const UPCOMING_BIRTHDAYS = [
  { name: 'Jyoti Dhale', role: 'Senior Sales Consultant', date: '28 Jul', daysLeft: 'in 4 days', avatar: 'JD', color: '#EC4899' },
  { name: 'Amit Singh', role: 'Team Leader', date: '02 Aug', daysLeft: 'in 9 days', avatar: 'AS', color: '#10B981' },
  { name: 'Sneha Iyer', role: 'Sales Consultant', date: '05 Aug', daysLeft: 'in 12 days', avatar: 'SI', color: '#F97316' },
];

const Avatar = ({ initials, color, size = 30 }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', background: `${color}22`, border: `1.5px solid ${color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.35, fontWeight: 800, color, flexShrink: 0 }}>
    {initials}
  </div>
);

const Sparkline = ({ color }) => (
  <svg width="100%" height="22" viewBox="0 0 100 22" fill="none">
    <path d="M0 16 Q 20 8, 40 12 T 80 4 T 100 2" stroke={color} strokeWidth="2" fill="none" />
  </svg>
);

export default function LeavesTab() {
  const [activeReqTab, setActiveReqTab] = useState('Pending');
  const [search, setSearch] = useState('');
  const [requestsList, setRequestsList] = useState(MOCK_LEAVE_REQUESTS);

  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [showLeaveReqModal, setShowLeaveReqModal] = useState(false);
  const [showPoliciesModal, setShowPoliciesModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  const filteredRequests = useMemo(() => {
    return requestsList.filter(r => {
      if (activeReqTab === 'Pending' && r.status !== 'Pending') return false;
      if (activeReqTab === 'Approved' && r.status !== 'Approved') return false;
      if (activeReqTab === 'Rejected' && r.status !== 'Rejected') return false;
      if (activeReqTab === 'Cancelled' && r.status !== 'Cancelled') return false;
      if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.leaveType.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [requestsList, activeReqTab, search]);

  const handleApprove = (id) => {
    setRequestsList(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    alert('✅ Leave request approved!');
  };

  const handleReject = (id) => {
    setRequestsList(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
    alert('❌ Leave request rejected.');
  };

  const statusBadge = (st) => {
    const map = {
      Pending: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
      Approved: { bg: 'rgba(16,185,129,0.12)', color: '#10B981', border: 'rgba(16,185,129,0.3)' },
      Rejected: { bg: 'rgba(239,68,68,0.12)', color: '#EF4444', border: 'rgba(239,68,68,0.3)' },
      Cancelled: { bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6', border: 'rgba(139,92,246,0.3)' },
    };
    const s = map[st] || map.Pending;
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
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFF' }}>HR & Leaves</div>
          <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>Manage employees, leaves, and HR operations efficiently</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 260 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
            <input placeholder="Search employee, leave, department..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 10px 8px 32px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#FFF', fontSize: '0.76rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button onClick={() => setShowAddEmpModal(true)}
            style={{ padding: '9px 16px', borderRadius: '8px', background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, border: 'none', color: '#070D18', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: `0 4px 14px ${GOLD}30` }}>
            <Plus size={15} /> Add Employee
          </button>
          <button onClick={() => setShowLeaveReqModal(true)}
            style={{ padding: '9px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileText size={14} /> Leave Request
          </button>
          <button onClick={() => setShowPoliciesModal(true)}
            style={{ padding: '9px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} /> HR Policies
          </button>
        </div>
      </div>

      {/* ── 6 KPI SPARKLINE CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
        {[
          { label: 'Total Employees', val: '32', sub: '↑ 6.67% vs last month', color: '#3B82F6', icon: Users },
          { label: 'Active Employees', val: '28', sub: '↑ 7.69% vs last month', color: '#10B981', icon: UserCheck },
          { label: 'On Probation', val: '2', sub: '— 0% vs last month', color: 'rgba(255,255,255,0.5)', icon: Briefcase },
          { label: 'Resigned', val: '2', sub: '↓ -33.33% vs last month', color: '#EF4444', icon: UserX },
          { label: 'Departments', val: '6', sub: '— 0% vs last month', color: '#8B5CF6', icon: Building },
          { label: "Today's Birthdays", val: '1', sub: 'View All', color: GOLD, icon: Gift },
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
                <div style={{ fontSize: '0.65rem', color: kpi.sub.includes('↑') ? '#10B981' : kpi.sub.includes('↓') ? '#EF4444' : 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{kpi.sub}</div>
              </div>
              <div style={{ marginTop: '8px' }}>
                <Sparkline color={kpi.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MIDDLE ROW 1 (LEAVE OVERVIEW DONUT, CALENDAR, LEAVE BALANCES) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr 1fr', gap: '16px', alignItems: 'stretch' }}>

        {/* Leave Overview (This Month) Donut Chart */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF', marginBottom: '14px' }}>Leave Overview (This Month)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: 90, height: 90, borderRadius: '50%', background: `conic-gradient(#10B981 0% 57.14%, #F59E0B 57.14% 76.19%, #EF4444 76.19% 85.71%, #8B5CF6 85.71% 90.47%, rgba(255,255,255,0.3) 90.47% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 62, height: 62, borderRadius: '50%', background: '#070F1E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: GOLD }}>42</div>
                  <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)' }}>Total Leaves</div>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {[
                  { label: 'Approved', val: '24 (57.14%)', color: '#10B981' },
                  { label: 'Pending', val: '8 (19.05%)', color: '#F59E0B' },
                  { label: 'Rejected', val: '4 (9.52%)', color: '#EF4444' },
                  { label: 'Cancelled', val: '2 (4.76%)', color: '#8B5CF6' },
                  { label: 'Expired', val: '4 (9.52%)', color: 'rgba(255,255,255,0.4)' },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.color }} />
                      <span style={{ color: 'rgba(255,255,255,0.55)' }}>{s.label}</span>
                    </div>
                    <span style={{ color: s.color, fontWeight: 700 }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '0.74rem', color: GOLD, fontWeight: 700, cursor: 'pointer' }}>View Leave Report →</span>
          </div>
        </div>

        {/* Leave Calendar Widget */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>Leave Calendar</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><ChevronLeft size={14} /></button>
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: GOLD }}>July 2026</span>
              <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><ChevronRight size={14} /></button>
              <button style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: '0.66rem', marginLeft: 4 }}>Today</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <div key={i} style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', fontWeight: 800, padding: '3px 0' }}>{d}</div>
            ))}
            <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.15)', padding: '5px' }}>29</div>
            <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.15)', padding: '5px' }}>30</div>

            {Array.from({ length: 31 }, (_, i) => {
              const day = i + 1;
              const isWeekend = (day + 2) % 7 === 0;
              const isApproved = [8, 15, 22, 29].includes(day);
              const isPending = [4, 9, 28].includes(day);
              const isRejected = [5].includes(day);
              const isCancelled = [23].includes(day);

              let bg = 'rgba(255,255,255,0.02)';
              let color = 'rgba(255,255,255,0.4)';
              if (isWeekend) { color = 'rgba(255,255,255,0.2)'; }
              else if (isApproved) { bg = '#10B98120'; color = '#10B981'; }
              else if (isPending) { bg = '#F59E0B20'; color = '#F59E0B'; }
              else if (isRejected) { bg = '#EF444420'; color = '#EF4444'; }
              else if (isCancelled) { bg = '#8B5CF620'; color = '#8B5CF6'; }

              return (
                <div key={day} style={{ padding: '5px 2px', borderRadius: '4px', background: bg, color, fontSize: '0.66rem', fontWeight: 700, textAlign: 'center' }}>
                  {day}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.62rem' }}>
            <span style={{ color: '#10B981' }}>● Approved</span>
            <span style={{ color: '#F59E0B' }}>● Pending</span>
            <span style={{ color: '#EF4444' }}>● Rejected</span>
            <span style={{ color: '#8B5CF6' }}>● Cancelled</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>● Weekend</span>
          </div>
        </div>

        {/* Leave Balance (As on Today) Table */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>Leave Balance (As on Today)</div>
              <span style={{ fontSize: '0.68rem', color: GOLD, fontWeight: 700, cursor: 'pointer' }}>View All</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', padding: '4px 0', fontSize: '0.6rem', fontWeight: 800, color: 'rgba(255,255,255,0.35)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span>LEAVE TYPE</span>
                <span style={{ textAlign: 'center' }}>ALLOCATED</span>
                <span style={{ textAlign: 'center' }}>USED</span>
                <span style={{ textAlign: 'center' }}>BALANCE</span>
              </div>
              {MOCK_LEAVE_BALANCES.map((lb, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', padding: '5px 0', fontSize: '0.72rem', borderBottom: '1px solid rgba(255,255,255,0.03)', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{lb.type}</span>
                  <span style={{ textAlign: 'center', color: '#FFF' }}>{lb.allocated}</span>
                  <span style={{ textAlign: 'center', color: '#F59E0B' }}>{lb.used}</span>
                  <span style={{ textAlign: 'center', color: '#10B981', fontWeight: 800 }}>{lb.balance}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '0.74rem', color: GOLD, fontWeight: 700, cursor: 'pointer' }}>View Leave Balance →</span>
          </div>
        </div>

      </div>

      {/* ── MIDDLE ROW 2 (LEAVE REQUESTS TABLE & EMPLOYEE DISTRIBUTION) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', alignItems: 'start' }}>

        {/* Leave Requests Table */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
          
          {/* Sub-Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 16px', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex' }}>
              {['All', 'Pending (8)', 'Approved (24)', 'Rejected (4)', 'Cancelled (2)'].map(tab => {
                const cleanKey = tab.split(' ')[0];
                return (
                  <button key={tab} onClick={() => setActiveReqTab(cleanKey)}
                    style={{ padding: '12px 14px', background: 'none', border: 'none', borderBottom: activeReqTab === cleanKey ? `2px solid ${GOLD}` : '2px solid transparent', color: activeReqTab === cleanKey ? GOLD : 'rgba(255,255,255,0.45)', fontSize: '0.78rem', fontWeight: activeReqTab === cleanKey ? 700 : 400, cursor: 'pointer', marginBottom: '-1px' }}>
                    {tab}
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Filter size={12} /> Filters
              </button>
              <button style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Download size={12} /> Export
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.015)' }}>
                  {['EMPLOYEE', 'LEAVE TYPE', 'FROM DATE', 'TO DATE', 'DAYS', 'REASON', 'STATUS', 'APPLIED ON', 'ACTIONS'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.62rem', fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Avatar initials={r.avatar} color={r.color} size={28} />
                        <div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFF', whiteSpace: 'nowrap' }}>{r.name}</div>
                          <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)' }}>{r.role}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.74rem', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>{r.leaveType}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.74rem', color: '#FFF', fontWeight: 600, whiteSpace: 'nowrap' }}>{r.fromDate}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.74rem', color: '#FFF', fontWeight: 600, whiteSpace: 'nowrap' }}>{r.toDate}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.78rem', fontWeight: 800, color: GOLD, whiteSpace: 'nowrap' }}>{r.days}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>{r.reason}</td>
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>{statusBadge(r.status)}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>{r.appliedOn}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => handleApprove(r.id)} style={{ width: 24, height: 24, borderRadius: '4px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Approve"><Check size={12} /></button>
                        <button onClick={() => handleReject(r.id)} style={{ width: 24, height: 24, borderRadius: '4px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Reject"><X size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '12px 16px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Showing 1 to {filteredRequests.length} of 8 requests</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2].map(p => (
                  <button key={p} style={{ width: 24, height: 24, borderRadius: '4px', background: p === 1 ? GOLD : 'rgba(255,255,255,0.04)', border: 'none', color: p === 1 ? '#000' : 'rgba(255,255,255,0.6)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Employee Distribution Donut Chart */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>Employee Distribution</div>
            <span style={{ fontSize: '0.68rem', color: GOLD, fontWeight: 700, cursor: 'pointer' }}>View Report ∨</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
            <div style={{ width: 90, height: 90, borderRadius: '50%', background: `conic-gradient(#3B82F6 0% 50%, #10B981 50% 68.75%, ${GOLD} 68.75% 81.25%, #8B5CF6 81.25% 90.63%, #EC4899 90.63% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 62, height: 62, borderRadius: '50%', background: '#070F1E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 900, color: GOLD }}>32</div>
                <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)' }}>Total</div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {[
                { label: 'Sales', pct: '16 (50%)', color: '#3B82F6' },
                { label: 'Marketing', pct: '6 (18.75%)', color: '#10B981' },
                { label: 'Operations', pct: '4 (12.5%)', color: GOLD },
                { label: 'HR', pct: '3 (9.38%)', color: '#8B5CF6' },
                { label: 'Admin', pct: '3 (9.38%)', color: '#EC4899' },
              ].map((d, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: d.color }} />
                    <span style={{ color: 'rgba(255,255,255,0.55)' }}>{d.label}</span>
                  </div>
                  <span style={{ color: '#FFF', fontWeight: 700 }}>{d.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW (ANNOUNCEMENTS, BIRTHDAYS, QUICK ACTIONS) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 280px', gap: '16px', alignItems: 'stretch' }}>

        {/* HR Announcements */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>HR Announcements</div>
              <button onClick={() => setShowAnnouncementModal(true)} style={{ padding: '5px 10px', borderRadius: '6px', background: `rgba(212,175,55,0.12)`, border: `1px solid ${GOLD}30`, color: GOLD, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Plus size={12} /> New Announcement
              </button>
            </div>

            <div style={{ padding: '14px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', display: 'flex', gap: '12px' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${GOLD}15`, border: `1px solid ${GOLD}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bell size={18} color={GOLD} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>Monthly Meeting</span>
                  <span style={{ padding: '2px 6px', borderRadius: '4px', background: `${GOLD}20`, color: GOLD, fontSize: '0.58rem', fontWeight: 800 }}>New</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px', lineHeight: 1.5 }}>
                  Monthly team meeting will be held on 31st July 2026 at 11:00 AM in the Hinjewadi Office.
                </div>
                <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.35)', marginTop: '6px' }}>24 Jul 2026 • By Manish Rai</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '0.74rem', color: GOLD, fontWeight: 700, cursor: 'pointer' }}>View All Announcements →</span>
          </div>
        </div>

        {/* Upcoming Birthdays */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>Upcoming Birthdays</div>
            <span style={{ fontSize: '0.68rem', color: GOLD, fontWeight: 700, cursor: 'pointer' }}>View All</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {UPCOMING_BIRTHDAYS.map((b, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'rgba(255,255,255,0.025)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Avatar initials={b.avatar} color={b.color} size={28} />
                  <div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#FFF' }}>{b.name}</div>
                    <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)' }}>{b.role}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: GOLD }}>{b.date}</div>
                  <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)' }}>{b.daysLeft}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions 8-Tile Grid */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '16px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>Quick Actions</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { label: 'Add Employee', icon: Plus, color: GOLD, action: () => setShowAddEmpModal(true) },
              { label: 'Leave Request', icon: FileText, color: '#10B981', action: () => setShowLeaveReqModal(true) },
              { label: 'Approve Leaves', icon: CheckCircle2, color: '#3B82F6', action: () => alert('Opening Leave Approvals Desk...') },
              { label: 'HR Policies', icon: ShieldCheck, color: '#8B5CF6', action: () => setShowPoliciesModal(true) },
              { label: 'Employee Directory', icon: Users, color: '#EC4899', action: () => alert('Opening Employee Directory...') },
              { label: 'Attendance Report', icon: Award, color: '#F59E0B', action: () => alert('Generating Attendance PDF Report...') },
              { label: 'Leave Calendar', icon: Calendar, color: '#EF4444', action: () => alert('Opening Full Leave Calendar...') },
              { label: 'HR Report', icon: FileText, color: '#14B8A6', action: () => alert('Generating HR Master Report...') },
            ].map((act, i) => {
              const IconC = act.icon;
              return (
                <button key={i} onClick={act.action}
                  style={{ padding: '8px 6px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)', fontSize: '0.66rem', fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center' }}>
                  <IconC size={14} color={act.color} />
                  <span>{act.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── ADD EMPLOYEE MODAL ── */}
      {showAddEmpModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#070F1E', border: `1px solid ${GOLD}30`, borderRadius: '16px', width: '100%', maxWidth: '540px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#FFF' }}>⚜️ Onboard New Employee</div>
              <button onClick={() => setShowAddEmpModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>FULL NAME *</label>
                <input placeholder="e.g. Rahul Sharma" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>EMAIL *</label>
                <input placeholder="rahul@24krealtors.com" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>DEPARTMENT</label>
                <select style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none' }}>
                  <option>Sales</option>
                  <option>Marketing</option>
                  <option>Operations</option>
                  <option>HR</option>
                  <option>Admin</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>DESIGNATION</label>
                <input placeholder="Sales Consultant" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowAddEmpModal(false)} style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { setShowAddEmpModal(false); alert('Employee Onboarded!'); }} style={{ padding: '8px 20px', borderRadius: '8px', background: GOLD, border: 'none', color: '#000', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>Save Employee</button>
            </div>
          </div>
        </div>
      )}

      {/* ── LEAVE REQUEST MODAL ── */}
      {showLeaveReqModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#070F1E', border: `1px solid ${GOLD}30`, borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#FFF' }}>📑 Submit Leave Application</div>
              <button onClick={() => setShowLeaveReqModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>LEAVE TYPE</label>
                <select style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none' }}>
                  <option>Casual Leave (CL)</option>
                  <option>Earned Leave (EL)</option>
                  <option>Sick Leave (SL)</option>
                  <option>Privilege Leave (PL)</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>FROM DATE</label>
                  <input type="date" defaultValue="2026-07-28" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>TO DATE</label>
                  <input type="date" defaultValue="2026-07-29" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>REASON</label>
                <textarea rows={3} placeholder="Provide clear reason for leave..." style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowLeaveReqModal(false)} style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { setShowLeaveReqModal(false); alert('Leave Request Submitted!'); }} style={{ padding: '8px 20px', borderRadius: '8px', background: GOLD, border: 'none', color: '#000', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* ── HR POLICIES MODAL ── */}
      {showPoliciesModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#070F1E', border: `1px solid ${GOLD}30`, borderRadius: '16px', width: '100%', maxWidth: '580px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#FFF' }}>📜 24K Realtors HR Policy Handbook</div>
              <button onClick={() => setShowPoliciesModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '360px', overflowY: 'auto' }}>
              {[
                { title: '1. Working Hours & Shift Timings', desc: 'Standard office hours are 09:30 AM to 06:30 PM (Mon-Sat). Grace period for late check-in is 15 minutes.' },
                { title: '2. Casual & Sick Leave Entitlement', desc: 'Every full-time employee gets 12 Casual Leaves and 12 Sick Leaves annually. Minimum 24-hour advance notice required for CL.' },
                { title: '3. Probation & Confirmation Policy', desc: 'New joiners undergo a 3-month probation period. Performance is reviewed prior to permanent confirmation.' },
                { title: '4. Code of Conduct & Confidentiality', desc: 'Strict non-disclosure of client leads, developer commission terms, and internal CRM pricing datasets.' },
              ].map((p, i) => (
                <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: GOLD }}>{p.title}</div>
                  <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px', lineHeight: 1.5 }}>{p.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => setShowPoliciesModal(false)} style={{ padding: '8px 20px', borderRadius: '8px', background: GOLD, border: 'none', color: '#000', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>Close Handbook</button>
            </div>
          </div>
        </div>
      )}

      {/* ── NEW ANNOUNCEMENT MODAL ── */}
      {showAnnouncementModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#070F1E', border: `1px solid ${GOLD}30`, borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#FFF' }}>📢 Create HR Announcement</div>
              <button onClick={() => setShowAnnouncementModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>ANNOUNCEMENT TITLE *</label>
                <input placeholder="e.g. Monthly All-Hands Meeting" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>ANNOUNCEMENT BODY *</label>
                <textarea rows={4} placeholder="Write announcement text..." style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowAnnouncementModal(false)} style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { setShowAnnouncementModal(false); alert('Announcement Broadcasted to All Employees!'); }} style={{ padding: '8px 20px', borderRadius: '8px', background: GOLD, border: 'none', color: '#000', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>Broadcast</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
