import React, { useState } from 'react';
import { useCMS } from '../../services/cmsStore';
import { PageId } from '../../types';
import {
  ShieldCheck,
  Edit3,
  Eye,
  Trash2,
  LayoutDashboard,
  LogOut,
  Sparkles,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Lock,
  X,
} from 'lucide-react';
import { TrashBinModal } from './TrashBinModal';

interface AdminLiveBarProps {
  onNavigate: (page: PageId) => void;
  onOpenQuickEditor: (section: 'hero' | 'footer' | 'socials' | 'events' | 'gallery') => void;
  onShowToast: (msg: string) => void;
}

export const AdminLiveBar: React.FC<AdminLiveBarProps> = ({
  onNavigate,
  onOpenQuickEditor,
  onShowToast,
}) => {
  const {
    isAuthenticated,
    isLiveEditMode,
    toggleLiveEditMode,
    logout,
    login,
    firebaseSyncStatus,
    getTrashItems,
  } = useCMS();

  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const trashCount = getTrashItems().length;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(pinInput);
    if (!ok) {
      setPinError(true);
    } else {
      setPinError(false);
      setPinInput('');
      setShowLoginModal(false);
      onShowToast('Signed in as Admin. In-page live editing is ready!');
    }
  };

  const handleToggleEdit = () => {
    const nextState = toggleLiveEditMode();
    onShowToast(
      nextState
        ? 'Live Edit Mode ENABLED: Hover or click edit triggers on any section.'
        : 'Live Edit Mode DISABLED: Previewing site as normal visitor.'
    );
  };

  // If not authenticated, render a discreet bottom-right access pill
  if (!isAuthenticated) {
    return (
      <>
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setShowLoginModal(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#0C1B2A]/90 hover:bg-[#162E4A] text-[#FAF8F5] border border-[#E59A1E]/40 shadow-xl backdrop-blur-md text-xs font-semibold hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            title="Institutional Content Management Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#E59A1E] group-hover:rotate-12 transition-transform" />
            <span>Admin</span>
          </button>
        </div>

        {/* Quick Admin Sign-In Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
            <div
              className="w-full max-w-sm bg-[#0C1B2A] border border-[#E59A1E]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-5 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-2xl bg-[#E59A1E]/15 border border-[#E59A1E]/30 text-[#F3A628]">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display">Admin Authentication</h3>
                <p className="text-xs text-slate-400">
                  Enter master PIN or institutional password to activate live customization.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <input
                    type="password"
                    autoFocus
                    placeholder="Enter PIN (e.g. 2026)"
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setPinError(false);
                    }}
                    className={`w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-center text-lg tracking-widest focus:outline-none transition-all ${
                      pinError
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500/50'
                        : 'border-white/10 focus:border-[#E59A1E] focus:ring-2 focus:ring-[#E59A1E]/30'
                    }`}
                  />
                  {pinError && (
                    <p className="text-red-400 text-xs mt-1.5 text-center">
                      Invalid credentials. Please verify your PIN.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F5B738] to-[#E59A1E] hover:from-[#FBC658] hover:to-[#F3A628] text-[#0C1B2A] font-bold text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  Unlock Admin Controls
                </button>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  // When Authenticated: Fixed Top/Bottom Floating Administration Dock
  return (
    <>
      <div className="fixed top-0 inset-x-0 z-50 bg-[#081320]/95 backdrop-blur-md border-b border-[#E59A1E]/30 shadow-2xl py-2 px-3 sm:px-6 text-xs text-slate-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          {/* Left: Admin Status & Cloud Persistence State */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-[#F3A628] uppercase tracking-wider text-[11px]">
              <ShieldCheck className="w-4 h-4 text-[#E59A1E]" />
              <span>Admin Active</span>
            </div>

            {/* Cloud Firestore Sync Status Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-300">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    firebaseSyncStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    firebaseSyncStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </span>
              <Cloud className="w-3 h-3 text-slate-400" />
              <span className="capitalize">{firebaseSyncStatus}</span>
            </div>
          </div>

          {/* Center: Live Edit Mode Switch */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleEdit}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                isLiveEditMode
                  ? 'bg-[#E59A1E] text-[#0C1B2A] shadow-md shadow-[#E59A1E]/30 ring-2 ring-[#E59A1E]/50'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              {isLiveEditMode ? (
                <>
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Live Edit: ON</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Edit: OFF</span>
                </>
              )}
            </button>

            {/* Quick Section Edit Shortcuts (visible when live edit is on) */}
            {isLiveEditMode && (
              <div className="hidden md:flex items-center gap-1">
                <button
                  onClick={() => onOpenQuickEditor('hero')}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
                >
                  Edit Hero
                </button>
                <button
                  onClick={() => onOpenQuickEditor('socials')}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
                >
                  Edit Socials
                </button>
                <button
                  onClick={() => onOpenQuickEditor('footer')}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
                >
                  Edit Footer
                </button>
              </div>
            )}
          </div>

          {/* Right: Trash Bin & Dashboard Shortcuts */}
          <div className="flex items-center gap-2">
            {/* Trash & Recovery Bin Button */}
            <button
              onClick={() => setIsTrashOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold transition-all cursor-pointer relative"
              title="Open Trash & Recovery Bin"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden xs:inline">Trash Bin</span>
              {trashCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-mono font-bold">
                  {trashCount}
                </span>
              )}
            </button>

            {/* Admin Dashboard */}
            <button
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#162E4A] hover:bg-[#1E3E64] border border-[#E59A1E]/30 text-[#F3A628] font-bold transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Trash & Recovery Bin Modal */}
      <TrashBinModal
        isOpen={isTrashOpen}
        onClose={() => setIsTrashOpen(false)}
        onShowToast={onShowToast}
      />
    </>
  );
};
