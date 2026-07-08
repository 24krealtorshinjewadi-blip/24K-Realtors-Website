import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { 
  Users, Home, TrendingUp, Calendar, Trash2, Edit2, Plus, 
  Loader, RefreshCw, Lock, LogOut, Upload, Clock, FileText, Building, Eye, EyeOff
} from 'lucide-react';
import './Dashboard.css';

// Import Modular Property Form Drawer
import PropertyFormDrawer from './PropertyFormDrawer';

// Import Modular HRMS & Payroll tabs
import EmployeesTab from './EmployeesTab';
import AttendanceTab from './AttendanceTab';
import LeavesTab from './LeavesTab';
import PayrollTab from './PayrollTab';
import LeadDetailsEx from './LeadDetailsEx';
import SocietiesTab from './SocietiesTab';
import BlogsTab from './BlogsTab';

// PropertiesMap Leaflet Component
function PropertiesMap({ properties }) {
  const mapRef = React.useRef(null);
  const mapInstance = React.useRef(null);

  React.useEffect(() => {
    if (!window.L || !mapRef.current) return;

    const centerLat = 18.583418;
    const centerLon = 73.727354;

    if (mapInstance.current) {
      mapInstance.current.remove();
    }

    const L = window.L;
    const map = L.map(mapRef.current).setView([centerLat, centerLon], 13);
    mapInstance.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const goldIcon = L.divIcon({
      className: 'custom-leaflet-marker',
      html: `<div style="background: var(--gold-primary); width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.5)"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });

    properties.forEach(prop => {
      if (prop.latitude && prop.longitude) {
        const marker = L.marker([prop.latitude, prop.longitude], { icon: goldIcon }).addTo(map);
        
        const priceText = new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format(prop.price);

        const popupContent = `
          <div style="color: #070f1e; font-family: sans-serif; padding: 5px;">
            <div style="font-weight: bold; font-size: 0.9rem; margin-bottom: 4px; color: #1a202c;">${prop.title}</div>
            <div style="font-size: 0.75rem; color: #718096; margin-bottom: 6px;">${prop.location} | ${prop.propertyType}</div>
            <div style="font-weight: bold; color: #b7791f; font-size: 0.85rem; margin-bottom: 8px;">${priceText}</div>
            <div style="font-size: 0.7rem; color: #4a5568; max-width: 180px; margin-bottom: 8px; line-height: 1.3;">${prop.description || ''}</div>
          </div>
        `;
        marker.bindPopup(popupContent);
      }
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [properties]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        height: '500px', 
        width: '100%', 
        borderRadius: '12px', 
        border: '1px solid var(--border-gold)',
        background: '#070f1e',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        marginTop: '15px'
      }} 
    />
  );
}

// KanbanBoard Lead Component
const KanbanBoard = ({ leads, onStatusChange, onViewDetails, formatPrice }) => {
  const columns = [
    { key: 'NEW', label: 'New Inquiry', borderColor: '#3182ce' },
    { key: 'CONTACTED', label: 'Contacted', borderColor: '#dd6b20' },
    { key: 'IN_PROGRESS', label: 'In Progress', borderColor: '#319795' },
    { key: 'VISITED', label: 'Visited', borderColor: '#805ad5' },
    { key: 'CONVERTED', label: 'Converted', borderColor: '#38a169' },
    { key: 'LOST', label: 'Lost', borderColor: '#e53e3e' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '20px', overflowX: 'auto', paddingBottom: '20px' }}>
      {columns.map(col => {
        const colLeads = leads.filter(l => l.status === col.key);
        return (
          <div 
            key={col.key}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const id = e.dataTransfer.getData('text/plain');
              if (id) onStatusChange(id, col.key);
            }}
            style={{ 
              background: 'rgba(7, 15, 30, 0.7)', 
              border: `1px solid ${col.borderColor}`, 
              borderRadius: '8px', 
              padding: '12px',
              minHeight: '450px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${col.borderColor}`, paddingBottom: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-light)' }}>{col.label}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '10px' }}>{colLeads.length}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
              {colLeads.map(lead => (
                <div 
                  key={lead.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', lead.id)}
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.02)', 
                    border: '1px solid var(--border-muted)', 
                    borderRadius: '6px', 
                    padding: '10px',
                    cursor: 'grab',
                    transition: 'all 0.2s'
                  }}
                  onDragOver={(e) => e.currentTarget.style.borderColor = 'var(--gold-primary)'}
                  onDragLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-muted)'}
                >
                  <div style={{ fontWeight: 600, color: 'var(--text-light)', fontSize: '0.85rem' }}>{lead.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Loc: {lead.preferredLocation || 'Any'}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Budget: {lead.budgetMin ? `${formatPrice(lead.budgetMin)} - ${formatPrice(lead.budgetMax)}` : 'N/A'}</div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--gold-primary)', fontWeight: 'bold' }}>Score: {lead.leadScore || 50}%</span>
                    <button 
                      onClick={() => onViewDetails(lead)} 
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--gold-light)', 
                        fontSize: '0.7rem', 
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      Audit 🔍
                    </button>
                  </div>
                </div>
              ))}
              {colLeads.length === 0 && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textAlign: 'center', padding: '20px 0', border: '1px dashed rgba(255,255,255,0.05)', borderRadius: '4px', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Drag leads here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function Dashboard({ onViewChange }) {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(apiService.isAuthenticated());
  const [authTab, setAuthTab] = useState('login'); // login | register
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Role-based access control — read from localStorage after login
  const userRole = localStorage.getItem('role') || 'EMPLOYEE';
  const adminUsername = localStorage.getItem('adminUser') || '';

  // Role permission helpers
  const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(userRole);
  const isHR = userRole === 'HR';
  const isSalesManager = userRole === 'SALES_MANAGER';
  const isRM = userRole === 'RELATIONSHIP_MANAGER';
  const canManageProperties = isAdmin || isSalesManager;
  const canSeePayroll = isAdmin || isHR;
  const canSeeEmployeeList = isAdmin || isHR || isSalesManager;
  const canSeeAllAttendance = isAdmin || isHR;

  // Multi-factor OTP authentication state variables
  const [loginStep, setLoginStep] = useState('credentials'); // credentials | otp
  const [tempToken, setTempToken] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [rememberDevice, setRememberDevice] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [devMockOtpHelper, setDevMockOtpHelper] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP resend timer countdown hook
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  // CRM Tab management
  const [activeTab, setActiveTab] = useState('leads'); // leads | properties | team
  const [leads, setLeads] = useState([]);
  const [leadViewMode, setLeadViewMode] = useState('table'); // table | kanban
  const [propViewMode, setPropViewMode] = useState('list'); // list | map
  const [mapInitialized, setMapInitialized] = useState(false);
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
  const [societies, setSocieties] = useState([]);
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
    gasPipeline: false,
    societyId: ''
  });

  const [formSubmitLoading, setFormSubmitLoading] = useState(false);

  // Selected Lead Details Modal State
  const [selectedLead, setSelectedLead] = useState(null);

  // Follow-up Task States
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [taskStats, setTaskStats] = useState({ totalTasks: 0, pendingTasks: 0, completedTasks: 0, overdueTasks: 0 });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskFilters, setTaskFilters] = useState({ agentId: '', status: '', priority: '' });
  const [taskForm, setTaskForm] = useState({
    leadId: '',
    agentId: '',
    title: '',
    description: '',
    taskType: 'CALL',
    dueDate: '',
    priority: 'MEDIUM'
  });
  
  const fetchTasks = async () => {
    if (!isLoggedIn) return;
    setTasksLoading(true);
    try {
      const data = await apiService.getTasks();
      setTasks(data || []);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setTasksLoading(false);
    }
  };

  const fetchTaskStats = async () => {
    if (!isLoggedIn) return;
    try {
      const data = await apiService.getTaskStats();
      setTaskStats(data || { totalTasks: 0, pendingTasks: 0, completedTasks: 0, overdueTasks: 0 });
    } catch (err) {
      console.error("Failed to fetch task stats:", err);
    }
  };

  const fetchLeadTasks = async (leadId) => {
    setLeadTasksLoading(true);
    try {
      const data = await apiService.getTasks();
      const filtered = (data || []).filter(t => t.lead && t.lead.id === leadId);
      setLeadTasks(filtered);
    } catch (err) {
      console.error("Failed to fetch tasks for lead:", err);
    } finally {
      setLeadTasksLoading(false);
    }
  };

  const handleViewLeadDetails = async (lead) => {
    setSelectedLead(lead);
    setWhatsappLogs([]);
    setLogsLoading(true);
    setLeadTasks([]);
    setShowInlineTaskForm(false);
    
    // Set default inline form due date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    const tomorrowStr = tomorrow.toISOString().slice(0, 16);
    setInlineTaskForm({
      title: '',
      description: '',
      taskType: 'CALL',
      dueDate: tomorrowStr,
      priority: 'MEDIUM'
    });

    try {
      const logs = await apiService.getWhatsAppLogs(lead.id);
      setWhatsappLogs(logs || []);
      await fetchLeadTasks(lead.id);
    } catch (err) {
      console.error("Failed to fetch WhatsApp logs / lead tasks:", err);
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

  // Fetch Societies
  const fetchSocieties = async () => {
    if (!isLoggedIn) return;
    try {
      const data = await apiService.getSocieties(0, 100);
      setSocieties(data.content || []);
    } catch (err) {
      console.error("Failed to fetch societies list:", err);
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
      fetchTasks();
      fetchTaskStats();
      fetchSocieties();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, leadPage, propPage, leadFilters, activeTab]);

  useEffect(() => {
    if (activeTab === 'properties' && propViewMode === 'map') {
      if (window.L) {
        setMapInitialized(true);
        return;
      }
      
      // Inject Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      
      // Inject Leaflet JS
      if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script');
        script.id = 'leaflet-js';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
          setMapInitialized(true);
        };
        document.head.appendChild(script);
      } else {
        setMapInitialized(true);
      }
    }
  }, [activeTab, propViewMode]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...taskForm,
        dueDate: taskForm.dueDate ? new Date(taskForm.dueDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
      };
      await apiService.createTask(payload);
      showNotification('Task scheduled successfully.');
      setShowTaskForm(false);
      
      setTaskForm({
        leadId: '',
        agentId: '',
        title: '',
        description: '',
        taskType: 'CALL',
        dueDate: '',
        priority: 'MEDIUM'
      });
      
      fetchTasks();
      fetchTaskStats();
      fetchAgents();
    } catch (err) {
      alert(`Failed to create task: ${err.message}`);
    }
  };

  const handleToggleTaskStatus = async (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'PENDING' ? 'COMPLETED' : 'PENDING';
    try {
      await apiService.updateTaskStatus(taskId, nextStatus);
      showNotification(`Task marked as ${nextStatus.toLowerCase()}.`);
      fetchTasks();
      fetchTaskStats();
      fetchAgents();
      if (selectedLead) {
        fetchLeadTasks(selectedLead.id);
      }
    } catch (err) {
      alert(`Failed to update task: ${err.message}`);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await apiService.deleteTask(taskId);
      showNotification('Task removed.');
      fetchTasks();
      fetchTaskStats();
      fetchAgents();
      if (selectedLead) {
        fetchLeadTasks(selectedLead.id);
      }
    } catch (err) {
      alert(`Failed to delete task: ${err.message}`);
    }
  };

  // Handle Login & Registration Submit (IAM Flow)
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      if (authTab === 'login') {
        const data = await apiService.loginInit(authForm.username, authForm.password, rememberDevice);
        if (data && data.tempToken) {
          setTempToken(data.tempToken);
          setMaskedEmail(data.emailMasked);
          setLoginStep('otp');
          setOtpCode(['', '', '', '', '', '']);
          setResendTimer(30);
          if (data.devMockOtp) {
            setDevMockOtpHelper(data.devMockOtp);
          }
          showNotification('MFA Verification code dispatched.');
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

  // Handle MFA OTP Verification Submit
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const code = otpCode.join('');
      if (code.length < 6) {
        throw new Error('Please enter the full 6-digit verification code.');
      }
      const data = await apiService.loginVerify(tempToken, code);
      if (data && data.token) {
        setIsLoggedIn(true);
        setLoginStep('credentials');
        showNotification(`Welcome back, ${data.fullName || data.username}. Session authorized.`);
      }
    } catch (err) {
      setAuthError(err.message || 'Verification failed. Please verify the code.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Resend OTP code request
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setAuthLoading(true);
    setAuthError('');
    try {
      const data = await apiService.loginInit(authForm.username, authForm.password, rememberDevice);
      if (data && data.tempToken) {
        setTempToken(data.tempToken);
        setMaskedEmail(data.emailMasked);
        setOtpCode(['', '', '', '', '', '']);
        setResendTimer(30);
        if (data.devMockOtp) {
          setDevMockOtpHelper(data.devMockOtp);
        }
        showNotification('New verification code dispatched.');
      }
    } catch (err) {
      setAuthError(err.message || 'Failed to dispatch new OTP code.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Focus shifting helpers for OTP code input elements
  const handleOtpChange = (index, value) => {
    if (value && isNaN(value)) return;
    const newOtp = [...otpCode];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtpCode(newOtp);

    // Auto-focus next input field
    if (value !== '' && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otpCode[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        // Clear previous input value on backspace
        const newOtp = [...otpCode];
        newOtp[index - 1] = '';
        setOtpCode(newOtp);
      }
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
      gasPipeline: property.gasPipeline || false,
      societyId: property.societyId || ''
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
      gasPipeline: false,
      societyId: ''
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

    const priceCrMatch = text.match(/([\d.]+)\s*(?:Cr|cr|Crore)/);
    if (priceCrMatch) {
      parsed.price = Math.round(parseFloat(priceCrMatch[1]) * 10000000);
    } else {
      const priceLMatch = text.match(/([\d.]+)\s*(?:L|l|Lakh)/);
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
            <span className="logo-badge">ENTERPRISE IAM PORTAL</span>
            <span className="logo-text">24K REALTORS</span>
            <span className="sub-text">IDENTITY &amp; ACCESS CONTROL</span>
          </div>

          {loginStep === 'credentials' ? (
            <>
              <div className="auth-tab-buttons">
                <button className={authTab === 'login' ? 'active' : ''} onClick={() => setAuthTab('login')}>SIGN IN</button>
                <button className={authTab === 'register' ? 'active' : ''} onClick={() => setAuthTab('register')}>PROVISION ACCESS</button>
              </div>

              <form onSubmit={handleAuthSubmit} style={{ marginTop: '20px' }}>
                <div className="form-group text-left">
                  <label className="form-label">Principal Identity (Username)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="e.g. neeraj.giri" 
                    value={authForm.username} 
                    onChange={e => setAuthForm({...authForm, username: e.target.value})} 
                  />
                </div>
                <div className="form-group text-left" style={{ marginTop: '16px' }}>
                  <label className="form-label">Access Credentials (Password)</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="form-input" 
                      style={{ paddingRight: '40px' }}
                      required 
                      placeholder="••••••••" 
                      value={authForm.password} 
                      onChange={e => setAuthForm({...authForm, password: e.target.value})} 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      className="btn-password-toggle"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {authTab === 'login' && (
                  <div className="remember-device-container">
                    <label className="remember-device-label">
                      <input 
                        type="checkbox" 
                        checked={rememberDevice} 
                        onChange={e => setRememberDevice(e.target.checked)} 
                        className="remember-device-checkbox"
                      />
                      <span>Remember this device for 30 days</span>
                    </label>
                  </div>
                )}

                {authError && <div className="auth-error-msg">⚠️ {authError}</div>}

                <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }} disabled={authLoading}>
                  {authLoading ? <Loader className="animate-spin" size={18} /> : (authTab === 'login' ? 'Verify Credentials →' : 'Request Account Provision')}
                </button>
              </form>
            </>
          ) : (
            <div className="mfa-step-container">
              <div className="security-icon-circle">
                <Lock className="security-lock-animate" size={24} style={{ color: 'var(--gold-primary)' }} />
              </div>
              <h3 className="mfa-title">Multi-Factor Authentication</h3>
              <p className="mfa-desc">
                We've dispatched a 6-digit security code to your registered corporate email:
                <strong className="mfa-email" style={{ display: 'block', marginTop: '6px', color: '#FFF' }}>{maskedEmail}</strong>
              </p>

              <form onSubmit={handleOtpSubmit} style={{ marginTop: '24px' }}>
                <div className="otp-digit-grid">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength="1"
                      className="otp-digit-input"
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      autoFocus={idx === 0}
                      required
                    />
                  ))}
                </div>

                {authError && <div className="auth-error-msg" style={{ marginTop: '16px' }}>⚠️ {authError}</div>}

                <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '24px' }} disabled={authLoading}>
                  {authLoading ? <Loader className="animate-spin" size={18} /> : 'Authorize Workspace session'}
                </button>
              </form>

              <div className="mfa-actions-row">
                {resendTimer > 0 ? (
                  <span className="mfa-resend-countdown">Resend code in {resendTimer}s</span>
                ) : (
                  <button onClick={handleResendOtp} className="btn-resend-otp" disabled={authLoading}>
                    Resend Code
                  </button>
                )}
                
                <button 
                  onClick={() => { setLoginStep('credentials'); setAuthError(''); }} 
                  className="btn-back-credentials"
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Change Credentials
                </button>
              </div>

              {devMockOtpHelper && (
                <div className="dev-otp-helper">
                  <span className="helper-title">🔒 DEVELOPER LOCAL MODE:</span>
                  <span className="helper-code">Your OTP is: <strong>{devMockOtpHelper}</strong></span>
                </div>
              )}
            </div>
          )}

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
          <div style={{ marginTop: '5px' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--gold-primary)', display: 'block' }}>{adminUsername}</span>
            <span style={{ fontSize: '0.6rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{userRole.replace('_', ' ')}</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {!isHR && (
            <button className={`crm-sidebar-glide-item ${activeTab === 'leads' ? 'active' : ''}`} onClick={() => { setActiveTab('leads'); handleClosePropForm(); }}>
              <Users size={18} />
              <span>{isRM ? 'My Leads' : 'Lead Pipelines'}</span>
            </button>
          )}

          {!isHR && (
            <button className={`crm-sidebar-glide-item ${activeTab === 'properties' ? 'active' : ''}`} onClick={() => { setActiveTab('properties'); handleClosePropForm(); }}>
              <Home size={18} />
              <span>Properties Desk</span>
            </button>
          )}

          {canManageProperties && (
            <button className={`crm-sidebar-glide-item ${activeTab === 'societies' ? 'active' : ''}`} onClick={() => { setActiveTab('societies'); handleClosePropForm(); }}>
              <Building size={18} />
              <span>Societies & Devs</span>
            </button>
          )}

          {isAdmin && (
            <button className={`crm-sidebar-glide-item ${activeTab === 'blogs' ? 'active' : ''}`} onClick={() => { setActiveTab('blogs'); handleClosePropForm(); }}>
              <FileText size={18} />
              <span>Blogs CMS</span>
            </button>
          )}

          {(isAdmin || isSalesManager) && (
            <button className={`crm-sidebar-glide-item ${activeTab === 'team' ? 'active' : ''}`} onClick={() => { setActiveTab('team'); handleClosePropForm(); }}>
              <TrendingUp size={18} />
              <span>Advisory RMs</span>
            </button>
          )}

          {!isHR && (
            <button className={`crm-sidebar-glide-item ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => { setActiveTab('tasks'); handleClosePropForm(); }}>
              <Calendar size={18} />
              <span>{isRM ? 'My Tasks' : 'Follow-up Tasks'}</span>
            </button>
          )}

          {canSeeEmployeeList && (
            <button className={`crm-sidebar-glide-item ${activeTab === 'employees' ? 'active' : ''}`} onClick={() => { setActiveTab('employees'); handleClosePropForm(); }}>
              <Users size={18} />
              <span>Employees (HR)</span>
            </button>
          )}

          <button className={`crm-sidebar-glide-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => { setActiveTab('attendance'); handleClosePropForm(); }}>
            <Clock size={18} />
            <span>{canSeeAllAttendance ? 'Attendance (All)' : 'My Attendance'}</span>
          </button>

          <button className={`crm-sidebar-glide-item ${activeTab === 'leaves' ? 'active' : ''}`} onClick={() => { setActiveTab('leaves'); handleClosePropForm(); }}>
            <Calendar size={18} />
            <span>Leaves Portal</span>
          </button>

          {canSeePayroll && (
            <button className={`crm-sidebar-glide-item ${activeTab === 'payroll' ? 'active' : ''}`} onClick={() => { setActiveTab('payroll'); handleClosePropForm(); }}>
              <FileText size={18} />
              <span>Payroll & ERP</span>
            </button>
          )}
          
          
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
          <section className="module-content-transition">
            <div className="action-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
              <h2 className="luxury-title" style={{ fontSize: '1.4rem', margin: 0 }}>Lead Management Pipeline</h2>
              
              {/* Dynamic Filtering */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '2px', borderRadius: '6px', border: '1px solid var(--border-gold)', marginRight: '5px' }}>
                  <button 
                    onClick={() => setLeadViewMode('table')} 
                    style={{ 
                      padding: '6px 12px', 
                      fontSize: '0.75rem', 
                      background: leadViewMode === 'table' ? 'var(--gold-primary)' : 'transparent',
                      color: leadViewMode === 'table' ? '#070f1e' : 'var(--text-light)',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                  >
                    Table
                  </button>
                  <button 
                    onClick={() => setLeadViewMode('kanban')} 
                    style={{ 
                      padding: '6px 12px', 
                      fontSize: '0.75rem', 
                      background: leadViewMode === 'kanban' ? 'var(--gold-primary)' : 'transparent',
                      color: leadViewMode === 'kanban' ? '#070f1e' : 'var(--text-light)',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                  >
                    Kanban
                  </button>
                </div>

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
            ) : leadViewMode === 'kanban' ? (
              <KanbanBoard 
                leads={leads} 
                onStatusChange={handleLeadStatusChange} 
                onViewDetails={handleViewLeadDetails} 
                formatPrice={formatPrice} 
              />
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <svg width="24" height="24" viewBox="0 0 30 30" style={{ transform: 'rotate(-90deg)', display: 'inline-block', verticalAlign: 'middle' }}>
                                <circle cx="15" cy="15" r="12" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" />
                                <circle 
                                  cx="15" cy="15" r="12" 
                                  fill="none" 
                                  stroke={lead.leadScore >= 70 ? '#2ec4b6' : 'var(--gold-primary)'} 
                                  strokeWidth="2.5" 
                                  strokeDasharray={2 * Math.PI * 12}
                                  strokeDashoffset={(2 * Math.PI * 12) * (1 - (lead.leadScore || 50) / 100)}
                                />
                              </svg>
                              <strong style={{ fontSize: '0.85rem', color: lead.leadScore >= 70 ? '#2ec4b6' : 'var(--gold-primary)' }}>
                                {lead.leadScore || 50}%
                              </strong>
                            </div>
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
          <section className="module-content-transition">
            <div className="action-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
              <h2 className="luxury-title" style={{ fontSize: '1.4rem', margin: 0 }}>Properties Inventory</h2>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', padding: '2px', borderRadius: '6px', border: '1px solid var(--border-gold)', marginRight: '5px' }}>
                  <button 
                    onClick={() => setPropViewMode('list')} 
                    style={{ 
                      padding: '6px 12px', 
                      fontSize: '0.75rem', 
                      background: propViewMode === 'list' ? 'var(--gold-primary)' : 'transparent',
                      color: propViewMode === 'list' ? '#070f1e' : 'var(--text-light)',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                  >
                    List
                  </button>
                  <button 
                    onClick={() => setPropViewMode('map')} 
                    style={{ 
                      padding: '6px 12px', 
                      fontSize: '0.75rem', 
                      background: propViewMode === 'map' ? 'var(--gold-primary)' : 'transparent',
                      color: propViewMode === 'map' ? '#070f1e' : 'var(--text-light)',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                  >
                    Map
                  </button>
                </div>
                
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
              societies={societies}
            />

            {propsLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
                <Loader className="animate-spin" size={32} color="#D4AF37" />
              </div>
            ) : properties.length === 0 ? (
              <div className="empty-state">No listings published. Click "Add Listing" to publish.</div>
            ) : propViewMode === 'map' ? (
              mapInitialized ? (
                <PropertiesMap properties={properties} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', gap: '15px' }}>
                  <Loader className="animate-spin" size={32} color="#D4AF37" />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading Leaflet Maps...</span>
                </div>
              )
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
                          <td data-label="Title">
                            <div style={{ fontWeight: 600, color: 'var(--text-light)' }}>{property.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{property.address || 'Pune'}</div>
                          </td>
                          <td data-label="Location">{property.location}</td>
                          <td data-label="Type">
                            <span style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>
                              {property.bedrooms ? `${property.bedrooms} BHK ` : ''}{property.propertyType.toLowerCase()} / {property.transactionType.toLowerCase()}
                            </span>
                          </td>
                          <td data-label="Price" style={{ fontWeight: 600, color: 'var(--gold-primary)' }}>
                            {formatPrice(property.price)}
                          </td>
                          <td data-label="RERA ID">
                            <code style={{ fontSize: '0.75rem', color: 'var(--gold-light)' }}>{property.reraNumber || 'EXEMPT'}</code>
                          </td>
                          <td data-label="Promotions">
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {property.exclusiveDeal && <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(212,175,55,0.1)', color: 'var(--gold-light)', borderRadius: '3px' }}>Exclusive</span>}
                              {property.noBrokerage && <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(46,196,182,0.1)', color: '#2ec4b6', borderRadius: '3px' }}>0% Fee</span>}
                            </div>
                          </td>
                          <td data-label="Status">
                            <span style={{ 
                              fontSize: '0.7rem', 
                              padding: '2px 6px', 
                              borderRadius: '4px',
                              background: property.status === 'ACTIVE' || property.status === 'AVAILABLE' ? 'rgba(46,196,182,0.1)' : 'rgba(217,4,41,0.1)',
                              color: property.status === 'ACTIVE' || property.status === 'AVAILABLE' ? '#2ec4b6' : '#ff4d6d'
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
          <section className="module-content-transition">
            
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

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center', marginBottom: '12px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-muted)' }}>
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

                        {/* Task Performance Metrics */}
                        {(() => {
                          const agentTasks = tasks.filter(t => t.agent && (t.agent.id === agent.id || t.agent.name === agent.name));
                          const pendingAgentTasks = agentTasks.filter(t => t.status === 'PENDING').length;
                          const completedAgentTasks = agentTasks.filter(t => t.status === 'COMPLETED').length;
                          return (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', textAlign: 'center', marginBottom: '18px', background: 'rgba(46,196,182,0.02)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(46,196,182,0.1)' }}>
                              <div>
                                <strong style={{ fontSize: '1.1rem', color: 'var(--text-light)', display: 'block' }}>{pendingAgentTasks}</strong>
                                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Tasks</span>
                              </div>
                              <div>
                                <strong style={{ fontSize: '1.1rem', color: '#2ec4b6', display: 'block' }}>{completedAgentTasks}</strong>
                                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Completed</span>
                              </div>
                            </div>
                          );
                        })()}

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

        {/* TAB 4: TASKS & FOLLOW-UPS */}
        {activeTab === 'tasks' && (
          <section className="module-content-transition">
            
            {/* Task Stats Row */}
            <div className="crm-stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
              <div className="stats-kpi-card" style={{ padding: '16px' }}>
                <span className="kpi-label" style={{ fontSize: '0.62rem' }}>TOTAL FOLLOW-UPS</span>
                <span className="kpi-val" style={{ fontSize: '1.8rem' }}>{taskStats.totalTasks}</span>
                <span className="kpi-sub" style={{ fontSize: '0.65rem' }}>All Scheduled Tasks</span>
              </div>
              <div className="stats-kpi-card" style={{ padding: '16px' }}>
                <span className="kpi-label" style={{ fontSize: '0.62rem' }}>PENDING TASKS</span>
                <span className="kpi-val" style={{ fontSize: '1.8rem', color: 'var(--gold-primary)' }}>{taskStats.pendingTasks}</span>
                <span className="kpi-sub" style={{ fontSize: '0.65rem' }}>Awaiting Action</span>
              </div>
              <div className="stats-kpi-card" style={{ padding: '16px' }}>
                <span className="kpi-label" style={{ fontSize: '0.62rem' }}>OVERDUE TASKS</span>
                <span className="kpi-val" style={{ fontSize: '1.8rem', color: '#ff4d6d' }}>{taskStats.overdueTasks}</span>
                <span className="kpi-sub" style={{ fontSize: '0.65rem' }}>Missed Deadlines</span>
              </div>
              <div className="stats-kpi-card" style={{ padding: '16px' }}>
                <span className="kpi-label" style={{ fontSize: '0.62rem' }}>COMPLETED TASKS</span>
                <span className="kpi-val" style={{ fontSize: '1.8rem', color: '#2ec4b6' }}>{taskStats.completedTasks}</span>
                <span className="kpi-sub" style={{ fontSize: '0.65rem' }}>Resolved Follow-ups</span>
              </div>
            </div>

            <div className="action-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
              <h2 className="luxury-title" style={{ fontSize: '1.4rem', margin: 0 }}>Follow-up Tasks Desk</h2>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => {
                  // Set default due date to tomorrow
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  tomorrow.setHours(10, 0, 0, 0);
                  const tomorrowStr = tomorrow.toISOString().slice(0, 16);
                  setTaskForm({...taskForm, dueDate: tomorrowStr});
                  setShowTaskForm(!showTaskForm);
                }} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={16} />
                  Schedule Task
                </button>
                <button onClick={() => { fetchTasks(); fetchTaskStats(); }} className="btn-outline" style={{ padding: '10px 16px', fontSize: '0.9rem' }}>
                  <RefreshCw size={14} className={tasksLoading ? "animate-spin" : ""} />
                  Refresh Tasks
                </button>
              </div>
            </div>

            {/* Task Creation Form Panel */}
            {showTaskForm && (
              <div className="form-drawer-overlay" style={{ background: 'rgba(7, 15, 30, 0.6)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border-gold)', marginBottom: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-muted)', paddingBottom: '10px' }}>
                  <h3 style={{ color: 'var(--gold-primary)', margin: 0, fontSize: '1.25rem' }}>⚜️ Schedule New Task</h3>
                  <button onClick={() => setShowTaskForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                </div>
                <form onSubmit={handleCreateTask} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  
                  <div className="form-group">
                    <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Select Lead *</label>
                    <select required value={taskForm.leadId} onChange={e => setTaskForm({...taskForm, leadId: e.target.value})} className="form-input" style={{ width: '100%' }}>
                      <option value="">-- Choose Lead --</option>
                      {leads.map(l => (
                        <option key={l.id} value={l.id}>{l.name} ({l.preferredLocation || 'General'})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Select Assignee *</label>
                    <select required value={taskForm.agentId} onChange={e => setTaskForm({...taskForm, agentId: e.target.value})} className="form-input" style={{ width: '100%' }}>
                      <option value="">-- Choose Employee --</option>
                      {agents.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Task Title *</label>
                    <input required type="text" placeholder="e.g. Call Client, Site Visit" value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} className="form-input" style={{ width: '100%' }} />
                  </div>

                  <div className="form-group">
                    <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Task Type</label>
                    <select value={taskForm.taskType} onChange={e => setTaskForm({...taskForm, taskType: e.target.value})} className="form-input" style={{ width: '100%' }}>
                      <option value="CALL">📞 Call</option>
                      <option value="EMAIL">✉️ Email</option>
                      <option value="SITE_VISIT">🏡 Site Visit</option>
                      <option value="MEETING">🤝 Meeting</option>
                      <option value="OTHER">🗓️ Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Due Date & Time *</label>
                    <input required type="datetime-local" value={taskForm.dueDate} onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})} className="form-input" style={{ width: '100%' }} />
                  </div>

                  <div className="form-group">
                    <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Priority</label>
                    <select value={taskForm.priority} onChange={e => setTaskForm({...taskForm, priority: e.target.value})} className="form-input" style={{ width: '100%' }}>
                      <option value="HIGH">🔴 High</option>
                      <option value="MEDIUM">🟡 Medium</option>
                      <option value="LOW">🟢 Low</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label style={{ color: 'var(--text-light)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Description / Notes</label>
                    <textarea placeholder="Write task instructions here..." value={taskForm.description} onChange={e => setTaskForm({...taskForm, description: e.target.value})} className="form-input" style={{ minHeight: '60px', width: '100%' }} />
                  </div>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button type="button" onClick={() => setShowTaskForm(false)} className="btn-outline">Cancel</button>
                    <button type="submit" className="btn-primary">Schedule Task</button>
                  </div>
                </form>
              </div>
            )}

            {/* Task Filters */}
            <div className="action-row" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '25px', background: 'rgba(255,255,255,0.01)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border-muted)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>Filters:</span>
              <select value={taskFilters.agentId} onChange={e => setTaskFilters({...taskFilters, agentId: e.target.value})} className="form-input" style={{ width: '180px', margin: 0, padding: '6px 12px', fontSize: '0.8rem' }}>
                <option value="">All Employees</option>
                {agents.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              <select value={taskFilters.status} onChange={e => setTaskFilters({...taskFilters, status: e.target.value})} className="form-input" style={{ width: '150px', margin: 0, padding: '6px 12px', fontSize: '0.8rem' }}>
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <select value={taskFilters.priority} onChange={e => setTaskFilters({...taskFilters, priority: e.target.value})} className="form-input" style={{ width: '140px', margin: 0, padding: '6px 12px', fontSize: '0.8rem' }}>
                <option value="">All Priorities</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {/* Tasks Grid List */}
            {tasksLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
                <Loader className="animate-spin" size={32} color="#D4AF37" />
              </div>
            ) : tasks.length === 0 ? (
              <div className="empty-state">No follow-up tasks scheduled. Click 'Schedule Task' to start.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {tasks
                  .filter(t => !taskFilters.agentId || (t.agent && t.agent.id === taskFilters.agentId))
                  .filter(t => !taskFilters.status || t.status === taskFilters.status)
                  .filter(t => !taskFilters.priority || t.priority === taskFilters.priority)
                  .map(task => {
                    const isOverdue = task.status === 'PENDING' && new Date(task.dueDate) < new Date();
                    const initials = task.agent ? task.agent.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'RM';
                    
                    let taskIcon = "🗓️";
                    if (task.taskType === 'CALL') taskIcon = "📞";
                    else if (task.taskType === 'EMAIL') taskIcon = "✉️";
                    else if (task.taskType === 'SITE_VISIT') taskIcon = "🏡";
                    else if (task.taskType === 'MEETING') taskIcon = "🤝";

                    return (
                      <div key={task.id} className="stat-card" style={{ display: 'flex', flexDirection: 'column', padding: '20px', border: isOverdue ? '1px solid rgba(255, 77, 109, 0.4)' : '1px solid var(--border-muted)', background: isOverdue ? 'linear-gradient(to bottom right, rgba(255, 77, 109, 0.02), rgba(0, 0, 0, 0.4))' : 'rgba(7, 15, 30, 0.4)', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', minHeight: '260px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <span style={{ fontSize: '0.72rem', background: task.priority === 'HIGH' ? 'rgba(255, 77, 109, 0.12)' : task.priority === 'MEDIUM' ? 'rgba(212,175,55,0.12)' : 'rgba(46,196,182,0.12)', color: task.priority === 'HIGH' ? '#ff4d6d' : task.priority === 'MEDIUM' ? 'var(--gold-primary)' : '#2ec4b6', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                            {task.priority} Priority
                          </span>
                          <span style={{ fontSize: '0.8rem', color: task.status === 'COMPLETED' ? '#2ec4b6' : isOverdue ? '#ff4d6d' : 'var(--text-muted)', fontWeight: 'bold' }}>
                            {task.status === 'COMPLETED' ? '✓ Completed' : isOverdue ? '⚠️ Overdue' : '⏰ Pending'}
                          </span>
                        </div>

                        <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{taskIcon}</span>
                          <span>{task.title}</span>
                        </h4>

                        <p style={{ margin: '0 0 14px 0', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                          {task.description || 'No description provided.'}
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--border-muted)', paddingTop: '10px', marginTop: 'auto', fontSize: '0.78rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Lead Account:</span>
                            <strong style={{ color: 'var(--text-light)' }}>{task.lead ? task.lead.name : 'Unknown Lead'}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Assigned RM:</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--gold-primary)', color: 'var(--text-dark)', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{initials}</span>
                              <strong style={{ color: 'var(--text-light)' }}>{task.agent ? task.agent.name : 'Unknown Agent'}</strong>
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Follow-up Due:</span>
                            <strong style={{ color: isOverdue ? '#ff4d6d' : 'var(--text-light)' }}>
                              {new Date(task.dueDate).toLocaleString()}
                            </strong>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginTop: '15px', paddingTop: '10px', borderTop: '1px dashed var(--border-muted)' }}>
                          <button onClick={() => handleToggleTaskStatus(task.id, task.status)} className="btn-outline" style={{ flexGrow: 1, padding: '6px 12px', fontSize: '0.75rem', borderColor: task.status === 'COMPLETED' ? 'var(--border-muted)' : '#2ec4b6', color: task.status === 'COMPLETED' ? 'var(--text-muted)' : '#2ec4b6', background: 'none', cursor: 'pointer' }}>
                            {task.status === 'COMPLETED' ? 'Mark Pending' : 'Mark Completed'}
                          </button>
                          <button onClick={() => handleDeleteTask(task.id)} className="btn-outline" style={{ padding: '6px 10px', borderColor: 'rgba(255, 77, 109, 0.2)', color: '#ff4d6d', background: 'none', cursor: 'pointer' }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </section>
        )}

        {/* TAB 5: EMPLOYEES (HR) */}
        {activeTab === 'employees' && (
          <section className="module-content-transition">
            <EmployeesTab />
          </section>
        )}

        {/* TAB 6: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <section className="module-content-transition">
            <AttendanceTab />
          </section>
        )}

        {/* TAB 7: LEAVES */}
        {activeTab === 'leaves' && (
          <section className="module-content-transition">
            <LeavesTab />
          </section>
        )}

        {/* TAB 8: PAYROLL */}
        {activeTab === 'payroll' && (
          <section className="module-content-transition">
            <PayrollTab />
          </section>
        )}

        {/* TAB 9: SOCIETIES & DEVS */}
        {activeTab === 'societies' && (
          <section className="module-content-transition">
            <SocietiesTab />
          </section>
        )}

        {/* TAB 10: BLOGS */}
        {activeTab === 'blogs' && (
          <section className="module-content-transition">
            <BlogsTab />
          </section>
        )}
      </main>

      {/* Selected Lead Details Modal */}
      {selectedLead && (
        <LeadDetailsEx 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)} 
          agents={agents} 
          properties={properties} 
          fetchLeads={fetchLeads} 
          fetchStats={fetchStats}
        />
      )}
    </div>
  );
}
