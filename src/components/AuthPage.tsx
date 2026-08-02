import React, { useState } from 'react';
import { Pill, ShieldCheck, Mail, Lock, ArrowRight, Sparkles, Building2, User, CheckCircle2 } from 'lucide-react';
import { CustomerProfile, PortalType } from '../types';

interface AuthPageProps {
  onLoginSuccess: (portal: PortalType, profile?: Partial<CustomerProfile>) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [portalChoice, setPortalChoice] = useState<PortalType>('customer');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(portalChoice, {
        name: name || (portalChoice === 'customer' ? 'Rajesh Sharma' : 'Medifind Pharmacy Admin'),
        email: email || 'user@medifind.com',
        phone: phone || '+91 98765 43210',
        aadhaarNumber: aadhaar || '9876-5432-1098',
        isAadhaarVerified: isAadhaarVerified,
      });
    }, 600);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('customer', {
        name: 'Rajesh Sharma',
        email: 'rajesh.sharma@gmail.com',
        phone: '+91 98765 43210',
        isAadhaarVerified: true,
      });
    }, 700);
  };

  const handleDemoCustomerLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('customer', {
        name: 'Rajesh Sharma',
        email: 'rajesh.sharma@example.com',
        phone: '+91 98765 43210',
        isAadhaarVerified: true,
      });
    }, 400);
  };

  const handleDemoAdminLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('pharmacy');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background Radial Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 my-8">
        {/* Header Brand Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-slate-800/80 border border-slate-700/80 px-4 py-2 rounded-2xl shadow-xl backdrop-blur-md mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/20">
              <Pill className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold tracking-tight text-white font-['Playfair_Display']">
                Medifinds
              </h1>
              <p className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
                Healthcare & Pharmacy Network
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Find medicines near you, verify Aadhaar eKYC, and get rapid 30-minute doorstep delivery.
          </p>
        </div>

        {/* Portal Type Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 mb-6">
          <button
            type="button"
            onClick={() => setPortalChoice('customer')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              portalChoice === 'customer'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            Customer Portal
          </button>

          <button
            type="button"
            onClick={() => setPortalChoice('pharmacy')}
            className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              portalChoice === 'pharmacy'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Pharmacy Admin
          </button>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          
          {/* Sign In / Register Tabs */}
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-6">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`text-sm font-bold pb-1 transition-colors relative ${
                  activeTab === 'login' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
                {activeTab === 'login' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className={`text-sm font-bold pb-1 transition-colors relative ${
                  activeTab === 'register' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
                {activeTab === 'register' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Aadhaar eKYC</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          {portalChoice === 'customer' && (
            <div className="mb-5">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-800 rounded-2xl font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-md active:scale-98"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Sign in with Google
              </button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700/80" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                  <span className="bg-slate-800 px-3 text-slate-400 font-semibold">Or use email</span>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {portalChoice === 'customer' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>Aadhaar Number (eKYC Verification)</span>
                      <span className="text-[10px] text-emerald-400 font-bold">Encrypted</span>
                    </label>
                    <input
                      type="text"
                      value={aadhaar}
                      onChange={(e) => setAadhaar(e.target.value)}
                      placeholder="9876-5432-1098"
                      className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={portalChoice === 'customer' ? 'rajesh.sharma@example.com' : 'admin@medifind.com'}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-extrabold text-xs rounded-2xl shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all active:scale-98 mt-2"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{activeTab === 'login' ? 'Sign In to Medifinds' : 'Register & Verify eKYC'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick One-Click Demo Logins */}
          <div className="mt-6 pt-5 border-t border-slate-700/80">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2.5 text-center">
              Quick Test Accounts (1-Click Preview)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDemoCustomerLogin}
                className="p-2.5 bg-slate-900/80 hover:bg-slate-900 border border-slate-700 rounded-xl text-[11px] font-semibold text-slate-300 hover:text-emerald-400 text-left transition-colors flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                  R
                </div>
                <div className="truncate">
                  <span className="block font-bold text-white truncate">Rajesh Sharma</span>
                  <span className="block text-[9px] text-slate-400">Customer</span>
                </div>
              </button>

              <button
                type="button"
                onClick={handleDemoAdminLogin}
                className="p-2.5 bg-slate-900/80 hover:bg-slate-900 border border-slate-700 rounded-xl text-[11px] font-semibold text-slate-300 hover:text-emerald-400 text-left transition-colors flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-[10px]">
                  M
                </div>
                <div className="truncate">
                  <span className="block font-bold text-white truncate">Central Admin</span>
                  <span className="block text-[9px] text-slate-400">Pharmacy</span>
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Security Footer Note */}
        <div className="mt-6 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>CDSCO Compliant • 256-Bit SSL Encrypted Healthcare Network</span>
        </div>
      </div>
    </div>
  );
};
