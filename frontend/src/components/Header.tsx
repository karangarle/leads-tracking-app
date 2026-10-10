import React from 'react';
import { Icon } from '@iconify/react';

interface HeaderProps {
  showNewLeadButton: boolean;
  onOpenCreateModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ showNewLeadButton, onOpenCreateModal }) => {
  return (
    <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 sm:mb-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-[10px] bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/40 shrink-0">
          <Icon icon="material-symbols:layers-outline-rounded" className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            LeadTrack Portal
          </h1>
          <p className="text-xs text-gray-400">Enterprise Lead Management & CRM System</p>
        </div>
      </div>

      {showNewLeadButton && (
        <button
          onClick={onOpenCreateModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-tr from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-500/30"
        >
          <Icon icon="material-symbols:add-rounded" className="w-5 h-5" /> New Lead
        </button>
      )}
    </header>
  );
};
