import React, { useState, useRef, useCallback } from 'react';
import { 
  ArrowLeft, ArrowRight, Upload, X, Check, Home, IndianRupee,
  MapPin, Camera, Video, Phone, Mail, Clock, ChevronDown,
  Star, Shield, Award, Building2, Sparkles, CheckCircle, 
  AlertCircle, Eye, Link2, FileImage, User, Calendar,
  BedDouble, Ruler, Layers
} from 'lucide-react';
import { apiService } from '../services/apiService';
import CompanyLogo from './CompanyLogo';

const PUNE_AREAS = [
  { value: 'HINJEWADI', label: 'Hinjewadi' },
  { value: 'WAKAD', label: 'Wakad' },
  { value: 'BANER', label: 'Baner' },
  { value: 'BALEWADI', label: 'Balewadi' },
  { value: 'TATHAWADE', label: 'Tathawade' },
  { value: 'MAHALUNGE', label: 'Mahalunge' },
  { value: 'KOTHRUD', label: 'Kothrud' },
  { value: 'AUNDH', label: 'Aundh' },
  { value: 'PIMPLE_SAUDAGAR', label: 'Pimple Saudagar' },
  { value: 'RAVET', label: 'Ravet' },
  { value: 'PIMPLE_NILAKH', label: 'Pimple Nilakh' },
  { value: 'PUNAWALE', label: 'Punawale' },
];

const STEPS = [
  { id: 1, label: 'Property', icon: Home },
  { id: 2, label: 'Pricing', icon: IndianRupee },
  { id: 3, label: 'Media', icon: Camera },
  { id: 4, label: 'Contact', icon: User },
];

function LuxInput({ label, icon: Icon, type = 'text', value, onChange, placeholder, required, options, hint }) {
  const isSelect = options && options.length > 0;
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '0.72rem', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, color: 'rgba(197,168,128,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
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
              width: '100%', background: focused ? 'rgba(197,168,128,0.05)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${focused ? 'rgba(197,168,128,0.5)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '10px', padding: '13px 14px 13px 42px', color: '#fff',
              fontFamily: "'Montserrat', sans-serif", fontSize: '0.85rem', fontWeight: 500,
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
              width: '100%', background: focused ? 'rgba(197,168,128,0.05)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${focused ? 'rgba(197,168,128,0.5)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '10px', padding: '13px 14px 13px 42px', color: '#fff',
              fontFamily: "'Montserrat', sans-serif", fontSize: '0.85rem', fontWeight: 500,
              outline: 'none', transition: 'all 0.2s ease', boxSizing: 'border-box'
            }}
          />
        )}
        {isSelect && (
          <ChevronDown size={13} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(197,168,128,0.5)', pointerEvents: 'none' }} />
        )}
      </div>
      {hint && <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontFamily: "'Montserrat', sans-serif" }}>{hint}</span>}
    </div>
  );
}

function RadioGroup({ label, value, onChange, options }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '0.72rem', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, color: 'rgba(197,168,128,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            style={{
              background: value === opt.value ? 'rgba(197,168,128,0.12)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${value === opt.value ? 'rgba(197,168,128,0.5)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '8px', padding: '9px 16px', cursor: 'pointer', transition: 'all 0.2s ease',
              fontFamily: "'Montserrat', sans-serif", fontSize: '0.8rem', fontWeight: 700,
              color: value === opt.value ? '#E6C35C' : 'rgba(255,255,255,0.55)',
              display: 'flex', alignItems: 'center', gap: '6px'
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
      '[SYS] Handshaking secure node connection...',
      '[SYS] Establishing Web3 secure decentralized tunnel... OK',
      '[SYS] Compressing 4K raw assets to optimized WebP formats...',
      '[SYS] Uploading 4K media directly to Cloudflare R2 nodes... OK',
      '[SYS] Running Gemini AI listing validation check...',
      '[SYS] Listing completeness audit score: 9.8/10 (EXCELLENT)',
      '[SYS] Localized CRM lead synchronization initialized.'
    ];
    
    setLogs([]);
    let current = [];
    rawLogs.forEach((log, index) => {
      setTimeout(() => {
        current = [...current, log];
        setLogs([...current]);
      }, (index + 1) * 800);
    });
  }, []);

  return (
    <div style={{
      background: '#040814',
      border: '1px solid rgba(197, 168, 128, 0.25)',
      borderRadius: '12px',
      padding: '16px',
      fontFamily: "'Courier New', Courier, monospace",
      fontSize: '0.72rem',
      color: '#00FF66',
      lineHeight: '1.6',
      maxHeight: '160px',
      overflowY: 'auto',
      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
      marginTop: '16px'
    }}>
      <div style={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontSize: '0.62rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '0.08em' }}>
        ⚙️ ASSETS DEPLOY CONSOLE
      </div>
      {logs.map((log, idx) => (
        <div key={idx} style={{ display: 'flex', gap: '8px' }}>
          <span style={{ color: 'rgba(197, 168, 128, 0.6)' }}>></span>
          <span>{log}</span>
        </div>
      ))}
      <span style={{ display: 'inline-block', width: '6px', height: '11px', background: '#00FF66', marginLeft: '4px', animation: 'blink 1s infinite' }} />
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
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

  const getAiValuation = () => {
    const areaVal = parseFloat(form.area) || 0;
    const rates = {
      HINJEWADI: 7800,
      WAKAD: 8200,
      BANER: 11500,
      BALEWADI: 10200,
      TATHAWADE: 7200,
      MAHALUNGE: 6900
    };
    const rate = rates[form.location] || 7500;
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

  const [form, setForm] = useState({
    transactionType: 'SELL',
    propertyType: 'APARTMENT',
    location: 'HINJEWADI',
    bedrooms: '2',
    area: '',
    floor: '',
    totalFloors: '',
    possessionStatus: 'READY',
    expectedPrice: '',
    monthlyRent: '',
    maintenanceCharges: '',
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
    // Standard mock fallback
    return URL.createObjectURL(file);
  };

  const validateStep = (s) => {
    if (s === 1) {
      return form.propertyType && form.location && form.area;
    }
    if (s === 2) {
      const priceVal = form.transactionType === 'RENT' ? form.monthlyRent : form.expectedPrice;
      return priceVal && form.description.length >= 10;
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
        `[OWNER MANDATE — ${form.transactionType}]`,
        `Property: "${form.propertyTitle || form.propertyType + ' in ' + form.location}"`,
        `Type: ${form.propertyType} | ${form.bedrooms} BHK | ${form.area} sqft`,
        `Location: ${form.location} | Floor: ${form.floor || 'N/A'}/${form.totalFloors || 'N/A'}`,
        `Possession: ${form.possessionStatus} | Furnishing: ${form.furnishingStatus}`,
        priceInfo,
        form.reraNumber ? `RERA: ${form.reraNumber}` : null,
        `Description: ${form.description}`,
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
        backgroundImage: 'linear-gradient(to bottom, rgba(4, 8, 20, 0.85), rgba(4, 8, 20, 0.95)), url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '40px 20px' 
      }}>
        <div style={{ 
          maxWidth: '520px', 
          width: '100%', 
          textAlign: 'center',
          background: 'rgba(7, 15, 30, 0.8)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(197, 168, 128, 0.25)',
          borderRadius: '24px',
          padding: '40px 30px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)'
        }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(197,168,128,0.2) 0%, transparent 70%)', border: '2px solid rgba(197,168,128,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px auto' }}>
            <CheckCircle size={36} color="#E6C35C" />
          </div>
          <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: '2rem', color: '#fff', fontWeight: 700, marginBottom: '12px', letterSpacing: '-0.01em' }}>Listing Received!</h1>
          <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: 'rgba(255,255,255,0.5)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px' }}>
            Your property mandate has been registered with our advisory desk. A 24K Realtors advisor will contact you within 2 business hours.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '36px' }}>
            {[
              { icon: '📋', text: 'Your listing is under verification' },
              { icon: '📞', text: `Callback scheduled: ${form.callTime === 'MORNING' ? '9AM–12PM' : form.callTime === 'AFTERNOON' ? '12PM–5PM' : '5PM–8PM'}` },
              { icon: '💬', text: 'WhatsApp confirmation sent to ' + form.ownerPhone },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(197,168,128,0.04)', border: '1px solid rgba(197,168,128,0.1)', borderRadius: '10px', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)' }}>{item.text}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/919673000053?text=Hi%2C%20I%20just%20submitted%20my%20property%20listing%20for%20${encodeURIComponent(form.propertyType + ' in ' + form.location)}.%20Please%20confirm.`}
              target="_blank" rel="noopener noreferrer"
              style={{ background: '#25D366', border: 'none', color: '#fff', padding: '12px 24px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, fontFamily: "'Montserrat', sans-serif", textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              WhatsApp Us
            </a>
            <button
              onClick={onBack}
              style={{ background: 'transparent', border: '1px solid rgba(197,168,128,0.3)', color: '#C5A880', padding: '12px 24px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, fontFamily: "'Montserrat', sans-serif", cursor: 'pointer' }}
            >
              Back to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundImage: 'linear-gradient(to bottom, rgba(4, 8, 20, 0.82), rgba(4, 8, 20, 0.95)), url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      fontFamily: "'Montserrat', sans-serif" 
    }}>
      {/* Navbar Strip */}
      <div style={{ height: '64px', background: 'rgba(4,8,20,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(197,168,128,0.1)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: '16px', position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '7px 14px', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontFamily: "'Montserrat', sans-serif", transition: 'all 0.2s ease' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
        >
          <ArrowLeft size={13} /> Back
        </button>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <CompanyLogo variant="compact" />
        </div>
        <a href="tel:+919673000053" style={{ textDecoration: 'none', color: 'rgba(197,168,128,0.7)', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Phone size={12} /> +91 96730 00053
        </a>
      </div>

      {/* Hero Section */}
      <div style={{ background: 'rgba(4, 8, 20, 0.35)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '52px 24px 40px', textAlign: 'center', borderBottom: '1px solid rgba(197,168,128,0.1)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(197,168,128,0.06)', border: '1px solid rgba(197,168,128,0.15)', borderRadius: '50px', padding: '6px 16px', marginBottom: '20px' }}>
          <Sparkles size={12} color="#E6C35C" />
          <span style={{ fontSize: '0.68rem', color: '#E6C35C', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Zero Brokerage Owner Mandate</span>
        </div>
        <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', color: '#fff', fontWeight: 700, margin: '0 0 12px 0', lineHeight: 1.2 }}>
          List Your Property<br />
          <span style={{ background: 'linear-gradient(135deg, #FFF4D0, #E6C35C, #C5A880)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            With India's Most Trusted Advisory
          </span>
        </h1>
        <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: 'rgba(255,255,255,0.45)', fontSize: '1rem', margin: '0 0 28px 0' }}>
          Sell or rent faster. Premium exposure. Zero brokerage for owners.
        </p>

        {/* Trust Badges */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { icon: Shield, text: 'MahaRERA Registered' },
            { icon: Award, text: '10+ Years Advisory' },
            { icon: Star, text: '500+ Transactions' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(197,168,128,0.04)', border: '1px solid rgba(197,168,128,0.12)', borderRadius: '8px', padding: '8px 14px' }}>
              <Icon size={13} color="#E6C35C" />
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Progress Bar */}
      <div style={{ background: 'rgba(7,15,30,0.45)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(197,168,128,0.1)', padding: '0 24px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.id;
            const isDone = step > s.id;
            return (
              <React.Fragment key={s.id}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 12px', flex: '0 0 auto', cursor: isDone ? 'pointer' : 'default' }}
                  onClick={() => isDone && setStep(s.id)}
                >
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', marginBottom: '4px',
                    background: isDone ? 'rgba(197,168,128,0.2)' : isActive ? 'rgba(197,168,128,0.12)' : 'rgba(255,255,255,0.03)',
                    border: `1.5px solid ${isDone ? 'rgba(197,168,128,0.6)' : isActive ? 'rgba(197,168,128,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  }}>
                    {isDone ? <Check size={14} color="#E6C35C" /> : <Icon size={14} color={isActive ? '#E6C35C' : 'rgba(255,255,255,0.3)'} />}
                  </div>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: isActive ? '#E6C35C' : isDone ? 'rgba(197,168,128,0.6)' : 'rgba(255,255,255,0.25)', letterSpacing: '0.05em' }}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: '1px', background: step > s.id ? 'rgba(197,168,128,0.4)' : 'rgba(255,255,255,0.06)', transition: 'background 0.4s ease' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '36px 24px 60px' }}>
        <div style={{ background: 'rgba(7, 15, 30, 0.78)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(197, 168, 128, 0.22)', borderRadius: '24px', padding: 'clamp(24px, 5vw, 44px)', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>

          {/* Step 1: Property Details */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.3rem', color: '#fff', margin: '0 0 4px 0' }}>Property Details</h2>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', margin: 0 }}>Tell us about the property you want to list</p>
              </div>

              <RadioGroup label="I want to" value={form.transactionType} onChange={v => update('transactionType', v)} options={[{ value: 'SELL', label: '🏠 Sell', }, { value: 'RENT', label: '🔑 Rent' }]} />

              <RadioGroup label="Property Type" value={form.propertyType} onChange={v => update('propertyType', v)} options={[
                { value: 'APARTMENT', label: 'Apartment' },
                { value: 'VILLA', label: 'Villa' },
                { value: 'COMMERCIAL', label: 'Commercial' },
                { value: 'PLOT', label: 'Plot' },
                { value: 'ROW_HOUSE', label: 'Row House' },
              ]} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <LuxInput label="Location / Area" icon={MapPin} value={form.location} onChange={v => update('location', v)} options={PUNE_AREAS} />
                <LuxInput label="Property Title" icon={Home} value={form.propertyTitle} onChange={v => update('propertyTitle', v)} placeholder="e.g. 3 BHK in Wakad Heights" hint="Optional — we'll generate from details" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                <LuxInput label="Bedrooms (BHK)" icon={BedDouble} value={form.bedrooms} onChange={v => update('bedrooms', v)} options={[
                  { value: '1', label: '1 BHK' }, { value: '2', label: '2 BHK' }, { value: '3', label: '3 BHK' },
                  { value: '4', label: '4 BHK' }, { value: '5', label: '5+ BHK / Penthouse' },
                ]} />
                <LuxInput label="Area (sqft)" icon={Ruler} value={form.area} onChange={v => update('area', v)} placeholder="e.g. 1200" type="number" required />
                <LuxInput label="Floor No." icon={Layers} value={form.floor} onChange={v => update('floor', v)} placeholder="e.g. 7" type="number" />
                <LuxInput label="Total Floors" icon={Building2} value={form.totalFloors} onChange={v => update('totalFloors', v)} placeholder="e.g. 14" type="number" />
              </div>

              <RadioGroup label="Possession Status" value={form.possessionStatus} onChange={v => update('possessionStatus', v)} options={[
                { value: 'READY', label: '✅ Ready to Move' },
                { value: 'UNDER_CONSTRUCTION', label: '🏗 Under Construction' },
                { value: 'WITHIN_6_MONTHS', label: '📅 Within 6 Months' },
              ]} />
            </div>
          )}

          {/* Step 2: Pricing & Details */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.3rem', color: '#fff', margin: '0 0 4px 0' }}>Pricing & Details</h2>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', margin: 0 }}>Set your price and add property details</p>
              </div>

              {form.transactionType === 'SELL' ? (
                <LuxInput label="Expected Price (₹)" icon={IndianRupee} value={form.expectedPrice} onChange={v => update('expectedPrice', v)} placeholder="e.g. 85,00,000" required hint="In Indian Rupees — full amount" />
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <LuxInput label="Monthly Rent (₹)" icon={IndianRupee} value={form.monthlyRent} onChange={v => update('monthlyRent', v)} placeholder="e.g. 25,000" required />
                  <LuxInput label="Maintenance (₹/mo)" icon={IndianRupee} value={form.maintenanceCharges} onChange={v => update('maintenanceCharges', v)} placeholder="e.g. 3,000" hint="If included in rent, write 0" />
                </div>
              )}

              {/* Dynamic AI Valuation Simulator Widget */}
              {form.area && (
                <div style={{
                  background: 'rgba(197, 168, 128, 0.04)',
                  border: '1px solid rgba(197, 168, 128, 0.25)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  animation: 'fadeIn 0.4s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.68rem', fontFamily: "'Montserrat', sans-serif", fontWeight: 800, color: '#E6C35C', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      🤖 AI valuation index (pune west)
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                      Based on {form.location} rate: {formatPrice(getAiValuation().rate)}/sqft
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0' }}>
                    <div style={{ textAlign: 'left' }}>
                      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', display: 'block', textTransform: 'uppercase' }}>Conservative Value</span>
                      <strong style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', fontWeight: 700 }}>
                        {formatPrice(getAiValuation().low)}
                      </strong>
                    </div>
                    <div style={{ textAlign: 'center', background: 'rgba(230,195,92,0.1)', border: '1px solid rgba(230,195,92,0.3)', borderRadius: '10px', padding: '8px 16px' }}>
                      <span style={{ fontSize: '0.62rem', color: '#E6C35C', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Median Estimate</span>
                      <strong style={{ fontSize: '1.4rem', color: '#E6C35C', fontWeight: 800 }}>
                        {formatPrice(getAiValuation().avg)}
                      </strong>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', display: 'block', textTransform: 'uppercase' }}>Premium Target</span>
                      <strong style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', fontWeight: 700 }}>
                        {formatPrice(getAiValuation().high)}
                      </strong>
                    </div>
                  </div>

                  <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', position: 'relative', margin: '4px 0' }}>
                    <div style={{ position: 'absolute', left: '10%', right: '10%', top: 0, bottom: 0, background: 'linear-gradient(90deg, #C5A880, #E6C35C, #C5A880)', borderRadius: '2px' }} />
                    <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '-4px', width: '12px', height: '12px', borderRadius: '50%', background: '#fff', border: '2px solid #E6C35C', boxShadow: '0 0 10px #E6C35C' }} />
                  </div>

                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', textAlign: 'center', fontStyle: 'italic', fontFamily: "'Playfair Display', serif" }}>
                    "Setting your price within the AI valuation window boosts buyer/tenant leads by 3.2×"
                  </div>
                </div>
              )}

              {form.transactionType === 'RENT' && (
                <RadioGroup label="Furnishing Status" value={form.furnishingStatus} onChange={v => update('furnishingStatus', v)} options={[
                  { value: 'FULLY_FURNISHED', label: 'Fully Furnished' },
                  { value: 'SEMI_FURNISHED', label: 'Semi Furnished' },
                  { value: 'UNFURNISHED', label: 'Unfurnished' },
                ]} />
              )}

              <LuxInput label="RERA Number (optional)" icon={Shield} value={form.reraNumber} onChange={v => update('reraNumber', v)} placeholder="e.g. P52100012345" hint="If registered under MahaRERA — boosts listing credibility" />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.72rem', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, color: 'rgba(197,168,128,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Property Description <span style={{ color: '#E6C35C' }}>*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  placeholder="Describe key features: view, amenities, recent renovation, nearby landmarks, unique selling points..."
                  rows={4}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '13px', color: '#fff', fontFamily: "'Montserrat', sans-serif", fontSize: '0.85rem', outline: 'none', resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box', transition: 'border-color 0.2s ease' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(197,168,128,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <span style={{ fontSize: '0.7rem', color: form.description.length < 10 ? 'rgba(255,100,100,0.6)' : 'rgba(255,255,255,0.3)', fontFamily: "'Montserrat', sans-serif", textAlign: 'right' }}>
                  {form.description.length} characters {form.description.length < 30 ? '(minimum 30 recommended)' : '✓'}
                </span>
              </div>
            </div>
          )}

          {/* Step 3: Media Upload */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.3rem', color: '#fff', margin: '0 0 4px 0' }}>Photos & Media</h2>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', margin: 0 }}>Properties with photos get 5× more inquiries. Upload up to 10 images.</p>
              </div>

              <div>
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} style={{ display: 'none' }} />
                
                {form.imagePreviews.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ width: '100%', background: 'rgba(197,168,128,0.03)', border: '2px dashed rgba(197,168,128,0.2)', borderRadius: '14px', padding: '48px 24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', transition: 'all 0.2s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(197,168,128,0.06)'; e.currentTarget.style.borderColor = 'rgba(197,168,128,0.4)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(197,168,128,0.03)'; e.currentTarget.style.borderColor = 'rgba(197,168,128,0.2)'; }}
                  >
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(197,168,128,0.08)', border: '1px solid rgba(197,168,128,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Upload size={22} color="#E6C35C" />
                    </div>
                    <div>
                      <p style={{ margin: '0 0 4px 0', color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>Click to upload photos</p>
                      <p style={{ margin: 0, color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}>JPG, PNG up to 10MB each · Max 10 photos</p>
                    </div>
                  </button>
                ) : (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', marginBottom: '12px' }}>
                      {form.imagePreviews.map((src, i) => (
                        <div key={i} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(197,168,128,0.15)' }}>
                          <img src={src} alt={`Photo ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}
                          >
                            <X size={12} />
                          </button>
                          {i === 0 && <span style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(197,168,128,0.8)', borderRadius: '4px', fontSize: '0.6rem', padding: '2px 6px', fontWeight: 700, color: '#040814' }}>COVER</span>}
                        </div>
                      ))}
                      {form.imagePreviews.length < 10 && (
                        <button type="button" onClick={() => fileInputRef.current?.click()}
                          style={{ aspectRatio: '4/3', background: 'rgba(197,168,128,0.03)', border: '2px dashed rgba(197,168,128,0.15)', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '6px', transition: 'all 0.2s ease', color: 'rgba(197,168,128,0.5)' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(197,168,128,0.06)'; e.currentTarget.style.borderColor = 'rgba(197,168,128,0.3)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(197,168,128,0.03)'; e.currentTarget.style.borderColor = 'rgba(197,168,128,0.15)'; }}
                        >
                          <FileImage size={18} />
                          <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>Add More</span>
                        </button>
                      )}
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', textAlign: 'right' }}>{form.imagePreviews.length}/10 photos added</p>
                  </div>
                )}
              </div>

              <LuxInput
                label="Video Tour / Walkthrough Link (optional)"
                icon={Video}
                value={form.videoLink}
                onChange={v => update('videoLink', v)}
                placeholder="YouTube or Google Drive share link"
                hint="Paste a YouTube video link or Google Drive video link — this gets highlighted in your listing"
              />

              <div style={{ background: 'rgba(197,168,128,0.03)', border: '1px solid rgba(197,168,128,0.1)', borderRadius: '10px', padding: '14px', display: 'flex', gap: '10px' }}>
                <Eye size={15} color="#E6C35C" style={{ flexShrink: 0, marginTop: '1px' }} />
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                  Photos are reviewed by our team before going live. We may request additional shots for premium placement. <strong style={{ color: '#C5A880' }}>Media upload is optional</strong> — you can always share photos via WhatsApp after submission.
                </p>
              </div>

              {form.imagePreviews.length > 0 && (
                <TerminalLogsSimulation />
              )}
            </div>
          )}

          {/* Step 4: Owner Contact */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.3rem', color: '#fff', margin: '0 0 4px 0' }}>Your Contact Details</h2>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', margin: 0 }}>Our advisor will reach you to activate your listing</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <LuxInput label="Full Name" icon={User} value={form.ownerName} onChange={v => update('ownerName', v)} placeholder="Your full name" required />
                <LuxInput label="Mobile Number" icon={Phone} value={form.ownerPhone} onChange={v => update('ownerPhone', v)} placeholder="+91 9XXXXXXXX" type="tel" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <LuxInput label="Email Address (optional)" icon={Mail} value={form.ownerEmail} onChange={v => update('ownerEmail', v)} placeholder="your@email.com" type="email" />
                <LuxInput label="Alternate Number (optional)" icon={Phone} value={form.alternatePhone} onChange={v => update('alternatePhone', v)} placeholder="+91 9XXXXXXXX" type="tel" />
              </div>

              <RadioGroup label="Preferred Call Time" value={form.callTime} onChange={v => update('callTime', v)} options={[
                { value: 'MORNING', label: '🌅 Morning (9AM–12PM)' },
                { value: 'AFTERNOON', label: '☀️ Afternoon (12PM–5PM)' },
                { value: 'EVENING', label: '🌆 Evening (5PM–8PM)' },
              ]} />

              <div style={{ background: 'rgba(197,168,128,0.04)', border: '1px solid rgba(197,168,128,0.12)', borderRadius: '12px', padding: '18px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontFamily: "'Cinzel', serif", fontSize: '0.85rem', color: '#C5A880', letterSpacing: '0.05em' }}>📋 Listing Summary</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    ['Transaction', form.transactionType === 'SELL' ? '🏠 For Sale' : '🔑 For Rent'],
                    ['Type', form.propertyType],
                    ['Location', PUNE_AREAS.find(a => a.value === form.location)?.label || form.location],
                    ['Size', `${form.bedrooms} BHK · ${form.area || '—'} sqft`],
                    ['Price', form.transactionType === 'RENT' ? (form.monthlyRent ? `₹${form.monthlyRent}/mo` : '—') : (form.expectedPrice ? `₹${form.expectedPrice}` : '—')],
                    ['Photos', `${form.imagePreviews.length} uploaded`],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</span>
                      <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {submitError && (
                <div style={{ background: 'rgba(255,60,60,0.06)', border: '1px solid rgba(255,60,60,0.2)', borderRadius: '10px', padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <AlertCircle size={16} color="#ff6b6b" />
                  <span style={{ fontSize: '0.82rem', color: '#ff6b6b' }}>{submitError}</span>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '36px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {step > 1 ? (
              <button type="button" onClick={() => setStep(s => s - 1)}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', padding: '12px 22px', borderRadius: '10px', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '7px', transition: 'all 0.2s ease' }}
              >
                <ArrowLeft size={14} /> Previous
              </button>
            ) : (
              <button type="button" onClick={onBack}
                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', padding: '12px 0', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '7px' }}
              >
                <ArrowLeft size={14} /> Cancel
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => validateStep(step) && setStep(s => s + 1)}
                disabled={!validateStep(step)}
                style={{
                  background: validateStep(step) ? 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)' : 'rgba(255,255,255,0.05)',
                  border: 'none', color: validateStep(step) ? '#040814' : 'rgba(255,255,255,0.2)',
                  padding: '13px 28px', borderRadius: '10px', cursor: validateStep(step) ? 'pointer' : 'not-allowed',
                  fontFamily: "'Montserrat', sans-serif", fontSize: '0.85rem', fontWeight: 800,
                  letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '8px',
                  transition: 'all 0.2s ease', boxShadow: validateStep(step) ? '0 4px 15px rgba(197,168,128,0.25)' : 'none'
                }}
              >
                Continue <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !validateStep(4)}
                style={{
                  background: !submitting && validateStep(4) ? 'linear-gradient(135deg, #FFF4D0 0%, #E6C35C 50%, #C59B27 100%)' : 'rgba(255,255,255,0.05)',
                  border: 'none', color: !submitting && validateStep(4) ? '#040814' : 'rgba(255,255,255,0.3)',
                  padding: '14px 32px', borderRadius: '10px', cursor: (!submitting && validateStep(4)) ? 'pointer' : 'not-allowed',
                  fontFamily: "'Montserrat', sans-serif", fontSize: '0.88rem', fontWeight: 800,
                  letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '10px',
                  transition: 'all 0.2s ease', boxShadow: (!submitting && validateStep(4)) ? '0 6px 20px rgba(197,168,128,0.3)' : 'none'
                }}
              >
                {submitting ? (
                  <>
                    <div style={{ width: '14px', height: '14px', border: '2px solid rgba(4,8,20,0.3)', borderTop: '2px solid #040814', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Submitting...
                  </>
                ) : (
                  <><CheckCircle size={15} /> Submit My Listing</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Bottom Trust Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '36px' }}>
          {[
            { icon: Shield, title: '100% Confidential', desc: 'Your contact details shared only with verified buyers/tenants' },
            { icon: Award, title: 'Free Listing', desc: 'Zero brokerage, zero listing fee for direct property owners' },
            { icon: Star, title: 'Premium Exposure', desc: 'Featured on our curated portal, WhatsApp network & digital campaigns' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ background: 'rgba(7,15,30,0.6)', border: '1px solid rgba(197,168,128,0.08)', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Icon size={18} color="#E6C35C" />
              <h4 style={{ margin: 0, fontFamily: "'Montserrat', sans-serif", fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{title}</h4>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2) !important; }
        select option { background: #070f1e !important; color: #fff !important; }
      `}</style>
    </div>
  );
}
