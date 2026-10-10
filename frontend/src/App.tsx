import React, { useState, useEffect } from 'react';
import type { Lead, Note, PaginatedLeads } from './types';
import { LeadModal } from './components/LeadModal';
import { LeadDetail } from './components/LeadDetail';
import { Search, Plus, RefreshCw, ChevronLeft, ChevronRight, Eye, Trash2, Edit3, Layers } from 'lucide-react';

export const App: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      throw new Error(err.error || 'Failed to create lead');
    }

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
      throw new Error(err.error || 'Failed to update lead');
    }

    const updated = await res.json();
    if (selectedLead && selectedLead.id === updated.id) {
      setSelectedLead(updated);
    }

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

      await fetchLeads(pagination.page);
    } catch (err: any) {
      alert(err.message || 'Error deleting lead');
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
      throw new Error(err.error || 'Failed to add note');
    }

    await fetchNotesForLead(selectedLead.id);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Navbar Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)'
          }}>
            <Layers size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              LeadTrack Portal
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Enterprise Lead Management & CRM System</p>
          </div>
        </div>

        {!selectedLead && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.3rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.9rem',
              boxShadow: '0 4px 14px rgba(139, 92, 246, 0.3)'
            }}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Search & Filter Bar */}
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search leads by name, email, or phone..."
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                  backgroundColor: 'rgba(17, 24, 39, 0.8)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.65rem 1rem',
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '0.9rem'
              }}
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
            </select>

            <button
              onClick={() => fetchLeads(1)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.65rem 1rem',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-secondary)',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                fontSize: '0.9rem'
              }}
            >
              <RefreshCw size={16} /> Refresh
            </button>
          </div>

          {/* Table Container */}
          <div className="glass-panel" style={{ overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading leads...</div>
            ) : error ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#f87171' }}>{error}</div>
            ) : leads.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No leads found matching your query.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(17, 24, 39, 0.5)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '1rem' }}>ID</th>
                    <th style={{ padding: '1rem' }}>Name</th>
                    <th style={{ padding: '1rem' }}>Contact Details</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Created</th>
                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>#{lead.id}</td>
                      <td style={{ padding: '1rem', fontWeight: 600, color: '#fff' }}>{lead.name}</td>
                      <td style={{ padding: '1rem' }}>
                        <div>{lead.email}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{lead.phone}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge badge-${lead.status}`}>{lead.status}</span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleSelectLead(lead)}
                            title="View Details & Notes"
                            style={{
                              padding: '0.4rem 0.6rem',
                              backgroundColor: 'rgba(59, 130, 246, 0.15)',
                              color: '#60a5fa',
                              borderRadius: '6px',
                              border: '1px solid rgba(59, 130, 246, 0.3)'
                            }}
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => setEditingLead(lead)}
                            title="Edit Lead"
                            style={{
                              padding: '0.4rem 0.6rem',
                              backgroundColor: 'rgba(245, 158, 11, 0.15)',
                              color: '#fbbf24',
                              borderRadius: '6px',
                              border: '1px solid rgba(245, 158, 11, 0.3)'
                            }}
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            title="Delete Lead"
                            style={{
                              padding: '0.4rem 0.6rem',
                              backgroundColor: 'rgba(239, 68, 68, 0.15)',
                              color: '#f87171',
                              borderRadius: '6px',
                              border: '1px solid rgba(239, 68, 68, 0.3)'
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pagination Controls */}
            {!loading && leads.length > 0 && (
              <div style={{
                padding: '1rem 1.25rem',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'rgba(17, 24, 39, 0.4)'
              }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Showing {leads.length} of {pagination.total} leads (Page {pagination.page} of {pagination.totalPages})
                </span>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => fetchLeads(pagination.page - 1)}
                    style={{
                      padding: '0.4rem 0.8rem',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-secondary)',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      opacity: pagination.page <= 1 ? 0.5 : 1
                    }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => fetchLeads(pagination.page + 1)}
                    style={{
                      padding: '0.4rem 0.8rem',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-secondary)',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      opacity: pagination.page >= pagination.totalPages ? 0.5 : 1
                    }}
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
    </div>
  );
};

export default App;
