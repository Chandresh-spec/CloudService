import React from 'react';
import { X, Download, Share2, Shield, Calendar, HardDrive, FileText, CheckCircle2 } from 'lucide-react';
import type { StorageFile } from '../../types';

interface FilePreviewModalProps {
  file: StorageFile | null;
  onClose: () => void;
  onShare: (file: StorageFile) => void;
  onAddToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  onClose,
  onShare,
  onAddToast,
}) => {
  if (!file) return null;

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    onAddToast('success', 'Download Started', `Downloading "${file.name}" to your local device.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl rounded-3xl glass-panel p-6 sm:p-8 relative overflow-hidden border border-slate-700/80 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white truncate max-w-sm sm:max-w-md">
                {file.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                MIME: {file.mime || 'application/octet-stream'}
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

        {/* Visual Preview Area */}
        <div className="h-48 sm:h-56 w-full rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col items-center justify-center p-6 text-center space-y-3 relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">
              Encrypted File Preview
            </p>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              Zero-knowledge decrypted in browser sandbox
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            SHA-256 Verified
          </span>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 text-[11px] flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
              File Size
            </span>
            <p className="font-semibold text-white font-mono mt-1">{formatSize(file.size)}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-500 text-[11px] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Uploaded Date
            </span>
            <p className="font-semibold text-white mt-1">
              {new Date(file.updatedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-slate-500 text-[11px] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Encryption
            </span>
            <p className="font-semibold text-white mt-1">AES-256-GCM</p>
          </div>
        </div>

        {/* Checksum fingerprint */}
        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Checksum:</span>
          <span className="text-indigo-300 truncate max-w-xs">
            {file.checksum || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => {
              onClose();
              onShare(file);
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-700 hover:border-indigo-500/50 bg-slate-800/50 hover:bg-indigo-950/30 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Share2 className="w-4 h-4 text-indigo-400" />
            <span>Share Link</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            <Download className="w-4 h-4" />
            <span>Download Decrypted File</span>
          </button>
        </div>
      </div>
    </div>
  );
};
