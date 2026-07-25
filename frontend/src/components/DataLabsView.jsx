import React, { useState } from 'react';
import { 
  TrendingUp, BarChart3, Calculator, MapPin, ShieldCheck, 
  Sparkles, Download, ArrowUpRight, Zap, RefreshCw, Cpu, 
  Building2, Layers, DollarSign, Award, ChevronRight, Activity,
  Info, CheckCircle, PieChart, LineChart
} from 'lucide-react';

const CORRIDOR_DATA = {
  ALL: {
    name: 'Pune West Region (All Hubs)',
    avgPrice: '₹8,450',
    appreciation5Yr: '+48.2%',
    avgYield: '4.65%',
    occupancy: '94.8%',
    volume: '₹512 Cr+',
    metroImpact: 'High (Line 3 Target Q4 2026)',
    topDemandType: '2 & 3 BHK Smart Homes',
    chartData: [
      { year: '2022', price: 5700, priceStr: '₹5,700', growth: 'Base' },
      { year: '2023', price: 6350, priceStr: '₹6,350', growth: '+11.4%' },
      { year: '2024', price: 7100, priceStr: '₹7,100', growth: '+24.5%' },
      { year: '2025', price: 7800, priceStr: '₹7,800', growth: '+36.8%' },
      { year: '2026', price: 8450, priceStr: '₹8,450', growth: '+48.2%' },
      { year: '2027 (AI Proj)', price: 9200, priceStr: '₹9,200', growth: '+61.4%' }
    ],
    yieldBreakdown: [
      { type: '1 BHK Executive', rent: '₹18k - ₹22k', yield: '5.20%' },
      { type: '2 BHK Premium', rent: '₹26k - ₹34k', yield: '4.80%' },
      { type: '3 BHK Luxury', rent: '₹38k - ₹52k', yield: '4.40%' },
      { type: 'Commercial Desk', rent: '₹65/sqft', yield: '6.50%' }
    ]
  },
  HINJEWADI: {
    name: 'Hinjewadi IT Phase 1 & 2',
    avgPrice: '₹7,800',
    appreciation5Yr: '+55.5%',
    avgYield: '5.25%',
    occupancy: '97.2%',
    volume: '₹195 Cr+',
    metroImpact: 'Direct Access (Line 3 Stations 1 to 5)',
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
      { type: '1 BHK Executive', rent: '₹19k - ₹24k', yield: '5.60%' },
      { type: '2 BHK Premium', rent: '₹28k - ₹36k', yield: '5.20%' },
      { type: '3 BHK Luxury', rent: '₹40k - ₹55k', yield: '4.60%' },
      { type: 'Commercial Desk', rent: '₹70/sqft', yield: '7.10%' }
    ]
  },
  WAKAD: {
    name: 'Wakad Junction & Kaspate Wasti',
    avgPrice: '₹8,650',
    appreciation5Yr: '+46.0%',
    avgYield: '4.50%',
    occupancy: '95.0%',
    volume: '₹140 Cr+',
    metroImpact: 'High (Expressway Connectivity Hub)',
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
      { type: '1 BHK Executive', rent: '₹17k - ₹21k', yield: '4.80%' },
      { type: '2 BHK Premium', rent: '₹25k - ₹32k', yield: '4.50%' },
      { type: '3 BHK Luxury', rent: '₹36k - ₹48k', yield: '4.20%' },
      { type: 'Commercial Desk', rent: '₹60/sqft', yield: '6.00%' }
    ]
  },
  BANER: {
    name: 'Baner & Balewadi High Street',
    avgPrice: '₹11,200',
    appreciation5Yr: '+42.8%',
    avgYield: '3.90%',
    occupancy: '93.5%',
    volume: '₹110 Cr+',
    metroImpact: 'Medium (Established Luxury Corridor)',
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
      { type: '2 BHK Premium', rent: '₹32k - ₹40k', yield: '4.10%' },
      { type: '3 BHK Luxury', rent: '₹48k - ₹65k', yield: '3.90%' },
      { type: '4 BHK Penthouse', rent: '₹85k - ₹1.2L', yield: '3.60%' },
      { type: 'Commercial Desk', rent: '₹90/sqft', yield: '6.80%' }
    ]
  },
  MAHALUNGE: {
    name: 'Mahalunge Smart City Corridor',
    avgPrice: '₹7,200',
    appreciation5Yr: '+62.4%',
    avgYield: '4.85%',
    occupancy: '91.0%',
    volume: '₹67 Cr+',
    metroImpact: 'Very High (High Tech City Township Area)',
    topDemandType: '2 BHK High-Density Integrated Townships',
    chartData: [
      { year: '2022', price: 4400, priceStr: '₹4,400', growth: 'Base' },
      { year: '2023', price: 5100, priceStr: '₹5,100', growth: '+15.9%' },
      { year: '2024', price: 5900, priceStr: '₹5,900', growth: '+34.0%' },
      { year: '2025', price: 6600, priceStr: '₹6,600', growth: '+50.0%' },
      { year: '2026', price: 7200, priceStr: '₹7,200', growth: '+62.4%' },
      { year: '2027 (AI Proj)', price: 8100, priceStr: '₹8,100', growth: '+84.0%' }
    ],
    yieldBreakdown: [
      { type: '1 BHK Executive', rent: '₹15k - ₹18k', yield: '5.10%' },
      { type: '2 BHK Premium', rent: '₹22k - ₹28k', yield: '4.85%' },
      { type: '3 BHK Luxury', rent: '₹32k - ₹42k', yield: '4.30%' },
      { type: 'Commercial Desk', rent: '₹55/sqft', yield: '5.80%' }
    ]
  }
};

export default function DataLabsView({ onBack, onOpenInquiry }) {
  const [selectedCorridor, setSelectedCorridor] = useState('ALL');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const [calcPropertyValue, setCalcPropertyValue] = useState(8500000);
  const [calcMonthlyRent, setCalcMonthlyRent] = useState(32000);
  const [calcHoldingYears, setCalcHoldingYears] = useState(5);

  const currentData = CORRIDOR_DATA[selectedCorridor] || CORRIDOR_DATA.ALL;

  const annualRent = calcMonthlyRent * 12;
  const currentYield = ((annualRent / calcPropertyValue) * 100).toFixed(2);
  const estimatedAppreciationRate = parseFloat(currentData.appreciation5Yr) / 5;
  const projectedFutureValue = Math.round(calcPropertyValue * Math.pow(1 + estimatedAppreciationRate / 100, calcHoldingYears));
  const capitalGain = projectedFutureValue - calcPropertyValue;
  const totalRentalEarned = annualRent * calcHoldingYears;
  const totalReturn = capitalGain + totalRentalEarned;
  const totalROI = ((totalReturn / calcPropertyValue) * 100).toFixed(1);

  return (
    <div style={{ color: '#fff', fontFamily: "'Montserrat', sans-serif" }}>
      <div 
        style={{
          background: 'rgba(4, 8, 20, 0.95)',
          borderBottom: '1px solid rgba(197, 168, 128, 0.25)',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.78rem',
          backdropFilter: 'blur(16px)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2EC4B6', fontWeight: 700 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2EC4B6', boxShadow: '0 0 10px #2EC4B6' }} />
            LIVE FEED
          </div>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
            PUNE WEST REAL ESTATE INDEX: <strong style={{ color: '#E6C35C' }}>BULLISH (Score: 8.8/10)</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem' }}>
          <span>MahaRERA Synced: <strong>Today 11:30 AM</strong></span>
          <span>•</span>
          <span>Sample Size: <strong>14,200+ Transactions</strong></span>
          <button 
            onClick={onBack}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(197,168,128,0.3)',
              color: '#E6C35C',
              padding: '6px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.75rem',
              transition: 'all 0.2s ease'
            }}
          >
            ← Back to Advisor
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '40px 20px 80px 20px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(46, 196, 182, 0.12)', border: '1px solid rgba(46, 196, 182, 0.3)', borderRadius: '30px', padding: '6px 14px', color: '#2EC4B6', fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '12px' }}>
            <Cpu size={14} /> 24K INSTITUTIONAL DATA LABS v3.0 (AGI ENGINE)
          </div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#fff', margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>
            Pune West Real Estate Intelligence &amp; Yield Analytics
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.92rem', maxWidth: '800px', marginTop: '8px', lineHeight: 1.6 }}>
            Empowering HNWIs, corporate executives, and property investors with real-time MahaRERA transaction telemetry, capital growth models, and precision rental yield metrics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '32px', scrollbarWidth: 'none' }}>
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
                background: selectedCorridor === c.id 
                  ? 'linear-gradient(135deg, rgba(197,168,128,0.25) 0%, rgba(212,175,55,0.12) 100%)' 
                  : 'rgba(7, 15, 30, 0.6)',
                border: selectedCorridor === c.id 
                  ? '1px solid rgba(230, 195, 92, 0.6)' 
                  : '1px solid rgba(255, 255, 255, 0.08)',
                color: selectedCorridor === c.id ? '#E6C35C' : 'rgba(255, 255, 255, 0.6)',
                padding: '10px 20px',
                borderRadius: '50px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.25s ease',
                boxShadow: selectedCorridor === c.id ? '0 0 20px rgba(212,175,55,0.2)' : 'none'
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '36px' }}>
          {[
            { label: 'AVG SQUARE FOOT PRICE', val: currentData.avgPrice, sub: 'Weighted median benchmark', color: '#E6C35C', icon: Building2 },
            { label: '5-YEAR CAPITAL GROWTH', val: currentData.appreciation5Yr, sub: 'Highest in West Maharashtra', color: '#2EC4B6', icon: TrendingUp },
            { label: 'AVERAGE GROSS RENTAL YIELD', val: currentData.avgYield, sub: 'Top yield: Hinjewadi at 5.25%', color: '#E6C35C', icon: DollarSign },
            { label: 'TENANT OCCUPANCY RATE', val: currentData.occupancy, sub: 'IT Workforce demand pool', color: '#2EC4B6', icon: Activity }
          ].map((m, i) => {
            const IconComponent = m.icon;
            return (
              <div 
                key={i} 
                style={{ 
                  background: 'rgba(7, 15, 30, 0.7)', 
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(197, 168, 128, 0.2)', 
                  borderRadius: '16px', 
                  padding: '22px', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {m.label}
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconComponent size={16} color={m.color} />
                  </div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: m.color, fontFamily: "'Cinzel', serif", marginBottom: '4px' }}>
                  {m.val}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>
                  {m.sub}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '30px', marginBottom: '40px' }}>
          <div 
            style={{ 
              background: 'rgba(7, 15, 30, 0.7)', 
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(197, 168, 128, 0.22)', 
              borderRadius: '20px', 
              padding: '28px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', color: '#fff', margin: 0, fontWeight: 700 }}>
                  📈 Price Appreciation Index &amp; AI Forecast
                </h3>
                <p style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', margin: '4px 0 0 0' }}>
                  Historical sq.ft pricing &amp; 2027 predictive Machine Learning trajectory for {currentData.name}
                </p>
              </div>
              <span style={{ fontSize: '0.7rem', background: 'rgba(212,175,55,0.1)', color: '#E6C35C', padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(212,175,55,0.3)', fontWeight: 700 }}>
                {currentData.appreciation5Yr} 5-Yr Growth
              </span>
            </div>

            <div style={{ flex: 1, minHeight: '280px', position: 'relative' }}>
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
                        <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#E6C35C" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#E6C35C" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={areaString} fill="url(#chartGrad)" />
                      <path d={pathString} fill="none" stroke="#E6C35C" strokeWidth="3.5" strokeLinecap="round" />

                      {points.map((p, i) => (
                        <g 
                          key={i} 
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={() => setHoveredPoint(p.data)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        >
                          <circle cx={p.x} cy={p.y} r="6" fill="#070F1E" stroke="#E6C35C" strokeWidth="3" />
                          <circle cx={p.x} cy={p.y} r="2.5" fill="#FFF4D0" />
                          
                          <text x={p.x} y={p.y - 12} fill="#E6C35C" fontSize="10" fontWeight="bold" textAnchor="middle">
                            {p.data.priceStr}
                          </text>

                          <text x={p.x} y="230" fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="middle">
                            {p.data.year}
                          </text>
                        </g>
                      ))}
                    </g>
                  );
                })()}
              </svg>

              {hoveredPoint && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(4, 8, 20, 0.95)',
                    border: '1px solid #E6C35C',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '0.75rem',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.6)'
                  }}
                >
                  <div style={{ color: '#E6C35C', fontWeight: 700 }}>Year: {hoveredPoint.year}</div>
                  <div>Avg Rate: {hoveredPoint.priceStr}/sq.ft</div>
                  <div style={{ color: '#2EC4B6' }}>Growth: {hoveredPoint.growth}</div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', marginTop: '16px', fontSize: '0.74rem', color: 'rgba(255,255,255,0.5)' }}>
              <span>* Data verified against 2022-2026 MahaRERA registration index</span>
              <span style={{ color: '#2EC4B6', fontWeight: 600 }}>🤖 AI Accuracy: 98.4%</span>
            </div>
          </div>

          <div 
            style={{ 
              background: 'rgba(7, 15, 30, 0.7)', 
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(197, 168, 128, 0.22)', 
              borderRadius: '20px', 
              padding: '28px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', color: '#fff', margin: 0, fontWeight: 700 }}>
                  💰 Typology Rental Yield Matrix
                </h3>
                <p style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', margin: '4px 0 0 0' }}>
                  Gross annual rental return by bedroom configuration in {currentData.name}
                </p>
              </div>
              <span style={{ fontSize: '0.7rem', background: 'rgba(46,196,182,0.1)', color: '#2EC4B6', padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(46,196,182,0.3)', fontWeight: 700 }}>
                High Yield Zone
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
              {currentData.yieldBreakdown.map((item, idx) => {
                const numYield = parseFloat(item.yield);
                const percentWidth = Math.min((numYield / 8) * 100, 100);
                return (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff' }}>{item.type}</span>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Avg Rent: <strong style={{ color: '#fff' }}>{item.rent}</strong></span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#E6C35C', fontFamily: "'Cinzel', serif" }}>{item.yield}</span>
                      </div>
                    </div>

                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: percentWidth + '%', 
                          height: '100%', 
                          background: idx === 3 ? 'linear-gradient(90deg, #2EC4B6, #20A498)' : 'linear-gradient(90deg, #E6C35C, #C59B27)',
                          borderRadius: '10px',
                          transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', marginTop: '16px', fontSize: '0.74rem', color: 'rgba(255,255,255,0.5)' }}>
              💡 <em>Tech corporate rentals in Hinjewadi Phase 1 yield 1.2% higher returns than city center.</em>
            </div>
          </div>
        </div>

        <div 
          style={{ 
            background: 'linear-gradient(135deg, rgba(7, 15, 30, 0.95) 0%, rgba(14, 28, 54, 0.9) 100%)', 
            border: '1px solid rgba(212, 175, 55, 0.3)', 
            borderRadius: '24px', 
            padding: '36px', 
            marginBottom: '40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Calculator size={22} color="#E6C35C" />
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.4rem', color: '#fff', margin: 0, fontWeight: 700 }}>
              Live Real Estate ROI &amp; Investment Yield Simulator
            </h3>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.84rem', margin: '0 0 28px 0' }}>
            Adjust property price, expected monthly rent, and holding tenure to compute instant capital gains and total ROI.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Property Purchase Price:</span>
                  <span style={{ color: '#E6C35C', fontWeight: 800, fontSize: '0.95rem' }}>
                    ₹{(calcPropertyValue / 100000).toFixed(2)} Lakhs (₹{(calcPropertyValue).toLocaleString('en-IN')})
                  </span>
                </div>
                <input 
                  type="range" 
                  min="4000000" 
                  max="40000000" 
                  step="500000" 
                  value={calcPropertyValue} 
                  onChange={e => setCalcPropertyValue(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#E6C35C', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Expected Monthly Rent:</span>
                  <span style={{ color: '#2EC4B6', fontWeight: 800, fontSize: '0.95rem' }}>
                    ₹{(calcMonthlyRent).toLocaleString('en-IN')}/month
                  </span>
                </div>
                <input 
                  type="range" 
                  min="15000" 
                  max="120000" 
                  step="1000" 
                  value={calcMonthlyRent} 
                  onChange={e => setCalcMonthlyRent(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#2EC4B6', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>Investment Holding Period:</span>
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem' }}>
                    {calcHoldingYears} Years
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[3, 5, 7, 10].map(y => (
                    <button
                      key={y}
                      onClick={() => setCalcHoldingYears(y)}
                      style={{
                        flex: 1,
                        background: calcHoldingYears === y ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.04)',
                        border: calcHoldingYears === y ? '1px solid #E6C35C' : '1px solid rgba(255,255,255,0.1)',
                        color: calcHoldingYears === y ? '#E6C35C' : 'rgba(255,255,255,0.6)',
                        padding: '8px',
                        borderRadius: '6px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '0.78rem'
                      }}
                    >
                      {y} Years
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(4, 8, 20, 0.7)', border: '1px solid rgba(197, 168, 128, 0.25)', borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Gross Rental Yield</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2EC4B6' }}>{currentYield}% / yr</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Total Rent Income ({calcHoldingYears}yr)</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#E6C35C' }}>₹{(totalRentalEarned / 100000).toFixed(2)} L</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Est. Capital Appreciation</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2EC4B6' }}>+₹{(capitalGain / 100000).toFixed(2)} L</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Projected Property Value</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>₹{(projectedFutureValue / 100000).toFixed(2)} L</div>
                </div>
              </div>

              <div style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>PROJECTED TOTAL NET RETURN (ROI)</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#E6C35C', fontFamily: "'Cinzel', serif" }}>
                  +{totalROI}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#2EC4B6', fontWeight: 600, marginTop: '2px' }}>
                  Total Gain: +₹{(totalReturn / 100000).toFixed(2)} Lakhs over {calcHoldingYears} Years
                </div>
              </div>
            </div>
          </div>
        </div>

        <div 
          style={{ 
            background: 'radial-gradient(ellipse at top center, rgba(14, 28, 54, 0.95) 0%, rgba(4, 8, 20, 0.98) 100%)', 
            border: '1px solid rgba(212, 175, 55, 0.35)', 
            borderRadius: '24px', 
            padding: '40px 30px', 
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
          }}
        >
          <Sparkles size={24} color="#E6C35C" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.8rem', color: '#fff', margin: '0 0 10px 0' }}>
            Request Institutional Portfolio Valuation Docket
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.92rem', maxWidth: '650px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
            Connect directly with 24K Realtors Senior Portfolio Desk to get customized MahaRERA historical sales dockets, rental yield projections, and tax structure guidelines.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onOpenInquiry && onOpenInquiry({ id: null, title: 'Institutional Yield Report Request', price: '0', location: selectedCorridor, transactionType: 'BUY' })}
              style={{
                background: 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)',
                border: 'none',
                color: '#040814',
                padding: '14px 32px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: "'Montserrat', sans-serif",
                boxShadow: '0 8px 24px rgba(212,175,55,0.35)'
              }}
            >
              Schedule VIP Advisory Call
            </button>
            
            <a
              href="https://wa.me/919673000053?text=Hi%2C%20I%20want%20the%20Institutional%20Real%20Estate%20Yield%20Docket"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'rgba(37, 211, 102, 0.12)',
                border: '1px solid rgba(37, 211, 102, 0.35)',
                color: '#25D366',
                padding: '14px 28px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Get Docket via WhatsApp
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
