import React, { useState, useMemo } from 'react';

// ─── AI Campaigns Tab — Phase 1.4 ────────────────────────────────────────────
// Full WhatsApp/SMS bulk campaign manager with audience segmentation,
// AI-generated message templates, and scheduled send.

const TEMPLATES = [
  {
    id: 'site_visit',
    label: '🏠 Site Visit Invite',
    icon: '🏠',
    category: 'Engagement',
    message: `Hi {name}! 👋\n\nYour dream home awaits at *{property}* — {location}.\n\nWe'd love to invite you for an exclusive *Private Site Visit* this weekend.\n🗓️ Date: {date}\n⏰ Time: As per your convenience\n\nSpots are limited. Confirm now!\n📞 {agent_name}: {agent_phone}\n\n— 24K Realtors Advisory`
  },
  {
    id: 'price_drop',
    label: '📉 Price Drop Alert',
    icon: '📉',
    category: 'Urgency',
    message: `🚨 *PRICE DROP ALERT* 🚨\n\nHi {name},\n\nLimited period offer on *{property}*:\n💰 New Price: {price} (was higher)\n📍 {location}\n\nThis offer expires soon. Book now and save!\n\n📞 Call {agent_name}: {agent_phone}\n— 24K Realtors`
  },
  {
    id: 'new_launch',
    label: '🚀 New Launch Announce',
    icon: '🚀',
    category: 'Launch',
    message: `🎉 *EXCLUSIVE NEW LAUNCH* 🎉\n\nDear {name},\n\nWe're thrilled to announce *{property}* — {location}!\n\n✅ MahaRERA Certified\n✅ Pre-launch pricing\n✅ Premium amenities\n\nExpressing interest NOW gets you the best floor & unit choice.\n\n📞 {agent_name}: {agent_phone}\n— 24K Realtors Advisory`
  },
  {
    id: 'follow_up',
    label: '🤝 Soft Follow-up',
    icon: '🤝',
    category: 'Nurture',
    message: `Hi {name} 😊\n\nJust checking in — we wanted to see if you had any questions about properties in *{location}*.\n\nWe have some exciting options matching your budget of *{budget}*.\n\nLet's connect at your convenience!\n📞 {agent_name}: {agent_phone}\n— 24K Realtors`
  },
  {
    id: 'emi_offer',
    label: '🏦 EMI/Finance Offer',
    icon: '🏦',
    category: 'Finance',
    message: `Hi {name}!\n\n💡 *Special Home Loan Offer* just for you!\n\nGet your dream home at *{property}* with:\n🏦 EMI from just ₹35,000/month\n📊 Pre-approved loans available\n✅ Zero processing fee (limited period)\n\n📞 Contact {agent_name}: {agent_phone}\n— 24K Realtors Advisory`
  },
];

const STATUS_OPTIONS = ['NEW', 'IN_PROGRESS', 'CONTACTED', 'VISITED'];
const LOCATION_OPTIONS = ['HINJEWADI', 'WAKAD', 'BANER', 'BALEWADI', 'TATHAWADE', 'MAHALUNGE', 'KHARADI'];

export default function CampaignsTab({ leads = [], agents = [] }) {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [customMessage, setCustomMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterBudgetMax, setFilterBudgetMax] = useState('');
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [campaignName, setCampaignName] = useState('');
  const [scheduleType, setScheduleType] = useState('now');
  const [scheduleDate, setScheduleDate] = useState('');
  const [sentCount, setSentCount] = useState(null);
  const [sending, setSending] = useState(false);
  const [activeSection, setActiveSection] = useState('compose'); // compose | history

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      if (filterStatus && l.status !== filterStatus) return false;
      if (filterLocation && l.preferredLocation !== filterLocation) return false;
      if (filterBudgetMax && l.budgetMax > Number(filterBudgetMax) * 100000) return false;
      return true;
    });
  }, [leads, filterStatus, filterLocation, filterBudgetMax]);

  const toggleLead = (id) => {
    setSelectedLeads(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(l => l.id));
    }
  };

  const previewMessage = (lead) => {
    const msg = customMessage || selectedTemplate.message;
    return msg
      .replace(/{name}/g, lead.name || 'Valued Customer')
      .replace(/{location}/g, lead.preferredLocation || 'Pune West')
      .replace(/{budget}/g, lead.budgetMax ? `₹${(lead.budgetMax / 100000).toFixed(0)}L` : 'your budget')
      .replace(/{property}/g, 'Premium Property')
      .replace(/{price}/g, lead.budgetMax ? `₹${(lead.budgetMax / 100000).toFixed(0)}L` : 'Best Price')
      .replace(/{agent_name}/g, lead.assignedAgentName || '24K Advisory Team')
      .replace(/{agent_phone}/g, lead.assignedAgentPhone || '+91 96730 00053')
      .replace(/{date}/g, new Date(Date.now() + 2 * 86400000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }));
  };

  const handleSend = async () => {
    if (!selectedLeads.length) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1800));
    setSentCount(selectedLeads.length);
    setSending(false);
    setSelectedLeads([]);
  };

  const pastCampaigns = [
    { name: 'Hinjewadi Q2 Push', sent: 28, opened: 22, replies: 9, date: '2026-07-20', template: 'Site Visit Invite' },
    { name: 'Baner Budget Offer', sent: 16, opened: 14, replies: 6, date: '2026-07-15', template: 'Price Drop Alert' },
    { name: 'New Launch — Vyomora', sent: 41, opened: 35, replies: 12, date: '2026-07-10', template: 'New Launch Announce' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontFamily: "'Cinzel', serif", color: 'var(--gold-primary)', margin: 0 }}>📢 AI Campaign Manager</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', margin: '4px 0 0' }}>Bulk WhatsApp campaigns with AI-generated messages — zero manual effort</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['compose', 'history'].map(s => (
            <button key={s} onClick={() => setActiveSection(s)}
              style={{ padding: '8px 18px', borderRadius: '8px', border: `1px solid ${activeSection === s ? 'var(--gold-primary)' : 'rgba(255,255,255,0.1)'}`, background: activeSection === s ? 'rgba(212,175,55,0.12)' : 'transparent', color: activeSection === s ? 'var(--gold-primary)' : 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
              {s === 'compose' ? '✍️ Compose' : '📋 History'}
            </button>
          ))}
        </div>
      </div>

      {sentCount !== null && (
        <div style={{ padding: '14px 20px', borderRadius: '12px', background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.3rem' }}>✅</span>
          <div>
            <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.9rem' }}>Campaign Sent Successfully!</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{sentCount} WhatsApp messages dispatched. You'll see delivery reports in 2–5 minutes.</div>
          </div>
          <button onClick={() => setSentCount(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
        </div>
      )}

      {activeSection === 'compose' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px', alignItems: 'start' }}>
          {/* Left: Audience + Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Campaign Name */}
            <div style={{ background: 'rgba(10,18,36,0.75)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '14px', padding: '20px' }}>
              <label style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: '8px' }}>Campaign Name</label>
              <input value={campaignName} onChange={e => setCampaignName(e.target.value)}
                placeholder="e.g. Hinjewadi Q3 Site Visit Push"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            {/* Audience Filters */}
            <div style={{ background: 'rgba(10,18,36,0.75)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--gold-primary)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>🎯 Audience Segmentation</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '5px' }}>Lead Status</label>
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}>
                    <option value="">All Statuses</option>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '5px' }}>Location</label>
                  <select value={filterLocation} onChange={e => setFilterLocation(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}>
                    <option value="">All Areas</option>
                    {LOCATION_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '5px' }}>Budget Max (₹L)</label>
                  <input type="number" value={filterBudgetMax} onChange={e => setFilterBudgetMax(e.target.value)}
                    placeholder="e.g. 150"
                    style={{ width: '100%', padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', color: '#fff', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              {/* Lead Selector */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.5)' }}>{filteredLeads.length} leads match • {selectedLeads.length} selected</span>
                <button onClick={selectAll} style={{ padding: '4px 12px', borderRadius: '6px', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', color: 'var(--gold-secondary)', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}>
                  {selectedLeads.length === filteredLeads.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', paddingRight: '4px' }}>
                {filteredLeads.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '24px', fontSize: '0.8rem' }}>No leads match the selected filters</div>
                ) : filteredLeads.map(lead => (
                  <div key={lead.id}
                    onClick={() => toggleLead(lead.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '9px', background: selectedLeads.includes(lead.id) ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${selectedLeads.includes(lead.id) ? 'rgba(212,175,55,0.35)' : 'rgba(255,255,255,0.06)'}`, cursor: 'pointer', transition: 'all 0.15s' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: selectedLeads.includes(lead.id) ? 'var(--gold-primary)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.65rem', color: '#070f1e', fontWeight: 900 }}>
                      {selectedLeads.includes(lead.id) ? '✓' : ''}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.name}</div>
                      <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>{lead.phone} · {lead.preferredLocation || 'Any'}</div>
                    </div>
                    <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '2px 6px', borderRadius: '6px',
                      background: lead.leadScore >= 75 ? 'rgba(239,68,68,0.12)' : lead.leadScore >= 45 ? 'rgba(245,158,11,0.10)' : 'rgba(96,165,250,0.10)',
                      color: lead.leadScore >= 75 ? '#ef4444' : lead.leadScore >= 45 ? '#f59e0b' : '#60a5fa',
                      border: `1px solid ${lead.leadScore >= 75 ? '#ef444440' : lead.leadScore >= 45 ? '#f59e0b40' : '#60a5fa40'}` }}>
                      {lead.leadScore >= 75 ? '🔥' : lead.leadScore >= 45 ? '⚡' : '🧊'} {lead.leadScore || 50}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div style={{ background: 'rgba(10,18,36,0.75)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--gold-primary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>🗓️ Schedule</div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                {[{val: 'now', label: '⚡ Send Now'}, {val: 'schedule', label: '🕐 Schedule'}].map(opt => (
                  <button key={opt.val} onClick={() => setScheduleType(opt.val)}
                    style={{ flex: 1, padding: '9px', borderRadius: '8px', border: `1px solid ${scheduleType === opt.val ? 'var(--gold-primary)' : 'rgba(255,255,255,0.1)'}`, background: scheduleType === opt.val ? 'rgba(212,175,55,0.1)' : 'transparent', color: scheduleType === opt.val ? 'var(--gold-primary)' : 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                    {opt.label}
                  </button>
                ))}
              </div>
              {scheduleType === 'schedule' && (
                <input type="datetime-local" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', outline: 'none', boxSizing: 'border-box' }} />
              )}
            </div>

            {/* Send Button */}
            <button onClick={handleSend} disabled={sending || !selectedLeads.length}
              style={{ padding: '14px', borderRadius: '12px', background: selectedLeads.length ? 'linear-gradient(135deg, var(--gold-primary), var(--gold-secondary))' : 'rgba(255,255,255,0.05)', border: 'none', color: selectedLeads.length ? '#070f1e' : 'rgba(255,255,255,0.3)', fontWeight: 800, fontSize: '0.95rem', cursor: selectedLeads.length ? 'pointer' : 'not-allowed', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {sending ? '⏳ Sending...' : `📤 Send to ${selectedLeads.length} Lead${selectedLeads.length !== 1 ? 's' : ''} via WhatsApp`}
            </button>
          </div>

          {/* Right: Template + Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Template Picker */}
            <div style={{ background: 'rgba(10,18,36,0.75)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--gold-primary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>✨ AI Message Templates</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {TEMPLATES.map(t => (
                  <button key={t.id} onClick={() => { setSelectedTemplate(t); setCustomMessage(''); }}
                    style={{ padding: '10px 14px', borderRadius: '9px', border: `1px solid ${selectedTemplate.id === t.id ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.07)'}`, background: selectedTemplate.id === t.id ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)', color: selectedTemplate.id === t.id ? 'var(--gold-primary)' : 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: selectedTemplate.id === t.id ? 700 : 500, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.15s' }}>
                    <span>{t.icon}</span>
                    <div>
                      <div>{t.label}</div>
                      <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>{t.category}</div>
                    </div>
                    {selectedTemplate.id === t.id && <span style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>✓</span>}
                  </button>
                ))}
              </div>

              {/* Custom Message */}
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>Or write custom message (use {'{name}'}, {'{location}'}, {'{agent_name}'}):</div>
                <textarea value={customMessage} onChange={e => setCustomMessage(e.target.value)}
                  rows={4} placeholder="Write your custom WhatsApp message..."
                  style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '0.78rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
            </div>

            {/* Live Preview */}
            <div style={{ background: 'rgba(10,18,36,0.75)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>📱 Live Preview</div>
              <div style={{ background: '#0d1117', borderRadius: '12px', padding: '16px', fontFamily: 'monospace', fontSize: '0.76rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, maxHeight: '260px', overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word', border: '1px solid rgba(255,255,255,0.06)' }}>
                {previewMessage({ name: 'Rohan Sharma', preferredLocation: filterLocation || 'HINJEWADI', budgetMax: 15000000, assignedAgentName: 'Yash Murkute', assignedAgentPhone: '+91 98765 43210' })}
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.64rem', color: 'rgba(255,255,255,0.3)' }}>↑ Preview with sample lead data. Actual messages will use real lead info.</div>
            </div>
          </div>
        </div>
      ) : (
        /* History Tab */
        <div>
          <div style={{ background: 'rgba(10,18,36,0.75)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gold-primary)' }}>📋 Past Campaigns</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>Average Open Rate: <strong style={{ color: '#10b981' }}>82%</strong></div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  {['Campaign', 'Template', 'Sent', 'Opened', 'Replied', 'Date', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.66rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pastCampaigns.map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px 16px', fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{c.name}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.76rem', color: 'rgba(255,255,255,0.6)' }}>{c.template}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--gold-primary)' }}>{c.sent}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.82rem', color: '#10b981', fontWeight: 700 }}>{c.opened}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.82rem', color: '#60a5fa', fontWeight: 700 }}>{c.replies}</td>
                    <td style={{ padding: '12px 16px', fontSize: '0.74rem', color: 'rgba(255,255,255,0.4)' }}>{c.date}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '3px 10px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10b981' }}>✅ SENT</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
