import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { 
  Calendar, Clock, CheckCircle2, XCircle, AlertCircle, MapPin, Plus, Download, Upload,
  Search, Filter, Star, Eye, Edit2, MoreVertical, Phone, MessageSquare, Mail, ChevronRight,
  User, Building2, Sliders, LayoutGrid, List, Map as MapIcon, ArrowUpRight, TrendingUp, X
} from 'lucide-react';

// ─── SVG Sparkline Component ────────────────────────────────────────────────
function Sparkline({ color = '#F59E0B' }) {
  return (
    <svg width="70" height="24" viewBox="0 0 70 24" fill="none">
      <path
        d="M 2 18 Q 18 4, 30 14 T 52 8 T 68 4"
        stroke={color}
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── SVG Donut Chart Component ──────────────────────────────────────────────
function AnalyticsDonut() {
  const size = 120;
  const strokeWidth = 16;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  // Completed 56%, Scheduled 33%, Cancelled 6%, No Show 5%
  const segments = [
    { percent: 56, color: '#10B981', label: 'Completed', val: '16 (56%)' },
    { percent: 33, color: '#3B82F6', label: 'Scheduled', val: '12 (33%)' },
    { percent: 6, color: '#EF4444', label: 'Cancelled', val: '2 (6%)' },
    { percent: 5, color: '#64748B', label: 'No Show', val: '2 (5%)' }
  ];

  let currentOffset = 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          {segments.map((st, i) => {
            const dash = (st.percent / 100) * circumference;
            const gap = circumference - dash;
            const offset = currentOffset;
            currentOffset += dash;
            return (
              <circle
                key={i}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={st.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={-offset}
              />
            );
          })}
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', fontFamily: "'Cinzel', serif" }}>18</span>
          <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.45)' }}>Total Visits</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {segments.map((st, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: st.color }} />
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>{st.label}</span>
            </div>
            <span style={{ fontWeight: 700, color: '#FFF' }}>{st.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SiteVisitsTab({ leads = [], agents = [] }) {
  const [subTab, setSubTab] = useState('ALL');
  const [viewMode, setViewMode] = useState('list');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Mock Visit records matching reference screenshot
  const initialVisits = [
    {
      id: 'SV-2026-018',
      leadName: 'Rohan Sharma',
      phone: '+91 98765 43210',
      leadInitials: 'RS',
      leadAvatarBg: '#F59E0B',
      leadTag: 'HOT',
      propertyName: 'Lodha Hinjewadi',
      propertyDetail: '2 BHK, Tower 3',
      propertyImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=120&q=80',
      rmName: 'Jyoti Dhale',
      rmImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80',
      dateTime: '27 Jul 2026, 10:30 AM',
      status: 'COMPLETED',
      purpose: 'Project Visit',
      feedback: '4.5',
      unitType: '2 BHK',
      timeline: [
        { label: 'Scheduled', detail: '23 Jul 2026, 04:15 PM by Jyoti Dhale', done: true },
        { label: 'Reminder Sent', detail: '27 Jul 2026, 09:00 AM SMS & WhatsApp', done: true },
        { label: 'Checked In', detail: '27 Jul 2026, 10:28 AM On Site', done: true },
        { label: 'Completed', detail: '27 Jul 2026, 12:15 PM Duration: 1h 45m', done: true }
      ],
      notes: 'Client liked the project location and amenities. Interested in 2.5 BHK option. Follow-up on budget discussion.',
      notesAuthor: 'By Jyoti Dhale - 27 Jul 2026, 01:00 PM'
    },
    {
      id: 'SV-2026-017',
      leadName: 'Priya Patel',
      phone: '+91 91234 56789',
      leadInitials: 'PP',
      leadAvatarBg: '#8B5CF6',
      leadTag: 'WARM',
      propertyName: 'VTP Blue Waters',
      propertyDetail: '3 BHK',
      propertyImg: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=120&q=80',
      rmName: 'Jyoti Jagtap',
      rmImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=60&q=80',
      dateTime: '27 Jul 2026, 09:15 AM',
      status: 'SCHEDULED',
      purpose: 'Site Visit',
      feedback: '-',
      unitType: '3 BHK',
      timeline: [
        { label: 'Scheduled', detail: '25 Jul 2026, 11:00 AM by Jyoti Jagtap', done: true },
        { label: 'Reminder Sent', detail: '27 Jul 2026, 08:30 AM', done: true }
      ],
      notes: 'Family site visit planned for 3 BHK luxury layout.',
      notesAuthor: 'By Jyoti Jagtap - 25 Jul 2026'
    },
    {
      id: 'SV-2026-016',
      leadName: 'Vikram Malhotra',
      phone: '+91 99888 77665',
      leadInitials: 'VM',
      leadAvatarBg: '#3B82F6',
      leadTag: 'HOT',
      propertyName: 'Godrej Hillside',
      propertyDetail: '2 BHK',
      propertyImg: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=120&q=80',
      rmName: 'Yash Murkute',
      rmImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80',
      dateTime: '26 Jul 2026, 06:00 PM',
      status: 'COMPLETED',
      purpose: 'Project Visit',
      feedback: '4.0',
      unitType: '2 BHK',
      timeline: [{ label: 'Completed', detail: '26 Jul 2026', done: true }],
      notes: 'Interested in high floor deck view unit.',
      notesAuthor: 'By Yash Murkute'
    },
    {
      id: 'SV-2026-015',
      leadName: 'Amit Singh',
      phone: '+91 90909 09090',
      leadInitials: 'AS',
      leadAvatarBg: '#10B981',
      leadTag: 'WARM',
      propertyName: 'Megapolis Symphony',
      propertyDetail: '2 BHK',
      propertyImg: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=120&q=80',
      rmName: 'Rohini K.',
      rmImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=60&q=80',
      dateTime: '26 Jul 2026, 04:45 PM',
      status: 'COMPLETED',
      purpose: 'Property Visit',
      feedback: '5.0',
      unitType: '2 BHK',
      timeline: [{ label: 'Completed', detail: '26 Jul 2026', done: true }],
      notes: 'Very positive response. Booking token discussed.',
      notesAuthor: 'By Rohini K.'
    },
    {
      id: 'SV-2026-014',
      leadName: 'Neha Kulkarni',
      phone: '+91 80808 80808',
      leadInitials: 'NK',
      leadAvatarBg: '#F97316',
      leadTag: 'COLD',
      propertyName: 'Kolte Patil Life Republic',
      propertyDetail: '3 BHK',
      propertyImg: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=120&q=80',
      rmName: 'Jyoti Dhale',
      rmImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80',
      dateTime: '26 Jul 2026, 11:30 AM',
      status: 'CANCELLED',
      purpose: '-',
      feedback: '-',
      unitType: '3 BHK',
      timeline: [{ label: 'Cancelled', detail: 'Client personal emergency', done: false }],
      notes: 'Client requested reschedule for next weekend.',
      notesAuthor: 'By Jyoti Dhale'
    },
    {
      id: 'SV-2026-013',
      leadName: 'Rahul Verma',
      phone: '+91 77777 88888',
      leadInitials: 'RV',
      leadAvatarBg: '#64748B',
      leadTag: 'WARM',
      propertyName: 'Panchshil Towers',
      propertyDetail: '4 BHK',
      propertyImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=120&q=80',
      rmName: 'Yash Murkute',
      rmImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80',
      dateTime: '25 Jul 2026, 03:00 PM',
      status: 'NO SHOW',
      purpose: 'Project Visit',
      feedback: '-',
      unitType: '4 BHK',
      timeline: [{ label: 'No Show', detail: 'Unreachable on phone', done: false }],
      notes: 'Follow-up call scheduled.',
      notesAuthor: 'By Yash Murkute'
    },
    {
      id: 'SV-2026-012',
      leadName: 'Sneha Iyer',
      phone: '+91 99999 11111',
      leadInitials: 'SI',
      leadAvatarBg: '#EC4899',
      leadTag: 'HOT',
      propertyName: 'Rohan Ekam',
      propertyDetail: '2 BHK',
      propertyImg: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=120&q=80',
      rmName: 'Jyoti Jagtap',
      rmImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=60&q=80',
      dateTime: '25 Jul 2026, 10:00 AM',
      status: 'COMPLETED',
      purpose: 'Site Visit',
      feedback: '4.0',
      unitType: '2 BHK',
      timeline: [{ label: 'Completed', detail: '25 Jul 2026', done: true }],
      notes: 'Loved modern layout.',
      notesAuthor: 'By Jyoti Jagtap'
    },
    {
      id: 'SV-2026-011',
      leadName: 'Ankit Tiwari',
      phone: '+91 66666 22222',
      leadInitials: 'AT',
      leadAvatarBg: '#0EA5E9',
      leadTag: 'WARM',
      propertyName: 'Dosti Greenscape',
      propertyDetail: '3 BHK',
      propertyImg: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=120&q=80',
      rmName: 'Rohini K.',
      rmImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=60&q=80',
      dateTime: '24 Jul 2026, 05:30 PM',
      status: 'COMPLETED',
      purpose: 'Project Visit',
      feedback: '4.5',
      unitType: '3 BHK',
      timeline: [{ label: 'Completed', detail: '24 Jul 2026', done: true }],
      notes: 'Loan eligibility check pending.',
      notesAuthor: 'By Rohini K.'
    }
  ];

  const [visitsList, setVisitsList] = useState(initialVisits);
  const [selectedVisit, setSelectedVisit] = useState(initialVisits[0]);

  const [scheduleForm, setScheduleForm] = useState({
    leadName: '',
    phone: '',
    propertyName: 'Lodha Hinjewadi',
    unitType: '2 BHK',
    rmName: 'Jyoti Dhale',
    date: '2026-07-28',
    time: '11:00 AM',
    purpose: 'Project Visit',
    notes: 'Scheduled via CRM Site Visits Desk'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: `Site Visit - ${scheduleForm.propertyName}`,
        detail: `${scheduleForm.purpose} for ${scheduleForm.leadName} (${scheduleForm.phone})`,
        dueDate: `${scheduleForm.date}T${scheduleForm.time}`,
        assignedAgentName: scheduleForm.rmName,
        status: 'SCHEDULED'
      };
      await apiService.createTask(payload);
      
      const newVisit = {
        id: `SV-2026-0${visitsList.length + 11}`,
        leadName: scheduleForm.leadName,
        phone: scheduleForm.phone,
        leadInitials: scheduleForm.leadName.substring(0, 2).toUpperCase(),
        leadAvatarBg: '#F59E0B',
        leadTag: 'HOT',
        propertyName: scheduleForm.propertyName,
        propertyDetail: scheduleForm.unitType,
        propertyImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=120&q=80',
        rmName: scheduleForm.rmName,
        rmImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80',
        dateTime: `${scheduleForm.date}, ${scheduleForm.time}`,
        status: 'SCHEDULED',
        purpose: scheduleForm.purpose,
        feedback: '-',
        unitType: scheduleForm.unitType,
        timeline: [{ label: 'Scheduled', detail: `${scheduleForm.date}, ${scheduleForm.time} by ${scheduleForm.rmName}`, done: true }],
        notes: scheduleForm.notes,
        notesAuthor: `By ${scheduleForm.rmName} - Today`
      };

      setVisitsList(prev => [newVisit, ...prev]);
      setSelectedVisit(newVisit);
      setIsScheduleModalOpen(false);
      alert('Site Visit scheduled successfully & synchronized with backend!');
    } catch (err) {
      console.warn('Backend Schedule fallback:', err);
      const newVisit = {
        id: `SV-2026-0${visitsList.length + 11}`,
        leadName: scheduleForm.leadName || 'New Client',
        phone: scheduleForm.phone || '+91 98765 00000',
        leadInitials: (scheduleForm.leadName || 'NC').substring(0, 2).toUpperCase(),
        leadAvatarBg: '#F59E0B',
        leadTag: 'HOT',
        propertyName: scheduleForm.propertyName,
        propertyDetail: scheduleForm.unitType,
        propertyImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=120&q=80',
        rmName: scheduleForm.rmName,
        rmImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80',
        dateTime: `${scheduleForm.date}, ${scheduleForm.time}`,
        status: 'SCHEDULED',
        purpose: scheduleForm.purpose,
        feedback: '-',
        unitType: scheduleForm.unitType,
        timeline: [{ label: 'Scheduled', detail: `${scheduleForm.date}, ${scheduleForm.time} by ${scheduleForm.rmName}`, done: true }],
        notes: scheduleForm.notes,
        notesAuthor: `By ${scheduleForm.rmName} - Today`
      };
      setVisitsList(prev => [newVisit, ...prev]);
      setSelectedVisit(newVisit);
      setIsScheduleModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered visits
  const filteredVisits = visitsList.filter(v => {
    if (subTab === 'ALL') return true;
    if (subTab === 'Scheduled') return v.status === 'SCHEDULED';
    if (subTab === 'Completed') return v.status === 'COMPLETED';
    if (subTab === 'Cancelled') return v.status === 'CANCELLED';
    if (subTab === 'No Show') return v.status === 'NO SHOW';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#FFF' }}>
      
      {/* ── TOP ACTION BAR ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', margin: 0 }}>Site Visits</h2>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', margin: '2px 0 0' }}>Track, Manage &amp; Convert Every Site Visit</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button style={{ padding: '7px 14px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Upload size={13} /> Import Visits
          </button>
          <button style={{ padding: '7px 14px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={13} /> Export
          </button>
          <button 
            onClick={() => setIsScheduleModalOpen(true)}
            style={{ padding: '8px 16px', borderRadius: '7px', background: 'linear-gradient(135deg, var(--gold-primary), #B8860B)', border: 'none', color: '#070D18', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} /> Schedule Visit
          </button>
        </div>
      </div>

      {/* ── 6 TOP KPI CARDS WITH SPARKLINES ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px' }}>
        {[
          { label: 'TOTAL SITE VISITS', val: '18', change: '↑ 24.1% vs last month', color: '#F59E0B', sparkColor: '#F59E0B' },
          { label: 'SCHEDULED', val: '12', change: '↑ 20.0% vs last month', color: '#F59E0B', sparkColor: '#F59E0B' },
          { label: 'COMPLETED', val: '16', change: '↑ 25.0% vs last month', color: '#F59E0B', sparkColor: '#F59E0B' },
          { label: "TODAY'S VISITS", val: '5', sub: "View today's schedule", color: '#F59E0B', isBadge: true },
          { label: 'CONVERSION RATE', val: '38.9%', change: '↑ 6.8% vs last month', color: '#10B981', isRing: true },
          { label: 'VISITS THIS MONTH', val: '18', sub: 'vs 14 last month', color: '#F59E0B', isIcon: true },
        ].map((card, i) => (
          <div key={i} style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={16} color={card.color} />
              </div>
              {!card.isBadge && !card.isRing && !card.isIcon && <Sparkline color={card.sparkColor} />}
            </div>

            <div>
              <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700, letterSpacing: '0.05em' }}>{card.label}</span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFF', fontFamily: "'Cinzel', serif", margin: '2px 0' }}>{card.val}</div>
              
              {card.change && <span style={{ fontSize: '0.64rem', color: card.color === '#10B981' ? '#10B981' : '#10B981', fontWeight: 600 }}>{card.change}</span>}
              {card.sub && <span style={{ fontSize: '0.64rem', color: 'var(--gold-primary)', fontWeight: 600, cursor: 'pointer' }}>{card.sub}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* ── MAIN SPLIT SECTION: LEFT TABLE (~70%) + RIGHT DRAWER (~30%) ────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
        
        {/* LEFT: SITE VISITS TABLE SECTION */}
        <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Sub-tabs + View Mode Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['ALL', 'Scheduled', 'Completed', 'Cancelled', 'No Show'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setSubTab(tab)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    background: subTab === tab ? 'rgba(212,175,55,0.15)' : 'transparent',
                    color: subTab === tab ? 'var(--gold-primary)' : 'rgba(255,255,255,0.5)',
                    fontSize: '0.74rem',
                    fontWeight: subTab === tab ? 700 : 500,
                    cursor: 'pointer',
                    borderBottom: subTab === tab ? '2px solid var(--gold-primary)' : '2px solid transparent'
                  }}
                >
                  {tab === 'ALL' ? 'All Visits' : tab}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button style={{ padding: '5px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sliders size={12} /> Advanced Filter
              </button>
              <button onClick={() => setViewMode('list')} style={{ padding: '5px 8px', borderRadius: '6px', background: viewMode === 'list' ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)', border: viewMode === 'list' ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.1)', color: viewMode === 'list' ? 'var(--gold-primary)' : 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
                <List size={13} />
              </button>
              <button onClick={() => setViewMode('grid')} style={{ padding: '5px 8px', borderRadius: '6px', background: viewMode === 'grid' ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)', border: viewMode === 'grid' ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.1)', color: viewMode === 'grid' ? 'var(--gold-primary)' : 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
                <LayoutGrid size={13} />
              </button>
              <button onClick={() => setViewMode('map')} style={{ padding: '5px 8px', borderRadius: '6px', background: viewMode === 'map' ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)', border: viewMode === 'map' ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.1)', color: viewMode === 'map' ? 'var(--gold-primary)' : 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
                <MapIcon size={13} />
              </button>
            </div>
          </div>

          {/* Visits Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.76rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontSize: '0.62rem', letterSpacing: '0.06em' }}>
                  <th style={{ padding: '10px 10px' }}>VISIT ID</th>
                  <th style={{ padding: '10px 10px' }}>LEAD / CONTACT</th>
                  <th style={{ padding: '10px 10px' }}>PROPERTY / PROJECT</th>
                  <th style={{ padding: '10px 10px' }}>RM / ASSIGNED</th>
                  <th style={{ padding: '10px 10px' }}>DATE &amp; TIME</th>
                  <th style={{ padding: '10px 10px' }}>STATUS</th>
                  <th style={{ padding: '10px 10px' }}>PURPOSE</th>
                  <th style={{ padding: '10px 10px' }}>FEEDBACK</th>
                  <th style={{ padding: '10px 6px', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisits.map((visit) => {
                  const isSelected = selectedVisit && selectedVisit.id === visit.id;
                  
                  const statusBg = 
                    visit.status === 'COMPLETED' ? 'rgba(16,185,129,0.15)' :
                    visit.status === 'SCHEDULED' ? 'rgba(59,130,246,0.15)' :
                    visit.status === 'CANCELLED' ? 'rgba(239,68,68,0.15)' : 'rgba(100,116,139,0.15)';

                  const statusColor = 
                    visit.status === 'COMPLETED' ? '#10B981' :
                    visit.status === 'SCHEDULED' ? '#3B82F6' :
                    visit.status === 'CANCELLED' ? '#EF4444' : '#94A3B8';

                  return (
                    <tr 
                      key={visit.id}
                      onClick={() => setSelectedVisit(visit)}
                      style={{ 
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        cursor: 'pointer',
                        background: isSelected ? 'rgba(212,175,55,0.06)' : 'transparent',
                        borderLeft: isSelected ? '3px solid var(--gold-primary)' : '3px solid transparent',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '12px 10px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '0.72rem' }}>{visit.id}</td>

                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: visit.leadAvatarBg, color: '#070D18', fontWeight: 900, fontSize: '0.66rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {visit.leadInitials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#FFF' }}>{visit.leadName}</div>
                            <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>{visit.phone}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img src={visit.propertyImg} alt={visit.propertyName} style={{ width: '28px', height: '28px', borderRadius: '4px', objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontWeight: 700, color: '#FFF', fontSize: '0.74rem' }}>{visit.propertyName}</div>
                            <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>{visit.propertyDetail}</div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <img src={visit.rmImg} alt={visit.rmName} style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} />
                          <span style={{ fontSize: '0.72rem', color: '#FFF' }}>{visit.rmName}</span>
                        </div>
                      </td>

                      <td style={{ padding: '12px 10px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={11} color="rgba(255,255,255,0.4)" />
                          <span>{visit.dateTime}</span>
                        </div>
                      </td>

                      <td style={{ padding: '12px 10px' }}>
                        <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '2px 7px', borderRadius: '5px', background: statusBg, color: statusColor, letterSpacing: '0.04em' }}>
                          {visit.status}
                        </span>
                      </td>

                      <td style={{ padding: '12px 10px', color: 'rgba(255,255,255,0.7)' }}>{visit.purpose}</td>

                      <td style={{ padding: '12px 10px' }}>
                        {visit.feedback !== '-' ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#F59E0B', fontWeight: 800 }}>
                            <Star size={11} fill="#F59E0B" />
                            <span>{visit.feedback}</span>
                          </div>
                        ) : (
                          <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>
                        )}
                      </td>

                      <td style={{ padding: '12px 6px', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><Eye size={12} /></button>
                          <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><Edit2 size={12} /></button>
                          <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><MoreVertical size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
            <span>Showing 1 to 8 of 18 visits</span>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <button style={{ padding: '3px 7px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>‹</button>
              <button style={{ padding: '3px 7px', borderRadius: '4px', background: 'var(--gold-primary)', border: 'none', color: '#070D18', fontWeight: 800 }}>1</button>
              <button style={{ padding: '3px 7px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>2</button>
              <button style={{ padding: '3px 7px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>3</button>
              <button style={{ padding: '3px 7px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>›</button>
            </div>
          </div>
        </div>

        {/* RIGHT: SELECTED VISIT DETAILS DRAWER PANEL */}
        {selectedVisit && (
          <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Header: Visit ID, Status Badge, Lead Avatar, Quick Contact */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFF' }}>{selectedVisit.id}</span>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '2px 8px', borderRadius: '5px', background: selectedVisit.status === 'COMPLETED' ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)', color: selectedVisit.status === 'COMPLETED' ? '#10B981' : '#3B82F6' }}>
                {selectedVisit.status}
              </span>
            </div>

            {/* Lead info & Contact icons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: selectedVisit.leadAvatarBg, color: '#070D18', fontWeight: 900, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedVisit.leadInitials}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFF' }}>{selectedVisit.leadName}</span>
                    <span style={{ fontSize: '0.58rem', fontWeight: 800, padding: '1px 5px', borderRadius: '3px', background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>{selectedVisit.leadTag}</span>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{selectedVisit.phone}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => window.open('tel:' + selectedVisit.phone, '_self')} style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: 'none', color: '#10B981', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={13} /></button>
                <button onClick={() => window.open('https://wa.me/' + selectedVisit.phone.replace(/[^0-9]/g, ''), '_blank')} style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: 'none', color: '#10B981', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquare size={13} /></button>
                <button onClick={() => window.open('mailto:lead@email.com', '_self')} style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: 'none', color: '#3B82F6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={13} /></button>
              </div>
            </div>

            {/* Visit Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.72rem', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px' }}>
              <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Project / Property:</span> <div style={{ color: '#FFF', fontWeight: 700 }}>{selectedVisit.propertyName}, {selectedVisit.propertyDetail}</div></div>
              <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Unit Type:</span> <div style={{ color: '#FFF', fontWeight: 700 }}>{selectedVisit.unitType}</div></div>
              <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>RM / Assigned:</span> <div style={{ color: '#FFF', fontWeight: 700 }}>{selectedVisit.rmName}</div></div>
              <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Date &amp; Time:</span> <div style={{ color: '#FFF', fontWeight: 700 }}>{selectedVisit.dateTime}</div></div>
              <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Purpose:</span> <div style={{ color: '#FFF', fontWeight: 700 }}>{selectedVisit.purpose}</div></div>
              <div><span style={{ color: 'rgba(255,255,255,0.4)' }}>Status:</span> <div style={{ color: selectedVisit.status === 'COMPLETED' ? '#10B981' : '#3B82F6', fontWeight: 800 }}>{selectedVisit.status}</div></div>
              
              <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Feedback:</span> 
                <span style={{ color: '#F59E0B', fontWeight: 800 }}>⭐ {selectedVisit.feedback}/5</span>
                <span style={{ fontSize: '0.64rem', color: 'var(--gold-primary)', cursor: 'pointer', marginLeft: 'auto' }}>View Feedback</span>
              </div>
            </div>

            {/* Visit Timeline Stepper */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFF', marginBottom: '10px' }}>Visit Timeline</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', paddingLeft: '16px' }}>
                <div style={{ position: 'absolute', left: '6px', top: '4px', bottom: '4px', width: '2px', background: 'rgba(16,185,129,0.3)' }} />
                
                {selectedVisit.timeline.map((st, idx) => (
                  <div key={idx} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ position: 'absolute', left: '-15px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', background: st.done ? '#10B981' : 'rgba(255,255,255,0.2)', border: '2px solid #070D18' }} />
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: st.done ? '#FFF' : 'rgba(255,255,255,0.5)' }}>{st.label}</span>
                    <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>{st.detail}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--gold-primary)', fontWeight: 700, marginTop: '8px', cursor: 'pointer' }}>View Full Timeline →</div>
            </div>

            {/* Notes Section */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFF' }}>Notes</span>
                <Edit2 size={12} color="rgba(255,255,255,0.4)" style={{ cursor: 'pointer' }} />
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '10px', borderRadius: '6px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>
                "{selectedVisit.notes}"
                <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>{selectedVisit.notesAuthor}</div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ── BOTTOM ROW: 3 ANALYTICS WIDGETS ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        
        {/* Card 1: Today's Visit Schedule */}
        <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFF' }}>Today's Visit Schedule</div>
              <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)' }}>27 July 2026, Monday</div>
            </div>
            <button style={{ padding: '4px 10px', borderRadius: '5px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--gold-primary)', fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer' }}>View Calendar</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { time: '10:30 AM', name: 'Rohan Sharma', prop: 'Lodha Hinjewadi', status: 'COMPLETED', color: '#10B981' },
              { time: '02:00 PM', name: 'Karan Mehta', prop: 'VTP Blue Waters', status: 'SCHEDULED', color: '#3B82F6' },
              { time: '04:00 PM', name: 'Simran Kaur', prop: 'Godrej Hillside', status: 'SCHEDULED', color: '#3B82F6' },
              { time: '06:30 PM', name: 'Aman Gupta', prop: 'Megapolis Symphony', status: 'SCHEDULED', color: '#3B82F6' },
              { time: '08:00 PM', name: 'Neha Joshi', prop: 'Panchshil Towers', status: 'SCHEDULED', color: '#3B82F6' },
            ].map((st, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', fontSize: '0.7rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={11} color="rgba(255,255,255,0.4)" />
                  <span style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>{st.time}</span>
                  <span style={{ color: '#FFF', fontWeight: 700 }}>{st.name}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.64rem' }}>{st.prop}</span>
                </div>
                <span style={{ fontSize: '0.6rem', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', background: `${st.color}20`, color: st.color }}>{st.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Visit Map (Today) */}
        <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFF' }}>Visit Map <span style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>(Today)</span></div>
            <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><ArrowUpRight size={14} /></button>
          </div>

          {/* Map Graphic Box */}
          <div style={{ width: '100%', height: '140px', background: '#040812', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 1px)', backgroundSize: '12px 12px' }} />
            
            {/* Pinned Locations */}
            <div style={{ position: 'absolute', left: '20%', top: '30%', background: '#10B981', color: '#070D18', width: '20px', height: '20px', borderRadius: '50%', fontSize: '0.7rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px #10B981' }}>1</div>
            <span style={{ position: 'absolute', left: '10%', top: '50%', fontSize: '0.6rem', color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>HINJEWADI</span>

            <div style={{ position: 'absolute', left: '50%', top: '20%', background: '#10B981', color: '#070D18', width: '20px', height: '20px', borderRadius: '50%', fontSize: '0.7rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px #10B981' }}>2</div>
            <span style={{ position: 'absolute', left: '46%', top: '38%', fontSize: '0.6rem', color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>BANER</span>

            <div style={{ position: 'absolute', left: '70%', top: '50%', background: '#3B82F6', color: '#FFF', width: '20px', height: '20px', borderRadius: '50%', fontSize: '0.7rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px #3B82F6' }}>3</div>
            <span style={{ position: 'absolute', left: '68%', top: '68%', fontSize: '0.6rem', color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>WAKAD</span>

            <span style={{ position: 'absolute', right: '10%', bottom: '10%', fontSize: '0.9rem', color: 'rgba(255,255,255,0.15)', fontWeight: 900 }}>PUNE</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.64rem', marginTop: '10px' }}>
            <span style={{ color: '#10B981' }}>● Completed (2)</span>
            <span style={{ color: '#3B82F6' }}>● Scheduled (3)</span>
            <span style={{ color: '#EF4444' }}>● Cancelled (0)</span>
            <span style={{ color: '#94A3B8' }}>● No Show (0)</span>
          </div>
        </div>

        {/* Card 3: Visit Analytics (This Month) */}
        <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFF', marginBottom: '10px' }}>Visit Analytics <span style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>(This Month)</span></div>
          
          <AnalyticsDonut />

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)' }}>Conversion from Site Visit</div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFF' }}>7 <span style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>Deals Created</span></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#10B981', fontFamily: "'Cinzel', serif" }}>38.9%</div>
              <div style={{ fontSize: '0.62rem', color: '#10B981', fontWeight: 600 }}>↑ 6.8% vs last month</div>
            </div>
          </div>
        </div>

      </div>

      {/* ── SCHEDULE VISIT MODAL ── */}
      {isScheduleModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0B1528', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '16px', width: '100%', maxWidth: '500px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={20} color="var(--gold-primary)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#FFF', fontFamily: "'Cinzel', serif" }}>Schedule New Site Visit</h3>
              </div>
              <button onClick={() => setIsScheduleModalOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleScheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>CLIENT / LEAD NAME *</label>
                <input type="text" required placeholder="e.g. Rohan Sharma" value={scheduleForm.leadName} onChange={e => setScheduleForm({ ...scheduleForm, leadName: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.82rem', outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>PHONE NUMBER *</label>
                  <input type="text" required placeholder="+91 9876543210" value={scheduleForm.phone} onChange={e => setScheduleForm({ ...scheduleForm, phone: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.82rem', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>PROPERTY / PROJECT</label>
                  <select value={scheduleForm.propertyName} onChange={e => setScheduleForm({ ...scheduleForm, propertyName: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.82rem', outline: 'none' }}>
                    <option value="Lodha Hinjewadi">Lodha Hinjewadi</option>
                    <option value="VTP Blue Waters">VTP Blue Waters</option>
                    <option value="Godrej Hillside">Godrej Hillside</option>
                    <option value="Megapolis Symphony">Megapolis Symphony</option>
                    <option value="Panchshil Towers">Panchshil Towers</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>DATE *</label>
                  <input type="date" required value={scheduleForm.date} onChange={e => setScheduleForm({ ...scheduleForm, date: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.82rem', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>TIME *</label>
                  <input type="text" required placeholder="10:30 AM" value={scheduleForm.time} onChange={e => setScheduleForm({ ...scheduleForm, time: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.82rem', outline: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>ASSIGNED RM</label>
                  <select value={scheduleForm.rmName} onChange={e => setScheduleForm({ ...scheduleForm, rmName: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.82rem', outline: 'none' }}>
                    <option value="Jyoti Dhale">Jyoti Dhale</option>
                    <option value="Jyoti Jagtap">Jyoti Jagtap</option>
                    <option value="Yash Murkute">Yash Murkute</option>
                    <option value="Rohini K.">Rohini K.</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>UNIT TYPE</label>
                  <input type="text" placeholder="2 BHK, Tower 3" value={scheduleForm.unitType} onChange={e => setScheduleForm({ ...scheduleForm, unitType: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.82rem', outline: 'none' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>VISIT INSTRUCTIONS / NOTES</label>
                <textarea rows="2" value={scheduleForm.notes} onChange={e => setScheduleForm({ ...scheduleForm, notes: e.target.value })} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.82rem', outline: 'none', resize: 'none' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsScheduleModalOpen(false)} style={{ padding: '10px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: 'none', color: '#FFF', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={submitting} style={{ padding: '10px 20px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--gold-primary), #B8860B)', border: 'none', color: '#070D18', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                  {submitting ? 'Scheduling...' : 'Schedule & Sync'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
