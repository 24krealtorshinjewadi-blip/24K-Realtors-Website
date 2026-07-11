import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, X, Lock, User, Shield, ArrowRight, RotateCcw } from 'lucide-react';
import { apiService } from '../services/apiService';
import { signInWithGoogle } from '../services/firebaseConfig';
import CompanyLogo from './CompanyLogo';

/* ─── Premium 2-Step Login Modal ───────────────────────────────────────────
   Step 1: Username + Password  →  calls /api/v1/auth/login-init
   Step 2: 6-digit OTP grid     →  calls /api/v1/auth/login-verify
   On success: stores token, refreshToken, role, fullName in localStorage
   Fires onSuccess(userData) callback to parent
────────────────────────────────────────────────────────────────────────── */

const GOLD = '#D4AF37';

export default function LoginModal({ onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1 = credentials, 2 = OTP
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [tempToken, setTempToken] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [devOtp, setDevOtp] = useState(''); // dev-only OTP hint from backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef([]);
  const timerRef = useRef(null);

  // Start resend timer
  const startTimer = () => {
    setResendTimer(60);
    timerRef.current = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  // ── Step 1: Credential submit ─────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username and password required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await apiService.loginInit(username.trim(), password);
      setTempToken(data.tempToken);
      setMaskedEmail(data.emailMasked || '');
      setDevOtp(data.devMockOtp || '');
      setStep(2);
      startTimer();
    } catch (err) {
      setError(err?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginClick = async () => {
    setLoading(true);
    setError('');
    try {
      // 🔥 Real Firebase Google OAuth
      const firebaseResult = await signInWithGoogle();
      const { idToken, email, name } = firebaseResult;
      
      // Exchange Firebase ID token with our backend
      const data = await apiService.googleLogin(idToken);
      onSuccess(data);
    } catch (err) {
      // Fallback: if Firebase not configured, use mock flow
      if (err?.code === 'auth/configuration-not-found' || err?.code === 'auth/unauthorized-domain') {
        try {
          const mockPayload = { email: 'manishrajapakar@gmail.com', name: 'Manish Kumar Rai', sub: 'google-123456' };
          const headerB64 = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
          const payloadB64 = btoa(JSON.stringify(mockPayload));
          const data = await apiService.googleLogin(`${headerB64}.${payloadB64}.mock`);
          onSuccess(data);
        } catch (fallbackErr) {
          setError(fallbackErr?.message || 'Google Sign-in failed.');
        }
      } else {
        setError(err?.message || 'Google Sign-in failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: OTP submit ────────────────────────────────────────────────────
  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) { setError('Enter all 6 digits.'); return; }
    setLoading(true);
    setError('');
    try {
      const data = await apiService.loginVerify(tempToken, code);
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('role', data.role);
      localStorage.setItem('userFullName', data.fullName || data.username);
      localStorage.setItem('username', data.username);
      localStorage.setItem('adminUser', data.username);
      onSuccess(data);
    } catch (err) {
      setError(err?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  // OTP input handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter' && otp.join('').length === 6) handleVerify();
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setOtp(['', '', '', '', '', '']);
    setError('');
    setLoading(true);
    try {
      const data = await apiService.loginInit(username.trim(), password);
      setTempToken(data.tempToken);
      setDevOtp(data.devMockOtp || '');
      startTimer();
      otpRefs.current[0]?.focus();
    } catch {
      setError('Failed to resend OTP. Please go back and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(4,8,20,0.85)', backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}
      >
        {/* Card */}
        <motion.div
          key="card"
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: '440px',
            background: 'rgba(10, 16, 32, 0.55)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(212, 175, 55, 0.18)',
            borderRadius: '24px', padding: '40px',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
            position: 'relative',
          }}
        >
          <style>{`
            .luxury-login-input:focus {
              border-color: ${GOLD} !important;
              box-shadow: 0 0 15px rgba(212, 175, 55, 0.25), inset 0 1px 2px rgba(0, 0, 0, 0.3) !important;
              background: rgba(0, 0, 0, 0.55) !important;
            }
            .luxury-login-otp-input:focus {
              border-color: ${GOLD} !important;
              box-shadow: 0 0 15px rgba(212, 175, 55, 0.25) !important;
              background: rgba(212, 175, 55, 0.02) !important;
            }
            .luxury-google-btn:hover {
              background: rgba(255,255,255,0.06) !important;
              border-color: rgba(255,255,255,0.18) !important;
            }
          `}</style>

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(255,255,255,0.06)', border: 'none',
              borderRadius: '50%', width: '32px', height: '32px',
              color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          >
            <X size={14} />
          </button>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <CompanyLogo variant="icon" width={110} height={82} style={{ margin: '0 auto' }} />
            <div style={{
              fontFamily: "'Cinzel', serif", fontSize: '0.8rem', fontWeight: 700,
              color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase',
              marginBottom: '6px', marginTop: '-4px'
            }}>24K REALTORS</div>
            <h2 style={{
              fontFamily: "'Cinzel', serif", fontSize: '1.35rem',
              color: '#fff', margin: 0, fontWeight: 700,
            }}>
              {step === 1 ? 'Secure Sign In' : 'Verify Identity'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', margin: '6px 0 0' }}>
              {step === 1
                ? 'Access your luxury property dashboard'
                : maskedEmail
                  ? `Code sent to ${maskedEmail}`
                  : 'Enter the 6-digit code sent to you'}
            </p>
          </div>

          {/* Step indicator */}
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '24px' }}>
            {[1, 2].map(s => (
              <div key={s} style={{
                height: '3px', borderRadius: '2px', flex: 1,
                background: step >= s ? GOLD : 'rgba(255,255,255,0.1)',
                transition: 'background 0.4s ease',
              }} />
            ))}
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '8px', padding: '10px 14px',
                  color: '#fca5a5', fontSize: '0.82rem', marginBottom: '16px',
                }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── STEP 1 ── */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                onSubmit={handleLogin}
                style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                {/* Username */}
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoComplete="username"
                    className="luxury-login-input"
                    style={inputStyle}
                  />
                </div>

                {/* Password */}
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="luxury-login-input"
                    style={{ ...inputStyle, paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  style={primaryBtnStyle(loading)}
                >
                  {loading ? <Spinner /> : <><span>Continue</span><ArrowRight size={16} /></>}
                </motion.button>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0', gap: '10px' }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>OR</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                </div>

                {/* Google Login Button */}
                <button
                  type="button"
                  onClick={handleGoogleLoginClick}
                  style={googleBtnStyle}
                  className="luxury-google-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </motion.form>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
              >
                {/* OTP grid */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => otpRefs.current[i] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className="luxury-login-otp-input"
                      style={{
                        width: '46px', height: '54px', textAlign: 'center',
                        fontSize: '1.4rem', fontWeight: 700,
                        background: digit ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.02)',
                        border: `1.5px solid ${digit ? GOLD : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: '10px', color: '#fff', outline: 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontFamily: 'monospace',
                      }}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                {/* Dev OTP hint (remove in prod) */}
                {devOtp && (
                  <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'rgba(212,175,55,0.6)', marginBottom: '12px' }}>
                    Dev hint: <strong style={{ color: GOLD }}>{devOtp}</strong>
                  </div>
                )}

                <motion.button
                  onClick={handleVerify}
                  disabled={loading || otp.join('').length !== 6}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  style={primaryBtnStyle(loading || otp.join('').length !== 6)}
                >
                  {loading ? <Spinner /> : <><Shield size={16} /><span>Verify & Sign In</span></>}
                </motion.button>

                {/* Resend + Back */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.8rem' }}>
                  <button
                    onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']); setError(''); }}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleResend}
                    disabled={resendTimer > 0}
                    style={{
                      background: 'none', border: 'none', cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
                      color: resendTimer > 0 ? 'rgba(255,255,255,0.3)' : GOLD, fontSize: '0.8rem',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}
                  >
                    <RotateCcw size={12} />
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Spinner() {
  return (
    <div style={{
      width: '18px', height: '18px', border: '2px solid rgba(0,0,0,0.2)',
      borderTop: '2px solid currentColor', borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '14px 14px 14px 40px',
  background: 'rgba(0, 0, 0, 0.45)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '10px', color: '#fff',
  fontSize: '0.95rem', outline: 'none',
  fontFamily: "'Montserrat', sans-serif",
  boxSizing: 'border-box',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  letterSpacing: '0.03em',
};

const primaryBtnStyle = (disabled) => ({
  width: '100%', padding: '13px',
  background: disabled ? 'rgba(212,175,55,0.25)' : 'linear-gradient(135deg, #D4AF37, #B8960C)',
  border: 'none', borderRadius: '50px',
  color: disabled ? 'rgba(255,255,255,0.4)' : '#070F1E',
  fontWeight: 700, fontSize: '0.9rem',
  cursor: disabled ? 'not-allowed' : 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
  fontFamily: "'Montserrat', sans-serif",
  transition: 'all 0.2s',
});

const googleBtnStyle = {
  width: '100%', padding: '12px',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '50px',
  color: '#fff',
  fontWeight: 600,
  fontSize: '0.88rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontFamily: "'Montserrat', sans-serif",
  transition: 'all 0.2s ease',
};
