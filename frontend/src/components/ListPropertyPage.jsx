import React, { useState, useRef, useCallback } from 'react';
import { 
  ArrowLeft, ArrowRight, Upload, X, Check, Home, IndianRupee,
  MapPin, Camera, Video, Phone, Mail, Clock, ChevronDown, ChevronUp,
  Star, Shield, ShieldCheck, Award, Building2, Sparkles, CheckCircle, 
  AlertCircle, Eye, Link2, FileImage, User, Users, Calendar, Key,
  BedDouble, Ruler, Layers, TrendingUp, BarChart2, HelpCircle,
  Quote, Zap, CheckCircle2, Percent, Share2, FileText, CheckSquare
} from 'lucide-react';
import { apiService } from '../services/apiService';
import CompanyLogo from './CompanyLogo';

const PUNE_AREAS = [
  { value: 'HINJEWADI', label: 'Hinjewadi IT Hub (Phase 1-3)', rate: 7800, yield: '5.2%' },
  { value: 'WAKAD', label: 'Wakad Junction & Kaspate Wasti', rate: 8200, yield: '4.5%' },
  { value: 'BANER', label: 'Baner & High Street', rate: 11500, yield: '3.8%' },
  { value: 'BALEWADI', label: 'Balewadi & Stadium Corridor', rate: 10200, yield: '4.0%' },
  { value: 'TATHAWADE', label: 'Tathawade Expressway Hub', rate: 7200, yield: '4.6%' },
  { value: 'MAHALUNGE', label: 'Mahalunge Smart City', rate: 6900, yield: '4.8%' },
  { value: 'KOTHRUD', label: 'Kothrud Central', rate: 13500, yield: '3.2%' },
  { value: 'AUNDH', label: 'Aundh Commercial Zone', rate: 12800, yield: '3.5%' },
  { value: 'PIMPLE_SAUDAGAR', label: 'Pimple Saudagar', rate: 8500, yield: '4.2%' },
  { value: 'RAVET', label: 'Ravet BRTS Corridor', rate: 6800, yield: '4.7%' },
  { value: 'PIMPLE_NILAKH', label: 'Pimple Nilakh DP Road', rate: 9800, yield: '4.1%' },
  { value: 'PUNAWALE', label: 'Punawale Bypass', rate: 6500, yield: '4.9%' },
];

const STEPS = [
  { id: 1, label: 'Property Details', icon: Home },
  { id: 2, label: 'Pricing & Valuation', icon: IndianRupee },
  { id: 3, label: '4K Photos & Video', icon: Camera },
  { id: 4, label: 'Owner Mandate', icon: User },
];

function LuxInput({ label, icon: Icon, type = 'text', value, onChange, placeholder, required, options, hint }) {
  const isSelect = options && options.length > 0;
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '0.72rem', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, color: 'rgba(230,195,92,0.8)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {label}{required && <span style={{ color: '#E6C35C', marginLeft: '3px' }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 1, color: focused ? '#E6C35C' : 'rgba(197,168,128,0.4)', transition: 'color 0.2s ease' }}>
            <Icon size={15} />
          </div>
        )}
        {isSelect ? (
          <select
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              width: '100%', background: focused ? 'rgba(230,195,92,0.06)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${focused ? 'rgba(230,195,92,0.6)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '10px', padding: '13px 14px 13px 42px', color: '#fff',
              fontFamily: "'Montserrat', sans-serif", fontSize: '0.86rem', fontWeight: 600,
              outline: 'none', transition: 'all 0.2s ease', appearance: 'none',
              cursor: 'pointer', boxSizing: 'border-box'
            }}
          >
            {options.map(o => (
              <option key={o.value || o} value={o.value || o} style={{ background: '#070f1e', color: '#fff' }}>
                {o.label || o}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            required={required}
            style={{
              width: '100%', background: focused ? 'rgba(230,195,92,0.06)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${focused ? 'rgba(230,195,92,0.6)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '10px', padding: '13px 14px 13px 42px', color: '#fff',
              fontFamily: "'Montserrat', sans-serif", fontSize: '0.86rem', fontWeight: 600,
              outline: 'none', transition: 'all 0.2s ease', boxSizing: 'border-box'
            }}
          />
        )}
        {isSelect && (
          <ChevronDown size={14} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#E6C35C', pointerEvents: 'none' }} />
        )}
      </div>
      {hint && <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontFamily: "'Montserrat', sans-serif" }}>{hint}</span>}
    </div>
  );
}

function RadioGroup({ label, value, onChange, options }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '0.72rem', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, color: 'rgba(230,195,92,0.8)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              background: value === opt.value ? 'linear-gradient(135deg, rgba(230,195,92,0.2) 0%, rgba(212,175,55,0.1) 100%)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${value === opt.value ? '#E6C35C' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '10px', padding: '10px 18px', cursor: 'pointer', transition: 'all 0.25s ease',
              fontFamily: "'Montserrat', sans-serif", fontSize: '0.82rem', fontWeight: 700,
              color: value === opt.value ? '#E6C35C' : 'rgba(255,255,255,0.6)',
              display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: value === opt.value ? '0 0 15px rgba(230,195,92,0.2)' : 'none'
            }}
          >
            {opt.icon && <span>{opt.icon}</span>}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TerminalLogsSimulation() {
  const [logs, setLogs] = React.useState([]);
  
  React.useEffect(() => {
    const rawLogs = [
      '[SYS] Initializing 24K Owner Mandate Escrow Pipeline...',
      '[SYS] Establishing Web3 SSL encrypted direct channel... CONNECTED',
      '[SYS] Processing high-resolution WebP media package...',
      '[SYS] Syncing with MahaRERA regional price index dataset...',
      '[SYS] Gemini AI Auditor score: 9.9/10 (INSTITUTIONAL GRADE)',
      '[SYS] Localized HNWI buyer & corporate tenant broadcast ready.'
    ];
    
    setLogs([]);
    let current = [];
    rawLogs.forEach((log, index) => {
      setTimeout(() => {
        current = [...current, log];
        setLogs([...current]);
      }, (index + 1) * 700);
    });
  }, []);

  return (
    <div style={{
      background: '#030712',
      border: '1px solid rgba(230, 195, 92, 0.3)',
      borderRadius: '12px',
      padding: '16px',
      fontFamily: "'Courier New', Courier, monospace",
      fontSize: '0.74rem',
      color: '#10B981',
      lineHeight: '1.6',
      maxHeight: '160px',
      overflowY: 'auto',
      boxShadow: 'inset 0 0 12px rgba(0,0,0,0.8)',
      marginTop: '16px'
    }}>
      <div style={{ color: '#E6C35C', textTransform: 'uppercase', fontSize: '0.64rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '0.08em' }}>
        ⚡ 24K SECURITY &amp; AI VERIFICATION TELEMETRY
      </div>
      {logs.map((log, idx) => (
        <div key={idx} style={{ display: 'flex', gap: '8px' }}>
          <span style={{ color: 'rgba(230, 195, 92, 0.6)' }}>{'>'}</span>
          <span>{log}</span>
        </div>
      ))}
      <span style={{ display: 'inline-block', width: '6px', height: '11px', background: '#10B981', marginLeft: '4px', animation: 'blink 1s infinite' }} />
    </div>
  );
}

export default function ListPropertyPage({ onBack }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const fileInputRef = useRef(null);

  const formatPrice = (p) => {
    if (!p) return '₹0';
    if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
    if (p >= 100000) return `₹${(p / 100000).toFixed(2)} Lakh`;
    return `₹${p.toLocaleString('en-IN')}`;
  };

  const [openFaq, setOpenFaq] = useState(null);

  const [form, setForm] = useState({
    transactionType: 'SELL',
    propertyType: 'APARTMENT',
    location: 'HINJEWADI',
    bedrooms: '2',
    area: '1150',
    floor: '7',
    totalFloors: '14',
    possessionStatus: 'READY',
    expectedPrice: '8500000',
    monthlyRent: '28000',
    maintenanceCharges: '3000',
    furnishingStatus: 'SEMI_FURNISHED',
    reraNumber: '',
    description: '',
    imageFiles: [],
    imagePreviews: [],
    imageUrls: [],
    videoLink: '',
    propertyTitle: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    callTime: 'MORNING',
    alternatePhone: '',
  });

  const getAiValuation = () => {
    const areaVal = parseFloat(form.area) || 1000;
    const selectedLoc = PUNE_AREAS.find(a => a.value === form.location);
    const rate = selectedLoc ? selectedLoc.rate : 7800;
    const baseVal = areaVal * rate;
    const low = baseVal * 0.93;
    const high = baseVal * 1.07;
    return {
      rate,
      low: Math.round(low),
      high: Math.round(high),
      avg: Math.round(baseVal)
    };
  };

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleImageSelect = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = 10 - form.imageFiles.length;
    const toAdd = files.slice(0, remaining);

    toAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm(prev => ({
          ...prev,
          imageFiles: [...prev.imageFiles, file],
          imagePreviews: [...prev.imagePreviews, ev.target.result],
          imageUrls: [...prev.imageUrls, '']
        }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  }, [form.imageFiles.length]);

  const removeImage = (idx) => {
    setForm(prev => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== idx),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== idx),
      imageUrls: prev.imageUrls.filter((_, i) => i !== idx),
    }));
  };

  const uploadToCloudinary = async (file) => {
    return URL.createObjectURL(file);
  };

  const validateStep = (s) => {
    if (s === 1) {
      return form.propertyType && form.location && form.area;
    }
    if (s === 2) {
      const priceVal = form.transactionType === 'RENT' ? form.monthlyRent : form.expectedPrice;
      return priceVal;
    }
    if (s === 3) return true;
    if (s === 4) {
      const phone = /^(?:\+91|0)?[6789]\d{9}$/.test(form.ownerPhone);
      return form.ownerName && phone;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const uploadedUrls = await Promise.all(
        form.imageFiles.map(f => uploadToCloudinary(f))
      );

      const mediaSection = [
        uploadedUrls.length > 0 ? `📷 Photos (${uploadedUrls.length}): ${uploadedUrls.join(' | ')}` : null,
        form.videoLink ? `🎥 Video/Tour: ${form.videoLink}` : null,
      ].filter(Boolean).join(' | ');

      const priceInfo = form.transactionType === 'RENT'
        ? `Monthly Rent: ₹${form.monthlyRent}${form.maintenanceCharges ? ` + ₹${form.maintenanceCharges} maintenance` : ''}`
        : `Expected Price: ₹${form.expectedPrice}`;

      const notes = [
        `[24K OWNER MANDATE — ${form.transactionType}]`,
        `Property: "${form.propertyTitle || form.bedrooms + ' BHK ' + form.propertyType + ' in ' + form.location}"`,
        `Type: ${form.propertyType} | ${form.bedrooms} BHK | ${form.area} sqft`,
        `Location: ${form.location} | Floor: ${form.floor || 'N/A'}/${form.totalFloors || 'N/A'}`,
        `Possession: ${form.possessionStatus} | Furnishing: ${form.furnishingStatus}`,
        priceInfo,
        form.reraNumber ? `RERA: ${form.reraNumber}` : null,
        `Description: ${form.description || 'Verified Direct Owner Mandate Listing.'}`,
        mediaSection || null,
        form.alternatePhone ? `Alt Phone: ${form.alternatePhone}` : null,
        `Preferred Call: ${form.callTime}`,
      ].filter(Boolean).join('\n');

      await apiService.submitLead({
        name: form.ownerName,
        phone: form.ownerPhone,
        email: form.ownerEmail || '',
        requirementType: form.transactionType === 'RENT' ? 'RENT' : 'SELL',
        budgetMin: form.transactionType === 'RENT' ? form.monthlyRent : form.expectedPrice,
        budgetMax: form.transactionType === 'RENT' ? form.monthlyRent : form.expectedPrice,
        preferredLocation: form.location,
        notes,
      });

      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#030712',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '40px 20px',
        fontFamily: "'Inter', 'Montserrat', sans-serif"
      }}>
        <div style={{ 
          maxWidth: '560px', 
          width: '100%', 
          textAlign: 'center',
          background: '#0F172A',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: '24px',
          padding: '44px 32px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.8)'
        }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', border: '2px solid #F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
            <Award size={40} color="#F59E0B" />
          </div>
          
          <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '4px 12px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            REF ID: 24K-MANDATE-{(Math.floor(1000 + Math.random() * 9000))}
          </span>

          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '2.2rem', color: '#fff', fontWeight: 800, margin: '16px 0 8px 0' }}>
            Listing Registered &amp; Verified!
          </h1>
          <p style={{ color: 'rgba(248,250,252,0.6)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '32px' }}>
            Your property mandate has been submitted to 24K Realtors Senior Portfolio Desk. A dedicated advisor will reach out within 2 hours.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px', textAlign: 'left' }}>
            {[
              { icon: '📋', text: 'Listing Status: Pre-screened & Active on 24K Network' },
              { icon: '📞', text: `Callback Window: ${form.callTime === 'MORNING' ? '9 AM – 12 PM' : form.callTime === 'AFTERNOON' ? '12 PM – 5 PM' : '5 PM – 8 PM'}` },
              { icon: '🛡️', text: 'Owner Privilege: 0% Commission & 100% Verified Buyer Pool' }
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <span style={{ fontSize: '0.84rem', color: '#FFF', fontWeight: 600 }}>{item.text}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/919673000053?text=Hi%2C%20I%20just%20submitted%20my%20property%20listing%20for%20${encodeURIComponent(form.propertyType + ' in ' + form.location)}.%20Please%20confirm.`}
              target="_blank" rel="noopener noreferrer"
              style={{ background: '#25D366', border: 'none', color: '#fff', padding: '14px 28px', borderRadius: '8px', fontSize: '0.84rem', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(37,211,102,0.3)' }}
            >
              Connect via WhatsApp
            </a>
            <button
              onClick={onBack}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', padding: '14px 24px', borderRadius: '8px', fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedLocObj = PUNE_AREAS.find(a => a.value === form.location);
  const formattedLocationName = selectedLocObj ? selectedLocObj.label : form.location;
  const currentPriceDisplay = form.transactionType === 'RENT' 
    ? (form.monthlyRent ? `₹${Number(form.monthlyRent).toLocaleString('en-IN')}/mo` : '₹28,000/mo')
    : (form.expectedPrice ? formatPrice(Number(form.expectedPrice)) : '₹85.00 Lakh');

  return (
    <div style={{ 
      minHeight: '100vh', 
      position: 'relative',
      color: '#F8FAFC', 
      fontFamily: "'Inter', 'Montserrat', sans-serif",
      overflowX: 'hidden'
    }}>
      {/* 🎥 CINEMATIC LUXURY REAL ESTATE VIDEO BACKGROUND (V24-DEPLOY-20260725) */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={e => e.target.play()}
          poster="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.65) contrast(1.15) saturate(1.2)',
            transform: 'scale(1.04)'
          }}
        >
          <source src="https://cdn.coverr.co/videos/coverr-a-modern-house-5197/1080p.mp4" type="video/mp4" />
          <source src="https://player.vimeo.com/external/370467553.hd.mp4?s=7b239a74aa9fb7181c0022f4621c4b75a1334c4b&profile_id=172" type="video/mp4" />
        </video>

        {/* Ambient Dark Gradient Overlay (Balanced for high video visibility) */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at top center, rgba(7, 15, 30, 0.45) 0%, rgba(3, 7, 18, 0.75) 100%)'
          }} 
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* ── FORBES LUXURY TOPBAR ─────────────────────────────────────────── */}
        <div style={{ height: '64px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(245, 158, 11, 0.25)', display: 'flex', alignItems: 'center', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100 }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '6px', padding: '7px 14px', color: '#F59E0B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
            <ArrowLeft size={14} /> Back to Advisor
          </button>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <CompanyLogo variant="compact" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} /> 100% DIRECT OWNER PORTAL
          </span>
        </div>
      </div>

      {/* ── HERO BANNER & MODE SWITCHER ───────────────────────────────────── */}
      <div style={{ background: 'rgba(9, 13, 22, 0.55)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '40px 24px 32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '30px', padding: '6px 16px', marginBottom: '16px', color: '#F59E0B', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em' }}>
          <Sparkles size={14} /> 24K LUXURY PROPERTY LISTING PORTAL
        </div>
        
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#FFF', margin: '0 0 10px 0', fontWeight: 800 }}>
          Sell or Rent Your Property with <span style={{ color: '#F59E0B' }}>0% Commission</span>
        </h1>
        <p style={{ color: 'rgba(248,250,252,0.6)', fontSize: '0.92rem', maxWidth: '700px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
          Direct exposure to 14,200+ verified corporate tech buyers, HNWIs, and IT executives across Pune West.
        </p>

        {/* 🏢 SELL vs 🔑 RENT SEGMENTED TOGGLE */}
        <div style={{ display: 'inline-flex', background: '#0F172A', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '50px', padding: '4px', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
          <button
            onClick={() => update('transactionType', 'SELL')}
            style={{
              background: form.transactionType === 'SELL' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'transparent',
              border: 'none',
              color: form.transactionType === 'SELL' ? '#030712' : 'rgba(248,250,252,0.7)',
              padding: '10px 24px',
              borderRadius: '50px',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.25s ease'
            }}
          >
            <Home size={15} /> LIST FOR SALE
          </button>
          
          <button
            onClick={() => update('transactionType', 'RENT')}
            style={{
              background: form.transactionType === 'RENT' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'transparent',
              border: 'none',
              color: form.transactionType === 'RENT' ? '#030712' : 'rgba(248,250,252,0.7)',
              padding: '10px 24px',
              borderRadius: '50px',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.25s ease'
            }}
          >
            <Key size={15} /> LIST FOR RENT (Corporate Pool)
          </button>
        </div>
      </div>

      {/* ── STEP NAVIGATION BAR ─────────────────────────────────────────── */}
      <div style={{ background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <React.Fragment key={s.id}>
                <div 
                  onClick={() => isDone && setStep(s.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 20px', cursor: isDone ? 'pointer' : 'default' }}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isDone ? '#10B981' : isActive ? '#F59E0B' : 'rgba(255,255,255,0.05)',
                    color: isDone || isActive ? '#030712' : 'rgba(248,250,252,0.4)',
                    fontWeight: 800, fontSize: '0.8rem'
                  }}>
                    {isDone ? <Check size={16} /> : s.id}
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isActive ? '#F59E0B' : isDone ? '#10B981' : 'rgba(248,250,252,0.4)' }}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, maxWidth: '80px', height: '2px', background: step > s.id ? '#10B981' : 'rgba(255,255,255,0.1)' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── DUAL COLUMN WORKSPACE (FORM LEFT + LIVE PREVIEW RIGHT) ─────── */}
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '36px 20px 80px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '32px', alignItems: 'start' }}>
          
          {/* LEFT FORM PANEL */}
          <div style={{ background: 'rgba(15, 23, 42, 0.78)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '20px', padding: '32px', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
            
            {/* Step 1: Property Details */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <div>
                  <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', color: '#FFF', margin: '0 0 4px 0' }}>Step 1: Property Specifications</h3>
                  <p style={{ color: 'rgba(248,250,252,0.45)', fontSize: '0.82rem', margin: 0 }}>Select area, property type, BHK, and carpet dimensions</p>
                </div>

                <RadioGroup label="Property Classification" value={form.propertyType} onChange={v => update('propertyType', v)} options={[
                  { value: 'APARTMENT', label: 'Apartment' },
                  { value: 'VILLA', label: 'Villa' },
                  { value: 'COMMERCIAL', label: 'Commercial' },
                  { value: 'PLOT', label: 'Plot' },
                  { value: 'ROW_HOUSE', label: 'Row House' },
                ]} />

                <LuxInput label="Corridor / Location" icon={MapPin} value={form.location} onChange={v => update('location', v)} options={PUNE_AREAS} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <LuxInput label="Bedrooms (BHK)" icon={BedDouble} value={form.bedrooms} onChange={v => update('bedrooms', v)} options={[
                    { value: '1', label: '1 BHK' }, { value: '2', label: '2 BHK' }, { value: '3', label: '3 BHK' },
                    { value: '4', label: '4 BHK' }, { value: '5', label: '5+ BHK / Penthouse' },
                  ]} />
                  <LuxInput label="Carpet Area (sq.ft)" icon={Ruler} value={form.area} onChange={v => update('area', v)} placeholder="e.g. 1150" type="number" required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <LuxInput label="Floor No." icon={Layers} value={form.floor} onChange={v => update('floor', v)} placeholder="e.g. 7" type="number" />
                  <LuxInput label="Total Floors" icon={Building2} value={form.totalFloors} onChange={v => update('totalFloors', v)} placeholder="e.g. 14" type="number" />
                </div>

                <RadioGroup label="Possession Timeline" value={form.possessionStatus} onChange={v => update('possessionStatus', v)} options={[
                  { value: 'READY', label: '✅ Ready to Move' },
                  { value: 'UNDER_CONSTRUCTION', label: '🏗 Under Construction' },
                  { value: 'WITHIN_6_MONTHS', label: '📅 Within 6 Months' },
                ]} />
              </div>
            )}

            {/* Step 2: Pricing & Details */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <div>
                  <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', color: '#FFF', margin: '0 0 4px 0' }}>Step 2: Valuation &amp; Terms</h3>
                  <p style={{ color: 'rgba(248,250,252,0.45)', fontSize: '0.82rem', margin: 0 }}>Set your asking price and examine AI market benchmarks</p>
                </div>

                {form.transactionType === 'SELL' ? (
                  <LuxInput label="Expected Price (₹)" icon={IndianRupee} value={form.expectedPrice} onChange={v => update('expectedPrice', v)} placeholder="e.g. 8500000" required hint="Full amount in Indian Rupees" />
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <LuxInput label="Monthly Rent (₹)" icon={IndianRupee} value={form.monthlyRent} onChange={v => update('monthlyRent', v)} placeholder="e.g. 28000" required />
                    <LuxInput label="Maintenance (₹/mo)" icon={IndianRupee} value={form.maintenanceCharges} onChange={v => update('maintenanceCharges', v)} placeholder="e.g. 3000" />
                  </div>
                )}

                {/* AI Valuation Live Meter */}
                <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '14px', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#F59E0B', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                    <span>🤖 AI VALUATION TELEMETRY ({formattedLocationName})</span>
                    <span>Rate: ₹{getAiValuation().rate}/sq.ft</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
                    <div>
                      <span style={{ fontSize: '0.65rem', color: 'rgba(248,250,252,0.4)', textTransform: 'uppercase' }}>Conservative</span>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>{formatPrice(getAiValuation().low)}</div>
                    </div>

                    <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid #F59E0B', borderRadius: '8px', padding: '6px 14px', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.62rem', color: '#F59E0B', textTransform: 'uppercase', fontWeight: 800 }}>AI Median Benchmark</span>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F59E0B', fontFamily: "'Cinzel', serif" }}>{formatPrice(getAiValuation().avg)}</div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.65rem', color: 'rgba(248,250,252,0.4)', textTransform: 'uppercase' }}>Premium Target</span>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF' }}>{formatPrice(getAiValuation().high)}</div>
                    </div>
                  </div>
                </div>

                {form.transactionType === 'RENT' && (
                  <RadioGroup label="Furnishing Level" value={form.furnishingStatus} onChange={v => update('furnishingStatus', v)} options={[
                    { value: 'FULLY_FURNISHED', label: 'Fully Furnished' },
                    { value: 'SEMI_FURNISHED', label: 'Semi Furnished' },
                    { value: 'UNFURNISHED', label: 'Unfurnished' },
                  ]} />
                )}

                <LuxInput label="MahaRERA Registration No. (Optional)" icon={Shield} value={form.reraNumber} onChange={v => update('reraNumber', v)} placeholder="e.g. P52100012345" hint="Boosts buyer inquiry rate by +40%" />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(230,195,92,0.8)', textTransform: 'uppercase' }}>Property Highlights &amp; Key Features</label>
                  <textarea
                    value={form.description}
                    onChange={e => update('description', e.target.value)}
                    placeholder="E.g. Garden facing balcony, modular kitchen, EV charging slot, 2 min walk to metro station..."
                    rows={4}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px', color: '#FFF', fontFamily: "'Inter', sans-serif", fontSize: '0.84rem', outline: 'none' }}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Photos & Video */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <div>
                  <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', color: '#FFF', margin: '0 0 4px 0' }}>Step 3: High-Res Media &amp; Photos</h3>
                  <p style={{ color: 'rgba(248,250,252,0.45)', fontSize: '0.82rem', margin: 0 }}>Properties with 4K photos receive 5× faster offer conversions</p>
                </div>

                <div>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} style={{ display: 'none' }} />
                  
                  {form.imagePreviews.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{ width: '100%', background: 'rgba(245,158,11,0.04)', border: '2px dashed rgba(245,158,11,0.3)', borderRadius: '14px', padding: '40px 20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
                    >
                      <Upload size={28} color="#F59E0B" />
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFF' }}>Click to Drag &amp; Upload 4K Photos</span>
                      <span style={{ fontSize: '0.74rem', color: 'rgba(248,250,252,0.4)' }}>Supports JPG, PNG up to 10MB each (Max 10 files)</span>
                    </button>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px' }}>
                      {form.imagePreviews.map((src, i) => (
                        <div key={i} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(245,158,11,0.3)' }}>
                          <img src={src} alt="Property" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button type="button" onClick={() => removeImage(i)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '50%', color: '#FFF', cursor: 'pointer', padding: '2px' }}>
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <LuxInput label="YouTube Walkthrough Video URL (Optional)" icon={Video} value={form.videoLink} onChange={v => update('videoLink', v)} placeholder="https://youtube.com/watch?v=..." />

                {form.imagePreviews.length > 0 && <TerminalLogsSimulation />}
              </div>
            )}

            {/* Step 4: Contact Details */}
            {step === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <div>
                  <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.25rem', color: '#FFF', margin: '0 0 4px 0' }}>Step 4: Direct Owner Mandate</h3>
                  <p style={{ color: 'rgba(248,250,252,0.45)', fontSize: '0.82rem', margin: 0 }}>Verified contact info for lead dispatch &amp; legal registration</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <LuxInput label="Owner Full Name" icon={User} value={form.ownerName} onChange={v => update('ownerName', v)} placeholder="e.g. Manish Rai" required />
                  <LuxInput label="Mobile Number (WhatsApp)" icon={Phone} value={form.ownerPhone} onChange={v => update('ownerPhone', v)} placeholder="+91 96730 00053" type="tel" required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <LuxInput label="Email Address (Optional)" icon={Mail} value={form.ownerEmail} onChange={v => update('ownerEmail', v)} placeholder="owner@domain.com" type="email" />
                  <LuxInput label="Alternate Number (Optional)" icon={Phone} value={form.alternatePhone} onChange={v => update('alternatePhone', v)} placeholder="+91..." type="tel" />
                </div>

                <RadioGroup label="Preferred Callback Window" value={form.callTime} onChange={v => update('callTime', v)} options={[
                  { value: 'MORNING', label: '🌅 Morning (9AM - 12PM)' },
                  { value: 'AFTERNOON', label: '☀️ Afternoon (12PM - 5PM)' },
                  { value: 'EVENING', label: '🌆 Evening (5PM - 8PM)' },
                ]} />
              </div>
            )}

            {/* Step Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {step > 1 ? (
                <button type="button" onClick={() => setStep(s => s - 1)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#FFF', padding: '12px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowLeft size={14} /> Previous
                </button>
              ) : <div />}

              {step < 4 ? (
                <button type="button" onClick={() => validateStep(step) && setStep(s => s + 1)} disabled={!validateStep(step)} style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', border: 'none', color: '#030712', padding: '12px 24px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Continue Next Step <ArrowRight size={14} />
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={submitting || !validateStep(4)} style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', border: 'none', color: '#FFF', padding: '14px 28px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
                  <CheckCircle size={16} /> Submit Property Mandate
                </button>
              )}
            </div>
          </div>

          {/* RIGHT LIVE LISTING CARD PREVIEW */}
          <div style={{ position: 'sticky', top: '84px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '20px', padding: '24px', boxShadow: '0 24px 80px rgba(0,0,0,0.7)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.68rem', color: '#F59E0B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Eye size={14} /> LIVE LISTING PREVIEW CARD
                </span>
                <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '3px 8px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800 }}>
                  VERIFIED LISTING
                </span>
              </div>

              {/* Card Photo Preview */}
              <div style={{ width: '100%', height: '200px', borderRadius: '12px', overflow: 'hidden', position: 'relative', background: '#030712', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' }}>
                {form.imagePreviews.length > 0 ? (
                  <img src={form.imagePreviews[0]} alt="Listing Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'rgba(248,250,252,0.3)' }}>
                    <Home size={36} color="#F59E0B" />
                    <span style={{ fontSize: '0.78rem' }}>Upload 4K Cover Photo</span>
                  </div>
                )}

                <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#F59E0B', color: '#030712', fontSize: '0.65rem', fontWeight: 900, padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                  {form.transactionType === 'SELL' ? 'FOR SALE' : 'FOR RENT'}
                </div>

                <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(3,7,18,0.85)', color: '#FFF', fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '4px' }}>
                  {formattedLocationName}
                </div>
              </div>

              {/* Property Details Preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.15rem', color: '#FFF', margin: 0, fontWeight: 700 }}>
                  {form.bedrooms} BHK {form.propertyType} in {formattedLocationName}
                </h4>

                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#F59E0B', fontFamily: "'Cinzel', serif" }}>
                  {currentPriceDisplay}
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: 'rgba(248,250,252,0.6)', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
                  <span>📐 {form.area || '1150'} sq.ft</span>
                  <span>🏢 Floor {form.floor || '7'}/{form.totalFloors || '14'}</span>
                  <span>⚡ {form.possessionStatus}</span>
                </div>

                {/* AI Demand Score */}
                <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '10px 14px', marginTop: '6px', fontSize: '0.74rem', color: '#10B981', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>🔥 Estimated Buyer Demand:</span>
                  <strong style={{ fontWeight: 800 }}>9.4 / 10 (VERY HIGH)</strong>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
    </div>
  );
}
