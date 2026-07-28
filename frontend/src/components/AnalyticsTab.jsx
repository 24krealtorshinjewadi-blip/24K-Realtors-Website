// ═══════════════════════════════════════════════════════════════════════════
// 24K REALTORS — Analytics & Reports Module
// Features:
//   - 6 KPI Sparkline Cards (Total Leads, Site Visits, Deals Closed, Revenue, Conversion Rate, Avg Deal Value)
//   - Leads Trend Multi-line Chart
//   - Deals Pipeline Funnel (5 Stages with conversion rates)
//   - Key Metrics Overview checklist
//   - Top Performing Projects Table (Revenue, Conversion rates)
//   - Lead Source Distribution Donut Chart
//   - Top Performing Employees Leaderboard Table
//   - Projects by Status Donut Chart
//   - Revenue Trend Bar/Line Chart
//   - Quick Reports Grid (8 one-click report generators)
//   - Custom Report modal & Download PDF functionality
// ═══════════════════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import {
  TrendingUp, Users, Calendar, Award, DollarSign, BarChart3,
  Download, Filter, FileText, ArrowUpRight, ArrowDownRight,
  Search, ChevronRight, Eye, Sparkles, Building, CheckCircle2,
  PieChart, RefreshCw, X, Sliders, Globe
} from 'lucide-react';

const GOLD = '#D4AF37';

const MOCK_PROJECT_PERF = [
  { name: 'Lodha Hinjewadi', loc: 'Hinjewadi Phase 3', leads: 352, visits: 82, deals: 18, rev: '₹2.45 Cr', rate: '5.11%', isUp: true, color: '#F59E0B', logo: 'LH' },
  { name: 'VTP Blue Waters', loc: 'Hinjewadi Phase 1', leads: 268, visits: 61, deals: 14, rev: '₹1.85 Cr', rate: '5.22%', isUp: true, color: '#3B82F6', logo: 'VB' },
  { name: 'Godrej Hillside', loc: 'Maan, Hinjewadi', leads: 184, visits: 45, deals: 9, rev: '₹1.20 Cr', rate: '4.89%', isUp: true, color: '#10B981', logo: 'GH' },
  { name: 'Kolte Patil Life Republic', loc: 'Hinjewadi Phase 5', leads: 156, visits: 38, deals: 7, rev: '₹0.95 Cr', rate: '4.49%', isUp: false, color: '#8B5CF6', logo: 'KP' },
  { name: 'Megapolis Symphony', loc: 'Hinjewadi Phase 2', leads: 132, visits: 29, deals: 6, rev: '₹0.72 Cr', rate: '4.55%', isUp: true, color: '#EC4899', logo: 'MS' },
];

const MOCK_EMP_PERF = [
  { name: 'Manish Rai', leads: 245, visits: 58, deals: 14, rev: '₹1.25 Cr', avatar: 'MR', color: '#F59E0B' },
  { name: 'Jyoti Dhale', leads: 188, visits: 46, deals: 11, rev: '₹1.05 Cr', avatar: 'JD', color: '#EC4899' },
  { name: 'Yash Murkute', leads: 142, visits: 34, deals: 9, rev: '₹0.85 Cr', avatar: 'YM', color: '#3B82F6' },
  { name: 'Amit Singh', leads: 132, visits: 31, deals: 7, rev: '₹0.62 Cr', avatar: 'AS', color: '#10B981' },
  { name: 'Rohini K.', leads: 110, visits: 28, deals: 6, rev: '₹0.48 Cr', avatar: 'RK', color: '#8B5CF6' },
];

const QUICK_REPORTS = [
  { id: 'lead', name: 'Lead Report', icon: Users, color: '#F59E0B' },
  { id: 'sales', name: 'Sales Report', icon: TrendingUp, color: '#10B981' },
  { id: 'visit', name: 'Site Visit Report', icon: Calendar, color: '#3B82F6' },
  { id: 'deal', name: 'Deals Report', icon: Award, color: GOLD },
  { id: 'rev', name: 'Revenue Report', icon: DollarSign, color: '#8B5CF6' },
  { id: 'emp', name: 'Employee Report', icon: Users, color: '#EC4899' },
  { id: 'proj', name: 'Project Report', icon: Building, color: '#14B8A6' },
  { id: 'comm', name: 'Commission Report', icon: Award, color: '#F97316' },
];

const Avatar = ({ initials, color, size = 28 }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', background: `${color}22`, border: `1px solid ${color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.35, fontWeight: 800, color, flexShrink: 0 }}>
    {initials}
  </div>
);

const Sparkline = ({ color }) => (
  <svg width="100%" height="22" viewBox="0 0 100 22" fill="none">
    <path d="M0 16 Q 15 10, 30 14 T 60 6 T 100 2" stroke={color} strokeWidth="2" fill="none" />
  </svg>
);

export default function AnalyticsTab() {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [reportPeriod, setReportPeriod] = useState('This Month');

  const handleDownloadReport = (name = 'Full Analytics Report') => {
    alert(`📥 Downloading ${name} (PDF & Excel)...`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFF' }}>Analytics & Reports</div>
          <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>Track performance, analyze trends and grow your business</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.76rem', color: 'rgba(255,255,255,0.6)' }}>
            <Calendar size={13} color={GOLD} />
            <span>01 Jul 2026 - 31 Jul 2026</span>
          </div>
          <button onClick={() => setShowCustomModal(true)}
            style={{ padding: '9px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sliders size={14} /> Custom Report
          </button>
          <button onClick={() => handleDownloadReport('CSV Export')}
            style={{ padding: '9px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={14} /> Export
          </button>
          <button onClick={() => handleDownloadReport('Executive Summary PDF')}
            style={{ padding: '9px 18px', borderRadius: '8px', background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, border: 'none', color: '#070D18', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: `0 4px 14px ${GOLD}30` }}>
            <FileText size={15} /> Download Report
          </button>
        </div>
      </div>

      {/* ── 6 KPI SPARKLINE CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
        {[
          { label: 'Total Leads', val: '1,256', change: '↑ 15.2% vs last month', color: '#8B5CF6', icon: Users },
          { label: 'Site Visits', val: '298', change: '↑ 18.7% vs last month', color: '#3B82F6', icon: Calendar },
          { label: 'Deals Closed', val: '64', change: '↑ 22.4% vs last month', color: '#F59E0B', icon: Award },
          { label: 'Total Revenue', val: '₹7.82 Cr', change: '↑ 20.6% vs last month', color: '#10B981', icon: DollarSign },
          { label: 'Conversion Rate', val: '5.10%', change: '↑ 1.3% vs last month', color: '#EC4899', icon: TrendingUp },
          { label: 'Avg. Deal Value', val: '₹1.22 Cr', change: '↑ 9.4% vs last month', color: GOLD, icon: BarChart3 },
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
                <div style={{ fontSize: '0.65rem', color: '#10B981', fontWeight: 600 }}>{kpi.change}</div>
              </div>
              <div style={{ marginTop: '8px' }}>
                <Sparkline color={kpi.color} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MIDDLE ROW 1 (LEADS TREND, FUNNEL, KEY METRICS) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.1fr 280px', gap: '16px', alignItems: 'stretch' }}>

        {/* Leads Trend Line Chart */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>Leads Trend</div>
            <select style={{ padding: '4px 8px', borderRadius: '6px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', outline: 'none' }}>
              <option>This Month</option>
              <option>Last Quarter</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', fontSize: '0.68rem' }}>
            <span style={{ color: '#8B5CF6', fontWeight: 700 }}>-- New Leads</span>
            <span style={{ color: '#3B82F6', fontWeight: 700 }}>-- Contacted</span>
            <span style={{ color: '#10B981', fontWeight: 700 }}>-- Qualified</span>
          </div>

          <div style={{ height: 120, display: 'flex', alignItems: 'flex-end', gap: '12px', position: 'relative' }}>
            {[
              { day: '1 Jul', n: 80, c: 50, q: 30 },
              { day: '8 Jul', n: 130, c: 90, q: 55 },
              { day: '15 Jul', n: 145, c: 98, q: 62 },
              { day: '22 Jul', n: 140, c: 105, q: 60 },
              { day: '31 Jul', n: 165, c: 128, q: 78 },
            ].map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', display: 'flex', gap: 3, alignItems: 'flex-end', height: 95 }}>
                  <div style={{ flex: 1, height: `${(d.n / 165) * 100}%`, background: '#8B5CF6', borderRadius: '2px 2px 0 0' }} />
                  <div style={{ flex: 1, height: `${(d.c / 165) * 100}%`, background: '#3B82F6', borderRadius: '2px 2px 0 0' }} />
                  <div style={{ flex: 1, height: `${(d.q / 165) * 100}%`, background: '#10B981', borderRadius: '2px 2px 0 0' }} />
                </div>
                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)' }}>{d.day}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>New Leads</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#8B5CF6' }}>1,256</div>
            </div>
            <div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>Contacted</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#3B82F6' }}>842</div>
            </div>
            <div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>Qualified</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10B981' }}>612</div>
            </div>
          </div>
        </div>

        {/* Deals Pipeline Funnel Chart */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>Deals Pipeline Overview</div>
            <select style={{ padding: '4px 8px', borderRadius: '6px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', outline: 'none' }}>
              <option>This Month</option>
            </select>
          </div>

          {/* Funnel Shapes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
            {[
              { stage: 'Qualified', count: '320 (100%)', width: '100%', bg: '#8B5CF6' },
              { stage: 'Proposal', count: '182 (56.9%)', width: '82%', bg: '#3B82F6' },
              { stage: 'Negotiation', count: '98 (30.6%)', width: '64%', bg: '#14B8A6' },
              { stage: 'Agreement', count: '72 (22.5%)', width: '48%', bg: GOLD },
              { stage: 'Closed Won', count: '64 (20%)', width: '36%', bg: '#10B981' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ width: f.width, height: 26, background: f.bg, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.66rem', fontWeight: 800, color: '#FFF', margin: '0 auto', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                  {f.count}
                </div>
                <span style={{ position: 'absolute', right: 0, fontSize: '0.64rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{f.stage}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>Conversion Rate</span>
            <span style={{ fontSize: '0.92rem', fontWeight: 900, color: '#10B981' }}>20% <span style={{ fontSize: '0.65rem', color: '#10B981' }}>↑ 2.4%</span></span>
          </div>
        </div>

        {/* Key Metrics Overview Checklist */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF', marginBottom: '14px' }}>Key Metrics Overview</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { label: 'Total Leads', val: '1,256', change: '↑ 15.2%', icon: Users, color: '#8B5CF6' },
              { label: 'Site Visits', val: '298', change: '↑ 18.7%', icon: Calendar, color: '#3B82F6' },
              { label: 'Deals Closed', val: '64', change: '↑ 22.4%', icon: Award, color: '#F59E0B' },
              { label: 'Total Revenue', val: '₹7.82 Cr', change: '↑ 20.6%', icon: DollarSign, color: '#10B981' },
              { label: 'Avg. Deal Value', val: '₹1.22 Cr', change: '↑ 9.4%', icon: BarChart3, color: GOLD },
              { label: 'Conversion Rate', val: '5.10%', change: '↑ 1.3%', icon: TrendingUp, color: '#EC4899' },
            ].map((m, i) => {
              const IconC = m.icon;
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'rgba(255,255,255,0.025)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${m.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconC size={11} color={m.color} />
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.65)' }}>{m.label}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFF' }}>{m.val}</div>
                    <div style={{ fontSize: '0.6rem', color: '#10B981', fontWeight: 700 }}>{m.change}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MIDDLE ROW 2 (PROJECTS TABLE & LEAD SOURCE DONUT) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', alignItems: 'start' }}>

        {/* Top Performing Projects Table */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>Top Performing Projects</div>
            <select style={{ padding: '4px 8px', borderRadius: '6px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', outline: 'none' }}>
              <option>This Month</option>
            </select>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.015)' }}>
                  {['PROJECT', 'LOCATION', 'TOTAL LEADS', 'SITE VISITS', 'DEALS CLOSED', 'REVENUE (₹)', 'CONVERSION RATE'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '0.62rem', fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_PROJECT_PERF.map((p, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Avatar initials={p.logo} color={p.color} size={28} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFF', whiteSpace: 'nowrap' }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: '0.74rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>{p.loc}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.78rem', fontWeight: 700, color: '#8B5CF6' }}>{p.leads}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.78rem', fontWeight: 700, color: '#3B82F6' }}>{p.visits}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.78rem', fontWeight: 700, color: '#10B981' }}>{p.deals}</td>
                    <td style={{ padding: '12px 14px', fontSize: '0.82rem', fontWeight: 900, color: GOLD }}>{p.rev}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: p.isUp ? '#10B981' : '#EF4444', fontWeight: 700 }}>
                        <span>{p.rate}</span>
                        {p.isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.04)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: GOLD, fontWeight: 700, cursor: 'pointer' }}>View All Projects →</span>
            </div>
          </div>
        </div>

        {/* Lead Source Distribution Donut Chart */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>Lead Source Distribution</div>
            <select style={{ padding: '4px 8px', borderRadius: '6px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', outline: 'none' }}>
              <option>This Month</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '14px' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: `conic-gradient(#3B82F6 0% 42%, #10B981 42% 68%, ${GOLD} 68% 83%, #8B5CF6 83% 92%, #F97316 92% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 68, height: 68, borderRadius: '50%', background: '#070F1E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#FFF' }}>1,256</div>
                <div style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.4)' }}>Total Leads</div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { label: 'Website', pct: '42% (527)', color: '#3B82F6' },
                { label: 'WhatsApp', pct: '26% (327)', color: '#10B981' },
                { label: 'Referral', pct: '15% (188)', color: GOLD },
                { label: 'Walk-in', pct: '9% (113)', color: '#8B5CF6' },
                { label: 'Others', pct: '8% (101)', color: '#F97316' },
              ].map((src, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: src.color }} />
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>{src.label}</span>
                  </div>
                  <span style={{ color: '#FFF', fontWeight: 700 }}>{src.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW (EMPLOYEES, PROJECTS STATUS, REVENUE TREND, QUICK REPORTS) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr 240px', gap: '16px', alignItems: 'stretch' }}>

        {/* Top Performing Employees */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>Top Performing Employees</div>
            <select style={{ padding: '4px 8px', borderRadius: '6px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', outline: 'none' }}>
              <option>This Month</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {MOCK_EMP_PERF.map((emp, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(255,255,255,0.025)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Avatar initials={emp.avatar} color={emp.color} size={26} />
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#FFF' }}>{emp.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.7rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{emp.leads} Leads</span>
                  <span style={{ color: '#10B981', fontWeight: 700 }}>{emp.deals} Deals</span>
                  <span style={{ color: GOLD, fontWeight: 800 }}>{emp.rev}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects by Status Donut */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>Projects by Status</div>
            <select style={{ padding: '4px 8px', borderRadius: '6px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', outline: 'none' }}>
              <option>This Month</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: 84, height: 84, borderRadius: '50%', background: `conic-gradient(#3B82F6 0% 50%, #10B981 50% 75%, ${GOLD} 75% 92%, #8B5CF6 92% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#070F1E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 900, color: GOLD }}>24</div>
                <div style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.4)' }}>Total Projects</div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { label: 'Under Construction', val: '12 (50%)', color: '#3B82F6' },
                { label: 'New Launch', val: '6 (25%)', color: '#10B981' },
                { label: 'Upcoming', val: '4 (17%)', color: GOLD },
                { label: 'Ready to Move', val: '2 (8%)', color: '#8B5CF6' },
              ].map((st, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: st.color }} />
                    <span style={{ color: 'rgba(255,255,255,0.55)' }}>{st.label}</span>
                  </div>
                  <span style={{ color: '#FFF', fontWeight: 700 }}>{st.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Trend Line/Bar Chart */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFF' }}>Revenue Trend</div>
            <select style={{ padding: '4px 8px', borderRadius: '6px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', outline: 'none' }}>
              <option>This Month</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', fontSize: '0.65rem' }}>
            <span style={{ color: GOLD, fontWeight: 700 }}>-- Revenue (₹)</span>
            <span style={{ color: '#10B981', fontWeight: 700 }}>-- Deals Closed</span>
          </div>
          <div style={{ height: 80, display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            {[
              { d: '1 Jul', r: 1.2, c: 10 },
              { d: '8 Jul', r: 1.8, c: 15 },
              { d: '15 Jul', r: 2.2, c: 20 },
              { d: '22 Jul', r: 2.5, c: 22 },
              { d: '31 Jul', r: 3.1, c: 30 },
            ].map((p, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{ width: '100%', height: `${(p.r / 3.1) * 60}px`, background: GOLD, borderRadius: '2px 2px 0 0' }} />
                <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)' }}>{p.d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Reports 8-Tile Grid */}
        <div style={{ background: 'rgba(10,18,36,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '16px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>Quick Reports</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {QUICK_REPORTS.map((rep, i) => {
              const IconC = rep.icon;
              return (
                <button key={rep.id} onClick={() => handleDownloadReport(rep.name)}
                  style={{ padding: '8px 6px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)', fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textAlign: 'center' }}>
                  <IconC size={14} color={rep.color} />
                  <span>{rep.name}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* ── CUSTOM REPORT MODAL ── */}
      {showCustomModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#070F1E', border: `1px solid ${GOLD}30`, borderRadius: '16px', width: '100%', maxWidth: '520px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#FFF' }}>📊 Generate Custom Analytics Report</div>
              <button onClick={() => setShowCustomModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>REPORT TYPE</label>
                <select style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.8rem', outline: 'none' }}>
                  <option>Comprehensive Performance Summary</option>
                  <option>Lead Conversion & Acquisition Report</option>
                  <option>Agent Sales & Commission Breakdown</option>
                  <option>Project Revenue & Inventory Report</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>START DATE</label>
                  <input type="date" defaultValue="2026-07-01" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>END DATE</label>
                  <input type="date" defaultValue="2026-07-31" style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.78rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>EXPORT FORMAT</label>
                <select style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.8rem', outline: 'none' }}>
                  <option>PDF Executive Presentation</option>
                  <option>Excel Data Sheet (.xlsx)</option>
                  <option>CSV Raw Telemetry Data</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowCustomModal(false)} style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { setShowCustomModal(false); handleDownloadReport('Custom Report'); }} style={{ padding: '8px 20px', borderRadius: '8px', background: GOLD, border: 'none', color: '#000', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}>Generate &amp; Download</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
