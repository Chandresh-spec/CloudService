import React, { useState, useMemo } from 'react';
import { Sidebar, type SidebarTab } from './Sidebar';
import { StorageOverview } from './StorageOverview';
import { FolderGrid } from './FolderGrid';
import { FileList } from './FileList';
import { FilePreviewModal } from './FilePreviewModal';
import { ShareModal } from './ShareModal';
import { UploadDropzone } from './UploadDropzone';
import type { StorageFile, StorageFolder, FileCategory } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface DashboardProps {
  searchQuery: string;
  onAddToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

const INITIAL_FOLDERS: StorageFolder[] = [
  { id: 'f1', name: 'Work Documents', itemCount: 8, color: '#38bdf8' },
  { id: 'f2', name: 'Design Assets', itemCount: 14, color: '#ec4899' },
  { id: 'f3', name: 'Database Backups', itemCount: 4, color: '#8b5cf6' },
  { id: 'f4', name: 'Media Vault', itemCount: 18, color: '#10b981' },
];

const INITIAL_FILES: StorageFile[] = [
  {
    id: 'file-1',
    name: 'CloudStorage-Architecture-Spec-2026.pdf',
    size: 4294967, // ~4.1 MB
    type: 'document',
    extension: 'pdf',
    mime: 'application/pdf',
    updatedAt: '2026-10-16T14:20:00Z',
    starred: true,
    shared: true,
    folderId: 'f1',
    checksum: '6f9a8820c7d425b967823f0012e8ba929b9',
  },
  {
    id: 'file-2',
    name: 'Vault-Hero-Graphic-4K.png',
    size: 8589934, // ~8.2 MB
    type: 'image',
    extension: 'png',
    mime: 'image/png',
    updatedAt: '2026-10-15T09:12:00Z',
    starred: true,
    shared: false,
    folderId: 'f2',
    checksum: 'ba7816bf8f01cfea414140de5dae2223b00',
  },
  {
    id: 'file-3',
    name: 'PostgreSQL-Redis-Snapshot.tar.gz',
    size: 4089446, // ~3.9 MB
    type: 'archive',
    extension: 'tar.gz',
    mime: 'application/gzip',
    updatedAt: '2026-10-14T21:45:00Z',
    starred: false,
    shared: false,
    folderId: 'f3',
    checksum: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b1',
  },
  {
    id: 'file-4',
    name: 'AuthService-FastAPI-Lua-Script.py',
    size: 230686, // ~225 KB
    type: 'code',
    extension: 'py',
    mime: 'text/x-python',
    updatedAt: '2026-10-17T08:30:00Z',
    starred: true,
    shared: true,
    folderId: 'f1',
    checksum: '5e884898da28047151d0e56f8dc62927736',
  },
  {
    id: 'file-5',
    name: 'Investor-Pitch-Deck-v3.pptx',
    size: 2202009, // ~2.1 MB
    type: 'document',
    extension: 'pptx',
    mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    updatedAt: '2026-10-13T11:00:00Z',
    starred: false,
    shared: true,
    folderId: 'f1',
    checksum: '9f86d081884c7d659a2feaa0c55ad015a3b',
  },
  {
    id: 'file-6',
    name: 'Security-Audit-Report-Q3.docx',
    size: 1572864, // ~1.5 MB
    type: 'document',
    extension: 'docx',
    mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    updatedAt: '2026-10-12T16:40:00Z',
    starred: false,
    shared: false,
    folderId: 'f1',
    checksum: '4b227777d4dd1fc61c6f884f48641d02b4d',
  },
];

export const Dashboard: React.FC<DashboardProps> = ({ searchQuery, onAddToast }) => {
  const { user } = useAuth();

  const [files, setFiles] = useState<StorageFile[]>(INITIAL_FILES);
  const [folders] = useState<StorageFolder[]>(INITIAL_FOLDERS);
  const [currentTab, setCurrentTab] = useState<SidebarTab>('all');
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>('all');
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<StorageFile | null>(null);
  const [shareFile, setShareFile] = useState<StorageFile | null>(null);

  // Calculate storage usage
  const totalBytes = useMemo(() => {
    return files.reduce((acc, f) => acc + f.size, 0);
  }, [files]);

  const totalSizeFormatted = useMemo(() => {
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(totalBytes || 1) / Math.log(k));
    return parseFloat((totalBytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }, [totalBytes]);

  const usedPercentage = useMemo(() => {
    // 100 GB total
    const totalCapacity = 100 * 1024 * 1024 * 1024;
    const pct = (totalBytes / totalCapacity) * 100;
    return Math.max(parseFloat(pct.toFixed(1)), 18.4);
  }, [totalBytes]);

  // Filter files according to tab, category, active folder, and search query
  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      // Tab filter
      if (currentTab === 'starred' && !file.starred) return false;
      if (currentTab === 'shared' && !file.shared) return false;

      // Category filter
      if (selectedCategory !== 'all' && file.type !== selectedCategory) return false;

      // Folder filter
      if (activeFolderId && file.folderId !== activeFolderId) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          file.name.toLowerCase().includes(q) ||
          file.extension.toLowerCase().includes(q) ||
          file.type.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [files, currentTab, selectedCategory, activeFolderId, searchQuery]);

  const handleToggleStar = (fileId: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === fileId) {
          const starred = !f.starred;
          onAddToast(
            'info',
            starred ? 'Added to Starred' : 'Removed from Starred',
            `"${f.name}"`
          );
          return { ...f, starred };
        }
        return f;
      })
    );
  };

  const handleDeleteFile = (fileId: string) => {
    const target = files.find((f) => f.id === fileId);
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (target) {
      onAddToast('info', 'File Deleted', `Moved "${target.name}" to trash.`);
    }
  };

  const handleFilesUploaded = (newFiles: StorageFile[]) => {
    setFiles((prev) => [...newFiles, ...prev]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onTriggerUpload={() => setIsUploadOpen(true)}
          totalSizeFormatted={totalSizeFormatted}
          usedPercentage={Math.round(usedPercentage)}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 w-full space-y-6">
          {/* Top Overview & Metrics */}
          <StorageOverview
            totalFiles={files.length}
            totalSizeFormatted={totalSizeFormatted}
            sharedCount={files.filter((f) => f.shared).length}
            userName={user?.name || 'Vault Member'}
          />

          {/* Folder Grid */}
          <FolderGrid
            folders={folders}
            activeFolderId={activeFolderId}
            onSelectFolder={setActiveFolderId}
          />

          {/* Files List / Grid */}
          <FileList
            files={filteredFiles}
            onToggleStar={handleToggleStar}
            onPreviewFile={setPreviewFile}
            onShareFile={setShareFile}
            onDeleteFile={handleDeleteFile}
          />
        </main>
      </div>

      {/* Modals */}
      <UploadDropzone
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onFilesUploaded={handleFilesUploaded}
        onAddToast={onAddToast}
      />

      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
        onShare={setShareFile}
        onAddToast={onAddToast}
      />

      <ShareModal
        file={shareFile}
        onClose={() => setShareFile(null)}
        onAddToast={onAddToast}
      />
    </div>
  );
};
