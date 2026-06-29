import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { 
  Search, MapPin, Bed, Bath, Maximize, Phone, Mail, Loader, 
  CheckCircle, Tag, IndianRupee, Laptop, Sparkles, Activity, 
  LineChart, Car, Users, Award, ShieldCheck, 
  Sliders, Calculator, Eye, Compass, Star, Sun, Moon, Calendar, Clock, Lock, TrendingUp, Building, Key,
  Menu, X
} from 'lucide-react';
import './Portal.css';

export default function Portal({ onViewChange }) {
  // Theme State (light / dark / system)
  const [themeMode, setThemeMode] = useState(localStorage.getItem('crm-theme-mode') || 'dark');
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light-theme');
    
    if (themeMode === 'light') {
      root.classList.add('light-theme');
    } else if (themeMode === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (!systemPrefersDark) {
        root.classList.add('light-theme');
      }
    }
    localStorage.setItem('crm-theme-mode', themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (!isThemeMenuOpen) return;
    const closeMenu = () => setIsThemeMenuOpen(false);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [isThemeMenuOpen]);

  // HNWI Private Office Mandate Toggle
  const [isHnwiMode, setIsHnwiMode] = useState(false);

  // Properties state
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Dynamic filter state
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    transactionType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    furnishingStatus: '',
    status: 'AVAILABLE'
  });

  // Collections Category state (ALL | SKY_PENTHOUSE | TECH_OFFICE | READY_TO_MOVE | HINJEWADI_RENTALS)
  const [activeCollection, setActiveCollection] = useState('ALL');

  // Comparison State
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Slideshow State
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'
  ];

  // Scroll State
  const [scrolled, setScrolled] = useState(false);

  // Inquiry Modal State
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    requirementType: 'BUY',
    budgetMin: '',
    budgetMax: '',
    preferredLocation: '',
    notes: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Exclusive Inventory Active Tab State (BUY | SELL | RENT)
  const [exclusiveTab, setExclusiveTab] = useState('BUY');

  // Seller Mandate form state
  const [sellerForm, setSellerForm] = useState({
    name: '',
    phone: '',
    email: '',
    propertyTitle: '',
    location: 'HINJEWADI',
    expectedPrice: '',
    description: ''
  });

  // VIP Callback State
  const [vipForm, setVipForm] = useState({ name: '', phone: '' });
  const [vipSubmitting, setVipSubmitting] = useState(false);

  // Active Countdown Timer State for VIP callback
  const [countdown, setCountdown] = useState(0);
  
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  // Walkthrough Tour State
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [activeTourProperty, setActiveTourProperty] = useState(null);
  const [mediaConsoleTab, setMediaConsoleTab] = useState('3d'); // '3d' | 'video'

  // Closed Deals FOMO State
  const [closedProperties, setClosedProperties] = useState([]);
  const [closedLoading, setClosedLoading] = useState(true);

  // 3D Tour State
  const [is3DTourOpen, setIs3DTourOpen] = useState(false);
  const [active3DTourProperty, setActive3DTourProperty] = useState(null);

  // Fetch closed properties on mount
  useEffect(() => {
    const fetchClosedProperties = async () => {
      setClosedLoading(true);
      try {
        const soldData = await apiService.getProperties({ status: 'SOLD' }, 0, 4);
        const rentedData = await apiService.getProperties({ status: 'RENTED' }, 0, 4);
        setClosedProperties([...(soldData.content || []), ...(rentedData.content || [])]);
      } catch (err) {
        console.error("Failed to load closed properties:", err);
      } finally {
        setClosedLoading(false);
      }
    };
    fetchClosedProperties();
  }, []);

  // VIP Chauffeur Site Visit Scheduler State
  const [isChauffeurModalOpen, setIsChauffeurModalOpen] = useState(false);
  const [selectedChauffeurProp, setSelectedChauffeurProp] = useState(null);
  const [chauffeurForm, setChauffeurForm] = useState({
    name: '',
    phone: '',
    email: '',
    visitDate: '',
    timeSlot: 'MORNING',
    pickupAddress: '',
    includeExecutiveChauffeur: true
  });
  const [chauffeurSubmitting, setChauffeurSubmitting] = useState(false);

  // RERA Side Drawer State
  const [isReraDrawerOpen, setIsReraDrawerOpen] = useState(false);
  const [selectedReraProperty, setSelectedReraProperty] = useState(null);

  // Capital Appreciation projection state
  const [appreciationYears, setAppreciationYears] = useState(5);

  // Mortgage Calculator state
  const [mortgageDetails, setMortgageDetails] = useState({
    downPaymentPercent: 20,
    interestRate: 8.5,
    loanTermYears: 20,
    monthlyEMI: 0
  });

  // Slideshow useEffect
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Fetch properties on filters or page change
  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      let queryFilters = { ...filters };
      
      if (activeCollection === 'SKY_PENTHOUSE') {
        queryFilters.bedrooms = '4';
        queryFilters.propertyType = 'RESIDENTIAL';
      } else if (activeCollection === 'TECH_OFFICE') {
        queryFilters.propertyType = 'COMMERCIAL';
      } else if (activeCollection === 'READY_TO_MOVE') {
        queryFilters.propertyType = 'RESIDENTIAL';
        queryFilters.transactionType = 'BUY';
      } else if (activeCollection === 'HINJEWADI_RENTALS') {
        queryFilters.location = 'HINJEWADI';
        queryFilters.transactionType = 'RENT';
      }

      const data = await apiService.getProperties(queryFilters, page, 6);
      setProperties(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error(err);
      setError('Could not load properties. Please check if the Spring Boot server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [page, activeCollection, filters.transactionType]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Open general luxury presentation modal
  const handleOpenGeneralInquiry = () => {
    setSelectedProperty({
      title: 'General Luxury Advisory Presentation',
      price: 15000000,
      location: 'HINJEWADI'
    });
    setLeadForm({
      name: '',
      phone: '',
      email: '',
      requirementType: 'BUY',
      budgetMin: '10000000',
      budgetMax: '30000000',
      preferredLocation: 'HINJEWADI',
      notes: 'General enquiry submitted via Live Investment Desk floating badge.'
    });
    setIsModalOpen(true);
  };

  // Handle exclusive tabs switching (BUY | SELL | RENT)
  const handleExclusiveTabChange = (tab) => {
    setExclusiveTab(tab);
    setPage(0);
    if (tab === 'BUY' || tab === 'RENT') {
      setFilters(prev => ({
        ...prev,
        transactionType: tab
      }));
    }
  };

  // Handle seller mandate form input changes
  const handleSellerFormChange = (e) => {
    const { name, value } = e.target;
    setSellerForm(prev => ({ ...prev, [name]: value }));
  };

  // Submit seller mandate lead to backend H2/database CRM
  const handleSellerSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const notes = `[SELLER EXCLUSIVE REGISTRY] Asset: "${sellerForm.propertyTitle}", Corridor: ${sellerForm.location}, Expected Valuation: ₹${sellerForm.expectedPrice}. Owner description: ${sellerForm.description}`;
      await apiService.submitLead({
        name: sellerForm.name,
        phone: sellerForm.phone,
        email: sellerForm.email,
        requirementType: 'BUY',
        budgetMin: sellerForm.expectedPrice ? sellerForm.expectedPrice : '0',
        budgetMax: sellerForm.expectedPrice ? sellerForm.expectedPrice : '0',
        preferredLocation: sellerForm.location,
        notes: notes
      });
      showNotification('Success! Your asset has been listed on our Private Seller Desk. Our lead analyst will reach out.');
      setSellerForm({
        name: '',
        phone: '',
        email: '',
        propertyTitle: '',
        location: 'HINJEWADI',
        expectedPrice: '',
        description: ''
      });
    } catch (err) {
      alert(`Seller registration failed: ${err.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setPage(0);
    setActiveCollection('ALL');
    fetchProperties();
  };

  const handleResetFilters = () => {
    setFilters({
      location: '',
      propertyType: '',
      transactionType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      furnishingStatus: '',
      status: 'AVAILABLE'
    });
    setActiveCollection('ALL');
    setPage(0);
    setTimeout(() => fetchProperties(), 0);
  };

  const handleCorridorClick = (locationId) => {
    const updatedFilters = { ...filters, location: locationId };
    setFilters(updatedFilters);
    setPage(0);
    setActiveCollection('ALL');
    
    const element = document.getElementById('listings-anchor');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setLoading(true);
    apiService.getProperties(updatedFilters, 0, 6)
      .then(data => {
        setProperties(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Could not filter properties.');
        setLoading(false);
      });
  };

  // Open Lead Capture Modal for a specific property
  const handleOpenInquiry = (property) => {
    setSelectedProperty(property);
    setLeadForm({
      name: '',
      phone: '',
      email: '',
      requirementType: property.transactionType === 'RENT' ? 'RENT' : 'BUY',
      budgetMin: property.price ? (Number(property.price) * 0.9).toString() : '',
      budgetMax: property.price ? (Number(property.price) * 1.1).toString() : '',
      preferredLocation: property.location || '',
      notes: `Interested in property: "${property.title}" (ID: ${property.id})`
    });
    
    calculateEMI(property.price, mortgageDetails.downPaymentPercent, mortgageDetails.interestRate, mortgageDetails.loanTermYears);
    setIsModalOpen(true);
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await apiService.submitLead(leadForm);
      setIsModalOpen(false);
      showNotification('Inquiry submitted! Welcome message dispatched on WhatsApp.');
    } catch (err) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Chauffeur site visit scheduler submit handler
  const handleChauffeurSubmit = async (e) => {
    e.preventDefault();
    setChauffeurSubmitting(true);
    try {
      const notesMsg = `VIP SITE VISIT SCHEDULER: Scheduled viewing for "${selectedChauffeurProp.title}" (ID: ${selectedChauffeurProp.id}). Date: ${chauffeurForm.visitDate}, Time slot: ${chauffeurForm.timeSlot}. Executive pickup service: ${chauffeurForm.includeExecutiveChauffeur ? 'REQUIRED' : 'NOT REQUIRED'}. Pickup address: "${chauffeurForm.pickupAddress}"`;
      
      await apiService.submitLead({
        name: chauffeurForm.name,
        phone: chauffeurForm.phone,
        email: chauffeurForm.email,
        requirementType: 'BUY',
        budgetMin: selectedChauffeurProp.price ? selectedChauffeurProp.price.toString() : '10000000',
        budgetMax: selectedChauffeurProp.price ? (Number(selectedChauffeurProp.price) * 1.1).toString() : '20000000',
        preferredLocation: selectedChauffeurProp.location || '',
        notes: notesMsg
      });

      setIsChauffeurModalOpen(false);
      setChauffeurForm({
        name: '',
        phone: '',
        email: '',
        visitDate: '',
        timeSlot: 'MORNING',
        pickupAddress: '',
        includeExecutiveChauffeur: true
      });
      showNotification('VIP Site Visit Booked! Chauffeur confirmation sent on WhatsApp.');
    } catch (err) {
      alert(`Booking error: ${err.message}`);
    } finally {
      setChauffeurSubmitting(false);
    }
  };

  // VIP Callback Handler
  const handleVipSubmit = async (e) => {
    e.preventDefault();
    setVipSubmitting(true);
    try {
      const notesMsg = "VIP 60-Second Callback Request. Urgently contact customer for property guidance.";
      await apiService.submitLead({
        name: vipForm.name,
        phone: vipForm.phone,
        email: 'vip.callback@24krealtors.com',
        requirementType: 'BUY',
        budgetMin: '10000000',
        budgetMax: '30000000',
        preferredLocation: 'HINJEWADI',
        notes: notesMsg
      });
      setVipForm({ name: '', phone: '' });
      setCountdown(60);
      showNotification('VIP Callback logged! Connecting Location Advisor...');
    } catch (err) {
      alert(err.message);
    } finally {
      setVipSubmitting(false);
    }
  };

  // Property Comparison Handlers
  const handleToggleCompare = (property) => {
    setSelectedForCompare(prev => {
      const exists = prev.some(p => p.id === property.id);
      if (exists) {
        return prev.filter(p => p.id !== property.id);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 properties side-by-side.');
        return prev;
      }
      return [...prev, property];
    });
  };

  // Open Walkthrough Drone Video Player
  const handleOpenWalkthrough = (property) => {
    setActiveTourProperty(property);
    setIsTourOpen(true);
    setMediaConsoleTab('video');
  };

  // Open 3D Floor Tour Matterport Player
  const handleOpen3DTour = (property) => {
    setActiveTourProperty(property);
    setIsTourOpen(true);
    setMediaConsoleTab('3d');
  };

  // Open MahaRERA Compliance Drawer
  const handleOpenReraDrawer = (property, e) => {
    e.stopPropagation();
    setSelectedReraProperty(property);
    setIsReraDrawerOpen(true);
  };

  // EMI Calculator Function
  const calculateEMI = (price, downPercent, rate, years) => {
    const principal = Number(price) * (1 - downPercent / 100);
    const monthlyRate = (rate / 12) / 100;
    const months = years * 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    setMortgageDetails(prev => ({
      ...prev,
      downPaymentPercent: downPercent,
      interestRate: rate,
      loanTermYears: years,
      monthlyEMI: Math.round(emi)
    }));
  };

  const handleMortgageChange = (name, value) => {
    const updated = { ...mortgageDetails, [name]: Number(value) };
    calculateEMI(selectedProperty.price, updated.downPaymentPercent, updated.interestRate, updated.loanTermYears);
  };

  const showNotification = (message) => {
    // Elegant toast notification
    setNotification(message);
    setTimeout(() => setNotification(null), 5000);
  };

  // Formatter for Indian Rupee only
  const formatPrice = (price, transactionType = null) => {
    if (!price) return 'N/A';
    const num = Number(price);
    let formattedPrice = '';
    if (num >= 10000000) {
      formattedPrice = `₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      formattedPrice = `₹${(num / 100000).toFixed(2)} L`;
    } else {
      formattedPrice = `₹${num.toLocaleString('en-IN')}`;
    }
    
    if (transactionType === 'RENT') {
      return `${formattedPrice} / Month`;
    }
    return formattedPrice;
  };

  // Get Mock Landmarks based on Location
  const getLandmarks = (loc) => {
    switch (loc) {
      case 'BANER':
        return ['Balewadi High Street (5 mins)', 'Mumbai-Pune Highway (10 mins)', 'Medipoint Hospital (7 mins)'];
      case 'WAKAD':
        return ['Phoenix Marketcity (8 mins)', 'D.Y. Patil University (12 mins)', 'Sayaji Hotel (5 mins)'];
      case 'HINJEWADI':
        return ['Rajiv Gandhi IT Park Phase 1 (3 mins)', 'Quadron Business Park (10 mins)', 'Hinjewadi Metro Station (5 mins)'];
      case 'BALEWADI':
        return ['Sports Complex Stadium (4 mins)', 'Balewadi High Street (2 mins)', 'NICMAR (5 mins)'];
      case 'TATHAWADE':
        return ['Indira College Campus (6 mins)', 'D-Mart Tathawade (4 mins)', 'Bhujbal Chowk (8 mins)'];
      case 'MAHALUNGE':
        return ['Mahalunge-Nande Highway (3 mins)', 'Hinjobi Corridor Connector (10 mins)', 'Radisson Blu (12 mins)'];
      default:
        return ['IT Tech Parks (10 mins)', 'Multispeciality Hospital (5 mins)', 'Mumbai Highway (15 mins)'];
    }
  };

  // Get location ratings scorecard
  const getLocationScorecard = (loc) => {
    switch (loc) {
      case 'BANER':
        return { appreciation: '9.6', commute: '9.0', schools: '9.5', noise: '8.8', green: '9.0' };
      case 'WAKAD':
        return { appreciation: '8.8', commute: '8.6', schools: '9.2', noise: '7.8', green: '8.4' };
      case 'HINJEWADI':
        return { appreciation: '9.1', commute: '9.8', schools: '7.8', noise: '6.5', green: '8.0' };
      case 'BALEWADI':
        return { appreciation: '9.4', commute: '9.1', schools: '9.6', noise: '8.0', green: '8.5' };
      case 'TATHAWADE':
        return { appreciation: '8.6', commute: '8.2', schools: '9.0', noise: '8.2', green: '8.8' };
      case 'MAHALUNGE':
        return { appreciation: '9.8', commute: '8.8', schools: '8.5', noise: '9.0', green: '9.2' };
      default:
        return { appreciation: '9.0', commute: '9.0', schools: '9.0', noise: '8.0', green: '8.5' };
    }
  };

  const getAppreciationCAGR = (loc) => {
    switch (loc) {
      case 'BANER': return 12.0;
      case 'WAKAD': return 10.5;
      case 'HINJEWADI': return 9.8;
      case 'BALEWADI': return 11.0;
      case 'TATHAWADE': return 8.5;
      case 'MAHALUNGE': return 13.5;
      default: return 10.0;
    }
  };

  // Projected Value calculator
  const calculateAppreciatedValue = (price, loc, years) => {
    const cagr = getAppreciationCAGR(loc) / 100;
    return Math.round(Number(price) * Math.pow(1 + cagr, years));
  };

  const getEmbedVideoUrl = (url) => {
    if (!url) return "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&playlist=dQw4w9WgXcQ";
    if (url.includes("/embed/")) {
      return url.includes("?") ? `${url}&autoplay=1&mute=1` : `${url}?autoplay=1&mute=1`;
    }
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(ytRegex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}`;
    }
    return url;
  };

  return (
    <div className="portal-container" style={{ paddingTop: '80px' }}>
      {/* Toast Notification */}
      {notification && (
        <div className="notification premium-toast">
          <CheckCircle size={20} color="#D4AF37" />
          <span>{notification}</span>
        </div>
      )}

      {/* VIP Callback Active Countdown Timer Overlay */}
      {countdown > 0 && (
        <div className="callback-countdown-overlay">
          <div className="countdown-ring-box">
            <Clock size={20} className="spin-slow" />
            <span>Advisory Connection: <strong>{countdown}s</strong></span>
          </div>
          <p>Priority Line #1 - Region Location Advisor is dialing your number</p>
        </div>
      )}

      {/* Premium Luxury Navbar */}
      <nav className={`luxury-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="#" className="nav-logo">
            <span className="logo-number">24K REALTORS</span>
            <span className="logo-city-tagline">PUNE • PREMIUM ADVISORY</span>
          </a>

          {/* HNWI Portfolio Mode Selector Desk */}
          <div className="hnwi-mode-desk">
            <span className={!isHnwiMode ? 'active-label' : ''} onClick={() => setIsHnwiMode(false)}>Residential</span>
            <div className={`hnwi-pill-switch ${isHnwiMode ? 'active' : ''}`} onClick={() => setIsHnwiMode(!isHnwiMode)}>
              <div className="hnwi-pill-knob"></div>
            </div>
            <span className={isHnwiMode ? 'active-hnwi' : ''} onClick={() => setIsHnwiMode(true)}>Private Office (HNWI)</span>
          </div>
          
          <div className="nav-links">
            <a href="#philosophy">OVERVIEW</a>
            <a href="#corridors">WHY 24K</a>
            <a href="#listings-anchor">{isHnwiMode ? 'PORTFOLIOS' : 'PRICE LIST'}</a>
            <a href="#listings-anchor">FLOOR PLANS</a>
            <a href="#testimonials">CLIENTS</a>
            <button 
              onClick={() => onViewChange && onViewChange('dashboard')} 
              className="nav-dashboard-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
            >
              CRM
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Phone Number Pill Button */}
            <a href="tel:+919673000053" className="nav-pill-phone">
              <Phone size={13} />
              <span>+91 96730 00053</span>
            </a>
            
            {/* WhatsApp Pill Button */}
            <a href="https://wa.me/919673000053" target="_blank" rel="noopener noreferrer" className="nav-pill-whatsapp">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.233-1.371c1.394.756 2.96 1.157 4.777 1.158h.005c5.502 0 9.987-4.476 9.988-9.986C22 7.478 17.517 2 12.012 2zm5.787 14.404c-.24.675-1.397 1.285-1.92 1.36-.474.07-1.088.13-3.18-.737-2.677-1.11-4.4-3.837-4.536-4.015-.132-.178-1.08-1.433-1.08-2.73 0-1.298.68-1.936.92-2.199.243-.263.53-.328.706-.328.176 0 .353.003.507.01.162.007.382-.062.597.45.22.524.75 1.83.816 1.964.066.13.11.286.022.463-.087.177-.13.287-.26.439-.13.15-.27.337-.385.45-.126.126-.259.263-.11.517.15.253.66.1.91 1.488.75 1.309 1.37 2.14 2.15 2.65.783.51 1.237.585 1.58.204.34-.38 1.484-1.72 1.88-2.31.398-.59.794-.49 1.346-.29.553.2.3.5 1.764 1.226.22.11.365.163.475.328.11.165.11.954-.13 1.63z"/>
              </svg>
              <span>WhatsApp</span>
            </a>

            {/* Book Visit Pill Button */}
            <button 
              onClick={() => { setSelectedChauffeurProp(properties[0] || null); setIsChauffeurModalOpen(true); }} 
              className="nav-pill-book"
            >
              <Calendar size={13} />
              <span>BOOK VISIT</span>
            </button>

            {/* Circular Theme Dropdown Selector */}
            <div className="nav-theme-dropdown-container">
              <button 
                className="nav-theme-circle-btn" 
                onClick={(e) => { e.stopPropagation(); setIsThemeMenuOpen(!isThemeMenuOpen); }}
                title="Toggle Theme Mode"
              >
                {themeMode === 'light' && <Sun size={13} />}
                {themeMode === 'dark' && <Moon size={13} />}
                {themeMode === 'system' && <Laptop size={13} />}
              </button>
              
              {isThemeMenuOpen && (
                <div className="theme-dropdown-menu">
                  <button 
                    className={`theme-menu-item ${themeMode === 'light' ? 'active' : ''}`}
                    onClick={() => setThemeMode('light')}
                  >
                    <Sun size={12} />
                    <span>Light Theme</span>
                    {themeMode === 'light' && <span className="checkmark">✓</span>}
                  </button>
                  <button 
                    className={`theme-menu-item ${themeMode === 'dark' ? 'active' : ''}`}
                    onClick={() => setThemeMode('dark')}
                  >
                    <Moon size={12} />
                    <span>Dark Theme</span>
                    {themeMode === 'dark' && <span className="checkmark">✓</span>}
                  </button>
                  <button 
                    className={`theme-menu-item ${themeMode === 'system' ? 'active' : ''}`}
                    onClick={() => setThemeMode('system')}
                  >
                    <Laptop size={12} />
                    <span>System Preference</span>
                    {themeMode === 'system' && <span className="checkmark">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Toggle Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="mobile-menu-btn"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Side Drawer Overlay Menu */}
      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}></div>
      <div className={`mobile-nav-drawer ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-drawer-header">
          <span className="logo-number" style={{ fontSize: '1.25rem' }}>24K REALTORS</span>
          <button className="mobile-drawer-close" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={22} />
          </button>
        </div>
        
        {/* Private Office Mobile Switcher */}
        <div style={{ margin: '10px 0 20px 0', padding: '16px', border: '1px solid var(--border-gold)', borderRadius: '10px', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-light)' }}>Private Office (HNWI)</span>
            <div className={`hnwi-pill-switch ${isHnwiMode ? 'active' : ''}`} onClick={() => setIsHnwiMode(!isHnwiMode)}>
              <div className="hnwi-pill-knob"></div>
            </div>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.4 }}>
            Enable to view high-value signature portfolios and private advisory deals.
          </p>
        </div>

        <div className="mobile-drawer-links">
          <a href="#philosophy" onClick={() => setIsMobileMenuOpen(false)}>OVERVIEW</a>
          <a href="#corridors" onClick={() => setIsMobileMenuOpen(false)}>WHY 24K</a>
          <a href="#listings-anchor" onClick={() => setIsMobileMenuOpen(false)}>{isHnwiMode ? 'PORTFOLIOS' : 'PRICE LIST'}</a>
          <a href="#listings-anchor" onClick={() => setIsMobileMenuOpen(false)}>FLOOR PLANS</a>
          <a href="#testimonials" onClick={() => setIsMobileMenuOpen(false)}>CLIENTS</a>
          
          <button 
            onClick={() => { setIsMobileMenuOpen(false); onViewChange && onViewChange('dashboard'); }} 
            className="btn-gold"
            style={{ width: '100%', marginTop: '20px', justifyContent: 'center' }}
          >
            Open CRM Dashboard
          </button>
        </div>
      </div>

      {/* Animated Hero Slideshow Section */}
      <section className="portal-hero">
        {slides.map((url, idx) => (
          <div 
            key={url} 
            className={`hero-slide-bg ${idx === activeSlide ? 'active' : ''}`}
            style={{ backgroundImage: `radial-gradient(circle at center, rgba(21, 34, 56, 0.82) 0%, rgba(7, 15, 30, 0.98) 100%), url('${url}')` }}
          />
        ))}
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        <div className="hero-content">
          <span className="hero-gold-badge">Pune's Premium Location Advisory</span>
          <h1>
            {isHnwiMode 
              ? 'Institutional Mandates & Private Portfolios for Pune Tech Hubs'
              : 'At 24K Realtors, we help you choose the right location—not just the right flat.'}
          </h1>
          <p className="hero-subtext">
            {isHnwiMode
              ? 'Exclusive whole-building mandates, premium high-yield commercial assets, and pre-release developer allocations for HNWI partners.'
              : 'Discover handpicked, 100% verified properties across Hinjewadi, Wakad & Baner\'s high-appreciation corridors.'}
          </p>
          <div className="hero-divider"></div>
          <div className="hero-actions">
            <a href="#listings-anchor" className="btn-gold" style={{ textDecoration: 'none' }}>
              {isHnwiMode ? 'Explore Portfolios' : 'View Active Listings'}
            </a>
            <a href="#corridors" className="btn-outline" style={{ textDecoration: 'none' }}>
              Corridor Guide
            </a>
          </div>
        </div>
      </section>

      {/* MahaRERA Authorized Trust Banner */}
      <div className="maharera-trust-banner">
        <div className="maharera-content">
          <ShieldCheck size={32} className="trust-shield-icon" />
          <div>
            <h4>MahaRERA Registered Advisory Portal</h4>
            <p>Authorized Broker License Registration Number: <strong>A52100028461</strong>. 24K Realtors strictly complies with Maharashtra Real Estate Regulatory Authority guidelines. All pricing, layout structures, and inventories are verified directly with builder RERA registries.</p>
          </div>
        </div>
      </div>

      {/* Corporate Statistics Showcase */}
      <section className="stats-showcase">
        <div className="stats-grid">
          <div className="stat-item">
            <h4>₹800+ Cr</h4>
            <p>Curated Inventory</p>
          </div>
          <div className="stat-item">
            <h4>100%</h4>
            <p>Verified Availability</p>
          </div>
          <div className="stat-item">
            <h4>150+</h4>
            <p>Pune Families Guided</p>
          </div>
          <div className="stat-item">
            <h4>0%</h4>
            <p>Developer Brokerage</p>
          </div>
        </div>
      </section>

      {/* Authorized Developer Associations */}
      <div className="builder-partners-showcase">
        <span className="partners-label">Authorized Portfolio Advisors for Pune's Tier-1 Developers</span>
        <div className="partners-list">
          <span className="partner-name">VTP REALTY</span>
          <span className="partner-name">KOLTE-PATIL</span>
          <span className="partner-name">GODREJ PROPERTIES</span>
          <span className="partner-name">PANCHSHIL</span>
          <span className="partner-name">KASTURI</span>
        </div>
      </div>

      {/* Interactive Corridor Cards Grid with Live Metrics */}
      <section className="corridors-section" id="corridors">
        <div className="section-header">
          <h2 className="luxury-title">Pune Tech Corridor Live Market Trends</h2>
          <p className="section-subtitle">Select an area to explore live pricing and average appreciation index metrics</p>
        </div>
        
        <div className="corridors-grid">
          {corridorData.map((corridor) => (
            <div 
              key={corridor.id} 
              className={`corridor-card ${filters.location === corridor.id ? 'active' : ''}`}
              onClick={() => handleCorridorClick(corridor.id)}
            >
              <div className="corridor-card-glow"></div>
              <div className="corridor-icon-wrapper">{corridor.icon}</div>
              <div className="corridor-info">
                <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h3 style={{ margin: 0 }}>{corridor.name}</h3>
                  <span className="growth-indicator">{corridor.growth}</span>
                </div>
                <p style={{ marginBottom: '8px' }}>{corridor.tagline}</p>
                <div className="corridor-metrics">
                  <span>Avg. Price: <strong>{corridor.pricePerSqft}/sqft</strong></span>
                  <span>Yield: <strong>{corridor.yield}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="philosophy-section" id="philosophy">
        <div className="section-header">
          <h2 className="luxury-title">The Best Location Depends On</h2>
          <p className="section-subtitle">Our proprietary advice framework for premium real estate investment</p>
        </div>

        <div className="philosophy-grid">
          <div className="philosophy-card">
            <div className="ph-icon-wrapper">
              <IndianRupee size={24} />
            </div>
            <h3>Your Budget</h3>
            <p>From luxury 2 BHK apartments in Wakad to premium commercial properties in Hinjewadi to fit your goals.</p>
          </div>

          <div className="philosophy-card">
            <div className="ph-icon-wrapper">
              <Car size={24} />
            </div>
            <h3>Daily Commute</h3>
            <p>Strategic locations offering direct access to Hinjewadi IT parks, Baner offices, and highway routes.</p>
          </div>

          <div className="philosophy-card">
            <div className="ph-icon-wrapper">
              <Users size={24} />
            </div>
            <h3>Family Needs</h3>
            <p>Proximity to top-tier schools, premium high street retail, healthcare centers, and fitness centers.</p>
          </div>

          <div className="philosophy-card">
            <div className="ph-icon-wrapper">
              <LineChart size={24} />
            </div>
            <h3>Investment Goals</h3>
            <p>Appreciation-rich corridors delivering strong capital growth and consistent rental yields.</p>
          </div>
        </div>
      </section>

      {/* Main Listing & VIP Callback Container */}
      <div className="dual-listings-layout">
        {/* Left Side: Properties and Search Filters */}
        <div className="left-properties-container">
          
          {/* Dynamic Advanced Filtering */}
          <section className="filter-section" id="listings-anchor">
            <h2 className="filter-title">
              <Search size={18} />
              Refine Your Property Search
            </h2>
            <form onSubmit={handleApplyFilters} className="filter-grid">
              <div className="form-group">
                <label className="form-label">Location Corridor</label>
                <select name="location" value={filters.location} onChange={handleFilterChange} className="form-input">
                  <option value="">All Locations</option>
                  <option value="BANER">Baner Corridor</option>
                  <option value="WAKAD">Wakad Corridor</option>
                  <option value="HINJEWADI">Hinjewadi IT Corridor</option>
                  <option value="BALEWADI">Balewadi High Street</option>
                  <option value="TATHAWADE">Tathawade Corridor</option>
                  <option value="MAHALUNGE">Mahalunge Corridor</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Property Type</label>
                <select name="propertyType" value={filters.propertyType} onChange={handleFilterChange} className="form-input">
                  <option value="">All Types</option>
                  <option value="RESIDENTIAL">Residential</option>
                  <option value="COMMERCIAL">Commercial</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Transaction</label>
                <select name="transactionType" value={filters.transactionType} onChange={handleFilterChange} className="form-input">
                  <option value="">All Transactions</option>
                  <option value="BUY">Buy</option>
                  <option value="RENT">Rent</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Beds (BHK)</label>
                <select name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange} className="form-input">
                  <option value="">Any BHK</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4+ BHK</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Furnishing</label>
                <select name="furnishingStatus" value={filters.furnishingStatus} onChange={handleFilterChange} className="form-input">
                  <option value="">All Furnishings</option>
                  <option value="FULLY_FURNISHED">Fully Furnished</option>
                  <option value="SEMI_FURNISHED">Semi Furnished</option>
                  <option value="UNFURNISHED">Unfurnished</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Min Price (₹)</label>
                <input type="number" name="minPrice" placeholder="e.g. 5000000" value={filters.minPrice} onChange={handleFilterChange} className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Max Price (₹)</label>
                <input type="number" name="maxPrice" placeholder="e.g. 20000000" value={filters.maxPrice} onChange={handleFilterChange} className="form-input" />
              </div>

              <div className="form-group filter-actions">
                <button type="submit" className="btn-gold" style={{ flexGrow: 1 }}>Search</button>
                <button type="button" onClick={handleResetFilters} className="btn-outline">Reset</button>
              </div>
            </form>
          </section>

          {/* Curated Dubai/US Inspired Collections Tab Selector */}
          <div className="curated-collections-tabs">
            <button onClick={() => setActiveCollection('ALL')} className={activeCollection === 'ALL' ? 'active' : ''}>
              All Signature Deals
            </button>
            <button onClick={() => setActiveCollection('SKY_PENTHOUSE')} className={activeCollection === 'SKY_PENTHOUSE' ? 'active' : ''}>
              👑 Sky Penthouses (4+ BHK)
            </button>
            <button onClick={() => setActiveCollection('TECH_OFFICE')} className={activeCollection === 'TECH_OFFICE' ? 'active' : ''}>
              🏢 IT Corporates (Commercial)
            </button>
            <button onClick={() => setActiveCollection('READY_TO_MOVE')} className={activeCollection === 'READY_TO_MOVE' ? 'active' : ''}>
              🔑 Premium Ready-to-Move
            </button>
            <button onClick={() => setActiveCollection('HINJEWADI_RENTALS')} className={activeCollection === 'HINJEWADI_RENTALS' ? 'active' : ''}>
              🏡 Hinjewadi Rentals
            </button>
          </div>

          {/* Exclusive Inventory Sub-Tab Row */}
          <div className="exclusive-tabs-wrapper">
            <div className="exclusive-tabs-container">
              <button 
                onClick={() => handleExclusiveTabChange('BUY')} 
                className={`exclusive-tab-btn ${exclusiveTab === 'BUY' ? 'active' : ''}`}
              >
                💎 BUY Asset
              </button>
              <button 
                onClick={() => handleExclusiveTabChange('SELL')} 
                className={`exclusive-tab-btn ${exclusiveTab === 'SELL' ? 'active' : ''}`}
              >
                📈 SELL Asset
              </button>
              <button 
                onClick={() => handleExclusiveTabChange('RENT')} 
                className={`exclusive-tab-btn ${exclusiveTab === 'RENT' ? 'active' : ''}`}
              >
                🏡 RENT Asset
              </button>
            </div>
          </div>

          {exclusiveTab === 'SELL' ? (
            <div className="seller-mandate-desk">
              <div className="seller-info-side">
                <h2 className="listings-section-title" style={{ textAlign: 'left', margin: '0 0 10px 0' }}>Private Mandate Selling Desk</h2>
                <p className="seller-section-subtitle">List your premium Pune asset with 24K Realtors for exclusive institutional & HNWI buyer outreach.</p>
                
                <div className="seller-benefit-item">
                  <div className="seller-benefit-icon">
                    <Eye size={20} />
                  </div>
                  <div className="seller-benefit-text">
                    <h4>4K Cinematic Drone & VR Tours</h4>
                    <p>We create complimentary high-end virtual property assets including Matterport floor plans and aerial footage to captivate remote buyers.</p>
                  </div>
                </div>

                <div className="seller-benefit-item">
                  <div className="seller-benefit-icon">
                    <Sparkles size={20} />
                  </div>
                  <div className="seller-benefit-text">
                    <h4>Targeted HNWI Outreach Campaigns</h4>
                    <p>Direct advertising to high-income IT corridor executives and local investment groups looking for high-yield Corridor properties.</p>
                  </div>
                </div>

                <div className="seller-benefit-item">
                  <div className="seller-benefit-icon">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="seller-benefit-text">
                    <h4>Compliance & Title Clearance Dossier</h4>
                    <p>Our PMRDA/MahaRERA advisory team drafts clean-title audit dossiers to expedite institutional legal verification.</p>
                  </div>
                </div>
              </div>

              <div className="seller-form-side">
                <h3 className="seller-form-title">Register Listing Mandate</h3>
                <form onSubmit={handleSellerSubmit}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      className="form-input" 
                      required 
                      placeholder="e.g. Amit Deshmukh" 
                      value={sellerForm.name} 
                      onChange={handleSellerFormChange} 
                    />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        className="form-input" 
                        required 
                        placeholder="e.g. +91 98765 43210" 
                        value={sellerForm.phone} 
                        onChange={handleSellerFormChange} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        name="email" 
                        className="form-input" 
                        required 
                        placeholder="e.g. amit@gmail.com" 
                        value={sellerForm.email} 
                        onChange={handleSellerFormChange} 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="form-group">
                      <label className="form-label">Asset Title</label>
                      <input 
                        type="text" 
                        name="propertyTitle" 
                        className="form-input" 
                        required 
                        placeholder="e.g. 3 BHK Wakad Flat" 
                        value={sellerForm.propertyTitle} 
                        onChange={handleSellerFormChange} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Corridor Location</label>
                      <select 
                        name="location" 
                        className="form-input" 
                        value={sellerForm.location} 
                        onChange={handleSellerFormChange}
                      >
                        <option value="HINJEWADI">Hinjewadi</option>
                        <option value="BANER">Baner</option>
                        <option value="WAKAD">Wakad</option>
                        <option value="BALEWADI">Balewadi</option>
                        <option value="TATHAWADE">Tathawade</option>
                        <option value="MAHALUNGE">Mahalunge</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Expected Valuation (₹)</label>
                    <input 
                      type="number" 
                      name="expectedPrice" 
                      className="form-input" 
                      required 
                      placeholder="e.g. 9500000" 
                      value={sellerForm.expectedPrice} 
                      onChange={handleSellerFormChange} 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Asset Specifications / Key Features</label>
                    <textarea 
                      name="description" 
                      className="form-input" 
                      rows="3" 
                      placeholder="e.g. Semi-furnished 3BHK, modular kitchen, 12th floor, overlooking park..."
                      value={sellerForm.description} 
                      onChange={handleSellerFormChange} 
                    />
                  </div>

                  <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }} disabled={submitLoading}>
                    {submitLoading ? 'Registering Mandate...' : 'Submit Sale Listing Mandate'}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <>
              {/* Properties Display Header */}
              <div className="properties-header">
                <h2 className="listings-section-title">{isHnwiMode ? 'HNWI Mandated Assets' : 'Exclusive Inventory'}</h2>
                <span className="properties-count">{totalElements} Premium listings found</span>
              </div>

              {loading ? (
                <div className="premium-loader-box">
                  <PremiumGoldLoader />
                </div>
              ) : error ? (
                <div className="empty-state" style={{ borderColor: '#D90429', color: '#FF4D6D' }}>
                  <p>{error}</p>
                </div>
              ) : properties.length === 0 ? (
                <div className="empty-state">
                  <p>No premium properties match your criteria at this moment. Adjust your filters or click a corridor card.</p>
                </div>
              ) : (
                <>
                  <div className="properties-grid">
                    {properties.map(property => {
                      const isCompared = selectedForCompare.some(p => p.id === property.id);
                      const scores = getLocationScorecard(property.location);
                      const defaultImg = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';
                      
                      // Predefined custom WhatsApp message for card click
                      const waLink = `https://wa.me/919673000053?text=Hi%2024K%20Realtors,%20I%20am%20interested%20in%20"${property.title}"%20located%20at%20${property.address}%20for%20₹${property.price}`;
                      
                      return (
                        <div key={property.id} className="property-card premium-luxury-card">
                          <div className="property-image-container premium-hover-tint" style={{ position: 'relative', overflow: 'hidden' }}>
                            <img 
                              src={property.imageUrl || defaultImg} 
                              alt={property.title} 
                              loading="lazy" 
                              style={{ 
                                position: 'absolute', 
                                top: 0, 
                                left: 0, 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover', 
                                zIndex: 0
                              }}
                            />
                            <div style={{
                              position: 'absolute',
                              top: 0, left: 0, right: 0, bottom: 0,
                              background: 'linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(7,15,30,0.9) 100%)',
                              zIndex: 1
                            }}></div>
                            <span className="property-tag">{property.transactionType}</span>
                            <div className="property-badge-container">
                              {property.verifiedListing && <span className="p-badge p-badge-verified">✓ Verified</span>}
                              {property.exclusiveDeal && <span className="p-badge p-badge-exclusive">★ Exclusive</span>}
                              {property.noBrokerage && <span className="p-badge p-badge-nobroker">No Brokerage</span>}
                            </div>
                            
                            <button 
                              onClick={() => handleToggleCompare(property)}
                              className={`btn-compare-badge ${isCompared ? 'compared' : ''}`}
                              title={isCompared ? 'Remove from comparison' : 'Compare property'}
                            >
                              <Sliders size={14} />
                              <span>{isCompared ? 'Compared' : 'Compare'}</span>
                            </button>

                            <span className="property-price-tag">
                              {isHnwiMode 
                                ? `Gross Yield: ${property.propertyType === 'COMMERCIAL' ? '7.2%' : '4.4%'} | ${formatPrice(property.price, property.transactionType)}` 
                                : formatPrice(property.price, property.transactionType)}
                            </span>
                          </div>
                          
                          <div className="property-info">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <span className="property-location">
                                <MapPin size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                {property.location}
                              </span>
                              
                              {/* MahaRERA Interactive compliance badge */}
                              <button 
                                className="rera-interactive-btn"
                                onClick={(e) => handleOpenReraDrawer(property, e)}
                                title="Open compliance dossier"
                              >
                                <ShieldCheck size={12} color="#D4AF37" style={{ marginRight: '4px' }} />
                                <span>{property.reraNumber || 'PRM/VERIFIED'}</span>
                              </button>
                            </div>

                            <h3 className="property-title">{property.title}</h3>
                            
                            {/* Advisory Digital Signature Stamp */}
                            <div className="signature-compliance-stamp">
                              <Lock size={12} color="#D4AF37" />
                              <span>Certified Title-Clear Portfolio (Regional Lead Advisory)</span>
                            </div>

                            <p className="property-desc">{property.description || 'Premium architectural layout featuring cross ventilation, modern structural design.'}</p>
                            
                            {/* Location Scorecard index */}
                            <div className="location-scorecard">
                              <div className="score-item">
                                <span>Appreciation</span>
                                <strong>{scores.appreciation}/10</strong>
                              </div>
                              <div className="score-item">
                                <span>Commute</span>
                                <strong>{scores.commute}/10</strong>
                              </div>
                              <div className="score-item">
                                <span>Green Index</span>
                                <strong>{scores.green}/10</strong>
                              </div>
                            </div>

                            <div className="landmarks-snippets">
                              <span className="landmark-tag-mini">{getLandmarks(property.location)[0]}</span>
                              <span className="landmark-tag-mini">{getLandmarks(property.location)[1]}</span>
                            </div>

                            <div className="property-specs">
                              <div className="spec-item">
                                <Bed size={16} color="#C5A880" />
                                <span className="spec-value">{property.bedrooms > 0 ? `${property.bedrooms} BHK` : 'N/A'}</span>
                              </div>
                              <div className="spec-item">
                                <Bath size={16} color="#C5A880" />
                                <span className="spec-value">{property.bathrooms} Baths</span>
                              </div>
                              <div className="spec-item">
                                <Maximize size={16} color="#C5A880" />
                                <span className="spec-value">{property.areaSquareFeet} sqft</span>
                              </div>
                            </div>

                            {/* Signature Luxury Amenities tags */}
                            <div className="luxury-amenities-mini-grid">
                              <span className="amenity-badge" style={{ borderColor: 'rgba(212,175,55,0.4)', color: 'var(--gold-primary)', fontWeight: 600 }}>
                                <Sparkles size={10} /> {property.furnishingStatus ? property.furnishingStatus.replace('_', ' ') : 'FULLY FURNISHED'}
                              </span>
                              {property.gasPipeline && (
                                <span className="amenity-badge" style={{ borderColor: '#2ec4b6', color: '#2ec4b6' }}>
                                  🔥 Piped Gas
                                </span>
                              )}
                              <span className="amenity-badge"><Sparkles size={10} /> Infinity Pool</span>
                              <span className="amenity-badge"><Users size={10} /> 24/7 Concierge</span>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                              <button 
                                onClick={() => handleOpenWalkthrough(property)}
                                className="btn-outline"
                                title="Drone Virtual Tour"
                                style={{ padding: '10px 12px' }}
                              >
                                <Eye size={14} />
                              </button>

                              <button 
                                onClick={() => handleOpen3DTour(property)}
                                className="btn-outline"
                                title="3D Floor View"
                                style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <Compass size={14} />
                                <span style={{ fontSize: '0.78rem' }}>3D Tour</span>
                              </button>
                              
                              {/* VIP Private Site Chauffeur Scheduler CTA */}
                              <button 
                                onClick={() => { setSelectedChauffeurProp(property); setIsChauffeurModalOpen(true); }}
                                className="btn-outline"
                                style={{ flex: '1 1 auto', padding: '10px 8px', justifyContent: 'center', borderColor: 'var(--gold-secondary)', color: 'var(--gold-secondary)', fontSize: '0.78rem' }}
                              >
                                <Car size={14} style={{ marginRight: '4px' }} />
                                <span>VIP Chauffeur</span>
                              </button>

                              {/* WhatsApp Mini Click-to-consult */}
                              <a 
                                href={waLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn-whatsapp-mini"
                                title="Quick WhatsApp Consultation"
                              >
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.233-1.371c1.394.756 2.96 1.157 4.777 1.158h.005c5.502 0 9.987-4.476 9.988-9.986C22 7.478 17.517 2 12.012 2zm5.787 14.404c-.24.675-1.397 1.285-1.92 1.36-.474.07-1.088.13-3.18-.737-2.677-1.11-4.4-3.837-4.536-4.015-.132-.178-1.08-1.433-1.08-2.73 0-1.298.68-1.936.92-2.199.243-.263.53-.328.706-.328.176 0 .353.003.507.01.162.007.382-.062.597.45.22.524.75 1.83.816 1.964.066.13.11.286.022.463-.087.177-.13.287-.26.439-.13.15-.27.337-.385.45-.126.126-.259.263-.11.517.15.253.66.1.91 1.488.75 1.309 1.37 2.14 2.15 2.65.783.51 1.237.585 1.58.204.34-.38 1.484-1.72 1.88-2.31.398-.59.794-.49 1.346-.29.553.2.3.5 1.764 1.226.22.11.365.163.475.328.11.165.11.954-.13 1.63z"/>
                                </svg>
                              </a>

                              <button 
                                onClick={() => handleOpenInquiry(property)} 
                                className="btn-gold" 
                                style={{ flex: '1 1 auto', padding: '10px 8px', justifyContent: 'center', fontSize: '0.78rem' }}
                              >
                                Private Presentation
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination">
                      <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="pagination-btn">Previous</button>
                      <span className="pagination-info">Page {page + 1} of {totalPages}</span>
                      <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className="pagination-btn">Next</button>
                    </div>
                  )}

                  {/* Recently Closed Deals FOMO Section */}
                  {closedProperties.length > 0 && (
                    <div className="closed-deals-fomo-section" style={{ marginTop: '50px', borderTop: '1px solid var(--border-gold)', paddingTop: '40px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '24px' }}>
                        <TrendingUpIcon size={24} style={{ color: '#d90429' }} />
                        <div>
                          <h2 className="luxury-title" style={{ fontSize: '1.6rem', color: 'var(--text-light)', margin: 0 }}>⚜️ Recently Closed Deals (Wakad & Hinjewadi)</h2>
                          <p style={{ fontSize: '0.85rem', color: '#ff4d6d', margin: '4px 0 0 0', fontWeight: 600 }}>Opportunity Missed! These premium flats have already been transacted.</p>
                        </div>
                      </div>

                      <div className="properties-grid" style={{ opacity: 0.85 }}>
                        {closedProperties.map(property => {
                          const scores = getLocationScorecard(property.location);
                          const isSold = property.status === 'SOLD';
                          return (
                            <div key={property.id} className="property-card premium-luxury-card closed-deal-card" style={{ filter: 'grayscale(70%)', border: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative' }}>
                              
                              {/* Missed Chance FOMO Ribbon */}
                              <div style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                zIndex: 10,
                                background: '#d90429',
                                color: '#ffffff',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                fontWeight: 'bold',
                                boxShadow: '0 2px 10px rgba(217, 4, 41, 0.4)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}>
                                {isSold ? '❌ SOLD OUT' : '🔑 RENTED OUT'}
                              </div>

                              <div className="property-image-container" style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                                <img 
                                   src={property.imageUrl || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'} 
                                   alt={property.title} 
                                   loading="lazy" 
                                   style={{ 
                                     position: 'absolute', 
                                     top: 0, 
                                     left: 0, 
                                     width: '100%', 
                                     height: '100%', 
                                     objectFit: 'cover', 
                                     zIndex: 0
                                   }}
                                 />
                                 <div style={{
                                   position: 'absolute',
                                   top: 0, left: 0, right: 0, bottom: 0,
                                   background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(7,15,30,0.9) 100%)',
                                   zIndex: 1
                                 }}></div>
                                <span className="property-price-tag" style={{ background: 'rgba(0, 0, 0, 0.7)', textDecoration: 'line-through' }}>
                                  {formatPrice(property.price, property.transactionType)}
                                </span>
                              </div>

                              <div className="property-info" style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                  <span className="property-location" style={{ fontSize: '0.78rem' }}>
                                    <MapPin size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                    {property.location}
                                  </span>
                                  <span style={{ fontSize: '0.7rem', color: '#ff4d6d', fontWeight: 'bold' }}>
                                    Chance Missed
                                  </span>
                                </div>

                                <h3 className="property-title" style={{ fontSize: '1.1rem', margin: '4px 0 8px 0', textDecoration: 'line-through', opacity: 0.7 }}>{property.title}</h3>
                                
                                {/* Urgent FOMO Alert message */}
                                <div style={{ background: 'rgba(217, 4, 41, 0.08)', border: '1px solid rgba(217, 4, 41, 0.2)', borderRadius: '4px', padding: '8px 10px', fontSize: '0.76rem', color: '#ff4d6d', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <Clock size={12} className="spin-slow" />
                                  <span>Closed recently! <strong>14 leads missed this opportunity</strong>.</span>
                                </div>

                                <p className="property-desc" style={{ fontSize: '0.78rem', height: '36px', overflow: 'hidden', marginBottom: '12px', opacity: 0.6 }}>
                                  {property.description}
                                </p>

                                <div className="property-specs" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', margin: '10px 0 0 0' }}>
                                  <span style={{ fontSize: '0.75rem' }}>{property.bedrooms} BHK • {property.areaSquareFeet} sqft</span>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{property.furnishingStatus ? property.furnishingStatus.replace('_', ' ') : 'FULLY FURNISHED'}</span>
                                </div>

                                <button 
                                  onClick={() => {
                                    setLeadForm(prev => ({
                                      ...prev,
                                      notes: `Missed out on: "${property.title}" (ID: ${property.id}). Please notify me if a similar flat in ${property.location} becomes available!`
                                    }));
                                    setSelectedProperty(property);
                                    setIsModalOpen(true);
                                  }}
                                  className="btn-gold" 
                                  style={{ width: '100%', padding: '8px 0', justifyContent: 'center', marginTop: '12px', background: 'none', border: '1px solid var(--gold-primary)', color: 'var(--gold-primary)', fontSize: '0.8rem' }}
                                >
                                  Get Similar Alerts
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {/* Right Side: VIP Advisory Callback Panel */}
        <div className="right-vip-panel">
          <div className="luxury-card vip-sticky-card" style={{ border: '1px solid var(--border-gold)' }}>
            <div style={{ color: 'var(--gold-primary)', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
              <Compass size={24} className="animate-spin" style={{ animationDuration: '6s' }} />
              <h3 className="luxury-title" style={{ fontSize: '1.25rem', margin: 0 }}>VIP Advisory</h3>
            </div>
            <h4 style={{ color: 'var(--text-light)', marginBottom: '8px', fontSize: '1.05rem' }}>Callback in 60 Seconds</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.4 }}>
              Enter your details to initiate an instant secure priority callback from our corridor relationship manager.
            </p>

            <form onSubmit={handleVipSubmit}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Full Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Karan Johar" 
                  className="form-input" 
                  style={{ padding: '10px 12px', fontSize: '0.9rem' }}
                  value={vipForm.name}
                  onChange={e => setVipForm({ ...vipForm, name: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>WhatsApp Mobile</label>
                <input 
                  type="tel" 
                  required 
                  placeholder="e.g. +919876543210" 
                  className="form-input"
                  style={{ padding: '10px 12px', fontSize: '0.9rem' }}
                  value={vipForm.phone}
                  onChange={e => setVipForm({ ...vipForm, phone: e.target.value })}
                />
              </div>
              <button 
                type="submit" 
                className="btn-gold" 
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.88rem', padding: '10px 0' }}
                disabled={vipSubmitting}
              >
                {vipSubmitting ? <Loader className="animate-spin" size={16} /> : 'Request VIP Callback'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Private Boardroom Suites Location Details */}
      <section className="boardrooms-section">
        <div className="section-header">
          <h2 className="luxury-title">Private Consulting Boardrooms</h2>
          <p className="section-subtitle">Strictly by appointment only — confidential portfolio advisory sessions</p>
        </div>
        <div className="boardrooms-grid">
          <div className="boardroom-card">
            <Building size={20} color="#D4AF37" />
            <div>
              <h4>Baner Advisory Suite</h4>
              <p>Level 8, Balewadi High Street Corporate Chambers, Baner, Pune</p>
            </div>
          </div>
          <div className="boardroom-card">
            <Building size={20} color="#D4AF37" />
            <div>
              <h4>Wakad Advisory Suite</h4>
              <p>Level 5, Prime IT Business Park, Datta Mandir Road, Wakad, Pune</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Success Stories */}
      <section className="testimonials-section" id="testimonials">
        <div className="section-header">
          <h2 className="luxury-title">Trusted By 150+ Pune Families</h2>
          <p className="section-subtitle">Real feedback from clients guided to the right location in Baner, Hinjewadi & Wakad</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars-row">
              <Star size={16} fill="#D4AF37" color="#D4AF37" />
              <Star size={16} fill="#D4AF37" color="#D4AF37" />
              <Star size={16} fill="#D4AF37" color="#D4AF37" />
              <Star size={16} fill="#D4AF37" color="#D4AF37" />
              <Star size={16} fill="#D4AF37" color="#D4AF37" />
            </div>
            <p className="testimonial-text">"24K Realtors changed our approach completely. Instead of pushing properties, they analyzed our commute times to Hinjewadi Phase 1 IT park and top school distances. The RERA compliance is crystal clear."</p>
            <div className="testimonial-author">
              <strong>Amit & Priyanjali Sharma</strong>
              <span>VP Engineering at Tech Mahindra & Teacher at Vibgyor</span>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars-row">
              <Star size={16} fill="#D4AF37" color="#D4AF37" />
              <Star size={16} fill="#D4AF37" color="#D4AF37" />
              <Star size={16} fill="#D4AF37" color="#D4AF37" />
              <Star size={16} fill="#D4AF37" color="#D4AF37" />
              <Star size={16} fill="#D4AF37" color="#D4AF37" />
            </div>
            <p className="testimonial-text">"Buying in Wakad was seamless. We saved developer brokerage, received fully verified property layouts, and got assistance with mortgage rates directly on the site. Genuine real estate advisors."</p>
            <div className="testimonial-author">
              <strong>Dr. Sandeep Deshmukh</strong>
              <span>Chief Cardiologist, Ruby Hall Clinic Pune</span>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="stars-row">
              <Star size={16} fill="#D4AF37" color="#D4AF37" />
              <Star size={16} fill="#D4AF37" color="#D4AF37" />
              <Star size={16} fill="#D4AF37" color="#D4AF37" />
              <Star size={16} fill="#D4AF37" color="#D4AF37" />
              <Star size={16} fill="#D4AF37" color="#D4AF37" />
            </div>
            <p className="testimonial-text">"Acquired a commercial retail space on Balewadi High Street. Direct developer pricing, legal due diligence support, and complete transparency on local rental yields. Unbeatable advisory desk."</p>
            <div className="testimonial-author">
              <strong>Vikram Malhotra</strong>
              <span>Managing Director, VM Tech-Ventures</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Bottom Banner */}
      <section className="trust-badges-section">
        <div className="trust-badges-grid">
          <div className="trust-badge">
            <ShieldCheck size={22} className="badge-icon" />
            <span>MahaRERA Registered</span>
          </div>
          <div className="trust-badge">
            <Users size={22} className="badge-icon" />
            <span>Transparent Deals Only</span>
          </div>
          <div className="trust-badge">
            <Award size={22} className="badge-icon" />
            <span>0% Brokerage Deals</span>
          </div>
          <div className="trust-badge">
            <Sparkles size={22} className="badge-icon" />
            <span>Location Advisory first</span>
          </div>
        </div>
      </section>

      {/* Floating Pulse Investment Desk Badge */}
      <button 
        onClick={handleOpenGeneralInquiry} 
        className="floating-desk-badge"
        title="Open Live Advisory Desk Presentation"
      >
        <span className="pulse-dot"></span>
        <span>Live Desk</span>
      </button>

      {/* Sticky Floating WhatsApp */}
      <a 
        href="https://wa.me/919673000053?text=I%20am%20interested%20in%20real%20estate%20consultation%20with%2024K%20Realtors"
        className="floating-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        title="WhatsApp Consultation Desk"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.233-1.371c1.394.756 2.96 1.157 4.777 1.158h.005c5.502 0 9.987-4.476 9.988-9.986C22 7.478 17.517 2 12.012 2zm5.787 14.404c-.24.675-1.397 1.285-1.92 1.36-.474.07-1.088.13-3.18-.737-2.677-1.11-4.4-3.837-4.536-4.015-.132-.178-1.08-1.433-1.08-2.73 0-1.298.68-1.936.92-2.199.243-.263.53-.328.706-.328.176 0 .353.003.507.01.162.007.382-.062.597.45.22.524.75 1.83.816 1.964.066.13.11.286.022.463-.087.177-.13.287-.26.439-.13.15-.27.337-.385.45-.126.126-.259.263-.11.517.15.253.66.1.91 1.488.75 1.309 1.37 2.14 2.15 2.65.783.51 1.237.585 1.58.204.34-.38 1.484-1.72 1.88-2.31.398-.59.794-.49 1.346-.29.553.2.3.5 1.764 1.226.22.11.365.163.475.328.11.165.11.954-.13 1.63z"/>
        </svg>
      </a>

      {/* Comparison Modal Overlay */}
      {isCompareOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '850px' }}>
            <button className="modal-close" onClick={() => setIsCompareOpen(false)}>×</button>
            <h3 className="modal-title">Property Comparison</h3>
            <p className="modal-subtitle">Side-by-side comparison of selected luxury Pune tech corridor deals.</p>
            
            <div className="compare-grid">
              {selectedForCompare.map(p => (
                <div key={p.id} className="compare-column">
                  <div className="compare-img" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80')` }} />
                  <h4 style={{ color: 'var(--gold-primary)', margin: '12px 0 6px 0', fontSize: '1.1rem' }}>{p.title}</h4>
                  <div className="compare-field"><strong>Location:</strong> {p.location}</div>
                  <div className="compare-field"><strong>Price:</strong> {formatPrice(p.price, p.transactionType)}</div>
                  <div className="compare-field"><strong>Size:</strong> {p.areaSquareFeet} sqft</div>
                  <div className="compare-field"><strong>Rooms:</strong> {p.bedrooms > 0 ? `${p.bedrooms} BHK` : 'N/A'}</div>
                  <div className="compare-field"><strong>Baths:</strong> {p.bathrooms}</div>
                  <div className="compare-field"><strong>RERA ID:</strong> {p.reraNumber || 'Pending'}</div>
                  <button onClick={() => { setIsCompareOpen(false); handleOpenInquiry(p); }} className="btn-gold" style={{ marginTop: '15px', width: '100%', justifyContent: 'center' }}>
                    Request Presentation
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Comparison Drawer Sticky Bar */}
      {selectedForCompare.length > 0 && (
        <div className="comparison-drawer-bar">
          <div className="drawer-bar-content">
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
              📊 Property Comparison: {selectedForCompare.length} of 3 selected
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setSelectedForCompare([])} className="btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Clear
              </button>
              <button 
                onClick={() => setIsCompareOpen(true)} 
                className="btn-gold" 
                style={{ padding: '8px 20px', fontSize: '0.85rem' }}
                disabled={selectedForCompare.length < 2}
              >
                Compare Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unified Media Console (3D & Drone Tour) */}
      {isTourOpen && activeTourProperty && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '850px', background: '#080f1e', padding: '24px', border: '1px solid var(--gold-primary)', borderRadius: '12px' }}>
            <button className="modal-close" onClick={() => setIsTourOpen(false)}>×</button>
            
            <h3 className="modal-title" style={{ color: 'var(--gold-primary)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Compass size={22} className={mediaConsoleTab === '3d' ? "animate-spin" : ""} style={{ animationDuration: '8s' }} />
              <span>{activeTourProperty.title} — Immersive Media Console</span>
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
              RERA No: {activeTourProperty.reraNumber} | Location: {activeTourProperty.location} Corridor
            </p>

            {/* Media Tabs Selection */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-muted)', paddingBottom: '10px' }}>
              <button 
                onClick={() => setMediaConsoleTab('3d')}
                className={`exclusive-tab-btn ${mediaConsoleTab === '3d' ? 'active' : ''}`}
                style={{ padding: '8px 16px', fontSize: '0.85rem', flexGrow: 1, justifyContent: 'center' }}
              >
                📐 Interactive 3D Floor View
              </button>
              <button 
                onClick={() => setMediaConsoleTab('video')}
                className={`exclusive-tab-btn ${mediaConsoleTab === 'video' ? 'active' : ''}`}
                style={{ padding: '8px 16px', fontSize: '0.85rem', flexGrow: 1, justifyContent: 'center' }}
              >
                📹 Cinematic Drone Tour
              </button>
            </div>

            {/* Console Screen Panel */}
            <div className="video-player-container" style={{ border: '1px solid var(--border-gold)', borderRadius: '8px', overflow: 'hidden', height: '480px', background: '#020617' }}>
              {mediaConsoleTab === '3d' ? (
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={activeTourProperty.threeDTourUrl || "https://my.matterport.com/show/?m=JGPmBB6q58g"} 
                  frameBorder="0"
                  allowFullScreen
                  allow="xr-spatial-tracking"
                  title="3D Tour Frame"
                />
              ) : (
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={getEmbedVideoUrl(activeTourProperty.videoUrl)} 
                  title="Cinematic Tour Frame"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                />
              )}
            </div>

            {/* Console footer controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                {mediaConsoleTab === '3d' ? 'Powered by Matterport 3D Scanning Desk' : 'Powered by 24K Cinematic Drone Campaigns'}
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => { setIsTourOpen(false); handleOpenInquiry(activeTourProperty); }}
                  className="btn-outline"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  Request Consultation
                </button>
                <button 
                  onClick={() => { setIsTourOpen(false); handleOpenBookingModal(activeTourProperty); }}
                  className="btn-gold"
                  style={{ padding: '8px 20px', fontSize: '0.85rem' }}
                >
                  Book Chauffeur Site Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIP Chauffeur-Driven Site Visit Booking Modal */}
      {isChauffeurModalOpen && selectedChauffeurProp && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <button className="modal-close" onClick={() => setIsChauffeurModalOpen(false)}>×</button>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--gold-primary)', marginBottom: '14px', borderBottom: '1px solid var(--border-muted)', paddingBottom: '12px' }}>
              <Car size={26} className="animate-pulse" />
              <div>
                <h3 className="modal-title" style={{ border: 'none', margin: 0, padding: 0, fontSize: '1.4rem' }}>Book Private Site Visit</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Complimentary Chauffeur Pickup & Site Tour</span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
              Schedule a premium, private chauffeured viewing of <strong>{selectedChauffeurProp.title}</strong> in Pune's prime tech corridors.
            </p>

            <form onSubmit={handleChauffeurSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="e.g. Anand Mahindra"
                  value={chauffeurForm.name}
                  onChange={e => setChauffeurForm({ ...chauffeurForm, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">WhatsApp Mobile</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    required 
                    placeholder="e.g. +919876543210"
                    value={chauffeurForm.phone}
                    onChange={e => setChauffeurForm({ ...chauffeurForm, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    required
                    value={chauffeurForm.visitDate}
                    onChange={e => setChauffeurForm({ ...chauffeurForm, visitDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Preferred Time Slot</label>
                  <select 
                    value={chauffeurForm.timeSlot} 
                    onChange={e => setChauffeurForm({ ...chauffeurForm, timeSlot: e.target.value })} 
                    className="form-input"
                  >
                    <option value="MORNING">Morning (9 AM - 12 PM)</option>
                    <option value="AFTERNOON">Afternoon (12 PM - 4 PM)</option>
                    <option value="EVENING">Evening (4 PM - 7 PM)</option>
                  </select>
                </div>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-light)', marginTop: '24px' }}>
                    <input 
                      type="checkbox" 
                      checked={chauffeurForm.includeExecutiveChauffeur} 
                      onChange={e => setChauffeurForm({ ...chauffeurForm, includeExecutiveChauffeur: e.target.checked })} 
                    />
                    Request Chauffeur Service
                  </label>
                </div>
              </div>

              {chauffeurForm.includeExecutiveChauffeur && (
                <div className="form-group" style={{ animation: 'fadeIn 0.3s forwards' }}>
                  <label className="form-label">Pickup Address (Pune only)</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    placeholder="Enter pickup residency/office address..."
                    value={chauffeurForm.pickupAddress}
                    onChange={e => setChauffeurForm({ ...chauffeurForm, pickupAddress: e.target.value })}
                  />
                </div>
              )}

              <button 
                type="submit" 
                className="btn-gold" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
                disabled={chauffeurSubmitting}
              >
                {chauffeurSubmitting ? <Loader className="animate-spin" size={20} /> : 'Schedule Private Viewing'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MahaRERA Compliance Side Drawer Panel */}
      {isReraDrawerOpen && selectedReraProperty && (
        <div className="rera-drawer-overlay" onClick={() => setIsReraDrawerOpen(false)}>
          <div className="rera-drawer-content" onClick={e => e.stopPropagation()}>
            <button className="drawer-close" onClick={() => setIsReraDrawerOpen(false)}>×</button>
            <div className="drawer-header">
              <ShieldCheck size={28} color="#D4AF37" />
              <h3>MahaRERA Regulatory Clearance</h3>
            </div>
            <div className="drawer-body">
              <div className="dossier-stat">
                <span>RERA License ID</span>
                <strong>{selectedReraProperty.reraNumber || 'PRM/PUNE/124/2026'}</strong>
              </div>
              <div className="dossier-stat">
                <span>Project Title Clear Status</span>
                <strong className="status-badge">100% Verified Clean Title</strong>
              </div>
              <div className="dossier-stat">
                <span>Compliance Audit Stamp</span>
                <strong>Approved by 24K Legal Desk</strong>
              </div>
              <div className="dossier-paragraph">
                <p>This project has undergone extensive litigation due-diligence by 24K Realtors legal desk. Title clearances, non-agricultural (NA) land certificates, and local municipal corporation (PMRDA/PMC) building approvals are verified.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Lead Capture Modal with Mortgage Calculator */}
      {isModalOpen && selectedProperty && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '850px' }}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            
            <div className="modal-split-layout">
              {/* Left Side: Standard Lead Form */}
              <div className="modal-form-side">
                <h3 className="modal-title">Request Private Presentation</h3>
                <p className="modal-subtitle">Register interest for <strong>{selectedProperty.title}</strong>.</p>
                
                <form onSubmit={handleLeadSubmit}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required 
                      placeholder="e.g. Rohan Sharma"
                      value={leadForm.name} 
                      onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">WhatsApp Mobile</label>
                      <input 
                        type="tel" 
                        className="form-input" 
                        required 
                        placeholder="e.g. +919876543210"
                        value={leadForm.phone} 
                        onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        required 
                        placeholder="e.g. rohan@gmail.com"
                        value={leadForm.email} 
                        onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea 
                      className="form-input" 
                      rows="2" 
                      value={leadForm.notes} 
                      onChange={e => setLeadForm({ ...leadForm, notes: e.target.value })}
                    />
                  </div>

                  {/* Asset Appreciation Time-Horizon projection calculator */}
                  <div className="advisory-appreciation-calculator">
                    <span className="cal-title"><TrendingUp size={14} style={{ marginRight: '6px' }} /> Capital Appreciation Projection</span>
                    <div className="appreciation-selectors">
                      <button type="button" className={appreciationYears === 3 ? 'active' : ''} onClick={() => setAppreciationYears(3)}>3 Years</button>
                      <button type="button" className={appreciationYears === 5 ? 'active' : ''} onClick={() => setAppreciationYears(5)}>5 Years</button>
                      <button type="button" className={appreciationYears === 10 ? 'active' : ''} onClick={() => setAppreciationYears(10)}>10 Years</button>
                    </div>
                    <div className="appreciation-result">
                      <span>Projected Value:</span>
                      <strong>{formatPrice(calculateAppreciatedValue(selectedProperty.price, selectedProperty.location, appreciationYears))}</strong>
                      <span className="cagr-sub">Based on {getAppreciationCAGR(selectedProperty.location)}% historical corridor CAGR</span>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-gold" 
                    style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
                    disabled={submitLoading}
                  >
                    {submitLoading ? <Loader className="animate-spin" size={20} /> : 'Submit Inquiry Desk'}
                  </button>
                </form>
              </div>

              {/* Right Side: Interactive Mortgage Calculator */}
              <div className="modal-calculator-side">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--gold-primary)', marginBottom: '16px' }}>
                  <Calculator size={20} />
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--font-title)' }}>Mortgage Estimator</h4>
                </div>

                <div className="emi-result-box">
                  <span className="emi-label">Estimated Monthly EMI</span>
                  <span className="emi-value">{formatPrice(mortgageDetails.monthlyEMI)}</span>
                  <span className="emi-sub">Principal & Interest only</span>
                </div>

                {/* Capital Structure proportion bar LTV */}
                <div className="ltv-proportion-container">
                  <span className="ltv-title">Capital Structure (LTV)</span>
                  <div className="ltv-bar-wrapper">
                    <div className="ltv-bar-equity" style={{ width: `${mortgageDetails.downPaymentPercent}%` }}></div>
                    <div className="ltv-bar-debt" style={{ width: `${100 - mortgageDetails.downPaymentPercent}%` }}></div>
                  </div>
                  <div className="ltv-bar-labels">
                    <span>Equity: {mortgageDetails.downPaymentPercent}%</span>
                    <span>Debt (Bank): {100 - mortgageDetails.downPaymentPercent}%</span>
                  </div>
                </div>

                <div className="slider-group" style={{ marginTop: '20px' }}>
                  <div className="slider-header">
                    <span>Down Payment ({mortgageDetails.downPaymentPercent}%)</span>
                    <span>{formatPrice(Number(selectedProperty.price) * (mortgageDetails.downPaymentPercent / 100))}</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="80" 
                    step="5"
                    value={mortgageDetails.downPaymentPercent} 
                    onChange={e => handleMortgageChange('downPaymentPercent', e.target.value)}
                    className="calculator-slider"
                  />
                </div>

                <div className="slider-group">
                  <div className="slider-header">
                    <span>Interest Rate</span>
                    <span>{mortgageDetails.interestRate}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="15" 
                    step="0.1" 
                    value={mortgageDetails.interestRate} 
                    onChange={e => handleMortgageChange('interestRate', e.target.value)}
                    className="calculator-slider"
                  />
                </div>

                <div className="slider-group">
                  <div className="slider-header">
                    <span>Loan Term</span>
                    <span>{mortgageDetails.loanTermYears} Years</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="30" 
                    step="1" 
                    value={mortgageDetails.loanTermYears} 
                    onChange={e => handleMortgageChange('loanTermYears', e.target.value)}
                    className="calculator-slider"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// Simple local helper icon since TrendingUp is not imported
function TrendingUpIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || "24"}
      height={props.size || "24"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

// Customized Premium Geometric Gold Loader spinner replacing the basic spinner
function PremiumGoldLoader() {
  return (
    <div className="premium-loader-container">
      <div className="premium-loader-ring"></div>
      <div className="premium-loader-core">
        <span>24K</span>
      </div>
      <p className="loader-status">Auditing Verified Inventory Registry...</p>
    </div>
  );
}

// Corridor static datasets used for the tech corridor filters (Redesigned with Metrics)
const corridorData = [
  { id: 'BANER', name: 'Baner Corridor', tagline: 'Balewadi Link Road, high appreciation', icon: <Activity size={20} />, pricePerSqft: '₹11,500', yield: '3.8%', growth: '+16%' },
  { id: 'WAKAD', name: 'Wakad Corridor', tagline: 'Datta Mandir, multi-lane connectivity', icon: <TrendingUpIcon size={20} />, pricePerSqft: '₹8,200', yield: '4.5%', growth: '+14%' },
  { id: 'HINJEWADI', name: 'Hinjewadi IT Corridor', tagline: 'Phase 1 & 2 Infotech park hub', icon: <Laptop size={20} />, pricePerSqft: '₹7,800', yield: '5.2%', growth: '+11%' },
  { id: 'BALEWADI', name: 'Balewadi High Street', tagline: 'Premium retail & high-end dining', icon: <Sparkles size={20} />, pricePerSqft: '₹10,200', yield: '4.0%', growth: '+13%' },
  { id: 'TATHAWADE', name: 'Tathawade Corridor', tagline: 'Educational hub & premium villas', icon: <Users size={20} />, pricePerSqft: '₹7,200', yield: '4.6%', growth: '+15%' },
  { id: 'MAHALUNGE', name: 'Mahalunge Corridor', tagline: 'Next-gen smart city township plots', icon: <LineChart size={20} />, pricePerSqft: '₹6,900', yield: '4.8%', growth: '+18%' }
];
