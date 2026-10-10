import React from 'react';
import { Icon } from '@iconify/react';

interface PaginationProps {
  currentCount: number;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentCount,
  total,
  page,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="px-4 sm:px-5 py-4 border-t border-brand-border flex flex-col sm:flex-row gap-3 sm:justify-between items-center bg-brand-secondary/40">
      <span className="text-xs text-gray-400">
        Showing {currentCount} of {total} leads (Page {page} of {totalPages})
      </span>

      <div className="flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="p-1.5 bg-brand-card hover:bg-brand-hover text-gray-400 rounded-md border border-brand-border disabled:opacity-50 transition-colors"
        >
          <Icon icon="material-symbols:chevron-left-rounded" className="w-4 h-4" />
        </button>
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="p-1.5 bg-brand-card hover:bg-brand-hover text-gray-400 rounded-md border border-brand-border disabled:opacity-50 transition-colors"
        >
          <Icon icon="material-symbols:chevron-right-rounded" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
