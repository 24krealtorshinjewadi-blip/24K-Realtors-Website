// ═══════════════════════════════════════════════════════════════════════════
// 24K REALTORS — Individual Employee / Sales RM Workspace Dashboard
// Features:
//   - Personal Greeting: "Good Morning, Manish Rai 👋"
//   - 6 KPI Sparkline Cards (Total Leads 128, Site Visits 32, Active Deals 14, Deals Won 6, Revenue ₹12.45L, Commission ₹1.24L)
//   - My Lead Pipeline Funnel Bar (New 28, Contacted 34, Qualified 22, Site Visit 18, Negotiation 10, Won 6)
//   - Today's Follow-ups Widget with 1-click WhatsApp/Call launchers
//   - Today's Site Visits Tracker with Schedule New Visit button
//   - My Active Deals List with Negotiation / Site Visit badges
//   - My Commission Widget with 78% Target Donut Ring & Breakdown
//   - Live Attendance / Clock In-Out Widget with Live Working Timer
//   - Performance Overview Multi-point Line Chart
//   - Notifications & Recent Activity Stream
//   - Bottom Quick Actions Dock (Add Lead, Schedule Visit, Add Follow-up, Add Deal, Add Property, View Reports)
// ═══════════════════════════════════════════════════════════════════════════
import React, { useState, useEffect } from 'react';
import {
  Users, Calendar, TrendingUp, Award, DollarSign, Wallet, Phone, MessageSquare,
  Clock, CheckCircle2, AlertCircle, Plus, ChevronRight, Eye, Play, Square,
  Building, ChevronDown, Bell, Search, Filter, Shield, Sparkles, MapPin
} from 'lucide-react';

const GOLD = '#D4AF37';

const Sparkline = ({ color }) => (
  <svg width="100%" height="22" viewBox="0 0 100 22" fill="none">
    <path d="M0 16 Q 20 8, 40 12 T 80 4 T 100 2" stroke={color} strokeWidth="2" fill="none" />
  </svg>
);

export default function EmployeeDashboard({ agentName = localStorage.getItem('userFullName') || 'Jyoti Dhale', onNavigate, onOpenAddLead, onOpenScheduleVisit }) {
  const [clockInState, setClockInState] = useState(true);
  const [secondsWorking, setSecondsWorking] = useState(13530); // 03h 45m 30s initial

  useEffect(() => {
    let interval = null;
    if (clockInState) {
      interval = setInterval(() => {
        setSecondsWorking(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [clockInState]);

  const formatTimer = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '70px' }}>

      {/* ── TOP GREETING HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFF' }}>Good Morning, {agentName} 👋</div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>Here's what's happening with your business today.</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.76rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color={GOLD} /> 28 July 2026, Monday
          </div>
        </div>
      </div>

      {/* ── 8 RM WORKSPACE KPI SPARKLINE CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '10px' }}>
        {[
          { label: 'Total Leads', val: '128', change: '↑ 18% vs last month', color: GOLD, icon: Users },
          { label: 'New Leads', val: '32', change: '↑ 14% vs last month', color: '#3B82F6', icon: Users },
          { label: 'Active Leads', val: '56', change: '↑ 9% vs last month', color: '#14B8A6', icon: Users },
          { label: 'Site Visits', val: '32', change: '↑ 14% vs last month', color: '#8B5CF6', icon: Calendar },
          { label: 'Upcoming Follow-ups', val: '5', change: 'Scheduled today', color: '#EC4899', icon: Clock },
          { label: 'Active Deals', val: '14', change: '↑ 7% vs last month', color: '#F59E0B', icon: TrendingUp },
          { label: 'Won Deals', val: '6', change: '↑ 20% vs last month', color: '#10B981', icon: Award },
          { label: 'Commission', val: '₹ 1.24L', change: '78% target hit', color: GOLD, icon: Wallet },
        ].map((kpi, i) => {
          const IconC = kpi.icon;
          return (
            <div key={i} style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '5px', background: `${kpi.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconC size={11} color={kpi.color} />
                  </div>
                  <span style={{ fontSize: '0.58rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.03em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{kpi.label}</span>
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFF', marginBottom: '2px' }}>{kpi.val}</div>
                <div style={{ fontSize: '0.58rem', color: '#10B981', fontWeight: 700 }}>{kpi.change}</div>
              </div>
              <div style={{ marginTop: '6px' }}>
                <Sparkline color={kpi.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MIDDLE ROW 1 (MY LEAD PIPELINE & TODAY'S FOLLOW-UPS) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px', alignItems: 'stretch' }}>

        {/* My Lead Pipeline Funnel Bar */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFF', marginBottom: '16px' }}>My Lead Pipeline</div>

            {/* Pipeline Stage Blocks */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', textAlign: 'center' }}>
              {[
                { stage: 'New', count: 28, color: '#3B82F6' },
                { stage: 'Contacted', count: 34, color: '#14B8A6' },
                { stage: 'Qualified', count: 22, color: GOLD },
                { stage: 'Site Visit', count: 18, color: '#8B5CF6' },
                { stage: 'Negotiation', count: 10, color: '#F59E0B' },
                { stage: 'Won', count: 6, color: '#10B981' },
              ].map((stg, i) => (
                <div key={i} style={{ padding: '12px 6px', background: `${stg.color}12`, border: `1px solid ${stg.color}35`, borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>{stg.stage}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: stg.color, marginTop: '4px' }}>{stg.count}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <span style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.4)' }}>Conversion Rate</span>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: GOLD }}>4.69%</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.4)' }}>Total Assigned Leads</span>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#FFF' }}>128</div>
            </div>
          </div>
        </div>

        {/* Today's Follow-ups */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFF' }}>Today's Follow-ups</div>
            <span onClick={() => onNavigate?.('follow_ups')} style={{ fontSize: '0.72rem', color: GOLD, fontWeight: 700, cursor: 'pointer' }}>View All</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { time: '10:30 AM', name: 'Rohit Sharma', req: 'Premium Inquiry', loc: 'Lodha Hinjewadi', phone: '+91 98765 43210' },
              { time: '12:00 PM', name: 'Sneha Patil', req: '2 BHK Inquiry', loc: 'VTP Flamante', phone: '+91 87654 32109' },
              { time: '02:00 PM', name: 'Amit Verma', req: 'Investment Inquiry', loc: 'Godrej River Royale', phone: '+91 96730 00053' },
              { time: '04:30 PM', name: 'Neha Singh', req: '3 BHK Inquiry', loc: 'Kohinoor Westview', phone: '+91 91234 56789' },
              { time: '06:00 PM', name: 'Raj Malhotra', req: 'Penthouse Inquiry', loc: 'Lodha Belmondo', phone: '+91 99887 76655' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'rgba(255,255,255,0.025)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: GOLD, width: 55 }}>{item.time}</span>
                  <div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#FFF' }}>{item.name}</div>
                    <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>{item.req} · {item.loc}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <a href={`tel:${item.phone}`} style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={12} /></a>
                  <a href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquare size={12} /></a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── MIDDLE ROW 2 (SITE VISITS, ACTIVE DEALS, MY COMMISSION) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '16px', alignItems: 'stretch' }}>

        {/* Today's Site Visits */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>Today's Site Visits</div>
              <span onClick={() => onNavigate?.('site_visits')} style={{ fontSize: '0.72rem', color: GOLD, fontWeight: 700, cursor: 'pointer' }}>View All</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { time: '11:00 AM', client: 'Rohit Sharma', prj: 'Lodha Hinjewadi', status: 'Upcoming' },
                { time: '01:00 PM', client: 'Sneha Patil', prj: 'VTP Flamante', status: 'Upcoming' },
                { time: '03:00 PM', client: 'Amit Verma', prj: 'Godrej River Royale', status: 'Upcoming' },
              ].map((v, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'rgba(255,255,255,0.025)', borderRadius: '8px' }}>
                  <div>
                    <span style={{ fontSize: '0.64rem', fontWeight: 800, color: GOLD }}>{v.time}</span>
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#FFF' }}>{v.client}</div>
                    <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>{v.prj}</div>
                  </div>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(245,158,11,0.12)', color: '#F59E0B', fontSize: '0.6rem', fontWeight: 800 }}>{v.status}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={onOpenScheduleVisit}
            style={{ width: '100%', padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: GOLD, fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px' }}>
            <Plus size={13} /> Schedule New Visit
          </button>
        </div>

        {/* My Active Deals */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>My Active Deals</div>
            <span onClick={() => onNavigate?.('deals')} style={{ fontSize: '0.72rem', color: GOLD, fontWeight: 700, cursor: 'pointer' }}>View All</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { prj: 'Lodha Hinjewadi', desc: '3 BHK • 1200 Sq.ft', val: '₹ 1,25,000,000', stage: 'Negotiation', color: '#F59E0B' },
              { prj: 'VTP Flamante', desc: '2 BHK • 850 Sq.ft', val: '₹ 85,000,000', stage: 'Site Visit', color: '#3B82F6' },
              { prj: 'Godrej River Royale', desc: '3 BHK • 1100 Sq.ft', val: '₹ 1,10,000,000', stage: 'Negotiation', color: '#F59E0B' },
            ].map((d, i) => (
              <div key={i} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.025)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FFF' }}>{d.prj}</div>
                  <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{d.desc}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 900, color: GOLD }}>{d.val}</div>
                  <span style={{ fontSize: '0.6rem', color: d.color, fontWeight: 800 }}>{d.stage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Commission */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>My Commission</div>
              <span style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.4)' }}>This Month</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div style={{ width: 75, height: 75, borderRadius: '50%', background: `conic-gradient(${GOLD} 0% 78%, rgba(255,255,255,0.1) 78% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#070F1E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 900, color: GOLD }}>78%</div>
                  <div style={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.4)' }}>of Target</div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>Total Commission</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: GOLD }}>₹ 1,24,500</div>
                <div style={{ fontSize: '0.6rem', color: '#10B981', fontWeight: 700 }}>↑ 18% vs last month</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.68rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.4)' }}>Target</span><span style={{ color: '#FFF', fontWeight: 700 }}>₹ 1,60,000</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.4)' }}>Achieved</span><span style={{ color: '#10B981', fontWeight: 700 }}>₹ 1,24,500</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'rgba(255,255,255,0.4)' }}>Pending</span><span style={{ color: '#F59E0B', fontWeight: 700 }}>₹ 35,500</span></div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <span onClick={() => onNavigate?.('commissions')} style={{ fontSize: '0.72rem', color: GOLD, fontWeight: 700, cursor: 'pointer' }}>View Commission Details →</span>
          </div>
        </div>

      </div>

      {/* ── BOTTOM ROW (ATTENDANCE TIMER, PERFORMANCE CHART, NOTIFICATIONS & RECENT ACTIVITY) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '16px', alignItems: 'stretch' }}>

        {/* Live Attendance / Clock In-Out */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>Attendance / Clock In-Out</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div style={{ padding: '10px', background: 'rgba(16,185,129,0.08)', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div style={{ fontSize: '0.58rem', color: '#10B981', fontWeight: 800 }}>Today's Status</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF', marginTop: '2px' }}>Working</div>
                <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Check In: <strong style={{ color: '#10B981' }}>09:15 AM</strong></div>
              </div>
              <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>Working Hours</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 900, color: GOLD, marginTop: '2px', fontFamily: 'monospace' }}>{formatTimer(secondsWorking)}</div>
                <div style={{ fontSize: '0.58rem', color: '#10B981', marginTop: '4px' }}>Currently Working</div>
              </div>
            </div>

            <button onClick={() => setClockInState(!clockInState)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', background: clockInState ? 'rgba(239,68,68,0.2)' : GOLD, border: clockInState ? '1px solid #EF4444' : 'none', color: clockInState ? '#EF4444' : '#000', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              {clockInState ? <Square size={14} /> : <Play size={14} />} {clockInState ? 'Clock Out' : 'Clock In Now'}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)' }}>This Week: Present (5) · Absent (0)</span>
            <span onClick={() => onNavigate?.('attendance')} style={{ fontSize: '0.72rem', color: GOLD, fontWeight: 700, cursor: 'pointer' }}>View Attendance →</span>
          </div>
        </div>

        {/* Performance Overview Multi-point Chart */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>Performance Overview</div>
            <span style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.4)' }}>This Month</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px', fontSize: '0.68rem' }}>
            <div style={{ color: GOLD, fontWeight: 700 }}>Leads Added: 128 (↑ 18%)</div>
            <div style={{ color: '#3B82F6', fontWeight: 700 }}>Site Visits: 32 (↑ 14%)</div>
            <div style={{ color: '#10B981', fontWeight: 700 }}>Deals Won: 6 (↑ 20%)</div>
            <div style={{ color: '#8B5CF6', fontWeight: 700 }}>Revenue: ₹ 12,45,000</div>
          </div>

          <div style={{ height: 90, display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            {[10, 25, 18, 35, 22, 45, 30].map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{ width: '100%', height: `${v * 1.8}px`, background: `linear-gradient(180deg, ${GOLD}, ${GOLD}30)`, borderRadius: '3px 3px 0 0' }} />
                <span style={{ fontSize: '0.56rem', color: 'rgba(255,255,255,0.3)' }}>{i*4+1} Jul</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications & Recent Activity Stream */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF', marginBottom: '10px' }}>Notifications & Activity</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ padding: '6px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '0.68rem' }}>
              <span style={{ color: '#3B82F6', fontWeight: 700 }}>Lead assigned: Rohit Sharma</span>
              <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)' }}>2 min ago</div>
            </div>
            <div style={{ padding: '6px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '0.68rem' }}>
              <span style={{ color: GOLD, fontWeight: 700 }}>Site visit scheduled for 11:00 AM</span>
              <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)' }}>15 min ago</div>
            </div>
            <div style={{ padding: '6px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', fontSize: '0.68rem' }}>
              <span style={{ color: '#10B981', fontWeight: 700 }}>You won a deal in VTP Flamante!</span>
              <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)' }}>Yesterday, 02:15 PM</div>
            </div>
          </div>
        </div>

      </div>

      {/* ── FIXED QUICK ACTIONS DOCK (BOTTOM DOCK) ── */}
      <div style={{ position: 'fixed', bottom: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 90, background: '#070F1E', border: `1px solid ${GOLD}40`, borderRadius: '14px', padding: '8px 16px', boxShadow: `0 10px 30px rgba(0,0,0,0.8), 0 0 20px ${GOLD}20`, display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button onClick={onOpenAddLead} style={{ padding: '8px 14px', borderRadius: '8px', background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, border: 'none', color: '#000', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Plus size={13} /> Add Lead
        </button>
        <button onClick={onOpenScheduleVisit} style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Calendar size={13} color={GOLD} /> Schedule Visit
        </button>
        <button onClick={() => onNavigate?.('follow_ups')} style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Phone size={13} color="#10B981" /> Add Follow-up
        </button>
        <button onClick={() => onNavigate?.('deals')} style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <TrendingUp size={13} color="#3B82F6" /> Add Deal
        </button>
        <button onClick={() => onNavigate?.('properties')} style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Building size={13} color="#8B5CF6" /> Add Property
        </button>
        <button onClick={() => onNavigate?.('analytics')} style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Award size={13} color="#F59E0B" /> View Reports
        </button>
      </div>

    </div>
  );
}
