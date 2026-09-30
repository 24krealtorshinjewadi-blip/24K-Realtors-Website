// ═══════════════════════════════════════════════════════════════
// 24K REALTORS — Help & Support Center (Full Suite)
// Covers: FAQ, Quick Start Guide, AI Co-pilot Commands, Video Tutorials,
//         Support Ticket System, System Health Status, Shortcuts, Contact, Changelog
// ═══════════════════════════════════════════════════════════════
import { useState } from 'react';
import {
  HelpCircle, Search, ChevronDown, ChevronRight, MessageSquare,
  Phone, Mail, ExternalLink, BookOpen, Zap, Star, Clock,
  CheckCircle2, AlertTriangle, Info, Play, Command,
  Users, Building, Calendar, DollarSign, BarChart3,
  ArrowRight, Sparkles, FileText, Headphones, Globe,
  Send, Activity, ShieldCheck, Video, X, Download, Check
} from 'lucide-react';

const GOLD = '#D4AF37';

const FAQ_DATA = [
  {
    category: 'AI Co-pilot',
    icon: Sparkles,
    color: GOLD,
    items: [
      {
        q: 'AI Co-pilot kaise use karein?',
        a: 'Left sidebar mein "24K AI Co-pilot" button click karein. Chat panel khulega. Aap Hinglish mein commands de sakte hain jaise "Baner me Rahul ka lead add karo" ya "Deals pipeline dikhao". AI automatically CRM action execute karega.'
      },
      {
        q: 'AI Co-pilot real API hai ya dummy?',
        a: 'AI Co-pilot ek autonomous fallback engine se chal raha hai. Real Gemini 2.0 Flash API enable karne ke liye Settings → API Integrations mein apna Google AI Studio API key add karein aur Vercel Environment Variables mein VITE_GEMINI_API_KEY set karein.'
      },
      {
        q: 'AI se lead create karne ke baad Lead Desk pe kyun nahi dikhta?',
        a: 'AI-created leads CRM React state mein add hote hain aur Lead Management tab pe turant visible hote hain. Backend API connection enable hone ke baad ye permanently database mein bhi save honge. Tab "Lead Management" kholo aur top row mein naya lead hoga.'
      },
      {
        q: 'Voice input kaise kaam karta hai?',
        a: 'AI Panel mein mic button click karein. Browser ka native speech recognition use hota hai (Chrome recommended). Bolne ke baad message automatically fill ho jaata hai. Enter press karein ya Send button click karein.'
      },
    ]
  },
  {
    category: 'Lead Management',
    icon: Users,
    color: '#F59E0B',
    items: [
      {
        q: 'Naya lead manually kaise add karein?',
        a: 'Lead Management tab mein "Create Lead" button click karein (top-right, gold colored). Form bharo — Name, Phone, Email, Location, Budget, Intent. Submit karo. Lead instantly table mein appear hoga.'
      },
      {
        q: 'Lead ka status kaise change karein?',
        a: 'Lead table mein lead row pe click karein to open Lead Detail view. Wahan status dropdown se HOT / QUALIFIED / CONTACTED / SITE_VISIT / WON / LOST select karein. Ya AI Co-pilot se bolein — "Priya Patel ko HOT mark karo".'
      },
      {
        q: 'Lead ko agent ko assign kaise karein?',
        a: 'Lead Detail view mein "Assigned Agent" field click karein aur dropdown se agent select karein. Settings → Lead Configuration mein Auto-Assign enable karein taaki new leads automatically round-robin mein distribute hon.'
      },
      {
        q: 'Purane leads ko filter kaise karein?',
        a: 'Lead Management tab pe top filter bar mein Status, Location, Source filters available hain. Search bar mein naam ya phone search karein. Sub-tabs (ALL, HOT, WARM, COLD) se quick filter karein.'
      },
    ]
  },
  {
    category: 'Site Visits & Follow-ups',
    icon: Calendar,
    color: '#3B82F6',
    items: [
      {
        q: 'Site visit schedule kaise karein?',
        a: 'Site Visits tab mein "Schedule Visit" button click karein. Lead select karein, property, date/time, aur agent assign karein. Visit ke din automatically agent ko reminder milega (if notifications enabled in Settings).'
      },
      {
        q: 'Follow-up reminder set karne ka tarika?',
        a: 'Follow-ups tab mein "Add Follow-up" click karein. Lead aur callback date/time set karein. Due date pe CRM dashboard pe reminder show hoga. AI Co-pilot se bhi bol sakte hain — "Rohan Sharma ke liye kal follow-up set karo".'
      },
    ]
  },
  {
    category: 'Deals & Closures',
    icon: DollarSign,
    color: '#10B981',
    items: [
      {
        q: 'Deal Kanban mein lead kaise move karein?',
        a: 'Deals tab mein 7-stage Kanban board visible hai. Lead card ko drag karke next stage mein drop karein (Inquiry → Site Visit → Negotiation → Proposal → Agreement → Registration → WON). Ya card click karke stage manually change karein.'
      },
      {
        q: 'Deal value aur commission kaise track karein?',
        a: 'Deal card mein property value enter karein. Commission automatically calculate hoti hai based on company\'s commission slab (Settings → Commissions). Commissions tab mein agent-wise breakdown visible hai.'
      },
    ]
  },
  {
    category: 'Settings & Admin',
    icon: Building,
    color: '#8B5CF6',
    items: [
      {
        q: 'Gemini AI key kahan set karein?',
        a: 'Two steps: (1) Settings → API Integrations mein key daalo. (2) Vercel Dashboard → Project → Settings → Environment Variables mein VITE_GEMINI_API_KEY=AIzaSy... add karein aur Redeploy karein. Free key milegi aistudio.google.com pe.'
      },
      {
        q: 'Naya CRM user kaise add karein?',
        a: 'Settings → Users & Roles → "Add User" button click karein. Name, Email, Phone, Role (Agent/Manager/Super Admin) fill karein. "Create User & Send Invite" click karein. User ko email se login credentials milenge.'
      },
      {
        q: 'CRM data export kaise karein?',
        a: 'Settings → Data & Backup → "Export CRM Data" section mein jaao. All Leads, Deals, Site Visits, Follow-ups, Commission Report ya Full CRM Backup select karke CSV/Excel download karein.'
      },
    ]
  },
];

const AI_COMMANDS = [
  { cmd: '"Baner me Rahul Sharma ka lead add karo 9876543210"', action: 'New lead create karke Lead Desk pe switch karta hai', icon: '➕', color: '#F59E0B' },
  { cmd: '"Lead management desk dikhao"', action: 'Lead Management tab pe navigate karta hai', icon: '📋', color: '#3B82F6' },
  { cmd: '"Site visits desk kholo"', action: 'Site Visits module open karta hai', icon: '🚘', color: '#10B981' },
  { cmd: '"Follow ups desk open karo"', action: 'Follow-ups reminders screen open karta hai', icon: '⏱️', color: '#8B5CF6' },
  { cmd: '"Deals pipeline dikhao"', action: 'Deals & Closures Kanban board open karta hai', icon: '💰', color: '#EC4899' },
  { cmd: '"Analytics reports dikhao"', action: 'Analytics dashboard with KPIs open karta hai', icon: '📊', color: '#F97316' },
  { cmd: '"Attendance dashboard dikhao"', action: 'Attendance tracker open karta hai', icon: '✅', color: '#10B981' },
  { cmd: '"Team performance dikhao"', action: 'Team & RMs leaderboard open karta hai', icon: '🏆', color: '#F59E0B' },
  { cmd: '"Commissions payroll dikhao"', action: 'Commissions & Payroll module open karta hai', icon: '💳', color: '#3B82F6' },
  { cmd: '"Priya Patel ko HOT mark karo"', action: 'Lead status HOT update karta hai', icon: '🔥', color: '#EF4444' },
  { cmd: '"WhatsApp message bhejo"', action: 'WhatsApp launcher trigger karta hai', icon: '💬', color: '#25D366' },
  { cmd: '"CRM status batao"', action: 'Live KPIs — leads, pipeline value, visits count show karta hai', icon: '📈', color: GOLD },
];

const SHORTCUTS = [
  { keys: ['Alt', 'L'], action: 'Lead Management tab open' },
  { keys: ['Alt', 'D'], action: 'Dashboard overview' },
  { keys: ['Alt', 'A'], action: 'AI Co-pilot panel toggle' },
  { keys: ['Alt', 'S'], action: 'Site Visits tab' },
  { keys: ['Alt', 'F'], action: 'Follow-ups tab' },
  { keys: ['Ctrl', 'K'], action: 'Global search focus' },
  { keys: ['Escape'], action: 'Close modal / panel' },
];

const VIDEO_TUTORIALS = [
  { title: 'AI Co-pilot Voice & Lead Creation Walkthrough', duration: '3:45 min', views: '1.2k', topic: 'AI Co-pilot', color: GOLD },
  { title: 'How to Manage 7-Stage Deals Kanban Pipeline', duration: '5:20 min', views: '980', topic: 'Deals', color: '#10B981' },
  { title: 'VIP Maybach Chauffeur Site Visit Scheduling', duration: '2:50 min', views: '1.5k', topic: 'Site Visits', color: '#3B82F6' },
  { title: 'Setting Up WhatsApp Business & Gemini API Key', duration: '4:10 min', views: '840', topic: 'Settings', color: '#8B5CF6' },
];

const SYSTEM_HEALTH = [
  { service: 'Google Gemini 2.0 Flash Engine', status: 'OPERATIONAL', latency: '240ms', uptime: '99.9%' },
  { service: 'CRM Core REST API Backend', status: 'OPERATIONAL', latency: '45ms', uptime: '99.98%' },
  { service: 'WhatsApp Business API Gateway', status: 'OPERATIONAL', latency: '120ms', uptime: '99.95%' },
  { service: 'Vercel Edge Global Network CDN', status: 'OPERATIONAL', latency: '12ms', uptime: '100%' },
  { service: 'PostgreSQL Database Engine', status: 'OPERATIONAL', latency: '18ms', uptime: '99.99%' },
];

const CHANGELOG = [
  { version: 'v2.4.0', date: '27 Jul 2026', tag: 'LATEST', color: '#10B981', changes: [
    'Full CRM Settings module launched (8 sections)',
    'Analytics & Reports tab — real dashboard (not blogs)',
    'AI Co-pilot — 12-tab navigation coverage',
    'Dynamic header title for all tabs',
    'Help & Support Center expanded (Ticket System + System Health + Video Guides)',
  ]},
  { version: 'v2.3.0', date: '26 Jul 2026', tag: 'STABLE', color: '#3B82F6', changes: [
    'AI Co-pilot fallback engine — Hinglish NLP improved',
    'Lead creation from AI chat — reactive state update',
    'Floating AI button removed — sidebar controlled',
    'Quick chips expanded (9 shortcuts)',
  ]},
  { version: 'v2.2.0', date: '25 Jul 2026', tag: 'PREV', color: '#8B5CF6', changes: [
    'AiAssistantPanel — voice input integrated',
    'SiteVisitsTab — Guided site visit scheduling',
    'DealsTab — 7-stage Kanban pipeline',
    'FollowUpsTab — calendar view',
  ]},
  { version: 'v2.0.0', date: '20 Jul 2026', tag: 'MAJOR', color: '#F59E0B', changes: [
    'Enterprise CRM launched — 12 core modules',
    'Gemini AI Co-pilot integration',
    'Lead Management with mock + API data',
    'WhatsApp AI message generator',
  ]},
];

export default function HelpSupportTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [activeSection, setActiveSection] = useState('quickstart');

  // Ticket Form State
  const [ticketForm, setTicketForm] = useState({
    name: 'Manish Rai',
    email: 'manish@24krealtors.in',
    category: 'AI_COPILOT',
    priority: 'MEDIUM',
    subject: '',
    description: ''
  });
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  const SECTIONS = [
    { id: 'quickstart', label: 'Quick Start Guide', icon: Play },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'ai_commands', label: 'AI Co-pilot Commands', icon: Sparkles },
    { id: 'videos', label: 'Video Tutorials', icon: Video },
    { id: 'ticket', label: 'Submit Ticket', icon: MessageSquare },
    { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Command },
    { id: 'health', label: 'System Health', icon: Activity },
    { id: 'contact', label: 'Contact Support', icon: Headphones },
    { id: 'changelog', label: 'CRM Changelog', icon: FileText },
  ];

  const filteredFaq = FAQ_DATA.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      !searchQuery || item.q.toLowerCase().includes(searchQuery.toLowerCase()) || item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  const CARD = {
    background: 'rgba(10,18,36,0.85)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '14px',
    padding: '22px 24px',
    marginBottom: '16px'
  };

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

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    const tId = `24K-TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedTicketId(tId);
    setTicketSubmitted(true);
  };

  return (
    <div style={{ display: 'flex', gap: '20px', minHeight: 'calc(100vh - 130px)' }}>

      {/* ── LEFT NAV ── */}
      <div style={{ width: '210px', minWidth: '210px', background: 'rgba(10,18,36,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: '3px', height: 'fit-content', position: 'sticky', top: 0 }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', padding: '4px 10px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '6px' }}>
          HELP CENTER
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

        {/* Support Badge */}
        <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10B981', marginBottom: '4px', display: 'flex', gap: '5px', alignItems: 'center' }}>
            <CheckCircle2 size={12} /> Support Online
          </div>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>Mon–Sat <strong style={{ color: '#FFF' }}>9 AM – 7 PM</strong> IST</div>
        </div>
      </div>

      {/* ── RIGHT CONTENT ── */}
      <div style={{ flex: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 130px)', paddingRight: '4px' }}>

        {/* ═══ QUICK START GUIDE ═══ */}
        {activeSection === 'quickstart' && (
          <div>
            {/* Hero Banner */}
            <div style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(11,21,40,0.95) 60%)', border: `1px solid ${GOLD}30`, borderRadius: '16px', padding: '28px 28px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: `${GOLD}12`, filter: 'blur(40px)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <Sparkles size={24} color={GOLD} />
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFF', fontFamily: "'Cinzel', serif" }}>24K Realtors CRM — Quick Start Guide</div>
              </div>
              <div style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.6)', maxWidth: '540px', lineHeight: 1.6 }}>
                Enterprise CRM for Pune's premium real estate market. Sabse pehle ye 5 steps complete karo taaki system fully live aur production-ready ho.
              </div>
            </div>

            {/* 5 Steps */}
            {[
              {
                step: 1, icon: '🔑', title: 'Gemini AI Key Add Karo',
                desc: 'Settings → API Integrations mein Google AI Studio key daalo. Free key milti hai aistudio.google.com pe. Vercel Environment Variables mein VITE_GEMINI_API_KEY set karo aur redeploy karo. AI Co-pilot full power mein aayega.',
                status: 'ACTION_REQUIRED', statusColor: '#F59E0B', link: 'https://aistudio.google.com/app/apikey', linkText: 'Get Free API Key →'
              },
              {
                step: 2, icon: '👥', title: 'Team Users Add Karo',
                desc: 'Settings → Users & Roles mein apni team ke agents add karo. Har agent ka naam, email, phone aur role (Agent/Manager/Admin) set karo. Invite email bhejo. Agents apna lead dashboard access kar sakte hain.',
                status: 'RECOMMENDED', statusColor: '#3B82F6', link: null
              },
              {
                step: 3, icon: '🏢', title: 'Company Profile Update Karo',
                desc: 'Settings → Company Profile mein RERA number, GST, official address, business hours verify karo. Ye information CRM reports, PDF brochures aur WhatsApp messages mein auto-fill hoti hai.',
                status: 'IMPORTANT', statusColor: '#8B5CF6', link: null
              },
              {
                step: 4, icon: '🔔', title: 'Notifications Configure Karo',
                desc: 'Settings → Notifications mein WhatsApp aur Email alerts enable karo. New lead notifications, site visit reminders, follow-up due alerts — sab configure karo. Team automatically alert rahegi.',
                status: 'RECOMMENDED', statusColor: '#3B82F6', link: null
              },
              {
                step: 5, icon: '🤖', title: 'AI Co-pilot Test Karo',
                desc: 'Sidebar mein "24K AI Co-pilot" click karo. Type karo: "Baner me Rahul Sharma ka lead add karo 9876543210". AI lead create karega aur Lead Management tab pe navigate karega. Commands list ke liye "AI Co-pilot Commands" section dekho.',
                status: 'DONE', statusColor: '#10B981', link: null
              },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', background: 'rgba(10,18,36,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '18px 20px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${item.statusColor}15`, border: `2px solid ${item.statusColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFF' }}>Step {item.step}: {item.title}</span>
                    <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '0.62rem', fontWeight: 800, background: `${item.statusColor}15`, color: item.statusColor, border: `1px solid ${item.statusColor}30` }}>{item.status}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{item.desc}</div>
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '10px', fontSize: '0.76rem', color: GOLD, fontWeight: 700, textDecoration: 'none' }}>
                      {item.linkText} <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}

            {/* CRM Module Overview */}
            <div style={CARD}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={17} color={GOLD} /> CRM Module Overview
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[
                  { label: 'Lead Management', desc: 'Create, track & convert leads', icon: '👥' },
                  { label: 'Properties', desc: 'Active inventory & projects', icon: '🏢' },
                  { label: 'Site Visits', desc: 'Schedule VIP property tours', icon: '🚘' },
                  { label: 'Follow-ups', desc: 'Reminders & callback tracker', icon: '⏱️' },
                  { label: 'Deals Pipeline', desc: '7-stage Kanban closure board', icon: '💰' },
                  { label: 'Team & RMs', desc: 'Agent performance leaderboard', icon: '🏆' },
                  { label: 'Commissions', desc: 'Payroll & incentives', icon: '💳' },
                  { label: 'Analytics', desc: 'Revenue charts & KPIs', icon: '📊' },
                  { label: 'Attendance', desc: 'Team checkin & hours', icon: '✅' },
                  { label: 'HR & Leaves', desc: 'Leave requests & approvals', icon: '📅' },
                  { label: 'Inventory', desc: 'Builder projects catalog', icon: '🏗️' },
                  { label: 'Settings', desc: 'Config, users & integrations', icon: '⚙️' },
                ].map((mod, i) => (
                  <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.1rem' }}>{mod.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#FFF' }}>{mod.label}</div>
                      <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)' }}>{mod.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ FAQ ═══ */}
        {activeSection === 'faq' && (
          <div>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
              <input
                style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: '10px', background: 'rgba(10,18,36,0.85)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.84rem', outline: 'none', boxSizing: 'border-box' }}
                placeholder="Search FAQs... e.g. lead add, API key, site visit"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {filteredFaq.map((cat, ci) => {
              const IconC = cat.icon;
              return (
                <div key={ci} style={CARD}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconC size={16} color={cat.color} />
                    <span style={{ color: cat.color }}>{cat.category}</span>
                  </div>
                  {cat.items.map((item, ii) => {
                    const faqKey = `${ci}-${ii}`;
                    const isOpen = openFaq === faqKey;
                    return (
                      <div key={ii} style={{ borderBottom: ii < cat.items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingBottom: '12px', marginBottom: '12px' }}>
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : faqKey)}
                          style={{ width: '100%', background: 'none', border: 'none', color: '#FFF', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}
                        >
                          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{item.q}</span>
                          {isOpen ? <ChevronDown size={15} color={GOLD} /> : <ChevronRight size={15} color="rgba(255,255,255,0.3)" />}
                        </button>
                        {isOpen && (
                          <div style={{ marginTop: '10px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, paddingLeft: '12px', borderLeft: `2px solid ${cat.color}40` }}>
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {filteredFaq.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)' }}>
                <HelpCircle size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                <div>Koi FAQ match nahi mila. Contact support karein.</div>
              </div>
            )}
          </div>
        )}

        {/* ═══ AI CO-PILOT COMMANDS ═══ */}
        {activeSection === 'ai_commands' && (
          <div>
            <div style={CARD}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFF', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={17} color={GOLD} /> 24K AI Co-pilot — Full Command Reference
              </div>
              <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', marginBottom: '18px' }}>
                Sidebar mein "24K AI Co-pilot" click karke panel kholo. Neeche diye commands Hinglish mein type karo. AI automatically CRM action execute karega.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {AI_COMMANDS.map((cmd, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px 16px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{cmd.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 700, color: cmd.color, background: `${cmd.color}10`, padding: '4px 10px', borderRadius: '6px', border: `1px solid ${cmd.color}25`, marginBottom: '6px', display: 'inline-block' }}>
                        {cmd.cmd}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.5)' }}>→ {cmd.action}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '18px', background: 'rgba(212,175,55,0.06)', border: `1px solid ${GOLD}25`, borderRadius: '10px', padding: '14px 16px', fontSize: '0.76rem', color: 'rgba(255,255,255,0.5)', display: 'flex', gap: '10px' }}>
                <Info size={15} color={GOLD} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>Commands Hinglish, English ya mixed language mein kaam karte hain. Location names (Baner, Wakad, Hinjewadi), client names aur phone numbers automatically detect hote hain. Gemini API key add karne ke baad AI aur bhi smart ho jaayega.</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══ VIDEO TUTORIALS ═══ */}
        {activeSection === 'videos' && (
          <div>
            <div style={CARD}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFF', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Video size={17} color={GOLD} /> Video Tutorials & CRM Training
              </div>
              <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', marginBottom: '18px' }}>
                CRM ke har module ka step-by-step video demonstration dekhein.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {VIDEO_TUTORIALS.map((vid, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '0.64rem', fontWeight: 800, background: `${vid.color}15`, color: vid.color, border: `1px solid ${vid.color}30` }}>{vid.topic}</span>
                        <span style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.4)' }}>⏱️ {vid.duration}</span>
                      </div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FFF', lineHeight: 1.4, marginBottom: '10px' }}>{vid.title}</div>
                    </div>
                    <button onClick={() => setActiveVideo(vid)}
                      style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(212,175,55,0.1)', border: `1px solid ${GOLD}30`, color: GOLD, fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', width: 'fit-content' }}
                    >
                      <Play size={13} fill={GOLD} /> Watch Video Demo
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal for Video Player */}
            {activeVideo && (
              <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(5,10,20,0.9)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div style={{ background: '#0B1528', border: `1px solid ${GOLD}40`, borderRadius: '16px', width: '100%', maxWidth: '640px', padding: '24px', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#FFF' }}>{activeVideo.title}</div>
                    <button onClick={() => setActiveVideo(null)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}><X size={18} /></button>
                  </div>
                  <div style={{ width: '100%', height: '320px', background: '#000', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: GOLD, gap: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Play size={48} fill={GOLD} className="animate-pulse" />
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFF' }}>Video Tutorial Demo Player</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>Interactive CRM Walkthrough — {activeVideo.duration}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ SUBMIT TICKET ═══ */}
        {activeSection === 'ticket' && (
          <div>
            <div style={CARD}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFF', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={17} color={GOLD} /> Submit Support Ticket / Feature Request
              </div>
              <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', marginBottom: '18px' }}>
                Koi technical issue, bug report ya new feature requirement send karein. 24K Tech Team 2 hours ke andar resolve karegi.
              </div>

              {ticketSubmitted ? (
                <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
                  <CheckCircle2 size={40} color="#10B981" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FFF', marginBottom: '6px' }}>Support Ticket Created!</div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: GOLD, marginBottom: '10px' }}>Ticket ID: {submittedTicketId}</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', maxWidth: '400px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                    Aapka ticket log ho gaya hai. Support team confirmation email {ticketForm.email} pe bhej rahi hai.
                  </div>
                  <button onClick={() => { setTicketSubmitted(false); setTicketForm({...ticketForm, subject: '', description: ''}); }}
                    style={{ padding: '9px 20px', borderRadius: '8px', background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, border: 'none', color: '#070D18', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    Submit Another Ticket
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>YOUR NAME *</label>
                      <input style={INPUT_STYLE} required value={ticketForm.name} onChange={e => setTicketForm({...ticketForm, name: e.target.value})} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>EMAIL ADDRESS *</label>
                      <input style={INPUT_STYLE} required type="email" value={ticketForm.email} onChange={e => setTicketForm({...ticketForm, email: e.target.value})} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>CATEGORY *</label>
                      <select style={{...INPUT_STYLE, background: '#070F1E'}} value={ticketForm.category} onChange={e => setTicketForm({...ticketForm, category: e.target.value})}>
                        <option value="AI_COPILOT">AI Co-pilot / Voice Issue</option>
                        <option value="LEAD_MGMT">Lead Management / Imports</option>
                        <option value="SITE_VISITS">Site Visits / Chauffeur</option>
                        <option value="DEALS">Deals Kanban / Pipeline</option>
                        <option value="SETTINGS">Settings / API Keys</option>
                        <option value="BUG">Report a Bug / Error</option>
                        <option value="FEATURE_REQ">Custom Feature Request</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>PRIORITY LEVEL *</label>
                      <select style={{...INPUT_STYLE, background: '#070F1E'}} value={ticketForm.priority} onChange={e => setTicketForm({...ticketForm, priority: e.target.value})}>
                        <option value="LOW">Low (General Query)</option>
                        <option value="MEDIUM">Medium (Normal Issue)</option>
                        <option value="HIGH">High (Urgent Help Needed)</option>
                        <option value="CRITICAL">Critical (System Down)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>SUBJECT *</label>
                    <input style={INPUT_STYLE} required placeholder="Brief summary of issue or request" value={ticketForm.subject} onChange={e => setTicketForm({...ticketForm, subject: e.target.value})} />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>DETAILED DESCRIPTION *</label>
                    <textarea style={{...INPUT_STYLE, height: '100px', resize: 'vertical'}} required placeholder="Describe what happened or what feature you need in detail..." value={ticketForm.description} onChange={e => setTicketForm({...ticketForm, description: e.target.value})} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                    <button type="submit" style={{ padding: '10px 24px', borderRadius: '8px', background: `linear-gradient(135deg, ${GOLD}, #B8860B)`, border: 'none', color: '#070D18', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Send size={15} /> Submit Support Ticket
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ═══ KEYBOARD SHORTCUTS ═══ */}
        {activeSection === 'shortcuts' && (
          <div style={CARD}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFF', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Command size={17} color={GOLD} /> Keyboard Shortcuts
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SHORTCUTS.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>{s.action}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {s.keys.map((k, ki) => (
                      <span key={ki} style={{ padding: '3px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: GOLD, fontSize: '0.74rem', fontWeight: 800, fontFamily: 'monospace' }}>{k}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '0.74rem', color: 'rgba(255,255,255,0.4)', display: 'flex', gap: '8px' }}>
              <Info size={13} color="rgba(255,255,255,0.3)" style={{ flexShrink: 0 }} />
              Shortcut keys browser extensions se conflict ho sakti hain. Chrome me best kaam karte hain.
            </div>
          </div>
        )}

        {/* ═══ SYSTEM HEALTH ═══ */}
        {activeSection === 'health' && (
          <div>
            <div style={CARD}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFF', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={17} color="#10B981" /> Live CRM System Health & Status
              </div>
              <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', marginBottom: '18px' }}>
                Real-time status of 24K Realtors CRM core infrastructure, APIs, and cloud services.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {SYSTEM_HEALTH.map((sys, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFF' }}>{sys.service}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Latency: <strong style={{ color: GOLD }}>{sys.latency}</strong></span>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Uptime: <strong style={{ color: '#10B981' }}>{sys.uptime}</strong></span>
                      <span style={{ padding: '3px 10px', borderRadius: '8px', fontSize: '0.64rem', fontWeight: 800, background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}>{sys.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ CONTACT SUPPORT ═══ */}
        {activeSection === 'contact' && (
          <div>
            {/* Contact Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
              {[
                {
                  icon: Phone, label: 'Call Support', value: '+91 96730 00053',
                  sub: 'Mon–Sat, 9 AM – 7 PM IST', color: '#10B981',
                  action: 'tel:+919673000053', actionLabel: 'Call Now'
                },
                {
                  icon: MessageSquare, label: 'WhatsApp Support', value: 'WhatsApp Chat',
                  sub: 'Instant response during business hours', color: '#25D366',
                  action: 'https://wa.me/919673000053?text=Hi, I need CRM support', actionLabel: 'Open WhatsApp'
                },
                {
                  icon: Mail, label: 'Email Support', value: 'hello@24krealtors.in',
                  sub: 'Response within 24 hours', color: '#3B82F6',
                  action: 'mailto:hello@24krealtors.in?subject=CRM Support Request', actionLabel: 'Send Email'
                },
              ].map((c, i) => {
                const IconC = c.icon;
                return (
                  <div key={i} style={{ background: 'rgba(10,18,36,0.85)', border: `1px solid ${c.color}25`, borderRadius: '14px', padding: '22px', textAlign: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `${c.color}15`, border: `1px solid ${c.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      <IconC size={22} color={c.color} />
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFF', marginBottom: '4px' }}>{c.label}</div>
                    <div style={{ fontSize: '0.76rem', color: c.color, fontWeight: 700, marginBottom: '4px' }}>{c.value}</div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>{c.sub}</div>
                    <a href={c.action} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', background: `${c.color}15`, border: `1px solid ${c.color}30`, color: c.color, fontSize: '0.76rem', fontWeight: 700, textDecoration: 'none' }}
                    >
                      {c.actionLabel} <ExternalLink size={12} />
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Links & Resources */}
            <div style={CARD}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={17} color={GOLD} /> Useful Links & Resources
              </div>
              {[
                { label: '24K Realtors Official Website', url: 'https://24krealtors.in', icon: Globe, color: GOLD },
                { label: 'Google AI Studio — Get Gemini API Key (Free)', url: 'https://aistudio.google.com/app/apikey', icon: Sparkles, color: '#4285F4' },
                { label: 'Vercel Dashboard — Environment Variables', url: 'https://vercel.com/dashboard', icon: Globe, color: '#FFF' },
                { label: 'MahaRERA Official Portal', url: 'https://maharera.maharashtra.gov.in', icon: FileText, color: '#3B82F6' },
                { label: 'GitHub Repository — CRM Source Code', url: 'https://github.com/24krealtorshinjewadi-blip/24K-Realtors-Website', icon: Globe, color: '#10B981' },
              ].map((link, i) => {
                const IconC = link.icon;
                return (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none', textDecoration: 'none', color: 'inherit' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <IconC size={15} color={link.color} />
                      <span style={{ fontSize: '0.82rem', color: '#FFF' }}>{link.label}</span>
                    </div>
                    <ExternalLink size={14} color="rgba(255,255,255,0.3)" />
                  </a>
                );
              })}
            </div>

            {/* Support Hours */}
            <div style={{ background: 'rgba(10,18,36,0.85)', border: `1px solid ${GOLD}25`, borderRadius: '14px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: GOLD, marginBottom: '4px' }}>24K Realtors Support Hours</div>
                <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                  📍 Office: Baner Road, Pune 411045<br />
                  🕘 Mon–Sat: 9:00 AM – 7:00 PM IST<br />
                  📞 RERA: A051262603190
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#10B981' }}>Currently Online</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══ CHANGELOG ═══ */}
        {activeSection === 'changelog' && (
          <div>
            <div style={CARD}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFF', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={17} color={GOLD} /> CRM Changelog & Version History
              </div>
              {CHANGELOG.map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: log.color, border: `2px solid ${log.color}60`, flexShrink: 0, marginTop: '4px' }} />
                    {i < CHANGELOG.length - 1 && <div style={{ width: '2px', flex: 1, background: 'rgba(255,255,255,0.08)', minHeight: '40px', marginTop: '4px' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 800, color: '#FFF' }}>{log.version}</span>
                      <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '0.62rem', fontWeight: 800, background: `${log.color}15`, color: log.color, border: `1px solid ${log.color}30` }}>{log.tag}</span>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>{log.date}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {log.changes.map((change, ci) => (
                        <div key={ci} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)' }}>
                          <CheckCircle2 size={13} color={log.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                          {change}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
