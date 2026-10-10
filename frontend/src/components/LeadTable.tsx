import React from 'react';
import type { Lead } from '../types';
import { StatusBadge } from './StatusBadge';
import { Icon } from '@iconify/react';

interface LeadTableProps {
  leads: Lead[];
  loading: boolean;
  error: string;
  onSelectLead: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (lead: Lead) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  loading,
  error,
  onSelectLead,
  onEditLead,
  onDeleteLead,
}) => {
  if (loading) {
    return <div className="p-12 text-center text-gray-400">Loading leads...</div>;
  }

  if (error) {
    return <div className="p-12 text-center text-rose-400">{error}</div>;
  }

  if (leads.length === 0) {
    return <div className="p-12 text-center text-gray-400">No leads found matching your query.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-brand-border bg-brand-secondary/50 text-gray-400 font-medium">
            <th className="p-4">ID</th>
            <th className="p-4">Name</th>
            <th className="p-4">Contact Details</th>
            <th className="p-4">Status</th>
            <th className="p-4">Created</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-border">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-brand-hover/40 transition-colors">
              <td className="p-4 text-gray-400">#{lead.id}</td>
              <td className="p-4 font-semibold text-white">{lead.name}</td>
              <td className="p-4">
                <div className="text-gray-100">{lead.email}</div>
                <div className="text-xs text-gray-400">{lead.phone}</div>
              </td>
              <td className="p-4">
                <StatusBadge status={lead.status} />
              </td>
              <td className="p-4 text-gray-400 text-xs">
                {new Date(lead.createdAt).toLocaleDateString()}
              </td>
              <td className="p-4 text-right">
                <div className="inline-flex gap-2">
                  <button
                    onClick={() => onSelectLead(lead)}
                    title="View Details & Notes"
                    className="p-1.5 bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 rounded-md border border-blue-500/30 transition-colors"
                  >
                    <Icon icon="material-symbols:visibility-outline-rounded" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEditLead(lead)}
                    title="Edit Lead"
                    className="p-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 rounded-md border border-amber-500/30 transition-colors"
                  >
                    <Icon icon="material-symbols:edit-outline-rounded" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteLead(lead)}
                    title="Delete Lead"
                    className="p-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 rounded-md border border-rose-500/30 transition-colors"
                  >
                    <Icon icon="material-symbols:delete-outline-rounded" className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
