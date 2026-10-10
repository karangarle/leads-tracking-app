import React, { useState, useEffect } from 'react';
import type { Lead, Note, PaginatedLeads } from './types';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { LeadTable } from './components/LeadTable';
import { Pagination } from './components/Pagination';
import { LeadModal } from './components/LeadModal';
import { LeadDetail } from './components/LeadDetail';
import { DeleteModal } from './components/DeleteModal';
import { ToastContainer } from './components/Toast';
import type { ToastMessage } from './components/Toast';

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

  // Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

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
      {/* Header */}
      <Header
        showNewLeadButton={!selectedLead}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />

      {/* Main Content */}
      {selectedLead ? (
        <LeadDetail
          lead={selectedLead}
          notes={selectedNotes}
          onBack={() => setSelectedLead(null)}
          onAddNote={handleAddNote}
          onEditLead={() => setEditingLead(selectedLead)}
          onDeleteLead={() => setDeletingLead(selectedLead)}
        />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Search & Filter Bar */}
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            onRefresh={() => fetchLeads(1)}
          />

          {/* Table & Pagination Container */}
          <div className="glass-panel overflow-hidden">
            <LeadTable
              leads={leads}
              loading={loading}
              error={error}
              onSelectLead={handleSelectLead}
              onEditLead={(lead) => setEditingLead(lead)}
              onDeleteLead={(lead) => setDeletingLead(lead)}
            />

            {!loading && leads.length > 0 && (
              <Pagination
                currentCount={leads.length}
                total={pagination.total}
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(page) => fetchLeads(page)}
              />
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

      {/* Delete Confirmation Modal */}
      {deletingLead && (
        <DeleteModal
          isOpen={true}
          onClose={() => setDeletingLead(null)}
          onConfirm={() => handleDeleteLead(deletingLead.id)}
          leadName={deletingLead.name}
          leadId={deletingLead.id}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default App;
