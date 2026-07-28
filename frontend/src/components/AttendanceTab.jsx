// ═══════════════════════════════════════════════════════════════════════════
// 24K REALTORS — Attendance & Shift Management Suite
// Features:
//   - 6 KPI Sparkline Cards (Total Employees 32, Present 24, Absent 4, On Leave 3, Late 5, Total Hours 2,048h 30m)
//   - July 2026 Interactive Attendance Calendar
//   - Today's Summary Widget (Check-in/Check-out status, live timers)
//   - Attendance Overview Donut Chart (32 Employees)
//   - Average Working Hours Indicator (8h 15m)
//   - Attendance Trend Multi-line Chart
//   - Employee Attendance Data Table with search, department & status filters
//   - Quick Actions Grid (Mark Attendance, Apply Leave, Leave Requests, Attendance Report)
//   - Action Modals for Mark Attendance, Add Record & Apply Leave
// ═══════════════════════════════════════════════════════════════════════════
import React, { useState, useMemo } from 'react';
import {
  Clock, Calendar, UserCheck, UserX, AlertCircle, CheckCircle2,
  Search, Filter, Plus, Download, Upload, Eye, Edit2, MoreVertical,
  ChevronLeft, ChevronRight, X, Play, Pause, Square, MapPin,
  TrendingUp, Users, ShieldAlert, FileText, CheckSquare, Sparkles
} from 'lucide-react';

const GOLD = '#D4AF37';

const MOCK_ATTENDANCE_TABLE = [
  { id: '24K-EMP-001', name: 'Manish Rai', role: 'Sales Consultant', avatar: 'MR', color: '#F59E0B', dept: 'Sales', checkIn: '09:15 AM', checkOut: '06:45 PM', hours: '9h 30m', status: 'Present', location: 'Hinjewadi Office' },
  { id: '24K-EMP-002', name: 'Jyoti Dhale', role: 'Senior Sales Consultant', avatar: 'JD', color: '#EC4899', dept: 'Sales', checkIn: '09:22 AM', checkOut: '06:35 PM', hours: '9h 13m', status: 'Present', location: 'Hinjewadi Office' },
  { id: '24K-EMP-003', name: 'Yash Murkute', role: 'Sales Consultant', avatar: 'YM', color: '#3B82F6', dept: 'Sales', checkIn: '09:05 AM', checkOut: '06:20 PM', hours: '9h 15m', status: 'Present', location: 'Hinjewadi Office' },
  { id: '24K-EMP-004', name: 'Rohini K.', role: 'Sales Consultant', avatar: 'RK', color: '#8B5CF6', dept: 'Sales', checkIn: '09:45 AM', checkOut: '06:50 PM', hours: '9h 05m', status: 'Late', location: 'Hinjewadi Office' },
  { id: '24K-EMP-005', name: 'Amit Singh', role: 'Team Leader', avatar: 'AS', color: '#10B981', dept: 'Sales', checkIn: '09:10 AM', checkOut: '06:40 PM', hours: '9h 30m', status: 'Present', location: 'Hinjewadi Office' },
  { id: '24K-EMP-006', name: 'Sneha Iyer', role: 'Sales Consultant', avatar: 'SI', color: '#F97316', dept: 'Sales', checkIn: '-', checkOut: '-', hours: '-', status: 'Absent', location: '-' },
  { id: '24K-EMP-007', name: 'Nilesh Patil', role: 'Sales Manager', avatar: 'NP', color: GOLD, dept: 'Sales', checkIn: '-', checkOut: '-', hours: '-', status: 'On Leave', location: '-' },
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

export default function AttendanceTab() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(true);

  const filteredEmployees = useMemo(() => {
    return MOCK_ATTENDANCE_TABLE.filter(emp => {
      if (deptFilter !== 'ALL' && emp.dept !== deptFilter) return false;
      if (statusFilter !== 'ALL' && emp.status !== statusFilter) return false;
      if (search && !emp.name.toLowerCase().includes(search.toLowerCase()) && !emp.id.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [deptFilter, statusFilter, search]);

  const statusBadge = (st) => {
    const map = {
      Present: { bg: 'rgba(16,185,129,0.12)', color: '#10B981', border: 'rgba(16,185,129,0.3)' },
      Late: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
      Absent: { bg: 'rgba(239,68,68,0.12)', color: '#EF4444', border: 'rgba(239,68,68,0.3)' },
      'On Leave': { bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6', border: 'rgba(139,92,246,0.3)' },
    };
    const s = map[st] || map.Present;
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
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFF' }}>Attendance</div>
          <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>Track attendance, working hours and team presence</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.76rem', color: 'rgba(255,255,255,0.6)' }}>
            <Calendar size={13} color={GOLD} />
            <span>01 Jul 2026 - 31 Jul 2026</span>
          </div>
          <button style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', cursor: 'pointer' }}>
            Today
          </button>
          <button onClick={() => setShowAddRecordModal(true)}
            style={{ padding: '9px 18px', borderRadius: '8px', background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, border: 'none', color: '#070D18', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: `0 4px 14px ${GOLD}30` }}>
            <Plus size={15} /> Add Record
          </button>
        </div>
      </div>

      {/* ── 6 KPI SPARKLINE CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
        {[
          { label: 'Total Employees', val: '32', sub: '↑ 3 vs last month', color: '#3B82F6', icon: Users },
          { label: 'Present', val: '24', sub: '75.00%', color: '#10B981', icon: UserCheck },
          { label: 'Absent', val: '4', sub: '12.50%', color: '#EF4444', icon: UserX },
          { label: 'On Leave', val: '3', sub: '9.38%', color: '#F59E0B', icon: Clock },
          { label: 'Late', val: '5', sub: '15.63%', color: '#8B5CF6', icon: AlertCircle },
          { label: 'Total Working Hours', val: '2,048h 30m', sub: '↑ 8.45% vs last month', color: GOLD, icon: Clock },
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
                <div style={{ fontSize: '0.65rem', color: kpi.color, fontWeight: 700 }}>{kpi.sub}</div>
              </div>
              <div style={{ marginTop: '8px' }}>
                <Sparkline color={kpi.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MIDDLE SECTION (CALENDAR, TODAY SUMMARY, RIGHT SIDEBAR) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 340px', gap: '16px', alignItems: 'stretch' }}>

        {/* Attendance Calendar Widget */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>Attendance Calendar</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><ChevronLeft size={16} /></button>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: GOLD }}>July 2026</span>
              <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><ChevronRight size={16} /></button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
              <div key={i} style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)', fontWeight: 800, padding: '4px 0' }}>{d}</div>
            ))}
            {/* Prev month days */}
            <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.15)', padding: '6px' }}>29</div>
            <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.15)', padding: '6px' }}>30</div>

            {/* July 1 to 31 */}
            {Array.from({ length: 31 }, (_, i) => {
              const day = i + 1;
              const isSun = (day + 2) % 7 === 0;
              const isLeave = [16].includes(day);
              const isLate = [4, 9, 18, 28].includes(day);
              const isAbsent = [24].includes(day);

              let bg = '#10B98120';
              let color = '#10B981';
              let dot = 'P';

              if (isSun) { bg = 'rgba(255,255,255,0.03)'; color = 'rgba(255,255,255,0.3)'; dot = 'OFF'; }
              else if (isAbsent) { bg = '#EF444420'; color = '#EF4444'; dot = 'A'; }
              else if (isLeave) { bg = '#8B5CF620'; color = '#8B5CF6'; dot = 'L'; }
              else if (isLate) { bg = '#F59E0B20'; color = '#F59E0B'; dot = 'Late'; }

              return (
                <div key={day} style={{ padding: '6px 2px', borderRadius: '6px', background: bg, color, fontSize: '0.68rem', fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <span>{day}</span>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: color }} />
                </div>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.66rem' }}>
            <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} /> Present</span>
            <span style={{ color: '#EF4444', display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444' }} /> Absent</span>
            <span style={{ color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8B5CF6' }} /> Leave</span>
            <span style={{ color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B' }} /> Late</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} /> Weekly Off</span>
          </div>
        </div>

        {/* Today's Summary Widget */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>Today's Summary</div>
            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px', marginBottom: '14px' }}>Friday, 25 July 2026</div>

            {/* Donut Widget */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: `conic-gradient(#10B981 0% 75%, #EF4444 75% 87.5%, #8B5CF6 87.5% 96.88%, #F59E0B 96.88% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#070F1E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '1rem', fontWeight: 900, color: '#10B981' }}>24</div>
                  <div style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.4)' }}>Present</div>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { label: 'Present', val: '24 (75%)', color: '#10B981' },
                  { label: 'Absent', val: '4 (12.5%)', color: '#EF4444' },
                  { label: 'On Leave', val: '3 (9.38%)', color: '#8B5CF6' },
                  { label: 'Late', val: '5 (15.63%)', color: '#F59E0B' },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.color }} />
                      <span style={{ color: 'rgba(255,255,255,0.55)' }}>{s.label}</span>
                    </div>
                    <span style={{ color: '#FFF', fontWeight: 700 }}>{s.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Check In / Check Out Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ padding: '10px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.6rem', color: '#10B981', fontWeight: 800 }}>Check In</div>
                <div style={{ fontSize: '0.96rem', fontWeight: 900, color: '#FFF', marginTop: '2px' }}>09:15 AM</div>
                <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)' }}>Today</div>
              </div>
              <div style={{ padding: '10px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.6rem', color: '#F59E0B', fontWeight: 800 }}>Check Out</div>
                <div style={{ fontSize: '0.96rem', fontWeight: 900, color: '#FFF', marginTop: '2px' }}>06:45 PM</div>
                <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)' }}>Today</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700 }}>● You have checked in</span>
            <span onClick={() => setShowMarkModal(true)} style={{ fontSize: '0.72rem', color: GOLD, fontWeight: 700, cursor: 'pointer' }}>View My Attendance →</span>
          </div>
        </div>

        {/* RIGHT SIDEBAR (OVERVIEW DONUT, AVG HOURS, TREND) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Attendance Overview Donut */}
          <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF', marginBottom: '14px' }}>Attendance Overview (This Month)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: 84, height: 84, borderRadius: '50%', background: `conic-gradient(#10B981 0% 75%, #EF4444 75% 87.5%, #8B5CF6 87.5% 96.88%, #F59E0B 96.88% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#070F1E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 900, color: GOLD }}>32</div>
                  <div style={{ fontSize: '0.48rem', color: 'rgba(255,255,255,0.4)' }}>Employees</div>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { label: 'Present', val: '24 (75%)', color: '#10B981' },
                  { label: 'Absent', val: '4 (12.5%)', color: '#EF4444' },
                  { label: 'On Leave', val: '3 (9.38%)', color: '#8B5CF6' },
                  { label: 'Late', val: '5 (15.63%)', color: '#F59E0B' },
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

          {/* Average Working Hours Card */}
          <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>Average Working Hours</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFF', marginTop: '4px' }}>8h 15m</div>
            <div style={{ fontSize: '0.64rem', color: '#10B981', marginTop: '2px', marginBottom: '8px' }}>Per Employee · ↑ 8.45% vs last month</div>
            <Sparkline color={GOLD} />
          </div>

          {/* Attendance Trend Chart */}
          <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF' }}>Attendance Trend</div>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>This Month</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', fontSize: '0.62rem' }}>
              <span style={{ color: '#10B981', fontWeight: 700 }}>-- Present</span>
              <span style={{ color: '#EF4444', fontWeight: 700 }}>-- Absent</span>
              <span style={{ color: '#F59E0B', fontWeight: 700 }}>-- Late</span>
              <span style={{ color: '#8B5CF6', fontWeight: 700 }}>-- Leave</span>
            </div>
            <div style={{ height: 75, display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              {[
                { d: '1 Jul', p: 20, a: 3, l: 4, lv: 2 },
                { d: '8 Jul', p: 24, a: 4, l: 5, lv: 3 },
                { d: '15 Jul', p: 26, a: 3, l: 4, lv: 2 },
                { d: '22 Jul', p: 28, a: 4, l: 5, lv: 3 },
                { d: '31 Jul', p: 30, a: 3, l: 4, lv: 2 },
              ].map((point, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div style={{ width: '100%', height: `${(point.p / 30) * 55}px`, background: '#10B981', borderRadius: '2px 2px 0 0' }} />
                  <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)' }}>{point.d}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── BOTTOM SECTION (EMPLOYEE ATTENDANCE TABLE & QUICK ACTIONS) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '16px', alignItems: 'start' }}>

        {/* Employee Attendance Table */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
          
          <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFF' }}>Employee Attendance</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '7px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '0.76rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Download size={13} /> Export
              </button>
              <button style={{ padding: '7px 14px', borderRadius: '8px', background: `rgba(212,175,55,0.1)`, border: `1px solid ${GOLD}30`, color: GOLD, fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={13} /> Attendance Report
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div style={{ padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
              <input placeholder="Search employee..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '7px 10px 7px 30px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#FFF', fontSize: '0.76rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <select style={{ padding: '7px 12px', borderRadius: '8px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '0.76rem', outline: 'none' }}
              value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              <option value="ALL">All Departments</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Accounts">Accounts</option>
            </select>

            <select style={{ padding: '7px 12px', borderRadius: '8px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '0.76rem', outline: 'none' }}
              value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="ALL">All Status</option>
              <option value="Present">Present</option>
              <option value="Late">Late</option>
              <option value="Absent">Absent</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.015)' }}>
                  {['EMPLOYEE', 'EMPLOYEE ID', 'DEPARTMENT', 'CHECK IN', 'CHECK OUT', 'WORKING HOURS', 'STATUS', 'LOCATION', 'ACTIONS'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.62rem', fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Avatar initials={emp.avatar} color={emp.color} size={28} />
                        <div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#FFF', whiteSpace: 'nowrap' }}>{emp.name}</div>
                          <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)' }}>{emp.role}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.74rem', color: GOLD, fontFamily: 'monospace', fontWeight: 700, whiteSpace: 'nowrap' }}>{emp.id}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.74rem', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>{emp.dept}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.76rem', color: emp.checkIn !== '-' ? '#10B981' : 'rgba(255,255,255,0.3)', fontWeight: 700, whiteSpace: 'nowrap' }}>{emp.checkIn}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.76rem', color: emp.checkOut !== '-' ? '#F59E0B' : 'rgba(255,255,255,0.3)', fontWeight: 700, whiteSpace: 'nowrap' }}>{emp.checkOut}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.74rem', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>{emp.hours}</td>
                    <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>{statusBadge(emp.status)}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>{emp.location}</td>
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
              <span>Showing 1 to {filteredEmployees.length} of 32 employees</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map(p => (
                  <button key={p} style={{ width: 24, height: 24, borderRadius: '4px', background: p === 1 ? GOLD : 'rgba(255,255,255,0.04)', border: 'none', color: p === 1 ? '#000' : 'rgba(255,255,255,0.6)', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>Quick Actions</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              { label: 'Mark Attendance', icon: CheckCircle2, color: '#10B981', action: () => setShowMarkModal(true) },
              { label: 'Apply Leave', icon: Clock, color: '#8B5CF6', action: () => setShowLeaveModal(true) },
              { label: 'Leave Requests', icon: FileText, color: '#F59E0B', action: () => alert('Opening Pending Leave Requests...') },
              { label: 'Attendance Report', icon: Download, color: GOLD, action: () => alert('Generating Attendance PDF Report...') },
            ].map((act, i) => {
              const IconC = act.icon;
              return (
                <button key={i} onClick={act.action}
                  style={{ padding: '12px 10px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#FFF', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textAlign: 'center' }}>
                  <IconC size={18} color={act.color} />
                  <span>{act.label}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── MARK ATTENDANCE MODAL ── */}
      {showMarkModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#070F1E', border: `1px solid ${GOLD}30`, borderRadius: '16px', width: '100%', maxWidth: '480px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#FFF' }}>⏱️ Live Geofenced Attendance Punch</div>
              <button onClick={() => setShowMarkModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ padding: '14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={20} color="#10B981" />
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#10B981' }}>Authorized Location: Hinjewadi Office</div>
                <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.5)' }}>Geofence Radius Verified (0m from Office Desk)</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => { setIsCheckedIn(true); setShowMarkModal(false); alert('✅ Checked In at 09:15 AM!'); }}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', background: '#10B981', border: 'none', color: '#FFF', fontSize: '0.84rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Play size={16} /> Check In Now
              </button>
              <button onClick={() => { setIsCheckedIn(false); setShowMarkModal(false); alert('🔴 Checked Out at 06:45 PM!'); }}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'rgba(245,158,11,0.2)', border: '1px solid #F59E0B', color: '#F59E0B', fontSize: '0.84rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Square size={16} /> Check Out Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD RECORD MODAL ── */}
      {showAddRecordModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#070F1E', border: `1px solid ${GOLD}30`, borderRadius: '16px', width: '100%', maxWidth: '520px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#FFF' }}>➕ Add Manual Attendance Record</div>
              <button onClick={() => setShowAddRecordModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>EMPLOYEE</label>
                <select style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none' }}>
                  <option>Manish Rai</option>
                  <option>Jyoti Dhale</option>
                  <option>Yash Murkute</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>DATE</label>
                <input type="date" defaultValue="2026-07-25" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>CHECK IN TIME</label>
                <input type="time" defaultValue="09:15" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>CHECK OUT TIME</label>
                <input type="time" defaultValue="18:45" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowAddRecordModal(false)} style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { setShowAddRecordModal(false); alert('Record Saved!'); }} style={{ padding: '8px 20px', borderRadius: '8px', background: GOLD, border: 'none', color: '#000', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>Save Record</button>
            </div>
          </div>
        </div>
      )}

      {/* ── APPLY LEAVE MODAL ── */}
      {showLeaveModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#070F1E', border: `1px solid ${GOLD}30`, borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#FFF' }}>📅 Apply Leave Application</div>
              <button onClick={() => setShowLeaveModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>LEAVE TYPE</label>
                <select style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none' }}>
                  <option>Casual Leave (CL)</option>
                  <option>Sick Leave (SL)</option>
                  <option>Earned Leave (EL)</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>START DATE</label>
                  <input type="date" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>END DATE</label>
                  <input type="date" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>REASON</label>
                <textarea rows={3} placeholder="Provide reason for leave request..." style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowLeaveModal(false)} style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { setShowLeaveModal(false); alert('Leave Request Submitted to HR!'); }} style={{ padding: '8px 20px', borderRadius: '8px', background: GOLD, border: 'none', color: '#000', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>Submit Request</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
