import React, { useState } from 'react';
import type { Lead, Note } from '../types';
import { ArrowLeft, Mail, Phone, Clock, Plus, Trash2, Edit3, MessageSquare } from 'lucide-react';

interface LeadDetailProps {
  lead: Lead;
  notes: Note[];
  onBack: () => void;
  onAddNote: (content: string) => Promise<void>;
  onEditLead: () => void;
  onDeleteLead: () => void;
}

export const LeadDetail: React.FC<LeadDetailProps> = ({
  lead,
  notes,
  onBack,
  onAddNote,
  onEditLead,
  onDeleteLead,
}) => {
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noteError, setNoteError] = useState('');

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) {
      setNoteError('Note content cannot be empty');
      return;
    }
    setNoteError('');
    setIsSubmitting(true);
    try {
      await onAddNote(newNote.trim());
      setNewNote('');
    } catch (err: any) {
      setNoteError(err.message || 'Failed to add note');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-secondary)',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            fontSize: '0.9rem'
          }}
        >
          <ArrowLeft size={16} /> Back to Leads
        </button>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onEditLead}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              color: '#60a5fa',
              borderRadius: '6px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              fontSize: '0.875rem'
            }}
          >
            <Edit3 size={15} /> Edit Lead
          </button>
          <button
            onClick={onDeleteLead}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              borderRadius: '6px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontSize: '0.875rem'
            }}
          >
            <Trash2 size={15} /> Delete
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem' }}>
        {/* Left Column: Lead Info */}
        <div className="glass-panel" style={{ padding: '1.75rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#fff' }}>{lead.name}</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ID: #{lead.id}</span>
            </div>
            <span className={`badge badge-${lead.status}`}>{lead.status}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Mail size={18} color="var(--accent-cyan)" />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Email</p>
                <p style={{ fontSize: '0.95rem', color: '#fff' }}>{lead.email}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Phone size={18} color="var(--accent-purple)" />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Phone</p>
                <p style={{ fontSize: '0.95rem', color: '#fff' }}>{lead.phone}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock size={18} color="var(--accent-blue)" />
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Created At</p>
                <p style={{ fontSize: '0.95rem', color: '#fff' }}>{new Date(lead.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Notes & Activity */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Notes & Activity Timeline</h3>
            <span style={{
              marginLeft: 'auto',
              fontSize: '0.8rem',
              backgroundColor: 'rgba(255,255,255,0.06)',
              padding: '0.2rem 0.6rem',
              borderRadius: '12px'
            }}>
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </span>
          </div>

          {/* Add Note Form */}
          <form onSubmit={handleNoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {noteError && (
              <div style={{ fontSize: '0.8rem', color: '#f87171' }}>{noteError}</div>
            )}
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a detailed note or activity update..."
              rows={3}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                color: '#fff',
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 1.2rem',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                <Plus size={16} /> Add Note
              </button>
            </div>
          </form>

          {/* Notes List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            {notes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                No notes added yet for this lead. Use the form above to add the first note!
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    backgroundColor: 'rgba(17, 24, 39, 0.5)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '1rem'
                  }}
                >
                  <p style={{ fontSize: '0.95rem', color: '#e5e7eb', marginBottom: '0.5rem', whiteSpace: 'pre-wrap' }}>
                    {note.content}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={12} /> {new Date(note.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
