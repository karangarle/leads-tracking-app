import React, { useState, useEffect } from 'react';
import type { Lead, Note, PaginatedLeads } from './types';
import { LeadModal } from './components/LeadModal';
import { LeadDetail } from './components/LeadDetail';
import { ToastContainer } from './components/Toast';
import type { ToastMessage } from './components/Toast';
import { Search, Plus, RefreshCw, ChevronLeft, ChevronRight, Eye, Trash2, Edit3, Layers } from 'lucide-react';

export const App: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Selected Lead State
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedNotes, setSelectedNotes] = useState<Note[]>([]);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const fetchLeads = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search,
        status: statusFilter,
      });

      const res = await fetch(`/api/leads?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch leads');

      const data: PaginatedLeads = await res.json();
      setLeads(data.data);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || 'Error loading leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(1);
  }, [search, statusFilter]);

  const fetchNotesForLead = async (leadId: number) => {
    try {
      const res = await fetch(`/api/leads/${leadId}/notes`);
      if (!res.ok) throw new Error('Failed to fetch notes');
      const data = await res.json();
      setSelectedNotes(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleSelectLead = async (lead: Lead) => {
    setSelectedLead(lead);
    await fetchNotesForLead(lead.id);
  };

  const handleCreateLead = async (data: { name: string; email: string; phone: string; status: string }) => {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      const msg = err.error || 'Failed to create lead';
      addToast('error', msg);
      throw new Error(msg);
    }

    const created = await res.json();
    addToast('success', `Lead "${created.name}" created successfully!`);
    await fetchLeads(pagination.page);
  };

  const handleUpdateLead = async (data: { name: string; email: string; phone: string; status: string }) => {
    if (!editingLead) return;

    const res = await fetch(`/api/leads/${editingLead.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      const msg = err.error || 'Failed to update lead';
      addToast('error', msg);
      throw new Error(msg);
    }

    const updated = await res.json();
    if (selectedLead && selectedLead.id === updated.id) {
      setSelectedLead(updated);
    }

    addToast('success', `Lead #${updated.id} updated successfully!`);
    setEditingLead(null);
    await fetchLeads(pagination.page);
  };

  const handleDeleteLead = async (leadId: number) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;

    try {
      const res = await fetch(`/api/leads/${leadId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete lead');

      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(null);
      }

      addToast('success', `Lead #${leadId} deleted successfully!`);
      await fetchLeads(pagination.page);
    } catch (err: any) {
      addToast('error', err.message || 'Error deleting lead');
    }
  };

  const handleAddNote = async (content: string) => {
    if (!selectedLead) return;

    const res = await fetch(`/api/leads/${selectedLead.id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      const err = await res.json();
      const msg = err.error || 'Failed to add note';
      addToast('error', msg);
      throw new Error(msg);
    }

    addToast('success', 'New note added to lead!');
    await fetchNotesForLead(selectedLead.id);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      {/* Navbar Header */}
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/40">
            <Layers size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              LeadTrack Portal
            </h1>
            <p className="text-xs text-gray-400">Enterprise Lead Management & CRM System</p>
          </div>
        </div>

        {!selectedLead && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-tr from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-500/30"
          >
            <Plus size={18} /> New Lead
          </button>
        )}
      </header>

      {/* Main Content Area */}
      {selectedLead ? (
        <LeadDetail
          lead={selectedLead}
          notes={selectedNotes}
          onBack={() => setSelectedLead(null)}
          onAddNote={handleAddNote}
          onEditLead={() => setEditingLead(selectedLead)}
          onDeleteLead={() => handleDeleteLead(selectedLead.id)}
        />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Search & Filter Bar */}
          <div className="glass-panel p-5 flex gap-4 flex-wrap items-center">
            <div className="flex-1 min-w-[240px] relative">
              <Search size={18} className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search leads by name, email, or phone..."
                className="w-full pl-9 pr-3.5 py-2.5 bg-brand-secondary/80 border border-brand-border rounded-md text-white text-sm focus:border-purple-500 transition-colors"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-brand-secondary/90 border border-brand-border rounded-md text-white text-sm focus:border-purple-500 cursor-pointer transition-colors"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
            </select>

            <button
              onClick={() => fetchLeads(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-brand-card hover:bg-brand-hover text-gray-400 rounded-md border border-brand-border text-sm font-medium transition-colors"
            >
              <RefreshCw size={16} /> Refresh
            </button>
          </div>

          {/* Table Container */}
          <div className="glass-panel overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-400">Loading leads...</div>
            ) : error ? (
              <div className="p-12 text-center text-rose-400">{error}</div>
            ) : leads.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                No leads found matching your query.
              </div>
            ) : (
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
                      <tr
                        key={lead.id}
                        className="hover:bg-brand-hover/40 transition-colors"
                      >
                        <td className="p-4 text-gray-400">#{lead.id}</td>
                        <td className="p-4 font-semibold text-white">{lead.name}</td>
                        <td className="p-4">
                          <div className="text-gray-100">{lead.email}</div>
                          <div className="text-xs text-gray-400">{lead.phone}</div>
                        </td>
                        <td className="p-4">
                          <span className={`badge badge-${lead.status}`}>{lead.status}</span>
                        </td>
                        <td className="p-4 text-gray-400 text-xs">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => handleSelectLead(lead)}
                              title="View Details & Notes"
                              className="p-1.5 bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 rounded-md border border-blue-500/30 transition-colors"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => setEditingLead(lead)}
                              title="Edit Lead"
                              className="p-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 rounded-md border border-amber-500/30 transition-colors"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              title="Delete Lead"
                              className="p-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 rounded-md border border-rose-500/30 transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && leads.length > 0 && (
              <div className="px-5 py-4 border-t border-brand-border flex justify-between items-center bg-brand-secondary/40">
                <span className="text-xs text-gray-400">
                  Showing {leads.length} of {pagination.total} leads (Page {pagination.page} of {pagination.totalPages})
                </span>

                <div className="flex gap-2">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => fetchLeads(pagination.page - 1)}
                    className="p-1.5 bg-brand-card hover:bg-brand-hover text-gray-400 rounded-md border border-brand-border disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => fetchLeads(pagination.page + 1)}
                    className="p-1.5 bg-brand-card hover:bg-brand-hover text-gray-400 rounded-md border border-brand-border disabled:opacity-50 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Lead Modal */}
      <LeadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateLead}
        title="Create New Lead"
      />

      {/* Edit Lead Modal */}
      {editingLead && (
        <LeadModal
          isOpen={true}
          onClose={() => setEditingLead(null)}
          onSubmit={handleUpdateLead}
          initialData={{
            name: editingLead.name,
            email: editingLead.email,
            phone: editingLead.phone,
            status: editingLead.status,
          }}
          title={`Edit Lead #${editingLead.id}`}
        />
      )}
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default App;
