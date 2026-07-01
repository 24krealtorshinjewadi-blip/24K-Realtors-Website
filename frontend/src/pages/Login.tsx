import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../services/apiClient';
import { ShieldCheck, Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const loginStore = useAuthStore(state => state.login);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login', {
        username,
        password,
      });

      const { token, refreshToken, username: resUsername, role } = response.data;
      
      // Seed details from token or query backend profile
      loginStore(token, refreshToken, {
        id: 'session-id',
        username: resUsername,
        fullName: resUsername === 'admin24k' ? 'Manish Kumar Rai' : resUsername,
        email: `${resUsername}@24krealtors.com`,
        role: role,
      });

      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data || 'Invalid operator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col justify-center items-center px-6">
      <div className="w-full max-w-md bg-[#070f1e] border border-[#D4AF37]/20 p-8 rounded-xl shadow-2xl relative overflow-hidden">
        {/* Decorative gold gradient border at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]"></div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] mb-3">
            <ShieldCheck size={26} />
          </div>
          <h2 className="text-xl font-bold tracking-wider">24K REALTORS</h2>
          <span className="text-[10px] text-[#D4AF37] tracking-[0.2em] font-semibold uppercase">SECURE OPERATOR ACCESS</span>
        </div>

        {error && (
          <div className="bg-rose-950/30 border border-rose-500/20 text-rose-400 text-sm px-4 py-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div className="flex flex-col text-left">
            <label className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wide">Operator Username *</label>
            <input 
              required
              type="text" 
              placeholder="e.g. admin24k" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="bg-[#020617] border border-slate-800 focus:border-[#D4AF37] text-slate-100 rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors w-full"
            />
          </div>

          <div className="flex flex-col text-left">
            <label className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wide">Security Phrase *</label>
            <input 
              required
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-[#020617] border border-slate-800 focus:border-[#D4AF37] text-slate-100 rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA8B24] text-[#020617] py-3.5 rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Start Secure Session</span>
            )}
          </button>
        </form>
      </div>

      <button 
        onClick={() => navigate('/')}
        className="text-xs text-slate-500 hover:text-slate-300 mt-6 transition-colors"
      >
        ← Return to Public Website
      </button>
    </div>
  );
};
