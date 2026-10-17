import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LoginFormProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
  onAddToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister, onAddToast }) => {
  const { loginQuick } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    // Simulate login / sign in session
    loginQuick(email);
    onAddToast('success', 'Welcome Back!', `Signed in as ${email}`);
    onSuccess();
  };

  const handleDemoLogin = () => {
    loginQuick('demo.developer@cloudvault.io', 'Demo Developer');
    onAddToast('success', 'Demo Vault Unlocked', 'Exploring CloudVault in demo mode.');
    onSuccess();
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Access Your Vault</h2>
        <p className="text-xs text-slate-400 mt-1">
          Enter your registered email and credentials.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              required
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-900/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-slate-300">Password</label>
            <a href="#" className="text-[11px] text-indigo-400 hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-900/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
            />
            <span className="text-xs text-slate-400">Remember on this device</span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!email || !password}
          className={`w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-200 mt-2 ${
            email && password
              ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-500/25 hover:scale-[1.01] active:scale-[0.99]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Sign In to Vault</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Demo Mode Button */}
      <div className="mt-4 pt-4 border-t border-slate-800/80">
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full py-2.5 rounded-xl border border-slate-700/70 hover:border-indigo-500/50 bg-slate-900/60 hover:bg-indigo-950/20 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-all"
        >
          <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
          <span>Explore with Demo Sandbox Account</span>
        </button>
      </div>

      {/* Switch to Register */}
      <div className="mt-6 text-center text-xs text-slate-400">
        Need an account?{' '}
        <button
          onClick={onSwitchToRegister}
          className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
        >
          Create a Vault
        </button>
      </div>
    </div>
  );
};
