import React from 'react';
import { 
  FolderTree, 
  Star, 
  Clock, 
  Share2, 
  Trash2, 
  Upload, 
  HardDrive, 
  ShieldCheck, 
  ChevronRight,
  Database
} from 'lucide-react';
import type { FileCategory } from '../../types';

export type SidebarTab = 'all' | 'starred' | 'recent' | 'shared' | 'trash';

interface SidebarProps {
  currentTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  selectedCategory: FileCategory;
  onCategoryChange: (cat: FileCategory) => void;
  onTriggerUpload: () => void;
  totalSizeFormatted: string;
  usedPercentage: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  selectedCategory,
  onCategoryChange,
  onTriggerUpload,
  totalSizeFormatted,
  usedPercentage,
}) => {
  const navItems = [
    { id: 'all' as SidebarTab, label: 'All Files', icon: FolderTree, count: 24 },
    { id: 'starred' as SidebarTab, label: 'Starred', icon: Star, count: 5 },
    { id: 'recent' as SidebarTab, label: 'Recent', icon: Clock, count: 12 },
    { id: 'shared' as SidebarTab, label: 'Shared Links', icon: Share2, count: 4 },
    { id: 'trash' as SidebarTab, label: 'Trash', icon: Trash2, count: 2 },
  ];

  const categories: { id: FileCategory; label: string; color: string }[] = [
    { id: 'all', label: 'All Categories', color: 'bg-indigo-500' },
    { id: 'document', label: 'Documents (PDF, Doc)', color: 'bg-cyan-500' },
    { id: 'image', label: 'Images & Photos', color: 'bg-emerald-500' },
    { id: 'archive', label: 'Archives (ZIP, Tar)', color: 'bg-violet-500' },
    { id: 'code', label: 'Code & Scripts', color: 'bg-amber-500' },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6">
      {/* Upload Action Button */}
      <button
        onClick={onTriggerUpload}
        className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all hover:scale-[1.01] active:scale-[0.99]"
      >
        <Upload className="w-4 h-4" />
        <span>Upload New Files</span>
      </button>

      {/* Main Navigation */}
      <div className="glass-card rounded-2xl p-2.5 space-y-1">
        <p className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Vault Storage
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                isActive ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-800 text-slate-400'
              }`}>
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Categories Filter */}
      <div className="glass-card rounded-2xl p-2.5 space-y-1">
        <p className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Filter by Type
        </p>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-all ${
                isSelected
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                <span>{cat.label}</span>
              </div>
              {isSelected && <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />}
            </button>
          );
        })}
      </div>

      {/* Storage Meter Widget */}
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-white">Storage Usage</span>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-300">
            {usedPercentage}%
          </span>
        </div>

        {/* Multi-segment progress bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
          <div style={{ width: '9%' }} className="bg-indigo-500 h-full" title="Images (8.2 GB)" />
          <div style={{ width: '5%' }} className="bg-cyan-400 h-full" title="Documents (4.1 GB)" />
          <div style={{ width: '4%' }} className="bg-violet-500 h-full" title="Archives (3.9 GB)" />
          <div style={{ width: '2%' }} className="bg-amber-400 h-full" title="Code & Config (2.2 GB)" />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>{totalSizeFormatted} used</span>
          <span>100 GB Plan</span>
        </div>

        {/* Security badge */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-medium">OTP 2FA Active</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Database className="w-3 h-3 text-cyan-400" />
            <span>Encrypted</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
