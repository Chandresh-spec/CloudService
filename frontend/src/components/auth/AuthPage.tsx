import React, { useState } from 'react';
import { Shield, Lock, Zap, HardDrive, CheckCircle2 } from 'lucide-react';
import { RegisterForm } from './RegisterForm';
import { LoginForm } from './LoginForm';
import { OtpVerification } from './OtpVerification';
import { useAuth } from '../../context/AuthContext';

interface AuthPageProps {
  onSuccess: () => void;
  onAddToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onAddToast }) => {
  const { pendingEmail, resetPendingState } = useAuth();
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');

  const showOtpStep = !!pendingEmail;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      {/* Dynamic background lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Side: Product Branding & Features */}
        <div className="lg:col-span-6 space-y-8 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Encrypted Cloud Storage & Fast Auth</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Next-Gen Cloud.{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-200 bg-clip-text text-transparent">
                Zero Compromise.
              </span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg max-w-lg leading-relaxed">
              Store, organize, and stream your files with military-grade 256-bit AES encryption, Redis-backed rate limiting, and OTP 2-factor verification.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl glass-card flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Zero Knowledge</h4>
                <p className="text-xs text-slate-400 mt-0.5">End-to-end encrypted storage keys.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-card flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Redis-Powered OTP</h4>
                <p className="text-xs text-slate-400 mt-0.5">Lua-scripted anti-tamper verification.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-card flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">100 GB Vault Free</h4>
                <p className="text-xs text-slate-400 mt-0.5">Instant activation upon email confirmation.</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-card flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Live Fast Sync</h4>
                <p className="text-xs text-slate-400 mt-0.5">Instant multi-device file syncing.</p>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="pt-2 flex items-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>FastAPI Backend Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              <span>PostgreSQL 17 Async</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Redis 7 Cluster</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="lg:col-span-6 flex justify-center">
          {showOtpStep ? (
            <OtpVerification
              onSuccess={onSuccess}
              onBack={() => resetPendingState()}
              onAddToast={onAddToast}
            />
          ) : authMode === 'register' ? (
            <RegisterForm
              onSuccess={() => {}}
              onSwitchToLogin={() => setAuthMode('login')}
              onAddToast={onAddToast}
            />
          ) : (
            <LoginForm
              onSuccess={onSuccess}
              onSwitchToRegister={() => setAuthMode('register')}
              onAddToast={onAddToast}
            />
          )}
        </div>
      </div>
    </div>
  );
};
