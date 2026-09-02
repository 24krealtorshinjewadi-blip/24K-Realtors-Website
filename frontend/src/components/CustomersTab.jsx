import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users, Crown, Globe, IndianRupee, Search, Plus, 
  CheckCircle2, Clock, XCircle, Phone, MessageSquare, 
  Building2, ShieldCheck, Eye, RefreshCw, X, Loader
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { toast } from './Toast';

export default function CustomersTab({ agents }) {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedKyc, setSelectedKyc] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [drawerTab, setDrawerTab] = useState('dossier'); // dossier | portfolio

  // Create Customer Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    alternatePhone: '',
    panNumber: '',
    aadharNumber: '',
    city: 'Pune',
    state: 'Maharashtra',
    address: '',
    customerType: 'INDIVIDUAL_BUYER',
    kycStatus: 'PENDING',
    totalInvestmentAmount: '',
    notes: '',
    assignedAgentId: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch Customers & Stats
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [custRes, statsRes] = await Promise.all([
        apiService.getCustomers({ search, type: selectedType, kycStatus: selectedKyc }),
        apiService.getCustomerStats().catch(() => null)
      ]);
      const list = Array.isArray(custRes) ? custRes : (custRes?.content || []);
      setCustomers(list);
      if (statsRes) setStats(statsRes);
    } catch (err) {
      console.error('Failed to load customers:', err);
      toast.error('Failed to load customers: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [search, selectedType, selectedKyc]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchData]);

  // Handle KYC Status Toggle
  const handleKycToggle = async (customerId, currentStatus) => {
    const nextStatus = currentStatus === 'VERIFIED' ? 'PENDING' : 'VERIFIED';
    try {
      const updated = await apiService.updateCustomerKyc(customerId, nextStatus);
      toast.success(`KYC status updated to ${nextStatus}!`);
      if (selectedCustomer?.id === customerId) {
        setSelectedCustomer(updated);
      }
      fetchData();
    } catch (err) {
      toast.error('Failed to update KYC status: ' + err.message);
    }
  };

  // Handle Create Customer
  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        totalInvestmentAmount: formData.totalInvestmentAmount ? Number(formData.totalInvestmentAmount) : 0,
        assignedAgentId: formData.assignedAgentId || null
      };
      await apiService.createCustomer(payload);
      toast.success('Customer profile created successfully!');
      setShowCreateModal(false);
      setFormData({
        name: '', phone: '', email: '', alternatePhone: '',
        panNumber: '', aadharNumber: '', city: 'Pune', state: 'Maharashtra',
        address: '', customerType: 'INDIVIDUAL_BUYER', kycStatus: 'PENDING',
        totalInvestmentAmount: '', notes: '', assignedAgentId: ''
      });
      fetchData();
    } catch (err) {
      toast.error('Failed to create customer: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (val) => {
    if (!val || isNaN(val)) return '₹0';
    const num = Number(val);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} Lakh`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', color: '#FFF' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #FFF 0%, #D4AF37 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Client 360° & Investor Portfolios
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
            High-Net-Worth Individuals, NRI investors & luxury property buyers dossier
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={fetchData} 
            className="btn-outline" 
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.3)', color: '#FFF', cursor: 'pointer' }}
          >
            <RefreshCw size={15} /> Refresh
          </button>
          <button 
            onClick={() => setShowCreateModal(true)} 
            className="btn-gold" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
          >
            <Plus size={16} /> Register Client
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ background: 'rgba(25,25,25,0.6)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', padding: '20px', backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>TOTAL CLIENT BASE</span>
            <Users size={18} color="#D4AF37" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF', marginTop: '10px' }}>
            {stats ? stats.totalCustomers : customers.length}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#10B981', marginTop: '4px' }}>Active CRM Portfolios</div>
        </div>

        <div style={{ background: 'rgba(25,25,25,0.6)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', padding: '20px', backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>HNI INVESTORS</span>
            <Crown size={18} color="#F59E0B" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F59E0B', marginTop: '10px' }}>
            {stats ? stats.hniInvestors : customers.filter(c => c.customerType === 'HNI_INVESTOR').length}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Portfolio &gt; ₹2.5 Crore</div>
        </div>

        <div style={{ background: 'rgba(25,25,25,0.6)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', padding: '20px', backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>NRI INVESTORS</span>
            <Globe size={18} color="#8B5CF6" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#A78BFA', marginTop: '10px' }}>
            {stats ? stats.nriInvestors : customers.filter(c => c.customerType === 'NRI_INVESTOR').length}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Global Portfolio Clients</div>
        </div>

        <div style={{ background: 'rgba(25,25,25,0.6)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', padding: '20px', backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>PORTFOLIO MANAGED</span>
            <IndianRupee size={18} color="#10B981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981', marginTop: '10px' }}>
            {stats ? formatCurrency(stats.totalPortfolioValue) : formatCurrency(customers.reduce((acc, c) => acc + (Number(c.totalInvestmentAmount) || 0), 0))}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#10B981', marginTop: '4px' }}>Total Assets Under Advisory</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ background: 'rgba(20,20,20,0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
        <div style={{ flex: '1 1 250px', position: 'relative' }}>
          <Search size={16} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search by client name, phone, email, PAN..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', padding: '9px 12px 9px 36px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF', fontSize: '0.85rem' }} 
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: '', label: 'All Clients' },
            { id: 'HNI_INVESTOR', label: '👑 HNI Investors' },
            { id: 'NRI_INVESTOR', label: '🌍 NRI' },
            { id: 'INDIVIDUAL_BUYER', label: '🏠 Individual' },
            { id: 'CORPORATE', label: '🏢 Corporate' }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              style={{
                padding: '7px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                background: selectedType === type.id ? 'var(--gold-primary, #D4AF37)' : 'rgba(255,255,255,0.06)',
                color: selectedType === type.id ? '#000' : 'rgba(255,255,255,0.7)',
                transition: 'all 0.2s'
              }}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* KYC Status Filter */}
        <select 
          value={selectedKyc} 
          onChange={(e) => setSelectedKyc(e.target.value)}
          style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#FFF', fontSize: '0.8rem', cursor: 'pointer' }}
        >
          <option value="">All KYC Status</option>
          <option value="VERIFIED">✅ Verified KYC</option>
          <option value="PENDING">⏳ Pending KYC</option>
          <option value="REJECTED">❌ Rejected KYC</option>
        </select>
      </div>

      {/* Customer Table */}
      <div style={{ background: 'rgba(18,18,18,0.8)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
            <Loader size={30} className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
            <div>Loading client portfolios...</div>
          </div>
        ) : customers.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
            <Users size={40} style={{ margin: '0 auto 12px auto', opacity: 0.3 }} />
            <div style={{ fontSize: '1rem', fontWeight: 600 }}>No clients found</div>
            <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>Try changing search filters or convert a won lead into a client.</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 18px' }}>Client Profile</th>
                  <th style={{ padding: '14px 18px' }}>Category</th>
                  <th style={{ padding: '14px 18px' }}>KYC Status</th>
                  <th style={{ padding: '14px 18px' }}>Portfolio Value</th>
                  <th style={{ padding: '14px 18px' }}>Units</th>
                  <th style={{ padding: '14px 18px' }}>Relationship Mgr</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => {
                  const typeStyles = {
                    HNI_INVESTOR: { bg: 'rgba(212,175,55,0.15)', text: '#D4AF37', label: '👑 HNI Investor' },
                    NRI_INVESTOR: { bg: 'rgba(139,92,246,0.15)', text: '#A78BFA', label: '🌍 NRI Investor' },
                    INDIVIDUAL_BUYER: { bg: 'rgba(59,130,246,0.15)', text: '#60A5FA', label: '🏠 Individual' },
                    CORPORATE: { bg: 'rgba(16,185,129,0.15)', text: '#34D399', label: '🏢 Corporate' }
                  };
                  const typeConfig = typeStyles[c.customerType] || typeStyles.INDIVIDUAL_BUYER;

                  return (
                    <tr 
                      key={c.id} 
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s', cursor: 'pointer' }}
                      onClick={() => setSelectedCustomer(c)}
                    >
                      {/* Name & Contact */}
                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #242424 0%, #111 100%)', border: '1px solid rgba(212,175,55,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#D4AF37', fontSize: '0.9rem' }}>
                            {c.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#FFF', fontSize: '0.9rem' }}>{c.name}</div>
                            <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                              {c.phone} {c.email ? `• ${c.email}` : ''}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: '16px 18px' }}>
                        <span style={{ background: typeConfig.bg, color: typeConfig.text, padding: '3px 9px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
                          {typeConfig.label}
                        </span>
                      </td>

                      {/* KYC Status */}
                      <td style={{ padding: '16px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            background: c.kycStatus === 'VERIFIED' ? 'rgba(16,185,129,0.15)' : c.kycStatus === 'REJECTED' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                            color: c.kycStatus === 'VERIFIED' ? '#34D399' : c.kycStatus === 'REJECTED' ? '#F87171' : '#FBBF24'
                          }}>
                            {c.kycStatus === 'VERIFIED' ? <CheckCircle2 size={12} /> : c.kycStatus === 'REJECTED' ? <XCircle size={12} /> : <Clock size={12} />}
                            {c.kycStatus}
                          </span>
                          <button
                            title="Toggle KYC Status"
                            onClick={(e) => { e.stopPropagation(); handleKycToggle(c.id, c.kycStatus); }}
                            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '2px' }}
                          >
                            <ShieldCheck size={14} />
                          </button>
                        </div>
                      </td>

                      {/* Portfolio Value */}
                      <td style={{ padding: '16px 18px', fontWeight: 700, color: '#10B981' }}>
                        {formatCurrency(c.totalInvestmentAmount)}
                      </td>

                      {/* Units */}
                      <td style={{ padding: '16px 18px', color: 'rgba(255,255,255,0.8)' }}>
                        {c.activeBookingsCount || (c.bookings ? c.bookings.length : 0)} Units
                      </td>

                      {/* RM */}
                      <td style={{ padding: '16px 18px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                        {c.assignedAgentName || 'Unassigned'}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                          <a 
                            href={`tel:${c.phone}`}
                            title="Call Client"
                            style={{ padding: '6px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#FFF', display: 'flex' }}
                          >
                            <Phone size={13} />
                          </a>
                          <a 
                            href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`} 
                            target="_blank" 
                            rel="noreferrer"
                            title="WhatsApp Chat"
                            style={{ padding: '6px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', color: '#10B981', display: 'flex' }}
                          >
                            <MessageSquare size={13} />
                          </a>
                          <button 
                            onClick={() => setSelectedCustomer(c)}
                            title="View 360° Dossier"
                            style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', fontWeight: 600 }}
                          >
                            <Eye size={13} /> 360°
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer 360° Drawer Modal */}
      {selectedCustomer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: '640px', background: '#121212', height: '100%', borderLeft: '1px solid rgba(212,175,55,0.3)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            
            {/* Drawer Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #2A2A2A 0%, #151515 100%)', border: '2px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#D4AF37', fontSize: '1.1rem' }}>
                  {selectedCustomer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{selectedCustomer.name}</h2>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                    Client ID: {selectedCustomer.id.slice(0, 8)} • Joined {new Date(selectedCustomer.createdDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Contact & Action Ribbon */}
            <div style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '10px' }}>
              <a 
                href={`tel:${selectedCustomer.phone}`} 
                style={{ flex: 1, padding: '8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.78rem', textDecoration: 'none' }}
              >
                <Phone size={14} /> Call ({selectedCustomer.phone})
              </a>
              <a 
                href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noreferrer"
                style={{ flex: 1, padding: '8px', borderRadius: '6px', background: 'rgba(16,185,129,0.15)', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.78rem', textDecoration: 'none' }}
              >
                <MessageSquare size={14} /> WhatsApp
              </a>
              <button
                onClick={() => handleKycToggle(selectedCustomer.id, selectedCustomer.kycStatus)}
                style={{ padding: '8px 12px', borderRadius: '6px', background: selectedCustomer.kycStatus === 'VERIFIED' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.2)', color: selectedCustomer.kycStatus === 'VERIFIED' ? '#F87171' : '#34D399', border: 'none', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
              >
                {selectedCustomer.kycStatus === 'VERIFIED' ? 'Revoke KYC' : 'Verify KYC'}
              </button>
            </div>

            {/* Drawer Subtabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <button 
                onClick={() => setDrawerTab('dossier')}
                style={{ flex: 1, padding: '12px', border: 'none', background: 'none', borderBottom: drawerTab === 'dossier' ? '2px solid #D4AF37' : 'none', color: drawerTab === 'dossier' ? '#D4AF37' : 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Profile & KYC Dossier
              </button>
              <button 
                onClick={() => setDrawerTab('portfolio')}
                style={{ flex: 1, padding: '12px', border: 'none', background: 'none', borderBottom: drawerTab === 'portfolio' ? '2px solid #D4AF37' : 'none', color: drawerTab === 'portfolio' ? '#D4AF37' : 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Property Portfolio ({selectedCustomer.bookings?.length || 0})
              </button>
            </div>

            {/* Tab Content */}
            <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
              {drawerTab === 'dossier' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* Summary Metric Box */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.15)' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>Total Portfolio Value</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>
                        {formatCurrency(selectedCustomer.totalInvestmentAmount)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>Customer Category</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#D4AF37', marginTop: '2px' }}>
                        {selectedCustomer.customerType.replace('_', ' ')}
                      </div>
                    </div>
                  </div>

                  {/* KYC & Identity */}
                  <div>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>
                      Identity & Verification
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.82rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '6px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>PAN Number</span>
                        <div style={{ fontWeight: 600, marginTop: '2px' }}>{selectedCustomer.panNumber || 'Not provided'}</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '6px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>Aadhar Number</span>
                        <div style={{ fontWeight: 600, marginTop: '2px' }}>{selectedCustomer.aadharNumber ? `XXXX-XXXX-${selectedCustomer.aadharNumber.slice(-4)}` : 'Not provided'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Location & Address */}
                  <div>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>
                      Residence & Address
                    </h3>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '6px', fontSize: '0.82rem' }}>
                      <div><strong>City / State:</strong> {selectedCustomer.city}, {selectedCustomer.state}</div>
                      {selectedCustomer.address && (
                        <div style={{ marginTop: '6px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
                          <strong>Address:</strong> {selectedCustomer.address}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RM & Lead Source */}
                  <div>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>
                      Advisory & Origin
                    </h3>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '6px', fontSize: '0.82rem' }}>
                      <div><strong>Assigned Relationship Manager:</strong> {selectedCustomer.assignedAgentName || 'General Desk'} {selectedCustomer.assignedAgentPhone ? `(${selectedCustomer.assignedAgentPhone})` : ''}</div>
                      {selectedCustomer.convertedFromLeadId && (
                        <div style={{ marginTop: '6px', color: '#D4AF37' }}>
                          ✓ Converted from CRM Lead (ID: {selectedCustomer.convertedFromLeadId.slice(0, 8)})
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Client Notes */}
                  {selectedCustomer.notes && (
                    <div>
                      <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>
                        Client Portfolio Notes
                      </h3>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '6px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
                        {selectedCustomer.notes}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Portfolio Tab */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {!selectedCustomer.bookings || selectedCustomer.bookings.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                      <Building2 size={32} style={{ margin: '0 auto 8px auto', opacity: 0.3 }} />
                      <div>No properties registered under this client portfolio yet.</div>
                    </div>
                  ) : (
                    selectedCustomer.bookings.map((b, idx) => (
                      <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.2)', padding: '16px', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontWeight: 700, color: '#FFF', fontSize: '0.95rem' }}>{b.propertyTitle}</div>
                            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{b.propertyLocation}</div>
                          </div>
                          <span style={{ background: 'rgba(16,185,129,0.15)', color: '#34D399', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
                            {b.status}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.82rem' }}>
                          <div>
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>Acquisition Value</span>
                            <div style={{ fontWeight: 700, color: '#10B981' }}>{formatCurrency(b.totalPrice)}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>Payment Status</span>
                            <div style={{ fontWeight: 600, color: b.paymentReceived ? '#34D399' : '#F59E0B' }}>
                              {b.paymentReceived ? '✓ Payment Received' : '⏳ Advance Pending'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Register Client Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '580px', background: '#161616', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#FFF' }}>Register Client Profile</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateCustomer} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '75vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '4px' }}>Client Full Name *</label>
                  <input required type="text" placeholder="e.g. Vikram Singhania" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="form-input" style={{ width: '100%', margin: 0 }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '4px' }}>Phone Number *</label>
                  <input required type="tel" placeholder="+919876543210" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="form-input" style={{ width: '100%', margin: 0 }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '4px' }}>Email Address</label>
                  <input type="email" placeholder="client@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="form-input" style={{ width: '100%', margin: 0 }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '4px' }}>Client Category</label>
                  <select value={formData.customerType} onChange={e => setFormData({ ...formData, customerType: e.target.value })} className="form-input" style={{ width: '100%', margin: 0 }}>
                    <option value="INDIVIDUAL_BUYER">Individual Buyer</option>
                    <option value="HNI_INVESTOR">HNI Investor (&gt; ₹2.5 Cr)</option>
                    <option value="NRI_INVESTOR">NRI Investor</option>
                    <option value="CORPORATE">Corporate Client</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '4px' }}>PAN Number (for KYC)</label>
                  <input type="text" placeholder="ABCDE1234F" value={formData.panNumber} onChange={e => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })} className="form-input" style={{ width: '100%', margin: 0 }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '4px' }}>Initial Investment (₹)</label>
                  <input type="number" placeholder="e.g. 25000000" value={formData.totalInvestmentAmount} onChange={e => setFormData({ ...formData, totalInvestmentAmount: e.target.value })} className="form-input" style={{ width: '100%', margin: 0 }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '4px' }}>Assigned Relationship Manager</label>
                <select value={formData.assignedAgentId} onChange={e => setFormData({ ...formData, assignedAgentId: e.target.value })} className="form-input" style={{ width: '100%', margin: 0 }}>
                  <option value="">General Advisory Desk</option>
                  {agents?.map(agent => (
                    <option key={agent.id} value={agent.id}>{agent.name} ({agent.phone})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '4px' }}>Address / City</label>
                <input type="text" placeholder="e.g. Koregaon Park, Pune" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="form-input" style={{ width: '100%', margin: 0 }} />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '4px' }}>Portfolio Notes & Requirements</label>
                <textarea rows={3} placeholder="Requirements, preferred corridors, return expectation..." value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="form-input" style={{ width: '100%', margin: 0, resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-outline" style={{ padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn-gold" style={{ padding: '8px 20px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
                  {submitting ? 'Registering...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
