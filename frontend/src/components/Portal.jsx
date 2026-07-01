import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { 
  Search, MapPin, Bed, Bath, Maximize, Phone, Mail, Loader, 
  CheckCircle, Tag, IndianRupee, Laptop, Sparkles, Activity, 
  LineChart, Car, Users, Award, ShieldCheck, 
  Sliders, Calculator, Eye, Compass, Star, Sun, Moon, Calendar, Clock, Lock, TrendingUp, Building, Key, MessageSquare,
  X
} from 'lucide-react';
import './Portal.css';

// Import Modular Components
import PortalNavbar from '../layouts/PortalNavbar';
import PortalFooter from '../layouts/PortalFooter';
import PropertyCard from './PropertyCard';
import CompareOverlay from './CompareOverlay';
import ReraDrawer from './ReraDrawer';
import ChauffeurModal from './ChauffeurModal';
import ChatWidget from './ChatWidget';

const reviewsData = [
  {
    author: "Amit & Priyanjali Sharma",
    role: "VP Engineering at Tech Mahindra & Teacher at Vibgyor",
    text: "24K Realtors changed our approach completely. Instead of pushing properties, they analyzed our commute times to Hinjewadi Phase 1 IT park and top school distances. The RERA compliance is crystal clear."
  },
  {
    author: "Dr. Sandeep Deshmukh",
    role: "Chief Cardiologist, Ruby Hall Clinic Pune",
    text: "Buying in Wakad was seamless. We saved developer brokerage, received fully verified property layouts, and got assistance with mortgage rates directly on the site. Genuine real estate advisors."
  },
  {
    author: "Vikram Malhotra",
    role: "Managing Director, VM Tech-Ventures",
    text: "Acquired a commercial retail space on Balewadi High Street. Direct developer pricing, legal due diligence support, and complete transparency on local rental yields. Unbeatable advisory desk."
  },
  {
    author: "Rajesh Nair",
    role: "Principal Architect, Cognizant",
    text: "Rented a premium 3 BHK in TCG The Crown Greens, Hinjewadi Phase 2 through 24K Realtors. The entire documentation, society NOC, and tenant verification were handled online in 2 days. Highly professional!"
  },
  {
    author: "Sneha Kulkarni",
    role: "Senior HR Manager, Wipro",
    text: "Sold my 2 BHK apartment in Megapolis Splendour Phase 3. 24K Realtors found a buyer within 3 weeks and managed the registry and society transfer smoothly. Got excellent market pricing."
  }
];

export default function Portal({ onViewChange }) {
  const [isHnwiMode, setIsHnwiMode] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
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

  const [activeCollection, setActiveCollection] = useState('ALL');
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80'
  ];

  const [scrolled, setScrolled] = useState(false);
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
  const [exclusiveTab, setExclusiveTab] = useState('BUY');

  const [sellerForm, setSellerForm] = useState({
    name: '',
    phone: '',
    email: '',
    propertyTitle: '',
    location: 'HINJEWADI',
    expectedPrice: '',
    description: ''
  });

  const [vipForm, setVipForm] = useState({ name: '', phone: '' });
  const [vipSubmitting, setVipSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [isTourOpen, setIsTourOpen] = useState(false);
  const [activeTourProperty, setActiveTourProperty] = useState(null);
  const [mediaConsoleTab, setMediaConsoleTab] = useState('3d');

  const [isChatWidgetOpen, setIsChatWidgetOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Welcome to 24K Realtors. How can we assist you with Wakad or Baner properties today?' }
  ]);

  const [closedProperties, setClosedProperties] = useState([]);
  const [closedLoading, setClosedLoading] = useState(true);

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

  const [isReraDrawerOpen, setIsReraDrawerOpen] = useState(false);
  const [selectedReraProperty, setSelectedReraProperty] = useState(null);

  const [appreciationYears, setAppreciationYears] = useState(5);
  const [mortgageDetails, setMortgageDetails] = useState({
    downPaymentPercent: 20,
    interestRate: 8.5,
    loanTermYears: 20,
    monthlyEMI: 0
  });

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

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

      const data = await apiService.getProperties(queryFilters, page, 12);
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

  const handleTabChange = (tab) => {
    setExclusiveTab(tab);
    if (tab === 'SELL') {
      const element = document.getElementById('seller-mandate-anchor');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setFilters(prev => ({
        ...prev,
        transactionType: tab
      }));
      const element = document.getElementById('listings-anchor');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleSellerFormChange = (e) => {
    const { name, value } = e.target;
    setSellerForm(prev => ({ ...prev, [name]: value }));
  };

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
      showNotification('Success! Your asset has been listed on our Private Seller Desk.');
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

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    const currentInput = chatInput;
    setChatInput('');
    
    setTimeout(async () => {
      const botMsg = { sender: 'bot', text: 'Thank you for reaching out! A relationship manager has been notified.' };
      setChatMessages(prev => [...prev, botMsg]);
      try {
        await apiService.submitLead({
          name: '[LIVE CHAT CLIENT]',
          phone: '+919673000053',
          email: 'chat@24krealestate.com',
          requirementType: 'BUY',
          budgetMin: '0',
          budgetMax: '0',
          preferredLocation: 'HINJEWADI',
          notes: `[LIVE SUPPORT CHAT] User inquiry: "${currentInput}"`
        });
      } catch (err) {
        console.error("Failed to register live chat lead:", err);
      }
    }, 1000);
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

  const handleOpenWalkthrough = (property) => {
    setActiveTourProperty(property);
    setIsTourOpen(true);
    setMediaConsoleTab('video');
  };

  const handleOpen3DTour = (property) => {
    setActiveTourProperty(property);
    setIsTourOpen(true);
    setMediaConsoleTab('3d');
  };

  const handleOpenReraDrawer = (property, e) => {
    e.stopPropagation();
    setSelectedReraProperty(property);
    setIsReraDrawerOpen(true);
  };

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
    setNotification(message);
    setTimeout(() => setNotification(null), 5000);
  };

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

  const getLandmarks = (loc) => {
    switch (loc) {
      case 'BANER':
        return ['Balewadi High Street (5 mins)', 'Mumbai-Pune Highway (10 mins)'];
      case 'WAKAD':
        return ['Phoenix Marketcity (8 mins)', 'D.Y. Patil University (12 mins)'];
      case 'HINJEWADI':
        return ['Rajiv Gandhi IT Park Phase 1 (3 mins)', 'Hinjewadi Metro (5 mins)'];
      case 'BALEWADI':
        return ['Sports Complex Stadium (4 mins)', 'Balewadi High Street (2 mins)'];
      case 'TATHAWADE':
        return ['Indira College Campus (6 mins)', 'D-Mart Tathawade (4 mins)'];
      case 'MAHALUNGE':
        return ['Mahalunge-Nande Highway (3 mins)', 'Radisson Blu (12 mins)'];
      default:
        return ['IT Tech Parks (10 mins)', 'Mumbai Highway (15 mins)'];
    }
  };

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
      <PortalNavbar 
        isHnwiMode={isHnwiMode} 
        setIsHnwiMode={setIsHnwiMode} 
        onViewChange={onViewChange} 
        onBookVisitClick={() => { setSelectedChauffeurProp(properties[0] || null); setIsChauffeurModalOpen(true); }}
        exclusiveTab={exclusiveTab}
        onTabChange={handleTabChange}
      />

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
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
            <div className="ph-icon-wrapper"><IndianRupee size={24} /></div>
            <h3>Your Budget</h3>
            <p>From luxury 2 BHK apartments in Wakad to premium commercial properties in Hinjewadi to fit your goals.</p>
          </div>
          <div className="philosophy-card">
            <div className="ph-icon-wrapper"><Car size={24} /></div>
            <h3>Daily Commute</h3>
            <p>Strategic locations offering direct access to Hinjewadi IT parks, Baner offices, and highway routes.</p>
          </div>
          <div className="philosophy-card">
            <div className="ph-icon-wrapper"><Users size={24} /></div>
            <h3>Family Needs</h3>
            <p>Proximity to top-tier schools, premium high street retail, healthcare centers, and fitness centers.</p>
          </div>
          <div className="philosophy-card">
            <div className="ph-icon-wrapper"><LineChart size={24} /></div>
            <h3>Investment Goals</h3>
            <p>Appreciation-rich corridors delivering strong capital growth and consistent rental yields.</p>
          </div>
        </div>
      </section>

      {/* Main Listing & VIP Callback Container */}
      <div className="dual-listings-layout">
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
                  <option value="">All Pune West Corridors</option>
                  <option value="HINJEWADI">Hinjewadi IT Zone</option>
                  <option value="WAKAD">Wakad Junction</option>
                  <option value="BANER">Baner Tech Corridor</option>
                  <option value="BALEWADI">Balewadi High Street</option>
                  <option value="TATHAWADE">Tathawade Hub</option>
                  <option value="MAHALUNGE">Mahalunge Township</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Property Typology</label>
                <select name="propertyType" value={filters.propertyType} onChange={handleFilterChange} className="form-input">
                  <option value="">All Types (Res. & Com.)</option>
                  <option value="RESIDENTIAL">Residential Apartments</option>
                  <option value="COMMERCIAL">Commercial Workspaces</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Transaction</label>
                <select name="transactionType" value={filters.transactionType} onChange={handleFilterChange} className="form-input">
                  <option value="">Buy & Rent Inventory</option>
                  <option value="BUY">For Sale (Direct Purchase)</option>
                  <option value="RENT">To Rent (Monthly Yield)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Bedrooms (BHK)</label>
                <select name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange} className="form-input">
                  <option value="">Any Layout</option>
                  <option value="1">1 BHK Layout</option>
                  <option value="2">2 BHK Smart layout</option>
                  <option value="3">3 BHK Premium layout</option>
                  <option value="4">4 BHK Penthouse/Elite</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Furnishing Status</label>
                <select name="furnishingStatus" value={filters.furnishingStatus} onChange={handleFilterChange} className="form-input">
                  <option value="">Any furnishing</option>
                  <option value="FULLY_FURNISHED">Fully Furnished</option>
                  <option value="SEMI_FURNISHED">Semi Furnished</option>
                  <option value="UNFURNISHED">Unfurnished</option>
                </select>
              </div>

              <div className="form-group" style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <button type="submit" className="btn-gold" style={{ flexGrow: 1, justifyContent: 'center' }}>
                  Filter Registry
                </button>
                <button type="button" onClick={handleResetFilters} className="btn-outline" style={{ padding: '12px' }} title="Reset Filters">
                  <RefreshCwIcon size={16} />
                </button>
              </div>
            </form>
          </section>

          {/* Exclusive Inventory Display */}
          <div id="listings-anchor" className="properties-header properties-header-premium">
            <div className="listings-title-group">
              <div className="listings-gold-accent"></div>
              <h2 className="listings-section-title">{isHnwiMode ? 'HNWI Mandated Assets' : 'Exclusive Inventory'}</h2>
            </div>
            <span className="properties-count-badge">
              <span className="count-number">{totalElements}</span>
              Premium listings found
            </span>
          </div>

          {loading ? (
            <div className="premium-loader-box">
              <PremiumGoldLoader />
            </div>
          ) : error ? (
            <div className="empty-state" style={{ borderColor: '#D90429', color: '#FF4D6D', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', padding: '30px' }}>
              <p style={{ fontWeight: 'bold', fontSize: '1.1rem', margin: 0 }}>{error}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '400px', textAlign: 'left', marginTop: '10px' }}>
                <label style={{ fontSize: '0.8rem', color: '#c8a2c8', fontWeight: '600' }}>Custom Spring Boot API Endpoint:</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    defaultValue={apiService.getApiBaseUrl()} 
                    id="portal-custom-api-url"
                    className="form-input"
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(200,162,200,0.3)', background: 'rgba(26,18,38,0.8)', color: '#fff', fontSize: '0.9rem', outline: 'none', margin: 0 }}
                  />
                  <button 
                    onClick={() => {
                      const val = document.getElementById('portal-custom-api-url').value;
                      apiService.setApiBaseUrl(val);
                      fetchProperties();
                    }}
                    className="btn-gold"
                    style={{ padding: '10px 20px', borderRadius: '8px', background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#000', fontWeight: 'bold', cursor: 'pointer', border: 'none', fontSize: '0.9rem', margin: 0 }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          ) : properties.length === 0 ? (
            <div className="empty-state">
              <p>No premium properties match your criteria at this moment. Adjust your filters or click a corridor card.</p>
            </div>
          ) : (
            <>
              <div className="properties-grid">
                {properties.map(property => (
                  <PropertyCard 
                    key={property.id}
                    property={property}
                    isHnwiMode={isHnwiMode}
                    isCompared={selectedForCompare.some(p => p.id === property.id)}
                    formatPrice={formatPrice}
                    onToggleCompare={handleToggleCompare}
                    onOpenRera={handleOpenReraDrawer}
                    onOpenWalkthrough={handleOpenWalkthrough}
                    onOpen3DTour={handleOpen3DTour}
                    onOpenChauffeur={(p) => { setSelectedChauffeurProp(p); setIsChauffeurModalOpen(true); }}
                    getLocationScorecard={getLocationScorecard}
                    getLandmarks={getLandmarks}
                  />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="pagination-wrapper" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
                  <button 
                    disabled={page === 0} 
                    onClick={() => setPage(prev => Math.max(0, prev - 1))}
                    className="btn-outline"
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    Previous
                  </button>
                  <span style={{ color: 'var(--text-light)', display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
                    Page {page + 1} of {totalPages}
                  </span>
                  <button 
                    disabled={page >= totalPages - 1} 
                    onClick={() => setPage(prev => prev + 1)}
                    className="btn-outline"
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

          {/* Grayscale Closed Deals FOMO Section */}
          <section className="closed-deals-section" style={{ marginTop: '50px', borderTop: '1px solid var(--border-muted)', paddingTop: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888', marginBottom: '16px' }}>
              <Lock size={18} />
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, letterSpacing: '0.05em' }}>RECENTLY CLOSED TRANSACTIONS</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '24px', lineHeight: 1.5 }}>
              Advisory records of successfully completed property assignments. Grayscale display signifies unavailable listings. Enquire for similar configurations.
            </p>

            {closedLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}><Loader className="animate-spin" size={24} color="#888" /></div>
            ) : closedProperties.length === 0 ? (
              <div className="empty-state" style={{ color: '#888', borderStyle: 'dashed' }}><p>No recently closed records loaded.</p></div>
            ) : (
              <div className="closed-deals-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                {closedProperties.map(p => (
                  <div key={p.id} className="closed-deal-card" style={{ filter: 'grayscale(100%)', opacity: 0.6, border: '1px solid var(--border-muted)', borderRadius: '8px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ height: '140px', backgroundImage: `url('${p.imageUrl || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80"}')`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                      <span style={{ position: 'absolute', bottom: '10px', left: '10px', background: '#000', color: '#fff', fontSize: '0.65rem', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        {p.status}
                      </span>
                    </div>
                    <div style={{ padding: '12px' }}>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>Location: {p.location} Corridor</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', fontWeight: 600, color: 'var(--gold-primary)' }}>{formatPrice(p.price, p.transactionType)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* Right Side: Priority Callback & Seller Mandate Desk */}
        <div className="right-callback-sidebar">
          {/* Priority Callback Desk */}
          <div className="callback-card">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--gold-primary)', marginBottom: '10px' }}>
              <Clock size={18} className="animate-pulse" />
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-title)' }}>60-Second Priority Callback</h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '16px' }}>
              Submit your mobile number. Our regional tech-corridor specialist will dial your line within 60 seconds.
            </p>
            <form onSubmit={handleVipSubmit}>
              <div className="form-group">
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  placeholder="Your Name" 
                  value={vipForm.name} 
                  onChange={e => setVipForm({ ...vipForm, name: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <input 
                  type="tel" 
                  className="form-input" 
                  required 
                  placeholder="WhatsApp Mobile (+91)" 
                  value={vipForm.phone} 
                  onChange={e => setVipForm({ ...vipForm, phone: e.target.value })} 
                />
              </div>
              <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center' }} disabled={vipSubmitting}>
                {vipSubmitting ? <Loader className="animate-spin" size={16} /> : 'Connect Priority Advisor'}
              </button>
            </form>
          </div>

          {/* Seller Exclusive Mandate Desk */}
          <div id="seller-mandate-anchor" className="seller-mandate-premium">
            <div className="seller-mandate-header">
              <div className="seller-mandate-icon-ring">
                <Building size={22} />
              </div>
              <div>
                <h3 className="seller-mandate-title">Seller Advisory Mandate</h3>
                <p className="seller-mandate-subtitle">List Your Property • Zero Brokerage • Institutional Buyers</p>
              </div>
            </div>
            <p className="seller-mandate-desc">
              Own a flat in Wakad, Hinjewadi or Baner? List directly with 24K Realtors for access to institutional buyers, NRI investors, and premium HNI clients. Zero brokerage. Maximum returns.
            </p>
            <form onSubmit={handleSellerSubmit} className="seller-mandate-form">
              <div className="seller-form-grid">
                <div className="form-group">
                  <label className="seller-form-label">Owner Name</label>
                  <input 
                    type="text" 
                    name="name"
                    className="form-input seller-input" 
                    required 
                    placeholder="Full Name" 
                    value={sellerForm.name} 
                    onChange={handleSellerFormChange} 
                  />
                </div>
                <div className="form-group">
                  <label className="seller-form-label">WhatsApp Mobile</label>
                  <input 
                    type="tel" 
                    name="phone"
                    className="form-input seller-input" 
                    required 
                    placeholder="+91 XXXXX XXXXX" 
                    value={sellerForm.phone} 
                    onChange={handleSellerFormChange} 
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="seller-form-label">Owner Email</label>
                <input 
                  type="email" 
                  name="email"
                  className="form-input seller-input" 
                  required 
                  placeholder="your@email.com" 
                  value={sellerForm.email} 
                  onChange={handleSellerFormChange} 
                />
              </div>
              <div className="seller-form-grid">
                <div className="form-group">
                  <label className="seller-form-label">Project / BHK</label>
                  <input 
                    type="text" 
                    name="propertyTitle"
                    className="form-input seller-input" 
                    required 
                    placeholder="e.g. Blue Ridge 3 BHK" 
                    value={sellerForm.propertyTitle} 
                    onChange={handleSellerFormChange} 
                  />
                </div>
                <div className="form-group">
                  <label className="seller-form-label">Location</label>
                  <select 
                    name="location" 
                    className="form-input seller-input" 
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
                <label className="seller-form-label">Expected Valuation (₹)</label>
                <input 
                  type="number" 
                  name="expectedPrice" 
                  className="form-input seller-input" 
                  required 
                  placeholder="e.g. 85,00,000" 
                  value={sellerForm.expectedPrice} 
                  onChange={handleSellerFormChange} 
                />
              </div>
              <div className="form-group">
                <label className="seller-form-label">Property Highlights</label>
                <textarea 
                  name="description" 
                  className="form-input seller-input" 
                  rows="2" 
                  placeholder="e.g. 12th floor, modular kitchen, park view, covered parking..."
                  value={sellerForm.description} 
                  onChange={handleSellerFormChange} 
                />
              </div>
              <button type="submit" className="btn-seller-mandate" disabled={submitLoading}>
                {submitLoading ? 'Registering...' : '📋 Register Sale Mandate'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modular Comparison Overlay Modal */}
      <CompareOverlay 
        isOpen={isCompareOpen}
        selectedForCompare={selectedForCompare}
        onClose={() => setIsCompareOpen(false)}
        formatPrice={formatPrice}
        onOpenInquiry={handleOpenInquiry}
      />

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
                  onClick={() => { setIsTourOpen(false); setSelectedChauffeurProp(activeTourProperty); setIsChauffeurModalOpen(true); }}
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

      {/* Modular Chauffeur Site Visit Modal */}
      <ChauffeurModal 
        isOpen={isChauffeurModalOpen}
        property={selectedChauffeurProp}
        onClose={() => setIsChauffeurModalOpen(false)}
        onSubmit={handleChauffeurSubmit}
        chauffeurForm={chauffeurForm}
        setChauffeurForm={setChauffeurForm}
        chauffeurSubmitting={chauffeurSubmitting}
      />

      {/* Modular MahaRERA compliance slide drawer */}
      <ReraDrawer 
        isOpen={isReraDrawerOpen}
        property={selectedReraProperty}
        onClose={() => setIsReraDrawerOpen(false)}
      />

      {/* Modular Enquiry Callback Modal with Mortgage Calculator */}
      {isModalOpen && selectedProperty && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '850px' }}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            
            <div className="modal-split-layout">
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

      {/* Floating chatbot widget */}
      <ChatWidget 
        isOpen={isChatWidgetOpen}
        setIsOpen={setIsChatWidgetOpen}
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        onSubmit={handleChatSubmit}
      />

      {/* Sticky Floating WhatsApp */}
      <a 
        href="https://wa.me/919673000053?text=I%20am%20interested%20in%20real%20estate%20consultation"
        className="floating-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
        title="WhatsApp Consultation Desk"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.233-1.371c1.394.756 2.96 1.157 4.777 1.158h.005c5.502 0 9.987-4.476 9.988-9.986C22 7.478 17.517 2 12.012 2zm5.787 14.404c-.24.675-1.397 1.285-1.92 1.36-.474.07-1.088.13-3.18-.737-2.677-1.11-4.4-3.837-4.536-4.015-.132-.178-1.08-1.433-1.08-2.73 0-1.298.68-1.936.92-2.199.243-.263.53-.328.706-.328.176 0 .353.003.507.01.162.007.382-.062.597.45.22.524.75 1.83.816 1.964.066.13.11.286.022.463-.087.177-.13.287-.26.439-.13.15-.27.337-.385.45-.126.126-.259.263-.11.517.15.253.66.1.91 1.488.75 1.309 1.37 2.14 2.15 2.65.783.51 1.237.585 1.58.204.34-.38 1.484-1.72 1.88-2.31.398-.59.794-.49 1.346-.29.553.2.3.5 1.764 1.226.22.11.365.163.475.328.11.165.11.954-.13 1.63z"/>
        </svg>
      </a>

      {/* Portal Footer */}
      <PortalFooter />
    </div>
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

function RefreshCwIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
    </svg>
  );
}

// Corridor static datasets used for the tech corridor filters (Redesigned with Metrics)
const corridorData = [
  { id: 'BANER', name: 'Baner Corridor', tagline: 'Balewadi Link Road, high appreciation', icon: <Activity size={20} />, pricePerSqft: '₹11,500', yield: '3.8%', growth: '+16%' },
  { id: 'WAKAD', name: 'Wakad Corridor', tagline: 'Datta Mandir, multi-lane connectivity', icon: <TrendingUp size={20} />, pricePerSqft: '₹8,200', yield: '4.5%', growth: '+14%' },
  { id: 'HINJEWADI', name: 'Hinjewadi IT Corridor', tagline: 'Phase 1 & 2 Infotech park hub', icon: <Laptop size={20} />, pricePerSqft: '₹7,800', yield: '5.2%', growth: '+11%' },
  { id: 'BALEWADI', name: 'Balewadi High Street', tagline: 'Premium retail & high-end dining', icon: <Sparkles size={20} />, pricePerSqft: '₹10,200', yield: '4.0%', growth: '+13%' },
  { id: 'TATHAWADE', name: 'Tathawade Corridor', tagline: 'Educational hub & premium villas', icon: <Users size={20} />, pricePerSqft: '₹7,200', yield: '4.6%', growth: '+15%' },
  { id: 'MAHALUNGE', name: 'Mahalunge Corridor', tagline: 'Next-gen smart city township plots', icon: <LineChart size={20} />, pricePerSqft: '₹6,900', yield: '4.8%', growth: '+18%' }
];
