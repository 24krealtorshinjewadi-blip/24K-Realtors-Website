import React, { useState } from 'react';
import { 
  TrendingUp, BarChart3, Calculator, MapPin, ShieldCheck, 
  Sparkles, Download, ArrowUpRight, Zap, RefreshCw, Cpu, 
  Building2, Layers, DollarSign, Award, ChevronRight, Activity,
  Info, CheckCircle, PieChart, LineChart, Shield, Lock, FileText,
  TrendingDown, Globe, Share2, Compass, AlertCircle, ArrowRight
} from 'lucide-react';

const MARKET_TICKER = [
  "🔥 HINJEWADI PHASE 1: 3BHK Rental Demand up +18.4% YoY",
  "📈 BANER HIGH STREET: Benchmark Index ₹11,200/sqft (+14.2%)",
  "🏛️ MAHARERA: 42 New Luxury Launches Registered in Pune West",
  "⚡ WAKAD JUNCTION: Metro Line 3 Trial Run Inflow +9.4%",
  "💼 CORPORATE POOL: 14,200+ Tech Executives Active in Rental Radar",
  "🏢 MAHALUNGE TOWNSHIP: 5-Yr Appreciation Peak at +62.4%"
];

const CORRIDOR_DATA = {
  ALL: {
    name: 'Pune West Macro Corridor',
    avgPrice: '₹8,450',
    appreciation5Yr: '+48.2%',
    avgYield: '4.65%',
    occupancy: '94.8%',
    volume: '₹512 Cr+',
    riskGrade: 'AAA (Low Risk)',
    metroImpact: 'Line 3 Access (Q4 2026)',
    topDemandType: '2 & 3 BHK Smart Executive Residences',
    chartData: [
      { year: '2022', price: 5700, priceStr: '₹5,700', growth: 'Base' },
      { year: '2023', price: 6350, priceStr: '₹6,350', growth: '+11.4%' },
      { year: '2024', price: 7100, priceStr: '₹7,100', growth: '+24.5%' },
      { year: '2025', price: 7800, priceStr: '₹7,800', growth: '+36.8%' },
      { year: '2026', price: 8450, priceStr: '₹8,450', growth: '+48.2%' },
      { year: '2027 (AI Proj)', price: 9200, priceStr: '₹9,200', growth: '+61.4%' }
    ],
    yieldBreakdown: [
      { type: '1 BHK Executive Suite', rent: '₹18k - ₹22k', yield: '5.20%', demand: 'Very High' },
      { type: '2 BHK Premium Smart Home', rent: '₹26k - ₹34k', yield: '4.80%', demand: 'Extremely High' },
      { type: '3 BHK Luxury Family Suite', rent: '₹38k - ₹52k', yield: '4.40%', demand: 'High' },
      { type: 'Commercial Workspace Desk', rent: '₹65/sqft', yield: '6.50%', demand: 'Moderate' }
    ]
  },
  HINJEWADI: {
    name: 'Hinjewadi IT Corridor (Ph 1 - 3)',
    avgPrice: '₹7,800',
    appreciation5Yr: '+55.5%',
    avgYield: '5.25%',
    occupancy: '97.2%',
    volume: '₹195 Cr+',
    riskGrade: 'AAA (Prime Growth)',
    metroImpact: 'Direct Access (Line 3 Stations 1-5)',
    topDemandType: '1 & 2 BHK Tech Workforce Rentals',
    chartData: [
      { year: '2022', price: 5000, priceStr: '₹5,000', growth: 'Base' },
      { year: '2023', price: 5700, priceStr: '₹5,700', growth: '+14.0%' },
      { year: '2024', price: 6500, priceStr: '₹6,500', growth: '+30.0%' },
      { year: '2025', price: 7200, priceStr: '₹7,200', growth: '+44.0%' },
      { year: '2026', price: 7800, priceStr: '₹7,800', growth: '+55.5%' },
      { year: '2027 (AI Proj)', price: 8600, priceStr: '₹8,600', growth: '+72.0%' }
    ],
    yieldBreakdown: [
      { type: '1 BHK Executive Suite', rent: '₹19k - ₹24k', yield: '5.60%', demand: 'Maximum' },
      { type: '2 BHK Premium Smart Home', rent: '₹28k - ₹36k', yield: '5.20%', demand: 'Maximum' },
      { type: '3 BHK Luxury Family Suite', rent: '₹40k - ₹55k', yield: '4.60%', demand: 'High' },
      { type: 'Commercial Workspace Desk', rent: '₹70/sqft', yield: '7.10%', demand: 'High' }
    ]
  },
  WAKAD: {
    name: 'Wakad Junction & Kaspate Wasti',
    avgPrice: '₹8,650',
    appreciation5Yr: '+46.0%',
    avgYield: '4.50%',
    occupancy: '95.0%',
    volume: '₹140 Cr+',
    riskGrade: 'AA+ (Stable Core)',
    metroImpact: 'Expressway & Metro Interchange Node',
    topDemandType: '2 & 3 BHK Family Gated Estates',
    chartData: [
      { year: '2022', price: 5900, priceStr: '₹5,900', growth: 'Base' },
      { year: '2023', price: 6600, priceStr: '₹6,600', growth: '+11.8%' },
      { year: '2024', price: 7400, priceStr: '₹7,400', growth: '+25.4%' },
      { year: '2025', price: 8100, priceStr: '₹8,100', growth: '+37.2%' },
      { year: '2026', price: 8650, priceStr: '₹8,650', growth: '+46.0%' },
      { year: '2027 (AI Proj)', price: 9400, priceStr: '₹9,400', growth: '+59.3%' }
    ],
    yieldBreakdown: [
      { type: '1 BHK Executive Suite', rent: '₹17k - ₹21k', yield: '4.80%', demand: 'High' },
      { type: '2 BHK Premium Smart Home', rent: '₹25k - ₹32k', yield: '4.50%', demand: 'Very High' },
      { type: '3 BHK Luxury Family Suite', rent: '₹36k - ₹48k', yield: '4.20%', demand: 'High' },
      { type: 'Commercial Workspace Desk', rent: '₹60/sqft', yield: '6.00%', demand: 'Moderate' }
    ]
  },
  BANER: {
    name: 'Baner & Balewadi High Street',
    avgPrice: '₹11,200',
    appreciation5Yr: '+42.8%',
    avgYield: '3.90%',
    occupancy: '93.5%',
    volume: '₹110 Cr+',
    riskGrade: 'AAA (Luxury Benchmark)',
    metroImpact: 'Established High-End Commercial Hub',
    topDemandType: '3 & 4 BHK Luxury Penthouses',
    chartData: [
      { year: '2022', price: 7800, priceStr: '₹7,800', growth: 'Base' },
      { year: '2023', price: 8700, priceStr: '₹8,700', growth: '+11.5%' },
      { year: '2024', price: 9600, priceStr: '₹9,600', growth: '+23.0%' },
      { year: '2025', price: 10400, priceStr: '₹10,400', growth: '+33.3%' },
      { year: '2026', price: 11200, priceStr: '₹11,200', growth: '+42.8%' },
      { year: '2027 (AI Proj)', price: 12200, priceStr: '₹12,200', growth: '+56.4%' }
    ],
    yieldBreakdown: [
      { type: '2 BHK Premium Smart Home', rent: '₹32k - ₹40k', yield: '4.10%', demand: 'High' },
      { type: '3 BHK Luxury Family Suite', rent: '₹48k - ₹65k', yield: '3.90%', demand: 'Very High' },
      { type: '4 BHK Penthouse Estate', rent: '₹85k - ₹1.2L', yield: '3.60%', demand: 'High' },
      { type: 'Commercial Workspace Desk', rent: '₹90/sqft', yield: '6.80%', demand: 'Maximum' }
    ]
  },
  MAHALUNGE: {
    name: 'Mahalunge Smart City Corridor',
    avgPrice: '₹7,200',
    appreciation5Yr: '+62.4%',
    avgYield: '4.85%',
    occupancy: '91.0%',
    volume: '₹67 Cr+',
    riskGrade: 'AA (High Growth Venture)',
    metroImpact: 'High Tech City Township Area',
    topDemandType: '2 BHK Integrated Township Flats',
    chartData: [
      { year: '2022', price: 4400, priceStr: '₹4,400', growth: 'Base' },
      { year: '2023', price: 5100, priceStr: '₹5,100', growth: '+15.9%' },
      { year: '2024', price: 5900, priceStr: '₹5,900', growth: '+34.0%' },
      { year: '2025', price: 6600, priceStr: '₹6,600', growth: '+50.0%' },
      { year: '2026', price: 7200, priceStr: '₹7,200', growth: '+62.4%' },
      { year: '2027 (AI Proj)', price: 8100, priceStr: '₹8,100', growth: '+84.0%' }
    ],
    yieldBreakdown: [
      { type: '1 BHK Executive Suite', rent: '₹15k - ₹18k', yield: '5.10%', demand: 'High' },
      { type: '2 BHK Premium Smart Home', rent: '₹22k - ₹28k', yield: '4.85%', demand: 'Very High' },
      { type: '3 BHK Luxury Family Suite', rent: '₹32k - ₹42k', yield: '4.30%', demand: 'Moderate' },
      { type: 'Commercial Workspace Desk', rent: '₹55/sqft', yield: '5.80%', demand: 'Emerging' }
    ]
  }
};

const COMPARISON_MATRIX = [
  { metric: 'Avg Price / sq.ft', hinjewadi: '₹7,800', wakad: '₹8,650', baner: '₹11,200', mahalunge: '₹7,200' },
  { metric: '5-Year Growth Rate', hinjewadi: '+55.5%', wakad: '+46.0%', baner: '+42.8%', mahalunge: '+62.4%' },
  { metric: 'Annual Capital Appreciation', hinjewadi: '+12.5%', wakad: '+10.8%', baner: '+9.9%', mahalunge: '+13.2%' },
  { metric: 'Occupancy Rate', hinjewadi: '97.2%', wakad: '95.0%', baner: '93.5%', mahalunge: '91.0%' },
  { metric: 'Tenant Profile', hinjewadi: 'IT / Tech Leads', wakad: 'IT & Finance Families', baner: 'HNWIs & CXOs', mahalunge: 'Young Techies' },
  { metric: 'MahaRERA Risk Rating', hinjewadi: 'AAA (Low Risk)', wakad: 'AA+ (Stable)', baner: 'AAA (Luxury)', mahalunge: 'AA (High Growth)' }
];

export default function DataLabsView({ onBack, onOpenInquiry }) {
  const [selectedCorridor, setSelectedCorridor] = useState('ALL');
  const [activeTab, setActiveTab] = useState('telemetry'); // telemetry | simulator | matrix | insights
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Live ROI Calculator state
  const [calcPropertyValue, setCalcPropertyValue] = useState(8500000);
  const [calcMonthlyRent, setCalcMonthlyRent] = useState(32000);
  const [calcHoldingYears, setCalcHoldingYears] = useState(5);

  const currentData = CORRIDOR_DATA[selectedCorridor] || CORRIDOR_DATA.ALL;

  // ROI Calculations
  const annualRent = calcMonthlyRent * 12;
  const currentYield = ((annualRent / calcPropertyValue) * 100).toFixed(2);
  const estimatedAppreciationRate = parseFloat(currentData.appreciation5Yr) / 5;
  const projectedFutureValue = Math.round(calcPropertyValue * Math.pow(1 + estimatedAppreciationRate / 100, calcHoldingYears));
  const capitalGain = projectedFutureValue - calcPropertyValue;
  const totalRentalEarned = annualRent * calcHoldingYears;
  const totalReturn = capitalGain + totalRentalEarned;
  const totalROI = ((totalReturn / calcPropertyValue) * 100).toFixed(1);

  // Alternative Asset Comparison
  const fdReturns = Math.round(calcPropertyValue * (Math.pow(1 + 0.068, calcHoldingYears) - 1)); // 6.8% FD
  const goldReturns = Math.round(calcPropertyValue * (Math.pow(1 + 0.095, calcHoldingYears) - 1)); // 9.5% Gold

  return (
    <div style={{ color: '#F8FAFC', fontFamily: "'Inter', 'Montserrat', sans-serif", background: '#030712', minHeight: '100vh' }}>
      
      {/* ── FORBES SAAS TICKER BAR ───────────────────────────────────────── */}
      <div 
        style={{
          background: 'linear-gradient(90deg, #090D16 0%, #0F172A 100%)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
          padding: '10px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <span style={{ background: '#F59E0B', color: '#030712', fontSize: '0.68rem', fontWeight: 900, padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            FORBES TERMINAL
          </span>
          <span style={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
            LIVE TELEMETRY
          </span>
        </div>

        {/* Ticker marquee */}
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', flex: 1, fontSize: '0.76rem', color: 'rgba(248,250,252,0.7)' }}>
          <div style={{ display: 'inline-block', animation: 'marquee 25s linear infinite' }}>
            {MARKET_TICKER.join('   •   ')}
          </div>
        </div>

        <button 
          onClick={onBack}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#F59E0B',
            padding: '6px 14px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.75rem',
            flexShrink: 0
          }}
        >
          ← Exit Terminal
        </button>
      </div>

      {/* ── MAIN FORBES SAAS CONTAINER ───────────────────────────────────── */}
      <div style={{ maxWidth: '1420px', margin: '0 auto', padding: '36px 20px 80px 20px' }}>
        
        {/* Forbes Header Title Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '24px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#F59E0B', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              <Globe size={15} /> FORBES &amp; SAAS REAL ESTATE INTELLIGENCE SUITE
            </div>
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#FFFFFF', margin: 0, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              24K MARKET TRENDS <span style={{ color: '#F59E0B' }}>v3.4 PRO</span>
            </h1>
            <p style={{ color: 'rgba(248,250,252,0.6)', fontSize: '0.94rem', maxWidth: '750px', marginTop: '8px', lineHeight: 1.6 }}>
              Institutional-grade property market telemetry, predictive machine learning valuation models, and MahaRERA audit metrics for Pune West.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => onOpenInquiry && onOpenInquiry({ id: null, title: 'Download Institutional Dossier PDF', price: '0', location: selectedCorridor, transactionType: 'BUY' })}
              style={{
                background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                border: 'none',
                color: '#030712',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 24px rgba(245,158,11,0.3)'
              }}
            >
              <Download size={16} /> Download Q3 Research Dossier (PDF)
            </button>
          </div>
        </div>

        {/* ── FORBES SAAS TAB NAVIGATION ───────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '32px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {[
            { id: 'telemetry', label: '📊 Market Telemetry & Price Index', icon: LineChart },
            { id: 'simulator', label: '⚡ Real-Time ROI & Investment Engine', icon: Calculator },
            { id: 'matrix', label: '⚔️ Corridor Comparison Matrix', icon: Layers },
            { id: 'insights', label: '📜 Forbes Macro Insights & Risk Audit', icon: ShieldCheck }
          ].map(tab => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #F59E0B' : '3px solid transparent',
                  color: isActive ? '#F59E0B' : 'rgba(248,250,252,0.5)',
                  padding: '12px 20px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                <TabIcon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── TAB 1: MARKET TELEMETRY & PRICE INDEX ────────────────────────── */}
        {activeTab === 'telemetry' && (
          <div>
            {/* Corridor Selector Filter Bar */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '28px' }}>
              {[
                { id: 'ALL', label: '🌐 All Pune West' },
                { id: 'HINJEWADI', label: '💻 Hinjewadi IT Hub' },
                { id: 'WAKAD', label: '🛣️ Wakad Junction' },
                { id: 'BANER', label: '🛍️ Baner & High St' },
                { id: 'MAHALUNGE', label: '🏙️ Mahalunge Smart City' }
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCorridor(c.id)}
                  style={{
                    background: selectedCorridor === c.id ? 'rgba(245,158,11,0.15)' : 'rgba(15, 23, 42, 0.6)',
                    border: selectedCorridor === c.id ? '1px solid #F59E0B' : '1px solid rgba(255,255,255,0.08)',
                    color: selectedCorridor === c.id ? '#F59E0B' : 'rgba(248,250,252,0.6)',
                    padding: '8px 18px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Forbes 4 KPI Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              {[
                { label: 'AVERAGE SQ.FT BENCHMARK', val: currentData.avgPrice, sub: 'Weighted median transaction rate', color: '#F59E0B', icon: Building2 },
                { label: '5-YEAR APPRECIATION RATE', val: currentData.appreciation5Yr, sub: 'Peak growth in West Maharashtra', color: '#10B981', icon: TrendingUp },
                { label: 'ANNUAL CAPITAL APPRECIATION', val: currentData.avgYield, sub: 'IT Workforce driven growth', color: '#F59E0B', icon: TrendingUp },
                { label: 'MAHARERA RISK RATING', val: currentData.riskGrade, sub: 'Audit verified developer track', color: '#10B981', icon: ShieldCheck }
              ].map((kpi, idx) => {
                const KIcon = kpi.icon;
                return (
                  <div key={idx} style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '22px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.66rem', color: 'rgba(248,250,252,0.4)', fontWeight: 800, letterSpacing: '0.08em' }}>{kpi.label}</span>
                      <KIcon size={18} color={kpi.color} />
                    </div>
                    <div style={{ fontSize: '1.9rem', fontWeight: 800, color: kpi.color, fontFamily: "'Cinzel', serif", marginBottom: '4px' }}>{kpi.val}</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(248,250,252,0.45)' }}>{kpi.sub}</div>
                  </div>
                );
              })}
            </div>

            {/* SVG Interactive Line Chart & Capital Growth Breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '28px', marginBottom: '40px' }}>
              
              {/* Chart 1: Price Growth Curve */}
              <div style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '26px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.2rem', color: '#FFF', margin: 0 }}>📈 5-Yr Price Appreciation Index</h3>
                    <p style={{ fontSize: '0.76rem', color: 'rgba(248,250,252,0.4)', margin: '4px 0 0 0' }}>Historical trajectory for {currentData.name}</p>
                  </div>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(245,158,11,0.15)', color: '#F59E0B', padding: '4px 10px', borderRadius: '4px', fontWeight: 700 }}>
                    {currentData.appreciation5Yr}
                  </span>
                </div>

                <div style={{ height: '260px', position: 'relative' }}>
                  <svg viewBox="0 0 540 240" style={{ width: '100%', height: '100%' }}>
                    {[40, 90, 140, 190].map((yVal, idx) => (
                      <line key={idx} x1="50" y1={yVal} x2="510" y2={yVal} stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />
                    ))}

                    {(() => {
                      const points = currentData.chartData.map((d, i) => {
                        const x = 60 + i * 85;
                        const y = 210 - ((d.price - 4000) / 9000) * 160;
                        return { x, y, data: d };
                      });

                      const pathString = points.map((p, i) => (i === 0 ? 'M ' : 'L ') + p.x + ' ' + p.y).join(' ');
                      const areaString = pathString + ' L ' + points[points.length - 1].x + ' 210 L ' + points[0].x + ' 210 Z';

                      return (
                        <g>
                          <defs>
                            <linearGradient id="chartGradForbes" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path d={areaString} fill="url(#chartGradForbes)" />
                          <path d={pathString} fill="none" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />

                          {points.map((p, i) => (
                            <g key={i} style={{ cursor: 'pointer' }} onMouseEnter={() => setHoveredPoint(p.data)} onMouseLeave={() => setHoveredPoint(null)}>
                              <circle cx={p.x} cy={p.y} r="6" fill="#030712" stroke="#F59E0B" strokeWidth="3" />
                              <text x={p.x} y={p.y - 12} fill="#F59E0B" fontSize="10" fontWeight="bold" textAnchor="middle">{p.data.priceStr}</text>
                              <text x={p.x} y="230" fill="rgba(248,250,252,0.4)" fontSize="10" textAnchor="middle">{p.data.year}</text>
                            </g>
                          ))}
                        </g>
                      );
                    })()}
                  </svg>
                </div>
              </div>

              {/* Chart 2: Typology Growth Typology */}
              <div style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '26px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.2rem', color: '#FFF', margin: 0 }}>💰 Typology Demand Breakdown</h3>
                    <p style={{ fontSize: '0.76rem', color: 'rgba(248,250,252,0.4)', margin: '4px 0 0 0' }}>Annual demand index by bedroom category in {currentData.name}</p>
                  </div>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '4px 10px', borderRadius: '4px', fontWeight: 700 }}>
                    Peak Demand: {currentData.avgYield}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {currentData.yieldBreakdown.map((item, idx) => {
                    const numYield = parseFloat(item.yield);
                    const percentWidth = Math.min((numYield / 8) * 100, 100);
                    return (
                      <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 700, color: '#FFF' }}>{item.type}</span>
                          <span style={{ color: '#F59E0B', fontWeight: 800 }}>{item.yield}</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: percentWidth + '%', height: '100%', background: 'linear-gradient(90deg, #F59E0B, #10B981)', borderRadius: '4px' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(248,250,252,0.4)', marginTop: '6px' }}>
                          <span>Avg Rent: {item.rent}</span>
                          <span style={{ color: '#10B981' }}>Demand: {item.demand}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── TAB 2: REAL-TIME ROI & INVESTMENT SIMULATOR ─────────────────── */}
        {activeTab === 'simulator' && (
          <div style={{ background: '#0F172A', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '20px', padding: '36px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <Calculator size={22} color="#F59E0B" />
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', color: '#FFF', margin: 0, fontWeight: 800 }}>
                Forbes Institutional ROI &amp; Asset Comparison Engine
              </h3>
            </div>
            <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: '0.86rem', margin: '0 0 32px 0' }}>
              Simulate property appreciation, rental compounding, and compare returns against Fixed Deposits and Gold.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px' }}>
              {/* Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '8px' }}>
                    <span style={{ color: 'rgba(248,250,252,0.6)' }}>Property Purchase Capital:</span>
                    <span style={{ color: '#F59E0B', fontWeight: 800 }}>₹{(calcPropertyValue / 100000).toFixed(2)} Lakhs</span>
                  </div>
                  <input type="range" min="4000000" max="40000000" step="500000" value={calcPropertyValue} onChange={e => setCalcPropertyValue(Number(e.target.value))} style={{ width: '100%', accentColor: '#F59E0B', cursor: 'pointer' }} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '8px' }}>
                    <span style={{ color: 'rgba(248,250,252,0.6)' }}>Expected Monthly Rent Income:</span>
                    <span style={{ color: '#10B981', fontWeight: 800 }}>₹{(calcMonthlyRent).toLocaleString('en-IN')}/mo</span>
                  </div>
                  <input type="range" min="15000" max="120000" step="1000" value={calcMonthlyRent} onChange={e => setCalcMonthlyRent(Number(e.target.value))} style={{ width: '100%', accentColor: '#10B981', cursor: 'pointer' }} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '8px' }}>
                    <span style={{ color: 'rgba(248,250,252,0.6)' }}>Holding Period:</span>
                    <span style={{ color: '#FFF', fontWeight: 800 }}>{calcHoldingYears} Years</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {[3, 5, 7, 10].map(y => (
                      <button key={y} onClick={() => setCalcHoldingYears(y)} style={{ flex: 1, background: calcHoldingYears === y ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.04)', border: calcHoldingYears === y ? '1px solid #F59E0B' : '1px solid rgba(255,255,255,0.1)', color: calcHoldingYears === y ? '#F59E0B' : 'rgba(248,250,252,0.6)', padding: '10px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
                        {y} Yrs
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Asset Comparison Output */}
              <div style={{ background: '#030712', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(248,250,252,0.4)', textTransform: 'uppercase' }}>Annual Capital Appreciation</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>{currentYield}%</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(248,250,252,0.4)', textTransform: 'uppercase' }}>Total Rent Income</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F59E0B' }}>₹{(totalRentalEarned / 100000).toFixed(2)} L</div>
                  </div>
                </div>

                {/* Forbes Asset Class Comparison Table */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(248,250,252,0.5)', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 800 }}>
                    Asset Class Comparison ({calcHoldingYears}-Year Net Profit)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '6px', color: '#F59E0B', fontWeight: 800 }}>
                      <span>🏢 24K Real Estate Total Return:</span>
                      <span>+₹{(totalReturn / 100000).toFixed(2)} L (+{totalROI}%)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', color: 'rgba(248,250,252,0.6)' }}>
                      <span>📈 Gold Benchmark (9.5% CAGR):</span>
                      <span>+₹{(goldReturns / 100000).toFixed(2)} L</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', color: 'rgba(248,250,252,0.6)' }}>
                      <span>🏦 Bank Fixed Deposit (6.8% PA):</span>
                      <span>+₹{(fdReturns / 100000).toFixed(2)} L</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: CORRIDOR COMPARISON MATRIX ───────────────────────────── */}
        {activeTab === 'matrix' && (
          <div style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px', overflowX: 'auto' }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', color: '#FFF', margin: '0 0 8px 0' }}>
              ⚔️ Pune West Corridor Head-to-Head Matrix
            </h3>
            <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: '0.86rem', margin: '0 0 24px 0' }}>
              Comparative breakdown across pricing, capital appreciation, tenant demographic profiles, and MahaRERA audit status.
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(245,158,11,0.3)', color: '#F59E0B' }}>
                  <th style={{ padding: '14px', textTransform: 'uppercase' }}>Key Benchmark</th>
                  <th style={{ padding: '14px' }}>💻 Hinjewadi IT</th>
                  <th style={{ padding: '14px' }}>🛣️ Wakad Junction</th>
                  <th style={{ padding: '14px' }}>🛍️ Baner High St</th>
                  <th style={{ padding: '14px' }}>🏙️ Mahalunge Township</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_MATRIX.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <td style={{ padding: '14px', fontWeight: 700, color: '#FFF' }}>{row.metric}</td>
                    <td style={{ padding: '14px', color: 'rgba(248,250,252,0.8)' }}>{row.hinjewadi}</td>
                    <td style={{ padding: '14px', color: 'rgba(248,250,252,0.8)' }}>{row.wakad}</td>
                    <td style={{ padding: '14px', color: 'rgba(248,250,252,0.8)' }}>{row.baner}</td>
                    <td style={{ padding: '14px', color: 'rgba(248,250,252,0.8)' }}>{row.mahalunge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── TAB 4: FORBES MACRO INSIGHTS ─────────────────────────────────── */}
        {activeTab === 'insights' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
            {[
              {
                title: 'Metro Line 3 Connectivity Impact',
                tag: 'INFRASTRUCTURE TELEMETRY',
                desc: 'The completion of Metro Line 3 (Hinjewadi to Shivajinagar) is projected to reduce transit times by 45 mins, driving an immediate 12-15% capital re-rating across Hinjewadi and Wakad stations.'
              },
              {
                title: 'IT & Global Capability Center (GCC) Absorption',
                tag: 'WORKFORCE DEMAND',
                desc: 'Over 22,000 new tech engineers entered Rajiv Gandhi Infotech Park in Q2 2026. Executive 2BHK rental absorption period has dropped to an all-time low of 11 days.'
              },
              {
                title: 'MahaRERA Transparency & Escrow Mandates',
                tag: 'LEGAL SECURITY',
                desc: 'All 24K Realtors partner projects maintain 100% MahaRERA registration and escrow compliance, ensuring zero construction delay risks for property buyers.'
              }
            ].map((insight, idx) => (
              <div key={idx} style={{ background: '#0F172A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '26px' }}>
                <span style={{ fontSize: '0.68rem', background: 'rgba(245,158,11,0.15)', color: '#F59E0B', padding: '4px 10px', borderRadius: '4px', fontWeight: 800, letterSpacing: '0.06em' }}>
                  {insight.tag}
                </span>
                <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.15rem', color: '#FFF', margin: '14px 0 8px 0' }}>{insight.title}</h4>
                <p style={{ color: 'rgba(248,250,252,0.6)', fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>{insight.desc}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
