import React from 'react';
import { Folder, ChevronRight } from 'lucide-react';
import type { StorageFolder } from '../../types';

interface FolderGridProps {
  folders: StorageFolder[];
  activeFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
}

export const FolderGrid: React.FC<FolderGridProps> = ({
  folders,
  activeFolderId,
  onSelectFolder,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Folder className="w-4 h-4 text-indigo-400" />
          <span>Folders</span>
          {activeFolderId && (
            <button
              onClick={() => onSelectFolder(null)}
              className="text-xs text-indigo-400 hover:underline font-normal ml-2"
            >
              (Show all folders)
            </button>
          )}
        </h3>
        <span className="text-xs text-slate-500 font-medium">
          {folders.length} directories
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {folders.map((folder) => {
          const isActive = activeFolderId === folder.id;

          return (
            <button
              key={folder.id}
              onClick={() => onSelectFolder(isActive ? null : folder.id)}
              className={`p-3.5 rounded-2xl glass-card text-left transition-all group flex flex-col justify-between hover:scale-[1.02] ${
                isActive
                  ? 'border-indigo-500 bg-indigo-950/40 shadow-lg shadow-indigo-500/10'
                  : 'hover:border-slate-600/60'
              }`}
            >
              <div className="flex items-start justify-between w-full">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ backgroundColor: `${folder.color}20`, color: folder.color }}
                >
                  <Folder className="w-5 h-5 fill-current opacity-90" />
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-transform ${
                  isActive ? 'rotate-90 text-indigo-400' : ''
                }`} />
              </div>

              <div className="mt-3">
                <h4 className="text-xs sm:text-sm font-semibold text-white truncate">
                  {folder.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {folder.itemCount} files
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
