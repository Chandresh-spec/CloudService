import React, { useState } from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Archive, 
  Code, 
  File, 
  Star, 
  MoreVertical, 
  Download, 
  Share2, 
  Trash2, 
  Eye, 
  LayoutGrid, 
  List,
  ArrowUpDown
} from 'lucide-react';
import type { StorageFile } from '../../types';

interface FileListProps {
  files: StorageFile[];
  onToggleStar: (fileId: string) => void;
  onPreviewFile: (file: StorageFile) => void;
  onShareFile: (file: StorageFile) => void;
  onDeleteFile: (fileId: string) => void;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  onToggleStar,
  onPreviewFile,
  onShareFile,
  onDeleteFile,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Helper to format file size
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Helper to get file type icon and color
  const getFileIcon = (file: StorageFile) => {
    switch (file.type) {
      case 'document':
        return <FileText className="w-5 h-5 text-cyan-400" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-emerald-400" />;
      case 'archive':
        return <Archive className="w-5 h-5 text-violet-400" />;
      case 'code':
        return <Code className="w-5 h-5 text-amber-400" />;
      default:
        return <File className="w-5 h-5 text-indigo-400" />;
    }
  };

  // Sort files
  const sortedFiles = [...files].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'size') return b.size - a.size;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-white tracking-tight">
            Files ({files.length})
          </h3>
          <span className="text-xs text-slate-500">• Encrypted Storage</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl glass-card text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="date" className="bg-slate-900 text-white">Date Modified</option>
              <option value="name" className="bg-slate-900 text-white">File Name</option>
              <option value="size" className="bg-slate-900 text-white">File Size</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl glass-card border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="p-12 rounded-3xl glass-card text-center space-y-3">
          <File className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-base font-semibold text-slate-300">No files found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any files in this view yet. Upload a file or drag and drop items here to get started!
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedFiles.map((file) => {
            const isMenuOpen = activeMenuId === file.id;

            return (
              <div
                key={file.id}
                className="p-4 rounded-2xl glass-card hover:border-slate-600/70 transition-all group relative flex flex-col justify-between hover:shadow-xl hover:shadow-black/40"
              >
                {/* Header: Type icon & actions */}
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80">
                    {getFileIcon(file)}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleStar(file.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        file.starred
                          ? 'text-amber-400 hover:text-amber-300'
                          : 'text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100'
                      }`}
                      title={file.starred ? 'Starred' : 'Add to Starred'}
                    >
                      <Star className={`w-4 h-4 ${file.starred ? 'fill-current' : ''}`} />
                    </button>

                    <div className="relative">
                      <button
                        onClick={() => setActiveMenuId(isMenuOpen ? null : file.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div
                          className="absolute right-0 top-8 z-30 w-40 p-1.5 rounded-xl bg-slate-900/95 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-0.5 text-xs animate-in fade-in"
                          onMouseLeave={() => setActiveMenuId(null)}
                        >
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onPreviewFile(file);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-left transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Preview</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onShareFile(file);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-left transition-colors"
                          >
                            <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Share Link</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              alert(`Downloading "${file.name}"...`);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-left transition-colors"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Download</span>
                          </button>
                          <div className="h-[1px] bg-slate-800 my-1" />
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onDeleteFile(file.id);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-left transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* File Title */}
                <div
                  className="cursor-pointer"
                  onClick={() => onPreviewFile(file)}
                >
                  <h4 className="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                    {file.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                    <span>{formatSize(file.size)}</span>
                    <span>•</span>
                    <span className="uppercase text-[10px] text-indigo-400 font-bold">{file.extension}</span>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{new Date(file.updatedAt).toLocaleDateString()}</span>
                  {file.shared && (
                    <span className="flex items-center gap-1 text-indigo-400 text-[10px] font-semibold">
                      <Share2 className="w-3 h-3" />
                      Shared
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST / TABLE VIEW */
        <div className="rounded-2xl glass-card overflow-hidden border border-slate-800/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-900/40 text-slate-400 font-medium">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Last Modified</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {sortedFiles.map((file) => (
                  <tr
                    key={file.id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onToggleStar(file.id)}
                          className={`p-1 rounded ${file.starred ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}
                        >
                          <Star className={`w-3.5 h-3.5 ${file.starred ? 'fill-current' : ''}`} />
                        </button>
                        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                          {getFileIcon(file)}
                        </div>
                        <span
                          onClick={() => onPreviewFile(file)}
                          className="font-medium text-white hover:text-indigo-300 cursor-pointer truncate max-w-xs"
                        >
                          {file.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {formatSize(file.size)}
                    </td>
                    <td className="py-3 px-4 text-slate-400 uppercase font-mono text-[10px]">
                      {file.extension}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(file.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onPreviewFile(file)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onShareFile(file)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800"
                          title="Share"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteFile(file.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
