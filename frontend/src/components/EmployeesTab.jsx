// ═══════════════════════════════════════════════════════════════════════════
// 24K REALTORS — Team & RMs Module (Full Enterprise Suite)
// Features:
//   - All Members / Reporting Managers / Team Leads tabs
//   - Live KPI cards: Total Members, RMs, Active, New Joiners, Performance, Total Leads
//   - Searchable, filterable employee table with performance bars
//   - Performance Overview donut chart + Top Performers list
//   - Individual Employee Profile Drawer with 6 sub-tabs:
//       Overview, Performance, Leads, Deals, Site Visits, Follow-ups, Activity
//   - Add Member modal (full form)
//   - Import / Export / Org Chart buttons
// ═══════════════════════════════════════════════════════════════════════════
import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus, Search, Filter, RefreshCw, Download, Upload, Users,
  ChevronRight, Phone, Mail, Calendar, TrendingUp, Target,
  Award, Star, Eye, Edit2, Trash2, X, ArrowLeft, BarChart3,
  DollarSign, Briefcase, MapPin, Clock, CheckCircle2, AlertCircle,
  MessageSquare, Activity, Building, User, FileText, Zap,
  ChevronDown, MoreVertical, Share2, Printer, Home
} from 'lucide-react';

const GOLD = '#D4AF37';
const G = { color: GOLD };

// ──────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ──────────────────────────────────────────────────────────────────────────
const MOCK_EMPLOYEES = [
  { id: 1, empId: '24K-EMP-001', fullName: 'Manish Rai', email: 'manish.rai@24krealtors.com', phone: '+91 98765 43210', designation: 'Sales Consultant', department: 'Sales', role: 'SALES_MANAGER', reportingManager: 'Nilesh Patil', joiningDate: '15 Jan 2024', status: 'Active', performance: 92, leads: 145, deals: 18, revenue: '₹1.25 Cr', siteVisits: 28, followUps: 62, attendance: 96, salary: 85000, avatar: 'MR', color: '#F59E0B', isRM: false, location: 'Baner, Pune' },
  { id: 2, empId: '24K-EMP-002', fullName: 'Jyoti Dhale', email: 'jyoti.dhale@24krealtors.com', phone: '+91 91234 56780', designation: 'Senior Sales Consultant', department: 'Sales', role: 'RELATIONSHIP_MANAGER', reportingManager: 'Nilesh Patil', joiningDate: '10 Feb 2024', status: 'Active', performance: 88, leads: 132, deals: 16, revenue: '₹1.05 Cr', siteVisits: 24, followUps: 54, attendance: 94, salary: 72000, avatar: 'JD', color: '#EC4899', isRM: false, location: 'Wakad, Pune' },
  { id: 3, empId: '24K-EMP-003', fullName: 'Yash Murkute', email: 'yash.murkute@24krealtors.com', phone: '+91 99876 54321', designation: 'Sales Consultant', department: 'Sales', role: 'RELATIONSHIP_MANAGER', reportingManager: 'Priya Deshmukh', joiningDate: '18 Mar 2024', status: 'Active', performance: 76, leads: 98, deals: 11, revenue: '₹62.0 L', siteVisits: 18, followUps: 40, attendance: 88, salary: 55000, avatar: 'YM', color: '#3B82F6', isRM: false, location: 'Hinjewadi, Pune' },
  { id: 4, empId: '24K-EMP-004', fullName: 'Rohini K.', email: 'rohini.k@24krealtors.com', phone: '+91 87654 32109', designation: 'Sales Consultant', department: 'Sales', role: 'RELATIONSHIP_MANAGER', reportingManager: 'Priya Deshmukh', joiningDate: '05 Apr 2024', status: 'Active', performance: 74, leads: 87, deals: 9, revenue: '₹48.0 L', siteVisits: 15, followUps: 35, attendance: 91, salary: 52000, avatar: 'RK', color: '#8B5CF6', isRM: false, location: 'Kothrud, Pune' },
  { id: 5, empId: '24K-EMP-005', fullName: 'Amit Singh', email: 'amit.singh@24krealtors.com', phone: '+91 76543 21098', designation: 'Team Leader', department: 'Sales', role: 'TEAM_LEAD', reportingManager: 'Nilesh Patil', joiningDate: '20 Jan 2024', status: 'Active', performance: 85, leads: 110, deals: 14, revenue: '₹85.0 L', siteVisits: 20, followUps: 48, attendance: 93, salary: 65000, avatar: 'AS', color: '#10B981', isRM: false, location: 'Baner, Pune' },
  { id: 6, empId: '24K-EMP-006', fullName: 'Sneha Iyer', email: 'sneha.iyer@24krealtors.com', phone: '+91 65432 10987', designation: 'Sales Consultant', department: 'Sales', role: 'RELATIONSHIP_MANAGER', reportingManager: 'Priya Deshmukh', joiningDate: '22 May 2024', status: 'On Leave', performance: 60, leads: 32, deals: 3, revenue: '₹18.0 L', siteVisits: 7, followUps: 20, attendance: 72, salary: 45000, avatar: 'SI', color: '#F97316', isRM: false, location: 'Pimpri, Pune' },
  { id: 7, empId: '24K-RM-001', fullName: 'Nilesh Patil', email: 'nilesh.patil@24krealtors.com', phone: '+91 98765 43210', designation: 'Reporting Manager', department: 'Sales', role: 'REPORTING_MANAGER', reportingManager: 'Manish Rai (Admin)', joiningDate: '12 Dec 2023', status: 'Active', performance: 91, leads: 468, deals: 64, revenue: '₹3.82 Cr', siteVisits: 88, followUps: 150, attendance: 97, salary: 120000, avatar: 'NP', color: GOLD, isRM: true, location: 'Baner, Pune', teamSize: 12 },
  { id: 8, empId: '24K-RM-002', fullName: 'Priya Deshmukh', email: 'priya.deshmukh@24krealtors.com', phone: '+91 91234 00000', designation: 'Reporting Manager', department: 'Sales', role: 'REPORTING_MANAGER', reportingManager: 'Manish Rai (Admin)', joiningDate: '05 Jan 2024', status: 'Active', performance: 84, leads: 310, deals: 42, revenue: '₹2.41 Cr', siteVisits: 60, followUps: 110, attendance: 95, salary: 110000, avatar: 'PD', color: '#EC4899', isRM: true, location: 'Wakad, Pune', teamSize: 9 },
];

const MONTHLY_PERF = [
  { month: 'Jan', leads: 320, deals: 38, revenue: 2.1 },
  { month: 'Feb', leads: 290, deals: 32, revenue: 1.9 },
  { month: 'Mar', leads: 410, deals: 48, revenue: 2.8 },
  { month: 'Apr', leads: 360, deals: 42, revenue: 2.5 },
  { month: 'May', leads: 440, deals: 55, revenue: 3.2 },
  { month: 'Jun', leads: 480, deals: 60, revenue: 3.6 },
  { month: 'Jul', leads: 520, deals: 64, revenue: 3.8 },
];

const ACTIVITY_LOG = [
  { time: '2 hrs ago', action: 'Closed deal — Prashant Mehta, Baner 2BHK', type: 'deal' },
  { time: '5 hrs ago', action: 'Site visit scheduled — Rohan Sharma, Wakad', type: 'visit' },
  { time: '1 day ago', action: 'Lead HOT marked — Sneha Kapoor', type: 'lead' },
  { time: '2 days ago', action: 'Follow-up completed — Arjun Nair, Hinjewadi', type: 'followup' },
  { time: '3 days ago', action: 'New lead added — Kiran Bose, Baner', type: 'lead' },
];

// ──────────────────────────────────────────────────────────────────────────
// UTILITY COMPONENTS
// ──────────────────────────────────────────────────────────────────────────
const Avatar = ({ initials, color, size = 36 }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', background: `${color}22`, border: `2px solid ${color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.32, fontWeight: 800, color, flexShrink: 0 }}>
    {initials}
  </div>
);

const StatCard = ({ icon, label, value, change, color }) => (
  <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px 18px', flex: 1, minWidth: 0 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
      <div style={{ width: 28, height: 28, borderRadius: '8px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {React.createElement(icon, { size: 14, color })}
      </div>
      <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, letterSpacing: '0.04em' }}>{label}</span>
    </div>
    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFF', lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: '0.7rem', color: '#10B981', marginTop: '4px' }}>{change}</div>
  </div>
);

const PerformanceBar = ({ value, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${value}%`, background: value >= 80 ? '#10B981' : value >= 60 ? GOLD : '#EF4444', borderRadius: 4, transition: 'width 0.4s' }} />
    </div>
    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFF', width: 30, textAlign: 'right' }}>{value}%</span>
  </div>
);

const MiniChart = ({ data, color }) => {
  const max = Math.max(...data.map(d => d.revenue));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: 60 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{ width: '100%', height: `${(d.revenue / max) * 52}px`, background: i === data.length - 1 ? color : `${color}50`, borderRadius: '3px 3px 0 0', transition: 'height 0.3s', minHeight: 4 }} />
          <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>{d.month}</span>
        </div>
      ))}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────────────────
// EMPLOYEE PROFILE DRAWER
// ──────────────────────────────────────────────────────────────────────────
function EmployeeProfileDrawer({ emp, onClose }) {
  const [profileTab, setProfileTab] = useState('overview');

  const PROFILE_TABS = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'leads', label: 'Leads', icon: Target },
    { id: 'deals', label: 'Deals', icon: DollarSign },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'salary', label: 'Salary & HR', icon: FileText },
    { id: 'activity', label: 'Activity', icon: Activity },
  ];

  const statusColor = emp.status === 'Active' ? '#10B981' : '#F59E0B';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ width: '820px', height: '100vh', background: '#070F1E', borderLeft: `1px solid ${GOLD}30`, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

        {/* ── PROFILE HEADER ── */}
        <div style={{ background: `linear-gradient(135deg, rgba(212,175,55,0.08) 0%, #070F1E 70%)`, borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Avatar initials={emp.avatar} color={emp.color} size={60} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FFF' }}>{emp.fullName}</span>
                  <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800, background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30` }}>{emp.status}</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)', marginTop: '3px' }}>{emp.designation}</div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', color: GOLD, display: 'flex', gap: '4px', alignItems: 'center' }}><Briefcase size={11} /> {emp.empId}</span>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'flex', gap: '4px', alignItems: 'center' }}><MapPin size={11} /> {emp.location}</span>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'flex', gap: '4px', alignItems: 'center' }}><Calendar size={11} /> Joined {emp.joiningDate}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', color: '#25D366', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare size={13} /> WhatsApp
              </button>
              <button style={{ padding: '8px 14px', borderRadius: '8px', background: `rgba(212,175,55,0.1)`, border: `1px solid ${GOLD}30`, color: GOLD, fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Edit2 size={13} /> Edit Profile
              </button>
              <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Contact Row */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href={`tel:${emp.phone}`} style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}><Phone size={13} color={GOLD} /> {emp.phone}</a>
            <a href={`mailto:${emp.email}`} style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}><Mail size={13} color={GOLD} /> {emp.email}</a>
            <span style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)' }}><User size={13} color={GOLD} /> RM: {emp.reportingManager}</span>
          </div>

          {/* Sub-Tabs */}
          <div style={{ display: 'flex', gap: '4px', marginTop: '20px', overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 0 }}>
            {PROFILE_TABS.map(t => {
              const IconC = t.icon;
              const isAct = profileTab === t.id;
              return (
                <button key={t.id} onClick={() => setProfileTab(t.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'none', border: 'none', borderBottom: isAct ? `2px solid ${GOLD}` : '2px solid transparent', color: isAct ? GOLD : 'rgba(255,255,255,0.4)', fontSize: '0.78rem', fontWeight: isAct ? 700 : 400, cursor: 'pointer', whiteSpace: 'nowrap', marginBottom: '-1px' }}
                >
                  <IconC size={13} /> {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── PROFILE TAB CONTENT ── */}
        <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>

          {/* OVERVIEW */}
          {profileTab === 'overview' && (
            <div>
              {/* KPI Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'Total Leads', value: emp.leads, color: '#F59E0B', icon: Target },
                  { label: 'Deals Closed', value: emp.deals, color: '#10B981', icon: DollarSign },
                  { label: 'Revenue', value: emp.revenue, color: GOLD, icon: TrendingUp },
                  { label: 'Avg. Performance', value: `${emp.performance}%`, color: '#3B82F6', icon: BarChart3 },
                ].map((k, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {React.createElement(k.icon, { size: 11, color: k.color })} {k.label}
                    </div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: k.color }}>{k.value}</div>
                  </div>
                ))}
              </div>

              {/* Revenue Chart + Site Visits */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>Monthly Revenue Trend</div>
                  <MiniChart data={MONTHLY_PERF} color={emp.color} />
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFF', marginBottom: '14px' }}>Activity Summary</div>
                  {[
                    { label: 'Site Visits Conducted', val: emp.siteVisits, color: '#3B82F6' },
                    { label: 'Follow-ups Done', val: emp.followUps, color: '#8B5CF6' },
                    { label: 'Attendance Rate', val: `${emp.attendance}%`, color: '#10B981' },
                    { label: 'Conversion Rate', val: `${((emp.deals / emp.leads) * 100).toFixed(1)}%`, color: GOLD },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ color: 'rgba(255,255,255,0.55)' }}>{item.label}</span>
                      <span style={{ color: item.color, fontWeight: 700 }}>{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Section */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>Employee Information</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { label: 'Employee ID', val: emp.empId },
                    { label: 'Department', val: emp.department },
                    { label: 'Designation', val: emp.designation },
                    { label: 'Role', val: emp.role.replace(/_/g, ' ') },
                    { label: 'Reporting To', val: emp.reportingManager },
                    { label: 'Location', val: emp.location },
                    { label: 'Date of Joining', val: emp.joiningDate },
                    { label: 'Status', val: emp.status },
                  ].map((f, i) => (
                    <div key={i} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700, marginBottom: '3px' }}>{f.label}</div>
                      <div style={{ fontSize: '0.8rem', color: '#FFF', fontWeight: 600 }}>{f.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PERFORMANCE */}
          {profileTab === 'performance' && (
            <div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '18px', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF', marginBottom: '16px' }}>📊 Monthly Performance Breakdown</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {MONTHLY_PERF.map((m, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{m.month} 2026</span>
                        <span style={{ fontSize: '0.74rem', color: GOLD, fontWeight: 700 }}>{m.leads} Leads · {m.deals} Deals · ₹{m.revenue} Cr</span>
                      </div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }}>
                        <div style={{ height: '100%', width: `${(m.leads / 520) * 100}%`, background: `linear-gradient(90deg, ${emp.color}, ${GOLD})`, borderRadius: 4 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>📈 KPIs vs Target</div>
                  {[
                    { label: 'Leads Target', actual: emp.leads, target: 160, color: '#F59E0B' },
                    { label: 'Deals Target', actual: emp.deals, target: 20, color: '#10B981' },
                    { label: 'Site Visits', actual: emp.siteVisits, target: 30, color: '#3B82F6' },
                  ].map((kpi, i) => (
                    <div key={i} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '4px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.55)' }}>{kpi.label}</span>
                        <span style={{ color: kpi.color, fontWeight: 700 }}>{kpi.actual} / {kpi.target}</span>
                      </div>
                      <PerformanceBar value={Math.min(100, Math.round((kpi.actual / kpi.target) * 100))} color={kpi.color} />
                    </div>
                  ))}
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>⭐ Ratings & Badges</div>
                  {[
                    { badge: '🥇 Top Performer', earned: emp.performance >= 90 },
                    { badge: '💰 Revenue Champion', earned: emp.deals >= 15 },
                    { badge: '🔥 Lead Magnet', earned: emp.leads >= 100 },
                    { badge: '📅 Perfect Attendance', earned: emp.attendance >= 95 },
                    { badge: '⚡ Deal Closer', earned: emp.deals >= 12 },
                  ].map((b, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.76rem' }}>
                      <span style={{ color: b.earned ? '#FFF' : 'rgba(255,255,255,0.3)' }}>{b.badge}</span>
                      {b.earned ? <CheckCircle2 size={14} color="#10B981" /> : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)' }} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LEADS */}
          {profileTab === 'leads' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '16px' }}>
                {[
                  { label: 'Total Leads', val: emp.leads, color: '#F59E0B' },
                  { label: 'Converted', val: emp.deals, color: '#10B981' },
                  { label: 'Conversion Rate', val: `${((emp.deals / emp.leads) * 100).toFixed(1)}%`, color: GOLD },
                ].map((k, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: '6px' }}>{k.label}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: k.color }}>{k.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.78rem', fontWeight: 800, color: '#FFF', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Recent Leads</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>Showing last 5</span>
                </div>
                {['Prashant Mehta (Baner 2BHK)', 'Rohan Sharma (Wakad 3BHK)', 'Sneha Kapoor (Hinjewadi 2BHK)', 'Arjun Nair (Kothrud Villa)', 'Kiran Bose (Baner 1BHK)'].map((name, i) => {
                  const statuses = ['HOT', 'QUALIFIED', 'CONTACTED', 'WON', 'WARM'];
                  const colors = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981', '#8B5CF6'];
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.78rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.8)' }}>{name}</span>
                      <span style={{ padding: '2px 8px', borderRadius: '8px', background: `${colors[i]}15`, color: colors[i], fontWeight: 700, fontSize: '0.66rem' }}>{statuses[i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* DEALS */}
          {profileTab === 'deals' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '16px' }}>
                {[
                  { label: 'Deals Closed', val: emp.deals, color: '#10B981' },
                  { label: 'Total Revenue', val: emp.revenue, color: GOLD },
                  { label: 'Avg. Deal Size', val: '₹62 L', color: '#3B82F6' },
                ].map((k, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: '6px' }}>{k.label}</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: k.color }}>{k.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.78rem', fontWeight: 800, color: '#FFF' }}>Recent Deals Closed</div>
                {[
                  { client: 'Prashant Mehta', property: 'Baner 2BHK — Nyati Equator', value: '₹82 L', date: '20 Jul 2026', stage: 'WON' },
                  { client: 'Sneha Kapoor', property: 'Wakad 3BHK — VTP One Earth', value: '₹1.15 Cr', date: '12 Jul 2026', stage: 'REGISTERED' },
                  { client: 'Ramesh Joshi', property: 'Hinjewadi Villa — Pride Platina', value: '₹1.85 Cr', date: '01 Jul 2026', stage: 'WON' },
                ].map((d, i) => (
                  <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFF' }}>{d.client}</div>
                      <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{d.property}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: GOLD }}>{d.value}</div>
                      <div style={{ fontSize: '0.66rem', color: '#10B981', marginTop: '2px' }}>{d.stage} · {d.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ATTENDANCE */}
          {profileTab === 'attendance' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '16px' }}>
                {[
                  { label: 'Present Days', val: `${Math.round(emp.attendance * 0.26)}`, color: '#10B981' },
                  { label: 'Leave Taken', val: '3', color: '#F59E0B' },
                  { label: 'Late Entries', val: '2', color: '#F97316' },
                  { label: 'Attendance %', val: `${emp.attendance}%`, color: GOLD },
                ].map((k, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: '6px' }}>{k.label}</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: k.color }}>{k.val}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>📅 July 2026 — Attendance Calendar</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px' }}>
                  {['M','T','W','T','F','S','S'].map((d,i) => <div key={i} style={{ textAlign: 'center', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700, padding: '4px 0' }}>{d}</div>)}
                  {Array.from({ length: 28 }, (_, i) => {
                    const day = i + 1;
                    const isPresent = day <= 25 && day % 7 !== 0;
                    const isLeave = [5, 12].includes(day);
                    const isLate = [8, 15].includes(day);
                    const isSunday = (day + 2) % 7 === 0;
                    const bg = isSunday ? 'rgba(255,255,255,0.03)' : isLeave ? '#F59E0B20' : isLate ? '#F9741620' : isPresent ? '#10B98120' : 'rgba(255,255,255,0.03)';
                    const color = isSunday ? 'rgba(255,255,255,0.2)' : isLeave ? '#F59E0B' : isLate ? '#F97316' : isPresent ? '#10B981' : 'rgba(255,255,255,0.2)';
                    return (
                      <div key={i} style={{ textAlign: 'center', fontSize: '0.66rem', fontWeight: 600, padding: '5px 2px', borderRadius: '4px', background: bg, color }}>
                        {day}
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                  {[{ color: '#10B981', label: 'Present' }, { color: '#F59E0B', label: 'Leave' }, { color: '#F97316', label: 'Late' }].map((l, i) => (
                    <div key={i} style={{ display: 'flex', gap: '5px', alignItems: 'center', fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)' }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} /> {l.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SALARY & HR */}
          {profileTab === 'salary' && (
            <div>
              <div style={{ background: `linear-gradient(135deg, rgba(212,175,55,0.08), rgba(10,18,36,0.95))`, border: `1px solid ${GOLD}30`, borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>💰 July 2026 — Salary Slip</div>
                  <button style={{ padding: '7px 14px', borderRadius: '8px', background: `rgba(212,175,55,0.1)`, border: `1px solid ${GOLD}30`, color: GOLD, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Download size={12} /> Download PDF
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: '10px' }}>EARNINGS</div>
                    {[
                      { label: 'Basic Salary', val: `₹${(emp.salary * 0.45).toLocaleString('en-IN')}` },
                      { label: 'HRA', val: `₹${(emp.salary * 0.25).toLocaleString('en-IN')}` },
                      { label: 'Special Allowance', val: `₹${(emp.salary * 0.20).toLocaleString('en-IN')}` },
                      { label: 'Sales Incentive', val: `₹${(emp.deals * 2000).toLocaleString('en-IN')}` },
                    ].map((r, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ color: 'rgba(255,255,255,0.55)' }}>{r.label}</span>
                        <span style={{ color: '#10B981', fontWeight: 700 }}>{r.val}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: '10px' }}>DEDUCTIONS</div>
                    {[
                      { label: 'PF (12%)', val: `₹${Math.round(emp.salary * 0.45 * 0.12).toLocaleString('en-IN')}` },
                      { label: 'ESIC (0.75%)', val: `₹${Math.round(emp.salary * 0.0075).toLocaleString('en-IN')}` },
                      { label: 'TDS', val: '₹0' },
                      { label: 'Professional Tax', val: '₹200' },
                    ].map((r, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ color: 'rgba(255,255,255,0.55)' }}>{r.label}</span>
                        <span style={{ color: '#EF4444', fontWeight: 700 }}>-{r.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginTop: '16px', padding: '12px 0', borderTop: `1px solid ${GOLD}30`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>NET PAY</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 900, color: GOLD }}>₹{Math.round(emp.salary + emp.deals * 2000 - emp.salary * 0.0975 - 200).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* HR Documents */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>📁 HR Documents</div>
                {['Offer Letter', 'Appointment Letter', 'NDA Agreement', 'PF Nomination Form', 'Bank Details'].map((doc, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.78rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)', display: 'flex', gap: '8px', alignItems: 'center' }}><FileText size={13} color={GOLD} /> {doc}</span>
                    <button style={{ background: 'none', border: 'none', color: GOLD, cursor: 'pointer', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Download size={12} /> Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVITY */}
          {profileTab === 'activity' && (
            <div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.78rem', fontWeight: 800, color: '#FFF' }}>📋 Recent Activity Log</div>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {ACTIVITY_LOG.map((log, i) => {
                    const colors = { deal: '#10B981', visit: '#3B82F6', lead: '#F59E0B', followup: '#8B5CF6' };
                    const icons = { deal: DollarSign, visit: MapPin, lead: Target, followup: Clock };
                    const IconC = icons[log.type];
                    return (
                      <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${colors[log.type]}15`, border: `1px solid ${colors[log.type]}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <IconC size={13} color={colors[log.type]} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.78rem', color: '#FFF' }}>{log.action}</div>
                          <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{log.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// MAIN EMPLOYEES TAB
// ──────────────────────────────────────────────────────────────────────────
export default function EmployeesTab() {
  const [viewTab, setViewTab] = useState('all');
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', designation: 'Sales Consultant',
    department: 'Sales', role: 'RELATIONSHIP_MANAGER', salary: 45000,
    reportingManager: 'Nilesh Patil', location: 'Baner, Pune',
    joiningDate: '', panNumber: '', aadharNumber: '', bankAccountNumber: '', bankName: ''
  });

  const filtered = useMemo(() => {
    let list = MOCK_EMPLOYEES;
    if (viewTab === 'rm') list = list.filter(e => e.isRM);
    if (viewTab === 'leads') list = list.filter(e => e.role === 'TEAM_LEAD');
    if (search) list = list.filter(e =>
      e.fullName.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.empId.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter !== 'ALL') list = list.filter(e => e.status === statusFilter);
    return list;
  }, [viewTab, search, statusFilter]);

  const totalLeads = MOCK_EMPLOYEES.reduce((s, e) => s + e.leads, 0);
  const avgPerf = Math.round(MOCK_EMPLOYEES.reduce((s, e) => s + e.performance, 0) / MOCK_EMPLOYEES.length);
  const topPerformers = [...MOCK_EMPLOYEES].sort((a, b) => b.performance - a.performance).slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

      {/* ── HEADER ROW ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFF' }}>Team & RMs</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Manage your team, reporting managers and performance</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setShowAddModal(true)} style={{ padding: '9px 16px', borderRadius: '8px', background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, border: 'none', color: '#070D18', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={15} /> Add Member
          </button>
          <button style={{ padding: '9px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Upload size={14} /> Import
          </button>
          <button style={{ padding: '9px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={14} /> Export
          </button>
          <button style={{ padding: '9px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Share2 size={14} /> Org Chart
          </button>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <StatCard icon={Users} label="TOTAL TEAM MEMBERS" value="32" change="↑ 14.3% vs last month" color="#3B82F6" />
        <StatCard icon={Award} label="REPORTING MANAGERS (RMs)" value="6" change="↑ 20.0% vs last month" color={GOLD} />
        <StatCard icon={CheckCircle2} label="ACTIVE MEMBERS" value="28" change="↑ 12.5% vs last month" color="#10B981" />
        <StatCard icon={Plus} label="NEW JOINERS (THIS MONTH)" value="3" change="↑ 50.0% vs last month" color="#8B5CF6" />
        <StatCard icon={TrendingUp} label="AVG. TEAM PERFORMANCE" value={`${avgPerf}%`} change="↑ 8.6% vs last month" color="#F59E0B" />
        <StatCard icon={Target} label="TOTAL LEADS (TEAM)" value={totalLeads.toLocaleString('en-IN')} change="↑ 15.2% vs last month" color="#EC4899" />
      </div>

      {/* ── MAIN 2-COL ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px', alignItems: 'start' }}>

        {/* LEFT — TABLE */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 16px' }}>
            {[{ id: 'all', label: 'All Members' }, { id: 'rm', label: 'Reporting Managers' }, { id: 'leads', label: 'Team Leads' }].map(t => (
              <button key={t.id} onClick={() => setViewTab(t.id)}
                style={{ padding: '13px 16px', background: 'none', border: 'none', borderBottom: viewTab === t.id ? `2px solid ${GOLD}` : '2px solid transparent', color: viewTab === t.id ? GOLD : 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: viewTab === t.id ? 700 : 400, cursor: 'pointer', marginBottom: '-1px' }}
              >{t.label}</button>
            ))}
          </div>

          {/* Filters */}
          <div style={{ padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
              <input
                style={{ width: '100%', padding: '8px 10px 8px 30px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }}
                placeholder="Search by name, email, phone..."
                value={search} onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select style={{ padding: '8px 12px', borderRadius: '8px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: '0.76rem', outline: 'none' }}
              value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="ALL">All Status</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['MEMBER', 'EMP ID', 'DESIGNATION', 'DEPT', 'REPORTING MANAGER', 'STATUS', 'PERFORMANCE', 'LEADS', 'DEALS', 'ACTIONS'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.64rem', fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp, i) => (
                  <tr key={emp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Avatar initials={emp.avatar} color={emp.color} size={34} />
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFF', whiteSpace: 'nowrap' }}>{emp.fullName}</div>
                          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.72rem', color: GOLD, fontFamily: 'monospace', fontWeight: 700, whiteSpace: 'nowrap' }}>{emp.empId}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.76rem', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>{emp.designation}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.74rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>{emp.department}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}>
                        {emp.reportingManager}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ padding: '3px 9px', borderRadius: '10px', fontSize: '0.66rem', fontWeight: 800, background: emp.status === 'Active' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)', color: emp.status === 'Active' ? '#10B981' : '#F59E0B', border: `1px solid ${emp.status === 'Active' ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}` }}>{emp.status}</span>
                    </td>
                    <td style={{ padding: '12px 14px', minWidth: '110px' }}>
                      <PerformanceBar value={emp.performance} />
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#F59E0B', fontWeight: 700 }}>{emp.leads}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.8rem', color: '#10B981', fontWeight: 700 }}>{emp.deals}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => setSelectedEmp(emp)}
                          style={{ width: 28, height: 28, borderRadius: '6px', background: `rgba(212,175,55,0.1)`, border: `1px solid ${GOLD}25`, color: GOLD, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="View Profile"
                        ><Eye size={13} /></button>
                        <button style={{ width: 28, height: 28, borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Edit"><Edit2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '12px 16px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              Showing 1 to {filtered.length} of {filtered.length} members
            </div>
          </div>
        </div>

        {/* RIGHT — SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Performance Overview */}
          <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '16px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF', marginBottom: '14px' }}>Team Performance Overview</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Excellent (80%+)', count: 14, color: '#10B981' },
                { label: 'Good (60–80%)', count: 10, color: GOLD },
                { label: 'Average (40–60%)', count: 5, color: '#F97316' },
                { label: 'Needs Improvement (<40%)', count: 3, color: '#EF4444' },
              ].map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
                    <span style={{ color: 'rgba(255,255,255,0.55)' }}>{p.label}</span>
                  </div>
                  <span style={{ color: p.color, fontWeight: 800 }}>{p.count}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '16px', textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: `1px solid ${GOLD}20` }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: GOLD }}>{avgPerf}%</div>
              <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.4)' }}>Avg. Team Performance</div>
            </div>
          </div>

          {/* Top Performers */}
          <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '16px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF', marginBottom: '14px' }}>🏆 Top Performers (This Month)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {topPerformers.map((emp, i) => (
                <div key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setSelectedEmp(emp)}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: i === 0 ? '#F59E0B20' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: i === 0 ? GOLD : 'rgba(255,255,255,0.4)', flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <Avatar initials={emp.avatar} color={emp.color} size={28} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#FFF' }}>{emp.fullName}</div>
                    <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)' }}>{emp.designation}</div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: emp.performance >= 90 ? '#10B981' : GOLD }}>{emp.performance}%</span>
                </div>
              ))}
            </div>
            <button style={{ width: '100%', marginTop: '12px', padding: '9px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', fontSize: '0.74rem', cursor: 'pointer' }}>
              View Full Report →
            </button>
          </div>
        </div>
      </div>

      {/* ── EMPLOYEE PROFILE DRAWER ── */}
      {selectedEmp && <EmployeeProfileDrawer emp={selectedEmp} onClose={() => setSelectedEmp(null)} />}

      {/* ── ADD MEMBER MODAL ── */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1050, background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#070F1E', border: `1px solid ${GOLD}30`, borderRadius: '16px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#FFF' }}>⚜️ Add New Team Member</div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {[
                  { label: 'Full Name *', key: 'fullName', type: 'text' },
                  { label: 'Email Address *', key: 'email', type: 'email' },
                  { label: 'Phone Number *', key: 'phone', type: 'text' },
                  { label: 'Date of Joining *', key: 'joiningDate', type: 'date' },
                  { label: 'Designation *', key: 'designation', type: 'text' },
                  { label: 'Location', key: 'location', type: 'text' },
                  { label: 'Base Salary (₹ Monthly)', key: 'salary', type: 'number' },
                  { label: 'PAN Card Number', key: 'panNumber', type: 'text' },
                  { label: 'Aadhar Number', key: 'aadharNumber', type: 'text' },
                  { label: 'Bank Account No.', key: 'bankAccountNumber', type: 'text' },
                ].map((f, i) => (
                  <div key={i}>
                    <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '5px' }}>{f.label}</label>
                    <input type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '5px' }}>Role *</label>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.8rem', outline: 'none' }}>
                    <option value="RELATIONSHIP_MANAGER">Relationship Manager</option>
                    <option value="TEAM_LEAD">Team Leader</option>
                    <option value="REPORTING_MANAGER">Reporting Manager</option>
                    <option value="SALES_MANAGER">Sales Manager</option>
                    <option value="TELECALLER">Telecaller</option>
                    <option value="HR">HR Manager</option>
                    <option value="ACCOUNTS">Finance / Accounts</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '5px' }}>Reporting Manager</label>
                  <select value={form.reportingManager} onChange={e => setForm({ ...form, reportingManager: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.8rem', outline: 'none' }}>
                    <option>Nilesh Patil</option>
                    <option>Priya Deshmukh</option>
                    <option>Manish Rai (Admin)</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button onClick={() => setShowAddModal(false)} style={{ padding: '9px 20px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', cursor: 'pointer' }}>Cancel</button>
                <button onClick={() => { setShowAddModal(false); alert('✅ Team member added successfully! (Backend integration pending)'); }}
                  style={{ padding: '9px 24px', borderRadius: '8px', background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, border: 'none', color: '#070D18', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={14} /> Add Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
