import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, ArrowLeft, RefreshCw, KeyRound, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';

interface OtpVerificationProps {
  onSuccess?: () => void;
  onBack?: () => void;
  onAddToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const OtpVerification: React.FC<OtpVerificationProps> = ({ onSuccess, onBack, onAddToast }) => {
  const { pendingEmail, lastReceivedOtp, verifyOtp, resendOtp, isSubmitting, error, clearError } = useAuth();

  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState<number>(150);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [successAnimation, setSuccessAnimation] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    // Only accept numeric digits
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const updated = [...otpDigits];
      updated[index] = '';
      setOtpDigits(updated);
      return;
    }

    const digit = cleaned.slice(-1);
    const updated = [...otpDigits];
    updated[index] = digit;
    setOtpDigits(updated);
    clearError();

    // Auto-advance to next input
    if (index < 5 && digit) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if all 6 digits are filled
    const fullCode = updated.join('');
    if (fullCode.length === 6 && updated.every((d) => d !== '')) {
      handleVerify(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const updated = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      updated[i] = pasted[i] || '';
    }
    setOtpDigits(updated);
    clearError();

    if (pasted.length === 6) {
      inputRefs.current[5]?.focus();
      handleVerify(pasted);
    } else if (pasted.length > 0) {
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleVerify = async (codeOverride?: string) => {
    const code = codeOverride || otpDigits.join('');
    if (code.length !== 6) {
      onAddToast('error', 'Incomplete Code', 'Please enter all 6 digits of the verification code.');
      return;
    }

    setIsVerifying(true);
    const result = await verifyOtp(code);
    setIsVerifying(false);

    if (result.success) {
      setSuccessAnimation(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#38bdf8', '#10b981', '#f43f5e'],
      });

      onAddToast('success', 'Verified Successfully!', 'Welcome to your secure CloudVault.');
      setTimeout(() => {
        onSuccess?.();
      }, 1200);
    } else {
      onAddToast('error', 'Verification Failed', result.message);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    const res = await resendOtp();
    if (res.success) {
      setCountdown(150);
      onAddToast('info', 'Code Resent', res.message || 'A new 6-digit OTP code has been issued.');
    } else {
      onAddToast('error', 'Resend Error', res.message);
    }
  };

  const handleQuickFillDevOtp = () => {
    if (lastReceivedOtp && lastReceivedOtp.length === 6) {
      const arr = lastReceivedOtp.split('');
      setOtpDigits(arr);
      clearError();
      handleVerify(lastReceivedOtp);
    }
  };

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center relative mb-8">
        <button
          onClick={onBack}
          className="absolute left-0 top-0 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
          title="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4 shadow-inner">
          <KeyRound className="w-7 h-7" />
        </div>

        <h2 className="text-2xl font-bold text-white tracking-tight">Verify Your Account</h2>
        <p className="text-sm text-slate-400 mt-2">
          We sent a 6-digit verification code to
        </p>
        <p className="text-sm font-medium text-indigo-300 mt-0.5 truncate px-6">
          {pendingEmail || 'your email'}
        </p>
      </div>

      {/* Dev Mode Helper Notice */}
      {lastReceivedOtp && (
        <div className="mb-6 p-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-300">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Dev OTP: <strong className="font-mono text-cyan-300 tracking-wider text-sm">{lastReceivedOtp}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={handleQuickFillDevOtp}
            className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shrink-0 shadow-sm"
          >
            Auto-Fill
          </button>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span className="flex-1">{error}</span>
        </div>
      )}

      {/* 6-Digit OTP Input Boxes */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 mb-6">
        {otpDigits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputRefs.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={idx === 0 ? handlePaste : undefined}
            disabled={isVerifying || isSubmitting || successAnimation}
            className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold font-mono rounded-2xl bg-slate-900/80 border text-white transition-all duration-200 outline-none ${
              digit
                ? 'border-indigo-500 shadow-md shadow-indigo-500/20 bg-indigo-950/20'
                : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500/80'
            }`}
          />
        ))}
      </div>

      {/* Verify Action Button */}
      <button
        onClick={() => handleVerify()}
        disabled={isVerifying || isSubmitting || otpDigits.some((d) => !d) || successAnimation}
        className={`w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-200 ${
          successAnimation
            ? 'bg-emerald-600 text-white'
            : otpDigits.every((d) => d !== '')
            ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-indigo-500/25 hover:scale-[1.01]'
            : 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/50'
        }`}
      >
        {successAnimation ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
            <span>Account Verified! Redirecting...</span>
          </>
        ) : isVerifying || isSubmitting ? (
          <>
            <RefreshCw className="w-4 h-4 text-white animate-spin" />
            <span>Verifying Code...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4" />
            <span>Verify & Access Storage</span>
          </>
        )}
      </button>

      {/* Resend Cooldown Section */}
      <div className="mt-6 text-center text-xs text-slate-400">
        <p>Didn't receive the email code?</p>
        <div className="mt-2 flex items-center justify-center gap-1.5">
          {countdown > 0 ? (
            <span className="text-slate-500">
              Resend code in <span className="font-mono text-indigo-400 font-semibold">{formatCountdown(countdown)}</span>
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
              <span>Resend Verification Code</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
