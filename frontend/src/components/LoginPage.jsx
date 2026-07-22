import React, { useState, useRef, useEffect, useCallback } from 'react';
import { signInWithGoogle, signInWithMicrosoft } from '../services/firebaseConfig';

/* ═══════════════════════════════════════════════════════════════════════════
   24K Realtors — SaaS-Grade Full-Page Login
   Flow: Identifier → OTP  (or)  Identifier → Password
   Social: Google + Microsoft
═══════════════════════════════════════════════════════════════════════════ */

const GOLD = '#D4AF37';
const GOLD_GLOW = 'rgba(212,175,55,0.18)';
const DARK_BG = '#060D1A';
const CARD_BG = 'rgba(10,18,35,0.85)';

// ─── API helper ──────────────────────────────────────────────────────────────
const getApiBase = () => {
  const h = window.location.hostname;
  if (h === 'localhost' || h === '127.0.0.1') return 'http://localhost:8080/api/v1';
  if (h.startsWith('192.168.') || h.startsWith('10.') || h.startsWith('172.'))
    return `http://${h}:8080/api/v1`;
  return 'https://twentyfourk-backend-production.up.railway.app/api/v1';
};

async function apiPost(path, body) {
  const res = await fetch(`${getApiBase()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  if (!res.ok) throw new Error(typeof data === 'string' ? data : data?.message || 'Request failed');
  return data;
}

// ─── Google SVG Icon ─────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// ─── Microsoft SVG Icon ───────────────────────────────────────────────────────
const MicrosoftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 23 23">
    <path fill="#f35325" d="M1 1h10v10H1z"/>
    <path fill="#81bc06" d="M12 1h10v10H12z"/>
    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
    <path fill="#ffba08" d="M12 12h10v10H12z"/>
  </svg>
);

// ─── OTP Input Grid ──────────────────────────────────────────────────────────
function OtpGrid({ value, onChange, disabled }) {
  const refs = useRef([]);
  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus();
  };
  const handleChange = (i, e) => {
    const ch = e.target.value.replace(/\D/g, '').slice(-1);
    const arr = value.split('');
    arr[i] = ch;
    const next = arr.join('');
    onChange(next);
    if (ch && i < 5) refs.current[i + 1]?.focus();
  };
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) { onChange(pasted.padEnd(6, '')); refs.current[Math.min(pasted.length, 5)]?.focus(); }
    e.preventDefault();
  };

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
      {[0,1,2,3,4,5].map(i => (
        <input
          key={i}
          ref={el => refs.current[i] = el}
          id={`otp-digit-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={value[i] || ''}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
          style={{
            width: '52px', height: '60px',
            textAlign: 'center', fontSize: '1.6rem', fontWeight: 700,
            background: value[i] ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.04)',
            border: `2px solid ${value[i] ? GOLD : 'rgba(255,255,255,0.12)'}`,
            borderRadius: '12px', color: '#fff',
            outline: 'none', transition: 'all 0.2s',
            fontFamily: "'Inter', monospace",
            cursor: disabled ? 'not-allowed' : 'text',
          }}
          onFocus={e => e.target.style.borderColor = GOLD}
          onBlur={e => e.target.style.borderColor = value[i] ? GOLD : 'rgba(255,255,255,0.12)'}
        />
      ))}
    </div>
  );
}

// ─── Main LoginPage Component ─────────────────────────────────────────────────
export default function LoginPage({ onSuccess }) {
  const [step, setStep] = useState('identify'); // identify | otp | password
  const [identifier, setIdentifier] = useState('');
  const [identifierType, setIdentifierType] = useState(''); // EMAIL | MOBILE
  const [maskedId, setMaskedId] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [hasPassword, setHasPassword] = useState(false);
  const [passwordlessOnly, setPasswordlessOnly] = useState(false);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const startResendTimer = useCallback(() => {
    setResendTimer(60);
    timerRef.current = setInterval(() => {
      setResendTimer(t => { if (t <= 1) { clearInterval(timerRef.current); return 0; } return t - 1; });
    }, 1000);
  }, []);

  const saveAuth = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userRole', data.role);
    localStorage.setItem('userFullName', data.fullName || data.username);
    localStorage.setItem('username', data.username);
    onSuccess(data);
  };

  // ── Step 1: Identify ────────────────────────────────────────────────────────
  const handleIdentify = async (e) => {
    e?.preventDefault();
    if (!identifier.trim()) { setError('Please enter your email or mobile number.'); return; }
    setLoading(true); setError('');
    try {
      const data = await apiPost('/auth/identify', { identifier: identifier.trim() });
      setIdentifierType(data.identifierType);
      setMaskedId(data.maskedIdentifier);
      setTempToken(data.tempToken);
      setHasPassword(data.hasPassword);
      setPasswordlessOnly(data.passwordlessEnabled);
      setDevOtp(data.devMockOtp || '');
      setStep('otp');
      startResendTimer();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  // ── Step 2a: Verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    if (otp.replace(/\D/g,'').length < 6) { setError('Please enter the 6-digit OTP.'); return; }
    setLoading(true); setError('');
    try {
      const data = await apiPost('/auth/verify-otp', { tempToken, otp: otp.replace(/\D/g,'') });
      saveAuth(data);
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally { setLoading(false); }
  };

  // Auto-submit when 6 digits filled
  useEffect(() => {
    if (step === 'otp' && otp.replace(/\D/g,'').length === 6 && !loading) {
      handleVerifyOtp();
    }
  }, [otp]);

  // ── Step 2b: Password Login ────────────────────────────────────────────────
  const handlePasswordLogin = async (e) => {
    e?.preventDefault();
    if (!password.trim()) { setError('Please enter your password.'); return; }
    setLoading(true); setError('');
    try {
      const data = await apiPost('/auth/login-password', { identifier: identifier.trim(), password });
      saveAuth(data);
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally { setLoading(false); }
  };

  // ── Resend OTP ─────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setOtp(''); setError(''); setLoading(true);
    try {
      const data = await apiPost('/auth/identify', { identifier: identifier.trim() });
      setTempToken(data.tempToken);
      setDevOtp(data.devMockOtp || '');
      startResendTimer();
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  // ── Instant Demo Login Helper ──────────────────────────────────────────────
  const handleQuickDemoLogin = (role = 'ADMIN') => {
    const demoData = {
      token: 'demo-jwt-token-24k-' + Date.now(),
      refreshToken: 'demo-refresh-token-' + Date.now(),
      role: role,
      fullName: role === 'ADMIN' ? '24K Admin Director' : '24K Senior Agent',
      username: role === 'ADMIN' ? 'admin@24krealtors.com' : 'agent@24krealtors.com',
    };
    saveAuth(demoData);
  };

  // ── Google OAuth ───────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setLoading(true); setError('');
    try {
      const { idToken } = await signInWithGoogle();
      const data = await apiPost('/auth/google-login', { credential: idToken });
      saveAuth(data);
    } catch (err) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        if (err?.code === 'auth/unauthorized-domain' || (err?.message && err.message.includes('unauthorized-domain'))) {
          setError(`Firebase Auth domain not whitelisted yet for [${window.location.hostname}]. Please use Email/Mobile OTP or click Quick Demo Access below.`);
        } else {
          setError(err.message || 'Google login failed.');
        }
      }
    } finally { setLoading(false); }
  };

  // ── Microsoft OAuth ────────────────────────────────────────────────────────
  const handleMicrosoft = async () => {
    setLoading(true); setError('');
    try {
      const { idToken } = await signInWithMicrosoft();
      const data = await apiPost('/auth/microsoft-login', { credential: idToken });
      saveAuth(data);
    } catch (err) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        if (err?.code === 'auth/unauthorized-domain' || (err?.message && err.message.includes('unauthorized-domain'))) {
          setError(`Firebase Auth domain not whitelisted yet for [${window.location.hostname}]. Please use Email/Mobile OTP or click Quick Demo Access below.`);
        } else {
          setError(err.message || 'Microsoft login failed.');
        }
      }
    } finally { setLoading(false); }
  };

  // ── Shared styles ──────────────────────────────────────────────────────────
  const inputStyle = {
    width: '100%', padding: '14px 18px', fontSize: '1rem',
    background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.12)',
    borderRadius: '12px', color: '#fff', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box',
  };
  const primaryBtn = {
    width: '100%', padding: '14px', fontSize: '1rem', fontWeight: 700,
    background: `linear-gradient(135deg, ${GOLD}, #b8940e)`,
    color: '#000', border: 'none', borderRadius: '12px', cursor: 'pointer',
    transition: 'opacity 0.2s, transform 0.15s', letterSpacing: '0.02em',
    fontFamily: "'Inter', sans-serif",
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
  };
  const ghostBtn = {
    width: '100%', padding: '13px', fontSize: '0.95rem', fontWeight: 600,
    background: 'rgba(255,255,255,0.05)', color: '#fff',
    border: '1.5px solid rgba(255,255,255,0.12)',
    borderRadius: '12px', cursor: 'pointer', transition: 'background 0.2s, border-color 0.2s',
    fontFamily: "'Inter', sans-serif",
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div id="login-page" style={{
      minHeight: '100vh', background: DARK_BG,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', -apple-system, sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-15%', left: '-10%',
          width: '55vw', height: '55vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)',
        }}/>
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-10%',
          width: '60vw', height: '60vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20,60,140,0.12) 0%, transparent 70%)',
        }}/>
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: '420px', margin: '20px',
        background: CARD_BG, backdropFilter: 'blur(24px)',
        border: '1px solid rgba(212,175,55,0.15)',
        borderRadius: '24px', padding: '44px 36px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.05)',
        position: 'relative', zIndex: 1,
      }}>
        {/* Logo + Brand */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '64px', height: '64px', borderRadius: '18px',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))',
            border: '1px solid rgba(212,175,55,0.3)', marginBottom: '16px',
          }}>
            <span style={{ fontSize: '2rem' }}>🏆</span>
          </div>
          <h1 style={{
            color: GOLD, fontFamily: "'Montserrat', serif",
            fontSize: '1.6rem', fontWeight: 800, margin: 0, letterSpacing: '0.08em',
          }}>24K REALTORS</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', margin: '6px 0 0', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Premium CRM Platform
          </p>
        </div>

        {/* ── STEP: IDENTIFY ─────────────────────────────────────────── */}
        {step === 'identify' && (
          <form onSubmit={handleIdentify}>
            <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, margin: '0 0 6px' }}>
              Sign in
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.87rem', margin: '0 0 24px' }}>
              Enter your email or mobile number
            </p>

            {/* Social buttons */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button type="button" id="btn-google-login" onClick={handleGoogle} disabled={loading}
                style={{ ...ghostBtn, flex: 1 }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <GoogleIcon /> Google
              </button>
              <button type="button" id="btn-microsoft-login" onClick={handleMicrosoft} disabled={loading}
                style={{ ...ghostBtn, flex: 1 }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              >
                <MicrosoftIcon /> Microsoft
              </button>
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }}/>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', letterSpacing: '0.1em' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }}/>
            </div>

            {/* Identifier input */}
            <div style={{ marginBottom: '16px', position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.35)', fontSize: '1.1rem', pointerEvents: 'none',
              }}>
                {identifier.includes('@') ? '✉' : identifier.replace(/\D/g,'').length > 3 ? '📱' : '✉'}
              </span>
              <input
                id="input-identifier"
                type="text"
                placeholder="Email or mobile number"
                value={identifier}
                onChange={e => { setIdentifier(e.target.value); setError(''); }}
                autoFocus
                autoComplete="username"
                style={{ ...inputStyle, paddingLeft: '42px' }}
                onFocus={e => { e.target.style.borderColor = GOLD; e.target.style.boxShadow = `0 0 0 3px ${GOLD_GLOW}`; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {error && <ErrorBanner msg={error} />}

            <button
              id="btn-continue"
              type="submit" disabled={loading || !identifier.trim()}
              style={{ ...primaryBtn, opacity: loading || !identifier.trim() ? 0.6 : 1 }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {loading ? <Spinner /> : <>Continue <span style={{ fontSize: '1.1rem' }}>→</span></>}
            </button>

            {/* Quick Demo Access Bar */}
            <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px dashed rgba(212,175,55,0.2)' }}>
              <div style={{ fontSize: '0.72rem', color: GOLD, textTransform: 'uppercase', letterSpacing: '0.12em', textAlign: 'center', marginBottom: '10px', fontWeight: 600 }}>
                ⚡ Quick Demo Access (1-Click)
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('ADMIN')}
                  style={{ flex: 1, padding: '9px', fontSize: '0.78rem', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', color: GOLD, borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}
                >
                  👑 Admin CRM
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('AGENT')}
                  style={{ flex: 1, padding: '9px', fontSize: '0.78rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}
                >
                  💼 Agent CRM
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ── STEP: OTP ────────────────────────────────────────────────── */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp}>
            <button type="button" onClick={() => { setStep('identify'); setError(''); setOtp(''); }}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '20px', padding: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              ← Back
            </button>

            <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, margin: '0 0 6px' }}>
              Enter verification code
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.87rem', margin: '0 0 28px' }}>
              {identifierType === 'EMAIL' ? '✉️' : '📱'} Sent to <strong style={{ color: 'rgba(255,255,255,0.75)' }}>{maskedId}</strong>
            </p>

            {devOtp && (
              <div style={{
                background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)',
                borderRadius: '10px', padding: '10px 14px', marginBottom: '20px',
                fontSize: '0.82rem', color: GOLD, display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span>🔧</span>
                <span>Dev OTP: <strong style={{ letterSpacing: '0.2em' }}>{devOtp}</strong></span>
              </div>
            )}

            <div style={{ marginBottom: '28px' }}>
              <OtpGrid value={otp} onChange={setOtp} disabled={loading} />
            </div>

            {error && <ErrorBanner msg={error} />}

            <button id="btn-verify-otp" type="submit" disabled={loading || otp.replace(/\D/g,'').length < 6}
              style={{ ...primaryBtn, opacity: loading || otp.replace(/\D/g,'').length < 6 ? 0.6 : 1, marginBottom: '14px' }}>
              {loading ? <Spinner /> : 'Verify & Sign In'}
            </button>

            {/* Resend */}
            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
              {resendTimer > 0
                ? `Resend in ${resendTimer}s`
                : <button type="button" onClick={handleResend} style={{ background: 'none', border: 'none', color: GOLD, cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}>Resend OTP</button>
              }
            </div>

            {/* Switch to password */}
            {hasPassword && !passwordlessOnly && (
              <div style={{ textAlign: 'center', marginTop: '14px' }}>
                <button type="button" id="btn-use-password" onClick={() => { setStep('password'); setError(''); setOtp(''); }}
                  style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.82rem' }}>
                  Use password instead →
                </button>
              </div>
            )}
          </form>
        )}

        {/* ── STEP: PASSWORD ───────────────────────────────────────────── */}
        {step === 'password' && (
          <form onSubmit={handlePasswordLogin}>
            <button type="button" onClick={() => { setStep('otp'); setError(''); setPassword(''); }}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '20px', padding: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              ← Back
            </button>

            <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, margin: '0 0 6px' }}>
              Enter your password
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.87rem', margin: '0 0 24px' }}>
              Signing in as <strong style={{ color: 'rgba(255,255,255,0.75)' }}>{maskedId}</strong>
            </p>

            <div style={{ marginBottom: '16px', position: 'relative' }}>
              <input
                id="input-password"
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                autoFocus
                autoComplete="current-password"
                onChange={e => { setPassword(e.target.value); setError(''); }}
                style={{ ...inputStyle, paddingRight: '48px' }}
                onFocus={e => { e.target.style.borderColor = GOLD; e.target.style.boxShadow = `0 0 0 3px ${GOLD_GLOW}`; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; }}
              />
              <button type="button" onClick={() => setShowPass(p => !p)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1rem', padding: 0 }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>

            {error && <ErrorBanner msg={error} />}

            <button id="btn-password-signin" type="submit" disabled={loading || !password.trim()}
              style={{ ...primaryBtn, opacity: loading || !password.trim() ? 0.6 : 1, marginBottom: '14px' }}>
              {loading ? <Spinner /> : 'Sign In'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <button type="button" id="btn-use-otp" onClick={() => { setStep('otp'); setError(''); setPassword(''); }}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.82rem' }}>
                Use OTP instead →
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.74rem', margin: '28px 0 0', letterSpacing: '0.05em' }}>
          Protected by 24K Realtors Security • Pune, India
        </p>
      </div>

      {/* Inter font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@700;800&display=swap');
        #login-page * { box-sizing: border-box; }
        #login-page input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function ErrorBanner({ msg }) {
  return (
    <div style={{
      background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
      borderRadius: '10px', padding: '10px 14px', marginBottom: '14px',
      color: '#fca5a5', fontSize: '0.84rem', display: 'flex', alignItems: 'flex-start', gap: '8px',
    }}>
      <span style={{ marginTop: '1px' }}>⚠️</span>
      <span>{msg}</span>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: '18px', height: '18px', border: '2.5px solid rgba(0,0,0,0.3)',
      borderTop: '2.5px solid #000', borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
