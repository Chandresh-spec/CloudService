import React, { useState } from 'react';
import { X, Copy, Check, Lock, Globe, Clock, ShieldCheck, Share2 } from 'lucide-react';
import type { StorageFile } from '../../types';

interface ShareModalProps {
  file: StorageFile | null;
  onClose: () => void;
  onAddToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ file, onClose, onAddToast }) => {
  if (!file) return null;

  const [copied, setCopied] = useState(false);
  const [expiry, setExpiry] = useState('7d');
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState('');

  const shareUrl = `https://cloudvault.app/share/${file.id.slice(0, 8)}?t=${expiry}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    onAddToast('success', 'Link Copied!', 'Encrypted share link copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl glass-panel p-6 sm:p-8 relative overflow-hidden border border-slate-700/80 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Share Secure Link</h3>
              <p className="text-xs text-slate-400 truncate max-w-xs sm:max-w-sm mt-0.5">
                "{file.name}"
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Generated Share Link Box */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-300">Public Access Link</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-900/90 border border-slate-800 rounded-xl text-slate-300 select-all focus:outline-none"
              />
            </div>

            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Link Security Configuration */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Link Expiration:</span>
            </div>
            <select
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-2.5 py-1 focus:outline-none cursor-pointer"
            >
              <option value="24h">Expires in 24 Hours</option>
              <option value="7d">Expires in 7 Days</option>
              <option value="30d">Expires in 30 Days</option>
              <option value="never">Never Expires</option>
            </select>
          </div>

          {/* Password Protection */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasPassword}
                onChange={(e) => setHasPassword(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
              />
              <span className="text-xs text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                Require Passphrase for Decryption
              </span>
            </label>

            {hasPassword && (
              <div className="mt-2 pl-6">
                <input
                  type="password"
                  placeholder="Enter access passphrase..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 flex items-center gap-2.5 text-[11px] text-indigo-300">
          <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Files shared through CloudVault are signed with AES-256 GCM authenticated tags.</span>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
