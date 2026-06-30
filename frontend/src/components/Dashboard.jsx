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
      fetchStats();
    }
  }, [isLoggedIn, leadFilters, leadPage]);

  useEffect(() => {
    if (isLoggedIn && activeTab === 'properties') {
      fetchProperties();
    }
  }, [isLoggedIn, activeTab, propPage]);

  useEffect(() => {
    if (isLoggedIn && activeTab === 'team') {
      fetchAgents();
    }
  }, [isLoggedIn, activeTab]);

  // Get corridor performance and comparison matrix stats
  const getCorridorMatrixStats = () => {
    const locations = ['BANER', 'WAKAD', 'HINJEWADI', 'BALEWADI', 'TATHAWADE', 'MAHALUNGE'];
    return locations.map(loc => {
      const locLeads = allLeadsForStats.filter(l => l.preferredLocation === loc);
      const total = locLeads.length;
      
      const newInquiries = locLeads.filter(l => l.status === 'NEW').length;
      const contacted = locLeads.filter(l => l.status === 'CONTACTED').length;
      const won = locLeads.filter(l => l.status === 'CONVERTED').length;
      const lost = locLeads.filter(l => l.status === 'LOST').length;
      
      const conversionRate = total > 0 ? Math.round((won / total) * 100) : 0;
      
      // Compute average budget min
      const budgets = locLeads.map(l => Number(l.budgetMin || 0)).filter(b => b > 0);
      const avgBudget = budgets.length > 0 ? Math.round(budgets.reduce((sum, b) => sum + b, 0) / budgets.length) : 0;

      return {
        location: loc,
        total,
        newInquiries,
        contacted,
        won,
        lost,
        conversionRate,
        avgBudget
      };
    });
  };

  // Render visual stars rating for lead hotness score
  const renderLeadScoreStars = (score) => {
    let stars = 1;
    let color = '#ef4444'; // Red (Cold)
    let label = 'Cold';
    
    if (score >= 85) {
      stars = 5;
      color = '#e2c044'; // Gold
      label = 'Immediate HNWI';
    } else if (score >= 70) {
      stars = 4;
      color = '#f5b041'; // Orange (Warm)
      label = 'High Intent';
    } else if (score >= 55) {
      stars = 3;
      color = '#3498db'; // Blue (Interested)
      label = 'Interested';
    } else if (score >= 40) {
      stars = 2;
      color = '#2ec4b6'; // Teal (Generic)
      label = 'Generic';
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <div style={{ display: 'flex', gap: '2px', color }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ fontSize: '1.1rem', opacity: i < stars ? 1 : 0.2 }}>★</span>
          ))}
        </div>
        <span style={{ fontSize: '0.7rem', color, fontWeight: 'bold', textTransform: 'uppercase' }}>{label}</span>
      </div>
    );
  };

  // Export leads to CSV file
  const exportLeadsToCSV = () => {
    if (leads.length === 0) {
      alert("No leads available to export.");
      return;
    }
    
    const headers = ["Name", "Phone", "Email", "Requirement Type", "Min Budget", "Max Budget", "Preferred Location", "Status", "Lead Score", "Assigned Agent", "Created Date"];
    
    const rows = leads.map(l => [
      l.name,
      l.phone,
      l.email,
      l.requirementType,
      l.budgetMin || "0",
      l.budgetMax || "0",
      l.preferredLocation || "N/A",
      l.status,
      l.leadScore || 50,
      l.assignedAgentName || "Unassigned",
      new Date(l.createdDate).toLocaleDateString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `24k_leads_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trigger browser print for PDF report generation
  const printLeadsReport = () => {
    window.print();
  };

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
      const dataPayload = {
        ...propertyForm,
        price: parseFloat(propertyForm.price),
        areaSquareFeet: parseFloat(propertyForm.areaSquareFeet),
        bedrooms: parseInt(propertyForm.bedrooms),
        bathrooms: parseInt(propertyForm.bathrooms),
        verifiedListing: propertyForm.verifiedListing,
        exclusiveDeal: propertyForm.exclusiveDeal,
        noBrokerage: propertyForm.noBrokerage,
        reraNumber: propertyForm.reraNumber || 'RERA-PUN-PRM-24K' + Math.floor(100 + Math.random() * 900),
        imageUrl: propertyForm.imageUrl || null,
        videoUrl: propertyForm.videoUrl || null,
        threeDTourUrl: propertyForm.threeDTourUrl || null,
        furnishingStatus: propertyForm.furnishingStatus,
        gasPipeline: propertyForm.gasPipeline
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

    // Furnishing Status parsing
    if (lowerText.includes('semi furnished') || lowerText.includes('semi-furnished') || lowerText.includes('half furnished')) {
      updatedForm.furnishingStatus = 'SEMI_FURNISHED';
    } else if (lowerText.includes('fully furnished') || lowerText.includes('fully-furnished') || lowerText.includes('furnished')) {
      updatedForm.furnishingStatus = 'FULLY_FURNISHED';
    } else if (lowerText.includes('unfurnished') || lowerText.includes('raw')) {
      updatedForm.furnishingStatus = 'UNFURNISHED';
    }

    // Gas Pipeline parsing
    if (lowerText.includes('gas pipe') || lowerText.includes('piped gas') || lowerText.includes('gas pipeline') || lowerText.includes('gas connection')) {
      updatedForm.gasPipeline = true;
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

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-muted)', textAlign: 'left' }}>
            <details style={{ cursor: 'pointer' }}>
              <summary style={{ fontSize: '0.8rem', color: 'var(--gold-primary)', fontWeight: 'bold', outline: 'none' }}>
                ⚙️ API Connection Settings
              </summary>
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Set laptop IP or backend endpoint:</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input 
                    type="text" 
                    defaultValue={apiService.getApiBaseUrl()} 
                    id="crm-custom-api-url"
                    className="form-input"
                    style={{ 
                      flex: 1, 
                      padding: '6px 10px', 
                      borderRadius: '6px', 
                      fontSize: '0.8rem',
                      margin: 0
                    }} 
                    placeholder="e.g. http://192.168.1.8:8080/api/v1"
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      const val = document.getElementById('crm-custom-api-url').value;
                      apiService.setApiBaseUrl(val);
                    }}
                    className="btn-gold"
                    style={{ 
                      padding: '6px 12px', 
                      borderRadius: '6px', 
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      margin: 0
                    }}
                  >
                    Save
                  </button>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    apiService.setApiBaseUrl('');
                  }}
                  style={{
                    fontSize: '0.75rem',
                    color: '#aaa',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    alignSelf: 'flex-start',
                    padding: 0
                  }}
                >
                  Reset to Default
                </button>
              </div>
            </details>
          </div>
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
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--gold-primary)' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-num">{stats.totalLeads}</span>
            <span className="stat-label">Total Enquiries</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--gold-primary)' }}>
            <Home size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-num">{stats.activeProperties}</span>
            <span className="stat-label">Active Properties</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--gold-light)' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-num" style={{ color: 'var(--gold-light)' }}>{stats.newLeads}</span>
            <span className="stat-label">New Leads</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#2ec4b6' }}>
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-num" style={{ color: '#2ec4b6' }}>{stats.convertedLeads}</span>
            <span className="stat-label">Converted Deals</span>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <nav className="dashboard-tabs">
        <button 
          onClick={() => setActiveTab('leads')} 
          className={`tab-btn ${activeTab === 'leads' ? 'active' : ''}`}
        >
          <Users size={16} />
          Leads Pipeline
        </button>
        <button 
          onClick={() => setActiveTab('properties')} 
          className={`tab-btn ${activeTab === 'properties' ? 'active' : ''}`}
        >
          <Home size={16} />
          Property Inventory
        </button>
        <button 
          onClick={() => setActiveTab('team')} 
          className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`}
        >
          <TrendingUp size={16} />
          Team Performance
        </button>
      </nav>

      {/* LEADS PIPELINE MANAGER */}
      {activeTab === 'leads' && (
        <section>
          {/* System Match Notifications Ticker */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px dashed rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '10px 16px',
            marginBottom: '20px',
            animation: 'fadeInUp 0.5s ease forwards'
          }}>
            <span style={{ 
              width: '8px', 
              height: '8px', 
              borderRadius: '50%', 
              background: '#ef4444', 
              display: 'inline-block',
              boxShadow: '0 0 8px #ef4444'
            }} className="animate-pulse" />
            <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 500 }}>
              <strong style={{ color: '#ef4444', textTransform: 'uppercase', marginRight: '6px' }}>[Matching Engine Alert]:</strong>
              Lead 'Rahul Kumar' matches newly registered mandate listing 'TCG Crown 3BHK' in Hinjewadi (Price: ₹1.25 Cr).
            </div>
            <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Just Now
            </div>
          </div>

          {/* Corridor Performance Comparison Matrix Toggle Banner */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(7, 15, 30, 0.6)',
            border: '1px solid var(--border-gold)',
            borderRadius: '12px',
            padding: '16px 24px',
            marginBottom: '25px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            animation: 'fadeInUp 0.6s ease forwards'
          }}>
            <div>
              <h3 className="luxury-title" style={{ fontSize: '1.2rem', margin: '0 0 4px 0', color: 'var(--gold-primary)' }}>
                ⚜️ Corridor Conversion & Pipeline Comparison Matrix
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>
                Dynamic analytical comparison of premium IT/Residential corridors in Pune based on seeder and incoming inquiries.
              </p>
            </div>
            <button 
              onClick={() => setShowMatrix(!showMatrix)} 
              className="btn-outline"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              {showMatrix ? 'Hide Performance Matrix' : 'Show Performance Matrix'}
            </button>
          </div>

          {showMatrix && (
            <div className="table-responsive" style={{ marginBottom: '35px', animation: 'slideDown 0.3s forwards' }}>
              <table className="crm-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr>
                    <th>Location Corridor</th>
                    <th>Total Inquiries</th>
                    <th>New Inquiries</th>
                    <th>In Discussion</th>
                    <th>Closed Won Deals</th>
                    <th>Lost / Archived</th>
                    <th>Conversion Rate</th>
                    <th>Avg Budget Inquired</th>
                  </tr>
                </thead>
                <tbody>
                  {getCorridorMatrixStats().map(row => (
                    <tr key={row.location} style={{ background: row.total > 0 ? 'rgba(212, 175, 55, 0.03)' : 'transparent' }}>
                      <td style={{ fontWeight: 'bold', color: 'var(--text-light)' }}>{row.location} Corridor</td>
                      <td>{row.total}</td>
                      <td style={{ color: 'var(--gold-light)' }}>{row.newInquiries}</td>
                      <td>{row.contacted}</td>
                      <td style={{ color: '#2ec4b6', fontWeight: 600 }}>{row.won}</td>
                      <td style={{ opacity: 0.6 }}>{row.lost}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 'bold' }}>{row.conversionRate}%</span>
                          <div style={{ flexGrow: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', minWidth: '60px', overflow: 'hidden' }}>
                            <div style={{ width: `${row.conversionRate}%`, height: '100%', background: 'linear-gradient(90deg, #2ec4b6, #d4af37)', borderRadius: '3px' }}></div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--gold-primary)' }}>{row.avgBudget > 0 ? formatPrice(row.avgBudget) : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

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

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }} className="no-print">
              <button onClick={exportLeadsToCSV} className="btn-outline" style={{ borderColor: '#2ec4b6', color: '#2ec4b6' }}>
                📥 Export CSV
              </button>
              <button onClick={printLeadsReport} className="btn-gold" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                🖨️ Generate PDF
              </button>
            </div>
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
                      <th>Lead Hotness</th>
                      <th>Pipeline Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(lead => (
                      <tr key={lead.id}>
                        <td data-label="Name">
                          <div style={{ fontWeight: 600, color: 'var(--text-light)' }}>{lead.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {new Date(lead.createdDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td data-label="Contact">
                          <div>{lead.phone}</div>
                          <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{lead.email}</div>
                        </td>
                        <td data-label="Requirement">
                          <span style={{ fontSize: '0.8rem', background: lead.requirementType === 'BUY' ? 'rgba(197,168,128,0.15)' : 'rgba(255,255,255,0.05)', color: lead.requirementType === 'BUY' ? 'var(--gold-light)' : 'var(--text-light)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                            {lead.requirementType}
                          </span>
                          <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                            {lead.budgetMin ? formatPrice(lead.budgetMin) : 'Any'} - {lead.budgetMax ? formatPrice(lead.budgetMax) : 'Any'}
                          </div>
                        </td>
                        <td data-label="Location">{lead.preferredLocation}</td>
                        <td data-label="Assigned Agent">
                          {lead.assignedAgentName ? (
                            <div>
                              <div style={{ fontWeight: 500 }}>{lead.assignedAgentName}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lead.assignedAgentPhone}</div>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Auto-routing...</span>
                          )}
                        </td>
                        <td data-label="Hotness">
                          {renderLeadScoreStars(lead.leadScore || 50)}
                        </td>
                        <td data-label="Status">
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
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

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Image URL</label>
                    <input type="text" name="imageUrl" className="form-input" placeholder="https://images.unsplash.com/... or local url" value={propertyForm.imageUrl} onChange={e => setPropertyForm({...propertyForm, imageUrl: e.target.value})} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Drone Walkthrough Video URL (embed format)</label>
                    <input type="text" name="videoUrl" className="form-input" placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ" value={propertyForm.videoUrl} onChange={e => setPropertyForm({...propertyForm, videoUrl: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">3D Tour URL (Matterport embed link)</label>
                    <input type="text" name="threeDTourUrl" className="form-input" placeholder="e.g. https://my.matterport.com/show/?m=JGPmBB6q58g" value={propertyForm.threeDTourUrl} onChange={e => setPropertyForm({...propertyForm, threeDTourUrl: e.target.value})} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Furnishing Status</label>
                    <select name="furnishingStatus" value={propertyForm.furnishingStatus} onChange={e => setPropertyForm({...propertyForm, furnishingStatus: e.target.value})} className="form-input">
                      <option value="FULLY_FURNISHED">Fully Furnished</option>
                      <option value="SEMI_FURNISHED">Semi Furnished</option>
                      <option value="UNFURNISHED">Unfurnished</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-light)', marginTop: '24px' }}>
                      <input 
                        type="checkbox" 
                        checked={propertyForm.gasPipeline} 
                        onChange={e => setPropertyForm({...propertyForm, gasPipeline: e.target.checked})} 
                      />
                      Piped Gas Connection (Gas Pipe)
                    </label>
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

      {/* TEAM PERFORMANCE MANAGER */}
      {activeTab === 'team' && (
        <section style={{ animation: 'slideDown 0.3s forwards' }}>
          
          {/* Corridor Valuation Trend Chart Panel */}
          <div style={{
            background: 'rgba(7, 15, 30, 0.6)',
            border: '1px solid var(--border-gold)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '35px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            animation: 'fadeInUp 0.6s ease forwards'
          }}>
            <h3 className="luxury-title" style={{ fontSize: '1.2rem', margin: '0 0 8px 0', color: 'var(--gold-primary)' }}>
              ⚜️ IT Corridor Property Valuation & Price Trend Index (Per Sq.Ft.)
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
              Quarterly price progression trends (INR / Sq.Ft.) across prime Pune growth corridors.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', alignItems: 'center' }}>
              
              {/* Responsive SVG Chart */}
              <div style={{ background: '#020617', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-muted)', position: 'relative' }}>
                <svg viewBox="0 0 600 220" width="100%" height="220" style={{ overflow: 'visible' }}>
                  {/* Grid Lines */}
                  <line x1="50" y1="20" x2="550" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                  <line x1="50" y1="70" x2="550" y2="70" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                  <line x1="50" y1="120" x2="550" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                  <line x1="50" y1="170" x2="550" y2="170" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                  
                  {/* Y Axis Labels */}
                  <text x="40" y="25" fill="var(--text-muted)" fontSize="9" textAnchor="end">10K</text>
                  <text x="40" y="75" fill="var(--text-muted)" fontSize="9" textAnchor="end">8K</text>
                  <text x="40" y="125" fill="var(--text-muted)" fontSize="9" textAnchor="end">6K</text>
                  <text x="40" y="175" fill="var(--text-muted)" fontSize="9" textAnchor="end">4K</text>

                  {/* X Axis Labels */}
                  <text x="50" y="195" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Q1 2026</text>
                  <text x="175" y="195" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Q2 2026</text>
                  <text x="300" y="195" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Q3 2026</text>
                  <text x="425" y="195" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Q4 2026</text>
                  <text x="550" y="195" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Q1 2027 (Proj)</text>

                  {/* Baner Trend Line (Gold) */}
                  <polyline
                    fill="none"
                    stroke="var(--gold-primary)"
                    strokeWidth="3"
                    points="50,130 175,125 300,115 425,100 550,90"
                    style={{ transition: 'all 0.5s ease' }}
                  />
                  <circle cx="50" cy="130" r="4" fill="var(--gold-primary)" />
                  <circle cx="175" cy="125" r="4" fill="var(--gold-primary)" />
                  <circle cx="300" cy="115" r="4" fill="var(--gold-primary)" />
                  <circle cx="425" cy="100" r="4" fill="var(--gold-primary)" />
                  <circle cx="550" cy="90" r="4" fill="var(--gold-primary)" />

                  {/* Wakad Trend Line (Teal) */}
                  <polyline
                    fill="none"
                    stroke="#2ec4b6"
                    strokeWidth="3"
                    points="50,150 175,145 300,135 425,120 550,110"
                  />
                  <circle cx="50" cy="150" r="4" fill="#2ec4b6" />
                  <circle cx="175" cy="145" r="4" fill="#2ec4b6" />
                  <circle cx="300" cy="135" r="4" fill="#2ec4b6" />
                  <circle cx="425" cy="120" r="4" fill="#2ec4b6" />
                  <circle cx="550" cy="110" r="4" fill="#2ec4b6" />

                  {/* Hinjewadi Trend Line (Silver/White) */}
                  <polyline
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="3"
                    points="50,165 175,160 300,150 425,140 550,130"
                  />
                  <circle cx="50" cy="165" r="4" fill="#94a3b8" />
                  <circle cx="175" cy="160" r="4" fill="#94a3b8" />
                  <circle cx="300" cy="150" r="4" fill="#94a3b8" />
                  <circle cx="425" cy="140" r="4" fill="#94a3b8" />
                  <circle cx="550" cy="130" r="4" fill="#94a3b8" />
                </svg>
              </div>

              {/* Legend & Details */}
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
            <div className="empty-state">No relationship managers registered in the system.</div>
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
                      
                      {/* Active Status Ring */}
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

                      {/* Contact Info */}
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
                        <div>📞 {agent.phone}</div>
                        <div>✉️ {agent.email}</div>
                      </div>

                      {/* Stats Metrics breakdown */}
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

                      {/* Conversion progress bar */}
                      <div style={{ marginTop: 'auto' }}>
                        <div style={{ display: 'flex', justifycontent: 'space-between', fontSize: '0.75rem', marginBottom: '6px', color: 'var(--text-muted)' }}>
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

              {/* Operational Settings panel */}
              <div className="crm-drawer" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div>
                  <h4 style={{ color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '1.1rem' }}>
                    🟢 Lead Allocation Engine Rules
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '10px' }}>
                    Our Spring Boot backend employs an event-driven <strong>Round-Robin routing listener</strong>. Leads captured dynamically from client callback requests are automatically routed to the next active agent.
                  </p>
                  <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '20px', lineHeight: 1.6 }}>
                    <li>Automatic Load Balancing across active relationship managers.</li>
                    <li>Fail-safe backup ensures no lead is left unassigned.</li>
                    <li>Lead routing details are saved directly in database logs.</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '1.1rem' }}>
                    ⚡ CRM Integrations & Gateways
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', justifycontent: 'space-between', borderBottom: '1px solid var(--border-muted)', paddingBottom: '6px' }}>
                      <span>WhatsApp API Gateway</span>
                      <strong style={{ color: '#2ec4b6' }}>🟢 Connected (Mock)</strong>
                    </div>
                    <div style={{ display: 'flex', justifycontent: 'space-between', borderBottom: '1px solid var(--border-muted)', paddingBottom: '6px' }}>
                      <span>SMS Service Desk</span>
                      <strong style={{ color: 'var(--gold-primary)' }}>🟢 Standby (Dev mode)</strong>
                    </div>
                    <div style={{ display: 'flex', justifycontent: 'space-between', paddingBottom: '6px' }}>
                      <span>Real-time DB Synchronization</span>
                      <strong style={{ color: '#2ec4b6' }}>🟢 Active</strong>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}
