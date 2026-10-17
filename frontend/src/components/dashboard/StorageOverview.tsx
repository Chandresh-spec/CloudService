import React from 'react';
import { Files, HardDrive, Share2, ShieldCheck } from 'lucide-react';

interface StorageOverviewProps {
  totalFiles: number;
  totalSizeFormatted: string;
  sharedCount: number;
  userName: string;
}

export const StorageOverview: React.FC<StorageOverviewProps> = ({
  totalFiles,
  totalSizeFormatted,
  sharedCount,
  userName,
}) => {
  const cards = [
    {
      title: 'Total Cloud Files',
      value: `${totalFiles} items`,
      subtext: '+4 added today',
      icon: Files,
      color: 'from-indigo-600/20 to-indigo-500/10 text-indigo-400 border-indigo-500/20',
      badgeColor: 'text-indigo-300 bg-indigo-500/10',
    },
    {
      title: 'Vault Storage',
      value: totalSizeFormatted,
      subtext: 'of 100 GB Allocated',
      icon: HardDrive,
      color: 'from-cyan-600/20 to-cyan-500/10 text-cyan-400 border-cyan-500/20',
      badgeColor: 'text-cyan-300 bg-cyan-500/10',
    },
    {
      title: 'Active Shared Links',
      value: `${sharedCount} links`,
      subtext: 'End-to-end encrypted',
      icon: Share2,
      color: 'from-violet-600/20 to-violet-500/10 text-violet-400 border-violet-500/20',
      badgeColor: 'text-violet-300 bg-violet-500/10',
    },
    {
      title: 'Account Security',
      value: 'OTP 2FA Active',
      subtext: 'Zero-Knowledge Guard',
      icon: ShieldCheck,
      color: 'from-emerald-600/20 to-emerald-500/10 text-emerald-400 border-emerald-500/20',
      badgeColor: 'text-emerald-300 bg-emerald-500/10',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-slate-900/60 border border-indigo-500/20 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Welcome to CloudVault, {userName}
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Your encrypted files are synchronized in real-time across your connected devices.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <span className="text-xs text-slate-400">Sync Status:</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Synchronized (24ms)
          </span>
        </div>

        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`p-4 rounded-2xl glass-card border bg-gradient-to-br ${card.color} flex items-center justify-between hover:border-slate-600/50 transition-all`}
            >
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium">{card.title}</span>
                <p className="text-lg font-bold text-white tracking-tight">{card.value}</p>
                <p className="text-[11px] text-slate-400">{card.subtext}</p>
              </div>

              <div className={`p-3 rounded-2xl border ${card.color} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
