import React from 'react';
import { Icon } from '@iconify/react';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  onRefresh: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onRefresh,
}) => {
  return (
    <div className="glass-panel p-5 flex gap-4 flex-wrap items-center">
      <div className="flex-1 min-w-[240px] relative">
        <Icon icon="material-symbols:search-rounded" className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search leads by name, email, or phone..."
          className="w-full pl-9 pr-3.5 py-2.5 bg-brand-secondary/80 border border-brand-border rounded-md text-white text-sm focus:border-purple-500 transition-colors"
        />
      </div>

      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-4 py-2.5 bg-brand-secondary/90 border border-brand-border rounded-md text-white text-sm focus:border-purple-500 cursor-pointer transition-colors"
      >
        <option value="">All Statuses</option>
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="qualified">Qualified</option>
        <option value="lost">Lost</option>
      </select>

      <button
        onClick={onRefresh}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-card hover:bg-brand-hover text-gray-400 rounded-md border border-brand-border text-sm font-medium transition-colors"
      >
        <Icon icon="material-symbols:refresh-rounded" className="w-4 h-4" /> Refresh
      </button>
    </div>
  );
};
