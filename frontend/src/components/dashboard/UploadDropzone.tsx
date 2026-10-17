import React, { useState, useRef } from 'react';
import { Upload, FileUp, X, Shield } from 'lucide-react';
import type { StorageFile } from '../../types';

interface UploadDropzoneProps {
  isOpen: boolean;
  onClose: () => void;
  onFilesUploaded: (newFiles: StorageFile[]) => void;
  onAddToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  isOpen,
  onClose,
  onFilesUploaded,
  onAddToast,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ name: string; progress: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFiles(Array.from(e.target.files));
    }
  };

  const processSelectedFiles = (rawFiles: File[]) => {
    const fileEntries = rawFiles.map((f) => ({ name: f.name, progress: 10 }));
    setUploadingFiles(fileEntries);

    // Simulate animated upload progress
    let currentProgress = 15;
    const interval = setInterval(() => {
      currentProgress += 25;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setUploadingFiles([]);

        const newStorageFiles: StorageFile[] = rawFiles.map((f, i) => {
          const ext = f.name.split('.').pop()?.toLowerCase() || 'txt';
          let type: StorageFile['type'] = 'other';
          if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext)) type = 'document';
          else if (['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'].includes(ext)) type = 'image';
          else if (['zip', 'rar', 'tar', 'gz', '7z'].includes(ext)) type = 'archive';
          else if (['py', 'js', 'ts', 'jsx', 'tsx', 'html', 'css', 'json', 'yaml'].includes(ext)) type = 'code';

          return {
            id: 'file-' + Date.now() + '-' + i,
            name: f.name,
            size: f.size || 1024 * 350,
            type,
            extension: ext,
            mime: f.type || 'application/octet-stream',
            updatedAt: new Date().toISOString(),
            starred: false,
            shared: false,
          };
        });

        onFilesUploaded(newStorageFiles);
        onAddToast('success', 'Upload Complete', `Uploaded and encrypted ${rawFiles.length} file(s).`);
        onClose();
      } else {
        setUploadingFiles(rawFiles.map((f) => ({ name: f.name, progress: currentProgress })));
      }
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl rounded-3xl glass-panel p-6 sm:p-8 relative overflow-hidden border border-slate-700/80 shadow-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Upload to Vault</h3>
              <p className="text-xs text-slate-400">Files are automatically encrypted client-side</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dropzone container */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-4 ${
            isDragging
              ? 'border-indigo-400 bg-indigo-950/40 scale-[1.01]'
              : 'border-slate-700/80 hover:border-indigo-500/60 bg-slate-900/40 hover:bg-slate-900/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-3xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-600/10">
            <Upload className="w-8 h-8 animate-bounce" />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Drag & drop files here, or <span className="text-indigo-400 underline underline-offset-2">browse</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports documents, media, source code, and archives up to 5 GB
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              <Shield className="w-3 h-3 text-indigo-400" />
              AES-256 Client Encryption
            </span>
          </div>
        </div>

        {/* Uploading progress list */}
        {uploadingFiles.length > 0 && (
          <div className="space-y-2 pt-2">
            <p className="text-xs font-semibold text-slate-300">Encrypting & Uploading...</p>
            {uploadingFiles.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white truncate max-w-xs">{item.name}</span>
                  <span className="text-indigo-400 font-mono font-semibold">{item.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-200"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
