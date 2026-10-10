import React from 'react';
import { Icon } from '@iconify/react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  leadName?: string;
  leadId?: number;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  leadName,
  leadId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-panel rounded-xl w-full max-w-md p-6 relative shadow-2xl border border-rose-500/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
            <Icon icon="material-symbols:warning-outline-rounded" width="24" height="24" className="text-rose-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Delete Lead</h3>
            <p className="text-xs text-gray-400">This action cannot be undone.</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm text-gray-200 leading-relaxed">
            Are you sure you want to delete lead <span className="font-semibold text-white">{leadName ? `"${leadName}"` : 'record'}</span> {leadId ? <span className="text-gray-400 font-mono">(ID: #{leadId})</span> : ''}?
          </p>

          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-300 flex items-start gap-2">
            <Icon icon="material-symbols:warning-outline-rounded" width="16" height="16" className="text-rose-400 shrink-0 mt-0.5" />
            <span><strong>Warning:</strong> Deleting this lead will permanently erase all associated activity notes and contact history.</span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-medium text-sm transition-all shadow-lg shadow-rose-600/30"
          >
            Delete Lead
          </button>
        </div>
      </div>
    </div>
  );
};
