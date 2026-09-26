import React from 'react';
import { AlertTriangle, Trash2, X, Archive, Check } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemTitle?: string;
  confirmLabel?: string;
  confirmVariant?: 'danger' | 'warning' | 'primary';
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  itemTitle,
  confirmLabel = 'Delete Permanently',
  confirmVariant = 'danger',
  secondaryActionLabel,
  onSecondaryAction,
  onConfirm,
  onCancel,
  isProcessing = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="w-full max-w-md bg-[#0C1B2A] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl text-white relative animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-400">
            <Trash2 className="w-6 h-6" />
          </div>
          <div className="min-w-0 pr-4">
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">{title}</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        {itemTitle && (
          <div className="bg-[#081320] border border-white/10 rounded-xl p-3 mb-5 text-xs text-slate-300 font-mono line-clamp-2">
            "{itemTitle}"
          </div>
        )}

        <div className="flex flex-col sm:flex-row-reverse gap-2 pt-2">
          {onSecondaryAction && secondaryActionLabel && (
            <button
              type="button"
              onClick={onSecondaryAction}
              disabled={isProcessing}
              className="w-full sm:w-auto flex-1 px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>{secondaryActionLabel}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`w-full sm:w-auto flex-1 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              confirmVariant === 'danger'
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-[#E59A1E] hover:bg-[#F3A628] text-[#0C1B2A]'
            }`}
          >
            {isProcessing ? (
              <span className="animate-spin text-sm">⏳</span>
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            <span>{confirmLabel}</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
