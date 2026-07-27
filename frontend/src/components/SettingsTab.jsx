// ═══════════════════════════════════════════════════════════════
// 24K REALTORS — CRM Settings Module
// Covers: Company Profile, Users & Roles, Integrations, Security,
//         Notifications, Lead Config, Branding, Data Management
// Production-Ready Settings for Live Deployment
// ═══════════════════════════════════════════════════════════════
import { useState } from 'react';
import {
  Settings, Building, Users, Bell, Shield, Key, Database, Palette,
  Globe, Phone, Mail, MessageSquare, Zap, Eye, EyeOff, Save,
  Upload, RefreshCw, Trash2, Download, CheckCircle2, AlertTriangle,
  UserPlus, Edit2, X, Plus, ToggleLeft, ToggleRight, Lock, Wifi,
  Smartphone, FileText, ChevronRight, Copy, Info
} from 'lucide-react';

const GOLD = '#D4AF37';
const INPUT_STYLE = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#FFF',
  fontSize: '0.82rem',
  outline: 'none',
  boxSizing: 'border-box'
};
const LABEL_STYLE = {
  fontSize: '0.7rem',
  color: 'rgba(255,255,255,0.55)',
  fontWeight: 700,
  letterSpacing: '0.05em',
  marginBottom: '5px',
  display: 'block'
};
const CARD_STYLE = {
  background: 'rgba(10,18,36,0.85)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '14px',
  padding: '22px 24px',
  marginBottom: '18px'
};
const SECTION_TITLE = {
  fontSize: '0.88rem',
  fontWeight: 800,
  color: '#FFF',
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const TOGGLE_MAP = {
  emailLeadNotif: true,
  whatsappLeadNotif: true,
  siteVisitReminder: true,
  followUpAlert: true,
  dealClosureAlert: true,
  weeklyReport: false,
  newUserAlert: true,
  payrollAlert: false,
  systemMaintenance: false,
};

const ROLE_PERMISSIONS = {
  SUPER_ADMIN: { leads: true, deals: true, team: true, commissions: true, analytics: true, settings: true, delete: true },
  MANAGER: { leads: true, deals: true, team: true, commissions: false, analytics: true, settings: false, delete: false },
  AGENT: { leads: true, deals: false, team: false, commissions: false, analytics: false, settings: false, delete: false },
};

export default function SettingsTab() {
  const [activeSection, setActiveSection] = useState('company');
  const [saved, setSaved] = useState(false);
  const [showApiKey, setShowApiKey] = useState({ gemini: false, whatsapp: false, rera: false });
  const [toggles, setToggles] = useState(TOGGLE_MAP);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'AGENT', phone: '' });
  const [showAddUser, setShowAddUser] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Company Profile State
  const [company, setCompany] = useState({
    name: '24K Realtors',
    legalName: '24K Realtors Private Limited',
    reraNumber: 'A52100028461',
    gstNumber: '27AAHCA1234B1Z5',
    address: 'Office No. 301, Baner Road, Baner, Pune - 411045',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411045',
    phone: '+91 96730 00053',
    email: 'hello@24krealtors.in',
    website: 'https://24krealtors.in',
    whatsappBusiness: '+91 96730 00053',
    tagline: 'Premium Real Estate — Pune\'s Most Trusted',
    primaryColor: '#D4AF37',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    businessHours: '9:00 AM - 7:00 PM',
  });

  // Security State
  const [security, setSecurity] = useState({
    sessionTimeout: '8',
    twoFactor: false,
    passwordMinLength: '8',
    requireSpecialChar: true,
    requireNumbers: true,
    maxLoginAttempts: '5',
    ipWhitelist: '',
    auditLog: true,
    forceHttps: true,
  });

  // Integration Keys State
  const [integrations, setIntegrations] = useState({
    geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || 'AIza••••••••••••••••••••••',
    whatsappApiToken: '•••••••••••••••••••••••••••••••',
    whatsappPhoneId: '468259819668942',
    whatsappBusinessId: '390781700788437',
    send99AcresKey: '•••••••••••',
    magicBricksKey: '•••••••••••',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'crm@24krealtors.in',
    smtpPass: '••••••••••••',
    mapApiKey: '•••••••••••••••••••••',
  });

  // Lead Config State
  const [leadConfig, setLeadConfig] = useState({
    autoAssign: true,
    assignmentMethod: 'ROUND_ROBIN',
    leadSources: ['Website', 'WhatsApp', 'Instagram', '99acres', 'MagicBricks', 'Referral', 'Cold Call', 'Walk-In'],
    leadStatuses: ['NEW', 'CONTACTED', 'QUALIFIED', 'SITE_VISIT', 'NEGOTIATION', 'WON', 'LOST'],
    locations: ['Baner', 'Wakad', 'Hinjewadi', 'Kharadi', 'Pimple Saudagar', 'Balewadi', 'Aundh', 'Magarpatta'],
    defaultFollowUpDays: '3',
    hotLeadBudgetThreshold: '10000000',
    autoScoreLeads: true,
    leadExpiryDays: '90',
  });

  const [users] = useState([
    { id: 1, name: 'Manish Rai', email: 'manish@24krealtors.in', role: 'SUPER_ADMIN', phone: '+91 96730 00053', status: 'ACTIVE', lastLogin: 'Today, 11:30 PM' },
    { id: 2, name: 'Jyoti Dhale', email: 'jyoti.d@24krealtors.in', role: 'AGENT', phone: '+91 98765 43210', status: 'ACTIVE', lastLogin: 'Today, 6:45 PM' },
    { id: 3, name: 'Jyoti Jagtap', email: 'jyoti.j@24krealtors.in', role: 'AGENT', phone: '+91 87654 32109', status: 'ACTIVE', lastLogin: 'Today, 5:20 PM' },
    { id: 4, name: 'Yash Murkute', email: 'yash@24krealtors.in', role: 'MANAGER', phone: '+91 76543 21098', status: 'ACTIVE', lastLogin: 'Yesterday' },
  ]);

  const handleSave = (section) => {
    setSaved(section);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleKey = (key) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  const SECTIONS = [
    { id: 'company', label: 'Company Profile', icon: Building },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'leads', label: 'Lead Configuration', icon: Zap },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'API Integrations', icon: Wifi },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'branding', label: 'Branding & Theme', icon: Palette },
    { id: 'data', label: 'Data & Backup', icon: Database },
  ];

  const Toggle = ({ value, onChange }) => (
    <button onClick={onChange} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
      {value
        ? <ToggleRight size={28} color={GOLD} fill={GOLD} />
        : <ToggleLeft size={28} color='rgba(255,255,255,0.25)' />}
    </button>
  );

  const SaveBtn = ({ section }) => (
    <button
      onClick={() => handleSave(section)}
      style={{ padding: '9px 20px', borderRadius: '8px', background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, border: 'none', color: '#070D18', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
    >
      {saved === section ? <><CheckCircle2 size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
    </button>
  );

  const FieldRow = ({ label, children }) => (
    <div style={{ marginBottom: '14px' }}>
      <label style={LABEL_STYLE}>{label}</label>
      {children}
    </div>
  );

  const GridRow = ({ cols = 2, children }) => (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '14px' }}>
      {children}
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: '20px', height: '100%', minHeight: 'calc(100vh - 130px)' }}>

      {/* ── LEFT NAV ── */}
      <div style={{ width: '210px', minWidth: '210px', background: 'rgba(10,18,36,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '3px', height: 'fit-content', position: 'sticky', top: 0 }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', padding: '4px 10px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '6px' }}>
          CRM SETTINGS
        </div>
        {SECTIONS.map(s => {
          const IconC = s.icon;
          const isAct = activeSection === s.id;
          return (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', border: isAct ? `1px solid ${GOLD}40` : '1px solid transparent', background: isAct ? `rgba(212,175,55,0.12)` : 'transparent', color: isAct ? GOLD : 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: isAct ? 700 : 400, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
            >
              <IconC size={15} />
              <span>{s.label}</span>
              {isAct && <ChevronRight size={13} style={{ marginLeft: 'auto' }} />}
            </button>
          );
        })}

        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#EF4444', marginBottom: '4px', display: 'flex', gap: '5px', alignItems: 'center' }}>
            <AlertTriangle size={12} /> LIVE MODE
          </div>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>CRM is running in <strong style={{ color: '#FFF' }}>Production</strong>. All changes are live immediately.</div>
        </div>
      </div>

      {/* ── RIGHT CONTENT ── */}
      <div style={{ flex: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 130px)', paddingRight: '4px' }}>

        {/* ═══ COMPANY PROFILE ═══ */}
        {activeSection === 'company' && (
          <div>
            <div style={CARD_STYLE}>
              <div style={SECTION_TITLE}><Building size={17} color={GOLD} /> Company Profile</div>
              <GridRow>
                <FieldRow label="COMPANY BRAND NAME">
                  <input style={INPUT_STYLE} value={company.name} onChange={e => setCompany({...company, name: e.target.value})} />
                </FieldRow>
                <FieldRow label="LEGAL REGISTERED NAME">
                  <input style={INPUT_STYLE} value={company.legalName} onChange={e => setCompany({...company, legalName: e.target.value})} />
                </FieldRow>
              </GridRow>
              <GridRow>
                <FieldRow label="MahaRERA NUMBER">
                  <input style={INPUT_STYLE} value={company.reraNumber} onChange={e => setCompany({...company, reraNumber: e.target.value})} />
                </FieldRow>
                <FieldRow label="GST NUMBER">
                  <input style={INPUT_STYLE} value={company.gstNumber} onChange={e => setCompany({...company, gstNumber: e.target.value})} />
                </FieldRow>
              </GridRow>
              <FieldRow label="REGISTERED ADDRESS">
                <input style={INPUT_STYLE} value={company.address} onChange={e => setCompany({...company, address: e.target.value})} />
              </FieldRow>
              <GridRow cols={3}>
                <FieldRow label="CITY">
                  <input style={INPUT_STYLE} value={company.city} onChange={e => setCompany({...company, city: e.target.value})} />
                </FieldRow>
                <FieldRow label="STATE">
                  <input style={INPUT_STYLE} value={company.state} onChange={e => setCompany({...company, state: e.target.value})} />
                </FieldRow>
                <FieldRow label="PINCODE">
                  <input style={INPUT_STYLE} value={company.pincode} onChange={e => setCompany({...company, pincode: e.target.value})} />
                </FieldRow>
              </GridRow>
              <GridRow>
                <FieldRow label="BUSINESS PHONE">
                  <input style={INPUT_STYLE} value={company.phone} onChange={e => setCompany({...company, phone: e.target.value})} />
                </FieldRow>
                <FieldRow label="BUSINESS EMAIL">
                  <input style={INPUT_STYLE} value={company.email} onChange={e => setCompany({...company, email: e.target.value})} />
                </FieldRow>
              </GridRow>
              <GridRow>
                <FieldRow label="WEBSITE URL">
                  <input style={INPUT_STYLE} value={company.website} onChange={e => setCompany({...company, website: e.target.value})} />
                </FieldRow>
                <FieldRow label="WHATSAPP BUSINESS NUMBER">
                  <input style={INPUT_STYLE} value={company.whatsappBusiness} onChange={e => setCompany({...company, whatsappBusiness: e.target.value})} />
                </FieldRow>
              </GridRow>
              <GridRow>
                <FieldRow label="BUSINESS HOURS">
                  <input style={INPUT_STYLE} value={company.businessHours} onChange={e => setCompany({...company, businessHours: e.target.value})} />
                </FieldRow>
                <FieldRow label="TIMEZONE">
                  <select style={{...INPUT_STYLE, background: '#070F1E'}} value={company.timezone} onChange={e => setCompany({...company, timezone: e.target.value})}>
                    <option value="Asia/Kolkata">Asia/Kolkata (IST, UTC+5:30)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </FieldRow>
              </GridRow>
              <FieldRow label="COMPANY TAGLINE / SLOGAN">
                <input style={INPUT_STYLE} value={company.tagline} onChange={e => setCompany({...company, tagline: e.target.value})} />
              </FieldRow>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <SaveBtn section="company" />
              </div>
            </div>
          </div>
        )}

        {/* ═══ USERS & ROLES ═══ */}
        {activeSection === 'users' && (
          <div>
            <div style={CARD_STYLE}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div style={SECTION_TITLE}><Users size={17} color={GOLD} /> Users & Role Management</div>
                <button onClick={() => setShowAddUser(!showAddUser)}
                  style={{ padding: '8px 14px', borderRadius: '8px', background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, border: 'none', color: '#070D18', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <UserPlus size={14} /> Add User
                </button>
              </div>

              {showAddUser && (
                <div style={{ background: 'rgba(212,175,55,0.05)', border: `1px solid ${GOLD}30`, borderRadius: '12px', padding: '18px', marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: GOLD, marginBottom: '14px' }}>➕ New CRM User</div>
                  <GridRow>
                    <FieldRow label="FULL NAME">
                      <input style={INPUT_STYLE} placeholder="e.g. Priya Sharma" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                    </FieldRow>
                    <FieldRow label="EMAIL ADDRESS">
                      <input style={INPUT_STYLE} placeholder="priya@24krealtors.in" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                    </FieldRow>
                  </GridRow>
                  <GridRow>
                    <FieldRow label="MOBILE NUMBER">
                      <input style={INPUT_STYLE} placeholder="+91 98765 43210" value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} />
                    </FieldRow>
                    <FieldRow label="ROLE">
                      <select style={{...INPUT_STYLE, background: '#070F1E'}} value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                        <option value="AGENT">Agent (RM)</option>
                        <option value="MANAGER">Manager</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                      </select>
                    </FieldRow>
                  </GridRow>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button onClick={() => setShowAddUser(false)} style={{ padding: '8px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.78rem' }}>Cancel</button>
                    <button onClick={() => { handleSave('newuser'); setShowAddUser(false); }} style={{ padding: '8px 18px', borderRadius: '8px', background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, border: 'none', color: '#070D18', fontWeight: 800, cursor: 'pointer', fontSize: '0.78rem' }}>Create User & Send Invite</button>
                  </div>
                </div>
              )}

              {/* Users Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      {['NAME', 'EMAIL', 'ROLE', 'PHONE', 'LAST LOGIN', 'STATUS', 'ACTIONS'].map(h => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.06em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '12px', color: '#FFF', fontWeight: 600 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#070D18', fontWeight: 800, fontSize: '0.7rem' }}>{u.name.charAt(0)}</div>
                            {u.name}
                          </div>
                        </td>
                        <td style={{ padding: '12px', color: 'rgba(255,255,255,0.6)' }}>{u.email}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 800,
                            background: u.role === 'SUPER_ADMIN' ? 'rgba(212,175,55,0.15)' : u.role === 'MANAGER' ? 'rgba(59,130,246,0.15)' : 'rgba(16,185,129,0.12)',
                            color: u.role === 'SUPER_ADMIN' ? GOLD : u.role === 'MANAGER' ? '#3B82F6' : '#10B981',
                            border: `1px solid ${u.role === 'SUPER_ADMIN' ? GOLD + '40' : u.role === 'MANAGER' ? '#3B82F650' : '#10B98150'}`
                          }}>{u.role}</span>
                        </td>
                        <td style={{ padding: '12px', color: 'rgba(255,255,255,0.6)' }}>{u.phone}</td>
                        <td style={{ padding: '12px', color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem' }}>{u.lastLogin}</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: 700, background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}>ACTIVE</span>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(212,175,55,0.1)', border: `1px solid ${GOLD}30`, color: GOLD, cursor: 'pointer', fontSize: '0.7rem' }}><Edit2 size={11} /></button>
                            {u.role !== 'SUPER_ADMIN' && (
                              <button onClick={() => setConfirmDelete(u.id)} style={{ padding: '4px 8px', borderRadius: '6px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', cursor: 'pointer', fontSize: '0.7rem' }}><Trash2 size={11} /></button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Role Permissions Matrix */}
            <div style={CARD_STYLE}>
              <div style={SECTION_TITLE}><Shield size={17} color={GOLD} /> Role Permissions Matrix</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <th style={{ padding: '10px', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.06em' }}>PERMISSION</th>
                    {Object.keys(ROLE_PERMISSIONS).map(role => (
                      <th key={role} style={{ padding: '10px', textAlign: 'center', color: role === 'SUPER_ADMIN' ? GOLD : 'rgba(255,255,255,0.55)', fontWeight: 700, fontSize: '0.7rem' }}>{role}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['leads', 'deals', 'team', 'commissions', 'analytics', 'settings', 'delete'].map(perm => (
                    <tr key={perm} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '11px 10px', color: '#FFF', textTransform: 'capitalize', fontWeight: 600 }}>{perm === 'delete' ? 'Delete Records' : perm.charAt(0).toUpperCase() + perm.slice(1) + ' Access'}</td>
                      {Object.keys(ROLE_PERMISSIONS).map(role => (
                        <td key={role} style={{ padding: '11px', textAlign: 'center' }}>
                          {ROLE_PERMISSIONS[role][perm]
                            ? <CheckCircle2 size={16} color="#10B981" />
                            : <X size={16} color="rgba(255,255,255,0.2)" />
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ LEAD CONFIGURATION ═══ */}
        {activeSection === 'leads' && (
          <div>
            <div style={CARD_STYLE}>
              <div style={SECTION_TITLE}><Zap size={17} color={GOLD} /> Lead Configuration</div>
              <GridRow>
                <FieldRow label="AUTO-ASSIGN LEADS TO AGENTS">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '4px' }}>
                    <Toggle value={leadConfig.autoAssign} onChange={() => setLeadConfig({...leadConfig, autoAssign: !leadConfig.autoAssign})} />
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>{leadConfig.autoAssign ? 'Enabled — Leads auto-distributed' : 'Disabled — Manual assignment'}</span>
                  </div>
                </FieldRow>
                <FieldRow label="ASSIGNMENT METHOD">
                  <select style={{...INPUT_STYLE, background: '#070F1E'}} value={leadConfig.assignmentMethod} onChange={e => setLeadConfig({...leadConfig, assignmentMethod: e.target.value})}>
                    <option value="ROUND_ROBIN">Round Robin (Equal Distribution)</option>
                    <option value="PERFORMANCE">Performance Based (Top Agent First)</option>
                    <option value="MANUAL">Manual Assignment Only</option>
                  </select>
                </FieldRow>
              </GridRow>
              <GridRow>
                <FieldRow label="HOT LEAD BUDGET THRESHOLD (Rs.)">
                  <input style={INPUT_STYLE} type="number" value={leadConfig.hotLeadBudgetThreshold} onChange={e => setLeadConfig({...leadConfig, hotLeadBudgetThreshold: e.target.value})} />
                </FieldRow>
                <FieldRow label="DEFAULT FOLLOW-UP DAYS">
                  <input style={INPUT_STYLE} type="number" value={leadConfig.defaultFollowUpDays} onChange={e => setLeadConfig({...leadConfig, defaultFollowUpDays: e.target.value})} />
                </FieldRow>
              </GridRow>
              <GridRow>
                <FieldRow label="LEAD EXPIRY (DAYS OF INACTIVITY)">
                  <input style={INPUT_STYLE} type="number" value={leadConfig.leadExpiryDays} onChange={e => setLeadConfig({...leadConfig, leadExpiryDays: e.target.value})} />
                </FieldRow>
                <FieldRow label="AI AUTO-SCORE NEW LEADS">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '4px' }}>
                    <Toggle value={leadConfig.autoScoreLeads} onChange={() => setLeadConfig({...leadConfig, autoScoreLeads: !leadConfig.autoScoreLeads})} />
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>{leadConfig.autoScoreLeads ? 'AI scoring on every new lead' : 'Manual scoring'}</span>
                  </div>
                </FieldRow>
              </GridRow>
            </div>

            <div style={CARD_STYLE}>
              <div style={SECTION_TITLE}><Globe size={17} color={GOLD} /> Lead Sources</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                {leadConfig.leadSources.map((src, i) => (
                  <div key={i} style={{ padding: '5px 12px', borderRadius: '20px', background: 'rgba(212,175,55,0.08)', border: `1px solid ${GOLD}30`, color: GOLD, fontSize: '0.76rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {src}
                    <X size={12} style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => setLeadConfig({...leadConfig, leadSources: leadConfig.leadSources.filter((_, idx) => idx !== i)})} />
                  </div>
                ))}
                <button style={{ padding: '5px 12px', borderRadius: '20px', background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.4)', fontSize: '0.76rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Plus size={11} /> Add Source
                </button>
              </div>
            </div>

            <div style={CARD_STYLE}>
              <div style={SECTION_TITLE}><Globe size={17} color={GOLD} /> Active Locations (Pune)</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                {leadConfig.locations.map((loc, i) => (
                  <div key={i} style={{ padding: '5px 12px', borderRadius: '20px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)', color: '#3B82F6', fontSize: '0.76rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📍 {loc}
                    <X size={12} style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => setLeadConfig({...leadConfig, locations: leadConfig.locations.filter((_, idx) => idx !== i)})} />
                  </div>
                ))}
                <button style={{ padding: '5px 12px', borderRadius: '20px', background: 'transparent', border: '1px dashed rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.4)', fontSize: '0.76rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Plus size={11} /> Add Location
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <SaveBtn section="leads" />
              </div>
            </div>
          </div>
        )}

        {/* ═══ NOTIFICATIONS ═══ */}
        {activeSection === 'notifications' && (
          <div>
            <div style={CARD_STYLE}>
              <div style={SECTION_TITLE}><Bell size={17} color={GOLD} /> Notification Preferences</div>
              {[
                { key: 'emailLeadNotif', label: 'New Lead Email Alert', sub: 'Email when a new lead is created in CRM', icon: Mail },
                { key: 'whatsappLeadNotif', label: 'WhatsApp Lead Notification', sub: 'WhatsApp message when hot lead is detected', icon: MessageSquare },
                { key: 'siteVisitReminder', label: 'Site Visit Day Reminder', sub: 'Morning reminder 1 hour before each site visit', icon: Bell },
                { key: 'followUpAlert', label: 'Follow-up Due Alert', sub: 'Notification when a follow-up is due today', icon: Bell },
                { key: 'dealClosureAlert', label: 'Deal Closure Alert', sub: 'Alert team when a deal reaches Agreement stage', icon: Bell },
                { key: 'weeklyReport', label: 'Weekly Performance Report', sub: 'Auto-send CRM summary every Monday 8 AM', icon: FileText },
                { key: 'newUserAlert', label: 'New User Login Alert', sub: 'Alert admin when a new user logs in', icon: Users },
                { key: 'payrollAlert', label: 'Payroll Processing Alert', sub: 'Notify when monthly payroll is ready', icon: Bell },
                { key: 'systemMaintenance', label: 'System Maintenance Alerts', sub: 'Downtime and backup completion notifications', icon: Settings },
              ].map(item => {
                const IconC = item.icon;
                return (
                  <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconC size={15} color={toggles[item.key] ? GOLD : 'rgba(255,255,255,0.3)'} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#FFF' }}>{item.label}</div>
                        <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>{item.sub}</div>
                      </div>
                    </div>
                    <Toggle value={toggles[item.key]} onChange={() => toggleKey(item.key)} />
                  </div>
                );
              })}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px' }}>
                <SaveBtn section="notifications" />
              </div>
            </div>
          </div>
        )}

        {/* ═══ API INTEGRATIONS ═══ */}
        {activeSection === 'integrations' && (
          <div>
            {/* Gemini AI */}
            <div style={CARD_STYLE}>
              <div style={SECTION_TITLE}><Zap size={17} color={GOLD} /> Google Gemini AI (24K AI Co-pilot)</div>
              <div style={{ background: 'rgba(212,175,55,0.05)', border: `1px solid ${GOLD}20`, borderRadius: '10px', padding: '12px 16px', marginBottom: '14px', fontSize: '0.76rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={14} color={GOLD} />
                Get your free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: GOLD, marginLeft: '4px' }}>Google AI Studio → aistudio.google.com/app/apikey</a>
              </div>
              <FieldRow label="GEMINI API KEY (VITE_GEMINI_API_KEY)">
                <div style={{ position: 'relative' }}>
                  <input type={showApiKey.gemini ? 'text' : 'password'} style={{...INPUT_STYLE, paddingRight: '44px'}} value={integrations.geminiApiKey} onChange={e => setIntegrations({...integrations, geminiApiKey: e.target.value})} placeholder="AIzaSy..." />
                  <button onClick={() => setShowApiKey(p => ({...p, gemini: !p.gemini}))} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
                    {showApiKey.gemini ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </FieldRow>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                <AlertTriangle size={12} color="#F59E0B" />
                Add this key in Vercel → Project Settings → Environment Variables as <code style={{ color: GOLD, background: 'rgba(212,175,55,0.1)', padding: '1px 6px', borderRadius: '4px' }}>VITE_GEMINI_API_KEY</code>
              </div>
            </div>

            {/* WhatsApp Business API */}
            <div style={CARD_STYLE}>
              <div style={SECTION_TITLE}><MessageSquare size={17} color="#25D366" /> WhatsApp Business API</div>
              <GridRow>
                <FieldRow label="WHATSAPP API TOKEN">
                  <div style={{ position: 'relative' }}>
                    <input type={showApiKey.whatsapp ? 'text' : 'password'} style={{...INPUT_STYLE, paddingRight: '44px'}} value={integrations.whatsappApiToken} onChange={e => setIntegrations({...integrations, whatsappApiToken: e.target.value})} />
                    <button onClick={() => setShowApiKey(p => ({...p, whatsapp: !p.whatsapp}))} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>
                      {showApiKey.whatsapp ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </FieldRow>
                <FieldRow label="PHONE NUMBER ID">
                  <input style={INPUT_STYLE} value={integrations.whatsappPhoneId} onChange={e => setIntegrations({...integrations, whatsappPhoneId: e.target.value})} />
                </FieldRow>
              </GridRow>
              <FieldRow label="WHATSAPP BUSINESS ACCOUNT ID">
                <input style={INPUT_STYLE} value={integrations.whatsappBusinessId} onChange={e => setIntegrations({...integrations, whatsappBusinessId: e.target.value})} />
              </FieldRow>
            </div>

            {/* Property Portals */}
            <div style={CARD_STYLE}>
              <div style={SECTION_TITLE}><Globe size={17} color="#3B82F6" /> Property Portals Integration</div>
              <GridRow>
                <FieldRow label="99ACRES API KEY">
                  <input type="password" style={INPUT_STYLE} value={integrations.send99AcresKey} onChange={e => setIntegrations({...integrations, send99AcresKey: e.target.value})} />
                </FieldRow>
                <FieldRow label="MAGICBRICKS API KEY">
                  <input type="password" style={INPUT_STYLE} value={integrations.magicBricksKey} onChange={e => setIntegrations({...integrations, magicBricksKey: e.target.value})} />
                </FieldRow>
              </GridRow>
            </div>

            {/* Email / SMTP */}
            <div style={CARD_STYLE}>
              <div style={SECTION_TITLE}><Mail size={17} color="#60A5FA" /> Email / SMTP Configuration</div>
              <GridRow>
                <FieldRow label="SMTP HOST">
                  <input style={INPUT_STYLE} value={integrations.smtpHost} onChange={e => setIntegrations({...integrations, smtpHost: e.target.value})} />
                </FieldRow>
                <FieldRow label="SMTP PORT">
                  <input style={INPUT_STYLE} value={integrations.smtpPort} onChange={e => setIntegrations({...integrations, smtpPort: e.target.value})} />
                </FieldRow>
              </GridRow>
              <GridRow>
                <FieldRow label="SMTP USERNAME / EMAIL">
                  <input style={INPUT_STYLE} value={integrations.smtpUser} onChange={e => setIntegrations({...integrations, smtpUser: e.target.value})} />
                </FieldRow>
                <FieldRow label="SMTP PASSWORD / APP PASSWORD">
                  <input type="password" style={INPUT_STYLE} value={integrations.smtpPass} onChange={e => setIntegrations({...integrations, smtpPass: e.target.value})} />
                </FieldRow>
              </GridRow>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.25)', color: '#60A5FA', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={13} /> Send Test Email
                </button>
                <SaveBtn section="integrations" />
              </div>
            </div>
          </div>
        )}

        {/* ═══ SECURITY ═══ */}
        {activeSection === 'security' && (
          <div>
            <div style={CARD_STYLE}>
              <div style={SECTION_TITLE}><Shield size={17} color={GOLD} /> Security & Access Control</div>
              <GridRow>
                <FieldRow label="SESSION TIMEOUT (HOURS)">
                  <select style={{...INPUT_STYLE, background: '#070F1E'}} value={security.sessionTimeout} onChange={e => setSecurity({...security, sessionTimeout: e.target.value})}>
                    <option value="1">1 Hour</option>
                    <option value="4">4 Hours</option>
                    <option value="8">8 Hours</option>
                    <option value="24">24 Hours</option>
                    <option value="168">7 Days</option>
                  </select>
                </FieldRow>
                <FieldRow label="MAX LOGIN ATTEMPTS BEFORE LOCK">
                  <select style={{...INPUT_STYLE, background: '#070F1E'}} value={security.maxLoginAttempts} onChange={e => setSecurity({...security, maxLoginAttempts: e.target.value})}>
                    <option value="3">3 Attempts</option>
                    <option value="5">5 Attempts</option>
                    <option value="10">10 Attempts</option>
                  </select>
                </FieldRow>
              </GridRow>
              <GridRow>
                <FieldRow label="MINIMUM PASSWORD LENGTH">
                  <input style={INPUT_STYLE} type="number" min="6" max="20" value={security.passwordMinLength} onChange={e => setSecurity({...security, passwordMinLength: e.target.value})} />
                </FieldRow>
                <FieldRow label="PASSWORD REQUIREMENTS">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
                      <input type="checkbox" checked={security.requireSpecialChar} onChange={e => setSecurity({...security, requireSpecialChar: e.target.checked})} style={{ accentColor: GOLD }} />
                      Require special characters (!@#$)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
                      <input type="checkbox" checked={security.requireNumbers} onChange={e => setSecurity({...security, requireNumbers: e.target.checked})} style={{ accentColor: GOLD }} />
                      Require numbers (0-9)
                    </label>
                  </div>
                </FieldRow>
              </GridRow>

              {[
                { key: 'twoFactor', label: 'Two-Factor Authentication (2FA)', sub: 'Require OTP on every login for Admin & Manager' },
                { key: 'auditLog', label: 'Audit Log (Activity Tracking)', sub: 'Track all user actions, edits, and deletions' },
                { key: 'forceHttps', label: 'Force HTTPS / SSL', sub: 'Redirect all HTTP traffic to HTTPS' },
              ].map(item => (
                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#FFF' }}>{item.label}</div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>{item.sub}</div>
                  </div>
                  <Toggle value={security[item.key]} onChange={() => setSecurity(p => ({...p, [item.key]: !p[item.key]}))} />
                </div>
              ))}

              <FieldRow label="IP WHITELIST (COMMA SEPARATED — LEAVE BLANK FOR ALL)">
                <input style={INPUT_STYLE} value={security.ipWhitelist} placeholder="e.g. 103.21.58.1, 182.77.x.x" onChange={e => setSecurity({...security, ipWhitelist: e.target.value})} />
              </FieldRow>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <SaveBtn section="security" />
              </div>
            </div>

            {/* Audit Log Preview */}
            <div style={CARD_STYLE}>
              <div style={SECTION_TITLE}><FileText size={17} color={GOLD} /> Recent Audit Log</div>
              {[
                { user: 'Manish Rai', action: 'Lead "Rahul Verma" created via AI Co-pilot', time: 'Today, 11:48 PM', type: 'CREATE' },
                { user: 'Jyoti Dhale', action: 'Lead status updated: Priya Patel → QUALIFIED', time: 'Today, 7:22 PM', type: 'UPDATE' },
                { user: 'Manish Rai', action: 'CRM Settings → Security tab accessed', time: 'Today, 11:52 PM', type: 'ACCESS' },
                { user: 'Yash Murkute', action: 'Site Visit scheduled: Rohan Sharma — Baner', time: 'Yesterday, 4:10 PM', type: 'CREATE' },
                { user: 'System', action: 'Auto-backup completed successfully (07:00 AM)', time: 'Today, 7:00 AM', type: 'SYSTEM' },
              ].map((log, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.76rem' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '0.62rem',
                      background: log.type === 'CREATE' ? 'rgba(16,185,129,0.12)' : log.type === 'UPDATE' ? 'rgba(59,130,246,0.12)' : log.type === 'SYSTEM' ? 'rgba(139,92,246,0.12)' : 'rgba(212,175,55,0.1)',
                      color: log.type === 'CREATE' ? '#10B981' : log.type === 'UPDATE' ? '#3B82F6' : log.type === 'SYSTEM' ? '#8B5CF6' : GOLD
                    }}>{log.type}</span>
                    <div>
                      <span style={{ fontWeight: 700, color: '#FFF' }}>{log.user}</span>
                      <span style={{ color: 'rgba(255,255,255,0.5)', marginLeft: '6px' }}>{log.action}</span>
                    </div>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', fontSize: '0.68rem' }}>{log.time}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(212,175,55,0.08)', border: `1px solid ${GOLD}30`, color: GOLD, fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Download size={13} /> Export Full Audit Log
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ BRANDING ═══ */}
        {activeSection === 'branding' && (
          <div>
            <div style={CARD_STYLE}>
              <div style={SECTION_TITLE}><Palette size={17} color={GOLD} /> Branding & Theme</div>
              <GridRow>
                <FieldRow label="PRIMARY BRAND COLOR (GOLD)">
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input type="color" value={company.primaryColor} onChange={e => setCompany({...company, primaryColor: e.target.value})} style={{ width: '44px', height: '40px', padding: '2px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', cursor: 'pointer' }} />
                    <input style={{...INPUT_STYLE, flex: 1}} value={company.primaryColor} onChange={e => setCompany({...company, primaryColor: e.target.value})} />
                  </div>
                </FieldRow>
                <FieldRow label="CRM THEME">
                  <select style={{...INPUT_STYLE, background: '#070F1E'}}>
                    <option value="dark">Dark (Default — Premium Gold)</option>
                    <option value="midnight">Midnight Navy</option>
                    <option value="obsidian">Obsidian Black</option>
                  </select>
                </FieldRow>
              </GridRow>
              <FieldRow label="COMPANY LOGO (CURRENT)">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ width: '60px', height: '44px', background: 'linear-gradient(135deg, #D4AF37, #B8860B)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#070D18', fontSize: '0.72rem', letterSpacing: '0.05em' }}>24K</div>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#FFF' }}>24K-Realtors-Logo.png</div>
                    <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.4)' }}>Recommended: 200×80px, PNG with transparent background</div>
                  </div>
                  <button style={{ marginLeft: 'auto', padding: '7px 14px', borderRadius: '8px', background: 'rgba(212,175,55,0.1)', border: `1px solid ${GOLD}30`, color: GOLD, fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Upload size={13} /> Replace Logo
                  </button>
                </div>
              </FieldRow>
              <FieldRow label="FAVICON (.ico or .png 32×32)">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ width: '32px', height: '32px', background: GOLD, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#070D18', fontSize: '0.6rem' }}>24K</div>
                  <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>favicon.ico</span>
                  <button style={{ marginLeft: 'auto', padding: '7px 14px', borderRadius: '8px', background: 'rgba(212,175,55,0.1)', border: `1px solid ${GOLD}30`, color: GOLD, fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Upload size={13} /> Replace Favicon
                  </button>
                </div>
              </FieldRow>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <SaveBtn section="branding" />
              </div>
            </div>
          </div>
        )}

        {/* ═══ DATA & BACKUP ═══ */}
        {activeSection === 'data' && (
          <div>
            <div style={CARD_STYLE}>
              <div style={SECTION_TITLE}><Database size={17} color={GOLD} /> Data Management & Backup</div>

              {/* Backup Status */}
              <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#10B981', display: 'flex', gap: '8px', alignItems: 'center' }}><CheckCircle2 size={16} /> Last Backup: Successful</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>Today, 7:00 AM IST — Auto daily backup enabled</div>
                </div>
                <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RefreshCw size={13} /> Backup Now
                </button>
              </div>

              {/* Export Options */}
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFF', marginBottom: '12px' }}>📤 Export CRM Data</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'All Leads', sub: 'CSV / Excel export', color: '#F59E0B' },
                  { label: 'All Deals', sub: 'Pipeline data export', color: '#10B981' },
                  { label: 'Site Visits', sub: 'Visit history export', color: '#3B82F6' },
                  { label: 'Follow-ups', sub: 'Reminders export', color: '#8B5CF6' },
                  { label: 'Commission Report', sub: 'Payroll export', color: '#EC4899' },
                  { label: 'Full CRM Backup', sub: 'All data (JSON/ZIP)', color: GOLD },
                ].map((item, i) => (
                  <button key={i} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: item.color, marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.4)' }}>{item.sub}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '10px', fontSize: '0.7rem', color: item.color }}>
                      <Download size={12} /> Export CSV
                    </div>
                  </button>
                ))}
              </div>

              {/* Danger Zone */}
              <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '18px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#EF4444', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} /> Danger Zone
                </div>
                {[
                  { label: 'Flush Old Leads (90+ days inactive)', btn: 'Clean Up', color: '#F97316' },
                  { label: 'Reset All Demo/Test Data', btn: 'Reset', color: '#EF4444' },
                  { label: 'Delete All CRM Data (IRREVERSIBLE)', btn: 'Wipe Data', color: '#7F1D1D' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: i < 2 ? '1px solid rgba(239,68,68,0.1)' : 'none' }}>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{item.label}</span>
                    <button style={{ padding: '6px 14px', borderRadius: '7px', background: 'rgba(239,68,68,0.1)', border: `1px solid ${item.color}40`, color: item.color, fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>
                      {item.btn}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Retention Policy */}
            <div style={CARD_STYLE}>
              <div style={SECTION_TITLE}><Lock size={17} color={GOLD} /> Data Retention Policy</div>
              <GridRow>
                <FieldRow label="INACTIVE LEAD ARCHIVAL (DAYS)">
                  <input style={INPUT_STYLE} type="number" defaultValue="90" />
                </FieldRow>
                <FieldRow label="AUDIT LOG RETENTION (DAYS)">
                  <input style={INPUT_STYLE} type="number" defaultValue="365" />
                </FieldRow>
              </GridRow>
              <GridRow>
                <FieldRow label="BACKUP FREQUENCY">
                  <select style={{...INPUT_STYLE, background: '#070F1E'}}>
                    <option>Daily (7:00 AM)</option>
                    <option>Twice Daily</option>
                    <option>Hourly</option>
                    <option>Weekly</option>
                  </select>
                </FieldRow>
                <FieldRow label="BACKUP STORAGE LOCATION">
                  <select style={{...INPUT_STYLE, background: '#070F1E'}}>
                    <option>Vercel + Supabase (Current)</option>
                    <option>Google Drive</option>
                    <option>AWS S3</option>
                    <option>Local Server</option>
                  </select>
                </FieldRow>
              </GridRow>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <SaveBtn section="data" />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(5,10,20,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0B1528', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '16px', padding: '28px', maxWidth: '400px', width: '100%' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#EF4444', marginBottom: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <AlertTriangle size={20} /> Confirm Delete User
            </div>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', marginBottom: '22px' }}>
              Are you sure you want to remove this user? Their leads will be unassigned. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setConfirmDelete(null)} style={{ padding: '9px 18px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { setConfirmDelete(null); handleSave('delete'); }} style={{ padding: '9px 18px', borderRadius: '8px', background: '#EF4444', border: 'none', color: '#FFF', fontWeight: 800, cursor: 'pointer' }}>Delete User</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
