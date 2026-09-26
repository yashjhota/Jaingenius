import React, { useState } from 'react';
import { useCMS } from '../../services/cmsStore';
import { TrashItem } from '../../types';
import { ConfirmDialog } from './ConfirmDialog';
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  X,
  Share2,
  Calendar,
  Camera,
  Newspaper,
  MessageSquare,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface TrashBinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (msg: string) => void;
}

export const TrashBinModal: React.FC<TrashBinModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const { getTrashItems, restoreFromTrash, permanentlyDelete, emptyTrash } = useCMS();
  const [selectedModule, setSelectedModule] = useState<'all' | TrashItem['module']>('all');
  const [isConfirmingEmpty, setIsConfirmingEmpty] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TrashItem | null>(null);

  if (!isOpen) return null;

  const allTrash = getTrashItems();
  const filteredTrash = selectedModule === 'all'
    ? allTrash
    : allTrash.filter((item) => item.module === selectedModule);

  const handleRestore = async (item: TrashItem) => {
    setProcessingId(item.id);
    try {
      await restoreFromTrash(item.module, item.id);
      if (onShowToast) onShowToast(`Restored "${item.title.slice(0, 30)}" to live site.`);
    } finally {
      setProcessingId(null);
    }
  };

  const handlePermanentDelete = (item: TrashItem) => {
    setDeleteTarget(item);
  };

  const handleConfirmPermanentDelete = async () => {
    if (!deleteTarget) return;
    setProcessingId(deleteTarget.id);
    try {
      const deleted = await permanentlyDelete(deleteTarget.module, deleteTarget.id);
      if (!deleted) throw new Error('The trashed item could not be found.');
      if (onShowToast) onShowToast(`Permanently deleted "${deleteTarget.title.slice(0, 30)}" from cloud database.`);
      setDeleteTarget(null);
    } catch (error) {
      console.error('Failed to permanently delete trashed content:', error);
      if (onShowToast) onShowToast('Could not permanently delete this item. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleEmptyTrash = async () => {
    try {
      const count = await emptyTrash(selectedModule === 'all' ? undefined : selectedModule);
      setIsConfirmingEmpty(false);
      if (onShowToast) onShowToast(`Emptied trash (${count} items purged).`);
    } catch {
      // handled
    }
  };

  const getModuleIcon = (mod: TrashItem['module']) => {
    switch (mod) {
      case 'social':
        return <Share2 className="w-4 h-4 text-pink-400" />;
      case 'events':
        return <Calendar className="w-4 h-4 text-amber-400" />;
      case 'gallery':
        return <Camera className="w-4 h-4 text-emerald-400" />;
      case 'news':
        return <Newspaper className="w-4 h-4 text-blue-400" />;
      case 'testimonials':
        return <MessageSquare className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl max-h-[85vh] bg-[#0C1B2A] border border-[#E59A1E]/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#162E4A]/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                Trash & Recovery Bin
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 font-mono">
                  {allTrash.length} {allTrash.length === 1 ? 'item' : 'items'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Deleted content is securely preserved here. You can restore it to the live website or purge it permanently.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close trash modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters and Actions Bar */}
        <div className="px-6 py-3 border-b border-white/10 bg-[#081320] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setSelectedModule('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedModule === 'all'
                  ? 'bg-[#E59A1E] text-[#0C1B2A] font-bold'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              All ({allTrash.length})
            </button>
            <button
              onClick={() => setSelectedModule('social')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedModule === 'social'
                  ? 'bg-[#E59A1E] text-[#0C1B2A] font-bold'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Socials ({allTrash.filter((i) => i.module === 'social').length})
            </button>
            <button
              onClick={() => setSelectedModule('events')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedModule === 'events'
                  ? 'bg-[#E59A1E] text-[#0C1B2A] font-bold'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Events ({allTrash.filter((i) => i.module === 'events').length})
            </button>
            <button
              onClick={() => setSelectedModule('gallery')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedModule === 'gallery'
                  ? 'bg-[#E59A1E] text-[#0C1B2A] font-bold'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Gallery ({allTrash.filter((i) => i.module === 'gallery').length})
            </button>
            <button
              onClick={() => setSelectedModule('news')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedModule === 'news'
                  ? 'bg-[#E59A1E] text-[#0C1B2A] font-bold'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              News ({allTrash.filter((i) => i.module === 'news').length})
            </button>
            <button
              onClick={() => setSelectedModule('testimonials')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedModule === 'testimonials'
                  ? 'bg-[#E59A1E] text-[#0C1B2A] font-bold'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Stories ({allTrash.filter((i) => i.module === 'testimonials').length})
            </button>
          </div>

          {filteredTrash.length > 0 && (
            <div>
              {isConfirmingEmpty ? (
                <div className="flex items-center gap-2">
                  <span className="text-red-400 font-medium">Permanently purge?</span>
                  <button
                    onClick={handleEmptyTrash}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold cursor-pointer"
                  >
                    Confirm Empty
                  </button>
                  <button
                    onClick={() => setIsConfirmingEmpty(false)}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-slate-300 rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsConfirmingEmpty(true)}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-medium transition-colors cursor-pointer"
                >
                  Empty {selectedModule === 'all' ? 'All Trash' : `${selectedModule} Trash`}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Trashed Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {filteredTrash.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="inline-flex p-4 rounded-full bg-white/5 text-slate-500 mb-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500/70" />
              </div>
              <h3 className="text-lg font-bold text-white">Trash is Empty</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                No items in {selectedModule === 'all' ? 'any section' : selectedModule} are currently marked for deletion.
              </p>
            </div>
          ) : (
            filteredTrash.map((item) => (
              <div
                key={`${item.module}-${item.id}`}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 text-slate-300 uppercase tracking-wider font-mono">
                      {getModuleIcon(item.module)}
                      <span>{item.module}</span>
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      Trashed: {new Date(item.deletedAt).toLocaleString()}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-white truncate">
                    {item.title}
                  </h4>

                  {item.subtitle && (
                    <p className="text-xs text-slate-400 truncate">
                      {item.subtitle}
                    </p>
                  )}
                </div>

                {/* Actions: Restore & Permanent Purge */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={processingId === item.id}
                    onClick={() => handleRestore(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore to Site</span>
                  </button>

                  <button
                    type="button"
                    disabled={processingId === item.id}
                    onClick={() => handlePermanentDelete(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                    title="Permanently remove from cloud database"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Forever</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#162E4A]/40 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>
            Restored items immediately reappear on the live frontend across all visitor browsers.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Permanently Delete Trashed Content?"
        message="This will permanently erase this item from Cloud Firestore and local storage. This action cannot be undone."
        itemTitle={deleteTarget?.title}
        confirmLabel="Erase Forever"
        confirmVariant="danger"
        onConfirm={handleConfirmPermanentDelete}
        onCancel={() => setDeleteTarget(null)}
        isProcessing={Boolean(processingId)}
      />
    </div>
  );
};
