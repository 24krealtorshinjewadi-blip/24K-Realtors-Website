import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Building, Home, Plus, Upload, Download, Search, Filter, Sliders, Eye, Edit2, 
  MoreVertical, Share2, ChevronRight, ArrowLeft, CheckCircle2, Clock, DollarSign,
  TrendingUp, BarChart3, PieChart, Star, MapPin, Award, FileText, Activity, Layers, Grid, List,
  Loader, RefreshCw
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { toast } from './Toast';

const GOLD = '#D4AF37';

// ─── SVG Donut Component for Inventory Overview ──────────────────────────────
function InventoryDonut({ stats }) {
  const size = 130;
  const strokeWidth = 18;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const total = stats?.totalProperties || 1;
  const avail = stats?.availableProperties || 0;
  const underOffer = stats?.underOfferProperties || 0;
  const sold = stats?.soldProperties || 0;
  const rented = stats?.rentedProperties || 0;

  const segments = [
    { percent: (avail / total) * 100, color: '#10B981', label: 'Available', val: `${avail}` },
    { percent: (underOffer / total) * 100, color: '#F59E0B', label: 'Under Offer', val: `${underOffer}` },
    { percent: (sold / total) * 100, color: '#3B82F6', label: 'Sold', val: `${sold}` },
    { percent: (rented / total) * 100, color: '#8B5CF6', label: 'Rented', val: `${rented}` }
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
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', fontFamily: "'Cinzel', serif" }}>
            {stats?.totalProperties || 0}
          </span>
          <span style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.45)' }}>Total Catalog</span>
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

export default function PropertiesTab() {
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, propsRes] = await Promise.all([
        apiService.getPropertyStats().catch(() => null),
        apiService.getProperties({ size: 100 }).catch(() => ({ content: [] }))
      ]);
      setStats(statsRes);
      setProperties(propsRes?.content || propsRes || []);
    } catch (err) {
      console.error('Error fetching properties:', err);
      toast.error('Failed to load live properties catalog');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleStatusChange = async (propertyId, newStatus) => {
    try {
      await apiService.updatePropertyStatus(propertyId, newStatus);
      toast.success(`Property marked as ${newStatus}`);
      fetchProperties();
    } catch (err) {
      toast.error(`Status update failed: ${err.message}`);
    }
  };

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchSearch = !searchQuery || 
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchLocation = selectedLocation === 'ALL' || p.location === selectedLocation;
      const matchStatus = selectedStatus === 'ALL' || p.status === selectedStatus;

      return matchSearch && matchLocation && matchStatus;
    });
  }, [properties, searchQuery, selectedLocation, selectedStatus]);

  const formatPrice = (val) => {
    if (!val) return '₹0';
    const num = Number(val);
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(num / 100000).toFixed(1)} L`;
  };

  const statusBadge = (st) => {
    const map = {
      AVAILABLE: { bg: 'rgba(16,185,129,0.12)', color: '#10B981', border: 'rgba(16,185,129,0.3)' },
      UNDER_OFFER: { bg: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
      SOLD: { bg: 'rgba(212,175,55,0.12)', color: GOLD, border: `rgba(212,175,55,0.3)` },
      RENTED: { bg: 'rgba(139,92,246,0.12)', color: '#8B5CF6', border: 'rgba(139,92,246,0.3)' }
    };
    const s = map[st] || map.AVAILABLE;
    return (
      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.64rem', fontWeight: 800, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
        {st?.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', color: '#FFF' }}>
      
      {/* TOP HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Properties &amp; Luxury Catalog</span>
            {loading && <Loader size={16} className="animate-spin" color={GOLD} />}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', margin: '2px 0 0' }}>
            Live verified residential &amp; commercial property inventory across Pune
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={fetchProperties}
            style={{ padding: '7px 14px', borderRadius: '7px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* 6 TOP KPI METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
        {[
          { label: 'Total Catalog', val: stats ? stats.totalProperties : properties.length, change: 'Properties Listed', icon: Building, color: '#F59E0B' },
          { label: 'Available', val: stats ? stats.availableProperties : 0, change: 'Ready for Purchase', icon: Home, color: '#10B981' },
          { label: 'Under Offer', val: stats ? stats.underOfferProperties : 0, change: 'Active Negotiations', icon: Clock, color: '#F59E0B' },
          { label: 'Sold Properties', val: stats ? stats.soldProperties : 0, change: 'Deals Closed', icon: DollarSign, color: GOLD },
          { label: 'Rented', val: stats ? stats.rentedProperties : 0, change: 'High Yield Assets', icon: Award, color: '#8B5CF6' },
          { label: 'Avg Ticket Size', val: formatPrice(stats?.averagePrice), change: 'Premium Segment', icon: TrendingUp, color: '#3B82F6' },
        ].map((card, i) => {
          const IconC = card.icon;
          return (
            <div key={i} style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconC size={16} color={card.color} />
              </div>
              <div>
                <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700 }}>{card.label}</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF', fontFamily: "'Cinzel', serif", margin: '2px 0' }}>{card.val}</div>
                <span style={{ fontSize: '0.64rem', color: card.color, fontWeight: 600 }}>{card.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN SPLIT VIEW: LEFT CONTENT (~70%) + RIGHT SIDEBAR (~30%) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
        
        {/* LEFT: PROPERTIES CARDS GRID & FILTERS */}
        <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Corridor Filters */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
            {['ALL', 'BANER', 'WAKAD', 'KHARADI', 'HINJEWADI', 'BALEWADI', 'KOREGAON_PARK'].map(corridor => (
              <button
                key={corridor}
                onClick={() => setSelectedLocation(corridor)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: selectedLocation === corridor ? 'rgba(212,175,55,0.15)' : 'transparent',
                  color: selectedLocation === corridor ? GOLD : 'rgba(255,255,255,0.5)',
                  fontSize: '0.74rem',
                  fontWeight: selectedLocation === corridor ? 700 : 500,
                  cursor: 'pointer',
                  borderBottom: selectedLocation === corridor ? `2px solid ${GOLD}` : '2px solid transparent',
                  whiteSpace: 'nowrap'
                }}
              >
                {corridor.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Search & Status Controls */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
              <input 
                type="text" 
                placeholder="Search by title, location or address..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '7px 12px 7px 30px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.74rem', outline: 'none', boxSizing: 'border-box' }} 
              />
              <Search size={12} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
            </div>
            
            {/* Status Select */}
            <select 
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              style={{ padding: '7px 10px', borderRadius: '6px', background: '#070F1E', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', outline: 'none' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="UNDER_OFFER">Under Offer</option>
              <option value="SOLD">Sold</option>
              <option value="RENTED">Rented</option>
            </select>

            <button 
              onClick={() => { setSearchQuery(''); setSelectedLocation('ALL'); setSelectedStatus('ALL'); }}
              style={{ padding: '7px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', cursor: 'pointer' }}
            >
              Reset
            </button>
          </div>

          {/* Properties Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {filteredProperties.map((p) => (
              <div key={p.id} style={{ background: '#070F1E', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: '130px' }}>
                  <img 
                    src={p.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'} 
                    alt={p.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  {p.exclusiveDeal && (
                    <span style={{ position: 'absolute', top: '8px', left: '8px', background: GOLD, color: '#070D18', fontSize: '0.58rem', fontWeight: 900, padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.04em' }}>
                      EXCLUSIVE
                    </span>
                  )}
                  <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                    {statusBadge(p.status)}
                  </div>
                </div>

                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFF' }}>{p.title}</div>
                    <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                      {p.address || p.location}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.66rem', color: 'rgba(255,255,255,0.6)' }}>
                    <span>{p.bedrooms || 3} BHK • {p.areaSquareFeet || 1200} sq.ft.</span>
                    <span style={{ color: '#3B82F6', fontWeight: 700 }}>{p.propertyType}</span>
                  </div>

                  <div style={{ fontSize: '1rem', fontWeight: 800, color: GOLD, fontFamily: "'Cinzel', serif" }}>
                    {formatPrice(p.price)}
                  </div>

                  {/* Quick Status Toggle */}
                  <div style={{ display: 'flex', gap: '6px', marginTop: 'auto', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <select
                      value={p.status}
                      onChange={e => handleStatusChange(p.id, e.target.value)}
                      style={{
                        flex: 1,
                        padding: '5px 8px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: GOLD,
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="AVAILABLE" style={{ background: '#070F1E', color: '#10B981' }}>Available</option>
                      <option value="UNDER_OFFER" style={{ background: '#070F1E', color: '#F59E0B' }}>Under Offer</option>
                      <option value="SOLD" style={{ background: '#070F1E', color: GOLD }}>Sold</option>
                      <option value="RENTED" style={{ background: '#070F1E', color: '#8B5CF6' }}>Rented</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProperties.length === 0 && !loading && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
              No properties found matching current corridor and status filters.
            </div>
          )}

        </div>

        {/* RIGHT SIDEBAR WIDGETS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Widget 1: Inventory Overview Donut */}
          <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFF', marginBottom: '14px' }}>
              Catalog Status Breakdown
            </div>
            <InventoryDonut stats={stats} />
          </div>

          {/* Widget 2: Pune Corridors Breakdown */}
          <div style={{ background: 'rgba(10, 18, 36, 0.85)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFF', marginBottom: '12px' }}>Corridor Distribution</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.74rem' }}>
              {stats?.corridorBreakdown ? (
                Object.entries(stats.corridorBreakdown).map(([corr, count], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={12} color={GOLD} />
                      <span style={{ color: '#FFF', fontWeight: 600 }}>{corr.replace('_', ' ')}</span>
                    </div>
                    <span style={{ color: GOLD, fontSize: '0.7rem', fontWeight: 700 }}>{count} Units</span>
                  </div>
                ))
              ) : (
                ['Baner', 'Wakad', 'Hinjewadi', 'Kharadi'].map((loc, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={12} color={GOLD} />
                      <span style={{ color: '#FFF', fontWeight: 600 }}>{loc}</span>
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.68rem' }}>Active Corridor</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
