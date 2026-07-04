import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Premium in-app confirmation modal to replace native browser confirm().
 * Uses keyboard accessible trap and animated entrance.
 */
export function ConfirmModal({ isOpen, onConfirm, onCancel, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = true }) {
  // Keyboard handling: Escape to cancel, Enter to confirm
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onConfirm, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}
    >
      <div
        className="bg-card border border-border/60 rounded-2xl shadow-2xl p-6 max-w-sm w-full space-y-5 animate-scale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${danger ? 'bg-red-500/10' : 'bg-primary/10'}`}>
              <AlertTriangle className={`h-5 w-5 ${danger ? 'text-red-500' : 'text-primary'}`} />
            </div>
            <h3 className="text-sm font-bold text-foreground leading-tight">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/20 shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message */}
        <p className="text-xs text-muted-foreground leading-relaxed pl-12">{message}</p>

        {/* Actions */}
        <div className="flex justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-border/60 text-xs font-semibold text-muted-foreground hover:bg-muted/10 transition-all"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all ${
              danger
                ? 'bg-red-500 hover:bg-red-600 active:scale-[0.98]'
                : 'bg-primary hover:bg-primary/90 active:scale-[0.98]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
