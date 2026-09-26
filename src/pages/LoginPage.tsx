import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, Sparkles, CheckCircle2, UserCheck, ShieldAlert } from 'lucide-react';

interface LoginPageProps {
  setActiveTab: (tab: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setActiveTab }) => {
  const { loginWithCredentials } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('director');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setLoginError('Please enter your institutional email and security passcode.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await loginWithCredentials(email, password, selectedRole);
      if (res.success) {
        setIsLoggingIn(false);
        setActiveTab('console');
      } else {
        setIsLoggingIn(false);
        setLoginError(res.error || 'Access Denied: Invalid credentials or security passcode.');
      }
    } catch {
      setIsLoggingIn(false);
      setLoginError('Central Security Database unreachable. Please try again.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-[#071E10] text-white relative overflow-hidden text-left">
      
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#B5F438]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#15803D]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        
        {/* Top Back Link */}
        <button
          onClick={() => setActiveTab('home')}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#B5F438] hover:text-[#C5FA54] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Website</span>
        </button>

        {/* Login Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0B2A18]/90 backdrop-blur-xl border border-white/15 shadow-2xl space-y-7">
          
          {/* Official GISU & OAU Logos */}
          <div className="space-y-3 text-center">
            <div className="flex items-center justify-center -space-x-2">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#B5F438] shadow-xl bg-[#4A0E17] z-10">
                <img
                  src="/gisu_logo.jpg"
                  alt="Great Ife Students' Union"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/40 shadow-xl bg-white z-0 p-1">
                <img
                  src="/oau_logo.jpg"
                  alt="Obafemi Awolowo University Crest"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Executive Portal
            </h1>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Great Ife Students' Union • Obafemi Awolowo University
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Role Selector Tabs */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-[#94A3B8] uppercase block">Select Official Authority</label>
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-black/30 border border-white/10">
              {[
                { id: 'director', label: 'Director' },
                { id: 'faculty_sport_officer', label: 'Faculty Rep' },
                { id: 'media_officer', label: 'Media' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoleChange(r.id as UserRole)}
                  className={`py-2 text-[11px] font-mono font-bold rounded-xl transition-all cursor-pointer ${
                    selectedRole === r.id
                      ? 'bg-[#B5F438] text-[#071E10] shadow-sm'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white block">Official Institutional Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@oauife.edu.ng"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/15 focus:border-[#B5F438] text-white text-xs outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white block">Security Passcode</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/15 focus:border-[#B5F438] text-white text-xs outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 rounded-2xl bg-[#B5F438] hover:bg-[#C5FA54] text-[#071E10] font-heading font-extrabold text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isLoggingIn ? 'Authenticating...' : 'Sign In to Console'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

        </div>

      </div>

    </div>
  );
};
