import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { 
  Users, Home, TrendingUp, Calendar, Trash2, Edit2, Plus, X, 
  Loader, RefreshCw, Lock, LogOut, Upload, Sparkles 
} from 'lucide-react';
import './Dashboard.css';

export default function Dashboard({ onViewChange }) {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(apiService.isAuthenticated());
  const [authTab, setAuthTab] = useState('login'); // login | register
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // CRM Tab management
  const [activeTab, setActiveTab] = useState('leads'); // leads | properties
  const [leads, setLeads] = useState([]);
  const [properties, setProperties] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [propsLoading, setPropsLoading] = useState(true);

  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    convertedLeads: 0,
    activeProperties: 0
  });

  // Lead Filters & Pagination
  const [leadFilters, setLeadFilters] = useState({ status: '', preferredLocation: '' });
  const [leadPage, setLeadPage] = useState(0);
  const [leadTotalPages, setLeadTotalPages] = useState(0);
  const [propPage, setPropPage] = useState(0);
  const [propTotalPages, setPropTotalPages] = useState(0);

  // Property Form Drawer State
  const [showPropForm, setShowPropForm] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    description: '',
    propertyType: 'RESIDENTIAL',
    transactionType: 'BUY',
    price: '',
    areaSquareFeet: '',
    location: 'BANER',
    address: '',
    bedrooms: 2,
    bathrooms: 2,
    status: 'AVAILABLE',
    verifiedListing: false,
    exclusiveDeal: false,
    noBrokerage: false,
    reraNumber: ''
  });

  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  // Fetch leads
  const fetchLeads = async () => {
    if (!isLoggedIn) return;
    setLeadsLoading(true);
    try {
      const data = await apiService.getLeads(leadFilters, leadPage, 8);
      setLeads(data.content || []);
      setLeadTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLeadsLoading(false);
    }
  };

  // Fetch properties
  const fetchProperties = async () => {
    if (!isLoggedIn) return;
    setPropsLoading(true);
    try {
      const data = await apiService.getProperties({ status: '' }, propPage, 10);
      setProperties(data.content || []);
      setPropTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setPropsLoading(false);
    }
  };

  // Fetch Dashboard Stats
  const fetchStats = async () => {
    if (!isLoggedIn) return;
    try {
      const dashboardStats = await apiService.getStats();
      setStats(dashboardStats);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchLeads();
      fetchStats();
    }
  }, [isLoggedIn, leadFilters, leadPage]);

  useEffect(() => {
    if (isLoggedIn && activeTab === 'properties') {
      fetchProperties();
    }
  }, [isLoggedIn, activeTab, propPage]);

  // Auth Handlers
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      if (authTab === 'login') {
        await apiService.login(authForm.username, authForm.password);
      } else {
        await apiService.register(authForm.username, authForm.password);
        alert('Registration successful! Please login.');
        setAuthTab('login');
        setAuthLoading(false);
        return;
      }
      setIsLoggedIn(true);
      setActiveTab('leads');
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    setIsLoggedIn(false);
    setLeads([]);
    setProperties([]);
  };

  // Lead Action Handlers
  const handleLeadStatusChange = async (leadId, newStatus) => {
    try {
      await apiService.updateLeadStatus(leadId, newStatus);
      fetchLeads();
      fetchStats();
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Delete this property permanently?')) return;
    try {
      await apiService.deleteProperty(propertyId);
      fetchProperties();
      fetchStats();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditPropertyClick = (property) => {
    setEditingPropertyId(property.id);
    setPropertyForm({
      title: property.title || '',
      description: property.description || '',
      propertyType: property.propertyType || 'RESIDENTIAL',
      transactionType: property.transactionType || 'BUY',
      price: property.price ? property.price.toString() : '',
      areaSquareFeet: property.areaSquareFeet ? property.areaSquareFeet.toString() : '',
      location: property.location || 'BANER',
      address: property.address || '',
      bedrooms: property.bedrooms || 2,
      bathrooms: property.bathrooms || 2,
      status: property.status || 'AVAILABLE',
      verifiedListing: property.verifiedListing || false,
      exclusiveDeal: property.exclusiveDeal || false,
      noBrokerage: property.noBrokerage || false,
      reraNumber: property.reraNumber || ''
    });
    setShowPropForm(true);
  };

  const handleClosePropForm = () => {
    setShowPropForm(false);
    setEditingPropertyId(null);
    setPropertyForm({
      title: '',
      description: '',
      propertyType: 'RESIDENTIAL',
      transactionType: 'BUY',
      price: '',
      areaSquareFeet: '',
      location: 'BANER',
      address: '',
      bedrooms: 2,
      bathrooms: 2,
      status: 'AVAILABLE',
      verifiedListing: false,
      exclusiveDeal: false,
      noBrokerage: false,
      reraNumber: ''
    });
  };

  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    setFormSubmitLoading(true);
    try {
      const dataPayload = {
        ...propertyForm,
        price: parseFloat(propertyForm.price),
        areaSquareFeet: parseFloat(propertyForm.areaSquareFeet),
        bedrooms: parseInt(propertyForm.bedrooms),
        bathrooms: parseInt(propertyForm.bathrooms),
        verifiedListing: propertyForm.verifiedListing,
        exclusiveDeal: propertyForm.exclusiveDeal,
        noBrokerage: propertyForm.noBrokerage,
        reraNumber: propertyForm.reraNumber || 'RERA-PUN-PRM-24K' + Math.floor(100 + Math.random() * 900)
      };

      if (editingPropertyId) {
        await apiService.updateProperty(editingPropertyId, dataPayload);
        alert('Property updated!');
      } else {
        await apiService.createProperty(dataPayload);
        alert('Property published!');
      }
      handleClosePropForm();
      fetchProperties();
      fetchStats();
    } catch (err) {
      alert(`Save error: ${err.message}`);
    } finally {
      setFormSubmitLoading(false);
    }
  };

  // CSV Importer Trigger
  const handleCsvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!window.confirm(`Bulk import properties from CSV file: "${file.name}"?`)) {
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = apiService.getToken();
      const response = await fetch(`${apiService.getBaseUrl()}/properties/import/csv`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || 'Import failed');
      }

      const resText = await response.text();
      alert(resText);
      fetchProperties();
      fetchStats();
    } catch (err) {
      alert(`Bulk Import failed: ${err.message}`);
    } finally {
      e.target.value = '';
    }
  };

  // Client-Side Regex Parser
  const handleParseListingText = () => {
    const text = document.getElementById('rawParserInput')?.value;
    if (!text || text.trim() === '') {
      alert('Please paste raw listing details text first.');
      return;
    }

    const lowerText = text.toLowerCase();
    const updatedForm = { ...propertyForm };

    // 1. Title & Description Parsing
    const lines = text.split(/[.\n]/).filter(l => l.trim().length > 0);
    if (lines.length > 0) {
      updatedForm.title = lines[0].trim().substring(0, 80);
      updatedForm.description = text.trim();
    }

    // 2. Bedrooms (BHK)
    const bhkRegex = /(\d+)\s*(?:bhk|bed|bedroom|bedrooms)/i;
    const bhkMatch = text.match(bhkRegex);
    if (bhkMatch) {
      updatedForm.bedrooms = parseInt(bhkMatch[1]);
    }

    // 3. Bathrooms
    const bathRegex = /(\d+)\s*(?:bath|bathroom|bathrooms|baths)/i;
    const bathMatch = text.match(bathRegex);
    if (bathMatch) {
      updatedForm.bathrooms = parseInt(bathMatch[1]);
    }

    // 4. Area (Sq Ft)
    const areaRegex = /(\d+(?:\.\d+)?)\s*(?:sq\s*ft|sqft|square\s*feet|sq\.ft\.)/i;
    const areaMatch = text.match(areaRegex);
    if (areaMatch) {
      updatedForm.areaSquareFeet = areaMatch[1];
    }

    // 5. Price parsing (Crores / Lakhs / Raw Numbers)
    const crRegex = /(\d+(?:\.\d+)?)\s*(?:cr|crore|crores)/i;
    const lakhRegex = /(\d+(?:\.\d+)?)\s*(?:l|lakh|lakhs|lac|lacs)/i;
    const rawNumRegex = /(?:rs|price|inr|value)?\s*(\d{1,3}(?:,\d{2,3})*(?:\.\d+)?)\s*(?!bhk|sqft|sq\s*ft|bed|bath)/i;

    const crMatch = text.match(crRegex);
    const lakhMatch = text.match(lakhRegex);

    if (crMatch) {
      const val = parseFloat(crMatch[1]);
      updatedForm.price = Math.round(val * 10000000).toString();
    } else if (lakhMatch) {
      const val = parseFloat(lakhMatch[1]);
      updatedForm.price = Math.round(val * 100000).toString();
    } else {
      const rawMatch = text.match(rawNumRegex);
      if (rawMatch) {
        const cleanNum = rawMatch[1].replace(/,/g, '');
        if (parseFloat(cleanNum) > 10000) {
          updatedForm.price = Math.round(parseFloat(cleanNum)).toString();
        }
      }
    }

    // 6. Location Corridor matching
    if (lowerText.includes('hinjewadi')) {
      updatedForm.location = 'HINJEWADI';
    } else if (lowerText.includes('wakad')) {
      updatedForm.location = 'WAKAD';
    } else if (lowerText.includes('baner')) {
      updatedForm.location = 'BANER';
    } else if (lowerText.includes('balewadi')) {
      updatedForm.location = 'BALEWADI';
    } else if (lowerText.includes('tathawade')) {
      updatedForm.location = 'TATHAWADE';
    } else if (lowerText.includes('mahalunge')) {
      updatedForm.location = 'MAHALUNGE';
    }

    // 7. Transaction Type (BUY or RENT)
    if (lowerText.includes('rent') || lowerText.includes('lease') || lowerText.includes('month') || lowerText.includes('/mo')) {
      updatedForm.transactionType = 'RENT';
      if (lowerText.includes('office') || lowerText.includes('shop') || lowerText.includes('showroom') || lowerText.includes('commercial')) {
        updatedForm.propertyType = 'COMMERCIAL';
        if (!bhkMatch) updatedForm.bedrooms = 0;
      }
    } else {
      updatedForm.transactionType = 'BUY';
    }

    // 8. Property Type (RESIDENTIAL or COMMERCIAL)
    if (lowerText.includes('office') || lowerText.includes('shop') || lowerText.includes('showroom') || lowerText.includes('commercial') || lowerText.includes('retail')) {
      updatedForm.propertyType = 'COMMERCIAL';
      if (!bhkMatch) updatedForm.bedrooms = 0;
    } else {
      updatedForm.propertyType = 'RESIDENTIAL';
    }

    // 9. Badges
    if (lowerText.includes('verified')) {
      updatedForm.verifiedListing = true;
    }
    if (lowerText.includes('exclusive') || lowerText.includes('signature') || lowerText.includes('premium') || lowerText.includes('special')) {
      updatedForm.exclusiveDeal = true;
    }
    if (lowerText.includes('no brokerage') || lowerText.includes('zero brokerage') || lowerText.includes('0 brokerage') || lowerText.includes('no commission')) {
      updatedForm.noBrokerage = true;
    }

    // 9.5 RERA Number Match
    const reraRegex = /rera[-:\s]*(?:pun-prm-|prm\/)?(\d+[\w\/]*)/i;
    const reraMatch = text.match(reraRegex);
    if (reraMatch) {
      updatedForm.reraNumber = `RERA-PUN-PRM-${reraMatch[1].toUpperCase()}`;
    } else {
      updatedForm.reraNumber = `RERA-PUN-PRM-24K${Math.floor(100 + Math.random() * 900)}`;
    }

    // 10. Address fallback
    if (updatedForm.location) {
      updatedForm.address = `Prime ${updatedForm.location.charAt(0) + updatedForm.location.slice(1).toLowerCase()} Corridor, Pune`;
    }

    setPropertyForm(updatedForm);
    alert('Listing fields successfully parsed and filled!');
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    const num = Number(price);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  // --- RENDER UNAUTHENTICATED LOGIN VIEW ---
  if (!isLoggedIn) {
    return (
      <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <div className="luxury-card" style={{ width: '100%', maxWidth: '420px', border: '1px solid var(--border-gold)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', color: 'var(--gold-primary)' }}>
            <Lock size={40} />
          </div>
          <h2 className="luxury-title" style={{ textAlign: 'center', marginBottom: '24px', fontSize: '1.6rem' }}>24K CRM Terminal</h2>
          
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-muted)', marginBottom: '24px' }}>
            <button 
              onClick={() => { setAuthTab('login'); setAuthError(''); }} 
              className="tab-btn" 
              style={{ flex: 1, paddingBottom: '12px', borderBottom: authTab === 'login' ? '2px solid var(--gold-primary)' : 'none', color: authTab === 'login' ? 'var(--gold-primary)' : 'var(--text-muted)' }}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setAuthTab('register'); setAuthError(''); }} 
              className="tab-btn" 
              style={{ flex: 1, paddingBottom: '12px', borderBottom: authTab === 'register' ? '2px solid var(--gold-primary)' : 'none', color: authTab === 'register' ? 'var(--gold-primary)' : 'var(--text-muted)' }}
            >
              Request Access
            </button>
          </div>

          <form onSubmit={handleAuthSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input 
                type="text" 
                required 
                placeholder="Enter username" 
                className="form-input" 
                value={authForm.username}
                onChange={e => setAuthForm({ ...authForm, username: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Security Password</label>
              <input 
                type="password" 
                required 
                placeholder="Enter password" 
                className="form-input" 
                value={authForm.password}
                onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
              />
            </div>

            {authError && <p style={{ color: '#D90429', fontSize: '0.85rem', marginBottom: '15px', textAlign: 'center' }}>{authError}</p>}

            <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center' }} disabled={authLoading}>
              {authLoading ? <Loader className="animate-spin" size={20} /> : (authTab === 'login' ? 'Secure Login' : 'Register Operator')}
            </button>
          </form>
          <button 
            type="button" 
            onClick={() => onViewChange && onViewChange('portal')} 
            className="btn-outline" 
            style={{ width: '100%', marginTop: '12px', justifyContent: 'center' }}
          >
            ← Return to Portal
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER CRM WORKSPACE VIEW ---
  return (
    <div className="dashboard-container">
      {/* Workspace Header */}
      <header className="dashboard-header">
        <div>
          <h1 className="luxury-title" style={{ fontSize: '1.8rem', marginBottom: '4px' }}>24K CRM Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time listing pipeline and round-robin lead allocation terminal.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => onViewChange && onViewChange('portal')} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Home size={16} />
            View Portal
          </button>
          <button onClick={handleLogout} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FF4D6D', borderColor: 'rgba(255,77,109,0.2)' }}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </header>

      {/* Metrics Row */}
      <section className="metrics-grid">
        <div className="metric-card">
          <h3>Total Enquiries</h3>
          <p className="value">{stats.totalLeads}</p>
          <span className="caption">Captured from portal</span>
        </div>
        <div className="metric-card">
          <h3>Active Properties</h3>
          <p className="value">{stats.activeProperties}</p>
          <span className="caption">Verified Pune listings</span>
        </div>
        <div className="metric-card">
          <h3>New Leads</h3>
          <p className="value" style={{ color: 'var(--gold-light)' }}>{stats.newLeads}</p>
          <span className="caption">Pending follow-up</span>
        </div>
        <div className="metric-card">
          <h3>Converted Deals</h3>
          <p className="value" style={{ color: '#2ec4b6' }}>{stats.convertedLeads}</p>
          <span className="caption">Rented or Sold</span>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="crm-tabs">
        <button 
          onClick={() => setActiveTab('leads')} 
          className={`crm-tab-btn ${activeTab === 'leads' ? 'active' : ''}`}
        >
          <Users size={16} />
          Leads Pipeline
        </button>
        <button 
          onClick={() => setActiveTab('properties')} 
          className={`crm-tab-btn ${activeTab === 'properties' ? 'active' : ''}`}
        >
          <Home size={16} />
          Property Inventory
        </button>
      </nav>

      {/* LEADS PIPELINE MANAGER */}
      {activeTab === 'leads' && (
        <section>
          {/* Filters Row */}
          <div className="filters-row">
            <div className="form-group" style={{ margin: 0 }}>
              <select 
                value={leadFilters.status} 
                onChange={e => { setLeadFilters({ ...leadFilters, status: e.target.value }); setLeadPage(0); }} 
                className="form-input"
                style={{ minWidth: '160px' }}
              >
                <option value="">All Lead Statuses</option>
                <option value="NEW">New Inquiry</option>
                <option value="CONTACTED">In Discussion</option>
                <option value="CONVERTED">Closed / Won</option>
                <option value="LOST">Lost / Archived</option>
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <select 
                value={leadFilters.preferredLocation} 
                onChange={e => { setLeadFilters({ ...leadFilters, preferredLocation: e.target.value }); setLeadPage(0); }} 
                className="form-input"
                style={{ minWidth: '180px' }}
              >
                <option value="">All Locations</option>
                <option value="BANER">Baner</option>
                <option value="WAKAD">Wakad</option>
                <option value="HINJEWADI">Hinjewadi</option>
                <option value="BALEWADI">Balewadi</option>
                <option value="TATHAWADE">Tathawade</option>
                <option value="MAHALUNGE">Mahalunge</option>
              </select>
            </div>

            <button onClick={() => { setLeadFilters({ status: '', preferredLocation: '' }); setLeadPage(0); }} className="btn-outline">
              <RefreshCw size={14} />
              Reset Filters
            </button>
          </div>

          {leadsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
              <Loader className="animate-spin" size={32} color="#D4AF37" />
            </div>
          ) : leads.length === 0 ? (
            <div className="empty-state">No customer inquiries found matching these filters.</div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="crm-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Contact Info</th>
                      <th>Requirement</th>
                      <th>Location</th>
                      <th>Assigned Agent</th>
                      <th>Pipeline Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(lead => (
                      <tr key={lead.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-light)' }}>{lead.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {new Date(lead.createdDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <div>{lead.phone}</div>
                          <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{lead.email}</div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.8rem', background: lead.requirementType === 'BUY' ? 'rgba(197,168,128,0.15)' : 'rgba(255,255,255,0.05)', color: lead.requirementType === 'BUY' ? 'var(--gold-light)' : 'var(--text-light)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                            {lead.requirementType}
                          </span>
                          <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                            {lead.budgetMin ? formatPrice(lead.budgetMin) : 'Any'} - {lead.budgetMax ? formatPrice(lead.budgetMax) : 'Any'}
                          </div>
                        </td>
                        <td>{lead.preferredLocation}</td>
                        <td>
                          {lead.assignedAgentName ? (
                            <div>
                              <div style={{ fontWeight: 500 }}>{lead.assignedAgentName}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lead.assignedAgentPhone}</div>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Auto-routing...</span>
                          )}
                        </td>
                        <td>
                          <select 
                            value={lead.status} 
                            onChange={e => handleLeadStatusChange(lead.id, e.target.value)}
                            className="form-input"
                            style={{ padding: '4px 8px', fontSize: '0.85rem', width: 'auto' }}
                          >
                            <option value="NEW">New Inquiry</option>
                            <option value="CONTACTED">In Discussion</option>
                            <option value="CONVERTED">Closed / Won</option>
                            <option value="LOST">Lost / Archived</option>
                          </select>
                        </td>
                        <td>
                          {lead.notes && (
                            <button 
                              onClick={() => alert(`Inquiry details:\n\n${lead.notes}`)} 
                              className="btn-outline" 
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            >
                              View Notes
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {leadTotalPages > 1 && (
                <div className="pagination">
                  <button onClick={() => setLeadPage(p => Math.max(0, p - 1))} disabled={leadPage === 0} className="pagination-btn">Prev</button>
                  <span className="pagination-info">Page {leadPage + 1} of {leadTotalPages}</span>
                  <button onClick={() => setLeadPage(p => Math.min(leadTotalPages - 1, p + 1))} disabled={leadPage === leadTotalPages - 1} className="pagination-btn">Next</button>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {/* PROPERTY MANAGER */}
      {activeTab === 'properties' && (
        <section>
          <div className="action-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <h2 className="luxury-title" style={{ fontSize: '1.4rem', margin: 0 }}>Properties Inventory</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              
              {/* CSV Bulk Importer Trigger */}
              <label className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0, padding: '10px 16px', fontSize: '0.9rem' }}>
                <Upload size={16} />
                <span>Bulk Import CSV</span>
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleCsvUpload} 
                  style={{ display: 'none' }} 
                />
              </label>

              <button onClick={() => setShowPropForm(true)} className="btn-gold" style={{ padding: '10px 16px' }}>
                <Plus size={16} />
                Add Listing
              </button>
            </div>
          </div>

          {showPropForm && (
            <div className="crm-drawer">
              <div className="drawer-header">
                <h3 className="drawer-title">{editingPropertyId ? 'Update Property Listing' : 'Publish New Property Listing'}</h3>
                <button className="btn-outline" style={{ padding: '6px 12px' }} onClick={handleClosePropForm}>
                  <X size={16} />
                </button>
              </div>

              {/* Client-Side Smart Copy-Paste Parser */}
              {!editingPropertyId && (
                <div style={{ background: 'rgba(212, 175, 55, 0.04)', border: '1px dashed var(--border-gold)', borderRadius: '8px', padding: '15px', marginBottom: '20px' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-light)', fontWeight: 600 }}>
                    <Sparkles size={16} />
                    <span>Smart Listing Auto-Fill Parser</span>
                  </label>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    Paste flat listing details text below (e.g. <i>"3 BHK premium flat in Hinjewadi, 1650 sqft, price 1.45 Cr, no brokerage"</i>) and click parse.
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <textarea 
                      id="rawParserInput"
                      placeholder="Paste property text details from 99acres or WhatsApp messages..."
                      className="form-input"
                      rows="2"
                      style={{ flexGrow: 1, resize: 'vertical' }}
                    />
                    <button 
                      type="button" 
                      onClick={handleParseListingText} 
                      className="btn-gold" 
                      style={{ alignSelf: 'flex-end', height: '42px', padding: '0 16px' }}
                    >
                      Parse
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handlePropertySubmit}>
                <div className="form-group">
                  <label className="form-label">Property Title</label>
                  <input type="text" name="title" className="form-input" required placeholder="e.g. 24K Opula 3 BHK Baner" value={propertyForm.title} onChange={e => setPropertyForm({...propertyForm, title: e.target.value})} />
                </div>

                <div className="form-group">
                  <label className="form-label">Marketing Description</label>
                  <textarea name="description" className="form-input" rows="3" placeholder="Description..." value={propertyForm.description} onChange={e => setPropertyForm({...propertyForm, description: e.target.value})} />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Property Type</label>
                    <select name="propertyType" value={propertyForm.propertyType} onChange={e => setPropertyForm({...propertyForm, propertyType: e.target.value})} className="form-input">
                      <option value="RESIDENTIAL">Residential</option>
                      <option value="COMMERCIAL">Commercial</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Transaction Type</label>
                    <select name="transactionType" value={propertyForm.transactionType} onChange={e => setPropertyForm({...propertyForm, transactionType: e.target.value})} className="form-input">
                      <option value="BUY">Buy (Outright)</option>
                      <option value="RENT">Rent (Lease)</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Price (₹)</label>
                    <input type="number" name="price" className="form-input" required placeholder="e.g. 13500000" value={propertyForm.price} onChange={e => setPropertyForm({...propertyForm, price: e.target.value})} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Area Size (Sq. Ft.)</label>
                    <input type="number" name="areaSquareFeet" className="form-input" required placeholder="e.g. 1500" value={propertyForm.areaSquareFeet} onChange={e => setPropertyForm({...propertyForm, areaSquareFeet: e.target.value})} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Prime Corridor</label>
                    <select name="location" value={propertyForm.location} onChange={e => setPropertyForm({...propertyForm, location: e.target.value})} className="form-input">
                      <option value="BANER">Baner Corridor</option>
                      <option value="WAKAD">Wakad Corridor</option>
                      <option value="HINJEWADI">Hinjewadi IT Corridor</option>
                      <option value="BALEWADI">Balewadi High Street</option>
                      <option value="TATHAWADE">Tathawade Corridor</option>
                      <option value="MAHALUNGE">Mahalunge Corridor</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Beds (BHK)</label>
                    <input type="number" name="bedrooms" className="form-input" required value={propertyForm.bedrooms} onChange={e => setPropertyForm({...propertyForm, bedrooms: e.target.value})} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Bathrooms</label>
                    <input type="number" name="bathrooms" className="form-input" required value={propertyForm.bathrooms} onChange={e => setPropertyForm({...propertyForm, bathrooms: e.target.value})} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Listing Status</label>
                    <select name="status" value={propertyForm.status} onChange={e => setPropertyForm({...propertyForm, status: e.target.value})} className="form-input">
                      <option value="AVAILABLE">Available</option>
                      <option value="SOLD">Sold</option>
                      <option value="RENTED">Rented</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">RERA Permit ID</label>
                    <input type="text" name="reraNumber" className="form-input" placeholder="e.g. RERA-PUN-PRM-24K123" value={propertyForm.reraNumber} onChange={e => setPropertyForm({...propertyForm, reraNumber: e.target.value})} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Detailed Address</label>
                    <input type="text" name="address" className="form-input" required placeholder="Address..." value={propertyForm.address} onChange={e => setPropertyForm({...propertyForm, address: e.target.value})} />
                  </div>
                </div>

                {/* Promotional Badges Checkboxes */}
                <div className="form-group" style={{ display: 'flex', gap: '20px', margin: '15px 0', flexWrap: 'wrap' }}>
                  <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-light)' }}>
                    <input 
                      type="checkbox" 
                      checked={propertyForm.verifiedListing} 
                      onChange={e => setPropertyForm({...propertyForm, verifiedListing: e.target.checked})} 
                    />
                    Verified Listing
                  </label>
                  <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-light)' }}>
                    <input 
                      type="checkbox" 
                      checked={propertyForm.exclusiveDeal} 
                      onChange={e => setPropertyForm({...propertyForm, exclusiveDeal: e.target.checked})} 
                    />
                    Exclusive Deal
                  </label>
                  <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-light)' }}>
                    <input 
                      type="checkbox" 
                      checked={propertyForm.noBrokerage} 
                      onChange={e => setPropertyForm({...propertyForm, noBrokerage: e.target.checked})} 
                    />
                    No Brokerage
                  </label>
                </div>

                <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center' }} disabled={formSubmitLoading}>
                  {formSubmitLoading ? <Loader className="animate-spin" size={20} /> : (editingPropertyId ? 'Update Listing' : 'Publish Listing')}
                </button>
              </form>
            </div>
          )}

          {propsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
              <Loader className="animate-spin" size={32} color="#D4AF37" />
            </div>
          ) : properties.length === 0 ? (
            <div className="empty-state">No listings published. Click "Add Listing" to publish.</div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="crm-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>RERA ID</th>
                      <th>Promotions</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map(property => (
                      <tr key={property.id}>
                        <td style={{ fontWeight: 600, color: 'var(--text-light)' }}>{property.title}</td>
                        <td>{property.location}</td>
                        <td>
                          <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                            {property.propertyType} / {property.transactionType}
                          </span>
                        </td>
                        <td>{formatPrice(property.price)}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{property.reraNumber || 'Pending'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {property.verifiedListing && <span style={{ fontSize: '0.65rem', background: 'rgba(46,196,182,0.15)', color: '#2ec4b6', padding: '2px 4px', borderRadius: '2px', border: '1px solid rgba(46,196,182,0.25)' }}>Verified</span>}
                            {property.exclusiveDeal && <span style={{ fontSize: '0.65rem', background: 'rgba(212,175,55,0.15)', color: 'var(--gold-light)', padding: '2px 4px', borderRadius: '2px', border: '1px solid rgba(212,175,55,0.25)' }}>Exclusive</span>}
                            {property.noBrokerage && <span style={{ fontSize: '0.65rem', background: 'rgba(58,134,200,0.15)', color: '#3a86c8', padding: '2px 4px', borderRadius: '2px', border: '1px solid rgba(58,134,200,0.25)' }}>No Broker</span>}
                            {!property.verifiedListing && !property.exclusiveDeal && !property.noBrokerage && <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>None</span>}
                          </div>
                        </td>
                        <td>
                          <span style={{ 
                            fontSize: '0.8rem', 
                            padding: '2px 6px', 
                            borderRadius: '4px',
                            background: property.status === 'AVAILABLE' ? 'rgba(46,196,182,0.1)' : 'rgba(217,4,41,0.1)',
                            color: property.status === 'AVAILABLE' ? '#2ec4b6' : '#d90429'
                          }}>
                            {property.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleEditPropertyClick(property)} className="btn-outline" style={{ padding: '6px' }}>
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDeleteProperty(property.id)} className="btn-outline" style={{ padding: '6px', color: '#D90429', borderColor: 'rgba(217,4,41,0.15)' }}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {propTotalPages > 1 && (
                <div className="pagination">
                  <button onClick={() => setPropPage(p => Math.max(0, p - 1))} disabled={propPage === 0} className="pagination-btn">Prev</button>
                  <span className="pagination-info">Page {propPage + 1} of {propTotalPages}</span>
                  <button onClick={() => setPropPage(p => Math.min(propTotalPages - 1, p + 1))} disabled={propPage === propTotalPages - 1} className="pagination-btn">Next</button>
                </div>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
}
