import React, { useState } from 'react';
import { useCMS } from '../../services/cmsStore';
import { TrashItem } from '../../types';
import { ConfirmDialog } from './ConfirmDialog';
import {
  Trash2,
  RotateCcw,
  Clock,
  Share2,
  Calendar,
  Camera,
  Newspaper,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

interface TrashManagerProps {
  showToast: (msg: string) => void;
}

export const TrashManager: React.FC<TrashManagerProps> = ({ showToast }) => {
  const { getTrashItems, restoreFromTrash, permanentlyDelete, emptyTrash } = useCMS();
  const [selectedModule, setSelectedModule] = useState<'all' | TrashItem['module']>('all');
  const [isConfirmingEmpty, setIsConfirmingEmpty] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TrashItem | null>(null);

  const allTrash = getTrashItems();
  const filteredTrash =
    selectedModule === 'all'
      ? allTrash
      : allTrash.filter((item) => item.module === selectedModule);

  const handleRestore = async (item: TrashItem) => {
    setProcessingId(item.id);
    try {
      await restoreFromTrash(item.module, item.id);
      showToast(`Restored "${item.title.slice(0, 30)}" to live website.`);
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
      showToast(`Permanently erased "${deleteTarget.title.slice(0, 30)}" from cloud database.`);
      setDeleteTarget(null);
    } catch (error) {
      console.error('Failed to permanently delete trashed content:', error);
      showToast('Could not permanently delete this item. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleEmptyTrash = async () => {
    try {
      const count = await emptyTrash(selectedModule === 'all' ? undefined : selectedModule);
      setIsConfirmingEmpty(false);
      showToast(`Emptied trash (${count} items permanently erased).`);
    } catch {}
  };

  const getModuleIcon = (mod: TrashItem['module']) => {
    switch (mod) {
      case 'social':
        return <Share2 className="w-4 h-4 text-pink-500" />;
      case 'events':
        return <Calendar className="w-4 h-4 text-amber-500" />;
      case 'gallery':
        return <Camera className="w-4 h-4 text-emerald-500" />;
      case 'news':
        return <Newspaper className="w-4 h-4 text-blue-500" />;
      case 'testimonials':
        return <MessageSquare className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Trash & Recovery Bin</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#0C1B2A] font-display">
            Trashed Content Archive
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Content removed from the public website is safely held here. You can inspect it, restore it to the live site with one click, or purge it permanently from Cloud Firestore.
          </p>
        </div>

        {allTrash.length > 0 && (
          <div className="shrink-0">
            {isConfirmingEmpty ? (
              <div className="flex items-center gap-2 bg-red-50 p-3 rounded-2xl border border-red-200">
                <span className="text-xs font-bold text-red-700">Are you sure?</span>
                <button
                  onClick={handleEmptyTrash}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Confirm Purge
                </button>
                <button
                  onClick={() => setIsConfirmingEmpty(false)}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsConfirmingEmpty(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
                <span>Empty All Trash ({allTrash.length})</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedModule('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedModule === 'all'
              ? 'bg-[#0C1B2A] text-white shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
          }`}
        >
          All Trashed Items ({allTrash.length})
        </button>
        <button
          onClick={() => setSelectedModule('social')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedModule === 'social'
              ? 'bg-[#0C1B2A] text-white shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
          }`}
        >
          Social Media ({allTrash.filter((i) => i.module === 'social').length})
        </button>
        <button
          onClick={() => setSelectedModule('events')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedModule === 'events'
              ? 'bg-[#0C1B2A] text-white shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
          }`}
        >
          Events ({allTrash.filter((i) => i.module === 'events').length})
        </button>
        <button
          onClick={() => setSelectedModule('gallery')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedModule === 'gallery'
              ? 'bg-[#0C1B2A] text-white shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
          }`}
        >
          Gallery ({allTrash.filter((i) => i.module === 'gallery').length})
        </button>
        <button
          onClick={() => setSelectedModule('news')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedModule === 'news'
              ? 'bg-[#0C1B2A] text-white shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
          }`}
        >
          News ({allTrash.filter((i) => i.module === 'news').length})
        </button>
        <button
          onClick={() => setSelectedModule('testimonials')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedModule === 'testimonials'
              ? 'bg-[#0C1B2A] text-white shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
          }`}
        >
          Testimonials ({allTrash.filter((i) => i.module === 'testimonials').length})
        </button>
      </div>

      {/* Trashed Items List */}
      <div className="space-y-3">
        {filteredTrash.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No items in {selectedModule === 'all' ? 'Trash' : `${selectedModule} Trash`}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Whenever you remove a social post, event, or gallery capture from the frontend, it will appear here with an instant restore option.
            </p>
          </div>
        ) : (
          filteredTrash.map((item) => (
            <div
              key={`${item.module}-${item.id}`}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-[#E59A1E]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                    {getModuleIcon(item.module)}
                    <span>{item.module}</span>
                  </span>
                  <span className="text-slate-400 flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Deleted {new Date(item.deletedAt).toLocaleString()}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {item.title}
                </h4>

                {item.subtitle && (
                  <p className="text-xs text-slate-500 truncate">
                    {item.subtitle}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={processingId === item.id}
                  onClick={() => handleRestore(item)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Restore to Website</span>
                </button>

                <button
                  type="button"
                  disabled={processingId === item.id}
                  onClick={() => handlePermanentDelete(item)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                  title="Purge permanently from cloud database"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Forever</span>
                </button>
              </div>
            </div>
          ))
        )}
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
