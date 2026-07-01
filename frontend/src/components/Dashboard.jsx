import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { 
  Users, Home, TrendingUp, Calendar, Trash2, Edit2, Plus, X, 
  Loader, RefreshCw, Lock, LogOut, Upload, Sparkles 
} from 'lucide-react';
import './Dashboard.css';

// Import Modular Property Form Drawer
import PropertyFormDrawer from './PropertyFormDrawer';

export default function Dashboard({ onViewChange }) {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(apiService.isAuthenticated());
  const [authTab, setAuthTab] = useState('login'); // login | register
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // CRM Tab management
  const [activeTab, setActiveTab] = useState('leads'); // leads | properties | team
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
  
  // Team states
  const [agents, setAgents] = useState([]);
  const [agentsLoading, setAgentsLoading] = useState(true);
  const [allLeadsForStats, setAllLeadsForStats] = useState([]);
  const [showMatrix, setShowMatrix] = useState(true);
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
    reraNumber: '',
    imageUrl: '',
    videoUrl: '',
    threeDTourUrl: '',
    furnishingStatus: 'FULLY_FURNISHED',
    gasPipeline: false
  });

  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  // Selected Lead Details Modal State
  const [selectedLead, setSelectedLead] = useState(null);
  const [whatsappLogs, setWhatsappLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const handleViewLeadDetails = async (lead) => {
    setSelectedLead(lead);
    setWhatsappLogs([]);
    setLogsLoading(true);
    try {
      const logs = await apiService.getWhatsAppLogs(lead.id);
      setWhatsappLogs(logs || []);
    } catch (err) {
      console.error("Failed to fetch WhatsApp logs:", err);
    } finally {
      setLogsLoading(false);
    }
  };

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

  // Fetch Relationship Managers (Agents)
  const fetchAgents = async () => {
    if (!isLoggedIn) return;
    setAgentsLoading(true);
    try {
      const data = await apiService.getAgents();
      setAgents(data || []);
      
      const leadsData = await apiService.getLeads({}, 0, 1000);
      setAllLeadsForStats(leadsData.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setAgentsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchLeads();
      fetchProperties();
      fetchStats();
      fetchAgents();
    }
  }, [isLoggedIn, leadPage, propPage, leadFilters]);

  // Handle Login & Registration Submit
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      if (authTab === 'login') {
        const token = await apiService.login(authForm.username, authForm.password);
        if (token) {
          setIsLoggedIn(true);
          showNotification('Admin Authenticated successfully.');
        }
      } else {
        await apiService.register(authForm.username, authForm.password);
        setAuthTab('login');
        showNotification('Registration successful! Please login.');
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    setIsLoggedIn(false);
    showNotification('Secure Operator Session terminated.');
  };

  // Assign agent lead handler
  const handleAssignAgent = async (leadId, agentId) => {
    try {
      await apiService.assignLead(leadId, agentId);
      showNotification('Relationship manager assigned.');
      fetchLeads();
      fetchStats();
    } catch (err) {
      alert(`Assignment failed: ${err.message}`);
    }
  };

  const handleLeadStatusChange = async (leadId, status) => {
    try {
      await apiService.updateLeadStatus(leadId, status);
      showNotification('Lead pipeline status updated.');
      fetchLeads();
      fetchStats();
      fetchAgents();
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  // Property addition form handlers
  const handleEditPropertyClick = (property) => {
    setEditingPropertyId(property.id);
    setPropertyForm({
      title: property.title,
      description: property.description,
      propertyType: property.propertyType,
      transactionType: property.transactionType,
      price: property.price,
      areaSquareFeet: property.areaSquareFeet,
      location: property.location,
      address: property.address,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      status: property.status,
      verifiedListing: property.verifiedListing,
      exclusiveDeal: property.exclusiveDeal,
      noBrokerage: property.noBrokerage,
      reraNumber: property.reraNumber || '',
      imageUrl: property.imageUrl || '',
      videoUrl: property.videoUrl || '',
      threeDTourUrl: property.threeDTourUrl || '',
      furnishingStatus: property.furnishingStatus || 'FULLY_FURNISHED',
      gasPipeline: property.gasPipeline || false
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
      reraNumber: '',
      imageUrl: '',
      videoUrl: '',
      threeDTourUrl: '',
      furnishingStatus: 'FULLY_FURNISHED',
      gasPipeline: false
    });
  };

  const handlePropertySubmit = async (e) => {
    e.preventDefault();
    setFormSubmitLoading(true);
    try {
      if (editingPropertyId) {
        await apiService.updateProperty(editingPropertyId, propertyForm);
        showNotification('Property listing updated.');
      } else {
        await apiService.createProperty(propertyForm);
        showNotification('Property listing published successfully.');
      }
      handleClosePropForm();
      fetchProperties();
      fetchStats();
    } catch (err) {
      alert(`Property action failed: ${err.message}`);
    } finally {
      setFormSubmitLoading(false);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this listing?')) return;
    try {
      await apiService.deleteProperty(id);
      showNotification('Property listing removed.');
      fetchProperties();
      fetchStats();
    } catch (err) {
      alert(`Delete action failed: ${err.message}`);
    }
  };

  const handleCsvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);

    showNotification('Parsing CSV Bulk Ingest records...');
    try {
      await apiService.bulkImportProperties(file);
      showNotification('Bulk CSV properties imported successfully.');
      fetchProperties();
      fetchStats();
    } catch (err) {
      alert(`Bulk CSV ingest failed: ${err.message}`);
    }
  };

  const handleParseListingText = () => {
    const text = document.getElementById('rawParserInput')?.value;
    if (!text) {
      alert('Please paste listing text details first.');
      return;
    }

    let parsed = { ...propertyForm };

    const bhkMatch = text.match(/(\d)\s*(?:BHK|bhk)/i);
    if (bhkMatch) parsed.bedrooms = parseInt(bhkMatch[1]);

    const sizeMatch = text.match(/(\d+)\s*(?:sqft|sq\.ft\.|square\s*feet)/i);
    if (sizeMatch) parsed.areaSquareFeet = parseInt(sizeMatch[1]);

    const priceCrMatch = text.match(/([\d\.]+)\s*(?:Cr|cr|Crore)/);
    if (priceCrMatch) {
      parsed.price = Math.round(parseFloat(priceCrMatch[1]) * 10000000);
    } else {
      const priceLMatch = text.match(/([\d\.]+)\s*(?:L|l|Lakh)/);
      if (priceLMatch) parsed.price = Math.round(parseFloat(priceLMatch[1]) * 100000);
    }

    const corridorWords = ['HINJEWADI', 'BANER', 'WAKAD', 'BALEWADI', 'TATHAWADE', 'MAHALUNGE'];
    for (let word of corridorWords) {
      if (text.toUpperCase().includes(word)) {
        parsed.location = word;
        break;
      }
    }

    if (text.toLowerCase().includes('no brokerage') || text.toLowerCase().includes('zero brokerage')) {
      parsed.noBrokerage = true;
    }

    setPropertyForm(parsed);
    showNotification('AI Parser auto-filled form values!');
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setLeadFilters(prev => ({ ...prev, [name]: value }));
    setLeadPage(0);
  };

  const showNotification = (message) => {
    const toast = document.createElement('div');
    toast.className = 'premium-toast-alert';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    const num = Number(price);
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} L`;
    }
    return `₹${num.toLocaleString('en-IN')}`;
  };

  if (!isLoggedIn) {
    return (
      <div className="crm-login-wrapper">
        <div className="login-card">
          <div className="login-logo">
            <span className="logo-text">24K REALTORS</span>
            <span className="sub-text">SECURE CRM GATEWAY</span>
          </div>

          <div className="auth-tab-buttons">
            <button className={authTab === 'login' ? 'active' : ''} onClick={() => setAuthTab('login')}>LOGIN</button>
            <button className={authTab === 'register' ? 'active' : ''} onClick={() => setAuthTab('register')}>REGISTER</button>
          </div>

          <form onSubmit={handleAuthSubmit} style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                placeholder="e.g. admin" 
                value={authForm.username} 
                onChange={e => setAuthForm({...authForm, username: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                required 
                placeholder="••••••••" 
                value={authForm.password} 
                onChange={e => setAuthForm({...authForm, password: e.target.value})} 
              />
            </div>

            {authError && <div className="auth-error-msg">⚠️ {authError}</div>}

            <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }} disabled={authLoading}>
              {authLoading ? <Loader className="animate-spin" size={18} /> : (authTab === 'login' ? 'Secure Auth Login' : 'Register Operator')}
            </button>
          </form>

          <button onClick={() => onViewChange('portal')} className="btn-back-portal">
            ← Return to Advisory Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="crm-wrapper">
      {/* Sidebar Navigation */}
      <aside className="crm-sidebar">
        <div className="crm-sidebar-logo">
          <span>24K OPERATOR</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--gold-primary)', letterSpacing: '0.1em' }}>CONTROL TERMINAL</span>
        </div>
        
        <nav className="sidebar-nav">
          <button className={activeTab === 'leads' ? 'active' : ''} onClick={() => { setActiveTab('leads'); handleClosePropForm(); }}>
            <Users size={18} />
            <span>Lead Pipelines</span>
          </button>
          <button className={activeTab === 'properties' ? 'active' : ''} onClick={() => { setActiveTab('properties'); handleClosePropForm(); }}>
            <Home size={18} />
            <span>Properties Desk</span>
          </button>
          <button className={activeTab === 'team' ? 'active' : ''} onClick={() => { setActiveTab('team'); handleClosePropForm(); }}>
            <TrendingUp size={18} />
            <span>Advisory RMs</span>
          </button>
          
          <button onClick={() => onViewChange('portal')} style={{ marginTop: 'auto', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
            <span>Advisory Website</span>
          </button>
          <button onClick={handleLogout} className="btn-logout" style={{ background: 'rgba(217,4,41,0.08)', color: '#FF4D6D', border: '1px solid rgba(217,4,41,0.15)' }}>
            <LogOut size={16} />
            <span>Logout Session</span>
          </button>
        </nav>
      </aside>

      {/* Main CRM Content Pane */}
      <main className="crm-main-content">
        
        {/* Real-time KPI Statistics panel */}
        <section className="crm-stats-row">
          <div className="stats-kpi-card">
            <span className="kpi-label">TOTAL CAPTURED LEADS</span>
            <span className="kpi-val">{stats.totalLeads}</span>
            <span className="kpi-sub">Round-robin Active</span>
          </div>
          <div className="stats-kpi-card">
            <span className="kpi-label">NEW ACTIVE LEADS</span>
            <span className="kpi-val" style={{ color: 'var(--gold-primary)' }}>{stats.newLeads}</span>
            <span className="kpi-sub">Pending RM allocation</span>
          </div>
          <div className="stats-kpi-card">
            <span className="kpi-label">IN CONVERSATION</span>
            <span className="kpi-val">{stats.contactedLeads}</span>
            <span className="kpi-sub">Discussion/Site Visit</span>
          </div>
          <div className="stats-kpi-card">
            <span className="kpi-label">CONVERTED DEALS</span>
            <span className="kpi-val" style={{ color: '#2ec4b6' }}>{stats.convertedLeads}</span>
            <span className="kpi-sub">Won & Registered</span>
          </div>
          <div className="stats-kpi-card">
            <span className="kpi-label">ACTIVE PLATFORM LISTINGS</span>
            <span className="kpi-val">{stats.activeProperties}</span>
            <span className="kpi-sub">Verified & Clear</span>
          </div>
        </section>

        {/* TAB 1: LEADS PIPELINE */}
        {activeTab === 'leads' && (
          <section>
            <div className="action-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
              <h2 className="luxury-title" style={{ fontSize: '1.4rem', margin: 0 }}>Lead Management Pipeline</h2>
              
              {/* Dynamic Filtering */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <select name="status" value={leadFilters.status} onChange={handleFilterChange} className="form-input" style={{ width: '160px', margin: 0 }}>
                  <option value="">All Statuses</option>
                  <option value="NEW">New Inquiry</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="VISITED">Visited</option>
                  <option value="CONVERTED">Converted</option>
                  <option value="LOST">Lost</option>
                </select>
                
                <select name="preferredLocation" value={leadFilters.preferredLocation} onChange={handleFilterChange} className="form-input" style={{ width: '180px', margin: 0 }}>
                  <option value="">All Pune West Areas</option>
                  <option value="HINJEWADI">Hinjewadi</option>
                  <option value="WAKAD">Wakad</option>
                  <option value="BANER">Baner</option>
                  <option value="BALEWADI">Balewadi</option>
                  <option value="TATHAWADE">Tathawade</option>
                  <option value="MAHALUNGE">Mahalunge</option>
                </select>
              </div>
            </div>

            {leadsLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
                <Loader className="animate-spin" size={32} color="#D4AF37" />
              </div>
            ) : leads.length === 0 ? (
              <div className="empty-state">No customer leads found matching criteria.</div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="crm-table">
                    <thead>
                      <tr>
                        <th>Lead Info</th>
                        <th>Preferred Corridor</th>
                        <th>Budget Range</th>
                        <th>Assigned RM</th>
                        <th>Score</th>
                        <th>Pipeline Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map(lead => (
                        <tr key={lead.id}>
                          <td data-label="Lead Info">
                            <div style={{ fontWeight: 600, color: 'var(--text-light)' }}>{lead.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lead.phone} | {lead.email}</div>
                          </td>
                          <td data-label="Preferred Corridor">{lead.preferredLocation || 'ANY'}</td>
                          <td data-label="Budget Range">
                            {lead.budgetMin ? `${formatPrice(lead.budgetMin)} - ${formatPrice(lead.budgetMax)}` : 'N/A'}
                          </td>
                          <td data-label="Assigned RM">
                            <select 
                              value={lead.assignedAgentPhone || ''} 
                              onChange={e => {
                                const selectedAg = agents.find(ag => ag.phone === e.target.value);
                                if (selectedAg) handleAssignAgent(lead.id, selectedAg.id);
                              }}
                              className="status-select-btn"
                              style={{ width: '140px' }}
                            >
                              <option value="">Unassigned</option>
                              {agents.map(ag => (
                                <option key={ag.id} value={ag.phone}>{ag.name}</option>
                              ))}
                            </select>
                          </td>
                          <td data-label="Score">
                            <span className="lead-score-pill" style={{ 
                              background: lead.leadScore >= 70 ? 'rgba(46,196,182,0.1)' : 'rgba(212,175,55,0.1)',
                              color: lead.leadScore >= 70 ? '#2ec4b6' : 'var(--gold-primary)'
                            }}>
                              {lead.leadScore || 50}
                            </span>
                          </td>
                          <td data-label="Pipeline Status">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className={`status-pill ${lead.status.toLowerCase()}`}>
                                {lead.status.replace('_', ' ')}
                              </span>
                              <select 
                                value={lead.status} 
                                onChange={e => handleLeadStatusChange(lead.id, e.target.value)}
                                className="status-select-btn"
                                style={{ width: '130px' }}
                              >
                                <option value="NEW">New Inquiry</option>
                                <option value="CONTACTED">In Discussion</option>
                                <option value="CONVERTED">Closed / Won</option>
                                <option value="LOST">Lost / Archived</option>
                              </select>
                            </div>
                          </td>
                          <td data-label="Actions">
                            <button 
                              onClick={() => handleViewLeadDetails(lead)} 
                              className="btn-outline" 
                              style={{ 
                                padding: '6px 12px', 
                                fontSize: '0.75rem', 
                                borderColor: 'var(--gold-primary)', 
                                color: 'var(--gold-primary)' 
                              }}
                            >
                              🔍 View Details
                            </button>
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

        {/* TAB 2: PROPERTY MANAGER */}
        {activeTab === 'properties' && (
          <section>
            <div className="action-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
              <h2 className="luxury-title" style={{ fontSize: '1.4rem', margin: 0 }}>Properties Inventory</h2>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                
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

            {/* Modular Property Form Drawer Component */}
            <PropertyFormDrawer 
              isOpen={showPropForm}
              onClose={handleClosePropForm}
              editingPropertyId={editingPropertyId}
              propertyForm={propertyForm}
              setPropertyForm={setPropertyForm}
              formSubmitLoading={formSubmitLoading}
              onSubmit={handlePropertySubmit}
              onParseText={handleParseListingText}
            />

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

        {/* TAB 3: RELATIONSHIP MANAGERS */}
        {activeTab === 'team' && (
          <section style={{ animation: 'slideDown 0.3s forwards' }}>
            
            {/* Corridor Valuation Trend Chart */}
            <div style={{
              background: 'rgba(7, 15, 30, 0.6)',
              border: '1px solid var(--border-gold)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '35px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
              <h3 className="luxury-title" style={{ fontSize: '1.2rem', margin: '0 0 8px 0', color: 'var(--gold-primary)' }}>
                ⚜️ IT Corridor Property Valuation & Price Trend Index (Per Sq.Ft.)
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
                Quarterly price progression trends (INR / Sq.Ft.) across prime Pune growth corridors.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', alignItems: 'center' }}>
                <div style={{ background: '#020617', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-muted)', position: 'relative' }}>
                  <svg viewBox="0 0 600 220" width="100%" height="220" style={{ overflow: 'visible' }}>
                    <line x1="50" y1="20" x2="550" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                    <line x1="50" y1="70" x2="550" y2="70" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                    <line x1="50" y1="120" x2="550" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                    <line x1="50" y1="170" x2="550" y2="170" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                    
                    <text x="40" y="25" fill="var(--text-muted)" fontSize="9" textAnchor="end">10K</text>
                    <text x="40" y="75" fill="var(--text-muted)" fontSize="9" textAnchor="end">8K</text>
                    <text x="40" y="125" fill="var(--text-muted)" fontSize="9" textAnchor="end">6K</text>
                    <text x="40" y="175" fill="var(--text-muted)" fontSize="9" textAnchor="end">4K</text>

                    <text x="50" y="195" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Q1 2026</text>
                    <text x="175" y="195" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Q2 2026</text>
                    <text x="300" y="195" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Q3 2026</text>
                    <text x="425" y="195" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Q4 2026</text>
                    <text x="550" y="195" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Q1 2027 (Proj)</text>

                    <polyline fill="none" stroke="var(--gold-primary)" strokeWidth="3" points="50,130 175,125 300,115 425,100 550,90" />
                    <circle cx="50" cy="130" r="4" fill="var(--gold-primary)" />
                    <circle cx="175" cy="125" r="4" fill="var(--gold-primary)" />
                    <circle cx="300" cy="115" r="4" fill="var(--gold-primary)" />
                    <circle cx="425" cy="100" r="4" fill="var(--gold-primary)" />
                    <circle cx="550" cy="90" r="4" fill="var(--gold-primary)" />

                    <polyline fill="none" stroke="#2ec4b6" strokeWidth="3" points="50,150 175,145 300,135 425,120 550,110" />
                    <circle cx="50" cy="150" r="4" fill="#2ec4b6" />
                    <circle cx="175" cy="145" r="4" fill="#2ec4b6" />
                    <circle cx="300" cy="135" r="4" fill="#2ec4b6" />
                    <circle cx="425" cy="120" r="4" fill="#2ec4b6" />
                    <circle cx="550" cy="110" r="4" fill="#2ec4b6" />

                    <polyline fill="none" stroke="#94a3b8" strokeWidth="3" points="50,165 175,160 300,150 425,140 550,130" />
                    <circle cx="50" cy="165" r="4" fill="#94a3b8" />
                    <circle cx="175" cy="160" r="4" fill="#94a3b8" />
                    <circle cx="300" cy="150" r="4" fill="#94a3b8" />
                    <circle cx="425" cy="140" r="4" fill="#94a3b8" />
                    <circle cx="550" cy="130" r="4" fill="#94a3b8" />
                  </svg>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--gold-primary)' }}></div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-light)' }}>Baner Corridor</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg: ₹8,800/sq.ft. (+12% YoY)</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#2ec4b6' }}></div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-light)' }}>Wakad Corridor</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg: ₹7,400/sq.ft. (+9% YoY)</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#94a3b8' }}></div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-light)' }}>Hinjewadi Corridor</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg: ₹6,500/sq.ft. (+7% YoY)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="action-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 className="luxury-title" style={{ fontSize: '1.4rem', margin: 0 }}>Relationship Managers & Performance Index</h2>
              <button onClick={fetchAgents} className="btn-outline" style={{ padding: '10px 16px', fontSize: '0.9rem' }}>
                <RefreshCw size={14} className={agentsLoading ? "animate-spin" : ""} />
                Refresh Team Data
              </button>
            </div>

            {agentsLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
                <Loader className="animate-spin" size={32} color="#D4AF37" />
              </div>
            ) : agents.length === 0 ? (
              <div className="empty-state">No relationship managers registered.</div>
            ) : (
              <>
                <div className="agent-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '35px' }}>
                  {agents.map(agent => {
                    const agentLeads = allLeadsForStats.filter(lead => lead.assignedAgentPhone === agent.phone);
                    const totalAssigned = agentLeads.length;
                    const activeDeals = agentLeads.filter(lead => 
                      lead.status === 'NEW' || lead.status === 'IN_PROGRESS' || lead.status === 'CONTACTED' || lead.status === 'VISITED'
                    ).length;
                    const wonDeals = agentLeads.filter(lead => lead.status === 'CONVERTED').length;
                    const conversionRate = totalAssigned > 0 ? Math.round((wonDeals / totalAssigned) * 100) : 0;
                    const initials = agent.name.split(' ').map(n => n[0]).join('').toUpperCase();

                    return (
                      <div key={agent.id} className="stat-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', padding: '24px', position: 'relative', minHeight: '280px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-muted)', paddingBottom: '14px', marginBottom: '14px' }}>
                          <div style={{ 
                            width: '44px', 
                            height: '44px', 
                            borderRadius: '50%', 
                            background: 'linear-gradient(135deg, var(--gold-primary), var(--gold-secondary))', 
                            color: 'var(--text-dark)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontWeight: 'bold',
                            fontSize: '1.1rem'
                          }}>
                            {initials}
                          </div>
                          <div style={{ flexGrow: 1 }}>
                            <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-light)' }}>{agent.name}</h4>
                            <span style={{ fontSize: '0.72rem', color: '#2ec4b6', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2ec4b6', display: 'inline-block' }}></span>
                              Active Lead Advisor
                            </span>
                          </div>
                          {conversionRate >= 33 && (
                            <span style={{ background: 'rgba(212,175,55,0.12)', color: 'var(--gold-primary)', border: '1px solid var(--border-gold)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 'bold' }}>
                              🏆 Top Performer
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
                          <div>📞 {agent.phone}</div>
                          <div>✉️ {agent.email}</div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center', marginBottom: '18px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-muted)' }}>
                          <div>
                            <strong style={{ fontSize: '1.25rem', color: 'var(--text-light)', display: 'block' }}>{totalAssigned}</strong>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assigned</span>
                          </div>
                          <div>
                            <strong style={{ fontSize: '1.25rem', color: 'var(--gold-light)', display: 'block' }}>{activeDeals}</strong>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active</span>
                          </div>
                          <div>
                            <strong style={{ fontSize: '1.25rem', color: '#2ec4b6', display: 'block' }}>{wonDeals}</strong>
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Won</span>
                          </div>
                        </div>

                        <div style={{ marginTop: 'auto' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px', color: 'var(--text-muted)' }}>
                            <span>Conversion Rate</span>
                            <strong style={{ color: conversionRate > 30 ? '#2ec4b6' : 'var(--text-light)' }}>{conversionRate}%</strong>
                          </div>
                          <div style={{ height: '6px', backgroundColor: 'var(--border-muted)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ 
                              height: '100%', 
                              width: `${conversionRate}%`, 
                              backgroundColor: conversionRate > 30 ? '#2ec4b6' : 'var(--gold-primary)',
                              transition: 'width 0.5s ease-in-out' 
                            }}></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="crm-drawer" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                  <div>
                    <h4 style={{ color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '1.1rem' }}>
                      🟢 Lead Allocation Engine Rules
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '10px' }}>
                      Our Spring Boot backend employs an event-driven <strong>Round-Robin routing listener</strong>. Leads captured dynamically from client callback requests are automatically routed to the next active agent.
                    </p>
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '1.1rem' }}>
                      ⚡ CRM Integrations & Gateways
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-muted)', paddingBottom: '6px' }}>
                        <span>WhatsApp API Gateway</span>
                        <strong style={{ color: '#2ec4b6' }}>🟢 Connected (Mock)</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        )}
      </main>

      {/* Selected Lead Details Modal */}
      {selectedLead && (
        <div className="modal-overlay" onClick={() => setSelectedLead(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px', background: '#070f1e', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '24px' }}>
            <button className="modal-close" onClick={() => setSelectedLead(null)}>×</button>
            <h3 style={{ color: 'var(--gold-primary)', margin: '0 0 6px 0', fontSize: '1.4rem' }}>{selectedLead.name}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-muted)', paddingBottom: '10px' }}>
              Lead ID: {selectedLead.id} | Phone: {selectedLead.phone} | Email: {selectedLead.email}
            </p>

            <div style={{ marginTop: '20px' }}>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '8px' }}>Notes & Requirements</h4>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-muted)', borderRadius: '6px', padding: '12px', fontSize: '0.88rem', color: 'var(--text-light)', minHeight: '80px', lineHeight: 1.5 }}>
                {selectedLead.notes || 'No notes available.'}
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>💬 WhatsApp Log History</span>
                <span style={{ fontSize: '0.72rem', background: '#2ec4b6', color: '#070f1e', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>Live Link</span>
              </h4>

              {logsLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}><Loader className="animate-spin" size={20} color="#D4AF37" /></div>
              ) : whatsappLogs.length === 0 ? (
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', padding: '15px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  No WhatsApp logs recorded for this lead.
                </div>
              ) : (
                <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {whatsappLogs.map(log => (
                    <div key={log.id} style={{ background: 'rgba(46,196,182,0.03)', border: '1px solid rgba(46,196,182,0.1)', borderRadius: '6px', padding: '10px', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2ec4b6', marginBottom: '4px', fontSize: '0.72rem' }}>
                        <span>Template: {log.templateName}</span>
                        <span>{new Date(log.sentTimestamp).toLocaleTimeString()}</span>
                      </div>
                      <div style={{ color: 'var(--text-light)', lineHeight: 1.4 }}>{log.messageBody}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
